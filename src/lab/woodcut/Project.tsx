import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Link, useParams } from "react-router";
import { projects } from "../../data/siteContent";
import type { Project } from "../../types";
import { externalLinks, projectBySlug } from "../util";
import { Print } from "./Print";
import { INK, M4L, PLATE_NOTES, SMALL, blankLayers, plateFor } from "./plates";
import { FONT_HREF, plateNumber, toRoman } from "./shared";
import styles from "./woodcut.module.css";

/** Per-project layout. Anything not listed gets the small plate above its essay. */
const LAYOUT: Record<string, string> = {
  phren: styles.facing,
  "m4l-builder": styles.wide,
  mina: styles.quiet,
};

/** The colour of the carved initial: the project's own warm or cool ink. */
const INITIAL: Record<string, string> = {
  phren: INK.terra,
  "m4l-builder": "#a86a1f",
  mina: "#56668f",
  basis: "#5f7a58",
  "intranet-erp": "#5f7a58",
  atlas: "#50708c",
  "garden-sensor-network": "#5f7a58",
  ogrid: "#5f7a58",
  mutter: "#50708c",
  alphalens: "#50708c",
};

export function WoodcutProject() {
  const { slug = "" } = useParams<{ slug: string }>();
  const project = projectBySlug(slug);

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <nav className={styles.back} aria-label="Back">
        <Link to="/lab/woodcut">&larr; Ala Arab, all prints</Link>
      </nav>
      {project ? <Plate key={project.slug} project={project} /> : <Uncut slug={slug} />}
    </div>
  );
}

function Plate({ project: p }: { project: Project }) {
  const [knob, setKnob] = useState(0.35);
  const plate = useMemo(() => plateFor(p.slug, knob), [p.slug, knob]);
  const note = PLATE_NOTES[p.slug];
  const n = plateNumber(p.slug);
  const i = n - 1;
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const links = externalLinks(p);
  const layout = LAYOUT[p.slug] ?? styles.small;

  const print = plate ? (
    <Print {...plate} seed={n * 13} label={`Woodcut print for ${p.title}: ${note?.caption ?? ""}`} />
  ) : null;

  return (
    <main
      className={`${styles.page} ${layout}`}
      style={{ ["--accent" as string]: INITIAL[p.slug] ?? INK.terra }}
    >
      <figure className={styles.pageFigure}>
        {p.slug === "m4l-builder" ? (
          <div className={styles.knobWrap}>
            {print}
            <Knob value={knob} onChange={setKnob} />
          </div>
        ) : (
          print
        )}
        <figcaption className={styles.pencil}>
          Plate {toRoman(n)}. {note?.caption}
          {p.slug === "m4l-builder" ? " Turn the large knob to re-cut the waves." : ""}
        </figcaption>
      </figure>

      <div>
        <header className={styles.titleBlock}>
          <h1>{p.title}</h1>
          <p className={styles.pencil}>
            {p.year}. {p.status}.
          </p>
        </header>

        <article className={styles.essay}>
          <p className={styles.lead}>{p.summary}</p>
          <p>{p.problem}</p>
          <p>{p.build}</p>
          {p.quote ? <blockquote className={styles.quote}>{p.quote}</blockquote> : null}
          <p>{p.impact}</p>
          <p>{p.outcome}</p>
          <p className={styles.notes}>
            {p.metrics?.length ? `${p.metrics.join("; ")}. ` : ""}
            Cut in {listOf(p.stack)}.
          </p>
          {links.length ? (
            <p>
              Elsewhere:{" "}
              {links.map((l, k) => (
                <span key={l.href}>
                  {k ? ", " : ""}
                  <a href={l.href}>{l.label}</a>
                </span>
              ))}
              .
            </p>
          ) : null}
        </article>

        <nav className={styles.turn} aria-label="Other prints">
          <Link to={`/lab/woodcut/projects/${prev.slug}`}>
            <small>Previous print</small>&larr; {prev.title}
          </Link>
          <Link to={`/lab/woodcut/projects/${next.slug}`} className={styles.next}>
            <small>Next print</small>
            {next.title} &rarr;
          </Link>
        </nav>
      </div>
    </main>
  );
}

function Uncut({ slug }: { slug: string }) {
  const layers = useMemo(blankLayers, []);
  return (
    <main className={`${styles.page} ${styles.small}`}>
      <figure className={styles.pageFigure}>
        <Print {...SMALL} layers={layers} frame={false} label="An uncut block of wood with a gouge resting beside it." />
      </figure>
      <header className={styles.titleBlock}>
        <h1>This block hasn't been cut</h1>
        <p className={styles.pencil}>There is no print called &ldquo;{slug}&rdquo;.</p>
      </header>
      <p className={styles.essay} style={{ textAlign: "center" }}>
        <Link to="/lab/woodcut" className={styles.homeLink}>Back to all prints</Link>
      </p>
    </main>
  );
}

const listOf = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/** The panel knob: a real slider laid over the carved one. */
function Knob({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const drag = useRef<{ x: number; y: number; v: number } | null>(null);
  const set = (v: number) => onChange(Math.round(Math.min(1, Math.max(0, v)) * 100) / 100);
  const { knob, w, h } = M4L;
  const size = ((knob.r + 16) * 2 * 100) / w;

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05, PageUp: 0.2, PageDown: -0.2 }[e.key];
    if (step !== undefined) set(value + step);
    else if (e.key === "Home") set(0);
    else if (e.key === "End") set(1);
    else return;
    e.preventDefault();
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, v: value };
  };
  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (d) set(d.v + (e.clientX - d.x - (e.clientY - d.y)) / 180);
  };

  return (
    <div
      className={styles.knob}
      role="slider"
      tabIndex={0}
      aria-label="Wave frequency"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={value < 0.34 ? "low, wide waves" : value < 0.67 ? "middle" : "high, tight rippled waves"}
      style={{ left: `${(knob.x * 100) / w}%`, top: `${(knob.y * 100) / h}%`, width: `${size}%` }}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    />
  );
}
