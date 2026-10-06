import type { PostBlock } from "../types";

/**
 * Turn a post's source text into blocks. The syntax is a small markdown subset:
 *
 *   A blank line separates blocks. Lines of one paragraph are joined.
 *   ## Heading            ### Smaller heading
 *   - item  (or * item)   1. item
 *   > quoted line         > -- who said it   (last line, optional)
 *   ```ts                 a fenced code block, blank lines kept, until ```
 *
 * Inline, only [label](href) and `code` mean anything; see Inline in Blog.tsx.
 */
export function parsePostSource(source: string): PostBlock[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: PostBlock[] = [];
  let k = 0;

  while (k < lines.length) {
    const line = lines[k];

    if (!line.trim()) {
      k += 1;
      continue;
    }

    const fence = line.match(/^```\s*([\w+-]*)\s*$/);
    if (fence) {
      const code: string[] = [];
      k += 1;
      while (k < lines.length && !/^```\s*$/.test(lines[k])) {
        code.push(lines[k]);
        k += 1;
      }
      k += 1; // the closing fence, or past the end
      blocks.push(fence[1] ? { type: "code", code: code.join("\n"), lang: fence[1] } : { type: "code", code: code.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      blocks.push({ type: heading[1].length === 2 ? "h2" : "h3", text: heading[2] });
      k += 1;
      continue;
    }

    // The rest of the block: every line up to a blank line, fence or heading.
    const group: string[] = [];
    while (k < lines.length && lines[k].trim() && !/^```/.test(lines[k]) && !/^#{2,3}\s/.test(lines[k])) {
      group.push(lines[k].trim());
      k += 1;
    }

    if (group.every((l) => /^[-*]\s+/.test(l))) {
      blocks.push({ type: "list", items: group.map((l) => l.replace(/^[-*]\s+/, "")) });
    } else if (group.every((l) => /^\d+[.)]\s+/.test(l))) {
      blocks.push({ type: "list", ordered: true, items: group.map((l) => l.replace(/^\d+[.)]\s+/, "")) });
    } else if (group.every((l) => l.startsWith(">"))) {
      const quoted = group.map((l) => l.replace(/^>\s?/, ""));
      const last = quoted[quoted.length - 1].match(/^(?:--|—)\s*(.+)$/);
      const text = (last ? quoted.slice(0, -1) : quoted).join(" ").trim();
      blocks.push(last && text ? { type: "quote", text, cite: last[1] } : { type: "quote", text: text || quoted.join(" ") });
    } else {
      blocks.push({ type: "p", text: group.join(" ") });
    }
  }

  return blocks;
}
