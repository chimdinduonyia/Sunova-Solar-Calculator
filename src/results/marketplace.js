import { INSTALLERS, withScores, BADGE_COLORS, fmt, fmtM } from '../data/installers.js';

// ── Module-level state (shared with compareQuotes.js via exports) ──
export const mkState = {
  view:      'market',   // 'market' | 'storefront'
  openId:    null,
  shortlist: ['auxano', 'arnergy'],
  sortMode:  'value',
  hovered:   null,
};

let _container = null;
let _navigate  = null;

export function getShortlist() { return mkState.shortlist; }
export function toggleShortlist(id) {
  const idx = mkState.shortlist.indexOf(id);
  if (idx >= 0) {
    mkState.shortlist.splice(idx, 1);
  } else {
    mkState.shortlist = [...mkState.shortlist.slice(-3), id];
  }
  _rerender();
}

function _rerender() {
  if (_container && _navigate) renderMarketplace(_container, _navigate);
}

// ── Main entry ──────────────────────────────────────────────────────────────
export function renderMarketplace(container, navigate) {
  _container = container;
  _navigate  = navigate;

  if (mkState.view === 'storefront' && mkState.openId) {
    renderStorefront(container);
  } else {
    mkState.view = 'market';
    renderMarket(container);
  }
}

// ── Market view ─────────────────────────────────────────────────────────────
function renderMarket(container) {
  const scored  = withScores(INSTALLERS);
  const sorted  = sortedList(scored);

  container.innerHTML = `
    <div class="mk-page">
      <div class="mk-header-row">
        <div>
          <div class="mk-header-pill"><span></span>6 VERIFIED INSTALLERS NEAR YOU</div>
          <h1 class="mk-h1">Verified Solar Installers in Abuja</h1>
          <p class="mk-sub">Showing quotes for your <strong>7.02 kWp</strong> system from 6 pre-screened, NNEL-verified solar installers serving Abuja FCT.</p>
        </div>
        <div class="mk-sort" id="mk-sort">
          ${['value','distance','rating'].map(m => `
            <button class="mk-sort-btn ${mkState.sortMode === m ? 'active' : ''}" data-sort="${m}">
              ${m === 'value' ? 'Best value' : m === 'distance' ? 'Nearest' : 'Top rated'}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="mk-grid">
        <div class="mk-list-col" id="mk-list">
          ${sorted.map(it => installerCard(it)).join('')}
        </div>
        <div class="mk-map-col">
          ${buildMap(scored)}
        </div>
      </div>
    </div>
    ${shortlistBar()}
  `;

  // Sort buttons
  container.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      mkState.sortMode = btn.dataset.sort;
      _rerender();
    });
  });

  // Installer card buttons
  container.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openStorefront(btn.dataset.open);
    });
  });
  container.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleShortlist(btn.dataset.toggle);
    });
  });

  // Card hover → sync map pin
  container.querySelectorAll('[data-card]').forEach(card => {
    card.addEventListener('mouseenter', () => { mkState.hovered = card.dataset.card; syncHover(); });
    card.addEventListener('mouseleave', () => { mkState.hovered = null; syncHover(); });
  });

  // Map pin hover → sync card
  container.querySelectorAll('[data-pin]').forEach(pin => {
    pin.addEventListener('mouseenter', () => { mkState.hovered = pin.dataset.pin; syncHover(); });
    pin.addEventListener('mouseleave', () => { mkState.hovered = null; syncHover(); });
    pin.addEventListener('click', () => openStorefront(pin.dataset.pin));
  });

  // Shortlist bar buttons
  container.querySelector('#mk-bar-clear')?.addEventListener('click', () => {
    mkState.shortlist = [];
    _rerender();
  });
  container.querySelector('#mk-bar-compare')?.addEventListener('click', () => {
    _navigate('compare');
  });
}

function syncHover() {
  document.querySelectorAll('[data-card]').forEach(el => el.classList.toggle('hovered', el.dataset.card === mkState.hovered));
  document.querySelectorAll('[data-pin]').forEach(el => el.classList.toggle('hovered', el.dataset.pin === mkState.hovered));
}

function sortedList(scored) {
  const list = [...scored];
  if (mkState.sortMode === 'distance') return list.sort((a, b) => a.distance - b.distance);
  if (mkState.sortMode === 'rating')   return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  return list.sort((a, b) => b.score - a.score);
}

function installerCard(it) {
  const inList = mkState.shortlist.includes(it.id);
  const bc = BADGE_COLORS[it.badgeKind] || BADGE_COLORS[''];
  return `
    <div class="mk-card ${mkState.hovered === it.id ? 'hovered' : ''}" data-card="${it.id}">
      <div class="mk-card-top">
        <div class="mk-logo-chip">${it.init}</div>
        <div class="mk-name">${it.name}</div>
        <span class="mk-verified">Verified</span>
        ${it.badge ? `<span class="mk-badge" style="background:${bc.bg};color:${bc.text};border:1px solid ${bc.border}">${it.badge}</span>` : ''}
      </div>
      <div class="mk-meta">
        <span>${it.district}</span>
        <span>·</span>
        <span>${it.distance} km away</span>
        <span>·</span>
        <span class="mk-rating-pill"><span class="star">★</span> ${it.rating} · ${it.reviews} reviews</span>
      </div>
      <div class="mk-tags">${it.tags.map(t => `<span class="mk-tag">${t}</span>`).join('')}</div>
      <div class="mk-card-footer">
        <div>
          <div class="mk-price-label">Estimated quote</div>
          <div class="mk-price">${fmt(it.price)}</div>
        </div>
        <div class="mk-card-btns">
          <button class="btn--dark-outline" data-open="${it.id}">View storefront</button>
          <button class="${inList ? 'btn--added' : 'btn--amber'}" data-toggle="${it.id}">
            ${inList ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function buildMap(scored) {
  const districts = [
    { label: 'Maitama',  x: 60, y: 26 },
    { label: 'Wuse 2',   x: 36, y: 32 },
    { label: 'Asokoro',  x: 74, y: 40 },
    { label: 'Garki',    x: 54, y: 74 },
    { label: 'Jabi',     x: 24, y: 52 },
    { label: 'Gwarinpa', x: 18, y: 16 },
    { label: 'Utako',    x: 74, y: 62 },
    { label: 'Life Camp', x: 40, y: 78 },
  ];

  return `
    <div class="mk-map">
      <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="600" fill="#FFFDF0"/>
        <ellipse cx="300" cy="480" rx="380" ry="200" fill="#FEF6CC" opacity=".6"/>
        <!-- Roads -->
        <line x1="0" y1="440" x2="600" y2="160" stroke="white" stroke-width="13" opacity=".8"/>
        <line x1="140" y1="600" x2="460" y2="0"  stroke="white" stroke-width="10" opacity=".75"/>
        <line x1="0"   y1="200" x2="600" y2="200" stroke="white" stroke-width="8"  opacity=".7"/>
        <line x1="0"   y1="300" x2="600" y2="300" stroke="white" stroke-width="6"  opacity=".6"/>
        <line x1="200" y1="0"   x2="200" y2="600" stroke="white" stroke-width="8"  opacity=".7"/>
        <line x1="400" y1="0"   x2="400" y2="600" stroke="white" stroke-width="6"  opacity=".6"/>
        <line x1="0"   y1="400" x2="300" y2="100" stroke="white" stroke-width="7"  opacity=".65"/>
        <!-- Radius ring -->
        <circle cx="288" cy="300" r="180" fill="none" stroke="#FCBF1E" stroke-width="1.5" stroke-dasharray="4 10" opacity=".4"/>
      </svg>

      <!-- District labels -->
      ${districts.map(d => `<div class="mk-district" style="left:${d.x}%;top:${d.y}%">${d.label}</div>`).join('')}

      <!-- Installer pins -->
      ${scored.map(it => `
        <div class="mk-pin ${mkState.hovered === it.id ? 'hovered' : ''}" data-pin="${it.id}"
             style="left:${it.mapX}%;top:${it.mapY}%">
          <div class="mk-pin-tag">
            <span class="mk-pin-init">${it.init}</span>
            ${fmtM(it.price)}
          </div>
          <div class="mk-pin-stem"></div>
        </div>
      `).join('')}

      <!-- User pin -->
      <div class="mk-user-pin">
        <div class="mk-user-dot">
          <div class="mk-user-halo"></div>
        </div>
        <div class="mk-user-label">Your home</div>
      </div>

      <!-- Map overlay chips -->
      <div class="mk-map-chip mk-map-chip--tl">
        <span class="live-dot"></span> Live installer map
      </div>
      <div class="mk-map-chip mk-map-chip--bl">Abuja (FCT) · ~8km radius</div>
    </div>
  `;
}

function shortlistBar() {
  const sl = mkState.shortlist;
  if (sl.length === 0) return '';
  const scored = withScores(INSTALLERS);
  const items = sl.map(id => scored.find(i => i.id === id)).filter(Boolean);
  const hint = sl.length < 2 ? 'Add one more to compare side by side' : 'Ready to compare side by side';
  return `
    <div class="mk-bar" id="mk-bar">
      <div class="mk-bar-avatars">
        ${items.slice(0, 3).map(it => `<div class="mk-bar-avatar">${it.init}</div>`).join('')}
      </div>
      <div class="mk-bar-text">
        <div class="mk-bar-count">${sl.length} in comparison</div>
        <div class="mk-bar-hint">${hint}</div>
      </div>
      <div class="mk-bar-btns">
        <button class="mk-bar-clear" id="mk-bar-clear">Clear</button>
        <button class="mk-bar-compare" id="mk-bar-compare">Compare quotes</button>
      </div>
    </div>
  `;
}

function openStorefront(id) {
  mkState.view   = 'storefront';
  mkState.openId = id;
  _rerender();
}

// ── Storefront view ──────────────────────────────────────────────────────────
function renderStorefront(container) {
  const scored = withScores(INSTALLERS);
  const it = scored.find(i => i.id === mkState.openId) || scored[0];
  const inList = mkState.shortlist.includes(it.id);
  const avatarColors = ['#1F2937', '#3D6B7A', '#374151'];

  const galleryItems = [
    { title: '3kVA hybrid install',       sub: 'Maitama · Jan 2024',     grad: 'linear-gradient(135deg,#1e3a5f,#2d6a8f)', tilt: '-4deg' },
    { title: '8kVA + lithium bank',        sub: 'Gwarinpa · Mar 2024',    grad: 'linear-gradient(135deg,#1a4731,#2d7a55)', tilt: '3deg' },
    { title: 'Rooftop array, 12 panels',  sub: 'Asokoro · Feb 2024',     grad: 'linear-gradient(135deg,#2c3e50,#4a5568)', tilt: '-2deg' },
    { title: 'Whole-home backup',         sub: 'Wuse 2 · Apr 2024',      grad: 'linear-gradient(135deg,#0d2b1e,#1a4731)', tilt: '4deg' },
  ];

  container.innerHTML = `
    <div class="sf-page">
      <button class="btn--dark-outline" style="margin-bottom:16px;font-size:12px;padding:7px 14px" id="sf-back">← Back to installers</button>
      <div class="sf-card">

        <!-- Header -->
        <div class="sf-header">
          <div class="sf-header-top">
            <div class="mk-logo-chip mk-logo-chip--lg">${it.init}</div>
            <div>
              <h1>${it.name} <span class="mk-verified" style="font-size:11px;vertical-align:middle">Verified</span></h1>
              <div class="sf-header-meta">
                <span class="accent">★ ${it.rating}</span>
                <span>${it.reviews} reviews</span>
                <span>·</span><span>${it.district}, Abuja</span>
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

        <!-- Body -->
        <div class="sf-body">
          <div class="sf-quote-panel">
            <div>
              <div class="sf-quote-label">Their quote for your 7.02 kWp system</div>
              <div class="sf-quote-price">${fmt(it.price)}</div>
              <div class="sf-quote-sub">Installed · ${it.timeline} timeline · ${it.warranty} warranty</div>
              <div class="sf-kit-grid" style="margin-top:14px">
                <div class="sf-kit-tile"><div class="label">Solar panels</div><div class="value">${it.panel}</div></div>
                <div class="sf-kit-tile"><div class="label">Battery</div><div class="value">${it.battery}</div></div>
                <div class="sf-kit-tile"><div class="label">Inverter</div><div class="value">${it.inverter}</div></div>
                <div class="sf-kit-tile"><div class="label">After-sales</div><div class="value">${it.aftercare}</div></div>
              </div>
            </div>
            <div style="flex-shrink:0">
              <button class="${inList ? 'btn--added' : 'btn--amber'}" style="padding:13px 20px;font-size:13px" id="sf-toggle">
                ${inList ? '✓ In comparison' : '+ Add to comparison'}
              </button>
            </div>
          </div>

          <!-- Gallery -->
          <div class="section-title" style="margin-bottom:12px">Recent installs</div>
          <div class="sf-gallery" style="margin-bottom:28px">
            ${galleryItems.map((g, i) => `
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

          <!-- Reviews -->
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

  container.querySelector('#sf-back').addEventListener('click', () => {
    mkState.view = 'market';
    _rerender();
  });
  container.querySelector('#sf-toggle').addEventListener('click', () => toggleShortlist(it.id));
}
