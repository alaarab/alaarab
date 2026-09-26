/** Small hand-drawn landmarks that sit in the scenes. All sizes are in scene units (1440 x 900). */
import type { ReactNode } from "react";
import { mix, rng, trail } from "./paint";
import type { Ctx } from "./Scene";

const GLOW = "#ffd488";
const WOOD = "#6b5138";
const ROOF = "#8d5443";
const WALL = "#eee2c6";
const STONE = "#b9ad96";

/** Sink a daylight colour into the scene's light and shade. */
export const tone = (c: Ctx, color: string, depth = 0) =>
  mix(mix(color, c.sky.light, 0.12), c.sky.hills[3 - depth]!, 0.18 + c.dim * 0.7);

export function Painted({ c, children }: { c: Ctx; children: ReactNode }) {
  return <g filter={`url(#${c.p}paint)`}>{children}</g>;
}

export function Tree({ c, x, y, h, round = 1 }: { c: Ctx; x: number; y: number; h: number; round?: number }) {
  const trunk = tone(c, WOOD);
  const shade = c.sky.leafShade;
  const leaf = c.sky.leaf;
  const lit = mix(leaf, c.sky.light, 0.32);
  const cy = y - h * 0.66;
  const blobs = [
    [-0.2, 0.06, 0.2],
    [0.19, 0.07, 0.21],
    [0, -0.13, 0.25],
    [-0.29, 0.14, 0.15],
    [0.3, 0.15, 0.15],
    [-0.1, 0.19, 0.18],
    [0.11, -0.02, 0.22],
  ] as const;
  const d = c.dir;
  // Small leaf clusters around the canopy edge, lit on the sun side.
  const r = rng(Math.round(x * 7 + h));
  const leaves = Array.from({ length: 26 }, () => {
    const a = r() * Math.PI * 2;
    const rad = 0.24 + r() * 0.1;
    const lx = Math.cos(a) * rad * 1.05;
    const ly = Math.sin(a) * rad * 0.8 * round + 0.03;
    return [lx, ly, 0.04 + r() * 0.035, lx * d > 0.05 && ly < 0.1] as const;
  });
  return (
    <g>
      <path
        d={`M${x - h * 0.045} ${y} Q${x - h * 0.02} ${y - h * 0.3} ${x - h * 0.03} ${y - h * 0.55} L${x + h * 0.03} ${y - h * 0.55} Q${x + h * 0.02} ${y - h * 0.3} ${x + h * 0.05} ${y} Z`}
        fill={trunk}
      />
      {blobs.map(([bx, by, br], i) => (
        <ellipse key={i} cx={x + bx * h} cy={cy + by * h} rx={br * h} ry={br * h * round} fill={shade} />
      ))}
      {blobs.map(([bx, by, br], i) => (
        <ellipse
          key={`l${i}`}
          cx={x + bx * h + d * h * 0.04}
          cy={cy + by * h - h * 0.05}
          rx={br * h * 0.74}
          ry={br * h * 0.7 * round}
          fill={leaf}
        />
      ))}
      {leaves.map(([lx, ly, lr, isLit], i) => (
        <circle key={`f${i}`} cx={x + lx * h} cy={cy + ly * h} r={lr * h} fill={isLit ? mix(leaf, c.sky.light, 0.1) : mix(shade, leaf, 0.35)} />
      ))}
    </g>
  );
}

export function House({
  c,
  x,
  y,
  w,
  lit = true,
  chimney = true,
  roof = ROOF,
}: {
  c: Ctx;
  x: number;
  y: number;
  w: number;
  lit?: boolean;
  chimney?: boolean;
  roof?: string;
}) {
  const h = w * 0.58;
  const wall = tone(c, WALL);
  const wallShade = mix(wall, c.sky.leafShade, 0.28);
  const roofC = tone(c, roof);
  const win = lit ? mix(mix(wall, "#353a36", 0.65), GLOW, c.sky.windows) : mix(wall, "#353a36", 0.55);
  const wx = x + w * 0.12;
  const wy = y - h * 0.66;
  return (
    <g>
      {lit && c.sky.windows > 0 && (
        <circle cx={wx + w * 0.08} cy={wy + w * 0.07} r={w * 0.34} fill={GLOW} opacity={c.sky.windows * 0.55} filter={`url(#${c.p}glow)`} />
      )}
      <rect x={x - w / 2} y={y - h} width={w} height={h + 2} fill={wall} />
      <rect x={x - w / 2} y={y - h} width={w} height={h * 0.2} fill={wallShade} opacity={0.7} />
      <rect x={x + (c.dir > 0 ? -w / 2 : w / 2 - w * 0.2)} y={y - h} width={w * 0.2} height={h + 2} fill={wallShade} opacity={0.5} />
      {chimney && <rect x={x + w * 0.22} y={y - h - w * 0.36} width={w * 0.08} height={w * 0.2} fill={mix(roofC, "#3a3530", 0.3)} />}
      <path
        d={`M${x - w / 2 - w * 0.09} ${y - h + 1} L${x + w / 2 + w * 0.09} ${y - h + 1} L${x + w / 2 - w * 0.14} ${y - h - w * 0.3} L${x - w / 2 + w * 0.14} ${y - h - w * 0.3} Z`}
        fill={roofC}
      />
      <path
        d={`M${x - w / 2 + w * 0.14} ${y - h - w * 0.3} L${x + w / 2 - w * 0.14} ${y - h - w * 0.3}`}
        stroke={mix(roofC, c.sky.light, 0.4)}
        strokeWidth={Math.max(1, w * 0.025)}
      />
      <rect x={x - w * 0.32} y={y - h * 0.68} width={w * 0.14} height={h * 0.68} fill={mix(wall, "#4a3b2c", 0.5)} />
      <rect x={wx} y={wy} width={w * 0.16} height={w * 0.14} fill={win} />
    </g>
  );
}

/** A worn dirt path, drawn as a tapering pale band. */
export function Path({ c, points, w0, w1 }: { c: Ctx; points: Array<[number, number]>; w0: number; w1: number }) {
  const soil = tone(c, "#d8c7a0", 1);
  return <path d={trail(points, w0, w1)} fill={soil} opacity={0.85} />;
}

// ---------------------------------------------------------------- per project

export function homeLandmark(c: Ctx) {
  const tx = 800;
  const ty = c.ground(3, tx);
  const hx = 690;
  const hy = c.ground(3, hx) + 4;
  return (
    <Painted c={c}>
      <Path c={c} points={[[hx - 20, hy + 2], [630, 790], [700, 840], [590, 900]]} w0={5} w1={70} />
      <House c={c} x={hx} y={hy} w={58} />
      <Tree c={c} x={tx} y={ty + 4} h={230} />
    </Painted>
  );
}

export function phrenLandmark(c: Ctx) {
  const x = 820;
  const y = c.ground(3, x);
  return (
    <Painted c={c}>
      <Path c={c} points={[[x - 30, y + 6], [760, 790], [820, 850], [700, 900]]} w0={4} w1={60} />
      <House c={c} x={x - 40} y={y + 6} w={46} />
      <House c={c} x={x + 34} y={y + 2} w={38} chimney={false} />
      <Tree c={c} x={x + 110} y={y + 10} h={130} />
    </Painted>
  );
}

export function m4lLandmark(c: Ctx) {
  const x = 790;
  return (
    <Painted c={c}>
      <Tree c={c} x={x} y={c.ground(3, x) + 6} h={120} round={0.9} />
    </Painted>
  );
}

export function minaLandmark(c: Ctx) {
  const x = 760;
  const y = c.ground(3, x) + 4;
  return (
    <Painted c={c}>
      <House c={c} x={x} y={y} w={62} />
      <Tree c={c} x={x + 92} y={y + 6} h={120} />
    </Painted>
  );
}

export function basisLandmark(c: Ctx) {
  // An orchard: rows of evenly spaced trees receding up the slope.
  const rows = [
    { dy: -18, s: 20, step: 76, n: 9 },
    { dy: 22, s: 30, step: 112, n: 7 },
  ];
  return (
    <Painted c={c}>
      {rows.map((row, ri) =>
        Array.from({ length: row.n }, (_, i) => {
          const x = 720 + (i - (row.n - 1) / 2) * row.step;
          return <Tree key={`${ri}-${i}`} c={c} x={x} y={c.ground(3, x) + row.dy + row.s * 0.2} h={row.s * 2.3} round={0.85} />;
        }),
      )}
    </Painted>
  );
}

export function intranetLandmark(c: Ctx) {
  // A long valley road, from the bottom of the frame into the far hills, with poles along it.
  const poles: Array<[number, number, number]> = [
    [586, 850, 64],
    [690, 776, 40],
    [770, 736, 26],
    [838, 702, 16],
  ];
  return (
    <Painted c={c}>
      <Path c={c} points={[[900, 668], [820, 712], [700, 760], [640, 820], [520, 910]]} w0={3} w1={120} />
      {poles.map(([x, y, h], i) => (
        <g key={i} stroke={tone(c, WOOD)} strokeWidth={Math.max(1.2, h / 22)} strokeLinecap="round">
          <line x1={x} y1={y} x2={x} y2={y - h} />
          <line x1={x - h * 0.16} y1={y - h * 0.9} x2={x + h * 0.16} y2={y - h * 0.9} />
        </g>
      ))}
      <path
        d={`M${poles.map(([x, y, h]) => `${x} ${y - h * 0.9}`).join(" L")}`}
        fill="none"
        stroke={tone(c, "#4c4538")}
        strokeWidth={0.8}
        opacity={0.6}
      />
    </Painted>
  );
}

export function ogridLandmark(c: Ctx) {
  // A patchwork of fields across the middle hill.
  const r = rng(11);
  const crops = ["#b9b86a", "#8fa65a", "#c9b477", "#7f9a52", "#a8b36c"];
  const cells: ReactNode[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const x0 = 440 + col * 74 + row * 8;
      const x1 = x0 + 74;
      const t0 = row * 16 + 10;
      const t1 = t0 + 16;
      const g = (x: number, t: number) => c.ground(2, x) + t;
      cells.push(
        <path
          key={`${row}-${col}`}
          d={`M${x0} ${g(x0, t0)} L${x1} ${g(x1, t0)} L${x1 + 8} ${g(x1 + 8, t1)} L${x0 + 8} ${g(x0 + 8, t1)} Z`}
          fill={tone(c, crops[Math.floor(r() * crops.length)]!, 1)}
          stroke={tone(c, "#5d6b3c", 1)}
          strokeWidth={1.4}
          strokeOpacity={0.55}
        />,
      );
    }
  }
  return <Painted c={c}>{cells}</Painted>;
}

export function livemcpCrossing(c: Ctx) {
  // A stream winding down to the paper, and a stone bridge over it.
  const water = mix(mix(c.sky.horizon, c.sky.top, 0.45), c.sky.meadow, 0.2);
  const stone = tone(c, "#a39a86");
  const shade = mix(stone, c.sky.leafShade, 0.45);
  const y = 796;
  return (
    <Painted c={c}>
      <path d={trail([[800, 722], [750, 752], [735, 790], [760, 840], [700, 910]], 5, 120)} fill={water} />
      <path d={`M636 ${y + 10} Q720 ${y - 58} 832 ${y + 10} L832 ${y + 22} L808 ${y + 22} Q720 ${y - 30} 660 ${y + 22} L636 ${y + 22} Z`} fill={stone} />
      <path d={`M660 ${y + 22} Q720 ${y - 30} 808 ${y + 22} L796 ${y + 22} Q720 ${y - 14} 672 ${y + 22} Z`} fill={shade} />
      <path d={`M636 ${y + 10} Q720 ${y - 58} 832 ${y + 10}`} fill="none" stroke={mix(stone, c.sky.light, 0.5)} strokeWidth={3} />
    </Painted>
  );
}

export function intrapathLandmark(c: Ctx) {
  // A timber frame going up beside an old stone footing.
  const x = 800;
  const y = c.ground(3, x) + 4;
  const wood = tone(c, "#b58a58");
  const w = 110;
  const h = 64;
  return (
    <Painted c={c}>
      <rect x={x - 190} y={y - 10} width={90} height={12} fill={tone(c, STONE)} />
      <rect x={x - 186} y={y - 18} width={30} height={9} fill={tone(c, STONE)} opacity={0.8} />
      <g stroke={wood} strokeWidth={4} strokeLinecap="round" fill="none">
        {[0, 0.33, 0.66, 1].map((t) => (
          <line key={t} x1={x - w / 2 + t * w} y1={y} x2={x - w / 2 + t * w} y2={y - h} />
        ))}
        <line x1={x - w / 2 - 6} y1={y - h} x2={x + w / 2 + 6} y2={y - h} />
        <line x1={x - w / 2} y1={y - h * 0.5} x2={x + w / 2} y2={y - h * 0.5} strokeWidth={2.5} />
        <path d={`M${x - w / 2 - 8} ${y - h} L${x} ${y - h - 46} L${x + w / 2 + 8} ${y - h}`} />
        <line x1={x} y1={y - h} x2={x} y2={y - h - 46} strokeWidth={2.5} />
        <line x1={x - w / 2} y1={y} x2={x - w / 2 + w * 0.33} y2={y - h * 0.5} strokeWidth={2} />
      </g>
      <g stroke={tone(c, "#e4c38c")} strokeWidth={1.5} opacity={0.9}>
        <line x1={x + 60} y1={y + 2} x2={x + 150} y2={y - 2} />
        <line x1={x + 64} y1={y - 3} x2={x + 146} y2={y - 7} />
      </g>
    </Painted>
  );
}

export function atlasLandmark(c: Ctx) {
  // Crossroads and a signpost with three arms.
  const x = 760;
  const y = 800;
  const post = tone(c, WOOD);
  const board = tone(c, "#d8c29a");
  return (
    <Painted c={c}>
      <Path c={c} points={[[400, 760], [600, 790], [760, 812], [1000, 850], [1200, 900]]} w0={10} w1={50} />
      <Path c={c} points={[[810, 720], [790, 770], [760, 815], [700, 900]]} w0={6} w1={70} />
      <line x1={x + 40} y1={y + 8} x2={x + 40} y2={y - 96} stroke={post} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${x + 44} ${y - 90} L${x + 104} ${y - 92} L${x + 116} ${y - 82} L${x + 104} ${y - 72} L${x + 44} ${y - 72} Z`} fill={board} />
      <path d={`M${x + 36} ${y - 66} L${x - 22} ${y - 62} L${x - 34} ${y - 52} L${x - 22} ${y - 44} L${x + 36} ${y - 48} Z`} fill={board} />
      <path d={`M${x + 44} ${y - 42} L${x + 94} ${y - 36} L${x + 104} ${y - 26} L${x + 92} ${y - 18} L${x + 44} ${y - 24} Z`} fill={mix(board, c.sky.leafShade, 0.15)} />
    </Painted>
  );
}

export function mutterLandmark(c: Ctx) {
  // Two houses on facing knolls with a line strung between them.
  const ax = 610;
  const bx = 960;
  const ay = c.ground(3, ax) + 4;
  const by = c.ground(3, bx) + 4;
  const line = tone(c, "#3d3a36");
  return (
    <Painted c={c}>
      <House c={c} x={ax} y={ay} w={48} />
      <House c={c} x={bx} y={by} w={44} chimney={false} />
      <line x1={ax + 40} y1={ay} x2={ax + 40} y2={ay - 70} stroke={tone(c, WOOD)} strokeWidth={3} />
      <line x1={bx - 40} y1={by} x2={bx - 40} y2={by - 70} stroke={tone(c, WOOD)} strokeWidth={3} />
      <path d={`M${ax + 40} ${ay - 66} Q${(ax + bx) / 2} ${Math.max(ay, by) - 10} ${bx - 40} ${by - 66}`} fill="none" stroke={line} strokeWidth={1.2} opacity={0.8} />
    </Painted>
  );
}

export function emvLandmark(c: Ctx) {
  // Haystacks: documents kept in loose heaps rather than rows.
  const stacks: Array<[number, number]> = [
    [560, 40],
    [680, 54],
    [820, 62],
    [930, 44],
    [1040, 34],
  ];
  const hay = tone(c, "#d2b879");
  const hayShade = mix(hay, c.sky.leafShade, 0.35);
  return (
    <Painted c={c}>
      {stacks.map(([x, s], i) => {
        const y = c.ground(3, x) + 26 + s * 0.3;
        return (
          <g key={i}>
            <path d={`M${x - s} ${y} Q${x - s * 0.95} ${y - s * 1.3} ${x} ${y - s * 1.5} Q${x + s * 0.95} ${y - s * 1.3} ${x + s} ${y} Z`} fill={hayShade} />
            <path d={`M${x - s * 0.9} ${y} Q${x - s * 0.8} ${y - s * 1.25} ${x - s * 0.05} ${y - s * 1.45} Q${x + s * 0.3} ${y - s * 0.9} ${x + s * 0.2} ${y} Z`} fill={hay} />
          </g>
        );
      })}
    </Painted>
  );
}

export function equipmentLandmark(c: Ctx) {
  // A barn with its big door, and a cart beside it.
  const x = 800;
  const y = c.ground(3, x) + 6;
  const red = tone(c, "#9a5a45");
  const redShade = mix(red, c.sky.leafShade, 0.3);
  const trim = tone(c, WALL);
  return (
    <Painted c={c}>
      <path d={`M${x - 80} ${y} L${x - 80} ${y - 70} L${x - 40} ${y - 108} L${x + 40} ${y - 108} L${x + 80} ${y - 70} L${x + 80} ${y} Z`} fill={red} />
      <path d={`M${x - 92} ${y - 66} L${x - 40} ${y - 114} L${x + 40} ${y - 114} L${x + 92} ${y - 66}`} fill="none" stroke={tone(c, "#5a5550")} strokeWidth={9} strokeLinejoin="round" />
      <rect x={x - 30} y={y - 62} width={60} height={62} fill={redShade} />
      <path d={`M${x - 30} ${y - 62} L${x + 30} ${y} M${x + 30} ${y - 62} L${x - 30} ${y}`} stroke={trim} strokeWidth={3} />
      <rect x={x - 30} y={y - 62} width={60} height={62} fill="none" stroke={trim} strokeWidth={3} />
      <g transform={`translate(${x + 130} ${c.ground(3, x + 130) + 8})`}>
        <rect x={-26} y={-24} width={52} height={14} fill={tone(c, WOOD)} />
        <circle cx={-14} cy={-8} r={9} fill="none" stroke={tone(c, "#4a3f33")} strokeWidth={3} />
        <circle cx={16} cy={-8} r={9} fill="none" stroke={tone(c, "#4a3f33")} strokeWidth={3} />
        <line x1={26} y1={-18} x2={52} y2={-10} stroke={tone(c, WOOD)} strokeWidth={3} />
      </g>
    </Painted>
  );
}

export function alphalensLandmark(c: Ctx) {
  // A small observatory, its slit open to the evening.
  const x = 820;
  const y = c.ground(3, x) + 4;
  const wall = tone(c, WALL);
  const dome = tone(c, "#c9ccc8");
  return (
    <Painted c={c}>
      <rect x={x - 40} y={y - 46} width={80} height={48} fill={wall} />
      <rect x={x - 40} y={y - 46} width={24} height={48} fill={mix(wall, c.sky.leafShade, 0.25)} />
      <path d={`M${x - 46} ${y - 46} A46 46 0 0 1 ${x + 46} ${y - 46} Z`} fill={dome} />
      <path d={`M${x - 46} ${y - 46} A46 46 0 0 1 ${x - 10} ${y - 89}`} fill="none" stroke={mix(dome, c.sky.light, 0.5)} strokeWidth={3} />
      <path d={`M${x + 4} ${y - 91} L${x + 16} ${y - 90} L${x + 14} ${y - 50} L${x + 2} ${y - 50} Z`} fill={mix("#3e3a3a", GLOW, c.sky.windows * 0.8)} />
      <line x1={x + 10} y1={y - 80} x2={x + 36} y2={y - 118} stroke={tone(c, "#6e6a64")} strokeWidth={5} strokeLinecap="round" />
      <rect x={x - 26} y={y - 30} width={10} height={12} fill={mix("#3e3a3a", GLOW, c.sky.windows)} />
    </Painted>
  );
}

export function gardenLandmark(c: Ctx) {
  // Raised beds in rows, each with a small staked sensor.
  const beds = [0, 1, 2, 3];
  const soil = tone(c, "#8b6e4e");
  const sprout = tone(c, "#7fa052");
  return (
    <Painted c={c}>
      {beds.map((b) => {
        const y = 790 + b * 22;
        const x0 = 560 - b * 30;
        const x1 = 960 + b * 30;
        return (
          <g key={b}>
            <path d={`M${x0} ${y} L${x1} ${y} L${x1 + 8} ${y + 10} L${x0 - 8} ${y + 10} Z`} fill={soil} />
            {Array.from({ length: 12 + b * 2 }, (_, i) => {
              const x = x0 + 10 + (i * (x1 - x0 - 20)) / (11 + b * 2);
              return <ellipse key={i} cx={x} cy={y - 3} rx={5 + b} ry={4 + b * 0.8} fill={sprout} />;
            })}
            <line x1={x1 - 30} y1={y + 4} x2={x1 - 30} y2={y - 26 - b * 4} stroke={tone(c, WOOD)} strokeWidth={2 + b * 0.4} />
            <rect x={x1 - 34} y={y - 30 - b * 4} width={8 + b} height={6 + b} fill={tone(c, "#e8e0cc")} />
          </g>
        );
      })}
    </Painted>
  );
}

export function retrofitLandmark(c: Ctx) {
  // A row of old houses, a ladder against one.
  const xs = [640, 712, 784, 856];
  const base = c.ground(3, 750) + 8;
  return (
    <Painted c={c}>
      {xs.map((x, i) => (
        <House key={x} c={c} x={x} y={base + (i % 2) * 2} w={70} chimney={i % 2 === 0} roof={i === 2 ? "#6f6a70" : ROOF} lit={i === 1} />
      ))}
      <g stroke={tone(c, "#b38e5c")} strokeWidth={2.5}>
        <line x1={806} y1={base} x2={826} y2={base - 70} />
        <line x1={822} y1={base} x2={842} y2={base - 70} />
        {[0.2, 0.4, 0.6, 0.8].map((t) => (
          <line key={t} x1={806 + 20 * t} y1={base - 70 * t} x2={822 + 20 * t} y2={base - 70 * t} strokeWidth={1.8} />
        ))}
      </g>
    </Painted>
  );
}

export function notFoundLandmark(c: Ctx) {
  // A path that fades out in the grass.
  return (
    <Painted c={c}>
      <Path c={c} points={[[760, 760], [720, 800], [760, 850], [700, 910]]} w0={1} w1={60} />
    </Painted>
  );
}
