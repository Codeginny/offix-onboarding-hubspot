// Capturas anotadas para el caso de estudio de Offix.
// - anotadas: recorte con zoom de una zona, con etiquetas numeradas en fucsia a la derecha;
// - planas: la pantalla tal cual, con marco, para las portadas;
// - código: tarjetas oscuras con un fragmento del servidor.
// Uso, con la app corriendo (npm start): BASE_URL=http://localhost:5180 node anotar.mjs [carpeta-salida] [nombre]
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:5180';
const OUT = process.argv[2] ?? '.';
const SOLO = process.argv[3];
mkdirSync(OUT, { recursive: true });

const ESCRITORIO = { width: 1180, height: 900 };
const CELULAR = { width: 390, height: 844 };
const MEDIO = { width: 820, height: 900 };

const pasos = (...fs) => async (page) => { for (const f of fs) { await f(page); await page.waitForTimeout(300); } };
const tocar = (texto, n = 0) => (page) => page.getByRole('button', { name: texto, exact: true }).nth(n).click();
const entrar = tocar('Entrar a la demo');
const pestana = (nombre) => pasos(entrar, (page) => page.locator('.tabs button', { hasText: nombre }).click());
const sincronizado = (nombre) => pasos(pestana('HubSpot'), tocar('Reiniciar demo'), tocar('Sincronizar todo'), (page) => page.waitForTimeout(500),
  (page) => page.locator('.tabs button', { hasText: nombre }).click());

const CAPTURAS = [
  // Portadas
  { nombre: '00-bienvenida', plana: true },
  { nombre: '00-panel', plana: true, accion: entrar },
  { nombre: '00-onboarding', plana: true, accion: pestana('Onboarding') },
  { nombre: '00-celular', plana: true, viewport: CELULAR, accion: entrar },

  // 1. Producto
  {
    nombre: 'p01-promesa', viewport: MEDIO,
    zona: [{ s: '.bienvenida h1' }, { s: '.pasos-intro' }], margen: 16,
    notas: [
      { s: '.bienvenida h1', label: 'La promesa: acompañar al cliente de la primera charla al próximo pedido' },
      { s: '.bajada', label: 'HubSpot se nombra una vez: lo que importa es no cargar dos veces' },
      { s: '.pasos-intro li', n: 0, label: 'Cuatro pasos que cualquiera del equipo entiende' },
      { s: '.pasos-intro li', n: 3, label: 'El cierre del ciclo: saber quién lleva días sin novedades' },
    ],
  },
  {
    nombre: 'p02-para-llamar', accion: entrar,
    zona: [{ s: '.grid .card', n: 0 }], margen: 10,
    notas: [
      { t: 'Para llamar hoy', exacto: true, label: 'La lista de la mañana: a quién hay que llamar' },
      { s: '.fila', n: 0, label: 'Del más frío al más reciente' },
      { s: '.dias', n: 0, label: 'Los días sin novedades, en grande y en ámbar' },
    ],
  },
  {
    nombre: 'p03-onboarding', viewport: MEDIO, accion: pestana('Onboarding'),
    zona: [{ s: 'article.cliente', n: 1 }], margen: 10,
    notas: [
      { s: 'article.cliente .anillo', n: 1, label: 'El avance del cliente, de un vistazo' },
      { s: 'article.cliente .check li.hecho', n: 1, label: 'Cada paso cumplido guarda su fecha' },
      { s: 'article.cliente .btn.chico', n: 1, label: 'Sólo el paso que toca tiene botón: los pasos van en orden' },
    ],
  },

  // 2. Diseño
  {
    nombre: 'd01-barra', viewport: CELULAR, accion: entrar,
    zona: [{ s: 'header.barra' }], margen: 0,
    notas: [
      { s: 'header .marca', en: 'abajo', label: 'El isotipo: un punto y un check' },
      { s: '.tabs', en: 'abajo', label: 'Cuatro secciones, siempre a la vista' },
      { s: '#estado-hs', en: 'abajo', label: 'El estado de la conexión, sin entrar a ajustes' },
    ],
  },
  {
    nombre: 'd02-pasos', viewport: CELULAR,
    zona: [{ s: '.pasos-intro' }, { t: 'Entrar a la demo' }], margen: 10,
    notas: [
      { s: '.pasos-intro b', n: 0, label: 'Números grandes en fucsia: el orden se entiende sin leer' },
      { s: '.pasos-intro small', n: 1, label: 'Cada paso dice qué pasa en HubSpot' },
      { t: 'Entrar a la demo', label: 'Una sola acción principal' },
      { t: 'Datos ficticios', label: 'La aclaración de los datos, a la vista' },
    ],
  },
  {
    nombre: 'd03-tarjeta', viewport: MEDIO, accion: pestana('Onboarding'),
    zona: [{ s: 'article.cliente', n: 0 }], margen: 10,
    notas: [
      { s: 'article.cliente h3', n: 0, label: 'Nombre, empresa y email: lo que pide HubSpot' },
      { s: 'article.cliente .anillo', n: 0, label: 'Anillo con el avance en cuartos' },
      { s: 'article.cliente .actual', n: 0, label: 'El paso actual se resalta en fucsia' },
      { s: 'article.cliente .nota', n: 0, label: 'El id del contacto, para encontrarlo allá' },
    ],
  },
  {
    nombre: 'd04-celular', viewport: CELULAR, accion: pestana('Onboarding'),
    zona: [{ s: 'header.barra' }, { s: 'article.cliente', n: 0 }], margen: 0, alto: 760,
    notas: [
      { s: '.tabs', label: 'En el celular las pestañas se deslizan, no se esconden' },
      { t: '+ Cliente nuevo', label: 'Alta de cliente a un toque' },
      { s: 'article.cliente .btn.chico', n: 0, label: 'Botones con área táctil cómoda' },
    ],
  },

  // 3. Programación
  {
    nombre: 'f01-hubspot', viewport: CELULAR, accion: sincronizado('HubSpot'),
    zona: [{ s: '.grid' }], margen: 10,
    notas: [
      { t: 'Cliente → Contacto', label: 'Cliente → contacto, buscado por email para no duplicar' },
      { t: 'Pedido → Negocio', label: 'Pedido → negocio asociado, con su etapa' },
      { t: 'HubSpot → Offix', label: 'Y de vuelta: webhook firmado' },
      { s: '.registro li', n: 0, label: 'Sin token, el registro dice qué se habría enviado' },
    ],
  },
  {
    nombre: 'f02-pedidos', viewport: MEDIO, accion: sincronizado('Pedidos'),
    zona: [{ s: 'table tr', n: 0 }, { s: 'table tr', n: 5 }], margen: 8, ancho: 620,
    notas: [
      { s: 'table select', n: 0, label: 'Cambiar la etapa hace un PATCH al negocio' },
      { s: 'table td', n: 1, label: 'Empresa y producto forman el nombre del negocio' },
      { s: 'table td', n: 2, label: 'Monto en pesos: viaja como amount' },
    ],
  },

  // 4. Datos
  {
    nombre: 'da01-kpis', viewport: CELULAR, accion: entrar,
    zona: [{ s: '.kpis' }], margen: 8,
    notas: [
      { s: '.kpi', n: 1, en: 'abajo', label: 'Clientes en onboarding' },
      { s: '.kpi', n: 2, en: 'abajo', label: 'El indicador que más importa: sin novedades' },
      { s: '.kpi', n: 3, en: 'abajo', label: 'Dinero de pedidos entregados' },
    ],
  },
  {
    nombre: 'da02-embudo', accion: entrar,
    zona: [{ s: '.card.embudo' }], margen: 8,
    notas: [
      { s: '.etapa', n: 0, label: 'Cada etapa con cantidad y monto' },
      { s: '.etapa', n: 2, label: 'Señado: el dinero comprometido' },
      { s: '.etapa.perdido', label: 'Lo perdido también se mide' },
    ],
  },
  {
    nombre: 'da03-umbral', viewport: CELULAR, accion: pasos(entrar, (page) => page.selectOption('#limite', '30')),
    zona: [{ s: '.titulo' }, { s: '.kpis' }], margen: 8,
    notas: [
      { s: '#limite', label: 'El umbral se cambia: 7, 14 o 30 días' },
      { s: '.kpi', n: 2, en: 'abajo', label: 'Con 30 días quedan sólo los más fríos' },
    ],
  },
];

function locator(page, nota) {
  const loc = nota.s ? page.locator(nota.s) : page.getByText(nota.t, { exact: Boolean(nota.exacto) });
  return nota.n === -1 ? loc.last() : loc.nth(nota.n ?? 0);
}

async function rect(page, nota) {
  const loc = locator(page, nota);
  const visible = await loc.isVisible().catch(() => false);
  if (!visible) return null;
  return loc.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  });
}

const ANCHO_IMAGEN = 640;
const ANCHO_ETIQUETA = 360;
// Marco con la paleta del portfolio; etiquetas en el fucsia de Offix con texto grafito.
const FONDO = 'linear-gradient(135deg,#F5F3FF,#E0F2FE)';
const SOMBRA = '0 20px 50px rgba(17,17,20,.22),0 0 0 1px rgba(255,62,165,.30)';
const ACENTO = '#FF3EA5';
const TINTA = '#111114';

async function enMarco(browser, png, ancho, alto, notas, file) {
  const k = Math.min(1.6, ANCHO_IMAGEN / ancho);
  const pad = 40;
  const imgW = ancho * k;
  const imgH = alto * k;
  const lx = pad + imgW + 70;
  const W = Math.ceil(notas.length ? lx + ANCHO_ETIQUETA + pad : pad * 2 + imgW);
  const pts = notas.map((n) => {
    const bx = pad + Math.max(0, n.cx - 4) * k;
    const by = pad + Math.max(0, n.cy - 4) * k;
    const bw = (Math.min(ancho, n.cx + n.w + 4) - Math.max(0, n.cx - 4)) * k;
    const bh = (Math.min(alto, n.cy + n.h + 4) - Math.max(0, n.cy - 4)) * k;
    return { label: n.label, bx, by, bw, bh, tx: pad + imgW + 6, ty: by + bh / 2 };
  });
  pts.sort((a, b) => a.ty - b.ty).forEach((p, i) => (p.i = i + 1));
  console.log(pts.map((p) => `    ${p.i}. ${p.label}`).join('\n'));
  const page = await browser.newPage({ viewport: { width: W, height: 400 }, deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><html><head><style>
    body{margin:0;width:${W}px;background:${FONDO};font-family:Inter,system-ui,sans-serif;position:relative}
    img{position:absolute;left:${pad}px;top:${pad}px;width:${imgW}px;border-radius:18px;box-shadow:${SOMBRA}}
    .tag{position:absolute;left:${lx}px;width:${ANCHO_ETIQUETA}px;box-sizing:border-box;display:flex;align-items:flex-start;gap:12px;padding:14px 18px;border-radius:20px;background:${ACENTO};color:${TINTA};font-weight:600;font-size:22px;line-height:1.3;box-shadow:0 8px 20px rgba(15,23,42,.18)}
    .n{flex:none;width:32px;height:32px;border-radius:50%;background:${TINTA};color:${ACENTO};display:grid;place-items:center;font-size:18px;font-weight:800}
    svg{position:absolute;left:0;top:0;overflow:visible}
  </style></head><body>
    <img src="data:image/png;base64,${png.toString('base64')}" />
    ${pts.map((p) => `<div class="tag"><span class="n">${p.i}</span><span>${p.label}</span></div>`).join('')}
    <svg id="flechas"></svg>
  </body></html>`);
  await page.evaluate(({ pts, pad, imgH, lx, color }) => {
    const tags = [...document.querySelectorAll('.tag')];
    const orden = pts.map((p, i) => ({ ...p, el: tags[i] })).sort((a, b) => a.ty - b.ty);
    let piso = pad;
    for (const p of orden) {
      const h = p.el.offsetHeight;
      p.top = Math.max(piso, p.ty - h / 2);
      p.el.style.top = `${p.top}px`;
      p.sy = p.top + Math.min(h / 2, 30);
      piso = p.top + h + 16;
    }
    const H = Math.ceil(Math.max(pad * 2 + imgH, piso + pad - 16));
    document.body.style.height = `${H}px`;
    const svg = document.getElementById('flechas');
    svg.setAttribute('width', document.body.offsetWidth);
    svg.setAttribute('height', H);
    svg.innerHTML = orden
      .map((p) => {
        const sx = lx - 4;
        const mx = (sx + p.tx) / 2;
        const caja = `<rect x="${p.bx}" y="${p.by}" width="${p.bw}" height="${p.bh}" rx="10" fill="none" stroke="${color}" stroke-width="4"/>`;
        return caja + `<path d="M${sx},${p.sy} C${mx},${p.sy} ${mx},${p.ty} ${p.tx},${p.ty}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="${p.tx}" cy="${p.ty}" r="9" fill="${color}" stroke="#fff" stroke-width="3"/>`;
      })
      .join('');
  }, { pts, pad, imgH, lx, color: ACENTO });
  const H = await page.evaluate(() => document.body.offsetHeight);
  await page.setViewportSize({ width: W, height: H });
  await page.screenshot({ path: file });
  await page.close();
}

// Código del servidor como tarjeta oscura (grafito) con resaltado simple en fucsia.
async function codigo(browser, archivo, desde, hasta, titulo, file) {
  const crudas = readFileSync(archivo, 'utf8').split('\n').slice(desde - 1, hasta);
  const sangria = Math.min(...crudas.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  const lineas = crudas.map((l) => l.slice(sangria));
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const resaltar = (l) => /^\s*\/\//.test(l) ? `<i class="c">${esc(l)}</i>` : esc(l)
    .replace(/("[^"]*"|`[^`]*`)/g, '<i class="s">$1</i>')
    .replace(/\b(export|function|async|await|const|let|return|if|throw|new|import|from|type|interface)\b/g, '<i class="k">$1</i>');
  const page = await browser.newPage({ viewport: { width: 1300, height: 400 }, deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><html><head><style>
    body{margin:0;padding:40px;background:${FONDO};font-family:Inter,system-ui,sans-serif;display:inline-block}
    .card{background:#111114;border-radius:18px;box-shadow:${SOMBRA};overflow:hidden;width:max-content;max-width:1150px}
    .bar{padding:12px 18px;color:#FFD6EC;font-size:15px;border-bottom:1px solid #26262E}
    pre{margin:0;padding:18px 22px;white-space:pre-wrap;color:#F5F5F7;font:15px/1.6 "JetBrains Mono",ui-monospace,monospace}
    .n{display:inline-block;width:2.6em;color:#6A6A76;user-select:none}
    i{font-style:normal}.k{color:#FF3EA5}.s{color:#7FE3C2}.c{color:#9A9AA6}
  </style></head><body><div class="card"><div class="bar">${esc(titulo)}</div><pre>${lineas
    .map((l, i) => `<span class="n">${desde + i}</span>${resaltar(l)}`).join('\n')}</pre></div></body></html>`);
  const caja = await page.locator('body').boundingBox();
  await page.setViewportSize({ width: Math.ceil(caja.width), height: Math.ceil(caja.height) });
  await page.screenshot({ path: file });
  await page.close();
}

const browser = await chromium.launch();
for (const cap of CAPTURAS) {
  if (SOLO && cap.nombre !== SOLO) continue;
  const ctx = await browser.newContext({ viewport: cap.viewport ?? ESCRITORIO, deviceScaleFactor: 2, locale: 'es-AR' });
  const page = await ctx.newPage();
  await page.goto(BASE + (cap.ruta ?? '/'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  if (cap.accion) {
    await cap.accion(page);
    await page.waitForTimeout(800);
  }
  let clip = { x: 0, y: 0, width: page.viewportSize().width, height: Math.min(page.viewportSize().height, 900) };
  if (cap.zona) {
    const rs = [];
    for (const z of cap.zona) {
      const r = await rect(page, z);
      if (!r) throw new Error(`${cap.nombre}: no encontré la zona ${z.s ?? z.t}`);
      rs.push(r);
    }
    const m = cap.margen ?? 16;
    const x = Math.max(0, Math.min(...rs.map((r) => r.x)) - m);
    const y = Math.max(0, Math.min(...rs.map((r) => r.y)) - m);
    const x2 = Math.max(...rs.map((r) => r.x + r.w)) + m;
    const y2 = Math.max(...rs.map((r) => r.y + r.h)) + m;
    clip = { x, y, width: Math.min(cap.ancho ?? Infinity, x2 - x, page.viewportSize().width - x), height: Math.min(cap.alto ?? Infinity, y2 - y) };
  }
  clip = { x: Math.round(clip.x), y: Math.round(clip.y), width: Math.round(clip.width), height: Math.round(clip.height) };
  const notas = [];
  for (const n of cap.notas ?? []) {
    const r = await rect(page, n);
    if (r) notas.push({ ...n, ...r, cx: r.x - clip.x, cy: r.y - clip.y });
    else console.warn('  sin elemento:', cap.nombre, n.label);
  }
  const png = await page.screenshot({ clip, fullPage: clip.y + clip.height > page.viewportSize().height });
  await enMarco(browser, png, clip.width, clip.height, notas, join(OUT, `${cap.nombre}.png`));
  console.log('ok', cap.nombre, `${notas.length}/${(cap.notas ?? []).length}`, `${clip.width}×${clip.height}`);
  await ctx.close();
}

// Tarjetas de código: [nombre, archivo, texto con el que empieza, cuántas líneas, título].
const raiz = new URL('../../', import.meta.url).pathname;
const CODIGO = [
  ['f03-contacto-codigo', 'src/hubspot.ts', '  // Alta o actualización por email', 8, 'src/hubspot.ts · el email es la llave: no se duplica'],
  ['f04-firma-codigo', 'src/hubspot.ts', '// Firma v3 de los webhooks', 15, 'src/hubspot.ts · webhooks firmados y con vencimiento'],
  ['f05-seguimiento-codigo', 'src/seguimiento.ts', 'export function sinNovedades', 7, 'src/seguimiento.ts · quién se está enfriando'],
];
for (const [nombre, archivo, inicio, cuantas, titulo] of CODIGO) {
  if (SOLO && SOLO !== nombre) continue;
  const ruta = join(raiz, archivo);
  const desde = readFileSync(ruta, 'utf8').split('\n').findIndex((l) => l.startsWith(inicio)) + 1;
  await codigo(browser, ruta, desde, desde + cuantas - 1, titulo, join(OUT, `${nombre}.png`));
  console.log('ok', nombre);
}
await browser.close();
