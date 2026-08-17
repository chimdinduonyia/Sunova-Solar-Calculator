import { renderStep1 } from './steps/step1_location.js';
import { renderStep2 } from './steps/step2_energySpend.js';
import { renderStep3 } from './steps/step6_goals.js';
import { renderLoadProfile }   from './results/loadProfile.js';
import { renderSolarPVSystem } from './results/solarPVSystem.js';
import { renderCostSavings }   from './results/costSavings.js';
import { renderAddAppliances } from './results/addAppliances.js';
import { computeResults } from './utils/computeResults.js';
import { CTA_URL } from './config.js';
import { openModal, bindModalClose, modalHtml } from './components/modal.js';

const WIZARD_ROUTES  = ['step1', 'step2', 'step3'];
const SCROLL_ROUTES  = ['costSavings', 'loadProfile', 'solarPVSystem'];

const TABS = [
  {
    route: 'costSavings',
    label: 'Cost Savings',
    sublabel: 'Financial Breakdown',
    paths: `<polyline points="1,13 5,9 8,11 14,4"/><polyline points="10,4 14,4 14,8"/>`
  },
  {
    route: 'loadProfile',
    label: 'Load Summary',
    sublabel: 'Energy Profile',
    paths: `<rect x="2" y="10" width="3" height="4" rx="0.5"/><rect x="6.5" y="6" width="3" height="8" rx="0.5"/><rect x="11" y="2" width="3" height="12" rx="0.5"/>`
  },
  {
    route: 'solarPVSystem',
    label: 'Solar PV System',
    sublabel: 'Recommendation',
    paths: `<circle cx="8" cy="8" r="2.5"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3.34" y1="3.34" x2="4.75" y2="4.75"/><line x1="11.25" y1="11.25" x2="12.66" y2="12.66"/><line x1="12.66" y1="3.34" x2="11.25" y2="4.75"/><line x1="4.75" y1="11.25" x2="3.34" y2="12.66"/>`
  },
];

let _current        = 'step1';
let _isScrollMode   = false;
let _mobileNavBound = false;
let _scrollCleanup  = null;
let _poppingState   = false;

export function navigate(route, { replace = false } = {}) {
  // Push/replace history entry
  if (!_poppingState) {
    if (replace) {
      history.replaceState({ route }, '', '#' + route);
    } else {
      history.pushState({ route }, '', '#' + route);
    }
  }

  // Within scroll view: scroll to section without re-rendering
  if (_isScrollMode && SCROLL_ROUTES.includes(route)) {
    _current = route;
    scrollToSection(route);
    setActiveTab(route);
    return;
  }

  _current = route;

  if (SCROLL_ROUTES.includes(route)) {
    _isScrollMode = true;
    renderScrollMode(route);
  } else {
    _isScrollMode = false;
    render();
  }
}

export function getCurrentRoute() { return _current; }

// ── Scroll mode (3 result sections in one tall page) ─────────────────────

function renderScrollMode(scrollTo) {
  const wizardLayout  = document.getElementById('wizard-layout');
  const resultsLayout = document.getElementById('results-layout');

  wizardLayout.classList.add('hidden');
  resultsLayout.classList.remove('hidden');

  computeResults();
  renderResultsNav();
  bindMobileNav();

  if (_scrollCleanup) { _scrollCleanup(); _scrollCleanup = null; }

  const container = document.getElementById('results-content');
  container.innerHTML = `
    <div id="section-costSavings"   data-section="costSavings"></div>
    <div id="section-loadProfile"   data-section="loadProfile"></div>
    <div id="section-solarPVSystem" data-section="solarPVSystem"></div>
  `;

  renderCostSavings(document.getElementById('section-costSavings'), navigate);
  renderLoadProfile(document.getElementById('section-loadProfile'), navigate);
  renderSolarPVSystem(document.getElementById('section-solarPVSystem'), navigate);

  _scrollCleanup = initScrollSpy();
  setScrollProgress(0);

  if (scrollTo) {
    requestAnimationFrame(() => scrollToSection(scrollTo));
  }
}

function setScrollProgress(pct) {
  const bar = document.getElementById('scroll-progress-bar');
  if (bar) bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
}

function getScrollContainer() {
  // In results layout the scrollable element is #results-content (.results-main)
  const resultsMain = document.getElementById('results-content');
  if (resultsMain && resultsMain.scrollHeight > resultsMain.clientHeight) return resultsMain;
  // In wizard layout it is .right-panel
  const panel = document.querySelector('.right-panel');
  if (panel && panel.scrollHeight > panel.clientHeight) return panel;
  return null;
}

function scrollToSection(route) {
  const el        = document.getElementById(`section-${route}`);
  if (!el) return;
  const panel = getScrollContainer();
  if (panel) {
    const panelRect = panel.getBoundingClientRect();
    const elRect    = el.getBoundingClientRect();
    panel.scrollTo({ top: panel.scrollTop + elRect.top - panelRect.top, behavior: 'smooth' });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function initScrollSpy() {
  const panel = getScrollContainer();
  const target = panel || window;

  function onScroll() {
    const viewH       = panel ? panel.clientHeight : window.innerHeight;
    const viewTop     = panel ? panel.getBoundingClientRect().top : 0;
    const triggerLine = viewTop + viewH * 0.3;
    let activeRoute   = SCROLL_ROUTES[0];

    for (const route of SCROLL_ROUTES) {
      const el = document.getElementById(`section-${route}`);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= triggerLine) activeRoute = route;
    }

    if (activeRoute !== _current) {
      _current = activeRoute;
      setActiveTab(activeRoute);
    }

    const scrollTop    = panel ? panel.scrollTop    : window.scrollY;
    const scrollHeight = panel ? panel.scrollHeight : document.documentElement.scrollHeight;
    const clientHeight = panel ? panel.clientHeight : window.innerHeight;
    const scrollable   = scrollHeight - clientHeight;
    setScrollProgress(scrollable > 0 ? (scrollTop / scrollable) * 100 : 0);
  }

  target.addEventListener('scroll', onScroll, { passive: true });
  return () => target.removeEventListener('scroll', onScroll);
}

function setActiveTab(route) {
  document.querySelectorAll('#results-nav [data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route);
  });
}

// ── Single-page (wizard + overlay pages) mode ─────────────────────────────

function render() {
  const wizardLayout  = document.getElementById('wizard-layout');
  const resultsLayout = document.getElementById('results-layout');

  if (_scrollCleanup) { _scrollCleanup(); _scrollCleanup = null; }

  if (WIZARD_ROUTES.includes(_current)) {
    wizardLayout.classList.remove('hidden');
    resultsLayout.classList.add('hidden');
    const container = document.getElementById('wizard-content');
    container.innerHTML = '';
    const r = { step1: renderStep1, step2: renderStep2, step3: renderStep3 };
    r[_current](container, navigate);
    document.querySelector('.right-panel').scrollTop = 0;
  } else if (_current === 'addAppliances') {
    wizardLayout.classList.add('hidden');
    resultsLayout.classList.remove('hidden');
    renderResultsNav();
    bindMobileNav();
    const container = document.getElementById('results-content');
    container.innerHTML = '';
    renderAddAppliances(container, navigate);
    requestAnimationFrame(() => { container.scrollTop = 0; });
  }
}

// ── Results nav ───────────────────────────────────────────────────────────

function renderResultsNav() {
  const nav       = document.getElementById('results-nav');
  const actionsEl = document.getElementById('results-actions');

  const activeRoute = _current;

  nav.innerHTML = TABS.map(tab => `
    <div class="results-nav__item${tab.route === activeRoute ? ' active' : ''}" data-route="${tab.route}">
      <svg class="results-nav__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${tab.paths}
      </svg>
      <div class="results-nav__label-wrap">
        <span class="results-nav__label">${tab.label}</span>
        <span class="results-nav__sublabel">${tab.sublabel}</span>
      </div>
    </div>
  `).join('');

  nav.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.route));
  });

  actionsEl.innerHTML = `
    <div class="results-cta-card">
      <div class="results-cta-card__title">Ready to go solar?</div>
      <div class="results-cta-card__divider"></div>
      <div class="results-cta-card__subtitle">Get Started on your solar journey. Sign up for NNEL Project SHINE today and let the sun pay your bills.</div>
      <a class="btn btn--primary btn--full" id="sidebar-cta-btn" href="${CTA_URL}" target="_blank" rel="noopener noreferrer">Get Started</a>
    </div>
    <div class="results-sidebar__quick-actions">
      <button class="icon-btn" id="print-report-btn" type="button" title="Print report" aria-label="Print report">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4.5 6.2V2.8a.6.6 0 0 1 .6-.6h5.8a.6.6 0 0 1 .6.6v3.4"/>
          <rect x="2" y="6.2" width="12" height="5.2" rx="1"/>
          <rect x="4.5" y="9.4" width="7" height="3.8" rx=".4"/>
          <circle cx="11.2" cy="8.3" r=".4" fill="currentColor" stroke="none"/>
        </svg>
        <span>Print</span>
      </button>
      <button class="icon-btn" id="share-app-btn" type="button" title="Share app" aria-label="Share app">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12.5" cy="3.5" r="1.7"/>
          <circle cx="3.5" cy="8" r="1.7"/>
          <circle cx="12.5" cy="12.5" r="1.7"/>
          <line x1="5" y1="7.1" x2="11" y2="4.3"/>
          <line x1="5" y1="8.9" x2="11" y2="11.7"/>
        </svg>
        <span>Share</span>
      </button>
    </div>
    <button class="btn btn--outline btn--sm btn--full" id="adjust-energy-btn">Adjust Inputs</button>
  `;
  document.getElementById('adjust-energy-btn')?.addEventListener('click', () => navigate('step1'));
  document.getElementById('print-report-btn')?.addEventListener('click', handlePrintReport);
  document.getElementById('share-app-btn')?.addEventListener('click', handleShareApp);
}

// ── Print report ─────────────────────────────────────────────────────────

function handlePrintReport() {
  window.print();
}

// ── Share app ────────────────────────────────────────────────────────────

function handleShareApp() {
  // Share the app itself (not a personalised results URL — state lives in
  // memory, not the URL), so friends land on step 1 and run their own numbers.
  const shareUrl = `${window.location.origin}${window.location.pathname}`;

  openModal(modalHtml({
    title: 'Share NNEL Solar Hub',
    subtitle: 'Send this link to friends and family so they can size their own solar system.',
    body: `
      <div style="padding:20px 0 24px;display:flex;gap:8px">
        <input type="text" id="share-link-input" readonly value="${shareUrl}"
          style="flex:1;min-width:0;padding:10px 12px;border:1.5px solid var(--color-border);border-radius:8px;font-size:13px;color:var(--color-text-secondary);background:var(--color-border-light)">
        <button class="btn btn--primary btn--sm" id="share-copy-btn" type="button">Copy</button>
      </div>
    `,
  }));
  bindModalClose();

  const input   = document.getElementById('share-link-input');
  const copyBtn = document.getElementById('share-copy-btn');

  input?.addEventListener('click', () => input.select());

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      input.select();
      document.execCommand('copy');
    }
    copyBtn.textContent = 'Copied';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
  });
}

function bindMobileNav() {
  if (_mobileNavBound) return;
  _mobileNavBound = true;

  const hamburger = document.getElementById('results-hamburger');
  const closeBtn  = document.getElementById('offcanvas-close-btn');
  const backdrop  = document.getElementById('offcanvas-backdrop');
  const sidebar   = document.querySelector('.results-sidebar');

  function openDrawer()  { sidebar.classList.add('is-open');    backdrop.classList.add('is-visible'); }
  function closeDrawer() { sidebar.classList.remove('is-open'); backdrop.classList.remove('is-visible'); }

  hamburger?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  sidebar?.addEventListener('click', e => { if (e.target.closest('[data-route]')) closeDrawer(); });
}

export function init() {
  window._navigate = navigate;

  window.addEventListener('popstate', (e) => {
    const route = e.state?.route || 'calculator';
    _poppingState = true;
    navigate(route);
    _poppingState = false;
  });

  // Wizard logos → step 1
  document.querySelectorAll('.logo, .mobile-top-bar').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => navigate('step1'));
  });

  // Results page logos → step 1 (same as Adjust Data)
  document.querySelectorAll('.results-sidebar__logo, .results-mobile-topbar__logo').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', e => {
      if (e.target.closest('.offcanvas-close-btn')) return;
      navigate('step1');
    });
  });

  navigate('step1', { replace: true });
}
