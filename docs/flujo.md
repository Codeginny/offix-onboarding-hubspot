# Flujo de onboarding

Cómo pasa un cliente de la primera consulta al próximo pedido, y qué se sincroniza con HubSpot en cada paso.
La versión visual está en FigJam (`figma/flujo-figjam.js`, se pega en Scripter dentro de un tablero).

```mermaid
flowchart LR
  subgraph Cliente
    A([Escribe o llama]) --> R[Reunión inicial]
    D{¿Acepta?}
    AP[Recibe y aprueba]
    N([Próximo pedido])
  end
  subgraph VO[Offix]
    B[Alta del cliente] --> P1[1 · Relevamiento] --> P2[2 · Propuesta]
    S[Pedido «Señado»] --> P3[3 · Entrega] --> P4[4 · Seguimiento]
    AV[Aviso: 14 días sin novedades]
  end
  subgraph HS[HubSpot]
    C[Contacto]
    NG[Negocio · presentationscheduled]
    CS[contractsent]
    CW[closedwon]
    CL[closedlost]
    W[Cambio de etapa en HubSpot]
  end
  A --> B
  R --> P1
  P2 --> D
  D -- Sí --> S
  P3 --> AP
  P4 --> N
  P4 -. sin avance .-> AV
  B -. API contactos .-> C
  P2 -. API negocios .-> NG
  D -. No .-> CL
  S -.-> CS
  P3 -.-> CW
  W -. webhook firmado .-> P4
```

## Qué pasa con los datos en cada paso

| Momento | En Offix | En HubSpot |
|---|---|---|
| Alta del cliente | Ficha con los 4 pasos sin hacer | Contacto (se busca por email antes de crear: no se duplica) |
| Pedido nuevo o cambio de etapa | Etapa del pedido | Negocio asociado al contacto, con la etapa equivalente del pipeline |
| Paso marcado como hecho | Fecha del paso y «última novedad» | — |
| 14 días sin novedades | Aparece en «Para llamar hoy» | — |
| Alguien mueve el negocio en HubSpot | El pedido cambia de etapa (webhook con firma v3) | — |

## Equivalencia de etapas

| Offix | Pipeline de HubSpot |
|---|---|
| Consulta | `appointmentscheduled` |
| Presupuesto enviado | `presentationscheduled` |
| Señado | `contractsent` |
| Entregado | `closedwon` |
| Perdido | `closedlost` |

## Decisiones
- **El email es la llave.** Antes de crear un contacto se busca por email (`idProperty=email`), así una carga repetida no duplica.
- **El onboarding vive en Offix, no en HubSpot.** Los 4 pasos son del trabajo diario; HubSpot recibe lo que le sirve al área comercial: contactos, negocios y etapas.
- **Sin token, todo se simula.** La demo funciona sin cuenta y el registro muestra qué se habría enviado.
- **Los webhooks se verifican.** Si la firma no coincide o tiene más de 5 minutos, se rechaza.
