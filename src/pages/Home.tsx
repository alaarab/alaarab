import { Link } from "react-router";
import { ActionLinks } from "../components/ActionLinks";
import { SkipLink } from "../components/SkipLink";
import { Terminal } from "../components/Terminal";
import { accentStyle } from "../lib/accentStyle";
import {
  contactLinks,
  experienceItems,
  featuredProjects,
  quickStats,
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

/** The hero headline lives in siteMeta.title; we only emphasize one word here. */
function HeroHeadline() {
  const accent = "unglamorous";
  if (!siteMeta.title.includes(accent)) {
    return <h1>{siteMeta.title}</h1>;
  }
  const [head, tail] = siteMeta.title.split(accent);
  return (
    <h1>
      {head}
      <em>{accent}</em>
      {tail}
    </h1>
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
            <p className={styles.eyebrow}>Portfolio · 2026</p>
            <HeroHeadline />
            <p className={styles.heroText}>{siteMeta.intro}</p>
            <p className={styles.heroSubtext}>{siteMeta.summary}</p>
            <div className={styles.ctaRow}>
              <a className={styles.primaryCta} href="#projects">
                See the work
              </a>
              <Link className={styles.secondaryCta} to="/resume">
                Read the resume
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

        <section className={styles.section} aria-label="Interactive terminal">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>$ ./poke-around</p>
            <h2>Or just use the shell.</h2>
            <p className={styles.sectionNote}>
              This whole page is also a terminal. Type{" "}
              <code className={styles.kbd}>help</code>, list the{" "}
              <code className={styles.kbd}>projects</code>,{" "}
              <code className={styles.kbd}>cat</code> one open. Arrow keys walk
              your history, tab completes. <code className={styles.kbd}>sudo</code>{" "}
              if you're feeling brave.
            </p>
          </div>
          <div className={styles.terminalWrap}>
            <Terminal />
          </div>
        </section>

        <section id="projects" className={styles.section}>
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Featured work</p>
            <h2>Selected work</h2>
            <p className={styles.sectionNote}>
              Two threads run through most of the open-source side. Tooling
              for AI coding agents that fixes the "forgets everything between
              sessions" problem, and tooling for my own music — I produce
              electronic music in Ableton and started writing the plugins
              and bridges I kept wishing existed.
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
              <h2>Say hi.</h2>
              <p className={styles.contactText}>
                Product work, internal tooling, or selected consulting. Email
                lands; LinkedIn works; the resume is a click away.
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
