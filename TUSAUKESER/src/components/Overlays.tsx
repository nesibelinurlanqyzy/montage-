import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT, GOLD_GRADIENT, FPS } from "../theme";
import { BRAND } from "../data";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sec = (s: number) => Math.round(s * FPS);

// Жеңіл кино-түс: мәтін оқылуы үшін жоғарғы/төменгі жұмсақ көлеңке
export const Grade: React.FC<{ until: number }> = ({ until }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [sec(until) - 4, sec(until) + 4], [1, 0], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,8,6,0.28) 0%, transparent 24%, transparent 68%, rgba(20,8,6,0.38) 84%, rgba(20,8,6,0.4) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 95% 80% at 50% 45%, transparent 70%, rgba(0,0,0,0.12) 100%)" }} />
    </AbsoluteFill>
  );
};

// Маска арқылы төменнен шығатын сөз
const Reveal: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 16, stiffness: 190 } });
  return (
    <span style={{ display: "inline-block", overflow: "hidden", padding: "0 4px", verticalAlign: "bottom" }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - s) * 105}%)`, ...style }}>{children}</span>
    </span>
  );
};

// ХУК: «Тұсаукесерге / БІР КҮН ҮШІН / ҚЫМБАТ КИІМ?!» — дауыспен синхрон
export const HookTitle: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(f, [sec(3.3), sec(3.54)], [0, 1], cl);
  const punch = spring({ frame: f - sec(1.68), fps, config: { damping: 9, stiffness: 210, mass: 0.8 } });
  const kiim = spring({ frame: f - sec(2.08), fps, config: { damping: 10, stiffness: 220 } });
  const shake = 0;
  const shadow = "0 3px 0 rgba(0,0,0,0.35), 0 6px 26px rgba(0,0,0,0.75)";
  return (
    <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(15,6,4,0.55) 0%, rgba(15,6,4,0.38) 28%, transparent 40%)", opacity: 1 - exit }} />
    <AbsoluteFill style={{ alignItems: "center", top: 236, opacity: 1 - exit, filter: `blur(${exit * 10}px)`, transform: `translateY(${-exit * 40}px)` }}>
      <div style={{
        fontFamily: FONT.sans, fontWeight: 800, fontSize: 62, color: COLORS.white, letterSpacing: 3,
        opacity: interpolate(f, [0, 6], [0, 1], cl), filter: `blur(${interpolate(f, [0, 8], [8, 0], cl)}px)`, textShadow: shadow,
      }}>Тұсаукесерге</div>
      <div style={{ marginTop: 4, fontFamily: FONT.sans, fontWeight: 900, fontSize: 92, color: COLORS.white, letterSpacing: 2, textShadow: shadow, lineHeight: 1.1 }}>
        <Reveal at={sec(0.84)}>БІР</Reveal> <Reveal at={sec(1.08)}>КҮН</Reveal> <Reveal at={sec(1.38)}>ҮШІН</Reveal>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6, transform: `translateX(${shake}px)` }}>
        <span style={{
          fontFamily: FONT.sans, fontWeight: 900, fontSize: 98, lineHeight: 1.05,
          backgroundImage: GOLD_GRADIENT, WebkitBackgroundClip: "text", color: "transparent",
          transform: `scale(${punch ? 1.5 - 0.5 * punch : 0})`, opacity: punch > 0.02 ? 1 : 0, display: "inline-block",
          filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
        }}>ҚЫМБАТ</span>
        <span style={{
          fontFamily: FONT.sans, fontWeight: 900, fontSize: 98, lineHeight: 1.05, color: COLORS.white,
          transform: `translateY(${(1 - kiim) * 60}px)`, opacity: kiim, display: "inline-block", textShadow: shadow,
        }}>КИІМ<span style={{ color: COLORS.yellow }}>?!</span></span>
      </div>
    </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Таза белгі: ақ/алтын жазу + жіңішке алтын сызық
export const Label: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 18, stiffness: 160 } });
  const out = interpolate(f, [dur - 6, dur], [1, 0], cl);
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 240, opacity: out }}>
      <div style={{ overflow: "hidden" }}>
        <div style={{
          fontFamily: FONT.sans, fontWeight: 800, fontSize: 54, letterSpacing: 8, color: COLORS.white,
          transform: `translateY(${(1 - s) * 100}%)`, textShadow: "0 4px 18px rgba(0,0,0,0.6)",
        }}>{text}</div>
      </div>
      <div style={{ marginTop: 12, height: 3, width: 160 * s, background: GOLD_GRADIENT, borderRadius: 2 }} />
    </AbsoluteFill>
  );
};

// Ұлдарға / Қыздарға белгілері (бөлу сызығының жанында)
export const SplitTags: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f - 3, fps, config: { damping: 16 } });
  const b = spring({ frame: f - sec(0.52), fps, config: { damping: 16 } });
  const tag = (t: string, p: number, top: number, left: boolean): React.ReactNode => (
    <div style={{
      position: "absolute", top, [left ? "left" : "right"]: 60, padding: "12px 30px", borderRadius: 40,
      background: COLORS.white, color: COLORS.ruby, fontFamily: FONT.sans, fontWeight: 800, fontSize: 40, letterSpacing: 5,
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)", transform: `translateX(${(1 - p) * (left ? -280 : 280)}px)`, opacity: p,
    }}>{t}</div>
  );
  return (
    <AbsoluteFill>
      {tag("ҰЛДАРҒА", a, 860, true)}
      {tag("ҚЫЗДАРҒА", b, 990, false)}
    </AbsoluteFill>
  );
};

// Баға: «7 000 ₸ БАСТАП» — айналатын цифр + алтын жылтыр
export const PriceAccent: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(f, [dur - 5, dur], [1, 0], cl);
  const roll = interpolate(f, [0, 16], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7"];
  const rest = spring({ frame: f - 12, fps, config: { damping: 14, stiffness: 200 } });
  const tenge = spring({ frame: f - 18, fps, config: { damping: 8, stiffness: 220 } });
  const shineX = interpolate(f, [20, 44], [-30, 130], cl);
  const bastap = spring({ frame: f - 8, fps, config: { damping: 14, stiffness: 180 } });
  const H = 236;
  const gold: React.CSSProperties = {
    fontFamily: FONT.sans, fontWeight: 900, fontSize: 236, lineHeight: `${H}px`, letterSpacing: -2,
    backgroundImage: `linear-gradient(105deg, transparent ${shineX - 10}%, rgba(255,255,255,0.9) ${shineX}%, transparent ${shineX + 10}%), ${GOLD_GRADIENT}`,
    WebkitBackgroundClip: "text", color: "transparent",
  };
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 222, opacity: out }}>
      <div style={{ position: "absolute", top: -16, width: 900, height: 360, borderRadius: 40, background: "rgba(24,8,8,0.58)", backdropFilter: "blur(14px)", border: "2px solid rgba(217,174,85,0.55)", opacity: interpolate(f, [0, 6], [0, 1], cl), zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-end", filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.55))" }}>
        <div style={{ height: H, overflow: "hidden" }}>
          <div style={{ transform: `translateY(${-roll * (digits.length - 1) * H}px)` }}>
            {digits.map((d) => <div key={d} style={gold}>{d}</div>)}
          </div>
        </div>
        <div style={{ ...gold, marginLeft: 26, transform: `translateY(${(1 - rest) * 60}px)`, opacity: rest }}>000</div>
        <div style={{ ...gold, marginLeft: 34, transform: `scale(${tenge})` }}>₸</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 6 }}>
        <div style={{ height: 3, width: 120 * bastap, background: GOLD_GRADIENT }} />
        <div style={{
          padding: "8px 34px", borderRadius: 12, background: COLORS.ruby, color: COLORS.white,
          fontFamily: FONT.sans, fontWeight: 900, fontSize: 68, letterSpacing: 16 * bastap + 4, opacity: bastap,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}>БАСТАП</div>
        <div style={{ height: 3, width: 120 * bastap, background: GOLD_GRADIENT }} />
      </div>
      </div>
    </AbsoluteFill>
  );
};

// Соңғы кадр: ақ панель — Петропавл, прокат, баға, WhatsApp
export const EndCard: React.FC<{ dur: number; startSec: number }> = ({ startSec }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = startSec + f / fps;
  const panel = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  const item = (i: number) => spring({ frame: f - 6 - i * 4, fps, config: { damping: 16, stiffness: 170 } });
  const anim = (i: number): React.CSSProperties => ({ opacity: item(i), transform: `translateY(${(1 - item(i)) * 30}px)` });
  const wipe = interpolate(f, [12, 26], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const waOn = t >= 23.9;
  const pulse = waOn ? 1 + Math.sin((t - 23.9) * 9) * 0.025 : 1;
  const hl = (on: boolean): React.CSSProperties => ({ color: on ? COLORS.yellow : COLORS.white, transition: "none" });
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", left: 0, right: 0, top: 940, bottom: 0, background: "#FFFDF8",
        borderTopLeftRadius: 56, borderTopRightRadius: 56, transform: `translateY(${(1 - panel) * 1100}px)`,
        boxShadow: "0 -20px 60px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34,
      }}>
        <div style={{ ...anim(0), fontFamily: FONT.sans, fontWeight: 900, fontSize: 50, letterSpacing: 16, color: COLORS.ruby }}>{BRAND.city}</div>
        <div style={{ ...anim(0), height: 3, width: 110, background: GOLD_GRADIENT, margin: "12px 0 14px" }} />
        <div style={{ ...anim(1), fontFamily: FONT.sans, fontWeight: 800, fontSize: 32, lineHeight: 1.2, color: "#3A2A1E", textAlign: "center", letterSpacing: 1 }}>
          ТҰСАУКЕСЕР ЖӘНЕ 1 ЖАСҚА КИІМДЕР ПРОКАТЫ
        </div>
        <div style={{ marginTop: 10, clipPath: `inset(0 ${100 - wipe * 100}% 0 0)`, fontFamily: FONT.sans, fontWeight: 900, fontSize: 124, lineHeight: 1.08, backgroundImage: GOLD_GRADIENT, WebkitBackgroundClip: "text", color: "transparent" }}>
          7 000 ₸ <span style={{ fontSize: 72 }}>БАСТАП</span>
        </div>
        <div style={{ height: 4, width: 520 * wipe, background: GOLD_GRADIENT, borderRadius: 2, marginTop: 2 }} />
        <div style={{
          ...anim(3), marginTop: 24, width: 980, padding: "24px 26px", borderRadius: 36, background: COLORS.ruby,
          display: "flex", alignItems: "center", gap: 24, transform: `${anim(3).transform} scale(${pulse})`,
          boxShadow: waOn ? "0 14px 40px rgba(126,16,34,0.45)" : "0 10px 26px rgba(126,16,34,0.3)",
        }}>
          <div style={{ width: 104, height: 104, borderRadius: 52, background: COLORS.whatsapp, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <WhatsAppIcon />
          </div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 52, lineHeight: 1.15, letterSpacing: 0.5 }}>
            <span style={hl(t >= 21.8 && t < 22.54)}>БОС КҮНДЕРДІ</span> <span style={hl(false)}>БІЛУ ҮШІН</span><br />
            <span style={hl(waOn)}>WHATSAPP-ҚА</span> <span style={hl(t >= 24.52)}>ЖАЗЫҢЫЗ</span>
          </div>
        </div>
        {BRAND.whatsapp && (
          <div style={{ ...anim(4), marginTop: 14, fontFamily: FONT.sans, fontWeight: 800, fontSize: 48, color: COLORS.ruby }}>{BRAND.whatsapp}</div>
        )}
        <div style={{ ...anim(4), marginTop: 18, fontFamily: FONT.sans, fontWeight: 700, fontSize: 32, color: "#5B4A3A" }}>
          Instagram: <span style={{ color: COLORS.goldDeep }}>{BRAND.instagram}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WhatsAppIcon: React.FC = () => (
  <svg width="66" height="66" viewBox="0 0 32 32"><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.6L3 29l7-2.1c1.8 1 3.9 1.6 6 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.2-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.3 9.9 10.1 5.2 16 5.2s10.7 4.7 10.7 10.5S21.9 26 16 26zm5.9-7.8c-.3-.2-1.900-.9-2.200-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.400-.5-2.600-1.600-1-.9-1.600-1.900-1.800-2.200-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.400c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.200 1.100-1.200 2.700s1.200 3.200 1.400 3.400c.2.2 2.400 3.600 5.700 5 .8.3 1.400.5 1.900.7.8.2 1.500.2 2.100.1.6-.1 1.900-.8 2.200-1.500.3-.7.3-1.400.2-1.500-.1-.2-.3-.3-.6-.4z"/></svg>
);

// Су белгісі
export const Watermark: React.FC<{ until: number }> = ({ until }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: FONT.sans, fontWeight: 600, fontSize: 26,
      color: "rgba(255,255,255,0.75)", letterSpacing: 1, textShadow: "0 2px 8px rgba(0,0,0,0.6)",
      opacity: interpolate(f, [sec(until) - 4, sec(until)], [1, 0], cl),
    }}>{BRAND.instagram}</div>
  );
};
