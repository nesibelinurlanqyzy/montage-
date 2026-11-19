#!/usr/bin/env python3
"""kinetic.py — «kinetic 3D» стилі: үлкен 3D жазулар әріп-әріппен ұшып келеді, фон сахна сайын ауысады
(крем / қара / қызыл / көк), ұшып жүрген текшелер, 3D объектілер (сақина, жұлдыз, нысана, толқын, промпт, батырма).
Дауыс — пайдаланушының дайын аудиосы. Экрандағы мәтін = дауыстағы мәтін (жолдарға бөлінген).

  prep        PLAN.json              -> .matin/<аты>/data.json
  raskadrovka PLAN.json              -> Раскадровка/<аты>_раскадровка.jpg
  render      PLAN.json [--max-mb 90] -> Дайын/<аты>_vN.mp4

Жол белгілері: «#» басында — алып жол, «_» — кіші жол, «~» — контур (тізім) жол;
*сөз* — акцент түс, [сөз] — плашка.
"""
import argparse, difflib, json, os, re, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
KIN = os.path.join(os.path.dirname(HERE), "kinetic")
FPS = 30
TOK = re.compile(r"\*([^*]+)\*(\S*)|\[([^\]]+)\](\S*)|(\S+)")


def norm(s):
    return re.sub(r"[^0-9a-zа-яёәғқңөұүһі]", "", s.lower())


def load(plan):
    P = json.load(open(plan, encoding="utf-8"))
    wd = os.path.join(".matin", P["name"]); os.makedirs(wd, exist_ok=True)
    return P, wd


def transcribe(audio, wd):
    f = os.path.join(wd, "whisper_words.json")
    if os.path.exists(f):
        return json.load(open(f, encoding="utf-8"))
    from faster_whisper import WhisperModel
    w16 = os.path.join(wd, "a16.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", audio, "-ar", "16000", "-ac", "1", w16], check=True)
    wv = wave.open(w16); a = np.frombuffer(wv.readframes(wv.getnframes()), np.int16).astype(np.float32) / 32768
    segs, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(a, language="kk", word_timestamps=True)
    W = [[x.word.strip(), x.start, x.end] for s in segs for x in s.words]
    json.dump(W, open(f, "w"), ensure_ascii=False)
    return W


def parse_line(line):
    size, style = "n", "n"
    while line[:1] in "#_~":
        c, line = line[0], line[1:]
        if c == "#": size = "big"
        elif c == "_": size = "small"
        else: style = "out"
    words = []
    for m in TOK.finditer(line):
        if m.group(5):
            words.append({"w": m.group(5)})
        else:
            inner, tail = (m.group(1), m.group(2)) if m.group(1) else (m.group(3), m.group(4))
            ws = inner.split()
            for k, w in enumerate(ws):
                d = {"w": w + (tail if k == len(ws) - 1 else "")}
                d["acc" if m.group(1) else "plate"] = True
                words.append(d)
    return {"size": size, "style": style, "words": words}


def prep(plan):
    P, wd = load(plan)
    lead = P.get("lead", 0.2)
    audio = os.path.join(wd, "voice.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", P["audio"], "-af", f"adelay={int(lead*1000)}", "-ac", "1", "-ar", "48000", audio], check=True)
    W = transcribe(P["audio"], wd)
    hc, ht = [], []
    for w, s, e in W:
        n = norm(w)
        for k, ch in enumerate(n):
            hc.append(ch); ht.append(s + (e - s) * k / max(1, len(n)))
    scenes, words = [], []
    for si, sc in enumerate(P["scenes"]):
        lines = [parse_line(l) for l in sc["lines"]]
        scenes.append({"bg": sc.get("bg", "cream"), "fx": sc.get("fx", {}), "lines": lines})
        for l in lines:
            for w in l["words"]:
                w["s"] = si; words.append(w)
    uc, uw = [], []
    for i, w in enumerate(words):
        for ch in norm(w["w"]):
            uc.append(ch); uw.append(i)
    ct = [None] * len(uc)
    for a, b, n in difflib.SequenceMatcher(None, uc, hc, autojunk=False).get_matching_blocks():
        for k in range(n):
            ct[a + k] = ht[b + k]
    hit = sum(c is not None for c in ct) / max(1, len(ct))
    print(f"мәтін мен дауыс сәйкестігі: {hit*100:.0f}%")
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
    for w in words:
        w["t"] = round(w["t"] + lead, 3); w.pop("s")
    # аудио қаттылығы (толқын үшін)
    wv = wave.open(audio); a = np.frombuffer(wv.readframes(wv.getnframes()), np.int16).astype(np.float32) / 32768
    sr = wv.getframerate(); hop = sr // FPS
    rms = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a), hop)])
    env = np.clip(rms / (np.percentile(rms, 95) + 1e-6), 0, 1.2)
    dur = len(a) / sr + P.get("tail", 1.6)
    for si, sc in enumerate(scenes):
        first = sc["lines"][0]["words"][0]["t"]
        sc["t0"] = 0.0 if si == 0 else round(first - 0.12, 3)
    for si, sc in enumerate(scenes):
        sc["t1"] = scenes[si + 1]["t0"] if si + 1 < len(scenes) else round(dur, 3)
        sc["tl"] = max(w["t"] for l in sc["lines"] for w in l["words"])
    data = {"fps": FPS, "dur": round(dur, 3), "label": P.get("label", ""), "env": [round(float(x), 3) for x in env], "scenes": scenes}
    json.dump(data, open(os.path.join(wd, "data.json"), "w"), ensure_ascii=False)
    for si, sc in enumerate(scenes):
        txt = " | ".join(" ".join(f"{w['w']}@{w['t']:.1f}" for w in l["words"]) for l in sc["lines"])
        print(f"{si+1:2d} {sc['t0']:5.1f}–{sc['t1']:5.1f} {sc['bg']:5s} {txt}")
    return data, wd


def node(*args, stdout=None):
    return subprocess.Popen(["node", os.path.join(KIN, "render.js"), *args], stdout=stdout)


def raskadrovka(plan):
    P, wd = load(plan)
    data, _ = prep(plan)
    ts = [round(min(sc["t1"] - 0.1, sc["tl"] + 0.7), 2) for sc in data["scenes"]]
    fd = os.path.join(wd, "rf"); os.makedirs(fd, exist_ok=True)
    for f in os.listdir(fd): os.remove(os.path.join(fd, f))
    node(os.path.join(wd, "data.json"), "frames", ",".join(map(str, ts)), fd).wait()
    os.makedirs("Раскадровка", exist_ok=True)
    out = f"Раскадровка/{P['name']}_раскадровка.jpg"
    n = len(ts); cols = 3 if n <= 9 else 4 if n <= 12 else 5
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(fd, "f%02d.jpg"),
                    "-vf", f"scale=360:640,pad=376:656:8:8:color=0x2b2b2b,tile={cols}x{(n + cols - 1) // cols}:color=0x2b2b2b",
                    "-frames:v", "1", "-q:v", "3", out], check=True)
    print(out)


def sfx(data, path, sr=48000):
    n = int(data["dur"] * sr) + sr
    out = np.zeros(n, np.float32)
    rng = np.random.default_rng(7)

    def add(t, s, v):
        i = int(t * sr)
        if 0 <= i < n:
            m = min(len(s), n - i); out[i:i + m] += s[:m] * v

    # whoosh: сүзілген шу, жоғарыдан төмен
    L = int(0.35 * sr); x = rng.standard_normal(L).astype(np.float32)
    k = np.linspace(0, 1, L)
    wh = np.zeros(L, np.float32); a = 0.0
    for i in range(L):
        c = 0.02 + 0.25 * (1 - k[i]) ** 2
        a += c * (x[i] - a); wh[i] = a
    wh *= np.sin(np.pi * k) ** 1.5; wh /= np.abs(wh).max()
    # тик: қысқа клик
    tl = np.arange(int(0.03 * sr)) / sr
    tick = (np.sin(2 * np.pi * 2400 * tl) * np.exp(-tl * 160)).astype(np.float32)
    # boom
    bl = np.arange(int(0.6 * sr)) / sr
    boom = (np.sin(2 * np.pi * (55 + 40 * np.exp(-bl * 12)) * bl) * np.exp(-bl * 5)).astype(np.float32)
    for si, sc in enumerate(data["scenes"]):
        add(max(0, sc["t0"] - 0.12), wh, 0.22)
        if si == 0 or sc["fx"].get("type") in ("star", "target", "cta"):
            add(sc["t0"], boom, 0.35)
        for l in sc["lines"]:
            for w in l["words"]:
                add(w["t"], tick, 0.05)
    out = np.clip(out, -1, 1)
    with wave.open(path, "w") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr)
        f.writeframes((out * 32767).astype(np.int16).tobytes())


def render(plan, max_mb):
    P, wd = load(plan)
    data, _ = prep(plan)
    os.makedirs("Дайын", exist_ok=True)
    v = 1
    while os.path.exists(f"Дайын/{P['name']}_v{v}.mp4"): v += 1
    out = f"Дайын/{P['name']}_v{v}.mp4"
    sx = os.path.join(wd, "sfx.wav"); sfx(data, sx)
    br = int(min(12000, max_mb * 8 * 1024 * 0.92 / data["dur"] - 192))
    inputs = ["-i", os.path.join(wd, "voice.wav"), "-i", sx]
    mix = "[1:a]volume=1.0[v];[2:a]volume=1.0[s]"
    amix = "[v][s]"; na = 2
    if P.get("music"):
        inputs += ["-stream_loop", "-1", "-i", P["music"]]
        mix += f";[3:a]volume={P.get('music_volume', 0.12)}[m]"; amix += "[m]"; na = 3
    mix += f";{amix}amix=inputs={na}:normalize=0:duration=first,apad,atrim=0:{data['dur']}[a]"
    pr = node(os.path.join(wd, "data.json"), "video", "", "", stdout=subprocess.PIPE)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                    *inputs, "-filter_complex", mix, "-map", "0:v", "-map", "[a]",
                    "-c:v", "libx264", "-preset", "medium", "-b:v", f"{br}k", "-maxrate", f"{br}k", "-bufsize", f"{2 * br}k",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out],
                   stdin=pr.stdout)
    pr.wait()
    print(out, os.path.getsize(out) // 1024 // 1024, "MB")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("cmd"); ap.add_argument("plan"); ap.add_argument("--max-mb", type=float, default=90)
    a = ap.parse_args()
    {"prep": lambda: prep(a.plan), "raskadrovka": lambda: raskadrovka(a.plan), "render": lambda: render(a.plan, a.max_mb)}[a.cmd]()
