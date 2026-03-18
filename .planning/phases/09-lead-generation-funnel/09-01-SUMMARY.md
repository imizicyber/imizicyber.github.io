---
phase: 09-lead-generation-funnel
plan: 01
subsystem: analytics
tags: [jspdf, ga4, tracking, pdf-generation]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: quiz PDF generation and resource download scripts
  - phase: 05-analytics
    provides: trackEvent function and GA4 integration
provides:
  - Local jsPDF bundling via npm (no CDN dependency)
  - GA4 quiz_complete event on quiz result display
  - GA4 quiz_pdf_download event on PDF generation
  - GA4 resource_download event on resource downloads
affects: [09-lead-generation-funnel]

# Tech tracking
tech-stack:
  added: [jspdf@npm]
  patterns: [synchronous-pdf-generation, ga4-conversion-tracking]

key-files:
  created: []
  modified:
    - src/scripts/quiz/pdf.ts
    - src/scripts/quiz/ui.ts
    - src/scripts/resources.ts
    - src/scripts/analytics.ts
    - package.json

key-decisions:
  - "jsPDF setFont(undefined, 'bold') calls cast via `undefined as unknown as string` for TypeScript compatibility with npm package types"
  - 'Resource download submitResource changed from async loadJsPDF().then() to synchronous try/catch since jsPDF is now bundled'

patterns-established:
  - 'Synchronous PDF generation: new jsPDF() directly instead of async CDN loading'
  - 'GA4 event tracking: trackEvent calls placed after user-visible success state changes'

requirements-completed: [LEAD-03, LEAD-05, LEAD-06]

# Metrics
duration: 6min
completed: 2026-03-18
---

# Phase 9 Plan 1: jsPDF Local Bundle and GA4 Conversion Events Summary

**Bundled jsPDF from npm replacing CDN script injection, wired GA4 quiz_complete/quiz_pdf_download/resource_download events**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-18T05:12:13Z
- **Completed:** 2026-03-18T05:18:13Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Replaced CDN-based jsPDF loading with npm package import (eliminates external dependency, CSP-compliant)
- Added GA4 quiz_complete event with score and band parameters when quiz results display
- Added GA4 quiz_pdf_download event when PDF is successfully generated
- Added GA4 resource_download event with document name on both PDF and HTML fallback paths
- Removed ANLT-03 TODO from analytics.ts (now implemented)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install jsPDF and replace CDN loading with local import** - `fe6870c` (feat)
2. **Task 2: Wire GA4 events for quiz completion and resource downloads** - `8e09ab1` (feat)

## Files Created/Modified

- `package.json` - Added jspdf as dependency
- `src/scripts/quiz/pdf.ts` - Replaced CDN loading with ES module import, removed JsPDFInstance interface and window.jspdf global
- `src/scripts/quiz/ui.ts` - Added trackEvent calls for quiz_complete and quiz_pdf_download, changed to synchronous PDF generation
- `src/scripts/resources.ts` - Added trackEvent for resource_download, replaced async CDN loading with synchronous jsPDF import
- `src/scripts/analytics.ts` - Removed ANLT-03 TODO comment

## Decisions Made

- Used `undefined as unknown as string` cast for jsPDF setFont calls where the npm package types require string but the API accepts undefined to mean "keep current font family"
- Changed submitResource and submitGate from async loadJsPDF().then() pattern to synchronous try/catch since jsPDF is now bundled locally

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- GA4 conversion events are live and will fire once cookie consent is accepted
- PDF generation is now fully self-contained with no external dependencies
- Ready for Phase 9 Plan 2 (contact form and CTA enhancements)

---

_Phase: 09-lead-generation-funnel_
_Completed: 2026-03-18_
