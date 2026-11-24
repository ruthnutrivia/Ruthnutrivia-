// Carruseles con la plantilla de Ruth (carrusel «Libertad Digestiva», 15 nov):
// portada con foto oscurecida, contenido en crema con tarjetas blancas e iconos,
// diapositiva de impacto en terracota y cierre en verde salvia.
// Uso: node diciembre/generar-carruseles.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const foto = f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(DIR, 'fotos', f)).toString('base64');

// **negrita**, *cursiva terracota*, \n salto
const fmt = s => s
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/\n/g, '<br>');

const carruseles = [
  {
    carpeta: '2026-11-27-lo-sano-que-te-hincha',
    slides: [
      { tipo: 'portada', foto: 'IMG_5316.jpg', pos: 'center 20%', abajo: true, pill: 'Hinchazón y SIBO', pre: 'Lo hacías por cuidarte…', titulo: 'Lo «sano» que te está hinchando', sub: 'No todo lo sano le sienta bien a tu tripa.' },
      { tipo: 'tarjetas', kicker: '¿Te suena?', titulo: 'Batido verde, ensalada gigante, *kéfir…*', icono: '→', tarjetas: [
        ['Comes «sano» cada día', 'Verdura, fruta, fermentados… todo lo que se supone que hay que comer.'],
        ['Haces todo lo «correcto»', 'Has leído, te has informado y lo aplicas.'],
        ['Y aun así acabas hinchada', 'No es dejadez ni falta de esfuerzo.'],
      ] },
      { tipo: 'tarjetas', kicker: 'Lo que nadie te cuenta', titulo: 'Alimentos con buena fama que *pueden hincharte*', icono: 'num', tarjetas: [
        ['Mucha verdura cruda', 'Ensaladas grandes y crudités: más trabajo para una tripa sensible.'],
        ['Fermentados', 'Kéfir, chucrut o kombucha no sientan bien a todas cuando hay SIBO.'],
        ['Legumbres en cantidad', 'Son ricas en fibra que fermenta en el intestino.'],
      ] },
      { tipo: 'impacto', pill: 'Ojo', grande: 'No', titulo: 'significa que sean malos', texto: 'Ni que tengas que quitarlos para siempre.', cursiva: 'Depende de cómo y de cuándo.' },
      { tipo: 'tarjetas', kicker: 'La clave', titulo: 'Depende de *3 cosas*', icono: 'num', tarjetas: [
        ['Cuándo los tomas', 'No es lo mismo en la comida que en la cena.'],
        ['Cuánto tomas', 'La cantidad que tolera tu intestino ahora.'],
        ['En qué momento estás tú', 'Con síntomas activos o ya más estable.'],
      ] },
      { tipo: 'tarjetas', kicker: 'Por eso', titulo: 'Copiar lo «sano» de otra persona *no te funciona*', icono: '✓', tarjetas: [
        ['Tu plan se ajusta a tu intestino', 'No a una lista sacada de internet.'],
        ['A tus síntomas de ahora', 'Y va cambiando contigo.'],
        ['Y a tu día a día real', 'Trabajo, horarios, comidas fuera.'],
      ] },
      { tipo: 'cierre', titulo: '¿Quieres dejar de hacer lo «correcto» que no te funciona?', texto: 'Guárdalo y sígueme: te enseño a entender tu digestión.', boton: ['Guárdalo y', 'SÍGUEME'] },
    ],
  },
  {
    carpeta: '2026-12-01-sibo-5-senales',
    slides: [
      { tipo: 'portada', foto: 'IMG_6160.jpg', pos: 'center 20%', abajo: true, pill: 'SIBO', pre: 'No es solo hinchazón', titulo: '5 señales que no debes normalizar', sub: '¿Cuántas te pasan a ti?' },
      { tipo: 'tarjetas', kicker: 'Señales del SIBO', titulo: 'Lo que tu tripa *te está diciendo*', icono: 'num', tarjetas: [
        ['Te hinchas a lo largo del día', 'Por la mañana bien; por la tarde, el pantalón ya aprieta.'],
        ['Gases y eructos frecuentes', 'Aunque comas poco y despacio.'],
        ['Cansancio aunque duermas', 'Te levantas con la misma energía con la que te acostaste.'],
      ] },
      { tipo: 'tarjetas', kicker: 'Señales del SIBO', titulo: 'Y dos más que *casi nadie relaciona*', icono: 'num', inicio: 4, tarjetas: [
        ['Te sientan mal alimentos que antes tolerabas', 'Legumbres, cebolla, fruta… y la lista crece.'],
        ['Tu tránsito va a días', 'Estreñimiento unos días, diarrea otros.'],
      ] },
      { tipo: 'impacto', pill: 'Si te reconoces', grande: '3', titulo: 'o más señales', texto: 'No lo normalices.', cursiva: 'Tiene diagnóstico y tiene tratamiento.' },
      { tipo: 'tarjetas', kicker: 'Qué puedes hacer', titulo: 'Tu primer *paso*', icono: '✓', tarjetas: [
        ['Apunta tus síntomas', 'Qué notas, cuándo aparece y qué habías comido.'],
        ['Consulta con un profesional', 'El diagnóstico lo hace tu médico; la alimentación, una dietista especializada.'],
        ['No quites alimentos por tu cuenta', 'Cuantos más quitas sin criterio, más miedo a comer.'],
      ] },
      { tipo: 'cierre', titulo: '¿Cuántas te pasan a ti?', texto: 'Cuéntamelo en comentarios y guárdalo para no olvidarlo.', boton: ['Comenta tu', 'NÚMERO'] },
    ],
  },
  {
    carpeta: '2026-12-05-3-claves-navidad',
    slides: [
      { tipo: 'portada', foto: 'IMG_9521.jpg', pos: 'center 20%', abajo: true, partido: true, bajo: true, pill: 'Navidad sin hinchazón', pre: 'Disfruta sin miedo a comer', titulo: '3 claves para no acabar hinchada', sub: 'Lo que hago con mis pacientes.' },
      { tipo: 'tarjetas', kicker: 'Esto es para ti', titulo: '¿Ya piensas en *cómo vas a acabar*?', icono: '→', tarjetas: [
        ['Hinchada después de la cena', 'Desabrochándote el botón a escondidas.'],
        ['Con gases y sin poder moverte', 'Mientras los demás siguen en la sobremesa.'],
        ['Contando las horas', 'Para llegar a casa y ponerte cómoda.'],
      ] },
      { tipo: 'tarjetas', kicker: 'Las 3 claves', titulo: 'Así llegas a la cena *sin miedo*', icono: 'num', tarjetas: [
        ['No llegues en ayunas', 'Saltarte comidas para «compensar» hace que comas rápido y más cantidad.'],
        ['Despacio y raciones pequeñas', 'Sírvete un poco de lo que más te apetezca en vez de picar de todo.'],
        ['Un paseo después de comer', '10 o 15 minutos ayudan a tu digestión más que el sofá.'],
      ] },
      { tipo: 'impacto', pill: 'Recuerda', grande: '✦', titulo: 'No se trata de comer menos', texto: 'Se trata de que tu intestino funcione mejor.', cursiva: 'Y eso se puede trabajar.' },
      { tipo: 'cierre', titulo: '¿Quieres la guía completa para estas fiestas?', texto: 'Qué pedir, cómo organizar el día de la comida y qué hacer al día siguiente.', boton: ['Comenta la palabra', '«NAVIDAD»'] },
    ],
  },
  {
    carpeta: '2026-12-08-menu-navidad',
    slides: [
      { tipo: 'portada', foto: 'IMG_9790.jpg', pos: 'center 25%', abajo: true, partido: true, pill: 'Navidad sin hinchazón', pre: 'Abres la carta y no sabes qué pedir', titulo: 'Qué pedir en el menú de Navidad', sub: 'Si te hinchas con facilidad.' },
      { tipo: 'tarjetas', kicker: 'Antes de empezar', titulo: 'No es una lista de *prohibidos*', icono: '→', tarjetas: [
        ['Es una guía para elegir', 'Con más tranquilidad y menos miedo.'],
        ['Cada persona tolera cosas distintas', 'Por eso un plan tiene que ser personal.'],
        ['Si algo te sienta bien, disfrútalo', 'La Navidad también es disfrutar.'],
      ] },
      { tipo: 'menu', kicker: 'Entrantes', titulo: 'Para *empezar*', mejor: 'Marisco a la plancha, jamón, crema de verduras.', cuidado: 'Canapés con mucho pan, ensaladas con cebolla cruda.', truco: 'Empieza por algo con proteína o verdura antes de lanzarte al pan.' },
      { tipo: 'menu', kicker: 'Principales', titulo: 'El plato *fuerte*', mejor: 'Pescado al horno, carne a la brasa, con patata o arroz.', cuidado: 'Guisos con mucha cebolla y ajo, rebozados.', truco: 'Pide la salsa aparte y acompaña con patata o arroz.' },
      { tipo: 'menu', kicker: 'Postres y bebida', titulo: 'Para *terminar*', mejor: 'Naranja o mandarina, un trocito de chocolate negro. Agua sin gas o una copa de vino.', cuidado: 'Postres con mucha nata, turrón en cantidad, refrescos y bebidas con gas.', truco: '¿Te apetece turrón? Un trozo pequeño, despacio y disfrutándolo.' },
      { tipo: 'cierre', titulo: '¿Quieres la guía completa para estas fiestas?', texto: 'Guárdalo para el día de la comida y pídeme la guía.', boton: ['Comenta la palabra', '«NAVIDAD»'] },
    ],
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&family=Inter:wght@300;400;500;600&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; overflow: hidden; }
.s { width: 1080px; height: 1350px; position: relative; overflow: hidden; }
.serif { font-family: 'Source Serif 4', serif; }
em { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 400; color: #b05e51; }
.handle { position: absolute; bottom: 58px; left: 0; right: 0; text-align: center; font-family: Inter, sans-serif; font-size: 27px; letter-spacing: .14em; }
.flecha { position: absolute; bottom: 48px; right: 80px; font-family: Inter, sans-serif; font-size: 48px; }
.pill { display: inline-block; font-family: Inter, sans-serif; font-weight: 600; font-size: 28px; letter-spacing: .24em; text-transform: uppercase;
        background: #f4ece2; color: #b05e51; padding: 16px 34px; border-radius: 40px; }

/* portada */
.portada img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.portada .velo { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(42,30,24,.72) 0%, rgba(42,30,24,.55) 55%, rgba(42,30,24,.70) 100%); }
.portada .txt { position: absolute; left: 90px; right: 90px; top: 120px; color: #f4ece2; }
.portada .pre { font-family: 'Source Serif 4', serif; font-style: italic; font-size: 62px; margin-top: 46px; line-height: 1.15; }
.portada h1 { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 118px; line-height: 1.02; color: #ecc5b7; margin-top: 30px; }
.portada .raya { width: 90px; height: 3px; background: #f4ece2; margin: 56px 0 34px; opacity: .85; }
.portada .sub { font-family: Inter, sans-serif; font-weight: 300; font-size: 40px; line-height: 1.45; max-width: 760px; }
.portada .handle, .portada .flecha { color: #f4ece2; }
.portada .velo.arriba { background: linear-gradient(180deg, rgba(42,30,24,.82) 0%, rgba(42,30,24,.6) 40%, rgba(42,30,24,.08) 70%, rgba(42,30,24,.35) 100%); }
.portada img.claro { filter: brightness(1.25); }
.portada .txt.abajo { top: auto; bottom: 140px; }
.portada .txt.alto { bottom: 230px; }
.portada .txt.alto h1 { margin-top: 0; }
.portada .velo.partido { background: linear-gradient(180deg, rgba(42,30,24,.78) 0%, rgba(42,30,24,.35) 25%, rgba(42,30,24,.2) 40%, rgba(42,30,24,.8) 62%, rgba(42,30,24,.88) 100%); }
.portada .velo.abajo { background: linear-gradient(180deg, rgba(42,30,24,.15) 0%, rgba(42,30,24,.25) 35%, rgba(42,30,24,.80) 62%, rgba(42,30,24,.88) 100%); }

/* contenido */
.cont { background: #f3ede4; color: #5b4033; padding: 90px 100px 150px; display: flex; flex-direction: column; justify-content: center; }
.kicker { font-family: Inter, sans-serif; font-weight: 600; font-size: 29px; letter-spacing: .24em; text-transform: uppercase; color: #b05e51; }
.cont h2 { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 82px; line-height: 1.1; margin-top: 24px; }
.cont h2 em { font-weight: 400; }
.tarjetas { margin-top: 56px; display: flex; flex-direction: column; gap: 26px; }
.tj { background: #fff; border-radius: 30px; padding: 36px 40px 36px 40px; display: flex; gap: 30px; align-items: flex-start; box-shadow: 0 2px 10px rgba(91,64,51,.05); }
.ic { flex: 0 0 64px; height: 64px; border-radius: 50%; background: #f2dcd6; color: #b05e51; display: flex; align-items: center; justify-content: center;
      font-family: 'Source Serif 4', serif; font-size: 34px; font-weight: 600; margin-top: 2px; }
.ic.verde { background: #dfe7e2; color: #4f6b67; }
.tj h3 { font-family: Inter, sans-serif; font-weight: 600; font-size: 38px; line-height: 1.25; color: #5b4033; }
.tj p { font-family: Inter, sans-serif; font-weight: 300; font-size: 33px; line-height: 1.5; color: #6e5649; margin-top: 8px; }
.cont .handle { color: #a39187; } .cont .flecha { color: #b05e51; }

/* impacto */
.impacto { background: #b05e51; color: #f4ece2; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 90px 60px; }
.circ { position: absolute; border-radius: 50%; background: rgba(255,255,255,.1); }
.impacto .bola { width: 400px; height: 400px; border-radius: 50%; background: #f4ece2; color: #b05e51; display: flex; align-items: center; justify-content: center;
                 font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 230px; margin-top: 50px; box-shadow: 0 18px 40px rgba(0,0,0,.12); }
.impacto h2 { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 92px; line-height: 1.08; margin-top: 50px; }
.impacto p { font-family: Inter, sans-serif; font-weight: 300; font-size: 42px; margin-top: 30px; opacity: .92; }
.impacto .cur { font-family: 'Source Serif 4', serif; font-style: italic; font-size: 50px; margin-top: 16px; }
.impacto .handle, .impacto .flecha { color: #f4ece2; }

/* cierre */
.cierre { background: #627e7a; color: #fff; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 100px 60px; }
.cierre h2 { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 92px; line-height: 1.1; }
.cierre p { font-family: Inter, sans-serif; font-weight: 300; font-size: 42px; line-height: 1.5; margin-top: 40px; opacity: .95; }
.boton { margin-top: 60px; background: #f2dcd6; color: #5b4033; border-radius: 90px; padding: 36px 80px; font-family: Inter, sans-serif; font-size: 40px; line-height: 1.35; }
.boton b { display: block; color: #b05e51; font-weight: 700; font-size: 44px; }
.cierre .handle { color: rgba(255,255,255,.85); }
`;

function slideHTML(s) {
  if (s.tipo === 'portada') {
    return `<div class="s portada"><img class="${s.arriba ? 'claro' : ''}" src="${foto(s.foto)}" style="object-position:${s.pos}"><div class="velo${s.partido ? ' partido' : (s.abajo ? ' abajo' : '')}${s.arriba ? ' arriba' : ''}"></div>
      ${s.partido ? `<div class="txt"><span class="pill">${s.pill}</span><div class="pre">${s.pre}</div></div>` : ''}
      <div class="txt${s.abajo ? ' abajo' : ''}${s.partido && !s.bajo ? ' alto' : ''}">${s.partido ? '' : `<span class="pill">${s.pill}</span><div class="pre">${s.pre}</div>`}<h1>${s.titulo}</h1>${s.sub ? `<div class="raya"></div><div class="sub">${s.sub}</div>` : ''}</div>
      <div class="handle">@ruthjimenez.nutrivia</div><div class="flecha">→</div></div>`;
  }
  if (s.tipo === 'tarjetas') {
    const ini = s.inicio || 1;
    const tj = s.tarjetas.map(([t, d], i) => {
      const ic = s.icono === 'num' ? ini + i : s.icono;
      return `<div class="tj"><div class="ic">${ic}</div><div><h3>${t}</h3><p>${d}</p></div></div>`;
    }).join('');
    return `<div class="s cont"><div class="kicker">${s.kicker}</div><h2>${fmt(s.titulo)}</h2><div class="tarjetas">${tj}</div>
      <div class="handle">@ruthjimenez.nutrivia</div><div class="flecha">→</div></div>`;
  }
  if (s.tipo === 'menu') {
    return `<div class="s cont"><div class="kicker">${s.kicker}</div><h2>${fmt(s.titulo)}</h2><div class="tarjetas">
      <div class="tj"><div class="ic verde">✓</div><div><h3>Mejor opción</h3><p>${s.mejor}</p></div></div>
      <div class="tj"><div class="ic">!</div><div><h3>Con cuidado</h3><p>${s.cuidado}</p></div></div>
      <div class="tj"><div class="ic">✦</div><div><h3>Mi truco</h3><p>${s.truco}</p></div></div></div>
      <div class="handle">@ruthjimenez.nutrivia</div><div class="flecha">→</div></div>`;
  }
  if (s.tipo === 'impacto') {
    return `<div class="s impacto"><div class="circ" style="width:620px;height:620px;right:-220px;top:-240px"></div><div class="circ" style="width:360px;height:360px;left:-160px;bottom:-120px"></div>
      <span class="pill" style="position:relative">${s.pill}</span><div class="bola">${s.grande}</div><h2>${s.titulo}</h2><p>${s.texto}</p><div class="cur">${s.cursiva}</div>
      <div class="handle">@ruthjimenez.nutrivia</div><div class="flecha">→</div></div>`;
  }
  return `<div class="s cierre"><div class="circ" style="width:460px;height:460px;left:-200px;top:-220px"></div><div class="circ" style="width:520px;height:520px;right:-200px;bottom:-260px"></div>
    <h2 style="position:relative">${s.titulo}</h2><p style="position:relative">${s.texto}</p><div class="boton" style="position:relative">${s.boton[0]}<b>${s.boton[1]}</b></div>
    <div class="handle">@ruthjimenez.nutrivia</div></div>`;
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
