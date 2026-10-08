// Recettes : choisis une protéine, puis les compléments compatibles ; le site compose la recette.
// RP : [nom dans le guide, libellé, grammes, nom du plat, étape, minutes, féculents, légumes, lipides, (1 = sucré)]
const RP={
poulet:['Poulet, blanc cuit','blanc de poulet cuit',150,'Poulet poêlé','Coupe le poulet en morceaux, assaisonne (sel, poivre, paprika) et fais-le dorer 8 à 10 min à la poêle.',12,['riz','pat','qui','psd','pdt'],['bro','hav','cou','tom','epi','car'],['hui','avc']],
dinde:['Dinde, blanc cuit','blanc de dinde cuit',150,'Dinde sautée','Émince la dinde et fais-la sauter 6 à 8 min avec de l’ail et des herbes.',10,['riz','pat','qui','pdt','psd'],['cou','hav','epi','tom','car','sal'],['hui','avc']],
boeuf:['Bœuf haché 5 %, cuit','bœuf haché 5 % cuit',120,'Bœuf haché sauté','Fais revenir le bœuf haché 6 à 8 min à la poêle avec de l’oignon, du sel, du poivre et des épices.',10,['pat','riz','pdt','psd'],['tom','cou','hav','bro','sal'],['hui','avc']],
saumon:['Saumon cuit','pavé de saumon cuit',130,'Saumon au four','Enfourne le saumon 12 à 15 min à 180 °C avec du citron et de l’aneth.',15,['riz','pdt','psd','qui','pat'],['bro','hav','epi','cou','sal'],['hui','avc']],
cabillaud:['Cabillaud cuit','filet de cabillaud cuit',150,'Cabillaud au four','Enfourne le cabillaud 12 min à 180 °C avec du citron, du sel et des herbes.',14,['riz','pdt','qui','pat','psd'],['hav','cou','epi','bro','tom','car'],['hui','avc']],
oeufs:['Œufs','œufs',150,'Omelette','Bats 3 œufs, sale, poivre, et cuis l’omelette 3 à 4 min dans une poêle antiadhésive.',6,['pai','pdt','psd','riz'],['epi','tom','cou','hav','sal'],['hui','avc']],
thon:['Thon au naturel (conserve)','thon au naturel',120,'Thon','Égoutte le thon, émiette-le et assaisonne avec du citron, du poivre et des herbes.',3,['pat','riz','qui','pdt','pai'],['tom','hav','sal','cou','car'],['hui','avc']],
tofu:['Tofu ferme','tofu ferme',150,'Tofu sauté','Coupe le tofu en cubes, sèche-le et fais-le dorer 8 min à la poêle avec de la sauce soja et des épices.',10,['riz','qui','pat','psd'],['bro','hav','cou','epi','car'],['hui','avc']],
lentilles:['Lentilles cuites','lentilles cuites',150,'Lentilles mijotées','Réchauffe les lentilles 5 min avec de l’oignon, de l’ail, du cumin et un peu de bouillon.',8,['riz','pdt','psd','pai'],['car','tom','epi','cou'],['hui','avc']],
skyr:['Skyr nature','skyr nature',200,'Bol de skyr','Verse le skyr dans un bol.',2,['avn','pai'],['ban','pmm'],['ama','noi','noz','bca'],1],
fb:['Fromage blanc 0 %','fromage blanc 0 %',200,'Bol de fromage blanc','Verse le fromage blanc dans un bol.',2,['avn','pai'],['ban','pmm'],['ama','noi','noz','bca'],1]};
// RC / RV : [nom dans le guide, libellé, grammes, nom court, étape, minutes]
const RC={
riz:['Riz cuit','riz cuit',150,'riz','Cuis le riz (environ 55 g cru) 10 à 12 min dans l’eau bouillante salée, puis égoutte.',12],
pat:['Pâtes cuites','pâtes cuites',150,'pâtes','Cuis les pâtes (environ 60 g crues) selon le paquet, puis égoutte.',10],
qui:['Quinoa cuit','quinoa cuit',150,'quinoa','Rince le quinoa (environ 55 g cru) et cuis-le 12 min dans deux fois son volume d’eau.',15],
psd:['Patate douce cuite','patate douce cuite',200,'patate douce','Coupe la patate douce en cubes et cuis-la 25 min au four à 200 °C, ou 15 min à la vapeur.',25],
pdt:['Pommes de terre cuites','pommes de terre cuites',200,'pommes de terre','Coupe les pommes de terre en morceaux et cuis-les 15 min à l’eau, ou 25 min au four à 200 °C.',20],
pai:['Pain complet','pain complet',80,'pain complet','Toaste le pain complet.',3],
avn:['Flocons d’avoine','flocons d’avoine',50,'avoine','Ajoute les flocons d’avoine (crus, ou 1 min au micro-ondes avec un peu d’eau).',2]};
const RV={
bro:['Brocoli cuit','brocoli cuit',200,'brocoli','Cuis le brocoli en bouquets à la vapeur 6 à 8 min.',8],
hav:['Haricots verts cuits','haricots verts cuits',200,'haricots verts','Cuis les haricots verts 8 à 10 min à l’eau bouillante ou à la vapeur.',10],
epi:['Épinards cuits','épinards cuits',150,'épinards','Fais tomber les épinards 3 min à la poêle avec un peu d’ail.',4],
cou:['Courgette','courgette',200,'courgette','Coupe la courgette en rondelles et fais-la sauter 6 à 8 min à la poêle.',8],
tom:['Tomate','tomates',150,'tomates','Coupe les tomates en dés : fais-les revenir 5 min ou garde-les crues.',5],
car:['Carotte crue','carottes',150,'carottes','Épluche les carottes, coupe-les en rondelles et cuis-les 10 min à la vapeur.',10],
sal:['Salade verte','salade verte',80,'salade','Lave la salade et assaisonne-la d’un filet de citron.',2],
ban:['Banane','banane',100,'banane','Coupe la banane en rondelles.',1],
pmm:['Pomme','pomme',150,'pomme','Coupe la pomme en dés.',1]};
// RF : [nom dans le guide, libellé, grammes, étape]
const RF={
hui:['Huile d’olive','huile d’olive',10,'Termine avec un filet d’huile d’olive.'],
avc:['Avocat','avocat',50,'Ajoute l’avocat en tranches.'],
ama:['Amandes','amandes',20,'Parsème d’amandes concassées.'],
noi:['Noix','noix',15,'Ajoute les noix concassées.'],
noz:['Noisettes','noisettes',20,'Ajoute les noisettes concassées.'],
bca:['Beurre de cacahuète','beurre de cacahuète',15,'Ajoute une cuillère de beurre de cacahuète.']};
const AST={
'poulet|riz|bro':'Le classique après l’entraînement : protéines maigres, glucides pour le glycogène, fibres du brocoli.',
'saumon|psd|hav':'Les oméga-3 du saumon avec des glucides lents : idéal le soir d’un jour d’entraînement.',
'boeuf|pat|tom':'Une bolognaise express : ajoute de l’ail, de l’oignon et du basilic.',
'oeufs|pai|epi':'Un repas rapide et riche en protéines, parfait quand on manque de temps.',
'skyr|avn|ban':'Le petit-déjeuner de référence : protéines, glucides lents et fruit.',
'thon|pat|tom':'Salade de pâtes express : prête en 10 min et facile à transporter.',
'tofu|riz|bro':'Version végétale complète : ajoute de la sauce soja et du gingembre.',
'dinde|qui|cou':'Un plat léger et riche en protéines, bien adapté à la sèche.',
'lentilles|riz|car':'L’association riz et lentilles complète les protéines végétales.'};

let rp='',rc='',rv='',rf='';
const rCap=s=>s[0].toUpperCase()+s.slice(1);
function rM(n){for(let i=0;i<NC.length;i++){const j=NC[i][2].findIndex(f=>f[0]===n);if(j>=0)return nv(i,j)}return[0,0,0,0]}
function rSel(k,v){if(k=='p'){rp=v;rc=rv=rf=''}else if(k=='c')rc=v;else if(k=='v')rv=v;else rf=v;R()}
const rS=(lab,k,cur,ids,D,ix,none)=>`<label class=m>${lab}</label><select onchange="rSel('${k}',this.value)"><option value="">${none||'Choisir…'}</option>${ids.map((id,i)=>`<option value="${id}" ${id==cur?'selected':''}>${rCap(D[id][ix])}${i?'':' (conseillé)'}</option>`).join('')}</select>`;

function nRec(p){
  const q=RP[rp];
  let h=`<div class=cd><h2>Compose ta recette</h2><p class=m>Choisis une base : le site te propose les aliments qui s’y associent bien, puis écrit la recette.</p>`+rS('1. Protéine','p',rp,Object.keys(RP),RP,3);
  if(q)h+=rS('2. Féculent conseillé','c',rc,q[6],RC,3);
  if(q&&rc)h+=rS(q[9]?'3. Fruit conseillé':'3. Légumes conseillés','v',rv,q[7],RV,3);
  if(q&&rc&&rv)h+=rS('4. Lipides (facultatif)','f',rf,q[8],RF,1,'Sans ajout');
  return h+'</div>'+(q&&rc&&rv?rRec(p):'');
}
function rRec(p){
  const q=RP[rp],c=RC[rc],v=RV[rv],f=rf?RF[rf]:null,k={perte:.8,muscle:1.2}[p.g]||1,gc=Math.round(c[2]*k/5)*5;
  const L=[[q[0],q[1],q[2]],[c[0],c[1],gc],[v[0],v[1],v[2]]];if(f)L.push([f[0],f[1],f[2]]);
  const T=[0,0,0,0];
  L.forEach(x=>{const m=rM(x[0]);for(let i=0;i<4;i++)T[i]+=m[i]*x[2]/100});
  const sw=q[9],min=sw?5:Math.max(q[5],c[5],v[5])+3,a=AST[rp+'|'+rc+'|'+rv];
  const st=sw?[q[4],c[4],v[4],f&&f[3],'Mélange ou déguste tel quel.']:[c[4],v[4],q[4],'Dresse l’assiette : légumes, '+c[3]+' et protéine côte à côte.'+(f?' '+f[3]:'')+' Assaisonne selon ton goût.'];
  return`<div class=cd><h2>${q[3]}, ${c[3]} et ${v[3]}</h2>
<p class=m>1 portion, environ ${min} min. Féculent ajusté à ton objectif.</p>
<p><b>Ingrédients</b></p><ul>${L.map(x=>`<li>${rCap(x[1])} : ${x[0]=='Œufs'?'3 (150 g)':x[2]+' g'}</li>`).join('')}</ul>
<p><b>Préparation</b></p><ol>${st.filter(Boolean).map(s=>`<li>${s}</li>`).join('')}</ol>
<p><b>Apports pour 1 portion</b> : environ ${Math.round(T[3])} kcal, ${Math.round(T[0])} g de protéines, ${Math.round(T[1])} g de glucides, ${Math.round(T[2])} g de lipides.</p>
<p class=m>Pourquoi ça marche : ${q[1]} pour les protéines (récupération, satiété), ${c[1]} pour l’énergie, ${v[1]} pour les fibres et micronutriments${f?', '+f[1]+' pour les lipides de qualité':''}.</p>
${a?`<p class=m>${a}</p>`:''}<p class=m>${sw?'Idéal au petit-déjeuner ou en collation.':'Idéal au déjeuner, au dîner ou après l’entraînement.'} Valeurs calculées d’après le guide des aliments.</p></div>`;
}

// Ajoute le sous-onglet Recettes à l'onglet Nutrition
const nV=vNut;
vNut=function(p){
  const ch=a=>`<button class="ch ${a?'on':''}" onclick="nt='rec';R()">Recettes</button>`;
  if(nt!=='rec')return nV(p).replace('</div>',ch(0)+'</div>');
  return`<div class=row>${[['bes','Besoins'],['ali','Aliments'],['rep','Repas']].map(t=>`<button class=ch onclick="nt='${t[0]}';R()">${t[1]}</button>`).join('')}${ch(1)}</div>`+nRec(p);
};
R();
