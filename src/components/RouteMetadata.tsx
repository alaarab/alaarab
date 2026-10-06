import { useEffect } from "react";
import { useLocation } from "react-router";
import { metaForPath, SITE_ORIGIN, writeMeta, type RouteMeta } from "../lib/routeMeta";

/** Client navigation keeps the head identical to a direct prerendered visit. */
export function RouteMetadata() {
  const { pathname } = useLocation();
  const isBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const isEditor = pathname === "/write" || pathname.startsWith("/write/");
  useRouteMetadata(isBlog ? null : isEditor ? { ...writeMeta, path: pathname } : metaForPath(pathname));
  return null;
}

export function useRouteMetadata(meta: RouteMeta | null) {
  useEffect(() => {
    if (!meta) return;
    // Preserve the build's configured origin from its prerendered canonical.
    const origin = new URL(document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? SITE_ORIGIN).origin;
    const canonical = `${origin}${meta.path}`;
    document.title = meta.title;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
    const values: Record<string, string> = {
      'property="og:type"': meta.ogType ?? "website",
      'name="description"': meta.description,
      'property="og:title"': meta.title,
      'property="og:description"': meta.description,
      'property="og:url"': canonical,
      'property="og:image"': `${origin}${meta.ogImage}`,
      'property="og:image:alt"': meta.ogImageAlt,
      'name="twitter:title"': meta.title,
      'name="twitter:description"': meta.description,
      'name="twitter:image"': `${origin}${meta.ogImage}`,
    };
    for (const [selector, value] of Object.entries(values)) {
      document.querySelector(`meta[${selector}]`)?.setAttribute("content", value);
    }
    for (const [key, value] of Object.entries({
      "article:published_time": meta.published,
      "article:modified_time": meta.modified,
      robots: meta.noindex ? "noindex" : undefined,
    })) {
      const attribute = key === "robots" ? "name" : "property";
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!value) { element?.remove(); continue; }
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = value;
    }
  }, [meta]);
}
