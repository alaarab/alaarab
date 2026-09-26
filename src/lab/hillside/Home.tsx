import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { nowItems, nowMeta, projects, siteMeta } from "../../data/siteContent";
import { BASE, Fonts, Sprig, firstSentence } from "./parts";
import { Scene } from "./Scene";
import { homeScene, m4lScene, projectScenes } from "./scenes";
import { FIRST_PAINT, skies, timeForHour, type TimeKey } from "./sky";
import styles from "./hillside.module.css";

/** Projects that get a small painted plate beside their line. */
const VIGNETTES: Record<string, { spec: typeof homeScene; box: string }> = {
  phren: { spec: projectScenes.phren!, box: "470 430 720 470" },
  "m4l-builder": { spec: m4lScene(1.4), box: "430 420 720 470" },
  mina: { spec: projectScenes.mina!, box: "420 120 900 590" },
  "intranet-erp": { spec: projectScenes["intranet-erp"]!, box: "420 440 720 470" },
};

const formatHour = (hour: number) => {
  const h = Math.floor(hour) % 24;
  const m = Math.round((hour - Math.floor(hour)) * 60) % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

export function HillsideHome() {
  // Server and first paint are always late afternoon; the visitor's hour eases in after mount.
  const [time, setTime] = useState<TimeKey>(FIRST_PAINT);
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const forced = new URLSearchParams(window.location.search).get("hour");
    const hour = forced !== null && !Number.isNaN(Number(forced)) ? Number(forced) : now.getHours() + now.getMinutes() / 60;
    const id = window.setTimeout(() => {
      setTime(timeForHour(hour));
      setClock(formatHour(hour));
    }, 350);
    return () => window.clearTimeout(id);
  }, []);

  const sky = skies[time];

  return (
    <div className={styles.root}>
      <Fonts />
      <header className={styles.hero} style={{ "--sky-text": sky.text, "--sky-soft": sky.textSoft } as CSSProperties}>
        <Scene spec={homeScene} sky={sky} className={styles.heroScene} />
        <nav className={styles.skyNav} aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#now">Now</a>
          <a href="#contact">Contact</a>
          <a href="/resume">Resume</a>
        </nav>
        <div className={styles.skyText}>
          <h1 className={styles.name}>{siteMeta.name}</h1>
          <p className={styles.title}>{siteMeta.title}</p>
          <p className={styles.caption} aria-live="polite">
            {clock
              ? `It's ${clock} where you are, so the sky is painted for ${sky.label}.`
              : "The sky here follows your local time of day."}
          </p>
        </div>
      </header>

      <main className={styles.paper}>
        <section className={styles.column} aria-label="Introduction">
          <p className={styles.lead}>{siteMeta.intro}</p>
          <p>{siteMeta.summary}</p>
          <p className={styles.soft}>
            {siteMeta.location}. {siteMeta.availability}
          </p>
        </section>

        <Sprig />

        <section id="work" className={styles.column} aria-labelledby="work-h">
          <h2 id="work-h" className={styles.h2}>
            Work
          </h2>
          <ul className={styles.works}>
            {projects.map((p) => {
              const plate = VIGNETTES[p.slug];
              return (
                <li key={p.slug} className={plate ? styles.workPlated : styles.work}>
                  <Link to={`${BASE}/projects/${p.slug}`} className={styles.workLink}>
                    {plate && (
                      <span className={styles.vignette}>
                        <Scene spec={plate.spec} viewBox={plate.box} edge={false} decorative />
                      </span>
                    )}
                    <span className={styles.workText}>
                      <span className={styles.workTitle}>{p.title}</span>
                      <span className={styles.workYear}>{p.year}</span>
                      <span className={styles.workLine}>{firstSentence(p.summary)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <Sprig />

        <section id="now" className={styles.column} aria-labelledby="now-h">
          <h2 id="now-h" className={styles.h2}>
            Now
          </h2>
          <p className={styles.soft}>As of {nowMeta.asOf}.</p>
          {nowItems.slice(0, 3).map((item) => (
            <p key={item.heading}>
              <em className={styles.runIn}>{item.heading}.</em> {item.body}
            </p>
          ))}
          <p>
            <a className={styles.inlineLink} href="/now">
              The rest of what I'm working on
            </a>
          </p>
        </section>

        <Sprig />

        <section id="contact" className={styles.column} aria-labelledby="contact-h">
          <h2 id="contact-h" className={styles.h2}>
            Contact
          </h2>
          <p>
            Email is best:{" "}
            <a className={styles.inlineLink} href={siteMeta.emailHref}>
              {siteMeta.email}
            </a>
            . I'm also on{" "}
            <a className={styles.inlineLink} href={siteMeta.linkedinHref}>
              LinkedIn
            </a>
            , and my{" "}
            <a className={styles.inlineLink} href="/resume">
              resume
            </a>{" "}
            is here.
          </p>
        </section>

        <footer className={styles.footer}>
          <p>
            {siteMeta.name}, {siteMeta.location}
          </p>
        </footer>
      </main>
    </div>
  );
}
