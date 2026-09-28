import { Link } from "react-router";
import { siteMeta } from "../data/siteContent";
import { BASE } from "./themes";
import styles from "./embroidery.module.css";

/** The bar at the top of every inner page. */
export function TopNav() {
  return (
    <nav className={styles.topNav} aria-label="Site">
      <Link to={BASE} className={styles.topName}>
        Ala Arab
      </Link>
      <span className={styles.topLinks}>
        <Link to={"/#work"}>All work</Link>
        <Link to="/blog">Blog</Link>
      </span>
    </nav>
  );
}

/** Contact links at the foot of every inner page. */
export function PageFoot() {
  return (
    <footer className={styles.pageFoot}>
      <p className={styles.pageContact}>
        <a href={siteMeta.emailHref}>{siteMeta.email}</a>
        <a href={siteMeta.linkedinHref}>LinkedIn</a>
        <a href="/resume">Resume</a>
        <Link to="/blog">Blog</Link>
      </p>
    </footer>
  );
}
