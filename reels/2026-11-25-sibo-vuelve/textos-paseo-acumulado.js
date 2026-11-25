// Reel del paseo: el texto se va quedando en pantalla (se acumula frase a frase).
const { chromium } = require('playwright');
const frases = [
  '¿Por qué por la mañana<br>tienes la tripa <span>PLANA</span>',
  'y por la tarde<br>pareces de 5 <span>MESES</span>?',
  'No es casualidad:<br>tiene <span>EXPLICACIÓN</span>',
  'Te lo explico en la <span>DESCRIPCIÓN</span> 👇',
];
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&display=swap');
*{margin:0;padding:0} body{width:1080px;height:1920px;background:transparent}
.t{position:absolute;left:0;right:0;top:50%;margin-top:-290px;text-align:center;font-family:'Playfair Display',serif;font-weight:600;color:#fff;
   font-size:72px;line-height:1.02;transform:scaleX(.82);text-shadow:0 0 2px rgba(0,0,0,.9),0 2px 6px rgba(0,0,0,.75),0 4px 22px rgba(0,0,0,.55)}
.f{margin-bottom:20px;white-space:nowrap} span{color:#ffdf7e;font-weight:700}
.banda{position:absolute;left:0;right:0;top:50%;height:760px;margin-top:-380px;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.38) 22%,rgba(0,0,0,.38) 78%,rgba(0,0,0,0) 100%)}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (let k = 1; k <= frases.length; k++) {
    const html = frases.map((f, i) => `<div class="f" style="visibility:${i < k ? 'visible' : 'hidden'}">${f}</div>`).join('');
    await p.setContent(`<html><head><style>${CSS}</style></head><body><div class="banda"></div><div class="t">${html}</div></body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `acum-${k}.png`, omitBackground: true });
  }
  await b.close();
})();
