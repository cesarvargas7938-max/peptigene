"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
      <p className="eyebrow text-olive-600 mb-3">— Hablemos</p>
      <h1 className="display-xl text-4xl md:text-6xl text-olive-900 mb-4">
        Estamos<br />
        <span className="italic font-normal text-olive-700">a un mensaje.</span>
      </h1>
      <p className="text-lg text-olive-700/80 max-w-xl mb-12">
        Dudas sobre productos, asesoría nutricional o seguimiento de pedido.
        Respondemos en menos de 24 horas hábiles.
      </p>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          {sent ? (
            <div className="bg-olive-100 border border-olive-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-olive-200 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-olive-900" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-olive-900 mb-2">¡Mensaje enviado!</h2>
              <p className="text-olive-800">
                Te responderemos al correo que registraste. (Demo académica · No se envía nada realmente.)
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-cream-50 border border-olive-100 rounded-2xl p-6 md:p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <label>
                  <span className="block text-xs text-olive-700 mb-1.5">Nombre *</span>
                  <input required type="text" className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg focus:outline-none focus:border-olive-700" />
                </label>
                <label>
                  <span className="block text-xs text-olive-700 mb-1.5">Correo *</span>
                  <input required type="email" className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg focus:outline-none focus:border-olive-700" />
                </label>
              </div>
              <label className="block">
                <span className="block text-xs text-olive-700 mb-1.5">Asunto</span>
                <select className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg focus:outline-none focus:border-olive-700">
                  <option>Consulta sobre un producto</option>
                  <option>Asesoría nutricional</option>
                  <option>Seguimiento de pedido</option>
                  <option>Devoluciones o cambios</option>
                  <option>Otro</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs text-olive-700 mb-1.5">Mensaje *</span>
                <textarea required rows={5} className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg focus:outline-none focus:border-olive-700 resize-none" />
              </label>
              <button type="submit" className="px-8 py-4 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors">
                Enviar mensaje
              </button>
            </form>
          )}
        </div>

        <aside className="lg:col-span-2 space-y-6">
          <div className="bg-olive-900 text-cream-50 rounded-2xl p-6">
            <h3 className="eyebrow text-olive-300 mb-3">Soporte</h3>
            <p className="text-sm mb-1">hola@peptigene.demo</p>
            <p className="text-sm text-cream-100/70">Lun–Vie · 8:00 a.m. – 6:00 p.m.</p>
          </div>
          <div className="bg-cream-50 border border-olive-100 rounded-2xl p-6">
            <h3 className="eyebrow text-olive-600 mb-3">Asesoría nutricional</h3>
            <p className="text-sm text-olive-800">
              Agenda 30 minutos con nuestro equipo para armar un plan a medida.
              Incluido en cualquier compra superior a $150.000 COP.
            </p>
          </div>
          <div className="bg-cream-50 border border-olive-100 rounded-2xl p-6">
            <h3 className="eyebrow text-olive-600 mb-3">Oficina</h3>
            <p className="text-sm text-olive-800">
              Medellín, Colombia<br />
              Atención solo con cita previa
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
