import { useId, useMemo, type ReactNode } from "react";
import { mix, ridgePath, rng, rolling, withKnolls, type Knoll, type Ridge } from "./paint";
import { skies, type Sky, type TimeKey } from "./sky";
import styles from "./hillside.module.css";

export const PAPER = "#f3ead6";

/** What a landmark painter gets to work with. */
export interface Ctx {
  sky: Sky;
  /** Filter/gradient id prefix, unique per scene. */
  p: string;
  /** Ground height at x on a layer: 0 far hills .. 3 near hill, 4 meadow. */
  ground: (layer: number, x: number) => number;
  /** 1 when the light comes from the right, -1 from the left. */
  dir: number;
  /** 0 in daylight, up to about 0.6 at night: how far to sink colours into shadow. */
  dim: number;
}

export type Paint = (c: Ctx) => ReactNode;

export interface Cloud {
  x: number;
  y: number;
  w: number;
}

export interface SceneSpec {
  time: TimeKey;
  seed: number;
  /** Rises on the near hill, where landmarks usually sit. */
  knolls?: Knoll[];
  /** Replace a layer's ridgeline (m4l-builder's waveforms). */
  ridge?: (layer: number) => Ridge | undefined;
  /** Painted after the given layer (0..3 hills, 4 meadow). */
  after?: Partial<Record<0 | 1 | 2 | 3 | 4, Paint>>;
  /** Scattered lit windows across the hills. */
  windows?: number;
  /** Tree clumps per middle layer. */
  trees?: number;
  clouds?: Cloud[];
  streaks?: Cloud[];
  label: string;
  /** Per-scene adjustments to the sky (e.g. where the moon sits). */
  skyTweak?: Partial<Sky>;
}

const BASE = [556, 618, 684, 756];
const AMP = [44, 36, 30, 20];
const SCALE = [1.15, 1, 0.9, 0.75];

const DEFAULT_CLOUDS: Cloud[] = [
  { x: 1090, y: 330, w: 470 },
  { x: 330, y: 520, w: 270 },
  { x: 730, y: 530, w: 140 },
];
const DEFAULT_STREAKS: Cloud[] = [
  { x: 240, y: 560, w: 420 },
  { x: 1010, y: 520, w: 320 },
];

interface SceneProps {
  spec: SceneSpec;
  /** Override the spec's sky (the home page eases this to the visitor's hour). */
  sky?: Sky;
  className?: string;
  viewBox?: string;
  /** Paint the watercolour edge into the paper at the bottom. */
  edge?: boolean;
  paper?: string;
  decorative?: boolean;
}

export function Scene({ spec, sky: skyOverride, className, viewBox, edge = true, paper = PAPER, decorative }: SceneProps) {
  const sky = skyOverride ?? { ...skies[spec.time], ...spec.skyTweak };
  const p = "hs" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const { seed } = spec;

  const ridges = useMemo(() => {
    const list: Ridge[] = [0, 1, 2, 3].map((l) => {
      const custom = spec.ridge?.(l);
      if (custom) return custom;
      const r = rolling(seed + l * 11, BASE[l]!, AMP[l]!, SCALE[l]!);
      return l === 3 ? withKnolls(r, spec.knolls ?? []) : r;
    });
    list.push(spec.ridge?.(4) ?? rolling(seed + 44, 842, 9, 0.8));
    return list;
  }, [spec, seed]);

  const ctx: Ctx = {
    sky,
    p,
    ground: (l, x) => ridges[l]!(x),
    dir: sky.sun.x >= 0.5 ? 1 : -1,
    dim: sky.windows * 0.6,
  };

  const stars = useMemo(() => {
    const r = rng(seed + 7);
    return Array.from({ length: 54 }, () => ({ x: r() * 1440, y: r() * 470, r: 0.6 + r() * 1.1, o: 0.35 + r() * 0.65 }));
  }, [seed]);

  const windows = useMemo(() => scatterWindows(spec.windows ?? 0, seed, ridges), [spec.windows, seed, ridges]);
  const clumps = useMemo(() => scatterTrees(spec.trees ?? 4, seed, ridges), [spec.trees, seed, ridges]);

  const { sun } = sky;
  const hazeY = BASE[0]! - 20;

  return (
    <svg
      className={`${styles.scene} ${className ?? ""}`}
      viewBox={viewBox ?? "0 0 1440 900"}
      preserveAspectRatio="xMidYMax slice"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : spec.label}
    >
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="0.42" stopColor={sky.mid} />
          <stop offset="0.66" stopColor={sky.horizon} />
          <stop offset="1" stopColor={sky.horizon} />
        </linearGradient>
        <radialGradient id={`${p}sun`}>
          <stop offset="0" stopColor={sky.light} stopOpacity={sun.glow} />
          <stop offset="0.35" stopColor={sky.light} stopOpacity={sun.glow * 0.35} />
          <stop offset="1" stopColor={sky.light} stopOpacity={0} />
        </radialGradient>
        {[0, 1, 2, 3].map((l) => (
          <linearGradient key={l} id={`${p}hill${l}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mix(sky.hills[l]!, sky.light, l === 0 ? 0.08 : 0.14)} />
            <stop offset="0.35" stopColor={sky.hills[l]} />
            <stop offset="1" stopColor={mix(sky.hills[l]!, sky.leafShade, 0.3)} />
          </linearGradient>
        ))}
        <filter id={`${p}paint`} x="-3%" y="-15%" width="106%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves={2} seed={seed % 97} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" result="s" />
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.04" numOctaves={3} seed={(seed + 1) % 97} result="w" />
          <feColorMatrix
            in="w"
            type="matrix"
            values="0 0 0 0 0.2  0 0 0 0 0.19  0 0 0 0 0.1  0.5 0 0 0 -0.2"
            result="m"
          />
          <feComposite in="m" in2="s" operator="atop" />
        </filter>
        <filter id={`${p}cloud`} x="-20%" y="-40%" width="140%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={3} seed={(seed + 3) % 97} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={11} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation={2.2} />
        </filter>
        <filter id={`${p}haze`} x="-10%" y="-60%" width="120%" height="220%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
        <filter id={`${p}glow`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <filter id={`${p}edge`} x="-2%" y="-40%" width="104%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves={3} seed={(seed + 5) % 97} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={12} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <rect width="1440" height="900" fill={`url(#${p}sky)`} />

      {sky.stars > 0 && (
        <g className={styles.fade} opacity={sky.stars}>
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff6dd" opacity={s.o} />
          ))}
        </g>
      )}

      {sun.r > 0 && (
        <g>
          <circle cx={sun.x * 1440} cy={sun.y * 900} r={sun.r * 8} fill={`url(#${p}sun)`} />
          {(sun.moon || sun.glow > 0.6) && (
            <circle cx={sun.x * 1440} cy={sun.y * 900} r={sun.r} fill={mix(sky.light, "#fffaf0", 0.55)} opacity={sun.moon ? 0.95 : 0.55} />
          )}
          {sun.moon && (
            <g fill={sky.cloudShade} opacity={0.1}>
              <ellipse cx={sun.x * 1440 - 9} cy={sun.y * 900 - 5} rx={10} ry={6} transform={`rotate(-20 ${sun.x * 1440} ${sun.y * 900})`} />
              <ellipse cx={sun.x * 1440 + 8} cy={sun.y * 900 + 9} rx={7} ry={4} />
            </g>
          )}
        </g>
      )}

      <g filter={`url(#${p}cloud)`}>
        {(spec.streaks ?? DEFAULT_STREAKS).map((c, i) => (
          <ellipse key={`s${i}`} cx={c.x} cy={c.y} rx={c.w / 2} ry={6 + (i % 2) * 3} fill={sky.cloudLit} opacity={0.55} />
        ))}
        {(spec.clouds ?? DEFAULT_CLOUDS).map((c, i) => (
          <Cumulus key={i} cloud={c} sky={sky} seed={seed + i * 31} dir={ctx.dir} p={`${p}c${i}`} />
        ))}
      </g>

      {[0, 1, 2, 3].map((l) => (
        <g key={l}>
          <path d={ridgePath(ridges[l]!, spec.ridge?.(l) ? 5 : 12)} fill={`url(#${p}hill${l})`} filter={`url(#${p}paint)`} />
          {l === 0 && (
            <rect x={-40} y={hazeY} width={1520} height={70} fill={sky.horizon} opacity={0.4} filter={`url(#${p}haze)`} />
          )}
          {(l === 1 || l === 2) && (
            <g filter={`url(#${p}paint)`}>
              {clumps
                .filter((t) => t.layer === l)
                .map((t, i) => (
                  <Clump key={i} x={t.x} y={t.y} s={t.s} sky={sky} layer={l} dir={ctx.dir} />
                ))}
            </g>
          )}
          <Windows list={windows.filter((w) => w.layer === l)} sky={sky} p={p} />
          {spec.after?.[l as 0 | 1 | 2 | 3]?.(ctx)}
        </g>
      ))}

      <path d={ridgePath(ridges[4]!, 10)} fill={sky.meadow} filter={`url(#${p}paint)`} />
      {spec.after?.[4]?.(ctx)}

      {edge && (
        <g filter={`url(#${p}edge)`}>
          <path d={edgeLine(seed)} fill="none" stroke={mix(sky.meadow, sky.leafShade, 0.6)} strokeWidth={4} opacity={0.4} />
          <path d={ridgePath(edgeRidge(seed), 10, 940)} fill={paper} />
        </g>
      )}
    </svg>
  );
}

const edgeRidge = (seed: number) => rolling(seed + 55, 878, 7, 1.6);

function edgeLine(seed: number) {
  const y = edgeRidge(seed);
  let d = `M-40 ${y(-40).toFixed(1)}`;
  for (let x = -30; x <= 1480; x += 10) d += ` L${x} ${y(x).toFixed(1)}`;
  return d;
}

function Cumulus({ cloud, sky, seed, dir, p }: { cloud: Cloud; sky: Sky; seed: number; dir: number; p: string }) {
  const { x, y, w } = cloud;
  const puffs = useMemo(() => {
    const r = rng(seed);
    const n = 11;
    const list: Array<{ x: number; y: number; r: number }> = [];
    for (let i = 1; i < n - 1; i++) {
      const t = i / (n - 1);
      const h = Math.pow(Math.sin(Math.PI * t), 0.7);
      list.push({
        x: x + (t - 0.5) * w * 0.78,
        y: y - h * w * 0.2 - r() * w * 0.04,
        r: w * (0.05 + 0.12 * h) * (0.8 + r() * 0.4),
      });
    }
    for (let j = 0; j < 4; j++) {
      list.push({ x: x + (r() - 0.5) * w * 0.42, y: y - w * (0.25 + r() * 0.1), r: w * (0.09 + r() * 0.06) });
    }
    return list;
  }, [x, y, w, seed]);
  const base = y + w * 0.03;
  return (
    <g>
      <clipPath id={`${p}clip`}>
        <rect x={x - w} y={y - w} width={w * 2} height={base - (y - w)} />
      </clipPath>
      <g clipPath={`url(#${p}clip)`}>
        {puffs.map((q, i) => (
          <circle key={i} cx={q.x} cy={q.y} r={q.r} fill={sky.cloudShade} />
        ))}
        {puffs.map((q, i) => (
          <circle key={`m${i}`} cx={q.x + dir * q.r * 0.06} cy={q.y - q.r * 0.14} r={q.r * 0.94} fill={mix(sky.cloudLit, sky.cloudShade, 0.35)} />
        ))}
        {puffs.map((q, i) => (
          <circle key={`l${i}`} cx={q.x + dir * q.r * 0.14} cy={q.y - q.r * 0.3} r={q.r * 0.8} fill={sky.cloudLit} />
        ))}
        {puffs.slice(-3).map((q, i) => (
          <circle
            key={`h${i}`}
            cx={q.x + dir * q.r * 0.26}
            cy={q.y - q.r * 0.42}
            r={q.r * 0.5}
            fill={mix(sky.cloudLit, "#fffdf6", 0.5)}
            opacity={0.5}
          />
        ))}
      </g>
    </g>
  );
}

interface Clumped {
  x: number;
  y: number;
  s: number;
  layer: number;
}

function scatterTrees(count: number, seed: number, ridges: Ridge[]): Clumped[] {
  const r = rng(seed + 19);
  const out: Clumped[] = [];
  for (const layer of [1, 2]) {
    for (let i = 0; i < count; i++) {
      const x = r() * 1500 - 30;
      out.push({ x, y: ridges[layer]!(x) + 4 + r() * 16 * layer, s: (layer === 1 ? 7 : 11) * (0.8 + r() * 0.5), layer });
    }
  }
  return out;
}

function Clump({ x, y, s, sky, layer, dir }: { x: number; y: number; s: number; sky: Sky; layer: number; dir: number }) {
  const shade = mix(sky.leafShade, sky.hills[layer]!, layer === 1 ? 0.45 : 0.2);
  const lit = mix(mix(sky.leaf, sky.hills[layer]!, layer === 1 ? 0.4 : 0.15), sky.light, 0.18);
  const blobs = [
    [-1.6, 0.2, 1],
    [-0.5, -0.5, 1.3],
    [0.8, -0.2, 1.15],
    [1.8, 0.3, 0.9],
    [0.2, 0.5, 1],
  ] as const;
  return (
    <g>
      {blobs.map(([bx, by, br], i) => (
        <circle key={i} cx={x + bx * s} cy={y + by * s} r={br * s} fill={shade} />
      ))}
      {blobs.map(([bx, by, br], i) => (
        <circle key={`l${i}`} cx={x + bx * s + dir * s * 0.25} cy={y + by * s - s * 0.3} r={br * s * 0.62} fill={lit} />
      ))}
    </g>
  );
}

interface Win {
  x: number;
  y: number;
  s: number;
  layer: number;
  house: boolean;
}

function scatterWindows(count: number, seed: number, ridges: Ridge[]): Win[] {
  if (!count) return [];
  const r = rng(seed + 23);
  const sizes = [2.2, 3.2, 4.6, 6.2];
  const out: Win[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 20) {
    const layer = [0, 1, 1, 2, 2, 2, 3][Math.floor(r() * 7)]!;
    const x = r() * 1440;
    const top = ridges[layer]!(x);
    const next = layer < 3 ? ridges[layer + 1]!(x) : ridges[4]!(x);
    const room = next - top;
    if (room < 14) continue;
    const y = top + 8 + r() * (room - 12) * 0.9;
    const s = sizes[layer]! * (0.8 + r() * 0.4);
    if (out.some((w) => w.layer === layer && Math.abs(w.x - x) < s * 4 && Math.abs(w.y - y) < s * 3)) continue;
    out.push({ x, y, s, layer, house: layer === 2 && r() > 0.6 });
  }
  return out;
}

function Windows({ list, sky, p }: { list: Win[]; sky: Sky; p: string }) {
  if (!list.length) return null;
  const glow = "#ffd488";
  return (
    <g>
      <g filter={`url(#${p}glow)`} opacity={sky.windows * 0.8}>
        {list.map((w, i) => (
          <circle key={i} cx={w.x} cy={w.y} r={w.s * 1.6} fill={glow} />
        ))}
      </g>
      {list.map((w, i) => (
        <g key={i}>
          {w.house && (
            <path
              d={`M${w.x - w.s * 1.8} ${w.y + w.s * 1.2} L${w.x - w.s * 1.8} ${w.y - w.s * 0.9} L${w.x} ${w.y - w.s * 2.3} L${w.x + w.s * 1.8} ${w.y - w.s * 0.9} L${w.x + w.s * 1.8} ${w.y + w.s * 1.2} Z`}
              fill={mix(sky.hills[w.layer]!, sky.leafShade, 0.25)}
            />
          )}
          <rect
            x={w.x - w.s * 0.5}
            y={w.y - w.s * 0.6}
            width={w.s}
            height={w.s * 1.15}
            fill={mix(mix(sky.hills[w.layer]!, sky.leafShade, 0.6), glow, sky.windows)}
          />
        </g>
      ))}
    </g>
  );
}
