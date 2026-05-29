import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { App } from "./App";

/** Render the app to an HTML string for a given path, for the prerender step. */
export function render(location: string): string {
  return renderToString(
    createElement(StaticRouter, { location }, createElement(App)),
  );
}
