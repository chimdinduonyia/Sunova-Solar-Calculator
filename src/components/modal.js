export function openModal(html) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-overlay" id="modal-overlay">${html}</div>`;

  root.querySelector('#modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.addEventListener('keydown', onEsc);
}

export function closeModal() {
  const root = document.getElementById('modal-root');
  root.innerHTML = '';
  document.removeEventListener('keydown', onEsc);
}

function onEsc(e) {
  if (e.key === 'Escape') closeModal();
}

export function modalHtml({ title, subtitle = '', body, footer }) {
  return `
    <div class="modal">
      <div class="modal__header">
        <div>
          <div class="modal__title">${title}</div>
          ${subtitle ? `<div class="modal__subtitle">${subtitle}</div>` : ''}
        </div>
        <button class="modal__close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal__body">${body}</div>
      ${footer ? `<div class="modal__footer">${footer}</div>` : ''}
    </div>
  `;
}

export function bindModalClose() {
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
}
