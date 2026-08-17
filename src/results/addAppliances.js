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
          <div class="appliance-modal-row__watts">${a.rated_watts}W</div>
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


// "Rooms" means bedrooms — the one figure the user adjusts directly via the
// +/- counter. Parlours and kitchens are fixed per house type; bathrooms are
// derived from the bedroom count (see bathroomsFor). Defaults seed the
// counter the moment a house type is picked, before any manual adjustment.
const DEFAULT_BEDROOMS = { bungalow: 3, duplex: 5, terrace: 8 };

const HOUSE_LAYOUT = {
  bungalow: { parlours: 1, kitchens: 1 },
  duplex:   { parlours: 2, kitchens: 1 },
  terrace:  { parlours: 2, kitchens: 2 },  // twice the bungalow's parlours & kitchens
};

// Bathrooms assumed from bedrooms: one en-suite per bedroom (standard for
// mid/upper Nigerian residential builds) plus one shared guest toilet off
// the parlour — a common, defensible baseline rather than a fixed count.
function bathroomsFor(bedrooms) {
  return Math.max(1, bedrooms) + 1;
}

function houseLayoutFor(houseType, bedrooms) {
  const layout = HOUSE_LAYOUT[houseType] || HOUSE_LAYOUT.bungalow;
  return { ...layout, bedrooms, bathrooms: bathroomsFor(bedrooms) };
}

// Lighting points per space — a "point" is one fixture/switch position.
// Bedrooms and kitchens get a modest ambient+task pairing; the parlour (the
// largest, most-used space) gets the most coverage; bathrooms get a single
// fixture. This mirrors typical Nigerian residential wiring practice and
// replaces the old flat "3 bulbs per generic room" assumption.
const LIGHTING_POINTS = {
  bedroom:  { '9W': 2, '15W': 0 },  // ceiling + reading/wall light
  parlour:  { '9W': 2, '15W': 1 },  // ambient + brighter accent, larger area
  kitchen:  { '9W': 1, '15W': 1 },  // general + brighter task/hood light
  bathroom: { '9W': 1, '15W': 0 },  // single fixture, small space
};

function computeLightingCounts(houseType, bedrooms) {
  const { parlours, kitchens, bathrooms } = houseLayoutFor(houseType, bedrooms);
  const spaces = { bedroom: bedrooms, parlour: parlours, kitchen: kitchens, bathroom: bathrooms };
  let w9 = 0, w15 = 0;
  for (const [space, count] of Object.entries(spaces)) {
    const pts = LIGHTING_POINTS[space];
    w9  += count * pts['9W'];
    w15 += count * pts['15W'];
  }
  return { w9, w15 };
}

function roomsTooltipText(houseType) {
  const { parlours, kitchens } = HOUSE_LAYOUT[houseType] || HOUSE_LAYOUT.bungalow;
  const p = parlours === 1 ? 'parlour' : 'parlours';
  const k = kitchens === 1 ? 'kitchen' : 'kitchens';
  return `"Rooms" means bedrooms. For this house type we assume ${parlours} ${p} and ${kitchens} ${k}, plus one en-suite bathroom per bedroom and a shared guest toilet. Together these drive our lighting-point estimate below.`;
}

function buildHousePreselection(houseType, bedrooms, houseDefaults) {
  const base = (houseDefaults[houseType] || []).filter(
    a => !a.name.startsWith('LED Bulb')
  );
  const r = (bedrooms && bedrooms > 0) ? bedrooms : (DEFAULT_BEDROOMS[houseType] || DEFAULT_BEDROOMS.bungalow);
  const { w9, w15 } = computeLightingCounts(houseType, r);
  return [
    ...base,
    { name: 'LED Bulb (9W)',  qty: w9 },
    { name: 'LED Bulb (15W)', qty: w15 },
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
                  <span class="confidence-tooltip-wrap">
                    <button class="confidence-tooltip-btn" type="button">?</button>
                    <span class="confidence-tooltip-box">${roomsTooltipText(h.id)}</span>
                  </span>
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
      // Land back at the top of the report (Cost Savings, the first scroll
      // section) rather than jumping down to Solar PV System at the bottom.
      navigate('costSavings');
    });

    document.querySelectorAll('#house-type-cards .radio-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.rooms-counter')) return;
        const houseType = card.dataset.value;
        // Seed the rooms (bedroom) counter with this house type's default —
        // the user can then +/- adjust from there.
        setState({ houseType, rooms: DEFAULT_BEDROOMS[houseType] || DEFAULT_BEDROOMS.bungalow });
        render();
      });
    });

    document.getElementById('rooms-dec')?.addEventListener('click', () => {
      setState({ rooms: Math.max(1, getState().rooms - 1) });
      document.getElementById('rooms-val').textContent = getState().rooms;
    });
    document.getElementById('rooms-inc')?.addEventListener('click', () => {
      setState({ rooms: getState().rooms + 1 });
      document.getElementById('rooms-val').textContent = getState().rooms;
    });

    document.querySelectorAll('.confidence-tooltip-wrap').forEach(wrap => {
      wrap.querySelector('.confidence-tooltip-btn')?.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = wrap.classList.contains('is-open');
        document.querySelectorAll('.confidence-tooltip-wrap.is-open').forEach(w => w.classList.remove('is-open'));
        if (!isOpen) wrap.classList.add('is-open');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.confidence-tooltip-wrap.is-open').forEach(w => w.classList.remove('is-open'));
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
          counter.querySelector('.counter__val').textContent = 0;
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
        // Reset the Interactive Profile's live subset — default to "everything
        // in the updated list is solarized" rather than carrying over a stale
        // selection that may no longer match.
        solarAppliances: null,
        // Default back to the Essentials Only view whenever the appliance
        // list changes — that's the whole point of updating it.
        reportBasis: 'essentials',
      });
      closeModal();
      render();
    });
  }

  render();
}
