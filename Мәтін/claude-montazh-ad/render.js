// node render.js stage.html out_dir duration fps workers
const { chromium } = require('playwright'); const path=require('path');
(async()=>{
  const [stage,out,dur,fps,W]=process.argv.slice(2); const N=Math.ceil(+dur*+fps), w=+W;
  const b=await chromium.launch();
  await Promise.all(Array.from({length:w},async(_,k)=>{
    const p=await b.newPage({viewport:{width:1080,height:1920}});
    await p.goto('file://'+path.resolve(__dirname,stage)); await p.evaluate(()=>document.fonts.ready);
    const a=Math.floor(N*k/w), e=Math.floor(N*(k+1)/w);
    for(let i=a;i<e;i++){await p.evaluate(t=>window.frame(t),i/+fps);
      await p.screenshot({path:`${out}/${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:93});
      if(k===0&&(i-a)%50===0)console.log('w0',i-a,'/',e-a);}
  }));
  await b.close();
})();
