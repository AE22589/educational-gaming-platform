# Current setup status — 2026-11-02

## Development model

The owner maintains the repository solo and works sequentially, one task at a
time. There are no separate developer accounts, clones, task ownership splits or
independent-review requirements. See `AGENTS.md` and `docs/decisions.md` for the
current project rules.

## Repository and deployment

The public repository is `AE22589/educational-gaming-platform`. GitHub Pages
publishes from `main` at
https://ae22589.github.io/educational-gaming-platform/.

Pull requests run repository validation, lint, typecheck, unit tests, the
production build and Playwright browser checks. A push to `main` validates the
repository, builds and browser-tests the static export, then publishes that same
artifact. The companion cave release passed PR #12 and Pages workflow #39. The
release record passed PR #13 and Pages workflow #41. Manual workflow dispatch
and effective branch-protection settings have not been verified.

## Product status

The home page, profile and persistence foundation, empty day/night companion
cave and initial apple shop are available as local development previews. The
animal curriculum, approved animal images/audio, playable mission, broader shop
catalog and full avatar rendering remain incomplete. Child-pilot approval is
also pending. See `docs/mvp.md` for the recommended
starting scope; it is not a binding product boundary.

Run `npm run check:docs`, `npm run lint`, `npm run typecheck`, `npm test`,
`npm run build` and `npm run test:e2e` as applicable to a change. Use Node
24.21.0 LTS and npm 11.x from `.nvmrc` and `package-lock.json`.

On Windows PowerShell systems where script execution policy blocks `npm.ps1`,
use `.\start-dev.cmd` to launch the local preview without changing the
PowerShell execution policy. The launcher finds a free port and gives each
development server its own Next.js output directory.

To request a specific port, run `.\start-dev.cmd --port 3001`; then open the
Shop preview URL printed by the launcher.
