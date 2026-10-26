# Forest Workshop (숲결 공방)

A portrait cozy workshop game for ME-personal, in development. `forest-workshop` is the development ID; the display
name 숲결 공방 is provisional. The design contract is *Development_Plan_FINAL_v1_6* (숲속 공방 독립 에이전트 최종
개발계획서 v1.6); `docs/forest-workshop/` in this repository records what has been implemented and verified.

## What 0.1.0 is

**0.1.0 is the P0 connection check, not the game.** It installs a Home tab that runs the checks the plan requires
before any game logic is written:

| Check | What it proves |
| --- | --- |
| Engine connection | Which capability runtime members the running Engine provides; activation refuses an Engine without package documents or transactions. |
| Character and persona reads | `resources.listCharacters` and `resources.listPersonas` answer. Nothing is written to either. |
| Model connection | `languageModels.resolve` picks the default connection and `fitContext` estimates tokens. No generation request is sent. |
| Documents | Create, `expectedRevision` update, stale-write rejection (`null`), revision-checked removal. |
| Transaction | A failed `persistence.transaction` rolls back both a create and an update. |
| Resident picture | A PNG or static WebP is checked by its bytes and the decoder, converted to WebP quality 95 with transparency kept, stored in the Global Gallery, and saved as a `global-gallery:<id>` reference. The PNG original is never written to disk. |

The package never calls character avatar generation or `integrations.images.*`, never copies a character or persona
avatar, and never edits a character card or persona.

## Install

Forest Workshop is published from the owner's fork, not the official Pasta-Devs catalog. The Engine reads it
through a catalog override:

```text
MARINARA_AGENT_CATALOG_URL=https://raw.githubusercontent.com/marittini/ME-personal-A/main/catalog/v2/catalog.json
```

The override replaces the whole official list, so the fork's catalog carries the official entries as well. Keep the
original value before changing it. Then open **Agents → Download Agents**, install Forest Workshop, restart when
prompted, and open **Home → 숲결 공방**.

## Compatibility

Built and checked against ME-personal 2.5.1 (`7f341f9186db8e08f21d63cc47ec458deff250d5`) with capability API 1.341.
Engine versions below 2.5.1 are not offered the package.

## Data

Package documents use kinds `fw-p0` (the picture check slot) and `fw-p0-probe` (temporary, removed by each check).
Uninstalling the package does not delete the gallery picture; the Global Gallery protects a picture while a package
document references it.

## Source

Package-owned source lives under `src/engine/` in the Engine tree layout the feature builder expects. Rebuild with
`node scripts/build-feature-packages.mjs forest-workshop` from an Engine checkout set in `MARINARA_ENGINE_ROOT`; never
hand-edit `server.mjs`, `client.js`, `manifest.json` or the artifact.
