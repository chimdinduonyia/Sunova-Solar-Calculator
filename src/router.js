import { renderStep1 } from './steps/step1_location.js';
import { renderStep2 } from './steps/step2_powerSource.js';
import { renderStep3 } from './steps/step3_gridSpend.js';
import { renderStep4 } from './steps/step4_fuelSpend.js';
import { renderStep5 } from './steps/step5_homeProfile.js';
import { renderStep6 } from './steps/step6_goals.js';
import { renderLoadProfile } from './results/loadProfile.js';
import { renderSolarPVSystem } from './results/solarPVSystem.js';
import { renderCostSavings } from './results/costSavings.js';
import { renderFinalQuote } from './results/finalQuote.js';
import { computeResults } from './utils/computeResults.js';

const WIZARD_ROUTES  = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
const RESULTS_ROUTES = ['costSavings', 'loadProfile', 'solarPVSystem', 'finalQuote'];

// Tab order: Cost Savings shown first after Generate Results
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
    route: 'finalQuote',
    label: 'Final Quote',
    sublabel: 'System &amp; BOM',
    paths: `<rect x="3" y="1" width="10" height="14" rx="1"/><line x1="6" y1="5" x2="10" y2="5"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="8.5" y2="11"/>`
  }
];

const renderers = {
  step1: renderStep1,
  step2: renderStep2,
  step3: renderStep3,
  step4: renderStep4,
  step5: renderStep5,
  step6: renderStep6,
  costSavings:   renderCostSavings,
  loadProfile:   renderLoadProfile,
  solarPVSystem: renderSolarPVSystem,
  finalQuote:    renderFinalQuote
};

let _current = 'step1';
let _mobileNavBound = false;

export function navigate(route) {
  _current = route;
  render();
}

export function getCurrentRoute() {
  return _current;
}

function render() {
  const wizardLayout  = document.getElementById('wizard-layout');
  const resultsLayout = document.getElementById('results-layout');

  if (WIZARD_ROUTES.includes(_current)) {
    wizardLayout.classList.remove('hidden');
    resultsLayout.classList.add('hidden');
    const container = document.getElementById('wizard-content');
    container.innerHTML = '';
    renderers[_current](container, navigate);
    document.querySelector('.right-panel').scrollTop = 0;
  } else {
    wizardLayout.classList.add('hidden');
    resultsLayout.classList.remove('hidden');
    computeResults();
    renderResultsNav();
    bindMobileNav();
    const container = document.getElementById('results-content');
    container.innerHTML = '';
    container.classList.remove('page-enter');
    void container.offsetWidth;
    container.classList.add('page-enter');
    renderers[_current](container, navigate);
    setTimeout(() => container.classList.remove('page-enter'), 300);
  }
}

function renderResultsNav() {
  const nav       = document.getElementById('results-nav');
  const actionsEl = document.getElementById('results-actions');

  nav.innerHTML = TABS.map(tab => `
    <div class="results-nav__item${tab.route === _current ? ' active' : ''}" data-route="${tab.route}">
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
    <button class="btn btn--outline btn--sm btn--full" id="adjust-home-btn" style="margin-top:8px">Adjust Home Profile</button>
  `;
  document.getElementById('adjust-energy-btn')?.addEventListener('click', () => navigate('step1'));
  document.getElementById('adjust-home-btn')?.addEventListener('click', () => navigate('step5'));
}

function bindMobileNav() {
  if (_mobileNavBound) return;
  _mobileNavBound = true;

  const hamburger  = document.getElementById('results-hamburger');
  const closeBtn   = document.getElementById('offcanvas-close-btn');
  const backdrop   = document.getElementById('offcanvas-backdrop');
  const sidebar    = document.querySelector('.results-sidebar');

  function openDrawer() {
    sidebar.classList.add('is-open');
    backdrop.classList.add('is-visible');
  }
  function closeDrawer() {
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
  }

  hamburger?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  // Close drawer when a nav item is clicked (delegate to stable sidebar parent)
  sidebar?.addEventListener('click', e => {
    if (e.target.closest('[data-route]')) closeDrawer();
  });
}

export function init() {
  window._navigate = navigate;
  render();
}
