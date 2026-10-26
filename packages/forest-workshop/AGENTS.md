# Forest Workshop — notes for coding agents

The design contract is *Development_Plan_FINAL_v1_6* (supplied by the owner). Its body wins over the mockups for
behaviour; mockups win for look. `docs/forest-workshop/` records what is implemented and verified per phase.

## Layers

- `src/engine/packages/server/src/services/forest-workshop/engine-adapter.ts` is the only file that names Engine host
  members. Other server files take the adapter's structural types. `engine-boundary.json` must keep an empty
  private-import inventory: never import an Engine file by relative path.
- `image-input.ts` is pure byte inspection (unit-tested). `image-adapter.ts` owns sharp and the Global Gallery.
- The client is one custom element with a Shadow DOM and plain DOM nodes. Requests go through the Engine's API client
  from `marinara:host`, never a hand-made fetch with its own admin header.

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
npx tsx tests/forest-workshop-p0.regression.ts
```

Generated files (`server.mjs`, `client.js`, `manifest.json`, `agents.json`, `locales/en.json`, the artifact and the
catalog entry) come only from the builder.
