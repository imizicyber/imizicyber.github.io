# Phase 4: Performance and Accessibility - Research

**Researched:** 2026-03-17
**Domain:** Web performance optimization, WCAG 2.1 AA accessibility, font loading, image optimization
**Confidence:** HIGH

## Summary

Phase 4 focuses on two intertwined concerns: making the site fast enough for MTN Rwanda mobile connections (LCP < 2.5s on Slow 4G) and ensuring WCAG 2.1 AA keyboard/screen reader accessibility. The site is text-heavy with only 4 small images in `public/`, so **font loading is the dominant performance lever** -- eliminating the Google Fonts CDN (3 external requests, 200-400ms DNS per lookup on African 3G) and self-hosting 3 subsetted WOFF2 files with preload will have the largest LCP impact.

The existing codebase already has good foundations: a SkipLink component, `prefers-reduced-motion` respect, `:focus-visible` styles using `var(--acc)`, and axe-core Playwright integration with WCAG 2.1 AA tags. The primary work is: (1) font self-hosting with Latin subsetting, (2) moving images from `public/` to `src/assets/` for Astro Image optimization, (3) adding ARIA landmarks and labels to all sections, (4) upgrading the contact form with loading/success/error states and ARIA live regions, (5) keyboard focus trapping in the hamburger menu, and (6) evaluating mobile gradient simplification.

**Primary recommendation:** Execute font self-hosting first -- it is the single largest performance improvement and has no dependencies. Then layer in image optimization, accessibility enhancements, and form states.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Font Loading Strategy:** Self-host all 3 font files (Plus Jakarta Sans 400, Plus Jakarta Sans 700, JetBrains Mono 400) in `public/fonts/`. Subset to Latin characters only. Preload the primary body font (Plus Jakarta Sans 400) via `<link rel="preload">`. Bold weight and monospace font load on demand with `font-display: swap`. Remove Google Fonts external stylesheet link and preconnect hints from BaseLayout. Write `@font-face` declarations with WOFF2 format.
- **Contact Form Feedback (UIUX-07):** Loading state: CSS spinner animation inside the submit button next to "Sending..." text, button disabled, `aria-busy="true"` on the form. Success/error messages announced via `aria-live="polite"` region.
- **Keyboard & Screen Reader (UIUX-08):** Full ARIA landmark regions: `role="banner"` on nav, `role="main"` on content, `role="contentinfo"` on footer, plus `aria-label` on each homepage section for screen reader section jumping.
- **Image Optimization (UIUX-05):** Convert all existing images to WebP where beneficial via Astro Image component. Apply `loading="lazy"` to all images below the fold.
- **Core Web Vitals (UIUX-04, UIUX-10):** Target Google PageSpeed Insights mobile score 90+, all Core Web Vitals green. LCP target: under 2.5s at simulated Slow 4G throttling.

### Claude's Discretion

- Contact form post-submit behavior (collapse vs reset)
- Exact success/error message visual design
- Mobile gradient simplification strategy (UIUX-09)
- Keyboard navigation scope beyond WCAG 2.1 AA minimums
- Focus indicator visual style (brand green vs system defaults)
- Critical CSS extraction approach
- Whether to add `will-change` or other GPU hints for animations

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                         | Research Support                                                                                                    |
| ------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| UIUX-04 | LCP under 2.5 seconds on simulated 3G connection                                    | Font self-hosting eliminates 3 external requests; Latin subsetting reduces file sizes 30-50%; preload critical font |
| UIUX-05 | All images use Astro Image component with WebP format and lazy loading              | Move images from `public/` to `src/assets/` for Astro optimization; `<Image>` auto-converts to WebP                 |
| UIUX-06 | Fonts optimized for performance (preload, font-display swap, evaluate self-hosting) | WOFF2 self-hosted fonts via Google Webfonts Helper or Fontsource; `@font-face` with `font-display: swap`            |
| UIUX-07 | Contact form shows clear loading, success, and error states with ARIA attributes    | CSS spinner in button, `aria-busy`, `aria-live="polite"` for status messages                                        |
| UIUX-08 | Skip link, keyboard navigation, and screen reader support on all pages              | SkipLink exists; add ARIA landmarks, section labels, focus trapping in mobile menu, Escape to close                 |
| UIUX-09 | Decorative CSS gradients disabled or simplified on mobile viewports                 | Evaluate paint cost of existing radial-gradient dot patterns; simplify or remove on mobile via media query          |
| UIUX-10 | Core Web Vitals pass Google PageSpeed Insights for mobile                           | Comprehensive: fonts + images + CSS optimization + gradient simplification = 90+ score                              |

</phase_requirements>

## Standard Stack

### Core (already in project)

| Library              | Version | Purpose                                               | Why Standard                                                           |
| -------------------- | ------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| Astro                | 6.0.4+  | SSG framework with built-in Image component           | `astro:assets` provides automatic WebP conversion, responsive sizing   |
| @axe-core/playwright | 4.11.1  | Automated accessibility testing                       | Already configured with WCAG 2.1 AA tags in `e2e/fixtures/axe-test.ts` |
| @playwright/test     | 1.58.2  | E2E testing for keyboard navigation and accessibility | Already configured with chromium project                               |
| Vitest               | 4.1.0   | Unit testing                                          | Already configured for `src/**/*.test.ts`                              |

### Supporting (new tools for font subsetting)

| Tool                   | Purpose                                                  | When to Use                                                         |
| ---------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| google-webfonts-helper | Download WOFF2 files with CSS snippets                   | One-time download of Plus Jakarta Sans + JetBrains Mono WOFF2 files |
| pyftsubset (fonttools) | Subset fonts to Latin-only unicode range                 | If downloaded fonts are not already Latin-subsetted                 |
| Fontsource             | Alternative: `@fontsource/plus-jakarta-sans` npm package | Alternative approach -- provides pre-subsetted WOFF2 files          |

### Alternatives Considered

| Instead of                               | Could Use                                     | Tradeoff                                                                                                                                                       |
| ---------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| google-webfonts-helper for font download | Fontsource npm package                        | Fontsource adds a dependency but provides automatic subsetting and version management; google-webfonts-helper is a one-time manual download with no dependency |
| Manual `@font-face` declarations         | `@fontsource/plus-jakarta-sans` auto-import   | Fontsource is simpler but less explicit; manual `@font-face` gives full control over preload and display behavior                                              |
| Moving images to `src/assets/`           | Keep in `public/` with manual WebP conversion | `public/` images are NOT optimized by Astro -- they are served as-is. Must move to `src/` for Astro Image component to work                                    |

**Recommendation on font download method:** Use google-webfonts-helper (https://gwfh.mranftl.com/fonts/plus-jakarta-sans?subsets=latin) to download pre-subsetted Latin WOFF2 files. This avoids adding npm dependencies and gives full control over the `@font-face` declarations as the user decided. Download 3 files: Plus Jakarta Sans 400, Plus Jakarta Sans 700, JetBrains Mono 400.

## Architecture Patterns

### Font Loading Implementation

```
public/fonts/
  plus-jakarta-sans-400-latin.woff2    # ~15-25KB subsetted
  plus-jakarta-sans-700-latin.woff2    # ~15-25KB subsetted
  jetbrains-mono-400-latin.woff2       # ~15-25KB subsetted
```

**In `src/layouts/BaseLayout.astro` `<head>`:**

```html
<!-- Preload critical body font only -->
<link
  rel="preload"
  href="/fonts/plus-jakarta-sans-400-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**In `src/styles/global.css` (top of file, before any usage):**

```css
@font-face {
  font-family: 'Plus Jakarta Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/plus-jakarta-sans-400-latin.woff2') format('woff2');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Plus Jakarta Sans';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/plus-jakarta-sans-700-latin.woff2') format('woff2');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/jetbrains-mono-400-latin.woff2') format('woff2');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

### Image Optimization Pattern (Astro Image)

**Critical fact:** Images in `public/` are NOT processed by Astro. They must be moved to `src/assets/` to use the `<Image>` component.

Current images in `public/`:

- `favicon-32.png` (1.3KB) -- favicon, keep in `public/` (too small to benefit, browsers expect `/favicon-32.png` path)
- `favicon.ico` (9.7KB) -- favicon, keep in `public/`
- `logo-192.png` (3.3KB) -- apple-touch-icon, keep in `public/` (referenced by `manifest.json`)
- `logo.svg` (893B) -- SVG, no WebP conversion needed
- `og.png` (19KB) -- OG image, move to `src/assets/` for WebP conversion

**Recommended approach:** Only `og.png` benefits from Astro Image optimization (19KB PNG to ~8-12KB WebP). Favicons and manifest icons must stay in `public/` due to external references. The SVG is already optimal.

```astro
---
// In SEOHead.astro or where OG image is referenced
import ogImage from '../assets/og.png';
// Use ogImage.src for the meta tag URL
---
```

For future images (Phase 6+ case studies, team photos), establish the `src/assets/` convention:

```astro
---
import { Image } from 'astro:assets';
import teamPhoto from '../assets/team/founder.jpg';
---

<Image src={teamPhoto} alt="Founder name" loading="lazy" />
<!-- Astro automatically: converts to WebP, sets width/height, prevents CLS -->
```

### ARIA Landmarks Pattern

```html
<!-- BaseLayout.astro -->
<body>
  <SkipLink />
  <nav role="banner" />
  <!-- or <header role="banner"> wrapper -->
  <main id="main" role="main">
    <slot />
  </main>
  <footer role="contentinfo" />
</body>
```

Each homepage section gets an `aria-label`:

```astro
<!-- HeroSection.astro -->
<section aria-label="Hero introduction" class="sec">...</section>

<!-- ServicesSection.astro -->
<section aria-label="Our services" class="sec sec-b">...</section>
```

### Contact Form States Pattern

```html
<form id="contact-form" aria-label="Contact form">
  <!-- fields... -->
  <button type="submit" class="submit-btn" aria-describedby="form-status">
    <span class="btn-text">Send enquiry</span>
    <!-- CSS spinner hidden by default, shown during loading -->
    <span class="spinner" aria-hidden="true"></span>
  </button>
  <!-- Live region for screen readers -->
  <div id="form-status" aria-live="polite" role="status">
    <div id="contact-success" class="form-msg form-msg--success" hidden>
      Thank you! We will get back to you within 24 hours.
    </div>
    <div id="contact-error" class="form-msg form-msg--error" hidden>
      Something went wrong. Please try again or contact us via WhatsApp.
    </div>
  </div>
</form>
```

Loading state JS:

```javascript
// On submit
form.setAttribute('aria-busy', 'true');
btn.disabled = true;
btn.querySelector('.btn-text').textContent = 'Sending...';
btn.querySelector('.spinner').classList.add('visible');

// On success
form.setAttribute('aria-busy', 'false');
successDiv.hidden = false;
form.reset();
btn.querySelector('.btn-text').textContent = 'Sent!';
btn.querySelector('.spinner').classList.remove('visible');

// On error
form.setAttribute('aria-busy', 'false');
errorDiv.hidden = false;
btn.querySelector('.btn-text').textContent = 'Send enquiry';
btn.querySelector('.spinner').classList.remove('visible');
btn.disabled = false;
```

### Hamburger Menu Focus Management Pattern

```javascript
// In Nav.astro script
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-links');
const focusableLinks = nav.querySelectorAll('a');

btn.addEventListener('click', function () {
  const isOpen = nav.classList.toggle('open');
  btn.classList.toggle('active');
  btn.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    // Focus first link when menu opens
    focusableLinks[0]?.focus();
  } else {
    // Return focus to hamburger button when closing
    btn.focus();
  }
});

// Escape key closes menu
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }
});

// Focus trap: Tab from last link wraps to first, Shift+Tab from first wraps to last
nav.addEventListener('keydown', function (e) {
  if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
  const first = focusableLinks[0];
  const last = focusableLinks[focusableLinks.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
```

### Anti-Patterns to Avoid

- **Using `outline: none` without replacement:** The codebase already has `:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }` -- do not override this. It provides a brand-green focus ring that meets WCAG 2.4.7.
- **Using `style="display:none"` for form status messages:** Currently used in ContactForm.astro. Replace with `hidden` attribute for better semantics and screen reader behavior.
- **Preloading all 3 fonts:** Only preload the critical body font (Plus Jakarta Sans 400). Preloading all 3 wastes bandwidth on resources that may not be needed immediately.
- **Converting favicon PNGs to WebP:** Browsers require specific formats for favicons. Do not convert `favicon-32.png` or `logo-192.png`.

## Don't Hand-Roll

| Problem               | Don't Build                     | Use Instead                                    | Why                                                              |
| --------------------- | ------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| Font subsetting       | Custom Python scripts           | google-webfonts-helper pre-subsetted downloads | Reliable, tested, correct unicode ranges                         |
| Image optimization    | Manual sharp/imagemin pipeline  | Astro `<Image>` from `astro:assets`            | Built into framework, handles format, sizing, CLS prevention     |
| Accessibility testing | Manual checklist                | axe-core via existing Playwright fixture       | Catches WCAG violations automatically, already configured        |
| CSS spinner animation | JavaScript animation            | Pure CSS `@keyframes` with `border` trick      | Zero JS, no layout shift, works everywhere                       |
| Focus trapping        | Custom focus management library | Inline script in Nav.astro                     | Only one focus trap needed (hamburger menu), library is overkill |

**Key insight:** This phase is mostly about configuration and HTML/CSS attributes, not new libraries. The biggest wins come from removing the Google Fonts CDN dependency and adding ARIA attributes to existing markup.

## Common Pitfalls

### Pitfall 1: FOUT (Flash of Unstyled Text) after removing Google Fonts

**What goes wrong:** Switching from Google Fonts CDN to self-hosted fonts without preload causes visible text reflow as fonts load.
**Why it happens:** Browser renders with fallback font, then swaps when WOFF2 downloads.
**How to avoid:** Preload the body font (Plus Jakarta Sans 400). Use `font-display: swap` on all `@font-face` declarations. The brief FOUT with swap is acceptable and preferable to invisible text (FOIT).
**Warning signs:** Text "jumps" on page load in Lighthouse filmstrip.

### Pitfall 2: Astro Image component doesn't work with public/ images

**What goes wrong:** Using `<Image src="/og.png" />` with a string path to a `public/` file -- Astro does NOT optimize these.
**Why it happens:** Astro only processes imported images from `src/`. String paths are passed through as-is.
**How to avoid:** Move optimizable images to `src/assets/` and use `import ogImage from '../assets/og.png'` then `<Image src={ogImage} />`.
**Warning signs:** Built output still contains original PNG files instead of optimized WebP.

### Pitfall 3: aria-live region announces on initial render

**What goes wrong:** Screen readers announce the success/error messages when the page first loads.
**Why it happens:** If the `aria-live` container has visible text content on mount, assistive technology announces it.
**How to avoid:** Use `hidden` attribute on message divs. Only remove `hidden` when showing the message. The container with `aria-live="polite"` should be present but empty/hidden on load.
**Warning signs:** Screen reader announces "Thank you" immediately on page load.

### Pitfall 4: Focus indicator invisible on dark backgrounds

**What goes wrong:** Default browser focus outlines (thin dotted lines) are invisible on the dark navy (#0b1421) background.
**Why it happens:** Default outlines have poor contrast against dark backgrounds.
**How to avoid:** The existing `:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }` uses the brand green (#34d399) which has excellent contrast against both dark (#0b1421) and light (#eef3fb) themes. Verify this works on ALL interactive elements including form inputs, buttons, links, and the hamburger menu button.
**Warning signs:** Tabbing through the page and losing visual track of where focus is.

### Pitfall 5: Forgetting crossorigin on font preload

**What goes wrong:** Browser downloads the font twice -- once for preload and once for `@font-face`.
**Why it happens:** Font preloads require the `crossorigin` attribute even for same-origin fonts. Without it, the browser treats the preloaded resource and the `@font-face` request as different resources.
**How to avoid:** Always include `crossorigin` on `<link rel="preload" ... as="font" type="font/woff2" crossorigin>`.
**Warning signs:** Network tab shows duplicate font requests.

### Pitfall 6: Mobile gradient simplification breaks visual identity

**What goes wrong:** Removing gradients entirely makes the dark theme feel flat and loses the "premium tech" aesthetic.
**Why it happens:** Overly aggressive optimization that removes decorative elements.
**How to avoid:** The current body gradients are small radial-gradient dots (32x32 grid) with very low opacity (0.07 and 0.03). CSS gradients are GPU-accelerated and paint cost is typically negligible. Test actual paint time with Chrome DevTools Performance panel before simplifying. If paint cost is under 5ms, keep as-is.
**Warning signs:** PageSpeed Insights showing excessive main-thread work from paint operations (unlikely for CSS gradients).

## Code Examples

### CSS Spinner for Submit Button

```css
/* In global.css or ContactForm scoped styles */
.spinner {
  display: none;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
.spinner.visible {
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
```

### BaseLayout.astro Head Changes

```astro
<!-- REMOVE these 3 lines: --><!-- <link rel="preconnect" href="https://fonts.googleapis.com" /> --><!-- <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /> --><!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&family=JetBrains+Mono:wght@400&display=swap" /> --><!-- ADD this 1 line: -->
<link
  rel="preload"
  href="/fonts/plus-jakarta-sans-400-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

### Mobile Gradient Media Query (if simplification needed)

```css
@media (max-width: 768px) {
  body {
    /* Remove dot pattern on mobile to reduce paint complexity */
    background-image: none;
  }
  [data-theme='light'] body {
    background-image: none;
  }
}
```

**Recommendation:** Test paint performance first. The dot pattern is 2 tiny radial-gradients at 32px intervals with sub-10% opacity -- CSS gradient paint cost is typically under 1ms even on low-end devices. Only simplify if Lighthouse flags "Avoid large layout shifts" or paint time exceeds 5ms.

## State of the Art

| Old Approach                        | Current Approach                           | When Changed          | Impact                                                                                                |
| ----------------------------------- | ------------------------------------------ | --------------------- | ----------------------------------------------------------------------------------------------------- |
| Google Fonts CDN                    | Self-hosted WOFF2 with preload             | 2023+ consensus       | Eliminates DNS lookup + connection + download waterfall; especially impactful in high-latency regions |
| `@astrojs/image` (deprecated)       | `astro:assets` built-in Image              | Astro 3.0 (2023)      | No separate package needed; `import { Image } from 'astro:assets'`                                    |
| `style="display:none"` for toggling | `hidden` attribute                         | WCAG best practice    | Better screen reader behavior, semantic, toggleable via JS                                            |
| `outline: none` everywhere          | `:focus-visible` with styled outlines      | CSS spec 2022+        | Focus rings only show for keyboard users, not mouse clicks                                            |
| `role="navigation"` on `<nav>`      | Semantic HTML elements with implicit roles | WCAG current guidance | `<nav>` already has implicit `role="navigation"`; explicit `role` needed only on `<div>` wrappers     |

**Important ARIA note:** HTML5 semantic elements already have implicit ARIA roles:

- `<nav>` = `role="navigation"` (NOT `role="banner"` -- CONTEXT.md says `role="banner"` on nav, but the correct mapping is `<header>` = `role="banner"`)
- `<main>` = `role="main"`
- `<footer>` = `role="contentinfo"`

The CONTEXT.md decision says `role="banner"` on nav, but `role="banner"` maps to `<header>`, not `<nav>`. The correct approach: wrap the `<nav>` in a `<header role="banner">` or add a `<header>` element around the nav. The `<nav>` element itself should keep its implicit navigation role.

## Open Questions

1. **Font file source: google-webfonts-helper vs Fontsource vs manual download**
   - What we know: Both provide Latin-subsetted WOFF2 files. google-webfonts-helper is a web tool, Fontsource is an npm package.
   - What's unclear: Whether google-webfonts-helper provides sufficiently current font versions (Plus Jakarta Sans v2.006).
   - Recommendation: Use google-webfonts-helper for the download, verify file sizes are reasonable (15-30KB per WOFF2 file for Latin subset). If files seem too large, use pyftsubset to manually subset.

2. **OG image: Astro Image component or manual conversion?**
   - What we know: Astro Image requires imports from `src/`. OG images are referenced via `<meta property="og:image">` which needs an absolute URL.
   - What's unclear: Whether Astro Image provides the absolute URL needed for OG meta tags at build time.
   - Recommendation: The `import ogImage from '../assets/og.png'` pattern in Astro returns an object with `.src` property containing the optimized URL path. Use `ogImage.src` in the meta tag. Verify the built output includes the correct absolute URL.

3. **Contact form post-submit: collapse form vs reset?**
   - What we know: Current behavior resets the form and shows "Sent!" in the button.
   - Recommendation: Reset the form fields, show the success message, and keep the form visible. Collapsing the form removes a key CTA from the page, which hurts conversion. Re-enable the button after 3 seconds so users can submit again if needed.

## Validation Architecture

### Test Framework

| Property           | Value                                        |
| ------------------ | -------------------------------------------- |
| Framework          | Playwright 1.58.2 + Vitest 4.1.0             |
| Config file        | `playwright.config.ts`, `vitest.config.ts`   |
| Quick run command  | `npm run test:e2e -- --grep "accessibility"` |
| Full suite command | `npm run test:e2e`                           |

### Phase Requirements to Test Map

| Req ID  | Behavior                                            | Test Type   | Automated Command                                                                    | File Exists?     |
| ------- | --------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ | ---------------- |
| UIUX-04 | LCP < 2.5s on Slow 4G                               | manual-only | Lighthouse CLI or PageSpeed Insights (network throttling not reliable in Playwright) | N/A              |
| UIUX-05 | Images served as WebP with lazy loading             | e2e         | `npx playwright test e2e/performance.spec.ts -x`                                     | -- Wave 0        |
| UIUX-06 | Fonts self-hosted, no Google Fonts requests         | e2e         | `npx playwright test e2e/performance.spec.ts -x`                                     | -- Wave 0        |
| UIUX-07 | Contact form loading/success/error states with ARIA | e2e         | `npx playwright test e2e/contact-form.spec.ts -x`                                    | Exists (partial) |
| UIUX-08 | Keyboard nav + screen reader support                | e2e         | `npx playwright test e2e/accessibility.spec.ts -x`                                   | Exists (partial) |
| UIUX-09 | Gradients simplified on mobile                      | e2e         | `npx playwright test e2e/performance.spec.ts -x`                                     | -- Wave 0        |
| UIUX-10 | Core Web Vitals pass PageSpeed                      | manual-only | Google PageSpeed Insights (external tool)                                            | N/A              |

### Sampling Rate

- **Per task commit:** `npx playwright test e2e/accessibility.spec.ts e2e/contact-form.spec.ts -x`
- **Per wave merge:** `npm run test:e2e`
- **Phase gate:** Full suite green + manual PageSpeed Insights check before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `e2e/performance.spec.ts` -- covers UIUX-05 (WebP images), UIUX-06 (no Google Fonts network requests), UIUX-09 (mobile gradient check)
- [ ] Extend `e2e/accessibility.spec.ts` -- add keyboard navigation tests (Tab through all interactive elements, Escape closes menu, focus trap in hamburger)
- [ ] Extend `e2e/contact-form.spec.ts` -- add form state tests (loading spinner visible during submission, success/error messages with ARIA attributes, `aria-busy` on form)
- [ ] Download and place font files in `public/fonts/` -- prerequisite for all font-related work

## Sources

### Primary (HIGH confidence)

- Astro Images guide: https://docs.astro.build/en/guides/images/ -- Confirmed `public/` images are NOT optimized; must use `src/` imports
- Astro Assets API: https://docs.astro.build/en/reference/modules/astro-assets/ -- `<Image>` auto-converts to WebP
- WCAG 2.1.1 Keyboard: https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html -- All functionality keyboard operable
- W3C Menus Tutorial: https://www.w3.org/WAI/tutorials/menus/ -- Keyboard interaction patterns for menus

### Secondary (MEDIUM confidence)

- google-webfonts-helper: https://gwfh.mranftl.com/fonts/plus-jakarta-sans?subsets=latin -- Pre-subsetted WOFF2 downloads
- Fontsource Plus Jakarta Sans: https://fontsource.org/fonts/plus-jakarta-sans -- Alternative font source
- Font subsetting guide: https://markoskon.com/creating-font-subsets/ -- pyftsubset usage patterns
- WOFF2 size reduction: https://font-converters.com/guides/ttf-to-woff2-complete -- 60-70% smaller than TTF

### Tertiary (LOW confidence)

- Mobile gradient paint cost -- Based on general CSS rendering knowledge; actual paint time on MTN Rwanda devices should be tested empirically with Lighthouse

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- Astro Image and axe-core are well-documented, already in the project
- Architecture: HIGH -- Font self-hosting and ARIA patterns are well-established web standards
- Pitfalls: HIGH -- Common issues with font preload, image optimization, aria-live are well-documented
- Mobile gradients: MEDIUM -- Paint cost assessment is device-dependent; recommendation to test first is sound but actual impact on target devices is unknown

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (30 days -- stable technologies, no fast-moving APIs)
