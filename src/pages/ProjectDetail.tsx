import { Link, useParams } from "react-router";
import { ActionLinks } from "../components/ActionLinks";
import { SkipLink } from "../components/SkipLink";
import { projects, siteMeta } from "../data/siteContent";
import { accentStyle } from "../lib/accentStyle";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import styles from "../styles/Portfolio.module.css";
import type { Project } from "../types";
import { NotFound } from "./NotFound";

function pickRelated(current: Project, all: Project[]): Project[] {
  const sameThread = current.thread
    ? all.filter(
        (item) => item.slug !== current.slug && item.thread === current.thread,
      )
    : [];
  const sameCategory = all.filter(
    (item) =>
      item.slug !== current.slug &&
      item.category === current.category &&
      !sameThread.includes(item),
  );
  return [...sameThread, ...sameCategory].slice(0, 3);
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((item) => item.slug === slug);

  useDocumentTitle(
    project
      ? `${project.title} | ${siteMeta.name}`
      : `Not found | ${siteMeta.name}`,
  );

  if (!project) {
    return <NotFound />;
  }

  const related = pickRelated(project, projects);

  return (
    <div className={styles.projectPageShell} style={accentStyle(project.accent)}>
      <SkipLink />
      <header className={styles.projectPageHeader}>
        <div className={styles.resumeLinks}>
          <Link to="/">Portfolio</Link>
          <Link to="/projects">All projects</Link>
          <Link to="/resume">Resume</Link>
        </div>
        <div className={styles.projectHero}>
          <div className={styles.pillRow}>
            <p className={styles.eyebrow}>{project.category}</p>
            {project.thread ? (
              <span className={styles.threadPill}>{project.thread}</span>
            ) : null}
          </div>
          <h1>{project.title}</h1>
          <p className={styles.heroText}>{project.summary}</p>
          {project.metrics && project.metrics.length > 0 ? (
            <ul className={styles.metricsList}>
              {project.metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className={styles.projectFacts}>
          <div>
            <span>Year</span>
            <strong>{project.year}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{project.status}</strong>
          </div>
        </div>
        {project.links.length > 0 ? (
          <ActionLinks
            links={project.links}
            className={styles.projectHeaderLinks}
          />
        ) : null}
      </header>

      {project.quote ? (
        <blockquote className={styles.projectQuote}>
          <p>{project.quote}</p>
          <cite>from the project README</cite>
        </blockquote>
      ) : null}

      <main id="main" className={styles.projectStoryGrid}>
        <section className={styles.storyCard}>
          <h2>Overview</h2>
          <p>{project.problem}</p>
        </section>
        <section className={styles.storyCard}>
          <h2>Work</h2>
          <p>{project.build}</p>
        </section>
        <section className={styles.storyCard}>
          <h2>Result</h2>
          <p>{project.impact}</p>
        </section>
        <section className={styles.storyCard}>
          <h2>Stack</h2>
          <ul className={styles.tagList}>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>

      {related.length > 0 ? (
        <section className={styles.relatedSection}>
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Related</p>
            <h2>Next door</h2>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <Link
                key={item.slug}
                to={`/projects/${item.slug}`}
                className={styles.relatedCard}
                style={accentStyle(item.accent)}
              >
                <div className={styles.pillRow}>
                  <span className={styles.statusPill}>
                    {item.category} · {item.year}
                  </span>
                  {item.thread ? (
                    <span className={styles.threadPill}>{item.thread}</span>
                  ) : null}
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
