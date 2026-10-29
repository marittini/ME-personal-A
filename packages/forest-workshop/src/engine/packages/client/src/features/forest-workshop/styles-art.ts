// Pack art (app/assets.ts) laid over the drawn storybook look. Layers, back to front (handoff v1.7 §8): the season's
// base backdrop → the home scene / facility / item pictures → residents (their own uploaded picture) → emotion marks →
// DOM text and controls. Everything CSS draws from a file is switched on by an art-* class on the shell only after the
// file has loaded (probeAsset), so a missing or failed file keeps the drawn look beneath. Only the current season's rule
// matches, so the browser fetches no other season's backdrop.
// Nine-slice insets are the manifest's nineSlice.sourceInsetsPx (image pixels); the border widths are its
// recommendedBorderCssPx, scaled to each picture's aspect.
import { BACKGROUND_ART, SEASONS, UI_ART, cssAssetUrl } from "./app/assets";

const seasonBases = SEASONS.map(
  (season) =>
    `.season-${season}.art-base:is(.backdrop-forest, .backdrop-wood) .scroll { background: var(--fw-page) ${cssAssetUrl(BACKGROUND_ART[season].base)} center top / 100% auto no-repeat; }`,
).join("\n");

export const ART_STYLES = `
/* Season backdrop (portrait). It scrolls with the page so the column keeps its full width on tall phones. */
${seasonBases}
.art-base.backdrop-forest .scroll:has(.scene img.scene-art) { background: var(--fw-page); }

/* Item, facility and emotion pictures: drawn straight on the panel like the mockups, no tile frame around them. */
.item-tile { width: 2em; height: 2em; }
.item-tile:has(.item-art) { border: 0; border-radius: 0; background: none; }
.item-tile .item-art { width: 100%; height: 100%; object-fit: contain; display: block; filter: drop-shadow(0 1px 0 rgba(75, 46, 26, 0.25)); }
.item-tile.big:has(.item-art) { width: 3.6em; height: 3.6em; }
.stock tbody th .item-tile, .queue-add .pill-tab .item-tile { width: 2em; height: 2em; }
.facility-image { display: block; object-fit: contain; }
.facility-image.big, .facility-image.huge { width: 100%; height: 100%; }
.facility-art { position: relative; }
.facility-art:has(.facility-image) { width: 6em; height: 4.8em; border: 0; border-radius: 0; background: none; }
.recipe-art:has(.item-art) { border: 0; border-radius: 0; background: none; }
.recipe-art .item-tile.big:has(.item-art) { width: 4.6em; height: 4.6em; }
.facility-picture:has(.facility-image) { border: 0; border-radius: 0; background: none; aspect-ratio: auto; min-height: 0; }
.facility-image.huge { max-height: 11em; }
.facility-picture.closed .facility-image, .facility-art.closed .facility-image { filter: grayscale(0.85) brightness(0.92); }
.facility-lock { position: absolute; right: 0; bottom: 0; display: inline-grid; place-items: center; width: 1.8em; height: 1.8em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: var(--fw-wood); color: var(--ink); }
.facility-lock .icon { width: 1.1em; height: 1.1em; }
.facility-entry:has(.facility-image) { padding: 0.35em 0.5em; }
.facility-entry:has(.facility-image) .facility-text strong { white-space: nowrap; }
img.scene-art { object-fit: cover; object-position: 50% 60%; }
.story-stage .stage-art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 60%; display: block; }
.art-sign .reader-tools .chip-button { white-space: nowrap; }
img.emotion-bubble.emotion-art { min-width: 0; width: 2.6em; height: 2.6em; padding: 0; border: 0; border-radius: 0; background: none; object-fit: contain; }

/* 홈 (board 01-1): the workshop scene fills the top of the screen and the sign, money and 날씨 sit on it. */
.column:has(> .scene img.scene-art) { position: relative; }
.column:has(> .scene img.scene-art) > .top-home { position: absolute; z-index: 3; top: 0; left: 0; right: 0; }
.scene:has(img.scene-art) { aspect-ratio: 390 / 470; min-height: 22em; margin-bottom: 0; }
.home-layout .scene:has(img.scene-art) { min-height: 0; aspect-ratio: auto; margin: 0; }
@media (max-height: 480px) { .home-layout .scene:has(img.scene-art) { min-height: 12em; } }

/* Wooden sign (title-sign.webp) on every screen; the DOM title sits in its empty middle (textSafeRect 22–78 % × 36–74 %). */
.art-sign .sign {
  flex: none;
  aspect-ratio: 768 / 359;
  width: min(12em, 52vw);
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: ${cssAssetUrl(UI_ART.titleSign)} center / 100% 100% no-repeat;
  box-shadow: none;
  color: #4b2e1a;
  font-size: calc(var(--fs) * 1.6);
  font-weight: 900;
  letter-spacing: 0.04em;
  overflow: visible;
}
.art-sign .sign::before, .art-sign .sign::after { content: none; }
.art-sign .sign-home { width: min(10.5em, 44vw); font-size: calc(var(--fs) * 1.45); }
/* The gear on the scene: a cream disc so it reads over leaves (board 01-1). */
.art-base .icon-button.gear { border-radius: 50%; background: rgba(255, 248, 232, 0.85); }
.art-sign .top-sub .sign { margin-right: 0; }
.art-sign .top-sub:not(.with-resources) .top-row { justify-content: center; }
.art-sign .top-sub:not(.with-resources) .back-button { position: absolute; left: 0.75em; }
.art-sign .top-sub.with-resources .sign { width: min(9.5em, 40vw); font-size: calc(var(--fs) * 1.15); padding: 0; }

/* Narrow phones: the sign and its title shrink with the bar so the money and the gear keep their row. */
.art-sign .top { container-type: inline-size; }
@container (max-width: 380px) {
  .art-sign .sign-home { width: 40cqi; font-size: 5cqi; padding: 0; }
  .art-sign .top-sub.with-resources .sign { width: 37cqi; font-size: 4.3cqi; padding: 0; letter-spacing: 0; }
}
/* Large teal calls to action: primary-button.webp as nine-slice. Small, inline and secondary buttons stay drawn. */
.art-button .button:not(.secondary):not(.small):not(.is-locked):not(:disabled):not(.pressed):not(.setting-field > .button) {
  border-color: transparent;
  border-width: 0;
  border-image: ${cssAssetUrl(UI_ART.primaryButton)} 70 138 fill / 16px 32px / 0 stretch;
  background: transparent;
  box-shadow: none;
  padding-left: 1.8em;
  padding-right: 1.8em;
  text-shadow: 0 1px 0 rgba(37, 22, 12, 0.45);
}

.art-button .button.report-button:not(:disabled) { padding-left: 1.1em; padding-right: 1.1em; }

/* Cards, sheets and the story dialogue: paper-panel.webp (cream paper with leaf corners, as on every board). */
.art-paper .card, .art-paper .sheet, .art-paper .dialogue-box {
  border-color: transparent;
  border-width: 0;
  border-image: ${cssAssetUrl(UI_ART.paperPanel)} 105 154 fill / 30px 44px / 0 stretch;
  background: transparent;
  box-shadow: none;
}
.art-paper .card { padding: 1.1em 1.2em; }
.art-paper .resident-board { padding: 0.8em 1em; }
/* Inside the paper, rows and boxes use a light tan line and no ink frame, as on the boards. */
.art-paper .card :is(.facility-entry, .recipe, .plan-row, .plan-block, .setting-block, .detail-grid, .report-slot, .kit-item, .completed-arc, .segmented, .episode-tile:not(.selected)) {
  border-color: #dcc49a;
  border-width: 2px;
}
.art-paper .sheet, .art-paper .dialogue-box { padding: 1.5em 1.6em; }
/* With the 96 px picture the facility text needs the row: the action button wraps under it on phones. */
.facility-entry:has(.facility-image) { flex-wrap: wrap; }
.facility-entry:has(.facility-image) .facility-open { flex: 1 1 13em; }
.facility-entry:has(.facility-image) .outline-button { white-space: nowrap; }
.facility-entry:has(.facility-image) > :not(.facility-open) { margin-left: auto; }
.work-card .facility-entry:has(.facility-image) > .outline-button { width: 100%; margin: 0; justify-content: center; text-align: center; white-space: nowrap; font-size: calc(var(--fs) * 0.85); }
.work-stock-actions .outline-button { justify-content: center; text-align: center; }
.work-fields { margin-bottom: 0; }
.work-fields .field-tab { min-height: 44px; padding: 0.3em 0.1em; border-bottom: var(--line) solid var(--ink); border-radius: 0.65em; }
.work-fields .field-glyph { display: block; margin: 0 auto; }
.work-card .facility-art, .work-card .facility-image { width: 44px; height: 44px; }
.work-card .facility-text strong { font-size: var(--fs); }
.work-card .facility-open { gap: 0.4em; }
.work-card .segment { min-height: 44px; }
.work-card .facility-entry .outline-button { min-height: 44px; }
.work-card .plan-row.current-work { grid-template-columns: auto minmax(0, 1fr) auto; }
.work-card .current-work .plan-label { grid-column: 1 / -1; }
.work-card .current-work .plan-progress { grid-column: auto; }
.art-paper .work-card { padding: 0.6em 0.8em; gap: 0.25em; }

.big-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
/* Mockup art pass: read the whole production plan in one flow. */
.work-card .section-title { font-size: calc(var(--fs) * 1.1); padding-top: 0.65em; border-top: 1px solid #dcc49a; }
.art-paper .work-card { padding: 1em 1.15em; gap: 0.7em; }
.work-card .facility-art, .work-card .facility-image { width: 5em; height: 4.5em; }
.work-fields .field-art { display: block; width: 1.9em; height: 1.9em; object-fit: contain; }
.work-fields .field-tab { display: flex; flex-direction: column; gap: 0.2em; padding: 0.4em 0.15em; }
.work-stock-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.work-stock-actions .button { width: 100%; padding: 0.5em; }
.art-paper .card :is(.priority-row, .usage, .setting-row, .storage-item, .usage-rows, .menu-row) { border-color: #dcc49a; box-shadow: none; }
.art-paper .card .outline-button { border-width: 2px; box-shadow: 0 2px 0 #d7bd92; }
.art-paper .card .muted { font-weight: 500; }
.art-paper .card .recipe-text strong { font-weight: 800; }

/* The original paper and button pictures also dress secondary controls. */
.art-paper .button.secondary, .art-paper .page-picker-summary {
  border: 1px solid #b49a72; background: var(--fw-surface-3); box-shadow: none; padding: 0.6em 1em;
}
.tab.current { background: var(--fw-leaf-soft); box-shadow: inset 0 0 0 1px #769b55; }
.tab.current .tab-label { border: 0; background: none; color: var(--fw-text); padding: 0; }

/* Restore the report illustration and story banner; content may scroll instead of shrinking. */
.home-layout .scroll { overflow-y: auto; }
.home-layout .column { height: auto; min-height: 100%; }
.home-layout .scene { flex: none; height: clamp(18em, 48vh, 30em); }
.home-layout .page { grid-template-columns: minmax(0, 1fr); gap: 0.6em; }
.home-layout .report-card { padding: 1em 1.15em; }
.home-layout .report-title { font-size: calc(var(--fs) * 1.2); }
.home-layout .report-body { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.5em; }
.home-layout .report-items { padding: 0; border: 0; }
.home-layout .report-slot { padding: 0; border: 0; background: none; }
.home-layout .report-actions { min-width: 0; }
.home-layout .report-button { min-width: 0; width: 100%; font-size: var(--fs); }
.home-layout .strip.story { min-height: 5em; padding: 0.5em 0.8em; }
.home-layout .story-art { display: flex; flex: none; width: 4em; height: 4em; padding: 0; border: 0; background: none; }
.story-vignette { width: 100%; height: 100%; object-fit: contain; }
.home-layout .story-text { flex: 1; min-width: 0; }
.home-layout .story-text strong { font-size: var(--fs); }
.home-layout .story-text span { font-size: calc(var(--fs) * 0.875); }
.home-layout .strip.offline { grid-row: 2; }
.trail-scene { position: relative; background: #dcebc4; aspect-ratio: 360 / 200; overflow: hidden; }
.trail-background { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.trail-scene .trail-art { position: absolute; inset: 0; width: 100%; height: 100%; }
.invite-scene { display: block; width: 100%; max-height: 17em; object-fit: cover; border-radius: 1em; }
@media (max-width: 340px) {
  .home-layout .report-body { grid-template-columns: minmax(0, 1fr); }
  .home-layout .report-items { justify-content: space-around; }
  .home-layout .report-button { min-height: 44px; }
  .rule-actions { grid-template-columns: minmax(0, 1fr); }
}

.letter-detail {
  border: 0;
  border-image: ${cssAssetUrl(UI_ART.letterPaper)} 200 190 fill / 55px 42px / 0 stretch;
  padding: 3.6em 1.6em 2.6em;
  color: var(--fw-text);
}
.letter-detail h3 { margin: 0; font-size: calc(var(--fs) * 1.15); }
.letter-body { overflow-wrap: anywhere; }

/* Anchor the title to the wooden board, independent of the surrounding row width. */
.art-sign .sign-title { position: absolute; inset: 36% 18% 22%; display: grid; place-items: center; line-height: 1.1; white-space: nowrap; font-size: min(1em, 4.2cqi); }
.ground-launch.icon-button { width: 44px; height: 44px; min-height: 44px; min-width: 44px; padding: 0; border-width: 2px; box-shadow: none; bottom: 0.75em; right: 0.75em; }
.empty, .invite-empty { text-align: center; justify-items: center; }
.card > .empty, .sheet > .empty { width: 100%; padding: 1em 0; }
.report-slot.empty { justify-items: center; text-align: center; }
.report-slot.empty .slot-art { display: none; }

.season-weather { display: flex; align-items: center; gap: 0.4em; }
.season-badge { display: inline-grid; place-items: center; min-height: 2em; padding: 0.15em 0.65em; border: 1.5px solid var(--ink); border-radius: 999px; background: var(--fw-surface-3); color: var(--fw-text); font-weight: 700; }

/* Align icon and label as one centered control; keep reading and action gaps distinct. */
.work-fields .field-tab { align-items: center; justify-content: center; text-align: center; min-height: 4.4em; padding: 0.5em 0.2em; gap: 0.25em; font-weight: 700; }
.work-fields .field-art { flex: none; width: 1.7em; height: 1.7em; margin: 0 auto; }
.work-fields .field-tab > span:not(.lock-tag) { width: 100%; text-align: center; line-height: 1.25; }
.work-card .facility-entry { gap: 0.6em; padding: 0.65em; }
.work-card .recipe { gap: 0.7em; padding: 0.75em; }
.work-card .recipe-art .item-tile.big:has(.item-art) { width: 3.5em; height: 3.5em; }
.work-card .recipe-text strong { font-size: calc(var(--fs) * 1.1); line-height: 1.3; }
.work-card .recipe-text > span { font-size: calc(var(--fs) * 0.875); line-height: 1.5; }
.work-card .section-title { gap: 0.4em; font-size: calc(var(--fs) * 1.1); }
.mail-new { position: absolute; right: -0.2em; top: -0.2em; display: grid; place-items: center; width: 1.1em; height: 1.1em; border: 1px solid var(--ink); border-radius: 50%; background: var(--fw-gold); color: var(--ink); }
.mail-new .icon { width: 0.8em; height: 0.8em; }
.weather-choices { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.4em; }
.weather-choice { display: grid; place-items: center; align-content: center; gap: 0.25em; min-width: 0; min-height: 44px; padding: 0.5em 0.2em; border: 1px solid #b49a72; border-radius: 0.7em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; cursor: pointer; }
.weather-choice.current { border: 2px solid var(--fw-accent); background: var(--fw-leaf-soft); font-weight: 700; }
.weather-choice-art { width: 1.6em; height: 1.6em; object-fit: contain; }
.weather-layer { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; opacity: 0.6; }
.weather-layer img { object-fit: contain; }
.weather-sun { position: absolute; width: 3em; height: 3em; right: 18%; top: 23%; }
.weather-cloud { position: absolute; width: 4.5em; height: 3em; left: 12%; top: 24%; animation: fw-cloud-drift 12s ease-in-out infinite alternate; }
.weather-particle { position: absolute; left: var(--weather-x); top: -10%; width: 0.8em; height: 0.8em; animation: fw-weather-fall var(--weather-duration) linear var(--weather-delay) infinite; }
.weather-snow .weather-particle { width: 1em; height: 1em; }
.weather-sprite { width: 100%; height: 100%; }
.scene-stage { z-index: 2; }
.ground-launch, .scene-caption { z-index: 2; }
@keyframes fw-weather-fall { from { transform: translate(0, 0); } to { transform: translate(0.8em, calc(60vh + 4em)); } }
@keyframes fw-cloud-drift { from { transform: translateX(0); } to { transform: translateX(1em); } }
@media (prefers-reduced-motion: reduce) {
  .weather-layer * { animation: none !important; }
  .weather-particle { top: var(--weather-top); opacity: 0.4; }
}

.work-card .facility-text strong { white-space: normal; line-height: 1.3; }
.work-card .facility-entry { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@container (max-width: 360px) {
  .art-sign .top-sub.with-resources .top-row { flex-wrap: wrap; }
  .art-sign .top-sub.with-resources .resources { flex: 1 0 100%; justify-content: flex-end; margin-left: 0; }
}
@media (max-width: 360px) {
  .work-card .facility-entry .outline-button { grid-column: 1 / -1; white-space: normal; }
  .work-card .facility-art, .work-card .facility-image { width: 3.8em; height: 3.8em; }
}
`;
