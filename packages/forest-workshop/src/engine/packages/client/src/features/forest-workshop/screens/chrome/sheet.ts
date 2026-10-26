// Sheets over a screen (boards 01-3, 03-3: 재고 보호 편집, 팔기, 확률 보기, 초대 기록, …): the same dialog frame and the
// number picker the sheets share. A picker keeps its value in the DOM until the player confirms, so a re-render from a
// heartbeat does not reset a number being chosen.
import { h, type Child } from "../../app/dom";

export function sheetDialog(id: string, title: string, children: Child[], className = "") {
  return h("div", { className: "sheet-backdrop" }, [
    h(
      "section",
      {
        className: `sheet card ${className}`.trim(),
        attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": id },
      },
      [h("h2", { className: "section-title", text: title, attrs: { id } }), ...children],
    ),
  ]);
}

/** A number picker: −10 −1 value +1 +10 (or −1 +1 with `small`), kept in the DOM until confirmed. */
export function amountPicker(
  id: string,
  initial: number,
  min: number,
  max: number,
  options: { small?: boolean; label?: string; onChange?: (value: number) => void } = {},
) {
  let value = Math.min(max, Math.max(min, initial));
  const output = h("output", {
    className: "step-value big",
    text: String(value),
    attrs: { id, "aria-live": "polite", ...(options.label ? { "aria-label": options.label } : {}) },
  });
  const step = (delta: number) =>
    h("button", {
      className: "step",
      text: delta > 0 ? `+${delta}` : String(delta),
      attrs: {
        type: "button",
        "aria-label": `${options.label ?? ""} ${delta > 0 ? "늘리기" : "줄이기"} ${Math.abs(delta)}`.trim(),
      },
      on: {
        click: () => {
          value = Math.min(max, Math.max(min, value + delta));
          output.textContent = String(value);
          options.onChange?.(value);
        },
      },
    });
  const steps = options.small ? [step(-1), output, step(1)] : [step(-10), step(-1), output, step(1), step(10)];
  return {
    node: h("div", { className: `stepper wide${options.small ? " compact" : ""}` }, steps),
    read: () => value,
  };
}
