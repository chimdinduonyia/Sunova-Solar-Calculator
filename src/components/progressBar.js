const ICONS = [
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.09 12.33A1 1 0 005 14h7l-1 8 8.91-10.33A1 1 0 0019 10h-7l1-8z"/></svg>`,
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`
];

const STEP_GROUPS = [
  [1, 2],
  [3, 4],
  [5],
  [6]
];

// First step to land on when clicking each group icon
const GROUP_TARGET = ['step1', 'step3', 'step5', 'step6'];

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
