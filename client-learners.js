// Register several learners alongside a customer, with independent learner records.
const beforeClientLearnersForm=clientForm;
clientForm=function(id){
  beforeClientLearnersForm(id);
  const form=document.querySelector('#client-form'),section=document.createElement('section');
  section.className='client-learner-section';
  section.innerHTML='<div class="form-section">学员资料</div><p>每位学员独立登记。可先保存资料，之后关联课程订单与活动。</p><label style="display:flex;align-items:center;gap:12px;margin:16px 0"><input type="checkbox" id="contact-as-learner"> 联系人也是第 1 位学员（自动带入资料）</label><div id="client-learner-rows"></div><button type="button" class="button primary" data-client-learner-add>＋ 学员资料</button>';
  form.querySelector('.modal-body').append(section);
  let sequence=0,contactRow=null;
  const renumber=()=>section.querySelectorAll("#client-learner-rows > section").forEach((r,i)=>r.querySelector("h3").textContent="学员 "+(i+1));
  const appendLearner=(l={})=>{
    const n=sequence++,row=document.createElement('section');row.className='panel';row.style.margin='16px 0';row.style.padding='18px';
    const prefix='learner:'+n+':';
    row.innerHTML=`<h3>学员 ${n+1}</h3><input type="hidden" name="${prefix}id" value="${esc(l.id||'')}"><div class="form-grid">${[['name','学员姓名','text',true],['ic','IC No.','text',false],['phone','电话','tel',false],['email','Email','email',false],['position','职位','text',false]].map(([key,label,type,required])=>`<div class="field"><label for="client-learner-${n}-${key}">${label}</label><input id="client-learner-${n}-${key}" name="${prefix+key}" type="${type}" value="${esc(l[key]||'')}" ${required?'required':''}></div>`).join('')}<div class="field"><label for="client-learner-${n}-order">关联课程订单</label><select id="client-learner-${n}-order" name="${prefix}order"><option value="">稍后安排</option>${db.orders.filter(o=>o.client===id&&!productIsService(product(o.product))).map(o=>`<option value="${esc(o.id)}" ${l.order===o.id?'selected':''}>${esc(o.id+' · '+product(o.product).name)}</option>`).join('')}</select></div></div>${l.id?'<p>已有学员记录，保存会更新资料。</p>':'<button type="button" class="button small" data-remove-draft-learner>移除这组未保存资料</button>'}`;
    row.querySelector('[data-remove-draft-learner]')?.addEventListener('click',()=>{row.remove();if(row===contactRow){contactRow=null;section.querySelector('#contact-as-learner').checked=false}renumber()});
    section.querySelector('#client-learner-rows').append(row);renumber();return row;
  };
  section.querySelector('[data-client-learner-add]').addEventListener('click',()=>appendLearner());
  if(id)db.learners.filter(l=>l.client===id).forEach(appendLearner);
  const copyContact=()=>{if(!contactRow)return;for(const key of ['name','ic','phone','email','position']){const target=contactRow.querySelector('[name$=":'+key+'"]');target.value=form.querySelector('[name="'+key+'"]').value;}};
  section.querySelector('#contact-as-learner').addEventListener('change',evt=>{if(evt.target.checked){const existingRow=Array.from(section.querySelectorAll('#client-learner-rows > section')).find(r=>r.querySelector('[name$=":name"]').value.trim()===form.querySelector('[name="name"]').value.trim()&&r.querySelector('[name$=":phone"]').value.trim()===form.querySelector('[name="phone"]').value.trim()&&form.querySelector('[name="name"]').value.trim());contactRow=existingRow||appendLearner();contactRow.dataset.contactCopy=existingRow?'existing':'new';section.querySelector('#client-learner-rows').prepend(contactRow);copyContact();renumber();}else{if(contactRow?.dataset.contactCopy==='new')contactRow.remove();contactRow=null;renumber();}});
  for(const key of ['name','ic','phone','email','position'])form.querySelector('[name="'+key+'"]').addEventListener('input',copyContact);
};
function saveClientWithLearners(values,existingId){
  const customer={},rows=new Map();
  for(const [key,value] of values){const match=key.match(/^learner:(\d+):(\w+)$/);if(match){if(!rows.has(match[1]))rows.set(match[1],{});rows.get(match[1])[match[2]]=String(value).trim()}else customer[key]=value}
  if(!String(customer.name||'').trim()||!String(customer.phone||'').trim())throw Error('请填写客户姓名和电话');
  if(customer.invoice==='公司'&&!String(customer.company||'').trim())throw Error('请填写公司名称');
  const id=existingId||crypto.randomUUID(),existing=existingId?client(existingId):null;
  if(existingId&&!existing)throw Error('客户记录不存在');
  for(const l of rows.values()){
    if(!l.name)throw Error('请填写每位学员姓名，或移除未填写的资料组');
    if(l.id&&!db.learners.some(x=>x.id===l.id&&x.client===id))throw Error('学员不属于此客户');
    const old=l.id?learnerBy(l.id):null;const order=l.order?db.orders.find(o=>o.id===l.order):null;if(order&&old&&[old.event,old.nextEvent].some(event=>event&&!eventMatchesProduct(eventBy(event),order.product)))throw Error('学员 '+l.name+' 已有场次与新订单产品不符，请先在学员安排中改场次');
    if(l.order&&!db.orders.some(o=>o.id===l.order&&o.client===id&&!productIsService(product(o.product))))throw Error('请选择属于此客户的课程订单');
  }
  customer.invoice??=existing?.invoice||'个人';customer.hrdc??=existing?.hrdc||'NO';
  customer.company=String(customer.company||'').trim()||'个人客户';
  if(existing)Object.assign(existing,customer);else db.clients.push({...customer,id});
  for(const l of rows.values()){if(l.id)Object.assign(learnerBy(l.id),l);else db.learners.push({...l,id:crypto.randomUUID(),client:id,event:'',nextEvent:'',status:'还没上课',serviceStatus:'暂无后续服务'})}
  return id;
}
permissionEventRoot.addEventListener('submit',e=>{
  if(e.target.id!=='client-form')return;
  e.preventDefault();e.stopImmediatePropagation();
  if(currentStaff.role==='团队')return toast('当前角色不能新增或编辑客户');
  try{saveClientWithLearners(Array.from(new FormData(e.target)),e.target.dataset.id);save();$('#dialog').close();render();toast('客户与学员资料已一起保存')}catch(err){toast(err.message)}
},true);
