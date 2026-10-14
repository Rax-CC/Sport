// Séance guidée : écran de validation repensé, liste « À suivre » visible, presse inclinée.
// À charger juste APRÈS guide.js et AVANT extras.js.
document.head.insertAdjacentHTML('beforeend',`<style>
.gcs{display:grid;grid-template-columns:1fr 1fr;gap:10px}.gcs.one{grid-template-columns:1fr}
.gc{background:var(--c);border-radius:22px;padding:14px 10px 10px;display:flex;flex-direction:column;align-items:center;gap:2px}
.gc input{width:100%;text-align:center;font-size:2.7rem;font-weight:800;background:transparent;border:0;height:62px;padding:0}
.gc input:focus{border:0;box-shadow:inset 0 -3px 0 var(--a)}
.gb2{display:flex;gap:8px;width:100%;margin-top:6px}
.gb2 button{flex:1;height:54px;border:0;border-radius:14px;background:var(--c2);color:var(--t);font-size:1.6rem}
.gcp{display:inline-block;background:var(--c2);border-radius:99px;padding:4px 10px;font-size:.82rem;margin:2px 4px 2px 0}
.gva{position:sticky;bottom:0;padding:12px 0 4px;background:linear-gradient(to top,var(--bg) 70%,transparent)}
.gva .bt{margin:0;min-height:60px;font-size:1.15rem}
.gup{display:flex;flex-direction:column;gap:2px;font-size:.82rem;color:var(--m)}
.gup button{background:none;border:0;color:var(--m);text-align:left;padding:3px 0;font:inherit;font-size:.82rem}
.gup.c{align-items:center;text-align:center}
.gar{display:flex;gap:8px;flex-wrap:wrap}
</style>`);

// Presse à cuisses inclinée (machine de la salle)
E.pr[0]='Presse à cuisses inclinée';
E.pr[4]='Dos et bassin bien plaqués contre l’assise, pieds largeur d’épaules, descente jusqu’à environ 90° sans décoller le bassin, poussée sans verrouiller les genoux. Règle les butées de sécurité.';
E.pr[5]='Bassin qui décolle en bas, genoux qui rentrent vers l’intérieur, verrouillage brutal des genoux.';
if(E['hs~0'])E['hs~0'][0]='Presse à cuisses inclinée';
if(typeof SV!='undefined'&&SV.hs)SV.hs[0][0]='Presse à cuisses inclinée';

// Exercices à suivre (hors exercice courant, dans l'ordre, ceux qui ne sont pas terminés)
function gUp(){
  const n=g.ids.length,out=[];
  for(let k=1;k<n;k++){const i=(g.i+k)%n;if(!gDone(g.ids[i]))out.push(i)}
  return out;
}
function gUpV(c){
  const u=gUp();
  if(!u.length)return'';
  return`<div class="gup ${c||''}"><span>À suivre</span>${u.slice(0,5).map(i=>{const id=g.ids[i];return`<button onclick="gGo(${i})">${E[id][0]}, ${E[id][1]} × ${E[id][2]}${g.sk[id]?' (passé)':''}</button>`}).join('')}${u.length>5?`<span>et ${u.length-5} autre(s)</span>`:''}</div>`;
}

// Écran de série
gSet=function(){
  const id=g.ids[g.i],e=E[id],tot=gTot(id),dn=g.data[id]||[],j=dn.length,ga=gBase(id)=='ga',l=lastL(me(),id);
  const fs=x=>ga?x[1]+' s':x[0]+' kg × '+x[1];
  const chips=dn.map((x,k)=>`<span class=gcp>S${k+1} · ${fs(x)}</span>`).join('');
  const any=Object.keys(g.data).some(k=>g.data[k].length);
  const top=`<div><p class=m style="margin:0">Exercice ${g.i+1} sur ${g.ids.length}</p><h2 style="font-size:1.7rem;margin:2px 0 6px">${e[0]}</h2>${gSel(id)}</div>`;
  const fiche=`<details><summary>Fiche de l’exercice</summary><p><b>Exécution :</b> ${e[4]}</p><p><b>À éviter :</b> ${e[5]}</p></details>`;
  const lst=`<details><summary>Liste complète et navigation</summary>${gList()}</details>`;
  if(j>=tot){
    const n=gNext(g.i);
    return top+`<p><b>Exercice terminé</b></p><div>${chips}</div>`
      +`<div class=gva>${n>=0?`<button class=bt onclick="gGo(${n})">Exercice suivant</button>`:'<button class=bt onclick="gFinish()">Terminer la séance</button>'}</div>`
      +`<div class=gar><button class=ch onclick="gUndo()">Annuler la dernière série</button></div>`+gUpV()+fiche+lst;
  }
  const v=gDef(id),st=ga?5:/haltère|curl|latérales|élévations/i.test(e[0])?1:2.5;
  const card=(lab,idn,val,unit,step)=>`<div class=gc><span class=m>${lab}</span><input id=${idn} type=number ${idn=='gk'?'step=.5 inputmode=decimal':'inputmode=numeric'} value="${val}"><span class=m>${unit}</span><div class=gb2><button onclick="gAdj('${idn}',-${step})" aria-label="Moins">−</button><button onclick="gAdj('${idn}',${step})" aria-label="Plus">+</button></div></div>`;
  return top+`<div class=sg>${sug(id,l)}</div>
<p class=m style="margin:0">${l?'Dernière fois ('+l.d+') : '+l.s.map(x=>ga?x[1]+' s':x[0]+'×'+x[1]).join(' · '):'Première fois sur cet exercice'}. Cible ${e[1]} × ${e[2]}${ga?' s':''}, repos ${gL(gRest(id))}.${g.sk[id]?' Exercice passé plus tôt.':''}</p>
<p style="text-align:center;margin:2px 0"><b>Série ${j+1} sur ${tot}</b></p>
<div class=gdt>${Array.from({length:tot},(_,k)=>`<i class="${k<j?'ok':k==j?'cur':''}"></i>`).join('')}</div>
<div>${chips}</div>
<div class="gcs ${ga?'one':''}">${ga?'':card('Charge','gk',v[0],'kg',st)}${card(ga?'Durée':'Répétitions','gr',v[1],ga?'secondes':'reps',ga?5:1)}</div>
<div class=gva><button class=bt onclick="gOk()">Valider la série</button></div>
<div class=gar><button class=ch onclick="gSkip()">Passer (machine occupée)</button>${any?'<button class=ch onclick="gUndo()">Annuler la dernière série</button>':''}</div>`
    +gUpV()+fiche+lst;
};

// Écran de repos : liste « À suivre » en petit sous le chrono
gRestV=function(){
  const nx=g.ids[g.i],e=E[nx],left=Math.max(0,Math.ceil((g.rest-Date.now())/1000));
  return`<p class=m style="text-align:center;margin:0">Repos</p>
<div class=big id=gcd style="font-size:5.5rem;text-align:center;line-height:1.1">${gF(left)}</div>
<p style="text-align:center;margin:0">Ensuite : <b>${e[0]}</b>, série ${gN(nx)+1} sur ${e[1]}</p>
${gUpV('c')}
<div class=row style="justify-content:center"><button class=ch onclick="g.rest+=30000;gRender()">+30 s</button><button class=ch onclick="g.rest=null;gRender()">Passer le repos</button></div>
<details><summary>Changer d’exercice (machine occupée ?)</summary>${gList()}</details>`;
};
