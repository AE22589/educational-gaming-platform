# Recommended MVP scope

This is the recommended starting scope. It is not a binding product boundary;
the owner may choose other features or expand the scope at any time. The
implementation details for this baseline are in [MVP Development Plan 1.1](mvp-development-plan-1.1.md).

First release: cat/dog/cow/horse, eight listening picture-selection questions,
Spanish UI, English vocabulary/audio, avatar, glasses/cap/T-shirt, local profile,
full replay rewards and robust recovery. Each solved question gives 2 stars;
completion gives 10 once, totaling 26 per complete run. Prices: 10/15/20.

No accounts, backend, Science World, speech recognition, customizable rooms,
pets, full offline support, runtime AI or analytics. A narrowly scoped companion
cave preview is commissioned: it switches between its day and night illustrations
using the browser's local time (day 06:00–17:59, night 18:00–05:59) and shows one
locally generated sleeping-dragon overlay at the position marked by the owner.
The cave view fits the browser viewport without page scrolling on supported
desktop and mobile sizes. It has no movable objects, inventory or room
customization.
Suggested next expansion after this loop: 12 animals, three missions, a matching
game and six items. Five-subject content architecture is prepared now; five-subject
game content is outside this baseline but may be selected by the owner sooner.

## MVP-01 local implementation state

Implemented: Next.js App Router, React, strict TypeScript, Tailwind, Spanish
placeholder navigation, reusable UI, versioned runtime contracts, test fixtures,
persistence/recovery ports and pure snapshot decoding. CI runs the documentation
validator alongside real lint, type, unit, production-build and browser-smoke
checks. On `main`, Pages publishes the same single build that passed browser
smoke tests; its deploy job does not reinstall dependencies or rebuild. See
setup-status.md for implementation and verification status.

Outside the recommended baseline: animal content/media, mission gameplay, future schema migrations, shop
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

The `/shop` route displays the star balance, three category filters, an apple
priced at one star, and upcoming drink/cave items. Every profile starts with
100 stars; a one-time migration tops existing balances below 100 up to 100 and
preserves higher balances. Apple purchases atomically deduct one star and
increase the persisted apple inventory. No avatar is featured in the shop.

The app builds as a static export for GitHub Pages; the Pages workflow publishes
on pushes to `main`.
The repository is now public and GitHub Pages is enabled (build type: workflow,
source: `main`), so the site is published at
https://ae22589.github.io/educational-gaming-platform/ (verified through the
GitHub API on 2026-10-31). It currently serves development previews only.

Not yet implemented: approved animal content/media, full avatar rendering, gameplay and
the child-pilot/media gates. Imports with session history require the matching
trusted mission versions in the catalog and enter recovery if those versions
are unavailable. MVP-02 does not make the first integrated learning loop ready.
