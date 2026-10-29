import { describe, expect, it } from "vitest";
import content from "../../tests/fixtures/content-v1.json";
import session from "../../tests/fixtures/session-v1.json";
import profile from "../../tests/fixtures/profile-v1.json";
import {
  answerAttemptSchema,
  assetSchema,
  decodeContentBundle,
  contentBundleSchema,
  learningItemSchema,
  profileStateSchema,
  sessionStateSchema,
  shopItemSchema,
  validateSessionReferences,
} from "./contracts";

describe("versioned shared contracts", () => {
  it("accepts subject-neutral fixtures without English or vocabulary payloads", () => {
    expect(contentBundleSchema.parse(content).learningItems[0]?.kind).toBe(
      "number",
    );
    expect(profileStateSchema.parse(profile).stars).toBe(0);
  });
  it("preserves saved question and option order", () => {
    const mission = contentBundleSchema.parse(content).missions[0]!;
    expect(
      validateSessionReferences(session, mission).optionsByQuestion.q1,
    ).toEqual(["two", "one"]);
    expect(() =>
      validateSessionReferences(
        { ...session, missionVersion: "other" },
        mission,
      ),
    ).toThrow();
    expect(() =>
      validateSessionReferences(
        { ...session, optionsByQuestion: { q1: ["one", "forged"] } },
        mission,
      ),
    ).toThrow();
  });
  it.each([
    "missing-subject",
    "missing-skill",
    "missing-item",
    "duplicate-option",
    "wrong-answer",
    "unknown-game",
    "duplicate-id",
    "missing-asset",
  ])("rejects %s content", (mutation) => {
    const value = structuredClone(content);
    const question = value.missions[0]!.questions[0]!;
    if (mutation === "missing-subject")
      value.learningItems[0]!.subjectId = "missing";
    if (mutation === "missing-skill") question.skillIds = ["missing"];
    if (mutation === "missing-item") question.optionIds = ["one", "missing"];
    if (mutation === "duplicate-option") question.optionIds = ["one", "one"];
    if (mutation === "wrong-answer") question.correctOptionId = "missing";
    if (mutation === "unknown-game") question.gameType = "unknown";
    if (mutation === "duplicate-id")
      value.learningItems.push(value.learningItems[0]!);
    if (mutation === "missing-asset")
      Object.assign(question, { prompt: { kind: "audio", assetId: "absent" } });
    expect(contentBundleSchema.safeParse(value).success).toBe(false);
  });
  it("rejects mismatched payloads, unsafe paths, invalid attempt times and fractional prices", () => {
    expect(
      learningItemSchema.safeParse({
        ...content.learningItems[0],
        kind: "text",
      }).success,
    ).toBe(false);
    expect(
      answerAttemptSchema.safeParse({
        attemptId: "a",
        runId: "r",
        questionId: "q",
        selectedOptionId: "one",
        correct: true,
        helpUsed: false,
        attemptIndex: 1,
        timestamp: "yesterday",
        contentVersion: "1",
      }).success,
    ).toBe(false);
    expect(
      shopItemSchema.safeParse({
        id: "cap",
        nameEs: "Gorra",
        category: "headwear",
        price: 1.5,
        rendering: { assetId: "cap", layer: 1 },
      }).success,
    ).toBe(false);
    expect(
      contentBundleSchema.safeParse({
        ...content,
        assets: [
          {
            id: "x",
            path: "/animals/../secret.svg",
            type: "image",
            locale: "en",
            description: "test",
            licence: "test",
            attribution: "test",
            reviewStatus: "placeholder",
          },
        ],
      }).success,
    ).toBe(false);
  });
  it("rejects unsupported versions, unowned equipment and inconsistent session maps", () => {
    expect(
      profileStateSchema.safeParse({ ...profile, schemaVersion: 2 }).success,
    ).toBe(false);
    expect(
      profileStateSchema.safeParse({
        ...profile,
        equipment: { headwear: "cap" },
      }).success,
    ).toBe(false);
    expect(
      profileStateSchema.safeParse({
        ...profile,
        processedRewardKeys: ["forged"],
      }).success,
    ).toBe(false);
    expect(
      sessionStateSchema.safeParse({ ...session, questionStates: {} }).success,
    ).toBe(false);
    expect(
      sessionStateSchema.safeParse({ ...session, status: "completed" }).success,
    ).toBe(false);
  });
});

describe("content recovery and payload portability", () => {
  it("returns Spanish recovery for unregistered games", () => {
    const value = structuredClone(content);
    value.missions[0]!.questions[0]!.gameType = "unregistered";
    expect(decodeContentBundle(value)).toEqual({
      status: "recovery",
      message:
        "No podemos abrir esta actividad. Vuelve al inicio e inténtalo de nuevo.",
    });
  });
  it("accepts text, concepts and bilingual vocabulary without changing the shared item contract", () => {
    const base = {
      id: "example",
      contentVersion: "fixture-v1",
      subjectId: "english",
      skillIds: ["vocabulary"],
      grade: 2,
      instructionLocale: "es",
      targetLocale: "en",
    };
    expect(
      learningItemSchema.parse({
        ...base,
        kind: "vocabulary",
        payload: {
          term: "cat",
          meaning: { es: "gato" },
          imageAssetId: "cat-image",
          audioAssetId: "cat-audio",
        },
      }).kind,
    ).toBe("vocabulary");
    expect(
      learningItemSchema.parse({
        ...base,
        kind: "text",
        payload: { text: "Original fixture text" },
      }).kind,
    ).toBe("text");
    expect(
      learningItemSchema.parse({
        ...base,
        kind: "concept",
        payload: { explanation: { es: "Ejemplo técnico" }, assetIds: [] },
      }).kind,
    ).toBe("concept");
  });
});

it("permits subject-neutral local asset folders while rejecting remote and traversal paths", () => {
  const asset = {
    id: "fixture",
    path: "/avatar/cap.svg",
    type: "image",
    locale: "es",
    description: "Technical fixture",
    licence: "test-only",
    attribution: "Original test metadata",
    reviewStatus: "placeholder",
  };
  expect(assetSchema.safeParse(asset).success).toBe(true);
  for (const path of [
    "https://example.com/cap.svg",
    "//example.com/cap.svg",
    "/animals/../cap.svg",
    "/audio/%2e%2e/cap.mp3",
  ])
    expect(assetSchema.safeParse({ ...asset, path }).success).toBe(false);
});

describe("session lifecycle integrity", () => {
  it("requires completion exactly when every question is solved", () => {
    expect(
      sessionStateSchema.safeParse({
        ...session,
        questionStates: { q1: "solved" },
        status: "abandoned",
      }).success,
    ).toBe(false);
    expect(
      sessionStateSchema.safeParse({
        ...session,
        status: "completed",
      }).success,
    ).toBe(false);
    expect(
      sessionStateSchema.safeParse({
        ...session,
        questionStates: { q1: "solved" },
        status: "completed",
      }).success,
    ).toBe(true);
  });

  it("rejects duplicate run IDs across archived and active sessions", () => {
    const archived = { ...session, status: "abandoned" };
    expect(
      profileStateSchema.safeParse({
        ...profile,
        archivedSessions: [archived, { ...archived }],
      }).success,
    ).toBe(false);
    expect(
      profileStateSchema.safeParse({
        ...profile,
        activeSession: session,
        archivedSessions: [archived],
      }).success,
    ).toBe(false);
  });

  it("rejects duplicate attempt IDs across separate runs", () => {
    const firstAttempt = {
      attemptId: "attempt-shared",
      runId: session.runId,
      questionId: "q1",
      selectedOptionId: "one",
      correct: true,
      helpUsed: false,
      attemptIndex: 1,
      timestamp: "2026-10-29T10:00:00.000Z",
      contentVersion: "fixture-v1",
    };
    const completedFirst = {
      ...session,
      questionStates: { q1: "solved" },
      results: [firstAttempt],
      status: "completed",
    };
    const completedSecond = {
      ...completedFirst,
      runId: "run-fixture-2",
      results: [{ ...firstAttempt, runId: "run-fixture-2" }],
    };
    expect(
      profileStateSchema.safeParse({
        ...profile,
        archivedSessions: [completedFirst, completedSecond],
      }).success,
    ).toBe(false);
  });
});
