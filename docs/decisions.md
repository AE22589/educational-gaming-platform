# Project decisions

## Solo development model — 2026-11-02

The owner is the sole maintainer. Work proceeds sequentially, one task at a time.
There is no second-developer role split, separate account/clone/chat, handover
requirement or independent-review prerequisite. Use a feature branch, preserve
existing local changes, keep shared contracts in their canonical files, and run
the required automated checks before an explicitly authorized release.

Keep existing CI checks and GitHub protections. Do not configure a second-person
approval requirement for this solo project. Effective repository settings have
not been verified; check them before relying on them or changing them.

## Companion cave — 2026-11-02

Implemented and deployed. The "Mi pequeño amigo" tile opens `/avatar`, which
shows an empty framed cave. The browser's local time selects day from 06:00 to
17:59 and night from 18:00 to 05:59. The cave backgrounds remain separate from
future dragon, furniture and decor overlays; no placement or customization is
included. PR #12 and Pages workflow #39 passed repository, quality, build and
Playwright checks; workflow #39 deployed the tested static artifact. The cave
view must fit the browser viewport without page scrolling; responsive behavior
has been checked locally in desktop, portrait and landscape browser sizes.

## Pages release workflow — 2026-11-01

Build the static export once in application CI, run browser checks against it,
and publish that same artifact after repository validation and application
checks pass. Keep Pages write and OIDC permissions scoped to the deploy job.
Manual dispatch may deploy only from `main`. PR #8 and main run #31 verified
this workflow; cave release workflow #39 verified it again. Manual dispatch and
effective required-check settings have not been tested/read back.

## CHISPITAS home page — 2026-11-01

Use the approved bright illustrated storybook style, rounded pastel tiles and
five icon-led navigation items. UI remains Spanish; English is limited to the
learning subject and vocabulary. Science and map tiles are previews. Use the
real profile star balance; do not invent progress, daily limits or reward state.
This decision adds no new game, account, curriculum or economy behavior.

## World map direction — 2026-10-29

The home-page mission entry leads to a small animal world map before a mission.
The map concept remains exploratory; locations, labels and interactions are
not final. This direction does not expand the current MVP's game or content
count. Verify asset rights before product use.

## Product name — 2026-10-29

The Spanish product name is **Aventura Animal**. English project documentation
and package metadata use **Animal Adventure**. Existing browser storage keys
remain unchanged for compatibility.

## Repository and child-pilot requirements — 2026-10-31

The repository is public and GitHub Pages publishes from `main` at
https://ae22589.github.io/educational-gaming-platform/. Use only local media;
review asset rights, child-data privacy, accessibility and age-appropriate
Spanish before any child pilot. Effective branch protection has not been
verified.

## Documentation and decision records

Project documentation is English; product UI remains Spanish and animal
vocabulary/audio remains English. Record confirmed decisions and unresolved
prerequisites here and update affected specifications. Keep proposed, accepted,
implemented and verified states distinct. Chat history is not the project
source of truth.
