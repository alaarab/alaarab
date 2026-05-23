export interface SiteMeta {
  name: string;
  title: string;
  intro: string;
  summary: string;
  location: string;
  email: string;
  emailHref: string;
  linkedinHref: string;
  availability: string;
}

export interface QuickStat {
  label: string;
  value: string;
}

export interface ActionLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  /** Brand color carried over from the project itself. Falls back to the site accent. */
  accent?: string;
  title: string;
  category: string;
  status: string;
  year: string;
  summary: string;
  outcome: string;
  problem: string;
  build: string;
  impact: string;
  stack: string[];
  metrics?: string[];
  /** Optional thematic grouping (e.g. "Agent tooling", "Music tooling"). */
  thread?: string;
  /** Pull-quote from the project itself (often from its README). */
  quote?: string;
  links: ActionLink[];
  featured: boolean;
}

export interface ExperienceItem {
  company: string;
  role: string;
  years: string;
  location: string;
  summary: string;
}

export interface EducationItem {
  school: string;
  detail: string;
  years: string;
}
