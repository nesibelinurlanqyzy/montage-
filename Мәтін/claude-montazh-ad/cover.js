// node cover.js  -> Дайын/claude-montazh_обложка{,_баға}.jpg
const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file://'+path.resolve(__dirname,'stage4.html'));await p.evaluate(()=>document.fonts.ready);
 for(const price of [false,true]){
  await p.evaluate((price)=>{window.frame(30.0);cur='cover';
   const g=Array.from({length:8},(_,i)=>`<div class="thumb" style="height:118px;display:grid;place-items:center;font:900 46px 'Noto Sans'"><span class="${i%2?'':'grad-text'}">0${i+1}</span></div>`).join('');
   $('#scene').innerHTML=`
    <div id="cb" class="abs" style="left:${540-(29*34-10)/2}px;top:${1500-230}px;width:${29*34}px;height:460px;opacity:.9"></div>
    <div class="abs" style="left:0;right:0;top:300px;text-align:center">
      ${price?`<div class="pop vi" style="position:relative;display:inline-block;padding:10px 40px;border-radius:999px;font:900 64px 'Noto Sans';margin-bottom:30px"><span style="font-size:40px;letter-spacing:4px">НЕБӘРІ</span> <span class="grad-text">3 990</span> <span style="color:#FF2BD6">₸</span></div>`:`<div style="font:800 40px 'Noto Sans';letter-spacing:10px;color:#9AA3D0;margin-bottom:26px">ТЕЛЕФОННАН · ҚАЗАҚША</div>`}
      <div class="glow" style="font:900 178px/0.95 'Noto Sans';letter-spacing:-6px"><span class="grad-text">CLAUDE</span></div>
      <div class="glow" style="font:900 178px/0.98 'Noto Sans';letter-spacing:-6px"><span class="grad-text">МОНТАЖ</span></div>
      <div style="font:900 64px/1.1 'Noto Sans';margin-top:30px">КУРСЫНДА НЕ <span style="color:#FF2BD6;text-shadow:0 0 30px rgba(255,43,214,.9)">ҮЙРЕНЕСІҢ?</span></div>
    </div>
    <div class="rig" style="left:330px;top:980px;width:420px;height:820px;transform:perspective(1800px) rotateY(-14deg) rotateX(6deg)">
      ${phone('cp',420,820,`<div class="abs" style="left:30px;right:30px;top:100px;display:grid;grid-template-columns:1fr 1fr;gap:18px">${g}</div>`)}</div>
    <div class="abs pop" style="left:90px;top:1080px;padding:16px 26px;font:900 36px 'Noto Sans';transform:rotate(-6deg)">GitHub → Claude</div>
    <div class="abs pop pk" style="right:90px;top:1200px;padding:16px 26px;font:900 36px 'Noto Sans';transform:rotate(5deg)">ЖИ дауыс</div>
    <div class="abs pop vi" style="left:70px;top:1330px;padding:16px 26px;font:900 36px 'Noto Sans';transform:rotate(4deg)">Мәтіннен видео</div>`;
   barsInit($('#cb'),29,24,10,460);barsSet($('#cb'),1.3,.9,0,1);plexus(2,1500,150,.8,0);
   $('#hud').style.opacity=0;$('#subs').style.opacity=0;S('#plex',{transform:''});S('#fx',{background:'transparent'});
  },price);
  await p.screenshot({path:path.resolve(__dirname,'../../Дайын/claude-montazh_обложка'+(price?'_баға':'')+'.jpg'),type:'jpeg',quality:92});}
 await b.close();})();
