import { getState, setState, getData } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Default map view before any address is picked (roughly centred on Nigeria).
const NIGERIA_CENTER = [8.6753, 9.0820];
const DEFAULT_ZOOM    = 5.4;
const PIN_ZOOM        = 15;
const MIN_ZOOM        = 3;
const MAX_ZOOM        = 19;

// ── Static map rendering (no WebGL) ─────────────────────────────────────────
// A plain <img> from Mapbox's Static Images API. Far simpler and more
// compatible than the interactive GL map — no canvas/WebGL requirement, so it
// renders everywhere (locked-down browsers, remote desktops, old GPUs, etc.).
// The pin is always drawn dead-centre over the image via CSS, since the image
// itself is always re-fetched centred on the current coordinates; tapping the
// image re-centres the map on that spot (standard Web Mercator pixel→lng/lat).
function staticMapUrl(coords, widthPx, heightPx, zoom) {
  // Request Mapbox's @2x (retina) variant on HiDPI screens — otherwise we're
  // handing the browser a 1x bitmap to stretch across 2x+ physical pixels,
  // which is exactly what reads as a blurry/low-res map.
  const retina  = (window.devicePixelRatio || 1) > 1;
  const maxDim  = retina ? 640 : 1280;  // @2x output is capped at 1280x1280 total px
  const w = Math.max(64, Math.min(maxDim, Math.round(widthPx)));
  const h = Math.max(64, Math.min(maxDim, Math.round(heightPx)));
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/`
    + `${coords[0]},${coords[1]},${zoom},0/${w}x${h}${retina ? '@2x' : ''}`
    + `?access_token=${MAPBOX_TOKEN}`;
}

function projectMercator(lng, lat) {
  const siny = Math.min(Math.max(Math.sin(lat * Math.PI / 180), -0.9999), 0.9999);
  return {
    x: (lng + 180) / 360,
    y: 0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI),
  };
}

function unprojectMercator(x, y) {
  const lng = x * 360 - 180;
  const n   = Math.PI - 2 * Math.PI * y;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lng, lat];
}

// Convert a click position (px from top-left of the rendered map image) back
// into [lng, lat], given the image was requested centred on `center` at `zoom`.
function pixelToLngLat(clickX, clickY, center, zoom, imgW, imgH) {
  const worldSize = 256 * Math.pow(2, zoom);
  const c = projectMercator(center[0], center[1]);
  const px = c.x * worldSize + (clickX - imgW / 2);
  const py = c.y * worldSize + (clickY - imgH / 2);
  return unprojectMercator(px / worldSize, py / worldSize);
}

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

// Reverse-geocode a tapped map point back into a Mapbox feature (same shape
// as the search results) so it can flow through the same commit() logic.
async function reverseGeocode(lng, lat) {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`
    + `?types=address,neighborhood,locality,place,district&language=en&limit=1`
    + `&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()).features?.[0] || null;
  } catch { return null; }
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
      </div>

      <div class="step-body" style="padding:10px 0 8px">
        <div class="step-head" style="margin-bottom:10px">
          <div>
            <h1 class="step-title" style="font-size:var(--font-size-2xl)">Where is your home located?</h1>
            <p class="step-subtitle" style="font-size:16px;margin-bottom:0">We'll use this to calculate solar irradiance in your area</p>
          </div>
          <img src="/icons/globe-icon.png" width="77" height="77" style="object-fit:contain">
        </div>

        <div class="card" style="max-width:552px;padding:18px">
          <label class="label" style="display:block;margin-bottom:7px;font-weight:600;font-size:13px">
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

          <div class="loc-map" id="loc-map" style="margin-top:12px">
            ${MAPBOX_TOKEN ? `<img id="loc-map-img" class="loc-map__img" alt="Map preview of your selected location">` : ''}
            <div id="loc-map-pin" class="loc-map__pin" style="display:none">
              <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
                <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.82 20.18 0 13 0z" fill="var(--color-success)"/>
                <circle cx="13" cy="13" r="5.2" fill="white"/>
              </svg>
            </div>
            ${!MAPBOX_TOKEN ? `<div class="loc-map__placeholder">Map preview unavailable. VITE_MAPBOX_TOKEN is not configured.</div>` : ''}
            ${MAPBOX_TOKEN ? `
            <div class="loc-map__zoom">
              <button id="loc-zoom-in" type="button" aria-label="Zoom in">+</button>
              <button id="loc-zoom-out" type="button" aria-label="Zoom out">−</button>
            </div>
            ` : ''}
            <div id="location-info" class="loc-map-overlay" style="display:${saved ? 'flex' : 'none'}"></div>
          </div>
          ${MAPBOX_TOKEN ? `<p class="loc-map-hint">Drag or tap the map to fine-tune your exact location.</p>` : ''}
        </div>
      </div>

      <div class="step-footer" style="padding:12px 0 14px">
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

  // ── Map (static image; default Nigeria view, pin once a location is chosen) ─
  const mapImgEl = document.getElementById('loc-map-img');
  const pinEl    = document.getElementById('loc-map-pin');
  let currentCenter = null;
  let currentZoom    = DEFAULT_ZOOM;
  let pinVisible     = false;
  let imgReqW = 640, imgReqH = 300;

  function showMapError(message) {
    const existing = document.querySelector('.loc-map__placeholder');
    if (existing) { existing.textContent = message; return; }
    const el = document.createElement('div');
    el.className = 'loc-map__placeholder';
    el.textContent = message;
    document.getElementById('loc-map')?.appendChild(el);
  }

  function updateMapImage(coords, zoom, showPin) {
    if (!MAPBOX_TOKEN || !mapImgEl) return;
    const rect = mapImgEl.parentElement.getBoundingClientRect();
    imgReqW = Math.round(rect.width)  || imgReqW;
    imgReqH = Math.round(rect.height) || imgReqH;
    currentCenter = coords;
    currentZoom   = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
    pinVisible    = showPin;
    mapImgEl.src  = staticMapUrl(coords, imgReqW, imgReqH, currentZoom);
    pinEl.style.display = showPin ? 'block' : 'none';
  }

  function zoomBy(delta) {
    if (!currentCenter) return;
    updateMapImage(currentCenter, currentZoom + delta, pinVisible);
  }

  function initMap() {
    if (!MAPBOX_TOKEN || !mapImgEl) return;

    mapImgEl.addEventListener('error', () => {
      console.error('[NNEL Solar] Static map image failed to load.');
      showMapError('Map failed to load. Check the browser console for details.');
    });

    document.getElementById('loc-zoom-in')?.addEventListener('click', () => zoomBy(1));
    document.getElementById('loc-zoom-out')?.addEventListener('click', () => zoomBy(-1));
    mapImgEl.addEventListener('wheel', e => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1 : -1);
    }, { passive: false });

    // Tap to drop the pin where you clicked; drag to pan — the pin stays put
    // at the centre crosshair while the image slides under it (pure CSS, no
    // refetch mid-drag), and whatever ends up under the pin on release is
    // reverse-geocoded into the new selection, same as a tap.
    let dragStart = null; // { x, y, dragged }

    mapImgEl.addEventListener('pointerdown', e => {
      if (!currentCenter) return;
      mapImgEl.setPointerCapture(e.pointerId);
      dragStart = { x: e.clientX, y: e.clientY, dragged: false };
      mapImgEl.classList.add('is-dragging');
    });

    mapImgEl.addEventListener('pointermove', e => {
      if (!dragStart) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragStart.dragged = true;
      if (dragStart.dragged) mapImgEl.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    mapImgEl.addEventListener('pointerup', async e => {
      if (!dragStart) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      const { x: startX, y: startY, dragged } = dragStart;
      dragStart = null;
      mapImgEl.classList.remove('is-dragging');
      mapImgEl.style.transform = '';

      const rect   = mapImgEl.getBoundingClientRect();
      const scaleX = imgReqW / rect.width;
      const scaleY = imgReqH / rect.height;

      const coords = dragged
        // Panned: the pin stayed centred, so the point now under it is the
        // original centre offset backwards by the drag distance.
        ? pixelToLngLat(imgReqW / 2 - dx * scaleX, imgReqH / 2 - dy * scaleY, currentCenter, currentZoom, imgReqW, imgReqH)
        // Plain tap: drop the pin exactly where the user clicked.
        : pixelToLngLat((startX - rect.left) * scaleX, (startY - rect.top) * scaleY, currentCenter, currentZoom, imgReqW, imgReqH);

      const feature = await reverseGeocode(coords[0], coords[1]);
      if (feature) commit(feature, coords);
    });

    const startCoords = saved?.coordinates || null;
    updateMapImage(startCoords || NIGERIA_CENTER, startCoords ? PIN_ZOOM : DEFAULT_ZOOM, !!startCoords);
  }

  // ── Irradiance overlay ──────────────────────────────────────────────────────
  function renderLocationInfo(pvRecord) {
    if (pvRecord) {
      infoBox.classList.remove('loc-map-overlay--error');
      infoBox.innerHTML = `
        <div class="loc-map-overlay__row loc-map-overlay__row--zone">
          <span class="loc-map-overlay__label">Zone</span>
          <span class="loc-map-overlay__value">${pvRecord.zone}</span>
        </div>
        <div class="loc-map-overlay__row">
          <span class="loc-map-overlay__label">Peak Sun Hours</span>
          <span class="loc-map-overlay__value loc-map-overlay__value--amber">${pvRecord.daily_yield_kwh_per_kwp} hrs/day</span>
        </div>
        <div class="loc-map-overlay__row">
          <span class="loc-map-overlay__label">Annual Yield</span>
          <span class="loc-map-overlay__value">${pvRecord.annual_yield_kwh_per_kwp} kWh/kWp</span>
        </div>
      `;
    } else {
      infoBox.classList.add('loc-map-overlay--error');
      infoBox.innerHTML = `<p class="loc-map-overlay__error">We don't have solar data for this region yet. Please try a major Nigerian city.</p>`;
    }
    infoBox.style.display = 'flex';
  }

  // ── Commit a selection (from search or a map tap) ───────────────────────────
  function commit(feature, coordsOverride) {
    const region   = extractRegion(feature);
    const pvRecord = matchPvRecord(region, pvData);
    const coords   = coordsOverride || feature.geometry.coordinates;  // [lng, lat]

    input.value = feature.place_name;
    hideSuggestions();
    clearBtn.style.display = 'flex';

    if (pvRecord) {
      setState({ location: { ...pvRecord, address: feature.place_name, coordinates: coords } });
      continueBtn.disabled = false;
    } else {
      setState({ location: null });
      continueBtn.disabled = true;
    }
    renderLocationInfo(pvRecord);
    updateMapImage(coords, PIN_ZOOM, true);
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  function clearInput() {
    input.value           = '';
    clearBtn.style.display = 'none';
    setState({ location: null });
    hideSuggestions();
    infoBox.style.display = 'none';
    continueBtn.disabled  = true;
    updateMapImage(NIGERIA_CENTER, DEFAULT_ZOOM, false);
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

  // ── Initial mount ────────────────────────────────────────────────────────
  if (saved) renderLocationInfo(saved);
  initMap();
}
