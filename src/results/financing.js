import { fmt } from '../data/installers.js';
import { getState } from '../state.js';
import CITY_MAP_DATA from '../data/cityMapData.json';

function getCityData(s) { return CITY_MAP_DATA[s] || CITY_MAP_DATA['Abuja (FCT)']; }

const ARROW_L = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>`;

const BANKS = [
  { id: 'baobab',   name: 'Baobab MFB',     init: 'BA', rate: 2.8, approval: '3–5 days',  maxTenure: 36, color: '#1F2937' },
  { id: 'lapo',     name: 'LAPO MFB',        init: 'LA', rate: 3.0, approval: '3–5 days',  maxTenure: 36, color: '#1E5BB8' },
  { id: 'ab',       name: 'AB Microfinance', init: 'AB', rate: 3.1, approval: '2–4 days',  maxTenure: 30, color: '#3D6B7A' },
  { id: 'accion',   name: 'Accion MFB',      init: 'AC', rate: 3.3, approval: '3–5 days',  maxTenure: 36, color: '#C0392B' },
  { id: 'renmoney', name: 'Renmoney',         init: 'RE', rate: 3.5, approval: '24–48 hrs', maxTenure: 24, color: '#6A2FB8' },
  { id: 'fairmoney',name: 'FairMoney MFB',   init: 'FA', rate: 3.8, approval: 'Same day',  maxTenure: 24, color: '#0E8F6E' },
];

function amortize(rate, n, financed) {
  const r = rate / 100;
  return financed * r / (1 - Math.pow(1 + r, -n));
}

// Shared state — set by compareQuotes before navigating here
let _selectedInstaller = null;
export function setFinancingInstaller(installer) {
  _selectedInstaller = installer;
  fcState.view = 'config';
}

let fcState = { down: 30, tenure: 36, picked: null, view: 'config', fundMode: 'loan' };
let _container = null;
let _navigate  = null;

function currentPrice() {
  // Use selected installer's price if available, else fall back to system kWp estimate
  if (_selectedInstaller?.price) return _selectedInstaller.price;
  return 4620000;
}

function systemKwp() {
  return getState().results?.solar?.panel_kwp?.toFixed(2) ?? 'N/A';
}

export function renderFinancing(container, navigate) {
  _container = container;
  _navigate  = navigate;
  _render();
}

function _render() {
  if (fcState.view === 'done') { renderDone(); return; }

  const PRICE    = currentPrice();
  const isLoan   = fcState.fundMode !== 'self';
  const financed = PRICE * (1 - fcState.down / 100);
  const downAmt  = PRICE * fcState.down / 100;

  // Sort by monthly cost; pin FairMoney + Renmoney to top of display
  const offers = BANKS.map(b => {
    const n = Math.min(fcState.tenure, b.maxTenure);
    const monthly = amortize(b.rate, n, financed);
    const total   = monthly * n + downAmt;
    return { ...b, n, monthly, total };
  }).sort((a, b) => a.monthly - b.monthly);

  const PINNED = ['fairmoney', 'renmoney'];
  const displayOffers = [
    ...offers.filter(o => PINNED.includes(o.id)),
    ...offers.filter(o => !PINNED.includes(o.id)),
  ];
  const bestOffer = offers[0];

  const fillPct   = ((fcState.down - 10) / 40) * 100;
  const rangeGrad = `linear-gradient(to right, #FCBF1E 0%, #FCBF1E ${fillPct}%, #E5E7EB ${fillPct}%, #E5E7EB 100%)`;

  const inst = _selectedInstaller;
  const instInit  = inst?.init ?? 'SO';
  const instName  = inst?.name ?? 'Your installer';
  const _st = getState();
  const _cityState    = _st.location?.state ?? 'Abuja (FCT)';
  const _cityDisplay  = _cityState.replace(/\s*\(FCT\)/i, '').trim();
  const _instDistrict = inst ? (getCityData(_cityState).installerAreas[inst.id] || inst.district) : null;
  const instSub = [inst?.warranty ? inst.warranty + ' warranty' : null, _instDistrict ? _instDistrict + ', ' + _cityDisplay : null].filter(Boolean).join(' · ');

  _container.innerHTML = `
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="fc-back">${ARROW_L}Back to quotes</button>
    </div>
    <div class="fc-page">
      <h1 class="fc-h1">Finance your solar system</h1>
      <p class="fc-sub">Pay outright with no interest, or spread the cost through a verified microfinance bank. Toggle between options below.</p>

      <!-- Funding mode switch -->
      <div class="fc-fund-switch-row">
        <span class="fc-switch-lbl ${!isLoan ? 'fc-switch-lbl--active' : ''}" data-mode="self">Pay outright</span>
        <div class="fc-switch-track ${isLoan ? 'is-on' : ''}" id="fc-mode-switch">
          <div class="fc-switch-thumb"></div>
        </div>
        <span class="fc-switch-lbl ${isLoan ? 'fc-switch-lbl--active' : ''}" data-mode="loan">Micro-finance loan</span>
      </div>

      <div class="fc-grid">
        <!-- LEFT: system card + configurator (loan only) or summary (self) -->
        <div>
          <div class="fc-card">
            <div class="fc-card-label">Your system</div>
            <div class="fc-system-row">
              <div class="fc-system-info">
                <div class="mk-logo-chip">${instInit}</div>
                <div>
                  <div class="fc-system-name">${instName} · ${systemKwp()} kWp system</div>
                  <div class="fc-system-sub">${instSub}</div>
                </div>
              </div>
              <div class="fc-system-cost">${fmt(PRICE)}</div>
            </div>
          </div>

          ${isLoan ? `
            <div class="fc-card">
              <div class="fc-down-header">
                <div class="fc-card-label" style="margin-bottom:0">Down payment</div>
                <div class="fc-down-pct" id="fc-down-pct">${fcState.down}%</div>
              </div>
              <input type="range" class="fc-range" id="fc-range"
                min="10" max="50" step="5" value="${fcState.down}"
                style="background:${rangeGrad}">
              <div class="fc-down-row" id="fc-down-row">
                <span>You pay now: <strong>${fmt(downAmt)}</strong></span>
                <span>To finance: <strong>${fmt(financed)}</strong></span>
              </div>
            </div>

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

            <div class="fc-hero">
              <div class="fc-hero-label">Best loan offer · ${bestOffer.name}</div>
              <div class="fc-hero-monthly">${fmt(bestOffer.monthly)}</div>
              <div class="fc-hero-sub">/ month &nbsp;·&nbsp; for ${fcState.tenure} months &nbsp;·&nbsp; lowest rate from ${offers.length} banks</div>
            </div>
          ` : `
            <div class="fc-card" style="background:var(--color-primary-bg);border-color:var(--color-primary)">
              <div class="fc-card-label" style="color:var(--color-primary-dark)">Full payment</div>
              <div style="font-size:clamp(28px,5vw,40px);font-weight:800;color:var(--color-text);margin-bottom:4px">${fmt(PRICE)}</div>
              <div style="font-size:13px;color:var(--color-text-secondary)">Single payment · no monthly obligations · no bank approval</div>
            </div>
          `}
        </div>

        <!-- RIGHT: loan cards or self-fund card -->
        <div>
          ${isLoan ? `
            <div style="font-size:16px;font-weight:700;color:var(--color-text);margin-bottom:4px">Loan offers for you</div>
            <div style="font-size:12px;color:var(--color-text-muted);margin-bottom:14px">FairMoney &amp; Renmoney featured · reducing-balance rates</div>

            ${displayOffers.map(o => {
              const isBest = o.id === bestOffer.id;
              return `
                <div class="fc-offer-card ${isBest ? 'best' : ''}">
                  <div class="fc-offer-top">
                    <div class="fc-bank-chip" style="background:${o.color}">${o.init}</div>
                    <div>
                      <div class="fc-offer-name">${o.name}</div>
                      <div class="fc-offer-sub">${o.rate}% / mo · ${o.approval} approval · up to ${o.maxTenure} mo</div>
                    </div>
                    ${isBest ? '<span class="fc-offer-badge fc-offer-badge--best">Lowest monthly</span>' : ''}
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
              Rates are indicative monthly reducing-balance figures. Final rates are confirmed during application. A soft credit check may apply; your score is not affected. NNEL Solar Hub never charges you to apply.
            </div>
          ` : `
            <div class="fc-offer-card fc-self-prominent">
              <div class="fc-offer-top">
                <div class="fc-bank-chip" style="background:var(--color-primary-dark);color:#111827;font-size:20px;font-weight:900">₦</div>
                <div>
                  <div class="fc-offer-name">Pay outright</div>
                  <div class="fc-offer-sub">No interest · No approval needed · Immediate start</div>
                </div>
              </div>
              <div style="padding:4px 16px 24px;text-align:center">
                <div style="font-size:clamp(36px,6vw,54px);font-weight:800;color:var(--color-text);line-height:1;margin-bottom:6px">${fmt(PRICE)}</div>
                <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:24px">One-time full payment · no monthly obligations</div>
                <button class="btn--amber" style="width:100%;padding:14px;font-size:14px;border-radius:10px" data-bank="self">Proceed with full payment</button>
              </div>
            </div>

            <div class="fc-trust" style="margin-top:14px">
              Self-funding means you pay the full cost upfront with no interest charges, no bank approval process, and no monthly repayments. Your installer can begin immediately after payment is confirmed.
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // Switch track toggles between modes; clicking a label sets its mode directly
  _container.querySelector('#fc-mode-switch')?.addEventListener('click', () => {
    fcState.fundMode = isLoan ? 'self' : 'loan'; _render();
  });
  _container.querySelectorAll('[data-mode]').forEach(el => {
    el.addEventListener('click', () => { fcState.fundMode = el.dataset.mode; _render(); });
  });

  if (isLoan) {
    // Range slider — live display on input, full re-render on change
    const range = _container.querySelector('#fc-range');
    range.addEventListener('input', () => {
      const val = parseInt(range.value);
      fcState.down = val;
      const pct = ((val - 10) / 40) * 100;
      range.style.background = `linear-gradient(to right, #FCBF1E 0%, #FCBF1E ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`;
      const pctEl = _container.querySelector('#fc-down-pct');
      if (pctEl) pctEl.textContent = `${val}%`;
      const PRICE_NOW = currentPrice();
      const rowEl = _container.querySelector('#fc-down-row');
      if (rowEl) rowEl.innerHTML = `<span>You pay now: <strong>${fmt(PRICE_NOW * val / 100)}</strong></span><span>To finance: <strong>${fmt(PRICE_NOW * (1 - val / 100))}</strong></span>`;
    });
    range.addEventListener('change', () => _render());

    // Tenure
    _container.querySelectorAll('[data-tenure]').forEach(btn => {
      btn.addEventListener('click', () => { fcState.tenure = parseInt(btn.dataset.tenure); _render(); });
    });

    // Select bank → show confirmation modal
    _container.querySelectorAll('[data-bank]').forEach(btn => {
      btn.addEventListener('click', () => {
        const bank = offers.find(o => o.id === btn.dataset.bank);
        if (bank) showLoanModal(bank, downAmt, financed);
      });
    });
  } else {
    // Self-fund select
    _container.querySelector('[data-bank="self"]')?.addEventListener('click', () => {
      fcState.picked = { id: 'self', name: 'self-fund', isSelf: true, monthly: 0, total: currentPrice(), approval: 'N/A' };
      fcState.view = 'done';
      _render();
    });
  }

  // Back
  _container.querySelector('#fc-back')?.addEventListener('click', () => _navigate('compare'));
}

function showLoanModal(bank, downAmt, financed) {
  const PRICE = currentPrice();
  const inst  = _selectedInstaller;

  const overlay = document.createElement('div');
  overlay.id = 'fc-modal-overlay';
  overlay.innerHTML = `
    <div class="fc-modal">
      <div class="fc-modal-head">
        <div class="fc-bank-chip" style="background:${bank.color};width:40px;height:40px;border-radius:10px;font-size:14px">${bank.init}</div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:var(--color-text)">${bank.name}</div>
          <div style="font-size:12px;color:var(--color-text-muted)">Loan application summary</div>
        </div>
        <button class="fc-modal-close" id="fc-modal-close">✕</button>
      </div>

      ${inst ? `<div class="fc-modal-installer">
        <div class="mk-logo-chip" style="width:28px;height:28px;font-size:10px">${inst.init}</div>
        <span style="font-size:13px;font-weight:600;color:var(--color-text)">${inst.name} · ${getState().results?.solar?.panel_kwp?.toFixed(2) ?? 'N/A'} kWp system</span>
      </div>` : ''}

      <div class="fc-modal-rows">
        <div class="fc-modal-row"><span class="fc-modal-lbl">System cost</span><span class="fc-modal-val">${fmt(PRICE)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Down payment (${fcState.down}%)</span><span class="fc-modal-val">${fmt(downAmt)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Loan amount</span><span class="fc-modal-val">${fmt(financed)}</span></div>
        <div class="fc-modal-row fc-modal-row--highlight"><span class="fc-modal-lbl">Monthly repayment</span><span class="fc-modal-val fc-modal-val--amber">${fmt(bank.monthly)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Repayment period</span><span class="fc-modal-val">${fcState.tenure} months</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Total payable</span><span class="fc-modal-val">${fmt(bank.total)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Approval time</span><span class="fc-modal-val">${bank.approval}</span></div>
      </div>

      <p class="fc-modal-note">By proceeding, you authorise ${bank.name} to conduct a soft credit check. Your credit score will not be affected. Rates confirmed during application.</p>
      <button class="btn btn--primary btn--lg fc-modal-cta" id="fc-modal-proceed">Proceed with application →</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#fc-modal-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#fc-modal-proceed').addEventListener('click', () => {
    overlay.remove();
    showApplyingPreloader(() => {
      fcState.picked = bank;
      fcState.view   = 'done';
      _render();
    });
  });
}

function showApplyingPreloader(onDone) {
  const el = document.createElement('div');
  el.id = 'fc-apply-overlay';
  el.innerHTML = `
    <div class="fc-apply-inner">
      <div class="fc-apply-spinner"></div>
      <div class="fc-apply-label">Submitting your application…</div>
      <div class="fc-apply-sub">Sending your energy profile to the bank</div>
    </div>
  `;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.4s ease';
    setTimeout(() => { el.remove(); onDone(); }, 420);
  }, 3000);
}

function renderDone() {
  const b = fcState.picked;
  const PRICE = currentPrice();
  const downAmt = PRICE * fcState.down / 100;
  const instName = _selectedInstaller?.name ?? 'your installer';

  const body = b.isSelf
    ? `<p>You've chosen to self-fund your solar investment. ${instName} will be in touch to schedule a site survey and confirm installation dates.</p>`
    : `<p>We've sent your verified energy profile and system specification to ${b.name}. Expect a decision within <strong>${b.approval}</strong>. ${instName} is on standby to schedule your site survey once approved.</p>`;

  const statStrip = b.isSelf
    ? `
      <div class="fc-stat-strip">
        <div class="fc-stat-cell">
          <div class="label">System cost</div>
          <div class="value value--amber">${fmt(PRICE)}</div>
        </div>
        <div class="fc-stat-cell">
          <div class="label">Monthly</div>
          <div class="value">None</div>
        </div>
        <div class="fc-stat-cell">
          <div class="label">Financing</div>
          <div class="value">Self-funded</div>
        </div>
      </div>`
    : `
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
      </div>`;

  _container.innerHTML = `
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="fc-done-back">${ARROW_L}Back to quotes</button>
    </div>
    <div class="fc-page">
      <div class="fc-done">
        <div class="fc-tick-circle">
          <div class="fc-tick"></div>
        </div>
        <h1>${b.isSelf ? 'You\'re all set to self-fund.' : 'Your application is on its way to ' + b.name + '.'}</h1>
        ${body}
        ${statStrip}
        <button class="btn--dark-outline" id="fc-adjust" style="font-size:13px;padding:10px 20px">Adjust my plan</button>
      </div>
    </div>
  `;

  _container.querySelector('#fc-adjust').addEventListener('click', () => {
    fcState.view = 'config';
    _render();
  });
  _container.querySelector('#fc-done-back')?.addEventListener('click', () => _navigate('compare'));
}
