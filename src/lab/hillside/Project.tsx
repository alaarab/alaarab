import { useState, type CSSProperties, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { projects, siteMeta } from "../../data/siteContent";
import type { Project } from "../../types";
import { externalLinks, projectBySlug } from "../util";
import { Knob, waveText } from "./Knob";
import { mix } from "./paint";
import { BASE, Clock, Fonts, LitWindow, Sprig } from "./parts";
import { Scene, type SceneSpec } from "./Scene";
import { m4lScene, notFoundScene, projectScenes } from "./scenes";
import { skies } from "./sky";
import styles from "./hillside.module.css";

const INK = "#3b3a24";
const NIGHT_PAPER = "#272d44";

export function HillsideProject() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectBySlug(slug);
  if (!project) return <Lost />;
  if (project.slug === "m4l-builder") return <M4lPage project={project} />;
  if (project.slug === "mina") return <MinaPage project={project} />;
  if (project.slug === "phren") return <PhrenPage project={project} />;
  return <StandardPage project={project} spec={projectScenes[project.slug] ?? notFoundScene} />;
}

/** Link colour: the project's own accent sunk into the ink, so it stays readable on paper. */
const accentVars = (p: Project): CSSProperties =>
  ({ "--accent": p.accent ? mix(p.accent, INK, 0.62) : "#4a6329" }) as CSSProperties;

function Page({
  project,
  spec,
  scene,
  heroClass,
  skyClass,
  sky,
  children,
  night,
}: {
  project: Project;
  spec: SceneSpec;
  scene?: ReactNode;
  heroClass?: string;
  skyClass?: string;
  sky?: ReactNode;
  children: ReactNode;
  night?: boolean;
}) {
  const s = skies[spec.time];
  return (
    <div className={`${styles.root} ${night ? styles.night : ""}`} style={accentVars(project)}>
      <Fonts />
      <header
        className={`${styles.hero} ${styles.projectHero} ${heroClass ?? ""}`}
        style={{ "--sky-text": s.text, "--sky-soft": s.textSoft } as CSSProperties}
      >
        {scene ?? <Scene spec={spec} className={styles.heroScene} decorative paper={night ? NIGHT_PAPER : undefined} />}
        <div className={`${styles.skyText} ${skyClass ?? ""}`}>
          <Link to={BASE} className={styles.homeLink}>
            {siteMeta.name}
          </Link>
          {sky}
        </div>
      </header>
      <p className={styles.figCaption}>{spec.label}</p>
      <main className={styles.paper}>{children}</main>
    </div>
  );
}

function Heading({ project, className }: { project: Project; className?: string }) {
  return (
    <>
      <h1 className={`${styles.projectTitle} ${className ?? ""}`}>{project.title}</h1>
      <p className={styles.projectMeta}>
        {project.category}, {project.year}
      </p>
    </>
  );
}

/** The project's words, as paragraphs rather than labelled boxes. */
function Prose({ project, mark, quote = true }: { project: Project; mark?: ReactNode; quote?: boolean }) {
  const links = externalLinks(project);
  const paras: Array<[string, string]> = [
    ["The problem.", project.problem],
    ["How it's built.", project.build],
    ["Where it stands.", project.impact],
    ["What it changes.", project.outcome],
  ];
  return (
    <div className={styles.column}>
      <p className={styles.lead}>{project.summary}</p>
      {quote && project.quote && <blockquote className={styles.quote}>{project.quote}</blockquote>}
      {paras.map(([k, v]) => (
        <p key={k}>
          {mark}
          <em className={styles.runIn}>{k}</em> {v}
        </p>
      ))}
      <p>
        <em className={styles.runIn}>Made with</em> {listSentence(project.stack)}.
      </p>
      {project.metrics && (
        <ul className={styles.particulars}>
          {project.metrics.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
      {links.length > 0 && (
        <p>
          <em className={styles.runIn}>Elsewhere:</em>{" "}
          {links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && (i === links.length - 1 ? " and " : ", ")}
              <a className={styles.inlineLink} href={l.href}>
                {l.label}
              </a>
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}

const listSentence = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

function Onward({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length]!;
  return (
    <>
      <Sprig />
      <nav className={`${styles.column} ${styles.onward}`} aria-label="More work">
        <Link to={BASE} className={styles.inlineLink}>
          Back up the hill
        </Link>
        <Link to={`${BASE}/projects/${next.slug}`} className={styles.inlineLink}>
          On to {next.title}
        </Link>
      </nav>
      <footer className={styles.footer}>
        <p>
          <a className={styles.inlineLink} href={siteMeta.emailHref}>
            {siteMeta.email}
          </a>
        </p>
      </footer>
    </>
  );
}

function StandardPage({ project, spec }: { project: Project; spec: SceneSpec }) {
  return (
    <Page project={project} spec={spec} sky={<Heading project={project} />}>
      <Prose project={project} />
      <Onward project={project} />
    </Page>
  );
}

function PhrenPage({ project }: { project: Project }) {
  const spec = projectScenes.phren!;
  return (
    <Page
      project={project}
      spec={spec}
      heroClass={styles.phrenHero}
      skyClass={styles.centered}
      sky={
        <>
          <Heading project={project} />
          {project.quote && <p className={styles.skyQuote}>{project.quote}</p>}
        </>
      }
    >
      <Prose project={project} quote={false} mark={<LitWindow />} />
      <Onward project={project} />
    </Page>
  );
}

function M4lPage({ project }: { project: Project }) {
  const [morph, setMorph] = useState(0);
  const spec = m4lScene(morph);
  return (
    <Page
      project={project}
      spec={spec}
      heroClass={styles.m4lHero}
      scene={<Scene spec={spec} className={styles.heroScene} decorative />}
      sky={<Heading project={project} />}
    >
      <div className={`${styles.column} ${styles.instrument}`}>
        <Knob value={morph} onChange={setMorph} />
        <p className={styles.instrumentNote}>
          The ridges are {waveText(morph)} waves. Turn the knob, or focus it and use the arrow keys, to change their shape.
        </p>
      </div>
      <Prose project={project} />
      <Onward project={project} />
    </Page>
  );
}

function MinaPage({ project }: { project: Project }) {
  return (
    <Page project={project} spec={projectScenes.mina!} night heroClass={styles.minaHero} skyClass={styles.minaSky} sky={<Heading project={project} />}>
      <div className={`${styles.column} ${styles.minaOpening}`}>
        <Clock hour={3} minute={0} />
      </div>
      <Prose project={project} />
      <Onward project={project} />
    </Page>
  );
}

function Lost() {
  const s = skies[notFoundScene.time];
  return (
    <div className={styles.root}>
      <Fonts />
      <header className={styles.hero} style={{ "--sky-text": s.text, "--sky-soft": s.textSoft } as CSSProperties}>
        <Scene spec={notFoundScene} className={styles.heroScene} decorative />
        <div className={styles.skyText}>
          <Link to={BASE} className={styles.homeLink}>
            {siteMeta.name}
          </Link>
          <h1 className={styles.projectTitle}>Nothing out here</h1>
          <p className={styles.title}>This path fades out before it reaches a project.</p>
          <p>
            <Link to={BASE} className={styles.skyLink}>
              Walk back to the hillside
            </Link>
          </p>
        </div>
      </header>
    </div>
  );
}
