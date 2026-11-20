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

// Reels РАМКАСЫ (safe zone) — пайдаланушының үлгісі бойынша, ../reels-safe-zone/README.md
//  жоғары y=217, сол x=73, оң x=1000 (y<1071), оң x=913 (y≥1071, Instagram батырмалары), төмен y=1485
export const SAFE = { top: 217, bottomY: 1485, left: 73, right: 80, rightLow: 167, notchY: 1071 };
export const SAFE_W = 1080 - SAFE.rightLow - SAFE.left; // 840 — төменгі бөліктегі ені

export const s2f = (s: number) => Math.round(s * FPS);
