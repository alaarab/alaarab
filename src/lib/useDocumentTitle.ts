import { useEffect } from "react";

/** Sets document.title for the lifetime of the calling page. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
