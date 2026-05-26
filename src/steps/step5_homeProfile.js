import { getState, setState, getData } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';
import { openModal, closeModal, modalHtml, bindModalClose } from '../components/modal.js';
import { initGantt } from '../components/gantt.js';
import { computeResults } from '../utils/computeResults.js';

const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const HOUSE_TYPES = [
  { id: 'bungalow', emoji: '🏠', name: 'Bungalow' },
  { id: 'duplex', emoji: '🏡', name: 'Duplex' },
  { id: 'terrace', emoji: '🏘️', name: 'Terrace House' }
];

function renderHouseCards(selectedType, rooms) {
  return `
    <div class="radio-cards" id="house-type-cards">
      ${HOUSE_TYPES.map(h => `
        <div class="radio-card ${selectedType === h.id ? 'selected' : ''}" data-value="${h.id}" style="align-items:center">
          <div class="radio-card__radio"></div>
          <div class="radio-card__img-placeholder">${h.emoji}</div>
          <div class="radio-card__name">${h.name}</div>
          ${selectedType === h.id ? `
            <div class="rooms-counter">
              <span class="rooms-counter__label">Rooms</span>
              <button class="rooms-counter__btn" id="rooms-dec">–</button>
              <span class="rooms-counter__val" id="rooms-val">${rooms}</span>
              <button class="rooms-counter__btn" id="rooms-inc">+</button>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderApplianceModal(applianceData, selectedAppliances) {
  const selectedMap = {};
  selectedAppliances.forEach(a => { selectedMap[a.name] = a; });

  console.log('[Sunova] Appliance data:', applianceData.length, 'items', applianceData.map(a => a.name));
  const rows = applianceData.map(a => {
    const sel = selectedMap[a.name];
    const qty = sel ? sel.qty : 0;
    const checked = !!sel;
    return `
      <div class="appliance-modal-row">
        <div class="checkbox ${checked ? 'checked' : ''}" data-name="${escAttr(a.name)}"></div>
        <div class="appliance-modal-row__img-placeholder">
          ${getCategoryEmoji(a.category)}
        </div>
        <div style="flex:1">
          <div class="appliance-modal-row__name">${a.name}</div>
          <div class="appliance-modal-row__watts">${a.rated_watts}W · ${a.typical_daily_hours}h/day</div>
        </div>
        <div class="counter" data-name="${escAttr(a.name)}">
          <button class="counter__btn" data-action="dec">−</button>
          <span class="counter__val">${qty}</span>
          <button class="counter__btn" data-action="inc">+</button>
        </div>
      </div>
    `;
  }).join('');

  return modalHtml({
    title: 'Choose specific appliances',
    subtitle: 'You can select multiple appliances',
    body: rows,
    footer: `<button class="btn btn--primary btn--full" id="add-appliances-confirm">Add Appliances</button>`
  });
}

function getCategoryEmoji(cat) {
  const map = { 'Cooling': '❄️', 'Lighting': '💡', 'Kitchen': '🍳', 'Entertainment': '📺', 'ICT / Office': '💻', 'Laundry': '🫧', 'Water': '💧', 'Security': '🔒' };
  return map[cat] || '🔌';
}

export function renderStep5(container, navigate) {
  const state = getState();
  const applianceData = getData('appliances') || [];
  let _ganttCleanup = null;

  function render() {
    if (_ganttCleanup) { _ganttCleanup(); _ganttCleanup = null; }
    const s = getState();
    container.innerHTML = `
      <div class="wizard-step">
        <div class="wizard-header">
          <button class="back-btn" id="back-btn">← Back</button>
          ${renderProgressBar(5)}
          <div style="width:90px"></div>
        </div>

        <div class="step-body">
          <h1 class="step-title">Home profile and appliance catalogue</h1>
          <p class="step-subtitle">Build a home profile to increase confidence</p>

          <div class="section-title" style="margin-bottom:14px">Choose your house type</div>
          ${renderHouseCards(s.houseType, s.rooms)}

          <div class="section-title" style="margin-top:28px;margin-bottom:12px">Select your home appliances</div>
          <div class="appliances-list" id="appliances-list">
            ${s.appliances.map(a => `
              <div class="appliance-chip">
                ${getCategoryEmoji(a.category || '')} ${a.name} ×${a.qty}
                <span class="appliance-chip__remove" data-name="${escAttr(a.name)}">×</span>
              </div>
            `).join('')}
          </div>
          <div class="add-appliances-box" id="add-appliances-btn">
            <span class="add-appliances-box__icon">＋</span>
            <span class="add-appliances-box__label">Add appliances</span>
          </div>
          ${s.houseType && s.appliances.length === 0 ? `
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:8px;text-align:center">
              💡 Typical appliances for a <strong>${HOUSE_TYPES.find(h => h.id === s.houseType)?.name}</strong> will be pre-selected, adjust as needed
            </div>
          ` : ''}

          ${s.appliances.length > 0 ? '<div id="gantt-section" style="margin-top:32px"></div>' : ''}
        </div>

        <div class="step-footer">
          <button class="btn btn--outline btn--lg" id="skip-btn">Skip</button>
          <button class="btn btn--primary btn--lg" id="continue-btn" ${!s.houseType ? 'disabled' : ''}>Continue</button>
        </div>
      </div>
    `;

    bindAll();

    if (s.appliances.length > 0) {
      _ganttCleanup = initGantt('gantt-section', s.appliances);
    }
  }

  function bindAll() {
    document.getElementById('back-btn').addEventListener('click', () => {
      if (_ganttCleanup) { _ganttCleanup(); _ganttCleanup = null; }
      navigate(getState().results ? 'costSavings' : getState().powerSource === 'grid_only' ? 'step3' : 'step4');
    });
    document.getElementById('skip-btn').addEventListener('click', () => {
      if (_ganttCleanup) { _ganttCleanup(); _ganttCleanup = null; }
      navigate('step6');
    });
    document.getElementById('continue-btn').addEventListener('click', () => {
      if (_ganttCleanup) { _ganttCleanup(); _ganttCleanup = null; }
      // When updating existing results, recompute now so confidence score and
      // prompts refresh the moment the user returns to any results page.
      const s = getState();
      if (s.results && s.appliances.length > 0) computeResults();
      navigate('step6');
    });

    document.querySelectorAll('#house-type-cards .radio-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.rooms-counter')) return;
        setState({ houseType: card.dataset.value });
        render();
      });
    });

    document.getElementById('rooms-dec')?.addEventListener('click', () => {
      const s = getState();
      setState({ rooms: Math.max(0, s.rooms - 1) });
      document.getElementById('rooms-val').textContent = getState().rooms;
    });
    document.getElementById('rooms-inc')?.addEventListener('click', () => {
      setState({ rooms: getState().rooms + 1 });
      document.getElementById('rooms-val').textContent = getState().rooms;
    });

    document.querySelectorAll('.appliance-chip__remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const name = btn.dataset.name;
        setState({ appliances: getState().appliances.filter(a => a.name !== name) });
        render();
      });
    });

    document.getElementById('add-appliances-btn').addEventListener('click', () => {
      const s = getState();
      const houseDefaults = getData('house_type_appliances') || {};
      // Pre-select house-type defaults only on first open (no appliances yet)
      const preselect = (s.houseType && s.appliances.length === 0)
        ? (houseDefaults[s.houseType] || [])
        : s.appliances;
      openModal(renderApplianceModal(applianceData, preselect));
      bindModalClose();
      bindApplianceModal(applianceData, preselect);
    });
  }

  function bindApplianceModal(appData, initialSelections) {
    const selections = {};
    // Seed selections from provided list (house-type defaults or existing appliances),
    // always merged with the full appliance definition so category/wattage are stored.
    const seed = initialSelections || getState().appliances;
    seed.forEach(a => {
      const def = appData.find(d => d.name === a.name);
      selections[a.name] = def ? { ...def, qty: a.qty || 1 } : { ...a };
    });

    document.querySelectorAll('.appliance-modal-row').forEach(row => {
      const checkbox = row.querySelector('.checkbox');
      const counter = row.querySelector('.counter');
      const name = checkbox.dataset.name;
      const appDef = appData.find(a => a.name === name);

      if (!selections[name] && checkbox.classList.contains('checked')) {
        selections[name] = { ...appDef, qty: 1 };
      }

      checkbox.addEventListener('click', () => {
        checkbox.classList.toggle('checked');
        if (checkbox.classList.contains('checked')) {
          selections[name] = { ...appDef, qty: parseInt(counter.querySelector('.counter__val').textContent) || 1 };
          counter.querySelector('.counter__val').textContent = selections[name].qty;
        } else {
          delete selections[name];
        }
      });

      counter.querySelectorAll('.counter__btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const valEl = counter.querySelector('.counter__val');
          let val = parseInt(valEl.textContent) || 0;
          if (btn.dataset.action === 'inc') { val++; checkbox.classList.add('checked'); }
          else { val = Math.max(0, val - 1); if (val === 0) checkbox.classList.remove('checked'); }
          valEl.textContent = val;
          if (val > 0) selections[name] = { ...appDef, qty: val };
          else delete selections[name];
        });
      });
    });

    document.getElementById('add-appliances-confirm').addEventListener('click', () => {
      setState({ appliances: Object.values(selections).filter(a => a.qty > 0) });
      closeModal();
      render();
    });
  }

  render();
}
