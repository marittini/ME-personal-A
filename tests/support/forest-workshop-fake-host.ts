// An in-memory stand-in for the Engine's package document store, with the semantics P0 proved on a live Engine
// (docs/forest-workshop/P0-report.md): create refuses an existing ID, update is compare-and-swap on the revision and
// answers null when it loses, and a transaction that throws leaves no trace. Hooks let a test inject a concurrent
// writer or a failing save at an exact point.
import type {
  HostDocumentRecord,
  HostDocumentStore,
  HostPersistence,
  HostPersistenceSession,
} from "../../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/host/engine-adapter";

type CreateInput = Parameters<HostDocumentStore["create"]>[0];
type UpdateInput = Parameters<HostDocumentStore["update"]>[0];

export interface FakeHostHooks {
  /** Runs before every update; may write through `host` to simulate another tab. */
  beforeUpdate?: (input: UpdateInput, host: FakeHost) => Promise<void> | void;
  /** Runs as a transaction is about to start; another tab's whole command can commit here. */
  beforeTransaction?: (host: FakeHost) => Promise<void> | void;
  /** Throw from here to simulate a failing save of a document. */
  beforeCreate?: (input: CreateInput) => void;
}

const clone = <T>(value: T): T => structuredClone(value);

export class FakeHost {
  rows = new Map<string, HostDocumentRecord>();
  hooks: FakeHostHooks = {};
  private hooking = false;
  /** Like the Engine's FileNativeDB, at most one transaction runs at a time; the next waits for it. */
  private transactionQueue: Promise<void> = Promise.resolve();
  /** Rows another "tab" wrote from a hook. They are committed: a rollback of our transaction keeps them. */
  private external = new Map<string, HostDocumentRecord>();

  private remember(key: string, row: HostDocumentRecord) {
    if (this.hooking) this.external.set(key, clone(row));
  }

  private key(packageId: string, id: string) {
    return `${packageId}\u0000${id}`;
  }

  readonly documents: HostDocumentStore = {
    list: async (packageId, kind) =>
      [...this.rows.values()].filter((row) => row.packageId === packageId && row.kind === kind).map(clone),
    getById: async (packageId, id) => clone(this.rows.get(this.key(packageId, id)) ?? null),
    create: async (input) => {
      this.hooks.beforeCreate?.(input);
      const key = this.key(input.packageId, input.id);
      if (this.rows.has(key)) throw new Error(`UNIQUE constraint failed: ${input.id}`);
      const row: HostDocumentRecord = { ...clone(input), revision: 1 };
      this.rows.set(key, row);
      this.remember(key, row);
      return clone(row);
    },
    update: async (input) => {
      if (this.hooks.beforeUpdate && !this.hooking) {
        this.hooking = true;
        try {
          await this.hooks.beforeUpdate(input, this);
        } finally {
          this.hooking = false;
        }
      }
      const key = this.key(input.packageId, input.id);
      const current = this.rows.get(key);
      if (!current || current.revision !== input.expectedRevision) return null;
      const next: HostDocumentRecord = {
        ...current,
        name: input.name,
        description: input.description,
        data: clone(input.data),
        revision: current.revision + 1,
        updatedAt: input.updatedAt,
      };
      this.rows.set(key, next);
      this.remember(key, next);
      return clone(next);
    },
    remove: async (packageId, id, expectedRevision) => {
      const key = this.key(packageId, id);
      const current = this.rows.get(key);
      if (!current || current.revision !== expectedRevision) return false;
      this.rows.delete(key);
      return true;
    },
  };

  readonly persistence: HostPersistence = {
    documents: this.documents,
    transaction: async <T>(operation: (session: HostPersistenceSession) => Promise<T>): Promise<T> => {
      // A hook stands for another tab whose transaction already committed before ours reached this point.
      if (this.hooking) return operation({ documents: this.documents });
      if (this.hooks.beforeTransaction) {
        const hook = this.hooks.beforeTransaction;
        this.hooks.beforeTransaction = undefined;
        this.hooking = true;
        try {
          await hook(this);
        } finally {
          this.hooking = false;
        }
      }
      const previous = this.transactionQueue;
      let release!: () => void;
      this.transactionQueue = new Promise<void>((resolve) => (release = resolve));
      await previous;
      try {
        return await this.runTransaction(operation);
      } finally {
        release();
      }
    },
  };

  private async runTransaction<T>(operation: (session: HostPersistenceSession) => Promise<T>): Promise<T> {
    {
      const snapshot = new Map([...this.rows].map(([key, row]) => [key, clone(row)]));
      this.external.clear();
      try {
        return await operation({ documents: this.documents });
      } catch (error) {
        this.rows = snapshot;
        for (const [key, row] of this.external) this.rows.set(key, clone(row));
        throw error;
      } finally {
        this.external.clear();
      }
    }
  }

  count(kind: string) {
    return [...this.rows.values()].filter((row) => row.kind === kind).length;
  }
}
