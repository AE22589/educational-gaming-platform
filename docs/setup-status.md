# Current setup status — 2026-11-05

The pronunciation library includes 473 British English MP3s under
`public/audio/en-gb/`. All 507 workbook rows with an English term have an
`AudioPath`. Repeated terms share clips. Picture Match plays the word on a
correct answer, and Mystery Word plays it when the correct letter is selected.
The shared games show their running “Stars” count between the game list and the
active game panel. Correct answers play the associated vocabulary recording.
Spelling also offers “Listen,” and Build a Phrase plays the full phrase.
The separate body-parts mission pronounces a word on correct placement.

The homepage links to `/worksheets` from the printable activities card.
Parents can browse worksheet files by subject, grade, book, section and topic.
The first mapped PDF is under Science, Primary 2, Book 2, Healthy Habits,
Healthcare and illnesses. The build imports the workbook before the static export.
Section and topic pages show an “Imprimir fichas” action when matching PDFs exist.
One PDF opens in a new tab. Multiple PDFs open the Worksheets page with the
section and, when applicable, the topic already selected.
English World and Science World show the workbook's section numbers in circular
badges on their cards. Subsection games are read from the first sheet.


This file describes the state of `main`. Update it in every pull request that
changes visible behavior, deployment, checks or repository settings. Last full
verification: `main` at `f7a616a` on 2026-11-05 passed `npm run check:docs`,
`npm run lint`, `npm run typecheck`, `npm test` (42 tests), `npm run build` and
`npm run test:e2e` (8 tests).

## Compact homepage — 2026-11-17

On phones, the four main activity cards are taller. The three quick links
below use a compact layout with visible illustrations. The Chispitas brand
aligns with the left edge of the stacked mobile header.

The homepage keeps the standard navigation and positions the valley
artwork behind the compact welcome panel. The star balance is in the welcome
panel. The grade picker appears on entry and gives way to the four world
cards and secondary activities after the available grade is selected. On
short, narrow screens the welcome subtitle and star balance share a row.

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
- `/scienceworld/body/`: the silent body-parts matching mission `body-parts-01` is playable
  (nine words, two rounds, adventure path with the dragon, stars per solved item,
  round event and completion bonus). `/learn/` links to the mission. `/learn/animals-01/` is a placeholder page.
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
Sports opens a game menu with eight playable activities that use the unit's 16 English vocabulary terms.
The selected game opens below the menu. Other English World units open their preview routes.
The Sports menu shows the total stars earned on first tries and each completed
game's best score as a proportionally filled star. Each game shows correct
answers and mistakes. Picture Match plays sound feedback and reshuffles after
completion.

## Science World catalog

The homepage Science World tile opens the six-unit catalog at "/scienceworld". The catalog shares the English World card layout and responsive grid. Six owner-provided illustrations are cropped and converted to lossless WebP. My Amazing Body! opens the body-parts mission. The five other cards open unit previews.

## Workbook curriculum - local review, 2026-11-14

Both world catalogs read the generated public curriculum. The current export
contains 16 units across two Primaria 2 books. Six illustrated homepage cards offer grades 1–6 with only Primaria 2 enabled.
After selection, the cards hide and the navigation displays the grade.
Each world opens the book for that subject and grade automatically. The shared unit page uses the workbook
ID. Sports and Seasons use workbook vocabulary and game menus. My Amazing Body!
opens the existing body-parts mission. See [Workbook curriculum](curriculum-import.md)
for source editing, import and preview. No new public artwork is included.
The owner later approved tracking the complete source workbook at `docs/SectionList.xlsx`.

The six primary grade cards use original fantasy artwork registered in
[the asset register](assets.md). Only Primaria 2 is currently available.

The Spanish grade picker appears on a fresh homepage visit. Selecting Primaria 2
hides the picker, reveals the activity cards, and shows the grade tag across
navigation and reloads in the same browser session.

Science World shows two rows of three cards on desktop with the existing card
width. Both world catalogs include a pill-shaped link back to the homepage.

Section pages without subsections center the main artwork and show the activity
menu or an availability message. Section pages link back with "Volver a las
secciones." Compatible games use workbook vocabulary.

Sports and Seasons game icons, picture clues and affected labels use corrected
UTF-8 text. Sports still uses the registered WebP equipment and park art.

Playable section cards open their section and lift on hover. Sections without
a playable activity stay in the catalog with a coming-soon label.

English World section headers match their catalog card colors.

Science World Section 2 opens Healthy Habits, Happy Life! from its catalog
card. The section page returns to the Science World catalog and the legacy
Healthy Habits URL opens the same topic list.

The world catalogs open a separate, image-free topic list for sections with
subsections. Basics has six topics and Healthy Habits has nine, in workbook
order. Numbered cards use soft rainbow colors and show English above the
smaller Spanish translation. Each card opens a dedicated game page with a
breadcrumb back to the topic list. Topic pages show an availability message
when no games are assigned.

The workbook assigns six shared games to each of the nine Healthy Habits
subsections. Food and Drinks also includes Food Group Sort and Find the Food.
The importer exports their order from the subsection's `GameTypes` cell.
Each game page uses its own `vocabulary_list` group. Missing image paths
display the Spanish translation as a clue. One incomplete vocabulary row
without an English term is skipped. Game formats retain practice feedback
without profile rewards.

Practice pictures fit inside their frames, including tall artwork such as
milk in Mystery Word. Captions and answer text stay outside the picture frame.

The public curriculum now assigns seven existing pictures plus 46 lossless OpenMoji icons to vocabulary image paths. A separate row-by-row mapping in `docs/vocabulary-image-map.md` records the new paths. Twenty-two `Find` rows still lack confident pictures. Picture Match uses only words with WebP paths; other games retain Spanish clues. The complete owner-approved source workbook is now tracked at `docs/SectionList.xlsx`.

## Vocabulary artwork — 2026-11-17

Ten supplied illustrations are cropped to transparent lossless WebP and connected through docs/SectionList.xlsx and the public curriculum export. Existing image-based games display these pictures; missing vocabulary images retain translation clues.

## Vocabulary batch 2 — 2026-11-17

Thirty-nine supplied illustrations are stored as transparent lossless WebP at 41 curriculum-specific paths. The source workbook and generated curriculum include all mappings. Colors and Animals images are ready in curriculum data; their English activities remain upcoming. Existing Healthy Habits games display the new Science artwork.

## Science batch 3 and clue layout — 2026-11-17

Eighty-two listed vocabulary terms have supplied artwork prepared; 83 workbook image cells are updated across relevant Science sections. Three new alternatives preserve current custom Apple, Water and Knee pads references. Every pre-existing public file is retained unchanged. Shared Spanish translation clues now wrap at readable text size and grow vertically, keeping subsequent controls below the text.

### My Little Friend

The homepage friend card opens /myfriend/. Choose one of ten characters, save a name, and edit either later. The profile displays its first-save birthday, three starting care indicators, and links to Star Shop and, for the dragon, the existing cave.

## Workbook artwork and Picture Match

The final Science and English vocabulary update adds 142 supplied lossless WebP
files and reuses three existing illustrations. The workbook records missing
images, and the generated curriculum validates each public image path.

Sections and topics with illustrated vocabulary offer Picture Match. Sports,
Seasons, and the Healthy Habits topics continue to offer their assigned games.
The Body section also retains its body-parts mission.

The Pages deployment uses a separate artifact name for each workflow attempt
and checks that GitHub can read the uploaded artifact before deployment.

Added 13 supplied vocabulary illustrations for Seasons, Animals, and Places
and Activities. The workbook assigns them to their vocabulary entries, and
the shared Picture Match game includes them automatically.

Science Book 2 Section 3, Discover the Animal Kingdom!, uses the shared
subsection list and detail pages for seven bilingual topics. Section 3
vocabulary reuses existing image paths for matching meanings.
