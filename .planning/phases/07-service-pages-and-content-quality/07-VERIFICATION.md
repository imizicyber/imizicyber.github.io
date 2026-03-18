---
phase: 07-service-pages-and-content-quality
verified: 2026-03-18T00:00:00Z
status: passed
score: 5/5 must-haves verified
re_verification: false
---

# Phase 7: Service Pages and Content Quality Verification Report

**Phase Goal:** Each flagship service page gives a technically literate buyer enough detail to evaluate methodology and compliance alignment, and every blog post links cohesively into the rest of the site
**Verified:** 2026-03-18
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Success Criteria)

| #   | Truth                                                                                                                                   | Status   | Evidence                                                                                                                                                                                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Penetration Testing page describes engagement methodology end-to-end, lists deliverables, and maps to at least one compliance framework | VERIFIED | `process-timeline` div at line 290; "What you receive" section at line 335 with 6 explicit deliverables; BNR Reg No 16/2023 Art 13, PCI DSS v4.0 Req 11.4, ISO 27001:2022 Control 8.8 at lines 402-414                                                  |
| 2   | Security Assessments and Custom Tooling each have dedicated service pages with comparable depth to the Penetration Testing page         | VERIFIED | Both files exist at 922 and 925 lines respectively (vs 968 for pentest); both have Schema.org Service+FAQPage+BreadcrumbList, process-timeline, compliance section with BNR/PCI DSS/ISO 27001 references, FAQ section, and CTA box                      |
| 3   | Security Training is present on the site but clearly positioned as a secondary offering, not a flagship                                 | VERIFIED | Badge is "COMPLEMENTARY SERVICE" (line 60); hero-callout present (line 71) linking to flagship services; training-card uses distinct `training-card` CSS class, not `card`, and is separated from the 4 flagship cards in ServicesSection               |
| 4   | All existing blog posts have been reviewed — posts with low quality or SEO value have been updated or removed                           | VERIFIED | 07-03-SUMMARY.md documents quality review of all 16 posts; all 16 have East African/Rwandan context, specific framework references, and practitioner tone; no posts flagged for removal                                                                 |
| 5   | Every blog post links to at least one related service page and at least one other blog post                                             | VERIFIED | Live grep check: 16/16 posts show `service >= 1` and `blog >= 1`; no broken blog slugs found; all 3 service slugs referenced (/services/penetration-testing, /services/security-assessments, /services/security-training) resolve to actual directories |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact                                              | Expected                                                         | Status   | Details                                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `src/pages/services/security-assessments/index.astro` | Security Assessments flagship page (min 200 lines)               | VERIFIED | 922 lines; contains Schema.org, methodology, compliance, FAQs, CTA              |
| `src/pages/services/custom-tooling/index.astro`       | Custom Tooling flagship page (min 200 lines)                     | VERIFIED | 925 lines; contains Schema.org, methodology, compliance, FAQs, CTA              |
| `src/components/sections/ServicesSection.astro`       | Updated homepage services grid with 4 cards + secondary training | VERIFIED | 208 lines; 4 flagship `card` links + 1 `training-card` link separated visually  |
| `src/pages/services/penetration-testing/index.astro`  | Enhanced pentest page with explicit deliverables section         | VERIFIED | 968 lines; "What you receive" section at line 335 with 6 itemized deliverables  |
| `src/pages/services/security-training/index.astro`    | Training page repositioned as secondary                          | VERIFIED | 667 lines; "COMPLEMENTARY SERVICE" badge and hero-callout present               |
| `src/content/blog/*.mdx` (16 files)                   | All blog posts with internal links                               | VERIFIED | 16/16 posts verified with at least 1 service link and at least 1 blog link each |

---

### Key Link Verification

| From                              | To                                | Via                  | Status | Details                                                                                                                       |
| --------------------------------- | --------------------------------- | -------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `ServicesSection.astro`           | `/services/security-assessments/` | href                 | WIRED  | Line 27: `href="/services/security-assessments/"`                                                                             |
| `ServicesSection.astro`           | `/services/custom-tooling/`       | href                 | WIRED  | Line 61: `href="/services/custom-tooling/"`                                                                                   |
| `ServicesSection.astro`           | `/services/penetration-testing/`  | href                 | WIRED  | Line 9: `href="/services/penetration-testing/"`                                                                               |
| `ServicesSection.astro`           | `/services/managed-security/`     | href                 | WIRED  | Line 44: `href="/services/managed-security/"`                                                                                 |
| `ServicesSection.astro`           | `/services/security-training/`    | href (training-card) | WIRED  | Line 79: `href="/services/security-training/"`                                                                                |
| `penetration-testing/index.astro` | `/services/security-assessments/` | cross-link           | WIRED  | Line 507: href to security-assessments                                                                                        |
| `penetration-testing/index.astro` | `/services/custom-tooling/`       | cross-link           | WIRED  | Line 512: href to custom-tooling                                                                                              |
| `security-training/index.astro`   | `/services/penetration-testing/`  | cross-link           | WIRED  | Line 74: flagship service callout link                                                                                        |
| `security-training/index.astro`   | `/services/security-assessments/` | cross-link           | WIRED  | Line 76: flagship service callout link                                                                                        |
| `src/content/blog/*.mdx`          | `/services/*`                     | markdown links       | WIRED  | 16/16 posts; 13 links to /services/penetration-testing, 9 to /services/security-assessments, 2 to /services/security-training |
| `src/content/blog/*.mdx`          | `/blog/*`                         | markdown links       | WIRED  | 16/16 posts; all referenced blog slugs resolve to actual .mdx files                                                           |

---

### Requirements Coverage

| Requirement | Source Plan | Description                                                                                        | Status    | Evidence                                                                                                                                       |
| ----------- | ----------- | -------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| SRVC-01     | 07-02       | Penetration Testing page updated with detailed methodology, deliverables, and compliance alignment | SATISFIED | process-timeline, "What you receive" section with 6 deliverables, BNR/PCI DSS/ISO 27001 compliance section with specific article numbers       |
| SRVC-02     | 07-01       | Security Assessments page created as flagship offering                                             | SATISFIED | 922-line page with Schema.org, methodology, deliverables, compliance alignment, 7 FAQs                                                         |
| SRVC-03     | 07-01       | Custom Tooling page created as flagship offering                                                   | SATISFIED | 925-line page with Schema.org, methodology, deliverables, compliance alignment, 7 FAQs                                                         |
| SRVC-04     | 07-02       | Security Training repositioned as secondary offering                                               | SATISFIED | "COMPLEMENTARY SERVICE" badge, hero-callout linking to flagships, separate `training-card` CSS class in ServicesSection below 4 flagship cards |
| SRVC-05     | 07-03       | All blog posts audited for quality and SEO value                                                   | SATISFIED | 16/16 posts reviewed; none flagged for removal; all have East African context and specific framework references                                |
| SRVC-06     | 07-03       | Blog posts link to each other and to relevant service pages                                        | SATISFIED | 16/16 posts have >= 1 service link and >= 1 blog link; no broken internal links                                                                |

No orphaned requirements — SRVC-07 and SRVC-08 are mapped to Phase 8 in REQUIREMENTS.md and are not claimed by any Phase 7 plan.

---

### Anti-Patterns Found

None. The key service files contain one developer comment (`<!-- BNR directive numbers sourced from public regulatory gazette; verify at bnr.rw before publishing -->`) which is informational and not a blocker.

---

### Human Verification Required

#### 1. Visual secondary positioning of Security Training

**Test:** Open the homepage and locate the services section
**Expected:** The four flagship service cards (Penetration Testing, Security Assessments, Continuous Security, Custom Tooling) render at full visual weight; the Security Awareness Training link renders below them in a noticeably smaller and simpler style
**Why human:** CSS class differences (`card` vs `training-card`) establish the visual hierarchy programmatically, but the actual rendered appearance requires a browser to confirm the visual de-emphasis is perceptible

#### 2. Penetration Testing deliverables section placement

**Test:** Open `/services/penetration-testing/` and scroll through the page
**Expected:** The "What you receive" section appears after the methodology timeline and before the "Who this is for" section — creating a logical reading flow: scope > process > outputs > audience
**Why human:** Section ordering is verified by line numbers (290 = timeline, 335 = deliverables, 365 = audience) which is correct, but reading the flow confirms the UX intent

---

### Gaps Summary

No gaps. All five success criteria are fully satisfied by the codebase as verified:

- Penetration Testing page has end-to-end methodology, explicit 6-item deliverables section, and compliance alignment with specific BNR/PCI DSS/ISO 27001 article numbers
- Security Assessments and Custom Tooling are substantive 920+ line pages matching the pentest page pattern with Schema.org, methodology timelines, compliance sections, FAQ, and CTAs
- Security Training is clearly secondary via badge text, hero callout, and visual separation in ServicesSection
- All 16 blog posts have been reviewed for quality (none removed or flagged as low quality)
- All 16 blog posts link to at least one service page and at least one other blog post with zero broken internal links

---

_Verified: 2026-03-18_
_Verifier: Claude (gsd-verifier)_
