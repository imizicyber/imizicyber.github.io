---
phase: 12
slug: full-site-playwright-testing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                                  |
| ---------------------- | ---------------------------------------------------------------------- |
| **Framework**          | Playwright ^1.58.2 with @axe-core/playwright ^4.11.1 + @lhci/cli (new) |
| **Config file**        | `playwright.config.ts` + `lighthouserc.json` (new)                     |
| **Quick run command**  | `npx playwright test e2e/page-routes.spec.ts --reporter=line`          |
| **Full suite command** | `npm run test:e2e`                                                     |
| **Estimated runtime**  | ~100 seconds                                                           |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test --reporter=line` (relevant spec only)
- **After every plan wave:** Run `npm run test:e2e`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds (per spec file)

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type | Automated Command                                               | File Exists               | Status  |
| -------- | ---- | ---- | ----------- | --------- | --------------------------------------------------------------- | ------------------------- | ------- |
| 12-01-01 | 01   | 1    | TEST-01     | E2E       | `npx playwright test e2e/page-routes.spec.ts --reporter=line`   | No — this plan creates it | pending |
| 12-01-02 | 01   | 1    | TEST-04     | E2E       | `npx playwright test e2e/accessibility.spec.ts --reporter=line` | Yes (extend)              | pending |
| 12-02-01 | 02   | 1    | TEST-02     | E2E       | `npx playwright test e2e/interactions.spec.ts --reporter=line`  | No — this plan creates it | pending |
| 12-02-02 | 02   | 1    | TEST-03     | E2E       | `npx playwright test e2e/responsive.spec.ts --reporter=line`    | Yes (extend)              | pending |
| 12-03-01 | 03   | 2    | TEST-05     | E2E+CI    | `npx playwright test e2e/performance.spec.ts --reporter=line`   | Yes (extend)              | pending |

_Status: pending / green / red / flaky_

---

## Wave 0 Requirements

- [ ] `e2e/page-routes.spec.ts` — new file for all page route smoke tests
- [ ] `e2e/interactions.spec.ts` — new file for theme toggle, WhatsApp, hamburger tests
- [ ] Extend `e2e/accessibility.spec.ts` — add all page routes to axe scans
- [ ] Extend `e2e/responsive.spec.ts` — add 1024px viewport and layout structure checks
- [ ] Extend `e2e/performance.spec.ts` — add CWV measurement tests
- [ ] `lighthouserc.json` — new config for Lighthouse CI

---

## Manual-Only Verifications

_All phase behaviors have automated verification._

---

## Validation Sign-Off

- [ ] All tasks have automated verify
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
