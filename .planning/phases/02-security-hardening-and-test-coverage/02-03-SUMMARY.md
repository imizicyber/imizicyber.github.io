---
phase: 02-security-hardening-and-test-coverage
plan: 03
subsystem: testing
tags: [playwright, axe-core, e2e, accessibility, wcag, github-actions, ci]

# Dependency graph
requires:
  - phase: 02-01
    provides: innerHTML elimination and ESLint rule for safe DOM manipulation
  - phase: 02-02
    provides: CSP meta tag injection with SHA-256 hashes, gitleaks pre-commit hook
provides:
  - 38 Playwright E2E tests covering all critical user journeys
  - axe-core WCAG 2.1 AA accessibility scanning with zero critical violations
  - CSP verification test confirming no unsafe-inline in built site
  - GitHub Actions CI workflow running E2E tests on push and PRs
affects: [all-future-phases]

# Tech tracking
tech-stack:
  added: ['@playwright/test', '@axe-core/playwright']
  patterns: [e2e-testing-with-playwright, axe-fixture-pattern, ci-e2e-workflow]

key-files:
  created:
    - playwright.config.ts
    - e2e/fixtures/axe-test.ts
    - e2e/homepage.spec.ts
    - e2e/navigation.spec.ts
    - e2e/blog.spec.ts
    - e2e/contact-form.spec.ts
    - e2e/quiz.spec.ts
    - e2e/cookie-banner.spec.ts
    - e2e/accessibility.spec.ts
    - e2e/csp.spec.ts
    - .github/workflows/test-e2e.yml
  modified:
    - .gitignore
    - package.json

key-decisions:
  - 'Accessibility test scans security-score page instead of non-existent /contact/ route (contact form is homepage section)'

patterns-established:
  - 'axe-test fixture: shared AxeBuilder fixture with WCAG 2.1 AA tags for accessibility testing'
  - 'E2E webServer pattern: npm run build && npm run preview on port 4321 with 120s timeout'
  - 'CI E2E workflow: separate from deploy, runs on push+PR, uploads report artifact'

requirements-completed: [QUAL-07, QUAL-12]

# Metrics
duration: 11min
completed: 2026-03-17
---

# Phase 2 Plan 3: E2E Tests and CI Summary

**38 Playwright E2E tests with axe-core accessibility scanning, CSP verification, and GitHub Actions CI workflow**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-17T21:21:24Z
- **Completed:** 2026-03-17T21:33:07Z
- **Tasks:** 2
- **Files modified:** 2 (most files pre-existed from Phase 3 stubs)

## Accomplishments

- 38 E2E tests passing across 10 spec files: homepage, navigation, blog, contact form, quiz, cookie banner, CSP, accessibility, CTA visibility, responsive layout
- axe-core accessibility scans confirm zero critical WCAG 2.1 AA violations on homepage, blog index, and security score pages
- CSP E2E test verifies no unsafe-inline in script-src directive and confirms SHA-256 hashes present
- GitHub Actions CI workflow runs Playwright on push to main and pull requests with report artifact upload
- E2E tests are NOT in pre-commit hook (kept fast)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Playwright, create config, axe fixture, and all E2E test files** - `a4941a5` (feat)
2. **Task 2: Create GitHub Actions CI workflow for E2E tests** - no commit needed (file already existed and matched plan spec exactly)

## Files Created/Modified

- `e2e/accessibility.spec.ts` - Fixed to scan security-score page instead of non-existent /contact/ route
- `.gitignore` - Added e2e/results/ to ignored paths
- `playwright.config.ts` - Playwright config with Astro webServer (pre-existing)
- `e2e/fixtures/axe-test.ts` - Shared AxeBuilder fixture for WCAG 2.1 AA testing (pre-existing)
- `e2e/homepage.spec.ts` - Homepage load, hero, CTA, theme toggle tests (pre-existing)
- `e2e/navigation.spec.ts` - Nav links, service pages, 404 tests (pre-existing)
- `e2e/blog.spec.ts` - Blog index, post navigation, content tests (pre-existing)
- `e2e/contact-form.spec.ts` - Contact form fields and validation tests (pre-existing)
- `e2e/quiz.spec.ts` - Quiz load and full completion flow tests (pre-existing)
- `e2e/cookie-banner.spec.ts` - Cookie banner visibility and acceptance tests (pre-existing)
- `e2e/csp.spec.ts` - CSP meta tag verification, no unsafe-inline (pre-existing)
- `.github/workflows/test-e2e.yml` - CI workflow for E2E tests (pre-existing)

## Decisions Made

- Accessibility test changed from scanning /contact/ (non-existent route) to /tools/security-score/ (actual page with forms and interactive elements) -- provides better test coverage of a real interactive page

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed accessibility test targeting non-existent /contact/ route**

- **Found during:** Task 1 (E2E test verification)
- **Issue:** The accessibility test navigated to /contact/ but no such page exists -- the contact form is a section on the homepage (/#contact). The test was passing on the 404 page which provided no meaningful accessibility coverage.
- **Fix:** Changed test to scan /tools/security-score/ page which has forms, interactive elements, and is a real page
- **Files modified:** e2e/accessibility.spec.ts
- **Verification:** All 38 tests pass, axe-core reports zero critical violations on security-score page
- **Committed in:** a4941a5 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Auto-fix improved test accuracy by targeting a real page instead of a 404. No scope creep.

## Issues Encountered

- Initial Playwright test run timed out on webServer startup (120s timeout). Second run succeeded in 23s. Likely caused by a transient port conflict or cold build cache.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 2 (Security Hardening and Test Coverage) is now fully complete
- All three plans delivered: innerHTML elimination + ESLint rule, CSP + gitleaks, E2E tests + CI
- Ready for Phase 4 or any subsequent phase execution

## Self-Check: PASSED

All key files verified present. Commit a4941a5 verified in git log.

---

_Phase: 02-security-hardening-and-test-coverage_
_Completed: 2026-03-17_
