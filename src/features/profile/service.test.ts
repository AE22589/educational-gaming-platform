import { describe, expect, it } from "vitest";
import type { ProfileState } from "@/types/contracts";
import type {
  ExclusiveWriterLease,
  LoadResult,
  SaveResult,
  SnapshotStore,
  WriterCoordinator,
  WriterOwnership,
} from "./ports";
import { createEmptyProfile, ProfileService } from "./service";
import { EMPTY_CONTENT_BUNDLE, ValidatedProfileCatalog } from "./catalog";

class MemorySnapshotStore implements SnapshotStore {
  value: ProfileState | null;
  failNextSave = false;

  constructor(initial: ProfileState | null = null) {
    this.value = initial;
  }

  async load(): Promise<LoadResult> {
    return this.value
      ? { status: "ready", snapshot: structuredClone(this.value) }
      : { status: "empty" };
  }

  async save(
    snapshot: ProfileState,
    expectedRevision: number | null,
    lease: ExclusiveWriterLease,
  ): Promise<SaveResult> {
    if (!lease.isActive()) return { status: "unsaved", reason: "conflict" };
    if (this.failNextSave) {
      this.failNextSave = false;
      return { status: "unsaved", reason: "unavailable" };
    }
    if (
      expectedRevision === null
        ? this.value !== null
        : this.value?.revision !== expectedRevision
    )
      return { status: "unsaved", reason: "conflict" };
    this.value = structuredClone(snapshot);
    return { status: "saved", revision: snapshot.revision };
  }

  async restoreBackup(): Promise<LoadResult> {
    return this.value
      ? { status: "ready", snapshot: structuredClone(this.value) }
      : { status: "empty" };
  }

  async importSnapshot(raw: string): Promise<LoadResult> {
    return { status: "recovery", reason: "invalid-data", raw };
  }

  async clear(): Promise<SaveResult> {
    this.value = null;
    return { status: "saved", revision: 0 };
  }

  async exportRaw(): Promise<string | null> {
    return this.value ? JSON.stringify(this.value) : null;
  }
}

function createWriter(): WriterCoordinator {
  const lease: ExclusiveWriterLease = {
    id: "test-writer",
    isActive: () => true,
    release: () => undefined,
  };
  const ownership: WriterOwnership = { status: "exclusive", lease };
  return { acquire: async () => ownership };
}

function createService(store: SnapshotStore): ProfileService {
  return new ProfileService(
    store,
    createWriter(),
    new ValidatedProfileCatalog(EMPTY_CONTENT_BUNDLE),
  );
}

describe("shop profile transactions", () => {
  it("gives a new profile 100 stars and saves repeat apple purchases atomically", async () => {
    const store = new MemorySnapshotStore();
    const service = createService(store);
    await service.initialize();
    expect(service.getState()).toMatchObject({ status: "ready", snapshot: { stars: 100 } });

    expect(await service.purchaseApple()).toMatchObject({ status: "purchased", stars: 99, appleCount: 1 });
    expect(await service.purchaseApple()).toMatchObject({ status: "purchased", stars: 98, appleCount: 2 });
    expect(store.value).toMatchObject({ stars: 98, inventory: { apple: 2 }, revision: 2 });
    service.dispose();

    const reloaded = createService(store);
    await reloaded.initialize();
    expect(reloaded.getState()).toMatchObject({ status: "ready", snapshot: { stars: 98, inventory: { apple: 2 } } });
    reloaded.dispose();
  });

  it("preserves an existing profile balance when it cannot afford an apple", async () => {
    const existing = { ...createEmptyProfile(), stars: 0 };
    const store = new MemorySnapshotStore(existing);
    const service = createService(store);
    await service.initialize();

    expect(await service.purchaseApple()).toEqual({ status: "insufficient-stars" });
    expect(store.value).toMatchObject({ stars: 0, inventory: {} });
    service.dispose();
  });

  it("does not acknowledge an apple purchase when its snapshot write fails", async () => {
    const store = new MemorySnapshotStore();
    const service = createService(store);
    await service.initialize();
    store.failNextSave = true;

    expect(await service.purchaseApple()).toEqual({ status: "unsaved", reason: "unavailable" });
    expect(store.value).toMatchObject({ stars: 100, inventory: {}, revision: 0 });
    service.dispose();
  });
});
