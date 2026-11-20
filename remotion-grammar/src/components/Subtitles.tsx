import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {hexA, lin} from '../anim';
import {FPS} from '../timing';
import {SUBS} from '../subtitles';

export const SUB_TOP = 1405;

/** Нижние субтитры озвучки (караоке): отдельная тёмная плашка, слово подсвечивается, когда звучит. */
export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let idx = -1;
  SUBS.forEach((p, i) => { if (t >= p.start && t <= p.end) idx = i; });
  if (idx < 0) return null;
  const p = SUBS[idx];
  const inP = lin(t, p.start, p.start + 0.2);
  const outP = lin(t, p.end - 0.2, p.end);
  const vis = inP * (1 - outP);
  const accent = interpolateColors(f, [0, 430, 440, 760, 770, 1065, 1075], [C.blue, C.blue, C.purple, C.purple, '#7DD3FC', '#7DD3FC', '#4ADE80']);
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: SUB_TOP, display: 'flex', justifyContent: 'center',
      opacity: vis, transform: `translateY(${(1 - inP) * 20}px)`}}>
      <div style={{maxWidth: 940, padding: '14px 30px', borderRadius: 22, background: 'rgba(3,6,20,0.78)',
        border: `2px solid ${hexA('#ffffff', 0.18)}`, boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 24px ${hexA(accent, 0.25)}`,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 14, rowGap: 2, alignItems: 'center'}}>
        <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: C.bg, background: accent,
          borderRadius: 8, padding: '3px 8px', marginRight: 6}}>EN</span>
        {p.words.map((w, i) => {
          const spoken = t >= w.s - 0.04;
          const now = t >= w.s - 0.04 && t <= w.e + 0.06;
          return (
            <span key={i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 42, lineHeight: 1.25,
              color: now ? accent : spoken ? '#ffffff' : hexA('#ffffff', 0.45),
              textShadow: now ? `0 0 18px ${hexA(accent, 0.8)}` : undefined,
              transform: `scale(${now ? 1.08 : 1})`, margin: now ? '0 6px' : '0', display: 'inline-block'}}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};
