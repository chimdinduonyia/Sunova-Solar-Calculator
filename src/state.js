const _state = {
  location: null,
  powerSource: null,
  tariffBand: null,
  gridSpend: 100000,
  fuelSpend: 50000,
  generatorSize: null,
  houseType: null,
  rooms: 0,
  appliances: [],
  solarAppliances: null,
  customSchedule: null,
  goal: null,
  backupHours: 4,
  budget: 1500000,
  results: null,
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
