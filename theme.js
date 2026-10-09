// Thème moderne : palette, cartes, menu flottant, icônes, anneaux de progression sur l'accueil.
document.head.insertAdjacentHTML('beforeend',`<style>
:root{--bg:#f6f4f0;--c:#fff;--c2:#efece6;--t:#16181d;--m:#6a6f7a;--a:#f4511e;--a2:#ff9f1c;--ok:#12a05a;--b:#e5e1d8}
@media(prefers-color-scheme:dark){:root{--bg:#0f1115;--c:#181b21;--c2:#20242c;--t:#f1f2f4;--m:#9aa0ab;--a:#ff6a3d;--a2:#ffb347;--ok:#3ccf8e;--b:#2a2e37}}
body{font-family:"SF Pro Rounded",ui-rounded,"Avenir Next","Segoe UI Variable",system-ui,sans-serif;padding-bottom:calc(112px + env(safe-area-inset-bottom,0px))}
h2{font-size:1.3rem;font-weight:800;letter-spacing:-.02em}
.cd{border:0;border-radius:22px;padding:16px 18px;box-shadow:0 1px 0 rgba(0,0,0,.03),0 10px 26px -14px rgba(22,24,29,.22);animation:tUp .4s both}
@media(prefers-color-scheme:dark){.cd{border:1px solid var(--b);box-shadow:none}}
#m>.cd:nth-child(2){animation-delay:.04s}#m>.cd:nth-child(3){animation-delay:.08s}#m>.cd:nth-child(4){animation-delay:.12s}#m>.cd:nth-child(n+5){animation-delay:.16s}
@keyframes tUp{from{opacity:0;transform:translateY(10px)}}
@media(prefers-reduced-motion:reduce){.cd{animation:none}}
.ch{border:0;background:var(--c2);color:var(--t);font-weight:600}
.ch.on{background:var(--t);color:var(--bg)}
.bt{border-radius:18px;background:linear-gradient(135deg,var(--a),var(--a2));box-shadow:0 10px 22px -10px var(--a);font-weight:700}
.bt.s{background:var(--c2);color:var(--t);box-shadow:none;border:0}
input,select,textarea{background:var(--c2);border:2px solid transparent;border-radius:14px}
input:focus,select:focus,textarea:focus{border-color:var(--a);outline:none}
.big{background:linear-gradient(135deg,var(--a),var(--a2));-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:800}
body[data-tab=sport] #m>.bt:last-child{bottom:calc(88px + env(safe-area-inset-bottom,0px))}
nav{left:12px;right:12px;bottom:calc(10px + env(safe-area-inset-bottom,0px));max-width:560px;margin:0 auto;padding:6px;gap:2px;border:0;border-radius:26px;background:var(--c);background:color-mix(in srgb,var(--c) 82%,transparent);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);box-shadow:0 12px 32px -12px rgba(0,0,0,.4)}
nav button{display:flex;flex-direction:column;align-items:center;gap:3px;border-radius:20px;padding:8px 0;font-size:.68rem;font-weight:600}
nav button.on{background:var(--c2);color:var(--a);box-shadow:none}
.rgs{display:flex;justify-content:space-around;gap:8px;text-align:center;margin-top:6px}
.rg{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:.85rem;flex:1}
.rg span{font-size:.72rem}
</style>`);
document.querySelectorAll('meta[name=theme-color]').forEach(m=>{m.content=/dark/.test(m.media)?'#0f1115':'#f6f4f0'});

// Icônes du menu (traits fins)
const TI={
Accueil:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
Sport:'<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
'Progrès':'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
Profil:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
Nutrition:'<path d="M6 3v8M10 3v8M6 7h4M8 11v10"/><path d="M17 3c-2 2-3 5-3 8h3v10"/>'};
function tNav(){
  document.querySelectorAll('#n button').forEach(b=>{
    const l=(b.textContent||'').replace(/^[^A-Za-zÀ-ÿ]+/,'').trim();
    if(TI[l])b.innerHTML=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TI[l]}</svg><span>${l}</span>`;
  });
}

// Anneaux de progression sur l'accueil
function tRing(v,max,label,sub,col){
  const r=30,c=2*Math.PI*r,f=Math.min(1,max?v/max:0);
  return`<div class=rg><svg viewBox="0 0 80 80" width="84" height="84" role="img" aria-label="${label}"><circle cx="40" cy="40" r="${r}" fill="none" stroke="var(--b)" stroke-width="8"/><circle cx="40" cy="40" r="${r}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(c*f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 40 40)"/><text x="40" y="45" text-anchor="middle" font-size="14" font-weight="800" fill="currentColor">${v}</text></svg><b>${label}</b><span class=m>${sub}</span></div>`;
}
function tHome(){
  const p=me();
  if(!p||document.querySelector('#m .rgs'))return;
  const wk=p.ss.filter(x=>x.d>=mon()).length,jr=(p.jr&&p.jr[today()])||[];
  const k=Math.round(jr.reduce((a,e)=>a+e.k,0)),pr=Math.round(jr.reduce((a,e)=>a+e.p,0));
  const r=typeof nCalc=='function'?nCalc(p):null;
  $('#m').insertAdjacentHTML('afterbegin',`<div class=cd><p class=m>Aujourd’hui</p><div class=rgs>${tRing(wk,p.spw,'Séances','sur '+p.spw+' cette semaine','var(--a)')}${r?tRing(k,r.hi,'Calories','cible '+r.lo+' à '+r.hi,'var(--a2)')+tRing(pr,r.pl,'Protéines','cible '+r.pl+' à '+r.ph+' g','var(--ok)'):''}</div></div>`);
}

const tR=R;
R=function(){
  tR();
  tNav();
  if(tab==='home')tHome();
};
R();
