"use client";

import { useState } from "react";
import Link from "next/link";

export default function KpvPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
      {/* Encabezado */}
      <p className="eyebrow text-olive-600 mb-3">— Programa KPV</p>
      <h1 className="display-xl text-4xl md:text-6xl text-olive-900 mb-4">
        Evaluación previa<br />
        <span className="italic font-normal text-olive-700">para iniciar KPV.</span>
      </h1>
      <p className="text-lg text-olive-700/80 max-w-2xl mb-8">
        KPV es un tripéptido (Lisina–Prolina–Valina) derivado de la α-MSH con
        propiedades antiinflamatorias. Completa este formulario de tamizaje para
        que nuestro equipo evalúe tu caso antes de cualquier protocolo.
      </p>

      {/* Aviso legal destacado */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-12 flex gap-3">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4m0 4h.01M10.29 3.86l-8.48 14.7A2 2 0 003.53 21h16.94a2 2 0 001.72-2.44L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm text-amber-900">
          <strong>Aviso importante.</strong> KPV <strong>no es un medicamento aprobado</strong> y
          no existe una dosis, esquema ni vía oficial validados en humanos. La información de
          esta página es educativa (proyecto académico), <strong>no constituye consejo médico</strong> y
          no reemplaza la valoración de un profesional de la salud.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Formulario */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="bg-olive-100 border border-olive-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-olive-200 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-olive-900" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-olive-900 mb-2">¡Solicitud recibida!</h2>
              <p className="text-olive-800 mb-1">
                Nuestro equipo revisará tu tamizaje y te contactará para agendar una valoración.
              </p>
              <p className="text-sm text-olive-700/70">
                (Demo académica · No se envía ni almacena ninguna información realmente.)
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-cream-50 border border-olive-100 rounded-2xl p-6 md:p-8 space-y-8">
              {/* Datos personales */}
              <fieldset className="space-y-5">
                <legend className="eyebrow text-olive-600 mb-4">1 · Datos personales</legend>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Nombre completo" required />
                  <Field label="Correo electrónico" type="email" required />
                  <Field label="Teléfono / WhatsApp" type="tel" required />
                  <Field label="Edad" type="number" required />
                  <Field label="Peso (kg)" type="number" />
                  <label className="block">
                    <span className="block text-xs text-olive-700 mb-1.5">Sexo biológico</span>
                    <select className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg text-olive-900 focus:outline-none focus:border-olive-700">
                      <option value="">Selecciona…</option>
                      <option>Femenino</option>
                      <option>Masculino</option>
                      <option>Prefiero no decir</option>
                    </select>
                  </label>
                </div>
              </fieldset>

              {/* Objetivo */}
              <fieldset className="space-y-5">
                <legend className="eyebrow text-olive-600 mb-4">2 · Motivo de interés</legend>
                <label className="block">
                  <span className="block text-xs text-olive-700 mb-1.5">¿Qué buscas abordar con KPV? *</span>
                  <select required className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg text-olive-900 focus:outline-none focus:border-olive-700">
                    <option value="">Selecciona…</option>
                    <option>Inflamación intestinal / digestiva (EII, colitis)</option>
                    <option>Salud y reparación de la piel</option>
                    <option>Inflamación sistémica / articular</option>
                    <option>Cicatrización y recuperación</option>
                    <option>Otro / no estoy seguro</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs text-olive-700 mb-1.5">Vía de administración de interés</span>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {["Subcutánea", "Oral", "Tópica"].map((v) => (
                      <label key={v} className="flex items-center gap-2 p-3 border border-olive-200 rounded-xl cursor-pointer hover:bg-olive-50 text-sm text-olive-900">
                        <input type="radio" name="via" className="accent-olive-700" />
                        {v}
                      </label>
                    ))}
                  </div>
                </label>
                <label className="block">
                  <span className="block text-xs text-olive-700 mb-1.5">Cuéntanos brevemente tu caso</span>
                  <textarea rows={4} className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg text-olive-900 focus:outline-none focus:border-olive-700 resize-none" />
                </label>
              </fieldset>

              {/* Historia clínica / tamizaje */}
              <fieldset className="space-y-5">
                <legend className="eyebrow text-olive-600 mb-4">3 · Tamizaje de seguridad</legend>
                <p className="text-sm text-olive-700/80 -mt-2">
                  Marca todo lo que aplique. Estas situaciones pueden ser una
                  contraindicación o requerir precaución adicional.
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {SCREENING.map((item) => (
                    <label key={item} className="flex items-start gap-2.5 p-3 border border-olive-200 rounded-xl cursor-pointer hover:bg-olive-50 text-sm text-olive-900">
                      <input type="checkbox" className="accent-olive-700 mt-0.5" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <label className="block">
                    <span className="block text-xs text-olive-700 mb-1.5">Medicamentos actuales</span>
                    <input className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg text-olive-900 focus:outline-none focus:border-olive-700" placeholder="Ninguno / especifica" />
                  </label>
                  <label className="block">
                    <span className="block text-xs text-olive-700 mb-1.5">Alergias conocidas</span>
                    <input className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg text-olive-900 focus:outline-none focus:border-olive-700" placeholder="Ninguna / especifica" />
                  </label>
                </div>
                <label className="block">
                  <span className="block text-xs text-olive-700 mb-1.5">¿Has usado péptidos antes? ¿Cuáles?</span>
                  <input className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg text-olive-900 focus:outline-none focus:border-olive-700" placeholder="No / especifica" />
                </label>
              </fieldset>

              {/* Consentimiento */}
              <fieldset className="space-y-3">
                <legend className="eyebrow text-olive-600 mb-4">4 · Consentimiento</legend>
                <label className="flex items-start gap-3 text-sm text-olive-800">
                  <input required type="checkbox" className="accent-olive-700 mt-1" />
                  <span>
                    Entiendo que KPV no es un medicamento aprobado y que esta información
                    no sustituye la valoración de un profesional de la salud. *
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-olive-800">
                  <input required type="checkbox" className="accent-olive-700 mt-1" />
                  <span>
                    Autorizo que el equipo revise mis respuestas para evaluar mi caso. *
                  </span>
                </label>
              </fieldset>

              <button type="submit" className="px-8 py-4 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors">
                Enviar solicitud de evaluación
              </button>
            </form>
          )}
        </div>

        {/* Panel lateral: pros / contras / contraindicaciones */}
        <aside className="lg:col-span-2 space-y-6">
          {/* Puntos a favor */}
          <div className="bg-olive-50 border border-olive-200 rounded-2xl p-6">
            <h3 className="eyebrow text-olive-700 mb-4">Puntos a favor</h3>
            <ul className="space-y-3">
              {PROS.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm text-olive-900">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-olive-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Puntos en contra */}
          <div className="bg-cream-50 border border-olive-200 rounded-2xl p-6">
            <h3 className="eyebrow text-olive-600 mb-4">Puntos en contra</h3>
            <ul className="space-y-3">
              {CONS.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm text-olive-800">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-olive-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Contraindicaciones */}
          <div className="bg-olive-900 text-cream-50 rounded-2xl p-6">
            <h3 className="eyebrow text-olive-300 mb-4">Contraindicaciones y precauciones</h3>
            <ul className="space-y-3">
              {CONTRA.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm text-cream-100/90">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-olive-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
            <p className="text-xs text-cream-100/60 mt-5 pt-4 border-t border-olive-700">
              Ante cualquiera de estos casos, consulta con tu médico antes de considerar KPV.
            </p>
          </div>

          <Link href="/contacto" className="block text-center text-sm text-olive-700 underline hover:text-olive-900">
            ¿Tienes dudas? Escríbenos →
          </Link>
        </aside>
      </div>
    </div>
  );
}

const SCREENING = [
  "Embarazo o lactancia",
  "Antecedente o diagnóstico de cáncer",
  "Enfermedad autoinmune activa",
  "Enfermedad renal o hepática",
  "Trastorno de coagulación",
  "Inmunosupresión o trasplante",
  "Alergia a péptidos o excipientes",
  "Menor de 18 años",
];

const PROS = [
  "Potente acción antiinflamatoria: inhibe la vía NF-κB.",
  "Reduce citoquinas como TNF-α, IL-1β e IL-6.",
  "Autofocalización en intestino inflamado (transportador PepT1).",
  "Derivado de la α-MSH sin efecto sobre la pigmentación.",
  "Versátil: vía oral, subcutánea o tópica.",
  "Perfil de tolerancia favorable en estudios preliminares.",
];

const CONS = [
  "No aprobado por agencias reguladoras; uso solo en investigación.",
  "Sin dosis ni esquema oficial validados en humanos.",
  "Ausencia de datos de seguridad a largo plazo.",
  "Vida media corta: requiere aplicación diaria durante el ciclo.",
  "Calidad y pureza variables según el proveedor.",
  "Evidencia clínica humana aún limitada.",
];

const CONTRA = [
  "Embarazo y lactancia.",
  "Antecedente o presencia de cáncer (efecto sobre proliferación no aclarado).",
  "Enfermedades autoinmunes activas sin control médico.",
  "Insuficiencia renal o hepática significativa.",
  "Alergia conocida a péptidos o a los excipientes de la formulación.",
  "Uso en menores de 18 años.",
  "Uso concomitante con inmunosupresores sin supervisión.",
];

function Field({
  label,
  type = "text",
  required,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-olive-700 mb-1.5">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        required={required}
        className="w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg text-olive-900 focus:outline-none focus:border-olive-700 transition"
      />
    </label>
  );
}
