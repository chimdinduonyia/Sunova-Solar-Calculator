const ICONS = [
  // Sun: location
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  // Lightning bolt: energy source & spend
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.09 12.33A1 1 0 005 14h7l-1 8 8.91-10.33A1 1 0 0019 10h-7l1-8z"/></svg>`,
  // Arrow hitting target: goals
  `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><circle cx="11" cy="11" r="4"/><line x1="21" y1="3" x2="14.35" y2="9.65"/><polyline points="17,3 21,3 21,7"/></svg>`
];

const STEP_GROUPS  = [[1], [2], [3]];
const GROUP_TARGET = ['step1', 'step2', 'step3'];

export function renderProgressBar(currentStep) {
  const progressGroup = STEP_GROUPS.findIndex(g => g.includes(currentStep));

  return `
    <div class="progress-bar">
      ${STEP_GROUPS.map((group, i) => {
        const isCompleted = i < progressGroup;
        const isActive    = i === progressGroup;
        const canClick    = i <= progressGroup;
        const cls = isCompleted ? 'completed' : isActive ? 'active' : '';
        const click = canClick
          ? `onclick="window._navigate('${GROUP_TARGET[i]}')" style="cursor:pointer"`
          : `style="cursor:default"`;
        return `
          ${i > 0 ? `<div class="progress-bar__line ${isCompleted ? 'completed' : ''}"></div>` : ''}
          <div class="progress-bar__step">
            <div class="progress-bar__dot ${cls}" ${click}>${ICONS[i]}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
