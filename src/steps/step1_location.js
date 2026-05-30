import { getState, setState, getData } from '../state.js';
import { renderProgressBar } from '../components/progressBar.js';

export function renderStep1(container, navigate) {
  const state = getState();
  const pvData = getData('pv_yield') || [];

  container.innerHTML = `
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn" disabled style="opacity:0.35">
          ← Back
        </button>
        ${renderProgressBar(1)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <div class="step-head">
          <div>
            <h1 class="step-title">Where is your home located?</h1>
            <p class="step-subtitle">We'll use this to calculate solar irradiance in your area</p>
          </div>
          <span style="font-size:72px">🌍</span>
        </div>

        <div class="card" style="max-width:480px">
          <label class="label" style="display:block;margin-bottom:8px;font-weight:600;font-size:14px">
            Select your state / city
          </label>
          <div class="select-wrap">
            <select class="sunova-select" id="location-select">
              <option value="">Choose your location</option>
              ${pvData.map(loc => `
                <option value="${loc.state}" ${state.location?.state === loc.state ? 'selected' : ''}>
                  ${loc.state} (${loc.zone})
                </option>
              `).join('')}
            </select>
          </div>

          <div id="location-info" class="card" style="margin-top:16px;background:var(--color-primary-bg);border-color:var(--color-primary-light);display:${state.location ? 'block' : 'none'}">
            <div style="display:flex;gap:32px;align-items:center">
              <div>
                <div class="label">Zone</div>
                <div class="value" id="loc-zone">${state.location?.zone || ''}</div>
              </div>
              <div>
                <div class="label">Peak Sun Hours</div>
                <div class="value value--amber" id="loc-psh">${state.location?.daily_yield_kwh_per_kwp || ''} hrs/day</div>
              </div>
              <div>
                <div class="label">Annual Yield</div>
                <div class="value" id="loc-yield">${state.location?.annual_yield_kwh_per_kwp || ''} kWh/kWp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="continue-btn" ${!state.location ? 'disabled' : ''}>
          Continue
        </button>
      </div>
    </div>
  `;

  const select = document.getElementById('location-select');
  const continueBtn = document.getElementById('continue-btn');
  const infoBox = document.getElementById('location-info');

  select.addEventListener('change', () => {
    const loc = pvData.find(l => l.state === select.value);
    if (loc) {
      setState({ location: loc });
      document.getElementById('loc-zone').textContent = loc.zone;
      document.getElementById('loc-psh').textContent = `${loc.daily_yield_kwh_per_kwp} hrs/day`;
      document.getElementById('loc-yield').textContent = `${loc.annual_yield_kwh_per_kwp} kWh/kWp`;
      infoBox.style.display = 'block';
      continueBtn.disabled = false;
    } else {
      setState({ location: null });
      infoBox.style.display = 'none';
      continueBtn.disabled = true;
    }
  });

  continueBtn.addEventListener('click', () => {
    if (getState().location) navigate('step2');
  });
}
