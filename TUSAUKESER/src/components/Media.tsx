import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const ease = Easing.bezier(0.33, 0, 0.2, 1);

// Видео-клип: баяу кино-зум
export const ClipLayer: React.FC<{ src: string; startSec?: number; zoom?: [number, number]; dur: number }> = ({
  src, startSec = 0, zoom = [1.0, 1.08], dur,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = interpolate(f, [0, dur], zoom, { easing: ease, extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})` }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(startSec * fps)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

// Фото: нәзік 3D parallax (артқы бұлдыр қабат + алдыңғы қабат перспективамен)
export const PhotoLayer: React.FC<{ src: string; dur: number; dir?: 1 | -1; focusY?: number }> = ({
  src, dur, dir = 1, focusY = 45,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], { easing: ease, extrapolateRight: "clamp" });
  const scale = 1.03 + p * 0.05;
  const rotY = interpolate(p, [0, 1], [-1.6 * dir, 1.6 * dir]);
  const rotX = interpolate(p, [0, 1], [0.6, -0.6]);
  const tx = interpolate(p, [0, 1], [-10 * dir, 10 * dir]);
  return (
    <AbsoluteFill style={{ perspective: 1400, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(1.35) translateX(${-tx * 1.6}px)`, filter: "blur(28px) brightness(0.75)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{
        transform: `translateX(${tx}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`,
        transformOrigin: `50% ${focusY}%`,
      }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${focusY}%` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Көлденең фотоны 3D карточка ретінде
export const PhotoCard: React.FC<{ src: string; dur: number; width?: number; top?: number }> = ({
  src, dur, width = 940, top = 760,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], { easing: ease, extrapolateRight: "clamp" });
  const inP = interpolate(f, [0, 14], [0, 1], { easing: Easing.out(Easing.back(1.4)), extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(0.45)", transform: `scale(${1.4 + p * 0.1})` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{
        position: "absolute", left: (1080 - width) / 2, top, width,
        transform: `translateY(${(1 - inP) * 140}px) rotateY(${interpolate(p, [0, 1], [-7, 5])}deg) rotateX(${interpolate(p, [0, 1], [4, -2])}deg) scale(${0.92 + inP * 0.08 + p * 0.04})`,
        opacity: inP, borderRadius: 34, overflow: "hidden",
        boxShadow: "0 40px 90px rgba(0,0,0,0.55), 0 0 0 3px rgba(217,174,85,0.85)",
      }}>
        <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

// Фотоны берілген қорапқа (box) толтыру, нәзік зуммен
export const PhotoBox: React.FC<{ src: string; dur: number; x?: number; y?: number; zoom?: [number, number] }> = ({
  src, dur, x = 50, y = 40, zoom = [1.02, 1.08],
}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], zoom, { easing: ease, extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${x}% ${y}%`, transform: `scale(${s})`, transformOrigin: `${x}% ${y}%` }} />
    </AbsoluteFill>
  );
};
