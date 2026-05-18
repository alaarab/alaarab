import { Link, useParams } from "react-router";
import { ActionLinks } from "../components/ActionLinks";
import { projects, siteMeta } from "../data/siteContent";
import { accentStyle } from "../lib/accentStyle";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import styles from "../styles/Portfolio.module.css";
import { NotFound } from "./NotFound";

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

  return (
    <div className={styles.projectPageShell} style={accentStyle(project.accent)}>
      <header className={styles.projectPageHeader}>
        <div className={styles.resumeLinks}>
          <Link to="/">Portfolio</Link>
          <Link to="/projects">All projects</Link>
          <Link to="/resume">Resume</Link>
        </div>
        <div className={styles.projectHero}>
          <p className={styles.eyebrow}>{project.category}</p>
          <h1>{project.title}</h1>
          <p className={styles.heroText}>{project.summary}</p>
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
      </header>

      <main className={styles.projectStoryGrid}>
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
          <ActionLinks links={project.links} className={styles.projectLinks} />
        </section>
      </main>
    </div>
  );
}
