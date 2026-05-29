interface SkipLinkProps {
  /** id of the landmark to jump to. Defaults to the page's main content. */
  targetId?: string;
}

/**
 * Keyboard/screen-reader affordance: a visually hidden link that surfaces on
 * focus and jumps past the header to the page's main content. Styled by the
 * global `.skip-link` rule.
 */
export function SkipLink({ targetId = "main" }: SkipLinkProps) {
  return (
    <a className="skip-link" href={`#${targetId}`}>
      Skip to content
    </a>
  );
}
