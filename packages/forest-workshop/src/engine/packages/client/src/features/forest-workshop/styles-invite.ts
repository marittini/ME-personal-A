// Styles for 초대 (board 03-3) and the rest of P3's management parts (지정 횟수 대기열, 해금, 배치 변경, 자동 판매,
// 초대권 받기). Same storybook rules as styles.ts: flat fills, one dark-brown ink line (--line / --line-in), flat
// drops, no thin strokes, no blended gradients.
export const INVITE_STYLES = `
/* Top counters (초대권 + · 종표) */
.invite-counters { gap: 0.35em; }
.counter-plus { display: inline-flex; align-items: center; justify-content: center; width: 1.45em; height: 1.45em; margin-left: 0.1em; border-radius: 50%; border: 2px solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); }
.counter-plus .icon { stroke-width: 3; }
.token-mark, .token-coin { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 1.65em; height: 1.65em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: #b9cf7a; color: #2f4a26; }
.token-coin.big { width: 3.6em; height: 3.6em; border-width: var(--line); box-shadow: var(--drop); }
.token-coin.big .icon { width: 1.8em; height: 1.8em; }

/* Tabs and the envelope */
.invite-tabs .segment { gap: 0.45em; }
.invite-tabs .segment .icon { width: 1.2em; height: 1.2em; }
.invite-stage { display: grid; place-items: center; padding: 0.4em 0 0; }
.invite-envelope { width: min(76%, 300px); height: auto; filter: drop-shadow(0 0.25em 0 rgba(75, 46, 26, 0.35)); }

/* 희망 주민 · 1회 / 10회 초대 */
.wish-row .menu-detail { overflow-wrap: anywhere; }
.draw-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6em; }
.draw-button {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.2em;
  min-height: 6.4em;
  padding: 0.7em 0.5em 1.1em;
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  box-shadow: var(--drop);
  font: inherit;
  cursor: pointer;
}
.draw-button:disabled { background: #a29a8b; color: #f7f1e6; cursor: not-allowed; }
.draw-title { font-size: calc(var(--fs) * 1.35); font-weight: 900; }
.draw-cost { display: inline-flex; align-items: center; gap: 0.3em; font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.draw-short { position: absolute; left: 50%; bottom: -0.85em; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 0.25em; padding: 0.1em 0.6em; border-radius: 999px; border: 2px solid var(--ink); background: var(--fw-surface-3); color: var(--fw-fail); font-size: calc(var(--fs) * 0.8); font-weight: 900; white-space: nowrap; }
.draw-row + .hint { margin-top: 0.6em; }
.link-row { display: flex; justify-content: space-between; gap: 0.5em; padding-top: 0.4em; border-top: var(--line-in) dashed var(--fw-track); }
.link-button.with-icon { display: inline-flex; align-items: center; gap: 0.35em; color: var(--fw-text); }

/* 종표 교환 card and list */
.exchange-card { display: grid; grid-template-columns: auto auto 1fr auto; align-items: center; gap: 0.7em; width: 100%; padding: 0.2em; border: 0; background: none; color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.exchange-count { display: grid; justify-items: center; gap: 0.25em; padding-right: 0.7em; border-right: var(--line-in) solid var(--fw-track); }
.exchange-count strong { font-size: calc(var(--fs) * 1.1); }
.count-pill { padding: 0.1em 0.8em; border-radius: 999px; border: 2px solid var(--ink); background: var(--fw-surface-2); font-weight: 900; font-size: calc(var(--fs) * 1.15); }
.exchange-text { display: grid; gap: 0.2em; min-width: 0; }
.exchange-text strong { display: inline-flex; align-items: center; gap: 0.3em; }
.exchange-summary { display: flex; align-items: center; flex-wrap: wrap; gap: 0.4em; margin: 0; }
.exchange-list, .pick-list, .result-list, .chance-list, .order-list, .queue-list, .unlock-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.exchange-row, .chance-row, .result-row { display: flex; align-items: center; gap: 0.6em; padding: 0.45em 0.6em; border-radius: 0.85em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.exchange-name, .chance-name { display: grid; gap: 0.2em; flex: 1; min-width: 0; }
.chance-value { font-variant-numeric: tabular-nums; }
.tag.wish { background: var(--fw-gold); color: var(--ink); }

/* Pick rows (희망 주민, 배치 변경, 전문 분야) */
.pick-row { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5em; width: 100%; min-height: 3.2em; padding: 0.45em 0.7em; border-radius: 0.85em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.pick-row > strong { flex: 1 1 6em; min-width: 0; overflow-wrap: anywhere; }
.pick-row.selected { background: var(--fw-leaf-soft); box-shadow: inset 0 0 0 2px var(--fw-leaf); }
.pick-row:disabled { cursor: default; }
.pick-row .good { color: var(--fw-pass); font-weight: 900; }
.pick-list.fields .pick-row .icon { width: 1.5em; height: 1.5em; color: var(--fw-accent); }
.assign-now { margin: 0; padding: 0.45em 0.7em; border-radius: 0.8em; border: 2px dashed var(--ink); background: var(--fw-surface); }

/* Results */
.result-hero { display: grid; justify-items: center; gap: 0.35em; text-align: center; }
.result-stage { position: relative; display: block; width: 9em; height: 11em; border-radius: 1em; border: var(--line) solid var(--ink); background: var(--fw-leaf-soft); overflow: hidden; }
.result-name { font-size: calc(var(--fs) * 1.4); }
.result-row > strong { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.result-row > small { flex-basis: 100%; padding-left: 2.9em; }
.result-row { flex-wrap: wrap; }
.result-badge { padding: 0.05em 0.6em; border-radius: 999px; border: 2px solid var(--ink); font-weight: 900; font-size: calc(var(--fs) * 0.82); }
.result-badge.new { background: var(--fw-gold); color: var(--ink); }
.result-badge.breakthrough { background: var(--fw-leaf-soft); color: #2f4a26; }
.result-badge.token { background: #b9cf7a; color: #2f4a26; }

/* 초대권 받기 · 납품 */
.order { display: grid; gap: 0.45em; padding: 0.7em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.order.done { background: var(--fw-surface-2); }
.order-title { font-size: calc(var(--fs) * 1.05); }
.order-items { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.3em; }
.order-items li { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45em; font-weight: 800; }
.order-items li.short > span { color: var(--fw-fail); }
.order-reward { display: flex; align-items: center; gap: 0.3em; margin: 0; font-weight: 900; color: var(--fw-accent); }
.order .status-pill { justify-self: start; }

/* 작업: closed tabs, 해금, crew line, 지정 횟수 */
.field-tab.closed { background: var(--fw-surface-2); color: var(--fw-muted); }
.field-tab .lock-tag { position: absolute; top: 0.2em; right: 0.2em; }
.facility-open.closed { cursor: default; }
.unlock-list li { display: flex; align-items: center; gap: 0.5em; padding: 0.45em 0.6em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); font-weight: 800; }
.unlock-list li > span { flex: 1; min-width: 0; }
.unlock-list li.met { background: var(--fw-leaf-soft); }
.unlock-list li.met .icon { color: var(--fw-pass); }
.crew-line { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 0.35em; font-weight: 800; color: var(--fw-text); }
.crew-line .avatar { width: 1.8em; height: 1.8em; }
.queue-row { display: flex; align-items: center; gap: 0.5em; padding: 0.4em 0.55em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.queue-name { display: grid; flex: 1; min-width: 0; }
.queue-add { display: grid; gap: 0.55em; padding-top: 0.5em; border-top: var(--line-in) dashed var(--fw-track); }
.queue-add .pill-tab { display: inline-flex; align-items: center; gap: 0.35em; }
.queue-add .pill-tab .item-tile { width: 1.6em; height: 1.6em; }

/* 자동 판매 */
.auto-sell-row { display: grid; gap: 0.5em; padding: 0.7em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.auto-sell-row.on { background: var(--fw-leaf-soft); }
.auto-sell-head { display: flex; align-items: center; gap: 0.55em; }
.auto-sell-head .protect-name { flex: 1; min-width: 0; display: grid; }
.auto-sell-fields { display: grid; gap: 0.3em; }
.row-actions { display: flex; flex-wrap: wrap; gap: 0.5em; }
.row-actions .button { flex: 1; }

/* 주민: unset field and lit 돌파 leaves */
.tag.field.unset { background: var(--fw-surface-3); color: var(--fw-muted); border-style: dashed; }
.pip.on { background: var(--fw-leaf); }
.passive-block { display: grid; gap: 0.25em; }
.passive-block p { margin: 0; }

@media (max-width: 360px) {
  .draw-title { font-size: calc(var(--fs) * 1.15); }
  .exchange-card { grid-template-columns: auto 1fr auto; }
  .exchange-count { justify-items: start; border-right: 0; }
  .exchange-text { grid-column: 1 / -1; order: 5; }
}
`;
