import { useEffect } from "react";
import { useLocation } from "react-router";

/** Resets scroll on navigation, but leaves in-page anchor jumps alone. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
