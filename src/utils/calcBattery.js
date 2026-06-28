const DOD                = 0.80;   // LiFePO4 depth of discharge
const BATTERY_EFFICIENCY = 0.95;   // round-trip charge/discharge efficiency
const BACKUP_WIN_START   = 18;     // backup window start hour (6 pm)
const BACKUP_WIN_END     = 23;     // backup window end hour  (11 pm, inclusive)

// Night hours solar cannot contribute: 6 pm–midnight + midnight–6 am
const NIGHT_HOURS = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5];

// Off-grid autonomy multiplier: 1.5 = covers one full overcast day on top of a normal night
const OFFGRID_AUTONOMY_DAYS = 1.5;


// Default backup hours when the user hasn't overridden via counter
const GOAL_BACKUP_HOURS = { reduce_bill: 4, backup: 8, offgrid: 16 };

// Fractions of peak load used to estimate backup time at different load levels
const ESSENTIALS_FRAC = 0.25;
const APPLIANCES_FRAC = 0.60;

export function calcBattery(load, goal, backupHoursOverride) {
  const peakDemandKW  = load.peakKW        || 1;
  const dailyKWh      = load.totalDailyKWh || 1;
  const hourlyProfile = load.hourlyProfile  || [];

  // Backup hours: use user override only for 'backup' goal, else use goal default
  const backupHours = (goal === 'backup' && backupHoursOverride > 0)
    ? backupHoursOverride
    : (GOAL_BACKUP_HOURS[goal] ?? 4);

  // Average load during the evening backup window from the hourly profile
  const windowSlots = hourlyProfile.slice(BACKUP_WIN_START, BACKUP_WIN_END + 1);
  const windowSum   = windowSlots.reduce((s, v) => s + v, 0);
  let avgBackupLoad_kW = windowSlots.length > 0 ? windowSum / windowSlots.length : 0;
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
  const batteryKWh_recommended = Math.ceil(batteryKWh_gross);

  // Usable energy from the recommended pack (for backup-time display)
  const batteryUsable = parseFloat((batteryKWh_recommended * DOD * BATTERY_EFFICIENCY).toFixed(2));

  const essentials_hrs = peakDemandKW > 0
    ? Math.min(24, Math.round(batteryUsable / (peakDemandKW * ESSENTIALS_FRAC)))
    : 24;
  const appliances_hrs = peakDemandKW > 0
    ? Math.min(24, Math.round(batteryUsable / (peakDemandKW * APPLIANCES_FRAC)))
    : 24;
  const whole_home_hrs = peakDemandKW > 0
    ? Math.min(24, Math.round(batteryUsable / peakDemandKW))
    : 24;

  // 48 V / 5 kWh unit count (common LiFePO4 module size)
  const battery_units_48v = Math.ceil(batteryKWh_recommended / 5);

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
    batteryKWh_recommended,
    dod:                     DOD,
    backupWindowStart:       BACKUP_WIN_START,
    backupWindowEnd:         BACKUP_WIN_END,
  };
}

