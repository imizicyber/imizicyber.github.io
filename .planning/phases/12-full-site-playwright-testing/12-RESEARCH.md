# Phase 12: Full-Site Playwright Testing - Research

**Researched:** 2026-03-19
**Domain:** Playwright E2E testing, axe-core accessibility, Lighthouse CI performance budgets
**Confidence:** HIGH

## Summary

This phase expands the existing Playwright test suite from its current concern-based structure (12 spec files covering homepage, navigation, blog, contact form, quiz, analytics, cookie banner, CSP, CTA visibility, responsive, performance, and accessibility) to comprehensive coverage of all page routes, all interactive elements, 4 responsive breakpoints, axe-core scans on every page, and Lighthouse CI performance budgets in GitHub Actions.

The project already has a solid test foundation: Playwright 1.58+ with Chromium, an axe-core fixture in `e2e/fixtures/axe-test.ts`, 3-viewport responsive tests, Performance Observer patterns, and a working CI workflow at `.github/workflows/test-e2e.yml`. The work is primarily about extending existing patterns rather than introducing new tooling, with the one exception being `@lhci/cli` for the Lighthouse CI GitHub Actions job.

**Primary recommendation:** Extend existing spec files and patterns (concern-based structure, axe fixture, viewport array) to cover all routes and interactions. Add `@lhci/cli` as a devDependency and create a separate `lighthouse.yml` GitHub Actions workflow using `staticDistDir: ./dist`.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Keep existing concern-based file structure (one spec per concern, not one per page)
- Add `page-routes.spec.ts` for all page route checks (200 status, h1 present, no console errors) with describe blocks per page group
- Add `interactions.spec.ts` for untested interactive elements (theme toggle, WhatsApp links, nav hamburger open/close)
- Target total suite runtime under 2 minutes
- Expand to 4 breakpoints: 375px, 768px, 1024px, 1440px (add missing 1024px)
- Test representative subset of 5-6 pages for responsive (homepage, a service page, blog index, blog post, case study, tools/security-score) -- not all 20 routes
- Verify layout structure: hamburger visible on mobile (<768px) but not desktop, CTA visible above fold, no overlapping elements, no horizontal overflow
- No visual regression screenshots -- layout structure checks are sufficient
- Both approaches for performance: Playwright-based quick CWV checks in the test suite + full Lighthouse CI as a separate GitHub Actions job
- Playwright tests measure CLS and LCP using Performance Observer API
- @lhci/cli with lighthouserc.json for full Lighthouse scoring in CI
- Performance budgets: LCP < 2.5s, CLS < 0.1, FID < 100ms (hard fail in CI)
- axe-core scans on every page route using existing e2e/fixtures/axe-test.ts fixture
- Target: zero critical and serious violations
- Fix any violations found during testing rather than excluding rules
- Minor/moderate violations logged as warnings, not blockers

### Claude's Discretion

- Exact Lighthouse CI configuration and GitHub Actions workflow file
- Which axe-core rules to disable if any are genuinely false positives
- Performance Observer implementation details for CLS/LCP measurement
- How to handle flaky tests (retry strategy)

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                                                                                  | Research Support                                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TEST-01 | Playwright E2E tests covering every page (homepage, blog, services, tools, about, case studies, company-profile, resources, privacy, responsible-disclosure) | New `page-routes.spec.ts` with all 20+ routes grouped by page type; existing navigation.spec.ts covers some routes already                               |
| TEST-02 | Interactive element testing (contact form submission, tag filtering, quiz completion, theme toggle, cookie consent, WhatsApp links, nav hamburger menu)      | Contact form, quiz, cookie banner already covered; new `interactions.spec.ts` for theme toggle, WhatsApp links, nav hamburger; tag filtering test to add |
| TEST-03 | Responsive breakpoint testing at 375px, 768px, 1024px, 1440px for all pages                                                                                  | Extend existing responsive.spec.ts viewport array with 1024px; test 5-6 representative pages per CONTEXT.md decision                                     |
| TEST-04 | Accessibility testing with axe-core on every page (zero critical/serious violations)                                                                         | Extend existing accessibility.spec.ts using axe-test.ts fixture; loop through all page routes; filter violations by impact level                         |
| TEST-05 | Performance budget tests (LCP < 2.5s, CLS < 0.1, FID < 100ms) via Lighthouse CI                                                                              | Playwright Performance Observer for CLS/LCP in test suite; @lhci/cli with lighthouserc.json for full CI budgets; note FID replaced by INP/TBT            |

</phase_requirements>

## Standard Stack

### Core

| Library              | Version | Purpose                | Why Standard                                                                              |
| -------------------- | ------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| @playwright/test     | ^1.58.2 | E2E test framework     | Already installed and configured; Chromium project, webServer builds before testing       |
| @axe-core/playwright | ^4.11.1 | Accessibility scanning | Already installed; wraps Deque axe-core engine for Playwright; project has custom fixture |
| @lhci/cli            | ^0.15.x | Lighthouse CI runner   | Official Google tool for Lighthouse in CI; supports staticDistDir for static sites        |

### Supporting

| Library                     | Version | Purpose                        | When to Use                                                                  |
| --------------------------- | ------- | ------------------------------ | ---------------------------------------------------------------------------- |
| treosh/lighthouse-ci-action | v12     | GitHub Actions action for LHCI | Alternative to manual @lhci/cli installation in CI; simplifies workflow YAML |

### Alternatives Considered

| Instead of                   | Could Use                   | Tradeoff                                                                                                             |
| ---------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| @lhci/cli manually           | treosh/lighthouse-ci-action | Action is simpler YAML but less control over configuration; manual install gives full control over lighthouserc.json |
| Performance Observer for CWV | web-vitals library          | web-vitals is heavier; PerformanceObserver is native browser API, no dependency needed                               |
| axe-core filtering by impact | Custom rule disabling       | Filtering violations by impact is cleaner than disabling rules; keeps scans comprehensive                            |

**Installation:**

```bash
npm install --save-dev @lhci/cli
```

## Architecture Patterns

### Test File Organization (Concern-Based)

```
e2e/
├── fixtures/
│   └── axe-test.ts           # axe-core Playwright fixture (EXISTING)
├── accessibility.spec.ts      # axe scans on all pages (EXTEND)
├── analytics.spec.ts          # GA consent gating (EXISTING - no changes)
├── blog.spec.ts               # Blog navigation (EXISTING - no changes)
├── contact-form.spec.ts       # Form submission flows (EXISTING - no changes)
├── cookie-banner.spec.ts      # Consent flow (EXISTING - no changes)
├── csp.spec.ts                # CSP headers (EXISTING - no changes)
├── cta-visibility.spec.ts     # CTA above fold (EXISTING - no changes)
├── homepage.spec.ts           # Homepage checks (EXISTING - no changes)
├── interactions.spec.ts       # NEW: theme toggle, WhatsApp, hamburger, tag filter
├── navigation.spec.ts         # Nav links and routes (EXISTING - no changes)
├── page-routes.spec.ts        # NEW: all routes 200 + h1 + no console errors
├── performance.spec.ts        # Font/image/CWV checks (EXTEND with CLS/LCP)
├── quiz.spec.ts               # Quiz completion (EXISTING - no changes)
└── responsive.spec.ts         # 4-viewport layout checks (EXTEND)
```

### Pattern 1: All-Routes Smoke Test with Console Error Detection

**What:** A single spec file that tests every page route returns 200, has an h1, and produces no console errors.
**When to use:** Comprehensive route coverage without per-page detail.
**Example:**

```typescript
// Source: Playwright best practices + project patterns
import { test, expect } from '@playwright/test';

const allRoutes = [
  { group: 'Core', paths: ['/', '/about/', '/blog/', '/resources/'] },
  {
    group: 'Services',
    paths: [
      '/services/penetration-testing/',
      '/services/security-assessments/',
      '/services/managed-security/',
      '/services/custom-tooling/',
      '/services/security-training/',
    ],
  },
  {
    group: 'Content',
    paths: [
      '/case-studies/',
      '/case-studies/east-africa-bank-pentest/',
      '/case-studies/mobile-money-security-assessment/',
      '/company-profile/',
      '/privacy-policy/',
      '/responsible-disclosure/',
    ],
  },
  { group: 'Tools', paths: ['/tools/security-score/'] },
  // Blog posts are dynamic — test one representative post
];

for (const { group, paths } of allRoutes) {
  test.describe(`Page Routes: ${group}`, () => {
    for (const path of paths) {
      test(`${path} returns 200 with h1 and no console errors`, async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
        expect(consoleErrors).toEqual([]);
      });
    }
  });
}
```

### Pattern 2: axe-core All-Pages Loop

**What:** Run axe-core accessibility scans on every page route, filtering by impact severity.
**When to use:** Comprehensive accessibility coverage.
**Example:**

```typescript
// Source: Playwright accessibility docs + existing axe-test.ts fixture
import { test, expect } from './fixtures/axe-test';

const allPages = [
  '/',
  '/about/',
  '/blog/',
  '/resources/',
  '/services/penetration-testing/',
  '/services/security-assessments/',
  '/services/managed-security/',
  '/services/custom-tooling/',
  '/services/security-training/',
  '/case-studies/',
  '/case-studies/east-africa-bank-pentest/',
  '/case-studies/mobile-money-security-assessment/',
  '/company-profile/',
  '/privacy-policy/',
  '/responsible-disclosure/',
  '/tools/security-score/',
];

test.describe('Accessibility: All Pages', () => {
  for (const pagePath of allPages) {
    test(`${pagePath} has no critical/serious a11y violations`, async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto(pagePath);
      const results = await makeAxeBuilder().analyze();
      const criticalOrSerious = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      expect(criticalOrSerious).toEqual([]);
    });
  }
});
```

### Pattern 3: Performance Observer CWV Measurement

**What:** Measure CLS and LCP using native Performance Observer API in Playwright.
**When to use:** In-test quick CWV checks (complement to full Lighthouse CI).
**Example:**

```typescript
// Source: Checkly docs (https://www.checklyhq.com/docs/learn/playwright/performance/)
import { test, expect } from '@playwright/test';

test('LCP is under 2.5s on homepage', async ({ page }) => {
  await page.goto('/');

  const lcp = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries.at(-1);
        resolve(lastEntry?.startTime ?? 0);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });

  expect(lcp).toBeLessThan(2500);
});

test('CLS is under 0.1 on homepage', async ({ page }) => {
  await page.goto('/');
  // Allow time for layout shifts to occur
  await page.waitForLoadState('networkidle');

  const cls = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        resolve(clsValue);
      }).observe({ type: 'layout-shift', buffered: true });
    });
  });

  expect(cls).toBeLessThan(0.1);
});
```

### Pattern 4: Responsive Layout Structure Checks

**What:** Verify layout structural properties at 4 breakpoints.
**When to use:** Responsive validation without visual regression.
**Example:**

```typescript
// Source: Existing responsive.spec.ts pattern, extended
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
];

const responsivePages = [
  '/',
  '/services/penetration-testing/',
  '/blog/',
  '/case-studies/east-africa-bank-pentest/',
  '/tools/security-score/',
];

for (const vp of viewports) {
  test.describe(`Responsive: ${vp.name} (${vp.width}px)`, () => {
    for (const pagePath of responsivePages) {
      test(`${pagePath} no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(pagePath);
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(vp.width);
      });
    }

    test('hamburger visible on mobile, hidden on desktop', async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      const menuBtn = page.locator('.menu-btn');
      if (vp.width < 768) {
        await expect(menuBtn).toBeVisible();
      } else {
        await expect(menuBtn).not.toBeVisible();
      }
    });
  });
}
```

### Anti-Patterns to Avoid

- **One spec file per page:** Creates file explosion, makes maintenance harder. Use concern-based grouping with page loops.
- **Visual regression screenshots:** Brittle across CI environments (font rendering, anti-aliasing). Use structural assertions (element visibility, bounding boxes, overflow checks).
- **Hardcoded test timeout per test:** Use Playwright's built-in timeout and retry. Avoid `page.waitForTimeout()` for assertions -- use `expect().toPass()` or `expect().toBeVisible({ timeout: N })` instead.
- **Testing all 20+ routes at all 4 breakpoints:** Results in 80+ responsive tests. Test a representative subset of 5-6 pages for responsive; test all pages for route smoke and accessibility.

## Don't Hand-Roll

| Problem                        | Don't Build                          | Use Instead                                      | Why                                                                    |
| ------------------------------ | ------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------- |
| Accessibility scanning         | Custom DOM traversal for a11y        | @axe-core/playwright with existing fixture       | axe-core covers 400+ WCAG rules; impossible to replicate               |
| Lighthouse performance scoring | Custom performance metric collection | @lhci/cli with lighthouserc.json                 | Lighthouse simulates throttled conditions, calculates composite scores |
| CWV measurement                | Custom timing logic                  | PerformanceObserver API (native browser)         | Standard W3C API, exactly what real browsers use                       |
| CI workflow for Lighthouse     | Custom scripts to run Lighthouse     | @lhci/cli autorun or treosh/lighthouse-ci-action | Handles server lifecycle, multiple runs, result aggregation            |

**Key insight:** All performance measurement tools in this phase use standards-based APIs (PerformanceObserver, Lighthouse audits). The custom code is only the test harness that invokes them, not the measurement logic itself.

## Common Pitfalls

### Pitfall 1: FID vs INP Confusion

**What goes wrong:** The CONTEXT.md specifies "FID < 100ms" but Google replaced FID with INP (Interaction to Next Paint) as a Core Web Vital in March 2024.
**Why it happens:** FID was the original CWV metric for responsiveness. Many references still use FID.
**How to avoid:** In Lighthouse CI assertions, use `total-blocking-time` (TBT) as the proxy metric. TBT correlates strongly with INP and is measurable in Lighthouse lab tests. FID/INP require real user interaction and cannot be reliably measured in synthetic Lighthouse runs. Use TBT < 200ms as the budget (Lighthouse good threshold).
**Warning signs:** If you see `first-input-delay` in lighthouserc.json assertions, it will not produce useful results -- Lighthouse lab mode cannot measure FID.

### Pitfall 2: Performance Observer Promise Never Resolving

**What goes wrong:** Tests hang because the PerformanceObserver callback never fires.
**Why it happens:** `largest-contentful-paint` observer only fires entries after real content paints. On very fast local servers, the entry may fire before the observer is registered. The `layout-shift` observer may fire zero entries if no shifts occur.
**How to avoid:** Always use `buffered: true` in the observe options (this replays past entries). For CLS, add a timeout fallback that resolves with 0 if no shifts are observed (which is a perfect score). Wait for `networkidle` before reading CLS.
**Warning signs:** Tests timeout at 30s instead of failing with assertion.

### Pitfall 3: Blog Post Dynamic Routes

**What goes wrong:** Tests reference hardcoded blog post slugs that may change or be removed.
**Why it happens:** Blog posts are content collection entries with dynamic `[...slug]` routing.
**How to avoid:** Test one representative blog post by slug (pick a stable one) or navigate from the blog index in the test. Don't try to enumerate all 19 blog posts -- test one representative post and let the page-routes spec test the blog index.
**Warning signs:** Tests fail after a blog post is renamed or deleted.

### Pitfall 4: Cookie Banner Blocking Interactions

**What goes wrong:** Tests for interactive elements fail because the cookie banner overlay prevents clicks.
**Why it happens:** Cookie banner is `aria-modal` and traps focus. Clicking elements behind it fails.
**How to avoid:** Dismiss the cookie banner at the start of interaction tests (click reject or accept). The existing accessibility.spec.ts already has this pattern. Consider a shared helper or `beforeEach` hook.
**Warning signs:** "Element is not clickable at point" errors in CI.

### Pitfall 5: Lighthouse CI Timeout on CI Server

**What goes wrong:** Lighthouse CI times out or produces poor scores in GitHub Actions.
**Why it happens:** CI runners have limited CPU and no GPU. Lighthouse simulates throttling on top of already-slow CI, producing artificially bad scores.
**How to avoid:** Use `staticDistDir` (LHCI starts its own optimized server). Increase `numberOfRuns` to 3+ and use median aggregation. Set budgets generously for CI (LCP < 2.5s, not < 1s). Consider using `--chrome-flags="--no-sandbox"` in CI.
**Warning signs:** Performance scores vary wildly between runs; LCP passes locally but fails in CI.

### Pitfall 6: Suite Runtime Exceeding 2 Minutes

**What goes wrong:** Adding all-page loops for routes, accessibility, and responsive creates hundreds of test cases.
**Why it happens:** Each test navigates a page, waits for load. 20 pages x 4 breakpoints = 80 responsive tests alone.
**How to avoid:** Keep responsive tests to 5-6 representative pages (per CONTEXT.md). Run Playwright with `fullyParallel: true` (already configured). Keep Lighthouse CI in a separate workflow (does not count against Playwright suite time). Route smoke tests are fast (< 1s each). Accessibility scans take ~2-3s each (20 pages = ~50s).
**Warning signs:** Monitor `npx playwright test --reporter=list` output for timing.

## Code Examples

### Lighthouse CI Configuration (lighthouserc.json)

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": [
        "http://localhost/index.html",
        "http://localhost/about/index.html",
        "http://localhost/blog/index.html",
        "http://localhost/services/penetration-testing/index.html",
        "http://localhost/tools/security-score/index.html"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }],
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Note on metrics:** Use `total-blocking-time` instead of `first-input-delay`. TBT is measurable in Lighthouse lab mode and correlates with INP (which replaced FID). The user-specified "FID < 100ms" maps to "TBT < 200ms" in Lighthouse terms.

### GitHub Actions Lighthouse CI Workflow (.github/workflows/lighthouse.yml)

```yaml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - run: npm ci

      - name: Build site
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.15.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Interactions Spec Pattern (interactions.spec.ts)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Interactive Elements', () => {
  test('theme toggle switches between dark and light mode', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.locator('#theme-toggle-btn');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Verify persistence after reload
    await toggle.click(); // set to light
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('WhatsApp float link has correct href', async ({ page }) => {
    await page.goto('/');
    const whatsappLink = page.locator('a[href*="wa.me"]');
    await expect(whatsappLink.first()).toBeVisible();
    const href = await whatsappLink.first().getAttribute('href');
    expect(href).toContain('wa.me');
    expect(href).toContain('text=');
  });

  test('nav hamburger opens and closes menu on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuBtn = page.locator('.menu-btn');
    const navLinks = page.locator('.nav-links');

    // Open
    await menuBtn.click();
    await expect(navLinks).toHaveClass(/open/);

    // Close
    await menuBtn.click();
    await expect(navLinks).not.toHaveClass(/open/);
  });

  test('blog tag filter shows/hides posts', async ({ page }) => {
    await page.goto('/blog/');

    const tagButtons = page.locator('[data-tag]');
    const tagCount = await tagButtons.count();
    if (tagCount === 0) return; // No tags present, skip

    // Click a tag
    const firstTag = tagButtons.first();
    const tagName = await firstTag.getAttribute('data-tag');
    await firstTag.click();

    // Verify filter applied
    const visibleCards = page.locator('a.blog-card:visible');
    const allCards = page.locator('a.blog-card');
    const visibleCount = await visibleCards.count();
    const totalCount = await allCards.count();

    // Either filter reduced count or all posts match the tag
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThanOrEqual(totalCount);
  });
});
```

## State of the Art

| Old Approach                  | Current Approach                | When Changed | Impact                                                                           |
| ----------------------------- | ------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| FID (First Input Delay)       | INP (Interaction to Next Paint) | March 2024   | INP measures ALL interactions, not just first; threshold is 200ms (not 100ms)    |
| Lighthouse FID audit          | TBT as proxy + INP in field     | 2024-2025    | Lab Lighthouse uses TBT; INP requires real user data (CrUX)                      |
| Visual regression screenshots | Structural layout assertions    | 2024-2025    | Screenshots are brittle across environments; structural checks are deterministic |
| Per-page test files           | Concern-based with page loops   | Ongoing      | Better maintenance, clearer failure messages, less file duplication              |

**Deprecated/outdated:**

- **FID metric:** Replaced by INP in Core Web Vitals. Lighthouse cannot measure FID in lab mode. Use TBT as the lab proxy.
- **`networkidle` for test readiness:** Playwright docs recommend `domcontentloaded` or specific element waits. `networkidle` is acceptable for CLS measurement but not as a general page-ready signal.

## Open Questions

1. **Blog post slug stability**
   - What we know: 19 blog posts exist as MDX content collection entries
   - What's unclear: Whether any posts will be renamed/removed during this phase
   - Recommendation: Pick a stable, representative post slug for testing (e.g., `penetration-testing-rwanda`). Test from blog index click-through as fallback.

2. **LHCI_GITHUB_APP_TOKEN setup**
   - What we know: Lighthouse CI GitHub App provides status checks on PRs
   - What's unclear: Whether the project owner wants to install the GitHub App
   - Recommendation: Make the token optional in the workflow (skip status check upload if not configured). Use `temporary-public-storage` as upload target which works without tokens.

3. **Actual axe-core violation count**
   - What we know: Homepage, blog index, and security-score page pass with zero critical violations currently
   - What's unclear: Whether all 20+ pages pass axe-core scans (some pages have never been tested)
   - Recommendation: Run scans, fix violations found rather than excluding rules (per CONTEXT.md decision).

## Validation Architecture

### Test Framework

| Property           | Value                                                    |
| ------------------ | -------------------------------------------------------- |
| Framework          | Playwright ^1.58.2 + @axe-core/playwright ^4.11.1        |
| Config file        | `playwright.config.ts` (existing)                        |
| Quick run command  | `npx playwright test --grep "page-routes\|interactions"` |
| Full suite command | `npx playwright test`                                    |

### Phase Requirements to Test Map

| Req ID  | Behavior                                                                  | Test Type         | Automated Command                                          | File Exists?                                 |
| ------- | ------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------- | -------------------------------------------- |
| TEST-01 | Every page returns 200, has h1, no console errors                         | E2E smoke         | `npx playwright test page-routes.spec.ts`                  | Wave 0                                       |
| TEST-02 | Interactive elements work (theme toggle, WhatsApp, hamburger, tag filter) | E2E interaction   | `npx playwright test interactions.spec.ts`                 | Wave 0                                       |
| TEST-03 | Responsive at 4 breakpoints on representative pages                       | E2E responsive    | `npx playwright test responsive.spec.ts`                   | Exists (extend)                              |
| TEST-04 | axe-core zero critical/serious on all pages                               | E2E accessibility | `npx playwright test accessibility.spec.ts`                | Exists (extend)                              |
| TEST-05 | CWV budgets (LCP, CLS, TBT)                                               | E2E perf + CI job | `npx playwright test performance.spec.ts` + `lhci autorun` | Exists (extend) + Wave 0 (lighthouserc.json) |

### Sampling Rate

- **Per task commit:** `npx playwright test --grep "relevant-spec"` (run affected spec only)
- **Per wave merge:** `npx playwright test` (full suite)
- **Phase gate:** Full suite green + `lhci autorun` passes before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `e2e/page-routes.spec.ts` -- covers TEST-01 (all page route smoke tests)
- [ ] `e2e/interactions.spec.ts` -- covers TEST-02 (untested interactive elements)
- [ ] `lighthouserc.json` -- covers TEST-05 (Lighthouse CI configuration)
- [ ] `.github/workflows/lighthouse.yml` -- covers TEST-05 (CI workflow for Lighthouse)
- [ ] `npm install --save-dev @lhci/cli` -- if @lhci/cli not already installed

## Sources

### Primary (HIGH confidence)

- Playwright official docs - [Accessibility testing](https://playwright.dev/docs/accessibility-testing), [Best practices](https://playwright.dev/docs/best-practices), [Retries](https://playwright.dev/docs/test-retries)
- Lighthouse CI official docs - [Configuration](https://googlechrome.github.io/lighthouse-ci/docs/configuration.html), [Getting started](https://googlechrome.github.io/lighthouse-ci/docs/getting-started.html)
- Existing project code - `playwright.config.ts`, `e2e/fixtures/axe-test.ts`, all 12 existing spec files
- Google web.dev - [INP replacing FID](https://web.dev/blog/inp-cwv)

### Secondary (MEDIUM confidence)

- [Checkly docs: Performance measurement with Playwright](https://www.checklyhq.com/docs/learn/playwright/performance/) - Performance Observer code patterns verified against W3C spec
- [Lighthouse CI GitHub](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md) - lighthouserc.json configuration structure
- [Lighthouse CI Action](https://github.com/marketplace/actions/lighthouse-ci-action) - GitHub Actions marketplace integration

### Tertiary (LOW confidence)

- None -- all findings verified against official documentation or existing project code

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - all libraries already installed except @lhci/cli; versions verified from package.json
- Architecture: HIGH - extending existing proven patterns in the codebase; no new architectural decisions
- Pitfalls: HIGH - FID/INP transition is well-documented; other pitfalls from established Playwright patterns
- Performance Observer: MEDIUM - code patterns verified against Checkly docs and W3C PerformanceObserver spec; may need timeout fallbacks in practice

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable -- Playwright and Lighthouse CI are mature tools)
