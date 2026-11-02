# Project rules

## Documentation language
- Always write all project documentation in English, including plans, README files,
  architecture decisions, setup guides, task descriptions, issues and pull requests.
- Write new documentation and updates in English regardless of the conversation language.
- Preserve original source quotations and textbook titles when needed, with English explanation.
- This rule does not change the Spanish product UI or English learning vocabulary/audio.

## Product
- Treat docs/mvp.md and docs/mvp-development-plan-1.1.md as the recommended starting scope, not a binding product boundary.
- Master-plan features and other expansions may be implemented when selected by the owner; clarify scope only when the requested outcome is genuinely ambiguous.
- UI Spanish; animal vocabulary/audio English; code English.
- Full stars on each explicit new run; no replay discounts or daily cap.
- Errors never deduct stars; mastery is independent of stars.
- No runtime AI, accounts, backend, analytics or microphone recording.

## Decision continuity
- Read docs/decisions.md at the start of continued project work.
- Record confirmed decisions and unresolved prerequisites in English in the repository.
- Keep proposals, accepted decisions, implementation and verification distinct.
- Update affected specifications when approved decisions change them.

## Collaboration
- Check branch and working tree before edits; never implement on main.
- Work sequentially as a solo-maintained project; no second developer, role split,
  separate account/clone, or independent review is required.
- Preserve existing uncommitted changes. Keep shared contracts in their single
  source of truth and update dependent specs/tests in the same change.
- Never commit, push or merge without explicit authorization.
- No force push or destructive Git operations without authorization.
- The owner's explicit deployment instruction authorizes the release flow after
  required automated checks pass. Do not claim GitHub protections were changed;
  if an existing setting blocks solo release, report that concrete blocker.

## Architecture
- Games emit results; profile alone controls rewards, inventory and persistence.
- Follow docs/contracts.md and shared types; no parallel contract definitions.
- Persist stable session IDs/order; deduplicate attempts and reward events.
- Load before autosave; runtime-validate, migrate and handle storage failures.
- Never access browser storage during server rendering or silently reset data.

## Quality and privacy
- Test changed behavior; never disable tests or weaken checks.
- Bootstrap check: node scripts/validate-repository.mjs.
- After foundation: npm run lint, npm run typecheck, npm test, npm run build.
  Report any unexecuted checks.
- Follow the plan's visual, accessibility, audio and asset-rights gate.
- No credentials or real children's data in code, prompts or fixtures.
- Local assets only; no external tracking/media service.
- Finish with changed files, results and remaining risks.

Repository instructions complement effective GitHub rules and cannot enable them.

## Foundation implementation guidance
- Use Node 24.21.0 LTS, npm 11.19.0 and the checked-in package-lock.json.
- Shared schema authority: src/types/contracts.ts; review fixtures: tests/fixtures/.
- Profile ports and pure decoder exist; no storage adapter/provider is wired yet.
- Keep fixture imports out of production routes. Media directories contain no approved assets.
- Run npm ci, npm run check:docs, npm run lint, npm run typecheck, npm test,
  and npm run build.
- MVP-01 foundation is complete. Current work follows the solo workflow in
  docs/decisions.md and docs/mvp-development-plan-1.1.md.
