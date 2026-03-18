# Phase 11: Navigation and Quality Completion - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix all navigation dead-ends (broken breadcrumbs, missing /about/ link), extract remaining inline scripts (except justified FOUC guard), fill E2E test coverage gaps, and remove orphaned exports. This is the final v1.0 gap closure phase.

</domain>

<decisions>
## Implementation Decisions

### Breadcrumb fix — Case studies index page

- Create `/case-studies/index.astro` listing both existing case studies
- Use the existing `CASE_STUDIES` data module from `src/data/case-studies.ts` (resolves orphaned export)
- Match the blog index visual pattern — card-based grid with summary, engagement type, and region
- Case study breadcrumbs stay as-is (Home / Case Studies / [title]) — no changes needed once index page exists
- Add "Case Studies" link to footer only (not main nav) — secondary discovery path

### About page navigation

- Update footer "About" link from `#about` to `/about/`
- Add "About" link to main nav as well — founder credibility is a key trust signal
- Nav position: Claude's discretion (somewhere between content links and conversion CTAs)

### Theme init inline script (QUAL-08 exception)

- Keep the `is:inline` script in BaseLayout.astro `<head>` — it prevents FOUC by reading localStorage before paint
- Add a code comment explaining why it must stay inline
- Document this as a justified exception to QUAL-08: "All inline scripts extracted except theme init FOUC guard"
- Claude should scan the full codebase for any other remaining inline scripts or define:vars patterns and extract those

### Orphaned exports cleanup

- Delete `loadJsPDF()` from `src/scripts/quiz/pdf.ts` — legacy stub, all callers use `new jsPDF()` directly
- `CASE_STUDIES` is no longer orphaned once the case studies index page imports it

### E2E test coverage

- Verify existing contact form submission tests (`e2e/contact-form.spec.ts`) pass against updated site
- Verify existing Free Score CTA nav link test (`e2e/navigation.spec.ts`) passes
- Add new E2E tests for: case studies index page loading, /about/ nav link resolving, breadcrumb links not 404ing
- Test file structure: Claude's discretion (add to navigation.spec.ts or new spec file)

### Claude's Discretion

- "About" nav link position in main nav order
- Case studies index page exact layout/styling details
- E2E test file organization (new spec vs existing)
- Any additional inline script extraction found during codebase scan

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Navigation and breadcrumbs

- `.planning/v1.0-MILESTONE-AUDIT.md` — Audit findings: /about/ not linked, case study breadcrumb 404, orphaned exports
- `src/components/Breadcrumb.astro` — Generic breadcrumb component (case studies hard-code breadcrumbs inline)
- `src/pages/case-studies/east-africa-bank-pentest.astro` — Case study page with broken breadcrumb
- `src/pages/case-studies/mobile-money-security-assessment.astro` — Case study page with broken breadcrumb

### Data modules

- `src/data/case-studies.ts` — CASE_STUDIES array with metadata for both studies (slug, title, clientType, region, etc.)
- `src/scripts/quiz/pdf.ts` — Contains orphaned loadJsPDF export to remove

### Navigation components

- `src/components/Footer.astro` — Footer with About link pointing to #about (needs update to /about/)
- Nav component — needs About link added (find via grep for nav links)

### Existing E2E tests

- `e2e/contact-form.spec.ts` — Comprehensive contact form tests including submission flow
- `e2e/navigation.spec.ts` — Nav link assertions including Free Score CTA

### Inline scripts

- `src/layouts/BaseLayout.astro` line 102 — Theme init is:inline script (justified exception)

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/data/case-studies.ts` — CASE_STUDIES typed array with slug, title, clientType, region, engagementType, duration, findingsCount, criticalCount, summary — ready for index page
- `src/components/Breadcrumb.astro` — Generic breadcrumb component (case study pages don't use it but could be refactored to)
- Blog index page pattern — card-based grid layout can be adapted for case studies

### Established Patterns

- DOMContentLoaded for static MPA event binding (Phase 10 decision)
- Blog index card grid layout — model for case studies index
- Footer link structure in Footer.astro
- E2E test pattern: Playwright with axe-core fixtures

### Integration Points

- Footer.astro — update About href from #about to /about/
- Nav component — add About link
- New /case-studies/index.astro — renders from CASE_STUDIES data
- BaseLayout.astro — theme init script gets explanatory comment

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. Follow existing site patterns (blog index for case studies listing, existing nav/footer patterns for link additions).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 11-navigation-and-quality-completion_
_Context gathered: 2026-03-18_
