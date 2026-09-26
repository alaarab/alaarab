import type { ComponentType } from "react";
import { C, SceneDefs } from "./objects";
import styles from "./workshop.module.css";

/**
 * Walking up to one object: the wall, the edge of the desk, the window's light
 * falling across from the left, and the object large in the middle of it.
 */
export function CloseScene({
  Art,
  wall,
  light,
  place = { x: 720, y: 650, s: 2.9 },
  label,
}: {
  Art: ComponentType;
  wall: [string, string];
  light: string;
  place?: { x: number; y: number; s: number };
  label: string;
}) {
  return (
    <svg className={styles.closeSvg} viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <SceneDefs />
      <defs>
        <radialGradient id="ws-close-wall" cx="520" cy="120" r="1100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={wall[0]} />
          <stop offset="1" stopColor={wall[1]} />
        </radialGradient>
        <linearGradient id="ws-close-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} stopOpacity="0.9" />
          <stop offset="0.55" stopColor={light} stopOpacity="0.2" />
          <stop offset="1" stopColor="#3f3a55" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="ws-close-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8875e" />
          <stop offset="1" stopColor="#7d5238" />
        </linearGradient>
      </defs>
      <rect width="1440" height="760" fill="url(#ws-close-wall)" />
      {/* The window's shape, thrown onto the wall */}
      <g opacity="0.55" filter="url(#ws-blur-lg)">
        <polygon points="930,70 1040,58 1046,196 936,206" fill={light} />
        <polygon points="1054,56 1168,44 1176,184 1060,194" fill={light} />
        <polygon points="938,220 1046,210 1052,340 944,352" fill={light} />
        <polygon points="1062,208 1178,198 1186,328 1066,338" fill={light} />
      </g>
      <polygon points="0,0 300,0 1000,540 560,540" fill={light} opacity="0.22" filter="url(#ws-blur-lg)" style={{ mixBlendMode: "screen" }} />
      <polygon points="0,520 1440,520 1440,760 0,760" fill="url(#ws-close-desk)" />
      <rect y="520" width="1440" height="240" fill={wall[1]} opacity="0.22" style={{ mixBlendMode: "multiply" }} />
      <path d="M0 521 H1440" stroke={C.blueDeep} strokeWidth="6" opacity="0.25" filter="url(#ws-blur)" />
      <path d="M0 600 C400 590 900 606 1440 596 M0 680 C500 670 1000 690 1440 676" stroke={C.woodDark} strokeWidth="2" fill="none" opacity="0.16" />
      <g opacity="0.35" filter="url(#ws-blur-lg)" fill={light}>
        <polygon points={`${place.x - 120},740 ${place.x + 200},740 ${place.x + 330},560 ${place.x + 60},560`} />
        <polygon points={`${place.x + 230},740 ${place.x + 520},740 ${place.x + 620},560 ${place.x + 360},560`} />
      </g>
      <g filter="url(#ws-wobble)">
        <g transform={`translate(${place.x} ${place.y}) scale(${place.s})`}>
          <Art />
        </g>
      </g>
      <rect width="1440" height="760" fill="url(#ws-close-sheen)" style={{ mixBlendMode: "soft-light" }} pointerEvents="none" />
      <rect width="1440" height="760" filter="url(#ws-grain)" pointerEvents="none" />
    </svg>
  );
}
