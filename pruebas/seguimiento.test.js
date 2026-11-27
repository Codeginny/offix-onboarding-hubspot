import test from "node:test";
import assert from "node:assert/strict";
import { pasoActual, avance, sinNovedades, embudo, completarPaso } from "../src/seguimiento.js";
import { crearDemo } from "../src/demo.js";

const vacio = { relevamiento: { hecho: false }, propuesta: { hecho: false }, entrega: { hecho: false }, seguimiento: { hecho: false } };

test("el paso actual es el primero sin hacer", () => {
  const c = completarPaso({ pasos: vacio }, "relevamiento", "2026-11-01");
  assert.equal(pasoActual(c), "propuesta");
  assert.equal(avance(c), 0.25);
  assert.equal(c.ultimaNovedad, "2026-11-01");
});

test("lista los clientes sin novedades, del más frío al más reciente", () => {
  const lista = [
    { id: "a", pasos: vacio, ultimaNovedad: "2026-11-20" },
    { id: "b", pasos: vacio, ultimaNovedad: "2026-10-01" },
    { id: "c", pasos: vacio, ultimaNovedad: "2026-11-01" },
  ];
  const r = sinNovedades(lista, { dias: 14, hoy: "2026-11-24" });
  assert.deepEqual(r.map((c) => c.id), ["b", "c"]);
  assert.equal(r[0].diasSinNovedad, 54);
});

test("un cliente con el onboarding completo no aparece como sin novedades", () => {
  const hecho = Object.fromEntries(Object.keys(vacio).map((k) => [k, { hecho: true }]));
  assert.equal(sinNovedades([{ pasos: hecho, ultimaNovedad: "2020-01-01" }], { hoy: "2026-11-24" }).length, 0);
});

test("el embudo suma todos los pedidos", () => {
  const { pedidos } = crearDemo();
  const e = embudo(pedidos);
  assert.equal(e.reduce((s, x) => s + x.cantidad, 0), pedidos.length);
  assert.throws(() => completarPaso({ pasos: vacio }, "otro"), /Paso desconocido/);
});
