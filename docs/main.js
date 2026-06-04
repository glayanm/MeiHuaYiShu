function switchFeature(feat){
  document.querySelectorAll('.feature-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  document.getElementById('feat-'+feat).classList.add('active');
  document.querySelector(`.nav-link[data-feat="${feat}"]`).classList.add('active');
}
function getFortuneClass(f){if(f.includes('大吉'))return'great';if(f.includes('吉'))return'good';if(f.includes('凶'))return'bad';return'neutral'}
function esc(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML}
document.addEventListener('DOMContentLoaded',()=>{
  if(typeof jgInit==='function')jgInit();
  if(typeof nlInit==='function')nlInit();
  if(typeof mhInit==='function')mhInit();
});
