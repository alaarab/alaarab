import { type ReactNode, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { blogMeta } from "../data/posts";
import { siteMeta } from "../data/siteContent";
import {
  blogPath,
  draftBySlug,
  formatDate,
  headingId,
  postBySlug,
  postNeighbours,
  publishedPosts,
  readingMinutes,
} from "../lib/posts";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { NotFound } from "../pages/NotFound";
import type { Post, PostBlock } from "../types";
import { PageFoot, TopNav } from "./chrome";
import { Divider, thread } from "./stitch";
import { FONT_HREF, projectPath } from "./themes";
import { projectBySlug } from "./util";
import styles from "./embroidery.module.css";

/** Canonical origin for structured data; matches routeMeta and personSchema. */
const SITE_ORIGIN = "https://alaarab.com";

const MARK = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;

/** Plain text with [label](href) links and `code`. Nothing else is parsed. */
function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [, label, href, code] = m;
    if (code !== undefined) {
      out.push(<code key={at}>{code}</code>);
    } else if (href.startsWith("/")) {
      out.push(
        <Link key={at} to={href}>
          {label}
        </Link>,
      );
    } else {
      out.push(
        <a key={at} href={href}>
          {label}
        </a>,
      );
    }
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <Inline text={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2 id={headingId(block.text)}>
          <Inline text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3 id={headingId(block.text)}>
          <Inline text={block.text} />
        </h3>
      );
    case "list": {
      const items = block.items.map((item) => (
        <li key={item}>
          <Inline text={item} />
        </li>
      ));
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "quote":
      return (
        <figure className={styles.postQuote}>
          <blockquote>
            <p>
              <Inline text={block.text} />
            </p>
          </blockquote>
          {block.cite && <figcaption>{block.cite}</figcaption>}
        </figure>
      );
    case "code":
      return (
        <pre className={styles.postCode} data-lang={block.lang} tabIndex={0}>
          <code>{block.code}</code>
        </pre>
      );
  }
}

/** The date and reading time line above a title. */
function Dateline({ post }: { post: Post }) {
  const minutes = readingMinutes(post);
  return (
    <p className={styles.notesMeta}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>. {minutes} min read.
    </p>
  );
}

export function BlogIndex() {
  useDocumentTitle(`${blogMeta.title} | ${siteMeta.name}`);

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <TopNav blog={false} />

      <main className={styles.blogMain}>
        <header className={styles.projectHead}>
          <h1 className={styles.pageTitle}>{blogMeta.title}</h1>
          <Divider pattern="running" c={thread.woad} className={styles.headDivider} />
          <p className={styles.lead}>{blogMeta.intro}</p>
          <p className={styles.feedLink}>
            <a href="/blog/feed.xml">Subscribe to the feed</a>
          </p>
        </header>

        {publishedPosts.length > 0 ? (
          <ol className={styles.postList}>
            {publishedPosts.map((post) => (
              <li key={post.slug} className={styles.postItem}>
                <Dateline post={post} />
                <h2 className={styles.postItemTitle}>
                  <Link to={blogPath(post.slug)}>{post.title}</Link>
                </h2>
                <p className={styles.postItemSummary}>{post.summary}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.postEmpty}>Nothing published yet.</p>
        )}
      </main>

      <PageFoot />
    </div>
  );
}

function articleSchema(post: Post) {
  const url = `${SITE_ORIGIN}${blogPath(post.slug)}`;
  const author = { "@type": "Person", name: siteMeta.name, url: `${SITE_ORIGIN}/` };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    mainEntityOfPage: url,
    author,
    publisher: author,
    keywords: post.tags?.join(", "),
  };
}

export function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [search] = useSearchParams();
  const published = postBySlug(slug);

  // Drafts only show with ?preview, and only after hydration: the server sends
  // the 404 page for a draft's URL, and the first client render must match it.
  const [draft, setDraft] = useState<Post | undefined>();
  const wantsPreview = search.has("preview");
  useEffect(() => {
    setDraft(!published && wantsPreview ? draftBySlug(slug) : undefined);
  }, [published, wantsPreview, slug]);

  const post = published ?? draft;
  useDocumentTitle(post ? `${draft ? "Draft: " : ""}${post.title} | ${siteMeta.name}` : `Not found | ${siteMeta.name}`);

  if (!post) return <NotFound />;

  const { newer, older } = postNeighbours(post.slug);
  const related = (post.projects ?? []).map(projectBySlug).filter((p) => p !== undefined);

  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <TopNav blog />

      <main className={styles.blogMain}>
        {draft && (
          <p className={styles.draftBanner} role="note">
            Draft preview. This post is not published and is not linked, listed, or in the feed.
          </p>
        )}
        <article className={styles.post} aria-labelledby="post-title">
          <header className={styles.postHead}>
            <Dateline post={post} />
            <h1 id="post-title" className={styles.pageTitle}>
              {post.title}
            </h1>
            <Divider pattern="running" c={thread.woad} className={styles.headDivider} />
            <p className={styles.lead}>{post.summary}</p>
          </header>

          <div className={styles.postBody}>
            {post.body.map((block, k) => (
              <Block key={k} block={block} />
            ))}
          </div>

          <footer className={styles.postFoot}>
            {post.updated && (
              <p className={styles.notesMeta}>
                Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>.
              </p>
            )}
            {related.length > 0 && (
              <p>
                About{" "}
                {related.map((p, k) => (
                  <span key={p.slug}>
                    {k > 0 && ", "}
                    <Link to={projectPath(p.slug)}>{p.title}</Link>
                  </span>
                ))}
                .
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <p className={styles.postTags}>
                Tagged {post.tags.join(", ")}.
              </p>
            )}
          </footer>
        </article>

        {!draft && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post)) }}
          />
        )}
      </main>

      <nav className={styles.along} aria-label="More posts">
        {older ? (
          <Link to={blogPath(older.slug)} className={styles.alongLink} data-dir="prev">
            <span className={styles.alongDir}>Older</span>
            {older.title}
          </Link>
        ) : (
          <Link to="/blog" className={styles.alongLink} data-dir="prev">
            <span className={styles.alongDir}>Back to</span>
            All posts
          </Link>
        )}
        {newer ? (
          <Link to={blogPath(newer.slug)} className={styles.alongLink} data-dir="next">
            <span className={styles.alongDir}>Newer</span>
            {newer.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <PageFoot />
    </div>
  );
}
