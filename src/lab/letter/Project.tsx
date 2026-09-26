import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import type { Project } from "../../types";
import { externalLinks, projectBySlug } from "../util";
import { Mark, useSvgId } from "./art";
import { FontLink } from "./FontLink";
import { Knob } from "./Knob";
import { fallbackPaper, papers } from "./papers";
import styles from "./letter.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** "a, b and c" */
const joinAnd = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/** Skip the quote when it repeats text already on the page (Mina's does). */
const freshQuote = (p: Project) =>
  p.quote && ![p.summary, p.impact, p.outcome].some((t) => t.includes(p.quote!)) ? p.quote : undefined;

function BackLink() {
  return (
    <nav className={styles.back} aria-label="Back">
      <Link to="/lab/letter">
        <span aria-hidden="true">&larr; </span>Back to the letter
      </Link>
    </nav>
  );
}

function Stack({ p }: { p: Project }) {
  return <p className={styles.madeWith}>Made with {joinAnd(p.stack)}.</p>;
}

function Elsewhere({ p }: { p: Project }) {
  const links = externalLinks(p);
  if (!links.length) return null;
  return (
    <p className={styles.elsewhere}>
      Elsewhere:{" "}
      {links.map((l, i) => (
        <span key={l.href}>
          {i > 0 && (i === links.length - 1 ? " and " : ", ")}
          <a href={l.href}>{l.label}</a>
        </span>
      ))}
      .
    </p>
  );
}

function Meta({ p }: { p: Project }) {
  return (
    <p className={styles.meta}>
      {p.year}, {p.status.charAt(0).toLowerCase() + p.status.slice(1)}
    </p>
  );
}

function Page({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={cx(styles.root, className)} style={style}>
      <FontLink />
      <BackLink />
      <main className={styles.pageStage}>{children}</main>
    </div>
  );
}

/* ---------- Phren: index cards held with a clip ---------- */

function BinderClip() {
  return (
    <svg className={styles.clip} viewBox="0 0 120 90" aria-hidden="true">
      <path d="M22 40 L98 40 L92 74 L28 74 Z" fill="#2f2b3a" />
      <path d="M26 44 L94 44 L90 70 L30 70 Z" fill="#433d55" opacity="0.6" />
      <path d="M38 40 C 30 22, 36 6, 50 6 C 60 6, 62 18, 58 40" fill="none" stroke="#8d8a96" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M82 40 C 90 22, 84 6, 70 6 C 60 6, 58 18, 62 40" fill="none" stroke="#8d8a96" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

function Rosemary() {
  const f = useSvgId("rosemary");
  const needles = Array.from({ length: 22 }, (_, i) => i);
  return (
    <svg className={styles.rosemary} viewBox="0 0 90 240" aria-hidden="true">
      <defs>
        <filter id={f} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="2" />
        </filter>
      </defs>
      <g filter={`url(#${f})`}>
        <path d="M50 236 C 46 180, 44 110, 38 8" fill="none" stroke="#6f6a58" strokeWidth="2" strokeLinecap="round" />
        {needles.map((i) => {
          const y = 20 + i * 9.5;
          const x = 38 + (y / 236) * 12;
          const side = i % 2 ? 1 : -1;
          return (
            <ellipse
              key={i}
              cx={x + side * 9}
              cy={y}
              rx="2.6"
              ry="11"
              transform={`rotate(${side * 58} ${x + side * 9} ${y})`}
              fill={i % 3 ? "#7f8f78" : "#96a58c"}
              opacity="0.55"
            />
          );
        })}
        {[30, 58, 92].map((y) => (
          <circle key={y} cx={38 + (y / 236) * 12 + 14} cy={y - 4} r="4" fill="#9f93c4" opacity="0.55" />
        ))}
      </g>
    </svg>
  );
}

function PhrenPage({ p }: { p: Project }) {
  const q = freshQuote(p);
  return (
    <Page className={styles.phrenDesk}>
      <div className={styles.cards}>
        <section className={cx(styles.card, styles.cardTop)}>
          <BinderClip />
          <Rosemary />
          <div className={styles.band}>
            <span className={styles.cardNo} aria-hidden="true">1</span>
            <h1 className={styles.cardTitle}>{p.title}</h1>
            <Meta p={p} />
          </div>
          <p>{p.summary}</p>
        </section>
        <section className={cx(styles.card, styles.cardTiltA)}>
          <div className={styles.band}>
            <span className={styles.cardNo} aria-hidden="true">2</span>
          </div>
          <p>{p.problem}</p>
          {q && <blockquote className={styles.cardQuote}>{q}</blockquote>}
        </section>
        <section className={cx(styles.card, styles.cardTiltB)}>
          <div className={styles.band}>
            <span className={styles.cardNo} aria-hidden="true">3</span>
          </div>
          <p>{p.build}</p>
        </section>
        <section className={cx(styles.card, styles.cardTiltA)}>
          <div className={styles.band}>
            <span className={styles.cardNo} aria-hidden="true">4</span>
          </div>
          <p>{p.impact}</p>
          <p>{p.outcome}</p>
        </section>
        <section className={cx(styles.card, styles.cardTiltB)}>
          <div className={styles.band}>
            <span className={styles.cardNo} aria-hidden="true">5</span>
          </div>
          {p.metrics && (
            <ul className={styles.cardList}>
              {p.metrics.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
          <Stack p={p} />
          <Elsewhere p={p} />
        </section>
      </div>
    </Page>
  );
}

/* ---------- m4l-builder: manuscript paper with a working knob ---------- */

const fold = (v: number) => {
  let x = v;
  while (x > 1 || x < -1) x = x > 1 ? 2 - x : -2 - x;
  return x;
};

function Instrument() {
  const [amt, setAmt] = useState(0.35);
  const path = useMemo(() => {
    const gain = 1 + amt * 4;
    const pts: string[] = [];
    for (let i = 0; i <= 240; i++) {
      const x = 10 + (i / 240) * 580;
      const y = 60 - fold(Math.sin((i / 240) * Math.PI * 6) * gain) * 30;
      pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [amt]);
  return (
    <figure className={styles.instrument}>
      <div className={styles.knobCell}>
        <Knob value={amt} onChange={setAmt} label="Wavefold amount" valueText={`${Math.round(amt * 100)} percent fold`} />
        <span className={styles.knobLabel} aria-hidden="true">
          fold
        </span>
      </div>
      <svg className={styles.wave} viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
        {[28, 44, 60, 76, 92].map((y) => (
          <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="currentColor" strokeWidth="0.7" opacity="0.45" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1="1" x2="1" y1="28" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" />
        <line x1="599" x2="599" y1="28" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" />
        <path d={path} fill="none" stroke="#7a4a1e" strokeWidth="1.8" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className={styles.waveCaption}>
        A sine, folded back on itself. Turn the knob.
      </figcaption>
    </figure>
  );
}

function Staff({ direction }: { direction?: string }) {
  return (
    <div className={styles.staff} aria-hidden="true">
      {direction && <span className={styles.direction}>{direction}</span>}
    </div>
  );
}

function M4lPage({ p }: { p: Project }) {
  const q = freshQuote(p);
  const m = p.metrics ?? [];
  return (
    <Page className={styles.m4lDesk}>
      <article className={styles.manuscript}>
        <h1 className={styles.msTitle}>{p.title}</h1>
        <Meta p={p} />
        <p className={styles.msLede}>{p.summary}</p>
        <Instrument />
        <Staff direction={m[0]} />
        <p>{p.problem}</p>
        <Staff direction={m[1]} />
        <p>{p.build}</p>
        <Staff direction={m[2]} />
        <p>{p.impact}</p>
        <p>{p.outcome}</p>
        {q && <blockquote className={styles.msQuote}>{q}</blockquote>}
        <Staff />
        <Stack p={p} />
        <Elsewhere p={p} />
      </article>
    </Page>
  );
}

/* ---------- Mina: a note on the nightstand at 3 AM ---------- */

function MinaPage({ p }: { p: Project }) {
  const q = freshQuote(p);
  return (
    <Page className={styles.night}>
      <div className={styles.lamp} aria-hidden="true" />
      <article className={styles.nightNote}>
        <Mark slug="mina" wash="#c98a90" className={styles.blossom} />
        <h1 className={styles.nightTitle}>{p.title}</h1>
        <Meta p={p} />
        <p className={styles.nightLede}>{p.summary}</p>
        <p>{p.impact}</p>
        <p>{p.problem}</p>
        <p>{p.build}</p>
        <p>{p.outcome}</p>
        {q && <blockquote>{q}</blockquote>}
        {p.metrics && <p className={styles.nightSmall}>{p.metrics.join(". ")}.</p>}
        <Stack p={p} />
        <Elsewhere p={p} />
      </article>
    </Page>
  );
}

/* ---------- Everyone else: their own paper ---------- */

function PaperPage({ p }: { p: Project }) {
  const paper = papers[p.slug] ?? fallbackPaper;
  const q = freshQuote(p);
  const style = { "--ink": paper.ink, "--desk": paper.desk, "--wash": paper.wash } as CSSProperties;
  return (
    <Page className={styles.paperDesk} style={style}>
      <article className={cx(styles.paper, styles[`paper_${paper.kind}`])}>
        <div className={styles.paperHead}>
          <Mark slug={p.slug} wash={paper.wash} className={styles.paperMark} />
          <p className={styles.caption}>{paper.caption}</p>
        </div>
        <h1 className={styles.paperTitle}>{p.title}</h1>
        <Meta p={p} />
        <p className={styles.paperLede}>{p.summary}</p>
        <div className={styles.paperGrid}>
          <div className={styles.paperProse}>
            <p>{p.problem}</p>
            <p>{p.build}</p>
            {q && <blockquote className={styles.paperQuote}>{q}</blockquote>}
            <p>{p.impact}</p>
            <p>{p.outcome}</p>
          </div>
          {p.metrics && (
            <ul className={styles.marginNotes} aria-label="Notes in the margin">
              {p.metrics.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </div>
        <Stack p={p} />
        <Elsewhere p={p} />
      </article>
    </Page>
  );
}

function Missing() {
  return (
    <Page className={styles.desk}>
      <article className={cx(styles.paper, styles.missing)}>
        <h1 className={styles.paperTitle}>Not in the envelope</h1>
        <p>This page seems to have slipped out of the envelope. Everything I've made is mentioned in the letter.</p>
        <p>
          <Link to="/lab/letter">Back to the letter</Link>
        </p>
      </article>
    </Page>
  );
}

export function LetterProject() {
  const { slug } = useParams<{ slug: string }>();
  const p = projectBySlug(slug);
  if (!p) return <Missing />;
  if (p.slug === "phren") return <PhrenPage p={p} />;
  if (p.slug === "m4l-builder") return <M4lPage p={p} />;
  if (p.slug === "mina") return <MinaPage p={p} />;
  return <PaperPage p={p} />;
}
