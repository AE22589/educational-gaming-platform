# Project decision log

## 2026-10-29 — World map as the mission entry point

Status: accepted direction; map design is in progress and the concept art is
not final.

- The Spanish home-page mission entry opens a small animal world map before a
  learner enters a mission.
- Define and review the world first; decide which missions or games belong in
  its locations afterward. This navigation decision does not expand the MVP's
  current game or content count.
- `docs/concepts/animal-valley-map-concept.png` is a working visual reference.
  It does not establish final locations, labels, interaction design or approved
  production art. Verify its origin and usage rights before product use.
- Continue revising the existing MVP development plan and master plan as this
  direction becomes more specific; do not treat the concept image as a locked
  design.

## 2026-10-29 — Spanish product name

Status: accepted and implemented.

- The Spanish product name shown in the application is **Aventura Animal**.
- English project documentation and package metadata use **Animal Adventure**.
- Existing browser storage keys retain their original identifiers so saved
  profiles and cross-tab coordination remain compatible with earlier builds.

Record confirmed project decisions here in English so future Codex sessions and
both developers can recover the agreed context from the repository. Chat history
alone is not the project source of truth. Update affected specifications when a
decision changes them; do not treat an assistant proposal as an approved decision.

## 2026-10-28 — Repository documentation is the durable handover

Status: accepted by the project owner.

- Document project decisions, scope changes, working agreements and unresolved
  blockers in repository files as part of the work that introduces them.
- Keep all project documentation in English. Product UI remains Spanish and
  English vocabulary and learning audio remain English.
- Distinguish proposed, accepted, implemented and verified states. Record actual
  validation results and never present local edits as committed or published.
- Commit, push and merge still require explicit owner authorization. Until then,
  documentation changes remain local and are not available to the colleague.

## 2026-10-28 — Developer 1 starts before the colleague joins

Status: accepted direction; application implementation has not started.

- The owner starts as Developer 1. The second developer will join later with a
  separate GitHub account, local clone and Codex chat.
- The next intended implementation milestone is MVP-01 foundation. The animal
  game, complete economy and broader platform remain later milestones.
- Local foundation work before bootstrap merge was recommended, but an explicit
  exception to the plan's bootstrap review/merge prerequisite remains unresolved.
- Independent review and enforceable GitHub gates remain open requirements.
  No approval, merge, collaborator invitation or plan upgrade is implied.

## 2026-10-28 — Defer the multi-chat collaboration setup

Status: accepted; setup deferred until the colleague joins.

- Plan separate development chats and a central integration chat on the owner's
  machine. Do not create or configure those chats yet.
- Developer 1 owns foundation, profile, rewards, persistence, shop and avatar.
  Developer 2 owns animal content, audio, learning game and mission flow, following
  the ownership and sequencing rules in the MVP implementation plan.
- Use separate clones or isolated worktrees for concurrent writing sessions.
- Share code, project rules and handover notes through the private GitHub
  repository. Do not assume automatic chat or account synchronization.
- The integration chat is intended to combine completed branches, run integration
  checks and publish authorized work. A colleague's changes must first reach a
  shared Git branch; the integration chat cannot access another machine's
  uncommitted files. Its checks do not replace independent developer review.

## Current workspace distinction

Verified on 2026-10-28:

- The prepared repository is at
  `C:\Users\ebeling\Documents\Codex\2026-10-28\referenced-chatgpt-conversation-this-is-an-2\outputs\educational-gaming-platform`.
  It was clean on `chore/project-bootstrap` at `1509249` before this update.
- The saved Codex project named `educational-gaming-platform` points to
  `C:\Users\ebeling\Documents\ChatGPT\educational-gaming-platform`, which was a
  separate empty Git repository when inspected. Saved-project registration now
  exists, but it does not yet point to the prepared repository.
- Bootstrap PR #1 was open with no reviews and its current documentation check
  passed. Local `node scripts/validate-repository.mjs` also passed.
- GitHub still displayed the private-repository ruleset enforcement limitation.
  The GitHub connector returned 404 while system Git and the authenticated
  in-app browser could access the repository. No authentication was changed.

## 2026-10-28 — Owner-authorized MVP-01 sequencing exception

Status: accepted by the owner in the development-chat handover; locally implemented.
This supersedes the earlier unresolved-exception note for local foundation work.

- Developer 1 may implement MVP-01 locally before bootstrap independent review/merge.
- The foundation branch is `chore/MVP-01-foundation`, based on verified bootstrap
  tip `166df1707e5561db19600abfb6a783ad436ea40d`, because main lacks the plan.
  This is a temporary base choice, not permission to bypass review or merge gates.
- Bootstrap and foundation still need independent review and authorized merge.
  Reconcile the eventual main base before review/merge; do not begin parallel
  feature work from the unreviewed foundation.
- No commit, push, merge, collaborator invitation, authentication change or
  account change is authorized. No independent review is claimed.
- The prepared checkout remains in the documented outputs directory; the saved
  project's empty checkout is untouched. No move, deletion or project repointing.
- Before editing, both related source chats were idle, the prepared checkout was
  clean, no Git lock files were present and the sender explicitly handed off
  writing. No concurrent implementation task or subagent was created.
- Remote refs still identified the same bootstrap tip and main at
  `56175fca60dea33f63d5364f59d4801b8818d9c7`. PR ref #1 remained available;
  the connector returned 404, so current PR/check/review state was not reverified.

## 2026-10-28 — Foundation contracts and toolchain

Status: local implementation proposal awaiting independent developer review.

- Use Node 24.21.0 LTS / npm 11.19.0, pinned Next 16.4.3, React 19.3.1,
  Tailwind 4.3.3 and Zod 4.6.7. Versions and peer ranges were checked in npm.
  Node 24 remains a supported LTS line per https://github.com/nodejs/Release.
- Strict TypeScript includes unchecked-index and exact-optional-property checks.
  Zod schemas infer types; no duplicate hand-written domain interfaces.
- Version 1 schemas, one game registry and synthetic fixtures coordinate the
  next developers. See contracts.md for exact reference and persistence semantics.
- No production storage writes or economy are implemented. The pure bounded
  decoder preserves invalid/future raw data; migration and writer coordination
  are explicit later implementation requirements.
- Next's React/accessibility lint plugins currently declare peers through ESLint 9,
  despite Next's broad top-level peer range. ESLint 10 produced peer overrides;
  pin compatible ESLint 9.39.5 without force/legacy-peer options. npm marks it
  deprecated/unsupported. Revisit once the complete lint plugin chain supports 10.
- Local package installation reported an unapproved optional postinstall for
  unrs-resolver. No blanket script approval was added. Verify resolver behavior
  with the actual checks; do not suppress failures.
- Local assets remain empty reservations; original media rights and child-pilot
  review remain mandatory. Master-plan scope has not expanded.

- `agentRules: false` keeps `next dev` from modifying the repository's maintained
  AGENTS.md; verified against the installed Next 16.4 documentation. Project rules
  remain authoritative. Consult version-matched docs in node_modules/next/dist/docs
  when using Next APIs, rather than relying on older conventions.

- Asset paths are generic root-relative local files, not restricted to animal
  directories; traversal, remote/protocol-relative URLs and encoded paths fail
  validation. This keeps shared metadata usable by later avatar/subject assets
  without adding production content or creating missing-file claims.

- After a clean npm ci, Vitest's default fork workers timed out before executing
  tests on this Windows machine. Use the supported threads pool with at most two
  concurrent workers, retaining test isolation and every assertion. The complete
  25-test suite passed afterward; no startup timeout was raised or error ignored.

## 2026-10-29 — Solo development scheduling

Status: accepted by the owner.

- Continue sequential local development without depending on the colleague's
  schedule. His later participation is welcome but optional for progress.
- The colleague is a learner and contributing developer, not a required gate for
  each local task. Provide clear, bounded tasks and English handover notes when
  he is available.
- This changes scheduling, not independent review requirements for publication
  or merge. No commit, push or merge is authorized by this decision.

## 2026-10-29 — Correct profile session integrity findings

Status: implemented locally; regression checks passed. Independent review remains open.

- Completion status now matches solved question states exactly.
- Profile session run IDs and attempt IDs are unique across active and archived histories.
- Exact reconciliation between session history, mastery evidence and processed attempt IDs remains for MVP-02 design.
