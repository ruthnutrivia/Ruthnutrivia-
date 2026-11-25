const { chromium } = require('playwright');
const fs = require('fs');
const img = 'data:image/jpeg;base64,' + fs.readFileSync('partido.jpg').toString('base64');
const html = `<html><head><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=Inter:wght@400;500&display=swap" rel="stylesheet"></head>
<body style="margin:0;width:1080px;height:1920px;position:relative;overflow:hidden;background:#000">
<img src="${img}" style="position:absolute;left:0;top:300px;width:100%;height:1620px;object-fit:cover;object-position:center 0%"><div style="position:absolute;left:0;right:0;top:0;height:300px;background:#0b0d0c"></div>
<div style="position:absolute;left:0;right:0;top:0;height:560px;background:linear-gradient(180deg,rgba(0,0,0,.65),rgba(0,0,0,0))"></div>
<div style="position:absolute;left:0;right:0;top:95px;text-align:center;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.6)">
  <div style="font-family:'Playfair Display',serif;font-weight:600;font-size:88px">Plan de <i style="font-weight:500">miércoles</i></div>
  <div style="font-family:Inter,sans-serif;font-weight:500;font-size:40px;letter-spacing:.06em;margin-top:18px">Copa Catalunya · Hospitalet vs Espanyol</div>
</div>
<div style="position:absolute;left:70px;bottom:230px;font-size:96px;filter:drop-shadow(0 4px 10px rgba(0,0,0,.5))">⚽👩‍❤️‍👨</div>
</body></html>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'historia-partido.jpg', type: 'jpeg', quality: 93 }); await b.close(); })();
