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

The home page, profile and persistence foundation, and empty day/night companion
cave are available as development previews. The animal curriculum, approved
animal images/audio, playable mission, shop purchases, avatar rendering and
child-pilot approval remain incomplete. See `docs/mvp.md` for the binding scope.

Run `npm run check:docs`, `npm run lint`, `npm run typecheck`, `npm test`,
`npm run build` and `npm run test:e2e` as applicable to a change. Use Node
24.21.0 LTS and npm 11.x from `.nvmrc` and `package-lock.json`.
