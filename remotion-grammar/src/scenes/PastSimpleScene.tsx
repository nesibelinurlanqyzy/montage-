import React from 'react';
import {useVideoConfig} from 'remotion';
import {C} from '../theme';
import {easeOut, hexA, lin, sp} from '../anim';
import {CUE, SCENES} from '../timing';
import {Chip, Dot, Sfx, Timeline} from '../components/Common';
import {BigBen, Calendar, CheckBadge} from '../components/Icons';
import {KineticText, LetterTitle, Translation, revealEnd} from '../components/Text';
import {Shell, useLocal} from './shell';

export const TL_Y = 900;
export const MARK_X = 330;
const RULE = 'Use *Past Simple* for *finished actions* in the past.';
const EX = 'I visited London *last year*.';

export const PastSimpleScene: React.FC = () => {
  const f = useLocal();
  const {fps} = useVideoConfig();
  const c = CUE.past;
  const draw = lin(f, c.line, c.line + 28, 0, 1, easeOut);
  const mark = sp(f, fps, c.marker, {damping: 10});
  const ben = sp(f, fps, c.bigben, {damping: 15, stiffness: 70});
  const cal = sp(f, fps, c.calendar, {damping: 11});
  const chk = sp(f, fps, c.check, {damping: 11});
  const chkDraw = lin(f, c.check + 4, c.check + 20);
  const done = lin(f, c.check, c.check + 20, 0, 1, easeOut);
  const wig = f > c.wiggle ? Math.sin((f - c.wiggle) / 3) * 8 * Math.exp(-(f - c.wiggle) / 25) : 0;
  const BEN_H = 380;
  return (
    <Shell f={f} dur={SCENES.past.dur}>
      <LetterTitle text="PAST SIMPLE" start={c.title - 6} top={255} size={112} color={C.blue} />
      <Translation text="Өткен шақ" start={c.title + 12} top={395} size={52} />

      {/* Биг-Бен поднимается из точки на линии времени */}
      <div style={{position: 'absolute', left: MARK_X - BEN_H * 0.25, top: TL_Y - 10 - BEN_H, width: BEN_H * 0.5 + 40, height: BEN_H + 20, overflow: 'hidden'}}>
        <div style={{position: 'absolute', bottom: 0, transform: `translateY(${(1 - ben) * (BEN_H + 20)}px)`,
          filter: `drop-shadow(0 0 30px ${hexA('#fbbf24', 0.45)})`}}>
          <BigBen height={BEN_H} f={f} uid="pb" />
        </div>
      </div>
      <div style={{position: 'absolute', left: MARK_X - 140, top: TL_Y - 60, width: 280, height: 60, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${hexA(C.blue, 0.6 * ben)} 0%, transparent 70%)`, filter: 'blur(8px)'}} />

      {/* Календарь */}
      <div style={{position: 'absolute', left: 620, top: 560, transform: `scale(${cal}) rotate(${-6 + wig}deg) translateY(${Math.sin(f / 20) * 8}px)`,
        filter: `drop-shadow(0 0 24px ${hexA(C.blue, 0.5)})`}}>
        <Calendar size={230} f={f} uid="pc" header="2025" circleP={lin(f, c.wiggle + 6, c.wiggle + 26)} flip={lin(f, c.wiggle, c.wiggle + 14)} />
      </div>

      <Timeline y={TL_Y} draw={draw} color={C.blue}>
        {/* завершённый отрезок */}
        <div style={{position: 'absolute', left: 90, top: TL_Y - 9, width: (MARK_X - 90) * done, height: 14, borderRadius: 8,
          background: '#4ADE80', boxShadow: '0 0 26px #22C55E', opacity: 0.9}} />
        {chk < 0.5 && <Dot x={MARK_X} y={TL_Y} color={C.blue} p={mark} size={38} />}
        <div style={{position: 'absolute', left: MARK_X - 48, top: TL_Y - 48, transform: `scale(${chk})`}}>
          <CheckBadge size={96} p={chkDraw} />
        </div>
        <div style={{position: 'absolute', left: MARK_X - 80, top: TL_Y + 42, width: 160, textAlign: 'center', transform: `scale(${mark})`}}>
          <Chip text="2025" color={C.blue} size={34} />
        </div>
      </Timeline>

      <KineticText text={RULE} start={c.rule} exit={c.ruleOut} top={1000} size={64} hiColor={C.blue} stagger={2} />
      <Translation text="Past Simple өткен шақта аяқталған әрекеттер үшін қолданылады." start={revealEnd(RULE, c.rule, 2) + 9} exit={c.ruleOut} top={1170} size={44} />

      <KineticText text={EX} start={c.example} top={1010} size={84} hiScale={1.2} />
      <Translation text="Мен өткен жылы Лондонға бардым." start={revealEnd(EX, c.example) + 9} top={1245} size={48} width={1000} />

      <LetterTitle text="FINISHED ACTION" start={c.finished} top={1335} size={70} color="#4ADE80" stagger={1} spacing={1} />
      <Translation text="Аяқталған әрекет" start={c.finished + 18} top={1425} size={46} />

      <Sfx name="swoosh" at={c.title - 6} />
      <Sfx name="tick" at={c.line + 4} vol={0.7} />
      <Sfx name="tick" at={c.line + 12} vol={0.6} />
      <Sfx name="tick" at={c.line + 20} vol={0.5} />
      <Sfx name="pop" at={c.marker} />
      <Sfx name="digital" at={c.bigben} />
      <Sfx name="pop" at={c.calendar} vol={0.7} />
      <Sfx name="pop" at={c.example + 10} vol={0.6} />
      <Sfx name="ding" at={c.check} vol={0.5} />
      <Sfx name="tick" at={c.wiggle} vol={0.7} />
    </Shell>
  );
};
