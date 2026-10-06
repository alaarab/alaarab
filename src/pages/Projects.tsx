import { Entries, Section } from "../site/Home";
import { Page } from "../site/Page";
import { activeProjects, admEra, clientAndSchool, madeProjects } from "../site/status";
import { thread } from "../site/stitch";
import styles from "../site/embroidery.module.css";

export function Projects() {
  return (
    <Page title="Selected projects." lead="A short index of current work and earlier case studies.">
      <Section id="work" title="Active projects" pattern="running">
        <Entries list={activeProjects} />
      </Section>
      <Section id="made" title="Things I've made" pattern="satin" c={thread.weld}>
        <Entries list={madeProjects} />
        <h3 className={styles.subHeading}>At ADM Associates</h3>
        <Entries list={admEra} />
        <h3 className={styles.subHeading}>Client and school work</h3>
        <Entries list={clientAndSchool} />
      </Section>
    </Page>
  );
}
