# Project rules

## Documentation language
- Always write all project documentation in English, including plans, README files,
  architecture decisions, setup guides, task descriptions, issues and pull requests.
- Write new documentation and updates in English regardless of the conversation language.
- Preserve original source quotations and textbook titles when needed, with English explanation.
- This rule does not change the Spanish product UI or English learning vocabulary/audio.

## Product
- Implement only docs/mvp.md and docs/mvp-development-plan-1.1.md.
- Master-plan features are deferred unless explicitly commissioned.
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
- Never overwrite/revert another developer's changes.
- Keep to task ownership; coordinate shared contracts/dependencies first.
- Never commit, push or merge without explicit authorization.
- No force push or destructive Git operations without authorization.
- Each developer uses a separate clone and session; other developer reviews PR.

## Architecture
- Games emit results; profile alone controls rewards, inventory and persistence.
- Follow docs/contracts.md and shared types; no parallel contract definitions.
- Persist stable session IDs/order; deduplicate attempts and reward events.
- Load before autosave; runtime-validate, migrate and handle storage failures.
- Never access browser storage during server rendering or silently reset data.

## Quality and privacy
- Test changed behavior; never disable tests or weaken checks.
- Bootstrap check: node scripts/validate-repository.mjs.
- After foundation: npm run lint, npm run typecheck, npm test, npm run build;
  run relevant Playwright tests. Report any unexecuted checks.
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
  npm run build and npm run test:e2e (after Playwright Chromium installation).
- The owner authorized local MVP-01 before bootstrap review/merge only; see decisions.md.
  Independent review and authorized merge remain required before parallel development.
