// Субтитры из озвучки (Whisper), время — секунды видео. c — цвет ключевого слова, b — двойной bounce.
export type SubWord = {w: string; s: number; e: number; c: string | null; b: boolean};
export const SUBS: {start: number; end: number; words: SubWord[]}[] = [{"start": 2.25, "end": 3.15, "words": [{"w": "Do", "s": 2.4, "e": 2.6, "c": null, "b": false}, {"w": "you", "s": 2.6, "e": 2.74, "c": null, "b": false}, {"w": "know", "s": 2.74, "e": 2.86, "c": null, "b": false}, {"w": "the", "s": 2.86, "e": 3.02, "c": null, "b": false}, {"w": "difference", "s": 3.02, "e": 3.3, "c": "#FACC15", "b": false}]}, {"start": 3.15, "end": 5.64, "words": [{"w": "between", "s": 3.3, "e": 3.8, "c": null, "b": false}, {"w": "these", "s": 3.8, "e": 4.38, "c": null, "b": false}, {"w": "two", "s": 4.38, "e": 4.68, "c": null, "b": false}, {"w": "tenses?", "s": 4.68, "e": 5.04, "c": null, "b": false}]}, {"start": 5.45, "end": 6.51, "words": [{"w": "Use", "s": 5.6, "e": 5.8, "c": null, "b": false}, {"w": "Past", "s": 5.8, "e": 6.12, "c": "#38BDF8", "b": false}, {"w": "Simple", "s": 6.12, "e": 6.66, "c": "#38BDF8", "b": false}]}, {"start": 6.51, "end": 8.03, "words": [{"w": "for", "s": 6.66, "e": 7.24, "c": null, "b": false}, {"w": "finished", "s": 7.24, "e": 7.68, "c": "#38BDF8", "b": false}, {"w": "actions", "s": 7.68, "e": 8.18, "c": "#38BDF8", "b": false}]}, {"start": 8.03, "end": 9.52, "words": [{"w": "in", "s": 8.18, "e": 8.38, "c": null, "b": false}, {"w": "the", "s": 8.38, "e": 8.48, "c": null, "b": false}, {"w": "past.", "s": 8.48, "e": 8.92, "c": null, "b": false}]}, {"start": 9.05, "end": 10.53, "words": [{"w": "For", "s": 9.2, "e": 9.32, "c": null, "b": false}, {"w": "example,", "s": 9.32, "e": 9.7, "c": null, "b": false}]}, {"start": 10.53, "end": 12.9, "words": [{"w": "I", "s": 10.68, "e": 10.76, "c": null, "b": false}, {"w": "visited", "s": 10.76, "e": 11.12, "c": null, "b": false}, {"w": "London", "s": 11.12, "e": 11.46, "c": null, "b": false}, {"w": "last", "s": 11.46, "e": 11.9, "c": "#FACC15", "b": false}, {"w": "year.", "s": 11.9, "e": 12.3, "c": "#FACC15", "b": false}]}, {"start": 14.95, "end": 16.13, "words": [{"w": "Use", "s": 15.1, "e": 15.48, "c": null, "b": false}, {"w": "Present", "s": 15.48, "e": 15.88, "c": "#A855F7", "b": false}, {"w": "Perfect", "s": 15.88, "e": 16.28, "c": "#A855F7", "b": false}]}, {"start": 16.13, "end": 17.67, "words": [{"w": "for", "s": 16.28, "e": 16.84, "c": null, "b": false}, {"w": "life", "s": 16.84, "e": 17.14, "c": "#A855F7", "b": false}, {"w": "experiences", "s": 17.14, "e": 17.82, "c": "#A855F7", "b": false}]}, {"start": 17.67, "end": 20.34, "words": [{"w": "or", "s": 17.82, "e": 18.32, "c": null, "b": false}, {"w": "actions", "s": 18.32, "e": 18.82, "c": null, "b": false}, {"w": "connected", "s": 18.82, "e": 19.14, "c": "#A855F7", "b": false}, {"w": "to", "s": 19.14, "e": 19.48, "c": "#A855F7", "b": false}, {"w": "now.", "s": 19.48, "e": 19.74, "c": "#A855F7", "b": false}]}, {"start": 19.75, "end": 21.94, "words": [{"w": "I’ve", "s": 19.9, "e": 20.16, "c": null, "b": false}, {"w": "visited", "s": 20.16, "e": 20.58, "c": null, "b": false}, {"w": "London", "s": 20.58, "e": 20.94, "c": null, "b": false}, {"w": "twice.", "s": 20.94, "e": 21.34, "c": "#FACC15", "b": true}]}, {"start": 26.35, "end": 27.71, "words": [{"w": "Past", "s": 26.5, "e": 26.66, "c": "#38BDF8", "b": false}, {"w": "Simple,", "s": 26.66, "e": 27.18, "c": "#38BDF8", "b": false}]}, {"start": 27.71, "end": 28.72, "words": [{"w": "when?", "s": 27.86, "e": 28.12, "c": "#38BDF8", "b": false}]}, {"start": 28.65, "end": 29.89, "words": [{"w": "Present", "s": 28.8, "e": 29.0, "c": "#A855F7", "b": false}, {"w": "Perfect,", "s": 29.0, "e": 29.52, "c": "#A855F7", "b": false}]}, {"start": 29.89, "end": 32.22, "words": [{"w": "experience", "s": 30.04, "e": 30.48, "c": "#A855F7", "b": false}, {"w": "or", "s": 30.48, "e": 31.2, "c": null, "b": false}, {"w": "result.", "s": 31.2, "e": 31.62, "c": "#A855F7", "b": false}]}, {"start": 36.45, "end": 38.35, "words": [{"w": "Which", "s": 36.6, "e": 37.08, "c": null, "b": false}, {"w": "is", "s": 37.08, "e": 37.28, "c": null, "b": false}, {"w": "correct,", "s": 37.28, "e": 37.7, "c": "#FACC15", "b": false}]}, {"start": 38.35, "end": 40.02, "words": [{"w": "A", "s": 38.5, "e": 38.52, "c": "#F87171", "b": false}, {"w": "or", "s": 38.52, "e": 39.1, "c": null, "b": false}, {"w": "B?", "s": 39.1, "e": 39.42, "c": "#4ADE80", "b": false}]}, {"start": 41.45, "end": 42.71, "words": [{"w": "It’s", "s": 41.6, "e": 41.84, "c": null, "b": false}, {"w": "B.", "s": 41.84, "e": 42.2, "c": "#4ADE80", "b": false}]}, {"start": 42.71, "end": 45.36, "words": [{"w": "Yesterday", "s": 42.86, "e": 43.4, "c": "#FACC15", "b": false}, {"w": "needs", "s": 43.4, "e": 43.94, "c": null, "b": false}, {"w": "Past", "s": 43.94, "e": 44.32, "c": "#38BDF8", "b": false}, {"w": "Simple.", "s": 44.32, "e": 44.76, "c": "#38BDF8", "b": false}]}];
export const KZ: {start: number; end: number; kz: string}[] = [
 {
  "start": 2.7,
  "end": 5.64,
  "kz": "Осы екі шақтың айырмашылығын білесің бе?"
 },
 {
  "start": 5.9,
  "end": 9.52,
  "kz": "Past Simple — өткен шақта аяқталған әрекеттер үшін."
 },
 {
  "start": 9.5,
  "end": 12.9,
  "kz": "Мысалы: Мен өткен жылы Лондонға бардым."
 },
 {
  "start": 15.4,
  "end": 20.34,
  "kz": "Present Perfect — өмірлік тәжірибе немесе қазірмен байланысты әрекет."
 },
 {
  "start": 20.2,
  "end": 21.94,
  "kz": "Мен Лондонда екі рет болғанмын."
 },
 {
  "start": 26.8,
  "end": 28.72,
  "kz": "Past Simple — ҚАШАН?"
 },
 {
  "start": 29.1,
  "end": 32.22,
  "kz": "Present Perfect — ТӘЖІРИБЕ немесе НӘТИЖЕ."
 },
 {
  "start": 36.9,
  "end": 40.02,
  "kz": "Қайсысы дұрыс: A ма, B ма?"
 },
 {
  "start": 41.9,
  "end": 45.36,
  "kz": "Дұрыс жауап — B. Кеше — нақты өткен уақыт."
 }
];
