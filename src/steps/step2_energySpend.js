import { getState, setState, getData } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';
import { renderSlider, bindSlider, formatNaira } from '../components/slider.js';
import { renderRadioCards, bindRadioCards } from '../components/radioCard.js';

const POLE_SVG   = `<img src="/icons/grid_only.png" width="72" height="72" style="object-fit:contain">`;
const GEN_SVG    = `<img src="/icons/generator_only.png" width="72" height="72" style="object-fit:contain">`;
const BOTH_SVG   = `<img src="/icons/grid_and_generator.png" width="72" height="72" style="object-fit:contain">`;

const GEN_SVG_SMALL  = `<img src="/icons/small_generator_i_better_pass_my_neighbour.png" width="72" height="72" style="object-fit:contain">`;
const GEN_SVG_MEDIUM = `<img src="/icons/medium_generator.png" width="72" height="72" style="object-fit:contain">`;
const GEN_SVG_LARGE  = `<img src="/icons/silent_diesel_generator.png" width="72" height="72" style="object-fit:contain">`;

const SOURCES = [
  { id: 'grid_only',      emoji: POLE_SVG,  name: 'Grid Only',        desc: 'I rely solely on NEPA/DisCo grid supply' },
  { id: 'generator_only', emoji: GEN_SVG,   name: 'Generator Only',   desc: 'No grid, I run a generator for power' },
  { id: 'both',           emoji: BOTH_SVG,  name: 'Grid + Generator', desc: 'I use both grid and a backup generator' }
];

const GEN_CARDS = [
  { id: 'small',  emoji: GEN_SVG_SMALL,  label: 'I better pass my neighbour', name: 'Small (1–2 KVA)' },
  { id: 'medium', emoji: GEN_SVG_MEDIUM, label: 'Gasoline generator',          name: 'Medium (3–5 KVA)' },
  { id: 'large',  emoji: GEN_SVG_LARGE,  label: 'Silent diesel generator',     name: 'Large (6–10 KVA)' }
];

export function renderStep2(container, navigate) {
  function render() {
    const s       = getState();
    const tariffs = getData('tariff_bands') || [];

    const showGrid = s.powerSource === 'grid_only' || s.powerSource === 'both';
    const showGen  = s.powerSource === 'generator_only' || s.powerSource === 'both';
    const canContinue = s.powerSource &&
      (!showGrid || !!s.tariffBand) &&
      (!showGen  || !!s.generatorSize);

    container.innerHTML = `
      <div class="wizard-step">
        <div class="wizard-header">
          <button class="back-btn" id="back-btn">← Back</button>
          ${renderProgressBar(2)}
          <div style="width:90px"></div>
        </div>

        <div class="step-body">
          <h1 class="step-title">Energy source &amp; monthly spend</h1>
          <p class="step-subtitle">Tell us how you currently power your home and what you spend</p>

          <div class="section-title" style="margin-bottom:14px">How do you currently power your home?</div>
          ${renderRadioCards({ cards: SOURCES, selected: s.powerSource, name: 'power-source' })}

          ${showGrid ? `
            <div class="section-title" style="margin-top:32px;margin-bottom:12px">Grid electricity</div>
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:10px">What is your electricity tariff band?</div>
            <div class="tariff-pills" id="tariff-pills">
              ${tariffs.map(t => `
                <button class="tariff-pill ${s.tariffBand === t.band ? 'selected' : ''}" data-band="${t.band}">${t.band}</button>
              `).join('')}
            </div>
            ${s.tariffBand ? `
              <div class="card" style="margin-top:10px;margin-bottom:16px;background:var(--color-primary-bg);border-color:var(--color-primary-light);padding:10px 14px">
                <div style="display:flex;align-items:center;gap:14px">
                  <div class="tag tag--amber">${s.tariffBand}</div>
                  <div style="font-size:12px;color:var(--color-text-secondary)">
                    ${tariffs.find(t => t.band === s.tariffBand)?.hours_of_supply || ''} hrs/day
                    &nbsp;·&nbsp; ₦${tariffs.find(t => t.band === s.tariffBand)?.tariff_naira_per_kwh || ''}/kWh
                  </div>
                </div>
              </div>
            ` : '<div style="margin-bottom:16px"></div>'}
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:6px">Monthly grid spend</div>
            ${renderSlider({ id: 'grid-spend-slider', value: s.gridSpend, min: 10000, max: 1000000, step: 10000, ticks: [10000, 250000, 500000, 750000, 1000000], label: 'per month' })}
          ` : ''}

          ${showGen ? `
            <div class="section-title" style="margin-top:32px;margin-bottom:12px">Generator</div>
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:10px">Choose your generator size</div>
            ${renderRadioCards({ cards: GEN_CARDS, selected: s.generatorSize, name: 'gen-size' })}
            <div style="font-size:14px;color:var(--color-text-muted);margin-top:20px;margin-bottom:6px">Monthly fuel spend</div>
            ${renderSlider({ id: 'fuel-spend-slider', value: s.fuelSpend, min: 10000, max: 1000000, step: 10000, ticks: [10000, 250000, 500000, 750000, 1000000], label: 'per month' })}
          ` : ''}
        </div>

        <div class="step-footer">
          <button class="btn btn--primary btn--lg" id="continue-btn" ${!canContinue ? 'disabled' : ''}>Continue</button>
        </div>
      </div>
    `;

    bindAll();
  }

  function bindAll() {
    document.getElementById('back-btn').addEventListener('click', () => navigate('step1'));
    document.getElementById('continue-btn').addEventListener('click', () => navigate('step3'));

    bindRadioCards('power-source', val => {
      setState({ powerSource: val });
      render();
    });

    document.querySelectorAll('.tariff-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        setState({ tariffBand: pill.dataset.band });
        render();
      });
    });

    bindRadioCards('gen-size', val => {
      setState({ generatorSize: val });
      render();
    });

    if (document.getElementById('grid-spend-slider')) {
      bindSlider('grid-spend-slider', formatNaira, val => setState({ gridSpend: val }));
    }
    if (document.getElementById('fuel-spend-slider')) {
      bindSlider('fuel-spend-slider', formatNaira, val => setState({ fuelSpend: val }));
    }
  }

  render();
}
