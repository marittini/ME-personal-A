// Locked mockup elements: same place and shape as the final design, visibly marked 준비 중, and a tap says which
// phase opens them. They never pretend to work. Unlocking is done in app/features.ts.
import type { Controller } from "../../app/controller";
import { h, type Child } from "../../app/dom";
import { isLocked, lockedPhase, type LockedFeature } from "../../app/features";
import { ICONS } from "./icons";

/** The small "🔒 P3" tag placed on a locked element. */
export function lockTag(feature: LockedFeature) {
  return h("span", { className: "lock-tag", attrs: { "aria-hidden": "true" } }, [
    ICONS.lock("icon tiny"),
    lockedPhase(feature),
  ]);
}

/**
 * A button that is real when its feature is open and locked otherwise. Locked buttons stay focusable and say
 * "준비 중" to screen readers, so the layout and the keyboard order match the final screen.
 */
export function featureButton(
  controller: Controller,
  feature: LockedFeature,
  options: { className: string; label: string; children: Child[]; onOpen?: () => void },
) {
  const locked = isLocked(feature) || !options.onOpen;
  return h(
    "button",
    {
      className: `${options.className}${locked ? " is-locked" : ""}`,
      attrs: { type: "button", "aria-label": locked ? `${options.label} (준비 중)` : options.label },
      on: { click: () => (locked ? controller.notifyLocked(feature) : options.onOpen?.()) },
    },
    [...options.children, locked ? lockTag(feature) : null],
  );
}

/** A whole locked block (card section) with its title kept and a one-line explanation. */
export function lockedBlock(controller: Controller, feature: LockedFeature, children: Child[], className = "") {
  return h(
    "div",
    {
      className: `locked-block ${className}`.trim(),
      attrs: { role: "button", tabindex: "0", "aria-label": "준비 중인 기능 — 누르면 열리는 단계를 알려 드려요" },
      on: {
        click: () => controller.notifyLocked(feature),
        keydown: (event) => {
          const key = (event as KeyboardEvent).key;
          if (key === "Enter" || key === " ") {
            event.preventDefault();
            controller.notifyLocked(feature);
          }
        },
      },
    },
    [...children, h("span", { className: "locked-veil" }, [lockTag(feature), h("span", { text: "준비 중" })])],
  );
}
