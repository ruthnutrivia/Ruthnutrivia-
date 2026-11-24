import React from 'react';
import {
  AbsoluteFill, Composition, Freeze, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import WORDS from './words.json';
import {Cutaway, Photo} from './Illustrations';

const serif = loadSerif('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
loadSerif('italic', {weights: ['400'], subsets: ['latin']});
const bebas = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const pop = loadPoppins('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;

// Colores de marca
const C = {
  blanco: '#FFFFFF',
  rosa: '#E8C1C0',      // rosa palo
  beige: '#EFE4D3',     // beige
  amarillo: '#F7E9A8',  // amarillo clarito
  marron: '#B48A6A',    // marrón clarito
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

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const c = chunks.find((k) => t >= k.s && t < k.e);
  if (!c || t > 35.9) return null;
  const local = f - s2f(c.s);
  const sc = interpolate(local, [0, 4], [0.86, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 1150, height: 200}}>
      <div style={{transform: `scale(${sc})`, fontFamily: pop, fontWeight: 600, fontSize: 64,
        color: C.blanco, textShadow: '0 2px 3px rgba(50,32,22,.75), 0 4px 22px rgba(50,32,22,.6)', textAlign: 'center', padding: '0 80px', letterSpacing: -0.5}}>
        {c.words.map((w, i) => (
          <span key={i} style={{color: t >= w.s ? (t < w.e + 0.05 ? C.amarillo : C.blanco) : 'rgba(255,255,255,.72)'}}>
            {clean(w.w)}{i < c.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- gráficos ----------
const Hook: React.FC<{dur: number}> = ({dur}) => {
  const a = usePop(0), b = usePop(6), c = usePop(14);
  const o = useFadeOut(dur);
  const line = (p: number): React.CSSProperties => ({opacity: p, transform: `translateY(${(1 - p) * 30}px)`});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 150, opacity: o}}>
      <div style={{fontFamily: serif, color: C.blanco, textShadow: SHADOW, textAlign: 'center', lineHeight: 0.95}}>
        <div style={{...line(a), fontSize: 96}}>¿Terminaste el</div>
        <div style={{...line(b), fontSize: 96}}>tratamiento y el</div>
        <div style={{...line(c), fontSize: 150, fontStyle: 'italic', color: C.amarillo}}>SIBO volvió?</div>
      </div>
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
