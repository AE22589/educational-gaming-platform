# Backlog of planned later work

This file records work the owner wants to do later, so it is not forgotten. It is
not a commitment to a date. When an item is finished, move it to `docs/decisions.md`
and `docs/setup-status.md` and remove it here. Last reviewed: 2026-11-05.

## Planned

### Automated self-merging pull request flow ("Weg 2")

Goal: bring changes live alone, quickly and with every check, without a second
person. One command, or one request to an assistant, creates a branch, opens a
pull request, waits for the checks and merges automatically when they are green.
The tested build is reused for the deployment, so the whole flow takes about
two to three minutes.

What is needed:

- Turn on "Allow auto-merge" in the repository settings.
- Extend the `main` protection: require a pull request (zero approvals) and the
  checks `repository-check`, `application-check` and `quality-check`. Keep direct
  pushes possible as an emergency exit (administrators not enforced), or decide to
  enforce them.
- A small script or documented routine for assistants, for example `npm run ship`,
  that does branch, push, pull request and auto-merge.
- Test with a probe pull request that the check names in the rules match the
  workflow job names.

Why later: today direct pushes to `main` are fast and all checks already run after
the push. The flow adds value when a broken change on `main` becomes a problem.

### TypeScript 7

Dependabot's TypeScript 7 pull request (#24) was closed on 2026-11-05 because the
quality check failed. Retry when the toolchain supports TypeScript 7; Dependabot
will open a new pull request on its own.

### Secret scanning and push protection

Turn on in the repository security settings as soon as the project gets
credentials, API keys or integrations. Free for public repositories. Not needed
while the project has no secrets.

### Make stranded branch work visible (workflow added, setting pending)

`.github/workflows/side-branch-draft-pr.yml` opens a draft pull request for work pushed
to a side branch after a two-minute grace period. It only works after the owner turns on
the repository setting "Allow GitHub Actions to create and approve pull requests"; until
then the step fails harmlessly. Such a draft has no CI run (a pull request created with
the workflow token does not start other workflows). An optional weekly report of
branches with unmerged work is not built. Added on 2026-11-05 after Feduta's commit sat
unnoticed on `codex/my-work`.

### Home navigation follow-ups

"Contact Us" opens the learning page and "About Chispitas" opens the shop; replace
these with real pages. `contact-dragon.webp` is 1254 px wide for a 64 px icon (885 KB);
a 256 px version would be about 20 KB but needs the owner's approval (no resizing
without it). Branch `codex/my-work` can be deleted once the owner is happy.

## Open decisions

- **Licence:** the repository has none, so all rights are reserved by default.
  Decide on a code licence (for example MIT) and separately on the artwork.
- **Third-party rights of the artwork:** most images are AI-generated from
  owner-supplied references; a single independent assessment is needed before a
  child pilot or wider publication (see `docs/assets.md`).
- **Brand name:** the UI shows CHISPITAS, older decisions say Aventura Animal.
- **Concept image version 1:** `docs/concepts/animal-valley-map-concept.png`
  (3.1 MB, source unclear) can be removed; the owner has not decided.
- **Branch `feature/avatar-3d`:** about 40 commits behind `main`; decide whether to
  drop it or rebase it on the cave and shop that now exist.
- **Documentation check on push:** it only warns. Make it blocking if forgotten
  documentation becomes a problem.
