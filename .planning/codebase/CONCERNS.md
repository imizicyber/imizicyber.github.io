# Codebase Concerns

**Analysis Date:** 2026-03-16

## Security Issues

**innerHTML with Dynamic Content:**
- Issue: The security-score page uses `innerHTML` to inject dynamically generated HTML content into the DOM from quiz responses
- Files: `src/pages/tools/security-score/index.astro` (lines 471-495)
- Impact: While the content is generated from safe Question/Band data structures, using `innerHTML` for dynamic content is a code smell and creates XSS risk if data sources change in the future
- Current mitigation: Quiz data is hard-coded in JavaScript object literals, so current risk is low
- Fix approach: Replace `innerHTML` with `textContent` for text-only content, or use proper DOM API methods like `createElement()` and `appendChild()` for structured content. Implement an HTML escaping function (note: `esc()` function exists at line 505 but is not used for innerHTML operations)

**Content Security Policy Permissiveness:**
- Issue: CSP allows `'unsafe-inline'` for scripts and styles, which weakens XSS protection
- Files: `src/layouts/BaseLayout.astro` (lines 57-65), `src/pages/company-profile/index.astro` (line 16)
- Impact: Reduces effectiveness of CSP as a defense against inline script injection
- Current mitigation: Site uses static generation with Astro SSG, reducing runtime injection risks
- Recommendation: Consider moving inline scripts to external files or using nonces instead of `'unsafe-inline'` for production hardening

**Inline Script Dependencies:**
- Issue: Multiple critical functions are defined in `is:inline` scripts making them hard to test and maintain
- Files: `src/components/CookieBanner.astro` (line 19), `src/layouts/BaseLayout.astro` (line 116), `src/pages/tools/security-score/index.astro` (line 322), `src/pages/resources/index.astro` (line 423)
- Impact: Functions like `handleCookieConsent()`, `loadGA()`, `toggleTheme()`, etc. are tightly coupled to markup and difficult to unit test
- Fix approach: Extract inline scripts to external JavaScript modules where feasible, or at minimum document the coupling clearly

## Tech Debt

**Large Single-Page Files:**
- Issue: Multiple page files exceed 500 lines with HTML, styles, and scripts all co-located
- Files:
  - `src/pages/tools/security-score/index.astro` (649 lines)
  - `src/pages/resources/index.astro` (585 lines)
  - `src/pages/index.astro` (556 lines)
  - `src/pages/company-profile/index.astro` (433 lines)
- Impact: Difficult to maintain, hard to extract reusable components, testing complexity increases
- Priority: Medium
- Fix approach: Extract quiz logic from security-score into reusable components, move embedded data structures to separate data files

**Hardcoded Analytics and Form IDs:**
- Issue: Google Analytics ID and Formspree ID are hard-coded in source files
- Files: `src/data/site.ts` (lines 27-31)
- Current approach: Stored as constants, not using environment variables
- Impact: While not a security risk (these are public IDs), this limits ability to swap implementations for different environments
- Recommendation: Consider migrating to environment variables for flexibility, though current approach works for static sites

**Missing Error Handling for PDF Generation:**
- Issue: PDF generation in security-score page loads external jsPDF library from multiple CDNs but error handling is minimal
- Files: `src/pages/tools/security-score/index.astro` (lines 507-519)
- Impact: If all CDNs fail, user gets silent failure with no clear error message
- Current behavior: Code tries three different CDN URLs in sequence and rejects promise if all fail
- Fix approach: Add explicit user-facing error message when PDF library fails to load from any CDN

**Form Submission Error Handling:**
- Issue: ContactForm.astro's fetch error handling doesn't distinguish between network errors and API errors
- Files: `src/components/ContactForm.astro` (lines 52-57)
- Impact: User sees generic "Something went wrong" message for both network timeouts and API rejections
- Fix approach: Add error response parsing to provide more specific feedback (e.g., "Network error - check your connection" vs "Server error - please try again")

## Performance Concerns

**Background Pattern Rendering:**
- Issue: Global CSS renders decorative background patterns using CSS radial gradients and background-position
- Files: `src/styles/global.css` (lines 28-40)
- Impact: Gradient patterns with multiple radial gradients on every page adds memory and render cost, especially on mobile devices
- Current: Applies to all pages regardless of viewport
- Optimization: Consider disabling pattern on mobile or replacing with simpler single-gradient background

**Multiple External Font Imports:**
- Issue: Page imports two font families (Plus Jakarta Sans and JetBrains Mono) from Google Fonts with multiple weights
- Files: `src/layouts/BaseLayout.astro` (lines 101-111)
- Impact: Increases page load time and render-blocking resource count
- Current approach: Uses `rel="preload"` with async loading via `onload` handler
- Recommendation: Review if both fonts are necessary, consider system-ui fallback more prominently in CSS

**Quiz Form Auto-Advance Timer:**
- Issue: Security score quiz has 500ms auto-advance timer that can't be disabled or customized
- Files: `src/pages/tools/security-score/index.astro` (lines 361-365)
- Impact: Users with slower devices or accessibility needs may have difficulty answering questions before auto-advance
- Fix approach: Remove auto-advance or make it configurable, add explicit "Next" button

## Fragile Areas

**Cookie Banner Markup and Script Coupling:**
- Files: `src/components/CookieBanner.astro`
- Why fragile: Script relies on specific DOM IDs (`cookie-banner`, `cookie-accept`, `cookie-reject`) and querySelector patterns. Any HTML refactor risks breaking functionality
- Safe modification: Ensure `id="cookie-banner"` and button IDs remain unchanged; document the coupling
- Test coverage: Manual only - no unit tests exist

**Theme Toggle Logic:**
- Files: `src/components/ThemeToggle.astro`, `src/layouts/BaseLayout.astro` (line 118), `src/styles/global.css`
- Why fragile: Theme state stored in localStorage and DOM attribute (`data-theme`). Multiple places must stay in sync:
  - Line 118: init script reads from localStorage
  - ThemeToggle: onclick handler (not implemented in component, must exist globally)
  - CSS: `[data-theme="light"]` selectors
- Safe modification: Any theme-related change must update all three synchronously
- Note: `toggleTheme()` function referenced but not defined anywhere in codebase - this likely exists in unshown build artifacts or is a bug

**Security Score Quiz Data Structure:**
- Files: `src/pages/tools/security-score/index.astro` (lines 376-445)
- Why fragile: Quiz logic tightly couples question count (10) with band scoring (0-30 max) with recommendation data
- Risk: Adding or removing questions requires updates to: BANDS array, QUESTIONS array, progress calculation, form field names, hidden field calculations
- Safe modification: Document the coupling clearly, add validation that answers.length === QUESTIONS.length

## Known Issues

**Theme Toggle Function Missing:**
- Issue: ThemeToggle.astro references `toggleTheme()` function but it's not defined anywhere in source
- Files: `src/components/ThemeToggle.astro` (line 7)
- Impact: Theme toggle button likely non-functional (though theme initialization script at BaseLayout line 116-120 works)
- Likely cause: Function may exist in injected globals or build-time code not visible here
- Recommendation: Verify function exists or implement it explicitly

**No Accessibility Labels for Resource Downloads:**
- Issue: Resources page (src/pages/resources/index.astro) has PDF download buttons without proper aria-labels or download hints
- Impact: Screen reader users don't know content type before download
- Fix: Add `aria-label="Download PDF: [Document Name]"` and file type badge to buttons

## Missing Test Coverage

**No Test Files:**
- Issue: No test files found in codebase (no .test.ts, .spec.ts, or test directory)
- Files: N/A
- Risk: All components and pages lack automated testing
- Priority areas for tests:
  - Quiz scoring logic (`src/pages/tools/security-score/index.astro` lines 451-503)
  - Form submission (`src/components/ContactForm.astro`)
  - Cookie consent state management (`src/components/CookieBanner.astro`)
  - Theme toggle state consistency

## Dependency Management

**No Outdated Package Warnings:**
- Current stack: Astro ^6.0.4, @astrojs/mdx ^5.0.0, @astrojs/sitemap ^3.7.1
- Check: All dependencies are recent (as of March 2026)
- Recommendation: Monitor for security updates; package-lock.json should be committed

**No Linting or Type Checking Configuration:**
- Issue: No .eslintrc, tsconfig strict mode configuration, or type checking detected
- Files: `tsconfig.json` is minimal (just extends Astro's config)
- Impact: No automated code quality checks prevent regressions
- Recommendation: Add ESLint with TypeScript plugin, enable strict type checking

---

*Concerns audit: 2026-03-16*
