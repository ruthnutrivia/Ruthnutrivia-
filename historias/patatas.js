const { chromium } = require('playwright');
const fs = require('fs');
const img = 'data:image/jpeg;base64,' + fs.readFileSync('patatas.jpg').toString('base64');
const html = `<html><head><link href="https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap" rel="stylesheet"></head>
<body style="margin:0;width:1080px;height:1920px;position:relative;overflow:hidden;background:#000">
<img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 40%">
<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Inter,sans-serif;line-height:1.5">
  <span style="background:#fff;color:#111;font-weight:600;font-size:56px;padding:10px 24px;border-radius:14px;box-decoration-break:clone;-webkit-box-decoration-break:clone">Sí, las nutris también comemos</span><br>
  <span style="background:#fff;color:#111;font-weight:600;font-size:56px;padding:10px 24px;border-radius:14px">patatas en el fútbol 😄🍟</span>
</div>
</body></html>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'historia-patatas.jpg', type: 'jpeg', quality: 93 }); await b.close(); })();
