const menuBtn=document.querySelector('.menu');
const mobileNav=document.querySelector('.mobile-nav');
menuBtn?.addEventListener('click',()=>{const open=menuBtn.getAttribute('aria-expanded')==='true';menuBtn.setAttribute('aria-expanded',String(!open));mobileNav.hidden=open;});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.hidden=true;menuBtn.setAttribute('aria-expanded','false')}));

const slides=[...document.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('.dots button')];
let current=0,timer;
function show(i){current=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===current));dots.forEach((d,n)=>d.classList.toggle('active',n===current));}
function autoplay(){clearInterval(timer);timer=setInterval(()=>show(current+1),5500)}
dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);autoplay()}));
document.querySelector('.prev')?.addEventListener('click',()=>{show(current-1);autoplay()});
document.querySelector('.next')?.addEventListener('click',()=>{show(current+1);autoplay()});
autoplay();

const filterButtons=document.querySelectorAll('.tabs button');
const products=document.querySelectorAll('.product');
filterButtons.forEach(btn=>btn.addEventListener('click',()=>{filterButtons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const filter=btn.dataset.filter;products.forEach(card=>{const brand=card.dataset.brand;card.classList.toggle('hidden-product',!(filter==='all'||brand===filter||brand==='all'));});}));

document.querySelectorAll('.product button').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.product');const model=card?.dataset.model;const select=document.getElementById('model');if(model&&select){select.value=model;}document.getElementById('consult')?.scrollIntoView({behavior:'smooth'});}));

const phone=document.getElementById('phone');
phone?.addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,11);if(v.length>7)v=v.replace(/(\d{3})(\d{4})(\d{1,4})/,'$1-$2-$3');else if(v.length>3)v=v.replace(/(\d{3})(\d{1,4})/,'$1-$2');e.target.value=v;});

const params=new URLSearchParams(location.search);
if(params.get('submitted')==='1'){
  const form=document.getElementById('consultForm');
  const success=document.getElementById('successBox');
  if(form&&success){form.hidden=true;success.hidden=false;}
  setTimeout(()=>{history.replaceState({},document.title,location.pathname+'#consult')},1000);
}
