// Genera las diapositivas de los carruseles (1080x1350) con Playwright.
// Uso: node diciembre/generar-carruseles.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const foto = f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(DIR, 'fotos', f)).toString('base64');

// Texto: **negrita**, ==palabra destacada== (color acento)
const fmt = s => s
  .replace(/==(.+?)==/g, '<span class="acento">$1</span>')
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\n/g, '<br>');

const carruseles = [
  {
    carpeta: '2026-11-27-lo-sano-que-te-hincha',
    navidad: false,
    portada: { titulo: 'Lo ==«sano»== que te está hinchando', sub: 'No todo lo sano te sienta bien', foto: 'ruth-sonrisa.jpg' },
    slides: [
      { titulo: 'Lo hacías por cuidarte…\ny te estaba hinchando', texto: 'Batido verde, ensalada gigante, kéfir…\n¿te suena?' },
      { texto: 'Si comes «sano» y aun así acabas hinchada, **no es dejadez.**\n\nEstás haciendo todo lo que se supone que es saludable.' },
      { texto: 'Pero cuando tienes la tripa sensible, o hay SIBO, algunos alimentos con muy buena fama pueden hincharte más:', lista: ['mucha verdura cruda', 'fermentados como el kéfir o el chucrut', 'legumbres en cantidad'] },
      { titulo: '¿Significa que son malos?', grande: 'No.', texto: 'Ni que tengas que quitarlos para siempre.' },
      { texto: 'Depende de 3 cosas:', lista: ['**cuándo** los tomas', '**cuánto** tomas', 'en qué **momento** estás tú'] },
      { texto: 'Por eso copiar la alimentación «sana» de otra persona **no te funciona.**\n\nTu plan tiene que ajustarse a tu intestino.' },
    ],
    cierre: { texto: '**Guárdalo y sígueme** si quieres dejar de hacer lo «correcto» que no te funciona.' },
  },
  {
    carpeta: '2026-12-01-sibo-5-senales',
    navidad: false,
    portada: { titulo: '==SIBO==: 5 señales que no son solo hinchazón', sub: '¿Cuántas te pasan a ti?', foto: 'ruth-movil.jpg' },
    slides: [
      { num: '1', titulo: 'Te hinchas cada vez más a lo largo del día', texto: 'Por la mañana, bien.\nPor la tarde, el pantalón ya aprieta.' },
      { num: '2', titulo: 'Gases y eructos frecuentes', texto: 'Aunque comas poco y despacio.' },
      { num: '3', titulo: 'Cansancio aunque duermas', texto: 'Te levantas con la misma energía con la que te acostaste.' },
      { num: '4', titulo: 'Alimentos que antes tolerabas ahora te sientan mal', texto: 'Legumbres, cebolla, fruta…\ny la lista crece.' },
      { num: '5', titulo: 'Tu tránsito va a días', texto: 'Estreñimiento unos días,\ndiarrea otros.' },
    ],
    cierre: { texto: 'Si te reconoces en **3 o más**, no lo normalices.\n\nConsúltalo con un profesional: tiene diagnóstico y tiene tratamiento.\n\n**Guárdalo y sígueme.**' },
  },
  {
    carpeta: '2026-12-05-3-claves-navidad',
    navidad: true,
    portada: { titulo: '3 claves para no acabar ==hinchada== en Navidad', sub: 'Disfruta sin miedo a comer', foto: 'ruth-sonrisa.jpg' },
    slides: [
      { texto: '¿Ya estás pensando en cómo vas a acabar después de la cena?\n\nHinchada, con gases y sin poder ni moverte.\n\n**Esto es para ti.**' },
      { num: '1', titulo: 'No llegues en ayunas', texto: 'Saltarte comidas para «compensar» hace que llegues con muchísima hambre, comas rápido y más cantidad.\n\nY eso sí hincha.' },
      { num: '2', titulo: 'Despacio y raciones pequeñas', texto: 'Sírvete un poco de lo que más te apetezca, en vez de picar de todo durante horas.' },
      { num: '3', titulo: 'Un paseo después de comer', texto: '10 o 15 minutos ayudan a tu digestión mucho más que quedarte en el sofá.' },
      { texto: 'Y recuerda: no se trata de comer menos, sino de que tu intestino funcione mejor.\n\n**Y eso se puede trabajar.**' },
    ],
    cierre: { texto: '**Guárdalo** para las fiestas.\n\n**Sígueme** y te enseño a disfrutar de la Navidad sin miedo a comer.' },
  },
  {
    carpeta: '2026-12-08-menu-navidad',
    navidad: true,
    portada: { titulo: 'Qué pedir en el ==menú== de Navidad', sub: 'Si te hinchas con facilidad', foto: 'ruth-sobre-mi.jpg' },
    slides: [
      { texto: '**No es una lista de prohibidos.**\n\nEs una guía para elegir con más tranquilidad.\n\nCada persona tolera cosas distintas.' },
      { titulo: 'Entrantes', mejor: 'Marisco a la plancha, jamón, crema de verduras', cuidado: 'Canapés con mucho pan, ensaladas con cebolla cruda' },
      { titulo: 'Principales', mejor: 'Pescado al horno, carne a la brasa, con patata o arroz', cuidado: 'Guisos con mucha cebolla y ajo, rebozados' },
      { titulo: 'Postres', mejor: 'Naranja o mandarina, un trocito de chocolate negro', cuidado: 'Postres con mucha nata, turrón en cantidad' },
      { titulo: 'Bebida', mejor: 'Agua sin gas, una copa de vino', cuidado: 'Refrescos y bebidas con gas' },
    ],
    cierre: { texto: '**Guárdalo** para el día de la comida.\n\n**Sígueme** y te enseño a disfrutar de la Navidad sin miedo a comer.' },
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@400;500;600&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; font-family: Poppins, sans-serif; color: #4a3b32; overflow: hidden; }
.s { width: 1080px; height: 1350px; position: relative; background: #f7f0e9; padding: 120px 110px; display: flex; flex-direction: column; justify-content: center; }
.acento { color: #b5625a; }
h1 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 76px; line-height: 1.12; }
h2 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 64px; line-height: 1.15; margin-bottom: 40px; }
p { font-size: 44px; line-height: 1.45; }
b { font-weight: 600; }
.num { font-family: 'Playfair Display', serif; font-size: 150px; line-height: 1; color: #d9b8ae; font-weight: 700; margin-bottom: 18px; }
.grande { font-family: 'Playfair Display', serif; font-size: 150px; color: #b5625a; font-weight: 700; margin: 10px 0 30px; }
ul { list-style: none; margin-top: 36px; }
li { font-size: 44px; line-height: 1.4; padding: 22px 0 22px 64px; position: relative; border-top: 2px solid #e6d3c7; }
li:last-child { border-bottom: 2px solid #e6d3c7; }
li::before { content: ''; position: absolute; left: 8px; top: 42px; width: 22px; height: 22px; border-radius: 50%; background: #d9a79f; }
.pie { position: absolute; left: 110px; right: 110px; bottom: 60px; display: flex; justify-content: space-between; font-size: 26px; color: #a3826b; }
.franja { position: absolute; left: 0; right: 0; top: 0; height: 24px; background: #ecd3cf; }
.estrella { position: absolute; right: 90px; top: 80px; font-size: 54px; color: #c9a35f; }
/* portada */
.portada { background: #ecd3cf; padding: 0; justify-content: flex-start; }
.portada .txt { padding: 110px 100px 0; position: relative; z-index: 2; }
.portada .sub { font-size: 40px; margin-top: 26px; color: #6b5547; }
.portada .arco { position: absolute; left: 50%; transform: translateX(-50%); bottom: 0; width: 760px; height: 720px; border-radius: 380px 380px 0 0; overflow: hidden; background: #f7f0e9; }
.portada .arco img { width: 100%; height: 100%; object-fit: cover; object-position: center 22%; }
.portada .desliza { position: absolute; right: 70px; bottom: 70px; z-index: 3; background: #4a3b32; color: #fff; font-size: 28px; padding: 14px 28px; border-radius: 40px; }
/* cierre */
.cierre { background: #b9927a; color: #fff; }
.cierre p { font-size: 50px; }
.cierre .firma { position: absolute; left: 110px; bottom: 110px; font-size: 30px; line-height: 1.5; opacity: .95; }
.cierre .firma b { font-family: 'Playfair Display', serif; font-size: 40px; }
.cierre .franja { background: #a57f68; }
/* semáforo */
.caja { border-radius: 28px; padding: 34px 40px; margin-top: 30px; }
.caja .et { font-size: 30px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 10px; }
.caja p { font-size: 42px; }
.mejor { background: #e3ecdc; } .mejor .et { color: #5d7a4f; }
.cuidado { background: #f6e2d3; } .cuidado .et { color: #b06a3b; }
`;

function slideHTML(c, s, i, total) {
  const est = c.navidad ? '<div class="estrella">✦</div>' : '';
  const pie = `<div class="pie"><span>@ruthjimenez.nutrivia</span><span>${i}/${total}</span></div>`;
  let body = '';
  if (s.num) body += `<div class="num">${s.num}</div>`;
  if (s.titulo) body += `<h2>${fmt(s.titulo)}</h2>`;
  if (s.grande) body += `<div class="grande">${s.grande}</div>`;
  if (s.texto) body += `<p>${fmt(s.texto)}</p>`;
  if (s.lista) body += `<ul>${s.lista.map(l => `<li>${fmt(l)}</li>`).join('')}</ul>`;
  if (s.mejor) body += `<div class="caja mejor"><div class="et">Mejor opción</div><p>${s.mejor}</p></div><div class="caja cuidado"><div class="et">Con cuidado</div><p>${s.cuidado}</p></div>`;
  return `<div class="s"><div class="franja"></div>${est}<div>${body}</div>${pie}</div>`;
}

function portadaHTML(c) {
  const p = c.portada;
  const est = c.navidad ? '<div class="estrella" style="z-index:3;left:90px;right:auto;top:auto;bottom:80px">✦</div>' : '';
  return `<div class="s portada">${est}<div class="txt"><h1>${fmt(p.titulo)}</h1><div class="sub">${p.sub}</div></div><div class="arco"><img src="${foto(p.foto)}"></div><div class="desliza">Desliza →</div></div>`;
}

function cierreHTML(c, total) {
  return `<div class="s cierre"><div class="franja"></div><p>${fmt(c.cierre.texto)}</p><div class="firma"><b>Ruth Jiménez</b><br>Dietista-nutricionista · SIBO e hinchazón abdominal<br>@ruthjimenez.nutrivia</div><div class="pie" style="color:#fff;justify-content:flex-end"><span>${total}/${total}</span></div></div>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const c of carruseles) {
    const out = path.join(DIR, 'carruseles', c.carpeta);
    fs.mkdirSync(out, { recursive: true });
    const total = c.slides.length + 2;
    const htmls = [portadaHTML(c), ...c.slides.map((s, k) => slideHTML(c, s, k + 2, total)), cierreHTML(c, total)];
    for (let k = 0; k < htmls.length; k++) {
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${htmls[k]}</body></html>`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(out, `${String(k + 1).padStart(2, '0')}.png`) });
    }
    console.log('OK', c.carpeta, htmls.length, 'diapositivas');
  }
  await browser.close();
})();
