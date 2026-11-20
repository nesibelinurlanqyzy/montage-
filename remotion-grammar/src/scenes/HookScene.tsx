import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {easeInOut, hexA, lin, sp} from '../anim';
import {CUE, SCENES} from '../timing';
import {GlassCard, Sfx} from '../components/Common';
import {Calendar, Clock, Question} from '../components/Icons';
import {KineticText, Text3D, Translation, revealEnd} from '../components/Text';
import {Shell, useLocal} from './shell';

const Q = 'Do you know the *difference* between these two tenses?';

const TenseCard: React.FC<{label: string[]; color: string}> = ({label, color}) => (
  <GlassCard color={color} w={380} h={240} radius={40}>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.05, color: '#fff', textShadow: `0 0 26px ${color}`}}>
      {label.map((l) => <div key={l}>{l}</div>)}
    </div>
  </GlassCard>
);

export const HookScene: React.FC = () => {
  const f = useLocal(true);
  const {fps} = useVideoConfig();
  const c = CUE.hook;
  const pl = sp(f, fps, c.cards, {damping: 16, stiffness: 90});
  const pr = sp(f, fps, c.cards + 6, {damping: 16, stiffness: 90});
  const near = lin(f, 30, 85, 0, 1, easeInOut);
  const cam = lin(f, c.camera - 10, c.camera + 40, 0, 1, easeInOut);
  const lx = (p: number) => -1100 * (1 - p) - 290 + near * 14;
  const rx = (p: number) => 1100 * (1 - p) + 290 - near * 14;
  const prev = (fr: number, d: number) => sp(fr, fps, d, {damping: 16, stiffness: 90});
  const vs = sp(f, fps, c.vs, {damping: 10, stiffness: 120});
  const cardY = 640 - cam * 120;

  const trail = (side: 'l' | 'r') => [3, 2, 1].map((k) => {
    const p = side === 'l' ? prev(f - k, c.cards) : prev(f - k, c.cards + 6);
    const x = side === 'l' ? lx(p) : rx(p);
    const cur = side === 'l' ? lx(pl) : rx(pr);
    if (Math.abs(cur - x) < 4) return null;
    return (
      <div key={k} style={{position: 'absolute', left: 540 + x - 190, top: cardY - 120, opacity: 0.18 / k, filter: 'blur(6px)',
        transform: `rotateY(${side === 'l' ? 22 : -22}deg)`}}>
        <TenseCard label={side === 'l' ? ['PAST', 'SIMPLE'] : ['PRESENT', 'PERFECT']} color={side === 'l' ? C.blue : C.purple} />
      </div>
    );
  });
  const vel = (a: number, b: number) => Math.min(14, Math.abs(a - b) * 0.08);

  const icon = (d: number) => sp(f, fps, c.icons + d, {damping: 12});
  return (
    <Shell f={f} dur={SCENES.hook.dur} first>
      <AbsoluteFill style={{perspective: 1400}}>
        <AbsoluteFill style={{transform: `rotateX(${cam * 12}deg) translateY(${-cam * 30}px) scale(${1 - cam * 0.06})`, transformStyle: 'preserve-3d'}}>
          {/* иконки позади карточек — параллакс */}
          <div style={{position: 'absolute', left: 90, top: 330 + Math.sin(f / 18) * 12 - cam * 60, transform: `scale(${icon(0)}) rotate(${-12 + Math.sin(f / 25) * 6}deg)`, opacity: 0.95}}>
            <Clock size={190} f={f} uid="h1" />
          </div>
          <div style={{position: 'absolute', left: 790, top: 320 + Math.cos(f / 20) * 12 - cam * 60, transform: `scale(${icon(5)}) rotate(${10 + Math.sin(f / 22) * 6}deg)`}}>
            <Calendar size={200} f={f} uid="h2" header="2025" />
          </div>
          <div style={{position: 'absolute', left: 445, top: 300 + Math.sin(f / 15) * 16 - cam * 90, transform: `scale(${icon(10) * 0.9}) rotate(${Math.sin(f / 14) * 10}deg)`, opacity: 0.9}}>
            <Question size={190} uid="h3" />
          </div>
          <div style={{position: 'absolute', left: 860, top: 860 + Math.sin(f / 21) * 10 - cam * 40, transform: `scale(${icon(14) * 0.55})`, filter: 'blur(2px)', opacity: 0.6}}>
            <Question size={190} uid="h4" color={C.blue} />
          </div>

          {trail('l')}
          {trail('r')}
          <div style={{position: 'absolute', left: 540 + lx(pl) - 190, top: cardY - 120, filter: `blur(${vel(lx(pl), lx(prev(f - 1, c.cards)))}px)`,
            transform: `rotateY(${22 - near * 8}deg) rotateZ(${(1 - pl) * -10}deg)`}}>
            <TenseCard label={['PAST', 'SIMPLE']} color={C.blue} />
          </div>
          <div style={{position: 'absolute', left: 540 + rx(pr) - 190, top: cardY - 120, filter: `blur(${vel(rx(pr), rx(prev(f - 1, c.cards + 6)))}px)`,
            transform: `rotateY(${-22 + near * 8}deg) rotateZ(${(1 - pr) * 10}deg)`}}>
            <TenseCard label={['PRESENT', 'PERFECT']} color={C.purple} />
          </div>

          {/* 3D VS */}
          {f >= c.vs - 1 && (
            <div style={{position: 'absolute', left: 0, width: 1080, top: cardY - 95, display: 'flex', justifyContent: 'center',
              transform: `scale(${vs}) rotateZ(${(1 - vs) * -40}deg)`}}>
              <div style={{position: 'absolute', top: 10, width: 220, height: 220, borderRadius: '50%',
                background: `radial-gradient(circle, ${hexA(C.yellow, 0.55)} 0%, transparent 70%)`, filter: 'blur(10px)', opacity: 0.6 + 0.3 * Math.sin(f / 8)}} />
              <Text3D text="VS" size={170} from="#ffffff" to={C.yellow} side="#a16207" rotY={Math.sin(f / 16) * 22} rotX={8} glow={hexA(C.yellow, 0.6)} />
            </div>
          )}
        </AbsoluteFill>
      </AbsoluteFill>

      <KineticText text={Q} start={c.question} top={880} size={76} width={960} />
      <Translation text="Осы екі шақтың айырмашылығын білесің бе?" start={revealEnd(Q, c.question) + 9} top={1200} size={48} />

      <Sfx name="whoosh" at={c.cards} />
      <Sfx name="whoosh" at={c.cards + 6} vol={0.8} />
      <Sfx name="digital" at={c.vs} />
      <Sfx name="pop" at={c.icons} vol={0.6} />
      <Sfx name="pop" at={c.question + 8} vol={0.7} />
    </Shell>
  );
};
