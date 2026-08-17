const DOD                = 0.80;   // LiFePO4 depth of discharge
const BATTERY_EFFICIENCY = 0.95;   // round-trip charge/discharge efficiency
const BACKUP_WIN_START   = 18;     // outage window anchor — 6 pm, when NEPA outages are felt hardest
const EVENING_WINDOW_HOURS = 6;    // fixed reference window used only for off-grid's "Output" display

// Night hours solar cannot contribute: 6 pm–midnight + midnight–6 am
const NIGHT_HOURS = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5];

// Off-grid autonomy multiplier: 1.5 = covers one full overcast day on top of a normal night
const OFFGRID_AUTONOMY_DAYS = 1.5;

// Default backup hours when the user hasn't overridden via counter
const GOAL_BACKUP_HOURS = { reduce_bill: 4, backup: 8, offgrid: 16 };

// Fractions of peak load used to estimate backup time at different load levels
const ESSENTIALS_FRAC = 0.25;
const APPLIANCES_FRAC = 0.60;

// Battery modules only come in whole 5kWh/48V units — sizing to anything
// else isn't actually purchasable, so every downstream number (cost, solar
// charging capacity, backup-hours estimates) should be built from the real,
// snapped-up capacity rather than the pre-rounding theoretical requirement.
const BATTERY_MODULE_KWH = 5;

export function calcBattery(load, goal, backupHoursOverride) {
  const peakDemandKW  = load.peakKW        || 1;
  const dailyKWh      = load.totalDailyKWh || 1;
  const hourlyProfile = load.hourlyProfile  || [];

  // Backup hours: use user override only for 'backup' goal, else use goal default
  const backupHours = (goal === 'backup' && backupHoursOverride > 0)
    ? backupHoursOverride
    : (GOAL_BACKUP_HOURS[goal] ?? 4);

  // The reasoning we're sizing for: "I want a system that can sustain my load
  // for `backupHours` hours in the event of a grid outage." So we average the
  // load across a window that actually spans that many hours — not a fixed
  // 6-hour slice regardless of what was asked for — anchored at 6 pm, since
  // that's when NEPA outages are typically felt hardest. A 2-hour request
  // only looks at 6–8 pm; a 16-hour request runs past midnight into the next
  // morning, wrapping around the 24-hour profile.
  const windowHours = goal === 'offgrid' ? EVENING_WINDOW_HOURS : Math.max(1, Math.round(backupHours));
  let avgBackupLoad_kW = 0;
  if (hourlyProfile.length === 24) {
    let windowSum = 0;
    for (let i = 0; i < windowHours; i++) {
      windowSum += hourlyProfile[(BACKUP_WIN_START + i) % 24] || 0;
    }
    avgBackupLoad_kW = windowSum / windowHours;
  }
  if (avgBackupLoad_kW === 0) avgBackupLoad_kW = peakDemandKW * 0.6;

  // Energy sizing:
  // - offgrid: battery covers the nighttime load (6 pm to 6 am) only; solar handles
  //            daytime demand directly. An autonomy factor of 1.5 adds headroom for
  //            one overcast day where panels underperform.
  //            Fallback when no hourly profile: 50% of daily load (rough night share).
  // - backup / reduce_bill: battery only covers the evening backup window.
  let energyNeeded_kWh;
  if (goal === 'offgrid') {
    const nightlyKWh = hourlyProfile.length === 24
      ? NIGHT_HOURS.reduce((s, h) => s + (hourlyProfile[h] || 0), 0)
      : dailyKWh * 0.5;
    energyNeeded_kWh = nightlyKWh * OFFGRID_AUTONOMY_DAYS;
  } else {
    energyNeeded_kWh = avgBackupLoad_kW * backupHours;
  }

  const batteryKWh_net         = energyNeeded_kWh / DOD;
  const batteryKWh_gross       = batteryKWh_net   / BATTERY_EFFICIENCY;
  const batteryKWh_theoretical = Math.ceil(batteryKWh_gross);

  // Snap up to whole 5kWh/48V modules — this is the number that's actually
  // buyable, so it becomes the real capacity used everywhere downstream
  // (cost, solar's battery-charging requirement, backup-hours estimates),
  // not just a cosmetic display figure sitting next to a mismatched
  // pre-rounding number.
  const battery_units_48v      = Math.ceil(batteryKWh_theoretical / BATTERY_MODULE_KWH);
  const batteryKWh_recommended = battery_units_48v * BATTERY_MODULE_KWH;

  // Usable energy from the recommended pack (for backup-time display)
  const batteryUsable = parseFloat((batteryKWh_recommended * DOD * BATTERY_EFFICIENCY).toFixed(2));

  // "Whole home" is meant to answer the question the user actually asked —
  // "can this sustain my typical load for the hours I chose?" — so for
  // backup/reduce_bill it's judged against the same average load the
  // battery was sized to (avgBackupLoad_kW), landing at ≈ backupHours by
  // construction. Off-grid has no backup-hours target to reconcile against,
  // so it keeps the original full-peak-demand basis unchanged.
  const wholeHomeBasis = goal === 'offgrid' ? peakDemandKW : avgBackupLoad_kW;
  const whole_home_hrs = wholeHomeBasis > 0
    ? Math.min(24, Math.round(batteryUsable / wholeHomeBasis))
    : 24;

  // Essentials/Appliances stay pegged to fractions of peak demand — a
  // genuinely different "what if I ration to just this much" scenario, not
  // the same number expressed differently. But they should never show
  // *fewer* hours than the more demanding "whole home" figure — clamp so
  // essentials ≥ appliances ≥ whole home always holds, regardless of how
  // the two bases (fraction-of-peak vs. actual average load) compare for a
  // given profile.
  const appliances_hrs_raw = peakDemandKW > 0
    ? Math.min(24, Math.round(batteryUsable / (peakDemandKW * APPLIANCES_FRAC)))
    : 24;
  const essentials_hrs_raw = peakDemandKW > 0
    ? Math.min(24, Math.round(batteryUsable / (peakDemandKW * ESSENTIALS_FRAC)))
    : 24;
  const appliances_hrs = Math.max(appliances_hrs_raw, whole_home_hrs);
  const essentials_hrs = Math.max(essentials_hrs_raw, appliances_hrs);

  return {
    battery_kwh:             batteryKWh_recommended,
    battery_units_48v,
    storage_capacity:        batteryKWh_recommended,
    storage_output:          parseFloat(avgBackupLoad_kW.toFixed(2)),
    backup_hours_essentials: essentials_hrs,
    backup_hours_appliances: appliances_hrs,
    backup_hours_whole_home: whole_home_hrs,
    backupHours,
    avgBackupLoad_kW:        parseFloat(avgBackupLoad_kW.toFixed(2)),
    energyNeeded_kWh:        parseFloat(energyNeeded_kWh.toFixed(2)),
    batteryKWh_gross:        parseFloat(batteryKWh_gross.toFixed(2)),
    batteryKWh_theoretical,
    batteryKWh_recommended,
    dod:                     DOD,
    backupWindowStart:       BACKUP_WIN_START,
    backupWindowHours:       windowHours,
  };
}
