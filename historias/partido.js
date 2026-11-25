// Historia del partido con aspecto de texto nativo de Instagram (sin franja, letra sobre la foto).
const { chromium } = require('playwright');
const fs = require('fs');
const img = 'data:image/jpeg;base64,' + fs.readFileSync('partido.jpg').toString('base64');
const html = `<html><head><link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap" rel="stylesheet"></head>
<body style="margin:0;width:1080px;height:1920px;position:relative;overflow:hidden;background:#000">
<img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 0%">
<div style="position:absolute;left:0;right:0;top:1330px;text-align:center;font-family:Inter,sans-serif;line-height:1.25">
  <span style="display:inline-block;background:#fff;color:#111;font-weight:600;font-size:58px;padding:10px 26px;border-radius:14px">Plan de miércoles</span><br>
  <span style="display:inline-block;margin-top:14px;color:#fff;font-weight:600;font-size:40px;text-shadow:0 2px 8px rgba(0,0,0,.75)">Copa Catalunya · Hospitalet vs Espanyol</span>
</div>
</body></html>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'historia-partido.jpg', type: 'jpeg', quality: 93 }); await b.close(); })();
