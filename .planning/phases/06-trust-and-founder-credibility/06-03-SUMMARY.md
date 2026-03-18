---
phase: 06-trust-and-founder-credibility
plan: 03
subsystem: content
tags: [compliance, bnr, pci-dss, iso-27001, data-protection, regulatory]

# Dependency graph
requires:
  - phase: 04-service-pages-and-seo
    provides: Service page structure and content for pentest, managed security, and training
provides:
  - Specific BNR Regulation No 16/2023 article references on all service pages
  - PCI DSS v4.0 requirement numbers mapped per service
  - ISO 27001:2022 control numbers mapped per service
  - Rwanda Data Protection Law No 058/2021 Article 30 references
affects: [07-blog-content, 09-final-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [compliance-section-pattern]

key-files:
  created: []
  modified:
    - src/pages/services/penetration-testing/index.astro
    - src/pages/services/managed-security/index.astro
    - src/pages/services/security-training/index.astro

key-decisions:
  - 'Compliance sections use consistent ul/li format with strong-tagged framework names across all three service pages'
  - 'BNR directive numbers include code comment caveat to verify at bnr.rw before publishing'

patterns-established:
  - 'Compliance alignment section pattern: h2 heading, intro paragraph, ul with strong-tagged framework name and specific article/requirement numbers'

requirements-completed: [TRST-05, TRST-06]

# Metrics
duration: 3min
completed: 2026-03-18
---

# Phase 06 Plan 03: Compliance Framework References Summary

**Specific BNR Regulation No 16/2023 articles, PCI DSS v4.0 requirements, ISO 27001:2022 controls, and Rwanda Data Protection Law No 058/2021 mapped to each of three service pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-18T04:02:01Z
- **Completed:** 2026-03-18T04:05:30Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Penetration testing page compliance section updated from generic "BNR requirements" to specific Article 13/9 references, PCI DSS v4.0 Req 11.4/11.3/6.2, ISO 27001:2022 Controls 8.8/5.36/8.34, and Law No 058/2021 Article 30
- Managed security page received new compliance alignment section with monitoring-specific references (BNR Art 10/14, PCI DSS Req 5/10/11.3, ISO Controls 8.16/5.24/8.8)
- Security training page received new compliance alignment section with training-specific references (BNR Art 12/9, PCI DSS Req 12.6/12.6.2, ISO Controls 6.3/6.2)
- Schema.org FAQ answers updated to include specific regulation numbers

## Task Commits

Each task was committed atomically:

1. **Task 1: Update penetration testing page with specific BNR directives** - `6c69980` (feat)
2. **Task 2: Add compliance sections to managed security and training pages** - `242cee3` (feat, bundled with parallel 06-01 commit due to concurrent execution)

**Plan metadata:** [pending]

## Files Created/Modified

- `src/pages/services/penetration-testing/index.astro` - Updated compliance alignment section with specific directive/requirement numbers; updated schema.org FAQ
- `src/pages/services/managed-security/index.astro` - Added new compliance alignment h2 section with monitoring-specific regulatory references
- `src/pages/services/security-training/index.astro` - Added new compliance alignment h2 section with training-specific regulatory references

## Decisions Made

- Compliance sections use consistent formatting: ul/li with strong-tagged framework names followed by specific article/requirement numbers
- Each service page maps compliance frameworks to the specific requirements relevant to that service type (testing vs monitoring vs training)
- BNR directive numbers include HTML comment caveat to verify at bnr.rw before publishing

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Task 2 commit was bundled with a parallel executor's 06-01 commit (242cee3) due to concurrent git staging. The changes are fully committed and verified.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three service pages now demonstrate specific regulatory knowledge
- BNR directive numbers flagged with code comments for verification at bnr.rw before publishing (existing blocker in STATE.md)

---

_Phase: 06-trust-and-founder-credibility_
_Completed: 2026-03-18_
