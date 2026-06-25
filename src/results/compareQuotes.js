import { INSTALLERS, withScores, BADGE_COLORS, fmt } from '../data/installers.js';
import { mkState, toggleShortlist } from './marketplace.js';

const ROW_DEFS = [
  { label: 'Total quote',   key: 'price',     render: (it)     => fmt(it.price),                      bestFn: items => items.reduce((b,i) => i.price < b.price ? i : b) ,   bestTag: 'Lowest' },
  { label: 'Value score',   key: 'score',     render: (it)     => `<strong>${it.score}/100</strong>`,  bestFn: items => items.reduce((b,i) => i.score > b.score ? i : b),     bestTag: 'Top' },
  { label: 'Warranty',      key: 'warranty',  render: (it)     => it.warranty,                         bestFn: items => items.reduce((b,i) => i.warrantyScore > b.warrantyScore ? i : b), bestTag: 'Longest' },
  { label: 'Install time',  key: 'timeline',  render: (it)     => it.timeline,                         bestFn: null },
  { label: 'Solar panels',  key: 'panel',     render: (it)     => it.panel,                            bestFn: null },
  { label: 'Battery',       key: 'battery',   render: (it)     => it.battery,                          bestFn: null },
  { label: 'Inverter',      key: 'inverter',  render: (it)     => it.inverter,                         bestFn: null },
  { label: 'After-sales',   key: 'aftercare', render: (it)     => it.aftercare,                        bestFn: null },
  { label: 'Rating',        key: 'rating',    render: (it)     => `★ ${it.rating} (${it.reviews})`,   bestFn: items => items.reduce((b,i) => i.rating > b.rating ? i : b),    bestTag: 'Best' },
  { label: 'Financing',     key: 'financing', render: (it)     => it.financing,                        bestFn: null },
];

let _container = null;
let _navigate  = null;

export function renderCompareQuotes(container, navigate) {
  _container = container;
  _navigate  = navigate;
  _render();
}

function _render() {
  const scored = withScores(INSTALLERS);
  const sl = mkState.shortlist;

  // If shortlist empty, use the top installer as sole column
  const cmpIds  = sl.length > 0 ? sl : [scored.sort((a,b) => b.score - a.score)[0].id];
  const cmpData = cmpIds.map(id => scored.find(i => i.id === id)).filter(Boolean);

  // Best among compared set
  const cmpBestId = cmpData.reduce((b, i) => i.score > b.score ? i : b, cmpData[0])?.id;

  // Global best for the banner
  const allScored = withScores(INSTALLERS).sort((a,b) => b.score - a.score);
  const globalBest = allScored[0];

  // Installers not yet in comparison (for add-column dropdown)
  const available = scored.filter(i => !cmpIds.includes(i.id));
  const canAdd    = cmpData.length < 4 && available.length > 0;

  const title = cmpData.length > 1
    ? `Comparing ${cmpData.length} quotes for your home`
    : 'Add installers to compare';

  _container.innerHTML = `
    <div class="cq-page">
      <div style="margin-bottom:20px">
        <div class="mk-header-pill"><span style="width:6px;height:6px;border-radius:50%;background:var(--color-primary);display:inline-block"></span>QUOTE COMPARISON</div>
        <h1 class="mk-h1">${title}</h1>
        <p class="mk-sub">Our value score weights price 40%, warranty &amp; kit 30%, install speed 15%, and customer ratings 15%.</p>
      </div>

      <!-- Best-value banner -->
      <div class="cq-banner">
        <div class="cq-banner-left">
          <div class="mk-logo-chip" style="background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);color:#fff;font-size:14px">${globalBest.init}</div>
          <div>
            <div class="cq-banner-label">Best overall value</div>
            <div class="cq-banner-name">${globalBest.name}</div>
            <div class="cq-banner-why">${globalBest.warranty} warranty · ★ ${globalBest.rating} from ${globalBest.reviews} reviews · ${globalBest.timeline}</div>
          </div>
        </div>
        <div class="cq-banner-right">
          <div class="cq-banner-price">${fmt(globalBest.price)}</div>
          <div class="cq-banner-score">Value score ${globalBest.score}/100</div>
        </div>
      </div>

      <!-- Table -->
      <div class="cq-table-wrap">
        <table class="cq-table">
          <thead>
            <tr>
              <th class="cq-col-label" style="font-size:13px;font-weight:700;color:var(--color-text)">Compare</th>
              ${cmpData.map(it => `
                <th class="cq-th ${it.id === cmpBestId ? 'cq-th--best' : ''}">
                  <div class="cq-th-logo">${it.init}</div>
                  <div class="cq-th-name">${it.name}</div>
                  <div class="cq-th-district">${it.district}</div>
                  ${it.id === cmpBestId ? '<div class="cq-best-chip">★ BEST VALUE</div>' : ''}
                  <button class="cq-remove-btn" data-remove="${it.id}">Remove</button>
                </th>
              `).join('')}
              ${canAdd ? `
                <th class="cq-th-add">
                  <div class="cq-add-box" id="cq-add-box">
                    <div style="font-size:20px;color:var(--color-text-muted)">+</div>
                    <div class="cq-add-label">Add installer</div>
                    <div class="cq-add-dropdown" id="cq-add-dropdown" style="display:none">
                      ${available.map(i => `
                        <div class="cq-add-option" data-add="${i.id}">
                          <div class="cq-th-logo" style="width:28px;height:28px;font-size:10px;margin-bottom:0">${i.init}</div>
                          <span style="font-size:13px">${i.name}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </th>
              ` : ''}
            </tr>
          </thead>
          <tbody>
            ${ROW_DEFS.map((row, ri) => `
              <tr>
                <td class="cq-col-label" style="background:${ri % 2 === 0 ? '#FCFDFC' : '#fff'}">${row.label}</td>
                ${cmpData.map(it => {
                  const isBest = row.bestFn && row.bestFn(cmpData)?.id === it.id;
                  const cellClass = `cq-td ${it.id === cmpBestId ? 'cq-td--best' : ''}`;
                  return `<td class="${cellClass}" style="background:${ri % 2 === 0 ? (it.id === cmpBestId ? 'rgba(255,248,214,.55)' : '#FCFDFC') : (it.id === cmpBestId ? 'rgba(255,248,214,.4)' : '#fff')}">
                    <span ${isBest ? 'class="cq-td--green"' : ''}>${row.render(it)}</span>
                    ${isBest ? `<span class="cq-best-tag">${row.bestTag}</span>` : ''}
                  </td>`;
                }).join('')}
                ${canAdd ? `<td class="cq-td"></td>` : ''}
              </tr>
            `).join('')}
            <tr>
              <td class="cq-col-label cq-td-footer">Proceed with</td>
              ${cmpData.map(it => `
                <td class="cq-td-footer ${it.id === cmpBestId ? 'cq-td--best' : ''}">
                  <button class="cq-finance-btn ${it.id === cmpBestId ? 'best' : ''}" data-finance="${it.id}">Finance this</button>
                </td>
              `).join('')}
              ${canAdd ? `<td class="cq-td-footer"></td>` : ''}
            </tr>
          </tbody>
        </table>
      </div>
      <p class="cq-footnote">Value score methodology: price 40% · warranty &amp; kit quality 30% · installation speed 15% · customer ratings 15%. Scores are relative to the 6 installers in this marketplace.</p>

      <div style="margin-top:16px">
        <button class="btn--dark-outline" id="cq-back" style="font-size:12px;padding:8px 16px">← Back to installers</button>
      </div>
    </div>
  `;

  // Remove button
  _container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => { toggleShortlist(btn.dataset.remove); _render(); });
  });

  // Add dropdown
  const addBox = _container.querySelector('#cq-add-box');
  const addDrop = _container.querySelector('#cq-add-dropdown');
  if (addBox && addDrop) {
    addBox.addEventListener('click', e => {
      e.stopPropagation();
      addDrop.style.display = addDrop.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => { if (addDrop) addDrop.style.display = 'none'; }, { once: true });
    _container.querySelectorAll('[data-add]').forEach(opt => {
      opt.addEventListener('click', e => { e.stopPropagation(); toggleShortlist(opt.dataset.add); _render(); });
    });
  }

  // Finance buttons
  _container.querySelectorAll('[data-finance]').forEach(btn => {
    btn.addEventListener('click', () => _navigate('financing'));
  });

  // Back
  _container.querySelector('#cq-back')?.addEventListener('click', () => _navigate('market'));
}
