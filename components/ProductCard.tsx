// REEMPLAZA tu components/ProductCard.tsx con este archivo

"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, formatCOP } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="product-card bg-cream-50 rounded-2xl overflow-hidden border border-olive-100 group">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-square bg-cream-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay sutil al hover */}
          <div className="absolute inset-0 bg-olive-900/0 group-hover:bg-olive-900/5 transition-colors duration-500" />

          {product.badge && (
            <span className="absolute top-3 left-3 bg-olive-900 text-cream-50 text-[10px] px-2.5 py-1 rounded-full eyebrow backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          {product.comparePrice && (
            <span className="absolute top-3 right-3 bg-olive-400 text-olive-950 text-[10px] px-2.5 py-1 rounded-full eyebrow font-bold">
              Oferta
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <p className="eyebrow text-olive-600 mb-1">{product.category}</p>
        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-display text-lg leading-tight text-olive-900 mb-2 group-hover:text-olive-700 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-olive-700/80 line-clamp-2 mb-4">
          {product.tagline}
        </p>

        <div className="flex items-end justify-between gap-3">
          <div>
            {product.comparePrice && (
              <p className="text-xs text-olive-600/60 line-through">
                {formatCOP(product.comparePrice)}
              </p>
            )}
            <p className="font-display text-xl font-semibold text-olive-900">
              {formatCOP(product.price)}
            </p>
          </div>
          <button
            onClick={() =>
              addItem({
                slug: product.slug,
                name: product.name,
                price: product.price,
              })
            }
            className="px-4 py-2 bg-olive-800 text-cream-50 rounded-full text-xs hover:bg-olive-700 transition-colors"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
