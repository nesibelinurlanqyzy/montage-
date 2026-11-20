import React from 'react';
import {useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {easeInOut, easeOut, hexA, lin, sp} from '../anim';
import {CUE, SCENES} from '../timing';
import {Chip, GlassCard, Sfx} from '../components/Common';
import {Calendar, CheckBadge, Clock, Star} from '../components/Icons';
import {LetterTitle, Text3D, Translation} from '../components/Text';
import {Shell, useLocal} from './shell';

const TOP = 410, H = 650, W = 440;

const pulse = (f: number, at: number) => {
  const t = f - at;
  if (t < 0) return 0;
  return Math.min(1, t / 8) * (t < 40 ? 1 : Math.max(0.35, 1 - (t - 40) / 30));
};

const Chevrons: React.FC<{x: number; color: string; on: number; f: number}> = ({x, color, on, f}) => (
  <div style={{position: 'absolute', left: x - 40, top: TOP + H + 18, width: 80, opacity: on}}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{width: 0, height: 0, margin: '0 auto', borderLeft: '30px solid transparent', borderRight: '30px solid transparent',
        borderBottom: `26px solid ${color}`, marginTop: 4, opacity: 0.35 + 0.65 * Math.abs(Math.sin(f / 6 - i * 0.8)),
        transform: `translateY(${-Math.abs(Math.sin(f / 6)) * 12}px)`, filter: `drop-shadow(0 0 10px ${color})`}} />
    ))}
  </div>
);

export const MainRuleScene: React.FC = () => {
  const f = useLocal();
  const {fps} = useVideoConfig();
  const c = CUE.rule;
  const split = lin(f, -14, 4, 0, 1, easeInOut);
  const L = sp(f, fps, c.left, {damping: 15, stiffness: 100});
  const R = sp(f, fps, c.right, {damping: 15, stiffness: 100});
  const vs = sp(f, fps, c.vs, {damping: 10});
  const pw = Math.max(pulse(f, c.when), pulse(f, c.both));
  const pe = Math.max(pulse(f, c.exp), pulse(f, c.both));
  const item = (p: number, d: number) => sp(f, fps, d, {damping: 12});

  const Label: React.FC<{lines: string[]; size: number; color: string; p: number}> = ({lines, size, color, p}) => (
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.05, color: '#fff', textAlign: 'center',
      transform: `scale(${1 + 0.22 * p})`, textShadow: `0 0 ${10 + 40 * p}px ${hexA(color, 0.6 + 0.4 * p)}`}}>
      {lines.map((l) => <div key={l}>{l}</div>)}
    </div>
  );
  return (
    <Shell f={f} dur={SCENES.rule.dur}>
      {/* световой разрез экрана */}
      <div style={{position: 'absolute', left: 538, top: 0, width: 4, height: 1920 * Math.min(1, split * 1.4), background: '#fff',
        boxShadow: `0 0 40px #fff, 0 0 90px ${C.purple}`, opacity: 1 - lin(f, 6, 26)}} />

      <LetterTitle text="THE MAIN RULE" start={c.header - 4} top={262} size={64} color="#ffffff" stagger={1} spacing={4} />
      <Translation text="Негізгі ереже" start={c.header + 10} top={345} size={34} />

      {/* левая карточка */}
      <div style={{position: 'absolute', left: 70, top: TOP, perspective: 1200, opacity: Math.min(1, L * 1.5),
        transform: `translateX(${(1 - L) * 260}px)`}}>
        <div style={{transform: `rotateY(${(1 - L) * 70 + Math.sin(f / 30) * 3}deg)`, transformOrigin: '100% 50%'}}>
          <GlassCard color={C.blue} w={W} h={H} glow={0.7 + 0.6 * pw}>
            <div style={{position: 'absolute', top: 34, width: '100%'}}><Label lines={['PAST', 'SIMPLE']} size={62} color={C.blue} p={0} /></div>
            <div style={{position: 'absolute', top: 190, left: 40, transform: `scale(${item(L, c.left + 10)}) rotate(-8deg)`}}>
              <Calendar size={170} f={f} uid="r1" header="WHEN" circleP={lin(f, c.when, c.when + 18)} />
            </div>
            <div style={{position: 'absolute', top: 240, left: 230, transform: `scale(${item(L, c.left + 16)})`}}>
              <Clock size={150} f={f * 3} uid="r2" />
            </div>
            <div style={{position: 'absolute', top: 420, width: '100%'}}><Label lines={['WHEN?']} size={88} color={C.blue} p={pw} /></div>
            <Translation text="ҚАШАН?" start={c.left + 20} top={555} size={42} width={W} left={0} />
          </GlassCard>
        </div>
      </div>

      {/* правая карточка */}
      <div style={{position: 'absolute', left: 570, top: TOP, perspective: 1200, opacity: Math.min(1, R * 1.5),
        transform: `translateX(${(1 - R) * -260}px)`}}>
        <div style={{transform: `rotateY(${-(1 - R) * 70 - Math.sin(f / 30) * 3}deg)`, transformOrigin: '0% 50%'}}>
          <GlassCard color={C.purple} w={W} h={H} glow={0.7 + 0.6 * pe}>
            <div style={{position: 'absolute', top: 34, width: '100%'}}><Label lines={['PRESENT', 'PERFECT']} size={62} color={C.purple} p={0} /></div>
            <div style={{position: 'absolute', top: 196, left: 40, transform: `scale(${item(R, c.right + 10)}) rotate(${Math.sin(f / 10) * 8}deg)`}}>
              <Star size={160} uid="r3" />
            </div>
            <div style={{position: 'absolute', top: 245, left: 250, transform: `scale(${item(R, c.right + 16)})`}}>
              <CheckBadge size={140} p={lin(f, c.right + 18, c.right + 34)} color="#22C55E" />
            </div>
            <div style={{position: 'absolute', top: 400, width: '100%'}}><Label lines={['EXPERIENCE', '/ RESULT']} size={56} color={C.purple} p={pe} /></div>
            <Translation text="ТӘЖІРИБЕ / НӘТИЖЕ" start={c.right + 20} top={545} size={32} width={W - 40} left={20} />
          </GlassCard>
        </div>
      </div>

      {/* VS в центре */}
      {f >= c.vs - 1 && (
        <div style={{position: 'absolute', left: 540 - 85, top: TOP + H / 2 - 85, width: 170, height: 170, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, #1e293b, ${C.bg})`, border: `4px solid ${C.yellow}`,
          boxShadow: `0 0 50px ${hexA(C.yellow, 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${vs}) rotate(${(1 - vs) * 180}deg)`}}>
          <Text3D text="VS" size={80} from="#ffffff" to={C.yellow} side="#a16207" depth={8} rotY={Math.sin(f / 14) * 25} />
        </div>
      )}

      {/* маркер-слова под карточками */}
      {[['yesterday', 'last year', 'in 2025'], ['ever / never', 'twice', 'already']].map((list, side) => list.map((w, i) => {
        const p = sp(f, fps, c.markers + side * 10 + i * 5, {damping: 12});
        return (
          <div key={w} style={{position: 'absolute', left: (side ? 570 : 70), width: W, top: 1110 + i * 66, display: 'flex', justifyContent: 'center',
            transform: `scale(${p}) translateY(${(1 - p) * 30}px)`, opacity: Math.min(1, p * 1.5)}}>
            <Chip text={w} color={side ? C.purple : C.blue} size={36} />
          </div>
        );
      }))}

      <Sfx name="swoosh" at={-12} />
      <Sfx name="whoosh" at={c.left} />
      <Sfx name="whoosh" at={c.right} />
      <Sfx name="digital" at={c.vs} vol={0.7} />
      <Sfx name="pop" at={c.when} />
      <Sfx name="pop" at={c.exp} />
      <Sfx name="pop" at={c.both} vol={0.6} />
      <Sfx name="pop" at={c.markers} vol={0.5} />
      <Sfx name="pop" at={c.markers + 10} vol={0.5} />
    </Shell>
  );
};
