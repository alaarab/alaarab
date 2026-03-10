import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Portfolio.module.css";
import { projects, siteMeta } from "@/data/siteContent";

export default function ProjectsIndex() {
  return (
    <>
      <Head>
        <title>{siteMeta.name} | Projects</title>
        <meta
          name="description"
          content="Project index for Ala Arab with case studies and portfolio work."
        />
      </Head>

      <div className={styles.projectsShell}>
        <header className={styles.projectsHeader}>
          <div>
            <p className={styles.eyebrow}>Projects</p>
            <h1>Selected projects.</h1>
            <p className={styles.heroText}>
              A short index of current work and earlier case studies.
            </p>
          </div>
          <div className={styles.resumeLinks}>
            <Link href="/">Portfolio</Link>
            <Link href="/resume">Resume</Link>
            <a href={siteMeta.emailHref}>Email</a>
          </div>
        </header>

        <main className={styles.projectsList}>
          {projects.map((project) => (
            <article key={project.slug} className={styles.projectListCard}>
              <div className={styles.projectListMeta}>
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>
              <div className={styles.projectListBody}>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <ul className={styles.tagList}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.projectLinks}>
                <Link href={`/projects/${project.slug}`}>View project</Link>
              </div>
            </article>
          ))}
        </main>
      </div>
    </>
  );
}
