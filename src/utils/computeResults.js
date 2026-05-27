import { getState, setState, getData } from '../state.js';
import { calcLoad } from './calcLoad.js';
import { calcSolar } from './calcSolar.js';
import { calcBattery } from './calcBattery.js';
import { calcDispatch } from './calcDispatch.js';
import { calcSavings } from './calcSavings.js';

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

  const load     = calcLoad(cleanState, applianceData, tariffData, fuelPrices, genData);
  const solar    = calcSolar(load, state.location);
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
