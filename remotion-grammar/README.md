# Present Perfect or Past Simple? — Remotion жобасы

45 сек, 1080×1920, 30 fps. Көріністер: `src/scenes/` (HookScene, PastSimpleScene, PresentPerfectScene, MainRuleScene, QuizScene).
Барлық уақыт белгілері — `src/timing.ts`. Шрифттер жергілікті: Manrope (ағылшынша), Noto Sans (қазақша — Ә Ғ Қ Ң Ұ бар).

- Озвучка: `public/voiceover.mp3` салынса, автоматты қосылады.
- SFX: `python3 scripts/make_sfx.py` → `public/sfx/`.
- Кадр тексеру: `scripts/stills.sh 60 290 640`.
- Рендер: `npm i && npx remotion render src/index.ts GrammarVideo out/present-perfect-vs-past-simple.mp4 --codec h264 --crf 18`
- Обложка: `npx remotion still src/index.ts Cover out/cover.jpg`
