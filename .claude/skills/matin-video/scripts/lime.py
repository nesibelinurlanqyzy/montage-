"""lime.py — «lime» көрінісі: қара / ащы-лайм постер, жуан тар капс (Oswald), бұрыш рамкалары,
жоғарыда «CLAUDE МОНТАЖ · 01 / 09», кинетикалық сөздер, телефон/карточка суреттері.
Жоспарда "theme": {"look": "lime", "accent": "#E4FF1A", "label": "CLAUDE МОНТАЖ"} болса қосылады.

Сахна "viz": hook | laptop | phone | claude | strike | list | words | timer | cta
  list/words: "items": [["ЭКРАНДАҒЫ ЖАЗУ", "айтылғанда шығатын сөз"], ...]
  timer: "num": "10", "unit": "МИНУТ"
"""
import math
import os
import re
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import montazh as M

W, H = M.W, M.H
FD = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "fonts")
BLACK = (12, 12, 12)
WHITE = (246, 246, 240)
GRAY = (120, 120, 120)
DARK = (30, 30, 30)
RED = (255, 59, 48)
_F = {}


def font(px, w=700, name="Oswald.ttf"):
    k = (px, w, name)
    if k not in _F:
        f = ImageFont.truetype(os.path.join(FD, name), int(px))
        try:
            f.set_variation_by_axes([w])
        except Exception:
            pass
        _F[k] = f
    return _F[k]


def rub(px, w=700):
    return font(px, w, "Rubik.ttf")


def cl(x):
    return max(0.0, min(1.0, x))


def ease(x):
    x = cl(x)
    return 1 - (1 - x) ** 3


def back(x):
    x = cl(x)
    c1 = 1.9
    return 1 + (c1 + 1) * (x - 1) ** 3 + c1 * (x - 1) ** 2


def norm(w):
    return re.sub(r"[^\w]", "", w.lower())


def word_time(words, key, default):
    k = norm(key)
    for it in words:
        if norm(it["w"]).startswith(k):
            return it["s"]
    return default


# ---------------------------------------------------------------- спрайттар
_S = {}


def text_sprite(s, px, color, f=None, glow=None, pad=0):
    f = f or font(px)
    key = ("t", s, px, color, id(f), glow, pad)
    if key in _S:
        return _S[key]
    bb = f.getbbox(s)
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    g = 40 if glow else 0
    im = Image.new("RGBA", (w + 2 * (g + pad), h + 2 * (g + pad)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.text((g + pad - bb[0], g + pad - bb[1]), s, font=f, fill=color + (255,))
    if glow:
        gl = Image.new("RGBA", im.size, glow + (0,))
        a = im.split()[3].filter(ImageFilter.GaussianBlur(18))
        gl.putalpha(a.point(lambda v: min(255, int(v * 1.6))))
        gl.alpha_composite(im)
        im = gl
    _S[key] = im
    return im


def fit_px(s, px, maxw, f=font):
    while px > 30 and f(px).getbbox(s)[2] - f(px).getbbox(s)[0] > maxw:
        px -= 4
    return px


def pill_sprite(s, px, fg, bg, f=None, padx=None, pady=None, r=None):
    f = f or font(px)
    key = ("p", s, px, fg, bg, id(f), padx, pady)
    if key in _S:
        return _S[key]
    bb = f.getbbox(s)
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    px_ = padx if padx is not None else int(px * 0.35)
    py_ = pady if pady is not None else int(px * 0.2)
    im = Image.new("RGBA", (w + 2 * px_, h + 2 * py_), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), radius=r if r is not None else int(im.size[1] * 0.22),
                        fill=bg + (255,))
    d.text((px_ - bb[0], py_ - bb[1]), s, font=f, fill=fg + (255,))
    _S[key] = im
    return im


def outline_sprite(s, px, color, width=4):
    key = ("o", s, px, color, width)
    if key in _S:
        return _S[key]
    f = font(px)
    bb = f.getbbox(s, stroke_width=width)
    im = Image.new("RGBA", (bb[2] - bb[0] + 4, bb[3] - bb[1] + 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.text((2 - bb[0], 2 - bb[1]), s, font=f, fill=(0, 0, 0, 0), stroke_width=width, stroke_fill=color + (255,))
    _S[key] = im
    return im


def paste(base, spr, cx, cy, scale=1.0, alpha=1.0, rot=0.0, anchor="c"):
    if alpha <= 0.01 or scale <= 0.01:
        return
    im = spr
    if abs(scale - 1) > 0.004:
        im = im.resize((max(1, int(im.size[0] * scale)), max(1, int(im.size[1] * scale))), Image.BILINEAR)
    if abs(rot) > 0.05:
        im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if alpha < 0.999:
        a = im.split()[3].point(lambda v: int(v * alpha))
        im = im.copy()
        im.putalpha(a)
    w, h = im.size
    if anchor == "c":
        x, y = cx - w / 2, cy - h / 2
    elif anchor == "l":
        x, y = cx, cy - h / 2
    else:  # "r"
        x, y = cx - w, cy - h / 2
    base.alpha_composite(im, (int(round(x)), int(round(y))))


# ---------------------------------------------------------------- рендерер
class LimeRenderer:
    def __init__(self, plan, tl):
        self.plan, self.tl = plan, tl
        th = plan.get("theme", {})
        self.L = M.hex2rgb(th.get("accent", "#E4FF1A"))
        self.label = th.get("label", "")
        self.sc = plan["scenes"]
        self.ts = tl["scenes"]
        self.n = len(self.sc)
        self.hits = []      # (уақыт, түрі) — дыбыс эффектілері үшін
        for sc, t in zip(self.sc, self.ts):
            t["chunks"] = self.chunks(t["words"])
        self.speech_end = self.ts[-1]["speech_e"]

    # ---- субтитр бөліктері
    @staticmethod
    def chunks(words):
        out, cur = [], []
        for w in words:
            cur.append(w)
            if len(cur) >= 3 or w["w"][-1:] in ",.!?»":
                out.append(cur)
                cur = []
        if cur:
            out.append(cur)
        return out

    def scene_at(self, t):
        for k, s in enumerate(self.ts):
            if t < s["e"] or k == self.n - 1:
                return k
        return self.n - 1

    def wt(self, k, key, default=None):
        s = self.ts[k]
        return word_time(s["words"], key, s["s"] if default is None else default)

    def item_idx(self, k, t):
        sc = self.sc[k]
        idx = -1
        for i, it in enumerate(sc.get("items", [])):
            if t >= self.wt(k, it[1], 1e9) - 0.12:
                idx = i
        return idx

    def bg_of(self, k, t):
        viz = self.sc[k].get("viz")
        if viz in ("phone", "strike"):
            return "L"
        if viz == "hook":
            return "L" if t >= self.wt(k, "бірақ") - 0.08 else "B"
        if viz == "words":
            i = self.item_idx(k, t)
            return "L" if i in (1, 3, 5) else "B"
        return "B"

    # ---- кадр
    def frame(self, t):
        k = self.scene_at(t)
        bgk = self.bg_of(k, t)
        bg, fg = (self.L, BLACK) if bgk == "L" else (BLACK, WHITE)
        im = Image.new("RGBA", (W, H), bg + (255,))
        if bgk == "L" and self.sc[k].get("viz") == "phone":
            d = ImageDraw.Draw(im)
            for x in range(60, W, 90):
                d.line((x, 0, x, H), fill=(30, 30, 10, 255), width=3)
        st = self.ts[k]["s"]
        u = t - st
        getattr(self, "v_" + self.sc[k].get("viz", "hook"))(im, k, t, u, bgk)
        self.subs(im, k, t, bgk)
        self.chrome(im, k, t, bgk)
        # ауысу: қарама-қарсы түсті жолақ жоғары сырғиды
        if k > 0 and u < 0.22:
            e = ease(u / 0.22)
            d = ImageDraw.Draw(im)
            col = BLACK if bgk == "L" else self.L
            y0 = int(H * (1 - e) - 260)
            d.rectangle((0, max(0, y0), W, max(0, int(H * (1 - e)))), fill=col + (255,))
        return np.ascontiguousarray(np.array(im.convert("RGB"))[:, :, ::-1])

    # ---- рамка, жоғарғы жазу, прогресс
    def chrome(self, im, k, t, bgk):
        d = ImageDraw.Draw(im)
        c = (40, 40, 10) if bgk == "L" else (200, 200, 200)
        acc = BLACK if bgk == "L" else self.L
        x0, y0, x1, y1, a = 46, 196, 1034, 1500, 34
        for (x, y, sx, sy) in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
            d.line((x, y, x + sx * a, y), fill=c + (255,), width=3)
            d.line((x, y, x, y + sy * a), fill=c + (255,), width=3)
        f = rub(28, 600)
        if self.label:
            d.text((92, 236), self.label, font=f, fill=c + (255,))
        cnt = "%02d / %02d" % (k + 1, self.n)
        bb = f.getbbox(cnt)
        d.text((988 - bb[2], 236), cnt, font=f, fill=c + (255,))
        y = 1462
        d.line((92, y, 988, y), fill=(c if bgk == "L" else (70, 70, 70)) + (255,), width=3)
        p = cl(t / max(0.1, self.speech_end))
        d.line((92, y, 92 + int(896 * p), y), fill=acc + (255,), width=5)

    # ---- субтитр
    def subs(self, im, k, t, bgk):
        s = self.ts[k]
        cur = None
        for i, ch in enumerate(s["chunks"]):
            nxt = s["chunks"][i + 1][0]["s"] if i + 1 < len(s["chunks"]) else s["e"]
            if ch[0]["s"] - 0.06 <= t < nxt - 0.02:
                cur = ch
        if not cur:
            return
        f = rub(fit_px(" ".join(M.disp(w["w"]) for w in cur), 46, 780, lambda p: rub(p, 600)), 600)
        words = [M.disp(w["w"]) for w in cur]
        sp = f.getbbox(" ")[2] or 14
        ws = [f.getbbox(w)[2] - f.getbbox(w)[0] for w in words]
        total = sum(ws) + sp * (len(ws) - 1)
        x = 500 - total / 2
        d = ImageDraw.Draw(im)
        base = (20, 20, 20) if bgk == "L" else (225, 225, 225)
        hi = self.L if bgk == "B" else BLACK
        for w, ww, wd in zip(words, ws, cur):
            on = wd["s"] <= t + 0.03
            if on and wd["s"] <= t < wd["e"] + 0.05:
                pad = 8
                if bgk == "B":
                    d.rounded_rectangle((x - pad, 1360, x + ww + pad, 1420), 10, fill=self.L + (255,))
                    col = BLACK
                else:
                    d.rounded_rectangle((x - pad, 1360, x + ww + pad, 1420), 10, fill=BLACK + (255,))
                    col = self.L
            else:
                col = base if on else ((110, 45, 0) if bgk == "L" else (95, 95, 95))
            d.text((x, 1390), w, font=f, fill=col + (255,), anchor="lm")
            x += ww + sp

    # ---- көмекші: сөз шығуы
    def pop(self, im, spr, cx, cy, t0, t, anchor="c", rise=60, sc0=1.25, kind="pop"):
        if t < t0 - 0.02:
            return False
        e = ease((t - t0) / 0.28)
        s = sc0 + (1 - sc0) * back((t - t0) / 0.3)
        paste(im, spr, cx, cy + (1 - e) * rise, s, cl((t - t0) / 0.12), anchor=anchor)
        return True

    # ================================================================ сахналар
    def v_hook(self, im, k, t, u, bgk):
        tb = self.wt(k, "бірақ") - 0.08
        L = self.L
        if t < tb:
            paste_t = self.wt(k, "claude")
            self.pop(im, pill_sprite("CLAUDE", 150, BLACK, L), 540, 500, paste_t, t)
            self.pop(im, text_sprite("МОНТАЖ", 190, WHITE), 540, 700, self.wt(k, "монтаж"), t)
            self.pop(im, text_sprite("ҮЙРЕНГІҢ", 170, WHITE), 540, 900, self.wt(k, "үйренгің"), t)
            self.pop(im, text_sprite("КЕЛЕДІ,", 170, L), 540, 1090, self.wt(k, "келеді"), t)
        else:
            self.pop(im, text_sprite("БІРАҚ", 120, BLACK), 92, 400, tb, t, anchor="l")
            tn = self.wt(k, "ноутбугың")
            px = fit_px("НОУТБУГЫҢ", 200, 880)
            self.pop(im, text_sprite("НОУТБУГЫҢ", px, BLACK), 92, 560, tn, t, anchor="l")
            if t >= tn:
                self.laptop(im, 330, 880, 0.82, BLACK, t - tn, cross=t - tn - 0.35, xcol=WHITE)
            tj = self.wt(k, "жоқ")
            self.pop(im, text_sprite("ЖОҚ ПА", 180, BLACK), 92, 1220, tj, t, anchor="l")
            if t >= tj:
                q = text_sprite("?", 500, BLACK)
                wob = math.sin((t - tj) * 5) * 6
                paste(im, q, 800, 900, back((t - tj) / 0.35), 1, rot=-12 + wob)

    def laptop(self, im, cx, cy, s, col, u, cross=-1.0, glow=False, xcol=RED):
        d = ImageDraw.Draw(im)
        e = back(u / 0.35)
        w, h = 420 * s * e, 270 * s * e
        lw = max(2, int(10 * s))
        d.rounded_rectangle((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), int(16 * s), outline=col + (255,), width=lw)
        d.rounded_rectangle((cx - w / 2 - 50 * s * e, cy + h / 2 + 8, cx + w / 2 + 50 * s * e, cy + h / 2 + 8 + 30 * s * e),
                            int(10 * s), fill=col + (255,))
        if cross > 0:
            c = ease(cross / 0.25)
            r = 190 * s
            d.line((cx - r, cy - r, cx - r + 2 * r * c, cy - r + 2 * r * c), fill=xcol + (255,), width=int(26 * s))
            if cross > 0.12:
                c2 = ease((cross - 0.12) / 0.25)
                d.line((cx + r, cy - r, cx + r - 2 * r * c2, cy - r + 2 * r * c2), fill=xcol + (255,), width=int(26 * s))

    def v_laptop(self, im, k, t, u, bgk):
        L = self.L
        self.pop(im, text_sprite("КӨПШІЛІК", 200, WHITE), 540, 420, self.ts[k]["s"] + 0.05, t)
        tm = self.wt(k, "монтажды")
        if t >= tm:
            self.laptop(im, 540, 720, 1.0, (150, 150, 150), t - tm)
        tc = self.wt(k, "компьютермен")
        if t >= tc - 0.05:
            e = ease((t - tc + 0.05) / 0.3)
            band = self.band("КОМПЬЮТЕРМЕН", t)
            paste(im, band, 540 + (1 - e) * 1200, 1030, 1.0, 1.0, rot=7)
        ty = self.wt(k, "үйретіп")
        self.pop(im, text_sprite("ҮЙРЕТІП ЖАТЫР", 96, L), 540, 1240, ty, t)

    def band(self, word, t):
        L = self.L
        f = font(110)
        unit = word + "  •  "
        uw = f.getbbox(unit)[2]
        im = Image.new("RGBA", (1700, 170), L + (255,))
        d = ImageDraw.Draw(im)
        off = -((t * 260) % uw)
        x = off
        while x < 1700:
            d.text((x, 85), unit, font=f, fill=BLACK + (255,), anchor="lm")
            x += uw
        return im

    def phone(self, im, cx, top, w, h, u, k, t):
        L = self.L
        d = ImageDraw.Draw(im)
        x0, x1 = cx - w / 2, cx + w / 2
        d.rounded_rectangle((x0 - 10, top - 10, x1 + 10, top + h + 10), 62, fill=(20, 20, 20, 255))
        d.rounded_rectangle((x0, top, x1, top + h), 54, fill=(14, 14, 16, 255))
        d.rounded_rectangle((cx - 60, top + 18, cx + 60, top + 48), 15, fill=(0, 0, 0, 255))
        f = rub(24, 600)
        d.text((x0 + 36, top + 80), "CLAUDE · ЧАТ", font=f, fill=(150, 150, 150, 255))
        # пайдаланушы хабары
        b1 = pill_sprite("Видеоны монтажда", 30, BLACK, L, f=rub(30, 600), r=22)
        if u > 0.3:
            paste(im, b1, x1 - 24, top + 170, back((u - 0.3) / 0.3), 1, anchor="r")
        tj = self.wt(k, "жеткілікті")
        if t >= tj - 0.6:
            uu = t - tj + 0.6
            card = Image.new("RGBA", (int(w - 60), 300), (0, 0, 0, 0))
            dc = ImageDraw.Draw(card)
            dc.rounded_rectangle((0, 0, card.size[0] - 1, 299), 26, fill=(36, 36, 40, 255))
            dc.text((26, 24), "Дайын! Монтаж жасалды", font=rub(24, 600), fill=(190, 190, 190, 255))
            dc.rounded_rectangle((26, 70, card.size[0] - 26, 250), 18, fill=L + (255,))
            mf = font(74)
            dc.text((card.size[0] / 2, 145), "МОНТАЖ", font=mf, fill=BLACK + (255,), anchor="mm")
            dc.text((card.size[0] / 2, 214), "REELS · 9:16", font=rub(22, 700), fill=(200, 40, 40, 255), anchor="mm")
            paste(im, card, cx, top + 380, back(uu / 0.35), cl(uu / 0.15))
        # прогресс
        p = cl(u / 3.5)
        d.rounded_rectangle((x0 + 30, top + h - 90, x1 - 30, top + h - 70), 10, fill=(50, 50, 50, 255))
        d.rounded_rectangle((x0 + 30, top + h - 90, x0 + 30 + (w - 60) * p, top + h - 70), 10, fill=L + (255,))

    def v_phone(self, im, k, t, u, bgk):
        L = self.L
        self.pop(im, text_sprite("ТЕК", 140, BLACK), 540, 360, self.wt(k, "тек") - 0.3, t)
        self.pop(im, pill_sprite("ТЕЛЕФОННЫҢ", fit_px("ТЕЛЕФОННЫҢ", 170, 760), L, BLACK), 540, 540, self.wt(k, "телефонның"), t)
        tp = self.wt(k, "тек") - 0.3
        if t >= tp:
            e = ease((t - tp) / 0.6)
            top = 690 + (1 - e) * 1100
            self.phone(im, 540, top, 400, 640, t - tp, k, t)
        tj = self.wt(k, "жеткілікті")
        if t >= tj:
            st = pill_sprite("ЖЕТКІЛІКТІ", 96, WHITE, BLACK)
            paste(im, st, 540, 1240, 1.4 - 0.4 * back((t - tj) / 0.25), cl((t - tj) / 0.1), rot=-6)
            self.hit(tj, "stamp")

    def v_claude(self, im, k, t, u, bgk):
        L = self.L
        paste(im, pill_sprite("CLAUDE", 40, BLACK, L, f=rub(40, 800)), 92, 330, 1, 1, anchor="l")
        tc = self.wt(k, "claude") - 0.06
        if t < tc:
            self.pop(im, text_sprite("МЫНА ВИДЕОНЫ", 140, WHITE), 540, 520, self.ts[k]["s"] + 0.05, t)
            self.pop(im, text_sprite("БАСЫНАН", 140, WHITE), 540, 700, self.wt(k, "басынан"), t)
            self.pop(im, text_sprite("АЯҒЫНА ДЕЙІН", 140, L), 540, 880, self.wt(k, "аяғына"), t)
        else:
            paste(im, text_sprite("МЫНА ВИДЕОНЫ БАСЫНАН АЯҒЫНА ДЕЙІН", fit_px("МЫНА ВИДЕОНЫ БАСЫНАН АЯҒЫНА ДЕЙІН", 64, 880),
                                  (140, 140, 140)), 540, 520, 1, 1)
            g = text_sprite("CLAUDE", 270, L, glow=L)
            paste(im, g, 540, 820, 1.5 - 0.5 * back((t - tc) / 0.35), cl((t - tc) / 0.1))
            self.pop(im, text_sprite("ЖАСАДЫ", 170, WHITE), 540, 1100, self.wt(k, "жасады"), t)

    def v_strike(self, im, k, t, u, bgk):
        self.pop(im, text_sprite("ЕШҚАНДАЙ", 150, BLACK), 540, 470, self.ts[k]["s"] + 0.02, t)
        tc = self.wt(k, "capcut")
        self.pop(im, text_sprite("CAPCUT", 290, BLACK), 540, 760, tc, t, sc0=1.5)
        tq = self.wt(k, "қолданбадым")
        if t >= tq:
            d = ImageDraw.Draw(im)
            e = ease((t - tq) / 0.22)
            d.line((150, 820, 150 + 780 * e, 700), fill=WHITE + (255,), width=36)
            st = pill_sprite("ҚОЛДАНБАДЫМ!", 110, WHITE, BLACK)
            paste(im, st, 540, 1060, 1.5 - 0.5 * back((t - tq - 0.1) / 0.25), cl((t - tq - 0.1) / 0.1), rot=-7)

    # ---- тізім карточкалары
    def card(self, i, t, u):
        L = self.L
        cw, ch = 600, 640
        im = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        if i == 0:  # Reels
            top = np.array([90, 70, 180]); bot = np.array([230, 90, 120])
            for y in range(ch):
                c = tuple(int(v) for v in top + (bot - top) * y / ch)
                d.line((0, y, cw, y), fill=c + (255,))
            mask = Image.new("L", (cw, ch), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, cw - 1, ch - 1), 40, fill=255)
            im.putalpha(mask)
            d = ImageDraw.Draw(im)
            d.ellipse((cw / 2 - 80, ch / 2 - 80, cw / 2 + 80, ch / 2 + 80), fill=(255, 255, 255, 230))
            d.polygon([(cw / 2 - 25, ch / 2 - 42), (cw / 2 - 25, ch / 2 + 42), (cw / 2 + 45, ch / 2)], fill=(90, 70, 180, 255))
            d.rounded_rectangle((30, 30, 190, 84), 27, fill=L + (255,))
            d.text((110, 57), "REELS", font=rub(30, 800), fill=BLACK + (255,), anchor="mm")
            for j in range(4):  # жүрекшелер
                ph = (u * 0.9 + j * 0.27) % 1
                y = ch - 60 - ph * 380
                x = cw - 70 + math.sin(ph * 9 + j) * 18
                c = (255, 80, 110, int(255 * (1 - ph)))
                d.ellipse((x - 22, y - 16, x + 2, y + 8), fill=c)
                d.ellipse((x - 2, y - 16, x + 22, y + 8), fill=c)
                d.polygon([(x - 21, y), (x + 21, y), (x, y + 24)], fill=c)
            d.text((34, ch - 60), "1.2M  просмотр", font=rub(28, 600), fill=(255, 255, 255, 255), anchor="lm")
        elif i == 1:  # субтитр
            d.rounded_rectangle((0, 0, cw - 1, ch - 1), 40, fill=(34, 40, 64, 255))
            d.ellipse((cw / 2 - 90, 90, cw / 2 + 90, 270), fill=(110, 120, 160, 255))
            d.rounded_rectangle((cw / 2 - 170, 290, cw / 2 + 170, 560), 120, fill=(110, 120, 160, 255))
            words = ["ҚОЗҒАЛЫСТАҒЫ", "СУБТИТР"]
            j = int(u * 2.5) % 2
            f = font(50)
            xs = [60, 380]
            d.rectangle((0, 470, cw, 600), fill=(34, 40, 64, 200))
            for m, w in enumerate(words):
                bb = f.getbbox(w)
                x = cw / 2 - (bb[2] + 20 + f.getbbox(words[1])[2]) / 2 if m == 0 else None
                if m == 0:
                    x0 = x
                else:
                    x0 = xs_end + 20
                if m == j:
                    d.rounded_rectangle((x0 - 10, 495, x0 + bb[2] + 10, 575), 12, fill=L + (255,))
                    d.text((x0, 535), w, font=f, fill=BLACK + (255,), anchor="lm")
                else:
                    d.text((x0, 535), w, font=f, fill=(255, 255, 255, 255), anchor="lm")
                xs_end = x0 + bb[2]
        elif i == 2:  # 3D
            d.rounded_rectangle((0, 0, cw - 1, ch - 1), 40, fill=(22, 22, 26, 255))
            a, b = u * 1.3, 0.5 + u * 0.4
            pts = []
            for x in (-1, 1):
                for y in (-1, 1):
                    for z in (-1, 1):
                        x1 = x * math.cos(a) - z * math.sin(a)
                        z1 = x * math.sin(a) + z * math.cos(a)
                        y1 = y * math.cos(b) - z1 * math.sin(b)
                        z2 = y * math.sin(b) + z1 * math.cos(b)
                        p = 4 / (z2 + 5)
                        pts.append((cw / 2 + x1 * 150 * p * 1.3, ch / 2 - 20 + y1 * 150 * p * 1.3))
            for p in range(8):
                for q in range(p + 1, 8):
                    if bin(p ^ q).count("1") == 1:
                        d.line((pts[p], pts[q]), fill=L + (255,), width=7)
            d.text((cw / 2, ch - 60), "3D", font=font(80), fill=(255, 255, 255, 255), anchor="mm")
        elif i == 3:  # жарнама
            d.rounded_rectangle((0, 0, cw - 1, ch - 1), 40, fill=(244, 242, 236, 255))
            d.rounded_rectangle((cw / 2 - 40, 80, cw / 2 + 40, 140), 12, fill=(30, 60, 55, 255))
            d.rounded_rectangle((cw / 2 - 120, 130, cw / 2 + 120, 420), 50, fill=(60, 170, 150, 255))
            d.text((cw / 2, 260), "КРЕМ", font=font(64), fill=(255, 255, 255, 255), anchor="mm")
            r = 70 + 6 * math.sin(u * 8)
            d.ellipse((cw / 2 + 70 - r, 150 - r, cw / 2 + 70 + r, 150 + r), fill=RED + (255,))
            d.text((cw / 2 + 70, 150), "-50%", font=font(56), fill=(255, 255, 255, 255), anchor="mm")
            d.text((50, 490), "19 980 тг", font=rub(30, 600), fill=(160, 160, 160, 255), anchor="lm")
            d.line((50, 490, 190, 490), fill=RED + (255,), width=4)
            d.text((50, 555), "9 990 тг", font=font(76), fill=BLACK + (255,), anchor="lm")
            d.rounded_rectangle((330, 520, 560, 590), 35, fill=L + (255,))
            d.text((445, 555), "САТЫП АЛУ", font=rub(28, 800), fill=BLACK + (255,), anchor="mm")
        else:  # кино
            top = np.array([60, 40, 110]); bot = np.array([250, 140, 90])
            for y in range(ch):
                c = tuple(int(v) for v in top + (bot - top) * y / ch)
                d.line((0, y, cw, y), fill=c + (255,))
            sy = 330 - u * 18
            d.ellipse((cw / 2 - 80, sy - 80, cw / 2 + 80, sy + 80), fill=(255, 230, 170, 255))
            d.polygon([(0, 470), (160, 330), (300, 450), (430, 300), (cw, 470), (cw, ch), (0, ch)], fill=(70, 40, 90, 255))
            d.rectangle((0, 0, cw, 90), fill=(0, 0, 0, 255))
            d.rectangle((0, ch - 90, cw, ch), fill=(0, 0, 0, 255))
            if int(u * 2) % 2 == 0:
                d.ellipse((30, 30, 56, 56), fill=RED + (255,))
            d.text((70, 44), "REC  4K · 24fps", font=rub(26, 700), fill=(255, 255, 255, 255), anchor="lm")
            mask = Image.new("L", (cw, ch), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, cw - 1, ch - 1), 40, fill=255)
            im.putalpha(mask)
        return im

    def v_list(self, im, k, t, u, bgk):
        L = self.L
        sc = self.sc[k]
        i = self.item_idx(k, t)
        if i < 0:
            self.pop(im, text_sprite("ОСЫ ӘДІСПЕН", 170, WHITE), 540, 680, self.ts[k]["s"] + 0.05, t)
            self.pop(im, text_sprite("ЖАСАЙ АЛАСЫҢ", 110, L), 540, 880, self.wt(k, "әдіспен"), t)
            return
        it = sc["items"][i]
        t0 = self.wt(k, it[1]) - 0.12
        uu = t - t0
        e = ease(uu / 0.3)
        dx = (1 - e) * 700
        paste(im, outline_sprite("%02d" % (i + 1), 150, L, 4), 92 + dx, 380, 1, 1, anchor="l")
        px = fit_px(it[0], 110, 880)
        paste(im, text_sprite(it[0], px, WHITE), 92 + dx * 1.3, 540, 1, 1, anchor="l")
        cd = self.card(i, t, uu)
        paste(im, cd, 540 + dx * 1.6, 960, 0.92 + 0.08 * back(uu / 0.4), 1)

    # ---- сөздер
    def v_words(self, im, k, t, u, bgk):
        L = self.L
        sc = self.sc[k]
        i = self.item_idx(k, t)
        fg = BLACK if bgk == "L" else WHITE
        if i < 0:
            self.pop(im, text_sprite("ҚАЛАҒАН", 220, WHITE), 540, 760, self.ts[k]["s"] + 0.05, t)
            return
        paste(im, pill_sprite("CLAUDE", 40, L if bgk == "L" else BLACK, BLACK if bgk == "L" else L, f=rub(40, 800)),
              92, 330, 1, 1, anchor="l")
        it = sc["items"][i]
        t0 = self.wt(k, it[1]) - 0.12
        uu = t - t0
        word = it[0]
        d = ImageDraw.Draw(im)
        if word == "ХУК":
            self.pop(im, text_sprite("ХУК", 420, WHITE), 540, 800, t0, t, sc0=1.6)
            e = ease(uu / 0.3)
            d.line((690, 470, 690 - 20 * e, 470 + 520 * e), fill=L + (255,), width=18)
            return
        accent_word = L if (bgk == "B" and word == "МУЗЫКА") else fg
        self.pop(im, text_sprite(word, fit_px(word, 210, 880), accent_word), 540, 510, t0, t, sc0=1.35)
        vc = fg
        if word == "ШРИФТ":
            fonts = [font(330), rub(330, 900), font(330, 700, "PTSerifBold.ttf"), font(330, 400, "Caveat.ttf"),
                     font(300, 700, "JetBrainsMono.ttf")]
            f = fonts[int(uu * 5) % len(fonts)]
            if uu > 0.1:
                d.text((540, 920), "Aa", font=f, fill=L + (255,), anchor="mm")
        elif word == "АНИМАЦИЯ":
            for j in range(9, -1, -1):
                ph = (uu * 0.7 - j * 0.035) % 1
                x = 200 + 680 * ph
                y = 1000 - math.sin(ph * math.pi) * 330
                r = 52 - j * 3
                a = 255 if j == 0 else int(140 * (1 - j / 10))
                d.ellipse((x - r, y - r, x + r, y + r), fill=BLACK + (a,))
            d.line((150, 1060, 930, 1060), fill=BLACK + (255,), width=4)
        elif word == "МУЗЫКА":
            n = 34
            for j in range(n):
                hgt = 40 + 220 * abs(math.sin(j * 0.7 + uu * 7) * math.sin(j * 0.23 + uu * 3.1))
                x = 140 + j * 23.5
                d.rounded_rectangle((x, 920 - hgt, x + 13, 920 + hgt), 6, fill=L + (255,))
        elif word == "ОЗВУЧКА":
            cx, cy = 540, 880
            d.rounded_rectangle((cx - 60, cy - 150, cx + 60, cy + 40), 60, fill=BLACK + (255,))
            d.arc((cx - 100, cy - 90, cx + 100, cy + 110), 0, 180, fill=BLACK + (255,), width=12)
            d.line((cx, cy + 110, cx, cy + 170), fill=BLACK + (255,), width=12)
            pts = [(x, 1120 + math.sin(x * 0.03 + uu * 9) * 50 * math.sin(x / 1080 * math.pi)) for x in range(110, 920, 6)]
            d.line(pts, fill=BLACK + (255,), width=6)
            pts2 = [(x, 1120 + math.sin(x * 0.02 - uu * 6) * 35 * math.sin(x / 1080 * math.pi)) for x in range(110, 920, 6)]
            d.line(pts2, fill=(60, 70, 0, 255), width=4)
        elif word == "КАДРЛАРДЫ":
            x0, y0, x1, y1 = 120, 760, 900, 1180
            d.rounded_rectangle((x0, y0, x1, y1), 26, fill=(20, 20, 20, 255))
            for j in range(10):
                d.text((x0 + 40 + j * 78, y0 + 34), "%02d" % j, font=rub(20, 600), fill=(120, 120, 120, 255), anchor="mm")
            cut = ease((uu - 0.4) / 0.3)
            rows = [(y0 + 80, [(0.0, 0.35, RED)]),
                    (y0 + 170, [(0.0, 0.32, (60, 130, 240)), (0.34, 0.62, (120, 210, 110)), (0.64, 1.0, (235, 200, 80))])]
            for y, blocks in rows:
                for a, b, c in blocks:
                    gap = 10 * cut
                    d.rounded_rectangle((x0 + 30 + a * 720 + gap, y, x0 + 30 + b * 720 - gap, y + 70), 12, fill=c + (255,))
            for j in range(120):
                hh = 10 + 22 * abs(math.sin(j * 1.7))
                xx = x0 + 30 + j * 6
                d.line((xx, y0 + 330 - hh, xx, y0 + 330 + hh), fill=(90, 90, 90, 255), width=3)
            ph = x0 + 30 + 720 * cl(uu / 2.0)
            d.line((ph, y0 + 60, ph, y1 - 20), fill=RED + (255,), width=5)
            d.polygon([(ph - 14, y0 + 52), (ph + 14, y0 + 52), (ph, y0 + 70)], fill=RED + (255,))

    def v_timer(self, im, k, t, u, bgk):
        L = self.L
        sc = self.sc[k]
        self.pop(im, text_sprite("БАРЛЫҒЫН", 110, WHITE), 540, 350, self.ts[k]["s"] + 0.05, t)
        self.pop(im, text_sprite("БІР ЖҮЙЕМЕН", 110, L), 540, 480, self.wt(k, "бір"), t)
        t10 = self.wt(k, "10")
        cx, cy, r = 540, 930, 290
        d = ImageDraw.Draw(im)
        for j in range(60):
            a = j / 60 * 2 * math.pi - math.pi / 2
            r0 = r + (0 if j % 5 else -14)
            d.line((cx + math.cos(a) * r0, cy + math.sin(a) * r0, cx + math.cos(a) * (r + 22), cy + math.sin(a) * (r + 22)),
                   fill=(110, 110, 110, 255), width=4 if j % 5 == 0 else 2)
        d.ellipse((cx - r + 40, cy - r + 40, cx + r - 40, cy + r - 40), outline=(50, 50, 50, 255), width=22)
        p = cl((t - self.ts[k]["s"]) / max(0.5, t10 - self.ts[k]["s"]))
        d.arc((cx - r + 40, cy - r + 40, cx + r - 40, cy + r - 40), -90, -90 + 360 * ease(p), fill=L + (255,), width=22)
        num = int(round(1 + 9 * ease(p)))
        big = t >= t10
        s = text_sprite(str(num) if not big else sc.get("num", "10"), 250, L if big else WHITE, glow=L if big else None)
        sc_ = 1.25 - 0.25 * back((t - t10) / 0.3) if big else 1
        paste(im, s, cx, cy - 20, sc_, 1)
        paste(im, text_sprite(sc.get("unit", "МИНУТ"), 64, (150, 150, 150), f=rub(64, 800)), cx, cy + 130, 1, 1)

    def v_cta(self, im, k, t, u, bgk):
        L = self.L
        self.pop(im, text_sprite("НОУТБУКСЫЗ", 150, WHITE), 540, 380, self.ts[k]["s"] + 0.05, t)
        self.pop(im, text_sprite("«CLAUDE МОНТАЖ»", fit_px("«CLAUDE МОНТАЖ»", 150, 900), L, glow=L), 540, 570,
                 self.wt(k, "claude"), t)
        self.pop(im, text_sprite("ҮЙРЕНГІҢ КЕЛСЕ", 110, WHITE), 540, 750, self.wt(k, "үйренгің"), t)
        ta = self.wt(k, "төмендегі")
        if t >= ta:
            d = ImageDraw.Draw(im)
            by = 880 + abs(math.sin((t - ta) * 4)) * 26
            a = cl((t - ta) / 0.15)
            d.line((540, by - 50, 540, by + 40), fill=L + (int(255 * a),), width=12)
            d.line((500, by, 540, by + 44, 580, by), fill=L + (int(255 * a),), width=12, joint="curve")
        tb = self.wt(k, "подробнее") - 0.1
        if t >= tb:
            btn = self.button()
            pulse = 1 + 0.035 * math.sin((t - tb) * 6)
            paste(im, btn, 540, 1080, back((t - tb) / 0.35) * pulse, cl((t - tb) / 0.1))
            tt = self.wt(k, "бас")
            if t >= tt:
                q = cl((t - tt) / 0.6)
                d = ImageDraw.Draw(im)
                rr = 30 + 110 * q
                d.ellipse((780 - rr, 1080 - rr, 780 + rr, 1080 + rr), outline=L + (int(255 * (1 - q)),), width=6)

    def button(self):
        key = ("btn",)
        if key in _S:
            return _S[key]
        L = self.L
        w, h = 700, 150
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, w - 1, h - 1), 75, fill=(32, 32, 32, 255), outline=(80, 80, 80, 255), width=3)
        d.text((60, h / 2), "ПОДРОБНЕЕ", font=rub(60, 800), fill=WHITE + (255,), anchor="lm")
        d.ellipse((w - 130, 22, w - 24, 128), fill=L + (255,))
        d.polygon([(w - 92, 50), (w - 92, 100), (w - 52, 75)], fill=BLACK + (255,))
        _S[key] = im
        return im

    def hit(self, t, kind):
        pass

    # ---- раскадровка уақыттары
    def sketch_times(self):
        out = []
        for k, (sc, s) in enumerate(zip(self.sc, self.ts)):
            viz = sc.get("viz")
            if viz == "hook":
                out += [(self.wt(k, "келеді") + 0.4, "хук 1"), (s["speech_e"] - 0.2, "хук 2")]
            elif viz == "list":
                for i in (0, 3):
                    out.append((self.wt(k, sc["items"][i][1]) + 0.9, "тізім %02d" % (i + 1)))
            elif viz == "words":
                for i in (2, 4):
                    out.append((self.wt(k, sc["items"][i][1]) + 0.5, sc["items"][i][0]))
            else:
                out.append((s["s"] + (s["speech_e"] - s["s"]) * 0.85, viz))
        return out[:14]


# ---------------------------------------------------------------- дыбыс
def sfx_lime(plan, tl, path, bed=False):
    sr = 48000
    n = int((tl["dur"] + 1) * sr)
    out = np.zeros(n, np.float32)
    rng = np.random.default_rng(7)

    def add(i, s):
        i = max(0, int(i))
        L = min(len(s), n - i)
        if L > 0:
            out[i:i + L] += s[:L]

    def whoosh(t, vol=0.14):
        L = int(0.5 * sr)
        x = np.linspace(0, 1, L)
        s = np.convolve(rng.standard_normal(L), np.ones(26) / 26, "same") * np.exp(-((x - 0.6) ** 2) / 0.035)
        add((t - 0.3) * sr, s * vol * 3)

    def pop(t, vol=0.16, f0=1300):
        L = int(0.09 * sr)
        x = np.arange(L) / sr
        f = f0 * np.exp(-x * 18) + 500
        add(t * sr, np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-x * 45) * vol)

    def impact(t, vol=0.45):
        L = int(0.7 * sr)
        x = np.arange(L) / sr
        f = 120 * np.exp(-x * 6) + 40
        add(t * sr, np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-x * 5) * vol)

    def tick(t, vol=0.08):
        L = int(0.02 * sr)
        add(t * sr, rng.standard_normal(L) * np.exp(-np.arange(L) / sr * 300) * vol)

    for sc, t in zip(plan["scenes"], tl["scenes"]):
        st = t["s"]
        if st > 0.1:
            whoosh(st)
        ws = t["words"]
        viz = sc.get("viz")
        for it in sc.get("items", []):
            pop(word_time(ws, it[1], st) - 0.1, 0.2, 1500)
        if viz == "hook":
            for key in ("claude", "монтаж", "үйренгің", "келеді"):
                pop(word_time(ws, key, st), 0.14)
            impact(word_time(ws, "ноутбугың", st) + 0.35, 0.35)
        elif viz == "strike":
            impact(word_time(ws, "capcut", st), 0.4)
            impact(word_time(ws, "қолданбадым", st), 0.3)
        elif viz == "phone":
            impact(word_time(ws, "жеткілікті", st), 0.3)
        elif viz == "claude":
            impact(word_time(ws, "claude", st), 0.45)
        elif viz == "timer":
            t10 = word_time(ws, "10", st + 3)
            x = st
            while x < t10:
                tick(x)
                x += 0.25
            impact(t10, 0.45)
        elif viz == "cta":
            pop(word_time(ws, "подробнее", st), 0.22, 1100)
            pop(word_time(ws, "бас", st), 0.22, 1700)
    if bed:
        # жеңіл бит (музыка орнына): 100 bpm kick + hat
        T = np.arange(n) / sr
        beat = 60 / 100
        L = int(0.35 * sr)
        x = np.arange(L) / sr
        kick = np.sin(2 * np.pi * np.cumsum(95 * np.exp(-x * 22) + 48) / sr) * np.exp(-x * 9) * 0.16
        hl = int(0.03 * sr)
        hat = rng.standard_normal(hl) * np.exp(-np.arange(hl) / sr * 170) * 0.022
        bass = np.sin(2 * np.pi * 55 * np.arange(int(beat * sr)) / sr) * np.exp(-np.arange(int(beat * sr)) / sr * 4) * 0.05
        b = 0.0
        j = 0
        while b < tl["dur"] - 0.8:
            add(b * sr, kick)
            add((b + beat / 2) * sr, hat)
            if j % 2 == 0:
                add(b * sr, bass)
            b += beat
            j += 1
        fade = np.clip((tl["dur"] + 0.6 - T) / 1.5, 0, 1).astype(np.float32)
        out *= np.where(T > tl["dur"] - 1.5, fade, 1).astype(np.float32)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(out, -0.9, 0.9) * 32767).astype(np.int16).tobytes())


# ---------------------------------------------------------------- обложка
def render_cover(plan, out):
    L = M.hex2rgb(plan.get("theme", {}).get("accent", "#E4FF1A"))
    cv = plan.get("cover", {})
    im = Image.new("RGBA", (W, H), L + (255,))
    d = ImageDraw.Draw(im)
    for x in range(60, W, 90):
        d.line((x, 0, x, H), fill=(30, 30, 10, 255), width=3)
    paste(im, text_sprite(cv.get("top", "НОУТБУКСЫЗ"), 170, BLACK), 540, 430, 1, 1)
    paste(im, pill_sprite("CLAUDE", 230, L, BLACK), 540, 680, 1, 1, rot=-3)
    paste(im, text_sprite(cv.get("mid", "МОНТАЖ"), 280, BLACK), 540, 960, 1, 1)
    paste(im, pill_sprite(cv.get("bottom", "ТЕК ТЕЛЕФОН"), 90, L, BLACK), 540, 1210, 1, 1, rot=-4)
    f = rub(30, 600)
    d.text((92, 236), plan.get("theme", {}).get("label", "CLAUDE МОНТАЖ"), font=f, fill=(30, 30, 10, 255))
    im.convert("RGB").save(out, quality=93)
    return out
