import React from 'react';
import {AbsoluteFill, interpolateColors, random, useCurrentFrame} from 'remotion';
import {C, hexA as _h} from '../theme-helpers';

/** Непрерывный фон всего видео: градиент, свечения, 3D-сетка, частицы (параллакс). */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  // 0 = синий (Past), 1 = фиолетовый (Present)
  const tint = interpolateColors(
    f,
    [0, 140, 200, 440, 500, 800, 860, 1040, 1100, 1350],
    [C.purple, C.purple, C.blue, C.blue, C.purple, C.purple, '#6D7CF7', '#6D7CF7', '#7C6CF5', '#7C6CF5']
  );
  const tint2 = interpolateColors(f, [0, 440, 500, 1350], [C.blue, C.blue, C.purple, C.purple]);

  const particles = new Array(70).fill(0).map((_, i) => {
    const layer = i % 3; // 0 дальний, 2 ближний
    const speed = [0.25, 0.5, 0.9][layer];
    const size = [3, 5, 8][layer] * (0.6 + random(`s${i}`) * 0.8);
    const x0 = random(`x${i}`) * 1080;
    const y0 = random(`y${i}`) * 2100;
    const y = ((y0 - f * speed * 1.4) % 2100 + 2100) % 2100 - 90;
    const x = x0 + Math.sin(f / (40 + layer * 15) + i) * (10 + layer * 8);
    const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / 23 + i * 1.7));
    const col = i % 4 === 0 ? C.yellow : i % 2 ? tint : tint2;
    return (
      <div
        key={i}
        style={{
          position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
          background: col, opacity: tw * [0.35, 0.55, 0.8][layer],
          boxShadow: `0 0 ${size * 2}px ${col}`,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(120% 70% at 50% 0%, #142057 0%, ${C.bg} 60%)`}} />
      <div style={{position: 'absolute', width: 1100, height: 1100, left: -380 + Math.sin(f / 70) * 60, top: 120 + Math.cos(f / 90) * 50,
        background: `radial-gradient(circle, ${_h(tint, 0.35)} 0%, transparent 65%)`}} />
      <div style={{position: 'absolute', width: 1000, height: 1000, right: -420 + Math.cos(f / 80) * 60, top: 900 + Math.sin(f / 60) * 70,
        background: `radial-gradient(circle, ${_h(tint2, 0.3)} 0%, transparent 65%)`}} />
      {/* 3D-пол */}
      <div style={{position: 'absolute', left: -600, right: -600, top: 1180, height: 1400, perspective: 700, perspectiveOrigin: '50% 0%'}}>
        <div style={{
          position: 'absolute', inset: 0, transform: 'rotateX(68deg)', transformOrigin: '50% 0%',
          backgroundImage: `linear-gradient(${_h(tint, 0.35)} 2px, transparent 2px), linear-gradient(90deg, ${_h(tint, 0.35)} 2px, transparent 2px)`,
          backgroundSize: '120px 120px', backgroundPosition: `0px ${(f * 2.2) % 120}px`,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 60%, transparent 100%)',
          opacity: 0.55,
        }} />
      </div>
      {particles}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(2,4,14,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};
