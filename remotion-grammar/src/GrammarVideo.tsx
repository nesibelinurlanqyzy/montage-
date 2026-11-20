import React from 'react';
import {AbsoluteFill, Audio, Sequence, getStaticFiles, staticFile} from 'remotion';
import {Background} from './components/Background';
import {HookScene} from './scenes/HookScene';
import {PastSimpleScene} from './scenes/PastSimpleScene';
import {PresentPerfectScene} from './scenes/PresentPerfectScene';
import {MainRuleScene} from './scenes/MainRuleScene';
import {QuizScene} from './scenes/QuizScene';
import {FPS, OVERLAP, SCENES, TOTAL, VOICE_CLIPS, VOICE_FILE, VOICE_VOLUME} from './timing';
import {FONT} from './theme';
import {Subtitles} from './components/Subtitles';
import {LogoBadge} from './components/Logo';

/** Сцены сдвинуты вниз, чтобы над заголовками поместился логотип (безопасная зона сверху). */
const SHIFT = 90;

const scene = (key: keyof typeof SCENES, El: React.FC, first = false) => {
  const s = SCENES[key];
  const from = first ? 0 : s.from - OVERLAP;
  const dur = Math.min(TOTAL - from, s.dur + (first ? 0 : OVERLAP) + OVERLAP);
  return (
    <Sequence key={key} from={from} durationInFrames={dur} name={key}>
      <El />
    </Sequence>
  );
};

export const GrammarVideo: React.FC = () => {
  const hasVoice = getStaticFiles().some((f) => f.name === VOICE_FILE);
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Background />
      <AbsoluteFill style={{transform: `translateY(${SHIFT}px)`}}>
      {scene('hook', HookScene, true)}
      {scene('past', PastSimpleScene)}
      {scene('present', PresentPerfectScene)}
      {scene('rule', MainRuleScene)}
      {scene('quiz', QuizScene)}
      </AbsoluteFill>
      <LogoBadge top={246} h={74} />
      <Subtitles />
      {hasVoice && VOICE_CLIPS.map((c, i) => {
        const pre = Math.min(0.12, c.from), post = 0.3;
        const from = Math.round((c.from - pre) * FPS), to = Math.round((c.to + post) * FPS);
        return (
          <Sequence key={i} from={Math.round((c.at - pre) * FPS)} durationInFrames={to - from} name={`voice ${i + 1}`}>
            <Audio src={staticFile(VOICE_FILE)} startFrom={from} endAt={to} volume={VOICE_VOLUME} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
