// Shadow-DOM-scoped styles for the mockup boards (01–05): parchment cards with a dashed inner edge, wooden sign
// plaques, teal primary buttons, leaf-marked section titles, a parchment bottom bar. Drawn with CSS only; the
// illustrated backgrounds, wood and leaves of the mockups are assets for P5 (plan §8).
//
// Sizing: every text size is calc(var(--fs) * n), where --fs is the player's 글자 크기 (설정 → 표시), so text scales
// from one place without em compounding; spacing is in em of the element. Portrait first: no horizontal scroll from
// 320px, a 520px column on wide screens. Only `.scroll` scrolls, so the bottom bar and the toast stay put.
//
// Sections: tokens · frame · top bar · cards · buttons · locked · bottom bar · home · work · facilities · settings ·
// backup · worlds · sheet · diagnostics · focus
export const STYLES = `
:host {
  --fs: var(--fw-font-size, 16px);
  --fw-page: #efe2c2;
  --fw-surface: #fbf4e2;
  --fw-surface-2: #f3e7c9;
  --fw-surface-3: #fffaf0;
  --fw-border: #dcc69a;
  --fw-border-strong: #c2a473;
  --fw-dash: #d8bf8e;
  --fw-text: #46301f;
  --fw-muted: #765d44;
  --fw-accent: #2c7469;
  --fw-accent-strong: #1f564e;
  --fw-on-accent: #fffaf0;
  --fw-wood: #a5703f;
  --fw-wood-light: #c99a63;
  --fw-wood-dark: #6b4426;
  --fw-on-wood: #3d2614;
  --fw-leaf: #5c9447;
  --fw-leaf-soft: #e3edd0;
  --fw-gold: #e9b93f;
  --fw-gold-dark: #b98420;
  --fw-pass: #3b7d3a;
  --fw-fail: #b0372b;
  --fw-blue: #2f63b5;
  --fw-unavailable: #7f6418;
  --fw-track: #d9d2c2;
  display: block;
  height: 100%;
  overflow: hidden;
  color: var(--fw-text);
  color-scheme: light;
  font: 400 var(--fs)/1.5 system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  -webkit-text-size-adjust: 100%;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
* { box-sizing: border-box; }
p { margin: 0; }
.icon { width: 1.35em; height: 1.35em; flex: none; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.icon .fill { fill: currentColor; stroke: none; }
.icon.tiny { width: 0.95em; height: 0.95em; }
.icon.big { width: 2.2em; height: 2.2em; }
.icon.huge { width: 4.5em; height: 4.5em; stroke-width: 1.4; }
.muted-icon { color: var(--fw-muted); }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* ── Frame ─────────────────────────────────────────────────────────────── */
.shell { position: relative; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; }
.column { width: 100%; max-width: 520px; margin: 0 auto; min-height: 100%; display: flex; flex-direction: column; }
.backdrop-forest { background: #e9dcb9; }
.backdrop-forest .scroll {
  background:
    radial-gradient(120% 18em at 20% -4em, #8db86e 0, rgba(141, 184, 110, 0) 70%),
    radial-gradient(90% 16em at 95% -3em, #d8a35a 0, rgba(216, 163, 90, 0) 70%),
    linear-gradient(180deg, #b9d39c 0, #dfe6c2 9em, var(--fw-page) 16em);
}
.backdrop-wood { background: var(--fw-wood-dark); }
.backdrop-wood .scroll {
  background:
    linear-gradient(180deg, rgba(141, 184, 110, 0.75) 0, rgba(141, 184, 110, 0) 7em),
    repeating-linear-gradient(90deg, #8a5a32 0 0.35em, #9a6a3e 0.35em 1.1em, #7d5130 1.1em 1.3em, #a5703f 1.3em 2.4em);
}
.backdrop-wood .page { padding-left: 0.75em; padding-right: 0.75em; }
.page {
  flex: 1 0 auto;
  display: grid;
  gap: 0.75em;
  align-content: start;
  padding: 0.5em 0.9em 1.25em;
}
.page > * { min-width: 0; }
.muted { color: var(--fw-muted); font-size: calc(var(--fs) * 0.875); }
.empty { color: var(--fw-muted); }
.error { color: var(--fw-fail); font-weight: 700; overflow-wrap: anywhere; }
.hint { display: flex; align-items: center; gap: 0.4em; color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.hint.center { justify-content: center; text-align: center; }

/* Toast: the answer to a tap (locked feature, saved, errors), just above the bottom bar. */
.notice {
  position: absolute;
  z-index: 5;
  left: 50%;
  bottom: calc(1em + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  width: min(calc(100% - 1.5em), 480px);
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.6em 0.6em 0.6em 1em;
  border-radius: 0.9em;
  border: 2px solid var(--fw-leaf);
  background: var(--fw-surface-3);
  box-shadow: 0 0.4em 1.2em rgba(60, 35, 15, 0.28);
}
.has-nav .notice { bottom: calc(5.6em + env(safe-area-inset-bottom, 0px)); }
/* While a toast shows, the page can scroll its last controls above it. */
.has-notice .page { padding-bottom: 6em; }
.notice p { flex: 1; min-width: 0; overflow-wrap: anywhere; font-weight: 600; }
.notice.error { border-color: var(--fw-fail); color: var(--fw-fail); background: #fbe9e4; }
.notice-close { flex: none; min-height: 2.75em; padding: 0 0.6em; border: 0; background: none; color: inherit; font: inherit; font-weight: 700; text-decoration: underline; cursor: pointer; }

/* ── Top bar ───────────────────────────────────────────────────────────── */
.top { display: grid; gap: 0.45em; padding: 0.75em 0.75em 0.4em; }
.top-row { display: flex; align-items: center; gap: 0.45em; min-width: 0; }
.top-row.second { justify-content: space-between; }
.sign {
  position: relative;
  margin: 0;
  min-width: 0;
  padding: 0.3em 0.9em;
  border-radius: 0.55em;
  border: 2px solid var(--fw-wood-dark);
  background: linear-gradient(180deg, #e6bf86, var(--fw-wood-light) 55%, #b9844f);
  color: var(--fw-on-wood);
  font-size: calc(var(--fs) * 1.35);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 0.2em 0 var(--fw-wood-dark), inset 0 0 0 2px rgba(255, 240, 210, 0.35);
}
.sign::before, .sign::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 0.35em;
  height: 0.35em;
  margin-top: -0.175em;
  border-radius: 50%;
  background: var(--fw-wood-dark);
  opacity: 0.55;
}
.sign::before { left: 0.35em; }
.sign::after { right: 0.35em; }
.sign-home { flex: 0 1 auto; font-size: calc(var(--fs) * 1.6); padding: 0.25em 0.7em; }
.top-sub .sign { flex: 1 1 auto; }
.top-sub.with-resources .sign { flex: 0 1 auto; font-size: calc(var(--fs) * 1.15); padding: 0.3em 0.6em; }
.top-sub:not(.with-resources) .sign { margin-right: 3.2em; }
.back-button, .back-spacer { flex: none; width: 2.75em; height: 2.75em; }
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.7em;
  border: 2px solid var(--fw-wood-dark);
  background: var(--fw-surface);
  color: var(--fw-wood-dark);
  box-shadow: 0 0.15em 0 var(--fw-wood-dark);
  cursor: pointer;
}
.resources { display: flex; align-items: center; gap: 0.3em; margin-left: auto; min-width: 0; }
.counter {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  min-width: 0;
  min-height: 2.2em;
  padding: 0 0.6em 0 0.2em;
  border-radius: 999px;
  border: 1.5px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.counter-value { font-size: calc(var(--fs) * 0.9); white-space: nowrap; }
button.counter { cursor: pointer; }
.coin {
  flex: none;
  display: inline-block;
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fde9a6, var(--fw-gold) 58%, var(--fw-gold-dark));
  border: 1.5px solid #9c6c17;
}
.ticket-mark { display: inline-flex; color: var(--fw-leaf); padding-left: 0.2em; }
.icon-button {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6em;
  height: 2.6em;
  border-radius: 0.7em;
  border: 2px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-wood-dark);
  cursor: pointer;
}
.icon-button.gear { border: 0; background: none; }
.icon-button.gear .icon { width: 1.8em; height: 1.8em; }
.chip-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  min-height: 2.4em;
  padding: 0.2em 0.9em;
  border-radius: 0.7em;
  border: 1.5px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

/* ── Cards ─────────────────────────────────────────────────────────────── */
.card {
  position: relative;
  display: grid;
  gap: 0.7em;
  align-content: start;
  padding: 1em;
  border-radius: 1em;
  border: 2px solid var(--fw-border);
  background: var(--fw-surface);
  box-shadow: 0 0.2em 0 rgba(107, 68, 38, 0.18);
  outline: 1.5px dashed var(--fw-dash);
  outline-offset: -0.45em;
}
.card > * { min-width: 0; }
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0;
  font-size: calc(var(--fs) * 1.25);
  font-weight: 900;
}
.section-title::before {
  content: "";
  flex: none;
  width: 0.85em;
  height: 0.85em;
  border-radius: 0 70% 0 70%;
  background: var(--fw-leaf);
  box-shadow: 0.3em 0.25em 0 -0.12em #7fb35f;
}
.section-title::after { content: ""; flex: 1; border-top: 1.5px dashed var(--fw-dash); margin-left: 0.25em; }
.card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75em; }
.card-head > div { display: grid; gap: 0.2em; min-width: 0; }

/* ── Buttons ───────────────────────────────────────────────────────────── */
.button {
  position: relative;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45em;
  min-height: 2.75em;
  padding: 0.45em 1.2em;
  border-radius: 0.8em;
  border: 2px solid var(--fw-accent-strong);
  background: linear-gradient(180deg, #3a8a7e, var(--fw-accent));
  color: var(--fw-on-accent);
  font: inherit;
  font-weight: 800;
  box-shadow: 0 0.2em 0 var(--fw-accent-strong);
  cursor: pointer;
}
.button[data-wide] { justify-self: stretch; width: 100%; font-size: calc(var(--fs) * 1.1); }
.button.small { min-height: 2.5em; padding: 0.3em 0.9em; font-size: calc(var(--fs) * 0.95); }
.button.secondary { background: var(--fw-surface); color: var(--fw-wood-dark); border-color: var(--fw-border-strong); box-shadow: 0 0.15em 0 var(--fw-border-strong); }
.button.big-action { min-height: 3.2em; border-radius: 1em; font-size: calc(var(--fs) * 1.2); }
.button:disabled { opacity: 0.55; cursor: not-allowed; }
.outline-button {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  min-height: 2.75em;
  padding: 0.3em 0.9em;
  border-radius: 0.8em;
  border: 2px solid var(--fw-border-strong);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

/* ── Locked (준비 중) ──────────────────────────────────────────────────── */
.lock-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  padding: 0.05em 0.4em;
  border-radius: 999px;
  background: rgba(70, 48, 31, 0.86);
  color: #fff4dc;
  font-size: calc(var(--fs) * 0.68);
  font-weight: 800;
  line-height: 1.5;
  white-space: nowrap;
}
.is-locked { position: relative; cursor: pointer; }
.is-locked > .lock-tag { position: absolute; top: -0.45em; right: -0.25em; z-index: 1; }
.is-locked > :not(.lock-tag) { opacity: 0.72; }
.is-locked.button, .is-locked.outline-button, .is-locked.chip-button { filter: saturate(0.55); }
.locked-block { position: relative; display: grid; gap: 0.7em; border-radius: 0.8em; cursor: pointer; }
/* A block that opens its card puts the tag on the card's top edge, clear of the block's title. */
.card > .locked-block:first-child > .locked-veil { top: -1.75em; }
.locked-block > :not(.locked-veil) { opacity: 0.58; filter: saturate(0.6); }
/* Sits on the block's top edge so it never covers the block's own title. */
.locked-veil {
  position: absolute;
  top: -0.75em;
  right: 0.3em;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.15em 0.6em 0.15em 0.2em;
  border-radius: 999px;
  background: var(--fw-surface-3);
  border: 1.5px solid var(--fw-border-strong);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.8);
  font-weight: 800;
}

/* ── Bottom bar ────────────────────────────────────────────────────────── */
.tabbar {
  position: relative;
  z-index: 3;
  flex: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 0.35em 0.4em calc(0.35em + env(safe-area-inset-bottom, 0px));
  border-radius: 1.2em 1.2em 0 0;
  border: 2px solid var(--fw-border-strong);
  border-bottom: 0;
  background: var(--fw-surface);
  box-shadow: 0 -0.2em 0.6em rgba(60, 35, 15, 0.15);
}
.tab {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.1em;
  min-width: 0;
  min-height: 3.6em;
  padding: 0.25em 0.1em;
  border: 0;
  border-radius: 0.8em;
  background: none;
  color: var(--fw-text);
  font: inherit;
  cursor: pointer;
}
.tab + .tab::before { content: ""; position: absolute; left: 0; top: 20%; bottom: 20%; border-left: 1.5px dashed var(--fw-dash); }
.tab-icon { position: relative; display: inline-flex; color: var(--fw-wood-dark); }
.tab-glyph { width: 1.9em; height: 1.9em; }
.tab-icon .lock-tag { position: absolute; top: -0.3em; right: -1.2em; }
.tab-label { font-size: calc(var(--fs) * 0.85); font-weight: 800; }
.tab.current .tab-label { padding: 0 0.9em; border-radius: 0.5em; background: #5f9a4a; color: #fff; }
.tab.current .tab-icon { color: var(--fw-accent); }
.tab.is-locked .tab-glyph { opacity: 0.6; }

/* ── 홈 (01-1) ─────────────────────────────────────────────────────────── */
.top-home { padding-bottom: 0; }
.chip-button.weather { color: var(--fw-text); }
.scene { position: relative; margin: 0 0 -1.6em; min-height: 17em; aspect-ratio: 390 / 300; }
.scene-art { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.scene-stage { position: absolute; left: 0; right: 0; bottom: 2.6em; display: flex; justify-content: space-around; padding: 0 1em; }
.resident-spot {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: end;
  width: 6.5em;
  height: 8.5em;
  border: 2px dashed rgba(107, 68, 38, 0.45);
  border-radius: 3em 3em 1em 1em;
  background: rgba(255, 250, 240, 0.35);
  color: var(--fw-wood-dark);
  font: inherit;
  cursor: pointer;
}
.spot-shadow { width: 4.5em; height: 0.8em; margin-bottom: 0.35em; border-radius: 50%; background: rgba(70, 48, 31, 0.22); }
.spot-text { margin-bottom: 0.5em; font-weight: 800; font-size: calc(var(--fs) * 0.85); }
.scene-caption {
  position: absolute;
  left: 50%;
  bottom: 2em;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.1em 0.75em;
  border-radius: 999px;
  background: rgba(255, 250, 240, 0.88);
  color: var(--fw-muted);
  font-size: calc(var(--fs) * 0.78);
  white-space: nowrap;
}
.report-card { z-index: 1; }
.report-title { margin: 0; text-align: center; font-size: calc(var(--fs) * 1.4); font-weight: 900; }
.report-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.6em; align-items: center; }
.report-items { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; padding-right: 0.6em; border-right: 1.5px solid var(--fw-border); }
.report-slot { display: grid; justify-items: center; gap: 0.1em; padding: 0.5em 0.2em; border-radius: 0.7em; background: var(--fw-surface-2); }
.slot-art { width: 2.6em; height: 2.6em; border-radius: 0.6em; background: var(--fw-border); }
.slot-name { font-size: calc(var(--fs) * 0.85); font-weight: 700; }
.report-slot strong { font-size: calc(var(--fs) * 1.2); }
.report-actions { display: grid; justify-items: center; gap: 0.4em; }
.report-button { justify-self: stretch; white-space: nowrap; padding-left: 0.6em; padding-right: 0.6em; font-size: calc(var(--fs) * 1.15); }
.report-caption { display: inline-flex; align-items: center; gap: 0.25em; color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.strip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  width: 100%;
  min-height: 2.9em;
  padding: 0.5em 1em;
  border-radius: 0.9em;
  border: 2px solid var(--fw-border);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  outline: 1.5px dashed var(--fw-dash);
  outline-offset: -0.4em;
}
.strip.story { justify-content: flex-start; gap: 0.8em; padding: 0.6em; min-height: 5em; }
.story-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 6em; height: 3.8em; border-radius: 0.7em; background: linear-gradient(135deg, #e7d2a6, #c99a63); color: var(--fw-wood-dark); }
.story-text { flex: 1; display: grid; min-width: 0; }
.story-text strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.story-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.round-arrow { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.6em; height: 2.6em; border-radius: 50%; background: var(--fw-wood-dark); color: #fff4dc; }

/* ── 공방 작업 (01-2) ──────────────────────────────────────────────────── */
.field-tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.3em; margin-bottom: -0.85em; padding: 0 0.15em; }
.field-tab {
  display: grid;
  justify-items: center;
  gap: 0.1em;
  min-width: 0;
  min-height: 4.4em;
  padding: 0.45em 0.1em 0.9em;
  border-radius: 0.8em 0.8em 0 0;
  border: 2px solid var(--fw-border-strong);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}
.field-glyph { width: 1.8em; height: 1.8em; color: var(--fw-leaf); }
.work-card { gap: 0.8em; }
.segmented { display: grid; grid-template-columns: 1fr 1fr; padding: 0.2em; border-radius: 999px; border: 2px solid var(--fw-border-strong); background: var(--fw-surface-3); }
.segment { display: flex; align-items: center; justify-content: center; min-height: 2.6em; border-radius: 999px; font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.segment.selected { background: var(--fw-accent); color: var(--fw-on-accent); }
.facility-entry { display: flex; align-items: center; gap: 0.5em; padding: 0.5em; border-radius: 0.9em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); }
.facility-entry .outline-button { padding: 0.3em 0.6em; }
.facility-open { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.7em; padding: 0.2em; border: 0; border-radius: 0.7em; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.facility-art, .recipe-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 3.4em; height: 3.6em; border-radius: 0.6em; background: var(--fw-surface-2); color: var(--fw-wood-dark); }
.facility-text, .recipe-text { display: grid; min-width: 0; }
.facility-text strong, .recipe-text strong { font-size: calc(var(--fs) * 1.15); font-weight: 900; }
.facility-text span, .recipe-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.recipe { display: flex; align-items: center; gap: 0.8em; padding: 0.6em; border-radius: 0.9em; background: var(--fw-surface-3); }
.recipe-art { width: 5.5em; height: 5em; }
.plan-row, .plan-block { display: grid; gap: 0.5em; padding: 0.6em 0.75em; border-radius: 0.8em; background: var(--fw-surface-2); }
.plan-row { grid-template-columns: auto auto minmax(0, 1fr); align-items: center; }
.plan-label { font-weight: 900; }
.plan-label small { color: var(--fw-muted); font-weight: 500; font-size: calc(var(--fs) * 0.75); }
.stepper { display: inline-flex; align-items: center; border-radius: 0.6em; border: 1.5px solid var(--fw-border-strong); background: var(--fw-surface-3); }
.step { display: inline-flex; align-items: center; justify-content: center; width: 2.2em; height: 2.2em; border-radius: 0.5em; }
.step.plus { background: var(--fw-accent); color: var(--fw-on-accent); }
.step-value { min-width: 2.2em; text-align: center; font-weight: 800; }
.plan-progress { display: grid; gap: 0.25em; min-width: 0; font-size: calc(var(--fs) * 0.85); }
.plan-progress.wide { grid-column: 2 / -1; }
.bar { display: block; height: 0.7em; border-radius: 999px; background: var(--fw-track); }
.usage { display: grid; grid-template-columns: minmax(0, 1.3fr) repeat(3, minmax(0, 1fr)); align-items: center; padding: 0.4em; border-radius: 0.6em; background: var(--fw-surface-3); }
.usage-item { font-weight: 800; padding-left: 0.4em; }
.usage-cell { display: grid; justify-items: center; border-left: 1.5px solid var(--fw-border); }
.usage-cell small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.priority-row { display: flex; align-items: center; gap: 0.6em; padding: 0.45em 0.6em; border-radius: 0.6em; background: var(--fw-surface-3); }
.rank { display: inline-flex; align-items: center; justify-content: center; width: 1.8em; height: 1.8em; border-radius: 0.4em; background: var(--fw-surface-2); font-weight: 900; }
.priority-name { flex: 1; font-weight: 800; }
.rule-actions { display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); gap: 0.6em; }
.rule-actions .button { justify-self: stretch; min-height: 3.1em; }
.button.wide-main { font-size: calc(var(--fs) * 1.15); }

/* ── 시설과 창고 (01-3) ────────────────────────────────────────────────── */
.big-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3em; margin-bottom: -0.85em; }
.big-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  min-height: 3.6em;
  padding-bottom: 0.6em;
  border-radius: 1em 1em 0 0;
  border: 2px solid var(--fw-border-strong);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-size: calc(var(--fs) * 1.25);
  font-weight: 900;
  cursor: pointer;
}
.big-tab.current { background: var(--fw-accent); border-color: var(--fw-accent-strong); color: var(--fw-on-accent); }
.facility { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 0.8em; align-items: start; }
.facility-picture { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 0.9em; background: var(--fw-surface-2); color: var(--fw-wood-dark); }
.facility-info { display: grid; gap: 0.45em; min-width: 0; }
.facility-name { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.facility-level { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.level-next { color: var(--fw-accent); }
.effect-row { display: grid; grid-template-columns: 1fr 1fr; padding: 0.35em 0.6em; border-radius: 0.5em; background: var(--fw-surface-2); font-weight: 700; }
.gold-button { display: flex; align-items: center; justify-content: center; gap: 0.4em; min-height: 3em; border-radius: 0.9em; border: 2px solid var(--fw-gold-dark); background: linear-gradient(180deg, #f8d671, var(--fw-gold)); font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.stock { width: 100%; border-collapse: separate; border-spacing: 0 0.3em; table-layout: fixed; }
.stock th, .stock td { padding: 0.5em 0.25em; text-align: center; overflow-wrap: anywhere; }
.stock thead th { padding: 0.4em 0.2em; background: var(--fw-surface-2); color: var(--fw-muted); font-size: calc(var(--fs) * 0.78); font-weight: 700; }
.stock thead th:first-child { border-radius: 0.5em 0 0 0.5em; width: 28%; }
.stock thead th:last-child { border-radius: 0 0.5em 0.5em 0; }
.stock tbody th, .stock tbody td { background: var(--fw-surface-3); border-top: 1px solid var(--fw-border); border-bottom: 1px solid var(--fw-border); }
.stock tbody th { display: table-cell; text-align: left; font-weight: 800; border-left: 1px solid var(--fw-border); border-radius: 0.6em 0 0 0.6em; }
.stock tbody td:last-child { border-right: 1px solid var(--fw-border); border-radius: 0 0.6em 0.6em 0; }
.num { font-variant-numeric: tabular-nums; font-weight: 900; font-size: calc(var(--fs) * 1.05); }
.num.protected { color: var(--fw-fail); }
.num.reserved { color: var(--fw-blue); }
.num.available { color: var(--fw-pass); }
.item-dot { display: inline-block; width: 1.1em; height: 1.1em; margin-right: 0.35em; vertical-align: -0.15em; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #f2c48d, var(--fw-wood)); }
.item-dot.big { width: 2.2em; height: 2.2em; margin: 0; }
.storage-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(6.5em, 1fr)); gap: 0.5em; }
.storage-item { display: grid; justify-items: center; gap: 0.2em; padding: 0.7em 0.3em; border-radius: 0.8em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); text-align: center; }
.storage-name { font-weight: 700; overflow-wrap: anywhere; }
.storage-item strong { font-size: calc(var(--fs) * 1.2); font-variant-numeric: tabular-nums; }
.toggle-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7em;
  width: 100%;
  min-height: 3.6em;
  padding: 0.55em 0.75em;
  border-radius: 0.8em;
  border: 1.5px solid var(--fw-border);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.toggle-icon { flex: none; display: inline-flex; color: var(--fw-leaf); }
.toggle-text { flex: 1; display: grid; min-width: 0; }
.toggle-text strong { font-size: calc(var(--fs) * 1.05); font-weight: 900; }
.toggle-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.82); }
.switch { flex: none; position: relative; display: inline-flex; align-items: center; justify-content: flex-end; width: 3.4em; height: 1.9em; padding: 0 0.5em; border-radius: 999px; background: #8a8378; }
.switch.on { background: var(--fw-leaf); justify-content: flex-start; }
.switch .knob { position: absolute; top: 0.2em; left: 0.2em; width: 1.5em; height: 1.5em; border-radius: 50%; background: #fff; box-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.25); }
.switch.on .knob { left: auto; right: 0.2em; }
.switch:has(.switch-label) { width: 4.8em; }
.switch-label { color: #fff; font-size: calc(var(--fs) * 0.75); font-weight: 800; }

/* ── 설정 (04-1) ───────────────────────────────────────────────────────── */
/* Flex with wrap: at large text sizes or on narrow phones the field drops to its own line instead of shrinking. */
.setting-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  padding: 0.55em 0.6em;
  border-radius: 0.8em;
  border: 1.5px solid var(--fw-border);
  background: var(--fw-surface-3);
}
.row-leaf { color: var(--fw-leaf); }
.setting-label { font-weight: 800; white-space: nowrap; }
.input {
  width: 100%;
  min-width: 0;
  min-height: 2.6em;
  padding: 0.35em 0.7em;
  border: 1.5px solid var(--fw-border-strong);
  border-radius: 0.6em;
  background: #fffdf6;
  color: var(--fw-text);
  font: inherit;
}
.input.readonly { display: inline-flex; align-items: center; gap: 0.4em; color: var(--fw-muted); overflow: hidden; white-space: nowrap; }
.setting-block { display: grid; gap: 0.5em; padding: 0.55em 0.6em 0.75em; border-radius: 0.8em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); }
.setting-block .setting-row { padding: 0; border: 0; background: none; }
/* The field and its button wrap together. */
.setting-field { flex: 1 1 12em; min-width: 0; display: flex; align-items: center; gap: 0.5em; }
.setting-field > .input { flex: 1 1 auto; }
.setting-field > .button { flex: none; white-space: nowrap; }
.setting-row > .slider { flex: 1 1 6em; width: auto; }
.setting-row > .button, .setting-row > .icon, .setting-label, .slider-value { flex: none; }
.slider { width: 100%; min-width: 0; min-height: 2.6em; accent-color: var(--fw-leaf); }
.slider-value { min-width: 3em; text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
.font-preview { margin: 0 0.5em; padding: 0.6em; border-radius: 0.6em; border: 1.5px dashed var(--fw-border-strong); background: var(--fw-surface-2); text-align: center; font-size: var(--fs); }
.manage-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75em;
  width: 100%;
  min-height: 3.1em;
  padding: 0.4em 0.75em;
  border: 1.5px solid var(--fw-border);
  border-radius: 0.7em;
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.manage-icon { flex: none; display: inline-flex; color: var(--fw-wood); }
.manage-title { flex: 1; font-weight: 800; }
.menu-chevron { flex: none; display: inline-flex; color: var(--fw-wood-dark); }
.note-box { display: flex; align-items: center; gap: 0.75em; padding: 0.65em 0.9em; border-radius: 0.8em; background: var(--fw-leaf-soft); color: #3f5b33; }
.note-box .icon { width: 1.8em; height: 1.8em; }
.note-box > span { display: grid; }
.note-box strong { font-weight: 800; }
.note-box span span { font-size: calc(var(--fs) * 0.85); }
.footnote { justify-self: center; max-width: 100%; padding: 0.3em 1.1em; border-radius: 999px; border: 1.5px solid var(--fw-border-strong); background: var(--fw-surface); color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); text-align: center; }

/* ── 저장·백업 (05-2) ──────────────────────────────────────────────────── */
.card.saved { justify-items: center; gap: 0.3em; padding: 1.2em 1em; }
.saved-title { display: flex; align-items: center; gap: 0.5em; font-size: calc(var(--fs) * 1.7); font-weight: 900; }
.check { display: inline-flex; width: 1.7em; height: 1.7em; align-items: center; justify-content: center; border-radius: 50%; background: var(--fw-pass); color: #fff; }
.check .icon { width: 1.1em; height: 1.1em; stroke-width: 3; }
.saved-time { color: var(--fw-muted); font-size: calc(var(--fs) * 1.05); }
.usage-rows { display: grid; padding: 0.3em 0.75em; border-radius: 0.8em; border: 1.5px solid var(--fw-border); background: var(--fw-surface-3); }
.usage-row { display: grid; grid-template-columns: auto 4.6em minmax(0, 1fr) 4.6em; align-items: center; gap: 0.6em; padding: 0.55em 0; }
.usage-row + .usage-row { border-top: 1px solid var(--fw-border); }
.usage-row .icon { color: var(--fw-wood-dark); }
.usage-label { font-weight: 700; }
.usage-bar { display: block; height: 0.9em; border-radius: 999px; background: var(--fw-track); overflow: hidden; }
.usage-fill { display: block; height: 100%; border-radius: 999px; background: #2f9a7f; }
.usage-size { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
.menu { gap: 0.55em; }
.menu-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8em;
  width: 100%;
  min-height: 3.8em;
  padding: 0.6em 0.75em;
  border-radius: 0.8em;
  border: 1.5px solid var(--fw-border);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.menu-row:disabled { opacity: 0.55; cursor: not-allowed; }
.menu-icon { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.9em; height: 2.9em; border-radius: 0.7em; background: var(--fw-accent); color: var(--fw-on-accent); box-shadow: 0 0.15em 0 var(--fw-accent-strong); }
.menu-icon.light, .menu-icon.quiet { background: var(--fw-surface-2); color: var(--fw-wood-dark); box-shadow: none; border: 1.5px solid var(--fw-border); }
.menu-text { display: grid; flex: 1; min-width: 0; }
.menu-title { font-size: calc(var(--fs) * 1.1); font-weight: 900; overflow-wrap: anywhere; }
.menu-row.quiet .menu-title { font-size: var(--fs); }
.menu-detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.menu-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
label.menu-row:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.restore { display: grid; gap: 0.55em; }
.preview-box { display: grid; gap: 0.45em; padding: 0.75em; border-radius: 0.8em; border: 1.5px dashed var(--fw-border-strong); background: var(--fw-surface); }
.preview-head { display: flex; align-items: center; gap: 0.45em; font-size: calc(var(--fs) * 1.05); }
.preview-head .icon { color: var(--fw-accent); }
.preview-rows { display: grid; padding: 0.2em 0.75em; border-radius: 0.6em; border: 1px solid var(--fw-border); background: var(--fw-surface-3); }
.preview-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.75em; padding: 0.4em 0; }
.preview-row + .preview-row { border-top: 1px solid var(--fw-border); }
.preview-row .icon { color: var(--fw-wood); }
.preview-row strong { font-variant-numeric: tabular-nums; }

/* ── 세계 고르기 ───────────────────────────────────────────────────────── */
.form { gap: 0.5em; }
.form .button { margin-top: 0.4em; }
.field-label { font-weight: 800; }

/* ── 시작 꾸러미 (sheet) ───────────────────────────────────────────────── */
.sheet-backdrop { position: absolute; inset: 0; z-index: 10; display: flex; align-items: flex-end; justify-content: center; padding: 0.75em; background: rgba(40, 25, 12, 0.45); }
.sheet { width: min(100%, 480px); max-height: 100%; overflow-y: auto; gap: 0.75em; padding: 1.25em; }
.kit { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4em; }
.kit-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.6em; padding: 0.55em 0.8em; border-radius: 0.7em; background: var(--fw-surface-2); font-weight: 700; }
.kit-item .icon { color: var(--fw-leaf); }
.kit-item strong { font-variant-numeric: tabular-nums; }

/* ── 연결 점검 ─────────────────────────────────────────────────────────── */
.diagnostics { display: grid; gap: 0.75em; min-width: 0; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; min-width: 0; }
.row.stacked { display: grid; gap: 0.25em; padding-bottom: 0.5em; border-bottom: 1px solid var(--fw-border); }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.badge { flex: none; font-size: calc(var(--fs) * 0.8); font-weight: 800; padding: 0.1em 0.55em; border-radius: 999px; border: 1px solid currentColor; background: var(--fw-surface-3); }
.badge.pass { color: var(--fw-pass); }
.badge.fail { color: var(--fw-fail); }
.badge.unavailable { color: var(--fw-unavailable); }
.file { width: 100%; max-width: 100%; font: inherit; min-height: 2.75em; }
.stage {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 12em;
  padding: 0.75em;
  border-radius: 0.6em;
  background-color: #efe6d0;
  background-image: linear-gradient(45deg, #ddd0b2 25%, transparent 25%, transparent 75%, #ddd0b2 75%),
    linear-gradient(45deg, #ddd0b2 25%, transparent 25%, transparent 75%, #ddd0b2 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22em; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25em 0.75em; font-size: calc(var(--fs) * 0.9); }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; font-weight: 700; }

/* ── Narrow phones ─────────────────────────────────────────────────────── */
@media (max-width: 380px) {
  .top { padding-left: 0.5em; padding-right: 0.5em; }
  .sign-home { font-size: calc(var(--fs) * 1.3); }
  .top-sub.with-resources .sign { font-size: var(--fs); padding: 0.3em 0.45em; }
  .coin { width: 1.3em; height: 1.3em; }
  .counter { padding-right: 0.45em; }
  .icon-button.gear { width: 2.2em; }
  .field-tab { font-size: calc(var(--fs) * 0.85); }
  .report-body { grid-template-columns: 1fr; }
  .report-items { padding-right: 0; border-right: 0; }
  .facility { grid-template-columns: 1fr; }
  .facility-picture { aspect-ratio: auto; min-height: 6em; }
  .plan-row { grid-template-columns: auto minmax(0, 1fr); }
  .plan-row .plan-progress { grid-column: 1 / -1; }
  .usage-row { grid-template-columns: auto minmax(0, 1fr) auto; }
  .usage-row .usage-label { grid-column: 2; }
  .usage-row .usage-bar { grid-column: 1 / -1; grid-row: 2; }
}

/* ── Focus ─────────────────────────────────────────────────────────────── */
button:focus-visible, .locked-block:focus-visible, .input:focus-visible, .slider:focus-visible, .file:focus-visible {
  outline: 3px solid var(--fw-accent);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
`;
