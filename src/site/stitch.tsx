/**
 * The embroidery is the frame, never the picture: stitched rules, dividers,
 * the mats that real screenshots are sewn onto, knots, and a few stitched words.
 * The one motion: a mat's border and a divider sew themselves in when they
 * scroll into view. CSS turns that off for reduced motion.
 */
import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from "react";
import styles from "./embroidery.module.css";

export const thread = {
  madder: "#a3412d",
  woad: "#3f5f86",
  weld: "#c29632",
  walnut: "#5a4331",
  green: "#687a45",
  plum: "#6a4668",
  cream: "#f6f0e1",
  night: "#2c3f5f",
} as const;

const SHADOW = "rgba(59, 43, 31, 0.3)";

function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

/** A DOM-safe id from useId (React's ids contain characters url(#…) dislikes). */
export function useSvgId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Flip to true the first time the element is mostly in view. */
export function useSewIn<T extends Element>() {
  const ref = useRef<T>(null);
  const [sewn, setSewn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || sewn) return;
    if (typeof IntersectionObserver === "undefined") {
      setSewn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSewn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sewn]);
  return [ref, sewn] as const;
}

/** A small fixed SVG surface that sews in (the name rule under the h1). */
export function Cloth({ viewBox, className, children }: { viewBox: string; className?: string; children: ReactNode }) {
  const [ref, sewn] = useSewIn<SVGSVGElement>();
  return (
    <svg ref={ref} viewBox={viewBox} className={[styles.cloth, className].filter(Boolean).join(" ")} data-sewn={sewn ? "" : undefined} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** Running stitch along a path, revealed stitch by stitch. */
export function Run({ d, c, i = 0, w = 1.8, dash = [3.2, 3.4] }: { d: string; c: string; i?: number; w?: number; dash?: [number, number] }) {
  const id = useSvgId("run");
  return (
    <g>
      <mask id={id} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">
        <path d={d} pathLength={1} className={styles.draw} style={{ "--i": i } as CSSProperties} fill="none" stroke="#fff" strokeWidth={w + 8} strokeLinecap="round" />
      </mask>
      <g mask={`url(#${id})`} fill="none" strokeLinecap="round" strokeDasharray={dash.join(" ")}>
        <path d={d} stroke={SHADOW} strokeWidth={w} transform="translate(0.45 0.65)" />
        <path d={d} stroke={c} strokeWidth={w} />
        <path d={d} stroke="rgba(255,249,234,.4)" strokeWidth={w * 0.34} transform="translate(-0.25 -0.3)" />
      </g>
    </g>
  );
}

/** French knots: small raised bumps with a radial sheen and a cast shadow. */
export function Knots({ pts, c, r = 2 }: { pts: [number, number][]; c: string; r?: number }) {
  const g = useSvgId("knot");
  return (
    <g>
      <defs>
        <radialGradient id={g} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor={mix(c, "#fff8e6", 0.55)} />
          <stop offset="0.45" stopColor={c} />
          <stop offset="1" stopColor={mix(c, "#1c140d", 0.4)} />
        </radialGradient>
      </defs>
      {pts.map(([x, y], n) => (
        <g key={n}>
          <ellipse cx={x + r * 0.28} cy={y + r * 0.42} rx={r * 1.05} ry={r * 0.95} fill="rgba(50,35,22,.3)" />
          <circle cx={x} cy={y} r={r} fill={`url(#${g})`} />
        </g>
      ))}
    </g>
  );
}

/** A single knot as an inline bullet. */
export function Knot({ c, className }: { c: string; className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true" focusable="false">
      <Knots c={c} r={3.4} pts={[[6, 6]]} />
    </svg>
  );
}

/** Words set in Alegreya but drawn as satin thread with a stem outline. */
export function StitchedWords({
  text,
  c,
  size = 28,
  width,
  className,
  italic = false,
  center = false,
}: {
  center?: boolean;
  text: string;
  c: string;
  size?: number;
  width: number;
  className?: string;
  italic?: boolean;
}) {
  const pat = useSvgId("words");
  const h = size * 1.35;
  return (
    <svg viewBox={`0 0 ${width} ${h}`} className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={pat} width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <rect width="2.2" height="2.2" fill={c} opacity="0.5" />
          <rect width="1.3" height="2.2" fill={c} />
          <rect width="0.4" height="2.2" fill="rgba(255,249,234,.35)" />
        </pattern>
      </defs>
      <g fontFamily="Alegreya, Georgia, serif" fontSize={size} fontStyle={italic ? "italic" : undefined} fontWeight={600} textAnchor={center ? "middle" : undefined}>
        <text x={center ? width / 2 + 0.6 : 2.6} y={size + 1} fill={SHADOW} stroke={SHADOW} strokeWidth="0.5">
          {text}
        </text>
        <text x={center ? width / 2 : 2} y={size} fill={`url(#${pat})`} stroke={c} strokeWidth="0.55" strokeLinejoin="round">
          {text}
        </text>
      </g>
    </svg>
  );
}

/** A running-stitch border that sews a label or mat onto the cloth, sewn in on view. */
export function LabelStitch({ c = thread.madder }: { c?: string }) {
  const [ref, sewn] = useSewIn<SVGSVGElement>();
  const m = useSvgId("mat");
  const r = { x: 0, y: 0, width: "100%", height: "100%" };
  return (
    <svg ref={ref} className={`${styles.labelStitch} ${styles.cloth}`} data-sewn={sewn ? "" : undefined} aria-hidden="true" focusable="false">
      <mask id={m}>
        <rect {...r} rx="3" pathLength={1} className={styles.draw} fill="none" stroke="#fff" strokeWidth="8" />
      </mask>
      <g mask={`url(#${m})`} fill="none">
        <rect {...r} rx="3" stroke="rgba(59,43,31,.3)" strokeWidth="1.6" strokeDasharray="5 4" transform="translate(0.6 0.8)" />
        <rect {...r} rx="3" stroke={c} strokeWidth="1.6" strokeDasharray="5 4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export type DividerPattern = "running" | "chain" | "cross" | "satin" | "knots" | "long";

/** A stitched divider between sections; each section gets its own pattern. */
export function Divider({ pattern, c = thread.madder, className }: { pattern: DividerPattern; c?: string; className?: string }) {
  const [ref, sewn] = useSewIn<SVGSVGElement>();
  const p = useSvgId("div");
  const m = useSvgId("divm");
  const motif = (col: string): Record<DividerPattern, ReactNode> => ({
    running: <line x1="2" y1="11" x2="12" y2="11" stroke={col} strokeWidth="1.7" strokeLinecap="round" />,
    chain: <path d="M2 11c0-4 10-4 10 0s-10 4-10 0" fill="none" stroke={col} strokeWidth="1.4" />,
    cross: (
      <g stroke={col} strokeWidth="1.5" strokeLinecap="round">
        <line x1="4" y1="7" x2="10" y2="15" />
        <line x1="10" y1="7" x2="4" y2="15" />
      </g>
    ),
    satin: (
      <g stroke={col} strokeWidth="1.3" strokeLinecap="round">
        <line x1="3" y1="15" x2="6" y2="7" />
        <line x1="5.4" y1="15" x2="8.4" y2="7" />
        <line x1="7.8" y1="15" x2="10.8" y2="7" />
      </g>
    ),
    knots: <circle cx="7" cy="11" r="2" fill={col} />,
    long: <line x1="1" y1="11" x2="13" y2="11" stroke={col} strokeWidth="1.7" strokeLinecap="round" />,
  });
  const tile = pattern === "knots" ? 22 : pattern === "long" ? 15 : 14;
  return (
    <svg ref={ref} className={[styles.divider, styles.cloth, className].filter(Boolean).join(" ")} data-sewn={sewn ? "" : undefined} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={p} width={tile} height="22" patternUnits="userSpaceOnUse">
          <g transform="translate(0.5 0.7)">{motif("rgba(59,43,31,.3)")[pattern]}</g>
          {motif(c)[pattern]}
        </pattern>
      </defs>
      <mask id={m}>
        <line x1="0" y1="11" x2="100%" y2="11" pathLength={1} className={styles.draw} stroke="#fff" strokeWidth="30" />
      </mask>
      <rect x="0" y="0" width="100%" height="22" fill={`url(#${p})`} mask={`url(#${m})`} />
    </svg>
  );
}
