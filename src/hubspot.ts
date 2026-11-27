// Sincronización con HubSpot (API REST v3). Sin token, todo se simula y queda en el registro.
import crypto from "node:crypto";
import { ETAPAS } from "./demo.ts";
import type { Cliente, EtapaId, Pedido } from "./tipos.ts";

type FetchFn = typeof fetch;
interface RespuestaHubspot { id: string; simulado?: boolean }
export interface ClienteHubspot {
  simulado: boolean;
  sincronizarCliente(c: Cliente): Promise<string>;
  sincronizarPedido(p: Pedido, cliente: Cliente): Promise<string>;
}

const API = "https://api.hubapi.com";
const CONTACTO_A_NEGOCIO = 3; // tipo de asociación definido por HubSpot (negocio → contacto)

export function contactoDesdeCliente(c: Cliente) {
  const [firstname, ...resto] = c.nombre.split(" ");
  return { email: c.email, firstname, lastname: resto.join(" "), phone: c.telefono, company: c.empresa };
}

export function negocioDesdePedido(p: Pedido, cliente: Cliente) {
  const etapa = ETAPAS[p.etapa];
  if (!etapa) throw new Error(`Etapa desconocida: ${p.etapa}`);
  return {
    dealname: `${cliente.empresa} · ${p.producto}`,
    amount: String(p.monto),
    dealstage: etapa.hubspot,
    pipeline: "default",
  };
}

export function etapaDesdeHubspot(dealstage: string): EtapaId | null {
  return (Object.keys(ETAPAS) as EtapaId[]).find((k) => ETAPAS[k].hubspot === dealstage) || null;
}

// fetchFn se inyecta para poder probar sin red
export function crearCliente({ token, fetchFn = fetch }: { token?: string; fetchFn?: FetchFn } = {}): ClienteHubspot {
  const simulado = !token;
  let n = 0;
  async function llamar(metodo: string, ruta: string, cuerpo?: unknown): Promise<RespuestaHubspot | null> {
    if (simulado) return { id: `sim-${++n}`, simulado: true };
    const res = await fetchFn(API + ruta, {
      method: metodo,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
    return (await res.json()) as RespuestaHubspot;
  }

  // Alta o actualización por email: si ya existe en HubSpot no se duplica
  async function sincronizarCliente(c: Cliente): Promise<string> {
    const properties = contactoDesdeCliente(c);
    if (c.hubspotId) return (await llamar("PATCH", `/crm/v3/objects/contacts/${c.hubspotId}`, { properties }))?.id ?? c.hubspotId;
    const existente = await llamar("PATCH", `/crm/v3/objects/contacts/${encodeURIComponent(c.email)}?idProperty=email`, { properties });
    if (existente) return existente.id;
    return (await llamar("POST", "/crm/v3/objects/contacts", { properties }))!.id;
  }

  async function sincronizarPedido(p: Pedido, cliente: Cliente): Promise<string> {
    if (!cliente.hubspotId) throw new Error("Primero hay que sincronizar el cliente");
    const properties = negocioDesdePedido(p, cliente);
    if (p.hubspotId) return (await llamar("PATCH", `/crm/v3/objects/deals/${p.hubspotId}`, { properties }))?.id ?? p.hubspotId;
    const cuerpo = {
      properties,
      associations: [{ to: { id: cliente.hubspotId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: CONTACTO_A_NEGOCIO }] }],
    };
    return (await llamar("POST", "/crm/v3/objects/deals", cuerpo))!.id;
  }

  return { simulado, sincronizarCliente, sincronizarPedido };
}

// Firma v3 de los webhooks: HMAC-SHA256(método + URL + cuerpo + timestamp) en base64
interface DatosFirma {
  secreto?: string; metodo: string; url: string; cuerpo: string;
  timestamp?: string | string[]; firma?: string | string[]; ahora?: number;
}

export function firmaValida({ secreto, metodo, url, cuerpo, timestamp, firma, ahora = Date.now() }: DatosFirma): boolean {
  if (Array.isArray(timestamp) || Array.isArray(firma)) return false;
  if (!secreto || !firma || !timestamp) return false;
  if (Math.abs(ahora - Number(timestamp)) > 5 * 60 * 1000) return false; // más de 5 minutos: se rechaza
  const esperada = crypto.createHmac("sha256", secreto).update(metodo + url + cuerpo + timestamp).digest("base64");
  const a = Buffer.from(esperada), b = Buffer.from(firma);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
