import { getState } from '../state.js';

const N = (v) => '₦' + Number(v).toLocaleString('en-NG');

export function renderFinalQuote(container, navigate) {
  const { results, budget } = getState();
  if (!results) { navigate('step1'); return; }
  const { solar, battery, savings } = results;

  // Use calcSavings cost model (includes battery + BOS) as the authoritative figure.
  // solar.estimated_cost is a legacy estimate that omits battery; never show it here.
  const systemCost = savings.total_system_cost;
  const fillPct = Math.min(100, Math.round((budget / systemCost) * 100));
  const budgetCovered = budget >= systemCost;

  const bom = [
    {
      product: `Jinko Solar 585W Mono PERC Half-Cell`,
      sku: `JK-585M-HC`,
      category: 'Solar Panel',
      qty: solar.panel_count
    },
    {
      product: `DEYE ${solar.inverter_kva}kW Hybrid Inverter`,
      sku: `DEYE-HYB-${solar.inverter_kva}KW`,
      category: 'Inverter',
      qty: 1
    },
    {
      product: `48V LiFePO4 Battery 5kWh`,
      sku: `BAT-LFP-48V-5K`,
      category: 'Battery',
      qty: battery.battery_units_48v
    },
    {
      product: `Roof Mounting Kit (Tile / Metal)`,
      sku: `MNT-ROOF-TILE`,
      category: 'Mounting',
      qty: Math.ceil(solar.panel_count / 4)
    },
    {
      product: `4mm² DC Solar Cable (Red + Black)`,
      sku: `CBL-DC-4MM-PAIR`,
      category: 'Cabling',
      qty: `${Math.ceil(solar.panel_kwp * 10)}m`
    }
  ];

  container.innerHTML = `
    <div style="padding:40px 40px 60px">

      <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px">
        <div>
          <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Your Solar Quote</h2>
          <p style="color:var(--color-text-secondary);font-size:16px">System specifications, financial readiness &amp; product breakdown</p>
        </div>
        <div style="display:flex;gap:10px;flex-shrink:0">
          <button class="btn btn--outline btn--sm" onclick="window._navigate('costSavings')">← Back to Savings</button>
          <button class="btn btn--primary btn--sm" onclick="window.print()">⬇ Download Quote</button>
        </div>
      </div>

      <div class="final-quote-grid">

        <!-- Left: readiness + system summary + BOM -->
        <div style="display:flex;flex-direction:column;gap:24px">

          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
              <div class="section-title" style="margin-bottom:0">Financial Readiness</div>
              <span class="tag ${budgetCovered ? 'tag--green' : 'tag--amber'}">
                ${budgetCovered ? '✓ Budget covered' : '⚠ Budget gap'}
              </span>
            </div>

            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-muted);margin-bottom:8px">
              <span>₦0</span>
              <span>System Cost: ${N(systemCost)}</span>
            </div>
            <div class="financial-readiness-bar">
              <div class="financial-readiness-bar__fill" style="width:${fillPct}%"></div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
              <span style="font-size:12px;color:var(--color-text-secondary)">Your Budget: <strong>${N(budget)}</strong></span>
              <span style="font-size:12px;font-weight:700;color:${budgetCovered ? 'var(--color-success)' : 'var(--color-error)'}">
                ${budgetCovered ? `+${N(budget - systemCost)} surplus` : `${N(systemCost - budget)} gap`}
              </span>
            </div>
          </div>

          <div class="card" style="background:var(--color-primary-bg);border-color:var(--color-primary-light)">
            <div style="font-size:12px;font-weight:700;color:var(--color-primary-dark);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">System Summary</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <div>
                <div class="label">Solar Capacity</div>
                <div class="value value--amber">${solar.panel_kwp.toFixed(1)} kWp</div>
              </div>
              <div>
                <div class="label">Inverter Size</div>
                <div class="value value--amber">${solar.inverter_kva.toFixed(1)} kVA</div>
              </div>
              <div>
                <div class="label">Battery Storage</div>
                <div class="value value--amber">${results.battery.battery_kwh.toFixed(1)} kWh</div>
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                  <span class="label" style="margin-bottom:0">Est. System Cost</span>
                  <button class="assumptions-btn" id="show-assumptions-btn" title="View pricing assumptions">ⓘ</button>
                </div>
                <div class="value value--amber">${N(systemCost)}</div>
                <div class="indicative-tag">Indicative estimate</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
              <div class="section-title" style="margin-bottom:0">Bill of Quantities (BOQ)</div>
              <span style="font-size:11px;color:var(--color-text-muted)">Excl. installation &amp; logistics</span>
            </div>
            <table class="bom-table">
              <thead>
                <tr>
                  <th style="width:55%">Product</th>
                  <th>Category</th>
                  <th style="text-align:right">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${bom.map(row => `
                  <tr>
                    <td>
                      ${row.product}
                      <span class="bom-sku">${row.sku}</span>
                    </td>
                    <td>${row.category}</td>
                    <td style="text-align:right">${row.qty}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>

        <!-- Right: title + installer card -->
        <div style="display:flex;flex-direction:column;gap:24px">

          <div>
            <h1 class="final-quote-title">Your personalized solar system &amp; financial overview</h1>
            <p class="final-quote-desc" style="margin-top:12px">Get your personalized energy data with accurate recommendations to boost your energy efficiency and reduce your electricity bills.</p>
            <div class="final-quote-btns" style="margin-top:20px">
              <button class="btn btn--primary btn--lg" onclick="window.print()">⬇ Download Quote</button>
              <button class="btn btn--outline btn--lg">Share Quote</button>
            </div>
          </div>

          <div class="installer-card">
            <div class="installer-card__map-placeholder">🗺️</div>
            <h3>Connect with nearby installers</h3>
            <p>Need rapid installation service? Reach out to certified solar technicians near you.</p>
            <div style="display:flex;gap:10px;margin-top:8px">
              <button class="btn btn--primary btn--sm" style="flex:1">Find Installers</button>
              <button class="btn btn--ghost btn--sm" style="flex:1;color:rgba(255,255,255,0.7)">Learn More</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Assumptions modal -->
    <div class="assumptions-overlay" id="assumptions-overlay" role="dialog" aria-modal="true" aria-labelledby="assumptions-title">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title" id="assumptions-title">Cost Estimate Assumptions</h3>
          <button class="modal-close" id="close-assumptions-btn" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">
            The indicative system cost is calculated from the unit rates and design rules below.
            Actual quotes from installers may vary based on site conditions, brand choices, and logistics.
          </p>

          <div class="modal-section-label">Pricing</div>
          <div class="modal-assumptions-grid">
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Solar panels</span>
              <span class="modal-assumption-value">₦260,000 / kWp</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Battery (LiFePO4)</span>
              <span class="modal-assumption-value">₦280,000 / kWh</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Hybrid inverter</span>
              <span class="modal-assumption-value">₦200,000 / kVA</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Balance of System (BOS)</span>
              <span class="modal-assumption-value">15% of equipment</span>
            </div>
          </div>

          <div class="modal-section-label" style="margin-top:20px">System Design</div>
          <div class="modal-assumptions-grid">
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Design life</span>
              <span class="modal-assumption-value">25 years</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Battery replacement</span>
              <span class="modal-assumption-value">Once at Year 10</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Panel degradation</span>
              <span class="modal-assumption-value">0.5% per year</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Annual maintenance</span>
              <span class="modal-assumption-value">Not included</span>
            </div>
          </div>

          <div class="modal-section-label" style="margin-top:20px">Financial</div>
          <div class="modal-assumptions-grid">
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Tariff escalation rate</span>
              <span class="modal-assumption-value">7% per year</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Grid emission factor</span>
              <span class="modal-assumption-value">0.43 kgCO₂/kWh</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Generator (PMS) emission</span>
              <span class="modal-assumption-value">0.65 kgCO₂/kWh</span>
            </div>
            <div class="modal-assumption-row">
              <span class="modal-assumption-label">Generator (AGO/Diesel) emission</span>
              <span class="modal-assumption-value">0.70 kgCO₂/kWh</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn--primary btn--sm" id="close-assumptions-btn-2">Got it</button>
        </div>
      </div>
    </div>
  `;

  window._navigate = navigate;

  // Modal open / close
  const overlay = document.getElementById('assumptions-overlay');
  function openModal()  { overlay.classList.add('assumptions-overlay--visible'); }
  function closeModal() { overlay.classList.remove('assumptions-overlay--visible'); }

  document.getElementById('show-assumptions-btn').addEventListener('click', openModal);
  document.getElementById('close-assumptions-btn').addEventListener('click', closeModal);
  document.getElementById('close-assumptions-btn-2').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') closeModal();
  });
}
