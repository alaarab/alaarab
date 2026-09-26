/**
 * Ink primitives for the Ink Wash direction: a seeded brush-stroke generator,
 * mountain ridges, wash blobs, the shared SVG filters, the paper and the seal.
 * Everything is deterministic so server and client renders match.
 */
import { useEffect, type CSSProperties } from "react";

export type Pt = [number, number];

export const INK = {
  paper: "#f3efe6",
  mist: "#f6f2ea",
  dense: "#2b2620",
  text: "#3b352e",
  quiet: "#6a6257",
  seal: "#b8412c",
};

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&display=swap";

/** mulberry32: small seeded PRNG. */
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

const r1 = (n: number) => Math.round(n * 10) / 10;
const pathOf = (pts: Pt[], close = true) =>
  "M" + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L") + (close ? "Z" : "");

/** Catmull-Rom samples through the given points (open curve). */
function spline(pts: Pt[], n: number): Pt[] {
  const segs = pts.length - 1;
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * segs;
    const k = Math.min(Math.floor(u), segs - 1);
    const t = u - k;
    const p0 = pts[Math.max(k - 1, 0)];
    const p1 = pts[k];
    const p2 = pts[k + 1];
    const p3 = pts[Math.min(k + 2, segs)];
    const c = (a: number, b: number, cc: number, d: number) =>
      0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t * t + (-a + 3 * b - 3 * cc + d) * t * t * t);
    out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
  }
  return out;
}

/** Catmull-Rom samples around a closed loop of points. */
function closedSpline(pts: Pt[], per: number): Pt[] {
  const n = pts.length;
  const out: Pt[] = [];
  for (let k = 0; k < n; k++) {
    const p0 = pts[(k - 1 + n) % n];
    const p1 = pts[k];
    const p2 = pts[(k + 1) % n];
    const p3 = pts[(k + 2) % n];
    for (let i = 0; i < per; i++) {
      const t = i / per;
      const c = (a: number, b: number, cc: number, d: number) =>
        0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t * t + (-a + 3 * b - 3 * cc + d) * t * t * t);
      out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}

export interface BrushOpts {
  seed?: number;
  /** Fraction of the stroke spent pressing down to full width. */
  head?: number;
  /** Width left at the very end, as a fraction of full width. */
  tail?: number;
  /** How much the width wavers along the stroke (0 to 1). */
  waver?: number;
}

/**
 * A tapered brush stroke through `pts` as a filled outline: a quick press at the
 * start, full body, then a lift that thins toward the end.
 */
export function brush(pts: Pt[], width: number, opts: BrushOpts = {}): string {
  const { seed = 1, head = 0.12, tail = 0.08, waver = 0.25 } = opts;
  const rand = rng(seed);
  const ph1 = rand() * 6.28;
  const ph2 = rand() * 6.28;
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const n = Math.max(8, Math.min(90, Math.round(len / 4)));
  const s = spline(pts, n);
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const press = t < head ? Math.sin((t / head) * (Math.PI / 2)) ** 0.8 : 1 - ((t - head) / (1 - head)) ** 2.4 * (1 - tail);
    const wob = 1 + waver * 0.5 * (Math.sin(t * 9 + ph1) * 0.6 + Math.sin(t * 23 + ph2) * 0.4);
    const hw = (width / 2) * Math.max(press, 0.04) * wob;
    const a = s[Math.max(i - 1, 0)];
    const b = s[Math.min(i + 1, n)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const d = Math.hypot(dx, dy) || 1;
    dx /= d;
    dy /= d;
    left.push([s[i][0] - dy * hw, s[i][1] + dx * hw]);
    right.push([s[i][0] + dy * hw, s[i][1] - dx * hw]);
  }
  return pathOf([...left, ...right.reverse()]);
}

/** An irregular, softly flattened blob (a stone, a tuft, a body of wash). */
export function blob(cx: number, cy: number, rx: number, ry: number, seed = 1, jitter = 0.12, flatTop = 0): string {
  const rand = rng(seed);
  const n = 11;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand() * 0.2;
    const k = 1 + (rand() - 0.5) * 2 * jitter;
    let y = cy + Math.sin(a) * ry * k;
    if (flatTop && y < cy) y = cy - (cy - y) * (1 - flatTop);
    pts.push([cx + Math.cos(a) * rx * k, y]);
  }
  return pathOf(closedSpline(pts, 5));
}

export interface Peak {
  x: number;
  h: number;
  w: number;
}

/** Ridge line for a mountain range built from pointed bumps plus a little noise. */
export function ridge(peaks: Peak[], x0: number, x1: number, base: number, seed: number, rough = 10): Pt[] {
  const rand = rng(seed);
  const waves = Array.from({ length: 4 }, (_, i) => ({ f: 0.012 * (i + 1) ** 1.7, p: rand() * 6.28, a: rough / (i + 1) }));
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += 6) {
    let h = 0;
    for (const pk of peaks) {
      const u = Math.abs(x - pk.x) / pk.w;
      if (u < 1) h = Math.max(h, pk.h * (1 - u * u) ** 1.6);
    }
    const noise = waves.reduce((acc, w) => acc + w.a * Math.sin(x * w.f + w.p), 0);
    pts.push([x, base - h - noise * Math.min(1, h / 60 + 0.2)]);
  }
  return pts;
}

export const ridgeArea = (line: Pt[], bottom: number) =>
  pathOf([...line, [line[line.length - 1][0], bottom], [line[0][0], bottom]]);

/** Break a ridge into brushed contour strokes with small gaps. */
export function ridgeStrokes(line: Pt[], seed: number, width: number): string[] {
  const rand = rng(seed);
  const out: string[] = [];
  let i = 0;
  while (i < line.length - 3) {
    const len = 8 + Math.floor(rand() * 16);
    const seg = line.slice(i, Math.min(i + len, line.length));
    if (seg.length > 2) out.push(brush(seg.filter((_, k) => k % 2 === 0 || k === seg.length - 1), width * (0.5 + rand() * 0.8), { seed: seed + i, head: 0.2, tail: 0.15 }));
    i += len + 1 + Math.floor(rand() * 3);
  }
  return out;
}

/** Short texture strokes running down a slope from points on the ridge. */
export function slopeStrokes(line: Pt[], seed: number, count: number, reach: number, minHeight: number, base: number): string[] {
  const rand = rng(seed);
  const out: string[] = [];
  const tall = line.filter(([, y]) => base - y > minHeight);
  for (let k = 0; k < count && tall.length > 4; k++) {
    const idx = 2 + Math.floor(rand() * (tall.length - 4));
    const [x, y] = tall[idx];
    const slope = (tall[idx + 2][1] - tall[idx - 2][1]) / (tall[idx + 2][0] - tall[idx - 2][0]);
    const dir = slope > 0 ? 1 : -1;
    const drop = 3 + rand() * 12;
    const l = reach * (0.4 + rand() * 0.6);
    out.push(
      brush(
        [
          [x + dir * 2, y + drop],
          [x + dir * l * 0.18, y + drop + l * 0.5],
          [x + dir * l * 0.22 + (rand() - 0.5) * 8, y + drop + l],
        ],
        0.9 + rand() * 1.4,
        { seed: seed * 7 + k, head: 0.1, tail: 0.02 },
      ),
    );
  }
  return out;
}

/*
 * The signature moment: the ink spreads out from the peak into the paper, once.
 * Kept out of the CSS module because Bun renames module @keyframes without
 * rewriting the name inside the `animation` shorthand, so it would never run.
 */
const BLOOM_CSS = `
@property --iw-bloom { syntax: "<percentage>"; inherits: false; initial-value: 135%; }
@keyframes iw-bloom { from { --iw-bloom: 0%; opacity: 0.3; } to { --iw-bloom: 135%; opacity: 1; } }
[data-iw-bloom] {
  -webkit-mask-image: radial-gradient(ellipse at 65% 30%, #000 calc(var(--iw-bloom) - 30%), transparent var(--iw-bloom));
  mask-image: radial-gradient(ellipse at 65% 30%, #000 calc(var(--iw-bloom) - 30%), transparent var(--iw-bloom));
  animation: iw-bloom 1.6s cubic-bezier(0.22, 0.6, 0.3, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  [data-iw-bloom] { animation: none; -webkit-mask-image: none; mask-image: none; }
}`;

/** Filters shared by every painting on a page (referenced as url(#iw-*)), plus the bloom style. */
export function InkDefs() {
  return (
    <>
      <style href="inkwash-bloom" precedence="default">
        {BLOOM_CSS}
      </style>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          {/* Wet edge for broad shapes: turbulence pushes the outline, then a small blur softens it. */}
          <filter id="iw-bleed" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="0.9" />
          </filter>
          {/* Same idea for thin strokes, with a tall region so the displacement has room. */}
          <filter id="iw-line" x="-20%" y="-150%" width="140%" height="400%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="0.35" />
          </filter>
          {/* Dry brush: speckled breaks where the brush ran low on ink. */}
          <filter id="iw-dry" x="-20%" y="-80%" width="140%" height="260%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed="2" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.95" result="speck" />
            <feComposite in="SourceGraphic" in2="speck" operator="in" result="c" />
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="n" />
            <feDisplacementMap in="c" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Soft wash: a far range or a pool of diluted ink. */}
          <filter id="iw-wash" x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="3" />
          </filter>
          {/* Pooled ink hugging the inside of a ridge. */}
          <filter id="iw-pool" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          {/* Night cloud: a thin wash with a torn, very soft edge. */}
          <filter id="iw-cloud" x="-20%" y="-150%" width="140%" height="400%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves="3" seed="13" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="16 9" />
          </filter>
          {/* Mist band. */}
          <filter id="iw-mist" x="-30%" y="-120%" width="160%" height="340%">
            <feGaussianBlur stdDeviation="22 14" />
          </filter>
          {/* The seal: uneven edge, speckled ink, letters cut out. */}
          <filter id="iw-seal" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="3" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4.4 0 0 0 -1.05" result="speck" />
            <feComposite in="d" in2="speck" operator="in" />
          </filter>
          <mask id="iw-seal-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
            <rect width="100" height="100" fill="#fff" />
            <g stroke="#000" strokeWidth="7.5" strokeLinejoin="miter" strokeLinecap="butt" fill="none">
              <path d="M18 83 L37 19 L56 83" />
              <path d="M44 83 L63 19 L82 83" />
              <path d="M26.5 54 H73.5" />
            </g>
          </mask>
        </defs>
      </svg>
    </>
  );
}

/** A vertical ink gradient: dense at the top edge of a shape, gone at its foot. */
export function Fade({ id, color, top, bottom, tone }: { id: string; color: string; top: number; bottom: number; tone: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={top} x2="0" y2={bottom}>
      <stop offset="0" stopColor={color} stopOpacity={tone} />
      <stop offset="0.3" stopColor={color} stopOpacity={tone * 0.55} />
      <stop offset="0.7" stopColor={color} stopOpacity={tone * 0.14} />
      <stop offset="1" stopColor={color} stopOpacity={0} />
    </linearGradient>
  );
}

export interface MountainProps {
  id: string;
  peaks: Peak[];
  x0: number;
  x1: number;
  base: number;
  /** Where the wash has fully faded into mist. */
  foot: number;
  seed: number;
  tone: number;
  color: string;
  far?: boolean;
  texture?: number;
}

/** One layer of a range: graded wash body, brushed ridge, a few slope strokes. */
export function Mountain({ id, peaks, x0, x1, base, foot, seed, tone, color, far, texture = 0 }: MountainProps) {
  const line = ridge(peaks, x0, x1, base, seed, far ? 6 : 12);
  const top = Math.min(...line.map(([, y]) => y));
  const area = ridgeArea(line, foot + 20);
  return (
    <g>
      <defs>
        <Fade id={id} color={color} top={top} bottom={foot} tone={tone} />
        {!far && (
          <clipPath id={`${id}-c`}>
            <path d={area} />
          </clipPath>
        )}
      </defs>
      <path d={area} fill={`url(#${id})`} filter={far ? "url(#iw-wash)" : "url(#iw-bleed)"} />
      {!far && (
        <g clipPath={`url(#${id}-c)`}>
          <path d={pathOf(line, false)} fill="none" stroke={`url(#${id})`} strokeWidth={46} opacity={0.85} filter="url(#iw-pool)" />
        </g>
      )}
      {!far && (
        <g fill={color} opacity={tone * 0.7} filter="url(#iw-line)">
          {ridgeStrokes(line.filter(([, y]) => base - y > 30), seed + 3, 3.4).map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
      {texture > 0 && (
        <g fill={color} opacity={tone * 0.4} filter="url(#iw-dry)">
          {slopeStrokes(line, seed + 5, texture, 120, 90, base).map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
    </g>
  );
}

/** Soft white-ish bands of mist laid across a painting. */
export function Mist({ bands, color = "var(--mist)" }: { bands: [number, number, number, number, number?][]; color?: string }) {
  return (
    <g style={{ fill: color }} filter="url(#iw-mist)">
      {bands.map(([cx, cy, rx, ry, o = 0.9], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} opacity={o} />
      ))}
    </g>
  );
}

/** Rice paper: fine grain, a slow mottle, and a few long faint fibers. */
function paperImage(): string {
  const grain = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.36  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.09 0'/></filter><rect width='220' height='220' filter='url(#g)'/></svg>`;
  const rand = rng(31);
  let fibers = "";
  for (let i = 0; i < 6; i++) {
    const x = rand() * 1100;
    const y = rand() * 1100;
    const a = rand() * Math.PI;
    const l = 90 + rand() * 200;
    const bx = x + Math.cos(a) * l;
    const by = y + Math.sin(a) * l;
    const cx = (x + bx) / 2 + (rand() - 0.5) * 120;
    const cy = (y + by) / 2 + (rand() - 0.5) * 120;
    fibers += `<path d='M${r1(x)} ${r1(y)}Q${r1(cx)} ${r1(cy)} ${r1(bx)} ${r1(by)}' stroke='%23857761' stroke-opacity='${(0.03 + rand() * 0.03).toFixed(2)}' stroke-width='${(0.5 + rand() * 0.6).toFixed(2)}' fill='none'/>`;
  }
  const mottle = `<svg xmlns='http://www.w3.org/2000/svg' width='1100' height='1100'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.004' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.26  0 0 0 0.045 -0.01'/></filter><rect width='1100' height='1100' filter='url(#m)'/>${fibers}</svg>`;
  const enc = (s: string) => `url("data:image/svg+xml,${s.replace(/</g, "%3C").replace(/>/g, "%3E").replace(/#/g, "%23").replace(/"/g, "'")}")`;
  return `${enc(grain)}, ${enc(mottle)}`;
}

export const paperStyle: CSSProperties = { backgroundImage: paperImage() };

/** Keep the rubber-band overscroll the paper's color instead of the site's dark body. */
export function usePaperOverscroll(color: string) {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.background;
    html.style.background = color;
    return () => {
      html.style.background = prev;
    };
  }, [color]);
}

/**
 * The seal: a small vermilion square with a carved Latin "AA" monogram. The
 * letters are cut out of the ink (a mask), and the edges and fill are uneven.
 */
export function Seal({ size = 40, className, label }: { size?: number; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <g filter="url(#iw-seal)">
        <path d="M7 8 L93 6 L94.5 93 L6 94.5 Z" fill={INK.seal} mask="url(#iw-seal-cut)" />
      </g>
    </svg>
  );
}
