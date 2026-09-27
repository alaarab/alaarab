import type { Post } from "../types";

/**
 * Blog posts, newest first or in any order (the site sorts by date).
 * See docs/blog.md for how to write, preview, and publish one.
 */

export const blogMeta = {
  title: "Blog",
  // DRAFT copy: confirm or rewrite before the first post is published.
  intro: "Write-ups on the projects on this site and the work behind them.",
};

export const posts: Post[] = [
  {
    slug: "sample-post",
    title: "Sample post: what a post can hold",
    summary:
      "A draft that shows every block a post can use. It is not published; replace it with a real post.",
    date: "2026-09-27",
    tags: ["meta"],
    projects: ["phren"],
    draft: true,
    body: [
      {
        type: "p",
        text: "DRAFT SAMPLE. This post exists to show the format and is never published. Preview it locally at `/blog/sample-post?preview`, then delete it or replace it with a real post.",
      },
      {
        type: "p",
        text: "A paragraph is plain text. It can carry a [link to the projects](/#work) and a bit of inline `code`. Nothing else is parsed, so what you type is what renders.",
      },
      { type: "h2", text: "A section heading" },
      {
        type: "p",
        text: "Second-level headings get an anchor id from their text, so a section can be linked to directly.",
      },
      { type: "h3", text: "A smaller heading" },
      {
        type: "list",
        items: [
          "Unordered lists are the default.",
          "Items take the same inline marks as paragraphs, like `bun run build`.",
        ],
      },
      {
        type: "list",
        ordered: true,
        items: ["Ordered lists set ordered: true.", "They number themselves."],
      },
      {
        type: "quote",
        text: "A quote block, for a line worth pulling out.",
        cite: "The source, if there is one",
      },
      {
        type: "code",
        lang: "ts",
        code: 'const greeting = "hello";\nconsole.log(greeting);',
      },
      {
        type: "p",
        text: "The projects listed in `projects` are linked at the foot of the post.",
      },
    ],
  },
];
