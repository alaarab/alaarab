import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Portfolio.module.css";
import {
  contactLinks,
  experienceItems,
  featuredProjects,
  quickStats,
  siteMeta,
} from "@/data/siteContent";

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteMeta.name} | Portfolio</title>
        <meta
          name="description"
          content="A refreshed portfolio for Ala Arab featuring projects, experience, and current areas of focus."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageShell}>
        <header className={styles.header}>
          <div className={styles.navWrap}>
            <a href="#top" className={styles.wordmark}>
              {siteMeta.name}
            </a>
            <nav className={styles.nav}>
              <a href="#projects">Projects</a>
              <a href="#experience">Experience</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </header>

        <main id="top" className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Portfolio</p>
              <h1>{siteMeta.title}</h1>
              <p className={styles.heroText}>{siteMeta.intro}</p>
              <p className={styles.heroSubtext}>{siteMeta.summary}</p>
              <div className={styles.ctaRow}>
                <a className={styles.primaryCta} href="#projects">
                  View featured work
                </a>
                <Link className={styles.secondaryCta} href="/resume">
                  Resume
                </Link>
              </div>
            </div>
            <aside className={styles.heroPanel}>
              <p className={styles.panelLabel}>At a glance</p>
              <ul className={styles.statList}>
                {quickStats.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
              <div className={styles.contactBlock}>
                <span>{siteMeta.availability}</span>
                <a href={siteMeta.linkedinHref} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </div>
            </aside>
          </section>

          <section id="projects" className={styles.section}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Featured work</p>
              <h2>Selected work</h2>
            </div>
            <div className={styles.projectGrid}>
              {featuredProjects.map((project) => (
                <article key={project.title} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <span className={styles.statusPill}>
                      {project.category} · {project.year}
                    </span>
                    <h3>{project.title}</h3>
                  </div>
                  <p>{project.summary}</p>
                  <p className={styles.outcome}>{project.outcome}</p>
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
                </article>
              ))}
            </div>
            <div className={styles.sectionCtaRow}>
              <Link className={styles.secondaryCta} href="/projects">
                All projects
              </Link>
            </div>
          </section>

          <section id="experience" className={styles.section}>
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Background</p>
              <h2>Experience</h2>
            </div>
            <div className={styles.timeline}>
              {experienceItems.map((item) => (
                <article key={`${item.company}-${item.years}`} className={styles.timelineItem}>
                  <div className={styles.timelineMeta}>
                    <span>{item.years}</span>
                    <span>{item.location}</span>
                  </div>
                  <div className={styles.timelineContent}>
                    <h3>{item.role}</h3>
                    <p className={styles.company}>{item.company}</p>
                    <p>{item.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className={styles.section}>
            <div className={styles.contactPanel}>
              <div>
                <p className={styles.eyebrow}>Contact</p>
                <h2>Simple, direct, and easy to reach.</h2>
                <p className={styles.contactText}>
                  If you want to talk about a product build, an internal tool,
                  or a consulting project, get in touch.
                </p>
              </div>
              <div className={styles.contactLinks}>
                {contactLinks.map((item) => (
                  item.href.startsWith("/") ? (
                    <Link key={item.label} href={item.href}>
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {item.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <p>{new Date().getFullYear()} Ala Arab</p>
        </footer>
      </div>
    </>
  );
}
