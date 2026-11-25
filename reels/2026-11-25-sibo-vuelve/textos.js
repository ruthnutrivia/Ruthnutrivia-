const { chromium } = require('playwright');
const fs = require('fs');
const textos = [
  'Terminas el tratamiento del SIBO.<br><em>Tres semanas genial.</em>',
  'Y de repente…<br><em>otra vez hinchada.</em>',
  'El tratamiento ataca las bacterias,<br>pero <em>no el motivo</em> por el que crecieron.',
  'Sígueme si estás cansada de<br><em>empezar de cero.</em>',
];
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,600;1,8..60,500&family=Inter:wght@300;400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box} body{width:1080px;height:1920px;background:transparent}
.card{position:absolute;left:70px;right:70px;top:420px;background:rgba(246,239,230,.95);border-left:14px solid #d48b80;border-radius:0 40px 40px 0;
 padding:56px 60px;font-family:'Source Serif 4',serif;font-weight:600;font-size:66px;line-height:1.25;color:#5b4033;box-shadow:0 18px 40px rgba(0,0,0,.18)}
em{font-style:italic;font-weight:500;color:#b05e51}`;
const portada = `<div style="position:absolute;inset:0;background:url(portada-frame.jpg) center/cover"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(246,239,230,.55) 0%,rgba(246,239,230,.35) 45%,rgba(246,239,230,0) 55%)"></div>
<div style="position:absolute;left:90px;right:90px;top:330px;color:#5b4033">
<span style="display:inline-block;font-family:Inter;font-weight:600;font-size:30px;letter-spacing:.24em;background:#b05e51;color:#f4ece2;padding:16px 34px;border-radius:40px">SIBO</span>
<div style="font-family:'Source Serif 4';font-weight:600;font-size:118px;line-height:1.04;color:#5b4033;margin-top:36px">Por qué <i style="font-weight:500;color:#b05e51">vuelve</i> el SIBO tras el tratamiento</div>
<div style="width:90px;height:3px;background:#d48b80;margin:44px 0 30px"></div>
<div style="font-family:Inter;font-weight:400;font-size:44px;color:#6e5649">El error de las recaídas.</div></div>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (let i = 0; i < textos.length; i++) {
    await p.setContent(`<html><head><style>${CSS}</style></head><body><div class="card">${textos[i]}</div></body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `texto-${i + 1}.png`, omitBackground: true });
  }
  fs.writeFileSync('portada.html', `<html><head><style>${CSS}</style></head><body style="background:#000">${portada}</body></html>`);
  await p.goto('file://' + process.cwd() + '/portada.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'portada.jpg', type: 'jpeg', quality: 92 });
  await b.close();
})();
