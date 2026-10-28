import type { Segment } from "./types";

/** Keep every code point, including whitespace, while bounding the length of a dialogue page. */
export function storyTextPages(segment: Segment | undefined): string[] {
  if (!segment || segment.kind === "choice") return [];
  const characters = Array.from(segment.text);
  const pages: string[] = [];
  for (let i = 0; i < characters.length; i += 52) pages.push(characters.slice(i, i + 52).join(""));
  return pages;
}
