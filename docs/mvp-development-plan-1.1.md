# Tier-Abenteuer — MVP Development Plan 1.1

28 October 2026 · English revision of the supplied German two-developer start guide

## 1. Purpose and document boundaries

Build one complete small loop: **meet animals → solve tasks → earn stars on every new playthrough → buy items → dress an avatar**. Do not ask Codex to build the whole platform at once.

This is the implementation plan for the MVP. `master-plan.md` records the broader educational gaming platform and future textbook coverage. Future architecture support does not authorize implementing future worlds. The supplied German guide is the scope baseline; the safeguards, mastery rules and reliability requirements below are explicit 1.1 additions. No images are embedded in this plan.

## 2. Binding first scope

- Four animals: **cat, dog, cow, horse**.
- One game: hear an English animal name and select the correct image.
- One mission with eight questions; each animal appears twice.
- A simple avatar; three purchasable items: glasses, cap and T-shirt.
- Star balance, inventory, equipment, learning evidence and local persistence.
- Replay with full new rewards.

Only after this loop passes acceptance may the scope expand to **12 animals, three missions, a matching game and six shop items**.

Excluded: registration, backend, Science World, speech recognition, rooms, pets, full offline operation, runtime AI, analytics and microphone recording. One local profile and one active browser tab are supported. No cross-device synchronization.

UI and brief instructions are **Spanish**; vocabulary and learning audio are **English**. Code, filenames and technical identifiers are English. Use large identifiable animal pictures, large buttons, friendly feedback and no time limit. Audio has a visible play/replay button. Development placeholders must be labelled; child testing requires reviewed, licensed local images and audio.

## 3. Stars, purchases and provisional farming safeguards

| Event | Reward |
|---|---:|
| Question solved correctly | +2 stars |
| Correct after errors or help | +2 stars |
| All eight questions solved | +10 stars once per run |
| Explicitly started new playthrough | Full rewards again |
| Incorrect answer | No reward and no deduction |

A full mission earns **26 stars**. Credit solved questions immediately; stopping early retains credited stars. Completion bonus requires all eight solved questions. There is **no daily cap, replay discount, speed requirement or punishment**.

Distinguish a new playthrough from duplicate delivery. Persist the run ID, question IDs, random seed, order and options; reload never creates a run. Only an explicit Spanish “play again” action after confirmation of an active-run replacement creates a new run. Starting over preserves already earned stars and archives the abandoned run without a completion bonus.

The profile layer validates attempts against the active persisted mission/version/question/options. Reject forged question IDs, invalid choices and attempts for locked questions. Rewards use keys `runId:questionId:solved` and `runId:complete`; attempts have independent stable IDs. Duplicate attempts affect neither evidence nor rewards. Completion is derived from solved questions, never trusted from a game callback. Lock solved cards synchronously and disable controls during submission. Purchases and reward events pass through one serialized profile reducer and durable writer.

Provisional anti-farming measures are content variety, stable randomized order/options per run, deduplication, explicit restarts and separate mastery evidence. Do not silently add caps. Local-only state is editable by the device owner: this prototype cannot prevent deliberate storage editing, automation or clock manipulation. Stars have no monetary value, competitive ranking or external prizes. Revisit the economy after observing play; any change to unlimited full replay rewards requires an explicit product decision and updated tests.

| Item | Category | Price |
|---|---|---:|
| Glasses | eyewear | 10 |
| Cap | headwear | 15 |
| T-shirt | top | 20 |

A purchase checks the current balance and ownership, deducts once and adds ownership in one state transition. No repeat purchases. Equip only owned items; one per category. All three categories can be worn together. Spanish states: buy, already owned, insufficient stars. Equip/unequip and purchases persist.

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

Build subject-neutral contracts now; author only the four-animal English slice. Keep subject, instruction language and target language distinct. Do not hard-code all content as English animal vocabulary.

The supplied school image identifies five second-primary subjects (2026/27):

| Subject ID | Book as supplied | Publisher | ISBN |
|---|---|---|---|
| mathematics | 2PRI MATEMATICAS M.LIG CM ED23 | Santillana | 9788414407639 |
| spanish | 2PRI LENGUA M.LIG CM CAST ED3 | Santillana | 9788414407622 |
| english | LEAD THE WAY 2 Pb | Macmillan | 9781380049957 |
| natural-science | 2PRI NATURAL SCIENCE STD BOOK WM ED23 | Richmond | 9788414408087 |
| social-science | 2PRI SOCIAL SCIENCE STD BK MADR WM ED23 | Richmond | 9788414408254 |

These are transcriptions, not publisher-verified editions or verified unit mappings. Obtain official publisher catalogues, sample pages or tables of contents by ISBN; record exact source URL, access date, edition and confidence. Mark mappings `unverified`, `verified` or `needs-review`. Do not invent chapter alignment or reproduce copyrighted exercises without permission. This investigation belongs to the master-plan backlog and is not a blocker for original animal exercises.

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
| ProfileState | schemaVersion, revision, stars, owned IDs, equipment, learning evidence/policy version, active session, processed event keys, reward ledger |

Use discriminated payloads for vocabulary, numbers, text and concepts, plus an extensible game registry. Validate JSON at runtime, stable reference integrity, option uniqueness and answer membership. Keep textbook metadata independent of exercise assets. Unknown game types fail with a Spanish recovery message. No requirement to implement renderers for all five subjects in the MVP.

## 6. Architecture and persistence

Games emit results; they never mutate balance, inventory or browser storage. Developer 1 owns the profile/reward boundary; Developer 2 can develop against a separate test adapter. Only the profile layer writes persistent application state. React Context plus reducer is sufficient unless the foundation establishes otherwise. Access storage only on the client after hydration.

Use a versioned, runtime-validated local snapshot with a monotonic revision. Persist a complete transition (attempt, progress, reward keys, ledger and balance) in one snapshot write; do not scatter related state across keys. Serialize writes and acknowledge a reward/purchase as saved only after successful persistence. Retain a validated last-known-good backup before replacing a good snapshot. Load and validate before any initial autosave. Store run order and seed to resume exactly.

Catch unavailable storage, quota errors, invalid JSON, validation errors and migration failures. Never silently reset or overwrite corrupt data. Offer retry and raw backup export; explicit reset requires informed confirmation. Validate imports, bound their size, migrate only supported versions and preserve originals. A future schema version opens recovery mode rather than downgrading data. On write failure show Spanish “changes not saved”, preserve pending state in memory, and allow retry/export; block further economic transactions until resolved. Do not claim reload safety for unsaved changes.

The supported product is one writer tab. Use a Web Lock for the profile where supported; if unavailable, use a documented exclusive-session lease and conservative read-only fallback when ownership is uncertain. Detect another tab or revision changes and stop writes with a Spanish explanation. A storage event alone is not a transaction lock. Test forced failures, interruption, reload, backup restoration, old-schema migration, future versions and conflicting tabs. Browsers can evict storage; export is the user-controlled backup. Full offline caching is deferred.

## 7. Visual and audio quality gate

Create a coherent child-friendly visual language: consistent illustration style, palette, spacing, typography, button states and avatar proportions. No emoji substitutes for final animal art. Images must be unambiguous at answer-card size; no English text label giving away a listening answer. Keep semantic accessible names and test with assistive technology; offer a clearly labelled accessible alternative practice mode if needed.

Target 48×48 CSS-pixel controls, visible keyboard focus, touch and keyboard support, readable Spanish text, sufficient contrast (WCAG AA target), feedback beyond colour, reduced-motion support and no flashing/timers. Review phone (360 px), tablet (768 px) and desktop (1280 px) layouts for clipping and scrolling. Prevent layout shifts while media loads. Review screenshots of home, mission, wrong/correct feedback, completion, shop, avatar and recovery states.

Use local, reviewed English pronunciation recordings and a visible repeat button. Handle rejected playback and missing/failed media with retry and an explicit Spanish message. Do not silently substitute unrelated audio or pretend placeholder files exist. Maintain an asset licence/attribution register. No child pilot until both developers review media, Spanish wording and visual consistency.

## 8. Two-developer workflow and enforceable gates

Each developer uses their own GitHub account, local clone and Codex session. Never run two writing sessions in the same folder. One active implementation task per developer initially. The other developer reviews every PR; an author cannot provide their own independent approval.

| Developer 1 — platform/economy | Developer 2 — learning/games |
|---|---|
| Foundation, CI, home/navigation | Animal content and questions |
| Profile, rewards, persistence | Audio, picture selection, mission flow |
| Shop, inventory, avatar | Later matching game and review round |
| Profile provider integration | Game route integration and end-to-end loop |

Developer 1 first creates `chore/MVP-01-foundation`; Developer 2 reviews it. After merge both branch from updated main: `feature/MVP-02-profile-rewards` and `feature/MVP-03-picture-selection`. Shared types, dependencies, root configuration and lockfile changes require coordination before editing. Each developer tests their behavior. Never overwrite the other's work.

```bash
git switch main
git pull --ff-only
git switch -c chore/MVP-01-foundation
# After the foundation PR is reviewed and merged, each developer repeats
# the first two commands, then creates their assigned feature branch.
```

GitHub configuration must be applied and read back: private repository; main default; require PR, one approving review, stale-approval dismissal, approval of the most recent push by another person, resolved conversations and required CI with branch up to date. Block force pushes and deletion; apply to administrators/no routine bypass. Enable squash merges and branch cleanup; disable other merge methods if practical. Configure exact required status names after the first successful runs. Workflows run on all PRs and main pushes, with read-only token permissions and no application secrets. Do not use `pull_request_target` to execute untrusted changes.

Foundation CI must run real lint, TypeScript strict checking, Vitest tests, production build and Playwright smoke tests, using npm ci and committed package-lock.json. Upload browser failure evidence. Checks must not skip silently or use empty scripts. The initial documentation-only repository can run a real repository validation check; that does **not** prove application tests pass. Add the application gate in MVP-01 and make it required before implementation merges.

Verify an unreviewed PR cannot merge and a deliberately failing check blocks merge using a temporary safe test PR once two accounts and enforcement are available. A policy file, AGENTS.md, PR template or configured-but-unenforced ruleset is not branch protection. If the GitHub plan or permissions prevent enforcement, record the limitation and treat team readiness as blocked; do not silently accept manual convention as equivalent.

## 9. Copy-ready foundation Codex prompt

```text
We are developing Tier-Abenteuer, a web learning application for Spanish-speaking
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

## 10. Copy-ready parallel Codex prompts

### Developer 1 — feature/MVP-02-profile-rewards

```text
Read AGENTS.md, docs/mvp.md, docs/contracts.md and the 1.1 plan. Check branch
and working tree. Implement only src/features/profile/, src/features/rewards/
and their tests. Use Context/reducer unless the foundation specifies otherwise;
add no state management dependency. Do not edit shared types or other features.

Create a local profile with 0 stars. Persist the active run and question state.
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
parallel structures. Coordinate any required contract change before editing.

Tests: +2 correct; zero/no deduction incorrect; +2 after error/help; duplicate
attempt/reward/completion handling; +10 completion once; incomplete run no bonus;
new run full rewards; exact reload restoration; mastery spacing/deduplication;
corrupt/future/old snapshots, failed writes, backup recovery and second tab.
Run applicable checks and report results; no commit/push/merge without instruction.
```

### Developer 2 — feature/MVP-03-picture-selection

```text
Read AGENTS.md, docs/mvp.md, docs/contracts.md and the 1.1 plan. Check branch
and working tree. Edit only src/content/animals/, src/games/picture-selection/,
src/features/learning/, public/animals/, public/audio/ and related tests.
Do not change shared types, platform configuration or profile persistence.

Author cat, dog, cow, horse; one eight-question mission, each animal twice.
Each question has three distinct animal picture options; vary correct position.
Persisted run seed/order/options must remain stable across reload through the
agreed platform interface. Use local audio and a visible replay button.
Large touch/keyboard cards; friendly incorrect feedback and retry; correct
feedback locks the question and reveals Next. Emit every attempt through the
contract, with help use distinguished from audio replay. Never write stars or
localStorage. Surface missing audio/playback failures in Spanish with retry.
Label placeholders truthfully. Follow the visual/media gate in section 7.

Develop with a separate test adapter, excluded from production wiring.
Tests: correct/incorrect choices, repeated taps after solve, audio replay and
failure, next-question transition, all-eight completion and stable resume.
Run applicable checks and report results; no commit/push/merge without instruction.
```

## 11. Integration and follow-on prompts

Merge only reviewed, passing work. Developer 2 owns the game route; Developer 1 owns profile-provider wiring. Remove the test adapter from production.

```text
Developer 1: On a new feature branch, implement glasses (10), cap (15) and
T-shirt (20), shop states, ownership, equip/unequip and avatar rendering through
the profile layer. Respect one item per category and simultaneous categories.
Test insufficient funds, duplicate purchase, rapid clicks, persistence failure
and reload. Follow the visual gate. Do not expand product scope.
```

```text
Developer 2: On a new feature branch, complete the four-animal introduction,
play/resume flow, completion page with stars earned in this run, explicit Play
again with a new run ID, and Go to shop. Add a real browser test of the complete
loop and recovery states. Confirm no production test adapter remains. Do not add
animals or the matching game until the first integrated acceptance passes.
```

## 12. Joint acceptance and release gates

1. Empty profile: **0** stars.
2. First question incorrect: **0**.
3. Then correct: **2**.
4. Reload: **2**, same run, solved question locked and same remaining order.
5. Finish all eight: **26** total.
6. Buy cap for 15: **11**.
7. Equip cap, reload: cap stays equipped, **11**.
8. Start a new run and finish: **37**.
9. Buy cap again: rejected with no deduction.

Also verify abandon/resume, duplicate callbacks and completion events, insufficient funds, simultaneous categories, mastery-v1 cases, audio/image failures, corrupt and unavailable storage, supported migration, future-version rejection, failed purchase save, and second-tab refusal. There must be no false “saved” message. Run lint/typecheck/unit/build/browser checks and record results. Both developers review responsive screenshots and assets. A child pilot additionally requires final media rights/review and age-appropriate Spanish instructions. Expansion to 12 animals/three missions/matching/six items is a separate reviewed milestone; the five-subject platform remains a master-plan objective.
