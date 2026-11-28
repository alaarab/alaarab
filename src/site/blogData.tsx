import { createContext, useContext, useEffect, useState } from "react";
import type { BlogPageData } from "../types";

/**
 * The data for the blog page being server-rendered: set by the server's render
 * call and, on the client, read back from the JSON the server put in the page.
 * `data: null` means the server answered 404 for that path.
 */
export interface BlogPayload {
  path: string;
  data: BlogPageData | null;
}

export const BlogDataContext = createContext<BlogPayload | null>(null);

export const BLOG_DATA_ID = "blog-data";

/** Serialise the payload for a <script type="application/json"> tag. */
export const blogPayloadJson = (payload: BlogPayload) =>
  JSON.stringify(payload).replace(/</g, "\\u003c");

/** Read the payload the server embedded, if this page has one. */
export function readBlogPayload(): BlogPayload | null {
  const el = typeof document !== "undefined" ? document.getElementById(BLOG_DATA_ID) : null;
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent) as BlogPayload;
  } catch {
    return null;
  }
}

export type BlogPageState =
  | { status: "ready"; data: BlogPageData }
  | { status: "loading" }
  | { status: "missing" }
  | { status: "error"; retry: () => void };

/**
 * The page data for a blog path. The first render uses what the server sent,
 * so hydration matches. Each blog path mounts its own page state.
 */
export function useBlogPage(path: string): BlogPageState {
  const payload = useContext(BlogDataContext);
  const [page, setPage] = useState<BlogPageState>(() => {
    if (payload?.path !== path) return { status: "loading" };
    if (payload.data === null) return { status: "missing" };
    return { status: "ready", data: payload.data };
  });
  const loading = page.status === "loading";

  useEffect(() => {
    if (!loading) return;
    let live = true;
    fetch(`/api/blog/page?path=${encodeURIComponent(path)}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (live) setPage({ status: "missing" });
          return;
        }
        if (!res.ok) throw new Error(`Blog request failed (${res.status})`);
        const data = (await res.json()) as BlogPageData;
        if (live) setPage({ status: "ready", data });
      })
      .catch(() => {
        if (live) setPage({ status: "error", retry: () => setPage({ status: "loading" }) });
      });
    return () => {
      live = false;
    };
  }, [path, loading]);

  return page;
}
