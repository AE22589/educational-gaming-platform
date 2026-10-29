import type { Mission, SessionState } from "@/types/contracts";

function seededRandom(seed: string): () => number {
  let value = 2166136261;
  for (const character of seed) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/** Profile creates run identity/order once; reload resumes this persisted definition. */
export function createSession(
  mission: Mission,
  runId: string,
  seed: string,
): SessionState {
  const random = seededRandom(seed);
  const questionOrder = shuffle(mission.questions.map((q) => q.id), random);
  const optionsByQuestion: Record<string, string[]> = {};
  const questionStates: Record<string, "locked" | "available" | "solved"> = {};
  for (const [index, questionId] of questionOrder.entries()) {
    const question = mission.questions.find((item) => item.id === questionId)!;
    optionsByQuestion[questionId] = shuffle(question.optionIds, random);
    questionStates[questionId] = index === 0 ? "available" : "locked";
  }
  return {
    runId,
    missionId: mission.id,
    missionVersion: mission.version,
    seed,
    questionOrder,
    optionsByQuestion,
    questionStates,
    results: [],
    status: "active",
  };
}
