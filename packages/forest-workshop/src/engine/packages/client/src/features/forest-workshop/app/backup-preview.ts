// Reads a backup file far enough to show the 복원 미리보기 (mockup 05 · 저장·백업) before anything is sent.
// Only a preview: the server validates the whole backup again and is the one that decides.

export interface BackupSummary {
  worldName: string;
  playerNickname: string;
  gold: number;
  itemKinds: number;
  itemTotal: number;
  exportedAt: string;
  /** 복원 미리보기 rows (mockup 05): counted from the file, 0 until residents, pairs and pictures exist. */
  residents: number;
  pairs: number;
  pictures: number;
}

export type BackupPreview = { ok: true; summary: BackupSummary } | { ok: false; message: string };

const INVALID = "숲결 공방 백업 파일이 아닙니다. 설정 → 저장·백업에서 내보낸 JSON 파일을 골라 주세요.";

export function previewBackup(raw: unknown): BackupPreview {
  const backup = raw as {
    format?: unknown;
    exportedAt?: unknown;
    assets?: unknown;
    world?: {
      settings?: { worldName?: unknown; playerNickname?: unknown };
      wallet?: { gold?: unknown };
      inventory?: unknown;
      residents?: unknown;
      pairs?: unknown;
    };
  } | null;
  if (!backup || backup.format !== "forest-workshop-backup" || !backup.world) return { ok: false, message: INVALID };
  const { settings, wallet, inventory } = backup.world;
  if (typeof settings?.worldName !== "string" || typeof settings.playerNickname !== "string") {
    return { ok: false, message: INVALID };
  }
  const amounts =
    inventory && typeof inventory === "object"
      ? Object.values(inventory as Record<string, unknown>).filter(
          (value): value is number => typeof value === "number" && value > 0,
        )
      : [];
  return {
    ok: true,
    summary: {
      worldName: settings.worldName,
      playerNickname: settings.playerNickname,
      gold: typeof wallet?.gold === "number" ? wallet.gold : 0,
      itemKinds: amounts.length,
      itemTotal: amounts.reduce((total, amount) => total + amount, 0),
      exportedAt: typeof backup.exportedAt === "string" ? backup.exportedAt : "",
      residents: Array.isArray(backup.world.residents) ? backup.world.residents.length : 0,
      pairs: Array.isArray(backup.world.pairs) ? backup.world.pairs.length : 0,
      pictures: Array.isArray(backup.assets) ? backup.assets.length : 0,
    },
  };
}
