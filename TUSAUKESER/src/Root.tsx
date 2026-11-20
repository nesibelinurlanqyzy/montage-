import { Composition } from "remotion";
import { Tusaukeser } from "./Tusaukeser";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Tusaukeser"
    component={Tusaukeser}
    durationInFrames={TOTAL_FRAMES}
    defaultProps={{ withAudio: true, music: false }}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
