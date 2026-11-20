// photos/, audio/, fonts/ файлдарын Remotion оқитын public/ ішіне көшіреді.
// audio/ ішіндегі бірінші .mp3 → public/audio/voice.mp3 (озвучка).
import { cpSync, mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skip = (f) => f.startsWith(".") || f === "README.md" || f === "OFL.txt";
for (const dir of ["photos", "audio", "fonts"]) {
  const src = join(root, dir);
  const dst = join(root, "public", dir);
  rmSync(dst, { recursive: true, force: true });
  mkdirSync(dst, { recursive: true });
  if (!existsSync(src)) continue;
  const files = readdirSync(src).filter((f) => !skip(f)).sort();
  for (const f of files) cpSync(join(src, f), join(dst, f));
  if (dir === "audio") {
    const voice = files.find((f) => f.toLowerCase().endsWith(".mp3") && !/music|muzyka|әуен/i.test(f));
    if (voice) cpSync(join(src, voice), join(dst, "voice.mp3"));
    const music = files.find((f) => /music|muzyka|әуен/i.test(f));
    if (music) cpSync(join(src, music), join(dst, "music.mp3"));
  }
}
console.log("assets synced → public/");
