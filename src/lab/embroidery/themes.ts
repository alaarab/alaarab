import { featuredProjects, projects } from "../../data/siteContent";
import type { Project } from "../../types";
import { startYear } from "../util";
import { thread as t } from "./stitch";

export const BASE = "/lab/embroidery";
export const projectPath = (slug: string) => `${BASE}/projects/${slug}`;

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Alegreya+SC:wght@500&display=swap";

export type Frame = "hoop" | "panel" | "long";

export interface Theme {
  /** Main thread colour for the page (links, rules, the knot in the key). */
  thread: string;
  /** Tint of the linen ground for this page. */
  ground: string;
  frame: Frame;
  /** A maker's label for the piece: what it is worked in. Decorative only. */
  worked: string;
}

const linen = "#e9e1cf";

export const themes: Record<string, Theme> = {
  phren: { thread: t.plum, ground: "#e6dfd2", frame: "hoop", worked: "Stem stitch and French knots, woad and plum, with one madder thread run back through." },
  ogrid: { thread: t.green, ground: linen, frame: "panel", worked: "Running-stitch grid, cross stitch, and one block of satin." },
  "m4l-builder": { thread: t.madder, ground: "#ebdfc9", frame: "panel", worked: "A satin knob and a waveform laid in vertical satin stitches." },
  livemcp: { thread: t.woad, ground: "#e5e0d3", frame: "hoop", worked: "Stem-stitch arch, straight-stitch hangers, running-stitch water." },
  intrapath: { thread: t.madder, ground: linen, frame: "hoop", worked: "A running-stitch path from an outlined square to a satin one." },
  atlas: { thread: t.woad, ground: "#e6e1d4", frame: "panel", worked: "A page in stem stitch, mirrored below a running-stitch line." },
  basis: { thread: t.green, ground: linen, frame: "panel", worked: "Rows of identical straight stitches, and one thread that traces back through them." },
  mina: { thread: t.night, ground: "#dcd7cc", frame: "hoop", worked: "Cream satin and night-blue stem stitch, in finer thread." },
  mutter: { thread: t.plum, ground: linen, frame: "hoop", worked: "Two satin heads and running-stitch voices between them." },
  "intranet-erp": { thread: t.madder, ground: "#e8dfcb", frame: "long", worked: "A stepped border, ten repeats long." },
  emv: { thread: t.green, ground: linen, frame: "hoop", worked: "Three loose leaves, the top one in satin." },
  "equipment-tracker": { thread: t.woad, ground: linen, frame: "hoop", worked: "A tag in stem stitch on a running-stitch string." },
  alphalens: { thread: t.weld, ground: "#ebe1cb", frame: "hoop", worked: "A running-stitch line under a stem-stitch glass." },
  "garden-sensor-network": { thread: t.green, ground: "#e6e1cc", frame: "hoop", worked: "A small plant in satin leaves, with one madder knot for the sensor." },
  "retrofit-program-data-tools": { thread: t.madder, ground: linen, frame: "hoop", worked: "A house in stem stitch under a satin roof." },
};

export const themeFor = (slug: string): Theme =>
  themes[slug] ?? { thread: t.walnut, ground: linen, frame: "hoop", worked: "" };

/** Chronological, stable: the order the band and the key read in. */
const byYear = (list: Project[]) =>
  list.map((p, k) => ({ p, k })).sort((a, b) => startYear(a.p) - startYear(b.p) || a.k - b.k).map((x) => x.p);

export const band = byYear(featuredProjects);
export const everyProject = byYear(projects);

/** Neighbours along the band for featured work, along the key for the rest. */
export function neighbours(slug: string) {
  const list = band.some((p) => p.slug === slug) ? band : everyProject;
  const k = list.findIndex((p) => p.slug === slug);
  return { prev: k > 0 ? list[k - 1] : undefined, next: k >= 0 ? list[k + 1] : undefined };
}
