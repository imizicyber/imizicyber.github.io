---
phase: 08-blog-system-and-new-content
plan: 01
subsystem: ui
tags: [astro, content-collections, tag-filtering, related-posts, blog]

requires:
  - phase: 03-homepage-redesign
    provides: blog card component and global styles
provides:
  - tags field in blog content schema
  - TagFilter client-side component for blog index
  - RelatedPosts component for blog post pages
  - Consistent 6-tag taxonomy across all blog posts
affects: [08-blog-system-and-new-content]

tech-stack:
  added: []
  patterns: [client-side filtering via data attributes, tag-based content scoring for related posts]

key-files:
  created:
    - src/components/TagFilter.astro
    - src/components/RelatedPosts.astro
  modified:
    - src/content.config.ts
    - src/components/BlogCard.astro
    - src/pages/blog/index.astro
    - src/layouts/BlogPostLayout.astro
    - src/styles/global.css
    - src/content/blog/*.mdx (all 16 files)

key-decisions:
  - 'Client-side tag filtering with data-tags attributes and display toggle for progressive enhancement'
  - 'RelatedPosts scores by shared tag count, shows top 2-3 (minimum 2 required to render)'
  - 'Blog card wrapper div used for filtering instead of display:contents to support style.display toggle'

patterns-established:
  - 'Tag taxonomy: penetration-testing, compliance, mobile-security, east-africa, banking-security, security-strategy'
  - 'Client-side filtering pattern: data-tag buttons + data-tags on wrappers + JS show/hide'

requirements-completed: [SRVC-07, SRVC-08, SRVC-10]

duration: 5min
completed: 2026-03-18
---

# Phase 8 Plan 1: Blog Tag Filtering and Related Posts Summary

**Tag-based filtering on blog index with client-side pill buttons, related posts section on every blog post scoring by shared tags, and 6-tag taxonomy across all 16 existing posts**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-18T04:47:05Z
- **Completed:** 2026-03-18T04:52:28Z
- **Tasks:** 2
- **Files modified:** 23

## Accomplishments

- Added tags field to blog content schema with z.array(z.string()).default([])
- Tagged all 16 existing blog posts with 2-4 tags from a consistent 6-tag taxonomy
- Created TagFilter component with pill-shaped buttons for client-side filtering
- Created RelatedPosts component that scores posts by shared tags and shows top 2-3
- Updated BlogCard to display tags below date line
- Integrated TagFilter on blog index and RelatedPosts on every blog post layout

## Task Commits

Each task was committed atomically:

1. **Task 1: Add tags to blog schema and all 16 existing posts** - `5cfcc3d` (feat)
2. **Task 2: Add tag filtering to blog index and related posts to blog layout** - `a56b1b1` (feat)

## Files Created/Modified

- `src/content.config.ts` - Added tags field to blog schema
- `src/components/TagFilter.astro` - Client-side tag filter buttons
- `src/components/RelatedPosts.astro` - Related posts grid based on shared tags
- `src/components/BlogCard.astro` - Added tags prop and display
- `src/pages/blog/index.astro` - Integrated TagFilter, added data-tags wrappers
- `src/layouts/BlogPostLayout.astro` - Integrated RelatedPosts component
- `src/styles/global.css` - Added .blog-tags style
- `src/content/blog/*.mdx` - Added tags arrays to all 16 blog posts

## Decisions Made

- Client-side tag filtering uses data-tag attributes on buttons and data-tags on card wrappers with JS show/hide for progressive enhancement (all posts visible without JS)
- RelatedPosts requires minimum 2 related posts to render, preventing sparse/unhelpful sections
- Blog card wrapper div used instead of display:contents to support style.display toggle for filtering
- Six-tag taxonomy chosen: penetration-testing, compliance, mobile-security, east-africa, banking-security, security-strategy

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed ESLint non-null assertion error in TagFilter**

- **Found during:** Task 2 (TagFilter component)
- **Issue:** Used `tag!` non-null assertion which ESLint forbids
- **Fix:** Changed to `tag ?? ''` nullish coalescing
- **Files modified:** src/components/TagFilter.astro
- **Verification:** ESLint passes, build succeeds
- **Committed in:** a56b1b1

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor lint fix, no scope change.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Tag filtering and related posts fully functional
- Ready for Phase 8 Plan 2 (new content articles) and Plan 3
- All 16 posts tagged and schema validated

---

_Phase: 08-blog-system-and-new-content_
_Completed: 2026-03-18_

## Self-Check: PASSED

All files created/modified exist. All commit hashes verified. Schema contains tags field. TagFilter integrated in blog index. RelatedPosts integrated in blog layout.
