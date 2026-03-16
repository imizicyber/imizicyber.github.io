# Technology Stack

**Project:** Imizi Cyber — cybersecurity firm website enhancements
**Researched:** 2026-03-16
**Scope:** Additions and upgrades to existing Astro 6.x SSG on GitHub Pages

---

## Current Stack (Do Not Change)

The existing foundation is sound. Do not migrate the framework, hosting, or build system.

| Technology       | Version   | Role                  |
| ---------------- | --------- | --------------------- |
| Astro            | 6.0.4     | SSG framework         |
| @astrojs/mdx     | 5.0.0     | Blog content          |
| @astrojs/sitemap | 3.7.1     | XML sitemap           |
| GitHub Pages     | —         | Hosting (static only) |
| GitHub Actions   | —         | CI/CD                 |
| Node.js          | 22        | Build runtime         |
| Formspree        | free tier | Form backend          |
| GA4              | free      | Analytics             |

**Constraint:** GitHub Pages = static only. No server-side processing, edge functions, or databases. Everything must be build-time or client-side.

---

## Recommended Additions

### 1. Code Quality — Linting and Type Checking

**Add:** ESLint + TypeScript strict checking + Prettier

| Package                            | Version   | Purpose                   | Why                                                                      |
| ---------------------------------- | --------- | ------------------------- | ------------------------------------------------------------------------ |
| `eslint`                           | `^9.x`    | Linting                   | Enforce code standards, catch bugs pre-commit                            |
| `@typescript-eslint/parser`        | `^8.x`    | ESLint TS support         | Parse TypeScript in ESLint                                               |
| `@typescript-eslint/eslint-plugin` | `^8.x`    | TS lint rules             | Type-aware linting rules                                                 |
| `eslint-plugin-astro`              | `^1.x`    | Astro component linting   | Enforces Astro-specific best practices                                   |
| `eslint-plugin-jsx-a11y`           | `^6.x`    | Accessibility linting     | Catch ARIA and a11y issues at dev time                                   |
| `prettier`                         | `^3.x`    | Code formatting           | Consistent formatting — public repo code quality is a credibility signal |
| `prettier-plugin-astro`            | `^0.14.x` | Prettier for .astro files | Formats Astro component files                                            |

**Why ESLint 9 flat config:** Astro 6 generates a flat config scaffold. ESLint 9 is the current stable release with flat config as default. The legacy `.eslintrc` format is deprecated.

**Why not Biome:** Biome is fast but lacks `eslint-plugin-astro` and `eslint-plugin-jsx-a11y` support as of early 2026. For a public repo where a11y matters, ESLint gives better coverage.

**Confidence:** MEDIUM — ESLint 9 flat config is current per training data. Verify exact `eslint-plugin-astro` compatibility version before installing.

---

### 2. Testing — Vitest + Playwright

| Package               | Version | Purpose                | Why                                                                   |
| --------------------- | ------- | ---------------------- | --------------------------------------------------------------------- |
| `vitest`              | `^3.x`  | Unit/integration tests | Native Vite runner — Astro uses Vite internally, zero config friction |
| `@vitest/coverage-v8` | `^3.x`  | Coverage reports       | V8 coverage is faster and more accurate than Istanbul for modern JS   |
| `playwright`          | `^1.x`  | E2E browser tests      | Cross-browser testing; free tier handles static sites trivially       |
| `@playwright/test`    | `^1.x`  | Playwright test runner | Integrates with CI                                                    |

**Why Vitest over Jest:** Astro is Vite-based. Vitest shares the same transform pipeline — MDX components, TypeScript paths, and Astro content collections work without plugin gymnastics that Jest requires.

**Why Playwright over Cypress:** Playwright runs in-process, supports multiple browser engines (Chromium, WebKit, Firefox), and has no pricing tiers. For a static site with no dynamic backend, Cypress's real-time watch mode is unnecessary overhead. Playwright is also what Astro's own test suite uses.

**What to test:** Schema.org output correctness, SEO head tags per-page, cookie consent state transitions, contact form submission UX (mock Formspree), quiz scoring logic, theme toggle persistence.

**Confidence:** HIGH — Vitest + Playwright is the dominant Astro testing stack as of 2025/2026.

---

### 3. Image Optimization — @astrojs/image (Sharp)

The existing site uses no image optimization. Mobile performance on African networks is a stated constraint.

| Package                    | Version              | Purpose                                              | Why                                                        |
| -------------------------- | -------------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| `@astrojs/image` via Sharp | bundled with Astro 6 | Automatic WebP/AVIF conversion, lazy loading, srcset | Astro 6 ships `<Image>` component backed by Sharp natively |

**What to do:** No new npm package needed. Sharp is already a transitive dependency (confirmed by presence of `@img/sharp-darwin-arm64` in node_modules). The existing codebase is not using `<Image>` or `<Picture>` components anywhere — all images are raw `<img>` tags or CSS backgrounds. Replace all `<img>` tags with Astro's `<Image>` component to get automatic WebP output and LCP optimization.

**Additional:** Add `@astrojs/fonts` for self-hosting Google Fonts at build time instead of the current runtime fetch from `fonts.googleapis.com`. This eliminates an external DNS round-trip on slow mobile connections and removes a CSP `fonts.googleapis.com` allowance.

| Package          | Version                         | Purpose                  | Why                                                                          |
| ---------------- | ------------------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `@astrojs/fonts` | `^0.x` (experimental, Astro 5+) | Build-time font inlining | Eliminates Google Fonts CDN dependency, improves LCP on constrained networks |

**Confidence:** HIGH for `<Image>` (part of Astro core). MEDIUM for `@astrojs/fonts` — it was introduced in Astro 5 as experimental; verify stability in Astro 6.x before adopting.

---

### 4. Analytics Stack — GA4 + LinkedIn Insight Tag + Search Console

The existing `CookieBanner.astro` already loads GA4 conditionally on consent. The architecture is correct. What is missing:

**a) LinkedIn Insight Tag**

No npm package needed. Add a `<script>` snippet inside `CookieBanner.astro`'s "accepted" branch, alongside the existing GA4 load. LinkedIn Insight Tag is a single pixel that enables LinkedIn Matched Audiences and conversion tracking from LinkedIn ads.

**Why LinkedIn specifically:** The target audience (bank CISOs, compliance officers, CTOs in East Africa) are overwhelmingly on LinkedIn — not Meta or X. LinkedIn retargeting costs more per click but conversion rates from regulated enterprise buyers are substantially higher. This is the only paid acquisition channel worth supporting for a B2B cybersecurity firm.

**b) Google Search Console**

No code change needed. GSC is configured via HTML meta tag verification or DNS TXT record. Add the verification meta tag to `SEOHead.astro` behind a site config constant. GSC provides keyword-level click data that GA4 does not.

**c) GA4 Conversion Events**

Existing GA4 integration fires only a page-view event. Add custom `gtag('event', ...)` calls for:

- `generate_lead` — on Formspree form submit success
- `contact_initiated` — on WhatsApp button click (new)
- `quiz_completed` — on security score quiz submission

These feed GA4's conversion funnel without any new dependencies.

**d) Structured Event Tracking Helper**

Create a `src/utils/analytics.ts` utility that wraps `window.gtag` with TypeScript types and a consent guard, so inline scripts don't need to check consent state themselves.

**No new npm packages for analytics.** All four improvements are configuration + code changes only.

**Confidence:** HIGH — GA4 + LinkedIn Insight Tag is the standard B2B analytics stack. Both are free tier.

---

### 5. SEO Enhancements — Rehype Plugins

| Package                    | Version | Purpose                                                            | Why                                                                                |
| -------------------------- | ------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `rehype-external-links`    | `^3.x`  | Auto `target="_blank" rel="noopener noreferrer"` on external links | Security + UX; blog posts have external links that currently lack `rel` attributes |
| `rehype-slug`              | `^6.x`  | Auto-generates `id` attrs on headings                              | Required for anchor links in long-form blog content                                |
| `rehype-autolink-headings` | `^7.x`  | Adds anchor links to headings                                      | Standard for long-form technical content; improves deep-link shareability          |

**Add to `astro.config.mjs` `markdown.rehypePlugins` array.** These are zero-runtime plugins — they transform HTML at build time.

**Remark plugins already present via Astro defaults:** `remark-smartypants` (curly quotes) is already a transitive dependency. No need to add it explicitly.

**What NOT to add:** `rehype-pretty-code` or `rehype-shiki` — Astro 6 ships Shiki syntax highlighting natively via the `shiki` package (already in node_modules). Adding a second highlighter creates conflicts.

**Confidence:** HIGH for `rehype-external-links` and `rehype-slug`. MEDIUM for `rehype-autolink-headings` (verify compatibility with Astro 6 rehype pipeline version).

---

### 6. Development Workflow — Pre-commit Hooks

| Package       | Version | Purpose                          | Why                                                                            |
| ------------- | ------- | -------------------------------- | ------------------------------------------------------------------------------ |
| `husky`       | `^9.x`  | Git hooks manager                | Runs lint and type check before every commit                                   |
| `lint-staged` | `^15.x` | Run linters on staged files only | Keeps pre-commit fast — only checks files being committed, not entire codebase |

**Why husky over lefthook:** Husky has wider adoption and simpler configuration for a solo developer project. Lefthook is faster but the performance difference is irrelevant at this codebase size.

**Pre-commit hook should run:** `eslint`, `tsc --noEmit`, `prettier --check`. Add a CI step that runs `npm run build` to catch Astro-level errors.

**Confidence:** HIGH — Husky 9 is current and widely used.

---

### 7. Performance — Partytown (Optional, Conditional)

| Package              | Version | Purpose                                    | Why                                                                             |
| -------------------- | ------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| `@astrojs/partytown` | `^2.x`  | Offloads third-party scripts to Web Worker | GA4 and LinkedIn Insight Tag run in a separate thread, not blocking main thread |

**Use only if:** Performance profiling shows main-thread script blocking. For the current GA4-only analytics load (deferred until consent), the performance benefit is marginal. LinkedIn Insight Tag adds more weight — at that point Partytown pays off.

**Partytown configuration note:** Partytown requires a `resolveUrl` proxy configuration for CORS-restricted analytics endpoints. GA4's `collect` endpoint is not directly proxy-able, so `partytown-google-analytics` community package is needed. This adds configuration complexity.

**Recommendation:** Skip Partytown initially. Revisit if Lighthouse shows analytics scripts in the critical path after LinkedIn tag is added.

**Confidence:** MEDIUM — Partytown compatibility with GA4 requires community workarounds that are fragile. Standard deferred `<script>` loading is more reliable.

---

### 8. Accessibility — axe-core for CI

| Package                | Version | Purpose                | Why                                                                                              |
| ---------------------- | ------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| `@axe-core/playwright` | `^4.x`  | Automated a11y testing | Run axe accessibility checks against built pages in CI; catches ARIA, contrast, and focus issues |

**Add to Playwright test suite.** One `axe.run()` call per critical page (home, service pages, blog, contact form) gives automated WCAG 2.1 AA coverage without manual audits each deploy.

**Why not `jest-axe`:** Vitest is being used, not Jest. `@axe-core/playwright` integrates directly with the Playwright tests being added anyway.

**Confidence:** HIGH — axe-core is the industry standard, `@axe-core/playwright` is the current integration path.

---

## What NOT to Add

| Technology                                               | Reason to Avoid                                                                                                                                                                                                                              |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React / Vue / Svelte                                     | Site is content + forms only. No interactive UI components justify a JS framework. Adding any framework integration doubles bundle size for zero user-visible benefit.                                                                       |
| Tailwind CSS                                             | The existing custom CSS is purposeful, minimal, and performance-optimized. Replacing it with Tailwind means rewriting every component and accepting a ~8KB utility stylesheet overhead (even purged). Not worth it for a <20 component site. |
| Contentlayer                                             | Deprecated since 2024. Astro's native content collections are the replacement. Already in use.                                                                                                                                               |
| Sanity / Contentful / any headless CMS                   | The PROJECT.md explicitly scopes out a CMS. Content management via MDX files in the repo is the decided approach. Adding a CMS adds runtime API calls, cost, and breaks the static-only constraint.                                          |
| next-sitemap or sitemap.js                               | @astrojs/sitemap is already present and configured. Replacing it would be regression.                                                                                                                                                        |
| Formik / React Hook Form                                 | No React. Forms are plain HTML submitted via Formspree. This is correct for a static site.                                                                                                                                                   |
| Google Tag Manager                                       | GTM adds significant JavaScript overhead (~35KB), an extra DNS lookup, and a consent management complexity layer. For 2 analytics tags (GA4 + LinkedIn), direct script injection is simpler, faster, and easier to audit.                    |
| Cookie consent libraries (CookieConsent.js, Osano, etc.) | Existing custom banner is sufficient, correct, and security-auditable. Third-party consent libraries introduce opaque external scripts and potential privacy compliance issues — the opposite of what a cybersecurity firm needs.            |
| Astro Islands with client:load                           | No interactive components currently warrant full hydration. Use `client:idle` or `client:visible` if a component ever does need hydration. `client:load` on the security quiz would block paint.                                             |

---

## Upgrade Notes

| Current                           | Status                                                                         | Action                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `astro` 6.0.4                     | Current major, minor patch available                                           | Run `npm update astro` to track 6.x patch releases. No major migration needed.             |
| `@astrojs/mdx` 5.0.0              | Aligned with Astro 6                                                           | No action.                                                                                 |
| `@astrojs/sitemap` 3.7.1          | Current                                                                        | No action.                                                                                 |
| `package.json` scripts            | Missing `typecheck`, `lint` scripts                                            | Add `"typecheck": "tsc --noEmit"` and `"lint": "eslint src"`                               |
| GA ID `G-R7TC88KH9N` in `site.ts` | Hardcoded — acceptable for public repo (GA IDs are not secrets), but confusing | Add `ANALYTICS` comment clarifying GA IDs are intentionally public. Do not move to `.env`. |

---

## Installation

```bash
# Code quality
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-astro eslint-plugin-jsx-a11y prettier prettier-plugin-astro

# Testing
npm install -D vitest @vitest/coverage-v8 @playwright/test @axe-core/playwright

# Git hooks
npm install -D husky lint-staged

# SEO (build-time rehype plugins)
npm install -D rehype-external-links rehype-slug rehype-autolink-headings

# Font self-hosting (verify stability before adopting)
# npm install -D @astrojs/fonts
```

---

## Sources

**Confidence levels reflect verification constraints: all external research tools were denied during this session. All findings are based on:**

- Direct codebase inspection (HIGH confidence — code is what it is)
- Training knowledge through August 2025 (MEDIUM confidence — may lag 6-18 months)
- Astro official documentation patterns known at training cutoff (MEDIUM confidence)

**Specific flags for manual verification before implementation:**

1. Confirm `eslint-plugin-astro` supports ESLint 9 flat config — check https://github.com/ota-meshi/eslint-plugin-astro
2. Confirm `@astrojs/fonts` stability in Astro 6.x — check https://docs.astro.build/en/guides/fonts/
3. Confirm `rehype-autolink-headings` remark/rehype version compatibility with Astro 6's unified pipeline
4. Check current Astro 6 patch version — `npm info astro version`
