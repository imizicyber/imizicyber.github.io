---
phase: 07-service-pages-and-content-quality
plan: 03
subsystem: ui
tags: [astro, blog, internal-linking, seo, content-quality]

# Dependency graph
requires:
  - phase: 07-service-pages-and-content-quality
    provides: service page URLs (penetration-testing, security-assessments, custom-tooling, managed-security, security-training)
provides:
  - All 16 blog posts with internal links to service pages and other blog posts
  - Complete internal link coverage for SEO
affects: [sitemap, seo, navigation]

# Tech tracking
tech-stack:
  added: []
  patterns: [service link placement in "How we can help" sections]

key-files:
  created: []
  modified:
    - src/content/blog/bank-fraud-east-africa-cybersecurity-lessons.mdx
    - src/content/blog/bnr-cybersecurity-requirements.mdx
    - src/content/blog/east-africa-cybersecurity.mdx
    - src/content/blog/mobile-banking-security-assessment.mdx
    - src/content/blog/mobile-money-security-testing.mdx
    - src/content/blog/penetration-testing-cost-rwanda.mdx
    - src/content/blog/penetration-testing-rwanda.mdx
    - src/content/blog/penetration-testing-vs-vulnerability-assessment-banks.mdx
    - src/content/blog/penetration-testing-vs-vulnerability-scanning.mdx
    - src/content/blog/ussd-security-testing.mdx
    - src/content/blog/vapt-rwanda.mdx

key-decisions:
  - 'Service links added in How we can help sections for natural reading flow'
  - 'Most posts link to both /services/penetration-testing/ and /services/security-assessments/ as most relevant services'
  - 'All 16 blog posts verified with zero broken internal links'

patterns-established:
  - 'Blog-to-service linking: service links placed as natural paragraph before CTA contact link'

requirements-completed: [SRVC-05, SRVC-06]

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 7 Plan 03: Blog Internal Linking and Quality Audit Summary

**16/16 blog posts now link to at least one service page and at least one other blog post, with zero broken internal links across the entire blog content collection**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T04:30:44Z
- **Completed:** 2026-03-18T04:33:10Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Added service page links to 11 blog posts that were missing them
- Verified 16/16 blog posts have both service and blog-to-blog links
- Verified all 16 blog slug references resolve to actual .mdx files
- Verified all 3 service page slugs referenced (/services/penetration-testing/, /services/security-assessments/, /services/security-training/) resolve to actual pages
- Quality review: all posts have East African/Rwandan context, reference specific frameworks, and sound practitioner-written

## Task Commits

Each task was committed atomically:

1. **Task 1: Audit blog posts and add missing internal links** - `33c3d00` (feat)
2. **Task 2: Verify complete internal link coverage** - verification only, no code changes needed

## Files Created/Modified

- `src/content/blog/bank-fraud-east-africa-cybersecurity-lessons.mdx` - Added /services/security-assessments/ and /services/penetration-testing/ links
- `src/content/blog/bnr-cybersecurity-requirements.mdx` - Added /services/security-assessments/ and /services/penetration-testing/ links
- `src/content/blog/east-africa-cybersecurity.mdx` - Added /services/security-assessments/ and /services/penetration-testing/ links
- `src/content/blog/mobile-banking-security-assessment.mdx` - Added /services/security-assessments/ link
- `src/content/blog/mobile-money-security-testing.mdx` - Added /services/penetration-testing/ link
- `src/content/blog/penetration-testing-cost-rwanda.mdx` - Added /services/penetration-testing/ and /services/security-assessments/ links
- `src/content/blog/penetration-testing-rwanda.mdx` - Added /services/penetration-testing/ and /services/security-assessments/ links
- `src/content/blog/penetration-testing-vs-vulnerability-assessment-banks.mdx` - Added /services/penetration-testing/ and /services/security-assessments/ links
- `src/content/blog/penetration-testing-vs-vulnerability-scanning.mdx` - Added /services/penetration-testing/ and /services/security-assessments/ links
- `src/content/blog/ussd-security-testing.mdx` - Added /services/penetration-testing/ link
- `src/content/blog/vapt-rwanda.mdx` - Added /services/penetration-testing/ and /services/security-assessments/ links

## Link Coverage Report

| Blog Post                                             | Service Links | Blog Links | Status     |
| ----------------------------------------------------- | ------------- | ---------- | ---------- |
| api-security-banking                                  | 1             | 2          | OK         |
| bank-fraud-east-africa-cybersecurity-lessons          | 1             | 1          | OK (added) |
| bnr-cybersecurity-requirements                        | 1             | 3          | OK (added) |
| data-breach-cost-east-africa                          | 1             | 3          | OK         |
| east-africa-cybersecurity                             | 1             | 5          | OK (added) |
| iso-27001-rwanda                                      | 1             | 1          | OK         |
| mobile-banking-security-assessment                    | 1             | 3          | OK (added) |
| mobile-money-security-testing                         | 1             | 2          | OK (added) |
| penetration-testing-cost-rwanda                       | 1             | 2          | OK (added) |
| penetration-testing-rwanda                            | 1             | 9          | OK (added) |
| penetration-testing-vs-vulnerability-assessment-banks | 1             | 4          | OK (added) |
| penetration-testing-vs-vulnerability-scanning         | 1             | 4          | OK (added) |
| social-engineering-east-africa-banks                  | 1             | 1          | OK         |
| swift-csp-compliance-rwanda                           | 1             | 2          | OK         |
| ussd-security-testing                                 | 1             | 2          | OK (added) |
| vapt-rwanda                                           | 1             | 3          | OK (added) |

## Quality Review Notes

All 16 blog posts reviewed for quality. No posts flagged for removal. All posts:

- Have specific East African/Rwandan context (BNR regulation, mobile money, USSD, specific market dynamics)
- Reference specific frameworks where relevant (BNR, PCI DSS, ISO 27001, OWASP)
- Sound practitioner-written with concrete examples and actionable advice
- Have clear value propositions for the target reader (bank CISOs, compliance officers, IT managers)

## Decisions Made

- Service links placed naturally in "How we can help" sections rather than as standalone paragraphs
- Most pentest-related posts link to both /services/penetration-testing/ and /services/security-assessments/ since both are relevant
- Posts about specific testing (USSD, mobile money) link primarily to /services/penetration-testing/

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 7 (Service Pages and Content Quality) is now complete
- All 5 service pages live, homepage updated, all blog posts cross-linked
- Ready for Phase 8

---

_Phase: 07-service-pages-and-content-quality_
_Completed: 2026-03-18_
