import { useState } from "react";
import { Link } from "react-router";
import { nowItems, nowMeta, projects, siteMeta } from "../../data/siteContent";
import { labPath } from "../directions";
import { CountryMap, firstSentence } from "./CountryMap";
import { FONTS } from "./places";
import styles from "./map.module.css";

const INKED = "map-inked";

const KEYFRAMES = `@keyframes map-draw { to { stroke-dashoffset: 0; } }
@keyframes map-bloom { to { opacity: 1; } }`;

/** Ink the map in once per visit; afterwards (and under reduced motion) it's simply drawn. */
function useFirstInk() {
  const [animate] = useState(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      const seen = sessionStorage.getItem(INKED);
      sessionStorage.setItem(INKED, "1");
      return !seen;
    } catch {
      return false;
    }
  });
  return animate;
}

const shortTitle = siteMeta.title.split(" who ")[0];
const city = siteMeta.location.split(",")[0];

export function MapHome() {
  const animate = useFirstInk();
  const gazetteer = [...projects].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONTS} precedence="default" />
      <style href="map-keyframes" precedence="default">{KEYFRAMES}</style>

      <header className={styles.sheet}>
        <div className={styles.cartouche}>
          <h1 className={styles.name}>{siteMeta.name}</h1>
          <p className={styles.cartoucheTitle}>{shortTitle}</p>
          <p className={styles.cartoucheCity}>{city}</p>
          <p className={styles.cartoucheLinks}>
            <a href={siteMeta.emailHref}>{siteMeta.email}</a>
            <a href="#gazetteer">Gazetteer of every project</a>
          </p>
        </div>
        <CountryMap animate={animate} />
      </header>

      <main className={styles.page}>
        <section className={styles.section} aria-labelledby="about">
          <h2 id="about" className={styles.h2}>About</h2>
          <p className={styles.lede}>{siteMeta.title}</p>
          <p>{siteMeta.intro}</p>
          <p>{siteMeta.summary}</p>
        </section>

        <section className={styles.section} id="gazetteer" aria-labelledby="gazetteer-h">
          <h2 id="gazetteer-h" className={styles.h2}>Gazetteer</h2>
          <p className={styles.aside}>Every project, alphabetically. The featured ones are the places on the map.</p>
          <ol className={styles.gazetteer}>
            {gazetteer.map((p) => (
              <li key={p.slug}>
                <p className={styles.gazLine}>
                  <Link to={labPath("map", p.slug)} className={styles.gazName}>{p.title}</Link>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.gazYear}>{p.year}</span>
                </p>
                <p className={styles.gazSummary}>{firstSentence(p.summary)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="now">
          <h2 id="now" className={styles.h2}>Now</h2>
          <p className={styles.aside}>As of {nowMeta.asOf}.</p>
          <ul className={styles.nowList}>
            {nowItems.slice(0, 4).map((n) => (
              <li key={n.heading}>{n.heading}.</li>
            ))}
          </ul>
          <p>
            <Link to="/now">More on what I'm working on now</Link>, or the full <Link to="/resume">resume</Link>.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="contact">
          <h2 id="contact" className={styles.h2}>Contact</h2>
          <p>
            {siteMeta.availability} Email <a href={siteMeta.emailHref}>{siteMeta.email}</a>, or find me on{" "}
            <a href={siteMeta.linkedinHref}>LinkedIn</a>.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>{siteMeta.name} · {siteMeta.location}</p>
      </footer>
    </div>
  );
}
