import { useId, type ReactNode } from "react";

/** A filter-safe id (React ids contain characters url(#...) dislikes). */
export function useSvgId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Hand-drawn wobble: turbulence displacing the edges by a pixel or two. */
function Wobble({ id, scale = 1.6, seed = 3 }: { id: string; scale?: number; seed?: number }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed={seed} />
      <feDisplacementMap in="SourceGraphic" scale={scale} />
    </filter>
  );
}

/** Pressed sprig for the corner of the letter: sage leaves and three faded rose heads. */
export function PressedSprig({ className }: { className?: string }) {
  const f = useSvgId("sprig");
  const leaves = [
    [58, 150, -38, 1],
    [72, 128, 34, 0.9],
    [62, 108, -42, 0.95],
    [80, 88, 30, 0.8],
    [70, 70, -34, 0.75],
    [90, 58, 36, 0.7],
    [48, 176, 36, 1],
    [104, 36, -30, 0.6],
    [114, 60, 70, 0.6],
  ] as const;
  return (
    <svg className={className} viewBox="0 0 160 220" aria-hidden="true">
      <defs>
        <Wobble id={f} scale={2.4} seed={7} />
      </defs>
      <g filter={`url(#${f})`}>
        <path d="M40 212 C 52 170, 66 120, 92 64 S 118 22, 122 14" fill="none" stroke="#7d8a6c" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M92 64 C 104 58, 118 60, 132 52" fill="none" stroke="#7d8a6c" strokeWidth="1.4" opacity="0.7" />
        {leaves.map(([x, y, r, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
            <ellipse cx="0" cy="-16" rx="7" ry="17" fill="#8b9c7e" opacity="0.42" stroke="#6f8062" strokeOpacity="0.3" strokeWidth="0.8" />
            <ellipse cx="1" cy="-14" rx="5" ry="13" fill="#8b9c7e" opacity="0.35" />
            <path d="M0 0 L0 -28" stroke="#6f7f62" strokeWidth="0.7" opacity="0.5" />
          </g>
        ))}
        {[
          [122, 16, 1],
          [136, 48, 0.85],
          [104, 38, 0.7],
          [146, 22, 0.55],
          [118, 70, 0.5],
        ].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s}) rotate(${i * 47})`}>
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx="0" cy="-7" rx="6.5" ry="8" transform={`rotate(${r})`} fill="#c4868a" opacity="0.3" stroke="#a9666c" strokeOpacity="0.28" strokeWidth="0.8" />
            ))}
            <circle r="4" fill="#b5737a" opacity="0.45" />
            <circle r="1.8" fill="#8a5a3c" opacity="0.6" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Deep red wax seal with a pressed initial. */
export function Seal({ className }: { className?: string }) {
  const f = useSvgId("seal");
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <filter id={f} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
      </defs>
      <g filter={`url(#${f})`}>
        <circle cx="60" cy="61" r="46" fill="#5e211f" opacity="0.35" />
        <circle cx="60" cy="58" r="46" fill="#7b2d2a" />
        <circle cx="54" cy="52" r="36" fill="#8d3834" opacity="0.6" />
      </g>
      <circle cx="60" cy="58" r="30" fill="none" stroke="#5a1f1c" strokeWidth="2" opacity="0.7" />
      <circle cx="60" cy="58" r="30" fill="none" stroke="#a9534c" strokeWidth="1" opacity="0.5" transform="translate(-1 -1)" />
      <text x="60" y="71" textAnchor="middle" fontFamily="Newsreader, serif" fontStyle="italic" fontSize="38" fill="#5a1f1c">A</text>
      <text x="59" y="70" textAnchor="middle" fontFamily="Newsreader, serif" fontStyle="italic" fontSize="38" fill="#b0605a" opacity="0.45">A</text>
    </svg>
  );
}

/** A single pen stroke under the signature. */
export function Flourish({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 260 30" aria-hidden="true">
      <path
        d="M4 18 C 50 8, 96 26, 140 17 S 214 6, 254 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M150 20 C 170 24, 196 21, 214 16" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * Afternoon light through a window: a warm patch of light crossed by the soft
 * shadows of the mullions, falling diagonally over the desk and the sheet.
 */
export function WindowLight({ className }: { className?: string }) {
  const f = useSvgId("light");
  return (
    <svg className={className} viewBox="0 0 1440 1200" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs>
        <filter id={f} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <g filter={`url(#${f})`}>
        <path d="M 250 -120 L 330 -120 L 1010 900 L 930 900 Z" fill="#6f6a55" opacity="0.13" />
        <path d="M 610 -120 L 650 -120 L 1330 900 L 1290 900 Z" fill="#6f6a55" opacity="0.1" />
        <path d="M -100 360 L 1600 180 L 1600 225 L -100 405 Z" fill="#6f6a55" opacity="0.09" />
      </g>
    </svg>
  );
}

/** Small ink mark for each project, washed in the project's colour. */
export function Mark({ slug, wash, className }: { slug: string; wash: string; className?: string }) {
  const f = useSvgId("mark");
  const ink = "currentColor";
  const w = { fill: wash, opacity: 0.4 };
  const s = { fill: "none", stroke: ink, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let art: ReactNode;
  switch (slug) {
    case "phren":
      art = (
        <>
          <path d="M14 42 C 20 30, 28 18, 36 6" {...s} />
          {[10, 16, 22, 28, 34].map((y, i) => (
            <g key={y}>
              <ellipse cx={0} cy={0} rx="2.4" ry="6" transform={`translate(${34 - y * 0.6 - 4} ${46 - y}) rotate(${-50})`} fill={wash} opacity="0.5" />
              <ellipse cx={0} cy={0} rx="2.4" ry="6" transform={`translate(${34 - y * 0.6 + 5} ${48 - y}) rotate(${40 + i})`} fill={wash} opacity="0.45" />
            </g>
          ))}
        </>
      );
      break;
    case "ogrid":
      art = (
        <>
          <rect x="18" y="18" width="12" height="12" {...w} />
          <path d="M6 18 H42 M6 30 H42 M18 6 V42 M30 6 V42" {...s} strokeWidth="1" />
          <rect x="17.5" y="17.5" width="13" height="13" {...s} strokeWidth="2" />
          <rect x="28" y="28" width="4" height="4" fill={ink} />
        </>
      );
      break;
    case "m4l-builder":
      art = (
        <>
          <circle cx="24" cy="24" r="16" {...w} />
          <path d="M4 24 C 10 8, 16 8, 20 24 S 30 40, 36 24 S 42 14, 46 20" {...s} />
        </>
      );
      break;
    case "livemcp":
      art = (
        <>
          <circle cx="24" cy="24" r="17" {...w} />
          <circle cx="24" cy="24" r="17" {...s} />
          {[
            [14, 22],
            [17, 15],
            [24, 12],
            [31, 15],
            [34, 22],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="1.8" fill={ink} />
          ))}
          <path d="M21 36 H27" {...s} strokeWidth="2.4" />
        </>
      );
      break;
    case "intrapath":
      art = (
        <>
          <path d="M8 40 L8 8 L40 40 Z" {...w} />
          <path d="M8 40 L8 8 L40 40 Z" {...s} />
          <path d="M14 34 L14 22 L26 34 Z" {...s} strokeWidth="1" />
          <path d="M8 16 H11 M8 24 H11 M8 32 H11" {...s} strokeWidth="1" />
        </>
      );
      break;
    case "atlas":
      art = (
        <>
          <path d="M6 14 H42 V34 H6 Z" {...w} />
          <path d="M6 14 H42 V20 A4 4 0 0 0 42 28 V34 H6 V28 A4 4 0 0 0 6 20 Z" {...s} />
          <path d="M32 15 V33" {...s} strokeDasharray="2 2.5" strokeWidth="1" />
          <path d="M12 21 H26 M12 27 H22" {...s} strokeWidth="1" />
        </>
      );
      break;
    case "basis":
      art = (
        <>
          <circle cx="24" cy="26" r="15" {...w} />
          <path d="M10 26 L20 36 L40 10" fill="none" stroke={wash} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
      break;
    case "mina":
      art = (
        <>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="24" cy="14" rx="6" ry="9" transform={`rotate(${r} 24 24)`} fill={wash} opacity="0.4" />
          ))}
          <circle cx="24" cy="24" r="3" fill={ink} opacity="0.6" />
        </>
      );
      break;
    case "mutter":
      art = (
        <>
          <circle cx="14" cy="24" r="7" {...w} />
          <path d="M22 16 A10 10 0 0 1 22 32 M28 11 A16 16 0 0 1 28 37 M34 6 A22 22 0 0 1 34 42" {...s} />
        </>
      );
      break;
    case "intranet-erp":
      art = (
        <>
          <circle cx="24" cy="24" r="17" fill="none" stroke={wash} strokeWidth="4" opacity="0.35" />
          <circle cx="25" cy="23" r="15.5" fill="none" stroke={wash} strokeWidth="1.2" opacity="0.6" />
          <circle cx="24" cy="24" r="16" fill={wash} opacity="0.08" />
        </>
      );
      break;
    case "emv":
      art = (
        <>
          <path d="M18 40 V12 A6 6 0 0 1 30 12 V34 A3.5 3.5 0 0 1 23 34 V16" {...s} strokeWidth="1.6" />
          <path d="M14 6 H34 V42 H14 Z" {...w} opacity="0.25" />
        </>
      );
      break;
    case "equipment-tracker":
      art = (
        <>
          <path d="M14 10 H38 V42 H14 L8 36 V16 Z" {...w} />
          <path d="M14 10 H38 V42 H14 L8 36 V16 Z" {...s} />
          <circle cx="16" cy="26" r="3.5" {...s} />
          <path d="M13 24 C 6 18, 4 10, 10 4" {...s} strokeWidth="1" />
        </>
      );
      break;
    case "alphalens":
      art = (
        <>
          <circle cx="20" cy="20" r="12" {...w} />
          <circle cx="20" cy="20" r="12" {...s} />
          <path d="M29 29 L42 42" {...s} strokeWidth="3" />
          <path d="M13 22 L18 17 L22 21 L27 15" {...s} strokeWidth="1" />
        </>
      );
      break;
    case "garden-sensor-network":
      art = (
        <>
          <ellipse cx="16" cy="20" rx="9" ry="5" transform="rotate(-30 16 20)" {...w} opacity="0.55" />
          <ellipse cx="32" cy="16" rx="10" ry="5" transform="rotate(25 32 16)" {...w} opacity="0.5" />
          <path d="M24 42 C 24 32, 24 26, 22 20 M24 30 C 28 24, 34 20, 38 18 M22 24 C 18 22, 12 20, 8 22" {...s} />
          <path d="M12 42 H36" {...s} strokeWidth="1" />
        </>
      );
      break;
    case "retrofit-program-data-tools":
      art = (
        <>
          <path d="M10 38 L34 8 L40 13 L16 43 Z" {...w} />
          <path d="M10 38 L34 8 L40 13 L16 43 Z M10 38 L8 46 L16 43" {...s} />
          <path d="M31 11.5 L37 16.5" {...s} strokeWidth="1" />
        </>
      );
      break;
    default:
      art = <circle cx="24" cy="24" r="14" {...w} />;
  }
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <Wobble id={f} scale={1.4} />
      </defs>
      <g filter={`url(#${f})`}>{art}</g>
    </svg>
  );
}
