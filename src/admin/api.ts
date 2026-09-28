import type { PostInput, PostRecord } from "../types";

/** Calls to the server's author API. Every write needs the session cookie. */

export interface Me {
  login: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly field?: keyof PostInput,
  ) {
    super(message);
  }
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as { error?: string; field?: keyof PostInput };
  if (!res.ok) throw new ApiError(data.error ?? `Request failed (${res.status}).`, res.status, data.field);
  return data as T;
}

export const api = {
  me: () => call<{ user: Me | null }>("GET", "/api/me"),
  list: () => call<PostRecord[]>("GET", "/api/admin/posts"),
  get: (slug: string) => call<PostRecord>("GET", `/api/admin/posts/${encodeURIComponent(slug)}`),
  create: (post: PostInput) => call<PostRecord>("POST", "/api/admin/posts", post),
  update: (slug: string, post: PostInput) => call<PostRecord>("PUT", `/api/admin/posts/${encodeURIComponent(slug)}`, post),
  remove: (slug: string) => call<void>("DELETE", `/api/admin/posts/${encodeURIComponent(slug)}`),
  signOut: () => call<void>("POST", "/auth/logout"),
};
