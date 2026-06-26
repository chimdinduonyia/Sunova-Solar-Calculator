import { getState, setState } from '../state.js';
import { showPreloader } from '../preloader.js';
import { renderProgressBar } from '../components/progressBar.js';
import { renderRadioCards, bindRadioCards } from '../components/radioCard.js';
import { computeResults } from '../utils/computeResults.js';

const GOALS = [
  { id: 'reduce_bill', emoji: `<img src="/icons/reduce_my_bill.png" width="72" height="72" style="object-fit:contain">`,  name: 'Reduce Bill',   desc: 'Reduce my monthly bill effectively' },
  { id: 'backup',      emoji: `<img src="/icons/backup_power.png" width="72" height="72" style="object-fit:contain">`,    name: 'Backup Power',  desc: 'Have some backup power' },
  { id: 'offgrid',     emoji: `<img src="/icons/off_grid.png" width="72" height="72" style="object-fit:contain">`,        name: 'Off-Grid',      desc: 'Go completely off-grid' }
];

export { renderStep6 as renderStep3 };
export function renderStep6(container, navigate) {
  const state = getState();

  container.innerHTML = `
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${renderProgressBar(3)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <h1 class="step-title">What is your solar goal?</h1>
        <p class="step-subtitle">Choose what matters most to you about going solar</p>

        ${renderRadioCards({ cards: GOALS, selected: state.goal, name: 'solar-goal' })}
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="generate-btn" ${!state.goal ? 'disabled' : ''}>Generate Results</button>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigate('step2'));

  function injectBackupCounter() {
    document.querySelector('.backup-hours-inject')?.remove();
    const backupCard = document.querySelector('[data-radio-group="solar-goal"] [data-value="backup"]');
    if (!backupCard) return;
    const inject = document.createElement('div');
    inject.className = 'backup-hours-inject';
    inject.style.cssText = 'margin-top:12px;padding-top:12px;border-top:1.5px solid rgba(0,0,0,0.12);display:flex;justify-content:center';
    inject.innerHTML = `
      <div class="rooms-counter">
        <span class="rooms-counter__label" style="font-size:12px">Backup hrs</span>
        <button class="rooms-counter__btn" id="backup-dec">–</button>
        <span class="rooms-counter__val" id="backup-val">${getState().backupHours}</span>
        <button class="rooms-counter__btn" id="backup-inc">+</button>
      </div>`;
    backupCard.appendChild(inject);

    document.getElementById('backup-dec').addEventListener('click', e => {
      e.stopPropagation();
      setState({ backupHours: Math.max(1, getState().backupHours - 1) });
      document.getElementById('backup-val').textContent = getState().backupHours;
    });
    document.getElementById('backup-inc').addEventListener('click', e => {
      e.stopPropagation();
      setState({ backupHours: getState().backupHours + 1 });
      document.getElementById('backup-val').textContent = getState().backupHours;
    });
  }

  bindRadioCards('solar-goal', val => {
    setState({ goal: val });
    document.getElementById('generate-btn').disabled = false;
    if (val === 'backup') {
      injectBackupCounter();
    } else {
      document.querySelector('.backup-hours-inject')?.remove();
    }
  });

  if (getState().goal === 'backup') {
    injectBackupCounter();
  }

  document.getElementById('generate-btn').addEventListener('click', () => {
    computeResults();
    showPreloader(() => navigate('costSavings'));
  });
}

