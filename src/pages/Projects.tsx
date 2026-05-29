import { Link } from "react-router";
import { SkipLink } from "../components/SkipLink";
import { projects, siteMeta } from "../data/siteContent";
import { accentStyle } from "../lib/accentStyle";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import styles from "../styles/Portfolio.module.css";
import type { Project } from "../types";

const CATEGORY_ORDER = [
  "Open source",
  "Flagship product",
  "Current",
  "Client work",
  "Legacy case study",
];

function groupByCategory(items: Project[]): Array<[string, Project[]]> {
  const groups = new Map<string, Project[]>();
  for (const item of items) {
    const bucket = groups.get(item.category) ?? [];
    bucket.push(item);
    groups.set(item.category, bucket);
  }
  const ordered: Array<[string, Project[]]> = [];
  for (const category of CATEGORY_ORDER) {
    const bucket = groups.get(category);
    if (bucket && bucket.length > 0) ordered.push([category, bucket]);
    groups.delete(category);
  }
  for (const entry of groups) ordered.push(entry);
  return ordered;
}

export function Projects() {
  useDocumentTitle(`${siteMeta.name} | Projects`);

  const groups = groupByCategory(projects);

  return (
    <div className={styles.projectsShell}>
      <SkipLink />
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

      <main id="main" className={styles.projectsGroups}>
        {groups.map(([category, items]) => (
          <section key={category} className={styles.projectsGroup}>
            <div className={styles.projectsGroupHeading}>
              <h2>{category}</h2>
              <span>{items.length}</span>
            </div>
            <div className={styles.projectsList}>
              {items.map((project) => (
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
                    <h3>{project.title}</h3>
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
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
