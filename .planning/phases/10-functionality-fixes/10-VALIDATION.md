---
phase: 10
slug: functionality-fixes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                     |
| ---------------------- | --------------------------------------------------------- |
| **Framework**          | Playwright ^1.58.2 + Vitest ^4.1.0                        |
| **Config file**        | `playwright.config.ts`, `vitest.config.ts`                |
| **Quick run command**  | `npx playwright test e2e/blog.spec.ts --project=chromium` |
| **Full suite command** | `npm run test:e2e`                                        |
| **Estimated runtime**  | ~30 seconds                                               |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run test:e2e`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type   | Automated Command                                            | File Exists | Status     |
| -------- | ---- | ---- | ----------- | ----------- | ------------------------------------------------------------ | ----------- | ---------- |
| 10-01-01 | 01   | 1    | SRVC-07     | e2e         | `npx playwright test e2e/blog.spec.ts -g "tag filter"`       | Partial     | ⬜ pending |
| 10-01-02 | 01   | 1    | LEAD-08     | e2e         | `npx playwright test e2e/navigation.spec.ts -g "Free Score"` | Partial     | ⬜ pending |
| 10-01-03 | 01   | 1    | UIUX-05     | build-check | `npm run build && grep -r 'webp' dist/blog/*/index.html`     | ❌ W0       | ⬜ pending |
| 10-01-04 | 01   | 1    | SRVC-09     | e2e         | `npx playwright test e2e/blog.spec.ts -g "tag filter"`       | Partial     | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `e2e/blog.spec.ts` — add tag filter click test (covers SRVC-07 + SRVC-09)
- [ ] `e2e/navigation.spec.ts` — add "Free Score" visibility on non-homepage page (covers LEAD-08)
- [ ] Build output verification for WebP OG image in schema.org (covers UIUX-05)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
| -------- | ----------- | ---------- | ----------------- |
| None     | —           | —          | —                 |

_All phase behaviors have automated verification._

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
