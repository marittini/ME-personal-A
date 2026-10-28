# Mobile UX work in progress — 2026-10-28

Baseline: ME-personal-A main `1b0b949cf7354b036dd26a2ae1a10701478a096e`, ME-personal 2.5.1 `7f341f9186db8e08f21d63cc47ec458deff250d5`. Target: Android Chrome installed web app. This is not a release or an actual-device validation report.

## Implemented in this checkpoint

- Existing-world selection puts new-world creation behind a disclosure; first-world creation stays visible.
- Tapping a resident on Home opens the resident profile. The profile separates workshop settings, original settings and change history. Selected section and unsaved setting text survive a client re-render.
- Fullscreen applies safe-area insets and updates the control after external fullscreen exit.
- Version 0.6.4 is a branch-only build for this checkpoint; the change log explicitly records incomplete mobile and install verification.

## Evidence and limits

- Nine existing Forest Workshop regressions, strict package type checks, formatting/lint and catalog validation passed. The focused profile test uses Chromium at 390×740 with a simulated host and checks panel selection and draft retention; it is not an Engine install or an Android test.
- A separate isolated Engine 2.5.1 development server started with a fixture-injected 0.6.4 package; its installed-packages API listed the package. At a simulated 390×740 viewport the Engine opened the empty library and a chat/tutorial overlay; after closing the overlays, a Forest Workshop tab was not found on that visible screen. This does not establish that normal catalog installation works, or why the entry point was absent. The actual first-play flow is still unverified.
- Fullscreen behavior, system bars, keyboard, fonts, touch, screen rotation, installation, update, reconnect and first-play flow have not been verified on an Android device.
- The existing common frame and many sheets still scroll. Long profiles, story content, work, storage, invite, explore, settings and world lists still need page-based layouts; do not describe this checkpoint as the requested no-scroll redesign.

## Next work

1. Run a compatible isolated Engine with the package installed and capture the current first-visit and return flow at Android viewport sizes; record blocked and confusing actions.
2. Design and implement viewport-fitted common navigation and screen-specific pagination, retaining access to all content, large text and keyboard input. Cover onboarding, home, residents and profile first, then work/storage, invite, exploration/story and settings/backup.
3. Exercise installation/update, fullscreen, navigation, error recovery and full first-play flow on the actual Android installed web app. Preserve existing worlds and credentials; use isolated test data.
4. Rebuild and validate the bundle after each completed checkpoint. Do not merge to main or publish until the user requests it.
