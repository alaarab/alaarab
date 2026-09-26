import { projects } from "../../data/siteContent";
import type { Project } from "../../types";

/**
 * The transit map model. Lines are threads of work, stations are projects.
 * Every assignment below is grounded in the project text in siteContent.ts;
 * the reason is kept next to it so the map stays reviewable.
 */

export type LineId = "A" | "M" | "N" | "S" | "C";

export interface TransitLine {
  id: LineId;
  name: string;
  description: string;
  color: string;
  /** Station slugs in route order. */
  stations: string[];
  /**
   * Drawn route: station slugs and bare waypoints. A leg is dashed when the
   * point it starts from has `gap: true` (no stations in that stretch).
   */
  route: { at: string | [number, number]; gap?: boolean }[];
  /** Line bullets drawn at the route ends. */
  bullets: [number, number][];
}

export const lines: TransitLine[] = [
  {
    id: "S",
    name: "Systems of record",
    description:
      "Business software a company runs on: the ERP line from Intranet at ADM to Intrapath today.",
    color: "#0b5cad",
    // garden: web UI over a sensor data stream. retrofit: Rails services and
    // data migrators. intranet/emv/equipment: the ADM app suite. atlas:
    // multi-tenant ITSM. intrapath: the Intranet rewrite.
    stations: [
      "garden-sensor-network",
      "retrofit-program-data-tools",
      "intranet-erp",
      "emv",
      "equipment-tracker",
      "atlas",
      "intrapath",
    ],
    route: [
      { at: "garden-sensor-network" },
      { at: "retrofit-program-data-tools" },
      { at: "intranet-erp" },
      { at: "emv" },
      { at: "equipment-tracker" },
      { at: "atlas" },
      { at: "intrapath" },
    ],
    bullets: [
      [58, 330],
      [1172, 330],
    ],
  },
  {
    id: "A",
    name: "Agent tooling",
    description:
      "MCP servers and memory that let AI agents read and drive real systems.",
    color: "#d7263d",
    // livemcp: MCP bridge. ogrid: ships an MCP server. atlas: MCP server over
    // tickets. phren: memory for coding agents.
    stations: ["livemcp", "ogrid", "atlas", "phren"],
    route: [
      { at: "livemcp" },
      { at: "ogrid" },
      { at: "atlas" },
      { at: "phren" },
    ],
    bullets: [
      [1010, 70],
      [1010, 490],
    ],
  },
  {
    id: "N",
    name: "Native apps",
    description: "Apps for the phone and tablet, from field iPads to SwiftUI.",
    color: "#7b3fc4",
    // retrofit: iPad apps for field capture. mina/mutter: SwiftUI apps.
    // phren: SwiftUI iOS app with widgets and Siri intents.
    stations: ["retrofit-program-data-tools", "mina", "mutter", "phren"],
    route: [
      { at: "retrofit-program-data-tools", gap: true },
      { at: [225, 390], gap: true },
      { at: [265, 430], gap: true },
      { at: "mina" },
      { at: "mutter" },
      { at: "phren" },
    ],
    bullets: [[500, 430]],
  },
  {
    id: "M",
    name: "Music tooling",
    description: "Tools for making music in Ableton Live and Max for Live.",
    color: "#c24e00",
    // garden: extended a Processing-based UCSD Music Video Game in the same
    // program. m4l-builder: Max for Live devices. livemcp: Ableton bridge.
    stations: ["garden-sensor-network", "m4l-builder", "livemcp"],
    route: [
      { at: "garden-sensor-network", gap: true },
      { at: [110, 150], gap: true },
      { at: [150, 110], gap: true },
      { at: "m4l-builder" },
      { at: "livemcp" },
    ],
    bullets: [[500, 110]],
  },
  {
    id: "C",
    name: "Crypto",
    description: "Market data and accounting tools for crypto.",
    color: "#00796b",
    // alphalens: crypto and stock Discord bot. basis: crypto reconciliation.
    stations: ["alphalens", "basis"],
    route: [{ at: "alphalens" }, { at: "basis" }],
    bullets: [
      [596, 530],
      [874, 530],
    ],
  },
];

export const MAP_W = 1200;
export const MAP_H = 640;

export interface StationLayout {
  x: number;
  y: number;
  /** Label anchor point and alignment. */
  lx: number;
  ly: number;
  anchor: "start" | "middle" | "end";
  /** Label broken into lines for the map. */
  label: string[];
}

/** Hand-placed station positions (viewBox units). */
export const layout: Record<string, StationLayout> = {
  "garden-sensor-network": { x: 110, y: 330, lx: 110, ly: 358, anchor: "middle", label: ["Garden Sensor", "Network"] },
  "retrofit-program-data-tools": { x: 225, y: 330, lx: 244, ly: 263, anchor: "start", label: ["Retrofit Program", "Data Tools"] },
  "intranet-erp": { x: 360, y: 330, lx: 360, ly: 358, anchor: "middle", label: ["Intranet ERP"] },
  emv: { x: 450, y: 330, lx: 450, ly: 280, anchor: "middle", label: ["EMV"] },
  "equipment-tracker": { x: 540, y: 330, lx: 540, ly: 358, anchor: "middle", label: ["Equipment", "Tracker"] },
  alphalens: { x: 640, y: 530, lx: 640, ly: 558, anchor: "middle", label: ["AlphaLens"] },
  basis: { x: 830, y: 530, lx: 830, ly: 558, anchor: "middle", label: ["Basis"] },
  "m4l-builder": { x: 850, y: 110, lx: 850, ly: 60, anchor: "middle", label: ["m4l-builder"] },
  livemcp: { x: 1010, y: 110, lx: 1034, ly: 98, anchor: "start", label: ["LiveMCP"] },
  ogrid: { x: 1010, y: 220, lx: 1034, ly: 208, anchor: "start", label: ["OGrid"] },
  atlas: { x: 1010, y: 330, lx: 1026, ly: 280, anchor: "start", label: ["Atlas"] },
  intrapath: { x: 1120, y: 330, lx: 1120, ly: 358, anchor: "middle", label: ["Intrapath"] },
  mina: { x: 770, y: 430, lx: 770, ly: 458, anchor: "middle", label: ["Mina"] },
  mutter: { x: 880, y: 430, lx: 880, ly: 458, anchor: "middle", label: ["Mutter"] },
  phren: { x: 1010, y: 430, lx: 1034, ly: 418, anchor: "start", label: ["Phren"] },
};

/** Eras on the time axis: segmented, not linear, so 2026 has room. */
export const eras = [
  { label: "2011", sub: "UCSD", x0: 30, x1: 170 },
  { label: "2012-13", sub: "Matrix", x0: 170, x1: 300 },
  { label: "2013-2025", sub: "ADM years", x0: 300, x1: 590 },
  { label: "2025", sub: "Qualus", x0: 590, x1: 700 },
  { label: "2026", sub: "Now", x0: 700, x1: 1190 },
];

export const lineById = Object.fromEntries(lines.map((l) => [l.id, l])) as Record<
  LineId,
  TransitLine
>;

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<
  string,
  Project
>;

export function linesFor(slug: string): TransitLine[] {
  return lines.filter((l) => l.stations.includes(slug));
}

export function startYear(p: Project): number {
  const m = p.year.match(/\d{4}/);
  return m ? Number(m[0]) : 0;
}

/** Stations in map reading order: left to right, then top to bottom. */
export const mapOrder: string[] = Object.keys(layout).sort(
  (a, b) => layout[a].x - layout[b].x || layout[a].y - layout[b].y,
);

export function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

export const transitPath = (slug?: string) =>
  slug ? `/lab/transit/projects/${slug}` : "/lab/transit";

/** SVG path through points with rounded corners. */
export function roundedPath(points: [number, number][], r = 22): string {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const d1 = Math.hypot(cx - px, cy - py);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    const ax = cx - ((cx - px) / d1) * rr;
    const ay = cy - ((cy - py) / d1) * rr;
    const bx = cx + ((nx - cx) / d2) * rr;
    const by = cy + ((ny - cy) / d2) * rr;
    d += ` L${ax},${ay} Q${cx},${cy} ${bx},${by}`;
  }
  const last = points[points.length - 1];
  return d + ` L${last[0]},${last[1]}`;
}

/** Resolve a line's route into dashed and solid runs of points. */
export function routeRuns(line: TransitLine): { gap: boolean; points: [number, number][] }[] {
  const pts = line.route.map((r) =>
    typeof r.at === "string" ? ([layout[r.at].x, layout[r.at].y] as [number, number]) : r.at,
  );
  const runs: { gap: boolean; points: [number, number][] }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const gap = !!line.route[i].gap;
    const cur = runs[runs.length - 1];
    if (cur && cur.gap === gap) cur.points.push(pts[i + 1]);
    else runs.push({ gap, points: [pts[i], pts[i + 1]] });
  }
  return runs;
}
