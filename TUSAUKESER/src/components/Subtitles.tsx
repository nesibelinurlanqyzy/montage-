import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SUB_CHUNKS } from "../data";
import { COLORS, FONT, SAFE, SAFE_W } from "../theme";

const KEY = 92;
const NORMAL = 70;
const MAX_W = SAFE_W - 20; // оң жақтағы Instagram батырмаларына тимейді

// Premium motion typography: әр сөз дауыспен бірге маска астынан шығады.
// Әр бөлік — бір жол (үзілмейді); маңызды сөздер («*») — үлкен, алтын/сары; қалғаны — ақ.
export const Subtitles: React.FC<{ until: number }> = ({ until }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (t >= until) return null;
  const endOf = (i: number) => {
    const c = SUB_CHUNKS[i];
    const last = c.words[c.words.length - 1][2];
    const next = SUB_CHUNKS[i + 1];
    if (!next) return last + 0.3;
    const ns = next.words[0][1];
    return ns - last < 0.6 ? ns : last + 0.3; // қысқа үзілісте мәтін экраннан кетпейді
  };
  const idx = SUB_CHUNKS.findIndex((c, i) => t >= c.words[0][1] && t < endOf(i));
  const chunk = SUB_CHUNKS[idx];
  if (!chunk || chunk.hide) return null;
  const chunkEnd = Math.min(endOf(idx), until);
  const next = SUB_CHUNKS[idx + 1];
  const handover = next && Math.abs(chunkEnd - next.words[0][1]) < 0.01 && !next.hide;
  const out = handover ? 1 : interpolate(t, [chunkEnd - 0.1, chunkEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const est = chunk.words.reduce((acc, [raw]) => {
    const key = raw.startsWith("*");
    return acc + (raw.length - (key ? 1 : 0)) * (key ? KEY : NORMAL) * 0.66 + 22;
  }, 0);
  const k = Math.min(1, MAX_W / est);
  return (
    <AbsoluteFill style={{ top: 1335, height: 150, left: SAFE.left, width: SAFE_W, alignItems: "center", opacity: out }}>
      <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "baseline", gap: 20 * k, whiteSpace: "nowrap" }}>
        {chunk.words.map(([raw, a, b], i) => {
          const key = raw.startsWith("*");
          const word = key ? raw.slice(1) : raw;
          const s = spring({ frame: f - Math.round(a * fps) + 1, fps, config: { damping: 15, stiffness: 230 } });
          const active = t >= a && t < b + 0.04;
          const color = key ? (active ? COLORS.yellow : COLORS.goldLight) : COLORS.white;
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "4px 2px 12px" }}>
              <span style={{
                display: "inline-block", fontFamily: FONT.sans, fontWeight: key ? 900 : 800,
                fontSize: (key ? KEY : NORMAL) * k, lineHeight: 1.08, color, letterSpacing: key ? 1 : 0.5,
                transform: `translateY(${(1 - s) * 105}%)`,
                textShadow: "0 3px 0 rgba(0,0,0,0.3), 0 6px 22px rgba(0,0,0,0.65)",
              }}>{word}</span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
