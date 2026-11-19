// node render.js data.json mode out  (mode: frames "t1,t2,.." -> out dir jpgs | video -> stdout jpeg stream)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
 const [,,dataF,mode,arg,out]=process.argv; const data=JSON.parse(fs.readFileSync(dataF,'utf8'));
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
 const http=require('http');const MT={'.html':'text/html','.js':'text/javascript','.otf':'font/otf','.ttf':'font/ttf','.woff2':'font/woff2'};
 const srv=http.createServer((q,r)=>{const f=path.join(__dirname,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':MT[path.extname(f)]||'application/octet-stream'});r.end(b)})});
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));p.on('pageerror',e=>process.stderr.write('PAGE ERR '+e+'\n'));
 await p.goto('http://127.0.0.1:'+srv.address().port+'/page.html'); await p.waitForFunction(()=>window.R3READY===true,null,{timeout:30000}); await p.evaluate(async()=>{for(const f of ['900 21px IDB','800 21px IDB','700 12px MONO','italic 700 21px SER']) await document.fonts.load(f,'Aaәғқңөұүһі'); await document.fonts.ready;});
 await p.evaluate(d=>window.setup(d),data); await p.waitForTimeout(300);
 if(mode==='frames'){ const ts=arg.split(',').map(Number); let i=0;
   for(const t of ts){ await p.evaluate(t=>window.draw(t),t); await p.screenshot({path:path.join(out,`f${String(i++).padStart(2,'0')}.jpg`),type:'jpeg',quality:92}); } }
 else { const n=Math.ceil(data.dur*data.fps);
   for(let i=0;i<n;i++){ await p.evaluate(t=>window.draw(t),i/data.fps); const buf=await p.screenshot({type:'jpeg',quality:93});
     if(!process.stdout.write(buf)) await new Promise(r=>process.stdout.once('drain',r));
     if(i%150===0) process.stderr.write(`кадр ${i}/${n}\n`); } }
 await b.close(); srv.close();
})();
