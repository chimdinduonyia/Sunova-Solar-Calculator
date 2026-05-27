import { getState, getData } from '../state.js';

const N = v => '₦' + Number(v).toLocaleString('en-NG');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Monthly cooling demand index per climate zone (raw — normalised before use)
const COOLING_INDEX = {
  north:  [0.60, 0.80, 1.30, 1.45, 1.30, 0.85, 0.70, 0.72, 0.90, 1.10, 0.75, 0.60],
  middle: [0.75, 0.90, 1.25, 1.35, 1.15, 0.82, 0.68, 0.70, 0.85, 1.05, 0.85, 0.72],
  south:  [1.10, 1.20, 1.30, 1.20, 1.00, 0.70, 0.65, 0.65, 0.80, 1.00, 1.10, 1.05]
};

function climateZone(zone) {
  if (!zone) return 'south';
  if (/North West|North East/i.test(zone)) return 'north';
  if (/North Central/i.test(zone)) return 'middle';
  return 'south';
}

function calcSeasonalMonthly(load, appliances, applianceData, zone) {
  const appMap = {};
  (applianceData || []).forEach(a => { appMap[a.name] = a; });

  let coolingW = 0, totalW = 0;
  (appliances || []).forEach(sel => {
    const def = appMap[sel.name];
    if (!def) return;
    const w = def.rated_watts * (sel.qty || 1);
    totalW += w;
    if (def.category === 'Cooling') coolingW += w;
  });

  const coolingFrac = totalW > 0 ? coolingW / totalW : 0.35;
  const raw = COOLING_INDEX[climateZone(zone)];
  const avg = raw.reduce((s, v) => s + v, 0) / 12;
  const norm = raw.map(f => f / avg);          // normalise so average factor = 1.0

  const baseDaily = load.totalDailyKWh;
  const coolingDaily = baseDaily * coolingFrac;
  const otherDaily = baseDaily - coolingDaily;

  return norm.map(f => parseFloat(((otherDaily + coolingDaily * f) * 30).toFixed(1)));
}

export function renderLoadProfile(container, navigate) {
  const state = getState();
  const applianceData = getData('appliances') || [];
  const { results, location, powerSource, tariffBand, gridSpend, fuelSpend, appliances } = state;
  if (!results) { navigate('step1'); return; }
  const { load, solar } = results;

  const hasAppliances = appliances && appliances.length > 0;
  const powerSourceLabel = {
    grid_only: 'Grid Only',
    generator_only: 'Generator Only',
    both: 'Grid & Generator'
  }[powerSource] || 'Grid & Generator';

  // Pre-compute for captions
  const appMap = {};
  applianceData.forEach(a => { appMap[a.name] = a; });
  let coolingW = 0, totalW = 0;
  (appliances || []).forEach(sel => {
    const def = appMap[sel.name];
    if (!def) return;
    const w = def.rated_watts * (sel.qty || 1);
    totalW += w;
    if (def.category === 'Cooling') coolingW += w;
  });
  const coolingPct = totalW > 0 ? Math.round(coolingW / totalW * 100) : 35;
  const zone = location?.zone || '';
  const climate = climateZone(zone);
  const climateDesc = {
    north:  'Northern Nigeria: peak cooling March to May, cool harmattan Nov to Feb',
    middle: 'Middle Belt: peak cooling March to May, mild rainy dip Jun to Sep',
    south:  'Southern Nigeria: peak cooling Feb to Apr, rainy season dip Jun to Sep'
  }[climate];

  const consumptionCard = hasAppliances ? `
    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Energy Consumption</div>
      <div class="chart-header-row" style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px">
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
        <select id="chart-view-sel" class="gantt-select">
          <option value="hourly">Hourly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <canvas id="load-chart" height="180"></canvas>
      <div id="chart-caption" style="margin-top:10px;font-size:11px;color:var(--color-text-muted);line-height:1.5"></div>
    </div>
  ` : `
    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Energy Consumption</div>
      <div style="display:flex;gap:28px;align-items:flex-end;margin-bottom:16px">
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
  `;

  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <h1 style="font-size:36px;font-weight:800;margin-bottom:6px">Your Energy Profile</h1>
      <p style="color:var(--color-text-secondary);font-size:16px;margin-bottom:32px">See how you consume energy in your house</p>

      <div class="load-profile-grid">
        <div>
          <div class="card" style="margin-bottom:20px">
            <div class="section-title" style="margin-bottom:16px">Assumption Summary</div>
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
          </div>

          <div class="card" style="margin-bottom:20px;background:#FAFAFA;border:none">
            <div class="section-title" style="margin-bottom:12px">Solar Irradiance</div>
            <div class="solar-irradiance-card">
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
              <div class="irradiance-sun">☀️</div>
            </div>
          </div>

          ${consumptionCard}
        </div>

        <div>
          <div class="pv-ready-card">
            <div class="pv-ready-card__overlay">
              <h2>Your Solar PV<br>System is <span>Ready</span></h2>
              <p>Get your personalized energy data with accurate recommendation to boost your energy efficiency and overall usage.</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn btn--outline" onclick="window._navigate('costSavings')">⚙️ Cost Savings</button>
                <button class="btn btn--primary" onclick="window._navigate('solarPVSystem')">View Solar PV System</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${!hasAppliances ? `
        <div class="refine-prompt-card">
          <div class="refine-prompt-card__icon">⚡</div>
          <div class="refine-prompt-card__body">
            <div class="refine-prompt-card__title">Your estimate is based on spending. Make it sharper</div>
            <div class="refine-prompt-card__desc">Right now we derived your energy demand from your monthly bills. Tell us which appliances you run and when, and we'll calculate an hourly load curve, a seasonal monthly forecast, and push your confidence score from Low to High.</div>
            <button class="btn btn--primary" onclick="window._navigate('step5')">Add Appliances &amp; Set Goals →</button>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  window._navigate = navigate;

  if (!hasAppliances) return;

  const seasonalKWh = calcSeasonalMonthly(load, appliances, applianceData, zone);
  const monthlyAvg = parseFloat((seasonalKWh.reduce((s, v) => s + v, 0) / 12).toFixed(1));

  drawHourlyChart(load);
  setCaption(`Hourly kWh from your appliance schedule, scaled to match spending data. Confidence: ${load.confidenceLabel} (${load.confidenceScore}%).`);

  document.getElementById('chart-view-sel').addEventListener('change', function () {
    if (this.value === 'hourly') {
      drawHourlyChart(load);
      setCaption(`Hourly kWh from your appliance schedule, scaled to match spending data. Confidence: ${load.confidenceLabel} (${load.confidenceScore}%).`);
    } else {
      drawMonthlyChart(seasonalKWh, monthlyAvg);
      setCaption(`Seasonal estimate: ${coolingPct}% of your load is cooling. ${climateDesc}.`);
    }
  });
}

function setCaption(text) {
  const el = document.getElementById('chart-caption');
  if (el) el.textContent = text;
}

function drawHourlyChart(load) {
  const ctx = document.getElementById('load-chart')?.getContext('2d');
  if (!ctx) return;
  if (window._loadChart) { window._loadChart.destroy(); }

  const labels = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return '12am';
    if (i === 12) return '12pm';
    return i < 12 ? `${i}am` : `${i - 12}pm`;
  });

  const max = Math.max(...load.hourlyProfile);
  const colors = load.hourlyProfile.map(v => {
    const r = v / max;
    if (r > 0.75) return '#EF4444';
    if (r > 0.45) return '#F5A623';
    return '#FCD34D';
  });

  window._loadChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ data: load.hourlyProfile, backgroundColor: colors, borderRadius: 8, borderSkipped: false, barPercentage: 0.55, categoryPercentage: 0.8 }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `${c.raw} kW` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Outfit, sans-serif' } } },
        y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 10, family: 'Outfit, sans-serif' }, callback: v => `${v} kW` } }
      }
    }
  });
}

function drawMonthlyChart(seasonalKWh, monthlyAvg) {
  const ctx = document.getElementById('load-chart')?.getContext('2d');
  if (!ctx) return;
  if (window._loadChart) { window._loadChart.destroy(); }

  const colors = seasonalKWh.map(v => v >= monthlyAvg ? '#F5A623' : '#93C5FD');

  window._loadChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        {
          type: 'bar',
          data: seasonalKWh,
          backgroundColor: colors,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
          order: 2
        },
        {
          type: 'line',
          data: new Array(12).fill(monthlyAvg),
          borderColor: '#6B7280',
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointRadius: 0,
          fill: false,
          order: 1,
          label: 'Monthly average'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: c => c.datasetIndex === 0
              ? `${c.raw} kWh`
              : `Avg: ${monthlyAvg} kWh`
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Outfit, sans-serif' } } },
        y: {
          grid: { color: '#F3F4F6' },
          ticks: { font: { size: 10, family: 'Outfit, sans-serif' }, callback: v => `${v}` },
          title: { display: true, text: 'kWh / month', font: { size: 10, family: 'Outfit, sans-serif' }, color: '#9CA3AF' }
        }
      }
    }
  });
}
