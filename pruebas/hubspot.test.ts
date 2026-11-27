import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { crearCliente, contactoDesdeCliente, negocioDesdePedido, etapaDesdeHubspot, firmaValida } from "../src/hubspot.ts";
import { crearDemo } from "../src/demo.ts";
import type { Cliente, Pedido } from "../src/tipos.ts";

// Las pruebas usan objetos parciales (o inválidos a propósito): se castean al tipo del dominio
const comoPedido = (p: Partial<Pedido> | Record<string, unknown>) => p as Pedido;

const cliente = { id: "c1", nombre: "Lucía Ferreyra Paz", empresa: "Estudio Brisa", email: "lucia@ejemplo.com", telefono: "+54 9 383 4000000", hubspotId: null } as Cliente;

// Simula HubSpot y guarda cada llamada
interface Respuesta { status: number; body: unknown }
interface Llamada { url: string; metodo?: string; cuerpo: any; auth: string }
function falsoHubspot(respuestas: Respuesta[]) {
  const llamadas: Llamada[] = [];
  const fetchFn = (async (url: string, opts: { method?: string; body?: string; headers: Record<string, string> }) => {
    llamadas.push({ url, metodo: opts.method, cuerpo: opts.body && JSON.parse(opts.body), auth: opts.headers.Authorization });
    const r = respuestas.shift()!;
    return { ok: r.status < 400, status: r.status, json: async () => r.body, text: async () => JSON.stringify(r.body) };
  }) as unknown as typeof fetch;
  return { fetchFn, llamadas };
}

test("arma el contacto con nombre y apellido separados", () => {
  assert.deepEqual(contactoDesdeCliente(cliente), {
    email: "lucia@ejemplo.com", firstname: "Lucía", lastname: "Ferreyra Paz", phone: "+54 9 383 4000000", company: "Estudio Brisa",
  });
});

test("cada etapa del pedido va a una etapa del pipeline y vuelve", () => {
  const n = negocioDesdePedido(comoPedido({ producto: "Landing page", monto: 250000, etapa: "senado" }), cliente);
  assert.equal(n.dealstage, "contractsent");
  assert.equal(n.dealname, "Estudio Brisa · Landing page");
  assert.equal(etapaDesdeHubspot("contractsent"), "senado");
  assert.throws(() => negocioDesdePedido(comoPedido({ etapa: "rara" }), cliente), /Etapa desconocida/);
});

test("cliente nuevo: busca por email y, si no existe, lo crea", async () => {
  const { fetchFn, llamadas } = falsoHubspot([{ status: 404, body: {} }, { status: 201, body: { id: "901" } }]);
  const id = await crearCliente({ token: "t", fetchFn }).sincronizarCliente(cliente);
  assert.equal(id, "901");
  assert.match(llamadas[0].url, /contacts\/lucia%40ejemplo\.com\?idProperty=email$/);
  assert.equal(llamadas[1].metodo, "POST");
  assert.equal(llamadas[1].auth, "Bearer t");
});

test("cliente que ya estaba en HubSpot no se duplica", async () => {
  const { fetchFn, llamadas } = falsoHubspot([{ status: 200, body: { id: "555" } }]);
  assert.equal(await crearCliente({ token: "t", fetchFn }).sincronizarCliente(cliente), "555");
  assert.equal(llamadas.length, 1);
});

test("pedido nuevo crea el negocio asociado al contacto", async () => {
  const { fetchFn, llamadas } = falsoHubspot([{ status: 201, body: { id: "77" } }]);
  const id = await crearCliente({ token: "t", fetchFn }).sincronizarPedido(comoPedido({ producto: "Señalética", monto: 1000, etapa: "consulta" }), { ...cliente, hubspotId: "555" });
  assert.equal(id, "77");
  assert.equal(llamadas[0].cuerpo.associations[0].to.id, "555");
  assert.equal(llamadas[0].cuerpo.properties.dealstage, "appointmentscheduled");
});

test("no sincroniza un pedido si su cliente todavía no está en HubSpot", async () => {
  await assert.rejects(crearCliente({ token: "t", fetchFn: (async () => {}) as unknown as typeof fetch }).sincronizarPedido(comoPedido({ etapa: "consulta" }), cliente), /Primero/);
});

test("sin token funciona en modo simulado", async () => {
  const hs = crearCliente({});
  assert.equal(hs.simulado, true);
  assert.match(await hs.sincronizarCliente(cliente), /^sim-/);
});

test("firma v3 del webhook: acepta la buena y rechaza la vieja o alterada", () => {
  const ahora = 1_700_000_000_000, secreto = "s", url = "https://demo.onrender.com/webhooks/hubspot", cuerpo = "[]";
  const firma = crypto.createHmac("sha256", secreto).update("POST" + url + cuerpo + ahora).digest("base64");
  const base = { secreto, metodo: "POST", url, cuerpo, timestamp: String(ahora), firma, ahora };
  assert.equal(firmaValida(base), true);
  assert.equal(firmaValida({ ...base, cuerpo: "[1]" }), false);
  assert.equal(firmaValida({ ...base, ahora: ahora + 6 * 60 * 1000 }), false);
});

test("los datos de la demo son ficticios", () => {
  const { clientes } = crearDemo();
  assert.ok(clientes.every((c) => c.email.endsWith("@ejemplo.com")));
});
