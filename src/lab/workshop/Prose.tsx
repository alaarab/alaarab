import { Link } from "react-router";
import { featuredProjects, projects } from "../../data/siteContent";
import type { Project } from "../../types";
import { externalLinks } from "../util";
import styles from "./workshop.module.css";

const listJoin = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** The next project on the desk (or shelf), so a reader can keep walking. */
export function nextProject(p: Project): Project {
  const order = [...featuredProjects, ...projects.filter((x) => !x.featured)];
  return order[(order.findIndex((x) => x.slug === p.slug) + 1) % order.length];
}

/** Everything a project page says, as margin-noted prose. Pass `skip` for parts a page already shows. */
export function Prose({ p, skip = [] }: { p: Project; skip?: ("summary" | "problem" | "build" | "impact" | "outcome")[] }) {
  const parts: [string, string, keyof Project][] = [
    ["why", p.problem, "problem"],
    ["how", p.build, "build"],
    ["where it is", p.impact, "impact"],
    ["what it changed", p.outcome, "outcome"],
  ];
  return (
    <div className={styles.prose}>
      {parts
        .filter(([, , k]) => !skip.includes(k as never))
        .map(([note, text]) => (
          <div key={note} className={styles.para}>
            <span className={styles.margin} aria-hidden="true">{note}</span>
            <p>{text}</p>
          </div>
        ))}
    </div>
  );
}

export function Particulars({ p }: { p: Project }) {
  const links = externalLinks(p);
  return (
    <div className={styles.particulars}>
      {p.metrics && p.metrics.length > 0 && (
        <p>
          <span className={styles.margin} aria-hidden="true">in short</span>
          {p.metrics.join("; ")}.
        </p>
      )}
      <p>
        <span className={styles.margin} aria-hidden="true">made with</span>
        {listJoin(p.stack)}.
      </p>
      {links.length > 0 && (
        <p>
          <span className={styles.margin} aria-hidden="true">elsewhere</span>
          {links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && ", "}
              <a href={l.href} className={styles.link}>{l.label}</a>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export function WalkOn({ p }: { p: Project }) {
  const next = nextProject(p);
  return (
    <nav className={styles.walkOn} aria-label="More projects">
      <Link to="/lab/workshop" className={styles.link}>Back to the desk</Link>
      <Link to={`/lab/workshop/projects/${next.slug}`} className={styles.link}>Next: {next.title}</Link>
    </nav>
  );
}
