// Line icons drawn in code for every mockup icon slot (tabs, rows, buttons). They hold the place of the illustrated
// icons until the verified icon packs land in P5 (plan §8, §16); swapping one means changing one entry here.
// Each call returns a fresh decorative SVG; the control around it carries the accessible label.
const SVG_NS = "http://www.w3.org/2000/svg";

interface Shape {
  d?: string;
  circle?: [number, number, number];
  fill?: boolean;
}

function icon(shapes: Array<string | Shape>) {
  return (className = "icon") => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("class", className);
    for (const raw of shapes) {
      const shape: Shape = typeof raw === "string" ? { d: raw } : raw;
      const node = shape.circle ? document.createElementNS(SVG_NS, "circle") : document.createElementNS(SVG_NS, "path");
      if (shape.circle) {
        node.setAttribute("cx", String(shape.circle[0]));
        node.setAttribute("cy", String(shape.circle[1]));
        node.setAttribute("r", String(shape.circle[2]));
      } else node.setAttribute("d", shape.d ?? "");
      if (shape.fill) node.setAttribute("class", "fill");
      svg.append(node);
    }
    return svg;
  };
}

export type IconFactory = ReturnType<typeof icon>;

export const ICONS = {
  back: icon(["M15 5l-7 7 7 7"]),
  chevron: icon(["M9 5l7 7-7 7"]),
  gear: icon([
    { circle: [12, 12, 3.2] },
    "M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z",
  ]),
  lock: icon(["M7 11V8a5 5 0 0 1 10 0v3", "M5.5 11h13v9h-13z"]),
  // Bottom bar
  home: icon(["M3.5 11.5L12 4l8.5 7.5", "M6 10v10h12V10", "M10 20v-5h4v5"]),
  hammer: icon(["M14 4l6 6-2.5 2.5-6-6z", "M12.5 8.5L4 17l3 3 8.5-8.5"]),
  compass: icon([{ circle: [12, 12, 8.5] }, "M15.5 8.5l-2 5-5 2 2-5z"]),
  residents: icon([
    { circle: [9, 9, 3.2] },
    { circle: [16.5, 10, 2.6] },
    "M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5",
    "M14.5 15.5c2.6-.6 5 .8 6 3.5",
  ]),
  ticket: icon(["M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z", "M10 9.5c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5"]),
  // Header and cards
  mail: icon(["M4 6.5h16v11H4z", "M4.5 7l7.5 6 7.5-6"]),
  weather: icon(["M7 18h10a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4 4 0 0 0 7 18z"]),
  clock: icon([{ circle: [12, 12, 8.5] }, "M12 7.5V12l3 2"]),
  info: icon([{ circle: [12, 12, 8.5] }, "M12 11v5.5", "M12 7.6v.4"]),
  check: icon(["M5 12.5l4.5 4.5L19 7.5"]),
  eye: icon(["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z", { circle: [12, 12, 2.8] }]),
  image: icon(["M4 5h16v14H4z", { circle: [9, 10, 1.6] }, "M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5"]),
  landscape: icon(["M4 5h16v14H4z", "M4.5 17l5.5-6 4 4 2-2 3.5 4"]),
  document: icon(["M7 3.5h7l4 4V20.5H7z", "M14 3.5v4h4", "M9.5 12h6", "M9.5 15.5h6"]),
  folder: icon(["M3.5 7h6l2 2h9v10h-17z"]),
  book: icon(["M12 6.5c-2-1.3-4.7-1.6-8-1v13c3.3-.6 6-.3 8 1 2-1.3 4.7-1.6 8-1v-13c-3.3-.6-6-.3-8 1z", "M12 6.5v13"]),
  flower: icon([
    { circle: [12, 12, 2.4] },
    { circle: [12, 6.5, 2.6] },
    { circle: [17.2, 10.3, 2.6] },
    { circle: [15.2, 16.5, 2.6] },
    { circle: [8.8, 16.5, 2.6] },
    { circle: [6.8, 10.3, 2.6] },
  ]),
  people: icon([
    { circle: [8, 8.5, 2.8] },
    { circle: [16, 8.5, 2.8] },
    "M3 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6",
    "M11 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6",
  ]),
  pair: icon([{ circle: [9, 12, 4.5] }, { circle: [15, 12, 4.5] }]),
  upload: icon(["M12 15.5V4.5", "M7.5 9l4.5-4.5L16.5 9", "M5 14v5.5h14V14"]),
  download: icon(["M12 4.5v11", "M7.5 11l4.5 4.5 4.5-4.5", "M5 14v5.5h14V14"]),
  restore: icon(["M4.5 12a7.5 7.5 0 1 0 2.2-5.3", "M4.5 4.5v4h4"]),
  leaf: icon(["M5 19c0-8 5-13 14-14-1 9-6 14-14 14z", "M5 19l7-7"]),
  sprout: icon([
    "M12 20v-8",
    "M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6z",
    "M12 12c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z",
  ]),
  search: icon([{ circle: [10.5, 10.5, 6] }, "M15 15l5 5"]),
  jar: icon(["M8 4.5h8v3H8z", "M7 7.5h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z", "M9 14h6"]),
  box: icon(["M3.5 8l8.5-4 8.5 4v9l-8.5 4-8.5-4z", "M3.5 8l8.5 4 8.5-4", "M12 12v9"]),
  house: icon(["M4 11l8-6.5 8 6.5", "M6.5 9.5V19h11V9.5", "M10.5 19v-4.5h3V19"]),
  pencil: icon(["M15.5 4.5l4 4L9 19H5v-4z", "M13.5 6.5l4 4"]),
  swap: icon(["M5 9h12l-3-3", "M19 15H7l3 3"]),
  minus: icon(["M6 12h12"]),
  plus: icon(["M6 12h12", "M12 6v12"]),
  grip: icon([
    { circle: [9, 7, 1.2], fill: true },
    { circle: [15, 7, 1.2], fill: true },
    { circle: [9, 12, 1.2], fill: true },
    { circle: [15, 12, 1.2], fill: true },
    { circle: [9, 17, 1.2], fill: true },
    { circle: [15, 17, 1.2], fill: true },
  ]),
  menu: icon(["M5 8h14", "M5 12h14", "M5 16h14"]),
  // Residents
  filter: icon(["M4 5.5h16l-6 7.5v5.5l-4 1.5v-7z"]),
  heart: icon(["M12 19s-7-4.4-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 2.5C19 14.6 12 19 12 19z"]),
  sparkle: icon(["M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"]),
  zoom: icon([{ circle: [10.5, 10.5, 6] }, "M15 15l5 5", "M10.5 8v5", "M8 10.5h5"]),
  arrows: icon(["M4 12h16", "M7.5 8.5L4 12l3.5 3.5", "M16.5 8.5L20 12l-3.5 3.5"]),
  updown: icon(["M12 4v16", "M8.5 7.5L12 4l3.5 3.5", "M8.5 16.5L12 20l3.5-3.5"]),
  archive: icon(["M3.5 5h17v4h-17z", "M5 9v10h14V9", "M10 13h4"]),
  // Items and production
  berry: icon([
    { circle: [9, 13, 3.6] },
    { circle: [15, 13, 3.6] },
    { circle: [12, 17.5, 3.6] },
    "M12 9.5V5",
    "M12 6.5c1.5-1.8 3.5-2 5-1.5",
  ]),
  log: icon([{ circle: [7.5, 12, 3.8] }, "M7.5 8.2h11a3.8 3.8 0 0 1 0 7.6h-11", { circle: [7.5, 12, 1.3] }]),
  hourglass: icon(["M7 4h10", "M7 20h10", "M8 4c0 5 8 5 8 8s-8 3-8 8", "M16 4c0 5-8 5-8 8s8 3 8 8"]),
  up: icon(["M6 15l6-6 6 6"]),
  down: icon(["M6 9l6 6 6-6"]),
  addImage: icon([
    "M6 3.5h8l4 4v13H6z",
    "M14 3.5v4h4",
    "M9 16l2.5-3 2 2 1-1.2",
    { circle: [17.5, 17.5, 3.5] },
    "M17.5 16v3",
    "M16 17.5h3",
  ]),
  // Items (until the illustrated item icons of P5)
  acorn: icon(["M6 10.5h12a6 6 0 0 1-12 0z", "M5.5 10.5c0-3 3-4.5 6.5-4.5s6.5 1.5 6.5 4.5z", "M12 6V3.5"]),
  pinecone: icon(["M12 3.5c3.5 3 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 1.5-7 5-10z", "M8 11h8", "M7.5 15h9", "M10 7.5h4"]),
  feather: icon(["M19 4.5C11 5 6 10 5.5 19.5", "M19 4.5c.5 7-4 12-11 12.5", "M9 14l4-4"]),
  pumpkin: icon(["M12 7.5c-4.5 0-7 2.8-7 6s2.5 6 7 6 7-2.8 7-6-2.5-6-7-6z", "M12 7.5v12", "M12 7.5c0-2 1-3.5 2.5-4"]),
  candle: icon(["M9 9.5h6v10.5H9z", "M12 9.5V7", "M12 3.5c1.3 1.3 1.3 2.7 0 3.5-1.3-.8-1.3-2.2 0-3.5z"]),
  cup: icon([
    "M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z",
    "M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16",
    "M9 4.5c0 1.5 1 1.5 1 3",
    "M12.5 4.5c0 1.5 1 1.5 1 3",
  ]),
  cake: icon(["M5 12h14v8H5z", "M5 15.5c2.3 1.4 4.7 1.4 7 0s4.7-1.4 7 0", "M12 12V8.5", { circle: [12, 6.5, 1.4] }]),
  scarf: icon(["M6 5h12v5H6z", "M13 10v9l3-1V10", "M8 7.5h1M11 7.5h1M14 7.5h1"]),
  wheat: icon([
    "M12 20.5V7",
    "M12 7c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 7c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z",
    "M12 12c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 12c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z",
    "M12 17c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 17c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z",
  ]),
  clover: icon([
    { circle: [9.5, 9.5, 2.8] },
    { circle: [14.5, 9.5, 2.8] },
    { circle: [9.5, 14.5, 2.8] },
    { circle: [14.5, 14.5, 2.8] },
    "M14 17l3.5 4",
  ]),
  spool: icon(["M7 4.5h10", "M7 19.5h10", "M9 4.5v15", "M15 4.5v15", "M9 8l6 3M9 12l6 3"]),
  mushroom: icon(["M4.5 12a7.5 7.5 0 0 1 15 0z", "M10 12v6.5a2 2 0 0 0 4 0V12"]),
};
