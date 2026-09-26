import { thread as t } from "./stitch";

export const BASE = "/lab/embroidery";
export const projectPath = (slug: string) => `${BASE}/projects/${slug}`;

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Alegreya+SC:wght@500&display=swap";

export interface Theme {
  /** Thread colour for the page: rules, knots, the mat border. */
  thread: string;
  /** Tint of the linen ground for this page. */
  ground: string;
}

const linen = "#e9e1cf";

export const themes: Record<string, Theme> = {
  phren: { thread: t.plum, ground: "#e6dfd2" },
  ogrid: { thread: t.green, ground: linen },
  "m4l-builder": { thread: t.madder, ground: "#ebdfc9" },
  livemcp: { thread: t.woad, ground: "#e5e0d3" },
  intrapath: { thread: t.madder, ground: linen },
  atlas: { thread: t.woad, ground: "#e6e1d4" },
  basis: { thread: t.green, ground: linen },
  mina: { thread: t.night, ground: "#dcd7cc" },
  mutter: { thread: t.plum, ground: linen },
  "intranet-erp": { thread: t.madder, ground: "#e8dfcb" },
  emv: { thread: t.green, ground: linen },
  "equipment-tracker": { thread: t.woad, ground: linen },
  alphalens: { thread: t.weld, ground: "#ebe1cb" },
  "garden-sensor-network": { thread: t.green, ground: "#e6e1cc" },
  "retrofit-program-data-tools": { thread: t.madder, ground: linen },
};

export const themeFor = (slug: string): Theme => themes[slug] ?? { thread: t.walnut, ground: linen };
