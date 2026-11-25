// Estilo de los reels de prueba de Ruth: serif estrecha crema, líneas apiladas de distinto tamaño
// que aparecen una a una, palabra clave grande en amarillo dorado.
const { chromium } = require('playwright');
const fs = require('fs');
const segs = [
  { ini: 0, fin: 3.5, lineas: [['Terminas', 96], ['el tratamiento', 74], ['del SIBO.', 112], ['Tres semanas', 74], ['genial.', 150, 1]] },
  { ini: 3.5, fin: 7, lineas: [['Y de repente…', 96], ['otra vez', 84], ['hinchada.', 170, 1]] },
  { ini: 7, fin: 11, lineas: [['El tratamiento', 90], ['ataca las bacterias', 70], ['pero', 62], ['no el', 96], ['motivo', 160, 1], ['por el que crecieron.', 66]] },
  { ini: 11, fin: 14.47, lineas: [['Sígueme', 130], ['si estás cansada de', 70], ['empezar', 104], ['de cero.', 160, 1]] },
];
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap');
*{margin:0;padding:0} body{width:1080px;height:1920px;background:transparent}
.b{position:absolute;left:40px;right:40px;top:230px;text-align:center;font-family:'Instrument Serif',serif;color:#fff3c4;
   text-shadow:0 2px 14px rgba(60,40,20,.45),0 0 2px rgba(60,40,20,.35)}
.l{line-height:.98;letter-spacing:-.01em} .g{color:#f6c445}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const plan = [];
  for (let s = 0; s < segs.length; s++) {
    const sg = segs[s], n = sg.lineas.length, ventana = (sg.fin - sg.ini) * 0.6;
    for (let k = 1; k <= n; k++) {
      const html = sg.lineas.map(([t, px, g], i) => `<div class="l${g ? ' g' : ''}" style="font-size:${px}px;visibility:${i < k ? 'visible' : 'hidden'}">${t}</div>`).join('');
      await p.setContent(`<html><head><style>${CSS}</style></head><body><div class="b">${html}</div></body></html>`, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      const f = `paso-${s + 1}-${k}.png`;
      await p.screenshot({ path: f, omitBackground: true });
      const a = sg.ini + ventana * (k - 1) / n, z = k < n ? sg.ini + ventana * k / n : sg.fin;
      plan.push({ f, a: +a.toFixed(3), z: +z.toFixed(3) });
    }
  }
  fs.writeFileSync('plan.json', JSON.stringify(plan));
  await b.close();
})();
