"""Sintetiza todos los efectos de sonido del video y una base musical, sin descargar nada.
Uso: python scripts/sfx.py   → assets/sfx/*.wav y assets/musica/base.wav
Si luego consigues efectos mejores (Pixabay, Freesound), reemplaza los archivos con el mismo nombre.
Requiere: pip install numpy
"""
import wave
from pathlib import Path
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(7)


def t(d): return np.linspace(0, d, int(SR * d), endpoint=False)
def env(n, a=0.005, r=0.2):
    e = np.ones(n); na, nr = int(SR * a), int(SR * r)
    e[:na] = np.linspace(0, 1, na) if na else 1
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def lp(x, k):  # pasa bajos simple (media móvil)
    return np.convolve(x, np.ones(k) / k, mode="same")
def ruido(d): return rng.uniform(-1, 1, int(SR * d))
def guardar(nombre, x, carpeta="assets/sfx"):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    p = RAIZ / carpeta / nombre; p.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def whoosh(d=0.45):
    n = ruido(d); tt = t(d)
    x = sum(lp(n, k) * np.exp(-((tt - d * c) ** 2) / 0.004) for k, c in ((40, .35), (12, .5), (5, .6)))
    return x * env(len(x), .01, .1)

def boom(d=1.2, f0=55):
    tt = t(d); f = f0 * np.exp(-tt * 3)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.5)
    return x + lp(ruido(d), 30) * np.exp(-tt * 12) * 0.8

efectos = {
    "whoosh.wav": whoosh(),
    "pop.wav": np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t(.12) * 25) + 300) / SR) * np.exp(-t(.12) * 30),
    "tension.wav": sum(np.sin(2 * np.pi * f * t(2.2)) for f in (73.4, 77.8, 146.8)) * np.linspace(0, 1, int(SR * 2.2)) ** 2,
    "bocina_tren.wav": sum(np.sign(np.sin(2 * np.pi * f * t(1.0))) for f in (311, 370, 466)) * env(int(SR * 1.0), .03, .15) * 0.4,
    "impacto.wav": boom(1.3, 60),
    "caida_silbido.wav": np.sin(2 * np.pi * np.cumsum(np.linspace(2400, 500, int(SR * .7))) / SR) * env(int(SR * .7), .05, .05),
    "impacto_carro.wav": boom(1.0, 45) + lp(ruido(1.0), 3) * np.exp(-t(1.0) * 8) * 0.6,
    "alarma_carro.wav": np.sin(2 * np.pi * np.where((t(1.6) * 4).astype(int) % 2, 1200, 900) * t(1.6)) * env(int(SR * 1.6), .01, .3) * 0.6,
    "click_maletin.wav": np.concatenate([lp(ruido(.02), 2) * np.exp(-t(.02) * 200), np.zeros(int(SR * .12)), lp(ruido(.02), 2) * np.exp(-t(.02) * 200)]),
    "destello.wav": sum(np.sin(2 * np.pi * f * t(1.4)) for f in (880, 1320, 1760, 2640)) * np.linspace(0, 1, int(SR * 1.4)) ** 3 + lp(ruido(1.4), 3) * np.linspace(0, 1, int(SR * 1.4)) ** 4,
    "rayo.wav": np.concatenate([lp(ruido(1.0), 4) * np.linspace(0, 1, SR) ** 2, boom(1.8, 40)]),
}
for nombre, x in efectos.items():
    guardar(nombre, x)

# Base musical: pulso oscuro a 100 bpm, 70 s
dur, bpm = 70, 100
tt = t(dur); beat = 60 / bpm
kick = np.zeros_like(tt)
for k in np.arange(0, dur, beat):
    i = int(k * SR); seg = boom(0.35, 70)[: len(tt) - i]; kick[i:i + len(seg)] += seg
bajo = np.sin(2 * np.pi * 55 * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / beat)) * 0.25
pad = sum(np.sin(2 * np.pi * f * tt) for f in (220, 261.6, 329.6)) * 0.05 * (0.6 + 0.4 * np.sin(2 * np.pi * tt / 8))
guardar("base.wav", kick * 0.6 + bajo + pad, "assets/musica")
print(f"Listo: {len(efectos)} efectos en assets/sfx/ y assets/musica/base.wav")
