"""Әр фото мен видеоға жеке, жұмсақ Color Correction.
- ақ нүктені бейтараптайды (ақ киім сарғаймайды), шектеулі ±6%
- экспозицияны көтереді (тек қараңғы кадрларда), көлеңкені сәл ашады
- түссіз (flat) кадрларға аздап vibrance; қанық кадрларға — жоқ
Оригинал файлдар өзгермейді: photos/ → public/photos/, public/clips_raw/ → public/clips/
"""
import cv2, numpy as np, subprocess, json, sys, os, glob, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

def analyze(img):
    img = cv2.resize(img, (540, int(540 * img.shape[0] / img.shape[1])))
    f = img.astype(np.float32) / 255.0
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    y = 0.299 * r + 0.587 * g + 0.114 * b
    p2, med, p995 = np.percentile(y, [2, 50, 99.5])
    mx, mn = f.max(2), f.min(2)
    m = (y > np.percentile(y, 85)) & ((mx - mn) < 0.10 * mx + 0.02)
    wb = (r[m].mean(), g[m].mean(), b[m].mean()) if m.sum() > 300 else None
    sat = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)[..., 1].mean() / 255.0
    return dict(p2=float(p2), med=float(med), p995=float(p995), wb=wb, sat=float(sat))

def params(a):
    base = min(1.0, max(0.62, a["p995"] / 0.96))          # ақ нүкте → ~0.96
    gains = [1.0, 1.0, 1.0]
    if a["wb"]:
        r, g, b = a["wb"]; avg = (r + g + b) / 3
        if max(abs(c / avg - 1) for c in (r, g, b)) > 0.09:   # бұл ақ емес, түсті зат — тимейміз
            a = dict(a, wb=None)
    if a["wb"]:
        r, g, b = a["wb"]; avg = (r + g + b) / 3
        gains = [min(1.06, max(0.94, (c / avg) ** 0.6)) for c in (r, g, b)]
    imax = [min(1.0, base * k) for k in gains]
    med1 = min(0.95, a["med"] / base)
    target = med1 + 0.5 * (0.5 - med1) if med1 < 0.46 else med1
    gamma = 1.0 if target <= med1 else max(1.0, min(1.55, math.log(med1) / math.log(target)))
    lift = 0.03 if a["p2"] < 0.03 else (0.015 if a["p2"] < 0.08 else 0.0)
    vib = 0.15 if a["sat"] < 0.28 else (0.08 if a["sat"] < 0.42 else 0.0)
    return dict(imax=[round(x, 3) for x in imax], gamma=round(gamma, 3), lift=lift, vib=vib)

def vf(p):
    r, g, b = p["imax"]
    s = f"colorlevels=rimax={r}:gimax={g}:bimax={b}"
    if p["gamma"] > 1.0: s += f",eq=gamma={p['gamma']}"
    if p["lift"] > 0:
        l = p["lift"]; s += f",curves=all='0/{l/2:.3f} 0.15/{0.15+l:.3f} 0.5/{0.5+l/3:.3f} 1/1'"
    if p["vib"] > 0: s += f",vibrance=intensity={p['vib']}"
    return s

def run(cmd): subprocess.run(cmd, check=True)

report = {}
os.makedirs("public/photos", exist_ok=True)
for src in sorted(glob.glob("photos/*.jpeg")):
    a = analyze(cv2.imread(src)); p = params(a)
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", vf(p), "-q:v", "2", "public/" + src])
    report[src] = dict(before=a, params=p)
os.makedirs("public/clips", exist_ok=True)
for src in sorted(glob.glob("public/clips_raw/*.mp4")):
    cap = cv2.VideoCapture(src); n = int(cap.get(7))
    stats = []
    for k in (0.2, 0.5, 0.8):
        cap.set(1, int(n * k)); ok, fr = cap.read()
        if ok: stats.append(analyze(fr))
    a = {key: float(np.mean([s[key] for s in stats])) for key in ("p2", "med", "p995", "sat")}
    wbs = [s["wb"] for s in stats if s["wb"]]
    a["wb"] = tuple(np.mean(wbs, 0)) if wbs else None
    p = params(a)
    out = src.replace("clips_raw", "clips")
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", vf(p) + ",format=yuv420p", "-c:v", "libx264", "-crf", "14", "-preset", "fast", out])
    report[src] = dict(before=a, params=p)
for k, v in report.items():
    print(f"{k:45s} med {v['before']['med']:.2f} p99.5 {v['before']['p995']:.2f} → {vf(v['params'])}")
