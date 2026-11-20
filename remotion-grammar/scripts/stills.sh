#!/bin/bash
# Рендер ключевых кадров: scripts/stills.sh 30 140 ...
cd "$(dirname "$0")/.."
mkdir -p out/stills
for fr in "$@"; do
  npx remotion still src/index.ts GrammarVideo "out/stills/f$(printf %04d $fr).jpg" --frame=$fr --scale=0.5 --log=error >/dev/null 2>&1 || echo "fail $fr"
done
