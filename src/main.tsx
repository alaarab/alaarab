import { StrictMode, useEffect, useState } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { BlogDataContext, readBlogPayload } from "./site/blogData";
import "./styles/globals.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element in index.html");
}

function ClientApp() {
  const [payload, setPayload] = useState(readBlogPayload);
  // The initial page already captured the payload during hydration.
  useEffect(() => setPayload(null), []);

  return (
    <BlogDataContext.Provider value={payload}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BlogDataContext.Provider>
  );
}

const app = (
  <StrictMode>
    <ClientApp />
  </StrictMode>
);

// Production HTML is prerendered with server markup to hydrate; the dev server
// ships an empty shell, so fall back to a fresh client render there.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
