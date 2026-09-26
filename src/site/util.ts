import { projects } from "../data/siteContent";
import type { Project } from "../types";

export const projectBySlug = (slug: string | undefined): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Drop the link that points back at the project's own page. */
export const externalLinks = (p: Project) =>
  p.links.filter((l) => !l.href.startsWith("/projects/"));
