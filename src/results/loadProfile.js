import { getState } from '../state.js';

const N = v => '₦' + Number(v).toLocaleString('en-NG');

export function renderLoadProfile(container, navigate) {
  const state = getState();
  const { results, location, powerSource, tariffBand, gridSpend, fuelSpend } = state;
  if (!results) { navigate('step1'); return; }
  const { load, solar } = results;

  const powerSourceLabel = {
    grid_only:       'Grid Only',
    generator_only:  'Generator Only',
    both:            'Grid & Generator',
  }[powerSource] || 'Grid & Generator';

  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <h1 style="font-size:36px;font-weight:800;margin-bottom:6px">Your Energy Profile</h1>
      <p style="color:var(--color-text-secondary);font-size:16px;margin-bottom:32px">See how you consume energy in your house</p>

      <div class="load-profile-grid">
        <div>
          <div class="card">
            <div class="section-title" style="margin-bottom:16px">Your Inputs</div>
            <div class="assumption-summary">
              <div class="assumption-item">
                <div class="label">Supply</div>
                <div class="value">${powerSourceLabel}</div>
              </div>
              ${tariffBand && powerSource !== 'generator_only' ? `<div class="assumption-item"><div class="label">Tariff</div><div class="tag tag--amber">${tariffBand}</div></div>` : ''}
              ${gridSpend && powerSource !== 'generator_only' ? `<div class="assumption-item"><div class="label">Grid Spend</div><div class="value">${N(gridSpend)}</div></div>` : ''}
              ${fuelSpend && powerSource !== 'grid_only' ? `<div class="assumption-item"><div class="label">Generator Spend</div><div class="value">${N(fuelSpend)}</div></div>` : ''}
              <div class="assumption-item"><div class="label">Location</div><div class="value">${location?.state || 'N/A'}</div></div>
            </div>
            <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--color-border-light)">
              <button class="btn btn--outline btn--sm" onclick="window._navigate('step1')">Adjust Assumptions</button>
            </div>
          </div>
        </div>

        <div>
          <div class="card" style="margin-bottom:20px;background:#FAFAFA;border:none;position:relative;overflow:hidden">
            <div class="section-title" style="margin-bottom:12px">Solar Irradiance</div>
            <div class="solar-irradiance-card" style="position:relative;z-index:1">
              <div class="irradiance-stats">
                <div class="irradiance-stat-card">
                  <div class="label">Peak Sun Hours</div>
                  <div class="value value--amber" style="font-size:22px;line-height:1.1">${solar.psh}</div>
                  <div class="label" style="font-size:10px;margin-top:2px">hrs / day</div>
                </div>
                <div class="irradiance-stat-card">
                  <div class="label">Annual Irradiance</div>
                  <div class="value value--amber" style="font-size:22px;line-height:1.1">${location?.annual_yield_kwh_per_kwp || 'N/A'}</div>
                  <div class="label" style="font-size:10px;margin-top:2px">kWh / kWp</div>
                </div>
              </div>
            </div>
            <img src="/icons/solar_irradiance_stats.png"
              style="position:absolute;right:-12px;bottom:-28px;width:188px;height:188px;object-fit:contain;opacity:0.88;pointer-events:none;z-index:0">
          </div>

          <div class="card">
            <div class="section-title" style="margin-bottom:16px">Energy Consumption</div>
            <div style="display:flex;gap:28px;align-items:flex-end">
              <div>
                <div class="label">Daily average</div>
                <div class="kwh-day">${load.totalDailyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
              </div>
              <div>
                <div class="label">Monthly average</div>
                <div style="font-size:24px;font-weight:700;color:var(--color-text)">${load.monthlyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  window._navigate = navigate;
}
