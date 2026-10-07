// Onglet Nutrition : besoins et déficit, guide des aliments, associations de repas.
// Se branche sur index.html par une seule ligne : <script src="nutrition.js"></script>
document.head.insertAdjacentHTML('beforeend','<style>table.nt{width:100%;border-collapse:collapse;font-size:.88rem}.nt td,.nt th{padding:6px 4px;border-bottom:1px solid var(--b);text-align:right}.nt td:first-child,.nt th:first-child{text-align:left}</style>');

// [nom, protéines, glucides, lipides, kcal] pour 100 g (valeurs indicatives)
const NC=[
['Protéines','Récupération et construction du muscle.',[
['Poulet, blanc cuit',31,0,3.5,165],['Dinde, blanc cuit',29,0,2,140],['Bœuf haché 5 %, cuit',26,0,7,170],['Saumon cuit',22,0,12,200],['Cabillaud cuit',23,0,1,105],['Œufs',13,1,10,145],['Skyr nature',11,4,0.2,62],['Fromage blanc 0 %',8,4,0.2,48],['Thon au naturel (conserve)',25,0,1,110],['Tofu ferme',12,2,7,125],['Lentilles cuites',9,20,0.4,115]]],
['Glucides','Énergie et reconstitution du glycogène.',[
['Riz cuit',2.7,28,0.3,130],['Pâtes cuites',5.5,31,1,157],['Pommes de terre cuites',2,17,0.1,80],['Patate douce cuite',1.6,20,0.1,90],['Flocons d’avoine',13,60,7,370],['Pain complet',9,42,3,250],['Quinoa cuit',4.4,21,1.9,120],['Pois chiches cuits',9,27,3,165],['Banane',1,23,0.3,90],['Pomme',0.3,14,0.2,52]]],
['Lipides','Hormones, vitamines, énergie. À doser : très caloriques.',[
['Amandes',21,22,50,580],['Noix',15,14,65,650],['Noisettes',15,17,61,630],['Huile d’olive',0,0,100,880],['Avocat',2,9,15,160],['Beurre de cacahuète',25,20,50,590]]],
['Légumes et fibres','Fibres, vitamines, minéraux et satiété pour très peu de calories.',[
['Brocoli cuit',2.4,7,0.4,35],['Haricots verts cuits',1.9,5,0.3,30],['Épinards cuits',3,4,0.4,25],['Courgette',1.2,3,0.3,17],['Tomate',0.9,3.9,0.2,18],['Salade verte',1.4,2,0.2,15],['Carotte crue',0.9,10,0.2,41]]],
['Produits pratiques','Pour tenir le plan quand on manque de temps.',[],
 'Skyr et fromage blanc, thon en boîte, œufs durs, légumes surgelés nature, riz ou quinoa en sachet, lentilles et pois chiches en conserve (rincés). Garde toujours une source de protéines prête à manger.']];

const NG={
perte:'Déficit modéré d’environ 15 à 20 % : perte progressive en gardant les performances et le muscle. Vise environ 0,5 % de ton poids par semaine ; si tu perds plus vite, mange un peu plus.',
muscle:'Léger surplus d’environ 5 à 10 % pour prendre du muscle sans trop de gras. Si le poids monte de plus de 0,25 à 0,5 kg par semaine, réduis un peu.',
recomp:'Proche des besoins d’entretien (0 à -5 %), avec beaucoup de protéines : le poids bouge peu, mais le corps change. Juge sur 4 à 6 semaines (photos, mensurations, charges).'};
const NT={
perte:'Sèche : priorité aux protéines et aux aliments rassasiants (légumes, légumineuses, skyr), glucides adaptés à l’activité (un peu plus les jours d’entraînement), lipides suffisants.',
muscle:'Prise de muscle : ajoute des glucides autour de l’entraînement et des lipides de qualité (huile d’olive, oléagineux, beurre de cacahuète).',
recomp:'Recomposition : protéines élevées à chaque repas, glucides concentrés autour de l’entraînement, légumes à volonté.'};
const NM=[
['🍳 Petit-déjeuner','Protéines + glucides + fruit, un peu de lipides','Skyr + flocons d’avoine + amandes + banane','Skyr : protéines et satiété. Avoine : glucides à diffusion lente. Amandes : bons lipides. Banane : énergie et potassium.'],
['🥗 Déjeuner','Protéines + glucides + légumes','Poulet + riz + brocoli + un filet d’huile d’olive','Protéines pour la récupération, glucides pour l’énergie, légumes pour les fibres et les vitamines, huile pour les acides gras essentiels.'],
['🍌 Avant l’entraînement (1 à 2 h avant)','Glucides faciles à digérer + un peu de protéines, peu de lipides et de fibres','Fromage blanc + banane, ou pain + œuf','De l’énergie disponible sans lourdeur à la digestion.'],
['🥤 Après l’entraînement','Protéines + glucides','Skyr ou thon + riz ou pâtes + légumes','Les glucides reconstituent le glycogène, les protéines fournissent les acides aminés de la récupération.'],
['🍽️ Dîner','Protéines + légumes + glucides selon l’activité du jour','Poisson + patate douce + haricots verts, ou omelette + légumes + pain complet','Repas rassasiant et léger ; adapte les glucides à ta journée.'],
['🍫 Gestion des écarts','Pas de compensation','Reprends normalement au repas suivant, garde les protéines, évite de sauter un repas pour « rattraper ».','Un écart ne ruine pas une semaine : c’est la régularité qui fait le résultat.']];

let nt='bes',nc=0;
const nv=(ci,fi)=>(S.nf&&S.nf[NC[ci][2][fi][0]])||NC[ci][2][fi].slice(1);

function nCalc(p){
  const n=p.nu,w=p.wt.at(-1);
  if(!n||!w||!n.a||!n.h)return null;
  const t=(10*w.kg+6.25*n.h-5*n.a+(n.sx=='f'?-161:5))*n.ac;
  const f={perte:[.8,.85],muscle:[1.05,1.1],recomp:[.95,1]}[p.g],q={perte:[1.8,2.2],muscle:[1.6,2],recomp:[1.8,2.2]}[p.g];
  const r=x=>Math.round(x/10)*10;
  return{t:r(t),lo:r(t*f[0]),hi:r(t*f[1]),pl:Math.round(w.kg*q[0]),ph:Math.round(w.kg*q[1])};
}
function nSet(k,v){const p=me();p.nu=p.nu||{sx:'h',a:'',h:'',ac:1.4};p.nu[k]=v;R()}

function vNut(p){
  const T=[['bes','Besoins'],['ali','Aliments'],['rep','Repas']];
  return`<div class=row>${T.map(t=>`<button class="ch ${t[0]==nt?'on':''}" onclick="nt='${t[0]}';R()">${t[1]}</button>`).join('')}</div>`+({bes:nBes,ali:nAli,rep:nRep}[nt])(p);
}
function nBes(p){
  const n=p.nu||{sx:'h',a:'',h:'',ac:1.4},r=nCalc(p);
  return`<div class=cd><h2>Tes besoins</h2>
<label class=m>Sexe</label><select onchange="nSet('sx',this.value)"><option value=h ${n.sx!='f'?'selected':''}>Homme</option><option value=f ${n.sx=='f'?'selected':''}>Femme</option></select>
<label class=m>Âge</label><input type=number inputmode=numeric value="${n.a}" onchange="nSet('a',+this.value)">
<label class=m>Taille (cm)</label><input type=number inputmode=numeric value="${n.h}" onchange="nSet('h',+this.value)">
<label class=m>Activité</label><select onchange="nSet('ac',+this.value)">${[[1.4,'Plutôt sédentaire + 3-4 séances'],[1.55,'Actif au quotidien + 3-4 séances'],[1.7,'Très actif ou métier physique']].map(o=>`<option value="${o[0]}" ${o[0]==n.ac?'selected':''}>${o[1]}</option>`).join('')}</select></div>`
  +(r?`<div class=cd><p class=m>${G[p.g]}</p><p>Besoins d’entretien : <b>environ ${r.t} kcal par jour</b></p>
<div class=big style="font-size:2.2rem">${r.lo} à ${r.hi}</div><p>kcal par jour à viser</p>
<p>Protéines : <b>${r.pl} à ${r.ph} g par jour</b></p><p>${NG[p.g]}</p>
<p class=m>Estimation indicative (formule de Mifflin-St Jeor), pas un avis médical. Ajuste selon l’évolution de ton poids sur 2 à 3 semaines et évite les déficits trop importants.</p></div>`
  :`<div class=cd><p>Renseigne ton âge et ta taille ci-dessus, et ton poids dans l’onglet Profil, pour obtenir ton estimation.</p></div>`);
}
function nAli(p){
  const c=NC[nc];
  let h=`<div class=row>${NC.map((x,i)=>`<button class="ch ${i==nc?'on':''}" onclick="nc=${i};R()">${x[0]}</button>`).join('')}</div><div class=cd><h2>${c[0]}</h2><p class=m>${c[1]}</p>`;
  if(!c[2].length)return h+`<p>${c[3]}</p></div>`;
  h+=`<p class=m>Pour 100 g, valeurs indicatives. Touche ✎ pour les adapter à ta marque.</p><table class=nt><tr><th>Aliment</th><th>Prot.</th><th>Gluc.</th><th>Lip.</th><th>kcal</th><th></th></tr>`;
  c[2].forEach((f,i)=>{const v=nv(nc,i);
    h+=`<tr><td>${f[0]}</td><td>${v[0]}</td><td>${v[1]}</td><td>${v[2]}</td><td>${v[3]}</td><td><button class=ch style="padding:2px 8px" aria-label="Modifier" onclick="nEd(${nc},${i})">✎</button></td></tr>`});
  return h+'</table></div>';
}
function nEd(ci,fi){
  const f=NC[ci][2][fi];
  const s=prompt(f[0]+' pour 100 g\nProtéines / glucides / lipides / kcal, séparés par /\n(vide = valeurs d’origine)',nv(ci,fi).join(' / '));
  if(s===null)return;
  S.nf=S.nf||{};
  const a=s.split('/').map(x=>parseFloat(x.replace(',','.')));
  if(!s.trim())delete S.nf[f[0]];
  else if(a.length==4&&a.every(x=>x>=0))S.nf[f[0]]=a;
  else return alert('Saisis 4 valeurs séparées par /, par exemple 31 / 0 / 3,5 / 165.');
  R();
}
function nRep(p){
  return`<div class=cd><h2>Construire un repas</h2><p>${NT[p.g]}</p><p class=m>Repère simple : la moitié de l’assiette en légumes, un quart de protéines, un quart de féculents, plus un peu de lipides.</p></div>`
  +NM.map(m=>`<div class=cd><b>${m[0]}</b><p class=m>${m[1]}</p><p>${m[2]}</p><p class=m>Pourquoi : ${m[3]}</p></div>`).join('');
}

// Branche l'onglet Nutrition dans la navigation existante
const nR=R;
R=function(){
  if(tab!=='nut'||!me()){nR();nNav();return}
  tab='home';nR();tab='nut';
  $('#m').innerHTML=vNut(me());nNav();
};
function nNav(){
  const n=$('#n');
  if(tab==='nut')n.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
  n.insertAdjacentHTML('beforeend',`<button class="${tab=='nut'?'on':''}" onclick="tab='nut';R()">🍽️<br>Nutrition</button>`);
}
R();
