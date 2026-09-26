import { useMemo, type ReactNode } from "react";
import { Forest, InkDefs, Range, Tree, Wash, blob, rng, roughen, smooth, type Pt } from "./ink";

/** A gabled house outline with its foot at (x, y). */
const house = (x: number, y: number, w: number, h: number, r = w * 0.55) =>
  `M${x} ${y} v${-h} l${w / 2} ${-r} l${w / 2} ${r} v${h} Z`;

/** Small rectangles in a grid, used for windows. */
function Windows({ x, y, cols, rows, w = 6, h = 9, gx = 12, gy = 16, lit = [] as number[] }: {
  x: number; y: number; cols: number; rows: number; w?: number; h?: number; gx?: number; gy?: number; lit?: number[];
}) {
  return (
    <g strokeWidth="0.8">
      {Array.from({ length: cols * rows }, (_, i) => (
        <rect
          key={i}
          x={x + (i % cols) * gx}
          y={y + Math.floor(i / cols) * gy}
          width={w}
          height={h}
          className={lit.includes(i) ? "lit" : "win"}
        />
      ))}
    </g>
  );
}

/** Frame shared by every inset: paper, neat-line, a caption lettered along the foot. */
function Frame({ w, h, caption, children }: { w: number; h: number; caption: string; children: ReactNode }) {
  return (
    <>
      <InkDefs id="in" />
      <clipPath id="in-frame">
        <rect x="17" y="17" width={w - 34} height={h - 34} />
      </clipPath>
      <g clipPath="url(#in-frame)">
        <g filter="url(#in-wobble)">{children}</g>
      </g>
      <rect x="10" y="10" width={w - 20} height={h - 20} className="neat" />
      <rect x="16" y="16" width={w - 32} height={h - 32} className="neat thin" />
      <text x={w / 2} y={h - 30} textAnchor="middle" className="insetCaption">{caption}</text>
    </>
  );
}

/* ---------------- Phren: the walled library on a hill ---------------- */

export function PhrenInset({ caption }: { caption: string }) {
  const W = 800;
  const H = 680;
  const cx = 400;
  const cy = 300;
  const rx = 160;
  const ry = 58;
  // Seven roads, one for each surface on the store, all arriving at the walls.
  const roads = useMemo(() => {
    const ends: [Pt, number][] = [
      [[30, 600], 200], [[20, 330], 180], [[150, 30], 230], [[560, 24], 300],
      [[780, 170], 340], [[780, 520], 20], [[470, 660], 100],
    ];
    return ends.map(([p, a], i) => {
      const t = (a * Math.PI) / 180;
      const q: Pt = [cx + Math.cos(t) * rx * 1.02, cy + 24 + Math.sin(t) * ry * 1.1 + (Math.sin(t) > 0 ? 26 : 0)];
      const r = rng(40 + i);
      const mid: Pt = [(p[0] + q[0]) / 2 + (r() - 0.5) * 120, (p[1] + q[1]) / 2 + (r() - 0.5) * 90];
      return smooth(roughen([p, mid, q], 60 + i, 10, 2, false), false);
    });
  }, []);
  const crenels = useMemo(() => {
    // Front wall: crenellated lower arc of the ellipse.
    let top = "";
    const n = 30;
    for (let i = 0; i <= n; i++) {
      const t = Math.PI - (i / n) * Math.PI;
      const x = cx + Math.cos(t) * rx;
      const yy = cy + Math.abs(Math.sin(t)) * ry;
      top += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${(yy - (i % 2 ? 7 : 0)).toFixed(1)} `;
    }
    const face = `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} v28 A${rx} ${ry} 0 0 1 ${cx - rx} ${cy + 28} Z`;
    return { top, face };
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="insetSvg" aria-hidden="true">
      <Frame w={W} h={H} caption={caption}>
        <g filter="url(#in-wash)">
          <Wash d={blob(200, 200, 190, 150, 2)} color="var(--washA)" o={0.34} />
          <Wash d={blob(620, 480, 200, 140, 7)} color="var(--washA)" o={0.28} />
          <Wash d={blob(400, 370, 260, 150, 11)} color="var(--washB)" o={0.42} />
          <Wash d={blob(690, 110, 110, 70, 19)} color="var(--washC)" o={0.3} />
        </g>
        <g className="road">
          {roads.map((d, i) => <path key={i} d={d} />)}
        </g>
        {/* the hill */}
        <path d={`M120 520 C230 470 250 350 ${cx - rx} ${cy + 20} M${cx + rx} ${cy + 20} C560 350 580 470 690 520`} />
        <path d="M575 372 l14 22 M598 404 l16 24 M620 440 l16 22 M646 474 l14 18 M556 400 l12 18 M580 440 l12 18 M226 380 l-8 16 M206 412 l-8 16 M190 448 l-8 14" strokeWidth="0.9" />
        {/* back wall */}
        <path d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`} strokeWidth="1.2" />
        {/* the library hall and the houses inside the walls */}
        <path d={house(330, 318, 140, 92, 58)} className="roof" />
        <Windows x={340} y={238} cols={10} rows={4} w={5} h={9} gx={12.4} gy={18} lit={[3, 7, 12, 15, 21, 26, 30, 34, 38]} />
        <path d="M430 318 v-150 l14 -26 l14 26 v150" className="roof" />
        <Windows x={439} y={180} cols={2} rows={6} w={4} h={8} gx={9} gy={20} lit={[1, 4, 9]} />
        <path d={house(262, 330, 58, 44)} className="roof" />
        <Windows x={270} y={296} cols={3} rows={2} w={5} h={7} gx={15} gy={14} lit={[2]} />
        <path d={house(478, 332, 64, 40)} className="roof" />
        <Windows x={486} y={302} cols={4} rows={2} w={5} h={7} gx={14} gy={13} lit={[1, 6]} />
        <path d={house(290, 342, 38, 30)} className="roof" />
        <path d={house(472, 344, 40, 26)} className="roof" />
        {/* front wall with its crenels, gate and towers */}
        <path d={crenels.face} className="roof" />
        <path d={crenels.top} strokeWidth="1.1" />
        <path d={`M${cx - 14} ${cy + ry + 28} v-18 a14 14 0 0 1 28 0 v18`} className="solid" />
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M${cx + s * rx - 12} ${cy + 34} v-58 h24 v58`} className="roof" />
            <path d={`M${cx + s * rx - 15} ${cy - 24} l15 -22 l15 22 Z`} className="roof" />
            <rect x={cx + s * rx - 3} y={cy - 12} width="6" height="9" className="lit" />
          </g>
        ))}
        <Windows x={cx - rx + 36} y={cy + 40} cols={9} rows={1} w={4} h={6} gx={30} gy={0} lit={[2, 6]} />
        <Forest cx={120} cy={120} rx={50} ry={30} n={9} seed={3} s={10} />
        <Forest cx={660} cy={600} rx={60} ry={20} n={7} seed={8} s={10} />
        <Range from={[560, 90]} to={[700, 60]} n={4} seed={3} s={18} />
      </Frame>
    </svg>
  );
}

/* ---------------- m4l-builder: the mill, whose wheel is a knob ---------------- */

const bez = (t: number, p: Pt[]): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
};

/** value: 0..10. Turns the wheel and sets the ripple rhythm downstream. */
export function MillInset({ caption, value }: { caption: string; value: number }) {
  const W = 1000;
  const H = 520;
  const stream: Pt[] = [[0, 150], [330, 130], [470, 420], [1000, 400]];
  const half = 34;
  const at = (t: number, off: number): Pt => {
    const p = bez(t, stream);
    const q = bez(Math.min(1, t + 0.001), stream);
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    const len = Math.hypot(dx, dy) || 1;
    return [p[0] + (-dy / len) * off, p[1] + (dx / len) * off];
  };
  const bank = (off: number) => {
    const pts: Pt[] = Array.from({ length: 40 }, (_, i) => at(i / 39, off));
    return smooth(roughen(pts, off > 0 ? 3 : off < 0 ? 4 : 5, 2.5, 1, false), false);
  };
  const t0 = 0.4;
  const wheel = at(t0, -half * 0.35);
  const angle = -135 + value * 27;

  // Ripples: three lanes of waveform whose frequency follows the wheel.
  const cycles = 3 + value * 1.6;
  const amp = 3 + value * 0.5;
  const lanes = [-16, 0, 16].map((lane, li) => {
    let d = "";
    const N = 220;
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      const t = t0 + 0.08 + s * (0.98 - t0 - 0.08);
      const fade = Math.sin(Math.PI * Math.min(1, s * 1.2));
      const p = at(t, lane + Math.sin(s * Math.PI * 2 * cycles + li * 1.3) * amp * fade);
      d += `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)} `;
    }
    return d;
  });

  const ticks = Array.from({ length: 11 }, (_, i) => -135 + i * 27);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="insetSvg" aria-hidden="true">
      <Frame w={W} h={H} caption={caption}>
        <g filter="url(#in-wash)">
          <Wash d={blob(200, 360, 220, 120, 4)} color="var(--washA)" o={0.34} />
          <Wash d={blob(760, 170, 230, 110, 9)} color="var(--washB)" o={0.34} />
          <Wash d={blob(820, 470, 150, 50, 13)} color="var(--washA)" o={0.26} />
          <path d={bank(0)} fill="none" stroke="var(--washC)" strokeWidth={half * 2.1} opacity="0.55" />
        </g>
        <path d={bank(-half)} strokeWidth="1.4" />
        <path d={bank(half)} strokeWidth="1.4" />
        <g className="ripples" strokeWidth="1">
          {lanes.map((d, i) => <path key={i} d={d} />)}
        </g>
        {/* the mill house on the north bank, its axle running to the wheel */}
        <path d={`M${wheel[0]} ${wheel[1] - 20} H${wheel[0] + 80}`} strokeWidth="2.4" />
        <path d={house(wheel[0] + 70, wheel[1] + 2, 120, 72, 52)} className="roof" />
        <path d={`M${wheel[0] + 150} ${wheel[1] - 70} v-40 h18 v28`} className="roof" />
        <rect x={wheel[0] + 90} y={wheel[1] - 50} width="12" height="14" className="lit" />
        <rect x={wheel[0] + 160} y={wheel[1] - 50} width="12" height="14" className="win" />
        <rect x={wheel[0] + 122} y={wheel[1] - 30} width="18" height="32" className="door" />
        {/* the knob scale, like the dial printed round a real knob */}
        <g transform={`translate(${wheel[0]} ${wheel[1]})`}>
          {ticks.map((a, i) => {
            const r = (a - 90) * (Math.PI / 180);
            const lit = i <= value;
            return (
              <path
                key={a}
                d={`M${Math.cos(r) * 66} ${Math.sin(r) * 66} L${Math.cos(r) * (lit ? 78 : 73)} ${Math.sin(r) * (lit ? 78 : 73)}`}
                strokeWidth={lit ? 1.6 : 0.9}
              />
            );
          })}
          <g className="wheel" style={{ transform: `rotate(${angle}deg)` }}>
            <circle r="56" className="roof" />
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d="M0 -40 V-56" transform={`rotate(${i * 30})`} strokeWidth="1.2" />
            ))}
            <circle r="40" className="roof" />
            <circle r="34" strokeWidth="0.7" />
            <path d="M0 0 V-34" strokeWidth="3" />
            <circle r="3.5" className="solid" />
          </g>
        </g>
        <Forest cx={150} cy={330} rx={80} ry={40} n={14} seed={21} s={11} />
        <Forest cx={720} cy={250} rx={60} ry={28} n={8} seed={17} s={11} />
        <Range from={[640, 90]} to={[900, 70]} n={6} seed={5} s={18} />
        {[0.12, 0.2, 0.86].map((t) => {
          const p = at(t, half + 26);
          return <Tree key={t} x={p[0]} y={p[1]} s={10} />;
        })}
      </Frame>
    </svg>
  );
}

/* ---------------- Mina: one cottage at night on a quiet shore ---------------- */

export function MinaInset({ caption }: { caption: string }) {
  const W = 720;
  const H = 820;
  const shore = useMemo(
    () => smooth(roughen([[0, 548], [150, 552], [290, 580], [390, 640], [460, 720], [500, 820]], 7, 10, 2, false), false),
    [],
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="insetSvg" aria-hidden="true">
      <Frame w={W} h={H} caption={caption}>
        <g filter="url(#in-wash)">
          <Wash d={blob(360, 200, 420, 240, 3)} color="var(--washA)" o={0.55} />
          <Wash d={blob(520, 620, 320, 220, 8)} color="var(--washB)" o={0.4} />
          <Wash d={blob(140, 700, 260, 200, 12)} color="var(--washC)" o={0.7} />
          <circle cx="520" cy="190" r="90" fill="#f3e6c0" opacity="0.08" />
        </g>
        {/* moon */}
        <circle cx="520" cy="190" r="34" className="moon" />
        {/* stars, few */}
        {[[120, 110], [210, 70], [300, 160], [640, 90], [420, 60], [660, 300]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" className="star" />
        ))}
        {/* horizon and the moon's path across the water */}
        <path d="M24 360 H696" strokeWidth="0.8" opacity="0.6" />
        {[380, 404, 432, 464, 500, 540, 584, 632].map((y, i) => {
          const w = 18 + i * 9;
          return (
            <path
              key={y}
              d={`M${520 - w} ${y} h${w * 0.7} m${w * 0.18} 0 h${w * 0.9}`}
              className="moonPath"
              strokeWidth={1.4 + i * 0.2}
            />
          );
        })}
        <path d="M110 420 q10 -5 20 0 t20 0 M600 460 q10 -5 20 0 t20 0 M300 470 q10 -5 20 0 t20 0" strokeWidth="0.9" opacity="0.6" />
        {/* the land in the foreground, a darker wash, and the shore with its echo */}
        <path d={`${shore} L0 820 Z`} fill="#141730" opacity="0.55" stroke="none" filter="url(#in-wash)" />
        <path d={shore} strokeWidth="1.6" />
        <path d={shore} strokeWidth="0.8" transform="translate(10 -12)" opacity="0.5" />
        {/* the cottage */}
        <circle cx="176" cy="628" r="46" fill="#f2c56b" opacity="0.08" stroke="none" />
        <path d={house(130, 650, 96, 54, 44)} className="roof" />
        <path d="M202 596 v-24 h12 v34" className="roof" />
        <rect x="148" y="616" width="16" height="16" className="lit" />
        <path d="M156 616 v16 M148 624 h16" strokeWidth="0.8" />
        <rect x="186" y="622" width="14" height="28" className="door" />
        <path d="M160 650 l-30 70 M138 650 l-44 60" className="glow" />
        <Tree x={74} y={660} s={16} />
        <Tree x={48} y={680} s={13} />
        <Tree x={290} y={700} s={12} />
      </Frame>
    </svg>
  );
}

/* ---------------- Every other place: a keyed motif ---------------- */

function Motif({ slug }: { slug: string }) {
  switch (slug) {
    case "basis": // customs house with neatly lined storehouses on the quay
      return (
        <g>
          <path d="M60 430 H740" strokeWidth="2" />
          <path d="M60 438 H740" strokeWidth="0.8" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <path d={house(110 + i * 100, 420, 76, 46, 26)} className="roof" />
              <rect x={140 + i * 100} y={396} width="16" height="24" className="door" />
            </g>
          ))}
          <g filter="url(#in-wash)">
            <rect x="0" y="446" width="800" height="240" fill="var(--washC)" opacity="0.4" />
          </g>
          <path d={house(320, 330, 160, 80, 30)} className="roof" />
          <path d="M320 282 h160" strokeWidth="1" />
          {[0, 1, 3, 4].map((i) => <path key={i} d={`M${350 + i * 25} 318 v-26 a6 6 0 0 1 12 0 v26`} strokeWidth="1" />)}
          <rect x="390" y="296" width="20" height="34" className="door" />
          <path d="M400 220 v-40 l26 8 l-26 8" className="roof" />
          {[80, 200, 320, 440, 560, 680].map((x) => <circle key={x} cx={x} cy="446" r="3" className="solid" />)}
          <path d="M140 500 q10 -5 20 0 t20 0 M420 530 q10 -5 20 0 t20 0 M600 490 q10 -5 20 0 t20 0" strokeWidth="0.9" />
        </g>
      );
    case "intranet-erp": { // a long-established market town round its square
      const r = rng(12);
      const houses = Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2 + r() * 0.2;
        const d = 120 + r() * 70;
        return [400 + Math.cos(a) * d * 1.3, 330 + Math.sin(a) * d * 0.7, 30 + r() * 16] as const;
      }).sort((a, b) => a[1] - b[1]);
      return (
        <g>
          <path d="M40 330 H300 M500 330 H760 M400 40 V240 M400 420 V640" className="roadLine" />
          <ellipse cx="400" cy="330" rx="100" ry="54" strokeWidth="1" />
          <circle cx="400" cy="326" r="7" className="roof" />
          <circle cx="400" cy="326" r="3" strokeWidth="0.8" />
          {houses.map(([x, y, w], i) => (
            <path key={i} d={house(x - w / 2, y, w, w * 0.7)} className="roof" />
          ))}
          <path d="M470 290 v-120 l12 -30 l12 30 v120" className="roof" />
          <path d={house(440, 296, 90, 50, 30)} className="roof" />
        </g>
      );
    }
    case "intrapath": // a new town laid out along the old road
      return (
        <g>
          <path d="M40 560 C220 480 300 470 420 400 S640 220 770 140" className="roadLine" />
          {[140, 330, 560].map((x, i) => <path key={x} d={`M${x} ${[520, 450, 290][i]} v-14`} strokeWidth="3" />)}
          {Array.from({ length: 15 }, (_, i) => {
            const c = i % 5;
            const row = Math.floor(i / 5);
            const x = 300 + c * 80;
            const y = 150 + row * 70;
            const built = [0, 1, 5, 6, 7, 10].includes(i);
            return (
              <g key={i}>
                <rect x={x} y={y} width="64" height="54" strokeDasharray={built ? undefined : "3 4"} strokeWidth="0.9" />
                {built && <path d={house(x + 16, y + 44, 32, 22, 14)} className="roof" />}
              </g>
            );
          })}
        </g>
      );
    case "atlas": // a lighthouse on the headland
      return (
        <g>
          <g filter="url(#in-wash)">
            <rect x="0" y="0" width="800" height="680" fill="var(--washC)" opacity="0.28" />
          </g>
          <path d="M800 470 C640 470 600 420 560 380 S500 330 440 350 S380 420 420 470 S560 560 800 580" className="roof" />
          <path d="M480 350 L490 170 h30 L530 350 Z" className="roof" />
          <path d="M486 216 h38 M484 260 h42 M482 304 h46" strokeWidth="0.9" />
          <rect x="492" y="146" width="26" height="24" className="lit" />
          <path d="M488 146 l17 -20 l17 20 Z" className="roof" />
          <path d="M488 158 L80 90 M488 160 L60 230 M488 162 L140 340" className="beam" />
          <path d={house(560, 380, 56, 30)} className="roof" />
          <path d="M160 470 q10 -5 20 0 t20 0 M260 560 q10 -5 20 0 t20 0 M320 420 q10 -5 20 0 t20 0" strokeWidth="0.9" />
        </g>
      );
    case "ogrid": { // hedged fields in a loose grid, one range taken up for work
      const r = rng(31);
      const xs = [150, 248, 344, 446, 542, 640];
      const ys = [130, 222, 310, 404, 496];
      const jx = xs.map((x) => ys.map(() => x + (r() - 0.5) * 12));
      const jy = ys.map((y) => xs.map(() => y + (r() - 0.5) * 12));
      const pt = (c: number, row: number): Pt => [jx[c][row], jy[row][c]];
      const hedges: string[] = [];
      for (let c = 0; c < xs.length; c++) hedges.push(smooth(ys.map((_, row) => pt(c, row)), false));
      for (let row = 0; row < ys.length; row++) hedges.push(smooth(xs.map((_, c) => pt(c, row)), false));
      const furrows: string[] = [];
      for (let c = 0; c < xs.length - 1; c++)
        for (let row = 0; row < ys.length - 1; row++) {
          const [x0, y0] = pt(c, row);
          const [x1, y1] = pt(c + 1, row + 1);
          const vertical = (c + row) % 2 === 0;
          for (let k = 1; k < 7; k++) {
            const t = k / 7;
            furrows.push(
              vertical
                ? `M${x0 + (x1 - x0) * t} ${y0 + 12} V${y1 - 12}`
                : `M${x0 + 12} ${y0 + (y1 - y0) * t} H${x1 - 12}`,
            );
          }
        }
      return (
        <g>
          <path d={furrows.join(" ")} strokeWidth="0.6" opacity="0.55" />
          {hedges.map((d, i) => <path key={i} d={d} strokeWidth="1.3" />)}
          {hedges.map((d, i) => <path key={`h${i}`} d={d} strokeWidth="5" strokeDasharray="0.1 9" opacity="0.5" />)}
          <path d={`M${pt(1, 1)[0]} ${pt(1, 1)[1]} L${pt(3, 1)[0]} ${pt(3, 1)[1]} L${pt(3, 3)[0]} ${pt(3, 3)[1]} L${pt(1, 3)[0]} ${pt(1, 3)[1]} Z`} strokeWidth="2.6" />
          <rect x={pt(3, 3)[0] - 6} y={pt(3, 3)[1] - 6} width="12" height="12" className="solid" />
        </g>
      );
    }
    case "livemcp": // a bridge over the river
      return (
        <g>
          <g filter="url(#in-wash)">
            <path d="M360 20 C330 180 470 250 420 340 S330 520 400 660" className="water" />
          </g>
          <path d="M340 20 C310 180 450 250 400 340 S310 520 380 660 M382 20 C352 180 492 250 442 340 S352 520 422 660" strokeWidth="1.1" />
          <path d="M40 330 H300 M540 330 H760" className="roadLine" />
          <path d="M260 312 H560 M260 350 H560" strokeWidth="1.6" />
          <path d="M290 350 q35 -40 70 0 M370 350 q40 -48 80 0 M460 350 q35 -40 70 0" strokeWidth="1.3" />
          <path d="M270 312 v-12 M550 312 v-12" strokeWidth="1.4" />
        </g>
      );
    case "mutter": // a bell tower whose ring carries across the valley
      return (
        <g>
          {[70, 120, 170].map((r) => (
            <path key={r} d={`M${400 - r * 1.6} ${260 + r * 0.5} A${r * 1.6} ${r} 0 0 1 ${400 + r * 1.6} ${260 + r * 0.5}`} strokeWidth="0.8" strokeDasharray="2 6" />
          ))}
          <path d="M340 440 v-200 h120 v200" className="roof" />
          <path d="M330 240 l70 -70 l70 70 Z" className="roof" />
          <path d="M370 300 v-40 a30 30 0 0 1 60 0 v40" className="roof" />
          <path d="M388 294 q0 -28 12 -28 q12 0 12 28 Z" className="solid" />
          <path d={house(120, 470, 40, 28)} className="roof" />
          <path d={house(640, 460, 44, 30)} className="roof" />
          <path d={house(680, 480, 34, 24)} className="roof" />
        </g>
      );
    case "emv": // the old barn at the edge of town
      return (
        <g>
          <path d="M240 440 V300 L400 200 L560 300 V440 Z" className="roof" />
          <path d="M340 440 V340 H460 V440 M340 340 L460 440 M460 340 L340 440" strokeWidth="1" />
          <path d="M380 260 h40 v24 h-40 Z" className="lit" />
          <path d="M120 470 H680" strokeWidth="1" />
          {[140, 180, 220, 580, 620, 660].map((x) => <path key={x} d={`M${x} 470 v-24`} strokeWidth="1.2" />)}
          <path d="M140 452 H220 M580 452 H660" strokeWidth="1" />
        </g>
      );
    case "equipment-tracker": // the tool house and its tidy yard
      return (
        <g>
          <path d={house(300, 380, 200, 110, 70)} className="roof" />
          <rect x="370" y="310" width="60" height="70" className="door" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={220 + i * 76} y={430} width="52" height="40" className="roof" />
              <path d={`M${232 + i * 76} 444 h28`} strokeWidth="0.8" />
            </g>
          ))}
          <circle cx="600" cy="360" r="26" />
          <path d="M600 334 v52 M574 360 h52 M582 342 l36 36 M618 342 l-36 36" strokeWidth="0.8" />
        </g>
      );
    case "alphalens": // a watchtower looking out to sea
      return (
        <g>
          <path d="M60 520 C200 460 300 420 360 420 S520 460 740 520" />
          <path d="M340 420 L350 220 h60 L420 420" className="roof" />
          <path d="M330 220 h100 v-30 h-100 Z" className="roof" />
          <path d="M428 196 l54 -16" strokeWidth="4" />
          <path d="M486 178 L760 110" strokeDasharray="2 8" strokeWidth="1" />
          <path d="M40 110 H760" strokeWidth="0.6" opacity="0.6" />
        </g>
      );
    case "garden-sensor-network": // a garden plot with its rows and a few stakes
      return (
        <g>
          <rect x="160" y="150" width="480" height="340" strokeWidth="1.6" strokeDasharray="10 4" />
          {Array.from({ length: 7 }, (_, row) => (
            <g key={row}>
              <path d={`M190 ${190 + row * 44} H610`} strokeWidth="0.7" />
              {Array.from({ length: 12 }, (_, k) => (
                <path key={k} d={`M${204 + k * 34} ${190 + row * 44} q-6 -10 0 -16 q6 6 0 16`} className="crown" strokeWidth="0.8" />
              ))}
            </g>
          ))}
          {[[260, 230], [470, 320], [360, 450]].map(([x, y]) => (
            <g key={x}>
              <path d={`M${x} ${y} v-40`} strokeWidth="1.6" />
              <path d={`M${x} ${y - 40} h16 v10 h-16`} className="lit" />
            </g>
          ))}
          <path d="M400 490 V620" className="roadLine" />
        </g>
      );
    case "retrofit-program-data-tools": // a row of old houses, one being refitted
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path d={house(150 + i * 100, 440, 100, 110, 50)} className="roof" />
              <rect x={180 + i * 100} y={360} width="16" height="22" className={i === 1 ? "lit" : "win"} />
              <rect x={210 + i * 100} y={400} width="18" height="40" className="door" />
            </g>
          ))}
          <path d="M440 460 V260 M500 460 V260 M560 460 V260 M440 300 H560 M440 360 H560 M440 420 H560" strokeWidth="1.3" />
          <path d="M600 460 L640 300 M616 460 L656 300 M606 436 h14 M614 404 h14 M622 372 h14 M630 340 h14" strokeWidth="1" />
          <path d="M100 470 H720" strokeWidth="1" />
        </g>
      );
    default:
      return (
        <g>
          <circle cx="400" cy="330" r="8" />
          <path d="M320 330 h60 M420 330 h60" strokeDasharray="2 6" />
        </g>
      );
  }
}

export function MotifInset({ slug, caption }: { slug: string; caption: string }) {
  const W = 800;
  const H = 680;
  const seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="insetSvg" aria-hidden="true">
      <Frame w={W} h={H} caption={caption}>
        <g filter="url(#in-wash)">
          <Wash d={blob(240, 220, 220, 150, seed)} color="var(--washA)" o={0.34} />
          <Wash d={blob(560, 460, 240, 160, seed + 5)} color="var(--washB)" o={0.34} />
          <Wash d={blob(620, 150, 120, 80, seed + 9)} color="var(--washC)" o={0.28} />
        </g>
        <Range from={[70, 90]} to={[240, 70]} n={4} seed={seed} s={15} />
        <Forest cx={690} cy={580} rx={50} ry={22} n={6} seed={seed + 3} s={10} />
        <Forest cx={120} cy={590} rx={40} ry={20} n={4} seed={seed + 7} s={9} />
        <Motif slug={slug} />
      </Frame>
    </svg>
  );
}
