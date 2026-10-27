// 이름으로 찾기 fields (boards 03-1 주민, 05-3 자료 선택). The search applies after a short pause and never while an
// IME is composing: re-rendering mid-composition would break Korean input. A new render replaces the field but keeps
// its value and caret (client-entry.ts).
import { h } from "../../app/dom";
import { ICONS } from "./icons";

let timer: ReturnType<typeof setTimeout> | undefined;
let composing = false;

export function searchField(options: {
  id: string;
  value: string;
  placeholder: string;
  onSearch: (query: string) => void;
}) {
  const apply = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!composing && input.isConnected) options.onSearch(input.value);
    }, 300);
  };
  const input = h("input", {
    className: "search-input",
    attrs: {
      id: options.id,
      type: "search",
      placeholder: options.placeholder,
      value: options.value,
      autocomplete: "off",
    },
    on: {
      compositionstart: () => (composing = true),
      compositionend: () => {
        composing = false;
        apply();
      },
      input: () => apply(),
    },
  });
  return h("label", { className: "search-field", attrs: { for: options.id } }, [
    ICONS.search("icon"),
    h("span", { className: "visually-hidden", text: options.placeholder }),
    input,
  ]);
}
