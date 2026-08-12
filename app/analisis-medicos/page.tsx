import type { Metadata } from "next";
import Link from "next/link";
import { formatCOP } from "@/lib/products";

export const metadata: Metadata = {
  title: "Análisis médicos",
  description:
    "Paquetes de análisis de laboratorio para medir tus biomarcadores antes y durante la suplementación: perfil base, deportivo, hormonal y de micronutrientes.",
  alternates: {
    canonical: "/analisis-medicos",
  },
  openGraph: {
    title: "Análisis médicos · Peptigene",
    description:
      "Mide tus biomarcadores antes de suplementarte. Paquetes de laboratorio pensados para personas activas.",
    url: "https://peptigene.demo/analisis-medicos",
  },
};

type Panel = {
  slug: string;
  name: string;
  focus: string;
  description: string;
  markers: string[];
  price: number;
  turnaround: string;
  badge?: string;
};

const panels: Panel[] = [
  {
    slug: "perfil-base",
    name: "Perfil Base",
    focus: "Chequeo general",
    description:
      "Una fotografía de tu estado general antes de empezar cualquier plan. Ideal como punto de partida.",
    markers: [
      "Hemograma completo",
      "Glucosa en ayunas",
      "Perfil lipídico (colesterol y triglicéridos)",
      "Función renal (creatinina, BUN)",
      "Función hepática (AST, ALT)",
    ],
    price: 189000,
    turnaround: "Resultados en 24–48 h",
    badge: "Más solicitado",
  },
  {
    slug: "perfil-deportivo",
    name: "Perfil Deportivo",
    focus: "Rendimiento y recuperación",
    description:
      "Biomarcadores que se mueven con el entrenamiento intenso. Útil para ajustar cargas y recuperación.",
    markers: [
      "Testosterona total y libre",
      "Cortisol",
      "Creatina quinasa (CK)",
      "Ferritina",
      "Vitamina D (25-OH)",
      "Perfil tiroideo (TSH, T4 libre)",
    ],
    price: 289000,
    turnaround: "Resultados en 48–72 h",
    badge: "Para deportistas",
  },
  {
    slug: "perfil-micronutrientes",
    name: "Perfil Micronutrientes",
    focus: "Vitaminas y minerales",
    description:
      "Mide los micronutrientes que la dieta activa suele dejar cortos y que muchos suplementos buscan cubrir.",
    markers: [
      "Vitamina D (25-OH)",
      "Vitamina B12",
      "Ácido fólico",
      "Magnesio",
      "Zinc",
      "Ferritina y hierro sérico",
    ],
    price: 245000,
    turnaround: "Resultados en 48–72 h",
  },
  {
    slug: "perfil-hormonal",
    name: "Perfil Hormonal",
    focus: "Equilibrio hormonal",
    description:
      "Panel amplio para entender el eje hormonal completo, más allá del entrenamiento.",
    markers: [
      "Testosterona total y libre",
      "Estradiol",
      "Cortisol matutino",
      "TSH, T3 libre, T4 libre",
      "Prolactina",
      "SHBG",
    ],
    price: 329000,
    turnaround: "Resultados en 72 h",
  },
];

const steps = [
  {
    step: "01",
    title: "Elige tu perfil",
    body: "Selecciona el paquete que se ajuste a tu objetivo o pide orientación a nuestro equipo si tienes dudas.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    step: "02",
    title: "Toma de muestra",
    body: "Coordinamos la toma en un laboratorio aliado o a domicilio, en ayunas cuando el perfil lo requiere.",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  {
    step: "03",
    title: "Interpretación",
    body: "Recibes tus resultados y una lectura clara de qué significan para tu plan de suplementación y entrenamiento.",
    icon: "M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const faqs = [
  {
    q: "¿Necesito ir en ayunas?",
    a: "Depende del perfil. El Perfil Base y los que incluyen glucosa o lípidos requieren entre 8 y 12 horas de ayuno. Te confirmamos las indicaciones exactas al agendar.",
  },
  {
    q: "¿Los resultados reemplazan una consulta médica?",
    a: "No. Los análisis son una herramienta de información. La interpretación que entregamos es orientativa y no sustituye el diagnóstico ni el tratamiento de un profesional de la salud.",
  },
  {
    q: "¿Puedo combinar un perfil con mis suplementos?",
    a: "Sí, esa es justamente la idea. Medir tus biomarcadores antes y después de un ciclo de suplementación te permite ver qué está funcionando y ajustar dosis con criterio.",
  },
  {
    q: "¿En qué ciudades está disponible?",
    a: "Trabajamos con laboratorios aliados en las principales ciudades de Colombia. Escríbenos para confirmar cobertura y toma a domicilio en tu zona.",
  },
];

function requestHref(panel: Panel) {
  const message = `Hola, vengo del sitio de Peptigene y quiero solicitar el ${panel.name} (análisis médicos).`;
  return `https://wa.me/573012344785?text=${encodeURIComponent(message)}`;
}

export default function AnalisisMedicosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            name: "Peptigene · Análisis médicos",
            url: "https://peptigene.demo/analisis-medicos",
            description:
              "Paquetes de análisis de laboratorio para medir biomarcadores antes y durante la suplementación.",
            areaServed: "CO",
            makesOffer: panels.map((panel) => ({
              "@type": "Offer",
              name: panel.name,
              category: "MedicalTest",
              priceCurrency: "COP",
              price: panel.price,
              url: `https://peptigene.demo/analisis-medicos#${panel.slug}`,
            })),
          }),
        }}
      />

      {/* HERO */}
      <section className="bg-cream-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-olive-600 mb-6">
                · Biomarcadores · Laboratorios aliados ·
              </p>
              <h1 className="display-xl text-5xl md:text-7xl text-olive-900 mb-8">
                Suplementa<br />
                <span className="italic font-normal text-olive-700">con datos.</span>
              </h1>
              <p className="text-lg md:text-xl text-olive-800/80 max-w-xl leading-relaxed">
                Antes de tomar cualquier suplemento, vale la pena saber de dónde
                partes. Nuestros paquetes de análisis miden los biomarcadores que
                importan para personas activas, y te ayudan a decidir con
                evidencia en lugar de intuición.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-olive-900 text-cream-50 rounded-3xl p-8">
                <h2 className="font-display text-2xl mb-6">
                  ¿Por qué medir antes?
                </h2>
                <ul className="space-y-4 text-cream-100/85 text-sm leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-olive-300 mt-0.5">◆</span>
                    Detectas déficits reales antes de gastar en suplementos que
                    quizá no necesitas.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-olive-300 mt-0.5">◆</span>
                    Estableces una línea base para comparar después de un ciclo.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-olive-300 mt-0.5">◆</span>
                    Ajustas dosis con criterio, no por marketing.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAQUETES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="mb-12">
          <p className="eyebrow text-olive-600 mb-3">— Paquetes</p>
          <h2 className="display-xl text-4xl md:text-5xl text-olive-900 max-w-2xl">
            Perfiles de análisis<br />
            <span className="italic font-normal text-olive-700">a tu medida.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {panels.map((panel) => (
            <article
              key={panel.slug}
              id={panel.slug}
              className="scroll-mt-24 bg-cream-50 border border-olive-100 rounded-2xl p-8 flex flex-col hover:border-olive-300 transition"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="eyebrow text-olive-600 mb-2">{panel.focus}</p>
                  <h3 className="font-display text-2xl text-olive-900">
                    {panel.name}
                  </h3>
                </div>
                {panel.badge && (
                  <span className="shrink-0 bg-olive-400 text-olive-950 text-xs font-bold px-3 py-1 rounded-full">
                    {panel.badge}
                  </span>
                )}
              </div>

              <p className="text-olive-800/80 leading-relaxed mb-6">
                {panel.description}
              </p>

              <ul className="space-y-2 mb-6 text-sm text-olive-800">
                {panel.markers.map((marker) => (
                  <li key={marker} className="flex gap-2.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-olive-600 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {marker}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-olive-100 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-3xl text-olive-900">
                    {formatCOP(panel.price)}
                  </p>
                  <p className="eyebrow text-olive-600 mt-1">
                    {panel.turnaround}
                  </p>
                </div>
                <a
                  href={requestHref(panel)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors whitespace-nowrap"
                >
                  Solicitar
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-olive-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow text-olive-600 mb-3">— Cómo funciona</p>
            <h2 className="display-xl text-4xl md:text-5xl text-olive-900">
              Del pinchazo<br />
              <span className="italic font-normal text-olive-700">a la decisión.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-cream-50 p-8 rounded-2xl border border-olive-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-5xl text-olive-300">
                    {s.step}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-olive-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d={s.icon}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-olive-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-olive-800/80 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <div className="mb-12">
          <p className="eyebrow text-olive-600 mb-3">— Preguntas frecuentes</p>
          <h2 className="display-xl text-4xl md:text-5xl text-olive-900">
            Antes de agendar.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-cream-50 border border-olive-100 rounded-2xl p-6 open:border-olive-300"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-display text-lg text-olive-900">
                {faq.q}
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-olive-600 transition-transform group-open:rotate-45 shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </summary>
              <p className="mt-4 text-olive-800/80 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* AVISO + CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="bg-olive-900 text-cream-50 rounded-3xl p-8 md:p-16">
          <p className="eyebrow text-olive-300 mb-4">— ¿Dudas sobre cuál elegir?</p>
          <h2 className="display-xl text-4xl md:text-5xl mb-6 max-w-2xl">
            Te ayudamos a leer<br />
            <span className="italic font-normal text-olive-300">tus números.</span>
          </h2>
          <p className="text-lg text-cream-100/80 mb-8 max-w-2xl leading-relaxed">
            Cuéntanos tus objetivos y te recomendamos el perfil que más aporta a
            tu plan. La orientación no tiene costo.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="inline-block px-8 py-4 bg-cream-50 text-olive-900 rounded-full text-sm font-medium hover:bg-olive-200 transition-colors"
            >
              Hablar con el equipo
            </Link>
            <Link
              href="/catalogo"
              className="inline-block px-8 py-4 border border-cream-50/40 text-cream-50 rounded-full text-sm font-medium hover:bg-cream-50/10 transition-colors"
            >
              Ver suplementos
            </Link>
          </div>

          <p className="mt-10 pt-8 border-t border-olive-800 text-xs text-cream-100/60 max-w-3xl leading-relaxed">
            Aviso: Peptigene es un proyecto académico ficticio. Los paquetes,
            precios y tiempos aquí mostrados son ilustrativos y no corresponden a
            un servicio real de análisis clínicos. Esta información no constituye
            consejo médico; consulta siempre a un profesional de la salud.
          </p>
        </div>
      </section>
    </>
  );
}
