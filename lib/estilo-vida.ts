// Plan de hidratación, alimentación y ejercicio según metabolismo.
//
// Se calcula a partir de las respuestas del formulario y, si existen, de los
// laboratorios del perfil metabólico. Afinar aquí los factores y pautas.

import type { Laboratorio, Respuestas } from "./evaluacion";

export type Metabolismo = {
  tmbKcal: number; // tasa metabólica basal (Mifflin-St Jeor)
  factorActividad: number;
  getKcal: number; // gasto energético total diario
  deficitKcal: number;
  caloriasObjetivo: number;
  minimoSeguroKcal: number;
};

export type Macros = {
  proteinaG: number;
  proteinaGporKg: number;
  carbohidratosG: number;
  grasasG: number;
  fibraG: number;
};

export type PlanEstiloVida = {
  metabolismo: Metabolismo;
  macros: Macros;
  hidratacion: { litrosDia: number; conEjercicioLitros: number; pautas: string[] };
  alimentacion: { pautas: string[] };
  ejercicio: { fuerza: string; cardio: string; pasos: string; pautas: string[] };
  ritmo: { kgSemanaMin: number; kgSemanaMax: number; semanasEstimadas: number | null; kgMeta: number | null };
  ajustesMetabolicos: string[];
  seguimiento: string[];
  supuestos: string[];
};

// Antihipertensivos comunes: implican hipertensión tratada (comorbilidad asociada al peso).
export const PATRON_ANTIHIPERTENSIVO =
  /\b(losartan|losartán|valsartan|valsartán|irbesartan|irbesartán|olmesartan|olmesartán|telmisartan|telmisartán|candesartan|candesartán|enalapril|captopril|lisinopril|ramipril|perindopril|amlodipino|amlodipina|nifedipino|verapamilo|diltiazem|hidroclorotiazida|clortalidona|indapamida|furosemida|espironolactona|metoprolol|atenolol|bisoprolol|carvedilol|propranolol|nebivolol|prazosina|doxazosina|clonidina|antihipertensivo|presion alta|presión alta|hipertension|hipertensión)\b/;
export const PATRON_DIURETICO = /\b(hidroclorotiazida|clortalidona|indapamida|furosemida|espironolactona|diuretico|diurético)\b/;

const FACTOR_ACTIVIDAD: Record<string, { factor: number; nombre: string }> = {
  no: { factor: 1.2, nombre: "sedentario" },
  ocasional: { factor: 1.375, nombre: "actividad ligera" },
  regular: { factor: 1.55, nombre: "actividad moderada" },
  "": { factor: 1.3, nombre: "actividad ligera (asumida)" },
};

function r1(n: number) {
  return Math.round(n * 10) / 10;
}
function r10(n: number) {
  return Math.round(n / 10) * 10;
}

export function tmbMifflin(pesoKg: number, estaturaCm: number, edad: number, sexo: string): number {
  const base = 10 * pesoKg + 6.25 * estaturaCm - 5 * edad;
  return Math.round(sexo === "femenino" ? base - 161 : base + 5);
}

export function planEstiloVida(r: Respuestas, labs: Laboratorio[]): PlanEstiloVida | null {
  if (!r.pesoKg || !r.estaturaCm) return null;

  const supuestos: string[] = [];
  const edad = r.edad ?? 35;
  if (!r.edad) supuestos.push("Edad no reportada: se asumen 35 años para el cálculo metabólico.");
  const sexo = r.sexo || "femenino";
  if (!r.sexo) supuestos.push("Sexo no reportado: se asume femenino (cálculo más conservador).");
  const act = FACTOR_ACTIVIDAD[r.ejercicio] ?? FACTOR_ACTIVIDAD[""];
  if (!r.ejercicio) supuestos.push("Nivel de ejercicio no reportado: se asume actividad ligera.");

  const lab = (clave: string) => labs.find((l) => l.clave === clave);
  const com = new Set(r.comorbilidades);
  const medsNorm = r.medicamentos.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (PATRON_ANTIHIPERTENSIVO.test(medsNorm)) com.add("hipertension");
  const peso = r.pesoKg;
  const estatura = r.estaturaCm;
  const imc = peso / Math.pow(estatura / 100, 2);

  // --- Metabolismo ------------------------------------------------------
  const tmb = tmbMifflin(peso, estatura, edad, sexo);
  const get = Math.round(tmb * act.factor);
  const minimoSeguro = sexo === "femenino" ? 1200 : 1500;
  // Déficit del 20–25 % del gasto total, acotado a 500–750 kcal.
  let deficit = Math.min(750, Math.max(500, Math.round(get * 0.22)));
  let objetivo = r10(get - deficit);
  if (objetivo < minimoSeguro) {
    objetivo = minimoSeguro;
    deficit = get - objetivo;
  }

  // --- Macros -----------------------------------------------------------
  // Proteína sobre peso actual; con obesidad se usa 1.2–1.6 g/kg acotado por
  // el peso correspondiente a IMC 25 × 2 g/kg para no sobreestimar.
  const renal = com.has("renal") || (lab("tfg") !== undefined && lab("tfg")!.valor < 60);
  const proteinaPorKg = renal ? 0.9 : imc >= 35 ? 1.3 : 1.5;
  const pesoImc25 = 25 * Math.pow(estatura / 100, 2);
  let proteinaG = Math.round(Math.min(peso * proteinaPorKg, pesoImc25 * 2));
  if (renal) proteinaG = Math.round(peso * proteinaPorKg);
  const proteinaKcal = proteinaG * 4;
  // Grasas 30 % del objetivo; carbohidratos con lo restante.
  const resistenciaInsulina =
    com.has("prediabetes") || com.has("dm2") ||
    (lab("homa_ir")?.estado === "alto") ||
    (lab("hba1c") !== undefined && lab("hba1c")!.valor >= 5.7) ||
    (lab("glucosa") !== undefined && lab("glucosa")!.valor >= 100);
  const grasasPct = resistenciaInsulina ? 0.33 : 0.3;
  const grasasG = Math.round((objetivo * grasasPct) / 9);
  const carbosG = Math.max(80, Math.round((objetivo - proteinaKcal - grasasG * 9) / 4));
  const fibraG = sexo === "femenino" ? 25 : 30;

  // --- Hidratación ------------------------------------------------------
  // 30–35 mL/kg con tope práctico; con GLP-1 el mínimo es 2 L por el riesgo
  // de deshidratación con náuseas o vómito.
  const litros = r1(Math.max(2, Math.min(3.5, (peso * 33) / 1000)));
  const litrosEjercicio = r1(litros + 0.5);
  const hidratacionPautas = [
    `Meta diaria: ${litros} L de agua (${Math.round(litros * 4)} vasos de 250 mL). Días de entrenamiento: ${litrosEjercicio} L.`,
    "Repartir durante el día: 1 vaso al despertar, 1 vaso 20–30 min antes de cada comida (ayuda a la saciedad) y el resto entre comidas.",
    "Con tirzepatida/retatrutida la sed disminuye junto con el apetito: programar recordatorios, no esperar a tener sed.",
    "Si hay náuseas, vómito o diarrea: sorbos pequeños frecuentes y 1 sobre de suero oral o bebida con electrolitos al día hasta que ceda.",
    "Evitar bebidas azucaradas y jugos; limitar alcohol (empeora náuseas y aporta calorías vacías). Café o té sin azúcar cuentan como líquido.",
    "Señal de alarma: orina muy oscura, mareo al levantarse o menos de 4 micciones al día → aumentar líquidos y avisar.",
  ];

  // --- Alimentación -----------------------------------------------------
  const alimentacionPautas = [
    `Objetivo: ~${objetivo} kcal/día (gasto estimado ${get} kcal, déficit de ${deficit} kcal). Nunca por debajo de ${minimoSeguro} kcal.`,
    `Proteína: ${proteinaG} g/día (${proteinaPorKg} g/kg), repartida en 25–40 g por comida. Prioridad número uno para no perder músculo. Fuentes: pollo, pescado, huevo, carne magra, lácteos sin azúcar, legumbres, tofu.`,
    `Carbohidratos: ~${carbosG} g/día, de fuentes integrales y con fibra (avena, arroz integral, quinua, papa, plátano, frutas enteras). Evitar harinas refinadas, azúcar y ultraprocesados.`,
    `Grasas: ~${grasasG} g/día, principalmente insaturadas (aguacate, aceite de oliva, frutos secos, pescado graso). Limitar fritos y grasas saturadas: empeoran las náuseas con el tratamiento.`,
    `Fibra: ≥ ${fibraG} g/día (verduras en 2 comidas, 2 porciones de fruta, legumbres 3 veces por semana).`,
    "Estructura: 3 comidas pequeñas + 1–2 snacks proteicos. Con el tratamiento el estómago se vacía lento; porciones grandes causan malestar.",
    "Orden del plato: primero verduras y proteína, al final el carbohidrato. Comer despacio (20 min mínimo) y parar al 80 % de saciedad.",
    "Si un día el apetito es muy bajo: asegurar al menos la proteína (batido de proteína, yogur griego, huevos) y líquidos, aunque falten las demás calorías.",
    "Suplementos recomendados durante la pérdida de peso: multivitamínico diario; evaluar vitamina D y omega 3 según laboratorio.",
  ];

  // --- Ejercicio --------------------------------------------------------
  const nivel = r.ejercicio;
  const fuerza =
    nivel === "regular"
      ? "3 sesiones/semana de fuerza (cuerpo completo o torso/pierna), 6–8 ejercicios, 3 series de 8–12 repeticiones, progresando carga cada 1–2 semanas."
      : nivel === "ocasional"
        ? "2–3 sesiones/semana de fuerza, cuerpo completo, 5–6 ejercicios básicos (sentadilla, bisagra de cadera, empuje, tracción, zancada), 2–3 series de 10–15 repeticiones."
        : "Empezar con 2 sesiones/semana de fuerza de 30 min con peso corporal o bandas (sentadilla a silla, puente de glúteo, flexiones en pared, remo con banda), 2 series de 10–12 repeticiones; subir a 3 sesiones al mes 2.";
  const cardio =
    nivel === "regular"
      ? "150–300 min/semana de cardio moderado (caminata rápida, bici, natación) o 75–150 min vigoroso; puede incluir 1 sesión de intervalos."
      : nivel === "ocasional"
        ? "150 min/semana de cardio moderado repartidos en 5 días (30 min caminando rápido o en bici), subiendo 10 % cada semana."
        : "Semanas 1–4: caminar 20 min diarios a paso cómodo. Semanas 5–8: 30 min a paso rápido. Meta al mes 3: 150 min/semana.";
  const pasos = nivel === "no" ? "Meta de pasos: empezar en 5 000/día y subir 500 cada semana hasta 8 000–10 000." : "Meta de pasos: 8 000–10 000/día además del entrenamiento.";
  const ejercicioPautas = [
    "La fuerza es innegociable: con los agonistas GLP-1 hasta un 25–40 % del peso perdido puede ser músculo si no se entrena ni se come proteína suficiente.",
    "Caminar 10–15 min después de las comidas principales reduce el pico de glucosa y mejora la digestión.",
    "Entrenar con el estómago poco lleno (1.5–2 h después de comer) para evitar náuseas; hidratarse antes y después.",
    "Las primeras 2 semanas de cada aumento de dosis bajar la intensidad si hay malestar; mantener la frecuencia.",
    "Dormir 7–9 h: el sueño corto aumenta el apetito y frena la pérdida de grasa.",
  ];

  // --- Ritmo esperado ---------------------------------------------------
  const kgSemanaMin = r1(peso * 0.005);
  const kgSemanaMax = r1(peso * 0.01);
  const kgMeta = r.pesoIdealKg ? r1(peso - r.pesoIdealKg) : null;
  const semanas = kgMeta && kgMeta > 0 ? Math.round(kgMeta / ((kgSemanaMin + kgSemanaMax) / 2)) : null;

  // --- Ajustes según perfil metabólico ----------------------------------
  const ajustes: string[] = [];
  if (resistenciaInsulina) {
    ajustes.push(
      "Resistencia a la insulina / prediabetes: carbohidratos moderados (nunca solos: siempre con proteína o fibra), sin azúcar ni bebidas dulces, caminata después de comer y fuerza 3 veces por semana. Es el perfil que mejor responde al tratamiento.",
    );
  }
  if (com.has("dm2") || (lab("hba1c") !== undefined && lab("hba1c")!.valor >= 6.5)) {
    ajustes.push("Diabetes tipo 2: monitorear glucemia capilar las primeras semanas; si usa medicamentos hipoglucemiantes, el médico debe ajustar dosis.");
  }
  const tg = lab("trigliceridos");
  if (tg && tg.valor >= 150) {
    ajustes.push(`Triglicéridos ${tg.valor}: eliminar azúcar, jugos y alcohol; preferir pescado graso 2 veces/semana y omega 3. Suelen normalizarse con el 5–10 % de pérdida de peso.`);
  }
  const ldl = lab("ldl");
  const ct = lab("colesterol_total");
  if ((ldl && ldl.estado === "alto") || (ct && ct.estado === "alto") || com.has("dislipidemia")) {
    ajustes.push("Colesterol elevado: reemplazar grasas saturadas (fritos, embutidos, mantequilla) por aceite de oliva, aguacate y frutos secos; avena y legumbres diarias por su fibra soluble.");
  }
  const hdl = lab("hdl");
  if (hdl && (hdl.estado === "bajo" || hdl.comentario)) {
    ajustes.push("HDL bajo: el ejercicio aeróbico regular y dejar de fumar son lo que más lo sube.");
  }
  if (com.has("higado_graso") || (lab("alt") !== undefined && lab("alt")!.estado === "alto")) {
    ajustes.push("Hígado graso / transaminasas altas: cero alcohol, evitar fructosa añadida (jarabe de maíz, jugos), café sin azúcar 2–3 tazas/día ayuda. Mejora notablemente con 7–10 % de pérdida de peso.");
  }
  if (com.has("hipertension")) {
    ajustes.push("Hipertensión: sodio < 2 g/día (no añadir sal, evitar enlatados y embutidos), potasio de frutas y verduras. La presión suele bajar con el tratamiento: controlarla semanalmente; si baja de 110/70 o hay mareo, el médico debe reducir el antihipertensivo.");
  }
  if (PATRON_DIURETICO.test(medsNorm)) {
    ajustes.push("Usa diurético: sumado a las náuseas o vómito del tratamiento aumenta el riesgo de deshidratación y daño renal. Hidratación estricta, y si hay vómito o diarrea suspender el diurético ese día y consultar.");
  }
  if (renal) {
    ajustes.push("Función renal disminuida: proteína moderada (0.9 g/kg), hidratación estricta y control de creatinina a las 4–8 semanas. Evitar antiinflamatorios.");
  }
  const au = lab("acido_urico");
  if (au && au.estado === "alto") {
    ajustes.push("Ácido úrico alto: evitar cerveza, vísceras y mariscos en exceso; buena hidratación. La pérdida rápida de peso puede elevarlo transitoriamente.");
  }
  const vitd = lab("vitamina_d");
  if (vitd && vitd.estado === "bajo") {
    ajustes.push(`Vitamina D ${vitd.valor} ng/mL: suplementar según indicación médica (habitualmente 2 000–4 000 UI/día) y exposición solar 15 min/día.`);
  }
  const b12 = lab("b12");
  if (b12 && b12.estado === "bajo") {
    ajustes.push("Vitamina B12 baja: suplementar; especialmente importante si usa metformina.");
  }
  const ferr = lab("ferritina");
  const hb = lab("hemoglobina");
  if ((ferr && ferr.estado === "bajo") || (hb && hb.estado === "bajo")) {
    ajustes.push("Hierro / hemoglobina bajos: carne roja magra, legumbres con vitamina C; evaluar suplemento de hierro con el médico antes de iniciar.");
  }
  const tsh = lab("tsh");
  if (tsh && tsh.estado === "alto") {
    ajustes.push("TSH elevada: el hipotiroidismo no controlado frena la pérdida de peso; compensar primero.");
  }
  if (com.has("sop")) {
    ajustes.push("Síndrome de ovario poliquístico: el patrón de carbohidratos moderados + fuerza es especialmente útil; la pérdida del 5–10 % del peso suele regularizar el ciclo.");
  }
  if (com.has("apnea")) {
    ajustes.push("Apnea del sueño: evitar alcohol y cenas tardías; reevaluar la apnea tras perder 10 % del peso.");
  }
  if (ajustes.length === 0) {
    ajustes.push("Sin alteraciones metabólicas reportadas: aplicar el plan general. Pedir perfil metabólico basal (glucosa, HbA1c, lípidos, TSH, lipasa) si aún no se tiene.");
  }

  // --- Seguimiento ------------------------------------------------------
  const seguimiento = [
    `Ritmo saludable: ${kgSemanaMin}–${kgSemanaMax} kg por semana (0.5–1 % del peso).${kgMeta && semanas ? ` Para bajar ${kgMeta} kg: aproximadamente ${semanas} semanas (${Math.round(semanas / 4.3)} meses).` : ""}`,
    "Pesarse 1 vez por semana, mismo día, en ayunas. Medir cintura cada 2 semanas. Fotos cada 4 semanas.",
    "Si la pérdida supera 1.5 % del peso por semana durante 2 semanas seguidas: subir calorías y proteína; se está perdiendo músculo.",
    "Si no hay cambio en 4 semanas con buena adherencia: revisar porciones y considerar aumento de dosis con el médico.",
    "Laboratorios de control a las 12 semanas: glucosa, HbA1c, lípidos, creatinina, lipasa si hubo síntomas.",
    "Al llegar a la meta: no suspender de golpe; planear mantenimiento con el médico (dosis de sostén o retiro gradual) manteniendo fuerza y proteína.",
  ];

  return {
    metabolismo: { tmbKcal: tmb, factorActividad: act.factor, getKcal: get, deficitKcal: deficit, caloriasObjetivo: objetivo, minimoSeguroKcal: minimoSeguro },
    macros: { proteinaG, proteinaGporKg: proteinaPorKg, carbohidratosG: carbosG, grasasG, fibraG },
    hidratacion: { litrosDia: litros, conEjercicioLitros: litrosEjercicio, pautas: hidratacionPautas },
    alimentacion: { pautas: alimentacionPautas },
    ejercicio: { fuerza, cardio, pasos, pautas: ejercicioPautas },
    ritmo: { kgSemanaMin, kgSemanaMax, semanasEstimadas: semanas, kgMeta },
    ajustesMetabolicos: ajustes,
    seguimiento,
    supuestos,
  };
}

export function planEstiloVidaTexto(p: PlanEstiloVida): string {
  const l: string[] = [];
  l.push("PLAN DE ESTILO DE VIDA");
  l.push(`Metabolismo: TMB ${p.metabolismo.tmbKcal} kcal · Gasto total ${p.metabolismo.getKcal} kcal · Objetivo ${p.metabolismo.caloriasObjetivo} kcal/día (déficit ${p.metabolismo.deficitKcal})`);
  l.push(`Macros: proteína ${p.macros.proteinaG} g · carbohidratos ${p.macros.carbohidratosG} g · grasas ${p.macros.grasasG} g · fibra ≥ ${p.macros.fibraG} g`);
  l.push("");
  l.push("💧 Hidratación");
  p.hidratacion.pautas.forEach((x) => l.push(`  • ${x}`));
  l.push("");
  l.push("🍽️ Alimentación");
  p.alimentacion.pautas.forEach((x) => l.push(`  • ${x}`));
  l.push("");
  l.push("🏋️ Ejercicio");
  l.push(`  • Fuerza: ${p.ejercicio.fuerza}`);
  l.push(`  • Cardio: ${p.ejercicio.cardio}`);
  l.push(`  • ${p.ejercicio.pasos}`);
  p.ejercicio.pautas.forEach((x) => l.push(`  • ${x}`));
  l.push("");
  l.push("🧬 Ajustes según perfil metabólico");
  p.ajustesMetabolicos.forEach((x) => l.push(`  • ${x}`));
  l.push("");
  l.push("📈 Ritmo y seguimiento");
  p.seguimiento.forEach((x) => l.push(`  • ${x}`));
  if (p.supuestos.length) {
    l.push("");
    l.push("Supuestos del cálculo:");
    p.supuestos.forEach((x) => l.push(`  • ${x}`));
  }
  return l.join("\n");
}
