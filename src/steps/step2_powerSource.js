import { getState, setState } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';
import { renderRadioCards, bindRadioCards } from '../components/radioCard.js';

const POLE_SVG = `<img src="/icons/grid_only.png" width="72" height="72" style="object-fit:contain">`;

const GEN_SVG = `<img src="/icons/generator_only.png" width="72" height="72" style="object-fit:contain">`;

const BOTH_SVG = `<img src="/icons/grid_and_generator.png" width="72" height="72" style="object-fit:contain">`;

const SOURCES = [
  { id: 'grid_only',      emoji: POLE_SVG, name: 'Grid Only',        desc: 'I rely solely on NEPA/DisCo grid supply' },
  { id: 'generator_only', emoji: GEN_SVG,  name: 'Generator Only',   desc: 'No grid, I run a generator for power' },
  { id: 'both',           emoji: BOTH_SVG, name: 'Grid + Generator', desc: 'I use both grid and a backup generator' }
];

export function renderStep2(container, navigate) {
  const state = getState();

  container.innerHTML = `
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${renderProgressBar(2)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <div class="step-head">
          <div>
            <h1 class="step-title">What is your current power source?</h1>
            <p class="step-subtitle">Select how you currently power your home, and we'll move you straight to the next step</p>
          </div>
          <span style="font-size:72px">⚡</span>
        </div>

        ${renderRadioCards({ cards: SOURCES, selected: state.powerSource, name: 'power-source' })}
      </div>

      <div class="step-footer">
        <div style="width:1px"></div>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigate('step1'));

  // Every selection immediately advances; no Continue button needed
  bindRadioCards('power-source', val => {
    setState({ powerSource: val });
    navigate(val === 'generator_only' ? 'step4' : 'step3');
  });
}
