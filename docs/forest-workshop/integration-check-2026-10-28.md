# Integration check — 2026-10-28

## Scope

Agent PR #9 branch at `10657f6d58b9bb5f51591f62f53b2c9f3a69e6ea`; generated Forest Workshop 0.6.5 ZIP and catalog. Engine source checkout: 2.5.1, `feat/forest-workshop-entry` commit `b8bf28382b740cac77f310df442f98c493166f43`. The package declares build compatibility with engine commit `7f341f9186db8e08f21d63cc47ec458deff250d5`. The entry branch is not the engine main commit. All game writes were made to a freshly created isolated test data directory, never the user's worlds.

## Observed

- Nine Forest Workshop regression suites, 10 Chromium fixture suites, strict type check, `npm run check`, catalog lane, locale, release notes and archive/hash validation passed. Browser fixtures exercise selected flows and do not establish actual Android touch or layout.
- `installPackageBrowserFixture` validated the local 0.6.5 catalog metadata and ZIP size/hash, then injected its contents into a fresh test engine data directory. This is not the Engine's normal catalog installer.
- The Engine `/api/health` reported 2.5.1, active and ready Forest Workshop 0.6.5 with server and client entrypoints. The package API created an isolated world, claimed its starter kit, exported a backup and restored it as a separate world. After stopping and restarting the Engine both original and restored worlds still had the claimed starter kit.
- The build and type check ran against the engine checkout. A first attempt to launch the engine invoked an incompatible global pnpm 11, which began recreating its ignored `node_modules`; it was interrupted. Dependencies were restored from the local pnpm store with the repository's corepack pnpm 10.34.5 and `--ignore-scripts`; `scripts/check-workspace-install.mjs` passed and the engine started. An offline install with scripts initially failed when `onnxruntime-node` attempted a network connection. Other optional native behavior was not verified.

## Not verified

The PR catalog points to the eventual `main` artifact URL, which does not yet contain this unmerged 0.6.5 ZIP. Normal catalog download, install, 0.6.4 → 0.6.5 upgrade and rollback were not tested. The fixture does not establish them. The real Android device, installed PWA, fullscreen and system bars, keyboard, rotation, touch comfort, large text, full first-play and screen-reader accessibility remain unverified. The 320×640 work status can scroll. A clean-state browser launch in this run did not yield an observable game screen; the prior 0.6.4 fixture entry/first-world test is documented separately and does not prove the new version's complete UI journey. No user study was performed. The previous package cannot read worlds with over 50 completed story arcs, and the 1,000-story backup and 1,000-arc limits remain.
