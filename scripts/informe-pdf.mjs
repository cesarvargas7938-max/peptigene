// Genera el informe PDF de una evaluación.
//   node scripts/informe-pdf.mjs <respuestas.json> <salida.pdf>
// Requiere Playwright (npm i -D playwright) y Chromium.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { evaluar, respuestasVacias } from "../lib/evaluacion.ts";
import { informeHtml } from "../lib/informe-html.ts";

const [entrada, salida] = process.argv.slice(2);
if (!entrada || !salida) {
  console.error("Uso: node scripts/informe-pdf.mjs <respuestas.json> <salida.pdf>");
  process.exit(1);
}
const r = { ...respuestasVacias, ...JSON.parse(readFileSync(resolve(entrada), "utf8")) };
const res = evaluar(r);
const html = informeHtml(r, res);

const { chromium } = await import("playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.pdf({
  path: resolve(salida),
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate:
    '<div style="width:100%;font-size:7.5pt;color:#047857;padding:0 14mm;display:flex;justify-content:space-between;font-family:system-ui"><span>Peptigene · Evaluación para tratamiento con péptidos</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>',
  margin: { top: "14mm", bottom: "16mm", left: "14mm", right: "14mm" },
});
await browser.close();
console.log(`Veredicto: ${res.veredicto} · PDF: ${resolve(salida)}`);
