# Project decision log

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
