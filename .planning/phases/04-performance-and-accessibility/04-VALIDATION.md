---
phase: 4
slug: performance-and-accessibility
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                      |
| ---------------------- | ------------------------------------------ |
| **Framework**          | vitest + playwright + axe-core             |
| **Config file**        | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command**  | `npm run test`                             |
| **Full suite command** | `npm run test && npx playwright test`      |
| **Estimated runtime**  | ~30 seconds                                |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test && npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement      | Test Type   | Automated Command                               | File Exists | Status     |
| -------- | ---- | ---- | ---------------- | ----------- | ----------------------------------------------- | ----------- | ---------- |
| 04-01-01 | 01   | 1    | UIUX-06          | integration | `npx playwright test --grep "font"`             | ❌ W0       | ⬜ pending |
| 04-01-02 | 01   | 1    | UIUX-05          | integration | `npx playwright test --grep "image"`            | ❌ W0       | ⬜ pending |
| 04-02-01 | 02   | 1    | UIUX-07          | e2e         | `npx playwright test --grep "contact"`          | ❌ W0       | ⬜ pending |
| 04-02-02 | 02   | 1    | UIUX-08          | e2e         | `npx playwright test --grep "keyboard\|aria"`   | ❌ W0       | ⬜ pending |
| 04-03-01 | 03   | 2    | UIUX-09          | e2e         | `npx playwright test --grep "gradient\|mobile"` | ❌ W0       | ⬜ pending |
| 04-03-02 | 03   | 2    | UIUX-04, UIUX-10 | lighthouse  | `npx playwright test --grep "vitals\|lcp"`      | ❌ W0       | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `tests/e2e/phase04-perf-a11y.spec.ts` — test stubs for UIUX-04 through UIUX-10
- [ ] Lighthouse CI or Playwright performance measurement helper

_Existing Playwright + axe-core infrastructure covers accessibility testing; stubs needed for performance and form state tests._

---

## Manual-Only Verifications

| Behavior                             | Requirement | Why Manual                            | Test Instructions                                                                    |
| ------------------------------------ | ----------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| Google PageSpeed Insights 90+ mobile | UIUX-10     | External tool, requires deployed site | Run PageSpeed Insights on production URL after deploy                                |
| Screen reader announces all labels   | UIUX-08     | VoiceOver/NVDA behavior varies        | Tab through all interactive elements with VoiceOver, verify meaningful announcements |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
