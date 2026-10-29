# Contracts and ownership

Section 5 of MVP Development Plan 1.1 defines the required contract fields.
MVP-01 must implement shared TypeScript discriminated unions and runtime
validation, with contract fixtures reviewed by both developers before parallel work.

Developer 2 submits AnswerAttempt events through a typed profile port. Developer
1 validates them and returns an accepted/duplicate/rejected/unsaved result and
read-only session/progress state. The game must not calculate authoritative
balances. Completion is derived by the profile layer. Economic mutations and
evidence updates are serialized, idempotent and persisted as one transition.

Persist run/question identities, content versions, seed, options/order, attempts,
reward ledger and processed keys. Use mastery-v1 and the recovery contracts in
sections 4 and 6. Shared contracts/configuration/lockfile changes require prior
coordination. A missing contract is reported, never independently redefined.

## MVP-01 contract handover (local, awaiting independent review)

`src/types/contracts.ts` is the single runtime authority. All exported domain
TypeScript types are inferred from strict Zod schemas. Content bundle
`contractVersion: 1`, profile `schemaVersion: 1`, mission/content versions,
`stars-v1` and `mastery-v1` are distinct version axes. A schema change requires
coordinated review and, for persisted data, an explicit migration decision.

Implemented contracts cover every section 5 entity. Learning items discriminate
`vocabulary`, `number`, `text` and `concept` payloads. Localized titles are locale
maps; subject, instruction locale and optional target locale remain separate.
Vocabulary uses generic `term` plus localized `meaning`; the future animal
content supplies English terms, Spanish meanings and image/audio asset IDs.

The initial registry recognizes only `picture-selection`; new game adapters
must extend both its runtime enum and implementation in one reviewed change.
`decodeContentBundle` returns a Spanish recovery message for unsupported or
invalid content. No renderer exists yet. Unknown fields and malformed versions
fail validation. Content validation checks collection ID uniqueness, subject,
textbook/unit/skill references, mission item/option membership, answer membership,
asset existence/type and local asset paths. Option IDs reference learning item
IDs within the mission; prompt/hint IDs reference assets. Stable IDs need not
be globally unique across different entity collections.

`validateSessionReferences` checks mission ID/version, exact question set and
persisted option sets while retaining the stored order. Session schemas validate
matching map keys, attempt identity uniqueness and run/option references. MVP-02
also reconciles each stored attempt against its trusted session and item evidence.
These structural checks are not authoritative attempt acceptance. MVP-02 also
verifies content versions, answer correctness, attempt index/order, unlocked
questions, evidence, reward keys and derived completion against trusted content.
Never trust the game-supplied `correct` flag or a completion callback.

Profile schemas require integer balances/revisions/prices, owned equipment,
matching evidence/processed attempt IDs and ledger/processed reward keys.
`archivedSessions` preserves replaced/completed runs. The browser provider
creates and persists a zero-star profile on first use; the fixture remains
technical contract data only.
Mastery raw evidence stores subject/skill/item and full attempts separately
from rewards. Mastery derivation is implemented in MVP-02; purchase ledger
design remains future shop work.

### Profile and persistence boundary

`src/features/profile/ports.ts` declares `ProfilePort`, `SnapshotStore`,
`WriterCoordinator`, `RecoveryPort` and discriminated status/results. Game-facing
state/session views are deeply readonly. The MVP-01 foundation had no production
adapter or provider; MVP-02 wires both in the browser. `accepted` means a
durable accepted transition; `duplicate`
means the earlier transition is already durable; `unsaved` must never be shown
as saved. `getState()` starts loading; readiness requires completed load and
known ownership. No economic writes may proceed in recovery, read-only or
unsaved states. Pending state must remain available for retry/export.

`save(snapshot, expectedRevision, lease)` serializes the entire transition,
verifies the prior revision under exclusive ownership and increments exactly
once. A null expected revision means no existing snapshot; conflicts stop
writes. The adapter retains a validated last-known-good backup before
replacement. A Web Lock is
preferred; the fallback lease must conservatively deny writes when ownership
is uncertain. A storage event alone is insufficient. MVP-02 implements these
durability and ownership boundaries in the browser adapter. Web Locks are
preferred; when unavailable, a short localStorage lease and BroadcastChannel
coordination fail closed on malformed or uncertain state. Browser storage and
cross-tab behavior still require runtime verification.

`decodeSnapshot` is pure and never accesses browser storage. It accepts only v1,
limits imports to 2 MiB of UTF-8 data, preserves raw rejected input and identifies
invalid JSON, invalid data, oversized data and future versions. There is no
historical application schema to migrate. Old/unknown schemas enter recovery;
any future persisted schema change must add explicit supported migrations
while preserving originals.
Reset requires informed data-loss confirmation. The browser adapter and recovery
UI now implement storage availability/quota handling, backup restoration,
retry, import/export and reset. Runtime browser and multi-tab verification is
still outstanding. Never access storage during SSR or autosave before loading.

### Review fixtures and coordination

`tests/fixtures/content-v1.json` uses a synthetic mathematics example to prove
subject-neutral payloads without authoring future product curriculum.
`session-v1.json` preserves a reversed option order; `profile-v1.json` represents
an empty profile. Tests exercise successful parsing and broken references,
options, versions, sessions, timestamps, equipment and recovery data.
Fixtures are not imported by production routes and assert no media rights.

Developer 1 prepared this common proposal under the owner's local-foundation
exception. Developer 2 must independently review schemas, fixtures, result
semantics and versioning before parallel work. This written coordination does
not claim that review has happened. Report missing interfaces instead of
creating a second contract definition.

## Local review findings — 2026-10-29

The P1 issues from the local author review are corrected in
`src/types/contracts.ts`, with regressions in `src/types/contracts.test.ts`:
completion status must match solved questions, and run/attempt IDs are unique
across an entire profile's active and archived sessions. See
[contracts-review.md](contracts-review.md) for details and remaining questions.

The author review is not independent approval. Local sequential development may
continue without the colleague's availability by owner direction. Applicable
independent review and release gates still apply before publication or merge.
