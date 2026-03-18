---
phase: 07-service-pages-and-content-quality
plan: 01
subsystem: ui
tags: [astro, service-pages, schema-org, seo, compliance]

# Dependency graph
requires:
  - phase: 06-case-studies-and-about
    provides: service page template pattern (penetration-testing)
provides:
  - Security Assessments service page at /services/security-assessments/
  - Custom Tooling service page at /services/custom-tooling/
  - Updated homepage ServicesSection with 4 flagship + secondary training
affects: [07-02, 07-03, sitemap, navigation]

# Tech tracking
tech-stack:
  added: []
  patterns: [service-page-template reused for assessments and tooling]

key-files:
  created:
    - src/pages/services/security-assessments/index.astro
    - src/pages/services/custom-tooling/index.astro
  modified:
    - src/components/sections/ServicesSection.astro

key-decisions:
  - 'Security Assessments page uses same CSS and structure as penetration testing page for visual consistency'
  - 'Custom Tooling page includes DevSecOps teams as additional target segment beyond standard list'
  - "ServicesSection heading changed from 'Three ways to work with us' to 'How we work with you'"
  - 'Security Training repositioned as secondary offering in a full-width bar below the 4 flagship cards'
  - 'Grid updated to 4-col desktop (>1200px), 2-col tablet, 1-col mobile'

patterns-established:
  - 'Service page template: Schema.org Service+FAQPage+BreadcrumbList, article-header, cards-section, article-body with methodology timeline, compliance alignment, FAQ, CTA'

requirements-completed: [SRVC-02, SRVC-03]

# Metrics
duration: 6min
completed: 2026-03-18
---

# Phase 7 Plan 01: Service Pages Summary

**Two new flagship service pages (Security Assessments, Custom Tooling) with Schema.org structured data, compliance alignment sections, and updated homepage grid showing 4 services**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-18T04:21:27Z
- **Completed:** 2026-03-18T04:28:01Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Security Assessments page with 6 assessment types, 6-step methodology, compliance alignment (BNR/PCI DSS/ISO 27001/Data Protection Law), 7 FAQs
- Custom Tooling page with 6 tooling types, 6-step engagement process, compliance alignment, 7 FAQs
- Homepage ServicesSection updated to 4 flagship cards with Security Training as secondary offering

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Security Assessments and Custom Tooling service pages** - `fb89914` (feat)
2. **Task 2: Update homepage ServicesSection to include new service pages** - `b433ff8` (feat)

## Files Created/Modified

- `src/pages/services/security-assessments/index.astro` - Security Assessments flagship service page (920+ lines)
- `src/pages/services/custom-tooling/index.astro` - Custom Tooling flagship service page (920+ lines)
- `src/components/sections/ServicesSection.astro` - Updated homepage services grid with 4 flagship cards + secondary training link

## Decisions Made

- Both new pages copy exact CSS from penetration testing page for visual consistency
- Custom Tooling page adds DevSecOps teams as 6th target segment
- ServicesSection uses "How we work with you" heading instead of counting services
- Training repositioned as full-width secondary bar below the 4 flagship cards
- Both pages cross-link to blog posts (BNR cybersecurity requirements, penetration testing vs vulnerability assessment, API security for banking)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Both service pages live and building successfully
- Homepage services grid updated
- Ready for Plan 02 (content quality improvements) and Plan 03 (cross-linking and internal SEO)

## Self-Check: PASSED

- All 3 created/modified files exist on disk
- Both service pages exceed 200-line minimum (922 and 925 lines)
- Both task commits verified: fb89914, b433ff8
- Build passes with 32 pages, zero errors

---

_Phase: 07-service-pages-and-content-quality_
_Completed: 2026-03-18_
