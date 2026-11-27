// Sincronización con HubSpot (API REST v3). Sin token, todo se simula y queda en el registro.
import crypto from "node:crypto";
import { ETAPAS } from "./demo.js";

const API = "https://api.hubapi.com";
const CONTACTO_A_NEGOCIO = 3; // tipo de asociación definido por HubSpot (negocio → contacto)

export function contactoDesdeCliente(c) {
  const [firstname, ...resto] = c.nombre.split(" ");
  return { email: c.email, firstname, lastname: resto.join(" "), phone: c.telefono, company: c.empresa };
}

export function negocioDesdePedido(p, cliente) {
  const etapa = ETAPAS[p.etapa];
  if (!etapa) throw new Error(`Etapa desconocida: ${p.etapa}`);
  return {
    dealname: `${cliente.empresa} · ${p.producto}`,
    amount: String(p.monto),
    dealstage: etapa.hubspot,
    pipeline: "default",
  };
}

export function etapaDesdeHubspot(dealstage) {
  return Object.keys(ETAPAS).find((k) => ETAPAS[k].hubspot === dealstage) || null;
}

// fetchFn se inyecta para poder probar sin red
export function crearCliente({ token, fetchFn = fetch } = {}) {
  const simulado = !token;
  let n = 0;
  async function llamar(metodo, ruta, cuerpo) {
    if (simulado) return { id: `sim-${++n}`, simulado: true };
    const res = await fetchFn(API + ruta, {
      method: metodo,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
    return res.json();
  }

  // Alta o actualización por email: si ya existe en HubSpot no se duplica
  async function sincronizarCliente(c) {
    const properties = contactoDesdeCliente(c);
    if (c.hubspotId) return (await llamar("PATCH", `/crm/v3/objects/contacts/${c.hubspotId}`, { properties }))?.id ?? c.hubspotId;
    const existente = await llamar("PATCH", `/crm/v3/objects/contacts/${encodeURIComponent(c.email)}?idProperty=email`, { properties });
    if (existente) return existente.id;
    return (await llamar("POST", "/crm/v3/objects/contacts", { properties })).id;
  }

  async function sincronizarPedido(p, cliente) {
    if (!cliente.hubspotId) throw new Error("Primero hay que sincronizar el cliente");
    const properties = negocioDesdePedido(p, cliente);
    if (p.hubspotId) return (await llamar("PATCH", `/crm/v3/objects/deals/${p.hubspotId}`, { properties }))?.id ?? p.hubspotId;
    const cuerpo = {
      properties,
      associations: [{ to: { id: cliente.hubspotId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: CONTACTO_A_NEGOCIO }] }],
    };
    return (await llamar("POST", "/crm/v3/objects/deals", cuerpo)).id;
  }

  return { simulado, sincronizarCliente, sincronizarPedido };
}

// Firma v3 de los webhooks: HMAC-SHA256(método + URL + cuerpo + timestamp) en base64
export function firmaValida({ secreto, metodo, url, cuerpo, timestamp, firma, ahora = Date.now() }) {
  if (!secreto || !firma || !timestamp) return false;
  if (Math.abs(ahora - Number(timestamp)) > 5 * 60 * 1000) return false; // más de 5 minutos: se rechaza
  const esperada = crypto.createHmac("sha256", secreto).update(metodo + url + cuerpo + timestamp).digest("base64");
  const a = Buffer.from(esperada), b = Buffer.from(firma);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
