# Writing for the blog

Posts are typed data in `src/data/posts.ts`, the same way projects live in
`src/data/siteContent.ts`. There is no Markdown pipeline and no CMS. The page
components (`src/site/Blog.tsx`) render whatever is in that array.

## Routes

- `/blog`: every published post, newest first.
- `/blog/<slug>`: one post.
- `/blog/feed.xml`: an Atom feed of published posts (title, date, summary).

Published posts are prerendered like every other route, with their own title,
description, canonical URL, `og:type=article`, `article:published_time`, and
BlogPosting JSON-LD. They are listed in `sitemap.xml`.

## A post

```ts
{
  slug: "why-markdown-memory",          // URL segment; don't change it after publishing
  title: "Why agent memory lives in markdown",
  summary: "One or two sentences. Shown on the index, as the meta description, and in the feed.",
  date: "2026-10-01",                   // YYYY-MM-DD
  updated: "2026-10-04",                // optional
  tags: ["phren"],                      // optional
  projects: ["phren"],                  // optional; project slugs linked at the foot
  draft: true,                          // remove (or set false) to publish
  body: [ /* blocks */ ],
}
```

### Blocks

| Block | Shape |
| --- | --- |
| Paragraph | `{ type: "p", text }` |
| Heading | `{ type: "h2", text }` or `{ type: "h3", text }` (gets an anchor id from its text) |
| List | `{ type: "list", items: [...], ordered?: true }` |
| Quote | `{ type: "quote", text, cite? }` |
| Code | `{ type: "code", code, lang? }` |

Inside `p`, list items, headings, and quotes, two inline marks are parsed:
`[label](href)` for links (a leading `/` makes it an in-site link) and
`` `code` `` for inline code. Everything else renders as typed.

## Drafts

A post with `draft: true` is left out of the index, the routes, the prerender,
the sitemap, and the feed. Its URL returns the 404 page.

To read a draft as it will look, add `?preview` to its URL, locally
(`bun dev`, then `http://localhost:3000/blog/<slug>?preview`) or on the live
site. The preview carries a "Draft preview" banner. Drafts sit in the public
repo and the client bundle, so don't put anything in one that can't be seen.

## Publishing

1. Remove `draft: true` (or set it to `false`) and check `date`.
2. `bun run typecheck && bun run build`, then `bun run test`.
3. Commit and open a PR.

The "Blog" links in the home page and inner-page navigation only appear once at
least one post is published, as does the `/blog` entry in the sitemap.

`src/data/posts.ts` ships with one draft, `sample-post`, which demonstrates
every block. Delete it once there is a real post.
