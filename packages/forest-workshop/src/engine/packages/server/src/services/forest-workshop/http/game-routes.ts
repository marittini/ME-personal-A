// Game routes (plan §5): state reads are GETs, every change is POST /commands; worlds and backups have their own
// routes because they act on a world that does not exist yet or on the whole world.
//   GET  /worlds                    list worlds
//   POST /worlds                    create a world { worldId, worldName, playerNickname }
//   GET  /state?worldId=            current world, its revision and the content the screens need
//   POST /commands                  { worldId, commandId, expectedRevision, type, payload }
//   GET  /backup?worldId=           download a backup JSON
//   POST /restore                   { newWorldId, backup } → a new world
//   GET  /storage?worldId=          저장 공간 사용량 by kind
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ITEMS } from "../content/items";
import { STARTER_KIT } from "../content/starter-kit";
import type { BackupService } from "../services/backup-service";
import type { StorageService } from "../services/storage-service";
import { parseCommandRequest, type CommandService } from "../services/command-service";
import type { WorldService } from "../services/world-service";
import { respond, type RouteLogger } from "./respond";

export interface GameRouteServices {
  worlds: WorldService;
  commands: CommandService;
  backups: BackupService;
  storage: StorageService;
  logger: RouteLogger | undefined;
}

/** Static content the client renders with; the server stays the authority on amounts. */
const CONTENT = { items: ITEMS, starterKit: STARTER_KIT };

function queryWorldId(request: FastifyRequest): unknown {
  return (request.query as Record<string, unknown> | undefined)?.worldId;
}

export function registerGameRoutes(router: FastifyInstance, services: GameRouteServices) {
  const { worlds, commands, backups, storage, logger } = services;

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

  router.get("/state", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "read state", async () => ({
      ...(await worlds.get(queryWorldId(request) as string)),
      content: CONTENT,
    })),
  );

  router.post("/commands", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "command", async () => commands.execute(parseCommandRequest(request.body))),
  );

  router.get("/backup", async (request: FastifyRequest, reply: FastifyReply) =>
    respond(reply, logger, "export backup", async () => {
      const { fileName, backup } = await backups.exportWorld(queryWorldId(request) as string);
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
      const restored = await backups.restore(request.body);
      if (restored.created) reply.status(201);
      return { ...restored, content: CONTENT };
    }),
  );
}
