import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { App } from "./App";
import { BlogDataContext, type BlogPayload } from "./site/blogData";

/**
 * Render the app to an HTML string for a given path: at build time for the
 * prerendered pages, and per request for the blog, with that page's data.
 */
export function render(location: string, blog?: BlogPayload): string {
  return renderToString(
    createElement(
      BlogDataContext.Provider,
      { value: blog ?? null },
      createElement(StaticRouter, { location }, createElement(App)),
    ),
  );
}
