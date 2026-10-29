import { z } from "zod";

// Runtime schemas are the only source of shared TypeScript contract types.
export const CONTRACT_VERSION = 1 as const;
export const PROFILE_SCHEMA_VERSION = 1 as const;
const id = z.string().min(1).max(160);
const version = z.string().min(1).max(80);
const locale = z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/);
const title = z
  .record(locale, z.string().min(1))
  .refine((v) => Object.keys(v).length > 0, "A localized title is required");
const ids = z
  .array(id)
  .refine((v) => new Set(v).size === v.length, "IDs must be unique");
const integer = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const timestamp = z.iso.datetime();
export const subjectSchema = z.strictObject({
  id,
  title,
  supportedLocales: z.array(locale).min(1),
});
export const sourceSchema = z.strictObject({
  url: z.url(),
  accessedAt: timestamp,
  edition: version,
  confidence: z.enum(["low", "medium", "high"]),
});
export const textbookSchema = z.strictObject({
  id,
  subjectId: id,
  title: z.string().min(1),
  publisher: z.string().min(1),
  isbn: z.string().regex(/^\d{13}$/),
  edition: version,
  grade: integer,
  schoolYear: z.string().min(1),
  sources: z.array(sourceSchema),
  verification: z.enum(["unverified", "verified", "needs-review"]),
});
const curriculumShape = {
  id,
  subjectId: id,
  textbookId: id.optional(),
  title,
  prerequisiteSkillIds: ids,
};
export const unitSchema = z.strictObject(curriculumShape);
export const skillSchema = z.strictObject({
  ...curriculumShape,
  unitId: id.optional(),
});
export const assetSchema = z.strictObject({
  id,
  path: z
    .string()
    .regex(/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/)
    .refine((p) => !p.includes("//")),
  type: z.enum(["image", "audio"]),
  locale,
  description: z.string().min(1),
  licence: z.string().min(1),
  attribution: z.string().min(1),
  reviewStatus: z.enum(["placeholder", "pending", "approved"]),
});
const itemShape = {
  id,
  contentVersion: version,
  subjectId: id,
  skillIds: ids.min(1),
  grade: integer,
  instructionLocale: locale,
  targetLocale: locale.optional(),
};
export const learningItemSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    ...itemShape,
    kind: z.literal("vocabulary"),
    payload: z.strictObject({
      term: z.string().min(1),
      meaning: title,
      imageAssetId: id,
      audioAssetId: id,
    }),
  }),
  z.strictObject({
    ...itemShape,
    kind: z.literal("number"),
    payload: z.strictObject({
      value: z.number().finite(),
      representation: z.string().min(1),
    }),
  }),
  z.strictObject({
    ...itemShape,
    kind: z.literal("text"),
    payload: z.strictObject({ text: z.string().min(1) }),
  }),
  z.strictObject({
    ...itemShape,
    kind: z.literal("concept"),
    payload: z.strictObject({ explanation: title, assetIds: ids }),
  }),
]);
export const promptSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("audio"), assetId: id }),
  z.strictObject({ kind: z.literal("text"), text: z.string().min(1), locale }),
  z.strictObject({ kind: z.literal("image"), assetId: id }),
]);
// Extend this registry and runtime validation together in a coordinated change.
export const gameTypeSchema = z.enum(["picture-selection"]);
export const questionSchema = z
  .strictObject({
    id,
    learningItemId: id,
    skillIds: ids.min(1),
    gameType: gameTypeSchema,
    prompt: promptSchema,
    optionIds: ids.min(2),
    correctOptionId: id,
    hintAssetIds: ids.optional(),
    difficulty: z.enum(["introductory", "developing", "challenging"]),
  })
  .refine(
    (q) => q.optionIds.includes(q.correctOptionId),
    "Correct answer must be an option",
  );
export const missionSchema = z
  .strictObject({
    id,
    version,
    subjectId: id,
    title,
    itemIds: ids.min(1),
    questions: z.array(questionSchema).min(1),
    rewardPolicyVersion: z.literal("stars-v1"),
  })
  .refine(
    (m) => new Set(m.questions.map((q) => q.id)).size === m.questions.length,
    "Question IDs must be unique",
  );
export const answerAttemptSchema = z.strictObject({
  attemptId: id,
  runId: id,
  questionId: id,
  selectedOptionId: id,
  correct: z.boolean(),
  helpUsed: z.boolean(),
  attemptIndex: z.number().int().positive(),
  timestamp,
  contentVersion: version,
});
export const sessionStateSchema = z
  .strictObject({
    runId: id,
    missionId: id,
    missionVersion: version,
    seed: id,
    questionOrder: ids.min(1),
    optionsByQuestion: z.record(id, ids.min(2)),
    questionStates: z.record(id, z.enum(["locked", "available", "solved"])),
    results: z.array(answerAttemptSchema),
    status: z.enum(["active", "completed", "abandoned"]),
  })
  .superRefine((s, ctx) => {
    const keysMatch = (value: object) =>
      Object.keys(value).length === s.questionOrder.length &&
      s.questionOrder.every((q) => Object.hasOwn(value, q));
    if (!keysMatch(s.optionsByQuestion) || !keysMatch(s.questionStates))
      ctx.addIssue({
        code: "custom",
        message: "Session maps must match persisted question order",
      });
    if (new Set(s.results.map((a) => a.attemptId)).size !== s.results.length)
      ctx.addIssue({ code: "custom", message: "Duplicate attempt IDs" });
    for (const a of s.results)
      if (
        a.runId !== s.runId ||
        !s.optionsByQuestion[a.questionId]?.includes(a.selectedOptionId)
      )
        ctx.addIssue({
          code: "custom",
          message: "Attempt references must belong to this session",
        });
    const allSolved = s.questionOrder.every(
      (q) => s.questionStates[q] === "solved",
    );
    if ((s.status === "completed") !== allSolved)
      ctx.addIssue({
        code: "custom",
        message: "Completion must match solved question states",
      });
  });
export const shopItemSchema = z.strictObject({
  id,
  nameEs: z.string().min(1),
  category: z.enum(["eyewear", "headwear", "top"]),
  price: integer,
  rendering: z.strictObject({ assetId: id, layer: integer }),
});
export const learningEvidenceSchema = z.strictObject({
  subjectId: id,
  skillId: id,
  learningItemId: id,
  attempt: answerAttemptSchema,
});
export const rewardEntrySchema = z.strictObject({
  key: id,
  runId: id,
  questionId: id.optional(),
  kind: z.enum(["question-solved", "run-complete"]),
  amount: integer,
  timestamp,
});
export const profileStateSchema = z
  .strictObject({
    schemaVersion: z.literal(PROFILE_SCHEMA_VERSION),
    revision: integer,
    stars: integer,
    ownedItemIds: ids,
    equipment: z.strictObject({
      eyewear: id.optional(),
      headwear: id.optional(),
      top: id.optional(),
    }),
    learningEvidence: z.array(learningEvidenceSchema),
    masteryPolicyVersion: z.literal("mastery-v1"),
    activeSession: sessionStateSchema.nullable(),
    archivedSessions: z.array(sessionStateSchema),
    processedAttemptIds: ids,
    processedRewardKeys: ids,
    rewardLedger: z.array(rewardEntrySchema),
  })
  .superRefine((p, ctx) => {
    const sessions = [
      ...p.archivedSessions,
      ...(p.activeSession ? [p.activeSession] : []),
    ];
    const runIds = sessions.map((s) => s.runId);
    if (new Set(runIds).size !== runIds.length)
      ctx.addIssue({
        code: "custom",
        message: "Session run IDs must be unique across the profile",
      });
    const sessionAttemptIds = sessions.flatMap((s) =>
      s.results.map((a) => a.attemptId),
    );
    if (new Set(sessionAttemptIds).size !== sessionAttemptIds.length)
      ctx.addIssue({
        code: "custom",
        message: "Attempt IDs must be unique across profile sessions",
      });
    if (
      Object.values(p.equipment).some(
        (i) => i !== undefined && !p.ownedItemIds.includes(i),
      )
    )
      ctx.addIssue({ code: "custom", message: "Equipped items must be owned" });
    const ledgerKeys = p.rewardLedger.map((e) => e.key);
    if (
      new Set(ledgerKeys).size !== ledgerKeys.length ||
      ledgerKeys.length !== p.processedRewardKeys.length ||
      ledgerKeys.some((k) => !p.processedRewardKeys.includes(k))
    )
      ctx.addIssue({
        code: "custom",
        message: "Ledger and processed reward keys must match",
      });
    const evidenceKeys = p.learningEvidence.map((e) => `${e.attempt.attemptId}:${e.subjectId}:${e.skillId}:${e.learningItemId}`);
    if (new Set(evidenceKeys).size !== evidenceKeys.length)
      ctx.addIssue({ code: "custom", message: "Evidence entries must be unique per attempt, subject, skill and item" });
    const attempts = [...new Set(p.learningEvidence.map((e) => e.attempt.attemptId))];
    if (
      new Set(attempts).size !== attempts.length ||
      attempts.length !== p.processedAttemptIds.length ||
      attempts.some((a) => !p.processedAttemptIds.includes(a))
    )
      ctx.addIssue({
        code: "custom",
        message: "Evidence and processed attempt IDs must match",
      });
    if (p.activeSession && p.activeSession.status !== "active")
      ctx.addIssue({
        code: "custom",
        message: "Only an active session belongs in activeSession",
      });
    if (p.archivedSessions.some((s) => s.status === "active"))
      ctx.addIssue({
        code: "custom",
        message: "Archived sessions cannot be active",
      });
  });
export const contentBundleSchema = z
  .strictObject({
    contractVersion: z.literal(CONTRACT_VERSION),
    subjects: z.array(subjectSchema),
    textbooks: z.array(textbookSchema),
    units: z.array(unitSchema),
    skills: z.array(skillSchema),
    assets: z.array(assetSchema),
    learningItems: z.array(learningItemSchema),
    missions: z.array(missionSchema),
    shopItems: z.array(shopItemSchema),
  })
  .superRefine((b, ctx) => {
    const issue = (message: string) =>
      ctx.addIssue({ code: "custom", message });
    for (const list of [
      b.subjects,
      b.textbooks,
      b.units,
      b.skills,
      b.assets,
      b.learningItems,
      b.missions,
      b.shopItems,
    ])
      if (new Set(list.map((x) => x.id)).size !== list.length)
        issue("Duplicate stable IDs in collection");
    const has = (list: { id: string }[], key: string) =>
      list.some((x) => x.id === key);
    const skillSubject = (key: string, subjectId: string) =>
      b.skills.some((s) => s.id === key && s.subjectId === subjectId);
    for (const x of [
      ...b.textbooks,
      ...b.units,
      ...b.skills,
      ...b.learningItems,
      ...b.missions,
    ])
      if (!has(b.subjects, x.subjectId))
        issue(`Unknown subject: ${x.subjectId}`);
    for (const x of [...b.units, ...b.skills]) {
      if (
        x.textbookId &&
        !b.textbooks.some(
          (t) => t.id === x.textbookId && t.subjectId === x.subjectId,
        )
      )
        issue("Invalid textbook mapping");
      if (
        x.prerequisiteSkillIds.some(
          (k) => k === x.id || !skillSubject(k, x.subjectId),
        )
      )
        issue("Invalid prerequisite skill");
    }
    for (const s of b.skills)
      if (
        s.unitId &&
        !b.units.some((u) => u.id === s.unitId && u.subjectId === s.subjectId)
      )
        issue("Invalid unit mapping");
    for (const i of b.learningItems) {
      if (i.skillIds.some((k) => !skillSubject(k, i.subjectId)))
        issue("Invalid item skill reference");
      if (
        i.kind === "vocabulary" &&
        (!b.assets.some(
          (a) => a.id === i.payload.imageAssetId && a.type === "image",
        ) ||
          !b.assets.some(
            (a) => a.id === i.payload.audioAssetId && a.type === "audio",
          ))
      )
        issue("Invalid vocabulary asset reference");
      if (
        i.kind === "concept" &&
        i.payload.assetIds.some((a) => !has(b.assets, a))
      )
        issue("Invalid concept asset reference");
    }
    for (const m of b.missions) {
      const belongs = (key: string) =>
        b.learningItems.some(
          (i) =>
            i.id === key &&
            i.subjectId === m.subjectId &&
            m.itemIds.includes(key),
        );
      if (m.itemIds.some((k) => !belongs(k)))
        issue("Invalid mission item reference");
      for (const q of m.questions) {
        if (
          !belongs(q.learningItemId) ||
          q.optionIds.some((k) => !belongs(k)) ||
          q.skillIds.some((k) => !skillSubject(k, m.subjectId))
        )
          issue("Invalid question item/skill reference");
        if (
          q.prompt.kind !== "text" &&
          !b.assets.some(
            (a) =>
              a.id === (q.prompt.kind !== "text" ? q.prompt.assetId : "") &&
              a.type === q.prompt.kind,
          )
        )
          issue("Invalid prompt asset reference");
        if (q.hintAssetIds?.some((k) => !has(b.assets, k)))
          issue("Invalid hint asset reference");
      }
    }
    for (const item of b.shopItems)
      if (
        !b.assets.some(
          (a) => a.id === item.rendering.assetId && a.type === "image",
        )
      )
        issue("Invalid shop asset reference");
  });
export type Subject = z.infer<typeof subjectSchema>;
export type Textbook = z.infer<typeof textbookSchema>;
export type Unit = z.infer<typeof unitSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type LearningItem = z.infer<typeof learningItemSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Mission = z.infer<typeof missionSchema>;
export type AnswerAttempt = z.infer<typeof answerAttemptSchema>;
export type LearningEvidence = z.infer<typeof learningEvidenceSchema>;
export type SessionState = z.infer<typeof sessionStateSchema>;
export type ShopItem = z.infer<typeof shopItemSchema>;
export type ProfileState = z.infer<typeof profileStateSchema>;
export type ContentBundle = z.infer<typeof contentBundleSchema>;

/** This validates stable session references, not authoritative attempt acceptance. */
export function validateSessionReferences(
  input: unknown,
  mission: Mission,
): SessionState {
  const session = sessionStateSchema.parse(input);
  const questions = new Map(mission.questions.map((q) => [q.id, q]));
  if (
    session.missionId !== mission.id ||
    session.missionVersion !== mission.version ||
    session.questionOrder.length !== questions.size ||
    session.questionOrder.some((k) => !questions.has(k))
  )
    throw new Error("Session mission/version/order mismatch");
  for (const q of mission.questions) {
    const options = session.optionsByQuestion[q.id];
    if (
      !options ||
      options.length !== q.optionIds.length ||
      options.some((k) => !q.optionIds.includes(k))
    )
      throw new Error("Session options mismatch");
  }
  return session;
}

export const unsupportedContentMessage =
  "No podemos abrir esta actividad. Vuelve al inicio e inténtalo de nuevo.";
export function decodeContentBundle(
  input: unknown,
):
  | { status: "ready"; content: ContentBundle }
  | { status: "recovery"; message: string } {
  const result = contentBundleSchema.safeParse(input);
  return result.success
    ? { status: "ready", content: result.data }
    : { status: "recovery", message: unsupportedContentMessage };
}
