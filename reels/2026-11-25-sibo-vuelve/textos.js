const { chromium } = require('playwright');
const fs = require('fs');
// Estilo de los reels de prueba de Ruth: serif tipo Garamond, oscura, centrada sobre la pared, palabra clave en cursiva.
const textos = [
  'Terminas el tratamiento<br>del SIBO.<br>Tres semanas <i>genial</i>.',
  'Y de repente…<br>otra vez <i>hinchada</i>.',
  'El tratamiento ataca<br>las bacterias, pero <i>no</i><br>el motivo por el que crecieron.',
  'Sígueme si estás cansada<br>de <i>empezar de cero</i>.',
];
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@300;400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box} body{width:1080px;height:1920px;background:transparent}
.t{position:absolute;left:60px;right:60px;top:300px;text-align:center;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:86px;line-height:1.12;color:#3b2a22;
   text-shadow:0 0 18px rgba(255,255,255,.55)}
i{font-weight:600}`;
const portada = `<div style="position:absolute;inset:0;background:url(IMG_6186.jpg) center 25%/cover"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(42,30,24,.05) 0%,rgba(42,30,24,.1) 40%,rgba(42,30,24,.8) 66%,rgba(42,30,24,.9) 100%)"></div>
<div style="position:absolute;left:90px;right:90px;bottom:400px;color:#f4ece2">
<span style="display:inline-block;font-family:Inter;font-weight:600;font-size:30px;letter-spacing:.24em;background:#f4ece2;color:#b05e51;padding:16px 34px;border-radius:40px">SIBO</span>
<div style="font-family:'Cormorant Garamond';font-weight:600;font-size:132px;line-height:1;color:#ecc5b7;margin-top:36px">Por qué <i>vuelve</i> el SIBO tras el tratamiento</div>
<div style="width:90px;height:3px;background:#f4ece2;margin:44px 0 30px"></div>
<div style="font-family:Inter;font-weight:300;font-size:44px">El error de las recaídas.</div></div>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (let i = 0; i < textos.length; i++) {
    await p.setContent(`<html><head><style>${CSS}</style></head><body><div class="t">${textos[i]}</div></body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `texto-${i + 1}.png`, omitBackground: true });
  }
  fs.writeFileSync('portada.html', `<html><head><style>${CSS}</style></head><body style="background:#000">${portada}</body></html>`);
  await p.goto('file://' + process.cwd() + '/portada.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'portada.jpg', type: 'jpeg', quality: 92 });
  await b.close();
})();
