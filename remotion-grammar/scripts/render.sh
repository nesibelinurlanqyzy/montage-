#!/bin/bash
# Тұрақты рендер: видео 300 кадрлық бөліктермен (дыбыссыз) + дыбыс бөлек → біріктіру.
set -e
cd "$(dirname "$0")/.."
OUT=${1:-out/present-perfect-vs-past-simple.mp4}
mkdir -p out/parts; rm -f out/parts/*
for s in 0 300 600 900 1200; do
  e=$((s+299)); [ $e -gt 1349 ] && e=1349
  for try in 1 2 3; do
    npx remotion render src/index.ts GrammarVideo out/parts/p$s.mp4 --frames=$s-$e --muted --codec h264 --crf 18 --timeout=120000 --log=error && break
    echo "retry $s ($try)"
  done
  echo "file 'p$s.mp4'" >> out/parts/list.txt
done
npx remotion render src/index.ts GrammarVideo out/parts/audio.wav --codec wav --log=error
ffmpeg -loglevel error -y -f concat -safe 0 -i out/parts/list.txt -i out/parts/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest "$OUT"
ls -la "$OUT"
