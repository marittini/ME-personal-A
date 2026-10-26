// The home scene (board 01-1): the workshop under the trees, with residents standing on the path. Layers follow
// plan §8 (background → seasonal props → up to two residents → emotion marks → weather → DOM UI). Until the verified
// background art arrives (P5) the background is this drawing in code; residents appear here from P2, so their two
// places are marked locked.
import type { Controller } from "../../app/controller";
import { h } from "../../app/dom";
import { featureButton } from "../chrome/locked";
import { ICONS } from "../chrome/icons";

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

export function renderHomeScene(controller: Controller) {
  return h("section", { className: "scene", attrs: { "aria-label": "공방 장면" } }, [
    backdrop(),
    h("div", { className: "scene-stage" }, [
      featureButton(controller, "residents", {
        className: "resident-spot left",
        label: "주민 자리",
        children: [h("span", { className: "spot-shadow" }), h("span", { className: "spot-text", text: "주민" })],
      }),
      featureButton(controller, "residents", {
        className: "resident-spot right",
        label: "주민 자리",
        children: [h("span", { className: "spot-shadow" }), h("span", { className: "spot-text", text: "주민" })],
      }),
    ]),
    h("p", { className: "scene-caption" }, [ICONS.leaf("icon tiny"), "주민을 초대하면 이곳에 모여요"]),
  ]);
}
