import { projects } from "../../data/siteContent";
import type { Project } from "../../types";

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap";

export const BASE = "/lab/folio";

const ROMAN: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function roman(n: number): string {
  let out = "";
  for (const [v, s] of ROMAN) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

export type Motif =
  | "phren"
  | "m4l"
  | "mina"
  | "grid"
  | "bridge"
  | "path"
  | "map"
  | "balance"
  | "cans"
  | "tree"
  | "bundle"
  | "calipers"
  | "lens"
  | "seedling"
  | "ladder";

export interface ChapterStyle {
  motif: Motif;
  /** Rubric and frontispiece ink for this chapter: a muted take on the project accent. */
  ink: string;
  /** Paper for this chapter. */
  paper: string;
  caption: string;
}

/** Per-project touch: motif, tint and caption, keyed by slug. */
export const chapterStyles: Record<string, ChapterStyle> = {
  phren: {
    motif: "phren",
    ink: "#5a4a7a",
    paper: "#f1ece2",
    caption: "An open book, its pages rising into a constellation.",
  },
  ogrid: {
    motif: "grid",
    ink: "#3f6048",
    paper: "#f1eddd",
    caption: "A ruled sheet, and the small square that fills it.",
  },
  "m4l-builder": {
    motif: "m4l",
    ink: "#80501f",
    paper: "#f4ebd8",
    caption: "An instrument panel, and the wave it draws.",
  },
  livemcp: {
    motif: "bridge",
    ink: "#2f5a70",
    paper: "#eff0e6",
    caption: "A bridge over moving water.",
  },
  intrapath: {
    motif: "path",
    ink: "#86413f",
    paper: "#f4ebdd",
    caption: "A path laid again, stone by stone.",
  },
  atlas: {
    motif: "map",
    ink: "#2e6660",
    paper: "#eff0e4",
    caption: "A folded map and its compass.",
  },
  basis: {
    motif: "balance",
    ink: "#2f5f58",
    paper: "#f0eee1",
    caption: "A balance, level.",
  },
  mina: {
    motif: "mina",
    ink: "#744658",
    paper: "#f3ebe6",
    caption: "A crescent moon over a cradle.",
  },
  mutter: {
    motif: "cans",
    ink: "#4a4a7c",
    paper: "#f0ece2",
    caption: "Two cans and a string.",
  },
  "intranet-erp": {
    motif: "tree",
    ink: "#5a4a2e",
    paper: "#f3ecda",
    caption: "An oak, ten rings wide.",
  },
  emv: {
    motif: "bundle",
    ink: "#51612c",
    paper: "#f1eddb",
    caption: "Loose papers, tied.",
  },
  "equipment-tracker": {
    motif: "calipers",
    ink: "#2e5f6a",
    paper: "#eff0e6",
    caption: "Calipers, with a tag on a string.",
  },
  alphalens: {
    motif: "lens",
    ink: "#7a5a1a",
    paper: "#f4ecd8",
    caption: "A lens held over a line.",
  },
  "garden-sensor-network": {
    motif: "seedling",
    ink: "#48612f",
    paper: "#f1eedc",
    caption: "A seedling and its stake.",
  },
  "retrofit-program-data-tools": {
    motif: "ladder",
    ink: "#6a4a36",
    paper: "#f3ecdc",
    caption: "A house with a ladder against it.",
  },
};

export interface Chapter {
  project: Project;
  number: number;
  numeral: string;
  page: number;
  style: ChapterStyle;
}

const words = (p: Project) =>
  [p.summary, p.problem, p.build, p.impact, p.outcome].join(" ").split(/\s+/)
    .length;

/** Chapters in the site's own curated order, with page numbers a book of this length would have. */
export const chapters: Chapter[] = (() => {
  let page = 1;
  return projects.map((project, i) => {
    const ch: Chapter = {
      project,
      number: i + 1,
      numeral: roman(i + 1),
      page,
      style: chapterStyles[project.slug] ?? chapterStyles.phren,
    };
    // Opener and frontispiece take two pages, then roughly 90 words a page (these are small pages).
    page += 2 + Math.ceil(words(project) / 90);
    return ch;
  });
})();

export const lastPage = (() => {
  const last = chapters[chapters.length - 1];
  return last.page + 2 + Math.ceil(words(last.project) / 90);
})();

export const chapterBySlug = (slug: string | undefined) =>
  chapters.find((c) => c.project.slug === slug);

/** Keyframes live outside the CSS module: Bun renames module keyframes but not the animation references. */
export const KEYFRAMES = `@keyframes folio-hinge { 0% { transform: rotateY(0deg); opacity: 1; } 72% { transform: rotateY(-72deg); opacity: 1; } 100% { transform: rotateY(-96deg); opacity: 0; } } @keyframes folio-lift { to { transform: translateY(-4%); opacity: 0; } } @keyframes folio-fade { to { opacity: 0; } } @keyframes folio-rise { from { opacity: 0; transform: translateY(40px); } } @keyframes folio-rock { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(2.4deg); } 75% { transform: rotate(-2.4deg); } }`;
