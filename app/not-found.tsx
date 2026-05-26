import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-32 text-center">
      <p className="eyebrow text-olive-600 mb-3">— Error 404</p>
      <h1 className="display-xl text-6xl md:text-8xl text-olive-900 mb-6">
        Esta página<br />
        <span className="italic font-normal text-olive-700">no existe.</span>
      </h1>
      <p className="text-olive-700 mb-10 max-w-md mx-auto">
        El enlace que seguiste puede estar roto o el contenido se movió a otra
        ubicación.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="px-8 py-4 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors"
        >
          Volver al inicio
        </Link>
        <Link
          href="/catalogo"
          className="px-8 py-4 border border-olive-900 text-olive-900 rounded-full text-sm font-medium hover:bg-olive-900 hover:text-cream-50 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
