// Estilo de Ruth (su reel del sofá): frase entera de golpe, centrada a media altura,
// serif estrecha en crema, un solo tamaño, palabra clave en MAYÚSCULAS.
const { chromium } = require('playwright');
const frases = [
  'Terminas el tratamiento<br>tres semanas<br>GENIAL',
  'Y de repente…<br>otra vez HINCHADA',
  'El tratamiento<br>ataca las bacterias<br>pero no el<br>MOTIVO',
  'Sígueme<br>si estás cansada de<br>empezar de cero',
];
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&display=swap');
*{margin:0;padding:0} body{width:1080px;height:1920px;background:transparent}
.t{position:absolute;left:0;right:0;text-align:center;font-family:'Playfair Display',serif;font-weight:500;color:#fff4c7;
   font-size:92px;line-height:1.0;transform:scaleX(.8);text-shadow:0 2px 10px rgba(60,40,25,.45)}`;
const portada = `<div style="position:absolute;inset:0;background:url(IMG_6186.jpg) center 22%/cover"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(40,28,20,0) 35%,rgba(40,28,20,.35) 55%,rgba(40,28,20,.55) 100%)"></div>
<div class="t" style="top:1080px;font-size:118px">Por qué VUELVE<br>el SIBO tras<br>el tratamiento</div>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (let i = 0; i < frases.length; i++) {
    await p.setContent(`<html><head><style>${CSS}</style></head><body><div class="t" style="top:960px">${frases[i]}</div></body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `frase-${i + 1}.png`, omitBackground: true });
  }
  require('fs').writeFileSync('portada.html', `<html><head><style>${CSS}</style></head><body style="background:#000">${portada}</body></html>`);
  await p.goto('file://' + process.cwd() + '/portada.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'portada.jpg', type: 'jpeg', quality: 92 });
  await b.close();
})();
