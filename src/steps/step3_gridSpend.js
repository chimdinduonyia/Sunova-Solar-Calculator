import { getState, setState, getData } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';
import { renderSlider, bindSlider, formatNaira } from '../components/slider.js';
import { computeResults } from '../utils/computeResults.js';

export function renderStep3(container, navigate) {
  const state   = getState();
  const tariffs = getData('tariff_bands') || [];

  // When grid_only this is the last step in Wizard 1 → show "Generate Results"
  const isLastStep = state.powerSource === 'grid_only';
  const primaryBtnLabel = isLastStep ? 'Generate Results' : 'Continue';

  function handlePrimary() {
    if (getState().powerSource === 'grid_only') { computeResults(); navigate('costSavings'); }
    else navigate('step4');
  }

  container.innerHTML = `
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${renderProgressBar(3)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <div class="step-head">
          <div>
            <h1 class="step-title">How much do you spend on grid electricity monthly?</h1>
            <p class="step-subtitle">Enter your average monthly NEPA/DisCo bill</p>
          </div>
          <span style="font-size:72px">💡</span>
        </div>

        <div class="section-title" style="margin-bottom:12px">What is your electricity tariff band?</div>
        <div class="tariff-pills" id="tariff-pills">
          ${tariffs.map(t => `
            <button class="tariff-pill ${state.tariffBand === t.band ? 'selected' : ''}" data-band="${t.band}">
              ${t.band}
            </button>
          `).join('')}
        </div>
        ${state.tariffBand ? `
          <div class="card" style="width:fit-content;margin-bottom:20px;background:var(--color-primary-bg);border-color:var(--color-primary-light);padding:12px 16px">
            <div style="display:flex;align-items:center;gap:16px">
              <div class="tag tag--amber">${state.tariffBand}</div>
              <div style="font-size:13px;color:var(--color-text-secondary)" id="tariff-desc">
                ₦${tariffs.find(t => t.band === state.tariffBand)?.tariff_naira_per_kwh || ''}/kWh
                &nbsp;<span class="badge-nerc">NERC</span>
              </div>
            </div>
          </div>
        ` : '<div id="tariff-desc"></div>'}

        <div class="section-title" style="margin-bottom:12px">Monthly grid spend</div>
        ${renderSlider({
          id: 'grid-spend-slider',
          value: state.gridSpend,
          min: 10000,
          max: 1000000,
          step: 10000,
          ticks: [10000, 250000, 500000, 750000, 1000000],
          label: 'per month'
        })}
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="continue-btn" ${!state.tariffBand ? 'disabled' : ''}>${primaryBtnLabel}</button>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigate('step2'));
  document.getElementById('continue-btn').addEventListener('click', handlePrimary);

  document.querySelectorAll('.tariff-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const band = pill.dataset.band;
      setState({ tariffBand: band });
      renderStep3(container, navigate);
    });
  });

  bindSlider('grid-spend-slider', formatNaira, val => setState({ gridSpend: val }));
}
