---
phase: 02-security-hardening-and-test-coverage
verified: 2026-03-17T21:39:46Z
status: gaps_found
score: 4/5 success criteria verified
re_verification: false
gaps:
  - truth: 'E2E tests exist for every link in the main navigation, the contact form submission flow, and the security score quiz flow'
    status: partial
    reason: "Two sub-parts of SC1 are incomplete: (1) the 'Free Score' nav CTA link (/tools/security-score/) is not covered by navigation.spec.ts — only the four permanent nav links are tested; (2) the contact form submission flow is not tested — contact-form.spec.ts only checks field visibility and the required attribute, not filling out and submitting the form or seeing validation/success states."
    artifacts:
      - path: 'e2e/navigation.spec.ts'
        issue: "Tests presence of Services, Blog, Resources, Contact nav links but not the conditional 'Free Score' CTA nav link (/tools/security-score/) or 'Book a Consultation'"
      - path: 'e2e/contact-form.spec.ts'
        issue: 'Only checks field visibility and required attribute. No test fills out form fields, clicks submit, or verifies validation prevents empty submission or success/error states.'
    missing:
      - "Add assertion in navigation.spec.ts for the 'Free Score' nav CTA link presence (getByRole link /free score|security score/i)"
      - 'Add a submission flow test in contact-form.spec.ts: fill all fields, click submit, verify browser HTML5 validation blocks empty submission OR mock Formspree fetch and verify success message appears'
human_verification:
  - test: 'Run npx playwright test locally against a fresh build'
    expected: 'All 38 tests pass green, zero failures'
    why_human: 'Cannot run Playwright in this environment; last confirmed run was during phase execution (2026-03-17T21:33:07Z)'
  - test: 'Verify axe-core scan results at runtime'
    expected: 'Zero critical WCAG 2.1 AA violations on homepage, /blog/, and /tools/security-score/'
    why_human: 'axe-core violations can only be confirmed by running the browser-based test'
---

# Phase 2: Security Hardening and Test Coverage — Verification Report

**Phase Goal:** The public codebase passes scrutiny from a technical evaluator at a regulated enterprise — no XSS risks, no unsafe-inline CSP, no secrets, tests covering critical paths
**Verified:** 2026-03-17T21:39:46Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Success Criteria)

| #   | Truth                                                                           | Status       | Evidence                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | E2E tests exist for every nav link, contact form submission flow, and quiz flow | PARTIAL      | Nav links (4/6): services, blog, resources, contact tested. Missing: Free Score CTA, Book a Consultation. Quiz flow fully tested in quiz.spec.ts. Contact form submission flow not tested — only field presence + required attribute.                    |
| 2   | Playwright CI workflow runs on push to main and PRs                             | VERIFIED     | .github/workflows/test-e2e.yml triggers on `push: branches: [main]` and `pull_request: branches: [main]`, runs `npx playwright test`                                                                                                                     |
| 3   | Security score quiz works without innerHTML                                     | VERIFIED     | grep -r "innerHTML" src/scripts/ returns zero matches. ui.ts uses createElement (14x), textContent, replaceChildren (3x). ESLint no-restricted-syntax rule active.                                                                                       |
| 4   | git log and git grep reveal no API keys, tokens, or Formspree endpoint secrets  | VERIFIED     | gitleaks scan ran on 116 commits, 0 leaks found. Known-public GA ID (G-R7TC88KH9N) and Formspree form ID (mjgerrlv) are intentionally embedded in client-side HTML and allowlisted. No credential-pattern matches in git grep across .ts/.js/.mjs files. |
| 5   | axe-core scan reports zero critical violations on all tested pages              | HUMAN NEEDED | accessibility.spec.ts covers homepage, /blog/, /tools/security-score/ with AxeBuilder WCAG 2.1 AA tags, filtering for `impact === 'critical'`. Cannot confirm pass/fail without running browser.                                                         |

**Score:** 3 definitively verified / 1 partial / 1 needs human confirmation

---

## Required Artifacts

| Artifact                         | Expected                                     | Status               | Details                                                                                                                                                                             |
| -------------------------------- | -------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/scripts/quiz/ui.ts`         | Quiz UI with safe DOM API methods            | VERIFIED             | 14x createElement, 3x replaceChildren, 13x textContent. Zero innerHTML. Exports createBullet, createBreakdownBar, createRecoItem.                                                   |
| `eslint.config.mjs`              | ESLint rule banning innerHTML                | VERIFIED             | no-restricted-syntax rule with two AST selectors: AssignmentExpression and MemberExpression on innerHTML property                                                                   |
| `scripts/inject-csp.mjs`         | Post-build CSP injection with SHA-256 hashes | VERIFIED             | Computes sha256 hashes for all inline scripts and styles per HTML file. Builds CSP without unsafe-inline. Wired into build: `"build": "astro build && node scripts/inject-csp.mjs"` |
| `.gitleaks.toml`                 | Gitleaks allowlist for public IDs            | VERIFIED             | Allowlists G-R7TC88KH9N, https://formspree.io/f/, .planning/\*, .gitleaks.toml itself                                                                                               |
| `.husky/pre-commit`              | Pre-commit with gitleaks step                | VERIFIED             | 4 steps: typecheck, test --run, lint-staged, gitleaks protect --staged --redact --config .gitleaks.toml                                                                             |
| `playwright.config.ts`           | Playwright config with Astro webServer       | VERIFIED             | webServer: `npm run build && npm run preview`, url: localhost:4321, timeout: 120_000, baseURL configured                                                                            |
| `e2e/fixtures/axe-test.ts`       | Shared AxeBuilder fixture                    | VERIFIED             | Extends @playwright/test with makeAxeBuilder fixture using WCAG 2.1 AA tags                                                                                                         |
| `e2e/homepage.spec.ts`           | Homepage E2E tests                           | VERIFIED             | test.describe with 4 tests: title, hero visibility, CTA visibility, theme toggle                                                                                                    |
| `e2e/navigation.spec.ts`         | Navigation E2E tests                         | PARTIAL              | Tests 4 permanent nav links. Missing: Free Score CTA (/tools/security-score/), Book a Consultation                                                                                  |
| `e2e/contact-form.spec.ts`       | Contact form submission flow                 | PARTIAL              | Tests field visibility + required attribute only. No submission flow test.                                                                                                          |
| `e2e/quiz.spec.ts`               | Quiz completion E2E test                     | VERIFIED             | 2 tests: quiz page loads, complete 10-question flow produces numeric score in #score-num                                                                                            |
| `e2e/accessibility.spec.ts`      | axe-core scans across pages                  | VERIFIED (structure) | Scans homepage, /blog/, /tools/security-score/ filtering critical violations. Correctness requires human run.                                                                       |
| `.github/workflows/test-e2e.yml` | CI workflow for E2E tests                    | VERIFIED             | Triggers on push+PR to main, installs chromium, runs npx playwright test, uploads playwright-report artifact                                                                        |

---

## Key Link Verification

| From                             | To                         | Via                       | Status | Details                                                                                                                      |
| -------------------------------- | -------------------------- | ------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `scripts/inject-csp.mjs`         | `dist/*.html`              | post-build node script    | WIRED  | `package.json` build: `"astro build && node scripts/inject-csp.mjs"`. dist/index.html confirmed has hash-based CSP meta tag. |
| `e2e/accessibility.spec.ts`      | `e2e/fixtures/axe-test.ts` | import                    | WIRED  | `import { test, expect } from './fixtures/axe-test'`                                                                         |
| `.github/workflows/test-e2e.yml` | `playwright.config.ts`     | `npx playwright test`     | WIRED  | CI runs `npx playwright test` which reads playwright.config.ts with webServer and testDir config                             |
| `.husky/pre-commit`              | `.gitleaks.toml`           | `--config .gitleaks.toml` | WIRED  | `gitleaks protect --staged --redact --config .gitleaks.toml`                                                                 |

---

## Requirements Coverage

| Requirement | Source Plan | Status                    | Evidence                                                                                                                                          |
| ----------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| QUAL-10     | 02-01       | SATISFIED                 | Zero innerHTML in src/scripts/, ESLint AST-selector ban rule active                                                                               |
| QUAL-09     | 02-02       | SATISFIED                 | Built HTML has no unsafe-inline in script-src or style-src. SHA-256 hashes present in CSP.                                                        |
| QUAL-11     | 02-02       | SATISFIED                 | .gitleaks.toml created, gitleaks protect in pre-commit, full history scan confirmed clean                                                         |
| QUAL-07     | 02-03       | PARTIAL                   | 10 E2E spec files, 38 tests. Quiz and navigation flows tested. Contact form submission flow absent.                                               |
| QUAL-12     | 02-03       | SATISFIED (pending human) | axe-core fixture with WCAG 2.1 AA wired into accessibility.spec.ts. Zero critical violations structure is correct; runtime confirmation required. |

---

## Anti-Patterns Found

| File                       | Pattern                                                                  | Severity | Impact                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/contact-form.spec.ts` | No submission flow tested — only field visibility and required attribute | Warning  | SC1 partially unmet: "contact form submission flow" requires testing that submitting (even blocked by validation) behaves correctly                           |
| `e2e/navigation.spec.ts`   | Missing test for "Free Score" nav CTA link                               | Warning  | SC1 partially unmet: "every link in the main navigation" — the /tools/security-score/ CTA nav link (shown on homepage with showFreeTool=true) is not asserted |

No stub implementations found. No TODO/FIXME markers found in phase deliverables. No unsafe returns (null, {}, []) found in critical paths.

---

## Human Verification Required

### 1. Playwright Test Suite Execution

**Test:** Run `npx playwright test` from project root against a fresh build
**Expected:** All 38 tests pass (0 failures), including quiz completion flow and axe-core accessibility scans
**Why human:** Playwright requires a browser environment. The last confirmed green run was during phase execution at 2026-03-17T21:33:07Z; this verification cannot reproduce it programmatically.

### 2. axe-core Zero Critical Violations Confirmation

**Test:** With the test suite passing, confirm accessibility.spec.ts output shows `critical: []` for homepage, /blog/, and /tools/security-score/
**Expected:** Zero critical WCAG 2.1 AA violations on all three pages
**Why human:** axe-core violations are determined at browser runtime with fully rendered DOM; cannot be verified statically.

---

## Gaps Summary

**SC1 is partially met.** The quiz flow is well-tested (quiz.spec.ts exercises full 10-question completion and score display). The contact form submission flow is not tested — current tests only verify field presence and the `required` attribute; no test fills and submits the form or verifies that browser HTML5 validation blocks empty submission. Additionally, the "Free Score" CTA nav link (`/tools/security-score/`) is absent from navigation.spec.ts; the permanent four nav links (Services, Blog, Resources, Contact) are asserted but the conditional CTA links are not.

**SCs 2–4 are fully met.** The CI workflow is correctly configured, innerHTML is eliminated with ESLint enforcement, and the git history is clean of secrets.

**SC5 cannot be confirmed without a live browser run.** The test structure is correct and substantive, but correctness of the axe-core output requires human execution.

The two gaps in SC1 are additive tests — no existing code needs to change, only test additions:

1. One `expect(nav.getByRole('link', { name: /free score|security score/i })).toBeVisible()` assertion in navigation.spec.ts
2. A submission-flow test in contact-form.spec.ts (fill fields, click submit, assert validation state or mock Formspree)

---

_Verified: 2026-03-17T21:39:46Z_
_Verifier: Claude (gsd-verifier)_
