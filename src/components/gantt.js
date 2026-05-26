import { getState, setState, getData } from '../state.js';

const PATTERNS = ['Work From Home', 'Office Worker', 'Night Shift', 'Stay-at-Home', 'Student', 'Weekend'];

const CATEGORY_COLORS = {
  'Cooling':       '#3B82F6',
  'Lighting':      '#FCBF1E',
  'Kitchen':       '#F59E0B',
  'Entertainment': '#8B5CF6',
  'ICT / Office':  '#06B6D4',
  'Laundry':       '#10B981',
  'Water':         '#0EA5E9',
  'Security':      '#EF4444',
};

// Maps appliance category + name → usage_patterns.json schedule key.
// Keys use U+2013 en dash to match usage_patterns.json exactly.
function matchKey(name, category) {
  switch (category) {
    case 'Cooling':
      if (/fan/i.test(name)) return 'Ceiling Fan';
      if (/\b1hp\b/i.test(name)) return 'AC – Bedroom';  // exact 1HP, not 1.5HP
      return 'AC – Living Room';
    case 'Lighting':
      return 'Lighting';
    case 'Entertainment':
      return 'Television';
    case 'ICT / Office':
      return 'Laptop / PC';
    case 'Laundry':
      return /washing/i.test(name) ? 'Washing Machine' : null;
    case 'Kitchen':
      if (/refrig|freezer/i.test(name)) return 'Refrigerator';
      if (/kettle/i.test(name)) return 'Electric Kettle';
      return null;
    case 'Water':
      return /pump/i.test(name) ? 'Water Pump' : null;
    default:
      return null;
  }
}

function arrayToSegments(arr) {
  const segs = [];
  let inRun = false, runStart = 0;
  for (let i = 0; i < 24; i++) {
    if (arr[i] >= 0.5 && !inRun) { inRun = true; runStart = i; }
    else if (arr[i] < 0.5 && inRun) { segs.push({ start: runStart, end: i }); inRun = false; }
  }
  if (inRun) segs.push({ start: runStart, end: 24 });
  return segs.length ? segs : [{ start: 8, end: 10 }];
}

function segsFromPattern(name, category, patternData) {
  if (!patternData) return [{ start: 8, end: 10 }];
  const key = matchKey(name, category);
  const arr = key && patternData.schedule[key];
  return arr ? arrayToSegments(arr) : [{ start: 8, end: 10 }];
}

function snapHour(h) { return Math.round(h * 2) / 2; }

function fmtHour(h) {
  const hh = Math.floor(h) % 24;
  return hh === 0 ? '12am' : hh < 12 ? `${hh}am` : hh === 12 ? '12pm' : `${hh - 12}pm`;
}

// Shared drag state — only one drag active at a time
const _drag = { active: false, type: null, rowIdx: null, segIdx: null,
                startX: null, origStart: null, origEnd: null, trackWidth: null };

export function initGantt(containerId, appliances) {
  const container = document.getElementById(containerId);
  if (!container) return () => {};

  const usagePatterns = getData('usage_patterns') || [];
  let selectedPattern = getState().usagePattern || PATTERNS[0];

  // Restore from state or build from default pattern
  const existing = getState().customSchedule || [];
  const existingMap = Object.fromEntries(existing.map(r => [r.name, r]));
  const patternData = usagePatterns.find(p => p.pattern === selectedPattern);

  let rows = appliances.map(a => {
    if (existingMap[a.name]) {
      return { ...existingMap[a.name], segments: existingMap[a.name].segments.map(s => ({ ...s })) };
    }
    return { name: a.name, category: a.category || '', segments: segsFromPattern(a.name, a.category || '', patternData) };
  });

  function saveState() {
    setState({ customSchedule: rows.map(r => ({ ...r, segments: r.segments.map(s => ({ ...s })) })) });
  }

  function renderRows() {
    const body = container.querySelector('.gantt-body');
    if (!body) return;
    body.innerHTML = rows.map((row, ri) => {
      const color = CATEGORY_COLORS[row.category] || '#9CA3AF';
      const bars = row.segments.map((seg, si) => {
        const l = ((seg.start / 24) * 100).toFixed(3);
        const w = Math.max(0.5, (seg.end - seg.start) / 24 * 100).toFixed(3);
        return `
          <div class="gantt-bar" data-ri="${ri}" data-si="${si}"
               style="left:${l}%;width:${w}%;background:${color}">
            <div class="gantt-bar__handle gantt-bar__handle--left" data-type="resize-left"></div>
            <div class="gantt-bar__label">${fmtHour(seg.start)}–${fmtHour(seg.end)}</div>
            <div class="gantt-bar__del" title="Remove">×</div>
            <div class="gantt-bar__handle gantt-bar__handle--right" data-type="resize-right"></div>
          </div>`;
      }).join('');
      return `
        <div class="gantt-row">
          <div class="gantt-row__label" title="${row.name}">${row.name}</div>
          <div class="gantt-row__track" data-ri="${ri}" style="background:${color}22">${bars}</div>
        </div>`;
    }).join('');
    bindRowEvents();
  }

  function bindRowEvents() {
    container.querySelectorAll('.gantt-bar__del').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const bar = btn.closest('.gantt-bar');
        rows[+bar.dataset.ri].segments.splice(+bar.dataset.si, 1);
        saveState(); renderRows();
      });
    });

    container.querySelectorAll('.gantt-bar').forEach(bar => {
      bar.addEventListener('contextmenu', e => {
        e.preventDefault();
        rows[+bar.dataset.ri].segments.splice(+bar.dataset.si, 1);
        saveState(); renderRows();
      });
      bar.addEventListener('mousedown', e => {
        if (e.target.classList.contains('gantt-bar__handle') ||
            e.target.classList.contains('gantt-bar__del')) return;
        e.preventDefault();
        const ri = +bar.dataset.ri, si = +bar.dataset.si;
        _drag.active = true; _drag.type = 'move';
        _drag.rowIdx = ri; _drag.segIdx = si;
        _drag.startX = e.clientX;
        _drag.origStart = rows[ri].segments[si].start;
        _drag.origEnd   = rows[ri].segments[si].end;
        _drag.trackWidth = bar.closest('.gantt-row__track').getBoundingClientRect().width;
      });
    });

    container.querySelectorAll('.gantt-bar__handle').forEach(handle => {
      handle.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        const bar = handle.closest('.gantt-bar');
        const ri = +bar.dataset.ri, si = +bar.dataset.si;
        _drag.active = true; _drag.type = handle.dataset.type;
        _drag.rowIdx = ri; _drag.segIdx = si;
        _drag.startX = e.clientX;
        _drag.origStart = rows[ri].segments[si].start;
        _drag.origEnd   = rows[ri].segments[si].end;
        _drag.trackWidth = bar.closest('.gantt-row__track').getBoundingClientRect().width;
      });
    });

    container.querySelectorAll('.gantt-row__track').forEach(track => {
      track.addEventListener('click', e => {
        if (e.target !== track) return;
        const ri = +track.dataset.ri;
        const rect = track.getBoundingClientRect();
        const hour = snapHour(((e.clientX - rect.left) / rect.width) * 24);
        const start = Math.max(0, Math.min(22, hour));
        rows[ri].segments.push({ start, end: Math.min(24, start + 2) });
        saveState(); renderRows();
      });
    });
  }

  function onMouseMove(e) {
    if (!_drag.active) return;
    const delta = ((e.clientX - _drag.startX) / _drag.trackWidth) * 24;
    const { type, rowIdx: ri, segIdx: si } = _drag;
    const seg = rows[ri].segments[si];
    const dur = _drag.origEnd - _drag.origStart;

    if (type === 'move') {
      const ns = Math.max(0, Math.min(24 - dur, snapHour(_drag.origStart + delta)));
      seg.start = ns; seg.end = ns + dur;
    } else if (type === 'resize-left') {
      seg.start = Math.max(0, Math.min(_drag.origEnd - 0.5, snapHour(_drag.origStart + delta)));
    } else {
      seg.end = Math.min(24, Math.max(_drag.origStart + 0.5, snapHour(_drag.origEnd + delta)));
    }

    const bar = container.querySelector(`.gantt-bar[data-ri="${ri}"][data-si="${si}"]`);
    if (bar) {
      bar.style.left  = `${((seg.start / 24) * 100).toFixed(3)}%`;
      bar.style.width = `${Math.max(0.5, (seg.end - seg.start) / 24 * 100).toFixed(3)}%`;
      const lbl = bar.querySelector('.gantt-bar__label');
      if (lbl) lbl.textContent = `${fmtHour(seg.start)}–${fmtHour(seg.end)}`;
    }
  }

  function onMouseUp() {
    if (_drag.active) { _drag.active = false; saveState(); }
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // Render static shell
  container.innerHTML = `
    <div class="gantt-wrap">
      <div class="gantt-header">
        <div class="section-title" style="margin:0">Customise Your Usage Schedule</div>
        <div class="gantt-pattern-row">
          <label class="gantt-pattern-label">Usage pattern</label>
          <select class="gantt-select" id="gantt-pattern-sel">
            ${PATTERNS.map(p => `<option value="${p}" ${selectedPattern === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="gantt-timeline-header">
        <div class="gantt-label-col"></div>
        <div class="gantt-hours-track">
          ${[0,3,6,9,12,15,18,21,24].map(h =>
            `<span class="gantt-hour-label" style="left:${(h/24*100).toFixed(2)}%">${fmtHour(h)}</span>`
          ).join('')}
        </div>
      </div>
      <div class="gantt-body"></div>
      <p class="gantt-hint">Drag bars to move · Drag edges to resize · Click empty track to add · Right-click or × to delete</p>
    </div>`;

  document.getElementById('gantt-pattern-sel').addEventListener('change', e => {
    selectedPattern = e.target.value;
    setState({ usagePattern: selectedPattern });
    const pd = usagePatterns.find(p => p.pattern === selectedPattern);
    rows = rows.map(row => ({ ...row, segments: segsFromPattern(row.name, row.category, pd) }));
    saveState(); renderRows();
  });

  renderRows();
  saveState();

  return function cleanup() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
}
