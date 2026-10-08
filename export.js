// Export des données pour un coach ou une IA : résumé lisible + sauvegarde JSON.
let xw=4;
const xd=n=>{const d=new Date();d.setDate(d.getDate()-n*7);return iso(d)};

function xTxt(p){
  const from=xd(xw),L=[],gl=G[p.g].replace(/^\S+\s/,'');
  L.push(`# Suivi sport et nutrition, export du ${today()} (${xw} dernières semaines)`);
  L.push(`Profil : ${p.n}. Objectif : ${gl}. Salle : Basic-Fit. Rythme : ${p.spw} séances par semaine (rotation A haut poussée, B bas, C haut tirage, D bas et abdos).`);
  if(p.nu&&p.nu.a&&p.nu.h)L.push(`Âge ${p.nu.a} ans, taille ${p.nu.h} cm, sexe ${p.nu.sx=='f'?'féminin':'masculin'}.`);
  const w=p.wt;
  if(w.length){const a=w.filter(x=>x.d>=from);L.push(`Poids actuel : ${w.at(-1).kg} kg (${w.at(-1).d}). Mesures : ${(a.length?a:w.slice(-3)).map(x=>x.d+' '+x.kg+' kg').join(' ; ')}.`)}
  const ss=p.ss.filter(x=>x.d>=from);
  L.push(`Séances réalisées sur la période : ${ss.length}${ss.length?' ('+ss.map(x=>x.d+' '+x.s).join(', ')+')':''}.`);

  L.push('','## Performances (charge en kg × répétitions, série après série)');
  const b=l=>Math.round(Math.max(...l.s.map(x=>e1(x[0],x[1]))));
  Object.keys(E).forEach(id=>{
    const h=p.lg.filter(l=>l.e===id&&l.d>=from);
    if(!h.length)return;
    L.push(`- ${E[id][0]} (cible ${E[id][1]} × ${E[id][2]}) :`);
    h.slice(-6).forEach(l=>L.push(`  ${l.d} : ${l.s.map(x=>id=='ga'?x[1]+' s':x[0]?x[0]+'×'+x[1]:x[1]+' reps').join(', ')}`));
    if(h.length>1&&id!='ga')L.push(`  Évolution du 1RM estimé : ${b(h[0])} → ${b(h.at(-1))} kg`);
  });
  if(!p.lg.some(l=>l.d>=from))L.push('Aucune performance enregistrée sur la période.');
  const nf=Object.keys(E).filter(id=>!p.lg.some(l=>l.e===id&&l.d>=from)).map(id=>E[id][0]);
  if(nf.length&&nf.length<Object.keys(E).length)L.push('Exercices non réalisés sur la période : '+nf.join(', ')+'.');

  L.push('','## Alimentation');
  if(typeof nCalc=='function'){const r=nCalc(p);if(r)L.push(`Cibles estimées : ${r.lo} à ${r.hi} kcal par jour (entretien environ ${r.t}), protéines ${r.pl} à ${r.ph} g par jour.`)}
  const jr=p.jr||{},days=Object.keys(jr).filter(d=>d>=from&&jr[d].length).sort();
  if(days.length){
    let tk=0,tp=0;
    days.forEach(d=>{const k=jr[d].reduce((a,e)=>a+e.k,0),q=jr[d].reduce((a,e)=>a+e.p,0);tk+=k;tp+=q;L.push(`${d} : ${Math.round(k)} kcal, ${Math.round(q)} g de protéines`)});
    L.push(`Moyenne des jours renseignés : ${Math.round(tk/days.length)} kcal, ${Math.round(tp/days.length)} g de protéines (${days.length} jours).`);
  }else L.push('Journal alimentaire non renseigné sur la période.');

  L.push('','## Demande','Analyse ces données comme un coach de musculation. Propose le programme de la semaine prochaine (séances A, B, C, D adaptées à une salle Basic-Fit) avec, pour chaque exercice, les séries, les répétitions et la charge cible, en appliquant une progression progressive. Signale les stagnations, les déséquilibres ou les signes de fatigue, et ajuste les apports en calories et en protéines à mon objectif. Dis-moi quelles informations supplémentaires te seraient utiles (sommeil, fatigue, douleurs).');
  return L.join('\n');
}
function xCopy(){
  const t=$('#xt');t.select();
  if(navigator.clipboard)navigator.clipboard.writeText(t.value).then(()=>alert('Résumé copié.')).catch(()=>{document.execCommand('copy');alert('Résumé copié.')});
  else{document.execCommand('copy');alert('Résumé copié.')}
}
function xDl(t){
  const p=me(),txt=t=='txt'?xTxt(p):JSON.stringify(p,null,1);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([txt],{type:t=='txt'?'text/plain':'application/json'}));
  a.download='suivi-'+p.n.replace(/\W+/g,'_')+'-'+today()+'.'+t;
  a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

// Ajoute la carte d'export à l'onglet Profil
const xP=vProf;
vProf=function(p){
  return xP(p)+`<div class=cd><h2>Exporter pour un coach ou une IA</h2>
<p class=m>Résumé des dernières semaines avec une consigne prête à coller dans une IA ou à envoyer à ton coach. Tu peux modifier le texte avant de le copier.</p>
<label class=m>Période</label><select onchange="xw=+this.value;R()">${[2,4,8].map(n=>`<option value="${n}" ${n==xw?'selected':''}>${n} semaines</option>`).join('')}</select>
<textarea id=xt rows=10 style="width:100%;font:13px/1.4 ui-monospace,monospace;color:var(--t);background:var(--bg);border:1px solid var(--b);border-radius:10px;padding:9px;margin:6px 0">${esc(xTxt(p))}</textarea>
<button class=bt onclick="xCopy()">Copier le résumé</button>
<button class="bt s" onclick="xDl('txt')">Télécharger (.txt)</button>
<button class="bt s" onclick="xDl('json')">Télécharger toutes les données (.json)</button></div>`;
};
R();
