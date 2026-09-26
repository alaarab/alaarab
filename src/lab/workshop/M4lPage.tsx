import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { Link } from "react-router";
import type { Project } from "../../types";
import { C, SceneDefs } from "./objects";
import { Particulars, Prose, WalkOn } from "./Prose";
import { FontLinks } from "./shared";
import styles from "./workshop.module.css";

const SHAPES = ["sine", "triangle", "saw", "square"];

/** One cycle of each basic shape, phase in [0, 1), output in [-1, 1]. */
const basics = [
  (x: number) => Math.sin(x * 2 * Math.PI),
  (x: number) => 1 - 4 * Math.abs(((x + 0.25) % 1) - 0.5),
  (x: number) => 2 * ((x + 0.5) % 1) - 1,
  (x: number) => (x % 1 < 0.5 ? 0.92 : -0.92),
];

/** The knob sweeps sine to triangle to saw to square. */
function wavePath(value: number, x0: number, y0: number, w: number, h: number) {
  const t = (value / 100) * 3;
  const i = Math.min(2, Math.floor(t));
  const f = t - i;
  const n = 240;
  let d = "";
  for (let k = 0; k <= n; k++) {
    const phase = (k / n) * 2.5;
    const y = basics[i](phase) * (1 - f) + basics[i + 1](phase) * f;
    d += `${k ? "L" : "M"}${(x0 + (k / n) * w).toFixed(1)} ${(y0 - y * h).toFixed(1)}`;
  }
  return d;
}

const describe = (v: number) => {
  const t = (v / 100) * 3;
  const near = Math.round(t);
  return Math.abs(t - near) < 0.12 ? SHAPES[near] : `between ${SHAPES[Math.floor(t)]} and ${SHAPES[Math.ceil(t)]}`;
};

const KX = 1000;
const KY = 318;

/** m4l-builder: the little box up close. The big knob works. */
export function M4lPage({ p }: { p: Project }) {
  const [value, setValue] = useState(18);
  const drag = useRef<{ y: number; v: number } | null>(null);
  const set = (v: number) => setValue(Math.max(0, Math.min(100, Math.round(v))));
  const angle = -135 + (value / 100) * 270;

  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowUp: 2, ArrowRight: 2, ArrowDown: -2, ArrowLeft: -2, PageUp: 10, PageDown: -10 };
    if (e.key in step) set(value + step[e.key]);
    else if (e.key === "Home") set(0);
    else if (e.key === "End") set(100);
    else return;
    e.preventDefault();
  };
  const onDown = (e: PointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, v: value };
  };
  const onMove = (e: PointerEvent<SVGGElement>) => {
    if (drag.current) set(drag.current.v + (drag.current.y - e.clientY) * 0.6);
  };
  const onUp = () => {
    drag.current = null;
  };

  const ticks = Array.from({ length: 13 }, (_, i) => -135 + i * 22.5);

  return (
    <div className={`${styles.root} ${styles.m4l}`}>
      <FontLinks />
      <div className={styles.close}>
        <svg className={styles.closeSvg} viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" role="group" aria-label="The m4l-builder box up close: a screen showing a waveform, a large shape knob, and a patch cable.">
          <SceneDefs />
          <defs>
            <radialGradient id="ws-m4l-wall" cx="300" cy="80" r="1200" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#e9c9a0" />
              <stop offset="1" stopColor="#8e7466" />
            </radialGradient>
            <linearGradient id="ws-m4l-panel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d9a068" />
              <stop offset="1" stopColor="#b27544" />
            </linearGradient>
            <radialGradient id="ws-m4l-knob" cx="0.38" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#fbf2e0" />
              <stop offset="1" stopColor="#dccbab" />
            </radialGradient>
            <filter id="ws-m4l-glow" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <rect width="1440" height="760" fill="url(#ws-m4l-wall)" />
          <polygon points="0,0 360,0 900,560 420,560" fill="#ffd9a0" opacity="0.28" filter="url(#ws-blur-lg)" />
          <rect y="596" width="1440" height="164" fill="#7a5038" />
          <path d="M0 597 H1440" stroke={C.honey} strokeWidth="2" opacity="0.3" />
          <ellipse cx="760" cy="612" rx="560" ry="34" fill={C.shadow} opacity="0.4" filter="url(#ws-blur-lg)" />

          <g filter="url(#ws-wobble)">
            <polygon points="240,150 1200,150 1160,112 280,112" fill="#e5b886" />
            <rect x="240" y="150" width="960" height="460" rx="22" fill="url(#ws-m4l-panel)" />
            <path d="M262 152 H1178" stroke="#f6d6a6" strokeWidth="3" opacity="0.7" />
            <rect x="300" y="200" width="480" height="236" rx="14" fill="#3b4260" />
            <path d="M320 318 H760 M540 216 V420" stroke="#5a6386" strokeWidth="1" opacity="0.7" />
            <text x="300" y="480" className={styles.silk} aria-hidden="true">m4l-builder</text>
            {[[380, 540], [500, 540]].map(([x, y]) => (
              <g key={x} aria-hidden="true">
                <circle cx={x + 3} cy={y + 4} r="30" fill="#7c4e2c" opacity="0.4" />
                <circle cx={x} cy={y} r="28" fill="url(#ws-m4l-knob)" />
                <path d={`M${x} ${y} L${x - 12} ${y - 22}`} stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
              </g>
            ))}
            {[640, 740, 840, 940].map((x) => (
              <g key={x}>
                <circle cx={x} cy="548" r="15" fill="#d8b78e" />
                <circle cx={x} cy="548" r="8" fill="#2c2833" />
              </g>
            ))}
          </g>
          <path d={wavePath(value, 330, 318, 420, 78)} stroke={C.honey} strokeWidth="7" fill="none" opacity="0.5" filter="url(#ws-m4l-glow)" />
          <path d={wavePath(value, 330, 318, 420, 78)} stroke="#fbe0a8" strokeWidth="3" fill="none" strokeLinejoin="round" />

          {/* The patch cable, hanging from two jacks */}
          <g className={styles.cable}>
            <path d="M740 548 C740 720, 940 720, 940 548" stroke={C.roseDeep} strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M740 548 C740 720, 940 720, 940 548" stroke="#d98d86" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" transform="translate(-2 -3)" />
          </g>
          {[740, 940].map((x) => (
            <rect key={x} x={x - 9} y="536" width="18" height="28" rx="4" fill="#4c4452" />
          ))}

          {/* The shape knob */}
          {ticks.map((a) => (
            <line
              key={a}
              x1={KX + Math.sin((a * Math.PI) / 180) * 128}
              y1={KY - Math.cos((a * Math.PI) / 180) * 128}
              x2={KX + Math.sin((a * Math.PI) / 180) * 142}
              y2={KY - Math.cos((a * Math.PI) / 180) * 142}
              stroke="#5a3a24"
              strokeWidth="3"
              strokeLinecap="round"
              opacity={a <= angle ? 0.9 : 0.35}
            />
          ))}
          <text x={KX} y={KY + 180} textAnchor="middle" className={styles.silkSmall} aria-hidden="true">shape</text>
          <g
            role="slider"
            tabIndex={0}
            aria-label="Wave shape"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-valuetext={describe(value)}
            className={styles.knob}
            onKeyDown={onKey}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <circle cx={KX + 6} cy={KY + 10} r="112" fill="#6e4426" opacity="0.45" filter="url(#ws-blur)" />
            <circle cx={KX} cy={KY} r="108" fill="#caa57a" />
            <circle cx={KX} cy={KY} r="96" fill="url(#ws-m4l-knob)" />
            <circle cx={KX} cy={KY} r="110" className={styles.knobRing} />
            <g transform={`rotate(${angle} ${KX} ${KY})`}>
              <line x1={KX} y1={KY - 24} x2={KX} y2={KY - 86} stroke={C.ink} strokeWidth="8" strokeLinecap="round" />
            </g>
          </g>
          <rect width="1440" height="760" filter="url(#ws-grain)" pointerEvents="none" />
        </svg>
        <Link to="/lab/workshop" className={styles.backOver}>Back to the desk</Link>
        <p className={styles.fig} aria-live="polite">Turn the knob: {describe(value)}.</p>
      </div>
      <main className={styles.page}>
        <h1 className={styles.title}>{p.title}</h1>
        <p className={styles.meta}>{p.year}. {p.status}.</p>
        <p className={styles.lead}>{p.summary}</p>
        {p.quote && <blockquote className={styles.quote}>{p.quote}</blockquote>}
        <Prose p={p} />
        <Particulars p={p} />
        <WalkOn p={p} />
      </main>
    </div>
  );
}
