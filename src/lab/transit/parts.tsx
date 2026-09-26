import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router";
import { siteMeta } from "../../data/siteContent";
import styles from "./transit.module.css";
import { transitPath, type TransitLine } from "./lines";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700;800;900&family=Overpass+Mono:wght@400;600;700&display=swap";

export function lineVars(line: TransitLine): CSSProperties {
  return { "--line": line.color } as CSSProperties;
}

/** A round line bullet: the line's letter on its color, like a subway bullet. */
export function Bullet({
  line,
  size = "md",
  labelled = false,
}: {
  line: TransitLine;
  size?: "sm" | "md" | "lg";
  labelled?: boolean;
}) {
  return (
    <span
      className={`${styles.bullet} ${styles[`bullet_${size}`]}`}
      style={lineVars(line)}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? `${line.name} line (${line.id})` : undefined}
      role={labelled ? "img" : undefined}
    >
      {line.id}
    </span>
  );
}

export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      {children}
      <footer className={styles.footer}>
        <span>
          {siteMeta.name} · {siteMeta.location}
        </span>
        <span className={styles.footerNote}>Direction C · Transit Map prototype</span>
        <Link to={transitPath()}>System map</Link>
      </footer>
    </div>
  );
}
