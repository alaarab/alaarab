import { useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { projects, siteMeta } from "../../data/siteContent";
import type { Project } from "../../types";
import { labPath } from "../directions";
import { externalLinks, projectBySlug } from "../util";
import { MillInset, MinaInset, MotifInset, PhrenInset } from "./Insets";
import { FONTS, moodFor } from "./places";
import styles from "./map.module.css";

const listSentence = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function BackToMap() {
  return (
    <Link to={labPath("map")} className={styles.back}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.backRose}>
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
      </svg>
      Back to the full map
    </Link>
  );
}

/** The text beside the inset: the traveler's notes, in prose. */
function Notes({ p }: { p: Project }) {
  const links = externalLinks(p);
  const i = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return (
    <div className={styles.notes}>
      <p className={styles.notesPlace}>{moodFor(p.slug).place} · {p.year}</p>
      <h1 className={styles.projectTitle}>{p.title}</h1>
      <p className={styles.lede}>{p.summary}</p>
      <p><span className={styles.runIn}>Why it was built.</span> {p.problem}</p>
      <p><span className={styles.runIn}>How it's made.</span> {p.build}</p>
      <p><span className={styles.runIn}>Where it stands.</span> {p.impact} {p.outcome}</p>
      {p.quote && <blockquote className={styles.quote}>{p.quote}</blockquote>}
      {p.metrics && p.metrics.length > 0 && (
        <p className={styles.margin}>Noted in the margin: {p.metrics.join("; ")}.</p>
      )}
      <p className={styles.margin}>Built with {listSentence(p.stack)}. {p.status}.</p>
      {links.length > 0 && (
        <p className={styles.onward}>
          Onward:{" "}
          {links.map((l, k) => (
            <span key={l.href}>
              {k > 0 && " · "}
              <a href={l.href}>{l.label}</a>
            </span>
          ))}
        </p>
      )}
      <nav className={styles.neighbours} aria-label="Neighbouring places">
        <Link to={labPath("map", prev.slug)}>← {prev.title}</Link>
        <Link to={labPath("map", next.slug)}>{next.title} →</Link>
      </nav>
    </div>
  );
}

function MillPage({ p, caption }: { p: Project; caption: string }) {
  const [value, setValue] = useState(4);
  return (
    <div className={styles.millLayout}>
      <figure className={`${styles.inset} ${styles.insetWide}`}>
        <MillInset caption={caption} value={value} />
        <figcaption className={styles.millControl}>
          <label htmlFor="mill-wheel">Turn the wheel</label>
          <input
            id="mill-wheel"
            type="range"
            min={0}
            max={10}
            step={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-valuetext={`Wheel at ${value} of 10; the ripples downstream follow it`}
            className={styles.slider}
          />
          <span className={styles.millHint}>the ripples downstream keep time with it</span>
        </figcaption>
      </figure>
      <Notes p={p} />
    </div>
  );
}

export function MapProject() {
  const { slug = "" } = useParams<{ slug: string }>();
  const p = projectBySlug(slug);
  const mood = moodFor(slug);
  const vars = {
    "--paper": mood.paper,
    "--washA": mood.washA,
    "--washB": mood.washB,
    "--washC": mood.washC,
  } as CSSProperties;

  if (!p) {
    return (
      <div className={styles.root} style={vars}>
        <link rel="stylesheet" href={FONTS} precedence="default" />
        <main className={styles.lost}>
          <svg viewBox="0 0 400 200" aria-hidden="true" className={styles.lostArt}>
            <path d="M20 150 C120 120 180 160 260 130 S360 120 380 140" />
            <path d="M40 162 C130 134 190 172 262 142 S350 134 372 152" strokeWidth="0.7" />
            <path d="M200 60 q10 -6 20 0 t20 0 M90 90 q10 -6 20 0 t20 0" strokeWidth="0.8" />
          </svg>
          <h1 className={styles.projectTitle}>Not on the map</h1>
          <p>There's no place called “{slug}” here. It may have been renamed, or never drawn.</p>
          <BackToMap />
        </main>
      </div>
    );
  }

  const caption = `${mood.place}, drawn larger`;
  const variant =
    p.slug === "phren" ? styles.vPhren : p.slug === "mina" ? styles.vMina : p.slug === "m4l-builder" ? styles.vMill : styles.vPlace;

  return (
    <div className={`${styles.root} ${variant} ${mood.night ? styles.night : ""}`} style={vars}>
      <link rel="stylesheet" href={FONTS} precedence="default" />
      <header className={styles.projectTop}>
        <BackToMap />
        <span className={styles.projectOwner}>{siteMeta.name}</span>
      </header>
      {p.slug === "m4l-builder" ? (
        <MillPage p={p} caption={caption} />
      ) : (
        <div className={styles.split}>
          <figure className={styles.inset}>
            {p.slug === "phren" ? (
              <PhrenInset caption={caption} />
            ) : p.slug === "mina" ? (
              <MinaInset caption={caption} />
            ) : (
              <MotifInset slug={p.slug} caption={caption} />
            )}
          </figure>
          <Notes p={p} />
        </div>
      )}
      <footer className={styles.footer}>
        <BackToMap />
      </footer>
    </div>
  );
}
