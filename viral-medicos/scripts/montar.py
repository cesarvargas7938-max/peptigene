"""Monta el video final a partir de shots/shotlist.json.

- Calcula dónde empieza cada toma usando las 'anclas' del guion en tmp/palabras.json
  (así los cortes caen exactamente en la palabra correcta).
- Recorta/escala cada clip a 1080x1920, le pone overlays y oscurece el cierre.
- Mezcla voz + música + efectos de sonido en su segundo exacto.
- Quema los subtítulos (tmp/subtitulos.ass) y el end card con la arroba.

Uso: python scripts/montar.py            → salida/final.mp4
     python scripts/montar.py --prueba   → usa placas grises donde falten clips
Requiere: ffmpeg en el PATH.
"""
import argparse, json, re, subprocess, sys, unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ESTILO = json.loads((RAIZ / "estilo/estilo.json").read_text(encoding="utf-8"))
W, H, FPS = 1080, 1920, 30


def norm(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9ñ ]", "", t).strip()


def ff(args):
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", *args], cwd=RAIZ, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"ffmpeg falló:\n{r.stderr}")


def existe(p):
    return p and (RAIZ / p).exists()


def calcular_tiempos(tomas, palabras):
    ptr = 0
    for n, t in enumerate(tomas):
        if t.get("ancla") and palabras:
            obj = norm(t["ancla"]).split()
            for i in range(ptr, len(palabras) - len(obj) + 1):
                if [p["norm"] for p in palabras[i:i + len(obj)]] == obj:
                    ref = palabras[i + len(obj) - 1]["fin"] if t.get("punto") == "fin" else palabras[i]["inicio"]
                    t["_inicio"] = ref + t.get("desfase", 0)
                    ptr = i + len(obj)
                    break
            else:
                sys.exit(f"No encontré el ancla '{t['ancla']}' de la toma {t['id']} en tmp/palabras.json")
        elif n == 0:
            t["_inicio"] = t.get("inicio", 0)
        else:
            prev = tomas[n - 1]
            t["_inicio"] = prev["_inicio"] + prev.get("dur", 3.0)
    for n, t in enumerate(tomas):
        t["_dur"] = (tomas[n + 1]["_inicio"] - t["_inicio"]) if n + 1 < len(tomas) else t.get("dur", 3.0)
        if t["_dur"] <= 0.2:
            sys.exit(f"La toma {t['id']} dura {t['_dur']:.2f}s. Revisa las anclas o alarga la pausa en la voz.")
    return tomas


def render_toma(t, i, prueba):
    salida = f"tmp/seg{i:02d}.mp4"
    base = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},setsar=1"
    if existe(t["clip"]):
        entradas = ["-stream_loop", "-1", "-i", t["clip"]]
    elif prueba:
        print(f"  ⚠ falta {t['clip']}: uso placa gris")
        entradas = ["-f", "lavfi", "-i", f"color=c=0x444444:s={W}x{H}:r={FPS}"]
    else:
        sys.exit(f"Falta el clip {t['clip']} (usa --prueba para montar con placas)")
    filtro = f"[0:v]{base}[v]"
    ultimo = "[v]"
    if t.get("overlay"):
        if existe(t["overlay"]):
            entradas += ["-loop", "1", "-i", t["overlay"]]
            filtro += f";[1:v]scale=960:-1[ov];[v][ov]overlay=(W-w)/2:170:shortest=1[v2]"
            ultimo = "[v2]"
        else:
            print(f"  ⚠ falta overlay {t['overlay']} (se omite)")
    if t.get("oscurecer"):
        filtro += f";{ultimo}drawbox=c=black@0.65:t=fill:enable='gte(t,0.3)'[v3]"
        ultimo = "[v3]"
        logo = "assets/overlays/logo.png"
        if existe(logo):
            k = len([e for e in entradas if e == "-i"])
            entradas += ["-loop", "1", "-i", logo]
            filtro += f";[{k}:v]scale=220:-1[lg];{ultimo}[lg]overlay=(W-w)/2:(H-h)/2-80:enable='gte(t,0.3)':shortest=1[v4]"
            ultimo = "[v4]"
    ff([*entradas, "-t", f"{t['_dur']:.3f}", "-filter_complex", filtro, "-map", ultimo,
        "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", salida])
    return salida


def ass_final(tomas, total):
    src = RAIZ / "tmp/subtitulos.ass"
    if not src.exists():
        print("  ⚠ no hay tmp/subtitulos.ass: el video sale sin subtítulos")
        return None
    txt = src.read_text(encoding="utf-8")
    cierre = tomas[-1]
    ini = cierre["_inicio"] + 0.3
    h = lambda s: f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:05.2f}"
    txt += f"Dialogue: 2,{h(ini)},{h(total)},Sub,,0,0,0,,{{\\an5\\pos(540,1060)\\fs54}}{ESTILO['arroba']}\n"
    (RAIZ / "tmp/final.ass").write_text(txt, encoding="utf-8")
    return "tmp/final.ass"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prueba", action="store_true")
    a = ap.parse_args()
    (RAIZ / "tmp").mkdir(exist_ok=True)
    (RAIZ / "salida").mkdir(exist_ok=True)
    tomas = json.loads((RAIZ / "shots/shotlist.json").read_text(encoding="utf-8"))["tomas"]
    pal_path = RAIZ / "tmp/palabras.json"
    palabras = json.loads(pal_path.read_text(encoding="utf-8")) if pal_path.exists() else []
    for p in palabras:
        p["norm"] = norm(p["texto"])
    if not palabras:
        print("  ⚠ sin tmp/palabras.json: uso 'dur' (o 3 s) para todas las tomas")
    calcular_tiempos(tomas, palabras)
    total = tomas[-1]["_inicio"] + tomas[-1]["_dur"]

    print("Tomas:")
    segs = []
    for i, t in enumerate(tomas):
        print(f"  {t['id']:<20} {t['_inicio']:6.2f}s  dura {t['_dur']:.2f}s")
        segs.append(render_toma(t, i, a.prueba))
    (RAIZ / "tmp/lista.txt").write_text("".join(f"file '{Path(s).name}'\n" for s in segs))
    ff(["-f", "concat", "-safe", "0", "-i", "tmp/lista.txt", "-c", "copy", "tmp/video.mp4"])

    # Audio: voz + música + efectos
    entradas, filtros, etiquetas = [], [], []
    def agregar(ruta, filtro, extra=()):
        k = len(etiquetas)
        entradas.extend([*extra, "-i", ruta])
        filtros.append(f"[{k}:a]{filtro}[a{k}]")
        etiquetas.append(f"[a{k}]")
    voz = "assets/audio/voz.wav"
    if existe(voz):
        ms = int(ESTILO["voz_inicio"] * 1000)
        agregar(voz, f"adelay={ms}|{ms},aresample=48000")
    else:
        print("  ⚠ falta assets/audio/voz.wav")
    musica = next((str(p.relative_to(RAIZ)) for p in sorted((RAIZ / "assets/musica").glob("*")) if p.suffix in (".mp3", ".wav", ".m4a")), None)
    if musica:
        agregar(musica, f"volume={ESTILO['volumen_musica']},afade=t=out:st={max(0, total - 2):.2f}:d=2,aresample=48000", ("-stream_loop", "-1"))
    for t in tomas:
        for s in t.get("sfx", []):
            if existe(s["archivo"]):
                ms = int((t["_inicio"] + s.get("en", 0)) * 1000)
                agregar(s["archivo"], f"volume={ESTILO.get('volumen_sfx', 0.6)},adelay={ms}|{ms},aresample=48000")
            else:
                print(f"  ⚠ falta efecto {s['archivo']}")

    args = ["-i", "tmp/video.mp4", *entradas]
    vf = "[0:v]null[vo]"
    ass = ass_final(tomas, total)
    if ass:
        fuentes = "assets/fuentes"
        vf = f"[0:v]ass={ass}:fontsdir={fuentes}[vo]"
    fc = [vf]
    if etiquetas:
        # los índices de audio empiezan en 1 porque la entrada 0 es el video
        fc += [f.replace(f"[{k}:a]", f"[{k + 1}:a]", 1) for k, f in enumerate(filtros)]
        fc.append(f"{''.join(etiquetas)}amix=inputs={len(etiquetas)}:normalize=0,alimiter=limit=0.95[ao]")
        mapa = ["-map", "[vo]", "-map", "[ao]", "-c:a", "aac", "-b:a", "192k"]
    else:
        mapa = ["-map", "[vo]"]
    ff([*args, "-filter_complex", ";".join(fc), *mapa, "-t", f"{total:.3f}",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "salida/final.mp4"])
    print(f"\nListo: salida/final.mp4 ({total:.1f} s)")


if __name__ == "__main__":
    main()
