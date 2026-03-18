# Phase 10: Functionality Fixes - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning
**Source:** Milestone audit gap analysis + codebase verification

<domain>
## Phase Boundary

Fix all broken functionality identified in the v1.0 milestone audit: tag filtering, quiz navigation, OG image format, and blog tag metadata. Pure bug-fix phase — no new capabilities.

</domain>

<decisions>
## Implementation Decisions

### Tag Filter Fix (SRVC-07)

- Replace `document.addEventListener('astro:page-load', ...)` with `document.addEventListener('DOMContentLoaded', ...)` in TagFilter.astro line 26
- `astro:page-load` never fires in a static MPA without ViewTransitions — click handlers are never attached
- Existing filter logic is correct; only the event binding is broken

### Quiz Nav Default (LEAD-08) — ALREADY FIXED

- BaseLayout.astro line 54 already defaults `showFreeTool = true` (fixed in Phase 9 P02)
- Quiz link appears on all pages — verify during phase execution, no code change needed
- Success criterion 2 should pass without changes

### OG Image WebP (UIUX-05)

- SEOHead.astro already uses `getImage({ src: ogImageAsset, format: 'webp' })` — OG meta tags serve WebP
- BlogPostLayout.astro line 77 still uses `ogImageAsset.src` (raw PNG import) in schema.org structured data — must use getImage() WebP URL instead
- index.astro line 17 already has `getImage()` — verify schema.org in index.astro uses `optimisedOg.src` not hardcoded `/og.png`

### Blog Article Tags (SRVC-09) — ALREADY FIXED

- All 3 new articles already have `tags:` field in frontmatter:
  - `penetration-testing-kigali-enterprise-guide.mdx` → `['penetration-testing', 'east-africa']`
  - `bnr-cybersecurity-compliance-2026.mdx` → `['compliance', 'banking-security', 'east-africa']`
  - `cloud-security-east-africa-aws-azure.mdx` → `['security-strategy', 'east-africa']`
- Verify they appear in tag filter results once TagFilter is fixed

### Schema.org Image Path

- Fix any hardcoded `/og.png` references in structured data to use the optimised WebP path from `getImage()`
- BlogPostLayout schema.org `image.url` must reference a valid, buildable image path (not a 404)

### Claude's Discretion

- Whether to add a fallback for `astro:page-load` alongside `DOMContentLoaded` (for future ViewTransitions compatibility)
- Exact approach for passing getImage() result into BlogPostLayout schema.org

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit findings

- `.planning/v1.0-MILESTONE-AUDIT.md` — Gap details for SRVC-07, LEAD-08, UIUX-05, SRVC-09 with exact evidence and prescribed fixes

### Files to fix

- `src/components/TagFilter.astro` — Line 26: `astro:page-load` event binding (SRVC-07)
- `src/layouts/BlogPostLayout.astro` — Line 77: raw `ogImageAsset.src` in schema.org (UIUX-05)
- `src/layouts/BaseLayout.astro` — Line 54: verify `showFreeTool = true` (LEAD-08)
- `src/components/SEOHead.astro` — Already has `getImage()` — reference implementation for WebP approach

### Blog articles to verify

- `src/content/blog/penetration-testing-kigali-enterprise-guide.mdx` — Verify tags present
- `src/content/blog/bnr-cybersecurity-compliance-2026.mdx` — Verify tags present
- `src/content/blog/cloud-security-east-africa-aws-azure.mdx` — Verify tags present

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- SEOHead.astro `getImage({ src: ogImageAsset, format: 'webp' })` pattern — reuse in BlogPostLayout for schema.org
- Six-tag taxonomy already established: penetration-testing, compliance, mobile-security, east-africa, banking-security, security-strategy

### Established Patterns

- Astro content collections with Zod schema validation (content.config.ts) — tags field already defined as `z.array(z.string()).optional()`
- Client-side tag filtering with `data-tags` attributes on blog cards (BlogCard.astro)

### Integration Points

- TagFilter.astro → blog/index.astro (renders tag buttons, filters `.blog-card-wrapper` elements)
- BlogPostLayout.astro → SEOHead.astro (passes ogImage prop)
- index.astro → SchemaOrg (passes schema array with image URLs)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — fixes are prescribed by the milestone audit with exact code locations and remediation steps.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 10-functionality-fixes_
_Context gathered: 2026-03-18 via audit gap analysis + codebase verification_
