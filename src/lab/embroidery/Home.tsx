import { type CSSProperties, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { siteMeta } from "../../data/siteContent";
import { useDocumentTitle } from "../../lib/useDocumentTitle";
import { EmblemArt } from "./emblems";
import { Cloth, Knots, Run, StitchedWords, thread, useSvgId } from "./stitch";
import { FONT_HREF, band, everyProject, projectPath, themeFor } from "./themes";
import styles from "./embroidery.module.css";

/** The narrow stitched border above and below each length of the band. */
export function BandEdge({ side }: { side: "top" | "bottom" | "left" | "right" }) {
  const vertical = side === "left" || side === "right";
  const pat = useSvgId(`edge${side}`);
  const line = (o: number, key: string, dash: string, w: number) =>
    vertical ? (
      <g key={key}>
        <line x1={o + 0.5} y1="0" x2={o + 0.5} y2="100%" stroke="rgba(59,43,31,.3)" strokeWidth={w} strokeDasharray={dash} transform="translate(0 0.6)" />
        <line x1={o} y1="0" x2={o} y2="100%" stroke={o > 10 ? thread.madder : thread.walnut} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" />
      </g>
    ) : (
      <g key={key}>
        <line x1="0" y1={o + 0.6} x2="100%" y2={o + 0.6} stroke="rgba(59,43,31,.3)" strokeWidth={w} strokeDasharray={dash} transform="translate(0.5 0)" />
        <line x1="0" y1={o} x2="100%" y2={o} stroke={o > 10 ? thread.madder : thread.walnut} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" />
      </g>
    );
  return (
    <svg className={styles.edge} data-side={side} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={pat} width="44" height="44" patternUnits="userSpaceOnUse" patternTransform={vertical ? "rotate(90)" : undefined}>
          <circle cx="22.5" cy="9.7" r="1.9" fill="rgba(59,43,31,.3)" />
          <circle cx="22" cy="9" r="1.9" fill={thread.weld} />
        </pattern>
      </defs>
      {line(2, "a", "5 4", 1.6)}
      {vertical ? <rect x="0" y="0" width="18" height="100%" fill={`url(#${pat})`} /> : <rect x="0" y="0" width="100%" height="18" fill={`url(#${pat})`} />}
      {line(16, "b", "3 4", 1.2)}
    </svg>
  );
}

function Sprig() {
  return (
    <svg viewBox="0 0 22 56" className={styles.sprig} aria-hidden="true" focusable="false">
      <path d="M11.5 54.6 C11 40 12 22 11 6" stroke="rgba(59,43,31,.3)" strokeWidth="1.6" fill="none" />
      <path d="M11 54 C10.5 40 11.5 22 10.5 5" stroke={thread.green} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M11 30 C6 28 4 22 4 18 M11 38 C16 36 18 30 18 26" stroke={thread.green} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Knots c={thread.weld} r={2.2} pts={[[10.5, 5], [4, 17], [18, 25]]} />
    </svg>
  );
}

/** A running-stitch border that sews a label onto the cloth. */
export function LabelStitch({ c = thread.madder }: { c?: string }) {
  return (
    <svg className={styles.labelStitch} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="100%" height="100%" rx="3" fill="none" stroke="rgba(59,43,31,.3)" strokeWidth="1.6" strokeDasharray="5 4" transform="translate(0.6 0.8)" />
      <rect x="0" y="0" width="100%" height="100%" rx="3" fill="none" stroke={c} strokeWidth="1.6" strokeDasharray="5 4" strokeLinecap="round" />
    </svg>
  );
}

export function EmbroideryHome() {
  useDocumentTitle("Ala Arab | Embroidery");
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  let lastYear = "";

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />

      <header className={styles.masthead}>
        <h1 className={styles.name}>Ala Arab</h1>
        <Cloth viewBox="0 0 200 8" className={styles.nameRule} wobble={false}>
          <Run c={thread.madder} w={1.6} dash={[4, 3.4]} d="M3 4 H197" />
        </Cloth>
        <p className={styles.title}>{siteMeta.title}</p>
        <p className={styles.intro}>
          {siteMeta.intro} Based in Los Angeles.
        </p>
        <nav className={styles.contactLine} aria-label="Contact">
          <a href={siteMeta.emailHref}>{siteMeta.email}</a>
          <a href={siteMeta.linkedinHref}>LinkedIn</a>
          <a href="/resume">Resume</a>
          <a href="/now">Now</a>
        </nav>
      </header>

      <section id="band" className={styles.bandSection} aria-labelledby="band-heading">
        <h2 id="band-heading" className={styles.bandHeading}>
          The work, in the order it was made
        </h2>
        <ol className={styles.band}>
          {band.map((p) => {
            const year = p.year.slice(0, 4);
            const mark = year !== lastYear ? year : "";
            lastYear = year;
            return (
              <li key={p.slug} className={styles.length} style={{ "--thread": themeFor(p.slug).thread } as CSSProperties}>
                <BandEdge side="top" />
                <BandEdge side="bottom" />
                <BandEdge side="left" />
                <BandEdge side="right" />
                <Sprig />
                <Link to={projectPath(p.slug)} className={styles.emblemLink}>
                  <Cloth viewBox="0 0 120 120" className={styles.emblem}>
                    <EmblemArt slug={p.slug} />
                  </Cloth>
                  <span className={styles.emblemName}>{p.title}</span>
                  <span className={styles.srOnly}>, {p.year}</span>
                </Link>
                {mark && (
                  <span className={styles.yearMark} aria-hidden="true">
                    <StitchedWords text={mark} c={thread.madder} size={18} width={48} italic />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.keySection} aria-labelledby="key-heading">
        <div className={styles.label}>
          <LabelStitch c={thread.walnut} />
          <h2 id="key-heading" className={styles.labelHeading}>
            The key
          </h2>
          <p className={styles.labelNote}>Every project, oldest first.</p>
          <ol className={styles.keyList}>
            {everyProject.map((p) => (
              <li key={p.slug}>
                <svg viewBox="0 0 12 12" className={styles.keyKnot} aria-hidden="true" focusable="false">
                  <Knots c={themeFor(p.slug).thread} r={3.4} pts={[[6, 6]]} />
                </svg>
                <Link to={projectPath(p.slug)}>{p.title}</Link>
                <span className={styles.keyYear}>{p.year}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className={styles.signatureWrap}>
        <div className={styles.signature}>
          <LabelStitch />
          <h2 className={styles.srOnly}>Contact</h2>
          <StitchedWords text="Ala Arab, Los Angeles" c={thread.madder} size={30} width={320} className={styles.signatureWords} />
          <p className={styles.srOnly}>Ala Arab, Los Angeles</p>
          <p className={styles.signatureNote}>{siteMeta.availability}</p>
          <p className={styles.signatureLinks}>
            <a href={siteMeta.emailHref}>{siteMeta.email}</a>
            <a href={siteMeta.linkedinHref}>LinkedIn</a>
            <a href="/resume">Resume</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
