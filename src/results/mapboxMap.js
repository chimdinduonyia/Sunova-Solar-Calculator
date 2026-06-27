import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fmtM } from '../data/installers.js';

// Real centre coordinates [lng, lat] for every city in cityMapData.json
const CITY_CENTERS = {
  'Abuja (FCT)':   [7.4951,  9.0579],
  'Lagos':         [3.3792,  6.5244],
  'Kano':          [8.5269, 12.0022],
  'Maiduguri':    [13.1536, 11.8333],
  'Enugu':         [7.4951,  6.4498],
  'Port Harcourt': [7.0134,  4.8156],
  'Ibadan':        [3.9470,  7.3776],
  'Kaduna':        [7.4386, 10.5105],
  'Sokoto':        [5.2321, 13.0059],
  'Jos':           [8.8921,  9.9285],
  'Benin City':    [5.6177,  6.3350],
  'Asaba':         [6.7499,  6.1956],
  'Owerri':        [7.0265,  5.4836],
  'Calabar':       [8.3258,  4.9757],
  'Uyo':           [7.9308,  5.0510],
  'Abeokuta':      [3.3515,  7.1557],
  'Akure':         [5.1981,  7.2526],
  'Bauchi':        [9.8442, 10.3158],
  'Gombe':        [11.1673, 10.2896],
  'Ilorin':        [4.5426,  8.4966],
  'Lokoja':        [6.7499,  7.7931],
  'Makurdi':       [8.5343,  7.7311],
  'Minna':         [6.5569,  9.6139],
  'Umuahia':       [7.4892,  5.5278],
  'Yola':         [12.4620,  9.2035],
  'Zamfara':       [6.6609, 12.1703],
  'Lafia':         [8.5227,  8.4927],
  'Birnin Kebbi':  [4.1987, 12.4540],
  'Dutse':         [9.3429, 11.7499],
  'Damaturu':     [11.9660, 11.7476],
  'Jalingo':      [11.3643,  8.8937],
  'Ado Ekiti':     [5.2224,  7.6233],
  'Abakaliki':     [8.1113,  6.3249],
  'Awka':          [7.0728,  6.2089],
  'Ikeja':         [3.3515,  6.6018],
  'Osogbo':        [4.5548,  7.7727],
};

// Convert installer mapX/mapY (0–100 %) into real lng/lat relative to city centre.
// ~10 km total east-west span, ~9 km north-south — matches the "~8km radius" chip text.
function installerCoords(installer, center) {
  const lng = center[0] + (installer.mapX / 100 - 0.5) * 0.18;
  const lat = center[1] + (0.5 - installer.mapY / 100) * 0.14;
  return [lng, lat];
}

// ── DOM element builders ───────────────────────────────────────────────────────

function createPinEl(installer) {
  const el = document.createElement('div');
  el.className = 'mk-pin';
  el.dataset.pin = installer.id;
  el.innerHTML = `
    <div class="mk-pin-tag">
      <span class="mk-pin-init">${installer.init}</span>
      ${fmtM(installer.price)}
    </div>
    <div class="mk-pin-stem"></div>
  `;
  return el;
}

function createUserPinEl() {
  const el = document.createElement('div');
  el.className = 'mk-user-pin';
  el.innerHTML = `
    <div class="mk-user-core">
      <div class="mk-pulse-rings">
        <div class="mk-pulse-ring"></div>
        <div class="mk-pulse-ring" style="animation-delay:.8s"></div>
        <div class="mk-pulse-ring" style="animation-delay:1.6s"></div>
      </div>
      <div class="mk-user-dot"><div class="mk-user-halo"></div></div>
    </div>
    <div class="mk-user-label">Your home</div>
  `;
  return el;
}

// ── Branded colour theme (applied after style loads) ──────────────────────────
// Targets Mapbox light-v11 layer IDs. Unknown IDs are silently skipped.
function applyTheme(map) {
  const rules = [
    // Land / ground
    ['background',                  'background-color',   '#F2EDE5'],
    ['landcover',                   'fill-color',         '#E8E2D8'],
    ['landcover-crop',              'fill-color',         '#DFD9CF'],
    // Water
    ['water',                       'fill-color',         '#C4D9E8'],
    ['waterway-shadow',             'line-color',         '#B8D0E2'],
    ['waterway',                    'line-color',         '#B8D0E2'],
    // Buildings
    ['building',                    'fill-color',         '#DDD7CE'],
    ['building',                    'fill-outline-color', '#CECA C2'],
    // Parks / land use
    ['landuse-park',                'fill-color',         '#D4E8CC'],
    ['landuse',                     'fill-color',         '#E2DDD5'],
    // Road casings
    ['road-motorway-trunk-case',    'line-color',         '#D0C8BC'],
    ['road-primary-case',           'line-color',         '#D8D2C8'],
    ['road-secondary-tertiary-case','line-color',         '#DEDAD2'],
    ['road-street-case',            'line-color',         '#E2DED8'],
    ['road-minor-case',             'line-color',         '#E5E0DA'],
    // Road fills
    ['road-motorway-trunk',         'line-color',         '#FFFFFF'],
    ['road-primary',                'line-color',         '#FFFFFF'],
    ['road-secondary-tertiary',     'line-color',         '#F5F0E8'],
    ['road-street',                 'line-color',         '#EDE8E0'],
    ['road-minor',                  'line-color',         '#EDE8E0'],
    ['road-path',                   'line-color',         '#E0DDD5'],
    // Labels
    ['road-label',                  'text-color',         '#A89E92'],
    ['road-label',                  'text-halo-color',    '#F2EDE5'],
    ['road-intersection',           'text-color',         '#B0A898'],
    ['place-label',                 'text-color',         '#9CA3AF'],
    ['place-label',                 'text-halo-color',    '#F2EDE5'],
    ['poi-label',                   'text-color',         '#B4ACA4'],
    ['poi-label',                   'text-halo-color',    '#F2EDE5'],
    ['country-label',               'text-color',         '#9CA3AF'],
    ['state-label',                 'text-color',         '#B0A898'],
    ['settlement-label',            'text-color',         '#9CA3AF'],
    ['settlement-label',            'text-halo-color',    '#F2EDE5'],
    ['settlement-minor-label',      'text-color',         '#B0A898'],
    ['settlement-minor-label',      'text-halo-color',    '#F2EDE5'],
  ];

  rules.forEach(([layerId, prop, value]) => {
    try {
      if (map.getLayer(layerId)) map.setPaintProperty(layerId, prop, value);
    } catch (_) {}
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialise (or re-initialise) a Mapbox GL map inside `containerEl`.
 *
 * @param {Object} opts
 * @param {HTMLElement} opts.containerEl  - The div to mount the map into
 * @param {string}      opts.cityState    - e.g. "Abuja (FCT)" — used for centre
 * @param {Array}       opts.installers   - withScores(INSTALLERS) array
 * @param {Array}       opts.arrivedIds   - installer IDs whose quotes have arrived
 * @param {Function}    opts.onPinClick   - called with (installerId)
 * @param {Function}    opts.onPinHover   - called with (installerId, isEntering:bool)
 *
 * @returns {{ map: mapboxgl.Map|null, markers: Object }}
 */
export function initMapboxMap({ containerEl, cityState, installers, arrivedIds, onPinClick, onPinHover }) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!token) {
    console.warn(
      '[NNEL Solar] Live map needs a Mapbox token.\n' +
      'Copy .env.example → .env and paste your token from https://account.mapbox.com'
    );
    return { map: null, markers: {} };
  }

  // Tear down any previous instance mounted in this element
  if (containerEl._mbMap) {
    containerEl._mbMap.remove();
    delete containerEl._mbMap;
  }

  mapboxgl.accessToken = token;

  const center = CITY_CENTERS[cityState] || CITY_CENTERS['Abuja (FCT)'];

  const map = new mapboxgl.Map({
    container:        containerEl,
    style:            'mapbox://styles/mapbox/light-v11',
    center,
    zoom:             12,
    interactive:      false,
    attributionControl: false,
  });

  // Compact attribution keeps us Mapbox-ToS compliant
  map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

  containerEl._mbMap = map;
  const markers = {};

  // User home marker — added before tiles load so it's visible immediately
  const userMarker = new mapboxgl.Marker({ element: createUserPinEl(), anchor: 'bottom' })
    .setLngLat(center)
    .addTo(map);

  map.on('load', () => {
    applyTheme(map);

    // Place installer markers (invisible until their quote arrives)
    installers.forEach(inst => {
      const coords = installerCoords(inst, center);
      const el     = createPinEl(inst);

      if (arrivedIds.includes(inst.id)) el.classList.add('mk-pin--visible');

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(coords)
        .addTo(map);

      markers[inst.id] = marker;

      el.addEventListener('click',      ()  => onPinClick(inst.id));
      el.addEventListener('mouseenter', ()  => onPinHover(inst.id, true));
      el.addEventListener('mouseleave', ()  => onPinHover(inst.id, false));
    });
  });

  // Ask the browser for the user's real position; fly there if granted
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const real = [pos.coords.longitude, pos.coords.latitude];
        userMarker.setLngLat(real);
        map.flyTo({ center: real, zoom: 12, duration: 1400, essential: true });
      },
      () => {} // denied → stay on city centre
    );
  }

  return { map, markers };
}
