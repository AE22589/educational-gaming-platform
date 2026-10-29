# Educational Gaming Platform — Tier-Abenteuer

MVP-01 implements the local application foundation, not a playable game.
The Spanish routes `/`, `/learn`, `/learn/[missionId]`, `/shop` and `/avatar`
are labelled development previews. They do not create profiles, save data,
award stars or enable purchases. No animal art or audio is supplied yet.

All project documentation, task descriptions and PR text must remain English.
The product UI is Spanish; learning vocabulary/audio will be English.

## Local development

Use Node **24.21.0 LTS** (see `.nvmrc`) and npm **11.19.0**. npm is the only
package manager. Dependencies are pinned and `package-lock.json` is authoritative.

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:3000. No environment variables or external service accounts
are needed. Stop the server before the production browser check on the same port.

```bash
npm run check:docs
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests launch the production server themselves; build first. In Linux CI,
Playwright installation uses `--with-deps`. Failure traces and screenshots are
uploaded by CI. `npm run start` serves the production build locally.
Next telemetry may be disabled with `NEXT_TELEMETRY_DISABLED=1`.

## Foundation layout

- `src/app/`: Spanish App Router pages and responsive base styles.
- `src/components/ui/`: shared semantic Button, Card and preview shell.
- `src/types/contracts.ts`: Zod schemas, inferred shared types and validation.
- `src/features/profile/`: typed ports and pure bounded snapshot decoding only.
- `src/content/animals/`, `src/games/picture-selection/`, other `src/features/`
  folders: explicit ownership reservations for later milestones.
- `public/animals/`, `public/audio/`: reserved local media directories, no media.
- `tests/fixtures/`: review fixtures, excluded from production application imports.
- `tests/e2e/`: browser home, keyboard and placeholder-navigation smoke checks.

## Specifications and sequencing

- [Development plan 1.1](docs/mvp-development-plan-1.1.md): binding scope and acceptance.
- [MVP state](docs/mvp.md): implemented versus deferred behavior.
- [Contracts](docs/contracts.md): schema authority, port semantics and review handover.
- [Contract review](docs/contracts-review.md): current integrity corrections and open MVP-02 decisions.
- [Decision log](docs/decisions.md): accepted exceptions and implementation choices.
- [Setup status](docs/setup-status.md): verification and remaining blockers.
- [Master plan](docs/master-plan.md): future scope boundary.

Read AGENTS.md before editing. Foundation is on `chore/MVP-01-foundation`, based
on bootstrap commit `166df1707e5561db19600abfb6a783ad436ea40d` by the owner's
explicit sequencing exception. Bootstrap and foundation still need independent
review and authorized merge before parallel feature work. Shared types,
configuration and lockfile changes require coordinated review. No local test
result establishes GitHub rule enforcement or independent approval.
