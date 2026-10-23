"use client";

import { useEffect, useMemo, useState } from "react";
import {
  COMORBILIDADES,
  evaluar,
  respuestasVacias,
  resumenTexto,
  type Hallazgo,
  type Nivel,
  type Respuestas,
  type Resultado,
  type SiNo,
  type Veredicto,
} from "@/lib/evaluacion";

const STORAGE_KEY = "peptigene_evaluaciones";

type Guardada = {
  id: string;
  fecha: string;
  respuestas: Respuestas;
  veredicto: Veredicto;
};

const EJEMPLO: Respuestas = {
  ...respuestasVacias,
  nombre: "María Pérez",
  tratamiento: "tirzepatida",
  edad: 38,
  sexo: "femenino",
  pesoKg: 92,
  estaturaCm: 162,
  pesoIdealKg: 68,
  embarazoLactancia: "no",
  suplementos: "Omega 3 y vitamina D",
  alergiasMedicamentos: "si",
  alergiasDetalle: "Penicilina",
  pancreatitisFamiliar: "no",
  pancreatitisPersonal: "no",
  dolorAbdominalInexplicado: "no",
  tiroidesCmtMen2: "no",
  vesicula: "no",
  vesiculaDetalle: "",
  enfermedadGiGrave: "no",
  diabetesTipo1: "no",
  medicamentos: "Metformina 850 mg cada 12 horas",
  ejercicio: "ocasional",
  comorbilidades: ["prediabetes"],
  perfilMetabolico:
    "Glucosa 108 mg/dL\nHbA1c 6.0 %\nInsulina 22 µU/mL\nColesterol total 215\nLDL 138\nHDL 42\nTriglicéridos 190\nTSH 2.3\nCreatinina 0.8\nALT 38\nAST 29\nLipasa 41",
};

const PREGUNTAS_SI_NO: { campo: keyof Respuestas; numero: string; texto: string; detalle?: keyof Respuestas; detallePlaceholder?: string }[] = [
  { campo: "alergiasMedicamentos", numero: "2", texto: "¿Tienes antecedentes de alergias a medicamentos?", detalle: "alergiasDetalle", detallePlaceholder: "¿Cuáles?" },
  { campo: "pancreatitisFamiliar", numero: "3", texto: "¿Hay antecedentes de pancreatitis en tu familia?" },
  {
    campo: "tiroidesCmtMen2",
    numero: "4",
    texto: "¿Algún familiar cercano (o tú) ha tenido cáncer de tiroides (especialmente carcinoma medular) o síndrome MEN2?",
  },
  { campo: "vesicula", numero: "5", texto: "¿Alguna vez has tenido cálculos biliares o problemas en la vesícula?", detalle: "vesiculaDetalle", detallePlaceholder: "¿Qué tipo de problemas? ¿Te operaron?" },
  { campo: "pancreatitisPersonal", numero: "6a", texto: "¿Has tenido pancreatitis?" },
  { campo: "dolorAbdominalInexplicado", numero: "6b", texto: "¿Has tenido dolor abdominal muy fuerte e inexplicado?" },
  { campo: "enfermedadGiGrave", numero: "11", texto: "¿Tienes alguna enfermedad gastrointestinal grave (gastroparesia, obstrucción, enfermedad inflamatoria intestinal activa)?" },
  { campo: "diabetesTipo1", numero: "12", texto: "¿Tienes diabetes tipo 1?" },
];

const inputCls =
  "w-full px-4 py-3 bg-cream-100 border border-olive-200 rounded-lg focus:outline-none focus:border-olive-700 text-olive-900";

export default function EvaluacionPage() {
  const [r, setR] = useState<Respuestas>(respuestasVacias);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [guardadas, setGuardadas] = useState<Guardada[]>([]);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setGuardadas(JSON.parse(raw));
    } catch {
      /* sin almacenamiento disponible */
    }
  }, []);

  const set = <K extends keyof Respuestas>(campo: K, valor: Respuestas[K]) =>
    setR((prev) => ({ ...prev, [campo]: valor }));

  const num = (v: string): number | null => {
    const n = parseFloat(v.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  const imcPreview = useMemo(() => {
    if (!r.pesoKg || !r.estaturaCm) return null;
    const m = r.estaturaCm / 100;
    return Math.round((r.pesoKg / (m * m)) * 10) / 10;
  }, [r.pesoKg, r.estaturaCm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = evaluar(r);
    setResultado(res);
    setCopiado(false);
    setTimeout(() => document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const guardar = () => {
    if (!resultado) return;
    const nueva: Guardada = {
      id: `${Date.now()}`,
      fecha: new Date().toISOString(),
      respuestas: r,
      veredicto: resultado.veredicto,
    };
    const lista = [nueva, ...guardadas].slice(0, 50);
    setGuardadas(lista);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {
      /* sin almacenamiento disponible */
    }
  };

  const cargar = (g: Guardada) => {
    setR(g.respuestas);
    setResultado(evaluar(g.respuestas));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = (id: string) => {
    const lista = guardadas.filter((g) => g.id !== id);
    setGuardadas(lista);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {
      /* sin almacenamiento disponible */
    }
  };

  const copiar = async () => {
    if (!resultado) return;
    try {
      await navigator.clipboard.writeText(resumenTexto(r, resultado));
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  const nueva = () => {
    setR(respuestasVacias);
    setResultado(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
      <p className="eyebrow text-olive-600 mb-3">— Tratamiento con péptidos</p>
      <h1 className="display-xl text-4xl md:text-6xl text-olive-900 mb-4">
        Evaluación
        <br />
        <span className="italic font-normal text-olive-700">de aptitud.</span>
      </h1>
      <p className="text-lg text-olive-700/80 max-w-2xl mb-4">
        Tamizaje para tratamientos de pérdida de peso con tirzepatida o retatrutida. Responde el formulario, pega el
        perfil metabólico y obtén un veredicto con sugerencia de dosis inicial.
      </p>
      <p className="text-sm text-olive-800 bg-olive-50 border border-olive-200 rounded-xl px-4 py-3 max-w-2xl mb-10">
        Herramienta de apoyo clínico. No reemplaza la valoración médica: la decisión final y la prescripción
        corresponden a un profesional de la salud.
      </p>

      <div className="grid lg:grid-cols-5 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          {/* Tratamiento */}
          <Seccion titulo="Tratamiento a evaluar">
            <div className="grid grid-cols-2 gap-3">
              {(["tirzepatida", "retatrutida"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => set("tratamiento", t)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    r.tratamiento === t
                      ? "bg-olive-900 text-cream-50 border-olive-900"
                      : "bg-cream-100 text-olive-800 border-olive-200 hover:border-olive-700"
                  }`}
                >
                  {t === "tirzepatida" ? "Tirzepatida" : "Retatrutida"}
                </button>
              ))}
            </div>
          </Seccion>

          {/* Datos básicos (preguntas 9, 10 y nombre) */}
          <Seccion titulo="Datos de la persona" numero="9 · 10">
            <div className="grid md:grid-cols-2 gap-4">
              <Campo label="Nombre">
                <input type="text" className={inputCls} value={r.nombre} onChange={(e) => set("nombre", e.target.value)} />
              </Campo>
              <Campo label="Sexo">
                <select className={inputCls} value={r.sexo} onChange={(e) => set("sexo", e.target.value as Respuestas["sexo"])}>
                  <option value="">Selecciona</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                </select>
              </Campo>
              <Campo label="Edad (años)">
                <input type="number" min={0} className={inputCls} value={r.edad ?? ""} onChange={(e) => set("edad", num(e.target.value))} />
              </Campo>
              <Campo label="Peso actual (kg)">
                <input type="number" step="0.1" min={0} className={inputCls} value={r.pesoKg ?? ""} onChange={(e) => set("pesoKg", num(e.target.value))} />
              </Campo>
              <Campo label="Estatura (cm)">
                <input type="number" min={0} className={inputCls} value={r.estaturaCm ?? ""} onChange={(e) => set("estaturaCm", num(e.target.value))} />
              </Campo>
              <Campo label="Peso ideal / meta (kg)">
                <input type="number" step="0.1" min={0} className={inputCls} value={r.pesoIdealKg ?? ""} onChange={(e) => set("pesoIdealKg", num(e.target.value))} />
              </Campo>
            </div>
            {imcPreview !== null && (
              <p className="mt-3 text-sm text-olive-700">
                IMC calculado: <strong className="text-olive-900">{imcPreview}</strong>
              </p>
            )}
            {r.sexo === "femenino" && (
              <div className="mt-4">
                <SiNoCampo
                  texto="¿Estás embarazada, en lactancia o planeas embarazo en los próximos meses?"
                  valor={r.embarazoLactancia}
                  onChange={(v) => set("embarazoLactancia", v)}
                />
              </div>
            )}
          </Seccion>

          {/* Cuestionario */}
          <Seccion titulo="Cuestionario" numero="1 – 8">
            <div className="space-y-5">
              <Campo label="1. ¿Te suplementas o tomas algún tipo de vitaminas? ¿Cuáles?">
                <input type="text" className={inputCls} placeholder="Ej. Omega 3, vitamina D, creatina… o 'No'" value={r.suplementos} onChange={(e) => set("suplementos", e.target.value)} />
              </Campo>

              {PREGUNTAS_SI_NO.map((p) => (
                <div key={p.campo}>
                  <SiNoCampo
                    texto={`${p.numero}. ${p.texto}`}
                    valor={r[p.campo] as SiNo}
                    onChange={(v) => set(p.campo, v as never)}
                  />
                  {p.detalle && r[p.campo] === "si" && (
                    <input
                      type="text"
                      className={`${inputCls} mt-2`}
                      placeholder={p.detallePlaceholder}
                      value={r[p.detalle] as string}
                      onChange={(e) => set(p.detalle as keyof Respuestas, e.target.value as never)}
                    />
                  )}
                </div>
              ))}

              <Campo label="7. ¿Usas algún medicamento en este momento? ¿Cuál, en qué concentración y cada cuánto?">
                <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Ej. Metformina 850 mg cada 12 h; Losartán 50 mg diario… o 'No'" value={r.medicamentos} onChange={(e) => set("medicamentos", e.target.value)} />
              </Campo>

              <Campo label="8. ¿Haces ejercicio?">
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["no", "No"],
                      ["ocasional", "Ocasional"],
                      ["regular", "Regular (≥3/sem)"],
                    ] as const
                  ).map(([v, l]) => (
                    <Toggle key={v} activo={r.ejercicio === v} onClick={() => set("ejercicio", v)}>
                      {l}
                    </Toggle>
                  ))}
                </div>
              </Campo>
            </div>
          </Seccion>

          {/* Comorbilidades */}
          <Seccion titulo="Condiciones de salud" numero="Marca las que apliquen">
            <div className="grid md:grid-cols-2 gap-2">
              {COMORBILIDADES.map((c) => {
                const activo = r.comorbilidades.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${
                      activo ? "bg-olive-100 border-olive-400 text-olive-900" : "bg-cream-100 border-olive-200 text-olive-800 hover:border-olive-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-olive-700"
                      checked={activo}
                      onChange={(e) =>
                        set(
                          "comorbilidades",
                          e.target.checked ? [...r.comorbilidades, c.id] : r.comorbilidades.filter((x) => x !== c.id),
                        )
                      }
                    />
                    <span>{c.label}</span>
                  </label>
                );
              })}
            </div>
          </Seccion>

          {/* Perfil metabólico */}
          <Seccion titulo="Perfil metabólico" numero="Opcional">
            <p className="text-sm text-olive-700 mb-3">
              Pega los resultados de laboratorio, un analito por línea o separados por coma. Se reconocen glucosa, HbA1c,
              insulina, perfil lipídico, TSH, calcitonina, creatinina, TFG, ALT/AST, lipasa, amilasa, ácido úrico,
              vitamina D, B12, hemoglobina y ferritina.
            </p>
            <textarea
              rows={8}
              className={`${inputCls} font-mono text-sm resize-y`}
              placeholder={"Glucosa 108 mg/dL\nHbA1c 6.0 %\nColesterol total 215\nLDL 138\nHDL 42\nTriglicéridos 190\nTSH 2.3\nCreatinina 0.8\nLipasa 41"}
              value={r.perfilMetabolico}
              onChange={(e) => set("perfilMetabolico", e.target.value)}
            />
          </Seccion>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="px-8 py-4 bg-olive-900 text-cream-50 rounded-full text-sm font-medium hover:bg-olive-800 transition-colors">
              Evaluar aptitud
            </button>
            <button type="button" onClick={() => setR(EJEMPLO)} className="px-6 py-4 border border-olive-300 text-olive-800 rounded-full text-sm hover:border-olive-700 transition-colors">
              Cargar ejemplo
            </button>
            <button type="button" onClick={nueva} className="px-6 py-4 text-olive-700 rounded-full text-sm hover:text-olive-900 transition-colors">
              Limpiar
            </button>
          </div>
        </form>

        {/* Panel lateral: resultado + historial */}
        <aside className="lg:col-span-2 space-y-6">
          <div id="resultado" className="lg:sticky lg:top-24 space-y-6">
            {resultado ? (
              <ResultadoPanel resultado={resultado} onCopiar={copiar} copiado={copiado} onGuardar={guardar} />
            ) : (
              <div className="bg-cream-50 border border-dashed border-olive-300 rounded-2xl p-6 text-sm text-olive-700">
                Completa el formulario y pulsa <strong>Evaluar aptitud</strong>. El resultado aparecerá aquí con el detalle
                de contraindicaciones, precauciones y la dosis inicial sugerida.
              </div>
            )}

            {guardadas.length > 0 && (
              <div className="bg-cream-50 border border-olive-100 rounded-2xl p-5">
                <h3 className="eyebrow text-olive-600 mb-3">Evaluaciones guardadas</h3>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {guardadas.map((g) => (
                    <li key={g.id} className="flex items-center justify-between gap-2 text-sm">
                      <button type="button" onClick={() => cargar(g)} className="text-left flex-1 hover:text-olive-600">
                        <span className="font-medium text-olive-900">{g.respuestas.nombre || "Sin nombre"}</span>
                        <span className="block text-xs text-olive-700/70">
                          {new Date(g.fecha).toLocaleString("es-CO")} · {g.respuestas.tratamiento}
                        </span>
                      </button>
                      <BadgeVeredicto veredicto={g.veredicto} compacto />
                      <button type="button" onClick={() => eliminar(g.id)} aria-label="Eliminar" className="text-olive-400 hover:text-red-600 px-1">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */

function Seccion({ titulo, numero, children }: { titulo: string; numero?: string; children: React.ReactNode }) {
  return (
    <section className="bg-cream-50 border border-olive-100 rounded-2xl p-6 md:p-8">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-2xl text-olive-900">{titulo}</h2>
        {numero && <span className="eyebrow text-olive-500">{numero}</span>}
      </div>
      {children}
    </section>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-olive-800 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2.5 rounded-lg border text-sm transition-colors ${
        activo ? "bg-olive-900 text-cream-50 border-olive-900" : "bg-cream-100 text-olive-800 border-olive-200 hover:border-olive-700"
      }`}
    >
      {children}
    </button>
  );
}

function SiNoCampo({ texto, valor, onChange }: { texto: string; valor: SiNo; onChange: (v: SiNo) => void }) {
  return (
    <div>
      <p className="text-sm text-olive-800 mb-2">{texto}</p>
      <div className="grid grid-cols-2 gap-2 max-w-xs">
        <Toggle activo={valor === "si"} onClick={() => onChange("si")}>
          Sí
        </Toggle>
        <Toggle activo={valor === "no"} onClick={() => onChange("no")}>
          No
        </Toggle>
      </div>
    </div>
  );
}

const ESTILO_VEREDICTO: Record<Veredicto, { etiqueta: string; cls: string }> = {
  APTO: { etiqueta: "Apto", cls: "bg-olive-500 text-white" },
  REQUIERE_EVALUACION: { etiqueta: "Requiere evaluación médica", cls: "bg-amber-400 text-amber-950" },
  NO_APTO: { etiqueta: "No apto", cls: "bg-red-600 text-white" },
};

function BadgeVeredicto({ veredicto, compacto = false }: { veredicto: Veredicto; compacto?: boolean }) {
  const e = ESTILO_VEREDICTO[veredicto];
  return (
    <span className={`inline-block rounded-full font-medium ${e.cls} ${compacto ? "text-[10px] px-2 py-0.5" : "text-sm px-4 py-1.5"}`}>
      {compacto ? e.etiqueta.split(" ")[0] + (veredicto === "NO_APTO" ? " apto" : "") : e.etiqueta}
    </span>
  );
}

const ESTILO_NIVEL: Record<Nivel, { icono: string; cls: string; titulo: string }> = {
  contraindicacion: { icono: "✕", cls: "border-red-200 bg-red-50 text-red-900", titulo: "Contraindicaciones" },
  precaucion: { icono: "!", cls: "border-amber-200 bg-amber-50 text-amber-900", titulo: "Precauciones" },
  info: { icono: "·", cls: "border-olive-200 bg-olive-50 text-olive-900", titulo: "Observaciones" },
};

function ListaHallazgos({ nivel, hallazgos }: { nivel: Nivel; hallazgos: Hallazgo[] }) {
  if (hallazgos.length === 0) return null;
  const e = ESTILO_NIVEL[nivel];
  return (
    <div>
      <h4 className="eyebrow text-olive-600 mb-2">{e.titulo}</h4>
      <ul className="space-y-2">
        {hallazgos.map((h) => (
          <li key={h.codigo} className={`border rounded-lg px-3 py-2.5 text-sm ${e.cls}`}>
            <p className="font-medium">
              <span className="inline-block w-5 font-mono">{e.icono}</span>
              {h.titulo}
            </p>
            <p className="mt-1 pl-5 text-xs leading-relaxed opacity-90">{h.detalle}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultadoPanel({
  resultado,
  onCopiar,
  copiado,
  onGuardar,
}: {
  resultado: Resultado;
  onCopiar: () => void;
  copiado: boolean;
  onGuardar: () => void;
}) {
  const por = (n: Nivel) => resultado.hallazgos.filter((h) => h.nivel === n);
  return (
    <div className="bg-cream-50 border border-olive-100 rounded-2xl p-5 md:p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="eyebrow text-olive-600 mb-2">Resultado</h3>
          <BadgeVeredicto veredicto={resultado.veredicto} />
        </div>
        {resultado.antropometria.imc !== null && (
          <div className="text-right">
            <p className="font-display text-3xl text-olive-900">{resultado.antropometria.imc}</p>
            <p className="text-xs text-olive-700/70">IMC · {resultado.antropometria.categoriaImc}</p>
          </div>
        )}
      </div>

      <p className="text-sm text-olive-900 leading-relaxed">{resultado.resumen}</p>

      {resultado.plan && (
        <div className={`rounded-xl p-4 ${resultado.veredicto === "APTO" ? "bg-olive-900 text-cream-50" : "bg-amber-50 border border-amber-200 text-amber-950"}`}>
          <p className={`eyebrow mb-2 ${resultado.veredicto === "APTO" ? "text-olive-300" : "text-amber-700"}`}>
            {resultado.veredicto === "APTO" ? "Dosis inicial sugerida" : "Plan condicionado a evaluación"}
          </p>
          <p className="font-display text-3xl mb-1">
            {resultado.plan.dosisInicialMg} mg <span className="text-base font-normal opacity-80">/ semana</span>
          </p>
          <p className="text-xs opacity-80">{resultado.plan.via}</p>
          <p className="text-xs opacity-80">
            {resultado.plan.frecuencia} · {resultado.plan.duracionInicialSemanas} semanas iniciales
          </p>
          <p className="text-xs mt-2 opacity-90">{resultado.plan.escalado} Máximo {resultado.plan.dosisMaximaMg} mg.</p>
          <ul className="mt-3 space-y-1 text-xs opacity-90 list-disc pl-4">
            {resultado.plan.notas.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      <ListaHallazgos nivel="contraindicacion" hallazgos={por("contraindicacion")} />
      <ListaHallazgos nivel="precaucion" hallazgos={por("precaucion")} />
      <ListaHallazgos nivel="info" hallazgos={por("info")} />

      {resultado.laboratorios.length > 0 && (
        <div>
          <h4 className="eyebrow text-olive-600 mb-2">Perfil metabólico</h4>
          <table className="w-full text-xs">
            <tbody>
              {resultado.laboratorios.map((l) => (
                <tr key={l.clave} className="border-t border-olive-100">
                  <td className="py-1.5 pr-2 text-olive-800">{l.nombre}</td>
                  <td className="py-1.5 pr-2 font-mono text-right whitespace-nowrap text-olive-900">
                    {l.valor} {l.unidad}
                  </td>
                  <td className="py-1.5 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        l.estado === "normal"
                          ? "bg-olive-100 text-olive-800"
                          : l.estado === "sin_rango"
                            ? "bg-cream-200 text-olive-700"
                            : "bg-amber-100 text-amber-900"
                      }`}
                      title={`Referencia: ${l.rango}${l.comentario ? " · " + l.comentario : ""}`}
                    >
                      {l.estado === "normal" ? "Normal" : l.estado === "alto" ? "Alto" : l.estado === "bajo" ? "Bajo" : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-olive-700/70">Pasa el cursor sobre el estado para ver el rango de referencia.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <button type="button" onClick={onCopiar} className="px-4 py-2 bg-olive-900 text-cream-50 rounded-full text-xs font-medium hover:bg-olive-800 transition-colors">
          {copiado ? "Copiado ✓" : "Copiar resumen"}
        </button>
        <button type="button" onClick={onGuardar} className="px-4 py-2 border border-olive-300 text-olive-800 rounded-full text-xs hover:border-olive-700 transition-colors">
          Guardar en este navegador
        </button>
      </div>
    </div>
  );
}
