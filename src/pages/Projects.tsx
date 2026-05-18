import { Link } from "react-router";
import { projects, siteMeta } from "../data/siteContent";
import { accentStyle } from "../lib/accentStyle";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import styles from "../styles/Portfolio.module.css";

export function Projects() {
  useDocumentTitle(`${siteMeta.name} | Projects`);

  return (
    <div className={styles.projectsShell}>
      <header className={styles.projectsHeader}>
        <div>
          <p className={styles.eyebrow}>Projects</p>
          <h1>Selected projects.</h1>
          <p className={styles.heroText}>
            A short index of current work and earlier case studies.
          </p>
        </div>
        <div className={styles.resumeLinks}>
          <Link to="/">Portfolio</Link>
          <Link to="/resume">Resume</Link>
          <a href={siteMeta.emailHref}>Email</a>
        </div>
      </header>

      <main className={styles.projectsList}>
        {projects.map((project) => (
          <article
            key={project.slug}
            className={styles.projectListCard}
            style={accentStyle(project.accent)}
          >
            <div className={styles.projectListMeta}>
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
            <div className={styles.projectListBody}>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <ul className={styles.tagList}>
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.projectLinks}>
              <Link to={`/projects/${project.slug}`}>View project</Link>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
