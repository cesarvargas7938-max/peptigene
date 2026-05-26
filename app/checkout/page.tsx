"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCOP } from "@/lib/products";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  const shipping = totalPrice > 200000 ? 0 : 15000;
  const total = totalPrice + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo académica: no se procesa pago real
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-olive-200 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-olive-900" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="eyebrow text-olive-600 mb-3">— Pedido recibido</p>
        <h1 className="display-xl text-4xl md:text-5xl text-olive-900 mb-6">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-olive-700 mb-10 max-w-md mx-auto">
          Esta es una demostración académica. En un sitio real, aquí recibirías
          un correo de confirmación con los detalles de tu pedido.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-24 text-center">
        <h1 className="display-xl text-4xl text-olive-900 mb-6">No hay productos para pagar</h1>
        <Link href="/catalogo" className="text-olive-700 underline">Ir al catálogo →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
      <p className="eyebrow text-olive-600 mb-3">— Finalizar compra</p>
      <h1 className="display-xl text-4xl md:text-5xl text-olive-900 mb-12">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Contacto */}
          <section className="bg-cream-50 border border-olive-100 rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-olive-900 mb-6">Datos de contacto</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nombres" name="firstName" required />
              <Field label="Apellidos" name="lastName" required />
              <Field label="Correo electrónico" name="email" type="email" required />
              <Field label="Teléfono" name="phone" type="tel" required />
            </div>
          </section>

          {/* Envío */}
          <section className="bg-cream-50 border border-olive-100 rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-olive-900 mb-6">Dirección de envío</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Dirección" name="address" required className="md:col-span-2" />
              <Field label="Ciudad" name="city" required />
              <Field label="Departamento" name="state" required />
              <Field label="Código postal" name="zip" />
              <Field label="Notas para el repartidor (opcional)" name="notes" />
            </div>
          </section>

          {/* Pago (demo) */}
          <section className="bg-cream-50 border border-olive-100 rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-olive-900 mb-2">Método de pago</h2>
            <p className="text-xs text-olive-700/70 mb-6">
              Demo académica · No se procesan pagos reales
            </p>
            <div className="space-y-3">
              {["Tarjeta de crédito/débito", "PSE", "Contra entrega"].map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-3 p-4 border border-olive-200 rounded-xl cursor-pointer hover:bg-olive-50"
                >
                  <input type="radio" name="payment" defaultChecked={m === "PSE"} className="accent-olive-700" />
                  <span className="text-olive-900">{m}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Resumen */}
        <aside className="lg:col-span-1">
          <div className="bg-olive-900 text-cream-50 rounded-2xl p-6 sticky top-24">
            <h2 className="font-display text-2xl mb-6">Tu pedido</h2>
            <ul className="space-y-3 text-sm border-b border-olive-700 pb-4 mb-4">
              {items.map((item) => (
                <li key={item.slug} className="flex justify-between gap-3">
                  <span className="text-cream-100/90 flex-1">
                    {item.name} <span className="text-olive-300">× {item.quantity}</span>
                  </span>
                  <span>{formatCOP(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm border-b border-olive-700 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-cream-100/70">Subtotal</span>
                <span>{formatCOP(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream-100/70">Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatCOP(shipping)}</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline mb-6">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl font-semibold">{formatCOP(total)}</span>
            </div>
            <button
              type="submit"
              className="block w-full py-4 bg-cream-50 text-olive-900 text-center rounded-full text-sm font-medium hover:bg-olive-200 transition-colors"
            >
              Confirmar pedido
            </button>
            <p className="text-xs text-cream-100/60 mt-4 text-center">
              Al confirmar aceptas los términos del sitio.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs text-olive-700 mb-1.5">{label}{required && " *"}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg text-olive-900 focus:outline-none focus:border-olive-700 transition"
      />
    </label>
  );
}
