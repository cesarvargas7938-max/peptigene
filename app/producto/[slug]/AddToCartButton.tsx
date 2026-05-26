"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({
  slug,
  name,
  price,
}: {
  slug: string;
  name: string;
  price: number;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem({ slug, name, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center bg-cream-50 border border-olive-200 rounded-full">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="w-10 h-12 text-olive-800 hover:text-olive-600"
          aria-label="Disminuir"
        >
          −
        </button>
        <span className="w-10 text-center text-olive-900 font-medium">{qty}</span>
        <button
          onClick={() => setQty(qty + 1)}
          className="w-10 h-12 text-olive-800 hover:text-olive-600"
          aria-label="Aumentar"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAdd}
        className="px-8 h-12 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors flex-1 sm:flex-none"
      >
        {added ? "✓ Agregado" : "Agregar al carrito"}
      </button>
    </div>
  );
}
