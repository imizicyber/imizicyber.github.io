---
phase: 03-component-architecture-and-visual-redesign
plan: 01
subsystem: ui
tags: [css-tokens, design-system, astro, playwright, accessibility]

# Dependency graph
requires:
  - phase: 01-code-quality-tooling
    provides: ESLint, Prettier, pre-commit hooks, E2E test infrastructure
provides:
  - CSS design tokens (spacing, typography, radius, shadow, z-index) in :root
  - .w-wide container class for wider sections (1200px)
  - @media (prefers-reduced-motion) accessibility block
  - Credentials data file (src/data/credentials.ts) with 6 entries
  - Mobile-visible "Book a Consultation" CTA in Nav (outside hamburger)
  - E2E test stubs for UIUX-02 (CTA visibility) and UIUX-03 (responsive layout)
affects: [03-02, 03-03, 03-04]

# Tech tracking
tech-stack:
  added: []
  patterns: [CSS custom property design tokens, scoped Astro styles for Nav CTA, test.fixme() for deferred E2E stubs]

key-files:
  created:
    - src/data/credentials.ts
    - e2e/cta-visibility.spec.ts
    - e2e/responsive.spec.ts
  modified:
    - src/styles/global.css
    - src/components/Nav.astro

key-decisions:
  - "Design tokens added inside existing :root block — no renames, no removals of existing tokens"
  - "Mobile CTA placed in nav-end outside hamburger menu with 44px min-height touch target"
  - "E2E test stubs use test.fixme() to track without blocking builds"

patterns-established:
  - "Design token naming: --space-{n}, --text-{size}, --radius-{size}, --shadow-{size}, --z-{level}"
  - "Data file pattern: typed const array with as const assertion (matches site.ts pattern)"
  - "E2E stub pattern: test.fixme() for tests that verify end-state of multi-plan redesign"

requirements-completed: [UIUX-01, UIUX-02, UIUX-03]

# Metrics
duration: 4min
completed: 2026-03-17
---

# Phase 3 Plan 01: Design System Foundation Summary

**CSS design tokens (spacing/typography/radius/shadow/z-index), credentials data file, mobile-visible Nav CTA, and E2E test stubs for CTA visibility and responsive layout**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-17T09:20:16Z
- **Completed:** 2026-03-17T09:24:45Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Established complete design token foundation in global.css :root with 7 spacing, 9 typography, 5 radius, 4 shadow, and 7 z-index tokens plus --destructive color
- Created credentials data file with 6 entries (OSCP, PNPT, BlackHat, MSc, BSc, GSoC) ready for CredentialsSection component in Plan 02
- Updated Nav to show "Book a Consultation" on desktop and added mobile-visible CTA outside hamburger menu with 44px touch target
- Created 18 E2E test stubs (9 CTA visibility + 9 responsive layout) marked fixme for activation in Plan 04

## Task Commits

Each task was committed atomically:

1. **Task 1: Add CSS design tokens and .w-wide container to global.css** - `b9d2ecb` (feat)
2. **Task 2: Create credentials data file and update Nav with mobile CTA** - `b65bb6c` (feat)
3. **Task 3: Create E2E test stubs for CTA visibility and responsive layout** - `1755d38` (test)

## Files Created/Modified

- `src/styles/global.css` - Added 33 design tokens in :root, .w-wide container class, prefers-reduced-motion block
- `src/data/credentials.ts` - New file with 6 credential entries for CredentialsSection
- `src/components/Nav.astro` - Changed CTA text to "Book a Consultation", added mobile CTA with scoped styles
- `e2e/cta-visibility.spec.ts` - 9 fixme test stubs for UIUX-02 (3 viewports x 3 pages)
- `e2e/responsive.spec.ts` - 9 fixme test stubs for UIUX-03 (overflow, heading, nav x 3 viewports)

## Decisions Made

- Design tokens added inside existing :root block with no renames or removals of existing tokens
- Mobile CTA placed in nav-end div (alongside ThemeToggle and hamburger) so it is visible without opening mobile menu
- E2E test stubs use test.fixme() instead of test.skip() to track known-incomplete tests that will be activated in Plan 04
- .w-wide container uses same padding pattern (0 24px) as existing .w for consistency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Design tokens are in place for Plans 02-04 to reference via var() in component styles
- Credentials data is exported and ready for import in CredentialsSection (Plan 02)
- Nav CTA is live on all pages via the shared Nav component
- E2E stubs track UIUX-02 and UIUX-03 compliance, ready for activation in Plan 04
- Zero regressions: build passes, all 7 existing E2E tests pass, all 55 unit tests pass

## Self-Check: PASSED

All 5 files verified present. All 3 commit hashes verified in git log.

---

_Phase: 03-component-architecture-and-visual-redesign_
_Completed: 2026-03-17_
