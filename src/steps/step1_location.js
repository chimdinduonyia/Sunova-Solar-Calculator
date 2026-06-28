import { getState, setState, getData } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Mapbox region name → pv_yield "state" key.
// Covers both "X State" and bare "X" variants since Mapbox is inconsistent.
const REGION_TO_STATE = {
  // FCT
  'Federal Capital Territory': 'Abuja (FCT)',
  'FCT':                       'Abuja (FCT)',
  // South West
  'Lagos State': 'Lagos',      'Lagos':    'Lagos',
  'Oyo State':   'Ibadan',     'Oyo':      'Ibadan',
  'Ogun State':  'Abeokuta',   'Ogun':     'Abeokuta',
  'Ondo State':  'Akure',      'Ondo':     'Akure',
  'Osun State':  'Osogbo',     'Osun':     'Osogbo',
  'Ekiti State': 'Ado Ekiti',  'Ekiti':    'Ado Ekiti',
  // South South
  'Rivers State':      'Port Harcourt', 'Rivers':      'Port Harcourt',
  'Delta State':       'Asaba',         'Delta':       'Asaba',
  'Edo State':         'Benin City',    'Edo':         'Benin City',
  'Cross River State': 'Calabar',       'Cross River': 'Calabar',
  'Akwa Ibom State':   'Uyo',           'Akwa Ibom':   'Uyo',
  'Bayelsa State':     'Port Harcourt', 'Bayelsa':     'Port Harcourt',
  // South East
  'Enugu State':   'Enugu',      'Enugu':   'Enugu',
  'Anambra State': 'Awka',       'Anambra': 'Awka',
  'Imo State':     'Owerri',     'Imo':     'Owerri',
  'Abia State':    'Umuahia',    'Abia':    'Umuahia',
  'Ebonyi State':  'Abakaliki',  'Ebonyi':  'Abakaliki',
  // North Central
  'Kwara State':   'Ilorin',   'Kwara':   'Ilorin',
  'Kogi State':    'Lokoja',   'Kogi':    'Lokoja',
  'Benue State':   'Makurdi',  'Benue':   'Makurdi',
  'Niger State':   'Minna',    'Niger':   'Minna',
  'Plateau State': 'Jos',      'Plateau': 'Jos',
  'Nasarawa State':'Lafia',    'Nasarawa':'Lafia',
  // North West
  'Kano State':    'Kano',          'Kano':    'Kano',
  'Kaduna State':  'Kaduna',        'Kaduna':  'Kaduna',
  'Sokoto State':  'Sokoto',        'Sokoto':  'Sokoto',
  'Kebbi State':   'Birnin Kebbi',  'Kebbi':   'Birnin Kebbi',
  'Zamfara State': 'Zamfara',       'Zamfara': 'Zamfara',
  'Jigawa State':  'Dutse',         'Jigawa':  'Dutse',
  'Katsina State': 'Kano',          'Katsina': 'Kano',   // nearest dataset city
  // North East
  'Borno State':   'Maiduguri', 'Borno':   'Maiduguri',
  'Yobe State':    'Damaturu',  'Yobe':    'Damaturu',
  'Bauchi State':  'Bauchi',    'Bauchi':  'Bauchi',
  'Gombe State':   'Gombe',     'Gombe':   'Gombe',
  'Adamawa State': 'Yola',      'Adamawa': 'Yola',
  'Taraba State':  'Jalingo',   'Taraba':  'Jalingo',
};

let _debounceTimer  = null;
let _suggestions    = [];
let _activeIdx      = -1;

async function geocode(query) {
  if (!MAPBOX_TOKEN || query.length < 3) return [];
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`
    + `?country=NG&types=address,neighborhood,locality,place,district&language=en&limit=6`
    + `&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return (await res.json()).features || [];
  } catch { return []; }
}

// Try region → district → place context levels in order.
// Mapbox sometimes puts the state at a different level depending on the address type.
function extractRegion(feature) {
  const ctx = feature.context || [];
  for (const prefix of ['region.', 'district.', 'place.']) {
    const match = ctx.find(c => c.id?.startsWith(prefix));
    if (match) return match.text;
  }
  return null;
}

function matchPvRecord(regionText, pvData) {
  if (!regionText) return null;

  // 1. Direct lookup in mapping table
  const mapped = REGION_TO_STATE[regionText];
  if (mapped) return pvData.find(r => r.state === mapped) || null;

  // 2. Direct match against pv_yield state names (e.g. Mapbox returned "Enugu" exactly)
  const direct = pvData.find(r => r.state.toLowerCase() === regionText.toLowerCase());
  if (direct) return direct;

  // 3. Partial match — check if the region text contains a recognisable state word
  const lower = regionText.toLowerCase();
  for (const [key, val] of Object.entries(REGION_TO_STATE)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      const rec = pvData.find(r => r.state === val);
      if (rec) return rec;
    }
  }

  return null;
}

// ── Render ────────────────────────────────────────────────────────────────────
export function renderStep1(container, navigate) {
  const state  = getState();
  const pvData = getData('pv_yield') || [];
  const saved  = state.location;

  container.innerHTML = `
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn" disabled style="opacity:0.35">← Back</button>
        ${renderProgressBar(1)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <div class="step-head">
          <div>
            <h1 class="step-title">Where is your home located?</h1>
            <p class="step-subtitle">We'll use this to calculate solar irradiance in your area</p>
          </div>
          <span style="font-size:72px">🌍</span>
        </div>

        <div class="card" style="max-width:480px">
          <label class="label" style="display:block;margin-bottom:8px;font-weight:600;font-size:14px">
            Enter your address
          </label>

          <div class="loc-wrap">
            <div class="loc-input-row">
              <svg class="loc-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="#9CA3AF" stroke-width="1.6"/>
                <path d="M10.5 10.5L13.5 13.5" stroke="#9CA3AF" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              <input
                id="loc-input"
                type="text"
                class="loc-input"
                placeholder="e.g. 5 Aminu Kano Crescent, Wuse 2"
                autocomplete="off"
                spellcheck="false"
                value="${saved?.address || ''}"
              />
              <button id="loc-clear" class="loc-clear" style="display:${saved?.address ? 'flex' : 'none'}" aria-label="Clear">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <ul id="loc-suggestions" class="loc-suggestions" role="listbox" style="display:none"></ul>
          </div>

          ${!MAPBOX_TOKEN
            ? `<p style="font-size:12px;color:#EF4444;margin-top:8px">Address search unavailable. VITE_MAPBOX_TOKEN not configured.</p>`
            : ''
          }

          <div id="location-info" class="card" style="margin-top:16px;background:var(--color-primary-bg);border-color:var(--color-primary-light);display:${saved ? 'block' : 'none'}">
            <div style="display:flex;gap:32px;align-items:center;flex-wrap:wrap">
              <div class="loc-zone-field">
                <div class="label">Zone</div>
                <div class="value" id="loc-zone">${saved?.zone || ''}</div>
              </div>
              <div>
                <div class="label">Peak Sun Hours</div>
                <div class="value value--amber" id="loc-psh">${saved?.daily_yield_kwh_per_kwp ? saved.daily_yield_kwh_per_kwp + ' hrs/day' : ''}</div>
              </div>
              <div>
                <div class="label">Annual Specific Yield</div>
                <div class="value" id="loc-yield">${saved?.annual_yield_kwh_per_kwp ? saved.annual_yield_kwh_per_kwp + ' kWh/kWp' : ''}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="continue-btn" ${!saved ? 'disabled' : ''}>
          Continue
        </button>
      </div>
    </div>
  `;

  const input       = document.getElementById('loc-input');
  const clearBtn    = document.getElementById('loc-clear');
  const suggestEl   = document.getElementById('loc-suggestions');
  const infoBox     = document.getElementById('location-info');
  const continueBtn = document.getElementById('continue-btn');

  // ── Suggestions list ───────────────────────────────────────────────────────
  function renderSuggestions(features) {
    _suggestions = features;
    _activeIdx   = -1;
    if (!features.length) { suggestEl.style.display = 'none'; return; }

    suggestEl.innerHTML = features.map((f, i) => {
      const main = f.text || f.place_name.split(',')[0];
      const sub  = f.place_name;
      return `
        <li class="loc-suggestion" role="option" data-idx="${i}">
          <svg class="loc-pin-icon" width="11" height="14" viewBox="0 0 11 14" fill="none">
            <path d="M5.5 0C3.02 0 1 2.02 1 4.5c0 3.28 4.5 9.5 4.5 9.5S10 7.78 10 4.5C10 2.02 7.98 0 5.5 0z" fill="#D1D5DB"/>
            <circle cx="5.5" cy="4.5" r="1.8" fill="white"/>
          </svg>
          <div class="loc-sug-text">
            <span class="loc-sug-main">${main}</span>
            <span class="loc-sug-sub">${sub}</span>
          </div>
        </li>
      `;
    }).join('');
    suggestEl.style.display = 'block';
  }

  function hideSuggestions() {
    suggestEl.style.display = 'none';
    _activeIdx = -1;
  }

  function setActiveItem(idx) {
    const items = suggestEl.querySelectorAll('.loc-suggestion');
    items.forEach((el, i) => el.classList.toggle('loc-suggestion--active', i === idx));
    _activeIdx = idx;
  }

  // ── Commit a selection ─────────────────────────────────────────────────────
  function commit(feature) {
    const region   = extractRegion(feature);
    const pvRecord = matchPvRecord(region, pvData);

    input.value = feature.place_name;
    hideSuggestions();
    clearBtn.style.display = 'flex';

    if (pvRecord) {
      setState({
        location: {
          ...pvRecord,
          address:     feature.place_name,
          coordinates: feature.geometry.coordinates,  // [lng, lat]
        }
      });
      document.getElementById('loc-zone').textContent  = pvRecord.zone;
      document.getElementById('loc-psh').textContent   = `${pvRecord.daily_yield_kwh_per_kwp} hrs/day`;
      document.getElementById('loc-yield').textContent = `${pvRecord.annual_yield_kwh_per_kwp} kWh/kWp`;
      infoBox.innerHTML = infoBox.innerHTML; // reset any error html
      infoBox.style.background  = 'var(--color-primary-bg)';
      infoBox.style.borderColor = 'var(--color-primary-light)';
      document.getElementById('loc-zone').textContent  = pvRecord.zone;
      document.getElementById('loc-psh').textContent   = `${pvRecord.daily_yield_kwh_per_kwp} hrs/day`;
      document.getElementById('loc-yield').textContent = `${pvRecord.annual_yield_kwh_per_kwp} kWh/kWp`;
      infoBox.style.display  = 'block';
      continueBtn.disabled   = false;
    } else {
      setState({ location: null });
      infoBox.innerHTML     = `<p style="font-size:13px;color:#EF4444;margin:0">We don't have solar data for this region yet. Please try a major Nigerian city.</p>`;
      infoBox.style.display = 'block';
      continueBtn.disabled  = true;
    }
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  function clearInput() {
    input.value           = '';
    clearBtn.style.display = 'none';
    setState({ location: null });
    hideSuggestions();
    infoBox.style.display = 'none';
    continueBtn.disabled  = true;
    input.focus();
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearBtn.style.display = q ? 'flex' : 'none';
    if (!q) { setState({ location: null }); hideSuggestions(); continueBtn.disabled = true; return; }
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(async () => {
      renderSuggestions(await geocode(q));
    }, 320);
  });

  // Keyboard navigation
  input.addEventListener('keydown', e => {
    const items = suggestEl.querySelectorAll('.loc-suggestion');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveItem(Math.min(_activeIdx + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveItem(Math.max(_activeIdx - 1, 0));
    } else if (e.key === 'Enter' && _activeIdx >= 0) {
      e.preventDefault();
      commit(_suggestions[_activeIdx]);
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });

  suggestEl.addEventListener('mousedown', e => {
    const item = e.target.closest('[data-idx]');
    if (item) { e.preventDefault(); commit(_suggestions[+item.dataset.idx]); }
  });

  clearBtn.addEventListener('click', clearInput);

  document.addEventListener('click', e => {
    if (!e.target.closest('.loc-wrap')) hideSuggestions();
  }, { capture: true });

  continueBtn.addEventListener('click', () => {
    if (getState().location) navigate('step2');
  });
}
