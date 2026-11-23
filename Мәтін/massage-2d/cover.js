const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const data=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
 await p.goto('file://'+path.join(__dirname,'page.html')); await p.evaluate(async()=>{await document.fonts.load('900 20px MS','Аәғқ₸');await document.fonts.ready;});
 await p.evaluate(d=>window.setup(d),data); await p.evaluate(()=>window.draw(30.6));
 await p.evaluate(()=>{document.getElementById('sub').innerHTML='';document.getElementById('hd').innerHTML='<div>2 САҒАТ<br>ТОЛЫҚ РЕЛАКС</div><span class="pill">дене + бет массажы</span>';});
 await p.screenshot({path:process.argv[2],type:'jpeg',quality:93}); await b.close();})();
