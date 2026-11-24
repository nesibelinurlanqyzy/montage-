// node cover.js out.jpg — «қызыл» стиль обложкасы (page.html элементтерін қолданады)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=process.argv[2];const b=await chromium.launch();const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});
 await p.goto('file://'+path.join(__dirname,'page.html'));
 await p.evaluate(async()=>{for(const f of ['800 21px MV','italic 900 21px MS','700 21px RB','700 30px CV']) await document.fonts.load(f,'Aaәғқңөұүһі');await document.fonts.ready});
 await p.evaluate(()=>{S.innerHTML='';const c=E(S,'sc','', 'visibility:visible;background:radial-gradient(120% 80% at 50% 45%,#AE2126 0%,#9C1B1F 55%,#7A1418 100%)');
  T(E(c,'el',splash('#EFE7D9',11),'left:0;top:0;width:300px;height:300px'),180,372,1.05,-8);
  STY.forEach((s,i)=>{const k=i-2;T(styleCard(c,i,78,116),180+k*54,372+Math.abs(k)*12,1,k*10)});
  const h=E(c,'','',`position:absolute;left:24px;right:24px;top:92px;text-align:center`);
  E(h,'','Таргетке креативті',`font:800 31px/1.1 MV;color:#EFE7D9;letter-spacing:-.5px`);
  E(h,'','телефонмен',`font:900 italic 44px/1.05 MS;color:#E7B52C;letter-spacing:-1px;margin-top:4px`);
  E(h,'','жаса',`display:inline-block;margin-top:6px;background:#EFE7D9;color:#9C1B1F;font:900 italic 30px/1 MS;padding:4px 14px 6px;transform:rotate(-3deg)`);
  const pl=E(c,'pill','ИИ арқылы · 10 креатив','top:466px;font-size:13px');
  E(S,'','<svg width="440" height="720"><rect width="440" height="720" filter="url(#gr)"/></svg>','').id='grain';E(S,'','','').id='vig';});
 await p.waitForTimeout(200);await p.screenshot({path:out,type:'jpeg',quality:94});await b.close()})();
