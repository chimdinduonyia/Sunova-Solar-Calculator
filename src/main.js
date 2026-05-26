import { setData } from './state.js';
import { init } from './router.js';

async function loadData() {
  const [pvYield, appliances, usagePatterns, tariffBands, fuelPrices, generatorEfficiency, houseTypeAppliances] = await Promise.all([
    import('./data/pv_yield.json', { assert: { type: 'json' } }),
    import('./data/appliances.json', { assert: { type: 'json' } }),
    import('./data/usage_patterns.json', { assert: { type: 'json' } }),
    import('./data/tariff_bands.json', { assert: { type: 'json' } }),
    import('./data/fuel_prices.json', { assert: { type: 'json' } }),
    import('./data/generator_efficiency.json', { assert: { type: 'json' } }),
    import('./data/house_type_appliances.json', { assert: { type: 'json' } })
  ]);

  setData('pv_yield', pvYield.default);
  setData('appliances', appliances.default);
  setData('usage_patterns', usagePatterns.default);
  setData('tariff_bands', tariffBands.default);
  setData('fuel_prices', fuelPrices.default);
  setData('generator_efficiency', generatorEfficiency.default);
  setData('house_type_appliances', houseTypeAppliances.default);
}

async function bootstrap() {
  await loadData();
  init();
}

bootstrap();
