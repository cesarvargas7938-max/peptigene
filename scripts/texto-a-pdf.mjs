// Convierte una evaluación en texto plano (formato del chat) a un PDF con el estilo del sitio.
//   node scripts/texto-a-pdf.mjs <evaluacion.txt> <salida.pdf>
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const [entrada, salida] = process.argv.slice(2);
if (!entrada || !salida) { console.error("Uso: node scripts/texto-a-pdf.mjs <evaluacion.txt> <salida.pdf>"); process.exit(1); }
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
@page { size: A4; margin: 16mm 15mm 18mm 15mm; }
body { font-family: "Outfit", "Segoe UI", system-ui, sans-serif; color: #064e3b; font-size: 10.5pt; line-height: 1.5; margin: 0; }
header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 14px; }
.logo { font-family: Georgia, serif; font-size: 16pt; display: flex; align-items: center; gap: 6px; }
.logo i { display: inline-block; width: 22px; height: 22px; border: 2px solid #064e3b; border-radius: 50%; font-style: normal; font-size: 10pt; text-align: center; line-height: 18px; }
.fecha { font-size: 8.5pt; color: #047857; text-align: right; }
h1 { font-family: Georgia, serif; font-weight: 500; font-size: 20pt; letter-spacing: -0.02em; margin: 0 0 6px; color: #064e3b; }
h2 { font-size: 9pt; letter-spacing: 0.16em; text-transform: uppercase; color: #059669; margin: 14px 0 5px; font-weight: 600; break-after: avoid; }
h2.seccion { font-family: Georgia, serif; font-size: 16pt; letter-spacing: -0.01em; text-transform: none; color: #064e3b; margin-top: 20px; padding-top: 12px; border-top: 1px solid #bef7dc; }
p { margin: 0 0 5px; }
p.dato { color: #047857; font-size: 10pt; margin: 0 0 3px; }
p.meta { background: #f0fdf8; border: 1px solid #bef7dc; border-radius: 8px; padding: 6px 10px; font-size: 9.5pt; margin: 4px 0; }
.badge { display: inline-block; padding: 7px 14px; border-radius: 999px; font-weight: 600; font-size: 10pt; margin: 8px 0 10px; }
.badge.ok { background: #059669; color: #fff; } .badge.warn { background: #fbbf24; color: #451a03; } .badge.no { background: #dc2626; color: #fff; } .badge.pause { background: #e5e7eb; color: #1f2937; }
ul { margin: 0 0 6px; padding-left: 18px; } li { margin-bottom: 4px; break-inside: avoid; }
li.warn { color: #78350f; } li.bad { color: #7f1d1d; }
p.legal { margin-top: 18px; padding-top: 8px; border-top: 1px solid #bef7dc; font-size: 8.5pt; color: #047857; }
</style></head><body>
<header><div class="logo"><i>P</i> Peptigene</div><div class="fecha">Evaluación para tratamiento con péptidos<br>${new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</div></header>
${html}
</body></html>`;

const { chromium } = await import("playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.setContent(doc, { waitUntil: "load" });
await page.pdf({ path: resolve(salida), format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>",
  footerTemplate: '<div style="width:100%;font-size:7.5pt;color:#047857;padding:0 15mm;display:flex;justify-content:space-between;font-family:system-ui"><span>Peptigene · Herramienta de apoyo clínico</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>',
  margin: { top: "14mm", bottom: "16mm", left: "15mm", right: "15mm" } });
await browser.close();
console.log("PDF:", resolve(salida));
