// Datos ficticios para la demo: nunca clientes ni proveedores reales.
import type { Cliente, Estado, Etapa, EtapaId, EstadoPaso, Paso, Pedido } from "./tipos.ts";

const NOMBRES = ["Lucía Ferreyra", "Martín Ocampo", "Sofía Bustos", "Tomás Herrera", "Valentina Ríos", "Joaquín Paz",
  "Camila Godoy", "Nicolás Vera", "Florencia Luna", "Agustín Molina", "Julieta Sosa", "Ignacio Díaz"];
const EMPRESAS = ["Estudio Brisa", "Café Andén", "Librería Faro", "Pilates Norte", "Taller Ceibo", "Vivero Alba",
  "Panadería Trigo", "Óptica Lente", "Hostel Ruta", "Floristería Iris", "Gym Pulso", "Bodega Cumbre"];
const PRODUCTOS = ["Identidad visual", "Tienda online", "Pack redes (3 meses)", "Señalética", "Catálogo impreso", "Landing page"];

export const PASOS: Paso[] = [
  { id: "relevamiento", nombre: "Relevamiento", detalle: "Reunión inicial: qué vende, a quién y qué necesita" },
  { id: "propuesta", nombre: "Propuesta", detalle: "Presupuesto y alcance enviados y aceptados" },
  { id: "entrega", nombre: "Entrega", detalle: "Trabajo entregado y aprobado por el cliente" },
  { id: "seguimiento", nombre: "Seguimiento", detalle: "Llamada a los 15 días: resultados y próximo pedido" },
];

// Etapas del pedido en Visuali → etapas del pipeline por defecto de HubSpot
export const ETAPAS: Record<EtapaId, Etapa> = {
  consulta: { nombre: "Consulta", hubspot: "appointmentscheduled" },
  presupuesto: { nombre: "Presupuesto enviado", hubspot: "presentationscheduled" },
  senado: { nombre: "Señado", hubspot: "contractsent" },
  entregado: { nombre: "Entregado", hubspot: "closedwon" },
  perdido: { nombre: "Perdido", hubspot: "closedlost" },
};

// Generador con semilla para que la demo sea siempre igual
function azar(semilla: number): () => number { let s = semilla; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

export function crearDemo(hoy = new Date("2026-11-24T12:00:00Z")): Estado {
  const r = azar(42);
  const dia = 86400000;
  const fecha = (haceDias: number) => new Date(hoy.getTime() - haceDias * dia).toISOString().slice(0, 10);
  const clientes: Cliente[] = [], pedidos: Pedido[] = [];
  NOMBRES.forEach((nombre, i) => {
    const [first, last] = nombre.split(" ");
    const alta = Math.floor(r() * 80) + 5;
    const avance = Math.floor(r() * 5); // cuántos pasos completó (0 a 4)
    const pasos: Record<string, EstadoPaso> = {};
    let d = alta;
    PASOS.forEach((p, j) => {
      if (j < avance) { d = Math.max(0, d - Math.floor(r() * 12) - 2); pasos[p.id] = { hecho: true, fecha: fecha(d) }; }
      else pasos[p.id] = { hecho: false, fecha: null };
    });
    const id = `c${String(i + 1).padStart(2, "0")}`;
    clientes.push({
      id, nombre, empresa: EMPRESAS[i],
      email: `${first}.${last}`.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "") + "@ejemplo.com",
      telefono: `+54 9 383 4${String(100000 + Math.floor(r() * 899999))}`,
      alta: fecha(alta), ultimaNovedad: fecha(d), pasos, hubspotId: null,
    });
    const n = 1 + Math.floor(r() * 2);
    for (let k = 0; k < n; k++) {
      const claves = Object.keys(ETAPAS) as EtapaId[];
      const etapa: EtapaId = avance >= 3 ? (r() < 0.8 ? "entregado" : "perdido") : claves[Math.min(avance, 2)];
      pedidos.push({
        id: `p${pedidos.length + 1}`, clienteId: id, producto: PRODUCTOS[Math.floor(r() * PRODUCTOS.length)],
        monto: Math.round((80 + r() * 900)) * 1000, etapa, fecha: fecha(Math.max(0, alta - 3)), hubspotId: null,
      });
    }
  });
  return { clientes, pedidos, registro: [] };
}
