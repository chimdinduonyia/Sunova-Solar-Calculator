const _state = {
  location: null,
  powerSource: null,
  tariffBand: null,
  gridSpend: 100000,
  fuelSpend: 50000,
  generatorSize: null,
  goal: null,
  backupHours: 4,
  reportPersona: null,   // 'savings' | 'autonomy'
  budget: 1500000,
  results: null,

  // Appliance selection (optional bottom-up load basis — overrides the
  // bill-based estimate when populated; see calcLoad.js)
  appliances: [],        // [{name, category, rated_watts, typical_daily_hours, daily_wh, qty}]
  customSchedule: null,  // [{name, category, segments: [{start, end}]}] — Gantt duty cycle per appliance
  usagePattern: null,    // last-selected preset name from usage_patterns.json
  houseType: null,       // 'bungalow' | 'duplex' | 'terrace'
  rooms: 0,               // number of bedrooms (scales default LED bulb count)
  solarAppliances: null,  // Set/array of names, or null = everything — Interactive Profile's live subset filter
  // Which version of the smart report to compute/show once appliances exist:
  // 'full' = whole-home load, ignoring added appliances entirely
  // 'essentials' = scoped to the added/selected appliances only
  reportBasis: 'essentials',

  _data: {}
};

const _listeners = new Set();

export function getState() {
  return { ..._state };
}

export function setState(patch) {
  Object.assign(_state, patch);
  _listeners.forEach(fn => fn({ ..._state }));
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function getData(key) {
  return _state._data[key] || null;
}

export function setData(key, value) {
  _state._data[key] = value;
}
