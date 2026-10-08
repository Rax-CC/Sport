// Journal des repas : total du jour comparé aux cibles de calories et de protéines.
let jd=today();
const jT=p=>(p.jr&&p.jr[jd])||[];
function jPush(p,e){p.jr=p.jr||{};(p.jr[jd]=p.jr[jd]||[]).push(e);R()}
function jAdd(){
  const v=$('#jf').value,g=+$('#jg').value;
  if(!v||!(g>0))return alert('Choisis un aliment et une quantité en grammes.');
  const [ci,fi]=v.split(':').map(Number),m=nv(ci,fi);
  jPush(me(),{n:NC[ci][2][fi][0]+' ('+g+' g)',p:m[0]*g/100,k:m[3]*g/100});
}
function jFree(){
  const n=$('#jn').value.trim(),k=+$('#jk').value,pr=+$('#jp').value||0;
  if(!n||!(k>0))return alert('Indique un nom et des calories.');
  jPush(me(),{n,p:pr,k});
}
function jDel(i){me().jr[jd].splice(i,1);R()}

function jBar(v,lo,hi,u){
  const w=Math.min(100,Math.round(v/hi*100));
  return`<p>${Math.round(v)} / ${lo} à ${hi} ${u}</p><div style="background:var(--b);border-radius:8px;height:10px"><div style="width:${w}%;height:10px;border-radius:8px;background:var(--a)"></div></div>`;
}
function nJrn(p){
  const L=jT(p),k=L.reduce((a,e)=>a+e.k,0),pr=L.reduce((a,e)=>a+e.p,0),r=nCalc(p);
  const opts=NC.map((c,ci)=>c[2].length?`<optgroup label="${c[0]}">${c[2].map((f,fi)=>`<option value="${ci}:${fi}">${f[0]}</option>`).join('')}</optgroup>`:'').join('');
  return`<div class=cd><h2>Journal du jour</h2>
<input type=date value="${jd}" onchange="jd=this.value||today();R()">
${r?`<p class=m>Calories</p>${jBar(k,r.lo,r.hi,'kcal')}<p class=m>Protéines</p>${jBar(pr,r.pl,r.ph,'g')}`
:`<p>${Math.round(k)} kcal et ${Math.round(pr)} g de protéines aujourd’hui.</p><p class=m>Renseigne ton âge et ta taille dans Besoins (et ton poids dans Profil) pour voir ta cible.</p>`}</div>
<div class=cd><h2>Ajouter un aliment</h2>
<select id=jf><option value="">Aliment…</option>${opts}</select>
<input id=jg type=number inputmode=numeric placeholder="Quantité en grammes">
<button class=bt onclick="jAdd()">Ajouter</button></div>
<div class=cd><h2>Ajout libre</h2>
<input id=jn placeholder="Nom (plat, produit…)">
<input id=jk type=number inputmode=numeric placeholder="Calories (kcal)">
<input id=jp type=number inputmode=numeric placeholder="Protéines (g), facultatif">
<button class="bt s" onclick="jFree()">Ajouter</button></div>
<div class=cd><h2>Repas enregistrés</h2>${L.length?L.map((e,i)=>`<div class=st><span style="flex:1;width:auto;color:var(--t)">${esc(e.n)} : ${Math.round(e.k)} kcal, ${Math.round(e.p)} g prot.</span><button class=ch aria-label="Supprimer" onclick="jDel(${i})">✕</button></div>`).join(''):'<p class=m>Rien d’enregistré ce jour-là.</p>'}</div>`;
}

// Ajoute le sous-onglet Journal à l'onglet Nutrition
const jV=vNut;
vNut=function(p){
  const ch=a=>`<button class="ch ${a?'on':''}" onclick="nt='jrn';R()">Journal</button>`;
  if(nt!=='jrn')return jV(p).replace('</div>',ch(0)+'</div>');
  return`<div class=row>${[['bes','Besoins'],['ali','Aliments'],['rep','Repas'],['rec','Recettes']].map(t=>`<button class=ch onclick="nt='${t[0]}';R()">${t[1]}</button>`).join('')}${ch(1)}</div>`+nJrn(p);
};
R();
