/** Small helpers for the painted scenes: seeded randomness, colour mixing, ridgelines. */

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hex(a);
  const [br, bg, bb] = hex(b);
  const ch = (x: number, y: number) =>
    Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(ar!, br!)}${ch(ag!, bg!)}${ch(ab!, bb!)}`;
}

export type Ridge = (x: number) => number;

/** Closed path under a ridgeline, down to the bottom of the frame. */
export function ridgePath(y: Ridge, step = 12, bottom = 900, from = -40, to = 1480): string {
  let d = `M${from} ${bottom} L${from} ${y(from).toFixed(1)}`;
  for (let x = from + step; x <= to; x += step) d += ` L${x} ${y(x).toFixed(1)}`;
  return `${d} L${to} ${bottom} Z`;
}

/** A band between two ridgelines (used for fields, roads, rivers). */
export function bandPath(top: Ridge, bottom: Ridge, x0: number, x1: number, step = 8): string {
  let d = `M${x0} ${top(x0).toFixed(1)}`;
  for (let x = x0 + step; x < x1; x += step) d += ` L${x} ${top(x).toFixed(1)}`;
  d += ` L${x1} ${top(x1).toFixed(1)} L${x1} ${bottom(x1).toFixed(1)}`;
  for (let x = x1 - step; x > x0; x -= step) d += ` L${x} ${bottom(x).toFixed(1)}`;
  return `${d} L${x0} ${bottom(x0).toFixed(1)} Z`;
}

/** Gently rolling hills from a seed: three sines of falling weight. */
export function rolling(seed: number, base: number, amp: number, scale = 1): Ridge {
  const r = rng(seed);
  const f1 = (0.0022 + r() * 0.0022) * scale;
  const p = [r() * 6.28, r() * 6.28, r() * 6.28];
  return (x) =>
    base +
    amp *
      (0.58 * Math.sin(x * f1 + p[0]!) +
        0.3 * Math.sin(x * f1 * 2.3 + p[1]!) +
        0.12 * Math.sin(x * f1 * 5.1 + p[2]!));
}

export interface Knoll {
  x: number;
  h: number;
  w?: number;
}

export const withKnolls =
  (ridge: Ridge, knolls: Knoll[]): Ridge =>
  (x) =>
    knolls.reduce((y, k) => y - k.h * Math.exp(-(((x - k.x) / (k.w ?? 190)) ** 2)), ridge(x));

/** Waveforms for the m4l-builder ridges; morph runs 0 (sine) to 3 (square). */
const waves: Array<(u: number) => number> = [
  (u) => Math.sin(2 * Math.PI * u),
  (u) => {
    const t = u - 0.25 - Math.floor(u - 0.25);
    return 4 * Math.abs(t - 0.5) - 1;
  },
  (u) => {
    const t = u - Math.floor(u);
    return 1 - 2 * t;
  },
  (u) => Math.tanh(7 * Math.sin(2 * Math.PI * u)),
];

export function wave(u: number, morph: number): number {
  const m = Math.max(0, Math.min(3, morph));
  const i = Math.min(2, Math.floor(m));
  const f = m - i;
  return waves[i]!(u) * (1 - f) + waves[i + 1]!(u) * f;
}

type Pt = [number, number];

/** A tapering band along a smooth curve (paths, roads, streams). */
export function trail(points: Pt[], w0: number, w1: number, samples = 48): string {
  const at = (t: number): Pt => {
    const n = points.length - 1;
    const i = Math.min(n - 1, Math.floor(t * n));
    const u = t * n - i;
    const p0 = points[Math.max(0, i - 1)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[Math.min(n, i + 2)]!;
    const cr = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
  };
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let s = 0; s <= samples; s++) {
    const t = s / samples;
    const [x, y] = at(t);
    const [x2, y2] = at(Math.min(1, t + 0.01));
    const [x1, y1] = at(Math.max(0, t - 0.01));
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = -(y2 - y1) / len;
    const ny = (x2 - x1) / len;
    const w = (w0 + (w1 - w0) * t) / 2;
    left.push([x + nx * w, y + ny * w]);
    right.push([x - nx * w, y - ny * w]);
  }
  const pts = [...left, ...right.reverse()];
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
}
