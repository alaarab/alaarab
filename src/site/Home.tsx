import { type CSSProperties, type ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { about, coursework, educationItems, experienceItems, interests, siteMeta } from "../data/siteContent";
import { hasPublishedPosts } from "../lib/posts";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import type { Project } from "../types";
import { Thumb } from "./mount";
import { activeProjects, admEra, clientAndSchool, madeProjects } from "./status";
import { Cloth, type DividerPattern, Divider, Knot, LabelStitch, Run, StitchedWords, thread } from "./stitch";
import { FONT_HREF, projectPath, themeFor } from "./themes";
import { visuals } from "./visuals";
import styles from "./embroidery.module.css";

/** The first sentence of a summary. */
export const oneLine = (p: Project) => p.summary.split(/(?<=\.)\s/)[0];

/** Years covered by strings like "2012 to 2025", "2025 to present", "2019". */
function span(years: string) {
  const [a, , b] = years.split(" ");
  const from = Number(a.slice(0, 4));
  const to = b === "present" ? 2026 : b ? Number(b.slice(0, 4)) : from;
  return Math.max(1, to - from);
}

/** A section: a stitched heading, its own divider pattern, then the content. */
function Section({ id, title, pattern, c, children }: { id: string; title: string; pattern: DividerPattern; c?: string; children: ReactNode }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className={styles.sectionHeading}>
        <span className={styles.srOnly}>{title}</span>
        <StitchedWords text={title} c={thread.walnut} size={30} width={Math.ceil(title.length * 15.5) + 8} className={styles.sectionWords} center />
      </h2>
      <Divider pattern={pattern} c={c ?? thread.madder} className={styles.sectionDivider} />
      {children}
    </section>
  );
}

/** A compact entry: a small mounted thumbnail of the real product if there is one. */
function Entries({ list }: { list: Project[] }) {
  return (
    <ul className={styles.entries}>
      {list.map((p) => {
        const hero = visuals[p.slug]?.hero[0];
        const c = themeFor(p.slug).thread;
        return (
          <li key={p.slug} className={styles.entry}>
            <div className={styles.entryThumb}>{hero ? <Thumb shot={hero} c={c} /> : <Knot c={c} className={styles.entryKnot} />}</div>
            <div className={styles.entryText}>
              <p className={styles.otherHead}>
                <Link to={projectPath(p.slug)}>{p.title}</Link>
              </p>
              <p className={styles.entryMeta}>
                {p.year}, {p.status.charAt(0).toLowerCase() + p.status.slice(1)}
              </p>
              <p className={styles.otherLine}>{oneLine(p)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function EmbroideryHome() {
  useDocumentTitle("Ala Arab | Portfolio");
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />

      <header className={styles.masthead}>
        <h1 className={styles.name}>Ala Arab</h1>
        <Cloth viewBox="0 0 200 8" className={styles.nameRule}>
          <Run c={thread.madder} w={1.6} dash={[4, 3.4]} d="M3 4 H197" />
        </Cloth>
        <p className={styles.title}>{siteMeta.title}</p>
        <p className={styles.intro}>{siteMeta.intro} Based in Los Angeles.</p>
        <nav className={styles.contactLine} aria-label="Contact">
          <a href={siteMeta.emailHref}>{siteMeta.email}</a>
          <a href={siteMeta.linkedinHref}>LinkedIn</a>
          <a href="/resume">Resume</a>
          <a href="/now">Now</a>
          {hasPublishedPosts && <Link to="/blog">Blog</Link>}
        </nav>
      </header>

      <Section id="about" title="About" pattern="long" c={thread.walnut}>
        <div className={styles.about}>
          {about.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </Section>

      <Section id="experience" title="Experience" pattern="chain" c={thread.woad}>
        <ol className={styles.expList}>
          {experienceItems.map((e) => {
            const n = span(e.years);
            return (
              <li key={e.company} className={styles.expItem}>
                <h3 className={styles.expRole}>{e.role}</h3>
                <p className={styles.expWhere}>
                  {e.company}, {e.location}
                </p>
                <p className={styles.expYears}>
                  <svg className={styles.yearsRule} style={{ "--n": n } as CSSProperties} aria-hidden="true" focusable="false">
                    <line x1="3" y1="5" x2="100%" y2="5" stroke="rgba(59,43,31,.3)" strokeWidth="1.6" strokeDasharray="5 4" transform="translate(0.5 0.7)" />
                    <line x1="3" y1="5" x2="100%" y2="5" stroke={thread.madder} strokeWidth="1.6" strokeDasharray="5 4" strokeLinecap="round" />
                  </svg>
                  <span>{e.years}</span>
                </p>
                <p className={styles.expSummary}>{e.summary}</p>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="education" title="Education" pattern="cross" c={thread.green}>
        <ul className={styles.eduList}>
          {educationItems.map((e) => (
            <li key={e.school}>
              <h3 className={styles.expRole}>{e.school}</h3>
              <p className={styles.expWhere}>
                {e.detail}, {e.years}
              </p>
            </li>
          ))}
        </ul>
        <h3 className={styles.subHeading}>Relevant coursework</h3>
        <ul className={styles.coursework}>
          {coursework.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>

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

      <Section id="interests" title="Interests" pattern="knots" c={thread.plum}>
        <p className={styles.interests}>
          {interests.map((it, k) => (
            <span key={it} className={styles.interest}>
              {k > 0 && <Knot c={[thread.madder, thread.woad, thread.weld, thread.green][k % 4]} className={styles.interestKnot} />}
              {it}
            </span>
          ))}
        </p>
      </Section>

      <footer className={styles.signatureWrap}>
        <div className={styles.signature}>
          <LabelStitch />
          <h2 className={styles.srOnly}>Contact</h2>
          <StitchedWords text="Ala Arab, Los Angeles" c={thread.madder} size={30} width={320} className={styles.signatureWords} center />
          <p className={styles.srOnly}>Ala Arab, Los Angeles</p>
          <p className={styles.signatureNote}>{siteMeta.availability}</p>
          <p className={styles.signatureLinks}>
            <a href={siteMeta.emailHref}>{siteMeta.email}</a>
            <a href={siteMeta.linkedinHref}>LinkedIn</a>
            <a href="/resume">Resume</a>
            {hasPublishedPosts && <Link to="/blog">Blog</Link>}
          </p>
        </div>
      </footer>
    </div>
  );
}
