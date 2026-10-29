// 주민 그림 (board 04-2): back + sign, 대상 ribbon, the checkerboard preview, file name · size · bytes, 파일 선택 · 교체,
// the rules box, 그림 크기 · 좌우 위치 · 기호 높이 sliders, 적용, 기본 배치 and 이전 그림.
// The sliders move the preview at once; 적용 saves them as placement (never baked into the file). 기본 배치 resets
// the sliders; 이전 그림 lists the last 3 pictures to go back to. A new file replaces the picture immediately: the
// server converts it to WebP 95 and keeps the previous one in that history.
import type { AppState, Controller } from "../../app/controller";
import { button, h, statusLine } from "../../app/dom";
import type { Placement, Resident, ResidentImage } from "../../app/types";
import { renderFrame } from "../chrome/frame";
import { ICONS, type IconFactory } from "../chrome/icons";
import { residentFigure } from "./resident-figure";

function formatKB(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString("ko-KR")} KB`;
}

function slider(
  key: keyof Placement,
  icon: IconFactory,
  label: string,
  value: number,
  limits: { min: number; max: number },
  controller: Controller,
  format: (value: number) => string,
) {
  const id = `fw-placement-${key}`;
  const output = h("span", { className: "slider-value", text: format(value) });
  const input = h("input", {
    className: "slider",
    attrs: {
      id,
      type: "range",
      min: String(limits.min),
      max: String(limits.max),
      step: "1",
      value: String(value),
      "aria-valuetext": format(value),
    },
    on: {
      // While dragging only the number moves; on release the preview follows (one re-render, no lost drag).
      input: () => (output.textContent = format(Number(input.value))),
      change: () => controller.setPlacementDraft({ [key]: Number(input.value) }),
    },
  });
  return h("div", { className: "setting-row slider-row" }, [
    icon("icon"),
    h("label", { className: "setting-label", text: label, attrs: { for: id } }),
    input,
    output,
  ]);
}

function historySheet(resident: Resident, state: AppState, controller: Controller) {
  const busy = Boolean(state.busy[`image-restore:${resident.residentId}`]);
  const item = (image: ResidentImage) =>
    h("li", { className: "history-item" }, [
      h("span", { className: "history-thumb checker" }, [h("img", { attrs: { src: image.url, alt: "" } })]),
      h("span", { className: "menu-text" }, [
        h("span", { className: "menu-title", text: image.fileName || "이전 그림" }),
        h("span", { className: "menu-detail", text: `${image.width} × ${image.height} · ${formatKB(image.bytes)}` }),
      ]),
      button(
        busy ? "되돌리는 중…" : "이 그림으로",
        () => void controller.restoreResidentImage(resident.residentId, image.reference),
        { disabled: busy },
      ),
    ]);
  return h("div", { className: "sheet-backdrop" }, [
    h(
      "section",
      {
        className: "sheet card",
        attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "fw-image-history" },
      },
      [
        h("h2", { className: "section-title", text: "이전 그림", attrs: { id: "fw-image-history" } }),
        resident.image.history.length
          ? h("ul", { className: "history-list" }, resident.image.history.map(item))
          : h("p", { className: "empty", text: "되돌릴 이전 그림이 없어요." }),
        h("p", { className: "hint", text: "최근 3장까지 보관해요. 지난 이야기 다시보기에도 지금 그림이 쓰여요." }),
        button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
      ],
    ),
  ]);
}

function body(resident: Resident, state: AppState, controller: Controller) {
  const limits = state.content?.residents.placement;
  const draft = state.placementDraft ?? resident.image.placement;
  const current = resident.image.current;
  const uploading = Boolean(state.busy[`image-upload:${resident.residentId}`]);
  const applying = Boolean(state.busy[`placement:${resident.residentId}`]);
  const changed = JSON.stringify(draft) !== JSON.stringify(resident.image.placement);
  const fileInput = h("input", {
    className: "visually-hidden",
    attrs: { id: "fw-image-file", type: "file", accept: "image/png,image/webp" },
    disabled: uploading,
    on: {
      change: () => {
        const file = fileInput.files?.[0];
        fileInput.value = "";
        if (file) void controller.uploadResidentImage(resident.residentId, file);
      },
    },
  });
  const signed = (value: number) => (value > 0 ? `+${value}` : String(value));
  return [
    h("section", { className: "card image-card" }, [
      h("p", { className: "target-ribbon" }, [ICONS.leaf("icon"), h("strong", { text: resident.displayName })]),
      h("div", { className: "image-stage checker" }, [residentFigure(resident, { placement: draft, marker: true })]),
      current
        ? h("details", { className: "detail-help" }, [
            h("summary", { text: "현재 그림 정보" }),
            h("div", { className: "file-facts" }, [
              h("strong", { text: current.fileName || "resident.webp" }),
              h("span", { text: `${current.width} × ${current.height} / ${formatKB(current.bytes)}` }),
            ]),
          ])
        : h("p", { className: "muted", text: "그림 없이도 공방을 이용할 수 있어요." }),
      fileInput,
      h(
        "label",
        {
          className: `button big-action file-button${uploading ? " busy" : ""}`,
          attrs: { for: "fw-image-file", "data-wide": "", "aria-disabled": uploading ? "true" : "false" },
        },
        [h("span", { text: uploading ? "WebP로 저장하는 중…" : current ? "파일 선택 · 교체" : "파일 선택" })],
      ),
      limits
        ? h("div", { className: "setting-block sliders" }, [
            slider("scale", ICONS.zoom, "그림 크기", draft.scale, limits.scale, controller, (value) => `${value}%`),
            slider("offsetX", ICONS.arrows, "좌우 위치", draft.offsetX, limits.offsetX, controller, signed),
            slider(
              "markerHeight",
              ICONS.updown,
              "감정 표시 높이",
              draft.markerHeight,
              limits.markerHeight,
              controller,
              signed,
            ),
          ])
        : null,
      h(
        "button",
        {
          className: "button big-action",
          attrs: { type: "button", "data-wide": "" },
          disabled: applying || !changed,
          on: { click: () => void controller.applyPlacement(resident.residentId) },
        },
        [h("span", { text: applying ? "적용하는 중…" : changed ? "적용" : "적용됨" })],
      ),
      h("details", { className: "detail-help" }, [
        h("summary", { text: "그림 업로드 안내" }),
        h("ul", { className: "rules" }, [
          h("li", { text: "PNG · 정적 WebP 업로드 (20MiB · 4096px까지)" }),
          h("li", { text: "투명도 유지 · WebP 품질 95 저장" }),
          h("li", { text: "PNG 원본은 따로 보관하지 않아요." }),
        ]),
      ]),
      h("div", { className: "rule-actions even" }, [
        h(
          "button",
          {
            className: "button secondary",
            attrs: { type: "button" },
            on: { click: () => controller.resetPlacementDraft() },
          },
          [ICONS.restore("icon"), h("span", { text: "기본 배치" })],
        ),
        h(
          "button",
          {
            className: "button secondary",
            attrs: { type: "button" },
            disabled: resident.image.history.length === 0,
            on: { click: () => controller.openSheet({ kind: "image-history", residentId: resident.residentId }) },
          },
          [
            ICONS.image("icon"),
            h("span", { text: `이전 그림${resident.image.history.length ? ` ${resident.image.history.length}` : ""}` }),
          ],
        ),
      ]),
    ]),
  ];
}

export function renderResidentImageScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const resident = world ? (world.state.residents[state.focusResidentId ?? ""] ?? null) : null;
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "주민 그림", back: { route: "residents", label: "주민" }, resources: false },
    backdrop: "wood",
    body: resident
      ? body(resident, state, controller)
      : [statusLine(world ? "주민을 고른 뒤 주민 그림을 열어 주세요." : "세계를 불러오는 중…")],
    nav: true,
    sheet: resident && state.sheet?.kind === "image-history" ? historySheet(resident, state, controller) : null,
  });
}
