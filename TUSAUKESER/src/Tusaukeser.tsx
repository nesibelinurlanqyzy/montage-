import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

// Уақытша бет: монтаж әлі басталған жоқ.
// Сценарий, раскадровка және мақұлдаудан кейін осы жерге сахналар қосылады.
export const Tusaukeser: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          color: COLORS.gold,
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: 8,
          fontFamily: "serif",
        }}
      >
        ТҰСАУКЕСЕР
      </div>
    </AbsoluteFill>
  );
};
