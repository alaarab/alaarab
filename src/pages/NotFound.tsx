import { Link } from "react-router";
import { siteMeta } from "../data/siteContent";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import styles from "../styles/Portfolio.module.css";

export function NotFound() {
  useDocumentTitle(`Not found | ${siteMeta.name}`);

  return (
    <div className={styles.projectsShell}>
      <header className={styles.projectsHeader}>
        <div>
          <p className={styles.eyebrow}>404</p>
          <h1>Nothing here.</h1>
          <p className={styles.heroText}>
            That page does not exist, or it moved. Here are the ways back.
          </p>
        </div>
        <div className={styles.resumeLinks}>
          <Link to="/">Portfolio</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/resume">Resume</Link>
        </div>
      </header>
    </div>
  );
}
