// node cover.js data.json out.jpg "мәтін *қызыл* мәтін" pose
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
 const [,,dataF,out,title,pose]=process.argv; const data=JSON.parse(fs.readFileSync(dataF,'utf8'));
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
 await p.goto('file://'+path.join(__dirname,data.page||'page.html'));
 await p.evaluate(async()=>{for(const f of ['800 21px MS','italic 900 21px MS']) await document.fonts.load(f,'Aaәғқңөұүһі');});
 data.scenes[0].pose=pose||'thumb';
 data.env=data.env.map(()=>0.45); await p.evaluate(d=>window.setup(d),data); await p.evaluate(t=>window.draw(t),Math.min(4.9,data.scenes[0].t1-0.2)); await p.evaluate(()=>document.querySelector('#dots').style.display='none');
 await p.evaluate(({title,lab,shift})=>{
  const s=document.querySelector('#scenes .scene'); s.querySelector('.hl').remove(); s.querySelector('.lab').textContent='// '+lab;
  const html=title.replace(/\*([^*]+)\*/g,'<b style="color:#E5322D;font-style:italic;font-weight:900">$1</b>');
  const h=document.createElement('div'); h.innerHTML=html;
  h.style.cssText='position:absolute;left:18px;right:18px;top:78px;font:800 37px/1.12 MS;letter-spacing:-.6px;color:#1d1d2b';
  s.appendChild(h);
  const c=s.querySelector('.cards'); c.style.transform=`translateY(${shift}px) scale(.92)`; c.style.transformOrigin='50% 0';
  const q=s.querySelector('#h_q,#v_q'); if(q) q.style.display='none';
 },{title,shift:data.cover_shift??76,lab:data.cover_label||'телефоннан монтаж'});
 await p.screenshot({path:out,type:'jpeg',quality:95}); await b.close();
})();
