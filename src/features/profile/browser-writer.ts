import type {
  ExclusiveWriterLease,
  WriterCoordinator,
  WriterOwnership,
} from "./ports";

const LOCK_NAME = "tier-abenteuer-profile-v1";
const LEASE_KEY = "tier-abenteuer.profile.v1.writer";
const LEASE_MS = 8_000;
const HEARTBEAT_MS = 2_000;
type StoredLease = { ownerId: string; expiresAt: number };
type LockMessage = { type: "claim" | "owner" | "released"; ownerId: string };

function readLease(storage: Storage): StoredLease | null {
  const raw = storage.getItem(LEASE_KEY);
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      "ownerId" in value &&
      typeof value.ownerId === "string" &&
      value.ownerId.length > 0 &&
      "expiresAt" in value &&
      typeof value.expiresAt === "number" &&
      Number.isFinite(value.expiresAt)
    )
      return value as StoredLease;
  } catch {
    throw new Error("Writer lease data is malformed");
  }
  throw new Error("Writer lease data is malformed");
}

/** Called only in a browser after hydration. A lease is fenced by ownership checks on every save. */
export class BrowserWriterCoordinator implements WriterCoordinator {
  private readonly channel: BroadcastChannel | null;
  private activeFallback: (() => void) | null = null;
  private releaseFallback: (() => void) | null = null;

  constructor(private readonly storage: Storage) {
    this.channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel("tier-abenteuer-profile-v1");
  }

  async acquire(): Promise<WriterOwnership> {
    if (typeof navigator === "undefined")
      return { status: "read-only", reason: "uncertain" };
    if (navigator.locks) return this.acquireWebLock();
    return this.acquireFallbackLease();
  }

  private async acquireWebLock(): Promise<WriterOwnership> {
    let releaseLock: (() => void) | undefined;
    let settle: (result: WriterOwnership) => void = () => undefined;
    let settled = false;
    const acquired = new Promise<WriterOwnership>((resolve) => {
      settle = (value) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };
    });
    void navigator.locks
      .request(LOCK_NAME, { mode: "exclusive", ifAvailable: true }, async (lock) => {
        if (!lock) {
          settle({ status: "read-only", reason: "other-tab" });
          return;
        }
        let active = true;
        let release!: () => void;
        const held = new Promise<void>((resolve) => (release = resolve));
        releaseLock = release;
        const lease: ExclusiveWriterLease = {
          id: crypto.randomUUID(),
          isActive: () => active,
          release: () => {
            active = false;
            release();
          },
        };
        settle({ status: "exclusive", lease });
        await held;
      })
      .catch(() => settle({ status: "read-only", reason: "uncertain" }));
    const result = await acquired;
    if (result.status === "exclusive") {
      const lease = result.lease;
      return {
        status: "exclusive",
        lease: {
          ...lease,
          release: () => {
            releaseLock?.();
            lease.release();
          },
        },
      };
    }
    return result;
  }

  private async acquireFallbackLease(): Promise<WriterOwnership> {
    if (!this.channel)
      return { status: "read-only", reason: "uncertain" };
    const id = crypto.randomUUID();
    let current: StoredLease | null;
    try {
      current = readLease(this.storage);
      if (current && current.expiresAt > Date.now())
        return { status: "read-only", reason: "other-tab" };
      this.storage.setItem(
        LEASE_KEY,
        JSON.stringify({ ownerId: id, expiresAt: Date.now() + LEASE_MS }),
      );
      current = readLease(this.storage);
    } catch {
      return { status: "read-only", reason: "uncertain" };
    }
    if (current?.ownerId !== id)
      return { status: "read-only", reason: "other-tab" };

    let active = true;
    let heartbeat: ReturnType<typeof setInterval> | null = null;
    const deactivate = () => {
      if (!active) return;
      active = false;
      this.activeFallback = null;
      if (heartbeat !== null) clearInterval(heartbeat);
    };
    this.activeFallback = deactivate;
    const onMessage = (event: MessageEvent<LockMessage>) => {
      const message = event.data;
      if (
        message?.ownerId &&
        message.ownerId !== id &&
        (message.type === "claim" || message.type === "owner")
      ) {
        deactivate();
        try {
          if (readLease(this.storage)?.ownerId === id)
            this.storage.removeItem(LEASE_KEY);
        } catch {
          // Inactive leases never permit writes, even if cleanup fails.
        }
      }
    };
    this.channel.addEventListener("message", onMessage);
    this.channel.postMessage({ type: "claim", ownerId: id } satisfies LockMessage);
    await new Promise((resolve) => setTimeout(resolve, 120));
    try {
      if (readLease(this.storage)?.ownerId !== id) deactivate();
    } catch {
      deactivate();
    }
    if (!active) {
      this.channel.removeEventListener("message", onMessage);
      return { status: "read-only", reason: "uncertain" };
    }

    heartbeat = setInterval(() => {
      try {
        const lease = readLease(this.storage);
        if (!active || lease?.ownerId !== id) {
          deactivate();
          return;
        }
        this.storage.setItem(
          LEASE_KEY,
          JSON.stringify({ ownerId: id, expiresAt: Date.now() + LEASE_MS }),
        );
      } catch {
        deactivate();
      }
    }, HEARTBEAT_MS);
    this.channel.postMessage({ type: "owner", ownerId: id } satisfies LockMessage);
    const lease: ExclusiveWriterLease = {
      id,
      isActive: () => {
        if (!active) return false;
        try {
          const currentLease = readLease(this.storage);
          if (
            currentLease?.ownerId !== id ||
            currentLease.expiresAt <= Date.now()
          ) {
            deactivate();
            return false;
          }
          return true;
        } catch {
          deactivate();
          return false;
        }
      },
      release: () => {
        deactivate();
        if (heartbeat !== null) clearInterval(heartbeat);
        this.channel?.removeEventListener("message", onMessage);
        try {
          if (readLease(this.storage)?.ownerId === id)
            this.storage.removeItem(LEASE_KEY);
        } catch {
          // A released or uncertain writer cannot save regardless of cleanup.
        }
        this.channel?.postMessage({ type: "released", ownerId: id } satisfies LockMessage);
      },
    };
    this.releaseFallback = lease.release;
    return { status: "exclusive", lease };
  }

  dispose(): void {
    this.releaseFallback?.();
    this.activeFallback?.();
    this.channel?.close();
  }
}
