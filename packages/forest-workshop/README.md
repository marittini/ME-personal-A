# Forest Workshop (숲결 공방)

A portrait cozy workshop game for ME-personal, in development. `forest-workshop` is the development ID; the display
name 숲결 공방 is provisional. The design contract is *Development_Plan_FINAL_v1_6* (숲속 공방 독립 에이전트 최종
개발계획서 v1.6); `docs/forest-workshop/` in this repository records what has been implemented and verified.

## What 0.2.0 is

Not the full game yet. It is the storage foundation (plan P1) with the screens it needs:

- Worlds: create several, switch between them, rename the world and your nickname (the player has a nickname only).
- Every change is a server-decided command: a resent command never applies twice, a failed save changes nothing,
  and concurrent tabs cannot grant anything twice.
- The one-time welcome package and the storeroom.
- Settings → 저장 · 백업: JSON backup without secrets, and restore with a preview that always makes a new world.
- Settings → 연결 점검: the P0 checks (Engine members, storage/model probe, resident picture path to the Global Gallery).

Residents and pairs, production and automation, invitations, expeditions, stories and letters follow in later phases.
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

Package documents use kinds `fw-world` (one per world), `fw-command` (one per accepted command, for idempotency), `fw-p0` (the connection-check picture slot) and `fw-p0-probe` (temporary, removed by each check).
Uninstalling the package does not delete the gallery picture; the Global Gallery protects a picture while a package
document references it.

## Source

Package-owned source lives under `src/engine/` in the Engine tree layout the feature builder expects. Rebuild with
`node scripts/build-feature-packages.mjs forest-workshop` from an Engine checkout set in `MARINARA_ENGINE_ROOT`; never
hand-edit `server.mjs`, `client.js`, `manifest.json` or the artifact.
