const STEP_LABELS = [
  'Analysing your energy profile',
  'Sizing your solar PV system',
  'Calculating your savings with solar',
  'Finalising your results'
];

// Step timeline: [activeAt ms, doneAt ms]
const TIMELINE = [
  { activeAt: 0,     doneAt: 3000  },
  { activeAt: 3000,  doneAt: 8000  },
  { activeAt: 8000,  doneAt: 15000 },
  { activeAt: 15000, doneAt: 18000 },
];
const TOTAL_DURATION = 18000;

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

/* ── Sun ── */
.pl-sun { position: relative; width: 108px; height: 108px; }
.pl-sun-rays { position: absolute; inset: 0; animation: pl-spin-slow 18s linear infinite; }
.pl-sun-rays i {
  position: absolute; top: 50%; left: 50%;
  width: 4px; height: 13px; border-radius: 2px; background: #FCBF1E;
  transform: translate(-50%, -50%) rotate(var(--a)) translateY(-42px);
  animation: pl-ray-twinkle 1.8s ease-in-out infinite;
}
.pl-sun-core {
  position: absolute; top: 50%; left: 50%;
  width: 50px; height: 50px; margin: -25px 0 0 -25px;
  border-radius: 50%; background: #FCBF1E;
  animation: pl-core-pulse 2.6s ease-in-out infinite;
}
@keyframes pl-spin-slow    { to { transform: rotate(360deg); } }
@keyframes pl-ray-twinkle  { 0%, 100% { opacity: .32; } 50% { opacity: 1; } }
@keyframes pl-core-pulse   { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.84); opacity: .7; } }

/* ── Steps ── */
.pl-steps { display: flex; flex-direction: column; gap: 0; align-self: center; }
.pl-step {
  display: flex; align-items: flex-start; gap: 14px;
  opacity: 0; transform: translateY(6px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.pl-step.active, .pl-step.done { opacity: 1; transform: translateY(0); }
.pl-indicator {
  display: flex; flex-direction: column; align-items: center;
  width: 18px; flex-shrink: 0;
}
.pl-dot-wrap { width: 18px; height: 18px; position: relative; flex-shrink: 0; }

/* ── Dot states ── */
.pl-dot {
  width: 18px; height: 18px; border-radius: 50%;
  background: #fff; border: 2px solid #DCE5DF;
  box-sizing: border-box; flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}
/* Active: spinner ring */
.pl-step.active .pl-dot {
  border-color: #F6E2A6;
  border-top-color: #FCBF1E;
  animation: pl-spin-dot 0.8s linear infinite;
}
/* Done: filled yellow, tick visible */
.pl-step.done .pl-dot  { display: none; }
.pl-step.done .pl-tick { display: block; }
@keyframes pl-spin-dot { to { transform: rotate(360deg); } }

.pl-tick {
  position: absolute; inset: 0;
  width: 18px; height: 18px; display: none;
}

/* ── Connector line ── */
.pl-line-track { width: 2px; overflow: hidden; margin-top: 5px; margin-bottom: 5px; }
.pl-line { width: 2px; height: 0; background: #E5E7EB; transition: height 0.45s ease, background 0.3s ease; }
.pl-step.done .pl-line { height: 36px; background: #FCBF1E; }

/* ── Label ── */
.pl-text {
  font-size: 14px; font-weight: 500; color: #9CA3AF;
  line-height: 1.4; padding-bottom: 36px; transition: color 0.3s;
}
.pl-step:last-child .pl-text { padding-bottom: 0; }
.pl-step.active .pl-text { font-weight: 600; color: #111827; }
.pl-step.done   .pl-text { color: #6B7280; }

@media (max-width: 480px) {
  .pl-container { gap: 32px; padding: 0 24px; width: 100%; box-sizing: border-box; }
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
      <div class="pl-sun" aria-hidden="true">
        <div class="pl-sun-rays">
          <i style="--a:0deg;animation-delay:0s"></i>
          <i style="--a:45deg;animation-delay:.2s"></i>
          <i style="--a:90deg;animation-delay:.4s"></i>
          <i style="--a:135deg;animation-delay:.6s"></i>
          <i style="--a:180deg;animation-delay:.8s"></i>
          <i style="--a:225deg;animation-delay:1s"></i>
          <i style="--a:270deg;animation-delay:1.2s"></i>
          <i style="--a:315deg;animation-delay:1.4s"></i>
        </div>
        <div class="pl-sun-core"></div>
      </div>
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

  TIMELINE.forEach(({ activeAt, doneAt }, i) => {
    setTimeout(() => {
      document.getElementById(`pl-step-${i}`)?.classList.add('active');
    }, activeAt);
    setTimeout(() => {
      const el = document.getElementById(`pl-step-${i}`);
      if (el) { el.classList.remove('active'); el.classList.add('done'); }
    }, doneAt);
  });

  setTimeout(() => {
    const el = document.getElementById('preloader-overlay');
    if (el) {
      onComplete();
      el.style.opacity = '0';
      setTimeout(() => { el.remove(); }, 400);
    }
  }, TOTAL_DURATION);
}
