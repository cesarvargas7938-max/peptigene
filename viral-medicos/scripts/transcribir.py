"""Transcribe assets/audio/voz.wav con marcas de tiempo por palabra y crea:
  - tmp/palabras.json  (tiempos ya desplazados por voz_inicio)
  - tmp/subtitulos.ass (bloques de 1 a 3 palabras, estilo del reel de referencia)

Uso: python scripts/transcribir.py [--modelo small]
Requiere: pip install faster-whisper
"""
import argparse, json, re, unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ESTILO = json.loads((RAIZ / "estilo/estilo.json").read_text(encoding="utf-8"))


def norm(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9ñ ]", "", t).strip()


def ts(s):
    s = max(0.0, s)
    h, r = divmod(s, 3600)
    m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def transcribir(modelo):
    from faster_whisper import WhisperModel
    m = WhisperModel(modelo, compute_type="int8")
    segs, _ = m.transcribe(str(RAIZ / "assets/audio/voz.wav"), language="es", word_timestamps=True)
    off = ESTILO["voz_inicio"]
    return [{"texto": w.word.strip(), "norm": norm(w.word), "inicio": round(w.start + off, 3),
             "fin": round(w.end + off, 3)} for s in segs for w in s.words if norm(w.word)]


def bloques(palabras):
    enf = [norm(e).split() for e in ESTILO["enfasis"]]
    out, actual, i = [], [], 0
    while i < len(palabras):
        match = next((e for e in enf if [p["norm"] for p in palabras[i:i + len(e)]] == e), None)
        if match:
            if actual: out.append((actual, False)); actual = []
            out.append((palabras[i:i + len(match)], True)); i += len(match); continue
        actual.append(palabras[i])
        corta = palabras[i]["texto"][-1:] in ",.?!…" or len(actual) >= ESTILO["palabras_por_bloque"]
        pausa = i + 1 < len(palabras) and palabras[i + 1]["inicio"] - palabras[i]["fin"] > 0.35
        if corta or pausa:
            out.append((actual, False)); actual = []
        i += 1
    if actual: out.append((actual, False))
    return out


def ass(bls, fin_total):
    f, t, te, arroba = ESTILO["fuente"], ESTILO["tamano"], ESTILO["tamano_enfasis"], ESTILO["arroba"]
    cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,{f},{t},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,2,3,2,60,60,760,1
Style: Enfasis,{f},{te},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,95,100,-2,0,1,3,4,2,40,40,760,1
Style: Arroba,{f},30,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,1,2,1,60,60,560,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 1,{ts(0)},{ts(fin_total)},Arroba,,0,0,0,,{arroba}
"""
    lineas = []
    for n, (ws, enf) in enumerate(bls):
        ini = ws[0]["inicio"]
        fin = bls[n + 1][0][0]["inicio"] if n + 1 < len(bls) else ws[-1]["fin"] + 0.4
        fin = min(fin, ws[-1]["fin"] + 0.6)
        texto = " ".join(w["texto"] for w in ws)
        texto = texto.upper() if enf else texto
        # animación de entrada: pequeño "pop"
        anim = r"{\fscx80\fscy80\t(0,80,\fscx100\fscy100)}"
        lineas.append(f"Dialogue: 0,{ts(ini)},{ts(fin)},{'Enfasis' if enf else 'Sub'},,0,0,0,,{anim}{texto}")
    return cab + "\n".join(lineas) + "\n"


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--modelo", default="small")
    ap.add_argument("--solo-ass", action="store_true", help="rehace los subtítulos desde tmp/palabras.json (tras corregirlo a mano)")
    a = ap.parse_args()
    (RAIZ / "tmp").mkdir(exist_ok=True)
    if a.solo_ass:
        pals = json.loads((RAIZ / "tmp/palabras.json").read_text(encoding="utf-8"))
        for p in pals: p["norm"] = norm(p["texto"])
    else:
        pals = transcribir(a.modelo)
        (RAIZ / "tmp/palabras.json").write_text(json.dumps(pals, ensure_ascii=False, indent=1), encoding="utf-8")
    bls = bloques(pals)
    (RAIZ / "tmp/subtitulos.ass").write_text(ass(bls, pals[-1]["fin"] + 10), encoding="utf-8")
    print(f"{len(pals)} palabras, {len(bls)} bloques de subtítulo → tmp/")
    print("Si hay errores de transcripción, corrige el campo texto en tmp/palabras.json y corre: python scripts/transcribir.py --solo-ass")
