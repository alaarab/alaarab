import Head from "next/head";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "@/styles/Portfolio.module.css";
import { projects, siteMeta } from "@/data/siteContent";

export default function ProjectPage({ project }) {
  return (
    <>
      <Head>
        <title>
          {project.title} | {siteMeta.name}
        </title>
        <meta name="description" content={project.summary} />
      </Head>

      <div className={styles.projectPageShell}>
        <header className={styles.projectPageHeader}>
          <div className={styles.resumeLinks}>
            <Link href="/">Portfolio</Link>
            <Link href="/projects">All projects</Link>
            <Link href="/resume">Resume</Link>
            <ThemeToggle />
          </div>
          <div className={styles.projectHero}>
            <p className={styles.eyebrow}>{project.category}</p>
            <h1>{project.title}</h1>
            <p className={styles.heroText}>{project.summary}</p>
          </div>
          <div className={styles.projectFacts}>
            <div>
              <span>Year</span>
              <strong>{project.year}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{project.status}</strong>
            </div>
          </div>
        </header>

        <Reveal as="main" className={styles.projectStoryGrid}>
          <section className={styles.storyCard}>
            <h2>Overview</h2>
            <p>{project.problem}</p>
          </section>
          <section className={styles.storyCard}>
            <h2>Work</h2>
            <p>{project.build}</p>
          </section>
          <section className={styles.storyCard}>
            <h2>Result</h2>
            <p>{project.impact}</p>
          </section>
          <section className={styles.storyCard}>
            <h2>Stack</h2>
            <ul className={styles.tagList}>
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.projectLinks}>
              {project.links.map((link) =>
                link.href.startsWith("/") ? (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: projects.map((project) => ({ params: { slug: project.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = projects.find((item) => item.slug === params.slug);

  return {
    props: {
      project,
    },
  };
}
