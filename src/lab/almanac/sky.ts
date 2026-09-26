import { projects } from "../../data/siteContent";
import type { Project } from "../../types";

export const BASE = "/lab/almanac";
export const projectHref = (slug: string) => `${BASE}/projects/${slug}`;

/** First sentence of a summary, for the one-line star annotations. */
export const firstSentence = (text: string) => {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
};

const NUMERALS: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];
export const roman = (n: number) => {
  let out = "";
  for (const [v, s] of NUMERALS) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
};

/** Plate number: the project's place in the catalogue, 1-based. */
export const plateNumber = (slug: string) =>
  roman(projects.findIndex((p) => p.slug === slug) + 1);

export type StarPlace = {
  slug: string;
  /** Angle on the disc in degrees, clockwise from east. */
  a: number;
  /** Distance from the pole as a fraction of the chart radius. */
  r: number;
  /** Labelled on phones too. */
  phone?: boolean;
};

/*
 * Hand-placed for composition, not data. The three pairs that share a
 * constellation line sit close together so their lines stay short.
 */
export const places: StarPlace[] = [
  { slug: "phren", a: -70, r: 0.6, phone: true },
  { slug: "atlas", a: -46, r: 0.72 },
  { slug: "mutter", a: -20, r: 0.5 },
  { slug: "livemcp", a: 4, r: 0.6 },
  { slug: "m4l-builder", a: 28, r: 0.72, phone: true },
  { slug: "alphalens", a: 52, r: 0.5 },
  { slug: "garden-sensor-network", a: 76, r: 0.63 },
  { slug: "intrapath", a: 100, r: 0.52 },
  { slug: "intranet-erp", a: 124, r: 0.72, phone: true },
  { slug: "emv", a: 148, r: 0.5 },
  { slug: "basis", a: 172, r: 0.66, phone: true },
  { slug: "equipment-tracker", a: 196, r: 0.52 },
  { slug: "retrofit-program-data-tools", a: 220, r: 0.72 },
  { slug: "ogrid", a: 244, r: 0.5 },
  { slug: "mina", a: 266, r: 0.7, phone: true },
];

/** Real connections only: a rewrite, two Ableton tools, two markdown stores for agents. */
export const constellations: [string, string][] = [
  ["intranet-erp", "intrapath"],
  ["livemcp", "m4l-builder"],
  ["phren", "atlas"],
];

export const xy = (p: { a: number; r: number }, radius = 500) => {
  const t = (p.a * Math.PI) / 180;
  return { x: Math.cos(t) * p.r * radius, y: Math.sin(t) * p.r * radius };
};

export const placeOf = (slug: string) => places.find((p) => p.slug === slug)!;

/** Featured projects are brighter stars. */
export const magnitude = (p: Project) => (p.featured ? 1 : 2);

/** Small deterministic PRNG so the background stars never shift between renders. */
export const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
