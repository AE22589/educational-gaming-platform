# MVP scope

The binding implementation specification is [MVP Development Plan 1.1](mvp-development-plan-1.1.md).

First release: cat/dog/cow/horse, eight listening picture-selection questions,
Spanish UI, English vocabulary/audio, avatar, glasses/cap/T-shirt, local profile,
full replay rewards and robust recovery. Each solved question gives 2 stars;
completion gives 10 once, totaling 26 per complete run. Prices: 10/15/20.

No accounts, backend, Science World, speech recognition, rooms, pets, full offline
support, runtime AI or analytics. Only after acceptance: 12 animals, three
missions, matching game and six items. Five-subject content architecture is
prepared now; five-subject game content is deferred.

## MVP-01 local implementation state

Implemented: Next.js App Router, React, strict TypeScript, Tailwind, Spanish
placeholder navigation, reusable UI, versioned runtime contracts, test fixtures,
persistence/recovery ports and pure snapshot decoding. Real lint, type, unit,
production-build and browser-smoke commands are wired into CI alongside the
retained documentation validator. See setup-status.md for actual check results.

Deferred: animal content/media, mission gameplay, future schema migrations, shop
purchases and avatar rendering. Contract fixtures are technical review data,
not new curriculum. The first integrated loop and child-pilot/media gates above
remain unmet.

## MVP-02 local implementation state

Implemented locally: browser-only profile initialization; versioned local
snapshot storage with revision checks and a validated backup; Web Locks writer
ownership with a conservative BroadcastChannel/localStorage fallback; trusted
attempt validation against the bundled catalog; serialized profile transitions;
idempotent question and completion rewards; raw learning evidence and derived
mastery; retry, backup restore, JSON import/export and confirmed reset UI.
Pending unsaved snapshots remain exportable. Storage is never accessed during
server rendering. The provider currently receives an empty validated content
catalog, so no mission can be started and no curriculum has been authored.
The app builds as a static export for GitHub Pages; a Pages Actions workflow is
configured to publish on pushes to `main`, matching the existing Lara project.
GitHub currently blocks Pages for
this private repository and requests an upgrade or public repository visibility.
No upgrade or source visibility change has been made.

Not yet implemented: migration of an earlier shipped schema (none exists),
approved animal content/media, shop purchases, avatar rendering, gameplay and
the child-pilot/media gates. Imports with session history require the matching
trusted mission versions in the catalog and enter recovery if those versions
are unavailable. MVP-02 does not make the first integrated learning loop ready.
