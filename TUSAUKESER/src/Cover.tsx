import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile } from "remotion";
import { fontsReady } from "./components/Fonts";
import { COLORS, FONT, GOLD_GRADIENT } from "./theme";
import { PHOTO } from "./data";

// Обложка: жоғарыда киім фотосы, төменде ақ панель (Instagram торында 4:5 ортасына сыяды)
export const Cover: React.FC<{ variant: "a" | "b" }> = ({ variant }) => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => { fontsReady.then(() => continueRender(h)); }, [h]);
  const photoH = 1240;
  const img = (src: string, x = 50, y = 40): React.ReactNode => (
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${x}% ${y}%` }} />
  );
  return (
    <AbsoluteFill style={{ background: "#FFFDF8" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: photoH, display: "flex", gap: 6, background: "#FFFDF8" }}>
        {variant === "a" ? (
          <div style={{ flex: 1, overflow: "hidden" }}>{img(PHOTO.boyPathWide, 50, 55)}</div>
        ) : (
          <>
            <div style={{ flex: 1, overflow: "hidden" }}>{img(PHOTO.boyChapan, 42, 45)}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>{img(PHOTO.girlRed, 38, 50)}</div>
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, top: photoH - 220, width: 1080, height: 220, background: "linear-gradient(180deg, transparent, rgba(255,253,248,0.0) 30%, rgba(255,253,248,0.9) 85%, #FFFDF8)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: photoH - 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ padding: "12px 40px", borderRadius: 40, background: COLORS.ruby, color: "#fff", fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, letterSpacing: 10 }}>ПЕТРОПАВЛ</div>
        <div style={{ marginTop: 22, fontFamily: FONT.sans, fontWeight: 900, fontSize: 104, lineHeight: 1, color: COLORS.ruby, letterSpacing: 1 }}>ТҰСАУКЕСЕРГЕ</div>
        <div style={{ marginTop: 14, fontFamily: FONT.sans, fontWeight: 800, fontSize: 46, color: "#3A2A1E", letterSpacing: 3 }}>және 1 жасқа киім прокаты</div>
        <div style={{ marginTop: 18, height: 4, width: 160, background: GOLD_GRADIENT, borderRadius: 2 }} />
        <div style={{ marginTop: 14, fontFamily: FONT.sans, fontWeight: 900, fontSize: 112, lineHeight: 1.05, backgroundImage: GOLD_GRADIENT, WebkitBackgroundClip: "text", color: "transparent" }}>
          7 000 ₸ <span style={{ fontSize: 66 }}>БАСТАП</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
