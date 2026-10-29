import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import { sheetDialog } from "../chrome/sheet";
export function renderGuidelinesSheet(state: AppState, controller: Controller) {
  const view = state.sheet,
    world = state.world?.state === "ready" ? state.world.value : null;
  if (view?.kind !== "guidelines" || !world) return null;
  const stored = view.pairId ? world.state.guidelines?.pairs[view.pairId] : world.state.guidelines?.world;
  const draft = view.draft ?? stored ?? { enabled: false, text: "" };
  const limit = view.pairId ? 500 : 1000;
  const busy = Boolean(state.busy[`guidelines:${view.pairId ?? "world"}`]);
  const counter = h("output", { className: "muted", text: `${draft.text.length} / ${limit}` });
  const text = h("textarea", {
    className: "textarea",
    attrs: { "aria-label": "AI 서술 지침", maxlength: String(limit), rows: "6" },
    on: {
      input: () => {
        counter.textContent = `${text.value.length} / ${limit}`;
        remember();
      },
    },
  });
  text.value = draft.text;
  const enabled = h("input", {
    attrs: { type: "checkbox", "aria-label": "지침 사용" },
    on: { change: () => remember() },
  });
  enabled.checked = draft.enabled;
  function remember() {
    controller.rememberGuidelines({ enabled: enabled.checked, text: text.value });
  }
  return sheetDialog("fw-guidelines", view.pairId ? "페어 AI 지침" : "공방 AI 지침", [
    h("p", {
      className: "muted",
      text: view.pairId ? "이 페어의 새 이야기 말투와 분위기를 정해요." : "공방의 새 이야기 말투와 분위기를 정해요.",
    }),
    h(
      "form",
      {
        className: "guidelines-form",
        on: {
          submit: (event) => {
            event.preventDefault();
            if (enabled.checked && !text.value.trim()) {
              controller.notify("사용할 지침을 작성해 주세요.");
              return;
            }
            const value = { enabled: enabled.checked, text: text.value };
            controller.rememberGuidelines(value);
            void controller.saveGuidelines(view.pairId, value);
          },
        },
      },
      [
        h("label", { className: "guidelines-toggle" }, [enabled, "지침 사용"]),
        text,
        counter,
        h("button", {
          className: "button",
          text: busy ? "저장 중…" : "지침 저장",
          attrs: { type: "submit" },
          disabled: busy,
        }),
        button(
          "초기화",
          () => {
            text.value = "";
            enabled.checked = false;
            counter.textContent = `0 / ${limit}`;
            remember();
          },
          { variant: "secondary", disabled: busy },
        ),
      ],
    ),
    h("details", { className: "detail-help" }, [
      h("summary", { text: "지침 적용 안내" }),
      h("p", {
        className: "muted",
        text: "말투·분위기·관계 진행 속도를 참고해요. 기억·보상·게임 규칙이나 이미 작성한 이야기는 바뀌지 않아요.",
      }),
      view.pairId ? h("p", { className: "muted", text: "공방 지침보다 이 페어의 서술 선호를 우선해요." }) : null,
    ]),
    button("닫기", () => controller.closeSheet(), { variant: "secondary", disabled: busy }),
  ]);
}
