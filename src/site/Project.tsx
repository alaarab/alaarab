import type { CSSProperties, ReactNode } from "react";
import { Link, useParams } from "react-router";
import { siteMeta } from "../data/siteContent";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { externalLinks, projectBySlug } from "./util";
import { Explainer, Mounted, MountedVideo, Shots } from "./mount";
import { readingOrder } from "./status";
import { Divider, Knot } from "./stitch";
import { BASE, FONT_HREF, projectPath, themeFor } from "./themes";
import { type Media, visuals } from "./visuals";
import styles from "./embroidery.module.css";

const list = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function neighbours(slug: string) {
  const k = readingOrder.findIndex((p) => p.slug === slug);
  return { prev: k > 0 ? readingOrder[k - 1] : undefined, next: k >= 0 ? readingOrder[k + 1] : undefined };
}

function TopNav() {
  return (
    <nav className={styles.topNav} aria-label="Site">
      <Link to={BASE} className={styles.topName}>
        Ala Arab
      </Link>
      <Link to={"/#work"}>All work</Link>
    </nav>
  );
}

function MediaBlock({ media, c, label }: { media: Media; c: string; label: string }) {
  if ("steps" in media) return <Explainer steps={media.steps} c={c} label={label} />;
  if ("video" in media) return <MountedVideo video={media.video} c={c} />;
  return <Mounted shot={media.shot} c={c} />;
}

/** One plain explanation, with the real thing beside it when there is one. */
function Explain({ id, title, text, media, c, label }: { id: string; title: string; text: string; media?: Media; c: string; label: string }) {
  return (
    <section className={styles.explain} aria-labelledby={id} data-media={media ? "" : undefined} data-phone={media && isPhone(media) ? "" : undefined}>
      <div className={styles.explainText}>
        <h2 id={id} className={styles.explainHeading}>
          {title}
        </h2>
        <p>{text}</p>
      </div>
      {media && (
        <div className={styles.explainMedia}>
          <MediaBlock media={media} c={c} label={label} />
        </div>
      )}
    </section>
  );
}

const isPhone = (m: Media) => ("steps" in m ? Boolean(m.steps[0]?.phone) : "video" in m ? Boolean(m.video.phone) : Boolean(m.shot.phone));

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
          <h1 className={styles.pageTitle}>Nothing sewn here yet</h1>
          <Divider pattern="running" className={styles.headDivider} />
          <p>
            There is no project called <em>{slug}</em>. Everything I've made is listed on the <Link to={"/#work"}>front page</Link>.
          </p>
        </main>
      </div>
    );
  }

  const theme = themeFor(project.slug);
  const v = visuals[project.slug];
  const pairs = v?.pairs ?? {};
  const { prev, next } = neighbours(project.slug);
  const links = externalLinks(project);
  const c = theme.thread;
  const walk = `A walkthrough of ${project.title}`;

  const blocks: ReactNode[] = [
    <Explain key="p" id="problem" title="The problem" text={project.problem} media={pairs.problem} c={c} label={walk} />,
    <Explain key="b" id="build" title="What I built" text={project.build} media={pairs.build} c={c} label={walk} />,
    <Explain key="i" id="impact" title="Where it is now" text={project.impact} media={pairs.impact} c={c} label={walk} />,
  ];

  return (
    <div className={styles.root} data-page={project.slug} style={{ "--ground": theme.ground, "--thread": c } as CSSProperties}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <TopNav />

      <main className={styles.projectMain}>
        <header className={styles.projectHead}>
          <p className={styles.notesMeta}>
            {project.year}. {project.status}.
          </p>
          <h1 className={styles.pageTitle}>{project.title}</h1>
          <Divider pattern={v ? "running" : "satin"} c={c} className={styles.headDivider} />
          <p className={styles.lead}>{project.summary}</p>
        </header>

        {v && (
          <div className={styles.heroShots}>
            <Shots shots={v.hero} c={c} eager />
          </div>
        )}

        {project.quote && (
          <blockquote className={styles.quote}>
            <p>{project.quote}</p>
          </blockquote>
        )}

        <div className={styles.explanations}>{blocks}</div>

        <article className={styles.notes}>
          <p className={styles.outcome}>{project.outcome}</p>
          <p className={styles.stack}>Made with {list(project.stack)}.</p>
          {project.metrics && (
            <ul className={styles.counts}>
              {project.metrics.map((m) => (
                <li key={m}>
                  <Knot c={c} className={styles.keyKnot} />
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

      <nav className={styles.along} aria-label="More work">
        {prev ? (
          <Link to={projectPath(prev.slug)} className={styles.alongLink} data-dir="prev">
            <span className={styles.alongDir}>Before</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={projectPath(next.slug)} className={styles.alongLink} data-dir="next">
            <span className={styles.alongDir}>Next</span>
            {next.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <footer className={styles.pageFoot}>
        <p className={styles.pageContact}>
          <a href={siteMeta.emailHref}>{siteMeta.email}</a>
          <a href={siteMeta.linkedinHref}>LinkedIn</a>
          <a href="/resume">Resume</a>
        </p>
      </footer>
    </div>
  );
}
