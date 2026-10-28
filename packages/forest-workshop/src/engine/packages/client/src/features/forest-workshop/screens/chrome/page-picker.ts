// A single native selector lets players jump to a group without repeatedly pressing next.
import { h } from "../../app/dom";

export function pagePicker(label: string, page: number, groups: string[], onChange: (page: number) => void) {
  if (groups.length <= 1) return null;
  const select = h(
    "select",
    {
      className: "input page-picker",
      attrs: { "aria-label": label },
      on: { change: () => onChange(Number(select.value)) },
    },
    groups.map((name, index) => h("option", { text: name, attrs: { value: String(index) } })),
  );
  select.value = String(page);
  return select;
}
