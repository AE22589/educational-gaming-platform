# Current setup status — 2026-11-05

This file describes the state of `main`. Update it in every pull request that
changes visible behavior, deployment, checks or repository settings. Last full
verification: `main` at `f7a616a` on 2026-11-05 passed `npm run check:docs`,
`npm run lint`, `npm run typecheck`, `npm test` (42 tests), `npm run build` and
`npm run test:e2e` (8 tests).

## Development model

The owner maintains the repository solo and works sequentially, one task at a
time, with several AI assistants contributing through feature branches and pull
requests. There are no separate developer accounts, clones, task ownership splits
or independent-review requirements. See `AGENTS.md` and `docs/decisions.md` for
the current project rules.

## Repository and deployment

The public repository is `AE22589/educational-gaming-platform`. GitHub Pages
publishes from `main` at
https://ae22589.github.io/educational-gaming-platform/.

Pull requests run repository validation, lint, typecheck, unit tests, the
production build and Playwright browser checks. A push to `main` validates the
repository, reuses or rebuilds and browser-tests the static export, then
publishes that artifact.

Verified through the GitHub API on 2026-11-05: `main` has no branch protection
and no rulesets, so the checks are not required for merging. Auto-merge is
disabled, secret scanning is disabled, the repository has no licence file and
branches are not deleted automatically after merge. These are open cleanup items.

## Product status (what `main` serves)

- Home page with the CHISPITAS brand, star balance and a card linking to the
  body-parts mission.
- `/learn`: the silent body-parts matching mission `body-parts-01` is playable
  (nine words, two rounds, adventure path with the dragon, stars per solved item,
  round event and completion bonus). `animals-01` is only a placeholder page.
- `/shop`: apples and water are purchasable for one star; cave bed and glow plant
  are upcoming. Profiles start with 100 stars.
- `/avatar`: companion cave with day/night backgrounds, sleeping dragon, apple
  and water inventory, and dragging items to the dragon (eating and drinking
  animations).
- Local profile: versioned snapshot storage with backup, Web Locks writer
  ownership, JSON import/export and confirmed reset.

Not available: the animal curriculum, approved animal images and audio, the
picture-selection game, avatar clothing and rendering, other subjects, accounts
and any backend. Media-rights review, visual review and child-pilot approval are
pending. See `docs/mvp.md` for the recommended scope, which is not a binding
product boundary, and `docs/assets.md` for artwork status.

## Local checks

Run `npm run check:docs`, `npm run lint`, `npm run typecheck`, `npm test`,
`npm run build` and `npm run test:e2e` as applicable to a change. Use Node
24.21.0 LTS and npm 11.x from `.nvmrc` and `package-lock.json`.

On Windows PowerShell systems where script execution policy blocks `npm.ps1`,
use `.\start-dev.cmd` to launch the local preview without changing the
PowerShell execution policy. The launcher finds a free port and gives each
development server its own Next.js output directory. To request a specific
port, run `.\start-dev.cmd --port 3001`.
