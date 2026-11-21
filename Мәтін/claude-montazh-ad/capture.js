// node capture.js out_dir t1 t2 ...   |  node capture.js out_dir --seq start end fps
const { chromium } = require('playwright'); const path=require('path');
(async()=>{
  const [out,...a]=process.argv.slice(2);
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+path.resolve(__dirname,'stage.html')); await p.evaluate(()=>document.fonts.ready);
  let ts=[];
  if(a[0]==='--seq'){const [s,e,f]=a.slice(1).map(Number);for(let i=0;i<Math.round((e-s)*f);i++)ts.push(s+i/f);}
  else ts=a.map(Number);
  for(let i=0;i<ts.length;i++){await p.evaluate(t=>window.frame(t),ts[i]);
    const name=a[0]==='--seq'?String(i).padStart(4,'0'):'t'+ts[i].toFixed(2);
    await p.screenshot({path:`${out}/${name}.png`});}
  await b.close();
})();
