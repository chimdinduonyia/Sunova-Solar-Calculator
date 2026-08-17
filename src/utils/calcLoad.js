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
    appliances,
    customSchedule,
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

  const billTotalDailyKWh = Math.max(1, dailyGridKWh + dailyGenKWh);

  // ── STEP 2: TYPICAL HOURLY PROFILE (bill-based fallback/baseline) ──
  // Scale the Nigerian residential typical pattern to bill-derived daily kWh.
  // peakKW at hour 19 ≈ totalDailyKWh / 6.93 (load factor ≈ 0.29).

  const scale = billTotalDailyKWh / TYPICAL_PROFILE_SUM;
  const typicalHourlyProfile = TYPICAL_PROFILE.map(c => parseFloat((c * scale).toFixed(3)));

  // ── STEP 3: BOTTOM-UP APPLIANCE OVERRIDE ────────────────────────────
  // When the user has picked specific appliances and a duty-cycle schedule
  // (via the appliance selector + Gantt), that becomes the authoritative
  // basis for load — it reflects exactly what they intend to run on solar,
  // rather than an inferred share of their whole electricity bill.
  let totalDailyKWh = billTotalDailyKWh;
  let hourlyProfile = typicalHourlyProfile;
  let usingApplianceData = false;
  let confidence = null;

  if (appliances?.length > 0 && customSchedule?.length > 0) {
    const gantt = computeGanttProfile(customSchedule, appliances);
    if (gantt.total > 0) {
      totalDailyKWh = gantt.total;
      hourlyProfile = gantt.hourly.map(v => parseFloat(v.toFixed(3)));
      usingApplianceData = true;

      // Bill-derived grid/generator split still holds proportionally — rescale
      // it to the appliance-derived total so calcSavings' grid/gen share math
      // (and the "before" cost bar) reflects the appliances actually chosen.
      const rescale = billTotalDailyKWh > 0 ? totalDailyKWh / billTotalDailyKWh : 1;
      dailyGridKWh *= rescale;
      dailyGenKWh  *= rescale;

      // Confidence: how closely the appliance-derived total tracks the bill estimate.
      const variance = billTotalDailyKWh > 0
        ? Math.abs(totalDailyKWh - billTotalDailyKWh) / billTotalDailyKWh
        : 1;
      confidence = variance <= 0.25 ? 'High' : variance <= 0.60 ? 'Medium' : 'Low';
    }
  }

  const peakHour = hourlyProfile.reduce((best, v, h) => v > hourlyProfile[best] ? h : best, 0);
  const peakKW   = parseFloat(hourlyProfile[peakHour].toFixed(2));

  return {
    totalDailyKWh:  parseFloat(totalDailyKWh.toFixed(2)),
    dailyGridKWh:   parseFloat(dailyGridKWh.toFixed(2)),
    dailyGenKWh:    parseFloat(dailyGenKWh.toFixed(2)),
    hourlyProfile,
    peakHour,
    peakKW,
    monthlyKWh: parseFloat((totalDailyKWh * 30).toFixed(1)),
    usingApplianceData,
    confidence,
    // Always the bill-derived total, regardless of appliance selection — the
    // Load Summary page reads these so it keeps describing the whole home's
    // actual consumption, not just whatever subset is being solarized.
    billTotalDailyKWh: parseFloat(billTotalDailyKWh.toFixed(2)),
    billMonthlyKWh:    parseFloat((billTotalDailyKWh * 30).toFixed(1)),
  };
}

// Sum an appliance's rated draw across every hour it overlaps its Gantt
// segments, producing a 24-slot kW profile and its daily kWh total.
// Exported so the Gantt editor can show a live consumption/peak-demand
// summary without duplicating this math.
export function computeGanttProfile(customSchedule, appliances) {
  const applianceMap = Object.fromEntries(appliances.map(a => [a.name, a]));
  const hourly = new Array(24).fill(0);

  customSchedule.forEach(row => {
    const app = applianceMap[row.name];
    if (!app || !row.segments?.length) return;
    const kw = (app.rated_watts * (app.qty || 1)) / 1000;
    for (let h = 0; h < 24; h++) {
      const frac = hourOverlapFraction(h, row.segments);
      if (frac > 0) hourly[h] += kw * frac;
    }
  });

  const total = hourly.reduce((s, v) => s + v, 0);
  return { hourly, total };
}

// Fraction of hour [h, h+1) covered by any of the given {start,end} segments.
function hourOverlapFraction(hour, segments) {
  let covered = 0;
  for (const seg of segments) {
    const overlap = Math.min(hour + 1, seg.end) - Math.max(hour, seg.start);
    if (overlap > 0) covered += overlap;
  }
  return Math.min(1, covered);
}

// ── Helpers ──────────────────────────────────────────────────────────

// Four tiers instead of three: "Heavy" shares the same petrol-generator form
// factor as "Standard" (real 7–10 kVA units still look like a regular
// gasoline genset, not a soundproofed diesel cabinet) — only "Extra-large"
// steps up to the big silent-diesel form factor. See generator_efficiency.json.
function resolveGenerator(generatorSize, genEfficiencyData) {
  const defaults = {
    basic:    { fuelTypeStr: 'PMS', kwhPerLitre: 1.18 },
    standard: { fuelTypeStr: 'PMS', kwhPerLitre: 1.67 },
    heavy:    { fuelTypeStr: 'PMS', kwhPerLitre: 2.00 },
    xlarge:   { fuelTypeStr: 'AGO', kwhPerLitre: 2.86 },
  };
  if (!genEfficiencyData || genEfficiencyData.length === 0) {
    return defaults[generatorSize] || defaults.standard;
  }
  const sizeMap = {
    basic:    { types: ['Basic'],       preferFuel: 'PMS' },
    standard: { types: ['Standard'],    preferFuel: 'PMS' },
    heavy:    { types: ['Heavy'],       preferFuel: 'PMS' },
    xlarge:   { types: ['Extra-large'], preferFuel: 'AGO' },
  };
  const mapping = sizeMap[generatorSize] || sizeMap.standard;
  let candidates = genEfficiencyData.filter(g =>
    mapping.types.includes(g.type) && g.fuel_type.includes(mapping.preferFuel)
  );
  if (!candidates.length) candidates = genEfficiencyData.filter(g => mapping.types.includes(g.type));
  if (!candidates.length) return defaults[generatorSize] || defaults.standard;
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
