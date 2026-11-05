# Project decisions

## Documentation synchronization — 2026-11-05

Status: requested by the owner; implemented in the pull request that introduces it.

Several AI assistants and the owner change this repository, so documentation must
be updated in the same pull request as the change. AGENTS.md now holds the rule
("Documentation synchronization"). The pull-request template carries a checklist,
and CI runs `scripts/check-docs-impact.mjs` on pull requests: a change to product
files (`src/` outside tests, `public/`, `package.json`, `scripts/`, workflows,
`next.config.ts`) must also change `docs/setup-status.md` or `docs/decisions.md`,
and changes under `public/` must also change `docs/assets.md`. A pull request may
opt out with a line `Docs-Impact: none — <reason>`. The check is a minimum, not proof
that the documentation is correct. It only blocks merging once branch protection
requires the `repository-check` job; this setting is still open.

## Body mission start controls and home mission card — 2026-11-05

Status: implemented and deployed (PR #42).

The persistent `Comenzar` button is removed; it only reopened the explanation and
looked like a start control. The `?` button remains the way to replay the
explanation. The explanation has one `Empezar` button instead of two identical
ones. The home card "Tu próxima misión" links to `/learn/body-parts-01` instead of
the "in preparation" text. This supersedes the `Comenzar` sentence in the
2026-11-04 body-parts entry.

## Brand name in the UI — 2026-11-05

Status: observed; formal naming still open.

The UI brand, page title and navigation show **CHISPITAS** (home page decision,
2026-11-01). The 2026-10-29 entry names the Spanish product **Aventura Animal**;
the UI no longer shows that name. The owner should confirm which name is the
formal Spanish product name. Browser storage keys keep their original
`tier-abenteuer` identifiers for profile compatibility.

## Body-parts matching mission — 2026-11-04

The `/learn` entry offers a silent body-parts matching mission for nine English
words in two rounds. The player may drag a word card or select it and a target.
The seven-stop adventure path uses the owner's supplied landscape, cropped to a
local WebP strip, with the owner's dragon overlaid. Visiting the mission starts
an unstarted run automatically; the first-run explanation is shown once and
can be skipped. (Superseded 2026-11-05: the `Comenzar` button was removed and the
`?` button replays the explanation.) Round two uses a full-body illustration of the same girl in the
homepage artwork's style, with arms stretched horizontally to the sides and
legs apart for clear target separation. The body-parts mission uses
the first two stations: the dragon advances when Continue opens Round 2, then
again when the mission is completed. Replay does not reset reached stations.
The visible path has no numeric counter. Face targets and the body target
configuration live with the learning feature. A profile-schema-v4 migration
preserves existing profiles and adds
versioned mission progress. The profile service persists each placement and
awards the existing two stars per solved learning item, a round completion
ledger event, and the existing ten-star completion bonus. Rewards are
idempotent per run; an explicit replay starts a fresh run and is eligible for
the normal full reward. Errors, hints and demonstration steps never grant or
deduct stars. The mission practices vocabulary without recording mastery.
Review Spanish copy and asset suitability before a child pilot.

## Visual review in Codex browser — 2026-11-03

Every GUI implementation or change receives a visual review by Codex in a
browser available in this environment. Do not ask the owner to provide or
operate their personal laptop browser. Review relevant viewport sizes and
interactions for the change, and include the result of this review when
reporting verification. This applies throughout the project.

## Efficient implementation and verification — 2026-11-02

Keep routine implementation focused and deliver a useful local result promptly.
Scale local checks to the risk of the change: use a focused review and narrow
check for copy, styling and isolated UI changes; run relevant tests for behavior
and shared contracts. Do not weaken the comprehensive pull-request CI gate or
the required checks before a live release. Batch related small changes for a
release when appropriate. During CI and deployment, use longer waits, report
meaningful progress and avoid repeated unchanged status polling. Timebox failed
tool operations and do not retry the same unsuccessful approach without a reason.
For longer work, provide a useful intermediate result and communicate blockers.

## Star shop launch — 2026-11-02

The `/shop` page follows the CHISPITAS site layout and does not feature a
specific avatar. Every profile starts with 100 spendable stars. A one-time
schema migration tops existing balances below 100 up to 100 and preserves
higher balances; later purchases and rewards change the balance normally.
Buying one apple costs one star
and adds one apple to the locally persisted inventory in the same profile
transition. The visible filters are `Todo`, `Comida y bebida` and `Cueva`.
Apple is the only purchasable item at launch; water, cave bed and cave plant are
visible as upcoming items. The shop displays the star balance and apple count.

## Water purchase and dragon animation — 2026-11-04

Water becomes a purchasable consumable for one star. Buying water deducts one
star and increments the current profile's water inventory in one saved
transition. The cave displays water above the apple, including a visible grey
icon when its count is zero. Dragging water to the dragon on pointer or touch
devices consumes one saved unit and temporarily replaces the sleeping GIF with
the owner's transparent water-drinking GIF; the sleeping GIF returns after the
three-second animation. Failed saves do not consume inventory or start the
animation. Water and apple inventory are shown separately in the shop pantry.

## Local Next.js bundler — 2026-11-02

The `dev` and `build` scripts use Next.js's supported Webpack mode. In this
restricted environment, Turbopack's PostCSS child process repeatedly exited
before completing its socket handshake; the worker-thread alternative is
disabled by the installed Next.js version on Node 24.21.0 because of a known
Node worker teardown risk. Webpack production builds and Playwright browser
checks pass. This keeps local preview and static export builds reproducible.

## MVP scope is advisory — 2026-11-02

The MVP in `docs/mvp.md` and `docs/mvp-development-plan-1.1.md` is the
recommended starting scope, not a mandatory product boundary or approval gate.
The owner may select features from the master plan or request other expansions
without first completing the MVP. Keep the MVP documents as the implementation
baseline and update them when an approved scope choice changes their requirements.
Other recorded product, privacy, quality and architecture decisions remain in
effect unless the owner changes them explicitly.

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

## Dependency security and updates — 2026-11-02

GitHub's dependency graph, Dependabot alerts and Dependabot security updates are
enabled. `.github/dependabot.yml` schedules weekly version updates for npm and
GitHub Actions, with at most five open update pull requests per ecosystem.
Review update pull requests and require the repository's normal checks before
merging them.

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

## Apple display in the companion cave — 2026-11-03

The companion cave displays the locally bundled shop apple to the right of the
cave artwork, inside the cave scene. Its appearance follows the active profile's
persisted apple inventory: show the purchased count with a normal apple when
available, and keep a greyed-out apple visible when the count is zero. The owner
later approved feeding the dragon by dragging an apple onto it on both laptop and
touch devices. One apple is removed through the profile service when the drop is
saved; the eating GIF temporarily replaces the sleeping GIF, then the sleeping
GIF returns. Feeding does not start when no apple is available or the profile
cannot save.

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

The Spanish product name is **Aventura Animal**. (Partly superseded in the UI by the
CHISPITAS brand, see 2026-11-05; formal naming is open.) English project
documentation and package metadata use **Animal Adventure**. Existing browser storage keys
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
