import { Link } from "react-router";
import { SkipLink } from "../components/SkipLink";
import { nowItems, nowMeta, siteMeta } from "../data/siteContent";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import styles from "../styles/Portfolio.module.css";

export function Now() {
  useDocumentTitle(`Now | ${siteMeta.name}`);

  return (
    <div className={styles.projectsShell}>
      <SkipLink />
      <header className={styles.projectsHeader}>
        <div>
          <p className={styles.eyebrow}>What I'm doing now</p>
          <h1>Current focus</h1>
          <p className={styles.heroText}>{nowMeta.intro}</p>
          <p className={styles.sectionNote}>
            As of {nowMeta.asOf}. Inspired by{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noreferrer noopener"
            >
              nownownow.com
            </a>
            .
          </p>
        </div>
        <div className={styles.resumeLinks}>
          <Link to="/">Portfolio</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/resume">Resume</Link>
        </div>
      </header>

      <main id="main">
        <ul className={styles.nowList}>
          {nowItems.map((item) => (
            <li key={item.heading} className={styles.nowItem}>
              <h2>{item.heading}</h2>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
