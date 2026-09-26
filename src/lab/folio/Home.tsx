import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { nowMeta, siteMeta } from "../../data/siteContent";
import { Emblem, Endpaper, Landscape, Ornament } from "./art";
import { BASE, chapters, FONT_HREF, KEYFRAMES, lastPage } from "./book";
import styles from "./folio.module.css";

type CoverState = "closed" | "opening" | "open";

const PREFACE_PAGE = "vii";

export function FolioHome() {
  const { hash } = useLocation();
  const [cover, setCover] = useState<CoverState>(hash ? "open" : "closed");
  const coverRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    setCover((c) => (c === "closed" ? "opening" : c));
  }, []);

  // Scroll or Enter anywhere opens the book.
  useEffect(() => {
    if (cover !== "closed") return;
    const onScroll = () => {
      if (window.scrollY > 24) open();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.activeElement === document.body) open();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [cover, open]);

  // Returning to the contents from a chapter.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  const onCoverDone = () => setCover("open");

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <style href="folio-keyframes" precedence="default">
        {KEYFRAMES}
      </style>
      <title>Ala Arab</title>

      <section
        className={styles.stage}
        aria-label="Cover and title page"
        onFocus={(e) => {
          if (!coverRef.current?.contains(e.target)) open();
        }}
      >
        {/* Beneath the cover: the endpaper and the title page, as an open spread. */}
        <div className={styles.spread}>
          <div className={styles.endpaperPage}>
            <Endpaper className={styles.endpaper} />
          </div>
          <div className={`${styles.page} ${styles.titlePage}`}>
            <Emblem className={styles.titleEmblem} />
            <p className={styles.titleName}>{siteMeta.name}</p>
            <div className={styles.titleRule} aria-hidden="true" />
            <p className={styles.titleSub}>{siteMeta.title}</p>
            <div className={styles.imprint}>
              <p className={styles.smallcaps}>Los Angeles</p>
              <p className={styles.imprintDate}>{nowMeta.asOf}</p>
              <p className={styles.imprintMail}>
                <a href={siteMeta.emailHref}>{siteMeta.email}</a>
              </p>
            </div>
            <a href="#preface" className={styles.catchword}>
              Preface
            </a>
          </div>
        </div>

        {cover !== "open" && (
          <div
            ref={coverRef}
            className={`${styles.cover} ${cover === "opening" ? styles.coverOpening : ""}`}
            onClick={open}
            onAnimationEnd={(e) => {
              if (e.target === coverRef.current) onCoverDone();
            }}
            aria-hidden={cover === "opening"}
          >
            <div className={styles.coverCloth} aria-hidden="true" />
            <div className={styles.coverBorder} aria-hidden="true" />
            <div className={styles.coverInner}>
              <h1 className={styles.coverName}>{siteMeta.name}</h1>
              <Emblem className={styles.coverEmblem} />
              <p className={styles.coverTitle}>Full-stack developer</p>
              <p className={styles.coverPlace}>Los Angeles</p>
            </div>
            <button type="button" className={styles.openButton} onClick={open}>
              Open the book
            </button>
          </div>
        )}
        {cover === "open" && <h1 className={styles.srOnly}>{siteMeta.name}</h1>}
      </section>

      <div className={styles.book}>
        <figure className={styles.bookPlate}>
          <Landscape />
          <figcaption>
            <span className={styles.smallcaps}>Frontispiece.</span> The mark on
            the cover, painted.
          </figcaption>
        </figure>

        <section className={styles.page} aria-labelledby="preface">
          <h2 id="preface" className={styles.pageHeading}>
            Preface
          </h2>
          <p className={styles.dropcap}>{siteMeta.summary}</p>
          <p className={styles.prose}>{siteMeta.intro}</p>
          <p className={styles.signoff}>A. A., {nowMeta.asOf}</p>
          <p className={styles.folio}>{PREFACE_PAGE}</p>
        </section>

        <Ornament />

        <nav
          className={styles.page}
          aria-labelledby="contents-heading"
          id="contents"
        >
          <h2 id="contents-heading" className={styles.pageHeading}>
            Contents
          </h2>
          <ol className={styles.toc}>
            <li className={styles.tocRow}>
              <a href="#preface" className={styles.tocLink}>
                <span className={styles.tocNum} />
                <span className={styles.tocTitle}>
                  <i>Preface</i>
                </span>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.tocPage}>{PREFACE_PAGE}</span>
              </a>
            </li>
            {chapters.map((c) => (
              <li key={c.project.slug} className={styles.tocRow}>
                <Link
                  to={`${BASE}/projects/${c.project.slug}`}
                  className={styles.tocLink}
                >
                  <span className={styles.tocNum}>{c.numeral}</span>
                  <span className={styles.tocTitle}>{c.project.title}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.tocPage}>{c.page}</span>
                </Link>
              </li>
            ))}
          </ol>
          <p className={styles.tocPart}>Appendices</p>
          <ol className={styles.toc}>
            <li className={styles.tocRow}>
              <a href="/resume" className={styles.tocLink}>
                <span className={styles.tocNum}>A</span>
                <span className={styles.tocTitle}>Resume</span>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.tocPage}>{lastPage}</span>
              </a>
            </li>
            <li className={styles.tocRow}>
              <a href="/now" className={styles.tocLink}>
                <span className={styles.tocNum}>B</span>
                <span className={styles.tocTitle}>Now</span>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.tocPage}>{lastPage + 3}</span>
              </a>
            </li>
            <li className={styles.tocRow}>
              <a href="#colophon" className={styles.tocLink}>
                <span className={styles.tocNum} />
                <span className={styles.tocTitle}>
                  <i>Colophon</i>
                </span>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.tocPage}>{lastPage + 5}</span>
              </a>
            </li>
          </ol>
          <p className={styles.folio}>ix</p>
        </nav>

        <Ornament />

        <section
          className={`${styles.page} ${styles.colophon}`}
          aria-labelledby="colophon"
        >
          <h2 id="colophon" className={styles.pageHeading}>
            Colophon
          </h2>
          <p className={styles.prose}>
            Set in EB Garamond, with display lines in Cormorant Garamond. Bound
            in slate-blue cloth, stamped in gold. Composed for the screen in{" "}
            {siteMeta.location}.
          </p>
          <p className={styles.prose}>
            Published by the author. {siteMeta.availability} Correspondence to{" "}
            <a href={siteMeta.emailHref}>{siteMeta.email}</a>, or on{" "}
            <a href={siteMeta.linkedinHref}>LinkedIn</a>.
          </p>
          <Emblem className={styles.colophonEmblem} color="#8a6d3e" />
          <p className={styles.folio}>{lastPage + 5}</p>
        </section>
      </div>
    </div>
  );
}
