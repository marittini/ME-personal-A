import type { Segment } from "./types";

/** The unmeasured fallback keeps the full segment accessible until the reader measures its panel. */
export function storyTextPages(segment: Segment | undefined): string[] {
  return !segment || segment.kind === "choice" ? [] : [segment.text];
}

function graphemes(text: string): string[] {
  return typeof Intl.Segmenter === "function"
    ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (part) => part.segment)
    : Array.from(text);
}

/** Split only when necessary, preserving text and preferring natural sentence or word boundaries. */
export function paginateStoryText(text: string, fits: (value: string) => boolean): string[] {
  const chars = graphemes(text);
  const pages: string[] = [];
  for (let start = 0; start < chars.length;) {
    let low = 1;
    let high = chars.length - start;
    let best = 0;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (fits(chars.slice(start, start + mid).join(""))) {
        best = mid;
        low = mid + 1;
      } else high = mid - 1;
    }
    // A single character can exceed the panel at extreme zoom; retain it and allow scrolling.
    let end = start + Math.max(1, best);
    if (end < chars.length) {
      const minimum = start + Math.floor((end - start) * 0.6);
      const candidate = chars.slice(minimum, end).join("");
      const boundaries = [...candidate.matchAll(/[.!?。！？…]+[”’"')\]]*\s*|\n+|\s+/gu)];
      const sentences = boundaries.filter((match) => /[.!?。！？…\n]/u.test(match[0]));
      const boundary = (sentences.length ? sentences : boundaries).at(-1);
      if (boundary?.index !== undefined)
        end = minimum + graphemes(candidate.slice(0, boundary.index + boundary[0].length)).length;
    }
    pages.push(chars.slice(start, end).join(""));
    start = end;
  }
  return pages.length ? pages : [""];
}

/** Measure using the rendered panel and restore its visible text before returning. */
export function measureStoryPages(box: HTMLElement, text: string): string[] | null {
  const line = box.querySelector<HTMLElement>(".line, .narration");
  if (!line || !box.clientWidth || !box.clientHeight) return null;
  const style = getComputedStyle(box);
  const speaker = box.querySelector<HTMLElement>(".speaker-tag");
  const available =
    box.clientHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom) -
    (speaker ? speaker.getBoundingClientRect().height + (parseFloat(style.rowGap) || 0) : 0);
  const original = line.textContent;
  try {
    return paginateStoryText(text, (value) => {
      line.textContent = value;
      return line.getBoundingClientRect().height <= available + 0.5;
    });
  } finally {
    line.textContent = original;
  }
}
