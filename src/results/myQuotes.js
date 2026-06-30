import { INSTALLERS, withScores, fmt } from '../data/installers.js';
import { mkState, unsaveQuote, showBoQModal } from './marketplace.js';
import { setFinancingInstaller } from './financing.js';

const ARROW_R = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-left:5px"><polyline points="5,2 10,7 5,12"/></svg>`;
const ARROW_L = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>`;
const TICK    = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:4px"><polyline points="1,6 4,10 11,2"/></svg>`;

const CANNED_RESPONSES = [
  'Great question! We can certainly discuss that in more detail during the site survey.',
  'Yes, all our installations come with a dedicated after-sales team. We aim to respond within 24 hours.',
  'Our panels carry a 25-year performance guarantee. The inverter warranty is included in the quote.',
  'We can usually start installation within 2 weeks of down payment confirmation.',
  "Absolutely — we're open to discussing the scope depending on your specific situation.",
  'Our team has handled over 200 residential installations in your area. Happy to share references.',
];

let _container = null;
let _navigate  = null;

export function renderMyQuotes(container, navigate) {
  _container = container;
  _navigate  = navigate;
  _render();
}

function _render() {
  const scored    = withScores(INSTALLERS);
  const savedIds  = mkState.savedQuotes;
  const finId     = mkState.financedQuoteId;

  if (savedIds.length === 0) {
    _container.innerHTML = `
      <div class="mq-page">
        <h1 class="mk-h1">My Quotes</h1>
        <div class="mq-empty">
          <div style="font-size:52px">📋</div>
          <div class="mq-empty-title">No saved quotes yet</div>
          <p class="mq-empty-sub">Head to <strong>Compare Quotes</strong> and tap "Save Quote" on the ones you like.</p>
          <button class="btn btn--primary" style="margin-top:20px" id="mq-go-compare">Go to Compare Quotes</button>
        </div>
      </div>
    `;
    _container.querySelector('#mq-go-compare')?.addEventListener('click', () => _navigate('compare'));
    return;
  }

  const saved = savedIds.map(id => scored.find(i => i.id === id)).filter(Boolean);

  _container.innerHTML = `
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="mq-back">${ARROW_L}Back to installers</button>
    </div>
    <div class="mq-page">
      <h1 class="mk-h1">My Quotes</h1>
      <p class="mk-sub">Review your saved quotes, chat with each installer, then choose one to finance.</p>

      ${finId ? `
        <div class="mq-financed-notice">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><polyline points="2,9 6,13 14,3"/></svg>
          You've applied to finance a quote. Financing is locked to that selection.
        </div>
      ` : ''}

      <div class="mq-list">
        ${saved.map(inst => {
          const isFinanced = finId === inst.id;
          const isLocked   = !!finId && !isFinanced;
          return `
            <div class="mq-card ${isFinanced ? 'mq-card--financed' : ''}">
              <div class="mq-card-header">
                <div class="mq-card-info">
                  <div class="mk-logo-chip" style="width:40px;height:40px;font-size:14px;flex-shrink:0">${inst.init}</div>
                  <div>
                    <div class="mq-card-name">${inst.name}</div>
                    <div class="mq-card-sub">${inst.warranty} warranty &nbsp;·&nbsp; ★ ${inst.rating} (${inst.reviews}) &nbsp;·&nbsp; ${inst.district}</div>
                    <div class="mq-card-sub" style="margin-top:3px">${inst.timeline} timeline &nbsp;·&nbsp; ${inst.financing}</div>
                  </div>
                </div>
                <div class="mq-card-price">${fmt(inst.price)}</div>
              </div>
              <div class="mq-card-actions">
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button class="mq-chat-btn" data-chat="${inst.id}">💬 Chat with Installer</button>
                  <button class="mq-view-btn" data-view="${inst.id}">View Quote</button>
                </div>
                <div style="display:flex;gap:8px;align-items:center">
                  ${isFinanced
                    ? `<button class="mq-finance-btn mq-finance-btn--done" disabled>${TICK} Financing Applied</button>`
                    : isLocked
                    ? `<button class="mq-finance-btn mq-finance-btn--locked" disabled>Financing Locked</button>`
                    : `<button class="mq-finance-btn" data-finance="${inst.id}">Finance this quote ${ARROW_R}</button>`
                  }
                  ${!finId ? `<button class="mq-remove-btn" data-unsave="${inst.id}" title="Remove">✕</button>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  _container.querySelector('#mq-back')?.addEventListener('click', () => _navigate('market'));

  _container.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inst = saved.find(i => i.id === btn.dataset.view);
      if (inst) showBoQModal(inst);
    });
  });

  _container.querySelectorAll('[data-chat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inst = saved.find(i => i.id === btn.dataset.chat);
      if (inst) showChatModal(inst);
    });
  });

  _container.querySelectorAll('[data-finance]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inst = saved.find(i => i.id === btn.dataset.finance);
      if (inst) { setFinancingInstaller(inst); _navigate('financing'); }
    });
  });

  _container.querySelectorAll('[data-unsave]').forEach(btn => {
    btn.addEventListener('click', () => { unsaveQuote(btn.dataset.unsave); _render(); });
  });
}

function showChatModal(inst) {
  document.getElementById('mq-chat-overlay')?.remove();

  let responseIdx = 0;
  const overlay = document.createElement('div');
  overlay.id        = 'mq-chat-overlay';
  overlay.className = 'mq-chat-overlay';
  overlay.innerHTML = `
    <div class="mq-chat-modal">
      <div class="mq-chat-header">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="mk-logo-chip" style="width:34px;height:34px;font-size:11px;flex-shrink:0">${inst.init}</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#111827">${inst.name}</div>
            <div style="font-size:11px;color:#6B7280;display:flex;align-items:center;gap:5px">
              <span style="width:7px;height:7px;border-radius:50%;background:#22C55E;display:inline-block"></span>Online now
            </div>
          </div>
        </div>
        <button class="mq-chat-close" id="mq-chat-close">✕</button>
      </div>
      <div class="mq-chat-body" id="mq-chat-body">
        <div class="mq-chat-bubble mq-chat-bubble--them">
          Hi! Thanks for your interest in our quote. We've reviewed your energy profile and are happy to walk you through the details. What would you like to know?
        </div>
        <div class="mq-chat-bubble mq-chat-bubble--them">
          We can also discuss installation timelines, warranty terms, or adjust the scope if needed.
        </div>
        <div class="mq-typing-indicator" id="mq-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="mq-chat-input-row">
        <input class="mq-chat-input" id="mq-chat-input" type="text" placeholder="Type a message…" autocomplete="off">
        <button class="mq-chat-send" id="mq-chat-send">Send</button>
      </div>
      <div class="mq-chat-disclaimer">For demo purposes only. Messages are not sent to the installer.</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const body   = overlay.querySelector('#mq-chat-body');
  const input  = overlay.querySelector('#mq-chat-input');
  const typing = overlay.querySelector('#mq-typing');

  overlay.querySelector('#mq-chat-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  function send() {
    const text = input.value.trim();
    if (!text) return;
    const userBubble = document.createElement('div');
    userBubble.className   = 'mq-chat-bubble mq-chat-bubble--me';
    userBubble.textContent = text;
    body.insertBefore(userBubble, typing);
    input.value = '';
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className   = 'mq-chat-bubble mq-chat-bubble--them';
      reply.textContent = CANNED_RESPONSES[responseIdx++ % CANNED_RESPONSES.length];
      body.insertBefore(reply, typing);
      body.scrollTop = body.scrollHeight;
    }, 900 + Math.random() * 600);
  }

  overlay.querySelector('#mq-chat-send').addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  setTimeout(() => input.focus(), 80);
}
