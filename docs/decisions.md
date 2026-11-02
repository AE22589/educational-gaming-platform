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

## Local Playwright instructions — 2026-11-02

The owner removed the local instruction to run Playwright E2E tests for routine
implementation work. The E2E tests and CI checks remain unchanged.

## Companion cave — 2026-11-02

Implemented and deployed. The "Mi pequeño amigo" tile opens `/avatar`, which
initially showed an empty framed cave. The browser's local time selects day from
06:00 to 17:59 and night from 18:00 to 05:59. The cave backgrounds remain
separate from character, furniture and decor overlays. The original release had
no placement or customization. PR #12 and Pages workflow #39 passed repository, quality, build and
Playwright checks; workflow #39 deployed the tested static artifact. The cave
view must fit the browser viewport without page scrolling; responsive behavior
has been checked locally in desktop, portrait and landscape browser sizes.

## Sleeping dragon in the companion cave — 2026-11-02

The owner commissioned one sleeping-dragon GIF overlay in `/avatar`, placed at
the red mark in the supplied cave screenshot. Its position is fixed relative to
the cave artwork at approximately 51% from the left and 69% from the top. The
overlay is not draggable and adds no inventory or room customization. The GIF
was generated locally from the owner's character reference. Responsive visual
review is required before this implementation is considered verified; media
rights and owner review remain prerequisites before a child pilot.

## Pages release workflow — 2026-11-01

Build and browser-test the static export on each pull request. After merge, reuse
that artifact only when its successful PR run, PR number and source-tree hash
match the current `main` tree. If the exact artifact is unavailable or does not
match, run the full build and browser checks on `main`. Manual dispatch from
`main` always runs the full checks. Publish the validated artifact and keep
Pages write and OIDC permissions scoped to the deploy job.

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
