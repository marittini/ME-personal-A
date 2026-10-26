// 주민 등록 (board 05-3): back + sign, the ① 자료 선택 → ② 재구축 → ③ 시작 주민 steps, 선택한 자료, 원래 설정,
// 공방 세계 설정 with its n / 200 counter, 수정 · 다시 제안, 주민 그림 직접 등록 (PNG · WebP → WebP 저장),
// "원본 프로필은 바뀌지 않아요.", 재구축 확정 and 나중에 그림 등록. ① and ③ use the same frame for the two steps the
// board shows only in its step bar. This is a form, so the bottom bar is hidden and 뒤로 is explicit (plan §15.6).
import type { AppState, Controller } from "../../app/controller";
import { button, errorLine, h, statusLine } from "../../app/dom";
import type { RegisterState } from "../../app/register-actions";
import type { SourceEntry, SourcePreview, WorldView } from "../../app/types";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { searchField } from "../chrome/search-field";
import { KIND_LABEL, kindTag, residentFigure } from "./resident-figure";

function steps(current: RegisterState["step"]) {
  const step = (n: 1 | 2 | 3, label: string) =>
    h(
      "li",
      {
        className: `step-item${current === n ? " current" : current > n ? " done" : ""}`,
        attrs: current === n ? { "aria-current": "step" } : {},
      },
      [h("span", { className: "step-number", text: String(n) }), h("span", { className: "step-label", text: label })],
    );
  return h("ol", { className: "steps card", attrs: { "aria-label": "주민 등록 단계" } }, [
    step(1, "자료 선택"),
    h("li", { className: "step-arrow", attrs: { "aria-hidden": "true" }, text: "→" }),
    step(2, "재구축"),
    h("li", { className: "step-arrow", attrs: { "aria-hidden": "true" }, text: "→" }),
    step(3, "시작 주민"),
  ]);
}

// ① 자료 선택 --------------------------------------------------------------------------------------------------------
function sourceList(register: RegisterState, controller: Controller) {
  if (register.sources.state === "loading") return statusLine("캐릭터·페르소나를 불러오는 중…");
  if (register.sources.state === "error") {
    return h("div", {}, [
      errorLine(register.sources.message),
      button("다시 불러오기", () => void controller.loadSources(), { variant: "secondary" }),
    ]);
  }
  const query = register.query.trim().toLowerCase();
  const shown = register.sources.value
    .filter((source) => source.kind === register.kindTab)
    .filter((source) => !query || source.name.toLowerCase().includes(query));
  if (shown.length === 0) {
    return h("p", {
      className: "empty",
      text: query
        ? "이름이 맞는 자료가 없어요."
        : `${KIND_LABEL[register.kindTab]}가 아직 없어요. 엔진의 서재에서 먼저 만들어 주세요.`,
    });
  }
  return h(
    "ul",
    { className: "source-list" },
    shown.map((source: SourceEntry) =>
      h("li", {}, [
        h(
          "button",
          {
            className: "menu-row source-row",
            attrs: { type: "button" },
            disabled: source.residentId !== null,
            on: { click: () => void controller.chooseSource(source) },
          },
          [
            h("span", { className: "menu-icon light" }, [ICONS.document()]),
            h("span", { className: "menu-text" }, [
              h("span", { className: "menu-title", text: source.name }),
              h("span", {
                className: "menu-detail",
                text: source.residentId ? "이미 이 세계의 주민이에요" : source.summary || "설명 없음",
              }),
            ]),
            h("span", { className: "menu-chevron" }, [source.residentId ? ICONS.check() : ICONS.chevron()]),
          ],
        ),
      ]),
    ),
  );
}

function stepOne(register: RegisterState, controller: Controller) {
  return [
    card(
      "자료 선택",
      [
        h("p", {
          className: "muted",
          text: "주민으로 맞이할 캐릭터나 페르소나를 골라 주세요. 원본은 읽기만 하고 바꾸지 않아요.",
        }),
        h(
          "div",
          { className: "pill-tabs two", attrs: { role: "tablist", "aria-label": "자료 종류" } },
          (["character", "persona"] as const).map((kind) =>
            h("button", {
              className: `pill-tab${register.kindTab === kind ? " current" : ""}`,
              text: KIND_LABEL[kind],
              attrs: { type: "button", role: "tab", "aria-selected": register.kindTab === kind ? "true" : "false" },
              on: { click: () => controller.setRegisterKind(kind) },
            }),
          ),
        ),
        searchField({
          id: "fw-source-search",
          value: register.query,
          placeholder: "이름으로 찾기",
          onSearch: (query) => controller.setRegisterQuery(query),
        }),
        sourceList(register, controller),
      ],
      { id: "fw-source-title" },
    ),
  ];
}

// ② 재구축 ------------------------------------------------------------------------------------------------------------
function originalSetting(preview: RegisterState["preview"]) {
  if (!preview || preview.state === "loading") return statusLine("원래 설정을 읽는 중…");
  if (preview.state === "error") return errorLine(preview.message);
  const value: SourcePreview = preview.value;
  return h("div", { className: "readonly-box" }, [h("p", { text: value.summary || "원본에 적힌 설명이 없어요." })]);
}

function imagePicker(register: RegisterState, controller: Controller, maxBytes: number) {
  const input = h("input", {
    className: "visually-hidden",
    attrs: { id: "fw-register-image", type: "file", accept: "image/png,image/webp" },
    on: {
      change: () => {
        const file = input.files?.[0];
        input.value = "";
        if (!file) return;
        if (file.size > maxBytes) {
          controller.notify(
            `파일이 ${Math.round(maxBytes / 1024 / 1024)}MiB를 넘어요. 다른 그림을 골라 주세요.`,
            "error",
          );
          return;
        }
        controller.pickPendingImage(file);
      },
    },
  });
  const pending = register.pendingImage;
  return h("div", { className: "image-drop" }, [
    input,
    h("label", { className: "drop-zone checker", attrs: { for: "fw-register-image" } }, [
      pending
        ? h("img", { className: "drop-preview", attrs: { src: pending.previewUrl, alt: "" } })
        : ICONS.addImage("icon drop-icon"),
      h("span", { className: "drop-text" }, [
        h("strong", { text: pending ? pending.file.name : "주민 그림 직접 등록" }),
        h("span", {
          text: pending
            ? `${Math.max(1, Math.round(pending.file.size / 1024))} KB · 등록하면 WebP로 저장해요`
            : "PNG · WebP → WebP 저장",
        }),
      ]),
    ]),
    pending ? button("고른 그림 빼기", () => controller.clearPendingImage(), { variant: "secondary" }) : null,
  ]);
}

function stepTwo(register: RegisterState, state: AppState, controller: Controller) {
  const selected = register.selected!;
  const max = state.content?.residents.worldSettingMax ?? 200;
  const suggesting = Boolean(state.busy["rebuild-suggestion"]);
  const registering = Boolean(state.busy[`register:${selected.kind}:${selected.id}`]);
  const uploading = Object.keys(state.busy).some((key) => key.startsWith("image-upload:") && state.busy[key]);
  const busy = registering || uploading;
  const counter = h("span", {
    className: "counter-text",
    text: `${register.draft.length} / ${max}`,
    attrs: { id: "fw-draft-count" },
  });
  const textarea = h("textarea", {
    className: "textarea",
    attrs: {
      id: "fw-world-setting",
      maxlength: String(max),
      rows: "4",
      placeholder: "이 세계에서 어떤 주민인지 적어 주세요.",
      "aria-describedby": "fw-draft-count",
    },
    on: {
      input: () => {
        counter.textContent = `${textarea.value.length} / ${max}`;
        controller.setDraft(textarea.value);
      },
    },
  });
  textarea.value = register.draft;
  const ready = register.preview?.state === "ready";
  return [
    h("section", { className: "card selected-source" }, [
      h(
        "button",
        { className: "menu-row quiet", attrs: { type: "button" }, on: { click: () => controller.backToSources() } },
        [
          h("span", { className: "menu-icon light" }, [ICONS.document()]),
          h("span", { className: "menu-text" }, [
            h("small", { className: "muted", text: "선택한 자료" }),
            h("span", { className: "menu-title", text: `${KIND_LABEL[selected.kind]} · ${selected.name}` }),
          ]),
          h("span", { className: "menu-chevron" }, [ICONS.chevron()]),
        ],
      ),
    ]),
    h("section", { className: "card rebuild", attrs: { "aria-labelledby": "fw-original" } }, [
      h("h2", { className: "section-title doc", text: "원래 설정", attrs: { id: "fw-original" } }),
      originalSetting(register.preview),
      h("label", { className: "section-title", text: "공방 세계 설정", attrs: { for: "fw-world-setting" } }),
      h("div", { className: "textarea-wrap" }, [textarea, counter]),
      h("div", { className: "rule-actions even" }, [
        h(
          "button",
          {
            className: "button",
            attrs: { type: "button" },
            on: {
              click: () => {
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
              },
            },
          },
          [ICONS.pencil("icon"), h("span", { text: "수정" })],
        ),
        h(
          "button",
          {
            className: "button secondary",
            attrs: { type: "button" },
            disabled: suggesting || !ready,
            on: { click: () => void controller.suggestSetting() },
          },
          [ICONS.sparkle("icon"), h("span", { text: suggesting ? "제안 받는 중…" : "다시 제안" })],
        ),
      ]),
      h("p", {
        className: "hint",
        text: "다시 제안은 엔진의 기본 언어 모델에 한 번 요청해요. 확정하기 전에는 저장되지 않아요.",
      }),
    ]),
    card(
      "주민 그림 직접 등록",
      [
        imagePicker(register, controller, state.content?.residents.maxImageBytes ?? 20 * 1024 * 1024),
        h("p", { className: "hint center" }, [ICONS.info("icon"), "원본 프로필은 바뀌지 않아요."]),
      ],
      { id: "fw-register-image-title" },
    ),
    h(
      "button",
      {
        className: "button big-action",
        attrs: { type: "button", "data-wide": "" },
        disabled: busy || !ready,
        on: {
          click: () => void controller.confirmRegister(true, (id, file) => controller.uploadResidentImage(id, file)),
        },
      },
      [
        ICONS.leaf("icon"),
        h("span", { text: registering ? "등록하는 중…" : uploading ? "그림 저장 중…" : "재구축 확정" }),
        ICONS.chevron("icon"),
      ],
    ),
    h(
      "button",
      {
        className: "button secondary",
        attrs: { type: "button", "data-wide": "" },
        disabled: busy || !ready,
        on: { click: () => void controller.confirmRegister(false, async () => undefined) },
      },
      [ICONS.clock("icon"), h("span", { text: "나중에 그림 등록" })],
    ),
  ];
}

// ③ 시작 주민 ---------------------------------------------------------------------------------------------------------
function stepThree(register: RegisterState, world: WorldView, state: AppState, controller: Controller) {
  const residents = Object.values(world.state.residents);
  const busy = Boolean(state.busy["choose-starter"]);
  return [
    card(
      "시작 주민",
      [
        h("p", {
          className: "muted",
          text: "공방에서 함께 시작할 주민 한 명을 골라 주세요. 다른 주민은 초대로 맞이해요.",
        }),
        h(
          "ul",
          { className: "starter-list", attrs: { role: "radiogroup", "aria-label": "시작 주민" } },
          residents.map((resident) =>
            h("li", {}, [
              h(
                "button",
                {
                  className: `starter-option${register.starterChoice === resident.residentId ? " chosen" : ""}`,
                  attrs: {
                    type: "button",
                    role: "radio",
                    "aria-checked": register.starterChoice === resident.residentId ? "true" : "false",
                  },
                  on: { click: () => controller.setStarterChoice(resident.residentId) },
                },
                [
                  h("span", { className: "starter-stage" }, [residentFigure(resident)]),
                  h("strong", { text: resident.displayName }),
                  kindTag(resident),
                ],
              ),
            ]),
          ),
        ),
      ],
      { id: "fw-starter-title" },
    ),
    h(
      "button",
      {
        className: "button big-action",
        attrs: { type: "button", "data-wide": "" },
        disabled: busy || !register.starterChoice,
        on: { click: () => void controller.confirmStarter() },
      },
      [ICONS.house("icon"), h("span", { text: busy ? "맞이하는 중…" : "이 주민과 시작하기" })],
    ),
    button("주민 더 등록하기", () => controller.registerAnother(), {
      variant: "secondary",
      attrs: { "data-wide": "" },
    }),
  ];
}

export function renderRegisterScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const register = state.register;
  let body;
  if (!world || !register) body = [statusLine("세계를 불러오는 중…")];
  else if (register.step === 3) body = [steps(3), ...stepThree(register, world, state, controller)];
  else if (register.step === 2 && register.selected) body = [steps(2), ...stepTwo(register, state, controller)];
  else body = [steps(1), ...stepOne(register, controller)];
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "주민 등록", back: { route: "residents", label: "주민" }, resources: false },
    backdrop: "wood",
    body,
    nav: false,
  });
}
