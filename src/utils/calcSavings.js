// ── Confirmed constants ───────────────────────────────────────────────
const PV_COST_PER_KWP         = 260000;
const BATTERY_COST_PER_KWH    = 280000;
const INVERTER_COST_PER_KVA   = 200000;
const BOS_FACTOR              = 0.15;
const BATTERY_LIFESPAN_YEARS  = 10;
const DESIGN_LIFE_YEARS       = 25;
const PANEL_DEGRADATION       = 0.005;
const TARIFF_ESCALATION_RATE  = 0.01;
const GRID_EMISSION_FACTOR    = 0.43;   // kgCO₂/kWh
const PMS_EMISSION_FACTOR     = 0.65;   // kgCO₂/kWh
const AGO_EMISSION_FACTOR     = 0.70;   // kgCO₂/kWh

// Mirror calcLoad.js's resolveGenerator; keeps kWh/litre consistent across both utils
const GEN_SIZE_MAP = {
  small:  { types: ['Small Portable'],          preferFuel: 'PMS', defaultKwh: 2.27 },
  medium: { types: ['Mid-size'],                preferFuel: 'PMS', defaultKwh: 3.38 },
  large:  { types: ['Mid-size', 'Large Home'],  preferFuel: 'AGO', defaultKwh: 3.71 },
};

function resolveGenerator(generatorSize, genData) {
  const mapping = GEN_SIZE_MAP[generatorSize] || GEN_SIZE_MAP.medium;
  const data = genData || [];
  let candidates = data.filter(g =>
    mapping.types.includes(g.type) && g.fuel_type.includes(mapping.preferFuel)
  );
  if (!candidates.length) candidates = data.filter(g => mapping.types.includes(g.type));
  const kwhPerLitre = candidates.length
    ? candidates.reduce((s, g) => s + g.kwh_per_litre, 0) / candidates.length
    : mapping.defaultKwh;
  return { fuelTypeStr: mapping.preferFuel, kwhPerLitre };
}

function resolveFuelPrice(fuelTypeStr, locationState, fuelPricesData) {
  const hardDefaults = { AGO: 1800, PMS: 1300 };
  if (!fuelPricesData?.length) return hardDefaults[fuelTypeStr] || 1100;
  const keyword  = fuelTypeStr === 'AGO' ? 'AGO' : 'PMS';
  const matching = fuelPricesData.filter(f => f.fuel_type.includes(keyword));
  if (!matching.length) return hardDefaults[fuelTypeStr] || 1100;
  const exact = matching.find(f =>
    f.state?.toLowerCase() === (locationState || '').toLowerCase()
  );
  if (exact) return exact.price_per_litre_naira;
  return Math.round(matching.reduce((s, f) => s + f.price_per_litre_naira, 0) / matching.length);
}

export function calcSavings({ load, solar, battery, dispatch, tariffData, fuelPrices, genData, state }) {

  // ── Unpack inputs ─────────────────────────────────────────────────────
  const dailyKWh   = load.totalDailyKWh;
  const monthlyKWh = load.monthlyKWh ?? load.totalDailyKWh * 30;
  const dailyGridKWh = load.dailyGridKWh || 0;
  const dailyGenKWh  = load.dailyGenKWh  || 0;

  const pvKWp_actual            = solar.panel_kwp;
  const inverterKVA             = solar.inverter_kva;
  const annualYieldPerKWp       = state.location?.annual_yield_kwh_per_kwp
                                || (state.location?.daily_yield_kwh_per_kwp || 4.5) * 365;
  const batteryKWh_recommended  = battery.battery_kwh;

  const energyMix = state.powerSource || 'grid_only';
  const solarGoal = state.goal        || 'reduce_bill';
  const userBudget = state.budget     || 0;

  // Tariff
  const tariffObj            = tariffData?.find(t => t.band === state.tariffBand);
  const tariff_naira_per_kwh = tariffObj?.tariff_naira_per_kwh || 194;

  // Generator: resolved using same logic as calcLoad for consistency
  const { fuelTypeStr, kwhPerLitre } = resolveGenerator(state.generatorSize, genData);
  const locationStateName = state.location?.state || '';
  const fuelPricePerLitre = resolveFuelPrice(fuelTypeStr, locationStateName, fuelPrices);
  const gen_cost_per_kwh  = energyMix !== 'grid_only'
    ? Math.round(fuelPricePerLitre / kwhPerLitre)
    : 0;

  // ── Step 1: System cost ───────────────────────────────────────────────
  const equipment_cost = Math.round(
    pvKWp_actual           * PV_COST_PER_KWP   +
    batteryKWh_recommended * BATTERY_COST_PER_KWH +
    inverterKVA            * INVERTER_COST_PER_KVA
  );
  const bos_cost          = Math.round(equipment_cost * BOS_FACTOR);
  const total_system_cost = equipment_cost + bos_cost;

  const isWithinBudget  = userBudget > 0 ? total_system_cost <= userBudget : true;
  const budgetSurplus   = Math.max(0, userBudget - total_system_cost);
  const budgetShortfall = Math.max(0, total_system_cost - userBudget);

  // ── Step 2: Current blended cost ─────────────────────────────────────
  const spendingTotal = dailyGridKWh + dailyGenKWh;
  let grid_share, gen_share;
  if (spendingTotal > 0) {
    grid_share = dailyGridKWh / spendingTotal;
    gen_share  = dailyGenKWh  / spendingTotal;
  } else if (energyMix === 'grid_only')      { grid_share = 1;   gen_share = 0;   }
  else if (energyMix === 'generator_only')   { grid_share = 0;   gen_share = 1;   }
  else                                       { grid_share = 0.5; gen_share = 0.5; }

  let current_blended_cost;
  if (energyMix === 'grid_only') {
    current_blended_cost = tariff_naira_per_kwh;
  } else if (energyMix === 'generator_only') {
    current_blended_cost = gen_cost_per_kwh;
  } else {
    current_blended_cost = Math.round(
      grid_share * tariff_naira_per_kwh + gen_share * gen_cost_per_kwh
    );
  }

  const current_monthly_cost = Math.round(current_blended_cost * monthlyKWh);

  // ── Step 3: Solar LCOE ────────────────────────────────────────────────
  // Closed-form geometric series: sum of (1-d)^0 … (1-d)^24
  const lifetime_generation_kWh = pvKWp_actual * annualYieldPerKWp
    * ((1 - Math.pow(1 - PANEL_DEGRADATION, DESIGN_LIFE_YEARS)) / PANEL_DEGRADATION);

  const LCOE = lifetime_generation_kWh > 0
    ? Math.round(total_system_cost / lifetime_generation_kWh)
    : 45;

  // ── Step 4: Dispatch fractions ────────────────────────────────────────
  const { totalDemand, totalSolarToLoad, totalBatteryToLoad, totalGridToLoad } = dispatch;

  // Battery-delivered energy is solar-derived; totalGridToLoad is all residual (grid + gen combined)
  const solar_fraction    = totalDemand > 0
    ? (totalSolarToLoad + totalBatteryToLoad) / totalDemand : 0;
  const residual_fraction = totalDemand > 0 ? totalGridToLoad / totalDemand : 1 - solar_fraction;
  const grid_fraction     = residual_fraction * grid_share;
  const gen_fraction      = residual_fraction * gen_share;

  // ── Step 4b: Post-solar blended cost ──────────────────────────────────
  let post_solar_blended_cost;
  if (solarGoal === 'offgrid') {
    post_solar_blended_cost = LCOE;
  } else if (energyMix === 'grid_only') {
    post_solar_blended_cost = Math.round(
      solar_fraction * LCOE + grid_fraction * tariff_naira_per_kwh
    );
  } else if (energyMix === 'generator_only') {
    post_solar_blended_cost = Math.round(
      solar_fraction * LCOE + gen_fraction * gen_cost_per_kwh
    );
  } else {
    post_solar_blended_cost = Math.round(
      solar_fraction * LCOE
      + grid_fraction * tariff_naira_per_kwh
      + gen_fraction  * gen_cost_per_kwh
    );
  }

  const post_solar_monthly_cost = Math.round(post_solar_blended_cost * monthlyKWh);

  // ── Step 5: Savings metrics ───────────────────────────────────────────
  // Energy-only post-solar cost excludes LCOE amortisation so the cashflow
  // is not double-charged (system cost already enters as the year-0 outlay).
  const post_solar_energy_only_monthly = Math.round(
    (grid_fraction * tariff_naira_per_kwh + gen_fraction * gen_cost_per_kwh) * monthlyKWh
  );
  const monthly_savings = current_monthly_cost - post_solar_energy_only_monthly;
  const annual_savings  = monthly_savings * 12;

  const simple_payback_years = annual_savings > 0
    ? parseFloat((total_system_cost / annual_savings).toFixed(1))
    : 99;

  // ROI derived from the escalated lifetime cashflow — consistent with the Lifetime Savings figure.
  // Computed after the cashflow loop so lifetime_savings is available.

  // ── Step 6: Fuel savings ──────────────────────────────────────────────
  let litres_saved_per_year = 0, fuel_naira_saved_annual = 0;
  if (energyMix !== 'grid_only') {
    const daily_gen_displaced = Math.max(0, dailyGenKWh - gen_fraction * dailyKWh);
    const annual_displaced    = daily_gen_displaced * 365;
    litres_saved_per_year     = kwhPerLitre > 0 ? Math.round(annual_displaced / kwhPerLitre) : 0;
    fuel_naira_saved_annual   = Math.round(litres_saved_per_year * fuelPricePerLitre);
  }

  // ── Step 7: Carbon avoided ────────────────────────────────────────────
  let emission_factor;
  const genEmFactor = fuelTypeStr === 'AGO' ? AGO_EMISSION_FACTOR : PMS_EMISSION_FACTOR;
  if (energyMix === 'grid_only') {
    emission_factor = GRID_EMISSION_FACTOR;
  } else if (energyMix === 'generator_only') {
    emission_factor = genEmFactor;
  } else {
    emission_factor = grid_share * GRID_EMISSION_FACTOR + gen_share * genEmFactor;
  }

  const solar_kwh_annual = pvKWp_actual * annualYieldPerKWp;
  const co2_avoided_tonnes = parseFloat((solar_kwh_annual * emission_factor / 1000).toFixed(1));

  // ── Step 8: 26-entry cumulative cash flow (year 0–25) ─────────────────
  // Savings escalate at TARIFF_ESCALATION_RATE/yr starting from year 1.
  let cumulative = -total_system_cost;
  let payback_year_index = -1;
  let payback_exact = null;

  const cashflow = [{ year: 0, cumulative }];

  for (let y = 1; y <= DESIGN_LIFE_YEARS; y++) {
    const escalated_savings  = annual_savings * Math.pow(1 + TARIFF_ESCALATION_RATE, y);
    const net_this_year      = escalated_savings;
    const prev               = cumulative;
    cumulative              += net_this_year;

    if (payback_year_index === -1 && prev < 0 && cumulative >= 0) {
      payback_year_index = y;
      // Linear interpolation to sub-year precision
      payback_exact = parseFloat(
        ((y - 1) + Math.abs(prev) / net_this_year).toFixed(1)
      );
    }

    cashflow.push({ year: y, cumulative: Math.round(cumulative) });
  }

  // Payback fell exactly on a year boundary or never occurred
  if (payback_year_index === -1) {
    if (cumulative >= 0) { payback_year_index = DESIGN_LIFE_YEARS; payback_exact = DESIGN_LIFE_YEARS; }
    else                 { payback_year_index = 99;                 payback_exact = 99; }
  }

  const lifetime_savings = cashflow[DESIGN_LIFE_YEARS].cumulative;
  const ROI = total_system_cost > 0
    ? Math.round((lifetime_savings / total_system_cost) * 100)
    : 0;

  // ── Labels for chart axes ─────────────────────────────────────────────
  const current_label = energyMix === 'grid_only'      ? 'Grid'
    : energyMix === 'generator_only' ? 'Generator'
    :                                  'Grid + Gen';
  const solar_label = 'With Solar';

  return {
    // System cost
    total_system_cost,
    equipment_cost,
    bos_cost,
    isWithinBudget,
    budgetSurplus,
    budgetShortfall,

    // Cost per kWh
    current_blended_cost,
    post_solar_blended_cost,
    LCOE,
    gen_cost_per_kwh,

    // Monthly & annual
    current_monthly_cost,
    post_solar_monthly_cost,
    monthly_savings,
    annual_savings,

    // Returns
    simple_payback_years,
    ROI,
    lifetime_savings,

    // Fuel
    litres_saved_per_year,
    fuel_naira_saved_annual,

    // Carbon
    co2_avoided_tonnes,

    // Dispatch fractions (post-solar)
    solar_fraction:  parseFloat(solar_fraction.toFixed(3)),
    grid_fraction:   parseFloat(grid_fraction.toFixed(3)),
    gen_fraction:    parseFloat(gen_fraction.toFixed(3)),
    // Pre-solar energy mix shares (used internally for blended cost; NOT for spend breakdown)
    grid_share:      parseFloat(grid_share.toFixed(3)),
    gen_share:       parseFloat(gen_share.toFixed(3)),
    // Actual pre-solar monthly spend by source (straight from user inputs)
    grid_monthly_spend: state.powerSource !== 'generator_only' ? (state.gridSpend || 0) : 0,
    gen_monthly_spend:  state.powerSource !== 'grid_only'      ? (state.fuelSpend || 0) : 0,

    // Cash flow
    cashflow,
    payback_year_index,
    payback_exact,

    // Chart labels
    current_label,
    solar_label,
  };
}
