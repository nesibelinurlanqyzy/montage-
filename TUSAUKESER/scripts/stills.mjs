// Раскадровка үшін бірнеше кадрды PNG ретінде шығарады.
// node scripts/stills.mjs <out_dir> <frame1> <frame2> ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [outDir, ...frames] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts"), publicDir: join(root, "public") });
const browserExecutable = process.env.CHROME_PATH || null;
const comp = await selectComposition({ serveUrl, id: "Tusaukeser", inputProps: { withAudio: false }, browserExecutable });
for (const fr of frames) {
  const out = resolve(outDir, `f${String(fr).padStart(3, "0")}.png`);
  await renderStill({ composition: comp, serveUrl, frame: Number(fr), output: out, inputProps: { withAudio: false }, browserExecutable });
  console.log("still", fr);
}
