export function calcDispatch({
  hourlyProfile,
  pvKWp,
  batteryKWh,
  dailyYield,
  dod = 0.80,
  batteryEfficiency = 0.95,
  energyMix = 'grid_and_generator',
  sunriseHour = 6,
  sunsetHour = 18
}) {
  // Step 1: sine-curve solar generation profile
  const raw = Array.from({ length: 24 }, (_, h) => {
    const angle = (h - sunriseHour) / (sunsetHour - sunriseHour) * Math.PI;
    return (angle > 0 && angle < Math.PI) ? Math.sin(angle) : 0;
  });
  const total_raw = raw.reduce((s, v) => s + v, 0);
  const solar_available = raw.map(r =>
    total_raw > 0 ? (pvKWp * dailyYield * r) / total_raw : 0
  );

  // Step 2: estimate starting SoC at midnight
  // Assume battery is fully charged at sunset, simulate hours 18–23 with no
  // solar to find how much charge remains when the main simulation starts at midnight.
  const maxSoC = batteryKWh;
  const minSoC = batteryKWh * (1 - dod);

  let eveningSoC = maxSoC;
  for (let h = sunsetHour; h < 24; h++) {
    const demand     = hourlyProfile[h] || 0;
    const avail      = Math.max(0, eveningSoC - minSoC);
    const discharge  = Math.min(demand, avail * batteryEfficiency);
    eveningSoC      -= discharge / batteryEfficiency;
  }
  let soc = Math.max(minSoC, eveningSoC);

  // Step 3: dispatch simulation with SoC tracking
  const hours = Array.from({ length: 24 }, (_, h) => {
    const demand = hourlyProfile[h] || 0;
    const solar  = solar_available[h];

    // Priority 1: solar to load
    const solar_to_load = Math.min(solar, demand);
    const surplus = Math.max(0, solar - demand);
    const deficit = Math.max(0, demand - solar);

    // Priority 2: surplus solar → battery
    const charge_amount = Math.min(surplus, (maxSoC - soc) / batteryEfficiency);
    soc += charge_amount * batteryEfficiency;
    const solar_to_charge = charge_amount;

    // Priority 3: battery → remaining deficit
    const battery_available = Math.max(0, soc - minSoC);
    const battery_discharge = Math.min(deficit, battery_available * batteryEfficiency);
    soc -= battery_discharge / batteryEfficiency;
    const battery_to_load = battery_discharge;
    const remaining_deficit = deficit - battery_discharge;

    // Priority 4: grid / gen covers the rest
    const grid_to_load = remaining_deficit;

    return {
      hour:            h,
      demand:          parseFloat(demand.toFixed(3)),
      solar_to_load:   parseFloat(solar_to_load.toFixed(3)),
      battery_to_load: parseFloat(battery_to_load.toFixed(3)),
      grid_to_load:    parseFloat(grid_to_load.toFixed(3)),
      solar_to_charge: parseFloat(solar_to_charge.toFixed(3)),
      soc_end:         parseFloat(soc.toFixed(3)),
      soc_pct:         parseFloat((soc / batteryKWh * 100).toFixed(1)),
    };
  });

  // Step 3: summary metrics
  const totalDemand        = hours.reduce((s, h) => s + h.demand, 0);
  const totalSolarToLoad   = hours.reduce((s, h) => s + h.solar_to_load, 0);
  const totalBatteryToLoad = hours.reduce((s, h) => s + h.battery_to_load, 0);
  const totalGridToLoad    = hours.reduce((s, h) => s + h.grid_to_load, 0);
  const totalSolarCharge   = hours.reduce((s, h) => s + h.solar_to_charge, 0);

  const gridReliance_before = 1.0;
  const gridReliance_after  = totalDemand > 0 ? totalGridToLoad / totalDemand : 0;
  const dailySurplusKWh     = parseFloat(totalSolarCharge.toFixed(2));
  const avgDailyGridKWh     = parseFloat(totalGridToLoad.toFixed(2));

  const gridLabel = energyMix === 'grid_only'        ? 'Grid'
                  : energyMix === 'generator_only'   ? 'Generator'
                  :                                    'Grid+Gen';

  return {
    hours,
    totalDemand:         parseFloat(totalDemand.toFixed(2)),
    totalSolarToLoad:    parseFloat(totalSolarToLoad.toFixed(2)),
    totalBatteryToLoad:  parseFloat(totalBatteryToLoad.toFixed(2)),
    totalGridToLoad:     parseFloat(totalGridToLoad.toFixed(2)),
    totalSolarCharge:    parseFloat(totalSolarCharge.toFixed(2)),
    gridReliance_before,
    gridReliance_after:  parseFloat(gridReliance_after.toFixed(2)),
    dailySurplusKWh,
    avgDailyGridKWh,
    gridLabel,
  };
}
