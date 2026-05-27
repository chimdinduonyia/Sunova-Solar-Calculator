import { getState } from '../state.js';

const N = (v) => '₦' + Number(v).toLocaleString('en-NG');

export function renderCostSavings(container, navigate) {
  const state = getState();
  if (!state.results) { navigate('step1'); return; }
  const { savings } = state.results;
  const hasAppliances = state.appliances && state.appliances.length > 0;

  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <div class="card cost-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
          <div>
            <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Cost Savings Breakdown</h2>
            <p style="color:var(--color-text-secondary);font-size:16px">See how much you save overtime with solar power</p>
          </div>
          <div style="display:flex;gap:8px;flex-shrink:0">
            <button class="btn btn--outline" onclick="window._navigate('loadProfile')">📊 Load Summary</button>
            <button class="btn btn--outline" onclick="window._navigate('solarPVSystem')">⚙️ Solar PV System</button>
          </div>
        </div>

        <div class="savings-kpi-grid">
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Current Blended Cost</div>
              <div class="savings-kpi__value">${N(savings.current_blended_cost)}/kWh <span class="savings-kpi__arrow-up">↑</span></div>
            </div>
            <div class="savings-kpi__icon">🏠</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">${savings.solar_label || 'Solar'} Blended Cost</div>
              <div class="savings-kpi__value">${N(savings.post_solar_blended_cost)}/kWh <span class="savings-kpi__arrow-down">↓</span></div>
            </div>
            <div class="savings-kpi__icon">☀️</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Annual Fuel Savings</div>
              <div class="savings-kpi__value">${N(savings.fuel_naira_saved_annual)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">${(savings.litres_saved_per_year || 0).toLocaleString()} Lt Saved/Year</span></div>
            </div>
            <div class="savings-kpi__icon">⛽</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">ROI</div>
              <div class="savings-kpi__value">${savings.ROI}%</div>
            </div>
            <div class="savings-kpi__icon">📈</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Payback Period</div>
              <div class="savings-kpi__value">${savings.simple_payback_years} Years</div>
            </div>
            <div class="savings-kpi__icon">⏱️</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Lifetime Savings</div>
              <div class="savings-kpi__value">${N(savings.lifetime_savings)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">Over 25 Years</span></div>
            </div>
            <div class="savings-kpi__icon">💰</div>
          </div>
        </div>

        <div class="card" style="margin-bottom:24px;margin-top:0">
          <div class="savings-kpi" style="border:none;padding:0">
            <div>
              <div class="savings-kpi__label">Carbon Emission Avoided</div>
              <div class="savings-kpi__value">${savings.co2_avoided_tonnes} tCO₂/Year</div>
            </div>
            <div class="savings-kpi__icon">🌱</div>
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

        <div class="cta-row" style="display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding:28px 32px;background:var(--color-white);border-radius:var(--radius-lg)">
          <div>
            <div style="font-size:var(--font-size-lg);font-weight:800;margin-bottom:4px">Ready to get your solar system?</div>
            <div style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">See a detailed breakdown with product specifications, pricing, and installer options.</div>
          </div>
          <button class="btn btn--primary btn--lg" id="view-quote-btn" style="flex-shrink:0;margin-left:24px">
            See Your Quote →
          </button>
        </div>
      </div>

      ${!hasAppliances ? `
        <div class="refine-prompt-card">
          <div class="refine-prompt-card__icon">⚡</div>
          <div class="refine-prompt-card__body">
            <div class="refine-prompt-card__title">Sharpen your estimate with a home profile</div>
            <div class="refine-prompt-card__desc">These numbers are based on your energy spending. Add your appliances and usage schedule to get an accurate hourly load curve, a seasonal forecast, and a High-confidence solar recommendation.</div>
            <button class="btn btn--primary" onclick="window._navigate('step5')">Add Appliances &amp; Set Goals →</button>
          </div>
        </div>
      ` : ''}
    </div>

    ${!hasAppliances ? `
      <div class="assumptions-overlay" id="appliance-prompt-overlay" role="dialog" aria-modal="true" aria-labelledby="appliance-prompt-title">
        <div class="modal-card" style="max-width:460px">
          <div class="modal-header">
            <h3 class="modal-title" id="appliance-prompt-title">Make your results more accurate</h3>
            <button class="modal-close" id="appliance-prompt-close" aria-label="Close">✕</button>
          </div>
          <div class="modal-body">
            <p style="font-size:14px;line-height:1.7;color:var(--color-text-secondary);margin:0 0 20px">
              Your estimate is based on spending data alone. Tell us which appliances you run and when, and we will calculate a precise load profile and upgrade your confidence score from <strong style="color:var(--color-error)">Low</strong> to <strong style="color:var(--color-success)">High</strong>.
            </p>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div class="appliance-prompt-feature">
                <span style="font-size:26px">📊</span>
                <div>
                  <div class="appliance-prompt-feature__title">Hourly load curve</div>
                  <div class="appliance-prompt-feature__desc">See exactly when your home draws the most power</div>
                </div>
              </div>
              <div class="appliance-prompt-feature">
                <span style="font-size:26px">📅</span>
                <div>
                  <div class="appliance-prompt-feature__title">Seasonal forecast</div>
                  <div class="appliance-prompt-feature__desc">Understand your peak and low consumption months</div>
                </div>
              </div>
              <div class="appliance-prompt-feature">
                <span style="font-size:26px">🎯</span>
                <div>
                  <div class="appliance-prompt-feature__title">Right-sized solar system</div>
                  <div class="appliance-prompt-feature__desc">Panel count, battery, and inverter sized to your real usage</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="justify-content:flex-end">
            <button class="btn btn--primary btn--lg" id="appliance-prompt-cta" style="width:100%">Add My Appliances →</button>
          </div>
        </div>
      </div>
    ` : ''}
  `;

  window._navigate = navigate;
  document.getElementById('view-quote-btn').addEventListener('click', () => navigate('finalQuote'));

  if (!hasAppliances) {
    const overlay = document.getElementById('appliance-prompt-overlay');

    const openPrompt = () => overlay.classList.add('assumptions-overlay--visible');
    const closePrompt = () => overlay.classList.remove('assumptions-overlay--visible');

    setTimeout(openPrompt, 2000);

    // Only the X button closes the modal — no outside-click, no Escape
    document.getElementById('appliance-prompt-close').addEventListener('click', closePrompt);
    document.getElementById('appliance-prompt-cta').addEventListener('click', () => {
      closePrompt();
      navigate('step5');
    });
  }

  drawCashflowCanvas(savings);
  drawComparison(savings);
}

function drawCashflowCanvas(savings) {
  const canvas = document.getElementById('cashflow-chart');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 500;
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

  // ── Dots — small at every year, large green at interpolated crossing ─────
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
