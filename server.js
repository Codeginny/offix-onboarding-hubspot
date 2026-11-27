// Offix — servidor HTTP propio (sin dependencias)
// Sirve la demo (public/), guarda el estado en data/estado.json y sincroniza con HubSpot.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crearDemo, PASOS, ETAPAS } from "./src/demo.js";
import { crearCliente, etapaDesdeHubspot, firmaValida } from "./src/hubspot.js";
import { sinNovedades, embudo, completarPaso, pasoActual, avance } from "./src/seguimiento.js";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.join(aqui, ".env");
if (fs.existsSync(envFile)) {
  for (const linea of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const PORT = Number(process.env.PORT || 5180);
const ARCHIVO = path.join(aqui, "data", "estado.json");
const hubspot = crearCliente({ token: process.env.HUBSPOT_TOKEN });

let estado = fs.existsSync(ARCHIVO) ? JSON.parse(fs.readFileSync(ARCHIVO, "utf8")) : crearDemo();
const guardar = () => { fs.mkdirSync(path.dirname(ARCHIVO), { recursive: true }); fs.writeFileSync(ARCHIVO, JSON.stringify(estado, null, 2)); };
const anotar = (texto) => { estado.registro.unshift({ fecha: new Date().toISOString(), texto }); estado.registro = estado.registro.slice(0, 50); };

async function sincronizarTodo() {
  let c = 0, n = 0;
  for (const cl of estado.clientes) { cl.hubspotId = await hubspot.sincronizarCliente(cl); c++; }
  for (const p of estado.pedidos) {
    const cl = estado.clientes.find((x) => x.id === p.clienteId);
    p.hubspotId = await hubspot.sincronizarPedido(p, cl); n++;
  }
  anotar(`${hubspot.simulado ? "Simulado: " : ""}${c} contactos y ${n} negocios sincronizados con HubSpot`);
  guardar();
}

const vistaCliente = (c) => ({ ...c, pasoActual: pasoActual(c), avance: avance(c), pedidos: estado.pedidos.filter((p) => p.clienteId === c.id) });

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml", ".json": "application/json", ".webmanifest": "application/manifest+json" };

const json = (res, codigo, datos) => { res.writeHead(codigo, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(datos)); };
const leerCuerpo = (req) => new Promise((ok) => { let b = ""; req.on("data", (d) => (b += d)); req.on("end", () => ok(b)); });

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === "/api/estado" && req.method === "GET") {
      const dias = Number(url.searchParams.get("dias") || 14);
      return json(res, 200, {
        hubspot: hubspot.simulado ? "simulado" : "conectado",
        pasos: PASOS, etapas: ETAPAS,
        clientes: estado.clientes.map(vistaCliente),
        sinNovedades: sinNovedades(estado.clientes, { dias }).map((c) => ({ id: c.id, nombre: c.nombre, empresa: c.empresa, dias: c.diasSinNovedad, paso: pasoActual(c) })),
        embudo: embudo(estado.pedidos),
        registro: estado.registro,
      });
    }
    if (url.pathname === "/api/clientes" && req.method === "POST") {
      const d = JSON.parse(await leerCuerpo(req));
      if (!d.nombre || !d.email || !d.empresa) return json(res, 400, { error: "Faltan nombre, email o empresa" });
      const hoy = new Date().toISOString().slice(0, 10);
      const cl = { id: `c${Date.now().toString(36)}`, nombre: d.nombre, empresa: d.empresa, email: d.email, telefono: d.telefono || "",
        alta: hoy, ultimaNovedad: hoy, pasos: Object.fromEntries(PASOS.map((p) => [p.id, { hecho: false, fecha: null }])), hubspotId: null };
      cl.hubspotId = await hubspot.sincronizarCliente(cl);
      estado.clientes.push(cl);
      anotar(`Cliente nuevo ${cl.nombre} → contacto ${cl.hubspotId} en HubSpot`);
      guardar();
      return json(res, 201, vistaCliente(cl));
    }
    let m = url.pathname.match(/^\/api\/clientes\/([\w-]+)\/pasos\/(\w+)$/);
    if (m && req.method === "POST") {
      const i = estado.clientes.findIndex((c) => c.id === m[1]);
      if (i < 0) return json(res, 404, { error: "Cliente no encontrado" });
      estado.clientes[i] = completarPaso(estado.clientes[i], m[2]);
      anotar(`${estado.clientes[i].nombre}: paso «${PASOS.find((p) => p.id === m[2]).nombre}» completo`);
      guardar();
      return json(res, 200, vistaCliente(estado.clientes[i]));
    }
    m = url.pathname.match(/^\/api\/pedidos\/([\w-]+)$/);
    if (m && req.method === "PATCH") {
      const p = estado.pedidos.find((x) => x.id === m[1]);
      const { etapa } = JSON.parse(await leerCuerpo(req));
      if (!p || !ETAPAS[etapa]) return json(res, 400, { error: "Pedido o etapa inválidos" });
      p.etapa = etapa;
      const cl = estado.clientes.find((x) => x.id === p.clienteId);
      if (!cl.hubspotId) cl.hubspotId = await hubspot.sincronizarCliente(cl);
      p.hubspotId = await hubspot.sincronizarPedido(p, cl);
      anotar(`${cl.empresa} · ${p.producto} pasó a «${ETAPAS[etapa].nombre}» (negocio ${p.hubspotId})`);
      guardar();
      return json(res, 200, p);
    }
    if (url.pathname === "/api/sincronizar" && req.method === "POST") { await sincronizarTodo(); return json(res, 200, { ok: true }); }
    if (url.pathname === "/api/reiniciar" && req.method === "POST") { estado = crearDemo(); guardar(); return json(res, 200, { ok: true }); }

    // Webhook: un cambio de etapa hecho en HubSpot vuelve a la demo
    if (url.pathname === "/webhooks/hubspot" && req.method === "POST") {
      const cuerpo = await leerCuerpo(req);
      const publica = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}${req.url}`;
      const ok = firmaValida({ secreto: process.env.HUBSPOT_CLIENT_SECRET, metodo: "POST", url: publica, cuerpo,
        timestamp: req.headers["x-hubspot-request-timestamp"], firma: req.headers["x-hubspot-signature-v3"] });
      if (!ok) return json(res, 401, { error: "Firma inválida" });
      for (const ev of JSON.parse(cuerpo)) {
        if (ev.subscriptionType !== "deal.propertyChange" || ev.propertyName !== "dealstage") continue;
        const p = estado.pedidos.find((x) => x.hubspotId === String(ev.objectId));
        const etapa = etapaDesdeHubspot(ev.propertyValue);
        if (p && etapa) { p.etapa = etapa; anotar(`Desde HubSpot: negocio ${p.hubspotId} → «${ETAPAS[etapa].nombre}»`); }
      }
      guardar();
      return json(res, 200, { ok: true });
    }

    const archivo = path.join(aqui, "public", url.pathname === "/" ? "index.html" : url.pathname);
    if (!archivo.startsWith(path.join(aqui, "public")) || !fs.existsSync(archivo)) { res.writeHead(404); return res.end("No encontrado"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(archivo)] || "application/octet-stream" });
    fs.createReadStream(archivo).pipe(res);
  } catch (e) {
    console.error(e);
    json(res, 500, { error: e.message });
  }
});

servidor.listen(PORT, () => console.log(`Offix en http://localhost:${PORT} · HubSpot ${hubspot.simulado ? "simulado (sin token)" : "conectado"}`));
