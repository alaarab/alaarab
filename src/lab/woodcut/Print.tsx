import { useId, useMemo, type CSSProperties, type ReactNode } from "react";
import { rng, wobblyRect, type Pt } from "./carve";
import styles from "./woodcut.module.css";

/** One colour block: what it inks, and what was cut away from it. */
export type Layer = {
  ink: string;
  art: ReactNode;
  /** Path data for carved-away areas (paper shows through). */
  cuts?: string;
  /** Misregistration against the key block, in viewBox units. */
  shift?: Pt;
};

type Props = {
  w: number;
  h: number;
  /** Lightest block first, key block last: the order they are printed. */
  layers: Layer[];
  label: string;
  seed?: number;
  /** Print the keyline around the block edge. */
  frame?: boolean;
  /** Play the layer-by-layer "pull" on mount. */
  pull?: boolean;
  className?: string;
  children?: ReactNode;
};

const KEYFRAMES = "@keyframes woodcut-pull{from{opacity:0}to{opacity:1}}";

export function Print({ w, h, layers, label, seed = 7, frame = true, pull = false, className, children }: Props) {
  const id = useId().replace(/:/g, "");
  const edge = useMemo(() => wobblyRect(3, 3, w - 6, h - 6, rng(seed), 1.6), [w, h, seed]);
  const key = layers.length - 1;
  // Ink texture scales with the plate so small and large prints read alike.
  const grain = Math.max(0.35, Math.min(0.9, 700 / w));

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`${styles.print} ${pull ? styles.pull : ""} ${className ?? ""}`}
      role="img"
      aria-label={label}
    >
      <defs>
        <filter id={`${id}ink`} x="-1%" y="-1%" width="102%" height="102%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={`${grain * 0.05} ${grain * 0.42}`} numOctaves={3} seed={seed} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -18 0 0 0 13.7" result="holes" />
          <feTurbulence type="fractalNoise" baseFrequency={grain / 9} numOctaves={2} seed={seed + 9} result="mottle" />
          <feColorMatrix in="mottle" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.2 0 0 0 0.42" result="density" />
          <feComposite in="holes" in2="density" operator="arithmetic" k1={1} result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="inked" />
          <feTurbulence type="fractalNoise" baseFrequency={grain / 22} numOctaves={2} seed={seed + 5} result="warp" />
          <feDisplacementMap in="inked" in2="warp" scale={w / 380} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {layers.map((l, i) =>
          l.cuts ? (
            <mask key={i} id={`${id}m${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
              <rect width={w} height={h} fill="#fff" />
              <path d={l.cuts} fill="#000" />
            </mask>
          ) : null,
        )}
      </defs>
      {layers.map((l, i) => {
        const [dx, dy] = l.shift ?? (i === key ? [0, 0] : [((i % 2) * 2 - 1) * 1.4 * (w / 700), (i % 3 === 0 ? 1 : -1) * 1.1 * (w / 700)]);
        return (
          <g
            key={i}
            className={styles.layer}
            style={{ "--i": i, mixBlendMode: "multiply" } as CSSProperties}
            filter={`url(#${id}ink)`}
          >
            <g transform={`translate(${dx} ${dy})`} mask={l.cuts ? `url(#${id}m${i})` : undefined} fill={l.ink} color={l.ink}>
              {l.art}
              {i === key && frame ? <path d={edge} fill="none" stroke={l.ink} strokeWidth={Math.max(2, w / 260)} /> : null}
            </g>
          </g>
        );
      })}
      {children}
      {pull ? (
        <style href="woodcut-keyframes" precedence="default">
          {KEYFRAMES}
        </style>
      ) : null}
    </svg>
  );
}
