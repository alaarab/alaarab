import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import { SkipLink } from "../components/SkipLink";
import { siteMeta } from "../data/siteContent";
import { Divider } from "./stitch";
import { FONT_HREF } from "./themes";
import styles from "./embroidery.module.css";

export function SiteNav() {
  return (
    <nav className={styles.topNav} aria-label="Site">
      <Link to="/" className={styles.topName}>Ala Arab</Link>
      <div className={styles.navLinks}>
        <NavLink to="/projects">All work</NavLink>
        <NavLink to="/resume">Resume</NavLink>
        <NavLink to="/now">Now</NavLink>
        <NavLink to="/blog">Blog</NavLink>
      </div>
    </nav>
  );
}

/** The same linen and stitched rules as the accepted home and project pages. */
export function Page({ title, eyebrow, lead, children, actions }: {
  title: string;
  eyebrow?: string;
  lead?: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <SkipLink />
      <SiteNav />
      <main id="main" className={styles.documentMain}>
        <header className={styles.projectHead}>
          {eyebrow && <p className={styles.notesMeta}>{eyebrow}</p>}
          <h1 className={styles.pageTitle}>{title}</h1>
          <Divider pattern="running" className={styles.headDivider} />
          {lead && <p className={styles.lead}>{lead}</p>}
          {actions && <div className={styles.documentActions} data-print-hide>{actions}</div>}
        </header>
        {children}
      </main>
      <footer className={styles.pageFoot}>
        <p className={styles.pageContact}>
          <a href={siteMeta.emailHref}>{siteMeta.email}</a>
          <a href={siteMeta.linkedinHref}>LinkedIn</a>
          <Link to="/">Portfolio</Link>
        </p>
      </footer>
    </div>
  );
}
