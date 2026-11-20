#!/usr/bin/env bash
# videos/ ішіндегі бастапқы видеолардан керек бөліктерді кесіп,
# тігінен бұрып (1080×1920), 30 FPS, түсін үйлестіріп public/clips/ ішіне салады.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/clips
BASE="eq=contrast=1.06:saturation=1.08,colorbalance=rs=0.03:bs=-0.03:rm=0.02:bm=-0.02"
clip() { # name src start dur extra-filter
  ffmpeg -v error -y -ss "$3" -i "videos/$2" -t "$4" -an \
    -vf "transpose=2,scale=1080:1920,fps=30,$5$BASE,format=yuv420p" \
    -c:v libx264 -crf 16 -preset fast "public/clips/$1.mp4"
  echo "ok $1"
}
clip walk1   video2.mp4 5.0  4.4 ""
clip hat     video1.mp4 2.6  4.0 "eq=brightness=0.06:gamma=1.22,"
clip green   video4.mp4 0.6  2.2 "eq=gamma=0.97,"
clip detail  video3.mp4 4.0  2.0 "eq=gamma=0.98,"
clip walk2   video2.mp4 9.8  1.9 ""
clip items   video2.mp4 27.6 1.7 ""
