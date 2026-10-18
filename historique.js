// Historique : corriger ou supprimer séries, exercices et journées enregistrés.
document.head.insertAdjacentHTML('beforeend','<style>.hc{display:inline-flex;align-items:center;gap:6px;background:var(--c2);border-radius:99px;padding:4px 10px;font-size:.82rem}.hc a{cursor:pointer;color:var(--m)}</style>');

let hI=null,hW=null,hN=10;
const hDate=d=>new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
const hName=id=>E[id]?E[id][0]:id;

function hDays(p){
  const m={};
  p.lg.forEach((l,i)=>{(m[l.d]=m[l.d]||[]).push(i)});
  p.ss.forEach(s=>{m[s.d]=m[s.d]||[]});
  return Object.keys(m).sort().reverse().map(d=>[d,m[d]]);
}
function hEdit(i){hI=i;hW=me().lg[i].s.map(x=>x.slice());R()}
function hSet(j,k,v){hW[j][k]=+v}
function hAdd(){hW.push(hW.length?hW[hW.length-1].slice():[0,0]);R()}
function hRm(j){hW.splice(j,1);R()}
function hCancel(){hI=hW=null;R()}
function hOk(){
  const s=hW.filter(x=>x[1]>0);
  if(!s.length)return alert('Il faut au moins une série avec des répétitions (ou supprime cet exercice).');
  me().lg[hI].s=s;hI=hW=null;R();
}
function hDelLog(i){
  if(!confirm('Supprimer cet exercice de l’historique ?'))return;
  me().lg.splice(i,1);hI=hW=null;R();
}
function hDelDay(d){
  if(!confirm('Supprimer toute la journée du '+hDate(d)+' (séances et exercices) ?'))return;
  const p=me();p.lg=p.lg.filter(l=>l.d!==d);p.ss=p.ss.filter(s=>s.d!==d);hI=hW=null;R();
}
function hDelSs(i){
  if(!confirm('Retirer cette séance du rythme ? Les exercices enregistrés restent dans l’historique.'))return;
  me().ss.splice(i,1);R();
}
function hDedupe(){
  const p=me(),seen=new Set(),n=p.lg.length;
  p.lg=p.lg.filter(l=>{const k=l.d+'|'+l.e+'|'+JSON.stringify(l.s);if(seen.has(k))return false;seen.add(k);return true});
  hI=hW=null;
  alert((n-p.lg.length)+' doublon(s) supprimé(s).');
  R();
}

function hEditor(i,l,ga){
  return`<div style="margin:8px 0;padding:10px;border-radius:14px;background:var(--c2)"><b>${hName(l.e)}</b>
${hW.map((x,j)=>`<div style="display:flex;gap:8px;align-items:center;margin:6px 0"><span class=m style="width:22px">${j+1}</span>${ga?'':`<input type=number step=.5 inputmode=decimal value="${x[0]}" oninput="hSet(${j},0,this.value)" aria-label="Charge en kg"><span class=m>kg</span>`}<input type=number inputmode=numeric value="${x[1]}" oninput="hSet(${j},1,this.value)" aria-label="${ga?'Durée en secondes':'Répétitions'}"><span class=m>${ga?'s':'reps'}</span><button class=ch onclick="hRm(${j})" aria-label="Supprimer la série">✕</button></div>`).join('')}
<div class=row><button class=ch onclick="hAdd()">+ Série</button><button class=ch onclick="hCancel()">Annuler</button><button class=ch onclick="hDelLog(${i})">Supprimer l’exercice</button></div>
<button class=bt onclick="hOk()">Enregistrer les modifications</button></div>`;
}
function vHist(p){
  if(hI!==null&&!p.lg[hI]){hI=hW=null}
  const D=hDays(p);
  let h=`<div class=cd><h2>Historique</h2><p class=m>Corrige ou supprime les séries, les exercices ou les journées enregistrés. Pense à faire une sauvegarde avant de supprimer : c’est définitif.</p><button class="bt s" onclick="hDedupe()">Supprimer les doublons exacts</button></div>`;
  if(!D.length)return h+'<div class=cd><p class=m>Rien d’enregistré pour l’instant.</p></div>';
  D.slice(0,hN).forEach(([d,idx])=>{
    const ss=p.ss.map((s,i)=>[s,i]).filter(x=>x[0].d===d);
    h+=`<div class=cd><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><b style="flex:1">${hDate(d)}</b>${ss.map(x=>`<span class=hc>Séance ${x[0].s} <a onclick="hDelSs(${x[1]})" aria-label="Retirer la séance">✕</a></span>`).join('')}</div>`;
    idx.forEach(i=>{
      const l=p.lg[i],ga=l.e.split('~')[0]=='ga';
      if(hI===i){h+=hEditor(i,l,ga);return}
      h+=`<div style="margin:8px 0 0;padding-top:8px;border-top:1px solid var(--b)"><div style="display:flex;gap:8px;align-items:center"><b style="flex:1">${hName(l.e)}</b><button class=ch onclick="hEdit(${i})">Modifier</button></div><p class=m style="margin:2px 0">${l.s.map(x=>ga?x[1]+' s':x[0]+' kg × '+x[1]).join(' ; ')}</p></div>`;
    });
    h+=`<button class="bt s" style="min-height:40px" onclick="hDelDay('${d}')">Supprimer cette journée</button></div>`;
  });
  if(D.length>hN)h+=`<button class="bt s" onclick="hN+=10;R()">Afficher plus</button>`;
  return h;
}

// Ajoute la carte Historique à l'onglet Progrès
const hP0=vProg;
vProg=function(p){return hP0(p)+vHist(p)};
R();
