---
phase: 03-component-architecture-and-visual-redesign
plan: 03
subsystem: ui
tags: [astro-components, section-extraction, content-collection, scoped-css, component-composition]

# Dependency graph
requires:
  - phase: 03-component-architecture-and-visual-redesign
    plan: 02
    provides: 5 section components (Hero, TrustBar, Credentials, WhyUs, Services), component pattern
provides:
  - 5 new standalone section components (ProcessSection, BlogSection, FaqSection, CtaSection, ContactSection)
  - BlogSection with dynamic Astro content collection fetch (replaces hardcoded blogPosts array)
  - Fully refactored index.astro composing 10 section components with no inline markup
  - All section-specific CSS moved to component scoped styles
affects: [03-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    [
      Dynamic content collection fetch in section component,
      Props interface with defaults for configurable components,
      Self-contained data in component frontmatter (FaqSection),
      Component wrapping existing components (ContactSection wraps ContactForm),
    ]

key-files:
  created:
    - src/components/sections/ProcessSection.astro
    - src/components/sections/BlogSection.astro
    - src/components/sections/FaqSection.astro
    - src/components/sections/CtaSection.astro
    - src/components/sections/ContactSection.astro
  modified:
    - src/pages/index.astro

key-decisions:
  - 'BlogSection uses dynamic getCollection("blog") instead of hardcoded blogPosts array for automatic freshness'
  - 'FaqSection contains its own faqItems data in frontmatter since it is only used in this component'
  - 'CtaSection keeps hardcoded compliance-specific WhatsApp URL (different message from generic CONTACT.whatsappUrl)'
  - 'global.css not modified -- no CSS removals to avoid breaking other pages (service, blog, resources)'
  - 'JSON-LD schemas remain in index.astro (page-specific structured data, not section markup)'

patterns-established:
  - 'Content collection fetch pattern: import getCollection, sort by datePublished, slice by count prop'
  - 'Component data encapsulation: section-specific data arrays live in the component that uses them'
  - 'Wrapper component pattern: ContactSection imports and wraps existing ContactForm with layout'

requirements-completed: [UIUX-01]

# Metrics
duration: 9min
completed: 2026-03-17
---

# Phase 3 Plan 03: Complete Homepage Component Extraction Summary

**5 remaining sections extracted to standalone Astro components, BlogSection switched to dynamic content collection, index.astro refactored from 680 lines to pure component composition with 10 section tags**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-17T09:39:07Z
- **Completed:** 2026-03-17T09:48:16Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Extracted Process, Blog, FAQ, CTA, and Contact sections into standalone Astro components with scoped CSS
- BlogSection now dynamically fetches latest posts from Astro content collection instead of hardcoded array, with configurable count prop and empty state handling
- FaqSection encapsulates its own faqItems data, eliminating data coupling with index.astro
- index.astro refactored from ~680 lines (post-Plan 02) to ~253 lines, with template reduced to 10 component tags and a script block (remaining lines are JSON-LD schemas)
- All inline section markup, blogPosts array, faqItems array, and entire style block removed from index.astro
- All 10 homepage sections are now standalone components in src/components/sections/

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract ProcessSection, BlogSection (dynamic), FaqSection, CtaSection, ContactSection** - `e1b7556` (feat)
2. **Task 2: Complete index.astro refactor and clean orphaned CSS** - `3d7aded` (feat)

## Files Created/Modified

- `src/components/sections/ProcessSection.astro` - 4-step engagement process with responsive grid (4-col desktop, 2-col tablet, 1-col mobile)
- `src/components/sections/BlogSection.astro` - Dynamic blog grid using getCollection('blog'), count prop (default: 3), empty state, "View All Posts" link
- `src/components/sections/FaqSection.astro` - FAQ accordion with self-contained faqItems data, uses global FAQ styles
- `src/components/sections/CtaSection.astro` - Compliance urgency CTA block with centered layout and WhatsApp link
- `src/components/sections/ContactSection.astro` - Contact info grid wrapping existing ContactForm component, imports CONTACT and SITE data
- `src/pages/index.astro` - Fully refactored to import and compose 10 section components, no inline markup or styles

## Decisions Made

- BlogSection uses `getCollection('blog')` for automatic freshness instead of maintaining a manual blogPosts array. Posts sorted by datePublished descending, sliced by count prop.
- FaqSection stores faqItems locally in its frontmatter since the data is only used by this one component. Keeps data close to usage.
- CtaSection keeps the hardcoded BNR-compliance-specific WhatsApp URL with its custom pre-filled message, rather than importing the generic CONTACT.whatsappUrl.
- No CSS removed from global.css per plan guidance -- blog-card, faq, form-box and other shared styles are used by blog, service, and resource pages. Safe cleanup deferred to future phase.
- JSON-LD schemas (Organization, FAQPage, WebSite) remain in index.astro frontmatter since they are page-level structured data, not section markup.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 10 homepage sections are standalone Astro components in src/components/sections/
- index.astro is a pure composition file with no inline markup or styles
- BlogSection dynamically fetches content collection, automatically picks up new blog posts
- Plan 03-04 (visual polish and design token application) can proceed with all components in place
- All E2E tests pass (20 passed, 18 skipped stubs), build succeeds, no regressions

## Self-Check: PASSED

All 6 files verified present. All 2 commit hashes verified in git log.

---

_Phase: 03-component-architecture-and-visual-redesign_
_Completed: 2026-03-17_
