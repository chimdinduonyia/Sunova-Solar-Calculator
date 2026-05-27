import { getState, getData } from '../state.js';
import { calcLoad } from '../utils/calcLoad.js';
import { calcSolar } from '../utils/calcSolar.js';
import { calcBattery } from '../utils/calcBattery.js';
import { calcDispatch } from '../utils/calcDispatch.js';

const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function getCategoryEmoji(cat) {
  const map = { Cooling: '❄️', Lighting: '💡', Kitchen: '🍳', Entertainment: '📺', 'ICT / Office': '💻', Laundry: '🫧', Water: '💧', Security: '🔒' };
  return map[cat] || '🔌';
}

function annualGenText(kwh) {
  return kwh >= 1000
    ? `${(kwh / 1000).toFixed(1)} MWh/yr`
    : `${kwh.toLocaleString()} kWh/yr`;
}

function confidenceLabel(score) {
  return score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';
}

export function renderSolarPVSystem(container, navigate) {
  const { results, appliances } = getState();
  if (!results) { navigate('step1'); return; }

  const applianceData = getData('appliances')           || [];
  const tariffData    = getData('tariff_bands')         || [];
  const fuelPrices    = getData('fuel_prices')          || [];
  const genData       = getData('generator_efficiency') || [];

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const hasRealAppliances = appliances && appliances.length > 0;

  // Tracks which appliances are currently active in the interactive profile.
  // Lives in this closure — resets to all-checked on every fresh navigation.
  const activeNames = new Set(appliances.map(a => a.name));

  function computeLive() {
    const state = getState();
    const active = hasRealAppliances
      ? appliances.filter(a => activeNames.has(a.name))
      : appliances;
    // Also strip unchecked appliances from the Gantt schedule so calcLoad
    // does not include their wattage in the hourly profile.
    const activeSet = new Set(active.map(a => a.name));
    const effectiveState = {
      ...state,
      appliances: active,
      customSchedule: state.customSchedule
        ? state.customSchedule.filter(row => activeSet.has(row.name))
        : null,
    };
    const load     = calcLoad(effectiveState, applianceData, tariffData, fuelPrices, genData);
    const solar    = calcSolar(load, state.location);
    const battery  = calcBattery(load, state.goal, state.backupHours);
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

  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <div class="card pv-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
          <div>
            <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Your personalized solar PV system</h2>
            <p style="color:var(--color-text-secondary);font-size:16px">Here is the breakdown of your solar PV system</p>
          </div>
          <div style="display:flex;gap:8px;flex-shrink:0">
            <button class="btn btn--outline" onclick="window._navigate('loadProfile')">📊 Load Summary</button>
            <button class="btn btn--outline" onclick="window._navigate('costSavings')">⚙️ Cost Savings</button>
          </div>
        </div>

        <div class="section-title" style="margin-bottom:12px">System Specs</div>
        <div class="system-specs" style="margin-bottom:32px">
          <div class="spec-card">
            <div class="spec-card__label">Solar PV</div>
            <div class="spec-card__value" id="spec-solar-kwp">${solar.panel_kwp} kWp</div>
            <div class="spec-card__sub" id="spec-solar-count">Capacity · ${solar.panel_count} panels</div>
            <div style="font-size:36px;margin-top:8px">🔆</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Inverter</div>
            <div class="spec-card__value" id="spec-inverter-kva">${solar.inverter_kva} kVA</div>
            <div class="spec-card__sub">Rating</div>
            <div style="font-size:36px;margin-top:8px">⚡</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Battery</div>
            <div class="spec-card__value" id="spec-battery-kwh">${battery.battery_kwh} kWh</div>
            <div class="spec-card__sub" id="spec-battery-units">Storage · ${battery.battery_units_48v} units</div>
            <div style="font-size:36px;margin-top:8px">🔋</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Installation Space</div>
            <div class="spec-card__value" id="spec-area-m2">${solar.installation_m2} m²</div>
            <div class="spec-card__sub">Required</div>
            <div style="font-size:36px;margin-top:8px">📐</div>
          </div>
        </div>

        <div class="solar-three-col">
          <div class="card">
            <div class="section-title" style="margin-bottom:4px">Projected Generation <span class="tag tag--amber" style="font-size:10px">kWh</span></div>
            <div class="value value--amber" id="spec-annual-gen" style="font-size:18px;font-weight:700;margin-bottom:12px">
              ${annualGenText(solar.annual_gen_kwh)}
            </div>
            <canvas id="gen-chart" height="160"></canvas>
          </div>

          <div class="card">
            <div class="section-title" style="margin-bottom:8px">Confidence Score</div>
            <div class="gauge-legend" style="margin-bottom:8px">
              <span><span class="gauge-dot" style="background:#10B981"></span>High</span>
              <span><span class="gauge-dot" style="background:#F59E0B"></span>Medium</span>
              <span><span class="gauge-dot" style="background:#EF4444"></span>Low</span>
            </div>
            <div class="confidence-gauge">
              <canvas id="gauge-chart" height="120" width="200"></canvas>
              <div id="spec-confidence-label" style="font-size:18px;font-weight:700;margin-top:-20px">${load.confidenceLabel || confidenceLabel(load.confidenceScore)}</div>
              <div id="spec-confidence-score" style="font-size:13px;color:var(--color-text-secondary)">${load.confidenceScore}% Confidence</div>
            </div>
            ${load.confidenceScore < 60 ? `
              <div style="margin-top:14px;padding:12px 14px;background:var(--color-primary-bg);border:1.5px solid var(--color-primary-light);border-radius:var(--radius-md);font-size:12px;line-height:1.6;color:var(--color-text-secondary)">
                <strong style="color:var(--color-text)">Boost your confidence score.</strong> Add your appliances and usage schedule to get a <strong>High</strong> confidence result.
                <div style="margin-top:10px"><button class="btn btn--primary btn--sm" onclick="window._navigate('step5')">Add Appliances →</button></div>
              </div>
            ` : ''}
          </div>

          <div class="card" style="overflow:hidden">
            <div class="section-title" style="margin-bottom:6px">Interactive Profile</div>
            ${hasRealAppliances ? `
              <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px">Toggle appliances to see how your system responds</div>
              <div class="interactive-profile" style="padding:0;max-height:210px;overflow-y:auto">
                ${appliances.map(a => `
                  <div class="profile-appliance-row" data-name="${escAttr(a.name)}" style="cursor:pointer;user-select:none">
                    <div class="checkbox ${activeNames.has(a.name) ? 'checked' : ''}"></div>
                    <div class="profile-appliance-row__img-placeholder">${getCategoryEmoji(a.category || '')}</div>
                    <span>${a.name}</span>
                    <span style="margin-left:auto;font-size:12px;color:var(--color-text-muted)">×${a.qty}</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="interactive-profile" style="padding:0">
                ${[{name:'Air Conditioner',qty:1},{name:'Refrigerator',qty:1},{name:'TV',qty:1}].map(a => `
                  <div class="profile-appliance-row">
                    <div class="checkbox checked"></div>
                    <div class="profile-appliance-row__img-placeholder">🔌</div>
                    <span>${a.name}</span>
                    <span style="margin-left:auto;font-size:12px;color:var(--color-text-muted)">×${a.qty}</span>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:12px">
                <button class="btn btn--primary btn--sm" onclick="window._navigate('step5')">Add Appliances to enable →</button>
              </div>
            `}
          </div>
        </div>

        <div style="margin-top:32px">
          <div class="storage-details" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
            <div class="card">
              <div class="section-title" style="margin-bottom:12px">Storage Details</div>
              <div style="display:flex;gap:32px">
                <div class="storage-stat">
                  <div class="label">Capacity</div>
                  <div class="value value--amber" id="spec-storage-cap">${battery.storage_capacity} kWh</div>
                </div>
                <div class="storage-stat">
                  <div class="label">Output</div>
                  <div class="value value--amber" id="spec-storage-out">${battery.storage_output.toFixed(2)} kW</div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="section-title" style="margin-bottom:12px">Backup Potential</div>
              <div class="backup-potential">
                <div class="backup-item"><div class="label">Essentials</div><div class="value value--amber" id="spec-backup-ess">${battery.backup_hours_essentials}hrs</div></div>
                <div class="backup-item"><div class="label">Appliances</div><div class="value value--amber" id="spec-backup-app">${battery.backup_hours_appliances}hrs</div></div>
                <div class="backup-item"><div class="label">Whole home</div><div class="value value--amber" id="spec-backup-home">${battery.backup_hours_whole_home}hrs</div></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="section-title" style="margin-bottom:8px">Hourly Energy Dispatch Simulation</div>
            <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:12px;font-size:12px;color:var(--color-text-secondary)">
              <div id="dispatch-stat-reliance">Grid reliance <strong>${Math.round(dispatch.gridReliance_before*100)}% → ${Math.round(dispatch.gridReliance_after*100)}%</strong></div>
              <div id="dispatch-stat-grid">Avg daily grid use <strong>${dispatch.totalDemand.toFixed(1)} → ${dispatch.avgDailyGridKWh} kWh</strong></div>
              <div id="dispatch-stat-surplus">Avg daily surplus <strong>${dispatch.dailySurplusKWh} kWh</strong></div>
            </div>
            <div style="display:flex;gap:16px;font-size:11px;margin-bottom:8px;flex-wrap:wrap">
              <span><span style="display:inline-block;width:10px;height:10px;background:#FCBF1E;border-radius:2px"></span> Solar</span>
              <span><span style="display:inline-block;width:10px;height:10px;background:#2E86AB;border-radius:2px"></span> Battery</span>
              <span><span style="display:inline-block;width:10px;height:10px;background:#E84855;border-radius:2px"></span> ${dispatch.gridLabel}</span>
              <span><span style="display:inline-block;width:10px;height:10px;background:#A8DADC;border-radius:2px"></span> Charging</span>
            </div>
            <div style="position:relative">
              <canvas id="dispatch-canvas" style="display:block;width:100%"></canvas>
              <div id="dispatch-tooltip" style="display:none;position:absolute;background:#1F2937;color:#F9FAFB;padding:8px 12px;border-radius:8px;font-size:11px;pointer-events:none;z-index:10;min-width:148px;line-height:1.7;box-shadow:0 4px 16px rgba(0,0,0,0.28)"></div>
            </div>
          </div>
        </div>

        <div class="cta-row" style="display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding:28px 32px;background:var(--color-white);border-radius:var(--radius-lg)">
          <div>
            <div style="font-size:var(--font-size-lg);font-weight:800;margin-bottom:4px">Ready to get your solar system?</div>
            <div style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">See a detailed breakdown with product specifications, pricing, and installer options.</div>
          </div>
          <button class="btn btn--primary btn--lg" id="pv-view-quote-btn" style="flex-shrink:0;margin-left:24px">
            See Your Quote →
          </button>
        </div>
      </div>
    </div>
  `;

  window._navigate = navigate;
  document.getElementById('pv-view-quote-btn').addEventListener('click', () => navigate('finalQuote'));
  drawGenChart(solar, months);
  drawGaugeChart(load.confidenceScore);
  requestAnimationFrame(() => drawDispatchCanvas('dispatch-canvas', dispatch));

  if (hasRealAppliances) {
    document.querySelectorAll('.profile-appliance-row[data-name]').forEach(row => {
      row.addEventListener('click', () => {
        const name = row.dataset.name;
        const cb   = row.querySelector('.checkbox');
        if (activeNames.has(name)) {
          activeNames.delete(name);
          cb.classList.remove('checked');
        } else {
          activeNames.add(name);
          cb.classList.add('checked');
        }
        updateLive();
      });
    });
  }

  function updateLive() {
    const { load: l, solar: s, battery: b, dispatch: d } = computeLive();
    const $ = id => document.getElementById(id);

    $('spec-solar-kwp').textContent     = `${s.panel_kwp} kWp`;
    $('spec-solar-count').textContent   = `Capacity · ${s.panel_count} panels`;
    $('spec-inverter-kva').textContent  = `${s.inverter_kva} kVA`;
    $('spec-battery-kwh').textContent   = `${b.battery_kwh} kWh`;
    $('spec-battery-units').textContent = `Storage · ${b.battery_units_48v} units`;
    $('spec-area-m2').textContent       = `${s.installation_m2} m²`;
    $('spec-annual-gen').textContent    = annualGenText(s.annual_gen_kwh);

    $('spec-confidence-label').textContent = l.confidenceLabel || confidenceLabel(l.confidenceScore);
    $('spec-confidence-score').textContent = `${l.confidenceScore}% Confidence`;

    $('spec-storage-cap').textContent  = `${b.storage_capacity} kWh`;
    $('spec-storage-out').textContent  = `${b.storage_output.toFixed(2)} kW`;
    $('spec-backup-ess').textContent   = `${b.backup_hours_essentials}hrs`;
    $('spec-backup-app').textContent   = `${b.backup_hours_appliances}hrs`;
    $('spec-backup-home').textContent  = `${b.backup_hours_whole_home}hrs`;

    $('dispatch-stat-reliance').innerHTML = `Grid reliance <strong>${Math.round(d.gridReliance_before*100)}% → ${Math.round(d.gridReliance_after*100)}%</strong>`;
    $('dispatch-stat-grid').innerHTML     = `Avg daily grid use <strong>${d.totalDemand.toFixed(1)} → ${d.avgDailyGridKWh} kWh</strong>`;
    $('dispatch-stat-surplus').innerHTML  = `Avg daily surplus <strong>${d.dailySurplusKWh} kWh</strong>`;

    drawGenChart(s, months);
    drawGaugeChart(l.confidenceScore);
    drawDispatchCanvas('dispatch-canvas', d);
  }
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

function drawGaugeChart(pct) {
  const canvas = document.getElementById('gauge-chart');
  if (!canvas) return;
  Chart.getChart(canvas)?.destroy();
  const ctx   = canvas.getContext('2d');
  const color = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444';
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [pct, 100 - pct],
        backgroundColor: [color, '#E5E7EB'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270
      }]
    },
    options: { responsive: false, cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
  });
}

function drawDispatchCanvas(canvasId, dispatch) {
  // Replace canvas element to clear any stale event listeners from a prior draw
  let canvas = document.getElementById(canvasId);
  if (!canvas || !dispatch) return;
  const fresh = canvas.cloneNode(false);
  canvas.parentNode.replaceChild(fresh, canvas);
  canvas = fresh;

  const wrapper = canvas.parentElement;
  const dpr  = window.devicePixelRatio || 1;
  const cssW = wrapper.clientWidth || 600;
  const cssH = 220;

  canvas.width  = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const ML = 46, MR = 12, MT = 10, MB = 28;
  const cW = cssW - ML - MR;
  const cH = cssH - MT - MB;

  const hrs    = dispatch.hours;
  const maxVal = Math.max(...hrs.map(h => h.demand + h.solar_to_charge), 0.01);
  const yMax   = maxVal * 1.12;
  const ySc    = cH / yMax;
  const slotW  = cW / 24;
  const bW     = Math.max(4, slotW * 0.60);   // slightly narrower bars
  const CORNER = 5;                             // top-corner radius in px

  const COLORS = { solar: '#FCBF1E', battery: '#2E86AB', grid: '#E84855', charge: '#A8DADC' };

  // Y gridlines + labels
  ctx.font      = '10px Outfit, sans-serif';
  ctx.textAlign = 'right';
  [0, 0.25, 0.5, 0.75, 1.0].forEach(t => {
    const v = yMax * t;
    const y = MT + cH - v * ySc;
    ctx.strokeStyle = '#F3F4F6'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ML, y); ctx.lineTo(ML + cW, y); ctx.stroke();
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(v.toFixed(1), ML - 4, y + 3.5);
  });

  // Rotated Y axis label
  ctx.save();
  ctx.translate(13, MT + cH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center'; ctx.fillStyle = '#6B7280';
  ctx.fillText('kW', 0, 0);
  ctx.restore();

  // Helper: fill rect with rounded top corners only
  function fillRoundedTop(x, y, w, h, r) {
    if (h <= 0) return;
    const R = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + R);
    ctx.quadraticCurveTo(x, y, x + R, y);
    ctx.lineTo(x + w - R, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + R);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
  }

  // Draw bars
  const barRects = [];
  hrs.forEach(d => {
    const segments = [
      { v: d.solar_to_load,   c: COLORS.solar   },
      { v: d.battery_to_load, c: COLORS.battery  },
      { v: d.grid_to_load,    c: COLORS.grid     },
      { v: d.solar_to_charge, c: COLORS.charge   },
    ];

    // Find topmost non-zero segment index for rounded corners
    let topIdx = -1;
    for (let i = segments.length - 1; i >= 0; i--) {
      if (segments[i].v >= 0.001) { topIdx = i; break; }
    }

    const bx    = ML + d.hour * slotW + (slotW - bW) / 2;
    const baseY = MT + cH;
    let sy      = baseY;

    segments.forEach((seg, i) => {
      if (seg.v < 0.001) return;
      const pH = seg.v * ySc;
      sy -= pH;
      ctx.fillStyle = seg.c;
      if (i === topIdx) {
        fillRoundedTop(bx, sy, bW, pH, CORNER);
      } else {
        ctx.fillRect(bx, sy, bW, pH);
      }
    });

    barRects.push({ bx, bW, topY: sy, bottomY: baseY, d });
  });

  // X axis line
  ctx.strokeStyle = '#D1D5DB'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ML, MT + cH); ctx.lineTo(ML + cW, MT + cH); ctx.stroke();

  // X axis labels every 3 hours
  ctx.fillStyle = '#6B7280'; ctx.textAlign = 'center';
  ctx.font = '9px Outfit, sans-serif';
  for (let h = 0; h < 24; h += 3) {
    const lbl = h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`;
    ctx.fillText(lbl, ML + h * slotW + slotW / 2, cssH - 6);
  }

  // Tooltip
  const tooltip = document.getElementById('dispatch-tooltip');

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = barRects.find(r => mx >= r.bx && mx <= r.bx + r.bW);

    if (!hit || my < MT || my > MT + cH) {
      if (tooltip) tooltip.style.display = 'none';
      return;
    }

    const d   = hit.d;
    const hr  = d.hour;
    const lbl = hr === 0 ? '12am' : hr < 12 ? `${hr}am` : hr === 12 ? '12pm' : `${hr - 12}pm`;

    if (tooltip) {
      let tx = mx + 14, ty = my - 106;
      if (tx + 152 > cssW) tx = mx - 166;
      if (ty < 0) ty = my + 14;
      tooltip.style.left    = tx + 'px';
      tooltip.style.top     = ty + 'px';
      tooltip.style.display = 'block';
      tooltip.innerHTML = `
        <div style="font-weight:700;margin-bottom:5px;font-size:12px">${lbl}</div>
        <div><span style="color:${COLORS.solar}">■</span> Solar: ${d.solar_to_load.toFixed(2)} kW</div>
        <div><span style="color:${COLORS.battery}">■</span> Battery: ${d.battery_to_load.toFixed(2)} kW</div>
        <div><span style="color:${COLORS.grid}">■</span> ${dispatch.gridLabel}: ${d.grid_to_load.toFixed(2)} kW</div>
        <div><span style="color:${COLORS.charge}">■</span> Charging: ${d.solar_to_charge.toFixed(2)} kW</div>
        <div style="margin-top:5px;padding-top:5px;border-top:1px solid #374151;color:#A8B4C4;font-size:10px">SoC: ${d.soc_pct.toFixed(1)}%</div>
      `;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    if (tooltip) tooltip.style.display = 'none';
  });
}
