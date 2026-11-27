// Cálculos del panel: onboarding, clientes sin novedades y embudo
import { PASOS, ETAPAS } from "./demo.ts";
import type { Cliente, EtapaId, Pedido } from "./tipos.ts";

type Fecha = string | Date;

const dias = (desde: Fecha, hoy: Fecha) => Math.floor((new Date(hoy).getTime() - new Date(desde).getTime()) / 86400000);

export function pasoActual(cliente: Pick<Cliente, "pasos">): string {
  return PASOS.find((p) => !cliente.pasos[p.id]?.hecho)?.id ?? "completo";
}

export function avance(cliente: Pick<Cliente, "pasos">): number {
  return PASOS.filter((p) => cliente.pasos[p.id]?.hecho).length / PASOS.length;
}

export function sinNovedades(clientes: Cliente[], { dias: limite = 14, hoy = new Date() as Fecha } = {}) {
  return clientes
    .filter((c) => pasoActual(c) !== "completo")
    .map((c) => ({ ...c, diasSinNovedad: dias(c.ultimaNovedad, hoy) }))
    .filter((c) => c.diasSinNovedad >= limite)
    .sort((a, b) => b.diasSinNovedad - a.diasSinNovedad);
}

export function embudo(pedidos: Pedido[]) {
  return Object.entries(ETAPAS).map(([id, e]) => {
    const lista = pedidos.filter((p) => p.etapa === (id as EtapaId));
    return { id, nombre: e.nombre, cantidad: lista.length, monto: lista.reduce((s, p) => s + p.monto, 0) };
  });
}

export function completarPaso<T extends Pick<Cliente, "pasos">>(cliente: T, pasoId: string, hoy: Fecha = new Date()): T & { ultimaNovedad: string } {
  if (!PASOS.some((p) => p.id === pasoId)) throw new Error(`Paso desconocido: ${pasoId}`);
  const fecha = new Date(hoy).toISOString().slice(0, 10);
  return { ...cliente, ultimaNovedad: fecha, pasos: { ...cliente.pasos, [pasoId]: { hecho: true, fecha } } };
}
