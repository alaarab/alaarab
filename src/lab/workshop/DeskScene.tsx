import type { ComponentType, MouseEvent } from "react";
import { useNavigate } from "react-router";
import { projectBySlug } from "../util";
import { lightAt } from "./light";
import {
  Binder,
  C,
  Folders,
  GraphPaper,
  HardwareBox,
  Ledger,
  Notebook,
  PadController,
  PhoneStand,
  SceneDefs,
} from "./objects";
import styles from "./workshop.module.css";

type Rect = [number, number, number, number];

interface Placed {
  slug: string;
  x: number;
  y: number;
  s: number;
  Art: ComponentType;
  hit: Rect;
}

/** Back row first so the front row paints over it. */
const desk: Placed[] = [
  { slug: "atlas", x: 310, y: 604, s: 0.92, Art: Folders, hit: [228, 534, 168, 80] },
  { slug: "intranet-erp", x: 458, y: 606, s: 0.95, Art: Binder, hit: [418, 444, 78, 170] },
  { slug: "livemcp", x: 850, y: 598, s: 0.9, Art: PadController, hit: [772, 538, 156, 72] },
  { slug: "m4l-builder", x: 1040, y: 604, s: 0.95, Art: HardwareBox, hit: [972, 506, 136, 106] },
  { slug: "mina", x: 1180, y: 606, s: 1, Art: PhoneStand, hit: [1140, 496, 84, 118] },
  { slug: "ogrid", x: 392, y: 682, s: 1, Art: GraphPaper, hit: [292, 624, 196, 72] },
  { slug: "phren", x: 652, y: 678, s: 1, Art: Notebook, hit: [562, 608, 186, 84] },
  { slug: "basis", x: 912, y: 688, s: 1, Art: Ledger, hit: [812, 614, 196, 86] },
];

/** Where the window's light lands on the desk, as four panes. */
const patch = [
  "612,688 800,688 787,650 630,650",
  "816,688 1018,688 997,650 803,650",
  "632,644 785,644 772,610 648,610",
  "801,644 995,644 975,610 788,610",
];

const dust = [
  [640, 220, 2.2], [700, 300, 1.6], [760, 250, 2.6], [820, 360, 1.8], [690, 420, 2.4], [860, 470, 1.6],
  [930, 540, 2], [780, 520, 1.4], [720, 170, 1.5], [880, 300, 2.1], [980, 620, 1.7], [620, 360, 1.3],
];

export function DeskScene({ hour, interactive }: { hour: number; interactive: boolean }) {
  const l = lightAt(hour);
  const navigate = useNavigate();
  const go = (slug: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    navigate(`/lab/workshop/projects/${slug}`);
  };

  return (
    <svg
      className={styles.deskSvg}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      role={interactive ? "group" : "img"}
      aria-label="A desk by a window in late light, the Los Angeles hills outside. Each object on the desk is a project."
    >
      <SceneDefs />
      <defs>
        <radialGradient id="ws-wall" cx="720" cy="300" r="820" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0dab6" />
          <stop offset="0.45" stopColor="#dcc09c" />
          <stop offset="1" stopColor="#b39c8c" />
        </radialGradient>
        <linearGradient id="ws-ceiling" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d6060" stopOpacity="0.32" />
          <stop offset="0.3" stopColor="#7d6060" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ws-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={l.skyTop} />
          <stop offset="1" stopColor={l.skyLow} />
        </linearGradient>
        <linearGradient id="ws-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8875e" />
          <stop offset="1" stopColor="#8a5b3e" />
        </linearGradient>
        <linearGradient id="ws-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7b5a45" />
          <stop offset="1" stopColor="#57414a" />
        </linearGradient>
        <linearGradient id="ws-curtain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b98480" />
          <stop offset="0.2" stopColor="#cf9690" />
          <stop offset="0.38" stopColor="#bd837e" />
          <stop offset="0.6" stopColor="#d7a198" />
          <stop offset="0.8" stopColor="#c68c86" />
          <stop offset="1" stopColor="#e2b3a4" />
        </linearGradient>
        <linearGradient id="ws-under" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f2a38" stopOpacity="0.7" />
          <stop offset="1" stopColor="#2f2a38" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="ws-beam-air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={l.beam} stopOpacity="0.55" />
          <stop offset="1" stopColor={l.beam} stopOpacity="0.05" />
        </linearGradient>
        <clipPath id="ws-glass">
          <rect x="556" y="126" width="328" height="324" />
        </clipPath>
      </defs>

      {/* Room */}
      <rect width="1440" height="652" fill="url(#ws-wall)" />
      <rect width="1440" height="652" fill="url(#ws-ceiling)" />
      <rect y="640" width="1440" height="12" fill="#a88d7a" />
      <rect y="652" width="1440" height="248" fill="url(#ws-floor)" />
      <ellipse cx="740" cy="520" rx="330" ry="70" fill={C.apricot} opacity={l.beamO * 0.55} filter="url(#ws-blur-lg)" />

      {/* Window and the view, glowing a little into the room */}
      <rect x="520" y="96" width="400" height="390" fill={l.skyLow} opacity={Math.max(0, 0.5 - l.ambientO)} filter="url(#ws-blur-lg)" />
      <g filter="url(#ws-wobble)">
        <rect x="540" y="110" width="360" height="356" fill="#e8d8bc" />
        <g clipPath="url(#ws-glass)">
          <rect x="556" y="126" width="328" height="324" fill="url(#ws-sky)" />
          <circle cx="800" cy={l.sunY} r="80" fill={l.sun} opacity="0.45" filter="url(#ws-blur-lg)" />
          <circle cx="800" cy={l.sunY} r="20" fill={l.sun} />
          <path d="M540 350 C600 322 650 332 700 316 C760 300 820 322 900 332 V460 H540Z" fill={l.hillFar} />
          <rect x="540" y="330" width="360" height="130" fill={l.skyLow} opacity="0.22" />
          <path d="M540 388 C590 372 640 374 690 382 C740 390 790 362 900 374 V460 H540Z" fill={l.hillMid} />
          <rect x="540" y="370" width="360" height="90" fill={l.skyLow} opacity="0.12" />
          <path d="M540 428 C600 412 660 420 720 414 C780 408 840 422 900 417 V460 H540Z" fill={l.hillNear} />
          <path d="M612 420 C611 404 609 390 606 376 M626 418 C626 406 625 396 623 386" stroke={l.hillNear} strokeWidth="2" fill="none" />
          <path d="M606 376 q-8 -1 -12 5 M606 376 q8 -2 12 3 M606 376 q-2 -7 -8 -9 M606 376 q4 -6 10 -7 M623 386 q-7 0 -10 5 M623 386 q7 -1 10 4 M623 386 q1 -6 7 -8" stroke={l.hillNear} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {[[660, 396], [676, 392], [742, 384], [790, 378], [816, 381], [846, 376]].map(([x, y]) => (
            <rect key={x} x={x} y={y} width="3" height="2" fill="#ffd79a" opacity={l.lamp * 0.9} />
          ))}
        </g>
        <rect x="715" y="126" width="10" height="324" fill="#e5d3b5" />
        <rect x="556" y="283" width="328" height="9" fill="#e5d3b5" />
        <path d="M556 126 H884 M556 126 V450" stroke={C.blueDeep} strokeWidth="6" opacity="0.18" />
        <path d="M725 126 V450 M556 292 H884" stroke={l.beam} strokeWidth="2" opacity="0.5" />
        <polygon points="522,450 918,450 932,470 508,470" fill="#f0e3c9" />
        <rect x="508" y="470" width="424" height="9" fill="#c4b196" />
        <rect x="508" y="479" width="424" height="14" fill={C.blueDeep} opacity="0.16" filter="url(#ws-blur)" />

        {/* A trailing plant on the sill */}
        <polygon points="846,420 884,420 880,450 850,450" fill="#c98160" />
        <rect x="843" y="415" width="44" height="8" rx="2" fill="#d6926e" />
        {[[856, 404, -30], [874, 400, 20], [864, 392, -4], [890, 430, 60], [896, 452, 80], [900, 474, 70], [840, 410, -60]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="11" ry="6" fill={i % 2 ? C.sage : "#869b76"} transform={`rotate(${r} ${x} ${y})`} />
        ))}

        {/* Curtain on the left, catching the light on its edge */}
        <path d="M452 96 H970" stroke={C.woodDark} strokeWidth="5" strokeLinecap="round" />
        <circle cx="452" cy="96" r="6" fill={C.woodDark} />
        <circle cx="970" cy="96" r="6" fill={C.woodDark} />
        <path d="M468 98 H572 C566 210 578 330 566 470 C562 520 556 544 548 556 H478 C472 420 482 300 468 98Z" fill="url(#ws-curtain)" />
        <path d="M572 100 C566 210 578 330 566 470 C562 520 556 544 548 556" stroke={l.beam} strokeWidth="3" fill="none" opacity="0.55" />
      </g>

      {/* The beam of light in the air */}
      <polygon points="556,126 884,126 1040,690 612,690" fill="url(#ws-beam-air)" opacity={l.beamO} filter="url(#ws-blur-lg)" style={{ mixBlendMode: "screen" }} />

      {/* Desk */}
      <polygon points="130,560 1310,560 1380,700 60,700" fill="url(#ws-desk)" />
      <path d="M160 590 C420 584 700 596 1000 588 S1260 592 1330 596 M110 640 C400 632 760 646 1080 636 S1300 640 1350 644 M200 575 C500 572 800 580 1280 574" stroke={C.woodDark} strokeWidth="1.4" fill="none" opacity="0.18" />
      <path d="M130 561 H1310" stroke={C.blueDeep} strokeWidth="4" opacity="0.25" filter="url(#ws-blur)" />
      <polygon points="60,700 1380,700 1380,740 60,740" fill="#6a4330" />
      <path d="M60 701 H1380" stroke={C.honey} strokeWidth="2" opacity="0.35" />
      <rect x="60" y="740" width="1320" height="160" fill="url(#ws-under)" />
      <rect x="84" y="740" width="34" height="160" fill="#5e3c2b" />
      <rect x="1322" y="740" width="34" height="160" fill="#5e3c2b" />
      <rect x="112" y="740" width="6" height="160" fill={C.honey} opacity="0.12" />
      {/* Lamp, lit when it gets dark */}
      <g>
        <ellipse cx="300" cy="600" rx="190" ry="60" fill="#ffcf8a" opacity={l.lamp * 0.5} filter="url(#ws-blur-lg)" />
        <ellipse cx="190" cy="600" rx="36" ry="8" fill={C.blueDeep} />
        <path d="M190 598 L178 470 L246 426" stroke={C.blueDeep} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M222 440 C214 410 236 392 262 400 C282 406 292 426 282 452 Z" fill="#6c7390" />
        <path d="M236 404 C248 398 262 400 272 408" stroke="#9aa1bb" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M222 440 C240 452 262 456 282 452 C266 462 238 458 222 440Z" fill="#ffe2a8" opacity={0.2 + l.lamp * 0.8} />
      </g>


      <g opacity={l.beamO * 1.3}>
        {patch.map((p) => (
          <polygon key={p} points={p} fill={l.beam} filter="url(#ws-blur)" />
        ))}
      </g>

      {/* Objects */}
      <g filter="url(#ws-wobble)">
        {desk.map(({ slug, x, y, s, Art, hit }) => {
          const project = projectBySlug(slug);
          if (!project) return null;
          const [hx, hy, hw, hh] = hit;
          const art = (
            <g transform={`translate(${x} ${y}) scale(${s})`} className={styles.objArt}>
              <Art />
            </g>
          );
          if (!interactive) return <g key={slug}>{art}</g>;
          return (
            <a
              key={slug}
              href={`/lab/workshop/projects/${slug}`}
              className={styles.obj}
              aria-label={`${project.title}: ${project.summary.split(". ")[0]}`}
              onClick={go(slug)}
            >
              <rect x={hx} y={hy} width={hw} height={hh} rx="14" className={styles.hit} />
              {art}
              <text x={hx + hw / 2} y={hy - 12} textAnchor="middle" className={styles.caption}>
                {project.title}
              </text>
            </a>
          );
        })}
      </g>

      {/* Light falling on the objects in the beam */}
      <g opacity={l.beamO} style={{ mixBlendMode: "soft-light" }} pointerEvents="none">
        {patch.map((p) => (
          <polygon key={p} points={p} fill="#fff4dc" transform="translate(0 -24)" filter="url(#ws-blur)" />
        ))}
      </g>

      {/* Dust drifting in the beam */}
      <g className={styles.dust} opacity={Math.min(1, l.beamO * 1.6)} pointerEvents="none">
        {dust.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#fff3d6" style={{ animationDelay: `${-i * 2.3}s` }} />
        ))}
      </g>

      {/* The hour's cast over the room, then the lamp's warmth on top */}
      <rect width="1440" height="900" fill={l.ambient} opacity={l.ambientO} style={{ mixBlendMode: "multiply" }} pointerEvents="none" />
      <ellipse cx="290" cy="590" rx="160" ry="46" fill="#ffc978" opacity={l.lamp * 0.22} pointerEvents="none" filter="url(#ws-blur-lg)" />
      <rect width="1440" height="900" filter="url(#ws-grain)" pointerEvents="none" />
    </svg>
  );
}
