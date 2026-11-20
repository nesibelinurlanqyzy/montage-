import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {sp} from '../anim';

/** Логотип Cambridge School: белая плашка (бордовый логотип на тёмном фоне не читается). */
export const LogoBadge: React.FC<{top: number; h?: number; delay?: number; still?: boolean}> = ({top, h = 60, delay = 6, still}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = still ? 1 : sp(f, fps, delay, {damping: 14});
  const shine = still ? -1 : ((f - delay - 20) % 240) / 40;
  const w = (h * 863) / 300;
  return (
    <div style={{position: 'absolute', top, left: 0, width: 1080, display: 'flex', justifyContent: 'center', zIndex: 50,
      transform: `translateY(${(1 - p) * -40}px) scale(${0.8 + 0.2 * p})`, opacity: p}}>
      <div style={{position: 'relative', padding: '8px 18px', borderRadius: 18, background: '#ffffff', overflow: 'hidden',
        boxShadow: '0 0 28px rgba(255,255,255,0.35), 0 10px 30px rgba(0,0,0,0.45)'}}>
        <Img src={staticFile('logo/logo-row.png')} style={{display: 'block', height: h, width: w}} />
        {shine >= 0 && shine <= 1 && (
          <div style={{position: 'absolute', top: 0, bottom: 0, width: 60, left: -80 + shine * (w + 160),
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)', transform: 'skewX(-20deg)'}} />
        )}
      </div>
    </div>
  );
};
