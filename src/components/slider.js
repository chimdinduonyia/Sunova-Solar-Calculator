export function formatNaira(val) {
  return '₦' + Number(val).toLocaleString('en-NG');
}

function parseNaira(str) {
  return parseInt(String(str).replace(/[₦,\s]/g, ''), 10) || 0;
}

function thumbOffset(pct) {
  return (14 - (pct / 100) * 28).toFixed(1);
}

export function renderSlider({ id, value, min, max, step = 1000, ticks, label = 'per month', formatFn = formatNaira }) {
  const pct = ((value - min) / (max - min)) * 100;
  const offset = thumbOffset(pct);

  const ticksHtml = ticks ? ticks.map((t, i) => {
    const tickPct = ((t - min) / (max - min)) * 100;
    const isActive = value >= (i === 0 ? min : ticks[i - 1]) && value <= t;
    const xform = i === 0 ? 'translateX(0)' : i === ticks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)';
    return `<span class="slider-tick ${isActive ? 'active' : ''}" data-val="${t}" style="left:${tickPct}%;transform:${xform}">${formatFn(t)}</span>`;
  }).join('') : '';

  return `
    <div class="slider-wrapper">
      <div style="text-align:center;margin-bottom:16px">
        <div class="slider-bubble">
          <input
            type="text"
            class="slider-bubble__val"
            id="${id}-val"
            value="${formatFn(value)}"
            inputmode="numeric"
            autocomplete="off"
            aria-label="Monthly spend in Naira"
          />
          <span class="slider-bubble__label">${label}</span>
        </div>
      </div>
      <div class="slider-track-wrap">
        <div class="slider-tooltip" id="${id}-tooltip" style="left:calc(${pct}% + ${offset}px)">
          <span class="slider-tooltip__val">${formatFn(value)}</span>
          <div class="slider-tooltip__arrow"></div>
        </div>
        <input
          type="range"
          class="sunova-slider"
          id="${id}"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${value}"
          style="background: linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-border) ${pct}%)"
        />
        ${ticks ? `<div class="slider-ticks">${ticksHtml}</div>` : ''}
      </div>
    </div>
  `;
}

export function bindSlider(id, formatFn = formatNaira, onChange) {
  const input = document.getElementById(id);
  const valEl = document.getElementById(`${id}-val`);
  const tooltip = document.getElementById(`${id}-tooltip`);
  if (!input || !valEl) return;

  const min  = Number(input.min);
  const max  = Number(input.max);
  const step = Number(input.step) || 1;

  function update() {
    const val = Number(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    const offset = thumbOffset(pct);

    input.style.background = `linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-border) ${pct}%)`;
    valEl.value = formatFn(val);

    if (tooltip) {
      tooltip.style.left = `calc(${pct}% + ${offset}px)`;
      const tooltipVal = tooltip.querySelector('.slider-tooltip__val');
      if (tooltipVal) tooltipVal.textContent = formatFn(val);
    }

    if (onChange) onChange(val);

    const ticks = input.closest('.slider-track-wrap').querySelectorAll('.slider-tick');
    if (ticks.length > 0) {
      const tickVals = Array.from(ticks).map(t => Number(t.dataset.val));
      ticks.forEach((tick, i) => {
        const prevVal = i === 0 ? min : tickVals[i - 1];
        tick.classList.toggle('active', val >= prevVal && val <= tickVals[i]);
      });
    }
  }

  // Prevent accidental value jumps when tapping anywhere on the track.
  // Only allow pointer interactions that start within 10% of track width from the thumb.
  input.addEventListener('pointerdown', e => {
    const rect = input.getBoundingClientRect();
    if (rect.width === 0) return;
    const clickPct  = (e.clientX - rect.left) / rect.width;
    const thumbPct  = (Number(input.value) - min) / (max - min);
    if (Math.abs(clickPct - thumbPct) > 0.10) e.preventDefault();
  }, { capture: true });

  input.addEventListener('input', update);
  input.addEventListener('change', update);

  // Allow the displayed value to be edited directly
  valEl.addEventListener('focus', () => {
    // Show the raw number so the user can type over it easily
    valEl.value = parseNaira(valEl.value) || '';
    valEl.select();
  });

  valEl.addEventListener('blur', () => {
    const raw = parseNaira(valEl.value);
    const clamped = Math.max(min, Math.min(max, raw || min));
    const snapped = Math.round((clamped - min) / step) * step + min;
    input.value = snapped;
    update();
  });

  valEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') valEl.blur();
  });

  if (tooltip) {
    const show = () => tooltip.classList.add('visible');
    const hide = () => tooltip.classList.remove('visible');
    input.addEventListener('mousedown', show);
    input.addEventListener('touchstart', show, { passive: true });
    document.addEventListener('mouseup', hide);
    document.addEventListener('touchend', hide);
  }
}
