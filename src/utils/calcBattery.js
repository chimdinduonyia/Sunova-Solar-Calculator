const DOD                = 0.80;   // LiFePO4 depth of discharge
const BATTERY_EFFICIENCY = 0.95;   // round-trip charge/discharge efficiency
const BACKUP_WIN_START   = 18;     // backup window start hour (6 pm)
const BACKUP_WIN_END     = 23;     // backup window end hour  (11 pm, inclusive)

// Standard LiFePO4 battery sizes available on the Nigerian market (kWh gross)
const BATTERY_SIZES_KWH = [5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100];

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
  // - offgrid: battery must carry the entire daily load through the night and
  //            low-irradiance periods → size for full daily kWh consumption.
  // - backup / reduce_bill: battery only covers the evening backup window.
  const energyNeeded_kWh = goal === 'offgrid'
    ? dailyKWh
    : avgBackupLoad_kW * backupHours;

  const batteryKWh_net    = energyNeeded_kWh / DOD;
  const batteryKWh_gross  = batteryKWh_net   / BATTERY_EFFICIENCY;

  // Snap up to nearest standard size
  const batteryKWh_recommended = BATTERY_SIZES_KWH.find(s => s >= batteryKWh_gross)
    ?? BATTERY_SIZES_KWH[BATTERY_SIZES_KWH.length - 1];

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

