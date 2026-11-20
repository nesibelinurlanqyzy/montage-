import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import type { Enter } from "../data";

// Таза, жұмсақ ауысулар (артық жарқылсыз)
export const EnterFx: React.FC<{ type: Enter; children: React.ReactNode }> = ({ type, children }) => {
  const f = useCurrentFrame();
  const o = Easing.out(Easing.cubic);
  const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  let style: React.CSSProperties = {};
  let dip = 0;
  if (type === "punch") {
    const p = interpolate(f, [0, 7], [0, 1], { ...cl, easing: o });
    style = { transform: `scale(${1.16 - 0.16 * p})`, filter: `blur(${(1 - p) * 8}px)` };
  } else if (type === "whip") {
    const p = interpolate(f, [0, 7], [0, 1], { ...cl, easing: o });
    style = { transform: `translateX(${(1 - p) * 260}px)`, filter: `blur(${(1 - p) * 10}px)` };
  } else if (type === "fade") {
    style = { opacity: interpolate(f, [0, 6], [0, 1], cl) };
  } else if (type === "wipe") {
    const p = interpolate(f, [0, 9], [0, 1], { ...cl, easing: o });
    style = { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` };
  } else if (type === "dip") {
    dip = interpolate(f, [0, 7], [0.85, 0], cl);
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {dip > 0 && <AbsoluteFill style={{ background: "#FFFDF8", opacity: dip }} />}
    </AbsoluteFill>
  );
};
