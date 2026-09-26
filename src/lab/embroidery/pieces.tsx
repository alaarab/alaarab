/**
 * Frames (hoop, panel, long panel) and the three bespoke showcase pieces.
 */
import { type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode, useRef, useState } from "react";
import { EmblemArt, borderRepeats, wave } from "./emblems";
import { Cloth, Knots, LinenFill, Run, Satin, Stem, thread as t, useIsSewn, useSvgId } from "./stitch";
import type { Frame } from "./themes";
import { LabelStitch } from "./Home";
import styles from "./embroidery.module.css";

const WOOD = "#b58d5e";
const WOOD_DARK = "#8e6a41";

/** A wooden embroidery hoop around a circle of linen, 400 x 420 units. */
function HoopUnder({ ground }: { ground: string }) {
  const id = useSvgId("hoop");
  const circle = "M28 220a172 172 0 1 0 344 0a172 172 0 1 0-344 0Z";
  return (
    <g>
      <defs>
        <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <ellipse cx="204" cy="228" rx="186" ry="186" fill="rgba(59,43,31,.16)" filter={`url(#${id}-soft)`} />
      <LinenFill d={circle} ground={ground} id={id} />
      {/* The cloth is pulled a little darker where the hoop grips it. */}
      <circle cx="200" cy="220" r="168" fill="none" stroke="rgba(59,43,31,.12)" strokeWidth="10" filter={`url(#${id}-soft)`} />
      <circle cx="200" cy="220" r="180" fill="none" stroke={WOOD_DARK} strokeWidth="16" />
      <circle cx="200" cy="220" r="180" fill="none" stroke={WOOD} strokeWidth="12" />
      <circle cx="200" cy="220" r="176" fill="none" stroke="rgba(255,240,214,.45)" strokeWidth="1.4" />
      <circle cx="200" cy="220" r="185" fill="none" stroke="rgba(59,43,31,.25)" strokeWidth="1" />
      {/* Clamp and screw. */}
      <rect x="186" y="24" width="28" height="22" rx="3" fill={WOOD} stroke={WOOD_DARK} strokeWidth="1.5" />
      <rect x="194" y="10" width="12" height="16" rx="2" fill="#9a8c78" stroke="#6f6456" strokeWidth="1.2" />
      <line x1="196" y1="14" x2="204" y2="14" stroke="#6f6456" strokeWidth="1" />
      <line x1="196" y1="18" x2="204" y2="18" stroke="#6f6456" strokeWidth="1" />
    </g>
  );
}

/** A linen panel with a running-stitch border, w x h units. */
function PanelUnder({ w, h, ground }: { w: number; h: number; ground: string }) {
  const id = useSvgId("panel");
  const rect = `M8 8H${w - 8}V${h - 8}H8Z`;
  return (
    <g>
      <defs>
        <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect x="12" y="14" width={w - 16} height={h - 16} fill="rgba(59,43,31,.16)" filter={`url(#${id}-soft)`} />
      <LinenFill d={rect} ground={ground} id={id} />
      <rect x="22" y="22" width={w - 44} height={h - 44} fill="none" stroke="rgba(59,43,31,.3)" strokeWidth="1.6" strokeDasharray="5 4" transform="translate(.5 .7)" />
      <rect x="22" y="22" width={w - 44} height={h - 44} fill="none" stroke={t.walnut} strokeWidth="1.6" strokeDasharray="5 4" strokeLinecap="round" />
    </g>
  );
}

/** A project's piece in its frame: bespoke for the showcases, the emblem enlarged otherwise. */
export function Piece({ slug, frame, ground, label }: { slug: string; frame: Frame; ground: string; label: string }) {
  if (slug === "phren") return <PhrenNet ground={ground} label={label} />;
  if (slug === "mina") return <MinaNight ground={ground} label={label} />;
  if (slug === "intranet-erp") return <LongBorder ground={ground} label={label} />;
  if (frame === "panel") {
    return (
      <Cloth viewBox="0 0 400 400" className={styles.pieceArt} label={label} under={<PanelUnder w={400} h={400} ground={ground} />}>
        <g transform="translate(56 56) scale(2.4)">
          <EmblemArt slug={slug} />
        </g>
      </Cloth>
    );
  }
  return (
    <Cloth viewBox="0 0 400 420" className={styles.pieceArt} label={label} under={<HoopUnder ground={ground} />}>
      <g transform="translate(86 106) scale(1.9)">
        <EmblemArt slug={slug} />
      </g>
    </Cloth>
  );
}

/** Catmull-Rom through points, as cubic Béziers. */
function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let k = 0; k < pts.length - 1; k++) {
    const p0 = pts[k - 1] ?? pts[k];
    const [x1, y1] = pts[k];
    const [x2, y2] = pts[k + 1];
    const p3 = pts[k + 2] ?? pts[k + 1];
    d += ` C${x1 + (x2 - p0[0]) / 6} ${y1 + (y2 - p0[1]) / 6} ${x2 - (p3[0] - x1) / 6} ${y2 - (p3[1] - y1) / 6} ${x2} ${y2}`;
  }
  return d;
}

/** Phren: a net of looped threads. Each knot is a remembered thing. */
function PhrenNet({ ground, label }: { ground: string; label: string }) {
  const K: [number, number][] = [
    [128, 150], [200, 112], [274, 146], [304, 222], [264, 296], [196, 322],
    [124, 292], [96, 214], [166, 196], [238, 200], [200, 262],
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    [0, 8], [1, 8], [1, 9], [2, 9], [3, 9], [4, 10], [5, 10], [6, 10], [7, 8], [8, 9], [9, 10], [10, 8],
  ];
  const loop = ([a, b]: number[], k: number) => {
    const [x1, y1] = K[a];
    const [x2, y2] = K[b];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const bow = (k % 2 ? 1 : -1) * len * 0.24;
    return `M${x1} ${y1} Q${mx - ((y2 - y1) / len) * bow} ${my + ((x2 - x1) / len) * bow} ${x2} ${y2}`;
  };
  // The thread that goes back: newest knot first, through the ones before it.
  const back = smooth([[236, 368], [220, 344], K[5], K[10], K[9], K[1], K[0], K[7], K[8], [180, 226]]);
  return (
    <Cloth viewBox="0 0 400 420" className={styles.pieceArt} label={label} under={<HoopUnder ground={ground} />}>
      {edges.map((e, k) => (
        <Stem key={k} c={t.woad} i={Math.floor(k / 3)} w={2.4} d={loop(e, k)} />
      ))}
      <Knots c={t.plum} i={7} r={7} pts={K} />
      <Run c={t.madder} i={8} w={2.6} dash={[6, 4]} d={back} />
    </Cloth>
  );
}

/** Mina: a small, quiet hoop. A moon, a few stars, a swaddled bundle. */
function MinaNight({ ground, label }: { ground: string; label: string }) {
  return (
    <Cloth viewBox="0 0 400 420" className={`${styles.pieceArt} ${styles.pieceSmall}`} label={label} under={<HoopUnder ground={ground} />}>
      <Satin
        c={t.cream}
        i={0}
        angle={70}
        gap={1.3}
        outline={t.night}
        outlineW={1.6}
        d="M252 92 A50 50 0 1 0 306 158 A38 38 0 1 1 252 92Z"
        box={[200, 90, 110, 110]}
      />
      <Knots c={t.weld} i={1} r={3} pts={[[120, 140], [158, 106], [318, 236], [140, 176], [330, 196]]} />
      <g transform="rotate(-10 214 276)">
        <Satin c={t.cream} i={2} angle={28} gap={1.3} outline={t.night} outlineW={1.2} d="M140 276a76 34 0 1 0 152 0a76 34 0 1 0-152 0Z" box={[140, 242, 152, 68]} />
        <Stem c={t.night} i={3} w={1.1} d="M190 245 Q206 276 196 308 M232 243 Q248 276 238 310" />
      </g>
      <Satin c={t.cream} i={3} angle={-24} gap={1.3} outline={t.night} outlineW={1.2} d="M104 282a30 30 0 1 0 60 0a30 30 0 1 0-60 0Z" box={[104, 252, 60, 60]} />
      <Stem c={t.night} i={4} w={1} d="M116 284a18 18 0 1 0 36 0a18 18 0 1 0-36 0" />
      <Run c={t.night} i={5} w={1} dash={[1.6, 1.6]} d="M126 284 q3 3 6 0 M138 284 q3 3 6 0" />
    </Cloth>
  );
}

/** Intranet: a long border, one repeat for each year it ran. */
function LongBorder({ ground, label }: { ground: string; label: string }) {
  return (
    <Cloth viewBox="0 0 780 240" className={`${styles.pieceArt} ${styles.pieceLong}`} label={label} under={<PanelUnder w={780} h={240} ground={ground} />}>
      <Stem c={t.walnut} i={0} w={2} d="M50 80H730 M50 160H730" />
      <Run c={t.walnut} i={1} w={1.4} dash={[2.4, 2.8]} d="M50 66H730 M50 174H730" />
      <Stem c={t.madder} i={2} w={2.6} d={borderRepeats(10, 50, 68, 92, 148)} />
      <Knots c={t.weld} i={3} r={3} pts={Array.from({ length: 10 }, (_, k): [number, number] => [84 + k * 68, 140])} />
    </Cloth>
  );
}

const MIN_H = 1;
const MAX_H = 8;

/** One vertical satin stitch of the wave; its height is restitched when the knob turns. */
function WaveStroke({ x, h, k }: { x: number; h: number; k: number }) {
  const sewn = useIsSewn();
  const style = { transform: `scaleY(${sewn ? h : 0})`, transitionDelay: `${k * 9}ms` } as CSSProperties;
  return (
    <g transform={`translate(${x} 100)`}>
      <g className={styles.waveStroke} style={style}>
        <line x1="0.8" y1="0" x2="0.8" y2="-1" stroke="rgba(59,43,31,.32)" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2="-1" stroke={t.madder} strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        <line x1="-0.6" y1="0" x2="-0.6" y2="-1" stroke="rgba(255,249,234,.42)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** m4l-builder: a stitched knob that really turns, and the wave it restitches. */
export function M4lPanel({ label }: { label: string }) {
  const [n, setN] = useState(3);
  const drag = useRef<{ y: number; n: number } | null>(null);
  const set = (v: number) => setN(Math.max(MIN_H, Math.min(MAX_H, Math.round(v))));

  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 2, PageDown: -2 };
    if (e.key in step) set(n + step[e.key]);
    else if (e.key === "Home") set(MIN_H);
    else if (e.key === "End") set(MAX_H);
    else return;
    e.preventDefault();
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, n };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) set(drag.current.n + (drag.current.y - e.clientY) / 18);
  };
  const onUp = () => {
    drag.current = null;
  };

  const angle = -135 + ((n - MIN_H) / (MAX_H - MIN_H)) * 270;
  const ticks = Array.from({ length: MAX_H }, (_, k): [number, number] => {
    const a = ((-135 + (k / (MAX_H - 1)) * 270) * Math.PI) / 180;
    return [80 + Math.sin(a) * 66, 80 - Math.cos(a) * 66];
  });
  const count = 112;
  const strokes = Array.from({ length: count }, (_, k) => ({ x: 14 + k * 4.1, h: wave(k / (count - 1), n, 2) * 58 }));

  return (
    <figure className={styles.m4lPanel} aria-label={label}>
      <div className={styles.m4lCloth}>
        <LabelStitch c={t.walnut} />
        <div
          className={styles.knob}
          role="slider"
          tabIndex={0}
          aria-label="Harmonics"
          aria-valuemin={MIN_H}
          aria-valuemax={MAX_H}
          aria-valuenow={n}
          aria-valuetext={`${n} harmonic${n === 1 ? "" : "s"}`}
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <Cloth viewBox="0 0 160 160" className={styles.knobArt}>
            <Knots c={t.walnut} i={2} r={2.6} pts={ticks} />
            <Satin c={t.weld} i={0} angle={-30} gap={1.6} outline={t.walnut} outlineW={2} d="M30 80a50 50 0 1 0 100 0a50 50 0 1 0-100 0Z" box={[30, 30, 100, 100]} />
            <g transform={`rotate(${angle} 80 80)`} className={styles.pointer}>
              <Stem c={t.madder} i={1} w={6} d="M80 78V40" />
            </g>
          </Cloth>
          <span className={styles.knobLabel}>
            Harmonics <span className={styles.knobValue}>{n}</span>
          </span>
        </div>
        <Cloth viewBox="0 0 480 200" className={styles.waveArt}>
          <Run c={t.walnut} i={0} w={1.4} dash={[3, 3.4]} d="M8 100H474" />
          {strokes.map((s, k) => (
            <WaveStroke key={k} x={s.x} h={s.h} k={k} />
          ))}
        </Cloth>
      </div>
      <figcaption className={styles.pieceCaption}>
        Turn the knob (drag, or use the arrow keys) and the wave is restitched with that many harmonics.
      </figcaption>
    </figure>
  );
}

/** Small emblem for previous/next links. */
export function MiniEmblem({ slug }: { slug: string }) {
  return (
    <Cloth viewBox="0 0 120 120" className={styles.miniEmblem} wobble={false}>
      <EmblemArt slug={slug} />
    </Cloth>
  );
}

export function EmptyHoop({ ground, children }: { ground: string; children?: ReactNode }) {
  return (
    <Cloth viewBox="0 0 400 420" className={`${styles.pieceArt} ${styles.pieceSmall}`} under={<HoopUnder ground={ground} />}>
      <Run c={t.madder} i={0} w={1.8} dash={[5, 4]} d="M120 250 C160 200 200 290 240 230 C262 198 290 214 300 240" />
      {children}
    </Cloth>
  );
}
