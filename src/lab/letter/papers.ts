/**
 * Each project is a different piece of paper tucked into the envelope.
 * Showcase slugs (phren, m4l-builder, mina) have bespoke pages; this table
 * gives every other slug its own paper, ink, desk, and a line naming the paper.
 */
export type PaperKind =
  | "graph"
  | "studio"
  | "vellum"
  | "carbon"
  | "ledger"
  | "airmail"
  | "memo"
  | "catalog"
  | "tag"
  | "legal"
  | "packet"
  | "form";

export interface Paper {
  kind: PaperKind;
  /** Ink for text on this paper. All checked at 4.5:1 or better against the paper. */
  ink: string;
  /** Colour the small drawn mark is washed in. */
  wash: string;
  /** The desk under the paper. */
  desk: string;
  /** What the paper is, set small like a caption. */
  caption: string;
}

export const papers: Record<string, Paper> = {
  ogrid: { kind: "graph", ink: "#233328", wash: "#5f8f6c", desk: "#b9bea6", caption: "on graph paper" },
  livemcp: { kind: "studio", ink: "#1f3a4f", wash: "#5a8fae", desk: "#aeb8bc", caption: "a page from a studio notebook" },
  intrapath: { kind: "vellum", ink: "#2f3440", wash: "#c46a74", desk: "#b9b3ae", caption: "on tracing vellum, laid over the old memo" },
  atlas: { kind: "carbon", ink: "#1f3c3a", wash: "#4f9a91", desk: "#adbbb5", caption: "a carbon copy, torn from the ticket book" },
  basis: { kind: "ledger", ink: "#1e3a33", wash: "#a4453e", desk: "#b3bca8", caption: "on ruled accountant's paper" },
  mutter: { kind: "airmail", ink: "#262f48", wash: "#6d72b8", desk: "#b4b6c2", caption: "on airmail paper" },
  "intranet-erp": { kind: "memo", ink: "#2d2a22", wash: "#8a5a32", desk: "#bcb39c", caption: "from the company memo pad, well used" },
  emv: { kind: "catalog", ink: "#2e2a20", wash: "#7f9a4a", desk: "#bab7a0", caption: "on a filing card" },
  "equipment-tracker": { kind: "tag", ink: "#33291a", wash: "#3f8ea0", desk: "#b6b6a6", caption: "on a manila tag" },
  alphalens: { kind: "legal", ink: "#2b2a1c", wash: "#b8872c", desk: "#bab5a0", caption: "on a yellow legal pad" },
  "garden-sensor-network": { kind: "packet", ink: "#33271a", wash: "#6f9258", desk: "#b5bb9e", caption: "on the back of a seed packet" },
  "retrofit-program-data-tools": { kind: "form", ink: "#243326", wash: "#6c8a63", desk: "#b3b9a8", caption: "on a field form, second copy" },
};

export const fallbackPaper: Paper = {
  kind: "memo",
  ink: "#2d2a22",
  wash: "#8a5a32",
  desk: "#bcb39c",
  caption: "on a loose sheet",
};
