import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT, GOLD_GRADIENT } from "../theme";
import { OrnamentLine, CornerHorn } from "./Ornament";
import { BRAND } from "../data";

// Біртұтас кино-түс: виньетка + жылы реңк
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(5,8,16,0.55) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,20,36,0.55) 0%, transparent 22%, transparent 60%, rgba(10,20,36,0.75) 100%)" }} />
    <AbsoluteFill style={{ background: "rgba(255,190,110,0.05)", mixBlendMode: "soft-light" }} />
  </AbsoluteFill>
);

// Жұқа алтын рамка (бүкіл видео бойы)
export const Frame: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 24], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const c = "rgba(217,174,85,0.75)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 30, border: `2px solid ${c}`, borderRadius: 26, opacity: p * 0.7 }} />
      <div style={{ position: "absolute", left: 18, top: 18 }}><CornerHorn rotate={0} progress={p} color={c} size={80} /></div>
      <div style={{ position: "absolute", right: 18, top: 18 }}><CornerHorn rotate={90} progress={p} color={c} size={80} /></div>
      <div style={{ position: "absolute", right: 18, bottom: 18 }}><CornerHorn rotate={180} progress={p} color={c} size={80} /></div>
      <div style={{ position: "absolute", left: 18, bottom: 18 }}><CornerHorn rotate={270} progress={p} color={c} size={80} /></div>
    </AbsoluteFill>
  );
};

// Хук: «ТҰСАУКЕСЕР» алтын тақырыбы (0–2 сек)
export const HookTitle: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = "ТҰСАУКЕСЕР".split("");
  const out = interpolate(f, [62, 72], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 250, opacity: out }}>
      <div style={{ display: "flex" }}>
        {letters.map((l, i) => {
          const s = spring({ frame: f - 2 - i * 1.6, fps, config: { damping: 12, stiffness: 160 } });
          return (
            <span key={i} style={{
              fontFamily: FONT.serif, fontWeight: 700, fontSize: 132, letterSpacing: 4,
              backgroundImage: GOLD_GRADIENT, WebkitBackgroundClip: "text", color: "transparent",
              display: "inline-block", transform: `translateY(${(1 - s) * 80}px) scale(${0.6 + 0.4 * s})`, opacity: s,
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
            }}>{l}</span>
          );
        })}
      </div>
      <div style={{ marginTop: 6 }}>
        <OrnamentLine width={760} progress={interpolate(f, [8, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </div>
      <div style={{
        marginTop: 14, fontFamily: FONT.sans, fontWeight: 700, fontSize: 38, letterSpacing: 10, color: COLORS.cream,
        opacity: interpolate(f, [16, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        textShadow: "0 3px 12px rgba(0,0,0,0.7)",
      }}>КИІМ ПРОКАТЫ · {BRAND.city.toUpperCase()}</div>
    </AbsoluteFill>
  );
};

// Сахна белгісі (жоғарғы бөлікте алтын жазу + ою)
export const Label: React.FC<{ text: string; sub?: string; dur: number }> = ({ text, sub, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 150 } });
  const out = interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 270, opacity: Math.min(s, out) }}>
      <div style={{
        fontFamily: FONT.sans, fontWeight: 900, fontSize: text.length > 12 ? 92 : 112, letterSpacing: 3,
        backgroundImage: GOLD_GRADIENT, WebkitBackgroundClip: "text", color: "transparent",
        transform: `translateY(${(1 - s) * 50}px) scale(${0.85 + 0.15 * s})`,
        filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.75))", textAlign: "center",
      }}>{text}</div>
      <OrnamentLine width={560} progress={interpolate(f, [3, 18], [0, 1], { extrapolateRight: "clamp" })} />
      {sub && (
        <div style={{
          marginTop: 8, fontFamily: FONT.serif, fontWeight: 700, fontSize: 52, color: COLORS.cream, fontStyle: "italic",
          opacity: interpolate(f, [6, 14], [0, 1], { extrapolateRight: "clamp" }), textShadow: "0 3px 14px rgba(0,0,0,0.8)",
        }}>{sub}</div>
      )}
    </AbsoluteFill>
  );
};

// Ұл / Қыз екіге бөлінген экран жазулары
export const SplitTags: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - 2, fps, config: { damping: 14 } });
  const b = spring({ frame: f - 14, fps, config: { damping: 14 } });
  const tag = (t: string, p: number, top: number, left: boolean): React.ReactNode => (
    <div style={{
      position: "absolute", top, [left ? "left" : "right"]: 70, padding: "16px 34px", borderRadius: 60,
      background: "rgba(10,20,36,0.55)", border: `2px solid ${COLORS.gold}`, backdropFilter: "blur(10px)",
      fontFamily: FONT.sans, fontWeight: 800, fontSize: 54, color: COLORS.goldLight, letterSpacing: 4,
      transform: `translateX(${(1 - p) * (left ? -300 : 300)}px)`, opacity: p,
    }}>{t}</div>
  );
  return (
    <AbsoluteFill>
      {tag("ҰЛДАРҒА", a, 300, true)}
      {tag("ҚЫЗДАРҒА", b, 1080, false)}
    </AbsoluteFill>
  );
};

// Баға акценті: «7 000 ₸ БАСТАП»
export const PriceAccent: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 9, stiffness: 140, mass: 0.9 } });
  const b = spring({ frame: f - 30, fps, config: { damping: 12 } });
  const shine = interpolate(f % 40, [0, 40], [-60, 160]);
  const out = interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rays = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", opacity: out }}>
      <div style={{
        position: "absolute", top: 120, width: 1000, height: 700, left: 40,
        background: `conic-gradient(from ${f * 1.5}deg at 50% 50%, transparent 0deg, rgba(246,222,154,0.22) 12deg, transparent 24deg, transparent 45deg, rgba(246,222,154,0.18) 57deg, transparent 69deg, transparent 90deg, rgba(246,222,154,0.22) 102deg, transparent 114deg, transparent 135deg, rgba(246,222,154,0.18) 147deg, transparent 159deg, transparent 180deg, rgba(246,222,154,0.22) 192deg, transparent 204deg, transparent 225deg, rgba(246,222,154,0.18) 237deg, transparent 249deg, transparent 270deg, rgba(246,222,154,0.22) 282deg, transparent 294deg, transparent 315deg, rgba(246,222,154,0.18) 327deg, transparent 339deg)`,
        maskImage: "radial-gradient(circle, black 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 70%)",
        opacity: rays,
      }} />
      <div style={{ position: "absolute", top: 250, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          position: "relative", fontFamily: FONT.sans, fontWeight: 900, fontSize: 236, lineHeight: 1, letterSpacing: -4,
          backgroundImage: `linear-gradient(105deg, transparent ${shine - 12}%, rgba(255,255,255,0.95) ${shine}%, transparent ${shine + 12}%), ${GOLD_GRADIENT}`,
          WebkitBackgroundClip: "text", color: "transparent",
          transform: `scale(${0.3 + 0.7 * s})`, filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.8))", whiteSpace: "nowrap",
        }}>7 000 ₸</div>
        <div style={{
          marginTop: 10, padding: "14px 54px", borderRadius: 18, background: COLORS.ruby,
          border: `3px solid ${COLORS.goldLight}`, fontFamily: FONT.sans, fontWeight: 900, fontSize: 70, letterSpacing: 14,
          color: COLORS.cream, transform: `scale(${b}) rotate(${(1 - b) * -8}deg)`, boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
        }}>БАСТАП</div>
      </div>
    </AbsoluteFill>
  );
};

// Соңғы кадр: бренд + баға + WhatsApp батырмасы
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 15 } });
  const b = spring({ frame: f - 10, fps, config: { damping: 13 } });
  const c = spring({ frame: f - 22, fps, config: { damping: 10, stiffness: 160 } });
  const pulse = 1 + Math.sin(f / 4.2) * 0.035 * c;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{
        position: "absolute", top: 300, width: 900, padding: "56px 40px 60px", borderRadius: 40,
        background: "linear-gradient(180deg, rgba(10,20,36,0.78), rgba(10,20,36,0.62))", backdropFilter: "blur(14px)",
        border: `2px solid rgba(217,174,85,0.8)`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
        transform: `translateY(${(1 - a) * 120}px)`, opacity: a,
      }}>
        <div style={{ fontFamily: FONT.serif, fontWeight: 700, fontSize: 84, backgroundImage: GOLD_GRADIENT, WebkitBackgroundClip: "text", color: "transparent", textAlign: "center" }}>{BRAND.name}</div>
        <OrnamentLine width={620} progress={interpolate(f, [4, 22], [0, 1], { extrapolateRight: "clamp" })} />
        <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: COLORS.cream, textAlign: "center", opacity: b }}>
          ТҰСАУКЕСЕР · 1 ЖАС · ОТБАСЫ
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 96, color: COLORS.goldLight, opacity: b, transform: `scale(${0.8 + 0.2 * b})` }}>
          7 000 ₸ <span style={{ fontSize: 50, fontWeight: 800 }}>бастап</span>
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 38, color: COLORS.cream, opacity: b }}>📍 {BRAND.city}</div>
        <div style={{
          marginTop: 22, display: "flex", alignItems: "center", gap: 22, padding: "26px 52px", borderRadius: 80,
          background: COLORS.whatsapp, boxShadow: `0 0 ${40 * c}px rgba(37,211,102,0.7)`,
          transform: `scale(${c * pulse})`, fontFamily: FONT.sans, fontWeight: 800, fontSize: 50, color: "#fff",
        }}>
          <WhatsAppIcon /> WhatsApp-қа жазыңыз
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 56, color: "#fff", letterSpacing: 2, opacity: c }}>{BRAND.whatsapp}</div>
      </div>
    </AbsoluteFill>
  );
};

const WhatsAppIcon: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 32 32"><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.6L3 29l7-2.1c1.8 1 3.9 1.6 6 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.2-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.3 9.9 10.1 5.2 16 5.2s10.7 4.7 10.7 10.5S21.9 26 16 26zm5.9-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>
);

// Су белгісі
export const Watermark: React.FC = () => (
  <div style={{
    position: "absolute", top: 120, right: 70, fontFamily: FONT.sans, fontWeight: 700, fontSize: 30,
    color: "rgba(251,244,230,0.8)", letterSpacing: 1, textShadow: "0 2px 8px rgba(0,0,0,0.7)",
  }}>{BRAND.instagram}</div>
);
