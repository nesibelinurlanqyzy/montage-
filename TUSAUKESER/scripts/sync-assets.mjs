// videos/, photos/, audio/ папкаларындағы файлдарды Remotion оқитын public/ ішіне көшіреді.
import { cpSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const dir of ["videos", "photos", "audio"]) {
  const src = join(root, dir);
  const dst = join(root, "public", dir);
  mkdirSync(dst, { recursive: true });
  if (!existsSync(src)) continue;
  for (const f of readdirSync(src)) {
    if (f.startsWith(".") || f === "README.md") continue;
    cpSync(join(src, f), join(dst, f));
  }
}
console.log("assets synced → public/");
