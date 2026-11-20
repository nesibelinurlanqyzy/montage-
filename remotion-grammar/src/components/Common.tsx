import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {hexA} from '../anim';
import {SFX_VOLUME} from '../timing';

export type SfxName = 'whoosh' | 'swoosh' | 'pop' | 'tick' | 'tock' | 'digital' | 'ding' | 'wrong' | 'rise';

/** Звуковой эффект на кадре `at` (локально в сцене). */
export const SceneOffset = React.createContext(0);
export const Sfx: React.FC<{name: SfxName; at: number; vol?: number}> = ({name, at, vol = 1}) => {
  const off = React.useContext(SceneOffset);
  return (
    <Sequence from={Math.max(0, at + off)} durationInFrames={60} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={SFX_VOLUME * vol} />
    </Sequence>
  );
};

/** Стеклянная карточка с градиентной рамкой и свечением. */
export const GlassCard: React.FC<{color: string; w: number; h: number; radius?: number; glow?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  color, w, h, radius = 36, glow = 1, children, style,
}) => (
  <div style={{
    position: 'relative', width: w, height: h, borderRadius: radius,
    background: `linear-gradient(150deg, ${hexA(color, 0.42)} 0%, ${hexA(color, 0.12)} 45%, rgba(8,14,36,0.75) 100%)`,
    border: `3px solid ${hexA(color, 0.9)}`,
    boxShadow: `0 0 ${50 * glow}px ${hexA(color, 0.55 * glow)}, inset 0 0 40px ${hexA(color, 0.25)}, 0 30px 60px rgba(0,0,0,0.5)`,
    overflow: 'hidden', ...style,
  }}>
    <div style={{position: 'absolute', left: -w * 0.3, top: -h * 0.6, width: w * 1.2, height: h * 0.9, borderRadius: '50%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0))', transform: 'rotate(-12deg)'}} />
    {children}
  </div>
);

/** Светящаяся 3D-линия времени (рисуется, бегущий блик, деления, стрелка). */
export const Timeline: React.FC<{y: number; draw: number; color: string; x0?: number; x1?: number; children?: React.ReactNode; shimmer?: number}> = ({
  y, draw, color, x0 = 90, x1 = 990, children, shimmer,
}) => {
  const f = useCurrentFrame();
  const len = (x1 - x0) * draw;
  const ticks = [] as React.ReactNode[];
  for (let x = x0 + 40; x < x0 + len - 30; x += 60) {
    ticks.push(<div key={x} style={{position: 'absolute', left: x - x0 - 2, top: -14, width: 4, height: 38, borderRadius: 2, background: hexA(color, 0.55)}} />);
  }
  const sx = shimmer !== undefined ? shimmer : ((f * 9) % 1400) / 1400;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: y - 60, width: 1080, height: 120, perspective: 700}}>
        <div style={{position: 'absolute', left: x0, top: 50, width: len, height: 20, transform: 'rotateX(35deg)', transformOrigin: '50% 50%'}}>
          {/* «толщина» линии */}
          <div style={{position: 'absolute', inset: 0, top: 8, borderRadius: 10, background: hexA(color, 0.35), filter: 'blur(1px)'}} />
          <div style={{
            position: 'absolute', inset: 0, height: 14, borderRadius: 10,
            background: `linear-gradient(90deg, ${hexA(color, 0.2)}, ${color} 20%, #ffffff 50%, ${color} 80%, ${hexA(color, 0.9)})`,
            backgroundSize: '200% 100%', backgroundPosition: `${-sx * 200}% 0`,
            boxShadow: `0 0 24px ${color}, 0 0 70px ${hexA(color, 0.7)}`,
          }} />
          {ticks}
        </div>
        {draw > 0.98 && (
          <div style={{position: 'absolute', left: x1 - 6, top: 36, width: 0, height: 0, borderTop: '22px solid transparent', borderBottom: '22px solid transparent',
            borderLeft: `36px solid ${color}`, filter: `drop-shadow(0 0 14px ${color})`}} />
        )}
      </div>
      {children}
    </>
  );
};

/** Светящаяся точка на линии времени. */
export const Dot: React.FC<{x: number; y: number; color: string; p: number; size?: number}> = ({x, y, color, p, size = 34}) => {
  const f = useCurrentFrame();
  const pulse = (f % 40) / 40;
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${p})`}}>
      <div style={{position: 'absolute', inset: -size * pulse, borderRadius: '50%', border: `3px solid ${hexA(color, 1 - pulse)}`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${color} 55%)`,
        boxShadow: `0 0 30px ${color}, 0 0 70px ${hexA(color, 0.7)}`}} />
    </div>
  );
};

export const Chip: React.FC<{text: string; color: string; size?: number; style?: React.CSSProperties; textColor?: string}> = ({text, color, size = 38, style, textColor = '#fff'}) => (
  <div style={{
    display: 'inline-block', padding: `${size * 0.3}px ${size * 0.7}px`, borderRadius: 999, fontFamily: FONT, fontWeight: 800,
    fontSize: size, color: textColor, background: `linear-gradient(180deg, ${hexA(color, 0.55)}, ${hexA(color, 0.25)})`,
    border: `2px solid ${color}`, boxShadow: `0 0 26px ${hexA(color, 0.6)}`, whiteSpace: 'nowrap', ...style,
  }}>{text}</div>
);

export {C};
