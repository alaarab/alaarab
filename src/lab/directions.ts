/**
 * Design-direction prototypes (branch design/creative-directions only).
 * Each direction renders the real content from src/data/siteContent.ts.
 */
export interface Direction {
  key: "rack" | "ledger" | "transit";
  name: string;
  concept: string;
  sampleProject: string;
}

export const directions: Direction[] = [
  {
    key: "rack",
    name: "A · Device Rack",
    concept: "The portfolio as a hardware rack: every project is a device with a faceplate, LEDs, and readouts.",
    sampleProject: "m4l-builder",
  },
  {
    key: "ledger",
    name: "B · Ledger",
    concept: "The portfolio as a reconciled ledger: one dense, sortable index where every claim traces to a line.",
    sampleProject: "basis",
  },
  {
    key: "transit",
    name: "C · Transit Map",
    concept: "The portfolio as a transit map: each line of work is a colored line through time, projects are its stations.",
    sampleProject: "phren",
  },
];

export const labPath = (key: Direction["key"], slug?: string) =>
  slug ? `/lab/${key}/projects/${slug}` : `/lab/${key}`;
