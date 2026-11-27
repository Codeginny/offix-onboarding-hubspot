// Offix — interfaz de la demo

// Lo que devuelve /api/estado (ver server.ts)
interface Paso { id: string; nombre: string; detalle: string }
interface ClienteVista {
  id: string; nombre: string; empresa: string; email: string; hubspotId: string | null;
  pasos: Record<string, { hecho: boolean; fecha: string | null }>;
  pasoActual: string; avance: number; pedidos: PedidoVista[];
}
interface PedidoVista { id: string; clienteId: string; producto: string; monto: number; etapa: string; hubspotId: string | null }
interface Datos {
  hubspot: "conectado" | "simulado";
  pasos: Paso[];
  etapas: Record<string, { nombre: string }>;
  clientes: ClienteVista[];
  sinNovedades: { id: string; nombre: string; empresa: string; dias: number; paso: string }[];
  embudo: { id: string; nombre: string; cantidad: number; monto: number }[];
  registro: { fecha: string; texto: string }[];
}
type Vista = "panel" | "clientes" | "pedidos" | "hubspot";

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const pesos = (n: number) => "$ " + n.toLocaleString("es-AR");
const fecha = (f: string | null) => (f ? new Date(f + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" }) : "");
let datos: Datos, vista: Vista = "panel", limite = 14;

async function api(ruta: string, opciones: RequestInit = {}) {
  const res = await fetch(ruta, { headers: { "Content-Type": "application/json" }, ...opciones });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error);
  return j;
}
async function cargar() { datos = await api(`/api/estado?dias=${limite}`); pintar(); }

function pintar() {
  const hs = $("#estado-hs");
  hs.textContent = datos.hubspot === "conectado" ? "● HubSpot conectado" : "○ HubSpot simulado";
  hs.className = "pildora " + (datos.hubspot === "conectado" ? "ok" : "");
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("activa", (b as HTMLElement).dataset.vista === vista));
  $("#vista").innerHTML = VISTAS[vista]();
}

const VISTAS: Record<Vista, () => string> = {
  panel() {
    const activos = datos.clientes.filter((c) => c.pasoActual !== "completo").length;
    const ganado = datos.embudo.find((e) => e.id === "entregado") ?? { monto: 0 };
    const max = Math.max(...datos.embudo.map((e) => e.cantidad), 1);
    return `
    <div class="titulo"><div><h2>Panel de seguimiento</h2><p>Quién necesita un llamado hoy y cómo viene el embudo.</p></div>
      <label>Sin novedades desde<select id="limite">${[7, 14, 30].map((d) => `<option ${d === limite ? "selected" : ""} value="${d}">${d} días</option>`).join("")}</select></label></div>
    <div class="kpis">
      <div class="card kpi"><div class="num">${datos.clientes.length}</div><small>clientes</small></div>
      <div class="card kpi"><div class="num">${activos}</div><small>en onboarding</small></div>
      <div class="card kpi"><div class="num acento">${datos.sinNovedades.length}</div><small>sin novedades hace ${limite}+ días</small></div>
      <div class="card kpi"><div class="num">${pesos(ganado.monto / 1000)}k</div><small>entregado</small></div>
    </div>
    <div class="grid">
      <div class="card"><h3>Para llamar hoy</h3>
        ${datos.sinNovedades.map((c) => `<div class="fila"><div class="crece"><b>${c.nombre}</b><small>${c.empresa} · ${nombrePaso(c.paso)}</small></div><span class="dias">${c.dias}</span><small>días</small></div>`).join("") || `<p class="nota">Nadie se está enfriando. 🎉</p>`}
      </div>
      <div class="card embudo"><h3>Pedidos por etapa</h3>
        ${datos.embudo.map((e) => `<div class="etapa ${e.id === "perdido" ? "perdido" : ""}"><span>${e.nombre}</span><div class="barra-e"><span style="width:${(e.cantidad / max) * 100}%"></span></div><span class="monto">${e.cantidad} · ${pesos(e.monto / 1000)}k</span></div>`).join("")}
      </div>
    </div>`;
  },
  clientes() {
    return `
    <div class="titulo"><div><h2>Onboarding de clientes</h2><p>Cuatro pasos por cliente, con la fecha en que se cumplió cada uno.</p></div>
      <button class="btn" id="btn-nuevo">+ Cliente nuevo</button></div>
    <div class="grid">${datos.clientes.map((c) => `
      <article class="card cliente">
        <div class="cab"><div><h3>${c.nombre}</h3><small>${c.empresa} · ${c.email}</small></div>
          <div class="anillo" style="--p:${c.avance * 100}" data-t="${Math.round(c.avance * 4)}/4"></div></div>
        <ul class="check">${datos.pasos.map((p) => {
          const s = c.pasos[p.id], actual = c.pasoActual === p.id;
          return `<li class="${s.hecho ? "hecho" : ""}" title="${p.detalle}"><span class="marca-p"></span><span class="${actual ? "actual" : ""}">${p.nombre}</span>
            ${s.hecho ? `<small>${fecha(s.fecha)}</small>` : actual ? `<button class="btn chico" data-paso="${p.id}" data-cliente="${c.id}">Marcar hecho</button>` : ""}</li>`;
        }).join("")}</ul>
        <p class="nota">${c.hubspotId ? `Contacto HubSpot <span class="pildora acento">${c.hubspotId}</span>` : "Todavía sin sincronizar"}</p>
      </article>`).join("")}</div>`;
  },
  pedidos() {
    const nombre = (id: string) => datos.clientes.find((c) => c.id === id)?.empresa;
    return `
    <div class="titulo"><div><h2>Pedidos</h2><p>Al cambiar la etapa se actualiza el negocio en HubSpot.</p></div></div>
    <div class="card tabla-scroll"><table><thead><tr><th>Cliente</th><th>Producto</th><th>Monto</th><th>Etapa</th><th>HubSpot</th></tr></thead><tbody>
    ${datos.clientes.flatMap((c) => c.pedidos).map((p) => `<tr><td>${nombre(p.clienteId)}</td><td>${p.producto}</td><td>${pesos(p.monto)}</td>
      <td><select data-pedido="${p.id}">${Object.entries(datos.etapas).map(([id, e]) => `<option value="${id}" ${id === p.etapa ? "selected" : ""}>${e.nombre}</option>`).join("")}</select></td>
      <td>${p.hubspotId ? `<span class="pildora acento">${p.hubspotId}</span>` : "—"}</td></tr>`).join("")}
    </tbody></table></div>`;
  },
  hubspot() {
    return `
    <div class="titulo"><div><h2>Conexión con HubSpot</h2><p>${datos.hubspot === "conectado" ? "Usando el token de la app privada." : "Sin token: la sincronización se simula. Poné HUBSPOT_TOKEN en .env para usar la cuenta de prueba."}</p></div>
      <div style="display:flex;gap:8px"><button class="btn sec" id="btn-reiniciar">Reiniciar demo</button><button class="btn" id="btn-sync">Sincronizar todo</button></div></div>
    <div class="grid">
      <div class="card"><h3>Qué se envía</h3>
        <div class="fila"><div class="crece"><b>Cliente → Contacto</b><small>email, nombre, apellido, teléfono y empresa. Se busca por email para no duplicar.</small></div></div>
        <div class="fila"><div class="crece"><b>Pedido → Negocio</b><small>nombre, monto y etapa del pipeline, asociado al contacto.</small></div></div>
        <div class="fila"><div class="crece"><b>HubSpot → Offix</b><small>webhook firmado: si movés un negocio en HubSpot, cambia acá.</small></div></div>
      </div>
      <div class="card"><h3>Registro</h3><ul class="registro">${datos.registro.map((r) => `<li>${r.texto}<small class="nota"> · ${new Date(r.fecha).toLocaleString("es-AR")}</small></li>`).join("") || `<li class="nota">Todavía no hubo sincronizaciones.</li>`}</ul></div>
    </div>`;
  },
};
const nombrePaso = (id: string) => datos.pasos.find((p) => p.id === id)?.nombre ?? "Completo";

$("#entrar").onclick = () => { $("#bienvenida").hidden = true; $("#app").hidden = false; cargar(); };
$(".tabs").onclick = (e) => { const b = (e.target as Element).closest("button"); if (b) { vista = b.dataset.vista as Vista; pintar(); } };
$("#vista").addEventListener("click", async (e) => {
  const t = e.target as HTMLButtonElement;
  if (t.dataset.paso) { await api(`/api/clientes/${t.dataset.cliente}/pasos/${t.dataset.paso}`, { method: "POST" }); cargar(); }
  if (t.id === "btn-nuevo") $<HTMLDialogElement>("#nuevo").showModal();
  if (t.id === "btn-sync") { t.disabled = true; await api("/api/sincronizar", { method: "POST" }); cargar(); }
  if (t.id === "btn-reiniciar") { await api("/api/reiniciar", { method: "POST" }); cargar(); }
});
$("#vista").addEventListener("change", async (e) => {
  const t = e.target as HTMLSelectElement;
  if (t.id === "limite") { limite = Number(t.value); cargar(); }
  if (t.dataset.pedido) { await api(`/api/pedidos/${t.dataset.pedido}`, { method: "PATCH", body: JSON.stringify({ etapa: t.value }) }); cargar(); }
});
$("#nuevo").addEventListener("close", async () => {
  const d = $<HTMLDialogElement>("#nuevo");
  if (d.returnValue !== "ok") return $<HTMLFormElement>("#form-nuevo").reset();
  const datosForm = Object.fromEntries(new FormData($<HTMLFormElement>("#form-nuevo")));
  $<HTMLFormElement>("#form-nuevo").reset();
  try { await api("/api/clientes", { method: "POST", body: JSON.stringify(datosForm) }); vista = "clientes"; cargar(); } catch (err) { alert((err as Error).message); }
});
