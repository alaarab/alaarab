/**
 * A seeded, deterministic plant grower. The same seed and data always grow the
 * same plant, so a project's specimen never changes between visits.
 *
 * Data maps to form gently: age (from startYear) sets height and stem weight,
 * each stack item is one leaf, each metric one flower. Everything else (lean,
 * sway, leaf angles, petal counts) comes from the seed.
 */

export type Pt = [number, number];
export type LeafForm = "lanceolate" | "ovate" | "elliptic" | "obovate" | "linear";
export type Terminal = "open" | "capsule" | "nocturne";

/** A watercolor layer: filled or stroked, drawn at low opacity. */
export interface Wash {
  d: string;
  fill?: string;
  stroke?: string;
  sw?: number;
  o: number;
  delay: number;
}

/** An ink line: drawn by the reveal, in order of `delay`. */
export interface Ink {
  d: string;
  w: number;
  o: number;
  delay: number;
  dur: number;
}

export interface Anchor {
  x: number;
  y: number;
  side: -1 | 1;
}

export interface PlantModel {
  washes: Wash[];
  inks: Ink[];
  leafAnchors: Anchor[];
  flowerAnchors: Anchor[];
  rootAnchors: Anchor[];
  /** Highest point the plant reaches, for cropping empty paper above it. */
  top: number;
}

export interface GrowOpts {
  seed: string;
  age: number;
  leaves: number;
  flowers: number;
  baseX: number;
  baseY: number;
  /** Tallest the stem may grow, in user units. */
  height: number;
  /** Furthest any leaf or flower may reach from baseX. */
  halfWidth: number;
  leafColor: string;
  flowerColor: string;
  form: LeafForm;
  terminal?: Terminal;
  /** Leaf margin as a waveform: 0 sine, 1 triangle, 2 saw, blended between. */
  wave?: number;
  /** Grow a root system below baseY, reaching this far down. */
  roots?: number;
  /** Rotation of the capsule crown's mark, radians. */
  capsuleAngle?: number;
  sprig?: boolean;
}

// ---------------------------------------------------------------- randomness

export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed: string) {
  let a = hash(seed);
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (lo: number, hi: number) => lo + (hi - lo) * next(),
    int: (lo: number, hi: number) => Math.floor(lo + (hi - lo + 1) * next()),
  };
}

// ---------------------------------------------------------------- color

export function hexToHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return [h, s * 100, l * 100];
}

/** An accent softened into a watercolor tint: less saturated, a little lighter. */
export function washOf(hex: string, light = 52): string {
  const [h, s] = hexToHsl(hex);
  const sat = Math.min(44, Math.max(20, s * 0.42));
  return `hsl(${h.toFixed(0)} ${sat.toFixed(0)}% ${light}%)`;
}

export function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p: number, sh: number) => (p >> sh) & 255;
  const out = [16, 8, 0].map((sh) => Math.round(ch(pa, sh) * (1 - t) + ch(pb, sh) * t));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// ---------------------------------------------------------------- geometry

const f = (n: number) => n.toFixed(1);

/** Catmull-Rom through the points, as cubic Beziers. */
export function smooth(pts: Pt[], closed = false): string {
  if (pts.length < 2) return "";
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${f(p[1][0])} ${f(p[1][1])}`;
  const end = closed ? p.length - 2 : p.length - 2;
  for (let i = 1; i < end; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

const polyline = (pts: Pt[], closed = false) =>
  pts.map((q, i) => `${i ? "L" : "M"}${f(q[0])} ${f(q[1])}`).join("") + (closed ? "Z" : "");

const norm = (x: number, y: number): Pt => {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};

/** Waveform in [-1, 1] at phase x (period 1). */
function waveAt(x: number, kind: number): number {
  const fr = x - Math.floor(x);
  const sine = Math.sin(fr * Math.PI * 2);
  const tri = 1 - 4 * Math.abs(((fr + 0.25) % 1) - 0.5);
  const saw = 1 - 2 * fr;
  if (kind <= 1) return sine * (1 - kind) + tri * kind;
  const k = Math.min(1, kind - 1);
  return tri * (1 - k) + saw * k;
}

const FORMS: Record<LeafForm, { a: number; b: number; w: number }> = {
  lanceolate: { a: 0.7, b: 1.25, w: 0.24 },
  ovate: { a: 0.55, b: 1.0, w: 0.4 },
  elliptic: { a: 0.9, b: 0.95, w: 0.32 },
  obovate: { a: 1.35, b: 0.7, w: 0.36 },
  linear: { a: 0.35, b: 0.55, w: 0.11 },
};

interface LeafShape {
  outline: Pt[];
  upper: Pt[];
  lower: Pt[];
  mid: Pt[];
  veins: Pt[][];
}

/**
 * A blade from `start` along angle `ang` (radians from +x), drooping under
 * gravity by `droop`. `margin` modulates the half-width along its length.
 */
function blade(
  start: Pt,
  ang: number,
  len: number,
  widthRatio: number,
  a: number,
  b: number,
  droop: number,
  margin?: (u: number) => number,
  samples = 34,
): LeafShape {
  const ax = Math.cos(ang);
  const ay = Math.sin(ang);
  const peak = a / (a + b);
  const pk = Math.pow(peak, a) * Math.pow(1 - peak, b);
  const midAt = (u: number): Pt => [start[0] + ax * len * u, start[1] + ay * len * u + droop * len * u * u];
  const mid: Pt[] = [];
  const upper: Pt[] = [];
  const lower: Pt[] = [];
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const m = midAt(u);
    const m2 = midAt(Math.min(1, u + 0.01));
    const m1 = midAt(Math.max(0, u - 0.01));
    const [tx, ty] = norm(m2[0] - m1[0], m2[1] - m1[1]);
    const nx = -ty;
    const ny = tx;
    let hw = ((Math.pow(u, a) * Math.pow(1 - u, b)) / pk) * len * widthRatio * 0.5;
    if (margin) hw *= margin(u);
    mid.push(m);
    upper.push([m[0] + nx * hw * 1.05, m[1] + ny * hw * 1.05]);
    lower.push([m[0] - nx * hw * 0.95, m[1] - ny * hw * 0.95]);
  }
  const veins: Pt[][] = [];
  const nv = Math.max(3, Math.round(widthRatio * 18));
  for (let k = 1; k <= nv; k++) {
    const u = 0.1 + (k / (nv + 1)) * 0.78;
    const i0 = Math.round(u * samples);
    const i1 = Math.min(samples, Math.round((u + 0.12) * samples));
    for (const edge of [upper, lower]) {
      const m = mid[i0];
      const e = edge[i1];
      const tip: Pt = [m[0] + (e[0] - m[0]) * 0.82, m[1] + (e[1] - m[1]) * 0.82];
      const ctrl: Pt = [m[0] + (e[0] - m[0]) * 0.35 + (mid[i1][0] - m[0]) * 0.1, m[1] + (e[1] - m[1]) * 0.25];
      veins.push([m, ctrl, tip]);
    }
  }
  return { outline: [...upper, ...lower.slice(1, -1).reverse()], upper, lower, mid, veins };
}

// ---------------------------------------------------------------- grower

export function grow(o: GrowOpts): PlantModel {
  const r = rng(o.seed);
  const washes: Wash[] = [];
  const inks: Ink[] = [];
  const leafAnchors: Anchor[] = [];
  const flowerAnchors: Anchor[] = [];
  const rootAnchors: Anchor[] = [];
  const sprig = !!o.sprig;
  const [lh, ls, ll] = hslParts(o.leafColor);

  // Height: older projects stand taller, fuller ones a little taller too.
  const ageN = Math.min(1, o.age / 12);
  const H = o.height * (0.62 + 0.24 * ageN + 0.1 * Math.min(1, o.leaves / 6) + r.range(-0.03, 0.04));
  const stemW = (sprig ? 1.4 : 3.2) + (sprig ? 0 : ageN * 2.2);

  // ---- stem
  const N = 30;
  const lean = r.range(-0.13, 0.13) * H;
  const swayA = r.range(0.018, 0.04) * H;
  const swayF = r.range(1.1, 2.1);
  const phase = r.range(0, Math.PI * 2);
  const spine: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    spine.push([o.baseX + lean * t * t + swayA * Math.sin(t * swayF * Math.PI + phase) * t, o.baseY - t * H]);
  }
  const at = (t: number): { p: Pt; tan: Pt } => {
    const x = Math.min(N - 1e-6, Math.max(0, t * N));
    const i = Math.floor(x);
    const k = x - i;
    const a = spine[i];
    const b = spine[i + 1];
    return { p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], tan: norm(b[0] - a[0], b[1] - a[1]) };
  };
  const left: Pt[] = [];
  const right: Pt[] = [];
  spine.forEach((_, i) => {
    const t = i / N;
    const { p, tan } = at(t);
    const w = (stemW * (1 - 0.68 * t)) / 2;
    left.push([p[0] - tan[1] * w, p[1] + tan[0] * w]);
    right.push([p[0] + tan[1] * w, p[1] - tan[0] * w]);
  });
  washes.push({ d: smooth([...left, ...right.slice().reverse()], true), fill: o.leafColor, o: 0.5, delay: 0.2 });
  inks.push({ d: smooth(left), w: sprig ? 0.6 : 0.95, o: 0.9, delay: 0, dur: 1.4 });
  if (!sprig) inks.push({ d: smooth(right), w: 0.7, o: 0.7, delay: 0.1, dur: 1.4 });

  // ---- roots (phren): a system larger than the plant above it
  if (o.roots) growRoots(o, r, inks, washes, rootAnchors);

  // ---- leaves: one per stack item
  const form = FORMS[o.form];
  const top = o.flowers > 0 ? 0.74 : 0.86;
  let side: -1 | 1 = r.next() < 0.5 ? -1 : 1;
  const margin =
    o.wave === undefined
      ? undefined
      : (u: number) => 1 + 0.27 * waveAt(u * 7.5, o.wave!) * Math.min(1, u * 5) * Math.min(1, (1 - u) * 4);
  for (let i = 0; i < o.leaves; i++) {
    const t = 0.13 + ((top - 0.13) * (i + 0.5)) / o.leaves + r.range(-0.025, 0.025);
    const { p } = at(t);
    const spread = r.range(34, 58) + (1 - t) * 20;
    const ang = -Math.PI / 2 + side * (spread * Math.PI) / 180;
    let len = H * (sprig ? 0.34 : 0.36) * (1 - 0.4 * t) * r.range(0.86, 1.1);
    const reach = o.halfWidth - Math.abs(p[0] - o.baseX) * (Math.sign(p[0] - o.baseX) === side ? 1 : -1);
    len = Math.max(H * 0.1, Math.min(len, (reach * 0.94) / Math.max(0.35, Math.abs(Math.cos(ang))) / 1.08));
    const petiole = len * 0.1;
    const s0: Pt = [p[0] + Math.cos(ang) * petiole, p[1] + Math.sin(ang) * petiole];
    const droop = r.range(0.08, 0.22) * (1 - t * 0.4);
    const leaf = blade(s0, ang, len, form.w * r.range(0.9, 1.1), form.a, form.b, droop, margin, o.wave !== undefined ? 90 : 34);
    const delay = 0.8 + t * 0.9 + i * 0.12;
    const hue = `hsl(${(lh + r.range(-9, 9)).toFixed(0)} ${ls}% ${(ll + r.range(-4, 4)).toFixed(0)}%)`;
    const draw = o.wave !== undefined ? polyline : smooth;
    washes.push({ d: draw(leaf.outline, true), fill: hue, o: sprig ? 0.55 : 0.34, delay });
    if (!sprig) {
      // The shaded half, a cooler wash laid over one side of the midrib.
      washes.push({ d: draw([...leaf.lower, ...leaf.mid.slice().reverse()], true), fill: "#3f4f7a", o: 0.11, delay: delay + 0.2 });
    }
    inks.push({ d: polyline([p, s0]), w: 0.7, o: 0.85, delay: delay - 0.1, dur: 0.3 });
    inks.push({ d: draw(leaf.outline, true), w: sprig ? 0.45 : 0.75, o: 0.88, delay, dur: 1.1 });
    if (!sprig) {
      inks.push({ d: smooth(leaf.mid), w: 0.55, o: 0.7, delay: delay + 0.3, dur: 0.8 });
      for (const v of leaf.veins) inks.push({ d: smooth(v), w: 0.4, o: 0.45, delay: delay + 0.6, dur: 0.5 });
    }
    const a = leaf.mid[Math.round(leaf.mid.length * 0.62)];
    leafAnchors.push({ x: a[0], y: a[1], side });
    side = side === 1 ? -1 : 1;
  }

  // ---- flowers: one per metric, the first one terminal
  const tip = at(1);
  const fr = Math.max(sprig ? 4 : 15, Math.min(sprig ? 7 : 40, H * 0.088));
  const tipAng = Math.atan2(tip.tan[1], tip.tan[0]);
  const terminal = o.terminal ?? "open";
  if (o.flowers === 0) {
    bud(tip.p, tipAng, fr * 0.9, o, washes, inks, 2.2, sprig);
  } else if (terminal === "capsule") {
    capsule(tip.p, fr * 1.05, o, washes, inks, 2.2, sprig);
    flowerAnchors.push({ x: tip.p[0], y: tip.p[1] - fr * 0.6, side: tip.p[0] < o.baseX ? -1 : 1 });
  } else {
    openFlower(tip.p, fr * (terminal === "nocturne" ? 1.35 : 1), r, o, washes, inks, 2.2, sprig);
    flowerAnchors.push({ x: tip.p[0], y: tip.p[1], side: tip.p[0] < o.baseX ? -1 : 1 });
  }
  let fside: -1 | 1 = r.next() < 0.5 ? -1 : 1;
  for (let j = 1; j < o.flowers; j++) {
    const t = 0.8 + ((0.95 - 0.8) * (j - 1)) / Math.max(1, o.flowers - 2) + r.range(-0.02, 0.02);
    const { p } = at(t);
    const ang = -Math.PI / 2 + fside * r.range(0.5, 0.85);
    const plen = Math.min(H * r.range(0.13, 0.18), o.halfWidth * 0.62);
    const end: Pt = [p[0] + Math.cos(ang) * plen, p[1] + Math.sin(ang) * plen];
    const ctrl: Pt = [p[0] + Math.cos(ang) * plen * 0.6, p[1] + Math.sin(ang) * plen * 0.1];
    const ped = `M${f(p[0])} ${f(p[1])}Q${f(ctrl[0])} ${f(ctrl[1])} ${f(end[0])} ${f(end[1])}`;
    const delay = 2.0 + j * 0.25;
    washes.push({ d: ped, stroke: o.leafColor, sw: sprig ? 1 : 2.6, o: 0.45, delay });
    inks.push({ d: ped, w: sprig ? 0.5 : 0.8, o: 0.85, delay: delay - 0.3, dur: 0.6 });
    const endAng = Math.atan2(end[1] - ctrl[1], end[0] - ctrl[0]);
    if (terminal === "nocturne") bud(end, endAng, fr * 0.7, o, washes, inks, delay + 0.3, sprig);
    else cupFlower(end, endAng, fr * 0.78, r, o, washes, inks, delay + 0.3, sprig);
    flowerAnchors.push({ x: end[0], y: end[1], side: fside });
    fside = fside === 1 ? -1 : 1;
  }

  return { washes, inks, leafAnchors, flowerAnchors, rootAnchors, top: tip.p[1] - fr * 2.2 };
}

function hslParts(c: string): [number, number, number] {
  const m = c.match(/hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [84, 26, 40];
}

function openFlower(
  c: Pt,
  rad: number,
  r: ReturnType<typeof rng>,
  o: GrowOpts,
  washes: Wash[],
  inks: Ink[],
  delay: number,
  sprig: boolean,
) {
  const n = r.int(5, 7);
  const rot = r.range(0, Math.PI);
  const tilt = r.range(0.55, 0.7);
  const petals: { pts: Pt[]; depth: number }[] = [];
  for (let j = 0; j < n; j++) {
    const phi = rot + (j * Math.PI * 2) / n;
    const pb = blade([0, 0], phi, rad * r.range(0.9, 1.08), 0.62, 1.25, 0.4, 0, undefined, 20);
    const pts = pb.outline.map(([x, y]) => [c[0] + x, c[1] + y * tilt] as Pt);
    petals.push({ pts, depth: Math.sin(phi) });
  }
  petals.sort((a, b) => a.depth - b.depth);
  petals.forEach((p, j) => {
    washes.push({ d: smooth(p.pts, true), fill: o.flowerColor, o: sprig ? 0.6 : 0.3, delay: delay + j * 0.05 });
    inks.push({ d: smooth(p.pts, true), w: sprig ? 0.4 : 0.7, o: 0.85, delay: delay + j * 0.08, dur: 0.7 });
  });
  if (sprig) return;
  washes.push({ d: circle(c, rad * 0.32, tilt), fill: o.flowerColor, o: 0.3, delay: delay + 0.5 });
  washes.push({ d: circle(c, rad * 0.14, tilt), fill: "#c49a4a", o: 0.7, delay: delay + 0.6 });
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2 + rot;
    const len = rad * r.range(0.22, 0.34);
    const e: Pt = [c[0] + Math.cos(a) * len, c[1] + Math.sin(a) * len * tilt];
    inks.push({ d: polyline([c, e]), w: 0.45, o: 0.7, delay: delay + 0.7, dur: 0.3 });
    inks.push({ d: circle(e, 1.1, 1), w: 0.6, o: 0.8, delay: delay + 0.9, dur: 0.2 });
  }
}

function cupFlower(
  c: Pt,
  ang: number,
  rad: number,
  r: ReturnType<typeof rng>,
  o: GrowOpts,
  washes: Wash[],
  inks: Ink[],
  delay: number,
  sprig: boolean,
) {
  const spreads = [-0.5, 0.5, 0];
  spreads.forEach((s, j) => {
    const pb = blade(c, ang + s * r.range(0.85, 1.1), rad, 0.58, 1.2, 0.45, -0.05, undefined, 18);
    washes.push({ d: smooth(pb.outline, true), fill: o.flowerColor, o: sprig ? 0.6 : 0.3, delay: delay + j * 0.06 });
    inks.push({ d: smooth(pb.outline, true), w: sprig ? 0.4 : 0.7, o: 0.85, delay: delay + j * 0.1, dur: 0.6 });
  });
  if (sprig) return;
  for (const s of [-1, 1]) {
    const sp = blade(c, ang + s * 1.1, rad * 0.35, 0.4, 0.8, 0.8, 0.1, undefined, 10);
    washes.push({ d: smooth(sp.outline, true), fill: o.leafColor, o: 0.45, delay: delay + 0.3 });
    inks.push({ d: smooth(sp.outline, true), w: 0.55, o: 0.8, delay: delay + 0.3, dur: 0.3 });
  }
}

function bud(c: Pt, ang: number, rad: number, o: GrowOpts, washes: Wash[], inks: Ink[], delay: number, sprig: boolean) {
  const b = blade(c, ang, rad, 0.5, 0.9, 0.45, 0, undefined, 18);
  washes.push({ d: smooth(b.outline, true), fill: o.flowerColor, o: sprig ? 0.6 : 0.34, delay });
  inks.push({ d: smooth(b.outline, true), w: sprig ? 0.4 : 0.7, o: 0.85, delay, dur: 0.6 });
  if (sprig) return;
  for (const s of [-1, 1]) {
    const sp = blade(c, ang + s * 0.32, rad * 0.55, 0.36, 0.8, 0.9, 0, undefined, 10);
    washes.push({ d: smooth(sp.outline, true), fill: o.leafColor, o: 0.5, delay: delay + 0.2 });
    inks.push({ d: smooth(sp.outline, true), w: 0.55, o: 0.85, delay: delay + 0.2, dur: 0.3 });
  }
}

/** A poppy-like seed capsule, drawn so its crown reads as a knob. */
function capsule(c: Pt, rad: number, o: GrowOpts, washes: Wash[], inks: Ink[], delay: number, sprig: boolean) {
  const cx = c[0];
  const base = c[1];
  const h = rad * 1.5;
  const w = rad * 0.78;
  const body: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI;
    body.push([cx + Math.cos(a) * w, base - h * 0.5 - Math.sin(a) * h * 0.5]);
  }
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    body.push([cx + Math.cos(a) * w, base - h * 0.5 - Math.sin(a) * h * 0.5 * 0.75]);
  }
  const d = smooth(body, true);
  washes.push({ d, fill: "#c49a4a", o: sprig ? 0.6 : 0.32, delay });
  washes.push({ d, fill: o.flowerColor, o: sprig ? 0 : 0.2, delay });
  inks.push({ d, w: sprig ? 0.4 : 0.8, o: 0.9, delay, dur: 0.8 });
  if (sprig) return;
  for (let k = -2; k <= 2; k++) {
    const x = cx + (k / 3) * w;
    const bow = (k / 3) * w * 0.25;
    inks.push({
      d: `M${f(x)} ${f(base - h * 0.14)}Q${f(x + bow)} ${f(base - h * 0.55)} ${f(x)} ${f(base - h * 0.9)}`,
      w: 0.45,
      o: 0.6,
      delay: delay + 0.3,
      dur: 0.5,
    });
  }
  // The crown: a flattened disc with radiating ridges and one mark.
  const cy = base - h;
  const cr = w * 0.75;
  washes.push({ d: circle([cx, cy], cr, 0.4), fill: "#6a5843", o: 0.22, delay: delay + 0.4 });
  inks.push({ d: circle([cx, cy], cr, 0.4), w: 0.8, o: 0.9, delay: delay + 0.4, dur: 0.5 });
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    const e: Pt = [cx + Math.cos(a) * cr * 0.92, cy + Math.sin(a) * cr * 0.92 * 0.4];
    inks.push({ d: polyline([[cx, cy], e]), w: 0.4, o: 0.55, delay: delay + 0.6, dur: 0.3 });
  }
  const ma = o.capsuleAngle ?? -Math.PI / 2;
  const me: Pt = [cx + Math.cos(ma) * cr * 1.05, cy + Math.sin(ma) * cr * 1.05 * 0.4];
  washes.push({ d: `M${f(cx)} ${f(cy)}L${f(me[0])} ${f(me[1])}`, stroke: "#b56a6a", sw: 3.2, o: 0.75, delay: delay + 0.6 });
}

function circle(c: Pt, rad: number, sy: number): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    pts.push([c[0] + Math.cos(a) * rad, c[1] + Math.sin(a) * rad * sy]);
  }
  return smooth(pts, true);
}

function growRoots(o: GrowOpts, r: ReturnType<typeof rng>, inks: Ink[], washes: Wash[], anchors: Anchor[]) {
  const depthMax = o.roots!;
  const floor = o.baseY + depthMax;
  const lim = o.halfWidth * 1.35;
  const tips: { p: Pt; depth: number; side: -1 | 1 }[] = [];
  const grow1 = (start: Pt, ang: number, len: number, w: number, level: number, delay: number) => {
    const pts: Pt[] = [start];
    let a = ang;
    let p = start;
    const steps = 7;
    for (let i = 0; i < steps; i++) {
      a += r.range(-0.34, 0.34);
      a += (Math.PI / 2 - a) * 0.12; // gravitropism
      // Near the edge of the plate, roots turn back down and inward instead of stopping.
      const off = p[0] - o.baseX;
      if (Math.abs(off) > lim * 0.75) a += (Math.PI / 2 - a) * 0.45 + (off > 0 ? 0.12 : -0.12);
      const seg = (len / steps) * (p[1] > floor - 40 ? 0.35 : 1);
      p = [p[0] + Math.cos(a) * seg, p[1] + Math.sin(a) * seg];
      pts.push(p);
    }
    inks.push({ d: smooth(pts), w, o: Math.min(0.9, 0.45 + w * 0.3), delay, dur: 0.6 + len / 400 });
    if (level === 0) tips.push({ p, depth: p[1], side: p[0] < o.baseX ? -1 : 1 });
    if (level > 0) {
      const kids = level >= 2 ? r.int(2, 3) : r.int(1, 2);
      for (let k = 0; k < kids; k++) {
        const at = pts[r.int(2, steps - 1)];
        const na = a + (r.next() < 0.5 ? -1 : 1) * r.range(0.45, 1.0);
        grow1(at, na, len * r.range(0.5, 0.7), w * 0.62, level - 1, delay + 0.35);
      }
      if (level === 3) tips.push({ p, depth: p[1], side: p[0] < o.baseX ? -1 : 1 });
    } else {
      // Root hairs along the finest roots.
      for (let i = 2; i < pts.length; i += 2) {
        const q = pts[i];
        const ha = a + (i % 4 ? 1.2 : -1.2);
        inks.push({ d: polyline([q, [q[0] + Math.cos(ha) * 5, q[1] + Math.sin(ha) * 5]]), w: 0.3, o: 0.4, delay: delay + 0.4, dur: 0.2 });
      }
    }
  };
  const primaries = 5;
  for (let i = 0; i < primaries; i++) {
    const spread = -0.55 + (1.1 * i) / (primaries - 1);
    const ang = Math.PI / 2 + spread * 1.5 + r.range(-0.12, 0.12);
    const len = depthMax * r.range(0.55, 0.8) * (1 - Math.abs(spread) * 0.35);
    grow1([o.baseX + spread * 6, o.baseY + 2], ang, len, 1.7, 3, 0.4 + i * 0.1);
  }
  // Soil wash and a broken ink soil line.
  const soil: Pt[] = [];
  const x0 = o.baseX - lim - 30;
  const x1 = o.baseX + lim + 30;
  for (let i = 0; i <= 20; i++) soil.push([x0 + ((x1 - x0) * i) / 20, o.baseY + r.range(-2, 3)]);
  for (let g = 0; g < 4; g++) {
    const seg = soil.slice(g * 5, g * 5 + 5);
    inks.push({ d: smooth(seg), w: 0.7, o: 0.6, delay: 0.1, dur: 0.6 });
  }
  // Loose hatching under the soil line, thinning out with distance from the stem.
  for (let i = 0; i < 46; i++) {
    const x = x0 + 12 + r.next() * (x1 - x0 - 24);
    const fade = 1 - Math.abs(x - o.baseX) / (x1 - o.baseX);
    if (r.next() > fade + 0.2) continue;
    const y = o.baseY + 5 + r.next() * 16;
    const l = 5 + r.next() * 7;
    inks.push({ d: polyline([[x, y], [x - l * 0.8, y + l * 0.6]]), w: 0.45, o: 0.35 + fade * 0.2, delay: 0.2, dur: 0.2 });
  }
  // The three deepest primary tips carry the annotations.
  const primaryTips = tips.filter((_, i) => i % 1 === 0).sort((a, b) => b.depth - a.depth);
  const chosen: typeof primaryTips = [];
  for (const t of primaryTips) {
    if (chosen.every((c) => Math.hypot(c.p[0] - t.p[0], c.p[1] - t.p[1]) > 90)) chosen.push(t);
    if (chosen.length === 3) break;
  }
  chosen.forEach((t) => anchors.push({ x: t.p[0], y: t.p[1], side: t.side }));
}
