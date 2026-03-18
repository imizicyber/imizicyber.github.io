---
phase: 11
slug: navigation-and-quality-completion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Framework**          | Playwright ^1.58.2 with @axe-core/playwright ^4.11.1                                  |
| **Config file**        | `playwright.config.ts`                                                                |
| **Quick run command**  | `npx playwright test e2e/navigation.spec.ts e2e/contact-form.spec.ts --reporter=line` |
| **Full suite command** | `npm run test:e2e`                                                                    |
| **Estimated runtime**  | ~30 seconds                                                                           |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test e2e/navigation.spec.ts e2e/contact-form.spec.ts --reporter=line`
- **After every plan wave:** Run `npm run test:e2e`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type | Automated Command                                              | File Exists    | Status     |
| -------- | ---- | ---- | ----------- | --------- | -------------------------------------------------------------- | -------------- | ---------- |
| 11-01-01 | 01   | 1    | QUAL-08     | E2E       | `npx playwright test e2e/csp.spec.ts --reporter=line`          | Yes            | ⬜ pending |
| 11-01-02 | 01   | 1    | QUAL-08     | E2E       | `npx playwright test e2e/contact-form.spec.ts --reporter=line` | Yes (8 tests)  | ⬜ pending |
| 11-01-03 | 01   | 1    | QUAL-07     | E2E       | `npx playwright test e2e/contact-form.spec.ts --reporter=line` | Yes            | ⬜ pending |
| 11-01-04 | 01   | 1    | QUAL-07     | E2E       | `npx playwright test e2e/navigation.spec.ts --reporter=line`   | Yes (CTA test) | ⬜ pending |
| 11-01-05 | 01   | 1    | QUAL-07     | E2E       | `npx playwright test e2e/navigation.spec.ts --reporter=line`   | No — Wave 0    | ⬜ pending |
| 11-01-06 | 01   | 1    | QUAL-07     | E2E       | `npx playwright test e2e/navigation.spec.ts --reporter=line`   | No — Wave 0    | ⬜ pending |
| 11-01-07 | 01   | 1    | QUAL-07     | E2E       | `npx playwright test e2e/navigation.spec.ts --reporter=line`   | No — Wave 0    | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] New tests in `e2e/navigation.spec.ts` — case studies index page loads, About nav link resolves, breadcrumb links not 404ing (3-4 new tests)
- [ ] Verify existing contact form and Free Score CTA tests pass after changes (no new test files needed)

_Test infrastructure is complete — Playwright, axe-core fixtures, webServer config all exist and work._

---

## Manual-Only Verifications

| Behavior                              | Requirement | Why Manual                         | Test Instructions                                                 |
| ------------------------------------- | ----------- | ---------------------------------- | ----------------------------------------------------------------- |
| BaseLayout FOUC guard comment present | QUAL-08     | Code comment, not testable via E2E | `grep "QUAL-08 justified exception" src/layouts/BaseLayout.astro` |

_All other phase behaviors have automated verification._

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
