import type { CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { siteMeta } from "../../data/siteContent";
import styles from "./ledger.module.css";
import { FONT_HREF, LEDGER_BASE, entries, entryPath, periodLabel } from "./ledger";

function Masthead({ label }: { label: string }) {
  return (
    <header className={styles.masthead}>
      <Link to={LEDGER_BASE} className={styles.mastName}>
        Ala Arab
      </Link>
      <span className={styles.mastMeta}>Ledger of work</span>
      <span className={styles.mastMeta}>{label}</span>
      <nav aria-label="Site" className={styles.mastNav}>
        <Link to={`${LEDGER_BASE}#index`}>Index</Link>
        <a href="/resume">Resume</a>
        <a href="/now">Now</a>
      </nav>
    </header>
  );
}

export function LedgerProject() {
  const { slug } = useParams<{ slug: string }>();
  const position = entries.findIndex((e) => e.project.slug === slug);

  if (position === -1) {
    return (
      <div className={styles.root}>
        <link rel="stylesheet" href={FONT_HREF} precedence="default" />
        <Masthead label="No such entry" />
        <main className={styles.missing}>
          <p className={styles.entryNo} aria-hidden="true">
            00
          </p>
          <h1 className={styles.entryTitle}>No entry on the ledger.</h1>
          <p className={styles.entryLede}>
            Nothing is filed under <code className={styles.code}>{slug}</code>. The index lists
            every project there is.
          </p>
          <p>
            <Link to={LEDGER_BASE} className={styles.textLink}>
              Back to the index
            </Link>
          </p>
        </main>
      </div>
    );
  }

  const entry = entries[position];
  const { project } = entry;
  const prev = entries[position - 1];
  const next = entries[position + 1];
  const links = project.links.filter((l) => l.href !== `/projects/${project.slug}`);

  const sections = [
    { mark: "§1", title: "Problem", body: project.problem },
    { mark: "§2", title: "Build", body: project.build },
    { mark: "§3", title: "Result", body: project.impact },
    { mark: "§4", title: "Outcome", body: project.outcome },
  ];

  const facts: { term: string; value: string }[] = [
    { term: "Entry", value: `${entry.no} of ${entries.length}` },
    { term: "Period", value: project.year },
    { term: "Status", value: project.status },
    { term: "Category", value: project.category },
    ...(project.thread ? [{ term: "Thread", value: project.thread }] : []),
    { term: "Stack", value: project.stack.join(", ") },
  ];

  return (
    <div
      className={styles.root}
      style={{ "--row-accent": project.accent ?? "var(--ink)" } as CSSProperties}
    >
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <Masthead label={`Entry ${entry.no}`} />

      <main className={styles.entry}>
        <p className={styles.crumb}>
          <Link to={`${LEDGER_BASE}#index`} className={styles.textLink}>
            Index
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{entry.line}</span>
          <span aria-hidden="true"> / </span>
          <span>Entry {entry.no}</span>
        </p>

        <div className={styles.entryHead}>
          <p className={styles.entryNo} aria-hidden="true">
            {entry.no}
          </p>
          <div>
            <h1 className={styles.entryTitle}>
              <span className={styles.srOnly}>Entry {entry.no}: </span>
              {project.title}
            </h1>
            <p className={styles.entryLede}>
              {project.summary}
              {project.quote && (
                <sup className={styles.noteRef}>
                  <a href="#note-1" aria-label="Note 1">
                    1
                  </a>
                </sup>
              )}
            </p>
          </div>
        </div>

        <div className={styles.sheet}>
          <aside className={styles.margin} aria-label="Entry facts">
            <dl className={styles.facts}>
              {facts.map((f) => (
                <div key={f.term} className={styles.fact}>
                  <dt>{f.term}</dt>
                  <dd>{f.term === "Period" ? <span title={f.value}>{periodLabel(f.value)}</span> : f.value}</dd>
                </div>
              ))}
              <div className={styles.fact}>
                <dt>Marker</dt>
                <dd>
                  <span
                    className={styles.swatch}
                    data-hollow={!project.accent || undefined}
                    aria-hidden="true"
                  />
                  {project.accent ?? "none"}
                </dd>
              </div>
            </dl>

            {links.length > 0 && (
              <div className={styles.marginBlock}>
                <p className={styles.marginLabel}>References</p>
                <ul className={styles.refs}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={styles.textLink} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                      <span className={styles.refHost}>{new URL(link.href).host}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.quote && (
              <div id="note-1" className={styles.marginNote}>
                <p className={styles.marginLabel}>Note 1</p>
                <p>
                  “{project.quote}”
                </p>
                <p className={styles.noteSource}>From the project’s own description.</p>
              </div>
            )}
          </aside>

          <div className={styles.body}>
            {sections.map((s) => (
              <section key={s.mark} className={styles.clause} aria-labelledby={`clause-${s.mark}`}>
                <h2 id={`clause-${s.mark}`} className={styles.clauseHead}>
                  <span className={styles.clauseMark}>{s.mark}</span>
                  {s.title}
                </h2>
                <p className={styles.clauseBody}>{s.body}</p>
              </section>
            ))}

            {project.metrics && project.metrics.length > 0 && (
              <section className={styles.clause} aria-labelledby="clause-footing">
                <h2 id="clause-footing" className={styles.clauseHead}>
                  <span className={styles.clauseMark}>§5</span>
                  Footing
                </h2>
                <table className={styles.metricTable}>
                  <caption className={styles.srOnly}>Figures for {project.title}</caption>
                  <thead>
                    <tr>
                      <th scope="col">Ln.</th>
                      <th scope="col">Line item</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.metrics.map((m, i) => (
                      <tr key={m}>
                        <td>{`${entry.no}.${i + 1}`}</td>
                        <td>{m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </div>

        <nav className={styles.pager} aria-label="Adjacent entries">
          {prev ? (
            <Link to={entryPath(prev.project.slug)} className={styles.pagerLink}>
              <span className={styles.pagerDir}>Previous entry</span>
              <span className={styles.pagerTitle}>
                <span className={styles.pagerNo}>{prev.no}</span> {prev.project.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          <Link to={`${LEDGER_BASE}#index`} className={`${styles.pagerLink} ${styles.pagerIndex}`}>
            <span className={styles.pagerDir}>Back to</span>
            <span className={styles.pagerTitle}>Index</span>
          </Link>
          {next ? (
            <Link to={entryPath(next.project.slug)} className={`${styles.pagerLink} ${styles.pagerNext}`}>
              <span className={styles.pagerDir}>Next entry</span>
              <span className={styles.pagerTitle}>
                <span className={styles.pagerNo}>{next.no}</span> {next.project.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>

      <footer className={styles.signoff}>
        <p className={styles.signoffNote}>
          {siteMeta.name} · {siteMeta.availability}{" "}
          <a href={siteMeta.emailHref} className={styles.textLink}>
            {siteMeta.email}
          </a>
        </p>
      </footer>
    </div>
  );
}
