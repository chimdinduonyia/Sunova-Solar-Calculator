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
    title: 'Choose specific appliances',
    subtitle: 'You can select multiple appliances',
    body: rows,
    footer: `<button class="btn btn--primary btn--full" id="add-appliances-confirm">Add Appliances</button>`
  });
}

const WHY_MODAL_HTML = `
  <div class="assumptions-overlay" id="why-appliances-overlay" role="dialog" aria-modal="true">
    <div class="modal-card" style="max-width:460px">
      <div class="modal-header">
        <h3 class="modal-title">Make your results more accurate</h3>
        <button class="modal-close" id="why-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:14px;line-height:1.7;color:var(--color-text-secondary);margin:0 0 20px">
          Your estimate is based on spending data alone. Tell us which appliances you run and when, and we will calculate a precise load profile and upgrade your confidence score from <strong style="color:var(--color-error)">Low</strong> to <strong style="color:var(--color-success)">High</strong>.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div class="appliance-prompt-feature">
            <span style="font-size:26px">📊</span>
            <div><div class="appliance-prompt-feature__title">Hourly load curve</div><div class="appliance-prompt-feature__desc">See exactly when your home draws the most power</div></div>
          </div>
          <div class="appliance-prompt-feature">
            <span style="font-size:26px">📅</span>
            <div><div class="appliance-prompt-feature__title">Seasonal forecast</div><div class="appliance-prompt-feature__desc">Understand your peak and low consumption months</div></div>
          </div>
          <div class="appliance-prompt-feature">
            <span style="font-size:26px">🎯</span>
            <div><div class="appliance-prompt-feature__title">Right-sized solar system</div><div class="appliance-prompt-feature__desc">Panel count, battery, and inverter sized to your real usage</div></div>
          </div>
        </div>
      </div>
      <div class="modal-footer" style="justify-content:flex-end">
        <button class="btn btn--primary btn--lg" id="why-cta-btn" style="width:100%">Got it, let me add my appliances</button>
      </div>
    </div>
  </div>
`;

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
          <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Home Profile &amp; Appliances</h2>
          <p style="color:var(--color-text-secondary);font-size:16px">Add your appliances to sharpen your solar recommendation</p>
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
        ? (houseDefaults[s.houseType] || [])
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

  // Auto-show "why add appliances" modal after 2 seconds, but only when the
  // user has not yet added any appliances (no need to re-educate them).
  const whyOverlay = document.createElement('div');
  whyOverlay.innerHTML = WHY_MODAL_HTML;
  document.body.appendChild(whyOverlay.firstElementChild);

  const overlay = document.getElementById('why-appliances-overlay');
  const hasExistingAppliances = (getState().appliances || []).length > 0;
  let _whyTimer = hasExistingAppliances
    ? null
    : setTimeout(() => { if (overlay) overlay.classList.add('assumptions-overlay--visible'); }, 2000);

  function closeWhy() {
    if (overlay) overlay.remove();
    clearTimeout(_whyTimer);
  }

  // Bind after a tick so the DOM is ready
  setTimeout(() => {
    document.getElementById('why-close-btn')?.addEventListener('click', closeWhy);
    document.getElementById('why-cta-btn')?.addEventListener('click', closeWhy);
    overlay?.addEventListener('click', e => { if (e.target === overlay) closeWhy(); });
  }, 0);

  render();
}
