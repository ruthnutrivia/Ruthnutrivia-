const { chromium } = require('playwright');
const fs = require('fs');
const img = 'data:image/jpeg;base64,' + fs.readFileSync('foto-historia-preguntas.jpg').toString('base64');
const html = `<html><head><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet"></head>
<body style="margin:0;width:1125px;height:2000px;position:relative;font-family:Inter,sans-serif;overflow:hidden">
<img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
<!-- 1 texto principal (el tuyo) -->
<div style="position:absolute;left:110px;right:110px;top:200px;background:#2b1f1c;color:#f6c6d3;font-size:54px;line-height:1.35;text-align:center;padding:26px 30px">¿A qué hora empiezas a<br>notar la hinchazón? Te leo 💗</div>
<!-- 2 frase pequeña -->
<div style="position:absolute;left:0;right:0;top:450px;text-align:center"><span style="background:#f6efe6;color:#5b4033;font-size:36px;font-weight:500;padding:14px 26px;border-radius:14px">Te explico por qué pasa en el reel de hoy 👆</span></div>
<!-- 3 taza -->
<div style="position:absolute;right:70px;top:1180px;font-size:150px;transform:rotate(8deg)">☕</div>
<!-- 4 caja de preguntas -->
<div style="position:absolute;left:150px;right:150px;top:1560px;background:#fff;border-radius:34px;box-shadow:0 10px 30px rgba(0,0,0,.25);overflow:hidden">
  <div style="background:linear-gradient(90deg,#f2b8a8,#e8a0b0);color:#fff;font-size:42px;font-weight:600;text-align:center;padding:30px 20px">Te leo 💗</div>
  <div style="background:#f3f3f3;margin:26px;border-radius:20px;color:#999;font-size:34px;text-align:center;padding:28px">Ej.: después de comer, a media tarde…</div>
</div>
<!-- etiquetas guía -->
${[['1',200],['2',450],['3',1200],['4',1560]].map(([n,t])=>`<div style="position:absolute;left:28px;top:${t}px;width:66px;height:66px;border-radius:50%;background:#b05e51;color:#fff;font-size:38px;font-weight:600;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3)">${n}</div>`).join('')}
</body></html>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1125, height: 2000 } });
  await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'maqueta-historia-preguntas.png' }); await b.close(); })();
