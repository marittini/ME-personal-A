// Forest Workshop server entry. Composition only: checks the host, builds the services and registers the routes
// under /api/forest-workshop. No agent runtime, prompt context, tools or chat writes.
//
// Module map (each folder only imports the ones above it):
//   host/         the Engine capability runtime, as structural types (engine-adapter.ts is the only Engine door)
//   content/      game data: items, starter kit, relation labels
//   prompts/      language-model prompts and the cleanup of their answers (pure)
//   domain/       pure rules: world model, migrations, commands, errors, IDs
//   store/        package documents: worlds, command log
//   services/     use cases: command execution, worlds, backups, storage, sources, rebuild suggestions
//   images/       picture validation, WebP conversion, Global Gallery, resident picture upload, backup files
//   diagnostics/  P0 connection checks
//   http/         routes and error answers
import type { FastifyInstance } from "fastify";
import { registerDiagnosticsRoutes, DIAGNOSTICS_IMAGE_SLOT_ID } from "./diagnostics/diagnostics-routes";
import {
  API_PREFIX,
  PACKAGE_ID,
  missingRequiredHostMembers,
  requirePersistence,
  type HostRuntime,
} from "./host/engine-adapter";
import { registerGameRoutes } from "./http/game-routes";
import { PACKAGE_VERSION } from "./package-info";
import { createBackupService } from "./services/backup-service";
import { createCommandService } from "./services/command-service";
import { createRebuildService } from "./services/rebuild-service";
import { createSettlementService } from "./services/settlement-service";
import { createSourceService } from "./services/source-service";
import { createStorageService } from "./services/storage-service";
import { createWorldService } from "./services/world-service";

interface ActivationContext {
  app: FastifyInstance;
  api: {
    runtime: HostRuntime;
    registerPrivilegedRoutes(
      routes: (router: FastifyInstance) => Promise<void>,
      options: { prefix: string },
    ): Promise<() => void>;
  };
}

export async function activate({ app, api }: ActivationContext) {
  const runtime = api.runtime;
  const missing = missingRequiredHostMembers(runtime);
  if (missing.length) throw new Error(`Forest Workshop needs a newer Marinara Engine (missing ${missing.join(", ")})`);
  const persistence = requirePersistence(runtime);
  const sources = createSourceService(runtime, persistence);
  const services = {
    app,
    persistence,
    sources,
    rebuild: createRebuildService(runtime, sources),
    worlds: createWorldService(persistence),
    settlement: createSettlementService(persistence),
    commands: createCommandService(persistence, undefined, sources.host),
    backups: createBackupService(persistence, PACKAGE_VERSION),
    storage: createStorageService(persistence),
    logger: runtime.logger,
  };

  return api.registerPrivilegedRoutes(
    async (router) => {
      registerGameRoutes(router, services);
      registerDiagnosticsRoutes(router, { app, runtime });
    },
    { prefix: API_PREFIX },
  );
}

export async function selfCheck({ api }: Pick<ActivationContext, "api">) {
  const missing = missingRequiredHostMembers(api.runtime);
  if (missing.length) throw new Error(`Forest Workshop host members are unavailable: ${missing.join(", ")}`);
  await requirePersistence(api.runtime).documents.getById(PACKAGE_ID, DIAGNOSTICS_IMAGE_SLOT_ID);
}
