import { getState } from '../state.js';

const N = (v) => '₦' + Number(v).toLocaleString('en-NG');

function paybackMonth(years) {
  const now = new Date();
  const totalMonths = Math.round(years * 12);
  const d = new Date(now.getFullYear(), now.getMonth() + totalMonths, 1);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export function renderCostSavings(container, navigate) {
  const state = getState();
  if (!state.results) { navigate('step1'); return; }
  const { savings, inverter_battery_only: invBattOnly } = state.results;
  const isAutonomy = state.reportPersona === 'autonomy';

  const tip = text => `<span class="confidence-tooltip-wrap" style="display:inline-flex;vertical-align:middle;margin-left:4px"><button class="confidence-tooltip-btn" type="button">?</button><span class="confidence-tooltip-box">${text}</span></span>`;

  const pageTitle    = isAutonomy ? 'Energy Independence with Solar' : 'Cost Savings Breakdown';
  const pageSubtitle = isAutonomy
    ? 'Solar can guarantee you more hours of light, even when there is NEPA outage'
    : 'See how much you save overtime with solar power';

  // ── Shared KPI card builders ───────────────────────────────────────────────
  const kpiCurrentCost = () => `
    <div class="savings-kpi">
      <div>
        <div class="savings-kpi__label">Current Energy Cost ${tip('The average cost you pay per kWh right now, based on your current grid tariff and/or generator fuel spend.')}</div>
        <div class="savings-kpi__value">${N(savings.current_blended_cost)}/kWh <span class="savings-kpi__arrow-up">↑</span></div>
      </div>
      <div class="savings-kpi__icon"><img src="/icons/current_blended_cost.png" width="64" height="64" style="object-fit:contain"></div>
    </div>`;

  const kpiSolarCost = () => `
    <div class="savings-kpi">
      <div>
        <div class="savings-kpi__label">Energy Cost with Solar ${tip('Your estimated cost per kWh after solar is installed, blending the solar generation cost with any remaining grid or generator usage.')}</div>
        <div class="savings-kpi__value">${N(savings.post_solar_blended_cost)}/kWh <span class="savings-kpi__arrow-down">↓</span></div>
      </div>
      <div class="savings-kpi__icon"><img src="/icons/solar_blended_cost.png" width="64" height="64" style="object-fit:contain"></div>
    </div>`;

  const kpiFuelSavings = () => `
    <div class="savings-kpi">
      <div>
        <div class="savings-kpi__label">Annual Fuel Savings ${tip('How much you save on generator fuel each year by replacing that consumption with solar power.')}</div>
        <div class="savings-kpi__value">${N(savings.fuel_naira_saved_annual)}</div>
        <div class="savings-kpi__sub"><span class="pill--amber">${(savings.litres_saved_per_year || 0).toLocaleString()} Lt Saved/Year</span></div>
      </div>
      <div class="savings-kpi__icon"><img src="/icons/fuel_savings.png" width="64" height="64" style="object-fit:contain"></div>
    </div>`;

  const kpiAnnualSavings = () => `
    <div class="savings-kpi">
      <div>
        <div class="savings-kpi__label">Energy Bill Savings ${tip('Your estimated net saving in energy costs each year after switching to solar, based on the difference between your current energy spend and your projected post-solar spend.')}</div>
        <div class="savings-kpi__value">${N(savings.annual_savings)}</div>
        <div class="savings-kpi__sub"><span class="pill--amber">Per Year</span></div>
      </div>
      <div class="savings-kpi__icon"><img src="/icons/annual_savings.png" width="64" height="64" style="object-fit:contain"></div>
    </div>`;

  const kpiCarbon = () => `
    <div class="savings-kpi">
      <div>
        <div class="savings-kpi__label">Carbon Emission Avoided ${tip('The CO₂ emissions your solar system prevents each year by replacing fossil fuel electricity with clean solar energy.')}</div>
        <div class="savings-kpi__value">${savings.co2_avoided_tonnes} tCO₂/Year</div>
      </div>
      <div class="savings-kpi__icon"><img src="/icons/emissions_avoided.png" width="64" height="64" style="object-fit:contain"></div>
    </div>`;

  // ── Cost comparison breakdown rows ─────────────────────────────────────────
  const compareBreakdown = () => {
    const psb = savings.post_solar_blended_cost || 1;
    const solar_after = Math.round((savings.solar_fraction * savings.LCOE) / psb * savings.post_solar_monthly_cost);
    const gen_after   = Math.round((savings.gen_fraction * savings.gen_cost_per_kwh) / psb * savings.post_solar_monthly_cost);
    const grid_after  = savings.post_solar_monthly_cost - solar_after - gen_after;
    const grid_before = savings.grid_monthly_spend || 0;
    const gen_before  = savings.gen_monthly_spend  || 0;
    const row = (label, before, after) => `
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:5px 0;border-bottom:1px solid #F9FAFB">
        <span style="color:#6B7280">${label}</span>
        <span style="font-weight:600;color:#374151">${N(before)} <span style="color:#9CA3AF;font-weight:400;font-size:11px">→</span> ${N(after)}</span>
      </div>`;
    return [
      grid_before > 0 ? row('Grid spend', grid_before, grid_after) : '',
      gen_before  > 0 ? row('Generator',  gen_before,  gen_after)  : '',
    ].join('');
  };

  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <div class="card cost-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
          <div>
            <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">${pageTitle}</h2>
            <p style="color:var(--color-text-secondary);font-size:16px">${pageSubtitle}</p>
          </div>
        </div>

        ${isAutonomy ? `
        <div class="autonomy-hero-strip" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;background:#ffffff;border:1px solid var(--color-border-light);border-radius:12px;padding:20px;margin-bottom:28px">
          <div>
            <div style="font-size:11px;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">System Investment</div>
            <div id="hero-system-cost" style="font-size:24px;font-weight:800">${N(savings.total_system_cost)}</div>
            <div style="font-size:11px;color:var(--color-text-muted);margin-top:2px">one-time cost</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Backup Coverage</div>
            <div id="hero-backup-hours" style="font-size:24px;font-weight:800;color:var(--color-primary)">${state.backupHours}h</div>
            <div style="font-size:11px;color:var(--color-text-muted);margin-top:2px">evening + night window</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Solar Independence</div>
            <div id="hero-solar-independence" style="font-size:24px;font-weight:800;color:var(--color-primary)">${Math.round(savings.solar_fraction * 100)}%</div>
            <div style="font-size:11px;color:var(--color-text-muted);margin-top:2px">of daily load via solar</div>
          </div>
        </div>
        ` : ''}

        ${invBattOnly ? `
        <div style="display:flex;gap:14px;align-items:flex-start;background:#FFFBEB;border:1px solid #FCD34D;border-radius:10px;padding:14px 16px;margin-bottom:24px">
          <svg style="flex-shrink:0;margin-top:2px" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#D97706" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 2L14.5 13.5H1.5L8 2z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12" r="0.4" fill="#D97706" stroke="none"/>
          </svg>
          <div>
            <div style="font-size:13px;font-weight:700;color:#92400E;margin-bottom:4px">Full solar may not be the right fit right now</div>
            <p style="margin:0;font-size:12px;color:#78350F;line-height:1.65">
              Based on your current energy spend, a full solar PV system is unlikely to break even within 25 years. This is likely because your monthly bill is low compared to the upfront cost of a system.
              <br><br>
              A better starting point could be: <strong>inverter + battery only</strong>, and you can add solar panels later as your energy consumption grows.
            </p>
            <button onclick="window._navigate('step1')" style="margin-top:10px;font-size:12px;font-weight:600;color:#D97706;background:none;border:none;padding:0;cursor:pointer;text-decoration:underline">Adjust my inputs</button>
          </div>
        </div>
        ` : ''}

        ${isAutonomy ? `

        <!-- Autonomy persona: 3-card KPI row -->
        <div class="savings-kpi-grid" style="margin-bottom:24px">
          ${kpiCurrentCost()}
          ${kpiSolarCost()}
          ${kpiFuelSavings()}
        </div>

        <!-- Cost Comparison (left) + Energy Bill Savings, Carbon & Context card (right stacked) -->
        <div class="autonomy-mid-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
          <div class="card" style="padding:20px">
            <div class="section-title" style="margin-bottom:16px">Cost Comparison</div>
            <canvas id="compare-chart" height="200"></canvas>
            <div style="margin-top:14px;border-top:1px solid #F3F4F6;padding-top:4px">${compareBreakdown()}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px">
            ${kpiAnnualSavings()}
            ${kpiCarbon()}
            <div class="card" style="background:#F9FAFB;border-color:#E5E7EB;padding:16px;flex:1">
              <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:14px">
                <svg style="flex-shrink:0;margin-top:2px" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6B7280" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="8" cy="8" r="6.5"/>
                  <line x1="8" y1="7" x2="8" y2="11"/>
                  <circle cx="8" cy="5" r="0.5" fill="#6B7280" stroke="none"/>
                </svg>
                <div style="font-size:13px;font-weight:700;color:#111827">A word on the numbers</div>
              </div>
              ${savings.ROI >= 0 ? `
              <p style="margin:0 0 14px;font-size:12px;color:#4B5563;line-height:1.65">
                Getting a solar system makes financial sense for you in the long run. If you get solar today, you should break even by year ${savings.payback_exact} (${paybackMonth(savings.payback_exact)}) and make ${savings.ROI}% on your investment over 25 years.
                <br><br>
                But the more compelling advantage is the <strong>energy independence</strong> it gives you: constant power through NEPA outages and power on your own terms.
              </p>
              ` : `
              <p style="margin:0 0 14px;font-size:12px;color:#4B5563;line-height:1.65">
                At your current energy tariff, a full solar PV system is unlikely to break even within the typical 25-year horizon. Your monthly bill is already quite modest compared to the cost of installing solar, so it doesn't make much financial sense here.
                <br><br>
                The benefit you get from solar here is <strong>Energy Independence</strong>: No more NEPA outages dictating your schedule and power on your own terms.
              </p>
              `}
              <div style="display:flex;flex-direction:column;gap:8px;padding-top:12px;border-top:1px solid #E5E7EB">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div style="font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px">ROI ${tip('Total return on investment over 25 years, calculated as total savings minus total costs as a percentage of the initial system cost.')}</div>
                  <div style="font-size:17px;font-weight:800;color:${savings.ROI < 0 ? '#EF4444' : '#111827'}">${savings.ROI}%</div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div style="font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px">Payback ${tip('How many years before accumulated energy savings fully recover the system cost.')}</div>
                  <div style="font-size:17px;font-weight:800;color:#111827">${savings.payback_exact >= 99 ? '> 25 yrs' : `${savings.payback_exact} yrs`}</div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div style="font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px">Lifetime ${tip('Total net savings over 25 years, after deducting the initial system cost. Includes 1% annual tariff escalation.')}</div>
                  <div style="font-size:17px;font-weight:800;color:#111827">${N(savings.lifetime_savings)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        ` : `

        <!-- Savings persona: original 6-card KPI grid -->
        <div class="savings-kpi-grid">
          ${kpiCurrentCost()}
          ${kpiSolarCost()}
          ${kpiFuelSavings()}
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">ROI ${tip('Total return on investment over 25 years. Calculated as total savings minus total costs, as a percentage of the initial system cost.')}</div>
              <div class="savings-kpi__value" style="${savings.ROI < 0 ? 'color:#EF4444' : ''}">${savings.ROI}%</div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/return_on_investment.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Payback Period ${tip('How many years before your accumulated energy savings fully recover the cost of the solar system.')}</div>
              <div class="savings-kpi__value">${savings.payback_exact >= 99 ? 'Not within 25 yrs' : `${savings.payback_exact} Years`}</div>
              ${(savings.payback_exact < 25) ? `<div class="savings-kpi__sub"><span class="pill--amber">${paybackMonth(savings.payback_exact)}</span></div>` : ''}
            </div>
            <div class="savings-kpi__icon"><img src="/icons/payback_period.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          ${kpiAnnualSavings()}
        </div>

        <div class="savings-env-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;margin-top:0">
          <div class="card">
            <div class="savings-kpi" style="border:none;padding:0">
              <div>
                <div class="savings-kpi__label">Lifetime Savings ${tip('Your total net savings over 25 years, after deducting the initial system cost. Figures include 1% annual tariff escalation.')}</div>
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
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
              <div class="section-title" style="margin-bottom:0">25-Year Cumulative Savings</div>
              <span style="font-size:11px;font-weight:600;color:#374151;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:20px;padding:2px 10px;white-space:nowrap">Est. System Cost ${N(savings.total_system_cost)}</span>
            </div>
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
            <div style="margin-top:14px;border-top:1px solid #F3F4F6;padding-top:4px">${compareBreakdown()}</div>
          </div>
        </div>

        `}

      </div>

      <div style="display:flex;gap:12px;align-items:flex-start;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:14px 16px;margin-top:20px">
        <svg style="flex-shrink:0;margin-top:1px" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6B7280" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="8" cy="8" r="6.5"/>
          <line x1="8" y1="7" x2="8" y2="11"/>
          <circle cx="8" cy="5" r="0.5" fill="#6B7280" stroke="none"/>
        </svg>
        <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.6">
          These are ballpark estimates based on the energy spend and location you provided. Actual savings will depend on how you actually consume energy, future tariff changes, and installer pricing. Fuel savings apply only if you currently use a generator.
        </p>
      </div>

    </div>

  `;

  window._navigate = navigate;

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

  if (!isAutonomy) drawCashflowCanvas(savings);
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

  ctx.fillStyle = '#9CA3AF';
  ctx.textAlign = 'right';
  ctx.font = '10px Outfit, sans-serif';
  tickValues.forEach(val => {
    const y = toY(val);
    if (y < PADT - 4 || y > PADT + ch + 4) return;
    ctx.fillText(fmt(val), PADL - 7, y + 3.5);
  });

  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(PADL, PADT);
  ctx.lineTo(PADL, PADT + ch);
  ctx.stroke();

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

  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(PADL, PADT + ch);
  ctx.lineTo(PADL + cw, PADT + ch);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#FCBF1E';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.setLineDash([]);
  ctx.stroke();

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

  if (pbValid) {
    const pbX = toX(pbExact);
    const pbY = toY(0);
    ctx.fillStyle = '#16A34A';
    ctx.font = 'bold 10px Outfit, sans-serif';
    const tooFarRight = pbX + 84 > PADL + cw;
    ctx.textAlign = tooFarRight ? 'right' : 'center';
    ctx.fillText(`Payback: Year ${pbExact}`, tooFarRight ? pbX - 10 : pbX, Math.max(PADT + 14, pbY - 14));
  }

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

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '10px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Year', PADL + cw / 2, PADT + ch + 36);

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
      tooltip.innerHTML = `<div>Year ${closest.year}: ${sign}${(v => '₦' + Number(v).toLocaleString('en-NG'))(closest.cumulative)}</div>`;
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
      labels: [savings.current_label || 'Grid+Gen', savings.solar_label || 'With Solar'],
      datasets: [{
        data: [savings.current_monthly_cost, savings.post_solar_monthly_cost],
        backgroundColor: ['#E74C3C', '#1B4F72'],
        borderRadius: 6,
        barThickness: 60,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `₦${Number(c.raw).toLocaleString('en-NG')}` } },
      },
      scales: {
        x: {
          grid: { display: false },
          title: { display: true, text: 'Monthly Cost Scenario', font: { size: 11, family: 'Outfit, sans-serif' } },
          ticks: { font: { size: 10, family: 'Outfit, sans-serif' } },
        },
        y: {
          grid: { color: '#F3F4F6' },
          suggestedMax: Math.max(savings.current_monthly_cost, savings.post_solar_monthly_cost) * 1.4,
          ticks: { font: { size: 10, family: 'Outfit, sans-serif' }, callback: v => `₦${(v / 1000).toFixed(0)}k` },
        },
      },
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
      },
    }],
  });
}
