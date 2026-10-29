import type { AnswerAttempt, LearningEvidence } from "@/types/contracts";

export type MasteryStatus = "unseen" | "practicing" | "secure" | "review-due";
export type MasterySummary = {
  subjectId: string;
  skillId: string;
  learningItemId: string;
  status: MasteryStatus;
  independentSuccesses: number;
  qualifyingRuns: number;
  lastIndependentAt: string | null;
};
const day = 24 * 60 * 60 * 1000;
function instant(value: string): number | null {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}
function isIndependent(a: AnswerAttempt): boolean {
  return a.attemptIndex === 1 && a.correct && !a.helpUsed;
}

/** Derives mastery from retained raw evidence; balance and audio replay do not affect it. */
export function deriveMastery(
  evidence: readonly LearningEvidence[],
  nowIso: string,
): MasterySummary[] {
  const now = instant(nowIso);
  const groups = new Map<string, LearningEvidence[]>();
  for (const entry of evidence) {
    const key = `${entry.subjectId}\u0000${entry.skillId}\u0000${entry.learningItemId}`;
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  return [...groups.values()].map((entries) => {
    const first = entries[0]!;
    const attempts = entries.map((entry) => entry.attempt);
    const qualifying = new Map<string, AnswerAttempt>();
    let priorTime: number | null = null;
    let clockMovedBackward = false;
    for (const attempt of attempts) {
      const time = instant(attempt.timestamp);
      if (time === null) continue;
      if (priorTime !== null && time < priorTime) clockMovedBackward = true;
      priorTime = time;
      if (isIndependent(attempt) && !qualifying.has(attempt.runId))
        qualifying.set(attempt.runId, attempt);
    }
    const successes = [...qualifying.values()].sort(
      (a, b) => instant(a.timestamp)! - instant(b.timestamp)!,
    );
    const firstAt = successes.length > 0 ? instant(successes[0]!.timestamp) : null;
    const last = successes.at(-1) ?? null;
    const lastAt = last ? instant(last.timestamp) : null;
    const spacedRun =
      firstAt !== null &&
      successes.some(
        (attempt) =>
          attempt.runId !== successes[0]!.runId &&
          instant(attempt.timestamp)! - firstAt >= day,
      );
    const secure =
      !clockMovedBackward &&
      successes.length >= 3 &&
      new Set(successes.map((attempt) => attempt.runId)).size >= 2 &&
      spacedRun;
    const postSecureConcern =
      secure &&
      lastAt !== null &&
      attempts.some((attempt) => {
        const time = instant(attempt.timestamp);
        if (time === null || time <= lastAt) return false;
        return (
          (attempt.attemptIndex === 1 && !attempt.correct) || attempt.helpUsed
        );
      });
    const expired =
      secure && lastAt !== null && now !== null && now >= lastAt + 7 * day;
    const status: MasteryStatus = secure
      ? expired || postSecureConcern
        ? "review-due"
        : "secure"
      : attempts.length === 0
        ? "unseen"
        : "practicing";
    return {
      subjectId: first.subjectId,
      skillId: first.skillId,
      learningItemId: first.learningItemId,
      status,
      independentSuccesses: successes.length,
      qualifyingRuns: new Set(successes.map((attempt) => attempt.runId)).size,
      lastIndependentAt: last?.timestamp ?? null,
    };
  });
}
