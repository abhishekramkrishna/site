# Site standards (mandatory)

Personal site and blog for Abhishek Ramkrishna. Astro, static, hosted on GitHub Pages. **This repository is public.**

These rules apply to every change, from a human, Claude or any other agent. They are not optional, and nobody may
disable, skip or work around them: no direct pushes to `main`, no merging on red or pending checks, no skipping or
weakening checks or tests to get a green build, no force-pushes to `main`.

## 1. Issue first
- Every change starts with a GitHub issue that says **why**, **what** and has **acceptance criteria**. Use the issue templates.
- Work happens on a branch named `<issue-number>-short-name`, for example `12-add-newsletter-form`.

## 2. One PR per issue, with a clear description
- The PR body follows `.github/pull_request_template.md`: `Closes #N`, what changed, why, how it was validated,
  screenshots for visual changes, risk and rollback.
- Keep PRs small and focused on their issue. Unrelated fixes get their own issue and PR.
- Commit messages say what changed and why.

## 3. Validation rubric (all must pass before merge)
Run `npm run validate` locally before opening or updating a PR. CI runs the same checks on every PR:

| Check | Command | Fails when |
| --- | --- | --- |
| Repo hygiene | `npm run check:repo` + gitleaks | a draft, private note, `.env` or secret is tracked |
| Type check | `npm run check` | any `astro check` error or warning |
| Build | `npm run build` | the production build fails |
| Build verification | `npm run verify` | a required page is missing, SEO tags are missing, a page has ≠1 `<h1>`, an internal link is broken, draft content is in the output, RSS is malformed; also run under a `/site` sub-path |
| Vulnerabilities | `npm run audit`, dependency review, CodeQL | any high/critical npm advisory, a new dependency with a moderate+ advisory, or a CodeQL alert |
| Regression tests | `npm run test:e2e` | console errors, failed requests, horizontal overflow, broken header/nav/social links, hero console not working, reduced-motion or dark mode broken, feeds missing, 404 broken (desktop 1440px and mobile 390px) |

Rules for the rubric:
- **No regressions.** A change that breaks an existing test is fixed, not merged. Tests are never deleted, skipped
  (`test.skip`, `.only`) or loosened to make a PR pass. If behaviour intentionally changes, the test is updated in the
  same PR and the PR says why.
- **New behaviour gets a test** in `tests/` or a check in `scripts/verify-build.mjs`.
- **Visual changes include screenshots** (desktop and mobile, plus dark mode if styles changed).
- **Zero known vulnerabilities.** Do not merge with an open high or critical advisory; upgrade or replace the dependency.

## 4. Merge gate
- Every change reaches `main` through a PR. No direct pushes to `main`.
- A PR is merged only when every CI job (Repo hygiene; Type check, build and verify; Vulnerability scan; CodeQL;
  Browser regression tests) is green on its latest commit, the branch is up to date with `main`, and every review
  conversation is resolved. Claude merges PRs on the owner's behalf only under these conditions; a red or pending
  check means no merge, with no exceptions and no admin override.
- Merges use squash or a merge commit that references the issue; history on `main` is never rewritten.
- Publishing the live site (the **Deploy site** workflow) is a separate, manual step and happens only with the owner's go-ahead.

## 5. Privacy (public repo)
- Unpublished drafts live in `src/content/blog/drafts/` (git-ignored) or outside the repo. Never commit them.
- No strategy notes, plans, watchlists, personal contact details or secrets in this repo, its issues or its PRs.
- Commits use the GitHub no-reply email.

## Project map
- `src/consts.ts`: name, role, links, topics, the header "now" line
- `src/pages/`: routes (home, about, blog, tags, RSS, robots, 404)
- `src/components/`: layout pieces, `HeroConsole`, `diagrams/` (inline SVG, usable in MDX posts via `Figure`)
- `src/content/blog/`: published posts (`.md` / `.mdx`)
- `scripts/`: `new-post.mjs`, `verify-build.mjs`, `check-repo.mjs`
- `tests/`: Playwright regression tests
- `.github/workflows/ci.yml`: the PR gate. `deploy.yml`: manual publish.

## Commands
```bash
npm ci                # install from the lockfile
npm run dev           # local preview with drafts at http://localhost:4321
npm run validate      # everything CI runs
npm run new "Title"   # new private draft
```
