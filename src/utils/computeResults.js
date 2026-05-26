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

  const load     = calcLoad(state, applianceData, tariffData, fuelPrices, genData);
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
