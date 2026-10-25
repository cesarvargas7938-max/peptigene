# Peptigene · Proyecto académico

E-commerce ficticio construido con Next.js 14 (App Router), TypeScript y Tailwind CSS. Marca y productos inventados para fines educativos.

## Instalación

Requisitos: Node.js 18.17 o superior.

```bash
# 1. Descomprimir el proyecto
# 2. Entrar a la carpeta
cd peptigene

# 3. Instalar dependencias
npm install

# 4. Levantar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

| Comando         | Acción                                                |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Servidor de desarrollo con hot reload                 |
| `npm run build` | Build de producción (genera páginas estáticas)        |
| `npm run start` | Servidor de producción (requiere `build` previo)      |
| `npm run lint`  | Linter de Next.js                                     |
| `npm test`      | Pruebas del motor de evaluación (`lib/evaluacion.ts`)  |

## Estructura del proyecto

```
peptigene/
├── app/                          # App Router de Next.js
│   ├── layout.tsx                # Layout raíz + metadata SEO global + JSON-LD
│   ├── page.tsx                  # Home
│   ├── globals.css               # Estilos globales y tipografías
│   ├── sitemap.ts                # Sitemap dinámico
│   ├── robots.ts                 # robots.txt
│   ├── not-found.tsx             # 404 personalizado
│   ├── catalogo/page.tsx         # Catálogo con filtros y orden
│   ├── producto/[slug]/          # Ficha de producto dinámica
│   │   ├── page.tsx              # SSG con generateStaticParams
│   │   └── AddToCartButton.tsx
│   ├── carrito/page.tsx          # Carrito persistente
│   ├── checkout/page.tsx         # Checkout demo (sin pago real)
│   ├── contacto/page.tsx         # Formulario de contacto
│   ├── evaluacion/page.tsx       # Tamizaje para tratamiento con péptidos
│   ├── envios/page.tsx           # Información de envíos
│   ├── terminos/page.tsx         # Términos y condiciones
│   └── politica-privacidad/page.tsx
├── components/
│   ├── Header.tsx                # Navegación + contador del carrito
│   ├── Footer.tsx
│   ├── Logo.tsx                  # Logo SVG
│   └── ProductCard.tsx           # Tarjeta de producto reutilizable
├── lib/
│   ├── products.ts               # Catálogo ficticio (8 productos)
│   ├── evaluacion.ts             # Motor de reglas del tamizaje (contraindicaciones, labs, dosis)
│   ├── estilo-vida.ts            # Plan de hidratación, alimentación y ejercicio según metabolismo
│   └── cart-context.tsx          # Context API + localStorage
├── tailwind.config.ts            # Paleta verde oliva + tipografías
├── next.config.js
├── tsconfig.json
└── package.json
```

## Decisiones técnicas

### Stack
- **Next.js 14 App Router**: server components por defecto, client components solo donde se necesita interactividad.
- **TypeScript**: tipado estricto en todo el catálogo y el carrito.
- **Tailwind CSS**: utility-first con paleta personalizada (verde oliva).
- **Sin base de datos**: el catálogo vive en `lib/products.ts` y el carrito en localStorage. Apropiado para una demo.

### SEO técnico
Aunque es un proyecto académico, se incluye el SEO técnico estándar para demostración:

- Metadata API de Next.js con `title.template`, `description`, `openGraph` y `twitter`.
- Metadata dinámica por producto (`generateMetadata`).
- JSON-LD `Organization` en el layout y `Product` en cada ficha.
- Sitemap dinámico que incluye todos los productos.
- robots.txt programático con bloqueo de `/checkout` y `/carrito`.
- URLs limpias en español (`/catalogo`, `/producto/[slug]`, `/politica-privacidad`).
- HTML semántico con `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`, `<nav>`.
- Atributo `lang="es-CO"` en `<html>`.
- Canonical URLs.

### Accesibilidad
- Etiquetas `aria-label` en botones de íconos.
- Estructura jerárquica de headings (h1 único por página).
- Contraste de color verificado en la paleta.
- Estados de focus visibles en formularios.

### Performance
- Productos generados con SSG (`generateStaticParams`) — se pre-renderizan en build time.
- Server components para todo lo que no requiere interactividad.
- Tipografías cargadas con `display=swap`.
- Sin imágenes pesadas: las "fotos" de producto son SVG inline.

## Paleta de colores

| Token        | Hex      | Uso                                  |
| ------------ | -------- | ------------------------------------ |
| `olive-50`   | #f7f8f1  | Fondos muy claros                    |
| `olive-200`  | #d9dfbc  | Bordes suaves                        |
| `olive-400`  | #a3b272  | Acentos, badges                      |
| `olive-700`  | #525e38  | Texto secundario, hover              |
| `olive-900`  | #3a422c  | Texto principal, botones primarios   |
| `cream-50`   | #fdfcf7  | Fondo principal del sitio            |
| `cream-100`  | #faf6e9  | Cards, inputs                        |

## Tipografías

- **Fraunces** (display): titulares con variación óptica fina.
- **Outfit** (body): sans-serif geométrica limpia.
- **JetBrains Mono** (eyebrow): etiquetas y metadatos.

Las tres se cargan desde Google Fonts.

## Evaluación para tratamiento con péptidos (`/evaluacion`)

Herramienta de tamizaje para tratamientos de pérdida de peso con tirzepatida o retatrutida. Es un apoyo clínico: la decisión final y la prescripción corresponden a un profesional de la salud.

**Cómo funciona**

1. Se responde el cuestionario (suplementos, alergias, pancreatitis, tiroides/MEN2, vesícula, medicamentos, ejercicio, edad/peso/estatura, peso ideal) más condiciones de salud y, opcionalmente, se pega el perfil metabólico en texto libre.
2. El motor (`lib/evaluacion.ts`) aplica las reglas y produce hallazgos de tres niveles:
   - **Contraindicación** → veredicto **NO APTO** (CMT/MEN2, menor de 18, embarazo/lactancia, pancreatitis previa, enfermedad GI grave, hipersensibilidad, trastorno alimentario, IMC < 20, lipasa/amilasa > 3× o calcitonina elevada).
   - **Precaución** → **REQUIERE EVALUACIÓN MÉDICA** (DM1, insulina o sulfonilureas, otro GLP-1, warfarina, anticonceptivos orales, vesícula, ≥ 75 años, ERC, hepatopatía, retinopatía, salud mental, TSH alterada, TG ≥ 500, transaminasas > 3×, meta de peso irreal, formulario incompleto). Retatrutida se evalúa con las mismas reglas que tirzepatida; solo cambia la dosis máxima.
   - **Información** → no cambia el veredicto (metformina, levotiroxina, prediabetes por laboratorio, HOMA-IR, dislipidemia, sedentarismo…).
3. **Modalidad**: si cumple la indicación estándar (IMC ≥ 30, o ≥ 27 con comorbilidad) es *pérdida de peso*; si no la cumple, el caso se maneja como *recomposición corporal*: dosis conservadora (2.5 mg, máximo 5 mg, ciclo de 8–12 semanas), déficit suave, proteína 1.8 g/kg y fuerza obligatoria. Solo IMC < 20 o una meta en bajo peso bloquean.
4. Si no hay contraindicaciones, se sugiere **2.5 mg subcutáneos semanales durante 4 semanas**, con escalado de 2.5 mg cada ≥ 4 semanas según criterio médico (máximo 15 mg tirzepatida / 12 mg retatrutida).
5. Para toda persona apta o con precauciones se genera un **plan de estilo de vida** (`lib/estilo-vida.ts`): metabolismo basal (Mifflin-St Jeor) y gasto total según nivel de ejercicio, objetivo calórico con déficit de 500–750 kcal sin bajar del mínimo seguro, macros (proteína 1.3–1.5 g/kg), hidratación (33 mL/kg, mínimo 2 L), pautas de alimentación y ejercicio por nivel, ritmo esperado de 0.5–1 % del peso por semana, y ajustes según comorbilidades y laboratorios (resistencia a la insulina, triglicéridos, colesterol, hígado graso, hipertensión, función renal, vitamina D, B12, hierro, TSH, SOP, apnea).
6. El resultado se puede copiar como texto (para WhatsApp o historia clínica) y guardar en el navegador.

**Perfil metabólico reconocido**: glucosa, HbA1c, insulina (calcula HOMA-IR), colesterol total/LDL/HDL, triglicéridos, TSH, calcitonina, creatinina (estima TFG con CKD-EPI 2021), TFG, ALT/AST, lipasa, amilasa, ácido úrico, vitamina D, B12, hemoglobina y ferritina. Formato libre: `Glucosa 108 mg/dL`, `HbA1c: 6.1%`, `TG = 220`, uno por línea o separados por coma.

**Para afinar el sistema** todo vive en `lib/evaluacion.ts`:

- `LABS`: rangos de referencia y comentarios por analito.
- `REGLAS_MEDICAMENTOS`: fármacos detectados en texto libre y su nivel.
- `COMORBILIDADES`: opciones del formulario y cuáles cuentan para la indicación por IMC.
- `evaluar()`: reglas de contraindicación/precaución y criterio de IMC.
- `planDosis()`: dosis inicial, escalado y notas.
- `lib/estilo-vida.ts`: factores de actividad, déficit, macros, hidratación, pautas y ajustes metabólicos.

Las reglas tienen pruebas en `scripts/evaluacion.test.mjs`; se ejecutan con `npm test` (Node 22.18+).

**Informe PDF**: `lib/informe-html.ts` genera el informe imprimible (evaluación, dosis, hallazgos, laboratorios, cuestionario y plan de estilo de vida). Para producirlo:

```bash
node scripts/informe-pdf.mjs informes/paciente.json informes/paciente.pdf
```

El JSON tiene los mismos campos que el formulario (ver `respuestasVacias` en `lib/evaluacion.ts`). Requiere Playwright (ya en `devDependencies`) y Chromium; si Chromium está en otra ruta, usar la variable `CHROMIUM_PATH`. La carpeta `informes/` está ignorada por git porque contiene datos de pacientes.

**Versión independiente (un solo archivo)**: `node scripts/build-standalone.mjs` genera `dist/peptigene-evaluacion.html`, el evaluador completo (formulario, reglas, plan de estilo de vida y botón Descargar PDF) en un archivo que se abre con doble clic sin instalar nada. La plantilla está en `standalone/plantilla.html` y usa el mismo motor empaquetado con esbuild. También genera `dist/artifact.html`, la variante para publicar en claude.ai (sin impresión; muestra el informe dentro de la página).

## Lo que NO incluye este proyecto

Por ser una demo académica:

- No procesa pagos reales (el checkout es decorativo).
- No envía correos (el formulario de contacto solo muestra confirmación).
- No tiene panel de administración.
- No tiene base de datos: el catálogo está hardcodeado y el carrito vive en el navegador.
- No tiene login/registro de usuarios.

Si quisieras llevarlo a producción real, las extensiones naturales serían:

1. CMS para el catálogo (Sanity, Strapi, Payload).
2. Pasarela de pago (Wompi o Mercado Pago para Colombia).
3. Backend de pedidos (base de datos + API).
4. Sistema de autenticación (NextAuth).
5. Servicio de correo transaccional (Resend, SendGrid).

## Licencia

Proyecto académico. Código original creado para fines educativos.
