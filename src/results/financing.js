import { fmt } from '../data/installers.js';

const PRICE        = 4620000;
const CURRENT_SPEND = 150000;

const BANKS = [
  { id: 'baobab',   name: 'Baobab MFB',        init: 'BA', rate: 2.8, approval: '3–5 days',  maxTenure: 36, color: '#1F2937' },
  { id: 'lapo',     name: 'LAPO MFB',           init: 'LA', rate: 3.0, approval: '3–5 days',  maxTenure: 36, color: '#1E5BB8' },
  { id: 'ab',       name: 'AB Microfinance',    init: 'AB', rate: 3.1, approval: '2–4 days',  maxTenure: 30, color: '#3D6B7A' },
  { id: 'accion',   name: 'Accion MFB',         init: 'AC', rate: 3.3, approval: '3–5 days',  maxTenure: 36, color: '#C0392B' },
  { id: 'renmoney', name: 'Renmoney',            init: 'RE', rate: 3.5, approval: '24–48 hrs', maxTenure: 24, color: '#6A2FB8' },
  { id: 'fairmoney',name: 'FairMoney MFB',      init: 'FA', rate: 3.8, approval: 'Same day',  maxTenure: 24, color: '#0E8F6E' },
];

function approvalRank(s) {
  if (/same/i.test(s)) return 0;
  if (/hr/i.test(s))   return 1;
  return 2;
}

function amortize(rate, n, financed) {
  const r = rate / 100;
  return financed * r / (1 - Math.pow(1 + r, -n));
}

let fcState = { down: 30, tenure: 36, picked: null, view: 'config' };
let _container = null;
let _navigate  = null;

export function renderFinancing(container, navigate) {
  _container = container;
  _navigate  = navigate;
  _render();
}

function _render() {
  if (fcState.view === 'done') { renderDone(); return; }

  const financed = PRICE * (1 - fcState.down / 100);
  const downAmt  = PRICE * fcState.down / 100;

  // Compute offers
  const offers = BANKS.map(b => {
    const n = Math.min(fcState.tenure, b.maxTenure);
    const monthly = amortize(b.rate, n, financed);
    const total   = monthly * n + downAmt;
    return { ...b, n, monthly, total };
  }).sort((a, b) => a.monthly - b.monthly);

  const bestOffer = offers[0];
  const fastOffer = offers.find(o => o.id !== bestOffer.id &&
    approvalRank(o.approval) < approvalRank(bestOffer.approval));

  const repayPct = Math.min(100, Math.max(8, bestOffer.monthly / CURRENT_SPEND * 100));
  const saving   = CURRENT_SPEND - bestOffer.monthly;
  const saveHeadline = saving > 0
    ? `You save <strong>${fmt(saving)}</strong> every month, from day one`
    : `Roughly what you already spend, then it's yours`;
  const crossNote = saving > 0
    ? `Your solar system pays for itself and saves you money immediately. After ${fcState.tenure} months, the system is yours — zero monthly payments.`
    : `Consider a larger down payment or longer tenure to reduce your monthly cost below your current spend of ${fmt(CURRENT_SPEND)}.`;

  // Range gradient
  const fillPct = ((fcState.down - 10) / 40) * 100;
  const rangeGrad = `linear-gradient(to right, #FCBF1E 0%, #FCBF1E ${fillPct}%, #E5E7EB ${fillPct}%, #E5E7EB 100%)`;

  _container.innerHTML = `
    <div class="fc-page">
      <h1 class="fc-h1">Finance your solar system</h1>
      <p class="fc-sub">Configure your down payment and repayment plan. We'll match you with the best financing offer from verified microfinance banks.</p>

      <div class="fc-grid">
        <!-- LEFT: configurator -->
        <div>
          <!-- System card -->
          <div class="fc-card">
            <div class="fc-card-label">Your system</div>
            <div class="fc-system-row">
              <div class="fc-system-info">
                <div class="mk-logo-chip">AX</div>
                <div>
                  <div class="fc-system-name">Auxano Solar · 7.02 kWp system</div>
                  <div class="fc-system-sub">Best value quote · 5yr warranty · Garki, Abuja</div>
                </div>
              </div>
              <div class="fc-system-cost">${fmt(PRICE)}</div>
            </div>
          </div>

          <!-- Down payment -->
          <div class="fc-card">
            <div class="fc-down-header">
              <div>
                <div class="fc-card-label">Down payment</div>
              </div>
              <div class="fc-down-pct">${fcState.down}%</div>
            </div>
            <input type="range" class="fc-range" id="fc-range"
              min="10" max="50" step="5" value="${fcState.down}"
              style="background:${rangeGrad}">
            <div class="fc-down-row">
              <span>You pay now: <strong>${fmt(downAmt)}</strong></span>
              <span>To finance: <strong>${fmt(financed)}</strong></span>
            </div>
          </div>

          <!-- Tenure -->
          <div class="fc-card">
            <div class="fc-card-label">Repayment plan</div>
            <div class="fc-tenure">
              ${[6, 12, 18, 24, 36].map(m => `
                <button class="fc-tenure-btn ${fcState.tenure === m ? 'active' : ''}" data-tenure="${m}">
                  ${m}<span class="fc-mo">months</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Repayment hero -->
          <div class="fc-hero">
            <div class="fc-hero-label">Your repayment · ${bestOffer.name}</div>
            <div class="fc-hero-monthly">${fmt(bestOffer.monthly)}</div>
            <div class="fc-hero-sub">/ month &nbsp;·&nbsp; for ${fcState.tenure} months &nbsp;·&nbsp; lowest rate from ${offers.length} banks</div>

            <div class="fc-bars">
              <div class="fc-bar-label">What you spend now (NEPA + fuel)</div>
              <div class="fc-bar-track"><div class="fc-bar-fill fc-bar-fill--now" style="width:100%"></div></div>
              <div class="fc-bar-label" style="color:rgba(255,255,255,.75)">Solar repayment</div>
              <div class="fc-bar-track"><div class="fc-bar-fill" style="width:${repayPct}%"></div></div>
            </div>

            <div class="fc-hero-headline">${saveHeadline}</div>
            <div class="fc-hero-note">${crossNote}</div>
          </div>
        </div>

        <!-- RIGHT: offers -->
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--color-text);margin-bottom:4px">Loan offers for you</div>
          <div style="font-size:12px;color:var(--color-text-muted);margin-bottom:14px">Sorted by monthly cost · reducing-balance rates</div>

          ${offers.map(o => {
            const isBest = o.id === bestOffer.id;
            const isFast = fastOffer && o.id === fastOffer.id;
            return `
              <div class="fc-offer-card ${isBest ? 'best' : ''}" id="fc-offer-${o.id}">
                <div class="fc-offer-top">
                  <div class="fc-bank-chip" style="background:${o.color}">${o.init}</div>
                  <div>
                    <div class="fc-offer-name">${o.name}</div>
                    <div class="fc-offer-sub">${o.rate}% / mo · ${o.approval} approval · up to ${o.maxTenure} mo</div>
                  </div>
                  ${isBest ? '<span class="fc-offer-badge fc-offer-badge--best">Lowest monthly</span>' : ''}
                  ${isFast && !isBest ? '<span class="fc-offer-badge fc-offer-badge--fast">Fastest approval</span>' : ''}
                </div>
                <div class="fc-offer-footer">
                  <div>
                    <div class="fc-offer-monthly">Monthly ${fmt(o.monthly)}</div>
                    <div class="fc-offer-total">Total payable ${fmt(o.total)}</div>
                  </div>
                  <button class="fc-select-btn ${isBest ? 'best-btn' : ''}" data-bank="${o.id}">Select</button>
                </div>
              </div>
            `;
          }).join('')}

          <div class="fc-trust">
            💡 Rates are indicative monthly reducing-balance figures. Final rates are confirmed during application. A soft credit check may apply — your score is not affected. NNEL Solar Hub never charges you to apply.
          </div>
        </div>
      </div>

      <div style="margin-top:20px">
        <button class="btn--dark-outline" id="fc-back" style="font-size:12px;padding:8px 16px">← Back to quotes</button>
      </div>
    </div>
  `;

  // Range slider
  const range = _container.querySelector('#fc-range');
  range.addEventListener('input', () => {
    fcState.down = parseInt(range.value);
    _render();
  });

  // Tenure buttons
  _container.querySelectorAll('[data-tenure]').forEach(btn => {
    btn.addEventListener('click', () => { fcState.tenure = parseInt(btn.dataset.tenure); _render(); });
  });

  // Select bank
  _container.querySelectorAll('[data-bank]').forEach(btn => {
    btn.addEventListener('click', () => {
      const bank = offers.find(o => o.id === btn.dataset.bank);
      if (bank) { fcState.picked = bank; fcState.view = 'done'; _render(); }
    });
  });

  // Back
  _container.querySelector('#fc-back')?.addEventListener('click', () => _navigate('compare'));
}

function renderDone() {
  const b = fcState.picked;
  const downAmt = PRICE * fcState.down / 100;

  _container.innerHTML = `
    <div class="fc-page">
      <div class="fc-done">
        <div class="fc-tick-circle">
          <div class="fc-tick"></div>
        </div>
        <h1>Your application is on its way to ${b.name}.</h1>
        <p>We've sent your verified energy profile and system specification to ${b.name}. Expect a decision within <strong>${b.approval}</strong>. Auxano Solar is on standby to schedule your site survey once approved.</p>

        <div class="fc-stat-strip">
          <div class="fc-stat-cell">
            <div class="label">Pay now</div>
            <div class="value">${fmt(downAmt)}</div>
          </div>
          <div class="fc-stat-cell">
            <div class="label">Monthly</div>
            <div class="value value--amber">${fmt(b.monthly)}</div>
          </div>
          <div class="fc-stat-cell">
            <div class="label">For</div>
            <div class="value">${fcState.tenure} months</div>
          </div>
        </div>

        <button class="btn--outline" id="fc-adjust">Adjust my plan</button>
      </div>
    </div>
  `;

  _container.querySelector('#fc-adjust').addEventListener('click', () => {
    fcState.view = 'config';
    _render();
  });
}
