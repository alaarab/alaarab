import { Link } from "react-router";
import { featuredProjects, nowItems, nowMeta, projects, siteMeta } from "../../data/siteContent";
import type { Project } from "../../types";
import { DeskScene } from "./DeskScene";
import { clockLabel, lightAt, useLocalHour } from "./light";
import { FontLinks, useIsPhone } from "./shared";
import styles from "./workshop.module.css";

const firstSentence = (s: string) => {
  const i = s.indexOf(". ");
  return i === -1 ? s : s.slice(0, i + 1);
};

function ProjectLine({ p }: { p: Project }) {
  return (
    <li className={styles.line}>
      <Link to={`/lab/workshop/projects/${p.slug}`} className={styles.lineLink}>
        <span className={styles.lineTitle}>{p.title}</span>
        <span className={styles.lineYear}>{p.year}</span>
        <span className={styles.lineText}>{firstSentence(p.summary)}</span>
      </Link>
    </li>
  );
}

export function WorkshopHome() {
  const { hour, known } = useLocalHour();
  const phone = useIsPhone();
  const night = lightAt(hour).ambientO > 0.3;
  const shelf = projects.filter((p) => !p.featured);

  return (
    <div className={styles.root}>
      <FontLinks />
      <header className={`${styles.top} ${night ? styles.topNight : ""}`}>
        <div className={styles.scene}>
          <DeskScene hour={hour} interactive={!phone} />
          {known && <p className={styles.clock}>Lit for {clockLabel(hour)}, your time</p>}
        </div>
        <div className={styles.titleCard}>
          <h1 className={styles.name}>{siteMeta.name}</h1>
          <p className={styles.role}>Full-stack developer, {siteMeta.location.split(",")[0]}</p>
          <p className={styles.hint}>
            {phone ? "The things on the desk are my projects. They're listed below." : "The things on the desk are my projects. Each one opens."}
          </p>
        </div>
      </header>

      <main className={styles.page}>
        <section className={styles.intro}>
          <p className={styles.lead}>{siteMeta.title}</p>
          <p>{siteMeta.intro}</p>
          <p>
            Before this, thirteen years at a consulting firm, where I built Intranet, the ERP that became the
            company's system of record.
          </p>
        </section>

        <section aria-labelledby="ws-desk-h">
          <h2 id="ws-desk-h" className={styles.h2}>On the desk</h2>
          <ul className={styles.lines}>
            {featuredProjects.map((p) => (
              <ProjectLine key={p.slug} p={p} />
            ))}
          </ul>
          <h2 className={styles.h2}>On the shelf</h2>
          <ul className={styles.lines}>
            {shelf.map((p) => (
              <ProjectLine key={p.slug} p={p} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="ws-now-h" className={styles.now}>
          <h2 id="ws-now-h" className={styles.h2}>Now</h2>
          <p className={styles.quiet}>As of {nowMeta.asOf}.</p>
          <ul className={styles.nowList}>
            {nowItems.slice(0, 4).map((n) => (
              <li key={n.heading}>{n.heading}</li>
            ))}
          </ul>
          <p>
            <Link to="/now" className={styles.link}>More on the now page</Link>
          </p>
        </section>

        <section aria-labelledby="ws-contact-h" className={styles.contact}>
          <h2 id="ws-contact-h" className={styles.h2}>Write to me</h2>
          <p>
            {siteMeta.availability} The easiest way is email:{" "}
            <a href={siteMeta.emailHref} className={styles.link}>{siteMeta.email}</a>. I'm also on{" "}
            <a href={siteMeta.linkedinHref} className={styles.link}>LinkedIn</a>, and the{" "}
            <Link to="/resume" className={styles.link}>resume</Link> has the long version.
          </p>
        </section>
        <footer className={styles.footer}>{siteMeta.name}, {siteMeta.location}</footer>
      </main>
    </div>
  );
}
