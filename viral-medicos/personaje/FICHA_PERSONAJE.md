# Ficha del personaje — César (versión IA)

Documento base para que el personaje salga **igual en las 20 tomas**. Todo lo que se genere
(retratos, tomas, voz) se valida contra esta ficha. La versión para máquina está en
`personaje/personaje.json`.

---

## 1. Quién es (el rol)

| | |
|---|---|
| **Nombre en pantalla** | César |
| **Rol** | Estratega de contenido para médicos. **No es médico**: nunca bata, estetoscopio ni consultorio como "su" espacio. |
| **Arquetipo** | El que sí sabe y te lo dice de frente. Mitad cómplice, mitad provocador. |
| **Actitud** | Seguro, irónico, cercano. Rompe la cuarta pared, se ríe del espectador *con* él, no *de* él. |
| **Enemigo** | Agencias y gurús que "nunca le han llenado la agenda a un consultorio". |
| **Lo que nunca hace** | Prometer resultados clínicos, dar consejos médicos, hablar como doctor. |

---

## 2. Rasgos físicos (sacados de las fotos — NO cambiar)

Estos son los rasgos que el Soul Character tiene que respetar. La IA puede mejorar piel y luz,
pero **no** puede tocar nada de esta lista.

| Rasgo | Descripción |
|---|---|
| Rostro | Ovalado, pómulos marcados, mandíbula definida, cara delgada. |
| Ojos | Café oscuro, cejas oscuras y rectas, bastante pobladas. |
| Nariz | Recta, puente medio. |
| Barba | Corta y cerrada, tipo *boxed beard* recortada; bigote ligero; más densa en mentón. |
| Cabello | Negro, muy corto: *crop* con degradado bajo a los lados, línea frontal recta. |
| Piel | Trigueña clara / oliva, se broncea fácil. |
| Complexión | Delgado-atlético, hombros medios. |
| Sonrisa | Amplia, muestra dientes superiores, se le achinan un poco los ojos (foto 01). |
| Marcas | Tatuaje en el antebrazo **izquierdo** (con el look urbano puede asomar si se remanga; mejor mangas abajo). Hilo rojo en la muñeca derecha (se quita para el personaje). |

---

## 3. Vestuario (idéntico en todas las tomas)

> **Aprobado: Look 4 · Urbano** (elegido por César el 26/09/2026). Es el que usa el reel "El café".
> Los demás looks siguen disponibles para otros videos en `personaje/VESTUARIOS.md`.

El reel de referencia funciona porque él se ve **igual en todas las locaciones**: eso es lo que
hace creíble el salto metro → andén → Bolsa → parque. Una sola pinta, sin variaciones.

| Pieza | Especificación |
|---|---|
| Capa exterior | Overshirt negro de algodón, abierto, sin logos. |
| Camiseta | Blanca lisa, cuello redondo. |
| Pantalón | Jean negro slim. |
| Zapatos | Tenis blancos limpios, sin marca visible. |
| Reloj | Plateado con correa de metal, muñeca izquierda (sale en el close-up de la mano bajo el Ferrari). |
| Gafas | **Ninguna.** Los ojos tienen que verse para que funcione la cuarta pared y el lipsync. |
| Prohibido | Bata médica, logos, gorras, el hilo rojo. |

Imagen de referencia aprobada: [look urbano](https://d8j0ntlcm91z4.cloudfront.net/user_3Gus2S4ZJPfHRFHzXsC14YRPGbw/hf_20260926_212000_8ddac15a-7e35-494e-a417-50d833e1aa8d.png)
(tiene inconsistencias por corregir antes de usarla como referencia final).

**Contraste con la referencia:** el reel original usa traje y maletín para verse "de negocios".
Con el look urbano el personaje se ve como creador que sabe del algoritmo. El maletín se mantiene
como prop del ciclo del destello; contrasta a propósito con la ropa casual.

---

## 4. Props (objetos que lo acompañan)

| Prop | Dónde sale | Regla |
|---|---|---|
| **Vaso de café** de papel, blanco sin logo | 01 hook, 02, 17, 17b (callback) | Siempre el mismo vaso. En el CTA se lo toma: cierra el chiste visual pero nunca revela si se cayó. |
| **Maletín** negro rígido, cierres plateados | 07, 09–15 | Aparece desde el andén en adelante. **Nunca** se ve lo que hay dentro, solo el destello. |
| **Celular** negro sin logo | 06, 07, 08 | Pantalla nunca legible. |
| **Cámara** compacta negra | 07 | Solo en la toma "¿grabo o hablo a cámara?". |

---

## 5. Actuación: expresiones por bloque

| Bloque | Tomas | Expresión | Gestos |
|---|---|---|---|
| Cuarta pared | 02 | Sonrisa de medio lado, cómplice ("te pillé") | Se asoma agachado al lente, señala el café |
| Problema | 06–08 | Frustrado, cansado, exagerado | Mira el celular, levanta la vista a cámara, resopla |
| Frase cortada | 09 | Serio, caminando con seguridad | Maletín en mano |
| Enemigo | 12–13 | Irónico, burlón, seguro | Dedo arriba, mano que descarta, comillas en el aire |
| Maletín | 14–15 | Solemne, casi reverencial | Levanta el maletín a la altura del pecho, abre los cierres |
| CTA | 17–17b | Relajado, amable, confiado | Sorbo de café, señala hacia abajo (comentarios), sonríe |

---

## 6. Voz

- **Tono:** conversacional rápido, tipo reel. Energía media-alta, sin sonar a locutor.
- **Voz clonada:** lista en Higgsfield como "Cesar voz" (`voice_id` en `personaje.json`), a partir de una nota de voz de 22 s.
  El audio original no se guarda en el repositorio porque venía de un chat privado.
- **Acento:** el de la nota de voz original.
- **Ritmo:** frases cortas, pausas marcadas antes de los impactos (ya están en `guion/lineas.json`).
- **Énfasis:** "se va a caer", "nada", "esto", "PACIENTES".

---

## 7. Cámara y look (constante en todo el reel)

- Vertical 9:16, gran angular (16 mm), cámara baja, luz natural de día.
- Piel real con textura (nada de piel plástica), grano cinematográfico leve.
- Ciudad: calles de piedra, edificios de ladrillo y la Bolsa con columnas (igual que la referencia).

---

## 8. Bloque `{PERSONAJE}` para los prompts

Esto es lo que reemplaza `{PERSONAJE}` en `shots/shotlist.json` junto con el `soul_id` de César:

> a slim athletic Latino man with a short dark crop haircut with low fade, short well-groomed dark beard, dark brown eyes, olive skin, no glasses, wearing an open black cotton overshirt over a plain white t-shirt, black slim jeans, white sneakers, silver metal watch on left wrist

**Negativo (lo que se evita):** glasses, sunglasses, doctor coat, lab coat, stethoscope, scrubs,
visible tattoos, red string bracelet, logos, text, plastic skin, extra fingers, deformed hands.

---

## 9. Fotos para entrenar el Soul Character

El kit pide **5 a 20 fotos**. Hoy hay **11** en `assets/fotos_cara/`:

| Archivo | Sirve para | Problema |
|---|---|---|
| `01_mirador_sonrisa_sin_gafas.jpg` | ✅ Cara limpia, sonrisa, medio cuerpo | — |
| `02_cuerpo_entero_gafas_verdes.jpg` | ✅ Cuerpo entero y proporciones | Gafas tapan los ojos, cara pequeña |
| `03_selfie_toalla_gafas_rojas.jpg` | ⚠️ Rasgos y barba de cerca | Gafas rojas tiñen los ojos |
| `04_selfie_adidas_gafas_rojas.jpg` | ⚠️ Rasgos y barba de cerca | Gafas rojas + logo + persona de fondo |
| `05_frente_neutra_rocas.jpg` | ✅ La mejor: frente, cara neutra, ojos a la vista, barba y línea del pelo nítidas | Gafas subidas en la cabeza (no tapan la cara) |
| `06_frente_sonrisa_gorra.jpg` | ✅ Frente, sonrisa con dientes, medio cuerpo | Gorra con logo tapa el pelo; pájaro encima; tatuaje visible |
| `07_tres_cuartos_der_piscina.jpg` | ✅ Tres cuartos mirando a su izquierda, cara seria | Cara algo pequeña en el encuadre |
| `08_tres_cuartos_mirando_arriba.jpg` | ✅ Tres cuartos, mentón levantado (línea de mandíbula) | Casi igual a la 07 |
| `09_cuerpo_entero_sonrisa.jpg` | ✅ Cuerpo entero, sonrisa, complexión real | Tatuaje visible |
| `10_frente_neutra_piscina.jpg` | ✅ Frente, cara neutra, luz pareja | Cara pequeña, ojos entrecerrados |
| `11_tres_cuartos_izq_sonrisa.jpg` | ✅ Tres cuartos / casi perfil hacia su derecha, sonrisa | Tatuaje visible |

**Cobertura de ángulos:**

- [x] Frente (05, 06, 10, 01)
- [x] Tres cuartos hacia ambos lados (07, 08, 11)
- [x] Cuerpo entero (02, 09)
- [ ] Perfil puro (90°): no hay, pero la 11 se acerca. Opcional.

Los tatuajes visibles en las fotos de entrenamiento no importan: en las tomas las mangas del
overshirt los tapan y el negativo del prompt los excluye.

---

## 10. Checklist para aprobar los 3 retratos (paso 2 del kit)

Un retrato se aprueba solo si cumple todo:

- [ ] Se reconoce a César al primer vistazo (ojos, barba, línea del pelo)
- [ ] Mismo corte y barba de la sección 2
- [ ] Vestuario exacto de la sección 3 (overshirt negro abierto, camiseta blanca, jean negro, tenis blancos)
- [ ] Sin gafas, sin bata, sin tatuajes, sin hilo rojo
- [ ] Piel mejorada pero con textura real
- [ ] Manos con 5 dedos y proporciones correctas

El aprobado se guarda como `assets/personaje/cesar_referencia.png` y es la referencia de todas las tomas.
