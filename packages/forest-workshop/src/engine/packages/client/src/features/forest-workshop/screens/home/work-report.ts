// 공방 소식 card and the 작업 보고 sheet (board 01-1). The card shows the headline of the workshop right now, the two
// most-produced items of the unread reports (+ amount), 작업 보고 and "자동 입고 완료": outputs went into the
// storeroom the moment they were made (plan §7.2-C), so reading the report only marks it read and grants nothing.
// The strip below shows the last absence: how many hours counted, of at most 72.
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { GameContent, ProductionReport, WorldView } from "../../app/types";
import { card } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { formatHours, itemName, itemTile } from "../work/production-view";

function unread(world: WorldView): ProductionReport[] {
  const through = world.state.production.reportsReadThrough;
  return world.state.production.reports.filter((report) => report.reportId > through);
}

function sum(reports: ProductionReport[], key: "produced" | "consumed"): Record<string, number> {
  const total: Record<string, number> = {};
  for (const report of reports)
    for (const [item, amount] of Object.entries(report[key])) total[item] = (total[item] ?? 0) + amount;
  return total;
}

/** The card's headline, from what the facilities are doing now. */
function headline(world: WorldView): string {
  const facilities = Object.values(world.state.production.facilities);
  if (facilities.some((facility) => facility.waiting?.reason === "materials")) return "재료를 기다리는 시설이 있어요";
  if (facilities.some((facility) => facility.job)) return "공방이 잘 돌아가고 있어요";
  return "공방이 쉬고 있어요";
}

export function workReportCard(world: WorldView, content: GameContent | null, controller: Controller) {
  const news = unread(world);
  const produced = Object.entries(sum(news, "produced")).sort(([, a], [, b]) => b - a);
  const slot = (entry: [string, number] | undefined) =>
    entry
      ? h("div", { className: "report-slot" }, [
          itemTile(entry[0], "big"),
          h("span", { className: "slot-name", text: itemName(content, entry[0]) }),
          h("strong", { text: `+${entry[1]}` }),
        ])
      : h("div", { className: "report-slot empty" }, [
          h("span", { className: "slot-art" }),
          h("span", { className: "slot-name", text: "새 입고 없음" }),
          h("strong", { text: "–" }),
        ]);
  return card(
    null,
    [
      h("h2", { className: "report-title", text: headline(world) }),
      h("div", { className: "report-body" }, [
        h("div", { className: "report-items" }, [slot(produced[0]), slot(produced[1])]),
        h("div", { className: "report-actions" }, [
          h(
            "button",
            {
              className: "button report-button",
              attrs: { type: "button" },
              on: { click: () => controller.openSheet({ kind: "work-report" }) },
            },
            [
              h("span", { text: "작업 보고" }),
              news.length ? h("span", { className: "count-badge", text: String(news.length) }) : null,
              ICONS.chevron("icon"),
            ],
          ),
          h("span", { className: "report-caption" }, [ICONS.leaf("icon tiny"), "자동 입고 완료"]),
        ]),
      ]),
    ],
    { className: "report-card" },
  );
}

export function absenceStrip(world: WorldView, content: GameContent | null, controller: Controller) {
  const last = world.state.production.activity.lastAbsence;
  const limit = content?.production.absenceLimitMs ?? 72 * 3_600_000;
  return h(
    "button",
    {
      className: "strip offline",
      attrs: { type: "button" },
      on: {
        click: () =>
          controller.notify(
            last && last.totalMs > last.creditedMs
              ? `지난번엔 ${formatHours(last.totalMs)}시간 비웠고, 그중 최대 72시간만 공방이 일했어요. 남은 작업은 멈춘 자리에서 이어져요.`
              : "자리를 비운 동안에도 최대 72시간까지 공방이 일해요. 그 뒤엔 멈춘 자리에서 기다려요.",
          ),
      },
    },
    [
      ICONS.clock(),
      h("span", {}, [
        "미접속 누적 ",
        h("strong", { text: `${last ? formatHours(last.creditedMs) : "0"}시간` }),
        ` / 최대 ${formatHours(limit)}시간`,
      ]),
      ICONS.info("icon muted-icon"),
    ],
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
}

function itemsLine(content: GameContent | null, items: Record<string, number>, sign: string) {
  const entries = Object.entries(items);
  return entries.length
    ? entries.map(([item, amount]) => `${itemName(content, item)} ${sign}${amount}`).join(" · ")
    : "없음";
}

export function workReportSheet(state: AppState, world: WorldView, controller: Controller) {
  const content = state.content;
  const reports = world.state.production.reports;
  const news = unread(world);
  const busy = Boolean(state.busy["reports-read"]);
  return h("div", { className: "sheet-backdrop" }, [
    h(
      "section",
      { className: "sheet card", attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "fw-work-report" } },
      [
        h("h2", { className: "section-title", text: "작업 보고", attrs: { id: "fw-work-report" } }),
        h("p", {
          className: "muted",
          text: "만든 물건은 만들어진 순간 창고에 들어갔어요. 보고를 읽어도 다시 지급되지 않아요.",
        }),
        news.length
          ? h("div", { className: "report-total" }, [
              h("p", {}, [h("strong", { text: "새로 들어온 것 " }), itemsLine(content, sum(news, "produced"), "+")]),
              h("p", {}, [h("strong", { text: "재료로 쓴 것 " }), itemsLine(content, sum(news, "consumed"), "−")]),
            ])
          : h("p", { className: "empty", text: "새 보고가 없어요." }),
        reports.length
          ? h(
              "ol",
              { className: "report-list" },
              reports.slice(0, 10).map((report) =>
                h(
                  "li",
                  {
                    className: `report-entry${report.reportId > world.state.production.reportsReadThrough ? " new" : ""}`,
                  },
                  [
                    h("span", {
                      className: "report-time",
                      text: `${formatTime(report.at)}${report.offlineMs ? ` · 비운 동안 ${formatHours(report.offlineMs)}시간` : ""}`,
                    }),
                    h("span", {
                      text: [
                        `${report.runs}회 완료`,
                        Object.keys(report.produced).length ? `들어옴 ${itemsLine(content, report.produced, "+")}` : "",
                        Object.keys(report.consumed).length ? `재료 ${itemsLine(content, report.consumed, "−")}` : "",
                      ]
                        .filter(Boolean)
                        .join(" · "),
                    }),
                  ],
                ),
              ),
            )
          : null,
        news.length
          ? button(busy ? "확인하는 중…" : "확인", () => void controller.readReports(reports[0]!.reportId), {
              disabled: busy,
              attrs: { "data-wide": "" },
            })
          : null,
        button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
      ],
    ),
  ]);
}
