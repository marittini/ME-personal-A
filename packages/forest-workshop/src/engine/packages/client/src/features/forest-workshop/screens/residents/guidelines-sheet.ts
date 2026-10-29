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
      text: "말투·분위기·관계 진행 속도를 정해요. 주민이 아는 기억이나 보상·게임 규칙은 바꾸지 않아요. 이미 작성한 이야기는 그대로예요.",
    }),
    h("p", {
      className: "muted",
      text: view.pairId
        ? "이 페어의 새 이야기에만 적용돼요. 공방 지침보다 이 페어의 서술 선호를 우선해요."
        : "공방의 모든 새 이야기에서 공통으로 참고해요.",
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
        h("p", {
          className: "muted",
          text: `저장 버전 ${stored?.revision ?? 0} · ${stored?.updatedAt?.slice(0, 10) ?? "아직 저장하지 않았어요"}`,
        }),
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
    button("닫기", () => controller.closeSheet(), { variant: "secondary", disabled: busy }),
  ]);
}
