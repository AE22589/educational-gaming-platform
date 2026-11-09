# Current setup status — 2026-11-05

This file describes the state of `main`. Update it in every pull request that
changes visible behavior, deployment, checks or repository settings. Last full
verification: `main` at `f7a616a` on 2026-11-05 passed `npm run check:docs`,
`npm run lint`, `npm run typecheck`, `npm test` (42 tests), `npm run build` and
`npm run test:e2e` (8 tests).

## Adventure Map prototype

The home screen's Adventure Map tile opens `/adventuremap` via “Explorar el mapa.”
The shared map and its Bosque Encantado detail are described in the 2026-11-09
entry below. Real units, games, scores and saved progress are pending.

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

Repository settings, verified through the GitHub API on 2026-11-05:

- **Who can push:** only the owner (`AE22589`, admin) and the collaborator
  `Feduta` (write). Claude and Codex work through the owner's account. Pushes
  need no review and no pull request.
- **`main` protection (light):** force pushes and deleting `main` are blocked.
  Nothing else is required: no pull request, no review, no required checks, and
  administrators are not enforced.
- **Branches:** branches are deleted automatically after a merge. The 28 stale
  merged branches were deleted on 2026-11-05.
- **Still open:** secret scanning is disabled, the repository has no licence file,
  and auto-merge is disabled. Dependabot updates were handled on 2026-11-05: ESLint 10
  and five GitHub Actions updates are merged and deployed, TypeScript 7 and
  `@types/node` 26 were closed, and major updates of `@types/node` are ignored.

The workflow `side-branch-draft-pr.yml` opens a draft pull request for work pushed to
a side branch. The repository setting "Allow GitHub Actions to create and
approve pull requests" is on (verified 2026-11-05); a test branch produced a draft pull
request after two minutes.

Direct pushes to `main` are checked after the push, not before: every push to
`main` runs the repository check (document links, asset rules, script tests), the
application check (build and browser tests) and the quality check (lint, typecheck,
unit tests). A failure in any of them stops the deployment, but the change is
already on `main`. The documentation impact check also runs on every push, but
only as a warning (it never stops the deployment). An opt-out line
`Docs-Impact: none — <reason>` in a commit message silences it. Planned
improvements are listed in `docs/backlog.md`.

## Product status (what `main` serves)

- Home page with the CHISPITAS brand, star balance and a card linking to the
  body-parts mission. The hero says "You See" and "I did it!". Navigation labels
  and tile titles are English-first with Spanish subtitles. The top navigation
  shows "About Chispitas", "Contact Us" and "Log in/Register" on the home page;
  other pages prepend a "Home" link. "My Profile" and
  the "Science" preview are no longer in the top navigation. "Contact Us"
  opens `/contact` and "About Chispitas" opens `/about`, friendly "¡Muy pronto!"
  placeholder pages. "Log in/Register" opens `/login-register`, a UI-only sign-in
  and registration screen with English and Spanish labels; there is no authentication
  or account creation service.
  The learning and shop pages are reached through the home page tiles
  and cards, not through the navigation.
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

## Assets

All images in `public/` are WebP (animations are lossless animated WebP) and are
registered in `docs/assets.md`; `npm run check:docs` and CI enforce this. The cave
preloads the apple and water animations. Artwork is owner-approved in the
development chat; an independent third-party rights assessment is still open before
a child pilot.

## Local checks

Run `npm run check:docs`, `npm run lint`, `npm run typecheck`, `npm test`,
`npm run build` and `npm run test:e2e` as applicable to a change. Use Node
24.21.0 LTS and npm 11.x from `.nvmrc` and `package-lock.json`.

On Windows PowerShell systems where script execution policy blocks `npm.ps1`,
use `.\start-dev.cmd` to launch the local preview without changing the
PowerShell execution policy. The launcher finds a free port and gives each
development server its own Next.js output directory. To request a specific
port, run `.\start-dev.cmd --port 3001`.
## Shared Adventure Map preview — 2026-11-09

`/adventuremap` now displays one owner-supplied world map for all subjects.
The owner-supplied Bosque Encantado detail image appears in the same map area
after the green play control is selected. The left panel then provides a return
control and shows placeholder progress of English 2 completed, Science 1
completed, 3 sections completed, and 12 stars. The progress bar uses three
of five sections. The five section names are stored in map preview data.
The return control is hidden on the world overview. No text appears beneath
either map image. Image checkpoints do not navigate or update progress. Star balance is
separate from completed units. Real units, games and scores remain pending.

## English World and home welcome

The home screen displays updated English welcome copy in its existing panel. The
English World tile opens a ten-unit catalog at /englishworld. Each card has a Spanish description and a separate generated WebP illustration.
Unit links open the existing preview routes while the activities are being prepared.
