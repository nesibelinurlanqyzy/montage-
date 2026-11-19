// node cover.js data.json out.jpg "1-жол|*акцент жол*|3-жол" "кіші жазу"
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const [,,dataF,out,title,sub]=process.argv;const data=JSON.parse(fs.readFileSync(dataF,'utf8'));
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
 const http=require('http');const MT={'.html':'text/html','.js':'text/javascript','.otf':'font/otf','.ttf':'font/ttf','.woff2':'font/woff2'};
 const srv=http.createServer((q,r)=>{const f=path.join(__dirname,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,bb)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':MT[path.extname(f)]||'application/octet-stream'});r.end(bb)})});
 await new Promise(r=>srv.listen(0,'127.0.0.1',r));
 await p.goto('http://127.0.0.1:'+srv.address().port+'/page.html');await p.waitForFunction(()=>window.R3READY===true,null,{timeout:30000});
 await p.evaluate(async()=>{for(const f of ['900 21px IDB','800 21px IDB','700 12px MONO','italic 700 21px SER']) await document.fonts.load(f,'Aaәғқңөұүһі');await document.fonts.ready;});
 await p.evaluate(d=>window.setup(d),data);await p.evaluate(()=>window.draw(0.9));
 await p.evaluate(([title,sub])=>{for(const s of ['#titles','#cards','#sub'])document.querySelector(s).style.display='none';
  const d=document.createElement('div');d.style.cssText='position:absolute;left:22px;right:22px;top:92px;font-family:IDB;font-weight:900;font-size:44px;line-height:1.0;letter-spacing:-1.4px;color:#fff';
  d.innerHTML=title.split('|').map(l=>l.startsWith('*')?`<div style="font-family:SER;font-style:italic;font-weight:700;letter-spacing:-.5px;color:#FF5A1F;font-size:48px;margin:4px 0">${l.replace(/\*/g,'')}</div>`:`<div>${l}</div>`).join('');
  const s=document.createElement('div');s.style.cssText='margin-top:16px;display:inline-block;padding:7px 13px;border-radius:20px;background:#FF5A1F;font-size:14px;font-weight:800;letter-spacing:-.2px';s.textContent=sub;d.appendChild(s);
  document.getElementById('st').appendChild(d);},[title,sub]);
 await p.screenshot({path:out,type:'jpeg',quality:94});await b.close();srv.close();})();
