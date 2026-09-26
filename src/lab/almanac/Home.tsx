import { useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { nowItems, nowMeta, projects, siteMeta } from "../../data/siteContent";
import { Colophon, Fonts, Rule, StarGlyph, Topline, starPath } from "./parts";
import {
  constellations,
  firstSentence,
  magnitude,
  placeOf,
  places,
  projectHref,
  seeded,
  xy,
} from "./sky";
import styles from "./almanac.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const HOURS = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const rand = seeded(1742);
const fieldStars = Array.from({ length: 140 }, () => {
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(rand()) * 392;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: 0.5 + rand() * rand() * 1.4, o: 0.25 + rand() * 0.5 };
});

/** The Milky Way as overlapping washes along a gentle curve, like pooled watercolour. */
const milkyWay = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10 - 0.5;
  return {
    x: t * 880,
    y: Math.sin(t * 2.4) * 46 + (rand() - 0.5) * 30,
    rx: 70 + rand() * 90,
    ry: 26 + rand() * 40,
    o: 0.18 + rand() * 0.2,
  };
});

/** Lettering on the lower half of a ring is turned to read the right way up. */
const flip = (deg: number) => (deg > 90 && deg < 270 ? " rotate(180)" : "");

/** The fixed outer ring of hours, like the frame of a planisphere. */
function HourRing() {
  const ticks = [];
  for (let i = 0; i < 96; i++) {
    const a = (i * 360) / 96;
    const long = i % 4 === 0;
    ticks.push(
      <line
        key={i}
        x1={0}
        y1={-442}
        x2={0}
        y2={long ? -456 : -449}
        transform={`rotate(${a})`}
        strokeWidth={long ? 1.1 : 0.6}
      />,
    );
  }
  return (
    <svg className={styles.hourRing} viewBox="-500 -500 1000 1000" aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--line)">
        <circle r={496} strokeWidth={1.4} />
        <circle r={490} strokeWidth={0.5} />
        <circle r={442} strokeWidth={0.9} />
        {ticks}
      </g>
      <g className={styles.ringText} fill="var(--line)">
        {[...HOURS, ...HOURS].map((h, i) => (
          <text key={i} transform={`rotate(${i * 15}) translate(0 -466)${flip(i * 15)}`} textAnchor="middle" dominantBaseline="middle">
            {h}
          </text>
        ))}
      </g>
      {/* The meridian index: where tonight's sky is read from. */}
      <path d="M0 -436 L-7 -422 L7 -422 Z" fill="var(--accent)" />
    </svg>
  );
}

/** The turning disc: month ring, graduated circles, the Milky Way, field stars and the three real constellations. */
function Disc() {
  const dayTicks = [];
  let d = 0;
  for (let m = 0; m < 12; m++) {
    for (let day = 0; day < DAYS[m]; day++, d++) {
      const a = (d * 360) / 365;
      const len = day === 0 ? 34 : day % 5 === 0 ? 10 : 5;
      dayTicks.push(
        <line
          key={d}
          x1={0}
          y1={-436}
          x2={0}
          y2={-436 + len}
          transform={`rotate(${a})`}
          strokeWidth={day === 0 ? 0.9 : 0.45}
        />,
      );
    }
  }
  let start = 0;
  const monthLabels = MONTHS.map((m, i) => {
    const mid = ((start + DAYS[i] / 2) * 360) / 365;
    start += DAYS[i];
    return (
      <text key={m} transform={`rotate(${mid}) translate(0 -414)${flip(mid)}`} textAnchor="middle" dominantBaseline="middle">
        {m}
      </text>
    );
  });

  return (
    <svg className={styles.disc} viewBox="-500 -500 1000 1000" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="alm-disc">
          <circle r={400} />
        </clipPath>
        <filter id="alm-haze" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>
      <circle r={436} fill="var(--plane)" />
      <g clipPath="url(#alm-disc)">
        {/* The Milky Way, painted as two soft washes rather than drawn. */}
        <g filter="url(#alm-haze)" transform="rotate(-28)">
          {milkyWay.map((e, i) => (
            <ellipse key={i} cx={e.x} cy={e.y} rx={e.rx} ry={e.ry} fill="var(--haze)" opacity={e.o} />
          ))}
        </g>
      </g>
      <g fill="none" stroke="var(--line)">
        <circle r={436} strokeWidth={1.1} />
        <circle r={400} strokeWidth={0.8} />
        <circle r={392} strokeWidth={0.4} opacity={0.6} />
        {dayTicks}
        <g opacity={0.3} strokeWidth={0.6}>
          <circle r={100} strokeDasharray="2 5" />
          <circle r={200} />
          <circle r={300} />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1={0} y1={-44} x2={0} y2={-392} transform={`rotate(${i * 30})`} />
          ))}
        </g>
        {/* The ecliptic, off-centre as it is on a real planisphere. */}
        <circle cx={0} cy={58} r={268} strokeWidth={0.7} strokeDasharray="1 4" opacity={0.6} />
      </g>
      <g className={styles.ringText} fill="var(--line)">
        {monthLabels}
      </g>
      <g fill="var(--line)">
        {fieldStars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s} opacity={s.o} />
        ))}
        <path d={starPath(16)} />
      </g>
      <g stroke="var(--line)" strokeWidth={0.9} opacity={0.75}>
        {constellations.map(([a, b]) => {
          const p = xy(placeOf(a));
          const q = xy(placeOf(b));
          const len = Math.hypot(q.x - p.x, q.y - p.y);
          const ux = (q.x - p.x) / len;
          const uy = (q.y - p.y) / len;
          const g = 16;
          return <line key={a} x1={p.x + ux * g} y1={p.y + uy * g} x2={q.x - ux * g} y2={q.y - uy * g} />;
        })}
      </g>
    </svg>
  );
}

type Note = { slug: string; x: number; y: number; left: boolean };

export function AlmanacHome() {
  const wrap = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Note | null>(null);
  const [focused, setFocused] = useState<Note | null>(null);
  const note = hovered ?? focused;

  const measure = (slug: string, el: HTMLElement): Note | null => {
    const box = wrap.current?.getBoundingClientRect();
    const glyph = el.querySelector("svg")?.getBoundingClientRect();
    if (!box || !glyph) return null;
    const x = glyph.left + glyph.width / 2 - box.left;
    const y = glyph.top + glyph.height / 2 - box.top;
    return { slug, x, y, left: x > box.width * 0.58 };
  };

  const noteProject = note && projects.find((p) => p.slug === note.slug);

  return (
    <div className={styles.root}>
      <Fonts />
      <Topline />
      <main>
        <section className={styles.sky} aria-labelledby="alm-title">
          <div className={styles.chartWrap} ref={wrap}>
            <div className={styles.cartouche}>
              <h1 id="alm-title">Ala Arab</h1>
              <p className={styles.cartoucheTitle}>{siteMeta.title}</p>
              <p className={styles.cartoucheWhere}>Los Angeles, {nowMeta.asOf}</p>
            </div>
            <div className={styles.chart}>
              <Disc />
              <HourRing />
              <ul className={styles.stars} aria-label="Projects on the chart">
                {places.map((pl) => {
                  const p = projects.find((x) => x.slug === pl.slug)!;
                  const mag = magnitude(p);
                  const pos = { "--a": `${pl.a}deg`, "--r": pl.r } as CSSProperties;
                  return (
                    <li key={pl.slug} className={styles.starSpot} style={pos}>
                      <div className={styles.upright}>
                        <Link
                          to={projectHref(pl.slug)}
                          className={`${styles.star} ${mag === 1 ? styles.bright : ""} ${pl.phone ? styles.phoneLabel : ""}`}
                          aria-describedby={`alm-sum-${pl.slug}`}
                          onPointerEnter={(e) => setHovered(measure(pl.slug, e.currentTarget))}
                          onPointerLeave={() => setHovered(null)}
                          onFocus={(e) => setFocused(measure(pl.slug, e.currentTarget))}
                          onBlur={() => setFocused(null)}
                        >
                          <span className={styles.glyphBox}>
                            <StarGlyph size={mag === 1 ? 22 : 15} />
                          </span>
                          <span className={styles.starName}>{p.title}</span>
                          <span id={`alm-sum-${pl.slug}`} className={styles.srOnly}>
                            {firstSentence(p.summary)}
                          </span>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            {note && noteProject && (
              <div
                className={`${styles.note} ${note.left ? styles.noteLeft : ""}`}
                style={{ left: note.x, top: note.y }}
                aria-hidden="true"
              >
                <svg className={styles.leader} viewBox="0 0 40 40" aria-hidden="true">
                  <path d={note.left ? "M40 0 L4 36" : "M0 0 L36 36"} />
                </svg>
                <p>{firstSentence(noteProject.summary)}</p>
              </div>
            )}
          </div>
        </section>

        <div className={styles.column}>
          <section className={styles.preface} aria-label="Introduction">
            <p className={styles.lede}>{siteMeta.intro}</p>
            <p>{siteMeta.summary}</p>
            <p className={styles.quiet}>{siteMeta.availability}</p>
          </section>

          <Rule />

          <section aria-labelledby="alm-now">
            <h2 id="alm-now" className={styles.h2}>
              Observations for the season
            </h2>
            <p className={styles.caption}>As of {nowMeta.asOf}. {nowMeta.intro}</p>
            <ol className={styles.observations}>
              {nowItems.map((n) => (
                <li key={n.heading}>
                  <h3>{n.heading}</h3>
                  <p>{n.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <Rule />

          <section aria-labelledby="alm-register">
            <h2 id="alm-register" className={styles.h2}>
              Register of stars
            </h2>
            <p className={styles.caption}>Every project on the chart, in the order it was catalogued.</p>
            <ol className={styles.register}>
              {projects.map((p) => (
                <li key={p.slug}>
                  <StarGlyph size={magnitude(p) === 1 ? 14 : 10} className={styles.registerGlyph} />
                  <div>
                    <p className={styles.registerHead}>
                      <Link to={projectHref(p.slug)}>{p.title}</Link>
                      <span className={styles.year}>{p.year}</span>
                    </p>
                    <p className={styles.registerLine}>{firstSentence(p.summary)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <Rule />

          <section aria-labelledby="alm-contact" className={styles.contact}>
            <h2 id="alm-contact" className={styles.h2}>
              Contact
            </h2>
            <ul className={styles.contactList}>
              <li>
                <a href={siteMeta.emailHref}>{siteMeta.email}</a>
              </li>
              <li>
                <a href={siteMeta.linkedinHref}>LinkedIn</a>
              </li>
              <li>
                <a href="/resume">Resume</a>
              </li>
              <li>
                <a href="/now">Now</a>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Colophon />
    </div>
  );
}
