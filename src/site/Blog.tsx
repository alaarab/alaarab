import { type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { blogMeta } from "../data/blog";
import { siteMeta } from "../data/siteContent";
import { blogPath, formatDate, headingId, readingMinutes } from "../lib/posts";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { NotFound } from "../pages/NotFound";
import type { Post, PostBlock, PostRef, PostSummary } from "../types";
import { useBlogPage } from "./blogData";
import { PageFoot, TopNav } from "./chrome";
import { Divider, thread } from "./stitch";
import { FONT_HREF, projectPath } from "./themes";
import { projectBySlug } from "./util";
import styles from "./embroidery.module.css";

/** Canonical origin for structured data; matches routeMeta and personSchema. */
const SITE_ORIGIN = "https://alaarab.com";

const MARK = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;

/** Links a post may carry: the web, mail, and paths or anchors on this site. */
const SAFE_HREF = /^(https?:\/\/|mailto:|\/|#)/i;

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
    } else if (!SAFE_HREF.test(href)) {
      out.push(label);
    } else if (href.startsWith("/") && !href.startsWith("//")) {
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
      const items = block.items.map((item, k) => (
        <li key={k}>
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
function Dateline({ date, minutes }: { date: string; minutes: number }) {
  return (
    <p className={styles.notesMeta}>
      <time dateTime={date}>{formatDate(date)}</time>. {minutes} min read.
    </p>
  );
}

/** The shell every blog page shares. */
function BlogPage({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <TopNav />
      {children}
      <PageFoot />
    </div>
  );
}

function PostList({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return <p className={styles.postEmpty}>Nothing published yet.</p>;
  return (
    <ol className={styles.postList}>
      {posts.map((post) => (
        <li key={post.slug} className={styles.postItem}>
          <Dateline date={post.date} minutes={post.minutes} />
          <h2 className={styles.postItemTitle}>
            <Link to={blogPath(post.slug)}>{post.title}</Link>
          </h2>
          <p className={styles.postItemSummary}>{post.summary}</p>
        </li>
      ))}
    </ol>
  );
}

export function BlogIndex() {
  useDocumentTitle(`${blogMeta.title} | ${siteMeta.name}`);
  const page = useBlogPage("/blog");

  return (
    <BlogPage>
      <main className={styles.blogMain}>
        <header className={styles.projectHead}>
          <h1 className={styles.pageTitle}>{blogMeta.title}</h1>
          <Divider pattern="running" c={thread.woad} className={styles.headDivider} />
          <p className={styles.lead}>{blogMeta.intro}</p>
          <p className={styles.feedLink}>
            <a href="/blog/feed.xml">Subscribe to the feed</a>
          </p>
        </header>
        {page.status === "ready" && page.data.kind === "index" ? (
          <PostList posts={page.data.posts} />
        ) : page.status === "loading" ? (
          <p className={styles.postEmpty} aria-live="polite">
            Loading posts.
          </p>
        ) : (
          <p className={styles.postEmpty}>The posts could not be loaded.</p>
        )}
      </main>
    </BlogPage>
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
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
  };
}

/** A post's article: header, body, and foot. The editor's preview uses it too. */
export function PostArticle({ post }: { post: Post }) {
  const related = post.projects.map(projectBySlug).filter((p) => p !== undefined);
  return (
    <article className={styles.post} aria-labelledby="post-title">
      <header className={styles.postHead}>
        <Dateline date={post.date} minutes={readingMinutes(post.body)} />
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

      {(post.updated || related.length > 0 || post.tags.length > 0) && (
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
          {post.tags.length > 0 && <p className={styles.postTags}>Tagged {post.tags.join(", ")}.</p>}
        </footer>
      )}
    </article>
  );
}

function Along({ newer, older }: { newer?: PostRef; older?: PostRef }) {
  return (
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
  );
}

export function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const page = useBlogPage(blogPath(slug));
  const post = page.status === "ready" && page.data.kind === "post" ? page.data : null;
  useDocumentTitle(
    post ? `${post.post.title} | ${siteMeta.name}` : page.status === "loading" ? siteMeta.name : `Not found | ${siteMeta.name}`,
  );

  if (page.status === "loading") {
    return (
      <BlogPage>
        <main className={styles.blogMain}>
          <p className={styles.postEmpty} aria-live="polite">
            Loading the post.
          </p>
        </main>
      </BlogPage>
    );
  }
  if (!post) return <NotFound />;

  return (
    <BlogPage>
      <main className={styles.blogMain}>
        <PostArticle post={post.post} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post.post)).replace(/</g, "\\u003c") }}
        />
      </main>
      <Along newer={post.newer} older={post.older} />
    </BlogPage>
  );
}
