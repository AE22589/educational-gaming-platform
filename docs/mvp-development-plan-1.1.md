# Animal Adventure — MVP Development Plan 1.1

28 October 2026 · English revision of the supplied German two-developer start guide

## 1. Purpose and document boundaries

All project documentation must always be written and maintained in English,
including future plans, guides, architecture decisions, issues and pull requests,
regardless of the conversation language. Original textbook titles and necessary
source quotations may retain their original language with English explanation.
This documentation rule does not change the specified product UI or learning languages.

Build one complete small loop: **enter the animal world → choose a mission →
meet animals → solve tasks → earn stars on every new playthrough → buy items →
dress an avatar**. The home-page mission entry leads to a small world map. Design
that map before deciding where missions and games belong; treat the current
concept image as exploratory only. Do not ask Codex to build the whole platform
at once.

This is the implementation plan for the recommended MVP baseline. It is not a
binding product boundary: the owner may select broader features or a different
sequence at any time. `master-plan.md` records the broader educational gaming
platform and future textbook coverage. The supplied German guide is the baseline;
the safeguards, mastery rules and reliability requirements below are explicit
1.1 additions. No images are embedded in this plan.

## 2. Recommended first scope

- Four animals: **cat, dog, cow, horse**.
- One game: hear an English animal name and select the correct image.
- One mission with eight questions; each animal appears twice.
- A simple avatar; three purchasable items: glasses, cap and T-shirt.
- Star balance, inventory, equipment, learning evidence and local persistence.
- Replay with full new rewards.

Suggested follow-on scope is **12 animals, three missions, a matching game and
six shop items**. The owner may choose this or another expansion at any time;
passing this loop first is a sequencing recommendation, not a prerequisite.

For this baseline, the world map is a navigation and presentation layer. A
small, child-friendly world and review of locations/navigation are recommended
design steps. The owner may also choose additional missions or subjects; the map
concept alone does not decide their details.

Outside the recommended baseline: registration, backend, Science World, speech recognition, customizable
rooms, pets, full offline operation, runtime AI, analytics and microphone
recording. The owner commissioned a narrowly scoped companion-cave view as a
visual extension of `/avatar`: show the local-time day image from 06:00 through
17:59 and the night image from 18:00 through 05:59, with one locally generated
sleeping-dragon GIF overlay fixed at the owner-marked position. Keep the room
background separate from character and decor assets; the overlay has no controls
for repositioning, inventory or room customization. Keep the navigation, cave image and footer
within the browser viewport without page scrolling on supported desktop and
mobile sizes. One local profile and one active browser tab are supported. No
cross-device synchronization.

UI and brief instructions are **Spanish**; vocabulary and learning audio are **English**. Code, filenames and technical identifiers are English. Use large identifiable animal pictures, large buttons, friendly feedback and no time limit. Audio has a visible play/replay button. Development placeholders must be labelled; child testing requires reviewed, licensed local images and audio.

## 3. Stars, purchases and provisional farming safeguards

| Event | Reward |
|---|---:|
| Question solved correctly | +2 stars |
| Correct after errors or help | +2 stars |
| All eight questions solved | +10 stars once per run |
| Explicitly started new playthrough | Full rewards again |
| Incorrect answer | No reward and no deduction |

Every profile starts with 100 spendable starter stars. A one-time schema
migration tops existing balances below 100 up to 100 and preserves higher
balances. The `/shop` page initially offers apples for one star
each. A purchase deducts one star and increments the saved apple inventory in
one profile transition. Water and cave furnishing examples may be visible as
upcoming items, with `Todo`, `Comida y bebida` and `Cueva` filters. The shop
does not feature a particular avatar.

A full mission earns **26 stars**. Credit solved questions immediately; stopping early retains credited stars. Completion bonus requires all eight solved questions. There is **no daily cap, replay discount, speed requirement or punishment**.

Distinguish a new playthrough from duplicate delivery. Persist the run ID, question IDs, random seed, order and options; reload never creates a run. Only an explicit Spanish “play again” action after confirmation of an active-run replacement creates a new run. Starting over preserves already earned stars and archives the abandoned run without a completion bonus.

The profile layer validates attempts against the active persisted mission/version/question/options. Reject forged question IDs, invalid choices and attempts for locked questions. Rewards use keys `runId:questionId:solved` and `runId:complete`; attempts have independent stable IDs. Duplicate attempts affect neither evidence nor rewards. Completion is derived from solved questions, never trusted from a game callback. Lock solved cards synchronously and disable controls during submission. Purchases and reward events pass through one serialized profile reducer and durable writer.

Provisional anti-farming measures are content variety, stable randomized order/options per run, deduplication, explicit restarts and separate mastery evidence. Do not silently add caps. Local-only state is editable by the device owner: this prototype cannot prevent deliberate storage editing, automation or clock manipulation. Stars have no monetary value, competitive ranking or external prizes. Revisit the economy after observing play; any change to unlimited full replay rewards requires an explicit product decision and updated tests.

| Item | Category | Price |
|---|---|---:|
| Glasses | eyewear | 10 |
| Cap | headwear | 15 |
| T-shirt | top | 20 |

A unique accessory purchase checks the current balance and ownership, deducts once and adds ownership in one state transition. No repeat purchases. Equip only owned items; one per category. All three categories can be worn together. Spanish states: buy, already owned, insufficient stars. Equip/unequip and purchases persist. Consumable purchases instead deduct the price and increment the item's inventory quantity atomically; the initial apple costs one star and can be purchased repeatedly while stars remain.

## 4. Explicit mastery model — separate from stars

Use versioned policy `mastery-v1`, per profile, subject, skill and learning item. It is a provisional instructional heuristic, not a validated assessment or diagnosis.

- Record each distinct attempt: chosen answer, correctness, help, run, question, content version and time. Replayed transport IDs do not create evidence.
- Per question, first-attempt correct without help is **independent evidence**. Correct after any incorrect attempt or help is **supported evidence**. Replaying audio alone is an accessibility action, not help; revealing/eliminating answers is help.
- `unseen`: no evidence. `practicing`: any evidence but threshold unmet. `secure`: at least three independent successes across at least two explicit runs, including a later run at least 24 hours after the first qualifying run. At most one qualifying success per item per run counts toward this threshold, although all attempts remain recorded. Immediate replay can earn stars but cannot establish delayed retention.
- `review-due`: a previously secure item receives an incorrect first attempt, uses help on a later assessment question, or its last independent success is seven days old. One independent success in a new run returns it to secure and refreshes the review date.
- Unknown/invalid timestamps cannot satisfy spacing. Use local UTC timestamps; a backward clock suspends time-based promotion pending a consistent timestamp. No claims of tamper resistance.

Prioritize due and practicing items in later missions without changing the fixed eight-question first mission. Do not block free practice or shame the child. Store evidence and policy version so derived status can be recomputed; star balance never determines mastery.

Test: supported success still gives two stars but no independent credit; two occurrences in one run count once toward mastery; immediate replay remains practicing; spaced evidence promotes; later error marks review due; duplicates do not inflate evidence; policy migration preserves raw evidence.

## 5. Multi-subject content contracts

For the recommended baseline, build subject-neutral contracts and author the
four-animal English slice. Keep subject, instruction language and target language
distinct. Do not hard-code all content as English animal vocabulary. Broader
content may be selected by the owner at any time.

The supplied school image identifies five second-primary subjects (2026/27):

| Subject ID | Book as supplied | Publisher | ISBN |
|---|---|---|---|
| mathematics | 2PRI MATEMATICAS M.LIG CM ED23 | Santillana | 9788414407639 |
| spanish | 2PRI LENGUA M.LIG CM CAST ED3 | Santillana | 9788414407622 |
| english | LEAD THE WAY 2 Pb | Macmillan | 9781380049957 |
| natural-science | 2PRI NATURAL SCIENCE STD BOOK WM ED23 | Richmond | 9788414408087 |
| social-science | 2PRI SOCIAL SCIENCE STD BK MADR WM ED23 | Richmond | 9788414408254 |

These are transcriptions, not publisher-verified editions or verified unit mappings. Obtain official publisher catalogues, sample pages or tables of contents by ISBN; record exact source URL, access date, edition and confidence. Mark mappings `unverified`, `verified` or `needs-review`. Do not invent chapter alignment or reproduce copyrighted exercises without permission. This investigation is outside the recommended baseline and is not a blocker for original animal exercises.

| Contract | Required fields |
|---|---|
| Subject | stable id, localized title, supported locales |
| Textbook | id, subjectId, title, publisher, ISBN, edition, grade, schoolYear, source references and verification status |
| Unit / Skill | stable id, subjectId, optional textbook/unit mapping, localized title, prerequisite skill IDs |
| LearningItem | id, contentVersion, subjectId, skillIds, grade, instructionLocale, optional targetLocale, discriminated kind and payload; animal vocabulary has English term, Spanish meaning, image and audio refs |
| Question | id, learningItemId, skillIds, gameType, typed prompt, option IDs, correct option ID, optional hint refs, difficulty |
| Mission | id, version, subjectId, localized title, item IDs, ordered question definitions, reward policy version |
| Asset | id, local path, type, locale, accessible description, licence, attribution, review status |
| AnswerAttempt | attemptId, runId, questionId, selected option ID, correct, helpUsed, attempt index, timestamp, contentVersion |
| SessionState | runId, missionId/version, seed, stable order/options, question states, results, active/completed/abandoned |
| ShopItem | id, Spanish name, category, nonnegative integer price, rendering data |
| ProfileState | schemaVersion, revision, stars, inventory item quantities, owned IDs, equipment, learning evidence/policy version, active session, processed event keys, reward ledger |

Use discriminated payloads for vocabulary, numbers, text and concepts, plus an extensible game registry. Validate JSON at runtime, stable reference integrity, option uniqueness and answer membership. Keep textbook metadata independent of exercise assets. Unknown game types fail with a Spanish recovery message. No requirement to implement renderers for all five subjects in the MVP.

## 6. Architecture and persistence

Games emit results; they never mutate balance, inventory or browser storage. Only the profile layer writes persistent application state. Build and integrate the profile and game features sequentially against the same typed contract. React Context plus reducer is sufficient unless the foundation establishes otherwise. Access storage only on the client after hydration.

Use a versioned, runtime-validated local snapshot with a monotonic revision. Persist a complete transition (attempt, progress, reward keys, ledger, balance and inventory) in one snapshot write; do not scatter related state across keys. Serialize writes and acknowledge a reward/purchase as saved only after successful persistence. The v1-to-v2 profile migration adds an empty item inventory. The v2-to-v3 migration tops balances below 100 up to 100 once, preserving higher balances and progress. Retain a validated last-known-good backup before replacing a good snapshot. Load and validate before any initial autosave. Store run order and seed to resume exactly.

Catch unavailable storage, quota errors, invalid JSON, validation errors and migration failures. Never silently reset or overwrite corrupt data. Offer retry and raw backup export; explicit reset requires informed confirmation. Validate imports, bound their size, migrate only supported versions and preserve originals. A future schema version opens recovery mode rather than downgrading data. On write failure show Spanish “changes not saved”, preserve pending state in memory, and allow retry/export; block further economic transactions until resolved. Do not claim reload safety for unsaved changes.

The supported product is one writer tab. Use a Web Lock for the profile where supported; if unavailable, use a documented exclusive-session lease and conservative read-only fallback when ownership is uncertain. Detect another tab or revision changes and stop writes with a Spanish explanation. A storage event alone is not a transaction lock. Test forced failures, interruption, reload, backup restoration, old-schema migration, future versions and conflicting tabs. Browsers can evict storage; export is the user-controlled backup. Full offline caching is deferred.

## 7. Visual and audio quality gate

Create a coherent child-friendly visual language: consistent illustration style, palette, spacing, typography, button states and avatar proportions. No emoji substitutes for final animal art. Images must be unambiguous at answer-card size; no English text label giving away a listening answer. Keep semantic accessible names and test with assistive technology; offer a clearly labelled accessible alternative practice mode if needed.

Target 48×48 CSS-pixel controls, visible keyboard focus, touch and keyboard support, readable Spanish text, sufficient contrast (WCAG AA target), feedback beyond colour, reduced-motion support and no flashing/timers. Review phone (360 px), tablet (768 px) and desktop (1280 px) layouts for clipping and scrolling. Prevent layout shifts while media loads. Review screenshots of home, mission, wrong/correct feedback, completion, shop, avatar and recovery states.

Use local, reviewed English pronunciation recordings and a visible repeat button. Handle rejected playback and missing/failed media with retry and an explicit Spanish message. Do not silently substitute unrelated audio or pretend placeholder files exist. Maintain an asset licence/attribution register. The owner reviews media, Spanish wording and visual consistency before any child pilot.

## 8. Solo workflow and release gates

The owner is the sole maintainer. Work proceeds one task at a time in the existing checkout; there are no developer roles, separate accounts/clones, parallel chats, handovers or independent-review prerequisites. Start each implementation task on a feature branch, preserve unrelated work and keep changes to shared contracts in their canonical source with dependent consumers, docs and tests.

```bash
git status --short --branch
git switch main
git pull --ff-only
git switch -c codex/<task-name>
```

Keep automated repository validation, application checks and tested-artifact deployment. Do not require approval from a second person. Read the effective GitHub rules before changing them; any existing rule that prevents the owner from releasing a passing change is an explicit configuration issue to resolve, not a reason to invent another developer role. Keep main as the default branch, block force pushes, use squash merges and least-privilege workflow permissions. Do not use `pull_request_target` to execute untrusted changes.

CI must keep the pull-request gate short and meaningful: run the repository/documentation validator and the real application checks (lint, strict TypeScript, Vitest, production build and Playwright smoke tests) from the committed lockfile. Install dependencies once per application job. Build the static export once, run browser smoke tests against that export, and retain browser failure evidence. Checks must not skip silently or use empty scripts. The documentation validator does **not** replace application tests.

On pushes to `main`, deploy only after both repository and application checks pass. Upload the already-built and browser-tested `out/` directory as a short-lived artifact; the Pages deployment job downloads that artifact and publishes it without checking out the source, reinstalling dependencies or rebuilding. Keep Pages deployment permissions scoped to that job. A manual workflow dispatch may publish only from `main`. Cancel superseded runs for the same ref so obsolete commits do not consume runner time. Keep the required PR status-check job names stable when changing workflow structure; verify configured required-check names after the first successful run.

Automated checks must block a release when they fail. A policy file, AGENTS.md or PR template does not enforce GitHub settings. Record actual protection and check results; do not claim a setting is active without reading it back.

## 9. Copy-ready foundation Codex prompt

```text
We are developing Animal Adventure (Spanish product name: Aventura Animal), a web learning application for Spanish-speaking
children aged 6–8 learning English animal words. Implement only the foundation.
Do not build complete games, the shop or a backend yet.

Read AGENTS.md, docs/mvp-development-plan-1.1.md, docs/master-plan.md and
docs/contracts.md. Check git status and the branch before editing. Preserve
other people's changes. If on main, stop editing and request a feature branch.
Present a short implementation plan, then implement this task. Commit, push and
merge only when explicitly authorized. Missing shared decisions must be reported.

Use Next.js App Router, React, strict TypeScript and Tailwind CSS; npm only.
Choose compatible stable packages, record a supported Node LTS version and
commit a reproducible npm lockfile. Prepare Vitest, React Testing Library and
Playwright. No backend, accounts, analytics, runtime AI or microphone recording.

Folders: src/app/, src/components/ui/, src/content/animals/,
src/games/picture-selection/, src/features/learning/, src/features/profile/,
src/features/rewards/, src/features/shop/, src/features/avatar/, src/types/,
public/animals/, public/audio/, tests/e2e/, docs/.

Create Spanish placeholder routes /, /learn, /learn/[missionId], /shop, /avatar.
Create common Button/Card components and subject-neutral versioned contracts
from section 5. Update docs/mvp.md, docs/contracts.md, AGENTS.md and README.
Prepare the persistence boundary and recovery contracts without implementing
the full economy. Add a real component test and browser home smoke test.
Extend CI to run lint, typecheck, unit tests, build and browser smoke tests.
Scripts: dev, lint, typecheck, test, test:e2e, build. No dummy passing checks.

Acceptance: npm run dev starts; npm run lint, npm run typecheck, npm test and
npm run build pass; Playwright smoke passes where browser execution is allowed.
Test failures must not be hidden. Report unexecuted checks, changed files,
test results and remaining risks. Do not claim GitHub settings are applied
without reading back their effective state.
```

## 10. Sequential feature work prompts

### MVP-02-profile-rewards — profile and rewards pass

```text
Read AGENTS.md, docs/mvp.md, docs/contracts.md and the 1.1 plan. Check branch
and working tree. Implement the profile, rewards and persistence requirements.
Use Context/reducer unless the foundation establishes otherwise; add no state
management dependency. Keep shared schemas in src/types/contracts.ts and update
their consumers, documentation and tests in the same change when necessary.

Create a new local profile with 100 starter stars. Migrate existing profiles
below 100 up to 100 once; preserve higher balances. Persist the active run and
question state.
Award 2 stars once per solved question per run, even after errors/help. Award
10 once when all eight are solved. New explicit runs receive full rewards.
Use run/question reward keys and deduplicate attempt evidence separately.
Validate incoming events against persisted session content. Persist attempt,
progress, reward and deduplication state together immediately. Reload resumes
the same run/order. Implement mastery-v1 separately from the balance.

Complete loading before autosave; runtime-validate and migrate snapshots.
Implement section 6 backup/recovery, blocked storage/quota handling, retry,
export and exclusive writer behavior. Never silently reset corrupt data or
claim failed writes were saved. Report missing interfaces rather than inventing
parallel structures.

Tests: +2 correct; zero/no deduction incorrect; +2 after error/help; duplicate
attempt/reward/completion handling; +10 completion once; incomplete run no bonus;
new run full rewards; exact reload restoration; mastery spacing/deduplication;
corrupt/future/old snapshots, failed writes, backup recovery and second tab.
Run applicable checks and report results; no commit/push/merge without instruction.
```

### MVP-03-picture-selection — learning and game pass

```text
Read AGENTS.md, docs/mvp.md, docs/contracts.md and the 1.1 plan. Check branch
and working tree. Implement animal content, audio, picture selection, learning
flow and related tests, integrating them with the canonical profile contract.
Keep shared schema changes in src/types/contracts.ts and update all consumers,
documentation and tests together.

Author cat, dog, cow, horse; one eight-question mission, each animal twice.
Each question has three distinct animal picture options; vary correct position.
Persisted run seed/order/options must remain stable across reload through the
agreed platform interface. Use local audio and a visible replay button.
Large touch/keyboard cards; friendly incorrect feedback and retry; correct
feedback locks the question and reveals Next. Emit every attempt through the
contract, with help use distinguished from audio replay. Never write stars or
localStorage. Surface missing audio/playback failures in Spanish with retry.
Label placeholders truthfully. Follow the visual/media gate in section 7.

Tests: correct/incorrect choices, repeated taps after solve, audio replay and
failure, next-question transition, all-eight completion and stable resume.
Run applicable checks and report results; no commit/push/merge without instruction.
```

## 11. Sequential integration and follow-on work

Complete and integrate the profile/rewards pass and the learning/game pass in
sequence. Run the full checks when their contracts connect. Do not leave a test
adapter wired into production.

```text
On a feature branch, implement glasses (10), cap (15) and
T-shirt (20), shop states, ownership, equip/unequip and avatar rendering through
the profile layer. Respect one item per category and simultaneous categories.
Test insufficient funds, duplicate purchase, rapid clicks, persistence failure
and reload. Follow the visual gate. Keep to the scope chosen for the task.
```

```text
On a feature branch, complete the four-animal introduction,
play/resume flow, completion page with stars earned in this run, explicit Play
again with a new run ID, and Go to shop. Add a real browser test of the complete
loop and recovery states. Confirm no production test adapter remains. Adding
animals or the matching game is a suggested follow-on, not gated on first-loop
acceptance.
```

## 12. Owner acceptance and release gates

1. New profile: **100** starter stars; existing profiles below 100 are topped
   up to **100** once during schema migration; higher balances are preserved.
2. First question incorrect: **100**.
3. Then correct: **102**.
4. Reload: **102**, same run, solved question locked and same remaining order.
5. Finish all eight: **126** total.
6. Buy cap for 15: **111**.
7. Equip cap, reload: cap stays equipped, **111**.
8. Start a new run and finish: **137**.
9. Buy cap again: rejected with no deduction.
10. Buy one apple: one star deducted, apple inventory increases by one; reload
    preserves both the remaining balance and inventory count.

Also verify abandon/resume, duplicate callbacks and completion events, insufficient funds, simultaneous categories, mastery-v1 cases, audio/image failures, corrupt and unavailable storage, supported migration, future-version rejection, failed purchase save, and second-tab refusal. There must be no false “saved” message. Run lint/typecheck/unit/build/browser checks and record results. The owner reviews responsive screenshots and assets. A child pilot additionally requires final media rights/review and age-appropriate Spanish instructions. Expansion to 12 animals/three missions/matching/six items is a suggested follow-on; the five-subject platform remains a master-plan objective that may be selected by the owner.
