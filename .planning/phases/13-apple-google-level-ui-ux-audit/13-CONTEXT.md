# Phase 13: Apple/Google-Level UI/UX Audit - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning
**Source:** Auto-selected recommended defaults

<domain>
## Phase Boundary

Professional UI/UX audit and polish pass across the entire site. Micro-interactions, typography consistency, dark/light theme parity, and mobile UX refinements — making every detail feel intentional and premium. No new features or pages.

</domain>

<decisions>
## Implementation Decisions

### Audit Approach

- Audit against top-tier cybersecurity firms (CrowdStrike, Mandiant, Recorded Future) as visual benchmarks
- Focus on polish and consistency, not redesign — the design system from Phase 3 is the foundation
- Fix issues found during audit rather than just documenting them
- Prioritize high-impact visual improvements over exhaustive minor tweaks

### Micro-Interactions (UIUX-21)

- All buttons: smooth hover transitions (scale, color shift, shadow) — 0.2s ease
- Focus rings: consistent visible focus indicators on all interactive elements (keyboard accessibility)
- Page transitions: no full-page transitions (static MPA), but section reveals and element animations on scroll
- Loading states: skeleton/spinner patterns for any async operations (contact form already has this)
- Card hover states: subtle lift/shadow on all card-like elements

### Typography & Spacing (UIUX-22)

- Audit all pages for consistent use of the existing type scale (--text-xs through --text-5xl)
- Audit spacing for consistent use of the spacing scale (--space-1 through --space-16)
- Ensure visual hierarchy is clear: h1 > h2 > h3 > body with consistent sizing across all pages
- Fix any inconsistent font weights, line heights, or letter spacing

### Dark/Light Theme Parity (UIUX-23)

- Both themes must feel equally premium — light mode is not an afterthought
- Audit all pages in light mode specifically for contrast, readability, and visual weight
- The accent color fix (--acc: #059669 in light mode) from this session is the foundation
- Verify decorative elements (gradients, borders, shadows) look good in both themes

### Mobile UX (UIUX-24)

- Touch targets: minimum 44x44px for all interactive elements
- Hamburger menu: smooth animation, proper focus trapping
- Content readability: verify text sizes don't go below 14px on mobile
- WhatsApp float: already 48px on desktop, 56px on mobile (Phase 3 decision) — verify
- Bottom spacing: ensure no content hidden behind fixed elements

### Claude's Discretion

- Specific animation timing curves and durations
- Exact shadow values for hover states
- Whether to add scroll-triggered animations (subtle fade-in)
- Priority ordering of fixes found during audit
- Specific benchmark comparisons and which patterns to adopt

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design system

- `src/styles/global.css` — All CSS variables, design tokens, component styles
- `.planning/phases/03-component-architecture-and-visual-redesign/03-UI-SPEC.md` — Original UI spec with design decisions

### Existing patterns

- `src/components/` — All components for interaction audit
- `src/pages/` — All pages for consistency audit
- `src/layouts/BaseLayout.astro` — Base layout with theme system

### Testing

- `e2e/accessibility.spec.ts` — Existing a11y tests (must stay green)
- `e2e/responsive.spec.ts` — Existing responsive tests (must stay green)

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- Design token system in global.css with spacing, typography, shadow, radius scales
- Consistent component patterns across service pages
- Theme toggle with localStorage persistence

### Established Patterns

- Scoped CSS in Astro components
- CSS custom properties for theming
- 0.2s transition on interactive elements (established in Phase 3)

### Integration Points

- All changes are CSS/style modifications — no new components or pages
- Must pass existing E2E tests (66+ Playwright tests)
- Must pass axe-core accessibility scans

</code_context>

<specifics>
## Specific Ideas

- Service page cards should have consistent hover effects across all 5 service pages
- Blog cards and case study cards should share the same interaction pattern
- The terminal animation on the homepage hero should feel premium
- Footer and nav should have consistent link hover effects
- Form inputs should have polished focus states

</specifics>

<deferred>
## Deferred Ideas

None — this is the final polish phase.

</deferred>

---

_Phase: 13-apple-google-level-ui-ux-audit_
_Context gathered: 2026-03-20_
