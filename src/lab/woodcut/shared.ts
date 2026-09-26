import { projects } from "../../data/siteContent";

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;1,400&family=IM+Fell+English:ital@0;1&display=swap";

/** Plates are numbered in catalogue order. */
export const plateNumber = (slug: string) => projects.findIndex((p) => p.slug === slug) + 1;

export function toRoman(n: number): string {
  const map: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

/** The first sentence of a summary; `short` also stops at a colon. */
export function firstSentence(text: string, short = false): string {
  const end = text.search(short ? /[.:](\s|$)/ : /\.(\s|$)/);
  return end === -1 ? text : text.slice(0, end) + ".";
}
