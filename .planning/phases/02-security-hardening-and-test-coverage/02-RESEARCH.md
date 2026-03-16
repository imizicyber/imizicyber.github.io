# Phase 2: Security Hardening and Test Coverage - Research

**Researched:** 2026-03-16
**Domain:** CSP hardening, E2E testing (Playwright + axe-core), innerHTML elimination, secret scanning (gitleaks)
**Confidence:** HIGH

## Summary

Phase 2 transforms this public cybersecurity firm website from "functional" to "auditable." Five workstreams converge: (1) replace `unsafe-inline` in CSP with SHA-256 hashes for the single remaining inline script, (2) eliminate all `innerHTML` usage in the quiz UI with safe DOM API methods, (3) add Playwright E2E tests covering critical user journeys with embedded axe-core accessibility scans, (4) audit the full git history for secrets and add gitleaks to the pre-commit pipeline, and (5) add an ESLint rule to prevent innerHTML regressions.

Astro 6 ships an experimental `security.csp` feature that auto-generates script and style hashes at build time. This is the correct approach for this project -- it eliminates manual hash management and integrates with Astro's build pipeline. However, it has limitations: view transitions and Shiki syntax highlighting are incompatible. Since this site uses neither, the experimental CSP feature is a clean fit.

**Primary recommendation:** Use Astro's experimental `security.csp` in `astro.config.mjs` to auto-generate CSP hashes, removing all manual CSP meta tag construction from BaseLayout and company-profile. Install Playwright with `@axe-core/playwright` for E2E + accessibility testing. Install gitleaks via Homebrew and wire into Husky pre-commit. Replace all 3 innerHTML sites in `ui.ts` with `createElement`/`appendChild`.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Hash-based CSP: compute SHA-256 hash of the one remaining `is:inline` FOUC prevention script in BaseLayout, add hash to CSP `script-src`
- Remove `'unsafe-inline'` from both `script-src` and `style-src` in CSP
- Company-profile page follows the same CSP strategy as the main site -- consistent policy across all pages
- GitHub Pages has no server, so nonce-based CSP is not possible -- hashes are the correct approach
- Both BaseLayout.astro (line 58-64) and company-profile/index.astro (line 18) need CSP updates
- Comprehensive Playwright tests: all pages load, all forms work, theme toggle, cookie banner, service pages, 404 page (~10-15 tests)
- E2E tests run in CI only (GitHub Actions), NOT in pre-commit hook -- keeps commits fast
- Vitest unit tests remain in pre-commit (already configured from Phase 1)
- axe-core accessibility checks integrated into Playwright tests (QUAL-12)
- Full git history scan using gitleaks or trufflehog -- catches anything ever committed, even if later removed
- GA ID (G-R7TC88KH9N) and Formspree ID are intentionally public -- exclude from scan
- Add gitleaks as a pre-commit hook to prevent future secret leaks
- Wire gitleaks into the existing Husky pre-commit pipeline (lint + typecheck + test + format + gitleaks)
- Replace all innerHTML with DOM API (createElement + appendChild) everywhere -- no exceptions
- 3 locations in `src/scripts/quiz/ui.ts`: score bullets (line 115), breakdown table (line 147), recommendations list (line 172)
- Test files also change: replace innerHTML test setup with DOM API helpers
- Zero innerHTML usage anywhere in the repo -- consistent approach for a cybersecurity firm

### Claude's Discretion

- Exact Playwright test file organization (single file vs. per-page files)
- axe-core rule severity thresholds
- Gitleaks configuration (custom rules, allowlist format)
- CSP hash generation approach (build-time vs. manual)
- Whether to add `style-src` hashes or use external stylesheets

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                   | Research Support                                                                                       |
| ------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| QUAL-07 | Playwright end-to-end tests cover critical user journeys (homepage, contact form, blog, quiz) | Playwright config with webServer `astro preview`, test structure per-page, CI workflow                 |
| QUAL-09 | CSP header uses hashes instead of unsafe-inline for scripts                                   | Astro experimental `security.csp` auto-generates SHA-256 hashes; removes need for manual CSP meta tags |
| QUAL-10 | innerHTML usage in security score quiz replaced with safe DOM API methods                     | 3 locations in `ui.ts` identified; DOM API patterns documented below                                   |
| QUAL-11 | No sensitive data (API keys, tokens, passwords) committed to repository                       | Gitleaks `detect` for full history scan + `protect --staged` for pre-commit hook                       |
| QUAL-12 | Axe-core accessibility testing integrated into Playwright tests                               | `@axe-core/playwright` with `AxeBuilder` fixture, `withTags(['wcag2a', 'wcag2aa'])`                    |

</phase_requirements>

## Standard Stack

### Core

| Library                | Version | Purpose                                 | Why Standard                                                                             |
| ---------------------- | ------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `@playwright/test`     | `^1.x`  | E2E browser testing                     | Astro's recommended E2E framework; cross-browser; free; built-in webServer support       |
| `@axe-core/playwright` | `^4.x`  | Accessibility testing within Playwright | Industry-standard a11y engine; integrates directly with Playwright tests                 |
| `gitleaks`             | `^8.x`  | Secret scanning (binary via Homebrew)   | De facto secret scanner; 100+ built-in rules; supports pre-commit and full-history modes |

### Supporting

| Library              | Version                | Purpose                                | When to Use                                                                 |
| -------------------- | ---------------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| Astro `security.csp` | Astro 6.x experimental | Auto-generate CSP hashes at build time | Replaces manual CSP meta tag construction in BaseLayout and company-profile |

### Alternatives Considered

| Instead of                 | Could Use                       | Tradeoff                                                                                                   |
| -------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Astro experimental CSP     | Manual SHA-256 hash computation | Manual approach requires recalculating hash every time the inline script changes; Astro CSP automates this |
| gitleaks (Homebrew binary) | trufflehog (npm/binary)         | Both are excellent; gitleaks is simpler to configure, lighter, and has native pre-commit support           |
| gitleaks (Homebrew)        | gitleaks npm package            | npm package is unmaintained; Homebrew binary is the official distribution                                  |

**Installation:**

```bash
# E2E testing
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium

# Secret scanning (system-level, not npm)
brew install gitleaks
```

## Architecture Patterns

### Recommended Project Structure

```
e2e/                         # Playwright E2E tests (separate from Vitest unit tests)
  fixtures/
    axe-test.ts              # Shared AxeBuilder fixture with WCAG tags
  homepage.spec.ts            # Homepage: load, hero, CTAs, theme toggle
  navigation.spec.ts          # Nav links, service pages, 404
  blog.spec.ts                # Blog index, blog post, navigation
  contact-form.spec.ts        # Form validation, submission (mock Formspree)
  quiz.spec.ts                # Quiz flow: answer questions, calculate score, gate form
  cookie-banner.spec.ts       # Cookie consent: accept, reject, persistence
  accessibility.spec.ts       # Dedicated axe-core scans across all pages
playwright.config.ts          # Playwright config with webServer: astro preview
.gitleaks.toml                # Gitleaks allowlist for public IDs (GA, Formspree)
```

### Pattern 1: Playwright Config for Astro Static Site

**What:** Configure Playwright to build the site and serve via `astro preview` before running tests.
**When to use:** All E2E test runs (local and CI).

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### Pattern 2: AxeBuilder Fixture for Consistent Accessibility Testing

**What:** Shared Playwright fixture that pre-configures axe-core with WCAG 2.1 AA tags.
**When to use:** Every test that checks accessibility.

```typescript
// e2e/fixtures/axe-test.ts
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
    await use(makeAxeBuilder);
  },
});

export { expect };
```

### Pattern 3: innerHTML Replacement with DOM API

**What:** Replace string-based HTML construction with safe DOM manipulation.
**When to use:** All 3 innerHTML locations in `ui.ts`.

```typescript
// BEFORE (XSS risk):
bulletsContent.innerHTML =
  '<div class="bullet"><span class="bullet-icon bi-warn">!</span><span>Text</span></div>';

// AFTER (safe DOM API):
function createBullet(iconClass: string, iconText: string, labelText: string): HTMLElement {
  const div = document.createElement('div');
  div.className = 'bullet';

  const icon = document.createElement('span');
  icon.className = `bullet-icon ${iconClass}`;
  icon.textContent = iconText;

  const label = document.createElement('span');
  label.textContent = labelText;

  div.appendChild(icon);
  div.appendChild(label);
  return div;
}

// Usage:
bulletsContent.replaceChildren(); // clear existing content
quizAnswers.forEach((v, idx) => {
  if (v <= 1) {
    bulletsContent.appendChild(
      createBullet('bi-warn', '!', `${QUESTIONS[idx].label}: ${QUESTIONS[idx].recos[v].h}`),
    );
  } else if (v >= 3) {
    bulletsContent.appendChild(createBullet('bi-ok', '\u2713', `${QUESTIONS[idx].label}: strong`));
  }
});
```

### Pattern 4: Astro Experimental CSP Configuration

**What:** Enable Astro's built-in CSP hash generation to replace manual CSP meta tags.
**When to use:** In `astro.config.mjs` to auto-generate hashes for all inline scripts and styles.

```javascript
// astro.config.mjs
export default defineConfig({
  // ... existing config
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        'font-src https://fonts.gstatic.com',
        "img-src 'self' https: data:",
        "connect-src 'self' https://formspree.io https://www.google-analytics.com",
        "frame-ancestors 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://www.googletagmanager.com'],
      },
      styleDirective: {
        resources: ["'self'", 'https://fonts.googleapis.com'],
      },
    },
  },
});
```

**Important:** When this is enabled, the manual `<meta http-equiv="Content-Security-Policy">` tags in BaseLayout.astro and company-profile/index.astro must be REMOVED -- Astro will generate them automatically. The `is:inline` FOUC script hash will be auto-computed.

### Pattern 5: Gitleaks Allowlist Configuration

**What:** Exclude intentionally public IDs from secret scanning.
**When to use:** Gitleaks config file for both pre-commit and history scan.

```toml
# .gitleaks.toml
title = "Imizi Cyber Gitleaks Config"

[allowlist]
  description = "Intentionally public identifiers"
  regexTarget = "match"
  regexes = [
    '''G-R7TC88KH9N''',           # Google Analytics ID (public)
    '''https://formspree\.io/f/''', # Formspree endpoint (public)
  ]
  paths = [
    '''\.planning/.*''',           # Planning docs may reference IDs
  ]
```

### Anti-Patterns to Avoid

- **Using `dangerouslySetInnerHTML` or equivalent wrappers:** This is just innerHTML with extra steps. Use real DOM API methods.
- **Computing CSP hashes manually and hardcoding them:** Astro's experimental CSP auto-generates hashes at build time. Manual hashes break when the script content changes by even one character.
- **Installing gitleaks via npm:** The npm package `gitleaks` is unmaintained. Use the Homebrew binary (official distribution).
- **Running Playwright in pre-commit:** E2E tests take 30-60 seconds. They belong in CI, not in the pre-commit hook.
- **Using `'unsafe-inline'` as a fallback alongside hashes:** Browsers that support CSP Level 2 will ignore `unsafe-inline` when hashes are present. Keeping it adds no security benefit and signals poor understanding to evaluators.

## Don't Hand-Roll

| Problem               | Don't Build                        | Use Instead                            | Why                                                                                                       |
| --------------------- | ---------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| CSP hash generation   | Manual SHA-256 computation scripts | Astro experimental `security.csp`      | Hashes must match exact script content including whitespace; build-time automation eliminates human error |
| Secret scanning       | Custom regex patterns for API keys | Gitleaks with 100+ built-in rules      | Secret patterns are complex and evolving; gitleaks covers OAuth tokens, AWS keys, private keys, etc.      |
| Accessibility testing | Manual WCAG checklist              | `@axe-core/playwright` automated scans | axe-core tests 80+ WCAG rules consistently; humans miss things                                            |
| DOM sanitization      | Custom escapeHtml() function       | DOM API (createElement/textContent)    | DOM API is inherently safe -- textContent cannot execute scripts                                          |

**Key insight:** For a cybersecurity firm, using industry-standard security tools (gitleaks, axe-core, CSP hashes) rather than hand-rolled solutions is itself a credibility signal.

## Common Pitfalls

### Pitfall 1: CSP Hash Mismatch

**What goes wrong:** Hash in CSP meta tag does not match the actual script content, so browser blocks the script.
**Why it happens:** Any whitespace or content change in the inline script invalidates the hash. Manual hash computation is fragile.
**How to avoid:** Use Astro's experimental `security.csp` which computes hashes automatically at build time from actual script content.
**Warning signs:** Console error "Refused to execute inline script because it violates CSP directive."

### Pitfall 2: style-src Hashes and Astro Scoped Styles

**What goes wrong:** Astro generates scoped `<style>` blocks per component. Removing `'unsafe-inline'` from `style-src` without hashing all style blocks breaks all component styles.
**Why it happens:** Astro injects scoped styles as inline `<style>` tags. Without `unsafe-inline` or per-style hashes, browsers block them.
**How to avoid:** Astro's experimental CSP auto-generates style hashes as well. Rely on it rather than manually computing hashes for dozens of style blocks.
**Warning signs:** All component styles disappear; page renders as unstyled HTML.

### Pitfall 3: Gitleaks False Positives on Public IDs

**What goes wrong:** Gitleaks flags Google Analytics ID and Formspree endpoint URL as secrets.
**Why it happens:** GA IDs match generic API key patterns. Formspree URLs contain what looks like a token.
**How to avoid:** Create `.gitleaks.toml` with allowlist regexes for known public IDs BEFORE running the first scan.
**Warning signs:** Pre-commit hook blocks every commit with "secret detected" on GA ID.

### Pitfall 4: Playwright webServer Timeout

**What goes wrong:** Playwright times out waiting for `astro preview` to start.
**Why it happens:** The `npm run build` step must complete before preview starts. Default timeout may be too short for CI.
**How to avoid:** Set `timeout: 120_000` (2 minutes) in webServer config. Use `command: 'npm run build && npm run preview'` so both steps run sequentially.
**Warning signs:** "Timed out waiting for server" error in CI.

### Pitfall 5: Astro Experimental CSP + company-profile Page

**What goes wrong:** Company-profile page has its own HTML structure (no BaseLayout). Astro's experimental CSP may not inject the meta tag into pages that do not use a standard layout.
**Why it happens:** Company-profile is a standalone page with its own `<head>` construction.
**How to avoid:** Verify after enabling CSP that company-profile receives the auto-generated CSP meta tag. If not, the page may need to use BaseLayout or have CSP manually added. This needs a spike during implementation.
**Warning signs:** Company-profile page missing CSP meta tag in built output.

### Pitfall 6: innerHTML in Test Setup Files

**What goes wrong:** Tests use `document.body.innerHTML = '...'` for setup. Zero-innerHTML policy flags these.
**Why it happens:** innerHTML in test setup is common practice and technically safe (no user input).
**How to avoid:** Replace test setup innerHTML with DOM API helpers or use happy-dom's `document.body.replaceChildren()` pattern. The CONTEXT.md explicitly says test files must also change.
**Warning signs:** ESLint no-innerHTML rule flags test files.

## Code Examples

### E2E Test: Homepage Load with Accessibility

```typescript
// e2e/homepage.spec.ts
import { test, expect } from './fixtures/axe-test';

test.describe('Homepage', () => {
  test('loads and displays hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Imizi Cyber/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('theme toggle switches between dark and light', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    // Default theme (dark or from localStorage)
    const initialTheme = await html.getAttribute('data-theme');
    // Click theme toggle
    await page.click('[data-testid="theme-toggle"]');
    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('has no critical accessibility violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');
    const results = await makeAxeBuilder().analyze();
    expect(results.violations).toEqual([]);
  });
});
```

### E2E Test: Quiz Completion

```typescript
// e2e/quiz.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Security Score Quiz', () => {
  test('completes quiz and shows results', async ({ page }) => {
    await page.goto('/tools/security-score/');
    // Answer all 10 questions
    for (let i = 0; i < 10; i++) {
      await page.click(`.quiz-card.active .option:first-child`);
      await page.waitForTimeout(600); // Wait for auto-advance
    }
    // Click calculate
    await page.click('#calc-btn');
    // Verify result section appears
    await expect(page.locator('#result-section')).toBeVisible();
    await expect(page.locator('#score-num')).toBeVisible();
  });
});
```

### innerHTML Replacement: Breakdown Table

```typescript
// Safe DOM API pattern for breakdown bars
function createBreakdownBar(label: string, score: number, maxScore: number): HTMLElement {
  const pct = Math.round((score / maxScore) * 100);

  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '12px';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.marginBottom = '4px';

  const labelSpan = document.createElement('span');
  labelSpan.style.fontSize = '.84rem';
  labelSpan.style.color = 'var(--white)';
  labelSpan.style.fontWeight = '600';
  labelSpan.textContent = label;

  const scoreSpan = document.createElement('span');
  scoreSpan.style.fontFamily = 'var(--mono)';
  scoreSpan.style.fontSize = '.72rem';
  scoreSpan.style.color = 'var(--txt3)';
  scoreSpan.textContent = `${score}/3`;

  header.appendChild(labelSpan);
  header.appendChild(scoreSpan);

  const track = document.createElement('div');
  track.style.height = '6px';
  track.style.background = 'var(--bg3)';
  track.style.borderRadius = '3px';
  track.style.overflow = 'hidden';

  const fill = document.createElement('div');
  fill.style.height = '100%';
  fill.style.width = `${pct}%`;
  fill.style.background = 'linear-gradient(90deg,var(--acc2),var(--acc))';
  fill.style.borderRadius = '3px';

  track.appendChild(fill);
  wrapper.appendChild(header);
  wrapper.appendChild(track);
  return wrapper;
}
```

### Gitleaks Pre-commit Integration with Husky

```bash
# .husky/pre-commit (updated)
npm run typecheck
npm run test -- --run
npx lint-staged
gitleaks protect --staged --redact
```

### GitHub Actions CI Workflow for E2E Tests

```yaml
# .github/workflows/test-e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## State of the Art

| Old Approach                              | Current Approach                                             | When Changed              | Impact                                                   |
| ----------------------------------------- | ------------------------------------------------------------ | ------------------------- | -------------------------------------------------------- |
| Manual CSP meta tags with `unsafe-inline` | Astro experimental `security.csp` with auto-generated hashes | Astro 6.0.0 (2025)        | Eliminates manual hash management; per-page CSP policies |
| innerHTML for dynamic DOM content         | DOM API (createElement + textContent + appendChild)          | Always the right approach | Eliminates XSS attack surface entirely                   |
| Manual secret audits                      | Automated gitleaks in pre-commit + CI                        | Gitleaks v8+ (2023+)      | Catches secrets before they reach the repo               |
| Manual accessibility audits               | axe-core automated scans in Playwright                       | @axe-core/playwright v4   | Consistent WCAG 2.1 AA coverage on every test run        |

**Deprecated/outdated:**

- `gitleaks` npm package: Unmaintained. Use the official binary via Homebrew.
- Manual CSP hash computation: Astro's experimental feature automates this now.

## Open Questions

1. **Astro experimental CSP + company-profile page**
   - What we know: Company-profile does not use BaseLayout. It has its own `<head>`.
   - What's unclear: Whether Astro's experimental CSP injects the meta tag into pages that do not use standard layouts.
   - Recommendation: Test during implementation. If company-profile does not receive CSP, it may need to import BaseLayout or use a shared head partial.

2. **Astro experimental CSP stability**
   - What we know: Feature is marked "experimental" in Astro 6.x. It auto-generates hashes for scripts and styles.
   - What's unclear: Edge cases with third-party font loading via `onload` handler on the font preload link.
   - Recommendation: Enable the feature, build, and inspect the generated CSP meta tag to verify all directives are correct. If the experimental flag causes issues, fall back to manual hash computation using Node.js `crypto.createHash('sha256')` at build time.

3. **Gitleaks availability in CI**
   - What we know: Gitleaks is installed via Homebrew locally. CI runners (ubuntu-latest) need a different installation path.
   - What's unclear: Whether to use the GitHub Action (`gitleaks/gitleaks-action@v2`) or install the binary manually.
   - Recommendation: Use `gitleaks/gitleaks-action@v2` in CI workflows. For local development, require `brew install gitleaks` (documented in README).

4. **Font preload `onload` handler and CSP**
   - What we know: BaseLayout line 108 has `onload="this.onload=null;this.rel='stylesheet'"` on the font preload link. This is an inline event handler.
   - What's unclear: Whether CSP hashes apply to inline event handlers. CSP Level 2 does NOT hash inline event handlers -- they require `'unsafe-hashes'` or refactoring.
   - Recommendation: Replace the `onload` inline handler with a proper `<link rel="stylesheet">` tag inside `<noscript>` and use the `media` attribute trick (`media="print" onload` -> replace with JS event listener in an external script). Or simply use a blocking stylesheet load and accept the minor performance tradeoff. This must be addressed for CSP compliance.

## Validation Architecture

### Test Framework

| Property           | Value                                          |
| ------------------ | ---------------------------------------------- |
| Framework (unit)   | Vitest 4.1.0 with happy-dom                    |
| Framework (E2E)    | Playwright (to be installed)                   |
| Config file (unit) | `vitest.config.ts` (exists)                    |
| Config file (E2E)  | `playwright.config.ts` (Wave 0 -- to create)   |
| Quick run command  | `npm run test -- --run`                        |
| Full suite command | `npm run test -- --run && npx playwright test` |

### Phase Requirements to Test Map

| Req ID  | Behavior                                           | Test Type   | Automated Command                                         | File Exists?                              |
| ------- | -------------------------------------------------- | ----------- | --------------------------------------------------------- | ----------------------------------------- |
| QUAL-07 | E2E tests cover homepage, contact form, blog, quiz | E2E         | `npx playwright test`                                     | Wave 0                                    |
| QUAL-09 | CSP has no unsafe-inline for scripts               | E2E         | `npx playwright test e2e/csp.spec.ts`                     | Wave 0                                    |
| QUAL-10 | No innerHTML in quiz UI                            | unit + grep | `grep -r innerHTML src/scripts/ && npm run test -- --run` | Partial (existing unit tests need update) |
| QUAL-11 | No secrets in git history                          | CLI         | `gitleaks detect --source . --verbose`                    | Wave 0 (one-time scan)                    |
| QUAL-12 | axe-core zero critical violations                  | E2E         | `npx playwright test e2e/accessibility.spec.ts`           | Wave 0                                    |

### Sampling Rate

- **Per task commit:** `npm run test -- --run` (unit tests only, < 5 seconds)
- **Per wave merge:** `npm run test -- --run && npx playwright test` (full suite)
- **Phase gate:** Full suite green + `gitleaks detect` clean + `grep -r innerHTML src/scripts/` returns nothing

### Wave 0 Gaps

- [ ] `playwright.config.ts` -- Playwright configuration with webServer
- [ ] `e2e/fixtures/axe-test.ts` -- Shared AxeBuilder fixture
- [ ] `e2e/*.spec.ts` -- All E2E test files (homepage, navigation, blog, contact-form, quiz, cookie-banner, accessibility)
- [ ] `.gitleaks.toml` -- Gitleaks allowlist configuration
- [ ] `.github/workflows/test-e2e.yml` -- CI workflow for E2E tests (or extend existing deploy.yml)
- [ ] Playwright browser install: `npx playwright install chromium`
- [ ] npm install: `npm install -D @playwright/test @axe-core/playwright`

## Sources

### Primary (HIGH confidence)

- [Astro Experimental CSP Docs](https://docs.astro.build/en/reference/experimental-flags/csp/) -- Feature details, configuration options, limitations
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing) -- @axe-core/playwright setup, fixture pattern, assertion pattern
- [Playwright Configuration](https://playwright.dev/docs/test-configuration) -- webServer, baseURL, projects
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/) -- Playwright integration with Astro

### Secondary (MEDIUM confidence)

- [gitleaks GitHub](https://github.com/gitleaks/gitleaks) -- Installation methods, pre-commit hook, protect --staged command
- [CSP Hash Guide](https://content-security-policy.com/hash/) -- Hash generation rules, browser behavior
- [MDN CSP script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src) -- CSP Level 2 hash support, unsafe-inline interaction with hashes
- [d4b Gitleaks Pre-Commit](https://www.d4b.dev/blog/2026-02-01-gitleaks-pre-commit-hook/) -- Local gitleaks hook setup without frameworks

### Tertiary (LOW confidence)

- gitleaks npm package status -- WebSearch indicates unmaintained; needs verification of exact last publish date

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- Playwright and @axe-core/playwright are well-documented, official recommendations
- Architecture (CSP): MEDIUM -- Astro experimental CSP is the right approach but "experimental" flag means edge cases may exist; the font onload handler is a confirmed complication
- Architecture (innerHTML): HIGH -- DOM API replacement is straightforward with clear patterns
- Architecture (gitleaks): HIGH -- Well-documented tool with established Husky integration pattern
- Pitfalls: HIGH -- Identified from official docs and known CSP/Astro behavior

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (30 days -- Astro experimental features may change)
