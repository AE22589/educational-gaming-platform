import { describe, expect, it } from "vitest";
import { BODY_PARTS_WORDS, completedAdventureStations, isRoundComplete, missionProgress, roundWords } from "./body-parts-mission";

describe("body-parts mission content and derived progress", () => {
  it("accepts either side for paired body parts while keeping hand and arm targets separate", () => {
    for (const id of ["eye", "ear", "arm", "hand", "leg", "foot"]) {
      const word = BODY_PARTS_WORDS.find((item) => item.id === id)!;
      expect(word.targets).toHaveLength(2);
    }
    expect(BODY_PARTS_WORDS.find((word) => word.id === "arm")?.targets).not.toContain("hand-left");
    expect(BODY_PARTS_WORDS.find((word) => word.id === "leg")?.targets).not.toContain("foot-left");
  });
  it("derives the 0 to 4 to 9 mission count from placed words", () => {
    expect(missionProgress([])).toBe(0);
    const firstRound = roundWords(1).map((word) => word.id);
    expect(missionProgress(firstRound)).toBe(4);
    expect(isRoundComplete(1, firstRound)).toBe(true);
    expect(missionProgress([...firstRound, ...roundWords(2).map((word) => word.id)])).toBe(9);
  });
  it("moves the dragon when Continue opens round two and preserves completed stations on replay", () => {
    const firstRun = { runId: "run-1", round: 1 as const, status: "active" as const };
    const firstRoundReward = { key: "body-parts:run-1:round-1", runId: "run-1", kind: "body-round-complete" };
    expect(completedAdventureStations(firstRun, [firstRoundReward])).toBe(0);
    expect(completedAdventureStations({ ...firstRun, round: 2 }, [firstRoundReward])).toBe(1);
    expect(completedAdventureStations({ runId: "run-1", round: 2, status: "completed" }, [firstRoundReward])).toBe(2);
    expect(completedAdventureStations({ runId: "run-2", round: 1, status: "active" }, [
      firstRoundReward,
      { key: "body-parts:run-1:round-2", runId: "run-1", kind: "body-round-complete" },
    ])).toBe(2);
  });
});
