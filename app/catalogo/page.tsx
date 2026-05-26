"use client";

import { useState, useMemo } from "react";
import { products, categories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function CatalogoPage() {
  const [category, setCategory] = useState<string>("todos");
  const [sort, setSort] = useState<string>("default");

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "todos") {
      list = list.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <header className="mb-12">
        <p className="eyebrow text-olive-600 mb-3">— Catálogo</p>
        <h1 className="display-xl text-5xl md:text-7xl text-olive-900">
          Todos los productos
        </h1>
        <p className="mt-4 text-olive-800/70 max-w-xl">
          {filtered.length} {filtered.length === 1 ? "producto disponible" : "productos disponibles"}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="sticky top-24">
            <h3 className="eyebrow text-olive-600 mb-4">Categorías</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setCategory("todos")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    category === "todos"
                      ? "bg-olive-900 text-cream-50"
                      : "text-olive-800 hover:bg-olive-100"
                  }`}
                >
                  Todos · {products.length}
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => setCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      category === cat.name
                        ? "bg-olive-900 text-cream-50"
                        : "text-olive-800 hover:bg-olive-100"
                    }`}
                  >
                    {cat.name} · {cat.count}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="eyebrow text-olive-600 mt-8 mb-4">Ordenar</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 bg-cream-50 border border-olive-200 rounded-lg text-sm text-olive-800"
            >
              <option value="default">Por defecto</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="bg-cream-50 border border-olive-100 rounded-2xl p-16 text-center">
              <p className="font-display text-2xl text-olive-700">
                No hay productos en esta categoría.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
