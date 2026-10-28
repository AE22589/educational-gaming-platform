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
