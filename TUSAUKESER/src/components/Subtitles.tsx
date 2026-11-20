import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SUB_CHUNKS } from "../data";
import { COLORS, FONT } from "../theme";

// Premium motion typography: әр сөз дауыспен бірге маска астынан шығады.
// Маңызды сөздер («*») — үлкен, алтын/сары; қалғаны — ақ.
export const Subtitles: React.FC<{ until: number }> = ({ until }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (t >= until) return null;
  const idx = SUB_CHUNKS.findIndex((c, i) => {
    const next = SUB_CHUNKS[i + 1];
    const end = next ? Math.min(next.words[0][1], c.words[c.words.length - 1][2] + 0.3) : 99;
    return t >= c.words[0][1] && t < end;
  });
  const chunk = SUB_CHUNKS[idx];
  if (!chunk || chunk.hide) return null;
  const chunkEnd = Math.min(chunk.words[chunk.words.length - 1][2] + 0.3, until);
  const out = interpolate(t, [chunkEnd - 0.1, chunkEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ top: 1420, height: 200, alignItems: "center", opacity: out, transform: `translateY(${(1 - out) * -12}px)` }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "0 20px", width: 960 }}>
        {chunk.words.map(([raw, a, b], i) => {
          const key = raw.startsWith("*");
          const word = key ? raw.slice(1) : raw;
          const s = spring({ frame: f - Math.round(a * fps) + 1, fps, config: { damping: 15, stiffness: 230 } });
          const active = t >= a && t < b + 0.04;
          const color = key ? (active ? COLORS.yellow : COLORS.goldLight) : COLORS.white;
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "4px 2px 10px" }}>
              <span style={{
                display: "inline-block", fontFamily: FONT.sans, fontWeight: key ? 900 : 800,
                fontSize: key ? 92 : 68, lineHeight: 1.08, color, letterSpacing: key ? 1 : 0.5,
                transform: `translateY(${(1 - s) * 105}%) scale(${key && active ? 1.04 : 1})`,
                textShadow: "0 3px 0 rgba(0,0,0,0.25), 0 6px 22px rgba(0,0,0,0.6)",
              }}>{word}</span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
