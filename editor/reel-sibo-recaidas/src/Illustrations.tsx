import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, Easing} from 'remotion';

const FPS = 30;
export const P = {
  blanco: '#FFFFFF', rosa: '#E8C1C0', rosaOsc: '#D49C9B', beige: '#EFE4D3', beigeClaro: '#F7F0E6',
  amarillo: '#F7E9A8', amarilloOsc: '#E9CF72', marron: '#B48A6A', marronOsc: '#8A6650', tinta: '#5B4334',
  piel: '#EDC7A8', pielSombra: '#DDAE8C', pelo: '#5E4033',
};
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Contenedor de corte a pantalla completa: entra con zoom suave, sale con fundido
export const Cutaway: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(f, [dur - 5, dur], [1, 0], clamp);
  const kb = interpolate(f, [0, dur], [1.0, 1.045], clamp);
  return (
    <AbsoluteFill style={{opacity: Math.min(inn, out), transform: `scale(${(1.06 - 0.06 * inn) * kb})`}}>
      {children}
    </AbsoluteFill>
  );
};

const Bg: React.FC<{a?: string; b?: string; children?: React.ReactNode}> = ({a = P.beigeClaro, b = P.beige, children}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${a}, ${b})`}}>{children}</AbsoluteFill>
);

// ---------- mujer (base compartida) ----------
const Woman: React.FC<{sweater: string; sweaterShade: string; tilt?: number; face: 'pain' | 'calm'; children?: React.ReactNode; arms: React.ReactNode}> = ({sweater, sweaterShade, tilt = 0, face, children, arms}) => (
  <g>
    {/* pelo de atrás */}
    <path d="M370 470 C360 330 450 270 540 270 C630 270 720 330 710 470 L745 1020 C700 1060 620 1060 600 1040 L480 1040 C460 1060 380 1060 335 1020 Z" fill={P.pelo} />
    {/* cuello */}
    <rect x="497" y="560" width="86" height="120" rx="30" fill={P.pielSombra} />
    {/* torso / jersey */}
    <path d="M260 1920 L250 900 C250 760 330 690 470 670 L610 670 C750 690 830 760 830 900 L820 1920 Z" fill={sweater} />
    <path d="M470 670 C500 710 580 710 610 670 L600 655 C570 690 510 690 480 655 Z" fill={sweaterShade} />
    {children}
    {arms}
    {/* cabeza */}
    <g transform={`rotate(${tilt} 540 470)`}>
      <ellipse cx="540" cy="465" rx="118" ry="142" fill={P.piel} />
      <path d="M418 470 C405 330 470 300 540 300 C640 300 680 360 662 470 C640 400 600 360 545 352 C520 400 470 430 418 470 Z" fill={P.pelo} />
      {face === 'pain' ? (
        <g stroke={P.tinta} strokeWidth="7" fill="none" strokeLinecap="round">
          <path d="M478 455 L512 468" /><path d="M602 455 L568 468" />
          <path d="M480 492 q16 -10 32 0" /><path d="M568 492 q16 -10 32 0" />
          <path d="M510 560 q15 -12 30 0 q15 12 30 0" />
        </g>
      ) : (
        <g stroke={P.tinta} strokeWidth="7" fill="none" strokeLinecap="round">
          <path d="M478 485 q17 14 34 0" /><path d="M568 485 q17 14 34 0" />
          <path d="M510 548 q30 24 60 0" />
          <ellipse cx="470" cy="525" rx="22" ry="12" fill={P.rosa} stroke="none" opacity=".8" />
          <ellipse cx="610" cy="525" rx="22" ry="12" fill={P.rosa} stroke="none" opacity=".8" />
        </g>
      )}
    </g>
  </g>
);

// 1) Mujer con la barriga hinchada
export const BloatedWoman: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.035 * Math.sin(f / 4);
  const zig = (x: number, y: number, flip: number, delay: number) => {
    const o = 0.35 + 0.65 * Math.abs(Math.sin((f + delay) / 5));
    return <path d={`M${x} ${y} l${30 * flip} 18 l${-22 * flip} 18 l${30 * flip} 18`} stroke={P.marronOsc} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
  };
  return (
    <Bg a={P.beigeClaro} b={P.rosa}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <circle cx="540" cy="760" r="470" fill={P.blanco} opacity=".45" />
        <Woman sweater={P.rosa} sweaterShade={P.rosaOsc} tilt={-7 + 2 * Math.sin(f / 9)} face="pain"
          arms={
            <g strokeLinecap="round" fill="none">
              <path d="M300 760 C230 900 260 1030 420 1070" stroke={P.rosaOsc} strokeWidth="118" />
              <path d="M780 760 C850 900 820 1030 660 1070" stroke={P.rosaOsc} strokeWidth="118" />
              <ellipse cx="455" cy="1075" rx="70" ry="52" fill={P.piel} />
              <ellipse cx="625" cy="1075" rx="70" ry="52" fill={P.piel} />
            </g>
          }>
          <g transform={`translate(540 1090) scale(${pulse}) translate(-540 -1090)`}>
            <ellipse cx="540" cy="1090" rx="250" ry="190" fill={P.rosa} />
            <ellipse cx="540" cy="1090" rx="250" ry="190" fill="none" stroke={P.rosaOsc} strokeWidth="6" />
          </g>
        </Woman>
        {zig(225, 1000, -1, 0)}{zig(195, 1110, -1, 7)}
        {zig(855, 1000, 1, 3)}{zig(885, 1110, 1, 10)}
      </svg>
    </Bg>
  );
};

// 2) Bacterias en el intestino (vista de microscopio)
const BACT = Array.from({length: 26}, (_, i) => {
  const r = (n: number) => { const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
  const kinds = ['rod', 'rod', 'coccus', 'rod', 'spiral'] as const;
  const cols = [P.marron, P.marronOsc, P.amarilloOsc, '#C97C86', P.tinta];
  return {x: 200 + r(1) * 680, y: 470 + r(2) * 640, rot: r(3) * 180, kind: kinds[i % 5], col: cols[i % 5],
    sp: 0.6 + r(4), dies: i % 2 === 0, dieAt: 30 + Math.floor(r(5) * 20)};
});
export const GutBacteria: React.FC = () => {
  const f = useCurrentFrame();
  const villi = (yBase: number, dir: 1 | -1, color: string) => {
    let d = `M80 ${yBase}`;
    for (let x = 80; x < 1000; x += 70) d += ` q35 ${-dir * 150} 70 0`;
    d += ` L1000 ${dir === 1 ? 1920 : 0} L80 ${dir === 1 ? 1920 : 0} Z`;
    return <path d={d} fill={color} />;
  };
  return (
    <Bg a={P.rosa} b={P.beige}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs><clipPath id="lens"><circle cx="540" cy="800" r="430" /></clipPath></defs>
        <circle cx="540" cy="815" r="445" fill={P.marronOsc} opacity=".18" />
        <g clipPath="url(#lens)">
          <rect x="0" y="300" width="1080" height="1000" fill="#F6DCD7" />
          {villi(430, -1, '#E9B3AE')}
          {villi(1170, 1, '#E9B3AE')}
          {villi(1230, 1, '#DB9C98')}
          {BACT.map((b, i) => {
            const gone = b.dies ? interpolate(f, [b.dieAt, b.dieAt + 6], [1, 0], clamp) : 1;
            const pop = b.dies ? interpolate(f, [b.dieAt, b.dieAt + 6], [1, 1.6], clamp) : 1;
            const x = b.x + 18 * Math.sin(f / 10 * b.sp + i);
            const y = b.y + 14 * Math.cos(f / 12 * b.sp + i * 2);
            const rot = b.rot + 10 * Math.sin(f / 8 + i);
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${pop})`} opacity={gone}>
                {b.kind === 'rod' && <><rect x="-48" y="-18" width="96" height="36" rx="18" fill={b.col} />
                  <path d={`M48 0 q16 ${10 * Math.sin(f / 3 + i)} 32 0`} stroke={b.col} strokeWidth="5" fill="none" strokeLinecap="round" /></>}
                {b.kind === 'coccus' && <><circle cx="-20" r="18" fill={b.col} /><circle cx="18" cy="6" r="18" fill={b.col} /><circle cx="0" cy="-26" r="18" fill={b.col} /></>}
                {b.kind === 'spiral' && <path d="M-50 0 q12 -22 25 0 t25 0 t25 0 t25 0" stroke={b.col} strokeWidth="12" fill="none" strokeLinecap="round" />}
              </g>
            );
          })}
          {/* destellos de "ataque" */}
          {BACT.filter((b) => b.dies).map((b, i) => {
            const o = interpolate(f, [b.dieAt, b.dieAt + 3, b.dieAt + 9], [0, 1, 0], clamp);
            return <circle key={i} cx={b.x} cy={b.y} r={20 + 40 * o} fill="none" stroke={P.amarillo} strokeWidth="8" opacity={o} />;
          })}
        </g>
        <circle cx="540" cy="800" r="430" fill="none" stroke={P.blanco} strokeWidth="18" />
      </svg>
    </Bg>
  );
};

// 3) Mano que aparta botes de suplementos en una mesa de madera
const Bottle: React.FC<{x: number; w: number; h: number; body: string; cap: string; label: string; tilt: number}> = ({x, w, h, body, cap, label, tilt}) => {
  const base = 1580;
  return (
    <g transform={`rotate(${tilt} ${x} ${base})`}>
      <ellipse cx={x} cy={base + 6} rx={w * 0.55} ry="16" fill="#000" opacity=".14" />
      <rect x={x - w / 2} y={base - h} width={w} height={h} rx="26" fill={body} />
      <rect x={x - w / 2 + 14} y={base - h + 18} width="16" height={h - 50} rx="8" fill="#fff" opacity=".28" />
      <rect x={x - w * 0.36} y={base - h - 58} width={w * 0.72} height="66" rx="14" fill={cap} />
      <rect x={x - w / 2} y={base - h * 0.68} width={w} height={h * 0.38} fill={label} />
      <rect x={x - w * 0.3} y={base - h * 0.58} width={w * 0.6} height="12" rx="6" fill={P.tinta} opacity=".55" />
      <rect x={x - w * 0.22} y={base - h * 0.5} width={w * 0.44} height="10" rx="5" fill={P.tinta} opacity=".35" />
    </g>
  );
};
export const SupplementsTable: React.FC = () => {
  const f = useCurrentFrame();
  const hand = interpolate(f, [3, 15, 48], [1300, 980, 60], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const bottles = [
    {x0: 290, w: 190, h: 330, body: '#C68B4E', cap: P.blanco, label: P.beigeClaro},
    {x0: 540, w: 215, h: 390, body: P.blanco, cap: P.marronOsc, label: P.rosa},
    {x0: 790, w: 180, h: 300, body: P.amarilloOsc, cap: P.blanco, label: P.blanco},
  ];
  let edge = hand - 85;
  const pos = [...bottles].reverse().map((b) => {
    const x = Math.min(b.x0, edge - b.w / 2);
    edge = x - b.w / 2 - 8;
    return {...b, x, tilt: x < b.x0 - 4 ? -5 - 3 * Math.sin(f / 3) : 0};
  }).reverse();
  return (
    <Bg a={P.beigeClaro} b={P.beige}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <path d="M600 0 L1080 0 L1080 420 L800 700 Z" fill={P.blanco} opacity=".5" />
        <g transform="translate(0 -480)">
        <rect x="0" y="1380" width="1080" height="380" fill="#C9A07B" />
        {[1440, 1520, 1610, 1690].map((y, i) => <path key={i} d={`M0 ${y} C300 ${y - 14} 700 ${y + 16} 1080 ${y}`} stroke="#B48A6A" strokeWidth="5" fill="none" opacity=".7" />)}
        {[[170, 1480], [640, 1650], [900, 1470], [400, 1700]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="55" ry="14" fill="none" stroke="#A97E5E" strokeWidth="4" opacity=".6" />)}
        <rect x="0" y="1750" width="1080" height="70" fill="#9C7356" />
        <rect x="0" y="1820" width="1080" height="600" fill="#E3D5C0" />
        {pos.map((b, i) => <Bottle key={i} {...b} />)}
        <g transform={`translate(${hand} 0)`}>
          {/* manga */}
          <rect x="150" y="1385" width="1100" height="175" rx="80" fill={P.rosa} />
          <rect x="120" y="1375" width="80" height="195" rx="34" fill={P.rosaOsc} />
          {/* muñeca + palma */}
          <rect x="60" y="1405" width="110" height="140" rx="40" fill={P.piel} />
          <rect x="-80" y="1350" width="190" height="215" rx="70" fill={P.piel} />
          {/* dedos hacia arriba */}
          {[[-74, 118], [-30, 138], [14, 130], [56, 108]].map(([x, h], i) =>
            <rect key={i} x={x} y={1365 - h} width="40" height={h + 30} rx="20" fill={P.piel} stroke={P.pielSombra} strokeWidth="3" />)}
          {/* pulgar */}
          <rect x="-120" y="1450" width="120" height="50" rx="25" fill={P.pielSombra} transform="rotate(-28 -60 1475)" />
          <path d="M-40 1480 q30 20 70 0" stroke={P.pielSombra} strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
        </g>
      </svg>
    </Bg>
  );
};

// 4) Mujer tranquila con una taza
export const CalmCup: React.FC = () => {
  const f = useCurrentFrame();
  const steam = (dx: number, delay: number) => {
    const t = ((f + delay) % 36) / 36;
    return <path d={`M${540 + dx} ${860 - t * 140} q22 -30 0 -60 q-22 -30 0 -60`} stroke={P.blanco} strokeWidth="12" fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI) * 0.9} />;
  };
  const breathe = 1 + 0.01 * Math.sin(f / 14);
  return (
    <Bg a={P.amarillo} b={P.beige}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        {/* ventana con luz */}
        <rect x="120" y="140" width="380" height="560" rx="190" fill={P.blanco} opacity=".55" />
        <path d="M310 140 L310 700 M120 420 L500 420" stroke={P.amarillo} strokeWidth="10" />
        <circle cx="880" cy="380" r="120" fill={P.blanco} opacity=".35" />
        <g transform={`translate(540 1000) scale(${breathe}) translate(-540 -1000)`}>
          <Woman sweater="#F4ECE0" sweaterShade="#E4D6C2" tilt={4} face="calm"
            arms={
              <g strokeLinecap="round" fill="none">
                <path d="M300 760 C220 900 280 1000 440 980" stroke="#E8DCCB" strokeWidth="118" />
                <path d="M780 760 C860 900 800 1000 640 980" stroke="#E8DCCB" strokeWidth="118" />
                {/* taza */}
                <rect x="455" y="880" width="170" height="170" rx="30" fill={P.amarilloOsc} />
                <path d="M625 920 q60 0 60 50 q0 50 -60 50" stroke={P.amarilloOsc} strokeWidth="22" />
                <rect x="455" y="880" width="170" height="26" rx="12" fill={P.marron} />
                <path d="M520 960 q20 -18 40 0 q-20 26 -40 0 Z" fill={P.rosa} />
                <ellipse cx="455" cy="985" rx="62" ry="50" fill={P.piel} />
                <ellipse cx="625" cy="985" rx="62" ry="50" fill={P.piel} />
              </g>
            } />
        </g>
        {steam(-40, 0)}{steam(0, 12)}{steam(40, 24)}
        {[[230, 900], [860, 820], [760, 600]].map(([x, y], i) => {
          const s = 0.6 + 0.4 * Math.abs(Math.sin((f + i * 10) / 12));
          return <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -26 L7 -7 L26 0 L7 7 L0 26 L-7 7 L-26 0 L-7 -7 Z" fill={P.blanco} />;
        })}
      </svg>
    </Bg>
  );
};
