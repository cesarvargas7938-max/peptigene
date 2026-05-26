"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCOP } from "@/lib/products";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24 text-center">
        <p className="eyebrow text-olive-600 mb-3">— Tu carrito</p>
        <h1 className="display-xl text-5xl text-olive-900 mb-6">Está vacío.</h1>
        <p className="text-olive-700 mb-10 max-w-md mx-auto">
          Aún no has agregado ningún producto. Echa un vistazo al catálogo y arma tu plan.
        </p>
        <Link
          href="/catalogo"
          className="inline-block px-8 py-4 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
      <p className="eyebrow text-olive-600 mb-3">— Tu carrito</p>
      <h1 className="display-xl text-4xl md:text-5xl text-olive-900 mb-12">
        {totalItems} {totalItems === 1 ? "producto" : "productos"}
      </h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center gap-4 bg-cream-50 border border-olive-100 rounded-2xl p-4"
            >
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-olive-100 to-olive-200 shrink-0" />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/producto/${item.slug}`}
                  className="font-display text-lg text-olive-900 hover:text-olive-600 transition"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-olive-700/70 mt-1">
                  {formatCOP(item.price)} c/u
                </p>
              </div>
              <div className="flex items-center bg-cream-100 rounded-full">
                <button
                  onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                  className="w-8 h-8 text-olive-800"
                  aria-label="Disminuir"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm text-olive-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                  className="w-8 h-8 text-olive-800"
                  aria-label="Aumentar"
                >
                  +
                </button>
              </div>
              <p className="font-display text-lg font-semibold text-olive-900 min-w-[100px] text-right">
                {formatCOP(item.price * item.quantity)}
              </p>
              <button
                onClick={() => removeItem(item.slug)}
                className="text-olive-600 hover:text-olive-900 p-2"
                aria-label="Eliminar"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-olive-900 text-cream-50 rounded-2xl p-6 sticky top-24">
            <h2 className="font-display text-2xl mb-6">Resumen</h2>
            <div className="space-y-3 text-sm border-b border-olive-700 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-cream-100/70">Subtotal</span>
                <span>{formatCOP(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream-100/70">Envío</span>
                <span className="text-olive-300">Calculado en checkout</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline mb-6">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl font-semibold">{formatCOP(totalPrice)}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-4 bg-cream-50 text-olive-900 text-center rounded-full text-sm font-medium hover:bg-olive-200 transition-colors"
            >
              Ir a pagar
            </Link>
            <Link
              href="/catalogo"
              className="block text-center text-cream-100/80 hover:text-cream-50 text-xs mt-4"
            >
              ← Seguir comprando
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
