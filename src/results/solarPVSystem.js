import { getState, setState } from '../state.js';
import { showMiniPreloader } from '../preloader.js';
import { computeResults } from '../utils/computeResults.js';

export function renderSolarPVSystem(container, navigate) {
  const { results, reportPersona, backupHours: initBackupHours } = getState();
  if (!results) { navigate('step1'); return; }

  const isAutonomy = reportPersona === 'autonomy';

  renderContent(container, navigate, isAutonomy);
}

function renderContent(container, navigate, isAutonomy) {
  const { results, backupHours } = getState();
  const { solar, battery, dispatch, inverter_battery_only: invBattOnly } = results;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const { powerSource } = getState();
  const gridRelianceLabel = powerSource === 'grid_only'      ? 'Grid Reliance (Grid)'
                          : powerSource === 'generator_only' ? 'Generator Reliance'
                          :                                    'Grid Reliance (Grid + Gen)';
  const gridUseLabel      = powerSource === 'generator_only' ? 'generator' : 'grid';

  const tip = text => `<span class="confidence-tooltip-wrap" style="display:inline-flex;vertical-align:middle;margin-left:4px"><button class="confidence-tooltip-btn" type="button">?</button><span class="confidence-tooltip-box">${text}</span></span>`;

  function annualGenText(kwh) {
    return kwh >= 1000 ? `${(kwh / 1000).toFixed(1)} MWh/yr` : `${kwh.toLocaleString()} kWh/yr`;
  }

  const pageTitle = isAutonomy ? 'Recommended Solar System' : (invBattOnly ? 'Your backup power recommendation' : 'Your personalized solar PV system');
  const pageSub   = isAutonomy
    ? 'Designed for your home\'s evening peak and night backup window.'
    : (invBattOnly
        ? 'Sized for your energy needs. Add solar panels later as your consumption grows.'
        : 'Here is the breakdown of your solar PV system');

  const solarKwpStr   = invBattOnly ? '--.-- kWp'         : `${solar.panel_kwp} kWp`;
  const solarPanelStr = invBattOnly ? 'Capacity · -- panels' : `Capacity · ${solar.panel_count} panels`;
  const mountingStr   = invBattOnly ? '--.-- m²'           : `${solar.installation_m2} m²`;

  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <div class="card pv-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:${isAutonomy ? '16px' : '24px'}">
          <div>
            <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">${pageTitle}</h2>
            <p style="color:var(--color-text-secondary);font-size:16px">${pageSub}</p>
          </div>
        </div>

        ${isAutonomy ? `
        <div class="backup-hrs-control" style="display:flex;align-items:center;gap:16px;background:var(--color-primary-bg);border:1px solid var(--color-primary-light);border-radius:10px;padding:12px 16px;margin-bottom:24px;flex-wrap:wrap">
          <span style="font-size:14px;color:var(--color-text-secondary)">Choose your target backup hours</span>
          <div style="display:flex;align-items:center;gap:10px">
            <button id="backup-hrs-minus" style="width:32px;height:32px;border:1.5px solid var(--color-primary);border-radius:8px;background:none;font-size:18px;font-weight:700;color:var(--color-primary);cursor:pointer;line-height:1">-</button>
            <span id="backup-hrs-val" style="font-size:20px;font-weight:800;color:var(--color-primary);min-width:44px;text-align:center">${backupHours}h</span>
            <button id="backup-hrs-plus" style="width:32px;height:32px;border:1.5px solid var(--color-primary);border-radius:8px;background:none;font-size:18px;font-weight:700;color:var(--color-primary);cursor:pointer;line-height:1">+</button>
          </div>
          <span style="font-size:12px;color:var(--color-text-muted)">System resizes automatically</span>
        </div>
        ` : ''}

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <div class="section-title" style="margin-bottom:0">System Specs</div>
          ${invBattOnly ? `<span class="pill--amber" style="font-size:11px">Inverter + Battery</span>` : ''}
          ${isAutonomy ? `<span class="pill--amber" style="font-size:11px">Backup + Solar</span>` : ''}
        </div>
        <div class="system-specs" style="margin-bottom:24px">
          <div class="spec-card" style="${invBattOnly ? 'opacity:0.45' : ''}">
            <div class="spec-card__label">Solar PV ${tip('The total power output of your panels under ideal sunlight.')}</div>
            <div class="spec-card__value" id="spec-solar-kwp">${solarKwpStr}</div>
            <div class="spec-card__sub" id="spec-solar-count">${solarPanelStr}</div>
            <div style="font-size:36px;margin-top:8px">🔆</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Inverter ${tip('Converts solar DC power to AC electricity. Sized to handle your peak demand.')}</div>
            <div class="spec-card__value" id="spec-inverter-kva">${solar.inverter_kva} kVA</div>
            <div class="spec-card__sub">Rating</div>
            <div style="font-size:36px;margin-top:8px">⚡</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Battery ${tip('Total storage capacity. Determines how long your home runs on stored solar power.')}</div>
            <div class="spec-card__value" id="spec-battery-kwh">${battery.battery_kwh} kWh</div>
            <div class="spec-card__sub" id="spec-battery-units">Storage · ${battery.battery_units_48v} units</div>
            <div style="font-size:36px;margin-top:8px">🔋</div>
          </div>
          <div class="spec-card" style="${invBattOnly ? 'opacity:0.45' : ''}">
            <div class="spec-card__label">Mounting Space ${tip('Approximate roof area needed for your solar panels.')}</div>
            <div class="spec-card__value" id="spec-area-m2">${mountingStr}</div>
            <div class="spec-card__sub">${invBattOnly ? 'Not required' : 'Required'}</div>
            <div style="font-size:36px;margin-top:8px">📐</div>
          </div>
        </div>

        <div class="storage-details">
          <!-- Left: dispatch chart (autonomy) or gen chart (savings) -->
          <div class="card">
            ${isAutonomy ? `
              <div style="font-size:15px;font-weight:700;margin-bottom:6px">A Day in Your Home</div>
              <div style="font-size:11px;color:#6B7280;display:flex;flex-wrap:wrap;gap:20px;margin-bottom:6px">
                <span>${gridRelianceLabel} <strong id="dispatch-stat-reliance">${Math.round(dispatch.gridReliance_before * 100)}% → ${Math.round(dispatch.gridReliance_after * 100)}%</strong></span>
                <span>Avg daily ${gridUseLabel} use <strong id="dispatch-stat-grid">${dispatch.totalDemand.toFixed(1)} → ${dispatch.avgDailyGridKWh} kWh</strong></span>
                <span>Avg daily surplus <strong id="dispatch-stat-surplus">${dispatch.dailySurplusKWh} kWh</strong></span>
              </div>
              <p style="font-size:10px;color:var(--color-text-muted);margin:0 0 10px">Based on a typical Nigerian residential home usage pattern with evening peak (7–10pm).</p>
              <div style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:10px">
                <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#6B7280"><span style="width:12px;height:12px;background:#FCBF1E;border-radius:2px;display:inline-block"></span>Solar</span>
                <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#6B7280"><span style="width:12px;height:12px;background:#1E3A5F;border-radius:2px;display:inline-block"></span>Battery</span>
                <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#6B7280"><span style="width:12px;height:12px;background:#EF4444;border-radius:2px;display:inline-block"></span>${dispatch.gridLabel || 'Grid'}</span>
                <span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#6B7280"><span style="width:12px;height:12px;background:#7DD3E8;border-radius:2px;display:inline-block"></span>Charging</span>
              </div>
              <canvas id="dispatch-chart" height="220"></canvas>
            ` : `
              <div class="section-title" style="margin-bottom:4px">Projected Generation ${invBattOnly ? '' : `<span class="pill--amber">kWh</span>`}</div>
              ${invBattOnly
                ? `<div class="value value--amber" style="font-size:18px;font-weight:700;margin-bottom:12px">N/A (backup only)</div><p style="font-size:12px;color:var(--color-text-muted);line-height:1.6;margin:0">No solar panels in this configuration.</p>`
                : `<div class="value value--amber" id="spec-annual-gen" style="font-size:18px;font-weight:700;margin-bottom:12px">${annualGenText(solar.annual_gen_kwh)}</div><canvas id="gen-chart" height="140"></canvas>`
              }
            `}
          </div>

          <!-- Right: storage + reliance stacked (autonomy) or storage alone (savings) -->
          ${isAutonomy ? `
          <div style="display:flex;flex-direction:column;gap:24px">
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
            <div class="card">
              <div class="section-title" style="margin-bottom:12px">${gridRelianceLabel}</div>
              <div style="display:flex;gap:24px;flex-wrap:wrap">
                <div class="storage-stat"><div class="label">Before Solar</div><div class="value" style="color:var(--color-text-muted)">${Math.round(dispatch.gridReliance_before * 100)}%</div></div>
                <div class="storage-stat"><div class="label">After Solar</div><div class="value value--amber" id="dispatch-reliance-after">${Math.round(dispatch.gridReliance_after * 100)}%</div></div>
                <div class="storage-stat"><div class="label">Daily ${gridUseLabel.charAt(0).toUpperCase() + gridUseLabel.slice(1)} Use</div><div class="value value--amber"><span style="color:var(--color-text-muted)">${dispatch.totalDemand.toFixed(1)}</span> → <span id="dispatch-surplus-inline">${dispatch.avgDailyGridKWh}</span> kWh</div></div>
                <div class="storage-stat"><div class="label">Daily Surplus</div><div class="value value--amber" id="dispatch-surplus">${dispatch.dailySurplusKWh} kWh</div></div>
              </div>
            </div>
          </div>
          ` : `
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
              <div class="storage-stat"><div class="label">Before Solar</div><div class="value" style="color:var(--color-text-muted)">${Math.round(dispatch.gridReliance_before * 100)}%</div></div>
              <div class="storage-stat"><div class="label">After Solar</div><div class="value value--amber" id="dispatch-reliance-after">${Math.round(dispatch.gridReliance_after * 100)}%</div></div>
              <div class="storage-stat"><div class="label">Avg Daily ${gridUseLabel.charAt(0).toUpperCase() + gridUseLabel.slice(1)} Use</div><div class="value value--amber"><span style="color:var(--color-text-muted)">${dispatch.totalDemand.toFixed(1)}</span> → ${dispatch.avgDailyGridKWh} kWh</div></div>
              <div class="storage-stat"><div class="label">Avg Daily Surplus</div><div class="value value--amber" id="dispatch-surplus">${dispatch.dailySurplusKWh} kWh</div></div>
            </div>
          </div>
          `}
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

  if (isAutonomy) bindBackupHoursControl(container, navigate);

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

  if (isAutonomy) {
    drawDispatchChart(dispatch);
  } else if (!invBattOnly) {
    drawGenChart(solar, months);
  }
}

function bindBackupHoursControl(container, navigate) {
  const minusBtn = document.getElementById('backup-hrs-minus');
  const plusBtn  = document.getElementById('backup-hrs-plus');
  const valEl    = document.getElementById('backup-hrs-val');
  if (!minusBtn || !plusBtn) return;

  function updateHours(delta) {
    const current = getState().backupHours || 6;
    const next = Math.max(2, Math.min(16, current + delta));
    if (next === current) return;
    setState({ backupHours: next });
    valEl.textContent = `${next}h`;
    computeResults();
    refreshSpecCards();
  }

  minusBtn.addEventListener('click', () => updateHours(-1));
  plusBtn.addEventListener('click',  () => updateHours(+1));
}

function refreshSpecCards() {
  const { results } = getState();
  if (!results) return;
  const { solar, battery, dispatch } = results;
  const invBattOnly = results.inverter_battery_only;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('spec-solar-kwp',    invBattOnly ? '--.-- kWp'         : `${solar.panel_kwp} kWp`);
  set('spec-solar-count',  invBattOnly ? 'Capacity · -- panels' : `Capacity · ${solar.panel_count} panels`);
  set('spec-inverter-kva', `${solar.inverter_kva} kVA`);
  set('spec-battery-kwh',  `${battery.battery_kwh} kWh`);
  set('spec-battery-units',`Storage · ${battery.battery_units_48v} units`);
  set('spec-area-m2',      invBattOnly ? '--.-- m²' : `${solar.installation_m2} m²`);
  set('spec-storage-cap',  `${battery.storage_capacity} kWh`);
  set('spec-storage-out',  `${battery.storage_output.toFixed(2)} kW`);
  set('spec-backup-ess',   `${battery.backup_hours_essentials}hrs`);
  set('spec-backup-app',   `${battery.backup_hours_appliances}hrs`);
  set('spec-backup-home',  `${battery.backup_hours_whole_home}hrs`);
  set('dispatch-reliance-after',  `${Math.round(dispatch.gridReliance_after * 100)}%`);
  set('dispatch-surplus',         `${dispatch.dailySurplusKWh} kWh`);
  set('dispatch-stat-reliance',   `${Math.round(dispatch.gridReliance_before * 100)}% → ${Math.round(dispatch.gridReliance_after * 100)}%`);
  set('dispatch-stat-grid',       `${dispatch.totalDemand.toFixed(1)} → ${dispatch.avgDailyGridKWh} kWh`);
  set('dispatch-stat-surplus',    `${dispatch.dailySurplusKWh} kWh`);

  // Sync costSavings hero strip (same DOM, scroll layout)
  const { savings } = results;
  const state = getState();
  set('hero-backup-hours',        `${state.backupHours}h`);
  if (savings) set('hero-solar-independence', `${Math.round(savings.solar_fraction * 100)}%`);
  if (savings) set('hero-system-cost', '₦' + Number(savings.total_system_cost).toLocaleString('en-NG'));

  drawDispatchChart(dispatch);
}

function drawDispatchChart(dispatch) {
  const canvas = document.getElementById('dispatch-chart');
  if (!canvas) return;
  Chart.getChart(canvas)?.destroy();
  const ctx = canvas.getContext('2d');

  const hours = dispatch.hours || [];

  const fmtHour = h => {
    if (h === 0)  return '12am';
    if (h < 12)   return `${h}am`;
    if (h === 12) return '12pm';
    return `${h - 12}pm`;
  };

  const labels = hours.map(h => fmtHour(h.hour));

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Solar',    data: hours.map(h => parseFloat(h.solar_to_load.toFixed(2))),   backgroundColor: '#FCBF1E', stack: 'e' },
        { label: 'Battery',  data: hours.map(h => parseFloat(h.battery_to_load.toFixed(2))), backgroundColor: '#1E3A5F', stack: 'e' },
        { label: dispatch.gridLabel || 'Grid', data: hours.map(h => parseFloat(h.grid_to_load.toFixed(2))), backgroundColor: '#EF4444', stack: 'e' },
        { label: 'Charging', data: hours.map(h => parseFloat(h.solar_to_charge.toFixed(2))), backgroundColor: '#7DD3E8', stack: 'e' },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17,24,39,0.95)',
          titleColor: '#ffffff',
          bodyColor: '#E5E7EB',
          footerColor: '#9CA3AF',
          padding: { x: 12, y: 10 },
          titleFont: { size: 12, weight: 'bold', family: 'Outfit, sans-serif' },
          bodyFont: { size: 11, family: 'Outfit, sans-serif' },
          footerFont: { size: 10, family: 'Outfit, sans-serif' },
          callbacks: {
            title:  items => items[0]?.label || '',
            label:  c => `${c.dataset.label}: ${Number(c.raw).toFixed(2)} kW`,
            footer: items => {
              const idx = items[0]?.dataIndex;
              return idx != null ? `Battery Level (SoC): ${hours[idx]?.soc_pct ?? '--'}%` : '';
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            font: { size: 9, family: 'Outfit, sans-serif' },
            maxRotation: 0,
            callback: (_, i) => i % 3 === 0 ? labels[i] : '',
          },
        },
        y: {
          stacked: true,
          grid: { color: '#F3F4F6' },
          ticks: { font: { size: 9, family: 'Outfit, sans-serif' }, callback: v => v.toFixed(1) },
          title: { display: true, text: 'kW', font: { size: 9 } },
        },
      },
    },
  });
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
      datasets: [{ data: vals, backgroundColor: vals.map(v => max > 0 && v / max > 0.9 ? '#EF4444' : max > 0 && v / max > 0.75 ? '#F5A623' : '#FCD34D'), borderRadius: 8, barPercentage: 0.5, categoryPercentage: 0.8 }],
    },
    options: { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.raw} kWh` } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 9, family: 'Outfit, sans-serif' } } }, y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 9, family: 'Outfit, sans-serif' }, callback: v => `${v}` } } } },
  });
}
