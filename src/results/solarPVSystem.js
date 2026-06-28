import { getState, getData } from '../state.js';
import { showMiniPreloader } from '../preloader.js';
import { calcLoad } from '../utils/calcLoad.js';
import { calcSolar } from '../utils/calcSolar.js';
import { calcBattery } from '../utils/calcBattery.js';
import { calcDispatch } from '../utils/calcDispatch.js';

function annualGenText(kwh) {
  return kwh >= 1000
    ? `${(kwh / 1000).toFixed(1)} MWh/yr`
    : `${kwh.toLocaleString()} kWh/yr`;
}

export function renderSolarPVSystem(container, navigate) {
  const { results } = getState();
  if (!results) { navigate('step1'); return; }

  const tariffData    = getData('tariff_bands')         || [];
  const fuelPrices    = getData('fuel_prices')          || [];
  const genData       = getData('generator_efficiency') || [];

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const { powerSource } = getState();
  const gridRelianceLabel = powerSource === 'grid_only'      ? 'Grid Reliance (Grid)'
                          : powerSource === 'generator_only' ? 'Grid Reliance (Gen)'
                          :                                    'Grid Reliance (Grid + Gen)';

  function computeLive() {
    const state = getState();
    const load     = calcLoad(state, tariffData, fuelPrices, genData);
    const battery  = calcBattery(load, state.goal, state.backupHours);
    const solar    = calcSolar(load, state.location, state.goal, battery.battery_kwh);
    const dispatch = calcDispatch({
      hourlyProfile: load.hourlyProfile,
      pvKWp:         solar.panel_kwp,
      batteryKWh:    battery.battery_kwh,
      dailyYield:    state.location?.daily_yield_kwh_per_kwp || 4.5,
      energyMix:     state.powerSource,
    });
    return { load, solar, battery, dispatch };
  }

  const { load, solar, battery, dispatch } = computeLive();

  const tip = text => `<span class="confidence-tooltip-wrap" style="display:inline-flex;vertical-align:middle;margin-left:4px"><button class="confidence-tooltip-btn" type="button">?</button><span class="confidence-tooltip-box">${text}</span></span>`;

  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <div class="card pv-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
          <div>
            <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Your personalized solar PV system</h2>
            <p style="color:var(--color-text-secondary);font-size:16px">Here is the breakdown of your solar PV system</p>
          </div>
        </div>

        <div class="section-title" style="margin-bottom:12px">System Specs</div>
        <div class="system-specs" style="margin-bottom:32px">
          <div class="spec-card">
            <div class="spec-card__label">Solar PV ${tip('The total power output of your panels under ideal sunlight. A larger system generates more electricity and covers more of your daily load.')}</div>
            <div class="spec-card__value" id="spec-solar-kwp">${solar.panel_kwp} kWp</div>
            <div class="spec-card__sub" id="spec-solar-count">Capacity · ${solar.panel_count} panels</div>
            <div style="font-size:36px;margin-top:8px">🔆</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Inverter ${tip('Converts solar DC power to AC electricity for your home. Sized to handle your peak demand without cutting out.')}</div>
            <div class="spec-card__value" id="spec-inverter-kva">${solar.inverter_kva} kVA</div>
            <div class="spec-card__sub">Rating</div>
            <div style="font-size:36px;margin-top:8px">⚡</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Battery ${tip('Total energy storage capacity. This determines how long your home can run on stored solar power when there is no sunlight.')}</div>
            <div class="spec-card__value" id="spec-battery-kwh">${battery.battery_kwh} kWh</div>
            <div class="spec-card__sub" id="spec-battery-units">Storage · ${battery.battery_units_48v} units</div>
            <div style="font-size:36px;margin-top:8px">🔋</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Mounting Space ${tip('The approximate roof area needed to mount all your solar panels.')}</div>
            <div class="spec-card__value" id="spec-area-m2">${solar.installation_m2} m²</div>
            <div class="spec-card__sub">Required</div>
            <div style="font-size:36px;margin-top:8px">📐</div>
          </div>
        </div>

        <!-- ── System detail cards ───────────────────────── -->
        <div class="storage-details" style="margin-top:0">
          <div class="card">
            <div class="section-title" style="margin-bottom:4px">Projected Generation <span class="tag tag--amber" style="font-size:10px">kWh</span></div>
            <div class="value value--amber" id="spec-annual-gen" style="font-size:18px;font-weight:700;margin-bottom:12px">${annualGenText(solar.annual_gen_kwh)}</div>
            <canvas id="gen-chart" height="140"></canvas>
          </div>
          <div class="card">
            <div class="section-title" style="margin-bottom:12px">Storage Details</div>
            <div style="display:flex;gap:32px;margin-bottom:20px">
              <div class="storage-stat"><div class="label">Capacity</div><div class="value value--amber" id="spec-storage-cap">${battery.storage_capacity} kWh</div></div>
              <div class="storage-stat"><div class="label">Output</div><div class="value value--amber" id="spec-storage-out">${battery.storage_output.toFixed(2)} kW</div></div>
            </div>
            <div class="section-title" style="margin-bottom:10px">Backup Potential</div>
            <div class="backup-potential">
              <div class="backup-item"><div class="label">Essentials</div><div class="value value--amber" id="spec-backup-ess">${battery.backup_hours_essentials}hrs</div></div>
              <div class="backup-item"><div class="label">Appliances</div><div class="value value--amber" id="spec-backup-app">${battery.backup_hours_appliances}hrs</div></div>
              <div class="backup-item"><div class="label">Whole home</div><div class="value value--amber" id="spec-backup-home">${battery.backup_hours_whole_home}hrs</div></div>
            </div>
          </div>
          <div class="card" style="grid-column:1/-1">
            <div class="section-title" style="margin-bottom:12px">${gridRelianceLabel}</div>
            <div style="display:flex;gap:32px;flex-wrap:wrap">
              <div class="storage-stat">
                <div class="label">Before Solar</div>
                <div class="value" style="color:var(--color-text-muted)" id="dispatch-stat-reliance-before">${Math.round(dispatch.gridReliance_before * 100)}%</div>
              </div>
              <div class="storage-stat">
                <div class="label">After Solar</div>
                <div class="value value--amber" id="dispatch-stat-reliance-after">${Math.round(dispatch.gridReliance_after * 100)}%</div>
              </div>
              <div class="storage-stat">
                <div class="label">Avg Daily Grid Use</div>
                <div class="value value--amber" id="dispatch-stat-grid"><span style="color:var(--color-text-muted)">${dispatch.totalDemand.toFixed(1)}</span> → ${dispatch.avgDailyGridKWh} kWh</div>
              </div>
              <div class="storage-stat">
                <div class="label">Avg Daily Surplus</div>
                <div class="value value--amber" id="dispatch-stat-surplus">${dispatch.dailySurplusKWh} kWh</div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:28px;padding-top:24px;border-top:1px solid var(--color-border-light);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <div>
            <div style="font-size:17px;font-weight:700;margin-bottom:4px">Ready to go solar?</div>
            <p style="color:var(--color-text-secondary);font-size:14px;margin:0;max-width:420px;line-height:1.5">We'll match you with vetted installers near you. They see your exact energy needs and send in real quotes.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn--primary" id="pv-cta-installers-btn">See installers near me</button>
            <button class="btn btn--outline" id="pv-cta-adjust-btn">Adjust Inputs</button>
          </div>
        </div>

      </div>
    </div>
  `;

  window._navigate = navigate;

  document.getElementById('pv-cta-installers-btn')
    ?.addEventListener('click', () =>
      showMiniPreloader('Finding installers near you…', 5000, () => navigate('market')));
  document.getElementById('pv-cta-adjust-btn')
    ?.addEventListener('click', () => navigate('step1'));

  // Tooltip click-to-open for mobile (hover handles desktop via CSS)
  document.querySelectorAll('.confidence-tooltip-wrap').forEach(wrap => {
    wrap.querySelector('.confidence-tooltip-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = wrap.classList.contains('is-open');
      document.querySelectorAll('.confidence-tooltip-wrap.is-open').forEach(w => w.classList.remove('is-open'));
      if (!isOpen) wrap.classList.add('is-open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.confidence-tooltip-wrap.is-open').forEach(w => w.classList.remove('is-open'));
  });
  drawGenChart(solar, months);
}

function drawGenChart(solar, months) {
  const canvas = document.getElementById('gen-chart');
  if (!canvas) return;
  Chart.getChart(canvas)?.destroy();
  const ctx = canvas.getContext('2d');
  const vals = solar.monthly_gen.map(m => m.kwh);
  const max  = Math.max(...vals);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{ data: vals, backgroundColor: vals.map(v => v / max > 0.9 ? '#EF4444' : v / max > 0.75 ? '#F5A623' : '#FCD34D'), borderRadius: 8, barPercentage: 0.5, categoryPercentage: 0.8 }]
    },
    options: { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.raw} kWh` } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 9, family: 'Outfit, sans-serif' } } }, y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 9, family: 'Outfit, sans-serif' }, callback: v => `${v}` } } } }
  });
}

