---
phase: 1
slug: code-quality-tooling
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                    |
| ---------------------- | ---------------------------------------- |
| **Framework**          | vitest 4.x with happy-dom                |
| **Config file**        | vitest.config.ts (created in this phase) |
| **Quick run command**  | `npx vitest run --reporter=verbose`      |
| **Full suite command** | `npx vitest run --coverage`              |
| **Estimated runtime**  | ~5 seconds                               |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID                     | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status     |
| --------------------------- | ---- | ---- | ----------- | --------- | ----------------- | ----------- | ---------- |
| (populated during planning) |      |      |             |           |                   |             | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest configuration with happy-dom and coverage
- [ ] `tests/setup.ts` — shared test setup (happy-dom environment)
- [ ] `vitest` + `@vitest/coverage-v8` + `happy-dom` — dev dependencies installed

_Note: This phase CREATES the test infrastructure, so Wave 0 is part of Phase 1 itself._

---

## Manual-Only Verifications

| Behavior               | Requirement | Why Manual                         | Test Instructions                                                    |
| ---------------------- | ----------- | ---------------------------------- | -------------------------------------------------------------------- |
| Theme toggle visual    | QUAL-01     | Visual confirmation needed         | Click toggle, verify colors change, refresh page, verify persistence |
| Pre-commit hook blocks | QUAL-05     | Requires actual git commit attempt | Introduce lint error, attempt `git commit`, verify rejection         |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
