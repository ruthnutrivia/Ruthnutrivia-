import React from 'react';
import {
  AbsoluteFill, Audio, Composition, Freeze, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import WORDS from './words.json';
import {Cutaway, Photo} from './Illustrations';

const serif = loadSerif('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
loadSerif('italic', {weights: ['400'], subsets: ['latin']});
const bebas = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const fraunces = loadFraunces('normal', {weights: ['800'], subsets: ['latin']}).fontFamily;
loadFraunces('italic', {weights: ['800'], subsets: ['latin']});
const pop = loadPoppins('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;

// Colores de marca
const C = {
  blanco: '#FFFFFF',
  rosa: '#E8C1C0',      // rosa palo
  beige: '#EFE4D3',     // beige
  amarillo: '#F7E9A8',  // amarillo clarito
  marron: '#B48A6A',    // marrón clarito
  amarilloOsc: '#E9CF72',
  tinta: '#5B4334',     // marrón oscuro para texto sobre tarjetas
};
const SHADOW = '0 2px 4px rgba(60,40,28,.45), 0 4px 18px rgba(60,40,28,.45)';

const FPS = 30;
const VIDEO_END = 36.6;
const TOTAL = 38.4;
const HANDLE = '@ruthnutrivia';
const s2f = (s: number) => Math.round(s * FPS);

type W = {w: string; s: number; e: number};
const words = WORDS as W[];

// ---------- helpers ----------
const usePop = (delay = 0) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping: 13, stiffness: 180, mass: 0.7}});
};
const useFadeOut = (dur: number, len = 6) => {
  const f = useCurrentFrame();
  return interpolate(f, [dur - len, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

// ---------- video con punch-ins ----------
const ZOOMS: [number, number][] = [
  [0, 1.0], [4.8, 1.13], [8.38, 1.0], [12.32, 1.12], [14.94, 1.0],
  [18.95, 1.1], [22.35, 1.0], [26.05, 1.13], [31.43, 1.0],
];
const Base: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let z = 1, start = 0;
  for (const [s, v] of ZOOMS) if (t >= s) { z = v; start = s; }
  const drift = 1 + Math.min(t - start, 6) * 0.004; // micro-zoom lento
  const dark = interpolate(t, [VIDEO_END - 0.6, VIDEO_END + 0.2], [0, 0.62], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const video = (
    <OffthreadVideo src={staticFile('cut.mp4')}
      style={{width: '100%', height: '100%', objectFit: 'cover',
        filter: 'brightness(1.04) contrast(1.04) saturate(1.04) sepia(0.06)'}} />
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${z * drift})`, transformOrigin: '50% 32%'}}>
        {f >= s2f(VIDEO_END) - 2 ? <Freeze frame={s2f(VIDEO_END) - 3}>{video}</Freeze> : video}
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(40,28,20,${dark})`}} />
    </AbsoluteFill>
  );
};

// ---------- subtítulos palabra a palabra ----------
type Chunk = {words: W[]; s: number; e: number};
const chunks: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: W[] = [];
  const push = () => { if (cur.length) out.push({words: cur, s: cur[0].s, e: cur[cur.length - 1].e}); cur = []; };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (cur.length && prev && w.s - prev.e > 0.35) push();
    cur.push(w);
    if (/[.,?]$/.test(w.w) || cur.length >= 3) push();
  });
  push();
  return out.map((c, i) => ({...c, e: Math.min(out[i + 1]?.s ?? c.e + 0.4, c.e + 0.4)}));
})();
const clean = (w: string) => w.replace(/[.,]/g, '').toLowerCase().replace('sibo', 'SIBO');

const KEY = new Set(['tratamiento', 'hinchazón', 'alivio', 'ilusión', 'principio', 'montaña', 'rusa', 'bacterias', 'parte',
  'SIBO', 'terreno', 'suplementos', 'dietas', 'eternas', 'plan', 'digestión', 'ritmo', 'vida', 'recaída', 'miedo', 'sígueme', 'cero']);
const CAP_SHADOW = '0 0 2px rgba(50,32,22,.55), 0 3px 4px rgba(50,32,22,.55), 0 6px 22px rgba(50,32,22,.45)';

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const c = chunks.find((k) => t >= k.s && t < k.e);
  if (!c || t > 35.9) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 1130, height: 260}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', columnGap: 22,
        padding: '0 70px', fontFamily: fraunces, fontWeight: 800}}>
        {c.words.map((w, i) => {
          const txt = clean(w.w);
          const key = KEY.has(txt);
          const local = f - s2f(w.s);
          const p = spring({frame: local, fps: FPS, config: {damping: 11, stiffness: 260, mass: 0.6}});
          if (local < 0) return null;
          return (
            <span key={i} style={{display: 'inline-block', fontSize: key ? 104 : 82, lineHeight: 1.05,
              fontStyle: key ? 'italic' : 'normal', letterSpacing: key ? -1 : -0.5,
              color: key ? C.amarillo : C.blanco, textShadow: CAP_SHADOW,
              transform: `translateY(${(1 - p) * 26}px) scale(${0.7 + 0.3 * p}) rotate(${key ? -3 * p : 0}deg)`,
              opacity: Math.min(1, p * 2)}}>{txt}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- gráficos ----------
const HandCursor: React.FC<{press: number}> = ({press}) => {
  const shapes = (
    <>
      <rect x="0" y="0" width="38" height="125" rx="19" />
      <rect x="36" y="62" width="34" height="80" rx="17" />
      <rect x="68" y="70" width="32" height="74" rx="16" />
      <rect x="98" y="82" width="30" height="64" rx="15" />
      <rect x="-6" y="100" width="134" height="110" rx="40" />
      <rect x="-52" y="112" width="70" height="38" rx="19" transform="rotate(35 -17 131)" />
    </>
  );
  return (
    <svg width="190" height="250" viewBox="-60 -10 200 230" style={{transform: `scale(${1 - 0.12 * press})`, transformOrigin: '19px 0px', overflow: 'visible',
      filter: 'drop-shadow(0 8px 14px rgba(50,32,22,.35))'}}>
      <g fill={C.tinta} stroke={C.tinta} strokeWidth="14" strokeLinejoin="round">{shapes}</g>
      <g fill="#FFFFFF">{shapes}</g>
      <path d="M38 105 L38 140 M70 120 L70 145 M100 128 L100 148" stroke="#E3D6C6" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

const Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = useFadeOut(dur);
  const ease = Easing.inOut(Easing.cubic);
  // 0-16: arrastra · 16-20: clic · 22-38: la mano se va
  const drag = interpolate(f, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const press = interpolate(f, [15, 18, 22], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const drop = spring({frame: f - 17, fps, config: {damping: 9, stiffness: 220, mass: 0.6}});
  const leave = interpolate(f, [22, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const appear = interpolate(f, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  const cardX = (1 - drag) * 230, cardY = (1 - drag) * 520;
  const rot = interpolate(drag, [0, 1], [9, -1]) + (f >= 17 ? -2 * drop : 0);
  const scale = (0.86 + 0.14 * drag) * (f >= 17 ? 1 + 0.06 * (1 - drop) : 1.04);
  const ripple = interpolate(f, [17, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // la punta del dedo agarra la esquina inferior derecha de la etiqueta
  const tipX = 330 + cardX + leave * 420, tipY = -60 + cardY + leave * 700;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', left: 540, top: 330, width: 0, height: 0}}>
        <div style={{position: 'absolute', left: -500, top: -250, width: 1000, transform: `translate(${cardX}px, ${cardY}px) rotate(${rot}deg) scale(${scale})`,
          opacity: appear, padding: '30px 0 34px',
          fontFamily: serif, color: C.blanco, textShadow: f < 17 ? '0 4px 6px rgba(50,32,22,.5), 0 18px 40px rgba(50,32,22,.5)' : SHADOW, textAlign: 'center', lineHeight: 0.98}}>
          <div style={{fontSize: 74, whiteSpace: 'nowrap'}}>¿Terminaste el tratamiento</div>
          <div style={{fontSize: 74, whiteSpace: 'nowrap'}}>y el <span style={{fontStyle: 'italic', color: C.amarillo, fontSize: 116}}>SIBO volvió?</span></div>
        </div>
        {f >= 17 && ripple < 1 && (
          <div style={{position: 'absolute', left: 330 - 70 * ripple - 10, top: -60 - 70 * ripple - 10, width: 20 + 140 * ripple, height: 20 + 140 * ripple,
            borderRadius: '50%', border: `8px solid ${C.amarilloOsc ?? C.amarillo}`, opacity: 1 - ripple}} />
        )}
        <div style={{position: 'absolute', left: tipX - 75, top: tipY - 9, opacity: appear * (1 - leave)}}>
          <HandCursor press={press} />
        </div>
      </div>
      <Sequence from={17} durationInFrames={10} layout="none"><Audio src={staticFile('click.wav')} volume={0.8} /></Sequence>
    </AbsoluteFill>
  );
};

const Keyword: React.FC<{text: string; sub?: string; dur: number; color?: string; top?: number}> = ({text, sub, dur, color = C.amarillo, top = 210}) => {
  const p = usePop(0);
  const o = useFadeOut(dur);
  return (
    <AbsoluteFill style={{alignItems: 'center', top, opacity: o}}>
      {sub && <div style={{fontFamily: pop, fontWeight: 600, fontSize: 44, color: C.blanco, textShadow: SHADOW,
        opacity: p, marginBottom: 4}}>{sub}</div>}
      <div style={{fontFamily: bebas, fontSize: 168, lineHeight: 0.9, color, textShadow: SHADOW, textAlign: 'center',
        transform: `scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -4}deg)`, opacity: Math.min(1, p * 1.5)}}>{text}</div>
    </AbsoluteFill>
  );
};

const Bracket: React.FC<{text: string; dur: number}> = ({text, dur}) => {
  const p = usePop(0);
  const f = useCurrentFrame();
  const o = useFadeOut(dur);
  const chars = Math.floor(interpolate(f, [3, 3 + text.length * 1.2], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const br: React.CSSProperties = {width: 26, height: 120, border: `7px solid ${C.blanco}`, filter: 'drop-shadow(0 3px 8px rgba(60,40,28,.5))'};
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 230, opacity: o}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, transform: `scaleX(${0.7 + 0.3 * p})`}}>
        <div style={{...br, borderRight: 'none'}} />
        <div style={{fontFamily: pop, fontWeight: 600, fontSize: 64, color: C.blanco, textShadow: SHADOW, minWidth: 520, textAlign: 'center'}}>
          {text.slice(0, chars)}
        </div>
        <div style={{...br, borderLeft: 'none'}} />
      </div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{children: React.ReactNode; dur: number; top?: number}> = ({children, dur, top = 1340}) => {
  const p = usePop(0);
  const o = useFadeOut(dur);
  return (
    <AbsoluteFill style={{alignItems: 'center', top, opacity: o}}>
      <div style={{background: 'rgba(255,255,255,.96)', borderRadius: 34, padding: '34px 44px', minWidth: 720,
        boxShadow: '0 18px 50px rgba(60,40,28,.28)', transform: `translateY(${(1 - p) * 60}px) scale(${0.92 + 0.08 * p})`,
        opacity: Math.min(1, p * 1.4), fontFamily: pop, color: C.tinta}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Item: React.FC<{at: number; children: React.ReactNode; icon: 'check' | 'cross' | 'arrow' | 'loop'}> = ({at, children, icon}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - at, fps: FPS, config: {damping: 14, stiffness: 200}});
  const strike = icon === 'cross' ? interpolate(f, [at + 8, at + 16], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const bg = icon === 'check' ? C.marron : icon === 'cross' ? C.rosa : icon === 'loop' ? C.rosa : C.beige;
  const sym = icon === 'check' ? '✓' : icon === 'cross' ? '✕' : icon === 'loop' ? '↺' : '→';
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, margin: '10px 0', opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{width: 58, height: 58, borderRadius: 29, background: bg, color: icon === 'arrow' ? C.tinta : C.blanco,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 700,
        transform: `scale(${p})`}}>{sym}</div>
      <div style={{position: 'relative', fontSize: 50, fontWeight: 600}}>
        {children}
        {icon === 'cross' && <div style={{position: 'absolute', left: 0, top: '52%', height: 6, borderRadius: 3,
          width: `${strike}%`, background: C.rosa}} />}
      </div>
    </div>
  );
};

const CardTitle: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: bebas, fontSize: 56, letterSpacing: 1, color: C.marron, marginBottom: 6}}>{children}</div>
);

const Pill: React.FC<{text: string; dur: number}> = ({text, dur}) => {
  const p = usePop(0);
  const o = useFadeOut(dur, 10);
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 85, opacity: o}}>
      <div style={{background: C.rosa, color: C.tinta, fontFamily: pop, fontWeight: 700, fontSize: 58,
        padding: '22px 56px', borderRadius: 999, boxShadow: '0 10px 30px rgba(60,40,28,.3)',
        transform: `scale(${p}) rotate(-3deg)`}}>{text}</div>
    </AbsoluteFill>
  );
};

const IgIcon: React.FC<{size: number; color?: string}> = ({size, color = C.blanco}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1" fill={color} stroke="none" />
  </svg>
);

const Watermark: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [0.5, 1.2, VIDEO_END - 1, VIDEO_END - 0.5], [0, 0.85, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', right: 60, top: 520, display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 6, opacity: o, filter: 'drop-shadow(0 2px 6px rgba(60,40,28,.5))'}}>
      <IgIcon size={46} />
      <div style={{fontFamily: pop, fontWeight: 600, fontSize: 22, color: C.blanco}}>{HANDLE.toUpperCase()}</div>
    </div>
  );
};

const Outro: React.FC = () => {
  const r = usePop(4);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 110, color: C.amarillo, opacity: r,
        textShadow: SHADOW, transform: `translateY(${(1 - r) * 24}px)`}}>Guarda y sígueme</div>
    </AbsoluteFill>
  );
};

// ---------- composición ----------
const at = (s: number) => s2f(s);
const Seq: React.FC<{from: number; to: number; children: (dur: number) => React.ReactNode}> = ({from, to, children}) => {
  const d = at(to) - at(from);
  return <Sequence from={at(from)} durationInFrames={d} layout="none"><AbsoluteFill>{children(d)}</AbsoluteFill></Sequence>;
};

const Edit: React.FC = () => (
  <AbsoluteFill>
    <Base />
    <Seq from={4.85} to={6.5}>{(d) => <Cutaway dur={d}><Photo src="7298676.jpg" pos="42% 50%" dur={d} /></Cutaway>}</Seq>
    <Seq from={6.45} to={8.35}>{(d) => <Cutaway dur={d}><Photo src="5938365.jpg" pos="78% 40%" dur={d} zoomFrom={1.05} zoomTo={1.15} /></Cutaway>}</Seq>
    <Seq from={12.3} to={14.6}>{(d) => <Cutaway dur={d}><Photo src="11516492.jpg" pos="52% 50%" dur={d} zoomFrom={1.0} zoomTo={1.18} /></Cutaway>}</Seq>
    <Seq from={19.0} to={20.3}>{(d) => <Cutaway dur={d}><Photo src="15897781.jpg" pos="50% 50%" dur={d} /></Cutaway>}</Seq>
    <Seq from={20.25} to={21.6}>{(d) => <Cutaway dur={d}><Photo src="13779107.jpg" pos="38% 50%" dur={d} slideOut={d - 14} /></Cutaway>}</Seq>
    <Seq from={28.3} to={30.3}>{(d) => <Cutaway dur={d}><Photo src="6874185.jpg" pos="50% 45%" dur={d} zoomFrom={1.08} zoomTo={1.0} /></Cutaway>}</Seq>
    <Seq from={0} to={3.7}>{(d) => <Hook dur={d} />}</Seq>
    <Seq from={3.75} to={4.8}>{(d) => <Keyword text="HINCHAZÓN" sub="y la" dur={d} color={C.rosa} />}</Seq>

    <Seq from={4.85} to={8.35}>{(d) => (
      <Card dur={d}>
        <CardTitle>EL CICLO DE SIEMPRE</CardTitle>
        <Item at={0} icon="arrow">Tratamiento</Item>
        <Item at={at(5.84 - 4.85)} icon="arrow">Alivio</Item>
        <Item at={at(6.46 - 4.85)} icon="arrow">Ilusión</Item>
        <Item at={at(7.12 - 4.85)} icon="loop">Otra vez al principio</Item>
      </Card>)}</Seq>
    <Seq from={8.6} to={10.9}>{(d) => <Keyword text="MONTAÑA RUSA" sub="es la" dur={d} />}</Seq>

    <Seq from={12.3} to={14.9}>{(d) => <Bracket text="Solo una parte" dur={d} />}</Seq>
    <Seq from={17.3} to={18.95}>{(d) => <Keyword text="EL TERRENO" sub="sigue siendo el mismo" dur={d} color={C.amarillo} />}</Seq>

    <Seq from={19.0} to={22.3}>{(d) => (
      <Card dur={d}>
        <CardTitle>NO LO SUSTITUYEN</CardTitle>
        <Item at={at(19.25 - 19.0)} icon="cross">Suplementos caros</Item>
        <Item at={at(20.69 - 19.0)} icon="cross">Dietas eternas</Item>
      </Card>)}</Seq>
    <Seq from={22.4} to={26.05}>{(d) => (
      <Card dur={d}>
        <CardTitle>UN PLAN QUE TENGA EN CUENTA</CardTitle>
        <Item at={at(24.01 - 22.4)} icon="check">Tu digestión</Item>
        <Item at={at(25.03 - 22.4)} icon="check">Tu ritmo</Item>
        <Item at={at(25.75 - 22.4)} icon="check">Tu vida</Item>
      </Card>)}</Seq>

    <Seq from={27.55} to={28.35}>{(d) => <Keyword text="RECAÍDA" sub="qué hacer si hay una" dur={d} color={C.rosa} />}</Seq>
    <Seq from={30.3} to={31.4}>{(d) => <Keyword text="EL MIEDO" sub="cómo vives" dur={d} />}</Seq>
    <Seq from={31.5} to={VIDEO_END - 0.3}>{(d) => <Pill text="Sígueme ♡" dur={d} />}</Seq>

    <Captions />
    <Seq from={VIDEO_END - 0.2} to={TOTAL}>{() => <Outro />}</Seq>
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <Composition id="Reel" component={Edit} durationInFrames={s2f(TOTAL)} fps={FPS} width={1080} height={1920} />
);
