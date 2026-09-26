/** Drawing helpers shared by the country map and the project insets. */

export type Pt = [number, number];

/** Small deterministic PRNG so the hand-drawn jitter is the same on every render. */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Catmull-Rom through the points, as cubic Beziers. */
export function smooth(points: Pt[], closed = true): string {
  const n = points.length;
  const at = (i: number) =>
    closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))];
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
}

/** Insert jittered midpoints so a coarse outline reads as a crinkled, hand-inked edge. */
export function roughen(points: Pt[], seed: number, amp = 10, levels = 2, closed = true): Pt[] {
  const r = rng(seed);
  let pts = points;
  let a = amp;
  for (let l = 0; l < levels; l++) {
    const out: Pt[] = [];
    const n = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      out.push(p);
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const len = Math.hypot(dx, dy) || 1;
      const off = (r() - 0.5) * 2 * a;
      out.push([(p[0] + q[0]) / 2 + (-dy / len) * off, (p[1] + q[1]) / 2 + (dx / len) * off]);
    }
    if (!closed) out.push(pts[pts.length - 1]);
    pts = out;
    a *= 0.5;
  }
  return pts;
}

/** A soft blob (for watercolor washes) around a centre. */
export function blob(cx: number, cy: number, rx: number, ry: number, seed: number, lobes = 13): string {
  const r = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < lobes; i++) {
    const t = (i / lobes) * Math.PI * 2;
    const k = 0.62 + r() * 0.6;
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
  }
  return smooth(pts);
}

/** Tolkien-style hill: an arc with a few shading strokes on its eastern flank. */
export function Hill({ x, y, s = 14 }: { x: number; y: number; s?: number }) {
  const h = s * 0.95;
  return (
    <g>
      <path d={`M${x - s} ${y} Q${x - s * 0.2} ${y - h * 1.5} ${x + s} ${y}`} />
      <path
        d={`M${x + s * 0.25} ${y - h * 0.5} l${s * 0.28} ${h * 0.42} M${x + s * 0.5} ${y - h * 0.3} l${s * 0.22} ${h * 0.26}`}
        strokeWidth="0.9"
      />
    </g>
  );
}

/** A little round-crowned tree mark. */
export function Tree({ x, y, s = 7 }: { x: number; y: number; s?: number }) {
  const r = s * 0.78;
  return (
    <g>
      <path d={`M${x} ${y} v${-s * 0.55}`} strokeWidth="0.9" />
      <path
        d={`M${x - r} ${y - s * 0.6} a${r} ${r * 1.05} 0 1 1 ${r * 2} 0 q${-r} ${r * 0.45} ${-r * 2} 0 Z`}
        className="crown"
      />
    </g>
  );
}

/** A watercolor patch: a pale fill with a slightly darker pooled edge. */
export function Wash({ d, color, o = 0.3 }: { d: string; color: string; o?: number }) {
  return (
    <g>
      <path d={d} fill={color} opacity={o} />
      <path d={d} fill="none" stroke={color} strokeWidth="7" opacity={o * 0.55} />
    </g>
  );
}

/** Scatter trees in an elliptical clump. */
export function Forest({ cx, cy, rx, ry, n, seed, s = 7 }: {
  cx: number; cy: number; rx: number; ry: number; n: number; seed: number; s?: number;
}) {
  const r = rng(seed);
  const trees: Pt[] = [];
  for (let i = 0; i < n * 4 && trees.length < n; i++) {
    const t = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    const p: Pt = [cx + Math.cos(t) * rx * d, cy + Math.sin(t) * ry * d];
    if (trees.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > s * 1.25)) trees.push(p);
  }
  trees.sort((a, b) => a[1] - b[1]);
  return (
    <g>
      {trees.map(([x, y], i) => (
        <Tree key={i} x={x} y={y} s={s * (0.85 + ((i * 37) % 10) / 30)} />
      ))}
    </g>
  );
}

/** A row of hills along a gentle line. */
export function Range({ from, to, n, seed, s = 14 }: { from: Pt; to: Pt; n: number; seed: number; s?: number }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const x = from[0] + (to[0] - from[0]) * t + (r() - 0.5) * s * 0.8;
        const y = from[1] + (to[1] - from[1]) * t + (r() - 0.5) * s * 1.2;
        return <Hill key={i} x={x} y={y} s={s * (0.8 + r() * 0.45)} />;
      })}
    </g>
  );
}

/** Small compass rose: a four-point star and a lettered north. */
export function Compass({ x, y, s = 34 }: { x: number; y: number; s?: number }) {
  const k = s * 0.22;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={s * 0.62} strokeWidth="0.8" fill="none" />
      <circle r={s * 0.7} strokeWidth="0.5" fill="none" />
      <path d={`M0 ${-s} L${k} ${-k} L${s} 0 L${k} ${k} L0 ${s} L${-k} ${k} L${-s} 0 L${-k} ${-k} Z`} fill="none" strokeWidth="1" />
      <path d={`M0 ${-s} L${k} ${-k} L0 0 Z M${s} 0 L${k} ${k} L0 0 Z M0 ${s} L${-k} ${k} L0 0 Z M${-s} 0 L${-k} ${-k} L0 0 Z`} className="solid" stroke="none" />
      <text y={-s - 8} textAnchor="middle" className="compassN">N</text>
    </g>
  );
}

/** Filters: watercolor wash (displaced, blurred, mottled) and a light line wobble. */
export function InkDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-wash`} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="44" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="3.2" result="b" />
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="9" result="g" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 -0.1" result="ga" />
        <feComposite in="b" in2="ga" operator="in" />
      </filter>
      <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <filter id={`${id}-wobble`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
}
