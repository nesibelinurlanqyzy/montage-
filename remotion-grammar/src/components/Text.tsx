import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, FONT_KZ} from '../theme';
import {clamp, easeIn, easeOut, hexA, lin, sp} from '../anim';
import {interpolate} from 'remotion';

type Word = {w: string; hi: boolean};
const parse = (text: string): Word[] => {
  const out: Word[] = [];
  let on = false;
  for (const raw of text.split(' ')) {
    let w = raw;
    const open = w.startsWith('*');
    if (open) { on = true; w = w.slice(1); }
    const close = /\*[.,!?:;]*$/.test(w);
    const hi = on;
    if (close) { w = w.replace('*', ''); on = false; }
    out.push({w, hi});
  }
  return out;
};

/**
 * Kinetic typography: слова вылетают по одному (spring + 3D-поворот + blur → резкость),
 * ключевые слова (*так*) меняют цвет и «подпрыгивают».
 */
export const KineticText: React.FC<{
  text: string; start: number; exit?: number; size?: number; color?: string; hiColor?: string;
  top: number; width?: number; weight?: number; stagger?: number; bounceAt?: number; hiScale?: number; lineHeight?: number;
}> = ({text, start, exit, size = 80, color = C.white, hiColor = C.yellow, top, width = 940, weight = 800, stagger = 3, bounceAt, hiScale = 1.12, lineHeight = 1.18}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = parse(text);
  if (f < start - 2) return null;
  const ex = exit !== undefined ? lin(f, exit, exit + 12, 0, 1, easeIn) : 0;
  if (ex >= 1) return null;
  return (
    <div style={{
      position: 'absolute', top, left: (1080 - width) / 2, width, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      columnGap: size * 0.26, rowGap: size * (lineHeight - 1), fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: 1.08,
      perspective: 900, opacity: 1 - ex, transform: `translateY(${-40 * ex}px)`, filter: ex > 0 ? `blur(${ex * 10}px)` : undefined,
    }}>
      {words.map((wd, i) => {
        const d = start + i * stagger;
        const p = sp(f, fps, d, {damping: 15, stiffness: 140});
        const blur = interpolate(p, [0, 1], [10, 0], clamp);
        const pop = wd.hi ? sp(f, fps, d + 8, {damping: 9, stiffness: 160}) : 0;
        let scale = 1 + (hiScale - 1) * pop;
        let y = (1 - p) * 60;
        if (wd.hi && bounceAt !== undefined) {
          const t = f - bounceAt;
          if (t >= 0 && t < 24) {
            const k = Math.abs(Math.sin((Math.PI * t) / 12)) * (t < 12 ? 1 : 0.55);
            y -= 10 * k; scale += 0.16 * k;
          }
        }
        const col = wd.hi ? interpolateColor(pop, color, hiColor) : color;
        return (
          <span key={i} style={{
            display: 'inline-block', color: col, opacity: Math.min(1, p * 1.4),
            margin: wd.hi ? `0 ${(hiScale - 1 + (bounceAt !== undefined ? 0.1 : 0)) * wd.w.length * size * 0.3}px` : undefined,
            transform: `translateY(${y}px) rotateX(${(1 - p) * -75}deg) scale(${scale})`, transformOrigin: '50% 80%',
            filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
            textShadow: wd.hi ? `0 0 ${28 * pop}px ${hexA(hiColor, 0.75)}, 0 6px 0 rgba(0,0,0,0.25)` : '0 6px 22px rgba(0,0,0,0.45)',
          }}>{wd.w}</span>
        );
      })}
    </div>
  );
};

const interpolateColor = (t: number, a: string, b: string) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const k = Math.max(0, Math.min(1, t));
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};

/** Время, когда KineticText полностью раскрылся (для старта перевода +0.3 с). */
export const revealEnd = (text: string, start: number, stagger = 3) => start + parse(text).length * stagger;

/** Казахский перевод — жёлтый, под английским, появляется мягко снизу. */
export const Translation: React.FC<{text: string; start: number; exit?: number; top: number; size?: number; width?: number; color?: string; weight?: number; left?: number}> = ({
  text, start, exit, top, size = 46, width = 920, color = C.yellow, weight = 700, left,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < start - 2) return null;
  const p = sp(f, fps, start, {damping: 18, stiffness: 110});
  const ex = exit !== undefined ? lin(f, exit, exit + 12, 0, 1, easeIn) : 0;
  if (ex >= 1) return null;
  const clip = lin(f, start, start + 16, 0, 100, easeOut);
  return (
    <div style={{
      position: 'absolute', top, left: left ?? (1080 - width) / 2, width, textAlign: 'center', fontFamily: FONT_KZ, fontWeight: weight,
      fontSize: size, lineHeight: 1.22, color, letterSpacing: 0.2,
      opacity: p * (1 - ex), transform: `translateY(${(1 - p) * 30 - ex * 30}px)`,
      filter: `blur(${(1 - p) * 6 + ex * 8}px)`, textShadow: `0 0 24px ${hexA(color, 0.35)}, 0 4px 14px rgba(0,0,0,0.5)`,
      clipPath: `inset(0 ${(100 - clip) / 2}% 0 ${(100 - clip) / 2}%)`,
    }}>{text}</div>
  );
};

/** Заголовок по буквам: буквы переворачиваются в 3D и светятся. */
export const LetterTitle: React.FC<{text: string; start: number; top: number; size?: number; color: string; exit?: number; stagger?: number; spacing?: number}> = ({
  text, start, top, size = 110, color, exit, stagger = 2, spacing = 2,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < start - 2) return null;
  const ex = exit !== undefined ? lin(f, exit, exit + 12, 0, 1, easeIn) : 0;
  if (ex >= 1) return null;
  const glow = 0.6 + 0.4 * Math.sin(f / 12);
  return (
    <div style={{
      position: 'absolute', top, left: 0, width: 1080, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: size,
      letterSpacing: spacing, perspective: 800, opacity: 1 - ex, filter: ex > 0 ? `blur(${ex * 10}px)` : undefined,
      transform: `scale(${1 + ex * 0.1})`, whiteSpace: 'nowrap',
    }}>
      {text.split('').map((ch, i) => {
        const p = sp(f, fps, start + i * stagger, {damping: 13, stiffness: 150});
        return (
          <span key={i} style={{
            display: 'inline-block', color, minWidth: ch === ' ' ? size * 0.28 : undefined,
            transform: `translateY(${(1 - p) * -50}px) rotateY(${(1 - p) * 90}deg) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.5),
            textShadow: `0 0 ${30 * glow}px ${hexA(color, 0.8)}, 0 0 80px ${hexA(color, 0.45)}, 0 5px 0 ${hexA('#000000', 0.35)}`,
          }}>{ch}</span>
        );
      })}
    </div>
  );
};

/**
 * Настоящий 3D-текст: слои с translateZ в preserve-3d, лицевой слой с градиентом.
 */
export const Text3D: React.FC<{text: string; size: number; from: string; to: string; side: string; depth?: number; rotY?: number; rotX?: number; glow?: string}> = ({
  text, size, from, to, side, depth = 14, rotY = 0, rotX = 0, glow,
}) => {
  const layers = new Array(depth).fill(0);
  const base: React.CSSProperties = {position: 'absolute', left: 0, top: 0, fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'};
  return (
    <div style={{perspective: 1000, filter: glow ? `drop-shadow(0 0 30px ${glow}) drop-shadow(0 20px 30px rgba(0,0,0,0.5))` : undefined}}>
      <div style={{position: 'relative', transformStyle: 'preserve-3d', transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`}}>
        <div style={{...base, position: 'relative', visibility: 'hidden'}}>{text}</div>
        {layers.map((_, i) => (
          <div key={i} style={{...base, color: side, transform: `translateZ(${-(i + 1) * 2.4}px)`, opacity: 1 - i / (depth * 1.6)}}>{text}</div>
        ))}
        <div style={{...base, background: `linear-gradient(180deg, ${from} 10%, ${to} 95%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{text}</div>
      </div>
    </div>
  );
};
