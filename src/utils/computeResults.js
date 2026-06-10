import { getState, setState, getData } from '../state.js';
import { calcLoad } from './calcLoad.js';
import { calcSolar } from './calcSolar.js';
import { calcBattery } from './calcBattery.js';
import { calcDispatch } from './calcDispatch.js';
import { calcSavings } from './calcSavings.js';

// Base-case appliance list for inverter sizing only (bungalow, 9 rooms).
// Used as a floor so the inverter is never undersized due to missing user input.
// Does NOT affect load profile, battery, or savings calculations.
const INVERTER_BASE_CASE = [
  { name: 'Split AC – 1HP',              qty: 1  },
  { name: 'Ceiling Fan',                      qty: 3  },
  { name: 'LED Bulb (9W)',                    qty: 18 }, // 9 rooms × 2
  { name: 'LED Bulb (15W)',                   qty: 9  }, // 9 rooms × 1
  { name: 'Security Light (floodlight)',      qty: 5  },
  { name: 'Refrigerator (200L)',              qty: 1  },
  { name: 'LED TV – 43"',               qty: 2  },
  { name: 'DSTV Decoder',                     qty: 1  },
  { name: 'Wi-Fi Router',                     qty: 1  },
  { name: 'Phone Charger',                    qty: 2  },
  { name: 'CCTV System (4 cameras)',          qty: 1  },
];

function calcBaseCasePeakKW(applianceData) {
  const appMap = Object.fromEntries(applianceData.map(a => [a.name, a]));
  return INVERTER_BASE_CASE.reduce((sum, item) => {
    const def = appMap[item.name];
    return sum + (def ? (def.rated_watts * item.qty) / 1000 : 0);
  }, 0);
}

export function computeResults() {
  const state = getState();
  const applianceData = getData('appliances')           || [];
  const tariffData    = getData('tariff_bands')         || [];
  const fuelPrices    = getData('fuel_prices')          || [];
  const genData       = getData('generator_efficiency') || [];

  // Strip stale customSchedule rows for appliances no longer in the full list
  const currentNames = new Set((state.appliances || []).map(a => a.name));

  // If the user has narrowed solar coverage via the interactive profile, size the
  // system for only those appliances. null means "cover everything".
  const solarNames = state.solarAppliances
    ? new Set(state.solarAppliances)
    : currentNames;

  const cleanState = {
    ...state,
    appliances: (state.appliances || []).filter(a => solarNames.has(a.name)),
    customSchedule: state.customSchedule
      ? state.customSchedule.filter(row => solarNames.has(row.name))
      : null,
  };

  const load            = calcLoad(cleanState, applianceData, tariffData, fuelPrices, genData);
  const baseCasePeakKW  = calcBaseCasePeakKW(applianceData);
  const solar           = calcSolar(load, state.location, baseCasePeakKW);
  const battery  = calcBattery(load, state.goal, state.backupHours);
  const dispatch = calcDispatch({
    hourlyProfile: load.hourlyProfile,
    pvKWp:         solar.panel_kwp,
    batteryKWh:    battery.battery_kwh,
    dailyYield:    state.location?.daily_yield_kwh_per_kwp || 4.5,
    energyMix:     state.powerSource,
  });
  const savings = calcSavings({ load, solar, battery, dispatch, tariffData, fuelPrices, genData, state });

  setState({ results: { load, solar, battery, dispatch, savings } });
}
