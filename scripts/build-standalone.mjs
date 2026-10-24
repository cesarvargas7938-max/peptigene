// Construye el evaluador como archivo HTML único (funciona sin servidor) y
// como fragmento para publicar en claude.ai.
//   node scripts/build-standalone.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

mkdirSync("dist", { recursive: true });
execSync("npx esbuild standalone/entry.ts --bundle --format=iife --global-name=Peptigene --target=es2020 --minify --outfile=dist/engine.js", { stdio: "inherit" });
const engine = readFileSync("dist/engine.js", "utf8");
const plantilla = readFileSync("standalone/plantilla.html", "utf8");

const con = (printOk) => plantilla.replace("/*__ENGINE__*/", () => engine).replace("/*__PRINT_OK__*/false", String(printOk));

writeFileSync(
  "dist/peptigene-evaluacion.html",
  `<!doctype html>\n<html lang="es-CO">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${con(true)}\n</body>\n</html>\n`.replace("<div class=\"wrap\">", "</head>\n<body>\n<div class=\"wrap\">"),
);
writeFileSync("dist/artifact.html", con(false));
console.log("dist/peptigene-evaluacion.html y dist/artifact.html generados");
