import { getState } from '../state.js';

const N = (v) => '₦' + Number(v).toLocaleString('en-NG');

export function renderCostSavings(container, navigate) {
  const state = getState();
  if (!state.results) { navigate('step1'); return; }
  const { savings } = state.results;
  const hasAppliances = state.appliances && state.appliances.length > 0;

  const tip = text => `<span class="confidence-tooltip-wrap" style="display:inline-flex;vertical-align:middle;margin-left:4px"><button class="confidence-tooltip-btn" type="button">?</button><span class="confidence-tooltip-box">${text}</span></span>`;

  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <div class="card cost-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
          <div>
            <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Cost Savings Breakdown</h2>
            <p style="color:var(--color-text-secondary);font-size:16px">See how much you save overtime with solar power</p>
          </div>
        </div>

        <div class="savings-kpi-grid">
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Current Energy Cost ${tip('The average cost you pay per kWh right now, based on your current grid tariff and/or generator fuel spend.')}</div>
              <div class="savings-kpi__value">${N(savings.current_blended_cost)}/kWh <span class="savings-kpi__arrow-up">↑</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/current_blended_cost.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Energy Cost with Solar ${tip('Your estimated cost per kWh after solar is installed, blending the solar generation cost with any remaining grid or generator usage.')}</div>
              <div class="savings-kpi__value">${N(savings.post_solar_blended_cost)}/kWh <span class="savings-kpi__arrow-down">↓</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/solar_blended_cost.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Annual Fuel Savings ${tip('How much you save on generator fuel each year by replacing that consumption with solar power.')}</div>
              <div class="savings-kpi__value">${N(savings.fuel_naira_saved_annual)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">${(savings.litres_saved_per_year || 0).toLocaleString()} Lt Saved/Year</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/fuel_savings.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">ROI ${tip('Total return on investment over 25 years. Calculated as total savings minus total costs, as a percentage of the initial system cost.')}</div>
              <div class="savings-kpi__value">${savings.ROI}%</div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/return_on_investment.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Payback Period ${tip('How many years before your accumulated energy savings fully recover the cost of the solar system.')}</div>
              <div class="savings-kpi__value">${savings.simple_payback_years} Years</div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/payback_period.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Energy Bill Savings ${tip('Your estimated net saving in energy costs each year after switching to solar, based on the difference between your current energy spend and your projected post-solar spend.')}</div>
              <div class="savings-kpi__value">${N(savings.annual_savings)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">Per Year</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/annual_savings.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
        </div>

        <div class="savings-env-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;margin-top:0">
          <div class="card">
            <div class="savings-kpi" style="border:none;padding:0">
              <div>
                <div class="savings-kpi__label">Lifetime Savings ${tip('Your total net savings over 25 years, after deducting the initial system cost and a battery replacement at year 10.')}</div>
                <div class="savings-kpi__value">${N(savings.lifetime_savings)}</div>
                <div class="savings-kpi__sub"><span class="pill--amber">Over 25 Years</span></div>
              </div>
              <div class="savings-kpi__icon"><img src="/icons/lifetime_savings.png" width="64" height="64" style="object-fit:contain"></div>
            </div>
          </div>
          <div class="card">
            <div class="savings-kpi" style="border:none;padding:0">
              <div>
                <div class="savings-kpi__label">Carbon Emission Avoided ${tip('The CO₂ emissions your solar system prevents each year by replacing fossil fuel electricity with clean solar energy.')}</div>
                <div class="savings-kpi__value">${savings.co2_avoided_tonnes} tCO₂/Year</div>
              </div>
              <div class="savings-kpi__icon"><img src="/icons/emissions_avoided.png" width="64" height="64" style="object-fit:contain"></div>
            </div>
          </div>
        </div>

        <div class="savings-bottom-grid">
          <div class="card">
            <div class="section-title" style="margin-bottom:16px">25-Year Cumulative Savings</div>
            <div style="position:relative">
              <canvas id="cashflow-chart" style="width:100%;height:280px;display:block"></canvas>
              <div id="cashflow-tooltip" style="display:none;position:absolute;background:rgba(17,24,39,0.88);color:#fff;font-size:11px;padding:5px 9px;border-radius:6px;pointer-events:none;white-space:nowrap;font-family:Outfit,sans-serif"></div>
            </div>
            <div style="display:flex;gap:20px;justify-content:center;margin-top:10px">
              <span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280">
                <span style="display:inline-block;width:22px;height:2.5px;background:#FCBF1E;border-radius:2px"></span>
                Cumulative Cash Flow
              </span>
              <span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280">
                <span style="display:inline-block;width:22px;border-top:1.5px dashed #9CA3AF"></span>
                Break-even Line
              </span>
            </div>
          </div>
          <div class="card">
            <div class="section-title" style="margin-bottom:16px">Cost Comparison</div>
            <canvas id="compare-chart" height="200"></canvas>
          </div>
        </div>

      </div>

    </div>

  `;

  window._navigate = navigate;

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

  drawCashflowCanvas(savings);
  drawComparison(savings);
}

function drawCashflowCanvas(savings) {
  const canvas = document.getElementById('cashflow-chart');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || Math.min(window.innerWidth - 32, 500);
  const H = 280;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const pts = savings.cashflow;
  const PADL = 76, PADR = 88, PADT = 28, PADB = 38;
  const cw = W - PADL - PADR;
  const ch = H - PADT - PADB;

  const values = pts.map(p => p.cumulative);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const pad    = (maxVal - minVal) * 0.10 || Math.abs(minVal) * 0.10 || 100000;
  const lo = minVal - pad;
  const hi = maxVal + pad;
  const range = hi - lo || 1;

  const toX = yr  => PADL + (yr / 25) * cw;
  const toY = val => PADT + (1 - (val - lo) / range) * ch;
  const zeroY = toY(0);

  const points = pts.map(p => ({
    x: toX(p.year), y: toY(p.cumulative),
    year: p.year, cumulative: p.cumulative,
  }));
  const last = points[points.length - 1];

  const fmt = v => {
    const abs = Math.abs(v);
    const pfx = v < 0 ? '-₦' : '₦';
    if (abs >= 1_000_000) return `${pfx}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000)     return `${pfx}${Math.round(abs / 1_000)}k`;
    return `${pfx}${Math.round(abs)}`;
  };

  // ── Y-axis grid lines ──────────────────────────────────────────────────
  const nTicks = 5;
  const tickValues = Array.from({ length: nTicks + 1 }, (_, i) => lo + (hi - lo) * (i / nTicks));
  ctx.save();
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = '#F3F4F6';
  ctx.lineWidth = 1;
  tickValues.forEach(val => {
    const y = toY(val);
    if (y < PADT || y > PADT + ch) return;
    ctx.beginPath();
    ctx.moveTo(PADL, y);
    ctx.lineTo(PADL + cw, y);
    ctx.stroke();
  });
  ctx.restore();

  // ── Y-axis labels ──────────────────────────────────────────────────────
  ctx.fillStyle = '#9CA3AF';
  ctx.textAlign = 'right';
  ctx.font = '10px Outfit, sans-serif';
  tickValues.forEach(val => {
    const y = toY(val);
    if (y < PADT - 4 || y > PADT + ch + 4) return;
    ctx.fillText(fmt(val), PADL - 7, y + 3.5);
  });

  // ── Y-axis line ────────────────────────────────────────────────────────
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(PADL, PADT);
  ctx.lineTo(PADL, PADT + ch);
  ctx.stroke();

  // ── Red fill (below zero) ──────────────────────────────────────────────
  const clampedZeroY = Math.min(Math.max(zeroY, PADT), PADT + ch);
  if (clampedZeroY < PADT + ch) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(PADL, clampedZeroY, cw, PADT + ch - clampedZeroY);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(last.x, clampedZeroY);
    ctx.lineTo(points[0].x, clampedZeroY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(232,72,85,0.10)';
    ctx.fill();
    ctx.restore();
  }

  // ── Green fill (above zero) ────────────────────────────────────────────
  if (clampedZeroY > PADT) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(PADL, PADT, cw, clampedZeroY - PADT);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(last.x, clampedZeroY);
    ctx.lineTo(points[0].x, clampedZeroY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(34,197,94,0.10)';
    ctx.fill();
    ctx.restore();
  }

  // ── Zero / investment line (dashed) ──────────────────────────────────
  if (zeroY >= PADT && zeroY <= PADT + ch) {
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(PADL, zeroY);
    ctx.lineTo(PADL + cw, zeroY);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#9CA3AF';
    ctx.font = 'bold 10px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Investment Line', PADL + cw + 5, zeroY + 4);
  }

  // ── X-axis baseline ───────────────────────────────────────────────────
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(PADL, PADT + ch);
  ctx.lineTo(PADL + cw, PADT + ch);
  ctx.stroke();

  // ── Line ──────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#FCBF1E';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.setLineDash([]);
  ctx.stroke();

  // ── Dots: small at every year, large green at interpolated crossing ──────
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FCBF1E';
    ctx.fill();
  });

  const pbExact = savings.payback_exact;
  const pbValid = pbExact != null && pbExact < 99 && pbExact >= 0;
  if (pbValid) {
    const pbX = toX(pbExact);
    const pbY = toY(0);
    ctx.beginPath();
    ctx.arc(pbX, pbY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#22C55E';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // ── Payback label at interpolated crossing ────────────────────────────
  if (pbValid) {
    const pbX = toX(pbExact);
    const pbY = toY(0);
    ctx.fillStyle = '#16A34A';
    ctx.font = 'bold 10px Outfit, sans-serif';
    const tooFarRight = pbX + 84 > PADL + cw;
    ctx.textAlign = tooFarRight ? 'right' : 'center';
    ctx.fillText(`Payback: Year ${pbExact}`, tooFarRight ? pbX - 10 : pbX, Math.max(PADT + 14, pbY - 14));
  }

  // ── X-axis labels ──────────────────────────────────────────────────────
  ctx.fillStyle = '#6B7280';
  ctx.font = '10px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.setLineDash([]);
  [0, 3, 5, 10, 15, 20, 25].forEach(yr => {
    const x = toX(yr);
    ctx.fillText(`Yr ${yr}`, x, PADT + ch + 22);
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, PADT + ch);
    ctx.lineTo(x, PADT + ch + 5);
    ctx.stroke();
  });

  // ── X-axis label ──────────────────────────────────────────────────────
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '10px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Year', PADL + cw / 2, PADT + ch + 36);

  // ── Hover tooltip ─────────────────────────────────────────────────────
  const tooltip = document.getElementById('cashflow-tooltip');
  if (!tooltip) return;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    let closest = null, minDist = Infinity;
    points.forEach(p => {
      const d = Math.abs(p.x - mx);
      if (d < minDist) { minDist = d; closest = p; }
    });
    if (closest && minDist < 22) {
      const sign = closest.cumulative >= 0 ? '+' : '';
      tooltip.style.left    = (closest.x + 10) + 'px';
      tooltip.style.top     = Math.max(4, closest.y - 48) + 'px';
      tooltip.style.display = 'block';
      const batteryLine = closest.year === 10
        ? `<div style="color:#FCA5A5;margin-top:3px">Battery replacement: -${N(savings.battery_replacement_cost)}</div>`
        : '';
      tooltip.innerHTML = `<div>Year ${closest.year}: ${sign}${N(closest.cumulative)}</div>${batteryLine}`;
    } else {
      tooltip.style.display = 'none';
    }
  });
  canvas.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
}

function drawComparison(savings) {
  const ctx = document.getElementById('compare-chart')?.getContext('2d');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [savings.current_label || 'Grid+Gen', savings.solar_label || 'Solar'],
      datasets: [{
        data: [savings.current_monthly_cost, savings.post_solar_monthly_cost],
        backgroundColor: ['#E74C3C', '#1B4F72'],
        borderRadius: 6,
        barThickness: 60
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `₦${Number(c.raw).toLocaleString()}` } }
      },
      scales: {
        x: {
          grid: { display: false },
          title: { display: true, text: 'Monthly Cost Scenario', font: { size: 11, family: 'Outfit, sans-serif' } },
          ticks: { font: { size: 10, family: 'Outfit, sans-serif' } }
        },
        y: {
          grid: { color: '#F3F4F6' },
          suggestedMax: Math.max(savings.current_monthly_cost, savings.post_solar_monthly_cost) * 1.4,
          ticks: { font: { size: 10, family: 'Outfit, sans-serif' }, callback: v => `₦${(v / 1000).toFixed(0)}k` }
        }
      }
    },
    plugins: [{
      id: 'barValueLabels',
      afterDatasetsDraw(chart) {
        const { ctx: c, data } = chart;
        const meta = chart.getDatasetMeta(0);
        c.save();
        c.font = 'bold 11px Outfit, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'bottom';
        meta.data.forEach((bar, i) => {
          const val = data.datasets[0].data[i];
          c.fillStyle = '#374151';
          c.fillText('₦' + Number(val).toLocaleString('en-NG'), bar.x, bar.y - 4);
        });
        c.restore();
      }
    }]
  });
}
