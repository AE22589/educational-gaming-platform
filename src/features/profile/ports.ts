import type {
  AnswerAttempt,
  ProfileState,
  SessionState,
} from "@/types/contracts";
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;
export type RecoveryReason =
  | "unavailable"
  | "quota"
  | "invalid-json"
  | "invalid-data"
  | "migration-failed"
  | "future-version"
  | "conflict"
  | "oversized-import";
export const recoveryMessages: Record<RecoveryReason, string> = {
  unavailable:
    "No podemos acceder a los datos. Puedes reintentar o exportar una copia.",
  quota:
    "Cambios no guardados. No hay espacio suficiente. Puedes reintentar o exportar una copia.",
  "invalid-json":
    "No podemos leer estos datos. Conserva una copia antes de recuperarlos.",
  "invalid-data":
    "Los datos necesitan revisión. Conserva una copia antes de recuperarlos.",
  "migration-failed":
    "No pudimos actualizar los datos. La copia original se conserva.",
  "future-version":
    "Estos datos necesitan una versión más reciente. La copia original se conserva.",
  conflict:
    "Otra pestaña puede estar usando tus datos. Esta pestaña no guardará cambios.",
  "oversized-import": "La copia es demasiado grande para importarla.",
};
export interface ExclusiveWriterLease {
  readonly id: string;
  isActive(): boolean;
  release(): void;
}
export type LoadResult =
  | { status: "empty" }
  | { status: "ready"; snapshot: ProfileState }
  | {
      status: "recovery";
      reason: RecoveryReason;
      raw: string | null;
      backupRaw?: string | null;
    };
export type SaveResult =
  | { status: "saved"; revision: number }
  | { status: "unsaved"; reason: RecoveryReason };
export interface SnapshotStore {
  load(): Promise<LoadResult>;
  save(
    snapshot: ProfileState,
    expectedRevision: number | null,
    lease: ExclusiveWriterLease,
  ): Promise<SaveResult>;
  restoreBackup(lease: ExclusiveWriterLease): Promise<LoadResult>;
  importSnapshot(raw: string, lease: ExclusiveWriterLease): Promise<LoadResult>;
  clear(lease: ExclusiveWriterLease): Promise<SaveResult>;
  exportRaw(): Promise<string | null>;
}
export type WriterOwnership =
  | { status: "exclusive"; lease: ExclusiveWriterLease }
  | { status: "read-only"; reason: "other-tab" | "uncertain" };
export interface WriterCoordinator {
  acquire(): Promise<WriterOwnership>;
}
export type ProfileStatus =
  | { status: "loading" }
  | {
      status: "ready";
      snapshot: DeepReadonly<ProfileState>;
      ownership: "exclusive" | "read-only";
    }
  | {
      status: "unsaved";
      pending: DeepReadonly<ProfileState>;
      reason: RecoveryReason;
    }
  | {
      status: "recovery";
      reason: RecoveryReason;
      raw: string | null;
      backupRaw?: string | null;
    };
export type AttemptResult =
  | {
      status: "accepted";
      revision: number;
      session: DeepReadonly<SessionState>;
    }
  | {
      status: "duplicate";
      revision: number;
      session: DeepReadonly<SessionState>;
    }
  | {
      status: "rejected";
      reason: "invalid-attempt" | "locked-question" | "not-ready" | "read-only";
    }
  | { status: "unsaved"; reason: RecoveryReason };
export type StartRunResult =
  | { status: "started"; session: DeepReadonly<SessionState> }
  | { status: "confirmation-required" }
  | { status: "unavailable" | "read-only" | "unsaved" };
/** Games submit events; profile derives correctness, completion and rewards from persisted content. */
export interface ProfilePort {
  getState(): ProfileStatus;
  subscribe(listener: () => void): () => void;
  submitAttempt(attempt: AnswerAttempt): Promise<AttemptResult>;
  startRun(input: {
    missionId: string;
    missionVersion: string;
    confirmReplacement: boolean;
  }): Promise<StartRunResult>;
  abandonRun(confirmation: { confirmedAbandonment: true }): Promise<SaveResult>;
}
export interface RecoveryPort {
  retry(): Promise<LoadResult | SaveResult>;
  restoreBackup(): Promise<LoadResult | SaveResult>;
  exportRaw(): Promise<string | null>;
  importSnapshot(raw: string): Promise<LoadResult>;
  reset(confirmation: { confirmedDataLoss: true }): Promise<LoadResult>;
}
