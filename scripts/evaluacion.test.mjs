// Pruebas del motor de evaluación. Ejecutar con: npm test
// (Node 22.18+ ejecuta TypeScript directamente.)
import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluar, parsearPerfil, respuestasVacias, calcularImc, tfgCkdEpi2021 } from "../lib/evaluacion.ts";

// Persona sin ningún problema: todo contestado, IMC 33, sin comorbilidades.
const base = {
  ...respuestasVacias,
  nombre: "Prueba",
  tratamiento: "tirzepatida",
  edad: 40,
  sexo: "masculino",
  pesoKg: 100,
  estaturaCm: 175,
  pesoIdealKg: 80,
  alergiasMedicamentos: "no",
  pancreatitisFamiliar: "no",
  pancreatitisPersonal: "no",
  dolorAbdominalInexplicado: "no",
  tiroidesCmtMen2: "no",
  vesicula: "no",
  enfermedadGiGrave: "no",
  diabetesTipo1: "no",
  ejercicio: "regular",
};

const codigos = (res) => res.hallazgos.map((h) => h.codigo);

test("IMC", () => {
  assert.equal(calcularImc(100, 175), 32.7);
  assert.equal(calcularImc(null, 175), null);
});

test("persona sin contraindicaciones es APTA con 2.5 mg", () => {
  const res = evaluar(base);
  assert.equal(res.veredicto, "APTO");
  assert.equal(res.plan.dosisInicialMg, 2.5);
  assert.equal(res.plan.dosisMaximaMg, 15);
  assert.ok(codigos(res).includes("INFO_CUMPLE_INDICACION"));
  assert.ok(res.resumen.includes("2.5 mg"));
});

test("retatrutida se evalúa con las mismas reglas que tirzepatida", () => {
  const res = evaluar({ ...base, tratamiento: "retatrutida" });
  assert.equal(res.veredicto, "APTO");
  assert.equal(res.plan.dosisInicialMg, 2.5);
  assert.equal(res.plan.dosisMaximaMg, 12);
  assert.ok(res.resumen.includes("retatrutida"));
});

test("contraindicaciones absolutas producen NO_APTO sin plan", () => {
  const casos = [
    [{ tiroidesCmtMen2: "si" }, "CI_CMT_MEN2"],
    [{ edad: 16 }, "CI_MENOR_EDAD"],
    [{ sexo: "femenino", embarazoLactancia: "si" }, "CI_EMBARAZO"],
    [{ pancreatitisPersonal: "si" }, "CI_PANCREATITIS"],
    [{ enfermedadGiGrave: "si" }, "CI_GI_GRAVE"],
    [{ alergiasMedicamentos: "si", alergiasDetalle: "Ozempic (semaglutida)" }, "CI_HIPERSENSIBILIDAD"],
    [{ comorbilidades: ["trastorno_alimentario"] }, "CI_TCA"],
    [{ pesoKg: 70 }, "CI_SIN_INDICACION"],
    [{ perfilMetabolico: "Lipasa 250 U/L" }, "CI_ENZIMAS_PANCREATICAS"],
    [{ perfilMetabolico: "Calcitonina 25 pg/mL" }, "CI_CALCITONINA"],
  ];
  for (const [cambio, codigo] of casos) {
    const res = evaluar({ ...base, ...cambio });
    assert.equal(res.veredicto, "NO_APTO", codigo);
    assert.ok(codigos(res).includes(codigo), codigo);
    assert.equal(res.plan, null, codigo);
  }
});

test("alergia a otro medicamento no contraindica", () => {
  const res = evaluar({ ...base, alergiasMedicamentos: "si", alergiasDetalle: "Penicilina" });
  assert.equal(res.veredicto, "APTO");
  assert.ok(codigos(res).includes("INFO_ALERGIAS"));
});

test("precauciones producen REQUIERE_EVALUACION con plan condicionado", () => {
  const casos = [
    [{ diabetesTipo1: "si" }, "PR_DM1"],
    [{ pancreatitisFamiliar: "si" }, "PR_PANCREATITIS_FAMILIAR"],
    [{ dolorAbdominalInexplicado: "si" }, "PR_DOLOR_ABDOMINAL"],
    [{ vesicula: "si", vesiculaDetalle: "cálculos hace 2 años" }, "PR_VESICULA"],
    [{ edad: 78 }, "PR_EDAD_AVANZADA"],
    [{ comorbilidades: ["renal"] }, "PR_RENAL"],
    [{ medicamentos: "Insulina glargina 20 UI noche" }, "MED_INSULINA"],
    [{ medicamentos: "Glibenclamida 5 mg" }, "MED_SULFONILUREA"],
    [{ medicamentos: "Ozempic 0.5 mg semanal" }, "MED_GLP1_ACTUAL"],
    [{ medicamentos: "Warfarina 5 mg" }, "MED_ANTICOAGULANTE"],
    [{ perfilMetabolico: "TSH 8.2" }, "PR_TSH"],
    [{ perfilMetabolico: "Triglicéridos 620" }, "PR_TG_SEVEROS"],
    [{ perfilMetabolico: "ALT 150, AST 130" }, "PR_TRANSAMINASAS"],
    [{ perfilMetabolico: "HbA1c 7.1" }, "PR_DIABETES_NO_DIAGNOSTICADA"],
    [{ pesoIdealKg: 50 }, "PR_META_BAJO_PESO"],
  ];
  for (const [cambio, codigo] of casos) {
    const res = evaluar({ ...base, ...cambio });
    assert.equal(res.veredicto, "REQUIERE_EVALUACION", codigo);
    assert.ok(codigos(res).includes(codigo), codigo);
    assert.ok(res.plan, codigo);
    assert.ok(res.plan.notas[0].startsWith("Plan condicionado"), codigo);
  }
});

test("vesícula operada queda como información, no precaución", () => {
  const res = evaluar({ ...base, vesicula: "si", vesiculaDetalle: "Me operaron, colecistectomía 2019" });
  assert.equal(res.veredicto, "APTO");
  assert.ok(codigos(res).includes("INFO_COLECISTECTOMIA"));
});

test("formulario incompleto nunca es APTO", () => {
  const res = evaluar({ ...base, tiroidesCmtMen2: "" });
  assert.equal(res.veredicto, "REQUIERE_EVALUACION");
  assert.ok(res.camposFaltantes.includes("antecedente de cáncer medular de tiroides / MEN2"));
});

test("IMC 27-29.9 requiere comorbilidad", () => {
  const sin = evaluar({ ...base, pesoKg: 86 }); // IMC 28.1
  assert.equal(sin.veredicto, "REQUIERE_EVALUACION");
  assert.ok(codigos(sin).includes("PR_IMC_SIN_COMORBILIDAD"));

  const conCheckbox = evaluar({ ...base, pesoKg: 86, comorbilidades: ["hipertension"] });
  assert.equal(conCheckbox.veredicto, "APTO");

  const conLab = evaluar({ ...base, pesoKg: 86, perfilMetabolico: "Glucosa 112 mg/dL" });
  assert.equal(conLab.veredicto, "APTO");
  assert.ok(codigos(conLab).includes("INFO_PREDIABETES"));
});

test("IMC 25-26.9 queda como límite", () => {
  const res = evaluar({ ...base, pesoKg: 80 }); // IMC 26.1
  assert.ok(codigos(res).includes("PR_IMC_LIMITE"));
  assert.equal(res.veredicto, "REQUIERE_EVALUACION");
});

test("parser de perfil metabólico", () => {
  const texto =
    "Glucosa: 108 mg/dL\nHbA1c 6,0 %\nInsulina 22 µU/mL\nColesterol total 215; Colesterol LDL 138, HDL 42\nTriglicéridos 190\nTSH 2.3 | Creatinina 0.8\nVitamina D 25-OH 18 ng/mL\nLipasa 41";
  const labs = parsearPerfil(texto, { ...base, sexo: "femenino", edad: 38 });
  const v = Object.fromEntries(labs.map((l) => [l.clave, l]));
  assert.equal(v.glucosa.valor, 108);
  assert.equal(v.glucosa.estado, "alto");
  assert.equal(v.hba1c.valor, 6.0);
  assert.equal(v.insulina.valor, 22);
  assert.equal(v.colesterol_total.valor, 215);
  assert.equal(v.ldl.valor, 138);
  assert.equal(v.hdl.valor, 42);
  assert.ok(v.hdl.comentario, "HDL bajo para mujer");
  assert.equal(v.trigliceridos.valor, 190);
  assert.equal(v.tsh.estado, "normal");
  assert.equal(v.creatinina.valor, 0.8);
  assert.equal(v.vitamina_d.valor, 18);
  assert.equal(v.vitamina_d.estado, "bajo");
  assert.equal(v.lipasa.estado, "normal");
  assert.ok(v.homa_ir.valor > 5, "HOMA-IR calculado");
  assert.equal(v.homa_ir.estado, "alto");
  assert.ok(v.tfg, "TFG estimada a partir de creatinina");
  assert.equal(v.tfg.estado, "normal");
});

test("TFG CKD-EPI 2021", () => {
  // Mujer 38 años, creatinina 0.8 → ~96; hombre 70 años, creatinina 1.8 → ~40.
  assert.ok(Math.abs(tfgCkdEpi2021(0.8, 38, "femenino") - 96) <= 3);
  assert.ok(Math.abs(tfgCkdEpi2021(1.8, 70, "masculino") - 40) <= 3);
});

test("ejemplo completo con perfil metabólico alterado es APTO con comorbilidades por laboratorio", () => {
  const res = evaluar({
    ...base,
    sexo: "femenino",
    edad: 38,
    pesoKg: 92,
    estaturaCm: 162,
    embarazoLactancia: "no",
    medicamentos: "Metformina 850 mg cada 12 horas",
    perfilMetabolico: "Glucosa 108\nHbA1c 6.0\nLDL 138\nHDL 42\nTriglicéridos 190\nTSH 2.3\nLipasa 41",
  });
  assert.equal(res.veredicto, "APTO");
  const c = codigos(res);
  assert.ok(c.includes("MED_METFORMINA"));
  assert.ok(c.includes("INFO_PREDIABETES"));
  assert.ok(c.includes("INFO_DISLIPIDEMIA"));
  assert.ok(c.includes("INFO_ANTICONCEPCION"));
});
