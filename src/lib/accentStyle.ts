import type { CSSProperties } from "react";

/**
 * Inline style that exposes a project's brand color as --project-accent.
 * Returns undefined when the project has no accent, so the CSS fallback
 * (var(--project-accent, var(--accent))) lands on the site teal.
 */
export function accentStyle(accent?: string): CSSProperties | undefined {
  if (!accent) return undefined;
  return { "--project-accent": accent } as CSSProperties;
}
