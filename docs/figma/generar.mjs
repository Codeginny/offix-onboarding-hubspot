// Genera docs/figma/offix-figma.js con los datos actuales de la demo embebidos.
// Uso: con el servidor andando, `node docs/figma/generar.mjs`; después se pega el resultado en Scripter.
import fs from 'node:fs';
const base = process.env.DEMO || 'http://localhost:5180';
await fetch(base + '/api/reiniciar', { method: 'POST' });
await fetch(base + '/api/sincronizar', { method: 'POST' });
const d = await (await fetch(base + '/api/estado?dias=14')).json();
const datos = {
  pasos: d.pasos.map(({ id, nombre }) => ({ id, nombre })),
  etapas: Object.fromEntries(Object.entries(d.etapas).map(([k, v]) => [k, v.nombre])),
  clientes: d.clientes.map((c) => ({ id: c.id, nombre: c.nombre, empresa: c.empresa, email: c.email, hubspotId: c.hubspotId, pasoActual: c.pasoActual,
    pasos: Object.fromEntries(Object.entries(c.pasos).map(([k, v]) => [k, v.fecha])) })),
  pedidos: d.clientes.flatMap((c) => c.pedidos.map((p) => ({ empresa: c.empresa, producto: p.producto, monto: p.monto, etapa: p.etapa, hubspotId: p.hubspotId }))),
  sinNovedades: d.sinNovedades, embudo: d.embudo,
};
const plantilla = fs.readFileSync(new URL('./plantilla-figma.js', import.meta.url), 'utf8');
fs.writeFileSync(new URL('./offix-figma.js', import.meta.url), plantilla.replace('/*DATOS*/null', JSON.stringify(datos)));
console.log('Listo: docs/figma/offix-figma.js', (fs.statSync(new URL('./offix-figma.js', import.meta.url)).size / 1024).toFixed(1), 'KB');
