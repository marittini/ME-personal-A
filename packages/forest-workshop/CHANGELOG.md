## 0.4.0 — 2026-10-27
- Automatic production: a gathering yard and a processing bench run on their own from recommended rules (target stock, priority, on/off). Change targets and order on the Work screen and apply them; 추천 설정 previews the recommended rules first.
- Production is measured against stock plus what is already being made, may finish at most one batch over a target, and never uses protected stock. A waiting facility says why (materials, protected amount, target reached).
- Time away counts for at most 72 hours per absence, however often the world is opened in the background; a run cut at that edge keeps its remaining time until you return. Only the visible, focused game screen counts as being present.
- Facility upgrades for gold (faster runs from the next run), stock protection, selling from the storeroom, and the 작업 보고 on Home (reading it never grants anything twice).

## 0.3.0 — 2026-10-27
- Screens follow the final mockups: Home, Work, Facilities and Storeroom, Settings and Save · Backup, with parts that open in later phases kept in place and marked 준비 중.
- Residents: register your characters and personas into a world. The source is only read; its text is kept beside the resident's new 공방 세계 설정 for comparison, with a change history. The same source is always one resident. A persona resident is an inhabitant, never the player.
- Optional 다시 제안 asks your default language model for a setting draft; nothing is saved until you confirm.
- Choose one starting resident. Pair any two residents — character or persona, in any combination (one resident may be in several pairs); archive and restore pairs.
- Resident pictures are your own PNG or static WebP uploads, stored as quality 95 WebP with transparency. Size, position and marker height are saved separately; the last 3 pictures can be restored.
- Backups now carry the WebP pictures and restore them under new gallery IDs.

## 0.2.0 — 2026-10-26
- Worlds: create several, switch between them, rename the world and your nickname. The player has a nickname only.
- Every change is a command the server decides; a resent command never applies twice, and a failed save changes nothing.
- One-time welcome package and the storeroom with gold and materials.
- JSON backup without secrets; restoring always makes a new world and leaves the original untouched.
- The connection checks moved to Settings → 연결 점검.

## 0.1.0 — 2026-10-26
- P0 connection check build. Not the game yet: a Home tab that proves the Engine connections the game will use.
- Reads characters and personas without writing them, resolves a model connection and fits a context without generating.
- Proves package document revisions, stale-write rejection and transaction rollback with temporary documents.
- Stores an uploaded PNG or static WebP resident picture as a quality 95 WebP in the Global Gallery and keeps only its reference. The PNG original is not kept.
