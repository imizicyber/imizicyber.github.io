---
phase: 3
slug: component-architecture-and-visual-redesign
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                         |
| ---------------------- | ------------------------------------------------------------- |
| **Framework**          | Playwright ^1.58.2 + axe-core                                 |
| **Config file**        | `playwright.config.ts`                                        |
| **Quick run command**  | `npx playwright test e2e/homepage.spec.ts --project chromium` |
| **Full suite command** | `npx playwright test`                                         |
| **Estimated runtime**  | ~30 seconds                                                   |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test e2e/homepage.spec.ts e2e/navigation.spec.ts --project chromium`
- **After every plan wave:** Run `npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Test Type    | Automated Command                                                                                     | File Exists | Status     |
| -------- | ---- | ---- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| 03-01-01 | 01   | 1    | UIUX-01     | e2e + visual | `npx playwright test e2e/homepage.spec.ts --project chromium`                                         | Partial     | ⬜ pending |
| 03-01-02 | 01   | 1    | UIUX-02     | e2e          | `npx playwright test e2e/cta-visibility.spec.ts --project chromium`                                   | ❌ W0       | ⬜ pending |
| 03-01-03 | 01   | 1    | UIUX-03     | e2e          | `npx playwright test e2e/responsive.spec.ts --project chromium`                                       | ❌ W0       | ⬜ pending |
| 03-02-01 | 02   | 1    | UIUX-01     | build + e2e  | `npm run build && npx playwright test e2e/homepage.spec.ts e2e/navigation.spec.ts --project chromium` | ✅          | ⬜ pending |
| 03-03-01 | 03   | 2    | UIUX-03     | e2e + axe    | `npx playwright test e2e/accessibility.spec.ts`                                                       | ✅          | ⬜ pending |
| 03-03-02 | 03   | 2    | UIUX-01     | e2e          | `npx playwright test e2e/homepage.spec.ts`                                                            | ✅          | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

> **Note (03-02 verification approach):** Component extraction (UIUX-01) is verified via `npm run build` (Astro build fails if component imports are broken or markup is invalid) plus E2E tests (homepage.spec.ts verifies h1, CTA link, and theme toggle; navigation.spec.ts verifies nav links and page loads). A dedicated unit test (`tests/index-components.test.ts`) was considered but rejected — the build + E2E approach provides stronger guarantees because it validates the actual rendered output, not just import statements. Structural assertions about component delegation are implicitly covered: if index.astro fails to import or render a section component, the build fails or E2E selectors break.

---

## Wave 0 Requirements

- [ ] `e2e/cta-visibility.spec.ts` — stubs for UIUX-02: CTA visible above fold at 375px, 768px, 1440px on homepage, blog, service pages
- [ ] `e2e/responsive.spec.ts` — stubs for UIUX-03: no horizontal overflow at 375px, 768px, 1440px; key elements visible
- [ ] Update `e2e/homepage.spec.ts` — add assertion verifying index.astro delegates to section components (hero heading, services section, credentials section in expected DOM structure)
- [ ] Verify `e2e/accessibility.spec.ts` still passes (touch target minimum, contrast ratios)

_Existing infrastructure covers test framework and Playwright config._

---

## Manual-Only Verifications

| Behavior                            | Requirement | Why Manual                                          | Test Instructions                                                                                           |
| ----------------------------------- | ----------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Premium visual aesthetic perception | UIUX-01     | Subjective visual quality cannot be fully automated | Load homepage in 1440px browser; verify no template-feel, consistent typography/spacing, premium impression |
| Dark/light theme visual coherence   | UIUX-01     | Color harmony is subjective                         | Toggle theme; verify both modes look intentional and polished                                               |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
