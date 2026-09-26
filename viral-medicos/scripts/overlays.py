"""Arma los overlays que van arriba del personaje, como en el reel de referencia.

Tiras de reels: pon 3 imágenes (generadas con IA) en assets/overlays/fuentes/<nombre>/
y este script las convierte en assets/overlays/<nombre>.png con tarjetas redondeadas
y contador de vistas. También crea lead_magnet.png, comentario_pacientes.png y logo.png.

Uso: python scripts/overlays.py
Requiere: pip install pillow
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
OV = RAIZ / "assets/overlays"
ESTILO = json.loads((RAIZ / "estilo/estilo.json").read_text(encoding="utf-8"))
FUENTES = sorted((RAIZ / "assets/fuentes").glob("*.ttf"))

TIRAS = {  # nombre de carpeta → vistas que aparecen en cada tarjeta
    "reels_medicos_virales": ["1,2 M", "4,2 M", "7,1 M"],
    "reels_medicos_virales_2": ["890 K", "2,3 M", "15,6 K"],
    "gurus": ["20,1 K", "10,5 K", "8.358"],
    "gurus_2": ["11,9 M", "18,6 M", "12,4 K"],
}


def fuente(tam):
    if not FUENTES:
        raise SystemExit("Falta la fuente: pon Montserrat-Bold.ttf en assets/fuentes/ (sin ella no salen bien las tildes).")
    return ImageFont.truetype(str(FUENTES[0]), tam)


def redondear(img, r):
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, *img.size), r, fill=255)
    img.putalpha(m)
    return img


def tira(nombre, vistas):
    fotos = sorted(p for p in (OV / "fuentes" / nombre).glob("*") if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"))[:3]
    if not fotos:
        print(f"  ⚠ sin imágenes en assets/overlays/fuentes/{nombre}/ (se omite)")
        return
    cw, ch, gap = 290, 440, 25
    lienzo = Image.new("RGBA", (cw * len(fotos) + gap * (len(fotos) - 1), ch), (0, 0, 0, 0))
    for i, (f, v) in enumerate(zip(fotos, vistas)):
        card = ImageOps.fit(Image.open(f).convert("RGBA"), (cw, ch))
        d = ImageDraw.Draw(card)
        d.rectangle((0, ch - 70, cw, ch), fill=(0, 0, 0, 110))
        d.polygon([(18, ch - 50), (18, ch - 22), (40, ch - 36)], fill="white")
        d.text((52, ch - 36), v, font=fuente(30), fill="white", anchor="lm")
        lienzo.alpha_composite(redondear(card, 28), (i * (cw + gap), 0))
    lienzo.save(OV / f"{nombre}.png")
    print(f"  ✓ {nombre}.png")


def lead_magnet():
    W, H = 960, 300
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for i in range(3):
        x = i * 330
        d.rounded_rectangle((x, 0, x + 300, H), 22, fill=(18, 18, 20, 240), outline=(80, 80, 85, 255), width=2)
        d.text((x + 150, 90), "Guía gratis", font=fuente(26), fill=(180, 180, 185), anchor="mm")
        d.multiline_text((x + 150, 165), "Cómo llenar tu\nagenda con video", font=fuente(32), fill="white", anchor="mm", align="center", spacing=8)
        d.rounded_rectangle((x + 60, 235, x + 240, 272), 18, fill=(0, 149, 246))
        d.text((x + 150, 253), "Descargar", font=fuente(22), fill="white", anchor="mm")
    img.save(OV / "lead_magnet.png")
    print("  ✓ lead_magnet.png")


def comentario(palabra):
    W, H = 960, 120
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, W, H), 60, fill=(38, 38, 38, 235))
    d.ellipse((24, 24, 96, 96), fill=(120, 120, 120, 255))
    d.text((124, 60), palabra.upper(), font=fuente(44), fill="white", anchor="lm")
    d.ellipse((W - 104, 20, W - 24, 100), fill=(0, 149, 246, 255))
    d.polygon([(W - 64, 38), (W - 84, 62), (W - 44, 62)], fill="white")
    d.rectangle((W - 69, 60, W - 59, 82), fill="white")
    img.save(OV / f"comentario_{palabra.lower()}.png")
    print(f"  ✓ comentario_{palabra.lower()}.png")


def logo():
    S = 220
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((10, 10, S - 10, S - 10), 55, outline="white", width=14)
    d.polygon([(85, 65), (85, 155), (160, 110)], fill="white")  # ícono de play genérico
    img.save(OV / "logo.png")
    print("  ✓ logo.png")


if __name__ == "__main__":
    OV.mkdir(parents=True, exist_ok=True)
    for n, v in TIRAS.items():
        tira(n, v)
    lead_magnet()
    comentario(ESTILO.get("palabra_clave", "PACIENTES"))
    logo()
