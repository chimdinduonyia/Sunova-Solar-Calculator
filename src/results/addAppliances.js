import { getState, setState, getData } from '../state.js';
import { openModal, closeModal, modalHtml, bindModalClose } from '../components/modal.js';
import { initGantt } from '../components/gantt.js';
import { computeResults } from '../utils/computeResults.js';

const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function getCategoryEmoji(cat) {
  const map = { Cooling: '❄️', Lighting: '💡', Kitchen: '🍳', Entertainment: '📺', 'ICT / Office': '💻', Laundry: '🫧', Water: '💧', Security: '🔒' };
  return map[cat] || '🔌';
}

function renderApplianceModal(applianceData, selectedAppliances) {
  const selectedMap = {};
  selectedAppliances.forEach(a => { selectedMap[a.name] = a; });

  const rows = applianceData.map(a => {
    const sel = selectedMap[a.name];
    const qty = sel ? sel.qty : 0;
    return `
      <div class="appliance-modal-row">
        <div class="checkbox ${sel ? 'checked' : ''}" data-name="${escAttr(a.name)}"></div>
        <div class="appliance-modal-row__img-placeholder">${getCategoryEmoji(a.category)}</div>
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
    title: 'Select appliances for your solar system',
    subtitle: 'Choose the appliances you want to connect to your solar system',
    body: rows,
    footer: `<button class="btn btn--primary btn--full" id="add-appliances-confirm">Confirm Selection</button>`
  });
}


// Bungalow: 9 rooms, Duplex: 14 rooms, Terrace: 20 rooms
const DEFAULT_ROOMS = { bungalow: 9, duplex: 14, terrace: 20 };
// 3 bulbs per room: 2 x 9W + 1 x 15W
const BULBS_PER_ROOM = { '9W': 2, '15W': 1 };

function buildHousePreselection(houseType, rooms, houseDefaults) {
  const base = (houseDefaults[houseType] || []).filter(
    a => !a.name.startsWith('LED Bulb')
  );
  const r = (rooms && rooms > 0) ? rooms : (DEFAULT_ROOMS[houseType] || 9);
  return [
    ...base,
    { name: 'LED Bulb (9W)',  qty: r * BULBS_PER_ROOM['9W']  },
    { name: 'LED Bulb (15W)', qty: r * BULBS_PER_ROOM['15W'] },
  ];
}

export function renderAddAppliances(container, navigate) {
  const applianceData  = getData('appliances') || [];
  const houseDefaults  = getData('house_type_appliances') || {};
  let _ganttCleanup    = null;

  const HOUSE_TYPES = [
    { id: 'bungalow', emoji: `<img src="/icons/bungalow.png" width="72" height="72" style="object-fit:contain">`,           name: 'Bungalow' },
    { id: 'duplex',   emoji: `<img src="/icons/duplex_home_type.png" width="72" height="72" style="object-fit:contain">`,   name: 'Duplex' },
    { id: 'terrace',  emoji: `<img src="/icons/terrace_house_type.png" width="72" height="72" style="object-fit:contain">`, name: 'Terrace House' }
  ];

  function render() {
    if (_ganttCleanup) { _ganttCleanup(); _ganttCleanup = null; }
    const s = getState();

    container.innerHTML = `
      <div style="display:flex;flex-direction:column;min-height:100%">
      <div id="add-appliances-content" style="flex:1;padding:40px 40px 32px">
        <div style="margin-bottom:32px">
          <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Select Appliances for Solar</h2>
          <p style="color:var(--color-text-secondary);font-size:16px">Choose the appliances you want to connect to your solar system. This helps us size your inverter correctly.</p>
        </div>

        <div class="section-title" style="margin-bottom:14px">Choose your house type</div>
        <div class="radio-cards" id="house-type-cards">
          ${HOUSE_TYPES.map(h => `
            <div class="radio-card ${s.houseType === h.id ? 'selected' : ''}" data-value="${h.id}" style="align-items:center">
              <div class="radio-card__radio"></div>
              <div class="radio-card__img-placeholder">${h.emoji}</div>
              <div class="radio-card__name">${h.name}</div>
              ${s.houseType === h.id ? `
                <div class="rooms-counter">
                  <span class="rooms-counter__label">Rooms</span>
                  <button class="rooms-counter__btn" id="rooms-dec">–</button>
                  <span class="rooms-counter__val" id="rooms-val">${s.rooms}</span>
                  <button class="rooms-counter__btn" id="rooms-inc">+</button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div class="section-title" style="margin-top:28px;margin-bottom:12px">Which appliances will connect to the solar system?</div>
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

        ${s.appliances.length > 0 ? '<div id="gantt-section" style="margin-top:32px"></div>' : ''}
      </div>
      <div class="step-footer" style="padding-left:40px;padding-right:40px">
        <button class="btn btn--primary btn--lg" id="done-btn">Update Results →</button>
      </div>
      </div>
    `;

    bindAll();

    if (s.appliances.length > 0) {
      _ganttCleanup = initGantt('gantt-section', s.appliances);
    }
  }

  function bindAll() {
    document.getElementById('done-btn').addEventListener('click', () => {
      if (_ganttCleanup) { _ganttCleanup(); _ganttCleanup = null; }
      computeResults();
      navigate('solarPVSystem');
    });

    document.querySelectorAll('#house-type-cards .radio-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.rooms-counter')) return;
        setState({ houseType: card.dataset.value });
        render();
      });
    });

    document.getElementById('rooms-dec')?.addEventListener('click', () => {
      setState({ rooms: Math.max(0, getState().rooms - 1) });
      document.getElementById('rooms-val').textContent = getState().rooms;
    });
    document.getElementById('rooms-inc')?.addEventListener('click', () => {
      setState({ rooms: getState().rooms + 1 });
      document.getElementById('rooms-val').textContent = getState().rooms;
    });

    document.querySelectorAll('.appliance-chip__remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        setState({ appliances: getState().appliances.filter(a => a.name !== btn.dataset.name) });
        render();
      });
    });

    document.getElementById('add-appliances-btn').addEventListener('click', () => {
      const s = getState();
      const preselect = (s.houseType && s.appliances.length === 0)
        ? buildHousePreselection(s.houseType, s.rooms, houseDefaults)
        : s.appliances;
      openModal(renderApplianceModal(applianceData, preselect));
      bindModalClose();
      bindApplianceModal(applianceData, preselect);
    });
  }

  function bindApplianceModal(appData, initialSelections) {
    const selections = {};
    const seed = initialSelections || getState().appliances;
    seed.forEach(a => {
      const def = appData.find(d => d.name === a.name);
      selections[a.name] = def ? { ...def, qty: a.qty || 1 } : { ...a };
    });

    document.querySelectorAll('.appliance-modal-row').forEach(row => {
      const checkbox = row.querySelector('.checkbox');
      const counter  = row.querySelector('.counter');
      const name     = checkbox.dataset.name;
      const appDef   = appData.find(a => a.name === name);

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
      const newAppliances = Object.values(selections).filter(a => a.qty > 0);
      const newNames = new Set(newAppliances.map(a => a.name));
      setState({
        appliances: newAppliances,
        customSchedule: getState().customSchedule
          ? getState().customSchedule.filter(row => newNames.has(row.name))
          : null,
      });
      closeModal();
      render();
    });
  }

  render();
}
