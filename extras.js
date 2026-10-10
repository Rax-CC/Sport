// Extras : calculateur de disques, planning de repas + liste de courses, bilan hebdomadaire.
const xSave2=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const xCap=s=>s[0].toUpperCase()+s.slice(1),xFr=n=>String(Math.round(n*100)/100).replace('.',',');

/* 1. Calculateur de disques */
const xCfg0=()=>Object.assign({bar:20,pl:'20,10,5,2.5,1.25'},S.pl);
function xDisk(kg){
  if(!(kg>0))return'';
  const c=xCfg0(),P=String(c.pl).split(',').map(x=>Math.round(parseFloat(x)*100)).filter(x=>x>0).sort((a,b)=>b-a);
  let r=Math.round((kg-c.bar)/2*100);
  if(r<0)return'La charge est inférieure à la barre ('+c.bar+' kg).';
  const o=[];
  P.forEach(p=>{while(r>=p){o.push(p/100);r-=p}});
  const tot=c.bar+2*o.reduce((a,b)=>a+b,0);
  return(o.length?'Par côté : '+o.map(xFr).join(' + ')+' kg':'Barre seule')+(r>0?' (charge atteignable : '+xFr(tot)+' kg)':'');
}
function xCalc(){const o=document.getElementById('xo'),i=document.getElementById('xk');if(o&&i)o.textContent=xDisk(+i.value)}
function xGp(){const o=document.getElementById('gpl'),i=document.getElementById('gk');if(o&&i)o.textContent=xDisk(+i.value)}
function xCfg(k,v){S.pl=Object.assign(xCfg0(),{[k]:k=='bar'?+v:v});xSave2();xCalc();xGp()}
function xDiskCard(){
  const c=xCfg0();
  return`<div class="cd xd"><details><summary>Calculateur de disques</summary>
<label class=m>Charge totale visée (kg)</label><input id=xk type=number step=.5 inputmode=decimal oninput="xCalc()">
<label class=m>Poids de la barre (kg)</label><select onchange="xCfg('bar',this.value)">${[20,15,10].map(n=>`<option ${n==c.bar?'selected':''}>${n}</option>`).join('')}</select>
<label class=m>Disques disponibles (kg, séparés par des virgules, décimales avec un point)</label><input value="${c.pl}" onchange="xCfg('pl',this.value)">
<p id=xo style="font-weight:700"></p></details></div>`;
}
// Dans la séance guidée : disques par côté pour les exercices à la barre
if(typeof gSet=='function'){
  const xG0=gSet;
  gSet=function(d){
    let h=xG0(d);const id=g.ids[g.i];
    if(['dc','sr','ht'].includes(id)){
      const k=h.indexOf("gAdj('gk'");
      if(k>0){const e=h.indexOf('</div>',k)+6;h=h.slice(0,e)+'<p class=m id=gpl style="margin:4px 0"></p>'+h.slice(e)}
    }
    return h;
  };
  const xG1=gRender;gRender=function(){xG1();xGp()};
  const xG2=gAdj;gAdj=function(a,b){xG2(a,b);xGp()};
  document.addEventListener('input',e=>{if(e.target.id=='gk')xGp()});
}

/* 2. Planning de repas et liste de courses */
const xDays=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],xSl=['Petit-déjeuner','Déjeuner','Dîner'];
let xd=0;
function xRc(key,p){
  const [a,b,c,d]=key.split('|'),q=RP[a],cc=RC[b],v=RV[c],f=d?RF[d]:null;
  if(!q||!cc||!v)return null;
  const k={perte:.8,muscle:1.2}[p.g]||1,L=[[q[0],q[1],q[2]],[cc[0],cc[1],Math.round(cc[2]*k/5)*5],[v[0],v[1],v[2]]];
  if(f)L.push([f[0],f[1],f[2]]);
  const T=[0,0,0,0];
  L.forEach(x=>{const m=rM(x[0]);for(let i=0;i<4;i++)T[i]+=m[i]*x[2]/100});
  return{t:q[3]+', '+cc[3]+' et '+v[3],L,T};
}
const xKey=()=>[rp,rc,rv,rf].join('|');
function xSaveRec(){const p=me(),k=xKey();p.rs=p.rs||[];if(!p.rs.includes(k))p.rs.push(k);xSave2();alert('Recette enregistrée pour le planning.')}
function xToJ(){const p=me(),r=xRc(xKey(),p);if(r)jPush(p,{n:r.t+' (1 portion)',p:r.T[0],k:r.T[3]})}
if(typeof rRec=='function'){
  const xRR=rRec;
  rRec=function(p){
    return xRR(p)+`<div class=cd><button class=bt onclick="xSaveRec()">Enregistrer pour le planning</button>${typeof jPush=='function'?'<button class="bt s" onclick="xToJ()">Ajouter au journal du jour</button>':''}</div>`;
  };
}
function xAs(d,k,v){const p=me();p.pn=p.pn||{};if(v)p.pn[d+'-'+k]=v;else delete p.pn[d+'-'+k];R()}
function xDel(i){const p=me(),k=p.rs[i];p.rs.splice(i,1);for(const s in p.pn||{})if(p.pn[s]==k)delete p.pn[s];R()}
const xRaw={'Riz cuit':.37,'Pâtes cuites':.4,'Quinoa cuit':.37};
function xCat(n){for(let i=0;i<NC.length;i++)if(NC[i][2].some(f=>f[0]==n))return i;return 9}
function xList(p){
  const tot={};
  Object.values(p.pn||{}).forEach(key=>{const r=key&&xRc(key,p);if(r)r.L.forEach(x=>{(tot[x[0]]=tot[x[0]]||{l:x[1],g:0}).g+=x[2]})});
  return Object.keys(tot).sort((a,b)=>xCat(a)-xCat(b)||a.localeCompare(b)).map(n=>{
    const t=tot[n],raw=xRaw[n];
    return[xCat(n),xCap(t.l)+' : '+(n=='Œufs'?Math.round(t.g/50)+' œufs':t.g+' g')+(raw?' (environ '+Math.round(t.g*raw/5)*5+' g crus)':'')];
  });
}
function xShop(p){
  const L=xList(p);let h='<div class=cd><h2>Liste de courses</h2>';
  if(!L.length)return h+'<p class=m>Choisis des recettes dans le planning pour générer la liste.</p></div>';
  let c=-1;
  L.forEach(x=>{if(x[0]!=c){c=x[0];h+=`<p style="margin:8px 0 2px"><b>${NC[c]?NC[c][0]:'Autres'}</b></p>`}h+=`<p style="margin:2px 0">${x[1]}</p>`});
  return h+'<p class=m>Poids des féculents et des viandes après cuisson, comme dans le guide.</p><button class="bt s" onclick="xCopyShop()">Copier la liste</button></div>';
}
function xCopyShop(){
  const t=xList(me()).map(x=>'- '+x[1]).join('\n');
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>alert('Liste copiée.')).catch(()=>prompt('Copie la liste :',t));
  else prompt('Copie la liste :',t);
}
function xPlan(p){
  const rs=p.rs||[],pn=p.pn||{};
  let h='<div class=cd><h2>Planning de la semaine</h2>';
  if(!rs.length)return h+'<p>Aucune recette enregistrée. Compose une recette dans l’onglet Recettes, puis touche « Enregistrer pour le planning ».</p></div>';
  h+=`<div class=row>${xDays.map((d,i)=>`<button class="ch ${i==xd?'on':''}" onclick="xd=${i};R()">${d}</button>`).join('')}</div>`;
  let k=0,pr=0;
  xSl.forEach((s,i)=>{
    const key=pn[xd+'-'+i],r=key?xRc(key,p):null;
    if(r){k+=r.T[3];pr+=r.T[0]}
    h+=`<label class=m>${s}</label><select onchange="xAs(${xd},${i},this.value)"><option value="">Aucune</option>${rs.map(x=>{const q=xRc(x,p);return q?`<option value="${x}" ${x==key?'selected':''}>${q.t}</option>`:''}).join('')}</select>`;
  });
  const t=typeof nCalc=='function'?nCalc(p):null;
  h+=`<p>Total des repas planifiés : <b>${Math.round(k)} kcal</b>, <b>${Math.round(pr)} g</b> de protéines${t?` <span class=m>(cible du jour : ${t.lo} à ${t.hi} kcal, protéines ${t.pl} à ${t.ph} g)</span>`:''}</p></div>`;
  h+=`<div class=cd><h2>Recettes enregistrées</h2>${rs.map((x,i)=>{const q=xRc(x,p);return q?`<div class=st><span style="flex:1;width:auto;color:var(--t)">${q.t}</span><button class=ch aria-label="Supprimer" onclick="xDel(${i})">✕</button></div>`:''}).join('')}</div>`;
  return h+xShop(p);
}
const xV=vNut;
vNut=function(p){
  const ch=(k,l,a)=>`<button class="ch ${a?'on':''}" onclick="nt='${k}';R()">${l}</button>`;
  if(nt!=='plan')return xV(p).replace('</div>',ch('plan','Planning',0)+'</div>');
  return`<div class=row>${[['bes','Besoins'],['ali','Aliments'],['rep','Repas'],['rec','Recettes'],['jrn','Journal']].map(t=>ch(t[0],t[1],0)).join('')}${ch('plan','Planning',1)}</div>`+xPlan(p);
};

/* 3. Bilan hebdomadaire (onglet Progrès) */
const xMG={dc:'Pectoraux',di:'Pectoraux',de:'Épaules',el:'Épaules',fp:'Épaules',tr:'Triceps',cu:'Biceps',tv:'Dos',rp:'Dos',rh:'Dos',hs:'Quadriceps',pr:'Quadriceps',le:'Quadriceps',sp:'Quadriceps',lc:'Ischios',sr:'Ischios',ht:'Fessiers',md:'Mollets',ma:'Mollets',cr:'Abdos',ga:'Abdos'};
function xBil(p){
  const m0=mon(),m1=iso(new Date(new Date(m0+'T12:00:00').getTime()-7*864e5));
  const cur=l=>l.d>=m0,prv=l=>l.d>=m1&&l.d<m0,A=(a,f)=>a.filter(f),N=[];
  const vol=f=>Math.round(A(p.lg,f).reduce((a,l)=>a+l.s.reduce((b,x)=>b+x[0]*x[1],0),0));
  const v0=vol(cur),v1=vol(prv),ss=A(p.ss,x=>x.d>=m0).length,sets={};
  A(p.lg,cur).forEach(l=>{const g=xMG[l.e.split('~')[0]];if(g)sets[g]=(sets[g]||0)+l.s.length});
  const best=L=>Math.max(...L.map(l=>Math.max(...l.s.map(x=>e1(x[0],x[1])))));
  const rec=Object.keys(E).filter(id=>{
    if(id.split('~')[0]=='ga')return false;
    const a=A(p.lg,l=>l.e==id&&cur(l)),b=A(p.lg,l=>l.e==id&&l.d<m0);
    return a.length&&b.length&&best(a)>best(b)+.01;
  }).map(id=>E[id][0]);
  const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
  const w0=avg(A(p.wt,x=>x.d>=m0).map(x=>x.kg)),w1=avg(A(p.wt,x=>x.d>=m1&&x.d<m0).map(x=>x.kg));
  const jr=p.jr||{},ds=Object.keys(jr).filter(d=>d>=m0&&jr[d].length);
  const k=avg(ds.map(d=>jr[d].reduce((a,e)=>a+e.k,0))),pr=avg(ds.map(d=>jr[d].reduce((a,e)=>a+e.p,0)));
  const t=typeof nCalc=='function'?nCalc(p):null;
  N.push(ss<p.spw?ss+' séance(s) sur '+p.spw+' prévue(s) cette semaine pour l’instant.':'Objectif de séances atteint cette semaine.');
  if(v0&&v1)N.push('Volume d’entraînement '+(v0>=v1?'en hausse':'en baisse')+' de '+Math.abs(Math.round((v0-v1)/v1*100))+' % par rapport à la semaine dernière.');
  if(rec.length)N.push('Nouveaux records estimés : '+rec.join(', ')+'.');
  if(t&&ds.length){
    if(pr<t.pl)N.push('Protéines moyennes ('+Math.round(pr)+' g) sous la cible de '+t.pl+' g.');
    if(k>t.hi*1.05)N.push('Calories moyennes ('+Math.round(k)+') au-dessus de la fourchette visée.');
    else if(k<t.lo*.95)N.push('Calories moyennes ('+Math.round(k)+') en dessous de la fourchette visée.');
  }
  if(w0&&w1)N.push('Poids moyen : '+w0.toFixed(1)+' kg contre '+w1.toFixed(1)+' kg la semaine dernière ('+(w0>=w1?'+':'')+(w0-w1).toFixed(1)+' kg).');
  const bars=Object.keys(sets).sort((a,b)=>sets[b]-sets[a]).map(g=>`<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="width:92px">${g}</span><div style="flex:1;height:8px;border-radius:8px;background:var(--c2)"><div style="width:${Math.min(100,sets[g]/20*100)}%;height:8px;border-radius:8px;background:var(--a)"></div></div><b>${sets[g]}</b></div>`).join('');
  return`<div class=cd><h2>Bilan de la semaine</h2><p class=m>Depuis le lundi ${m0}</p>
<p>Séances : <b>${ss} / ${p.spw}</b></p>
<p>Volume : <b>${v0} kg</b>${v1?` <span class=m>(semaine dernière : ${v1} kg)</span>`:''}</p>
${bars?`<p style="margin-bottom:2px"><b>Séries par groupe</b> <span class=m>(repère courant : 10 à 20 par semaine)</span></p>${bars}`:''}
<p><b>À retenir</b></p><ul style="margin:4px 0;padding-left:20px">${N.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
}
const xP0=vProg;
vProg=function(p){return xBil(p)+xP0(p)};

// Carte du calculateur de disques dans l'onglet Sport
const xR0=R;
R=function(){
  xR0();
  if(tab==='sport'&&me()&&!document.querySelector('#m .xd')){
    const b=document.querySelector('#m>.bt:last-child');
    if(b)b.insertAdjacentHTML('beforebegin',xDiskCard());
  }
};
R();
