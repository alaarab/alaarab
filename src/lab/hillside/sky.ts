/** Painted sky palettes, one per hour of the day. */

export type TimeKey =
  | "dawn"
  | "morning"
  | "midday"
  | "afternoon"
  | "golden"
  | "dusk"
  | "night"
  | "overcast";

export interface Sky {
  label: string;
  /** Sky bands, top to horizon. */
  top: string;
  mid: string;
  horizon: string;
  /** Cumulus: lit tops, shadowed bases. */
  cloudLit: string;
  cloudShade: string;
  /** Hills far to near, then the meadow in front. */
  hills: [string, string, string, string];
  meadow: string;
  /** Foliage on trees and bushes. */
  leaf: string;
  leafShade: string;
  /** Warm light (sun, lit walls). */
  light: string;
  /** Sun or moon position (0..1 of the frame) and glow strength. */
  sun: { x: number; y: number; r: number; glow: number; moon?: boolean };
  stars: number;
  /** How strongly windows glow (0 by day). */
  windows: number;
  /** Text colour set on this sky. */
  text: string;
  textSoft: string;
}

export const skies: Record<TimeKey, Sky> = {
  dawn: {
    label: "dawn",
    top: "#8f97c2",
    mid: "#d6b6c6",
    horizon: "#f5cfae",
    cloudLit: "#f8d8c6",
    cloudShade: "#a89bb8",
    hills: ["#bab3c9", "#9ea1a9", "#7c8a70", "#6a7a52"],
    meadow: "#7f8d58",
    leaf: "#56654a",
    leafShade: "#3f4a3e",
    light: "#f7c9a0",
    sun: { x: 0.2, y: 0.8, r: 36, glow: 0.55 },
    stars: 0.15,
    windows: 0.55,
    text: "#2a2735",
    textSoft: "#2f2c3a",
  },
  morning: {
    label: "morning",
    top: "#7ea5da",
    mid: "#b6cfea",
    horizon: "#e7eeec",
    cloudLit: "#fcfaf2",
    cloudShade: "#b3c0d6",
    hills: ["#adc0d2", "#94b08f", "#6f8f50", "#5f7f40"],
    meadow: "#86a25a",
    leaf: "#4f6e36",
    leafShade: "#3b5530",
    light: "#fbf1d6",
    sun: { x: 0.14, y: 0.16, r: 34, glow: 0.35 },
    stars: 0,
    windows: 0,
    text: "#28311f",
    textSoft: "#2c3524",
  },
  midday: {
    label: "midday",
    top: "#6f9ad6",
    mid: "#a9c7ea",
    horizon: "#e2ecea",
    cloudLit: "#fdfcf6",
    cloudShade: "#adbcd4",
    hills: ["#a7bdd3", "#90ad86", "#6a8a48", "#5a7a3a"],
    meadow: "#84a352",
    leaf: "#4a6a32",
    leafShade: "#36512c",
    light: "#fdf6de",
    sun: { x: 0.5, y: 0.06, r: 34, glow: 0.3 },
    stars: 0,
    windows: 0,
    text: "#232d1c",
    textSoft: "#26301f",
  },
  afternoon: {
    label: "late afternoon",
    top: "#86a8d4",
    mid: "#bfd2e0",
    horizon: "#f0e5cc",
    cloudLit: "#fff5e0",
    cloudShade: "#a9b2c6",
    hills: ["#adb8c6", "#98ab86", "#728c4b", "#667d3f"],
    meadow: "#9aa75a",
    leaf: "#52693a",
    leafShade: "#3d4f30",
    light: "#fbe2b4",
    sun: { x: 0.86, y: 0.3, r: 34, glow: 0.4 },
    stars: 0,
    windows: 0.1,
    text: "#2c3222",
    textSoft: "#353c29",
  },
  golden: {
    label: "golden hour",
    top: "#8c9cc2",
    mid: "#e6c39c",
    horizon: "#f3b47e",
    cloudLit: "#ffd6a2",
    cloudShade: "#a28a9a",
    hills: ["#b69ca6", "#938a72", "#6f7040", "#5f6236"],
    meadow: "#8c8244",
    leaf: "#4f5530",
    leafShade: "#3a3d2a",
    light: "#ffc47a",
    sun: { x: 0.82, y: 0.62, r: 40, glow: 0.75 },
    stars: 0,
    windows: 0.45,
    text: "#2e2a22",
    textSoft: "#3a3429",
  },
  dusk: {
    label: "blue hour",
    top: "#34436f",
    mid: "#505c87",
    horizon: "#c59ca0",
    cloudLit: "#caa7b2",
    cloudShade: "#4f577c",
    hills: ["#626887", "#4a5268", "#3a4447", "#343d3c"],
    meadow: "#3d4636",
    leaf: "#2f3a33",
    leafShade: "#262f2c",
    light: "#f2c48a",
    sun: { x: 0.8, y: 0.74, r: 30, glow: 0.3 },
    stars: 0.5,
    windows: 1,
    text: "#f7f0e0",
    textSoft: "#efe7d4",
  },
  night: {
    label: "night",
    top: "#28324f",
    mid: "#3c4769",
    horizon: "#5a6582",
    cloudLit: "#727c9b",
    cloudShade: "#3d4564",
    hills: ["#424a66", "#353e52", "#2e3744", "#2b333d"],
    meadow: "#303a3c",
    leaf: "#262f33",
    leafShade: "#1f272c",
    light: "#f4d59a",
    sun: { x: 0.78, y: 0.2, r: 30, glow: 0.35, moon: true },
    stars: 1,
    windows: 1,
    text: "#f3ecd9",
    textSoft: "#e0d9c6",
  },
  overcast: {
    label: "overcast afternoon",
    top: "#a4abb4",
    mid: "#c3c6c4",
    horizon: "#dcd8cb",
    cloudLit: "#e9e6de",
    cloudShade: "#9fa4ad",
    hills: ["#b0b4b5", "#9aa392", "#7a8a62", "#6c7a55"],
    meadow: "#8f9663",
    leaf: "#56643f",
    leafShade: "#434e36",
    light: "#efe6cf",
    sun: { x: 0.5, y: 0.1, r: 0, glow: 0 },
    stars: 0,
    windows: 0.2,
    text: "#2b2e26",
    textSoft: "#33372d",
  },
};

/** The hour the server and first paint always use. */
export const FIRST_PAINT: TimeKey = "afternoon";

export function timeForHour(hour: number): TimeKey {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 11) return "morning";
  if (hour >= 11 && hour < 15) return "midday";
  if (hour >= 15 && hour < 17.5) return "afternoon";
  if (hour >= 17.5 && hour < 19.25) return "golden";
  if (hour >= 19.25 && hour < 20.75) return "dusk";
  return "night";
}
