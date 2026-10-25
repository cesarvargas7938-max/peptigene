// Informe imprimible (HTML → PDF) de una evaluación.
// Se usa desde scripts/informe-pdf.mjs y desde la vista de impresión.

import type { Respuestas, Resultado, Nivel, Veredicto } from "./evaluacion.ts";
import { nombreTratamiento } from "./evaluacion.ts";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const VEREDICTO: Record<Veredicto, { texto: string; color: string; fondo: string }> = {
  APTO: { texto: "APTA PARA INICIAR", color: "#ffffff", fondo: "#059669" },
  REQUIERE_EVALUACION: { texto: "REQUIERE EVALUACIÓN MÉDICA", color: "#451a03", fondo: "#fbbf24" },
  NO_APTO: { texto: "NO APTA", color: "#ffffff", fondo: "#dc2626" },
};

const NIVEL: Record<Nivel, { titulo: string; icono: string; borde: string; fondo: string }> = {
  contraindicacion: { titulo: "Contraindicaciones", icono: "✕", borde: "#fecaca", fondo: "#fef2f2" },
  precaucion: { titulo: "Precauciones", icono: "!", borde: "#fde68a", fondo: "#fffbeb" },
  info: { titulo: "Observaciones", icono: "•", borde: "#bef7dc", fondo: "#e6fcf1" },
};

export function informeHtml(r: Respuestas, res: Resultado, opciones: { fecha?: Date; asesor?: string } = {}): string {
  const fecha = (opciones.fecha ?? new Date()).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  const v = VEREDICTO[res.veredicto];
  const a = res.antropometria;
  const ev = res.estiloVida;
  const trat = nombreTratamiento(r.tratamiento);
  const lista = (items: string[]) => `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const hallazgos = (nivel: Nivel) => {
    const hs = res.hallazgos.filter((h) => h.nivel === nivel);
    if (!hs.length) return "";
    const n = NIVEL[nivel];
    return `<div class="bloque">
      <h3>${n.titulo}</h3>
      ${hs
        .map(
          (h) => `<div class="hallazgo" style="border-color:${n.borde};background:${n.fondo}">
            <span class="ic">${n.icono}</span>
            <div><strong>${esc(h.titulo)}</strong><p>${esc(h.detalle)}</p></div>
          </div>`,
        )
        .join("")}
    </div>`;
  };

  const sinDato = (x: number | null | undefined, unidad = "") => (x === null || x === undefined ? "—" : `${x}${unidad}`);

  const filas: [string, string][] = [
    ["Suplementos o vitaminas", esc(r.suplementos || "No")],
    ["Alergias a medicamentos", r.alergiasMedicamentos === "si" ? esc(r.alergiasDetalle || "Sí") : r.alergiasMedicamentos === "no" ? "No" : "—"],
    ["Pancreatitis en la familia", sn(r.pancreatitisFamiliar)],
    ["Cáncer medular de tiroides / MEN2", sn(r.tiroidesCmtMen2)],
    ["Cálculos o problemas de vesícula", r.vesicula === "si" ? esc(r.vesiculaDetalle || "Sí") : sn(r.vesicula)],
    ["Pancreatitis personal", sn(r.pancreatitisPersonal)],
    ["Dolor abdominal fuerte e inexplicado", sn(r.dolorAbdominalInexplicado)],
    ["Enfermedad gastrointestinal grave", sn(r.enfermedadGiGrave)],
    ["Diabetes tipo 1", sn(r.diabetesTipo1)],
    ["Medicamentos actuales", esc(r.medicamentos || "No")],
    ["Ejercicio", r.ejercicio === "regular" ? "Sí, regular" : r.ejercicio === "ocasional" ? "Ocasional" : r.ejercicio === "no" ? "No" : "—"],
  ];
  if (r.sexo === "femenino") filas.push(["Embarazo o lactancia", sn(r.embarazoLactancia)]);
  if (r.comorbilidades.length) filas.push(["Condiciones de salud", esc(r.comorbilidades.join(", "))]);
  const respuestasHtml = `<div class="resp">${filas.map(([k, v]) => `<div><span>${k}</span>${v}</div>`).join("")}</div>`;

  const labsHtml = res.laboratorios.length
    ? `<div class="bloque">
        <h3>Perfil metabólico</h3>
        <table class="labs">
          <thead><tr><th>Analito</th><th>Valor</th><th>Referencia</th><th>Estado</th></tr></thead>
          <tbody>${res.laboratorios
            .map(
              (l) => `<tr>
                <td>${esc(l.nombre)}${l.comentario ? `<br><small>${esc(l.comentario)}</small>` : ""}</td>
                <td class="num">${l.valor} ${esc(l.unidad)}</td>
                <td>${esc(l.rango)}</td>
                <td><span class="estado ${l.estado}">${l.estado === "normal" ? "Normal" : l.estado === "alto" ? "Alto" : l.estado === "bajo" ? "Bajo" : "—"}</span></td>
              </tr>`,
            )
            .join("")}</tbody>
        </table>
      </div>`
    : "";

  const planHtml = res.plan
    ? `<div class="dosis">
        <div class="dosis-head">
          <span class="eyebrow">${res.veredicto === "APTO" ? "Dosis inicial sugerida" : "Plan condicionado a evaluación médica"}</span>
          <span class="dosis-num">${res.plan.dosisInicialMg} mg <small>/ semana</small></span>
        </div>
        <div class="dosis-grid">
          <div><b>Vía</b>${esc(res.plan.via)}</div>
          <div><b>Frecuencia</b>${esc(res.plan.frecuencia)}</div>
          <div><b>Fase inicial</b>${res.plan.duracionInicialSemanas} semanas</div>
          <div><b>Dosis máxima</b>${res.plan.dosisMaximaMg} mg</div>
        </div>
        <p class="escalado">${esc(res.plan.escalado)}</p>
        ${lista(res.plan.notas)}
      </div>`
    : "";

  const estiloHtml = ev
    ? `<section class="pagina">
        <div class="plan-head">
        <h2>Plan de hidratación, alimentación y ejercicio</h2>
        <p class="intro">Calculado a partir del metabolismo de ${esc(r.nombre || "la persona")}: tasa metabólica basal ${ev.metabolismo.tmbKcal} kcal (Mifflin-St Jeor), factor de actividad ${ev.metabolismo.factorActividad}, gasto energético total ${ev.metabolismo.getKcal} kcal/día.</p>
        <div class="tiles">
          <div class="tile"><span>${ev.metabolismo.caloriasObjetivo}</span>kcal objetivo/día</div>
          <div class="tile"><span>${ev.macros.proteinaG} g</span>proteína</div>
          <div class="tile"><span>${ev.macros.carbohidratosG} g</span>carbohidratos</div>
          <div class="tile"><span>${ev.macros.grasasG} g</span>grasas</div>
          <div class="tile"><span>${ev.macros.fibraG} g</span>fibra mínima</div>
          <div class="tile"><span>${ev.hidratacion.litrosDia} L</span>agua/día</div>
        </div>
        </div>
        <div class="bloque col2"><h3>💧 Hidratación</h3>${lista(ev.hidratacion.pautas)}</div>
        <div class="bloque col2"><h3>🍽️ Alimentación</h3>${lista(ev.alimentacion.pautas)}</div>
        <div class="bloque col2"><h3>🏋️ Ejercicio</h3>
          <table class="datos">
            <tr><td>Fuerza</td><td>${esc(ev.ejercicio.fuerza)}</td></tr>
            <tr><td>Cardio</td><td>${esc(ev.ejercicio.cardio)}</td></tr>
            <tr><td>Pasos</td><td>${esc(ev.ejercicio.pasos)}</td></tr>
          </table>
          ${lista(ev.ejercicio.pautas)}
        </div>
        <div class="bloque col2"><h3>🧬 Ajustes según perfil metabólico</h3>${lista(ev.ajustesMetabolicos)}</div>
        <div class="bloque col2"><h3>📈 Ritmo y seguimiento</h3>
            <p class="ritmo">Ritmo saludable: <b>${ev.ritmo.kgSemanaMin}–${ev.ritmo.kgSemanaMax} kg por semana</b>${ev.ritmo.kgMeta && ev.ritmo.semanasEstimadas ? ` · meta de ${ev.ritmo.kgMeta} kg en aproximadamente <b>${ev.ritmo.semanasEstimadas} semanas</b> (${Math.round(ev.ritmo.semanasEstimadas / 4.3)} meses)` : ""}.</p>
            ${lista(ev.seguimiento.slice(1))}
        </div>
        ${ev.supuestos.length ? `<p class="supuestos">Supuestos del cálculo: ${esc(ev.supuestos.join(" "))}</p>` : ""}
      </section>`
    : "";

  return `<!doctype html>
<html lang="es-CO">
<head>
<meta charset="utf-8">
<title>Evaluación · ${esc(r.nombre || "Paciente")} · Peptigene</title>
<style>
  @page { size: A4; margin: 16mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "Outfit", "Segoe UI", system-ui, -apple-system, sans-serif; color: #064e3b; font-size: 10.5pt; line-height: 1.45; margin: 0; }
  h1, h2, .dosis-num, .tile span, .logo { font-family: "Fraunces", Georgia, "Times New Roman", serif; font-weight: 500; letter-spacing: -0.02em; }
  h1 { font-size: 26pt; line-height: 1.05; margin: 0 0 4px; }
  h1 em { font-style: italic; font-weight: 400; color: #047857; }
  h2 { font-size: 18pt; margin: 0 0 6px; }
  h3 { font-size: 9pt; letter-spacing: 0.18em; text-transform: uppercase; color: #059669; margin: 0 0 6px; font-weight: 600; }
  p { margin: 0 0 6px; }
  ul { margin: 4px 0 0; padding-left: 16px; }
  li { margin-bottom: 3px; }
  .eyebrow { font-family: "JetBrains Mono", "Courier New", monospace; font-size: 8pt; letter-spacing: 0.2em; text-transform: uppercase; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 14px; }
  .logo { font-size: 16pt; display: flex; align-items: center; gap: 6px; }
  .logo i { display: inline-block; width: 22px; height: 22px; border: 2px solid #064e3b; border-radius: 50%; font-style: normal; font-size: 10pt; text-align: center; line-height: 18px; }
  .meta { text-align: right; font-size: 8.5pt; color: #047857; }
  .pagina { margin-top: 22px; }
  .plan-head { break-inside: avoid; }
  .fluye { break-inside: auto; }
  .cabecera { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
  .veredicto { display: inline-block; padding: 6px 14px; border-radius: 999px; font-weight: 600; font-size: 9.5pt; letter-spacing: 0.04em; margin-top: 6px; }
  .resumen { font-size: 11.5pt; margin: 8px 0 10px; }
  .antro { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin: 10px 0 12px; }
  .antro div, .tile { background: #f0fdf8; border: 1px solid #bef7dc; border-radius: 8px; padding: 6px 8px; text-align: center; font-size: 8pt; color: #047857; }
  .antro div span, .tile span { display: block; font-size: 15pt; color: #064e3b; font-weight: 600; line-height: 1.2; }
  .bloque { margin-bottom: 12px; break-inside: avoid; }
  .hallazgo { display: flex; gap: 8px; border: 1px solid; border-radius: 8px; padding: 6px 10px; margin-bottom: 5px; break-inside: avoid; }
  .hallazgo .ic { font-family: monospace; font-weight: 700; width: 12px; flex: none; }
  .hallazgo p { font-size: 9pt; margin: 2px 0 0; opacity: 0.85; }
  .hallazgo strong { font-size: 10pt; }
  .dosis { background: #064e3b; color: #ffffff; border-radius: 12px; padding: 12px 14px; margin: 10px 0 14px; break-inside: avoid; }
  .dosis .eyebrow { color: #84f0c1; }
  .dosis-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .dosis-num { font-size: 26pt; }
  .dosis-num small { font-size: 11pt; opacity: 0.8; font-family: inherit; }
  .dosis-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 8px 0; font-size: 8.5pt; }
  .dosis-grid b { display: block; color: #84f0c1; font-weight: 600; font-size: 7.5pt; letter-spacing: 0.1em; text-transform: uppercase; }
  .dosis .escalado { font-size: 9.5pt; }
  .dosis ul { font-size: 9pt; opacity: 0.92; }
  .resp { display: grid; grid-template-columns: 1fr 1fr; gap: 0 18px; font-size: 9pt; }
  .resp div { padding: 3px 0; border-bottom: 1px solid #d9fbeb; }
  .resp span { display: block; color: #047857; font-size: 8pt; }
  table.datos { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  table.datos td { padding: 4px 6px; border-bottom: 1px solid #d9fbeb; vertical-align: top; }
  table.datos td:first-child { color: #047857; width: 38%; }
  table.labs { width: 100%; border-collapse: collapse; font-size: 9pt; }
  table.labs th { text-align: left; font-weight: 600; color: #047857; border-bottom: 1.5px solid #84f0c1; padding: 4px 6px; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.08em; }
  table.labs td { padding: 4px 6px; border-bottom: 1px solid #d9fbeb; vertical-align: top; }
  table.labs td.num { font-family: "JetBrains Mono", monospace; white-space: nowrap; }
  table.labs small { color: #92400e; }
  .estado { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 8pt; font-weight: 600; }
  .estado.normal { background: #bef7dc; color: #065f46; }
  .estado.alto, .estado.bajo { background: #fde68a; color: #78350f; }
  .estado.sin_rango { background: #e5e7eb; color: #374151; }
  .intro { color: #047857; margin-bottom: 10px; }
  .tiles { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 14px; }
  .col2 ul { columns: 2; column-gap: 20px; font-size: 9.3pt; }
  .col2 li { break-inside: avoid; }
  .ritmo { font-size: 9.5pt; }
  .supuestos { font-size: 8.5pt; color: #047857; font-style: italic; margin-top: 8px; }
  footer { margin-top: 10px; padding-top: 6px; break-inside: avoid; border-top: 1px solid #bef7dc; font-size: 8pt; color: #047857; }
  .firma { margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; font-size: 9pt; }
  .firma div { border-top: 1px solid #064e3b; padding-top: 4px; }
</style>
</head>
<body>
<header>
  <div class="logo"><i>P</i> Peptigene</div>
  <div class="meta">Evaluación para tratamiento con péptidos<br>${esc(fecha)}${opciones.asesor ? `<br>Asesor: ${esc(opciones.asesor)}` : ""}</div>
</header>

<section>
  <div class="cabecera">
    <div>
      <p class="eyebrow" style="color:#059669">Tratamiento evaluado · ${esc(trat)}</p>
      <h1>${esc(r.nombre || "Paciente")}<br><em>evaluación de aptitud.</em></h1>
      <span class="veredicto" style="background:${v.fondo};color:${v.color}">${v.texto}</span>${res.modalidad === "recomposicion" ? '<span class="veredicto" style="background:#e6fcf1;color:#064e3b;border:1px solid #84f0c1;margin-left:6px">RECOMPOSICIÓN CORPORAL</span>' : ""}
    </div>
  </div>
  <p class="resumen">${esc(res.resumen)}</p>
  <div class="antro">
    <div><span>${sinDato(r.edad)}</span>edad</div>
    <div><span>${sinDato(r.pesoKg, " kg")}</span>peso actual</div>
    <div><span>${sinDato(r.estaturaCm, " cm")}</span>estatura</div>
    <div><span>${sinDato(a.imc)}</span>IMC · ${esc(a.categoriaImc)}</div>
    <div><span>${a.excesoVsIdealKg !== null ? `−${a.excesoVsIdealKg} kg` : "—"}</span>meta de pérdida</div>
  </div>

  ${planHtml}
  ${hallazgos("contraindicacion")}
  ${hallazgos("precaucion")}
  ${hallazgos("info")}
  ${labsHtml}

  <div class="bloque fluye">
    <h3>Respuestas del cuestionario</h3>
    ${respuestasHtml}
  </div>
</section>

${estiloHtml}

<footer>
  <p>Este informe es una herramienta de apoyo al tamizaje clínico generada a partir de las respuestas del paciente. No reemplaza la valoración médica: la decisión final, la prescripción y los ajustes de dosis corresponden al profesional de la salud tratante. Los rangos de laboratorio son referencias generales para adultos y pueden variar según el laboratorio.</p>
  <div class="firma">
    <div>Médico tratante · Registro</div>
    <div>Paciente · Consentimiento informado</div>
  </div>
</footer>
</body>
</html>`;
}

function sn(v: string): string {
  return v === "si" ? "Sí" : v === "no" ? "No" : "—";
}
