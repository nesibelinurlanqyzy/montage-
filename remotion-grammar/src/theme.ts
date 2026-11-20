import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/* Шрифты лежат локально (public/fonts). Manrope — английский текст,
   Noto Sans — казахский (в Manrope нет Ә, Ғ, Қ, Ң, Ұ). */
for (const w of ['500', '700', '800']) {
  loadFont({family: 'Manrope', url: staticFile('fonts/Manrope.ttf'), weight: w, format: 'truetype'});
  loadFont({family: 'Noto Sans', url: staticFile('fonts/NotoSans.ttf'), weight: w, format: 'truetype'});
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
