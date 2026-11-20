import { s2f } from "./theme";

// Бренд деректері
export const BRAND = {
  instagram: "@tusau_keser_petropavlovsk",
  whatsapp: "", // нақты нөмір берілгенде ғана көрсетіледі
  city: "ПЕТРОПАВЛ",
};

export const PHOTO = {
  girlRed: "photos/0445b862-ce75-4176-bfd3-4f5479bfdb18.jpeg", // қыз, қызыл камзол
  girlOneYear: "photos/070fef76-b7a7-4ab5-bc4b-fd24f012c08c.jpeg", // қыз, «1» шарлар (көлденең)
  boyPathClose: "photos/0f6d1fd0-f22a-4a3e-ad81-04924605bdff.jpeg", // ұл, тұсау жолы
  momGirl: "photos/152bdba1-6c0e-41d4-a3bf-5c7f72a5db34.jpeg", // ана + қыз
  boyPathWide: "photos/38b1d80b-6856-4116-8130-816b58f24086.jpeg", // ұл, ақ жол, тұсаукесер
  momBoyLift: "photos/4d78e892-2f47-49b1-9eba-1d0bf8aae85a.jpeg", // ана ұлын көтереді
  boyWhite: "photos/a26d59cd-3ce1-4e23-a4c0-79f738245744.jpeg", // ұл, ақ кестелі костюм
  momBoyGreen: "photos/b0aa199b-7a29-481b-a085-354691997f22.jpeg", // ана + ұл (көлденең)
  boySuit: "photos/bc898652-9e4c-46d3-a31c-3ffc2552345d.jpeg", // ұл, сұр костюм, 1 жас
  babyGold: "photos/cc60492b-bec3-41a5-9d4b-1e162eed05d3.jpeg", // күлген сәби, алтын шапан
  boyChapan: "photos/eadc8f74-4af2-47e1-9e0c-058f94039d68.jpeg", // ұл, қоңыр шапан
  girlPurple: "photos/fd535862-8f3f-46cc-9d10-3b705723ee43.jpeg", // қыз, күлгін көйлек, 1 жас
};

export type Enter = "dip" | "punch" | "whip" | "fade" | "wipe" | "none";

export type Scene =
  | { kind: "clip"; from: number; to: number; src: string; startSec?: number; enter: Enter; zoom?: [number, number] }
  | { kind: "photo"; from: number; to: number; src: string; enter: Enter; dir?: 1 | -1; focusY?: number }
  | { kind: "split"; from: number; to: number; top: string; bottom: string; bottomX: number; enter: Enter }
  | { kind: "price"; from: number; to: number; a: string; b: string; swapAt: number; enter: Enter }
  | { kind: "end"; from: number; to: number; clip: string; enter: Enter };

// Уақыт (секунд) — озвучка сөйлемдеріне дәл сәйкес
export const SCENES: Scene[] = [
  // 1-сөйлем 0.00–3.54 · ХУК
  { kind: "clip", from: 0, to: 1.68, src: "clips/walk1.mp4", enter: "dip", zoom: [1.0, 1.07] },
  { kind: "photo", from: 1.68, to: 3.54, src: PHOTO.boyPathWide, enter: "punch", dir: 1, focusY: 50 },
  // 2-сөйлем 3.92–10.25
  { kind: "photo", from: 3.54, to: 4.8, src: PHOTO.boyChapan, enter: "fade", dir: -1, focusY: 45 },
  { kind: "split", from: 4.8, to: 6.24, top: PHOTO.boyWhite, bottom: PHOTO.girlOneYear, bottomX: 26, enter: "wipe" },
  { kind: "clip", from: 6.24, to: 7.82, src: "clips/green.mp4", enter: "fade", zoom: [1.0, 1.06] },
  { kind: "price", from: 7.82, to: 10.25, a: PHOTO.girlRed, b: PHOTO.boyChapan, swapAt: 9.02, enter: "dip" },
  // 3-сөйлем 10.67–16.55
  { kind: "photo", from: 10.25, to: 11.94, src: PHOTO.boyPathClose, enter: "fade", dir: 1, focusY: 60 }, // толық комплект — киім басынан аяғына дейін
  { kind: "clip", from: 11.94, to: 13.46, src: "clips/items.mp4", enter: "whip", zoom: [1.0, 1.08] }, // ақ жол + домбыра + тұсау заттары
  { kind: "photo", from: 13.46, to: 15.0, src: PHOTO.momGirl, enter: "whip", dir: 1, focusY: 40 },
  { kind: "photo", from: 15.0, to: 16.55, src: PHOTO.momBoyLift, enter: "fade", dir: -1, focusY: 35 },
  // 4-сөйлем 16.98–20.83
  { kind: "photo", from: 16.55, to: 18.0, src: PHOTO.girlPurple, enter: "dip", dir: 1, focusY: 45 },
  { kind: "photo", from: 18.0, to: 19.5, src: PHOTO.boySuit, enter: "whip", dir: -1, focusY: 45 },
  { kind: "photo", from: 19.5, to: 20.83, src: PHOTO.babyGold, enter: "fade", dir: 1, focusY: 45 },
  // 5-сөйлем 21.19–25.06 · CTA
  { kind: "clip", from: 20.83, to: 22.4, src: "clips/hat.mp4", startSec: 1.9, enter: "fade", zoom: [1.04, 1.0] },
  { kind: "end", from: 22.4, to: 25.234, clip: "clips/full.mp4", enter: "none" },
];

// Таза, кішкентай белгілер (жоғарғы бөлік, бет пен киімге тимейді)
export const LABELS: { from: number; to: number; text: string }[] = [
  { from: 3.92, to: 4.8, text: "ПЕТРОПАВЛ" },
  { from: 11.94, to: 13.46, text: "ТҰСАУКЕСЕР ЖИЫНТЫҒЫ" },
  { from: 13.46, to: 15.0, text: "БҮКІЛ ОТБАСЫҒА" },
  { from: 16.75, to: 19.5, text: "1 ЖАСҚА · МЕРЕКЕГЕ" },
];

// Субтитр: сөз + уақыт (озвучкадан). «*» — маңызды сөз (үлкен, алтын)
type W = [string, number, number];
const w = (t: string, a: number, b: number): W => [t, a, b];
export type Chunk = { words: W[]; hide?: boolean };
export const SUB_CHUNKS: Chunk[] = [
  // 0–2.32 — хук типографикасы көрсетеді
  { words: [w("Тұсаукесерге", 0.0, 0.84), w("бір", 0.84, 1.08), w("күн", 1.08, 1.38), w("үшін", 1.38, 1.68), w("қымбат", 1.68, 2.08), w("киім", 2.08, 2.32)], hide: true },
  { words: [w("сатып", 2.32, 2.62), w("алғыңыз", 2.62, 3.0)] },
  { words: [w("келмей", 3.0, 3.22), w("ме?", 3.22, 3.54)] },
  { words: [w("*Петропавлда", 3.92, 4.8)] },
  { words: [w("*ұл", 4.8, 5.05), w("мен", 5.05, 5.32), w("*қыздарға", 5.32, 5.78)] },
  { words: [w("арналған", 5.78, 6.24), w("*сәнді", 6.24, 6.74)] },
  { words: [w("ұлттық", 6.74, 7.18), w("киімдерді", 7.18, 7.82)] },
  { words: [w("7 000 ₸-ден", 7.82, 9.02), w("бастап", 9.02, 9.36)], hide: true }, // баға блогы көрсетеді
  { words: [w("*жалға", 9.36, 9.75), w("алыңыз", 9.75, 10.25)] },
  { words: [w("*Толық", 10.58, 11.04), w("*комплекттер,", 11.04, 11.94)] },
  { words: [w("*тұсаукесер", 11.94, 12.6), w("жиынтығы", 12.6, 13.1)] },
  { words: [w("және", 13.1, 13.46), w("бүкіл", 13.46, 13.94), w("*отбасыға", 13.94, 14.56)] },
  { words: [w("үйлесімді", 14.56, 15.22), w("ұлттық", 15.22, 15.74)] },
  { words: [w("*образдар", 15.74, 16.3), w("бар.", 16.3, 16.6)] },
  { words: [w("Балаңыздың", 16.75, 17.54), w("*ерекше", 17.54, 18.0)] },
  { words: [w("күнінде", 18.0, 18.42), w("*әдемі", 18.42, 18.98)] },
  { words: [w("образды", 18.98, 19.5), w("алдын", 19.5, 19.78), w("ала", 19.78, 20.04)] },
  { words: [w("*брондаңыз", 20.04, 20.95)] },
  { words: [w("Бағалар", 21.19, 21.62), w("мен", 21.62, 21.8)] },
  { words: [w("*бос", 21.8, 22.06), w("*күндерді", 22.06, 22.54)] },
  // 22.40-тан бастап — соңғы кадрдағы батырма сөздері дауыспен бірге жанады
  { words: [w("білу", 22.54, 22.74), w("үшін", 22.74, 23.06), w("дәл", 23.06, 23.48), w("қазір", 23.48, 23.9), w("WhatsApp-қа", 23.9, 24.52), w("жазыңыз", 24.52, 25.234)], hide: true },
];

export const sceneFrames = (s: { from: number; to: number }) => ({
  from: s2f(s.from),
  dur: Math.max(1, s2f(s.to) - s2f(s.from)),
});
