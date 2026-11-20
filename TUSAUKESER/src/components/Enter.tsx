import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import type { Enter } from "../data";
import { COLORS } from "../theme";

// Сахнаның кіру анимациясы (ауысу)
export const EnterFx: React.FC<{ type: Enter; children: React.ReactNode }> = ({ type, children }) => {
  const f = useCurrentFrame();
  const o = Easing.out(Easing.cubic);
  let style: React.CSSProperties = {};
  if (type === "zoom") {
    const p = interpolate(f, [0, 9], [0, 1], { easing: o, extrapolateRight: "clamp" });
    style = { transform: `scale(${1.28 - 0.28 * p})`, filter: `blur(${(1 - p) * 14}px)` };
  } else if (type === "whip") {
    const p = interpolate(f, [0, 8], [0, 1], { easing: o, extrapolateRight: "clamp" });
    style = { transform: `translateX(${(1 - p) * 420}px) skewX(${(1 - p) * -6}deg)`, filter: `blur(${(1 - p) * 18}px)` };
  } else if (type === "fade") {
    const p = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
    style = { opacity: p, transform: `scale(${1.06 - 0.06 * p})` };
  } else if (type === "ornament") {
    const p = interpolate(f, [0, 12], [0, 1], { easing: o, extrapolateRight: "clamp" });
    style = { clipPath: `circle(${p * 120}% at 50% 50%)` };
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {type === "flash" && <Flash />}
      {type !== "flash" && type !== "fade" && <LightLeak />}
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 2, 9], [0.95, 0.75, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #FFF8E4, ${COLORS.goldLight} 45%, ${COLORS.gold})`, opacity: a, mixBlendMode: "screen" }} />;
};

const LightLeak: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 3, 12], [0, 0.55, 0], { extrapolateRight: "clamp" });
  const x = interpolate(f, [0, 12], [-20, 120]);
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 60% 40% at ${x}% 30%, rgba(255,214,140,0.95), rgba(255,140,60,0.25) 50%, transparent 75%)`,
      opacity: a, mixBlendMode: "screen",
    }} />
  );
};
