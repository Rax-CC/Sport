// Mode séance guidée : un exercice à la fois, validation des séries, repos automatique.
document.head.insertAdjacentHTML('beforeend',`<style>
#gd{position:fixed;inset:0;z-index:100;background:var(--bg);color:var(--t);overflow-y:auto;padding:calc(14px + env(safe-area-inset-top,0px)) 16px calc(18px + env(safe-area-inset-bottom,0px))}
.gi{max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.gh{display:flex;align-items:center;gap:10px}.gh .ch{margin-left:auto}
.gp{height:6px;border-radius:6px;background:var(--c2)}
.gp i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,var(--a),var(--a2))}
.gdt{display:flex;gap:6px;justify-content:center}
.gdt i{width:12px;height:12px;border-radius:50%;background:var(--c2)}
.gdt i.ok{background:var(--ok)}.gdt i.cur{background:var(--a)}
.gs{display:flex;align-items:center;gap:10px;background:var(--c);border-radius:20px;padding:10px}
.gs button{width:58px;height:58px;border:0;border-radius:16px;background:var(--c2);color:var(--t);font-size:1.7rem}
.gs input{flex:1;min-width:0;text-align:center;font-size:2.2rem;font-weight:800;height:64px}
</style>`);

let g=null,gT=null,gW=null,gC=null;
const gK='fitg1',gBase=id=>id.split('~')[0];
const gF=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
const gL=s=>s>=60?Math.floor(s/60)+' min'+(s%60?' '+s%60+' s':''):s+' s';
const gRest=id=>(typeof RT!='undefined'&&RT[gBase(id)])||90;
const gSave=()=>{try{localStorage.setItem(gK,JSON.stringify({pid:S.cur,d:today(),g}))}catch(e){}};
function gWake(){try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(w=>{gW=w}).catch(()=>{})}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(g&&!document.hidden)gWake()});

function gOpen(){
  const p=me(),s=sess||next(p);
  try{
    const o=JSON.parse(localStorage.getItem(gK));
    if(o&&o.g&&o.pid===p.id&&o.d===today()&&o.g.s===s&&confirm('Reprendre la séance guidée en cours ?')){g=o.g;g.rest=null;gStart();return}
  }catch(e){}
  g={s,ids:SN[s][1].slice(),i:0,j:0,data:{},rest:null,end:false};
  gStart();
}
function gStart(){
  try{gC=gC||new(window.AudioContext||window.webkitAudioContext)();gC.resume()}catch(e){}
  gWake();
  let d=document.getElementById('gd');
  if(!d){d=document.createElement('div');d.id='gd';document.body.appendChild(d)}
  document.body.style.overflow='hidden';
  clearInterval(gT);gT=setInterval(gTick,250);
  gRender();
}
function gClose(clear){
  g=null;clearInterval(gT);
  try{gW&&gW.release()}catch(e){}
  gW=null;
  const d=document.getElementById('gd');if(d)d.remove();
  document.body.style.overflow='';
  if(clear)try{localStorage.removeItem(gK)}catch(e){}
}
function gQuit(){if(confirm('Quitter la séance guidée ? Ta progression du jour est conservée et tu pourras la reprendre.'))gClose(false)}
function gBeep(){
  try{const o=gC.createOscillator();o.connect(gC.destination);o.frequency.value=880;o.start();setTimeout(()=>o.stop(),350)}catch(e){}
  if(navigator.vibrate)navigator.vibrate([200,100,200]);
}
function gTick(){
  if(!g||!g.rest)return;
  const left=Math.ceil((g.rest-Date.now())/1000),c=document.getElementById('gcd');
  if(left>0){if(c)c.textContent=gF(left);return}
  g.rest=null;gBeep();gRender();
}
function gDef(id,j){
  const d=g.data[id]||[];
  if(d.length)return d[d.length-1].slice();
  const l=lastL(me(),id);
  if(l){
    const [lo,hi]=E[id][2].split('-').map(Number),kg=Math.max(...l.s.map(x=>x[0]));
    if(kg&&l.s.every(x=>x[1]>=hi))return[kg+2,lo];
    const q=l.s[j]||l.s.at(-1);return[q[0],q[1]];
  }
  return[0,+E[id][2].split('-')[0]];
}
function gAdj(id,d){const i=document.getElementById(id);i.value=Math.max(0,Math.round((+i.value+d)*100)/100)}

function gRender(){
  const el=document.getElementById('gd');if(!el||!g)return;
  const tot=g.ids.reduce((a,id)=>a+ +E[id][1],0),dn=g.ids.reduce((a,id)=>a+(g.data[id]||[]).length,0);
  const head=`<div class=gh><b>Séance ${g.s}</b><span class=m>${SN[g.s][0]}</span><button class=ch onclick="gQuit()">Quitter</button></div><div class=gp><i style="width:${Math.round(dn/tot*100)}%"></i></div>`;
  el.innerHTML=`<div class=gi>${head}${g.end?gEnd():g.rest?gRestV():gSet(dn)}</div>`;
  gSave();
}
function gSet(done){
  const id=g.ids[g.i],e=E[id],tot=+e[1],j=g.j,ga=gBase(id)=='ga',v=gDef(id,j),dn=g.data[id]||[];
  const st=ga?5:/haltère|curl|latérales|élévations/i.test(e[0])?1:2.5;
  return`<p class=m>Exercice ${g.i+1} sur ${g.ids.length}</p>
<h2 style="font-size:1.7rem;margin:0">${e[0]}</h2>
<p class=m>Cible ${e[1]} × ${e[2]}${ga?' secondes':''}. Repos conseillé : ${gL(gRest(id))}.</p>
<div class=sg>${sug(id,lastL(me(),id))}</div>
<p style="text-align:center;margin:4px 0"><b>Série ${j+1} sur ${tot}</b></p>
<div class=gdt>${Array.from({length:tot},(_,k)=>`<i class="${k<dn.length?'ok':k==j?'cur':''}"></i>`).join('')}</div>
${ga?'':`<label class=m>Charge (kg)</label><div class=gs><button onclick="gAdj('gk',-${st})" aria-label="Moins">−</button><input id=gk type=number step=.5 inputmode=decimal value="${v[0]}"><button onclick="gAdj('gk',${st})" aria-label="Plus">+</button></div>`}
<label class=m>${ga?'Durée (secondes)':'Répétitions'}</label>
<div class=gs><button onclick="gAdj('gr',-${ga?5:1})" aria-label="Moins">−</button><input id=gr type=number inputmode=numeric value="${v[1]}"><button onclick="gAdj('gr',${ga?5:1})" aria-label="Plus">+</button></div>
<button class=bt onclick="gOk()">Valider la série</button>
${dn.map((x,k)=>`<p class=m style="margin:2px 0">Série ${k+1} : ${ga?x[1]+' s':x[0]+' kg × '+x[1]}</p>`).join('')}
<details><summary>Fiche de l’exercice</summary><p><b>Exécution :</b> ${e[4]}</p><p><b>À éviter :</b> ${e[5]}</p></details>
${done?`<button class="bt s" onclick="gUndo()">Annuler la dernière série</button>`:''}
<button class="bt s" onclick="gSkip()">Passer cet exercice</button>`;
}
function gOk(){
  const id=g.ids[g.i],ga=gBase(id)=='ga',r=+document.getElementById('gr').value,k=ga?0:+document.getElementById('gk').value;
  if(!(r>0))return alert('Indique les répétitions (ou la durée).');
  (g.data[id]=g.data[id]||[]).push([k||0,r]);
  if(g.data[id].length>=+E[id][1]){g.i++;g.j=0}else g.j++;
  if(g.i>=g.ids.length){g.end=true;g.rest=null}else g.rest=Date.now()+gRest(id)*1000;
  gRender();
}
function gSkip(){g.i++;g.j=0;g.rest=null;if(g.i>=g.ids.length)g.end=true;gRender()}
function gUndo(){
  if(g.i>=g.ids.length)g.i=g.ids.length-1;
  let id=g.ids[g.i];
  if(!(g.data[id]||[]).length&&g.i>0){g.i--;id=g.ids[g.i]}
  if((g.data[id]||[]).length){g.data[id].pop();g.j=g.data[id].length;g.rest=null;g.end=false;gRender()}
}
function gRestV(){
  const e=E[g.ids[g.i]],left=Math.max(0,Math.ceil((g.rest-Date.now())/1000));
  return`<p class=m style="text-align:center">Repos</p>
<div class=big id=gcd style="font-size:5.5rem;text-align:center">${gF(left)}</div>
<p style="text-align:center">Ensuite : <b>${e[0]}</b>, série ${g.j+1} sur ${e[1]}</p>
<div class=row style="justify-content:center"><button class=ch onclick="g.rest+=30000;gRender()">+30 s</button><button class=ch onclick="g.rest=null;gRender()">Passer le repos</button></div>`;
}
function gEnd(){
  const rows=g.ids.filter(id=>(g.data[id]||[]).length),vol=rows.reduce((a,id)=>a+g.data[id].reduce((b,x)=>b+x[0]*x[1],0),0);
  return`<h2 style="font-size:1.7rem;margin:0">Séance terminée</h2>
<p class=m>${rows.length} exercice(s), volume total ${Math.round(vol)} kg</p>
${rows.map(id=>`<div class=cd><b>${E[id][0]}</b><p class=m>${g.data[id].map(x=>gBase(id)=='ga'?x[1]+' s':x[0]+'×'+x[1]).join(' ; ')}</p></div>`).join('')||'<p>Aucune série enregistrée.</p>'}
${rows.length?'<button class=bt onclick="gSaveAll()">Enregistrer la séance</button>':''}
<button class="bt s" onclick="gUndo()">Annuler la dernière série</button>`;
}
function gSaveAll(){
  const p=me(),d=today();let n=0;
  g.ids.forEach(id=>{const a=g.data[id];if(a&&a.length){p.lg.push({d,e:id,s:a});n++}});
  if(n)p.ss.push({d,s:g.s});
  gClose(true);sess=null;tab='home';R();
}

// Ajoute le bouton de lancement dans l'onglet Sport
const gR0=R;
R=function(){
  gR0();
  if(tab==='sport'&&me()&&!document.querySelector('#m .gb')){
    const h=document.querySelector('#m h2');
    if(h)h.insertAdjacentHTML('afterend','<button class="bt gb" onclick="gOpen()">Lancer la séance guidée</button>');
  }
};
R();
