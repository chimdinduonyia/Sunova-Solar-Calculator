(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const ya="modulepreload",fa=function(e){return"/"+e},dt={},ee=function(s,t,n){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),o=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));i=Promise.allSettled(t.map(c=>{if(c=fa(c),c in dt)return;dt[c]=!0;const m=c.endsWith(".css"),u=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const f=document.createElement("link");if(f.rel=m?"stylesheet":ya,m||(f.as="script"),f.crossOrigin="",f.href=c,o&&f.setAttribute("nonce",o),document.head.appendChild(f),m)return new Promise((h,p)=>{f.addEventListener("load",h),f.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return i.then(r=>{for(const o of r||[])o.status==="rejected"&&a(o.reason);return s().catch(a)})},ge={location:null,powerSource:null,tariffBand:null,gridSpend:1e5,fuelSpend:5e4,generatorSize:null,houseType:null,rooms:0,appliances:[],solarAppliances:null,customSchedule:null,goal:null,backupHours:4,budget:15e5,results:null,_data:{}},ha=new Set;function R(){return{...ge}}function D(e){Object.assign(ge,e),ha.forEach(s=>s({...ge}))}function N(e){return ge._data[e]||null}function te(e,s){ge._data[e]=s}const ba=['<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>','<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.09 12.33A1 1 0 005 14h7l-1 8 8.91-10.33A1 1 0 0019 10h-7l1-8z"/></svg>','<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><circle cx="11" cy="11" r="4"/><line x1="21" y1="3" x2="14.35" y2="9.65"/><polyline points="17,3 21,3 21,7"/></svg>'],pt=[[1],[2],[3]],ka=["step1","step2","step3"];function Ue(e){const s=pt.findIndex(t=>t.includes(e));return`
    <div class="progress-bar">
      ${pt.map((t,n)=>{const i=n<s,a=n===s,r=n<=s,o=i?"completed":a?"active":"",c=r?`onclick="window._navigate('${ka[n]}')" style="cursor:pointer"`:'style="cursor:default"';return`
          ${n>0?`<div class="progress-bar__line ${i?"completed":""}"></div>`:""}
          <div class="progress-bar__step">
            <div class="progress-bar__dot ${o}" ${c}>${ba[n]}</div>
          </div>
        `}).join("")}
    </div>
  `}function Bt(e,s){var o,c,m;const t=R(),n=N("pv_yield")||[];e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn" disabled style="opacity:0.35">
          ← Back
        </button>
        ${Ue(1)}
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
              ${n.map(u=>{var f;return`
                <option value="${u.state}" ${((f=t.location)==null?void 0:f.state)===u.state?"selected":""}>
                  ${u.state} (${u.zone})
                </option>
              `}).join("")}
            </select>
          </div>

          <div id="location-info" class="card" style="margin-top:16px;background:var(--color-primary-bg);border-color:var(--color-primary-light);display:${t.location?"block":"none"}">
            <div style="display:flex;gap:32px;align-items:center">
              <div>
                <div class="label">Zone</div>
                <div class="value" id="loc-zone">${((o=t.location)==null?void 0:o.zone)||""}</div>
              </div>
              <div>
                <div class="label">Peak Sun Hours</div>
                <div class="value value--amber" id="loc-psh">${((c=t.location)==null?void 0:c.daily_yield_kwh_per_kwp)||""} hrs/day</div>
              </div>
              <div>
                <div class="label">Annual Yield</div>
                <div class="value" id="loc-yield">${((m=t.location)==null?void 0:m.annual_yield_kwh_per_kwp)||""} kWh/kWp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="continue-btn" ${t.location?"":"disabled"}>
          Continue
        </button>
      </div>
    </div>
  `;const i=document.getElementById("location-select"),a=document.getElementById("continue-btn"),r=document.getElementById("location-info");i.addEventListener("change",()=>{const u=n.find(f=>f.state===i.value);u?(D({location:u}),document.getElementById("loc-zone").textContent=u.zone,document.getElementById("loc-psh").textContent=`${u.daily_yield_kwh_per_kwp} hrs/day`,document.getElementById("loc-yield").textContent=`${u.annual_yield_kwh_per_kwp} kWh/kWp`,r.style.display="block",a.disabled=!1):(D({location:null}),r.style.display="none",a.disabled=!0)}),a.addEventListener("click",()=>{R().location&&s("step2")})}function $e(e){return"₦"+Number(e).toLocaleString("en-NG")}function ut(e){return parseInt(String(e).replace(/[₦,\s]/g,""),10)||0}function Rt(e){return(14-e/100*28).toFixed(1)}function vt({id:e,value:s,min:t,max:n,step:i=1e3,ticks:a,label:r="per month",formatFn:o=$e}){const c=(s-t)/(n-t)*100,m=Rt(c),u=a?a.map((f,h)=>{const p=(f-t)/(n-t)*100,l=s>=(h===0?t:a[h-1])&&s<=f,d=h===0?"translateX(0)":h===a.length-1?"translateX(-100%)":"translateX(-50%)";return`<span class="slider-tick ${l?"active":""}" data-val="${f}" style="left:${p}%;transform:${d}">${o(f)}</span>`}).join(""):"";return`
    <div class="slider-wrapper">
      <div style="text-align:center;margin-bottom:16px">
        <div class="slider-bubble">
          <input
            type="text"
            class="slider-bubble__val"
            id="${e}-val"
            value="${o(s)}"
            inputmode="numeric"
            autocomplete="off"
            aria-label="Monthly spend in Naira"
          />
          <span class="slider-bubble__label">${r}</span>
        </div>
      </div>
      <div class="slider-track-wrap">
        <div class="slider-tooltip" id="${e}-tooltip" style="left:calc(${c}% + ${m}px)">
          <span class="slider-tooltip__val">${o(s)}</span>
          <div class="slider-tooltip__arrow"></div>
        </div>
        <input
          type="range"
          class="sunova-slider"
          id="${e}"
          min="${t}"
          max="${n}"
          step="${i}"
          value="${s}"
          style="background: linear-gradient(to right, var(--color-primary) ${c}%, var(--color-border) ${c}%)"
        />
        ${a?`<div class="slider-ticks">${u}</div>`:""}
      </div>
    </div>
  `}function mt(e,s=$e,t){const n=document.getElementById(e),i=document.getElementById(`${e}-val`),a=document.getElementById(`${e}-tooltip`);if(!n||!i)return;const r=Number(n.min),o=Number(n.max),c=Number(n.step)||1;function m(){const u=Number(n.value),f=(u-r)/(o-r)*100,h=Rt(f);if(n.style.background=`linear-gradient(to right, var(--color-primary) ${f}%, var(--color-border) ${f}%)`,i.value=s(u),a){a.style.left=`calc(${f}% + ${h}px)`;const l=a.querySelector(".slider-tooltip__val");l&&(l.textContent=s(u))}t&&t(u);const p=n.closest(".slider-track-wrap").querySelectorAll(".slider-tick");if(p.length>0){const l=Array.from(p).map(d=>Number(d.dataset.val));p.forEach((d,y)=>{const E=y===0?r:l[y-1];d.classList.toggle("active",u>=E&&u<=l[y])})}}if(n.addEventListener("input",m),n.addEventListener("change",m),i.addEventListener("focus",()=>{i.value=ut(i.value)||"",i.select()}),i.addEventListener("blur",()=>{const u=ut(i.value),f=Math.max(r,Math.min(o,u||r)),h=Math.round((f-r)/c)*c+r;n.value=h,m()}),i.addEventListener("keydown",u=>{u.key==="Enter"&&i.blur()}),a){const u=()=>a.classList.add("visible"),f=()=>a.classList.remove("visible");n.addEventListener("mousedown",u),n.addEventListener("touchstart",u,{passive:!0}),document.addEventListener("mouseup",f),document.addEventListener("touchend",f)}}function je({cards:e,selected:s,name:t}){return`
    <div class="radio-cards" data-radio-group="${t}">
      ${e.map(n=>`
        <div class="radio-card ${s===n.id?"selected":""}" data-value="${n.id}">
          <div class="radio-card__radio"></div>
          <div class="radio-card__img-placeholder">${n.emoji||"⚡"}</div>
          <div class="radio-card__content">
            ${n.label?`<div class="radio-card__label">${n.label}</div>`:""}
            <div class="radio-card__name">${n.name}</div>
            ${n.desc?`<div class="radio-card__desc">${n.desc}</div>`:""}
            ${n.extra||""}
          </div>
        </div>
      `).join("")}
    </div>
  `}function ze(e,s){const t=document.querySelector(`[data-radio-group="${e}"]`);t&&t.querySelectorAll(".radio-card").forEach(n=>{n.addEventListener("click",()=>{t.querySelectorAll(".radio-card").forEach(i=>i.classList.remove("selected")),n.classList.add("selected"),s&&s(n.dataset.value)})})}const xa='<img src="/icons/grid_only.png" width="72" height="72" style="object-fit:contain">',_a='<img src="/icons/generator_only.png" width="72" height="72" style="object-fit:contain">',wa='<img src="/icons/grid_and_generator.png" width="72" height="72" style="object-fit:contain">',Sa='<img src="/icons/small_generator_i_better_pass_my_neighbour.png" width="72" height="72" style="object-fit:contain">',Ea='<img src="/icons/medium_generator.png" width="72" height="72" style="object-fit:contain">',$a='<img src="/icons/silent_diesel_generator.png" width="72" height="72" style="object-fit:contain">',Aa=[{id:"grid_only",emoji:xa,name:"Grid Only",desc:"I rely solely on NEPA/DisCo grid supply"},{id:"both",emoji:wa,name:"Grid + Generator",desc:"I use both grid and a backup generator"},{id:"generator_only",emoji:_a,name:"Generator Only",desc:"No grid, I run a generator for power"}],La=[{id:"small",emoji:Sa,label:"I better pass my neighbour",name:"Small (1–2 KVA)"},{id:"medium",emoji:Ea,label:"Gasoline generator",name:"Medium (3–5 KVA)"},{id:"large",emoji:$a,label:"Silent diesel generator",name:"Large (6–10 KVA)"}];function Wt(e,s){function t(){var m,u;const i=R(),a=N("tariff_bands")||[],r=i.powerSource==="grid_only"||i.powerSource==="both",o=i.powerSource==="generator_only"||i.powerSource==="both",c=i.powerSource&&(!r||!!i.tariffBand)&&(!o||!!i.generatorSize);e.innerHTML=`
      <div class="wizard-step">
        <div class="wizard-header">
          <button class="back-btn" id="back-btn">← Back</button>
          ${Ue(2)}
          <div style="width:90px"></div>
        </div>

        <div class="step-body">
          <h1 class="step-title">Energy source &amp; monthly spend</h1>
          <p class="step-subtitle">Tell us how you currently power your home and what you spend</p>

          <div class="section-title" style="margin-bottom:14px">How do you currently power your home?</div>
          ${je({cards:Aa,selected:i.powerSource,name:"power-source"})}

          ${r?`
            <div class="section-title" style="margin-top:32px;margin-bottom:12px">Grid electricity</div>
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:10px">What is your electricity tariff band?</div>
            <div class="tariff-pills" id="tariff-pills">
              ${a.map(f=>`
                <button class="tariff-pill ${i.tariffBand===f.band?"selected":""}" data-band="${f.band}">${f.band}</button>
              `).join("")}
            </div>
            ${i.tariffBand?`
              <div class="card" style="margin-top:10px;margin-bottom:16px;background:var(--color-primary-bg);border-color:var(--color-primary-light);padding:10px 14px">
                <div style="display:flex;align-items:center;gap:14px">
                  <div class="tag tag--amber">${i.tariffBand}</div>
                  <div style="font-size:12px;color:var(--color-text-secondary)">
                    ${((m=a.find(f=>f.band===i.tariffBand))==null?void 0:m.hours_of_supply)||""} hrs/day
                    &nbsp;·&nbsp; ₦${((u=a.find(f=>f.band===i.tariffBand))==null?void 0:u.tariff_naira_per_kwh)||""}/kWh
                    &nbsp;<span class="badge-nerc">NERC</span>
                  </div>
                </div>
              </div>
            `:'<div style="margin-bottom:16px"></div>'}
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:6px">Monthly grid spend</div>
            ${vt({id:"grid-spend-slider",value:i.gridSpend,min:1e4,max:1e6,step:1e4,ticks:[1e4,25e4,5e5,75e4,1e6],label:"per month"})}
          `:""}

          ${o?`
            <div class="section-title" style="margin-top:32px;margin-bottom:12px">Generator</div>
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:10px">Choose your generator size</div>
            ${je({cards:La,selected:i.generatorSize,name:"gen-size"})}
            <div style="font-size:14px;color:var(--color-text-muted);margin-top:20px;margin-bottom:6px">Monthly fuel spend</div>
            ${vt({id:"fuel-spend-slider",value:i.fuelSpend,min:1e4,max:1e6,step:1e4,ticks:[1e4,25e4,5e5,75e4,1e6],label:"per month"})}
          `:""}
        </div>

        <div class="step-footer">
          <button class="btn btn--primary btn--lg" id="continue-btn" ${c?"":"disabled"}>Continue</button>
        </div>
      </div>
    `,n()}function n(){document.getElementById("back-btn").addEventListener("click",()=>s("step1")),document.getElementById("continue-btn").addEventListener("click",()=>s("step3")),ze("power-source",i=>{D({powerSource:i}),t()}),document.querySelectorAll(".tariff-pill").forEach(i=>{i.addEventListener("click",()=>{D({tariffBand:i.dataset.band}),t()})}),ze("gen-size",i=>{D({generatorSize:i}),t()}),document.getElementById("grid-spend-slider")&&mt("grid-spend-slider",$e,i=>D({gridSpend:i})),document.getElementById("fuel-spend-slider")&&mt("fuel-spend-slider",$e,i=>D({fuelSpend:i}))}t()}const gt=["Analysing your energy profile","Sizing your solar PV system","Calculating your savings with solar","Finalising your results"],Ca=[{activeAt:0,doneAt:3e3},{activeAt:3e3,doneAt:8e3},{activeAt:8e3,doneAt:15e3},{activeAt:15e3,doneAt:18e3}],Ma=18e3,Fa=`
#preloader-overlay {
  position: fixed;
  inset: 0;
  background: #ffffff;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  opacity: 1;
  transition: opacity 0.4s ease;
}
.pl-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 44px;
}

/* ── Sun ── */
.pl-sun { position: relative; width: 108px; height: 108px; }
.pl-sun-rays { position: absolute; inset: 0; animation: pl-spin-slow 18s linear infinite; }
.pl-sun-rays i {
  position: absolute; top: 50%; left: 50%;
  width: 4px; height: 13px; border-radius: 2px; background: #FCBF1E;
  transform: translate(-50%, -50%) rotate(var(--a)) translateY(-42px);
  animation: pl-ray-twinkle 1.8s ease-in-out infinite;
}
.pl-sun-core {
  position: absolute; top: 50%; left: 50%;
  width: 50px; height: 50px; margin: -25px 0 0 -25px;
  border-radius: 50%; background: #FCBF1E;
  animation: pl-core-pulse 2.6s ease-in-out infinite;
}
@keyframes pl-spin-slow    { to { transform: rotate(360deg); } }
@keyframes pl-ray-twinkle  { 0%, 100% { opacity: .32; } 50% { opacity: 1; } }
@keyframes pl-core-pulse   { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.84); opacity: .7; } }

/* ── Steps ── */
.pl-steps { display: flex; flex-direction: column; gap: 0; align-self: center; }
.pl-step {
  display: flex; align-items: flex-start; gap: 14px;
  opacity: 0; transform: translateY(6px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.pl-step.active, .pl-step.done { opacity: 1; transform: translateY(0); }
.pl-indicator {
  display: flex; flex-direction: column; align-items: center;
  width: 18px; flex-shrink: 0;
}
.pl-dot-wrap { width: 18px; height: 18px; position: relative; flex-shrink: 0; }

/* ── Dot states ── */
.pl-dot {
  width: 18px; height: 18px; border-radius: 50%;
  background: #fff; border: 2px solid #DCE5DF;
  box-sizing: border-box; flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}
/* Active: spinner ring */
.pl-step.active .pl-dot {
  border-color: #F6E2A6;
  border-top-color: #FCBF1E;
  animation: pl-spin-dot 0.8s linear infinite;
}
/* Done: filled yellow, tick visible */
.pl-step.done .pl-dot  { display: none; }
.pl-step.done .pl-tick { display: block; }
@keyframes pl-spin-dot { to { transform: rotate(360deg); } }

.pl-tick {
  position: absolute; inset: 0;
  width: 18px; height: 18px; display: none;
}

/* ── Connector line ── */
.pl-line-track { width: 2px; overflow: hidden; margin-top: 5px; margin-bottom: 5px; }
.pl-line { width: 2px; height: 0; background: #E5E7EB; transition: height 0.45s ease, background 0.3s ease; }
.pl-step.done .pl-line { height: 36px; background: #FCBF1E; }

/* ── Label ── */
.pl-text {
  font-size: 14px; font-weight: 500; color: #9CA3AF;
  line-height: 1.4; padding-bottom: 36px; transition: color 0.3s;
}
.pl-step:last-child .pl-text { padding-bottom: 0; }
.pl-step.active .pl-text { font-weight: 600; color: #111827; }
.pl-step.done   .pl-text { color: #6B7280; }

@media (max-width: 480px) {
  .pl-container { gap: 32px; padding: 0 24px; width: 100%; box-sizing: border-box; }
  .pl-text { font-size: 13px; padding-bottom: 30px; }
  .pl-step.done .pl-line { height: 30px; }
  .pl-text:last-child { padding-bottom: 0; }
}
`;function It(){if(document.getElementById("pl-styles"))return;const e=document.createElement("style");e.id="pl-styles",e.textContent=Fa,document.head.appendChild(e)}function Ta(e,s,t){It();const n=document.createElement("div");n.id="mini-preloader-overlay",n.style.cssText="position:fixed;inset:0;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;z-index:9999;opacity:1;transition:opacity .32s ease;font-family:Outfit,sans-serif;",n.innerHTML=`
    <div style="width:48px;height:48px;border-radius:50%;border:4px solid #E5E7EB;border-top-color:#FCBF1E;animation:pl-spin-dot .8s linear infinite"></div>
    <div style="font-size:15px;font-weight:600;color:#111827">${e}</div>
  `,document.body.appendChild(n),setTimeout(()=>{n.style.opacity="0",setTimeout(()=>{n.remove(),t==null||t()},340)},s)}function qa(e){It();const s=document.createElement("div");s.id="preloader-overlay",s.innerHTML=`
    <div class="pl-container">
      <div class="pl-sun" aria-hidden="true">
        <div class="pl-sun-rays">
          <i style="--a:0deg;animation-delay:0s"></i>
          <i style="--a:45deg;animation-delay:.2s"></i>
          <i style="--a:90deg;animation-delay:.4s"></i>
          <i style="--a:135deg;animation-delay:.6s"></i>
          <i style="--a:180deg;animation-delay:.8s"></i>
          <i style="--a:225deg;animation-delay:1s"></i>
          <i style="--a:270deg;animation-delay:1.2s"></i>
          <i style="--a:315deg;animation-delay:1.4s"></i>
        </div>
        <div class="pl-sun-core"></div>
      </div>
      <div class="pl-steps">
        ${gt.map((t,n)=>`
          <div class="pl-step" id="pl-step-${n}">
            <div class="pl-indicator">
              <div class="pl-dot-wrap">
                <div class="pl-dot"></div>
                <svg class="pl-tick" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#FCBF1E"/>
                  <path d="M5 9l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              ${n<gt.length-1?'<div class="pl-line-track"><div class="pl-line"></div></div>':""}
            </div>
            <div class="pl-text">${t}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(s),Ca.forEach(({activeAt:t,doneAt:n},i)=>{setTimeout(()=>{var a;(a=document.getElementById(`pl-step-${i}`))==null||a.classList.add("active")},t),setTimeout(()=>{const a=document.getElementById(`pl-step-${i}`);a&&(a.classList.remove("active"),a.classList.add("done"))},n)}),setTimeout(()=>{const t=document.getElementById("preloader-overlay");t&&(e(),t.style.opacity="0",setTimeout(()=>{t.remove()},400))},Ma)}function Pt(e,s,t,n,i){const{gridSpend:a=0,fuelSpend:r=0,tariffBand:o,generatorSize:c,powerSource:m,location:u,appliances:f=[],customSchedule:h}=e;let p=0;if(a>0&&o&&m!=="generator_only"){const b=(t||[]).find(F=>F.band===o),A=(b==null?void 0:b.tariff_naira_per_kwh)||0;A>0&&(p=a/A/30)}let l=0;if(r>0&&c&&m!=="grid_only"){const{fuelTypeStr:b,kwhPerLitre:A}=Ba(c,i),F=(u==null?void 0:u.state)||"",T=Ra(b,F,n);T>0&&A>0&&(l=r/T*A/30)}let d=p+l;d<1&&(d=Wa(f,s));const y={};(s||[]).forEach(b=>{y[b.name]=b});const E={};(f||[]).forEach(b=>{E[b.name]=b.qty||1});const $=new Array(24).fill(0);h&&h.length>0&&h.forEach(b=>{const A=y[b.name];if(!A)return;const F=E[b.name]||1,T=A.rated_watts*F/1e3;(b.segments||[]).forEach(_=>{const q=_.start??_.start_hour??0,W=_.end??_.end_hour??0;for(let I=0;I<24;I++)Math.min(W,I+1)-Math.max(q,I)>0&&($[I]+=T)})});const w=$.reduce((b,A)=>b+A,0),C=p+l>0,x=d;if(w>0){if(x>0){const b=w/x;p=parseFloat((p*b).toFixed(2)),l=parseFloat((l*b).toFixed(2))}d=w}const g=w>0?$.map(b=>parseFloat(b.toFixed(3))):new Array(24).fill(parseFloat((d/24).toFixed(3))),v=Math.max(0,d-w);let k,S;if(w===0)k=30,S="Low";else if(!C)k=55,S="Medium";else{const b=Math.abs(w-x)/Math.max(w,x);b<=.25?(k=Math.round(99-b/.25*14),S="High"):b<=.6?(k=Math.round(84-(b-.25)/.35*29),S="Medium"):(k=Math.max(30,Math.round(54-(b-.6)/.4*24)),S="Low")}const M=g.reduce((b,A,F)=>A>g[b]?F:b,0),L=parseFloat(g[M].toFixed(2));return{totalDailyKWh:parseFloat(d.toFixed(2)),dailyGridKWh:parseFloat(p.toFixed(2)),dailyGenKWh:parseFloat(l.toFixed(2)),ganttTotalKWh:parseFloat(w.toFixed(2)),unaccountedKWh:parseFloat(v.toFixed(2)),hourlyProfile:g,ganttHourly:$.map(b=>parseFloat(b.toFixed(3))),peakHour:M,peakKW:L,confidenceScore:k,confidenceLabel:S,confidenceReason:w===0?"no_appliances":C?S==="High"?"ok":"variance":"no_spending",confidenceDirection:!C||w===0?null:w>x?"appliances_higher":w<x?"spending_higher":"matched",monthlyKWh:parseFloat((d*30).toFixed(1))}}function Ba(e,s){const t={small:{fuelTypeStr:"PMS",kwhPerLitre:2.27},medium:{fuelTypeStr:"PMS",kwhPerLitre:3.38},large:{fuelTypeStr:"AGO",kwhPerLitre:3.71}};if(!s||s.length===0)return t[e]||t.medium;const n={small:{types:["Small Portable"],preferFuel:"PMS"},medium:{types:["Mid-size"],preferFuel:"PMS"},large:{types:["Mid-size","Large Home"],preferFuel:"AGO"}},i=n[e]||n.medium;let a=s.filter(o=>i.types.includes(o.type)&&o.fuel_type.includes(i.preferFuel));if(a.length===0&&(a=s.filter(o=>i.types.includes(o.type))),a.length===0)return t[e]||t.medium;const r=a.reduce((o,c)=>o+c.kwh_per_litre,0)/a.length;return{fuelTypeStr:i.preferFuel,kwhPerLitre:r}}function Ra(e,s,t){const n={AGO:1800,PMS:1300};if(!t||t.length===0)return n[e]||1100;const i=e==="AGO"?"AGO":"PMS",a=t.filter(o=>o.fuel_type.includes(i));if(a.length===0)return n[e]||1100;const r=a.find(o=>o.state.toLowerCase()===s.toLowerCase());return r?r.price_per_litre_naira:Math.round(a.reduce((o,c)=>o+c.price_per_litre_naira,0)/a.length)}function Wa(e,s){if(!e||e.length===0)return 5;const t={};(s||[]).forEach(i=>{t[i.name]=i});let n=0;return e.forEach(i=>{const a=t[i.name];a&&(n+=a.daily_wh*(i.qty||1)/1e3)}),Math.max(2,n)}const We=585,yt=.75,Ia=.8,Pa=1.25,Oa=6.5,Ga=.9025,Da=6,ja=18,Ie=[3,5,7.5,10,12.5,15,20,25,30],za=25e4,Na=6e4,Ha=15e4;function Ot(e,s,t=0){const n=e.totalDailyKWh,i=Math.max(e.peakKW,t),a=(s==null?void 0:s.daily_yield_kwh_per_kwp)||4.5,r=(s==null?void 0:s.annual_yield_kwh_per_kwp)||1642,o=e.hourlyProfile||[];let c=0,m=0;if(o.length===24)for(let v=0;v<24;v++)v>=Da&&v<ja?c+=o[v]:m+=o[v];else c=n*.5,m=n*.5;const u=c+m/Ga,f=u/(a*yt),h=u*365/r,p=Math.max(f,h),l=Math.ceil(p*1e3/We),d=parseFloat((l*We/1e3).toFixed(2)),y=i*Pa/Ia,E=Ie.find(v=>v>=y)??Ie[Ie.length-1],$=parseFloat((d*Oa).toFixed(1)),w=Math.round(d*r),x=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(v=>{var k;return{month:v,kwh:Math.round(d*(((k=s==null?void 0:s.monthly)==null?void 0:k[v.toLowerCase()])||a)*30*yt)}}),g=Math.round(d*za+E*Na+Ha);return{panel_kwp:d,panel_count:l,inverter_kva:E,installation_m2:$,annual_gen_kwh:w,monthly_gen:x,estimated_cost:g,psh:a,pvKWp_required:parseFloat(p.toFixed(2)),method1_kWp:parseFloat(f.toFixed(2)),method2_kWp:parseFloat(h.toFixed(2)),panelWattage:We}}const Pe=.8,ft=.95,ht=18,bt=23,Ka=[18,19,20,21,22,23,0,1,2,3,4,5],Ya=1.5,Oe=[5,10,15,20,25,30,40,50,60,80,100],Va={reduce_bill:4,backup:8,offgrid:16},Ua=.25,Ja=.6;function Gt(e,s,t){const n=e.peakKW||1,i=e.totalDailyKWh||1,a=e.hourlyProfile||[],r=s==="backup"&&t>0?t:Va[s]??4,o=a.slice(ht,bt+1),c=o.reduce((w,C)=>w+C,0);let m=o.length>0?c/o.length:0;m===0&&(m=n*.6);let u;s==="offgrid"?u=(a.length===24?Ka.reduce((C,x)=>C+(a[x]||0),0):i*.5)*Ya:u=m*r;const h=u/Pe/ft,p=Oe.find(w=>w>=h)??Oe[Oe.length-1],l=parseFloat((p*Pe*ft).toFixed(2)),d=n>0?Math.min(24,Math.round(l/(n*Ua))):24,y=n>0?Math.min(24,Math.round(l/(n*Ja))):24,E=n>0?Math.min(24,Math.round(l/n)):24,$=Math.ceil(p/5);return{battery_kwh:p,battery_units_48v:$,storage_capacity:p,storage_output:parseFloat(m.toFixed(2)),backup_hours_essentials:d,backup_hours_appliances:y,backup_hours_whole_home:E,backupHours:r,avgBackupLoad_kW:parseFloat(m.toFixed(2)),energyNeeded_kWh:parseFloat(u.toFixed(2)),batteryKWh_gross:parseFloat(h.toFixed(2)),batteryKWh_recommended:p,dod:Pe,backupWindowStart:ht,backupWindowEnd:bt}}function Dt({hourlyProfile:e,pvKWp:s,batteryKWh:t,dailyYield:n,dod:i=.8,batteryEfficiency:a=.95,energyMix:r="grid_and_generator",sunriseHour:o=6,sunsetHour:c=18}){const m=Array.from({length:24},(L,b)=>{const A=(b-o)/(c-o)*Math.PI;return A>0&&A<Math.PI?Math.sin(A):0}),u=m.reduce((L,b)=>L+b,0),f=m.map(L=>u>0?s*n*L/u:0),h=t,p=t*(1-i);let l=h;for(let L=c;L<24;L++){const b=e[L]||0,A=Math.max(0,l-p),F=Math.min(b,A*a);l-=F/a}let d=Math.max(p,l);const y=Array.from({length:24},(L,b)=>{const A=e[b]||0,F=f[b],T=Math.min(F,A),_=Math.max(0,F-A),q=Math.max(0,A-F),W=Math.min(_,(h-d)/a);d+=W*a;const I=W,j=Math.max(0,d-p),H=Math.min(q,j*a);d-=H/a;const J=H,oe=q-H;return{hour:b,demand:parseFloat(A.toFixed(3)),solar_to_load:parseFloat(T.toFixed(3)),battery_to_load:parseFloat(J.toFixed(3)),grid_to_load:parseFloat(oe.toFixed(3)),solar_to_charge:parseFloat(I.toFixed(3)),soc_end:parseFloat(d.toFixed(3)),soc_pct:parseFloat((d/t*100).toFixed(1))}}),E=y.reduce((L,b)=>L+b.demand,0),$=y.reduce((L,b)=>L+b.solar_to_load,0),w=y.reduce((L,b)=>L+b.battery_to_load,0),C=y.reduce((L,b)=>L+b.grid_to_load,0),x=y.reduce((L,b)=>L+b.solar_to_charge,0),g=1,v=E>0?C/E:0,k=parseFloat(x.toFixed(2)),S=parseFloat(C.toFixed(2)),M=r==="grid_only"?"Grid":r==="generator_only"?"Generator":"Grid+Gen";return{hours:y,totalDemand:parseFloat(E.toFixed(2)),totalSolarToLoad:parseFloat($.toFixed(2)),totalBatteryToLoad:parseFloat(w.toFixed(2)),totalGridToLoad:parseFloat(C.toFixed(2)),totalSolarCharge:parseFloat(x.toFixed(2)),gridReliance_before:g,gridReliance_after:parseFloat(v.toFixed(2)),dailySurplusKWh:k,avgDailyGridKWh:S,gridLabel:M}}const Xa=26e4,kt=28e4,Qa=2e5,Za=.15,es=10,ae=25,xt=.005,ts=.07,_t=.43,as=.65,ss=.7,wt={small:{types:["Small Portable"],preferFuel:"PMS",defaultKwh:2.27},medium:{types:["Mid-size"],preferFuel:"PMS",defaultKwh:3.38},large:{types:["Mid-size","Large Home"],preferFuel:"AGO",defaultKwh:3.71}};function is(e,s){const t=wt[e]||wt.medium,n=s||[];let i=n.filter(r=>t.types.includes(r.type)&&r.fuel_type.includes(t.preferFuel));i.length||(i=n.filter(r=>t.types.includes(r.type)));const a=i.length?i.reduce((r,o)=>r+o.kwh_per_litre,0)/i.length:t.defaultKwh;return{fuelTypeStr:t.preferFuel,kwhPerLitre:a}}function ns(e,s,t){const n={AGO:1800,PMS:1300};if(!(t!=null&&t.length))return n[e]||1100;const i=e==="AGO"?"AGO":"PMS",a=t.filter(o=>o.fuel_type.includes(i));if(!a.length)return n[e]||1100;const r=a.find(o=>{var c;return((c=o.state)==null?void 0:c.toLowerCase())===(s||"").toLowerCase()});return r?r.price_per_litre_naira:Math.round(a.reduce((o,c)=>o+c.price_per_litre_naira,0)/a.length)}function os({load:e,solar:s,battery:t,dispatch:n,tariffData:i,fuelPrices:a,genData:r,state:o}){var it,nt,ot;const c=e.totalDailyKWh,m=e.monthlyKWh??e.totalDailyKWh*30,u=e.dailyGridKWh||0,f=e.dailyGenKWh||0,h=s.panel_kwp,p=s.inverter_kva,l=((it=o.location)==null?void 0:it.annual_yield_kwh_per_kwp)||(((nt=o.location)==null?void 0:nt.daily_yield_kwh_per_kwp)||4.5)*365,d=t.battery_kwh,y=o.powerSource||"grid_only",E=o.goal||"reduce_bill",$=o.budget||0,w=i==null?void 0:i.find(Y=>Y.band===o.tariffBand),C=(w==null?void 0:w.tariff_naira_per_kwh)||194,{fuelTypeStr:x,kwhPerLitre:g}=is(o.generatorSize,r),v=((ot=o.location)==null?void 0:ot.state)||"",k=ns(x,v,a),S=y!=="grid_only"?Math.round(k/g):0,M=Math.round(h*Xa+d*kt+p*Qa),L=Math.round(M*Za),b=M+L,A=Math.round(d*kt),F=$>0?b<=$:!0,T=Math.max(0,$-b),_=Math.max(0,b-$),q=u+f;let W,I;q>0?(W=u/q,I=f/q):y==="grid_only"?(W=1,I=0):y==="generator_only"?(W=0,I=1):(W=.5,I=.5);let j;y==="grid_only"?j=C:y==="generator_only"?j=S:j=Math.round(W*C+I*S);const H=Math.round(j*m),J=h*l*((1-Math.pow(1-xt,ae))/xt),ne=J>0?Math.round((b+A)/J):45,{totalDemand:oe,totalSolarToLoad:ra,totalBatteryToLoad:la,totalGridToLoad:ca}=n,pe=oe>0?(ra+la)/oe:0,Qe=oe>0?ca/oe:1-pe,Te=Qe*W,be=Qe*I;let re;E==="offgrid"?re=ne:y==="grid_only"?re=Math.round(pe*ne+Te*C):y==="generator_only"?re=Math.round(pe*ne+be*S):re=Math.round(pe*ne+Te*C+be*S);const Ze=Math.round(re*m),et=H-Ze,ue=et*12,da=ue>0?parseFloat((b/ue).toFixed(1)):99,qe=ue*ae,pa=Math.round((qe-b-A)/b*100),tt=b+A,ua=qe>0&&tt>0?parseFloat(((Math.pow(qe/tt,1/ae)-1)*100).toFixed(1)):0;let Be=0,at=0;if(y!=="grid_only"){const rt=Math.max(0,f-be*c)*365;Be=g>0?Math.round(rt/g):0,at=Math.round(Be*k)}let ke;const st=x==="AGO"?ss:as;y==="grid_only"?ke=_t:y==="generator_only"?ke=st:ke=W*_t+I*st;const va=h*l,ma=parseFloat((va*ke/1e3).toFixed(1));let le=-b,ce=-1,xe=null;const Re=[{year:0,cumulative:le}];for(let Y=1;Y<=ae;Y++){const lt=ue*Math.pow(1+ts,Y)-(Y===es?A:0),ct=le;le+=lt,ce===-1&&ct<0&&le>=0&&(ce=Y,xe=parseFloat((Y-1+Math.abs(ct)/lt).toFixed(1))),Re.push({year:Y,cumulative:Math.round(le)})}ce===-1&&(le>=0?(ce=ae,xe=ae):(ce=99,xe=99));const ga=y==="grid_only"?"Grid":y==="generator_only"?"Generator":"Grid + Gen";return{total_system_cost:b,equipment_cost:M,bos_cost:L,battery_replacement_cost:A,isWithinBudget:F,budgetSurplus:T,budgetShortfall:_,current_blended_cost:j,post_solar_blended_cost:re,LCOE:ne,gen_cost_per_kwh:S,current_monthly_cost:H,post_solar_monthly_cost:Ze,monthly_savings:et,annual_savings:ue,simple_payback_years:da,ROI:pa,annualised_ROI:ua,lifetime_savings:Re[ae].cumulative,litres_saved_per_year:Be,fuel_naira_saved_annual:at,co2_avoided_tonnes:ma,solar_fraction:parseFloat(pe.toFixed(3)),grid_fraction:parseFloat(Te.toFixed(3)),gen_fraction:parseFloat(be.toFixed(3)),cashflow:Re,payback_year_index:ce,payback_exact:xe,current_label:ga,solar_label:"With Solar"}}const rs=[{name:"Split AC – 1HP",qty:1},{name:"Ceiling Fan",qty:3},{name:"LED Bulb (9W)",qty:18},{name:"LED Bulb (15W)",qty:9},{name:"Security Light (floodlight)",qty:5},{name:"Refrigerator (200L)",qty:1},{name:'LED TV – 43"',qty:2},{name:"DSTV Decoder",qty:1},{name:"Wi-Fi Router",qty:1},{name:"Phone Charger",qty:2},{name:"CCTV System (4 cameras)",qty:1}];function ls(e){const s=Object.fromEntries(e.map(t=>[t.name,t]));return rs.reduce((t,n)=>{const i=s[n.name];return t+(i?i.rated_watts*n.qty/1e3:0)},0)}function Me(){var l;const e=R(),s=N("appliances")||[],t=N("tariff_bands")||[],n=N("fuel_prices")||[],i=N("generator_efficiency")||[],a=new Set((e.appliances||[]).map(d=>d.name)),r=e.solarAppliances?new Set(e.solarAppliances):a,o={...e,appliances:(e.appliances||[]).filter(d=>r.has(d.name)),customSchedule:e.customSchedule?e.customSchedule.filter(d=>r.has(d.name)):null},c=Pt(o,s,t,n,i),m=ls(s),u=Ot(c,e.location,m),f=Gt(c,e.goal,e.backupHours),h=Dt({hourlyProfile:c.hourlyProfile,pvKWp:u.panel_kwp,batteryKWh:f.battery_kwh,dailyYield:((l=e.location)==null?void 0:l.daily_yield_kwh_per_kwp)||4.5,energyMix:e.powerSource}),p=os({load:c,solar:u,battery:f,dispatch:h,tariffData:t,fuelPrices:n,genData:i,state:e});D({results:{load:c,solar:u,battery:f,dispatch:h,savings:p}})}const cs=[{id:"reduce_bill",emoji:'<img src="/icons/reduce_my_bill.png" width="72" height="72" style="object-fit:contain">',name:"Reduce Bill",desc:"Reduce my monthly bill effectively"},{id:"backup",emoji:'<img src="/icons/backup_power.png" width="72" height="72" style="object-fit:contain">',name:"Backup Power",desc:"Have some backup power"},{id:"offgrid",emoji:'<img src="/icons/off_grid.png" width="72" height="72" style="object-fit:contain">',name:"Off-Grid",desc:"Go completely off-grid"}];function jt(e,s){const t=R();e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${Ue(3)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <h1 class="step-title">What is your solar goal?</h1>
        <p class="step-subtitle">Choose what matters most to you about going solar</p>

        ${je({cards:cs,selected:t.goal,name:"solar-goal"})}
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="generate-btn" ${t.goal?"":"disabled"}>Generate Results</button>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>s("step2"));function n(){var r;(r=document.querySelector(".backup-hours-inject"))==null||r.remove();const i=document.querySelector('[data-radio-group="solar-goal"] [data-value="backup"]');if(!i)return;const a=document.createElement("div");a.className="backup-hours-inject",a.style.cssText="margin-top:12px;padding-top:12px;border-top:1.5px solid rgba(0,0,0,0.12);display:flex;justify-content:center",a.innerHTML=`
      <div class="rooms-counter">
        <span class="rooms-counter__label" style="font-size:12px">Backup hrs</span>
        <button class="rooms-counter__btn" id="backup-dec">–</button>
        <span class="rooms-counter__val" id="backup-val">${R().backupHours}</span>
        <button class="rooms-counter__btn" id="backup-inc">+</button>
      </div>`,i.appendChild(a),document.getElementById("backup-dec").addEventListener("click",o=>{o.stopPropagation(),D({backupHours:Math.max(1,R().backupHours-1)}),document.getElementById("backup-val").textContent=R().backupHours}),document.getElementById("backup-inc").addEventListener("click",o=>{o.stopPropagation(),D({backupHours:R().backupHours+1}),document.getElementById("backup-val").textContent=R().backupHours})}ze("solar-goal",i=>{var a;D({goal:i}),document.getElementById("generate-btn").disabled=!1,i==="backup"?n():(a=document.querySelector(".backup-hours-inject"))==null||a.remove()}),R().goal==="backup"&&n(),document.getElementById("generate-btn").addEventListener("click",()=>{Me(),qa(()=>s("costSavings"))})}const St=e=>"₦"+Number(e).toLocaleString("en-NG"),ds=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],ps={north:[.6,.8,1.3,1.45,1.3,.85,.7,.72,.9,1.1,.75,.6],middle:[.75,.9,1.25,1.35,1.15,.82,.68,.7,.85,1.05,.85,.72],south:[1.1,1.2,1.3,1.2,1,.7,.65,.65,.8,1,1.1,1.05]};function zt(e){return e?/North West|North East/i.test(e)?"north":/North Central/i.test(e)?"middle":"south":"south"}function us(e,s,t,n){const i={};(t||[]).forEach(l=>{i[l.name]=l});let a=0,r=0;(s||[]).forEach(l=>{const d=i[l.name];if(!d)return;const y=d.rated_watts*(l.qty||1);r+=y,d.category==="Cooling"&&(a+=y)});const o=r>0?a/r:.35,c=ps[zt(n)],m=c.reduce((l,d)=>l+d,0)/12,u=c.map(l=>l/m),f=e.totalDailyKWh,h=f*o,p=f-h;return u.map(l=>parseFloat(((p+h*l)*30).toFixed(1)))}function Nt(e,s){const t=R(),n=N("appliances")||[],{results:i,location:a,powerSource:r,tariffBand:o,gridSpend:c,fuelSpend:m,appliances:u}=t;if(!i){s("step1");return}const{load:f,solar:h}=i,p=u&&u.length>0,l={grid_only:"Grid Only",generator_only:"Generator Only",both:"Grid & Generator"}[r]||"Grid & Generator",d={};n.forEach(S=>{d[S.name]=S});let y=0,E=0;(u||[]).forEach(S=>{const M=d[S.name];if(!M)return;const L=M.rated_watts*(S.qty||1);E+=L,M.category==="Cooling"&&(y+=L)});const $=E>0?Math.round(y/E*100):35,w=(a==null?void 0:a.zone)||"",C=zt(w),x={north:"Northern Nigeria: peak cooling March to May, cool harmattan Nov to Feb",middle:"Middle Belt: peak cooling March to May, mild rainy dip Jun to Sep",south:"Southern Nigeria: peak cooling Feb to Apr, rainy season dip Jun to Sep"}[C],g=p?`
    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Energy Consumption</div>
      <div class="chart-header-row" style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px">
        <div style="display:flex;gap:28px;align-items:flex-end">
          <div>
            <div class="label">Daily average</div>
            <div class="kwh-day">${f.totalDailyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
          </div>
          <div>
            <div class="label">Monthly average</div>
            <div style="font-size:24px;font-weight:700;color:var(--color-text)">${f.monthlyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
          </div>
        </div>
        <select id="chart-view-sel" class="gantt-select">
          <option value="hourly">Hourly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <canvas id="load-chart" height="180"></canvas>
      <div id="chart-caption" style="margin-top:10px;font-size:11px;color:var(--color-text-muted);line-height:1.5"></div>
    </div>
  `:`
    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Energy Consumption</div>
      <div style="display:flex;gap:28px;align-items:flex-end;margin-bottom:16px">
        <div>
          <div class="label">Daily average</div>
          <div class="kwh-day">${f.totalDailyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
        </div>
        <div>
          <div class="label">Monthly average</div>
          <div style="font-size:24px;font-weight:700;color:var(--color-text)">${f.monthlyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
        </div>
      </div>
    </div>
  `;if(e.innerHTML=`
    <div style="padding:40px 40px 60px">
      <h1 style="font-size:36px;font-weight:800;margin-bottom:6px">Your Energy Profile</h1>
      <p style="color:var(--color-text-secondary);font-size:16px;margin-bottom:32px">See how you consume energy in your house</p>

      <div class="load-profile-grid">
        <div>
          <div class="card">
            <div class="section-title" style="margin-bottom:16px">Your Inputs</div>
            <div class="assumption-summary">
              <div class="assumption-item">
                <div class="label">Supply</div>
                <div class="value">${l}</div>
              </div>
              ${o&&r!=="generator_only"?`<div class="assumption-item"><div class="label">Tariff</div><div class="tag tag--amber">${o}</div></div>`:""}
              ${c&&r!=="generator_only"?`<div class="assumption-item"><div class="label">Grid Spend</div><div class="value">${St(c)}</div></div>`:""}
              ${m&&r!=="grid_only"?`<div class="assumption-item"><div class="label">Generator Spend</div><div class="value">${St(m)}</div></div>`:""}
              <div class="assumption-item"><div class="label">Location</div><div class="value">${(a==null?void 0:a.state)||"N/A"}</div></div>
            </div>
            <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--color-border-light)">
              <button class="btn btn--outline btn--sm" onclick="window._navigate('step1')">Adjust Assumptions</button>
            </div>
          </div>
        </div>

        <div>
          <div class="card" style="margin-bottom:20px;background:#FAFAFA;border:none;position:relative;overflow:hidden">
            <div class="section-title" style="margin-bottom:12px">Solar Irradiance</div>
            <div class="solar-irradiance-card" style="position:relative;z-index:1">
              <div class="irradiance-stats">
                <div class="irradiance-stat-card">
                  <div class="label">Peak Sun Hours</div>
                  <div class="value value--amber" style="font-size:22px;line-height:1.1">${h.psh}</div>
                  <div class="label" style="font-size:10px;margin-top:2px">hrs / day</div>
                </div>
                <div class="irradiance-stat-card">
                  <div class="label">Annual Irradiance</div>
                  <div class="value value--amber" style="font-size:22px;line-height:1.1">${(a==null?void 0:a.annual_yield_kwh_per_kwp)||"N/A"}</div>
                  <div class="label" style="font-size:10px;margin-top:2px">kWh / kWp</div>
                </div>
              </div>
            </div>
            <img src="/icons/solar_irradiance_stats.png"
              style="position:absolute;right:-12px;bottom:-28px;width:188px;height:188px;object-fit:contain;opacity:0.88;pointer-events:none;z-index:0">
          </div>

          ${g}
        </div>
      </div>

    </div>
  `,window._navigate=s,!p)return;const v=us(f,u,n,w),k=parseFloat((v.reduce((S,M)=>S+M,0)/12).toFixed(1));Et(f),Ge(`Hourly kWh from your appliance schedule, scaled to match spending data. Confidence: ${f.confidenceLabel} (${f.confidenceScore}%).`),document.getElementById("chart-view-sel").addEventListener("change",function(){this.value==="hourly"?(Et(f),Ge(`Hourly kWh from your appliance schedule, scaled to match spending data. Confidence: ${f.confidenceLabel} (${f.confidenceScore}%).`)):(vs(v,k),Ge(`Seasonal estimate: ${$}% of your load is cooling. ${x}.`))})}function Ge(e){const s=document.getElementById("chart-caption");s&&(s.textContent=e)}function Et(e){var a;const s=(a=document.getElementById("load-chart"))==null?void 0:a.getContext("2d");if(!s)return;window._loadChart&&window._loadChart.destroy();const t=Array.from({length:24},(r,o)=>o===0?"12am":o===12?"12pm":o<12?`${o}am`:`${o-12}pm`),n=Math.max(...e.hourlyProfile),i=e.hourlyProfile.map(r=>{const o=r/n;return o>.75?"#EF4444":o>.45?"#F5A623":"#FCD34D"});window._loadChart=new Chart(s,{type:"bar",data:{labels:t,datasets:[{data:e.hourlyProfile,backgroundColor:i,borderRadius:8,borderSkipped:!1,barPercentage:.55,categoryPercentage:.8}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:r=>`${r.raw} kW`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:r=>`${r} kW`}}}}})}function vs(e,s){var i;const t=(i=document.getElementById("load-chart"))==null?void 0:i.getContext("2d");if(!t)return;window._loadChart&&window._loadChart.destroy();const n=e.map(a=>a>=s?"#F5A623":"#93C5FD");window._loadChart=new Chart(t,{type:"bar",data:{labels:ds,datasets:[{type:"bar",data:e,backgroundColor:n,borderRadius:8,borderSkipped:!1,barPercentage:.55,categoryPercentage:.8,order:2},{type:"line",data:new Array(12).fill(s),borderColor:"#6B7280",borderWidth:1.5,borderDash:[4,3],pointRadius:0,fill:!1,order:1,label:"Monthly average"}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:a=>a.datasetIndex===0?`${a.raw} kWh`:`Avg: ${s} kWh`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:a=>`${a}`},title:{display:!0,text:"kWh / month",font:{size:10,family:"Outfit, sans-serif"},color:"#9CA3AF"}}}}})}const ms=e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;");function gs(e){return{Cooling:"❄️",Lighting:"💡",Kitchen:"🍳",Entertainment:"📺","ICT / Office":"💻",Laundry:"🫧",Water:"💧",Security:"🔒"}[e]||"🔌"}function De(e){return e>=1e3?`${(e/1e3).toFixed(1)} MWh/yr`:`${e.toLocaleString()} kWh/yr`}function ys(){const{results:e,budget:s}=R()||{};if(!e)return;const t=u=>document.getElementById(u),n=u=>"₦"+Number(u).toLocaleString("en-NG"),i=e.savings.total_system_cost,a=s>=i,r=Math.min(100,Math.round(s/i*100));t("fq-solar-kwp")&&(t("fq-solar-kwp").textContent=`${e.solar.panel_kwp.toFixed(1)} kWp`),t("fq-solar-count")&&(t("fq-solar-count").textContent=`${e.solar.panel_count} panels`),t("fq-inverter-kva")&&(t("fq-inverter-kva").textContent=`${e.solar.inverter_kva.toFixed(1)} kVA`),t("fq-battery-kwh")&&(t("fq-battery-kwh").textContent=`${e.battery.battery_kwh.toFixed(1)} kWh`),t("fq-system-cost")&&(t("fq-system-cost").textContent=n(i));const o=t("fq-budget-fill");o&&(o.style.width=`${r}%`);const c=t("fq-budget-delta");c&&(c.style.color=a?"var(--color-success)":"var(--color-error)",c.textContent=a?`+${n(s-i)} surplus`:`${n(i-s)} gap`);const m=t("fq-boq-body");if(m){const u=e.solar,f=e.battery,h=[{product:"Jinko Solar 585W Mono PERC Half-Cell",sku:"JK-585M-HC",category:"Solar Panel",qty:u.panel_count},{product:`DEYE ${u.inverter_kva}kW Hybrid Inverter`,sku:`DEYE-HYB-${u.inverter_kva}KW`,category:"Inverter",qty:1},{product:"48V LiFePO4 Battery 5kWh",sku:"BAT-LFP-48V-5K",category:"Battery",qty:f.battery_units_48v},{product:"Roof Mounting Kit (Tile / Metal)",sku:"MNT-ROOF-TILE",category:"Mounting",qty:Math.ceil(u.panel_count/4)},{product:"4mm² DC Solar Cable (Red + Black)",sku:"CBL-DC-4MM-PAIR",category:"Cabling",qty:`${Math.ceil(u.panel_kwp*10)}m`}];m.innerHTML=h.map(p=>`
      <tr>
        <td><span class="bom-product">${p.product}</span><span class="bom-sku">${p.sku}</span></td>
        <td>${p.category}</td>
        <td style="text-align:right">${p.qty}</td>
      </tr>`).join("")}}function $t(){const e=document.getElementById("pv-confidence-card"),s=document.getElementById("pv-profile-card");if(!e||!s)return;e.style.alignSelf="start";const t=e.getBoundingClientRect().height;e.style.alignSelf="",s.style.maxHeight=t+"px"}function fs(e){return e>=85?"High":e>=55?"Medium":"Low"}function hs(e,s,t){const n=i=>`<div style="padding:12px 14px;background:var(--color-primary-bg);border:1.5px solid var(--color-primary-light);border-radius:var(--radius-md);font-size:12px;line-height:1.6;color:var(--color-text-secondary)">${i}</div>`;return e==="no_appliances"?n(`<strong style="color:var(--color-text)">Boost your confidence score.</strong> Add your appliances and usage schedule to get a <strong>High</strong> confidence result.<div style="margin-top:10px"><button class="btn btn--primary btn--sm" onclick="window._navigate('addAppliances')">Add Appliances →</button></div>`):e==="no_spending"?n('<strong style="color:var(--color-text)">Single-source estimate.</strong> Your sizing is based on your appliance list only. We have no energy spend data to cross-check against.'):e==="variance"&&s==="Low"?n(`<strong style="color:var(--color-text)">Your bills and appliance list don't match up.</strong> ${t==="appliances_higher"?"Your appliance list suggests a much higher consumption than your energy spend implies. Please review your appliance list and make sure it reflects what you actually run.":"Your energy spend implies a much higher load than your appliance list accounts for. Some appliances or heavy loads may be missing from your list."}<div style="margin-top:10px"><button class="btn btn--primary btn--sm" onclick="window._navigate('addAppliances')">Update Appliance List</button></div>`):e==="variance"?n(`<strong style="color:var(--color-text)">Nearly there.</strong> ${t==="appliances_higher"?"Your appliance list suggests slightly more consumption than your energy spend.":"Your energy spend suggests slightly more consumption than your appliance list."} Your sizing is a reasonable estimate. Adjusting your appliance list can bring it closer.<div style="margin-top:10px"><button class="btn btn--primary btn--sm" onclick="window._navigate('addAppliances')">Update Appliance List</button></div>`):""}function Ht(e,s){const{results:t,appliances:n}=R();if(!t){s("step1");return}const i=N("appliances")||[],a=N("tariff_bands")||[],r=N("fuel_prices")||[],o=N("generator_efficiency")||[],c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],m=n&&n.length>0,{powerSource:u}=R(),f=u==="grid_only"?"Grid Reliance (Grid)":u==="generator_only"?"Grid Reliance (Gen)":"Grid Reliance (Grid + Gen)",{solarAppliances:h}=R(),p=h?new Set(h):new Set(n.map(x=>x.name));function l(){var A;const x=R(),g=m?n.filter(F=>p.has(F.name)):n,v=new Set(g.map(F=>F.name)),k={...x,appliances:g,customSchedule:x.customSchedule?x.customSchedule.filter(F=>v.has(F.name)):null},S=Pt(k,i,a,r,o),M=Ot(S,x.location),L=Gt(S,x.goal,x.backupHours),b=Dt({hourlyProfile:S.hourlyProfile,pvKWp:M.panel_kwp,batteryKWh:L.battery_kwh,dailyYield:((A=x.location)==null?void 0:A.daily_yield_kwh_per_kwp)||4.5,energyMix:x.powerSource});return{load:S,solar:M,battery:L,dispatch:b}}const{load:d,solar:y,battery:E,dispatch:$}=l(),w=x=>`<span class="confidence-tooltip-wrap" style="display:inline-flex;vertical-align:middle;margin-left:4px"><button class="confidence-tooltip-btn" type="button">?</button><span class="confidence-tooltip-box">${x}</span></span>`;e.innerHTML=`
    <div style="padding:40px 40px 60px">
      <div class="card pv-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
          <div>
            <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Your personalized solar PV system</h2>
            <p style="color:var(--color-text-secondary);font-size:16px">Here is the breakdown of your solar PV system</p>
          </div>
        </div>

        <div class="section-title" style="margin-bottom:12px">System Specs</div>
        <div class="system-specs" style="margin-bottom:32px">
          <div class="spec-card">
            <div class="spec-card__label">Solar PV ${w("The total power output of your panels under ideal sunlight. A larger system generates more electricity and covers more of your daily load.")}</div>
            <div class="spec-card__value" id="spec-solar-kwp">${y.panel_kwp} kWp</div>
            <div class="spec-card__sub" id="spec-solar-count">Capacity · ${y.panel_count} panels</div>
            <div style="font-size:36px;margin-top:8px">🔆</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Inverter ${w("Converts solar DC power to AC electricity for your home. Sized to handle your peak demand without cutting out.")}</div>
            <div class="spec-card__value" id="spec-inverter-kva">${y.inverter_kva} kVA</div>
            <div class="spec-card__sub">Rating</div>
            <div style="font-size:36px;margin-top:8px">⚡</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Battery ${w("Total energy storage capacity. This determines how long your home can run on stored solar power when there is no sunlight.")}</div>
            <div class="spec-card__value" id="spec-battery-kwh">${E.battery_kwh} kWh</div>
            <div class="spec-card__sub" id="spec-battery-units">Storage · ${E.battery_units_48v} units</div>
            <div style="font-size:36px;margin-top:8px">🔋</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Mounting Space ${w("The approximate roof area needed to mount all your solar panels.")}</div>
            <div class="spec-card__value" id="spec-area-m2">${y.installation_m2} m²</div>
            <div class="spec-card__sub">Required</div>
            <div style="font-size:36px;margin-top:8px">📐</div>
          </div>
        </div>

        ${m?`

          <!-- ── WITH APPLIANCES: full layout ───────────────────────── -->
          <div class="solar-three-col">
            <div class="card">
              <div class="section-title" style="margin-bottom:4px">Projected Generation <span class="tag tag--amber" style="font-size:10px">kWh</span></div>
              <div class="value value--amber" id="spec-annual-gen" style="font-size:18px;font-weight:700;margin-bottom:12px">${De(y.annual_gen_kwh)}</div>
              <canvas id="gen-chart" height="160"></canvas>
            </div>

            <div class="card" id="pv-confidence-card">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <div class="section-title" style="margin-bottom:0">Confidence Score</div>
                <div class="confidence-tooltip-wrap">
                  <button class="confidence-tooltip-btn" aria-label="What is the confidence score?">?</button>
                  <div class="confidence-tooltip-box" role="tooltip">
                    Measures agreement between your energy spend and your appliance list. A <strong>High</strong> score means both data sources suggest similar consumption, giving you an accurate solar size. A <strong>Low</strong> score means the two sources diverge significantly. Review your appliances or spending figures to improve accuracy.
                  </div>
                </div>
              </div>
              <div class="gauge-legend" style="margin-bottom:8px">
                <span><span class="gauge-dot" style="background:#10B981"></span>High</span>
                <span><span class="gauge-dot" style="background:#F59E0B"></span>Medium</span>
                <span><span class="gauge-dot" style="background:#EF4444"></span>Low</span>
              </div>
              <div class="confidence-gauge">
                <canvas id="gauge-chart" height="120" width="200"></canvas>
                <div id="spec-confidence-label" style="font-size:18px;font-weight:700;margin-top:-20px">${d.confidenceLabel||fs(d.confidenceScore)}</div>
                <div id="spec-confidence-score" style="font-size:13px;color:var(--color-text-secondary)">${d.confidenceScore}% Confidence</div>
              </div>
              <div id="spec-confidence-prompt" style="margin-top:14px"></div>
            </div>

            <div class="card" id="pv-profile-card" style="overflow:hidden;display:flex;flex-direction:column;min-height:0">
              <div class="section-title" style="margin-bottom:6px;flex-shrink:0">Interactive Profile</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:6px;flex-shrink:0">Check the appliances you want solar to cover &nbsp;<span id="solar-selection-indicator" style="color:var(--color-text-muted);font-weight:400">(${p.size}/${n.length} selected)</span></div>
              <div class="interactive-profile" style="padding:0;overflow-y:auto;flex:1;min-height:0">
                ${n.map(x=>`
                  <div class="profile-appliance-row" data-name="${ms(x.name)}" style="cursor:pointer;user-select:none">
                    <div class="checkbox ${p.has(x.name)?"checked":""}"></div>
                    <div class="profile-appliance-row__img-placeholder">${gs(x.category||"")}</div>
                    <span>${x.name}</span>
                    <span style="margin-left:auto;font-size:12px;color:var(--color-text-muted)">×${x.qty}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <div style="margin-top:24px">
            <div class="storage-details">
              <div class="card">
                <div class="section-title" style="margin-bottom:12px">Storage Details</div>
                <div style="display:flex;gap:32px">
                  <div class="storage-stat"><div class="label">Capacity</div><div class="value value--amber" id="spec-storage-cap">${E.storage_capacity} kWh</div></div>
                  <div class="storage-stat"><div class="label">Output</div><div class="value value--amber" id="spec-storage-out">${E.storage_output.toFixed(2)} kW</div></div>
                </div>
              </div>
              <div class="card">
                <div class="section-title" style="margin-bottom:12px">Backup Potential</div>
                <div class="backup-potential">
                  <div class="backup-item"><div class="label">Essentials</div><div class="value value--amber" id="spec-backup-ess">${E.backup_hours_essentials}hrs</div></div>
                  <div class="backup-item"><div class="label">Appliances</div><div class="value value--amber" id="spec-backup-app">${E.backup_hours_appliances}hrs</div></div>
                  <div class="backup-item"><div class="label">Whole home</div><div class="value value--amber" id="spec-backup-home">${E.backup_hours_whole_home}hrs</div></div>
                </div>
              </div>
            </div>
            <div class="card" style="margin-top:24px">
              <div class="section-title" style="margin-bottom:8px">Hourly Energy Dispatch Simulation</div>
              <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:12px;font-size:12px;color:var(--color-text-secondary)">
                <div id="dispatch-stat-reliance">${f} <strong>${Math.round($.gridReliance_before*100)}% → ${Math.round($.gridReliance_after*100)}%</strong></div>
                <div id="dispatch-stat-grid">Avg daily grid use <strong>${$.totalDemand.toFixed(1)} → ${$.avgDailyGridKWh} kWh</strong></div>
                <div id="dispatch-stat-surplus">Avg daily surplus <strong>${$.dailySurplusKWh} kWh</strong></div>
              </div>
              <div style="display:flex;gap:16px;font-size:11px;margin-bottom:8px;flex-wrap:wrap">
                <span><span style="display:inline-block;width:10px;height:10px;background:#FCBF1E;border-radius:2px"></span> Solar</span>
                <span><span style="display:inline-block;width:10px;height:10px;background:#2E86AB;border-radius:2px"></span> Battery</span>
                <span><span style="display:inline-block;width:10px;height:10px;background:#E84855;border-radius:2px"></span> ${$.gridLabel}</span>
                <span><span style="display:inline-block;width:10px;height:10px;background:#A8DADC;border-radius:2px"></span> Charging</span>
              </div>
              <div style="position:relative">
                <canvas id="dispatch-canvas" style="display:block;width:100%"></canvas>
                <div id="dispatch-tooltip" style="display:none;position:absolute;background:#1F2937;color:#F9FAFB;padding:8px 12px;border-radius:8px;font-size:11px;pointer-events:none;z-index:10;min-width:148px;line-height:1.7;box-shadow:0 4px 16px rgba(0,0,0,0.28)"></div>
              </div>
            </div>
          </div>

        `:`

          <!-- ── WITHOUT APPLIANCES: simplified 2×2 grid ───────────── -->
          <div class="storage-details" style="margin-top:0">
            <div class="card">
              <div class="section-title" style="margin-bottom:4px">Projected Generation <span class="tag tag--amber" style="font-size:10px">kWh</span></div>
              <div class="value value--amber" id="spec-annual-gen" style="font-size:18px;font-weight:700;margin-bottom:12px">${De(y.annual_gen_kwh)}</div>
              <canvas id="gen-chart" height="140"></canvas>
            </div>
            <div class="card">
              <div class="section-title" style="margin-bottom:12px">Storage Details</div>
              <div style="display:flex;gap:32px;margin-bottom:20px">
                <div class="storage-stat"><div class="label">Capacity</div><div class="value value--amber" id="spec-storage-cap">${E.storage_capacity} kWh</div></div>
                <div class="storage-stat"><div class="label">Output</div><div class="value value--amber" id="spec-storage-out">${E.storage_output.toFixed(2)} kW</div></div>
              </div>
              <div class="section-title" style="margin-bottom:10px">Backup Potential</div>
              <div class="backup-potential">
                <div class="backup-item"><div class="label">Essentials</div><div class="value value--amber" id="spec-backup-ess">${E.backup_hours_essentials}hrs</div></div>
                <div class="backup-item"><div class="label">Appliances</div><div class="value value--amber" id="spec-backup-app">${E.backup_hours_appliances}hrs</div></div>
                <div class="backup-item"><div class="label">Whole home</div><div class="value value--amber" id="spec-backup-home">${E.backup_hours_whole_home}hrs</div></div>
              </div>
            </div>
            <div class="card" style="grid-column:1/-1">
              <div class="section-title" style="margin-bottom:12px">${f}</div>
              <div style="display:flex;gap:32px;flex-wrap:wrap">
                <div class="storage-stat">
                  <div class="label">Before Solar</div>
                  <div class="value" style="color:var(--color-text-muted)" id="dispatch-stat-reliance-before">${Math.round($.gridReliance_before*100)}%</div>
                </div>
                <div class="storage-stat">
                  <div class="label">After Solar</div>
                  <div class="value value--amber" id="dispatch-stat-reliance-after">${Math.round($.gridReliance_after*100)}%</div>
                </div>
                <div class="storage-stat">
                  <div class="label">Avg Daily Grid Use</div>
                  <div class="value value--amber" id="dispatch-stat-grid"><span style="color:var(--color-text-muted)">${$.totalDemand.toFixed(1)}</span> → ${$.avgDailyGridKWh} kWh</div>
                </div>
                <div class="storage-stat">
                  <div class="label">Avg Daily Surplus</div>
                  <div class="value value--amber" id="dispatch-stat-surplus">${$.dailySurplusKWh} kWh</div>
                </div>
              </div>
            </div>
          </div>

        `}

        <!-- ── Add Appliances CTA (always last) ──────────────────────── -->
        <div class="refine-prompt-card" style="margin-top:24px">
          <div class="refine-prompt-card__icon">⚡</div>
          <div class="refine-prompt-card__body">
            <div class="refine-prompt-card__title">${m?"Update your home profile":"Your estimate is based on spending. Make it Sharper"}</div>
            <div class="refine-prompt-card__desc">${m?"You can update your appliance list or usage schedule at any time to keep your solar recommendation accurate.":"Right now we sized your solar system from your energy spend. Tell us which appliances you run and when, and we'll calculate a precise load curve, a seasonal forecast, and raise your confidence score."}</div>
            <button class="btn btn--primary" onclick="window._navigate('addAppliances')">Add Appliances</button>
          </div>
        </div>

      </div>
    </div>
  `,window._navigate=s,document.querySelectorAll(".confidence-tooltip-wrap").forEach(x=>{var g;(g=x.querySelector(".confidence-tooltip-btn"))==null||g.addEventListener("click",v=>{v.stopPropagation();const k=x.classList.contains("is-open");document.querySelectorAll(".confidence-tooltip-wrap.is-open").forEach(S=>S.classList.remove("is-open")),k||x.classList.add("is-open")})}),document.addEventListener("click",()=>{document.querySelectorAll(".confidence-tooltip-wrap.is-open").forEach(x=>x.classList.remove("is-open"))}),At(y,c),m&&(bs(d.confidenceScore),document.getElementById("spec-confidence-prompt").innerHTML=hs(d.confidenceReason,d.confidenceLabel,d.confidenceDirection),requestAnimationFrame(()=>{Lt("dispatch-canvas",$),$t()})),m&&document.querySelectorAll(".profile-appliance-row[data-name]").forEach(x=>{x.addEventListener("click",()=>{const g=x.dataset.name,v=x.querySelector(".checkbox");p.has(g)?(p.delete(g),v.classList.remove("checked")):(p.add(g),v.classList.add("checked"));const k=p.size===n.length;D({solarAppliances:k?null:[...p]});const S=document.getElementById("solar-selection-indicator");S&&(S.textContent=`(${p.size}/${n.length} selected)`),C()})});function C(){const{solar:x,battery:g,dispatch:v}=l(),k=S=>document.getElementById(S);k("spec-solar-kwp").textContent=`${x.panel_kwp} kWp`,k("spec-solar-count").textContent=`Capacity · ${x.panel_count} panels`,k("spec-inverter-kva").textContent=`${x.inverter_kva} kVA`,k("spec-battery-kwh").textContent=`${g.battery_kwh} kWh`,k("spec-battery-units").textContent=`Storage · ${g.battery_units_48v} units`,k("spec-area-m2").textContent=`${x.installation_m2} m²`,k("spec-annual-gen").textContent=De(x.annual_gen_kwh),k("spec-storage-cap")&&(k("spec-storage-cap").textContent=`${g.storage_capacity} kWh`),k("spec-storage-out")&&(k("spec-storage-out").textContent=`${g.storage_output.toFixed(2)} kW`),k("spec-backup-ess")&&(k("spec-backup-ess").textContent=`${g.backup_hours_essentials}hrs`),k("spec-backup-app")&&(k("spec-backup-app").textContent=`${g.backup_hours_appliances}hrs`),k("spec-backup-home")&&(k("spec-backup-home").textContent=`${g.backup_hours_whole_home}hrs`),k("dispatch-stat-reliance")&&(k("dispatch-stat-reliance").innerHTML=`${f} <strong>${Math.round(v.gridReliance_before*100)}% → ${Math.round(v.gridReliance_after*100)}%</strong>`),k("dispatch-stat-grid")&&(k("dispatch-stat-grid").innerHTML=`Avg daily grid use <strong>${v.totalDemand.toFixed(1)} → ${v.avgDailyGridKWh} kWh</strong>`),k("dispatch-stat-surplus")&&(k("dispatch-stat-surplus").innerHTML=`Avg daily surplus <strong>${v.dailySurplusKWh} kWh</strong>`),At(x,c),m&&(Lt("dispatch-canvas",v),requestAnimationFrame($t)),Me(),ys()}}function At(e,s){var r;const t=document.getElementById("gen-chart");if(!t)return;(r=Chart.getChart(t))==null||r.destroy();const n=t.getContext("2d"),i=e.monthly_gen.map(o=>o.kwh),a=Math.max(...i);new Chart(n,{type:"bar",data:{labels:s,datasets:[{data:i,backgroundColor:i.map(o=>o/a>.9?"#EF4444":o/a>.75?"#F5A623":"#FCD34D"),borderRadius:8,barPercentage:.5,categoryPercentage:.8}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:o=>`${o.raw} kWh`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:9,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:9,family:"Outfit, sans-serif"},callback:o=>`${o}`}}}}})}function bs(e){var i;const s=document.getElementById("gauge-chart");if(!s)return;(i=Chart.getChart(s))==null||i.destroy();const t=s.getContext("2d"),n=e>=85?"#10B981":e>=55?"#F59E0B":"#EF4444";new Chart(t,{type:"doughnut",data:{datasets:[{data:[e,100-e],backgroundColor:[n,"#E5E7EB"],borderWidth:0,circumference:180,rotation:270}]},options:{responsive:!1,cutout:"75%",plugins:{legend:{display:!1},tooltip:{enabled:!1}}}})}function Lt(e,s){let t=document.getElementById(e);if(!t||!s)return;const n=t.cloneNode(!1);t.parentNode.replaceChild(n,t),t=n;const i=t.parentElement,a=window.devicePixelRatio||1,r=i.clientWidth||Math.min(window.innerWidth-32,600),o=220;t.width=r*a,t.height=o*a,t.style.width=r+"px",t.style.height=o+"px";const c=t.getContext("2d");c.scale(a,a);const m=46,u=12,f=10,h=28,p=r-m-u,l=o-f-h,d=s.hours,E=Math.max(...d.map(M=>M.demand+M.solar_to_charge),.01)*1.12,$=l/E,w=p/24,C=Math.max(4,w*.6),x=5,g={solar:"#FCBF1E",battery:"#2E86AB",grid:"#E84855",charge:"#A8DADC"};c.font="10px Outfit, sans-serif",c.textAlign="right",[0,.25,.5,.75,1].forEach(M=>{const L=E*M,b=f+l-L*$;c.strokeStyle="#F3F4F6",c.lineWidth=1,c.beginPath(),c.moveTo(m,b),c.lineTo(m+p,b),c.stroke(),c.fillStyle="#9CA3AF",c.fillText(L.toFixed(1),m-4,b+3.5)}),c.save(),c.translate(13,f+l/2),c.rotate(-Math.PI/2),c.textAlign="center",c.fillStyle="#6B7280",c.fillText("kW",0,0),c.restore();function v(M,L,b,A,F){if(A<=0)return;const T=Math.min(F,b/2,A/2);c.beginPath(),c.moveTo(M,L+A),c.lineTo(M,L+T),c.quadraticCurveTo(M,L,M+T,L),c.lineTo(M+b-T,L),c.quadraticCurveTo(M+b,L,M+b,L+T),c.lineTo(M+b,L+A),c.closePath(),c.fill()}const k=[];d.forEach(M=>{const L=[{v:M.solar_to_load,c:g.solar},{v:M.battery_to_load,c:g.battery},{v:M.grid_to_load,c:g.grid},{v:M.solar_to_charge,c:g.charge}];let b=-1;for(let _=L.length-1;_>=0;_--)if(L[_].v>=.001){b=_;break}const A=m+M.hour*w+(w-C)/2,F=f+l;let T=F;L.forEach((_,q)=>{if(_.v<.001)return;const W=_.v*$;T-=W,c.fillStyle=_.c,q===b?v(A,T,C,W,x):c.fillRect(A,T,C,W)}),k.push({bx:A,bW:C,topY:T,bottomY:F,d:M})}),c.strokeStyle="#D1D5DB",c.lineWidth=1,c.beginPath(),c.moveTo(m,f+l),c.lineTo(m+p,f+l),c.stroke(),c.fillStyle="#6B7280",c.textAlign="center",c.font="9px Outfit, sans-serif";for(let M=0;M<24;M+=3){const L=M===0?"12am":M<12?`${M}am`:M===12?"12pm":`${M-12}pm`;c.fillText(L,m+M*w+w/2,o-6)}const S=document.getElementById("dispatch-tooltip");t.addEventListener("mousemove",M=>{const L=t.getBoundingClientRect(),b=M.clientX-L.left,A=M.clientY-L.top,F=k.find(W=>b>=W.bx&&b<=W.bx+W.bW);if(!F||A<f||A>f+l){S&&(S.style.display="none");return}const T=F.d,_=T.hour,q=_===0?"12am":_<12?`${_}am`:_===12?"12pm":`${_-12}pm`;if(S){let W=b+14,I=A-106;W+152>r&&(W=b-166),I<0&&(I=A+14),S.style.left=W+"px",S.style.top=I+"px",S.style.display="block",S.innerHTML=`
        <div style="font-weight:700;margin-bottom:5px;font-size:12px">${q}</div>
        <div><span style="color:${g.solar}">■</span> Solar: ${T.solar_to_load.toFixed(2)} kW</div>
        <div><span style="color:${g.battery}">■</span> Battery: ${T.battery_to_load.toFixed(2)} kW</div>
        <div><span style="color:${g.grid}">■</span> ${s.gridLabel}: ${T.grid_to_load.toFixed(2)} kW</div>
        <div><span style="color:${g.charge}">■</span> Charging: ${T.solar_to_charge.toFixed(2)} kW</div>
        <div style="margin-top:5px;padding-top:5px;border-top:1px solid #374151;color:#A8B4C4;font-size:10px">Battery Level (SoC): ${T.soc_pct.toFixed(1)}%</div>
      `}}),t.addEventListener("mouseleave",()=>{S&&(S.style.display="none")})}const se=e=>"₦"+Number(e).toLocaleString("en-NG");function Kt(e,s){const t=R();if(!t.results){s("step1");return}const{savings:n}=t.results;t.appliances&&t.appliances.length>0;const i=a=>`<span class="confidence-tooltip-wrap" style="display:inline-flex;vertical-align:middle;margin-left:4px"><button class="confidence-tooltip-btn" type="button">?</button><span class="confidence-tooltip-box">${a}</span></span>`;e.innerHTML=`
    <div style="padding:40px 40px 60px">
      <div class="card cost-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
          <div>
            <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Cost Savings Breakdown</h2>
            <p style="color:var(--color-text-secondary);font-size:16px">See how much you save overtime with solar power</p>
          </div>
        </div>

        <div class="savings-kpi-grid">
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Current Energy Cost ${i("The average cost you pay per kWh right now, based on your current grid tariff and/or generator fuel spend.")}</div>
              <div class="savings-kpi__value">${se(n.current_blended_cost)}/kWh <span class="savings-kpi__arrow-up">↑</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/current_blended_cost.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Energy Cost with Solar ${i("Your estimated cost per kWh after solar is installed, blending the solar generation cost with any remaining grid or generator usage.")}</div>
              <div class="savings-kpi__value">${se(n.post_solar_blended_cost)}/kWh <span class="savings-kpi__arrow-down">↓</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/solar_blended_cost.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Annual Fuel Savings ${i("How much you save on generator fuel each year by replacing that consumption with solar power.")}</div>
              <div class="savings-kpi__value">${se(n.fuel_naira_saved_annual)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">${(n.litres_saved_per_year||0).toLocaleString()} Lt Saved/Year</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/fuel_savings.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">ROI ${i("Total return on investment over 25 years. Calculated as total savings minus total costs, as a percentage of the initial system cost.")}</div>
              <div class="savings-kpi__value">${n.ROI}%</div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/return_on_investment.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Payback Period ${i("How many years before your accumulated energy savings fully recover the cost of the solar system.")}</div>
              <div class="savings-kpi__value">${n.payback_exact} Years</div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/payback_period.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Energy Bill Savings ${i("Your estimated net saving in energy costs each year after switching to solar, based on the difference between your current energy spend and your projected post-solar spend.")}</div>
              <div class="savings-kpi__value">${se(n.annual_savings)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">Per Year</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/annual_savings.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
        </div>

        <div class="savings-env-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;margin-top:0">
          <div class="card">
            <div class="savings-kpi" style="border:none;padding:0">
              <div>
                <div class="savings-kpi__label">Lifetime Savings ${i("Your total net savings over 25 years, after deducting the initial system cost and a battery replacement at year 10.")}</div>
                <div class="savings-kpi__value">${se(n.lifetime_savings)}</div>
                <div class="savings-kpi__sub"><span class="pill--amber">Over 25 Years</span></div>
              </div>
              <div class="savings-kpi__icon"><img src="/icons/lifetime_savings.png" width="64" height="64" style="object-fit:contain"></div>
            </div>
          </div>
          <div class="card">
            <div class="savings-kpi" style="border:none;padding:0">
              <div>
                <div class="savings-kpi__label">Carbon Emission Avoided ${i("The CO₂ emissions your solar system prevents each year by replacing fossil fuel electricity with clean solar energy.")}</div>
                <div class="savings-kpi__value">${n.co2_avoided_tonnes} tCO₂/Year</div>
              </div>
              <div class="savings-kpi__icon"><img src="/icons/emissions_avoided.png" width="64" height="64" style="object-fit:contain"></div>
            </div>
          </div>
        </div>

        <div class="savings-bottom-grid">
          <div class="card">
            <div class="section-title" style="margin-bottom:16px">25-Year Cumulative Savings</div>
            <div style="position:relative">
              <canvas id="cashflow-chart" style="width:100%;height:280px;display:block"></canvas>
              <div id="cashflow-tooltip" style="display:none;position:absolute;background:rgba(17,24,39,0.88);color:#fff;font-size:11px;padding:5px 9px;border-radius:6px;pointer-events:none;white-space:nowrap;font-family:Outfit,sans-serif"></div>
            </div>
            <div style="display:flex;gap:20px;justify-content:center;margin-top:10px">
              <span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280">
                <span style="display:inline-block;width:22px;height:2.5px;background:#FCBF1E;border-radius:2px"></span>
                Cumulative Cash Flow
              </span>
              <span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280">
                <span style="display:inline-block;width:22px;border-top:1.5px dashed #9CA3AF"></span>
                Break-even Line
              </span>
            </div>
          </div>
          <div class="card">
            <div class="section-title" style="margin-bottom:16px">Cost Comparison</div>
            <canvas id="compare-chart" height="200"></canvas>
          </div>
        </div>

      </div>

    </div>

  `,window._navigate=s,document.querySelectorAll(".confidence-tooltip-wrap").forEach(a=>{var r;(r=a.querySelector(".confidence-tooltip-btn"))==null||r.addEventListener("click",o=>{o.stopPropagation();const c=a.classList.contains("is-open");document.querySelectorAll(".confidence-tooltip-wrap.is-open").forEach(m=>m.classList.remove("is-open")),c||a.classList.add("is-open")})}),document.addEventListener("click",()=>{document.querySelectorAll(".confidence-tooltip-wrap.is-open").forEach(a=>a.classList.remove("is-open"))}),ks(n),xs(n)}function ks(e){const s=document.getElementById("cashflow-chart");if(!s)return;const t=window.devicePixelRatio||1,n=s.offsetWidth||Math.min(window.innerWidth-32,500),i=280;s.width=n*t,s.height=i*t;const a=s.getContext("2d");a.scale(t,t);const r=e.cashflow,o=76,c=88,m=28,u=38,f=n-o-c,h=i-m-u,p=r.map(_=>_.cumulative),l=Math.min(...p),d=Math.max(...p),y=(d-l)*.1||Math.abs(l)*.1||1e5,E=l-y,$=d+y,w=$-E||1,C=_=>o+_/25*f,x=_=>m+(1-(_-E)/w)*h,g=x(0),v=r.map(_=>({x:C(_.year),y:x(_.cumulative),year:_.year,cumulative:_.cumulative})),k=v[v.length-1],S=_=>{const q=Math.abs(_),W=_<0?"-₦":"₦";return q>=1e6?`${W}${(q/1e6).toFixed(1)}M`:q>=1e3?`${W}${Math.round(q/1e3)}k`:`${W}${Math.round(q)}`},M=5,L=Array.from({length:M+1},(_,q)=>E+($-E)*(q/M));a.save(),a.setLineDash([3,4]),a.strokeStyle="#F3F4F6",a.lineWidth=1,L.forEach(_=>{const q=x(_);q<m||q>m+h||(a.beginPath(),a.moveTo(o,q),a.lineTo(o+f,q),a.stroke())}),a.restore(),a.fillStyle="#9CA3AF",a.textAlign="right",a.font="10px Outfit, sans-serif",L.forEach(_=>{const q=x(_);q<m-4||q>m+h+4||a.fillText(S(_),o-7,q+3.5)}),a.strokeStyle="#E5E7EB",a.lineWidth=1,a.setLineDash([]),a.beginPath(),a.moveTo(o,m),a.lineTo(o,m+h),a.stroke();const b=Math.min(Math.max(g,m),m+h);b<m+h&&(a.save(),a.beginPath(),a.rect(o,b,f,m+h-b),a.clip(),a.beginPath(),a.moveTo(v[0].x,v[0].y),v.forEach(_=>a.lineTo(_.x,_.y)),a.lineTo(k.x,b),a.lineTo(v[0].x,b),a.closePath(),a.fillStyle="rgba(232,72,85,0.10)",a.fill(),a.restore()),b>m&&(a.save(),a.beginPath(),a.rect(o,m,f,b-m),a.clip(),a.beginPath(),a.moveTo(v[0].x,v[0].y),v.forEach(_=>a.lineTo(_.x,_.y)),a.lineTo(k.x,b),a.lineTo(v[0].x,b),a.closePath(),a.fillStyle="rgba(34,197,94,0.10)",a.fill(),a.restore()),g>=m&&g<=m+h&&(a.save(),a.setLineDash([6,4]),a.strokeStyle="#9CA3AF",a.lineWidth=1.5,a.beginPath(),a.moveTo(o,g),a.lineTo(o+f,g),a.stroke(),a.restore(),a.fillStyle="#9CA3AF",a.font="bold 10px Outfit, sans-serif",a.textAlign="left",a.fillText("Investment Line",o+f+5,g+4)),a.strokeStyle="#E5E7EB",a.lineWidth=1,a.setLineDash([]),a.beginPath(),a.moveTo(o,m+h),a.lineTo(o+f,m+h),a.stroke(),a.beginPath(),a.moveTo(v[0].x,v[0].y),v.forEach(_=>a.lineTo(_.x,_.y)),a.strokeStyle="#FCBF1E",a.lineWidth=2.5,a.lineJoin="round",a.setLineDash([]),a.stroke(),v.forEach(_=>{a.beginPath(),a.arc(_.x,_.y,2.5,0,Math.PI*2),a.fillStyle="#FCBF1E",a.fill()});const A=e.payback_exact,F=A!=null&&A<99&&A>=0;if(F){const _=C(A),q=x(0);a.beginPath(),a.arc(_,q,7,0,Math.PI*2),a.fillStyle="#22C55E",a.fill(),a.strokeStyle="#fff",a.lineWidth=2,a.stroke()}if(F){const _=C(A),q=x(0);a.fillStyle="#16A34A",a.font="bold 10px Outfit, sans-serif";const W=_+84>o+f;a.textAlign=W?"right":"center",a.fillText(`Payback: Year ${A}`,W?_-10:_,Math.max(m+14,q-14))}a.fillStyle="#6B7280",a.font="10px Outfit, sans-serif",a.textAlign="center",a.setLineDash([]),[0,3,5,10,15,20,25].forEach(_=>{const q=C(_);a.fillText(`Yr ${_}`,q,m+h+22),a.strokeStyle="#D1D5DB",a.lineWidth=1,a.beginPath(),a.moveTo(q,m+h),a.lineTo(q,m+h+5),a.stroke()}),a.fillStyle="#9CA3AF",a.font="10px Outfit, sans-serif",a.textAlign="center",a.fillText("Year",o+f/2,m+h+36);const T=document.getElementById("cashflow-tooltip");T&&(s.addEventListener("mousemove",_=>{const q=s.getBoundingClientRect(),W=_.clientX-q.left;let I=null,j=1/0;if(v.forEach(H=>{const J=Math.abs(H.x-W);J<j&&(j=J,I=H)}),I&&j<22){const H=I.cumulative>=0?"+":"";T.style.left=I.x+10+"px",T.style.top=Math.max(4,I.y-48)+"px",T.style.display="block";const J=I.year===10?`<div style="color:#FCA5A5;margin-top:3px">Battery replacement: -${se(e.battery_replacement_cost)}</div>`:"";T.innerHTML=`<div>Year ${I.year}: ${H}${se(I.cumulative)}</div>${J}`}else T.style.display="none"}),s.addEventListener("mouseleave",()=>{T.style.display="none"}))}function xs(e){var t;const s=(t=document.getElementById("compare-chart"))==null?void 0:t.getContext("2d");s&&new Chart(s,{type:"bar",data:{labels:[e.current_label||"Grid+Gen",e.solar_label||"Solar"],datasets:[{data:[e.current_monthly_cost,e.post_solar_monthly_cost],backgroundColor:["#E74C3C","#1B4F72"],borderRadius:6,barThickness:60}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:n=>`₦${Number(n.raw).toLocaleString()}`}}},scales:{x:{grid:{display:!1},title:{display:!0,text:"Monthly Cost Scenario",font:{size:11,family:"Outfit, sans-serif"}},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},suggestedMax:Math.max(e.current_monthly_cost,e.post_solar_monthly_cost)*1.4,ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:n=>`₦${(n/1e3).toFixed(0)}k`}}}},plugins:[{id:"barValueLabels",afterDatasetsDraw(n){const{ctx:i,data:a}=n,r=n.getDatasetMeta(0);i.save(),i.font="bold 11px Outfit, sans-serif",i.textAlign="center",i.textBaseline="bottom",r.data.forEach((o,c)=>{const m=a.datasets[0].data[c];i.fillStyle="#374151",i.fillText("₦"+Number(m).toLocaleString("en-NG"),o.x,o.y-4)}),i.restore()}}]})}function Yt(e,s){var t,n;e.innerHTML=`
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
  `,(t=e.querySelector("#cta-installers-btn"))==null||t.addEventListener("click",()=>Ta("Finding installers near you…",1800,()=>s("market"))),(n=e.querySelector("#cta-adjust-btn"))==null||n.addEventListener("click",()=>s("step1"))}function _s(e){const s=document.getElementById("modal-root");s.innerHTML=`<div class="modal-overlay" id="modal-overlay">${e}</div>`,s.querySelector("#modal-overlay").addEventListener("click",t=>{t.target===t.currentTarget&&Fe()}),document.addEventListener("keydown",Vt)}function Fe(){const e=document.getElementById("modal-root");e.innerHTML="",document.removeEventListener("keydown",Vt)}function Vt(e){e.key==="Escape"&&Fe()}function ws({title:e,subtitle:s="",body:t,footer:n}){return`
    <div class="modal">
      <div class="modal__header">
        <div>
          <div class="modal__title">${e}</div>
          ${s?`<div class="modal__subtitle">${s}</div>`:""}
        </div>
        <button class="modal__close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal__body">${t}</div>
      ${`<div class="modal__footer">${n}</div>`}
    </div>
  `}function Ss(){var e;(e=document.getElementById("modal-close-btn"))==null||e.addEventListener("click",Fe)}const Ct=["Work From Home","Office Worker","Night Shift","Stay-at-Home","Student","Weekend"],Es={Cooling:"#3B82F6",Lighting:"#FCBF1E",Kitchen:"#F59E0B",Entertainment:"#8B5CF6","ICT / Office":"#06B6D4",Laundry:"#10B981",Water:"#0EA5E9",Security:"#EF4444"};function $s(e,s){switch(s){case"Cooling":return/fan/i.test(e)?"Ceiling Fan":/\b1hp\b/i.test(e)?"AC – Bedroom":"AC – Living Room";case"Lighting":return"Lighting";case"Entertainment":return"Television";case"ICT / Office":return"Laptop / PC";case"Laundry":return/washing/i.test(e)?"Washing Machine":null;case"Kitchen":return/refrig|freezer/i.test(e)?"Refrigerator":/kettle/i.test(e)?"Electric Kettle":null;case"Water":return/pump/i.test(e)?"Water Pump":null;case"Security":return"Always On";default:return null}}function As(e){const s=[];let t=!1,n=0;for(let i=0;i<24;i++)e[i]>=.5&&!t?(t=!0,n=i):e[i]<.5&&t&&(s.push({start:n,end:i}),t=!1);return t&&s.push({start:n,end:24}),s.length?s:[{start:8,end:10}]}function Mt(e,s,t){if(!t)return[{start:8,end:10}];const n=$s(e,s),i=n&&t.schedule[n];return i?As(i):[{start:8,end:10}]}function _e(e){return Math.round(e*2)/2}function ve(e){const s=Math.floor(e)%24;return s===0?"12am":s<12?`${s}am`:s===12?"12pm":`${s-12}pm`}const P={active:!1,type:null,rowIdx:null,segIdx:null,startX:null,origStart:null,origEnd:null,trackWidth:null};function Ls(e,s){const t=document.getElementById(e);if(!t)return()=>{};const n=N("usage_patterns")||[];let i=R().usagePattern||Ct[0];const a=R().customSchedule||[],r=Object.fromEntries(a.map(l=>[l.name,l])),o=n.find(l=>l.pattern===i);let c=s.map(l=>r[l.name]?{...r[l.name],segments:r[l.name].segments.map(d=>({...d}))}:{name:l.name,category:l.category||"",segments:Mt(l.name,l.category||"",o)});function m(){D({customSchedule:c.map(l=>({...l,segments:l.segments.map(d=>({...d}))}))})}function u(){const l=t.querySelector(".gantt-body");l&&(l.innerHTML=c.map((d,y)=>{const E=Es[d.category]||"#9CA3AF",$=d.segments.map((w,C)=>{const x=(w.start/24*100).toFixed(3),g=Math.max(.5,(w.end-w.start)/24*100).toFixed(3);return`
          <div class="gantt-bar" data-ri="${y}" data-si="${C}"
               style="left:${x}%;width:${g}%;background:${E}">
            <div class="gantt-bar__handle gantt-bar__handle--left" data-type="resize-left"></div>
            <div class="gantt-bar__label">${ve(w.start)}–${ve(w.end)}</div>
            <div class="gantt-bar__del" title="Remove">×</div>
            <div class="gantt-bar__handle gantt-bar__handle--right" data-type="resize-right"></div>
          </div>`}).join("");return`
        <div class="gantt-row">
          <div class="gantt-row__label" title="${d.name}">${d.name}</div>
          <div class="gantt-row__track" data-ri="${y}" style="background:${E}22">${$}</div>
        </div>`}).join(""),f())}function f(){t.querySelectorAll(".gantt-bar__del").forEach(l=>{l.addEventListener("click",d=>{d.stopPropagation();const y=l.closest(".gantt-bar");c[+y.dataset.ri].segments.splice(+y.dataset.si,1),m(),u()})}),t.querySelectorAll(".gantt-bar").forEach(l=>{l.addEventListener("contextmenu",d=>{d.preventDefault(),c[+l.dataset.ri].segments.splice(+l.dataset.si,1),m(),u()}),l.addEventListener("mousedown",d=>{if(d.target.classList.contains("gantt-bar__handle")||d.target.classList.contains("gantt-bar__del"))return;d.preventDefault();const y=+l.dataset.ri,E=+l.dataset.si;P.active=!0,P.type="move",P.rowIdx=y,P.segIdx=E,P.startX=d.clientX,P.origStart=c[y].segments[E].start,P.origEnd=c[y].segments[E].end,P.trackWidth=l.closest(".gantt-row__track").getBoundingClientRect().width})}),t.querySelectorAll(".gantt-bar__handle").forEach(l=>{l.addEventListener("mousedown",d=>{d.preventDefault(),d.stopPropagation();const y=l.closest(".gantt-bar"),E=+y.dataset.ri,$=+y.dataset.si;P.active=!0,P.type=l.dataset.type,P.rowIdx=E,P.segIdx=$,P.startX=d.clientX,P.origStart=c[E].segments[$].start,P.origEnd=c[E].segments[$].end,P.trackWidth=y.closest(".gantt-row__track").getBoundingClientRect().width})}),t.querySelectorAll(".gantt-row__track").forEach(l=>{l.addEventListener("dblclick",d=>{if(d.target!==l)return;const y=+l.dataset.ri,E=l.getBoundingClientRect(),$=_e((d.clientX-E.left)/E.width*24),w=Math.max(0,Math.min(22,$));c[y].segments.push({start:w,end:Math.min(24,w+2)}),m(),u()})})}function h(l){if(!P.active)return;const d=(l.clientX-P.startX)/P.trackWidth*24,{type:y,rowIdx:E,segIdx:$}=P,w=c[E].segments[$],C=P.origEnd-P.origStart;if(y==="move"){const g=Math.max(0,Math.min(24-C,_e(P.origStart+d)));w.start=g,w.end=g+C}else y==="resize-left"?w.start=Math.max(0,Math.min(P.origEnd-.5,_e(P.origStart+d))):w.end=Math.min(24,Math.max(P.origStart+.5,_e(P.origEnd+d)));const x=t.querySelector(`.gantt-bar[data-ri="${E}"][data-si="${$}"]`);if(x){x.style.left=`${(w.start/24*100).toFixed(3)}%`,x.style.width=`${Math.max(.5,(w.end-w.start)/24*100).toFixed(3)}%`;const g=x.querySelector(".gantt-bar__label");g&&(g.textContent=`${ve(w.start)}–${ve(w.end)}`)}}function p(){P.active&&(P.active=!1,m())}return document.addEventListener("mousemove",h),document.addEventListener("mouseup",p),t.innerHTML=`
    <div class="gantt-wrap">
      <div class="gantt-header">
        <div class="section-title" style="margin:0">Customise Your Usage Schedule</div>
        <div class="gantt-pattern-row">
          <label class="gantt-pattern-label">Usage pattern</label>
          <select class="gantt-select" id="gantt-pattern-sel">
            ${Ct.map(l=>`<option value="${l}" ${i===l?"selected":""}>${l}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="gantt-timeline-header">
        <div class="gantt-label-col"></div>
        <div class="gantt-hours-track">
          ${[0,3,6,9,12,15,18,21,24].map(l=>`<span class="gantt-hour-label" style="left:${(l/24*100).toFixed(2)}%">${ve(l)}</span>`).join("")}
        </div>
      </div>
      <div class="gantt-body"></div>
      <p class="gantt-hint">Drag bars to move · Drag edges to resize · Click empty track to add · Right-click or × to delete</p>
    </div>`,document.getElementById("gantt-pattern-sel").addEventListener("change",l=>{i=l.target.value,D({usagePattern:i});const d=n.find(y=>y.pattern===i);c=c.map(y=>({...y,segments:Mt(y.name,y.category,d)})),m(),u()}),u(),m(),function(){document.removeEventListener("mousemove",h),document.removeEventListener("mouseup",p)}}const Ne=e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;");function Ut(e){return{Cooling:"❄️",Lighting:"💡",Kitchen:"🍳",Entertainment:"📺","ICT / Office":"💻",Laundry:"🫧",Water:"💧",Security:"🔒"}[e]||"🔌"}function Cs(e,s){const t={};s.forEach(i=>{t[i.name]=i});const n=e.map(i=>{const a=t[i.name],r=a?a.qty:0;return`
      <div class="appliance-modal-row">
        <div class="checkbox ${a?"checked":""}" data-name="${Ne(i.name)}"></div>
        <div class="appliance-modal-row__img-placeholder">${Ut(i.category)}</div>
        <div style="flex:1">
          <div class="appliance-modal-row__name">${i.name}</div>
          <div class="appliance-modal-row__watts">${i.rated_watts}W · ${i.typical_daily_hours}h/day</div>
        </div>
        <div class="counter" data-name="${Ne(i.name)}">
          <button class="counter__btn" data-action="dec">−</button>
          <span class="counter__val">${r}</span>
          <button class="counter__btn" data-action="inc">+</button>
        </div>
      </div>
    `}).join("");return ws({title:"Choose specific appliances",subtitle:"You can select multiple appliances",body:n,footer:'<button class="btn btn--primary btn--full" id="add-appliances-confirm">Add Appliances</button>'})}const Ms=`
  <div class="assumptions-overlay" id="why-appliances-overlay" role="dialog" aria-modal="true">
    <div class="modal-card" style="max-width:460px">
      <div class="modal-header">
        <h3 class="modal-title">Make your results more accurate</h3>
        <button class="modal-close" id="why-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:14px;line-height:1.7;color:var(--color-text-secondary);margin:0 0 20px">
          Your estimate is based on spending data alone. Tell us which appliances you run and when, and we will calculate a precise load profile and upgrade your confidence score from <strong style="color:var(--color-error)">Low</strong> to <strong style="color:var(--color-success)">High</strong>.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div class="appliance-prompt-feature">
            <span style="font-size:26px">📊</span>
            <div><div class="appliance-prompt-feature__title">Hourly load curve</div><div class="appliance-prompt-feature__desc">See exactly when your home draws the most power</div></div>
          </div>
          <div class="appliance-prompt-feature">
            <span style="font-size:26px">📅</span>
            <div><div class="appliance-prompt-feature__title">Seasonal forecast</div><div class="appliance-prompt-feature__desc">Understand your peak and low consumption months</div></div>
          </div>
          <div class="appliance-prompt-feature">
            <span style="font-size:26px">🎯</span>
            <div><div class="appliance-prompt-feature__title">Right-sized solar system</div><div class="appliance-prompt-feature__desc">Panel count, battery, and inverter sized to your real usage</div></div>
          </div>
        </div>
      </div>
      <div class="modal-footer" style="justify-content:flex-end">
        <button class="btn btn--primary btn--lg" id="why-cta-btn" style="width:100%">Got it, let me add my appliances</button>
      </div>
    </div>
  </div>
`,Fs={bungalow:9,duplex:14,terrace:20},Ft={"9W":2,"15W":1};function Ts(e,s,t){const n=(t[e]||[]).filter(a=>!a.name.startsWith("LED Bulb")),i=s&&s>0?s:Fs[e]||9;return[...n,{name:"LED Bulb (9W)",qty:i*Ft["9W"]},{name:"LED Bulb (15W)",qty:i*Ft["15W"]}]}function qs(e,s){const t=N("appliances")||[],n=N("house_type_appliances")||{};let i=null;const a=[{id:"bungalow",emoji:'<img src="/icons/bungalow.png" width="72" height="72" style="object-fit:contain">',name:"Bungalow"},{id:"duplex",emoji:'<img src="/icons/duplex_home_type.png" width="72" height="72" style="object-fit:contain">',name:"Duplex"},{id:"terrace",emoji:'<img src="/icons/terrace_house_type.png" width="72" height="72" style="object-fit:contain">',name:"Terrace House"}];function r(){i&&(i(),i=null);const l=R();e.innerHTML=`
      <div style="display:flex;flex-direction:column;min-height:100%">
      <div id="add-appliances-content" style="flex:1;padding:40px 40px 32px">
        <div style="margin-bottom:32px">
          <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Home Profile &amp; Appliances</h2>
          <p style="color:var(--color-text-secondary);font-size:16px">Add your appliances to sharpen your solar recommendation</p>
        </div>

        <div class="section-title" style="margin-bottom:14px">Choose your house type</div>
        <div class="radio-cards" id="house-type-cards">
          ${a.map(d=>`
            <div class="radio-card ${l.houseType===d.id?"selected":""}" data-value="${d.id}" style="align-items:center">
              <div class="radio-card__radio"></div>
              <div class="radio-card__img-placeholder">${d.emoji}</div>
              <div class="radio-card__name">${d.name}</div>
              ${l.houseType===d.id?`
                <div class="rooms-counter">
                  <span class="rooms-counter__label">Rooms</span>
                  <button class="rooms-counter__btn" id="rooms-dec">–</button>
                  <span class="rooms-counter__val" id="rooms-val">${l.rooms}</span>
                  <button class="rooms-counter__btn" id="rooms-inc">+</button>
                </div>
              `:""}
            </div>
          `).join("")}
        </div>

        <div class="section-title" style="margin-top:28px;margin-bottom:12px">Select your home appliances</div>
        <div class="appliances-list" id="appliances-list">
          ${l.appliances.map(d=>`
            <div class="appliance-chip">
              ${Ut(d.category||"")} ${d.name} ×${d.qty}
              <span class="appliance-chip__remove" data-name="${Ne(d.name)}">×</span>
            </div>
          `).join("")}
        </div>
        <div class="add-appliances-box" id="add-appliances-btn">
          <span class="add-appliances-box__icon">＋</span>
          <span class="add-appliances-box__label">Add appliances</span>
        </div>

        ${l.appliances.length>0?'<div id="gantt-section" style="margin-top:32px"></div>':""}
      </div>
      <div class="step-footer" style="padding-left:40px;padding-right:40px">
        <button class="btn btn--primary btn--lg" id="done-btn">Update Results →</button>
      </div>
      </div>
    `,o(),l.appliances.length>0&&(i=Ls("gantt-section",l.appliances))}function o(){var l,d;document.getElementById("done-btn").addEventListener("click",()=>{i&&(i(),i=null),Me(),s("solarPVSystem")}),document.querySelectorAll("#house-type-cards .radio-card").forEach(y=>{y.addEventListener("click",E=>{E.target.closest(".rooms-counter")||(D({houseType:y.dataset.value}),r())})}),(l=document.getElementById("rooms-dec"))==null||l.addEventListener("click",()=>{D({rooms:Math.max(0,R().rooms-1)}),document.getElementById("rooms-val").textContent=R().rooms}),(d=document.getElementById("rooms-inc"))==null||d.addEventListener("click",()=>{D({rooms:R().rooms+1}),document.getElementById("rooms-val").textContent=R().rooms}),document.querySelectorAll(".appliance-chip__remove").forEach(y=>{y.addEventListener("click",E=>{E.stopPropagation(),D({appliances:R().appliances.filter($=>$.name!==y.dataset.name)}),r()})}),document.getElementById("add-appliances-btn").addEventListener("click",()=>{const y=R(),E=y.houseType&&y.appliances.length===0?Ts(y.houseType,y.rooms,n):y.appliances;_s(Cs(t,E)),Ss(),c(t,E)})}function c(l,d){const y={};(d||R().appliances).forEach($=>{const w=l.find(C=>C.name===$.name);y[$.name]=w?{...w,qty:$.qty||1}:{...$}}),document.querySelectorAll(".appliance-modal-row").forEach($=>{const w=$.querySelector(".checkbox"),C=$.querySelector(".counter"),x=w.dataset.name,g=l.find(v=>v.name===x);!y[x]&&w.classList.contains("checked")&&(y[x]={...g,qty:1}),w.addEventListener("click",()=>{w.classList.toggle("checked"),w.classList.contains("checked")?(y[x]={...g,qty:parseInt(C.querySelector(".counter__val").textContent)||1},C.querySelector(".counter__val").textContent=y[x].qty):delete y[x]}),C.querySelectorAll(".counter__btn").forEach(v=>{v.addEventListener("click",()=>{const k=C.querySelector(".counter__val");let S=parseInt(k.textContent)||0;v.dataset.action==="inc"?(S++,w.classList.add("checked")):(S=Math.max(0,S-1),S===0&&w.classList.remove("checked")),k.textContent=S,S>0?y[x]={...g,qty:S}:delete y[x]})})}),document.getElementById("add-appliances-confirm").addEventListener("click",()=>{const $=Object.values(y).filter(C=>C.qty>0),w=new Set($.map(C=>C.name));D({appliances:$,customSchedule:R().customSchedule?R().customSchedule.filter(C=>w.has(C.name)):null}),Fe(),r()})}const m=document.createElement("div");m.innerHTML=Ms,document.body.appendChild(m.firstElementChild);const u=document.getElementById("why-appliances-overlay");let h=(R().appliances||[]).length>0?null:setTimeout(()=>{u&&u.classList.add("assumptions-overlay--visible")},2e3);function p(){u&&u.remove(),clearTimeout(h)}setTimeout(()=>{var l,d;(l=document.getElementById("why-close-btn"))==null||l.addEventListener("click",p),(d=document.getElementById("why-cta-btn"))==null||d.addEventListener("click",p),u==null||u.addEventListener("click",y=>{y.target===u&&p()})},0),r()}const fe=[{id:"auxano",name:"Auxano Solar",init:"AX",district:"Garki",distance:4.6,rating:4.8,reviews:134,price:462e4,warranty:"5 years",warrantyScore:9,timeline:"7–10 days",speedScore:9,badge:"Best value",badgeKind:"value",mapX:56,mapY:66,jobs:"320+",years:8,repeat:"41%",response:"~2 hrs",tags:["Grid-tie & hybrid","Lithium battery","Post-install support"],panel:"Jinko 400W Mono PERC ×18",battery:"BYD LithiumFerro 10kWh",inverter:"Deye 8kVA Hybrid",aftercare:"12-month free maintenance",financing:"Available via partner banks",about:"Auxano Solar has been delivering reliable solar installations across Abuja since 2016. Specialising in residential and light-commercial hybrid systems, they hold a strong track record with over 320 completed projects. Their in-house engineering team handles everything from load assessment to commissioning, and their after-sales desk averages a 2-hour response time.",reviews_l:[{name:"Emeka O.",area:"Gwarinpa",date:"Mar 2024",stars:5,text:"Auxano installed our 8kVA system in just 9 days. The team was professional, clean, and the inverter has been running flawlessly for 6 months."},{name:"Aisha M.",area:"Garki II",date:"Jan 2024",stars:5,text:"Best solar experience I've had. They explained every component and the after-sales support is genuinely responsive. Highly recommend."},{name:"Chukwudi N.",area:"Maitama",date:"Nov 2023",stars:4,text:"Great installation quality. Took 10 days which was within their estimate. Would have given 5 stars but the initial quote took a while to arrive."}]},{id:"gve",name:"GVE Projects",init:"GV",district:"Jabi",distance:5.2,rating:4.6,reviews:88,price:44e5,warranty:"3 years",warrantyScore:6,timeline:"10–14 days",speedScore:6,badge:"Cheapest",badgeKind:"cheap",mapX:30,mapY:60,jobs:"210+",years:6,repeat:"33%",response:"~4 hrs",tags:["Budget-friendly","Grid-tie systems","Commercial experience"],panel:"Canadian Solar 380W Poly ×19",battery:"Felicity Lithium 9.6kWh",inverter:"Growatt 6kVA Hybrid",aftercare:"6-month free maintenance",financing:"Limited options",about:"GVE Projects is a well-established solar and renewable energy firm with offices in Abuja and Lagos. Known for cost-effective residential systems, they offer competitive pricing without compromising on safety standards. Their NABCEP-certified technicians serve both residential and small commercial clients across the FCT.",reviews_l:[{name:"Fatima B.",area:"Jabi",date:"Feb 2024",stars:5,text:"GVE gave us the best price of any installer we spoke to. Installation took 12 days but everything works perfectly."},{name:"Seun A.",area:"Kado Estate",date:"Dec 2023",stars:4,text:"Good value for money. The crew was friendly and explained the monitoring app clearly. A few small finishing touches were missed but rectified quickly."},{name:"Ngozi I.",area:"Wuse",date:"Oct 2023",stars:5,text:"Surprised by how smooth the process was. Quote arrived same day and installation was clean. Would use them again."}]},{id:"arnergy",name:"Arnergy Solar",init:"AR",district:"Maitama",distance:2.4,rating:4.9,reviews:212,price:485e4,warranty:"5 years",warrantyScore:9,timeline:"5–7 days",speedScore:10,badge:"Most trusted",badgeKind:"trust",mapX:58,mapY:34,jobs:"580+",years:11,repeat:"52%",response:"~1 hr",tags:["Premium installs","Real-time monitoring","Longest track record"],panel:"Arnergy 400W Mono PERC ×18",battery:"Arnergy Lithium 12kWh",inverter:"SMA Sunny Boy 8kVA",aftercare:"24-month premium care",financing:"In-house financing available",about:"Arnergy Solar is one of Nigeria's most recognised solar brands, with over a decade of experience and 580+ installations nationwide. Their proprietary monitoring platform gives homeowners real-time visibility into generation, consumption, and battery state. Arnergy operates a full in-house team — engineers to customer success — and offers the fastest installation timeline in Abuja.",reviews_l:[{name:"Dr. Bello T.",area:"Maitama",date:"Apr 2024",stars:5,text:"Arnergy is in a class of its own. The monitoring app is outstanding and their engineer called me personally to walk through the system. Worth every naira."},{name:"Chioma E.",area:"Asokoro",date:"Mar 2024",stars:5,text:"Installed in 6 days, just as promised. The system has cut my NEPA spend by over 80%. The 2-year maintenance plan gives real peace of mind."},{name:"Alhaji K.",area:"Wuse 2",date:"Jan 2024",stars:5,text:"Third solar system I've had installed across different properties and Arnergy was by far the most professional. Seamless from survey to switch-on."}]},{id:"sosai",name:"Sosai Renewable",init:"SO",district:"Utako",distance:4,rating:4.8,reviews:110,price:498e4,warranty:"5 years",warrantyScore:8,timeline:"8–11 days",speedScore:7,badge:"",badgeKind:"",mapX:68,mapY:54,jobs:"280+",years:9,repeat:"44%",response:"~3 hrs",tags:["Northern Nigeria specialist","Off-grid capable","Community projects"],panel:"Longi 405W Mono PERC ×18",battery:"Pylon Tech US3000 10kWh",inverter:"Victron MultiPlus 8kVA",aftercare:"12-month maintenance included",financing:"Available via partner banks",about:"Sosai Renewable Energies has built a reputation as Northern Nigeria's go-to solar integrator, with deep expertise in off-grid and hybrid systems suited to the region's climate. Their Abuja office handles FCT residential projects with the same rigour applied to their large rural electrification contracts. Strong on community trust and long-term reliability.",reviews_l:[{name:"Musa Y.",area:"Utako",date:"Mar 2024",stars:5,text:"Sosai understood exactly what a northern household needs. Sized the system for our AC load perfectly. The off-grid capability has been a lifesaver."},{name:"Hadiza A.",area:"Gwarinpa",date:"Feb 2024",stars:5,text:"Very thorough site survey and load analysis. They took time to explain our options and didn't oversell. System installed on schedule."},{name:"Ibrahim D.",area:"Life Camp",date:"Dec 2023",stars:4,text:"Solid installation and great battery choice. Response time was around 3 hours which is acceptable. Happy with the overall outcome."}]},{id:"bluecamel",name:"Blue Camel Energy",init:"BC",district:"Wuse 2",distance:3.1,rating:4.7,reviews:168,price:51e5,warranty:"4 years",warrantyScore:7,timeline:"6–9 days",speedScore:8,badge:"",badgeKind:"",mapX:40,mapY:40,jobs:"390+",years:10,repeat:"38%",response:"~2 hrs",tags:["Smart home integration","EV charging ready","App monitoring"],panel:"JA Solar 400W Bifacial ×18",battery:"BSLBATT 10kWh Lithium",inverter:"Huawei SUN2000 8kVA",aftercare:"18-month smart monitoring",financing:"Available via partner banks",about:"Blue Camel Energy brings a tech-forward approach to solar installations in Abuja. Known for seamless smart home integration and EV charging readiness, they appeal to progressive homeowners who want more than just power backup. Their Huawei-certified engineers and bifacial panel installations consistently yield higher generation than quoted estimates.",reviews_l:[{name:"Tunde F.",area:"Wuse 2",date:"Apr 2024",stars:5,text:"Blue Camel integrated our solar with our smart home setup flawlessly. The Huawei app shows me every kWh in real time. Superb work."},{name:"Adaeze M.",area:"Maitama",date:"Feb 2024",stars:5,text:"They set up EV charging alongside the solar system. Installation was clean and finished in 8 days. Very impressed with the tech expertise."},{name:"Rotimi P.",area:"Wuse 2",date:"Jan 2024",stars:4,text:"Great system, great monitoring. Price was higher than others but the bifacial panels are genuinely producing more than expected. Worth it."}]},{id:"rubitec",name:"Rubitec Solar",init:"RB",district:"Gwarinpa",distance:6.8,rating:4.9,reviews:96,price:545e4,warranty:"7 years",warrantyScore:10,timeline:"9–12 days",speedScore:6,badge:"Premium",badgeKind:"premium",mapX:24,mapY:22,jobs:"175+",years:7,repeat:"61%",response:"~1.5 hrs",tags:["7-year warranty","Premium components","Highest repeat rate"],panel:"SunPower 430W Maxeon ×17",battery:"Tesla Powerwall 13.5kWh",inverter:"SolarEdge SE8000H 8kVA",aftercare:"36-month premium care plan",financing:"Premium finance packages",about:"Rubitec Solar positions itself at the premium end of the Abuja market, using only tier-1 components from SunPower, Tesla, and SolarEdge. Their 7-year warranty is the longest offered by any installer in this comparison, and their 61% repeat-customer rate speaks to the quality of their long-term service relationship. Ideal for homeowners who want the best without compromise.",reviews_l:[{name:"Senator O.",area:"Gwarinpa Estate",date:"Mar 2024",stars:5,text:"Rubitec fitted a Tesla Powerwall system that simply works. No drama, no comebacks. The 7-year warranty sealed it for me. Premium price, premium product."},{name:"Mrs. Adeyemi",area:"Lifecamp",date:"Jan 2024",stars:5,text:"The SunPower panels are visibly better quality than what I've seen on neighbours' roofs. Rubitec's team are courteous and highly skilled."},{name:"Engr. Lawal",area:"Gwarinpa",date:"Nov 2023",stars:5,text:"Third time using Rubitec across different properties. Consistently excellent. The SolarEdge optimizer setup gives impressive per-panel data."}]}];function he(e){const s=e.map(i=>i.price),t=Math.min(...s),n=Math.max(...s);return e.map(i=>{const a=10*(1-(i.price-t)/(n-t)),r=(i.rating-4.5)/.5*10,o=a*4+i.warrantyScore*3+i.speedScore*1.5+r*1.5;return{...i,score:Math.round(o)}})}const O=e=>"₦"+Math.round(e).toLocaleString("en-NG"),Bs=e=>"₦"+(e/1e6).toFixed(2)+"M";function Rs(e){e.width=1500,e.height=1500;const t=e.getContext("2d");let n=20260626;const i=()=>(n=n*1664525+1013904223>>>0)/4294967296,a=(v,k)=>v+(k-v)*i(),r="#E8E1D1",o="#F1EFE9",c="#C7DCA8",m="#A9C9E3",u="#FAF8F3",f="#E6E3D9",h="#FFFFFF",p="#CED7DE",l="#F4E4A0",d="#E1C775";function y(v,k,S,M,L){const b=Array.from({length:L},(A,F)=>{const T=F/L*Math.PI*2,_=S*(1-M+i()*M*2);return[v+Math.cos(T)*_,k+Math.sin(T)*_]});t.beginPath();for(let A=0;A<=L;A++){const F=b[A%L],T=b[(A+1)%L],_=[(F[0]+T[0])/2,(F[1]+T[1])/2];A===0?t.moveTo(_[0],_[1]):t.quadraticCurveTo(F[0],F[1],_[0],_[1])}t.closePath()}function E(v){t.beginPath(),t.moveTo(v[0][0],v[0][1]);for(let k=1;k<v.length;k++){const S=[(v[k-1][0]+v[k][0])/2,(v[k-1][1]+v[k][1])/2];t.quadraticCurveTo(v[k-1][0],v[k-1][1],S[0],S[1])}t.lineTo(v.at(-1)[0],v.at(-1)[1])}function $(v,k,S,M,L){t.beginPath();for(let A=0;A<=6;A++){const F=A/6;let T=v+(S-v)*F,_=k+(M-k)*F;const q=-(M-k),W=S-v,I=Math.hypot(q,W)||1,j=(i()-.5)*L;T+=q/I*j,_+=W/I*j,A===0?t.moveTo(T,_):t.lineTo(T,_)}}function w(v,k,S){const M=a(0,Math.PI),L=a(36,60),b=a(42,72),A=a(2,7);t.save(),y(v,k,S,.45,10),t.clip(),t.fillStyle=o,t.fillRect(v-S-50,k-S-50,(S+50)*2,(S+50)*2),t.translate(v,k),t.rotate(M);const F=S+80;t.lineCap="round";for(let T=0;T<2;T++){t.strokeStyle=T===0?f:u,t.lineWidth=T===0?4.5:2.6;for(let _=-F;_<=F;_+=L)$(_,-F,_+a(-12,12),F,A),t.stroke();for(let _=-F;_<=F;_+=b)$(-F,_,F,_+a(-12,12),A),t.stroke()}t.restore()}function C(v,k){E(v),t.strokeStyle=p,t.lineWidth=k+5,t.stroke(),E(v),t.strokeStyle=h,t.lineWidth=k,t.stroke()}t.fillStyle=r,t.fillRect(0,0,1500,1500),t.save(),y(180,160,280,.5,10),t.fillStyle=r,t.fill(),t.restore(),[[1050,360,300],[1080,760,340],[1180,1120,300],[760,560,250],[640,980,260],[420,1180,240],[260,560,260],[180,920,230],[980,1240,220],[1300,560,200]].forEach(([v,k,S])=>w(v,k,S)),t.lineCap="round",[[1320,980,150],[560,300,120],[360,1320,160],[1180,180,130]].forEach(([v,k,S])=>{t.save(),y(v,k,S,.4,9),t.fillStyle=c,t.fill(),t.restore()});const x=[[-40,260],[260,420],[520,700],[600,1e3],[520,1320],[560,1560]];t.lineCap="round",E(x),t.strokeStyle="#9DC0DD",t.lineWidth=30,t.stroke(),E(x),t.strokeStyle=m,t.lineWidth=24,t.stroke(),C([[760,-40],[820,260],[900,560],[1040,900],[1140,1240],[1200,1560]],11),C([[1560,360],[1180,520],[820,640],[460,720],[-40,760]],10),C([[1560,1080],[1180,980],[820,1020],[440,1140],[-40,1180]],9),C([[300,-40],[360,360],[300,760],[420,1160],[360,1560]],8),C([[-40,1380],[400,1300],[820,1360],[1240,1300],[1560,1360]],8);const g=[[-90,700],[280,540],[700,360],[1120,200],[1600,30]];E(g),t.strokeStyle=d,t.lineWidth=34,t.stroke(),E(g),t.strokeStyle=l,t.lineWidth=27,t.stroke(),E(g),t.strokeStyle=d,t.lineWidth=2.5,t.setLineDash([16,18]),t.stroke(),t.setLineDash([])}const Ws={chip:"Lagos · ~8km radius",labels:["Lekki","Ikeja","Victoria Island","Surulere","Yaba","Ajah","Festac","Magodo"],installerAreas:{auxano:"Lekki",gve:"Ikeja",arnergy:"Victoria Island",sosai:"Surulere",bluecamel:"Yaba",rubitec:"Ajah"}},Is={chip:"Kano · ~8km radius",labels:["Nassarawa","Fagge","Gwale","Tarauni","Kumbotso","Ungogo","Dala","Giginyu"],installerAreas:{auxano:"Nassarawa",gve:"Fagge",arnergy:"Gwale",sosai:"Tarauni",bluecamel:"Ungogo",rubitec:"Dala"}},Ps={chip:"Maiduguri · ~8km radius",labels:["Maisandari","Gwange","Bolori","Jere","Kawuri","Lamisula","Gamboru","Kula"],installerAreas:{auxano:"Maisandari",gve:"Gwange",arnergy:"Bolori",sosai:"Jere",bluecamel:"Lamisula",rubitec:"Gamboru"}},Os={chip:"Enugu · ~8km radius",labels:["GRA","Asata","Achara Layout","Trans-Ekulu","Independence Layout","New Haven","Uwani","Maryland"],installerAreas:{auxano:"Trans-Ekulu",gve:"Asata",arnergy:"GRA",sosai:"Independence Layout",bluecamel:"New Haven",rubitec:"Achara Layout"}},Gs={chip:"Ibadan · ~8km radius",labels:["Bodija","Jericho","Iyaganku","Ring Road","Agodi","Mokola","Sango","Challenge"],installerAreas:{auxano:"Bodija",gve:"Ring Road",arnergy:"Jericho",sosai:"Agodi",bluecamel:"Iyaganku",rubitec:"Mokola"}},Ds={chip:"Kaduna · ~8km radius",labels:["Malali","Barnawa","Rigachikun","Narayi","Kawo","Ungwan Rimi","Gonin Gora","Television"],installerAreas:{auxano:"Barnawa",gve:"Narayi",arnergy:"Malali",sosai:"Rigachikun",bluecamel:"Kawo",rubitec:"Ungwan Rimi"}},js={chip:"Sokoto · ~8km radius",labels:["Arkilla","Runjin Sambo","Gagi","Sama Road","New Extension","Mabera","Kware","Kwannawa"],installerAreas:{auxano:"Sama Road",gve:"Gagi",arnergy:"Arkilla",sosai:"Mabera",bluecamel:"New Extension",rubitec:"Runjin Sambo"}},zs={chip:"Jos · ~8km radius",labels:["Rayfield","Tudun Wada","Anglo-Jos","Naraguta","Angwan Rogo","Bukuru","Bauchi Road","Vom"],installerAreas:{auxano:"Tudun Wada",gve:"Naraguta",arnergy:"Rayfield",sosai:"Angwan Rogo",bluecamel:"Anglo-Jos",rubitec:"Bukuru"}},Ns={chip:"Asaba · ~8km radius",labels:["GRA","Cable Point","Okpanam","Ezenei","Ogbeogonogo","West End","Okwe","Umuagu"],installerAreas:{auxano:"Cable Point",gve:"Ogbeogonogo",arnergy:"GRA",sosai:"Okpanam",bluecamel:"Ezenei",rubitec:"West End"}},Hs={chip:"Owerri · ~8km radius",labels:["Aladinma","New Owerri","Ikenegbu","Ikoku","Orji","Nekede","Egbu","World Bank"],installerAreas:{auxano:"Aladinma",gve:"Ikoku",arnergy:"New Owerri",sosai:"Ikenegbu",bluecamel:"World Bank",rubitec:"Egbu"}},Ks={chip:"Calabar · ~8km radius",labels:["Calabar South","Ikot Nakanda","State Housing","Diamond Hill","Bogobiri","Big Qua Town","Watt Market","Federal Housing"],installerAreas:{auxano:"State Housing",gve:"Calabar South",arnergy:"Diamond Hill",sosai:"Ikot Nakanda",bluecamel:"Big Qua Town",rubitec:"Federal Housing"}},Ys={chip:"Uyo · ~8km radius",labels:["Ikot Ekpene Rd","Ewet Housing","GRA","Udo Udoma","Ika","Wellington Bassey","Itam","Ewet"],installerAreas:{auxano:"Ewet Housing",gve:"Ikot Ekpene Rd",arnergy:"GRA",sosai:"Udo Udoma",bluecamel:"Wellington Bassey",rubitec:"Itam"}},Vs={chip:"Abeokuta · ~8km radius",labels:["Kuto","Panseke","Ibara","Lafenwa","Oke-Ilewo","Elega","Sapon","Adatan"],installerAreas:{auxano:"Ibara",gve:"Panseke",arnergy:"Kuto",sosai:"Lafenwa",bluecamel:"Oke-Ilewo",rubitec:"Elega"}},Us={chip:"Akure · ~8km radius",labels:["Alagbaka","Fanibi","Oke-Aro","State Housing","Owo Road","Ijoka","Oda Road","Irese"],installerAreas:{auxano:"Alagbaka",gve:"Oke-Aro",arnergy:"State Housing",sosai:"Fanibi",bluecamel:"Owo Road",rubitec:"Ijoka"}},Js={chip:"Bauchi · ~8km radius",labels:["Wunti","Kandahar","Gwallameji","Yelwa","Hardo Road","Salihu","Clock Rd","Fadama"],installerAreas:{auxano:"Yelwa",gve:"Gwallameji",arnergy:"Wunti",sosai:"Hardo Road",bluecamel:"Kandahar",rubitec:"Fadama"}},Xs={chip:"Gombe · ~8km radius",labels:["Tudun Wada","Pantami","New Gombe","Jekadafari","Dadinkowa","Deba","Yamaltu","Billiri"],installerAreas:{auxano:"New Gombe",gve:"Tudun Wada",arnergy:"Pantami",sosai:"Jekadafari",bluecamel:"Dadinkowa",rubitec:"Deba"}},Qs={chip:"Ilorin · ~8km radius",labels:["GRA","Tanke","Adewole","Mandate","Agba Dam","Maraba","Fate","Asa Dam"],installerAreas:{auxano:"Mandate",gve:"Adewole",arnergy:"GRA",sosai:"Tanke",bluecamel:"Fate",rubitec:"Asa Dam"}},Zs={chip:"Lokoja · ~8km radius",labels:["Ganaja","Cable Point","GRA","Otokiti","Felele","New Layout","Crusher","Adankolo"],installerAreas:{auxano:"Ganaja",gve:"Felele",arnergy:"GRA",sosai:"Otokiti",bluecamel:"New Layout",rubitec:"Cable Point"}},ei={chip:"Makurdi · ~8km radius",labels:["North Bank","High Level","Modern Market","Wadata","Ankpa","Shendok","George","Wurukum"],installerAreas:{auxano:"High Level",gve:"North Bank",arnergy:"Modern Market",sosai:"Wadata",bluecamel:"Wurukum",rubitec:"George"}},ti={chip:"Minna · ~8km radius",labels:["Maikunkele","Tunga","Chanchaga","Bosso","Maitumbi","Dutsen Kura","Shiroro","GRA"],installerAreas:{auxano:"Tunga",gve:"Chanchaga",arnergy:"GRA",sosai:"Bosso",bluecamel:"Maikunkele",rubitec:"Maitumbi"}},ai={chip:"Umuahia · ~8km radius",labels:["Govt House","State Housing","Ubakala","Umuopara","Ikwuano","Ohafia Road","Amaudara","Hospital Road"],installerAreas:{auxano:"State Housing",gve:"Ubakala",arnergy:"Govt House",sosai:"Umuopara",bluecamel:"Ohafia Road",rubitec:"Amaudara"}},si={chip:"Yola · ~8km radius",labels:["Jimeta","Karewa","Demsawo","Doubeli","Jambutu","Gwadabawa","Farakwa","Rumde"],installerAreas:{auxano:"Jimeta",gve:"Doubeli",arnergy:"Karewa",sosai:"Demsawo",bluecamel:"Jambutu",rubitec:"Farakwa"}},ii={chip:"Gusau (Zamfara) · ~8km radius",labels:["Tudun Wada","Bunsawa","Kaura","Samaru","Maru Road","Sokoto Road","Rijiyar Zaki","Tsafe"],installerAreas:{auxano:"Samaru",gve:"Kaura",arnergy:"Tudun Wada",sosai:"Maru Road",bluecamel:"Bunsawa",rubitec:"Rijiyar Zaki"}},ni={chip:"Lafia · ~8km radius",labels:["Shabu","New Layout","Makama","Tudun Gwandara","Old Market","Makurdi Road","Agwada","Karu"],installerAreas:{auxano:"New Layout",gve:"Shabu",arnergy:"Makama",sosai:"Tudun Gwandara",bluecamel:"Makurdi Road",rubitec:"Agwada"}},oi={chip:"Dutse · ~8km radius",labels:["GRA","Takur","Kazaure Road","Kafin Hausa","Jahun","Dabi","Kiyawa","Birnin Kudu"],installerAreas:{auxano:"Takur",gve:"Kazaure Road",arnergy:"GRA",sosai:"Kafin Hausa",bluecamel:"Jahun",rubitec:"Dabi"}},ri={chip:"Damaturu · ~8km radius",labels:["GRA","Potiskum Road","NNPC Estate","Gwange","Jumba","Ngelzarma","Gujba Road","Tarmuwa"],installerAreas:{auxano:"Gwange",gve:"Potiskum Road",arnergy:"GRA",sosai:"Ngelzarma",bluecamel:"NNPC Estate",rubitec:"Jumba"}},li={chip:"Jalingo · ~8km radius",labels:["GRA","Lau Road","Suntai","Bali Road","Kona","Mayo-Selbe","Jalingo Central","Zing"],installerAreas:{auxano:"Jalingo Central",gve:"Lau Road",arnergy:"GRA",sosai:"Bali Road",bluecamel:"Suntai",rubitec:"Kona"}},ci={chip:"Abakaliki · ~8km radius",labels:["Housing Estate","Mile 50","Azungwu","Kpirikpiri","Ogoja Road","Nkaliki","Salt Lake Road","Ogui"],installerAreas:{auxano:"Mile 50",gve:"Kpirikpiri",arnergy:"Housing Estate",sosai:"Ogoja Road",bluecamel:"Azungwu",rubitec:"Nkaliki"}},di={chip:"Awka · ~8km radius",labels:["Amawbia","Unizik Junction","Nnamdi Road","GRA","Enugwu Ukwu","Ifite","Okpuno","Umunze"],installerAreas:{auxano:"GRA",gve:"Amawbia",arnergy:"Unizik Junction",sosai:"Ifite",bluecamel:"Nnamdi Road",rubitec:"Enugwu Ukwu"}},pi={chip:"Ikeja (Lagos) · ~8km radius",labels:["Allen Avenue","Alausa","Maryland","Opebi","Oregun","Agidingbi","Toyin Street","Omole"],installerAreas:{auxano:"Allen Avenue",gve:"Oregun",arnergy:"Alausa",sosai:"Maryland",bluecamel:"Opebi",rubitec:"Omole"}},ui={chip:"Osogbo · ~8km radius",labels:["Old Garage","Oke-Fia","Oke-Baale","Aregbe","Laro","Igbona","Alekuwodo","Station Road"],installerAreas:{auxano:"Oke-Fia",gve:"Old Garage",arnergy:"Oke-Baale",sosai:"Aregbe",bluecamel:"Laro",rubitec:"Igbona"}},de={"Abuja (FCT)":{chip:"Abuja (FCT) · ~8km radius",labels:["Maitama","Wuse 2","Asokoro","Garki","Jabi","Gwarinpa","Utako","Life Camp"],installerAreas:{auxano:"Garki",gve:"Jabi",arnergy:"Maitama",sosai:"Utako",bluecamel:"Wuse 2",rubitec:"Gwarinpa"}},Lagos:Ws,Kano:Is,Maiduguri:Ps,Enugu:Os,"Port Harcourt":{chip:"Port Harcourt · ~8km radius",labels:["GRA Phase 1","Rumuola","Trans-Amadi","Diobu","Obio/Akpor","Rumuokoro","D-Line","Elelenwo"],installerAreas:{auxano:"GRA Phase 1",gve:"Trans-Amadi",arnergy:"Rumuola",sosai:"Obio/Akpor",bluecamel:"D-Line",rubitec:"Rumuokoro"}},Ibadan:Gs,Kaduna:Ds,Sokoto:js,Jos:zs,"Benin City":{chip:"Benin City · ~8km radius",labels:["GRA","Oredo","Ikpoba Hill","Uselu","Airport Road","Ugbowo","Egor","Oba Market"],installerAreas:{auxano:"Ikpoba Hill",gve:"Oredo",arnergy:"GRA",sosai:"Uselu",bluecamel:"Ugbowo",rubitec:"Airport Road"}},Asaba:Ns,Owerri:Hs,Calabar:Ks,Uyo:Ys,Abeokuta:Vs,Akure:Us,Bauchi:Js,Gombe:Xs,Ilorin:Qs,Lokoja:Zs,Makurdi:ei,Minna:ti,Umuahia:ai,Yola:si,Zamfara:ii,Lafia:ni,"Birnin Kebbi":{chip:"Birnin Kebbi · ~8km radius",labels:["Kalgo Road","Central Market","GRA","Augie Road","Sama'ila","Jega Road","New Layout","Dakingari"],installerAreas:{auxano:"GRA",gve:"Central Market",arnergy:"Kalgo Road",sosai:"Augie Road",bluecamel:"New Layout",rubitec:"Jega Road"}},Dutse:oi,Damaturu:ri,Jalingo:li,"Ado Ekiti":{chip:"Ado Ekiti · ~8km radius",labels:["Ajilosun","Oke-Bisi","Ijigbo","Adebayo","Basiri","Okesa","Ilawe Road","Fajuyi"],installerAreas:{auxano:"Adebayo",gve:"Ajilosun",arnergy:"Fajuyi",sosai:"Okesa",bluecamel:"Oke-Bisi",rubitec:"Basiri"}},Abakaliki:ci,Awka:di,Ikeja:pi,Osogbo:ui},vi=[{x:60,y:26},{x:36,y:32},{x:74,y:40},{x:54,y:74},{x:24,y:52},{x:18,y:16},{x:74,y:62},{x:40,y:78}];function Je(e){return de[e]||de["Abuja (FCT)"]}const ye='<svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:4px"><polyline points="1,4 3.5,6.5 9,1"/></svg>',mi='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>',gi='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-left:5px"><polyline points="5,2 10,7 5,12"/></svg>',B={view:"market",openId:null,shortlist:[],sortMode:"value",hovered:null,quoteRequests:{}};let He=null,Ae=null;function Le(e){const s=B.shortlist.indexOf(e);s>=0?B.shortlist.splice(s,1):B.shortlist=[...B.shortlist.slice(-3),e],Q()}function Jt(e){if(B.quoteRequests[e])return;const s=[];B.quoteRequests[e]={status:"requested",requestedAt:Date.now(),timers:s},s.push(setTimeout(()=>{B.quoteRequests[e]&&Q()},1e4)),s.push(setTimeout(()=>{B.quoteRequests[e]&&Q()},2e4)),s.push(setTimeout(()=>{B.quoteRequests[e]&&(B.quoteRequests[e].status="quoted",Q())},3e4)),Ye(e)}function yi(e){const s=B.quoteRequests[e];s&&(s.timers.forEach(t=>clearTimeout(t)),delete B.quoteRequests[e],Q())}function Xt(e){var i;(i=document.getElementById("rfq-cancel-overlay"))==null||i.remove();const t=he(fe).find(a=>a.id===e),n=document.createElement("div");n.id="rfq-cancel-overlay",n.innerHTML=`
    <div class="rfq-cancel-modal">
      <div class="rfq-cancel-icon">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M11 2L2 20h18L11 2z"/><line x1="11" y1="9" x2="11" y2="13"/><line x1="11" y1="16" x2="11" y2="17"/></svg>
      </div>
      <h3>Cancel request to ${(t==null?void 0:t.name)??"this installer"}?</h3>
      <p>Your quote request will be withdrawn. You can send it again at any time.</p>
      <div class="rfq-cancel-btns">
        <button class="btn btn--primary" id="rfq-keep">Keep request</button>
        <button class="btn--dark-outline" id="rfq-withdraw">Yes, cancel</button>
      </div>
    </div>
  `,document.body.appendChild(n),n.querySelector("#rfq-keep").addEventListener("click",()=>n.remove()),n.querySelector("#rfq-withdraw").addEventListener("click",()=>{n.remove(),yi(e)}),n.addEventListener("click",a=>{a.target===n&&n.remove()})}function fi(e){const s=B.quoteRequests[e];if(!s)return 0;if(s.status==="quoted")return 4;const t=Date.now()-s.requestedAt;return t<1e4?1:t<2e4?2:3}function hi(e){const s=fi(e),t=["Request sent","Request received by installer","Quote in process","Quote sent"];return`
    <div class="rfq-timeline">
      ${t.map((n,i)=>{const a=i+1,r=s>a;return`
          <div class="rfq-step ${r?"rfq-step--done":s===a?"rfq-step--active":""}">
            <div class="rfq-step-indicator">
              <div class="rfq-dot">
                ${r?ye:""}
              </div>
              ${i<t.length-1?'<div class="rfq-connector"></div>':""}
            </div>
            <div class="rfq-step-label">${n}</div>
          </div>
        `}).join("")}
    </div>
  `}function bi(e){const s=e.price,t=Math.round(s/1.075),n=s-t,i=r=>Math.round(t*r);return{items:[{label:"Solar Panels",spec:e.panel,amount:i(.38)},{label:"Battery Storage",spec:e.battery,amount:i(.24)},{label:"Inverter System",spec:e.inverter,amount:i(.2)},{label:"Installation & Labour",spec:"Site assessment, mounting, wiring, commissioning",amount:i(.11)},{label:"Cabling & Accessories",spec:"DC/AC cables, combiner box, circuit breakers",amount:i(.05)},{label:"Pre-commissioning & Testing",spec:"System diagnostics and performance validation",amount:t-i(.38)-i(.24)-i(.2)-i(.11)-i(.05)}],subtotal:t,vat:n,total:s}}function ki(e){var r;(r=document.getElementById("boq-modal-overlay"))==null||r.remove();const{items:s,subtotal:t,vat:n,total:i}=bi(e),a=document.createElement("div");a.id="boq-modal-overlay",a.innerHTML=`
    <div class="boq-modal">
      <div class="boq-modal-head">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--color-text)">${e.name}</div>
          <div style="font-size:12px;color:var(--color-text-muted)">Bill of Quantities</div>
        </div>
        <button class="fc-modal-close" id="boq-close">✕</button>
      </div>
      <div class="boq-table-wrap">
        <table class="boq-table">
          <thead><tr><th>Item</th><th>Specification</th><th class="boq-r">Amount</th></tr></thead>
          <tbody>
            ${s.map(o=>`
              <tr>
                <td class="boq-item-name">${o.label}</td>
                <td class="boq-item-spec">${o.spec}</td>
                <td class="boq-r">${O(o.amount)}</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr class="boq-subtotal-row"><td colspan="2">Subtotal</td><td class="boq-r">${O(t)}</td></tr>
            <tr class="boq-vat-row"><td colspan="2">VAT (7.5%)</td><td class="boq-r">${O(n)}</td></tr>
            <tr class="boq-total-row"><td colspan="2"><strong>Total</strong></td><td class="boq-r"><strong>${O(i)}</strong></td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector("#boq-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",o=>{o.target===a&&a.remove()})}let Ke=!1;function Q(){Ke=!0,He&&Ae&&Qt(He,Ae),Ke=!1}function Qt(e,s){Ke||(B.view="market"),He=e,Ae=s,B.view==="storefront"&&B.openId?$i(e):(B.view="market",xi(e))}function xi(e){var o,c,m,u,f;const s=he(fe),t=_i(s),n=R(),i=((c=(o=n.results)==null?void 0:o.solar)==null?void 0:c.panel_kwp)!=null?n.results.solar.panel_kwp.toFixed(2):"N/A",a=((m=n.location)==null?void 0:m.state)||"your area";e.innerHTML=`
    <div class="mk-page">
      <div class="mk-header-row">
        <div>
          <div class="mk-header-pill"><span></span>${s.length} VERIFIED INSTALLERS NEAR YOU</div>
          <h1 class="mk-h1">Verified Solar Installers in ${a}</h1>
          <p class="mk-sub">Showing quotes for your <strong>${i} kWp</strong> system from ${s.length} pre-screened, NNEL-verified solar installers serving ${a}.</p>
        </div>
        <div class="mk-sort" id="mk-sort">
          ${["value","distance","rating"].map(h=>`
            <button class="mk-sort-btn ${B.sortMode===h?"active":""}" data-sort="${h}">
              ${h==="value"?"Best value":h==="distance"?"Nearest":"Top rated"}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="mk-grid">
        <div class="mk-list-col" id="mk-list">
          ${t.map(h=>wi(h)).join("")}
        </div>
        <div class="mk-map-col">
          ${Si(s)}
        </div>
      </div>
    </div>
    ${Ei()}
  `;const r=e.querySelector("#mk-map-canvas");r&&requestAnimationFrame(()=>{r.isConnected&&Rs(r)}),e.querySelectorAll("[data-sort]").forEach(h=>{h.addEventListener("click",()=>{B.sortMode=h.dataset.sort,Q()})}),e.querySelectorAll("[data-open]").forEach(h=>{h.addEventListener("click",p=>{p.stopPropagation(),Ye(h.dataset.open)})}),e.querySelectorAll("[data-toggle]").forEach(h=>{h.addEventListener("click",p=>{p.stopPropagation(),Le(h.dataset.toggle)})}),e.querySelectorAll("[data-rfq]").forEach(h=>{h.addEventListener("click",p=>{p.stopPropagation(),Jt(h.dataset.rfq)})}),e.querySelectorAll("[data-cancel-rfq]").forEach(h=>{h.addEventListener("click",p=>{p.stopPropagation(),Xt(h.dataset.cancelRfq)})}),e.querySelectorAll("[data-card]").forEach(h=>{h.addEventListener("mouseenter",()=>{B.hovered=h.dataset.card,we()}),h.addEventListener("mouseleave",()=>{B.hovered=null,we()})}),e.querySelectorAll("[data-pin]").forEach(h=>{h.addEventListener("mouseenter",()=>{B.hovered=h.dataset.pin,we()}),h.addEventListener("mouseleave",()=>{B.hovered=null,we()}),h.addEventListener("click",()=>Ye(h.dataset.pin))}),(u=e.querySelector("#mk-bar-clear"))==null||u.addEventListener("click",()=>{B.shortlist=[],Q()}),(f=e.querySelector("#mk-bar-compare"))==null||f.addEventListener("click",()=>Ae("compare"))}function we(){document.querySelectorAll("[data-card]").forEach(e=>e.classList.toggle("hovered",e.dataset.card===B.hovered)),document.querySelectorAll("[data-pin]").forEach(e=>e.classList.toggle("hovered",e.dataset.pin===B.hovered))}function _i(e){const s=[...e];return B.sortMode==="distance"?s.sort((t,n)=>t.distance-n.distance):B.sortMode==="rating"?s.sort((t,n)=>n.rating-t.rating||n.reviews-t.reviews):s.sort((t,n)=>n.score-t.score)}function wi(e){var r;const s=Je((r=R().location)==null?void 0:r.state).installerAreas[e.id]||e.district,t=B.quoteRequests[e.id],n=(t==null?void 0:t.status)??"none",i=B.shortlist.includes(e.id),a=n==="none"?`<button class="btn--amber" data-rfq="${e.id}">Ask for Quote</button>`:n==="requested"?`<button class="btn--rfq-sent" data-cancel-rfq="${e.id}">${ye}Request Sent</button>`:`<button class="${i?"btn--added":"btn--amber"}" data-toggle="${e.id}">
         ${i?`${ye}In comparison`:"+ Compare"}
       </button>`;return`
    <div class="mk-card ${B.hovered===e.id?"hovered":""}" data-card="${e.id}">
      <div class="mk-card-top">
        <div class="mk-logo-chip">${e.init}</div>
        <div class="mk-name">${e.name}</div>
        <span class="mk-verified">Verified</span>
      </div>
      <div class="mk-meta">
        <span>${s}</span>
        <span>·</span>
        <span>${e.distance} km away</span>
        <span>·</span>
        <span class="mk-rating-pill"><span class="star">★</span> ${e.rating} · ${e.reviews} reviews</span>
      </div>
      <div class="mk-tags">${e.tags.map(o=>`<span class="mk-tag">${o}</span>`).join("")}</div>
      <div class="mk-card-footer">
        <div>
          <div class="mk-price-label">Est. starting from</div>
          <div class="mk-price">${O(e.price)}</div>
        </div>
        <div class="mk-card-btns">
          <button class="btn--dark-outline" data-open="${e.id}">View installer</button>
          ${a}
        </div>
      </div>
    </div>
  `}function Si(e){var i;const s=(i=R().location)==null?void 0:i.state,t=Je(s);return`
    <div class="mk-map">
      <!-- Procedural canvas map (drawn by mapCanvas.js via requestAnimationFrame) -->
      <canvas id="mk-map-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block"></canvas>

      <!-- Coverage radius ring overlay -->
      <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice"
           style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
        <circle cx="288" cy="300" r="225" fill="none" stroke="#005527" stroke-opacity=".22" stroke-width="2" stroke-dasharray="3 9"/>
      </svg>

      <!-- District labels -->
      ${t.labels.map((a,r)=>({label:a,...vi[r]})).map(a=>`<div class="mk-district" style="left:${a.x}%;top:${a.y}%">${a.label}</div>`).join("")}

      <!-- Installer pins -->
      ${e.map(a=>`
        <div class="mk-pin ${B.hovered===a.id?"hovered":""}" data-pin="${a.id}"
             style="left:${a.mapX}%;top:${a.mapY}%">
          <div class="mk-pin-tag">
            <span class="mk-pin-init">${a.init}</span>
            ${Bs(a.price)}
          </div>
          <div class="mk-pin-stem"></div>
        </div>
      `).join("")}

      <!-- User pin -->
      <div class="mk-user-pin">
        <div class="mk-user-dot"><div class="mk-user-halo"></div></div>
        <div class="mk-user-label">Your home</div>
      </div>

      <!-- Map overlay chips -->
      <div class="mk-map-chip mk-map-chip--tl">
        <span class="live-dot"></span> Live installer map
      </div>
      <div class="mk-map-chip mk-map-chip--bl">${t.chip}</div>
    </div>
  `}function Ei(){const e=B.shortlist;if(e.length===0)return"";const s=he(fe),t=e.map(i=>s.find(a=>a.id===i)).filter(Boolean),n=e.length<2?"Add one more to compare side by side":e.length>=4?"Maximum 4 quotes reached":"Ready to compare side by side";return`
    <div class="mk-bar" id="mk-bar">
      <div class="mk-bar-avatars">
        ${t.slice(0,3).map(i=>`<div class="mk-bar-avatar">${i.init}</div>`).join("")}
      </div>
      <div class="mk-bar-text">
        <div class="mk-bar-count">${e.length} in comparison</div>
        <div class="mk-bar-hint">${n}</div>
      </div>
      <div class="mk-bar-btns">
        <button class="mk-bar-clear" id="mk-bar-clear">Clear</button>
        <button class="mk-bar-compare" id="mk-bar-compare">Compare quotes ${gi}</button>
      </div>
    </div>
  `}function Zt(){const e=document.querySelector(".results-main");e?e.scrollTop=0:window.scrollTo({top:0,behavior:"instant"})}function Ye(e){B.view="storefront",B.openId=e,Q(),requestAnimationFrame(Zt)}function $i(e){var l,d,y,E,$,w,C,x;const s=he(fe),t=s.find(g=>g.id===B.openId)||s[0],n=B.quoteRequests[t.id],i=(n==null?void 0:n.status)??"none",a=B.shortlist.includes(t.id),r=["#1F2937","#3D6B7A","#374151"],o=R(),c=((l=o.location)==null?void 0:l.state)||"Abuja (FCT)",m=c.replace(/\s*\(FCT\)/i,"").trim(),u=Je(c).installerAreas[t.id]||t.district,f=((E=(y=(d=o.results)==null?void 0:d.solar)==null?void 0:y.panel_kwp)==null?void 0:E.toFixed(2))??"N/A",h=[{title:"3kVA hybrid install",sub:"Maitama · Jan 2024",grad:"linear-gradient(135deg,#1e3a5f,#2d6a8f)",tilt:"-4deg"},{title:"8kVA + lithium bank",sub:"Gwarinpa · Mar 2024",grad:"linear-gradient(135deg,#1a4731,#2d7a55)",tilt:"3deg"},{title:"Rooftop array, 12 panels",sub:"Asokoro · Feb 2024",grad:"linear-gradient(135deg,#2c3e50,#4a5568)",tilt:"-2deg"},{title:"Whole-home backup",sub:"Wuse 2 · Apr 2024",grad:"linear-gradient(135deg,#0d2b1e,#1a4731)",tilt:"4deg"}];let p;i==="quoted"?p=`
      <div class="sf-quote-panel">
        <div style="flex:1;min-width:0">
          <div class="sf-quote-label">Quote for your ${f} kWp system</div>
          <div class="sf-quote-price">${O(t.price)}</div>
          <div class="sf-quote-sub">Installed · ${t.timeline} timeline · ${t.warranty} warranty</div>
          <div class="sf-kit-grid">
            <div class="sf-kit-tile"><div class="label">Solar panels</div><div class="value">${t.panel}</div></div>
            <div class="sf-kit-tile"><div class="label">Battery</div><div class="value">${t.battery}</div></div>
            <div class="sf-kit-tile"><div class="label">Inverter</div><div class="value">${t.inverter}</div></div>
            <div class="sf-kit-tile"><div class="label">After-sales</div><div class="value">${t.aftercare}</div></div>
          </div>
        </div>
        <div style="flex-shrink:0;padding-top:4px;display:flex;flex-direction:column;gap:10px;align-items:flex-start">
          <button class="${a?"btn--added":"btn--amber"}" style="padding:13px 20px;font-size:13px;display:inline-flex;align-items:center;gap:6px" id="sf-toggle">
            ${a?`${ye}In comparison`:"+ Add to comparison"}
          </button>
          <button class="btn--dark-outline" style="font-size:12px;padding:9px 16px;white-space:nowrap" id="sf-boq-btn">View BoQ</button>
        </div>
      </div>`:i==="requested"?p=`
      <div class="rfq-status-panel">
        <div class="rfq-status-head">
          <div>
            <div class="rfq-status-title">Quote Request Active</div>
            <div class="rfq-status-sub">We've notified ${t.name} — your quote is on its way.</div>
          </div>
          <button class="btn--rfq-sent" data-sf-cancel-rfq="${t.id}">${ye}Request Sent</button>
        </div>
        ${hi(t.id)}
      </div>`:p=`
      <div class="rfq-cta-panel">
        <div class="rfq-cta-icon">📋</div>
        <div class="rfq-cta-title">Request a quote from ${t.name}</div>
        <p class="rfq-cta-sub">Get a personalised quote for your ${f} kWp system. Your energy profile is shared directly with the installer.</p>
        <button class="btn btn--primary" style="padding:12px 28px;font-size:14px" data-sfq="${t.id}">Ask for Quote</button>
      </div>`,e.innerHTML=`
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="sf-back">${mi}Back to installers</button>
    </div>
    <div class="sf-page">
      <div class="sf-card">
        <div class="sf-header">
          <div class="sf-header-top">
            <div class="mk-logo-chip mk-logo-chip--lg">${t.init}</div>
            <div>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px">
                <h1 style="margin:0;font-size:clamp(20px,3vw,28px);font-weight:800;color:#fff">${t.name}</h1>
                <span class="mk-verified" style="font-size:11px;background:rgba(255,255,255,.18);color:rgba(255,255,255,.9);border:1px solid rgba(255,255,255,.3)">Verified</span>
              </div>
              <div class="sf-header-meta">
                <span class="accent">★ ${t.rating}</span>
                <span>${t.reviews} reviews</span>
                <span>·</span><span>${u}, ${m}</span>
                <span>·</span><span>${t.distance} km from you</span>
              </div>
            </div>
          </div>
          <p class="sf-about">${t.about}</p>
          <div class="sf-stats">
            <div class="sf-stat-chip"><div class="label">Jobs completed</div><div class="value">${t.jobs}</div></div>
            <div class="sf-stat-chip"><div class="label">Years in business</div><div class="value">${t.years}</div></div>
            <div class="sf-stat-chip"><div class="label">Repeat customers</div><div class="value">${t.repeat}</div></div>
            <div class="sf-stat-chip"><div class="label">Avg. response</div><div class="value">${t.response}</div></div>
          </div>
        </div>

        <div class="sf-body">
          ${p}

          <div class="section-title" style="margin-bottom:12px;margin-top:28px">Recent installs</div>
          <div class="sf-gallery" style="margin-bottom:28px">
            ${h.map(g=>`
              <div class="sf-gallery-card">
                <div class="sf-gallery-img" style="background:${g.grad}">
                  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:120px">
                    <div style="width:80%;height:55%;background:repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 20px),${g.grad};transform:rotateX(34deg) rotate(${g.tilt});border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.3)"></div>
                  </div>
                </div>
                <div class="sf-gallery-caption">
                  <div class="sf-cap-title">${g.title}</div>
                  <div class="sf-cap-sub">${g.sub}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px">
            <div class="section-title" style="margin-bottom:0">What homeowners say</div>
            <span style="font-size:13px;color:var(--color-text-secondary)">★ ${t.rating} average</span>
          </div>
          <div class="sf-reviews">
            ${t.reviews_l.map((g,v)=>`
              <div class="sf-review-card">
                <div class="sf-review-top">
                  <div style="display:flex;align-items:center;gap:10px">
                    <div class="sf-review-avatar" style="background:${r[v%3]}">${g.name[0]}</div>
                    <div>
                      <div class="sf-review-name">${g.name}</div>
                      <div class="sf-review-area">${g.area} · ${g.date}</div>
                    </div>
                  </div>
                  <div class="sf-review-stars">${"★".repeat(g.stars)}</div>
                </div>
                <div class="sf-review-text">${g.text}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `,e.querySelector("#sf-back").addEventListener("click",()=>{B.view="market",Q(),requestAnimationFrame(Zt)}),($=e.querySelector("#sf-toggle"))==null||$.addEventListener("click",()=>Le(t.id)),(w=e.querySelector("#sf-boq-btn"))==null||w.addEventListener("click",()=>ki(t)),(C=e.querySelector("[data-sfq]"))==null||C.addEventListener("click",()=>Jt(t.id)),(x=e.querySelector("[data-sf-cancel-rfq]"))==null||x.addEventListener("click",()=>Xt(t.id))}function Ai(e){return de[e]||de["Abuja (FCT)"]}const ea='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>',Li=[{id:"baobab",name:"Baobab MFB",init:"BA",rate:2.8,approval:"3–5 days",maxTenure:36,color:"#1F2937"},{id:"lapo",name:"LAPO MFB",init:"LA",rate:3,approval:"3–5 days",maxTenure:36,color:"#1E5BB8"},{id:"ab",name:"AB Microfinance",init:"AB",rate:3.1,approval:"2–4 days",maxTenure:30,color:"#3D6B7A"},{id:"accion",name:"Accion MFB",init:"AC",rate:3.3,approval:"3–5 days",maxTenure:36,color:"#C0392B"},{id:"renmoney",name:"Renmoney",init:"RE",rate:3.5,approval:"24–48 hrs",maxTenure:24,color:"#6A2FB8"},{id:"fairmoney",name:"FairMoney MFB",init:"FA",rate:3.8,approval:"Same day",maxTenure:24,color:"#0E8F6E"}];function Ci(e,s,t){const n=e/100;return t*n/(1-Math.pow(1+n,-s))}let V=null;function Tt(e){V=e,G.view="config"}let G={down:30,tenure:36,picked:null,view:"config",fundMode:"loan"},z=null,Xe=null;function me(){return V!=null&&V.price?V.price:462e4}function Mi(){var e,s,t;return((t=(s=(e=R().results)==null?void 0:e.solar)==null?void 0:s.panel_kwp)==null?void 0:t.toFixed(2))??"N/A"}function Fi(e,s){z=e,Xe=s,Z()}function Z(){var $,w,C,x;if(G.view==="done"){Bi();return}const e=me(),s=G.fundMode!=="self",t=e*(1-G.down/100),n=e*G.down/100,i=Li.map(g=>{const v=Math.min(G.tenure,g.maxTenure),k=Ci(g.rate,v,t),S=k*v+n;return{...g,n:v,monthly:k,total:S}}).sort((g,v)=>g.monthly-v.monthly),a=["fairmoney","renmoney"],r=[...i.filter(g=>a.includes(g.id)),...i.filter(g=>!a.includes(g.id))],o=i[0],c=(G.down-10)/40*100,m=`linear-gradient(to right, #FCBF1E 0%, #FCBF1E ${c}%, #E5E7EB ${c}%, #E5E7EB 100%)`,u=V,f=(u==null?void 0:u.init)??"SO",h=(u==null?void 0:u.name)??"Your installer",l=(($=R().location)==null?void 0:$.state)??"Abuja (FCT)",d=l.replace(/\s*\(FCT\)/i,"").trim(),y=u?Ai(l).installerAreas[u.id]||u.district:null,E=[u!=null&&u.warranty?u.warranty+" warranty":null,y?y+", "+d:null].filter(Boolean).join(" · ");if(z.innerHTML=`
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="fc-back">${ea}Back to quotes</button>
    </div>
    <div class="fc-page">
      <h1 class="fc-h1">Finance your solar system</h1>
      <p class="fc-sub">Pay outright with no interest, or spread the cost through a verified microfinance bank. Toggle between options below.</p>

      <!-- Funding mode switch -->
      <div class="fc-fund-switch-row">
        <span class="fc-switch-lbl ${s?"":"fc-switch-lbl--active"}" data-mode="self">Pay outright</span>
        <div class="fc-switch-track ${s?"is-on":""}" id="fc-mode-switch">
          <div class="fc-switch-thumb"></div>
        </div>
        <span class="fc-switch-lbl ${s?"fc-switch-lbl--active":""}" data-mode="loan">Micro-finance loan</span>
      </div>

      <div class="fc-grid">
        <!-- LEFT: system card + configurator (loan only) or summary (self) -->
        <div>
          <div class="fc-card">
            <div class="fc-card-label">Your system</div>
            <div class="fc-system-row">
              <div class="fc-system-info">
                <div class="mk-logo-chip">${f}</div>
                <div>
                  <div class="fc-system-name">${h} · ${Mi()} kWp system</div>
                  <div class="fc-system-sub">${E}</div>
                </div>
              </div>
              <div class="fc-system-cost">${O(e)}</div>
            </div>
          </div>

          ${s?`
            <div class="fc-card">
              <div class="fc-down-header">
                <div class="fc-card-label" style="margin-bottom:0">Down payment</div>
                <div class="fc-down-pct" id="fc-down-pct">${G.down}%</div>
              </div>
              <input type="range" class="fc-range" id="fc-range"
                min="10" max="50" step="5" value="${G.down}"
                style="background:${m}">
              <div class="fc-down-row" id="fc-down-row">
                <span>You pay now: <strong>${O(n)}</strong></span>
                <span>To finance: <strong>${O(t)}</strong></span>
              </div>
            </div>

            <div class="fc-card">
              <div class="fc-card-label">Repayment plan</div>
              <div class="fc-tenure">
                ${[6,12,18,24,36].map(g=>`
                  <button class="fc-tenure-btn ${G.tenure===g?"active":""}" data-tenure="${g}">
                    ${g}<span class="fc-mo">months</span>
                  </button>
                `).join("")}
              </div>
            </div>

            <div class="fc-hero">
              <div class="fc-hero-label">Best loan offer · ${o.name}</div>
              <div class="fc-hero-monthly">${O(o.monthly)}</div>
              <div class="fc-hero-sub">/ month &nbsp;·&nbsp; for ${G.tenure} months &nbsp;·&nbsp; lowest rate from ${i.length} banks</div>
            </div>
          `:`
            <div class="fc-card" style="background:var(--color-primary-bg);border-color:var(--color-primary)">
              <div class="fc-card-label" style="color:var(--color-primary-dark)">Full payment</div>
              <div style="font-size:clamp(28px,5vw,40px);font-weight:800;color:var(--color-text);margin-bottom:4px">${O(e)}</div>
              <div style="font-size:13px;color:var(--color-text-secondary)">Single payment · no monthly obligations · no bank approval</div>
            </div>
          `}
        </div>

        <!-- RIGHT: loan cards or self-fund card -->
        <div>
          ${s?`
            <div style="font-size:16px;font-weight:700;color:var(--color-text);margin-bottom:4px">Loan offers for you</div>
            <div style="font-size:12px;color:var(--color-text-muted);margin-bottom:14px">FairMoney &amp; Renmoney featured · reducing-balance rates</div>

            ${r.map(g=>{const v=g.id===o.id;return`
                <div class="fc-offer-card ${v?"best":""}">
                  <div class="fc-offer-top">
                    <div class="fc-bank-chip" style="background:${g.color}">${g.init}</div>
                    <div>
                      <div class="fc-offer-name">${g.name}</div>
                      <div class="fc-offer-sub">${g.rate}% / mo · ${g.approval} approval · up to ${g.maxTenure} mo</div>
                    </div>
                    ${v?'<span class="fc-offer-badge fc-offer-badge--best">Lowest monthly</span>':""}
                  </div>
                  <div class="fc-offer-footer">
                    <div>
                      <div class="fc-offer-monthly">Monthly ${O(g.monthly)}</div>
                      <div class="fc-offer-total">Total payable ${O(g.total)}</div>
                    </div>
                    <button class="fc-select-btn ${v?"best-btn":""}" data-bank="${g.id}">Select</button>
                  </div>
                </div>
              `}).join("")}

            <div class="fc-trust">
              Rates are indicative monthly reducing-balance figures. Final rates are confirmed during application. A soft credit check may apply; your score is not affected. NNEL Solar Hub never charges you to apply.
            </div>
          `:`
            <div class="fc-offer-card fc-self-prominent">
              <div class="fc-offer-top">
                <div class="fc-bank-chip" style="background:var(--color-primary-dark);color:#111827;font-size:20px;font-weight:900">₦</div>
                <div>
                  <div class="fc-offer-name">Pay outright</div>
                  <div class="fc-offer-sub">No interest · No approval needed · Immediate start</div>
                </div>
              </div>
              <div style="padding:4px 16px 24px;text-align:center">
                <div style="font-size:clamp(36px,6vw,54px);font-weight:800;color:var(--color-text);line-height:1;margin-bottom:6px">${O(e)}</div>
                <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:24px">One-time full payment · no monthly obligations</div>
                <button class="btn--amber" style="width:100%;padding:14px;font-size:14px;border-radius:10px" data-bank="self">Proceed with full payment</button>
              </div>
            </div>

            <div class="fc-trust" style="margin-top:14px">
              Self-funding means you pay the full cost upfront with no interest charges, no bank approval process, and no monthly repayments. Your installer can begin immediately after payment is confirmed.
            </div>
          `}
        </div>
      </div>
    </div>
  `,(w=z.querySelector("#fc-mode-switch"))==null||w.addEventListener("click",()=>{G.fundMode=s?"self":"loan",Z()}),z.querySelectorAll("[data-mode]").forEach(g=>{g.addEventListener("click",()=>{G.fundMode=g.dataset.mode,Z()})}),s){const g=z.querySelector("#fc-range");g.addEventListener("input",()=>{const v=parseInt(g.value);G.down=v;const k=(v-10)/40*100;g.style.background=`linear-gradient(to right, #FCBF1E 0%, #FCBF1E ${k}%, #E5E7EB ${k}%, #E5E7EB 100%)`;const S=z.querySelector("#fc-down-pct");S&&(S.textContent=`${v}%`);const M=me(),L=z.querySelector("#fc-down-row");L&&(L.innerHTML=`<span>You pay now: <strong>${O(M*v/100)}</strong></span><span>To finance: <strong>${O(M*(1-v/100))}</strong></span>`)}),g.addEventListener("change",()=>Z()),z.querySelectorAll("[data-tenure]").forEach(v=>{v.addEventListener("click",()=>{G.tenure=parseInt(v.dataset.tenure),Z()})}),z.querySelectorAll("[data-bank]").forEach(v=>{v.addEventListener("click",()=>{const k=i.find(S=>S.id===v.dataset.bank);k&&Ti(k,n,t)})})}else(C=z.querySelector('[data-bank="self"]'))==null||C.addEventListener("click",()=>{G.picked={id:"self",name:"self-fund",isSelf:!0,monthly:0,total:me(),approval:"N/A"},G.view="done",Z()});(x=z.querySelector("#fc-back"))==null||x.addEventListener("click",()=>Xe("compare"))}function Ti(e,s,t){var r,o,c;const n=me(),i=V,a=document.createElement("div");a.id="fc-modal-overlay",a.innerHTML=`
    <div class="fc-modal">
      <div class="fc-modal-head">
        <div class="fc-bank-chip" style="background:${e.color};width:40px;height:40px;border-radius:10px;font-size:14px">${e.init}</div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:var(--color-text)">${e.name}</div>
          <div style="font-size:12px;color:var(--color-text-muted)">Loan application summary</div>
        </div>
        <button class="fc-modal-close" id="fc-modal-close">✕</button>
      </div>

      ${i?`<div class="fc-modal-installer">
        <div class="mk-logo-chip" style="width:28px;height:28px;font-size:10px">${i.init}</div>
        <span style="font-size:13px;font-weight:600;color:var(--color-text)">${i.name} · ${((c=(o=(r=R().results)==null?void 0:r.solar)==null?void 0:o.panel_kwp)==null?void 0:c.toFixed(2))??"N/A"} kWp system</span>
      </div>`:""}

      <div class="fc-modal-rows">
        <div class="fc-modal-row"><span class="fc-modal-lbl">System cost</span><span class="fc-modal-val">${O(n)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Down payment (${G.down}%)</span><span class="fc-modal-val">${O(s)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Loan amount</span><span class="fc-modal-val">${O(t)}</span></div>
        <div class="fc-modal-row fc-modal-row--highlight"><span class="fc-modal-lbl">Monthly repayment</span><span class="fc-modal-val fc-modal-val--amber">${O(e.monthly)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Repayment period</span><span class="fc-modal-val">${G.tenure} months</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Total payable</span><span class="fc-modal-val">${O(e.total)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Approval time</span><span class="fc-modal-val">${e.approval}</span></div>
      </div>

      <p class="fc-modal-note">By proceeding, you authorise ${e.name} to conduct a soft credit check. Your credit score will not be affected. Rates confirmed during application.</p>
      <button class="btn btn--primary btn--lg fc-modal-cta" id="fc-modal-proceed">Proceed with application →</button>
    </div>
  `,document.body.appendChild(a),a.querySelector("#fc-modal-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",m=>{m.target===a&&a.remove()}),a.querySelector("#fc-modal-proceed").addEventListener("click",()=>{a.remove(),qi(()=>{G.picked=e,G.view="done",Z()})})}function qi(e){const s=document.createElement("div");s.id="fc-apply-overlay",s.innerHTML=`
    <div class="fc-apply-inner">
      <div class="fc-apply-spinner"></div>
      <div class="fc-apply-label">Submitting your application…</div>
      <div class="fc-apply-sub">Sending your energy profile to the bank</div>
    </div>
  `,document.body.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transition="opacity 0.4s ease",setTimeout(()=>{s.remove(),e()},420)},3e3)}function Bi(){var r;const e=G.picked,s=me(),t=s*G.down/100,n=(V==null?void 0:V.name)??"your installer",i=e.isSelf?`<p>You've chosen to self-fund your solar investment. ${n} will be in touch to schedule a site survey and confirm installation dates.</p>`:`<p>We've sent your verified energy profile and system specification to ${e.name}. Expect a decision within <strong>${e.approval}</strong>. ${n} is on standby to schedule your site survey once approved.</p>`,a=e.isSelf?`
      <div class="fc-stat-strip">
        <div class="fc-stat-cell">
          <div class="label">System cost</div>
          <div class="value value--amber">${O(s)}</div>
        </div>
        <div class="fc-stat-cell">
          <div class="label">Monthly</div>
          <div class="value">None</div>
        </div>
        <div class="fc-stat-cell">
          <div class="label">Financing</div>
          <div class="value">Self-funded</div>
        </div>
      </div>`:`
      <div class="fc-stat-strip">
        <div class="fc-stat-cell">
          <div class="label">Pay now</div>
          <div class="value">${O(t)}</div>
        </div>
        <div class="fc-stat-cell">
          <div class="label">Monthly</div>
          <div class="value value--amber">${O(e.monthly)}</div>
        </div>
        <div class="fc-stat-cell">
          <div class="label">For</div>
          <div class="value">${G.tenure} months</div>
        </div>
      </div>`;z.innerHTML=`
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="fc-done-back">${ea}Back to quotes</button>
    </div>
    <div class="fc-page">
      <div class="fc-done">
        <div class="fc-tick-circle">
          <div class="fc-tick"></div>
        </div>
        <h1>${e.isSelf?"You're all set to self-fund.":"Your application is on its way to "+e.name+"."}</h1>
        ${i}
        ${a}
        <button class="btn--dark-outline" id="fc-adjust" style="font-size:13px;padding:10px 20px">Adjust my plan</button>
      </div>
    </div>
  `,z.querySelector("#fc-adjust").addEventListener("click",()=>{G.view="config",Z()}),(r=z.querySelector("#fc-done-back"))==null||r.addEventListener("click",()=>Xe("compare"))}function Ri(e){return de[e]||de["Abuja (FCT)"]}const Wi='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>',Ii='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-left:5px"><polyline points="5,2 10,7 5,12"/></svg>',Pi=[{label:"Total quote",key:"price",render:e=>O(e.price),bestFn:e=>e.reduce((s,t)=>t.price<s.price?t:s),bestTag:"Lowest"},{label:"Value score",key:"score",render:e=>`<strong>${e.score}/100</strong>`,bestFn:e=>e.reduce((s,t)=>t.score>s.score?t:s),bestTag:"Top"},{label:"Warranty",key:"warranty",render:e=>e.warranty,bestFn:e=>e.reduce((s,t)=>t.warrantyScore>s.warrantyScore?t:s),bestTag:"Longest"},{label:"Install time",key:"timeline",render:e=>e.timeline,bestFn:null},{label:"Solar panels",key:"panel",render:e=>e.panel,bestFn:null},{label:"Battery",key:"battery",render:e=>e.battery,bestFn:null},{label:"Inverter",key:"inverter",render:e=>e.inverter,bestFn:null},{label:"After-sales",key:"aftercare",render:e=>e.aftercare,bestFn:null},{label:"Rating",key:"rating",render:e=>`★ ${e.rating} (${e.reviews})`,bestFn:e=>e.reduce((s,t)=>t.rating>s.rating?t:s),bestTag:"Best"},{label:"Financing",key:"financing",render:e=>e.financing,bestFn:null}];let X=null,Se=null;function Oi(e,s){X=e,Se=s,Ve()}function Ve(){var f,h;const e=he(fe),s=B.shortlist,t=s.length>0?s:[e.sort((p,l)=>l.score-p.score)[0].id],n=t.map(p=>e.find(l=>l.id===p)).filter(Boolean),i=n.reduce((p,l)=>l.score>p.score?l:p,n[0]),a=i==null?void 0:i.id,r=e.filter(p=>!t.includes(p.id)),o=n.length<4&&r.length>0,c=n.length>1?`Comparing ${n.length} quotes for your home`:"Add installers to compare";X.innerHTML=`
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="cq-back">${Wi}Back to installers</button>
    </div>
    <div class="cq-page">
      <div style="margin-bottom:20px">
        <div class="mk-header-pill"><span style="width:6px;height:6px;border-radius:50%;background:var(--color-primary);display:inline-block"></span>QUOTE COMPARISON</div>
        <h1 class="mk-h1">${c}</h1>
        <p class="mk-sub">Our value score weights price 40%, warranty &amp; kit 30%, install speed 15%, and customer ratings 15%.</p>
      </div>

      <!-- Best-value banner -->
      <div class="cq-banner">
        <div class="cq-banner-left">
          <div class="mk-logo-chip" style="background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);color:#fff;font-size:14px">${i.init}</div>
          <div>
            <div class="cq-banner-label">Best overall value</div>
            <div class="cq-banner-name">${i.name}</div>
            <div class="cq-banner-why">${i.warranty} warranty · ★ ${i.rating} from ${i.reviews} reviews · ${i.timeline}</div>
          </div>
        </div>
        <div class="cq-banner-right">
          <div class="cq-banner-price">${O(i.price)}</div>
          <div class="cq-banner-score">Value score ${i.score}/100</div>
          <button class="cq-pick-btn" id="cq-pick-best">Select &amp; Finance ${Ii}</button>
        </div>
      </div>

      <!-- Table -->
      <div class="cq-table-wrap">
        <table class="cq-table">
          <thead>
            <tr>
              <th class="cq-col-label" style="font-size:13px;font-weight:700;color:var(--color-text)">Compare</th>
              ${n.map(p=>{var d;const l=Ri((d=R().location)==null?void 0:d.state).installerAreas[p.id]||p.district;return`
                <th class="cq-th ${p.id===a?"cq-th--best":""}">
                  <div class="cq-th-logo">${p.init}</div>
                  <div class="cq-th-name">${p.name}</div>
                  <div class="cq-th-district">${l}</div>
                  ${p.id===a?'<div class="cq-best-chip">★ BEST VALUE</div>':""}
                  <button class="cq-remove-btn" data-remove="${p.id}">Remove</button>
                </th>`}).join("")}
              ${o?`
                <th class="cq-th-add">
                  <div class="cq-add-box" id="cq-add-box">
                    <div style="font-size:20px;color:var(--color-text-muted)">+</div>
                    <div class="cq-add-label">Add installer</div>
                    <div class="cq-add-dropdown" id="cq-add-dropdown" style="display:none">
                      ${r.map(p=>`
                        <div class="cq-add-option" data-add="${p.id}">
                          <div class="cq-th-logo" style="width:28px;height:28px;font-size:10px;margin-bottom:0">${p.init}</div>
                          <span style="font-size:13px">${p.name}</span>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                </th>
              `:""}
            </tr>
          </thead>
          <tbody>
            ${Pi.map((p,l)=>{const d=l%2===0,y=d?"#F2F3F2":"#FFFFFF",E="#FEF0C0",$="#FEF8E0";return`
              <tr>
                <td class="cq-col-label" style="background:${y}">${p.label}</td>
                ${n.map(w=>{var v;const C=p.bestFn&&((v=p.bestFn(n))==null?void 0:v.id)===w.id,x=w.id===a?d?E:$:y;return`<td class="${`cq-td ${w.id===a?"cq-td--best":""}`}" style="background:${x}">
                    <span ${C?'class="cq-td--green"':""}>${p.render(w)}</span>
                    ${C?`<span class="cq-best-tag">${p.bestTag}</span>`:""}
                  </td>`}).join("")}
                ${o?`<td class="cq-td" style="background:${y}"></td>`:""}
              </tr>`}).join("")}
            <tr>
              <td class="cq-col-label cq-td-footer">Proceed with</td>
              ${n.map(p=>`
                <td class="cq-td-footer ${p.id===a?"cq-td--best":""}">
                  <button class="cq-finance-btn ${p.id===a?"best":""}" data-finance="${p.id}">Finance this</button>
                </td>
              `).join("")}
              ${o?'<td class="cq-td-footer"></td>':""}
            </tr>
          </tbody>
        </table>
      </div>
      <p class="cq-footnote">Value score methodology: price 40% · warranty &amp; kit quality 30% · installation speed 15% · customer ratings 15%. Scores are relative to the 6 installers in this marketplace.</p>
    </div>
  `,X.querySelectorAll("[data-remove]").forEach(p=>{p.addEventListener("click",()=>{Le(p.dataset.remove),Ve()})});const m=X.querySelector("#cq-add-box"),u=X.querySelector("#cq-add-dropdown");m&&u&&(m.addEventListener("click",p=>{p.stopPropagation(),u.style.display=u.style.display==="none"?"block":"none"}),document.addEventListener("click",()=>{u&&(u.style.display="none")},{once:!0}),X.querySelectorAll("[data-add]").forEach(p=>{p.addEventListener("click",l=>{l.stopPropagation(),Le(p.dataset.add),Ve()})})),X.querySelectorAll("[data-finance]").forEach(p=>{p.addEventListener("click",()=>{const l=n.find(d=>d.id===p.dataset.finance);l&&Tt(l),Se("financing")})}),(f=X.querySelector("#cq-pick-best"))==null||f.addEventListener("click",()=>{Tt(i),Se("financing")}),(h=X.querySelector("#cq-back"))==null||h.addEventListener("click",()=>Se("market"))}const Gi=["step1","step2","step3"],Ce=["costSavings","loadProfile","solarPVSystem","finalQuote"],Di=[{route:"costSavings",label:"Cost Savings",sublabel:"Financial Breakdown",paths:'<polyline points="1,13 5,9 8,11 14,4"/><polyline points="10,4 14,4 14,8"/>'},{route:"loadProfile",label:"Load Summary",sublabel:"Energy Profile",paths:'<rect x="2" y="10" width="3" height="4" rx="0.5"/><rect x="6.5" y="6" width="3" height="8" rx="0.5"/><rect x="11" y="2" width="3" height="12" rx="0.5"/>'},{route:"solarPVSystem",label:"Solar PV System",sublabel:"Recommendation",paths:'<circle cx="8" cy="8" r="2.5"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3.34" y1="3.34" x2="4.75" y2="4.75"/><line x1="11.25" y1="11.25" x2="12.66" y2="12.66"/><line x1="12.66" y1="3.34" x2="11.25" y2="4.75"/><line x1="4.75" y1="11.25" x2="3.34" y2="12.66"/>'},{route:"addAppliances",label:"Add Appliances",sublabel:"Customise Profile",paths:'<rect x="1" y="3" width="14" height="10" rx="1.5"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="9" x2="9" y2="9"/><line x1="12" y1="11" x2="15" y2="14"/>'},{route:"market",label:"Find Installers",sublabel:"Solar Marketplace",paths:'<circle cx="6" cy="6" r="4"/><line x1="9.5" y1="9.5" x2="15" y2="15"/>'},{route:"compare",label:"Compare Quotes",sublabel:"Side by Side",paths:'<rect x="1" y="4" width="4" height="9" rx="1"/><rect x="6" y="2" width="4" height="11" rx="1"/><rect x="11" y="6" width="4" height="7" rx="1"/>'},{route:"financing",label:"Financing",sublabel:"Payment Plans",paths:'<circle cx="8" cy="8" r="6.5"/><line x1="8" y1="5" x2="8" y2="8"/><line x1="8" y1="8" x2="11" y2="8"/>'}],ji={step1:Bt,step2:Wt,step3:jt,costSavings:Kt,loadProfile:Nt,solarPVSystem:Ht,finalQuote:Yt,addAppliances:qs,market:Qt,compare:Oi,financing:Fi};let U="step1",Ee=!1,qt=!1,ie=null;function K(e){if(Ee&&Ce.includes(e)){U=e,aa(e),sa(e);return}U=e,Ce.includes(e)?(Ee=!0,zi(e)):(Ee=!1,ia())}function zi(e){const s=document.getElementById("wizard-layout"),t=document.getElementById("results-layout");s.classList.add("hidden"),t.classList.remove("hidden"),Me(),na(),oa(),ie&&(ie(),ie=null);const n=document.getElementById("results-content");n.innerHTML=`
    <div id="section-costSavings"   data-section="costSavings"></div>
    <div id="section-loadProfile"   data-section="loadProfile"></div>
    <div id="section-solarPVSystem" data-section="solarPVSystem"></div>
    <div id="section-finalQuote"    data-section="finalQuote"></div>
  `,Kt(document.getElementById("section-costSavings"),K),Nt(document.getElementById("section-loadProfile"),K),Ht(document.getElementById("section-solarPVSystem"),K),Yt(document.getElementById("section-finalQuote"),K),ie=Ni(),e&&requestAnimationFrame(()=>aa(e))}function ta(){const e=document.getElementById("results-content");if(e&&e.scrollHeight>e.clientHeight)return e;const s=document.querySelector(".right-panel");return s&&s.scrollHeight>s.clientHeight?s:null}function aa(e){const s=document.getElementById(`section-${e}`);if(!s)return;const t=ta();if(t){const n=t.getBoundingClientRect(),i=s.getBoundingClientRect();t.scrollTo({top:t.scrollTop+i.top-n.top,behavior:"smooth"})}else s.scrollIntoView({behavior:"smooth",block:"start"})}function Ni(){const e=ta(),s=e||window;function t(){const n=e?e.clientHeight:window.innerHeight,a=(e?e.getBoundingClientRect().top:0)+n*.3;let r=Ce[0];for(const o of Ce){const c=document.getElementById(`section-${o}`);c&&c.getBoundingClientRect().top<=a&&(r=o)}r!==U&&(U=r,sa(r))}return s.addEventListener("scroll",t,{passive:!0}),()=>s.removeEventListener("scroll",t)}function sa(e){document.querySelectorAll("#results-nav [data-route]").forEach(s=>{s.classList.toggle("active",s.dataset.route===e)})}function ia(){const e=document.getElementById("wizard-layout"),s=document.getElementById("results-layout");if(ie&&(ie(),ie=null),Gi.includes(U)){e.classList.remove("hidden"),s.classList.add("hidden");const t=document.getElementById("wizard-content");t.innerHTML="",{step1:Bt,step2:Wt,step3:jt}[U](t,K),document.querySelector(".right-panel").scrollTop=0}else if(["addAppliances","market","compare","financing"].includes(U)){e.classList.add("hidden"),s.classList.remove("hidden"),na(),oa();const t=document.getElementById("results-content");t.innerHTML="",ji[U](t,K),requestAnimationFrame(()=>{t.scrollTop=0})}}function na(){var n;const e=document.getElementById("results-nav"),s=document.getElementById("results-actions"),t=U;e.innerHTML=Di.map(i=>`
    <div class="results-nav__item${i.route===t?" active":""}" data-route="${i.route}">
      <svg class="results-nav__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${i.paths}
      </svg>
      <div class="results-nav__label-wrap">
        <span class="results-nav__label">${i.label}</span>
        <span class="results-nav__sublabel">${i.sublabel}</span>
      </div>
    </div>
  `).join(""),e.querySelectorAll("[data-route]").forEach(i=>{i.addEventListener("click",()=>K(i.dataset.route))}),s.innerHTML=`
    <button class="btn btn--outline btn--sm btn--full" id="adjust-energy-btn">Adjust Energy Data</button>
  `,(n=document.getElementById("adjust-energy-btn"))==null||n.addEventListener("click",()=>K("step1"))}function oa(){if(qt)return;qt=!0;const e=document.getElementById("results-hamburger"),s=document.getElementById("offcanvas-close-btn"),t=document.getElementById("offcanvas-backdrop"),n=document.querySelector(".results-sidebar");function i(){n.classList.add("is-open"),t.classList.add("is-visible")}function a(){n.classList.remove("is-open"),t.classList.remove("is-visible")}e==null||e.addEventListener("click",i),s==null||s.addEventListener("click",a),t==null||t.addEventListener("click",a),n==null||n.addEventListener("click",r=>{r.target.closest("[data-route]")&&a()})}function Hi(){window._navigate=K,document.querySelectorAll(".logo, .mobile-top-bar").forEach(e=>{e.style.cursor="pointer",e.addEventListener("click",()=>K("step1"))}),document.querySelectorAll(".results-sidebar__logo, .results-mobile-topbar__logo").forEach(e=>{e.style.cursor="pointer",e.addEventListener("click",s=>{s.target.closest(".offcanvas-close-btn")||K("step1")})}),ia()}async function Ki(){const[e,s,t,n,i,a,r]=await Promise.all([ee(()=>import("./pv_yield-zu19S3ka.js"),[]),ee(()=>import("./appliances-By550bug.js"),[]),ee(()=>import("./usage_patterns-BryIkWX-.js"),[]),ee(()=>import("./tariff_bands-C6yWzGBK.js"),[]),ee(()=>import("./fuel_prices-jFU3ASga.js"),[]),ee(()=>import("./generator_efficiency-MkdsxVYB.js"),[]),ee(()=>import("./house_type_appliances-D5Qin5UE.js"),[])]);te("pv_yield",e.default),te("appliances",s.default),te("usage_patterns",t.default),te("tariff_bands",n.default),te("fuel_prices",i.default),te("generator_efficiency",a.default),te("house_type_appliances",r.default)}async function Yi(){await Ki(),Hi()}Yi();
