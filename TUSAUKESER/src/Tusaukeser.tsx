import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, OffthreadVideo } from "remotion";
import { LABELS, SCENES, Scene, sceneFrames, PHOTO } from "./data";
import { COLORS, s2f } from "./theme";
import { fontsReady } from "./components/Fonts";
import { ClipLayer, PhotoLayer, PhotoCard } from "./components/Media";
import { EnterFx } from "./components/Enter";
import { EndCard, Frame, Grade, HookTitle, Label, PriceAccent, SplitTags, Watermark } from "./components/Overlays";
import { Subtitles } from "./components/Subtitles";

export type Props = { withAudio?: boolean; music?: boolean };

const SceneView: React.FC<{ s: Scene; dur: number }> = ({ s, dur }) => {
  switch (s.kind) {
    case "clip":
      return <ClipLayer src={s.src} startSec={s.startSec} zoom={s.zoom} dur={dur} />;
    case "photo":
      return <PhotoLayer src={s.src} dur={dur} dir={s.dir} focusY={s.focusY} />;
    case "split":
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 100% 46%, 0 54%)" }}>
            <PhotoLayer src={s.top} dur={dur} dir={1} focusY={30} />
          </div>
          <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 54.4%, 100% 46.4%, 100% 100%, 0 100%)" }}>
            <PhotoLayer src={s.bottom} dur={dur} dir={-1} focusY={30} />
          </div>
          <svg width="1080" height="1920" style={{ position: "absolute" }}>
            <line x1="0" y1={1920 * 0.542} x2="1080" y2={1920 * 0.462} stroke={COLORS.gold} strokeWidth="6" />
          </svg>
          <SplitTags />
        </AbsoluteFill>
      );
    case "price":
      return (
        <AbsoluteFill>
          <PhotoCard src={s.src} dur={dur} top={930} />
          <PriceAccent dur={dur} />
        </AbsoluteFill>
      );
    case "end":
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ filter: "blur(16px) brightness(0.6)", transform: "scale(1.15)" }}>
            <OffthreadVideo src={staticFile("clips/walk1.mp4")} startFrom={60} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
          <EndCard dur={dur} />
        </AbsoluteFill>
      );
  }
};

export const Tusaukeser: React.FC<Props> = ({ withAudio = true, music = false }) => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => { fontsReady.then(() => continueRender(handle)); }, [handle]);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.night }}>
      {SCENES.map((s, i) => {
        const { from, dur } = sceneFrames(s);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`${i + 1}. ${s.kind}`}>
            <EnterFx type={s.enter}><SceneView s={s} dur={dur} /></EnterFx>
          </Sequence>
        );
      })}
      <Grade />
      <Frame />
      <Sequence from={0} durationInFrames={75} name="Хук"><HookTitle /></Sequence>
      {LABELS.map((l, i) => {
        const from = s2f(l.from);
        const dur = s2f(l.to) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`Белгі: ${l.text}`}>
            <Label text={l.text} sub={l.sub} dur={dur} />
          </Sequence>
        );
      })}
      <Subtitles />
      <Watermark />
      {withAudio && <Audio src={staticFile("audio/voice.mp3")} />}
      {withAudio && music && <Audio src={staticFile("audio/music.mp3")} volume={0.1} />}
    </AbsoluteFill>
  );
};
export { PHOTO };
