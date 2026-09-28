# The blog

Posts are written on the site itself, at `/write`, after signing in with
GitHub. They live in a SQLite database on the server, not in this repo, so a
draft is private until it's published.

## Routes

| Path | What it is |
| --- | --- |
| `/blog` | Published posts, newest first. |
| `/blog/<slug>` | One post. Drafts and unknown slugs return the 404 page. |
| `/blog/feed.xml` | Atom feed of published posts (title, date, summary). |
| `/write` | The editor: sign in, list posts, write, preview, publish. Never indexed. |

The server renders `/blog` pages per request from the database (`server/blog.ts`)
using the same SSR bundle as the prerendered pages, and caches them in memory
until a post changes. Each post gets its own title, description, canonical URL,
`og:type=article`, `article:published_time`, and BlogPosting JSON-LD, and is
listed in `sitemap.xml` and the feed once published.

## Writing a post

In the editor: title (the slug fills itself in from it), a one or two sentence
summary, date, optional "updated" date, tags, the projects it's about, and the
post itself. **Save draft** keeps it private; **Publish** puts it live.
A published post can be edited, unpublished, or deleted. Its slug is fixed once
published so links keep working.

The post is written in a small markdown subset (`src/lib/postSource.ts`):

~~~
A blank line separates paragraphs. Lines of one paragraph are joined.

## Heading
### Smaller heading

- a list item          (or * item)
1. a numbered item

> A quote.
> -- who said it       (optional last line)

```ts
code, blank lines kept
```

Inline: [label](https://example.com) links and `code`.
~~~

Links may point at `https://`, `http://`, `mailto:`, or a path on this site
(`/projects/phren`). Anything else renders as plain text. No raw HTML.

## Sign-in

"Sign in with GitHub" works for one account: the GitHub user whose numeric id
is `BLOG_ADMIN_GITHUB_ID` (Ala's is `1730921`). Anyone else is turned away. The
GitHub token is used once to read who signed in, then dropped. The site keeps its
own 30-day session, stored hashed in the database, in an HttpOnly, Secure,
SameSite=Lax cookie. Every write must also come from this site (its `Origin`
header is checked).

## Server setup

1. Create a GitHub OAuth app (GitHub → Settings → Developer settings → OAuth
   Apps → New):
   - Homepage URL: `https://alaarab.com`
   - Authorization callback URL: `https://alaarab.com/auth/github/callback`
2. Give the server process these environment variables (for pm2, in its
   ecosystem file or `pm2 restart alaarab --update-env` after exporting them):

   | Variable | Value |
   | --- | --- |
   | `GITHUB_CLIENT_ID` | from the OAuth app |
   | `GITHUB_CLIENT_SECRET` | from the OAuth app; keep it out of git |
   | `BLOG_ADMIN_GITHUB_ID` | `1730921` |
   | `SITE_ORIGIN` | `https://alaarab.com` (the default) |
   | `BLOG_DB` | optional; defaults to `data/blog.sqlite` in the repo checkout |

   Without the GitHub variables the blog still serves, and `/write` says
   sign-in isn't set up.
3. Back up the database. `data/` is ignored by git, so `git pull` deploys don't
   touch it, but it is the only copy of the posts. For a consistent copy while
   the server runs: `sqlite3 data/blog.sqlite ".backup 'blog-backup.sqlite'"`.

## Local development

`bun dev` serves the site with an empty database at `data/blog.sqlite`. To sign
in locally with GitHub, make a second OAuth app with the callback
`http://localhost:3000/auth/github/callback` and run with
`SITE_ORIGIN=http://localhost:3000` plus the three GitHub variables.

The end-to-end tests use a separate database and a test-only sign-in
(`BLOG_TEST_LOGIN=1`), which also only answers requests addressed to
`localhost`. Never set it on the real server.
