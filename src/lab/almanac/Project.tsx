import type { CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { projects } from "../../data/siteContent";
import { externalLinks, projectBySlug } from "../util";
import { Colophon, Fonts, Rule, StarGlyph, Topline } from "./parts";
import { plates } from "./plates";
import { BASE, plateNumber, projectHref } from "./sky";
import styles from "./almanac.module.css";

const list = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;

export function AlmanacProject() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectBySlug(slug);
  const plate = slug ? plates[slug] : undefined;

  if (!project || !plate) {
    return (
      <div className={styles.root}>
        <Fonts />
        <Topline back />
        <main className={styles.lost}>
          <svg viewBox="-60 -60 120 120" aria-hidden="true" className={styles.lostRing}>
            <circle r={52} fill="none" stroke="var(--line)" strokeWidth={0.8} />
            <circle r={44} fill="none" stroke="var(--line)" strokeWidth={0.4} strokeDasharray="1 4" />
          </svg>
          <h1>No star by that name</h1>
          <p>There is nothing catalogued as “{slug}” on this chart.</p>
          <p>
            <Link to={BASE}>Return to the chart</Link>
          </p>
        </main>
      </div>
    );
  }

  const theme = {
    "--ground": plate.ground,
    "--plane": plate.plane,
    "--accent": plate.accent,
  } as CSSProperties;
  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];
  const links = externalLinks(project);
  const { Art } = plate;

  return (
    <div className={`${styles.root} ${styles.projectRoot} ${plate.showcase ? styles[plate.showcase] : ""}`} style={theme}>
      <Fonts />
      <Topline back />
      <main className={styles.page}>
        <figure className={styles.plate}>
          <p className={styles.plateNo}>Plate {plateNumber(project.slug)}</p>
          <Art />
          <figcaption>{plate.caption}</figcaption>
        </figure>

        <div className={styles.column}>
          <header className={styles.titleBlock}>
            <h1>{project.title}</h1>
            <p className={styles.meta}>
              {project.year} · {project.status}
            </p>
          </header>

          <p className={styles.lede}>{project.summary}</p>

          {project.quote && (
            <blockquote className={styles.inscription}>
              <p>{project.quote}</p>
            </blockquote>
          )}

          <div className={styles.prose}>
            <p>{project.problem}</p>
            <p>{project.build}</p>
            <p>{project.impact}</p>
            <p className={styles.outcome}>{project.outcome}</p>
          </div>

          {project.metrics && (
            <ol className={styles.key} aria-label="Notes on the plate">
              {project.metrics.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ol>
          )}

          <p className={styles.stack}>Made with {list(project.stack)}.</p>

          {links.length > 0 && (
            <p className={styles.links}>
              {links.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </p>
          )}

          <Rule />

          <nav className={styles.onward} aria-label="More stars">
            <Link to={BASE}>
              <StarGlyph size={12} /> Return to the chart
            </Link>
            <Link to={projectHref(next.slug)}>Next star: {next.title}</Link>
          </nav>
        </div>
      </main>
      <Colophon />
    </div>
  );
}
