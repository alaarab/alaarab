import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import "./styles/globals.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element in index.html");
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production HTML is prerendered with server markup to hydrate; the dev server
// ships an empty shell, so fall back to a fresh client render there.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
