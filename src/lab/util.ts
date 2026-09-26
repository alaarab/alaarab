import { projects } from "../data/siteContent";
import type { Project } from "../types";

export const projectBySlug = (slug: string | undefined): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Start year from strings like "2013 to 2023", "2025 to present", "2026". */
export const startYear = (p: Project): number => Number(p.year.slice(0, 4));

/** Drop the link that points back at the project's own page. */
export const externalLinks = (p: Project) =>
  p.links.filter((l) => !l.href.startsWith("/projects/"));
