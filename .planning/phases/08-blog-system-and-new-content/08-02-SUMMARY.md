---
phase: 08-blog-system-and-new-content
plan: 02
subsystem: content
tags: [blog, seo, mdx, cybersecurity, rwanda, east-africa]

# Dependency graph
requires:
  - phase: 03-homepage-redesign
    provides: BlogSection with dynamic getCollection('blog')
provides:
  - 3 new geo-targeted SEO blog articles (penetration testing Kigali, BNR compliance 2026, cloud security East Africa)
  - Internal linking between blog posts and service pages
  - FAQ schema markup for rich snippets on all 3 articles
affects: [09-final-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [Callout component for key points, FAQ schema for SEO rich snippets]

key-files:
  created:
    - src/content/blog/penetration-testing-kigali-enterprise-guide.mdx
    - src/content/blog/bnr-cybersecurity-compliance-2026.mdx
    - src/content/blog/cloud-security-east-africa-aws-azure.mdx
  modified: []

key-decisions:
  - 'Omitted tags field from frontmatter initially as schema update from Plan 01 was not yet applied; Plan 01 was found already committed so tags were preserved by linter'
  - 'Articles written as practitioner content (1600-2000 words each) rather than minimum 800 words for substantive SEO value'

patterns-established:
  - 'Blog article structure: opening context, technical depth sections, red flags/gaps list, how-we-can-help CTA'
  - 'Internal linking: each article links to at least 1 service page and 1-2 other blog posts'

requirements-completed: [SRVC-09]

# Metrics
duration: 5min
completed: 2026-03-18
---

# Phase 8 Plan 02: New Blog Content Summary

**3 substantive geo-targeted blog articles (5300+ words total) covering penetration testing Kigali, BNR compliance 2026, and cloud security East Africa with FAQ schema and internal links**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-18T04:47:19Z
- **Completed:** 2026-03-18T04:51:58Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Published "Choosing a penetration testing firm in Kigali" enterprise guide (1659 words) targeting "penetration testing Kigali" keyword cluster
- Published "BNR cybersecurity compliance in 2026" article (1716 words) targeting "BNR cybersecurity compliance Rwanda" keywords
- Published "Cloud security for East African organisations" article (1984 words) targeting "cloud security East Africa" keywords
- All articles include FAQ schema for rich snippets, Callout components, and internal links to service pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Write "Penetration Testing in Kigali" enterprise guide** - `2617700` (feat)
2. **Task 2: Write "BNR Cybersecurity Compliance 2026" and "Cloud Security East Africa" articles** - `a56b1b1` (feat)

## Files Created/Modified

- `src/content/blog/penetration-testing-kigali-enterprise-guide.mdx` - Enterprise guide for choosing a pentest firm in Kigali (certifications, methodology, reporting, red flags)
- `src/content/blog/bnr-cybersecurity-compliance-2026.mdx` - BNR ICT risk management, pentest mandates, regulatory exam preparation
- `src/content/blog/cloud-security-east-africa-aws-azure.mdx` - AWS/Azure misconfigurations, data sovereignty, cloud pentesting methodology

## Decisions Made

- Articles written well above minimum word count (1600-2000 words each vs 800 minimum) for substantive SEO value and practitioner credibility
- Each article follows established blog structure with Callout components, FAQ schema, and internal linking to service pages and other blog posts

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Blog now has 19 total articles with strong geo-targeted keyword coverage
- Internal linking network strengthened between blog posts and service pages
- Ready for Plan 03 (wave 2) or Phase 9 final polish

## Self-Check: PASSED

All 3 article files exist. Both task commits verified.

---

_Phase: 08-blog-system-and-new-content_
_Completed: 2026-03-18_
