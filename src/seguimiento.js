// Cálculos del panel: onboarding, clientes sin novedades y embudo
import { PASOS, ETAPAS } from "./demo.js";

const dias = (desde, hoy) => Math.floor((new Date(hoy) - new Date(desde)) / 86400000);

export function pasoActual(cliente) {
  return PASOS.find((p) => !cliente.pasos[p.id]?.hecho)?.id ?? "completo";
}

export function avance(cliente) {
  return PASOS.filter((p) => cliente.pasos[p.id]?.hecho).length / PASOS.length;
}

export function sinNovedades(clientes, { dias: limite = 14, hoy = new Date() } = {}) {
  return clientes
    .filter((c) => pasoActual(c) !== "completo")
    .map((c) => ({ ...c, diasSinNovedad: dias(c.ultimaNovedad, hoy) }))
    .filter((c) => c.diasSinNovedad >= limite)
    .sort((a, b) => b.diasSinNovedad - a.diasSinNovedad);
}

export function embudo(pedidos) {
  return Object.entries(ETAPAS).map(([id, e]) => {
    const lista = pedidos.filter((p) => p.etapa === id);
    return { id, nombre: e.nombre, cantidad: lista.length, monto: lista.reduce((s, p) => s + p.monto, 0) };
  });
}

export function completarPaso(cliente, pasoId, hoy = new Date()) {
  if (!PASOS.some((p) => p.id === pasoId)) throw new Error(`Paso desconocido: ${pasoId}`);
  const fecha = new Date(hoy).toISOString().slice(0, 10);
  return { ...cliente, ultimaNovedad: fecha, pasos: { ...cliente.pasos, [pasoId]: { hecho: true, fecha } } };
}
