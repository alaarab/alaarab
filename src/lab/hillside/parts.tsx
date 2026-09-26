import styles from "./hillside.module.css";

export const BASE = "/lab/hillside";

export const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400&display=swap";

export function Fonts() {
  return <link rel="stylesheet" href={FONTS} precedence="default" />;
}

export const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0] ?? s;

/** A small hand-drawn grass sprig used between sections. */
export function Sprig() {
  return (
    <svg className={styles.sprig} viewBox="0 0 120 28" aria-hidden="true">
      <path d="M60 26 C58 18 52 10 44 6" />
      <path d="M60 26 C61 16 64 8 70 2" />
      <path d="M60 26 C63 20 70 15 80 13" />
      <path d="M60 26 C56 22 48 20 38 20" />
      <path d="M20 26 H100" className={styles.sprigGround} />
    </svg>
  );
}

/** A clock face, used on the Mina page. */
export function Clock({ hour, minute }: { hour: number; minute: number }) {
  const ha = ((hour % 12) + minute / 60) * 30;
  const ma = minute * 6;
  return (
    <svg className={styles.clock} viewBox="-50 -50 100 100" role="img" aria-label={`A clock reading ${hour}:${String(minute).padStart(2, "0")}`}>
      <circle r="44" className={styles.clockFace} />
      <circle r="44" className={styles.clockRim} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} y1={-38} y2={i % 3 === 0 ? -31 : -34} transform={`rotate(${i * 30})`} className={styles.clockTick} />
      ))}
      <line y1={4} y2={-22} transform={`rotate(${ha})`} className={styles.clockHand} />
      <line y1={5} y2={-33} transform={`rotate(${ma})`} className={styles.clockHandThin} />
      <circle r="2.4" className={styles.clockPin} />
    </svg>
  );
}

/** A small lit window, the Phren page's section mark. */
export function LitWindow() {
  return (
    <svg className={styles.litWindow} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" className={styles.litGlow} />
      <rect x="6" y="5.5" width="8" height="9.5" rx="0.6" className={styles.litPane} />
      <path d="M10 5.5 V15 M6 10 H14" className={styles.litBar} />
    </svg>
  );
}
