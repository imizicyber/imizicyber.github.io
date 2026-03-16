# Phase 2: Security Hardening and Test Coverage - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Eliminate XSS risks, enforce CSP without unsafe-inline, add comprehensive E2E and accessibility tests, audit the repository for secrets, and add secret scanning to the pre-commit hook. The public codebase must pass scrutiny from a technical evaluator at a regulated enterprise.

Requirements: QUAL-07, QUAL-09, QUAL-10, QUAL-11, QUAL-12

</domain>

<decisions>
## Implementation Decisions

### CSP Strategy

- Hash-based CSP: compute SHA-256 hash of the one remaining `is:inline` FOUC prevention script in BaseLayout, add hash to CSP `script-src`
- Remove `'unsafe-inline'` from both `script-src` and `style-src` in CSP
- Company-profile page follows the same CSP strategy as the main site — consistent policy across all pages
- GitHub Pages has no server, so nonce-based CSP is not possible — hashes are the correct approach
- Both BaseLayout.astro (line 58-64) and company-profile/index.astro (line 18) need CSP updates

### E2E Test Scope

- Comprehensive Playwright tests: all pages load, all forms work, theme toggle, cookie banner, service pages, 404 page (~10-15 tests)
- E2E tests run in CI only (GitHub Actions), NOT in pre-commit hook — keeps commits fast
- Vitest unit tests remain in pre-commit (already configured from Phase 1)
- axe-core accessibility checks integrated into Playwright tests (QUAL-12)

### Secrets Audit

- Full git history scan using gitleaks or trufflehog — catches anything ever committed, even if later removed
- GA ID (G-R7TC88KH9N) and Formspree ID are intentionally public — exclude from scan
- Add gitleaks as a pre-commit hook to prevent future secret leaks
- Wire gitleaks into the existing Husky pre-commit pipeline (lint + typecheck + test + format + gitleaks)

### innerHTML Replacement

- Replace all innerHTML with DOM API (createElement + appendChild) everywhere — no exceptions
- 3 locations in `src/scripts/quiz/ui.ts`: score bullets (line 115), breakdown table (line 147), recommendations list (line 172)
- Test files also change: replace innerHTML test setup with DOM API helpers
- Zero innerHTML usage anywhere in the repo — consistent approach for a cybersecurity firm

### Claude's Discretion

- Exact Playwright test file organization (single file vs. per-page files)
- axe-core rule severity thresholds
- Gitleaks configuration (custom rules, allowlist format)
- CSP hash generation approach (build-time vs. manual)
- Whether to add `style-src` hashes or use external stylesheets

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context

- `.planning/PROJECT.md` — Project vision, constraints (public repo, GitHub Pages static hosting)
- `.planning/REQUIREMENTS.md` — QUAL-07, QUAL-09, QUAL-10, QUAL-11, QUAL-12 definitions
- `.planning/config.json` — Workflow settings

### Prior Phase Context

- `.planning/phases/01-code-quality-tooling/01-CONTEXT.md` — Phase 1 decisions: scripts in `src/scripts/`, Vitest configured, pre-commit hook, `@/` path alias
- `.planning/phases/01-code-quality-tooling/01-VERIFICATION.md` — Phase 1 verification results

### Codebase State

- `.planning/codebase/CONCERNS.md` — Known issues: CSP unsafe-inline, innerHTML in quiz, no tests
- `.planning/codebase/ARCHITECTURE.md` — BaseLayout CSP configuration, component structure

### Research

- `.planning/research/STACK.md` — Recommended: Vitest + Playwright, CSP hash approach
- `.planning/research/PITFALLS.md` — CSP hash on GitHub Pages needs verification, public repo credibility risk

### Key Source Files

- `src/layouts/BaseLayout.astro` — CSP meta tag (lines 58-64), FOUC prevention `is:inline` script (line 120)
- `src/pages/company-profile/index.astro` — Separate CSP meta tag (line 18)
- `src/scripts/quiz/ui.ts` — innerHTML usage (lines 115, 147, 172)
- `.husky/pre-commit` — Current pre-commit hook to extend with gitleaks

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `vitest.config.ts`: Already configured with happy-dom, coverage thresholds — Playwright config will be separate
- `.husky/pre-commit`: Existing hook to extend with gitleaks scanning
- `src/scripts/`: All client-side scripts already extracted and typed — innerHTML replacement is surgical
- `eslint.config.mjs`: Can add no-innerHTML ESLint rule to prevent regressions

### Established Patterns

- `@/` path alias for imports (from Phase 1)
- Vitest tests in `src/__tests__/` with happy-dom
- lint-staged in package.json for staged-file processing
- Pre-commit runs: typecheck → test → lint-staged (format + lint)

### Integration Points

- `src/layouts/BaseLayout.astro` line 58-64: CSP string construction — needs hash injection
- `src/layouts/BaseLayout.astro` line 120: FOUC prevention script — hash must match this exact content
- `src/pages/company-profile/index.astro` line 18: Separate CSP — must mirror main site approach
- `src/scripts/quiz/ui.ts` lines 115, 147, 172: innerHTML → DOM API replacement
- `.husky/pre-commit`: Add gitleaks step
- `package.json`: Add playwright, @axe-core/playwright, gitleaks as dev dependencies
- `.github/workflows/`: May need CI workflow for E2E tests

</code_context>

<specifics>
## Specific Ideas

- A CISO evaluating Imizi Cyber will run a security header scan on the site — CSP must be clean
- "No mistakes allowed" — comprehensive test coverage catches regressions before they reach production
- Public repo means every security choice is visible — zero innerHTML, clean CSP, no secrets in history
- Full history scan is important because the repo has been public since creation

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-security-hardening-and-test-coverage_
_Context gathered: 2026-03-16_
