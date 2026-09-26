import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { projects, siteMeta } from "../../data/siteContent";
import type { Project } from "../../types";
import { projectBySlug } from "../util";
import { Fonts, RunningHead } from "./chrome";
import { PlantSvg, Sprig, specimenOpts } from "./Plant";
import { grow } from "./grower";
import { firstSentence, plateFor, roman } from "./themes";
import styles from "./specimens.module.css";

const BASE = "/lab/specimens";
const PLATES = ["phren", "m4l-builder", "mina", "intranet-erp", "atlas"];

const plateNo = (p: Project) => roman(projects.indexOf(p) + 1);

function HomePlate({ project }: { project: Project }) {
  const spec = plateFor(project, "home");
  const model = grow(specimenOpts(project, spec.frame, spec.extra));
  return (
    <PlantSvg
      model={model}
      frame={spec.frame}
      label={`Plate ${plateNo(project)}, ${project.title}: a plant drawn from the project's stack and metrics.`}
      under={spec.under}
      crop={!spec.under}
    />
  );
}

export function SpecimensHome() {
  const plates = PLATES.map((s) => projectBySlug(s)).filter((p): p is Project => !!p);
  const [first, ...rest] = plates;
  const half = Math.ceil(projects.length / 2);
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <div className={styles.root}>
      <Fonts />
      <RunningHead />
      <main className={styles.book}>
        <section className={styles.spread} aria-labelledby="specimens-title">
          <div className={`${styles.page} ${styles.opening}`}>
            <p className={styles.kicker}>A sketchbook of work, 2011 to 2026</p>
            <h1 id="specimens-title" className={styles.name}>
              {siteMeta.name}
            </h1>
            <p className={styles.lede}>{siteMeta.title}</p>
            <p className={styles.body}>{siteMeta.intro}</p>
            <p className={styles.aside}>{siteMeta.location}</p>
            <p className={styles.openingFoot}>
              Five plates follow, then a <a href="#catalogue">catalogue of every specimen</a>. Letters to{" "}
              <a href={siteMeta.emailHref}>{siteMeta.email}</a>.
            </p>
          </div>
          <figure className={`${styles.page} ${styles.platePage}`}>
            {first && <HomePlate project={first} />}
            {first && (
              <figcaption className={styles.homeCaption}>
                <Link to={`${BASE}/projects/${first.slug}`} className={styles.plateLink}>
                  <span className={styles.plateNo}>Plate {plateNo(first)}.</span> {first.title}
                </Link>
                <span className={styles.captionNote}>
                  Each plant is grown from its project: a leaf for each part of the stack, a flower for each measure,
                  taller with age.
                </span>
              </figcaption>
            )}
          </figure>
        </section>

        {rest.map((p, i) => (
          <section key={p.slug} className={`${styles.spread} ${i % 2 === 0 ? styles.flip : ""}`} aria-labelledby={`plate-${p.slug}`}>
            <div className={`${styles.page} ${styles.notesPage}`}>
              <p className={styles.numeral} aria-hidden="true">
                {plateNo(p)}
              </p>
              <h2 id={`plate-${p.slug}`} className={styles.plateTitle}>
                {p.title}
              </h2>
              <p className={styles.aside}>
                {p.status}, {p.year}
              </p>
              <p className={styles.body}>{p.summary}</p>
              <p>
                <Link to={`${BASE}/projects/${p.slug}`} className={styles.readOn}>
                  Field notes on {p.title}
                </Link>
              </p>
            </div>
            <figure className={`${styles.page} ${styles.platePage}`}>
              <HomePlate project={p} />
              <figcaption className={styles.homeCaption}>
                <span className={styles.plateNo}>Plate {plateNo(p)}.</span>{" "}
                <em>{firstSentence(p.summary).length <= 90 ? firstSentence(p.summary) : p.title}</em>
              </figcaption>
            </figure>
          </section>
        ))}

        <section id="catalogue" className={`${styles.spread} ${styles.catalogue}`} aria-labelledby="catalogue-title">
          <div className={styles.catalogueHead}>
            <h2 id="catalogue-title" className={styles.plateTitle}>
              Catalogue of specimens
            </h2>
            <p className={styles.aside}>Every project, in the order kept.</p>
          </div>
          {[projects.slice(0, half), projects.slice(half)].map((col, c) => (
            <ol key={c} className={styles.catalogueList} start={c * half + 1}>
              {col.map((p) => (
                <li key={p.slug}>
                  <Link to={`${BASE}/projects/${p.slug}`} className={styles.catalogueRow}>
                    <span className={styles.catNo}>{roman(projects.indexOf(p) + 1)}</span>
                    <Sprig project={p} />
                    <span className={styles.catName}>{p.title}</span>
                    <span className={styles.catYear}>{p.year}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ))}
        </section>

        <Correspondence />
      </main>
    </div>
  );
}

export function Correspondence() {
  return (
    <section id="correspondence" className={styles.letter} aria-labelledby="correspondence-title">
      <h2 id="correspondence-title" className={styles.letterTitle}>
        Correspondence
      </h2>
      <p className={styles.body}>{siteMeta.availability} Based in {siteMeta.location}.</p>
      <p className={styles.body}>
        Write to <a href={siteMeta.emailHref}>{siteMeta.email}</a>, or find me on{" "}
        <a href={siteMeta.linkedinHref}>LinkedIn</a>. The <a href="/resume">resume</a> has the full history, and{" "}
        <a href="/now">now</a> has what I am working on this season.
      </p>
    </section>
  );
}
