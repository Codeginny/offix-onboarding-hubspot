// Tipos compartidos del dominio: clientes en onboarding, pedidos y estado guardado
export type PasoId = "relevamiento" | "propuesta" | "entrega" | "seguimiento";
export type EtapaId = "consulta" | "presupuesto" | "senado" | "entregado" | "perdido";

export interface Paso { id: PasoId; nombre: string; detalle: string }
export interface Etapa { nombre: string; hubspot: string }
export interface EstadoPaso { hecho: boolean; fecha: string | null }

export interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  alta: string;
  ultimaNovedad: string;
  pasos: Record<string, EstadoPaso>;
  hubspotId: string | null;
}

export interface Pedido {
  id: string;
  clienteId: string;
  producto: string;
  monto: number;
  etapa: EtapaId;
  fecha: string;
  hubspotId: string | null;
}

export interface Estado {
  clientes: Cliente[];
  pedidos: Pedido[];
  registro: { fecha: string; texto: string }[];
}
