import { nowItems, nowMeta } from "../data/siteContent";
import { Page } from "../site/Page";
import styles from "../site/embroidery.module.css";

export function Now() {
  return (
    <Page title="Current focus" eyebrow="What I'm doing now" lead={nowMeta.intro}>
      <p className={styles.documentNote}>
        As of {nowMeta.asOf}. Inspired by <a href="https://nownownow.com/about" target="_blank" rel="noreferrer noopener">nownownow.com</a>.
      </p>
      <div className={styles.documentSections}>
        {nowItems.map((item) => (
          <section key={item.heading} className={styles.documentSection}>
            <h2 className={styles.expRole}>{item.heading}</h2>
            <p>{item.body}</p>
          </section>
        ))}
      </div>
    </Page>
  );
}
