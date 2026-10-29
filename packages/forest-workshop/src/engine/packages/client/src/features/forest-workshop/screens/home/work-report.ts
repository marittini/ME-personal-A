// 공방 소식 card and the 작업 보고 sheet (board 01-1). The card shows the headline of the workshop right now, the two
// most-produced items of the unread reports (+ amount), 작업 보고 and "자동 입고 완료": outputs went into the
// storeroom the moment they were made (plan §7.2-C), so reading the report only marks it read and grants nothing.
// The strip below shows the last absence: how many hours counted, of at most 72.
import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";
import type { GameContent, ProductionReport, WorldView } from "../../app/types";
import { card } from "../chrome/frame";
import { sheetDialog } from "../chrome/sheet";
import { ICONS } from "../chrome/icons";
import { formatHours, itemName, itemTile, jobProgress, recipeOf } from "../work/production-view";

function unread(world: WorldView): ProductionReport[] {
  const through = world.state.production.reportsReadThrough;
  return world.state.production.reports.filter((report) => report.reportId > through);
}

function sum(reports: ProductionReport[], key: "produced" | "consumed" | "sold"): Record<string, number> {
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

/** A compact entry to the existing full report, sized for the home viewport. */
export function compactWorkReport(state: AppState, world: WorldView, controller: Controller) {
  const count = unread(world).length;
  const active = Object.entries(world.state.production.facilities).find(([, facility]) => facility.job);
  const job = active?.[1].job;
  const recipe = job ? recipeOf(state.content, job.recipeId) : null;
  const showWork = Boolean(job && active && !count);
  return h(
    "button",
    {
      className: "home-summary work-summary",
      attrs: {
        type: "button",
        "aria-label": showWork
          ? `${recipe?.name ?? "작업"} 진행 중 · 작업 관리 열기`
          : `${headline(world)} · ${count ? `새 보고 ${count}개` : "새 보고 없음"} · 작업 보고 열기`,
      },
      on: {
        click: () => {
          if (showWork && active) {
            controller.selectFacility(active[0]);
            controller.navigate("work");
          } else controller.openSheet({ kind: "work-report" });
        },
      },
    },
    [
      h("span", { className: "home-summary-copy" }, [
        h("strong", { text: showWork ? `${recipe?.name ?? "작업"} 진행 중` : headline(world) }),
        showWork && job
          ? h("span", {}, ["남은 시간 ", jobProgress(state, world, job).countdown])
          : h("span", { text: count ? `새 작업 보고 ${count}개` : "작업 보고 보기" }),
      ]),
      ICONS.chevron("icon"),
    ],
  );
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
  return h(
    "span",
    { className: "report-items" },
    entries.length
      ? entries.map(([item, amount]) =>
          h("span", { className: "report-item" }, [
            itemTile(item),
            h("span", { text: `${itemName(content, item)} ${sign}${amount}` }),
          ]),
        )
      : [h("span", { text: "없음" })],
  );
}

export function workReportSheet(state: AppState, world: WorldView, controller: Controller) {
  const content = state.content;
  const reports = world.state.production.reports;
  const news = unread(world);
  const busy = Boolean(state.busy["reports-read"]);
  return sheetDialog("fw-work-report", "작업 보고", [
    h("p", {
      className: "muted",
      text: "물건은 창고에 자동 입고됐어요. 확인하면 보고만 읽음으로 표시해요.",
    }),
    news.length
      ? h("div", { className: "report-total" }, [
          h("p", {}, [h("strong", { text: "새로 들어온 것 " }), itemsLine(content, sum(news, "produced"), "+")]),
          h("p", {}, [h("strong", { text: "재료로 쓴 것 " }), itemsLine(content, sum(news, "consumed"), "−")]),
          news.some((report) => report.gold > 0)
            ? h("p", {}, [
                h("strong", { text: "자동 판매 " }),
                itemsLine(content, sum(news, "sold"), "−"),
                h("span", { text: ` → +${news.reduce((total, report) => total + report.gold, 0)} G` }),
              ])
            : null,
        ])
      : h("p", { className: "empty", text: "새 보고가 없어요." }),
    reports.length
      ? h("details", { className: "detail-help" }, [
          h("summary", { text: "최근 작업 내역" }),
          h(
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
                  report.runs ? h("span", { text: `${report.runs}회 완료` }) : null,
                  Object.keys(report.produced).length
                    ? h("div", {}, [h("strong", { text: "들어옴 " }), itemsLine(content, report.produced, "+")])
                    : null,
                  Object.keys(report.consumed).length
                    ? h("div", {}, [h("strong", { text: "재료 " }), itemsLine(content, report.consumed, "−")])
                    : null,
                  report.gold
                    ? h("div", {}, [
                        h("strong", { text: "자동 판매 " }),
                        itemsLine(content, report.sold, "−"),
                        h("span", { text: ` +${report.gold} G` }),
                      ])
                    : null,
                ],
              ),
            ),
          ),
        ])
      : null,
    news.length
      ? button(busy ? "확인하는 중…" : "확인", () => void controller.readReports(reports[0]!.reportId), {
          disabled: busy,
          attrs: { "data-wide": "" },
        })
      : null,
    button("닫기", () => controller.closeSheet(), { variant: "secondary", attrs: { "data-wide": "" } }),
  ]);
}
