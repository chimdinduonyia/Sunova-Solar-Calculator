const GEN_MAP = {
  small: { types: ['Small Portable'], litres_per_hour: 0.55 },
  medium: { types: ['Mid-size'], litres_per_hour: 1.0 },
  large: { types: ['Large Home'], litres_per_hour: 2.4 }
};

export function calcFuel(fuelSpend, generatorSize, fuelPrices, genData) {
  if (!fuelSpend || fuelSpend === 0) {
    return { monthly_spend: 0, annual_spend: 0, annual_savings: 0, litres_per_month: 0, hours_per_month: 0, fuel_type: 'PMS' };
  }

  const genConfig = GEN_MAP[generatorSize] || GEN_MAP.medium;
  const fuelType = generatorSize === 'large' ? 'AGO (Diesel)' : 'PMS (Petrol)';
  const priceEntry = fuelPrices.find(f => f.fuel_type === fuelType) || fuelPrices[0];
  const price_per_litre = priceEntry?.price_per_litre_naira || 1030;

  const litres_per_month = Math.round(fuelSpend / price_per_litre);
  const hours_per_month = parseFloat((litres_per_month / genConfig.litres_per_hour).toFixed(1));
  const annual_spend = fuelSpend * 12;
  const solar_residual = fuelSpend * 0.05;
  const annual_savings = Math.round((fuelSpend - solar_residual) * 12);
  const litres_saved_annual = Math.round(litres_per_month * 11.4);

  return {
    monthly_spend: fuelSpend,
    annual_spend,
    annual_savings,
    litres_per_month,
    hours_per_month,
    litres_saved_annual,
    fuel_type: fuelType,
    price_per_litre
  };
}
