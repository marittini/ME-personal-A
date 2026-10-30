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
    `.season-${season}.art-base:is(.backdrop-forest, .backdrop-wood) { background: var(--fw-page) ${cssAssetUrl(BACKGROUND_ART[season].base)} center top / cover no-repeat; }`,
).join("\n");

export const ART_STYLES = `
/* Keep the season picture on the viewport, covering tall and wide hosts independently of content length. */
${seasonBases}
.art-base:is(.backdrop-forest, .backdrop-wood) .scroll { background: transparent; }

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
.home-layout .column { height: 100%; min-height: 100%; }
.home-layout .scene { flex: 1 0 18em; min-height: 18em; height: auto; }
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

/* Resident boards: picture selection and details remain in one reading flow. */
.resident-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.resident-card { border: 1px solid #c9b18a; gap: 0.4em; padding: 0.45em; box-shadow: none; }
.resident-card.selected { border: 2px solid var(--fw-accent); background: #eef6e2; box-shadow: none; }
.resident-card-main { min-width: 0; gap: 0.4em; }
.card-stage { border: 1px solid #dcc49a; background: #f6ead0; }
.resident-name { font-size: var(--fs); line-height: 1.35; font-weight: 700; }
.resident-field-label { font-size: calc(var(--fs) * 0.8); color: var(--fw-muted); }
.resident-card .status-pill { min-height: 1.8em; font-size: calc(var(--fs) * 0.85); font-weight: 700; border-width: 1px; cursor: inherit; }
.detail-info { gap: 0.5em; }
.detail-name { font-size: calc(var(--fs) * 1.15); line-height: 1.35; }
.detail-actions { gap: 0.5em; }
.detail-action { min-height: 44px; min-width: 0; border: 1px solid #b49a72; padding: 0.45em 0.3em; font-weight: 700; }
.relation-hero .avatar.large { width: 4.5em; height: 4.5em; max-width: 100px; max-height: 100px; }
.hero-label { margin-top: 0; max-width: 100%; overflow-wrap: anywhere; }
.hero-pairs { font-size: calc(var(--fs) * 1.4); line-height: 1.3; overflow-wrap: anywhere; }
.hero-note { font-weight: 500; }
.pair-row { gap: 0.85em; }
.relation-now { border: 1px solid #dcc49a; }
.pair-actions .button { grid-column: auto; min-width: 0; min-height: 44px; padding: 0.45em; font-size: calc(var(--fs) * 0.9); }
.archived-row { flex-wrap: wrap; }
.archived-name { min-width: 0; overflow-wrap: anywhere; }
.art-paper .steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5em; padding: 0.85em; }
.steps .step-arrow { display: none; }
.step-item { flex-direction: column; align-items: center; text-align: center; gap: 0.35em; }
.step-label { font-size: calc(var(--fs) * 0.85); line-height: 1.35; }
.drop-zone { flex-wrap: wrap; text-align: center; }
.drop-text { justify-items: center; }
.target-ribbon { flex-wrap: wrap; justify-content: center; text-align: center; }
.action-art { flex: none; width: 1.2em; height: 1.2em; object-fit: contain; }
.pair-actions .button { flex-wrap: wrap; }
.manage-art { display: block; flex: none; width: 2.3em; height: 2.3em; object-fit: contain; }
.manage-row { gap: 0.7em; padding: 0.65em 0.75em; min-height: 44px; border: 1px solid #dcc49a; }
.manage-title { min-width: 0; overflow-wrap: anywhere; font-weight: 700; }
@media (max-width: 380px) {
  .detail-stage { width: min(100%, 8em); justify-self: center; aspect-ratio: 1; }
  .detail-info { justify-items: center; text-align: center; }
  .detail-info .tag-row { justify-content: center; }
  .pair-actions { grid-template-columns: minmax(0, 1fr); }
  .archived-row .button { width: 100%; }
}

.resident-pages { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 0.4em; align-items: center; }
.resident-pages .button { min-width: 0; width: 100%; min-height: 44px; padding: 0.45em 0.4em; white-space: nowrap; }
.resident-pages > span { text-align: center; }
.starter-list > li:only-child { grid-column: 1 / -1; width: calc(50% - 0.3em); justify-self: center; }
.resident-grid > .resident-card:only-child { grid-column: 1 / -1; width: calc(50% - 0.3em); justify-self: center; }

@container (max-width: 360px) {
  .story-layout .top-sub.with-resources .top-row { flex-wrap: nowrap; }
  .story-layout .top-sub.with-resources .reader-tools { flex: 0 0 auto; margin-left: auto; }
  .story-layout .reader-tools .chip-button { width: 44px; min-height: 44px; padding: 0; justify-content: center; }
  .story-layout .reader-tools .chip-button > span { display: none; }
}

/* Detail panels retain the paper artwork while reserving width for large text. */
.art-paper .sheet { padding: 16px; }
.sheet { scroll-padding-block: 76px 16px; }
.sheet > .sheet-head { position: sticky; top: -16px; z-index: 3; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 8px; padding-block: 8px; background: var(--fw-surface); border-bottom: 1px solid var(--fw-wood-dark); }
.sheet-head .section-title { min-width: 0; margin: 0; font-size: calc(var(--fs) * 1.1); overflow-wrap: anywhere; }
.sheet-head > .button { min-height: 44px; white-space: nowrap; padding: 8px 12px; }
.sheet .stepper.wide:not(.compact) { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px; padding: 4px; border: 0; background: transparent; overflow: visible; }
.sheet .stepper.wide:not(.compact) > :nth-child(-n+3) { grid-column: span 2; }
.sheet .stepper.wide:not(.compact) > :nth-child(n+4) { grid-column: span 3; }
.sheet .stepper.wide .step { min-width: 0; min-height: 44px; border: 2px solid var(--ink); border-radius: 8px; white-space: nowrap; }
.sheet .step-value { min-width: 0; display: grid; place-items: center; }
.sheet .protect-row { grid-template-columns: 48px minmax(0, 1fr); grid-template-areas: "tile name" "picker picker" "save save"; padding: 8px; gap: 8px; }
.sheet .protect-row > .button { width: 100%; min-height: 44px; white-space: nowrap; }
.sheet .protect-name { min-width: 0; overflow-wrap: anywhere; }
.sheet .profile-identity { gap: 12px; padding: 8px; }
.sheet .profile-identity .avatar.large { width: 64px; height: 64px; }
.sheet .profile-identity-text { flex: 1; gap: 6px; }
.sheet .profile-identity-text .outline-button { white-space: nowrap; padding-inline: 8px; }
.sheet .profile-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.sheet .compare-box { padding: 8px; }
.sheet .compare-box .button { justify-self: stretch; min-height: 44px; }
.detail-help summary { min-height: 44px; display: list-item; padding-block: 10px; cursor: pointer; }
.detail-help p { margin-block: 8px; }
.memory-text { font-weight: 700; line-height: 1.65; white-space: pre-wrap; }
.memory-filters { display: grid; gap: 8px; }
.sheet select.input { min-height: 44px; width: 100%; min-width: 0; padding: 8px; border: 2px solid var(--ink); border-radius: 8px; background: var(--fw-surface); color: var(--fw-text); font: inherit; }
.art-paper .image-card { padding: 16px; gap: 12px; }
.image-card .target-ribbon { display: flex; flex-wrap: nowrap; width: 100%; gap: 8px; padding: 8px; margin: 0; }
.image-card .target-ribbon strong { min-width: 0; overflow-wrap: anywhere; font-size: var(--fs); }
.image-card .image-stage { max-height: 220px; }
.image-card .file-facts { overflow-wrap: anywhere; }
.image-card .slider-row { grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px; }
.image-card .slider-row .slider { grid-column: 1 / -1; grid-row: 2; width: 100%; min-height: 44px; }
.image-card .rule-actions.even { grid-template-columns: 1fr; }

/* Composition pass: prioritize production state, pictures and a single reading surface. */
.production-summary { display: grid; gap: 8px; padding: 12px; background: var(--fw-leaf-soft); border-radius: 12px; }
.production-summary .plan-row { padding: 0; border: 0; background: transparent; }
.production-summary .waiting-guide { margin: 0; }
.production-order { display: grid; gap: 6px; }
.production-slots { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.production-slots li { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border: 1px solid #b9cda8; border-radius: 8px; background: var(--fw-surface-3); font-size: calc(var(--fs) * .85); }
.production-slots:empty::after { content: "등록된 작업 없음"; color: var(--fw-muted); }
.recipe-choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.recipe-choice { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; min-width: 0; min-height: 52px; padding: 8px; font: inherit; color: var(--fw-text); background: var(--fw-surface-3); border: 1px solid #b49a72; border-radius: 10px; cursor: pointer; }
.recipe-choice span { overflow-wrap: anywhere; }
.recipe-choice[aria-pressed="true"] { border: 2px solid var(--fw-accent); background: #e6f1dc; }
.resident-card .card-stage { aspect-ratio: 4 / 3; }
.resident-card .tag-row { gap: 0; }
.resident-card .status-pill { width: auto; min-height: 0; padding: 2px 6px; border: 0; background: transparent; color: var(--fw-muted); }
.resident-card .status-pill.done::before { content: "✓ "; color: var(--fw-accent); }
.home-layout .strip.story, .home-layout .strip.offline { border-width: 1px; border-color: #bda881; box-shadow: none; }
.home-layout .strip.story .round-arrow { background: transparent; border: 0; }
.profile-panel .compare-box.source { border: 0; background: transparent; padding: 8px 0; }
.story-layout .reader-tools .chip-button { width: 44px; min-height: 44px; padding: 0; justify-content: center; }
.story-layout .reader-tools .chip-button > span { display: none; }
.story-layout .story-stage { border-width: 1px; box-shadow: none; }
.story-layout .ribbon { padding: 0; border: 0; background: transparent; }
.story-layout .conversation-panel { flex: none; display: grid; gap: 8px; min-height: 0; padding: 16px 18px; border-radius: 12px; background: var(--fw-surface-3); }
.art-paper .conversation-panel { border-image: ${cssAssetUrl(UI_ART.paperPanel)} 105 154 fill / 20px 28px / 0 stretch; }
.story-layout .conversation-panel .dialogue-box { border: 0; border-image: none; box-shadow: none; border-radius: 0; background: transparent; padding: 0; margin: 0; }
.story-layout .conversation-panel .dialogue-box .line, .story-layout .conversation-panel .dialogue-box .narration { overflow-wrap: anywhere; align-self: start; }
.story-layout .conversation-panel .reader-foot { margin: 0; gap: 8px; }
.story-layout .conversation-panel .reader-foot .count-pill { background: transparent; color: var(--fw-muted); white-space: nowrap; }
.story-layout .conversation-panel .reader-foot .button { min-height: 44px; }

/* Shared narrow layouts: labels and quantities get rows rather than single-character columns. */
.big-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-bottom: 0; }
.big-tab { flex-direction: column; gap: 4px; padding: 10px 6px; min-height: 76px; font-size: var(--fs); border-radius: 12px; border: 1px solid #b49a72; }
.big-tab > .icon { width: 28px; height: 28px; }
.big-tab > span { white-space: nowrap; }
.stock-cards { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.stock-card { display: grid; gap: 10px; padding: 10px; border: 1px solid #c9b18a; border-radius: 12px; background: var(--fw-surface-3); min-width: 0; }
.stock-card-head { display: grid; grid-template-columns: 40px minmax(0, 1fr); align-items: center; gap: 8px; }
.stock-card-head strong { overflow-wrap: anywhere; }
.stock-card-head > .item-tile { width: 40px; height: 40px; margin: 0; }
.stock-values { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin: 0; }
.stock-values > div { display: grid; align-content: start; gap: 4px; min-width: 0; text-align: center; }
.stock-values dt { font-size: calc(var(--fs) * .8); color: var(--fw-muted); }
.stock-values dd { margin: 0; font-weight: 700; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.stock-card > .outline-button { min-height: 44px; width: 100%; white-space: nowrap; }
.auto-sell-head { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 8px; align-items: center; }
.auto-sell-head .switch { grid-column: 2; justify-self: start; }
.auto-sell-head .protect-name { min-width: 0; }
.auto-sell-row .auto-sell-settings { grid-template-columns: minmax(0, 1fr); }
.sheet .row-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.sheet .row-actions > .button { flex: 1 1 140px; min-height: 44px; }
.usage-row { grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px; }
.usage-bar { grid-column: 1 / -1; grid-row: 2; }
.usage-size { white-space: nowrap; }
.facility-card .facility { grid-template-columns: minmax(0, 1fr); gap: 12px; }
.facility-card .facility-picture { width: min(100%, 180px); justify-self: center; }
.facility-card .facility-info { min-width: 0; }
.work-card .facility-open { display: flex; flex-wrap: wrap; gap: 8px; }
.work-card .facility-text { flex: 1 1 120px; min-width: 0; }
.home-layout .top-home .top-row:first-child { flex-wrap: wrap; }
.home-layout .top-home .top-row:first-child .resources { flex: 1 0 100%; justify-content: flex-end; }
.home-layout .top-home .resources .chip-button { padding-inline: 8px; min-width: 0; }
.invite-action { min-width: 0; }
@container (min-width: 480px) {
  .home-layout .top-home .top-row:first-child { flex-wrap: nowrap; }
  .home-layout .top-home .top-row:first-child .resources { flex: 0 1 auto; }
}

.stock-values { grid-template-columns: minmax(0, 1fr); }
.stock-values > div { grid-template-columns: minmax(0, 1fr) auto; text-align: left; align-items: center; }
.stock-values dd { white-space: nowrap; text-align: right; }
.auto-sell-head > .item-tile { grid-column: 1; grid-row: 1 / 3; margin: 0; }
.auto-sell-head .protect-name { grid-area: auto; grid-column: 2; grid-row: 1; }
.auto-sell-head .switch { grid-column: 2; grid-row: 2; }
.auto-sell-row .auto-sell-fields { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.draw-short { position: static; transform: none; max-width: 100%; white-space: normal; text-align: center; justify-content: center; }
.draw-button { min-width: 0; }
.setting-row .is-locked { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.setting-row .is-locked > .lock-tag { position: static; }
.top-home .resources .counter { flex: none; }

.home-layout .scene { overflow: hidden; }
.home-layout .page { min-width: 0; }
.auto-sell-row[hidden] { display: none; }

/* Readable management rows and storage figures at 22px text, without nested padding consuming the label. */
.menu-row { display: grid; grid-template-columns: 40px minmax(0, 1fr) 20px; align-items: center; gap: 8px; padding: 12px; min-height: 56px; }
.menu-row .menu-icon, .menu-row > .manage-art { width: 40px; height: 40px; }
.menu-row .menu-chevron, .menu-row > .icon:last-child { max-width: 20px; }
.art-paper .selected-source { padding: 12px; }
.selected-source .menu-row { padding: 8px; }
.usage-row { grid-template-columns: auto minmax(0, 1fr); }
.usage-label { grid-column: 2; }
.usage-size { grid-column: 2; grid-row: 2; justify-self: end; }
.usage-bar { grid-column: 1 / -1; grid-row: 3; }

.priority-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px; }
.priority-main { grid-column: 2 / -1; display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 8px; }
.priority-main .priority-name { min-width: 0; }
.priority-main .muted { grid-column: 2; margin-left: 0; }
.priority-row > .chip-toggle { grid-column: 2; justify-self: start; }
.toggle-row { display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: 8px; }
.toggle-row .toggle-icon { grid-column: 1; grid-row: 1; }
.toggle-row .toggle-text { grid-column: 2; grid-row: 1; }
.toggle-row .switch { grid-column: 2; grid-row: 2; }
.candidate { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 8px; min-width: 0; }
.candidate .avatar { width: 56px; height: 56px; grid-column: 1; grid-row: 1 / 4; }
.candidate-name { grid-column: 2; grid-row: 1; min-width: 0; }
.candidate > .tag { grid-column: 2; grid-row: 2; justify-self: start; }
.candidate-state { grid-column: 2; grid-row: 3; }

.restore-details > summary { cursor: pointer; }
.restore-details > summary::after { content: "▾"; margin-left: auto; color: var(--fw-accent); }
.restore-details[open] > summary::after { content: "▴"; }
`;
