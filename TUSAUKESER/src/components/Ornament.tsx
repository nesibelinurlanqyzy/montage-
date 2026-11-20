import React from "react";
import { COLORS } from "../theme";

// Қошқар мүйіз — қазақ оюының негізгі элементі (стильдендірілген)
const HORN =
  "M0,0 C0,-28 22,-44 44,-36 C62,-29 64,-8 50,2 C40,9 28,4 28,-6 C28,-14 37,-17 42,-12";

export const HornPair: React.FC<{ size?: number; color?: string; progress?: number; stroke?: number }> = ({
  size = 120,
  color = COLORS.gold,
  progress = 1,
  stroke = 5,
}) => {
  const len = 180;
  return (
    <svg width={size} height={size * 0.6} viewBox="-70 -50 140 84" style={{ overflow: "visible" }}>
      <g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - progress)}>
        <path d={HORN} transform="translate(4,20)" />
        <path d={HORN} transform="translate(-4,20) scale(-1,1)" />
        <path d="M0,20 L0,34" />
      </g>
    </svg>
  );
};

// Ою-өрнекті көлденең сызық (ортасында мүйіз, екі жағында жіңішке сызық)
export const OrnamentLine: React.FC<{ width?: number; progress?: number; color?: string }> = ({
  width = 620,
  progress = 1,
  color = COLORS.gold,
}) => {
  const lineW = ((width - 130) / 2) * Math.min(1, progress * 1.4);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width, gap: 6 }}>
      <div style={{ width: lineW, height: 3, background: `linear-gradient(90deg, transparent, ${color})` }} />
      <HornPair size={110} progress={progress} color={color} stroke={4.5} />
      <div style={{ width: lineW, height: 3, background: `linear-gradient(270deg, transparent, ${color})` }} />
    </div>
  );
};

// Бұрыштағы ою (рамка үшін)
export const CornerHorn: React.FC<{ rotate: number; size?: number; color?: string; progress?: number }> = ({
  rotate,
  size = 90,
  color = COLORS.gold,
  progress = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rotate}deg)` }}>
    <g fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={260}
      strokeDashoffset={260 * (1 - progress)}>
      <path d="M6,94 L6,40 C6,18 18,6 40,6 L94,6" />
      <path d="M18,60 C18,34 30,22 52,22 C70,22 74,40 62,46 C54,50 46,44 50,37" />
    </g>
  </svg>
);
