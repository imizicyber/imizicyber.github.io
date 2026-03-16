---
phase: 2
slug: security-hardening-and-test-coverage
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                              |
| ---------------------- | -------------------------------------------------- |
| **Unit Framework**     | vitest 4.x with happy-dom (from Phase 1)           |
| **E2E Framework**      | playwright (installed in this phase)               |
| **Unit config**        | vitest.config.ts                                   |
| **E2E config**         | playwright.config.ts (created in this phase)       |
| **Quick run command**  | `npx vitest run --reporter=verbose`                |
| **Full suite command** | `npx vitest run --coverage && npx playwright test` |
| **Estimated runtime**  | ~15 seconds (unit) + ~30 seconds (E2E)             |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --coverage && npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID                     | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status     |
| --------------------------- | ---- | ---- | ----------- | --------- | ----------------- | ----------- | ---------- |
| (populated during planning) |      |      |             |           |                   |             | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `playwright.config.ts` — Playwright configuration
- [ ] `@playwright/test` + `@axe-core/playwright` — dev dependencies installed
- [ ] `npx playwright install chromium` — browser binary installed

_Note: Playwright infrastructure is created in this phase._

---

## Manual-Only Verifications

| Behavior            | Requirement | Why Manual               | Test Instructions                             |
| ------------------- | ----------- | ------------------------ | --------------------------------------------- |
| CSP header scan     | QUAL-09     | External tool validation | Run securityheaders.com scan on deployed site |
| Quiz PDF generation | QUAL-10     | PDF output verification  | Complete quiz, download PDF, verify content   |
| Git history clean   | QUAL-11     | Full history analysis    | Run `gitleaks detect` on repo                 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
