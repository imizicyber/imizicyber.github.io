# Phase 12: Full-Site Playwright Testing - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Comprehensive E2E test coverage for every page and interactive element: responsive breakpoints, accessibility audits, performance budgets, and critical user flows — all automated via Playwright.

</domain>

<decisions>
## Implementation Decisions

### Test Organization

- Keep existing concern-based file structure (one spec per concern, not one per page)
- Add `page-routes.spec.ts` for all page route checks (200 status, h1 present, no console errors) with describe blocks per page group
- Add `interactions.spec.ts` for untested interactive elements (theme toggle, WhatsApp links, nav hamburger open/close)
- Target total suite runtime under 2 minutes

### Responsive Testing

- Expand to 4 breakpoints: 375px, 768px, 1024px, 1440px (add missing 1024px)
- Test representative subset of 5-6 pages (homepage, a service page, blog index, blog post, case study, tools/security-score) — not all 20 routes
- Verify layout structure: hamburger visible on mobile (<768px) but not desktop, CTA visible above fold, no overlapping elements, no horizontal overflow
- No visual regression screenshots — layout structure checks are sufficient

### Lighthouse CI Setup

- Both approaches: Playwright-based quick CWV checks in the test suite + full Lighthouse CI as a separate GitHub Actions job
- Playwright tests measure CLS and LCP using Performance Observer API
- @lhci/cli with lighthouserc.json for full Lighthouse scoring in CI
- Performance budgets: LCP < 2.5s, CLS < 0.1, FID < 100ms (hard fail in CI)

### Accessibility Scope

- axe-core scans on every page route using existing e2e/fixtures/axe-test.ts fixture
- Target: zero critical and serious violations
- Fix any violations found during testing rather than excluding rules
- Minor/moderate violations logged as warnings, not blockers

### Claude's Discretion

- Exact Lighthouse CI configuration and GitHub Actions workflow file
- Which axe-core rules to disable if any are genuinely false positives
- Performance Observer implementation details for CLS/LCP measurement
- How to handle flaky tests (retry strategy)

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Testing infrastructure

- `playwright.config.ts` — Playwright config (chromium, webServer, baseURL)
- `e2e/fixtures/axe-test.ts` — axe-core Playwright fixture for accessibility testing
- `e2e/responsive.spec.ts` — Existing responsive test pattern (3 viewports, overflow checks)
- `e2e/performance.spec.ts` — Existing performance test pattern (fonts, images, CLS)
- `e2e/accessibility.spec.ts` — Existing accessibility test pattern (axe scans)

### Site structure

- `src/pages/` — All page routes (homepage, blog, services, tools, about, case studies, company-profile, resources, privacy, responsible-disclosure)
- `src/components/Nav.astro` — Navigation with hamburger menu
- `src/components/ThemeToggle.astro` — Dark/light theme toggle
- `src/components/CookieBanner.astro` — Cookie consent flow

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `e2e/fixtures/axe-test.ts`: Custom Playwright fixture wrapping axe-core — already configured, used in accessibility.spec.ts
- Existing viewport array pattern in responsive.spec.ts — extend with 1024px
- Existing performance.spec.ts pattern for checking network requests and image attributes

### Established Patterns

- Concern-based spec files (one per domain: navigation, contact-form, etc.)
- `test.describe` blocks with requirement IDs in description (e.g., 'Performance' for UIUX-03)
- axe-core fixture imported as `{ test, expect }` from `./fixtures/axe-test`
- Playwright webServer config builds site before testing

### Integration Points

- `.github/workflows/` — CI pipeline for Lighthouse CI job
- `package.json` scripts — may need `test:e2e:lighthouse` or similar
- `lighthouserc.json` — new file at project root for LHCI config

</code_context>

<specifics>
## Specific Ideas

- Every page route must return 200 and have an h1 (comprehensive smoke test)
- Interactive elements to test: contact form (already covered), tag filtering, quiz completion (already covered), theme toggle, cookie consent, WhatsApp links, nav hamburger
- Responsive checks: hamburger menu state changes, CTA visibility, no overflow
- Performance: both in-test CWV measurement and standalone Lighthouse CI

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 12-full-site-playwright-testing_
_Context gathered: 2026-03-19_
