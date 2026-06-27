import { INSTALLERS, withScores, fmt, fmtM } from '../data/installers.js';
import { getState } from '../state.js';
import { initMapboxMap } from './mapboxMap.js';
import CITY_MAP_DATA from '../data/cityMapData.json';

function getCityData(cityState) {
  return CITY_MAP_DATA[cityState] || CITY_MAP_DATA['Abuja (FCT)'];
}

const TICK_SVG   = `<svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:4px"><polyline points="1,4 3.5,6.5 9,1"/></svg>`;
const REMOVE_SVG = `<svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="5,1 1,5 5,9"/><line x1="1" y1="5" x2="11" y2="5"/></svg>`;
const ARROW_L  = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>`;
const ARROW_R  = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-left:5px"><polyline points="5,2 10,7 5,12"/></svg>`;

// ── State ─────────────────────────────────────────────────────────────────────
export const mkState = {
  view:              'market',   // 'market' | 'storefront' | 'grid'
  openId:            null,
  shortlist:         [],
  hovered:           null,
  quoteRequests:     {},         // { [id]: { status: 'quoted', arrivedAt } }
  quotesArrived:     [],         // installer IDs in arrival order
  marketInitialized: false,
  arrivalTimers:     [],
  gridFilter:        { minRating: 0, district: 'all', sort: 'score' },
  mapInstance:       null,       // active mapboxgl.Map instance
  mapMarkers:        {},         // { [installerId]: mapboxgl.Marker }
};

let _container   = null;
let _navigate    = null;
let _rerendering = false;

// ── Exports ───────────────────────────────────────────────────────────────────
export function getShortlist() { return mkState.shortlist; }

export function toggleShortlist(id) {
  const idx = mkState.shortlist.indexOf(id);
  if (idx >= 0) {
    mkState.shortlist.splice(idx, 1);
  } else if (mkState.shortlist.length < 4) {
    mkState.shortlist.push(id);
  } else {
    showToast('You can compare up to 4 quotes at a time. Remove one first to add another.');
    return;
  }
  _rerender();
}

function showToast(message) {
  document.getElementById('mk-toast')?.remove();
  const el = document.createElement('div');
  el.id = 'mk-toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 280);
  }, 3200);
}

// ── BoQ ───────────────────────────────────────────────────────────────────────
function buildBoQ(it) {
  const total    = it.price;
  const subtotal = Math.round(total / 1.075);
  const vat      = total - subtotal;
  const r = pct => Math.round(subtotal * pct);
  const items = [
    { label: 'Solar Panels',                spec: it.panel,    amount: r(0.38) },
    { label: 'Battery Storage',             spec: it.battery,  amount: r(0.24) },
    { label: 'Inverter System',             spec: it.inverter, amount: r(0.20) },
    { label: 'Installation & Labour',       spec: 'Site assessment, mounting, wiring, commissioning',      amount: r(0.11) },
    { label: 'Cabling & Accessories',       spec: 'DC/AC cables, combiner box, circuit breakers',         amount: r(0.05) },
    { label: 'Pre-commissioning & Testing', spec: 'System diagnostics and performance validation',
      amount: subtotal - r(0.38) - r(0.24) - r(0.20) - r(0.11) - r(0.05) },
  ];
  return { items, subtotal, vat, total };
}

export function showBoQModal(it) {
  document.getElementById('boq-modal-overlay')?.remove();
  const { items, subtotal, vat, total } = buildBoQ(it);
  const overlay = document.createElement('div');
  overlay.id = 'boq-modal-overlay';
  overlay.innerHTML = `
    <div class="boq-modal">
      <div class="boq-modal-head">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--color-text)">${it.name}</div>
          <div style="font-size:12px;color:var(--color-text-muted)">Bill of Quantities</div>
        </div>
        <button class="fc-modal-close" id="boq-close">✕</button>
      </div>
      <div class="boq-table-wrap">
        <table class="boq-table">
          <thead><tr><th>Item</th><th>Specification</th><th class="boq-r">Amount</th></tr></thead>
          <tbody>
            ${items.map(row => `
              <tr>
                <td class="boq-item-name">${row.label}</td>
                <td class="boq-item-spec">${row.spec}</td>
                <td class="boq-r">${fmt(row.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="boq-subtotal-row"><td colspan="2">Subtotal</td><td class="boq-r">${fmt(subtotal)}</td></tr>
            <tr class="boq-vat-row"><td colspan="2">VAT (7.5%)</td><td class="boq-r">${fmt(vat)}</td></tr>
            <tr class="boq-total-row"><td colspan="2"><strong>Total</strong></td><td class="boq-r"><strong>${fmt(total)}</strong></td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#boq-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ── Internal helpers ──────────────────────────────────────────────────────────
function _rerender() {
  _rerendering = true;
  if (_container && _navigate) renderMarketplace(_container, _navigate);
  _rerendering = false;
}

function scrollToTop() {
  const main = document.querySelector('.results-main');
  if (main) main.scrollTop = 0;
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

function syncHover() {
  document.querySelectorAll('[data-card]').forEach(el => el.classList.toggle('hovered', el.dataset.card === mkState.hovered));
  Object.entries(mkState.mapMarkers).forEach(([id, marker]) => {
    marker.getElement().classList.toggle('hovered', id === mkState.hovered);
  });
}

function openStorefront(id) {
  mkState.view   = 'storefront';
  mkState.openId = id;
  _rerender();
  requestAnimationFrame(scrollToTop);
}

// ── Quote arrival simulation ──────────────────────────────────────────────────
function initQuoteArrivals() {
  if (mkState.marketInitialized) return;
  mkState.marketInitialized = true;

  const scored  = withScores(INSTALLERS);
  const ordered = [...scored].sort((a, b) => b.score - a.score);
  const delays  = [10000, 14000, 18000, 22000, 26000, 30000];

  ordered.forEach((installer, i) => {
    const delay = delays[i] ?? (30000 + (i - 5) * 4000);
    const t = setTimeout(() => {
      if (mkState.quoteRequests[installer.id]?.status === 'quoted') return;
      mkState.quoteRequests[installer.id] = { status: 'quoted', arrivedAt: Date.now() };
      mkState.quotesArrived.push(installer.id);
      if (!mkState.shortlist.includes(installer.id) && mkState.shortlist.length < 4) {
        mkState.shortlist.push(installer.id);
      }
      if (mkState.view === 'market') _onQuoteArrival(installer.id);
    }, delay);
    mkState.arrivalTimers.push(t);
  });
}

// Targeted DOM update — only rebuilds left column and bar, map stays untouched
function _onQuoteArrival(id) {
  const leftCol = document.getElementById('mk-left');
  const barWrap = document.getElementById('mk-bar-wrap');

  if (leftCol) {
    leftCol.innerHTML = buildLeftColumn();
    bindLeftColEvents(leftCol);
  }

  if (barWrap) {
    barWrap.innerHTML = shortlistBar();
    bindBarEvents(barWrap);
  }

  const marker = mkState.mapMarkers[id];
  if (marker) {
    const el = marker.getElement();
    el.classList.add('mk-pin--visible', 'mk-pin--arrive');
    el.addEventListener('animationend', () => el.classList.remove('mk-pin--arrive'), { once: true });
  }
}

// ── Main entry ────────────────────────────────────────────────────────────────
export function renderMarketplace(container, navigate) {
  if (!_rerendering) mkState.view = 'market';
  _container = container;
  _navigate  = navigate;

  if (mkState.view === 'storefront' && mkState.openId) { renderStorefront(container); return; }
  if (mkState.view === 'grid')                          { renderGrid(container); return; }
  renderMarketView(container);
}

// ── Market view ───────────────────────────────────────────────────────────────
function renderMarketView(container) {
  const st           = getState();
  const cityState    = st.location?.state;
  const scored       = withScores(INSTALLERS);
  const locationName = cityState || 'your area';

  container.innerHTML = `
    <div class="mk-page">
      <div class="mk-market-hdr">
        <div>
          <div class="mk-header-pill">LIVE QUOTES</div>
          <h1 class="mk-h1">Quotes for your home in ${locationName}</h1>
          <p class="mk-sub">Installers near you have received your request. Quotes will appear as they respond.</p>
        </div>
        <button class="btn--dark-outline" id="mk-grid-btn" style="font-size:12px;padding:8px 16px;white-space:nowrap;flex-shrink:0;align-self:flex-start;margin-top:4px">
          View all installers
        </button>
      </div>

      <div class="mk-two-col">
        <div class="mk-left-col" id="mk-left">${buildLeftColumn()}</div>
        <div class="mk-right-col">
          <div class="mk-right-inner" id="mk-right">${buildMap(scored)}</div>
        </div>
      </div>

      <div id="mk-bar-wrap">${shortlistBar()}</div>
    </div>
  `;

  bindLeftColEvents(container.querySelector('#mk-left'));
  bindBarEvents(container.querySelector('#mk-bar-wrap'));

  container.querySelector('#mk-grid-btn')?.addEventListener('click', () => { mkState.view = 'grid'; _rerender(); });

  // Initialise Mapbox map — markers are managed by the map from here on
  const mapContainer = container.querySelector('#mk-map-container');
  if (mapContainer) {
    const result = initMapboxMap({
      containerEl: mapContainer,
      cityState:   getState().location?.state,
      installers:  scored,
      arrivedIds:  mkState.quotesArrived,
      onPinClick:  id => openStorefront(id),
      onPinHover:  (id, entering) => { mkState.hovered = entering ? id : null; syncHover(); },
    });
    mkState.mapInstance = result.map;
    mkState.mapMarkers  = result.markers;
  }

  initQuoteArrivals();
}

// ── Left column ───────────────────────────────────────────────────────────────
function buildLeftColumn() {
  const arrived = mkState.quotesArrived;
  if (arrived.length === 0) {
    return `
      <div class="mk-quotes-empty">
        <div class="mk-quotes-spinner"></div>
        <p class="mk-quotes-placeholder">Quotes from nearby installers will appear here shortly</p>
      </div>
    `;
  }
  const scored = withScores(INSTALLERS);
  const cards  = [...arrived].reverse()
    .map(id => scored.find(i => i.id === id))
    .filter(Boolean)
    .map(it => quoteCard(it));
  return `<div class="mk-quotes-list">${cards.join('')}</div>`;
}

function bindLeftColEvents(col) {
  if (!col) return;
  const scored = withScores(INSTALLERS);

  col.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openStorefront(btn.dataset.open); });
  });
  col.querySelectorAll('[data-boq-card]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const it = scored.find(i => i.id === btn.dataset.boqCard);
      if (it) showBoQModal(it);
    });
  });
  col.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); toggleShortlist(btn.dataset.toggle); });
  });
  col.querySelectorAll('[data-card]').forEach(card => {
    card.addEventListener('mouseenter', () => { mkState.hovered = card.dataset.card; syncHover(); });
    card.addEventListener('mouseleave', () => { mkState.hovered = null; syncHover(); });
  });
}

// ── Quote card ────────────────────────────────────────────────────────────────
function quoteCard(it) {
  const district       = getCityData(getState().location?.state).installerAreas[it.id] || it.district;
  const inList         = mkState.shortlist.includes(it.id);
  const compareEnabled = mkState.quotesArrived.length >= 2;

  return `
    <div class="mk-qcard" data-card="${it.id}">
      <div class="mk-qcard-top">
        <div class="mk-logo-chip">${it.init}</div>
        <div class="mk-qcard-info">
          <div class="mk-qcard-name">
            ${it.name}
            <span class="mk-verified">Verified</span>
            ${it.badge ? `<span class="mk-badge mk-badge--${it.badgeKind}">${it.badge}</span>` : ''}
          </div>
          <div class="mk-qcard-meta">
            <span class="star">★</span> ${it.rating}
            <span class="mk-meta-sep">·</span>${it.reviews} reviews
            <span class="mk-meta-sep">·</span>${district}
            <span class="mk-meta-sep">·</span>${it.distance} km away
          </div>
        </div>
      </div>
      <div class="mk-tags">${it.tags.map(t => `<span class="mk-tag">${t}</span>`).join('')}</div>
      <div class="mk-qcard-footer">
        <div class="mk-qcard-price">
          <div class="mk-price-label">Your Quote</div>
          <div class="mk-price">${fmt(it.price)}</div>
        </div>
        <div class="mk-qcard-btns">
          <button class="btn--dark-outline btn--sm" data-open="${it.id}">View Installer</button>
          <button class="btn--dark-outline btn--sm" data-boq-card="${it.id}">View Quote</button>
          ${inList
            ? `<button class="btn--sm btn--added" data-toggle="${it.id}">
                <span class="btn-in-cmp-default">${TICK_SVG}In comparison</span>
                <span class="btn-in-cmp-remove">${REMOVE_SVG}Remove</span>
               </button>`
            : `<button class="btn--sm btn--amber" data-toggle="${it.id}" ${!compareEnabled ? 'disabled' : ''}>
                + Compare
               </button>`}
        </div>
      </div>
    </div>
  `;
}

// ── Shortlist bar ─────────────────────────────────────────────────────────────
function shortlistBar() {
  const sl = mkState.shortlist;
  if (sl.length === 0) return '';
  const scored = withScores(INSTALLERS);
  const items  = sl.map(id => scored.find(i => i.id === id)).filter(Boolean);
  const hint   = sl.length < 2 ? 'Add one more to compare' : sl.length >= 4 ? 'Maximum 4 quotes' : 'Ready to compare side by side';
  return `
    <div class="mk-bar" id="mk-bar">
      <div class="mk-bar-avatars">
        ${items.map(it => `<div class="mk-bar-avatar">${it.init}</div>`).join('')}
      </div>
      <div class="mk-bar-text">
        <div class="mk-bar-count">${sl.length} in comparison</div>
        <div class="mk-bar-hint">${hint}</div>
      </div>
      <div class="mk-bar-btns">
        <button class="mk-bar-clear" id="mk-bar-clear">Clear</button>
        <button class="mk-bar-compare" id="mk-bar-compare" ${sl.length < 2 ? 'disabled' : ''}>Compare quotes ${ARROW_R}</button>
      </div>
    </div>
  `;
}

function bindBarEvents(wrap) {
  if (!wrap) return;
  wrap.querySelector('#mk-bar-clear')?.addEventListener('click', () => { mkState.shortlist = []; _rerender(); });
  wrap.querySelector('#mk-bar-compare')?.addEventListener('click', () => _navigate('compare'));
}

// ── Map ───────────────────────────────────────────────────────────────────────
function buildMap(scored) {
  const cityState = getState().location?.state;
  const cityData  = getCityData(cityState);

  return `
    <div class="mk-map">
      <div id="mk-map-container" style="position:absolute;inset:0;border-radius:inherit;overflow:hidden"></div>
      <div class="mk-map-chip mk-map-chip--tl">
        <span class="live-dot"></span> Live installer map
      </div>
      <div class="mk-map-chip mk-map-chip--bl">${cityData.chip}</div>
    </div>
  `;
}

// ── Grid view ─────────────────────────────────────────────────────────────────
function renderGrid(container) {
  const scored    = withScores(INSTALLERS);
  const cityState = getState().location?.state;
  const cityData  = getCityData(cityState);
  const gf        = mkState.gridFilter;

  const allDistricts = [...new Set(scored.map(i => cityData.installerAreas[i.id] || i.district))].sort();

  let filtered = [...scored];
  if (gf.minRating > 0)      filtered = filtered.filter(i => i.rating >= gf.minRating);
  if (gf.district !== 'all') filtered = filtered.filter(i => (cityData.installerAreas[i.id] || i.district) === gf.district);

  if      (gf.sort === 'price')  filtered.sort((a, b) => a.price - b.price);
  else if (gf.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (gf.sort === 'jobs')   filtered.sort((a, b) => parseInt(b.jobs) - parseInt(a.jobs));
  else                           filtered.sort((a, b) => b.score - a.score);

  container.innerHTML = `
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="grid-back">
        ${ARROW_L}Back to quotes
      </button>
    </div>
    <div class="mk-grid-page">
      <div style="margin-bottom:20px">
        <div class="mk-header-pill">ALL INSTALLERS</div>
        <h1 class="mk-h1">All solar installers in ${cityState || 'your area'}</h1>
        <p class="mk-sub">Browse all ${scored.length} NNEL-verified installers. Click any card to view their full profile.</p>
      </div>

      <div class="mk-grid-filters">
        <select class="mk-filter-sel" id="gf-sort">
          <option value="score"  ${gf.sort === 'score'  ? 'selected' : ''}>Best value first</option>
          <option value="price"  ${gf.sort === 'price'  ? 'selected' : ''}>Lowest price first</option>
          <option value="rating" ${gf.sort === 'rating' ? 'selected' : ''}>Top rated first</option>
          <option value="jobs"   ${gf.sort === 'jobs'   ? 'selected' : ''}>Most installs first</option>
        </select>
        <select class="mk-filter-sel" id="gf-rating">
          <option value="0"   ${gf.minRating === 0   ? 'selected' : ''}>Any rating</option>
          <option value="4.5" ${gf.minRating === 4.5 ? 'selected' : ''}>4.5 stars and above</option>
          <option value="4.8" ${gf.minRating === 4.8 ? 'selected' : ''}>4.8 stars and above</option>
        </select>
        <select class="mk-filter-sel" id="gf-district">
          <option value="all">All areas</option>
          ${allDistricts.map(d => `<option value="${d}" ${gf.district === d ? 'selected' : ''}>${d}</option>`).join('')}
        </select>
        <span class="mk-grid-count">${filtered.length} of ${scored.length} installers</span>
      </div>

      <div class="mk-grid-cards">
        ${filtered.length
          ? filtered.map(it => gridCard(it, cityData)).join('')
          : `<div class="mk-grid-empty">No installers match your filters.</div>`}
      </div>
    </div>
    <div id="mk-bar-wrap">${shortlistBar()}</div>
  `;

  container.querySelector('#grid-back')?.addEventListener('click', () => { mkState.view = 'market'; _rerender(); });
  container.querySelector('#gf-sort')?.addEventListener('change',     e => { mkState.gridFilter.sort      = e.target.value;            _rerender(); });
  container.querySelector('#gf-rating')?.addEventListener('change',   e => { mkState.gridFilter.minRating = parseFloat(e.target.value); _rerender(); });
  container.querySelector('#gf-district')?.addEventListener('change', e => { mkState.gridFilter.district  = e.target.value;            _rerender(); });
  container.querySelectorAll('[data-grid-open]').forEach(card => {
    card.addEventListener('click', () => openStorefront(card.dataset.gridOpen));
  });
  bindBarEvents(container.querySelector('#mk-bar-wrap'));
}

function gridCard(it, cityData) {
  const district = cityData.installerAreas[it.id] || it.district;
  const hasQuote = mkState.quoteRequests[it.id]?.status === 'quoted';

  return `
    <div class="mk-grid-card" data-grid-open="${it.id}">
      <div class="mk-grid-card-top">
        <div class="mk-logo-chip">${it.init}</div>
        <div style="flex:1;min-width:0">
          <div class="mk-grid-card-name">
            ${it.name}
            ${it.badge ? `<span class="mk-badge mk-badge--${it.badgeKind}">${it.badge}</span>` : ''}
          </div>
          <div class="mk-grid-card-meta">★ ${it.rating} · ${it.reviews} reviews · ${district}</div>
        </div>
      </div>
      <div class="mk-grid-card-specs">
        <span>${it.jobs} installs</span>
        <span>·</span>
        <span>${it.distance} km away</span>
        <span>·</span>
        <span>${it.warranty} warranty</span>
      </div>
      <div class="mk-tags" style="margin:10px 0 12px">${it.tags.map(t => `<span class="mk-tag">${t}</span>`).join('')}</div>
      <div class="mk-grid-card-footer">
        <div>
          <div class="mk-price-label ${hasQuote ? 'mk-price-label--confirmed' : ''}">${hasQuote ? 'Your Quote' : 'Est. starting from'}</div>
          <div class="mk-price" style="font-size:17px">${fmt(it.price)}</div>
        </div>
        <span class="mk-grid-view-link">View profile ${ARROW_R}</span>
      </div>
    </div>
  `;
}

// ── Storefront view ───────────────────────────────────────────────────────────
function renderStorefront(container) {
  const scored      = withScores(INSTALLERS);
  const it          = scored.find(i => i.id === mkState.openId) || scored[0];
  const qr          = mkState.quoteRequests[it.id];
  const qStatus     = qr?.status ?? 'pending';
  const inList      = mkState.shortlist.includes(it.id);
  const avatarColors = ['#1F2937', '#3D6B7A', '#374151'];
  const st          = getState();
  const cityState   = st.location?.state || 'Abuja (FCT)';
  const cityDisplay = cityState.replace(/\s*\(FCT\)/i, '').trim();
  const sfDistrict  = getCityData(cityState).installerAreas[it.id] || it.district;
  const systemKwp   = st.results?.solar?.panel_kwp?.toFixed(2) ?? 'N/A';

  const galleryItems = [
    { title: '3kVA hybrid install',      sub: 'Maitama · Jan 2024',  grad: 'linear-gradient(135deg,#1e3a5f,#2d6a8f)', tilt: '-4deg' },
    { title: '8kVA + lithium bank',      sub: 'Gwarinpa · Mar 2024', grad: 'linear-gradient(135deg,#1a4731,#2d7a55)', tilt: '3deg' },
    { title: 'Rooftop array, 12 panels', sub: 'Asokoro · Feb 2024',  grad: 'linear-gradient(135deg,#2c3e50,#4a5568)', tilt: '-2deg' },
    { title: 'Whole-home backup',        sub: 'Wuse 2 · Apr 2024',   grad: 'linear-gradient(135deg,#0d2b1e,#1a4731)', tilt: '4deg' },
  ];

  let quoteSectionHtml;
  if (qStatus === 'quoted') {
    quoteSectionHtml = `
      <div class="sf-quote-panel">
        <div style="flex:1;min-width:0">
          <div class="sf-quote-label">Quote for your ${systemKwp} kWp system</div>
          <div class="sf-quote-price">${fmt(it.price)}</div>
          <div class="sf-quote-sub">Installed · ${it.timeline} timeline · ${it.warranty} warranty</div>
          <div class="sf-kit-grid">
            <div class="sf-kit-tile"><div class="label">Solar panels</div><div class="value">${it.panel}</div></div>
            <div class="sf-kit-tile"><div class="label">Battery</div><div class="value">${it.battery}</div></div>
            <div class="sf-kit-tile"><div class="label">Inverter</div><div class="value">${it.inverter}</div></div>
            <div class="sf-kit-tile"><div class="label">After-sales</div><div class="value">${it.aftercare}</div></div>
          </div>
        </div>
        <div style="flex-shrink:0;padding-top:4px;display:flex;flex-direction:column;gap:10px;align-items:flex-start">
          ${inList
            ? `<button class="btn--added" style="padding:13px 20px;font-size:13px" id="sf-toggle">
                <span class="btn-in-cmp-default">${TICK_SVG}In comparison</span>
                <span class="btn-in-cmp-remove">${REMOVE_SVG}Remove</span>
               </button>`
            : `<button class="btn--amber" style="padding:13px 20px;font-size:13px;display:inline-flex;align-items:center;gap:6px" id="sf-toggle">
                + Add to comparison
               </button>`}
          <button class="btn--dark-outline" style="font-size:12px;padding:9px 16px;white-space:nowrap" id="sf-boq-btn">View BoQ</button>
        </div>
      </div>`;
  } else {
    quoteSectionHtml = `
      <div class="sf-quote-panel sf-quote-panel--pending">
        <div class="sf-pending-spinner"></div>
        <div>
          <div class="sf-quote-label">Your quote is being prepared</div>
          <p style="font-size:13px;color:var(--color-text-muted);margin:6px 0 0">We have sent your energy profile to ${it.name}. Your personalised quote will appear here shortly.</p>
        </div>
      </div>`;
  }

  container.innerHTML = `
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="sf-back">${ARROW_L}Back to installers</button>
    </div>
    <div class="sf-page">
      <div class="sf-card">
        <div class="sf-header">
          <div class="sf-header-top">
            <div class="mk-logo-chip mk-logo-chip--lg">${it.init}</div>
            <div>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px">
                <h1 style="margin:0;font-size:clamp(20px,3vw,28px);font-weight:800;color:#fff">${it.name}</h1>
                <span class="mk-verified" style="font-size:11px;background:rgba(255,255,255,.18);color:rgba(255,255,255,.9);border:1px solid rgba(255,255,255,.3)">Verified</span>
              </div>
              <div class="sf-header-meta">
                <span class="accent">★ ${it.rating}</span>
                <span>${it.reviews} reviews</span>
                <span>·</span><span>${sfDistrict}, ${cityDisplay}</span>
                <span>·</span><span>${it.distance} km from you</span>
              </div>
            </div>
          </div>
          <p class="sf-about">${it.about}</p>
          <div class="sf-stats">
            <div class="sf-stat-chip"><div class="label">Jobs completed</div><div class="value">${it.jobs}</div></div>
            <div class="sf-stat-chip"><div class="label">Years in business</div><div class="value">${it.years}</div></div>
            <div class="sf-stat-chip"><div class="label">Repeat customers</div><div class="value">${it.repeat}</div></div>
            <div class="sf-stat-chip"><div class="label">Avg. response</div><div class="value">${it.response}</div></div>
          </div>
        </div>

        <div class="sf-body">
          ${quoteSectionHtml}

          <div class="section-title" style="margin-bottom:12px;margin-top:28px">Recent installs</div>
          <div class="sf-gallery" style="margin-bottom:28px">
            ${galleryItems.map(g => `
              <div class="sf-gallery-card">
                <div class="sf-gallery-img" style="background:${g.grad}">
                  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:120px">
                    <div style="width:80%;height:55%;background:repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 20px),${g.grad};transform:rotateX(34deg) rotate(${g.tilt});border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.3)"></div>
                  </div>
                </div>
                <div class="sf-gallery-caption">
                  <div class="sf-cap-title">${g.title}</div>
                  <div class="sf-cap-sub">${g.sub}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px">
            <div class="section-title" style="margin-bottom:0">What homeowners say</div>
            <span style="font-size:13px;color:var(--color-text-secondary)">★ ${it.rating} average</span>
          </div>
          <div class="sf-reviews">
            ${it.reviews_l.map((r, i) => `
              <div class="sf-review-card">
                <div class="sf-review-top">
                  <div style="display:flex;align-items:center;gap:10px">
                    <div class="sf-review-avatar" style="background:${avatarColors[i % 3]}">${r.name[0]}</div>
                    <div>
                      <div class="sf-review-name">${r.name}</div>
                      <div class="sf-review-area">${r.area} · ${r.date}</div>
                    </div>
                  </div>
                  <div class="sf-review-stars">${'★'.repeat(r.stars)}</div>
                </div>
                <div class="sf-review-text">${r.text}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#sf-back')?.addEventListener('click', () => {
    mkState.view = 'market'; _rerender(); requestAnimationFrame(scrollToTop);
  });
  container.querySelector('#sf-toggle')?.addEventListener('click', () => toggleShortlist(it.id));
  container.querySelector('#sf-boq-btn')?.addEventListener('click', () => showBoQModal(it));
}
