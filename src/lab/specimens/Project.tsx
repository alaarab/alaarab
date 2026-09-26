import { useMemo, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { projects } from "../../data/siteContent";
import type { Project } from "../../types";
import { externalLinks, projectBySlug } from "../util";
import { Fonts, RunningHead } from "./chrome";
import { CapsuleKnob } from "./Knob";
import { noteFor } from "./notes";
import { Annotations, PlantSvg, specimenOpts, type Note } from "./Plant";
import { grow, mixHex, washOf } from "./grower";
import { captionFor, plateFor, roman } from "./themes";
import styles from "./specimens.module.css";

const BASE = "/lab/specimens";
const PAPER = "#f1ead9";

function theme(p: Project): CSSProperties {
  if (p.slug === "mina") return {};
  const accent = noteFor(p.slug).hue ?? p.accent ?? "#b56a6a";
  return {
    ["--paper" as string]: mixHex(PAPER, accent, 0.045),
    ["--wash" as string]: washOf(accent, 46),
  };
}

function Plate({ project }: { project: Project }) {
  const [wave, setWave] = useState(0);
  const spec = plateFor(project, "page", wave);
  const model = useMemo(() => grow(specimenOpts(project, spec.frame, spec.extra)), [project, wave]); // eslint-disable-line react-hooks/exhaustive-deps
  const metrics = project.metrics ?? [];
  const notes: Note[] = [
    ...model.leafAnchors.map((anchor, i) => ({ anchor, text: project.stack[i] ?? "" })),
    ...(project.slug === "phren" ? model.rootAnchors : model.flowerAnchors).map((anchor, i) => ({
      anchor,
      text: metrics[i] ?? "",
    })),
  ].filter((n) => n.text);
  const note = noteFor(project.slug);
  const no = roman(projects.indexOf(project) + 1);

  return (
    <figure className={styles.plate}>
      <PlantSvg
        model={model}
        frame={spec.frame}
        under={spec.under}
        crop={!spec.under}
        className={styles.pagePlant}
        label={`Plate ${no}: ${project.title}, drawn as a plant with ${project.stack.length} labeled leaves${
          metrics.length ? ` and ${metrics.length} labeled ${project.slug === "phren" ? "roots" : "flowers"}` : ""
        }.`}
      >
        <Annotations notes={notes} frame={spec.frame} />
      </PlantSvg>
      <ol className={styles.key} aria-label="Key to the plate">
        {notes.map((n, i) => (
          <li key={i}>
            <span className={styles.keyNo}>{i + 1}</span> {n.text}
          </li>
        ))}
      </ol>
      {project.slug === "m4l-builder" && <CapsuleKnob value={wave} onChange={setWave} />}
      <figcaption className={styles.plateCaption}>
        <span className={styles.plateNo}>Plate {no}.</span> {captionFor(project)}
        {note.habitat && (
          <span className={styles.habitat}>
            <em>Habitat.</em> {note.habitat} <em>Flowering.</em> {note.flowering}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function Notes({ project }: { project: Project }) {
  const links = externalLinks(project);
  return (
    <article className={styles.fieldNotes}>
      <p className={styles.lede}>{project.summary}</p>
      {project.quote && (
        <blockquote className={styles.quote}>
          <p>{project.quote}</p>
        </blockquote>
      )}
      <p className={styles.body}>
        <em className={styles.runIn}>The problem.</em> {project.problem}
      </p>
      <p className={styles.body}>
        <em className={styles.runIn}>How it was built.</em> {project.build}
      </p>
      <p className={styles.body}>
        <em className={styles.runIn}>What came of it.</em> {project.impact} {project.outcome}
      </p>
      {links.length > 0 && (
        <p className={styles.body}>
          <em className={styles.runIn}>Further reading.</em>{" "}
          {links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && (i === links.length - 1 ? " and " : ", ")}
              <a href={l.href}>{l.label}</a>
            </span>
          ))}
          .
        </p>
      )}
    </article>
  );
}

function Turn({ project }: { project: Project }) {
  const i = projects.indexOf(project);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return (
    <nav className={styles.turn} aria-label="Other plates">
      <Link to={`${BASE}/projects/${prev.slug}`} rel="prev">
        <span aria-hidden="true">&larr;</span> Plate {roman(i === 0 ? projects.length : i)}, {prev.title}
      </Link>
      <Link to={`${BASE}#catalogue`}>The catalogue</Link>
      <Link to={`${BASE}/projects/${next.slug}`} rel="next">
        Plate {roman(((i + 1) % projects.length) + 1)}, {next.title} <span aria-hidden="true">&rarr;</span>
      </Link>
    </nav>
  );
}

export function SpecimensProject() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectBySlug(slug);

  if (!project) {
    return (
      <div className={styles.root}>
        <Fonts />
        <RunningHead />
        <main className={styles.missing}>
          <h1 className={styles.projectTitle}>No specimen here</h1>
          <p className={styles.body}>
            This page of the sketchbook was left blank. Nothing has been collected under &ldquo;{slug}&rdquo;.
          </p>
          <p className={styles.body}>
            <Link to={`${BASE}#catalogue`}>Return to the catalogue of specimens</Link>
          </p>
        </main>
      </div>
    );
  }

  const cls = [styles.root, project.slug === "mina" ? styles.night : "", styles[`slug_${project.slug.replace(/-/g, "_")}`] ?? ""].join(" ");
  return (
    <div className={cls} style={theme(project)}>
      <Fonts />
      <RunningHead plate={`Plate ${roman(projects.indexOf(project) + 1)} of ${roman(projects.length)}`} />
      <main key={project.slug} className={styles.projectPage}>
        <header className={styles.titleBlock}>
          <h1 className={styles.projectTitle}>{project.title}</h1>
          <p className={styles.aside}>
            {project.status}, {project.year}
          </p>
        </header>
        <Plate project={project} />
        <Notes project={project} />
      </main>
      <Turn project={project} />
    </div>
  );
}
