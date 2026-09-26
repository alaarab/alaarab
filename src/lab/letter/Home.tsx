import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { nowItems, nowMeta, projects, siteMeta } from "../../data/siteContent";
import type { Project } from "../../types";
import { projectBySlug, startYear } from "../util";
import { Flourish, Mark, PressedSprig, Seal, WindowLight } from "./art";
import { FontLink } from "./FontLink";
import { papers } from "./papers";
import styles from "./letter.module.css";

type Seg = string | { slug: string; text: string };
interface Para {
  id: string;
  segs: Seg[];
}

/** Phrases in Ala's own text that name a project. */
const mentions: { phrase: string; slug: string }[] = [
  { phrase: "persistent memory for AI agents", slug: "phren" },
  { phrase: "a React spreadsheet grid", slug: "ogrid" },
  { phrase: "a Python toolchain for Max for Live", slug: "m4l-builder" },
  { phrase: "an MCP bridge for Ableton", slug: "livemcp" },
  { phrase: "a Mumble client", slug: "mutter" },
  { phrase: "a newborn log for iPhone", slug: "mina" },
  { phrase: "a crypto reconciliation SaaS", slug: "basis" },
  { phrase: "a multi-tenant ERP", slug: "intrapath" },
  { phrase: "Intranet", slug: "intranet-erp" },
  { phrase: "LiveMCP", slug: "livemcp" },
  { phrase: "m4l-builder", slug: "m4l-builder" },
];

/** Split real copy into text and project mentions, first occurrence of each phrase. */
function linkify(text: string): Seg[] {
  const hits = mentions
    .map((m) => ({ ...m, at: text.indexOf(m.phrase) }))
    .filter((m) => m.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: Seg[] = [];
  let i = 0;
  for (const h of hits) {
    if (h.at < i) continue;
    if (h.at > i) out.push(text.slice(i, h.at));
    out.push({ slug: h.slug, text: h.phrase });
    i = h.at + h.phrase.length;
  }
  if (i < text.length) out.push(text.slice(i));
  return out;
}

const sentences = siteMeta.summary.split(/(?<=\.)\s+(?=[A-Z])/);
const dayJob = nowItems.find((n) => n.body.startsWith("Day job"));
const music = nowItems.find((n) => n.body.includes("electronic music"));

const body: Para[] = [
  { id: "intro", segs: [siteMeta.intro + (dayJob ? ` Day job: ${dayJob.heading}.` : "")] },
  { id: "open", segs: linkify(sentences[0] ?? "") },
  { id: "alongside", segs: linkify(sentences[1] ?? "") },
  { id: "before", segs: linkify(sentences.slice(2).join(" ")) },
  ...(music ? [{ id: "music", segs: linkify(music.body.split(/(?<=\.)\s+/).slice(0, 2).join(" ")) }] : []),
];

const mentioned = new Set(body.flatMap((p) => p.segs.flatMap((s) => (typeof s === "string" ? [] : [s.slug]))));
const unmentioned = projects.filter((p) => !mentioned.has(p.slug));
const recentLeft = unmentioned.filter((p) => startYear(p) >= 2025);
const olderLeft = unmentioned.filter((p) => startYear(p) < 2025);

/** "A, B, and C" as segments, each a mention. */
function listSegs(ps: Project[]): Seg[] {
  const out: Seg[] = [];
  ps.forEach((p, i) => {
    if (i > 0) out.push(i === ps.length - 1 ? (ps.length > 2 ? ", and " : " and ") : ", ");
    out.push({ slug: p.slug, text: p.title });
  });
  return out;
}

const postscript: Para = {
  id: "ps",
  segs: [
    ...(recentLeft.length ? ["Also: ", ...listSegs(recentLeft), ". "] : []),
    ...(olderLeft.length ? ["Older things I made: ", ...listSegs(olderLeft), "."] : []),
  ],
};

const noteId = (slug: string) => `letter-note-${slug}`;
const markWash = (slug: string) =>
  papers[slug]?.wash ?? ({ phren: "#8a7fb0", "m4l-builder": "#b07a3e", mina: "#c4868a" } as Record<string, string>)[slug] ?? "#8b9c7e";

function FoldedNote({ slug }: { slug: string }) {
  const p = projectBySlug(slug);
  if (!p) return null;
  return (
    <div className={styles.noteWrap} id={noteId(slug)} role="region" aria-label={`Note about ${p.title}`}>
      <div className={styles.note}>
        <span className={styles.crease} aria-hidden="true" />
        <Mark slug={slug} wash={markWash(slug)} className={styles.noteMark} />
        <div>
          <p className={styles.noteTitle}>
            {p.title} <span className={styles.noteYear}>{p.year}</span>
          </p>
          <p className={styles.noteText}>{p.summary}</p>
          <Link className={styles.noteLink} to={`/lab/letter/projects/${slug}`}>
            Read the page for {p.title}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LetterHome() {
  // Open note is keyed "paragraph:slug", so a project mentioned twice unfolds where it was clicked.
  const [open, setOpen] = useState<string | null>(null);
  const triggers = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const btn = triggers.current.get(open);
      setOpen(null);
      btn?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const renderPara = (para: Para, className?: string, lead?: string) => {
    const openHere = open?.startsWith(para.id + ":") ? open.slice(para.id.length + 1) : null;
    return (
      <Fragment key={para.id}>
        <p className={className}>
          {lead}
          {para.segs.map((s, i) => {
            if (typeof s === "string") return <Fragment key={i}>{s}</Fragment>;
            const key = `${para.id}:${s.slug}`;
            const isOpen = open === key;
            return (
              // A span, not a <button>: buttons can't break across lines, and these are phrases in running text.
              <span
                key={i}
                role="button"
                tabIndex={0}
                className={styles.mention}
                aria-expanded={isOpen}
                aria-controls={isOpen ? noteId(s.slug) : undefined}
                ref={(el) => {
                  if (el) triggers.current.set(key, el);
                  else triggers.current.delete(key);
                }}
                onClick={() => setOpen(isOpen ? null : key)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" && e.key !== " ") return;
                  e.preventDefault();
                  setOpen(isOpen ? null : key);
                }}
              >
                {s.text}
              </span>
            );
          })}
        </p>
        {openHere && <FoldedNote key={openHere} slug={openHere} />}
      </Fragment>
    );
  };

  return (
    <div className={`${styles.root} ${styles.desk}`}>
      <FontLink />
      <WindowLight className={styles.light} />
      <main className={styles.stage}>
        <article className={styles.sheet} aria-labelledby="letter-name">
          <PressedSprig className={styles.sprig} />
          <header className={styles.letterhead}>
            <h1 id="letter-name" className={styles.name}>
              {siteMeta.name}
            </h1>
            <p className={styles.headline}>{siteMeta.title}</p>
            <p className={styles.headContact}>
              <a href={siteMeta.emailHref}>{siteMeta.email}</a>
            </p>
          </header>

          <p className={styles.dateline}>
            Los Angeles, {nowMeta.asOf}
          </p>

          <div className={styles.body}>
            <p className={styles.greeting}>Hello,</p>
            {body.map((p) => renderPara(p))}
            <p>{siteMeta.availability}</p>
            <p>
              Write back: <a href={siteMeta.emailHref}>{siteMeta.email}</a>, or find me on{" "}
              <a href={siteMeta.linkedinHref}>LinkedIn</a>.
            </p>
          </div>

          <div className={styles.closing}>
            <p className={styles.signoff}>Yours,</p>
            <p className={styles.signature}>
              {siteMeta.name}
              <Flourish className={styles.flourish} />
            </p>
            <Seal className={styles.seal} />
          </div>

          <div className={styles.after}>
            {renderPara(postscript, styles.ps, "P.S. ")}
            <p className={styles.enc}>
              Enc. <Link to="/resume">Resume</Link> and <Link to="/now">Now</Link>.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
