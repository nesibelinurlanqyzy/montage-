#!/usr/bin/env python3
"""glass.py — «шыны» стилі: ақшыл пастель фон, шыны карточкалар, градиент кілт сөздер,
төменде иконкалар панелі (прогресс). Дауыс — дайын аудио файл ("audio").

  prep        PLAN.json              -> .matin/<аты>/data.json
  raskadrovka PLAN.json              -> Раскадровка/<аты>_раскадровка.jpg
  render      PLAN.json [--max-mb 90] -> Дайын/<аты>_vN.mp4
  oblozhka    PLAN.json              -> Дайын/<аты>_обложка.jpg
"""
import argparse, difflib, json, os, re, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import mult  # transcribe() қайта қолданамыз

GL = os.path.join(os.path.dirname(HERE), "glass")
FPS = 30
SR = 44100


def load(plan):
    P = json.load(open(plan, encoding="utf-8"))
    wd = os.path.join(".matin", P["name"]); os.makedirs(wd, exist_ok=True)
    return P, wd


norm = mult.norm


def audio_dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True).stdout
    return float(out.strip())


def prep(plan):
    P, wd = load(plan)
    W = mult.transcribe(P["audio"], wd)
    hc, ht = [], []
    for w, s, e in W:
        n = norm(w)
        for k, ch in enumerate(n):
            hc.append(ch); ht.append(s + (e - s) * k / max(1, len(n)))
    words = []
    for si, sc in enumerate(P["scenes"]):
        for m in re.finditer(r"\*([^*]+)\*([^\s*]*)|(\S+)", sc["text"]):
            if m.group(3):
                words.append({"w": m.group(3), "e": False, "s": si}); continue
            ws = m.group(1).split()
            for k, w in enumerate(ws):
                words.append({"w": w + (m.group(2) if k == len(ws) - 1 else ""), "e": True, "s": si})
    uc, uw = [], []
    for i, w in enumerate(words):
        for ch in norm(w["w"]):
            uc.append(ch); uw.append(i)
    sm = difflib.SequenceMatcher(None, uc, hc, autojunk=False)
    ct = [None] * len(uc)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            ct[a + k] = ht[b + k]
    for i, w in enumerate(words):
        ts = [ct[k] for k in range(len(uc)) if uw[k] == i and ct[k] is not None]
        w["t"] = min(ts) if ts else None
    known = [(i, w["t"]) for i, w in enumerate(words) if w["t"] is not None]
    for i, w in enumerate(words):
        if w["t"] is None:
            prv = max([k for k in known if k[0] < i], default=(-1, 0.0))
            nxt = min([k for k in known if k[0] > i], default=(len(words), W[-1][2]))
            w["t"] = prv[1] + (nxt[1] - prv[1]) * (i - prv[0]) / (nxt[0] - prv[0])
    for i in range(1, len(words)):
        words[i]["t"] = max(words[i]["t"], words[i - 1]["t"] + 0.05)
    dur = audio_dur(P["audio"]) + 1.6
    scenes = []
    for si, sc in enumerate(P["scenes"]):
        ws = [w for w in words if w["s"] == si]
        d = {k: v for k, v in sc.items() if k != "text"}
        d["t0"] = max(0.0, ws[0]["t"] - 0.3) if si else 0.0
        d["words"] = [{"w": w["w"], "e": w["e"], "t": round(w["t"], 3)} for w in ws]
        items = []
        for it in sc.get("items", []):
            key = norm(it["on"])
            hit = next((w for w in ws if norm(w["w"]).startswith(key)), None)
            if hit is None:
                sys.exit(f"'{it['on']}' сөзі {si}-сахнада табылмады")
            items.append(dict(it, t=round(hit["t"], 3)))
        d["items"] = items
        scenes.append(d)
    for si, sc in enumerate(scenes):
        sc["t1"] = scenes[si + 1]["t0"] if si + 1 < len(scenes) else dur + 1
    data = {"fps": FPS, "dur": round(dur, 3), "cover": P.get("cover"), "scenes": scenes}
    json.dump(data, open(os.path.join(wd, "data.json"), "w"), ensure_ascii=False)
    for sc in scenes:
        print(f"{sc['t0']:6.2f} {sc['kind']:7s} " + " ".join(f"{w['w']}@{w['t']:.1f}" for w in sc["words"][:5]) + " …")
    return data, wd


# ---------- дыбыс эффектілері ----------
def make_sfx(data, path):
    n = int((data["dur"] + 1) * SR); out = np.zeros(n, np.float32)
    rng = np.random.default_rng(7)

    def add(t, s):
        i = int(t * SR)
        if i < 0 or i >= n: return
        m = min(len(s), n - i); out[i:i + m] += s[:m]

    def whoosh(t, vol=0.10, L=0.45):
        k = int(L * SR); x = rng.standard_normal(k).astype(np.float32)
        # жай сүзгі: жылжымалы орта (жоғары жиілік азаяды)
        x = np.convolve(x, np.ones(18) / 18, "same")
        env = np.sin(np.linspace(0, np.pi, k)) ** 2
        add(t - L * 0.45, x * env * vol * 4)

    def pop(t, vol=0.16, f=880):
        k = int(0.12 * SR); tt = np.arange(k) / SR
        s = np.sin(2 * np.pi * (f + 500 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 38)
        add(t, (s * vol).astype(np.float32))

    def click(t, vol=0.2):
        k = int(0.03 * SR); tt = np.arange(k) / SR
        add(t, (rng.standard_normal(k) * np.exp(-tt * 300) * vol).astype(np.float32))

    for si, sc in enumerate(data["scenes"]):
        if si: whoosh(sc["t0"] + 0.05)
        for j, it in enumerate(sc["items"]):
            if sc["kind"] in ("list",) and j == 0: continue
            if sc["kind"] == "cta": click(it["t"] + 0.1); continue
            pop(it["t"], f=700 + 90 * j)
    out = np.clip(out, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())


def node(*args, stdout=None):
    return subprocess.Popen(["node", os.path.join(GL, "render.js"), *args], stdout=stdout)


def raskadrovka(plan):
    P, wd = load(plan)
    data, _ = prep(plan)
    ts = []
    for sc in data["scenes"]:
        last = sc["words"][-1]["t"]
        if sc["kind"] in ("list", "chips"):  # ортасы + соңы
            ts.append(round((sc["items"][1]["t"] + sc["items"][2]["t"]) / 2 + 0.3, 2))
        ts.append(round(min(sc["t1"] - 0.15, last + 0.45), 2))
    fd = os.path.join(wd, "rf"); os.makedirs(fd, exist_ok=True)
    for f in os.listdir(fd): os.remove(os.path.join(fd, f))
    node(os.path.join(wd, "data.json"), "frames", ",".join(map(str, ts)), fd).wait()
    os.makedirs("Раскадровка", exist_ok=True)
    out = f"Раскадровка/{P['name']}_раскадровка.jpg"
    n = len(ts); cols = 3 if n <= 9 else 4
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(fd, "f%02d.jpg"),
                    "-vf", f"scale=360:640,pad=376:656:8:8:color=0x2b2b2b,tile={cols}x{(n + cols - 1) // cols}:color=0x2b2b2b",
                    "-frames:v", "1", "-q:v", "3", out], check=True)
    print(out, ts)


def oblozhka(plan):
    P, wd = load(plan)
    data, _ = prep(plan)
    os.makedirs("Дайын", exist_ok=True)
    out = f"Дайын/{P['name']}_обложка.jpg"
    node(os.path.join(wd, "data.json"), "cover", out).wait()
    print(out)


def render(plan, max_mb):
    P, wd = load(plan)
    data, _ = prep(plan)
    os.makedirs("Дайын", exist_ok=True)
    v = 1
    while os.path.exists(f"Дайын/{P['name']}_v{v}.mp4"): v += 1
    out = f"Дайын/{P['name']}_v{v}.mp4"
    sfx = os.path.join(wd, "sfx.wav"); make_sfx(data, sfx)
    br = int(min(12000, max_mb * 8 * 1024 * 0.92 / data["dur"] - 192))
    pr = node(os.path.join(wd, "data.json"), "video", stdout=subprocess.PIPE)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                    "-i", P["audio"], "-i", sfx, "-filter_complex",
                    "[1:a]aresample=44100,apad[v];[2:a]aresample=44100[s];[v][s]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]",
                    "-map", "0:v", "-map", "[a]",
                    "-c:v", "libx264", "-preset", "medium", "-b:v", f"{br}k", "-maxrate", f"{br}k", "-bufsize", f"{2 * br}k",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out],
                   stdin=pr.stdout, check=True)
    pr.wait()
    print(out, round(os.path.getsize(out) / 1024 / 1024, 1), "MB")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("cmd"); ap.add_argument("plan"); ap.add_argument("--max-mb", type=float, default=90)
    a = ap.parse_args()
    {"prep": lambda: prep(a.plan), "raskadrovka": lambda: raskadrovka(a.plan),
     "render": lambda: render(a.plan, a.max_mb), "oblozhka": lambda: oblozhka(a.plan)}[a.cmd]()
