export function calcLoad(state, applianceData, tariffData, fuelPricesData, genEfficiencyData) {
  const {
    gridSpend = 0,
    fuelSpend = 0,
    tariffBand,
    generatorSize,
    powerSource,
    location,
    appliances = [],
    customSchedule
  } = state;

  // ── STEP 1: TOP-DOWN TOTAL DAILY kWh ──────────────────────────────

  // 1a. Grid consumption
  let dailyGridKWh = 0;
  if (gridSpend > 0 && tariffBand && powerSource !== 'generator_only') {
    const tariff = (tariffData || []).find(t => t.band === tariffBand);
    const ratePerKwh = tariff?.tariff_naira_per_kwh || 0;
    if (ratePerKwh > 0) {
      dailyGridKWh = gridSpend / ratePerKwh / 30;
    }
  }

  // 1b. Generator consumption
  let dailyGenKWh = 0;
  if (fuelSpend > 0 && generatorSize && powerSource !== 'grid_only') {
    const { fuelTypeStr, kwhPerLitre } = resolveGenerator(generatorSize, genEfficiencyData);
    const locationState = location?.state || '';
    const fuelPrice = resolveFuelPrice(fuelTypeStr, locationState, fuelPricesData);
    if (fuelPrice > 0 && kwhPerLitre > 0) {
      dailyGenKWh = (fuelSpend / fuelPrice) * kwhPerLitre / 30;
    }
  }

  // 1c. Total — fall back to appliance-based estimate if top-down yields nothing
  let totalDailyKWh = dailyGridKWh + dailyGenKWh;
  if (totalDailyKWh < 1) {
    totalDailyKWh = estimateFallbackDaily(appliances, applianceData);
  }

  // ── STEP 2: BOTTOM-UP HOURLY DISTRIBUTION FROM GANTT ──────────────

  const appMap = {};
  (applianceData || []).forEach(a => { appMap[a.name] = a; });
  const qtyMap = {};
  (appliances || []).forEach(a => { qtyMap[a.name] = a.qty || 1; });

  const ganttHourlyRaw = new Array(24).fill(0);

  if (customSchedule && customSchedule.length > 0) {
    customSchedule.forEach(row => {
      const def = appMap[row.name];
      if (!def) return;
      const qty = qtyMap[row.name] || 1;
      const kw = (def.rated_watts * qty) / 1000;
      (row.segments || []).forEach(seg => {
        const segStart = seg.start ?? seg.start_hour ?? 0;
        const segEnd   = seg.end   ?? seg.end_hour   ?? 0;
        for (let h = 0; h < 24; h++) {
          const overlap = Math.min(segEnd, h + 1) - Math.max(segStart, h);
          if (overlap > 0) ganttHourlyRaw[h] += kw;
        }
      });
    });
  }

  const ganttTotalKWh = ganttHourlyRaw.reduce((s, v) => s + v, 0);

  // When appliances are entered, the Gantt sum (kW × 1h = kWh per slot) is the
  // authoritative daily total shown on the summary card. Preserve the
  // spending-based figure only for confidence scoring below.
  const topDownDailyKWh = totalDailyKWh;
  if (ganttTotalKWh > 0) totalDailyKWh = ganttTotalKWh;

  // ── STEP 3: HOURLY PROFILE FOR CHART ─────────────────────────────
  // Use raw Gantt sums so each bar shows the actual combined load of
  // all appliances active at that hour. Fall back to flat distribution
  // when no Gantt data exists.

  const hourlyProfile = ganttTotalKWh > 0
    ? ganttHourlyRaw.map(v => parseFloat(v.toFixed(3)))
    : new Array(24).fill(parseFloat((totalDailyKWh / 24).toFixed(3)));

  // ── STEP 4: UNACCOUNTED LOAD (for confidence/sizing only) ─────────

  const unaccountedKWh = Math.max(0, totalDailyKWh - ganttTotalKWh);

  // ── STEP 5: CONFIDENCE SCORE ────────────────────────────────────────

  let confidenceScore, confidenceLabel;
  if (ganttTotalKWh === 0 || topDownDailyKWh === 0) {
    confidenceScore = 30;
    confidenceLabel = 'Low';
  } else {
    const ratio = Math.min(ganttTotalKWh / topDownDailyKWh, 1);
    if (ratio >= 0.85) {
      confidenceScore = Math.min(99, Math.round(90 + ratio * 10));
      confidenceLabel = 'High';
    } else if (ratio >= 0.60) {
      confidenceScore = Math.min(99, Math.round(60 + ratio * 30));
      confidenceLabel = 'Medium';
    } else {
      confidenceScore = Math.min(99, Math.round(ratio * 100));
      confidenceLabel = 'Low';
    }
  }

  // ── OUTPUT ──────────────────────────────────────────────────────────

  const peakHour = hourlyProfile.reduce((best, v, i) => v > hourlyProfile[best] ? i : best, 0);
  const peakKW = parseFloat(hourlyProfile[peakHour].toFixed(2));

  return {
    totalDailyKWh:  parseFloat(totalDailyKWh.toFixed(2)),
    dailyGridKWh:   parseFloat(dailyGridKWh.toFixed(2)),
    dailyGenKWh:    parseFloat(dailyGenKWh.toFixed(2)),
    ganttTotalKWh:  parseFloat(ganttTotalKWh.toFixed(2)),
    unaccountedKWh: parseFloat(unaccountedKWh.toFixed(2)),
    hourlyProfile,
    ganttHourly:    ganttHourlyRaw.map(v => parseFloat(v.toFixed(3))),
    peakHour,
    peakKW,
    confidenceScore,
    confidenceLabel,
    monthlyKWh: parseFloat((totalDailyKWh * 30).toFixed(1))
  };
}

// ── Helpers ──────────────────────────────────────────────────────────

function resolveGenerator(generatorSize, genEfficiencyData) {
  const defaults = { small: { fuelTypeStr: 'PMS', kwhPerLitre: 2.27 }, medium: { fuelTypeStr: 'PMS', kwhPerLitre: 3.38 }, large: { fuelTypeStr: 'AGO', kwhPerLitre: 3.71 } };
  if (!genEfficiencyData || genEfficiencyData.length === 0) {
    return defaults[generatorSize] || defaults.medium;
  }

  const sizeMap = {
    small:  { types: ['Small Portable'],       preferFuel: 'PMS' },
    medium: { types: ['Mid-size'],             preferFuel: 'PMS' },
    large:  { types: ['Mid-size', 'Large Home'], preferFuel: 'AGO' }
  };
  const mapping = sizeMap[generatorSize] || sizeMap.medium;

  let candidates = genEfficiencyData.filter(g =>
    mapping.types.includes(g.type) && g.fuel_type.includes(mapping.preferFuel)
  );
  if (candidates.length === 0) {
    candidates = genEfficiencyData.filter(g => mapping.types.includes(g.type));
  }
  if (candidates.length === 0) return defaults[generatorSize] || defaults.medium;

  const kwhPerLitre = candidates.reduce((s, g) => s + g.kwh_per_litre, 0) / candidates.length;
  return { fuelTypeStr: mapping.preferFuel, kwhPerLitre };
}

function resolveFuelPrice(fuelTypeStr, locationState, fuelPricesData) {
  const hardDefaults = { AGO: 1800, PMS: 1300 };
  if (!fuelPricesData || fuelPricesData.length === 0) return hardDefaults[fuelTypeStr] || 1100;

  const keyword = fuelTypeStr === 'AGO' ? 'AGO' : 'PMS';
  const matching = fuelPricesData.filter(f => f.fuel_type.includes(keyword));
  if (matching.length === 0) return hardDefaults[fuelTypeStr] || 1100;

  const exact = matching.find(f => f.state.toLowerCase() === locationState.toLowerCase());
  if (exact) return exact.price_per_litre_naira;

  return Math.round(matching.reduce((s, f) => s + f.price_per_litre_naira, 0) / matching.length);
}

function estimateFallbackDaily(appliances, applianceData) {
  if (!appliances || appliances.length === 0) return 5;
  const appMap = {};
  (applianceData || []).forEach(a => { appMap[a.name] = a; });
  let total = 0;
  appliances.forEach(sel => {
    const def = appMap[sel.name];
    if (def) total += (def.daily_wh * (sel.qty || 1)) / 1000;
  });
  return Math.max(2, total);
}
