// Estilo del reel de prueba de Ruth «La nutrición no puede prometerte felicidad…»:
// palabras apiladas que aparecen una a una, tamaños muy distintos, crema + clave dorada, centrado.
const { chromium } = require('playwright');
const fs = require('fs');
const lineas = [
  ['Por la mañana', 90], ['tripa', 117], ['PLANA', 232, 1],
  ['y por la tarde', 90], ['de 5 meses', 146],
  ['no es', 81], ['casualidad', 137],
  ['te lo explico en la', 76], ['DESCRIPCIÓN 👇', 144, 1],
];
const DUR = 11.43, VENT = 9.4;
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap');
*{margin:0;padding:0} body{width:1080px;height:1920px;background:transparent}
.b{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%) scaleX(.78);transform-origin:center center;text-align:center;font-family:'Playfair Display',serif;font-weight:600;color:#fff3c4;
   text-shadow:0 0 2px rgba(0,0,0,.8),0 3px 10px rgba(0,0,0,.6),0 6px 28px rgba(0,0,0,.45)}
.l{line-height:.9;white-space:nowrap} .g{color:#f7c600;font-weight:700}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const plan = [], n = lineas.length;
  for (let k = 1; k <= n; k++) {
    const html = lineas.map(([t, px, g], i) => `<div class="l${g ? ' g' : ''}" style="font-size:${px}px;visibility:${i < k ? 'visible' : 'hidden'}">${t}</div>`).join('');
    await p.setContent(`<html><head><style>${CSS}</style></head><body><div class="b">${html}</div></body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const f = `viral-${k}.png`; await p.screenshot({ path: f, omitBackground: true });
    plan.push({ f, a: +(VENT * (k - 1) / n).toFixed(3), z: k < n ? +(VENT * k / n).toFixed(3) : DUR });
  }
  fs.writeFileSync('plan-viral.json', JSON.stringify(plan)); await b.close();
})();
