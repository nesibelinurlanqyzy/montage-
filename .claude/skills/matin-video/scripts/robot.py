#!/usr/bin/env python3
"""robot.py — «робот» стилі: қара фон, қызғылт-сары акцент, микрофонмен сөйлейтін робот кейіпкер,
жоғарыда үлкен тақырып + қараңғы UI карточка, ортада сөзбе-сөз субтитр (акцент сөз — курсив серифпен).
Дауыс — пайдаланушының дайын аудиосы (mult.py-дағыдай уақыттау).

Жоспар өрістері: "style": "robot", "audio", "audio_orig", "tag" (жоғарғы кішкентай жазу), "rec" (төменгі REC жазуы)
Сахна: "card" (player | phone | nolist | checks | toggle | zero | cta), "title" (*акцент*), "pose" (talk | wave | point),
       "text", cta үшін "button".
  python3 scripts/robot.py prep|raskadrovka|render PLAN.json [--max-mb 90]
"""
import argparse, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import mult  # noqa: E402

mult.MULT = os.path.join(os.path.dirname(HERE), "robot")
_prep = mult.prep


def prep(plan):
    data, wd = _prep(plan)
    P = json.load(open(plan, encoding="utf-8"))
    data["tag"] = P.get("tag", "сабақ · claude")
    data["rec"] = P.get("rec", "сабақ")
    for sc, ps in zip(data["scenes"], P["scenes"]):
        sc["title"] = ps.get("title", "")
        sc["button"] = ps.get("button", "Подробнее")
    json.dump(data, open(os.path.join(wd, "data.json"), "w"), ensure_ascii=False)
    return data, wd


mult.prep = prep

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("cmd"); ap.add_argument("plan"); ap.add_argument("--max-mb", type=float, default=90)
    a = ap.parse_args()
    {"prep": lambda: prep(a.plan), "raskadrovka": lambda: mult.raskadrovka(a.plan),
     "render": lambda: mult.render(a.plan, a.max_mb)}[a.cmd]()
