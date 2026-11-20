import {continueRender, delayRender} from 'remotion';
import {MANROPE_B64, NOTO_B64} from './fonts-data';

/* Шрифты встроены (base64), без сетевых загрузок. Manrope — английский текст,
   Noto Sans — казахский (в Manrope нет Ә, Ғ, Қ, Ң, Ұ). */
if (typeof document !== 'undefined' && !document.getElementById('grammar-fonts')) {
  const st = document.createElement('style');
  st.id = 'grammar-fonts';
  st.textContent = `
@font-face{font-family:'Manrope';src:url(data:font/woff2;base64,${MANROPE_B64}) format('woff2');font-weight:200 800;}
@font-face{font-family:'Noto Sans';src:url(data:font/woff2;base64,${NOTO_B64}) format('woff2');font-weight:100 900;}`;
  document.head.appendChild(st);
  const h = delayRender('fonts', {timeoutInMilliseconds: 60000});
  let done = false;
  const finish = () => { if (!done) { done = true; continueRender(h); } };
  setTimeout(finish, 4000); // страховка: не зависать
  Promise.all(['500', '700', '800'].flatMap((w) => [document.fonts.load(`${w} 40px Manrope`), document.fonts.load(`${w} 40px "Noto Sans"`, 'ӘҒҚ')]))
    .catch(() => undefined)
    .then(finish);
}

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
