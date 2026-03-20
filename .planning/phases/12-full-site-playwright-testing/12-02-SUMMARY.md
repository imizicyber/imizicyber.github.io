---
phase: 12-full-site-playwright-testing
plan: 02
subsystem: testing
tags: [playwright, axe-core, wcag, responsive, performance, cls, lcp, a11y]

# Dependency graph
requires:
  - phase: 12-full-site-playwright-testing/01
    provides: base Playwright infrastructure, page-routes and interactions tests
provides:
  - 4-breakpoint responsive tests across 6 representative pages
  - axe-core accessibility scans on all 16 page routes
  - CLS and LCP measurement via PerformanceObserver
  - WCAG AA color-contrast compliance across entire site
affects: [13-ui-ux-audit]

# Tech tracking
tech-stack:
  added: []
  patterns: [PerformanceObserver CLS/LCP measurement, axe-core all-pages loop with warning logging]

key-files:
  created: []
  modified:
    - e2e/responsive.spec.ts
    - e2e/accessibility.spec.ts
    - e2e/performance.spec.ts
    - src/styles/global.css
    - src/pages/company-profile/index.astro
    - src/pages/resources/index.astro
    - src/components/ContactForm.astro

key-decisions:
  - 'WhatsApp button color changed from #25d366 to #1b7a42 for WCAG AA contrast (5.37:1 vs 1.98:1)'
  - 'Dark theme --accdark changed from #059669 to #047857 for nav CTA contrast (4.96:1 vs 3.41:1)'
  - "Honeypot inputs get aria-hidden='true' to prevent axe label violations"
  - 'Company-profile --txt3 changed from #718096 to #647282 for contrast on white bg (4.92:1 vs 4.02:1)'
  - 'Hamburger menu breakpoint uses <= 768 (inclusive) matching CSS max-width: 768px'

patterns-established:
  - 'All-pages axe loop: filter critical+serious as failures, console.warn minor+moderate'
  - 'CLS/LCP via PerformanceObserver inside page.evaluate with buffered: true'
  - 'CTA above-fold test uses nav-cta-mobile on mobile, .btn.btn-fill on desktop'

requirements-completed: [TEST-03, TEST-04, TEST-05]

# Metrics
duration: 40min
completed: 2026-03-20
---

# Phase 12 Plan 02: Responsive, Accessibility, and Performance Test Coverage Summary

**4-breakpoint responsive tests on 6 pages, axe-core scans on all 16 routes with zero critical/serious violations, and CLS/LCP measurement via PerformanceObserver**

## Performance

- **Duration:** 40 min
- **Started:** 2026-03-19T17:04:42Z
- **Completed:** 2026-03-20T11:14:00Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments

- Responsive tests expanded from 3 viewports on homepage to 4 viewports (375, 768, 1024, 1440) across 6 representative pages: 36 test cases covering overflow, hamburger visibility, CTA above-fold, and hero heading
- Accessibility tests expanded from 3 individual pages to all 16 routes via axe-core loop, filtering critical+serious violations as failures with console.warn for minor/moderate
- Performance tests extended with LCP (<2.5s) and CLS (<0.1) measurement via PerformanceObserver on homepage
- Fixed 5 categories of WCAG AA color-contrast violations across the entire site to achieve zero critical/serious axe violations on all pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend responsive.spec.ts with 4 breakpoints and multi-page coverage** - `3eb91e5` (feat) -- note: included in a prior session commit
2. **Task 2: Extend accessibility.spec.ts with all-page axe scans and extend performance.spec.ts with CWV measurement** - `df834a3` (feat)

## Files Created/Modified

- `e2e/responsive.spec.ts` - 4-breakpoint, 6-page responsive layout tests (36 tests)
- `e2e/accessibility.spec.ts` - All-pages axe-core scans plus preserved ARIA/keyboard tests (21 tests)
- `e2e/performance.spec.ts` - Added LCP and CLS via PerformanceObserver (7 tests total)
- `src/styles/global.css` - Darkened --accdark (#047857), WhatsApp button (#1b7a42), WA hover (#166e3a)
- `src/pages/company-profile/index.astro` - Fixed --accent, --txt3, stat-label, company-loc contrast
- `src/pages/resources/index.astro` - Added aria-hidden to honeypot inputs
- `src/pages/tools/security-score/index.astro` - Added aria-hidden to honeypot input
- `src/components/ContactForm.astro` - Added aria-hidden to honeypot input
- `src/components/sections/ContactSection.astro` - Updated WhatsApp button colors
- `src/pages/about/index.astro` - Updated WhatsApp button colors
- `src/pages/case-studies/east-africa-bank-pentest.astro` - Updated WhatsApp button colors
- `src/pages/case-studies/mobile-money-security-assessment.astro` - Updated WhatsApp button colors
- `src/pages/services/penetration-testing/index.astro` - Updated WhatsApp button colors
- `src/pages/services/security-assessments/index.astro` - Updated WhatsApp button colors
- `src/pages/services/custom-tooling/index.astro` - Updated WhatsApp button colors

## Decisions Made

- WhatsApp button color changed from brand green (#25d366) to WCAG-compliant dark green (#1b7a42) -- contrast 5.37:1 vs 1.98:1
- Dark theme --accdark changed from #059669 to #047857 -- nav CTA contrast 4.96:1 vs 3.41:1
- Honeypot inputs get aria-hidden="true" instead of relying on display:none to satisfy axe label rules
- Company-profile --txt3 changed from #718096 to #647282 for small text on white backgrounds (4.92:1)
- Hamburger menu test threshold uses <= 768 (inclusive) to match CSS max-width: 768px media query

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Hamburger menu breakpoint mismatch**

- **Found during:** Task 1 (responsive test verification)
- **Issue:** Test used `< 768` threshold but CSS uses `max-width: 768px` (inclusive), causing tablet test to expect hidden menu
- **Fix:** Changed threshold to `<= 768`
- **Files modified:** e2e/responsive.spec.ts
- **Verification:** All 4 hamburger visibility tests pass
- **Committed in:** 3eb91e5

**2. [Rule 1 - Bug] CTA selector matched hidden nav link instead of hero CTA**

- **Found during:** Task 1 (responsive test verification)
- **Issue:** `a[href*="contact"]` matched nav "Contact" link which is hidden in hamburger on mobile
- **Fix:** Used specific selectors: `.nav-cta-mobile` for mobile, `.btn.btn-fill` for desktop
- **Files modified:** e2e/responsive.spec.ts
- **Verification:** All 4 CTA above-fold tests pass
- **Committed in:** 3eb91e5

**3. [Rule 1 - Bug] Color contrast violations across 16 pages**

- **Found during:** Task 2 (axe-core all-pages scan)
- **Issue:** 5 categories of WCAG AA contrast failures: --accdark (3.41:1), WhatsApp green (1.98:1), company-profile --txt3 (4.02:1), company-profile stat-label (3.19:1), company-profile --accent (3.76:1)
- **Fix:** Darkened all failing colors: --accdark to #047857 (4.96:1), WhatsApp to #1b7a42 (5.37:1), --txt3 to #647282 (4.92:1), stat-label opacity 0.35->0.5, --accent to #047857
- **Files modified:** src/styles/global.css, 7 page files with scoped WhatsApp styles, company-profile
- **Verification:** All 16 pages pass axe-core with zero critical/serious violations
- **Committed in:** df834a3

**4. [Rule 2 - Missing Critical] Honeypot inputs missing aria-hidden**

- **Found during:** Task 2 (axe-core resources page scan)
- **Issue:** display:none honeypot inputs lacked labels, flagged by axe-core as serious violations
- **Fix:** Added aria-hidden="true" to all honeypot inputs across 3 files
- **Files modified:** src/pages/resources/index.astro, src/pages/tools/security-score/index.astro, src/components/ContactForm.astro
- **Verification:** Resources and security-score pages pass axe-core
- **Committed in:** df834a3

---

**Total deviations:** 4 auto-fixed (2 bug fixes, 1 contrast fix, 1 missing critical)
**Impact on plan:** All auto-fixes necessary for correctness and WCAG compliance. The contrast fixes were required by the plan's directive to fix source pages rather than exclude axe rules.

## Issues Encountered

- Task 1 responsive.spec.ts changes were accidentally included in a prior session's commit (3eb91e5, labeled as 12-03). The code is correct and tested; the commit attribution is imprecise.
- eslint no-non-null-assertion rule required using type assertion (`as { y: number; height: number }`) instead of `box!.y` syntax

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 131 Playwright tests pass (36 responsive + 21 accessibility + 7 performance + 67 others)
- Suite runtime: ~30 seconds (well under 2-minute budget)
- Zero critical/serious axe violations on all 16 page routes
- Ready for plan 12-03 (if not already complete) and phase 13

## Self-Check: PASSED

- All key files exist (responsive.spec.ts, accessibility.spec.ts, performance.spec.ts, 12-02-SUMMARY.md)
- All commits verified (3eb91e5, df834a3)
- Content verification: 1024 breakpoint present, PerformanceObserver present, critical+serious filter present

---

_Phase: 12-full-site-playwright-testing_
_Completed: 2026-03-20_
