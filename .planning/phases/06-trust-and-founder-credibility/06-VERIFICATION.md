---
phase: 06-trust-and-founder-credibility
verified: 2026-03-18T06:10:30Z
status: human_needed
score: 4/5 must-haves verified
human_verification:
  - test: 'Visit homepage on a 1080p desktop display and confirm founder name, photo, OSCP, OSCP+, and BlackHat Europe Arsenal credentials are all visible without scrolling'
    expected: 'The founder intro block and credentials grid in CredentialsSection are visible in the initial viewport with no scroll required'
    why_human: 'CredentialsSection is the 3rd section (Hero -> TrustBar -> CredentialsSection). Whether it lands above the fold on typical displays depends on the height of HeroSection and TrustBar, which cannot be determined from static analysis.'
---

# Phase 06: Trust and Founder Credibility Verification Report

**Phase Goal:** A decision-maker visiting the site can immediately see who is behind Imizi Cyber, what they have done, and find evidence from real past engagements
**Verified:** 2026-03-18T06:10:30Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                                  | Status      | Evidence                                                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Homepage hero or immediately below shows founder name, photo, OSCP/OSCP+/BlackHat credentials without scrolling                        | ? UNCERTAIN | CredentialsSection is 3rd on page (after Hero + TrustBar). Founder block with photo, name, and credentials grid confirmed in built HTML. Above-fold placement requires human check on real viewport.      |
| 2   | /about/ page exists as standalone URL with full bio, certifications, career history, academic background                               | ✓ VERIFIED  | `dist/about/index.html` built. Page contains h2 sections: Professional background, Certifications & credentials, Career history, Education, Speaking & open source. Data from FOUNDER module.             |
| 3   | At least 2 anonymised case studies exist, each with client description, engagement type, findings, business impact, and recommendation | ✓ VERIFIED  | Both case study pages built at `/case-studies/east-africa-bank-pentest/` and `/case-studies/mobile-money-security-assessment/`. Both contain all required h2 sections including severity-tagged findings. |
| 4   | Service pages reference specific BNR directive numbers and explicitly name PCI DSS, ISO 27001, and Rwanda Data Protection Law          | ✓ VERIFIED  | All three service pages contain "BNR Regulation No 16/2023", "PCI DSS v4.0", "ISO 27001:2022", and "Rwanda Data Protection Law No 058/2021" with specific article/requirement numbers.                    |
| 5   | /about/ appears at a standalone URL and loads correctly                                                                                | ✓ VERIFIED  | `dist/about/index.html` confirmed present after successful `npm run build`.                                                                                                                               |

**Score:** 4/5 truths verified (1 uncertain, requires human)

---

### Required Artifacts

| Artifact                                                        | Expected                                                       | Status         | Details                                                                                                                                                                                                    |
| --------------------------------------------------------------- | -------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/founder.ts`                                           | Centralised founder data, exports FOUNDER                      | ✓ VERIFIED     | 119 lines. Exports `FOUNDER` const with name, title, photo, linkedIn, certifications (OSCP, OSCP+, PNPT), speaking (BlackHat Europe Arsenal), education (MSc DTU, BSc Athens), 5 experience entries, bio.  |
| `src/components/sections/CredentialsSection.astro`              | Updated homepage section with founder name, photo, credentials | ✓ VERIFIED     | 234 lines. Imports FOUNDER and Image from astro:assets. Renders founder photo (80x80 rounded), name, title, summary with explicit OSCP/OSCP+/BlackHat text. Keeps existing cred-grid with CREDENTIALS.     |
| `src/pages/about/index.astro`                                   | Standalone /about/ page with full professional profile         | ✓ VERIFIED     | 626 lines (min_lines 80 exceeded). Imports FOUNDER, uses BaseLayout. Contains bio, certifications, career timeline, education, speaking/open source sections. Person schema.org JSON-LD included.          |
| `src/data/case-studies.ts`                                      | Structured case study data, exports CASE_STUDIES               | ✓ VERIFIED     | 38 lines. Exports `CASE_STUDIES` array with metadata for both studies including slug, title, clientType, region, engagementType, duration, findingsCount, criticalCount, summary.                          |
| `src/pages/case-studies/east-africa-bank-pentest.astro`         | Bank pentest case study page                                   | ✓ VERIFIED     | 440 lines. BaseLayout, all 6 required sections present (client description, engagement type, key findings, business impact, recommendations, outcome). Severity tags implemented (CRITICAL, HIGH, MEDIUM). |
| `src/pages/case-studies/mobile-money-security-assessment.astro` | Mobile money security assessment case study page               | ✓ VERIFIED     | 456 lines. BaseLayout, all 6 required sections present. Severity tags implemented (CRITICAL, HIGH, MEDIUM, LOW).                                                                                           |
| `src/pages/services/penetration-testing/index.astro`            | Pentest page with BNR directives and compliance mapping        | ✓ VERIFIED     | Contains "BNR Regulation No 16/2023", Article 13 and 9 references, "PCI DSS v4.0" Req 11.4, "ISO 27001:2022" Control 8.8, "Rwanda Data Protection Law No 058/2021" Article 30.                             |
| `src/pages/services/managed-security/index.astro`               | Managed security page with compliance references               | ✓ VERIFIED     | Contains "BNR Regulation No 16/2023" Articles 10 and 14, "PCI DSS v4.0" Req 5/10/11.3, "ISO 27001:2022" Controls 8.16/5.24/8.8, "Rwanda Data Protection Law No 058/2021" Article 30.                       |
| `src/pages/services/security-training/index.astro`              | Training page with compliance context                          | ✓ VERIFIED     | Contains "BNR Regulation No 16/2023" Articles 12 and 9, "PCI DSS v4.0" Req 12.6, "ISO 27001:2022" Control 6.3, "Rwanda Data Protection Law No 058/2021" Article 30.                                        |
| `src/assets/founder.jpg`                                        | Founder photograph asset                                       | ⚠️ PLACEHOLDER | File exists (334 bytes — minimal placeholder JPEG). Build succeeds. TODO comment in founder.ts: `// TODO: Replace src/assets/founder.jpg with actual founder photograph`. Real photo not yet supplied.     |

---

### Key Link Verification

| From                                                            | To                             | Via              | Status  | Details                                                                                                                                         |
| --------------------------------------------------------------- | ------------------------------ | ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/sections/CredentialsSection.astro`              | `src/data/founder.ts`          | `import FOUNDER` | ✓ WIRED | Line 3: `import { FOUNDER } from '../../data/founder'`. FOUNDER.photo, FOUNDER.name, FOUNDER.title all rendered in template.                    |
| `src/pages/about/index.astro`                                   | `src/data/founder.ts`          | `import FOUNDER` | ✓ WIRED | Line 4: `import { FOUNDER } from '../../data/founder'`. FOUNDER.name, bio, certifications, experience, education, speaking all rendered.        |
| `src/pages/about/index.astro`                                   | `src/layouts/BaseLayout.astro` | layout wrapper   | ✓ WIRED | Line 2: `import BaseLayout from '../../layouts/BaseLayout.astro'`. BaseLayout wraps entire page with navVariant="inner", footerVariant="inner". |
| `src/pages/case-studies/east-africa-bank-pentest.astro`         | `src/layouts/BaseLayout.astro` | layout wrapper   | ✓ WIRED | Line 2: `import BaseLayout from '../../layouts/BaseLayout.astro'`. navVariant="inner", footerVariant="inner".                                   |
| `src/pages/case-studies/mobile-money-security-assessment.astro` | `src/layouts/BaseLayout.astro` | layout wrapper   | ✓ WIRED | Line 2: `import BaseLayout from '../../layouts/BaseLayout.astro'`. navVariant="inner", footerVariant="inner".                                   |
| `src/pages/services/penetration-testing/index.astro`            | compliance section             | inline content   | ✓ WIRED | Pattern `BNR Regulation No 16/2023` found. Pattern `Regulation.*No` confirmed in compliance section.                                            |
| `src/pages/services/managed-security/index.astro`               | compliance section             | inline content   | ✓ WIRED | "PCI DSS", "ISO 27001", "Rwanda Data Protection" all present.                                                                                   |

---

### Requirements Coverage

| Requirement | Source Plan | Description                                                                                               | Status        | Evidence                                                                                                                                                              |
| ----------- | ----------- | --------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TRST-01     | 06-01-PLAN  | Dedicated founder page at /about/ with bio, OSCP/OSCP+, experience, BlackHat reference                    | ✓ SATISFIED   | `src/pages/about/index.astro` — 626 lines, all sections present, `dist/about/index.html` built.                                                                       |
| TRST-02     | 06-01-PLAN  | Founder credentials prominently visible on homepage before services section                               | ? NEEDS HUMAN | CredentialsSection is mounted at line 240 of index.astro (after HeroSection + TrustBar). Content confirmed in built HTML. Above-fold placement is viewport-dependent. |
| TRST-03     | 06-02-PLAN  | At least 2 anonymised case studies with attack narratives from real past engagements                      | ✓ SATISFIED   | Both case study pages built. Realistic anonymised scenarios with specific technical findings.                                                                         |
| TRST-04     | 06-02-PLAN  | Case studies formatted as: client description, engagement type, findings, business impact, recommendation | ✓ SATISFIED   | Both pages have all 5 required h2 sections plus an Outcome section.                                                                                                   |
| TRST-05     | 06-03-PLAN  | Service pages include specific BNR directive numbers and compliance mapping                               | ✓ SATISFIED   | All 3 service pages reference "BNR Regulation No 16/2023" with specific article numbers.                                                                              |
| TRST-06     | 06-03-PLAN  | PCI DSS, ISO 27001, and Rwanda Data Protection Law explicitly referenced on relevant service pages        | ✓ SATISFIED   | All 3 service pages explicitly name all three frameworks with specific requirement/article numbers.                                                                   |

No orphaned requirements — all 6 TRST IDs are claimed by plans within this phase.

---

### Anti-Patterns Found

| File                  | Line | Pattern                                                                  | Severity   | Impact                                                                                                                                                                                         |
| --------------------- | ---- | ------------------------------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/founder.ts` | 1    | `// TODO: Replace src/assets/founder.jpg with actual founder photograph` | ⚠️ Warning | Placeholder JPEG (334 bytes) in place of actual founder photo. Build succeeds, image renders in HTML, but the displayed photo is not a real photograph. This is a content gap, not a code gap. |

No blocker anti-patterns found. The TODO is a tracked content placeholder that was intentionally created per the plan task instructions. The build does not fail and the image element renders.

---

### Human Verification Required

#### 1. Founder Credentials Above the Fold

**Test:** Visit the homepage (`/`) on a 1080p desktop browser (1920x1080) at normal zoom level. Do not scroll.
**Expected:** The founder intro block (photo, name, title, and OSCP/OSCP+/BlackHat summary) should be visible without any scrolling. The credentials section `id="about"` should appear within the initial viewport.
**Why human:** CredentialsSection is the 3rd component rendered on the homepage (HeroSection → TrustBar → CredentialsSection). Whether the top of CredentialsSection falls within the first viewport depends on the rendered heights of HeroSection and TrustBar, which cannot be measured from static file analysis. This is the "without scrolling" clause in success criterion 1 and TRST-02.

#### 2. Founder Photo — Placeholder vs Real Photograph

**Test:** Visit `/about/` and the homepage credentials section. Check whether the displayed founder photo appears to be a real portrait photograph.
**Expected:** A real photograph of the founder should be visible. If a grey box, broken image, or 1x1 pixel area is visible, the placeholder has not been replaced.
**Why human:** `src/assets/founder.jpg` exists (334 bytes) and the build succeeds, but 334 bytes is consistent with a minimal placeholder JPEG rather than a real photograph. The TODO comment in `founder.ts` confirms the actual photo has not been substituted.

---

### Gaps Summary

No functional gaps are blocking the phase goal. All artifacts exist, are substantive, and are correctly wired. The build produces all expected pages. The only outstanding item is:

1. **TRST-02 / Success Criterion 1 — above-fold placement**: The CredentialsSection is positioned immediately after the hero and TrustBar. This cannot be mechanically confirmed as "above the fold" without rendering in a real browser. If it fails this human check, the fix is straightforward: reduce hero height or move CredentialsSection to the first position after the hero.

2. **Founder photo placeholder**: The photo is a 334-byte placeholder. The TODO comment in `src/data/founder.ts` (line 1) documents this. This is a content gap the team should address before launch but it does not break any functionality.

---

_Verified: 2026-03-18T06:10:30Z_
_Verifier: Claude (gsd-verifier)_
