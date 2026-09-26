import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router";
import {
  contactLinks,
  educationItems,
  experienceItems,
  nowItems,
  nowMeta,
  siteMeta,
} from "../../data/siteContent";
import styles from "./ledger.module.css";
import {
  FONT_HREF,
  entries,
  entryPath,
  footing,
  lines,
  onLine,
  periodLabel,
  type Entry,
} from "./ledger";

type SortKey = "no" | "title" | "period" | "status";
type SortDir = "ascending" | "descending";

const compare: Record<SortKey, (a: Entry, b: Entry) => number> = {
  no: (a, b) => a.index - b.index,
  title: (a, b) => a.project.title.localeCompare(b.project.title, "en", { sensitivity: "base" }),
  period: (a, b) => a.start - b.start || a.end - b.end || a.index - b.index,
  status: (a, b) => a.project.status.localeCompare(b.project.status) || a.index - b.index,
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function LedgerHome() {
  const { hash } = useLocation();

  // Arriving from an entry page's "Index" link lands on the table.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "no", dir: "ascending" });
  const [filter, setFilter] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState(entries[0].project.slug);

  const rows = useMemo(() => {
    const visible = filter ? entries.filter((e) => onLine(e, filter)) : entries;
    const sorted = [...visible].sort(compare[sort.key]);
    return sort.dir === "descending" ? sorted.reverse() : sorted;
  }, [sort, filter]);

  // FLIP: capture row positions right before a sort/filter change, then
  // animate each surviving row from its old spot to its new one.
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());
  const before = useRef<Map<string, number> | null>(null);

  const capture = () => {
    const origin = bodyRef.current?.getBoundingClientRect().top ?? 0;
    const map = new Map<string, number>();
    rowRefs.current.forEach((el, slug) => map.set(slug, el.getBoundingClientRect().top - origin));
    before.current = map;
  };

  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (!prev || prefersReducedMotion()) return;
    const origin = bodyRef.current?.getBoundingClientRect().top ?? 0;
    rowRefs.current.forEach((el, slug) => {
      const top = el.getBoundingClientRect().top - origin;
      const was = prev.get(slug);
      if (was === undefined) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: 120, easing: "ease-out", fill: "backwards" });
      } else if (Math.abs(was - top) > 0.5) {
        el.animate([{ transform: `translateY(${was - top}px)` }, { transform: "translateY(0)" }], {
          duration: 460,
          easing: "cubic-bezier(0.2, 0.7, 0.1, 1)",
        });
      }
    });
  }, [rows]);

  const onSort = (key: SortKey) => {
    capture();
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "ascending" ? "descending" : "ascending" }
        : { key, dir: "ascending" },
    );
  };

  const onFilter = (name: string | null) => {
    if (name === filter) return;
    capture();
    setFilter(name);
  };

  const preview = rows.find((e) => e.project.slug === previewSlug) ?? rows[0] ?? entries[0];

  const sortHeader = (key: SortKey, label: string, className?: string) => {
    const active = sort.key === key;
    return (
      <th scope="col" className={className} aria-sort={active ? sort.dir : "none"}>
        <button type="button" className={styles.sortButton} onClick={() => onSort(key)}>
          {label}
          <span className={styles.sortMark} aria-hidden="true" data-active={active || undefined}>
            {active ? (sort.dir === "ascending" ? "↑" : "↓") : "↕"}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <a className={styles.skip} href="#index">
        Skip to the index
      </a>

      <header className={styles.masthead}>
        <Link to="/lab/ledger" className={styles.mastName}>
          Ala Arab
        </Link>
        <span className={styles.mastMeta}>Ledger of work</span>
        <span className={styles.mastMeta}>{siteMeta.location}</span>
        <span className={styles.mastMeta}>As of {nowMeta.asOf}</span>
        <nav aria-label="Site" className={styles.mastNav}>
          <a href="#index">Index</a>
          <a href="#journal">Journal</a>
          <a href="#open-items">Open items</a>
          <a href="/resume">Resume</a>
        </nav>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="ledger-name">
          <h1 id="ledger-name" className={styles.name}>
            Ala Arab
          </h1>
          <p className={styles.statement}>{siteMeta.title}</p>
          <p className={styles.intro}>{siteMeta.intro}</p>

          <div className={styles.footing}>
            <p className={styles.footingHead} id="footing-caption">
              <span>Footing</span>
              <span>Totals computed from the entries below</span>
            </p>
            <dl className={styles.footingGrid} aria-labelledby="footing-caption">
              {footing.map((line) => (
                <div key={line.label} className={styles.footingCell}>
                  <dt>{line.label}</dt>
                  <dd>
                    <span className={styles.figure}>{line.figure}</span>
                    <span className={styles.figureNote}>{line.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="index" className={styles.section} aria-labelledby="index-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNo}>A</span>
            <h2 id="index-title" className={styles.sectionTitle}>
              Index of work
            </h2>
            <p className={styles.sectionNote}>{siteMeta.summary}</p>
          </div>

          <div className={styles.controls}>
            <div className={styles.filters} role="group" aria-label="Filter by line of work">
              <span className={styles.controlLabel}>Line of work</span>
              <button
                type="button"
                className={styles.filter}
                aria-pressed={filter === null}
                onClick={() => onFilter(null)}
              >
                All <span className={styles.filterCount}>{entries.length}</span>
              </button>
              {lines.map((line) => (
                <button
                  key={line.name}
                  type="button"
                  className={styles.filter}
                  aria-pressed={filter === line.name}
                  onClick={() => onFilter(line.name)}
                >
                  {line.name} <span className={styles.filterCount}>{line.count}</span>
                </button>
              ))}
            </div>
            <p className={styles.count} aria-live="polite">
              Showing <strong>{rows.length}</strong> of {entries.length}
            </p>
          </div>

          <div className={styles.indexWrap}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                All projects. Column headers with buttons sort the table.
              </caption>
              <thead>
                <tr>
                  {sortHeader("no", "No.", styles.colNo)}
                  {sortHeader("title", "Project", styles.colTitle)}
                  <th scope="col" className={styles.colLine}>
                    Line of work
                  </th>
                  {sortHeader("period", "Period", styles.colPeriod)}
                  {sortHeader("status", "Status", styles.colStatus)}
                  <th scope="col" className={styles.colStack}>
                    Stack
                  </th>
                </tr>
              </thead>
              <tbody ref={bodyRef}>
                {rows.map((entry) => {
                  const { project } = entry;
                  const active = project.slug === preview.project.slug;
                  return (
                    <tr
                      key={project.slug}
                      ref={(el) => {
                        if (el) rowRefs.current.set(project.slug, el);
                        else rowRefs.current.delete(project.slug);
                      }}
                      className={styles.row}
                      data-active={active || undefined}
                      style={{ "--row-accent": project.accent ?? "var(--ink)" } as CSSProperties}
                      onMouseEnter={() => setPreviewSlug(project.slug)}
                      onFocus={() => setPreviewSlug(project.slug)}
                    >
                      <td className={styles.colNo} data-label="No.">
                        {entry.no}
                      </td>
                      <td className={styles.colTitle}>
                        <span
                          className={styles.swatch}
                          data-hollow={!project.accent || undefined}
                          aria-hidden="true"
                        />
                        <Link to={entryPath(project.slug)} className={styles.rowLink}>
                          {project.title}
                        </Link>
                        <span className={styles.rowSummary}>{project.summary}</span>
                      </td>
                      <td className={styles.colLine} data-label="Line">
                        {project.thread ?? project.category}
                        {project.thread && (
                          <span className={styles.lineSub}>{project.category}</span>
                        )}
                      </td>
                      <td className={styles.colPeriod} data-label="Period">
                        {periodLabel(project.year)}
                      </td>
                      <td className={styles.colStatus} data-label="Status">
                        {project.status}
                      </td>
                      <td className={styles.colStack} data-label="Stack">
                        {project.stack.join(", ")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <aside className={styles.preview} aria-hidden="true">
              <div
                className={styles.previewInner}
                style={{ "--row-accent": preview.project.accent ?? "var(--ink)" } as CSSProperties}
              >
                <p className={styles.previewNo}>
                  <span>Entry {preview.no}</span>
                  <span>{preview.line}</span>
                </p>
                <p className={styles.previewTitle}>{preview.project.title}</p>
                <p className={styles.previewSummary}>{preview.project.summary}</p>
                {preview.project.metrics && (
                  <ul className={styles.previewMetrics}>
                    {preview.project.metrics.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                )}
                <Link
                  to={entryPath(preview.project.slug)}
                  className={styles.previewLink}
                  tabIndex={-1}
                >
                  Open entry {preview.no}
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section id="journal" className={styles.section} aria-labelledby="journal-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNo}>B</span>
            <h2 id="journal-title" className={styles.sectionTitle}>
              Journal
            </h2>
            <p className={styles.sectionNote}>
              Employment, most recent first. Full detail on the{" "}
              <a href="/resume" className={styles.textLink}>
                resume
              </a>
              .
            </p>
          </div>

          <ol className={styles.journal}>
            {experienceItems.map((item) => (
              <li key={item.company} className={styles.journalEntry}>
                <p className={styles.journalYears}>{item.years.replace(" to ", "–").replace("present", "now")}</p>
                <div className={styles.journalBody}>
                  <h3 className={styles.journalRole}>{item.role}</h3>
                  <p className={styles.journalCompany}>
                    {item.company}
                    <span className={styles.journalPlace}>{item.location}</span>
                  </p>
                  <p className={styles.journalSummary}>{item.summary}</p>
                </div>
              </li>
            ))}
            {educationItems.map((item) => (
              <li key={item.school} className={`${styles.journalEntry} ${styles.journalMinor}`}>
                <p className={styles.journalYears}>{item.years.replace(" to ", "–")}</p>
                <div className={styles.journalBody}>
                  <h3 className={styles.journalRole}>{item.detail}</h3>
                  <p className={styles.journalCompany}>{item.school}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="open-items" className={styles.section} aria-labelledby="open-title">
          <div className={styles.sectionHead}>
            <span className={styles.sectionNo}>C</span>
            <h2 id="open-title" className={styles.sectionTitle}>
              Open items
            </h2>
            <p className={styles.sectionNote}>
              {nowMeta.intro} As of {nowMeta.asOf}.{" "}
              <a href="/now" className={styles.textLink}>
                Now page
              </a>
            </p>
          </div>

          <ol className={styles.openItems}>
            {nowItems.map((item, i) => (
              <li key={item.heading} className={styles.openItem}>
                <span className={styles.openNo}>Item {i + 1}</span>
                <span className={styles.openBox} aria-hidden="true" />
                <div>
                  <h3 className={styles.openHeading}>{item.heading}</h3>
                  <p className={styles.openBody}>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className={styles.signoff}>
        <p className={styles.signoffLine}>
          <span className={styles.signoffLabel}>Reconciled and signed</span>
          <span className={styles.signature}>{siteMeta.name}</span>
        </p>
        <p className={styles.signoffNote}>
          {siteMeta.availability} {siteMeta.location}.
        </p>
        <ul className={styles.contact}>
          {contactLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={styles.textLink}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {link.label === "Email" ? siteMeta.email : link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/now" className={styles.textLink}>
              Now
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
