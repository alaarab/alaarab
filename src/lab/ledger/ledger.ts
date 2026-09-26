import {
  experienceItems,
  nowMeta,
  projects,
} from "../../data/siteContent";
import type { Project } from "../../types";

export const LEDGER_BASE = "/lab/ledger";
export const entryPath = (slug: string) => `${LEDGER_BASE}/projects/${slug}`;

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Schibsted+Grotesk:wght@400;500;600;700;800;900&display=swap";

/** Two-digit entry number in catalog order: 01..15. */
export const entryNo = (index: number) => String(index + 1).padStart(2, "0");

/** A project's line of work: its thread when it has one, otherwise its category. */
export const lineOfWork = (project: Project) => project.thread ?? project.category;

/** The year the ledger closes on, taken from the Now page date. */
export const asOfYear = Number(nowMeta.asOf.match(/\d{4}/)?.[0] ?? new Date().getFullYear());

/** "2014 to 2025" -> [2014, 2025]; "2025 to present" -> [2025, asOfYear]. */
export function yearSpan(value: string): [number, number] {
  const years = value.match(/\d{4}/g)?.map(Number) ?? [asOfYear];
  const start = years[0];
  const end = /present/i.test(value) ? asOfYear : (years[years.length - 1] ?? start);
  return [start, end];
}

/** Period for table cells: "2013 to 2023" -> "2013–2023", "2025 to present" -> "2025–now". */
export function periodLabel(value: string) {
  const [start, end] = yearSpan(value);
  if (/present/i.test(value)) return `${start}–now`;
  return start === end ? String(start) : `${start}–${end}`;
}

export interface Entry {
  no: string;
  index: number;
  project: Project;
  line: string;
  start: number;
  end: number;
}

export const entries: Entry[] = projects.map((project, index) => {
  const [start, end] = yearSpan(project.year);
  return { no: entryNo(index), index, project, line: lineOfWork(project), start, end };
});

const hasStack = (p: Project, needle: string) =>
  p.stack.some((s) => s.toLowerCase() === needle.toLowerCase());

const experienceSpans = experienceItems.map((item) => yearSpan(item.years));
const firstYear = Math.min(...experienceSpans.map(([s]) => s));
const lastYear = Math.max(...experienceSpans.map(([, e]) => e));

export interface FootingLine {
  label: string;
  figure: string;
  note: string;
}

/** Totals derived from the content, never typed in by hand. */
export const footing: FootingLine[] = [
  {
    label: "Entries on the ledger",
    figure: String(projects.length),
    note: `${projects.filter((p) => p.featured).length} featured`,
  },
  {
    label: "Open source",
    figure: String(projects.filter((p) => p.category === "Open source").length),
    note: "by category",
  },
  {
    label: "Ship an MCP server",
    figure: String(projects.filter((p) => hasStack(p, "MCP")).length),
    note: "tools agents can call",
  },
  {
    label: "Have a SwiftUI app",
    figure: String(projects.filter((p) => hasStack(p, "SwiftUI")).length),
    note: "native iOS clients",
  },
  {
    label: "Years on the record",
    figure: String(lastYear - firstYear),
    note: `${firstYear} to ${lastYear}`,
  },
];

/** An entry sits on a line of work through its thread or its category. */
export const onLine = (entry: Entry, name: string) =>
  entry.project.thread === name || entry.project.category === name;

/** Every thread and category with its entry count, most entries first, for the filter row. */
export const lines: { name: string; count: number }[] = [
  ...new Set(entries.flatMap((e) => [e.project.thread, e.project.category])),
]
  .filter((name): name is string => Boolean(name))
  .map((name) => ({ name, count: entries.filter((e) => onLine(e, name)).length }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
