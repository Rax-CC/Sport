// Temps de repos + chronomètre sous chaque exercice, et variantes d'exercices.
// Repos conseillé en secondes (séries de travail)
const RT={dc:150,di:120,de:90,el:60,tr:60,hs:150,pr:120,lc:75,le:75,md:60,tv:120,rp:90,rh:90,fp:60,cu:60,sr:150,sp:90,ht:120,cr:60,ga:45,ma:60};
// Variantes : [nom, conseil d'exécution]
const SV={
dc:[['Développé couché haltères','Plus d’amplitude, chaque bras travaille seul : descends jusqu’à sentir l’étirement des pectoraux.'],['Machine pectorale','Trajectoire guidée, pratique pour finir une série en sécurité.']],
di:[['Développé incliné Smith','Barre guidée à 30-45° ; garde les omoplates serrées.']],
de:[['Développé épaules haltères assis','Banc presque droit, coudes légèrement en avant.']],
el:[['Élévations latérales poulie basse','Tension constante sur toute l’amplitude, un bras à la fois.']],
tr:[['Barre au front (EZ)','Coudes fixes, descends la barre vers le front en contrôle.'],['Extension triceps corde','Écarte la corde en fin de mouvement pour contracter davantage.']],
hs:[['Presse à cuisses','Même intention quadriceps, avec un dos mieux calé.'],['Squat Smith','Pieds légèrement devant la barre, dos neutre.']],
pr:[['Squat gobelet haltère','Haltère contre la poitrine, descends en gardant le buste droit.'],['Hack squat','Pieds plus bas sur la plateforme pour cibler les quadriceps.']],
lc:[['Leg curl couché','Même mouvement allongé, hanches plaquées.']],
le:[['Fentes statiques légères','Charge modérée, genou avant stable au-dessus du pied.']],
md:[['Mollets à la presse','Pieds en bas de la plateforme, jambes presque tendues.']],
tv:[['Tractions assistées','Machine assistée ou élastique ; tire les coudes vers les hanches.'],['Tirage vertical prise serrée','Prise neutre, sollicite bien le bas du grand dorsal.']],
rp:[['Rowing machine (assis)','Poitrine calée, tire les coudes vers l’arrière.']],
rh:[['Rowing barre buste penché','Dos plat, tire la barre vers le bas du ventre.']],
fp:[['Oiseau haltères buste penché','Charge légère, ouvre les bras sans hausser les épaules.'],['Oiseau machine (pec deck inversé)','Coudes à hauteur d’épaules, mouvement lent.']],
cu:[['Curl poulie basse','Tension constante, coudes collés au corps.'],['Curl marteau','Prise neutre, travaille aussi l’avant-bras.']],
sr:[['Soulevé de terre roumain haltères','Haltères le long des cuisses, dos plat.'],['Leg curl assis','Si le dos est fatigué, isole les ischio-jambiers sur machine.']],
sp:[['Fentes marchées','Pas assez long, buste droit.'],['Presse à une jambe','Pied haut sur la plateforme pour impliquer les fessiers.']],
ht:[['Pont fessier avec haltère','Haltère sur le bassin, pousse dans les talons.']],
cr:[['Crunch au sol','Enroule le buste, lombaires au sol.'],['Relevé de jambes','Bassin légèrement basculé, descente lente.']],
ma:[['Mollets debout','Jambes tendues, pour cibler le gros mollet.']]};

// Enregistre chaque variante comme un exercice à part entière (historique séparé)
for(const b in SV)SV[b].forEach((x,j)=>{const e=E[b];E[b+'~'+j]=[x[0],e[1],e[2],e[3],x[1],e[5],'Exercice de base : '+e[0]]});
const SNb=JSON.parse(JSON.stringify(SN));
const sApply=p=>{for(const l in SN)SN[l][1]=SNb[l][1].map(id=>(p.sw&&p.sw[id])||id)};
function sSw(b,v){const p=me();p.sw=p.sw||{};if(v)p.sw[b]=v;else delete p.sw[b];R()}

const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
const fmtL=s=>s>=60?Math.floor(s/60)+' min'+(s%60?' '+s%60+' s':''):s+' s';
let rtT=null,rtId=null,rtEnd=0,rtC=null,rtW=null;
function rtRel(){try{rtW&&rtW.release();rtW=null}catch(e){}}
function rtStart(id,s){
  try{rtC=rtC||new(window.AudioContext||window.webkitAudioContext)();rtC.resume()}catch(e){}
  try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(w=>{rtW=w}).catch(()=>{})}catch(e){}
  rtId=id;rtEnd=Date.now()+s*1000;clearInterval(rtT);rtT=setInterval(rtTick,250);rtTick();
}
function rtStop(){rtId=null;clearInterval(rtT);rtRel();rtTick()}
function rtBeep(){
  try{const o=rtC.createOscillator();o.connect(rtC.destination);o.frequency.value=880;o.start();setTimeout(()=>o.stop(),350)}catch(e){}
  if(navigator.vibrate)navigator.vibrate([200,100,200]);
}
function rtTick(){
  const left=rtId?Math.ceil((rtEnd-Date.now())/1000):0;
  document.querySelectorAll('.rt').forEach(e=>{
    const id=e.dataset.id,s=+e.dataset.s,n=e.querySelector('.rn'),b=e.querySelector('.rb');
    if(id===rtId&&left>0){n.textContent=fmt(left);b.textContent='Arrêter';b.onclick=rtStop}
    else{n.textContent=fmt(s);b.textContent='⏱ Démarrer le repos';b.onclick=()=>rtStart(id,s)}
  });
  if(rtId&&left<=0){
    const id=rtId;rtStop();rtBeep();
    const n=document.querySelector('.rt[data-id="'+id+'"] .rn');if(n)n.textContent='Go !';
  }
}

// Ajoute variantes et chronomètre dans chaque exercice de l'onglet Sport
function sEnh(){
  const p=me(),s=sess||next(p),ids=SN[s][1],base=SNb[s][1];
  document.querySelectorAll('#m .cd').forEach((d,i)=>{
    const id=ids[i],b=base[i],sg=d.querySelector('.sg'),dt=d.querySelector('details');
    if(!id||!sg||!dt||d.querySelector('.rt'))return;
    const v=SV[b]||[],rs=RT[b];
    if(v.length)sg.insertAdjacentHTML('beforebegin',`<select aria-label="Variante de l’exercice" onchange="sSw('${b}',this.value)"><option value="">${E[b][0]} (base)</option>${v.map((x,j)=>`<option value="${b}~${j}" ${id==b+'~'+j?'selected':''}>${x[0]}</option>`).join('')}</select>`);
    dt.insertAdjacentHTML('beforebegin',`<div class=rt data-id="${id}" data-s="${rs}"><p class=m>Repos conseillé : ${fmtL(rs)}</p><div class=st><b class=rn style="font-size:1.4rem;min-width:64px"></b><button class="ch rb"></button></div></div>`);
  });
  rtTick();
}
const sR=R;
R=function(){
  const p=me();if(p)sApply(p);
  sR();
  if(tab==='sport'&&me())sEnh();
};
R();
