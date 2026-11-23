"""Дыбыс: дауыс + жұмсақ фон (пиано-арпеджио) + SFX → audio.wav"""
import numpy as np, subprocess, wave, json, sys
SR = 48000; DUR = 38.2
voice_src = sys.argv[1]; out = sys.argv[2]
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", voice_src, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
v = np.frombuffer(raw, np.float32)
n = int(DUR * SR); mix_v = np.zeros(n, np.float32); mix_v[:min(n, len(v))] = v[:n]
t = np.arange(n) / SR
def tone(f, d, a=0.3, dec=3.0):
    tt = np.arange(int(d * SR)) / SR
    return (np.sin(2*np.pi*f*tt) + 0.35*np.sin(4*np.pi*f*tt) + 0.1*np.sin(6*np.pi*f*tt)) * np.exp(-tt*dec) * a * np.clip(tt/0.005, 0, 1)
def put(buf, sig, at):
    i = int(at * SR); j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j-i]
mus = np.zeros(n, np.float32)
# 1-бөлім (0–19.8): минор, баяу; 2-бөлім: мажор, жылы
A = [[220.0, 261.6, 329.6, 392.0], [174.6, 220.0, 261.6, 329.6], [196.0, 246.9, 293.7, 392.0], [164.8, 207.7, 246.9, 329.6]]
B = [[261.6, 329.6, 392.0, 523.3], [220.0, 261.6, 329.6, 440.0], [174.6, 220.0, 261.6, 349.2], [196.0, 246.9, 293.7, 392.0]]
step = 0.375
k = 0; tm = 0.0
while tm < DUR:
    prog = A if tm < 19.8 else B
    ch = prog[int(tm // 3.0) % 4]
    put(mus, tone(ch[k % 4] * (1 if tm < 19.8 else 1), 1.6, 0.16, 2.2), tm)
    if k % 8 == 0: put(mus, tone(ch[0] / 2, 3.0, 0.22, 0.9), tm)
    k += 1; tm += step
# тыныштық: 19.3–19.8 музыка сөнеді
fade = np.ones(n, np.float32); i0, i1 = int(19.2*SR), int(19.85*SR); fade[i0:i1] = np.linspace(1, 0.05, i1-i0); fade[i1:int(20.4*SR)] = np.linspace(0.05, 1, int(20.4*SR)-i1)
mus *= fade
sfx = np.zeros(n, np.float32)
D = json.load(open("Мәтін/massage-2d/data.json"))
for i, sc in enumerate(D["scenes"][1:], 1):  # әр сахнаға жұмсақ «поп»
    put(sfx, tone(880, 0.12, 0.10, 30), sc["s"])
# телефон шыры (5-сахна «кейін»)
tk = [w["s"] for w in D["scenes"][4]["words"] if w["w"].startswith("«кейін")][0] - 0.1
for r in range(6):
    put(sfx, tone(1318.5 if r % 2 == 0 else 1046.5, 0.12, 0.09, 8), tk + r * 0.13)
# есік: жарқыл-шыңғыр
for j, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
    put(sfx, tone(f, 1.5, 0.10, 2.5), D["scenes"][6]["s"] + j * 0.07)
# сағат тықылы (6-сахна)
for b in np.arange(D["scenes"][5]["s"], D["scenes"][5]["e"], 0.25):
    put(sfx, tone(2400, 0.03, 0.05, 80), b)
# финал батырма
for j, f in enumerate([784.0, 1046.5, 1318.5]):
    put(sfx, tone(f, 1.2, 0.10, 3), D["scenes"][11]["s"] + 0.9 + j * 0.06)
# дауыс шыққанда музыка төмендейді (ducking)
env = np.convolve(np.abs(mix_v), np.ones(4800) / 4800, "same"); duck = 1 - 0.55 * np.clip(env / (np.percentile(env, 90) + 1e-6), 0, 1)
vnorm = mix_v / (np.percentile(np.abs(mix_v), 99.5) + 1e-6) * 0.5
final = vnorm + mus * duck * 0.55 + sfx
final = np.stack([final, final], 1).astype(np.float32)
open("/tmp/claude-0/mix.f32", "wb").write(final.tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "/tmp/claude-0/mix.f32",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", out], check=True)
print(out)
