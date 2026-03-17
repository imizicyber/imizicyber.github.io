# Phase 4: Performance and Accessibility - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the site fast enough for MTN Rwanda mobile connections (LCP < 2.5s on 3G, Core Web Vitals green) and fully accessible via keyboard and screen readers. Convert all images to WebP via Astro Image, optimize font loading, add ARIA attributes, and ensure the contact form has distinct loading/success/error states.

Requirements: UIUX-04, UIUX-05, UIUX-06, UIUX-07, UIUX-08, UIUX-09, UIUX-10

</domain>

<decisions>
## Implementation Decisions

### Font Loading Strategy

- Self-host all 3 font files (Plus Jakarta Sans 400, Plus Jakarta Sans 700, JetBrains Mono 400) in `public/fonts/`
- Subset to Latin characters only (site is English-only in v1) to reduce file size by ~30-50%
- Preload the primary body font (Plus Jakarta Sans 400) via `<link rel="preload">` to prevent FOUT
- Bold weight and monospace font load on demand with `font-display: swap`
- Remove Google Fonts external stylesheet link and preconnect hints from BaseLayout
- Write `@font-face` declarations with WOFF2 format

### Contact Form Feedback (UIUX-07)

- Loading state: CSS spinner animation inside the submit button next to "Sending..." text, button disabled, `aria-busy="true"` on the form
- Success/error messages announced via `aria-live="polite"` region
- Claude's Discretion: Whether success collapses the form or resets it, and the exact visual treatment of success/error states (inline messages vs other approach)

### Mobile Gradient Handling (UIUX-09)

- Claude's Discretion: Determine gradient treatment on mobile based on actual paint complexity — options range from simplifying multi-stop gradients to 2-stop versions, replacing with solid colors, or keeping as-is if CSS gradient paint cost is negligible on target devices

### Keyboard & Screen Reader Support (UIUX-08)

- Full ARIA landmark regions: `role="banner"` on nav, `role="main"` on content, `role="contentinfo"` on footer, plus `aria-label` on each homepage section for screen reader section jumping
- Claude's Discretion: Keyboard navigation depth — determine what WCAG 2.1 AA requires and what axe-core flags. At minimum: all interactive elements reachable via Tab/Enter/Escape, visible focus indicators, focus trapping in hamburger menu when open
- Claude's Discretion: Focus indicator styling — brand-styled vs browser defaults, based on contrast requirements against the dark navy background

### Image Optimization (UIUX-05)

- Convert all existing images (favicon PNGs, OG image, logo) to WebP where beneficial via Astro Image component
- Apply `loading="lazy"` to all images below the fold
- Site currently has only 4 images in `public/` — ensure the pattern is set for any future images added in later phases

### Core Web Vitals (UIUX-04, UIUX-10)

- Target: Google PageSpeed Insights mobile score 90+, all Core Web Vitals green
- LCP target: under 2.5s at simulated Slow 4G throttling
- Self-hosted fonts + preload are the primary LCP levers (eliminates 3 external requests)
- Evaluate: CSS minification, critical CSS inlining, and any render-blocking resources

### Claude's Discretion

- Contact form post-submit behavior (collapse vs reset)
- Exact success/error message visual design
- Mobile gradient simplification strategy
- Keyboard navigation scope beyond WCAG 2.1 AA minimums
- Focus indicator visual style (brand green vs system defaults)
- Critical CSS extraction approach
- Whether to add `will-change` or other GPU hints for animations

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements

- `.planning/REQUIREMENTS.md` — UIUX-04 through UIUX-10 define all success criteria for this phase

### Current codebase

- `.planning/codebase/CONVENTIONS.md` — CSS patterns, import organization, TypeScript conventions
- `.planning/codebase/STACK.md` — Astro 6.0.4 SSG, Node 22, GitHub Pages deployment

### Prior phase decisions

- `.planning/phases/03-component-architecture-and-visual-redesign/03-CONTEXT.md` — Visual identity decisions: green on dark navy palette, animation approach, touch targets, font reduction to 3 files, WhatsApp sizing, hero mobile ordering

### Key files to modify

- `src/layouts/BaseLayout.astro` — Font loading (currently Google Fonts CDN), SkipLink already present
- `src/styles/global.css` — 5 gradients to evaluate, focus styles, font-face declarations
- `src/components/ContactForm.astro` — Form states need loading spinner, ARIA attributes
- `src/components/Nav.astro` — Keyboard focus management, landmark roles
- `src/components/sections/*.astro` — aria-label on each section for landmark navigation

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/SkipLink.astro` — Already exists in BaseLayout, links to `#main`
- `src/components/ContactForm.astro` — Has basic success/error divs, needs loading state + ARIA
- `src/layouts/BaseLayout.astro` — Central place for font loading, CSP, meta tags
- `src/scripts/scroll-reveal.ts` — Already respects `prefers-reduced-motion` (Phase 3)

### Established Patterns

- CSS custom properties for theming (`--bg`, `--txt`, `--acc`) — focus styles should use these
- `data-theme` attribute on `<html>` for dark/light mode — focus indicators must work in both themes
- Astro scoped styles in components + `global.css` for shared styles
- Phase 3 consolidated font-weights to 400/700 only

### Integration Points

- `src/layouts/BaseLayout.astro` lines 89-94 — Google Fonts links to replace with self-hosted `@font-face`
- `src/components/ContactForm.astro` lines 75-107 — Form submission script needs ARIA + loading state
- `public/` directory — Font files will be added here as `public/fonts/`
- All 4 images in `public/` (favicon-32.png, logo-192.png, og.png, logo.svg) — WebP conversion candidates

</code_context>

<specifics>
## Specific Ideas

- Self-hosting fonts is specifically motivated by African mobile performance — MTN Rwanda 3G adds 200-400ms per external DNS lookup
- The site is text-heavy with only 4 images, so font loading is the biggest performance lever
- Latin-only font subset is safe because v1 is English-only (French/Kinyarwanda is v2 scope)
- Contact form is on the homepage and every page via CTA — it's a high-traffic accessibility surface

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 04-performance-and-accessibility_
_Context gathered: 2026-03-17_
