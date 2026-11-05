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

### Dependabot updates

Eight pull requests (#19 to #26) are open. Plan: merge ESLint 10 and the five
GitHub Actions updates one by one (rebase first, watch the deployment after each
one), close TypeScript 7 (the quality check fails) and `@types/node` 26 (does not
match Node 24), and tell Dependabot to ignore major updates of Node types.

### Secret scanning and push protection

Turn on in the repository security settings as soon as the project gets
credentials, API keys or integrations. Free for public repositories. Not needed
while the project has no secrets.

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
