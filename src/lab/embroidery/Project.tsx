import type { CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { siteMeta } from "../../data/siteContent";
import { useDocumentTitle } from "../../lib/useDocumentTitle";
import { externalLinks, projectBySlug } from "../util";
import { EmptyHoop, M4lPanel, MiniEmblem, Piece } from "./pieces";
import { Knots } from "./stitch";
import { BASE, FONT_HREF, neighbours, projectPath, themeFor } from "./themes";
import styles from "./embroidery.module.css";

const list = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function TopNav() {
  return (
    <nav className={styles.topNav} aria-label="Site">
      <Link to={BASE} className={styles.topName}>
        Ala Arab
      </Link>
      <Link to={`${BASE}#band`}>Back to the band</Link>
    </nav>
  );
}

function Contact() {
  return (
    <p className={styles.pageContact}>
      <a href={siteMeta.emailHref}>{siteMeta.email}</a>
      <a href={siteMeta.linkedinHref}>LinkedIn</a>
      <a href="/resume">Resume</a>
    </p>
  );
}

export function EmbroideryProject() {
  const { slug = "" } = useParams<{ slug: string }>();
  const project = projectBySlug(slug);
  useDocumentTitle(`${project?.title ?? "Not found"} | Ala Arab`);

  if (!project) {
    return (
      <div className={styles.root}>
        <link rel="stylesheet" href={FONT_HREF} precedence="default" />
        <TopNav />
        <main className={styles.missing}>
          <EmptyHoop ground="#e9e1cf" />
          <h1 className={styles.pageTitle}>Nothing stitched here yet</h1>
          <p>
            There is no project called <em>{slug}</em> on this cloth. Every piece is listed in the key on the{" "}
            <Link to={`${BASE}#band`}>front page</Link>.
          </p>
        </main>
      </div>
    );
  }

  const theme = themeFor(project.slug);
  const { prev, next } = neighbours(project.slug);
  const links = externalLinks(project);
  const layout = project.slug === "mina" ? "quiet" : project.slug === "m4l-builder" || theme.frame === "long" ? "wide" : "side";
  const art = `${project.title}, embroidered. ${theme.worked}`;

  return (
    <div
      className={styles.root}
      data-page={project.slug}
      style={{ "--ground": theme.ground, "--thread": theme.thread } as CSSProperties}
    >
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <TopNav />

      <main className={styles.projectMain} data-layout={layout}>
        <div className={styles.artCol}>
          {project.slug === "m4l-builder" ? (
            <M4lPanel label={art} />
          ) : (
            <figure className={styles.pieceFigure}>
              <Piece slug={project.slug} frame={theme.frame} ground={theme.ground} label={art} />
              <figcaption className={styles.pieceCaption}>{theme.worked}</figcaption>
            </figure>
          )}
        </div>

        <article className={styles.notes}>
          <p className={styles.notesMeta}>
            {project.year}. {project.status}.
          </p>
          <h1 className={styles.pageTitle}>{project.title}</h1>
          <p className={styles.lead}>{project.summary}</p>
          {project.quote && (
            <blockquote className={styles.quote}>
              <p>{project.quote}</p>
            </blockquote>
          )}
          <p>{project.problem}</p>
          <p>{project.build}</p>
          <p>{project.impact}</p>
          <p className={styles.outcome}>{project.outcome}</p>
          <p className={styles.stack}>Made with {list(project.stack)}.</p>
          {project.metrics && (
            <ul className={styles.counts}>
              {project.metrics.map((m) => (
                <li key={m}>
                  <svg viewBox="0 0 12 12" className={styles.keyKnot} aria-hidden="true" focusable="false">
                    <Knots c={theme.thread} r={3} pts={[[6, 6]]} />
                  </svg>
                  {m}
                </li>
              ))}
            </ul>
          )}
          {links.length > 0 && (
            <p className={styles.outLinks}>
              {links.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </p>
          )}
        </article>
      </main>

      <nav className={styles.along} aria-label="Along the band">
        {prev ? (
          <Link to={projectPath(prev.slug)} className={styles.alongLink} data-dir="prev">
            <MiniEmblem slug={prev.slug} />
            <span>
              <span className={styles.alongDir}>Before</span>
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={projectPath(next.slug)} className={styles.alongLink} data-dir="next">
            <span>
              <span className={styles.alongDir}>After</span>
              {next.title}
            </span>
            <MiniEmblem slug={next.slug} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <footer className={styles.pageFoot}>
        <Contact />
      </footer>
    </div>
  );
}
