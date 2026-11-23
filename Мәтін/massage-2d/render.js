// node render.js data.json frames "t1,t2" outdir | node render.js data.json video > stdout(jpeg)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
 const [,,dataF,mode,arg,out]=process.argv; const data=JSON.parse(fs.readFileSync(dataF,'utf8'));
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
 p.on('pageerror',e=>process.stderr.write('ERR '+e+'\n'));
 await p.goto('file://'+path.join(__dirname,'page.html')); await p.evaluate(async()=>{await document.fonts.load('900 20px MS','Аәғқ₸');await document.fonts.ready;});
 await p.evaluate(d=>window.setup(d),data);
 if(mode==='frames'){ let i=0; for(const t of arg.split(',').map(Number)){ await p.evaluate(t=>window.draw(t),t); await p.screenshot({path:path.join(out,`f${String(i++).padStart(2,'0')}.jpg`),type:'jpeg',quality:90}); } }
 else { const fps=30,n=Math.ceil(data.dur*fps); for(let i=0;i<n;i++){ await p.evaluate(t=>window.draw(t),i/fps); const buf=await p.screenshot({type:'jpeg',quality:92});
   if(!process.stdout.write(buf)) await new Promise(r=>process.stdout.once('drain',r)); if(i%150===0) process.stderr.write(`кадр ${i}/${n}\n`);} }
 await b.close();})();
