// node cover_ref.js data.json out.jpg "мәтін *қызыл*" — ref.html дизайнындағы обложка
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
 const [,,dataF,out,title]=process.argv; const data=JSON.parse(fs.readFileSync(dataF,'utf8'));
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
 await p.goto('file://'+path.join(__dirname,'ref.html'));
 await p.evaluate(async()=>{for(const f of ['800 21px MS','600 12px MS']) await document.fonts.load(f,'Aaәғқңөұүһі'); await document.fonts.ready;});
 data.scenes[0].pose='wave'; data.env=data.env.map(()=>0.4);
 await p.evaluate(d=>window.setup(d),data); await p.evaluate(t=>window.draw(t),data.scenes[0].t1-0.3);
 await p.evaluate((title)=>{
  document.querySelector('#sub').style.display='none'; document.querySelectorAll('.ttl').forEach(e=>e.style.display='none'); document.querySelectorAll('.scene').forEach(e=>e.style.transform='translateX(95px)'); document.querySelector('#prog').style.display='none';
  const h=document.createElement('div');
  h.innerHTML=title.replace(/\*([^*]+)\*/g,'<span style="background:#C0583B;color:#fff;border-radius:8px;padding:0 8px">$1</span>');
  h.style.cssText='position:absolute;left:14px;right:14px;top:218px;text-align:center;font:800 36px/1.25 MS;letter-spacing:-.8px;color:#2B211C';
  document.querySelector('#stage').appendChild(h);
 },title);
 await p.screenshot({path:out,type:'jpeg',quality:95}); await b.close();
})();
