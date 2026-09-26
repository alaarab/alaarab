import { useRef, useState, type ReactNode } from "react";
import { starPath } from "./parts";
import { seeded } from "./sky";
import styles from "./almanac.module.css";

/* ---------- small engraving helpers ---------- */

function Star({ x, y, size = 12, o = 1 }: { x: number; y: number; size?: number; o?: number }) {
  return <path d={starPath(size)} transform={`translate(${x} ${y})`} fill="var(--line)" opacity={o} />;
}

function Field({ w, h, n, seed, max = 1.2 }: { w: number; h: number; n: number; seed: number; max?: number }) {
  const r = seeded(seed);
  return (
    <g fill="var(--line)">
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={r() * w} cy={r() * h} r={0.4 + r() * r() * max} opacity={0.2 + r() * 0.45} />
      ))}
    </g>
  );
}

function Art({ w, h, children, label }: { w: number; h: number; children: ReactNode; label?: string }) {
  return (
    <svg
      className={styles.art}
      viewBox={`0 0 ${w} ${h}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {children}
    </svg>
  );
}

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + Math.cos((a * Math.PI) / 180) * r, cy + Math.sin((a * Math.PI) / 180) * r];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

/* ---------- Phren: notes remembered across sessions ---------- */

type Pt = { x: number; y: number };
const phren = (() => {
  const r = seeded(31);
  const sessions: Pt[][] = [];
  for (let s = 0; s < 5; s++) {
    const cx = 100 + s * 150;
    const cy = 190 + Math.sin(s * 1.3) * 60;
    const pts: Pt[] = [];
    const n = 6 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r() * 0.6;
      const d = 34 + r() * 44;
      pts.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.85 });
    }
    // Join each session's notes in the order a walk around its centre meets them.
    pts.sort((p, q) => Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx));
    sessions.push(pts);
  }
  const lines: [Pt, Pt, boolean][] = [];
  sessions.forEach((pts) => pts.slice(1).forEach((p, i) => lines.push([pts[i], p, false])));
  // Notes recalled in a later session.
  const recalls: [number, number, number, number][] = [
    [0, 1, 1, 2],
    [1, 1, 3, 2],
    [2, 2, 3, 1],
    [2, 1, 4, 2],
  ];
  for (const [s1, i1, s2, i2] of recalls) {
    lines.push([sessions[s1][i1 % sessions[s1].length], sessions[s2][i2 % sessions[s2].length], true]);
  }
  return { sessions, lines };
})();

function PhrenArt() {
  return (
    <Art w={800} h={370}>
      <Field w={800} h={370} n={70} seed={9} />
      <g stroke="var(--line)" fill="none">
        {phren.lines.map(([p, q, recall], i) => (
          <path
            key={i}
            // Recalled notes arc over the sessions between them, like a line drawn across the sky.
            d={
              recall
                ? `M${p.x} ${p.y} Q ${(p.x + q.x) / 2} ${Math.min(p.y, q.y) - 70} ${q.x} ${q.y}`
                : `M${p.x} ${p.y} L${q.x} ${q.y}`
            }
            pathLength={1}
            className={styles.drawIn}
            style={{ animationDelay: `${0.2 + i * 0.035}s` }}
            strokeWidth={recall ? 0.8 : 0.9}
            opacity={recall ? 0.7 : 0.8}
          />
        ))}
      </g>
      {phren.sessions.map((pts, s) => (
        <g key={s}>
          {pts.map((p, i) => (
            <Star key={i} x={p.x} y={p.y} size={i === 0 ? 20 : 12} />
          ))}
          <text x={100 + s * 150} y={352} textAnchor="middle" className={styles.artLabel}>
            session {["i", "ii", "iii", "iv", "v"][s]}
          </text>
        </g>
      ))}
    </Art>
  );
}

/* ---------- m4l-builder: an astrolabe you can play ---------- */

const RINGS = [
  { r: 58, k: 3 },
  { r: 92, k: 5 },
  { r: 126, k: 7 },
  { r: 160, k: 9 },
  { r: 194, k: 12 },
  { r: 222, k: 16 },
];

function wavePath(r: number, k: number, amp: number, phase: number) {
  const pts: string[] = [];
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const rr = r + amp * Math.sin(k * t + phase);
    pts.push(`${(Math.cos(t) * rr).toFixed(2)} ${(Math.sin(t) * rr).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

function Astrolabe({ v }: { v: number }) {
  const turn = v * 300;
  const limb = [];
  for (let i = 0; i < 360; i += 2) {
    const len = i % 30 === 0 ? 16 : i % 10 === 0 ? 10 : 5;
    limb.push(<line key={i} x1={0} y1={-262} x2={0} y2={-262 + len} transform={`rotate(${i})`} strokeWidth={i % 10 === 0 ? 0.9 : 0.5} />);
  }
  return (
    <Art w={600} h={600}>
      <g transform="translate(300 300)">
        <circle r={286} fill="var(--plane)" />
        <g fill="none" stroke="var(--line)">
          <circle r={286} strokeWidth={1.3} />
          <circle r={280} strokeWidth={0.5} />
          <circle r={262} strokeWidth={0.9} />
          {limb}
        </g>
        <g className={styles.artLabel} fill="var(--line)">
          {Array.from({ length: 12 }, (_, i) => (
            <text key={i} transform={`rotate(${i * 30}) translate(0 -236)${i > 3 && i < 9 ? " rotate(180)" : ""}`} textAnchor="middle" dominantBaseline="middle">
              {i * 30}
            </text>
          ))}
        </g>
        {/* The tympan: engraved rings that bend into waveforms as the rete turns. */}
        <g fill="none" stroke="var(--line)" strokeWidth={0.8} opacity={0.7}>
          {RINGS.map(({ r, k }, i) => (
            <path key={r} d={wavePath(r, k, v * (5 + i * 2.2), (turn * Math.PI) / 180 + i)} />
          ))}
          <line x1={-222} y1={0} x2={222} y2={0} strokeWidth={0.5} opacity={0.6} />
          <line x1={0} y1={-222} x2={0} y2={222} strokeWidth={0.5} opacity={0.6} />
        </g>
        {/* The rete: open fretwork with star pointers, turned by the knob. */}
        <g transform={`rotate(${turn})`} className={styles.rete}>
          <g fill="none" stroke="var(--accent)" strokeWidth={1.3}>
            <circle cx={0} cy={-62} r={150} />
            <circle cx={0} cy={-62} r={142} strokeWidth={0.6} />
            <path d="M-208 0 C -120 40, 120 40, 208 0" strokeWidth={0.9} />
            <path d="M0 -212 L0 88" strokeWidth={0.9} />
          </g>
          {[
            [-150, -120],
            [120, -150],
            [178, 20],
            [-96, 120],
            [60, 146],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${Math.atan2(y, x) * (180 / Math.PI) + 90})`}>
              <path d="M0 -16 C 5 -4, 4 6, 0 12 C -4 6, -5 -4, 0 -16Z" fill="var(--accent)" opacity={0.9} />
            </g>
          ))}
        </g>
        <circle r={9} fill="var(--plane)" stroke="var(--line)" strokeWidth={1} />
        <circle r={2.5} fill="var(--line)" />
      </g>
    </Art>
  );
}

export function Knob({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const drag = useRef<{ y: number; x: number; v: number } | null>(null);
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const pct = Math.round(value * 100);
  const angle = -135 + value * 270;
  return (
    <div
      className={styles.knob}
      role="slider"
      tabIndex={0}
      aria-label="Rete"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-valuetext={`${pct} percent`}
      onKeyDown={(e) => {
        const step = { ArrowUp: 0.02, ArrowRight: 0.02, ArrowDown: -0.02, ArrowLeft: -0.02, PageUp: 0.1, PageDown: -0.1 }[e.key];
        if (step !== undefined) onChange(clamp(value + step));
        else if (e.key === "Home") onChange(0);
        else if (e.key === "End") onChange(1);
        else return;
        e.preventDefault();
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, v: value };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        onChange(clamp(d.v + (e.clientX - d.x - (e.clientY - d.y)) / 220));
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
        <g stroke="var(--line)" fill="none">
          {Array.from({ length: 28 }, (_, i) => {
            const a = -135 + (i * 270) / 27;
            return <line key={i} x1={0} y1={-46} x2={0} y2={i % 9 === 0 ? -39 : -42} transform={`rotate(${a})`} strokeWidth={0.8} />;
          })}
          <circle r={33} fill="var(--plane)" strokeWidth={1.2} />
          <circle r={28} strokeWidth={0.5} opacity={0.7} />
        </g>
        <line x1={0} y1={-10} x2={0} y2={-29} stroke="var(--accent)" strokeWidth={2.4} strokeLinecap="round" transform={`rotate(${angle})`} />
        <circle r={3} fill="var(--line)" />
      </svg>
    </div>
  );
}

function M4lArt() {
  const [v, setV] = useState(0.3);
  return (
    <div className={styles.instrument}>
      <Astrolabe v={v} />
      <div className={styles.knobRow}>
        <Knob value={v} onChange={setV} />
        <p>
          Turn the knob. The rete turns, and the engraved rings bend into waveforms.
          <span className={styles.knobValue}> {Math.round(v * 100)}%</span>
        </p>
      </div>
    </div>
  );
}

/* ---------- Mina: one night, 9 PM to 5 AM ---------- */

function Moon({ x, y, f, R = 13 }: { x: number; y: number; f: number; R?: number }) {
  // f runs 0 (new) to 1 (new again); 0.5 is full.
  const waxing = f <= 0.5;
  const k = Math.cos(2 * Math.PI * f);
  const rx = Math.abs(k) * R;
  const crescent = waxing ? f < 0.25 : f > 0.75;
  const d = `M0 ${-R} A${R} ${R} 0 0 1 0 ${R} A${rx.toFixed(2)} ${R} 0 0 ${crescent ? 0 : 1} 0 ${-R}Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={R} fill="var(--plane)" stroke="var(--line)" strokeWidth={0.5} opacity={0.9} />
      <path d={d} fill="var(--moon)" opacity={0.88} transform={waxing ? undefined : "scale(-1 1)"} />
    </g>
  );
}

function MinaArt() {
  const hours = ["9 PM", "10", "11", "12", "1", "2", "3 AM", "4", "5 AM"];
  const fs = [0.08, 0.16, 0.26, 0.38, 0.5, 0.62, 0.74, 0.84, 0.92];
  const pos = hours.map((_, i) => {
    const t = i / (hours.length - 1);
    return { x: 60 + t * 560, y: 190 - Math.sin(t * Math.PI) * 110 };
  });
  return (
    <Art w={680} h={270}>
      <Field w={680} h={270} n={36} seed={3} max={0.8} />
      <path
        d={`M${pos[0].x} ${pos[0].y} Q 340 -30 ${pos[8].x} ${pos[8].y}`}
        fill="none"
        stroke="var(--line)"
        strokeWidth={0.6}
        strokeDasharray="1 5"
        opacity={0.6}
      />
      <line x1={30} y1={232} x2={650} y2={232} stroke="var(--line)" strokeWidth={0.6} opacity={0.5} />
      {pos.map((p, i) => (
        <g key={i}>
          <Moon x={p.x} y={p.y} f={fs[i]} />
          <line x1={p.x} y1={228} x2={p.x} y2={236} stroke="var(--line)" strokeWidth={0.6} opacity={0.6} />
          <text x={p.x} y={256} textAnchor="middle" className={styles.artLabel}>
            {hours[i]}
          </text>
        </g>
      ))}
      <Star x={pos[6].x + 24} y={pos[6].y - 22} size={14} />
    </Art>
  );
}

/* ---------- the smaller plates ---------- */

function BasisArt() {
  const beam = 150;
  const pan = (x: number) => (
    <g>
      <line x1={x} y1={beam} x2={x - 58} y2={282} />
      <line x1={x} y1={beam} x2={x + 58} y2={282} />
      <path d={`M${x - 70} 282 Q ${x} 318 ${x + 70} 282`} />
      <Star x={x} y={beam} size={14} />
      <Star x={x - 58} y={282} size={9} />
      <Star x={x + 58} y={282} size={9} />
    </g>
  );
  return (
    <Art w={800} h={400}>
      <Field w={800} h={400} n={50} seed={21} />
      <g fill="none" stroke="var(--line)" strokeWidth={0.9}>
        <line x1={230} y1={beam} x2={570} y2={beam} />
        <line x1={400} y1={96} x2={400} y2={356} strokeWidth={0.7} />
        <line x1={350} y1={356} x2={450} y2={356} />
        <path d="M388 110 L400 96 L412 110" />
        {pan(230)}
        {pan(570)}
      </g>
      <Star x={400} y={96} size={20} />
      <Star x={400} y={356} size={9} />
    </Art>
  );
}

function IntranetArt() {
  const radii = Array.from({ length: 11 }, (_, i) => 90 + i * 34);
  return (
    <Art w={800} h={400}>
      <Field w={800} h={400} n={40} seed={5} max={0.8} />
      <g fill="none" stroke="var(--line)">
        {radii.map((r, i) => (
          <path key={r} d={arc(400, 470, r, 212 + i * 1.5, 318 - i * 0.8)} strokeWidth={i === 10 ? 1.1 : 0.6} opacity={0.3 + i * 0.05} />
        ))}
      </g>
      {(() => {
        const a = ((318 - 8) * Math.PI) / 180;
        return <Star x={400 + Math.cos(a) * 430} y={470 + Math.sin(a) * 430} size={20} />;
      })()}
    </Art>
  );
}

function AtlasArt() {
  const beamStars = seeded(44);
  return (
    <Art w={800} h={400}>
      <defs>
        <filter id="alm-beam" x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <Field w={800} h={300} n={40} seed={12} max={0.7} />
      <path d="M130 220 L790 120 L790 330 Z" fill="var(--line)" opacity={0.09} filter="url(#alm-beam)" />
      <g fill="none" stroke="var(--line)" strokeWidth={0.6} opacity={0.6}>
        <line x1={130} y1={220} x2={790} y2={120} />
        <line x1={130} y1={220} x2={790} y2={330} />
      </g>
      {Array.from({ length: 12 }, (_, i) => {
        const t = 0.2 + beamStars() * 0.75;
        const x = 130 + t * 660;
        const y = 220 + (beamStars() - 0.5) * t * 190;
        return <Star key={i} x={x} y={y} size={7 + beamStars() * 5} />;
      })}
      <Star x={130} y={220} size={30} />
      <g stroke="var(--line)" strokeWidth={0.6} opacity={0.5}>
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={20 + i * 14} y1={330 + i * 10} x2={780 - i * 20} y2={330 + i * 10} strokeDasharray={i % 2 ? "30 8" : "60 10"} />
        ))}
      </g>
    </Art>
  );
}

function IntrapathArt() {
  return (
    <Art w={800} h={400}>
      <Field w={800} h={400} n={45} seed={17} max={0.8} />
      <path d="M60 330 C 200 280, 320 250, 420 240" fill="none" stroke="var(--line)" strokeWidth={0.7} strokeDasharray="2 6" opacity={0.6} />
      <path d="M420 240 C 520 232, 620 170, 740 70" fill="none" stroke="var(--line)" strokeWidth={1.1} />
      {[
        [60, 330, 8],
        [200, 288, 8],
        [320, 256, 8],
      ].map(([x, y, s], i) => (
        <Star key={i} x={x} y={y} size={s} o={0.55} />
      ))}
      {[
        [420, 240, 16],
        [540, 222, 11],
        [640, 160, 11],
        [740, 70, 20],
      ].map(([x, y, s], i) => (
        <Star key={i} x={x} y={y} size={s} />
      ))}
    </Art>
  );
}

function LiveMcpArt() {
  const wave = Array.from({ length: 81 }, (_, i) => {
    const x = 220 + i * 4.5;
    const env = Math.sin((i / 80) * Math.PI);
    return `${x.toFixed(1)} ${(200 + Math.sin(i * 0.55) * 16 * env).toFixed(1)}`;
  });
  return (
    <Art w={800} h={400}>
      <Field w={800} h={400} n={45} seed={23} max={0.8} />
      <g fill="none" stroke="var(--line)">
        <circle cx={160} cy={200} r={46} strokeWidth={0.9} />
        <circle cx={160} cy={200} r={60} strokeWidth={0.5} strokeDasharray="1 4" />
        <circle cx={640} cy={200} r={46} strokeWidth={0.9} />
        <circle cx={640} cy={200} r={60} strokeWidth={0.5} strokeDasharray="1 4" />
        <line x1={206} y1={186} x2={594} y2={186} strokeWidth={0.5} opacity={0.6} />
        <line x1={206} y1={214} x2={594} y2={214} strokeWidth={0.5} opacity={0.6} />
        <path d={`M${wave.join("L")}`} strokeWidth={0.9} stroke="var(--accent)" />
      </g>
      <Star x={160} y={200} size={22} />
      <Star x={640} y={200} size={22} />
    </Art>
  );
}

function OgridArt() {
  const cols = 9;
  const rows = 5;
  const x0 = 130;
  const y0 = 70;
  const c = 60;
  const r = seeded(8);
  return (
    <Art w={800} h={400}>
      <rect x={x0 + c * 3} y={y0 + c * 1} width={c * 3} height={c * 2} fill="var(--accent)" opacity={0.14} />
      <g stroke="var(--line)" strokeWidth={0.6} opacity={0.55}>
        {Array.from({ length: cols + 1 }, (_, i) => (
          <line key={`c${i}`} x1={x0 + i * c} y1={y0} x2={x0 + i * c} y2={y0 + rows * c} />
        ))}
        {Array.from({ length: rows + 1 }, (_, i) => (
          <line key={`r${i}`} x1={x0} y1={y0 + i * c} x2={x0 + cols * c} y2={y0 + i * c} />
        ))}
      </g>
      <rect x={x0 + c * 3} y={y0 + c} width={c * 3} height={c * 2} fill="none" stroke="var(--accent)" strokeWidth={1.2} />
      <rect x={x0 + c * 6 - 4} y={y0 + c * 3 - 4} width={8} height={8} fill="var(--accent)" />
      {Array.from({ length: 22 }, (_, i) => (
        <Star key={i} x={x0 + c / 2 + Math.floor(r() * cols) * c} y={y0 + c / 2 + Math.floor(r() * rows) * c} size={6 + r() * 7} />
      ))}
    </Art>
  );
}

function MutterArt() {
  return (
    <Art w={800} h={400}>
      <Field w={800} h={400} n={40} seed={29} max={0.8} />
      <g fill="none" stroke="var(--line)" strokeWidth={0.7}>
        {[36, 72, 108, 144, 180].map((r, i) => (
          <g key={r} opacity={0.75 - i * 0.12}>
            <circle cx={300} cy={200} r={r} />
            <circle cx={500} cy={200} r={r} />
          </g>
        ))}
      </g>
      <Star x={300} y={200} size={20} />
      <Star x={500} y={200} size={20} />
    </Art>
  );
}

function AlphalensArt() {
  const r = seeded(51);
  return (
    <Art w={800} h={400}>
      <Field w={800} h={400} n={90} seed={52} max={0.7} />
      <circle cx={400} cy={200} r={150} fill="var(--plane)" />
      <g fill="none" stroke="var(--line)">
        <circle cx={400} cy={200} r={150} strokeWidth={1.1} />
        <circle cx={400} cy={200} r={158} strokeWidth={0.5} />
        <line x1={250} y1={200} x2={550} y2={200} strokeWidth={0.5} opacity={0.6} />
        <line x1={400} y1={50} x2={400} y2={350} strokeWidth={0.5} opacity={0.6} />
        {Array.from({ length: 72 }, (_, i) => (
          <line key={i} x1={400} y1={42} x2={400} y2={i % 6 === 0 ? 34 : 38} transform={`rotate(${i * 5} 400 200)`} strokeWidth={0.5} />
        ))}
      </g>
      {Array.from({ length: 14 }, (_, i) => {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * 120;
        return <Star key={i} x={400 + Math.cos(a) * d} y={200 + Math.sin(a) * d} size={8 + r() * 10} />;
      })}
    </Art>
  );
}

function EmvArt() {
  const r = seeded(61);
  return (
    <Art w={800} h={400}>
      <Field w={800} h={400} n={40} seed={62} max={0.7} />
      <ellipse cx={400} cy={200} rx={250} ry={130} fill="none" stroke="var(--line)" strokeWidth={0.6} strokeDasharray="2 6" opacity={0.7} />
      {Array.from({ length: 26 }, (_, i) => {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r());
        return <Star key={i} x={400 + Math.cos(a) * d * 220} y={200 + Math.sin(a) * d * 110} size={6 + r() * 9} />;
      })}
    </Art>
  );
}

function EquipmentArt() {
  const ticks = [];
  for (let a = 240; a <= 300; a += 1.5) {
    const major = Math.round((a - 240) / 1.5) % 5 === 0;
    const t = (a * Math.PI) / 180;
    ticks.push(
      <line
        key={a}
        x1={400 + Math.cos(t) * 300}
        y1={400 + Math.sin(t) * 300}
        x2={400 + Math.cos(t) * (major ? 284 : 292)}
        y2={400 + Math.sin(t) * (major ? 284 : 292)}
        strokeWidth={major ? 0.9 : 0.5}
      />,
    );
  }
  return (
    <Art w={800} h={400}>
      <Field w={800} h={260} n={40} seed={71} max={0.7} />
      <g fill="none" stroke="var(--line)">
        <path d={arc(400, 400, 300, 240, 300)} strokeWidth={1.1} />
        <path d={arc(400, 400, 276, 240, 300)} strokeWidth={0.5} />
        {ticks}
        <line x1={400} y1={400} x2={250} y2={140} strokeWidth={0.8} />
        <line x1={400} y1={400} x2={550} y2={140} strokeWidth={0.8} />
        <line x1={400} y1={400} x2={462} y2={112} strokeWidth={1.2} stroke="var(--accent)" />
      </g>
      <Star x={470} y={78} size={18} />
    </Art>
  );
}

function GardenArt() {
  return (
    <Art w={800} h={400}>
      <Field w={800} h={260} n={40} seed={81} max={0.7} />
      <g fill="none" stroke="var(--line)" strokeWidth={0.9}>
        <line x1={120} y1={330} x2={680} y2={330} strokeWidth={0.7} />
        <path d="M400 330 C 398 290, 404 262, 400 230" />
        <path d="M400 282 C 380 262, 356 262, 346 272 C 362 286, 384 288, 400 282" />
        <path d="M401 256 C 420 236, 446 236, 456 246 C 440 260, 418 262, 401 256" />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={150 + i * 60} y1={340} x2={170 + i * 60} y2={340} strokeWidth={0.5} opacity={0.6} />
        ))}
        <circle cx={220} cy={120} r={20} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={220} y1={92} x2={220} y2={84} transform={`rotate(${i * 30} 220 120)`} strokeWidth={0.7} />
        ))}
        <path d="M580 104 C 592 124, 598 134, 580 142 C 562 134, 568 124, 580 104Z" />
        <g strokeDasharray="1 5" strokeWidth={0.6} opacity={0.7}>
          <line x1={240} y1={136} x2={390} y2={226} />
          <line x1={400} y1={90} x2={400} y2={222} />
          <line x1={566} y1={134} x2={412} y2={226} />
        </g>
      </g>
      <Star x={400} y={78} size={16} />
    </Art>
  );
}

function RetrofitArt() {
  return (
    <Art w={800} h={400}>
      <Field w={800} h={300} n={40} seed={91} max={0.7} />
      <g fill="none" stroke="var(--line)">
        <line x1={120} y1={340} x2={700} y2={340} strokeWidth={0.7} />
        <path d="M150 340 C 260 300, 330 250, 400 220 S 560 130, 640 80" strokeWidth={0.8} strokeDasharray="2 6" />
        {[
          [150, 340],
          [400, 220],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={8} strokeWidth={0.9} />
        ))}
        <line x1={640} y1={40} x2={640} y2={340} strokeWidth={0.5} opacity={0.6} />
      </g>
      <Star x={640} y={80} size={20} />
    </Art>
  );
}

/* ---------- the per-project table ---------- */

export type PlateTheme = {
  ground: string;
  plane: string;
  accent: string;
  haze?: string;
  /** Plate caption: describes the drawing, never the project. */
  caption: string;
  Art: () => ReactNode;
  showcase?: "phren" | "m4l" | "mina";
};

export const plates: Record<string, PlateTheme> = {
  phren: {
    ground: "#2a2b50",
    plane: "#34355f",
    accent: "#dcaacb",
    caption: "Notes kept over five sessions, joined where one recalls another.",
    Art: PhrenArt,
    showcase: "phren",
  },
  "m4l-builder": {
    ground: "#302e47",
    plane: "#3b3852",
    accent: "#e6b37d",
    caption: "An astrolabe, with a rete you can turn.",
    Art: M4lArt,
    showcase: "m4l",
  },
  mina: {
    ground: "#2d3050",
    plane: "#373a5c",
    accent: "#eab9b1",
    caption: "One night, 9 PM to 5 AM. A star at 3 AM.",
    Art: MinaArt,
    showcase: "mina",
  },
  basis: {
    ground: "#233449",
    plane: "#2c3f56",
    accent: "#a9d2c6",
    caption: "A balance, drawn in stars and held level.",
    Art: BasisArt,
  },
  "intranet-erp": {
    ground: "#27304b",
    plane: "#303a58",
    accent: "#e3a98f",
    caption: "A long, steady star track across the plate, 2013 to 2023.",
    Art: IntranetArt,
  },
  atlas: {
    ground: "#21354f",
    plane: "#2a405c",
    accent: "#a2d4cc",
    caption: "A star whose light is a lighthouse beam.",
    Art: AtlasArt,
  },
  intrapath: {
    ground: "#2c2f4d",
    plane: "#363958",
    accent: "#eba6aa",
    caption: "An old course, and the new one drawn from where it ended.",
    Art: IntrapathArt,
  },
  livemcp: {
    ground: "#22344f",
    plane: "#2b3e5b",
    accent: "#a0cbe6",
    caption: "Two stars, and a bridge that carries a signal between them.",
    Art: LiveMcpArt,
  },
  ogrid: {
    ground: "#253549",
    plane: "#2e3f55",
    accent: "#b0d4a4",
    caption: "Stars set in a graticule, with a range selected.",
    Art: OgridArt,
  },
  mutter: {
    ground: "#292f52",
    plane: "#33395e",
    accent: "#bdbcf0",
    caption: "Two stars, their voices widening until they meet.",
    Art: MutterArt,
  },
  alphalens: {
    ground: "#2d3049",
    plane: "#373a55",
    accent: "#e9c283",
    caption: "A field seen through the eyepiece.",
    Art: AlphalensArt,
  },
  emv: {
    ground: "#273449",
    plane: "#303e55",
    accent: "#c6d89f",
    caption: "An open cluster, loosely bound.",
    Art: EmvArt,
  },
  "equipment-tracker": {
    ground: "#243449",
    plane: "#2d3e55",
    accent: "#a3d2de",
    caption: "A sextant, taking the height of one star.",
    Art: EquipmentArt,
  },
  "garden-sensor-network": {
    ground: "#26364a",
    plane: "#2f4056",
    accent: "#bcd69e",
    caption: "Light, warmth, and water, each read against one small plant.",
    Art: GardenArt,
  },
  "retrofit-program-data-tools": {
    ground: "#2a3149",
    plane: "#333b55",
    accent: "#e2b78e",
    caption: "A route from the field to a fixed star.",
    Art: RetrofitArt,
  },
};
