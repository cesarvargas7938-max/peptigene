# Vestuarios del personaje — catálogo de looks

El personaje es siempre el mismo (rasgos de la sección 2 de `FICHA_PERSONAJE.md`). Lo único que
cambia entre videos es la ropa. **Dentro de un mismo video se usa un solo look**, para que se vea
continuo aunque cambie de locación.

Reglas que aplican a todos los looks:
- Nunca bata médica, estetoscopio ni uniforme quirúrgico: él no es médico.
- Sin logos de marcas, sin texto en la ropa, sin gafas puestas.
- Tatuajes tapados en los looks formales. En los casuales (manga corta) se permiten.
- Paleta base del personaje: **azul marino, blanco, negro, beige/camel**. Nada de estampados fuertes.

---

## Look 1 · Ejecutivo — *el del reel "El café"* (principal)

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

## Look 2 · Smart casual — consultor

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

## Look 3 · Total white — lifestyle (su estilo real)

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

## Look 4 · Urbano — creador

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

## Look 5 · Estudio / podcast

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
3. El reel "El café" usa **solo el Look 1**.
4. Antes de usar un look nuevo en un video, se genera 1 retrato de prueba con el Soul y se aprueba.
