import { getState, setState, getData } from '../state.js';
import { calcLoad }     from './calcLoad.js';
import { calcSolar }    from './calcSolar.js';
import { calcBattery }  from './calcBattery.js';
import { calcDispatch } from './calcDispatch.js';
import { calcSavings }  from './calcSavings.js';

export function computeResults() {
  const rawState = getState();
  const tariffData = getData('tariff_bands')         || [];
  const fuelPrices = getData('fuel_prices')          || [];
  const genData    = getData('generator_efficiency') || [];

  const state = applySolarApplianceFilter(rawState);
  const load    = calcLoad(state, tariffData, fuelPrices, genData);
  const battery = calcBattery(load, state.goal, state.backupHours);
  const solar   = calcSolar(load, state.location, state.goal, battery.battery_kwh);
  const dispatch = calcDispatch({
    hourlyProfile: load.hourlyProfile,
    pvKWp:         solar.panel_kwp,
    batteryKWh:    battery.battery_kwh,
    dailyYield:    state.location?.daily_yield_kwh_per_kwp || 4.5,
    energyMix:     state.powerSource,
  });
  const savings = calcSavings({ load, solar, battery, dispatch, tariffData, fuelPrices, genData, state });

  setState({ results: { load, solar, battery, dispatch, savings, inverter_battery_only: false } });
}

// `solarAppliances` (Set of names, or null = everything) lets the user
// narrow sizing down to a subset of their full appliance list from the
// Interactive Profile checklist, without losing the full list itself.
//
// `reportBasis` ('full' | 'essentials') is the smart-report toggle: once
// appliances have been added, "Full Load" sizes for the whole home exactly
// as if no appliances had been entered (bill-based), while "Essentials
// Only" scopes everything to the appliances the user picked. Both read
// from the same stored appliance list, so switching back and forth never
// loses the user's selections.
function applySolarApplianceFilter(state) {
  if (state.reportBasis === 'full' && state.appliances?.length) {
    return { ...state, appliances: [], customSchedule: null };
  }

  if (!state.solarAppliances || !state.appliances?.length) return state;
  const active = new Set(state.solarAppliances);
  return {
    ...state,
    appliances: state.appliances.filter(a => active.has(a.name)),
    customSchedule: state.customSchedule
      ? state.customSchedule.filter(row => active.has(row.name))
      : null,
  };
}
