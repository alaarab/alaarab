/**
 * Gzip for text responses. Files from dist/ keep their compressed bytes in
 * memory (keyed by path and mtime), so each one is compressed once; rendered
 * responses are compressed per request.
 */

const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml|atom\+xml|manifest\+json)|image\/svg\+xml)/;
// Below this, gzip's framing costs more than it saves.
const MIN_BYTES = 1024;

/** True when the client lists gzip in Accept-Encoding without q=0. */
export function acceptsGzip(req: Request): boolean {
  return (req.headers.get("accept-encoding") ?? "").split(",").some((part) => {
    const [name, ...params] = part.trim().toLowerCase().split(";").map((s) => s.trim());
    const q = params.find((p) => p.startsWith("q="));
    return name === "gzip" && (!q || Number(q.slice(2)) > 0);
  });
}

const gzip = (bytes: Uint8Array<ArrayBuffer>) => (bytes.byteLength < MIN_BYTES ? null : Bun.gzipSync(bytes));

const fileCache = new Map<string, { mtime: number; gz: Uint8Array<ArrayBuffer> | null }>();

/** A file from disk, gzipped (from the cache) when its type and the client allow. */
export async function serveFile(
  req: Request,
  path: string,
  init: { status?: number; headers?: Record<string, string> } = {},
): Promise<Response> {
  const file = Bun.file(path);
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", file.type);
  if (COMPRESSIBLE.test(headers.get("content-type") ?? "")) {
    headers.append("vary", "Accept-Encoding");
    // Range requests are served from the raw file.
    if (acceptsGzip(req) && !req.headers.has("range")) {
      let hit = fileCache.get(path);
      if (!hit || hit.mtime !== file.lastModified) {
        hit = { mtime: file.lastModified, gz: gzip(await file.bytes()) };
        fileCache.set(path, hit);
      }
      if (hit.gz) {
        headers.set("content-encoding", "gzip");
        return new Response(hit.gz, { status: init.status, headers });
      }
    }
  }
  return new Response(file, { status: init.status, headers });
}

/** Gzip a rendered response's body when its type and the client allow. */
export async function compress(req: Request, res: Response): Promise<Response> {
  const type = res.headers.get("content-type") ?? "";
  if (!res.body || !COMPRESSIBLE.test(type) || res.headers.has("content-encoding")) return res;
  const headers = new Headers(res.headers);
  headers.append("vary", "Accept-Encoding");
  const body = new Uint8Array(await res.arrayBuffer());
  const gz = acceptsGzip(req) ? gzip(body) : null;
  if (gz) headers.set("content-encoding", "gzip");
  return new Response(gz ?? body, { status: res.status, statusText: res.statusText, headers });
}

/** Wrap a route handler so its response goes through compress(). */
export const gzipped =
  <R extends Request>(handler: (req: R) => Response | Promise<Response>) =>
  async (req: R) =>
    compress(req, await handler(req));
