/**
 * Все тайминги видео. Сцены — в кадрах (30 fps), реплики — в секундах от начала сцены.
 * Когда приходит озвучка, достаточно поправить числа здесь.
 */
export const FPS = 30;
export const TOTAL = 1350; // 45 сек
export const OVERLAP = 14; // кадры перекрытия сцен (без чёрного экрана)

export const SCENES = {
  hook: {from: 0, dur: 150},
  past: {from: 150, dur: 285},
  present: {from: 435, dur: 330},
  rule: {from: 765, dur: 300},
  quiz: {from: 1065, dur: 285},
} as const;

const s = (sec: number) => Math.round(sec * FPS);

export const CUE = {
  hook: {cards: 0, vs: s(1.1), icons: s(0.6), camera: s(2.2), question: s(2.4)},
  past: {title: 0, line: s(0.3), marker: s(0.9), rule: s(0.6), ruleOut: s(5.2), bigben: s(1.8), calendar: s(2.3), example: s(5.6), check: s(7.3), finished: s(7.5), wiggle: s(8.3)},
  present: {title: 0, morph: 0, now: s(1.0), dot1: s(2.0), dot2: s(2.5), rule: s(0.6), ruleOut: s(5.1), example: s(5.4), bounce: s(6.45), link: s(6.6), life: s(7.6), toNow: s(8.0)},
  rule: {header: 0, left: s(0.2), right: s(2.9), vs: s(3.6), when: s(2.3), exp: s(4.5), both: s(6.4), markers: s(6.95)},
  quiz: {title: 0, up: s(1.0), question: s(1.1), cardA: s(2.9), cardB: s(3.5), c3: s(4.0), c2: s(4.7), c1: s(5.4), wrong: s(6.1), right: s(6.34), final: s(7.3), chip: s(7.6), note: s(8.1)},
};

/**
 * Озвучка (public/voiceover.mp3, 36.4 с) нарезана по фразам и поставлена в нужные сцены
 * без ускорения: at — секунда видео, from/to — секунды в исходном файле (Whisper).
 */
export const VOICE_CLIPS = [
  {at: 2.4, from: 0.0, to: 2.64},
  {at: 5.6, from: 4.26, to: 7.58},
  {at: 9.2, from: 8.2, to: 11.3},
  {at: 15.1, from: 12.56, to: 17.2},
  {at: 19.9, from: 18.26, to: 19.7},
  {at: 26.5, from: 21.72, to: 23.34},
  {at: 28.8, from: 24.96, to: 27.78},
  {at: 36.6, from: 28.78, to: 31.6},
  {at: 41.6, from: 32.86, to: 36.02},
];

/** Файл озвучки в public/ (если положить — подхватится автоматически). */
export const VOICE_FILE = 'voiceover.mp3';
export const VOICE_VOLUME = 1;
export const SFX_VOLUME = 0.35;
