import {interpolate, spring, Easing} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const sp = (f: number, fps: number, delay = 0, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
  spring({frame: f - delay, fps, config: {damping: 14, stiffness: 120, mass: 0.9, ...cfg}});

export const lin = (f: number, a: number, b: number, from = 0, to = 1, ease?: (t: number) => number) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: ease});

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const hexA = (color: string, a: number) => {
  if (color.startsWith('#')) {
    const n = parseInt(color.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  const m = color.match(/[\d.]+/g) || ['0', '0', '0'];
  return `rgba(${m[0]},${m[1]},${m[2]},${a})`;
};

/** Выход сцены: 0 → 1 в последние кадры. */
export const exitProgress = (f: number, dur: number, overlap: number) => lin(f, dur - 2, dur + overlap, 0, 1, easeIn);
