import { Link } from "react-router";
import { educationItems, experienceItems, projects, siteMeta } from "../data/siteContent";
import { buildPersonSchema } from "../lib/personSchema";
import { Page } from "../site/Page";
import { projectPath } from "../site/themes";
import styles from "../site/embroidery.module.css";

export function Resume() {
  const personSchema = buildPersonSchema({ siteMeta, experienceItems, educationItems });
  return (
    <Page title={siteMeta.name} eyebrow="Resume" lead={siteMeta.title} actions={
      <button type="button" className={styles.printButton} onClick={() => window.print()}>Print or save as PDF</button>
    }>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <div className={styles.documentSections}>
        <section className={styles.documentSection}>
          <h2 className={styles.expRole}>Summary</h2>
          <p>{siteMeta.summary}</p>
        </section>
        <section className={styles.documentSection}>
          <h2 className={styles.expRole}>Experience</h2>
          <ol className={styles.resumeEntries}>
            {experienceItems.map((item) => (
              <li key={`${item.company}-${item.years}`}>
                <h3 className={styles.expRole}>{item.role}</h3>
                <p className={styles.expWhere}>{item.company}</p>
                <p className={styles.entryMeta}>{item.years}, {item.location}</p>
                <p>{item.summary}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.documentSection}>
          <h2 className={styles.expRole}>Projects</h2>
          <ul className={styles.resumeEntries}>
            {projects.map((item) => (
              <li key={item.slug}>
                <h3 className={styles.otherHead}><Link to={projectPath(item.slug)}>{item.title}</Link></h3>
                <p className={styles.expWhere}>{item.category}</p>
                <p className={styles.entryMeta}>{item.year}, {item.status}</p>
                <p>{item.summary}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.documentSection}>
          <h2 className={styles.expRole}>Education</h2>
          <ul className={styles.resumeEntries}>
            {educationItems.map((item) => (
              <li key={item.school}>
                <h3 className={styles.expRole}>{item.school}</h3>
                <p>{item.detail}</p>
                <p className={styles.expWhere}>{item.years}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Page>
  );
}
