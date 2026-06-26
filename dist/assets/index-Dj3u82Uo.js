(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const va="modulepreload",ma=function(e){return"/"+e},rt={},Q=function(i,t,n){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),r=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=Promise.allSettled(t.map(c=>{if(c=ma(c),c in rt)return;rt[c]=!0;const v=c.endsWith(".css"),p=v?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const y=document.createElement("link");if(y.rel=v?"stylesheet":va,v||(y.as="script"),y.crossOrigin="",y.href=c,r&&y.setAttribute("nonce",r),document.head.appendChild(y),v)return new Promise((f,u)=>{y.addEventListener("load",f),y.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(l){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=l,window.dispatchEvent(r),!r.defaultPrevented)throw l}return s.then(l=>{for(const r of l||[])r.status==="rejected"&&a(r.reason);return i().catch(a)})},me={location:null,powerSource:null,tariffBand:null,gridSpend:1e5,fuelSpend:5e4,generatorSize:null,houseType:null,rooms:0,appliances:[],solarAppliances:null,customSchedule:null,goal:null,backupHours:4,budget:15e5,results:null,_data:{}},ga=new Set;function R(){return{...me}}function D(e){Object.assign(me,e),ga.forEach(i=>i({...me}))}function z(e){return me._data[e]||null}function ee(e,i){me._data[e]=i}const ya=['<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>','<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.09 12.33A1 1 0 005 14h7l-1 8 8.91-10.33A1 1 0 0019 10h-7l1-8z"/></svg>','<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><circle cx="11" cy="11" r="4"/><line x1="21" y1="3" x2="14.35" y2="9.65"/><polyline points="17,3 21,3 21,7"/></svg>'],lt=[[1],[2],[3]],ha=["step1","step2","step3"];function Ke(e){const i=lt.findIndex(t=>t.includes(e));return`
    <div class="progress-bar">
      ${lt.map((t,n)=>{const s=n<i,a=n===i,l=n<=i,r=s?"completed":a?"active":"",c=l?`onclick="window._navigate('${ha[n]}')" style="cursor:pointer"`:'style="cursor:default"';return`
          ${n>0?`<div class="progress-bar__line ${s?"completed":""}"></div>`:""}
          <div class="progress-bar__step">
            <div class="progress-bar__dot ${r}" ${c}>${ya[n]}</div>
          </div>
        `}).join("")}
    </div>
  `}function Tt(e,i){var r,c,v;const t=R(),n=z("pv_yield")||[];e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn" disabled style="opacity:0.35">
          ← Back
        </button>
        ${Ke(1)}
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
              ${n.map(p=>{var y;return`
                <option value="${p.state}" ${((y=t.location)==null?void 0:y.state)===p.state?"selected":""}>
                  ${p.state} (${p.zone})
                </option>
              `}).join("")}
            </select>
          </div>

          <div id="location-info" class="card" style="margin-top:16px;background:var(--color-primary-bg);border-color:var(--color-primary-light);display:${t.location?"block":"none"}">
            <div style="display:flex;gap:32px;align-items:center">
              <div>
                <div class="label">Zone</div>
                <div class="value" id="loc-zone">${((r=t.location)==null?void 0:r.zone)||""}</div>
              </div>
              <div>
                <div class="label">Peak Sun Hours</div>
                <div class="value value--amber" id="loc-psh">${((c=t.location)==null?void 0:c.daily_yield_kwh_per_kwp)||""} hrs/day</div>
              </div>
              <div>
                <div class="label">Annual Yield</div>
                <div class="value" id="loc-yield">${((v=t.location)==null?void 0:v.annual_yield_kwh_per_kwp)||""} kWh/kWp</div>
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
  `;const s=document.getElementById("location-select"),a=document.getElementById("continue-btn"),l=document.getElementById("location-info");s.addEventListener("change",()=>{const p=n.find(y=>y.state===s.value);p?(D({location:p}),document.getElementById("loc-zone").textContent=p.zone,document.getElementById("loc-psh").textContent=`${p.daily_yield_kwh_per_kwp} hrs/day`,document.getElementById("loc-yield").textContent=`${p.annual_yield_kwh_per_kwp} kWh/kWp`,l.style.display="block",a.disabled=!1):(D({location:null}),l.style.display="none",a.disabled=!0)}),a.addEventListener("click",()=>{R().location&&i("step2")})}function we(e){return"₦"+Number(e).toLocaleString("en-NG")}function ct(e){return parseInt(String(e).replace(/[₦,\s]/g,""),10)||0}function Bt(e){return(14-e/100*28).toFixed(1)}function dt({id:e,value:i,min:t,max:n,step:s=1e3,ticks:a,label:l="per month",formatFn:r=we}){const c=(i-t)/(n-t)*100,v=Bt(c),p=a?a.map((y,f)=>{const u=(y-t)/(n-t)*100,o=i>=(f===0?t:a[f-1])&&i<=y,d=f===0?"translateX(0)":f===a.length-1?"translateX(-100%)":"translateX(-50%)";return`<span class="slider-tick ${o?"active":""}" data-val="${y}" style="left:${u}%;transform:${d}">${r(y)}</span>`}).join(""):"";return`
    <div class="slider-wrapper">
      <div style="text-align:center;margin-bottom:16px">
        <div class="slider-bubble">
          <input
            type="text"
            class="slider-bubble__val"
            id="${e}-val"
            value="${r(i)}"
            inputmode="numeric"
            autocomplete="off"
            aria-label="Monthly spend in Naira"
          />
          <span class="slider-bubble__label">${l}</span>
        </div>
      </div>
      <div class="slider-track-wrap">
        <div class="slider-tooltip" id="${e}-tooltip" style="left:calc(${c}% + ${v}px)">
          <span class="slider-tooltip__val">${r(i)}</span>
          <div class="slider-tooltip__arrow"></div>
        </div>
        <input
          type="range"
          class="sunova-slider"
          id="${e}"
          min="${t}"
          max="${n}"
          step="${s}"
          value="${i}"
          style="background: linear-gradient(to right, var(--color-primary) ${c}%, var(--color-border) ${c}%)"
        />
        ${a?`<div class="slider-ticks">${p}</div>`:""}
      </div>
    </div>
  `}function pt(e,i=we,t){const n=document.getElementById(e),s=document.getElementById(`${e}-val`),a=document.getElementById(`${e}-tooltip`);if(!n||!s)return;const l=Number(n.min),r=Number(n.max),c=Number(n.step)||1;function v(){const p=Number(n.value),y=(p-l)/(r-l)*100,f=Bt(y);if(n.style.background=`linear-gradient(to right, var(--color-primary) ${y}%, var(--color-border) ${y}%)`,s.value=i(p),a){a.style.left=`calc(${y}% + ${f}px)`;const o=a.querySelector(".slider-tooltip__val");o&&(o.textContent=i(p))}t&&t(p);const u=n.closest(".slider-track-wrap").querySelectorAll(".slider-tick");if(u.length>0){const o=Array.from(u).map(d=>Number(d.dataset.val));u.forEach((d,g)=>{const E=g===0?l:o[g-1];d.classList.toggle("active",p>=E&&p<=o[g])})}}if(n.addEventListener("input",v),n.addEventListener("change",v),s.addEventListener("focus",()=>{s.value=ct(s.value)||"",s.select()}),s.addEventListener("blur",()=>{const p=ct(s.value),y=Math.max(l,Math.min(r,p||l)),f=Math.round((y-l)/c)*c+l;n.value=f,v()}),s.addEventListener("keydown",p=>{p.key==="Enter"&&s.blur()}),a){const p=()=>a.classList.add("visible"),y=()=>a.classList.remove("visible");n.addEventListener("mousedown",p),n.addEventListener("touchstart",p,{passive:!0}),document.addEventListener("mouseup",y),document.addEventListener("touchend",y)}}function De({cards:e,selected:i,name:t}){return`
    <div class="radio-cards" data-radio-group="${t}">
      ${e.map(n=>`
        <div class="radio-card ${i===n.id?"selected":""}" data-value="${n.id}">
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
  `}function je(e,i){const t=document.querySelector(`[data-radio-group="${e}"]`);t&&t.querySelectorAll(".radio-card").forEach(n=>{n.addEventListener("click",()=>{t.querySelectorAll(".radio-card").forEach(s=>s.classList.remove("selected")),n.classList.add("selected"),i&&i(n.dataset.value)})})}const fa='<img src="/icons/grid_only.png" width="72" height="72" style="object-fit:contain">',ba='<img src="/icons/generator_only.png" width="72" height="72" style="object-fit:contain">',ka='<img src="/icons/grid_and_generator.png" width="72" height="72" style="object-fit:contain">',xa='<img src="/icons/small_generator_i_better_pass_my_neighbour.png" width="72" height="72" style="object-fit:contain">',_a='<img src="/icons/medium_generator.png" width="72" height="72" style="object-fit:contain">',wa='<img src="/icons/silent_diesel_generator.png" width="72" height="72" style="object-fit:contain">',Sa=[{id:"grid_only",emoji:fa,name:"Grid Only",desc:"I rely solely on NEPA/DisCo grid supply"},{id:"both",emoji:ka,name:"Grid + Generator",desc:"I use both grid and a backup generator"},{id:"generator_only",emoji:ba,name:"Generator Only",desc:"No grid, I run a generator for power"}],Ea=[{id:"small",emoji:xa,label:"I better pass my neighbour",name:"Small (1–2 KVA)"},{id:"medium",emoji:_a,label:"Gasoline generator",name:"Medium (3–5 KVA)"},{id:"large",emoji:wa,label:"Silent diesel generator",name:"Large (6–10 KVA)"}];function Rt(e,i){function t(){var v,p;const s=R(),a=z("tariff_bands")||[],l=s.powerSource==="grid_only"||s.powerSource==="both",r=s.powerSource==="generator_only"||s.powerSource==="both",c=s.powerSource&&(!l||!!s.tariffBand)&&(!r||!!s.generatorSize);e.innerHTML=`
      <div class="wizard-step">
        <div class="wizard-header">
          <button class="back-btn" id="back-btn">← Back</button>
          ${Ke(2)}
          <div style="width:90px"></div>
        </div>

        <div class="step-body">
          <h1 class="step-title">Energy source &amp; monthly spend</h1>
          <p class="step-subtitle">Tell us how you currently power your home and what you spend</p>

          <div class="section-title" style="margin-bottom:14px">How do you currently power your home?</div>
          ${De({cards:Sa,selected:s.powerSource,name:"power-source"})}

          ${l?`
            <div class="section-title" style="margin-top:32px;margin-bottom:12px">Grid electricity</div>
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:10px">What is your electricity tariff band?</div>
            <div class="tariff-pills" id="tariff-pills">
              ${a.map(y=>`
                <button class="tariff-pill ${s.tariffBand===y.band?"selected":""}" data-band="${y.band}">${y.band}</button>
              `).join("")}
            </div>
            ${s.tariffBand?`
              <div class="card" style="margin-top:10px;margin-bottom:16px;background:var(--color-primary-bg);border-color:var(--color-primary-light);padding:10px 14px">
                <div style="display:flex;align-items:center;gap:14px">
                  <div class="tag tag--amber">${s.tariffBand}</div>
                  <div style="font-size:12px;color:var(--color-text-secondary)">
                    ${((v=a.find(y=>y.band===s.tariffBand))==null?void 0:v.hours_of_supply)||""} hrs/day
                    &nbsp;·&nbsp; ₦${((p=a.find(y=>y.band===s.tariffBand))==null?void 0:p.tariff_naira_per_kwh)||""}/kWh
                    &nbsp;<span class="badge-nerc">NERC</span>
                  </div>
                </div>
              </div>
            `:'<div style="margin-bottom:16px"></div>'}
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:6px">Monthly grid spend</div>
            ${dt({id:"grid-spend-slider",value:s.gridSpend,min:1e4,max:1e6,step:1e4,ticks:[1e4,25e4,5e5,75e4,1e6],label:"per month"})}
          `:""}

          ${r?`
            <div class="section-title" style="margin-top:32px;margin-bottom:12px">Generator</div>
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:10px">Choose your generator size</div>
            ${De({cards:Ea,selected:s.generatorSize,name:"gen-size"})}
            <div style="font-size:14px;color:var(--color-text-muted);margin-top:20px;margin-bottom:6px">Monthly fuel spend</div>
            ${dt({id:"fuel-spend-slider",value:s.fuelSpend,min:1e4,max:1e6,step:1e4,ticks:[1e4,25e4,5e5,75e4,1e6],label:"per month"})}
          `:""}
        </div>

        <div class="step-footer">
          <button class="btn btn--primary btn--lg" id="continue-btn" ${c?"":"disabled"}>Continue</button>
        </div>
      </div>
    `,n()}function n(){document.getElementById("back-btn").addEventListener("click",()=>i("step1")),document.getElementById("continue-btn").addEventListener("click",()=>i("step3")),je("power-source",s=>{D({powerSource:s}),t()}),document.querySelectorAll(".tariff-pill").forEach(s=>{s.addEventListener("click",()=>{D({tariffBand:s.dataset.band}),t()})}),je("gen-size",s=>{D({generatorSize:s}),t()}),document.getElementById("grid-spend-slider")&&pt("grid-spend-slider",we,s=>D({gridSpend:s})),document.getElementById("fuel-spend-slider")&&pt("fuel-spend-slider",we,s=>D({fuelSpend:s}))}t()}const ut=["Analysing your energy profile","Sizing your solar PV system","Calculating your savings with solar","Finalising your results"],Aa=[{activeAt:0,doneAt:3e3},{activeAt:3e3,doneAt:8e3},{activeAt:8e3,doneAt:15e3},{activeAt:15e3,doneAt:18e3}],$a=18e3,La=`
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
`;function Ca(){if(document.getElementById("pl-styles"))return;const e=document.createElement("style");e.id="pl-styles",e.textContent=La,document.head.appendChild(e)}function Ma(e){Ca();const i=document.createElement("div");i.id="preloader-overlay",i.innerHTML=`
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
        ${ut.map((t,n)=>`
          <div class="pl-step" id="pl-step-${n}">
            <div class="pl-indicator">
              <div class="pl-dot-wrap">
                <div class="pl-dot"></div>
                <svg class="pl-tick" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="#FCBF1E"/>
                  <path d="M5 9l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              ${n<ut.length-1?'<div class="pl-line-track"><div class="pl-line"></div></div>':""}
            </div>
            <div class="pl-text">${t}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(i),Aa.forEach(({activeAt:t,doneAt:n},s)=>{setTimeout(()=>{var a;(a=document.getElementById(`pl-step-${s}`))==null||a.classList.add("active")},t),setTimeout(()=>{const a=document.getElementById(`pl-step-${s}`);a&&(a.classList.remove("active"),a.classList.add("done"))},n)}),setTimeout(()=>{const t=document.getElementById("preloader-overlay");t&&(e(),t.style.opacity="0",setTimeout(()=>{t.remove()},400))},$a)}function Wt(e,i,t,n,s){const{gridSpend:a=0,fuelSpend:l=0,tariffBand:r,generatorSize:c,powerSource:v,location:p,appliances:y=[],customSchedule:f}=e;let u=0;if(a>0&&r&&v!=="generator_only"){const h=(t||[]).find(F=>F.band===r),$=(h==null?void 0:h.tariff_naira_per_kwh)||0;$>0&&(u=a/$/30)}let o=0;if(l>0&&c&&v!=="grid_only"){const{fuelTypeStr:h,kwhPerLitre:$}=Fa(c,s),F=(p==null?void 0:p.state)||"",T=Ta(h,F,n);T>0&&$>0&&(o=l/T*$/30)}let d=u+o;d<1&&(d=Ba(y,i));const g={};(i||[]).forEach(h=>{g[h.name]=h});const E={};(y||[]).forEach(h=>{E[h.name]=h.qty||1});const A=new Array(24).fill(0);f&&f.length>0&&f.forEach(h=>{const $=g[h.name];if(!$)return;const F=E[h.name]||1,T=$.rated_watts*F/1e3;(h.segments||[]).forEach(x=>{const B=x.start??x.start_hour??0,W=x.end??x.end_hour??0;for(let I=0;I<24;I++)Math.min(W,I+1)-Math.max(B,I)>0&&(A[I]+=T)})});const w=A.reduce((h,$)=>h+$,0),M=u+o>0,_=d;if(w>0){if(_>0){const h=w/_;u=parseFloat((u*h).toFixed(2)),o=parseFloat((o*h).toFixed(2))}d=w}const b=w>0?A.map(h=>parseFloat(h.toFixed(3))):new Array(24).fill(parseFloat((d/24).toFixed(3))),m=Math.max(0,d-w);let k,S;if(w===0)k=30,S="Low";else if(!M)k=55,S="Medium";else{const h=Math.abs(w-_)/Math.max(w,_);h<=.25?(k=Math.round(99-h/.25*14),S="High"):h<=.6?(k=Math.round(84-(h-.25)/.35*29),S="Medium"):(k=Math.max(30,Math.round(54-(h-.6)/.4*24)),S="Low")}const C=b.reduce((h,$,F)=>$>b[h]?F:h,0),L=parseFloat(b[C].toFixed(2));return{totalDailyKWh:parseFloat(d.toFixed(2)),dailyGridKWh:parseFloat(u.toFixed(2)),dailyGenKWh:parseFloat(o.toFixed(2)),ganttTotalKWh:parseFloat(w.toFixed(2)),unaccountedKWh:parseFloat(m.toFixed(2)),hourlyProfile:b,ganttHourly:A.map(h=>parseFloat(h.toFixed(3))),peakHour:C,peakKW:L,confidenceScore:k,confidenceLabel:S,confidenceReason:w===0?"no_appliances":M?S==="High"?"ok":"variance":"no_spending",confidenceDirection:!M||w===0?null:w>_?"appliances_higher":w<_?"spending_higher":"matched",monthlyKWh:parseFloat((d*30).toFixed(1))}}function Fa(e,i){const t={small:{fuelTypeStr:"PMS",kwhPerLitre:2.27},medium:{fuelTypeStr:"PMS",kwhPerLitre:3.38},large:{fuelTypeStr:"AGO",kwhPerLitre:3.71}};if(!i||i.length===0)return t[e]||t.medium;const n={small:{types:["Small Portable"],preferFuel:"PMS"},medium:{types:["Mid-size"],preferFuel:"PMS"},large:{types:["Mid-size","Large Home"],preferFuel:"AGO"}},s=n[e]||n.medium;let a=i.filter(r=>s.types.includes(r.type)&&r.fuel_type.includes(s.preferFuel));if(a.length===0&&(a=i.filter(r=>s.types.includes(r.type))),a.length===0)return t[e]||t.medium;const l=a.reduce((r,c)=>r+c.kwh_per_litre,0)/a.length;return{fuelTypeStr:s.preferFuel,kwhPerLitre:l}}function Ta(e,i,t){const n={AGO:1800,PMS:1300};if(!t||t.length===0)return n[e]||1100;const s=e==="AGO"?"AGO":"PMS",a=t.filter(r=>r.fuel_type.includes(s));if(a.length===0)return n[e]||1100;const l=a.find(r=>r.state.toLowerCase()===i.toLowerCase());return l?l.price_per_litre_naira:Math.round(a.reduce((r,c)=>r+c.price_per_litre_naira,0)/a.length)}function Ba(e,i){if(!e||e.length===0)return 5;const t={};(i||[]).forEach(s=>{t[s.name]=s});let n=0;return e.forEach(s=>{const a=t[s.name];a&&(n+=a.daily_wh*(s.qty||1)/1e3)}),Math.max(2,n)}const We=585,vt=.75,Ra=.8,Wa=1.25,Ia=6.5,Pa=.9025,qa=6,Oa=18,Ie=[3,5,7.5,10,12.5,15,20,25,30],Ga=25e4,Da=6e4,ja=15e4;function It(e,i,t=0){const n=e.totalDailyKWh,s=Math.max(e.peakKW,t),a=(i==null?void 0:i.daily_yield_kwh_per_kwp)||4.5,l=(i==null?void 0:i.annual_yield_kwh_per_kwp)||1642,r=e.hourlyProfile||[];let c=0,v=0;if(r.length===24)for(let m=0;m<24;m++)m>=qa&&m<Oa?c+=r[m]:v+=r[m];else c=n*.5,v=n*.5;const p=c+v/Pa,y=p/(a*vt),f=p*365/l,u=Math.max(y,f),o=Math.ceil(u*1e3/We),d=parseFloat((o*We/1e3).toFixed(2)),g=s*Wa/Ra,E=Ie.find(m=>m>=g)??Ie[Ie.length-1],A=parseFloat((d*Ia).toFixed(1)),w=Math.round(d*l),_=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m=>{var k;return{month:m,kwh:Math.round(d*(((k=i==null?void 0:i.monthly)==null?void 0:k[m.toLowerCase()])||a)*30*vt)}}),b=Math.round(d*Ga+E*Da+ja);return{panel_kwp:d,panel_count:o,inverter_kva:E,installation_m2:A,annual_gen_kwh:w,monthly_gen:_,estimated_cost:b,psh:a,pvKWp_required:parseFloat(u.toFixed(2)),method1_kWp:parseFloat(y.toFixed(2)),method2_kWp:parseFloat(f.toFixed(2)),panelWattage:We}}const Pe=.8,mt=.95,gt=18,yt=23,Na=[18,19,20,21,22,23,0,1,2,3,4,5],za=1.5,qe=[5,10,15,20,25,30,40,50,60,80,100],Ha={reduce_bill:4,backup:8,offgrid:16},Ka=.25,Ya=.6;function Pt(e,i,t){const n=e.peakKW||1,s=e.totalDailyKWh||1,a=e.hourlyProfile||[],l=i==="backup"&&t>0?t:Ha[i]??4,r=a.slice(gt,yt+1),c=r.reduce((w,M)=>w+M,0);let v=r.length>0?c/r.length:0;v===0&&(v=n*.6);let p;i==="offgrid"?p=(a.length===24?Na.reduce((M,_)=>M+(a[_]||0),0):s*.5)*za:p=v*l;const f=p/Pe/mt,u=qe.find(w=>w>=f)??qe[qe.length-1],o=parseFloat((u*Pe*mt).toFixed(2)),d=n>0?Math.min(24,Math.round(o/(n*Ka))):24,g=n>0?Math.min(24,Math.round(o/(n*Ya))):24,E=n>0?Math.min(24,Math.round(o/n)):24,A=Math.ceil(u/5);return{battery_kwh:u,battery_units_48v:A,storage_capacity:u,storage_output:parseFloat(v.toFixed(2)),backup_hours_essentials:d,backup_hours_appliances:g,backup_hours_whole_home:E,backupHours:l,avgBackupLoad_kW:parseFloat(v.toFixed(2)),energyNeeded_kWh:parseFloat(p.toFixed(2)),batteryKWh_gross:parseFloat(f.toFixed(2)),batteryKWh_recommended:u,dod:Pe,backupWindowStart:gt,backupWindowEnd:yt}}function qt({hourlyProfile:e,pvKWp:i,batteryKWh:t,dailyYield:n,dod:s=.8,batteryEfficiency:a=.95,energyMix:l="grid_and_generator",sunriseHour:r=6,sunsetHour:c=18}){const v=Array.from({length:24},(L,h)=>{const $=(h-r)/(c-r)*Math.PI;return $>0&&$<Math.PI?Math.sin($):0}),p=v.reduce((L,h)=>L+h,0),y=v.map(L=>p>0?i*n*L/p:0),f=t,u=t*(1-s);let o=f;for(let L=c;L<24;L++){const h=e[L]||0,$=Math.max(0,o-u),F=Math.min(h,$*a);o-=F/a}let d=Math.max(u,o);const g=Array.from({length:24},(L,h)=>{const $=e[h]||0,F=y[h],T=Math.min(F,$),x=Math.max(0,F-$),B=Math.max(0,$-F),W=Math.min(x,(f-d)/a);d+=W*a;const I=W,j=Math.max(0,d-u),H=Math.min(B,j*a);d-=H/a;const J=H,ne=B-H;return{hour:h,demand:parseFloat($.toFixed(3)),solar_to_load:parseFloat(T.toFixed(3)),battery_to_load:parseFloat(J.toFixed(3)),grid_to_load:parseFloat(ne.toFixed(3)),solar_to_charge:parseFloat(I.toFixed(3)),soc_end:parseFloat(d.toFixed(3)),soc_pct:parseFloat((d/t*100).toFixed(1))}}),E=g.reduce((L,h)=>L+h.demand,0),A=g.reduce((L,h)=>L+h.solar_to_load,0),w=g.reduce((L,h)=>L+h.battery_to_load,0),M=g.reduce((L,h)=>L+h.grid_to_load,0),_=g.reduce((L,h)=>L+h.solar_to_charge,0),b=1,m=E>0?M/E:0,k=parseFloat(_.toFixed(2)),S=parseFloat(M.toFixed(2)),C=l==="grid_only"?"Grid":l==="generator_only"?"Generator":"Grid+Gen";return{hours:g,totalDemand:parseFloat(E.toFixed(2)),totalSolarToLoad:parseFloat(A.toFixed(2)),totalBatteryToLoad:parseFloat(w.toFixed(2)),totalGridToLoad:parseFloat(M.toFixed(2)),totalSolarCharge:parseFloat(_.toFixed(2)),gridReliance_before:b,gridReliance_after:parseFloat(m.toFixed(2)),dailySurplusKWh:k,avgDailyGridKWh:S,gridLabel:C}}const Va=26e4,ht=28e4,Ua=2e5,Ja=.15,Xa=10,te=25,ft=.005,Za=.07,bt=.43,Qa=.65,ei=.7,kt={small:{types:["Small Portable"],preferFuel:"PMS",defaultKwh:2.27},medium:{types:["Mid-size"],preferFuel:"PMS",defaultKwh:3.38},large:{types:["Mid-size","Large Home"],preferFuel:"AGO",defaultKwh:3.71}};function ti(e,i){const t=kt[e]||kt.medium,n=i||[];let s=n.filter(l=>t.types.includes(l.type)&&l.fuel_type.includes(t.preferFuel));s.length||(s=n.filter(l=>t.types.includes(l.type)));const a=s.length?s.reduce((l,r)=>l+r.kwh_per_litre,0)/s.length:t.defaultKwh;return{fuelTypeStr:t.preferFuel,kwhPerLitre:a}}function ai(e,i,t){const n={AGO:1800,PMS:1300};if(!(t!=null&&t.length))return n[e]||1100;const s=e==="AGO"?"AGO":"PMS",a=t.filter(r=>r.fuel_type.includes(s));if(!a.length)return n[e]||1100;const l=a.find(r=>{var c;return((c=r.state)==null?void 0:c.toLowerCase())===(i||"").toLowerCase()});return l?l.price_per_litre_naira:Math.round(a.reduce((r,c)=>r+c.price_per_litre_naira,0)/a.length)}function ii({load:e,solar:i,battery:t,dispatch:n,tariffData:s,fuelPrices:a,genData:l,state:r}){var tt,at,it;const c=e.totalDailyKWh,v=e.monthlyKWh??e.totalDailyKWh*30,p=e.dailyGridKWh||0,y=e.dailyGenKWh||0,f=i.panel_kwp,u=i.inverter_kva,o=((tt=r.location)==null?void 0:tt.annual_yield_kwh_per_kwp)||(((at=r.location)==null?void 0:at.daily_yield_kwh_per_kwp)||4.5)*365,d=t.battery_kwh,g=r.powerSource||"grid_only",E=r.goal||"reduce_bill",A=r.budget||0,w=s==null?void 0:s.find(Y=>Y.band===r.tariffBand),M=(w==null?void 0:w.tariff_naira_per_kwh)||194,{fuelTypeStr:_,kwhPerLitre:b}=ti(r.generatorSize,l),m=((it=r.location)==null?void 0:it.state)||"",k=ai(_,m,a),S=g!=="grid_only"?Math.round(k/b):0,C=Math.round(f*Va+d*ht+u*Ua),L=Math.round(C*Ja),h=C+L,$=Math.round(d*ht),F=A>0?h<=A:!0,T=Math.max(0,A-h),x=Math.max(0,h-A),B=p+y;let W,I;B>0?(W=p/B,I=y/B):g==="grid_only"?(W=1,I=0):g==="generator_only"?(W=0,I=1):(W=.5,I=.5);let j;g==="grid_only"?j=M:g==="generator_only"?j=S:j=Math.round(W*M+I*S);const H=Math.round(j*v),J=f*o*((1-Math.pow(1-ft,te))/ft),se=J>0?Math.round((h+$)/J):45,{totalDemand:ne,totalSolarToLoad:ia,totalBatteryToLoad:sa,totalGridToLoad:na}=n,de=ne>0?(ia+sa)/ne:0,Ue=ne>0?na/ne:1-de,Fe=Ue*W,ye=Ue*I;let oe;E==="offgrid"?oe=se:g==="grid_only"?oe=Math.round(de*se+Fe*M):g==="generator_only"?oe=Math.round(de*se+ye*S):oe=Math.round(de*se+Fe*M+ye*S);const Je=Math.round(oe*v),Xe=H-Je,pe=Xe*12,oa=pe>0?parseFloat((h/pe).toFixed(1)):99,Te=pe*te,ra=Math.round((Te-h-$)/h*100),Ze=h+$,la=Te>0&&Ze>0?parseFloat(((Math.pow(Te/Ze,1/te)-1)*100).toFixed(1)):0;let Be=0,Qe=0;if(g!=="grid_only"){const st=Math.max(0,y-ye*c)*365;Be=b>0?Math.round(st/b):0,Qe=Math.round(Be*k)}let he;const et=_==="AGO"?ei:Qa;g==="grid_only"?he=bt:g==="generator_only"?he=et:he=W*bt+I*et;const ca=f*o,da=parseFloat((ca*he/1e3).toFixed(1));let re=-h,le=-1,fe=null;const Re=[{year:0,cumulative:re}];for(let Y=1;Y<=te;Y++){const nt=pe*Math.pow(1+Za,Y)-(Y===Xa?$:0),ot=re;re+=nt,le===-1&&ot<0&&re>=0&&(le=Y,fe=parseFloat((Y-1+Math.abs(ot)/nt).toFixed(1))),Re.push({year:Y,cumulative:Math.round(re)})}le===-1&&(re>=0?(le=te,fe=te):(le=99,fe=99));const pa=g==="grid_only"?"Grid":g==="generator_only"?"Generator":"Grid + Gen",ua=E==="offgrid"?"Solar":g==="grid_only"?"Solar + Grid":g==="generator_only"?"Solar + Generator":"Solar + Grid + Gen";return{total_system_cost:h,equipment_cost:C,bos_cost:L,battery_replacement_cost:$,isWithinBudget:F,budgetSurplus:T,budgetShortfall:x,current_blended_cost:j,post_solar_blended_cost:oe,LCOE:se,gen_cost_per_kwh:S,current_monthly_cost:H,post_solar_monthly_cost:Je,monthly_savings:Xe,annual_savings:pe,simple_payback_years:oa,ROI:ra,annualised_ROI:la,lifetime_savings:Re[te].cumulative,litres_saved_per_year:Be,fuel_naira_saved_annual:Qe,co2_avoided_tonnes:da,solar_fraction:parseFloat(de.toFixed(3)),grid_fraction:parseFloat(Fe.toFixed(3)),gen_fraction:parseFloat(ye.toFixed(3)),cashflow:Re,payback_year_index:le,payback_exact:fe,current_label:pa,solar_label:ua}}const si=[{name:"Split AC – 1HP",qty:1},{name:"Ceiling Fan",qty:3},{name:"LED Bulb (9W)",qty:18},{name:"LED Bulb (15W)",qty:9},{name:"Security Light (floodlight)",qty:5},{name:"Refrigerator (200L)",qty:1},{name:'LED TV – 43"',qty:2},{name:"DSTV Decoder",qty:1},{name:"Wi-Fi Router",qty:1},{name:"Phone Charger",qty:2},{name:"CCTV System (4 cameras)",qty:1}];function ni(e){const i=Object.fromEntries(e.map(t=>[t.name,t]));return si.reduce((t,n)=>{const s=i[n.name];return t+(s?s.rated_watts*n.qty/1e3:0)},0)}function $e(){var o;const e=R(),i=z("appliances")||[],t=z("tariff_bands")||[],n=z("fuel_prices")||[],s=z("generator_efficiency")||[],a=new Set((e.appliances||[]).map(d=>d.name)),l=e.solarAppliances?new Set(e.solarAppliances):a,r={...e,appliances:(e.appliances||[]).filter(d=>l.has(d.name)),customSchedule:e.customSchedule?e.customSchedule.filter(d=>l.has(d.name)):null},c=Wt(r,i,t,n,s),v=ni(i),p=It(c,e.location,v),y=Pt(c,e.goal,e.backupHours),f=qt({hourlyProfile:c.hourlyProfile,pvKWp:p.panel_kwp,batteryKWh:y.battery_kwh,dailyYield:((o=e.location)==null?void 0:o.daily_yield_kwh_per_kwp)||4.5,energyMix:e.powerSource}),u=ii({load:c,solar:p,battery:y,dispatch:f,tariffData:t,fuelPrices:n,genData:s,state:e});D({results:{load:c,solar:p,battery:y,dispatch:f,savings:u}})}const oi=[{id:"reduce_bill",emoji:'<img src="/icons/reduce_my_bill.png" width="72" height="72" style="object-fit:contain">',name:"Reduce Bill",desc:"Reduce my monthly bill effectively"},{id:"backup",emoji:'<img src="/icons/backup_power.png" width="72" height="72" style="object-fit:contain">',name:"Backup Power",desc:"Have some backup power"},{id:"offgrid",emoji:'<img src="/icons/off_grid.png" width="72" height="72" style="object-fit:contain">',name:"Off-Grid",desc:"Go completely off-grid"}];function Ot(e,i){const t=R();e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${Ke(3)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <h1 class="step-title">What is your solar goal?</h1>
        <p class="step-subtitle">Choose what matters most to you about going solar</p>

        ${De({cards:oi,selected:t.goal,name:"solar-goal"})}
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="generate-btn" ${t.goal?"":"disabled"}>Generate Results</button>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>i("step2"));function n(){var l;(l=document.querySelector(".backup-hours-inject"))==null||l.remove();const s=document.querySelector('[data-radio-group="solar-goal"] [data-value="backup"]');if(!s)return;const a=document.createElement("div");a.className="backup-hours-inject",a.style.cssText="margin-top:12px;padding-top:12px;border-top:1.5px solid rgba(0,0,0,0.12);display:flex;justify-content:center",a.innerHTML=`
      <div class="rooms-counter">
        <span class="rooms-counter__label" style="font-size:12px">Backup hrs</span>
        <button class="rooms-counter__btn" id="backup-dec">–</button>
        <span class="rooms-counter__val" id="backup-val">${R().backupHours}</span>
        <button class="rooms-counter__btn" id="backup-inc">+</button>
      </div>`,s.appendChild(a),document.getElementById("backup-dec").addEventListener("click",r=>{r.stopPropagation(),D({backupHours:Math.max(1,R().backupHours-1)}),document.getElementById("backup-val").textContent=R().backupHours}),document.getElementById("backup-inc").addEventListener("click",r=>{r.stopPropagation(),D({backupHours:R().backupHours+1}),document.getElementById("backup-val").textContent=R().backupHours})}je("solar-goal",s=>{var a;D({goal:s}),document.getElementById("generate-btn").disabled=!1,s==="backup"?n():(a=document.querySelector(".backup-hours-inject"))==null||a.remove()}),R().goal==="backup"&&n(),document.getElementById("generate-btn").addEventListener("click",()=>{$e(),Ma(()=>i("costSavings"))})}const xt=e=>"₦"+Number(e).toLocaleString("en-NG"),ri=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],li={north:[.6,.8,1.3,1.45,1.3,.85,.7,.72,.9,1.1,.75,.6],middle:[.75,.9,1.25,1.35,1.15,.82,.68,.7,.85,1.05,.85,.72],south:[1.1,1.2,1.3,1.2,1,.7,.65,.65,.8,1,1.1,1.05]};function Gt(e){return e?/North West|North East/i.test(e)?"north":/North Central/i.test(e)?"middle":"south":"south"}function ci(e,i,t,n){const s={};(t||[]).forEach(o=>{s[o.name]=o});let a=0,l=0;(i||[]).forEach(o=>{const d=s[o.name];if(!d)return;const g=d.rated_watts*(o.qty||1);l+=g,d.category==="Cooling"&&(a+=g)});const r=l>0?a/l:.35,c=li[Gt(n)],v=c.reduce((o,d)=>o+d,0)/12,p=c.map(o=>o/v),y=e.totalDailyKWh,f=y*r,u=y-f;return p.map(o=>parseFloat(((u+f*o)*30).toFixed(1)))}function Dt(e,i){const t=R(),n=z("appliances")||[],{results:s,location:a,powerSource:l,tariffBand:r,gridSpend:c,fuelSpend:v,appliances:p}=t;if(!s){i("step1");return}const{load:y,solar:f}=s,u=p&&p.length>0,o={grid_only:"Grid Only",generator_only:"Generator Only",both:"Grid & Generator"}[l]||"Grid & Generator",d={};n.forEach(S=>{d[S.name]=S});let g=0,E=0;(p||[]).forEach(S=>{const C=d[S.name];if(!C)return;const L=C.rated_watts*(S.qty||1);E+=L,C.category==="Cooling"&&(g+=L)});const A=E>0?Math.round(g/E*100):35,w=(a==null?void 0:a.zone)||"",M=Gt(w),_={north:"Northern Nigeria: peak cooling March to May, cool harmattan Nov to Feb",middle:"Middle Belt: peak cooling March to May, mild rainy dip Jun to Sep",south:"Southern Nigeria: peak cooling Feb to Apr, rainy season dip Jun to Sep"}[M],b=u?`
    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Energy Consumption</div>
      <div class="chart-header-row" style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px">
        <div style="display:flex;gap:28px;align-items:flex-end">
          <div>
            <div class="label">Daily average</div>
            <div class="kwh-day">${y.totalDailyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
          </div>
          <div>
            <div class="label">Monthly average</div>
            <div style="font-size:24px;font-weight:700;color:var(--color-text)">${y.monthlyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
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
          <div class="kwh-day">${y.totalDailyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
        </div>
        <div>
          <div class="label">Monthly average</div>
          <div style="font-size:24px;font-weight:700;color:var(--color-text)">${y.monthlyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
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
                <div class="value">${o}</div>
              </div>
              ${r&&l!=="generator_only"?`<div class="assumption-item"><div class="label">Tariff</div><div class="tag tag--amber">${r}</div></div>`:""}
              ${c&&l!=="generator_only"?`<div class="assumption-item"><div class="label">Grid Spend</div><div class="value">${xt(c)}</div></div>`:""}
              ${v&&l!=="grid_only"?`<div class="assumption-item"><div class="label">Generator Spend</div><div class="value">${xt(v)}</div></div>`:""}
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
                  <div class="value value--amber" style="font-size:22px;line-height:1.1">${f.psh}</div>
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

          ${b}
        </div>
      </div>

    </div>
  `,window._navigate=i,!u)return;const m=ci(y,p,n,w),k=parseFloat((m.reduce((S,C)=>S+C,0)/12).toFixed(1));_t(y),Oe(`Hourly kWh from your appliance schedule, scaled to match spending data. Confidence: ${y.confidenceLabel} (${y.confidenceScore}%).`),document.getElementById("chart-view-sel").addEventListener("change",function(){this.value==="hourly"?(_t(y),Oe(`Hourly kWh from your appliance schedule, scaled to match spending data. Confidence: ${y.confidenceLabel} (${y.confidenceScore}%).`)):(di(m,k),Oe(`Seasonal estimate: ${A}% of your load is cooling. ${_}.`))})}function Oe(e){const i=document.getElementById("chart-caption");i&&(i.textContent=e)}function _t(e){var a;const i=(a=document.getElementById("load-chart"))==null?void 0:a.getContext("2d");if(!i)return;window._loadChart&&window._loadChart.destroy();const t=Array.from({length:24},(l,r)=>r===0?"12am":r===12?"12pm":r<12?`${r}am`:`${r-12}pm`),n=Math.max(...e.hourlyProfile),s=e.hourlyProfile.map(l=>{const r=l/n;return r>.75?"#EF4444":r>.45?"#F5A623":"#FCD34D"});window._loadChart=new Chart(i,{type:"bar",data:{labels:t,datasets:[{data:e.hourlyProfile,backgroundColor:s,borderRadius:8,borderSkipped:!1,barPercentage:.55,categoryPercentage:.8}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:l=>`${l.raw} kW`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:l=>`${l} kW`}}}}})}function di(e,i){var s;const t=(s=document.getElementById("load-chart"))==null?void 0:s.getContext("2d");if(!t)return;window._loadChart&&window._loadChart.destroy();const n=e.map(a=>a>=i?"#F5A623":"#93C5FD");window._loadChart=new Chart(t,{type:"bar",data:{labels:ri,datasets:[{type:"bar",data:e,backgroundColor:n,borderRadius:8,borderSkipped:!1,barPercentage:.55,categoryPercentage:.8,order:2},{type:"line",data:new Array(12).fill(i),borderColor:"#6B7280",borderWidth:1.5,borderDash:[4,3],pointRadius:0,fill:!1,order:1,label:"Monthly average"}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:a=>a.datasetIndex===0?`${a.raw} kWh`:`Avg: ${i} kWh`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:a=>`${a}`},title:{display:!0,text:"kWh / month",font:{size:10,family:"Outfit, sans-serif"},color:"#9CA3AF"}}}}})}const pi=e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;");function ui(e){return{Cooling:"❄️",Lighting:"💡",Kitchen:"🍳",Entertainment:"📺","ICT / Office":"💻",Laundry:"🫧",Water:"💧",Security:"🔒"}[e]||"🔌"}function Ge(e){return e>=1e3?`${(e/1e3).toFixed(1)} MWh/yr`:`${e.toLocaleString()} kWh/yr`}function vi(){const{results:e,budget:i}=R()||{};if(!e)return;const t=p=>document.getElementById(p),n=p=>"₦"+Number(p).toLocaleString("en-NG"),s=e.savings.total_system_cost,a=i>=s,l=Math.min(100,Math.round(i/s*100));t("fq-solar-kwp")&&(t("fq-solar-kwp").textContent=`${e.solar.panel_kwp.toFixed(1)} kWp`),t("fq-solar-count")&&(t("fq-solar-count").textContent=`${e.solar.panel_count} panels`),t("fq-inverter-kva")&&(t("fq-inverter-kva").textContent=`${e.solar.inverter_kva.toFixed(1)} kVA`),t("fq-battery-kwh")&&(t("fq-battery-kwh").textContent=`${e.battery.battery_kwh.toFixed(1)} kWh`),t("fq-system-cost")&&(t("fq-system-cost").textContent=n(s));const r=t("fq-budget-fill");r&&(r.style.width=`${l}%`);const c=t("fq-budget-delta");c&&(c.style.color=a?"var(--color-success)":"var(--color-error)",c.textContent=a?`+${n(i-s)} surplus`:`${n(s-i)} gap`);const v=t("fq-boq-body");if(v){const p=e.solar,y=e.battery,f=[{product:"Jinko Solar 585W Mono PERC Half-Cell",sku:"JK-585M-HC",category:"Solar Panel",qty:p.panel_count},{product:`DEYE ${p.inverter_kva}kW Hybrid Inverter`,sku:`DEYE-HYB-${p.inverter_kva}KW`,category:"Inverter",qty:1},{product:"48V LiFePO4 Battery 5kWh",sku:"BAT-LFP-48V-5K",category:"Battery",qty:y.battery_units_48v},{product:"Roof Mounting Kit (Tile / Metal)",sku:"MNT-ROOF-TILE",category:"Mounting",qty:Math.ceil(p.panel_count/4)},{product:"4mm² DC Solar Cable (Red + Black)",sku:"CBL-DC-4MM-PAIR",category:"Cabling",qty:`${Math.ceil(p.panel_kwp*10)}m`}];v.innerHTML=f.map(u=>`
      <tr>
        <td><span class="bom-product">${u.product}</span><span class="bom-sku">${u.sku}</span></td>
        <td>${u.category}</td>
        <td style="text-align:right">${u.qty}</td>
      </tr>`).join("")}}function wt(){const e=document.getElementById("pv-confidence-card"),i=document.getElementById("pv-profile-card");if(!e||!i)return;e.style.alignSelf="start";const t=e.getBoundingClientRect().height;e.style.alignSelf="",i.style.maxHeight=t+"px"}function mi(e){return e>=85?"High":e>=55?"Medium":"Low"}function gi(e,i,t){const n=s=>`<div style="padding:12px 14px;background:var(--color-primary-bg);border:1.5px solid var(--color-primary-light);border-radius:var(--radius-md);font-size:12px;line-height:1.6;color:var(--color-text-secondary)">${s}</div>`;return e==="no_appliances"?n(`<strong style="color:var(--color-text)">Boost your confidence score.</strong> Add your appliances and usage schedule to get a <strong>High</strong> confidence result.<div style="margin-top:10px"><button class="btn btn--primary btn--sm" onclick="window._navigate('addAppliances')">Add Appliances →</button></div>`):e==="no_spending"?n('<strong style="color:var(--color-text)">Single-source estimate.</strong> Your sizing is based on your appliance list only. We have no energy spend data to cross-check against.'):e==="variance"&&i==="Low"?n(`<strong style="color:var(--color-text)">Your bills and appliance list don't match up.</strong> ${t==="appliances_higher"?"Your appliance list suggests a much higher consumption than your energy spend implies. Please review your appliance list and make sure it reflects what you actually run.":"Your energy spend implies a much higher load than your appliance list accounts for. Some appliances or heavy loads may be missing from your list."}<div style="margin-top:10px"><button class="btn btn--primary btn--sm" onclick="window._navigate('addAppliances')">Update Appliance List</button></div>`):e==="variance"?n(`<strong style="color:var(--color-text)">Nearly there.</strong> ${t==="appliances_higher"?"Your appliance list suggests slightly more consumption than your energy spend.":"Your energy spend suggests slightly more consumption than your appliance list."} Your sizing is a reasonable estimate. Adjusting your appliance list can bring it closer.<div style="margin-top:10px"><button class="btn btn--primary btn--sm" onclick="window._navigate('addAppliances')">Update Appliance List</button></div>`):""}function jt(e,i){const{results:t,appliances:n}=R();if(!t){i("step1");return}const s=z("appliances")||[],a=z("tariff_bands")||[],l=z("fuel_prices")||[],r=z("generator_efficiency")||[],c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],v=n&&n.length>0,{powerSource:p}=R(),y=p==="grid_only"?"Grid Reliance (Grid)":p==="generator_only"?"Grid Reliance (Gen)":"Grid Reliance (Grid + Gen)",{solarAppliances:f}=R(),u=f?new Set(f):new Set(n.map(_=>_.name));function o(){var $;const _=R(),b=v?n.filter(F=>u.has(F.name)):n,m=new Set(b.map(F=>F.name)),k={..._,appliances:b,customSchedule:_.customSchedule?_.customSchedule.filter(F=>m.has(F.name)):null},S=Wt(k,s,a,l,r),C=It(S,_.location),L=Pt(S,_.goal,_.backupHours),h=qt({hourlyProfile:S.hourlyProfile,pvKWp:C.panel_kwp,batteryKWh:L.battery_kwh,dailyYield:(($=_.location)==null?void 0:$.daily_yield_kwh_per_kwp)||4.5,energyMix:_.powerSource});return{load:S,solar:C,battery:L,dispatch:h}}const{load:d,solar:g,battery:E,dispatch:A}=o(),w=_=>`<span class="confidence-tooltip-wrap" style="display:inline-flex;vertical-align:middle;margin-left:4px"><button class="confidence-tooltip-btn" type="button">?</button><span class="confidence-tooltip-box">${_}</span></span>`;e.innerHTML=`
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
            <div class="spec-card__value" id="spec-solar-kwp">${g.panel_kwp} kWp</div>
            <div class="spec-card__sub" id="spec-solar-count">Capacity · ${g.panel_count} panels</div>
            <div style="font-size:36px;margin-top:8px">🔆</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Inverter ${w("Converts solar DC power to AC electricity for your home. Sized to handle your peak demand without cutting out.")}</div>
            <div class="spec-card__value" id="spec-inverter-kva">${g.inverter_kva} kVA</div>
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
            <div class="spec-card__value" id="spec-area-m2">${g.installation_m2} m²</div>
            <div class="spec-card__sub">Required</div>
            <div style="font-size:36px;margin-top:8px">📐</div>
          </div>
        </div>

        ${v?`

          <!-- ── WITH APPLIANCES: full layout ───────────────────────── -->
          <div class="solar-three-col">
            <div class="card">
              <div class="section-title" style="margin-bottom:4px">Projected Generation <span class="tag tag--amber" style="font-size:10px">kWh</span></div>
              <div class="value value--amber" id="spec-annual-gen" style="font-size:18px;font-weight:700;margin-bottom:12px">${Ge(g.annual_gen_kwh)}</div>
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
                <div id="spec-confidence-label" style="font-size:18px;font-weight:700;margin-top:-20px">${d.confidenceLabel||mi(d.confidenceScore)}</div>
                <div id="spec-confidence-score" style="font-size:13px;color:var(--color-text-secondary)">${d.confidenceScore}% Confidence</div>
              </div>
              <div id="spec-confidence-prompt" style="margin-top:14px"></div>
            </div>

            <div class="card" id="pv-profile-card" style="overflow:hidden;display:flex;flex-direction:column;min-height:0">
              <div class="section-title" style="margin-bottom:6px;flex-shrink:0">Interactive Profile</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:6px;flex-shrink:0">Check the appliances you want solar to cover &nbsp;<span id="solar-selection-indicator" style="color:var(--color-text-muted);font-weight:400">(${u.size}/${n.length} selected)</span></div>
              <div class="interactive-profile" style="padding:0;overflow-y:auto;flex:1;min-height:0">
                ${n.map(_=>`
                  <div class="profile-appliance-row" data-name="${pi(_.name)}" style="cursor:pointer;user-select:none">
                    <div class="checkbox ${u.has(_.name)?"checked":""}"></div>
                    <div class="profile-appliance-row__img-placeholder">${ui(_.category||"")}</div>
                    <span>${_.name}</span>
                    <span style="margin-left:auto;font-size:12px;color:var(--color-text-muted)">×${_.qty}</span>
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
                <div id="dispatch-stat-reliance">${y} <strong>${Math.round(A.gridReliance_before*100)}% → ${Math.round(A.gridReliance_after*100)}%</strong></div>
                <div id="dispatch-stat-grid">Avg daily grid use <strong>${A.totalDemand.toFixed(1)} → ${A.avgDailyGridKWh} kWh</strong></div>
                <div id="dispatch-stat-surplus">Avg daily surplus <strong>${A.dailySurplusKWh} kWh</strong></div>
              </div>
              <div style="display:flex;gap:16px;font-size:11px;margin-bottom:8px;flex-wrap:wrap">
                <span><span style="display:inline-block;width:10px;height:10px;background:#FCBF1E;border-radius:2px"></span> Solar</span>
                <span><span style="display:inline-block;width:10px;height:10px;background:#2E86AB;border-radius:2px"></span> Battery</span>
                <span><span style="display:inline-block;width:10px;height:10px;background:#E84855;border-radius:2px"></span> ${A.gridLabel}</span>
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
              <div class="value value--amber" id="spec-annual-gen" style="font-size:18px;font-weight:700;margin-bottom:12px">${Ge(g.annual_gen_kwh)}</div>
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
              <div class="section-title" style="margin-bottom:12px">${y}</div>
              <div style="display:flex;gap:32px;flex-wrap:wrap">
                <div class="storage-stat">
                  <div class="label">Before Solar</div>
                  <div class="value" style="color:var(--color-text-muted)" id="dispatch-stat-reliance-before">${Math.round(A.gridReliance_before*100)}%</div>
                </div>
                <div class="storage-stat">
                  <div class="label">After Solar</div>
                  <div class="value value--amber" id="dispatch-stat-reliance-after">${Math.round(A.gridReliance_after*100)}%</div>
                </div>
                <div class="storage-stat">
                  <div class="label">Avg Daily Grid Use</div>
                  <div class="value value--amber" id="dispatch-stat-grid"><span style="color:var(--color-text-muted)">${A.totalDemand.toFixed(1)}</span> → ${A.avgDailyGridKWh} kWh</div>
                </div>
                <div class="storage-stat">
                  <div class="label">Avg Daily Surplus</div>
                  <div class="value value--amber" id="dispatch-stat-surplus">${A.dailySurplusKWh} kWh</div>
                </div>
              </div>
            </div>
          </div>

        `}

        <!-- ── Add Appliances CTA (always last) ──────────────────────── -->
        <div class="refine-prompt-card" style="margin-top:24px">
          <div class="refine-prompt-card__icon">⚡</div>
          <div class="refine-prompt-card__body">
            <div class="refine-prompt-card__title">${v?"Update your home profile":"Your estimate is based on spending. Make it Sharper"}</div>
            <div class="refine-prompt-card__desc">${v?"You can update your appliance list or usage schedule at any time to keep your solar recommendation accurate.":"Right now we sized your solar system from your energy spend. Tell us which appliances you run and when, and we'll calculate a precise load curve, a seasonal forecast, and raise your confidence score."}</div>
            <button class="btn btn--primary" onclick="window._navigate('addAppliances')">Add Appliances</button>
          </div>
        </div>

      </div>
    </div>
  `,window._navigate=i,document.querySelectorAll(".confidence-tooltip-wrap").forEach(_=>{var b;(b=_.querySelector(".confidence-tooltip-btn"))==null||b.addEventListener("click",m=>{m.stopPropagation();const k=_.classList.contains("is-open");document.querySelectorAll(".confidence-tooltip-wrap.is-open").forEach(S=>S.classList.remove("is-open")),k||_.classList.add("is-open")})}),document.addEventListener("click",()=>{document.querySelectorAll(".confidence-tooltip-wrap.is-open").forEach(_=>_.classList.remove("is-open"))}),St(g,c),v&&(yi(d.confidenceScore),document.getElementById("spec-confidence-prompt").innerHTML=gi(d.confidenceReason,d.confidenceLabel,d.confidenceDirection),requestAnimationFrame(()=>{Et("dispatch-canvas",A),wt()})),v&&document.querySelectorAll(".profile-appliance-row[data-name]").forEach(_=>{_.addEventListener("click",()=>{const b=_.dataset.name,m=_.querySelector(".checkbox");u.has(b)?(u.delete(b),m.classList.remove("checked")):(u.add(b),m.classList.add("checked"));const k=u.size===n.length;D({solarAppliances:k?null:[...u]});const S=document.getElementById("solar-selection-indicator");S&&(S.textContent=`(${u.size}/${n.length} selected)`),M()})});function M(){const{solar:_,battery:b,dispatch:m}=o(),k=S=>document.getElementById(S);k("spec-solar-kwp").textContent=`${_.panel_kwp} kWp`,k("spec-solar-count").textContent=`Capacity · ${_.panel_count} panels`,k("spec-inverter-kva").textContent=`${_.inverter_kva} kVA`,k("spec-battery-kwh").textContent=`${b.battery_kwh} kWh`,k("spec-battery-units").textContent=`Storage · ${b.battery_units_48v} units`,k("spec-area-m2").textContent=`${_.installation_m2} m²`,k("spec-annual-gen").textContent=Ge(_.annual_gen_kwh),k("spec-storage-cap")&&(k("spec-storage-cap").textContent=`${b.storage_capacity} kWh`),k("spec-storage-out")&&(k("spec-storage-out").textContent=`${b.storage_output.toFixed(2)} kW`),k("spec-backup-ess")&&(k("spec-backup-ess").textContent=`${b.backup_hours_essentials}hrs`),k("spec-backup-app")&&(k("spec-backup-app").textContent=`${b.backup_hours_appliances}hrs`),k("spec-backup-home")&&(k("spec-backup-home").textContent=`${b.backup_hours_whole_home}hrs`),k("dispatch-stat-reliance")&&(k("dispatch-stat-reliance").innerHTML=`${y} <strong>${Math.round(m.gridReliance_before*100)}% → ${Math.round(m.gridReliance_after*100)}%</strong>`),k("dispatch-stat-grid")&&(k("dispatch-stat-grid").innerHTML=`Avg daily grid use <strong>${m.totalDemand.toFixed(1)} → ${m.avgDailyGridKWh} kWh</strong>`),k("dispatch-stat-surplus")&&(k("dispatch-stat-surplus").innerHTML=`Avg daily surplus <strong>${m.dailySurplusKWh} kWh</strong>`),St(_,c),v&&(Et("dispatch-canvas",m),requestAnimationFrame(wt)),$e(),vi()}}function St(e,i){var l;const t=document.getElementById("gen-chart");if(!t)return;(l=Chart.getChart(t))==null||l.destroy();const n=t.getContext("2d"),s=e.monthly_gen.map(r=>r.kwh),a=Math.max(...s);new Chart(n,{type:"bar",data:{labels:i,datasets:[{data:s,backgroundColor:s.map(r=>r/a>.9?"#EF4444":r/a>.75?"#F5A623":"#FCD34D"),borderRadius:8,barPercentage:.5,categoryPercentage:.8}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:r=>`${r.raw} kWh`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:9,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:9,family:"Outfit, sans-serif"},callback:r=>`${r}`}}}}})}function yi(e){var s;const i=document.getElementById("gauge-chart");if(!i)return;(s=Chart.getChart(i))==null||s.destroy();const t=i.getContext("2d"),n=e>=85?"#10B981":e>=55?"#F59E0B":"#EF4444";new Chart(t,{type:"doughnut",data:{datasets:[{data:[e,100-e],backgroundColor:[n,"#E5E7EB"],borderWidth:0,circumference:180,rotation:270}]},options:{responsive:!1,cutout:"75%",plugins:{legend:{display:!1},tooltip:{enabled:!1}}}})}function Et(e,i){let t=document.getElementById(e);if(!t||!i)return;const n=t.cloneNode(!1);t.parentNode.replaceChild(n,t),t=n;const s=t.parentElement,a=window.devicePixelRatio||1,l=s.clientWidth||Math.min(window.innerWidth-32,600),r=220;t.width=l*a,t.height=r*a,t.style.width=l+"px",t.style.height=r+"px";const c=t.getContext("2d");c.scale(a,a);const v=46,p=12,y=10,f=28,u=l-v-p,o=r-y-f,d=i.hours,E=Math.max(...d.map(C=>C.demand+C.solar_to_charge),.01)*1.12,A=o/E,w=u/24,M=Math.max(4,w*.6),_=5,b={solar:"#FCBF1E",battery:"#2E86AB",grid:"#E84855",charge:"#A8DADC"};c.font="10px Outfit, sans-serif",c.textAlign="right",[0,.25,.5,.75,1].forEach(C=>{const L=E*C,h=y+o-L*A;c.strokeStyle="#F3F4F6",c.lineWidth=1,c.beginPath(),c.moveTo(v,h),c.lineTo(v+u,h),c.stroke(),c.fillStyle="#9CA3AF",c.fillText(L.toFixed(1),v-4,h+3.5)}),c.save(),c.translate(13,y+o/2),c.rotate(-Math.PI/2),c.textAlign="center",c.fillStyle="#6B7280",c.fillText("kW",0,0),c.restore();function m(C,L,h,$,F){if($<=0)return;const T=Math.min(F,h/2,$/2);c.beginPath(),c.moveTo(C,L+$),c.lineTo(C,L+T),c.quadraticCurveTo(C,L,C+T,L),c.lineTo(C+h-T,L),c.quadraticCurveTo(C+h,L,C+h,L+T),c.lineTo(C+h,L+$),c.closePath(),c.fill()}const k=[];d.forEach(C=>{const L=[{v:C.solar_to_load,c:b.solar},{v:C.battery_to_load,c:b.battery},{v:C.grid_to_load,c:b.grid},{v:C.solar_to_charge,c:b.charge}];let h=-1;for(let x=L.length-1;x>=0;x--)if(L[x].v>=.001){h=x;break}const $=v+C.hour*w+(w-M)/2,F=y+o;let T=F;L.forEach((x,B)=>{if(x.v<.001)return;const W=x.v*A;T-=W,c.fillStyle=x.c,B===h?m($,T,M,W,_):c.fillRect($,T,M,W)}),k.push({bx:$,bW:M,topY:T,bottomY:F,d:C})}),c.strokeStyle="#D1D5DB",c.lineWidth=1,c.beginPath(),c.moveTo(v,y+o),c.lineTo(v+u,y+o),c.stroke(),c.fillStyle="#6B7280",c.textAlign="center",c.font="9px Outfit, sans-serif";for(let C=0;C<24;C+=3){const L=C===0?"12am":C<12?`${C}am`:C===12?"12pm":`${C-12}pm`;c.fillText(L,v+C*w+w/2,r-6)}const S=document.getElementById("dispatch-tooltip");t.addEventListener("mousemove",C=>{const L=t.getBoundingClientRect(),h=C.clientX-L.left,$=C.clientY-L.top,F=k.find(W=>h>=W.bx&&h<=W.bx+W.bW);if(!F||$<y||$>y+o){S&&(S.style.display="none");return}const T=F.d,x=T.hour,B=x===0?"12am":x<12?`${x}am`:x===12?"12pm":`${x-12}pm`;if(S){let W=h+14,I=$-106;W+152>l&&(W=h-166),I<0&&(I=$+14),S.style.left=W+"px",S.style.top=I+"px",S.style.display="block",S.innerHTML=`
        <div style="font-weight:700;margin-bottom:5px;font-size:12px">${B}</div>
        <div><span style="color:${b.solar}">■</span> Solar: ${T.solar_to_load.toFixed(2)} kW</div>
        <div><span style="color:${b.battery}">■</span> Battery: ${T.battery_to_load.toFixed(2)} kW</div>
        <div><span style="color:${b.grid}">■</span> ${i.gridLabel}: ${T.grid_to_load.toFixed(2)} kW</div>
        <div><span style="color:${b.charge}">■</span> Charging: ${T.solar_to_charge.toFixed(2)} kW</div>
        <div style="margin-top:5px;padding-top:5px;border-top:1px solid #374151;color:#A8B4C4;font-size:10px">Battery Level (SoC): ${T.soc_pct.toFixed(1)}%</div>
      `}}),t.addEventListener("mouseleave",()=>{S&&(S.style.display="none")})}const ae=e=>"₦"+Number(e).toLocaleString("en-NG");function Nt(e,i){const t=R();if(!t.results){i("step1");return}const{savings:n}=t.results;t.appliances&&t.appliances.length>0;const s=a=>`<span class="confidence-tooltip-wrap" style="display:inline-flex;vertical-align:middle;margin-left:4px"><button class="confidence-tooltip-btn" type="button">?</button><span class="confidence-tooltip-box">${a}</span></span>`;e.innerHTML=`
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
              <div class="savings-kpi__label">Current Energy Cost ${s("The average cost you pay per kWh right now, based on your current grid tariff and/or generator fuel spend.")}</div>
              <div class="savings-kpi__value">${ae(n.current_blended_cost)}/kWh <span class="savings-kpi__arrow-up">↑</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/current_blended_cost.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Energy Cost with Solar ${s("Your estimated cost per kWh after solar is installed, blending the solar generation cost with any remaining grid or generator usage.")}</div>
              <div class="savings-kpi__value">${ae(n.post_solar_blended_cost)}/kWh <span class="savings-kpi__arrow-down">↓</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/solar_blended_cost.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Annual Fuel Savings ${s("How much you save on generator fuel each year by replacing that consumption with solar power.")}</div>
              <div class="savings-kpi__value">${ae(n.fuel_naira_saved_annual)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">${(n.litres_saved_per_year||0).toLocaleString()} Lt Saved/Year</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/fuel_savings.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">ROI ${s("Total return on investment over 25 years. Calculated as total savings minus total costs, as a percentage of the initial system cost.")}</div>
              <div class="savings-kpi__value">${n.ROI}%</div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/return_on_investment.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Payback Period ${s("How many years before your accumulated energy savings fully recover the cost of the solar system.")}</div>
              <div class="savings-kpi__value">${n.payback_exact} Years</div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/payback_period.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Energy Bill Savings ${s("Your estimated net saving in energy costs each year after switching to solar, based on the difference between your current energy spend and your projected post-solar spend.")}</div>
              <div class="savings-kpi__value">${ae(n.annual_savings)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">Per Year</span></div>
            </div>
            <div class="savings-kpi__icon"><img src="/icons/annual_savings.png" width="64" height="64" style="object-fit:contain"></div>
          </div>
        </div>

        <div class="savings-env-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;margin-top:0">
          <div class="card">
            <div class="savings-kpi" style="border:none;padding:0">
              <div>
                <div class="savings-kpi__label">Lifetime Savings ${s("Your total net savings over 25 years, after deducting the initial system cost and a battery replacement at year 10.")}</div>
                <div class="savings-kpi__value">${ae(n.lifetime_savings)}</div>
                <div class="savings-kpi__sub"><span class="pill--amber">Over 25 Years</span></div>
              </div>
              <div class="savings-kpi__icon"><img src="/icons/lifetime_savings.png" width="64" height="64" style="object-fit:contain"></div>
            </div>
          </div>
          <div class="card">
            <div class="savings-kpi" style="border:none;padding:0">
              <div>
                <div class="savings-kpi__label">Carbon Emission Avoided ${s("The CO₂ emissions your solar system prevents each year by replacing fossil fuel electricity with clean solar energy.")}</div>
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

  `,window._navigate=i,document.querySelectorAll(".confidence-tooltip-wrap").forEach(a=>{var l;(l=a.querySelector(".confidence-tooltip-btn"))==null||l.addEventListener("click",r=>{r.stopPropagation();const c=a.classList.contains("is-open");document.querySelectorAll(".confidence-tooltip-wrap.is-open").forEach(v=>v.classList.remove("is-open")),c||a.classList.add("is-open")})}),document.addEventListener("click",()=>{document.querySelectorAll(".confidence-tooltip-wrap.is-open").forEach(a=>a.classList.remove("is-open"))}),hi(n),fi(n)}function hi(e){const i=document.getElementById("cashflow-chart");if(!i)return;const t=window.devicePixelRatio||1,n=i.offsetWidth||Math.min(window.innerWidth-32,500),s=280;i.width=n*t,i.height=s*t;const a=i.getContext("2d");a.scale(t,t);const l=e.cashflow,r=76,c=88,v=28,p=38,y=n-r-c,f=s-v-p,u=l.map(x=>x.cumulative),o=Math.min(...u),d=Math.max(...u),g=(d-o)*.1||Math.abs(o)*.1||1e5,E=o-g,A=d+g,w=A-E||1,M=x=>r+x/25*y,_=x=>v+(1-(x-E)/w)*f,b=_(0),m=l.map(x=>({x:M(x.year),y:_(x.cumulative),year:x.year,cumulative:x.cumulative})),k=m[m.length-1],S=x=>{const B=Math.abs(x),W=x<0?"-₦":"₦";return B>=1e6?`${W}${(B/1e6).toFixed(1)}M`:B>=1e3?`${W}${Math.round(B/1e3)}k`:`${W}${Math.round(B)}`},C=5,L=Array.from({length:C+1},(x,B)=>E+(A-E)*(B/C));a.save(),a.setLineDash([3,4]),a.strokeStyle="#F3F4F6",a.lineWidth=1,L.forEach(x=>{const B=_(x);B<v||B>v+f||(a.beginPath(),a.moveTo(r,B),a.lineTo(r+y,B),a.stroke())}),a.restore(),a.fillStyle="#9CA3AF",a.textAlign="right",a.font="10px Outfit, sans-serif",L.forEach(x=>{const B=_(x);B<v-4||B>v+f+4||a.fillText(S(x),r-7,B+3.5)}),a.strokeStyle="#E5E7EB",a.lineWidth=1,a.setLineDash([]),a.beginPath(),a.moveTo(r,v),a.lineTo(r,v+f),a.stroke();const h=Math.min(Math.max(b,v),v+f);h<v+f&&(a.save(),a.beginPath(),a.rect(r,h,y,v+f-h),a.clip(),a.beginPath(),a.moveTo(m[0].x,m[0].y),m.forEach(x=>a.lineTo(x.x,x.y)),a.lineTo(k.x,h),a.lineTo(m[0].x,h),a.closePath(),a.fillStyle="rgba(232,72,85,0.10)",a.fill(),a.restore()),h>v&&(a.save(),a.beginPath(),a.rect(r,v,y,h-v),a.clip(),a.beginPath(),a.moveTo(m[0].x,m[0].y),m.forEach(x=>a.lineTo(x.x,x.y)),a.lineTo(k.x,h),a.lineTo(m[0].x,h),a.closePath(),a.fillStyle="rgba(34,197,94,0.10)",a.fill(),a.restore()),b>=v&&b<=v+f&&(a.save(),a.setLineDash([6,4]),a.strokeStyle="#9CA3AF",a.lineWidth=1.5,a.beginPath(),a.moveTo(r,b),a.lineTo(r+y,b),a.stroke(),a.restore(),a.fillStyle="#9CA3AF",a.font="bold 10px Outfit, sans-serif",a.textAlign="left",a.fillText("Investment Line",r+y+5,b+4)),a.strokeStyle="#E5E7EB",a.lineWidth=1,a.setLineDash([]),a.beginPath(),a.moveTo(r,v+f),a.lineTo(r+y,v+f),a.stroke(),a.beginPath(),a.moveTo(m[0].x,m[0].y),m.forEach(x=>a.lineTo(x.x,x.y)),a.strokeStyle="#FCBF1E",a.lineWidth=2.5,a.lineJoin="round",a.setLineDash([]),a.stroke(),m.forEach(x=>{a.beginPath(),a.arc(x.x,x.y,2.5,0,Math.PI*2),a.fillStyle="#FCBF1E",a.fill()});const $=e.payback_exact,F=$!=null&&$<99&&$>=0;if(F){const x=M($),B=_(0);a.beginPath(),a.arc(x,B,7,0,Math.PI*2),a.fillStyle="#22C55E",a.fill(),a.strokeStyle="#fff",a.lineWidth=2,a.stroke()}if(F){const x=M($),B=_(0);a.fillStyle="#16A34A",a.font="bold 10px Outfit, sans-serif";const W=x+84>r+y;a.textAlign=W?"right":"center",a.fillText(`Payback: Year ${$}`,W?x-10:x,Math.max(v+14,B-14))}a.fillStyle="#6B7280",a.font="10px Outfit, sans-serif",a.textAlign="center",a.setLineDash([]),[0,3,5,10,15,20,25].forEach(x=>{const B=M(x);a.fillText(`Yr ${x}`,B,v+f+22),a.strokeStyle="#D1D5DB",a.lineWidth=1,a.beginPath(),a.moveTo(B,v+f),a.lineTo(B,v+f+5),a.stroke()}),a.fillStyle="#9CA3AF",a.font="10px Outfit, sans-serif",a.textAlign="center",a.fillText("Year",r+y/2,v+f+36);const T=document.getElementById("cashflow-tooltip");T&&(i.addEventListener("mousemove",x=>{const B=i.getBoundingClientRect(),W=x.clientX-B.left;let I=null,j=1/0;if(m.forEach(H=>{const J=Math.abs(H.x-W);J<j&&(j=J,I=H)}),I&&j<22){const H=I.cumulative>=0?"+":"";T.style.left=I.x+10+"px",T.style.top=Math.max(4,I.y-48)+"px",T.style.display="block";const J=I.year===10?`<div style="color:#FCA5A5;margin-top:3px">Battery replacement: -${ae(e.battery_replacement_cost)}</div>`:"";T.innerHTML=`<div>Year ${I.year}: ${H}${ae(I.cumulative)}</div>${J}`}else T.style.display="none"}),i.addEventListener("mouseleave",()=>{T.style.display="none"}))}function fi(e){var t;const i=(t=document.getElementById("compare-chart"))==null?void 0:t.getContext("2d");i&&new Chart(i,{type:"bar",data:{labels:[e.current_label||"Grid+Gen",e.solar_label||"Solar"],datasets:[{data:[e.current_monthly_cost,e.post_solar_monthly_cost],backgroundColor:["#E74C3C","#1B4F72"],borderRadius:6,barThickness:60}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:n=>`₦${Number(n.raw).toLocaleString()}`}}},scales:{x:{grid:{display:!1},title:{display:!0,text:"Monthly Cost Scenario",font:{size:11,family:"Outfit, sans-serif"}},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},suggestedMax:Math.max(e.current_monthly_cost,e.post_solar_monthly_cost)*1.4,ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:n=>`₦${(n/1e3).toFixed(0)}k`}}}},plugins:[{id:"barValueLabels",afterDatasetsDraw(n){const{ctx:s,data:a}=n,l=n.getDatasetMeta(0);s.save(),s.font="bold 11px Outfit, sans-serif",s.textAlign="center",s.textBaseline="bottom",l.data.forEach((r,c)=>{const v=a.datasets[0].data[c];s.fillStyle="#374151",s.fillText("₦"+Number(v).toLocaleString("en-NG"),r.x,r.y-4)}),s.restore()}}]})}function zt(e,i){var t,n;e.innerHTML=`
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
  `,(t=e.querySelector("#cta-installers-btn"))==null||t.addEventListener("click",()=>i("market")),(n=e.querySelector("#cta-adjust-btn"))==null||n.addEventListener("click",()=>i("step1"))}function bi(e){const i=document.getElementById("modal-root");i.innerHTML=`<div class="modal-overlay" id="modal-overlay">${e}</div>`,i.querySelector("#modal-overlay").addEventListener("click",t=>{t.target===t.currentTarget&&Le()}),document.addEventListener("keydown",Ht)}function Le(){const e=document.getElementById("modal-root");e.innerHTML="",document.removeEventListener("keydown",Ht)}function Ht(e){e.key==="Escape"&&Le()}function ki({title:e,subtitle:i="",body:t,footer:n}){return`
    <div class="modal">
      <div class="modal__header">
        <div>
          <div class="modal__title">${e}</div>
          ${i?`<div class="modal__subtitle">${i}</div>`:""}
        </div>
        <button class="modal__close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal__body">${t}</div>
      ${`<div class="modal__footer">${n}</div>`}
    </div>
  `}function xi(){var e;(e=document.getElementById("modal-close-btn"))==null||e.addEventListener("click",Le)}const At=["Work From Home","Office Worker","Night Shift","Stay-at-Home","Student","Weekend"],_i={Cooling:"#3B82F6",Lighting:"#FCBF1E",Kitchen:"#F59E0B",Entertainment:"#8B5CF6","ICT / Office":"#06B6D4",Laundry:"#10B981",Water:"#0EA5E9",Security:"#EF4444"};function wi(e,i){switch(i){case"Cooling":return/fan/i.test(e)?"Ceiling Fan":/\b1hp\b/i.test(e)?"AC – Bedroom":"AC – Living Room";case"Lighting":return"Lighting";case"Entertainment":return"Television";case"ICT / Office":return"Laptop / PC";case"Laundry":return/washing/i.test(e)?"Washing Machine":null;case"Kitchen":return/refrig|freezer/i.test(e)?"Refrigerator":/kettle/i.test(e)?"Electric Kettle":null;case"Water":return/pump/i.test(e)?"Water Pump":null;case"Security":return"Always On";default:return null}}function Si(e){const i=[];let t=!1,n=0;for(let s=0;s<24;s++)e[s]>=.5&&!t?(t=!0,n=s):e[s]<.5&&t&&(i.push({start:n,end:s}),t=!1);return t&&i.push({start:n,end:24}),i.length?i:[{start:8,end:10}]}function $t(e,i,t){if(!t)return[{start:8,end:10}];const n=wi(e,i),s=n&&t.schedule[n];return s?Si(s):[{start:8,end:10}]}function be(e){return Math.round(e*2)/2}function ue(e){const i=Math.floor(e)%24;return i===0?"12am":i<12?`${i}am`:i===12?"12pm":`${i-12}pm`}const P={active:!1,type:null,rowIdx:null,segIdx:null,startX:null,origStart:null,origEnd:null,trackWidth:null};function Ei(e,i){const t=document.getElementById(e);if(!t)return()=>{};const n=z("usage_patterns")||[];let s=R().usagePattern||At[0];const a=R().customSchedule||[],l=Object.fromEntries(a.map(o=>[o.name,o])),r=n.find(o=>o.pattern===s);let c=i.map(o=>l[o.name]?{...l[o.name],segments:l[o.name].segments.map(d=>({...d}))}:{name:o.name,category:o.category||"",segments:$t(o.name,o.category||"",r)});function v(){D({customSchedule:c.map(o=>({...o,segments:o.segments.map(d=>({...d}))}))})}function p(){const o=t.querySelector(".gantt-body");o&&(o.innerHTML=c.map((d,g)=>{const E=_i[d.category]||"#9CA3AF",A=d.segments.map((w,M)=>{const _=(w.start/24*100).toFixed(3),b=Math.max(.5,(w.end-w.start)/24*100).toFixed(3);return`
          <div class="gantt-bar" data-ri="${g}" data-si="${M}"
               style="left:${_}%;width:${b}%;background:${E}">
            <div class="gantt-bar__handle gantt-bar__handle--left" data-type="resize-left"></div>
            <div class="gantt-bar__label">${ue(w.start)}–${ue(w.end)}</div>
            <div class="gantt-bar__del" title="Remove">×</div>
            <div class="gantt-bar__handle gantt-bar__handle--right" data-type="resize-right"></div>
          </div>`}).join("");return`
        <div class="gantt-row">
          <div class="gantt-row__label" title="${d.name}">${d.name}</div>
          <div class="gantt-row__track" data-ri="${g}" style="background:${E}22">${A}</div>
        </div>`}).join(""),y())}function y(){t.querySelectorAll(".gantt-bar__del").forEach(o=>{o.addEventListener("click",d=>{d.stopPropagation();const g=o.closest(".gantt-bar");c[+g.dataset.ri].segments.splice(+g.dataset.si,1),v(),p()})}),t.querySelectorAll(".gantt-bar").forEach(o=>{o.addEventListener("contextmenu",d=>{d.preventDefault(),c[+o.dataset.ri].segments.splice(+o.dataset.si,1),v(),p()}),o.addEventListener("mousedown",d=>{if(d.target.classList.contains("gantt-bar__handle")||d.target.classList.contains("gantt-bar__del"))return;d.preventDefault();const g=+o.dataset.ri,E=+o.dataset.si;P.active=!0,P.type="move",P.rowIdx=g,P.segIdx=E,P.startX=d.clientX,P.origStart=c[g].segments[E].start,P.origEnd=c[g].segments[E].end,P.trackWidth=o.closest(".gantt-row__track").getBoundingClientRect().width})}),t.querySelectorAll(".gantt-bar__handle").forEach(o=>{o.addEventListener("mousedown",d=>{d.preventDefault(),d.stopPropagation();const g=o.closest(".gantt-bar"),E=+g.dataset.ri,A=+g.dataset.si;P.active=!0,P.type=o.dataset.type,P.rowIdx=E,P.segIdx=A,P.startX=d.clientX,P.origStart=c[E].segments[A].start,P.origEnd=c[E].segments[A].end,P.trackWidth=g.closest(".gantt-row__track").getBoundingClientRect().width})}),t.querySelectorAll(".gantt-row__track").forEach(o=>{o.addEventListener("dblclick",d=>{if(d.target!==o)return;const g=+o.dataset.ri,E=o.getBoundingClientRect(),A=be((d.clientX-E.left)/E.width*24),w=Math.max(0,Math.min(22,A));c[g].segments.push({start:w,end:Math.min(24,w+2)}),v(),p()})})}function f(o){if(!P.active)return;const d=(o.clientX-P.startX)/P.trackWidth*24,{type:g,rowIdx:E,segIdx:A}=P,w=c[E].segments[A],M=P.origEnd-P.origStart;if(g==="move"){const b=Math.max(0,Math.min(24-M,be(P.origStart+d)));w.start=b,w.end=b+M}else g==="resize-left"?w.start=Math.max(0,Math.min(P.origEnd-.5,be(P.origStart+d))):w.end=Math.min(24,Math.max(P.origStart+.5,be(P.origEnd+d)));const _=t.querySelector(`.gantt-bar[data-ri="${E}"][data-si="${A}"]`);if(_){_.style.left=`${(w.start/24*100).toFixed(3)}%`,_.style.width=`${Math.max(.5,(w.end-w.start)/24*100).toFixed(3)}%`;const b=_.querySelector(".gantt-bar__label");b&&(b.textContent=`${ue(w.start)}–${ue(w.end)}`)}}function u(){P.active&&(P.active=!1,v())}return document.addEventListener("mousemove",f),document.addEventListener("mouseup",u),t.innerHTML=`
    <div class="gantt-wrap">
      <div class="gantt-header">
        <div class="section-title" style="margin:0">Customise Your Usage Schedule</div>
        <div class="gantt-pattern-row">
          <label class="gantt-pattern-label">Usage pattern</label>
          <select class="gantt-select" id="gantt-pattern-sel">
            ${At.map(o=>`<option value="${o}" ${s===o?"selected":""}>${o}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="gantt-timeline-header">
        <div class="gantt-label-col"></div>
        <div class="gantt-hours-track">
          ${[0,3,6,9,12,15,18,21,24].map(o=>`<span class="gantt-hour-label" style="left:${(o/24*100).toFixed(2)}%">${ue(o)}</span>`).join("")}
        </div>
      </div>
      <div class="gantt-body"></div>
      <p class="gantt-hint">Drag bars to move · Drag edges to resize · Click empty track to add · Right-click or × to delete</p>
    </div>`,document.getElementById("gantt-pattern-sel").addEventListener("change",o=>{s=o.target.value,D({usagePattern:s});const d=n.find(g=>g.pattern===s);c=c.map(g=>({...g,segments:$t(g.name,g.category,d)})),v(),p()}),p(),v(),function(){document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",u)}}const Ne=e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;");function Kt(e){return{Cooling:"❄️",Lighting:"💡",Kitchen:"🍳",Entertainment:"📺","ICT / Office":"💻",Laundry:"🫧",Water:"💧",Security:"🔒"}[e]||"🔌"}function Ai(e,i){const t={};i.forEach(s=>{t[s.name]=s});const n=e.map(s=>{const a=t[s.name],l=a?a.qty:0;return`
      <div class="appliance-modal-row">
        <div class="checkbox ${a?"checked":""}" data-name="${Ne(s.name)}"></div>
        <div class="appliance-modal-row__img-placeholder">${Kt(s.category)}</div>
        <div style="flex:1">
          <div class="appliance-modal-row__name">${s.name}</div>
          <div class="appliance-modal-row__watts">${s.rated_watts}W · ${s.typical_daily_hours}h/day</div>
        </div>
        <div class="counter" data-name="${Ne(s.name)}">
          <button class="counter__btn" data-action="dec">−</button>
          <span class="counter__val">${l}</span>
          <button class="counter__btn" data-action="inc">+</button>
        </div>
      </div>
    `}).join("");return ki({title:"Choose specific appliances",subtitle:"You can select multiple appliances",body:n,footer:'<button class="btn btn--primary btn--full" id="add-appliances-confirm">Add Appliances</button>'})}const $i=`
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
`,Li={bungalow:9,duplex:14,terrace:20},Lt={"9W":2,"15W":1};function Ci(e,i,t){const n=(t[e]||[]).filter(a=>!a.name.startsWith("LED Bulb")),s=i&&i>0?i:Li[e]||9;return[...n,{name:"LED Bulb (9W)",qty:s*Lt["9W"]},{name:"LED Bulb (15W)",qty:s*Lt["15W"]}]}function Mi(e,i){const t=z("appliances")||[],n=z("house_type_appliances")||{};let s=null;const a=[{id:"bungalow",emoji:'<img src="/icons/bungalow.png" width="72" height="72" style="object-fit:contain">',name:"Bungalow"},{id:"duplex",emoji:'<img src="/icons/duplex_home_type.png" width="72" height="72" style="object-fit:contain">',name:"Duplex"},{id:"terrace",emoji:'<img src="/icons/terrace_house_type.png" width="72" height="72" style="object-fit:contain">',name:"Terrace House"}];function l(){s&&(s(),s=null);const o=R();e.innerHTML=`
      <div style="display:flex;flex-direction:column;min-height:100%">
      <div id="add-appliances-content" style="flex:1;padding:40px 40px 32px">
        <div style="margin-bottom:32px">
          <h2 style="font-size:32px;font-weight:800;margin-bottom:4px">Home Profile &amp; Appliances</h2>
          <p style="color:var(--color-text-secondary);font-size:16px">Add your appliances to sharpen your solar recommendation</p>
        </div>

        <div class="section-title" style="margin-bottom:14px">Choose your house type</div>
        <div class="radio-cards" id="house-type-cards">
          ${a.map(d=>`
            <div class="radio-card ${o.houseType===d.id?"selected":""}" data-value="${d.id}" style="align-items:center">
              <div class="radio-card__radio"></div>
              <div class="radio-card__img-placeholder">${d.emoji}</div>
              <div class="radio-card__name">${d.name}</div>
              ${o.houseType===d.id?`
                <div class="rooms-counter">
                  <span class="rooms-counter__label">Rooms</span>
                  <button class="rooms-counter__btn" id="rooms-dec">–</button>
                  <span class="rooms-counter__val" id="rooms-val">${o.rooms}</span>
                  <button class="rooms-counter__btn" id="rooms-inc">+</button>
                </div>
              `:""}
            </div>
          `).join("")}
        </div>

        <div class="section-title" style="margin-top:28px;margin-bottom:12px">Select your home appliances</div>
        <div class="appliances-list" id="appliances-list">
          ${o.appliances.map(d=>`
            <div class="appliance-chip">
              ${Kt(d.category||"")} ${d.name} ×${d.qty}
              <span class="appliance-chip__remove" data-name="${Ne(d.name)}">×</span>
            </div>
          `).join("")}
        </div>
        <div class="add-appliances-box" id="add-appliances-btn">
          <span class="add-appliances-box__icon">＋</span>
          <span class="add-appliances-box__label">Add appliances</span>
        </div>

        ${o.appliances.length>0?'<div id="gantt-section" style="margin-top:32px"></div>':""}
      </div>
      <div class="step-footer" style="padding-left:40px;padding-right:40px">
        <button class="btn btn--primary btn--lg" id="done-btn">Update Results →</button>
      </div>
      </div>
    `,r(),o.appliances.length>0&&(s=Ei("gantt-section",o.appliances))}function r(){var o,d;document.getElementById("done-btn").addEventListener("click",()=>{s&&(s(),s=null),$e(),i("solarPVSystem")}),document.querySelectorAll("#house-type-cards .radio-card").forEach(g=>{g.addEventListener("click",E=>{E.target.closest(".rooms-counter")||(D({houseType:g.dataset.value}),l())})}),(o=document.getElementById("rooms-dec"))==null||o.addEventListener("click",()=>{D({rooms:Math.max(0,R().rooms-1)}),document.getElementById("rooms-val").textContent=R().rooms}),(d=document.getElementById("rooms-inc"))==null||d.addEventListener("click",()=>{D({rooms:R().rooms+1}),document.getElementById("rooms-val").textContent=R().rooms}),document.querySelectorAll(".appliance-chip__remove").forEach(g=>{g.addEventListener("click",E=>{E.stopPropagation(),D({appliances:R().appliances.filter(A=>A.name!==g.dataset.name)}),l()})}),document.getElementById("add-appliances-btn").addEventListener("click",()=>{const g=R(),E=g.houseType&&g.appliances.length===0?Ci(g.houseType,g.rooms,n):g.appliances;bi(Ai(t,E)),xi(),c(t,E)})}function c(o,d){const g={};(d||R().appliances).forEach(A=>{const w=o.find(M=>M.name===A.name);g[A.name]=w?{...w,qty:A.qty||1}:{...A}}),document.querySelectorAll(".appliance-modal-row").forEach(A=>{const w=A.querySelector(".checkbox"),M=A.querySelector(".counter"),_=w.dataset.name,b=o.find(m=>m.name===_);!g[_]&&w.classList.contains("checked")&&(g[_]={...b,qty:1}),w.addEventListener("click",()=>{w.classList.toggle("checked"),w.classList.contains("checked")?(g[_]={...b,qty:parseInt(M.querySelector(".counter__val").textContent)||1},M.querySelector(".counter__val").textContent=g[_].qty):delete g[_]}),M.querySelectorAll(".counter__btn").forEach(m=>{m.addEventListener("click",()=>{const k=M.querySelector(".counter__val");let S=parseInt(k.textContent)||0;m.dataset.action==="inc"?(S++,w.classList.add("checked")):(S=Math.max(0,S-1),S===0&&w.classList.remove("checked")),k.textContent=S,S>0?g[_]={...b,qty:S}:delete g[_]})})}),document.getElementById("add-appliances-confirm").addEventListener("click",()=>{const A=Object.values(g).filter(M=>M.qty>0),w=new Set(A.map(M=>M.name));D({appliances:A,customSchedule:R().customSchedule?R().customSchedule.filter(M=>w.has(M.name)):null}),Le(),l()})}const v=document.createElement("div");v.innerHTML=$i,document.body.appendChild(v.firstElementChild);const p=document.getElementById("why-appliances-overlay");let f=(R().appliances||[]).length>0?null:setTimeout(()=>{p&&p.classList.add("assumptions-overlay--visible")},2e3);function u(){p&&p.remove(),clearTimeout(f)}setTimeout(()=>{var o,d;(o=document.getElementById("why-close-btn"))==null||o.addEventListener("click",u),(d=document.getElementById("why-cta-btn"))==null||d.addEventListener("click",u),p==null||p.addEventListener("click",g=>{g.target===p&&u()})},0),l()}const Ce=[{id:"auxano",name:"Auxano Solar",init:"AX",district:"Garki",distance:4.6,rating:4.8,reviews:134,price:462e4,warranty:"5 years",warrantyScore:9,timeline:"7–10 days",speedScore:9,badge:"Best value",badgeKind:"value",mapX:56,mapY:66,jobs:"320+",years:8,repeat:"41%",response:"~2 hrs",tags:["Grid-tie & hybrid","Lithium battery","Post-install support"],panel:"Jinko 400W Mono PERC ×18",battery:"BYD LithiumFerro 10kWh",inverter:"Deye 8kVA Hybrid",aftercare:"12-month free maintenance",financing:"Available via partner banks",about:"Auxano Solar has been delivering reliable solar installations across Abuja since 2016. Specialising in residential and light-commercial hybrid systems, they hold a strong track record with over 320 completed projects. Their in-house engineering team handles everything from load assessment to commissioning, and their after-sales desk averages a 2-hour response time.",reviews_l:[{name:"Emeka O.",area:"Gwarinpa",date:"Mar 2024",stars:5,text:"Auxano installed our 8kVA system in just 9 days. The team was professional, clean, and the inverter has been running flawlessly for 6 months."},{name:"Aisha M.",area:"Garki II",date:"Jan 2024",stars:5,text:"Best solar experience I've had. They explained every component and the after-sales support is genuinely responsive. Highly recommend."},{name:"Chukwudi N.",area:"Maitama",date:"Nov 2023",stars:4,text:"Great installation quality. Took 10 days which was within their estimate. Would have given 5 stars but the initial quote took a while to arrive."}]},{id:"gve",name:"GVE Projects",init:"GV",district:"Jabi",distance:5.2,rating:4.6,reviews:88,price:44e5,warranty:"3 years",warrantyScore:6,timeline:"10–14 days",speedScore:6,badge:"Cheapest",badgeKind:"cheap",mapX:30,mapY:60,jobs:"210+",years:6,repeat:"33%",response:"~4 hrs",tags:["Budget-friendly","Grid-tie systems","Commercial experience"],panel:"Canadian Solar 380W Poly ×19",battery:"Felicity Lithium 9.6kWh",inverter:"Growatt 6kVA Hybrid",aftercare:"6-month free maintenance",financing:"Limited options",about:"GVE Projects is a well-established solar and renewable energy firm with offices in Abuja and Lagos. Known for cost-effective residential systems, they offer competitive pricing without compromising on safety standards. Their NABCEP-certified technicians serve both residential and small commercial clients across the FCT.",reviews_l:[{name:"Fatima B.",area:"Jabi",date:"Feb 2024",stars:5,text:"GVE gave us the best price of any installer we spoke to. Installation took 12 days but everything works perfectly."},{name:"Seun A.",area:"Kado Estate",date:"Dec 2023",stars:4,text:"Good value for money. The crew was friendly and explained the monitoring app clearly. A few small finishing touches were missed but rectified quickly."},{name:"Ngozi I.",area:"Wuse",date:"Oct 2023",stars:5,text:"Surprised by how smooth the process was. Quote arrived same day and installation was clean. Would use them again."}]},{id:"arnergy",name:"Arnergy Solar",init:"AR",district:"Maitama",distance:2.4,rating:4.9,reviews:212,price:485e4,warranty:"5 years",warrantyScore:9,timeline:"5–7 days",speedScore:10,badge:"Most trusted",badgeKind:"trust",mapX:58,mapY:34,jobs:"580+",years:11,repeat:"52%",response:"~1 hr",tags:["Premium installs","Real-time monitoring","Longest track record"],panel:"Arnergy 400W Mono PERC ×18",battery:"Arnergy Lithium 12kWh",inverter:"SMA Sunny Boy 8kVA",aftercare:"24-month premium care",financing:"In-house financing available",about:"Arnergy Solar is one of Nigeria's most recognised solar brands, with over a decade of experience and 580+ installations nationwide. Their proprietary monitoring platform gives homeowners real-time visibility into generation, consumption, and battery state. Arnergy operates a full in-house team — engineers to customer success — and offers the fastest installation timeline in Abuja.",reviews_l:[{name:"Dr. Bello T.",area:"Maitama",date:"Apr 2024",stars:5,text:"Arnergy is in a class of its own. The monitoring app is outstanding and their engineer called me personally to walk through the system. Worth every naira."},{name:"Chioma E.",area:"Asokoro",date:"Mar 2024",stars:5,text:"Installed in 6 days, just as promised. The system has cut my NEPA spend by over 80%. The 2-year maintenance plan gives real peace of mind."},{name:"Alhaji K.",area:"Wuse 2",date:"Jan 2024",stars:5,text:"Third solar system I've had installed across different properties and Arnergy was by far the most professional. Seamless from survey to switch-on."}]},{id:"sosai",name:"Sosai Renewable",init:"SO",district:"Utako",distance:4,rating:4.8,reviews:110,price:498e4,warranty:"5 years",warrantyScore:8,timeline:"8–11 days",speedScore:7,badge:"",badgeKind:"",mapX:68,mapY:54,jobs:"280+",years:9,repeat:"44%",response:"~3 hrs",tags:["Northern Nigeria specialist","Off-grid capable","Community projects"],panel:"Longi 405W Mono PERC ×18",battery:"Pylon Tech US3000 10kWh",inverter:"Victron MultiPlus 8kVA",aftercare:"12-month maintenance included",financing:"Available via partner banks",about:"Sosai Renewable Energies has built a reputation as Northern Nigeria's go-to solar integrator, with deep expertise in off-grid and hybrid systems suited to the region's climate. Their Abuja office handles FCT residential projects with the same rigour applied to their large rural electrification contracts. Strong on community trust and long-term reliability.",reviews_l:[{name:"Musa Y.",area:"Utako",date:"Mar 2024",stars:5,text:"Sosai understood exactly what a northern household needs. Sized the system for our AC load perfectly. The off-grid capability has been a lifesaver."},{name:"Hadiza A.",area:"Gwarinpa",date:"Feb 2024",stars:5,text:"Very thorough site survey and load analysis. They took time to explain our options and didn't oversell. System installed on schedule."},{name:"Ibrahim D.",area:"Life Camp",date:"Dec 2023",stars:4,text:"Solid installation and great battery choice. Response time was around 3 hours which is acceptable. Happy with the overall outcome."}]},{id:"bluecamel",name:"Blue Camel Energy",init:"BC",district:"Wuse 2",distance:3.1,rating:4.7,reviews:168,price:51e5,warranty:"4 years",warrantyScore:7,timeline:"6–9 days",speedScore:8,badge:"",badgeKind:"",mapX:40,mapY:40,jobs:"390+",years:10,repeat:"38%",response:"~2 hrs",tags:["Smart home integration","EV charging ready","App monitoring"],panel:"JA Solar 400W Bifacial ×18",battery:"BSLBATT 10kWh Lithium",inverter:"Huawei SUN2000 8kVA",aftercare:"18-month smart monitoring",financing:"Available via partner banks",about:"Blue Camel Energy brings a tech-forward approach to solar installations in Abuja. Known for seamless smart home integration and EV charging readiness, they appeal to progressive homeowners who want more than just power backup. Their Huawei-certified engineers and bifacial panel installations consistently yield higher generation than quoted estimates.",reviews_l:[{name:"Tunde F.",area:"Wuse 2",date:"Apr 2024",stars:5,text:"Blue Camel integrated our solar with our smart home setup flawlessly. The Huawei app shows me every kWh in real time. Superb work."},{name:"Adaeze M.",area:"Maitama",date:"Feb 2024",stars:5,text:"They set up EV charging alongside the solar system. Installation was clean and finished in 8 days. Very impressed with the tech expertise."},{name:"Rotimi P.",area:"Wuse 2",date:"Jan 2024",stars:4,text:"Great system, great monitoring. Price was higher than others but the bifacial panels are genuinely producing more than expected. Worth it."}]},{id:"rubitec",name:"Rubitec Solar",init:"RB",district:"Gwarinpa",distance:6.8,rating:4.9,reviews:96,price:545e4,warranty:"7 years",warrantyScore:10,timeline:"9–12 days",speedScore:6,badge:"Premium",badgeKind:"premium",mapX:24,mapY:22,jobs:"175+",years:7,repeat:"61%",response:"~1.5 hrs",tags:["7-year warranty","Premium components","Highest repeat rate"],panel:"SunPower 430W Maxeon ×17",battery:"Tesla Powerwall 13.5kWh",inverter:"SolarEdge SE8000H 8kVA",aftercare:"36-month premium care plan",financing:"Premium finance packages",about:"Rubitec Solar positions itself at the premium end of the Abuja market, using only tier-1 components from SunPower, Tesla, and SolarEdge. Their 7-year warranty is the longest offered by any installer in this comparison, and their 61% repeat-customer rate speaks to the quality of their long-term service relationship. Ideal for homeowners who want the best without compromise.",reviews_l:[{name:"Senator O.",area:"Gwarinpa Estate",date:"Mar 2024",stars:5,text:"Rubitec fitted a Tesla Powerwall system that simply works. No drama, no comebacks. The 7-year warranty sealed it for me. Premium price, premium product."},{name:"Mrs. Adeyemi",area:"Lifecamp",date:"Jan 2024",stars:5,text:"The SunPower panels are visibly better quality than what I've seen on neighbours' roofs. Rubitec's team are courteous and highly skilled."},{name:"Engr. Lawal",area:"Gwarinpa",date:"Nov 2023",stars:5,text:"Third time using Rubitec across different properties. Consistently excellent. The SolarEdge optimizer setup gives impressive per-panel data."}]}];function Me(e){const i=e.map(s=>s.price),t=Math.min(...i),n=Math.max(...i);return e.map(s=>{const a=10*(1-(s.price-t)/(n-t)),l=(s.rating-4.5)/.5*10,r=a*4+s.warrantyScore*3+s.speedScore*1.5+l*1.5;return{...s,score:Math.round(r)}})}const G=e=>"₦"+Math.round(e).toLocaleString("en-NG"),Fi=e=>"₦"+(e/1e6).toFixed(2)+"M";function Ti(e){e.width=1500,e.height=1500;const t=e.getContext("2d");let n=20260626;const s=()=>(n=n*1664525+1013904223>>>0)/4294967296,a=(m,k)=>m+(k-m)*s(),l="#E8E1D1",r="#F1EFE9",c="#C7DCA8",v="#A9C9E3",p="#FAF8F3",y="#E6E3D9",f="#FFFFFF",u="#CED7DE",o="#F4E4A0",d="#E1C775";function g(m,k,S,C,L){const h=Array.from({length:L},($,F)=>{const T=F/L*Math.PI*2,x=S*(1-C+s()*C*2);return[m+Math.cos(T)*x,k+Math.sin(T)*x]});t.beginPath();for(let $=0;$<=L;$++){const F=h[$%L],T=h[($+1)%L],x=[(F[0]+T[0])/2,(F[1]+T[1])/2];$===0?t.moveTo(x[0],x[1]):t.quadraticCurveTo(F[0],F[1],x[0],x[1])}t.closePath()}function E(m){t.beginPath(),t.moveTo(m[0][0],m[0][1]);for(let k=1;k<m.length;k++){const S=[(m[k-1][0]+m[k][0])/2,(m[k-1][1]+m[k][1])/2];t.quadraticCurveTo(m[k-1][0],m[k-1][1],S[0],S[1])}t.lineTo(m.at(-1)[0],m.at(-1)[1])}function A(m,k,S,C,L){t.beginPath();for(let $=0;$<=6;$++){const F=$/6;let T=m+(S-m)*F,x=k+(C-k)*F;const B=-(C-k),W=S-m,I=Math.hypot(B,W)||1,j=(s()-.5)*L;T+=B/I*j,x+=W/I*j,$===0?t.moveTo(T,x):t.lineTo(T,x)}}function w(m,k,S){const C=a(0,Math.PI),L=a(36,60),h=a(42,72),$=a(2,7);t.save(),g(m,k,S,.45,10),t.clip(),t.fillStyle=r,t.fillRect(m-S-50,k-S-50,(S+50)*2,(S+50)*2),t.translate(m,k),t.rotate(C);const F=S+80;t.lineCap="round";for(let T=0;T<2;T++){t.strokeStyle=T===0?y:p,t.lineWidth=T===0?4.5:2.6;for(let x=-F;x<=F;x+=L)A(x,-F,x+a(-12,12),F,$),t.stroke();for(let x=-F;x<=F;x+=h)A(-F,x,F,x+a(-12,12),$),t.stroke()}t.restore()}function M(m,k){E(m),t.strokeStyle=u,t.lineWidth=k+5,t.stroke(),E(m),t.strokeStyle=f,t.lineWidth=k,t.stroke()}t.fillStyle=l,t.fillRect(0,0,1500,1500),t.save(),g(180,160,280,.5,10),t.fillStyle=l,t.fill(),t.restore(),[[1050,360,300],[1080,760,340],[1180,1120,300],[760,560,250],[640,980,260],[420,1180,240],[260,560,260],[180,920,230],[980,1240,220],[1300,560,200]].forEach(([m,k,S])=>w(m,k,S)),t.lineCap="round",[[1320,980,150],[560,300,120],[360,1320,160],[1180,180,130]].forEach(([m,k,S])=>{t.save(),g(m,k,S,.4,9),t.fillStyle=c,t.fill(),t.restore()});const _=[[-40,260],[260,420],[520,700],[600,1e3],[520,1320],[560,1560]];t.lineCap="round",E(_),t.strokeStyle="#9DC0DD",t.lineWidth=30,t.stroke(),E(_),t.strokeStyle=v,t.lineWidth=24,t.stroke(),M([[760,-40],[820,260],[900,560],[1040,900],[1140,1240],[1200,1560]],11),M([[1560,360],[1180,520],[820,640],[460,720],[-40,760]],10),M([[1560,1080],[1180,980],[820,1020],[440,1140],[-40,1180]],9),M([[300,-40],[360,360],[300,760],[420,1160],[360,1560]],8),M([[-40,1380],[400,1300],[820,1360],[1240,1300],[1560,1360]],8);const b=[[-90,700],[280,540],[700,360],[1120,200],[1600,30]];E(b),t.strokeStyle=d,t.lineWidth=34,t.stroke(),E(b),t.strokeStyle=o,t.lineWidth=27,t.stroke(),E(b),t.strokeStyle=d,t.lineWidth=2.5,t.setLineDash([16,18]),t.stroke(),t.setLineDash([])}const Bi={chip:"Lagos · ~8km radius",labels:["Lekki","Ikeja","Victoria Island","Surulere","Yaba","Ajah","Festac","Magodo"],installerAreas:{auxano:"Lekki",gve:"Ikeja",arnergy:"Victoria Island",sosai:"Surulere",bluecamel:"Yaba",rubitec:"Ajah"}},Ri={chip:"Kano · ~8km radius",labels:["Nassarawa","Fagge","Gwale","Tarauni","Kumbotso","Ungogo","Dala","Giginyu"],installerAreas:{auxano:"Nassarawa",gve:"Fagge",arnergy:"Gwale",sosai:"Tarauni",bluecamel:"Ungogo",rubitec:"Dala"}},Wi={chip:"Maiduguri · ~8km radius",labels:["Maisandari","Gwange","Bolori","Jere","Kawuri","Lamisula","Gamboru","Kula"],installerAreas:{auxano:"Maisandari",gve:"Gwange",arnergy:"Bolori",sosai:"Jere",bluecamel:"Lamisula",rubitec:"Gamboru"}},Ii={chip:"Enugu · ~8km radius",labels:["GRA","Asata","Achara Layout","Trans-Ekulu","Independence Layout","New Haven","Uwani","Maryland"],installerAreas:{auxano:"Trans-Ekulu",gve:"Asata",arnergy:"GRA",sosai:"Independence Layout",bluecamel:"New Haven",rubitec:"Achara Layout"}},Pi={chip:"Ibadan · ~8km radius",labels:["Bodija","Jericho","Iyaganku","Ring Road","Agodi","Mokola","Sango","Challenge"],installerAreas:{auxano:"Bodija",gve:"Ring Road",arnergy:"Jericho",sosai:"Agodi",bluecamel:"Iyaganku",rubitec:"Mokola"}},qi={chip:"Kaduna · ~8km radius",labels:["Malali","Barnawa","Rigachikun","Narayi","Kawo","Ungwan Rimi","Gonin Gora","Television"],installerAreas:{auxano:"Barnawa",gve:"Narayi",arnergy:"Malali",sosai:"Rigachikun",bluecamel:"Kawo",rubitec:"Ungwan Rimi"}},Oi={chip:"Sokoto · ~8km radius",labels:["Arkilla","Runjin Sambo","Gagi","Sama Road","New Extension","Mabera","Kware","Kwannawa"],installerAreas:{auxano:"Sama Road",gve:"Gagi",arnergy:"Arkilla",sosai:"Mabera",bluecamel:"New Extension",rubitec:"Runjin Sambo"}},Gi={chip:"Jos · ~8km radius",labels:["Rayfield","Tudun Wada","Anglo-Jos","Naraguta","Angwan Rogo","Bukuru","Bauchi Road","Vom"],installerAreas:{auxano:"Tudun Wada",gve:"Naraguta",arnergy:"Rayfield",sosai:"Angwan Rogo",bluecamel:"Anglo-Jos",rubitec:"Bukuru"}},Di={chip:"Asaba · ~8km radius",labels:["GRA","Cable Point","Okpanam","Ezenei","Ogbeogonogo","West End","Okwe","Umuagu"],installerAreas:{auxano:"Cable Point",gve:"Ogbeogonogo",arnergy:"GRA",sosai:"Okpanam",bluecamel:"Ezenei",rubitec:"West End"}},ji={chip:"Owerri · ~8km radius",labels:["Aladinma","New Owerri","Ikenegbu","Ikoku","Orji","Nekede","Egbu","World Bank"],installerAreas:{auxano:"Aladinma",gve:"Ikoku",arnergy:"New Owerri",sosai:"Ikenegbu",bluecamel:"World Bank",rubitec:"Egbu"}},Ni={chip:"Calabar · ~8km radius",labels:["Calabar South","Ikot Nakanda","State Housing","Diamond Hill","Bogobiri","Big Qua Town","Watt Market","Federal Housing"],installerAreas:{auxano:"State Housing",gve:"Calabar South",arnergy:"Diamond Hill",sosai:"Ikot Nakanda",bluecamel:"Big Qua Town",rubitec:"Federal Housing"}},zi={chip:"Uyo · ~8km radius",labels:["Ikot Ekpene Rd","Ewet Housing","GRA","Udo Udoma","Ika","Wellington Bassey","Itam","Ewet"],installerAreas:{auxano:"Ewet Housing",gve:"Ikot Ekpene Rd",arnergy:"GRA",sosai:"Udo Udoma",bluecamel:"Wellington Bassey",rubitec:"Itam"}},Hi={chip:"Abeokuta · ~8km radius",labels:["Kuto","Panseke","Ibara","Lafenwa","Oke-Ilewo","Elega","Sapon","Adatan"],installerAreas:{auxano:"Ibara",gve:"Panseke",arnergy:"Kuto",sosai:"Lafenwa",bluecamel:"Oke-Ilewo",rubitec:"Elega"}},Ki={chip:"Akure · ~8km radius",labels:["Alagbaka","Fanibi","Oke-Aro","State Housing","Owo Road","Ijoka","Oda Road","Irese"],installerAreas:{auxano:"Alagbaka",gve:"Oke-Aro",arnergy:"State Housing",sosai:"Fanibi",bluecamel:"Owo Road",rubitec:"Ijoka"}},Yi={chip:"Bauchi · ~8km radius",labels:["Wunti","Kandahar","Gwallameji","Yelwa","Hardo Road","Salihu","Clock Rd","Fadama"],installerAreas:{auxano:"Yelwa",gve:"Gwallameji",arnergy:"Wunti",sosai:"Hardo Road",bluecamel:"Kandahar",rubitec:"Fadama"}},Vi={chip:"Gombe · ~8km radius",labels:["Tudun Wada","Pantami","New Gombe","Jekadafari","Dadinkowa","Deba","Yamaltu","Billiri"],installerAreas:{auxano:"New Gombe",gve:"Tudun Wada",arnergy:"Pantami",sosai:"Jekadafari",bluecamel:"Dadinkowa",rubitec:"Deba"}},Ui={chip:"Ilorin · ~8km radius",labels:["GRA","Tanke","Adewole","Mandate","Agba Dam","Maraba","Fate","Asa Dam"],installerAreas:{auxano:"Mandate",gve:"Adewole",arnergy:"GRA",sosai:"Tanke",bluecamel:"Fate",rubitec:"Asa Dam"}},Ji={chip:"Lokoja · ~8km radius",labels:["Ganaja","Cable Point","GRA","Otokiti","Felele","New Layout","Crusher","Adankolo"],installerAreas:{auxano:"Ganaja",gve:"Felele",arnergy:"GRA",sosai:"Otokiti",bluecamel:"New Layout",rubitec:"Cable Point"}},Xi={chip:"Makurdi · ~8km radius",labels:["North Bank","High Level","Modern Market","Wadata","Ankpa","Shendok","George","Wurukum"],installerAreas:{auxano:"High Level",gve:"North Bank",arnergy:"Modern Market",sosai:"Wadata",bluecamel:"Wurukum",rubitec:"George"}},Zi={chip:"Minna · ~8km radius",labels:["Maikunkele","Tunga","Chanchaga","Bosso","Maitumbi","Dutsen Kura","Shiroro","GRA"],installerAreas:{auxano:"Tunga",gve:"Chanchaga",arnergy:"GRA",sosai:"Bosso",bluecamel:"Maikunkele",rubitec:"Maitumbi"}},Qi={chip:"Umuahia · ~8km radius",labels:["Govt House","State Housing","Ubakala","Umuopara","Ikwuano","Ohafia Road","Amaudara","Hospital Road"],installerAreas:{auxano:"State Housing",gve:"Ubakala",arnergy:"Govt House",sosai:"Umuopara",bluecamel:"Ohafia Road",rubitec:"Amaudara"}},es={chip:"Yola · ~8km radius",labels:["Jimeta","Karewa","Demsawo","Doubeli","Jambutu","Gwadabawa","Farakwa","Rumde"],installerAreas:{auxano:"Jimeta",gve:"Doubeli",arnergy:"Karewa",sosai:"Demsawo",bluecamel:"Jambutu",rubitec:"Farakwa"}},ts={chip:"Gusau (Zamfara) · ~8km radius",labels:["Tudun Wada","Bunsawa","Kaura","Samaru","Maru Road","Sokoto Road","Rijiyar Zaki","Tsafe"],installerAreas:{auxano:"Samaru",gve:"Kaura",arnergy:"Tudun Wada",sosai:"Maru Road",bluecamel:"Bunsawa",rubitec:"Rijiyar Zaki"}},as={chip:"Lafia · ~8km radius",labels:["Shabu","New Layout","Makama","Tudun Gwandara","Old Market","Makurdi Road","Agwada","Karu"],installerAreas:{auxano:"New Layout",gve:"Shabu",arnergy:"Makama",sosai:"Tudun Gwandara",bluecamel:"Makurdi Road",rubitec:"Agwada"}},is={chip:"Dutse · ~8km radius",labels:["GRA","Takur","Kazaure Road","Kafin Hausa","Jahun","Dabi","Kiyawa","Birnin Kudu"],installerAreas:{auxano:"Takur",gve:"Kazaure Road",arnergy:"GRA",sosai:"Kafin Hausa",bluecamel:"Jahun",rubitec:"Dabi"}},ss={chip:"Damaturu · ~8km radius",labels:["GRA","Potiskum Road","NNPC Estate","Gwange","Jumba","Ngelzarma","Gujba Road","Tarmuwa"],installerAreas:{auxano:"Gwange",gve:"Potiskum Road",arnergy:"GRA",sosai:"Ngelzarma",bluecamel:"NNPC Estate",rubitec:"Jumba"}},ns={chip:"Jalingo · ~8km radius",labels:["GRA","Lau Road","Suntai","Bali Road","Kona","Mayo-Selbe","Jalingo Central","Zing"],installerAreas:{auxano:"Jalingo Central",gve:"Lau Road",arnergy:"GRA",sosai:"Bali Road",bluecamel:"Suntai",rubitec:"Kona"}},os={chip:"Abakaliki · ~8km radius",labels:["Housing Estate","Mile 50","Azungwu","Kpirikpiri","Ogoja Road","Nkaliki","Salt Lake Road","Ogui"],installerAreas:{auxano:"Mile 50",gve:"Kpirikpiri",arnergy:"Housing Estate",sosai:"Ogoja Road",bluecamel:"Azungwu",rubitec:"Nkaliki"}},rs={chip:"Awka · ~8km radius",labels:["Amawbia","Unizik Junction","Nnamdi Road","GRA","Enugwu Ukwu","Ifite","Okpuno","Umunze"],installerAreas:{auxano:"GRA",gve:"Amawbia",arnergy:"Unizik Junction",sosai:"Ifite",bluecamel:"Nnamdi Road",rubitec:"Enugwu Ukwu"}},ls={chip:"Ikeja (Lagos) · ~8km radius",labels:["Allen Avenue","Alausa","Maryland","Opebi","Oregun","Agidingbi","Toyin Street","Omole"],installerAreas:{auxano:"Allen Avenue",gve:"Oregun",arnergy:"Alausa",sosai:"Maryland",bluecamel:"Opebi",rubitec:"Omole"}},cs={chip:"Osogbo · ~8km radius",labels:["Old Garage","Oke-Fia","Oke-Baale","Aregbe","Laro","Igbona","Alekuwodo","Station Road"],installerAreas:{auxano:"Oke-Fia",gve:"Old Garage",arnergy:"Oke-Baale",sosai:"Aregbe",bluecamel:"Laro",rubitec:"Igbona"}},ce={"Abuja (FCT)":{chip:"Abuja (FCT) · ~8km radius",labels:["Maitama","Wuse 2","Asokoro","Garki","Jabi","Gwarinpa","Utako","Life Camp"],installerAreas:{auxano:"Garki",gve:"Jabi",arnergy:"Maitama",sosai:"Utako",bluecamel:"Wuse 2",rubitec:"Gwarinpa"}},Lagos:Bi,Kano:Ri,Maiduguri:Wi,Enugu:Ii,"Port Harcourt":{chip:"Port Harcourt · ~8km radius",labels:["GRA Phase 1","Rumuola","Trans-Amadi","Diobu","Obio/Akpor","Rumuokoro","D-Line","Elelenwo"],installerAreas:{auxano:"GRA Phase 1",gve:"Trans-Amadi",arnergy:"Rumuola",sosai:"Obio/Akpor",bluecamel:"D-Line",rubitec:"Rumuokoro"}},Ibadan:Pi,Kaduna:qi,Sokoto:Oi,Jos:Gi,"Benin City":{chip:"Benin City · ~8km radius",labels:["GRA","Oredo","Ikpoba Hill","Uselu","Airport Road","Ugbowo","Egor","Oba Market"],installerAreas:{auxano:"Ikpoba Hill",gve:"Oredo",arnergy:"GRA",sosai:"Uselu",bluecamel:"Ugbowo",rubitec:"Airport Road"}},Asaba:Di,Owerri:ji,Calabar:Ni,Uyo:zi,Abeokuta:Hi,Akure:Ki,Bauchi:Yi,Gombe:Vi,Ilorin:Ui,Lokoja:Ji,Makurdi:Xi,Minna:Zi,Umuahia:Qi,Yola:es,Zamfara:ts,Lafia:as,"Birnin Kebbi":{chip:"Birnin Kebbi · ~8km radius",labels:["Kalgo Road","Central Market","GRA","Augie Road","Sama'ila","Jega Road","New Layout","Dakingari"],installerAreas:{auxano:"GRA",gve:"Central Market",arnergy:"Kalgo Road",sosai:"Augie Road",bluecamel:"New Layout",rubitec:"Jega Road"}},Dutse:is,Damaturu:ss,Jalingo:ns,"Ado Ekiti":{chip:"Ado Ekiti · ~8km radius",labels:["Ajilosun","Oke-Bisi","Ijigbo","Adebayo","Basiri","Okesa","Ilawe Road","Fajuyi"],installerAreas:{auxano:"Adebayo",gve:"Ajilosun",arnergy:"Fajuyi",sosai:"Okesa",bluecamel:"Oke-Bisi",rubitec:"Basiri"}},Abakaliki:os,Awka:rs,Ikeja:ls,Osogbo:cs},ds=[{x:60,y:26},{x:36,y:32},{x:74,y:40},{x:54,y:74},{x:24,y:52},{x:18,y:16},{x:74,y:62},{x:40,y:78}];function Ye(e){return ce[e]||ce["Abuja (FCT)"]}const Yt='<svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:4px"><polyline points="1,4 3.5,6.5 9,1"/></svg>',ps='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>',us='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-left:5px"><polyline points="5,2 10,7 5,12"/></svg>',q={view:"market",openId:null,shortlist:["auxano","arnergy"],sortMode:"value",hovered:null};let ze=null,Se=null;function Ee(e){const i=q.shortlist.indexOf(e);i>=0?q.shortlist.splice(i,1):q.shortlist=[...q.shortlist.slice(-3),e],ge()}function ge(){ze&&Se&&Vt(ze,Se)}function Vt(e,i){ze=e,Se=i,q.view==="storefront"&&q.openId?fs(e):(q.view="market",vs(e))}function vs(e){var r,c,v,p,y;const i=Me(Ce),t=ms(i),n=R(),s=((c=(r=n.results)==null?void 0:r.solar)==null?void 0:c.panel_kwp)!=null?n.results.solar.panel_kwp.toFixed(2):"—",a=((v=n.location)==null?void 0:v.state)||"your area";e.innerHTML=`
    <div class="mk-page">
      <div class="mk-header-row">
        <div>
          <div class="mk-header-pill"><span></span>${i.length} VERIFIED INSTALLERS NEAR YOU</div>
          <h1 class="mk-h1">Verified Solar Installers in ${a}</h1>
          <p class="mk-sub">Showing quotes for your <strong>${s} kWp</strong> system from ${i.length} pre-screened, NNEL-verified solar installers serving ${a}.</p>
        </div>
        <div class="mk-sort" id="mk-sort">
          ${["value","distance","rating"].map(f=>`
            <button class="mk-sort-btn ${q.sortMode===f?"active":""}" data-sort="${f}">
              ${f==="value"?"Best value":f==="distance"?"Nearest":"Top rated"}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="mk-grid">
        <div class="mk-list-col" id="mk-list">
          ${t.map(f=>gs(f)).join("")}
        </div>
        <div class="mk-map-col">
          ${ys(i)}
        </div>
      </div>
    </div>
    ${hs()}
  `;const l=e.querySelector("#mk-map-canvas");l&&requestAnimationFrame(()=>{l.isConnected&&Ti(l)}),e.querySelectorAll("[data-sort]").forEach(f=>{f.addEventListener("click",()=>{q.sortMode=f.dataset.sort,ge()})}),e.querySelectorAll("[data-open]").forEach(f=>{f.addEventListener("click",u=>{u.stopPropagation(),Ct(f.dataset.open)})}),e.querySelectorAll("[data-toggle]").forEach(f=>{f.addEventListener("click",u=>{u.stopPropagation(),Ee(f.dataset.toggle)})}),e.querySelectorAll("[data-card]").forEach(f=>{f.addEventListener("mouseenter",()=>{q.hovered=f.dataset.card,ke()}),f.addEventListener("mouseleave",()=>{q.hovered=null,ke()})}),e.querySelectorAll("[data-pin]").forEach(f=>{f.addEventListener("mouseenter",()=>{q.hovered=f.dataset.pin,ke()}),f.addEventListener("mouseleave",()=>{q.hovered=null,ke()}),f.addEventListener("click",()=>Ct(f.dataset.pin))}),(p=e.querySelector("#mk-bar-clear"))==null||p.addEventListener("click",()=>{q.shortlist=[],ge()}),(y=e.querySelector("#mk-bar-compare"))==null||y.addEventListener("click",()=>Se("compare"))}function ke(){document.querySelectorAll("[data-card]").forEach(e=>e.classList.toggle("hovered",e.dataset.card===q.hovered)),document.querySelectorAll("[data-pin]").forEach(e=>e.classList.toggle("hovered",e.dataset.pin===q.hovered))}function ms(e){const i=[...e];return q.sortMode==="distance"?i.sort((t,n)=>t.distance-n.distance):q.sortMode==="rating"?i.sort((t,n)=>n.rating-t.rating||n.reviews-t.reviews):i.sort((t,n)=>n.score-t.score)}function gs(e){var n;const i=q.shortlist.includes(e.id),t=Ye((n=R().location)==null?void 0:n.state).installerAreas[e.id]||e.district;return`
    <div class="mk-card ${q.hovered===e.id?"hovered":""}" data-card="${e.id}">
      <div class="mk-card-top">
        <div class="mk-logo-chip">${e.init}</div>
        <div class="mk-name">${e.name}</div>
        <span class="mk-verified">Verified</span>
      </div>
      <div class="mk-meta">
        <span>${t}</span>
        <span>·</span>
        <span>${e.distance} km away</span>
        <span>·</span>
        <span class="mk-rating-pill"><span class="star">★</span> ${e.rating} · ${e.reviews} reviews</span>
      </div>
      <div class="mk-tags">${e.tags.map(s=>`<span class="mk-tag">${s}</span>`).join("")}</div>
      <div class="mk-card-footer">
        <div>
          <div class="mk-price-label">Estimated quote</div>
          <div class="mk-price">${G(e.price)}</div>
        </div>
        <div class="mk-card-btns">
          <button class="btn--dark-outline" data-open="${e.id}">View storefront</button>
          <button class="${i?"btn--added":"btn--amber"}" data-toggle="${e.id}">
            ${i?`${Yt}Added`:"+ Compare"}
          </button>
        </div>
      </div>
    </div>
  `}function ys(e){var s;const i=(s=R().location)==null?void 0:s.state,t=Ye(i);return`
    <div class="mk-map">
      <!-- Procedural canvas map (drawn by mapCanvas.js via requestAnimationFrame) -->
      <canvas id="mk-map-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block"></canvas>

      <!-- Coverage radius ring overlay -->
      <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice"
           style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
        <circle cx="288" cy="300" r="225" fill="none" stroke="#005527" stroke-opacity=".22" stroke-width="2" stroke-dasharray="3 9"/>
      </svg>

      <!-- District labels -->
      ${t.labels.map((a,l)=>({label:a,...ds[l]})).map(a=>`<div class="mk-district" style="left:${a.x}%;top:${a.y}%">${a.label}</div>`).join("")}

      <!-- Installer pins -->
      ${e.map(a=>`
        <div class="mk-pin ${q.hovered===a.id?"hovered":""}" data-pin="${a.id}"
             style="left:${a.mapX}%;top:${a.mapY}%">
          <div class="mk-pin-tag">
            <span class="mk-pin-init">${a.init}</span>
            ${Fi(a.price)}
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
  `}function hs(){const e=q.shortlist;if(e.length===0)return"";const i=Me(Ce),t=e.map(s=>i.find(a=>a.id===s)).filter(Boolean),n=e.length<2?"Add one more to compare side by side":e.length>=4?"Maximum 4 quotes reached":"Ready to compare side by side";return`
    <div class="mk-bar" id="mk-bar">
      <div class="mk-bar-avatars">
        ${t.slice(0,3).map(s=>`<div class="mk-bar-avatar">${s.init}</div>`).join("")}
      </div>
      <div class="mk-bar-text">
        <div class="mk-bar-count">${e.length} in comparison</div>
        <div class="mk-bar-hint">${n}</div>
      </div>
      <div class="mk-bar-btns">
        <button class="mk-bar-clear" id="mk-bar-clear">Clear</button>
        <button class="mk-bar-compare" id="mk-bar-compare">Compare quotes ${us}</button>
      </div>
    </div>
  `}function Ut(){const e=document.querySelector(".results-main");e?e.scrollTop=0:window.scrollTo({top:0,behavior:"instant"})}function Ct(e){q.view="storefront",q.openId=e,ge(),requestAnimationFrame(Ut)}function fs(e){var p,y,f,u;const i=Me(Ce),t=i.find(o=>o.id===q.openId)||i[0],n=q.shortlist.includes(t.id),s=["#1F2937","#3D6B7A","#374151"],l=((p=R().location)==null?void 0:p.state)||"Abuja (FCT)",r=l.replace(/\s*\(FCT\)/i,"").trim(),c=Ye(l).installerAreas[t.id]||t.district,v=[{title:"3kVA hybrid install",sub:"Maitama · Jan 2024",grad:"linear-gradient(135deg,#1e3a5f,#2d6a8f)",tilt:"-4deg"},{title:"8kVA + lithium bank",sub:"Gwarinpa · Mar 2024",grad:"linear-gradient(135deg,#1a4731,#2d7a55)",tilt:"3deg"},{title:"Rooftop array, 12 panels",sub:"Asokoro · Feb 2024",grad:"linear-gradient(135deg,#2c3e50,#4a5568)",tilt:"-2deg"},{title:"Whole-home backup",sub:"Wuse 2 · Apr 2024",grad:"linear-gradient(135deg,#0d2b1e,#1a4731)",tilt:"4deg"}];e.innerHTML=`
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="sf-back">${ps}Back to installers</button>
    </div>
    <div class="sf-page">
      <div class="sf-card">

        <!-- Gradient header -->
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
                <span>·</span><span>${c}, ${r}</span>
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

        <!-- Body -->
        <div class="sf-body">
          <div class="sf-quote-panel">
            <div style="flex:1;min-width:0">
              <div class="sf-quote-label">Their quote for your ${((u=(f=(y=R().results)==null?void 0:y.solar)==null?void 0:f.panel_kwp)==null?void 0:u.toFixed(2))??"—"} kWp system</div>
              <div class="sf-quote-price">${G(t.price)}</div>
              <div class="sf-quote-sub">Installed · ${t.timeline} timeline · ${t.warranty} warranty</div>
              <div class="sf-kit-grid">
                <div class="sf-kit-tile"><div class="label">Solar panels</div><div class="value">${t.panel}</div></div>
                <div class="sf-kit-tile"><div class="label">Battery</div><div class="value">${t.battery}</div></div>
                <div class="sf-kit-tile"><div class="label">Inverter</div><div class="value">${t.inverter}</div></div>
                <div class="sf-kit-tile"><div class="label">After-sales</div><div class="value">${t.aftercare}</div></div>
              </div>
            </div>
            <div style="flex-shrink:0;padding-top:4px">
              <button class="${n?"btn--added":"btn--amber"}" style="padding:13px 20px;font-size:13px;display:inline-flex;align-items:center;gap:6px" id="sf-toggle">
                ${n?`${Yt}In comparison`:"+ Add to comparison"}
              </button>
            </div>
          </div>

          <!-- Gallery -->
          <div class="section-title" style="margin-bottom:12px">Recent installs</div>
          <div class="sf-gallery" style="margin-bottom:28px">
            ${v.map(o=>`
              <div class="sf-gallery-card">
                <div class="sf-gallery-img" style="background:${o.grad}">
                  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:120px">
                    <div style="width:80%;height:55%;background:repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 20px),${o.grad};transform:rotateX(34deg) rotate(${o.tilt});border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.3)"></div>
                  </div>
                </div>
                <div class="sf-gallery-caption">
                  <div class="sf-cap-title">${o.title}</div>
                  <div class="sf-cap-sub">${o.sub}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Reviews -->
          <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px">
            <div class="section-title" style="margin-bottom:0">What homeowners say</div>
            <span style="font-size:13px;color:var(--color-text-secondary)">★ ${t.rating} average</span>
          </div>
          <div class="sf-reviews">
            ${t.reviews_l.map((o,d)=>`
              <div class="sf-review-card">
                <div class="sf-review-top">
                  <div style="display:flex;align-items:center;gap:10px">
                    <div class="sf-review-avatar" style="background:${s[d%3]}">${o.name[0]}</div>
                    <div>
                      <div class="sf-review-name">${o.name}</div>
                      <div class="sf-review-area">${o.area} · ${o.date}</div>
                    </div>
                  </div>
                  <div class="sf-review-stars">${"★".repeat(o.stars)}</div>
                </div>
                <div class="sf-review-text">${o.text}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `,e.querySelector("#sf-back").addEventListener("click",()=>{q.view="market",ge(),requestAnimationFrame(Ut)}),e.querySelector("#sf-toggle").addEventListener("click",()=>Ee(t.id))}function bs(e){return ce[e]||ce["Abuja (FCT)"]}const Jt='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>',ks=[{id:"baobab",name:"Baobab MFB",init:"BA",rate:2.8,approval:"3–5 days",maxTenure:36,color:"#1F2937"},{id:"lapo",name:"LAPO MFB",init:"LA",rate:3,approval:"3–5 days",maxTenure:36,color:"#1E5BB8"},{id:"ab",name:"AB Microfinance",init:"AB",rate:3.1,approval:"2–4 days",maxTenure:30,color:"#3D6B7A"},{id:"accion",name:"Accion MFB",init:"AC",rate:3.3,approval:"3–5 days",maxTenure:36,color:"#C0392B"},{id:"renmoney",name:"Renmoney",init:"RE",rate:3.5,approval:"24–48 hrs",maxTenure:24,color:"#6A2FB8"},{id:"fairmoney",name:"FairMoney MFB",init:"FA",rate:3.8,approval:"Same day",maxTenure:24,color:"#0E8F6E"}];function xs(e,i,t){const n=e/100;return t*n/(1-Math.pow(1+n,-i))}let V=null;function Mt(e){V=e,O.view="config"}let O={down:30,tenure:36,picked:null,view:"config",fundMode:"loan"},N=null,Ve=null;function ve(){return V!=null&&V.price?V.price:462e4}function _s(){var e,i,t;return((t=(i=(e=R().results)==null?void 0:e.solar)==null?void 0:i.panel_kwp)==null?void 0:t.toFixed(2))??"—"}function ws(e,i){N=e,Ve=i,Z()}function Z(){var A,w,M,_;if(O.view==="done"){As();return}const e=ve(),i=O.fundMode!=="self",t=e*(1-O.down/100),n=e*O.down/100,s=ks.map(b=>{const m=Math.min(O.tenure,b.maxTenure),k=xs(b.rate,m,t),S=k*m+n;return{...b,n:m,monthly:k,total:S}}).sort((b,m)=>b.monthly-m.monthly),a=["fairmoney","renmoney"],l=[...s.filter(b=>a.includes(b.id)),...s.filter(b=>!a.includes(b.id))],r=s[0],c=(O.down-10)/40*100,v=`linear-gradient(to right, #FCBF1E 0%, #FCBF1E ${c}%, #E5E7EB ${c}%, #E5E7EB 100%)`,p=V,y=(p==null?void 0:p.init)??"SO",f=(p==null?void 0:p.name)??"Your installer",o=((A=R().location)==null?void 0:A.state)??"Abuja (FCT)",d=o.replace(/\s*\(FCT\)/i,"").trim(),g=p?bs(o).installerAreas[p.id]||p.district:null,E=[p!=null&&p.warranty?p.warranty+" warranty":null,g?g+", "+d:null].filter(Boolean).join(" · ");if(N.innerHTML=`
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="fc-back">${Jt}Back to quotes</button>
    </div>
    <div class="fc-page">
      <h1 class="fc-h1">Finance your solar system</h1>
      <p class="fc-sub">Pay outright with no interest, or spread the cost through a verified microfinance bank. Toggle between options below.</p>

      <!-- Funding mode switch -->
      <div class="fc-fund-switch-row">
        <span class="fc-switch-lbl ${i?"":"fc-switch-lbl--active"}" data-mode="self">Pay outright</span>
        <div class="fc-switch-track ${i?"is-on":""}" id="fc-mode-switch">
          <div class="fc-switch-thumb"></div>
        </div>
        <span class="fc-switch-lbl ${i?"fc-switch-lbl--active":""}" data-mode="loan">Micro-finance loan</span>
      </div>

      <div class="fc-grid">
        <!-- LEFT: system card + configurator (loan only) or summary (self) -->
        <div>
          <div class="fc-card">
            <div class="fc-card-label">Your system</div>
            <div class="fc-system-row">
              <div class="fc-system-info">
                <div class="mk-logo-chip">${y}</div>
                <div>
                  <div class="fc-system-name">${f} · ${_s()} kWp system</div>
                  <div class="fc-system-sub">${E}</div>
                </div>
              </div>
              <div class="fc-system-cost">${G(e)}</div>
            </div>
          </div>

          ${i?`
            <div class="fc-card">
              <div class="fc-down-header">
                <div class="fc-card-label" style="margin-bottom:0">Down payment</div>
                <div class="fc-down-pct" id="fc-down-pct">${O.down}%</div>
              </div>
              <input type="range" class="fc-range" id="fc-range"
                min="10" max="50" step="5" value="${O.down}"
                style="background:${v}">
              <div class="fc-down-row" id="fc-down-row">
                <span>You pay now: <strong>${G(n)}</strong></span>
                <span>To finance: <strong>${G(t)}</strong></span>
              </div>
            </div>

            <div class="fc-card">
              <div class="fc-card-label">Repayment plan</div>
              <div class="fc-tenure">
                ${[6,12,18,24,36].map(b=>`
                  <button class="fc-tenure-btn ${O.tenure===b?"active":""}" data-tenure="${b}">
                    ${b}<span class="fc-mo">months</span>
                  </button>
                `).join("")}
              </div>
            </div>

            <div class="fc-hero">
              <div class="fc-hero-label">Best loan offer · ${r.name}</div>
              <div class="fc-hero-monthly">${G(r.monthly)}</div>
              <div class="fc-hero-sub">/ month &nbsp;·&nbsp; for ${O.tenure} months &nbsp;·&nbsp; lowest rate from ${s.length} banks</div>
            </div>
          `:`
            <div class="fc-card" style="background:var(--color-primary-bg);border-color:var(--color-primary)">
              <div class="fc-card-label" style="color:var(--color-primary-dark)">Full payment</div>
              <div style="font-size:clamp(28px,5vw,40px);font-weight:800;color:var(--color-text);margin-bottom:4px">${G(e)}</div>
              <div style="font-size:13px;color:var(--color-text-secondary)">Single payment · no monthly obligations · no bank approval</div>
            </div>
          `}
        </div>

        <!-- RIGHT: loan cards or self-fund card -->
        <div>
          ${i?`
            <div style="font-size:16px;font-weight:700;color:var(--color-text);margin-bottom:4px">Loan offers for you</div>
            <div style="font-size:12px;color:var(--color-text-muted);margin-bottom:14px">FairMoney &amp; Renmoney featured · reducing-balance rates</div>

            ${l.map(b=>{const m=b.id===r.id;return`
                <div class="fc-offer-card ${m?"best":""}">
                  <div class="fc-offer-top">
                    <div class="fc-bank-chip" style="background:${b.color}">${b.init}</div>
                    <div>
                      <div class="fc-offer-name">${b.name}</div>
                      <div class="fc-offer-sub">${b.rate}% / mo · ${b.approval} approval · up to ${b.maxTenure} mo</div>
                    </div>
                    ${m?'<span class="fc-offer-badge fc-offer-badge--best">Lowest monthly</span>':""}
                  </div>
                  <div class="fc-offer-footer">
                    <div>
                      <div class="fc-offer-monthly">Monthly ${G(b.monthly)}</div>
                      <div class="fc-offer-total">Total payable ${G(b.total)}</div>
                    </div>
                    <button class="fc-select-btn ${m?"best-btn":""}" data-bank="${b.id}">Select</button>
                  </div>
                </div>
              `}).join("")}

            <div class="fc-trust">
              Rates are indicative monthly reducing-balance figures. Final rates are confirmed during application. A soft credit check may apply — your score is not affected. NNEL Solar Hub never charges you to apply.
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
                <div style="font-size:clamp(36px,6vw,54px);font-weight:800;color:var(--color-text);line-height:1;margin-bottom:6px">${G(e)}</div>
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
  `,(w=N.querySelector("#fc-mode-switch"))==null||w.addEventListener("click",()=>{O.fundMode=i?"self":"loan",Z()}),N.querySelectorAll("[data-mode]").forEach(b=>{b.addEventListener("click",()=>{O.fundMode=b.dataset.mode,Z()})}),i){const b=N.querySelector("#fc-range");b.addEventListener("input",()=>{const m=parseInt(b.value);O.down=m;const k=(m-10)/40*100;b.style.background=`linear-gradient(to right, #FCBF1E 0%, #FCBF1E ${k}%, #E5E7EB ${k}%, #E5E7EB 100%)`;const S=N.querySelector("#fc-down-pct");S&&(S.textContent=`${m}%`);const C=ve(),L=N.querySelector("#fc-down-row");L&&(L.innerHTML=`<span>You pay now: <strong>${G(C*m/100)}</strong></span><span>To finance: <strong>${G(C*(1-m/100))}</strong></span>`)}),b.addEventListener("change",()=>Z()),N.querySelectorAll("[data-tenure]").forEach(m=>{m.addEventListener("click",()=>{O.tenure=parseInt(m.dataset.tenure),Z()})}),N.querySelectorAll("[data-bank]").forEach(m=>{m.addEventListener("click",()=>{const k=s.find(S=>S.id===m.dataset.bank);k&&Ss(k,n,t)})})}else(M=N.querySelector('[data-bank="self"]'))==null||M.addEventListener("click",()=>{O.picked={id:"self",name:"self-fund",isSelf:!0,monthly:0,total:ve(),approval:"N/A"},O.view="done",Z()});(_=N.querySelector("#fc-back"))==null||_.addEventListener("click",()=>Ve("compare"))}function Ss(e,i,t){var l,r,c;const n=ve(),s=V,a=document.createElement("div");a.id="fc-modal-overlay",a.innerHTML=`
    <div class="fc-modal">
      <div class="fc-modal-head">
        <div class="fc-bank-chip" style="background:${e.color};width:40px;height:40px;border-radius:10px;font-size:14px">${e.init}</div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:var(--color-text)">${e.name}</div>
          <div style="font-size:12px;color:var(--color-text-muted)">Loan application summary</div>
        </div>
        <button class="fc-modal-close" id="fc-modal-close">✕</button>
      </div>

      ${s?`<div class="fc-modal-installer">
        <div class="mk-logo-chip" style="width:28px;height:28px;font-size:10px">${s.init}</div>
        <span style="font-size:13px;font-weight:600;color:var(--color-text)">${s.name} · ${((c=(r=(l=R().results)==null?void 0:l.solar)==null?void 0:r.panel_kwp)==null?void 0:c.toFixed(2))??"—"} kWp system</span>
      </div>`:""}

      <div class="fc-modal-rows">
        <div class="fc-modal-row"><span class="fc-modal-lbl">System cost</span><span class="fc-modal-val">${G(n)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Down payment (${O.down}%)</span><span class="fc-modal-val">${G(i)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Loan amount</span><span class="fc-modal-val">${G(t)}</span></div>
        <div class="fc-modal-row fc-modal-row--highlight"><span class="fc-modal-lbl">Monthly repayment</span><span class="fc-modal-val fc-modal-val--amber">${G(e.monthly)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Repayment period</span><span class="fc-modal-val">${O.tenure} months</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Total payable</span><span class="fc-modal-val">${G(e.total)}</span></div>
        <div class="fc-modal-row"><span class="fc-modal-lbl">Approval time</span><span class="fc-modal-val">${e.approval}</span></div>
      </div>

      <p class="fc-modal-note">By proceeding, you authorise ${e.name} to conduct a soft credit check. Your credit score will not be affected. Rates confirmed during application.</p>
      <button class="btn btn--primary btn--lg fc-modal-cta" id="fc-modal-proceed">Proceed with application →</button>
    </div>
  `,document.body.appendChild(a),a.querySelector("#fc-modal-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",v=>{v.target===a&&a.remove()}),a.querySelector("#fc-modal-proceed").addEventListener("click",()=>{a.remove(),Es(()=>{O.picked=e,O.view="done",Z()})})}function Es(e){const i=document.createElement("div");i.id="fc-apply-overlay",i.innerHTML=`
    <div class="fc-apply-inner">
      <div class="fc-apply-spinner"></div>
      <div class="fc-apply-label">Submitting your application…</div>
      <div class="fc-apply-sub">Sending your energy profile to the bank</div>
    </div>
  `,document.body.appendChild(i),setTimeout(()=>{i.style.opacity="0",i.style.transition="opacity 0.4s ease",setTimeout(()=>{i.remove(),e()},420)},3e3)}function As(){var l;const e=O.picked,i=ve(),t=i*O.down/100,n=(V==null?void 0:V.name)??"your installer",s=e.isSelf?`<p>You've chosen to self-fund your solar investment. ${n} will be in touch to schedule a site survey and confirm installation dates.</p>`:`<p>We've sent your verified energy profile and system specification to ${e.name}. Expect a decision within <strong>${e.approval}</strong>. ${n} is on standby to schedule your site survey once approved.</p>`,a=e.isSelf?`
      <div class="fc-stat-strip">
        <div class="fc-stat-cell">
          <div class="label">System cost</div>
          <div class="value value--amber">${G(i)}</div>
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
          <div class="value">${G(t)}</div>
        </div>
        <div class="fc-stat-cell">
          <div class="label">Monthly</div>
          <div class="value value--amber">${G(e.monthly)}</div>
        </div>
        <div class="fc-stat-cell">
          <div class="label">For</div>
          <div class="value">${O.tenure} months</div>
        </div>
      </div>`;N.innerHTML=`
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="fc-done-back">${Jt}Back to quotes</button>
    </div>
    <div class="fc-page">
      <div class="fc-done">
        <div class="fc-tick-circle">
          <div class="fc-tick"></div>
        </div>
        <h1>${e.isSelf?"You're all set to self-fund.":"Your application is on its way to "+e.name+"."}</h1>
        ${s}
        ${a}
        <button class="btn--dark-outline" id="fc-adjust" style="font-size:13px;padding:10px 20px">Adjust my plan</button>
      </div>
    </div>
  `,N.querySelector("#fc-adjust").addEventListener("click",()=>{O.view="config",Z()}),(l=N.querySelector("#fc-done-back"))==null||l.addEventListener("click",()=>Ve("compare"))}function $s(e){return ce[e]||ce["Abuja (FCT)"]}const Ls='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-right:5px"><polyline points="9,2 4,7 9,12"/></svg>',Cs='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" style="display:inline-block;vertical-align:middle;margin-left:5px"><polyline points="5,2 10,7 5,12"/></svg>',Ms=[{label:"Total quote",key:"price",render:e=>G(e.price),bestFn:e=>e.reduce((i,t)=>t.price<i.price?t:i),bestTag:"Lowest"},{label:"Value score",key:"score",render:e=>`<strong>${e.score}/100</strong>`,bestFn:e=>e.reduce((i,t)=>t.score>i.score?t:i),bestTag:"Top"},{label:"Warranty",key:"warranty",render:e=>e.warranty,bestFn:e=>e.reduce((i,t)=>t.warrantyScore>i.warrantyScore?t:i),bestTag:"Longest"},{label:"Install time",key:"timeline",render:e=>e.timeline,bestFn:null},{label:"Solar panels",key:"panel",render:e=>e.panel,bestFn:null},{label:"Battery",key:"battery",render:e=>e.battery,bestFn:null},{label:"Inverter",key:"inverter",render:e=>e.inverter,bestFn:null},{label:"After-sales",key:"aftercare",render:e=>e.aftercare,bestFn:null},{label:"Rating",key:"rating",render:e=>`★ ${e.rating} (${e.reviews})`,bestFn:e=>e.reduce((i,t)=>t.rating>i.rating?t:i),bestTag:"Best"},{label:"Financing",key:"financing",render:e=>e.financing,bestFn:null}];let X=null,xe=null;function Fs(e,i){X=e,xe=i,He()}function He(){var y,f;const e=Me(Ce),i=q.shortlist,t=i.length>0?i:[e.sort((u,o)=>o.score-u.score)[0].id],n=t.map(u=>e.find(o=>o.id===u)).filter(Boolean),s=n.reduce((u,o)=>o.score>u.score?o:u,n[0]),a=s==null?void 0:s.id,l=e.filter(u=>!t.includes(u.id)),r=n.length<4&&l.length>0,c=n.length>1?`Comparing ${n.length} quotes for your home`:"Add installers to compare";X.innerHTML=`
    <div class="mk-nav-bar">
      <button class="btn--dark-outline" style="font-size:12px;padding:7px 14px;display:inline-flex;align-items:center;gap:4px" id="cq-back">${Ls}Back to installers</button>
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
          <div class="mk-logo-chip" style="background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);color:#fff;font-size:14px">${s.init}</div>
          <div>
            <div class="cq-banner-label">Best overall value</div>
            <div class="cq-banner-name">${s.name}</div>
            <div class="cq-banner-why">${s.warranty} warranty · ★ ${s.rating} from ${s.reviews} reviews · ${s.timeline}</div>
          </div>
        </div>
        <div class="cq-banner-right">
          <div class="cq-banner-price">${G(s.price)}</div>
          <div class="cq-banner-score">Value score ${s.score}/100</div>
          <button class="cq-pick-btn" id="cq-pick-best">Select &amp; Finance ${Cs}</button>
        </div>
      </div>

      <!-- Table -->
      <div class="cq-table-wrap">
        <table class="cq-table">
          <thead>
            <tr>
              <th class="cq-col-label" style="font-size:13px;font-weight:700;color:var(--color-text)">Compare</th>
              ${n.map(u=>{var d;const o=$s((d=R().location)==null?void 0:d.state).installerAreas[u.id]||u.district;return`
                <th class="cq-th ${u.id===a?"cq-th--best":""}">
                  <div class="cq-th-logo">${u.init}</div>
                  <div class="cq-th-name">${u.name}</div>
                  <div class="cq-th-district">${o}</div>
                  ${u.id===a?'<div class="cq-best-chip">★ BEST VALUE</div>':""}
                  <button class="cq-remove-btn" data-remove="${u.id}">Remove</button>
                </th>`}).join("")}
              ${r?`
                <th class="cq-th-add">
                  <div class="cq-add-box" id="cq-add-box">
                    <div style="font-size:20px;color:var(--color-text-muted)">+</div>
                    <div class="cq-add-label">Add installer</div>
                    <div class="cq-add-dropdown" id="cq-add-dropdown" style="display:none">
                      ${l.map(u=>`
                        <div class="cq-add-option" data-add="${u.id}">
                          <div class="cq-th-logo" style="width:28px;height:28px;font-size:10px;margin-bottom:0">${u.init}</div>
                          <span style="font-size:13px">${u.name}</span>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                </th>
              `:""}
            </tr>
          </thead>
          <tbody>
            ${Ms.map((u,o)=>{const d=o%2===0,g=d?"#F2F3F2":"#FFFFFF",E="#FEF0C0",A="#FEF8E0";return`
              <tr>
                <td class="cq-col-label" style="background:${g}">${u.label}</td>
                ${n.map(w=>{var m;const M=u.bestFn&&((m=u.bestFn(n))==null?void 0:m.id)===w.id,_=w.id===a?d?E:A:g;return`<td class="${`cq-td ${w.id===a?"cq-td--best":""}`}" style="background:${_}">
                    <span ${M?'class="cq-td--green"':""}>${u.render(w)}</span>
                    ${M?`<span class="cq-best-tag">${u.bestTag}</span>`:""}
                  </td>`}).join("")}
                ${r?`<td class="cq-td" style="background:${g}"></td>`:""}
              </tr>`}).join("")}
            <tr>
              <td class="cq-col-label cq-td-footer">Proceed with</td>
              ${n.map(u=>`
                <td class="cq-td-footer ${u.id===a?"cq-td--best":""}">
                  <button class="cq-finance-btn ${u.id===a?"best":""}" data-finance="${u.id}">Finance this</button>
                </td>
              `).join("")}
              ${r?'<td class="cq-td-footer"></td>':""}
            </tr>
          </tbody>
        </table>
      </div>
      <p class="cq-footnote">Value score methodology: price 40% · warranty &amp; kit quality 30% · installation speed 15% · customer ratings 15%. Scores are relative to the 6 installers in this marketplace.</p>
    </div>
  `,X.querySelectorAll("[data-remove]").forEach(u=>{u.addEventListener("click",()=>{Ee(u.dataset.remove),He()})});const v=X.querySelector("#cq-add-box"),p=X.querySelector("#cq-add-dropdown");v&&p&&(v.addEventListener("click",u=>{u.stopPropagation(),p.style.display=p.style.display==="none"?"block":"none"}),document.addEventListener("click",()=>{p&&(p.style.display="none")},{once:!0}),X.querySelectorAll("[data-add]").forEach(u=>{u.addEventListener("click",o=>{o.stopPropagation(),Ee(u.dataset.add),He()})})),X.querySelectorAll("[data-finance]").forEach(u=>{u.addEventListener("click",()=>{const o=n.find(d=>d.id===u.dataset.finance);o&&Mt(o),xe("financing")})}),(y=X.querySelector("#cq-pick-best"))==null||y.addEventListener("click",()=>{Mt(s),xe("financing")}),(f=X.querySelector("#cq-back"))==null||f.addEventListener("click",()=>xe("market"))}const Ts=["step1","step2","step3"],Ae=["costSavings","loadProfile","solarPVSystem","finalQuote"],Bs=[{route:"costSavings",label:"Cost Savings",sublabel:"Financial Breakdown",paths:'<polyline points="1,13 5,9 8,11 14,4"/><polyline points="10,4 14,4 14,8"/>'},{route:"loadProfile",label:"Load Summary",sublabel:"Energy Profile",paths:'<rect x="2" y="10" width="3" height="4" rx="0.5"/><rect x="6.5" y="6" width="3" height="8" rx="0.5"/><rect x="11" y="2" width="3" height="12" rx="0.5"/>'},{route:"solarPVSystem",label:"Solar PV System",sublabel:"Recommendation",paths:'<circle cx="8" cy="8" r="2.5"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3.34" y1="3.34" x2="4.75" y2="4.75"/><line x1="11.25" y1="11.25" x2="12.66" y2="12.66"/><line x1="12.66" y1="3.34" x2="11.25" y2="4.75"/><line x1="4.75" y1="11.25" x2="3.34" y2="12.66"/>'},{route:"addAppliances",label:"Add Appliances",sublabel:"Customise Profile",paths:'<rect x="1" y="3" width="14" height="10" rx="1.5"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="9" x2="9" y2="9"/><line x1="12" y1="11" x2="15" y2="14"/>'},{route:"market",label:"Find Installers",sublabel:"Solar Marketplace",paths:'<circle cx="6" cy="6" r="4"/><line x1="9.5" y1="9.5" x2="15" y2="15"/>'},{route:"compare",label:"Compare Quotes",sublabel:"Side by Side",paths:'<rect x="1" y="4" width="4" height="9" rx="1"/><rect x="6" y="2" width="4" height="11" rx="1"/><rect x="11" y="6" width="4" height="7" rx="1"/>'},{route:"financing",label:"Financing",sublabel:"Payment Plans",paths:'<circle cx="8" cy="8" r="6.5"/><line x1="8" y1="5" x2="8" y2="8"/><line x1="8" y1="8" x2="11" y2="8"/>'}],Rs={step1:Tt,step2:Rt,step3:Ot,costSavings:Nt,loadProfile:Dt,solarPVSystem:jt,finalQuote:zt,addAppliances:Mi,market:Vt,compare:Fs,financing:ws};let U="step1",_e=!1,Ft=!1,ie=null;function K(e){if(_e&&Ae.includes(e)){U=e,Zt(e),Qt(e);return}U=e,Ae.includes(e)?(_e=!0,Ws(e)):(_e=!1,ea())}function Ws(e){const i=document.getElementById("wizard-layout"),t=document.getElementById("results-layout");i.classList.add("hidden"),t.classList.remove("hidden"),$e(),ta(),aa(),ie&&(ie(),ie=null);const n=document.getElementById("results-content");n.innerHTML=`
    <div id="section-costSavings"   data-section="costSavings"></div>
    <div id="section-loadProfile"   data-section="loadProfile"></div>
    <div id="section-solarPVSystem" data-section="solarPVSystem"></div>
    <div id="section-finalQuote"    data-section="finalQuote"></div>
  `,Nt(document.getElementById("section-costSavings"),K),Dt(document.getElementById("section-loadProfile"),K),jt(document.getElementById("section-solarPVSystem"),K),zt(document.getElementById("section-finalQuote"),K),ie=Is(),e&&requestAnimationFrame(()=>Zt(e))}function Xt(){const e=document.getElementById("results-content");if(e&&e.scrollHeight>e.clientHeight)return e;const i=document.querySelector(".right-panel");return i&&i.scrollHeight>i.clientHeight?i:null}function Zt(e){const i=document.getElementById(`section-${e}`);if(!i)return;const t=Xt();if(t){const n=t.getBoundingClientRect(),s=i.getBoundingClientRect();t.scrollTo({top:t.scrollTop+s.top-n.top,behavior:"smooth"})}else i.scrollIntoView({behavior:"smooth",block:"start"})}function Is(){const e=Xt(),i=e||window;function t(){const n=e?e.clientHeight:window.innerHeight,a=(e?e.getBoundingClientRect().top:0)+n*.3;let l=Ae[0];for(const r of Ae){const c=document.getElementById(`section-${r}`);c&&c.getBoundingClientRect().top<=a&&(l=r)}l!==U&&(U=l,Qt(l))}return i.addEventListener("scroll",t,{passive:!0}),()=>i.removeEventListener("scroll",t)}function Qt(e){document.querySelectorAll("#results-nav [data-route]").forEach(i=>{i.classList.toggle("active",i.dataset.route===e)})}function ea(){const e=document.getElementById("wizard-layout"),i=document.getElementById("results-layout");if(ie&&(ie(),ie=null),Ts.includes(U)){e.classList.remove("hidden"),i.classList.add("hidden");const t=document.getElementById("wizard-content");t.innerHTML="",{step1:Tt,step2:Rt,step3:Ot}[U](t,K),document.querySelector(".right-panel").scrollTop=0}else if(["addAppliances","market","compare","financing"].includes(U)){e.classList.add("hidden"),i.classList.remove("hidden"),ta(),aa();const t=document.getElementById("results-content");t.innerHTML="",Rs[U](t,K),requestAnimationFrame(()=>{t.scrollTop=0})}}function ta(){var n;const e=document.getElementById("results-nav"),i=document.getElementById("results-actions"),t=U;e.innerHTML=Bs.map(s=>`
    <div class="results-nav__item${s.route===t?" active":""}" data-route="${s.route}">
      <svg class="results-nav__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${s.paths}
      </svg>
      <div class="results-nav__label-wrap">
        <span class="results-nav__label">${s.label}</span>
        <span class="results-nav__sublabel">${s.sublabel}</span>
      </div>
    </div>
  `).join(""),e.querySelectorAll("[data-route]").forEach(s=>{s.addEventListener("click",()=>K(s.dataset.route))}),i.innerHTML=`
    <button class="btn btn--outline btn--sm btn--full" id="adjust-energy-btn">Adjust Energy Data</button>
  `,(n=document.getElementById("adjust-energy-btn"))==null||n.addEventListener("click",()=>K("step1"))}function aa(){if(Ft)return;Ft=!0;const e=document.getElementById("results-hamburger"),i=document.getElementById("offcanvas-close-btn"),t=document.getElementById("offcanvas-backdrop"),n=document.querySelector(".results-sidebar");function s(){n.classList.add("is-open"),t.classList.add("is-visible")}function a(){n.classList.remove("is-open"),t.classList.remove("is-visible")}e==null||e.addEventListener("click",s),i==null||i.addEventListener("click",a),t==null||t.addEventListener("click",a),n==null||n.addEventListener("click",l=>{l.target.closest("[data-route]")&&a()})}function Ps(){window._navigate=K,document.querySelectorAll(".logo, .mobile-top-bar").forEach(e=>{e.style.cursor="pointer",e.addEventListener("click",()=>K("step1"))}),document.querySelectorAll(".results-sidebar__logo, .results-mobile-topbar__logo").forEach(e=>{e.style.cursor="pointer",e.addEventListener("click",i=>{i.target.closest(".offcanvas-close-btn")||K("step1")})}),ea()}async function qs(){const[e,i,t,n,s,a,l]=await Promise.all([Q(()=>import("./pv_yield-zu19S3ka.js"),[]),Q(()=>import("./appliances-By550bug.js"),[]),Q(()=>import("./usage_patterns-BryIkWX-.js"),[]),Q(()=>import("./tariff_bands-C6yWzGBK.js"),[]),Q(()=>import("./fuel_prices-jFU3ASga.js"),[]),Q(()=>import("./generator_efficiency-MkdsxVYB.js"),[]),Q(()=>import("./house_type_appliances-D5Qin5UE.js"),[])]);ee("pv_yield",e.default),ee("appliances",i.default),ee("usage_patterns",t.default),ee("tariff_bands",n.default),ee("fuel_prices",s.default),ee("generator_efficiency",a.default),ee("house_type_appliances",l.default)}async function Os(){await qs(),Ps()}Os();
