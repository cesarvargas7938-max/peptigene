// Convierte una evaluación en texto plano (formato del chat) a un PDF con el estilo del sitio.
//   node scripts/texto-a-pdf.mjs <evaluacion.txt> <salida.pdf> [marcas/<aliado>.json]
// Sin marca usa marcas/peptigene.json. La marca cambia nombre, colores, médico
// evaluador y pie de página (marca blanca para establecimientos aliados).
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const [entrada, salida, marcaArg] = process.argv.slice(2);
if (!entrada || !salida) { console.error("Uso: node scripts/texto-a-pdf.mjs <evaluacion.txt> <salida.pdf> [marca.json]"); process.exit(1); }
const marca = { ...JSON.parse(readFileSync(resolve("marcas/peptigene.json"), "utf8")), ...(marcaArg ? JSON.parse(readFileSync(resolve(marcaArg), "utf8")) : {}) };
const texto = readFileSync(resolve(entrada), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Bloques: línea "TÍTULO · ..." = h1; "Resultado:" = badge; líneas que terminan en ":" o empiezan con emoji = h2;
// "  • " / "  ⚠️ " / "  ✕ " = viñetas; líneas con sangría sin viñeta = continuación.
const lineas = texto.replace(/\r/g, "").split("\n");
let html = "", enLista = false, primera = true;
const cerrar = () => { if (enLista) { html += "</ul>"; enLista = false; } };
for (let raw of lineas) {
  const l = raw.replace(/\s+$/, "");
  if (!l.trim()) { cerrar(); continue; }
  const viñeta = l.match(/^\s+(•|⚠️|✕|\d+\.)\s+(.*)$/);
  if (viñeta) {
    if (!enLista) { html += "<ul>"; enLista = true; }
    const cls = viñeta[1] === "⚠️" ? "warn" : viñeta[1] === "✕" ? "bad" : "";
    html += `<li class="${cls}">${viñeta[1] === "•" ? "" : esc(viñeta[1]) + " "}${esc(viñeta[2])}</li>`;
    continue;
  }
  if (/^\s+\S/.test(l) && enLista) { html = html.replace(/<\/li>$/, " " + esc(l.trim()) + "</li>"); continue; }
  cerrar();
  if (primera) { html += `<h1>${esc(l)}</h1>`; primera = false; continue; }
  if (/^Resultado:/.test(l)) {
    const t = l.replace(/^Resultado:\s*/, "");
    const cls = /✅/.test(t) ? "ok" : /❌/.test(t) ? "no" : /⏸️/.test(t) ? "pause" : "warn";
    html += `<div class="badge ${cls}">${esc(t)}</div>`; continue;
  }
  if (/^(Herramienta de apoyo)/.test(l)) { html += `<p class="legal">${esc(l)}</p>`; continue; }
  if (/^(PLAN DE ESTILO DE VIDA)/.test(l)) { html += `<h2 class="seccion">${esc(l)}</h2>`; continue; }
  if (/^(Metabolismo:|Macros:)/.test(l)) { html += `<p class="meta">${esc(l)}</p>`; continue; }
  if (/^(Paciente:|Edad|Meta:|Documento adjunto|Supuesto)/.test(l)) { html += `<p class="dato">${esc(l)}</p>`; continue; }
  if (/:$/.test(l) || /^[\u{1F300}-\u{1FAFF}]/u.test(l) || /^[A-ZÁÉÍÓÚÑ ]{6,}$/.test(l)) { html += `<h2>${esc(l.replace(/:$/, ""))}</h2>`; continue; }
  html += `<p>${esc(l)}</p>`;
}
cerrar();

const doc = `<!doctype html><html lang="es-CO"><head><meta charset="utf-8"><title>Evaluación</title><style>
@page { size: A4; margin: 13mm 14mm 15mm 14mm; }
body { font-family: "Outfit", "Segoe UI", system-ui, sans-serif; color: ${marca.color}; font-size: 10pt; line-height: 1.42; margin: 0; }
header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid ${marca.acento}; padding-bottom: 8px; margin-bottom: 14px; }
.logo { font-family: Georgia, serif; font-size: 16pt; display: flex; align-items: center; gap: 6px; }
.logo i { display: inline-block; width: 22px; height: 22px; border: 2px solid ${marca.color}; border-radius: 50%; font-style: normal; font-size: 10pt; text-align: center; line-height: 18px; }
.fecha { font-size: 8.5pt; color: ${marca.acento}; text-align: right; }
h1 { font-family: Georgia, serif; font-weight: 500; font-size: 20pt; letter-spacing: -0.02em; margin: 0 0 6px; color: ${marca.color}; }
h2 { font-size: 9pt; letter-spacing: 0.16em; text-transform: uppercase; color: ${marca.acento}; margin: 11px 0 4px; font-weight: 600; break-after: avoid; }
h2.seccion { font-family: Georgia, serif; font-size: 16pt; letter-spacing: -0.01em; text-transform: none; color: ${marca.color}; margin-top: 20px; padding-top: 12px; border-top: 1px solid ${marca.linea}; }
p { margin: 0 0 5px; }
p.dato { color: ${marca.acento}; font-size: 10pt; margin: 0 0 3px; }
p.meta { background: ${marca.suave}; border: 1px solid ${marca.linea}; border-radius: 8px; padding: 6px 10px; font-size: 9.5pt; margin: 4px 0; }
.firma { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; font-size: 9pt; break-inside: avoid; }
.firma div { border-top: 1px solid ${marca.color}; padding-top: 4px; }
.firma small { display: block; color: ${marca.acento}; font-size: 8pt; }
.badge { display: inline-block; padding: 7px 14px; border-radius: 999px; font-weight: 600; font-size: 10pt; margin: 8px 0 10px; }
.badge.ok { background: #059669; color: #fff; } .badge.warn { background: #fbbf24; color: #451a03; } .badge.no { background: #dc2626; color: #fff; } .badge.pause { background: #e5e7eb; color: #1f2937; }
ul { margin: 0 0 6px; padding-left: 18px; } li { margin-bottom: 2.5px; break-inside: avoid; }
li.warn { color: #78350f; } li.bad { color: #7f1d1d; }
p.legal { margin-top: 18px; padding-top: 8px; border-top: 1px solid ${marca.linea}; font-size: 8.5pt; color: ${marca.acento}; }
</style></head><body>
<header><div class="logo"><i>${esc(marca.inicial)}</i> ${esc(marca.nombre)}</div><div class="fecha">${esc(marca.subtitulo)}<br>${new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</div></header>
${html}
<div class="firma">
  <div>${esc(marca.medico || "Médico evaluador")}<small>${esc(marca.registro || "Registro médico")}</small></div>
  <div>Paciente<small>Recibí y comprendí las recomendaciones</small></div>
</div>
${marca.contacto ? `<p class="legal" style="border:0;margin-top:8px">${esc(marca.contacto)}</p>` : ""}
</body></html>`;

const { chromium } = await import("playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.setContent(doc, { waitUntil: "load" });
await page.pdf({ path: resolve(salida), format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%;font-size:7.5pt;color:${marca.acento};padding:0 15mm;display:flex;justify-content:space-between;font-family:system-ui"><span>${esc(marca.pie)}</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>`,
  margin: { top: "12mm", bottom: "14mm", left: "14mm", right: "14mm" } });
await browser.close();
console.log("PDF:", resolve(salida));
