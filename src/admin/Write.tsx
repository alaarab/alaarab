import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { projects, siteMeta } from "../data/siteContent";
import { blogPath, formatDate, SLUG_PATTERN, toPost, today } from "../lib/posts";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { PostArticle } from "../site/Blog";
import { FONT_HREF } from "../site/themes";
import styles from "../site/embroidery.module.css";
import type { PostInput, PostRecord } from "../types";
import { api, ApiError, type Me } from "./api";

/**
 * The author's side of the blog: sign in with GitHub, then list, write, preview,
 * publish, unpublish and delete posts. Nothing here is prerendered or indexed;
 * the server checks the session on every call.
 */

const SIGN_IN_ERRORS: Record<string, string> = {
  denied: "That GitHub account can't write here.",
  state: "The sign-in expired or was started in another tab. Try again.",
  github: "GitHub didn't complete the sign-in. Try again.",
  config: "Sign-in isn't set up on this server yet.",
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <link rel="stylesheet" href={FONT_HREF} precedence="default" />
      <nav className={styles.topNav} aria-label="Site">
        <Link to="/" className={styles.topName}>
          Ala Arab
        </Link>
        <span className={styles.topLinks}>
          <Link to="/write">Posts</Link>
          <Link to="/blog">Blog</Link>
        </span>
      </nav>
      <main className={styles.writeMain}>{children}</main>
    </div>
  );
}

/** Load the signed-in author, or null. undefined while loading. */
function useMe() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api
      .me()
      .then((r) => setMe(r.user))
      .catch(() => setError("Couldn't reach the server."));
  }, []);
  return { me, error };
}

function SignIn({ next }: { next: string }) {
  const [search] = useSearchParams();
  const error = search.get("error");
  return (
    <section className={styles.writeSignIn} aria-labelledby="sign-in-h">
      <h1 id="sign-in-h" className={styles.pageTitle}>
        Write
      </h1>
      <p>Sign in to write and publish posts.</p>
      {error && (
        <p className={styles.writeError} role="alert">
          {SIGN_IN_ERRORS[error] ?? "Sign-in failed. Try again."}
        </p>
      )}
      <p>
        <a className={styles.writeButton} href={`/auth/github?next=${encodeURIComponent(next)}`}>
          Sign in with GitHub
        </a>
      </p>
    </section>
  );
}

/** Wraps an author page: waits for the session, shows sign-in without one. */
function Gate({ next, children }: { next: string; children: (me: Me) => ReactNode }) {
  const { me, error } = useMe();
  if (error)
    return (
      <p className={styles.writeError} role="alert">
        {error}
      </p>
    );
  if (me === undefined) return <p aria-live="polite">Checking your session.</p>;
  if (me === null) return <SignIn next={next} />;
  return <>{children(me)}</>;
}

function PostsList({ me }: { me: Me }) {
  const [posts, setPosts] = useState<PostRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .list()
      .then(setPosts)
      .catch((e: Error) => setError(e.message));
  }, []);

  async function signOut() {
    await api.signOut().catch(() => undefined);
    window.location.assign("/write");
  }

  return (
    <>
      <header className={styles.writeHead}>
        <h1 className={styles.pageTitle}>Posts</h1>
        <p className={styles.notesMeta}>
          Signed in as {me.login}.{" "}
          <button type="button" className={styles.linkButton} onClick={signOut}>
            Sign out
          </button>
        </p>
        <p>
          <Link className={styles.writeButton} to="/write/new">
            New post
          </Link>
        </p>
      </header>
      {error && (
        <p className={styles.writeError} role="alert">
          {error}
        </p>
      )}
      {posts === null && !error && <p aria-live="polite">Loading posts.</p>}
      {posts && posts.length === 0 && <p>No posts yet.</p>}
      {posts && posts.length > 0 && (
        <ul className={styles.writeList}>
          {posts.map((p) => (
            <li key={p.slug}>
              <Link to={`/write/${p.slug}`} className={styles.writeListTitle}>
                {p.title}
              </Link>
              <span className={styles.writeListMeta}>
                {p.draft ? "Draft" : "Published"}, {formatDate(p.date)}
                {!p.draft && (
                  <>
                    {" "}
                    · <Link to={blogPath(p.slug)}>View</Link>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function WriteHome() {
  useDocumentTitle(`Posts | ${siteMeta.name}`);
  return (
    <Shell>
      <Gate next="/write">{(me) => <PostsList me={me} />}</Gate>
    </Shell>
  );
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
    .replace(/-$/, "");

const blank = (): PostInput => ({
  slug: "",
  title: "",
  summary: "",
  date: today(),
  updated: undefined,
  tags: [],
  projects: [],
  draft: true,
  source: "",
});

const SOURCE_HELP =
  "Blank line between paragraphs. ## and ### for headings, - or 1. for lists, > for a quote (last line -- source), ``` fences for code. Inline: [label](https://…) and `code`.";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className={styles.fieldHint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.writeError}>
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, hint: boolean, error: boolean) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

function Editor({ slug }: { slug?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [stored, setStored] = useState<PostRecord | null>(null);
  const [form, setForm] = useState<PostInput>(blank);
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const [loading, setLoading] = useState(Boolean(slug));
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [status, setStatus] = useState<string>((location.state as { status?: string } | null)?.status ?? "");
  const [error, setError] = useState<{ message: string; field?: keyof PostInput } | null>(null);
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    if (!slug) return;
    api
      .get(slug)
      .then((p) => {
        setStored(p);
        setForm({ ...p });
        setTagsText(p.tags.join(", "));
      })
      .catch((e: Error) => setError({ message: e.message }))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const published = stored ? !stored.draft : false;
  const preview = useMemo(() => toPost({ ...form, title: form.title || "Untitled", summary: form.summary }), [form]);

  function set<K extends keyof PostInput>(key: K, value: PostInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && !slugTouched && !published) next.slug = slugify(String(value));
      return next;
    });
    setDirty(true);
  }

  async function save(draft: boolean, verb: string) {
    setBusy(true);
    setError(null);
    setStatus("");
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const body: PostInput = { ...form, tags, draft, updated: form.updated || undefined };
    try {
      const saved = stored ? await api.update(stored.slug, body) : await api.create(body);
      setStored(saved);
      setForm({ ...saved });
      setTagsText(saved.tags.join(", "));
      setDirty(false);
      const message = `${verb} at ${new Date().toLocaleTimeString()}.`;
      setStatus(message);
      if (saved.slug !== slug) navigate(`/write/${saved.slug}`, { replace: true, state: { status: message } });
    } catch (e) {
      const err = e as ApiError;
      setError({ message: err.message, field: err.field });
      if (err.field) document.getElementById(`post-${err.field}`)?.focus();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!stored) return;
    if (!window.confirm(`Delete "${stored.title}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await api.remove(stored.slug);
      setDirty(false);
      navigate("/write");
    } catch (e) {
      setError({ message: (e as Error).message });
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void save(published ? false : true, published ? "Saved" : "Draft saved");
  }

  if (loading) return <p aria-live="polite">Loading the post.</p>;
  if (slug && !stored)
    return (
      <p className={styles.writeError} role="alert">
        {error?.message ?? "No such post."} <Link to="/write">Back to posts</Link>
      </p>
    );

  const fieldError = (k: keyof PostInput) => (error?.field === k ? error.message : undefined);
  const input = (k: keyof PostInput, hint = false) => ({
    id: `post-${k}`,
    "aria-invalid": error?.field === k || undefined,
    "aria-describedby": describedBy(`post-${k}`, hint, error?.field === k),
  });

  return (
    <>
      <header className={styles.writeHead}>
        <p className={styles.notesMeta}>
          {stored ? (published ? "Published" : "Draft") : "Not saved yet"}
          {published && (
            <>
              {" "}
              · <Link to={blogPath(stored!.slug)}>View on the blog</Link>
            </>
          )}
        </p>
        <h1 className={styles.pageTitle}>{stored ? "Edit post" : "New post"}</h1>
      </header>

      <div className={styles.tabs} role="group" aria-label="Mode">
        <button type="button" aria-pressed={tab === "edit"} onClick={() => setTab("edit")}>
          Edit
        </button>
        <button type="button" aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </button>
      </div>

      <p className={styles.writeStatus} role="status" aria-live="polite">
        {status}
      </p>
      {error && !error.field && (
        <p className={styles.writeError} role="alert">
          {error.message}
        </p>
      )}

      {tab === "preview" ? (
        <div className={styles.writePreview}>
          <PostArticle post={preview} />
        </div>
      ) : (
        <form className={styles.writeForm} onSubmit={onSubmit} noValidate>
          <Field id="post-title" label="Title" error={fieldError("title")}>
            <input {...input("title")} type="text" required maxLength={200} value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field
            id="post-slug"
            label="Slug"
            hint={published ? "Fixed once published, so links keep working." : `The address: /blog/${form.slug || "…"}`}
            error={fieldError("slug")}
          >
            <input
              {...input("slug", true)}
              type="text"
              required
              maxLength={80}
              pattern={SLUG_PATTERN.source}
              readOnly={published}
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
            />
          </Field>
          <Field id="post-summary" label="Summary" hint="One or two sentences for the index, search results and the feed." error={fieldError("summary")}>
            <textarea {...input("summary", true)} rows={3} maxLength={400} required value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </Field>
          <div className={styles.fieldRow}>
            <Field id="post-date" label="Date" error={fieldError("date")}>
              <input {...input("date")} type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field id="post-updated" label="Updated (optional)" error={fieldError("updated")}>
              <input {...input("updated")} type="date" value={form.updated ?? ""} onChange={(e) => set("updated", e.target.value || undefined)} />
            </Field>
          </div>
          <Field id="post-tags" label="Tags" hint="Comma-separated." error={fieldError("tags")}>
            <input
              {...input("tags", true)}
              type="text"
              value={tagsText}
              onChange={(e) => {
                setTagsText(e.target.value);
                setDirty(true);
              }}
            />
          </Field>
          <fieldset className={styles.field} aria-describedby="post-projects-hint">
            <legend>Projects</legend>
            <p id="post-projects-hint" className={styles.fieldHint}>
              Linked at the foot of the post.
            </p>
            <div className={styles.checks}>
              {projects.map((p) => (
                <label key={p.slug}>
                  <input
                    type="checkbox"
                    checked={form.projects.includes(p.slug)}
                    onChange={(e) =>
                      set("projects", e.target.checked ? [...form.projects, p.slug] : form.projects.filter((s) => s !== p.slug))
                    }
                  />{" "}
                  {p.title}
                </label>
              ))}
            </div>
          </fieldset>
          <Field id="post-source" label="Post" hint={SOURCE_HELP} error={fieldError("source")}>
            <textarea {...input("source", true)} className={styles.sourceArea} rows={22} value={form.source} onChange={(e) => set("source", e.target.value)} />
          </Field>

          <div className={styles.writeActions}>
            {published ? (
              <>
                <button type="submit" className={styles.writeButton} disabled={busy}>
                  Save changes
                </button>
                <button type="button" disabled={busy} onClick={() => save(true, "Unpublished")}>
                  Unpublish
                </button>
              </>
            ) : (
              <>
                <button type="submit" disabled={busy}>
                  Save draft
                </button>
                <button type="button" className={styles.writeButton} disabled={busy} onClick={() => save(false, "Published")}>
                  Publish
                </button>
              </>
            )}
            {stored && (
              <button type="button" className={styles.dangerButton} disabled={busy} onClick={remove}>
                Delete
              </button>
            )}
          </div>
        </form>
      )}
    </>
  );
}

export function WriteEditor() {
  const { slug } = useParams<{ slug: string }>();
  const isNew = slug === undefined;
  useDocumentTitle(`${isNew ? "New post" : "Edit post"} | ${siteMeta.name}`);
  const next = isNew ? "/write/new" : `/write/${slug}`;
  return (
    <Shell>
      <Gate next={next}>{() => <Editor key={slug ?? "new"} slug={slug} />}</Gate>
    </Shell>
  );
}
