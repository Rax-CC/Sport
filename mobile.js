// Amélioration mobile : zones sûres, tailles tactiles, bouton d'enregistrement fixe, défilement conservé.
const mMeta=(n,c,m)=>{const e=document.createElement('meta');e.name=n;e.content=c;if(m)e.media=m;document.head.appendChild(e)};
mMeta('theme-color','#eef1f5','(prefers-color-scheme: light)');
mMeta('theme-color','#0e1420','(prefers-color-scheme: dark)');
mMeta('mobile-web-app-capable','yes');
mMeta('apple-mobile-web-app-capable','yes');
mMeta('apple-mobile-web-app-status-bar-style','default');
const mVp=document.querySelector('meta[name=viewport]');
if(mVp&&!/viewport-fit/.test(mVp.content))mVp.content+=',viewport-fit=cover';

document.head.insertAdjacentHTML('beforeend',`<style>
html{overflow-x:hidden;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
body{padding-bottom:calc(88px + env(safe-area-inset-bottom,0px))}
#h{padding-top:calc(10px + env(safe-area-inset-top,0px));scrollbar-width:none;background:var(--bg);background:color-mix(in srgb,var(--bg) 90%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
#h::-webkit-scrollbar{display:none}
nav{padding-bottom:env(safe-area-inset-bottom,0px)}
nav button{font-size:.72rem;line-height:1.25;padding:9px 0 7px}
nav button.on{box-shadow:inset 0 3px 0 var(--a)}
.cd{border-radius:16px;box-shadow:0 1px 3px rgba(20,33,61,.07)}
@media(prefers-color-scheme:dark){.cd{box-shadow:none}}
input,select{min-height:46px;font-size:16px;border-radius:12px}
.ch{min-height:40px}
.bt{min-height:50px;border-radius:14px;font-size:1rem;box-shadow:0 2px 8px rgba(47,91,234,.25)}
.bt.s{box-shadow:none}
button:active{transform:scale(.97)}
summary{padding:8px 0;min-height:40px}
.cd>b:first-child{font-size:1.05rem}
.rt{background:color-mix(in srgb,var(--a) 9%,transparent);border-radius:12px;padding:8px 12px;margin:8px 0}
.rt p{margin:0 0 4px}
.rt .rn{font-variant-numeric:tabular-nums}
body[data-tab=sport] #m{counter-reset:ex}
body[data-tab=sport] #m>.cd{counter-increment:ex}
body[data-tab=sport] #m>.cd>b:first-child::before{content:counter(ex);display:inline-grid;place-items:center;width:1.55em;height:1.55em;border-radius:50%;background:var(--a);color:#fff;font-size:.8em;margin-right:8px}
body[data-tab=sport] .st input{height:50px;text-align:center}
body[data-tab=sport] #m>.bt:last-child{position:sticky;bottom:calc(68px + env(safe-area-inset-bottom,0px));z-index:1;box-shadow:0 6px 18px rgba(47,91,234,.4)}
@media(min-width:700px){#m{max-width:640px}}
</style>`);

// Sélectionne le contenu d'un champ chiffré au toucher
document.addEventListener('focusin',e=>{if(e.target.matches&&e.target.matches('input[type=number]'))setTimeout(()=>e.target.select(),0)});

// Conserve la position de défilement quand on reste dans le même onglet
let mT=tab;
const mR=R;
R=function(){
  const y=window.scrollY,same=mT===tab;
  document.body.dataset.tab=tab;
  mR();
  mT=tab;
  if(same)window.scrollTo(0,y);
};
R();
