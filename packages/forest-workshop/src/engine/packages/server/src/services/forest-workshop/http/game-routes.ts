// Game routes (plan §5): state reads are GETs, every change is POST /commands; worlds and backups have their own
// routes because they act on a world that does not exist yet or on the whole world.
//   GET  /worlds                    list worlds
//   POST /worlds                    create a world { worldId, worldName, playerNickname }
//   GET  /state?worldId=            current world, its revision and the content the screens need
//   POST /commands                  { worldId, commandId, expectedRevision, type, payload }
//   GET  /backup?worldId=           download a backup JSON
//   POST /restore                   { newWorldId, backup } → a new world
//   GET  /storage?worldId=          저장 공간 사용량 by kind
//   GET  /sources?worldId=          characters and personas that can become residents (read-only)
//   GET  /sources/preview?worldId=&kind=&id=   the snapshot a registration would keep (원래 설정)
//   POST /rebuild-suggestion        { worldId, source } → a 공방 세계 설정 draft from the language model; nothing saved
//   GET  /deliveries?worldId=       today's 납품 의뢰 (UTC day) and which are done
//   POST /heartbeat                 { worldId } from the visible, focused game screen → settles and renews presence
//   POST /residents/image           multipart { worldId, residentId, uploadKey, file } → the resident's new picture
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  MAX_BREAKTHROUGH,
  PASSIVE_BASE,
  PASSIVE_PER_BREAKTHROUGH,
  SET_BONUS_MAX,
  SET_BONUS_PER_PAIR,
} from "../content/crew";
import { INVITE_RULES } from "../content/invite";
import { TALENTS } from "../content/talents";
import { ITEMS } from "../content/items";
import {
  FACILITIES,
  FACILITY_MAX_LEVEL,
  MAX_RULES_PER_FACILITY,
  PROTECTED_STOCK_RANGE,
  QUEUE_COUNT_RANGE,
  QUEUE_SLOT_LEVELS,
  RECIPES,
  RECOMMENDED_RULES,
  SPEED_BONUS_PER_LEVEL,
  TARGET_STOCK_RANGE,
  upgradeCost,
} from "../content/production";
import { RELATION_STAGES } from "../content/relations";
import { todaysOrders } from "../domain/economy/deliveries";
import { ABSENCE_LIMIT_MS } from "../domain/model/production";
import { utcDay } from "../domain/production/simulation";
import { STARTER_KIT } from "../content/starter-kit";
import { PLACEMENT_LIMITS, WORLD_SETTING_MAX } from "../domain/model/residents";
import { galleryAssetReader, galleryAssetStore } from "../images/gallery-files";
import { MAX_INPUT_BYTES } from "../images/image-input";
import { UploadRefused, releaseGalleryImages, uploadResidentImage } from "../images/resident-image-upload";
import type { HostPersistence } from "../host/engine-adapter";
import type { BackupService } from "../services/backup-service";
import type { RebuildService } from "../services/rebuild-service";
import type { SettlementService } from "../services/settlement-service";
import type { SourceService } from "../services/source-service";
import type { StorageService } from "../services/storage-service";
import { parseCommandRequest, type CommandService } from "../services/command-service";
import type { WorldService } from "../services/world-service";
import { respond, type RouteLogger } from "./respond";

export interface GameRouteServices {
  app: FastifyInstance;
  persistence: HostPersistence;
  worlds: WorldService;
  commands: CommandService;
  backups: BackupService;
  storage: StorageService;
  sources: SourceService;
  rebuild: RebuildService;
  settlement: SettlementService;
  logger: RouteLogger | undefined;
}

/** Static content the client renders with; the server stays the authority on amounts and rules. */
const CONTENT = {
  items: ITEMS,
  facilities: FACILITIES,
  recipes: RECIPES,
  production: {
    maxLevel: FACILITY_MAX_LEVEL,
    maxRules: MAX_RULES_PER_FACILITY,
    speedBonusPerLevel: SPEED_BONUS_PER_LEVEL,
    targetStock: TARGET_STOCK_RANGE,
    protectedStock: PROTECTED_STOCK_RANGE,
    upgradeCosts: Array.from({ length: FACILITY_MAX_LEVEL - 1 }, (_, index) => upgradeCost(index + 1)),
    recommendedRules: RECOMMENDED_RULES,
    absenceLimitMs: ABSENCE_LIMIT_MS,
    queueSlotLevels: QUEUE_SLOT_LEVELS,
    queueCount: QUEUE_COUNT_RANGE,
  },
  crew: {
    passiveBase: PASSIVE_BASE,
    passivePerBreakthrough: PASSIVE_PER_BREAKTHROUGH,
    maxBreakthrough: MAX_BREAKTHROUGH,
    setBonusPerPair: SET_BONUS_PER_PAIR,
    setBonusMax: SET_BONUS_MAX,
  },
  invite: INVITE_RULES,
  talents: TALENTS,
  starterKit: STARTER_KIT,
  relationStages: RELATION_STAGES,
  residents: { worldSettingMax: WORLD_SETTING_MAX, placement: PLACEMENT_LIMITS, maxImageBytes: MAX_INPUT_BYTES },
};

function queryWorldId(request: FastifyRequest): unknown {
  return (request.query as Record<string, unknown> | undefined)?.worldId;
}

export function registerGameRoutes(router: FastifyInstance, services: GameRouteServices) {
  const { app, worlds, commands, backups, storage, sources, rebuild, settlement, logger } = services;
  const query = (request: FastifyRequest) => (request.query ?? {}) as Record<string, unknown>;

  router.get("/worlds", async (_request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "list worlds", async () => ({ worlds: await worlds.list() })),
  );

  router.post("/worlds", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "create world", async () => {
      const created = await worlds.create(request.body);
      if (created.created) reply.status(201);
      return { ...created, content: CONTENT };
    }),
  );

  // Reading settles production to now (not presence: a read is not the player being here) and saves it first.
  router.get("/state", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "read state", async () => ({
      ...(await settlement.settle(queryWorldId(request), { active: false })),
      content: CONTENT,
    })),
  );

  router.get("/deliveries", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "deliveries", async () => {
      const { state } = await worlds.get(String(queryWorldId(request)));
      const day = utcDay(Date.now());
      return {
        day,
        orders: todaysOrders(state.worldId, day),
        done: state.deliveries.day === day ? state.deliveries.done : [],
      };
    }),
  );

  router.post("/heartbeat", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "heartbeat", async () =>
      settlement.settle((request.body as Record<string, unknown> | undefined)?.worldId, { active: true }),
    ),
  );

  router.post("/commands", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "command", async () => {
      const response = await commands.execute(parseCommandRequest(request.body));
      if (!response.duplicate) await releaseGalleryImages({ app, logger }, request, response.result.released);
      return response;
    }),
  );

  router.get("/sources", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "list sources", async () => sources.list(queryWorldId(request))),
  );

  router.get("/sources/preview", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "preview source", async () => {
      const { worldId, kind, id } = query(request);
      return sources.preview(worldId, kind, id);
    }),
  );

  router.post("/rebuild-suggestion", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "rebuild suggestion", async () => rebuild.suggest(request.body)),
  );

  router.post("/residents/image", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "resident image", async () => {
      try {
        return await uploadResidentImage({ app, documents: services.persistence.documents, commands, logger }, request);
      } catch (error) {
        if (error instanceof UploadRefused) {
          return reply.status(error.status).send({ error: error.code, message: error.message });
        }
        throw error;
      }
    }),
  );

  router.get("/backup", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "export backup", async () => {
      const { fileName, backup } = await backups.exportWorld(
        queryWorldId(request) as string,
        galleryAssetReader(app, request),
      );
      reply.header("content-type", "application/json; charset=utf-8");
      reply.header("content-disposition", `attachment; filename="${fileName}"`);
      reply.header("cache-control", "no-store");
      return backup;
    }),
  );

  router.get("/storage", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "storage usage", async () => storage.usage(queryWorldId(request))),
  );

  router.post("/restore", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "restore backup", async () => {
      const restored = await backups.restore(request.body, galleryAssetStore(app, request));
      if (restored.created) reply.status(201);
      return { ...restored, content: CONTENT };
    }),
  );
}
