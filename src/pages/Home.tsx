import { Link } from "react-router";
import { ActionLinks } from "../components/ActionLinks";
import { SkipLink } from "../components/SkipLink";
import { Terminal } from "../components/Terminal";
import { accentStyle } from "../lib/accentStyle";
import {
  contactLinks,
  experienceItems,
  featuredProjects,
  siteMeta,
} from "../data/siteContent";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import styles from "../styles/Portfolio.module.css";
import type { Project } from "../types";

function FeaturedCard({ project }: { project: Project }) {
  return (
    <article
      className={styles.projectCard}
      style={accentStyle(project.accent)}
    >
      <div className={styles.projectHeader}>
        <div className={styles.pillRow}>
          <span className={styles.statusPill}>
            {project.category} · {project.year}
          </span>
          {project.thread ? (
            <span className={styles.threadPill}>{project.thread}</span>
          ) : null}
        </div>
        <h3>{project.title}</h3>
      </div>
      <p>{project.summary}</p>
      {project.metrics && project.metrics.length > 0 ? (
        <ul className={styles.metricsList}>
          {project.metrics.map((metric) => (
            <li key={metric}>{metric}</li>
          ))}
        </ul>
      ) : null}
      <p className={styles.outcome}>{project.outcome}</p>
      <ul className={styles.tagList}>
        {project.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ActionLinks links={project.links} className={styles.projectLinks} />
    </article>
  );
}

/** The tagline lives in siteMeta.title; we only emphasize one phrase here. */
function HeroTagline() {
  const accent = "the whole stack";
  if (!siteMeta.title.includes(accent)) {
    return <>{siteMeta.title}</>;
  }
  const [head, tail] = siteMeta.title.split(accent);
  return (
    <>
      {head}
      <em className={styles.taglineEm}>{accent}</em>
      {tail}
    </>
  );
}

export function Home() {
  useDocumentTitle(`${siteMeta.name} | Portfolio`);

  const CURRENT_CATEGORIES = new Set(["Open source", "Current"]);
  const currentlyBuildingProjects = featuredProjects.filter((project) =>
    CURRENT_CATEGORIES.has(project.category),
  );
  const previouslyProjects = featuredProjects.filter(
    (project) => !CURRENT_CATEGORIES.has(project.category),
  );

  return (
    <div className={styles.pageShell}>
      <SkipLink targetId="top" />
      <header className={styles.header}>
        <div className={styles.marquee}>
          <span>
            <span className={styles.statusDot} aria-hidden="true" />
            Open to selected consulting
          </span>
          <span className={styles.marqueeSep}>/</span>
          <span>Los Angeles, CA</span>
          <span className={styles.marqueeSep}>/</span>
          <span>Systems Software Architect @ Qualus</span>
          <span className={styles.marqueeSep}>/</span>
          <span>May 2026</span>
        </div>
        <div className={styles.navWrap}>
          <a href="#top" className={styles.wordmark}>
            {siteMeta.name}
          </a>
          <nav className={styles.nav}>
            <a href="#projects">Work</a>
            <a href="#experience">Experience</a>
            <Link to="/now">Now</Link>
            <Link to="/resume">Resume</Link>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top" className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Personal portfolio</p>
            <h1>{siteMeta.name}</h1>
            <p className={styles.heroLede}>
              <HeroTagline />
            </p>
            <p className={styles.heroSubtext}>{siteMeta.intro}</p>
            <div className={styles.ctaRow}>
              <a className={styles.primaryCta} href="#projects">
                See the work
              </a>
              <Link className={styles.secondaryCta} to="/resume">
                Read the resume
              </Link>
            </div>
          </div>
          <div className={styles.heroSide}>
            <Terminal />
            <p className={styles.terminalTip}>
              New here? type <code className={styles.kbd}>help</code> or{" "}
              <code className={styles.kbd}>ls</code> the projects. Arrow keys
              for history, tab to complete. Or just keep scrolling ↓
            </p>
          </div>
        </section>

        <section id="projects" className={styles.section}>
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Featured work</p>
            <h2>Selected work</h2>
            <p className={styles.sectionNote}>
              Two threads run through most of the open-source work: tooling
              for AI coding agents that keeps context across sessions, and
              tooling for my own music. I produce electronic music in Ableton
              and write the plugins and bridges I needed.
            </p>
          </div>

          {currentlyBuildingProjects.length > 0 ? (
            <div className={styles.featuredGroup}>
              <p className={styles.featuredGroupLabel}>Currently building</p>
              <div className={styles.projectGrid}>
                {currentlyBuildingProjects.map((project) => (
                  <FeaturedCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          ) : null}

          {previouslyProjects.length > 0 ? (
            <div className={styles.featuredGroup}>
              <p className={styles.featuredGroupLabel}>Previously</p>
              <div className={styles.projectGrid}>
                {previouslyProjects.map((project) => (
                  <FeaturedCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          ) : null}

          <div className={styles.sectionCtaRow}>
            <Link className={styles.secondaryCta} to="/projects">
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
              <article
                key={`${item.company}-${item.years}`}
                className={styles.timelineItem}
              >
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
              <h2>Get in touch</h2>
              <p className={styles.contactText}>
                Open to product work, internal tooling, or selected
                consulting. Email or LinkedIn is the fastest way to reach me.
              </p>
            </div>
            <ActionLinks links={contactLinks} className={styles.contactLinks} />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Ala Arab</p>
        <p className={styles.footerNote}>
          Built with Bun, React 19, and TypeScript. Source on{" "}
          <a
            href="https://github.com/alaarab/alaarab"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          . What I'm focused on right{" "}
          <Link to="/now">now</Link>.
        </p>
      </footer>
    </div>
  );
}
