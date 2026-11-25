// Reel del paseo (C1 «tripa plana por la mañana»): frase blanca, palabra clave en amarillo suave,
// estilo de Ruth (frase entera de golpe, centrada, serif estrecha, clave en mayúsculas).
const { chromium } = require('playwright');
const frases = [
  '¿Por qué por la mañana<br>tienes la tripa <span>PLANA</span>',
  'y por la tarde<br>pareces de 5 <span>MESES</span>?',
  'No es casualidad:<br>tiene <span>EXPLICACIÓN</span>',
  'Te lo explico<br>en la <span>DESCRIPCIÓN</span> 👇',
];
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&display=swap');
*{margin:0;padding:0} body{width:1080px;height:1920px;background:transparent}
.t{position:absolute;left:0;right:0;top:300px;text-align:center;font-family:'Playfair Display',serif;font-weight:500;color:#ffffff;
   font-size:98px;line-height:1.02;transform:scaleX(.8);text-shadow:0 2px 12px rgba(20,30,15,.55),0 0 3px rgba(20,30,15,.4)}
span{color:#ffe7a3;font-weight:600}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (let i = 0; i < frases.length; i++) {
    await p.setContent(`<html><head><style>${CSS}</style></head><body><div class="t">${frases[i]}</div></body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `paseo-${i + 1}.png`, omitBackground: true });
  }
  await b.close();
})();
