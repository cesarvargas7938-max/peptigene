// REEMPLAZA tu app/page.tsx con este archivo

import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <>
      {/* HERO con foto + elementos gráficos */}
      <section className="relative overflow-hidden bg-cream-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 md:pt-20 md:pb-32 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 animate-fade-up relative z-10">
              <p className="eyebrow text-olive-600 mb-6">
                · Formulación clínica · Lotes verificados ·
              </p>
              <h1 className="display-xl text-5xl md:text-7xl lg:text-8xl text-olive-900 mb-8">
                Rendimiento<br />
                <span className="italic font-normal text-olive-700">sin atajos.</span>
              </h1>
              <p className="text-lg md:text-xl text-olive-800/80 max-w-xl mb-10 leading-relaxed">
                Suplementos formulados con ingredientes verificados, dosis efectivas y una sola promesa: que cada gramo cuente.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/catalogo" className="px-8 py-4 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors">
                  Ver catálogo
                </Link>
                <Link href="#filosofia" className="px-8 py-4 border border-olive-900 text-olive-900 rounded-full text-sm font-medium hover:bg-olive-900 hover:text-cream-50 transition-colors">
                  Nuestra filosofía
                </Link>
              </div>

              {/* Stats inline */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <p className="font-display text-3xl text-olive-900">8</p>
                  <p className="text-xs text-olive-700/70 leading-tight">Fórmulas activas</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-olive-900">99.9%</p>
                  <p className="text-xs text-olive-700/70 leading-tight">Pureza verificada</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-olive-900">2–4d</p>
                  <p className="text-xs text-olive-700/70 leading-tight">Envío nacional</p>
                </div>
              </div>
            </div>

            {/* Imagen hero con elementos gráficos superpuestos */}
            <div className="lg:col-span-6 relative animate-fade-in">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/images/hero.jpg"
                  alt="Laboratorio Peptigene"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Overlay sutil verde para integrar con la paleta */}
                <div className="absolute inset-0 bg-gradient-to-t from-olive-900/30 via-transparent to-transparent" />
              </div>

              {/* Badge flotante 1 · esquina superior derecha */}
              <div className="absolute -top-4 -right-4 md:right-4 bg-cream-50 px-5 py-3 rounded-2xl shadow-xl border border-olive-100 max-w-[200px]">
                <p className="eyebrow text-olive-600 mb-1">Lote · 2026·04</p>
                <p className="font-display text-sm text-olive-900 leading-tight">
                  Análisis de pureza independiente
                </p>
              </div>

              {/* Badge flotante 2 · esquina inferior izquierda */}
              <div className="absolute -bottom-4 -left-4 md:left-4 bg-olive-900 text-cream-50 px-5 py-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-olive-300" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className="eyebrow text-olive-300 mb-0.5">Certificado</p>
                    <p className="font-display text-sm">GMP · ISO 9001</p>
                  </div>
                </div>
              </div>

              {/* Líneas decorativas */}
              <svg className="absolute -z-10 top-1/2 -right-20 w-80 h-80 text-olive-200 opacity-40" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE de valores */}
      <section className="bg-olive-900 text-cream-50 py-6 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <span className="eyebrow">Envíos a toda Colombia</span>
              <span className="text-olive-400">◆</span>
              <span className="eyebrow">Análisis de pureza por lote</span>
              <span className="text-olive-400">◆</span>
              <span className="eyebrow">Garantía de satisfacción</span>
              <span className="text-olive-400">◆</span>
              <span className="eyebrow">Asesoría nutricional incluida</span>
              <span className="text-olive-400">◆</span>
              <span className="eyebrow">Formulado en laboratorio</span>
              <span className="text-olive-400">◆</span>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA · 3 pasos */}
      <section className="bg-cream-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="eyebrow text-olive-600 mb-3">— Cómo funciona</p>
              <h2 className="display-xl text-4xl md:text-5xl text-olive-900">
                De la fórmula<br />
                <span className="italic font-normal text-olive-700">a tu rutina.</span>
              </h2>
            </div>
            <p className="text-lg text-olive-800/80 leading-relaxed self-end max-w-lg">
              Cada producto recorre tres etapas antes de llegar a ti: formulación
              respaldada por evidencia, verificación de pureza por lote y envío
              directo desde nuestro centro logístico.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Formulamos",
                body: "Cada fórmula se diseña con ingredientes en dosis efectivas según evidencia clínica disponible.",
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
              },
              {
                step: "02",
                title: "Verificamos",
                body: "Cada lote se analiza en laboratorio independiente. Publicamos resultados con código de lote en la etiqueta.",
                icon: "M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                step: "03",
                title: "Enviamos",
                body: "Despacho en 24 horas hábiles, entrega en 2–4 días a todo el país con seguimiento en tiempo real.",
                icon: "M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              },
            ].map((s) => (
              <div key={s.step} className="bg-olive-50 p-8 rounded-2xl border border-olive-100 hover:border-olive-300 transition">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-5xl text-olive-300">{s.step}</span>
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-olive-700" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={s.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-olive-900 mb-3">{s.title}</h3>
                <p className="text-olive-800/80 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="eyebrow text-olive-600 mb-3">— Selección destacada</p>
            <h2 className="display-xl text-4xl md:text-5xl text-olive-900">
              Lo más pedido<br />
              <span className="italic font-normal text-olive-700">esta temporada</span>
            </h2>
          </div>
          <Link href="/catalogo" className="link-under text-olive-800 text-sm">
            Ver catálogo completo →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* FILOSOFÍA con imagen lateral */}
      <section id="filosofia" className="bg-olive-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-olive-600 mb-3">— Filosofía</p>
              <h2 className="display-xl text-4xl md:text-6xl text-olive-900 mb-6">
                Tres principios.<br />
                <span className="italic font-normal text-olive-700">Cero negociables.</span>
              </h2>
              <p className="text-lg text-olive-800/80 leading-relaxed max-w-xl">
                No vendemos esperanza ni promesas vacías. Vendemos compuestos
                en cantidades que la evidencia respalda, con la transparencia que
                tú mereces para decidir bien.
              </p>
            </div>
            <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden">
              <Image
                src="/images/filosofia.jpg"
                alt="Filosofía Peptigene"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Dosis efectiva",
                body: "Cada ingrediente está presente en la cantidad que la evidencia respalda. Sin fairy dust ni mezclas propietarias que esconden cantidades.",
              },
              {
                num: "02",
                title: "Pureza verificada",
                body: "Cada lote se analiza en laboratorios independientes. Publicamos los resultados con el código de lote en la etiqueta.",
              },
              {
                num: "03",
                title: "Etiqueta honesta",
                body: "Si está en la lista de ingredientes, está adentro. Si no está, no está. Sin sorpresas, sin letra pequeña.",
              },
            ].map((item) => (
              <div key={item.num} className="bg-cream-50 p-8 rounded-2xl border border-olive-100">
                <p className="font-display text-5xl text-olive-300 mb-4">{item.num}</p>
                <h3 className="font-display text-2xl text-olive-900 mb-3">{item.title}</h3>
                <p className="text-olive-800/80 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="mb-12">
          <p className="eyebrow text-olive-600 mb-3">— Lo que dicen</p>
          <h2 className="display-xl text-4xl md:text-5xl text-olive-900 max-w-2xl">
            Personas que ya<br />
            <span className="italic font-normal text-olive-700">entrenan con nosotros.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: "Después de probar varias marcas, lo que más valoro es que aquí publican los análisis de pureza. Saber exactamente qué estoy tomando cambia todo.",
              name: "Mariana C.",
              role: "Crossfit · Medellín",
            },
            {
              quote: "Llevo cuatro meses con Fortis Whey y el sabor es de los mejores que he probado. No empalaga y mezcla sin grumos.",
              name: "Daniel R.",
              role: "Maratonista · Bogotá",
            },
            {
              quote: "La asesoría incluida me ayudó a entender qué realmente necesitaba y qué no. Terminé comprando menos de lo que pensaba.",
              name: "Sofía L.",
              role: "Entrenadora personal · Cali",
            },
          ].map((t, i) => (
            <figure key={i} className="bg-cream-50 border border-olive-100 rounded-2xl p-8 flex flex-col">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-olive-300 mb-6" fill="currentColor">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
              </svg>
              <blockquote className="text-olive-800 leading-relaxed mb-6 flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption>
                <p className="font-display text-lg text-olive-900">{t.name}</p>
                <p className="eyebrow text-olive-600">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA con imagen */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="bg-olive-900 text-cream-50 rounded-3xl relative overflow-hidden grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto">
            <Image
              src="/images/cta-asesoria.jpg"
              alt="Asesoría nutricional Peptigene"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-olive-900 hidden lg:block" />
          </div>
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <p className="eyebrow text-olive-300 mb-4">— Únete</p>
            <h2 className="display-xl text-4xl md:text-5xl mb-6">
              Asesoría incluida<br />
              <span className="italic font-normal text-olive-300">en tu primera compra.</span>
            </h2>
            <p className="text-lg text-cream-100/80 mb-8 max-w-lg leading-relaxed">
              Cuéntanos tus objetivos y te armamos un plan de suplementación a medida. Sin costo adicional.
            </p>
            <Link
              href="/contacto"
              className="inline-block w-fit px-8 py-4 bg-cream-50 text-olive-900 rounded-full text-sm font-medium hover:bg-olive-200 transition-colors"
            >
              Agendar asesoría
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
