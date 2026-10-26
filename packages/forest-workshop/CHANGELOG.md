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
