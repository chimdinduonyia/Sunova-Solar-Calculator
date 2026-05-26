export function renderRadioCards({ cards, selected, name }) {
  return `
    <div class="radio-cards" data-radio-group="${name}">
      ${cards.map(card => `
        <div class="radio-card ${selected === card.id ? 'selected' : ''}" data-value="${card.id}">
          <div class="radio-card__radio"></div>
          <div class="radio-card__img-placeholder">${card.emoji || '⚡'}</div>
          <div class="radio-card__content">
            ${card.label ? `<div class="radio-card__label">${card.label}</div>` : ''}
            <div class="radio-card__name">${card.name}</div>
            ${card.desc ? `<div class="radio-card__desc">${card.desc}</div>` : ''}
            ${card.extra || ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function bindRadioCards(groupName, onChange) {
  const group = document.querySelector(`[data-radio-group="${groupName}"]`);
  if (!group) return;

  group.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      group.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      if (onChange) onChange(card.dataset.value);
    });
  });
}
