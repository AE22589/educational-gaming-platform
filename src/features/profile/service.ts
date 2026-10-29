import {
  answerAttemptSchema,
  profileStateSchema,
  validateSessionReferences,
  type AnswerAttempt,
  type LearningEvidence,
  type ProfileState,
  type SessionState,
} from "@/types/contracts";
import { deriveMastery, type MasterySummary } from "@/features/rewards/mastery";
import type { ProfileCatalog } from "./catalog";
import { PROFILE_SCHEMA_VERSION } from "@/types/contracts";
import {
  type AttemptResult,
  type ExclusiveWriterLease,
  type LoadResult,
  type ProfileStatus,
  type RecoveryPort,
  type SaveResult,
  type SnapshotStore,
  type StartRunResult,
  type WriterCoordinator,
  type WriterOwnership,
  type ProfilePort,
} from "./ports";
import { createSession } from "./sessions";
import { decodeSnapshot } from "./snapshot";

export function createEmptyProfile(): ProfileState {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    revision: 0,
    stars: 0,
    ownedItemIds: [],
    equipment: {},
    learningEvidence: [],
    masteryPolicyVersion: "mastery-v1",
    activeSession: null,
    archivedSessions: [],
    processedAttemptIds: [],
    processedRewardKeys: [],
    rewardLedger: [],
  };
}

export class ProfileService implements ProfilePort, RecoveryPort {
  private readonly listeners = new Set<() => void>();
  private readonly initial: ProfileStatus = { status: "loading" };
  private state: ProfileStatus = this.initial;
  private persisted: ProfileState | null = null;
  private ownership: WriterOwnership | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private initialized = false;

  constructor(
    private readonly store: SnapshotStore,
    private readonly writer: WriterCoordinator,
    private readonly catalog: ProfileCatalog,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  getState = (): ProfileStatus => this.state;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getMastery(nowIso = this.now()): MasterySummary[] {
    const snapshot =
      this.state.status === "ready"
        ? this.state.snapshot
        : this.state.status === "unsaved"
          ? this.state.pending
          : null;
    return snapshot ? deriveMastery(snapshot.learningEvidence, nowIso) : [];
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    this.publish(this.initial);
    try {
      this.ownership = await this.writer.acquire();
      const loaded = await this.store.load();
      if (loaded.status === "ready") {
        if (!this.validatePersistedSessions(loaded.snapshot)) {
          const raw = await this.store.exportRaw();
          this.publish({ status: "recovery", reason: "invalid-data", raw });
          return;
        }
        this.persisted = loaded.snapshot;
        this.publishReady(loaded.snapshot);
        return;
      }
      if (loaded.status === "recovery") {
        this.publish(loaded);
        return;
      }
      const initial = createEmptyProfile();
      if (this.lease()) {
        const saved = await this.store.save(initial, null, this.lease()!);
        if (saved.status === "saved") {
          this.persisted = initial;
          this.publishReady(initial);
          return;
        }
        this.publish({ status: "unsaved", pending: initial, reason: saved.reason });
        return;
      }
      // A read-only tab may show a temporary zero profile, but cannot create or save it.
      this.publishReady(initial);
    } catch {
      this.publish({ status: "recovery", reason: "unavailable", raw: null });
    }
  }

  async submitAttempt(input: AnswerAttempt): Promise<AttemptResult> {
    return this.serial(async () => {
      if (this.state.status !== "ready")
        return { status: "rejected", reason: "not-ready" };
      const snapshot = this.state.snapshot as ProfileState;
      if (this.state.ownership !== "exclusive")
        return { status: "rejected", reason: "read-only" };
      const session = snapshot.activeSession;
      if (!session) return { status: "rejected", reason: "not-ready" };
      if (snapshot.processedAttemptIds.includes(input.attemptId)) {
        const recorded = [...snapshot.archivedSessions, session].find((run) =>
          run.results.some((attempt) => attempt.attemptId === input.attemptId),
        );
        return recorded
          ? {
              status: "duplicate",
              revision: snapshot.revision,
              session: recorded,
            }
          : { status: "rejected", reason: "invalid-attempt" };
      }
      const attemptShape = answerAttemptSchema.safeParse(input);
      if (!attemptShape.success || input.runId !== session.runId)
        return { status: "rejected", reason: "invalid-attempt" };
      const mission = this.catalog.getMission(session.missionId, session.missionVersion);
      if (!mission) return { status: "rejected", reason: "invalid-attempt" };
      let trustedSession: SessionState;
      try {
        trustedSession = validateSessionReferences(session, mission);
      } catch {
        return { status: "rejected", reason: "invalid-attempt" };
      }
      const question = mission.questions.find((q) => q.id === input.questionId);
      if (!question || trustedSession.questionStates[question.id] !== "available")
        return { status: "rejected", reason: "locked-question" };
      if (!trustedSession.optionsByQuestion[question.id]?.includes(input.selectedOptionId))
        return { status: "rejected", reason: "invalid-attempt" };
      const item = this.catalog.getLearningItem(question.learningItemId);
      if (!item || input.contentVersion !== item.contentVersion)
        return { status: "rejected", reason: "invalid-attempt" };
      const priorAttempts = trustedSession.results.filter(
        (attempt) => attempt.questionId === question.id,
      );
      if (input.attemptIndex !== priorAttempts.length + 1)
        return { status: "rejected", reason: "invalid-attempt" };

      const correct = input.selectedOptionId === question.correctOptionId;
      const attempt: AnswerAttempt = {
        ...input,
        correct,
        timestamp: this.now(),
        contentVersion: item.contentVersion,
      };
      const nextSession: SessionState = {
        ...trustedSession,
        questionStates: { ...trustedSession.questionStates },
        results: [...trustedSession.results, attempt],
      };
      const evidence: LearningEvidence[] = item.skillIds.map((skillId) => ({
        subjectId: item.subjectId,
        skillId,
        learningItemId: item.id,
        attempt,
      }));
      const next: ProfileState = {
        ...snapshot,
        revision: snapshot.revision + 1,
        learningEvidence: [...snapshot.learningEvidence, ...evidence],
        processedAttemptIds: [...snapshot.processedAttemptIds, attempt.attemptId],
        processedRewardKeys: [...snapshot.processedRewardKeys],
        rewardLedger: [...snapshot.rewardLedger],
      };
      if (correct) {
        nextSession.questionStates[question.id] = "solved";
        const rewardKey = `${session.runId}:${question.id}:solved`;
        this.addReward(next, {
          key: rewardKey,
          runId: session.runId,
          questionId: question.id,
          kind: "question-solved",
          amount: 2,
          timestamp: attempt.timestamp,
        });
        const nextQuestionId = nextSession.questionOrder.find(
          (id) => nextSession.questionStates[id] !== "solved",
        );
        if (nextQuestionId)
          nextSession.questionStates[nextQuestionId] = "available";
      }
      const completed = nextSession.questionOrder.every(
        (id) => nextSession.questionStates[id] === "solved",
      );
      if (completed) {
        nextSession.status = "completed";
        this.addReward(next, {
          key: `${session.runId}:complete`,
          runId: session.runId,
          kind: "run-complete",
          amount: 10,
          timestamp: attempt.timestamp,
        });
        next.archivedSessions = [...next.archivedSessions, nextSession];
        next.activeSession = null;
      } else {
        next.activeSession = nextSession;
      }
      const result = await this.persist(next);
      return result.status === "saved"
        ? { status: "accepted", revision: result.revision, session: nextSession }
        : result;
    });
  }

  async startRun(input: {
    missionId: string;
    missionVersion: string;
    confirmReplacement: boolean;
  }): Promise<StartRunResult> {
    return this.serial(async () => {
      if (this.state.status !== "ready") return { status: "unsaved" };
      if (this.state.ownership !== "exclusive" || !this.lease())
        return { status: "read-only" };
      const current = this.state.snapshot as ProfileState;
      if (current.activeSession && !input.confirmReplacement)
        return { status: "confirmation-required" };
      const mission = this.catalog.getMission(input.missionId, input.missionVersion);
      if (!mission) return { status: "unavailable" };
      const seed = crypto.randomUUID();
      const run = createSession(mission, crypto.randomUUID(), seed);
      const archived = current.activeSession
        ? [{ ...current.activeSession, status: "abandoned" as const }]
        : [];
      const next = profileStateSchema.parse({
        ...current,
        revision: current.revision + 1,
        activeSession: run,
        archivedSessions: [...current.archivedSessions, ...archived],
      });
      const saved = await this.persist(next);
      return saved.status === "saved"
        ? { status: "started", session: run }
        : { status: "unsaved" };
    });
  }

  async abandonRun(confirmation: { confirmedAbandonment: true }): Promise<SaveResult> {
    if (!confirmation.confirmedAbandonment)
      return { status: "unsaved", reason: "invalid-data" };
    return this.serial(async () => {
      if (this.state.status !== "ready")
        return { status: "unsaved", reason: "unavailable" };
      if (this.state.ownership !== "exclusive" || !this.lease())
        return { status: "unsaved", reason: "conflict" };
      const current = this.state.snapshot as ProfileState;
      if (!current.activeSession)
        return { status: "unsaved", reason: "invalid-data" };
      const next = profileStateSchema.parse({
        ...current,
        revision: current.revision + 1,
        activeSession: null,
        archivedSessions: [
          ...current.archivedSessions,
          { ...current.activeSession, status: "abandoned" },
        ],
      });
      return this.persist(next);
    });
  }

  async retry(): Promise<LoadResult | SaveResult> {
    return this.serial(async () => {
      if (this.state.status === "unsaved" && this.persisted) {
        if (!this.lease()) await this.acquire();
        const lease = this.lease();
        if (!lease) return { status: "unsaved", reason: "conflict" };
        const pending = this.state.pending as ProfileState;
        const saved = await this.store.save(pending, this.persisted.revision, lease);
        if (saved.status === "saved") {
          this.persisted = pending;
          this.publishReady(pending);
        } else if (saved.reason === "conflict") {
          const latest = await this.store.load();
          await this.publishLoad(latest);
        }
        return saved;
      }
      await this.acquire();
      const loaded = await this.store.load();
      await this.publishLoad(loaded);
      return loaded;
    });
  }

  async restoreBackup(): Promise<LoadResult | SaveResult> {
    return this.serial(async () => {
      await this.acquire();
      const lease = this.lease();
      if (!lease) return { status: "unsaved", reason: "conflict" };
      const result = await this.store.restoreBackup(lease);
      await this.publishLoad(result);
      return result;
    });
  }

  async exportRaw(): Promise<string | null> {
    if (this.state.status === "unsaved")
      return JSON.stringify(this.state.pending, null, 2);
    if (this.state.status === "recovery" && this.state.raw !== null)
      return this.state.raw;
    return this.store.exportRaw();
  }

  async importSnapshot(raw: string): Promise<LoadResult> {
    return this.serial(async () => {
      await this.acquire();
      const lease = this.lease();
      if (!lease)
        return { status: "recovery", reason: "conflict", raw };
      const decoded = decodeSnapshot(raw);
      if (decoded.status === "recovery") {
        this.publish(decoded);
        return decoded;
      }
      if (decoded.status !== "ready")
        return { status: "recovery", reason: "invalid-data", raw };
      if (!this.validatePersistedSessions(decoded.snapshot)) {
        const invalid = { status: "recovery" as const, reason: "invalid-data" as const, raw };
        this.publish(invalid);
        return invalid;
      }
      const imported = await this.store.importSnapshot(raw, lease);
      await this.publishLoad(imported);
      return imported;
    });
  }

  async reset(confirmation: { confirmedDataLoss: true }): Promise<LoadResult> {
    if (!confirmation.confirmedDataLoss)
      return { status: "recovery", reason: "invalid-data", raw: null };
    return this.serial(async () => {
      await this.acquire();
      const lease = this.lease();
      if (!lease) return { status: "recovery", reason: "conflict", raw: null };
      const cleared = await this.store.clear(lease);
      if (cleared.status !== "saved")
        return { status: "recovery", reason: cleared.reason, raw: null };
      this.persisted = null;
      const empty = createEmptyProfile();
      const saved = await this.store.save(empty, null, lease);
      if (saved.status !== "saved") {
        this.publish({ status: "unsaved", pending: empty, reason: saved.reason });
        return { status: "recovery", reason: saved.reason, raw: null };
      }
      this.persisted = empty;
      this.publishReady(empty);
      return { status: "ready", snapshot: empty };
    });
  }

  dispose(): void {
    if (this.ownership?.status === "exclusive") this.ownership.lease.release();
    this.ownership = null;
    const writer = this.writer as WriterCoordinator & { dispose?: () => void };
    writer.dispose?.();
  }

  private addReward(
    state: ProfileState,
    reward: ProfileState["rewardLedger"][number],
  ): void {
    if (state.processedRewardKeys.includes(reward.key)) return;
    state.processedRewardKeys.push(reward.key);
    state.rewardLedger.push(reward);
    state.stars += reward.amount;
  }

  private async persist(next: ProfileState): Promise<SaveResult> {
    const lease = this.lease();
    const prior = this.persisted;
    if (!lease || !prior)
      return { status: "unsaved", reason: "conflict" };
    const saved = await this.store.save(next, prior.revision, lease);
    if (saved.status === "saved") {
      this.persisted = next;
      this.publishReady(next);
      return saved;
    }
    this.publish({ status: "unsaved", pending: next, reason: saved.reason });
    return saved;
  }

  private validatePersistedSessions(snapshot: ProfileState): boolean {
    const sessions = [
      ...snapshot.archivedSessions,
      ...(snapshot.activeSession ? [snapshot.activeSession] : []),
    ];
    const sessionAttempts = new Map<string, AnswerAttempt>();
    const expectedEvidence = new Map<string, AnswerAttempt>();
    for (const session of sessions) {
      const mission = this.catalog.getMission(session.missionId, session.missionVersion);
      if (!mission) return false;
      try {
        const checked = validateSessionReferences(session, mission);
        for (const attempt of checked.results) {
          const question = mission.questions.find((q) => q.id === attempt.questionId);
          const item = question
            ? this.catalog.getLearningItem(question.learningItemId)
            : null;
          if (
            !question ||
            !item ||
            attempt.contentVersion !== item.contentVersion ||
            attempt.correct !== (attempt.selectedOptionId === question.correctOptionId)
          )
            return false;
          sessionAttempts.set(attempt.attemptId, attempt);
          for (const skillId of item.skillIds) {
            const key = `${attempt.attemptId}\u0000${item.subjectId}\u0000${skillId}\u0000${item.id}`;
            expectedEvidence.set(key, attempt);
          }
        }
      } catch {
        return false;
      }
    }
    const actualEvidence = new Map(
      snapshot.learningEvidence.map((entry) => [
        `${entry.attempt.attemptId}\u0000${entry.subjectId}\u0000${entry.skillId}\u0000${entry.learningItemId}`,
        entry.attempt,
      ]),
    );
    const sameIds = (left: readonly string[], right: Iterable<string>) => {
      const rightSet = new Set(right);
      return left.length === rightSet.size && left.every((id) => rightSet.has(id));
    };
    if (
      !sameIds(snapshot.processedAttemptIds, sessionAttempts.keys()) ||
      !sameIds(
        snapshot.processedAttemptIds,
        [...actualEvidence.values()].map((attempt) => attempt.attemptId),
      ) ||
      expectedEvidence.size !== actualEvidence.size
    )
      return false;
    for (const [key, expected] of expectedEvidence) {
      const actual = actualEvidence.get(key);
      if (
        !actual ||
        actual.runId !== expected.runId ||
        actual.questionId !== expected.questionId ||
        actual.attemptIndex !== expected.attemptIndex ||
        actual.selectedOptionId !== expected.selectedOptionId ||
        actual.correct !== expected.correct ||
        actual.helpUsed !== expected.helpUsed ||
        actual.timestamp !== expected.timestamp ||
        actual.contentVersion !== expected.contentVersion
      )
        return false;
    }
    return true;
  }

  private async acquire(): Promise<void> {
    if (this.ownership?.status === "exclusive") {
      this.ownership.lease.release();
    }
    this.ownership = await this.writer.acquire();
  }

  private lease(): ExclusiveWriterLease | null {
    if (this.ownership?.status !== "exclusive") return null;
    return this.ownership.lease.isActive() ? this.ownership.lease : null;
  }

  private async publishLoad(result: LoadResult): Promise<void> {
    if (result.status === "ready") {
      if (!this.validatePersistedSessions(result.snapshot)) {
        const raw = await this.store.exportRaw();
        this.publish({ status: "recovery", reason: "invalid-data", raw });
        return;
      }
      this.persisted = result.snapshot;
      this.publishReady(result.snapshot);
      return;
    }
    if (result.status === "empty") {
      const empty = createEmptyProfile();
      const lease = this.lease();
      if (lease) {
        const saved = await this.store.save(empty, null, lease);
        if (saved.status === "saved") {
          this.persisted = empty;
          this.publishReady(empty);
        } else this.publish({ status: "unsaved", pending: empty, reason: saved.reason });
      } else this.publishReady(empty);
      return;
    }
    this.publish(result);
  }

  private publishReady(snapshot: ProfileState): void {
    this.publish({
      status: "ready",
      snapshot,
      ownership: this.lease() ? "exclusive" : "read-only",
    });
  }

  private publish(next: ProfileStatus): void {
    this.state = next;
    for (const listener of this.listeners) listener();
  }

  private serial<T>(work: () => Promise<T>): Promise<T> {
    const current = this.queue.then(work, work);
    this.queue = current.then(
      () => undefined,
      () => undefined,
    );
    return current;
  }
}
