/**
 * The objects on the desk. Each is drawn in its own local space with (0, 0) at
 * the point where it rests on the desk, so the same drawing is placed small on
 * the home desk and scaled up on its project page. Light always comes from the
 * window behind the desk: top faces are warm, front faces lean blue-grey.
 */
import type { ReactElement } from "react";

export const C = {
  paper: "#f5ead8",
  cream: "#f1e4ca",
  ink: "#3a3140",
  honey: "#f4c77e",
  apricot: "#e9a071",
  rose: "#cf9690",
  roseDeep: "#a8625f",
  sage: "#9aab88",
  sageDeep: "#6f8566",
  wood: "#8a5b3e",
  woodDark: "#6a4330",
  woodLight: "#b3825a",
  blue: "#77809a",
  blueDeep: "#5d6480",
  shadow: "#4a4d6a",
};

type P = [number, number];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const pts = (...p: P[]) => p.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
/** Point inside a quad (p0 front-left, p1 front-right, p2 back-right, p3 back-left). */
const quadAt = (q: [P, P, P, P], u: number, v: number): P =>
  lerp(lerp(q[0], q[1], u), lerp(q[3], q[2], u), v);
const subQuad = (q: [P, P, P, P], u0: number, u1: number, v0: number, v1: number) =>
  pts(quadAt(q, u0, v0), quadAt(q, u1, v0), quadAt(q, u1, v1), quadAt(q, u0, v1));

/** Soft cast shadow, falling toward the viewer and a little right. */
export function Shadow({ cx = 10, cy = 4, rx, ry = 9, o = 0.32 }: { cx?: number; cy?: number; rx: number; ry?: number; o?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.shadow} opacity={o} filter="url(#ws-blur)" />;
}

/** Phren: a sage notebook with a few paper tabs and an elastic band. */
export function Notebook() {
  const top: [P, P, P, P] = [[-84, -12], [84, -12], [70, -60], [-72, -60]];
  return (
    <g>
      <Shadow rx={96} ry={11} cx={14} cy={3} />
      <polygon points={pts([78, -24], [96, -25], [92, -34], [75, -33])} fill={C.honey} />
      <polygon points={pts([74, -38], [91, -40], [88, -48], [72, -47])} fill={C.rose} />
      <polygon points={pts([70, -50], [85, -52], [83, -58], [69, -57])} fill={C.cream} />
      <polygon points={pts([-82, -12], [82, -12], [80, 0], [-80, 0])} fill="#e6d6b8" />
      <path d="M-80 -4 H80 M-81 -8 H81" stroke="#c9b797" strokeWidth={0.8} />
      <polygon points={pts(...top)} fill="url(#ws-sage)" />
      <polygon points={subQuad(top, 0, 1, 0.55, 1)} fill={C.honey} opacity={0.22} />
      <polygon points={pts([-84, -12], [-72, -60], [-66, -60], [-77, -12])} fill={C.sageDeep} opacity={0.55} />
      <path d="M60 -12 L50 -60 M60 -12 V0" stroke={C.roseDeep} strokeWidth={3} strokeLinecap="round" />
      <polygon points={subQuad(top, 0.22, 0.58, 0.32, 0.62)} fill={C.cream} opacity={0.75} />
    </g>
  );
}

/** OGrid: one sheet of graph paper, a few cells shaded as if selected. */
export function GraphPaper() {
  const q: [P, P, P, P] = [[-96, -2], [88, 4], [80, -46], [-84, -52]];
  const lines: string[] = [];
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const a = quadAt(q, t, 0);
    const b = quadAt(q, t, 1);
    lines.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
  }
  for (let j = 1; j < 6; j++) {
    const t = j / 6;
    const a = quadAt(q, 0, t);
    const b = quadAt(q, 1, t);
    lines.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
  }
  return (
    <g>
      <Shadow rx={94} ry={7} cx={8} cy={2} o={0.22} />
      <polygon points={pts(...q)} fill="#f7f0e1" />
      <polygon points={subQuad(q, 3 / 12, 7 / 12, 2 / 6, 4 / 6)} fill="#9ec3a4" opacity={0.45} />
      <polygon points={subQuad(q, 7 / 12, 8 / 12, 2 / 6, 3 / 6)} fill="#9ec3a4" opacity={0.25} />
      <path d={lines.join(" ")} stroke="#98acb4" strokeWidth={0.8} opacity={0.7} />
      <polygon points={subQuad(q, 3 / 12, 7 / 12, 2 / 6, 4 / 6)} fill="none" stroke="#5f8f6c" strokeWidth={1.4} />
      <polygon points={pts([70, -45], [80, -46], [77, -36])} fill="#e7dcc6" />
    </g>
  );
}

/** Atlas: a small stack of folders with tabs. */
export function Folders() {
  const colors = ["#c99b76", "#8fb3aa", "#e5cea0"];
  return (
    <g>
      <Shadow rx={88} ry={10} cx={12} cy={3} />
      {colors.map((c, i) => {
        const dy = -i * 7;
        const dx = [0, 5, -3][i];
        const top: [P, P, P, P] = [[-78 + dx, -6 + dy], [74 + dx, -6 + dy], [64 + dx, -44 + dy], [-70 + dx, -44 + dy]];
        const tabX = [-40, 12, -10][i];
        return (
          <g key={c}>
            <polygon points={pts([tabX + dx, -44 + dy], [tabX + 30 + dx, -44 + dy], [tabX + 27 + dx, -51 + dy], [tabX + 4 + dx, -51 + dy])} fill={c} />
            <polygon points={pts([-78 + dx, -6 + dy], [74 + dx, -6 + dy], [74 + dx, 1 + dy], [-78 + dx, 1 + dy])} fill={c} />
            <rect x={-78 + dx} y={-6 + dy} width={152} height={7} fill={C.blueDeep} opacity={0.3} />
            <polygon points={pts(...top)} fill={c} />
            {i === 1 && <polygon points={pts([60 + dx, -12 + dy], [86 + dx, -14 + dy], [80 + dx, -34 + dy], [56 + dx, -32 + dy])} fill={C.cream} />}
          </g>
        );
      })}
      <polygon points={pts([-70, -58], [66, -58], [60, -40], [-62, -40])} fill={C.honey} opacity={0.18} />
    </g>
  );
}

/** Intranet ERP (worn) and Intrapath (new): an upright ring binder seen spine-on. */
export function Binder({ worn = true }: { worn?: boolean }) {
  const spine = worn ? "url(#ws-binder-old)" : "url(#ws-binder-new)";
  const side = worn ? "#57392e" : "#9c5a60";
  const edge = worn ? "#c09078" : "#f0c3c0";
  return (
    <g>
      <Shadow rx={46} ry={9} cx={16} cy={3} />
      <polygon points={pts([-30, -4], [-22, 0], [-22, -152], [-30, -148])} fill={side} />
      <polygon points={pts([-22, -152], [22, -152], [16, -158], [-28, -158])} fill={worn ? "#e2d2b4" : "#f4ead8"} />
      <rect x={-22} y={-152} width={44} height={152} rx={3} fill={spine} />
      {worn ? (
        <path d="M-21 -150 V-2 M21 -140 V-110 M21 -60 V-4" stroke={edge} strokeWidth={2.2} opacity={0.55} strokeLinecap="round" />
      ) : (
        <path d="M21 -150 V-2" stroke={C.honey} strokeWidth={2} opacity={0.6} />
      )}
      <rect x={-14} y={-130} width={28} height={46} rx={2} fill={worn ? "#e3d5b9" : "#fbf3e4"} opacity={worn ? 0.9 : 1} />
      <path d="M-9 -118 H9 M-9 -110 H5" stroke={worn ? "#9b8a74" : "#b79a98"} strokeWidth={1.4} />
      <circle cx={0} cy={-32} r={7} fill={worn ? "#3e2a24" : "#6e4048"} stroke={edge} strokeWidth={1.5} />
      {worn && <path d="M-22 -70 q8 4 4 14" stroke="#5e3e33" strokeWidth={1.2} fill="none" opacity={0.6} />}
    </g>
  );
}

/** Intrapath: the new binder standing beside the old one. */
export function BinderPair() {
  return (
    <g>
      <g transform="translate(-34 -4) scale(0.96)"><Binder worn /></g>
      <g transform="translate(30 0)"><Binder worn={false} /></g>
    </g>
  );
}

/** LiveMCP: a small pad controller. */
export function PadController() {
  const top: [P, P, P, P] = [[-72, -14], [72, -14], [62, -52], [-62, -52]];
  const pads: ReactElement[] = [];
  const lit = new Set([1, 6, 11, 12]);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const i = r * 4 + c;
      const u0 = 0.08 + c * 0.215;
      const v0 = 0.12 + r * 0.2;
      pads.push(
        <polygon key={i} points={subQuad(top, u0, u0 + 0.17, v0, v0 + 0.15)} fill={lit.has(i) ? C.honey : "#a9c5d3"} opacity={lit.has(i) ? 0.95 : 0.85} />,
      );
    }
  }
  return (
    <g>
      <Shadow rx={82} ry={10} cx={12} cy={3} />
      <polygon points={pts([-72, -14], [72, -14], [72, 0], [-72, 0])} fill="#4f5570" />
      <polygon points={pts(...top)} fill="#6a7190" />
      <polygon points={subQuad(top, 0, 1, 0.7, 1)} fill={C.honey} opacity={0.15} />
      {pads}
    </g>
  );
}

/** m4l-builder: a small hardware box with knobs, a screen, and a patch cable. */
export function HardwareBox({ wave = "M-46 -55 q7 -10 14 0 t14 0 t14 0 t14 0" }: { wave?: string }) {
  return (
    <g>
      <Shadow rx={78} ry={11} cx={14} cy={4} />
      <polygon points={pts([-62, -78], [62, -78], [54, -92], [-54, -92])} fill="#dcae7c" />
      <rect x={-62} y={-78} width={124} height={78} rx={4} fill="url(#ws-amber)" />
      <rect x={-50} y={-68} width={58} height={26} rx={3} fill="#3f4660" />
      <path d={wave} stroke={C.honey} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <circle cx={36} cy={-52} r={15} fill="#8a5a36" opacity={0.5} />
      <circle cx={34} cy={-54} r={13} fill={C.cream} />
      <path d="M34 -54 L42 -63" stroke={C.ink} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={-30} cy={-22} r={8} fill={C.cream} />
      <path d="M-30 -22 L-34 -29" stroke={C.ink} strokeWidth={1.8} strokeLinecap="round" />
      {[4, 22, 42].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-20} r={5} fill="#d6b58c" />
          <circle cx={x} cy={-20} r={2.8} fill="#2e2a36" />
        </g>
      ))}
      <path d="M4 -20 C0 30, 50 32, 42 -20" stroke={C.roseDeep} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Mina: a phone on a little wooden stand, a moon on its screen. */
export function PhoneStand({ glow = 0 }: { glow?: number }) {
  return (
    <g>
      <Shadow rx={40} ry={8} cx={12} cy={3} />
      {glow > 0 && <ellipse cx={0} cy={-58} rx={60} ry={70} fill="#a9bde8" opacity={0.25 * glow} filter="url(#ws-blur-lg)" />}
      <polygon points={pts([-10, -8], [10, -8], [4, -60], [-4, -60])} fill={C.woodDark} />
      <g transform="rotate(-5 0 -8)">
        <rect x={-23} y={-100} width={46} height={92} rx={8} fill="#3b3947" />
        <rect x={-19} y={-95} width={38} height={82} rx={5} fill="url(#ws-night-screen)" />
        <circle cx={0} cy={-60} r={10} fill="#f3e6c4" />
        <circle cx={5} cy={-64} r={9} fill="#2b3456" />
        <circle cx={-10} cy={-80} r={0.9} fill="#f3e6c4" />
        <circle cx={11} cy={-44} r={0.8} fill="#f3e6c4" opacity={0.8} />
      </g>
      <polygon points={pts([-28, 0], [28, 0], [24, -10], [-24, -10])} fill={C.wood} />
      <polygon points={pts([-24, -10], [24, -10], [22, -13], [-22, -13])} fill={C.woodLight} />
    </g>
  );
}

/** Basis: a closed quarter-bound ledger with a pencil on it. */
export function Ledger() {
  const top: [P, P, P, P] = [[-90, -16], [90, -16], [76, -66], [-78, -66]];
  return (
    <g>
      <Shadow rx={100} ry={12} cx={14} cy={4} />
      <polygon points={pts([-88, -16], [88, -16], [86, 0], [-86, 0])} fill="#e5d6b8" />
      <path d="M-86 -5 H86 M-87 -10 H87" stroke="#c7b493" strokeWidth={0.8} />
      <polygon points={pts(...top)} fill="url(#ws-ledger)" />
      <polygon points={pts([-90, -16], [-78, -66], [-60, -66], [-70, -16])} fill="#7a4f38" />
      <polygon points={pts([90, -16], [74, -16], [86, -30])} fill="#7a4f38" />
      <polygon points={subQuad(top, 0.36, 0.64, 0.42, 0.66)} fill={C.cream} opacity={0.8} />
      <polygon points={subQuad(top, 0, 1, 0.6, 1)} fill={C.honey} opacity={0.16} />
      <g transform="translate(-30 -34) rotate(-9)">
        <ellipse cx={46} cy={9} rx={58} ry={3.5} fill={C.shadow} opacity={0.35} />
        <rect x={-16} y={-3.2} width={7} height={6.4} rx={2} fill="#d69c95" />
        <rect x={-9} y={-3.2} width={9} height={6.4} fill="#bdb6a6" />
        <rect x={0} y={-3.2} width={90} height={6.4} fill="#e6b65c" />
        <rect x={0} y={-3.2} width={90} height={2.2} fill="#f3d18b" />
        <polygon points={pts([90, -3.2], [104, 0], [90, 3.2])} fill="#e3c39a" />
        <polygon points={pts([100, -0.9], [104, 0], [100, 0.9])} fill={C.ink} />
      </g>
    </g>
  );
}

/** EMV: an old card-catalog drawer, cards standing inside. */
export function FilingDrawer() {
  return (
    <g>
      <Shadow rx={84} ry={11} cx={14} cy={4} />
      <polygon points={pts([-70, -70], [70, -70], [60, -98], [-60, -98])} fill="#4f3528" />
      {[0, 1, 2, 3, 4].map((i) => (
        <polygon key={i} points={pts([-54 + i * 2, -78 - i * 4], [54 - i * 2, -78 - i * 4], [52 - i * 2, -90 - i * 4], [-52 + i * 2, -90 - i * 4])} fill={i === 2 ? "#dfe0b0" : C.cream} opacity={0.95} />
      ))}
      <polygon points={pts([10, -90], [34, -90], [32, -100], [12, -100])} fill="#b9c27f" />
      <rect x={-70} y={-70} width={140} height={70} rx={3} fill="#9a6b48" />
      <rect x={-60} y={-62} width={120} height={54} rx={2} fill="none" stroke="#7e5539" strokeWidth={2} />
      <rect x={-17} y={-56} width={34} height={15} rx={1.5} fill="none" stroke="#c9a45c" strokeWidth={2} />
      <rect x={-14} y={-53} width={28} height={9} fill={C.cream} />
      <rect x={-18} y={-32} width={36} height={8} rx={4} fill="#c9a45c" />
      <path d="M-70 -70 H70" stroke={C.honey} strokeWidth={2} opacity={0.5} />
    </g>
  );
}

/** Equipment Tracker: a wrench with a paper tag tied to it. */
export function TaggedTool() {
  return (
    <g>
      <Shadow rx={92} ry={9} cx={10} cy={2} o={0.26} />
      <mask id="ws-wrench-mask">
        <rect x={-120} y={-80} width={260} height={120} fill="#fff" />
        <rect x={68} y={-29} width={30} height={12} fill="#000" transform="rotate(-10 68 -23)" />
        <circle cx={-70} cy={-12} r={6} fill="#000" />
      </mask>
      <g mask="url(#ws-wrench-mask)" transform="rotate(-6)">
        <rect x={-72} y={-18} width={140} height={13} rx={6.5} fill="url(#ws-steel)" />
        <circle cx={70} cy={-18} r={17} fill="url(#ws-steel)" />
        <circle cx={-70} cy={-12} r={13} fill="url(#ws-steel)" />
      </g>
      <path d="M-74 -18 C-86 -12, -92 0, -84 12" stroke="#b88a72" strokeWidth={1.4} fill="none" />
      <g transform="translate(-84 12) rotate(14)">
        <polygon points={pts([-8, 0], [8, 0], [14, 6], [14, 40], [-14, 40], [-14, 6])} fill={C.cream} />
        <circle cx={0} cy={6} r={2.4} fill="#c9b99a" />
        <path d="M-8 18 H8 M-8 25 H4" stroke="#8aa9b0" strokeWidth={1.4} />
      </g>
    </g>
  );
}

/** Garden Sensor Network: a potted plant with a small sensor on a stake. */
export function PottedPlant() {
  const leaves: [number, number, string][] = [
    [-64, 50, "#859a74"],
    [-38, 62, C.sage],
    [-12, 70, "#a7b893"],
    [14, 66, "#8a9f79"],
    [40, 58, C.sage],
    [66, 48, "#7f9470"],
  ];
  return (
    <g>
      <Shadow rx={52} ry={9} cx={14} cy={3} />
      {leaves.map(([rot, len, c]) => (
        <g key={rot} transform={`translate(0 -66) rotate(${rot})`}>
          <path d={`M0 0 C16 ${-len * 0.25}, 16 ${-len * 0.8}, 0 ${-len} C-16 ${-len * 0.8}, -16 ${-len * 0.25}, 0 0Z`} fill={c} />
          <path d={`M0 -4 L0 ${-len + 8}`} stroke="#c9d3b6" strokeWidth={1.2} opacity={0.6} />
        </g>
      ))}
      <polygon points={pts([-34, -60], [34, -60], [26, 0], [-26, 0])} fill="url(#ws-terracotta)" />
      <rect x={-38} y={-70} width={76} height={13} rx={3} fill="#d08a68" />
      <ellipse cx={0} cy={-69} rx={32} ry={3} fill="#5a4034" />
      <path d="M24 -68 V-112" stroke="#8d8a86" strokeWidth={2.5} />
      <rect x={14} y={-126} width={20} height={15} rx={2} fill="#5e7a6a" />
      <circle cx={29} cy={-119} r={5} fill="#b9e08f" opacity={0.35} filter="url(#ws-blur)" />
      <circle cx={29} cy={-119} r={1.8} fill="#cdeba5" />
    </g>
  );
}

/** Retrofit: an old, thick-bezelled tablet showing a form. */
export function OldTablet() {
  const top: [P, P, P, P] = [[-80, -8], [80, -8], [68, -70], [-68, -70]];
  const rows: ReactElement[] = [];
  for (let i = 0; i < 4; i++) {
    const v = 0.72 - i * 0.18;
    rows.push(<polygon key={i} points={subQuad(top, 0.3, 0.72, v - 0.07, v)} fill="#f4f1e8" stroke="#a8b4b0" strokeWidth={0.8} />);
    rows.push(<polygon key={`l${i}`} points={subQuad(top, 0.2, 0.27, v - 0.06, v - 0.01)} fill="#9aa8a4" />);
  }
  return (
    <g>
      <Shadow rx={90} ry={10} cx={12} cy={3} />
      <polygon points={pts([-80, -8], [80, -8], [80, 0], [-80, 0])} fill="#34343d" />
      <polygon points={pts(...top)} fill="#4b4b56" />
      <polygon points={subQuad(top, 0.12, 0.88, 0.12, 0.88)} fill="#d6ded9" />
      {rows}
      <circle cx={quadAt(top, 0.94, 0.5)[0]} cy={quadAt(top, 0.94, 0.5)[1]} r={3.5} fill="none" stroke="#6c6c78" strokeWidth={1.2} />
      <polygon points={subQuad(top, 0, 1, 0.65, 1)} fill={C.honey} opacity={0.12} />
    </g>
  );
}

/** Mutter: a headset resting on the desk. */
export function Headset() {
  return (
    <g>
      <Shadow rx={90} ry={10} cx={10} cy={3} />
      <path d="M-62 -26 C-66 -118, 66 -118, 62 -26" stroke="#6f71a3" strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M-50 -58 C-44 -100, 44 -100, 50 -58" stroke="#9496c4" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M-60 -10 C-56 8, -30 14, -12 8" stroke="#4a4c70" strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={-8} cy={7} rx={7} ry={5} fill="#4a4c70" />
      {[-62, 62].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={-22} rx={18} ry={25} fill="#5b5d8e" />
          <ellipse cx={x + (x < 0 ? 5 : -5)} cy={-22} rx={11} ry={18} fill="#8284b6" />
        </g>
      ))}
      <path d="M-40 -96 C-20 -106, 20 -106, 40 -96" stroke={C.honey} strokeWidth={2} fill="none" opacity={0.5} />
    </g>
  );
}

/** AlphaLens: a small chart pinned to the wall. Rests on its bottom edge. */
export function PinnedChart() {
  return (
    <g>
      <rect x={-54} y={-116} width={120} height={112} fill={C.shadow} opacity={0.22} filter="url(#ws-blur)" transform="rotate(2)" />
      <g transform="rotate(-2)">
        <rect x={-60} y={-120} width={120} height={112} fill="#f6eddb" />
        <path d="M-46 -24 H48 M-46 -24 V-100" stroke="#b8ab96" strokeWidth={1.2} />
        <path d="M-46 -40 L-30 -48 L-18 -44 L-4 -62 L8 -56 L22 -78 L34 -72 L48 -92 L48 -24 L-46 -24 Z" fill={C.honey} opacity={0.35} />
        <path d="M-46 -40 L-30 -48 L-18 -44 L-4 -62 L8 -56 L22 -78 L34 -72 L48 -92" stroke="#c9822f" strokeWidth={2.4} fill="none" strokeLinejoin="round" />
        <circle cx={0} cy={-112} r={5} fill={C.roseDeep} />
        <circle cx={-1.5} cy={-113.5} r={1.6} fill="#f2c9c2" />
      </g>
    </g>
  );
}

/** Shared gradients and filters, rendered once inside each scene's svg. */
export function SceneDefs() {
  return (
    <defs>
      <filter id="ws-blur" x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="ws-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="16" />
      </filter>
      <filter id="ws-wobble" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="1.8" />
      </filter>
      <filter id="ws-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.25  0 0 0 0.09 0" />
      </filter>
      <linearGradient id="ws-sage" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#879a78" />
        <stop offset="1" stopColor="#adbb97" />
      </linearGradient>
      <linearGradient id="ws-ledger" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#4c7169" />
        <stop offset="1" stopColor="#6b9186" />
      </linearGradient>
      <linearGradient id="ws-amber" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d49a60" />
        <stop offset="1" stopColor="#a8703f" />
      </linearGradient>
      <linearGradient id="ws-binder-old" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7c4d40" />
        <stop offset="0.7" stopColor="#8e5c4b" />
        <stop offset="1" stopColor="#a8765f" />
      </linearGradient>
      <linearGradient id="ws-binder-new" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c27479" />
        <stop offset="0.7" stopColor="#d6898c" />
        <stop offset="1" stopColor="#e8a7a4" />
      </linearGradient>
      <linearGradient id="ws-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c5cbd6" />
        <stop offset="1" stopColor="#838ca0" />
      </linearGradient>
      <linearGradient id="ws-terracotta" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#b86d50" />
        <stop offset="0.6" stopColor="#c98160" />
        <stop offset="1" stopColor="#dd9d78" />
      </linearGradient>
      <linearGradient id="ws-night-screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b3456" />
        <stop offset="1" stopColor="#424c74" />
      </linearGradient>
    </defs>
  );
}
