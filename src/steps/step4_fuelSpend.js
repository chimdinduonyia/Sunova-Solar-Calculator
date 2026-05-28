import { getState, setState, getData } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';
import { renderSlider, bindSlider, formatNaira } from '../components/slider.js';
import { renderRadioCards, bindRadioCards } from '../components/radioCard.js';
import { computeResults } from '../utils/computeResults.js';

const GEN_SVG_SMALL = `<img src="/icons/small_generator_i_better_pass_my_neighbour.png" width="72" height="72" style="object-fit:contain">`;

const GEN_SVG_MEDIUM = `<img src="/icons/medium_generator.png" width="72" height="72" style="object-fit:contain">`;

const GEN_SVG_LARGE = `<img src="/icons/silent_diesel_generator.png" width="72" height="72" style="object-fit:contain">`;

const GEN_CARDS = [
  { id: 'small',  emoji: GEN_SVG_SMALL,  label: 'I better pass my neighbour', name: 'Small (1–2 KVA)' },
  { id: 'medium', emoji: GEN_SVG_MEDIUM, label: 'Gasoline generator',          name: 'Medium (3–5 KVA)' },
  { id: 'large',  emoji: GEN_SVG_LARGE,  label: 'Silent diesel generator',     name: 'Large (6–10 KVA)' }
];

export function renderStep4(container, navigate) {
  const state = getState();

  container.innerHTML = `
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${renderProgressBar(4)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <div class="step-head">
          <div>
            <h1 class="step-title">How much do you spend on fuel monthly?</h1>
            <p class="step-subtitle">Select an estimate and choose your generator size</p>
          </div>
          <span style="font-size:88px">🔋</span>
        </div>

        ${renderSlider({
          id: 'fuel-spend-slider',
          value: state.fuelSpend,
          min: 10000,
          max: 1000000,
          step: 10000,
          ticks: [10000, 250000, 500000, 750000, 1000000],
          label: 'per month'
        })}

        <div class="section-title" style="margin-top:28px;margin-bottom:16px">Choose your generator size</div>
        ${renderRadioCards({ cards: GEN_CARDS, selected: state.generatorSize, name: 'gen-size' })}
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="continue-btn" ${!state.generatorSize ? 'disabled' : ''}>Generate Results</button>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => {
    navigate(getState().powerSource === 'generator_only' ? 'step2' : 'step3');
  });
  document.getElementById('continue-btn').addEventListener('click', () => { computeResults(); navigate('costSavings'); });

  bindSlider('fuel-spend-slider', formatNaira, val => setState({ fuelSpend: val }));
  bindRadioCards('gen-size', val => {
    setState({ generatorSize: val });
    document.getElementById('continue-btn').disabled = false;
  });
}
