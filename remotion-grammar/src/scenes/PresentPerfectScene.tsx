import React from 'react';
import {interpolateColors, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {easeInOut, easeOut, hexA, lin, sp} from '../anim';
import {CUE, SCENES} from '../timing';
import {Chip, Dot, Sfx, Timeline} from '../components/Common';
import {Plane, Suitcase} from '../components/Icons';
import {KineticText, LetterTitle, Translation, revealEnd} from '../components/Text';
import {Shell, useLocal} from './shell';
import {TL_Y} from './PastSimpleScene';

const RULE = 'Use *Present Perfect* for *life experiences* or actions *connected to now*.';
const EX = 'I’ve visited London *twice*.';
const P1 = 330, P2 = 600, NOW = 930;

export const PresentPerfectScene: React.FC = () => {
  const f = useLocal();
  const {fps} = useVideoConfig();
  const c = CUE.present;
  const col = interpolateColors(f, [c.morph - 8, c.morph + 36], [C.blue, C.purple]);
  const shimmer = f < c.morph + 40 ? lin(f, c.morph - 8, c.morph + 40, 0, 1, easeInOut) : undefined;
  const d1 = sp(f, fps, c.dot1, {damping: 10});
  const d2 = sp(f, fps, c.dot2, {damping: 10});
  const i1 = sp(f, fps, c.dot1 + 6, {damping: 13, stiffness: 90});
  const i2 = sp(f, fps, c.dot2 + 6, {damping: 13, stiffness: 90});
  const now = sp(f, fps, c.now, {damping: 11});
  const link = lin(f, c.link, c.link + 22, 0, 1, easeOut);
  const toNow = lin(f, c.toNow, c.toNow + 26, 0, 1, easeOut);
  const flash = f > c.link ? 1 + 0.5 * Math.exp(-(f - c.link) / 10) : 1;
  const icon = (x: number, p: number, el: React.ReactNode, n: string) => (
    <div style={{position: 'absolute', left: x - 75, top: 500, transform: `translateY(${(1 - p) * 260}px) scale(${0.3 + 0.7 * p}) rotateY(${Math.sin(f / 18 + x) * 18}deg)`,
      opacity: Math.min(1, p * 2), filter: `drop-shadow(0 0 ${22 * flash}px ${hexA(C.purple, 0.8)})`}}>
      {el}
      <div style={{position: 'absolute', right: -6, top: -6, width: 52, height: 52, borderRadius: '50%', background: C.yellow, color: '#1e1b4b',
        fontFamily: 'Manrope', fontWeight: 800, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 18px ${C.yellow}`}}>{n}</div>
    </div>
  );
  return (
    <Shell f={f} dur={SCENES.present.dur}>
      <LetterTitle text="PRESENT PERFECT" start={c.title - 4} top={255} size={88} color={C.purple} stagger={2} spacing={1} />
      <Translation text="Өткен тәжірибе немесе қазіргімен байланысты нәтиже" start={c.title + 14} top={388} size={36} width={900} />

      {/* связи: дуга между поездками и стрелки к «сейчас» */}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <marker id="ar" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill={C.purple} /></marker>
        </defs>
        <path d={`M${P1} ${TL_Y - 22} Q ${(P1 + P2) / 2} ${TL_Y - 130} ${P2} ${TL_Y - 22}`} fill="none" stroke={C.yellow} strokeWidth="6" strokeLinecap="round"
          strokeDasharray="420" strokeDashoffset={420 * (1 - link)} style={{filter: `drop-shadow(0 0 10px ${C.yellow})`}} />
        {[P1, P2].map((x) => (
          <path key={x} d={`M${x} ${TL_Y + 26} Q ${(x + NOW) / 2} ${TL_Y + 120} ${NOW - 8} ${TL_Y + 30}`} fill="none" stroke={hexA(C.purple, 0.95)} strokeWidth="5"
            strokeDasharray="14 12" strokeDashoffset={-f * 1.5} markerEnd={toNow > 0.95 ? 'url(#ar)' : undefined}
            style={{clipPath: `inset(0 ${(1 - toNow) * 100}% 0 0)`, filter: `drop-shadow(0 0 8px ${C.purple})`}} />
        ))}
      </svg>

      <Timeline y={TL_Y} draw={1} color={col} shimmer={shimmer}>
        <Dot x={P1} y={TL_Y} color={C.purple} p={d1} size={40} />
        <Dot x={P2} y={TL_Y} color={C.purple} p={d2} size={40} />
        <Dot x={NOW} y={TL_Y} color={C.yellow} p={now} size={30} />
        <div style={{position: 'absolute', left: NOW - 90, top: TL_Y - 100, width: 180, textAlign: 'center', transform: `scale(${now})`}}>
          <Chip text="NOW" color={C.yellow} size={32} textColor="#fff" />
        </div>
      </Timeline>
      {icon(P1, i1, <Plane size={150} uid="pp1" />, '1')}
      {icon(P2, i2, <Suitcase size={150} uid="pp2" />, '2')}



      <LetterTitle text="LIFE EXPERIENCE" start={c.life} top={935} size={70} color={C.purple} stagger={1} spacing={1} />
      <Translation text="Өмірлік тәжірибе" start={c.life + 18} top={1022} size={36} />

      <Sfx name="swoosh" at={c.title - 4} />
      <Sfx name="digital" at={c.morph + 4} vol={0.7} />
      <Sfx name="pop" at={c.now} vol={0.6} />
      <Sfx name="pop" at={c.dot1} />
      <Sfx name="digital" at={c.dot1 + 6} vol={0.6} />
      <Sfx name="pop" at={c.dot2} />
      <Sfx name="digital" at={c.dot2 + 6} vol={0.6} />
      <Sfx name="pop" at={c.bounce} vol={0.7} />
      <Sfx name="pop" at={c.bounce + 12} vol={0.5} />
      <Sfx name="tick" at={c.link} vol={0.6} />
      <Sfx name="whoosh" at={c.life} vol={0.6} />
    </Shell>
  );
};
