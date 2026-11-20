// ТҰСАУКЕСЕР — Premium Cinematic Motion
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
// Озвучканың нақты ұзақтығы: 25.234 сек → 757 кадр
export const VOICE_SEC = 25.234;
export const TOTAL_FRAMES = Math.round(VOICE_SEC * FPS); // 757 кадр = 25,233 сек

export const COLORS = {
  night: "#0A1424",
  gold: "#D9AE55",
  goldLight: "#F6DE9A",
  goldDeep: "#9C7425",
  cream: "#FBF4E6",
  ruby: "#7E1022", // қою қызыл
  white: "#FFFFFF",
  yellow: "#FFD45A",
  whatsapp: "#25D366",
};

export const GOLD_GRADIENT =
  "linear-gradient(180deg, #FFF1C4 0%, #F2CF7A 35%, #D9AE55 60%, #A87B2A 100%)";

export const FONT = {
  sans: "Montserrat",
  serif: "PT Serif",
};

// Instagram Reels SAFE ZONE (1080×1920) — барлық мәтін, баға, батырма осының ішінде:
//  жоғары 250px (профиль/жазу), төмен 420px (caption, музыка), сол жақ 60px,
//  оң жақ 150px (лайк/коммент/бөлісу батырмалары, y > 1050 аймағында)
export const SAFE = { top: 250, bottomY: 1500, left: 60, right: 150, rightFromY: 1050 };
export const SAFE_CX = (SAFE.left + (1080 - SAFE.right)) / 2; // 495 — төменгі бөліктің ортасы
export const SAFE_W = 1080 - SAFE.right - SAFE.left; // 870

export const s2f = (s: number) => Math.round(s * FPS);
