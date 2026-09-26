import { useState, type CSSProperties, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import type { Project } from "../../types";
import { externalLinks, projectBySlug } from "../util";
import { BowlArt, MinaArt, PhrenArt } from "./art";
import { brush, FONT_HREF, InkDefs, INK, Mist, paperStyle, Seal, usePaperOverscroll } from "./ink";
import { Knob } from "./Knob";
import { motifFor } from "./motifs";
import styles from "./inkwash.module.css";

/** Page tone per showcase: paper, text ink and quiet ink. Everything else uses the default sheet. */
const tones: Record<string, { paper: string; mist: string; text: string; quiet: string; layout: string }> = {
  phren: { paper: "#f1efe9", mist: "#f5f3ee", text: "#36323f", quiet: "#625d6b", layout: "wide" },
  "m4l-builder": { paper: "#f4eee3", mist: "#f7f2e9", text: "#3a3129", quiet: "#6b5f52", layout: "left" },
  mina: { paper: "#e6e2d9", mist: "#ebe7df", text: "#302d2c", quiet: "#57524b", layout: "tall" },
};
const defaultTone = { paper: INK.paper, mist: INK.mist, text: INK.text, quiet: INK.quiet, layout: "small" };

const list = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

function Painting({ project, ink }: { project: Project; ink: string }) {
  const [level, setLevel] = useState(30);
  const motif = motifFor(project.slug);
  if (project.slug === "phren") return <PhrenArt className={styles.art} ink={ink} />;
  if (project.slug === "mina") return <MinaArt className={styles.art} ink={ink} />;
  if (project.slug === "m4l-builder") {
    const rings = Math.round(3 + (level / 100) * 21);
    return (
      <>
        <BowlArt className={styles.art} ink={ink} bronze="#7a5230" level={level / 100} />
        <Knob value={level} onChange={setLevel} label="Resonance" valueText={`${rings} rings`} ink={ink} />
      </>
    );
  }
  return (
    <svg className={styles.art} viewBox="0 0 400 300" role="img" aria-label={`Ink painting: ${motif.alt}.`}>
      {motif.art?.(ink)}
    </svg>
  );
}

/** One short brush mark between paragraphs, in place of headings. */
function Pause({ seed }: { seed: number }) {
  return (
    <svg className={styles.pause} viewBox="0 0 60 12" aria-hidden="true" focusable="false">
      <path d={brush([[4, 7], [30, 5], [56, 6]], 2.4, { seed, head: 0.25, tail: 0.05 })} fill="currentColor" filter="url(#iw-line)" />
    </svg>
  );
}

function Shell({ tone, children }: { tone: typeof defaultTone; children: ReactNode }) {
  usePaperOverscroll(tone.paper);
  const vars = { ...paperStyle, "--paper": tone.paper, "--mist": tone.mist, "--text": tone.text, "--quiet": tone.quiet } as CSSProperties;
  return (
    <div className={styles.root} style={vars}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <InkDefs />
      <nav className={styles.topNav} aria-label="Site">
        <Link to="/lab/inkwash" className={styles.homeLink}>
          <Seal size={22} />
          <span>Ala Arab</span>
        </Link>
      </nav>
      {children}
    </div>
  );
}

export function InkwashProject() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectBySlug(slug);

  if (!project) {
    return (
      <Shell tone={defaultTone}>
        <main className={styles.lost}>
          <svg className={styles.lostMist} viewBox="0 0 800 200" aria-hidden="true" focusable="false">
            <Mist bands={[[400, 110, 340, 30, 1]]} color="#d9d3c7" />
            <Mist bands={[[380, 100, 300, 18, 1]]} />
          </svg>
          <h1 className={styles.lostTitle}>Only mist here</h1>
          <p>There is no project at this address.</p>
          <p>
            <Link to="/lab/inkwash" className={styles.textLink}>
              Back to the work
            </Link>
          </p>
        </main>
      </Shell>
    );
  }

  const tone = tones[project.slug] ?? defaultTone;
  const motif = motifFor(project.slug);
  const links = externalLinks(project);
  const paragraphs = [project.problem, project.build, project.impact, project.outcome];

  return (
    <Shell tone={tone}>
      <main className={`${styles.page} ${styles[tone.layout]}`}>
        <header className={styles.head}>
          <h1 className={styles.projectTitle} style={{ color: motif.ink }}>
            {project.title}
          </h1>
          <p className={styles.meta}>
            {project.category}. {project.status}.
          </p>
        </header>

        <div className={styles.side}>
          <figure className={styles.painting} data-iw-bloom="">
            <Painting project={project} ink={motif.ink} />
          </figure>
          <div className={styles.inscription}>
            {project.quote && <p className={styles.quote}>{project.quote}</p>}
            <div className={styles.colophon}>
              <div>
                <p>
                  {project.year}. Made with {list.format(project.stack)}.
                </p>
                {project.metrics?.map((m) => <p key={m}>{m}</p>)}
              </div>
              <Seal size={28} />
            </div>
          </div>
        </div>

        <article className={styles.text}>
          <p className={styles.lead}>{project.summary}</p>
          {paragraphs.map((text, i) => (
            <div key={i}>
              <Pause seed={i + project.slug.length} />
              <p>{text}</p>
            </div>
          ))}
          {links.length > 0 && (
            <p className={styles.elsewhere}>
              {links.map((l) => (
                <a key={l.href} href={l.href} className={styles.textLink}>
                  {l.label}
                </a>
              ))}
            </p>
          )}
          <p className={styles.back}>
            <Link to="/lab/inkwash" className={styles.textLink}>
              Back to the work
            </Link>
          </p>
        </article>
      </main>
    </Shell>
  );
}
