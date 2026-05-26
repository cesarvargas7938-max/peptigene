# Memoria técnica · Peptigene

Documento de soporte para entrega académica. Explica decisiones de arquitectura, diseño y SEO del proyecto.

---

## 1. Resumen del proyecto

Peptigene es un sitio de e-commerce ficticio para una marca inventada de suplementos deportivos. El proyecto demuestra la implementación de un sitio comercial completo con Next.js 14, incluyendo catálogo, ficha de producto, carrito persistente, checkout, páginas legales y optimización SEO técnica.

**Marca ficticia** · Paleta verde oliva · Productos inventados · Sin procesamiento real de pagos.

---

## 2. Stack técnico justificado

| Tecnología | Por qué |
|-----------|---------|
| **Next.js 14 (App Router)** | Renderizado híbrido (SSG + RSC), optimización automática de SEO, file-based routing, soporte nativo para metadata y sitemap. |
| **TypeScript** | Tipado estricto en el modelo de datos del catálogo y del carrito; reduce errores en tiempo de desarrollo. |
| **Tailwind CSS** | Sistema de diseño consistente, paleta personalizada en `tailwind.config.ts`, sin CSS huérfano. |
| **React Context** | Gestión del carrito sin librería externa adicional; suficiente para el alcance del proyecto. |
| **localStorage** | Persistencia del carrito entre sesiones sin backend. |

---

## 3. Arquitectura

### Server Components vs Client Components

Por defecto en App Router todos los componentes son del servidor. Solo se marcan como `"use client"` los que requieren interactividad:

- `Header.tsx` — necesita el contador del carrito reactivo.
- `ProductCard.tsx` — botón "Agregar".
- `cart-context.tsx` — estado global del carrito.
- `catalogo/page.tsx` — filtros y orden interactivos.
- `carrito/page.tsx`, `checkout/page.tsx`, `contacto/page.tsx` — formularios.

Todo lo demás se renderiza en el servidor y llega como HTML estático al cliente. Esto mejora tiempos de carga, SEO y métricas Core Web Vitals.

### Static Site Generation

Las fichas de producto usan `generateStaticParams`, lo que significa que en `npm run build` Next.js pre-genera el HTML de las 8 fichas. En producción se sirven como archivos estáticos, no se renderizan en cada request.

---

## 4. SEO técnico implementado

### Metadata API

`app/layout.tsx` define metadata global con `metadataBase`, `title.template`, `openGraph`, `twitter`, `robots` y `alternates.canonical`. Cada página puede sobreescribir lo que necesite.

`app/producto/[slug]/page.tsx` usa `generateMetadata` para devolver título y descripción dinámicos según el producto.

### Structured Data (Schema.org)

- **Organization** en el layout raíz: identifica la marca para Google.
- **Product** en cada ficha: nombre, descripción, marca, precio, moneda, disponibilidad. Google lo usa para rich results en búsquedas (precio y disponibilidad directamente en SERP).

### Sitemap y robots

- `app/sitemap.ts` genera el sitemap dinámicamente desde el catálogo. Cuando se agrega un producto, aparece automáticamente.
- `app/robots.ts` permite indexar todo excepto `/checkout` y `/carrito` (páginas que no aportan valor SEO).

### URLs

- Estructura plana y descriptiva: `/producto/fortis-whey-cacao` en vez de `/p?id=123`.
- Idioma declarado: `lang="es-CO"` en `<html>`.
- Slugs en español, sin caracteres especiales.

### HTML semántico

- Un solo `<h1>` por página.
- Jerarquía `h1 → h2 → h3` respetada.
- `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`, `<footer>` usados correctamente.
- Atributos `alt` y `aria-label` donde corresponde.

---

## 5. Sistema de diseño

### Paleta

Verde oliva como color dominante (autoridad, naturaleza, salud), con crema como base para reducir fatiga visual. Acentos olive-400 para badges y CTAs secundarios.

### Tipografía

- **Fraunces** (serif variable) para titulares: carácter editorial sin ser anticuada.
- **Outfit** (sans-serif geométrica) para cuerpo: legible y moderna.
- **JetBrains Mono** para etiquetas tipo "eyebrow": referencia técnica.

La combinación serif/sans/mono genera contraste tipográfico fuerte sin sentirse caótico.

### Espaciado y composición

- Grid de 7xl (1280px) como contenedor estándar.
- Alturas y paddings consistentes a través de la escala de Tailwind.
- Animaciones contenidas: `fade-up` en hero, `marquee` en barra de valores, `product-card` hover sutil.

---

## 6. Modelo de datos

```typescript
type Product = {
  slug: string;          // URL-friendly
  name: string;
  category: string;
  tagline: string;       // Subtítulo corto
  description: string;   // Descripción larga
  benefits: string[];    // Bullets de beneficios
  usage: string;         // Modo de uso
  ingredients: string[]; // Lista de ingredientes
  price: number;         // En COP, número entero
  comparePrice?: number; // Para mostrar oferta
  stock: number;
  badge?: string;        // "Más vendido", "Nuevo", etc.
  highlight?: string;    // Stat destacado en card
};
```

El catálogo vive en `lib/products.ts` como array. En un entorno real este array sería el resultado de una consulta a base de datos o CMS.

---

## 7. Carrito de compras

### Funcionamiento

`CartContext` expone `items`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `totalItems`, `totalPrice`.

`useEffect` sincroniza el estado con `localStorage` bajo la clave `peptigene-cart`. Al cargar el sitio se hidrata desde localStorage en el primer mount.

### Patrón de hidratación

Se usa un flag `hydrated` para evitar el clásico problema de hydration mismatch en Next.js: durante el primer render del servidor el carrito está vacío, en el cliente se lee localStorage, y solo después se empieza a guardar.

---

## 8. Páginas implementadas

| Ruta | Tipo | Función |
|------|------|---------|
| `/` | RSC | Home con hero, productos destacados, filosofía, CTA |
| `/catalogo` | Client | Listado con filtros por categoría y orden |
| `/producto/[slug]` | RSC + SSG | Ficha completa con JSON-LD por producto |
| `/carrito` | Client | Carrito interactivo con cantidades |
| `/checkout` | Client | Formulario de pedido (demo, sin pago real) |
| `/contacto` | Client | Formulario de contacto |
| `/envios` | RSC | Información de envíos y devoluciones |
| `/terminos` | RSC | Términos y condiciones |
| `/politica-privacidad` | RSC | Política de privacidad |
| `/not-found` | RSC | 404 personalizado |
| `/sitemap.xml` | Auto | Sitemap dinámico |
| `/robots.txt` | Auto | Robots.txt |

---

## 9. Limitaciones reconocidas

Como proyecto académico, el sistema no incluye:

- Procesamiento real de pagos (requiere integración con Wompi, Mercado Pago u otra pasarela y certificación PCI).
- Base de datos persistente (los pedidos no se guardan en ningún lado).
- Sistema de envío de correos transaccionales.
- Panel de administración del catálogo.
- Autenticación de usuarios.
- Internacionalización (i18n) — el sitio está solo en español.
- Tests automatizados.

Estas limitaciones son apropiadas para el alcance académico y están documentadas en el README.

---

## 10. Cómo extender el proyecto

Si el proyecto se llevara a producción, el orden lógico sería:

1. **CMS para el catálogo**: Sanity o Payload, para que el catálogo se edite desde una interfaz visual.
2. **Pasarela de pago**: Wompi (más común en Colombia) o Mercado Pago.
3. **Base de datos**: PostgreSQL con Prisma para guardar pedidos.
4. **Correo transaccional**: Resend para confirmaciones de pedido.
5. **Autenticación**: NextAuth con login por correo o Google.
6. **Analytics**: Google Analytics 4 o Plausible para medir tráfico.
7. **Search Console**: Verificar el dominio para monitorear posicionamiento.

---

## 11. Conclusión

Peptigene demuestra cómo construir un e-commerce moderno con las prácticas actuales de Next.js: server components, SSG, metadata dinámica, structured data, accesibilidad y diseño coherente. La marca es ficticia y los productos son inventados, pero la arquitectura es replicable a un proyecto comercial real cambiando los datos del catálogo y conectando los servicios externos faltantes.
