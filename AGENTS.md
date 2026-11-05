# Project rules

## Quick start for assistants (read this first)
1. Run git fetch, git switch main and git pull. Read docs/decisions.md.
2. Work on main and push directly to origin main. Do not create codex/* or other side
   branches. If a branch is unavoidable, open a pull request in the same session.
3. Before pushing run npm run check:docs, lint, typecheck, test and build. After UI or
   test changes also run GITHUB_ACTIONS=true npm run build and GITHUB_ACTIONS=true npx
   playwright test.
4. Update the documentation in the same push (docs/setup-status.md, docs/decisions.md,
   docs/assets.md for anything in public/).
5. Images in public/ are lossless WebP only; convert with scripts/to-lossless-webp.mjs.
6. Finish by reporting the changed files, the check results and remaining risks.

The detailed rules follow below.

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
- Check branch and working tree before edits. Direct commits and pushes to main are
  allowed (owner decision, docs/decisions.md); pull main first and keep the tree clean.
- Never leave finished work only on a side branch (for example codex/*): in the same
  session, push it to main or open a pull request. Deployment runs from main only, so
  work on a side branch is invisible and goes stale. Update from main before starting.
- At the start of every session run git fetch and git branch -r --no-merged origin/main.
  Report any branch with unmerged work to the owner before starting new work (squash-
  merged branches also appear; check the pull request state before judging).
- Work sequentially as a solo-maintained project; no second developer, role split,
  separate account/clone, or independent review is required.
- Keep routine changes focused: inspect the relevant files, make the smallest
  complete change, and avoid broad repository exploration when the task is clear.
- Match local verification to risk. For copy, styling or isolated UI changes,
  use a focused review and the narrowest relevant check. For behavior or shared
  contracts, run the relevant tests and checks. Never weaken or skip the full
  pull-request CI gate for a release.
- Fast lane for small changes (text, colours, spacing, one image or icon, docs): commit
  and push directly to main. Run only lint and the one affected test (none for pure
  text or docs), update the affected documentation, push. CI runs every check after the
  push and a red run stops the deployment, so fix it immediately.
- Full lane (pull request and all local checks) for new pages or routes, logic, rewards,
  storage, dependencies, workflows or changes across many files. Run the browser tests
  once; add the GITHUB_ACTIONS=true run only when links, image paths or navigation
  changed. Do not repeat a full run for a change that did not touch code.
- For every GUI implementation or change, inspect the result visually in a
  browser controlled by Codex. Use the browser available in this environment;
  do not ask the owner to provide or operate their personal laptop browser.
  Check the relevant viewport sizes and interactions for the change.
- Batch related small edits before a live release when that fits the owner's
  request. Show a useful local result promptly when a task will take longer.
- While CI or deployment runs, avoid frequent status polling. Use longer waits
  and report meaningful state changes; do not spend time repeating unchanged
  status checks.
- Timebox blocked tools and failed previews. Inspect the failure once, choose a
  practical next step, and avoid repeating the same unsuccessful operation.
- Preserve existing uncommitted changes. Keep shared contracts in their single
  source of truth and update dependent specs/tests in the same change.
- Never commit, push or merge without explicit authorization.
- No force push or destructive Git operations without authorization.
- The owner's explicit deployment instruction authorizes the release flow after
  required automated checks pass. Do not claim GitHub protections were changed;
  if an existing setting blocks solo release, report that concrete blocker.

## Documentation synchronization
- Several AI assistants and the owner change this repository; the repository files,
  not chat history, are the shared memory. Treat documentation as part of every change.
- In the same pull request as a change to visible behavior, routes, rewards, data or
  storage, assets, dependencies, workflow, CI or repository settings, update:
  docs/setup-status.md (current state), docs/decisions.md (new or changed decision),
  docs/assets.md (every file added to or removed from public/), and README.md or
  docs/mvp.md when the described scope or structure changes.
- When a decision is reversed, edit the older entry to say "superseded by <entry>"
  instead of leaving two contradictory statements.
- Never describe behavior from memory. Check the code or run the app first, and keep
  proposed, accepted, implemented and verified states distinct.
- CI runs scripts/check-docs-impact.mjs on pull requests. If a change truly needs no
  documentation, add "Docs-Impact: none — <reason>" to the pull request description.
- Direct pushes to main are allowed. Every push runs the same checks afterwards (a failing
  check stops the deployment, but the change is already on main), and the documentation
  impact check only warns. Run the local checks first and update the documentation in the
  same push. Planned improvements are in docs/backlog.md.
- Before finishing, list which documents you updated, or state why none were needed.

## Architecture
- Games emit results; profile alone controls rewards, inventory and persistence.
- Follow docs/contracts.md and shared types; no parallel contract definitions.
- Persist stable session IDs/order; deduplicate attempts and reward events.
- Load before autosave; runtime-validate, migrate and handle storage failures.
- Never access browser storage during server rendering or silently reset data.

## Quality and privacy
- Test changed behavior; never disable tests or weaken checks.
- Use focused local checks for low-risk changes and test changed behavior.
- The pull-request CI gate remains comprehensive: repository validation, lint,
  typecheck, unit tests, production build and Playwright smoke tests.
- Bootstrap check: node scripts/validate-repository.mjs.
- For foundation work or an explicitly requested full verification, run
  `npm run check:docs`, `npm run lint`, `npm run typecheck`, `npm test`,
  `npm run build`, and the applicable browser checks.
  Report any unexecuted checks.
- The deployed site uses a base path in CI (GITHUB_ACTIONS=true). Before pushing UI or test
  changes, also run: GITHUB_ACTIONS=true npm run build, then GITHUB_ACTIONS=true npx playwright
  test. Tests must not assume hrefs or image paths start at "/".
- Follow the plan's visual, accessibility, audio and asset-rights gate.
- No credentials or real children's data in code, prompts or fixtures.
- Local assets only; no external tracking/media service.
- Images in public/ are WebP only; convert GIF/PNG/JPEG sources to lossless WebP with
  node scripts/to-lossless-webp.mjs and delete the original (animated images must be
  lossless animated WebP). Register every file in docs/assets.md. CI enforces this via
  scripts/check-assets.mjs. Do not resize or re-compress artwork without owner approval.
- Finish with changed files, results and remaining risks.

Repository instructions complement effective GitHub rules and cannot enable them.

## Foundation implementation guidance
- Use Node 24.21.0 LTS, npm 11.19.0 and the checked-in package-lock.json.
- Shared schema authority: src/types/contracts.ts; review fixtures: tests/fixtures/.
- The profile service, browser storage adapter (browser-store.ts, browser-writer.ts) and
  ProfileProvider are wired; docs/setup-status.md records the current product state.
- Keep fixture imports out of production routes. Artwork in public/ is registered in
  docs/assets.md; its rights review is still pending before any child pilot.
- For foundation implementation, run npm ci, npm run check:docs, npm run lint,
  npm run typecheck, npm test, and npm run build.
- MVP-01 foundation is complete. Current work follows the solo workflow in
  docs/decisions.md and docs/mvp-development-plan-1.1.md.
