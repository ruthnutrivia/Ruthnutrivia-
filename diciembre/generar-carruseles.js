// Genera las diapositivas de los carruseles (1080x1350) con el estilo de los
// carruseles de Ruth (caso Lidia): fondo crema, texto centrado, título serif con
// palabra en terracota, etiqueta en mayúsculas espaciadas, citas en caja rosada.
// Uso: node diciembre/generar-carruseles.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;

// **negrita**, ==palabra en terracota==, saltos de línea con \n
const fmt = s => s
  .replace(/==(.+?)==/g, '<span class="acento">$1</span>')
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\n/g, '<br>');

const carruseles = [
  {
    carpeta: '2026-11-27-lo-sano-que-te-hincha',
    slides: [
      { portada: true, kicker: 'Hinchazón y SIBO', titulo: 'Lo ==«sano»== que te está hinchando', texto: 'No todo lo sano te sienta bien.' },
      { kicker: '¿Te suena?', titulo: 'Lo hacías por cuidarte…', cita: 'Batido verde, ensalada gigante, kéfir…', texto: 'Y aun así, acabas el día ==hinchada==.' },
      { kicker: 'No es dejadez', titulo: 'Estás haciendo todo «bien»', texto: 'Si comes sano y aun así te hinchas, no es falta de esfuerzo.\n\nEstás haciendo todo lo que se supone que es saludable.' },
      { kicker: 'Lo que nadie te cuenta', titulo: 'Alimentos con buena fama que pueden ==hincharte== más', texto: 'Cuando tienes la tripa sensible, o hay SIBO:', lista: ['Mucha verdura cruda', 'Fermentados como el kéfir o el chucrut', 'Legumbres en cantidad'] },
      { kicker: 'Ojo', titulo: '¿Significa que son malos?', grande: 'No.', texto: 'Ni que tengas que quitarlos para siempre.' },
      { kicker: 'La clave', titulo: 'Depende de ==3 cosas==', lista: ['**Cuándo** los tomas', '**Cuánto** tomas', 'En qué **momento** estás tú'] },
      { kicker: 'Por eso', titulo: 'Copiar lo «sano» de otra persona ==no te funciona==', cita: 'Tu plan tiene que ajustarse a tu intestino.' },
      { cierre: true, kicker: 'Antes de irte', titulo: '==Guárdalo== y sígueme', texto: 'si quieres dejar de hacer lo «correcto» que no te funciona.' },
    ],
  },
  {
    carpeta: '2026-12-01-sibo-5-senales',
    slides: [
      { portada: true, kicker: 'SIBO', titulo: '5 señales que ==no son solo== hinchazón', texto: '¿Cuántas te pasan a ti?' },
      { kicker: 'Señal 1', titulo: 'Te hinchas cada vez más a lo largo del ==día==', texto: 'Por la mañana, bien.\nPor la tarde, el pantalón ya aprieta.' },
      { kicker: 'Señal 2', titulo: 'Gases y eructos ==frecuentes==', texto: 'Aunque comas poco y despacio.' },
      { kicker: 'Señal 3', titulo: 'Cansancio aunque ==duermas==', cita: 'Te levantas con la misma energía con la que te acostaste.' },
      { kicker: 'Señal 4', titulo: 'Alimentos que antes tolerabas ahora te ==sientan mal==', texto: 'Legumbres, cebolla, fruta…\ny la lista crece.' },
      { kicker: 'Señal 5', titulo: 'Tu tránsito ==va a días==', texto: 'Estreñimiento unos días,\ndiarrea otros.' },
      { cierre: true, kicker: 'Si te reconoces en 3 o más', titulo: 'No lo ==normalices==', texto: 'Consúltalo con un profesional: tiene diagnóstico y tiene tratamiento.\n\n**Guárdalo y sígueme** para entender tu digestión.' },
    ],
  },
  {
    carpeta: '2026-12-05-3-claves-navidad',
    slides: [
      { portada: true, kicker: 'Navidad sin hinchazón', titulo: '3 claves para no acabar ==hinchada== en Navidad', texto: 'Disfruta de las comidas sin miedo.' },
      { kicker: 'Esto es para ti', titulo: '¿Ya piensas en cómo vas a ==acabar==?', cita: 'Hinchada, con gases y sin poder ni moverte.' },
      { kicker: 'Clave 1', titulo: 'No llegues en ==ayunas==', texto: 'Saltarte comidas para «compensar» hace que llegues con muchísima hambre, comas rápido y más cantidad.\n\nY eso sí hincha.' },
      { kicker: 'Clave 2', titulo: 'Despacio y raciones ==pequeñas==', texto: 'Sírvete un poco de lo que más te apetezca, en vez de picar de todo durante horas.' },
      { kicker: 'Clave 3', titulo: 'Un ==paseo== después de comer', texto: '10 o 15 minutos ayudan a tu digestión mucho más que quedarte en el sofá.' },
      { kicker: 'Recuerda', titulo: 'No se trata de comer ==menos==', cita: 'Se trata de que tu intestino funcione mejor. Y eso se puede trabajar.' },
      { cierre: true, kicker: 'Antes de irte', titulo: '==Guárdalo== para las fiestas', texto: 'Y sígueme: te enseño a disfrutar de la Navidad sin miedo a comer.' },
    ],
  },
  {
    carpeta: '2026-12-08-menu-navidad',
    slides: [
      { portada: true, kicker: 'Navidad sin hinchazón', titulo: 'Qué pedir en el ==menú== de Navidad', texto: 'Si te hinchas con facilidad.' },
      { kicker: 'Antes de empezar', titulo: 'No es una lista de ==prohibidos==', texto: 'Es una guía para elegir con más tranquilidad.', cita: 'Cada persona tolera cosas distintas.' },
      { kicker: 'Entrantes', titulo: 'Para ==empezar==', mejor: 'Marisco a la plancha, jamón, crema de verduras', cuidado: 'Canapés con mucho pan, ensaladas con cebolla cruda' },
      { kicker: 'Principales', titulo: 'El plato ==fuerte==', mejor: 'Pescado al horno, carne a la brasa, con patata o arroz', cuidado: 'Guisos con mucha cebolla y ajo, rebozados' },
      { kicker: 'Postres', titulo: 'Para ==terminar==', mejor: 'Naranja o mandarina, un trocito de chocolate negro', cuidado: 'Postres con mucha nata, turrón en cantidad' },
      { kicker: 'Bebida', titulo: 'Para ==brindar==', mejor: 'Agua sin gas, una copa de vino', cuidado: 'Refrescos y bebidas con gas' },
      { cierre: true, kicker: 'Antes de irte', titulo: '==Guárdalo== para el día de la comida', texto: 'Y sígueme: te enseño a disfrutar de la Navidad sin miedo a comer.' },
    ],
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@300;400;500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; overflow: hidden; }
.s { width: 1080px; height: 1350px; position: relative; background: #f6efe6; color: #5b4033; text-align: center;
     display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 170px 110px 190px; }
.kicker { position: absolute; top: 80px; left: 0; right: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 30px;
          letter-spacing: .22em; text-transform: uppercase; color: #c45c4f; }
.acento { color: #c45c4f; }
h1 { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 100px; line-height: 1.08; letter-spacing: -.01em; }
h2 { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 80px; line-height: 1.12; letter-spacing: -.01em; }
p { font-family: Inter, sans-serif; font-weight: 300; font-size: 40px; line-height: 1.55; margin-top: 44px; }
p b { font-weight: 500; }
.portada p { font-size: 44px; }
.grande { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 170px; line-height: 1; color: #c45c4f; margin-top: 30px; }
.cita { margin-top: 48px; width: 100%; background: #f0ded7; border-radius: 0 34px 34px 0; border-left: 12px solid #d48b80;
        padding: 40px 50px; text-align: left; font-family: 'Source Serif 4', serif; font-style: italic; font-size: 46px; line-height: 1.45; }
ul { list-style: none; margin-top: 44px; width: 100%; }
li { font-family: Inter, sans-serif; font-weight: 300; font-size: 40px; line-height: 1.4; padding: 26px 0; border-bottom: 1.5px solid #e4d3c6; }
li:first-child { border-top: 1.5px solid #e4d3c6; }
li b { font-weight: 500; color: #c45c4f; }
.caja { width: 100%; text-align: left; border-radius: 0 30px 30px 0; padding: 30px 44px; margin-top: 32px; }
.caja .et { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 26px; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 8px; }
.caja .tx { font-family: Inter, sans-serif; font-weight: 300; font-size: 38px; line-height: 1.45; }
.mejor { background: #ebe6d6; border-left: 12px solid #a9a37a; } .mejor .et { color: #7d7750; }
.cuidado { background: #f0ded7; border-left: 12px solid #d48b80; } .cuidado .et { color: #c45c4f; }
.pie { position: absolute; bottom: 62px; left: 0; right: 0; font-family: Inter, sans-serif; font-weight: 400; font-size: 27px; letter-spacing: .12em; color: #a39187; }
.flecha { position: absolute; bottom: 52px; right: 90px; font-size: 46px; color: #c45c4f; font-family: Inter, sans-serif; }
.linea { width: 90px; height: 3px; background: #d48b80; margin: 46px auto 0; }
.firma { margin-top: 70px; font-family: 'Source Serif 4', serif; font-size: 36px; }
.firma small { display: block; font-family: Inter, sans-serif; font-weight: 300; font-size: 28px; margin-top: 8px; color: #8a7466; }
`;

function slideHTML(s) {
  let h = `<div class="s${s.portada ? ' portada' : ''}">`;
  if (s.kicker) h += `<div class="kicker">${s.kicker}</div>`;
  h += s.portada ? `<h1>${fmt(s.titulo)}</h1><div class="linea"></div>` : `<h2>${fmt(s.titulo)}</h2>`;
  if (s.grande) h += `<div class="grande">${s.grande}</div>`;
  if (s.texto) h += `<p>${fmt(s.texto)}</p>`;
  if (s.cita) h += `<div class="cita">«${fmt(s.cita)}»</div>`.replace('««', '«');
  if (s.lista) h += `<ul>${s.lista.map(l => `<li>${fmt(l)}</li>`).join('')}</ul>`;
  if (s.mejor) h += `<div class="caja mejor"><div class="et">Mejor opción</div><div class="tx">${s.mejor}</div></div><div class="caja cuidado"><div class="et">Con cuidado</div><div class="tx">${s.cuidado}</div></div>`;
  if (s.cierre) h += `<div class="firma">Ruth Jiménez<small>Dietista-nutricionista · SIBO e hinchazón abdominal</small></div>`;
  h += `<div class="pie">@ruthjimenez.nutrivia</div>`;
  if (!s.cierre) h += `<div class="flecha">→</div>`;
  return h + '</div>';
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const c of carruseles) {
    const out = path.join(DIR, 'carruseles', c.carpeta);
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(out, { recursive: true });
    const corto = c.carpeta.replace(/^2026-/, '');
    for (let k = 0; k < c.slides.length; k++) {
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${slideHTML(c.slides[k])}</body></html>`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(out, `${corto}-${String(k + 1).padStart(2, '0')}.png`) });
    }
    console.log('OK', c.carpeta, c.slides.length, 'diapositivas');
  }
  await browser.close();
})();
