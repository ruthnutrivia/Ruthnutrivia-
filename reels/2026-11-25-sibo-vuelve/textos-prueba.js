// Estilo de los reels de prueba de Ruth («La nutrición no puede prometerte felicidad…»):
// serif con contraste estrechada (Playfair Display), crema claro, líneas muy juntas de distinto tamaño
// que aparecen una a una, palabra clave grande en amarillo intenso.
const { chromium } = require('playwright');
const fs = require('fs');
const segs = [
  { ini: 0, fin: 3.5, lineas: [['Terminas el', 84], ['tratamiento', 121], ['tres semanas', 84], ['genial.', 174, 1]] },
  { ini: 3.5, fin: 7, lineas: [['Y de repente…', 100], ['otra vez', 84], ['hinchada.', 185, 1]] },
  { ini: 7, fin: 11, lineas: [['El tratamiento', 92], ['ataca las bacterias,', 77], ['pero no el', 92], ['motivo.', 185, 1]] },
  { ini: 11, fin: 14.5, lineas: [['Sígueme', 137], ['si estás cansada de', 77], ['empezar de cero.', 137, 1]] },
];
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&display=swap');
*{margin:0;padding:0} body{width:1080px;height:1920px;background:transparent}
.b{position:absolute;left:0;right:0;top:70px;text-align:center;font-family:'Playfair Display',serif;font-weight:500;color:#fff4c2;
   transform:scaleX(.76);text-shadow:0 1px 6px rgba(70,50,30,.35)}
.l{line-height:.86;letter-spacing:-.005em} .g{color:#f7c600;font-weight:600}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const plan = [];
  for (let s = 0; s < segs.length; s++) {
    const sg = segs[s], n = sg.lineas.length, ventana = (sg.fin - sg.ini) * 0.55;
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
