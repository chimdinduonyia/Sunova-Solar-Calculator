export function formatNaira(val) {
  return '₦' + Number(val).toLocaleString('en-NG');
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
          <span class="slider-bubble__val" id="${id}-val">${formatFn(value)}</span>
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

  function update() {
    const val = Number(input.value);
    const min = Number(input.min);
    const max = Number(input.max);
    const pct = ((val - min) / (max - min)) * 100;
    const offset = thumbOffset(pct);

    input.style.background = `linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-border) ${pct}%)`;
    valEl.textContent = formatFn(val);

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

  input.addEventListener('input', update);
  input.addEventListener('change', update);

  if (tooltip) {
    const show = () => tooltip.classList.add('visible');
    const hide = () => tooltip.classList.remove('visible');
    input.addEventListener('mousedown', show);
    input.addEventListener('touchstart', show, { passive: true });
    document.addEventListener('mouseup', hide);
    document.addEventListener('touchend', hide);
  }
}
