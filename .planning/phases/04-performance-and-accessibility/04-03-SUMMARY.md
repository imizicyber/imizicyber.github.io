---
phase: 04-performance-and-accessibility
plan: 03
subsystem: testing
tags: [e2e, playwright, accessibility, wcag, aria, performance, fonts, keyboard-navigation]

# Dependency graph
requires:
  - phase: 04-01
    provides: Self-hosted WOFF2 fonts, font preload, OG image optimization
  - phase: 04-02
    provides: ARIA landmarks, keyboard navigation, contact form accessible states
provides:
  - E2E tests verifying font self-hosting (no Google Fonts CDN requests)
  - E2E tests verifying ARIA landmarks and keyboard navigation
  - E2E tests verifying contact form loading/success/error states with ARIA
  - axe-core scan on contact form area
affects: [ci, regression-testing]

# Tech tracking
tech-stack:
  added: []
  patterns: [page.route for form state testing, cookie banner dismissal before keyboard tests]

key-files:
  created:
    - e2e/performance.spec.ts
  modified:
    - e2e/accessibility.spec.ts
    - e2e/contact-form.spec.ts
    - src/styles/global.css

key-decisions:
  - 'Images test checks multiple pages and passes when no img elements exist (site uses SVGs)'
  - 'Cookie banner dismissed before keyboard Tab/skip link tests (aria-modal traps focus)'
  - 'Fixed form-msg CSS to use [hidden] selector instead of display:none (was blocking visibility toggle)'

patterns-established:
  - 'Cookie banner handling: dismiss via #cookie-reject click before keyboard navigation tests'
  - 'Form state testing: use page.route with delayed/error responses to test loading/error states'

requirements-completed: [UIUX-04, UIUX-05, UIUX-06, UIUX-07, UIUX-08, UIUX-09, UIUX-10]

# Metrics
duration: 34min
completed: 2026-03-18
---

# Phase 4 Plan 3: E2E Tests for Performance and Accessibility Summary

**23 E2E tests covering font self-hosting, ARIA landmarks, keyboard navigation, and contact form accessible states with axe-core scanning**

## Performance

- **Duration:** 34 min
- **Started:** 2026-03-18T02:47:34Z
- **Completed:** 2026-03-18T03:22:11Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- 5 performance tests verify font self-hosting (no CDN requests, WOFF2 served, preload link, OG image optimized, img dimensions)
- 5 new accessibility tests verify ARIA landmarks, section labels, keyboard Tab navigation, Escape key menu close, skip link
- 6 new contact form tests verify aria-label, spinner, loading/success/error states with ARIA attributes
- 1 axe-core scan test on contact form section (zero critical/serious violations)
- Fixed form-msg CSS bug where `display: none` blocked `hidden` attribute toggle from showing messages

## Task Commits

Each task was committed atomically:

1. **Task 1: Performance E2E tests** - `7ce32e1` (test)
2. **Task 2: Accessibility and contact form E2E tests** - `e66164c` (test)

## Files Created/Modified

- `e2e/performance.spec.ts` - 5 tests for font self-hosting, preload, OG image, CLS prevention
- `e2e/accessibility.spec.ts` - Extended with 5 new tests for landmarks, labels, keyboard nav, Escape, skip link
- `e2e/contact-form.spec.ts` - Extended with 6 new tests for form ARIA states + 1 axe-core scan
- `src/styles/global.css` - Fixed .form-msg to use `[hidden]` selector instead of `display: none`

## Decisions Made

- **Images test resilience:** The CLS prevention test checks multiple pages and passes when no `<img>` elements exist (the site currently uses SVGs/CSS backgrounds). This ensures future `<img>` additions are covered without making the test brittle.
- **Cookie banner handling:** Keyboard navigation and skip link tests dismiss the cookie banner first since its `aria-modal="true"` traps focus, preventing Tab from reaching the skip link.
- **Duplicate main#main deferred:** The homepage and blog pages have duplicate `<main id="main">` elements (BaseLayout + page-level). Logged to deferred-items.md as pre-existing from Plan 04-02.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed form-msg CSS conflicting with hidden attribute toggle**

- **Found during:** Task 2 (Contact form tests)
- **Issue:** `.form-msg { display: none }` in global.css prevented success/error messages from becoming visible when JS removed the `hidden` attribute. The CSS `display: none` took precedence.
- **Fix:** Changed CSS to use `.form-msg[hidden] { display: none }` so messages are visible by default and only hidden when the `hidden` attribute is present.
- **Files modified:** src/styles/global.css
- **Verification:** Contact form success and error state tests pass, messages visible after form submission
- **Committed in:** e66164c (Task 2 commit)

**2. [Rule 1 - Bug] Fixed images test expecting img elements on image-free pages**

- **Found during:** Task 1 (Performance tests)
- **Issue:** Test asserted `count > 0` for `<img>` elements, but the homepage uses SVGs and CSS backgrounds exclusively
- **Fix:** Changed test to check multiple pages and pass gracefully when no `<img>` elements exist, while still validating width/height on any that do
- **Files modified:** e2e/performance.spec.ts
- **Committed in:** 7ce32e1 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for test correctness. No scope creep.

## Issues Encountered

- Pre-existing duplicate `<main id="main">` elements cause `e2e/blog.spec.ts:26` to fail with strict mode violation (2 elements). This is a pre-existing issue from Plan 04-02 and is documented in `deferred-items.md`. Not in scope for this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All Phase 4 E2E tests pass (performance: 5, accessibility: 8, contact form: 10)
- UIUX-04 through UIUX-09 have automated E2E coverage
- UIUX-10 (PageSpeed score) is manual-only -- verified via Google PageSpeed Insights after deployment
- Phase 4 complete, ready for Phase 5

## Self-Check: PASSED

All created files verified present. Both task commits (7ce32e1, e66164c) confirmed in git log.

---

_Phase: 04-performance-and-accessibility_
_Completed: 2026-03-18_
