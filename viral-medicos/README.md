# Kit: video viral para médicos 100 % con IA (Claude Code + Higgsfield)

Tú no grabas nada. Claude Code genera tu personaje, tu voz, las tomas, los efectos
y monta el video completo, replicando la estructura del reel de referencia.

## Lo único que tienes que hacer
1. Instala **Claude Code** (guía oficial: https://docs.claude.com/en/docs/claude-code/overview),
   **Python 3.10+** y **ffmpeg** (Mac: `brew install ffmpeg` · Windows: `winget install ffmpeg`).
2. Descomprime esta carpeta y, dentro de ella, conecta Higgsfield:
   ```bash
   claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
   ```
   Abre Claude Code, escribe `/mcp` e inicia sesión en Higgsfield.
3. Pon **entre 5 y 20 fotos tuyas** en `assets/fotos_cara/` (frente, perfil, tres cuartos,
   medio cuerpo, luces distintas, recientes).
4. Opcional: pon **una nota de voz tuya que ya tengas** (WhatsApp sirve, 10 s a 3 min,
   sin ruido) en `assets/audio/muestra/` para clonar tu voz. Si no hay, se usa una voz de la biblioteca.
5. Cambia tu arroba en `estilo/estilo.json`.
6. Pega en Claude Code el texto de `PROMPT_INICIAL.md`.

Claude Code solo te va a preguntar tres cosas: si apruebas tu personaje, la voz y el costo en créditos.

## Qué hay adentro
```
PROMPT_INICIAL.md          lo que le pegas a Claude Code
CLAUDE.md                  el paso a paso que Claude Code sigue solo
referencia/                desglose del reel original + hojas de contacto
guion/lineas.json          guion por líneas con las pausas para los impactos
guion/guion.md             el mismo guion, para leerlo
shots/shotlist.json        20 tomas con prompts, anclas, overlays y efectos
estilo/estilo.json         arroba, fuente, palabra clave, volúmenes
scripts/sfx.py             crea los efectos de sonido y la música base
scripts/armar_voz.py       une las líneas de voz IA con las pausas exactas
scripts/transcribir.py     voz → tiempos por palabra + subtítulos
scripts/overlays.py        tiras de reels, lead magnet, comentario y logo
scripts/montar.py          arma el video final sincronizado con la voz
```

## Cómo se sincronizan los cortes
Cada toma tiene un `ancla` (las primeras palabras de su frase). `montar.py` las busca en la voz
y corta ahí. El tren, el Ferrari y el destello entran justo después de "llamado…", "el…" y "esto".
