const KEY='loxi_candidates_v1', SETTINGS='loxi_settings_v1';
const $=id=>document.getElementById(id);
let candidates=JSON.parse(localStorage.getItem(KEY)||'[]');
let settings=JSON.parse(localStorage.getItem(SETTINGS)||'{"brand":"LOXI LAB","instagram":""}');
function save(){localStorage.setItem(KEY,JSON.stringify(candidates));render()}
function clean(s){return s.trim().replace(/^@/,'').replace(/[^a-zA-Z0-9._]/g,'').slice(0,24)}
function add(name){name=clean(name);if(!name)return alert('اكتب يوزر صالح أولاً');if(candidates.some(x=>x.name.toLowerCase()===name.toLowerCase()))return alert('اليوزر موجود بالقائمة');candidates.unshift({name,status:'غير مفحوص'});save()}
function render(){
 const list=$('candidateList');if(!list)return;
 $('totalCount').textContent=candidates.length+' اسم';
 if(!candidates.length){list.innerHTML='<div class="empty">ما فيه أسماء للحين. أنشئ اقتراحات وابدأ ترتيب قائمتك.</div>';return}
 list.innerHTML=candidates.map((x,i)=>`<div class="candidate"><span class="handle">@${x.name}</span><span class="state ${x.status==='متاح'?'available':x.status==='غير متاح'?'taken':''}">${x.status}</span><span class="row-actions"><button class="mini" data-check="${i}">تحديث</button><button class="mini" data-del="${i}">×</button></span></div>`).join('');
 list.querySelectorAll('[data-check]').forEach(b=>b.onclick=()=>{let i=+b.dataset.check;let s=prompt('سجّل النتيجة بعد التحقق اليدوي: متاح / غير متاح / غير مفحوص',candidates[i].status);if(['متاح','غير متاح','غير مفحوص'].includes(s)){candidates[i].status=s;save()}});
 list.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{candidates.splice(+b.dataset.del,1);save()});
}
function generate(){
 const seed=clean($('seed').value);if(!seed)return alert('اكتب كلمة أساسية أولاً');
 const n=+$('count').value,mode=$('pattern').value;
 const tails=['x','v','hq','one','real','_','7','77','9','01','i','s','z','q'];
 const made=new Set();
 for(let i=0;i<n*5&&made.size<n;i++){
  let t=tails[Math.floor(Math.random()*tails.length)],name;
  if(mode==='clean')name=seed+['x','v','hq','z'][i%4];
  else if(mode==='dots')name=seed+(i%2?'.':'_')+['x','v','7','q'][i%4];
  else if(mode==='digits')name=seed+Math.floor(10+Math.random()*989);
  else name=[seed+t,seed+'.'+t,seed+'_'+t,t+seed][i%4];
  if(name.length>=2&&name.length<=24)made.add(name);
 }
 [...made].forEach(x=>{if(!candidates.some(c=>c.name===x))candidates.unshift({name:x,status:'غير مفحوص'})});save();
}
if($('generate'))$('generate').onclick=generate;
if($('addOne'))$('addOne').onclick=()=>{add($('manualInput').value);$('manualInput').value=''};
if($('manualInput'))$('manualInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('addOne').click()});
if($('export'))$('export').onclick=()=>{let blob=new Blob([candidates.map(x=>'@'+x.name+' - '+x.status).join('\n')],{type:'text/plain;charset=utf-8'});let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='loxi-usernames.txt';a.click();URL.revokeObjectURL(a.href)};
if($('year'))$('year').textContent=new Date().getFullYear();
if($('brandName'))$('brandName').textContent=settings.brand;
if($('footerBrand'))$('footerBrand').textContent=settings.brand;
if($('adminBrand'))$('adminBrand').value=settings.brand;
if($('instagram'))$('instagram').value=settings.instagram;
if($('saveSettings'))$('saveSettings').onclick=()=>{settings={brand:$('adminBrand').value.trim()||'LOXI LAB',instagram:$('instagram').value.trim()};localStorage.setItem(SETTINGS,JSON.stringify(settings));$('saveMsg').textContent='تم حفظ الإعدادات على هذا الجهاز.'};
if($('clearAll'))$('clearAll').onclick=()=>{if(confirm('متأكد من حذف جميع المرشّحات؟')){candidates=[];save()}};
render();
