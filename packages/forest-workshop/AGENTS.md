# Forest Workshop — notes for coding agents

The design contract is *Development_Plan_FINAL_v1_6* (supplied by the owner). Its body wins over the mockups for
behaviour; mockups win for look. `docs/forest-workshop/` records what is implemented and verified per phase.

## Layers

Server (`src/engine/packages/server/src/services/forest-workshop/`), each folder importing only the ones above it:

- `host/engine-adapter.ts` is the only file that names Engine host members; everything else takes its structural types.
  `engine-boundary.json` must keep an empty private-import inventory: never import an Engine file by relative path.
- `content/` game data (items, starter kit); amounts live here, not in rules.
- `domain/` pure rules: the zod world model is the single source of the type and of load/backup validation;
  `migrations.ts` upgrades one schema version at a time; each command is one module in `domain/commands/` registered in
  `registry.ts`; every rule failure is an `FwError(code)` with a Korean message.
- `store/` package documents with compare-and-swap; `services/` use cases (command execution with idempotency and
  retries, worlds, backups); `images/` picture checks, WebP, Global Gallery; `diagnostics/` P0 checks; `http/` routes.

Client (`src/engine/packages/client/src/features/forest-workshop/`): `app/` (host API wrapper, routes, store, the
controller that owns every state change and request ID, DOM helper) and `screens/` (one render function per screen).
Screens never call the API; they call controller actions. Requests go through the Engine's API client from
`marinara:host`, never a hand-made fetch.

The final mockups (5 boards, supplied with the plan) set the look; `docs/forest-workshop/P1-report.md` §3 maps each
screen to its board and lists what later phases add.

## Invariants (do not break)

- Never call character avatar generation or `integrations.images.save/stage`; never create a chat to store a picture.
- Never copy a character or persona avatar, and never write to a character card or persona.
- Store resident pictures as WebP quality 95 in the Global Gallery with a `global-gallery:<id>` reference; never keep
  the uploaded PNG. A failed save keeps the previous picture.
- Package routes stay under `/api/forest-workshop`; Engine routes are reached only in process with the caller's own
  credentials, never through a localhost URL or an admin secret of the package's own.
- The server decides every amount, time and outcome; the client never confirms one.

## Build and test

```sh
MARINARA_ENGINE_ROOT=<ME-personal checkout with dependencies> node scripts/build-feature-packages.mjs forest-workshop
MARINARA_ENGINE_ROOT=<...> node scripts/typecheck-packages.mjs forest-workshop
npm run test:forest-workshop
```

Generated files (`server.mjs`, `client.js`, `manifest.json`, `agents.json`, `locales/en.json`, the artifact and the
catalog entry) come only from the builder.
