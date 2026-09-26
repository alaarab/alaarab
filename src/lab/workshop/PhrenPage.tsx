import { Link } from "react-router";
import type { Project } from "../../types";
import { Particulars, WalkOn } from "./Prose";
import { FontLinks } from "./shared";
import styles from "./workshop.module.css";

/** A pencil sketch in the margin: one store, seven ways in. */
function StoreSketch() {
  const dots = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    return [90 + Math.cos(a) * 64, 64 + Math.sin(a) * 48];
  });
  return (
    <svg className={styles.sketch} viewBox="0 0 180 128" aria-hidden="true">
      <g stroke="#5b6a8c" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.75">
        {dots.map(([x, y]) => (
          <path key={x} d={`M90 64 L${x.toFixed(1)} ${y.toFixed(1)}`} strokeDasharray="3 4" />
        ))}
        <rect x="74" y="52" width="32" height="24" rx="3" fill="#f8f0df" />
        <path d="M80 60 H100 M80 66 H96" />
        {dots.map(([x, y]) => (
          <circle key={`c${x}`} cx={x} cy={y} r="6" fill="#f8f0df" />
        ))}
      </g>
    </svg>
  );
}

const tabColors = ["#f4c77e", "#e2aaa3", "#c9d3b6", "#efe3cb"];

/** Phren: the notebook lies open on the desk and the pages hold the project. */
export function PhrenPage({ p }: { p: Project }) {
  return (
    <div className={`${styles.root} ${styles.phren}`}>
      <FontLinks />
      <div className={styles.phrenDesk}>
        <svg className={styles.phrenLight} viewBox="0 0 1440 1000" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="ws-phren-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="28" />
            </filter>
          </defs>
          <g filter="url(#ws-phren-soft)" fill="#ffe2a6">
            <polygon points="120,40 560,20 700,520 220,560" />
            <polygon points="600,18 1000,0 1160,480 740,516" />
          </g>
        </svg>
        <Link to="/lab/workshop" className={styles.backOver}>Back to the desk</Link>

        <main className={styles.notebook}>
          <span className={styles.ribbon} aria-hidden="true" />
          <div className={styles.spread}>
            <div className={styles.leaf}>
              <h1 className={styles.title}>{p.title}</h1>
              <p className={styles.meta}>{p.year}. {p.status}.</p>
              <p className={styles.lead}>{p.summary}</p>
              <p>{p.problem}</p>
              <p>{p.outcome}</p>
              <StoreSketch />
            </div>
            <section className={styles.leaf} aria-label="How it's built">
              <p>{p.build}</p>
              <p>{p.impact}</p>
            </section>
          </div>
          {p.metrics && (
            <ul className={styles.tabs} aria-label="Notes carried over">
              {p.metrics.map((m, i) => (
                <li key={m} style={{ background: tabColors[i % tabColors.length] }}>{m}</li>
              ))}
            </ul>
          )}
        </main>
      </div>

      <div className={styles.page}>
        {p.quote && <blockquote className={styles.quote}>{p.quote}</blockquote>}
        <Particulars p={p} />
        <WalkOn p={p} />
      </div>
    </div>
  );
}
