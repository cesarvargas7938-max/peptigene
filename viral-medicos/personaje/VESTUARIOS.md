# Vestuarios del personaje — catálogo de looks

## ⚠️ Regla principal: el rostro de la imagen 4 no se toca

El rostro aprobado es el de la **imagen 4** (look urbano, caminando en la calle):
[ver imagen](https://d8j0ntlcm91z4.cloudfront.net/user_3Gus2S4ZJPfHRFHzXsC14YRPGbw/hf_20260926_212000_8ddac15a-7e35-494e-a417-50d833e1aa8d.png)
(job_id `8ddac15a-7e35-494e-a417-50d833e1aa8d`).

Las generaciones desde cero con el Soul no mantuvieron bien el parecido, así que a partir de ahora:

1. **Cambio de vestuario = editar la imagen 4**, no generar una imagen nueva desde cero.
   Se pasa la imagen 4 como referencia (`image_references`) y solo se cambia la ropa (y si se pide, pose o fondo).
2. Modelo: `gpt_image_2_5` (calidad medium, 2k, 9:16, ~1 crédito). Alternativa: `nano_banana_2` 2k (~2 créditos).
3. Prompt base (en `personaje.json` → `rostro_maestro.prompt_cambio_vestuario`):
   > Keep the exact same man from the reference image: identical face, facial features, beard, hairline,
   > haircut, skin tone and body proportions. Do not change his face in any way. Only change his clothing
   > to: {ROPA}. {ESCENA}.
4. Si la cara cambia en el resultado, se descarta y se repite; nunca se aprueba una imagen con otro rostro.
5. Las tomas del reel también parten de la imagen 4 (o de una edición aprobada de ella).

---

El personaje es siempre el mismo (rasgos de la sección 2 de `FICHA_PERSONAJE.md`). Lo único que
cambia entre videos es la ropa. **Dentro de un mismo video se usa un solo look**, para que se vea
continuo aunque cambie de locación.

Reglas que aplican a todos los looks:
- Nunca bata médica, estetoscopio ni uniforme quirúrgico: él no es médico.
- Sin logos de marcas, sin texto en la ropa, sin gafas puestas.
- Tatuajes tapados en los looks formales. En los casuales (manga corta) se permiten.
- Paleta base del personaje: **azul marino, blanco, negro, beige/camel**. Nada de estampados fuertes.

---

## Look 1 · Ejecutivo — ❌ no aprobado

| | |
|---|---|
| **Cuándo** | Reels de autoridad, ataque al "enemigo" (gurús/agencias), CTAs de venta. |
| **Transmite** | "Sé de negocio. Te hablo de pacientes y agenda, no de likes." |
| **Ropa** | Traje azul marino slim, camisa blanca, corbata azul oscura, pañuelo blanco, Oxford negros, reloj plateado. |
| **Locaciones** | Calle financiera, Bolsa, metro, oficina con vidrio. |

Prompt:
> wearing a slim navy blue two-piece suit, crisp white shirt, dark navy solid tie, white pocket
> square, silver metal watch on left wrist, black leather oxford shoes

---

## Look 2 · Smart casual — consultor — ❌ no aprobado

| | |
|---|---|
| **Cuándo** | Videos educativos para médicos, "3 errores de tu Instagram", análisis de perfiles. |
| **Transmite** | Experto cercano: sabe, pero no es acartonado. |
| **Ropa** | Blazer camel/beige sin corbata, camiseta blanca lisa de cuello redondo, pantalón azul marino, mocasines marrones, reloj plateado. |
| **Locaciones** | Café, coworking, escritorio con laptop, terraza de ciudad. |

Prompt:
> wearing an unstructured camel beige blazer over a plain white crew-neck t-shirt, slim navy
> chinos, brown suede loafers, silver metal watch on left wrist

---

## Look 3 · Total white — lifestyle (su estilo real) — ❌ no aprobado

| | |
|---|---|
| **Cuándo** | Contenido de marca personal, "detrás de cámaras", viajes, historias. |
| **Transmite** | Libertad, resultados, estilo de vida (sale de sus propias fotos en blanco). |
| **Ropa** | Camiseta blanca con ribete negro en el cuello, pantalón blanco recto, tenis blancos. |
| **Locaciones** | Mirador sobre el mar, beach club, villa con piscina. |

Prompt:
> wearing a white t-shirt with a thin black patterned trim on the collar, straight white trousers,
> clean white sneakers

---

## Look 4 · Urbano — creador ✅ APROBADO (principal, reel "El café")

| | |
|---|---|
| **Cuándo** | Tutoriales rápidos ("cómo grabar con el celular"), tendencias, videos en la calle. |
| **Transmite** | Hace contenido él mismo, sabe cómo funciona el algoritmo. |
| **Ropa** | Overshirt negro abierto sobre camiseta blanca, jean negro, tenis blancos, celular en mano. |
| **Locaciones** | Calle con grafiti suave, escaleras de metro, azotea. |

Prompt:
> wearing an open black cotton overshirt over a plain white t-shirt, black slim jeans, white
> sneakers, holding a black smartphone

---

## Look 5 · Estudio / podcast — ❌ no aprobado

| | |
|---|---|
| **Cuándo** | Entrevistas, clips largos hablando a cámara, lives, lead magnets en video. |
| **Transmite** | Calma, credibilidad, conversación uno a uno. |
| **Ropa** | Suéter de punto fino negro, cuello redondo, mangas un poco subidas; reloj plateado. |
| **Locaciones** | Estudio oscuro con luz cálida lateral, micrófono de podcast, estantería desenfocada. |

Prompt:
> wearing a fine-knit black crew-neck sweater with sleeves slightly pushed up, silver metal watch,
> sitting at a desk with a podcast microphone, warm side light, dark studio background

---

## Cómo se usa

1. En `personaje/personaje.json` → `looks.<id>.prompt` está el texto de cada look.
2. En la shotlist, `{PERSONAJE}` = `descripcion_base` + el prompt del look del video + `soul_id`.
3. El reel "El café" usa **solo el Look 4 · Urbano** (aprobado).
4. Solo el Look 4 está aprobado. Los looks 1, 2, 3 y 5 no convencieron en las pruebas y no se
   usan hasta rehacerlos.
5. Antes de usar un look nuevo en un video, se genera 1 retrato de prueba con el Soul y se aprueba.
