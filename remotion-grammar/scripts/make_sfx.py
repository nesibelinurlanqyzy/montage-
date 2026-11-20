"""Генерирует мягкие SFX (whoosh, pop, tick, digital, ding, swoosh, wrong) в public/sfx."""
import numpy as np, wave, os, sys
SR = 48000
out = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(out, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def lp(x, a):  # one-pole lowpass, a in (0,1) per-sample array or scalar
    y = np.zeros_like(x); s = 0.0
    a = np.broadcast_to(a, x.shape)
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y

# soft whoosh: noise through sweeping lowpass with bell envelope
d = 0.7; tt = t(d); n = rng.standard_normal(len(tt))
sweep = 0.02 + 0.25 * np.sin(np.pi * tt / d) ** 2
env = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2
save("whoosh", lp(lp(n, sweep), sweep) * env)

# swoosh (shorter, brighter) for transitions
d = 0.45; tt = t(d); n = rng.standard_normal(len(tt))
sweep = 0.05 + 0.4 * (tt / d)
env = np.sin(np.pi * tt / d) ** 3
save("swoosh", lp(n, sweep) * env)

# subtle pop: sine with fast pitch drop
d = 0.12; tt = t(d)
f = 900 * np.exp(-tt * 30) + 250
ph = 2 * np.pi * np.cumsum(f) / SR
save("pop", np.sin(ph) * np.exp(-tt * 38) * (1 - np.exp(-tt * 2000)))

# light tick: filtered click
d = 0.05; tt = t(d)
x = np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 160) + 0.4 * rng.standard_normal(len(tt)) * np.exp(-tt * 400)
save("tick", x)

# countdown tick (woodier, lower)
d = 0.09; tt = t(d)
x = np.sin(2 * np.pi * 1300 * tt) * np.exp(-tt * 70) + 0.5 * np.sin(2 * np.pi * 650 * tt) * np.exp(-tt * 50)
save("tock", x)

# soft digital: three quick FM blips
d = 0.42; tt = t(d); x = np.zeros_like(tt)
for k, fr in enumerate([880, 1320, 1760]):
    st = k * 0.07; m = tt >= st; u = tt[m] - st
    x[m] += np.sin(2 * np.pi * fr * u + 1.5 * np.sin(2 * np.pi * fr * 2 * u)) * np.exp(-u * 22) * 0.6
save("digital", lp(x, 0.35))

# pleasant ding: bell partials
d = 1.6; tt = t(d)
x = sum(a * np.sin(2 * np.pi * 1046.5 * r * tt) * np.exp(-tt * dk) for a, r, dk in
        [(1, 1, 3), (0.5, 2.0, 4.5), (0.3, 2.76, 6), (0.2, 4.07, 9), (0.4, 1.5, 3.5)])
save("ding", x * (1 - np.exp(-tt * 3000)))

# wrong: soft low double buzz
d = 0.35; tt = t(d); x = np.zeros_like(tt)
for st in (0, 0.16):
    m = tt >= st; u = tt[m] - st
    x[m] += np.sign(np.sin(2 * np.pi * 180 * u)) * np.exp(-u * 18) * 0.5
save("wrong", lp(x, 0.08))

# rise: soft riser for the quiz title
d = 0.9; tt = t(d)
f = 300 + 900 * (tt / d) ** 2
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (tt / d) ** 2 * np.exp(-np.clip(tt - 0.8, 0, None) * 40)
x += 0.3 * lp(rng.standard_normal(len(tt)), 0.1) * (tt / d) ** 3
save("rise", x)
print("ok", sorted(os.listdir(out)))
