---
phase: 12-full-site-playwright-testing
plan: 03
subsystem: testing
tags: [lighthouse, lhci, performance-budgets, ci, github-actions, cwv]

# Dependency graph
requires:
  - phase: 04-performance-seo
    provides: optimized build output in dist/ with performance-tuned assets
provides:
  - Lighthouse CI config with LCP/CLS/TBT performance budgets
  - GitHub Actions workflow running lhci autorun on push/PR
  - npm test:lighthouse script for local runs
affects: [ci-cd, performance-monitoring]

# Tech tracking
tech-stack:
  added: ['@lhci/cli@0.15.1']
  patterns: [lighthouse-ci-budgets, separate-ci-workflows]

key-files:
  created:
    - lighthouserc.json
    - .github/workflows/lighthouse.yml
  modified:
    - package.json

key-decisions:
  - 'TBT at 200ms used as lab proxy for FID/INP responsiveness (FID requires real user interaction)'
  - 'categories:performance as warn not error because CI Lighthouse scores fluctuate; hard metrics (LCP, CLS, TBT) are errors'
  - 'temporary-public-storage upload target works without GitHub App token setup'
  - 'Separate workflow from E2E tests to avoid impacting test suite runtime budget'

patterns-established:
  - 'Lighthouse CI budget pattern: hard error on Web Vitals metrics, warn on category scores'
  - 'Separate CI workflow per concern: E2E tests, Lighthouse perf, deploy'

requirements-completed: [TEST-05]

# Metrics
duration: 2min
completed: 2026-03-19
---

# Phase 12 Plan 03: Lighthouse CI Performance Budgets Summary

**Lighthouse CI with LCP < 2.5s, CLS < 0.1, TBT < 200ms budgets on 5 representative pages via separate GitHub Actions workflow**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-19T17:04:42Z
- **Completed:** 2026-03-19T17:07:33Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Installed @lhci/cli and created lighthouserc.json with Core Web Vitals performance budgets
- Created GitHub Actions Lighthouse CI workflow separate from E2E tests
- Added test:lighthouse npm script for local execution

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @lhci/cli and create lighthouserc.json configuration** - `ea13b42` (feat)
2. **Task 2: Create GitHub Actions Lighthouse CI workflow** - `3eb91e5` (feat)

## Files Created/Modified

- `lighthouserc.json` - Lighthouse CI config with collect, assert, and upload sections defining performance budgets
- `.github/workflows/lighthouse.yml` - GitHub Actions workflow that builds site and runs lhci autorun
- `package.json` - Added @lhci/cli devDependency and test:lighthouse script

## Decisions Made

- Used `total-blocking-time` at 200ms as lab proxy for responsiveness (FID/INP require real user interaction, TBT is the Lighthouse lab equivalent)
- Set `categories:performance` as `warn` not `error` because CI Lighthouse scores fluctuate; hard Web Vital metrics (LCP, CLS, TBT) remain `error`
- Set `categories:accessibility` as `error` at minScore 0.9 for strict a11y enforcement
- Used `temporary-public-storage` as upload target so the workflow works without configuring LHCI_GITHUB_APP_TOKEN
- Created a separate workflow from E2E tests so Lighthouse scoring does not count against the Playwright suite 2-minute runtime budget
- Used `npx @lhci/cli autorun` instead of global install to ensure the version from devDependencies is used

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None required for basic operation. Optionally, the repository owner can install the [Lighthouse CI GitHub App](https://github.com/apps/lighthouse-ci) and set `LHCI_GITHUB_APP_TOKEN` as a repository secret to get PR status check annotations.

## Next Phase Readiness

- Lighthouse CI infrastructure complete; will run automatically on push/PR to main
- Performance budgets enforced: LCP < 2.5s, CLS < 0.1, TBT < 200ms
- Phase 12 (testing) plans all complete

## Self-Check: PASSED

All files verified present. All commit hashes verified in git log.

---

_Phase: 12-full-site-playwright-testing_
_Completed: 2026-03-19_
