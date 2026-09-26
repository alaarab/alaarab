/**
 * Stitch primitives for the Embroidery direction. Everything is drawn as SVG
 * inside a <Cloth>, which owns the "sew in" state: until the cloth scrolls into
 * view every stitch is masked out, then each one is revealed along its own path
 * in order (the `i` prop), slowly. CSS turns the animation off for reduced motion.
 */
import {
  type CSSProperties,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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

const SHADOW = "rgba(59, 43, 31, 0.34)";
const SHEEN = "rgba(255, 249, 234, 0.42)";

/** A DOM-safe id from useId (React's ids contain characters url(#…) dislikes). */
export function useSvgId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

const Sewn = createContext(true);
/** True once the surrounding cloth has been sewn in. */
export const useIsSewn = () => useContext(Sewn);

/** Observe an element and flip to true the first time it is mostly visible. */
function useSewIn<T extends Element>() {
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
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sewn]);
  return [ref, sewn] as const;
}

interface ClothProps {
  viewBox: string;
  className?: string;
  children: ReactNode;
  /** Accessible description; omit for decorative pieces. */
  label?: string;
  /** Hand wobble on the thread edges. Off for tiny marks. */
  wobble?: boolean;
  style?: CSSProperties;
  /** Drawn beneath the stitches without wobble: a hoop, a panel, the cloth. */
  under?: ReactNode;
}

/** An SVG surface that sews its stitches in when it scrolls into view. */
export function Cloth({ viewBox, className, children, label, wobble = true, style, under }: ClothProps) {
  const [ref, sewn] = useSewIn<SVGSVGElement>();
  const wob = useSvgId("wob");
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={[styles.cloth, className].filter(Boolean).join(" ")}
      data-sewn={sewn ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={style}
    >
      {wobble && (
        <defs>
          <filter id={wob} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="1.4" />
          </filter>
        </defs>
      )}
      {under}
      <Sewn.Provider value={sewn}>
        <g filter={wobble ? `url(#${wob})` : undefined}>{children}</g>
      </Sewn.Provider>
    </svg>
  );
}

/** Reveal mask: a wide stroke drawn along `d` from start to end. */
function RevealMask({ id, d, width, i }: { id: string; d: string; width: number; i: number }) {
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">
      <path
        d={d}
        pathLength={1}
        className={styles.draw}
        style={{ "--i": i } as CSSProperties}
        fill="none"
        stroke="#fff"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </mask>
  );
}

interface LineProps {
  d: string;
  c: string;
  /** Order in which this stitch is sewn within its cloth. */
  i?: number;
  w?: number;
  opacity?: number;
}

/** Running stitch: evenly spaced stitches with a little linen between. */
export function Run({ d, c, i = 0, w = 1.8, opacity = 1, dash = [3.2, 3.4] }: LineProps & { dash?: [number, number] }) {
  const id = useSvgId("run");
  const da = dash.join(" ");
  return (
    <g opacity={opacity}>
      <RevealMask id={id} d={d} width={w + 8} i={i} />
      <g mask={`url(#${id})`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={da}>
        <path d={d} stroke={SHADOW} strokeWidth={w} transform="translate(0.45 0.65)" />
        <path d={d} stroke={c} strokeWidth={w} />
        <path d={d} stroke={SHEEN} strokeWidth={w * 0.34} transform="translate(-0.25 -0.3)" />
      </g>
    </g>
  );
}

/** Stem stitch: a continuous twisted line, the sheen broken into short slants. */
export function Stem({ d, c, i = 0, w = 2, opacity = 1 }: LineProps) {
  const id = useSvgId("stem");
  return (
    <g opacity={opacity}>
      <RevealMask id={id} d={d} width={w + 8} i={i} />
      <g mask={`url(#${id})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} stroke={SHADOW} strokeWidth={w} transform="translate(0.45 0.65)" />
        <path d={d} stroke={c} strokeWidth={w} />
        <path
          d={d}
          stroke={SHEEN}
          strokeWidth={w * 0.36}
          strokeDasharray={`${w * 1.3} ${w * 0.8}`}
          transform="translate(-0.25 -0.3)"
        />
      </g>
    </g>
  );
}

interface SatinProps {
  /** Shape to fill. */
  d: string;
  /** Bounding box of the shape: x, y, width, height. */
  box: [number, number, number, number];
  c: string;
  i?: number;
  /** Stitch direction in degrees (0 = horizontal stitches). */
  angle?: number;
  /** Distance between stitches. */
  gap?: number;
  /** Stem outline colour; omit for none. */
  outline?: string;
  outlineW?: number;
}

/** Satin stitch: closely laid parallel stitches clipped to a shape. */
export function Satin({ d, box, c, i = 0, angle = 60, gap = 1.5, outline, outlineW = 1.4 }: SatinProps) {
  const clip = useSvgId("sat");
  const [x, y, w, h] = box;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.hypot(w, h) / 2 + 2;
  const lines: number[] = [];
  for (let o = -r; o <= r; o += gap) lines.push(o);
  const ld = lines.map((o) => `M${cx - r} ${cy + o}H${cx + r}`).join("");
  const mask = useSvgId("satm");
  // Reveal across the stitches, perpendicular to their direction.
  const sweep = `M${cx} ${cy - r}V${cy + r}`;
  return (
    <g>
      <clipPath id={clip}>
        <path d={d} />
      </clipPath>
      <RevealMask id={mask} d={sweep} width={r * 2 + 4} i={i} />
      <g mask={`url(#${mask})`}>
        <g clipPath={`url(#${clip})`}>
          <path d={d} fill={c} opacity={0.35} />
          <g transform={`rotate(${angle} ${cx} ${cy})`} fill="none" strokeLinecap="round">
            <path d={ld} stroke={SHADOW} strokeWidth={gap * 0.9} transform="translate(0.3 0.5)" />
            <path d={ld} stroke={c} strokeWidth={gap * 0.82} />
            <path d={ld} stroke={SHEEN} strokeWidth={gap * 0.22} transform="translate(0 -0.25)" />
          </g>
        </g>
        {outline && (
          <g fill="none" strokeLinejoin="round">
            <path d={d} stroke={SHADOW} strokeWidth={outlineW} transform="translate(0.4 0.6)" />
            <path d={d} stroke={outline} strokeWidth={outlineW} />
          </g>
        )}
      </g>
    </g>
  );
}

/** French knots: small raised dots that land last. */
export function Knots({ pts, c, i = 0, r = 2 }: { pts: [number, number][]; c: string; i?: number; r?: number }) {
  return (
    <g className={styles.knots} style={{ "--i": i } as CSSProperties}>
      {pts.map(([x, y], n) => (
        <g key={n} className={styles.knot} style={{ "--n": n } as CSSProperties}>
          <circle cx={x + 0.5} cy={y + 0.7} r={r} fill={SHADOW} />
          <circle cx={x} cy={y} r={r} fill={c} />
          {r >= 2.6 && (
            // The wraps of the knot: a broken ring of darker thread.
            <circle cx={x} cy={y} r={r * 0.58} fill="none" stroke="rgba(40,28,20,.35)" strokeWidth={r * 0.28} strokeDasharray={`${r * 0.7} ${r * 0.45}`} />
          )}
          <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.34} fill={SHEEN} />
        </g>
      ))}
    </g>
  );
}

/** A line of short parallel straight stitches (each given as x1 y1 x2 y2). */
export function Strokes({ lines, c, i = 0, w = 1.8 }: { lines: [number, number, number, number][]; c: string; i?: number; w?: number }) {
  const d = lines.map(([a, b, x, y]) => `M${a} ${b}L${x} ${y}`).join("");
  const xs = lines.flatMap(([a, , x]) => [a, x]);
  const ys = lines.flatMap(([, b, , y]) => [b, y]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const id = useSvgId("str");
  return (
    <g>
      <RevealMask id={id} d={`M${x0 - 2} ${(y0 + y1) / 2}H${x1 + 2}`} width={y1 - y0 + 12} i={i} />
      <g mask={`url(#${id})`} fill="none" strokeLinecap="round">
        <path d={d} stroke={SHADOW} strokeWidth={w} transform="translate(0.45 0.65)" />
        <path d={d} stroke={c} strokeWidth={w} />
        <path d={d} stroke={SHEEN} strokeWidth={w * 0.34} transform="translate(-0.25 -0.3)" />
      </g>
    </g>
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
}: {
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
      <g
        fontFamily="Alegreya, Georgia, serif"
        fontSize={size}
        fontStyle={italic ? "italic" : undefined}
        fontWeight={600}
      >
        <text x="2.6" y={size + 1} fill={SHADOW} stroke={SHADOW} strokeWidth="0.5">
          {text}
        </text>
        <text x="2" y={size} fill={`url(#${pat})`} stroke={c} strokeWidth="0.55" strokeLinejoin="round">
          {text}
        </text>
      </g>
    </svg>
  );
}

/** Linen weave for use inside an SVG frame (the page itself gets it from CSS). */
export function LinenFill({ d, ground, id }: { d: string; ground: string; id: string }) {
  return (
    <g>
      <defs>
        <filter id={`${id}-w`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.05" numOctaves="2" seed="3" result="a" />
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.9" numOctaves="2" seed="9" result="b" />
          <feBlend in="a" in2="b" mode="multiply" />
          <feColorMatrix values="0 0 0 0 0.33  0 0 0 0 0.25  0 0 0 0 0.16  1.1 0 0 0 -0.46" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <path d={d} fill={ground} />
      <path d={d} fill={ground} filter={`url(#${id}-w)`} opacity="0.5" />
    </g>
  );
}
