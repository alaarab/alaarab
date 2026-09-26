import type { LeafForm } from "./grower";

/**
 * A small field note per specimen. Habitat and flowering lines are written as
 * a naturalist's shorthand for facts already in siteContent, never new claims.
 */
export interface SpecimenNote {
  habitat: string;
  flowering: string;
  form: LeafForm;
  /** Wash hue when the project has no accent of its own. */
  hue?: string;
}

export const notes: Record<string, SpecimenNote> = {
  phren: {
    habitat: "Wherever an agent works. Rooted in a git repository its keeper owns.",
    flowering: "Every session, on seven surfaces at once.",
    form: "elliptic",
  },
  ogrid: {
    habitat: "Grows inside other tables, on whatever UI library is already there.",
    flowering: "In rows and columns, 2026.",
    form: "obovate",
  },
  "m4l-builder": {
    habitat: "A Python script, transplanted into an Ableton User Library.",
    flowering: "When the device loads in Live.",
    form: "lanceolate",
  },
  livemcp: {
    habitat: "Alongside Ableton Live, reached across a local bridge.",
    flowering: "During a session, on macOS, Windows, and WSL.",
    form: "lanceolate",
  },
  intrapath: {
    habitat: "Raised from a cutting of Intranet, in fresh ground.",
    flowering: "Not yet. In active development.",
    form: "ovate",
  },
  atlas: {
    habitat: "The browser, the editor, and a folder on disk, all at once.",
    flowering: "Stable, 2026.",
    form: "elliptic",
  },
  basis: {
    habitat: "Fourteen chains and four exchanges. Every leaf traced back to its root.",
    flowering: "In private beta.",
    form: "ovate",
  },
  mina: {
    habitat: "Two phones on a nightstand. Nothing leaves them.",
    flowering: "Nightly, and at 3 AM.",
    form: "obovate",
  },
  mutter: {
    habitat: "Five platforms, wherever a Mumble server is already running.",
    flowering: "Whenever someone joins and talks.",
    form: "linear",
  },
  "intranet-erp": {
    habitat: "One company's ground for a decade. Long-lived, perennial.",
    flowering: "2013 to 2023, and licensed beyond the company.",
    form: "ovate",
    hue: "#8a6a3a",
  },
  emv: {
    habitat: "Beside Intranet, in looser, document-shaped soil.",
    flowering: "2014 to 2025.",
    form: "linear",
  },
  "equipment-tracker": {
    habitat: "Lab benches and field kits, once kept in spreadsheets.",
    flowering: "2018 to 2025.",
    form: "elliptic",
  },
  alphalens: {
    habitat: "Busy Discord servers, where the charts are posted inline.",
    flowering: "Active since 2025.",
    form: "lanceolate",
  },
  "garden-sensor-network": {
    habitat: "Collected in a learning-center garden in San Diego, among light, temperature, and moisture sensors.",
    flowering: "2011.",
    form: "ovate",
    hue: "#5f7f4f",
  },
  "retrofit-program-data-tools": {
    habitat: "Field crews and iPads, for a retrofit program in Maryland.",
    flowering: "2012 to 2013.",
    form: "obovate",
    hue: "#8a7a5a",
  },
};

export const noteFor = (slug: string): SpecimenNote =>
  notes[slug] ?? { habitat: "", flowering: "", form: "elliptic" };
