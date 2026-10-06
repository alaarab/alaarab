import { Link } from "react-router";
import { siteMeta } from "../data/siteContent";
import styles from "./embroidery.module.css";

/** The bar at the top of every inner page. */
export { SiteNav as TopNav } from "./Page";

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
