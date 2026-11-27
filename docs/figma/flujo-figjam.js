// Offix — flujo de onboarding en FigJam (Plugin API, para pegar en Scripter dentro de un tablero FigJam).
// Tres carriles: Cliente · Offix · HubSpot. Si se vuelve a correr, borra lo que dibujó antes.
const hex = (h) => { const n = parseInt(h.slice(1), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }; };
const C = { base: '#111114', acento: '#FF3EA5', suave: '#FFD6EC', alerta: '#FFB020', exito: '#2BD49A', gris: '#F4F4F6', hub: '#FFE3D6' };
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
for (const n of figma.currentPage.children.filter((x) => x.name.startsWith('VO ·'))) n.remove();

const W = 260, H = 120, GAPX = 90, X0 = 320;
const CARRILES = [
  { id: 'cliente', nombre: 'Cliente', color: C.gris },
  { id: 'visu', nombre: 'Offix', color: C.suave },
  { id: 'hubspot', nombre: 'HubSpot', color: C.hub },
];
const ALTO = 260, Y0 = 160;
const yCarril = (id) => Y0 + CARRILES.findIndex((c) => c.id === id) * ALTO;

function texto(chars, size, bold, x, y, ancho) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: bold ? 'Bold' : 'Medium' };
  t.characters = chars; t.fontSize = size; t.x = x; t.y = y;
  if (ancho) { t.resize(ancho, t.height); t.textAutoResize = 'HEIGHT'; }
  t.name = 'VO · texto';
  return t;
}
const nodos = {};
function caja(id, carril, col, chars, { forma = 'ROUNDED_RECTANGLE', color = '#FFFFFF', borde = C.base } = {}) {
  const s = figma.createShapeWithText();
  s.shapeType = forma;
  s.resize(forma === 'DIAMOND' ? W : W, forma === 'DIAMOND' ? H + 40 : H);
  s.x = X0 + col * (W + GAPX); s.y = yCarril(carril) + (ALTO - s.height) / 2;
  s.fills = [{ type: 'SOLID', color: hex(color) }];
  s.strokes = [{ type: 'SOLID', color: hex(borde) }]; s.strokeWeight = 2;
  s.text.fontName = { family: 'Inter', style: 'Medium' };
  s.text.characters = chars; s.text.fontSize = 16;
  s.name = 'VO · ' + id;
  nodos[id] = s;
  return s;
}
function flecha(a, b, etiqueta, { punteada = false, color = C.base } = {}) {
  const c = figma.createConnector();
  c.connectorStart = { endpointNodeId: nodos[a].id, magnet: 'AUTO' };
  c.connectorEnd = { endpointNodeId: nodos[b].id, magnet: 'AUTO' };
  c.connectorEndStrokeCap = 'ARROW_LINES';
  c.strokes = [{ type: 'SOLID', color: hex(color) }]; c.strokeWeight = 3;
  if (punteada) c.dashPattern = [10, 8];
  if (etiqueta) { c.text.fontName = { family: 'Inter', style: 'Medium' }; c.text.characters = etiqueta; c.text.fontSize = 14; }
  c.name = 'VO · flecha';
  return c;
}

// carriles
const ancho = X0 + 8 * (W + GAPX);
for (const c of CARRILES) {
  const r = figma.createShapeWithText(); r.shapeType = 'SQUARE';
  r.resize(ancho, ALTO - 12); r.x = 0; r.y = yCarril(c.id);
  r.fills = [{ type: 'SOLID', color: hex(c.color), opacity: 0.55 }]; r.strokes = [];
  r.name = 'VO · carril ' + c.nombre;
  r.locked = true;
  texto(c.nombre, 28, true, 30, yCarril(c.id) + ALTO / 2 - 20, 240);
}
texto('Offix · Flujo de onboarding de un cliente', 44, true, 0, 30);
texto('Del primer contacto al próximo pedido. Fucsia: lo hace la persona en Offix · Ámbar: aviso automático · Línea punteada: sincronización con HubSpot.', 18, false, 0, 94, 1600);

// columna 0: entrada
caja('consulta', 'cliente', 0, 'Escribe o llama:\n«Quiero una tienda online»', { forma: 'ELLIPSE', color: '#FFFFFF' });
caja('alta', 'visu', 0, 'Alta del cliente\n(nombre, empresa, email)', { color: C.acento });
caja('contacto', 'hubspot', 0, 'Contacto creado\n(se busca por email: no se duplica)');
// columna 1: relevamiento
caja('relev', 'visu', 1, '1 · Relevamiento\nqué vende, a quién, qué necesita', { color: '#FFFFFF', borde: C.acento });
caja('reunion', 'cliente', 1, 'Reunión inicial');
// columna 2: propuesta
caja('propuesta', 'visu', 2, '2 · Propuesta\npresupuesto + pedido en «Presupuesto enviado»', { color: '#FFFFFF', borde: C.acento });
caja('negocio', 'hubspot', 2, 'Negocio creado\netapa: presentationscheduled');
// columna 3: decisión
caja('acepta', 'cliente', 3, '¿Acepta?', { forma: 'DIAMOND' });
caja('perdido', 'hubspot', 3, 'Negocio en closedlost\n(se anota el motivo)');
// columna 4: seña y entrega
caja('senado', 'visu', 4, 'Pedido «Señado»', { color: '#FFFFFF', borde: C.acento });
caja('contrato', 'hubspot', 4, 'Etapa contractsent');
// columna 5: entrega
caja('entrega', 'visu', 5, '3 · Entrega\ntrabajo aprobado, pedido «Entregado»', { color: '#FFFFFF', borde: C.acento });
caja('ganado', 'hubspot', 5, 'Etapa closedwon');
caja('aprueba', 'cliente', 5, 'Recibe y aprueba');
// columna 6: seguimiento
caja('seguim', 'visu', 6, '4 · Seguimiento\nllamada a los 15 días', { color: '#FFFFFF', borde: C.acento });
caja('aviso', 'visu', 7, 'Aviso «sin novedades»\nsi pasan 14 días sin avanzar', { color: C.alerta });
caja('nuevo', 'cliente', 7, 'Próximo pedido', { forma: 'ELLIPSE', color: C.exito });
caja('webhook', 'hubspot', 6, 'Cambio de etapa hecho en HubSpot\n→ webhook firmado vuelve a la demo');

flecha('consulta', 'alta');
flecha('alta', 'contacto', 'API: contactos', { punteada: true });
flecha('alta', 'relev');
flecha('reunion', 'relev');
flecha('relev', 'propuesta');
flecha('propuesta', 'negocio', 'API: negocios', { punteada: true });
flecha('propuesta', 'acepta');
flecha('acepta', 'senado', 'Sí');
flecha('acepta', 'perdido', 'No', { punteada: true });
flecha('senado', 'contrato', '', { punteada: true });
flecha('senado', 'entrega');
flecha('entrega', 'aprueba');
flecha('entrega', 'ganado', '', { punteada: true });
flecha('entrega', 'seguim');
flecha('seguim', 'nuevo');
flecha('seguim', 'aviso', 'sin avance', { color: C.alerta });
flecha('webhook', 'seguim', 'webhook', { punteada: true });

figma.viewport.scrollAndZoomIntoView(figma.currentPage.children.filter((x) => x.name.startsWith('VO ·')));
