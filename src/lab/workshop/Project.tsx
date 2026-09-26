import type { CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { projectBySlug } from "../util";
import { CloseScene } from "./CloseScene";
import { M4lPage } from "./M4lPage";
import { MinaPage } from "./MinaPage";
import { C } from "./objects";
import { PhrenPage } from "./PhrenPage";
import { Particulars, Prose, WalkOn } from "./Prose";
import { FontLinks } from "./shared";
import { themes } from "./themes";
import styles from "./workshop.module.css";

/** A folded blank card: what is on the desk when the slug matches nothing. */
function BlankCard() {
  return (
    <g>
      <ellipse cx={12} cy={3} rx={60} ry={7} fill={C.shadow} opacity={0.28} filter="url(#ws-blur)" />
      <polygon points="-56,-4 50,-4 42,-40 -48,-40" fill="#efe4cc" />
      <polygon points="-48,-40 42,-40 36,-70 -42,-70" fill="#f7eedc" />
      <path d="M-48 -40 H42" stroke="#d8c9ab" strokeWidth={1} />
    </g>
  );
}

export function WorkshopProject() {
  const { slug } = useParams<{ slug: string }>();
  const p = projectBySlug(slug);

  if (p?.slug === "phren") return <PhrenPage p={p} />;
  if (p?.slug === "m4l-builder") return <M4lPage p={p} />;
  if (p?.slug === "mina") return <MinaPage p={p} />;

  const theme = p ? themes[p.slug] : undefined;
  if (!p || !theme) {
    return (
      <div className={styles.root}>
        <FontLinks />
        <div className={styles.close}>
          <CloseScene Art={BlankCard} wall={["#eadbc2", "#b8a28e"]} light="#ffe0a8" place={{ x: 720, y: 650, s: 2.6 }} label="An empty corner of the desk with a blank folded card." />
          <Link to="/lab/workshop" className={styles.backOver}>Back to the desk</Link>
        </div>
        <main className={styles.page}>
          <h1 className={styles.title}>Nothing here by that name</h1>
          <p className={styles.lead}>There's a blank card on this corner of the desk, but no project called “{slug}”.</p>
          <p>
            Everything I've built is on the <Link to="/lab/workshop" className={styles.link}>desk and the shelf</Link>.
          </p>
        </main>
      </div>
    );
  }

  const vars = { "--paper": theme.paper, "--link": theme.link } as CSSProperties;
  return (
    <div className={styles.root} style={vars}>
      <FontLinks />
      <div className={styles.close}>
        <CloseScene Art={theme.Art} wall={theme.wall} light={theme.light} place={theme.place} label={`${p.title}: ${theme.object}`} />
        <Link to="/lab/workshop" className={styles.backOver}>Back to the desk</Link>
        <p className={styles.fig} aria-hidden="true">{theme.object}</p>
      </div>
      <main className={styles.page}>
        <h1 className={styles.title}>{p.title}</h1>
        <p className={styles.meta}>{p.year}. {p.status}.</p>
        <p className={styles.lead}>{p.summary}</p>
        {p.quote && <blockquote className={styles.quote}>{p.quote}</blockquote>}
        <Prose p={p} />
        <Particulars p={p} />
        <WalkOn p={p} />
      </main>
    </div>
  );
}
