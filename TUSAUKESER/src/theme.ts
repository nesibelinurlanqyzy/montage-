// ТҰСАУКЕСЕР — Premium Cinematic Motion
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
// Озвучканың нақты ұзақтығы: 25.234 сек → 757 кадр
export const VOICE_SEC = 25.234;
export const TOTAL_FRAMES = Math.ceil(VOICE_SEC * FPS); // 757

export const COLORS = {
  night: "#0A1424",
  gold: "#D9AE55",
  goldLight: "#F6DE9A",
  goldDeep: "#9C7425",
  cream: "#FBF4E6",
  ruby: "#A3182F",
  whatsapp: "#25D366",
};

export const GOLD_GRADIENT =
  "linear-gradient(180deg, #FFF1C4 0%, #F2CF7A 35%, #D9AE55 60%, #A87B2A 100%)";

export const FONT = {
  sans: "Montserrat",
  serif: "PT Serif",
};

// Instagram қауіпсіз аймағы
export const SAFE = { top: 220, bottom: 380, side: 70 };

export const s2f = (s: number) => Math.round(s * FPS);
