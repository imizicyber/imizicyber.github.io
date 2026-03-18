---
phase: 04-performance-and-accessibility
verified: 2026-03-18T04:00:00Z
status: gaps_found
score: 3/5 success criteria verified (2 human-only, 1 failed automated)
re_verification: false
gaps:
  - truth: 'All images in the built output use modern formats (WebP or AVIF)'
    status: failed
    reason: 'OG image is imported via raw asset import (ogImageAsset.src), not via Astro <Image> component. Astro copies and hashes the PNG but does not convert it to WebP/AVIF. Built output contains og.DLZqRScw.png, zero .webp or .avif files exist in dist/_astro/.'
    artifacts:
      - path: 'src/components/SEOHead.astro'
        issue: 'Imports og.png with raw import, uses ogImageAsset.src. Raw import does not trigger Astro image optimisation pipeline — only the <Image> component or getImage() do.'
      - path: 'src/assets/og.png'
        issue: 'Source file is PNG. No format conversion applied at build time.'
      - path: 'dist/_astro/og.DLZqRScw.png'
        issue: 'Built output is still PNG, not WebP or AVIF.'
    missing:
      - "Use Astro getImage() or <Image> component with format='webp' to produce a WebP version of the OG image"
      - "Update SEOHead.astro to call getImage({src: ogImageAsset, format: 'webp'}) and use the resulting .src"
human_verification:
  - test: 'Lighthouse Performance score on throttled mobile'
    expected: 'Score 90+ on Moto G Power slow 4G simulation in Lighthouse'
    why_human: 'No Lighthouse CI configured. Requires manual run in Chrome DevTools or PageSpeed Insights after deployment. Font self-hosting and preload provide strong LCP signals but score cannot be verified programmatically from source.'
  - test: 'LCP under 2.5s and CLS below 0.1 on every page'
    expected: 'Largest Contentful Paint < 2.5s and Cumulative Layout Shift < 0.1 on throttled mobile'
    why_human: 'No Playwright performance metric assertions. E2E tests verify preconditions (preload, self-hosted fonts, img dimensions) but not the actual CWV measurements. Requires PageSpeed Insights or Lighthouse run.'
  - test: 'WAVE accessibility checker — zero errors and zero contrast errors'
    expected: 'WAVE browser extension or API reports 0 errors and 0 contrast errors on every page'
    why_human: 'axe-core E2E tests catch critical ARIA violations but WAVE checks additional pattern types (empty alt text, missing form labels, colour contrast ratios). Requires manual WAVE run on homepage, blog index, and contact page.'
  - test: 'Every interactive element has a visible focus indicator meeting WCAG 2.1 AA'
    expected: 'Tabbing through the page shows a clearly visible green outline on all buttons, links, inputs, and the hamburger menu button against every background colour'
    why_human: ':focus-visible CSS rule is present and wired, but contrast adequacy of the green outline against specific background colours (dark nav, light section backgrounds) requires visual inspection or automated contrast measurement.'
---

# Phase 4: Performance and Accessibility Verification Report

**Phase Goal:** Achieve LCP under 2.5 seconds on 3G, pass Core Web Vitals, and make every page fully accessible
**Verified:** 2026-03-18T04:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from Success Criteria)

| #   | Truth                                                                       | Status         | Evidence                                                                                  |
| --- | --------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------- |
| 1   | Lighthouse Performance score 90+ on throttled mobile simulation             | ? HUMAN NEEDED | No Lighthouse CI; preconditions (self-hosted fonts, preload, no CDN) are verified         |
| 2   | LCP < 2.5s and CLS < 0.1 on every page                                      | ? HUMAN NEEDED | No CWV measurements in E2E; preconditions verified (font preload, img dimensions present) |
| 3   | All images in built output use modern formats (WebP or AVIF)                | ✗ FAILED       | dist/\_astro contains og.DLZqRScw.png (PNG); zero .webp/.avif files in built output       |
| 4   | WAVE reports zero errors and zero contrast errors on every page             | ? HUMAN NEEDED | axe-core scans pass for critical violations; WAVE verification requires manual run        |
| 5   | Every interactive element has a visible focus indicator meeting WCAG 2.1 AA | ? PARTIAL      | :focus-visible rule present (2px solid var(--acc)); contrast adequacy needs human check   |

**Score:** 0/1 automated truths fully verified; 3/5 truths require human verification; 1/5 failed

### Plan Must-Have Truths (from plan frontmatter)

#### Plan 01 Must-Have Truths

| #   | Truth                                                                       | Status     | Evidence                                                                 |
| --- | --------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| 1   | No network requests to fonts.googleapis.com or fonts.gstatic.com            | ✓ VERIFIED | E2E test passes; grep on src/ finds zero references; CSP tightened       |
| 2   | Body text renders in Plus Jakarta Sans 400 without waiting for external CDN | ✓ VERIFIED | @font-face at top of global.css; preload link in BaseLayout head         |
| 3   | OG image is served as WebP in the built output                              | ✗ FAILED   | dist/\_astro/og.DLZqRScw.png is PNG; Astro raw import does not convert   |
| 4   | Mobile viewports do not paint expensive gradient patterns                   | ✓ VERIFIED | Gradients are 2 simple radial dots at 0.07/0.03 opacity, GPU-accelerated |

#### Plan 02 Must-Have Truths

| #   | Truth                                                                            | Status     | Evidence                                                                         |
| --- | -------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| 1   | A keyboard-only user can Tab to every interactive element and activate it        | ✓ VERIFIED | E2E Tab navigation test passes; :focus-visible rule present                      |
| 2   | Pressing Escape closes the hamburger menu and returns focus to the menu button   | ✓ VERIFIED | E2E Escape key test passes; Nav.astro keydown listener confirmed in code         |
| 3   | A screen reader announces ARIA landmark regions (banner, main, contentinfo)      | ✓ VERIFIED | header wraps Nav; main#main role=main in BaseLayout; footer role=contentinfo     |
| 4   | Submitting the contact form shows a loading spinner with 'Sending...' text       | ✓ VERIFIED | E2E loading state test passes; spinner element and JS state management confirmed |
| 5   | After successful submission, a success message is announced via aria-live region | ✓ VERIFIED | E2E success state test passes; aria-live="polite" div wraps #contact-success     |
| 6   | After failed submission, an error message is announced via aria-live region      | ✓ VERIFIED | E2E error state test passes; hidden attribute toggled on #contact-error          |

#### Plan 03 Must-Have Truths

| #   | Truth                                                                | Status     | Evidence                                                                                  |
| --- | -------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| 1   | Automated tests verify no Google Fonts network requests              | ✓ VERIFIED | e2e/performance.spec.ts test "no Google Fonts network requests" confirmed                 |
| 2   | Automated tests verify keyboard navigation (Tab, Escape, focus trap) | ✓ VERIFIED | e2e/accessibility.spec.ts contains Tab, Escape, and focus trap tests                      |
| 3   | Automated tests verify contact form ARIA states                      | ✓ VERIFIED | e2e/contact-form.spec.ts tests loading/success/error states, aria-busy, aria-live         |
| 4   | Automated tests verify ARIA landmarks on all tested pages            | ✓ VERIFIED | accessibility.spec.ts verifies header, main#main, footer[role=contentinfo]                |
| 5   | All tests pass in CI (npm run test:e2e)                              | ? PARTIAL  | Summaries claim all pass; blog.spec.ts:26 (pre-existing duplicate main) noted as deferred |

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact                                         | Expected                              | Status     | Details                                                                                                          |
| ------------------------------------------------ | ------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `public/fonts/plus-jakarta-sans-400-latin.woff2` | Self-hosted body font (Latin subset)  | ✓ VERIFIED | 28KB, exists at expected path                                                                                    |
| `public/fonts/plus-jakarta-sans-700-latin.woff2` | Self-hosted bold font (Latin subset)  | ✓ VERIFIED | 12KB, exists at expected path                                                                                    |
| `public/fonts/jetbrains-mono-400-latin.woff2`    | Self-hosted monospace font            | ✓ VERIFIED | 24KB, exists at expected path                                                                                    |
| `src/styles/global.css`                          | @font-face declarations for 3 fonts   | ✓ VERIFIED | 3 @font-face blocks at top of file                                                                               |
| `src/layouts/BaseLayout.astro`                   | Font preload link, no Google Fonts    | ✓ VERIFIED | preload href=/fonts/plus-jakarta-sans-400...                                                                     |
| `src/assets/og.png`                              | OG image moved for Astro optimisation | ⚠️ PARTIAL | File moved from public/ to src/assets/ but imported as raw asset, not via Image component — PNG output, not WebP |

### Plan 02 Artifacts

| Artifact                           | Expected                                          | Status     | Details                                                            |
| ---------------------------------- | ------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `src/layouts/BaseLayout.astro`     | header wraps Nav, main#main wraps slot            | ✓ VERIFIED | `<header>` at line 115, `<main id="main" role="main">` at line 119 |
| `src/components/Nav.astro`         | Focus trap, Escape key handler                    | ✓ VERIFIED | keydown listener for Escape, Tab focus wrap in nav                 |
| `src/components/ContactForm.astro` | Spinner, aria-busy, aria-live region, hidden msgs | ✓ VERIFIED | All elements present and wired in script                           |
| `src/components/Footer.astro`      | role=contentinfo on footer element                | ✓ VERIFIED | `<footer role="contentinfo">` at line 36                           |

### Plan 03 Artifacts

| Artifact                    | Expected                                        | Status     | Details                                          |
| --------------------------- | ----------------------------------------------- | ---------- | ------------------------------------------------ |
| `e2e/performance.spec.ts`   | Tests for font self-hosting, image opt, CLS     | ✓ VERIFIED | 5 tests covering UIUX-04, UIUX-05, UIUX-06       |
| `e2e/accessibility.spec.ts` | Extended tests for ARIA landmarks, keyboard nav | ✓ VERIFIED | 5 new tests for UIUX-08 added alongside existing |
| `e2e/contact-form.spec.ts`  | Extended tests for form ARIA states + axe scan  | ✓ VERIFIED | 6 new tests + 1 axe-core scan for UIUX-07        |

---

## Key Link Verification

### Plan 01 Key Links

| From                           | To                          | Via                     | Status     | Details                                                      |
| ------------------------------ | --------------------------- | ----------------------- | ---------- | ------------------------------------------------------------ |
| `src/layouts/BaseLayout.astro` | `public/fonts/...400.woff2` | link rel=preload        | ✓ WIRED    | `<link rel="preload" href="/fonts/plus-jakarta-sans-400..."` |
| `src/styles/global.css`        | `public/fonts/`             | @font-face src url      | ✓ WIRED    | `url('/fonts/plus-jakarta-sans-400-latin.woff2')`            |
| `src/components/SEOHead.astro` | `src/assets/og.png`         | import + .src reference | ⚠️ PARTIAL | Import exists; but .src gives PNG hash, not WebP URL         |

### Plan 02 Key Links

| From                               | To                         | Via                              | Status  | Details                                        |
| ---------------------------------- | -------------------------- | -------------------------------- | ------- | ---------------------------------------------- |
| `src/components/Nav.astro`         | hamburger menu             | keydown listener for Escape      | ✓ WIRED | `if (e.key === 'Escape' ...)` at line 104      |
| `src/components/ContactForm.astro` | form status messages       | aria-live=polite region + hidden | ✓ WIRED | `<div id="form-status" aria-live="polite">`    |
| `src/layouts/BaseLayout.astro`     | `src/components/Nav.astro` | header wrapping Nav              | ✓ WIRED | `<header><Nav .../></header>` at lines 115-117 |

### Plan 03 Key Links

| From                        | To         | Via                                  | Status  | Details                                       |
| --------------------------- | ---------- | ------------------------------------ | ------- | --------------------------------------------- |
| `e2e/performance.spec.ts`   | built site | page.on('request') network intercept | ✓ WIRED | `page.on('request', ...)` at line 6           |
| `e2e/accessibility.spec.ts` | built site | Playwright keyboard actions          | ✓ WIRED | `page.keyboard.press('Tab')` and `('Escape')` |

---

## Requirements Coverage

| Requirement | Plan(s) | Description                                                            | Status         | Evidence                                                                                                                                               |
| ----------- | ------- | ---------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| UIUX-04     | 01, 03  | LCP under 2.5 seconds on simulated 3G connection                       | ? HUMAN NEEDED | Font preload + self-hosting reduces LCP; no CWV measurement                                                                                            |
| UIUX-05     | 01, 03  | All images use Astro Image component with WebP format and lazy loading | ✗ FAILED       | OG image served as PNG from raw import; no WebP output in dist                                                                                         |
| UIUX-06     | 01, 03  | Fonts optimized (preload, font-display swap, self-hosting)             | ✓ VERIFIED     | 3 WOFF2 self-hosted; @font-face with swap; preload in head                                                                                             |
| UIUX-07     | 02, 03  | Contact form shows loading, success, and error states with ARIA        | ✓ VERIFIED     | Spinner, aria-busy, aria-live all present and E2E tested                                                                                               |
| UIUX-08     | 02, 03  | Skip link, keyboard navigation, and screen reader support on all pages | ✓ VERIFIED     | ARIA landmarks, section labels, focus trap, skip link all wired                                                                                        |
| UIUX-09     | 01      | Decorative CSS gradients disabled or simplified on mobile viewports    | ? PARTIAL      | Gradients kept as-is per evaluation decision (negligible GPU cost); requirement says "disabled or simplified" — met via "evaluated and justified kept" |
| UIUX-10     | 03      | Core Web Vitals pass Google PageSpeed Insights for mobile              | ? HUMAN NEEDED | Manual-only per plan; no Lighthouse CI; preconditions are strong                                                                                       |

### UIUX-09 Note

The plan's research evaluated the mobile gradient paint cost as sub-1ms (GPU-accelerated, simple dot pattern at low opacity). The decision was documented in the SUMMARY as intentional: "Mobile gradients kept as-is." The REQUIREMENTS.md text says "disabled or simplified on mobile viewports," which technically means the requirement was addressed by evaluation/justification rather than code change. This is a borderline case — the spirit is "don't hurt mobile performance," which was validated; the letter says "disabled or simplified," which was not applied.

---

## Anti-Patterns Found

| File                          | Line | Pattern                           | Severity   | Impact                                                                                                                                      |
| ----------------------------- | ---- | --------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/index.astro`       | 26   | Hardcoded `/og.png` in schema.org | ⚠️ Warning | Schema image references `/og.png` which 404s in production (moved to `_astro/`); SEO crawlers may get a broken image URL in structured data |
| `dist/_astro/og.DLZqRScw.png` | n/a  | PNG format in built output        | ✗ Blocker  | OG image not converted to WebP/AVIF, violating success criterion SC3                                                                        |

---

## Human Verification Required

### 1. Lighthouse Performance Score

**Test:** Run Lighthouse in Chrome DevTools against production or `npm run preview`, throttled to "Moto G Power slow 4G" preset on the homepage.
**Expected:** Performance score 90 or higher.
**Why human:** No Lighthouse CI or automated performance score assertion exists. The code changes (self-hosted fonts, preload, no CDN, self-hosted WOFF2) are all in place, but the actual score has not been measured.

### 2. LCP and CLS Measurement

**Test:** Use Chrome DevTools Performance tab or PageSpeed Insights to measure LCP element timing and CLS score on the homepage.
**Expected:** LCP < 2.5 seconds on simulated 3G; CLS < 0.1.
**Why human:** No Playwright CWV measurement assertions. The E2E tests verify structural preconditions (img dimensions, preload link) but not actual timing or layout shift.

### 3. WAVE Accessibility Check

**Test:** Install the WAVE browser extension and run it on the homepage, blog index page, and contact form page.
**Expected:** Zero errors and zero contrast errors on all tested pages.
**Why human:** The axe-core E2E tests catch critical ARIA violations but WAVE additionally checks image alt text patterns, form label associations, and colour contrast calculations that axe-core does not flag by default.

### 4. Focus Indicator Visual Contrast

**Test:** Tab through the homepage in a browser, verifying that the green focus ring is clearly visible on every interactive element including: skip link, nav links, hamburger button, theme toggle, form inputs, submit button, footer links, WhatsApp button.
**Expected:** 3:1 minimum contrast ratio for focus indicator against adjacent background (WCAG 2.1 AA non-text contrast).
**Why human:** The CSS `:focus-visible { outline: 2px solid var(--acc) }` rule is present, but the green accent colour against the dark navy nav may need contrast ratio verification with a colour contrast tool.

---

## Gaps Summary

One gap blocks goal achievement:

**Success Criterion 3 (WebP/AVIF images) is not met.** The OG image was moved from `public/` to `src/assets/` and imported via raw ESM import in `SEOHead.astro`. This gives Astro a hashed path but does NOT trigger format conversion. The built output contains `og.DLZqRScw.png` — a PNG. Zero WebP or AVIF files exist anywhere in `dist/`. The requirement (UIUX-05) states "All images use Astro Image component with WebP format." The fix is to use `getImage({ src: ogImageAsset, format: 'webp' })` in the SEOHead component frontmatter and use the resulting `.src` for the og:image meta tag.

Additionally, `src/pages/index.astro` line 26 has a hardcoded `/og.png` in the schema.org structured data object. Since `/og.png` now 404s in production (file moved to `_astro/`), this is a broken image URL in structured data. This was noted in the SUMMARY as a pre-existing issue in `SchemaOrg.astro` but the actual breakage is in `index.astro`.

Three success criteria (SC1 Lighthouse score, SC2 LCP/CLS, SC4 WAVE zero errors) require human verification and cannot be confirmed from source code alone.

---

_Verified: 2026-03-18T04:00:00Z_
_Verifier: Claude (gsd-verifier)_
