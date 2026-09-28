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
  | { status: "missing" };

/**
 * The page data for a blog path. The first render uses what the server sent,
 * so hydration matches; after a client-side navigation it is fetched.
 */
export function useBlogPage(path: string): BlogPageState {
  const payload = useContext(BlogDataContext);
  const fromServer: BlogPageState | null =
    payload && payload.path === path
      ? payload.data
        ? { status: "ready", data: payload.data }
        : { status: "missing" }
      : null;
  const [fetched, setFetched] = useState<{ path: string; state: BlogPageState } | null>(null);

  useEffect(() => {
    if (fromServer) return;
    let live = true;
    fetch(`/api/blog/page?path=${encodeURIComponent(path)}`)
      .then(async (res) => {
        const state: BlogPageState = res.ok
          ? { status: "ready", data: (await res.json()) as BlogPageData }
          : { status: "missing" };
        if (live) setFetched({ path, state });
      })
      .catch(() => live && setFetched({ path, state: { status: "missing" } }));
    return () => {
      live = false;
    };
    // fromServer is derived from payload and path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, payload]);

  if (fromServer) return fromServer;
  if (fetched?.path === path) return fetched.state;
  return { status: "loading" };
}
