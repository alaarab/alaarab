import { useMemo } from "react";
import { Link } from "react-router";
import { contactLinks, experienceItems, projects, siteMeta } from "../../data/siteContent";
import { projectBySlug } from "../util";
import { Print } from "./Print";
import { PLATE_NOTES, STUDIO, plateFor, studioLayers } from "./plates";
import { FONT_HREF, firstSentence, plateNumber, toRoman } from "./shared";
import styles from "./woodcut.module.css";

const FEATURED = ["phren", "m4l-builder", "mina", "atlas", "intranet-erp"];

export function WoodcutHome() {
  const studio = useMemo(studioLayers, []);
  const featured = FEATURED.map((slug) => projectBySlug(slug)).filter((p) => p !== undefined);
  const now = experienceItems[0];

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <main className={styles.home}>
        <figure className={styles.frontis}>
          <Print
            {...STUDIO}
            layers={studio}
            seed={11}
            pull
            label="Woodcut print: a studio window looking out at the Los Angeles hills at golden hour, palms on the near hill, a clay pot, books and a mug on the workbench sill."
          />
          <figcaption className={styles.frontisCaption}>
            <p className={styles.pencil}>Frontispiece. The studio window, hills at golden hour. Three blocks.</p>
            <h1>{siteMeta.name}</h1>
            <p className={styles.role}>Full-stack developer, Los Angeles</p>
          </figcaption>
        </figure>

        <section className={styles.intro} aria-label="About">
          <p>
            {siteMeta.title} {siteMeta.intro}
          </p>
          <p className={styles.reach}>
            Write to <a href={siteMeta.emailHref}>{siteMeta.email}</a>
          </p>
        </section>

        <section aria-labelledby="wc-prints">
          <header className={styles.sectionHead}>
            <h2 id="wc-prints">Prints</h2>
            <p className={styles.pencil}>One block cut for each project.</p>
          </header>
          <ol className={styles.prints}>
            {featured.map((p) => {
              const plate = plateFor(p.slug)!;
              return (
                <li key={p.slug} className={styles.plate}>
                  <Link to={`/lab/woodcut/projects/${p.slug}`} className={styles.plateArt} tabIndex={-1} aria-hidden="true">
                    <Print {...plate} seed={plateNumber(p.slug) * 13} label={PLATE_NOTES[p.slug]?.caption ?? p.title} />
                  </Link>
                  <div className={styles.plateCaption}>
                    <p className={styles.pencil}>
                      Plate {toRoman(plateNumber(p.slug))}. {PLATE_NOTES[p.slug]?.caption}
                    </p>
                    <h3>
                      <Link to={`/lab/woodcut/projects/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p>{firstSentence(p.summary)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="wc-catalogue">
          <header className={styles.sectionHead}>
            <h2 id="wc-catalogue">The whole catalogue</h2>
          </header>
          <ol className={styles.catalogue}>
            {projects.map((p) => (
              <li key={p.slug}>
                <span className={styles.num} aria-hidden="true">
                  {toRoman(plateNumber(p.slug))}
                </span>
                <Link to={`/lab/woodcut/projects/${p.slug}`}>{p.title}</Link>
                <span className={styles.gloss}>{firstSentence(p.summary, true)}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className={styles.colophon} aria-labelledby="wc-colophon">
          <h2 id="wc-colophon">Colophon</h2>
          <p className={styles.printer}>Printed in Los Angeles by Ala Arab.</p>
          <p>
            Now {now.role} at {now.company}. {siteMeta.availability}
          </p>
          <p className={styles.contact}>
            <a href={siteMeta.emailHref}>{siteMeta.email}</a>
            {contactLinks
              .filter((l) => !l.href.startsWith("mailto:"))
              .map((l) => (
                <span key={l.href}>
                  {" · "}
                  <a href={l.href}>{l.label}</a>
                </span>
              ))}
            {" · "}
            <a href="/now">Now</a>
          </p>
          <p className={styles.pencil}>Set in IM Fell English and Alegreya. Three inks on warm paper.</p>
        </footer>
      </main>
    </div>
  );
}
