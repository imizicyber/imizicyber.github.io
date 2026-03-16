# Phase 3: Component Architecture and Visual Redesign - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Break the monolithic `index.astro` (1,284 lines) into composable section components and apply a premium visual redesign that competes with global cybersecurity firms. "Book a Consultation" CTA visible above the fold on every page. Responsive layout renders correctly on mobile, tablet, and desktop.

Requirements: UIUX-01, UIUX-02, UIUX-03

</domain>

<decisions>
## Implementation Decisions

### Visual Identity & Color Palette

- Keep existing green (#34d399) on dark navy palette — refine, don't replace
- Polish the existing palette: better contrast ratios, more refined gradients, premium feel
- Green signals "security" and "technical" — right for the brand

### Aesthetic Direction

- Claude's Discretion: research competitors (CrowdStrike, Mandiant, Bishop Fox, NCC Group) and determine the best aesthetic blend for a boutique Kigali-based firm targeting regulated enterprise buyers
- The aesthetic must feel premium and authoritative without being generic

### Theme Treatment

- Claude's Discretion: determine dark-first vs equal treatment based on competitive research and target audience behavior (enterprise CISOs, bank IT directors in Rwanda/East Africa)

### Motion & Animations

- Subtle reveal animations: sections fade/slide in on scroll, button hover effects
- Nothing flashy — polished, not gimmicky
- Must respect `prefers-reduced-motion` media query

### Homepage Above the Fold

- Hero headline + "Book a Consultation" CTA + OSCP/OSCP+/BlackHat credential badges visible immediately without scrolling
- Credentials must be visible before any service description

### Homepage Section Flow

- Claude's Discretion: determine optimal section order based on competitive research for cybersecurity firm conversions
- Current sections: Hero, Services, Credentials, Blog, FAQ, CTA, Contact
- Blog section shows 3 latest posts (not 9) with "View all" link
- Contact form stays on homepage (not a separate /contact/ page)

### Service Page Structure

- Problem → Solution → How → CTA flow for each service page
- Explicit deliverables list per service (e.g., "Executive summary PDF, technical findings with CVSS scores, remediation roadmap, 30-day retest")
- Compliance mapping per service page — reference specific BNR directives, PCI DSS requirements, ISO 27001 controls where applicable

### Mobile & Responsive

- Equal design priority for mobile and desktop — both get full attention
- Claude's Discretion: hamburger menu vs alternative mobile navigation based on research
- WhatsApp floating button: larger and always-visible (sticky) on mobile — primary mobile conversion channel in Rwanda
- Touch targets must meet accessibility minimums (44x44px)

### Claude's Discretion

- Exact aesthetic blend (minimal/bold/technical) based on competitor research
- Dark-first vs equal theme treatment
- Homepage section order after hero
- Mobile navigation pattern (hamburger vs alternatives)
- Typography choices (font pairing, heading sizes, weights)
- Spacing system and grid specifications
- Component naming conventions for extracted sections

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current codebase

- `.planning/codebase/ARCHITECTURE.md` — Current component architecture and data flow
- `.planning/codebase/CONVENTIONS.md` — Existing code patterns and CSS conventions
- `.planning/codebase/STRUCTURE.md` — File organization and component inventory
- `.planning/codebase/CONCERNS.md` — Known issues including monolithic index.astro

### Project context

- `.planning/REQUIREMENTS.md` — UIUX-01 through UIUX-10 requirements
- `.planning/research/FEATURES.md` — Feature landscape, differentiators, table stakes
- `.planning/research/PITFALLS.md` — Pitfalls including premium positioning and mobile performance

### Prior phase decisions

- `.planning/phases/01-code-quality-tooling/01-CONTEXT.md` — Linting, testing, path aliases
- `.planning/phases/02-security-hardening-and-test-coverage/02-CONTEXT.md` — CSP, E2E tests, innerHTML elimination

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/BlogCard.astro` — Blog post card, used on homepage and blog index
- `src/components/ContactForm.astro` — Contact form with Formspree integration
- `src/components/Nav.astro` — Navigation with home/inner variants
- `src/components/Footer.astro` — Footer with home/inner variants
- `src/components/WhatsAppFloat.astro` — Floating WhatsApp CTA button
- `src/components/ThemeToggle.astro` — Dark/light mode toggle (working, Phase 1 fix)
- `src/components/CookieBanner.astro` — GDPR cookie consent
- `src/components/CtaBox.astro` — CTA box component
- `src/components/Callout.astro` — Callout/highlight component

### Established Patterns

- Astro component props with TypeScript interfaces
- CSS in `src/styles/global.css` (single file, ~1500 lines)
- CSS custom properties for theming (--bg, --fg, --acc, etc.)
- `data-theme` attribute on `<html>` for theme switching
- BaseLayout / SimplePageLayout wrapper pattern

### Integration Points

- `src/pages/index.astro` (1,284 lines) — must be refactored into section components
- `src/styles/global.css` — may need splitting into component-scoped styles
- `src/layouts/BaseLayout.astro` — all pages use this, CTA must be added here or per-page
- E2E tests in `e2e/` — must still pass after visual changes (homepage.spec.ts, navigation.spec.ts, etc.)

</code_context>

<specifics>
## Specific Ideas

- Green + dark navy palette is the brand identity — refine it, don't replace
- Founder credentials (OSCP, OSCP+, BlackHat Arsenal) must be prominently visible before services
- WhatsApp is the primary mobile conversion channel in Rwanda — make the button impossible to miss on mobile
- Service pages must map to specific compliance frameworks (BNR, PCI DSS, ISO 27001) — this signals expertise to regulated enterprise buyers
- Blog shows only 3 latest posts on homepage, not all 9

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 03-component-architecture-and-visual-redesign_
_Context gathered: 2026-03-17_
