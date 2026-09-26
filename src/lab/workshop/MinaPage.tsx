import { Link } from "react-router";
import type { Project } from "../../types";
import { PhoneStand, SceneDefs } from "./objects";
import { Particulars, Prose, WalkOn } from "./Prose";
import { FontLinks } from "./shared";
import styles from "./workshop.module.css";

/** Mina: the phone on the nightstand, the room blue and dim, one warm lamp. */
export function MinaPage({ p }: { p: Project }) {
  return (
    <div className={`${styles.root} ${styles.mina}`}>
      <FontLinks />
      <div className={styles.close}>
        <svg className={styles.closeSvg} viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A phone on a small stand on a nightstand at night, a moon on its screen, one warm lamp beside it.">
          <SceneDefs />
          <defs>
            <linearGradient id="ws-mina-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1f2640" />
              <stop offset="1" stopColor="#2b3354" />
            </linearGradient>
            <linearGradient id="ws-mina-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a2140" />
              <stop offset="1" stopColor="#3a4672" />
            </linearGradient>
            <radialGradient id="ws-mina-lamp" cx="1010" cy="380" r="520" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#f7c783" stopOpacity="0.5" />
              <stop offset="0.25" stopColor="#e3a672" stopOpacity="0.22" />
              <stop offset="0.6" stopColor="#c98c6a" stopOpacity="0.07" />
              <stop offset="1" stopColor="#c98c6a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ws-mina-top" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3b3346" />
              <stop offset="0.75" stopColor="#7a5443" />
              <stop offset="1" stopColor="#8e6048" />
            </linearGradient>
          </defs>
          <rect width="1440" height="760" fill="url(#ws-mina-wall)" />

          {/* A window with the night outside */}
          <g filter="url(#ws-wobble)">
            <rect x="150" y="90" width="300" height="330" fill="#2d3450" />
            <rect x="164" y="104" width="272" height="302" fill="url(#ws-mina-sky)" />
            <path d="M164 330 C220 312 280 318 330 306 C380 296 410 310 436 306 V406 H164Z" fill="#232a47" />
            <path d="M164 366 C230 352 300 362 360 350 C400 344 420 352 436 350 V406 H164Z" fill="#1c2239" />
            <circle cx="370" cy="170" r="16" fill="#e9e1c8" opacity="0.9" />
            <circle cx="378" cy="164" r="15" fill="#1d2442" />
            {[[210, 150], [262, 196], [300, 132], [410, 240], [236, 250]].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="1.4" fill="#e9e1c8" opacity="0.7" />
            ))}
            {[[214, 356], [258, 350], [340, 346]].map(([x, y]) => (
              <rect key={x} x={x} y={y} width="3" height="2" fill="#f1c886" opacity="0.8" />
            ))}
            <rect x="296" y="104" width="8" height="302" fill="#2d3450" />
            <rect x="164" y="252" width="272" height="8" fill="#2d3450" />
            <rect x="136" y="420" width="328" height="14" fill="#343b59" />
          </g>
          <polygon points="164,406 436,406 640,760 250,760" fill="#8ea2d6" opacity="0.06" filter="url(#ws-blur-lg)" />

          {/* The lamp's warmth on the wall */}
          <rect width="1440" height="760" fill="url(#ws-mina-lamp)" />

          {/* Nightstand */}
          <g filter="url(#ws-wobble)">
            <polygon points="560,520 1180,520 1220,566 520,566" fill="url(#ws-mina-top)" />
            <rect x="520" y="566" width="700" height="30" fill="#3a2c34" />
            <rect x="540" y="596" width="660" height="164" fill="#2c2330" />
            <rect x="600" y="626" width="540" height="84" rx="4" fill="none" stroke="#3e3040" strokeWidth="3" />
            <circle cx="870" cy="668" r="7" fill="#8a6a4e" opacity="0.8" />
          </g>

          {/* Lamp */}
          <g filter="url(#ws-wobble)">
            <ellipse cx="1040" cy="540" rx="54" ry="10" fill="#4a3a3c" />
            <rect x="1034" y="430" width="12" height="110" fill="#5a4640" />
            <polygon points="966,440 1114,440 1086,340 994,340" fill="#f2c27f" />
            <polygon points="966,440 1114,440 1108,428 972,428" fill="#ffe0a8" />
          </g>
          <ellipse cx="1000" cy="536" rx="220" ry="22" fill="#f6c27c" opacity="0.4" filter="url(#ws-blur-lg)" />
          <ellipse cx="1040" cy="330" rx="70" ry="30" fill="#ffe6b8" opacity="0.35" filter="url(#ws-blur-lg)" />

          {/* The phone, small, with its moon */}
          <g transform="translate(760 532) scale(1.9)">
            <PhoneStand glow={1} />
          </g>
          <rect width="1440" height="760" filter="url(#ws-grain)" pointerEvents="none" />
        </svg>
        <Link to="/lab/workshop" className={styles.backOver}>Back to the desk</Link>
      </div>
      <main className={styles.page}>
        <h1 className={styles.title}>{p.title}</h1>
        <p className={styles.meta}>{p.year}. {p.status}.</p>
        <p className={styles.lead}>{p.summary}</p>
        {p.quote && <blockquote className={styles.quote}>{p.quote}</blockquote>}
        <Prose p={p} />
        <Particulars p={p} />
        <WalkOn p={p} />
      </main>
    </div>
  );
}
