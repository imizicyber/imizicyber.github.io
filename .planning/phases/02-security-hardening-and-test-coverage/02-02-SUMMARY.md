---
phase: 02-security-hardening-and-test-coverage
plan: 02
subsystem: security
tags: [csp, sha256, gitleaks, pre-commit, inline-style-elimination]

# Dependency graph
requires:
  - phase: 01-foundation-and-tooling
    provides: ESLint, Husky pre-commit hook, Astro build pipeline
provides:
  - Hash-based CSP with no unsafe-inline for scripts or styles
  - Post-build CSP injection script with SHA-256 hashing for inline scripts and styles
  - Gitleaks secret scanning in pre-commit hook
  - Clean git history scan (no secrets)
affects: [04-performance-and-seo, deploy]

# Tech tracking
tech-stack:
  added: [gitleaks]
  patterns: [post-build-csp-injection, css-classes-over-inline-styles]

key-files:
  created: [.gitleaks.toml]
  modified: [scripts/inject-csp.mjs, src/components/ContactForm.astro, src/components/Nav.astro, src/components/sections/CtaSection.astro, src/components/sections/FaqSection.astro, src/layouts/BlogPostLayout.astro, src/pages/company-profile/index.astro, src/styles/global.css, .husky/pre-commit]

key-decisions:
  - "Post-build CSP injection script instead of Astro experimental CSP (Astro 6 has no experimental.csp feature)"
  - "All inline style attributes replaced with CSS classes for CSP style-src compliance"
  - "Inline onclick handler replaced with addEventListener for CSP script-src compliance"
  - "Style hashes computed per-page alongside script hashes in inject-csp.mjs"

patterns-established:
  - "No inline style attributes: use CSS classes defined in component scoped styles or global.css"
  - "No inline event handlers: use addEventListener in script blocks"
  - "CSP generated at build time by scripts/inject-csp.mjs with per-page SHA-256 hashes"

requirements-completed: [QUAL-09, QUAL-11]

# Metrics
duration: 2min
completed: 2026-03-17
---

# Phase 2 Plan 02: CSP Hardening and Secret Scanning Summary

**Hash-based CSP eliminating all unsafe-inline for scripts and styles, plus gitleaks secret scanning on full history and pre-commit**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-17T21:15:50Z
- **Completed:** 2026-03-17T21:18:30Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- CSP meta tags injected at build time with SHA-256 hashes for all inline scripts and styles -- zero unsafe-inline
- All inline style attributes across 6 components replaced with CSS classes
- Inline onclick handler in company-profile replaced with addEventListener pattern
- Gitleaks full history scan clean (103 commits, 3.14 MB scanned, no leaks)
- Pre-commit hook runs gitleaks protect on staged files with allowlist config

## Task Commits

Each task was committed atomically:

1. **Task 1: Enable CSP without unsafe-inline** - `5146a2f` (feat)
2. **Task 2: Gitleaks full history scan and pre-commit hook** - `a4e00b2` (previously committed)

## Files Created/Modified
- `scripts/inject-csp.mjs` - Removed unsafe-inline from style-src, added inline style SHA-256 hashing
- `src/components/ContactForm.astro` - Replaced inline style="display:none" with .honeypot class, inline success/error styles with .form-msg classes
- `src/components/Nav.astro` - Replaced inline style on outline CTA with .nav-cta-outline class
- `src/components/sections/CtaSection.astro` - Replaced inline justify-content with .cta-btns class
- `src/components/sections/FaqSection.astro` - Moved inline margin-top to .faq-list CSS rule
- `src/layouts/BlogPostLayout.astro` - Replaced inline max-width/padding with .blog-content/.blog-header classes
- `src/pages/company-profile/index.astro` - Replaced onclick with addEventListener, inline styles with CSS classes
- `src/styles/global.css` - Added .nav-cta-outline, .honeypot, .form-msg, .form-msg-success, .form-msg-error, .cta-btns, .blog-content, .blog-header classes
- `.gitleaks.toml` - Allowlist config for public GA ID and Formspree URL (previously committed)
- `.husky/pre-commit` - Gitleaks protect step (previously committed)

## Decisions Made
- Used post-build CSP injection script (scripts/inject-csp.mjs) instead of Astro experimental CSP -- Astro 6 does not have an experimental.csp feature as the plan assumed
- Replaced all inline style attributes with CSS classes rather than keeping them and adding style hashes -- cleaner approach, eliminates unsafe-inline entirely from style-src
- Inline onclick handler in company-profile replaced with addEventListener in script block -- inline event handlers cannot be hashed by CSP Level 2

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Eliminated unsafe-inline for styles, not just scripts**
- **Found during:** Task 1 (CSP hardening)
- **Issue:** Plan focused on script unsafe-inline but style-src also had unsafe-inline. Multiple components used inline style attributes which required unsafe-inline in CSP.
- **Fix:** Replaced all inline style attributes across 6 components with CSS classes, added inline style hashing to inject-csp.mjs, removed unsafe-inline from STYLE_SOURCES
- **Files modified:** scripts/inject-csp.mjs, ContactForm.astro, Nav.astro, CtaSection.astro, FaqSection.astro, BlogPostLayout.astro, company-profile/index.astro, global.css
- **Verification:** Built HTML confirmed zero unsafe-inline in CSP for both script-src and style-src
- **Committed in:** 5146a2f

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Essential for complete CSP compliance. Plan's must_haves explicitly required no unsafe-inline for styles.

## Issues Encountered
- Astro 6 does not have experimental.csp feature -- the plan's Step 2 (add experimental/security config to astro.config.mjs) was not applicable. The fallback approach (manual hash computation via post-build script) was already in place from prior work.
- Task 2 (gitleaks) was already fully implemented in a prior commit (a4e00b2). Verified scan is clean and pre-commit hook is configured correctly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- CSP is fully hardened with hash-based directives for both scripts and styles
- Secret scanning is active in pre-commit hook and full history is clean
- Ready for Plan 02-03 (test coverage)

---
*Phase: 02-security-hardening-and-test-coverage*
*Completed: 2026-03-17*
