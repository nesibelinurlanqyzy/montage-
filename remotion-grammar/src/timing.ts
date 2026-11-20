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
  hook: {cards: 0, vs: s(1.1), icons: s(0.6), camera: s(2.2), question: s(2.4)},
  past: {title: 0, line: s(0.3), marker: s(0.9), rule: s(0.6), ruleOut: s(5.2), bigben: s(1.8), calendar: s(2.3), example: s(5.6), check: s(7.5), finished: s(7.7), wiggle: s(8.7)},
  present: {title: 0, morph: 0, now: s(1.0), dot1: s(2.0), dot2: s(2.5), rule: s(0.6), ruleOut: s(5.2), example: s(5.5), bounce: s(6.6), link: s(6.8), life: s(8.0), toNow: s(8.4)},
  rule: {header: 0, left: s(0.2), right: s(2.6), vs: s(3.4), when: s(2.3), exp: s(4.2), both: s(6.0)},
  quiz: {title: 0, up: s(1.2), question: s(1.3), cardA: s(3.1), cardB: s(3.7), c3: s(4.0), c2: s(4.8), c1: s(5.6), wrong: s(6.4), right: s(6.64), final: s(7.6), chip: s(7.9), note: s(8.4)},
};

/**
 * Озвучка (public/voiceover.mp3, 36.4 с) нарезана по фразам и поставлена в нужные сцены
 * без ускорения: at — секунда видео, from/to — секунды в исходном файле (Whisper).
 */
export const VOICE_CLIPS = [
  {at: 2.4, from: 0.0, to: 2.64}, // Do you know the difference…
  {at: 5.6, from: 4.26, to: 7.58}, // Use past simple…
  {at: 9.2, from: 8.2, to: 11.3}, // For example, I visited London last year.
  {at: 15.6, from: 12.56, to: 17.2}, // Use present perfect…
  {at: 20.6, from: 18.26, to: 19.7}, // I've visited London twice.
  {at: 28.0, from: 21.72, to: 23.34}, // Past simple, when?
  {at: 30.0, from: 24.96, to: 27.78}, // Present perfect, experience or result.
  {at: 36.3, from: 28.78, to: 31.6}, // Which is correct, A or B?
  {at: 41.4, from: 32.86, to: 36.02}, // It's B. Yesterday needs past simple.
];

/** Файл озвучки в public/ (если положить — подхватится автоматически). */
export const VOICE_FILE = 'voiceover.mp3';
export const VOICE_VOLUME = 1;
export const SFX_VOLUME = 0.35;
