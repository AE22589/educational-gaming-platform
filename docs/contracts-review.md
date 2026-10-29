# Shared contract review — 29 October 2026

Status: local review and corrections by the foundation author. The P1 corrections
are implemented and covered by regression tests. This is not an independent
review or colleague approval. The owner confirmed that local development should
continue without depending on the colleague's schedule; the colleague can join
bounded tasks later as a learner and contributing developer.

Reviewed `src/types/contracts.ts`, `src/features/profile/ports.ts`, snapshot
decoding, all three JSON fixtures and contract tests against MVP Development
Plan 1.1 sections 3–6 and the ownership/recovery notes in `docs/contracts.md`.
The implementation has one schema authority, infers domain types from Zod,
separates content/profile version axes, validates most cross-record references,
preserves session option order and rejects unrecognized game types with Spanish
recovery copy. Persistence remains an interface and pure decoder; no production
writer or economy is implemented yet.

## P1 corrections implemented locally

### Completed state now follows solved questions

Previously, `sessionStateSchema` exempted `abandoned` sessions from its
completion consistency check. A fully solved run could therefore be labelled
abandoned despite the plan deriving completion and its bonus from solved
questions. The schema now requires `completed` exactly when all questions are
solved. Regression checks reject a fully solved abandoned session and an
incomplete completed session. Rewards remain derived in the profile reducer.

### Run IDs must be unique across a profile

Previously, archived sessions could reuse a run ID or collide with the active
session. Because question rewards and completion bonuses use run-scoped keys,
that could conflate distinct runs during resume or deduplication. Profile
validation now rejects duplicate run IDs across active and archived sessions.
Regression checks cover duplicate archives and active/archive collisions.
Invalid snapshots must enter recovery; they are never silently repaired by
assigning replacement IDs.

### Attempt IDs must be unique across session histories

Previously, uniqueness was checked within each session but not across a profile's
active and archived session results. The profile-wide validator now rejects
cross-session attempt-ID reuse, with a regression test covering distinct runs.

MVP-02 now reconciles accepted attempts across active/archived session history,
learning evidence and processed attempt IDs. Evidence keys must match the trusted
item's subject, skill and item references; the attempt payload must match the
session result. Rejected attempts are not persisted. Invalid imports enter
recovery before replacing the current snapshot.

## Remaining contract questions

- Subject `supportedLocales` can contain duplicates or disagree with keys in its
  localized `title`. Decide whether the two sets must match, then enforce and
  fixture that rule.
- Skill prerequisites are checked for existence, subject and direct self-links,
  but multi-skill cycles are accepted. Decide whether the prerequisite graph must
  be acyclic if these IDs drive learning order.
- A textbook can say `verification: "verified"` with no source references,
  despite the plan requiring source, access date, edition and confidence for
  verification. Require supporting source metadata before accepting that state.
- Resolved in MVP-02: `SnapshotStore.save(snapshot, expectedRevision, lease)`
  requires an opaque exclusive writer lease and checks it at the write boundary.
  Revision checks remain necessary to reject stale snapshots.

The plan does not prescribe title-locale matching, cycle handling or a confidence
threshold. These are implementation choices, not accepted product decisions.

## MVP-02 trust boundary

Schema validation alone cannot make a game callback authoritative. The profile
service validates each submitted attempt against the active persisted
mission, question, content version, option set, lock/order state and stable
attempt ID; computes correctness itself; and derives completion from solved
question states. Snapshot validation also reconciles historical results using
trusted content. No game renderer or product curriculum exists yet; unknown
future schemas enter recovery because no earlier profile schema has shipped.

## Collaboration and release

Local work proceeds sequentially without waiting for the colleague. When he is
available, provide a written handover and small bounded development tasks. The
local self-review does not count as independent review. Repository publication
and merge still require their applicable independent review and release gates.
