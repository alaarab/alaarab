import { Link } from "react-router";
import { contactLinks, siteMeta } from "../../data/siteContent";
import { BASE } from "./sky";
import styles from "./almanac.module.css";

export const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Cormorant+SC:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap";

/*
 * Keyframes live here, not in the CSS module: Bun's CSS modules hash
 * @keyframes names without rewriting the animation shorthand that uses them.
 */
const KEYFRAMES = `
@keyframes alm-turn { to { transform: rotate(360deg); } }
@keyframes alm-unturn { to { transform: rotate(-360deg); } }
@keyframes alm-draw { to { stroke-dashoffset: 0; } }
`;

export function Fonts() {
  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="default" />
      <style href="almanac-keyframes" precedence="default">
        {KEYFRAMES}
      </style>
    </>
  );
}

/**
 * Engraved star: four long rays, four short ones, and a small bright core.
 * `size` is the full width of the glyph in its own units.
 */
export function starPath(size: number) {
  const L = size / 2;
  const S = L * 0.46;
  const w = L * 0.13;
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const len = i % 2 === 0 ? L : S;
    const b = a + Math.PI / 8;
    pts.push(`${(Math.cos(a) * len).toFixed(2)} ${(Math.sin(a) * len).toFixed(2)}`);
    pts.push(`${(Math.cos(b) * w).toFixed(2)} ${(Math.sin(b) * w).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

export function StarGlyph({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={starPath(size)} fill="currentColor" />
    </svg>
  );
}

/** A thin engraved rule with a star at its centre. */
export function Rule() {
  return (
    <div className={styles.rule} aria-hidden="true">
      <span />
      <StarGlyph size={12} />
      <span />
    </div>
  );
}

export function Topline({ back }: { back?: boolean }) {
  return (
    <header className={styles.topline}>
      {back ? (
        <Link to={BASE} className={styles.back}>
          <StarGlyph size={11} />
          Return to the chart
        </Link>
      ) : (
        <span className={styles.plateMark}>Frontispiece</span>
      )}
      <nav aria-label="Contact" className={styles.topnav}>
        <a href={siteMeta.emailHref}>Email</a>
        <a href={siteMeta.linkedinHref}>LinkedIn</a>
        <a href="/resume">Resume</a>
      </nav>
    </header>
  );
}

export function Colophon() {
  return (
    <footer className={styles.colophon}>
      <Rule />
      <p>
        {contactLinks.map((l, i) => (
          <span key={l.href}>
            {i > 0 && " · "}
            <a href={l.href}>{l.label}</a>
          </span>
        ))}
      </p>
      <p className={styles.small}>Engraved in cream-gold on indigo. Set in Cormorant and EB Garamond.</p>
    </footer>
  );
}
