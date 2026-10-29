// Page groups use the game's own controls while retaining native keyboard and disclosure behavior.
import { h } from "../../app/dom";

export function pagePicker(label: string, page: number, groups: string[], onChange: (page: number) => void) {
  if (groups.length <= 1) return null;
  const current = Math.max(0, Math.min(page, groups.length - 1));
  const summary = h(
    "summary",
    {
      className: "page-picker-summary",
      attrs: { "aria-label": label, id: `fw-picker-${encodeURIComponent(label)}` },
    },
    [
      h("span", { text: groups[current] }),
      h("span", { className: "page-picker-arrow", text: "▾", attrs: { "aria-hidden": "true" } }),
    ],
  );
  const picker = h(
    "details",
    {
      className: "page-picker",
      on: {
        keydown: (event) => {
          if ((event as KeyboardEvent).key === "Escape" && picker.open) {
            event.preventDefault();
            picker.open = false;
            summary.focus();
          }
        },
      },
    },
    [
      summary,
      h(
        "div",
        { className: "page-picker-options" },
        groups.map((name, index) =>
          h("button", {
            className: "page-picker-option",
            text: name,
            attrs: { type: "button", "aria-pressed": String(index === current) },
            on: {
              click: () => {
                picker.open = false;
                summary.focus();
                if (index !== current) onChange(index);
              },
            },
          }),
        ),
      ),
    ],
  );
  return picker;
}
