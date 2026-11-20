#!/usr/bin/env bash
# videos/ ішіндегі бастапқы видеолардан керек бөліктерді кесіп, тігінен бұрып
# (1080×1920, 30 FPS) public/clips_raw/ ішіне салады. Түс түзету — scripts/color.py.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/clips_raw
clip() { # name src start dur [extra-filter]
  ffmpeg -v error -y -ss "$3" -i "videos/$2" -t "$4" -an \
    -vf "transpose=2,scale=1080:1920,${5}fps=30,format=yuv420p" \
    -c:v libx264 -crf 12 -preset fast "public/clips_raw/$1.mp4"
  echo "ok $1"
}
clip walk1   video2.mp4 5.0  4.4
clip hat     video1.mp4 2.6  4.0
clip green   video4.mp4 0.6  2.2
clip walk2   video2.mp4 9.8  1.9
clip items   video2.mp4 27.6 1.7
clip full    video2.mp4 19.75 2.97 "setpts=PTS/0.58,"
