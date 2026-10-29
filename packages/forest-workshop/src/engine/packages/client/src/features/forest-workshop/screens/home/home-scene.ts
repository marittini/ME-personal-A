// The home scene (board 01-1): the workshop under the trees, with residents standing on the path. Layers follow
// plan §8 (background → seasonal props → up to two residents → emotion marks → weather → DOM UI). The background is
// the current season's workshop picture (assets/backgrounds/workshop-scene-<season>.webp); the drawing in code below
// stands in only if that file cannot load. Recruited residents stand in the two places,
// drawn from their own picture and placement; before the starting resident is chosen the first place invites the
// player to 주민 등록, and a place still empty waits for invitations (P3).
import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import type { Resident, WorldState } from "../../app/types";
import { BACKGROUND_ART, assetImage } from "../../app/assets";
import { currentSeason } from "../../app/controller";
import { ICONS } from "../chrome/icons";
import { residentFigure } from "../residents/resident-figure";

import { editingGround, groundOverlay } from "./ground-editor";

const SVG_NS = "http://www.w3.org/2000/svg";

/** The drawn stand-in for the scene, used only if the season's picture cannot load. */
function drawnBackdrop() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 390 300");
  svg.setAttribute("preserveAspectRatio", "xMidYMax slice");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "scene-art");
  // Storybook look: flat fills, one dark-brown outline (#4b2e1a, 3 units), no gradients or soft transparency.
  svg.innerHTML = `
    <g stroke="#4b2e1a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect width="390" height="300" fill="#cfe5c0" stroke="none"/>
      <path d="M-10 70 Q20 10 70 30 Q100 -10 150 20 L150 -10 H-10z" fill="#8fbf6e"/>
      <path d="M400 80 Q370 20 320 40 Q300 -5 250 15 L250 -10 H400z" fill="#e2a55a"/>
      <circle cx="60" cy="120" r="34" fill="#8fbf6e"/>
      <circle cx="335" cy="115" r="30" fill="#8fbf6e"/>
      <path d="M-5 215 Q100 188 200 203 T395 198 V305 H-5z" fill="#a9cc86"/>
      <g transform="translate(150 70)">
        <rect x="0" y="62" width="170" height="108" rx="6" fill="#b98250"/>
        <rect x="10" y="74" width="150" height="96" fill="#dcb07c"/>
        <path d="M-22 70 L85 8 L192 70 Z" fill="#3f8a86"/>
        <path d="M10 62 L85 20 L160 62" fill="none" stroke-width="2.5"/>
        <rect x="66" y="104" width="38" height="66" rx="4" fill="#7a4b2a"/>
        <rect x="20" y="96" width="34" height="30" rx="3" fill="#f8de98"/>
        <rect x="116" y="96" width="34" height="30" rx="3" fill="#f8de98"/>
        <rect x="56" y="78" width="58" height="18" rx="3" fill="#f6e9cb"/>
        <circle cx="147" cy="84" r="7" fill="#f5c45c"/>
      </g>
      <path d="M150 305 Q190 240 235 240 Q280 240 302 305z" fill="#ead6a8"/>
      <circle cx="40" cy="232" r="25" fill="#6fa452"/><circle cx="76" cy="248" r="19" fill="#6fa452"/>
      <circle cx="350" cy="232" r="23" fill="#6fa452"/><circle cx="318" cy="250" r="17" fill="#6fa452"/>
      <g stroke-width="2"><circle cx="30" cy="224" r="4" fill="#fff6e4"/><circle cx="54" cy="240" r="4" fill="#fff6e4"/>
      <circle cx="345" cy="226" r="4" fill="#fff6e4"/><circle cx="326" cy="246" r="4" fill="#fff6e4"/>
      <circle cx="70" cy="232" r="4" fill="#d5a9e3"/><circle cx="360" cy="246" r="4" fill="#d5a9e3"/></g>
    </g>`;
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
        attrs: { type: "button", "aria-label": `${resident.displayName} 프로필 보기` },
        on: {
          click: () => {
            controller.openResidents(resident.residentId);
            controller.openSheet({ kind: "profile", residentId: resident.residentId });
          },
        },
      },
      [residentFigure(resident)],
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
  // An empty place in the workshop: 초대 brings the next resident.
  return h(
    "button",
    {
      className: `resident-spot ${side}`,
      attrs: { type: "button", "aria-label": "빈 자리 — 초대로 새 주민 맞이하기" },
      on: { click: () => controller.navigate("invite") },
    },
    [h("span", { className: "spot-shadow" }), h("span", { className: "spot-text", text: "초대" })],
  );
}

export function renderHomeScene(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value.state : null;
  const residents = world ? sceneResidents(world) : [];
  const ground = world?.settings.ground ?? { left: 12, right: 88, top: 58, bottom: 90 };
  const cast = world
    ? h("div", { className: "scene-stage ground-stage" }, [
        spot("left", residents[0] ?? null, world, controller),
        spot("right", residents[1] ?? null, world, controller),
      ])
    : null;
  if (cast)
    cast.style.cssText = `left:${ground.left}%;top:${ground.top}%;width:${ground.right - ground.left}%;height:${ground.bottom - ground.top}%;right:auto;bottom:auto;padding:0;`;
  return h(
    "section",
    { className: `scene${editingGround(state) ? " editing-ground" : ""}`, attrs: { "aria-label": "공방 장면" } },
    [
      // Layers (plan §8): the season's workshop picture → residents (their own picture) → DOM UI.
      assetImage(BACKGROUND_ART[currentSeason(state)].scene, { className: "scene-art", fallback: drawnBackdrop }),
      cast,
      editingGround(state)
        ? groundOverlay(state, controller, cast)
        : world
          ? h(
              "button",
              {
                className: "ground-launch icon-button",
                attrs: { type: "button", "aria-label": "지면 편집", title: "지면 편집" },
                on: { click: () => controller.openGroundEditor() },
              },
              [ICONS.pencil("icon")],
            )
          : null,
      // With a resident standing here the empty place speaks for itself; the caption would sit under their name.
      residents.length === 0
        ? h("p", { className: "scene-caption" }, [ICONS.leaf("icon tiny"), "주민을 맞이하면 이곳에 모여요"])
        : null,
    ],
  );
}
