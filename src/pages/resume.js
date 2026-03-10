import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Portfolio.module.css";
import {
  educationItems,
  experienceItems,
  projects,
  siteMeta,
} from "@/data/siteContent";

export default function Resume() {
  return (
    <>
      <Head>
        <title>{siteMeta.name} | Resume</title>
        <meta
          name="description"
          content="Resume page for Ala Arab with experience and education."
        />
      </Head>

      <div className={styles.resumeShell}>
        <header className={styles.resumeHeader}>
          <div>
            <p className={styles.eyebrow}>Resume</p>
            <h1>{siteMeta.name}</h1>
            <p className={styles.resumeLead}>{siteMeta.title}</p>
          </div>
          <div className={styles.resumeLinks}>
            <Link href="/">Back to portfolio</Link>
            <a href={siteMeta.emailHref}>Email</a>
            <a href={siteMeta.linkedinHref} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </header>

        <main className={styles.resumeContent}>
          <section className={styles.resumeSection}>
            <h2>Summary</h2>
            <p>{siteMeta.summary}</p>
          </section>

          <section className={styles.resumeSection}>
            <h2>Experience</h2>
            <div className={styles.resumeStack}>
              {experienceItems.map((item) => (
                <article key={`${item.company}-${item.years}`} className={styles.resumeCard}>
                  <div className={styles.resumeRow}>
                    <div>
                      <h3>{item.role}</h3>
                      <p className={styles.company}>{item.company}</p>
                    </div>
                    <div className={styles.resumeMeta}>
                      <span>{item.years}</span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <p>{item.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.resumeSection}>
            <h2>Projects</h2>
            <div className={styles.resumeStack}>
              {projects.map((item) => (
                <article key={item.slug} className={styles.resumeCard}>
                  <div className={styles.resumeRow}>
                    <div>
                      <h3>{item.title}</h3>
                      <p className={styles.company}>{item.category}</p>
                    </div>
                    <div className={styles.resumeMeta}>
                      <span>{item.year}</span>
                      <span>{item.status}</span>
                    </div>
                  </div>
                  <p>{item.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.resumeSection}>
            <h2>Education</h2>
            <div className={styles.resumeStack}>
              {educationItems.map((item) => (
                <article key={item.school} className={styles.resumeCard}>
                  <div className={styles.resumeRow}>
                    <div>
                      <h3>{item.school}</h3>
                      <p>{item.detail}</p>
                    </div>
                    <div className={styles.resumeMeta}>
                      <span>{item.years}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
