# Mobile UX work in progress — 2026-10-28

Baseline: ME-personal-A main `1b0b949cf7354b036dd26a2ae1a10701478a096e`, ME-personal 2.5.1 `7f341f9186db8e08f21d63cc47ec458deff250d5`. Target: Android Chrome installed web app. This is not a release or an actual-device validation report.

## Implemented in this checkpoint

- Existing-world selection puts new-world creation behind a disclosure; first-world creation stays visible.
- Tapping a resident on Home opens the resident profile. The profile separates workshop settings, original settings and change history. Selected section and unsaved setting text survive a client re-render.
- Fullscreen applies safe-area insets and updates the control after external fullscreen exit.
- Residents use a two-person page and separate detail view; work controls are split into current work, production settings and ordering/apply, with unapplied drafts indicated across sections.
- Facilities, protection and storage have separate views. Stock and protection lists are paged, protection edit keeps unsaved quantities across page changes and re-renders, and settings are split into sections with a world-bound nickname draft.
- Registration separates source review, workshop setting and picture/confirmation, and pages source and starter lists. Exploration separates preparation, journey and history with paged completed arcs; invitation exchange, results, chances, log and wish lists use pages.
- Version 0.6.4 is a branch-only build for this checkpoint; the change log explicitly records incomplete mobile and install verification.

## Evidence and limits

- Nine existing Forest Workshop regressions, strict package type checks, formatting/lint and catalog validation passed. The focused profile test uses Chromium at 390×740 with a simulated host and checks panel selection and draft retention; it is not an Engine install or an Android test.
- Simulated Chromium checks also exercise resident list paging and detail navigation, including list fit at 390×740 and 320×640 with default text, and work section navigation with an unapplied draft. These are fixture-based checks, not actual-device or exhaustive content-size proof.
- Further fixture-based Chromium checks cover inventory pagination and selling target, protection editing draft retention, profile history paging, and settings section and nickname draft retention. Storage fits 320×640 and 390×740 in the tested default-text fixtures.
- Fixture-based browser tests cover registration section navigation and draft retention, source/starter paging, exploration section and history navigation, and exchange and wish target selection. Other invitation lists are not individually verified in a browser.
- A separate isolated Engine 2.5.1 development server started with a fixture-injected 0.6.4 package; its installed-packages API listed the package. At a simulated 390×740 viewport the Engine opened the empty library and a chat/tutorial overlay; after closing the overlays, a Forest Workshop tab was not found on that visible screen. This does not establish that normal catalog installation works, or why the entry point was absent. The actual first-play flow is still unverified.
- The user's Engine entry point is on `feat/forest-workshop-entry` at `b8bf28382b740cac77f310df442f98c493166f43` (not merged to Engine main). In a 390×740 Chromium simulation with a fixture-injected package and isolated Engine data, the Library banner opened Forest Workshop; a test world was created, its starter kit claimed, and a test resident registered and chosen as the starter. The API confirmed that resident was recruited and set as the starter. This is not a catalog installation or Android device test.
- Fullscreen behavior, system bars, keyboard, fonts, touch, screen rotation, installation, update, reconnect and first-play flow have not been verified on an Android device.
- The existing common frame and many sheets still scroll. Long source and profile text, story dialogue and choices, work queues and priority lists, expedition details, backup and world lists still need page-based layouts or further verification; large text, long names and protection edit layout need more testing. Do not describe this checkpoint as the requested no-scroll redesign.

## Next work

1. Use the separately built entry point when available to capture the current first-visit and return flow at Android viewport sizes; record blocked and confusing actions.
2. Design and implement viewport-fitted common navigation and screen-specific pagination, retaining access to all content, large text and keyboard input. Cover onboarding, home, residents and profile first, then work/storage, invite, exploration/story and settings/backup.
3. Exercise installation/update, fullscreen, navigation, error recovery and full first-play flow on the actual Android installed web app. Preserve existing worlds and credentials; use isolated test data.
4. Rebuild and validate the bundle after each completed checkpoint. Do not merge to main or publish until the user requests it.
