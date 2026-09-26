import { Link, useParams } from "react-router";
import styles from "./transit.module.css";
import { Bullet, Frame, lineVars } from "./parts";
import { linesFor, projectBySlug, transitPath, type TransitLine } from "./lines";

export function TransitProject() {
  const { slug = "" } = useParams<{ slug: string }>();
  const project = projectBySlug[slug];

  if (!project) {
    return (
      <Frame>
        <TopBar />
        <main id="main" className={styles.station}>
          <header className={styles.sign}>
            <div className={styles.signPanel}>
              <h1 className={styles.stationName}>Station not found</h1>
              <p className={styles.signTitle}>
                There is no station called “{slug}” on this map.
              </p>
            </div>
          </header>
          <p className={styles.backRow}>
            <Link to={transitPath()} className={styles.backLink}>
              ← Back to the system map
            </Link>
          </p>
        </main>
      </Frame>
    );
  }

  const served = linesFor(slug);
  const board = [
    { label: "Problem", text: project.problem },
    { label: "Build", text: project.build },
    { label: "Impact", text: project.impact },
    { label: "Outcome", text: project.outcome },
  ];
  const exits = project.links.filter((l) => l.href !== `/projects/${slug}`);

  return (
    <Frame>
      <TopBar />
      <main id="main" className={styles.stationPage}>
        <header className={styles.sign}>
          <div className={styles.signPanel}>
            <div className={styles.signLines}>
              {served.map((l) => (
                <Bullet key={l.id} line={l} size="lg" labelled />
              ))}
            </div>
            <h1 className={styles.stationName}>{project.title}</h1>
            <p className={styles.signTitle}>{project.summary}</p>
          </div>
          <dl className={styles.signFacts}>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </div>
            <div>
              <dt>Kind</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>{served.length > 1 ? "Interchange" : "Line"}</dt>
              <dd>{served.map((l) => l.name).join(" + ")}</dd>
            </div>
          </dl>
        </header>

        <section className={styles.section} aria-labelledby="strips-h">
          <h2 id="strips-h" className={styles.h2Small}>
            {served.length > 1 ? "Lines through this station" : "Line through this station"}
          </h2>
          <div className={styles.strips}>
            {served.map((l) => (
              <LineStrip key={l.id} line={l} slug={slug} />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="board-h">
          <h2 id="board-h" className={styles.h2Small}>
            Departures
          </h2>
          <div className={styles.board}>
            {board.map((row) => (
              <div key={row.label} className={styles.boardRow}>
                <h3 className={styles.boardLabel}>{row.label}</h3>
                <p className={styles.boardText}>{row.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.factsGrid}>
          {project.metrics && project.metrics.length > 0 && (
            <section aria-labelledby="metrics-h">
              <h2 id="metrics-h" className={styles.h2Small}>
                At a glance
              </h2>
              <ol className={styles.metrics}>
                {project.metrics.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ol>
            </section>
          )}
          <section aria-labelledby="stack-h">
            <h2 id="stack-h" className={styles.h2Small}>
              Built with
            </h2>
            <ul className={styles.stack}>
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        </div>

        {project.quote && (
          <aside className={styles.notice} aria-label="Platform notice">
            <p className={styles.noticeHead}>
              <span aria-hidden="true" className={styles.noticeMark}>!</span>
              Platform notice
            </p>
            <blockquote className={styles.noticeQuote}>
              <p>{project.quote}</p>
            </blockquote>
          </aside>
        )}

        {exits.length > 0 && (
          <section className={styles.section} aria-labelledby="exits-h">
            <h2 id="exits-h" className={styles.h2Small}>
              Exits
            </h2>
            <ul className={styles.exits}>
              {exits.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>
                    <span className={styles.exitTag}>Exit</span>
                    <span className={styles.exitName}>{l.label}</span>
                    <span className={styles.exitHost}>{l.href.startsWith("http") ? new URL(l.href).hostname : l.href}</span>
                    <span aria-hidden="true" className={styles.arrow}>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className={styles.backRow}>
          <Link to={transitPath()} className={styles.backLink}>
            ← Back to the system map
          </Link>
        </p>
      </main>
    </Frame>
  );
}

function TopBar() {
  return (
    <nav className={styles.topBar} aria-label="Prototype">
      <Link to={transitPath()} className={styles.topHome}>
        Ala Arab
      </Link>
      <Link to={transitPath()}>System map</Link>
      <a href="/resume">Resume</a>
      <a href="/now">Now</a>
    </nav>
  );
}

function LineStrip({ line, slug }: { line: TransitLine; slug: string }) {
  const i = line.stations.indexOf(slug);
  const prev = line.stations[i - 1];
  const next = line.stations[i + 1];
  const here = projectBySlug[slug];
  const Stop = ({ s, dir }: { s?: string; dir: "prev" | "next" }) => {
    if (!s) {
      return (
        <div className={styles.stripEnd} data-dir={dir}>
          <span className={styles.stripKind}>{dir === "prev" ? "Origin" : "Terminus"}</span>
          <span className={styles.stripNone}>End of line</span>
        </div>
      );
    }
    const p = projectBySlug[s];
    return (
      <Link to={transitPath(s)} className={styles.stripStop} data-dir={dir}>
        <span className={styles.stripKind}>{dir === "prev" ? "← Previous" : "Next →"}</span>
        <span className={styles.stripTitle}>{p.title}</span>
        <span className={styles.stripYear}>{p.year}</span>
      </Link>
    );
  };
  return (
    <div className={styles.strip} style={lineVars(line)}>
      <p className={styles.stripHead}>
        <Bullet line={line} />
        <span>
          {line.name} line
          <span className={styles.stripPos}>
            {" "}
            · stop {i + 1} of {line.stations.length}
          </span>
        </span>
      </p>
      <div className={styles.stripTrack} data-prev={prev ? "" : undefined} data-next={next ? "" : undefined}>
        <Stop s={prev} dir="prev" />
        <div className={styles.stripHere}>
          <span className={styles.stripHereDot} aria-hidden="true" />
          <span className={styles.stripHereLabel}>
            You are here<span className={styles.srOnly}>: {here.title}</span>
          </span>
        </div>
        <Stop s={next} dir="next" />
      </div>
    </div>
  );
}
