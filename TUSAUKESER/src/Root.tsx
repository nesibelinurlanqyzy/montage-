import { Composition } from "remotion";
import { Tusaukeser } from "./Tusaukeser";
import { Cover } from "./Cover";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Tusaukeser"
    component={Tusaukeser}
    durationInFrames={TOTAL_FRAMES}
    defaultProps={{ withAudio: true }}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
  <Composition id="Cover" component={Cover} durationInFrames={1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ variant: "a" as const }} />
  </>
);
