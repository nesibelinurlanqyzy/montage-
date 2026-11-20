/**
 * Все тайминги видео. Сцены — в кадрах (30 fps), реплики — в секундах от начала сцены.
 * Когда приходит озвучка, достаточно поправить числа здесь.
 */
export const FPS = 30;
export const TOTAL = 1350; // 45 сек
export const OVERLAP = 14; // кадры перекрытия сцен (без чёрного экрана)

export const SCENES = {
  hook: {from: 0, dur: 150},
  past: {from: 150, dur: 300},
  present: {from: 450, dur: 360},
  rule: {from: 810, dur: 240},
  quiz: {from: 1050, dur: 300},
} as const;

const s = (sec: number) => Math.round(sec * FPS);

export const CUE = {
  hook: {cards: 0, vs: s(1.1), icons: s(0.6), camera: s(2.8), question: s(2.9)},
  past: {title: 0, line: s(0.3), marker: s(0.9), rule: s(0.6), ruleOut: s(2.8), bigben: s(1.8), calendar: s(2.3), example: s(3.0), check: s(5.3), finished: s(5.5), wiggle: s(8.0)},
  present: {title: 0, morph: 0, now: s(1.0), dot1: s(2.0), dot2: s(2.5), rule: s(0.7), ruleOut: s(4.7), example: s(5.0), bounce: s(5.6), link: s(5.8), life: s(8.0), toNow: s(8.4)},
  rule: {header: 0, left: s(0.2), right: s(2.0), vs: s(3.0), when: s(4.0), exp: s(5.4), both: s(7.0)},
  quiz: {title: 0, up: s(1.3), question: s(1.4), cardA: s(2.0), cardB: s(2.25), c3: s(2.7), c2: s(3.7), c1: s(4.7), wrong: s(5.4), right: s(5.65), final: s(7.1), chip: s(7.6), note: s(8.1)},
};

/** Файл озвучки в public/ (если положить — подхватится автоматически). */
export const VOICE_FILE = 'voiceover.mp3';
export const VOICE_VOLUME = 1;
export const SFX_VOLUME = 0.35;
