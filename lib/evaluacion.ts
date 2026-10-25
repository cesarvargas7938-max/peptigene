// Motor de evaluación para tratamientos con péptidos (tirzepatida / retatrutida).
//
// Este archivo contiene TODAS las reglas clínicas del tamizaje. La idea es que
// se vaya afinando con el tiempo: cada regla produce un "Hallazgo" con un nivel
// (contraindicacion, precaucion, info) y el veredicto final se deriva de ellos.
//
// IMPORTANTE: es una herramienta de apoyo. La decisión final y la prescripción
// corresponden siempre a un profesional de la salud.

import { planEstiloVida, planEstiloVidaTexto, PATRON_ANTIHIPERTENSIVO, PATRON_DIURETICO, type PlanEstiloVida } from "./estilo-vida.ts";

export type Tratamiento = "tirzepatida" | "retatrutida";
export type Sexo = "femenino" | "masculino" | "";
export type SiNo = "si" | "no" | "";
export type Ejercicio = "no" | "ocasional" | "regular" | "";

export type Respuestas = {
  nombre: string;
  tratamiento: Tratamiento;
  edad: number | null;
  sexo: Sexo;
  pesoKg: number | null;
  estaturaCm: number | null;
  pesoIdealKg: number | null;
  embarazoLactancia: SiNo;
  suplementos: string;
  alergiasMedicamentos: SiNo;
  alergiasDetalle: string;
  pancreatitisFamiliar: SiNo;
  pancreatitisPersonal: SiNo;
  dolorAbdominalInexplicado: SiNo;
  tiroidesCmtMen2: SiNo;
  vesicula: SiNo;
  vesiculaDetalle: string;
  enfermedadGiGrave: SiNo;
  diabetesTipo1: SiNo;
  medicamentos: string;
  ejercicio: Ejercicio;
  comorbilidades: string[];
  perfilMetabolico: string;
};

export const COMORBILIDADES: { id: string; label: string; cuentaParaIndicacion: boolean }[] = [
  { id: "hipertension", label: "Hipertensión arterial", cuentaParaIndicacion: true },
  { id: "dislipidemia", label: "Dislipidemia (colesterol / triglicéridos altos)", cuentaParaIndicacion: true },
  { id: "dm2", label: "Diabetes tipo 2", cuentaParaIndicacion: true },
  { id: "prediabetes", label: "Prediabetes / resistencia a la insulina", cuentaParaIndicacion: true },
  { id: "apnea", label: "Apnea obstructiva del sueño", cuentaParaIndicacion: true },
  { id: "higado_graso", label: "Hígado graso", cuentaParaIndicacion: true },
  { id: "sop", label: "Síndrome de ovario poliquístico", cuentaParaIndicacion: true },
  { id: "cardiovascular", label: "Enfermedad cardiovascular", cuentaParaIndicacion: true },
  { id: "renal", label: "Enfermedad renal crónica", cuentaParaIndicacion: false },
  { id: "hepatica", label: "Enfermedad hepática (cirrosis, hepatitis)", cuentaParaIndicacion: false },
  { id: "retinopatia", label: "Retinopatía diabética", cuentaParaIndicacion: false },
  { id: "salud_mental", label: "Depresión o antecedente de ideación suicida", cuentaParaIndicacion: false },
  { id: "trastorno_alimentario", label: "Trastorno de la conducta alimentaria", cuentaParaIndicacion: false },
  { id: "hipotiroidismo", label: "Hipotiroidismo (en tratamiento)", cuentaParaIndicacion: false },
  { id: "gastritis", label: "Gastritis o reflujo", cuentaParaIndicacion: false },
];

export const respuestasVacias: Respuestas = {
  nombre: "",
  tratamiento: "tirzepatida",
  edad: null,
  sexo: "",
  pesoKg: null,
  estaturaCm: null,
  pesoIdealKg: null,
  embarazoLactancia: "",
  suplementos: "",
  alergiasMedicamentos: "",
  alergiasDetalle: "",
  pancreatitisFamiliar: "",
  pancreatitisPersonal: "",
  dolorAbdominalInexplicado: "",
  tiroidesCmtMen2: "",
  vesicula: "",
  vesiculaDetalle: "",
  enfermedadGiGrave: "",
  diabetesTipo1: "",
  medicamentos: "",
  ejercicio: "",
  comorbilidades: [],
  perfilMetabolico: "",
};

export type Nivel = "contraindicacion" | "precaucion" | "info";

export type Hallazgo = {
  nivel: Nivel;
  codigo: string;
  titulo: string;
  detalle: string;
};

export type Veredicto = "APTO" | "REQUIERE_EVALUACION" | "NO_APTO";

// Pérdida de peso: indicación estándar (IMC ≥ 30, o ≥ 27 con comorbilidad).
// Recomposición corporal: IMC por debajo de ese criterio; se es flexible con el
// peso y el objetivo es perder grasa conservando o ganando músculo.
export type Modalidad = "perdida_peso" | "recomposicion";

export type PlanDosis = {
  dosisInicialMg: number;
  via: string;
  frecuencia: string;
  duracionInicialSemanas: number;
  escalado: string;
  dosisMaximaMg: number;
  notas: string[];
};

export type Antropometria = {
  imc: number | null;
  categoriaImc: string;
  excesoVsIdealKg: number | null;
  pesoIdealImcMin: number | null;
  pesoIdealImcMax: number | null;
};

export type EstadoLab = "normal" | "alto" | "bajo" | "sin_rango";

export type Laboratorio = {
  clave: string;
  nombre: string;
  valor: number;
  unidad: string;
  rango: string;
  estado: EstadoLab;
  comentario?: string;
};

export type Resultado = {
  veredicto: Veredicto;
  resumen: string;
  hallazgos: Hallazgo[];
  antropometria: Antropometria;
  laboratorios: Laboratorio[];
  modalidad: Modalidad;
  plan: PlanDosis | null;
  estiloVida: PlanEstiloVida | null;
  camposFaltantes: string[];
};

// ---------------------------------------------------------------------------
// Antropometría
// ---------------------------------------------------------------------------

export function calcularImc(pesoKg: number | null, estaturaCm: number | null): number | null {
  if (!pesoKg || !estaturaCm || pesoKg <= 0 || estaturaCm <= 0) return null;
  const m = estaturaCm / 100;
  return Math.round((pesoKg / (m * m)) * 10) / 10;
}

export function categoriaImc(imc: number | null): string {
  if (imc === null) return "Sin datos";
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidad grado I";
  if (imc < 40) return "Obesidad grado II";
  return "Obesidad grado III";
}

function antropometria(r: Respuestas): Antropometria {
  const imc = calcularImc(r.pesoKg, r.estaturaCm);
  const m = r.estaturaCm ? r.estaturaCm / 100 : null;
  return {
    imc,
    categoriaImc: categoriaImc(imc),
    excesoVsIdealKg:
      r.pesoKg && r.pesoIdealKg ? Math.round((r.pesoKg - r.pesoIdealKg) * 10) / 10 : null,
    pesoIdealImcMin: m ? Math.round(18.5 * m * m * 10) / 10 : null,
    pesoIdealImcMax: m ? Math.round(24.9 * m * m * 10) / 10 : null,
  };
}

// ---------------------------------------------------------------------------
// Perfil metabólico (parser de texto libre)
// ---------------------------------------------------------------------------

type DefLab = {
  clave: string;
  nombre: string;
  alias: RegExp;
  unidad: string;
  min?: number;
  max?: number;
  rango: string;
  comentar?: (v: number, r: Respuestas) => string | undefined;
};

// Rangos de referencia generales para adultos. Pueden variar por laboratorio;
// afinar aquí si el laboratorio de referencia usa otros valores.
const LABS: DefLab[] = [
  {
    clave: "glucosa",
    nombre: "Glucosa en ayunas",
    alias: /\b(glucosa|glicemia|glucemia|glucose)\b/i,
    unidad: "mg/dL",
    min: 70,
    max: 99,
    rango: "70–99",
    comentar: (v) =>
      v >= 126 ? "Rango de diabetes (≥126)" : v >= 100 ? "Rango de prediabetes (100–125)" : undefined,
  },
  {
    clave: "hba1c",
    nombre: "Hemoglobina glicosilada (HbA1c)",
    alias: /\b(hba1c|a1c|hemoglobina glicosilada|hemoglobina glucosilada|glicosilada)\b/i,
    unidad: "%",
    max: 5.6,
    rango: "< 5.7",
    comentar: (v) =>
      v >= 6.5 ? "Rango de diabetes (≥6.5)" : v >= 5.7 ? "Rango de prediabetes (5.7–6.4)" : undefined,
  },
  {
    clave: "insulina",
    nombre: "Insulina en ayunas",
    alias: /\b(insulina basal|insulina en ayunas|insulina|insulin)\b/i,
    unidad: "µU/mL",
    min: 2,
    max: 25,
    rango: "2–25",
    comentar: (v) => (v > 25 ? "Hiperinsulinemia: sugiere resistencia a la insulina" : undefined),
  },
  {
    clave: "colesterol_total",
    nombre: "Colesterol total",
    alias: /\b(colesterol total|colesterol|cholesterol)\b/i,
    unidad: "mg/dL",
    max: 199,
    rango: "< 200",
  },
  {
    clave: "ldl",
    nombre: "Colesterol LDL",
    alias: /\b(ldl)\b/i,
    unidad: "mg/dL",
    max: 129,
    rango: "< 130 (óptimo < 100)",
  },
  {
    clave: "hdl",
    nombre: "Colesterol HDL",
    alias: /\b(hdl)\b/i,
    unidad: "mg/dL",
    min: 40,
    rango: "> 40 (mujeres > 50)",
    comentar: (v, r) => (r.sexo === "femenino" && v < 50 ? "Bajo para mujer (< 50)" : undefined),
  },
  {
    clave: "trigliceridos",
    nombre: "Triglicéridos",
    alias: /\b(trigliceridos|triglicéridos|tg|trigl)\b/i,
    unidad: "mg/dL",
    max: 149,
    rango: "< 150",
    comentar: (v) =>
      v >= 500
        ? "Hipertrigliceridemia severa: factor de riesgo de pancreatitis"
        : v >= 200
          ? "Hipertrigliceridemia (200–499)"
          : undefined,
  },
  {
    clave: "tsh",
    nombre: "TSH",
    alias: /\b(tsh|tirotropina)\b/i,
    unidad: "µUI/mL",
    min: 0.4,
    max: 4.0,
    rango: "0.4–4.0",
  },
  {
    clave: "calcitonina",
    nombre: "Calcitonina",
    alias: /\b(calcitonina|calcitonin)\b/i,
    unidad: "pg/mL",
    max: 10,
    rango: "< 10",
    comentar: (v) => (v > 10 ? "Elevada: descartar patología de células C tiroideas" : undefined),
  },
  {
    clave: "creatinina",
    nombre: "Creatinina",
    alias: /\b(creatinina|creatinine|crea)\b/i,
    unidad: "mg/dL",
    min: 0.6,
    max: 1.2,
    rango: "0.6–1.2",
  },
  {
    clave: "tfg",
    nombre: "Tasa de filtración glomerular (TFG)",
    alias: /\b(tfg|tfge|egfr|gfr|filtracion glomerular|filtración glomerular)\b/i,
    unidad: "mL/min/1.73m²",
    min: 60,
    rango: "≥ 60",
    comentar: (v) =>
      v < 30 ? "Enfermedad renal avanzada (< 30)" : v < 60 ? "Función renal disminuida (30–59)" : undefined,
  },
  {
    clave: "alt",
    nombre: "ALT (TGP)",
    alias: /\b(alt|tgp|alanina aminotransferasa)\b/i,
    unidad: "U/L",
    max: 40,
    rango: "< 40",
    comentar: (v) => (v > 120 ? "Más de 3 veces el límite superior" : undefined),
  },
  {
    clave: "ast",
    nombre: "AST (TGO)",
    alias: /\b(ast|tgo|aspartato aminotransferasa)\b/i,
    unidad: "U/L",
    max: 40,
    rango: "< 40",
    comentar: (v) => (v > 120 ? "Más de 3 veces el límite superior" : undefined),
  },
  {
    clave: "lipasa",
    nombre: "Lipasa",
    alias: /\b(lipasa|lipase)\b/i,
    unidad: "U/L",
    min: 13,
    max: 60,
    rango: "13–60",
    comentar: (v) => (v > 180 ? "Más de 3 veces el límite superior: sospecha de pancreatitis" : undefined),
  },
  {
    clave: "amilasa",
    nombre: "Amilasa",
    alias: /\b(amilasa|amylase)\b/i,
    unidad: "U/L",
    min: 30,
    max: 110,
    rango: "30–110",
    comentar: (v) => (v > 330 ? "Más de 3 veces el límite superior: sospecha de pancreatitis" : undefined),
  },
  {
    clave: "acido_urico",
    nombre: "Ácido úrico",
    alias: /\b(acido urico|ácido úrico|urato|uric acid)\b/i,
    unidad: "mg/dL",
    min: 2.5,
    max: 7,
    rango: "2.5–7.0",
  },
  {
    clave: "vitamina_d",
    nombre: "Vitamina D (25-OH)",
    alias: /\b(vitamina d|vit d|vitd|25 hidroxi)\b/i,
    unidad: "ng/mL",
    min: 30,
    rango: "≥ 30",
  },
  {
    clave: "b12",
    nombre: "Vitamina B12",
    alias: /\b(b12|cobalamina)\b/i,
    unidad: "pg/mL",
    min: 200,
    rango: "≥ 200",
  },
  {
    clave: "hemoglobina",
    nombre: "Hemoglobina",
    alias: /\b(hemoglobina|hb|hgb)\b/i,
    unidad: "g/dL",
    min: 12,
    max: 17.5,
    rango: "12–17.5",
  },
  {
    clave: "ferritina",
    nombre: "Ferritina",
    alias: /\b(ferritina|ferritin)\b/i,
    unidad: "ng/mL",
    min: 15,
    max: 300,
    rango: "15–300",
  },
];

const NUMERO = /(-?\d+(?:[.,]\d+)?)/;

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Extrae valores de laboratorio de texto libre. Acepta formatos como:
 *   "Glucosa 110 mg/dL", "HbA1c: 6.1%", "TG = 220", "LDL 140 mg/dl"
 * Una línea o un fragmento separado por coma/punto y coma por cada analito.
 */
export function parsearPerfil(texto: string, r: Respuestas): Laboratorio[] {
  if (!texto.trim()) return [];
  const fragmentos = texto
    .split(/[\n;,|]+/)
    .map((f) => f.trim())
    .filter(Boolean);

  const encontrados = new Map<string, Laboratorio>();

  for (const frag of fragmentos) {
    // "25-OH" forma parte del nombre de la vitamina D, no es un valor.
    const fragNorm = normalizar(frag).replace(/25\s?-?\s?oh/g, "vitd");
    // Elegimos la definición más específica que aparezca en el fragmento
    // (p. ej. "Colesterol HDL 38" debe leerse como HDL, no como colesterol total).
    let mejor: { def: DefLab; idx: number; prioridad: number } | null = null;
    for (const def of LABS) {
      const m = def.alias.exec(fragNorm);
      if (!m) continue;
      const prioridad = def.clave === "hdl" || def.clave === "ldl" ? 0 : def.clave === "colesterol_total" ? 2 : 1;
      if (mejor === null || prioridad < mejor.prioridad || (prioridad === mejor.prioridad && m.index < mejor.idx)) {
        mejor = { def, idx: m.index + m[0].length, prioridad };
      }
    }
    if (!mejor) continue;
    const { def, idx } = mejor;
    const despues = fragNorm.slice(idx);
    const num = NUMERO.exec(despues);
    if (!num) continue;
    const valor = parseFloat(num[1].replace(",", "."));
    if (Number.isNaN(valor)) continue;

    let estado: EstadoLab = "normal";
    if (def.max !== undefined && valor > def.max) estado = "alto";
    else if (def.min !== undefined && valor < def.min) estado = "bajo";
    if (def.max === undefined && def.min === undefined) estado = "sin_rango";

    encontrados.set(def.clave, {
      clave: def.clave,
      nombre: def.nombre,
      valor,
      unidad: def.unidad,
      rango: def.rango,
      estado,
      comentario: def.comentar?.(valor, r),
    });
  }

  const labs = Array.from(encontrados.values());

  // HOMA-IR derivado si hay glucosa e insulina.
  const glu = encontrados.get("glucosa");
  const ins = encontrados.get("insulina");
  if (glu && ins) {
    const homa = Math.round(((glu.valor * ins.valor) / 405) * 100) / 100;
    labs.push({
      clave: "homa_ir",
      nombre: "HOMA-IR (calculado)",
      valor: homa,
      unidad: "",
      rango: "< 2.5",
      estado: homa >= 2.5 ? "alto" : "normal",
      comentario: homa >= 2.5 ? "Resistencia a la insulina" : undefined,
    });
  }

  // TFG estimada (CKD-EPI 2021) si hay creatinina, edad y sexo y no vino TFG.
  const crea = encontrados.get("creatinina");
  if (crea && !encontrados.get("tfg") && r.edad && r.sexo) {
    const tfg = tfgCkdEpi2021(crea.valor, r.edad, r.sexo);
    labs.push({
      clave: "tfg",
      nombre: "TFG estimada (CKD-EPI 2021)",
      valor: tfg,
      unidad: "mL/min/1.73m²",
      rango: "≥ 60",
      estado: tfg < 60 ? "bajo" : "normal",
      comentario:
        tfg < 30 ? "Enfermedad renal avanzada (< 30)" : tfg < 60 ? "Función renal disminuida (30–59)" : undefined,
    });
  }

  return labs;
}

export function tfgCkdEpi2021(creatinina: number, edad: number, sexo: Sexo): number {
  const mujer = sexo === "femenino";
  const k = mujer ? 0.7 : 0.9;
  const a = mujer ? -0.241 : -0.302;
  const ratio = creatinina / k;
  const tfg =
    142 *
    Math.pow(Math.min(ratio, 1), a) *
    Math.pow(Math.max(ratio, 1), -1.2) *
    Math.pow(0.9938, edad) *
    (mujer ? 1.012 : 1);
  return Math.round(tfg);
}

// ---------------------------------------------------------------------------
// Medicamentos y alergias
// ---------------------------------------------------------------------------

type ReglaMed = {
  patron: RegExp;
  nivel: Nivel;
  codigo: string;
  titulo: string;
  detalle: string;
};

// Afinar aquí la lista de fármacos relevantes.
const REGLAS_MEDICAMENTOS: ReglaMed[] = [
  {
    patron: /\b(insulina|insulin|lantus|glargina|degludec|tresiba|novorapid|humalog|aspart|lispro|nph|toujeo|basaglar)\b/,
    nivel: "precaucion",
    codigo: "MED_INSULINA",
    titulo: "Usa insulina",
    detalle:
      "Riesgo de hipoglucemia al combinar con un agonista GLP-1/GIP. Requiere ajuste de dosis de insulina y monitoreo de glucemia por su médico tratante.",
  },
  {
    patron: /\b(glibenclamida|gliburida|glimepirida|gliclazida|glipizida|sulfonilurea|repaglinida|nateglinida)\b/,
    nivel: "precaucion",
    codigo: "MED_SULFONILUREA",
    titulo: "Usa sulfonilurea o secretagogo",
    detalle: "Aumenta el riesgo de hipoglucemia. Su médico debe considerar reducir la dosis al iniciar.",
  },
  {
    patron: /\b(semaglutida|ozempic|wegovy|rybelsus|liraglutida|saxenda|victoza|dulaglutida|trulicity|exenatida|tirzepatida|mounjaro|zepbound|retatrutida)\b/,
    nivel: "precaucion",
    codigo: "MED_GLP1_ACTUAL",
    titulo: "Ya usa un agonista GLP-1 / GIP",
    detalle:
      "No deben combinarse dos agonistas de incretinas. Se requiere plan de transición y periodo de lavado definido por el médico.",
  },
  {
    patron: /\b(warfarina|coumadin|acenocumarol|sintrom)\b/,
    nivel: "precaucion",
    codigo: "MED_ANTICOAGULANTE",
    titulo: "Anticoagulante oral (warfarina)",
    detalle: "El retraso del vaciamiento gástrico puede alterar el INR. Requiere control más frecuente.",
  },
  {
    patron: /\b(anticonceptivo|anticonceptivos|pastilla anticonceptiva|pildora|píldora|yasmin|diane|belara|microgynon|levonorgestrel|etinilestradiol|drospirenona)\b/,
    nivel: "precaucion",
    codigo: "MED_ANTICONCEPTIVO_ORAL",
    titulo: "Anticonceptivo oral",
    detalle:
      "La tirzepatida reduce la absorción de anticonceptivos orales. Se recomienda método de barrera durante las primeras 4 semanas y 4 semanas después de cada aumento de dosis, o cambiar a método no oral.",
  },
  {
    patron: /\b(digoxina|lanoxin)\b/,
    nivel: "precaucion",
    codigo: "MED_ESTRECHO_MARGEN",
    titulo: "Fármaco de estrecho margen terapéutico",
    detalle: "El retraso del vaciamiento gástrico puede alterar sus niveles. Requiere monitoreo.",
  },
  {
    patron: PATRON_DIURETICO,
    nivel: "info",
    codigo: "MED_DIURETICO",
    titulo: "Usa diurético",
    detalle:
      "Compatible, pero con náuseas o vómito del tratamiento sube el riesgo de deshidratación y lesión renal. Hidratación estricta; conocer creatinina basal.",
  },
  {
    patron: PATRON_ANTIHIPERTENSIVO,
    nivel: "info",
    codigo: "MED_ANTIHIPERTENSIVO",
    titulo: "Usa antihipertensivo: hipertensión tratada",
    detalle:
      "Cuenta como comorbilidad asociada al peso. La presión suele bajar con la pérdida de peso: controlarla semanalmente y ajustar el antihipertensivo con el médico si hay hipotensión o mareo.",
  },
  {
    patron: /\b(omeprazol|esomeprazol|pantoprazol|lansoprazol|rabeprazol|ranitidina|famotidina|sucralfato|antiacido|antiácido)\b/,
    nivel: "info",
    codigo: "MED_GASTRICO",
    titulo: "Usa protector gástrico: gastritis o reflujo",
    detalle:
      "No contraindica. El retraso del vaciamiento gástrico puede aumentar reflujo y dispepsia: mantener el protector las primeras semanas, comidas pequeñas y no acostarse hasta 2–3 h después de comer.",
  },
  {
    patron: /\b(levotiroxina|eutirox|synthroid|levotiroxina sodica|levotiroxina sódica)\b/,
    nivel: "info",
    codigo: "MED_LEVOTIROXINA",
    titulo: "Usa levotiroxina",
    detalle:
      "Hipotiroidismo tratado no contraindica. Puede cambiar la absorción; se sugiere control de TSH a las 6–8 semanas de iniciar.",
  },
  {
    patron: /\b(metformina|glucophage|glafornil)\b/,
    nivel: "info",
    codigo: "MED_METFORMINA",
    titulo: "Usa metformina",
    detalle: "Compatible. Se puede mantener; vigilar síntomas gastrointestinales sumados.",
  },
  {
    patron: /\b(prednisona|prednisolona|dexametasona|betametasona|corticoide|corticoides|cortisona)\b/,
    nivel: "precaucion",
    codigo: "MED_CORTICOIDE",
    titulo: "Usa corticoides sistémicos",
    detalle: "Los corticoides favorecen hiperglucemia y ganancia de peso. Evaluar causa, dosis y duración.",
  },
  {
    patron: /\b(orlistat|xenical|fentermina|phentermine|naltrexona|bupropion|bupropión|contrave|topiramato|sibutramina)\b/,
    nivel: "precaucion",
    codigo: "MED_OTRO_ANTIOBESIDAD",
    titulo: "Usa otro medicamento para bajar de peso",
    detalle: "Evaluar suspensión o combinación con criterio médico antes de iniciar.",
  },
  {
    patron: /\b(fluoxetina|sertralina|escitalopram|paroxetina|venlafaxina|duloxetina|amitriptilina|mirtazapina|quetiapina|olanzapina|risperidona|litio|antidepresivo|antipsicotico|antipsicótico)\b/,
    nivel: "info",
    codigo: "MED_PSIQUIATRICO",
    titulo: "Medicación psiquiátrica",
    detalle:
      "No contraindica. Se recomienda vigilar estado de ánimo durante el tratamiento e informar al psiquiatra tratante.",
  },
];

const PATRON_ALERGIA_GLP1 =
  /\b(semaglutida|ozempic|wegovy|rybelsus|liraglutida|saxenda|victoza|dulaglutida|trulicity|exenatida|tirzepatida|mounjaro|zepbound|retatrutida|glp-?1|incretina|peptido|péptido)\b/;

function evaluarMedicamentos(texto: string): Hallazgo[] {
  const t = normalizar(texto);
  if (!t.trim() || /^(no|ninguno|ninguna|nada|n\/a)\.?$/.test(t.trim())) return [];
  const out: Hallazgo[] = [];
  for (const regla of REGLAS_MEDICAMENTOS) {
    if (regla.patron.test(t)) {
      out.push({ nivel: regla.nivel, codigo: regla.codigo, titulo: regla.titulo, detalle: regla.detalle });
    }
  }
  if (out.length === 0) {
    out.push({
      nivel: "info",
      codigo: "MED_REVISAR",
      titulo: "Medicamentos reportados",
      detalle: `Revisar manualmente interacciones: "${texto.trim()}".`,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Reglas principales
// ---------------------------------------------------------------------------

function camposFaltantes(r: Respuestas): string[] {
  const faltan: string[] = [];
  if (!r.edad) faltan.push("edad");
  if (!r.pesoKg) faltan.push("peso");
  if (!r.estaturaCm) faltan.push("estatura");
  if (!r.sexo) faltan.push("sexo");
  if (r.sexo === "femenino" && !r.embarazoLactancia) faltan.push("embarazo o lactancia");
  if (!r.tiroidesCmtMen2) faltan.push("antecedente de cáncer medular de tiroides / MEN2");
  if (!r.pancreatitisPersonal) faltan.push("antecedente personal de pancreatitis");
  if (!r.pancreatitisFamiliar) faltan.push("antecedente familiar de pancreatitis");
  if (!r.dolorAbdominalInexplicado) faltan.push("dolor abdominal inexplicado");
  if (!r.vesicula) faltan.push("problemas de vesícula");
  if (!r.enfermedadGiGrave) faltan.push("enfermedad gastrointestinal grave");
  if (!r.diabetesTipo1) faltan.push("diabetes tipo 1");
  if (!r.alergiasMedicamentos) faltan.push("alergias a medicamentos");
  return faltan;
}

export function evaluar(r: Respuestas): Resultado {
  const h: Hallazgo[] = [];
  const antro = antropometria(r);
  const labs = parsearPerfil(r.perfilMetabolico, r);
  const faltantes = camposFaltantes(r);

  // --- Contraindicaciones absolutas -------------------------------------
  if (r.tiroidesCmtMen2 === "si") {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_CMT_MEN2",
      titulo: "Antecedente personal o familiar de cáncer medular de tiroides / MEN2",
      detalle:
        "Contraindicación absoluta por el riesgo teórico de tumores de células C tiroideas con agonistas GLP-1.",
    });
  }
  if (r.edad !== null && r.edad < 18) {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_MENOR_EDAD",
      titulo: "Menor de 18 años",
      detalle: "No existen estudios suficientes de seguridad en menores de edad.",
    });
  }
  if (r.embarazoLactancia === "si") {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_EMBARAZO",
      titulo: "Embarazo, lactancia o búsqueda de embarazo",
      detalle: "No se recomienda durante el embarazo ni la lactancia. Suspender al menos 2 meses antes de buscar embarazo.",
    });
  }
  if (r.pancreatitisPersonal === "si") {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_PANCREATITIS",
      titulo: "Antecedente personal de pancreatitis",
      detalle: "Los agonistas GLP-1 se asocian a pancreatitis aguda. No iniciar sin valoración especializada.",
    });
  }
  if (r.enfermedadGiGrave === "si") {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_GI_GRAVE",
      titulo: "Enfermedad gastrointestinal grave (gastroparesia, etc.)",
      detalle: "El retraso del vaciamiento gástrico puede empeorar el cuadro.",
    });
  }
  if (r.alergiasMedicamentos === "si" && PATRON_ALERGIA_GLP1.test(normalizar(r.alergiasDetalle))) {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_HIPERSENSIBILIDAD",
      titulo: "Hipersensibilidad a agonistas GLP-1 o sus componentes",
      detalle: `Alergia reportada: "${r.alergiasDetalle.trim()}".`,
    });
  }
  const trastornoAlimentario = r.comorbilidades.includes("trastorno_alimentario");
  if (trastornoAlimentario) {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_TCA",
      titulo: "Trastorno de la conducta alimentaria",
      detalle: "Requiere manejo por salud mental antes de considerar farmacoterapia para pérdida de peso.",
    });
  }
  if (antro.imc !== null && antro.imc < 20) {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_IMC_BAJO",
      titulo: `IMC ${antro.imc} (${antro.categoriaImc}): demasiado bajo para cualquier modalidad`,
      detalle: "Por debajo de IMC 20 no hay grasa que perder con seguridad; el riesgo de pérdida muscular y de trastorno alimentario es alto. No usar.",
    });
  }

  // Laboratorios que contraindican
  const lab = (clave: string) => labs.find((l) => l.clave === clave);
  const lipasa = lab("lipasa");
  const amilasa = lab("amilasa");
  if ((lipasa && lipasa.valor > 180) || (amilasa && amilasa.valor > 330)) {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_ENZIMAS_PANCREATICAS",
      titulo: "Enzimas pancreáticas > 3 veces el límite superior",
      detalle: "Sospecha de pancreatitis activa. Descartar antes de considerar cualquier agonista GLP-1.",
    });
  }
  const calcitonina = lab("calcitonina");
  if (calcitonina && calcitonina.valor > 10) {
    h.push({
      nivel: "contraindicacion",
      codigo: "CI_CALCITONINA",
      titulo: "Calcitonina elevada",
      detalle: "Debe descartarse patología de células C tiroideas con endocrinología antes de iniciar.",
    });
  }

  // --- Precauciones (requieren evaluación médica) ----------------------
  if (r.diabetesTipo1 === "si") {
    h.push({
      nivel: "precaucion",
      codigo: "PR_DM1",
      titulo: "Diabetes tipo 1",
      detalle: "No es un tratamiento adecuado para diabetes tipo 1. Solo bajo criterio de endocrinología.",
    });
  }
  if (r.pancreatitisFamiliar === "si") {
    h.push({
      nivel: "precaucion",
      codigo: "PR_PANCREATITIS_FAMILIAR",
      titulo: "Antecedente familiar de pancreatitis",
      detalle: "Evaluar causa (hereditaria, hipertrigliceridemia, litiasis) y medir lipasa basal antes de iniciar.",
    });
  }
  if (r.dolorAbdominalInexplicado === "si") {
    h.push({
      nivel: "precaucion",
      codigo: "PR_DOLOR_ABDOMINAL",
      titulo: "Dolor abdominal intenso e inexplicado previo",
      detalle: "Descartar pancreatitis o patología biliar (lipasa, ecografía abdominal) antes de iniciar.",
    });
  }
  if (r.vesicula === "si") {
    const det = normalizar(r.vesiculaDetalle);
    const operado = /\b(colecistectomia|operad[oa]|extirpad[oa]|retirad[oa]|sin vesicula|ya no tengo)\b/.test(det);
    h.push({
      nivel: operado ? "info" : "precaucion",
      codigo: operado ? "INFO_COLECISTECTOMIA" : "PR_VESICULA",
      titulo: operado ? "Vesícula extirpada" : "Antecedente de cálculos o problemas de vesícula",
      detalle: operado
        ? "Colecistectomía previa: no contraindica. Vigilar síntomas biliares."
        : "La pérdida rápida de peso y los agonistas GLP-1 aumentan el riesgo de colelitiasis. Se sugiere ecografía hepatobiliar basal." +
          (r.vesiculaDetalle.trim() ? ` Reportado: "${r.vesiculaDetalle.trim()}".` : ""),
    });
  }
  if (r.alergiasMedicamentos === "si" && !PATRON_ALERGIA_GLP1.test(normalizar(r.alergiasDetalle))) {
    h.push({
      nivel: "info",
      codigo: "INFO_ALERGIAS",
      titulo: "Alergias a otros medicamentos",
      detalle: `Reportado: "${r.alergiasDetalle.trim() || "sin detalle"}". No contraindica; registrar en historia.`,
    });
  }
  if (r.edad !== null && r.edad >= 75) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_EDAD_AVANZADA",
      titulo: "Edad ≥ 75 años",
      detalle: "Experiencia clínica limitada. Mayor riesgo de sarcopenia y deshidratación; evaluar fragilidad.",
    });
  }
  if (r.sexo === "femenino" && r.edad !== null && r.edad >= 18 && r.edad <= 50 && r.embarazoLactancia === "no") {
    h.push({
      nivel: "info",
      codigo: "INFO_ANTICONCEPCION",
      titulo: "Mujer en edad fértil",
      detalle: "Confirmar método anticonceptivo eficaz durante el tratamiento.",
    });
  }

  // Comorbilidades que piden precaución
  const com = new Set(r.comorbilidades);
  if (com.has("renal")) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_RENAL",
      titulo: "Enfermedad renal crónica",
      detalle: "Riesgo de deshidratación y lesión renal aguda por vómito/diarrea. Conocer TFG basal y vigilar hidratación.",
    });
  }
  if (com.has("hepatica")) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_HEPATICA",
      titulo: "Enfermedad hepática",
      detalle: "Experiencia limitada en hepatopatía avanzada. Valorar con transaminasas y función hepática.",
    });
  }
  if (com.has("retinopatia")) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_RETINOPATIA",
      titulo: "Retinopatía diabética",
      detalle: "La mejoría rápida de la glucemia puede empeorar transitoriamente la retinopatía. Control oftalmológico.",
    });
  }
  if (com.has("gastritis")) {
    h.push({
      nivel: "info",
      codigo: "INFO_GASTRITIS",
      titulo: "Gastritis o reflujo",
      detalle:
        "No es contraindicación (la contraindicación es gastroparesia o enfermedad GI grave). Debe estar controlada antes de iniciar: si hay síntomas activos, tratar primero (y descartar H. pylori). Con el tratamiento, comidas pequeñas, evitar fritos, picante, café en exceso y alcohol, y no acostarse hasta 2–3 h después de comer.",
    });
  }
  if (com.has("hipotiroidismo") && !/levotiroxina|eutirox|synthroid/.test(normalizar(r.medicamentos))) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_HIPOTIROIDISMO_SIN_TRATAR",
      titulo: "Hipotiroidismo sin tratamiento reportado",
      detalle: "Compensar la función tiroidea antes de iniciar: pedir TSH y valorar levotiroxina.",
    });
  }
  if (com.has("salud_mental")) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_SALUD_MENTAL",
      titulo: "Depresión o antecedente de ideación suicida",
      detalle: "Vigilar cambios de ánimo o ideación durante el tratamiento. Coordinar con salud mental.",
    });
  }

  // Laboratorios con precaución
  const tfg = lab("tfg");
  if (tfg && tfg.valor < 30) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_TFG_BAJA",
      titulo: `TFG ${tfg.valor} mL/min: función renal muy disminuida`,
      detalle: "Uso solo con valoración por nefrología y vigilancia estrecha de hidratación.",
    });
  } else if (tfg && tfg.valor < 60) {
    h.push({
      nivel: "info",
      codigo: "INFO_TFG",
      titulo: `TFG ${tfg.valor} mL/min: función renal disminuida`,
      detalle: "No requiere ajuste de dosis, pero sí vigilancia de hidratación ante náuseas o vómito.",
    });
  }
  const alt = lab("alt");
  const ast = lab("ast");
  if ((alt && alt.valor > 120) || (ast && ast.valor > 120)) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_TRANSAMINASAS",
      titulo: "Transaminasas > 3 veces el límite superior",
      detalle: "Estudiar causa de la hepatopatía antes de iniciar.",
    });
  }
  const tg = lab("trigliceridos");
  if (tg && tg.valor >= 500) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_TG_SEVEROS",
      titulo: `Triglicéridos ${tg.valor} mg/dL: hipertrigliceridemia severa`,
      detalle: "Factor de riesgo independiente de pancreatitis. Tratar primero y medir lipasa basal.",
    });
  }
  const tsh = lab("tsh");
  if (tsh && (tsh.estado === "alto" || tsh.estado === "bajo")) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_TSH",
      titulo: `TSH ${tsh.valor}: función tiroidea alterada`,
      detalle: "Compensar la función tiroidea antes de iniciar; el hipotiroidismo no tratado dificulta la pérdida de peso.",
    });
  }
  const hba1c = lab("hba1c");
  const glucosa = lab("glucosa");
  const diabetesPorLab = (hba1c && hba1c.valor >= 6.5) || (glucosa && glucosa.valor >= 126);
  const prediabetesPorLab =
    !diabetesPorLab && ((hba1c && hba1c.valor >= 5.7) || (glucosa && glucosa.valor >= 100));
  if (diabetesPorLab && !com.has("dm2") && r.diabetesTipo1 !== "si") {
    h.push({
      nivel: "precaucion",
      codigo: "PR_DIABETES_NO_DIAGNOSTICADA",
      titulo: "Laboratorios en rango de diabetes sin diagnóstico previo",
      detalle: "Confirmar diagnóstico y definir manejo integral de la diabetes antes de iniciar.",
    });
  }
  if (prediabetesPorLab) {
    h.push({
      nivel: "info",
      codigo: "INFO_PREDIABETES",
      titulo: "Laboratorios en rango de prediabetes",
      detalle: "Buen candidato desde el punto de vista metabólico: el tratamiento mejora la glucemia y la resistencia a la insulina.",
    });
  }
  const homa = lab("homa_ir");
  if (homa && homa.estado === "alto") {
    h.push({
      nivel: "info",
      codigo: "INFO_RESISTENCIA_INSULINA",
      titulo: `HOMA-IR ${homa.valor}: resistencia a la insulina`,
      detalle: "Perfil que suele responder bien a agonistas GIP/GLP-1.",
    });
  }
  const ldl = lab("ldl");
  const ct = lab("colesterol_total");
  const hdl = lab("hdl");
  const dislipidemiaPorLab =
    (ldl && ldl.estado === "alto") ||
    (ct && ct.estado === "alto") ||
    (tg && tg.valor >= 150) ||
    (hdl && (hdl.estado === "bajo" || hdl.comentario));
  if (dislipidemiaPorLab) {
    h.push({
      nivel: "info",
      codigo: "INFO_DISLIPIDEMIA",
      titulo: "Perfil lipídico alterado",
      detalle: "Cuenta como comorbilidad asociada al peso. Suele mejorar con la pérdida de peso.",
    });
  }

  // --- Indicación por IMC + comorbilidades ------------------------------
  const hipertensionPorMed = !com.has("hipertension") && PATRON_ANTIHIPERTENSIVO.test(normalizar(r.medicamentos));
  const comorbilidadesIndicacion = COMORBILIDADES.filter(
    (c) => c.cuentaParaIndicacion && com.has(c.id),
  ).map((c) => c.label);
  if (hipertensionPorMed) comorbilidadesIndicacion.push("Hipertensión (por medicación)");
  if (prediabetesPorLab && !com.has("prediabetes")) comorbilidadesIndicacion.push("Prediabetes (por laboratorio)");
  if (diabetesPorLab && !com.has("dm2")) comorbilidadesIndicacion.push("Diabetes (por laboratorio)");
  if (dislipidemiaPorLab && !com.has("dislipidemia")) comorbilidadesIndicacion.push("Dislipidemia (por laboratorio)");
  if (homa && homa.estado === "alto" && !com.has("prediabetes")) comorbilidadesIndicacion.push("Resistencia a la insulina (HOMA-IR)");

  // Modalidad: pérdida de peso cuando cumple la indicación estándar; de lo
  // contrario, recomposición corporal (flexible con el peso).
  const cumpleIndicacion =
    antro.imc !== null && (antro.imc >= 30 || (antro.imc >= 27 && comorbilidadesIndicacion.length > 0));
  const modalidad: Modalidad = antro.imc === null || cumpleIndicacion ? "perdida_peso" : "recomposicion";

  if (cumpleIndicacion && antro.imc !== null) {
    h.push({
      nivel: "info",
      codigo: "INFO_CUMPLE_INDICACION",
      titulo: `IMC ${antro.imc} (${antro.categoriaImc}): cumple criterio de pérdida de peso`,
      detalle:
        comorbilidadesIndicacion.length > 0
          ? `Comorbilidades asociadas: ${comorbilidadesIndicacion.join(", ")}.`
          : "Obesidad por IMC, sin comorbilidades reportadas.",
    });
  } else if (modalidad === "recomposicion" && antro.imc !== null) {
    h.push({
      nivel: "info",
      codigo: "INFO_RECOMPOSICION",
      titulo: `IMC ${antro.imc} (${antro.categoriaImc}): modalidad recomposición corporal`,
      detalle:
        "No cumple el criterio estándar de pérdida de peso (IMC ≥ 30, o ≥ 27 con comorbilidad), así que se maneja como recomposición: perder grasa conservando músculo. Dosis conservadora, déficit calórico suave, proteína alta y entrenamiento de fuerza obligatorio. Uso fuera de indicación: debe quedar documentado con consentimiento informado.",
    });
  }

  // Peso ideal
  if (r.pesoIdealKg && antro.pesoIdealImcMin !== null && r.pesoIdealKg < antro.pesoIdealImcMin) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_META_BAJO_PESO",
      titulo: `Meta de ${r.pesoIdealKg} kg implica bajo peso`,
      detalle: `Para su estatura, un peso saludable está entre ${antro.pesoIdealImcMin} y ${antro.pesoIdealImcMax} kg. Replantear la meta y descartar distorsión de la imagen corporal.`,
    });
  } else if (antro.excesoVsIdealKg !== null && r.pesoKg) {
    const pct = Math.round((antro.excesoVsIdealKg / r.pesoKg) * 100);
    h.push({
      nivel: "info",
      codigo: "INFO_META",
      titulo: `Meta: perder ${antro.excesoVsIdealKg} kg (${pct}% del peso actual)`,
      detalle:
        pct > 25
          ? "Meta ambiciosa. Con tirzepatida la pérdida promedio es del 15–21% a 72 semanas; con retatrutida ~24% a 48 semanas (fase 2). Definir metas intermedias."
          : "Meta alcanzable dentro del rango de respuesta esperado con tratamiento y cambios de estilo de vida.",
    });
  }

  // Medicamentos y suplementos
  h.push(...evaluarMedicamentos(r.medicamentos));
  const sup = normalizar(r.suplementos).trim();
  if (sup && !/^(no|ninguno|ninguna|nada)\.?$/.test(sup)) {
    h.push({
      nivel: "info",
      codigo: "INFO_SUPLEMENTOS",
      titulo: "Suplementos reportados",
      detalle: `"${r.suplementos.trim()}". Sin interacciones relevantes conocidas. Se recomienda mantener proteína ≥ 1.2 g/kg/día y multivitamínico durante la pérdida de peso.`,
    });
  }

  // Ejercicio
  if (r.ejercicio === "no") {
    h.push({
      nivel: "info",
      codigo: "INFO_SEDENTARISMO",
      titulo: "No realiza ejercicio",
      detalle: "Incluir entrenamiento de fuerza 2–3 veces/semana para preservar masa muscular durante la pérdida de peso.",
    });
  } else if (r.ejercicio === "ocasional") {
    h.push({
      nivel: "info",
      codigo: "INFO_EJERCICIO_OCASIONAL",
      titulo: "Ejercicio ocasional",
      detalle: "Aumentar a ≥ 150 min/semana de actividad moderada más entrenamiento de fuerza.",
    });
  }

  // Datos incompletos
  if (faltantes.length > 0) {
    h.push({
      nivel: "precaucion",
      codigo: "PR_DATOS_INCOMPLETOS",
      titulo: "Formulario incompleto",
      detalle: `Faltan: ${faltantes.join(", ")}. No se puede declarar apto sin estas respuestas.`,
    });
  }

  // --- Veredicto --------------------------------------------------------
  const orden: Record<Nivel, number> = { contraindicacion: 0, precaucion: 1, info: 2 };
  h.sort((a, b) => orden[a.nivel] - orden[b.nivel]);

  const hayCI = h.some((x) => x.nivel === "contraindicacion");
  const hayPR = h.some((x) => x.nivel === "precaucion");
  const veredicto: Veredicto = hayCI ? "NO_APTO" : hayPR ? "REQUIERE_EVALUACION" : "APTO";

  const plan = veredicto === "NO_APTO" ? null : planDosis(r.tratamiento, veredicto, modalidad);

  const nombre = r.nombre.trim() || "La persona";
  const resumen =
    veredicto === "NO_APTO"
      ? `${nombre} NO es candidata al tratamiento con ${nombreTratamiento(r.tratamiento)} por contraindicación.`
      : veredicto === "REQUIERE_EVALUACION"
        ? `${nombre} podría ser candidata a ${nombreTratamiento(r.tratamiento)}, pero requiere evaluación médica antes de iniciar.`
        : `${nombre} es candidata al tratamiento con ${nombreTratamiento(r.tratamiento)}${modalidad === "recomposicion" ? " en modalidad recomposición corporal" : ""}. Dosis inicial sugerida: ${plan?.dosisInicialMg} mg semanal.`;

  const estiloVida = veredicto === "NO_APTO" ? null : planEstiloVida(r, labs, modalidad);

  return { veredicto, resumen, hallazgos: h, antropometria: antro, laboratorios: labs, modalidad, plan, estiloVida, camposFaltantes: faltantes };
}

export function nombreTratamiento(t: Tratamiento): string {
  return t === "tirzepatida" ? "tirzepatida" : "retatrutida";
}

// Esquema de dosis. Afinar aquí si cambia el protocolo de la clínica.
export function planDosis(t: Tratamiento, veredicto: Veredicto, modalidad: Modalidad = "perdida_peso"): PlanDosis {
  const condicionado = veredicto === "REQUIERE_EVALUACION";
  if (modalidad === "recomposicion") {
    const rec: PlanDosis = {
      dosisInicialMg: 2.5,
      via: "Subcutánea (abdomen, muslo o brazo; rotar sitio)",
      frecuencia: "Una vez por semana, el mismo día",
      duracionInicialSemanas: 4,
      escalado:
        "Recomposición corporal: mantener 2.5 mg y subir a 5 mg solo si hay buena tolerancia y la respuesta es insuficiente a las 4–8 semanas. No superar 5 mg sin justificación médica.",
      dosisMaximaMg: 5,
      notas: [
        "Objetivo: perder grasa conservando músculo, no bajar peso rápido. La balanza puede moverse poco; medir cintura y fotos.",
        "Ciclo corto: 8–12 semanas y reevaluar. Suspender si pierde más del 1 % del peso por semana o si baja fuerza en el gimnasio.",
        "Proteína ≥ 1.6 g/kg/día y entrenamiento de fuerza 3 veces por semana son condición del tratamiento, no una sugerencia.",
        "Suspender y consultar ante dolor abdominal intenso persistente, vómito incoercible o ictericia.",
        "Uso fuera de indicación: consentimiento informado firmado y aval del médico tratante.",
      ],
    };
    if (condicionado) rec.notas.unshift("Plan condicionado: iniciar solo después de resolver las precauciones señaladas y con aval médico.");
    return rec;
  }
  const base: PlanDosis = {
    dosisInicialMg: 2.5,
    via: "Subcutánea (abdomen, muslo o brazo; rotar sitio)",
    frecuencia: "Una vez por semana, el mismo día",
    duracionInicialSemanas: 4,
    escalado:
      "Si hay buena tolerancia, aumentar 2.5 mg cada ≥ 4 semanas según respuesta y criterio médico.",
    dosisMaximaMg: t === "tirzepatida" ? 15 : 12,
    notas: [
      "Iniciar con 2.5 mg es dosis de adaptación, no terapéutica: busca minimizar náuseas y vómito.",
      "Control a las 4 semanas: peso, tolerancia gastrointestinal, hidratación.",
      "Suspender y consultar ante dolor abdominal intenso persistente, vómito incoercible o ictericia.",
      "Mantener proteína ≥ 1.2 g/kg/día y entrenamiento de fuerza para preservar masa muscular.",
    ],
  };
  if (t === "retatrutida") {
    base.notas.push("Retatrutida: dosis máxima estudiada en ensayos clínicos 12 mg. Se evalúa con los mismos criterios que tirzepatida.");
  }
  if (condicionado) {
    base.notas.unshift("Plan condicionado: iniciar solo después de resolver las precauciones señaladas y con aval médico.");
  }
  return base;
}

// ---------------------------------------------------------------------------
// Resumen en texto plano (para copiar o enviar por WhatsApp)
// ---------------------------------------------------------------------------

export function resumenTexto(r: Respuestas, res: Resultado): string {
  const etiqueta: Record<Veredicto, string> = {
    APTO: "✅ APTO",
    REQUIERE_EVALUACION: "⚠️ REQUIERE EVALUACIÓN MÉDICA",
    NO_APTO: "❌ NO APTO",
  };
  const lineas: string[] = [];
  lineas.push(`EVALUACIÓN · ${nombreTratamiento(r.tratamiento).toUpperCase()}`);
  lineas.push(`Paciente: ${r.nombre.trim() || "(sin nombre)"}`);
  if (r.edad || r.pesoKg || r.estaturaCm) {
    lineas.push(
      `Edad ${r.edad ?? "?"} · Peso ${r.pesoKg ?? "?"} kg · Estatura ${r.estaturaCm ?? "?"} cm · IMC ${res.antropometria.imc ?? "?"} (${res.antropometria.categoriaImc})`,
    );
  }
  lineas.push(`Resultado: ${etiqueta[res.veredicto]}${res.modalidad === "recomposicion" ? " · Modalidad: recomposición corporal" : ""}`);
  lineas.push("");
  const porNivel = (n: Nivel) => res.hallazgos.filter((x) => x.nivel === n);
  const ci = porNivel("contraindicacion");
  const pr = porNivel("precaucion");
  const info = porNivel("info");
  if (ci.length) {
    lineas.push("Contraindicaciones:");
    ci.forEach((x) => lineas.push(`  ❌ ${x.titulo}`));
  }
  if (pr.length) {
    lineas.push("Precauciones:");
    pr.forEach((x) => lineas.push(`  ⚠️ ${x.titulo}`));
  }
  if (info.length) {
    lineas.push("Observaciones:");
    info.forEach((x) => lineas.push(`  • ${x.titulo}`));
  }
  if (res.laboratorios.length) {
    lineas.push("");
    lineas.push("Perfil metabólico:");
    res.laboratorios.forEach((l) =>
      lineas.push(
        `  ${l.nombre}: ${l.valor} ${l.unidad} (${l.estado === "normal" ? "normal" : l.estado.toUpperCase()}; ref. ${l.rango})${l.comentario ? " – " + l.comentario : ""}`,
      ),
    );
  }
  if (res.plan) {
    lineas.push("");
    lineas.push(
      `Plan sugerido: ${res.plan.dosisInicialMg} mg SC semanal por ${res.plan.duracionInicialSemanas} semanas; ${res.plan.escalado}`,
    );
  }
  if (res.estiloVida) {
    lineas.push("");
    lineas.push(planEstiloVidaTexto(res.estiloVida));
  }
  lineas.push("");
  lineas.push("Herramienta de apoyo. La decisión final corresponde al médico tratante.");
  return lineas.join("\n");
}
