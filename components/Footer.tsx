import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-olive-900 text-cream-100 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="text-cream-50">
              <Logo />
            </div>
            <p className="mt-4 text-sm text-cream-100/70 leading-relaxed max-w-xs">
              Suplementos deportivos formulados con estándares clínicos para personas activas.
            </p>
          </div>

          <div>
            <h4 className="eyebrow text-olive-300 mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogo" className="hover:text-olive-300 transition">Catálogo completo</Link></li>
              <li><Link href="/catalogo?cat=proteinas" className="hover:text-olive-300 transition">Proteínas</Link></li>
              <li><Link href="/catalogo?cat=rendimiento" className="hover:text-olive-300 transition">Rendimiento</Link></li>
              <li><Link href="/catalogo?cat=recuperacion" className="hover:text-olive-300 transition">Recuperación</Link></li>
              <li><Link href="/catalogo?cat=bienestar" className="hover:text-olive-300 transition">Bienestar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-olive-300 mb-4">Información</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/envios" className="hover:text-olive-300 transition">Envíos y devoluciones</Link></li>
              <li><Link href="/contacto" className="hover:text-olive-300 transition">Contacto</Link></li>
              <li><Link href="/terminos" className="hover:text-olive-300 transition">Términos y condiciones</Link></li>
              <li><Link href="/politica-privacidad" className="hover:text-olive-300 transition">Política de privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-olive-300 mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-cream-100/80">
              <li>hola@peptigene.demo</li>
              <li>+57 (60X) XXX XXXX</li>
              <li>Medellín, Colombia</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-olive-700 flex items-center justify-center hover:bg-olive-800 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-olive-700 flex items-center justify-center hover:bg-olive-800 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M17.5 14.4l-2.4-1.1c-.3-.1-.7 0-.9.3l-.7.9c-1.4-.8-2.6-2-3.4-3.4l.9-.7c.3-.2.4-.6.3-.9L10.2 7c-.2-.4-.6-.6-1-.5l-2 .5c-.4.1-.7.4-.7.8.1 4.7 3.9 8.5 8.6 8.6.4 0 .7-.3.8-.7l.5-2c.1-.4-.1-.8-.5-1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-olive-800 flex flex-col md:flex-row justify-between gap-4 text-xs text-cream-100/60">
          <p>© {new Date().getFullYear()} Peptigene · Proyecto académico ficticio.</p>
          <p>Sitio de demostración. Productos y precios son ilustrativos.</p>
        </div>
      </div>
    </footer>
  );
}
