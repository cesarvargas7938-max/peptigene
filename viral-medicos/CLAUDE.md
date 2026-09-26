# Proyecto: video viral para médicos 100 % con IA (César como personaje)

Objetivo: producir `salida/final.mp4`, un reel vertical de ~55 s que replica la estructura,
el ritmo y la edición del reel de referencia (`referencia/estructura_referencia.md` y
`referencia/sheet*.jpg`), con César como personaje generado con IA, hablándoles a médicos.
César NO graba nada. Todo se genera con IA y se monta con los scripts de `scripts/`.

## Solo hay 2 momentos en que debes parar y preguntarle a César
1. **Aprobar el personaje y la voz** (paso 2 y 3): muéstrale 3 retratos y 3 muestras de voz.
2. **Aprobar el costo total en créditos** (paso 5) antes de generar las tomas.
Todo lo demás lo decides tú: eliges la mejor variante de cada toma revisando fotogramas.

## Herramientas
- **Higgsfield (MCP)**: personaje, imágenes, video, voz y lipsync.
  Usa `models_explore` para confirmar modelos, parámetros y roles de medios antes de usarlos.
  Usa `get_cost: true` para calcular costos. Usa las versiones `_batch` para generar en paralelo
  y `jobs_wait` para esperar. Crea un proyecto (`create_project`) y usa su `folder_id` siempre.
- **Local**: ffmpeg, Python (`pip install -r requirements.txt`), scripts de `scripts/`.

## Paso 1 · Preparar
- `pip install -r requirements.txt` y verifica que `ffmpeg -version` funcione.
- Descarga la fuente Montserrat (repositorio google/fonts en GitHub, carpeta ofl/montserrat)
  y guarda el .ttf en `assets/fuentes/`.
- `python scripts/sfx.py` → efectos de sonido y música base.

## Paso 2 · Personaje (César)
- Fotos en `assets/fotos_cara/` (5–20). Súbelas a Higgsfield (media_upload → PUT de los bytes
  con curl → media_confirm) y entrena un Soul Character (`show_characters`, action=train,
  type=soul_2, name="Cesar"). Tarda ~10 min: mientras tanto adelanta el paso 3.
- Genera 3 retratos con `soul_2` + `soul_id` con el look aprobado (Look 4 · Urbano, ver
  `personaje/personaje.json` → `descripcion`), piel y luz mejoradas pero sin cambiar sus rasgos. Nunca bata médica: César no es médico.
- Guarda el aprobado en `assets/personaje/` (es la referencia de todas las tomas).

## Paso 3 · Voz (sin grabar)
- Si hay un audio en `assets/audio/muestra/` (una nota de voz vieja de César, 10 s a 3 min),
  clona su voz con Higgsfield (media_upload → media_confirm → create_voice_from_confirmed_audio)
  y espera a que `list_voices` la marque como lista.
- Si no hay audio, elige 3 voces masculinas en español latino de `list_voices` y que César escoja.
- Genera cada línea de `guion/lineas.json` como un audio aparte (`generate_audio_batch`,
  modelo seed_audio) y descárgalas en orden como `tmp/voz/01.mp3`, `02.mp3`, …
- `python scripts/armar_voz.py` → `assets/audio/voz.wav`
- `python scripts/transcribir.py` → `tmp/palabras.json` y `tmp/subtitulos.ass`.
  Corrige errores de transcripción en palabras.json y corre `--solo-ass` si hace falta.
- `python scripts/montar.py --prueba` → revisa que los tiempos de cada toma tengan sentido.

## Paso 4 · Overlays
- Para cada entrada de `overlays` en `shots/shotlist.json`, genera 3 imágenes verticales
  (personas ficticias) y guárdalas en `assets/overlays/fuentes/<nombre>/`.
- `python scripts/overlays.py` → tiras de reels, lead magnet, comentario y logo.

## Paso 5 · Tomas
- Calcula el costo de todas las tomas (imagen + video, 3 variantes) con `get_cost` y
  muéstrale el total a César. Espera su OK.
- Por cada toma de `shots/shotlist.json` (salta las que tienen `reutiliza`):
  1. Imagen: reemplaza `{PERSONAJE}` por el Soul de César (modelo `soul_2` + `soul_id`).
     Tomas sin personaje: modelo de imagen general. Siempre 9:16.
  2. Video: imagen → video con `prompt_video` (usa seedance o kling según `models_explore`),
     9:16, duración ≥ la que calcula montar.py para esa toma.
  3. Tomas con `"habla": true`: recorta de `voz.wav` el tramo de esa toma (tiempos de
     palabras.json) y aplica lipsync con el modelo de Higgsfield que acepte video/imagen + audio.
  4. Genera 3 variantes, extrae fotogramas con ffmpeg, revisa cara, manos y física,
     y guarda la mejor en la ruta `clip`.

## Paso 6 · Montaje y revisión
- `python scripts/montar.py` → `salida/final.mp4`.
- Extrae un fotograma por segundo, revisa todo el video y corrige lo que falle
  (toma rara → regenera esa sola toma y vuelve a montar).
- Entrégale a César el video y un caption corto con la palabra clave del CTA.

## Reglas de edición (no las cambies)
- 45–60 s, 1080x1920, 30 fps. Cortes cada 2–4 s (la toma 02 puede ser larga, como en la referencia).
- Subtítulos de 1–3 palabras a media altura; palabras de `enfasis` en grande.
- Cuatro ciclos abiertos que NUNCA se resuelven: el café, el sesgo (tren), "lo más importante,
  el…" (Ferrari) y el maletín (destello).
- Efecto de sonido en cada impacto. El CTA retoma el café (callback) y pide comentar la palabra clave.

## Reglas de contenido
- César habla como experto en contenido, no como médico. Sin promesas de resultados clínicos.
- Personas de los overlays: ficticias. Nada de logos de marcas reales.
- Al publicar en Instagram, activar la etiqueta "Hecho con IA".
