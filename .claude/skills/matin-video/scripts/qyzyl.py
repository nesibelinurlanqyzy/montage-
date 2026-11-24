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
        sfx(d, wd, d["dur"])
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


def sfx(d, wd, dur):
    """Жұмсақ дыбыс эффектілері (музыкасыз): ауысу — вжух, маңызды сөз — поп, мөр, баға, басу."""
    import numpy as np, wave
    sr = 44100; n = int((dur + 1) * sr); out = np.zeros(n, np.float32); rng = np.random.default_rng(1)
    def put(t, x, g):
        i = int(max(0, t) * sr); x = x[: n - i]; out[i:i + len(x)] += x * g
    def env(L, a, dcy):
        tt = np.arange(int(L * sr)) / sr; return np.minimum(1, tt / a) * np.exp(-tt / dcy), tt
    def whoosh():
        e, tt = env(.45, .18, .12); x = rng.standard_normal(len(tt)).astype(np.float32)
        k = np.linspace(.02, .3, len(tt)); y = np.zeros_like(x); acc = 0.0
        for i in range(len(x)): acc += k[i] * (x[i] - acc); y[i] = acc
        return y * e * 3
    def pop(f=880):
        e, tt = env(.12, .002, .03); return np.sin(2 * np.pi * (f + 600 * np.exp(-tt * 60)) * tt) * e
    def thump():
        e, tt = env(.35, .002, .08); return (np.sin(2 * np.pi * (60 + 120 * np.exp(-tt * 30)) * tt) + .3 * rng.standard_normal(len(tt)) * np.exp(-tt * 40)) * e
    def ding():
        e, tt = env(1.2, .002, .35); return (np.sin(2 * np.pi * 1318 * tt) + .5 * np.sin(2 * np.pi * 1976 * tt) + .25 * np.sin(2 * np.pi * 2637 * tt)) * e * .6
    def click():
        e, tt = env(.03, .0005, .006); return rng.standard_normal(len(tt)) * e
    W = lambda sc, stem, dflt: next((w["t"] for w in sc["words"] if norm(w["w"]).startswith(norm(stem))), dflt)
    for i, sc in enumerate(d["scenes"]):
        if i: put(sc["t0"] - .25, whoosh(), .22)
        last = None
        for w in sc["words"]:
            if w["e"] and last is not True: put(w["t"], pop(700 + 120 * (i % 3)), .16)
            last = w["e"]
        if sc["id"] == "team": put(W(sc, "қажеті", sc["t0"] + 3) + .26, thump(), .55)
        if sc["id"] == "ai":
            for k in range(14): put(sc["t0"] + .25 + k * .075, click(), .12)
        if sc["id"] == "price": put(W(sc, "небәрі", sc["t0"] + 2) + .37, thump(), .45); put(W(sc, "небәрі", sc["t0"] + 2) + .4, ding(), .25)
        if sc["id"] == "cta": put(W(sc, "подробнее", sc["t0"] + 3) + 1.15, pop(1400), .25)
    out = np.clip(out, -1, 1); f = os.path.join(wd, "sfx.wav")
    w = wave.open(f, "w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out * 32000).astype(np.int16).tobytes()); w.close()


def norm(s):
    return re.sub(r"[^0-9a-zа-яёәғқңөұүһі]", "", s.lower())


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
