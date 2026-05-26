"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-cream-50/85 backdrop-blur-md border-b border-olive-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="text-olive-800 hover:text-olive-600 transition-colors">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="link-under text-olive-800 hover:text-olive-600">
              Inicio
            </Link>
            <Link href="/catalogo" className="link-under text-olive-800 hover:text-olive-600">
              Catálogo
            </Link>
            <Link href="/envios" className="link-under text-olive-800 hover:text-olive-600">
              Envíos
            </Link>
            <Link href="/contacto" className="link-under text-olive-800 hover:text-olive-600">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/carrito"
              className="relative flex items-center gap-2 px-4 py-2 bg-olive-800 text-cream-50 rounded-full text-sm hover:bg-olive-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-olive-400 text-olive-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-olive-800"
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-3 text-sm">
            <Link href="/" onClick={() => setOpen(false)} className="py-2 text-olive-800">Inicio</Link>
            <Link href="/catalogo" onClick={() => setOpen(false)} className="py-2 text-olive-800">Catálogo</Link>
            <Link href="/envios" onClick={() => setOpen(false)} className="py-2 text-olive-800">Envíos</Link>
            <Link href="/contacto" onClick={() => setOpen(false)} className="py-2 text-olive-800">Contacto</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
