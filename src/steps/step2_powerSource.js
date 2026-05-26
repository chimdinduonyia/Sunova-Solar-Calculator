import { getState, setState } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';
import { renderRadioCards, bindRadioCards } from '../components/radioCard.js';

const POLE_SVG = `<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="12" width="5" height="48" rx="2" fill="#92400E"/>
  <rect x="8" y="19" width="48" height="3" rx="1.5" fill="#78350F"/>
  <rect x="8" y="17" width="5" height="4" rx="1" fill="#6B7280"/>
  <rect x="29.5" y="17" width="5" height="4" rx="1" fill="#6B7280"/>
  <rect x="51" y="17" width="5" height="4" rx="1" fill="#6B7280"/>
  <path d="M10.5 21 Q22 30 32.5 21" stroke="#4B5563" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M32.5 21 Q43 30 53.5 21" stroke="#4B5563" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <rect x="25.5" y="30" width="14" height="18" rx="3" fill="#374151"/>
  <ellipse cx="32.5" cy="30" rx="7" ry="2.5" fill="#4B5563"/>
  <ellipse cx="32.5" cy="48" rx="7" ry="2.5" fill="#4B5563"/>
  <line x1="32.5" y1="50" x2="32.5" y2="55" stroke="#6B7280" stroke-width="1.5"/>
  <line x1="18" y1="58" x2="47" y2="58" stroke="#D4D4D4" stroke-width="2" stroke-linecap="round"/>
  <line x1="22" y1="61" x2="43" y2="61" stroke="#D4D4D4" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const GEN_SVG = `<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="22" width="52" height="30" rx="4" fill="#1F2937"/>
  <rect x="6" y="22" width="52" height="6" rx="2" fill="#374151"/>
  <rect x="38" y="14" width="6" height="10" rx="3" fill="#4B5563"/>
  <rect x="36" y="12" width="10" height="5" rx="2" fill="#374151"/>
  <rect x="9" y="32" width="20" height="16" rx="2" fill="#374151"/>
  <rect x="11" y="34" width="9" height="6" rx="1.5" fill="#4B5563"/>
  <circle cx="14" cy="37" r="1.3" fill="#9CA3AF"/>
  <circle cx="18" cy="37" r="1.3" fill="#9CA3AF"/>
  <circle cx="24" cy="44" r="3" fill="#FCBF1E"/>
  <rect x="32" y="32" width="22" height="16" rx="2" fill="#374151"/>
  <rect x="34" y="34" width="17" height="2" rx="1" fill="#4B5563"/>
  <rect x="34" y="38" width="17" height="2" rx="1" fill="#4B5563"/>
  <rect x="34" y="42" width="17" height="2" rx="1" fill="#4B5563"/>
  <rect x="4" y="50" width="56" height="5" rx="2" fill="#374151"/>
  <rect x="9" y="50" width="5" height="7" rx="1" fill="#4B5563"/>
  <rect x="50" y="50" width="5" height="7" rx="1" fill="#4B5563"/>
</svg>`;

const BOTH_SVG = `<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="13" y="7" width="3.5" height="31" rx="1.5" fill="#92400E"/>
  <rect x="3" y="12" width="28" height="2.2" rx="1" fill="#78350F"/>
  <rect x="3" y="10.5" width="3.5" height="3" rx="0.8" fill="#6B7280"/>
  <rect x="13" y="10.5" width="3.5" height="3" rx="0.8" fill="#6B7280"/>
  <rect x="27" y="10.5" width="3.5" height="3" rx="0.8" fill="#6B7280"/>
  <path d="M4.75 13.5 Q11 18.5 14.75 13.5 Q18.5 18.5 29 13.5" stroke="#4B5563" stroke-width="1" fill="none" stroke-linecap="round"/>
  <rect x="10.5" y="20" width="8" height="11" rx="1.5" fill="#374151"/>
  <ellipse cx="14.5" cy="20" rx="4" ry="1.5" fill="#4B5563"/>
  <ellipse cx="14.5" cy="31" rx="4" ry="1.5" fill="#4B5563"/>
  <line x1="6" y1="38.5" x2="27" y2="38.5" stroke="#D4D4D4" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="36" y="18" width="25" height="19" rx="2.5" fill="#1F2937"/>
  <rect x="36" y="18" width="25" height="4" rx="2" fill="#374151"/>
  <rect x="47" y="11" width="3.5" height="9" rx="1.5" fill="#4B5563"/>
  <rect x="46" y="9.5" width="5.5" height="3.5" rx="1" fill="#374151"/>
  <rect x="38" y="24" width="11" height="10" rx="1.5" fill="#374151"/>
  <circle cx="43" cy="29" r="1.5" fill="#FCBF1E"/>
  <rect x="51" y="24" width="8" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="51" y="27.5" width="8" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="51" y="31" width="8" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="35" y="36" width="27" height="3.5" rx="1.5" fill="#374151"/>
  <rect x="38" y="37" width="3" height="5" rx="1" fill="#4B5563"/>
  <rect x="59" y="37" width="3" height="5" rx="1" fill="#4B5563"/>
</svg>`;

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

  // Every selection immediately advances — no Continue button needed
  bindRadioCards('power-source', val => {
    setState({ powerSource: val });
    navigate(val === 'generator_only' ? 'step4' : 'step3');
  });
}
