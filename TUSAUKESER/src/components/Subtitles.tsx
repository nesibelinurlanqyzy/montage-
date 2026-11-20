import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SUB_CHUNKS } from "../data";
import { COLORS, FONT } from "../theme";

// Анимациялық субтитр: сөздер кезекпен «секіріп» шығады, айтылып тұрған сөз — алтын
export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const chunk = SUB_CHUNKS.find((c, i) => {
    const start = c.words[0][1];
    const next = SUB_CHUNKS[i + 1];
    const end = next ? Math.min(next.words[0][1], c.words[c.words.length - 1][2] + 0.35) : 99;
    return t >= start && t < end;
  });
  if (!chunk || chunk.hide) return null;
  const chunkEnd = chunk.words[chunk.words.length - 1][2] + 0.35;
  const out = interpolate(t, [chunkEnd - 0.12, chunkEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ top: 1330, height: 260, alignItems: "center", justifyContent: "flex-start", opacity: out }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 28px", width: 940 }}>
        {chunk.words.map(([word, a, b], i) => {
          const s = spring({ frame: f - Math.round(a * fps) + 2, fps, config: { damping: 13, stiffness: 220 } });
          const active = t >= a && t < b + 0.05;
          const spoken = t >= a;
          return (
            <span key={i} style={{
              fontFamily: FONT.sans, fontWeight: 800, fontSize: 82, lineHeight: 1.12,
              color: active ? COLORS.goldLight : COLORS.cream,
              opacity: spoken ? Math.max(0.15, s) : 0,
              transform: `translateY(${(1 - s) * 34}px)`,
              display: "inline-block",
              textShadow: active
                ? "0 0 24px rgba(246,222,154,0.55), 0 4px 0 rgba(90,60,10,0.9), 0 8px 22px rgba(0,0,0,0.85)"
                : "0 4px 0 rgba(0,0,0,0.55), 0 8px 22px rgba(0,0,0,0.85)",
              WebkitTextStroke: "1.5px rgba(10,20,36,0.6)",
            }}>{word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
