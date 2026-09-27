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

/**
 * One block of a blog post body. Text in `p`, list items and quotes may use two
 * inline marks: [label](href) for links and `backticks` for code.
 */
export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; cite?: string }
  | { type: "code"; code: string; lang?: string };

export interface Post {
  /** URL segment: /blog/<slug>. Lowercase, hyphenated, never changed once published. */
  slug: string;
  title: string;
  /** One or two sentences. Used on the index, as the meta description, and in the feed. */
  summary: string;
  /** Publish date, YYYY-MM-DD. */
  date: string;
  /** Last meaningful edit, YYYY-MM-DD. */
  updated?: string;
  tags?: string[];
  /** Slugs of projects the post is about; linked at the foot of the post. */
  projects?: string[];
  /** Drafts are left out of the index, routes, sitemap, and feed. */
  draft?: boolean;
  body: PostBlock[];
}
