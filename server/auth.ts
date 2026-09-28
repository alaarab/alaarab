import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { BlogDb } from "./db";

/**
 * Sign in with GitHub, for exactly one GitHub account: the one whose numeric id
 * is BLOG_ADMIN_GITHUB_ID (ids survive username changes; logins don't). The
 * GitHub token is used once to read the user and then dropped; the site keeps
 * its own session, stored as a SHA-256 hash, in an HttpOnly cookie.
 */

export interface AuthConfig {
  /** Public origin, e.g. https://alaarab.com. The OAuth callback is built from it. */
  origin: string;
  clientId?: string;
  clientSecret?: string;
  adminGithubId?: string;
  /** Local end-to-end tests only: allows POST /auth/test-login from localhost. */
  testLogin: boolean;
}

export interface Session {
  githubId: string;
  login: string;
}

const SESSION_DAYS = 30;
const TEST_ID = "test";

export function createAuth(db: BlogDb, cfg: AuthConfig) {
  const secure = cfg.origin.startsWith("https://") && !cfg.testLogin;
  const SESSION = secure ? "__Host-alaarab_session" : "alaarab_session";
  const OAUTH = secure ? "__Host-alaarab_oauth" : "alaarab_oauth";
  const configured = Boolean(cfg.clientId && cfg.clientSecret && cfg.adminGithubId);

  const cookie = (name: string, value: string, maxAge: number) =>
    `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;

  const hash = (token: string) => createHash("sha256").update(token).digest("hex");

  function readCookie(req: Request, name: string): string | undefined {
    const header = req.headers.get("cookie");
    if (!header) return undefined;
    for (const part of header.split(";")) {
      const [k, ...v] = part.trim().split("=");
      if (k === name) return v.join("=");
    }
    return undefined;
  }

  const redirect = (to: string, cookies: string[] = []) => {
    const headers = new Headers({ location: to, "cache-control": "no-store" });
    for (const c of cookies) headers.append("set-cookie", c);
    return new Response(null, { status: 302, headers });
  };

  /** Only paths inside the editor, so ?next can't send anyone off-site. */
  const safeNext = (next: string | null) =>
    next && /^\/write(\/[a-z0-9-]*)?$/.test(next) ? next : "/write";

  function startSession(githubId: string, login: string, next: string) {
    const token = randomBytes(32).toString("base64url");
    const maxAge = SESSION_DAYS * 24 * 60 * 60;
    db.addSession(hash(token), githubId, login, Date.now() + maxAge * 1000);
    return redirect(next, [cookie(SESSION, token, maxAge), cookie(OAUTH, "", 0)]);
  }

  const isAuthor = (s: Session) =>
    (cfg.adminGithubId !== undefined && s.githubId === cfg.adminGithubId) || (cfg.testLogin && s.githubId === TEST_ID);

  /** The signed-in author, or null. */
  function author(req: Request): Session | null {
    const token = readCookie(req, SESSION);
    if (!token) return null;
    const session = db.getSession(hash(token));
    return session && isAuthor(session) ? session : null;
  }

  /**
   * Writes must come from this site's own pages: the browser's Origin header has
   * to name this host. With SameSite=Lax cookies this closes off cross-site forms.
   */
  function sameOrigin(req: Request): boolean {
    const origin = req.headers.get("origin");
    if (!origin) return false;
    let host: string;
    try {
      host = new URL(origin).host;
    } catch {
      return false;
    }
    return host === req.headers.get("host") || host === new URL(cfg.origin).host;
  }

  const isLocal = (req: Request) => /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.get("host") ?? "");

  return {
    author,
    sameOrigin,

    /** GET /auth/github: off to GitHub, remembering where to come back to. */
    start(req: Request): Response {
      if (!configured) return redirect("/write?error=config");
      const next = safeNext(new URL(req.url).searchParams.get("next"));
      const state = randomBytes(24).toString("base64url");
      const url = new URL("https://github.com/login/oauth/authorize");
      url.searchParams.set("client_id", cfg.clientId!);
      url.searchParams.set("redirect_uri", `${cfg.origin}/auth/github/callback`);
      url.searchParams.set("state", state);
      url.searchParams.set("scope", "");
      url.searchParams.set("allow_signup", "false");
      return redirect(url.toString(), [cookie(OAUTH, `${state}.${encodeURIComponent(next)}`, 600)]);
    },

    /** GET /auth/github/callback: check state, ask GitHub who this is, start a session. */
    async callback(req: Request): Promise<Response> {
      if (!configured) return redirect("/write?error=config");
      const params = new URL(req.url).searchParams;
      const code = params.get("code");
      const state = params.get("state") ?? "";
      const [expected = "", nextEncoded = ""] = (readCookie(req, OAUTH) ?? "").split(".");
      const clear = [cookie(OAUTH, "", 0)];
      const a = Buffer.from(state);
      const b = Buffer.from(expected);
      if (!code || !expected || a.length !== b.length || !timingSafeEqual(a, b)) {
        return redirect("/write?error=state", clear);
      }

      try {
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: { accept: "application/json", "content-type": "application/json" },
          body: JSON.stringify({
            client_id: cfg.clientId,
            client_secret: cfg.clientSecret,
            code,
            redirect_uri: `${cfg.origin}/auth/github/callback`,
          }),
        });
        const { access_token } = (await tokenRes.json()) as { access_token?: string };
        if (!access_token) return redirect("/write?error=github", clear);

        const userRes = await fetch("https://api.github.com/user", {
          headers: {
            authorization: `Bearer ${access_token}`,
            accept: "application/vnd.github+json",
            "user-agent": "alaarab.com",
          },
        });
        if (!userRes.ok) return redirect("/write?error=github", clear);
        const user = (await userRes.json()) as { id?: number; login?: string };
        if (String(user.id) !== cfg.adminGithubId || !user.login) return redirect("/write?error=denied", clear);

        return startSession(String(user.id), user.login, safeNext(decodeURIComponent(nextEncoded)));
      } catch {
        return redirect("/write?error=github", clear);
      }
    },

    /** POST /auth/logout */
    logout(req: Request): Response {
      if (!sameOrigin(req)) return new Response(null, { status: 403 });
      const token = readCookie(req, SESSION);
      if (token) db.dropSession(hash(token));
      const headers = new Headers({ "cache-control": "no-store" });
      headers.append("set-cookie", cookie(SESSION, "", 0));
      return new Response(null, { status: 204, headers });
    },

    /** POST /auth/test-login: tests only, from localhost only. 404 otherwise. */
    testLogin(req: Request): Response {
      if (!cfg.testLogin || !isLocal(req) || !sameOrigin(req)) return new Response("Not found", { status: 404 });
      return startSession(TEST_ID, "test-author", "/write");
    },
  };
}

export type Auth = ReturnType<typeof createAuth>;
