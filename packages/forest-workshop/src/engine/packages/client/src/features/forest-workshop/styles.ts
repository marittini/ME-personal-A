// Shadow-DOM-scoped styles. Portrait first: no horizontal scroll from 320px, 520px reading column on desktop,
// sizes in rem so 200% text zoom reflows instead of clipping. Colours follow the Engine's theme variables when
// they reach the shadow root (custom properties inherit) and fall back to a light forest palette.
export const STYLES = `
:host {
  --fw-bg: var(--background, #f6f3ea);
  --fw-surface: var(--card, #fffdf7);
  --fw-text: var(--foreground, #2f3a2c);
  --fw-muted: var(--muted-foreground, #5d6a57);
  --fw-border: var(--border, #d9d3c2);
  --fw-accent: #3f7a4a;
  --fw-accent-text: #ffffff;
  --fw-pass: #2f6b3a;
  --fw-fail: #a3372b;
  --fw-unavailable: #7a6a2f;
  display: block;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--fw-bg);
  color: var(--fw-text);
  font: 400 1rem/1.5 system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  -webkit-text-size-adjust: 100%;
}
* { box-sizing: border-box; }
.page {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 1rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  display: grid;
  gap: 1rem;
}
.page > *,
.card > * {
  min-width: 0;
}
.header h1 { margin: 0; font-size: 1.5rem; line-height: 1.2; }
.eyebrow { margin: 0 0 0.25rem; font-size: 0.8rem; color: var(--fw-muted); letter-spacing: 0.02em; }
.lead { margin: 0.5rem 0 0; color: var(--fw-muted); }
.card {
  background: var(--fw-surface);
  border: 1px solid var(--fw-border);
  border-radius: 0.75rem;
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
  min-width: 0;
}
.card h2 { margin: 0; font-size: 1.05rem; }
.card p { margin: 0; }
.muted { color: var(--fw-muted); font-size: 0.9rem; }
.empty { color: var(--fw-muted); font-style: italic; }
.error { color: var(--fw-fail); font-weight: 600; overflow-wrap: anywhere; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; min-width: 0; }
.row.stacked { display: grid; gap: 0.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--fw-border); }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: 0.85rem; overflow-wrap: anywhere; }
.badge {
  flex: none;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  border: 1px solid currentColor;
}
.badge.pass { color: var(--fw-pass); }
.badge.fail { color: var(--fw-fail); }
.badge.unavailable { color: var(--fw-unavailable); }
.button {
  justify-self: start;
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  border: 1px solid var(--fw-accent);
  background: var(--fw-accent);
  color: var(--fw-accent-text);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.button.secondary { background: transparent; color: var(--fw-accent); }
.button:disabled { opacity: 0.6; cursor: progress; }
.button:focus-visible, .file:focus-visible { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.field-label { font-weight: 600; }
.file { width: 100%; max-width: 100%; font: inherit; min-height: 2.75rem; }
.stage {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 12rem;
  padding: 0.75rem;
  border-radius: 0.6rem;
  background-color: #e9e4d6;
  background-image: linear-gradient(45deg, #d8d1bf 25%, transparent 25%, transparent 75%, #d8d1bf 75%),
    linear-gradient(45deg, #d8d1bf 25%, transparent 25%, transparent 75%, #d8d1bf 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22rem; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25rem 0.75rem; font-size: 0.9rem; }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
`;
