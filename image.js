// Images des exercices : base libre free-exercise-db (domaine public) + lien vidéo de secours.
document.head.insertAdjacentHTML('beforeend','<style>.ex{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.ex img{width:calc(50% - 3px);border-radius:10px;background:#fff}.ex a{width:100%;color:var(--a);font-size:.9rem}</style>');

const IB='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/';
// Motif du nom anglais de chaque exercice dans la base
const IPAT={
dc:/^barbell bench press/,di:/^incline dumbbell press/,de:/machine shoulder.*press/,el:/^side lateral raise/,tr:/^triceps pushdown/,
hs:/^hack squat/,pr:/^leg press/,lc:/^seated leg curl/,le:/^leg extensions/,md:/^standing calf raises?/,
tv:/^wide-grip lat pulldown/,rp:/^seated cable rows/,rh:/^one-arm dumbbell row/,fp:/^face pull/,cu:/^dumbbell (alternate )?bicep curl/,
sr:/^romanian deadlift/,sp:/split squat/,ht:/hip thrust/,cr:/cable crunch/,ga:/^plank$/,ma:/^seated calf raise/};
let IMG=null;

function iLoad(cb){
  if(IMG)return cb();
  try{IMG=JSON.parse(localStorage.getItem('fitimg1'))}catch(e){}
  if(IMG)return cb();
  fetch(IB+'dist/exercises.json').then(r=>r.json()).then(a=>{
    IMG={};
    for(const k in IPAT){
      const m=a.find(x=>IPAT[k].test(String(x.name).toLowerCase()));
      if(m&&m.images&&m.images.length)IMG[k]=m.images.slice(0,2);
    }
    try{localStorage.setItem('fitimg1',JSON.stringify(IMG))}catch(e){}
    cb();
  }).catch(()=>{IMG={};cb()});
}

// Ajoute images et lien vidéo dans la fiche de chaque exercice de l'onglet Sport
const iR=R;
R=function(){
  iR();
  if(tab!=='sport'||!me())return;
  iLoad(()=>{
    if(tab!=='sport'||!me())return;
    const ids=SN[sess||next(me())][1];
    document.querySelectorAll('#m .cd').forEach((d,i)=>{
      const s=d.querySelector('summary'),id=ids[i];
      if(!s||!id||d.querySelector('.ex'))return;
      const im=(IMG&&IMG[id]||[]).map(u=>`<img loading=lazy alt="Démonstration de l’exercice" src="${IB}exercises/${u}" onerror="this.remove()">`).join('');
      const q=encodeURIComponent(E[id][0]+' exercice technique');
      s.insertAdjacentHTML('afterend',`<div class="ex">${im}<a href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">Voir une démonstration en vidéo</a></div>`);
    });
  });
};
R();
