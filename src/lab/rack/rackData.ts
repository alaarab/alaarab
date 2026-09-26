import { featuredProjects, projects } from "../../data/siteContent";
import type { Project } from "../../types";

export const RACK_BASE = "/lab/rack";
export const rackPath = (slug?: string) =>
  slug ? `${RACK_BASE}/projects/${slug}` : RACK_BASE;

/** Rack order: featured devices first in content order, then the rest. */
export const rackOrder: Project[] = [
  ...featuredProjects,
  ...projects.filter((project) => !project.featured),
];

export interface ThreadGroup {
  key: string;
  label: string;
  short: string;
  color: string;
}

/**
 * Knob detents. The first four come straight from `project.thread`;
 * "Internal systems" and "Web + data" are derived groupings so every
 * device answers to some position on the knob.
 */
export const threadGroups: ThreadGroup[] = [
  { key: "all", label: "All devices", short: "All", color: "#1a1917" },
  { key: "agent", label: "Agent tooling", short: "Agent", color: "#7c3aed" },
  { key: "music", label: "Music tooling", short: "Music", color: "#b45309" },
  { key: "ios", label: "iOS", short: "iOS", color: "#db2777" },
  { key: "crypto", label: "Crypto", short: "Crypto", color: "#0f766e" },
  { key: "internal", label: "Internal systems", short: "Internal", color: "#e11d48" },
  { key: "web", label: "Web + data", short: "Web/Data", color: "#217346" },
];

const threadKeys: Record<string, string> = {
  "Agent tooling": "agent",
  "Music tooling": "music",
  iOS: "ios",
  Crypto: "crypto",
};

const derivedKeys: Record<string, string> = {
  "intranet-erp": "internal",
  intrapath: "internal",
  emv: "internal",
  "equipment-tracker": "internal",
  // Mutter ships a native SwiftUI app; /now groups it with the phone work.
  mutter: "ios",
  alphalens: "crypto",
  ogrid: "web",
  "garden-sensor-network": "web",
  "retrofit-program-data-tools": "web",
};

export function groupOf(project: Project): ThreadGroup {
  const key =
    (project.thread && threadKeys[project.thread]) ??
    derivedKeys[project.slug] ??
    "web";
  return threadGroups.find((group) => group.key === key) ?? threadGroups[0]!;
}

/** Projects without a brand color get a classic red indicator LED. */
export const ledColor = (project: Project) => project.accent ?? "#d9481c";

export type LedMode = "live" | "on" | "legacy";

export function ledMode(project: Project): LedMode {
  if (/development/i.test(project.status)) return "live";
  if (/^(active|stable|shipped)$/i.test(project.status)) return "on";
  return "legacy";
}

export const channel = (project: Project) =>
  String(rackOrder.indexOf(project) + 1).padStart(2, "0");

/** Split "100+ DSP blocks" into a big readout value and its caption. */
export function splitMetric(metric: string): { value?: string; caption: string } {
  const match = metric.match(/^(~?\d[\d.,]*\+?)\s+(.+)$/);
  if (!match) return { caption: metric };
  return { value: match[1], caption: match[2]! };
}

/** Links other than the one pointing back at the old project page. */
export const outboundLinks = (project: Project) =>
  project.links.filter((link) => link.href !== `/projects/${project.slug}`);

/** Next in chain: same thread group first, then same category. */
export function relatedDevices(project: Project, limit = 3): Project[] {
  const group = groupOf(project).key;
  const others = rackOrder.filter((p) => p.slug !== project.slug);
  const sameGroup = others.filter((p) => groupOf(p).key === group);
  const sameCategory = others.filter(
    (p) => groupOf(p).key !== group && p.category === project.category,
  );
  return [...sameGroup, ...sameCategory].slice(0, limit);
}
