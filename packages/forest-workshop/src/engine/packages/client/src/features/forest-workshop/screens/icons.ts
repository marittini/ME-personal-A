// Small line icons drawn in code (no third-party icon packs: plan §8 requires a licence check for those, which
// arrives with the asset work in P5). Each call returns a fresh decorative SVG; the button around it carries the label.
const SVG_NS = "http://www.w3.org/2000/svg";

function icon(paths: string[], viewBox = "0 0 24 24") {
  return () => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("class", "icon");
    for (const d of paths) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      svg.append(path);
    }
    return svg;
  };
}

export const ICONS = {
  back: icon(["M15 5l-7 7 7 7"]),
  chevron: icon(["M9 5l7 7-7 7"]),
  gear: icon([
    "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
    "M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z",
  ]),
  upload: icon(["M12 16V4", "M7 9l5-5 5 5", "M5 20h14"]),
  download: icon(["M12 4v12", "M7 11l5 5 5-5", "M5 20h14"]),
  check: icon(["M5 12.5l4.5 4.5L19 7.5"]),
  info: icon(["M12 11v6", "M12 7.5v.5", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"]),
};
