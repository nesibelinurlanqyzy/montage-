// ================= HOOK 0–4.70 (дауыспен синхрон) =================
// «Небәрі» 0.00–0.58 | «үш мың» .58 | «тоғыз жүз» 1.0/1.26 | «тоқсан» 1.52 | «теңгеге» 1.80 | CLAUDE 2.42 | МОНТАЖ 2.66 | КУРСЫНДА 3.06 | НЕ 3.56 | ҮЙРЕНЕСІҢ 3.92
const HC={d:[.6,1.0,1.26,1.52],tg:1.8,q:[2.42,2.66,3.06,3.56,3.92,4.22]};
function hook(t){
  build('hook',`
   <div id="hline" class="abs" style="left:0;right:0;top:817px;height:6px;background:linear-gradient(90deg,transparent,#19E6FF 20%,#fff 50%,#FF2BD6 80%,transparent);box-shadow:0 0 30px 6px rgba(160,140,255,.8)"></div>
   <div id="bars" class="abs" style="left:${540-(31*34-10)/2}px;top:${820-360}px;width:${31*34}px;height:720px"></div>
   <div id="neb" class="abs" style="left:0;right:0;top:560px;text-align:center;font:900 96px/1 'Noto Sans';letter-spacing:14px;text-shadow:0 0 24px rgba(255,43,214,.9),0 0 60px rgba(155,48,255,.8)"></div>
   <div id="pg" class="abs" style="left:0;right:0;top:640px;height:360px">
     <div id="chip" class="abs pop vi" style="left:220px;right:220px;top:-120px;height:540px;border-radius:80px;opacity:0"></div>
     <div id="ring" class="abs" style="left:540px;top:180px;width:600px;height:600px;margin:-300px;border-radius:50%;border:8px solid #fff;box-shadow:0 0 40px #19E6FF,inset 0 0 40px #FF2BD6;opacity:0"></div>
     <div id="ring0" class="abs" style="left:540px;top:180px;width:600px;height:600px;margin:-300px;border-radius:50%;border:5px solid #19E6FF;box-shadow:0 0 30px #19E6FF;opacity:0"></div>
     <div id="price" class="abs" style="left:0;right:0;top:20px;text-align:center;white-space:nowrap">
       <div id="ca1" class="abs" style="left:0;right:0;top:0;color:#19E6FF;mix-blend-mode:screen"></div>
       <div id="ca2" class="abs" style="left:0;right:0;top:0;color:#FF2BD6;mix-blend-mode:screen"></div>
       <div id="pmain" class="glow" style="position:relative"></div>
       <div id="spec" class="abs" style="left:0;right:0;top:0;color:#fff"></div>
     </div></div>
   <div id="q" class="abs" style="left:50px;right:50px;top:470px;text-align:center">
     <div style="font:900 134px/1 'Noto Sans';letter-spacing:-4px" class="glow"><span class="w grad-text" id="q1">CLAUDE</span></div>
     <div style="font:900 134px/1.02 'Noto Sans';letter-spacing:-4px" class="glow"><span class="w grad-text" id="q2">МОНТАЖ</span></div>
     <div style="font:800 76px/1.3 'Noto Sans';margin-top:14px"><span class="w" id="q3">КУРСЫНДА</span> <span class="w" id="q4">НЕ</span></div>
     <div style="font:900 108px/1.05 'Noto Sans';letter-spacing:-2px"><span class="w" id="q5">ҮЙРЕНЕСІҢ</span><span class="w" id="q6" style="color:var(--pink)">?</span></div></div>
   <div id="hrig" class="rig" style="left:305px;top:1080px;width:470px;height:960px">
     ${phone('hp',470,960,`<div id="grid" class="abs" style="left:34px;right:34px;top:110px;display:grid;grid-template-columns:1fr 1fr;gap:22px"></div>`)}</div>
  `,()=>{
    barsInit($('#bars'),31,24,10,720);
    const digs=['3',' ','9','9','0',' ','₸'];
    const mk=()=>digs.map((c,i)=>`<span class="w d${i}" style="transform-origin:50% 55%">${c}</span>`).join('');
    ['#pmain','#ca1','#ca2','#spec'].forEach(s=>{$(s).innerHTML=mk();S(s,{font:"900 300px/1 'Noto Sans'",letterSpacing:'-8px'})});
    $('#pmain').querySelectorAll('.w').forEach((e,i)=>{if(i<6)e.classList.add('grad-text')});
    S($('#pmain').querySelector('.d6'),{color:'#FF2BD6',textShadow:'0 0 40px #FF2BD6'});
    $('#neb').innerHTML=[...'НЕБӘРІ'].map(c=>`<span class="w">${c}</span>`).join('');
    let g='';for(let i=0;i<8;i++)g+=`<div class="thumb" style="height:150px;display:grid;place-items:center;font:900 54px 'Noto Sans'"><span class="${i%2?'':'grad-text'}">0${i+1}</span></div>`;$('#grid').innerHTML=g;
  });
  bg(t);
  S('#hline',{transform:`scaleX(${eo(pr(t,0,.22))})`,opacity:(1-pr(t,2.2,2.5))*(1-.6*bump(t,.58,.8))});
  // бары живут от голоса «Небәрі», потом схлопываются в цифру
  const amp=eb(pr(t,0,.25))*(1-eio(pr(t,.46,.62)))*(.55+.6*ENV(t));
  barsSet($('#bars'),t,amp,0,1);S('#bars',{opacity:amp>0.01?1:0});
  plexus(t,820,190,pr(t,0,.3)*(1-pr(t,2.3,2.7)),ex(pr(t,1.8,2.6))*.9+.12*ex(pr(t,.6,1.0)));
  [...$('#neb').children].forEach((e,i)=>{const p=pr(t,.02+i*.06,.22+i*.06);S(e,{opacity:p,transform:`scale(${lerp(2.4,1,eo(p))})`,filter:`blur(${(1-p)*14}px)`})});
  S('#neb',{transform:`translateY(${-60*eio(pr(t,.55,.7))}px)`,opacity:1-pr(t,2.25,2.4)});
  // цифры — по слову диктора
  const D=[0,2,3,4];
  ['#pmain','#ca1','#ca2','#spec'].forEach(s=>{D.forEach((di,j)=>{const a=HC.d[j],p=pr(t,a,a+.26),el=$(s).querySelector('.d'+di);
      S(el,{transform:`scaleY(${eb(p)}) scaleX(${lerp(.35,1,eo(p))})`,opacity:cl(p*4)});});
    const r=pr(t,HC.tg,HC.tg+.4),el=$(s).querySelector('.d6');S(el,{transform:`rotateY(${(1-eo(r))*720}deg) scale(${eb(pr(t,HC.tg,HC.tg+.3))})`,opacity:cl(r*4)});});
  let ca=0;[[.6,30],[1.0,14],[1.26,14],[1.52,14],[1.8,34]].forEach(([h,k])=>{if(t>=h)ca=Math.max(ca,Math.pow(1-pr(t,h,h+.28),2)*k)});
  S('#ca1',{transform:`translate(${-ca}px,${ca*.3}px)`,opacity:ca>.5?.85:0});S('#ca2',{transform:`translate(${ca}px,${-ca*.3}px)`,opacity:ca>.5?.85:0});
  const sw=pr(t,2.0,2.35)*160-30;S('#spec',{WebkitMaskImage:`linear-gradient(105deg,transparent ${sw-12}%,#000 ${sw}%,transparent ${sw+12}%)`,opacity:t>2.0&&t<2.35?.95:0});
  S('#ring0',{transform:`scale(${.15+1.6*eo(pr(t,.6,1.0))})`,opacity:t<.6?0:.8*(1-pr(t,.6,1.0))});
  S('#ring',{transform:`scale(${.15+2.6*eo(pr(t,1.8,2.3))})`,opacity:t<1.8?0:1-pr(t,1.8,2.3)});
  S('#fx',{background:`radial-gradient(circle at 50% 43%,rgba(200,220,255,${bump(t,.57,.78)*.8+bump(t,1.78,2.0)*.7}),transparent 65%)`});
  let sh=0;[[.6,.25],[1.8,.3]].forEach(([h,d])=>{if(t>h&&t<h+d)sh=Math.max(sh,(1-pr(t,h,h+d))*14)});
  const pulse=1+.06*bump(t,1.85,2.2), up=eio(pr(t,2.3,2.7));
  S('#pg',{transform:`translate(${Math.sin(t*90)*sh}px,${Math.cos(t*77)*sh-up*440}px) scale(${pulse*(1-up*.6)})`});S('#chip',{opacity:up});
  const ph=eo(pr(t,2.4,3.1));
  S('#hrig',{transform:`perspective(1800px) translateY(${(1-ph)*900}px) rotateY(${lerp(-35,-14,ph)+3*Math.sin(t*1.5)}deg) rotateX(${lerp(20,6,ph)}deg)`});
  [...$('#grid').children].forEach((e,i)=>{const p=eb(pr(t,2.85+i*.06,3.2+i*.06));S(e,{transform:`scale(${p})`,opacity:cl(p*2)})});
  ['#q1','#q2','#q3','#q4','#q5','#q6'].forEach((s,i)=>{const a=HC.q[i]-.04,p=pr(t,a,a+.3),e=eb(p);
    S(s,{opacity:cl(p*2.5),transform:`translateY(${(1-e)*90}px) scale(${.7+.3*e})`,filter:`blur(${(1-cl(p*1.6))*12}px)`});});
  const k=pr(t,3.95,4.15);S('#q5',{color:`rgb(255,${Math.round(lerp(255,43,k))},${Math.round(lerp(255,214,k))})`,textShadow:`0 0 ${30*k}px rgba(255,43,214,.9)`,
     transform:`scale(${(.7+.3*eb(pr(t,3.88,4.18)))*(1+.08*bump(t,4.0,4.3))})`});
  S('#q6',{transform:`translateY(${-30*bump(t,4.3,4.5)}px) rotate(${14*bump(t,4.3,4.5)}deg) scale(${eb(pr(t,4.2,4.45))})`});
  hud(0);
}
