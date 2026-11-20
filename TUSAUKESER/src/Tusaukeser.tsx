import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, interpolate, useCurrentFrame, Img } from "remotion";
import { LABELS, SCENES, Scene, sceneFrames } from "./data";
import { COLORS, s2f } from "./theme";
import { fontsReady } from "./components/Fonts";
import { ClipLayer, PhotoLayer, PhotoBox } from "./components/Media";
import { EnterFx } from "./components/Enter";
import { EndCard, Grade, HookTitle, Label, PriceAccent, SplitTags, Watermark } from "./components/Overlays";
import { Subtitles } from "./components/Subtitles";

export type Props = { withAudio?: boolean };

const END_AT = 22.4;

// Баға сахнасы: киім фотосы үлкен (экранның ~85%), жоғарғы бөлікте баға
const PriceScene: React.FC<{ a: string; b: string; swapF: number; dur: number }> = ({ a, b, swapF, dur }) => {
  const f = useCurrentFrame();
  const showB = f >= swapF;
  const src = showB ? b : a;
  const lf = showB ? f - swapF : f;
  const ld = showB ? dur - swapF : swapF;
  const sc = interpolate(lf, [0, ld], [1.0, 1.04]);
  const inB = showB ? interpolate(lf, [0, 7], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(34px) brightness(0.7)", transform: "scale(1.3)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{
        position: "absolute", left: 6, width: 1068, top: 318, height: 1602, overflow: "hidden",
        borderTopLeftRadius: 40, borderTopRightRadius: 40, opacity: inB, transform: `translateX(${(1 - inB) * 200}px)`,
      }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc})`, transformOrigin: "50% 40%" }} />
      </div>
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{ s: Scene; dur: number }> = ({ s, dur }) => {
  switch (s.kind) {
    case "clip":
      return <ClipLayer src={s.src} startSec={s.startSec} zoom={s.zoom} dur={dur} />;
    case "photo":
      return <PhotoLayer src={s.src} dur={dur} dir={s.dir} focusY={s.focusY} />;
    case "split":
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 958 }}>
            <PhotoBox src={s.top} dur={dur} y={34} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 962, width: 1080, height: 958 }}>
            <PhotoBox src={s.bottom} dur={dur} x={s.bottomX} y={45} zoom={[1.08, 1.02]} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 958, width: 1080, height: 4, background: COLORS.white }} />
          <SplitTags />
        </AbsoluteFill>
      );
    case "price": {
      const swapF = s2f(s.swapAt) - s2f(s.from);
      return (
        <AbsoluteFill>
          <PriceScene a={s.a} b={s.b} swapF={swapF} dur={dur} />
          <PriceAccent dur={dur} />
        </AbsoluteFill>
      );
    }
    case "end":
      return (
        <AbsoluteFill style={{ background: "#FFFDF8" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1060 }}>
            <PhotoBox src={s.src} dur={dur} x={46} y={62} zoom={[1.06, 1.1]} />
          </div>
          <EndCard dur={dur} startSec={s.from} />
        </AbsoluteFill>
      );
  }
};

export const Tusaukeser: React.FC<Props> = ({ withAudio = true }) => {
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
      <Grade until={END_AT} />
      <Sequence from={0} durationInFrames={s2f(3.54)} name="Хук"><HookTitle /></Sequence>
      {LABELS.map((l, i) => {
        const from = s2f(l.from);
        const dur = s2f(l.to) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`Белгі: ${l.text}`}>
            <Label text={l.text} dur={dur} />
          </Sequence>
        );
      })}
      <Subtitles until={END_AT} />
      <Watermark until={END_AT} />
      {/* Тек таза озвучка: музыка мен SFX жоқ */}
      {withAudio && <Audio src={staticFile("audio/voice.mp3")} />}
    </AbsoluteFill>
  );
};
