import { Link } from "react-router";
import { contactLinks, nowItems, nowMeta, projects, siteMeta } from "../../data/siteContent";
import { HeroLandscape } from "./art";
import { brush, FONT_HREF, InkDefs, INK, paperStyle, Seal, usePaperOverscroll } from "./ink";
import { motifFor } from "./motifs";
import styles from "./inkwash.module.css";

// Featured work first, in the site's own order, then everything else.
const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];

/** The small brush mark before each project name. */
export function Mark({ slug, className }: { slug: string; className?: string }) {
  const [pts, w] = motifFor(slug).mark;
  return (
    <svg className={className} viewBox="0 0 44 28" aria-hidden="true" focusable="false">
      <path d={brush(pts, w, { seed: slug.length * 13 + slug.charCodeAt(0), head: 0.15, tail: 0.1 })} fill={INK.dense} filter="url(#iw-line)" />
    </svg>
  );
}

export function InkwashHome() {
  usePaperOverscroll(INK.paper);
  const email = contactLinks.find((l) => l.label === "Email");
  const others = contactLinks.filter((l) => l.label !== "Email");
  return (
    <div className={styles.root} style={paperStyle}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <InkDefs />

      <header className={styles.hero}>
        <div className={styles.heroArt} data-iw-bloom="">
          <HeroLandscape className={styles.heroSvg} />
        </div>
        <div className={styles.signature}>
          <div className={styles.nameRow}>
            <h1 className={styles.name}>{siteMeta.name}</h1>
            <Seal size={30} className={styles.heroSeal} />
          </div>
          <p className={styles.title}>{siteMeta.title}</p>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.intro} aria-label="Introduction">
          <p className={styles.lead}>{siteMeta.intro}</p>
          <p>
            {siteMeta.location}. {siteMeta.availability}
          </p>
        </section>

        <section className={styles.block} aria-labelledby="iw-work">
          <h2 id="iw-work" className={styles.h2}>
            Work
          </h2>
          <ol className={styles.work}>
            {ordered.map((p) => (
              <li key={p.slug}>
                <Link to={`/lab/inkwash/projects/${p.slug}`} className={styles.workLink}>
                  <Mark slug={p.slug} className={styles.mark} />
                  <span className={styles.workName}>{p.title}</span>
                  <span className={styles.workWords}>{motifFor(p.slug).words}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby="iw-now">
          <h2 id="iw-now" className={styles.h2}>
            Now
          </h2>
          <p className={styles.quiet}>{nowMeta.asOf}</p>
          <ul className={styles.now}>
            {nowItems.slice(0, 3).map((n) => (
              <li key={n.heading}>{n.heading}</li>
            ))}
          </ul>
          <p>
            <Link to="/now" className={styles.textLink}>
              The rest of what I'm working on
            </Link>
          </p>
        </section>

        <section className={styles.block} aria-labelledby="iw-contact">
          <h2 id="iw-contact" className={styles.h2}>
            Write to me
          </h2>
          {email && (
            <p className={styles.email}>
              <a href={email.href} className={styles.textLink}>
                {siteMeta.email}
              </a>
            </p>
          )}
          <p className={styles.contactRow}>
            {others.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.label} to={l.href} className={styles.textLink}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className={styles.textLink}>
                  {l.label}
                </a>
              ),
            )}
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <Seal size={26} label="Seal of Ala Arab" />
      </footer>
    </div>
  );
}
