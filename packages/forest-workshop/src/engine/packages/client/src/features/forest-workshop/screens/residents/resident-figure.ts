// How a resident is drawn everywhere (home scene, 주민 cards, 관계 rows, 주민 그림 preview), from the one picture the
// player uploaded (plan §8: one picture per resident runs every feature). The placement (size, left/right position,
// marker height) is applied here at display time and is never baked into the file. Without a picture the resident
// keeps an ordinary slot with its name and "PNG 등록" — never a generated or profile-avatar stand-in (plan §8.1).
import { h } from "../../app/dom";
import type { Placement, Resident } from "../../app/types";

const SVG_NS = "http://www.w3.org/2000/svg";

function silhouette(className: string) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 60 80");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", className);
  svg.innerHTML = '<circle cx="30" cy="24" r="15"/><path d="M6 80c0-17 11-29 24-29s24 12 24 29z"/>';
  return svg;
}

function picture(resident: Resident, className: string) {
  const image = resident.image.current!;
  const node = h("img", {
    className,
    attrs: {
      // The reference changes with every new picture, so a cached old picture is never shown for a new one.
      src: `${image.url}${image.url.includes("?") ? "&" : "?"}v=${encodeURIComponent(image.reference)}`,
      alt: "",
      width: String(image.width),
      height: String(image.height),
      decoding: "async",
      draggable: "false",
    },
  });
  return node;
}

export function emotionPosition(placement: Placement) {
  return {
    bottom: Math.max(15, Math.min(82, 4 + placement.scale * 0.9 - 12 + placement.markerHeight * 0.4)),
    left: Math.max(10, Math.min(90, 50 + placement.offsetX * 0.5)),
  };
}

/**
 * The full-body figure on a stage. `placement` overrides the saved one (주민 그림 preview while sliding).
 * The stage is sized by its container; the figure stands on the stage's bottom edge.
 */
export function residentFigure(resident: Resident, options: { placement?: Placement; marker?: boolean } = {}) {
  const placement = options.placement ?? resident.image.placement;
  const stage = h("span", { className: "figure", attrs: { "aria-hidden": "true" } });
  if (!resident.image.current) {
    stage.append(
      h("span", { className: "figure-empty" }, [
        silhouette("figure-silhouette"),
        h("span", { className: "figure-empty-text", text: "PNG 등록" }),
      ]),
    );
  } else {
    const body = h("span", { className: "figure-body" }, [picture(resident, "figure-image")]);
    body.style.height = `${placement.scale * 0.9}%`;
    body.style.left = `${50 + placement.offsetX * 0.5}%`;
    stage.append(body);
  }
  if (options.marker) {
    const marker = h("span", { className: "emotion-bubble", text: "?" });
    const position = emotionPosition(placement);
    marker.style.bottom = `${position.bottom}%`;
    marker.style.left = `${position.left}%`;
    stage.append(marker);
  }
  return stage;
}

/** The round face used in lists (관계 rows, 페어 추가): a display crop of the same picture; the file is unchanged. */
export function residentAvatar(resident: Resident | null, size: "small" | "large" = "small") {
  const frame = h("span", { className: `avatar ${size}`, attrs: { "aria-hidden": "true" } });
  if (resident?.image.current) frame.append(picture(resident, "avatar-image"));
  else {
    frame.append(silhouette("avatar-silhouette"));
    if (!resident) frame.append(h("span", { className: "avatar-unknown", text: "?" }));
  }
  return frame;
}

export const KIND_LABEL = { character: "캐릭터", persona: "페르소나" } as const;

export function kindTag(resident: Pick<Resident, "kind">) {
  return h("span", { className: `tag ${resident.kind}`, text: KIND_LABEL[resident.kind] });
}
