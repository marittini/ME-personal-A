// Shadow-DOM-scoped styles after the final mockups (boards 01–05): warm parchment cards on a sand page, dark brown
// text, teal primary buttons, a wooden title plaque and leaf markers on section titles. Drawn with CSS only; the
// illustrated backgrounds, wood and leaves of the mockups are assets for P5 (plan §8), not baked into the UI.
// Portrait first: no horizontal scroll from 320px, a 520px column on desktop, rem sizes so 200% text reflows.
export const STYLES = `
:host {
  --fw-page: #efe2c2;
  --fw-surface: #fbf4e2;
  --fw-surface-2: #f4e9cd;
  --fw-border: #d9c296;
  --fw-border-strong: #c2a473;
  --fw-text: #46301f;
  --fw-muted: #765d44;
  --fw-accent: #2c7469;
  --fw-accent-strong: #215a51;
  --fw-on-accent: #fffaf0;
  --fw-wood: #9a6a3e;
  --fw-wood-dark: #6e4628;
  --fw-on-wood: #fff4d8;
  --fw-leaf: #5c9447;
  --fw-gold: #e3b23c;
  --fw-pass: #2f6e34;
  --fw-fail: #a93a2f;
  --fw-unavailable: #7f6418;
  display: block;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(180deg, #dfe9c8 0, var(--fw-page) 9rem);
  color: var(--fw-text);
  color-scheme: light;
  font: 400 1rem/1.5 system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  -webkit-text-size-adjust: 100%;
}
* { box-sizing: border-box; }
.shell { min-height: 100%; }
.page {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 0.75rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  display: grid;
  gap: 0.875rem;
  align-content: start;
}
.page > *, .card > * { min-width: 0; }

/* Header: back · plaque · gold and gear */
.top { display: grid; gap: 0.4rem; justify-items: center; }
.top-row { display: flex; align-items: center; gap: 0.5rem; width: 100%; min-width: 0; }
.plaque {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  padding: 0.35rem 1rem;
  border-radius: 0.6rem;
  border: 2px solid var(--fw-wood-dark);
  background: linear-gradient(180deg, #b07d4c, var(--fw-wood));
  color: var(--fw-on-wood);
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: 0.02em;
  text-align: center;
  text-shadow: 0 2px 0 var(--fw-wood-dark);
  box-shadow: 0 3px 0 var(--fw-wood-dark);
  overflow-wrap: anywhere;
}
.ribbon {
  margin: 0;
  max-width: 100%;
  padding: 0.15rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-muted);
  font-size: 0.85rem;
  text-align: center;
  overflow-wrap: anywhere;
}
.world-bar { display: flex; align-items: center; gap: 0.4rem; flex: none; }
.counter {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.25rem;
  padding: 0 0.65rem 0 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--fw-border-strong);
  background: var(--fw-surface);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.coin {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fbe39a, var(--fw-gold) 60%, #b98420);
  border: 1px solid #a8761c;
}
.icon-button {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 2px solid var(--fw-border-strong);
  background: var(--fw-surface);
  color: var(--fw-wood-dark);
  cursor: pointer;
}
.icon { width: 1.35rem; height: 1.35rem; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Cards and sections */
.card {
  display: grid;
  gap: 0.75rem;
  align-content: start;
  padding: 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--fw-border);
  background: var(--fw-surface);
  box-shadow: 0 2px 0 rgba(110, 70, 40, 0.12);
}
.card.highlight { border: 2px solid var(--fw-leaf); }
.section-title, .card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
}
.section-title::before {
  content: "";
  flex: none;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0 70% 0 70%;
  background: var(--fw-leaf);
}
.subhead { margin: 0; font-size: 1rem; font-weight: 800; }
.card p { margin: 0; }
.muted { color: var(--fw-muted); font-size: 0.9rem; }
.empty { color: var(--fw-muted); }
.error { color: var(--fw-fail); font-weight: 700; overflow-wrap: anywhere; }
.hint { display: flex; align-items: flex-start; gap: 0.4rem; margin: 0; color: var(--fw-muted); font-size: 0.85rem; }
.hint .icon { flex: none; width: 1.1rem; height: 1.1rem; margin-top: 0.1rem; }

/* Buttons */
.button {
  justify-self: start;
  min-height: 2.75rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.8rem;
  border: 2px solid var(--fw-accent-strong);
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  font: inherit;
  font-weight: 800;
  box-shadow: 0 3px 0 var(--fw-accent-strong);
  cursor: pointer;
}
.button[data-wide] { justify-self: stretch; font-size: 1.05rem; }
.button.small { min-height: 2.5rem; padding: 0.35rem 0.9rem; font-size: 0.9rem; }
.button.secondary { background: var(--fw-surface); color: var(--fw-wood-dark); border-color: var(--fw-border-strong); box-shadow: 0 2px 0 var(--fw-border-strong); }
.button:disabled { opacity: 0.6; cursor: progress; }

/* Forms */
.form { gap: 0.5rem; }
.form .button { margin-top: 0.5rem; }
.field-label { font-weight: 700; }
.input {
  width: 100%;
  min-width: 0;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--fw-border-strong);
  border-radius: 0.6rem;
  background: #fffaf0;
  color: var(--fw-text);
  font: inherit;
}
.field-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.5rem; }
.field-row-label { font-weight: 700; min-width: 4.5rem; }
@media (max-width: 360px) {
  .field-row { grid-template-columns: minmax(0, 1fr) auto; }
  .field-row-label { grid-column: 1 / -1; }
}

/* Menu rows (설정 · 관리, 저장·백업) */
.menu { gap: 0.5rem; }
.menu-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.7rem;
  border: 1px solid var(--fw-border);
  background: var(--fw-surface-2);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.menu-row:disabled { opacity: 0.6; cursor: progress; }
.menu-icon {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.6rem;
  background: var(--fw-accent);
  color: var(--fw-on-accent);
}
.menu-text { display: grid; flex: 1; min-width: 0; }
.menu-title { font-weight: 800; }
.menu-detail { color: var(--fw-muted); font-size: 0.85rem; overflow-wrap: anywhere; }
.menu-chevron { flex: none; color: var(--fw-wood-dark); display: inline-flex; }
.restore { display: grid; gap: 0.6rem; }
.preview-box { display: grid; gap: 0.6rem; padding: 0.75rem; border-radius: 0.7rem; border: 1px dashed var(--fw-border-strong); background: #fffaf0; }
.saved-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; font-weight: 800; }
.check { display: inline-flex; width: 2rem; height: 2rem; align-items: center; justify-content: center; border-radius: 50%; background: var(--fw-pass); color: #fff; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
label.menu-row:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }

/* Lists, chips, stock table */
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; min-width: 0; }
.row.stacked { display: grid; gap: 0.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--fw-border); }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: 0.85rem; overflow-wrap: anywhere; }
.row-button {
  display: grid;
  gap: 0.15rem;
  width: 100%;
  min-height: 3rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--fw-border);
  border-radius: 0.7rem;
  background: var(--fw-surface-2);
  color: var(--fw-text);
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}
.row-button .detail { font-weight: 400; }
.row-button:disabled { opacity: 0.6; cursor: not-allowed; }
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
.chip { padding: 0.2rem 0.7rem; border-radius: 999px; border: 1px solid var(--fw-border-strong); background: #fffaf0; font-size: 0.9rem; font-weight: 700; }
.stock { width: 100%; border-collapse: separate; border-spacing: 0 0.35rem; }
.stock th, .stock td { padding: 0.45rem 0.6rem; text-align: left; }
.stock thead th { color: var(--fw-muted); font-size: 0.8rem; font-weight: 700; }
.stock tbody th, .stock tbody td { background: var(--fw-surface-2); }
.stock tbody th { border-radius: 0.5rem 0 0 0.5rem; font-weight: 700; }
.stock tbody td { border-radius: 0 0.5rem 0.5rem 0; }
.stock .amount, .stock thead th:last-child { text-align: right; }
.amount { font-variant-numeric: tabular-nums; font-weight: 800; }

/* Status badges (연결 점검) */
.badge { flex: none; font-size: 0.8rem; font-weight: 800; padding: 0.1rem 0.55rem; border-radius: 999px; border: 1px solid currentColor; background: #fffaf0; }
.badge.pass { color: var(--fw-pass); }
.badge.fail { color: var(--fw-fail); }
.badge.unavailable { color: var(--fw-unavailable); }
.diagnostics { display: grid; gap: 0.875rem; min-width: 0; }

/* Notice */
.notice { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.8rem; border: 2px solid var(--fw-leaf); background: var(--fw-surface); }
.notice p { margin: 0; flex: 1; min-width: 0; overflow-wrap: anywhere; }
.notice.error { border-color: var(--fw-fail); color: var(--fw-fail); background: #fbe9e4; }
.notice-close { flex: none; min-height: 2.75rem; border: 0; background: none; color: inherit; font: inherit; font-weight: 700; text-decoration: underline; cursor: pointer; }

/* Picture checks (연결 점검) */
.file { width: 100%; max-width: 100%; font: inherit; min-height: 2.75rem; }
.stage {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 12rem;
  padding: 0.75rem;
  border-radius: 0.6rem;
  background-color: #efe6d0;
  background-image: linear-gradient(45deg, #ddd0b2 25%, transparent 25%, transparent 75%, #ddd0b2 75%),
    linear-gradient(45deg, #ddd0b2 25%, transparent 25%, transparent 75%, #ddd0b2 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22rem; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25rem 0.75rem; font-size: 0.9rem; }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; font-weight: 700; }

/* Focus */
.button:focus-visible, .icon-button:focus-visible, .menu-row:focus-visible, .row-button:focus-visible,
.notice-close:focus-visible, .input:focus-visible, .file:focus-visible {
  outline: 3px solid var(--fw-accent);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
`;
