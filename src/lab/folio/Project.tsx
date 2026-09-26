import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Link, useParams } from "react-router";
import { siteMeta } from "../../data/siteContent";
import type { Project } from "../../types";
import { externalLinks } from "../util";
import {
  Emblem,
  GOLD,
  MinaArt,
  MotifArt,
  Ornament,
  PhrenArt,
  wavePath,
} from "./art";
import {
  BASE,
  chapterBySlug,
  chapters,
  FONT_HREF,
  KEYFRAMES,
  type Chapter,
} from "./book";
import styles from "./folio.module.css";

const listJoin = (items: string[]) =>
  items.length < 3
    ? items.join(" and ")
    : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;

const stripDot = (s: string) => s.replace(/\.$/, "");

export function FolioProject() {
  const { slug } = useParams<{ slug: string }>();
  const chapter = chapterBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!chapter) return <NotInEdition />;

  const { project: p, style } = chapter;
  const themed = {
    "--ink": style.ink,
    "--paper": style.paper,
  } as CSSProperties;
  const isMina = p.slug === "mina";

  return (
    <div
      className={`${styles.root} ${styles.chapterRoot} ${isMina ? styles.bedtime : ""}`}
      style={themed}
    >
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <style href="folio-keyframes" precedence="default">
        {KEYFRAMES}
      </style>
      <title>{`${p.title} · Ala Arab`}</title>

      <header className={styles.runningHead}>
        <Link to={`${BASE}#contents`} className={styles.headLink}>
          {siteMeta.name}
        </Link>
        <span className={styles.headRight}>
          Chapter {chapter.numeral} · {p.title}
        </span>
      </header>

      <article className={styles.chapter}>
        <p className={styles.chapterNum}>Chapter {chapter.numeral}</p>
        <h1 className={styles.chapterTitle}>{p.title}</h1>
        {p.quote && (
          <blockquote className={styles.epigraph}>
            <p>{p.quote}</p>
          </blockquote>
        )}

        <Frontispiece chapter={chapter} />

        <p className={styles.dropcap}>{p.summary}</p>
        <Ornament color={GOLD} />
        <p className={styles.prose}>{p.problem}</p>
        <p className={styles.prose}>{p.build}</p>
        <Ornament color={GOLD} />
        <p className={styles.prose}>{p.impact}</p>
        <p className={styles.prose}>{p.outcome}</p>

        <Notes project={p} />
      </article>

      <ChapterFoot chapter={chapter} />
    </div>
  );
}

function Notes({ project: p }: { project: Project }) {
  const links = externalLinks(p);
  return (
    <div className={styles.notes}>
      <p>
        <span className={styles.smallcaps}>Notes.</span> Written in{" "}
        {listJoin(p.stack)}. {p.year};{" "}
        {p.status.charAt(0).toLowerCase() + p.status.slice(1)}.
        {p.metrics && p.metrics.length > 0 && (
          <> {p.metrics.map(stripDot).join(". ")}.</>
        )}
      </p>
      {links.length > 0 && (
        <p className={styles.noteLinks}>
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </p>
      )}
    </div>
  );
}

function ChapterFoot({ chapter }: { chapter: Chapter }) {
  const i = chapter.number - 1;
  const prev = chapters[i - 1];
  const next = chapters[i + 1];
  return (
    <nav className={styles.chapterFoot} aria-label="Chapters">
      <span>
        {prev && (
          <Link to={`${BASE}/projects/${prev.project.slug}`} rel="prev">
            <span aria-hidden="true">‹ </span>
            {prev.numeral}. {prev.project.title}
          </Link>
        )}
      </span>
      <Link to={`${BASE}#contents`} className={styles.footContents}>
        Contents
      </Link>
      <span className={styles.footNext}>
        {next && (
          <Link to={`${BASE}/projects/${next.project.slug}`} rel="next">
            {next.numeral}. {next.project.title}
            <span aria-hidden="true"> ›</span>
          </Link>
        )}
      </span>
      <p className={styles.folio}>{chapter.page}</p>
    </nav>
  );
}

function Frontispiece({ chapter }: { chapter: Chapter }) {
  const { project: p, style } = chapter;
  if (p.slug === "m4l-builder") return <InstrumentSpread />;
  return (
    <figure
      className={`${styles.plate} ${p.slug === "mina" ? styles.plateNight : ""}`}
    >
      {p.slug === "phren" ? (
        <PhrenArt />
      ) : p.slug === "mina" ? (
        <MinaArt />
      ) : (
        <MotifArt motif={style.motif} />
      )}
      <figcaption>
        <span className={styles.smallcaps}>Frontispiece.</span> {style.caption}
      </figcaption>
    </figure>
  );
}

/* ---------- m4l-builder: a panel with one working knob, and the wave it draws ---------- */

const MIN = 1;
const MAX = 12;
const SWEEP = 270;

function InstrumentSpread() {
  const [n, setN] = useState(3);
  const drag = useRef<{ y: number; x: number; v: number } | null>(null);

  const clamp = (v: number) => Math.max(MIN, Math.min(MAX, Math.round(v)));
  const angle = -SWEEP / 2 + ((n - MIN) / (MAX - MIN)) * SWEEP;
  const label = n === 1 ? "1 harmonic, a pure sine" : `${n} harmonics`;

  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: 3,
      PageDown: -3,
    };
    if (e.key in step) setN((v) => clamp(v + step[e.key]));
    else if (e.key === "Home") setN(MIN);
    else if (e.key === "End") setN(MAX);
    else return;
    e.preventDefault();
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, x: e.clientX, v: n };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const d = drag.current.y - e.clientY + (e.clientX - drag.current.x);
    setN(clamp(drag.current.v + d / 14));
  };
  const onUp = () => {
    drag.current = null;
  };

  const W = 360;
  const H = 180;

  return (
    <figure className={styles.spreadFig}>
      <div className={styles.facing}>
        <div className={styles.panel}>
          <div className={styles.panelBox}>
            <svg
              className={styles.panelArt}
              viewBox="0 0 300 300"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
            >
              <rect
                x="12"
                y="12"
                width="276"
                height="276"
                rx="6"
                strokeWidth="1.6"
              />
              <rect
                x="22"
                y="22"
                width="256"
                height="256"
                rx="3"
                strokeWidth="0.8"
              />
              {[
                [36, 36],
                [264, 36],
                [36, 264],
                [264, 264],
              ].map(([x, y], i) => (
                <g key={i} strokeWidth="1">
                  <circle cx={x} cy={y} r="6" />
                  <path d={`M${x - 4} ${y + 2} L${x + 4} ${y - 2}`} />
                </g>
              ))}
              {Array.from({ length: MAX - MIN + 1 }, (_, i) => {
                const a =
                  ((-SWEEP / 2 + (i / (MAX - MIN)) * SWEEP - 90) * Math.PI) /
                  180;
                const r1 = 84;
                const r2 = i % 11 === 0 ? 96 : 92;
                return (
                  <path
                    key={i}
                    d={`M${150 + Math.cos(a) * r1} ${140 + Math.sin(a) * r1} L${150 + Math.cos(a) * r2} ${140 + Math.sin(a) * r2}`}
                    strokeWidth={i + MIN === n ? 2.4 : 1}
                    stroke={i + MIN <= n ? GOLD : "currentColor"}
                  />
                );
              })}
              <path d="M70 250 H230" strokeWidth="0.8" />
              <circle cx="80" cy="232" r="7" strokeWidth="1.2" />
              <circle cx="80" cy="232" r="2.5" strokeWidth="1" />
              <circle cx="220" cy="232" r="7" strokeWidth="1.2" />
              <circle cx="220" cy="232" r="2.5" strokeWidth="1" />
            </svg>
            <span className={styles.jackIn}>in</span>
            <span className={styles.jackOut}>out</span>
            <div
              className={styles.knob}
              role="slider"
              tabIndex={0}
              aria-label="Harmonics"
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={n}
              aria-valuetext={label}
              onKeyDown={onKey}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <svg
                viewBox="0 0 120 120"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
              >
                <defs>
                  <pattern
                    id="knobHatch"
                    width="4"
                    height="4"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(40)"
                  >
                    <path d="M0 0 V4" strokeWidth="0.9" />
                  </pattern>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  strokeWidth="1.6"
                  fill="url(#knobHatch)"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  strokeWidth="1.2"
                  fill="var(--paper)"
                />
                <g transform={`rotate(${angle} 60 60)`}>
                  <path d="M60 24 V46" strokeWidth="3" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <span className={styles.knobLabel}>Harmonics</span>
          </div>
        </div>
        <div className={styles.wavePage}>
          <svg
            className={styles.waveArt}
            viewBox={`0 0 ${W} ${H}`}
            aria-hidden="true"
            fill="none"
          >
            <path
              d={`M0 ${H / 2} H${W}`}
              stroke="currentColor"
              strokeWidth="0.7"
              strokeDasharray="2 5"
            />
            {Array.from({ length: 9 }, (_, i) => (
              <path
                key={i}
                d={`M${(i * W) / 8} ${H / 2 - 4} V${H / 2 + 4}`}
                stroke="currentColor"
                strokeWidth="0.7"
              />
            ))}
            {[3, 1.5, 0].map((o, i) => (
              <path
                key={o}
                d={wavePath(n, W, H, o)}
                stroke={i === 2 ? "currentColor" : GOLD}
                strokeWidth={i === 2 ? 1.8 : 0.8}
                strokeLinejoin="round"
                opacity={i === 2 ? 1 : 0.8}
              />
            ))}
          </svg>
          <p className={styles.waveCaption} aria-live="polite">
            <i>fig.</i> The wave at {label}.
          </p>
        </div>
      </div>
      <figcaption>
        <span className={styles.smallcaps}>Frontispiece.</span> An instrument
        panel, and the wave it draws. Turn the knob.
      </figcaption>
    </figure>
  );
}

function NotInEdition() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={`${styles.root} ${styles.chapterRoot}`}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <style href="folio-keyframes" precedence="default">
        {KEYFRAMES}
      </style>
      <title>Not in this edition · Ala Arab</title>
      <header className={styles.runningHead}>
        <Link to={`${BASE}#contents`} className={styles.headLink}>
          {siteMeta.name}
        </Link>
        <span className={styles.headRight}>Errata</span>
      </header>
      <article className={`${styles.chapter} ${styles.missing}`}>
        <Emblem className={styles.missingEmblem} color="#8a6d3e" />
        <h1 className={styles.chapterTitle}>Not in this edition</h1>
        <p className={styles.prose}>
          There is no chapter by that name. It may have been renamed, or not yet
          written.
        </p>
        <p className={styles.noteLinks}>
          <Link to={`${BASE}#contents`}>Return to the contents</Link>
        </p>
      </article>
    </div>
  );
}
