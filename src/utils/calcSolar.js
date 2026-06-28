const PANEL_WATT        = 585;    // W per panel, Jinko Solar 585W Mono PERC Half-Cell
const PERF_RATIO        = 0.75;   // system performance ratio (PR)
const POWER_FACTOR      = 0.80;   // inverter power factor
const SURGE_FACTOR      = 1.25;   // motor startup surge headroom (AC, fridge, pump)
const INST_M2_PER_KWP   = 6.5;   // installation area per kWp
const BATTERY_RT_EFF    = 0.9025; // round-trip battery efficiency (0.95 charge × 0.95 discharge)
const BATTERY_DOD       = 0.80;   // LiFePO4 depth of discharge (must match calcBattery.js)
const BATTERY_CHARGE_EFF= 0.95;   // one-way charge efficiency
const SOLAR_START_HOUR  = 6;
const SOLAR_END_HOUR    = 18;

const INVERTER_SIZES_KVA = [3, 5, 7.5, 10, 12.5, 15, 20, 25, 30];


export function calcSolar(load, location, goal = null, batteryKWh = 0) {
  const dailyKWh     = load.totalDailyKWh;
  const peakDemandKW = load.peakKW;
  const psh          = location?.daily_yield_kwh_per_kwp  || 4.5;
  const annualYield  = location?.annual_yield_kwh_per_kwp || 1642;
  const hourlyProfile = load.hourlyProfile || [];

  // Split load into daytime (solar covers directly) and nighttime (must flow
  // through the battery, incurring round-trip efficiency losses on the way in and out).
  let daytimeKWh = 0, nighttimeKWh = 0;
  if (hourlyProfile.length === 24) {
    for (let h = 0; h < 24; h++) {
      if (h >= SOLAR_START_HOUR && h < SOLAR_END_HOUR) daytimeKWh += hourlyProfile[h];
      else nighttimeKWh += hourlyProfile[h];
    }
  } else {
    daytimeKWh  = dailyKWh * 0.5;
    nighttimeKWh = dailyKWh * 0.5;
  }

  // Effective energy the panels must produce each day:
  //   daytime load → served directly from solar, no battery losses
  //   nighttime load → depends on the user's goal:
  //
  //   offgrid: solar must generate enough to push the full nighttime demand
  //     through the battery (÷ round-trip efficiency).
  //
  //   reduce_bill / backup: the battery is sized only for a partial backup
  //     window, not all night. Solar only needs to fill that battery once per
  //     day (batteryKWh × DoD ÷ charge efficiency). Sizing for the full
  //     nighttime load would over-size the panels relative to the battery's
  //     actual storage capacity, wasting generated energy as clipping.
  let nighttimeSolarKWh;
  if (goal === 'offgrid' || batteryKWh === 0) {
    nighttimeSolarKWh = nighttimeKWh / BATTERY_RT_EFF;
  } else {
    nighttimeSolarKWh = (batteryKWh * BATTERY_DOD) / BATTERY_CHARGE_EFF;
  }
  const effectiveDailyKWh = daytimeKWh + nighttimeSolarKWh;

  // Method 1: peak sun hours
  const pvKWp_method1 = effectiveDailyKWh / (psh * PERF_RATIO);

  // Method 2: annual yield
  const pvKWp_method2 = (effectiveDailyKWh * 365) / annualYield;

  // Use the larger of the two
  const pvKWp_required = Math.max(pvKWp_method1, pvKWp_method2);

  // Panel count and actual system size (always a whole-panel multiple)
  const panelCount   = Math.ceil((pvKWp_required * 1000) / PANEL_WATT);
  const pvKWp_actual = parseFloat((panelCount * PANEL_WATT / 1000).toFixed(2));

  // Inverter: apply surge factor for motor startup loads (AC, fridge, pump),
  // then divide by power factor and round up to nearest standard size.
  const inverterRequired = (peakDemandKW * SURGE_FACTOR) / POWER_FACTOR;
  const inverterKVA = INVERTER_SIZES_KVA.find(s => s >= inverterRequired)
    ?? INVERTER_SIZES_KVA[INVERTER_SIZES_KVA.length - 1];

  // Installation area
  const installationM2 = parseFloat((pvKWp_actual * INST_M2_PER_KWP).toFixed(1));

  // Annual generation: annualYield (kWh/kWp/yr) is already a real-world figure
  // that accounts for performance losses; do not apply PERF_RATIO again.
  const annual_gen_kwh = Math.round(pvKWp_actual * annualYield);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly_gen = months.map(m => ({
    month: m,
    kwh: Math.round(pvKWp_actual * (location?.monthly?.[m.toLowerCase()] || psh) * 30 * PERF_RATIO)
  }));

  return {
    // Fields consumed by solarPVSystem.js and calcSavings.js
    panel_kwp:       pvKWp_actual,
    panel_count:     panelCount,
    inverter_kva:    inverterKVA,
    installation_m2: installationM2,
    annual_gen_kwh,
    monthly_gen,
    psh,
    // Additional sizing detail
    pvKWp_required:  parseFloat(pvKWp_required.toFixed(2)),
    method1_kWp:     parseFloat(pvKWp_method1.toFixed(2)),
    method2_kWp:     parseFloat(pvKWp_method2.toFixed(2)),
    panelWattage:    PANEL_WATT,
  };
}
