import { Link } from "react-router";
import {
  contactLinks,
  educationItems,
  experienceItems,
  siteMeta,
} from "../../data/siteContent";
import styles from "./transit.module.css";
import { TransitMap } from "./Map";
import { Bullet, Frame, lineVars } from "./parts";
import {
  firstSentence,
  lines,
  linesFor,
  projectBySlug,
  transitPath,
  type TransitLine,
} from "./lines";

export function TransitHome() {
  return (
    <Frame>
      <header className={styles.sign}>
        <div className={styles.signPanel}>
          <div className={styles.signLines} aria-label="Lines on this map">
            {lines.map((l) => (
              <Bullet key={l.id} line={l} size="lg" labelled />
            ))}
          </div>
          <h1 className={styles.signName}>{siteMeta.name}</h1>
          <div className={styles.signText}>
            <p className={styles.signTitle}>{siteMeta.title}</p>
            <p className={styles.signIntro}>{siteMeta.intro}</p>
          </div>
        </div>
        <div className={styles.signStrip}>
          <p>
            <span className={styles.stripLabel}>Based in</span> {siteMeta.location}
          </p>
          <p>
            <span className={styles.stripLabel}>Service</span> {siteMeta.availability}
          </p>
          <nav aria-label="Contact" className={styles.stripNav}>
            <a href={siteMeta.emailHref}>Email</a>
            <a href={siteMeta.linkedinHref}>LinkedIn</a>
            <a href="/resume">Resume</a>
            <a href="/now">Now</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className={`${styles.section} ${styles.first}`} aria-labelledby="map-h">
          <div className={`${styles.sectionHead} ${styles.mapHead}`}>
            <h2 id="map-h" className={styles.h2}>
              System map
            </h2>
            <p className={styles.lede}>
              Fifteen years of work, drawn as five lines. Each project is a
              station; where two threads meet, you can change lines.
            </p>
          </div>
          <TransitMap />
          <nav className={styles.mapNote} aria-label="Lines">
            <p>On a small screen the map runs as a timetable. Pick a line:</p>
            <ul>
              {lines.map((l) => (
                <li key={l.id}>
                  <a href={`#tt-${l.id}`} style={lineVars(l)}>
                    <Bullet line={l} />
                    <span>{l.name}</span>
                    <span className={styles.keyCount}>{l.stations.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <section className={styles.section} aria-labelledby="tt-h">
          <div className={styles.sectionHead}>
            <h2 id="tt-h" className={styles.h2}>
              Timetable
            </h2>
            <p className={styles.lede}>Every station, line by line, oldest first.</p>
          </div>
          <div className={styles.timetable}>
            {lines.map((line) => (
              <LineTimetable key={line.id} line={line} />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="route-h">
          <div className={styles.sectionHead}>
            <h2 id="route-h" className={styles.h2}>
              Route history
            </h2>
            <p className={styles.lede}>{siteMeta.summary}</p>
          </div>
          <RouteHistory />
        </section>

        <section className={`${styles.section} ${styles.contact}`} aria-labelledby="contact-h">
          <h2 id="contact-h" className={styles.infoSign}>
            <span className={styles.infoMark} aria-hidden="true">
              i
            </span>
            Information
          </h2>
          <ul className={styles.contactList}>
            <li>
              <a href={siteMeta.emailHref}>
                <span>Email</span>
                <span className={styles.contactValue}>{siteMeta.email}</span>
                <span aria-hidden="true" className={styles.arrow}>→</span>
              </a>
            </li>
            {contactLinks
              .filter((c) => c.label !== "Email")
              .map((c) => (
                <li key={c.label}>
                  <a href={c.href}>
                    <span>{c.label}</span>
                    <span className={styles.contactValue}>
                      {c.href.startsWith("http") ? new URL(c.href).hostname.replace("www.", "") : c.href}
                    </span>
                    <span aria-hidden="true" className={styles.arrow}>→</span>
                  </a>
                </li>
              ))}
            <li>
              <a href="/now">
                <span>Now</span>
                <span className={styles.contactValue}>/now</span>
                <span aria-hidden="true" className={styles.arrow}>→</span>
              </a>
            </li>
          </ul>
        </section>
      </main>
    </Frame>
  );
}

function LineTimetable({ line }: { line: TransitLine }) {
  return (
    <section className={styles.ttLine} style={lineVars(line)} aria-labelledby={`tt-${line.id}`}>
      <header className={styles.ttHead}>
        <Bullet line={line} size="lg" />
        <div>
          <h3 id={`tt-${line.id}`} className={styles.ttName}>
            {line.name}
            <span className={styles.srOnly}> line ({line.id})</span>
          </h3>
          <p className={styles.ttDesc}>{line.description}</p>
        </div>
      </header>
      <ol className={styles.ttList}>
        {line.stations.map((slug, i) => {
          const p = projectBySlug[slug];
          const others = linesFor(slug).filter((l) => l.id !== line.id);
          const gap = line.route.find((r) => r.at === slug)?.gap;
          const end = i === 0 ? "first" : i === line.stations.length - 1 ? "last" : undefined;
          return (
            <li key={slug} className={styles.ttStop} data-end={end} data-gap={gap ? "" : undefined}>
              <span
                className={others.length ? styles.ttInter : styles.ttDot}
                aria-hidden="true"
              />
              <div className={styles.ttBody}>
                <p className={styles.ttMeta}>
                  <span>{p.year}</span>
                  <span>{p.status}</span>
                </p>
                <Link to={transitPath(slug)} className={styles.ttTitle}>
                  {p.title}
                </Link>
                <p className={styles.ttSummary}>{firstSentence(p.summary)}</p>
                {others.length > 0 && (
                  <p className={styles.ttChange}>
                    Change for
                    {others.map((o) => (
                      <span key={o.id} className={styles.ttChangeLine}>
                        <Bullet line={o} size="sm" />
                        {o.name}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function RouteHistory() {
  const stops = [
    ...educationItems.map((e) => ({
      key: e.school,
      years: e.years,
      place: e.school,
      role: e.detail,
      location: "",
      summary: "",
      school: true,
    })),
    ...experienceItems.map((e) => ({
      key: e.company,
      years: e.years,
      place: e.company,
      role: e.role,
      location: e.location,
      summary: e.summary,
      school: false,
    })),
  ].sort((a, b) => parseInt(a.years) - parseInt(b.years) || endYear(a.years) - endYear(b.years));

  return (
    <ol className={styles.route}>
      {stops.map((s, i) => {
        const here = i === stops.length - 1;
        return (
          <li key={s.key} className={styles.routeStop} data-here={here ? "" : undefined}>
            <span className={styles.routeYears}>{s.years}</span>
            <span className={styles.routeMark} aria-hidden="true" />
            <div className={styles.routeBody}>
              {here && <p className={styles.hereTag}>You are here</p>}
              <h3 className={styles.routePlace}>{s.place}</h3>
              <p className={styles.routeRole}>
                {s.role}
                {s.location && <span className={styles.routeLoc}>{` · ${s.location}`}</span>}
              </p>
              {s.summary && <p className={styles.routeSummary}>{s.summary}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function endYear(years: string): number {
  if (years.includes("present")) return 9999;
  const all = years.match(/\d{4}/g);
  return all ? Number(all[all.length - 1]) : 0;
}
