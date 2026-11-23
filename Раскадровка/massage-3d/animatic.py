"""Аниматик: нақты дауыс + кадр уақыты + титр орны (графика — схема, 3D емес).
Қолдану: python3 animatic.py <voice.mp3> <out.mp4>"""
import os, sys, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
MONT = os.path.join(HERE, "../../.claude/skills/montazh-kz/fonts/Montserrat.ttf")
W, H = 1080, 1920
SAFE = (60, 220, W - 140, H - 380)
GAP_AT, GAP = 19.80, 1.2          # Кадр 6→7: глитч + тыныштық (дауыс 1.2 с кешігеді)
HANDLE = "@ainurana_massaj_ashibulak"

def f(size, wt=700):
    ft = ImageFont.truetype(MONT, size)
    try: ft.set_variation_by_axes([wt])
    except Exception: pass
    return ft

PAL = {"dark": ("#3B4446", "#5E5A52"), "turn": ("#2E3A3C", "#D9A35A"), "spa": ("#0E4A50", "#1C6B6E")}
GOLD, CREAM = "#E2B65A", "#F6E7C8"

# (басы, соңы, атауы, сипаттама, титр, фаза, су белгі)
SHOTS = [
 (0.00, 2.74, "1", "Айна: шаршаған әйел / айнада бақытты нұсқасы", None, "dark", False),
 (2.74, 4.70, "2a", "Ноутбук, қағаздар — «жұмыс»", "ЖҰМЫС", "dark", False),
 (4.70, 5.25, "2b", "Ас үй — «үй»", "ҮЙ", "dark", False),
 (5.25, 6.30, "2c", "Ойыншықтар — «бала-шаға»", "БАЛА-ШАҒА", "dark", False),
 (6.30, 7.80, "2d", "Top-down 90°: тазалық, стикерлер — «тірлік»", "БІТПЕЙТІН ТІРЛІК", "dark", False),
 (7.80, 10.68, "3", "Бәріне көмек → бос орындық → ECU мұңды бет", "АЛ ӨЗІҢЕ ШЕ?", "dark", False),
 (10.68, 14.26, "4", "Мойын/иық/арқа — қызыл glow, orbit", None, "dark", False),
 (14.26, 17.34, "5", "Диван, шай → телефон → ECU", "«КЕЙІН ДЕМАЛАМЫН»", "dark", False),
 (17.34, 20.20, "6", "Күнтізбе, сағат, crane down", "ҚАШАН?", "dark", False),
 (20.20, 20.60, "glitch", "", None, "black", False),
 (20.60, 24.05, "7", "Тыныштық → жарық есік → SPA", "2 САҒАТ", "turn", True),
 (24.05, 25.85, "8a", "МАСТЕР: арқа массажы", "ДЕНЕ", "spa", True),
 (25.85, 27.93, "8b", "МАСТЕР: бет массажы (сіздің сурет)", "+ БЕТ", "spa", True),
 (27.93, 29.94, "9", "SPA интерьері, баға", "PRICE", "spa", True),
 (29.94, 33.20, "10", "Айна алдында жайнап күледі", "ЛАЙЫҚСЫҢ", "spa", True),
 (33.20, 35.30, "11", "SPA креслода шай, телефон төңкерулі", None, "spa", True),
 (35.30, 40.00, "12", "Финал карта", "FINAL", "spa", False),
]

def base(phase):
    im = Image.new("RGB", (W, H), "black")
    if phase == "black": return im
    a, b = PAL[phase]
    d = ImageDraw.Draw(im)
    ca = [int(a[i:i+2], 16) for i in (1, 3, 5)]; cb = [int(b[i:i+2], 16) for i in (1, 3, 5)]
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(ca[k] * (1 - t) + cb[k] * t) for k in range(3)))
    return im

def ctext(d, y, s, ft, fill):
    w = d.textlength(s, font=ft); d.text(((W - w) / 2, y), s, font=ft, fill=fill)

def frame(shot, stage=9):
    t0, t1, name, desc, title, phase, wm = shot
    im = base(phase); d = ImageDraw.Draw(im)
    if phase == "black":
        for y in range(0, H, 7):
            if hash((y, 3)) % 4 == 0: d.line([(0, y), (W, y)], fill="#1d2a44", width=2)
        return im
    d.text((40, 40), "АНИМАТИК — тек уақыт пен титр тексеру", font=f(30, 700), fill="#ffffff88")
    if name not in ("9", "12"):
        cx, cy = W // 2, int(H * 0.50)
        d.ellipse([cx - 150, cy - 190, cx + 150, cy + 190], outline=CREAM, width=6)
        ctext(d, cy - 20, "бет", f(40, 600), CREAM)
        d.rounded_rectangle([cx - 290, cy + 220, cx + 290, H + 40], radius=160, outline=CREAM, width=4)
    if title and title not in ("PRICE", "FINAL"):
        ft = f(84 if len(title) < 12 else 64, 800)
        ctext(d, 330, title, ft, GOLD)
    if title == "PRICE":
        ctext(d, 600, "13 000 ₸", f(170, 800), GOLD)
        ctext(d, 820, "2 сағат • Дене + бет массажы", f(50, 600), CREAM)
        ctext(d, 900, HANDLE, f(36, 600), CREAM)
    if title == "FINAL":
        y = 420
        for i, (s, sz, col) in enumerate([("2 САҒАТ ТОЛЫҚ РЕЛАКС", 66, GOLD), ("ДЕНЕ + БЕТ МАССАЖЫ", 56, CREAM),
                                          ("13 000 ₸", 150, GOLD)]):
            if stage > i: ctext(d, y, s, f(sz, 800), col)
            y += sz + 60
        if stage > 3:
            bw, bh = 640, 130; bx = (W - bw) // 2
            d.rounded_rectangle([bx, y + 20, bx + bw, y + 20 + bh], radius=65, fill=GOLD)
            ctext(d, y + 52, "ҚАЗІР ЖАЗЫЛ!", f(60, 800), "#0E4A50")
            ctext(d, y + 200, "Instagram  " + HANDLE, f(40, 700), CREAM)
    if wm:
        ft = f(28, 600); s = HANDLE; tw = d.textlength(s, font=ft)
        d.text((SAFE[2] - tw, SAFE[1] + 10), s, font=ft, fill="#F6E7C8")
    d.text((70, SAFE[3] - 120), f"КАДР {name}", font=f(44, 800), fill="#ffffffcc")
    d.text((70, SAFE[3] - 64), desc, font=f(30, 500), fill="#ffffffaa")
    return im

def main(voice, out):
    tmp = tempfile.mkdtemp()
    lst = []
    n = 0
    for sh in SHOTS:
        if sh[2] == "12":
            stages = [(35.30, 1), (35.60, 2), (35.90, 3), (36.20, 4), (40.00, None)]
            for (a, st), (b, _) in zip(stages, stages[1:]):
                p = os.path.join(tmp, f"{n:03d}.png"); frame(sh, st).save(p); lst.append((p, b - a)); n += 1
        else:
            p = os.path.join(tmp, f"{n:03d}.png"); frame(sh).save(p); lst.append((p, sh[1] - sh[0])); n += 1
    with open(os.path.join(tmp, "l.txt"), "w") as fh:
        for p, dur in lst: fh.write(f"file '{p}'\nduration {dur:.3f}\n")
        fh.write(f"file '{lst[-1][0]}'\n")
    gap_ms = int(GAP * 1000)
    af = (f"[1:a]atrim=0:{GAP_AT},asetpts=N/SR/TB[a1];[1:a]atrim={GAP_AT},asetpts=N/SR/TB,adelay={gap_ms}[a2];"
          f"[a1][a2]concat=n=2:v=0:a=1,loudnorm=I=-14:TP=-1.5:LRA=11,apad=whole_dur=40[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(tmp, "l.txt"),
                    "-i", voice, "-filter_complex", af, "-map", "0:v", "-map", "[a]",
                    "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "26", "-preset", "fast",
                    "-c:a", "aac", "-b:a", "160k", "-t", "40", out], check=True)
    print(out)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
