import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const fonts: [string, string, string][] = [
  ["Montserrat", "fonts/Montserrat-Medium.ttf", "500"],
  ["Montserrat", "fonts/Montserrat-Bold.ttf", "700"],
  ["Montserrat", "fonts/Montserrat-ExtraBold.ttf", "800"],
  ["Montserrat", "fonts/Montserrat-Black.ttf", "900"],
  ["PT Serif", "fonts/PTSerifBold.ttf", "700"],
];

export const fontsReady = Promise.all(
  fonts.map(([family, url, weight]) => loadFont({ family, url: staticFile(url), weight }))
);
