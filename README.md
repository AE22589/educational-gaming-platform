# Animal Adventure

Animal Adventure is a Spanish-language learning app for children learning English
vocabulary. The visible product brand in the UI is **CHISPITAS**. The app is a
static site published to GitHub Pages; it is still a development preview and has
not been approved for a child pilot.

Live preview: https://ae22589.github.io/educational-gaming-platform/

## What works today

- **Home** (`/`): illustrated CHISPITAS home page with the real star balance.
- **My Amazing Body!**: the playable silent body-parts matching mission in Science World
  (`/scienceworld/body/`, nine English words in two rounds). The animal
  picture-selection mission (`/learn/animals-01`) is still a placeholder.
- **Shop** (`/shop`): apples and water cost one star each; cave bed and glow plant
  are shown as upcoming. Every profile starts with 100 stars.
- **Companion cave** (`/avatar`): day/night cave with a sleeping dragon. Apples and
  water bought in the shop can be dragged onto the dragon.
- **Profile**: local browser profile with versioned storage, backup, JSON
  import/export and reset. No accounts, backend, analytics or runtime AI.

Approved animal content, audio, further missions and the 3D or layered avatar are
not part of `main`. The exact status is kept in
[docs/setup-status.md](docs/setup-status.md).

## Local development

Use Node **24.21.0 LTS** (`.nvmrc`) and npm **11.19.0**.

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:3000. No environment variables or external accounts are
needed. On Windows systems that block `npm.ps1`, use `.\start-dev.cmd`.

To verify changes, run:

```bash
npm run check:docs
npm run lint
npm run typecheck
npm test
npm run build
npm run playwright -- install chromium
npm run test:e2e
```

Browser tests use the production export. The project Playwright command reuses
the normal per-user browser cache on Windows. In Linux CI, install Playwright with
`npx playwright install --with-deps chromium`. `npm run start` serves the export.

## Project structure

- `src/app/`: Spanish pages and responsive styles.
- `src/types/contracts.ts`: canonical Zod schemas and inferred shared types.
- `src/features/profile/`: profile, rewards and persistence boundaries.
- `src/features/learning/`: body-parts mission logic and UI.
- `src/features/shop/`, `src/features/avatar/`, `src/features/homepage/`: shop,
  companion cave and home page.
- `src/content/`, `src/games/`: reserved for the animal curriculum and games.
- `public/`: local product artwork and media, registered in
  [docs/assets.md](docs/assets.md).
- `tests/`: fixtures and browser tests.

## Project guidance

- [MVP scope](docs/mvp.md)
- [MVP development plan](docs/mvp-development-plan-1.1.md)
- [Contracts](docs/contracts.md)
- [Contract review](docs/contracts-review.md)
- [Current setup status](docs/setup-status.md)
- [Project decisions](docs/decisions.md)
- [Asset register](docs/assets.md)
- [Master plan](docs/master-plan.md)
- [Backlog of planned later work](docs/backlog.md)

The owner maintains the project solo and works sequentially, with several AI
assistants contributing through pull requests. Read `AGENTS.md` before changing
the project. Keep documentation in English and the product UI in Spanish.

## Keeping documentation current

Every change that alters visible behavior, assets, rules or workflow must update
the documentation in the same pull request. See "Documentation synchronization"
in `AGENTS.md`. CI enforces the minimum through `scripts/check-docs-impact.mjs`.
