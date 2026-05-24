import { Link } from "react-router";
import type { ActionLink } from "../types";

interface ActionLinksProps {
  links: ActionLink[];
  className?: string;
}

/**
 * Renders a row of links. Internal paths use the router; http and mailto
 * links stay as plain anchors, with external targets opening in a new tab.
 */
export function ActionLinks({ links, className }: ActionLinksProps) {
  return (
    <div className={className}>
      {links.map((link) => {
        if (link.href.startsWith("/")) {
          return (
            <Link key={link.label} to={link.href}>
              {link.label}
            </Link>
          );
        }

        const external = link.href.startsWith("http");
        return (
          <a
            key={link.label}
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer noopener" : undefined}
            aria-label={
              external ? `${link.label} (opens in a new tab)` : undefined
            }
          >
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
