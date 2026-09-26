/**
 * Small helpers for "carving" SVG: gouge marks are lens-shaped strokes that
 * taper at both ends, the way a V-tool or U-gouge leaves the block.
 */

export type Pt = [number, number];

/** Deterministic PRNG (mulberry32) so a plate is cut the same way every render. */
export function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

const n = (v: number) => Math.round(v * 10) / 10;

/** One straight-ish gouge from a to b, widest in the middle. */
export function gouge(x1: number, y1: number, x2: number, y2: number, w: number, bend = 0): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = (x1 + x2) / 2 + nx * bend;
  const cy = (y1 + y2) / 2 + ny * bend;
  return `M${n(x1)} ${n(y1)}Q${n(cx + nx * w)} ${n(cy + ny * w)} ${n(x2)} ${n(y2)}Q${n(cx - nx * w)} ${n(cy - ny * w)} ${n(x1)} ${n(y1)}Z`;
}

/** A gouge that follows a polyline, tapering to points at both ends. */
export function lens(pts: Pt[], w: number): string {
  const len = pts.length;
  if (len < 2) return "";
  if (len === 2) return gouge(pts[0][0], pts[0][1], pts[1][0], pts[1][1], w);
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i < len; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(len - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    const h = (w / 2) * Math.pow(Math.max(0, Math.sin((Math.PI * i) / (len - 1))), 0.7);
    const [x, y] = pts[i];
    top.push(`${n(x - (dy / l) * h)} ${n(y + (dx / l) * h)}`);
    bot.push(`${n(x + (dy / l) * h)} ${n(y - (dx / l) * h)}`);
  }
  return `M${top.join("L")}L${bot.reverse().join("L")}Z`;
}

/** Sample y = f(x) between x0 and x1. */
export function along(f: (x: number) => number, x0: number, x1: number, step = 8): Pt[] {
  const pts: Pt[] = [];
  const dir = x1 >= x0 ? 1 : -1;
  for (let x = x0; dir > 0 ? x < x1 : x > x1; x += step * dir) pts.push([x, f(x)]);
  pts.push([x1, f(x1)]);
  return pts;
}

/** A ridge line made of a few sine waves: [amplitude, frequency, phase]. */
export const ridge =
  (base: number, waves: [number, number, number][]) =>
  (x: number) =>
    waves.reduce((y, [a, f, p]) => y + a * Math.sin(x * f + p), base);

/** Closed path of the area under a ridge down to `bottom`. */
export function underRidge(f: (x: number) => number, x0: number, x1: number, bottom: number, step = 8): string {
  const pts = along(f, x0, x1, step);
  return `M${n(x0)} ${n(bottom)}L${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}L${n(x1)} ${n(bottom)}Z`;
}

type CutOpts = { seg: [number, number]; gap: [number, number]; w: number | ((x: number, y: number) => number) };

/** Break a polyline into a run of gouges with random lengths and gaps. */
export function cutsAlong(pts: Pt[], r: () => number, o: CutOpts): string {
  const out: string[] = [];
  let i = Math.floor(r() * 3);
  while (i < pts.length - 1) {
    const seg = Math.max(2, Math.round(o.seg[0] + r() * (o.seg[1] - o.seg[0])));
    const run = pts.slice(i, Math.min(pts.length, i + seg));
    if (run.length >= 2) {
      const mid = run[Math.floor(run.length / 2)];
      const w = typeof o.w === "number" ? o.w : o.w(mid[0], mid[1]);
      if (w > 0.3) out.push(lens(run, w * (0.75 + r() * 0.5)));
    }
    i += seg + Math.round(o.gap[0] + r() * (o.gap[1] - o.gap[0]));
  }
  return out.join("");
}

/** Rows of cuts that follow a ridge downward: k-th row sits k*spacing below it. */
export function contourCuts(
  f: (x: number) => number,
  x0: number,
  x1: number,
  rows: number,
  spacing: number,
  r: () => number,
  w: (k: number) => number,
  first = 1,
): string {
  let d = "";
  for (let k = first; k < rows + first; k++) {
    const pts = along((x) => f(x) + k * spacing, x0, x1, 6);
    d += cutsAlong(pts, r, { seg: [3, 14], gap: [1, 4], w: w(k) });
  }
  return d;
}

/** Horizontal gouge rows filling a rectangle, width set per point. */
export function hatch(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  spacing: number,
  r: () => number,
  w: number | ((x: number, y: number) => number),
  seg: [number, number] = [3, 12],
): string {
  let d = "";
  for (let y = y0; y <= y1; y += spacing) {
    const jitter = (r() - 0.5) * spacing * 0.3;
    const pts = along(() => y + jitter, x0, x1, 7);
    d += cutsAlong(pts, r, { seg, gap: [1, 3], w });
  }
  return d;
}

/** Vertical gouges in a rectangle, e.g. wood grain or wall texture. */
export function vHatch(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  spacing: number,
  r: () => number,
  w: number | ((x: number, y: number) => number),
): string {
  let d = "";
  for (let x = x0; x <= x1; x += spacing) {
    let y = y0 + r() * 10;
    while (y < y1) {
      const len = 14 + r() * 50;
      const ye = Math.min(y1, y + len);
      const ww = typeof w === "number" ? w : w(x, (y + ye) / 2);
      if (ww > 0.3 && ye - y > 6) d += gouge(x + (r() - 0.5) * 2, y, x + (r() - 0.5) * 2, ye, ww * (0.7 + r() * 0.6));
      y = ye + 3 + r() * 10;
    }
  }
  return d;
}

/** Concentric broken rings, for suns, lamps, speaker cones. */
export function rings(cx: number, cy: number, r0: number, r1: number, spacing: number, r: () => number, w: number | ((rad: number) => number)): string {
  let d = "";
  for (let rad = r0; rad <= r1; rad += spacing) {
    const steps = Math.max(12, Math.round(rad / 3));
    const pts: Pt[] = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    }
    const ww = typeof w === "number" ? w : w(rad);
    d += cutsAlong(pts, r, { seg: [3, 8], gap: [0, 2], w: ww });
  }
  return d;
}

/** A slightly wobbly rectangle outline path, for block edges and frames. */
export function wobblyRect(x: number, y: number, w: number, h: number, r: () => number, amt = 1.2): string {
  const pts: Pt[] = [];
  const side = (ax: number, ay: number, bx: number, by: number) => {
    const steps = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 40));
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      pts.push([ax + (bx - ax) * t + (r() - 0.5) * amt, ay + (by - ay) * t + (r() - 0.5) * amt]);
    }
  };
  side(x, y, x + w, y);
  side(x + w, y, x + w, y + h);
  side(x + w, y + h, x, y + h);
  side(x, y + h, x, y);
  return `M${pts.map(([a, b]) => `${n(a)} ${n(b)}`).join("L")}Z`;
}
