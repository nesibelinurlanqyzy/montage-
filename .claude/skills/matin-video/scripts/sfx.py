"""sfx.py — синтезделген дыбыс эффектілері (файлсыз): pop, whoosh, tick, stamp, cash, click, swish, sparkle."""
import numpy as np, wave

SR = 48000


def _t(d): return np.arange(int(SR * d)) / SR


def _sweep(f0, f1, d):
    t = _t(d); f = f0 * (f1 / f0) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def _noise(d, seed):
    return np.random.default_rng(seed).standard_normal(int(SR * d))


def _lp(x, a):  # one-pole lowpass
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a * (v - acc); y[i] = acc
    return y


def make(kind, seed=0):
    rng = np.random.default_rng(seed)
    if kind == "pop":
        d = 0.09; k = rng.uniform(0.85, 1.2)
        return 0.55 * _sweep(950 * k, 420 * k, d) * np.exp(-_t(d) * 45)
    if kind == "click":
        d = 0.03; return 0.5 * _sweep(1500, 900, d) * np.exp(-_t(d) * 150)
    if kind == "tick":
        d = 0.025; return 0.35 * np.sin(2 * np.pi * 2300 * _t(d)) * np.exp(-_t(d) * 220)
    if kind in ("whoosh", "swish"):
        d = 0.42 if kind == "whoosh" else 0.25
        n = _noise(d, seed); t = _t(d)
        env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
        hi = n - _lp(n, 0.08)
        x = _lp(hi, 0.35) * env
        return 0.35 * x / (np.abs(x).max() + 1e-9)
    if kind == "stamp":
        d = 0.22; t = _t(d)
        thump = np.sin(2 * np.pi * np.cumsum(np.linspace(160, 60, len(t))) / SR) * np.exp(-t * 22)
        nz = _lp(_noise(d, seed), 0.25) * np.exp(-t * 60)
        return 0.7 * thump + 0.25 * nz / (np.abs(nz).max() + 1e-9)
    if kind == "cash":
        d = 0.6; t = _t(d); x = np.zeros_like(t)
        for f, off in ((1568, 0.0), (2093, 0.07)):
            m = t >= off; tt = t[m] - off
            x[m] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 7) + 0.3 * np.sin(2 * np.pi * f * 2.01 * tt) * np.exp(-tt * 12)
        return 0.28 * x
    if kind == "sparkle":
        d = 0.6; t = _t(d); x = np.zeros_like(t)
        for i, f in enumerate((1760, 2217, 2637, 3520)):
            off = i * 0.06; m = t >= off; tt = t[m] - off
            x[m] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9)
        return 0.16 * x
    return np.zeros(1)


def track(events, dur, out, gain=1.0):
    y = np.zeros(int(SR * (dur + 1)))
    last = -9
    for i, (t, kind) in enumerate(events):
        if kind in ("pop", "tick", "click") and t - last < 0.12:
            continue
        s = make(kind, i); a = int(t * SR)
        if a >= len(y): continue
        s = s[: len(y) - a]; y[a:a + len(s)] += s * gain
        if kind in ("pop", "tick", "click"): last = t
    y = np.clip(y, -1, 1)
    w = wave.open(out, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes()); w.close()
