const STEP_LABELS = [
  'Analysing your energy profile',
  'Sizing your solar PV system',
  'Calculating your savings with solar',
  'Finalising your results'
];

const STEP_ACTIVE_AT  = [0, 1750, 3500, 5500]; // ms: when each step becomes active
const STEP_DONE_DELAY = 1100;                   // ms after active → done
const TOTAL_DURATION  = 8000;                   // ms before onComplete fires

const SPIKE_DELAYS = [0, 0.175, 0.35, 0.525, 0.7, 0.875, 1.05, 1.225];
const SPIKES = [
  [[44,22],[44,10]], [[63.6,24.4],[71.9,16.1]], [[66,44],[78,44]],
  [[63.6,63.6],[71.9,71.9]], [[44,66],[44,78]], [[24.4,63.6],[16.1,71.9]],
  [[22,44],[10,44]], [[24.4,24.4],[16.1,16.1]]
];

const SUN_SVG = `
<svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="44" cy="44" r="16" fill="#FCBF1E"/>
  ${SPIKES.map(([[x1,y1],[x2,y2]], i) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FCBF1E" stroke-width="3.5" stroke-linecap="round" style="animation:pl-spike-twinkle 1.4s ease-in-out ${SPIKE_DELAYS[i]}s infinite"/>`
  ).join('')}
</svg>`;

const CSS = `
#preloader-overlay {
  position: fixed;
  inset: 0;
  background: #ffffff;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  opacity: 1;
  transition: opacity 0.4s ease;
}
.pl-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 44px;
}
@keyframes pl-spike-twinkle {
  0%, 100% { opacity: 0.15; }
  50%       { opacity: 1;    }
}
.pl-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.pl-step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.pl-step.active,
.pl-step.done {
  opacity: 1;
  transform: translateY(0);
}
.pl-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3px;
  width: 18px;
  flex-shrink: 0;
}
.pl-dot-wrap {
  width: 14px;
  height: 14px;
  position: relative;
  flex-shrink: 0;
}
.pl-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #D1D5DB;
  transition: background 0.3s;
}
.pl-tick {
  position: absolute;
  inset: -2px;
  width: 18px;
  height: 18px;
  display: none;
}
.pl-step.active .pl-dot {
  background: #FCBF1E;
  animation: pl-pulse 0.9s ease-in-out infinite alternate;
}
.pl-step.done .pl-dot  { display: none; }
.pl-step.done .pl-tick { display: block; }
.pl-line-track {
  width: 2px;
  overflow: hidden;
  margin-top: 5px;
}
.pl-line {
  width: 2px;
  height: 0;
  background: #E5E7EB;
  transition: height 0.35s ease, background 0.3s ease;
}
.pl-step.done .pl-line {
  height: 36px;
  background: #FCBF1E;
}
.pl-text {
  font-size: 14px;
  font-weight: 500;
  color: #9CA3AF;
  line-height: 1.4;
  padding-bottom: 36px;
  transition: color 0.3s;
}
.pl-step:last-child .pl-text { padding-bottom: 0; }
.pl-step.active .pl-text { color: #111827; }
.pl-step.done   .pl-text { color: #6B7280; }
@keyframes pl-pulse {
  from { transform: scale(0.88); box-shadow: 0 0 0 0 rgba(252,191,30,0.5); }
  to   { transform: scale(1.12); box-shadow: 0 0 0 7px rgba(252,191,30,0); }
}
@media (max-width: 480px) {
  .pl-container { gap: 32px; padding: 0 24px; width: 100%; box-sizing: border-box; }
  .pl-steps { width: 100%; }
  .pl-text { font-size: 13px; padding-bottom: 30px; }
  .pl-step.done .pl-line { height: 30px; }
  .pl-text:last-child { padding-bottom: 0; }
}
`;

function injectCSS() {
  if (document.getElementById('pl-styles')) return;
  const s = document.createElement('style');
  s.id = 'pl-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}

export function showPreloader(onComplete) {
  injectCSS();

  const overlay = document.createElement('div');
  overlay.id = 'preloader-overlay';
  overlay.innerHTML = `
    <div class="pl-container">
      <div>${SUN_SVG}</div>
      <div class="pl-steps">
        ${STEP_LABELS.map((label, i) => `
          <div class="pl-step" id="pl-step-${i}">
            <div class="pl-indicator">
              <div class="pl-dot-wrap">
                <div class="pl-dot"></div>
                <svg class="pl-tick" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#FCBF1E"/>
                  <path d="M5 9l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              ${i < STEP_LABELS.length - 1 ? `<div class="pl-line-track"><div class="pl-line"></div></div>` : ''}
            </div>
            <div class="pl-text">${label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  STEP_LABELS.forEach((_, i) => {
    setTimeout(() => {
      document.getElementById(`pl-step-${i}`)?.classList.add('active');
    }, STEP_ACTIVE_AT[i]);

    setTimeout(() => {
      const el = document.getElementById(`pl-step-${i}`);
      if (el) { el.classList.remove('active'); el.classList.add('done'); }
    }, STEP_ACTIVE_AT[i] + STEP_DONE_DELAY);
  });

  setTimeout(() => {
    const el = document.getElementById('preloader-overlay');
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => { el.remove(); onComplete(); }, 400);
    }
  }, TOTAL_DURATION);
}
