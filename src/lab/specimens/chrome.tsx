import { Link } from "react-router";
import { siteMeta } from "../../data/siteContent";
import styles from "./specimens.module.css";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Spectral:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap";

const KEYFRAMES =
  "@keyframes specimens-draw{to{stroke-dashoffset:0}}@keyframes specimens-settle{to{opacity:1}}";

export function Fonts() {
  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="default" />
      <style href="specimens-keyframes" precedence="default">
        {KEYFRAMES}
      </style>
    </>
  );
}

/** The book's running head: name on the left, the few ways in on the right. */
export function RunningHead({ plate }: { plate?: string }) {
  return (
    <header className={styles.head}>
      <Link to="/lab/specimens" className={styles.headName}>
        {siteMeta.name}
      </Link>
      {plate && <span className={styles.headPlate}>{plate}</span>}
      <nav aria-label="Site" className={styles.headNav}>
        <Link to="/lab/specimens#catalogue">Catalogue</Link>
        <Link to="/lab/specimens#correspondence">Contact</Link>
        <a href="/now">Now</a>
        <a href="/resume">Resume</a>
      </nav>
    </header>
  );
}
