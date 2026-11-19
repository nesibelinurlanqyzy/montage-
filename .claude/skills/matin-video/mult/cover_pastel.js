// node cover_pastel.js data.json out.jpg "мәтін *белгі* мәтін"  — пастель стиліне обложка
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
 const [,,dataF,out,title]=process.argv; const data=JSON.parse(fs.readFileSync(dataF,'utf8'));
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
 await p.goto('file://'+path.join(__dirname,'pastel.html'));
 await p.evaluate(async()=>{await document.fonts.load('800 30px Inter','Aaәғқңөұүһі'); await document.fonts.ready;});
 data.scenes[0].pose='wave'; data.env=data.env.map(()=>0.5);
 await p.evaluate(d=>window.setup(d),data); await p.evaluate(()=>window.draw(2.6));
 await p.evaluate(({title})=>{
  const s=document.querySelector('#scenes .scene'); s.querySelector('.hl').remove();
  s.querySelector('#s_q').style.display='none';
  const h=document.createElement('div');
  h.innerHTML=title.replace(/\*([^*]+)\*/g,'<span style="display:inline-block;padding:0 8px;border:2.5px solid #7d8fff;background:#e7ebff;border-radius:9px;color:#3d5afe">$1</span>');
  h.style.cssText='position:absolute;left:20px;right:20px;top:70px;text-align:center;font:800 38px/1.18 Inter;letter-spacing:-1px;color:#111216';
  s.appendChild(h);
  const c=s.querySelector('.cards'); c.style.transform='translateY(70px)';
 },{title});
 await p.screenshot({path:out,type:'jpeg',quality:95}); await b.close();
})();
