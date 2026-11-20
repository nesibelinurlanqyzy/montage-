import {continueRender, delayRender, staticFile} from 'remotion';

/* Шрифты лежат локально (public/fonts). Manrope — английский текст,
   Noto Sans — казахский (в Manrope нет Ә, Ғ, Қ, Ң, Ұ). */
const load = (family: string, file: string) => {
  if (typeof window === 'undefined' || typeof FontFace === 'undefined') return;
  const h = delayRender(`font ${family}`, {timeoutInMilliseconds: 120000});
  const ff = new FontFace(family, `url('${staticFile(file)}') format('truetype')`, {weight: '100 900'});
  ff.load().then((x) => { document.fonts.add(x); continueRender(h); }).catch((e) => { console.error(e); continueRender(h); });
};
load('Manrope', 'fonts/Manrope.ttf');
load('Noto Sans', 'fonts/NotoSans.ttf');

export const FONT = '"Manrope", "Noto Sans", sans-serif';
export const FONT_KZ = '"Noto Sans", sans-serif';

export const C = {
  bg: '#080E24',
  blue: '#38BDF8',
  purple: '#A855F7',
  yellow: '#FACC15',
  white: '#FFFFFF',
  green: '#22C55E',
  red: '#EF4444',
};

/** Безопасная зона Reels: сверху ~250px, снизу ~420px, справа ~130px (кнопки). */
export const SAFE = {top: 250, bottom: 1500, left: 70, right: 1010};
