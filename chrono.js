// chrono.js : saisie au temps avec chronomètre par série + écran gardé allumé pendant la séance.
// À charger en dernier, après historique.js.
document.head.insertAdjacentHTML('beforeend','<style>.tmb{flex:0 0 auto;min-width:92px;font-variant-numeric:tabular-nums}.tmb.run{background:var(--ok);border-color:var(--ok);color:#fff}.tmt{float:right;padding:3px 10px;font-size:.8rem;margin-left:6px}</style>');

// Exercices au temps par défaut (reconnus par leur nom)
const TD=/gainage|chaise|suspension|planche|fermier|secondes/i;
let tRun=null,tInt=null,tBeep=false,tWL=null,tAC=null;
const tBase=id=>String(id).split('~')[0];
const tNom=id=>E[tBase(id)]?E[tBase(id)][0]:'';
const tLog=l=>!!l.t||tBase(l.e)==='ga';
const tFmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
const tTxt=l=>l.s.map(x=>(x[0]?x[0]+' kg · ':'')+x[1]+' s').join(' ; ');
function isT(id){const p=me(),m=p&&p.tm;return m&&id in m?!!m[id]:TD.test(tNom(id))}
function tRng(id){const e=E[tBase(id)];return e&&TD.test(e[0])?e[2]:'30-45'}
function tSave(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}

// Suggestions : en secondes pour les exercices au temps
const tS0=sug;
sug=function(id,l){
  const p=me(),L=p?p.lg.filter(x=>x.e===id):[];
  if(!isT(id))return tS0(id,L.length?L.filter(x=>!tLog(x)).at(-1):l);
  const [lo,hi]=tRng(id).split('-').map(Number),lt=L.filter(tLog).at(-1);
  if(!lt)return`⏱ Première fois au chrono : vise ${lo}-${hi} s par série.`;
  const kg=Math.max(...lt.s.map(x=>x[0])),ok=lt.s.every(x=>x[1]>=hi);
  return ok?`🔥 Toutes tes séries ont atteint ${hi} s : ajoute 5 s${kg?' ou passe à '+(kg+2)+' kg':''}.`
           :`🎯 Vise ${hi} s sur chaque série${kg?' à '+kg+' kg':''}.`;
};

// Enregistrement : marque les exercices faits au temps
const tD0=done;
done=function(){
  const p=me(),n=p?p.lg.length:0;
  tStop(true);
  const r=tD0.apply(this,arguments);
  if(p&&p.lg.length>n){p.lg.slice(n).forEach(l=>{if(isT(l.e))l.t=1});tSave()}
  return r;
};

// Bascule Reps / Temps sur chaque exercice
function tTog(b){
  const cd=b.closest('.cd'),id=cd.dataset.tid,p=me();
  p.tm=p.tm||{};p.tm[id]=!isT(id);
  if(tRun&&tRun.id===id)tStop(false);
  tSave();tApply(cd);
}
function tApply(cd){
  const id=cd.dataset.tid,on=isT(id),p=me();
  const tg=cd.querySelector('.tmt');if(tg)tg.classList.toggle('on',on);
  const sp=cd.querySelector('b ~ span.m');
  if(sp){sp.dataset.o=sp.dataset.o||sp.textContent;sp.textContent=on?sp.dataset.o.split(' × ')[0]+' × '+tRng(id)+' s':sp.dataset.o}
  const sg=cd.querySelector('.sg');if(sg)sg.innerHTML=sug(id);
  const lt=p.lg.filter(l=>l.e===id&&tLog(l)).at(-1);
  cd.querySelectorAll('.st').forEach(row=>{
    const r=row.querySelector('input[id^="r"]'),k=row.querySelector('input[id^="k"]');if(!r)return;
    const i=+r.id.slice(1+id.length),bid='tm_'+id+'_'+i;
    r.dataset.ph=r.dataset.ph||r.placeholder;if(k)k.dataset.ph=k.dataset.ph||k.placeholder;
    let bt=document.getElementById(bid);
    if(on){
      const q=lt&&(lt.s[i]||lt.s.at(-1));
      r.placeholder=q?q[1]+' s':'secondes';
      if(k)k.placeholder=q&&q[0]?q[0]+' kg':'kg (option)';
      if(!bt){row.insertAdjacentHTML('beforeend',`<button class="ch tmb" id="${bid}" onclick="tGo('${id}',${i})" aria-label="Chronomètre série ${i+1}">▶ Chrono</button>`);bt=document.getElementById(bid)}
      if(tRun&&tRun.id===id&&tRun.i===i)tTick();
    }else{
      r.placeholder=r.dataset.ph;if(k)k.placeholder=k.dataset.ph;
      if(bt)bt.remove();
    }
  });
}
function tCards(){
  document.querySelectorAll('#m .cd').forEach(cd=>{
    if(!cd.querySelector('.sg'))return;
    const r0=cd.querySelector('.st input[id^="r"]');if(!r0)return;
    const id=r0.id.slice(1,-1);
    cd.dataset.tid=id;
    if(!cd.querySelector('.tmt')&&tBase(id)!=='ga'){const b=cd.querySelector('b');if(b)b.insertAdjacentHTML('beforebegin','<button class="ch tmt" onclick="tTog(this)">⏱ Temps</button>')}
    tApply(cd);
  });
}

// Chronomètre
function tGo(id,i){
  if(tRun&&tRun.id===id&&tRun.i===i)return tStop(true);
  if(tRun)tStop(true);
  try{tAC=tAC||new (window.AudioContext||window.webkitAudioContext)();tAC.resume()}catch(e){}
  tRun={id,i,t0:Date.now()};tBeep=false;tLock();
  tInt=setInterval(tTick,250);tTick();
}
function tTick(){
  if(!tRun)return;
  const s=Math.floor((Date.now()-tRun.t0)/1000),b=document.getElementById('tm_'+tRun.id+'_'+tRun.i);
  if(b){b.textContent='⏹ '+tFmt(s);b.classList.add('run')}
  const hi=+tRng(tRun.id).split('-')[1];
  if(!tBeep&&hi&&s>=hi){tBeep=true;tBip()}
}
function tStop(write){
  clearInterval(tInt);if(!tRun)return;
  const {id,i,t0}=tRun,s=Math.floor((Date.now()-t0)/1000);tRun=null;
  const b=document.getElementById('tm_'+id+'_'+i);if(b){b.textContent='▶ Chrono';b.classList.remove('run')}
  const r=document.getElementById('r'+id+i);
  if(write&&r&&s>0){r.value=s;['input','change'].forEach(t=>r.dispatchEvent(new Event(t,{bubbles:true})))}
  if(tab!=='sport')tUnlock();
}
function tBip(){
  try{if(navigator.vibrate)navigator.vibrate([200,100,200])}catch(e){}
  try{if(!tAC)return;[0,.25].forEach(d=>{const o=tAC.createOscillator(),g=tAC.createGain();o.frequency.value=880;g.gain.value=.25;o.connect(g).connect(tAC.destination);o.start(tAC.currentTime+d);o.stop(tAC.currentTime+d+.15)})}catch(e){}
}

// Écran gardé allumé dans l'onglet Sport
async function tLock(){try{if('wakeLock' in navigator&&!tWL&&document.visibilityState==='visible'){tWL=await navigator.wakeLock.request('screen');tWL.addEventListener('release',()=>{tWL=null})}}catch(e){}}
function tUnlock(){try{if(tWL)tWL.release()}catch(e){}tWL=null}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&(tab==='sport'||tRun))tLock()});

// Progrès et Historique : affichage en secondes
const tP0=vProg;
vProg=function(p){
  let h=tP0(p);
  try{
    const ids=Object.keys(E).filter(id=>p.lg.some(l=>l.e===id)),id=ids.includes(xs)?xs:ids[0];
    const A=id?p.lg.filter(l=>l.e===id):[],T=A.filter(tLog);
    if(T.length){
      const v=T.map(l=>Math.max(...l.s.map(x=>x[1])));
      const card=`<div class=cd><b>Meilleure série au chrono</b> <span class=m>(record : ${tFmt(Math.max(...v))})</span>${chart(v)}</div>`;
      const re=/<div class=cd><b>1RM estimé<\/b>[\s\S]*?<\/div>/;
      h=T.length===A.length?h.replace(re,card):h.replace(re,m=>m+card);
      const a=h.indexOf('Dernières séances</h2>');
      if(a>=0){
        let z=h.indexOf('<div class=cd><h2>Historique',a);if(z<0)z=h.length;
        const last=A.slice(-8).reverse();let k=0;
        h=h.slice(0,a)+h.slice(a,z).replace(/<div class=cd><span class=m>([^<]*)<\/span><br>[^<]*<\/div>/g,(m,d)=>{const l=last[k++];return l&&tLog(l)?`<div class=cd><span class=m>${d}</span><br>${tTxt(l)}</div>`:m})+h.slice(z);
      }
    }
    h=h.replace(/onclick="hEdit\((\d+)\)">Modifier<\/button><\/div><p class=m style="margin:2px 0">[^<]*<\/p>/g,(m,i)=>{const l=p.lg[i];return l&&tLog(l)?m.replace(/<p class=m style="margin:2px 0">[^<]*<\/p>/,`<p class=m style="margin:2px 0">${tTxt(l)}</p>`):m});
  }catch(e){}
  return h;
};
if(typeof hEditor==='function'){
  const tH0=hEditor;
  hEditor=function(i,l,ga){
    if(!tLog(l))return tH0(i,l,ga);
    return l.s.some(x=>x[0])?tH0(i,l,false).replace(/>reps<\/span>/g,'>s</span>'):tH0(i,l,true);
  };
}

// Applique les améliorations après chaque affichage
const tR0=R;
R=function(){
  const r=tR0.apply(this,arguments);
  try{if(tab==='sport'){tCards();tLock()}else if(!tRun)tUnlock()}catch(e){}
  return r;
};
R();
