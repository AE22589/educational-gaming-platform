# Animal Adventure

Aventura Animal is a Spanish-language learning app for children learning English
animal vocabulary. The current site is a development preview; the full animal
mission, approved media, shop purchases and avatar rendering are still deferred.
The companion cave is a separate commissioned preview at `/avatar`.

## Local development

Use Node **24.21.0 LTS** (`.nvmrc`) and npm **11.19.0**.

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:3000. No environment variables or external accounts are
needed. To verify changes, run:

```bash
npm run check:docs
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests use the production export. In Linux CI, install Playwright with
`npx playwright install --with-deps chromium`. `npm run start` serves the export.

## Project structure

- `src/app/`: Spanish pages and responsive styles.
- `src/types/contracts.ts`: canonical Zod schemas and inferred shared types.
- `src/features/profile/`: profile, rewards and persistence boundaries.
- `src/content/`, `src/games/`, `src/features/`: sequential feature implementation.
- `public/`: local product artwork and media.
- `tests/`: fixtures and automated behavior checks.

## Project guidance

- [MVP scope](docs/mvp.md)
- [MVP development plan](docs/mvp-development-plan-1.1.md)
- [Contracts](docs/contracts.md)
- [Contract review](docs/contracts-review.md)
- [Current setup status](docs/setup-status.md)
- [Project decisions](docs/decisions.md)
- [Master plan](docs/master-plan.md)

The owner maintains the project solo and works sequentially. Read `AGENTS.md`
before changing the project. Keep documentation in English and the product UI
in Spanish.
