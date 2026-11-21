// ================ «АЛ ЕҢ ҚЫЗЫҒЫ — ПРАКТИКА» 14.70–16.65 ================
function sPrak(t){
  build('prak',`
   <div id="pk1" class="abs" style="left:0;right:0;top:560px;text-align:center;font:900 92px/1 'Noto Sans';letter-spacing:-1px">
     <span class="w" id="a1">АЛ</span> <span class="w" id="a2">ЕҢ</span> <span class="w" id="a3">ҚЫЗЫҒЫ</span> <span class="w" id="a4" style="color:var(--pink)">—</span></div>
   <div id="pk2" class="abs" style="left:0;right:0;top:800px;text-align:center;font:900 158px/1 'Noto Sans';letter-spacing:-4px;perspective:1400px"></div>
   <div id="pkl" class="abs" style="left:90px;right:90px;top:1010px;height:12px;border-radius:6px;background:var(--grad);box-shadow:0 0 30px #9B30FF;transform-origin:50% 50%"></div>
   <div id="pkc" class="abs" style="left:0;right:0;top:1120px;text-align:center"></div>`,()=>{
    $('#pk2').innerHTML=[...'ПРАКТИКА'].map((c,i)=>`<span class="w grad-text" style="text-shadow:none;filter:drop-shadow(0 6px 0 #5a1a9a) drop-shadow(0 12px 0 #3a0f6a) drop-shadow(0 0 30px rgba(255,43,214,.7))">${c}</span>`).join('');
    $('#pkc').innerHTML=['06 · МӘТІННЕН ВИДЕО','07 · МОНТАЖ','08 · ЖИ ДАУЫС'].map((x,i)=>`<div class="pop ${['vi','','pk'][i]}" style="position:relative;display:inline-block;margin:10px 8px;padding:16px 28px;font:800 32px 'Noto Sans'">${x}</div>`).join('');
  });
  bg(t);hud(0);
  plexus(t,1015,90,pr(t,14.8,15.1)*(1-pr(t,16.4,16.65)),ex(pr(t,15.96,16.6))*.7);
  [['#a1',14.86],['#a2',15.02],['#a3',15.30],['#a4',15.72]].forEach(([s,a])=>{const p=pr(t,a-.03,a+.22),e=eb(p);
    S(s,{opacity:cl(p*2.5),transform:`translateY(${(1-e)*-80}px) scale(${.6+.4*e})`,filter:`blur(${(1-cl(p*1.5))*10}px)`})});
  const kq=pr(t,15.35,15.6);S('#a3',{color:`rgb(${Math.round(lerp(255,25,kq))},${Math.round(lerp(255,230,kq))},255)`,textShadow:`0 0 ${30*kq}px #19E6FF`});
  S('#pk1',{transform:`translateY(${-40*eio(pr(t,15.9,16.1))}px) scale(${1-.15*eio(pr(t,15.9,16.1))})`});
  [...$('#pk2').children].forEach((e,i)=>{const a=15.96+i*.025,p=pr(t,a,a+.3),e2=eb(p);
    S(e,{opacity:cl(p*3),transform:`translateY(${(1-e2)*-260}px) rotateX(${(1-e2)*-90}deg) scale(${1+.12*bump(t,a+.2,a+.45)})`})});
  S('#pk2',{transform:`translate(${t>15.96&&t<16.2?Math.sin(t*95)*10*(1-pr(t,15.96,16.2)):0}px,0)`});
  S('#pkl',{transform:`scaleX(${eo(pr(t,16.0,16.3))})`,opacity:pr(t,16.0,16.05)});
  [...$('#pkc').children].forEach((e,i)=>{const p=eb(pr(t,16.12+i*.08,16.4+i*.08));S(e,{opacity:cl(p*2),transform:`translateY(${(1-p)*60}px) scale(${p})`})});
  S('#fx',{background:`radial-gradient(circle at 50% 46%,rgba(255,200,250,${bump(t,15.94,16.15)*.7}),transparent 60%)`});
}
// мини-рилс внутри телефонов (заглушка до реальных видео пользователя)
function miniReel(i){const w=['REELS','МОНТАЖ','ЖИ ДАУЫС'][i],g=[['#2F6BFF','#9B30FF'],['#9B30FF','#FF2BD6'],['#19E6FF','#2F6BFF']][i];
  return `<div class="abs mr" style="inset:0;background:linear-gradient(160deg,${g[0]},${g[1]} 70%,#02030A)"></div>
   <div class="abs mrw" style="left:0;right:0;top:250px;text-align:center;font:900 ${i==2?50:60}px/1 'Noto Sans';text-shadow:0 0 24px #fff">${w}</div>
   <div class="abs mrs" style="left:30px;right:30px;top:360px;text-align:center"><span style="background:#FF2BD6;padding:4px 12px;border-radius:10px;font:900 22px 'Noto Sans'">субтитр</span></div>
   <div class="abs" style="left:30px;right:30px;bottom:40px;height:10px;border-radius:5px;background:rgba(255,255,255,.3)"><i class="abs mrp" style="left:0;top:0;bottom:0;background:#fff;border-radius:5px"></i></div>`;}
function miniReelSet(root,i,t){S(root.querySelector('.mr'),{filter:`hue-rotate(${Math.sin(t*1.2+i)*30}deg)`});
  S(root.querySelector('.mrw'),{transform:`scale(${1+.08*Math.sin(t*4+i*2)}) translateY(${Math.sin(t*2+i)*10}px)`});
  S(root.querySelector('.mrp'),{width:(((t*.3+i*.33)%1)*100)+'%'});}
// ================ ФИНАЛ 27.70–35.55 ================
function sFin(t){
  build('fin',`<div id="phs" class="abs" style="left:0;right:0;top:260px;height:700px;perspective:1700px"></div>
   <div id="fa" class="abs" style="left:40px;right:40px;top:1010px;text-align:center">
     <div style="font:900 74px/1.1 'Noto Sans'"><span class="w" id="b1">БАРЛЫҒЫ —</span></div>
     <div style="margin-top:22px"><span class="w pop pk" id="b2" style="position:relative;padding:16px 34px;font:900 58px 'Noto Sans'">ҚАЗАҚ ТІЛІНДЕ</span></div>
     <div style="margin-top:34px"><span class="w pop" id="b3" style="position:relative;padding:16px 34px;font:900 58px 'Noto Sans'">НӨЛДЕН БАСТАП</span></div></div>
   <div id="ft" class="abs" style="left:40px;right:40px;top:990px;text-align:center">
     <div style="font:900 80px/1.05 'Noto Sans';letter-spacing:-2px"><span class="w" id="f1">СЕН ДЕ</span> <span class="w grad-text glow" id="f2">ОСЫНДАЙ</span></div>
     <div style="font:900 80px/1.05 'Noto Sans';letter-spacing:-2px"><span class="w grad-text glow" id="f3">ВИДЕОЛАР</span></div>
     <div style="font:900 80px/1.05 'Noto Sans';letter-spacing:-2px"><span class="w" id="f4">ЖАСАУДЫ</span> <span class="w" id="f5">ҮЙРЕН!</span></div></div>
   <div id="cta" class="abs" style="left:150px;right:150px;top:1300px;height:140px;border-radius:999px;background:var(--grad);display:grid;place-items:center;font:900 58px 'Noto Sans';letter-spacing:2px">КУРСҚА ҚОСЫЛ</div>
   <div id="link" class="abs" style="left:0;right:0;top:1468px;text-align:center;font:800 42px 'Noto Sans'">Сілтеме профильде <span id="arr" style="display:inline-block;color:var(--cyan)">↑</span></div>
   <div id="cur" class="cursor">${CUR}</div><div id="rip" class="ripple"></div>`,()=>{
    $('#phs').innerHTML=[0,1,2].map(i=>`<div class="rig" id="fp${i}" style="left:390px;top:30px;width:300px;height:600px">${phone('fq'+i,300,600,miniReel(i))}</div>`).join('');});
  bg(t);plexus(t,0,0,0);hud(0);
  const sq=eio(pr(t,30.6,31.0));
  [0,1,2].forEach(i=>{const o=i-1,p=eb(pr(t,27.72+i*.1,28.25+i*.1));
    S('#fp'+i,{transform:`translateX(${o*320*p}px) translateY(${(1-p)*500+Math.abs(o)*50+Math.sin(t*1.5+i)*8}px) rotateY(${o*-26+Math.sin(t*.8)*4}deg) rotateZ(${o*7}deg) translateZ(${-Math.abs(o)*140}px)`,opacity:cl(p*2),zIndex:o?1:2});
    miniReelSet($('#fp'+i),i,t);});
  // «Барлығы — қазақ тілінде, нөлден бастап»
  [['#b1',27.86],['#b2',28.58],['#b3',29.6]].forEach(([s,a])=>{const p=pr(t,a-.04,a+.28),e=eb(p);S(s,{opacity:cl(p*2.5)*(1-sq),transform:`translateY(${(1-e)*70-sq*60}px) scale(${(.7+.3*e)*(1+.06*bump(t,a+.25,a+.5))})`,filter:`blur(${(1-cl(p*1.6))*10+sq*12}px)`})});
  // «Сен де осындай видеолар жасауды үйрен»
  [['#f1',30.74],['#f2',31.14],['#f3',31.54],['#f4',31.9],['#f5',32.36]].forEach(([s,a])=>{const p=pr(t,a-.04,a+.28),e=eb(p);S(s,{opacity:cl(p*2.5),transform:`translateY(${(1-e)*70}px) scale(${.7+.3*e})`,filter:`blur(${(1-cl(p*1.6))*10}px)`})});
  const kk=pr(t,32.36,32.6);S('#f5',{color:`rgb(255,${Math.round(lerp(255,43,kk))},${Math.round(lerp(255,214,kk))})`,textShadow:`0 0 ${30*kk}px #FF2BD6`});
  // «курсқа қосылу үшін профильдегі сілтемеге өт»
  S('#cta',{opacity:pr(t,33.0,33.12),transform:`scale(${eb(pr(t,33.0,33.35))*(1-.06*bump(t,33.9,34.1))*(1+.03*Math.sin(t*7)*pr(t,34.2,34.4))})`,boxShadow:`0 0 ${50+30*Math.sin(t*7)}px rgba(255,43,214,.85)`});
  cursorAt(t,33.3,33.9,980,1800,620,1380,33.9);
  S('#link',{opacity:pr(t,34.0,34.2),transform:`translateY(${(1-eb(pr(t,34.0,34.35)))*40}px)`});S('#arr',{transform:`translateY(${-14*Math.abs(Math.sin(t*5))}px)`});
}
// ================ СУБТИТРЫ (по словам диктора) ================
const SUB=[
 [['Алдымен',4.92,5.34],['GitHub-қа',5.34,6.02,1],['тіркеліп,',6.02,6.52]],
 [['өз',6.64,6.86],['репозиторийіңді',6.86,7.68,1],['ашуды',7.68,7.94],['үйренесің.',7.94,8.46]],
 [['Оны',8.72,9.0],['Claude-қа',9.0,9.55,1],['қосып,',9.55,9.92]],
 [['дайын',10.18,10.32],['шаблондарды',10.32,10.92,1],['пайдаланасың.',10.92,11.7]],
 [['Жұмыс',11.94,12.2,1],['ортаңды',12.2,12.68,1],['құрап,',12.68,13.02]],
 [['алғашқы',13.02,13.56],['жобаңа',13.56,13.94,1],['кірісесің.',13.94,14.5]],
 [['Тек',16.8,16.98],['мәтін',16.98,17.38,1],['арқылы',17.38,17.78]],
 [['анимациялық',17.78,18.52],['видео',18.52,18.9,1],['жасайсың.',18.9,19.32]],
 [['Дайын',19.32,19.9],['видеоларды',19.9,20.48],['монтаждап,',20.48,21.16,1]],
 [['субтитрлермен,',21.16,22.02,1],['ерекше',22.02,22.62],['эффектілер',22.62,23.3,1],['қосасың.',23.3,23.98]],
 [['Тіпті',24.08,24.4],['жасанды',24.4,24.96,1],['интеллект',24.96,25.46,1],['арқылы',25.46,26.0]],
 [['дауыс',26.0,26.45,1],['қосуды',26.45,26.75],['да',26.75,26.9],['үйренесің.',26.9,27.48]],
];
(function(){const d=document.createElement('div');d.id='subs';d.className='abs';d.style.cssText='left:70px;right:70px;top:1398px;text-align:center;z-index:30;pointer-events:none';document.getElementById('stage').insertBefore(d,document.getElementById('fx'));})();
let subCur=-1;
function subs(t){const el=$('#subs');let k=-1;
  SUB.forEach((c,i)=>{const a=c[0][1]-.12,b=(SUB[i+1]&&SUB[i+1][0][1]-c[c.length-1][2]<.5)?SUB[i+1][0][1]-.12:c[c.length-1][2]+.25;if(t>=a&&t<b)k=i;});
  if(k<0){el.style.opacity=0;return;}
  if(k!==subCur){subCur=k;el.innerHTML=`<div id="sp" style="display:inline-block;padding:16px 30px;border-radius:30px;background:rgba(4,6,24,.62);border:2px solid rgba(160,140,255,.45);box-shadow:0 0 40px rgba(155,48,255,.35);backdrop-filter:blur(12px);font:800 50px/1.25 'Noto Sans'">${SUB[k].map((w,j)=>`<span class="w sw" style="margin:0 7px">${w[0]}</span>`).join('')}</div>`;}
  const c=SUB[k],a=c[0][1]-.12,p=eb(pr(t,a,a+.2));el.style.opacity=cl(pr(t,a,a+.1)*1);S('#sp',{transform:`scale(${.85+.15*p})`});
  [...el.querySelectorAll('.sw')].forEach((s,j)=>{const w=c[j],act=t>=w[1]-.03&&t<w[2]+.02,past=t>=w[2];
    S(s,{color:act?'#FF2BD6':(w[3]?'#19E6FF':'#fff'),opacity:act||past?1:.45,transform:`scale(${act?1+.12*eb(pr(t,w[1]-.03,w[1]+.15)):1})`,textShadow:act?'0 0 24px rgba(255,43,214,.9)':(w[3]&&past?'0 0 16px rgba(25,230,255,.6)':'none')});});
}
// ===== таймлайн: реальные секунды озвучки → «дизайн-время» сцены =====
// [начало, конец, функция, [дизайн_от, дизайн_до] | null, переход, ox, oy]
const TL=[[0,4.70,hook,null,'screen',540,1500],
 [4.70,6.60,s01,[3.0,6.3],'zoom'],[6.60,8.60,s02,[7.0,10.6],'line'],[8.60,10.10,s03,[11.0,13.6],'zoom'],
 [10.10,11.85,s04,[15.0,18.4],'screen',540,1100],[11.85,14.70,s05,[19.0,23.0],'line'],[14.70,16.65,sPrak,null,'zoom'],
 [16.65,19.30,s06,[23.0,27.0],'screen',540,1220],[19.30,24.00,s07,[28.0,33.0],'line'],[24.00,27.70,s08,[33.0,36.0],'zoom'],[27.70,36,sFin,null,'']];
let RT=0;
function ENV(t){const e=window.ENVD||[];const i=Math.max(0,Math.min(e.length-1,Math.round((t)*30)));return e[i]||0;}
window.frame=function(t){RT=t;const i=TL.findIndex(s=>t>=s[0]&&t<s[1]),sc=TL[i<0?TL.length-1:i];
  S('#scene',{transform:'',filter:'',opacity:1,transformOrigin:'50% 50%'});S('#fx',{background:'transparent'});
  const td=sc[3]?sc[3][0]+(t-sc[0])*(sc[3][1]-sc[3][0])/(sc[1]-sc[0]):t;
  sc[2](td); if(sc[0]>0) sceneIn(t,sc[0]);
  const a=sc[1]-.3; if(t>a&&sc[1]<35.6){ if(sc[4]==='screen') intoScreen(t,a,sc[5],sc[6]); else if(sc[4]==='line') lineWipe(t,a); else intoScreen(t,a,540,1000);}
  subs(t);
};
window.frame(0);
