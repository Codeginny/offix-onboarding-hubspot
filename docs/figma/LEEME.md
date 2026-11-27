# Figma de Offix

Archivo: https://www.figma.com/design/0KeKmNoY7Zjrbzq95MVaFn (plan Starter: máx. 3 páginas).

El script dibuja todo en capas editables (sin capturas pegadas):

- **01 Pantallas** — Compu 1440: Bienvenida, Panel, Onboarding, Pedidos. Celular 390: Bienvenida, Panel, Onboarding.
- **02 Análisis UX/UI** — Panel y Onboarding con etiquetas numeradas en **fucsia** y las notas a la derecha; la oportunidad de mejora va en **ámbar** con «!».

## Cómo correrlo
1. Abrí el archivo en Figma → menú **Plugins → Scripter** (si no lo tenés: Community → «Scripter» de Rasmus Andersson).
2. Pegá todo el contenido de `offix-figma.js` y tocá ▶.
3. Tarda unos segundos. Si lo corrés de nuevo, borra y rehace las dos páginas.

Para regenerarlo con otros datos: con la demo andando (`npm start`), `node docs/figma/generar.mjs`.

## Flujo en FigJam
1. Creá un tablero FigJam nuevo (por ejemplo «Offix — Flujo»).
2. **Plugins → Scripter**, pegá `flujo-figjam.js` y tocá ▶.
Dibuja tres carriles (Cliente · Offix · HubSpot), los 4 pasos, la decisión «¿Acepta?», las sincronizaciones punteadas y el aviso de 14 días.
