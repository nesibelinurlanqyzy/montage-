"""12 кадрдың схемалық раскадровкасы: таймкод, камера, титр орны, Reels safe zone."""
from PIL import Image, ImageDraw, ImageFont
import os

F = os.path.join(os.path.dirname(__file__), "../../.claude/skills")
MONT = os.path.join(F, "montazh-kz/fonts/Montserrat.ttf")
SERIF = os.path.join(F, "matin-video/fonts/PTSerifBold.ttf")

def font(p, s, w=None):
    f = ImageFont.truetype(p, s)
    if w:
        try: f.set_variation_by_axes([w])
        except Exception: pass
    return f

# (таймкод, озвучка, көрініс, камера, титр, титр орны 0..1, палитра-кезең)
SHOTS = [
 ("0.0–4.0", "Соңғы рет қашан өзің үшін өмір сүрдің?", "Айна алдында шаршаған әйел; айнада — бақытты нұсқасы", "Slow dolly-in → бет", "—", None, "dark"),
 ("4.0–10.5", "Таңнан кешке дейін жұмыс, үй, бала-шаға, бітпейтін тірлік…", "4 жылдам кесінді: ноутбук / ас үй / ойыншық / тазалық", "Whip-pan + top-down 90°", "ЖҰМЫС • ҮЙ • БАЛА-ШАҒА", 0.18, "dark"),
 ("10.5–14.5", "Бәріне уақытың бар. Ал өзіңе ше?", "Бәріне көмектеседі; бос орындыққа отыра бергенде — шақырады", "Tracking → симметр. ECU", "АЛ ӨЗІҢЕ ШЕ?", 0.16, "dark"),
 ("14.5–19.0", "Мойның ауырады, арқаң талады, денең шаршайды…", "Мойнын ұстайды; мойын-иық-арқада қызыл glow", "Orbit → арқа", "—", None, "dark"),
 ("19.0–23.0", "Бірақ сен бәрібір «кейін демаламын» деп жүрсің.", "Диван, шай; көзін жұмады — телефон шырылдайды", "Push-in → бетке ECU (соққы)", "«КЕЙІН ДЕМАЛАМЫН»", 0.17, "dark"),
 ("23.0–26.5", "Ал сол «кейін» қашан келеді?", "Күнтізбе парақтары ұшады, сағат тілі жылдам айналады", "Crane down → VHS-глитч", "ҚАШАН?", 0.16, "dark"),
 ("26.5–31.5", "Саған қазір керегі — бар болғаны 2 сағат.", "Шу тоқтайды; жарық есік ашылады — SPA көрінеді", "Freeze → slow dolly through door", "2 САҒАТ", 0.20, "turn"),
 ("31.5–38.0", "Бүкіл денеге және бетке массаж. Толық релакс!", "МАСТЕР: арқа → бет массажы (сіздің сурет)", "Slow slider / top-down", "ДЕНЕ + БЕТ", 0.16, "light"),
 ("38.0–41.5", "Бар болғаны 13 000 теңге.", "SPA интерьері; ортада көлемді баға", "Slow lateral track", "13 000 ₸\n2 сағат • Дене + бет массажы", 0.40, "light"),
 ("41.5–46.0", "Сен тек жұмыс істеуге емес, демалуға да лайықсың!", "Айна алдында жайнап күледі (Кадр 1 рифмасы)", "Orbit 180° айна арқылы", "ЛАЙЫҚСЫҢ", 0.16, "light"),
 ("46.0–50.0", "Өзіңді тағы да кейінге қалдырма.", "SPA креслода шаймен; телефон экраны төмен қаратылған", "Slow dolly-out", "—", None, "light"),
 ("50.0–55.0", "Қазір жазыл!", "Premium финал: teal фон, алтын арка, алтын жазулар", "Gentle push-in + gold particles", "2 САҒАТ ТОЛЫҚ РЕЛАКС\nДЕНЕ + БЕТ МАССАЖЫ\n13 000 ₸\n[ ҚАЗІР ЖАЗЫЛ! ]\n@ainurana_massaj_ashibulak", 0.30, "light"),
]

PAL = {"dark": ("#3B4446", "#5E5A52", "#E9E2D6"),
       "turn": ("#2E3A3C", "#D9A35A", "#FFF6E3"),
       "light": ("#0E4A50", "#1C6B6E", "#F6E7C8")}
GOLD = "#E2B65A"

FW, FH = 270, 480           # 9:16 кадр (1080×1920 / 4)
CW, CH = 330, 760
COLS, ROWS = 6, 2
M = 40
W = COLS * CW + M * 2
H = ROWS * CH + 200
img = Image.new("RGB", (W, H), "#FBF7F0")
d = ImageDraw.Draw(img)
d.text((M, 30), "МАССАЖ САЛОНЫ — 3D ЖАРНАМА • РАСКАДРОВКА (схема)", font=font(MONT, 40, 800), fill="#2B2216")
d.text((M, 85), "1080×1920 • ~55 сек • сары пунктир = Reels safe zone (жоғары 220px, төмен 380px, оң жақ 140px) • алтын = титр орны • овал = кейіпкердің беті (титр оған тимейді)",
       font=font(MONT, 22, 500), fill="#6B5A4E")
d.text((M, 120), "v3: дизайн — сіздің сурет (semi-realistic 3D, teal + алтын + янтарь, маржан гүлдер); 1-бөлім сөнген сұр-teal. Бұл композиция схемасы, кадрлар prompt-пен генерацияланады.",
       font=font(MONT, 22, 500), fill="#A0522D")

def wrap(text, f, w):
    out = []
    for para in text.split("\n"):
        line = ""
        for word in para.split():
            t = (line + " " + word).strip()
            if d.textlength(t, font=f) <= w: line = t
            else:
                if line: out.append(line)
                line = word
        out.append(line)
    return out

for i, (tc, vo, scene, cam, title, ty, ph) in enumerate(SHOTS):
    cx = M + (i % COLS) * CW
    cy = 170 + (i // COLS) * CH
    bg, mid, fg = PAL[ph]
    fx, fy = cx + 20, cy + 50
    d.text((cx + 20, cy + 8), f"КАДР {i+1}", font=font(MONT, 26, 800), fill="#2B2216")
    d.text((cx + 175, cy + 14), tc + "с", font=font(MONT, 18, 600), fill="#8A7560")
    # кадр
    fr = Image.new("RGB", (FW, FH), bg)
    fd = ImageDraw.Draw(fr)
    for k in range(FH):  # жұмсақ градиент
        a = k / FH
        c1 = tuple(int(int(bg[j:j+2], 16) * (1 - a) + int(mid[j:j+2], 16) * a) for j in (1, 3, 5))
        fd.line([(0, k), (FW, k)], fill=c1)
    # кейіпкер силуэті (бет — ортаңғы үштен бір бөлігінде)
    face_y = 0.47 if i not in (8, 11) else None
    if face_y:
        hx, hy = FW // 2, int(FH * face_y)
        fd.ellipse([hx - 38, hy - 48, hx + 38, hy + 48], outline=fg, width=3)
        fd.text((hx - 18, hy - 12), "бет", font=font(MONT, 16, 600), fill=fg)
        fd.rounded_rectangle([hx - 75, hy + 55, hx + 75, FH], radius=40, outline=fg, width=2)
    # safe zone
    s = 0.25
    sx0, sy0, sx1, sy1 = int(60 * s), int(220 * s), FW - int(140 * s), FH - int(380 * s)
    for x in range(sx0, sx1, 10):
        fd.line([(x, sy0), (x + 5, sy0)], fill="#F5C518", width=2)
        fd.line([(x, sy1), (x + 5, sy1)], fill="#F5C518", width=2)
    for y in range(sy0, sy1, 10):
        fd.line([(sx0, y), (sx0, y + 5)], fill="#F5C518", width=2)
        fd.line([(sx1, y), (sx1, y + 5)], fill="#F5C518", width=2)
    # титр
    if title != "—":
        tf = font(MONT, 21 if i != 11 else 13, 800)
        lines = wrap(title, tf, sx1 - sx0 - 16)
        lh = 26 if i != 11 else 19
        ty0 = int(FH * ty) if i != 11 else int(FH * 0.18)
        if i == 8: ty0 = int(FH * 0.24)
        for li, ln in enumerate(lines):
            tw = fd.textlength(ln, font=tf)
            fd.text(((sx0 + sx1 - tw) / 2, ty0 + li * lh), ln, font=tf, fill=GOLD)
    fr = fr.resize((FW, FH))
    img.paste(fr, (fx, fy))
    d.rectangle([fx - 1, fy - 1, fx + FW, fy + FH], outline="#2B2216", width=2)
    # мәтін
    y = fy + FH + 12
    for lbl, txt, f, col in (("🎙", vo, font(MONT, 17, 700), "#2B2216"),
                             ("", scene, font(MONT, 15, 500), "#5A4A3C"),
                             ("", "🎥 " + cam, font(MONT, 15, 700), "#A0522D")):
        for ln in wrap(txt.replace("🎥 ", "Камера: "), f, FW + 30):
            d.text((fx, y), ln, font=f, fill=col); y += 20
        y += 6

out = os.path.join(os.path.dirname(__file__), "raskadrovka-shema.png")
img.save(out)
print(out, img.size)
