// Conserve les valeurs saisies dans la séance (changement de variante, d'onglet, rechargement).
const dK='fitdr1';
let dR=(()=>{try{const o=JSON.parse(localStorage.getItem(dK));if(o&&o.d===today())return o}catch(e){}return{d:today(),v:{}}})();
const dSave=()=>{try{localStorage.setItem(dK,JSON.stringify(dR))}catch(e){}};
const dKey=t=>{const m=(t.id||'').match(/^([kr])(.+?)(\d)$/);return m&&E[m[2]]?S.cur+':'+t.id:null};

document.addEventListener('input',e=>{
  const t=e.target,k=dKey(t);
  if(k&&t.closest&&t.closest('#m')){dR.d=today();dR.v[k]=t.value;dSave()}
});
function dRestore(){
  if(tab!=='sport'||!me())return;
  document.querySelectorAll('#m input[type=number]').forEach(t=>{
    const k=dKey(t);
    if(k&&dR.v[k]!==undefined&&t.value==='')t.value=dR.v[k];
  });
}
function dClear(ids){
  const pre=S.cur+':';
  Object.keys(dR.v).forEach(k=>{
    if(!k.startsWith(pre))return;
    const m=k.slice(pre.length).match(/^[kr](.+?)\d$/);
    if(m&&(!ids||ids.includes(m[1])))delete dR.v[k];
  });
  dSave();
}
// Efface le brouillon une fois la séance enregistrée
const dD=done;
done=function(s){const ids=SN[s][1].slice();dD(s);if(tab==='home')dClear(ids)};
if(typeof gSaveAll=='function'){
  const dG=gSaveAll;
  gSaveAll=function(){const ids=g?Object.keys(g.data):[];dG();dClear(ids)};
}
const dR0=R;
R=function(){dR0();dRestore()};
R();
