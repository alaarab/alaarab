import { posts } from "../data/posts";
import type { Post, PostBlock } from "../types";

const byDateDesc = (a: Post, b: Post) =>
  b.date.localeCompare(a.date) || a.title.localeCompare(b.title);

/** Published posts, newest first. Drafts never appear here. */
export const publishedPosts: Post[] = posts
  .filter((post) => !post.draft)
  .sort(byDateDesc);

export const hasPublishedPosts = publishedPosts.length > 0;

export const blogPath = (slug: string) => `/blog/${slug}`;

export const postBySlug = (slug: string | undefined): Post | undefined =>
  publishedPosts.find((post) => post.slug === slug);

/** A draft, for the ?preview view only. */
export const draftBySlug = (slug: string | undefined): Post | undefined =>
  posts.find((post) => post.draft && post.slug === slug);

/** The published posts either side of this one: newer and older. */
export function postNeighbours(slug: string) {
  const k = publishedPosts.findIndex((post) => post.slug === slug);
  if (k < 0) return {};
  return { newer: publishedPosts[k - 1], older: publishedPosts[k + 1] };
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-09-27" → "September 27, 2026". Fixed format, so server and client agree. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** Text with the inline marks removed: [label](href) → label, `code` → code. */
export const stripMarks = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1").replace(/`([^`]+)`/g, "$1");

function blockText(block: PostBlock): string {
  switch (block.type) {
    case "list":
      return block.items.join(" ");
    case "code":
      return block.code;
    default:
      return block.text;
  }
}

/** Whole minutes at 220 words a minute, at least one. */
export function readingMinutes(post: Post): number {
  const words = post.body
    .map((block) => stripMarks(blockText(block)))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** An anchor id from heading text. */
export const headingId = (text: string) =>
  stripMarks(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
