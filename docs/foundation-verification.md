# MVP-01 local verification — 28 October 2026

Prepared checkout:
`C:\Users\ebeling\Documents\Codex\2026-10-28\referenced-chatgpt-conversation-this-is-an-2\outputs\educational-gaming-platform`.
Branch: `chore/MVP-01-foundation`.
Base and HEAD: `166df1707e5561db19600abfb6a783ad436ea40d`.
All implementation remains uncommitted. No commit, push or merge occurred.

## Scope and review boundary

Foundation only: Spanish development previews, common UI, Next/React/TypeScript/
Tailwind setup, versioned runtime contracts, pure decoder/ports and real checks.
No production profile or browser storage adapter, rewards, game, economy, media,
accounts, backend, analytics, runtime AI or microphone recording. No runtime
fixture adapter is wired into routes. Technical mathematics fixtures do not
expand the product's animal-learning scope.

The owner accepted local foundation before bootstrap review/merge. The branch
uses bootstrap as its temporary base because main lacks the plan. Independent
bootstrap/foundation review and coordinated contract-fixture review are still
required before parallel feature implementation. This is local validation,
not independent approval, effective GitHub enforcement or a child-pilot release.

## Changed files

- Root configuration: `.gitignore`, `.nvmrc`, `package.json`, `package-lock.json`,
  `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`,
  `vitest.config.ts`, `playwright.config.ts`. Generated `next-env.d.ts` is ignored.
- Application: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`,
  `src/app/learn/page.tsx`, `src/app/learn/[missionId]/page.tsx`,
  `src/app/shop/page.tsx`, `src/app/avatar/page.tsx`, `src/app/not-found.tsx`.
- Common UI: `src/components/ui/Button.tsx`, `Card.tsx`, `Placeholder.tsx`,
  `ui.test.tsx` in the same folder.
- Contracts: `src/types/contracts.ts`, `src/types/contracts.test.ts`.
- Profile boundary: `src/features/profile/ports.ts`, `snapshot.ts`,
  `snapshot.test.ts` in the same folder.
- Review fixtures/setup: `tests/fixtures/content-v1.json`, `profile-v1.json`,
  `session-v1.json`, `tests/setup.ts`, `tests/e2e/home.spec.ts`.
- Ownership reservation READMEs: `src/content/animals/`,
  `src/games/picture-selection/`, `src/features/learning/`,
  `src/features/rewards/`, `src/features/shop/`, `src/features/avatar/`,
  `public/animals/`, `public/audio/`.
- CI: `.github/workflows/repository-check.yml` adds the real application gate
  while preserving documentation validation and read-only permissions.
- Documentation: `README.md`, `AGENTS.md`, `docs/contracts.md`, `docs/contracts-review.md`, `docs/mvp.md`,
  `docs/decisions.md`, `docs/setup-status.md`, this report, and the truthful
  application-check wording in `scripts/validate-repository.mjs`.

The complete development plan, master-plan boundaries and existing PR template
are preserved. No final art or audio was commissioned.

## Local verification results

| Check | Result |
|---|---|
| `npm ci` | Passed; lockfile-driven install, 456 installed packages, zero reported vulnerabilities. |
| `npm run check:docs` | Passed; document presence, plan markers and local Markdown links. |
| `npm run lint` | Passed on the foundation; after the final contract correction, focused ESLint on the changed schema and test also passed with zero warnings. |
| `npm run typecheck` | Passed; route types generated, strict TypeScript checks successful. |
| `npm test` | Passed: 28 tests across 3 files with isolated thread workers. |
| `npm run build` | Passed; all five requested routes plus the not-found page built. |
| `npm run test:e2e` | Passed: 3 Chromium tests at 360, 768 and 1280 pixels against the production server. |
| `npm run dev -- --port 3001` | Started successfully; HTTP 200 and Spanish heading verified. Server stopped after checking. |
| `git diff --check` | Passed. Git only reported normal Windows LF/CRLF conversion notices. |

The browser tests exercise the Spanish document language, home heading, skip-link
keyboard focus and main target, all requested placeholder routes, horizontal
overflow, absence of page errors and absence of storage writes. Reduced-motion
preference is enabled. Final home screenshots at all three sizes were visually
inspected; files are in ignored `test-results/home-{width}.png`. Gameplay,
feedback, completion and recovery screens do not exist in this milestone, so
there is no claim that their release visual gate is met. Assistive-technology
review and joint Spanish/media review remain pending.

### Failures found and resolved

- Initial lint failed on an anonymous PostCSS configuration export; use a named
  configuration object instead. No lint rules were disabled.
- Initial strict checking/build rejected a possibly undefined optional equipment
  value; validation now handles optional values explicitly.
- An initial Vite configuration warning was resolved by declaring the package as
  an ES module, matching its configuration syntax.
- ESLint 10 produced incompatible plugin peer overrides. It was replaced with
  the compatible ESLint 9 pin; npm ci and npm ls validate this dependency tree.
- One final lint run was interrupted while silent. A debug rerun completed with
  all rules enabled and showed slow configuration/file reads rather than a lint
  error. Subsequent normal lint/type checks validate the final configuration.
- After npm ci, a Vitest run failed with three fork-worker startup timeouts and
  executed no tests. The supported thread pool with maxWorkers 2 passed all 25
  tests afterward (39.10 seconds), without skipped tests, relaxed assertions,
  timeout inflation or disabled isolation. Earlier 22-test runs had also passed.

### Remaining limitations and unexecuted external checks

No required local application check is intentionally omitted. CI execution on
GitHub is unexecuted because this work is local and unpublished. Current PR
reviews/checks and effective repository protections could not be read through
the GitHub connector (404). Remote refs alone do not prove PR approval/checks.
Independent bootstrap/foundation review, enforced merge gates and shared-contract
fixture approval remain unresolved. No account/authentication/ruleset changes
were made, and the owner has not authorized commit, push or merge.

ESLint 9 deprecation remains a tooling follow-up until all plugin peers support
10. npm also reports an unapproved optional unrs-resolver postinstall; no blanket
approval or peer-dependency bypass was added. Lint/build/tests passed with the
installed packages. The supported Node 24 LTS line is pinned in .nvmrc.

## 2026-10-29 contract review addendum

The local contract review identified P1 run-state and ID-deduplication gaps.
They are corrected locally: fully solved sessions require `completed`, and
profile validation enforces unique run and attempt IDs across all sessions.
Regression coverage now checks the invalid states and collisions. `npm test`
passed all 28 tests in 3 files, and `npm run typecheck` passed after the changes.
No production rewards or storage adapter were added. Independent review remains
pending; the owner asked that sequential local progress not wait for the
colleague. His later participation remains welcome and bounded.
