// REEMPLAZA tu app/producto/[slug]/page.tsx con este archivo

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { products, getProductBySlug, formatCOP } from "@/lib/products";
import { AddToCartButton } from "./AddToCartButton";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      type: "website",
      images: [{ url: product.imageUrl }],
    },
    alternates: { canonical: `/producto/${product.slug}` },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.imageUrl,
    brand: { "@type": "Brand", name: "Peptigene" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "COP",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs text-olive-700/70 mb-8 flex gap-2">
        <Link href="/" className="hover:text-olive-900">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-olive-900">Catálogo</Link>
        <span>/</span>
        <span className="text-olive-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Imagen del producto */}
        <div className="relative aspect-square bg-cream-100 rounded-3xl overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {product.badge && (
            <span className="absolute top-6 left-6 bg-olive-900 text-cream-50 text-xs px-3 py-1.5 rounded-full eyebrow backdrop-blur-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow text-olive-600 mb-2">{product.category}</p>
          <h1 className="display-xl text-4xl md:text-5xl text-olive-900 mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-olive-700 mb-6">{product.tagline}</p>

          <div className="flex items-baseline gap-3 mb-8">
            <p className="font-display text-3xl font-semibold text-olive-900">
              {formatCOP(product.price)}
            </p>
            {product.comparePrice && (
              <p className="text-lg text-olive-600/60 line-through">
                {formatCOP(product.comparePrice)}
              </p>
            )}
          </div>

          <AddToCartButton
            slug={product.slug}
            name={product.name}
            price={product.price}
          />

          <p className="mt-4 text-xs text-olive-700/70">
            {product.stock > 10
              ? "✓ Disponible · Envío en 2–4 días hábiles"
              : product.stock > 0
              ? `Últimas ${product.stock} unidades · Envío en 2–4 días hábiles`
              : "Agotado temporalmente"}
          </p>

          <div className="mt-10 space-y-6">
            <section>
              <h2 className="eyebrow text-olive-600 mb-3">Descripción</h2>
              <p className="text-olive-800 leading-relaxed">{product.description}</p>
            </section>
            <section>
              <h2 className="eyebrow text-olive-600 mb-3">Beneficios</h2>
              <ul className="space-y-2">
                {product.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-olive-800">
                    <span className="text-olive-500 mt-1.5">◆</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="eyebrow text-olive-600 mb-3">Modo de uso</h2>
              <p className="text-olive-800 leading-relaxed">{product.usage}</p>
            </section>
            <section>
              <h2 className="eyebrow text-olive-600 mb-3">Ingredientes</h2>
              <p className="text-olive-800 leading-relaxed">
                {product.ingredients.join(" · ")}
              </p>
            </section>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl text-olive-900 mb-8">
            También te puede interesar
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/producto/${p.slug}`}
                className="block product-card bg-cream-50 rounded-2xl border border-olive-100 overflow-hidden"
              >
                <div className="relative aspect-square bg-cream-100">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="eyebrow text-olive-600 mb-1">{p.category}</p>
                  <h3 className="font-display text-lg text-olive-900 mb-2">{p.name}</h3>
                  <p className="font-display text-lg font-semibold text-olive-900">
                    {formatCOP(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
