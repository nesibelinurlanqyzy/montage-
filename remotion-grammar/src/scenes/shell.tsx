import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {exitProgress} from '../anim';
import {OVERLAP} from '../timing';
import {SceneOffset} from '../components/Common';

/** Локальный кадр сцены: 0 = номинальное начало (вход начинается на -OVERLAP). */
export const useLocal = (first = false) => useCurrentFrame() - (first ? 0 : OVERLAP);

/** Оболочка сцены: мягкий выход (масштаб + blur + fade) поверх следующей сцены. */
export const Shell: React.FC<{f: number; dur: number; last?: boolean; first?: boolean; children: React.ReactNode}> = ({f, dur, last, first, children}) => {
  const e = last ? 0 : exitProgress(f, dur, OVERLAP);
  return (
    <SceneOffset.Provider value={first ? 0 : OVERLAP}>
    <AbsoluteFill style={{opacity: 1 - e, transform: `scale(${1 + e * 0.08}) translateY(${-e * 40}px)`, filter: e > 0.01 ? `blur(${e * 14}px)` : undefined}}>
      {children}
    </AbsoluteFill>
    </SceneOffset.Provider>
  );
};
