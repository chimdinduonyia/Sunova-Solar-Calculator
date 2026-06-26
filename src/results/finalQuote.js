export function renderFinalQuote(container, navigate) {
  container.innerHTML = `
    <div class="cta-outer">
      <div class="card cta-section" style="margin-bottom:0;padding:32px">
        <div class="card cta-inner" style="text-align:center">
          <div style="font-size:52px;line-height:1;margin-bottom:24px">🚀</div>
          <h2 class="cta-hero-title" style="font-weight:800;color:var(--color-text-primary);margin-bottom:12px;line-height:1.1;letter-spacing:-.03em">
            Go solar today in one click.
          </h2>
          <p style="font-size:var(--font-size-base);color:var(--color-text-secondary);max-width:480px;margin:0 auto 32px;line-height:1.6">
            We will match you with vetted solar installers near you. They see your exact energy needs and send in real quotes. We highlight the best value, but the final choice is always yours.
          </p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <button class="btn btn--primary btn--lg" id="cta-installers-btn">
              See installers near me
            </button>
            <button class="btn btn--outline btn--lg" id="cta-adjust-btn">
              Adjust my energy data
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#cta-installers-btn')
    ?.addEventListener('click', () => navigate('market'));
  container.querySelector('#cta-adjust-btn')
    ?.addEventListener('click', () => navigate('step1'));
}
