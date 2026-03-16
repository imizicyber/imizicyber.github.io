---
phase: 01-code-quality-tooling
plan: 02
subsystem: ui
tags: [typescript, astro, module-extraction, theme-toggle, cookie-consent, quiz, pdf-generation]

# Dependency graph
requires:
  - phase: 01-code-quality-tooling (plan 01)
    provides: ESLint + Prettier + TypeScript strict config
provides:
  - src/scripts/theme.ts — theme toggle logic with localStorage persistence
  - src/scripts/cookie-consent.ts — cookie consent state management with GA loading
  - src/scripts/quiz/data.ts — typed quiz questions and scoring bands
  - src/scripts/quiz/scoring.ts — score calculation and band lookup
  - src/scripts/quiz/ui.ts — quiz DOM rendering and step navigation
  - src/scripts/quiz/pdf.ts — jsPDF loading and PDF generation
  - src/scripts/resources.ts — resources page logic with PDF generation
affects: [01-code-quality-tooling plan 03, phase-02 CSP]

# Tech tracking
tech-stack:
  added: []
  patterns: [astro-module-script-import, typed-module-extraction, shared-jspdf-loader]

key-files:
  created:
    - src/scripts/theme.ts
    - src/scripts/cookie-consent.ts
    - src/scripts/quiz/data.ts
    - src/scripts/quiz/scoring.ts
    - src/scripts/quiz/ui.ts
    - src/scripts/quiz/pdf.ts
    - src/scripts/resources.ts
  modified:
    - src/components/ThemeToggle.astro
    - src/components/CookieBanner.astro
    - src/pages/tools/security-score/index.astro
    - src/pages/resources/index.astro

key-decisions:
  - 'Shared loadJsPDF in quiz/pdf.ts imported by resources.ts (eliminates duplication)'
  - 'Resources initResources() reads onclick/onsubmit attrs from HTML then rebinds via addEventListener (preserves existing HTML structure)'
  - 'Quiz ui.ts binds calcBtn via addEventListener instead of inline onclick (removes global function dependency)'

patterns-established:
  - 'Module extraction pattern: create typed TS module in src/scripts/, import in Astro component via <script> tag'
  - 'Cookie consent imports ANALYTICS from @/data/site instead of using define:vars (enables module bundling)'

requirements-completed: [QUAL-01, QUAL-08]

# Metrics
duration: 28min
completed: 2026-03-16
---

# Phase 1 Plan 2: Inline Script Extraction Summary

**7 typed TypeScript modules extracted from inline scripts; theme toggle bug fixed with addEventListener binding; jsPDF loader shared across quiz and resources**

## Performance

- **Duration:** 28 min
- **Started:** 2026-03-16T15:15:51Z
- **Completed:** 2026-03-16T15:43:51Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Fixed broken theme toggle (QUAL-01): replaced undefined onclick="toggleTheme()" with module import and addEventListener binding
- Extracted all inline scripts from 4 .astro files into 7 typed TypeScript modules in src/scripts/
- Replaced CookieBanner define:vars pattern with direct ANALYTICS import from @/data/site
- Shared loadJsPDF CDN fallback chain between quiz and resources (eliminated code duplication)
- Build passes with all module imports resolving correctly

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract theme and cookie-consent scripts, fix theme toggle** - `534f908` (feat)
2. **Task 2: Extract security-score quiz and resources page scripts** - `b7a8c65` (feat)

## Files Created/Modified

- `src/scripts/theme.ts` - Theme toggle with getStoredTheme, setTheme, toggleTheme
- `src/scripts/cookie-consent.ts` - Cookie consent state + GA loading via ANALYTICS import
- `src/scripts/quiz/data.ts` - 10 Question objects and 5 ScoreBand objects with TypeScript interfaces
- `src/scripts/quiz/scoring.ts` - calculateScore, getBand, getAnswersFromDOM
- `src/scripts/quiz/ui.ts` - initQuiz with step navigation, scoring display, submitGate form
- `src/scripts/quiz/pdf.ts` - loadJsPDF CDN fallback, generatePDF, fallbackHTML, esc, JsPDFInstance interface
- `src/scripts/resources.ts` - initResources with RESOURCE_DATA, generateResourcePDF, form handling
- `src/components/ThemeToggle.astro` - Replaced onclick with module script import
- `src/components/CookieBanner.astro` - Replaced is:inline define:vars with module script import
- `src/pages/tools/security-score/index.astro` - Replaced 327-line inline script with 3-line module import
- `src/pages/resources/index.astro` - Replaced 162-line inline script with 3-line module import

## Decisions Made

- Shared loadJsPDF in quiz/pdf.ts imported by resources.ts to eliminate duplication
- Resources initResources() reads existing onclick/onsubmit attributes from HTML and rebinds via addEventListener to preserve HTML structure without edits
- Used ANALYTICS.formspreeUrl from @/data/site instead of hardcoded URL in quiz submitGate
- Removed unused ANALYTICS import from page frontmatter after script extraction

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Removed unused ANALYTICS imports from page frontmatter**

- **Found during:** Task 2 (quiz and resources extraction)
- **Issue:** After extracting inline scripts, ANALYTICS import in page frontmatter became unused (would cause lint warnings)
- **Fix:** Changed `import { SITE, ANALYTICS }` to `import { SITE }` in both pages
- **Files modified:** src/pages/tools/security-score/index.astro, src/pages/resources/index.astro
- **Verification:** Build passes, no unused imports
- **Committed in:** b7a8c65 (Task 2 commit)

**2. [Rule 2 - Missing Critical] Removed inline onclick/onsubmit from security-score HTML**

- **Found during:** Task 2
- **Issue:** Calculate button had onclick="calculateScore()" and gate form had onsubmit="submitGate(event)" referencing globals that no longer exist after module extraction
- **Fix:** Removed inline handlers; initQuiz() binds via addEventListener on calc-btn and gate-form
- **Files modified:** src/pages/tools/security-score/index.astro
- **Verification:** Build passes; handlers bound in initQuiz()
- **Committed in:** b7a8c65 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 missing critical)
**Impact on plan:** Both auto-fixes necessary for correctness after extraction. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All client-side scripts are now in typed, importable modules ready for testing in Plan 01-03
- Remaining inline scripts (company-profile, index.astro) are outside this plan's scope
- BaseLayout FOUC prevention script correctly preserved as inline

---

_Phase: 01-code-quality-tooling_
_Completed: 2026-03-16_
