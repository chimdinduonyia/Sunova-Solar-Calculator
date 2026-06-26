import { renderStep1 } from './steps/step1_location.js';
import { renderStep2 } from './steps/step2_energySpend.js';
import { renderStep3 } from './steps/step6_goals.js';
import { renderLoadProfile }   from './results/loadProfile.js';
import { renderSolarPVSystem } from './results/solarPVSystem.js';
import { renderCostSavings }   from './results/costSavings.js';
import { renderFinalQuote }    from './results/finalQuote.js';
import { renderAddAppliances } from './results/addAppliances.js';
import { renderMarketplace }   from './results/marketplace.js';
import { renderCompareQuotes } from './results/compareQuotes.js';
import { renderFinancing }     from './results/financing.js';
import { computeResults } from './utils/computeResults.js';

const WIZARD_ROUTES  = ['step1', 'step2', 'step3'];
const SCROLL_ROUTES  = ['costSavings', 'loadProfile', 'solarPVSystem', 'finalQuote'];

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
  {
    route: 'addAppliances',
    label: 'Add Appliances',
    sublabel: 'Customise Profile',
    paths: `<rect x="1" y="3" width="14" height="10" rx="1.5"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="9" x2="9" y2="9"/><line x1="12" y1="11" x2="15" y2="14"/>`
  },
  {
    route: 'market',
    label: 'Find Installers',
    sublabel: 'Solar Marketplace',
    paths: `<circle cx="6" cy="6" r="4"/><line x1="9.5" y1="9.5" x2="15" y2="15"/>`
  },
  {
    route: 'compare',
    label: 'Compare Quotes',
    sublabel: 'Side by Side',
    paths: `<rect x="1" y="4" width="4" height="9" rx="1"/><rect x="6" y="2" width="4" height="11" rx="1"/><rect x="11" y="6" width="4" height="7" rx="1"/>`
  },
  {
    route: 'financing',
    label: 'Financing',
    sublabel: 'Payment Plans',
    paths: `<circle cx="8" cy="8" r="6.5"/><line x1="8" y1="5" x2="8" y2="8"/><line x1="8" y1="8" x2="11" y2="8"/>`
  }
];

const renderers = {
  step1: renderStep1,
  step2: renderStep2,
  step3: renderStep3,
  costSavings:   renderCostSavings,
  loadProfile:   renderLoadProfile,
  solarPVSystem: renderSolarPVSystem,
  finalQuote:    renderFinalQuote,
  addAppliances: renderAddAppliances,
  market:        renderMarketplace,
  compare:       renderCompareQuotes,
  financing:     renderFinancing,
};

let _current       = 'step1';
let _isScrollMode  = false;
let _mobileNavBound = false;
let _scrollCleanup = null;

export function navigate(route) {
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

// ── Scroll mode (all 4 result sections in one tall page) ──────────────────

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
    <div id="section-finalQuote"    data-section="finalQuote"></div>
  `;

  renderCostSavings(document.getElementById('section-costSavings'), navigate);
  renderLoadProfile(document.getElementById('section-loadProfile'), navigate);
  renderSolarPVSystem(document.getElementById('section-solarPVSystem'), navigate);
  renderFinalQuote(document.getElementById('section-finalQuote'), navigate);

  _scrollCleanup = initScrollSpy();

  if (scrollTo) {
    requestAnimationFrame(() => scrollToSection(scrollTo));
  }
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
  }

  target.addEventListener('scroll', onScroll, { passive: true });
  return () => target.removeEventListener('scroll', onScroll);
}

function setActiveTab(route) {
  document.querySelectorAll('#results-nav [data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route);
  });
}

// ── Single-page (wizard + addAppliances) mode ─────────────────────────────

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
  } else if (['addAppliances', 'market', 'compare', 'financing'].includes(_current)) {
    wizardLayout.classList.add('hidden');
    resultsLayout.classList.remove('hidden');
    renderResultsNav();
    bindMobileNav();
    const container = document.getElementById('results-content');
    container.innerHTML = '';
    renderers[_current](container, navigate);
    requestAnimationFrame(() => { container.scrollTop = 0; });
  }
}

// ── Results nav ───────────────────────────────────────────────────────────

function renderResultsNav() {
  const nav       = document.getElementById('results-nav');
  const actionsEl = document.getElementById('results-actions');

  const activeRoute = _isScrollMode ? _current : _current;

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
    <button class="btn btn--outline btn--sm btn--full" id="adjust-energy-btn">Adjust Energy Data</button>
  `;
  document.getElementById('adjust-energy-btn')?.addEventListener('click', () => navigate('step1'));
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

  // Logo / top-bar clicks → restart wizard from step 1
  document.querySelectorAll('.logo, .mobile-top-bar').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => navigate('step1'));
  });

  render();
}
