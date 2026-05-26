import { getState, setState, getData } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';
import { renderSlider, bindSlider, formatNaira } from '../components/slider.js';
import { renderRadioCards, bindRadioCards } from '../components/radioCard.js';
import { computeResults } from '../utils/computeResults.js';

const GEN_SVG_SMALL = `<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="7" y="22" width="50" height="32" rx="5" fill="#1F2937"/>
  <path d="M21 22 L21 15 Q32 11 43 15 L43 22" stroke="#374151" stroke-width="3" stroke-linecap="round" fill="none"/>
  <rect x="11" y="27" width="19" height="20" rx="3" fill="#374151"/>
  <rect x="13" y="30" width="9" height="7" rx="1.5" fill="#4B5563"/>
  <circle cx="16.5" cy="32.5" r="1.2" fill="#9CA3AF"/>
  <circle cx="20" cy="32.5" r="1.2" fill="#9CA3AF"/>
  <circle cx="18.2" cy="35.5" r="1.2" fill="#9CA3AF"/>
  <circle cx="24" cy="43" r="3" fill="#FCBF1E"/>
  <rect x="34" y="27" width="19" height="20" rx="3" fill="#374151"/>
  <rect x="36" y="30" width="15" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="36" y="34" width="15" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="36" y="38" width="15" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="36" y="42" width="15" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="9" y="51" width="46" height="3.5" rx="1.5" fill="#374151"/>
</svg>`;

const GEN_SVG_MEDIUM = `<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="14" width="54" height="42" rx="4" stroke="#DC2626" stroke-width="3" fill="none"/>
  <line x1="5" y1="23" x2="59" y2="23" stroke="#DC2626" stroke-width="2.5"/>
  <rect x="11" y="27" width="22" height="22" rx="3" fill="#6B7280"/>
  <rect x="13" y="22" width="9" height="7" rx="2" fill="#4B5563"/>
  <circle cx="20" cy="32" r="5" fill="#4B5563"/>
  <circle cx="20" cy="32" r="2.5" fill="#6B7280"/>
  <rect x="27" y="30" width="2.5" height="16" rx="1" fill="#9CA3AF"/>
  <rect x="31" y="30" width="2.5" height="16" rx="1" fill="#9CA3AF"/>
  <rect x="37" y="15" width="16" height="9" rx="3" fill="#374151"/>
  <circle cx="45" cy="14" r="3.5" fill="#4B5563"/>
  <rect x="37" y="28" width="16" height="20" rx="2" fill="#374151"/>
  <rect x="39" y="31" width="8" height="5" rx="1" fill="#4B5563"/>
  <circle cx="39.5" cy="33.5" r="1" fill="#9CA3AF"/>
  <circle cx="42.5" cy="33.5" r="1" fill="#9CA3AF"/>
  <circle cx="41" cy="44" r="3.5" fill="#FCBF1E"/>
  <circle cx="13" cy="56" r="5" fill="#374151"/>
  <circle cx="13" cy="56" r="2.5" fill="#6B7280"/>
  <circle cx="51" cy="56" r="5" fill="#374151"/>
  <circle cx="51" cy="56" r="2.5" fill="#6B7280"/>
</svg>`;

const GEN_SVG_LARGE = `<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="20" width="58" height="36" rx="4" fill="#1F2937"/>
  <rect x="3" y="16" width="58" height="6" rx="3" fill="#374151"/>
  <rect x="3" y="20" width="58" height="4" fill="#FCBF1E"/>
  <rect x="40" y="6" width="6" height="12" rx="3" fill="#4B5563"/>
  <rect x="38" y="4" width="10" height="5" rx="2" fill="#374151"/>
  <rect x="7" y="28" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="7" y="32" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="7" y="36" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="7" y="40" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="7" y="44" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="27" y="27" width="10" height="25" rx="2" fill="#374151"/>
  <rect x="29" y="30" width="6" height="5" rx="1" fill="#111827"/>
  <rect x="30" y="31" width="4" height="1.2" rx="0.6" fill="#FCBF1E"/>
  <rect x="30" y="33" width="3" height="1.2" rx="0.6" fill="#10B981"/>
  <rect x="29" y="37" width="6" height="3" rx="1" fill="#4B5563"/>
  <circle cx="32" cy="46" r="3.5" fill="#FCBF1E"/>
  <rect x="41" y="28" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="41" y="32" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="41" y="36" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="41" y="40" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="41" y="44" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="1" y="54" width="62" height="7" rx="2" fill="#374151"/>
  <rect x="7" y="54" width="5" height="7" fill="#4B5563"/>
  <rect x="52" y="54" width="5" height="7" fill="#4B5563"/>
</svg>`;

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
        <button class="btn btn--outline btn--lg" id="skip-btn">Skip</button>
        <button class="btn btn--primary btn--lg" id="continue-btn" ${!state.generatorSize ? 'disabled' : ''}>Generate Results</button>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => {
    navigate(getState().powerSource === 'generator_only' ? 'step2' : 'step3');
  });
  document.getElementById('skip-btn').addEventListener('click', () => { computeResults(); navigate('costSavings'); });
  document.getElementById('continue-btn').addEventListener('click', () => { computeResults(); navigate('costSavings'); });

  bindSlider('fuel-spend-slider', formatNaira, val => setState({ fuelSpend: val }));
  bindRadioCards('gen-size', val => {
    setState({ generatorSize: val });
    document.getElementById('continue-btn').disabled = false;
  });
}
