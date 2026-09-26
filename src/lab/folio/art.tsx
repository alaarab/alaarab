import { useId, type ReactNode } from "react";
import type { Motif } from "./book";
import styles from "./folio.module.css";

export const GOLD = "#b8955a";

/** Ridge of the emblem: a mountain line that also reads as a decaying sound wave. */
const RIDGE =
  "M14 80 L20 76 L26 82 L33 71 L40 85 L48 62 L60 40 L72 62 L80 85 L87 71 L94 82 L100 76 L106 80";

/** Ala's emblem: a sun behind a ridge that is also a waveform. Drawn as a single-colour stamp. */
export function Emblem({
  className,
  color = GOLD,
}: {
  className?: string;
  color?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={className}
      viewBox="0 0 120 110"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <clipPath id={`sky${id}`}>
          <path d={`${RIDGE} L106 0 L14 0 Z`} />
        </clipPath>
      </defs>
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <circle
          cx="60"
          cy="46"
          r="22"
          strokeWidth="2.6"
          clipPath={`url(#sky${id})`}
        />
        <path d={RIDGE} strokeWidth="2.8" />
        <path d="M30 96 H90" strokeWidth="1.6" />
        <path d="M46 102 H74" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

/** Section break: a small ridge between two rules. */
export function Ornament({ color = GOLD }: { color?: string }) {
  return (
    <div className={styles.ornament} aria-hidden="true">
      <svg viewBox="0 0 120 16" fill="none">
        <g stroke={color} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9 H38" strokeWidth="1" />
          <path
            d="M44 9 L50 6 L55 11 L60 2 L65 11 L70 6 L76 9"
            strokeWidth="1.5"
          />
          <path d="M82 9 H116" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

/** Endpaper: the ridge and sun repeated as a two-colour print. */
export function Endpaper({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={`ep${id}`}
          width="150"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="#3e5068"
            strokeOpacity="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.1"
          >
            <path d="M8 44 L20 38 L30 46 L42 22 L54 46 L64 38 L76 44" />
            <circle cx="42" cy="18" r="6" />
            <path d="M83 104 L95 98 L105 106 L117 82 L129 106 L139 98 L151 104" />
            <path d="M-67 104 L-55 98 L-45 106 L-33 82 L-21 106 L-11 98 L1 104" />
            <circle cx="117" cy="78" r="6" />
          </g>
          <circle cx="117" cy="30" r="1.4" fill="#b8955a" />
          <circle cx="42" cy="90" r="1.4" fill="#b8955a" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#e4e1d4" />
      <rect width="100%" height="100%" fill={`url(#ep${id})`} />
    </svg>
  );
}

/** A soft watercolour wash under a drawing: overlapping translucent fills, blurred. */
function Wash({
  id,
  cx,
  cy,
  rx,
  ry,
}: {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}) {
  return (
    <>
      <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02"
          numOctaves="3"
          seed="4"
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="30" result="d" />
        <feGaussianBlur in="d" stdDeviation="6" />
      </filter>
      <g filter={`url(#${id})`} fill="currentColor">
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} opacity="0.07" />
        <ellipse
          cx={cx - rx * 0.25}
          cy={cy + ry * 0.1}
          rx={rx * 0.7}
          ry={ry * 0.8}
          opacity="0.06"
        />
        <ellipse
          cx={cx + rx * 0.3}
          cy={cy - ry * 0.15}
          rx={rx * 0.55}
          ry={ry * 0.6}
          opacity="0.05"
        />
      </g>
    </>
  );
}

function Plate({
  children,
  label,
  viewBox = "0 0 400 280",
  wash,
}: {
  children: ReactNode;
  label: string;
  viewBox?: string;
  wash?: { cx: number; cy: number; rx: number; ry: number };
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={styles.plateArt}
      viewBox={viewBox}
      role="img"
      aria-label={label}
    >
      {wash && <Wash id={`wa${id}`} {...wash} />}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

/* ---------- Showcase frontispieces ---------- */

export function PhrenArt() {
  const slips = [
    { x: 168, y: 196, r: -12, d: 0 },
    { x: 222, y: 170, r: 10, d: 1 },
    { x: 186, y: 138, r: -4, d: 2 },
    { x: 238, y: 112, r: 14, d: 3 },
  ];
  const stars: [number, number][] = [
    [112, 70],
    [160, 44],
    [206, 64],
    [252, 36],
    [300, 66],
    [276, 98],
  ];
  return (
    <Plate
      label="An open book whose pages drift upward and become a constellation."
      wash={{ cx: 200, cy: 150, rx: 170, ry: 110 }}
    >
      {/* book */}
      <path d="M200 232 C165 216 112 214 64 226 L64 256 C112 246 165 248 200 264 Z" />
      <path d="M200 232 C235 216 288 214 336 226 L336 256 C288 246 235 248 200 264 Z" />
      <path
        d="M58 232 L58 262 C110 252 165 254 200 270 C235 254 290 252 342 262 L342 232"
        strokeWidth="1.1"
      />
      <path d="M200 232 L200 264" strokeWidth="1.1" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} strokeWidth="0.9" opacity="0.75">
          <path
            d={`M${84 + i * 3} ${234 + i * 6} C120 ${226 + i * 6} 160 ${228 + i * 6} ${188 - i * 2} ${240 + i * 6}`}
          />
          <path
            d={`M${212 + i * 2} ${240 + i * 6} C240 ${228 + i * 6} 280 ${226 + i * 6} ${316 - i * 3} ${234 + i * 6}`}
          />
        </g>
      ))}
      {/* slips rising */}
      {slips.map((s) => (
        <g
          key={s.d}
          className={styles.slip}
          style={{ animationDelay: `${s.d * 0.35}s` }}
        >
          <g transform={`translate(${s.x} ${s.y}) rotate(${s.r})`}>
            <rect
              x="-11"
              y="-8"
              width="22"
              height="16"
              strokeWidth="1.2"
              fill="#f3ecdc"
            />
            <path d="M-7 -3 H7 M-7 1 H5 M-7 5 H3" strokeWidth="0.8" />
          </g>
        </g>
      ))}
      {/* constellation */}
      <path
        d={`M${stars.map((s) => s.join(" ")).join(" L")}`}
        strokeWidth="0.7"
        strokeDasharray="2 4"
        opacity="0.8"
      />
      {stars.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path
            d="M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z"
            fill={GOLD}
            stroke={GOLD}
            strokeWidth="0.6"
          />
        </g>
      ))}
    </Plate>
  );
}

export function MinaArt() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={styles.plateArt}
      viewBox="0 0 400 300"
      role="img"
      aria-label="A crescent moon above a cradle, at night."
    >
      <defs>
        <filter id={`mh${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <clipPath id={`mc${id}`}>
          <path d="M20 292 V150 A180 138 0 0 1 380 150 V292 Z" />
        </clipPath>
        <mask id={`moon${id}`}>
          <circle cx="262" cy="84" r="30" fill="#fff" />
          <circle cx="276" cy="74" r="27" fill="#000" />
        </mask>
      </defs>
      <g clipPath={`url(#mc${id})`}>
        <rect width="400" height="300" fill="#2f3450" />
        <ellipse
          cx="120"
          cy="80"
          rx="190"
          ry="90"
          fill="#46466a"
          opacity="0.55"
          filter={`url(#mh${id})`}
        />
        <ellipse
          cx="290"
          cy="250"
          rx="220"
          ry="80"
          fill="#5a4a64"
          opacity="0.5"
          filter={`url(#mh${id})`}
        />
        <circle
          cx="256"
          cy="86"
          r="52"
          fill="#e9d7a8"
          opacity="0.12"
          filter={`url(#mh${id})`}
        />
        <rect
          x="0"
          y="0"
          width="400"
          height="300"
          fill="#e9d7a8"
          mask={`url(#moon${id})`}
        />
        {[
          [90, 60],
          [140, 104],
          [196, 50],
          [320, 136],
          [342, 60],
          [70, 150],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 2 ? 1.3 : 1.8}
            fill="#e9d7a8"
            opacity="0.8"
          />
        ))}
        <g
          className={styles.cradle}
          fill="none"
          stroke="#efe2cc"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M126 196 C128 234 168 250 200 250 C232 250 272 234 274 196 Z"
            fill="#3b3c5a"
          />
          <path
            d="M126 196 C126 168 150 150 180 150 C176 166 176 182 180 196"
            fill="#3b3c5a"
          />
          <path d="M138 202 C160 212 240 212 262 202" strokeWidth="1.1" />
          <path
            d="M180 196 C196 186 214 184 226 190 C236 184 250 186 262 196"
            strokeWidth="1.3"
          />
          <path d="M116 262 C150 276 250 276 284 262" />
          <path d="M150 244 L144 266 M250 244 L256 266" />
        </g>
      </g>
    </svg>
  );
}

/** Additive waveform: the first n harmonics of a saw, so 1 is a sine and more grows edges. */
export function wavePath(n: number, width: number, height: number, offset = 0) {
  const pts: string[] = [];
  const steps = 220;
  let peak = 0;
  const ys: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 4;
    let y = 0;
    for (let k = 1; k <= n; k++) y += Math.sin(k * t) / k;
    ys.push(y);
    peak = Math.max(peak, Math.abs(y));
  }
  ys.forEach((y, i) => {
    const x = (i / steps) * width;
    pts.push(
      `${x.toFixed(1)} ${(height / 2 - (y / peak) * (height * 0.38) + offset).toFixed(1)}`,
    );
  });
  return `M${pts.join(" L")}`;
}

/* ---------- Small motifs for the other chapters ---------- */

const SUN = (x: number, y: number, r = 14) => (
  <circle cx={x} cy={y} r={r} stroke={GOLD} strokeWidth="1.8" />
);

const motifs: Partial<Record<Motif, { label: string; art: ReactNode }>> = {
  grid: {
    label: "A ruled sheet with a selected range and its fill handle.",
    art: (
      <>
        <path d="M90 60 L310 50 L320 230 L96 240 Z" />
        {[1, 2, 3, 4, 5].map((i) => (
          <path
            key={`r${i}`}
            d={`M${91 + i} ${60 + i * 30 - i * 1.7} L${311 + i * 1.6} ${50 + i * 30}`}
            strokeWidth="0.9"
          />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <path
            key={`c${i}`}
            d={`M${90 + i * 44} ${60 - i * 2} L${96 + i * 45} ${240 - i * 2}`}
            strokeWidth="0.9"
          />
        ))}
        <path d="M134 116 L222 112 L226 172 L137 176 Z" strokeWidth="2.6" />
        <rect
          x="220"
          y="168"
          width="10"
          height="10"
          fill={GOLD}
          stroke={GOLD}
        />
        <path d="M226 186 L228 222" strokeDasharray="3 5" />
        <path d="M222 214 L228 224 L234 213" />
      </>
    ),
  },
  bridge: {
    label: "An arched stone bridge over moving water.",
    art: (
      <>
        {SUN(300, 62)}
        <path d="M40 150 H360" />
        <path d="M40 162 H110 C130 110 270 110 290 162 H360" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = Math.PI * (0.12 + i * 0.127);
          const cx = 200 - Math.cos(a) * 90;
          const cy = 162 - Math.sin(a) * 48;
          return (
            <path
              key={i}
              d={`M${cx.toFixed(1)} ${cy.toFixed(1)} L${(200 - Math.cos(a) * 104).toFixed(1)} ${(162 - Math.sin(a) * 60).toFixed(1)}`}
              strokeWidth="1"
            />
          );
        })}
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${60 + i * 12} ${190 + i * 16} q 15 -6 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0`}
            strokeWidth={1.2 - i * 0.2}
            opacity={1 - i * 0.18}
          />
        ))}
      </>
    ),
  },
  path: {
    label: "Stepping stones winding toward a gate on a hill.",
    art: (
      <>
        {SUN(88, 70, 12)}
        <path d="M30 120 C110 96 280 92 370 116" />
        <path d="M188 108 V78 M222 108 V78 M184 82 H226 M188 94 H222" />
        {[
          [206, 126, 9, 3],
          [192, 142, 13, 4],
          [214, 162, 17, 5],
          [186, 186, 22, 7],
          [220, 214, 28, 8],
          [176, 246, 34, 10],
        ].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} />
        ))}
      </>
    ),
  },
  map: {
    label: "A folded map with a dotted route, and a compass.",
    art: (
      <>
        <path d="M70 80 L150 60 L230 80 L310 60 L310 220 L230 240 L150 220 L70 240 Z" />
        <path d="M150 60 V220 M230 80 V240" strokeWidth="1" />
        <path
          d="M96 200 C120 160 160 176 180 140 C200 104 240 150 270 110"
          strokeDasharray="3 6"
        />
        <path d="M264 104 L276 116 M276 104 L264 116" />
        <g transform="translate(330 196)" stroke={GOLD}>
          <circle r="26" />
          <path
            d="M0 -34 L6 -6 L0 0 L-6 -6 Z M0 34 L6 6 L0 0 L-6 6 Z"
            fill={GOLD}
            strokeWidth="1"
          />
          <path d="M-34 0 H34" strokeWidth="1" />
        </g>
      </>
    ),
  },
  balance: {
    label: "A balance, level, with a small weight on each pan.",
    art: (
      <>
        <path d="M200 70 V236 M160 240 H240 M178 240 C182 226 218 226 222 240" />
        <circle cx="200" cy="64" r="6" stroke={GOLD} fill={GOLD} />
        <path d="M86 88 H314" strokeWidth="2.2" />
        <path
          d="M100 88 L70 170 M100 88 L130 170 M300 88 L270 170 M300 88 L330 170"
          strokeWidth="1"
        />
        <path d="M60 170 C70 190 130 190 140 170 Z M260 170 C270 190 330 190 340 170 Z" />
        <path
          d="M88 170 V156 H112 V170 M288 170 V160 H300 V150 H312 V170"
          strokeWidth="1.2"
        />
      </>
    ),
  },
  cans: {
    label: "Two tin-can telephones joined by a string.",
    art: (
      <>
        <g transform="rotate(-14 90 170)">
          <ellipse cx="90" cy="130" rx="26" ry="8" />
          <path d="M64 130 V200 C64 212 116 212 116 200 V130" />
          <path
            d="M64 150 C70 156 110 156 116 150 M64 180 C70 186 110 186 116 180"
            strokeWidth="0.9"
          />
        </g>
        <g transform="rotate(14 310 170)">
          <ellipse cx="310" cy="130" rx="26" ry="8" />
          <path d="M284 130 V200 C284 212 336 212 336 200 V130" />
          <path
            d="M284 150 C290 156 330 156 336 150 M284 180 C290 186 330 186 336 180"
            strokeWidth="0.9"
          />
        </g>
        <path
          d="M118 128 C170 170 230 170 282 128"
          stroke={GOLD}
          strokeWidth="1.4"
        />
      </>
    ),
  },
  tree: {
    label: "An oak on a low hill.",
    art: (
      <>
        <path d="M40 240 C120 222 280 222 360 240" />
        <path d="M190 232 C194 200 192 170 184 150 M210 232 C206 200 210 170 220 148 M196 180 C180 168 164 164 150 160 M206 176 C226 164 240 160 254 158" />
        <path d="M110 150 C92 128 110 96 138 102 C140 72 180 60 200 78 C220 56 262 68 264 98 C292 94 312 124 292 148 C300 170 270 184 250 170 C236 186 210 182 200 170 C186 184 160 186 150 170 C126 182 100 172 110 150 Z" />
        {SUN(330, 64, 11)}
      </>
    ),
  },
  bundle: {
    label: "A bundle of loose papers tied with string.",
    art: (
      <>
        <path d="M110 180 L290 172 L296 206 L114 214 Z" />
        <path d="M104 160 L286 146 L292 180 L108 192 Z" fill="#f3ecdc" />
        <path d="M118 128 L294 138 L288 172 L112 162 Z" fill="#f3ecdc" />
        <path d="M100 104 L280 96 L286 132 L104 140 Z" fill="#f3ecdc" />
        <path d="M120 112 H200 M120 122 H240" strokeWidth="0.9" />
        <path
          d="M196 98 L206 212 M102 122 L292 116"
          stroke={GOLD}
          strokeWidth="1.6"
        />
        <path
          d="M200 116 C184 96 170 106 186 116 C170 128 184 136 200 116 C214 96 230 104 214 116 C230 128 216 136 200 116"
          stroke={GOLD}
          strokeWidth="1.3"
        />
      </>
    ),
  },
  calipers: {
    label: "A pair of calipers with a paper tag on a string.",
    art: (
      <>
        <path d="M60 110 H330 V130 H60 Z" />
        {Array.from({ length: 26 }, (_, i) => (
          <path
            key={i}
            d={`M${80 + i * 9} 110 V${i % 5 ? 116 : 122}`}
            strokeWidth="0.8"
          />
        ))}
        <path d="M80 130 V210 L100 190 V130" />
        <path d="M150 104 H190 V136 H150 Z M156 136 V210 L174 190 V136" />
        <path d="M320 130 C330 160 300 170 296 196" strokeWidth="1" />
        <path
          d="M284 196 L308 196 L318 212 L318 250 L274 250 L274 212 Z"
          stroke={GOLD}
        />
        <circle cx="296" cy="206" r="3" stroke={GOLD} />
      </>
    ),
  },
  lens: {
    label: "A magnifying lens held over a line that rises.",
    art: (
      <>
        <path
          d="M40 220 L90 196 L120 206 L160 160 L190 176 L230 120 L270 136 L310 84 L360 96"
          strokeWidth="1.2"
        />
        <path d="M40 240 H360" strokeWidth="0.9" />
        <circle cx="215" cy="148" r="52" stroke={GOLD} strokeWidth="2.2" />
        <path d="M168 164 L190 176 L230 120 L262 133" strokeWidth="2.6" />
        <path d="M252 186 L300 240" strokeWidth="6" />
      </>
    ),
  },
  seedling: {
    label: "A seedling beside a small sensor on a stake.",
    art: (
      <>
        {SUN(320, 64, 14)}
        <path d="M60 224 C130 200 270 200 340 224" />
        <path d="M180 212 C182 190 180 170 176 152" />
        <path d="M177 160 C150 160 138 142 140 128 C160 128 176 140 177 160 Z M178 170 C196 160 214 162 222 150 C210 138 188 146 178 170 Z" />
        <path d="M240 212 V120 M228 96 H252 V124 H228 Z" />
        <path
          d="M258 98 C264 104 264 114 258 120 M266 92 C276 102 276 118 266 128"
          strokeWidth="1.1"
          stroke={GOLD}
        />
      </>
    ),
  },
  ladder: {
    label: "A house with a ladder leaning against it.",
    art: (
      <>
        {SUN(84, 62, 12)}
        <path d="M110 230 V130 L200 70 L290 130 V230 Z" />
        <path
          d="M180 230 V180 H218 V230 M132 146 H164 V174 H132 Z M236 146 H268 V174 H236 Z"
          strokeWidth="1.2"
        />
        <path d="M300 236 L262 104 M324 236 L286 104" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M${296 - i * 6.3} ${222 - i * 22} H${320 - i * 6.3}`}
            strokeWidth="1.2"
          />
        ))}
        <path d="M40 236 H360" />
      </>
    ),
  },
};

export function MotifArt({ motif }: { motif: Motif }) {
  const m = motifs[motif];
  if (!m) return null;
  return (
    <Plate label={m.label} wash={{ cx: 200, cy: 150, rx: 150, ry: 90 }}>
      {m.art}
    </Plate>
  );
}

/** A ridge line as a sum of sines, closed to the bottom of the plate. */
function ridge(y: number, amp: number, seed: number, w = 800, h = 320) {
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 8) {
    const t = x / w;
    const v =
      Math.sin(t * 7 + seed) * 0.5 +
      Math.sin(t * 17 + seed * 2.3) * 0.28 +
      Math.sin(t * 41 + seed * 0.7) * 0.1;
    pts.push(`${x} ${(y - v * amp).toFixed(1)}`);
  }
  return `M0 ${h} L${pts.join(" L")} L${w} ${h} Z`;
}

/** The emblem, painted: layered ridges in atmospheric perspective under a low sun. */
export function Landscape() {
  const id = useId().replace(/:/g, "");
  const layers = [
    { y: 170, amp: 34, seed: 1.2, fill: "#b9c0c4", op: 0.55 },
    { y: 200, amp: 40, seed: 3.9, fill: "#8d9aa6", op: 0.6 },
    { y: 236, amp: 30, seed: 5.1, fill: "#5d6f82", op: 0.72 },
    { y: 272, amp: 22, seed: 2.4, fill: "#34455a", op: 0.85 },
  ];
  return (
    <svg
      className={styles.landscape}
      viewBox="0 0 800 320"
      role="img"
      aria-label="A painting of layered blue ridges under a low gold sun."
    >
      <defs>
        <filter
          id={`pe${id}`}
          x="-2%"
          y="-10%"
          width="104%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.04"
            numOctaves="3"
            seed="11"
          />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
        <filter id={`ph${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <clipPath id={`pc${id}`}>
          <rect x="6" y="6" width="788" height="308" rx="3" />
        </clipPath>
      </defs>
      <g clipPath={`url(#pc${id})`}>
        <rect width="800" height="320" fill="#efe7d4" />
        <ellipse
          cx="520"
          cy="120"
          rx="360"
          ry="110"
          fill="#dfe2dc"
          opacity="0.7"
          filter={`url(#ph${id})`}
        />
        <ellipse
          cx="200"
          cy="80"
          rx="260"
          ry="70"
          fill="#e9dcc0"
          opacity="0.6"
          filter={`url(#ph${id})`}
        />
        <circle
          cx="470"
          cy="150"
          r="70"
          fill="#e6cf9c"
          opacity="0.5"
          filter={`url(#ph${id})`}
        />
        <circle cx="470" cy="150" r="30" fill="#d9bb7e" opacity="0.9" />
        <g filter={`url(#pe${id})`}>
          {layers.map((l, i) => (
            <g key={i}>
              <path
                d={ridge(l.y, l.amp, l.seed)}
                fill={l.fill}
                opacity={l.op}
              />
              <path
                d={ridge(l.y + 6, l.amp * 0.8, l.seed + 0.4)}
                fill={l.fill}
                opacity={l.op * 0.35}
              />
            </g>
          ))}
        </g>
      </g>
      <rect
        x="6"
        y="6"
        width="788"
        height="308"
        rx="3"
        fill="none"
        stroke={GOLD}
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  );
}
