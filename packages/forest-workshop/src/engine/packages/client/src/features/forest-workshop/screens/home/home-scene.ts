// The home scene (board 01-1): the workshop under the trees, with residents standing on the path. Layers follow
// plan §8 (background → seasonal props → up to two residents → emotion marks → weather → DOM UI). Until the verified
// background art arrives (P5) the background is this drawing in code. Recruited residents stand in the two places,
// drawn from their own picture and placement; before the starting resident is chosen the first place invites the
// player to 주민 등록, and a place still empty waits for invitations (P3).
import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import type { Resident, WorldState } from "../../app/types";
import { featureButton } from "../chrome/locked";
import { ICONS } from "../chrome/icons";
import { residentFigure } from "../residents/resident-figure";

const SVG_NS = "http://www.w3.org/2000/svg";

/** One SVG drawing of the workshop scene; purely decorative. */
function backdrop() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 390 300");
  svg.setAttribute("preserveAspectRatio", "xMidYMax slice");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "scene-art");
  svg.innerHTML = `
    <defs>
      <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3c2"/><stop offset="1" stop-color="#eef0d2"/></linearGradient>
      <linearGradient id="fw-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f8a86"/><stop offset="1" stop-color="#2c6b68"/></linearGradient>
    </defs>
    <rect width="390" height="300" fill="url(#fw-sky)"/>
    <circle cx="40" cy="40" r="70" fill="#7ea866" opacity=".55"/><circle cx="360" cy="30" r="80" fill="#d9a05a" opacity=".5"/>
    <circle cx="330" cy="70" r="55" fill="#8bb26d" opacity=".55"/><circle cx="80" cy="95" r="45" fill="#9cbf78" opacity=".6"/>
    <path d="M0 215 Q100 190 200 205 T390 200 V300 H0z" fill="#9bbd7a"/>
    <g transform="translate(150 70)">
      <rect x="0" y="62" width="170" height="108" rx="6" fill="#a87a4e"/>
      <rect x="10" y="74" width="150" height="96" fill="#c99a69"/>
      <path d="M-22 70 L85 8 L192 70 Z" fill="url(#fw-roof)"/>
      <rect x="66" y="104" width="38" height="66" rx="4" fill="#6e4628"/>
      <rect x="20" y="96" width="34" height="30" rx="3" fill="#f6dc94"/><rect x="116" y="96" width="34" height="30" rx="3" fill="#f6dc94"/>
      <rect x="58" y="80" width="54" height="16" rx="3" fill="#f3e6c6"/>
      <circle cx="148" cy="84" r="7" fill="#f5c45c"/>
    </g>
    <path d="M150 300 Q190 240 235 240 Q280 240 300 300z" fill="#dccaa0"/>
    <g fill="#5d8f47"><circle cx="40" cy="230" r="26"/><circle cx="75" cy="245" r="20"/><circle cx="350" cy="232" r="24"/><circle cx="320" cy="250" r="18"/></g>
    <g fill="#fff6e4"><circle cx="30" cy="222" r="3"/><circle cx="52" cy="238" r="3"/><circle cx="345" cy="226" r="3"/><circle cx="327" cy="244" r="3"/></g>
    <g fill="#c9a0d8"><circle cx="70" cy="232" r="3"/><circle cx="360" cy="244" r="3"/></g>`;
  return svg;
}

/** Up to two recruited residents, the starting resident first. */
function sceneResidents(world: WorldState): Resident[] {
  const starter = world.progress.starterResidentId;
  return Object.values(world.residents)
    .filter((resident) => resident.recruited)
    .sort(
      (a, b) =>
        Number(b.residentId === starter) - Number(a.residentId === starter) ||
        a.registeredAt.localeCompare(b.registeredAt),
    )
    .slice(0, 2);
}

function spot(side: "left" | "right", resident: Resident | null, world: WorldState, controller: Controller) {
  if (resident) {
    return h(
      "button",
      {
        className: `resident-spot filled ${side}`,
        attrs: { type: "button", "aria-label": `${resident.displayName} 보기` },
        on: { click: () => controller.openResidents(resident.residentId) },
      },
      [residentFigure(resident), h("span", { className: "spot-name", text: resident.displayName })],
    );
  }
  if (world.progress.starterResidentId === null && side === "left") {
    const registered = Object.keys(world.residents).length > 0;
    return h(
      "button",
      {
        className: `resident-spot invite ${side}`,
        attrs: { type: "button" },
        on: { click: () => controller.openRegister(registered ? 3 : 1) },
      },
      [
        h("span", { className: "spot-shadow" }),
        h("span", { className: "spot-text", text: registered ? "시작 주민 고르기" : "주민 맞이하기" }),
      ],
    );
  }
  return featureButton(controller, "invite", {
    className: `resident-spot ${side}`,
    label: "주민 자리",
    children: [h("span", { className: "spot-shadow" }), h("span", { className: "spot-text", text: "주민" })],
  });
}

export function renderHomeScene(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value.state : null;
  const residents = world ? sceneResidents(world) : [];
  return h("section", { className: "scene", attrs: { "aria-label": "공방 장면" } }, [
    backdrop(),
    world
      ? h("div", { className: "scene-stage" }, [
          spot("left", residents[0] ?? null, world, controller),
          spot("right", residents[1] ?? null, world, controller),
        ])
      : null,
    // With a resident standing here the empty place speaks for itself; the caption would sit under their name.
    residents.length === 0
      ? h("p", { className: "scene-caption" }, [ICONS.leaf("icon tiny"), "주민을 맞이하면 이곳에 모여요"])
      : null,
  ]);
}
