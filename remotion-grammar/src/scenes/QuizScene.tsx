import React from 'react';
import {random, useVideoConfig} from 'remotion';
import {C, FONT, FONT_KZ} from '../theme';
import {easeInOut, easeOut, hexA, lin, sp} from '../anim';
import {CUE, SCENES} from '../timing';
import {Chip, Sfx} from '../components/Common';
import {CheckBadge, CrossBadge} from '../components/Icons';
import {KineticText, Text3D, Translation} from '../components/Text';
import {Shell, useLocal} from './shell';

const CARD_W = 940, CARD_H = 150, A_TOP = 720, B_TOP = 900;

const Answer: React.FC<{letter: string; text: string; state: 'idle' | 'wrong' | 'right'; reveal: number; badgeP: number}> = ({letter, text, state, reveal, badgeP}) => {
  const base = state === 'wrong' ? C.red : state === 'right' ? C.green : '#8B9CF7';
  const a = 0.22 + 0.3 * reveal;
  return (
    <div style={{width: CARD_W, height: CARD_H, borderRadius: 34, display: 'flex', alignItems: 'center', gap: 30, padding: '0 34px', boxSizing: 'border-box',
      background: `linear-gradient(120deg, ${hexA(base, a + 0.15)}, ${hexA(base, a * 0.4)} 60%, rgba(8,14,36,0.7))`,
      border: `3px solid ${hexA(base, 0.95)}`, boxShadow: `0 0 ${30 + 40 * reveal}px ${hexA(base, 0.45 + 0.3 * reveal)}, 0 20px 40px rgba(0,0,0,0.45)`}}>
      <div style={{width: 92, height: 92, flexShrink: 0, position: 'relative'}}>
        {state === 'idle' || badgeP <= 0 ? (
          <div style={{width: 92, height: 92, borderRadius: '50%', background: '#fff', color: C.bg, fontFamily: FONT, fontWeight: 800, fontSize: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{letter}</div>
        ) : state === 'wrong' ? <CrossBadge size={92} p={badgeP} /> : <CheckBadge size={92} p={badgeP} />}
      </div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: '#fff', whiteSpace: 'nowrap',
        textDecoration: state === 'wrong' && badgeP > 0.6 ? `line-through ${hexA('#ffffff', 0.7)}` : undefined}}>{text}</div>
    </div>
  );
};

export const QuizScene: React.FC = () => {
  const f = useLocal();
  const {fps} = useVideoConfig();
  const c = CUE.quiz;
  const t = sp(f, fps, c.title, {damping: 10, stiffness: 110});
  const up = lin(f, c.up - 6, c.up + 16, 0, 1, easeInOut);
  const pa = sp(f, fps, c.cardA, {damping: 14});
  const pb = sp(f, fps, c.cardB, {damping: 14});
  const wrong = lin(f, c.wrong, c.wrong + 6);
  const right = lin(f, c.right, c.right + 6);
  const shake = f > c.wrong && f < c.wrong + 18 ? Math.sin((f - c.wrong) * 2.2) * 14 * (1 - (f - c.wrong) / 18) : 0;
  const fin = lin(f, c.final - 4, c.final + 18, 0, 1, easeInOut);
  const bScale = 1 + 0.05 * sp(f, fps, c.right, {damping: 8}) - 0.02 * fin;
  const glow = f > c.right ? 0.5 + 0.5 * Math.sin((f - c.right) / 5) : 0;

  // countdown
  const cd = [c.c3, c.c2, c.c1];
  const idx = f >= c.c1 ? 2 : f >= c.c2 ? 1 : f >= c.c3 ? 0 : -1;
  const cdOn = f >= c.c3 && f < c.wrong + 4;
  const cdT = idx >= 0 ? f - cd[idx] : 0;
  const cdPop = idx >= 0 ? sp(f, fps, cd[idx], {damping: 9, stiffness: 200}) : 0;
  const ring = lin(f, c.c3, c.wrong, 0, 1);

  // конфетти от правильного ответа
  const confetti = f > c.right ? new Array(36).fill(0).map((_, i) => {
    const tt = (f - c.right) / fps;
    const ang = random(`a${i}`) * Math.PI * 2;
    const v = 500 + random(`v${i}`) * 700;
    const x = 540 + Math.cos(ang) * v * tt;
    const y = B_TOP + CARD_H / 2 + Math.sin(ang) * v * tt + 900 * tt * tt;
    const col = [C.yellow, C.green, C.blue, C.purple][i % 4];
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: 14, height: 22, background: col, borderRadius: 4,
      transform: `rotate(${f * (8 + i)}deg)`, opacity: Math.max(0, 1 - tt / 1.3)}} />;
  }) : null;

  return (
    <Shell f={f} dur={SCENES.quiz.dur} last>
      {/* QUICK QUIZ! */}
      <div style={{position: 'absolute', left: 0, width: 1080, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'center',
        transform: `translateY(${-up * 440}px) scale(${(0.4 + 0.6 * t) * (1 - up * 0.42)})`, transformOrigin: '50% 0%', opacity: Math.min(1, t * 2)}}>
        <Text3D text="QUICK QUIZ!" size={140} from="#ffffff" to={C.yellow} side="#7c2d12" rotY={Math.sin(f / 18) * 14} rotX={10} glow={hexA(C.yellow, 0.55)} depth={16} />
        <div style={{marginTop: 30, fontFamily: FONT_KZ, fontWeight: 800, fontSize: 64, color: C.yellow, textShadow: `0 0 24px ${hexA(C.yellow, 0.5)}`,
          opacity: lin(f, c.title + 10, c.title + 20)}}>ЖЫЛДАМ ТЕСТ!</div>
      </div>

      <KineticText text="Which is correct?" start={c.question} exit={c.final - 6} top={500} size={76} />
      <Translation text="Қайсысы дұрыс?" start={c.question + 16} exit={c.final - 6} top={600} size={48} />

      {/* карточки */}
      <div style={{position: 'absolute', left: 70, top: A_TOP, transform: `translateX(${(1 - pa) * 1100 + shake - fin * 1200}px) rotate(${-fin * 8}deg)`,
        opacity: 1 - fin}}>
        <Answer letter="A" text="I have seen him yesterday." state={f >= c.wrong ? 'wrong' : 'idle'} reveal={wrong} badgeP={lin(f, c.wrong, c.wrong + 12)} />
      </div>
      <div style={{position: 'absolute', left: 70, top: B_TOP, transform: `translateX(${(1 - pb) * -1100}px) translateY(${-fin * 60}px) scale(${bScale})`,
        filter: glow ? `drop-shadow(0 0 ${20 * glow}px ${hexA(C.green, 0.8)})` : undefined}}>
        <Answer letter="B" text="I saw him yesterday." state={f >= c.right ? 'right' : 'idle'} reveal={right} badgeP={lin(f, c.right, c.right + 12)} />
      </div>
      {confetti}

      {/* обратный отсчёт */}
      {cdOn && (
        <div style={{position: 'absolute', left: 540 - 110, top: 1120, width: 220, height: 220, opacity: 1 - lin(f, c.wrong - 4, c.wrong + 4)}}>
          <svg width={220} height={220} style={{position: 'absolute', inset: 0}}>
            <circle cx="110" cy="110" r="94" fill="rgba(8,14,36,0.7)" stroke={hexA('#ffffff', 0.15)} strokeWidth="12" />
            <circle cx="110" cy="110" r="94" fill="none" stroke={C.yellow} strokeWidth="12" strokeLinecap="round" strokeDasharray={591}
              strokeDashoffset={591 * ring} transform="rotate(-90 110 110)" style={{filter: `drop-shadow(0 0 10px ${C.yellow})`}} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800,
            fontSize: 120, color: '#fff', transform: `scale(${0.5 + 0.5 * cdPop})`, opacity: 1 - lin(cdT, 22, 30) * 0.6, textShadow: `0 0 30px ${C.yellow}`}}>
            {3 - Math.max(0, idx)}
          </div>
        </div>
      )}

      {/* финал */}
      <Translation text="Мен оны кеше көрдім." start={c.final + 8} top={1060} size={50} />
      {f >= c.chip - 1 && (
        <div style={{position: 'absolute', left: 0, width: 1080, top: 1170, display: 'flex', justifyContent: 'center', transform: `scale(${sp(f, fps, c.chip, {damping: 11})})`}}>
          <Chip text="Yesterday → Past Simple" color={C.blue} size={52} />
        </div>
      )}
      <Translation text="Кеше — нақты өткен уақыт." start={c.note} top={1300} size={42} />

      <Sfx name="rise" at={c.title - 10} vol={0.8} />
      <Sfx name="digital" at={c.title + 4} vol={0.6} />
      <Sfx name="pop" at={c.question} vol={0.7} />
      <Sfx name="whoosh" at={c.cardA} />
      <Sfx name="whoosh" at={c.cardB} vol={0.8} />
      <Sfx name="tock" at={c.c3} />
      <Sfx name="tock" at={c.c2} />
      <Sfx name="tock" at={c.c1} />
      <Sfx name="wrong" at={c.wrong} vol={0.6} />
      <Sfx name="ding" at={c.right} />
      <Sfx name="swoosh" at={c.final} vol={0.7} />
      <Sfx name="pop" at={c.chip} vol={0.7} />
    </Shell>
  );
};
