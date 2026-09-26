/**
 * Per-project moods for the inset maps. Each slug gets a place name, a caption in the
 * map's own voice, and a shift of the country palette.
 */

export const FONTS =
  "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&display=swap";

export interface Mood {
  /** What the place is, as it would be lettered on the inset. */
  place: string;
  /** Page ground and the three washes used in the inset. */
  paper: string;
  washA: string;
  washB: string;
  washC: string;
  /** Night pages invert to pale ink on a dark wash. */
  night?: boolean;
}

const country = { paper: "#efe4cc", washA: "#a9b58a", washB: "#d9c08e", washC: "#8fa3a8" };

export const moods: Record<string, Mood> = {
  phren: { place: "The walled library", paper: "#ece3d3", washA: "#b3a6c4", washB: "#d8c69c", washC: "#9aa7b4" },
  "m4l-builder": { place: "The mill on the stream", paper: "#f0e2c4", washA: "#d4a25c", washB: "#a9b58a", washC: "#8fa6a6" },
  mina: { place: "A cottage on the shore", paper: "#1f2340", washA: "#353b6b", washB: "#4a5288", washC: "#2a2f58", night: true },
  basis: { place: "The customs house", paper: "#ebe4cf", washA: "#8fb0a6", washB: "#d6c496", washC: "#8fa3a8" },
  "intranet-erp": { place: "The old market town", paper: "#eee1c6", washA: "#c9a57c", washB: "#a9b58a", washC: "#b9a58c" },
  intrapath: { place: "The new town by the old road", paper: "#f0e4cf", washA: "#d6a79c", washB: "#a9b58a", washC: "#d9c08e" },
  atlas: { place: "The lighthouse", paper: "#e9e3d0", washA: "#86aba6", washB: "#d9c08e", washC: "#8fa3a8" },
  ogrid: { place: "The enclosed fields", paper: "#ede6cc", washA: "#9fb780", washB: "#c9c48a", washC: "#8fa3a8" },
  livemcp: { place: "The bridge", paper: "#ebe4d2", washA: "#93b1c2", washB: "#a9b58a", washC: "#8fa3a8" },
  mutter: { place: "The bell tower", paper: "#ebe3d3", washA: "#a8a8c8", washB: "#a9b58a", washC: "#c4b49a" },
  emv: { place: "The old barn", paper: "#eee3c9", washA: "#b9b26e", washB: "#d9c08e", washC: "#a9b58a" },
  "equipment-tracker": { place: "The tool house", paper: "#ebe3cf", washA: "#8fb0b4", washB: "#c9b28c", washC: "#a9b58a" },
  alphalens: { place: "The watchtower", paper: "#efe3c8", washA: "#dcb46a", washB: "#8fa3a8", washC: "#a9b58a" },
  "garden-sensor-network": { place: "The garden plot", paper: "#ede5cb", washA: "#98b57e", washB: "#c4a37a", washC: "#a9b58a" },
  "retrofit-program-data-tools": { place: "The row of old houses", paper: "#ede2cc", washA: "#bca58f", washB: "#a9b58a", washC: "#8fa3a8" },
};

export const moodFor = (slug: string): Mood =>
  moods[slug] ?? { place: "An unmapped place", ...country };
