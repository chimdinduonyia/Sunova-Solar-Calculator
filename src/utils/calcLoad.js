// Typical Nigerian residential hourly load coefficients (relative).
// Evening peak at 19h (7 pm); morning bump 6-8h; flat daytime; low overnight.
// Sum ≈ 6.93 → implied load factor ≈ 0.29, within IEC residential range.
const TYPICAL_PROFILE = [
  // 00    01    02    03    04    05    06    07    08    09
  0.08, 0.06, 0.06, 0.06, 0.08, 0.15, 0.45, 0.50, 0.35, 0.15,
  // 10    11    12    13    14    15    16    17    18    19
  0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.15, 0.40, 0.85, 1.00,
  // 20    21    22    23
  0.90, 0.60, 0.25, 0.12,
];
const TYPICAL_PROFILE_SUM = TYPICAL_PROFILE.reduce((s, v) => s + v, 0); // 6.93

export function calcLoad(state, tariffData, fuelPricesData, genEfficiencyData) {
  const {
    gridSpend = 0,
    fuelSpend = 0,
    tariffBand,
    generatorSize,
    powerSource,
    location,
  } = state;

  // ── STEP 1: BILL-BASED TOTAL DAILY kWh ──────────────────────────────

  let dailyGridKWh = 0;
  if (gridSpend > 0 && tariffBand && powerSource !== 'generator_only') {
    const tariff = (tariffData || []).find(t => t.band === tariffBand);
    const ratePerKwh = tariff?.tariff_naira_per_kwh || 0;
    if (ratePerKwh > 0) dailyGridKWh = gridSpend / ratePerKwh / 30;
  }

  let dailyGenKWh = 0;
  if (fuelSpend > 0 && generatorSize && powerSource !== 'grid_only') {
    const { fuelTypeStr, kwhPerLitre } = resolveGenerator(generatorSize, genEfficiencyData);
    const fuelPrice = resolveFuelPrice(fuelTypeStr, location?.state || '', fuelPricesData);
    if (fuelPrice > 0 && kwhPerLitre > 0) {
      dailyGenKWh = (fuelSpend / fuelPrice) * kwhPerLitre / 30;
    }
  }

  const totalDailyKWh = Math.max(1, dailyGridKWh + dailyGenKWh);

  // ── STEP 2: TYPICAL HOURLY PROFILE ─────────────────────────────────
  // Scale the Nigerian residential typical pattern to bill-derived daily kWh.
  // peakKW at hour 19 ≈ totalDailyKWh / 6.93 (load factor ≈ 0.29).

  const scale = totalDailyKWh / TYPICAL_PROFILE_SUM;
  const hourlyProfile = TYPICAL_PROFILE.map(c => parseFloat((c * scale).toFixed(3)));
  const peakHour = 19;
  const peakKW = parseFloat(hourlyProfile[peakHour].toFixed(2));

  return {
    totalDailyKWh:  parseFloat(totalDailyKWh.toFixed(2)),
    dailyGridKWh:   parseFloat(dailyGridKWh.toFixed(2)),
    dailyGenKWh:    parseFloat(dailyGenKWh.toFixed(2)),
    hourlyProfile,
    peakHour,
    peakKW,
    monthlyKWh: parseFloat((totalDailyKWh * 30).toFixed(1)),
  };
}

// ── Helpers ──────────────────────────────────────────────────────────

function resolveGenerator(generatorSize, genEfficiencyData) {
  const defaults = {
    small:  { fuelTypeStr: 'PMS', kwhPerLitre: 2.27 },
    medium: { fuelTypeStr: 'PMS', kwhPerLitre: 3.38 },
    large:  { fuelTypeStr: 'AGO', kwhPerLitre: 3.71 },
  };
  if (!genEfficiencyData || genEfficiencyData.length === 0) {
    return defaults[generatorSize] || defaults.medium;
  }
  const sizeMap = {
    small:  { types: ['Small Portable'],         preferFuel: 'PMS' },
    medium: { types: ['Mid-size'],               preferFuel: 'PMS' },
    large:  { types: ['Mid-size', 'Large Home'], preferFuel: 'AGO' },
  };
  const mapping = sizeMap[generatorSize] || sizeMap.medium;
  let candidates = genEfficiencyData.filter(g =>
    mapping.types.includes(g.type) && g.fuel_type.includes(mapping.preferFuel)
  );
  if (!candidates.length) candidates = genEfficiencyData.filter(g => mapping.types.includes(g.type));
  if (!candidates.length) return defaults[generatorSize] || defaults.medium;
  const kwhPerLitre = candidates.reduce((s, g) => s + g.kwh_per_litre, 0) / candidates.length;
  return { fuelTypeStr: mapping.preferFuel, kwhPerLitre };
}

function resolveFuelPrice(fuelTypeStr, locationState, fuelPricesData) {
  const hardDefaults = { AGO: 1800, PMS: 1300 };
  if (!fuelPricesData || fuelPricesData.length === 0) return hardDefaults[fuelTypeStr] || 1100;
  const keyword  = fuelTypeStr === 'AGO' ? 'AGO' : 'PMS';
  const matching = fuelPricesData.filter(f => f.fuel_type.includes(keyword));
  if (!matching.length) return hardDefaults[fuelTypeStr] || 1100;
  const exact = matching.find(f => f.state.toLowerCase() === locationState.toLowerCase());
  if (exact) return exact.price_per_litre_naira;
  return Math.round(matching.reduce((s, f) => s + f.price_per_litre_naira, 0) / matching.length);
}
