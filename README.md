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
