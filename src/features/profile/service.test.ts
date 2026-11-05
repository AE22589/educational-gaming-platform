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

  it("consumes one saved apple per successful feeding and does not go below zero", async () => {
    const store = new MemorySnapshotStore({
      ...createEmptyProfile(),
      inventory: { apple: 1 },
    });
    const service = createService(store);
    await service.initialize();

    expect(await service.consumeApple()).toEqual({ status: "consumed", appleCount: 0 });
    expect(await service.consumeApple()).toEqual({ status: "empty" });
    expect(store.value).toMatchObject({ inventory: { apple: 0 }, revision: 1 });
    service.dispose();
  });

  it("does not consume an apple when saving the feeding transaction fails", async () => {
    const store = new MemorySnapshotStore({
      ...createEmptyProfile(),
      inventory: { apple: 1 },
    });
    const service = createService(store);
    await service.initialize();
    store.failNextSave = true;

    expect(await service.consumeApple()).toEqual({ status: "unsaved", reason: "unavailable" });
    expect(store.value).toMatchObject({ inventory: { apple: 1 }, revision: 0 });
    service.dispose();
  });

  it("buys water for one star and consumes one saved unit per successful drink", async () => {
    const store = new MemorySnapshotStore();
    const service = createService(store);
    await service.initialize();

    expect(await service.purchaseWater()).toEqual({ status: "purchased", stars: 99, waterCount: 1 });
    expect(await service.purchaseWater()).toEqual({ status: "purchased", stars: 98, waterCount: 2 });
    expect(store.value).toMatchObject({ stars: 98, inventory: { water: 2 }, revision: 2 });
    expect(await service.consumeWater()).toEqual({ status: "consumed", waterCount: 1 });
    expect(await service.consumeWater()).toEqual({ status: "consumed", waterCount: 0 });
    expect(await service.consumeWater()).toEqual({ status: "empty" });
    expect(store.value).toMatchObject({ inventory: { water: 0 }, revision: 4 });
    service.dispose();
  });

  it("does not deduct stars or water when an unaffordable or unsaved purchase fails", async () => {
    const existing = { ...createEmptyProfile(), stars: 0 };
    const store = new MemorySnapshotStore(existing);
    const service = createService(store);
    await service.initialize();

    expect(await service.purchaseWater()).toEqual({ status: "insufficient-stars" });
    expect(store.value).toMatchObject({ stars: 0, inventory: {}, revision: 0 });
    service.dispose();

    const saveStore = new MemorySnapshotStore();
    const saveService = createService(saveStore);
    await saveService.initialize();
    saveStore.failNextSave = true;
    expect(await saveService.purchaseWater()).toEqual({ status: "unsaved", reason: "unavailable" });
    expect(saveStore.value).toMatchObject({ stars: 100, inventory: {}, revision: 0 });
    saveService.dispose();
  });
});

describe("body-parts mission profile rewards", () => {
  it("persists placements and grants each completed round and mission once per run", async () => {
    const store = new MemorySnapshotStore();
    const service = createService(store);
    await service.initialize();
    const started = await service.startBodyMission();
    expect(started.status).toBe("started");
    await service.setBodyMissionDemoSeen();
    for (const id of ["eye", "ear", "nose", "mouth"])
      await service.placeBodyMissionWord(id, 1);
    expect(service.getState()).toMatchObject({ status: "ready", snapshot: { stars: 108, bodyMissionProgress: { round: 1, placedWordIds: ["eye", "ear", "nose", "mouth"] } } });
    expect(await service.placeBodyMissionWord("mouth", 1)).toMatchObject({ status: "duplicate" });
    expect(await service.continueBodyMission()).toBe(true);
    for (const id of ["head", "arm", "hand", "leg", "foot"])
      await service.placeBodyMissionWord(id, 2);
    expect(service.getState()).toMatchObject({ status: "ready", snapshot: { stars: 128, bodyMissionProgress: { status: "completed", placedWordIds: ["eye", "ear", "nose", "mouth", "head", "arm", "hand", "leg", "foot"] } } });
    service.dispose();

    const reloaded = createService(store);
    await reloaded.initialize();
    expect(reloaded.getState()).toMatchObject({ status: "ready", snapshot: { stars: 128, bodyMissionProgress: { status: "completed" } } });
    const replay = await reloaded.startBodyMission();
    expect(replay).toMatchObject({ status: "started", progress: { round: 1, placedWordIds: [], demoSeen: true } });
    expect(reloaded.getState()).toMatchObject({ status: "ready", snapshot: { stars: 128 } });
    reloaded.dispose();
  });

  it("keeps progress and rewards unchanged when a save fails", async () => {
    const store = new MemorySnapshotStore();
    const service = createService(store);
    await service.initialize();
    await service.startBodyMission();
    store.failNextSave = true;
    expect(await service.placeBodyMissionWord("eye", 1)).toEqual({ status: "unsaved" });
    expect(store.value).toMatchObject({ stars: 100, bodyMissionProgress: { placedWordIds: [] } });
    service.dispose();
  });
});
