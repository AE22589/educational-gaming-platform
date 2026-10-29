import { profileStateSchema } from "@/types/contracts";
import { decodeSnapshot, MAX_SNAPSHOT_BYTES } from "./snapshot";
import type {
  ExclusiveWriterLease,
  LoadResult,
  RecoveryReason,
  SaveResult,
  SnapshotStore,
} from "./ports";

const PROFILE_KEY = "tier-abenteuer.profile.v1";
const BACKUP_KEY = "tier-abenteuer.profile.v1.backup";
const RECOVERY_KEY = "tier-abenteuer.profile.v1.recovery";

function storageError(error: unknown): RecoveryReason {
  return error instanceof DOMException && error.name === "QuotaExceededError"
    ? "quota"
    : "unavailable";
}

/** Construct only after client hydration; this class never reaches storage during SSR. */
export class BrowserSnapshotStore implements SnapshotStore {
  constructor(private readonly storage: Storage) {}

  async load(): Promise<LoadResult> {
    try {
      const raw = this.storage.getItem(PROFILE_KEY);
      const backupRaw = this.storage.getItem(BACKUP_KEY);
      if (raw === null) {
        return backupRaw === null
          ? { status: "empty" }
          : { status: "recovery", reason: "invalid-data", raw: null, backupRaw };
      }
      const decoded = decodeSnapshot(raw);
      if (decoded.status === "ready") return decoded;
      if (decoded.status === "recovery") return { ...decoded, backupRaw };
      return { status: "recovery", reason: "invalid-data", raw: null, backupRaw };
    } catch {
      return { status: "recovery", reason: "unavailable", raw: null };
    }
  }

  async save(
    snapshot: Parameters<SnapshotStore["save"]>[0],
    expectedRevision: number | null,
    lease: ExclusiveWriterLease,
  ): Promise<SaveResult> {
    if (!lease.isActive()) return { status: "unsaved", reason: "conflict" };
    const parsed = profileStateSchema.safeParse(snapshot);
    if (!parsed.success)
      return { status: "unsaved", reason: "invalid-data" };
    if (
      expectedRevision === null
        ? parsed.data.revision !== 0
        : parsed.data.revision !== expectedRevision + 1
    )
      return { status: "unsaved", reason: "conflict" };

    try {
      const currentRaw = this.storage.getItem(PROFILE_KEY);
      if (currentRaw === null) {
        if (expectedRevision !== null)
          return { status: "unsaved", reason: "conflict" };
      } else {
        const current = decodeSnapshot(currentRaw);
        if (
          expectedRevision === null ||
          current.status !== "ready" ||
          current.snapshot.revision !== expectedRevision
        )
          return { status: "unsaved", reason: "conflict" };
        if (!lease.isActive())
          return { status: "unsaved", reason: "conflict" };
        // A failed primary write still leaves the previous validated snapshot intact.
        this.storage.setItem(BACKUP_KEY, currentRaw);
      }
      if (!lease.isActive()) return { status: "unsaved", reason: "conflict" };
      this.storage.setItem(PROFILE_KEY, JSON.stringify(parsed.data));
      const committed = decodeSnapshot(this.storage.getItem(PROFILE_KEY) ?? "");
      return committed.status === "ready" &&
        committed.snapshot.revision === parsed.data.revision
        ? { status: "saved", revision: parsed.data.revision }
        : { status: "unsaved", reason: "unavailable" };
    } catch (error) {
      return { status: "unsaved", reason: storageError(error) };
    }
  }

  async restoreBackup(lease: ExclusiveWriterLease): Promise<LoadResult> {
    if (!lease.isActive())
      return { status: "recovery", reason: "conflict", raw: null };
    try {
      const raw = this.storage.getItem(BACKUP_KEY);
      if (!raw) return { status: "recovery", reason: "invalid-data", raw: null };
      const decoded = decodeSnapshot(raw);
      if (decoded.status !== "ready") return decoded;
      const current = this.storage.getItem(PROFILE_KEY);
      if (current !== null) this.storage.setItem(RECOVERY_KEY, current);
      if (!lease.isActive())
        return { status: "recovery", reason: "conflict", raw: current };
      this.storage.setItem(PROFILE_KEY, raw);
      return decoded;
    } catch (error) {
      return {
        status: "recovery",
        reason: storageError(error),
        raw: null,
      };
    }
  }

  async importSnapshot(
    raw: string,
    lease: ExclusiveWriterLease,
  ): Promise<LoadResult> {
    if (new TextEncoder().encode(raw).byteLength > MAX_SNAPSHOT_BYTES)
      return { status: "recovery", reason: "oversized-import", raw };
    const imported = decodeSnapshot(raw);
    if (imported.status !== "ready") return imported;
    if (!lease.isActive())
      return { status: "recovery", reason: "conflict", raw };
    try {
      const currentRaw = this.storage.getItem(PROFILE_KEY);
      const current = currentRaw === null ? null : decodeSnapshot(currentRaw);
      if (currentRaw !== null && current?.status === "ready") {
        const next = {
          ...imported.snapshot,
          revision: current.snapshot.revision + 1,
        };
        const saved = await this.save(next, current.snapshot.revision, lease);
        return saved.status === "saved"
          ? { status: "ready", snapshot: next }
          : {
              status: "recovery",
              reason: saved.reason,
              raw,
              backupRaw: currentRaw,
            };
      }
      if (currentRaw !== null) this.storage.setItem(RECOVERY_KEY, currentRaw);
      const next = { ...imported.snapshot, revision: 0 };
      if (!lease.isActive())
        return {
          status: "recovery",
          reason: "conflict",
          raw,
          backupRaw: currentRaw,
        };
      this.storage.setItem(PROFILE_KEY, JSON.stringify(next));
      return { status: "ready", snapshot: next };
    } catch (error) {
      return {
        status: "recovery",
        reason: storageError(error),
        raw,
      };
    }
  }

  async clear(lease: ExclusiveWriterLease): Promise<SaveResult> {
    if (!lease.isActive()) return { status: "unsaved", reason: "conflict" };
    try {
      if (!lease.isActive()) return { status: "unsaved", reason: "conflict" };
      this.storage.removeItem(PROFILE_KEY);
      this.storage.removeItem(BACKUP_KEY);
      this.storage.removeItem(RECOVERY_KEY);
      return { status: "saved", revision: 0 };
    } catch (error) {
      return { status: "unsaved", reason: storageError(error) };
    }
  }

  async exportRaw(): Promise<string | null> {
    try {
      return (
        this.storage.getItem(PROFILE_KEY) ??
        this.storage.getItem(BACKUP_KEY) ??
        this.storage.getItem(RECOVERY_KEY)
      );
    } catch {
      return null;
    }
  }
}
