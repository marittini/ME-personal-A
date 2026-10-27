// Shadow-DOM-scoped styles for the mockup boards (01–05), in the boards' storybook look: flat fills, one dark-brown
// ink line about 3px thick around every shape, a flat "sticker" drop under raised things, no hairlines and no
// gradients that blur colour into colour. Hard-stopped stripes (wood planks) and flat silhouettes (hedges) are the only
// patterns. The illustrated backgrounds, wood and leaves of the mockups are assets for P5 (plan §8).
//
// Tokens: --ink is the outline colour, --line the outline width, --drop the flat drop under raised elements. Every
// text size is calc(var(--fs) * n), where --fs is the player's 글자 크기 (설정 → 표시); spacing is in em.
// Portrait first: no horizontal scroll from 320px, a 520px column on wide screens. Only `.scroll` scrolls.
//
// Sections: tokens · frame · top bar · cards · buttons · locked · bottom bar · home · work · facilities · settings ·
// backup · worlds · sheet · diagnostics · focus. Resident boards: styles-residents.ts.

/** Flat hedge silhouette along the top of the open-air screens (no blur, no gradient). */
const HEDGE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 48'%3E%3Cpath d='M0 0h120v26c-8 0-10 12-20 12S88 22 78 22 66 36 56 36 44 20 34 20 22 34 12 34 4 26 0 26z' fill='%2394bf74' stroke='%235f8f45' stroke-width='3'/%3E%3C/svg%3E")`;

export const STYLES = `
:host {
  --fs: var(--fw-font-size, 16px);
  --ink: #4b2e1a;
  --line: 3px;
  --line-in: 2.5px;
  --drop: 0 0.22em 0 var(--ink);
  --fw-page: #f1e4c3;
  --fw-surface: #fbf1da;
  --fw-surface-2: #f2e2bd;
  --fw-surface-3: #fff8e8;
  --fw-text: #3f2717;
  --fw-muted: #7a5a3d;
  --fw-accent: #2e7f72;
  --fw-on-accent: #fffaf0;
  --fw-wood: #c58a52;
  --fw-wood-dark: #8a5a33;
  --fw-leaf: #5a9a44;
  --fw-leaf-soft: #dcebc4;
  --fw-gold: #f3c34a;
  --fw-pass: #3f8a3d;
  --fw-fail: #c0433a;
  --fw-blue: #3a6fc0;
  --fw-unavailable: #8a6a12;
  --fw-track: #e4d6b6;
  display: block;
  height: 100%;
  overflow: hidden;
  color: var(--fw-text);
  color-scheme: light;
  font: 500 var(--fs)/1.5 system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  -webkit-text-size-adjust: 100%;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
* { box-sizing: border-box; }
p { margin: 0; }
.icon { width: 1.35em; height: 1.35em; flex: none; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.icon .fill { fill: currentColor; stroke: none; }
.icon.tiny { width: 0.95em; height: 0.95em; }
.icon.big { width: 2.2em; height: 2.2em; }
.icon.huge { width: 4.5em; height: 4.5em; stroke-width: 2; }
.muted-icon { color: var(--fw-muted); }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* ── Frame ─────────────────────────────────────────────────────────────── */
.shell { position: relative; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; }
.column { width: 100%; max-width: 520px; margin: 0 auto; min-height: 100%; display: flex; flex-direction: column; }
.backdrop-forest { background: var(--fw-page); }
.backdrop-forest .scroll {
  background-color: var(--fw-page);
  background-image: ${HEDGE}, linear-gradient(#94bf74, #94bf74);
  background-repeat: repeat-x, no-repeat;
  background-size: 7.5em 3em, 100% 5.2em;
  background-position: 0 5.1em, 0 0;
}
.backdrop-wood { background: #a8703f; }
.backdrop-wood .scroll {
  background-color: #a8703f;
  background-image: ${HEDGE}, linear-gradient(#94bf74, #94bf74),
    repeating-linear-gradient(90deg, #b07a46 0 2.4em, var(--ink) 2.4em calc(2.4em + 3px), #a8703f calc(2.4em + 3px) 4.8em, var(--ink) 4.8em calc(4.8em + 3px));
  background-repeat: repeat-x, no-repeat, repeat;
  background-size: 7.5em 3em, 100% 5.2em, auto;
  background-position: 0 5.1em, 0 0, 0 0;
}
.backdrop-wood .page { padding-left: 0.75em; padding-right: 0.75em; }
.page {
  flex: 1 0 auto;
  display: grid;
  gap: 0.85em;
  align-content: start;
  padding: 0.6em 0.9em 1.25em;
}
.page > * { min-width: 0; }
.muted { color: var(--fw-muted); font-size: calc(var(--fs) * 0.875); }
.empty { color: var(--fw-muted); }
.error { color: var(--fw-fail); font-weight: 800; overflow-wrap: anywhere; }
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
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  box-shadow: var(--drop);
}
.has-nav .notice { bottom: calc(5.8em + env(safe-area-inset-bottom, 0px)); }
/* While a toast shows, the page can scroll its last controls above it. */
.has-notice .page { padding-bottom: 6em; }
.notice p { flex: 1; min-width: 0; overflow-wrap: anywhere; font-weight: 700; }
.notice.error { color: var(--fw-fail); background: #fde9e2; }
.notice-close { flex: none; min-height: 2.75em; padding: 0 0.6em; border: 0; background: none; color: inherit; font: inherit; font-weight: 800; text-decoration: underline; text-decoration-thickness: 2px; cursor: pointer; }

/* ── Top bar ───────────────────────────────────────────────────────────── */
.top { display: grid; gap: 0.45em; padding: 0.75em 0.75em 0.4em; }
.top-row { display: flex; align-items: center; gap: 0.45em; min-width: 0; }
.top-row.second { justify-content: space-between; }
.sign {
  position: relative;
  margin: 0;
  min-width: 0;
  padding: 0.28em 1em;
  border-radius: 0.6em;
  border: var(--line) solid var(--ink);
  background: var(--fw-wood);
  color: var(--ink);
  font-size: calc(var(--fs) * 1.4);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: var(--drop), inset 0 -0.3em 0 #b07a46;
}
.sign::before, .sign::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 0.38em;
  height: 0.38em;
  margin-top: -0.19em;
  border-radius: 50%;
  background: var(--ink);
}
.sign::before { left: 0.38em; }
.sign::after { right: 0.38em; }
.sign-home { flex: 0 1 auto; font-size: calc(var(--fs) * 1.6); padding: 0.22em 0.95em; }
.top-sub .sign { flex: 1 1 auto; }
.top-sub.with-resources .sign { flex: 0 1 auto; font-size: calc(var(--fs) * 1.05); padding: 0.32em 0.95em; }
.top-sub:not(.with-resources) .sign { margin-right: 3.2em; }
.back-button, .back-spacer { flex: none; width: 2.75em; height: 2.75em; }
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--ink);
  box-shadow: var(--drop);
  cursor: pointer;
}
.back-button .icon { stroke-width: 3; }
.resources { display: flex; align-items: center; gap: 0.3em; margin-left: auto; min-width: 0; }
.counter {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  min-width: 0;
  min-height: 2.2em;
  padding: 0 0.65em 0 0.15em;
  border-radius: 999px;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}
.counter-value { font-size: calc(var(--fs) * 0.9); white-space: nowrap; }
button.counter { cursor: pointer; }
.coin {
  flex: none;
  display: inline-block;
  width: 1.65em;
  height: 1.65em;
  border-radius: 50%;
  background: var(--fw-gold);
  border: var(--line-in) solid var(--ink);
  box-shadow: inset 0 0 0 0.22em var(--fw-gold), inset 0 0 0 0.36em #d9a22c;
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
  border-radius: 0.75em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--ink);
  box-shadow: var(--drop);
  cursor: pointer;
}
.icon-button.gear { border: 0; background: none; box-shadow: none; }
.icon-button.gear .icon { width: 1.9em; height: 1.9em; stroke-width: 2.6; }
.chip-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  min-height: 2.4em;
  padding: 0.2em 0.9em;
  border-radius: 0.8em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  box-shadow: var(--drop);
  cursor: pointer;
}

/* ── Cards ─────────────────────────────────────────────────────────────── */
.card {
  position: relative;
  display: grid;
  gap: 0.75em;
  align-content: start;
  padding: 1em;
  border-radius: 1.1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface);
  box-shadow: var(--drop);
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
/* A flat leaf with the same ink outline as everything else. */
.section-title::before {
  content: "";
  flex: none;
  width: 0.9em;
  height: 0.9em;
  border-radius: 0 75% 0 75%;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-leaf);
}
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
  min-height: 2.8em;
  padding: 0.45em 1.2em;
  border-radius: 0.85em;
  border: var(--line) solid var(--ink);
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  font: inherit;
  font-weight: 900;
  box-shadow: var(--drop);
  cursor: pointer;
}
.button:active:not(:disabled) { transform: translateY(0.15em); box-shadow: 0 0.07em 0 var(--ink); }
.button[data-wide] { justify-self: stretch; width: 100%; font-size: calc(var(--fs) * 1.1); }
.button.small { min-height: 2.5em; padding: 0.3em 0.9em; font-size: calc(var(--fs) * 0.95); }
.button.secondary { background: var(--fw-surface-3); color: var(--fw-text); }
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
  border-radius: 0.85em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  box-shadow: var(--drop);
  cursor: pointer;
}

/* ── Locked (준비 중) ──────────────────────────────────────────────────── */
.lock-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  padding: 0.05em 0.45em;
  border-radius: 999px;
  border: 2px solid var(--fw-surface-3);
  background: var(--ink);
  color: #fff4dc;
  font-size: calc(var(--fs) * 0.68);
  font-weight: 900;
  line-height: 1.45;
  white-space: nowrap;
}
.is-locked { position: relative; cursor: pointer; }
.is-locked > .lock-tag { position: absolute; top: -0.55em; right: -0.35em; z-index: 1; }
.is-locked > :not(.lock-tag) { opacity: 0.6; }
.is-locked.button { background: #8fb3ab; }
.locked-block { position: relative; display: grid; gap: 0.75em; border-radius: 0.8em; cursor: pointer; }
/* A block that opens its card puts the tag on the card's top edge, clear of the block's title. */
.card > .locked-block:first-child > .locked-veil { top: -1.8em; }
.locked-block > :not(.locked-veil) { opacity: 0.55; }
/* Sits on the block's top edge so it never covers the block's own title. */
.locked-veil {
  position: absolute;
  top: -0.8em;
  right: 0.3em;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.12em 0.65em 0.12em 0.2em;
  border-radius: 999px;
  background: var(--fw-surface-3);
  border: var(--line-in) solid var(--ink);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.8);
  font-weight: 900;
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
  padding: 0.4em 0.4em calc(0.4em + env(safe-area-inset-bottom, 0px));
  border-radius: 1.3em 1.3em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
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
.tab + .tab::before { content: ""; position: absolute; left: -1px; top: 18%; bottom: 18%; border-left: var(--line-in) solid #d8bf93; }
.tab-icon { position: relative; display: inline-flex; color: var(--ink); }
.tab-glyph { width: 1.95em; height: 1.95em; stroke-width: 2.4; }
.tab-icon .lock-tag { position: absolute; top: -0.3em; right: -1.2em; }
.tab-label { font-size: calc(var(--fs) * 0.85); font-weight: 900; }
.tab.current .tab-label { padding: 0 0.9em; border-radius: 0.55em; border: var(--line-in) solid var(--ink); background: #5f9a4a; color: #fff; }
.tab.current .tab-icon { color: var(--fw-accent); }
.tab.is-locked .tab-glyph { opacity: 0.5; }

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
  border: var(--line) dashed var(--ink);
  border-radius: 3em 3em 1em 1em;
  background: rgba(255, 248, 232, 0.55);
  color: var(--ink);
  font: inherit;
  cursor: pointer;
}
.spot-shadow { width: 4.5em; height: 0.8em; margin-bottom: 0.35em; border-radius: 50%; background: rgba(75, 46, 26, 0.25); }
.spot-text { margin-bottom: 0.5em; font-weight: 900; font-size: calc(var(--fs) * 0.85); }
.scene-caption {
  position: absolute;
  left: 50%;
  bottom: 2em;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.1em 0.8em;
  border-radius: 999px;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.78);
  font-weight: 800;
  white-space: nowrap;
}
.report-card { z-index: 1; }
.report-title { margin: 0; text-align: center; font-size: calc(var(--fs) * 1.45); font-weight: 900; }
.report-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.6em; align-items: center; }
.report-items { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; padding-right: 0.6em; border-right: var(--line-in) solid #d8bf93; }
.report-slot { display: grid; justify-items: center; gap: 0.1em; padding: 0.5em 0.2em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); }
.slot-art { width: 2.6em; height: 2.6em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.slot-name { font-size: calc(var(--fs) * 0.85); font-weight: 800; }
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
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  text-align: left;
  box-shadow: var(--drop);
  cursor: pointer;
}
.strip.story { justify-content: flex-start; gap: 0.8em; padding: 0.6em; min-height: 5em; }
.story-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 6em; height: 3.8em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: #e9c995; color: var(--ink); }
.story-text { flex: 1; display: grid; min-width: 0; }
.story-text strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.story-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.round-arrow { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.6em; height: 2.6em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-wood-dark); color: #fff4dc; }
.round-arrow .icon { stroke-width: 3; }

/* ── 공방 작업 (01-2) ──────────────────────────────────────────────────── */
.field-tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.3em; margin-bottom: -0.95em; padding: 0 0.15em; }
.field-tab {
  display: grid;
  justify-items: center;
  gap: 0.1em;
  min-width: 0;
  min-height: 4.5em;
  padding: 0.45em 0.1em 1em;
  border-radius: 0.9em 0.9em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}
.field-glyph { width: 1.8em; height: 1.8em; color: var(--fw-leaf); }
.work-card { gap: 0.85em; }
.segmented { display: grid; grid-template-columns: 1fr 1fr; padding: 0.22em; border-radius: 999px; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.segment { display: flex; align-items: center; justify-content: center; min-height: 2.6em; border-radius: 999px; font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.segment.selected { border: var(--line-in) solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); }
.facility-entry { display: flex; align-items: center; gap: 0.5em; padding: 0.5em; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.facility-entry .outline-button { padding: 0.3em 0.6em; }
.facility-open { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.7em; padding: 0.2em; border: 0; border-radius: 0.7em; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.facility-art, .recipe-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 3.4em; height: 3.6em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: var(--ink); }
.facility-text, .recipe-text { display: grid; min-width: 0; }
.facility-text strong, .recipe-text strong { font-size: calc(var(--fs) * 1.15); font-weight: 900; }
.facility-text span, .recipe-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.recipe { display: flex; align-items: center; gap: 0.8em; padding: 0.6em; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.recipe-art { width: 5.5em; height: 5em; }
.plan-row, .plan-block { display: grid; gap: 0.5em; padding: 0.6em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); }
.plan-row { grid-template-columns: auto auto minmax(0, 1fr); align-items: center; }
.plan-label { font-weight: 900; }
.plan-label small { color: var(--fw-muted); font-weight: 600; font-size: calc(var(--fs) * 0.75); }
.stepper { display: inline-flex; align-items: center; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); overflow: hidden; }
.step { display: inline-flex; align-items: center; justify-content: center; width: 2.2em; height: 2.2em; }
.step.plus { background: var(--fw-accent); color: var(--fw-on-accent); border-left: var(--line-in) solid var(--ink); }
.step-value { min-width: 2.2em; text-align: center; font-weight: 900; }
.plan-progress { display: grid; gap: 0.25em; min-width: 0; font-size: calc(var(--fs) * 0.85); }
.plan-progress.wide { grid-column: 2 / -1; }
.bar { display: block; height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); }
.usage { display: grid; grid-template-columns: minmax(0, 1.3fr) repeat(3, minmax(0, 1fr)); align-items: center; padding: 0.4em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.usage-item { font-weight: 900; padding-left: 0.4em; }
.usage-cell { display: grid; justify-items: center; border-left: var(--line-in) solid #d8bf93; }
.usage-cell small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.priority-row { display: flex; align-items: center; gap: 0.6em; padding: 0.45em 0.6em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.rank { display: inline-flex; align-items: center; justify-content: center; width: 1.8em; height: 1.8em; border-radius: 0.45em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 900; }
.priority-name { flex: 1; font-weight: 900; }
.rule-actions { display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); gap: 0.6em; }
.rule-actions .button { justify-self: stretch; min-height: 3.1em; }
.button.wide-main { font-size: calc(var(--fs) * 1.15); }

/* ── 시설과 창고 (01-3) ────────────────────────────────────────────────── */
.big-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3em; margin-bottom: -0.95em; }
.big-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  min-height: 3.7em;
  padding-bottom: 0.7em;
  border-radius: 1.1em 1.1em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-size: calc(var(--fs) * 1.25);
  font-weight: 900;
  cursor: pointer;
}
.big-tab.current { background: var(--fw-accent); color: var(--fw-on-accent); }
.facility { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 0.8em; align-items: start; }
.facility-picture { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: var(--ink); }
.facility-info { display: grid; gap: 0.45em; min-width: 0; }
.facility-name { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.facility-level { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.level-next { color: var(--fw-accent); }
.effect-row { display: grid; grid-template-columns: 1fr 1fr; padding: 0.35em 0.6em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 800; }
.gold-button { display: flex; align-items: center; justify-content: center; gap: 0.4em; min-height: 3em; border-radius: 1em; border: var(--line) solid var(--ink); background: var(--fw-gold); box-shadow: var(--drop); font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.stock { width: 100%; border-collapse: separate; border-spacing: 0 0.35em; table-layout: fixed; }
.stock th, .stock td { padding: 0.5em 0.25em; text-align: center; overflow-wrap: anywhere; }
.stock thead th { padding: 0.4em 0.2em; background: var(--fw-surface-2); color: var(--fw-muted); font-size: calc(var(--fs) * 0.78); font-weight: 800; border-top: var(--line-in) solid var(--ink); border-bottom: var(--line-in) solid var(--ink); }
.stock thead th:first-child { border-left: var(--line-in) solid var(--ink); border-radius: 0.6em 0 0 0.6em; width: 28%; }
.stock thead th:last-child { border-right: var(--line-in) solid var(--ink); border-radius: 0 0.6em 0.6em 0; }
.stock tbody th, .stock tbody td { background: var(--fw-surface-3); border-top: var(--line-in) solid var(--ink); border-bottom: var(--line-in) solid var(--ink); }
.stock tbody th { display: table-cell; text-align: left; font-weight: 900; border-left: var(--line-in) solid var(--ink); border-radius: 0.7em 0 0 0.7em; }
.stock tbody td:last-child { border-right: var(--line-in) solid var(--ink); border-radius: 0 0.7em 0.7em 0; }
.num { font-variant-numeric: tabular-nums; font-weight: 900; font-size: calc(var(--fs) * 1.05); }
.num.protected { color: var(--fw-fail); }
.num.reserved { color: var(--fw-blue); }
.num.available { color: var(--fw-pass); }
.item-dot { display: inline-block; width: 1.1em; height: 1.1em; margin-right: 0.35em; vertical-align: -0.15em; border-radius: 50%; border: 2px solid var(--ink); background: var(--fw-wood); }
.item-dot.big { width: 2.2em; height: 2.2em; margin: 0; border-width: var(--line-in); }
.storage-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(6.5em, 1fr)); gap: 0.55em; }
.storage-item { display: grid; justify-items: center; gap: 0.2em; padding: 0.7em 0.3em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: center; }
.storage-name { font-weight: 800; overflow-wrap: anywhere; }
.storage-item strong { font-size: calc(var(--fs) * 1.2); font-variant-numeric: tabular-nums; }
.toggle-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7em;
  width: 100%;
  min-height: 3.6em;
  padding: 0.55em 0.75em;
  border-radius: 0.9em;
  border: var(--line-in) solid var(--ink);
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
.switch { flex: none; position: relative; display: inline-flex; align-items: center; justify-content: flex-end; width: 3.5em; height: 2em; padding: 0 0.5em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #9b8f80; }
.switch.on { background: var(--fw-leaf); justify-content: flex-start; }
.switch .knob { position: absolute; top: 0.12em; left: 0.12em; width: 1.45em; height: 1.45em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: #fff; }
.switch.on .knob { left: auto; right: 0.12em; }
.switch:has(.switch-label) { width: 4.9em; }
.switch-label { color: #fff; font-size: calc(var(--fs) * 0.75); font-weight: 900; }

/* ── 설정 (04-1) ───────────────────────────────────────────────────────── */
/* Flex with wrap: at large text sizes or on narrow phones the field drops to its own line instead of shrinking. */
.setting-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  padding: 0.55em 0.65em;
  border-radius: 0.9em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
}
.row-leaf { color: var(--fw-leaf); }
.setting-label { font-weight: 900; white-space: nowrap; }
.input {
  width: 100%;
  min-width: 0;
  min-height: 2.6em;
  padding: 0.35em 0.7em;
  border: var(--line-in) solid var(--ink);
  border-radius: 0.7em;
  background: #fffdf6;
  color: var(--fw-text);
  font: inherit;
}
.input.readonly { display: inline-flex; align-items: center; gap: 0.4em; color: var(--fw-muted); overflow: hidden; white-space: nowrap; }
.setting-block { display: grid; gap: 0.5em; padding: 0.55em 0.65em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.setting-block .setting-row { padding: 0; border: 0; background: none; }
/* The field and its button wrap together. */
.setting-field { flex: 1 1 12em; min-width: 0; display: flex; align-items: center; gap: 0.5em; }
.setting-field > .input { flex: 1 1 auto; }
.setting-field > .button { flex: none; white-space: nowrap; }
.setting-row > .slider { flex: 1 1 6em; width: auto; }
.setting-row > .button, .setting-row > .icon, .setting-label, .slider-value { flex: none; }
/* Range: a flat track with an ink outline and a round ink-outlined thumb. */
.slider { -webkit-appearance: none; appearance: none; width: 100%; min-width: 0; height: 2.6em; background: none; cursor: pointer; }
.slider::-webkit-slider-runnable-track { height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-leaf); }
.slider::-moz-range-track { height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); }
.slider::-moz-range-progress { height: 0.85em; border-radius: 999px; background: var(--fw-leaf); }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 1.5em; height: 1.5em; margin-top: -0.5em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.slider::-moz-range-thumb { width: 1.2em; height: 1.2em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.slider-value { min-width: 3em; text-align: right; font-weight: 800; font-variant-numeric: tabular-nums; }
.font-preview { margin: 0 0.5em; padding: 0.6em; border-radius: 0.7em; border: var(--line-in) dashed var(--ink); background: var(--fw-surface-2); text-align: center; font-size: var(--fs); }
.manage-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75em;
  width: 100%;
  min-height: 3.1em;
  padding: 0.4em 0.75em;
  border: var(--line-in) solid var(--ink);
  border-radius: 0.85em;
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.manage-icon { flex: none; display: inline-flex; color: var(--fw-wood-dark); }
.manage-title { flex: 1; font-weight: 900; }
.menu-chevron { flex: none; display: inline-flex; color: var(--ink); }
.menu-chevron .icon { stroke-width: 3; }
.note-box { display: flex; align-items: center; gap: 0.75em; padding: 0.65em 0.9em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-leaf-soft); color: #33502a; }
.note-box .icon { width: 1.8em; height: 1.8em; }
.note-box > span { display: grid; }
.note-box strong { font-weight: 900; }
.note-box span span { font-size: calc(var(--fs) * 0.85); }
.footnote { justify-self: center; max-width: 100%; padding: 0.3em 1.1em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-surface); color: var(--fw-text); font-size: calc(var(--fs) * 0.85); font-weight: 700; text-align: center; }

/* ── 저장·백업 (05-2) ──────────────────────────────────────────────────── */
.card.saved { justify-items: center; gap: 0.3em; padding: 1.2em 1em; }
.saved-title { display: flex; align-items: center; gap: 0.5em; font-size: calc(var(--fs) * 1.7); font-weight: 900; }
.check { display: inline-flex; width: 1.75em; height: 1.75em; align-items: center; justify-content: center; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-pass); color: #fff; }
.check .icon { width: 1.1em; height: 1.1em; stroke-width: 3.4; }
.saved-time { color: var(--fw-muted); font-size: calc(var(--fs) * 1.05); }
.usage-rows { display: grid; padding: 0.3em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.usage-row { display: grid; grid-template-columns: auto 4.6em minmax(0, 1fr) 4.6em; align-items: center; gap: 0.6em; padding: 0.55em 0; }
.usage-row + .usage-row { border-top: var(--line-in) solid #e3cfa6; }
.usage-row .icon { color: var(--ink); }
.usage-label { font-weight: 800; }
.usage-bar { display: block; height: 1em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); overflow: hidden; }
.usage-fill { display: block; height: 100%; border-right: var(--line-in) solid var(--ink); border-radius: 999px; background: #3a9a80; }
.usage-size { text-align: right; font-weight: 800; font-variant-numeric: tabular-nums; }
.menu { gap: 0.6em; }
.menu-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8em;
  width: 100%;
  min-height: 3.8em;
  padding: 0.6em 0.75em;
  border-radius: 0.95em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.menu-row:disabled { opacity: 0.55; cursor: not-allowed; }
.menu-icon { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.9em; height: 2.9em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); box-shadow: 0 0.15em 0 var(--ink); }
.menu-icon.light, .menu-icon.quiet { background: var(--fw-surface-2); color: var(--ink); }
.menu-text { display: grid; flex: 1; min-width: 0; }
.menu-title { font-size: calc(var(--fs) * 1.1); font-weight: 900; overflow-wrap: anywhere; }
.menu-row.quiet .menu-title { font-size: var(--fs); }
.menu-detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.menu-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
label.menu-row:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.restore { display: grid; gap: 0.6em; }
.preview-box { display: grid; gap: 0.45em; padding: 0.75em; border-radius: 0.9em; border: var(--line-in) dashed var(--ink); background: var(--fw-surface); }
.preview-head { display: flex; align-items: center; gap: 0.45em; font-size: calc(var(--fs) * 1.05); }
.preview-head .icon { color: var(--fw-accent); }
.preview-rows { display: grid; padding: 0.2em 0.75em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.preview-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.75em; padding: 0.4em 0; }
.preview-row + .preview-row { border-top: var(--line-in) solid #e3cfa6; }
.preview-row .icon { color: var(--fw-wood-dark); }
.preview-row strong { font-variant-numeric: tabular-nums; }

/* ── 세계 고르기 ───────────────────────────────────────────────────────── */
.form { gap: 0.55em; }
.form .button { margin-top: 0.4em; }
.field-label { font-weight: 900; }
.restore-details > summary { cursor: pointer; min-height: 2.75em; }
.restore-details[open] > .restore { margin-top: 0.75em; }
.invite-empty { display: grid; gap: 0.65em; justify-items: start; }

/* ── Sheets (시작 꾸러미 and the resident sheets) ─────────────────────── */
.sheet-backdrop { position: absolute; inset: 0; z-index: 10; display: flex; align-items: flex-end; justify-content: center; padding: 0.75em; background: rgba(48, 29, 16, 0.5); }
.sheet { width: min(100%, 480px); max-height: 100%; overflow-y: auto; gap: 0.75em; padding: 1.25em; }
.kit { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.kit-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.6em; padding: 0.55em 0.8em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 800; }
.kit-item .icon { color: var(--fw-leaf); }
.kit-item strong { font-variant-numeric: tabular-nums; }

/* ── 연결 점검 ─────────────────────────────────────────────────────────── */
.diagnostics { display: grid; gap: 0.85em; min-width: 0; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; min-width: 0; }
.row.stacked { display: grid; gap: 0.25em; padding-bottom: 0.5em; border-bottom: var(--line-in) solid #e3cfa6; }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.badge { flex: none; font-size: calc(var(--fs) * 0.8); font-weight: 900; padding: 0.1em 0.6em; border-radius: 999px; border: var(--line-in) solid currentColor; background: var(--fw-surface-3); }
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
  border-radius: 0.8em;
  border: var(--line-in) solid var(--ink);
  background-color: #f4efe3;
  background-image: linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%),
    linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22em; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25em 0.75em; font-size: calc(var(--fs) * 0.9); }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; font-weight: 800; }

/* ── Narrow phones ─────────────────────────────────────────────────────── */
@media (max-width: 380px) {
  :host { --line: 2.5px; --line-in: 2px; }
  .top { padding-left: 0.5em; padding-right: 0.5em; }
  .sign-home { font-size: calc(var(--fs) * 1.3); }
  .top-sub.with-resources .sign { font-size: var(--fs); padding: 0.3em 0.5em; }
  .coin { width: 1.35em; height: 1.35em; }
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
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } .button:active:not(:disabled) { transform: none; } }
`;
