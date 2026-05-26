(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const t of i)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function a(i){const t={};return i.integrity&&(t.integrity=i.integrity),i.referrerPolicy&&(t.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?t.credentials="include":i.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(i){if(i.ep)return;i.ep=!0;const t=a(i);fetch(i.href,t)}})();const Ce="modulepreload",Fe=function(e){return"/"+e},Dt={},N=function(n,a,s){let i=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),o=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));i=Promise.allSettled(a.map(l=>{if(l=Fe(l),l in Dt)return;Dt[l]=!0;const r=l.endsWith(".css"),u=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const p=document.createElement("link");if(p.rel=r?"stylesheet":Ce,r||(p.as="script"),p.crossOrigin="",p.href=l,o&&p.setAttribute("nonce",o),document.head.appendChild(p),r)return new Promise((y,x)=>{p.addEventListener("load",y),p.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function t(c){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=c,window.dispatchEvent(o),!o.defaultPrevented)throw c}return i.then(c=>{for(const o of c||[])o.status==="rejected"&&t(o.reason);return n().catch(t)})},lt={location:null,powerSource:null,tariffBand:null,gridSpend:1e5,fuelSpend:5e4,generatorSize:null,houseType:null,rooms:0,appliances:[],customSchedule:null,goal:null,backupHours:4,budget:15e5,results:null,_data:{}},Le=new Set;function M(){return{...lt}}function O(e){Object.assign(lt,e),Le.forEach(n=>n({...lt}))}function z(e){return lt._data[e]||null}function q(e,n){lt._data[e]=n}const Me=['<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>','<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.09 12.33A1 1 0 005 14h7l-1 8 8.91-10.33A1 1 0 0019 10h-7l1-8z"/></svg>','<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>','<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>'],Gt=[[1,2],[3,4],[5],[6]],Ae=["step1","step3","step5","step6"];function tt(e){const n=Gt.findIndex(a=>a.includes(e));return`
    <div class="progress-bar">
      ${Gt.map((a,s)=>{const i=s<n,t=s===n,c=s<=n,o=i?"completed":t?"active":"",l=c?`onclick="window._navigate('${Ae[s]}')" style="cursor:pointer"`:'style="cursor:default"';return`
          ${s>0?`<div class="progress-bar__line ${i?"completed":""}"></div>`:""}
          <div class="progress-bar__step">
            <div class="progress-bar__dot ${o}" ${l}>${Me[s]}</div>
          </div>
        `}).join("")}
    </div>
  `}function Be(e,n){var o,l,r;const a=M(),s=z("pv_yield")||[];e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn" disabled style="opacity:0.35">
          ← Back
        </button>
        ${tt(1)}
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
          <label class="label" style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">
            Select your state / city
          </label>
          <div class="select-wrap">
            <select class="sunova-select" id="location-select">
              <option value="">Choose your location</option>
              ${s.map(u=>{var p;return`
                <option value="${u.state}" ${((p=a.location)==null?void 0:p.state)===u.state?"selected":""}>
                  ${u.state} (${u.zone})
                </option>
              `}).join("")}
            </select>
          </div>

          <div id="location-info" class="card" style="margin-top:16px;background:var(--color-primary-bg);border-color:var(--color-primary-light);display:${a.location?"block":"none"}">
            <div style="display:flex;gap:32px;align-items:center">
              <div>
                <div class="label">Zone</div>
                <div class="value" id="loc-zone">${((o=a.location)==null?void 0:o.zone)||""}</div>
              </div>
              <div>
                <div class="label">Peak Sun Hours</div>
                <div class="value value--amber" id="loc-psh">${((l=a.location)==null?void 0:l.daily_yield_kwh_per_kwp)||""} hrs/day</div>
              </div>
              <div>
                <div class="label">Annual Yield</div>
                <div class="value" id="loc-yield">${((r=a.location)==null?void 0:r.annual_yield_kwh_per_kwp)||""} kWh/kWp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="continue-btn" ${a.location?"":"disabled"}>
          Continue
        </button>
      </div>
    </div>
  `;const i=document.getElementById("location-select"),t=document.getElementById("continue-btn"),c=document.getElementById("location-info");i.addEventListener("change",()=>{const u=s.find(p=>p.state===i.value);u?(O({location:u}),document.getElementById("loc-zone").textContent=u.zone,document.getElementById("loc-psh").textContent=`${u.daily_yield_kwh_per_kwp} hrs/day`,document.getElementById("loc-yield").textContent=`${u.annual_yield_kwh_per_kwp} kWh/kWp`,c.style.display="block",t.disabled=!1):(O({location:null}),c.style.display="none",t.disabled=!0)}),t.addEventListener("click",()=>{M().location&&n("step2")})}function St({cards:e,selected:n,name:a}){return`
    <div class="radio-cards" data-radio-group="${a}">
      ${e.map(s=>`
        <div class="radio-card ${n===s.id?"selected":""}" data-value="${s.id}">
          <div class="radio-card__radio"></div>
          <div class="radio-card__img-placeholder">${s.emoji||"⚡"}</div>
          ${s.label?`<div class="radio-card__label">${s.label}</div>`:""}
          <div class="radio-card__name">${s.name}</div>
          ${s.desc?`<div class="radio-card__desc">${s.desc}</div>`:""}
          ${s.extra||""}
        </div>
      `).join("")}
    </div>
  `}function Et(e,n){const a=document.querySelector(`[data-radio-group="${e}"]`);a&&a.querySelectorAll(".radio-card").forEach(s=>{s.addEventListener("click",()=>{a.querySelectorAll(".radio-card").forEach(i=>i.classList.remove("selected")),s.classList.add("selected"),n&&n(s.dataset.value)})})}const We=[{id:"grid_only",emoji:"⚡",name:"Grid Only",desc:"I rely solely on NEPA/DisCo grid supply"},{id:"generator_only",emoji:"🔌",name:"Generator Only",desc:"No grid, I run a generator for power"},{id:"both",emoji:"🔋",name:"Grid + Generator",desc:"I use both grid and a backup generator"}];function Pe(e,n){const a=M();e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${tt(2)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <div class="step-head">
          <div>
            <h1 class="step-title">What is your current power source?</h1>
            <p class="step-subtitle">Select how you currently power your home, and we'll move you straight to the next step</p>
          </div>
          <span style="font-size:72px">⚡</span>
        </div>

        ${St({cards:We,selected:a.powerSource,name:"power-source"})}
      </div>

      <div class="step-footer">
        <div style="width:1px"></div>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>n("step1")),Et("power-source",s=>{O({powerSource:s}),n(s==="generator_only"?"step4":"step3")})}function dt(e){return"₦"+Number(e).toLocaleString("en-NG")}function oe(e){return(14-e/100*28).toFixed(1)}function $t({id:e,value:n,min:a,max:s,step:i=1e3,ticks:t,label:c="per month",formatFn:o=dt}){const l=(n-a)/(s-a)*100,r=oe(l),u=t?t.map((p,y)=>{const x=(p-a)/(s-a)*100,d=n>=(y===0?a:t[y-1])&&n<=p,v=y===0?"translateX(0)":y===t.length-1?"translateX(-100%)":"translateX(-50%)";return`<span class="slider-tick ${d?"active":""}" data-val="${p}" style="left:${x}%;transform:${v}">${o(p)}</span>`}).join(""):"";return`
    <div class="slider-wrapper">
      <div style="text-align:center;margin-bottom:16px">
        <div class="slider-bubble">
          <span class="slider-bubble__val" id="${e}-val">${o(n)}</span>
          <span class="slider-bubble__label">${c}</span>
        </div>
      </div>
      <div class="slider-track-wrap">
        <div class="slider-tooltip" id="${e}-tooltip" style="left:calc(${l}% + ${r}px)">
          <span class="slider-tooltip__val">${o(n)}</span>
          <div class="slider-tooltip__arrow"></div>
        </div>
        <input
          type="range"
          class="sunova-slider"
          id="${e}"
          min="${a}"
          max="${s}"
          step="${i}"
          value="${n}"
          style="background: linear-gradient(to right, var(--color-primary) ${l}%, var(--color-border) ${l}%)"
        />
        ${t?`<div class="slider-ticks">${u}</div>`:""}
      </div>
    </div>
  `}function Ct(e,n=dt,a){const s=document.getElementById(e),i=document.getElementById(`${e}-val`),t=document.getElementById(`${e}-tooltip`);if(!s||!i)return;function c(){const o=Number(s.value),l=Number(s.min),r=Number(s.max),u=(o-l)/(r-l)*100,p=oe(u);if(s.style.background=`linear-gradient(to right, var(--color-primary) ${u}%, var(--color-border) ${u}%)`,i.textContent=n(o),t){t.style.left=`calc(${u}% + ${p}px)`;const x=t.querySelector(".slider-tooltip__val");x&&(x.textContent=n(o))}a&&a(o);const y=s.closest(".slider-track-wrap").querySelectorAll(".slider-tick");if(y.length>0){const x=Array.from(y).map(d=>Number(d.dataset.val));y.forEach((d,v)=>{const h=v===0?l:x[v-1];d.classList.toggle("active",o>=h&&o<=x[v])})}}if(s.addEventListener("input",c),s.addEventListener("change",c),t){const o=()=>t.classList.add("visible"),l=()=>t.classList.remove("visible");s.addEventListener("mousedown",o),s.addEventListener("touchstart",o,{passive:!0}),document.addEventListener("mouseup",l),document.addEventListener("touchend",l)}}function le(e,n,a,s,i){const{gridSpend:t=0,fuelSpend:c=0,tariffBand:o,generatorSize:l,powerSource:r,location:u,appliances:p=[],customSchedule:y}=e;let x=0;if(t>0&&o&&r!=="generator_only"){const m=(a||[]).find(E=>E.band===o),f=(m==null?void 0:m.tariff_naira_per_kwh)||0;f>0&&(x=t/f/30)}let d=0;if(c>0&&l&&r!=="grid_only"){const{fuelTypeStr:m,kwhPerLitre:f}=Te(l,i),E=(u==null?void 0:u.state)||"",I=Ie(m,E,s);I>0&&f>0&&(d=c/I*f/30)}let v=x+d;v<1&&(v=Re(p,n));const h={};(n||[]).forEach(m=>{h[m.name]=m});const g={};(p||[]).forEach(m=>{g[m.name]=m.qty||1});const k=new Array(24).fill(0);y&&y.length>0&&y.forEach(m=>{const f=h[m.name];if(!f)return;const E=g[m.name]||1,I=f.rated_watts*E/1e3;(m.segments||[]).forEach(W=>{const _=W.start??W.start_hour??0,C=W.end??W.end_hour??0;for(let L=0;L<24;L++)Math.min(C,L+1)-Math.max(_,L)>0&&(k[L]+=I)})});const b=k.reduce((m,f)=>m+f,0),$=v;b>0&&(v=b);const S=b>0?k.map(m=>parseFloat(m.toFixed(3))):new Array(24).fill(parseFloat((v/24).toFixed(3))),F=Math.max(0,v-b);let A,R;if(b===0||$===0)A=30,R="Low";else{const m=Math.min(b/$,1);m>=.85?(A=Math.min(99,Math.round(90+m*10)),R="High"):m>=.6?(A=Math.min(99,Math.round(60+m*30)),R="Medium"):(A=Math.min(99,Math.round(m*100)),R="Low")}const B=S.reduce((m,f,E)=>f>S[m]?E:m,0),w=parseFloat(S[B].toFixed(2));return{totalDailyKWh:parseFloat(v.toFixed(2)),dailyGridKWh:parseFloat(x.toFixed(2)),dailyGenKWh:parseFloat(d.toFixed(2)),ganttTotalKWh:parseFloat(b.toFixed(2)),unaccountedKWh:parseFloat(F.toFixed(2)),hourlyProfile:S,ganttHourly:k.map(m=>parseFloat(m.toFixed(3))),peakHour:B,peakKW:w,confidenceScore:A,confidenceLabel:R,monthlyKWh:parseFloat((v*30).toFixed(1))}}function Te(e,n){const a={small:{fuelTypeStr:"PMS",kwhPerLitre:2.27},medium:{fuelTypeStr:"PMS",kwhPerLitre:3.38},large:{fuelTypeStr:"AGO",kwhPerLitre:3.71}};if(!n||n.length===0)return a[e]||a.medium;const s={small:{types:["Small Portable"],preferFuel:"PMS"},medium:{types:["Mid-size"],preferFuel:"PMS"},large:{types:["Mid-size","Large Home"],preferFuel:"AGO"}},i=s[e]||s.medium;let t=n.filter(o=>i.types.includes(o.type)&&o.fuel_type.includes(i.preferFuel));if(t.length===0&&(t=n.filter(o=>i.types.includes(o.type))),t.length===0)return a[e]||a.medium;const c=t.reduce((o,l)=>o+l.kwh_per_litre,0)/t.length;return{fuelTypeStr:i.preferFuel,kwhPerLitre:c}}function Ie(e,n,a){const s={AGO:1380,PMS:1050};if(!a||a.length===0)return s[e]||1100;const i=e==="AGO"?"AGO":"PMS",t=a.filter(o=>o.fuel_type.includes(i));if(t.length===0)return s[e]||1100;const c=t.find(o=>o.state.toLowerCase()===n.toLowerCase());return c?c.price_per_litre_naira:Math.round(t.reduce((o,l)=>o+l.price_per_litre_naira,0)/t.length)}function Re(e,n){if(!e||e.length===0)return 5;const a={};(n||[]).forEach(i=>{a[i.name]=i});let s=0;return e.forEach(i=>{const t=a[i.name];t&&(s+=t.daily_wh*(i.qty||1)/1e3)}),Math.max(2,s)}const ft=400,Kt=.75,Oe=.8,ze=6.5,bt=[3,5,7.5,10,12.5,15,20,25,30],De=25e4,Ge=6e4,Ke=15e4;function re(e,n){const a=e.totalDailyKWh,s=e.peakKW,i=(n==null?void 0:n.daily_yield_kwh_per_kwp)||4.5,t=(n==null?void 0:n.annual_yield_kwh_per_kwp)||1642,c=a/(i*Kt),o=a*365/t,l=Math.max(c,o),r=Math.ceil(l*1e3/ft),u=parseFloat((r*ft/1e3).toFixed(2)),p=s/Oe,y=bt.find(k=>k>=p)??bt[bt.length-1],x=parseFloat((u*ze).toFixed(1)),d=Math.round(u*t),h=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(k=>{var b;return{month:k,kwh:Math.round(u*(((b=n==null?void 0:n.monthly)==null?void 0:b[k.toLowerCase()])||i)*30*Kt)}}),g=Math.round(u*De+y*Ge+Ke);return{panel_kwp:u,panel_count:r,inverter_kva:y,installation_m2:x,annual_gen_kwh:d,monthly_gen:h,estimated_cost:g,psh:i,pvKWp_required:parseFloat(l.toFixed(2)),method1_kWp:parseFloat(c.toFixed(2)),method2_kWp:parseFloat(o.toFixed(2)),panelWattage:ft}}const _t=.8,Ht=.95,Nt=18,qt=23,xt=[5,10,15,20,25,30,40,50,60,80,100],He={reduce_bill:4,backup:8,offgrid:16},Ne=.25,qe=.6;function de(e,n,a){const s=e.peakKW||1,i=e.totalDailyKWh||1,t=e.hourlyProfile||[],c=n==="backup"&&a>0?a:He[n]??4,o=t.slice(Nt,qt+1),l=o.reduce((b,$)=>b+$,0);let r=o.length>0?l/o.length:0;r===0&&(r=s*.6);const u=n==="offgrid"?i:r*c,y=u/_t/Ht,x=xt.find(b=>b>=y)??xt[xt.length-1],d=parseFloat((x*_t*Ht).toFixed(2)),v=s>0?Math.min(24,Math.round(d/(s*Ne))):24,h=s>0?Math.min(24,Math.round(d/(s*qe))):24,g=s>0?Math.min(24,Math.round(d/s)):24,k=Math.ceil(x/5);return{battery_kwh:x,battery_units_48v:k,storage_capacity:x,storage_output:parseFloat(r.toFixed(2)),backup_hours_essentials:v,backup_hours_appliances:h,backup_hours_whole_home:g,backupHours:c,avgBackupLoad_kW:parseFloat(r.toFixed(2)),energyNeeded_kWh:parseFloat(u.toFixed(2)),batteryKWh_gross:parseFloat(y.toFixed(2)),batteryKWh_recommended:x,dod:_t,backupWindowStart:Nt,backupWindowEnd:qt}}function ce({hourlyProfile:e,pvKWp:n,batteryKWh:a,dailyYield:s,dod:i=.8,batteryEfficiency:t=.95,initialSoC:c=.5,energyMix:o="grid_and_generator",sunriseHour:l=6,sunsetHour:r=18}){const u=Array.from({length:24},(m,f)=>{const E=(f-l)/(r-l)*Math.PI;return E>0&&E<Math.PI?Math.sin(E):0}),p=u.reduce((m,f)=>m+f,0),y=u.map(m=>p>0?n*s*m/p:0),x=a,d=a*(1-i);let v=c*a;const h=Array.from({length:24},(m,f)=>{const E=e[f]||0,I=y[f],W=Math.min(I,E),_=Math.max(0,I-E),C=Math.max(0,E-I),L=Math.min(_,(x-v)/t);v+=L*t;const T=L,D=Math.max(0,v-d),G=Math.min(C,D*t);v-=G/t;const H=G,Y=C-G;return{hour:f,demand:parseFloat(E.toFixed(3)),solar_to_load:parseFloat(W.toFixed(3)),battery_to_load:parseFloat(H.toFixed(3)),grid_to_load:parseFloat(Y.toFixed(3)),solar_to_charge:parseFloat(T.toFixed(3)),soc_end:parseFloat(v.toFixed(3)),soc_pct:parseFloat((v/a*100).toFixed(1))}}),g=h.reduce((m,f)=>m+f.demand,0),k=h.reduce((m,f)=>m+f.solar_to_load,0),b=h.reduce((m,f)=>m+f.battery_to_load,0),$=h.reduce((m,f)=>m+f.grid_to_load,0),S=h.reduce((m,f)=>m+f.solar_to_charge,0),F=1,A=g>0?$/g:0,R=parseFloat(S.toFixed(2)),B=parseFloat($.toFixed(2)),w=o==="grid_only"?"Grid":o==="generator_only"?"Generator":"Grid+Gen";return{hours:h,totalDemand:parseFloat(g.toFixed(2)),totalSolarToLoad:parseFloat(k.toFixed(2)),totalBatteryToLoad:parseFloat(b.toFixed(2)),totalGridToLoad:parseFloat($.toFixed(2)),totalSolarCharge:parseFloat(S.toFixed(2)),gridReliance_before:F,gridReliance_after:parseFloat(A.toFixed(2)),dailySurplusKWh:R,avgDailyGridKWh:B,gridLabel:w}}const je=26e4,jt=28e4,Ve=2e5,Ye=.15,Ue=10,j=25,Vt=.005,Xe=.07,Yt=.43,Je=.65,Qe=.7,Ut={small:{types:["Small Portable"],preferFuel:"PMS",defaultKwh:2.27},medium:{types:["Mid-size"],preferFuel:"PMS",defaultKwh:3.38},large:{types:["Mid-size","Large Home"],preferFuel:"AGO",defaultKwh:3.71}};function Ze(e,n){const a=Ut[e]||Ut.medium,s=n||[];let i=s.filter(c=>a.types.includes(c.type)&&c.fuel_type.includes(a.preferFuel));i.length||(i=s.filter(c=>a.types.includes(c.type)));const t=i.length?i.reduce((c,o)=>c+o.kwh_per_litre,0)/i.length:a.defaultKwh;return{fuelTypeStr:a.preferFuel,kwhPerLitre:t}}function ta(e,n,a){const s={AGO:1380,PMS:1050};if(!(a!=null&&a.length))return s[e]||1100;const i=e==="AGO"?"AGO":"PMS",t=a.filter(o=>o.fuel_type.includes(i));if(!t.length)return s[e]||1100;const c=t.find(o=>{var l;return((l=o.state)==null?void 0:l.toLowerCase())===(n||"").toLowerCase()});return c?c.price_per_litre_naira:Math.round(t.reduce((o,l)=>o+l.price_per_litre_naira,0)/t.length)}function ea({load:e,solar:n,battery:a,dispatch:s,tariffData:i,fuelPrices:t,genData:c,state:o}){var Pt,Tt,It;const l=e.totalDailyKWh,r=e.monthlyKWh??e.totalDailyKWh*30,u=e.dailyGridKWh||0,p=e.dailyGenKWh||0,y=n.panel_kwp,x=n.inverter_kva,d=((Pt=o.location)==null?void 0:Pt.annual_yield_kwh_per_kwp)||(((Tt=o.location)==null?void 0:Tt.daily_yield_kwh_per_kwp)||4.5)*365,v=a.battery_kwh,h=o.powerSource||"grid_only",g=o.goal||"reduce_bill",k=o.budget||0,b=i==null?void 0:i.find(K=>K.band===o.tariffBand),$=(b==null?void 0:b.tariff_naira_per_kwh)||194,{fuelTypeStr:S,kwhPerLitre:F}=Ze(o.generatorSize,c),A=((It=o.location)==null?void 0:It.state)||"",R=ta(S,A,t),B=h!=="grid_only"?Math.round(R/F):0,w=Math.round(y*je+v*jt+x*Ve),m=Math.round(w*Ye),f=w+m,E=Math.round(v*jt),I=k>0?f<=k:!0,W=Math.max(0,k-f),_=Math.max(0,f-k),C=u+p;let L,T;C>0?(L=u/C,T=p/C):h==="grid_only"?(L=1,T=0):h==="generator_only"?(L=0,T=1):(L=.5,T=.5);let D;h==="grid_only"?D=$:h==="generator_only"?D=B:D=Math.round(L*$+T*B);const G=Math.round(D*r),H=y*d*((1-Math.pow(1-Vt,j))/Vt),V=H>0?Math.round((f+E)/H):45,{totalDemand:Y,totalSolarToLoad:he,totalBatteryToLoad:fe,totalGridToLoad:be}=s,et=Y>0?(he+fe)/Y:0,Ft=Y>0?be/Y:1-et,mt=Ft*L,at=Ft*T;let U;g==="offgrid"?U=V:h==="grid_only"?U=Math.round(et*V+mt*$):h==="generator_only"?U=Math.round(et*V+at*B):U=Math.round(et*V+mt*$+at*B);const Lt=Math.round(U*r),Mt=G-Lt,st=Mt*12,_e=st>0?parseFloat((f/st).toFixed(1)):99,gt=st*j,xe=Math.round((gt-f-E)/f*100),At=f+E,ke=gt>0&&At>0?parseFloat(((Math.pow(gt/At,1/j)-1)*100).toFixed(1)):0;let yt=0,Bt=0;if(h!=="grid_only"){const Rt=Math.max(0,p-at*l)*365;yt=F>0?Math.round(Rt/F):0,Bt=Math.round(yt*R)}let ct;const Wt=S==="AGO"?Qe:Je;h==="grid_only"?ct=Yt:h==="generator_only"?ct=Wt:ct=L*Yt+T*Wt;const we=y*d,Se=parseFloat((we*ct/1e3).toFixed(1));let X=-f,J=-1,pt=null;const ht=[{year:0,cumulative:X}];for(let K=1;K<=j;K++){const Ot=st*Math.pow(1+Xe,K)-(K===Ue?E:0),zt=X;X+=Ot,J===-1&&zt<0&&X>=0&&(J=K,pt=parseFloat((K-1+Math.abs(zt)/Ot).toFixed(1))),ht.push({year:K,cumulative:Math.round(X)})}J===-1&&(X>=0?(J=j,pt=j):(J=99,pt=99));const Ee=h==="grid_only"?"Grid":h==="generator_only"?"Generator":"Grid + Gen",$e=g==="offgrid"?"Solar":at>.01?"Solar + Grid + Gen":"Solar + Grid";return{total_system_cost:f,equipment_cost:w,bos_cost:m,battery_replacement_cost:E,isWithinBudget:I,budgetSurplus:W,budgetShortfall:_,current_blended_cost:D,post_solar_blended_cost:U,LCOE:V,gen_cost_per_kwh:B,current_monthly_cost:G,post_solar_monthly_cost:Lt,monthly_savings:Mt,annual_savings:st,simple_payback_years:_e,ROI:xe,annualised_ROI:ke,lifetime_savings:ht[j].cumulative,litres_saved_per_year:yt,fuel_naira_saved_annual:Bt,co2_avoided_tonnes:Se,solar_fraction:parseFloat(et.toFixed(3)),grid_fraction:parseFloat(mt.toFixed(3)),gen_fraction:parseFloat(at.toFixed(3)),cashflow:ht,payback_year_index:J,payback_exact:pt,current_label:Ee,solar_label:$e}}function rt(){var u;const e=M(),n=z("appliances")||[],a=z("tariff_bands")||[],s=z("fuel_prices")||[],i=z("generator_efficiency")||[],t=le(e,n,a,s,i),c=re(t,e.location),o=de(t,e.goal,e.backupHours),l=ce({hourlyProfile:t.hourlyProfile,pvKWp:c.panel_kwp,batteryKWh:o.battery_kwh,dailyYield:((u=e.location)==null?void 0:u.daily_yield_kwh_per_kwp)||4.5,energyMix:e.powerSource}),r=ea({load:t,solar:c,battery:o,dispatch:l,tariffData:a,fuelPrices:s,genData:i,state:e});O({results:{load:t,solar:c,battery:o,dispatch:l,savings:r}})}function pe(e,n){var o,l,r;const a=M(),s=z("tariff_bands")||[],t=a.powerSource==="grid_only"?"Generate Results":"Continue";function c(){M().powerSource==="grid_only"?(rt(),n("costSavings")):n("step4")}e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${tt(3)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <div class="step-head">
          <div>
            <h1 class="step-title">How much do you spend on grid electricity monthly?</h1>
            <p class="step-subtitle">Enter your average monthly NEPA/DisCo bill</p>
          </div>
          <span style="font-size:72px">💡</span>
        </div>

        <div class="section-title" style="margin-bottom:12px">What is your electricity tariff band?</div>
        <div class="tariff-pills" id="tariff-pills">
          ${s.map(u=>`
            <button class="tariff-pill ${a.tariffBand===u.band?"selected":""}" data-band="${u.band}">
              ${u.band}
            </button>
          `).join("")}
        </div>
        ${a.tariffBand?`
          <div class="card" style="margin-bottom:20px;background:var(--color-primary-bg);border-color:var(--color-primary-light);padding:12px 16px">
            <div style="display:flex;align-items:center;gap:16px">
              <div class="tag tag--amber">${a.tariffBand}</div>
              <div style="font-size:13px;color:var(--color-text-secondary)" id="tariff-desc">
                ${((o=s.find(u=>u.band===a.tariffBand))==null?void 0:o.customer_type)||""}
                , ${((l=s.find(u=>u.band===a.tariffBand))==null?void 0:l.hours_of_supply)||""} hrs supply/day
                , ₦${((r=s.find(u=>u.band===a.tariffBand))==null?void 0:r.tariff_naira_per_kwh)||""}/kWh
              </div>
            </div>
          </div>
        `:'<div id="tariff-desc"></div>'}

        <div class="section-title" style="margin-bottom:12px">Monthly grid spend</div>
        ${$t({id:"grid-spend-slider",value:a.gridSpend,min:1e4,max:1e6,step:1e4,ticks:[1e4,25e4,5e5,75e4,1e6],label:"per month"})}
      </div>

      <div class="step-footer">
        <button class="btn btn--outline btn--lg" id="skip-btn">Skip</button>
        <button class="btn btn--primary btn--lg" id="continue-btn" ${a.tariffBand?"":"disabled"}>${t}</button>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>n("step2")),document.getElementById("skip-btn").addEventListener("click",c),document.getElementById("continue-btn").addEventListener("click",c),document.querySelectorAll(".tariff-pill").forEach(u=>{u.addEventListener("click",()=>{const p=u.dataset.band;O({tariffBand:p}),pe(e,n)})}),Ct("grid-spend-slider",dt,u=>O({gridSpend:u}))}const aa=`<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="7" y="22" width="50" height="32" rx="5" fill="#1F2937"/>
  <path d="M21 22 L21 15 Q32 11 43 15 L43 22" stroke="#374151" stroke-width="3" stroke-linecap="round" fill="none"/>
  <rect x="11" y="27" width="19" height="20" rx="3" fill="#374151"/>
  <rect x="13" y="30" width="9" height="7" rx="1.5" fill="#4B5563"/>
  <circle cx="16.5" cy="32.5" r="1.2" fill="#9CA3AF"/>
  <circle cx="20" cy="32.5" r="1.2" fill="#9CA3AF"/>
  <circle cx="18.2" cy="35.5" r="1.2" fill="#9CA3AF"/>
  <circle cx="24" cy="43" r="3" fill="#FCBF1E"/>
  <rect x="34" y="27" width="19" height="20" rx="3" fill="#374151"/>
  <rect x="36" y="30" width="15" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="36" y="34" width="15" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="36" y="38" width="15" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="36" y="42" width="15" height="1.8" rx="0.9" fill="#4B5563"/>
  <rect x="9" y="51" width="46" height="3.5" rx="1.5" fill="#374151"/>
</svg>`,sa=`<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="14" width="54" height="42" rx="4" stroke="#DC2626" stroke-width="3" fill="none"/>
  <line x1="5" y1="23" x2="59" y2="23" stroke="#DC2626" stroke-width="2.5"/>
  <rect x="11" y="27" width="22" height="22" rx="3" fill="#6B7280"/>
  <rect x="13" y="22" width="9" height="7" rx="2" fill="#4B5563"/>
  <circle cx="20" cy="32" r="5" fill="#4B5563"/>
  <circle cx="20" cy="32" r="2.5" fill="#6B7280"/>
  <rect x="27" y="30" width="2.5" height="16" rx="1" fill="#9CA3AF"/>
  <rect x="31" y="30" width="2.5" height="16" rx="1" fill="#9CA3AF"/>
  <rect x="37" y="15" width="16" height="9" rx="3" fill="#374151"/>
  <circle cx="45" cy="14" r="3.5" fill="#4B5563"/>
  <rect x="37" y="28" width="16" height="20" rx="2" fill="#374151"/>
  <rect x="39" y="31" width="8" height="5" rx="1" fill="#4B5563"/>
  <circle cx="39.5" cy="33.5" r="1" fill="#9CA3AF"/>
  <circle cx="42.5" cy="33.5" r="1" fill="#9CA3AF"/>
  <circle cx="41" cy="44" r="3.5" fill="#FCBF1E"/>
  <circle cx="13" cy="56" r="5" fill="#374151"/>
  <circle cx="13" cy="56" r="2.5" fill="#6B7280"/>
  <circle cx="51" cy="56" r="5" fill="#374151"/>
  <circle cx="51" cy="56" r="2.5" fill="#6B7280"/>
</svg>`,ia=`<svg viewBox="0 0 64 64" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="20" width="58" height="36" rx="4" fill="#1F2937"/>
  <rect x="3" y="16" width="58" height="6" rx="3" fill="#374151"/>
  <rect x="3" y="20" width="58" height="4" fill="#FCBF1E"/>
  <rect x="40" y="6" width="6" height="12" rx="3" fill="#4B5563"/>
  <rect x="38" y="4" width="10" height="5" rx="2" fill="#374151"/>
  <rect x="7" y="28" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="7" y="32" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="7" y="36" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="7" y="40" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="7" y="44" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="27" y="27" width="10" height="25" rx="2" fill="#374151"/>
  <rect x="29" y="30" width="6" height="5" rx="1" fill="#111827"/>
  <rect x="30" y="31" width="4" height="1.2" rx="0.6" fill="#FCBF1E"/>
  <rect x="30" y="33" width="3" height="1.2" rx="0.6" fill="#10B981"/>
  <rect x="29" y="37" width="6" height="3" rx="1" fill="#4B5563"/>
  <circle cx="32" cy="46" r="3.5" fill="#FCBF1E"/>
  <rect x="41" y="28" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="41" y="32" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="41" y="36" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="41" y="40" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="41" y="44" width="16" height="2" rx="1" fill="#374151"/>
  <rect x="1" y="54" width="62" height="7" rx="2" fill="#374151"/>
  <rect x="7" y="54" width="5" height="7" fill="#4B5563"/>
  <rect x="52" y="54" width="5" height="7" fill="#4B5563"/>
</svg>`,na=[{id:"small",emoji:aa,label:"I better pass my neighbour",name:"Small (1–2 KVA)"},{id:"medium",emoji:sa,label:"Gasoline generator",name:"Medium (3–5 KVA)"},{id:"large",emoji:ia,label:"Silent diesel generator",name:"Large (6–10 KVA)"}];function oa(e,n){const a=M();e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${tt(4)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <div class="step-head">
          <div>
            <h1 class="step-title">How much do you spend on fuel monthly?</h1>
            <p class="step-subtitle">Select an estimate and choose your generator size</p>
          </div>
          <span style="font-size:88px">🔋</span>
        </div>

        ${$t({id:"fuel-spend-slider",value:a.fuelSpend,min:1e4,max:1e6,step:1e4,ticks:[1e4,25e4,5e5,75e4,1e6],label:"per month"})}

        <div class="section-title" style="margin-top:28px;margin-bottom:16px">Choose your generator size</div>
        ${St({cards:na,selected:a.generatorSize,name:"gen-size"})}
      </div>

      <div class="step-footer">
        <button class="btn btn--outline btn--lg" id="skip-btn">Skip</button>
        <button class="btn btn--primary btn--lg" id="continue-btn" ${a.generatorSize?"":"disabled"}>Generate Results</button>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>{n(M().powerSource==="generator_only"?"step2":"step3")}),document.getElementById("skip-btn").addEventListener("click",()=>{rt(),n("costSavings")}),document.getElementById("continue-btn").addEventListener("click",()=>{rt(),n("costSavings")}),Ct("fuel-spend-slider",dt,s=>O({fuelSpend:s})),Et("gen-size",s=>{O({generatorSize:s}),document.getElementById("continue-btn").disabled=!1})}function la(e){const n=document.getElementById("modal-root");n.innerHTML=`<div class="modal-overlay" id="modal-overlay">${e}</div>`,n.querySelector("#modal-overlay").addEventListener("click",a=>{a.target===a.currentTarget&&vt()}),document.addEventListener("keydown",ue)}function vt(){const e=document.getElementById("modal-root");e.innerHTML="",document.removeEventListener("keydown",ue)}function ue(e){e.key==="Escape"&&vt()}function ra({title:e,subtitle:n="",body:a,footer:s}){return`
    <div class="modal">
      <div class="modal__header">
        <div>
          <div class="modal__title">${e}</div>
          ${n?`<div class="modal__subtitle">${n}</div>`:""}
        </div>
        <button class="modal__close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal__body">${a}</div>
      ${`<div class="modal__footer">${s}</div>`}
    </div>
  `}function da(){var e;(e=document.getElementById("modal-close-btn"))==null||e.addEventListener("click",vt)}const Xt=["Work From Home","Office Worker","Night Shift","Stay-at-Home","Student","Weekend"],ca={Cooling:"#3B82F6",Lighting:"#FCBF1E",Kitchen:"#F59E0B",Entertainment:"#8B5CF6","ICT / Office":"#06B6D4",Laundry:"#10B981",Water:"#0EA5E9",Security:"#EF4444"};function pa(e,n){switch(n){case"Cooling":return/fan/i.test(e)?"Ceiling Fan":/\b1hp\b/i.test(e)?"AC – Bedroom":"AC – Living Room";case"Lighting":return"Lighting";case"Entertainment":return"Television";case"ICT / Office":return"Laptop / PC";case"Laundry":return/washing/i.test(e)?"Washing Machine":null;case"Kitchen":return/refrig|freezer/i.test(e)?"Refrigerator":/kettle/i.test(e)?"Electric Kettle":null;case"Water":return/pump/i.test(e)?"Water Pump":null;default:return null}}function ua(e){const n=[];let a=!1,s=0;for(let i=0;i<24;i++)e[i]>=.5&&!a?(a=!0,s=i):e[i]<.5&&a&&(n.push({start:s,end:i}),a=!1);return a&&n.push({start:s,end:24}),n.length?n:[{start:8,end:10}]}function Jt(e,n,a){if(!a)return[{start:8,end:10}];const s=pa(e,n),i=s&&a.schedule[s];return i?ua(i):[{start:8,end:10}]}function ut(e){return Math.round(e*2)/2}function it(e){const n=Math.floor(e)%24;return n===0?"12am":n<12?`${n}am`:n===12?"12pm":`${n-12}pm`}const P={active:!1,type:null,rowIdx:null,segIdx:null,startX:null,origStart:null,origEnd:null,trackWidth:null};function va(e,n){const a=document.getElementById(e);if(!a)return()=>{};const s=z("usage_patterns")||[];let i=M().usagePattern||Xt[0];const t=M().customSchedule||[],c=Object.fromEntries(t.map(d=>[d.name,d])),o=s.find(d=>d.pattern===i);let l=n.map(d=>c[d.name]?{...c[d.name],segments:c[d.name].segments.map(v=>({...v}))}:{name:d.name,category:d.category||"",segments:Jt(d.name,d.category||"",o)});function r(){O({customSchedule:l.map(d=>({...d,segments:d.segments.map(v=>({...v}))}))})}function u(){const d=a.querySelector(".gantt-body");d&&(d.innerHTML=l.map((v,h)=>{const g=ca[v.category]||"#9CA3AF",k=v.segments.map((b,$)=>{const S=(b.start/24*100).toFixed(3),F=Math.max(.5,(b.end-b.start)/24*100).toFixed(3);return`
          <div class="gantt-bar" data-ri="${h}" data-si="${$}"
               style="left:${S}%;width:${F}%;background:${g}">
            <div class="gantt-bar__handle gantt-bar__handle--left" data-type="resize-left"></div>
            <div class="gantt-bar__label">${it(b.start)}–${it(b.end)}</div>
            <div class="gantt-bar__del" title="Remove">×</div>
            <div class="gantt-bar__handle gantt-bar__handle--right" data-type="resize-right"></div>
          </div>`}).join("");return`
        <div class="gantt-row">
          <div class="gantt-row__label" title="${v.name}">${v.name}</div>
          <div class="gantt-row__track" data-ri="${h}" style="background:${g}22">${k}</div>
        </div>`}).join(""),p())}function p(){a.querySelectorAll(".gantt-bar__del").forEach(d=>{d.addEventListener("click",v=>{v.stopPropagation();const h=d.closest(".gantt-bar");l[+h.dataset.ri].segments.splice(+h.dataset.si,1),r(),u()})}),a.querySelectorAll(".gantt-bar").forEach(d=>{d.addEventListener("contextmenu",v=>{v.preventDefault(),l[+d.dataset.ri].segments.splice(+d.dataset.si,1),r(),u()}),d.addEventListener("mousedown",v=>{if(v.target.classList.contains("gantt-bar__handle")||v.target.classList.contains("gantt-bar__del"))return;v.preventDefault();const h=+d.dataset.ri,g=+d.dataset.si;P.active=!0,P.type="move",P.rowIdx=h,P.segIdx=g,P.startX=v.clientX,P.origStart=l[h].segments[g].start,P.origEnd=l[h].segments[g].end,P.trackWidth=d.closest(".gantt-row__track").getBoundingClientRect().width})}),a.querySelectorAll(".gantt-bar__handle").forEach(d=>{d.addEventListener("mousedown",v=>{v.preventDefault(),v.stopPropagation();const h=d.closest(".gantt-bar"),g=+h.dataset.ri,k=+h.dataset.si;P.active=!0,P.type=d.dataset.type,P.rowIdx=g,P.segIdx=k,P.startX=v.clientX,P.origStart=l[g].segments[k].start,P.origEnd=l[g].segments[k].end,P.trackWidth=h.closest(".gantt-row__track").getBoundingClientRect().width})}),a.querySelectorAll(".gantt-row__track").forEach(d=>{d.addEventListener("click",v=>{if(v.target!==d)return;const h=+d.dataset.ri,g=d.getBoundingClientRect(),k=ut((v.clientX-g.left)/g.width*24),b=Math.max(0,Math.min(22,k));l[h].segments.push({start:b,end:Math.min(24,b+2)}),r(),u()})})}function y(d){if(!P.active)return;const v=(d.clientX-P.startX)/P.trackWidth*24,{type:h,rowIdx:g,segIdx:k}=P,b=l[g].segments[k],$=P.origEnd-P.origStart;if(h==="move"){const F=Math.max(0,Math.min(24-$,ut(P.origStart+v)));b.start=F,b.end=F+$}else h==="resize-left"?b.start=Math.max(0,Math.min(P.origEnd-.5,ut(P.origStart+v))):b.end=Math.min(24,Math.max(P.origStart+.5,ut(P.origEnd+v)));const S=a.querySelector(`.gantt-bar[data-ri="${g}"][data-si="${k}"]`);if(S){S.style.left=`${(b.start/24*100).toFixed(3)}%`,S.style.width=`${Math.max(.5,(b.end-b.start)/24*100).toFixed(3)}%`;const F=S.querySelector(".gantt-bar__label");F&&(F.textContent=`${it(b.start)}–${it(b.end)}`)}}function x(){P.active&&(P.active=!1,r())}return document.addEventListener("mousemove",y),document.addEventListener("mouseup",x),a.innerHTML=`
    <div class="gantt-wrap">
      <div class="gantt-header">
        <div class="section-title" style="margin:0">Customise Your Usage Schedule</div>
        <div class="gantt-pattern-row">
          <label class="gantt-pattern-label">Usage pattern</label>
          <select class="gantt-select" id="gantt-pattern-sel">
            ${Xt.map(d=>`<option value="${d}" ${i===d?"selected":""}>${d}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="gantt-timeline-header">
        <div class="gantt-label-col"></div>
        <div class="gantt-hours-track">
          ${[0,3,6,9,12,15,18,21,24].map(d=>`<span class="gantt-hour-label" style="left:${(d/24*100).toFixed(2)}%">${it(d)}</span>`).join("")}
        </div>
      </div>
      <div class="gantt-body"></div>
      <p class="gantt-hint">Drag bars to move · Drag edges to resize · Click empty track to add · Right-click or × to delete</p>
    </div>`,document.getElementById("gantt-pattern-sel").addEventListener("change",d=>{i=d.target.value,O({usagePattern:i});const v=s.find(h=>h.pattern===i);l=l.map(h=>({...h,segments:Jt(h.name,h.category,v)})),r(),u()}),u(),r(),function(){document.removeEventListener("mousemove",y),document.removeEventListener("mouseup",x)}}const wt=e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;"),ve=[{id:"bungalow",emoji:"🏠",name:"Bungalow"},{id:"duplex",emoji:"🏡",name:"Duplex"},{id:"terrace",emoji:"🏘️",name:"Terrace House"}];function ma(e,n){return`
    <div class="radio-cards" id="house-type-cards">
      ${ve.map(a=>`
        <div class="radio-card ${e===a.id?"selected":""}" data-value="${a.id}" style="align-items:center">
          <div class="radio-card__radio"></div>
          <div class="radio-card__img-placeholder">${a.emoji}</div>
          <div class="radio-card__name">${a.name}</div>
          ${e===a.id?`
            <div class="rooms-counter">
              <span class="rooms-counter__label">Rooms</span>
              <button class="rooms-counter__btn" id="rooms-dec">–</button>
              <span class="rooms-counter__val" id="rooms-val">${n}</span>
              <button class="rooms-counter__btn" id="rooms-inc">+</button>
            </div>
          `:""}
        </div>
      `).join("")}
    </div>
  `}function ga(e,n){const a={};n.forEach(i=>{a[i.name]=i}),console.log("[Sunova] Appliance data:",e.length,"items",e.map(i=>i.name));const s=e.map(i=>{const t=a[i.name],c=t?t.qty:0;return`
      <div class="appliance-modal-row">
        <div class="checkbox ${!!t?"checked":""}" data-name="${wt(i.name)}"></div>
        <div class="appliance-modal-row__img-placeholder">
          ${me(i.category)}
        </div>
        <div style="flex:1">
          <div class="appliance-modal-row__name">${i.name}</div>
          <div class="appliance-modal-row__watts">${i.rated_watts}W · ${i.typical_daily_hours}h/day</div>
        </div>
        <div class="counter" data-name="${wt(i.name)}">
          <button class="counter__btn" data-action="dec">−</button>
          <span class="counter__val">${c}</span>
          <button class="counter__btn" data-action="inc">+</button>
        </div>
      </div>
    `}).join("");return ra({title:"Choose specific appliances",subtitle:"You can select multiple appliances",body:s,footer:'<button class="btn btn--primary btn--full" id="add-appliances-confirm">Add Appliances</button>'})}function me(e){return{Cooling:"❄️",Lighting:"💡",Kitchen:"🍳",Entertainment:"📺","ICT / Office":"💻",Laundry:"🫧",Water:"💧",Security:"🔒"}[e]||"🔌"}function ya(e,n){M();const a=z("appliances")||[];let s=null;function i(){var l;s&&(s(),s=null);const o=M();e.innerHTML=`
      <div class="wizard-step">
        <div class="wizard-header">
          <button class="back-btn" id="back-btn">← Back</button>
          ${tt(5)}
          <div style="width:90px"></div>
        </div>

        <div class="step-body">
          <h1 class="step-title">Home profile and appliance catalogue</h1>
          <p class="step-subtitle">Build a home profile to increase confidence</p>

          <div class="section-title" style="margin-bottom:14px">Choose your house type</div>
          ${ma(o.houseType,o.rooms)}

          <div class="section-title" style="margin-top:28px;margin-bottom:12px">Select your home appliances</div>
          <div class="appliances-list" id="appliances-list">
            ${o.appliances.map(r=>`
              <div class="appliance-chip">
                ${me(r.category||"")} ${r.name} ×${r.qty}
                <span class="appliance-chip__remove" data-name="${wt(r.name)}">×</span>
              </div>
            `).join("")}
          </div>
          <div class="add-appliances-box" id="add-appliances-btn">
            <span class="add-appliances-box__icon">＋</span>
            <span class="add-appliances-box__label">Add appliances</span>
          </div>
          ${o.houseType&&o.appliances.length===0?`
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:8px;text-align:center">
              💡 Typical appliances for a <strong>${(l=ve.find(r=>r.id===o.houseType))==null?void 0:l.name}</strong> will be pre-selected, adjust as needed
            </div>
          `:""}

          ${o.appliances.length>0?'<div id="gantt-section" style="margin-top:32px"></div>':""}
        </div>

        <div class="step-footer">
          <button class="btn btn--outline btn--lg" id="skip-btn">Skip</button>
          <button class="btn btn--primary btn--lg" id="continue-btn" ${o.houseType?"":"disabled"}>Continue</button>
        </div>
      </div>
    `,t(),o.appliances.length>0&&(s=va("gantt-section",o.appliances))}function t(){var o,l;document.getElementById("back-btn").addEventListener("click",()=>{s&&(s(),s=null),n(M().results?"costSavings":M().powerSource==="grid_only"?"step3":"step4")}),document.getElementById("skip-btn").addEventListener("click",()=>{s&&(s(),s=null),n("step6")}),document.getElementById("continue-btn").addEventListener("click",()=>{s&&(s(),s=null);const r=M();r.results&&r.appliances.length>0&&rt(),n("step6")}),document.querySelectorAll("#house-type-cards .radio-card").forEach(r=>{r.addEventListener("click",u=>{u.target.closest(".rooms-counter")||(O({houseType:r.dataset.value}),i())})}),(o=document.getElementById("rooms-dec"))==null||o.addEventListener("click",()=>{const r=M();O({rooms:Math.max(0,r.rooms-1)}),document.getElementById("rooms-val").textContent=M().rooms}),(l=document.getElementById("rooms-inc"))==null||l.addEventListener("click",()=>{O({rooms:M().rooms+1}),document.getElementById("rooms-val").textContent=M().rooms}),document.querySelectorAll(".appliance-chip__remove").forEach(r=>{r.addEventListener("click",u=>{u.stopPropagation();const p=r.dataset.name;O({appliances:M().appliances.filter(y=>y.name!==p)}),i()})}),document.getElementById("add-appliances-btn").addEventListener("click",()=>{const r=M(),u=z("house_type_appliances")||{},p=r.houseType&&r.appliances.length===0?u[r.houseType]||[]:r.appliances;la(ga(a,p)),da(),c(a,p)})}function c(o,l){const r={};(l||M().appliances).forEach(p=>{const y=o.find(x=>x.name===p.name);r[p.name]=y?{...y,qty:p.qty||1}:{...p}}),document.querySelectorAll(".appliance-modal-row").forEach(p=>{const y=p.querySelector(".checkbox"),x=p.querySelector(".counter"),d=y.dataset.name,v=o.find(h=>h.name===d);!r[d]&&y.classList.contains("checked")&&(r[d]={...v,qty:1}),y.addEventListener("click",()=>{y.classList.toggle("checked"),y.classList.contains("checked")?(r[d]={...v,qty:parseInt(x.querySelector(".counter__val").textContent)||1},x.querySelector(".counter__val").textContent=r[d].qty):delete r[d]}),x.querySelectorAll(".counter__btn").forEach(h=>{h.addEventListener("click",()=>{const g=x.querySelector(".counter__val");let k=parseInt(g.textContent)||0;h.dataset.action==="inc"?(k++,y.classList.add("checked")):(k=Math.max(0,k-1),k===0&&y.classList.remove("checked")),g.textContent=k,k>0?r[d]={...v,qty:k}:delete r[d]})})}),document.getElementById("add-appliances-confirm").addEventListener("click",()=>{O({appliances:Object.values(r).filter(p=>p.qty>0)}),vt(),i()})}i()}const ha=[{id:"reduce_bill",emoji:"📄",name:"Reduce Bill",desc:"Reduce my monthly bill effectively"},{id:"backup",emoji:"⚡",name:"Backup Power",desc:"Have some backup power"},{id:"offgrid",emoji:"🏡",name:"Off-Grid",desc:"Go completely off-grid"}];function fa(e,n){const a=M();e.innerHTML=`
    <div class="wizard-step">
      <div class="wizard-header">
        <button class="back-btn" id="back-btn">← Back</button>
        ${tt(6)}
        <div style="width:90px"></div>
      </div>

      <div class="step-body">
        <h1 class="step-title">Define your solar goal and financial readiness</h1>
        <p class="step-subtitle">Let us know your goal and how much you're willing to spend</p>

        <div class="section-title" style="margin-bottom:14px">What is your primary goal?</div>
        ${St({cards:ha,selected:a.goal,name:"solar-goal"})}

        <div class="section-title" style="margin-top:28px;margin-bottom:14px">How much are you willing to spend?</div>
        ${$t({id:"budget-slider",value:a.budget,min:1e5,max:5e7,step:1e5,ticks:[1e5,125e5,25e6,375e5,5e7],label:"Total"})}
      </div>

      <div class="step-footer">
        <button class="btn btn--primary btn--lg" id="generate-btn" ${a.goal?"":"disabled"}>Generate Results</button>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>n("step5"));function s(){var c;(c=document.querySelector(".backup-hours-inject"))==null||c.remove();const i=document.querySelector('[data-radio-group="solar-goal"] [data-value="backup"]');if(!i)return;const t=document.createElement("div");t.className="backup-hours-inject",t.style.cssText="margin-top:12px;padding-top:12px;border-top:1.5px solid rgba(0,0,0,0.12);display:flex;justify-content:center",t.innerHTML=`
      <div class="rooms-counter">
        <span class="rooms-counter__label" style="font-size:12px">Backup hrs</span>
        <button class="rooms-counter__btn" id="backup-dec">–</button>
        <span class="rooms-counter__val" id="backup-val">${M().backupHours}</span>
        <button class="rooms-counter__btn" id="backup-inc">+</button>
      </div>`,i.appendChild(t),document.getElementById("backup-dec").addEventListener("click",o=>{o.stopPropagation(),O({backupHours:Math.max(1,M().backupHours-1)}),document.getElementById("backup-val").textContent=M().backupHours}),document.getElementById("backup-inc").addEventListener("click",o=>{o.stopPropagation(),O({backupHours:M().backupHours+1}),document.getElementById("backup-val").textContent=M().backupHours})}Et("solar-goal",i=>{var t;O({goal:i}),document.getElementById("generate-btn").disabled=!1,i==="backup"?s():(t=document.querySelector(".backup-hours-inject"))==null||t.remove()}),M().goal==="backup"&&s(),Ct("budget-slider",dt,i=>O({budget:i})),document.getElementById("generate-btn").addEventListener("click",()=>{rt(),n("costSavings")})}const Qt=e=>"₦"+Number(e).toLocaleString("en-NG"),ba=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],_a={north:[.6,.8,1.3,1.45,1.3,.85,.7,.72,.9,1.1,.75,.6],middle:[.75,.9,1.25,1.35,1.15,.82,.68,.7,.85,1.05,.85,.72],south:[1.1,1.2,1.3,1.2,1,.7,.65,.65,.8,1,1.1,1.05]};function ge(e){return e?/North West|North East/i.test(e)?"north":/North Central/i.test(e)?"middle":"south":"south"}function xa(e,n,a,s){const i={};(a||[]).forEach(d=>{i[d.name]=d});let t=0,c=0;(n||[]).forEach(d=>{const v=i[d.name];if(!v)return;const h=v.rated_watts*(d.qty||1);c+=h,v.category==="Cooling"&&(t+=h)});const o=c>0?t/c:.35,l=_a[ge(s)],r=l.reduce((d,v)=>d+v,0)/12,u=l.map(d=>d/r),p=e.totalDailyKWh,y=p*o,x=p-y;return u.map(d=>parseFloat(((x+y*d)*30).toFixed(1)))}function ka(e,n){const a=M(),s=z("appliances")||[],{results:i,location:t,powerSource:c,tariffBand:o,gridSpend:l,fuelSpend:r,appliances:u}=a;if(!i){n("step1");return}const{load:p,solar:y}=i,x=u&&u.length>0,d={grid_only:"Grid Only",generator_only:"Generator Only",both:"Grid & Generator"}[c]||"Grid & Generator",v={};s.forEach(B=>{v[B.name]=B});let h=0,g=0;(u||[]).forEach(B=>{const w=v[B.name];if(!w)return;const m=w.rated_watts*(B.qty||1);g+=m,w.category==="Cooling"&&(h+=m)});const k=g>0?Math.round(h/g*100):35,b=(t==null?void 0:t.zone)||"",$=ge(b),S={north:"Northern Nigeria: peak cooling March to May, cool harmattan Nov to Feb",middle:"Middle Belt: peak cooling March to May, mild rainy dip Jun to Sep",south:"Southern Nigeria: peak cooling Feb to Apr, rainy season dip Jun to Sep"}[$],F=x?`
    <div class="card">
      <div class="section-title" style="margin-bottom:16px">Energy Consumption</div>
      <div class="chart-header-row" style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px">
        <div style="display:flex;gap:28px;align-items:flex-end">
          <div>
            <div class="label">Daily average</div>
            <div class="kwh-day">${p.totalDailyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
          </div>
          <div>
            <div class="label">Monthly average</div>
            <div style="font-size:24px;font-weight:700;color:var(--color-text)">${p.monthlyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
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
          <div class="kwh-day">${p.totalDailyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
        </div>
        <div>
          <div class="label">Monthly average</div>
          <div style="font-size:24px;font-weight:700;color:var(--color-text)">${p.monthlyKWh} <span style="font-size:14px;font-weight:500;color:var(--color-text-secondary)">kWh</span></div>
        </div>
      </div>
    </div>
  `;if(e.innerHTML=`
    <div style="padding:40px 40px 60px">
      <h1 style="font-size:36px;font-weight:800;margin-bottom:6px">Your Energy Profile</h1>
      <p style="color:var(--color-text-secondary);margin-bottom:32px">See how you consume energy in your house</p>

      <div class="load-profile-grid">
        <div>
          <div class="card" style="margin-bottom:20px">
            <div class="section-title" style="margin-bottom:16px">Assumption Summary</div>
            <div class="assumption-summary">
              <div class="assumption-item">
                <div class="label">Supply</div>
                <div class="value">${d}</div>
              </div>
              ${o&&c!=="generator_only"?`<div class="assumption-item"><div class="label">Tariff</div><div class="tag tag--amber">${o}</div></div>`:""}
              ${l&&c!=="generator_only"?`<div class="assumption-item"><div class="label">Grid Spend</div><div class="value">${Qt(l)}</div></div>`:""}
              ${r&&c!=="grid_only"?`<div class="assumption-item"><div class="label">Generator Spend</div><div class="value">${Qt(r)}</div></div>`:""}
              <div class="assumption-item"><div class="label">Location</div><div class="value">${(t==null?void 0:t.state)||"N/A"}</div></div>
            </div>
          </div>

          <div class="card" style="margin-bottom:20px;background:#FAFAFA;border:none">
            <div class="section-title" style="margin-bottom:12px">Solar Irradiance</div>
            <div class="solar-irradiance-card">
              <div class="irradiance-stats">
                <div class="irradiance-stat-card">
                  <div class="label">Peak Sun Hours</div>
                  <div class="value value--amber" style="font-size:22px;line-height:1.1">${y.psh}</div>
                  <div class="label" style="font-size:10px;margin-top:2px">hrs / day</div>
                </div>
                <div class="irradiance-stat-card">
                  <div class="label">Annual Irradiance</div>
                  <div class="value value--amber" style="font-size:22px;line-height:1.1">${(t==null?void 0:t.annual_yield_kwh_per_kwp)||"N/A"}</div>
                  <div class="label" style="font-size:10px;margin-top:2px">kWh / kWp</div>
                </div>
              </div>
              <div class="irradiance-sun">☀️</div>
            </div>
          </div>

          ${F}
        </div>

        <div>
          <div class="pv-ready-card">
            <div class="pv-ready-card__overlay">
              <h2>Your Solar PV<br>System is <span>Ready</span></h2>
              <p>Get your personalized energy data with accurate recommendation to boost your energy efficiency and overall usage.</p>
              <button class="btn btn--primary" onclick="window._navigate('solarPVSystem')">View Solar PV System</button>
            </div>
          </div>
        </div>
      </div>

      ${x?"":`
        <div class="refine-prompt-card">
          <div class="refine-prompt-card__icon">⚡</div>
          <div class="refine-prompt-card__body">
            <div class="refine-prompt-card__title">Your estimate is based on spending. Make it sharper</div>
            <div class="refine-prompt-card__desc">Right now we derived your energy demand from your monthly bills. Tell us which appliances you run and when, and we'll calculate an hourly load curve, a seasonal monthly forecast, and push your confidence score from Low to High.</div>
            <button class="btn btn--primary" onclick="window._navigate('step5')">Add Appliances &amp; Set Goals →</button>
          </div>
        </div>
      `}
    </div>
  `,window._navigate=n,!x)return;const A=xa(p,u,s,b),R=parseFloat((A.reduce((B,w)=>B+w,0)/12).toFixed(1));Zt(p),kt(`Hourly kWh from your appliance schedule, scaled to match spending data. Confidence: ${p.confidenceLabel} (${p.confidenceScore}%).`),document.getElementById("chart-view-sel").addEventListener("change",function(){this.value==="hourly"?(Zt(p),kt(`Hourly kWh from your appliance schedule, scaled to match spending data. Confidence: ${p.confidenceLabel} (${p.confidenceScore}%).`)):(wa(A,R),kt(`Seasonal estimate: ${k}% of your load is cooling. ${S}.`))})}function kt(e){const n=document.getElementById("chart-caption");n&&(n.textContent=e)}function Zt(e){var t;const n=(t=document.getElementById("load-chart"))==null?void 0:t.getContext("2d");if(!n)return;window._loadChart&&window._loadChart.destroy();const a=Array.from({length:24},(c,o)=>o===0?"12am":o===12?"12pm":o<12?`${o}am`:`${o-12}pm`),s=Math.max(...e.hourlyProfile),i=e.hourlyProfile.map(c=>{const o=c/s;return o>.75?"#EF4444":o>.45?"#F5A623":"#FCD34D"});window._loadChart=new Chart(n,{type:"bar",data:{labels:a,datasets:[{data:e.hourlyProfile,backgroundColor:i,borderRadius:8,borderSkipped:!1,barPercentage:.55,categoryPercentage:.8}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:c=>`${c.raw} kW`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:c=>`${c} kW`}}}}})}function wa(e,n){var i;const a=(i=document.getElementById("load-chart"))==null?void 0:i.getContext("2d");if(!a)return;window._loadChart&&window._loadChart.destroy();const s=e.map(t=>t>=n?"#F5A623":"#93C5FD");window._loadChart=new Chart(a,{type:"bar",data:{labels:ba,datasets:[{type:"bar",data:e,backgroundColor:s,borderRadius:8,borderSkipped:!1,barPercentage:.55,categoryPercentage:.8,order:2},{type:"line",data:new Array(12).fill(n),borderColor:"#6B7280",borderWidth:1.5,borderDash:[4,3],pointRadius:0,fill:!1,order:1,label:"Monthly average"}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:t=>t.datasetIndex===0?`${t.raw} kWh`:`Avg: ${n} kWh`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:t=>`${t}`},title:{display:!0,text:"kWh / month",font:{size:10,family:"Outfit, sans-serif"},color:"#9CA3AF"}}}}})}const Sa=e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;");function Ea(e){return{Cooling:"❄️",Lighting:"💡",Kitchen:"🍳",Entertainment:"📺","ICT / Office":"💻",Laundry:"🫧",Water:"💧",Security:"🔒"}[e]||"🔌"}function te(e){return e>=1e3?`${(e/1e3).toFixed(1)} MWh/yr`:`${e.toLocaleString()} kWh/yr`}function ee(e){return e>=80?"High":e>=60?"Medium":"Low"}function $a(e,n){const{results:a,appliances:s}=M();if(!a){n("step1");return}const i=z("appliances")||[],t=z("tariff_bands")||[],c=z("fuel_prices")||[],o=z("generator_efficiency")||[],l=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],r=s&&s.length>0,u=new Set(s.map(g=>g.name));function p(){var B;const g=M(),k=r?s.filter(w=>u.has(w.name)):s,b=new Set(k.map(w=>w.name)),$={...g,appliances:k,customSchedule:g.customSchedule?g.customSchedule.filter(w=>b.has(w.name)):null},S=le($,i,t,c,o),F=re(S,g.location),A=de(S,g.goal,g.backupHours),R=ce({hourlyProfile:S.hourlyProfile,pvKWp:F.panel_kwp,batteryKWh:A.battery_kwh,dailyYield:((B=g.location)==null?void 0:B.daily_yield_kwh_per_kwp)||4.5,energyMix:g.powerSource});return{load:S,solar:F,battery:A,dispatch:R}}const{load:y,solar:x,battery:d,dispatch:v}=p();e.innerHTML=`
    <div style="padding:40px 40px 60px">
      <div class="card pv-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
          <div>
            <h2 style="font-size:28px;font-weight:800;margin-bottom:4px">Solar PV System</h2>
            <p style="color:var(--color-text-secondary);font-size:13px">Here is the breakdown of your solar PV system</p>
          </div>
          <button class="btn btn--outline btn--sm" onclick="window._navigate('costSavings')">
            ⚙️ View Savings Breakdown
          </button>
        </div>

        <div class="section-title" style="margin-bottom:12px">System Specs</div>
        <div class="system-specs" style="margin-bottom:32px">
          <div class="spec-card">
            <div class="spec-card__label">Solar PV</div>
            <div class="spec-card__value" id="spec-solar-kwp">${x.panel_kwp} kWp</div>
            <div class="spec-card__sub" id="spec-solar-count">Capacity · ${x.panel_count} panels</div>
            <div style="font-size:36px;margin-top:8px">🔆</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Inverter</div>
            <div class="spec-card__value" id="spec-inverter-kva">${x.inverter_kva} kVA</div>
            <div class="spec-card__sub">Rating</div>
            <div style="font-size:36px;margin-top:8px">⚡</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Battery</div>
            <div class="spec-card__value" id="spec-battery-kwh">${d.battery_kwh} kWh</div>
            <div class="spec-card__sub" id="spec-battery-units">Storage · ${d.battery_units_48v} units</div>
            <div style="font-size:36px;margin-top:8px">🔋</div>
          </div>
          <div class="spec-card">
            <div class="spec-card__label">Installation Space</div>
            <div class="spec-card__value" id="spec-area-m2">${x.installation_m2} m²</div>
            <div class="spec-card__sub">Required</div>
            <div style="font-size:36px;margin-top:8px">📐</div>
          </div>
        </div>

        <div class="solar-three-col">
          <div class="card">
            <div class="section-title" style="margin-bottom:4px">Projected Generation <span class="tag tag--amber" style="font-size:10px">kWh</span></div>
            <div class="value value--amber" id="spec-annual-gen" style="font-size:18px;font-weight:700;margin-bottom:12px">
              ${te(x.annual_gen_kwh)}
            </div>
            <canvas id="gen-chart" height="160"></canvas>
          </div>

          <div class="card">
            <div class="section-title" style="margin-bottom:8px">Confidence Score</div>
            <div class="gauge-legend" style="margin-bottom:8px">
              <span><span class="gauge-dot" style="background:#10B981"></span>High</span>
              <span><span class="gauge-dot" style="background:#F59E0B"></span>Medium</span>
              <span><span class="gauge-dot" style="background:#EF4444"></span>Low</span>
            </div>
            <div class="confidence-gauge">
              <canvas id="gauge-chart" height="120" width="200"></canvas>
              <div id="spec-confidence-label" style="font-size:18px;font-weight:700;margin-top:-20px">${y.confidenceLabel||ee(y.confidenceScore)}</div>
              <div id="spec-confidence-score" style="font-size:13px;color:var(--color-text-secondary)">${y.confidenceScore}% Confidence</div>
            </div>
            ${y.confidenceScore<60?`
              <div style="margin-top:14px;padding:12px 14px;background:var(--color-primary-bg);border:1.5px solid var(--color-primary-light);border-radius:var(--radius-md);font-size:12px;line-height:1.6;color:var(--color-text-secondary)">
                <strong style="color:var(--color-text)">Boost your confidence score.</strong> Add your appliances and usage schedule to get a <strong>High</strong> confidence result.
                <div style="margin-top:10px"><button class="btn btn--primary btn--sm" onclick="window._navigate('step5')">Add Appliances →</button></div>
              </div>
            `:""}
          </div>

          <div class="card" style="overflow:hidden">
            <div class="section-title" style="margin-bottom:6px">Interactive Profile</div>
            ${r?`
              <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px">Toggle appliances to see how your system responds</div>
              <div class="interactive-profile" style="padding:0;max-height:210px;overflow-y:auto">
                ${s.map(g=>`
                  <div class="profile-appliance-row" data-name="${Sa(g.name)}" style="cursor:pointer;user-select:none">
                    <div class="checkbox ${u.has(g.name)?"checked":""}"></div>
                    <div class="profile-appliance-row__img-placeholder">${Ea(g.category||"")}</div>
                    <span>${g.name}</span>
                    <span style="margin-left:auto;font-size:12px;color:var(--color-text-muted)">×${g.qty}</span>
                  </div>
                `).join("")}
              </div>
            `:`
              <div class="interactive-profile" style="padding:0">
                ${[{name:"Air Conditioner",qty:1},{name:"Refrigerator",qty:1},{name:"TV",qty:1}].map(g=>`
                  <div class="profile-appliance-row">
                    <div class="checkbox checked"></div>
                    <div class="profile-appliance-row__img-placeholder">🔌</div>
                    <span>${g.name}</span>
                    <span style="margin-left:auto;font-size:12px;color:var(--color-text-muted)">×${g.qty}</span>
                  </div>
                `).join("")}
              </div>
              <div style="margin-top:12px">
                <button class="btn btn--primary btn--sm" onclick="window._navigate('step5')">Add Appliances to enable →</button>
              </div>
            `}
          </div>
        </div>

        <div style="margin-top:32px">
          <div class="storage-details" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
            <div class="card">
              <div class="section-title" style="margin-bottom:12px">Storage Details</div>
              <div style="display:flex;gap:32px">
                <div class="storage-stat">
                  <div class="label">Capacity</div>
                  <div class="value value--amber" id="spec-storage-cap">${d.storage_capacity} kWh</div>
                </div>
                <div class="storage-stat">
                  <div class="label">Output</div>
                  <div class="value value--amber" id="spec-storage-out">${d.storage_output.toFixed(2)} kW</div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="section-title" style="margin-bottom:12px">Backup Potential</div>
              <div class="backup-potential">
                <div class="backup-item"><div class="label">Essentials</div><div class="value value--amber" id="spec-backup-ess">${d.backup_hours_essentials}hrs</div></div>
                <div class="backup-item"><div class="label">Appliances</div><div class="value value--amber" id="spec-backup-app">${d.backup_hours_appliances}hrs</div></div>
                <div class="backup-item"><div class="label">Whole home</div><div class="value value--amber" id="spec-backup-home">${d.backup_hours_whole_home}hrs</div></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="section-title" style="margin-bottom:8px">Hourly Energy Dispatch Simulation</div>
            <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:12px;font-size:12px;color:var(--color-text-secondary)">
              <div id="dispatch-stat-reliance">Grid reliance <strong>${Math.round(v.gridReliance_before*100)}% → ${Math.round(v.gridReliance_after*100)}%</strong></div>
              <div id="dispatch-stat-grid">Avg daily grid use <strong>${v.totalDemand.toFixed(1)} → ${v.avgDailyGridKWh} kWh</strong></div>
              <div id="dispatch-stat-surplus">Avg daily surplus <strong>${v.dailySurplusKWh} kWh</strong></div>
            </div>
            <div style="display:flex;gap:16px;font-size:11px;margin-bottom:8px;flex-wrap:wrap">
              <span><span style="display:inline-block;width:10px;height:10px;background:#FCBF1E;border-radius:2px"></span> Solar</span>
              <span><span style="display:inline-block;width:10px;height:10px;background:#2E86AB;border-radius:2px"></span> Battery</span>
              <span><span style="display:inline-block;width:10px;height:10px;background:#E84855;border-radius:2px"></span> ${v.gridLabel}</span>
              <span><span style="display:inline-block;width:10px;height:10px;background:#A8DADC;border-radius:2px"></span> Charging</span>
            </div>
            <div style="position:relative">
              <canvas id="dispatch-canvas" style="display:block;width:100%"></canvas>
              <div id="dispatch-tooltip" style="display:none;position:absolute;background:#1F2937;color:#F9FAFB;padding:8px 12px;border-radius:8px;font-size:11px;pointer-events:none;z-index:10;min-width:148px;line-height:1.7;box-shadow:0 4px 16px rgba(0,0,0,0.28)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,window._navigate=n,ae(x,l),se(y.confidenceScore),requestAnimationFrame(()=>ie("dispatch-canvas",v)),r&&document.querySelectorAll(".profile-appliance-row[data-name]").forEach(g=>{g.addEventListener("click",()=>{const k=g.dataset.name,b=g.querySelector(".checkbox");u.has(k)?(u.delete(k),b.classList.remove("checked")):(u.add(k),b.classList.add("checked")),h()})});function h(){const{load:g,solar:k,battery:b,dispatch:$}=p(),S=F=>document.getElementById(F);S("spec-solar-kwp").textContent=`${k.panel_kwp} kWp`,S("spec-solar-count").textContent=`Capacity · ${k.panel_count} panels`,S("spec-inverter-kva").textContent=`${k.inverter_kva} kVA`,S("spec-battery-kwh").textContent=`${b.battery_kwh} kWh`,S("spec-battery-units").textContent=`Storage · ${b.battery_units_48v} units`,S("spec-area-m2").textContent=`${k.installation_m2} m²`,S("spec-annual-gen").textContent=te(k.annual_gen_kwh),S("spec-confidence-label").textContent=g.confidenceLabel||ee(g.confidenceScore),S("spec-confidence-score").textContent=`${g.confidenceScore}% Confidence`,S("spec-storage-cap").textContent=`${b.storage_capacity} kWh`,S("spec-storage-out").textContent=`${b.storage_output.toFixed(2)} kW`,S("spec-backup-ess").textContent=`${b.backup_hours_essentials}hrs`,S("spec-backup-app").textContent=`${b.backup_hours_appliances}hrs`,S("spec-backup-home").textContent=`${b.backup_hours_whole_home}hrs`,S("dispatch-stat-reliance").innerHTML=`Grid reliance <strong>${Math.round($.gridReliance_before*100)}% → ${Math.round($.gridReliance_after*100)}%</strong>`,S("dispatch-stat-grid").innerHTML=`Avg daily grid use <strong>${$.totalDemand.toFixed(1)} → ${$.avgDailyGridKWh} kWh</strong>`,S("dispatch-stat-surplus").innerHTML=`Avg daily surplus <strong>${$.dailySurplusKWh} kWh</strong>`,ae(k,l),se(g.confidenceScore),ie("dispatch-canvas",$)}}function ae(e,n){var c;const a=document.getElementById("gen-chart");if(!a)return;(c=Chart.getChart(a))==null||c.destroy();const s=a.getContext("2d"),i=e.monthly_gen.map(o=>o.kwh),t=Math.max(...i);new Chart(s,{type:"bar",data:{labels:n,datasets:[{data:i,backgroundColor:i.map(o=>o/t>.9?"#EF4444":o/t>.75?"#F5A623":"#FCD34D"),borderRadius:8,barPercentage:.5,categoryPercentage:.8}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:o=>`${o.raw} kWh`}}},scales:{x:{grid:{display:!1},ticks:{font:{size:9,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},ticks:{font:{size:9,family:"Outfit, sans-serif"},callback:o=>`${o}`}}}}})}function se(e){var i;const n=document.getElementById("gauge-chart");if(!n)return;(i=Chart.getChart(n))==null||i.destroy();const a=n.getContext("2d"),s=e>=80?"#10B981":e>=60?"#F59E0B":"#EF4444";new Chart(a,{type:"doughnut",data:{datasets:[{data:[e,100-e],backgroundColor:[s,"#E5E7EB"],borderWidth:0,circumference:180,rotation:270}]},options:{responsive:!1,cutout:"75%",plugins:{legend:{display:!1},tooltip:{enabled:!1}}}})}function ie(e,n){let a=document.getElementById(e);if(!a||!n)return;const s=a.cloneNode(!1);a.parentNode.replaceChild(s,a),a=s;const i=a.parentElement,t=window.devicePixelRatio||1,c=i.clientWidth||600,o=220;a.width=c*t,a.height=o*t,a.style.width=c+"px",a.style.height=o+"px";const l=a.getContext("2d");l.scale(t,t);const r=46,u=12,p=10,y=28,x=c-r-u,d=o-p-y,v=n.hours,g=Math.max(...v.map(w=>w.demand+w.solar_to_charge),.01)*1.12,k=d/g,b=x/24,$=Math.max(4,b*.6),S=5,F={solar:"#FCBF1E",battery:"#2E86AB",grid:"#E84855",charge:"#A8DADC"};l.font="10px Outfit, sans-serif",l.textAlign="right",[0,.25,.5,.75,1].forEach(w=>{const m=g*w,f=p+d-m*k;l.strokeStyle="#F3F4F6",l.lineWidth=1,l.beginPath(),l.moveTo(r,f),l.lineTo(r+x,f),l.stroke(),l.fillStyle="#9CA3AF",l.fillText(m.toFixed(1),r-4,f+3.5)}),l.save(),l.translate(13,p+d/2),l.rotate(-Math.PI/2),l.textAlign="center",l.fillStyle="#6B7280",l.fillText("kW",0,0),l.restore();function A(w,m,f,E,I){if(E<=0)return;const W=Math.min(I,f/2,E/2);l.beginPath(),l.moveTo(w,m+E),l.lineTo(w,m+W),l.quadraticCurveTo(w,m,w+W,m),l.lineTo(w+f-W,m),l.quadraticCurveTo(w+f,m,w+f,m+W),l.lineTo(w+f,m+E),l.closePath(),l.fill()}const R=[];v.forEach(w=>{const m=[{v:w.solar_to_load,c:F.solar},{v:w.battery_to_load,c:F.battery},{v:w.grid_to_load,c:F.grid},{v:w.solar_to_charge,c:F.charge}];let f=-1;for(let _=m.length-1;_>=0;_--)if(m[_].v>=.001){f=_;break}const E=r+w.hour*b+(b-$)/2,I=p+d;let W=I;m.forEach((_,C)=>{if(_.v<.001)return;const L=_.v*k;W-=L,l.fillStyle=_.c,C===f?A(E,W,$,L,S):l.fillRect(E,W,$,L)}),R.push({bx:E,bW:$,topY:W,bottomY:I,d:w})}),l.strokeStyle="#D1D5DB",l.lineWidth=1,l.beginPath(),l.moveTo(r,p+d),l.lineTo(r+x,p+d),l.stroke(),l.fillStyle="#6B7280",l.textAlign="center",l.font="9px Outfit, sans-serif";for(let w=0;w<24;w+=3){const m=w===0?"12am":w<12?`${w}am`:w===12?"12pm":`${w-12}pm`;l.fillText(m,r+w*b+b/2,o-6)}const B=document.getElementById("dispatch-tooltip");a.addEventListener("mousemove",w=>{const m=a.getBoundingClientRect(),f=w.clientX-m.left,E=w.clientY-m.top,I=R.find(L=>f>=L.bx&&f<=L.bx+L.bW);if(!I||E<p||E>p+d){B&&(B.style.display="none");return}const W=I.d,_=W.hour,C=_===0?"12am":_<12?`${_}am`:_===12?"12pm":`${_-12}pm`;if(B){let L=f+14,T=E-106;L+152>c&&(L=f-166),T<0&&(T=E+14),B.style.left=L+"px",B.style.top=T+"px",B.style.display="block",B.innerHTML=`
        <div style="font-weight:700;margin-bottom:5px;font-size:12px">${C}</div>
        <div><span style="color:${F.solar}">■</span> Solar: ${W.solar_to_load.toFixed(2)} kW</div>
        <div><span style="color:${F.battery}">■</span> Battery: ${W.battery_to_load.toFixed(2)} kW</div>
        <div><span style="color:${F.grid}">■</span> ${n.gridLabel}: ${W.grid_to_load.toFixed(2)} kW</div>
        <div><span style="color:${F.charge}">■</span> Charging: ${W.solar_to_charge.toFixed(2)} kW</div>
        <div style="margin-top:5px;padding-top:5px;border-top:1px solid #374151;color:#A8B4C4;font-size:10px">SoC: ${W.soc_pct.toFixed(1)}%</div>
      `}}),a.addEventListener("mouseleave",()=>{B&&(B.style.display="none")})}const Q=e=>"₦"+Number(e).toLocaleString("en-NG");function Ca(e,n){const a=M();if(!a.results){n("step1");return}const{savings:s}=a.results,i=a.appliances&&a.appliances.length>0;e.innerHTML=`
    <div style="padding:40px 40px 60px">
      <div class="card cost-section" style="margin-bottom:0">
        <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
          <div>
            <h2 style="font-size:28px;font-weight:800;margin-bottom:4px">Cost Savings Breakdown</h2>
            <p style="color:var(--color-text-secondary);font-size:13px">See how much you save overtime with solar power</p>
          </div>
          <button class="btn btn--outline btn--sm" onclick="window._navigate('solarPVSystem')">
            ⚙️ View Solar PV System
          </button>
        </div>

        <div class="savings-kpi-grid">
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Current Blended Cost</div>
              <div class="savings-kpi__value">${Q(s.current_blended_cost)}/kWh <span class="savings-kpi__arrow-down">↓</span></div>
            </div>
            <div class="savings-kpi__icon">🏭</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">${s.solar_label||"Solar"} Blended Cost</div>
              <div class="savings-kpi__value">${Q(s.post_solar_blended_cost)}/kWh <span class="savings-kpi__arrow-up">↑</span></div>
            </div>
            <div class="savings-kpi__icon">☀️</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Annual Fuel Savings</div>
              <div class="savings-kpi__value">${Q(s.fuel_naira_saved_annual)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">${(s.litres_saved_per_year||0).toLocaleString()} Lt Saved/Year</span></div>
            </div>
            <div class="savings-kpi__icon">⛽</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">ROI</div>
              <div class="savings-kpi__value">${s.ROI}%</div>
            </div>
            <div class="savings-kpi__icon">📈</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Payback Period</div>
              <div class="savings-kpi__value">${s.simple_payback_years} Years</div>
            </div>
            <div class="savings-kpi__icon">⏱️</div>
          </div>
          <div class="savings-kpi">
            <div>
              <div class="savings-kpi__label">Lifetime Savings</div>
              <div class="savings-kpi__value">${Q(s.lifetime_savings)}</div>
              <div class="savings-kpi__sub"><span class="pill--amber">Over 25 Years</span></div>
            </div>
            <div class="savings-kpi__icon">💰</div>
          </div>
        </div>

        <div class="card" style="margin-bottom:24px;margin-top:0">
          <div class="savings-kpi" style="border:none;padding:0">
            <div>
              <div class="savings-kpi__label">Carbon Emission Avoided</div>
              <div class="savings-kpi__value">${s.co2_avoided_tonnes} tCO₂/Year</div>
            </div>
            <div class="savings-kpi__icon">🌱</div>
          </div>
        </div>

        <div class="savings-bottom-grid">
          <div class="card">
            <div class="section-title" style="margin-bottom:16px">25-Year Cash Flow</div>
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

        <div class="cta-row" style="display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding:28px 32px;background:var(--color-white);border-radius:var(--radius-lg)">
          <div>
            <div style="font-size:var(--font-size-lg);font-weight:800;margin-bottom:4px">Ready to get your solar system?</div>
            <div style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">See a detailed breakdown with product specifications, pricing, and installer options.</div>
          </div>
          <button class="btn btn--primary btn--lg" id="view-quote-btn" style="flex-shrink:0;margin-left:24px">
            See Your Quote →
          </button>
        </div>
      </div>

      ${i?"":`
        <div class="refine-prompt-card">
          <div class="refine-prompt-card__icon">⚡</div>
          <div class="refine-prompt-card__body">
            <div class="refine-prompt-card__title">Sharpen your estimate with a home profile</div>
            <div class="refine-prompt-card__desc">These numbers are based on your energy spending. Add your appliances and usage schedule to get an accurate hourly load curve, a seasonal forecast, and a High-confidence solar recommendation.</div>
            <button class="btn btn--primary" onclick="window._navigate('step5')">Add Appliances &amp; Set Goals →</button>
          </div>
        </div>
      `}
    </div>
  `,window._navigate=n,document.getElementById("view-quote-btn").addEventListener("click",()=>n("finalQuote")),Fa(s),La(s)}function Fa(e){const n=document.getElementById("cashflow-chart");if(!n)return;const a=window.devicePixelRatio||1,s=n.offsetWidth||500,i=280;n.width=s*a,n.height=i*a;const t=n.getContext("2d");t.scale(a,a);const c=e.cashflow,o=76,l=88,r=28,u=38,p=s-o-l,y=i-r-u,x=c.map(_=>_.cumulative),d=Math.min(...x),v=Math.max(...x),h=(v-d)*.1||Math.abs(d)*.1||1e5,g=d-h,k=v+h,b=k-g||1,$=_=>o+_/25*p,S=_=>r+(1-(_-g)/b)*y,F=S(0),A=c.map(_=>({x:$(_.year),y:S(_.cumulative),year:_.year,cumulative:_.cumulative})),R=A[A.length-1],B=_=>{const C=Math.abs(_),L=_<0?"-₦":"₦";return C>=1e6?`${L}${(C/1e6).toFixed(1)}M`:C>=1e3?`${L}${Math.round(C/1e3)}k`:`${L}${Math.round(C)}`},w=5,m=Array.from({length:w+1},(_,C)=>g+(k-g)*(C/w));t.save(),t.setLineDash([3,4]),t.strokeStyle="#F3F4F6",t.lineWidth=1,m.forEach(_=>{const C=S(_);C<r||C>r+y||(t.beginPath(),t.moveTo(o,C),t.lineTo(o+p,C),t.stroke())}),t.restore(),t.fillStyle="#9CA3AF",t.textAlign="right",t.font="10px Outfit, sans-serif",m.forEach(_=>{const C=S(_);C<r-4||C>r+y+4||t.fillText(B(_),o-7,C+3.5)}),t.strokeStyle="#E5E7EB",t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(o,r),t.lineTo(o,r+y),t.stroke();const f=Math.min(Math.max(F,r),r+y);f<r+y&&(t.save(),t.beginPath(),t.rect(o,f,p,r+y-f),t.clip(),t.beginPath(),t.moveTo(A[0].x,A[0].y),A.forEach(_=>t.lineTo(_.x,_.y)),t.lineTo(R.x,f),t.lineTo(A[0].x,f),t.closePath(),t.fillStyle="rgba(232,72,85,0.10)",t.fill(),t.restore()),f>r&&(t.save(),t.beginPath(),t.rect(o,r,p,f-r),t.clip(),t.beginPath(),t.moveTo(A[0].x,A[0].y),A.forEach(_=>t.lineTo(_.x,_.y)),t.lineTo(R.x,f),t.lineTo(A[0].x,f),t.closePath(),t.fillStyle="rgba(34,197,94,0.10)",t.fill(),t.restore()),F>=r&&F<=r+y&&(t.save(),t.setLineDash([6,4]),t.strokeStyle="#9CA3AF",t.lineWidth=1.5,t.beginPath(),t.moveTo(o,F),t.lineTo(o+p,F),t.stroke(),t.restore(),t.fillStyle="#9CA3AF",t.font="bold 10px Outfit, sans-serif",t.textAlign="left",t.fillText("Investment Line",o+p+5,F+4)),t.strokeStyle="#E5E7EB",t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(o,r+y),t.lineTo(o+p,r+y),t.stroke(),t.beginPath(),t.moveTo(A[0].x,A[0].y),A.forEach(_=>t.lineTo(_.x,_.y)),t.strokeStyle="#FCBF1E",t.lineWidth=2.5,t.lineJoin="round",t.setLineDash([]),t.stroke(),A.forEach(_=>{t.beginPath(),t.arc(_.x,_.y,2.5,0,Math.PI*2),t.fillStyle="#FCBF1E",t.fill()});const E=e.payback_exact,I=E!=null&&E<99&&E>=0;if(I){const _=$(E),C=S(0);t.beginPath(),t.arc(_,C,7,0,Math.PI*2),t.fillStyle="#22C55E",t.fill(),t.strokeStyle="#fff",t.lineWidth=2,t.stroke()}if(I){const _=$(E),C=S(0);t.fillStyle="#16A34A",t.font="bold 10px Outfit, sans-serif";const L=_+84>o+p;t.textAlign=L?"right":"center",t.fillText(`Payback: Year ${E}`,L?_-10:_,Math.max(r+14,C-14))}t.fillStyle="#6B7280",t.font="10px Outfit, sans-serif",t.textAlign="center",t.setLineDash([]),[0,3,5,10,15,20,25].forEach(_=>{const C=$(_);t.fillText(`Yr ${_}`,C,r+y+22),t.strokeStyle="#D1D5DB",t.lineWidth=1,t.beginPath(),t.moveTo(C,r+y),t.lineTo(C,r+y+5),t.stroke()}),t.fillStyle="#9CA3AF",t.font="10px Outfit, sans-serif",t.textAlign="center",t.fillText("Year",o+p/2,r+y+36);const W=document.getElementById("cashflow-tooltip");W&&(n.addEventListener("mousemove",_=>{const C=n.getBoundingClientRect(),L=_.clientX-C.left;let T=null,D=1/0;if(A.forEach(G=>{const H=Math.abs(G.x-L);H<D&&(D=H,T=G)}),T&&D<22){const G=T.cumulative>=0?"+":"";W.style.left=T.x+10+"px",W.style.top=Math.max(4,T.y-48)+"px",W.style.display="block";const H=T.year===10?`<div style="color:#FCA5A5;margin-top:3px">Battery replacement: -${Q(e.battery_replacement_cost)}</div>`:"";W.innerHTML=`<div>Year ${T.year}: ${G}${Q(T.cumulative)}</div>${H}`}else W.style.display="none"}),n.addEventListener("mouseleave",()=>{W.style.display="none"}))}function La(e){var a;const n=(a=document.getElementById("compare-chart"))==null?void 0:a.getContext("2d");n&&new Chart(n,{type:"bar",data:{labels:[e.current_label||"Grid+Gen",e.solar_label||"Solar"],datasets:[{data:[e.current_monthly_cost,e.post_solar_monthly_cost],backgroundColor:["#E74C3C","#1B4F72"],borderRadius:6,barThickness:60}]},options:{responsive:!0,plugins:{legend:{display:!1},tooltip:{callbacks:{label:s=>`₦${Number(s.raw).toLocaleString()}`}}},scales:{x:{grid:{display:!1},title:{display:!0,text:"Monthly Cost Scenario",font:{size:11,family:"Outfit, sans-serif"}},ticks:{font:{size:10,family:"Outfit, sans-serif"}}},y:{grid:{color:"#F3F4F6"},suggestedMax:Math.max(e.current_monthly_cost,e.post_solar_monthly_cost)*1.4,ticks:{font:{size:10,family:"Outfit, sans-serif"},callback:s=>`₦${(s/1e3).toFixed(0)}k`}}}},plugins:[{id:"barValueLabels",afterDatasetsDraw(s){const{ctx:i,data:t}=s,c=s.getDatasetMeta(0);i.save(),i.font="bold 11px Outfit, sans-serif",i.textAlign="center",i.textBaseline="bottom",c.data.forEach((o,l)=>{const r=t.datasets[0].data[l];i.fillStyle="#374151",i.fillText("₦"+Number(r).toLocaleString("en-NG"),o.x,o.y-4)}),i.restore()}}]})}const nt=e=>"₦"+Number(e).toLocaleString("en-NG");function Ma(e,n){const{results:a,budget:s}=M();if(!a){n("step1");return}const{solar:i,battery:t,savings:c}=a,o=c.total_system_cost,l=Math.min(100,Math.round(s/o*100)),r=s>=o,u=[{product:`JA Solar ${Math.round(i.panel_kwp*1e3/i.panel_count)}W Mono PERC Half-Cell`,sku:`JA-${Math.round(i.panel_kwp*1e3/i.panel_count)}M-HC`,category:"Solar Panel",qty:i.panel_count},{product:`Sunsynk ${Math.ceil(i.inverter_kva)}kW Hybrid Inverter`,sku:`SUNK-HYB-${Math.ceil(i.inverter_kva)}KW`,category:"Inverter",qty:1},{product:"48V LiFePO4 Battery 5kWh",sku:"BAT-LFP-48V-5K",category:"Battery",qty:t.battery_units_48v},{product:"Roof Mounting Kit (Tile / Metal)",sku:"MNT-ROOF-TILE",category:"Mounting",qty:Math.ceil(i.panel_count/4)},{product:"4mm² DC Solar Cable (Red + Black)",sku:"CBL-DC-4MM-PAIR",category:"Cabling",qty:`${Math.ceil(i.panel_kwp*10)}m`}];e.innerHTML=`
    <div style="padding:40px 40px 60px">

      <div class="page-header-row" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px">
        <div>
          <h2 style="font-size:28px;font-weight:800;margin-bottom:4px">Your Solar Quote</h2>
          <p style="color:var(--color-text-secondary);font-size:13px">System specifications, financial readiness &amp; product breakdown</p>
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
              <span class="tag ${r?"tag--green":"tag--amber"}">
                ${r?"✓ Budget covered":"⚠ Budget gap"}
              </span>
            </div>

            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-muted);margin-bottom:8px">
              <span>₦0</span>
              <span>System Cost: ${nt(o)}</span>
            </div>
            <div class="financial-readiness-bar">
              <div class="financial-readiness-bar__fill" style="width:${l}%"></div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
              <span style="font-size:12px;color:var(--color-text-secondary)">Your Budget: <strong>${nt(s)}</strong></span>
              <span style="font-size:12px;font-weight:700;color:${r?"var(--color-success)":"var(--color-error)"}">
                ${r?`+${nt(s-o)} surplus`:`${nt(o-s)} gap`}
              </span>
            </div>
          </div>

          <div class="card" style="background:var(--color-primary-bg);border-color:var(--color-primary-light)">
            <div style="font-size:12px;font-weight:700;color:var(--color-primary-dark);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">System Summary</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <div>
                <div class="label">Solar Capacity</div>
                <div class="value value--amber">${i.panel_kwp.toFixed(1)} kWp</div>
              </div>
              <div>
                <div class="label">Inverter Size</div>
                <div class="value value--amber">${i.inverter_kva.toFixed(1)} kVA</div>
              </div>
              <div>
                <div class="label">Battery Storage</div>
                <div class="value value--amber">${a.battery.battery_kwh.toFixed(1)} kWh</div>
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                  <span class="label" style="margin-bottom:0">Est. System Cost</span>
                  <button class="assumptions-btn" id="show-assumptions-btn" title="View pricing assumptions">ⓘ</button>
                </div>
                <div class="value value--amber">${nt(o)}</div>
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
                ${u.map(d=>`
                  <tr>
                    <td>
                      ${d.product}
                      <span class="bom-sku">${d.sku}</span>
                    </td>
                    <td>${d.category}</td>
                    <td style="text-align:right">${d.qty}</td>
                  </tr>
                `).join("")}
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
  `,window._navigate=n;const p=document.getElementById("assumptions-overlay");function y(){p.classList.add("assumptions-overlay--visible")}function x(){p.classList.remove("assumptions-overlay--visible")}document.getElementById("show-assumptions-btn").addEventListener("click",y),document.getElementById("close-assumptions-btn").addEventListener("click",x),document.getElementById("close-assumptions-btn-2").addEventListener("click",x),p.addEventListener("click",d=>{d.target===p&&x()}),document.addEventListener("keydown",function(v){v.key==="Escape"&&x()})}const Aa=["step1","step2","step3","step4","step5","step6"],Ba=[{route:"costSavings",label:"Cost Savings",sublabel:"Financial Breakdown",paths:'<polyline points="1,13 5,9 8,11 14,4"/><polyline points="10,4 14,4 14,8"/>'},{route:"loadProfile",label:"Load Summary",sublabel:"Energy Profile",paths:'<rect x="2" y="10" width="3" height="4" rx="0.5"/><rect x="6.5" y="6" width="3" height="8" rx="0.5"/><rect x="11" y="2" width="3" height="12" rx="0.5"/>'},{route:"solarPVSystem",label:"Solar PV System",sublabel:"Recommendation",paths:'<circle cx="8" cy="8" r="2.5"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3.34" y1="3.34" x2="4.75" y2="4.75"/><line x1="11.25" y1="11.25" x2="12.66" y2="12.66"/><line x1="12.66" y1="3.34" x2="11.25" y2="4.75"/><line x1="4.75" y1="11.25" x2="3.34" y2="12.66"/>'},{route:"finalQuote",label:"Final Quote",sublabel:"System &amp; BOM",paths:'<rect x="3" y="1" width="10" height="14" rx="1"/><line x1="6" y1="5" x2="10" y2="5"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="8.5" y2="11"/>'}],ne={step1:Be,step2:Pe,step3:pe,step4:oa,step5:ya,step6:fa,costSavings:Ca,loadProfile:ka,solarPVSystem:$a,finalQuote:Ma};let ot="step1";function Z(e){ot=e,ye()}function ye(){const e=document.getElementById("wizard-layout"),n=document.getElementById("results-layout");if(Aa.includes(ot)){e.classList.remove("hidden"),n.classList.add("hidden");const a=document.getElementById("wizard-content");a.innerHTML="",ne[ot](a,Z)}else{e.classList.add("hidden"),n.classList.remove("hidden"),Wa();const a=document.getElementById("results-content");a.innerHTML="",a.classList.remove("page-enter"),a.offsetWidth,a.classList.add("page-enter"),ne[ot](a,Z),setTimeout(()=>a.classList.remove("page-enter"),300)}}function Wa(){var a,s;const e=document.getElementById("results-nav"),n=document.getElementById("results-actions");e.innerHTML=Ba.map(i=>`
    <div class="results-nav__item${i.route===ot?" active":""}" data-route="${i.route}">
      <svg class="results-nav__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${i.paths}
      </svg>
      <div class="results-nav__label-wrap">
        <span class="results-nav__label">${i.label}</span>
        <span class="results-nav__sublabel">${i.sublabel}</span>
      </div>
    </div>
  `).join(""),e.querySelectorAll("[data-route]").forEach(i=>{i.addEventListener("click",()=>Z(i.dataset.route))}),n.innerHTML=`
    <button class="btn btn--outline btn--sm btn--full" id="adjust-energy-btn">Adjust Energy Data</button>
    <button class="btn btn--outline btn--sm btn--full" id="adjust-home-btn" style="margin-top:8px">Adjust Home Profile</button>
  `,(a=document.getElementById("adjust-energy-btn"))==null||a.addEventListener("click",()=>Z("step1")),(s=document.getElementById("adjust-home-btn"))==null||s.addEventListener("click",()=>Z("step5"))}function Pa(){window._navigate=Z,ye()}async function Ta(){const[e,n,a,s,i,t,c]=await Promise.all([N(()=>import("./pv_yield-CU_nXj2N.js"),[]),N(()=>import("./appliances-DLqnZRtU.js"),[]),N(()=>import("./usage_patterns-BmRCnSsJ.js"),[]),N(()=>import("./tariff_bands-Cpc1Xb6C.js"),[]),N(()=>import("./fuel_prices-CGnfv4Fr.js"),[]),N(()=>import("./generator_efficiency-MkdsxVYB.js"),[]),N(()=>import("./house_type_appliances-DTPvJLsA.js"),[])]);q("pv_yield",e.default),q("appliances",n.default),q("usage_patterns",a.default),q("tariff_bands",s.default),q("fuel_prices",i.default),q("generator_efficiency",t.default),q("house_type_appliances",c.default)}async function Ia(){await Ta(),Pa()}Ia();
