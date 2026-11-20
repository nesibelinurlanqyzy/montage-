import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {hexA, lin} from '../anim';
import {FPS} from '../timing';
import {KZ, SUBS} from '../subtitles';
import {Translation} from './Text';

/* Нижняя зона (безопасная для Reels): английский субтитр 1090–1280, перевод 1300–1440. */
/** Нижняя граница безопасной зоны Reels. */
export const SAFE_BOTTOM = 1490;
export const KZ_H = 130; // место под перевод (до 2 строк)
export const SUB_BOTTOM = SAFE_BOTTOM - KZ_H - 18;

const pick = <T extends {start: number; end: number}>(list: T[], t: number) => {
  let r = -1;
  list.forEach((p, i) => { if (t >= p.start && t <= p.end) r = i; });
  return r;
};

/** Единственный субтитр: крупный, слова появляются по озвучке, ключевые слова в цвете и с «подпрыгиванием». */
export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const idx = pick(SUBS, t);
  const kz = pick(KZ, t);
  const p = idx >= 0 ? SUBS[idx] : null;
  const outP = p ? lin(t, p.end - 0.12, p.end) : 1;
  return (
    <>
      {p && (
        <div style={{position: 'absolute', left: 90, width: 900, top: SUB_BOTTOM - 260, height: 260, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', columnGap: 20, rowGap: 4, opacity: 1 - outP}}>
            {p.words.map((w, i) => {
              const k = (t - w.s + 0.12) * FPS; // кадры с появления слова
              const app = Math.max(0, Math.min(1, k / 5));
              const hi = !!w.c;
              const pop = hi && k > 0 ? Math.exp(-k / 9) * Math.sin(Math.min(Math.PI, k / 3)) : 0;
              let y = (1 - app) * 26 - pop * 16;
              let sc = (0.85 + 0.15 * app) * (hi ? 1.06 + 0.18 * pop : 1);
              if (w.b) { // twice — двойной bounce
                const tt = k - 4;
                if (tt > 0 && tt < 26) { const b = Math.abs(Math.sin((Math.PI * tt) / 13)) * (tt < 13 ? 1 : 0.6); y -= 22 * b; sc += 0.14 * b; }
              }
              const col = hi ? w.c! : '#ffffff';
              return (
                <span key={i} style={{
                  display: 'inline-block', fontFamily: FONT, fontWeight: 800, fontSize: 80, lineHeight: 1.1,
                  color: col, opacity: app, margin: hi ? '0 8px' : 0,
                  transform: `translateY(${y}px) scale(${sc})`, transformOrigin: '50% 80%',
                  WebkitTextStroke: '2px rgba(4,8,24,0.9)', paintOrder: 'stroke fill',
                  textShadow: hi ? `0 0 26px ${hexA(col, 0.85)}, 0 6px 0 rgba(0,0,0,0.35)` : `0 6px 18px rgba(0,0,0,0.7)`,
                }}>{w.w}</span>
              );
            })}
          </div>
        </div>
      )}
      {kz >= 0 && (
        <Translation key={kz} text={KZ[kz].kz} start={Math.round(KZ[kz].start * FPS)} exit={Math.round(KZ[kz].end * FPS) - 12} top={0} bottom={SAFE_BOTTOM} size={40} width={940} left={70} boxH={KZ_H - 8} />
      )}
    </>
  );
};

export {C};
