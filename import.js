// Sauvegarde complète et import (fusion sans doublon).
const iDate=/^\d{4}-\d\d-\d\d$/,iN=x=>Number.isFinite(+x)?+x:0,iSort=(x,y)=>x.d<y.d?-1:x.d>y.d?1:0;

function iClean(q){
  const A=v=>Array.isArray(v)?v:[];
  const p={id:iN(q.id)||Date.now(),n:String(q.n||'Profil').slice(0,40),g:G[q.g]?q.g:'recomp',spw:q.spw==3?3:4,
    wt:A(q.wt).filter(x=>x&&iDate.test(x.d)&&+x.kg>0).map(x=>({d:x.d,kg:+x.kg})),
    lg:A(q.lg).filter(l=>l&&E[l.e]&&iDate.test(l.d)&&Array.isArray(l.s)).map(l=>({d:l.d,e:l.e,s:l.s.filter(x=>Array.isArray(x)&&+x[1]>0).map(x=>[iN(x[0]),iN(x[1])])})).filter(l=>l.s.length),
    ss:A(q.ss).filter(x=>x&&O.includes(x.s)&&iDate.test(x.d)).map(x=>({d:x.d,s:x.s})),
    jr:{},sw:{}};
  if(q.nu&&typeof q.nu=='object')p.nu={sx:q.nu.sx=='f'?'f':'h',a:iN(q.nu.a)||'',h:iN(q.nu.h)||'',ac:[1.4,1.55,1.7].includes(+q.nu.ac)?+q.nu.ac:1.4};
  if(q.jr&&typeof q.jr=='object')for(const d in q.jr)if(iDate.test(d)&&Array.isArray(q.jr[d]))p.jr[d]=q.jr[d].filter(e=>e&&+e.k>=0).map(e=>({n:String(e.n||'').slice(0,80),p:iN(e.p),k:iN(e.k)}));
  if(q.sw&&typeof q.sw=='object')for(const b in q.sw)if(E[b]&&E[q.sw[b]])p.sw[b]=q.sw[b];
  return p;
}
function iMerge(a,b){
  const u=(x,y,k)=>{const m=new Map();[...x,...y].forEach(e=>m.set(k(e),e));return[...m.values()]};
  a.wt=u(a.wt||[],b.wt,e=>e.d).sort(iSort);
  a.lg=u(a.lg||[],b.lg,e=>e.d+'|'+e.e).sort(iSort);
  a.ss=u(a.ss||[],b.ss,e=>e.d+'|'+e.s).sort(iSort);
  a.jr=a.jr||{};
  for(const d in b.jr)a.jr[d]=u(a.jr[d]||[],b.jr[d],e=>e.n+'|'+e.k+'|'+e.p);
  a.nu=a.nu||b.nu;
  a.sw=Object.assign({},b.sw,a.sw||{});
}
function iFile(inp){
  const f=inp.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const j=JSON.parse(r.result),L=Array.isArray(j.p)?j.p:[j];
      if(!L.length||!L.every(q=>q&&typeof q=='object'&&('lg' in q||'wt' in q||'n' in q)))throw 0;
      let add=0,mer=0;
      L.forEach(q=>{const c=iClean(q),ex=S.p.find(x=>x.id===c.id);if(ex){iMerge(ex,c);mer++}else{S.p.push(c);add++}});
      if(j.nf&&typeof j.nf=='object'){S.nf=S.nf||{};for(const k in j.nf)if(Array.isArray(j.nf[k])&&j.nf[k].length==4&&j.nf[k].every(x=>+x>=0))S.nf[k]=j.nf[k].map(Number)}
      if(!S.cur&&S.p.length)S.cur=S.p[0].id;
      alert('Import terminé : '+add+' profil(s) ajouté(s), '+mer+' fusionné(s).');
      R();
    }catch(e){alert('Fichier non reconnu. Choisis une sauvegarde .json exportée depuis ce site.')}
  };
  r.readAsText(f);inp.value='';
}
function iFull(){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify({p:S.p,nf:S.nf||{}},null,1)],{type:'application/json'}));
  a.download='sauvegarde-complete-'+today()+'.json';
  a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

// Ajoute la carte de sauvegarde à l'onglet Profil
const iP=vProf;
vProf=function(p){
  return iP(p)+`<div class=cd><h2>Sauvegarde et import</h2>
<p class=m>Pour retrouver tes données sur un autre appareil : sauvegarde ici, envoie le fichier vers l’autre appareil, puis importe-le. Les données déjà présentes ne sont pas dupliquées.</p>
<button class="bt s" onclick="iFull()">Sauvegarde complète (tous les profils, .json)</button>
<label class=bt style="display:block;text-align:center;cursor:pointer">Importer une sauvegarde (.json)<input type=file accept=".json,application/json" onchange="iFile(this)" hidden></label></div>`;
};
R();
