/**
 * Design-direction prototypes (branch design/creative-directions only).
 * Each direction renders the real content from src/data/siteContent.ts.
 */
export interface Direction {
  key: string;
  name: string;
  concept: string;
}

/** Projects whose pages each round-2 direction themes to the project itself. */
export const showcaseSlugs = ["phren", "m4l-builder", "mina"] as const;

/** Round 2: soft, painted, bookish. Owner feedback on round 1 was "too busy". */
export const directions: Direction[] = [
  {
    key: "hillside",
    name: "Hillside",
    concept: "A painted hillside under a sky that follows your local time of day.",
  },
  {
    key: "folio",
    name: "Folio",
    concept: "A cloth-bound book: a stamped cover, a title page, and a chapter for each project.",
  },
  {
    key: "embroidery",
    name: "Embroidery",
    concept: "A long band of stitched linen, with one small embroidered emblem per project.",
  },
  {
    key: "specimens",
    name: "Specimens",
    concept: "A naturalist's sketchbook: each project is a drawn plate, grown from its own data.",
  },
  {
    key: "letter",
    name: "Letter",
    concept: "A letter from Ala, where each project unfolds from the sentence that mentions it.",
  },
  {
    key: "map",
    name: "Map",
    concept: "A sparse, hand-inked map of the country the work lives in, washed in watercolor.",
  },
  {
    key: "inkwash",
    name: "Ink Wash",
    concept: "Rice paper, one ink-wash mountain, a red seal, and a great deal of quiet.",
  },
  {
    key: "woodcut",
    name: "Woodcut",
    concept: "Hand-carved prints in two or three inks, with one block cut for each project.",
  },
  {
    key: "workshop",
    name: "Workshop",
    concept: "An illustrated workroom in afternoon light, where the objects on the desk are the projects.",
  },
  {
    key: "almanac",
    name: "Almanac",
    concept: "An old sky almanac: engraved gold on soft indigo, with each project a small star.",
  },
];

/** Round 1, kept for reference (rejected as busy and blocky). */
export const round1: Direction[] = [
  { key: "rack", name: "Device Rack", concept: "Round 1: projects as hardware devices." },
  { key: "ledger", name: "Ledger", concept: "Round 1: a sortable ledger index." },
  { key: "transit", name: "Transit Map", concept: "Round 1: lines of work as a transit map." },
];

export const labPath = (key: string, slug?: string) =>
  slug ? `/lab/${key}/projects/${slug}` : `/lab/${key}`;
