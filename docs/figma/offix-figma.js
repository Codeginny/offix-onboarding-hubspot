// Offix — pantallas y análisis UX/UI (Plugin API, para pegar en Scripter).
// Página «01 Pantallas»: la demo redibujada en capas editables (compu 1440 y celular 390).
// Página «02 Análisis UX/UI»: las pantallas con etiquetas numeradas en fucsia y las notas a la derecha.
// Si se vuelve a correr, borra lo que dibujó antes y lo rehace.
const D = {"pasos":[{"id":"relevamiento","nombre":"Relevamiento"},{"id":"propuesta","nombre":"Propuesta"},{"id":"entrega","nombre":"Entrega"},{"id":"seguimiento","nombre":"Seguimiento"}],"etapas":{"consulta":"Consulta","presupuesto":"Presupuesto enviado","senado":"Señado","entregado":"Entregado","perdido":"Perdido"},"clientes":[{"id":"c01","nombre":"Lucía Ferreyra","empresa":"Estudio Brisa","email":"lucia.ferreyra@ejemplo.com","hubspotId":"sim-1","pasoActual":"entrega","pasos":{"relevamiento":"2026-11-24","propuesta":"2026-11-24","entrega":null,"seguimiento":null}},{"id":"c02","nombre":"Martín Ocampo","empresa":"Café Andén","email":"martin.ocampo@ejemplo.com","hubspotId":"sim-2","pasoActual":"propuesta","pasos":{"relevamiento":"2026-10-11","propuesta":null,"entrega":null,"seguimiento":null}},{"id":"c03","nombre":"Sofía Bustos","empresa":"Librería Faro","email":"sofia.bustos@ejemplo.com","hubspotId":"sim-3","pasoActual":"relevamiento","pasos":{"relevamiento":null,"propuesta":null,"entrega":null,"seguimiento":null}},{"id":"c04","nombre":"Tomás Herrera","empresa":"Pilates Norte","email":"tomas.herrera@ejemplo.com","hubspotId":"sim-4","pasoActual":"completo","pasos":{"relevamiento":"2026-11-16","propuesta":"2026-11-23","entrega":"2026-11-24","seguimiento":"2026-11-24"}},{"id":"c05","nombre":"Valentina Ríos","empresa":"Taller Ceibo","email":"valentina.rios@ejemplo.com","hubspotId":"sim-5","pasoActual":"seguimiento","pasos":{"relevamiento":"2026-10-14","propuesta":"2026-10-20","entrega":"2026-10-26","seguimiento":null}},{"id":"c06","nombre":"Joaquín Paz","empresa":"Vivero Alba","email":"joaquin.paz@ejemplo.com","hubspotId":"sim-6","pasoActual":"relevamiento","pasos":{"relevamiento":null,"propuesta":null,"entrega":null,"seguimiento":null}},{"id":"c07","nombre":"Camila Godoy","empresa":"Panadería Trigo","email":"camila.godoy@ejemplo.com","hubspotId":"sim-7","pasoActual":"entrega","pasos":{"relevamiento":"2026-09-05","propuesta":"2026-09-18","entrega":null,"seguimiento":null}},{"id":"c08","nombre":"Nicolás Vera","empresa":"Óptica Lente","email":"nicolas.vera@ejemplo.com","hubspotId":"sim-8","pasoActual":"propuesta","pasos":{"relevamiento":"2026-10-03","propuesta":null,"entrega":null,"seguimiento":null}},{"id":"c09","nombre":"Florencia Luna","empresa":"Hostel Ruta","email":"florencia.luna@ejemplo.com","hubspotId":"sim-9","pasoActual":"relevamiento","pasos":{"relevamiento":null,"propuesta":null,"entrega":null,"seguimiento":null}},{"id":"c10","nombre":"Agustín Molina","empresa":"Floristería Iris","email":"agustin.molina@ejemplo.com","hubspotId":"sim-10","pasoActual":"completo","pasos":{"relevamiento":"2026-11-17","propuesta":"2026-11-24","entrega":"2026-11-24","seguimiento":"2026-11-24"}},{"id":"c11","nombre":"Julieta Sosa","empresa":"Gym Pulso","email":"julieta.sosa@ejemplo.com","hubspotId":"sim-11","pasoActual":"propuesta","pasos":{"relevamiento":"2026-09-13","propuesta":null,"entrega":null,"seguimiento":null}},{"id":"c12","nombre":"Ignacio Díaz","empresa":"Bodega Cumbre","email":"ignacio.diaz@ejemplo.com","hubspotId":"sim-12","pasoActual":"propuesta","pasos":{"relevamiento":"2026-10-30","propuesta":null,"entrega":null,"seguimiento":null}}],"pedidos":[{"empresa":"Estudio Brisa","producto":"Landing page","monto":541000,"etapa":"senado","hubspotId":"sim-13"},{"empresa":"Café Andén","producto":"Pack redes (3 meses)","monto":301000,"etapa":"presupuesto","hubspotId":"sim-14"},{"empresa":"Café Andén","producto":"Tienda online","monto":249000,"etapa":"presupuesto","hubspotId":"sim-15"},{"empresa":"Librería Faro","producto":"Landing page","monto":743000,"etapa":"consulta","hubspotId":"sim-16"},{"empresa":"Librería Faro","producto":"Identidad visual","monto":565000,"etapa":"consulta","hubspotId":"sim-17"},{"empresa":"Pilates Norte","producto":"Landing page","monto":787000,"etapa":"perdido","hubspotId":"sim-18"},{"empresa":"Taller Ceibo","producto":"Pack redes (3 meses)","monto":128000,"etapa":"entregado","hubspotId":"sim-19"},{"empresa":"Vivero Alba","producto":"Tienda online","monto":138000,"etapa":"consulta","hubspotId":"sim-20"},{"empresa":"Panadería Trigo","producto":"Tienda online","monto":569000,"etapa":"senado","hubspotId":"sim-21"},{"empresa":"Panadería Trigo","producto":"Landing page","monto":251000,"etapa":"senado","hubspotId":"sim-22"},{"empresa":"Óptica Lente","producto":"Catálogo impreso","monto":805000,"etapa":"presupuesto","hubspotId":"sim-23"},{"empresa":"Hostel Ruta","producto":"Pack redes (3 meses)","monto":304000,"etapa":"consulta","hubspotId":"sim-24"},{"empresa":"Hostel Ruta","producto":"Señalética","monto":549000,"etapa":"consulta","hubspotId":"sim-25"},{"empresa":"Floristería Iris","producto":"Landing page","monto":501000,"etapa":"entregado","hubspotId":"sim-26"},{"empresa":"Gym Pulso","producto":"Señalética","monto":824000,"etapa":"presupuesto","hubspotId":"sim-27"},{"empresa":"Gym Pulso","producto":"Señalética","monto":357000,"etapa":"presupuesto","hubspotId":"sim-28"},{"empresa":"Bodega Cumbre","producto":"Identidad visual","monto":521000,"etapa":"presupuesto","hubspotId":"sim-29"},{"empresa":"Bodega Cumbre","producto":"Pack redes (3 meses)","monto":89000,"etapa":"presupuesto","hubspotId":"sim-30"}],"sinNovedades":[{"id":"c11","nombre":"Julieta Sosa","empresa":"Gym Pulso","dias":75,"paso":"propuesta"},{"id":"c07","nombre":"Camila Godoy","empresa":"Panadería Trigo","dias":70,"paso":"entrega"},{"id":"c08","nombre":"Nicolás Vera","empresa":"Óptica Lente","dias":55,"paso":"propuesta"},{"id":"c06","nombre":"Joaquín Paz","empresa":"Vivero Alba","dias":50,"paso":"relevamiento"},{"id":"c02","nombre":"Martín Ocampo","empresa":"Café Andén","dias":47,"paso":"propuesta"},{"id":"c03","nombre":"Sofía Bustos","empresa":"Librería Faro","dias":33,"paso":"relevamiento"},{"id":"c05","nombre":"Valentina Ríos","empresa":"Taller Ceibo","dias":32,"paso":"seguimiento"},{"id":"c12","nombre":"Ignacio Díaz","empresa":"Bodega Cumbre","dias":28,"paso":"propuesta"},{"id":"c09","nombre":"Florencia Luna","empresa":"Hostel Ruta","dias":15,"paso":"relevamiento"}],"embudo":[{"id":"consulta","nombre":"Consulta","cantidad":5,"monto":2299000},{"id":"presupuesto","nombre":"Presupuesto enviado","cantidad":7,"monto":3146000},{"id":"senado","nombre":"Señado","cantidad":3,"monto":1361000},{"id":"entregado","nombre":"Entregado","cantidad":2,"monto":629000},{"id":"perdido","nombre":"Perdido","cantidad":1,"monto":787000}]};

// En Scripter no existe createAutoLayout (es del servidor MCP): se arma a mano.
const autoLayout = (dir) => {
  const f = figma.createFrame();
  f.layoutMode = dir;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  return f;
};

// ---------- marca ----------
const hex = (h) => { const n = parseInt(h.slice(1), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }; };
const C = { base: '#111114', sup: '#1B1B21', sup2: '#24242C', acento: '#FF3EA5', texto: '#F5F5F7', suave: '#9A9AA6', alerta: '#FFB020', exito: '#2BD49A', gris: '#55555F', borde: '#44444E' };
const solido = (h, opacity = 1) => [{ type: 'SOLID', color: hex(h), opacity }];

const fuentes = await figma.listAvailableFontsAsync();
const hay = (fam, est) => fuentes.some((f) => f.fontName.family === fam && f.fontName.style === est);
const TIT = hay('Outfit', 'SemiBold') ? 'Outfit' : 'Inter';
const estTit = (w) => TIT === 'Outfit' ? ({ 500: 'Medium', 600: 'SemiBold', 700: 'Bold' })[w] : ({ 500: 'Medium', 600: 'Semi Bold', 700: 'Bold' })[w];
for (const w of [500, 600, 700]) await figma.loadFontAsync({ family: TIT, style: estTit(w) });
for (const s of ['Regular', 'Medium', 'Semi Bold']) await figma.loadFontAsync({ family: 'Inter', style: s });

function txt(chars, { size = 15, color = C.texto, tit = false, peso = 400, ancho, alinear } = {}) {
  const t = figma.createText();
  t.fontName = tit ? { family: TIT, style: estTit(peso) } : { family: 'Inter', style: peso >= 600 ? 'Semi Bold' : peso >= 500 ? 'Medium' : 'Regular' };
  t.characters = String(chars);
  t.fontSize = size;
  t.fills = solido(color);
  if (tit) t.letterSpacing = { unit: 'PERCENT', value: -2 };
  if (ancho) { t.resize(ancho, t.height); t.textAutoResize = 'HEIGHT'; }
  if (alinear) t.textAlignHorizontal = alinear;
  return t;
}
function caja(dir = 'VERTICAL', { gap = 0, pad = 0, padX, padY, fill, radio = 0, nombre, alinear } = {}) {
  const f = autoLayout(dir);
  f.itemSpacing = gap;
  f.paddingLeft = f.paddingRight = padX ?? pad;
  f.paddingTop = f.paddingBottom = padY ?? pad;
  f.fills = fill ? solido(fill) : [];
  f.cornerRadius = radio;
  if (alinear) f.counterAxisAlignItems = alinear;
  if (nombre) f.name = nombre;
  return f;
}
const meter = (padre, ...hijos) => { for (const h of hijos) padre.appendChild(h); return padre; };
const llenar = (n) => { n.layoutSizingHorizontal = 'FILL'; return n; };
const pesos = (n) => '$ ' + Math.round(n).toLocaleString('es-AR');
const fecha = (f) => { if (!f) return ''; const m = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic']; const [, mm, dd] = f.split('-'); return `${Number(dd)} ${m[Number(mm) - 1]}`; };

function logo(size) {
  const n = figma.createNodeFromSvg(`<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="18" fill="${C.base}"/><circle cx="14.5" cy="33" r="7" fill="${C.acento}"/><path d="M26.5 34.5l9.5 11 17-24.5" fill="none" stroke="${C.acento}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  n.name = 'Logo';
  return n;
}
const marca = (size = 28) => meter(caja('HORIZONTAL', { gap: 10, alinear: 'CENTER', nombre: 'Marca' }), logo(size), txt('Offix', { tit: true, peso: 600, size: 18 }));
function pildora(texto, { fill = C.sup2, color = C.suave, size = 12, nombre } = {}) {
  return meter(caja('HORIZONTAL', { padX: 12, padY: 5, fill, radio: 999, nombre: nombre || 'Píldora' }), txt(texto, { size, color }));
}
function boton(texto, { sec = false, chico = false, nombre } = {}) {
  return meter(caja('HORIZONTAL', { padX: chico ? 14 : 22, padY: chico ? 7 : 12, fill: sec ? C.sup2 : C.acento, radio: 999, nombre: nombre || 'Botón' }),
    txt(texto, { size: chico ? 13 : 15, peso: 600, color: sec ? C.texto : C.base }));
}
function card(nombre, { pad = 20 } = {}) { return caja('VERTICAL', { gap: 12, pad, fill: C.sup, radio: 22, nombre }); }

// ---------- piezas de la app ----------
function barra(ancho, activa, movil = false) {
  const b = caja('HORIZONTAL', { gap: 16, padX: movil ? 16 : 20, padY: 14, alinear: 'CENTER', nombre: 'Barra superior' });
  b.fills = solido(C.base);
  const tabs = caja('HORIZONTAL', { gap: 4, pad: 4, fill: C.sup, radio: 999, nombre: 'Pestañas' });
  for (const [id, t] of [['panel', 'Panel'], ['clientes', 'Onboarding'], ['pedidos', 'Pedidos'], ['hubspot', 'HubSpot']]) {
    const on = id === activa;
    meter(tabs, meter(caja('HORIZONTAL', { padX: movil ? 12 : 16, padY: 8, radio: 999, fill: on ? C.acento : null, nombre: 'Pestaña ' + t }), txt(t, { size: movil ? 13 : 15, peso: on ? 600 : 400, color: on ? C.base : C.suave })));
  }
  if (movil) {
    b.layoutMode = 'VERTICAL'; b.counterAxisAlignItems = 'MIN'; b.itemSpacing = 12;
    const fila = meter(caja('HORIZONTAL', { gap: 8, alinear: 'CENTER' }), marca(28));
    const esp = figma.createFrame(); esp.fills = []; esp.resize(10, 1); meter(fila, esp); esp.layoutGrow = 1;
    meter(fila, pildora('○ HubSpot simulado', { nombre: 'Estado HubSpot' }));
    meter(b, fila); llenar(fila); meter(b, tabs); llenar(tabs);
  } else {
    meter(b, marca(28));
    const esp = figma.createFrame(); esp.fills = []; esp.resize(10, 1); meter(b, esp); esp.layoutGrow = 1;
    meter(b, tabs, pildora('○ HubSpot simulado', { nombre: 'Estado HubSpot' }));
  }
  return b;
}
function pantalla(nombre, ancho, alto) {
  const f = caja('VERTICAL', { fill: C.base, nombre });
  f.resize(ancho, alto); f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED'; f.clipsContent = true;
  return f;
}
function cuerpo(padre, movil = false) {
  const m = caja('VERTICAL', { gap: 16, padX: movil ? 16 : 170, padY: 20, nombre: 'Contenido' });
  meter(padre, m); llenar(m); return m;
}
function titulo(h, p, derecha) {
  const t = caja('HORIZONTAL', { gap: 12, nombre: 'Título' }); t.counterAxisAlignItems = 'MAX';
  const col = meter(caja('VERTICAL', { gap: 4 }), txt(h, { tit: true, peso: 600, size: 28 }), txt(p, { color: C.suave }));
  meter(t, col); col.layoutGrow = 1;
  if (derecha) meter(t, derecha);
  return t;
}

function kpi(num, label, acento) {
  const k = card('KPI · ' + label);
  meter(k, txt(num, { tit: true, peso: 700, size: 40, color: acento ? C.acento : C.texto }), txt(label, { size: 13, color: C.suave }));
  return k;
}
function listaLlamar(n) {
  const c = card('Para llamar hoy');
  meter(c, txt('Para llamar hoy', { tit: true, peso: 600, size: 17 }));
  const paso = (id) => (D.pasos.find((p) => p.id === id) || { nombre: 'Completo' }).nombre;
  for (const s of D.sinNovedades.slice(0, n)) {
    const f = caja('HORIZONTAL', { gap: 12, padY: 10, alinear: 'CENTER', nombre: 'Fila · ' + s.nombre });
    const col = meter(caja('VERTICAL', { gap: 2 }), txt(s.nombre, { tit: true, peso: 600 }), txt(`${s.empresa} · ${paso(s.paso)}`, { size: 13, color: C.suave }));
    meter(f, col); col.layoutGrow = 1;
    meter(f, txt(s.dias, { tit: true, peso: 700, size: 20, color: C.alerta, nombre: 'Días' }), txt('días', { size: 13, color: C.suave }));
    f.children[1].name = 'Días';
    meter(c, f); llenar(f);
  }
  return c;
}
function embudo(movil) {
  const c = card('Pedidos por etapa');
  meter(c, txt('Pedidos por etapa', { tit: true, peso: 600, size: 17 }));
  const max = Math.max(...D.embudo.map((e) => e.cantidad), 1);
  for (const e of D.embudo) {
    const f = caja('HORIZONTAL', { gap: 10, alinear: 'CENTER', nombre: 'Etapa · ' + e.nombre });
    const l = txt(e.nombre, { size: 14, ancho: movil ? 100 : 130 });
    const pista = figma.createFrame(); pista.name = 'Barra'; pista.resize(200, 14); pista.cornerRadius = 999; pista.fills = solido(C.sup2); pista.clipsContent = true;
    meter(f, l, pista); pista.layoutGrow = 1;
    const relleno = figma.createRectangle(); relleno.cornerRadius = 999;
    relleno.fills = solido(e.id === 'perdido' ? C.gris : C.acento);
    pista.appendChild(relleno);
    relleno.resize(Math.max(6, 200 * e.cantidad / max), 14);
    relleno.constraints = { horizontal: 'SCALE', vertical: 'STRETCH' };
    if (!movil) meter(f, txt(`${e.cantidad} · ${pesos(e.monto / 1000)}k`, { size: 14, color: C.suave, ancho: 110, alinear: 'RIGHT' }));
    meter(c, f); llenar(f);
  }
  return c;
}
function selectDias() {
  const col = caja('VERTICAL', { gap: 4, nombre: 'Umbral de días' });
  meter(col, txt('Sin novedades desde', { size: 13, color: C.suave }),
    meter(caja('HORIZONTAL', { gap: 8, padX: 12, padY: 6, fill: C.sup2, radio: 999, alinear: 'CENTER' }), txt('14 días'), txt('▾', { color: C.suave })));
  return col;
}

function anillo(hechos) {
  const f = figma.createFrame(); f.name = 'Anillo de avance'; f.resize(46, 46); f.fills = [];
  const fondo = figma.createEllipse(); fondo.resize(46, 46); fondo.fills = solido(C.sup2);
  f.appendChild(fondo);
  if (hechos) {
    const arco = figma.createEllipse(); f.appendChild(arco); arco.resize(46, 46); arco.fills = solido(C.acento);
    arco.arcData = { startingAngle: -Math.PI / 2, endingAngle: -Math.PI / 2 + 2 * Math.PI * hechos / 4, innerRadius: 0 };
  }
  const hueco = figma.createEllipse(); f.appendChild(hueco); hueco.resize(36, 36); hueco.x = hueco.y = 5; hueco.fills = solido(C.sup);
  const t = txt(`${hechos}/4`, { tit: true, peso: 600, size: 12, ancho: 46, alinear: 'CENTER' }); t.y = 15;
  f.appendChild(t);
  return f;
}
function marcaPaso(hecho) {
  if (hecho) {
    const n = figma.createNodeFromSvg(`<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" fill="${C.acento}"/><path d="M6.5 11.2l3 3 6-6.4" fill="none" stroke="${C.base}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    n.name = 'Paso hecho'; return n;
  }
  const n = figma.createNodeFromSvg(`<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" fill="none" stroke="${C.borde}" stroke-width="2"/></svg>`);
  n.name = 'Paso pendiente'; return n;
}
function tarjetaCliente(c) {
  const t = card('Cliente · ' + c.nombre);
  const hechos = D.pasos.filter((p) => c.pasos[p.id]).length;
  const cab = caja('HORIZONTAL', { gap: 8, nombre: 'Cabecera' });
  const col = meter(caja('VERTICAL', { gap: 2 }), txt(c.nombre, { tit: true, peso: 600, size: 17 }), txt(`${c.empresa} · ${c.email}`, { size: 13, color: C.suave }));
  meter(cab, col); col.layoutGrow = 1; meter(cab, anillo(hechos));
  meter(t, cab); llenar(cab);
  const lista = caja('VERTICAL', { gap: 8, nombre: 'Checklist' });
  for (const p of D.pasos) {
    const f = caja('HORIZONTAL', { gap: 10, alinear: 'CENTER', nombre: 'Paso · ' + p.nombre });
    const actual = c.pasoActual === p.id;
    const l = txt(p.nombre, { size: 14, peso: actual ? 600 : 400, color: actual ? C.acento : C.texto });
    meter(f, marcaPaso(!!c.pasos[p.id]), l); l.layoutGrow = 1;
    if (c.pasos[p.id]) meter(f, Object.assign(txt(fecha(c.pasos[p.id]), { size: 13, color: C.suave }), { name: 'Fecha' }));
    else if (actual) meter(f, boton('Marcar hecho', { chico: true, nombre: 'Marcar hecho' }));
    meter(lista, f); llenar(f);
  }
  meter(t, lista); llenar(lista);
  const pie = meter(caja('HORIZONTAL', { gap: 8, alinear: 'CENTER', nombre: 'Contacto HubSpot' }), txt('Contacto HubSpot', { size: 13, color: C.suave }),
    pildora(c.hubspotId || '—', { fill: '#3A1A2C', color: C.acento }));
  meter(t, pie);
  return t;
}
function grilla(items, cols, gap = 16) {
  const g = caja('VERTICAL', { gap, nombre: 'Grilla' });
  for (let i = 0; i < items.length; i += cols) {
    const fila = caja('HORIZONTAL', { gap }); meter(g, fila); llenar(fila);
    fila.counterAxisAlignItems = 'MIN';
    for (const it of items.slice(i, i + cols)) { meter(fila, it); it.layoutGrow = 1; it.layoutSizingHorizontal = 'FILL'; }
  }
  return g;
}

// ---------- pantallas ----------
function pPanel() {
  const f = pantalla('Compu · Panel de seguimiento', 1440, 900);
  meter(f, barra(1440, 'panel')); llenar(f.children[0]);
  const m = cuerpo(f);
  meter(m, titulo('Panel de seguimiento', 'Quién necesita un llamado hoy y cómo viene el embudo.', selectDias())); llenar(m.children[0]);
  const activos = D.clientes.filter((c) => c.pasoActual !== 'completo').length;
  const ganado = D.embudo.find((e) => e.id === 'entregado');
  meter(m, grilla([kpi(D.clientes.length, 'clientes'), kpi(activos, 'en onboarding'), kpi(D.sinNovedades.length, 'sin novedades hace 14+ días', true), kpi(pesos(ganado.monto / 1000) + 'k', 'entregado')], 4));
  llenar(m.children[1]);
  meter(m, grilla([listaLlamar(7), embudo(false)], 2)); llenar(m.children[2]);
  return f;
}
function pOnboarding() {
  const f = pantalla('Compu · Onboarding de clientes', 1440, 900);
  meter(f, barra(1440, 'clientes')); llenar(f.children[0]);
  const m = cuerpo(f);
  meter(m, titulo('Onboarding de clientes', 'Cuatro pasos por cliente, con la fecha en que se cumplió cada uno.', boton('+ Cliente nuevo', { nombre: 'Cliente nuevo' }))); llenar(m.children[0]);
  meter(m, grilla(D.clientes.slice(0, 6).map(tarjetaCliente), 3)); llenar(m.children[1]);
  return f;
}
function pPedidos() {
  const f = pantalla('Compu · Pedidos', 1440, 900);
  meter(f, barra(1440, 'pedidos')); llenar(f.children[0]);
  const m = cuerpo(f);
  meter(m, titulo('Pedidos', 'Al cambiar la etapa se actualiza el negocio en HubSpot.')); llenar(m.children[0]);
  const t = card('Tabla de pedidos', { pad: 20 }); t.itemSpacing = 0;
  const anchos = [260, 260, 180, 200, 0];
  const fila = (celdas, cab) => {
    const r = caja('HORIZONTAL', { padY: 10, alinear: 'CENTER', nombre: cab ? 'Encabezado' : 'Fila' });
    r.strokes = solido(C.sup2); r.strokeTopWeight = cab ? 0 : 1; r.strokeBottomWeight = r.strokeLeftWeight = r.strokeRightWeight = 0;
    celdas.forEach((c, i) => { const w = typeof c === 'string' ? txt(c, { size: 14, color: cab ? C.suave : C.texto, ancho: anchos[i] || undefined }) : c; meter(r, w); if (!anchos[i]) w.layoutGrow = 1; });
    return r;
  };
  meter(t, fila(['Cliente', 'Producto', 'Monto', 'Etapa', 'HubSpot'], true)); llenar(t.children[0]);
  for (const p of D.pedidos.slice(0, 12)) {
    const sel = meter(caja('HORIZONTAL', { gap: 8, padX: 10, padY: 6, fill: C.sup2, radio: 999, alinear: 'CENTER', nombre: 'Selector de etapa' }), txt(D.etapas[p.etapa], { size: 14 }), txt('▾', { color: C.suave }));
    const celSel = caja('HORIZONTAL'); celSel.resize(anchos[3], 10); celSel.primaryAxisSizingMode = 'FIXED'; meter(celSel, sel);
    const r = fila([p.empresa, p.producto, pesos(p.monto), celSel, pildora(p.hubspotId || '—', { fill: '#3A1A2C', color: C.acento })]);
    r.children[4].layoutGrow = 0;
    meter(t, r); llenar(r);
  }
  meter(m, t); llenar(t);
  return f;
}
function pasoIntro(n, t, s) {
  const c = card('Paso ' + n, { pad: 18 }); c.itemSpacing = 4;
  meter(c, txt(n, { tit: true, peso: 700, size: 24, color: C.acento }), txt(t, { peso: 600 }), txt(s, { size: 13, color: C.suave, ancho: 300 }));
  return c;
}
function bienvenida(nombre, ancho, alto, movil) {
  const f = pantalla(nombre, ancho, alto);
  const brillo = figma.createEllipse(); f.appendChild(brillo); brillo.name = 'Brillo';
  brillo.layoutPositioning = 'ABSOLUTE';
  brillo.resize(ancho * 0.6, ancho * 0.32); brillo.x = ancho * 0.55; brillo.y = -ancho * 0.16;
  brillo.fills = solido(C.acento, 0.22);
  brillo.effects = [{ type: 'LAYER_BLUR', radius: movil ? 80 : 180, visible: true }];
  const m = caja('VERTICAL', { gap: movil ? 20 : 26, padX: movil ? 20 : 230, padY: movil ? 28 : 48, nombre: 'Contenido' });
  meter(f, m); llenar(m);
  meter(m, marca(movil ? 32 : 40));
  const h = txt('Cada cliente, de la primera charla', { tit: true, peso: 700, size: movil ? 34 : 60 });
  const tit = caja('VERTICAL', { gap: 0, nombre: 'Titular' });
  meter(tit, h, txt('al próximo pedido.', { tit: true, peso: 700, size: movil ? 34 : 60, color: C.acento }));
  if (movil) { h.resize(350, h.height); h.textAutoResize = 'HEIGHT'; }
  meter(m, tit);
  meter(m, txt('La demo de Visuali conectada a HubSpot: cuando cargás un cliente se crea su contacto, cada pedido es un negocio con su etapa y el onboarding te avisa quién se está enfriando.', { size: 17, color: C.suave, ancho: movil ? 350 : 620 }));
  const pasos = [pasoIntro('01', 'Cargás el cliente', 'Se crea el contacto en HubSpot'), pasoIntro('02', 'Seguís sus 4 pasos', 'Relevamiento, propuesta, entrega y seguimiento'),
    pasoIntro('03', 'Movés el pedido', 'El negocio cambia de etapa en el embudo'), pasoIntro('04', 'Mirás el panel', 'Quién lleva días sin novedades')];
  const g = movil ? grilla(pasos, 1, 10) : grilla(pasos, 4, 14);
  meter(m, g); llenar(g);
  meter(m, boton('Entrar a la demo', { nombre: 'Entrar a la demo' }), txt('Datos ficticios · ningún cliente real', { size: 13, color: C.suave }));
  return f;
}
function mOnboarding() {
  const f = pantalla('Celular · Onboarding', 390, 844);
  meter(f, barra(390, 'clientes', true)); llenar(f.children[0]);
  const m = cuerpo(f, true);
  meter(m, txt('Onboarding de clientes', { tit: true, peso: 600, size: 26 }), boton('+ Cliente nuevo', { nombre: 'Cliente nuevo' }));
  for (const c of D.clientes.slice(0, 2)) { const t = tarjetaCliente(c); meter(m, t); llenar(t); }
  return f;
}
function mPanel() {
  const f = pantalla('Celular · Panel', 390, 844);
  meter(f, barra(390, 'panel', true)); llenar(f.children[0]);
  const m = cuerpo(f, true);
  meter(m, txt('Panel de seguimiento', { tit: true, peso: 600, size: 26 }));
  const activos = D.clientes.filter((c) => c.pasoActual !== 'completo').length;
  meter(m, grilla([kpi(activos, 'en onboarding'), kpi(D.sinNovedades.length, 'sin novedades', true)], 2, 12)); llenar(m.children[1]);
  const l = listaLlamar(4); meter(m, l); llenar(l);
  const e = embudo(true); meter(m, e); llenar(e);
  return f;
}

// ---------- páginas ----------
async function pagina(nombre) {
  let p = figma.root.children.find((x) => x.name === nombre);
  if (!p) { p = figma.root.children.length === 1 && figma.root.children[0].children.length === 0 && !figma.root.children[0].name.startsWith('0') ? figma.root.children[0] : figma.createPage(); p.name = nombre; }
  await figma.setCurrentPageAsync(p);
  for (const n of [...p.children]) n.remove();
  return p;
}
function seccion(pag, nombre, nodos, x, y, gap = 80) {
  const s = figma.createSection(); s.name = nombre; pag.appendChild(s);
  s.fills = solido('#0A0A0C');
  let cx = 80;
  for (const n of nodos) { s.appendChild(n); n.x = cx; n.y = 80; cx += n.width + gap; }
  const alto = Math.max(...nodos.map((n) => n.height)) + 160;
  s.resizeWithoutConstraints(cx, alto); s.x = x; s.y = y;
  return s;
}

const p1 = await pagina('01 Pantallas');
const compu = [bienvenida('Compu · Bienvenida', 1440, 900, false), pPanel(), pOnboarding(), pPedidos()];
const celu = [bienvenida('Celular · Bienvenida', 390, 844, true), mPanel(), mOnboarding()];
const s1 = seccion(p1, 'Compu · 1440', compu, 0, 0);
seccion(p1, 'Celular · 390', celu, 0, s1.height + 200);

// ---------- análisis UX/UI ----------
const NOTAS = {
  panel: {
    pantalla: pPanel,
    titulo: 'Panel de seguimiento',
    marcas: [
      ['Fila · ', 'Lo primero que se ve es a quién llamar hoy, ordenado del cliente más frío al más reciente. No hace falta filtrar nada.'],
      ['Días', 'Los días van en ámbar, el único color de alerta de la app. El fucsia queda para lo que avanza.'],
      ['Umbral de días', 'El límite (7, 14 o 30 días) se cambia desde el panel mismo, sin pasar por una pantalla de ajustes.'],
      ['Etapa · Consulta', 'El embudo muestra cantidad y dinero en la misma fila. Lo perdido va en gris para no competir con lo que sigue abierto.'],
      ['Estado HubSpot', 'El estado de la conexión está siempre a la vista: si dice «simulado», nada llegó todavía al CRM.'],
    ],
    mejora: ['Fila · ', 'Mejora: sumar «Llamar» o «Escribir por WhatsApp» en cada fila, para actuar sin salir del panel.'],
  },
  onboarding: {
    pantalla: pOnboarding,
    titulo: 'Onboarding de clientes',
    marcas: [
      ['Anillo de avance', 'El anillo resume el avance en una cifra (2/4). Se lee de un vistazo, sin contar casilleros.'],
      ['Marcar hecho', 'Solo el paso que toca tiene botón. Así no se saltea un paso y la persona sabe qué hacer ahora.'],
      ['Fecha', 'Cada paso hecho guarda su fecha. Con eso se calculan los días sin novedades del panel.'],
      ['Contacto HubSpot', 'El ID del contacto confirma que el cliente ya está en HubSpot, sin tener que abrir el CRM.'],
      ['Cliente nuevo', 'Un solo botón principal por pantalla, en fucsia y arriba a la derecha.'],
    ],
    mejora: ['Paso hecho', 'Mejora: poder deshacer un paso marcado por error (hoy solo se corrige desde los datos).'],
  },
};
const p2 = await pagina('02 Análisis UX/UI');
function etiqueta(n, color = C.acento) {
  const e = meter(caja('HORIZONTAL', { padX: 16, padY: 6, fill: color, radio: 999, nombre: 'Etiqueta ' + n }), txt(n, { tit: true, peso: 700, size: 30, color: C.base }));
  e.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.45 }, offset: { x: 0, y: 4 }, radius: 12, spread: 0, visible: true, blendMode: 'NORMAL' }];
  return e;
}
let y = 0;
for (const [clave, a] of Object.entries(NOTAS)) {
  const lam = figma.createFrame(); lam.name = 'Análisis · ' + a.titulo; lam.fills = solido('#0A0A0C'); p2.appendChild(lam);
  const sc = a.pantalla(); lam.appendChild(sc); sc.x = 60; sc.y = 140;
  sc.primaryAxisSizingMode = 'AUTO'; sc.paddingBottom = 40;
  const tt = txt('Análisis UX/UI · ' + a.titulo, { tit: true, peso: 600, size: 48 }); lam.appendChild(tt); tt.x = 60; tt.y = 50;
  const col = caja('VERTICAL', { gap: 26, nombre: 'Notas' }); lam.appendChild(col); col.x = 60 + 1440 + 80; col.y = 140;
  const todas = [...a.marcas.map((m, i) => [String(i + 1), ...m, C.acento]), ['!', ...a.mejora, C.alerta]];
  const usados = new Set();
  for (const [n, nombre, nota, color] of todas) {
    const destino = sc.findAll((x) => x.name.startsWith(nombre) && !usados.has(x.id))[0];
    if (destino) {
      usados.add(destino.id);
      const b = destino.absoluteBoundingBox, o = sc.absoluteBoundingBox;
      const r = figma.createRectangle(); lam.appendChild(r); r.name = 'Recuadro ' + n;
      r.resize(b.width + 16, b.height + 16); r.x = sc.x + (b.x - o.x) - 8; r.y = sc.y + (b.y - o.y) - 8;
      r.fills = []; r.strokes = solido(color); r.strokeWeight = 3; r.cornerRadius = 14; r.dashPattern = [10, 6];
      const e = etiqueta(n, color); lam.appendChild(e);
      e.x = r.x - 22; e.y = r.y - 26;
    }
    const fila = caja('HORIZONTAL', { gap: 14, nombre: 'Nota ' + n }); fila.counterAxisAlignItems = 'MIN';
    meter(fila, etiqueta(n, color), txt(nota, { size: 24, color: C.texto, ancho: 520 }));
    meter(col, fila);
  }
  lam.resize(60 + 1440 + 80 + 600 + 60, Math.max(sc.height, col.height) + 140 + 80);
  lam.x = 0; lam.y = y; y += lam.height + 120;
}
await figma.setCurrentPageAsync(p1);
figma.viewport.scrollAndZoomIntoView(p1.children);
