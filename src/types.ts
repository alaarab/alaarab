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
 * One block of a blog post body, parsed from the post's source text (see
 * src/lib/postSource.ts). Text in `p`, list items, headings and quotes may use
 * two inline marks: [label](href) for links and `backticks` for code.
 */
export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; cite?: string }
  | { type: "code"; code: string; lang?: string };

/** The fields the author edits. Stored as a row in the server's blog database. */
export interface PostInput {
  /** URL segment: /blog/<slug>. Lowercase and hyphenated; fixed once published. */
  slug: string;
  title: string;
  /** One or two sentences. Used on the index, as the meta description, and in the feed. */
  summary: string;
  /** Publish date, YYYY-MM-DD. */
  date: string;
  /** Last meaningful edit, YYYY-MM-DD. */
  updated?: string;
  tags: string[];
  /** Slugs of projects the post is about; linked at the foot of the post. */
  projects: string[];
  /** Drafts are only visible to the signed-in author. */
  draft: boolean;
  /** The body as written, in the small markdown subset postSource parses. */
  source: string;
}

/** A post as the author sees it in the editor. */
export interface PostRecord extends PostInput {
  createdAt: string;
  updatedAt: string;
}

/** A post ready to render. */
export interface Post extends Omit<PostInput, "source"> {
  body: PostBlock[];
}

/** Enough of a post to link to it. */
export interface PostRef {
  slug: string;
  title: string;
}

/** An index entry. */
export type PostSummary = Omit<Post, "body"> & { minutes: number };

/** What a public blog page needs, sent with the server-rendered HTML. */
export type BlogPageData =
  | { kind: "index"; posts: PostSummary[] }
  | { kind: "post"; post: Post; newer?: PostRef; older?: PostRef };
