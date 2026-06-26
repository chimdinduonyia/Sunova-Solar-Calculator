export function renderFinalQuote(container, navigate) {
  container.innerHTML = `
    <div style="padding:40px 40px 60px">
      <div class="card cta-section" style="margin-bottom:0;padding:32px">
        <div class="card" style="text-align:center;padding:56px 48px">
          <div style="font-size:52px;line-height:1;margin-bottom:24px">🚀</div>
          <h2 style="font-size:clamp(44px,6vw,62px);font-weight:800;color:var(--color-text-primary);margin-bottom:12px;line-height:1.1;letter-spacing:-.03em">
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
