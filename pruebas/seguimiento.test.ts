import test from "node:test";
import assert from "node:assert/strict";
import { pasoActual, avance, sinNovedades, embudo, completarPaso } from "../src/seguimiento.ts";
import { crearDemo } from "../src/demo.ts";
import type { Cliente, EstadoPaso } from "../src/tipos.ts";

// Clientes parciales: a estas funciones sólo les importan los pasos y la última novedad
const comoCliente = (c: Partial<Cliente>) => c as Cliente;

const vacio: Record<string, EstadoPaso> = { relevamiento: { hecho: false, fecha: null }, propuesta: { hecho: false, fecha: null }, entrega: { hecho: false, fecha: null }, seguimiento: { hecho: false, fecha: null } };

test("el paso actual es el primero sin hacer", () => {
  const c = completarPaso(comoCliente({ pasos: vacio }), "relevamiento", "2026-11-01");
  assert.equal(pasoActual(c), "propuesta");
  assert.equal(avance(c), 0.25);
  assert.equal(c.ultimaNovedad, "2026-11-01");
});

test("lista los clientes sin novedades, del más frío al más reciente", () => {
  const lista = [
    comoCliente({ id: "a", pasos: vacio, ultimaNovedad: "2026-11-20" }),
    comoCliente({ id: "b", pasos: vacio, ultimaNovedad: "2026-10-01" }),
    comoCliente({ id: "c", pasos: vacio, ultimaNovedad: "2026-11-01" }),
  ];
  const r = sinNovedades(lista, { dias: 14, hoy: "2026-11-24" });
  assert.deepEqual(r.map((c) => c.id), ["b", "c"]);
  assert.equal(r[0].diasSinNovedad, 54);
});

test("un cliente con el onboarding completo no aparece como sin novedades", () => {
  const hecho = Object.fromEntries(Object.keys(vacio).map((k) => [k, { hecho: true, fecha: "2020-01-01" }]));
  assert.equal(sinNovedades([comoCliente({ pasos: hecho, ultimaNovedad: "2020-01-01" })], { hoy: "2026-11-24" }).length, 0);
});

test("el embudo suma todos los pedidos", () => {
  const { pedidos } = crearDemo();
  const e = embudo(pedidos);
  assert.equal(e.reduce((s, x) => s + x.cantidad, 0), pedidos.length);
  assert.throws(() => completarPaso(comoCliente({ pasos: vacio }), "otro" as never), /Paso desconocido/);
});
