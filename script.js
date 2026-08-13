const FORM_ENDPOINT = ''; // 예: https://formsubmit.co/ajax/your@email.com 또는 직접 만든 API 주소

const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
});
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuBtn.setAttribute('aria-expanded','false');
}));

const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.hero-dots button')];
let slideIndex = 0;
let autoTimer;
function showSlide(index){
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((s,i)=>s.classList.toggle('active',i===slideIndex));
  dots.forEach((d,i)=>d.classList.toggle('active',i===slideIndex));
}
function startAuto(){ clearInterval(autoTimer); autoTimer=setInterval(()=>showSlide(slideIndex+1),5200); }
dots.forEach((d,i)=>d.addEventListener('click',()=>{showSlide(i);startAuto();}));
startAuto();

const filterBtns = document.querySelectorAll('.filter-tabs button');
const cards = document.querySelectorAll('.product-card');
filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
  filterBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const f=btn.dataset.filter;
  cards.forEach(card=>{
    const brand=card.dataset.brand;
    card.classList.toggle('hidden-product', !(f==='all'||brand===f||brand==='all'));
  });
}));

document.querySelectorAll('.product-btn').forEach(btn=>btn.addEventListener('click',()=>{
  const card=btn.closest('.product-card');
  const model=card?.dataset.model;
  if(model){ document.getElementById('model').value = model; }
  document.getElementById('consult').scrollIntoView({behavior:'smooth'});
}));

const form=document.getElementById('consultForm');
const dialog=document.getElementById('summaryDialog');
const summaryText=document.getElementById('summaryText');
const copyBtn=document.getElementById('copyBtn');
const closeBtn=document.querySelector('.dialog-close');

function getPayload(){
  return {
    model:document.getElementById('model').value,
    joinType:document.getElementById('joinType').value,
    carrier:document.getElementById('carrier').value,
    name:document.getElementById('name').value.trim(),
    phone:document.getElementById('phone').value.trim(),
    memo:document.getElementById('memo').value.trim()
  };
}
function makeSummary(p){
  return `[KT J1 MARKET 상담신청]\n관심상품: ${p.model}\n가입유형: ${p.joinType}\n현재통신사: ${p.carrier}\n성함: ${p.name}\n연락처: ${p.phone}\n상담메모: ${p.memo || '-'}\n\n매장전화: 031-378-6162`;
}

form?.addEventListener('submit', async e=>{
  e.preventDefault();
  if(!form.reportValidity()) return;
  const p=getPayload();
  const text=makeSummary(p);
  if(FORM_ENDPOINT){
    try{
      const res=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});
      if(!res.ok) throw new Error('전송 실패');
      alert('상담 신청이 접수되었습니다.');
      form.reset();
      return;
    }catch(err){ console.warn(err); }
  }
  summaryText.textContent=text;
  dialog.showModal();
});
copyBtn?.addEventListener('click', async()=>{
  await navigator.clipboard.writeText(summaryText.textContent);
  const old=copyBtn.textContent; copyBtn.textContent='복사 완료 ✓'; setTimeout(()=>copyBtn.textContent=old,1500);
});
closeBtn?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{ if(e.target===dialog) dialog.close(); });
