#!/usr/bin/env python3
"""qyzyl.py — референс стилі: қызыл / кілегей / көкжасыл коллаж, сөзбе-сөз заголовок, әр сахнаға жеке анимация.
Дауыс — пайдаланушының өз жазбасы (plan["audio"]). Дауыс жоқ болса, раскадровка болжамды уақытпен жасалады.

  raskadrovka PLAN.json            -> Раскадровка/<аты>_раскадровка.jpg
  render      PLAN.json [--max-mb 90] -> Дайын/<аты>_vN.mp4
"""
import argparse, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mult

HERE = os.path.dirname(os.path.abspath(__file__))
QZ = os.path.join(os.path.dirname(HERE), "qyzyl")
FPS = 30


def words_of(P):
    out = []
    for si, sc in enumerate(P["scenes"]):
        for m in re.finditer(r"\*([^*]+)\*([^\s*]*)|(\S+)", sc["text"]):
            if m.group(3):
                out.append({"w": m.group(3), "e": False, "s": si}); continue
            ws = m.group(1).split()
            for k, w in enumerate(ws):
                out.append({"w": w, "e": True, "s": si, "p": m.group(2) if k == len(ws) - 1 else ""})
    return out


def prep(plan):
    P, wd = mult.load(plan)
    audio = P.get("audio")
    if audio and os.path.exists(audio):
        P2 = dict(P); P2["scenes"] = [dict(s, card="", label="") for s in P["scenes"]]
        json.dump(P2, open(os.path.join(wd, "_m.json"), "w"), ensure_ascii=False)
        d, _ = mult.prep(os.path.join(wd, "_m.json"))
        for s, src in zip(d["scenes"], P["scenes"]):
            s["id"] = src["id"]
        d["audio"] = audio
    else:  # болжамды уақыт: ~2.5 сөз/сек, сахна арасы 0.35 с
        ws = words_of(P); t = 0.3; scenes = []
        for si, sc in enumerate(P["scenes"]):
            sw = [w for w in ws if w["s"] == si]; t0 = max(0, t - 0.25)
            for w in sw:
                w["t"] = round(t, 3); t += 0.25 + 0.045 * len(w["w"])
            scenes.append({"id": sc["id"], "t0": 0.0 if si == 0 else t0, "words": sw})
            t += 0.35
        for i, s in enumerate(scenes):
            s["t1"] = scenes[i + 1]["t0"] if i + 1 < len(scenes) else t + 1.2
        d = {"fps": FPS, "dur": round(t + 1.2, 3), "scenes": scenes, "audio": None}
    json.dump(d, open(os.path.join(wd, "qdata.json"), "w"), ensure_ascii=False)
    return P, wd, d


def node(*args, stdout=None):
    return subprocess.Popen(["node", os.path.join(QZ, "render.js"), *args], stdout=stdout)


def raskadrovka(plan):
    P, wd, d = prep(plan)
    ts = []
    for s in d["scenes"]:
        last = s["words"][-1]["t"]
        if s["id"] in ("team", "test", "price"):  # ортасы + соңы
            mid = s["words"][int(len(s["words"]) * 0.55)]["t"]
            ts.append(round(mid + 0.35, 2))
        ts.append(round(min(s["t1"] - 0.2, last + 1.0), 2))
    fd = os.path.join(wd, "rf"); os.makedirs(fd, exist_ok=True)
    for f in os.listdir(fd): os.remove(os.path.join(fd, f))
    node(os.path.join(wd, "qdata.json"), "frames", ",".join(map(str, ts)), fd).wait()
    os.makedirs("Раскадровка", exist_ok=True)
    out = f"Раскадровка/{P['name']}_раскадровка.jpg"
    n = len(ts); cols = 3 if n <= 9 else 4
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(fd, "f%02d.jpg"),
                    "-vf", f"scale=360:640,pad=376:656:8:8:color=0x2b2b2b,tile={cols}x{(n + cols - 1) // cols}:color=0x2b2b2b",
                    "-frames:v", "1", "-q:v", "3", out], check=True)
    print(out, ts)


def render(plan, max_mb):
    P, wd, d = prep(plan)
    if not d.get("audio"):
        sys.exit("ҚАТЕ: дауыс файлы жоқ (plan['audio'])")
    os.makedirs("Дайын", exist_ok=True)
    v = 1
    while os.path.exists(f"Дайын/{P['name']}_v{v}.mp4"): v += 1
    out = f"Дайын/{P['name']}_v{v}.mp4"
    br = int(min(12000, max_mb * 8 * 1024 * 0.92 / d["dur"] - 192))
    sfx = os.path.join(wd, "sfx.wav")
    if os.path.exists(sfx):
        af = ["-i", sfx, "-filter_complex", "[1:a]apad[v];[2:a]volume=0.5[s];[v][s]amix=inputs=2:duration=first:normalize=0[a]"]
    else:
        af = ["-filter_complex", "[1:a]apad[a]"]
    pr = node(os.path.join(wd, "qdata.json"), "video", "", "", stdout=subprocess.PIPE)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                    "-i", d["audio"], *af, "-map", "0:v", "-map", "[a]", "-t", str(d["dur"]),
                    "-c:v", "libx264", "-preset", "medium", "-b:v", f"{br}k", "-maxrate", f"{br}k", "-bufsize", f"{2 * br}k",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], stdin=pr.stdout)
    pr.wait()
    print(out, os.path.getsize(out) // 1024 // 1024, "MB")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("cmd"); ap.add_argument("plan"); ap.add_argument("--max-mb", type=float, default=90)
    a = ap.parse_args()
    {"prep": lambda: prep(a.plan), "raskadrovka": lambda: raskadrovka(a.plan), "render": lambda: render(a.plan, a.max_mb)}[a.cmd]()
