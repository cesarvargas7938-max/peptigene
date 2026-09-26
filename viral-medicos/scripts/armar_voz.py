"""Une los audios de voz IA (uno por línea) en assets/audio/voz.wav con las pausas del guion.

Claude Code genera cada línea de guion/lineas.json con la voz de César en Higgsfield
y la descarga como tmp/voz/01.mp3, 02.mp3, ... (en el mismo orden).
Uso: python scripts/armar_voz.py
"""
import json, subprocess, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
lineas = json.loads((RAIZ / "guion/lineas.json").read_text(encoding="utf-8"))["lineas"]
carpeta = RAIZ / "tmp/voz"
archivos = sorted(p for p in carpeta.glob("*") if p.suffix.lower() in (".mp3", ".wav", ".m4a"))
if len(archivos) != len(lineas):
    sys.exit(f"Hay {len(archivos)} audios en tmp/voz y {len(lineas)} líneas en el guion. Deben coincidir.")

entradas, filtros = [], []
for i, (a, l) in enumerate(zip(archivos, lineas)):
    entradas += ["-i", str(a)]
    # recorta silencios del principio/fin de cada línea y añade la pausa exacta del guion
    filtros.append(
        f"[{i}:a]aresample=48000,aformat=channel_layouts=mono,"
        f"silenceremove=start_periods=1:start_threshold=-45dB,"
        f"areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
        f"apad=pad_dur={l['pausa']}[l{i}]"
    )
concat = "".join(f"[l{i}]" for i in range(len(lineas))) + f"concat=n={len(lineas)}:v=0:a=1,loudnorm=I=-16:TP=-1.5[out]"
(RAIZ / "assets/audio").mkdir(parents=True, exist_ok=True)
r = subprocess.run(["ffmpeg", "-y", "-v", "error", *entradas, "-filter_complex", ";".join(filtros + [concat]),
                    "-map", "[out]", str(RAIZ / "assets/audio/voz.wav")], capture_output=True, text=True)
if r.returncode:
    sys.exit(r.stderr)
dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                      str(RAIZ / "assets/audio/voz.wav")], capture_output=True, text=True).stdout.strip()
print(f"Listo: assets/audio/voz.wav ({float(dur):.1f} s)")
