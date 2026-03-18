# Phase 11: Navigation and Quality Completion - Research

**Researched:** 2026-03-18
**Domain:** Astro static site navigation, inline script extraction, Playwright E2E testing
**Confidence:** HIGH

## Summary

Phase 11 is the final v1.0 gap closure phase. It addresses five distinct areas: (1) creating a `/case-studies/` index page so breadcrumb links stop 404ing, (2) adding `/about/` links to both main nav and footer, (3) extracting the remaining `define:vars` inline script in ContactForm.astro, (4) filling E2E test coverage gaps for new navigation paths, and (5) removing the orphaned `loadJsPDF` export.

All five areas involve well-understood Astro patterns and Playwright test conventions already established in this project. The codebase scan confirmed only two non-module scripts remain: the justified `is:inline` theme init FOUC guard in BaseLayout.astro (exception, stays), and the `define:vars` script in ContactForm.astro (must be extracted). The audit's earlier claim of inline scripts in `index.astro` and `company-profile/index.astro` is stale -- those were already extracted in earlier phases.

The `define:vars` extraction is the only technically nuanced change in this phase. Astro's official documentation confirms that `define:vars` on a `<script>` tag implies `is:inline` (the script is not bundled, not processed by Vite, and rendered as raw inline HTML). Since the data being passed (`ANALYTICS.formspreeUrl`) is a static export from `src/data/site.ts`, it can be imported directly in a bundled module script -- the same pattern already used for cookie consent in Phase 1.

**Primary recommendation:** This is a single-plan phase with straightforward changes across 6-8 files. No new libraries needed. Follow existing project patterns (blog index for case studies listing, DOMContentLoaded for event binding, Playwright + axe-core fixtures for E2E tests). The `define:vars` extraction uses the direct `import { ANALYTICS }` approach, not `data-*` attributes, because the Formspree URL is static build-time data.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Create `/case-studies/index.astro` listing both existing case studies using `CASE_STUDIES` data module
- Match the blog index visual pattern -- card-based grid with summary, engagement type, and region
- Case study breadcrumbs stay as-is (Home / Case Studies / [title]) -- no changes needed once index page exists
- Add "Case Studies" link to footer only (not main nav) -- secondary discovery path
- Update footer "About" link from `#about` to `/about/`
- Add "About" link to main nav as well -- founder credibility is a key trust signal
- Keep the `is:inline` script in BaseLayout.astro `<head>` -- justified FOUC guard exception
- Add a code comment explaining why theme init must stay inline
- Document this as a justified exception to QUAL-08
- Delete `loadJsPDF()` from `src/scripts/quiz/pdf.ts` -- legacy stub, all callers use `new jsPDF()` directly
- `CASE_STUDIES` is no longer orphaned once the case studies index page imports it
- Verify existing contact form submission tests pass against updated site
- Verify existing Free Score CTA nav link test passes
- Add new E2E tests for: case studies index page loading, /about/ nav link resolving, breadcrumb links not 404ing

### Claude's Discretion

- "About" nav link position in main nav order
- Case studies index page exact layout/styling details
- E2E test file organization (new spec vs existing)
- Any additional inline script extraction found during codebase scan

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                            | Research Support                                                                                                                                                                                                                                                                                                                                   |
| ------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QUAL-08 | All inline scripts extracted to external files or Astro script modules | ContactForm.astro `define:vars` script must be extracted to module script with direct `ANALYTICS` import. Astro official docs confirm `define:vars` implies `is:inline`. BaseLayout.astro theme init stays as justified exception with explanatory comment. Exhaustive codebase grep confirms these are the only two remaining non-module scripts. |
| QUAL-07 | Playwright E2E tests cover critical user journeys (contact form, quiz) | Existing `e2e/contact-form.spec.ts` already has 8 comprehensive tests (submission success/error/loading states, validation, accessibility). Existing `e2e/navigation.spec.ts` already has Free Score CTA assertion. New tests needed for: case studies index loads, /about/ nav link resolves, breadcrumb link resolution.                         |

</phase_requirements>

## Standard Stack

### Core

| Library              | Version | Purpose               | Why Standard                                                   |
| -------------------- | ------- | --------------------- | -------------------------------------------------------------- |
| Astro                | ^6.0.5  | Static site generator | Already in use, all patterns established                       |
| Playwright           | ^1.58.2 | E2E testing           | Already configured with chromium, webServer, axe-core fixtures |
| @axe-core/playwright | ^4.11.1 | Accessibility in E2E  | Already integrated via `e2e/fixtures/axe-test.ts`              |

### Supporting

No new libraries needed. All work uses existing dependencies.

### Alternatives Considered

None -- all tools are already in the project.

## Architecture Patterns

### Recommended Project Structure

No new directories. Changes touch existing files and add 1 new page:

```
src/
  pages/
    case-studies/
      index.astro              # NEW: case studies listing page
      east-africa-bank-pentest.astro
      mobile-money-security-assessment.astro
  components/
    Nav.astro                  # MODIFY: add About link
    Footer.astro               # MODIFY: add About + Case Studies links
    ContactForm.astro          # MODIFY: extract define:vars script
  layouts/
    BaseLayout.astro           # MODIFY: add FOUC guard comment
  scripts/
    quiz/pdf.ts                # MODIFY: remove loadJsPDF export
  data/
    case-studies.ts            # UNCHANGED (already has CASE_STUDIES)
e2e/
  navigation.spec.ts           # MODIFY: add About, case studies, breadcrumb tests
```

### Pattern 1: Case Studies Index Page (Based on Blog Index)

**What:** Create `/case-studies/index.astro` importing `CASE_STUDIES` from `src/data/case-studies.ts` and rendering a card grid.
**When to use:** Follows the established blog index pattern at `src/pages/blog/index.astro`.
**Example:**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { CASE_STUDIES } from '../../data/case-studies';
import { SITE } from '../../data/site';

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Case Studies',
    description: 'Real-world cybersecurity engagement case studies from Imizi Cyber.',
    url: `${SITE.url}/case-studies/`,
  },
];
---

<BaseLayout
  title="Case Studies | imizicyber"
  description="Real-world cybersecurity engagement case studies..."
  canonicalUrl={`${SITE.url}/case-studies/`}
  schemas={schemas}
  navVariant="inner"
  footerVariant="inner"
>
  <section style="padding:100px 0 60px">
    <div class="w" style="max-width:920px">
      <h1>Case Studies</h1>
      <p class="sub">Real engagement results from East African organisations.</p>
      <div class="case-grid">
        {
          CASE_STUDIES.map((cs) => (
            <a href={`/case-studies/${cs.slug}/`} class="case-card">
              <span class="case-type">{cs.engagementType}</span>
              <h2>{cs.title}</h2>
              <p>{cs.summary}</p>
              <div class="case-meta">
                <span>{cs.region}</span>
                <span>{cs.duration}</span>
                <span>
                  {cs.findingsCount} findings ({cs.criticalCount} critical)
                </span>
              </div>
              <span class="case-link">Read case study &#8594;</span>
            </a>
          ))
        }
      </div>
    </div>
  </section>
</BaseLayout>
```

**Source:** Adapted from `src/pages/blog/index.astro` card grid pattern already in the project.

**Key data available from CASE_STUDIES typed interface:**

- `slug` -- for link construction
- `title` -- card heading
- `clientType` -- "Commercial Bank" or "Mobile Network Operator (Fintech Subsidiary)"
- `region` -- "East Africa"
- `engagementType` -- "Network & Web Application Penetration Test" or "Comprehensive Security Assessment"
- `duration` -- "3 weeks" or "4 weeks"
- `findingsCount` -- 5 or 6
- `criticalCount` -- 1 or 2
- `summary` -- paragraph-length description

### Pattern 2: Extracting define:vars Script to Module Script

**What:** Replace the `define:vars` script with a proper Astro module script that imports `ANALYTICS` directly.
**When to use:** Whenever server data needs to reach client scripts without `define:vars` (which creates implicit inline scripts).

**Source:** [Astro Directives Reference](https://docs.astro.build/en/reference/directives-reference/) confirms: "Using `define:vars` on a `<script>` tag implies the `is:inline` directive." [Astro Client-Side Scripts](https://docs.astro.build/en/guides/client-side-scripts/) documents the `data-*` attribute alternative.

**Key detail:** The `formspreeUrl` is a static string (`'https://formspree.io/f/mjgerrlv'`). Since `ANALYTICS` is already a static export from `src/data/site.ts`, it can be imported directly in the module script -- no `data-*` attribute needed. This is exactly how cookie consent was refactored in Phase 1 (see STATE.md: "Cookie consent uses ANALYTICS import from @/data/site instead of define:vars pattern").

**Approach:** Remove the `define:vars` attribute from the script tag, add `import { ANALYTICS } from '@/data/site';` at the top of the script, and replace `formspreeUrl` with `ANALYTICS.formspreeUrl`. Since the script becomes a bundled module, it also needs TypeScript type assertions on DOM queries.

### Pattern 3: Adding Nav Links

**What:** Insert "About" link in Nav.astro between content links and conversion CTAs.
**When to use:** Adding navigation items.

**Current Nav link order (from Nav.astro lines 31-42):**
Services | Blog | Resources | Contact | [Free Score CTA] | [Book CTA]

**Recommended link order:**
Services | Blog | Resources | About | Contact | [Free Score CTA] | [Book CTA]

The "About" link position between content links and CTAs maintains the logical flow: content discovery (Services, Blog, Resources) -> company info (About) -> conversion CTAs (Contact, Free Score, Book a Consultation). About is a trust/credibility page, making it a natural bridge.

**Implementation detail:** Nav.astro uses computed hrefs for some links (`servicesHref`, `blogHref`, `contactHref`) based on `isHome` variant. The About link always uses the absolute path `/about/` regardless of variant, so it can be a simple static `<a href="/about/">About</a>`.

### Pattern 4: Footer Link Updates

**What:** Update Footer.astro to (a) change About href from `#about` to `/about/` and (b) add Case Studies link.
**When to use:** Footer navigation modifications.

**Current footer state (from Footer.astro lines 17-33):**

- Home variant: has `{ label: 'About', href: '#about' }` -- anchor link, needs to become `/about/`
- Inner variant: No About link at all -- needs to be added as `/about/`
- Neither variant has Case Studies link

**After changes:**

- Home variant: About href changed to `/about/`, Case Studies link added
- Inner variant: About and Case Studies links added

### Anti-Patterns to Avoid

- **Using `define:vars` for static data:** When the server variable is a static string (like a URL), import the data module directly in the client script instead. `define:vars` creates implicit inline scripts that break CSP and cannot be bundled.
- **Using `astro:page-load` without ViewTransitions:** This event only fires in SPAs with ViewTransitions enabled. This project is a static MPA -- always use `DOMContentLoaded` or default Astro bundled script behavior (Phase 10 decision).
- **Hardcoding breadcrumb HTML instead of using the Breadcrumb component:** The existing case study pages hardcode breadcrumbs inline. For the new index page, use the `Breadcrumb.astro` component as it is the intended reusable component.

## Don't Hand-Roll

| Problem               | Don't Build               | Use Instead                                           | Why                                                               |
| --------------------- | ------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| Accessibility testing | Custom a11y checks        | `@axe-core/playwright` via `e2e/fixtures/axe-test.ts` | Already configured, comprehensive WCAG 2.1 rule set               |
| Breadcrumb markup     | Raw HTML divs on new page | `Breadcrumb.astro` component                          | Already built with proper semantics and props interface           |
| Case study data       | Hardcoded arrays in page  | `CASE_STUDIES` from `src/data/case-studies.ts`        | Typed interface with all metadata fields                          |
| Server-to-client data | `define:vars` pattern     | Direct `import { ANALYTICS }` in module script        | Static data can be imported directly; no runtime injection needed |

## Common Pitfalls

### Pitfall 1: define:vars Creates Implicit Inline Scripts

**What goes wrong:** Using `define:vars` on a script tag makes the entire script inline (equivalent to `is:inline`). The script is not processed by Vite, not bundled, not deduped across pages, and shows up as an inline script in CSP audits.
**Why it happens:** Astro needs to inject server-side variables into the script at build time, which requires the script to be inline. Official docs: "Using `define:vars` on a `<script>` tag implies the `is:inline` directive."
**How to avoid:** Import static data modules directly in module scripts. For dynamic data, use `data-*` attributes on DOM elements.
**Warning signs:** `define:vars` in grep results, CSP hash mismatches, scripts not being bundled.

### Pitfall 2: Footer Has Two Variants With Different Link Sets

**What goes wrong:** Updating only one variant (home or inner) and forgetting the other.
**Why it happens:** Footer.astro has a conditional `isHome` that produces completely different `navLinks` arrays (lines 17-33). The home variant uses anchor links (`#about`, `#services`), the inner variant uses absolute paths.
**How to avoid:** Update BOTH the home and inner variant link arrays when adding About and Case Studies links. The About link uses `/about/` in both variants (no longer an anchor).
**Warning signs:** About link works on homepage but not on inner pages (or vice versa).

### Pitfall 3: Playwright webServer Builds Before Testing

**What goes wrong:** Tests run against a stale build that doesn't include the new case studies index page.
**Why it happens:** If `reuseExistingServer` is true and a previous dev server is running, Playwright may reuse it.
**How to avoid:** The `playwright.config.ts` already has `reuseExistingServer: !process.env.CI` which handles this correctly for CI. For local testing, stop any running dev server or use `npm run test:e2e` which triggers a fresh build.
**Warning signs:** New page tests 404 locally but pass in CI.

### Pitfall 4: Removing loadJsPDF Breaks Callers

**What goes wrong:** Removing the export breaks something that still imports it.
**Why it happens:** Not verifying all import sites before deletion.
**How to avoid:** Grep confirmed `loadJsPDF` appears only in its own definition (line 20 of `src/scripts/quiz/pdf.ts`). No callers exist anywhere in the codebase. Safe to remove.
**Warning signs:** TypeScript compilation errors after removal (which would be caught by pre-commit hook).

### Pitfall 5: CSP Hash Changes After Script Extraction

**What goes wrong:** Extracting the `define:vars` inline script from ContactForm.astro changes the inline script hashes in the built HTML, which may cause CSP violations.
**Why it happens:** The `inject-csp.mjs` post-build script generates SHA-256 hashes for all inline scripts. Removing one changes the hash set.
**How to avoid:** The `inject-csp.mjs` script is run as part of `npm run build` and automatically recalculates hashes. No manual action needed -- the hash simply disappears from the CSP meta tag since the script is no longer inline.
**Warning signs:** CSP E2E tests failing (check `e2e/csp.spec.ts`).

### Pitfall 6: ContactForm Has Two Script Blocks

**What goes wrong:** Extracting the wrong script block or accidentally merging them.
**Why it happens:** ContactForm.astro has TWO `<script>` tags: (1) `define:vars` at line 100 (form submission logic, ~48 lines) and (2) a regular bundled script at line 150 (analytics tracking via CustomEvent, 6 lines). Only the first needs extraction.
**How to avoid:** The `define:vars` script (lines 100-148) becomes a bundled module script. The second script (lines 150-156) is already a properly bundled module script and must not be touched. They can potentially be merged into a single script block since both will be module scripts after the change, but keeping them separate is safer to avoid breaking the CustomEvent bridge pattern.
**Warning signs:** Breaking the analytics tracking CustomEvent bridge (the `contact-form-success` event).

### Pitfall 7: Schema.org BreadcrumbList Already Points to /case-studies/

**What goes wrong:** Assuming breadcrumb schema in case study pages needs updating. It does not.
**Why it happens:** Both case study pages already have correct BreadcrumbList schema pointing to `${SITE.url}/case-studies/` (verified in frontmatter). The visible HTML breadcrumbs also link to `/case-studies/`. The only problem was that the target page did not exist.
**How to avoid:** Create `/case-studies/index.astro` and the breadcrumbs (both visual and schema) work without any changes to existing case study pages.
**Warning signs:** Touching breadcrumb code in existing case study pages when none needs to change.

## Code Examples

Verified patterns from codebase inspection:

### Contact Form Script Extraction (from define:vars to module)

The current ContactForm.astro uses `define:vars` which creates an implicit inline script. Replace it with a module script that imports `ANALYTICS` directly (same pattern as cookie consent in Phase 1).

Current script tag (line 100 of ContactForm.astro):

```astro
<script define:vars={{ formspreeUrl: ANALYTICS.formspreeUrl }}></script>
```

Replace with a module script. The full replacement:

```typescript
// ContactForm.astro - replace the define:vars script (lines 100-148) with this module script
<script>
import { ANALYTICS } from '@/data/site';

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const btn = f.querySelector('.submit-btn') as HTMLButtonElement;
    const btnText = btn.querySelector('.btn-text') as HTMLElement;
    const spinner = btn.querySelector('.spinner') as HTMLElement;
    const ok = document.getElementById('contact-success') as HTMLElement;
    const err = document.getElementById('contact-error') as HTMLElement;

    ok.hidden = true;
    err.hidden = true;
    f.setAttribute('aria-busy', 'true');
    btn.disabled = true;
    btnText.textContent = 'Sending...';
    spinner.classList.add('visible');

    fetch(ANALYTICS.formspreeUrl, {
      method: 'POST',
      body: new FormData(f),
      headers: { Accept: 'application/json' },
    })
      .then(function (r) {
        f.setAttribute('aria-busy', 'false');
        spinner.classList.remove('visible');
        if (r.ok) {
          ok.hidden = false;
          f.reset();
          document.dispatchEvent(new CustomEvent('contact-form-success'));
          btnText.textContent = 'Sent!';
          setTimeout(function () {
            btn.disabled = false;
            btnText.textContent = 'Send enquiry';
          }, 3000);
        } else {
          err.hidden = false;
          btnText.textContent = 'Send enquiry';
          btn.disabled = false;
        }
      })
      .catch(function () {
        f.setAttribute('aria-busy', 'false');
        spinner.classList.remove('visible');
        err.hidden = false;
        btnText.textContent = 'Send enquiry';
        btn.disabled = false;
      });
  });
}
</script>
```

**Key changes from original:**

1. Removed `define:vars={{ formspreeUrl: ANALYTICS.formspreeUrl }}`
2. Added `import { ANALYTICS } from '@/data/site';`
3. Replaced `formspreeUrl` with `ANALYTICS.formspreeUrl`
4. Added TypeScript type assertions (required in module scripts with strict mode)
5. Added null check on form element (`if (form)`)

### Footer.astro navLinks Update

```typescript
const navLinks: Link[] = isHome
  ? [
      { label: 'Services', href: '#services' },
      { label: 'Process', href: '#process' },
      { label: 'About', href: '/about/' }, // Changed from '#about'
      { label: 'Blog', href: '#blog' },
      { label: 'Case Studies', href: '/case-studies/' }, // NEW
      { label: 'Resources', href: '/resources/' },
      { label: 'Security Score', href: '/tools/security-score/' },
      { label: 'Contact', href: '#contact' },
    ]
  : [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/#services' },
      { label: 'About', href: '/about/' }, // NEW
      { label: 'Case Studies', href: '/case-studies/' }, // NEW
      { label: 'Resources', href: '/resources/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Contact', href: '/#contact' },
    ];
```

### Nav.astro About Link Addition

Insert between Resources and Contact in the `.nav-links` div (line 33 area):

```astro
<a href={servicesHref}>Services</a>
<a href={blogHref}>Blog</a>
<a href="/resources/">Resources</a>
<a href="/about/">About</a>
<!-- NEW -->
<a href={contactHref}>Contact</a>
```

### E2E Tests for New Navigation Paths

```typescript
// In e2e/navigation.spec.ts (extend existing describe block)

test('case studies index page loads', async ({ page }) => {
  const response = await page.goto('/case-studies/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toContainText(/case studies/i);
});

test('case study breadcrumb links resolve (not 404)', async ({ page }) => {
  await page.goto('/case-studies/east-africa-bank-pentest/');
  const breadcrumbLink = page.locator('.breadcrumb a[href="/case-studies/"]');
  await expect(breadcrumbLink).toBeVisible();
  await breadcrumbLink.click();
  await expect(page).toHaveURL(/\/case-studies\/$/);
});

test('About link is present in main navigation', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav');
  const aboutLink = nav.getByRole('link', { name: /about/i });
  await expect(aboutLink).toBeVisible();
  await expect(aboutLink).toHaveAttribute('href', '/about/');
});

test('About link resolves to /about/ page', async ({ page }) => {
  const response = await page.goto('/about/');
  expect(response?.status()).toBe(200);
});
```

### Removing Orphaned loadJsPDF Export

Before (lines 19-22 of `src/scripts/quiz/pdf.ts`):

```typescript
/** Legacy async loader -- now a no-op since jsPDF is bundled. Kept for backward compatibility. */
export function loadJsPDF(): Promise<void> {
  return Promise.resolve();
}
```

After: Delete these 4 lines entirely. The `createJsPDF()` function on line 15 remains as the active API. No callers of `loadJsPDF` exist in the codebase (verified by grep).

### BaseLayout FOUC Guard Comment

Add an explanatory comment before the `is:inline` script (line 101 area):

```astro
<!--
  QUAL-08 justified exception: This script MUST remain is:inline to prevent
  FOUC (Flash of Unstyled Content). It reads the user's theme preference from
  localStorage and applies it before the browser's first paint. Moving this
  to a module script would cause a visible flash as the default theme renders
  before the script executes.
-->
<script is:inline>
  (function () {
    try {
      const s = localStorage.getItem('imizi-theme');
      if (s) document.documentElement.dataset.theme = s;
    } catch {
      /* localStorage unavailable */
    }
  })();
</script>
```

## State of the Art

| Old Approach                       | Current Approach                          | When Changed        | Impact                                                       |
| ---------------------------------- | ----------------------------------------- | ------------------- | ------------------------------------------------------------ |
| `define:vars` for server-to-client | Import static data modules in script tags | Astro 2.0+ (stable) | Module scripts are bundled, tree-shaken, CSP-safe            |
| `astro:page-load` in static MPA    | `DOMContentLoaded`                        | Phase 10 decision   | Events actually fire in static sites without ViewTransitions |
| Orphaned backward-compat stubs     | Remove dead code                          | This phase          | Cleaner codebase, no false dependency signals                |

**Deprecated/outdated:**

- `loadJsPDF()`: Legacy stub from when jsPDF was CDN-loaded. All callers now use `new jsPDF()` directly or `createJsPDF()`. Safe to remove.
- `define:vars` pattern in ContactForm.astro: Project already moved away from this in Phase 1 for cookie consent. ContactForm is the last remaining instance.

## Open Questions

1. **Should the case studies index page use the Breadcrumb.astro component?**
   - What we know: The individual case study pages hardcode breadcrumbs inline (not using the component). The index page is new.
   - What's unclear: Whether to use the component or match the existing inline pattern for consistency.
   - Recommendation: Use the `Breadcrumb.astro` component for the new index page. It is the right pattern going forward even though existing case study pages don't use it. The case studies index would have a simple 2-item breadcrumb: Home / Case Studies.

2. **Does the ContactForm script extraction affect existing E2E tests?**
   - What we know: `e2e/contact-form.spec.ts` has 8 comprehensive tests including mocked submission flow. The script extraction changes the build artifact but not the runtime behavior.
   - What's unclear: Whether the module script loading timing differs from the inline `define:vars` script.
   - Recommendation: Module scripts are deferred by default in Astro, which means they load after DOM parsing -- the form element will be available. The existing tests should pass without modification. Run the contact form E2E tests as verification after the change.

3. **Can the two ContactForm script blocks be merged?**
   - What we know: After extraction, both scripts will be bundled module scripts. They could theoretically be merged into one `<script>` block.
   - Recommendation: Keep them separate. The first handles form submission logic, the second handles analytics tracking via the CustomEvent bridge. Separation is clearer and matches the existing pattern. Merging adds risk for no meaningful benefit.

## Validation Architecture

### Test Framework

| Property           | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Framework          | Playwright ^1.58.2 with @axe-core/playwright ^4.11.1         |
| Config file        | `playwright.config.ts`                                       |
| Quick run command  | `npx playwright test e2e/navigation.spec.ts --reporter=line` |
| Full suite command | `npm run test:e2e`                                           |

### Phase Requirements to Test Map

| Req ID  | Behavior                                      | Test Type | Automated Command                                              | File Exists?                    |
| ------- | --------------------------------------------- | --------- | -------------------------------------------------------------- | ------------------------------- |
| QUAL-08 | No inline scripts except justified FOUC guard | E2E (CSP) | `npx playwright test e2e/csp.spec.ts --reporter=line`          | Yes                             |
| QUAL-08 | ContactForm works after script extraction     | E2E       | `npx playwright test e2e/contact-form.spec.ts --reporter=line` | Yes (8 existing tests)          |
| QUAL-07 | Contact form submission flow tested           | E2E       | `npx playwright test e2e/contact-form.spec.ts --reporter=line` | Yes (already comprehensive)     |
| QUAL-07 | Free Score CTA nav link asserted              | E2E       | `npx playwright test e2e/navigation.spec.ts --reporter=line`   | Yes (already has CTA assertion) |
| QUAL-07 | Case studies index page loads                 | E2E       | `npx playwright test e2e/navigation.spec.ts --reporter=line`   | No -- Wave 0                    |
| QUAL-07 | About link in main nav resolves               | E2E       | `npx playwright test e2e/navigation.spec.ts --reporter=line`   | No -- Wave 0                    |
| QUAL-07 | Breadcrumb links not 404ing                   | E2E       | `npx playwright test e2e/navigation.spec.ts --reporter=line`   | No -- Wave 0                    |

### Sampling Rate

- **Per task commit:** `npx playwright test e2e/navigation.spec.ts e2e/contact-form.spec.ts --reporter=line`
- **Per wave merge:** `npm run test:e2e`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] New tests in `e2e/navigation.spec.ts` -- case studies index, About nav link, breadcrumb resolution (3-4 new tests)
- [ ] Verify existing contact form and Free Score CTA tests pass after changes (no new test files needed)

_(Test infrastructure is complete -- Playwright, axe-core fixtures, webServer config all exist and work)_

## Sources

### Primary (HIGH confidence)

- **[Astro Directives Reference](https://docs.astro.build/en/reference/directives-reference/)** -- confirmed `define:vars` on `<script>` implies `is:inline`
- **[Astro Client-Side Scripts](https://docs.astro.build/en/guides/client-side-scripts/)** -- documents `data-*` attribute alternative and module script behavior
- **Codebase `is:inline` audit** -- grep found exactly 1 instance: `src/layouts/BaseLayout.astro:102` (theme init FOUC guard)
- **Codebase `define:vars` audit** -- grep found exactly 1 instance: `src/components/ContactForm.astro:100` (form submission)
- **Codebase `loadJsPDF` audit** -- grep found only the definition at `src/scripts/quiz/pdf.ts:20`, zero callers
- **Codebase `CASE_STUDIES` audit** -- grep found only the definition at `src/data/case-studies.ts:13`, zero importers (orphaned until index page created)
- **`src/components/Footer.astro`** -- confirmed home variant has `#about` anchor, inner variant lacks About entirely
- **`src/components/Nav.astro`** -- confirmed link order and absence of About link
- **`e2e/contact-form.spec.ts`** -- 8 tests covering visibility, validation, submission (success/error/loading), accessibility
- **`e2e/navigation.spec.ts`** -- 4 tests covering nav links, Free Score CTA, service pages, 404 page
- **`playwright.config.ts`** -- chromium only, baseURL `localhost:4321`, webServer builds before tests

### Secondary (MEDIUM confidence)

- **[Astro GitHub Issue #6642](https://github.com/withastro/astro/issues/6642)** -- confirmed `define:vars` disables bundling (known behavior since 2023, unchanged through Astro 6)
- **v1.0-MILESTONE-AUDIT.md** -- audit findings used to identify all gaps; some items (index.astro, company-profile inline scripts) were stale as they were already fixed in earlier phases

### Tertiary (LOW confidence)

None -- all findings verified against codebase and official documentation.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- no new dependencies, all versions confirmed from `package.json`
- Architecture: HIGH -- follows existing blog index, nav, and footer patterns exactly
- Pitfalls: HIGH -- all verified by direct codebase inspection and Astro official documentation
- Inline script status: HIGH -- exhaustive grep confirms only 2 non-module scripts remain (1 justified `is:inline`, 1 `define:vars` to extract)
- E2E test coverage: HIGH -- existing tests inspected line by line, gaps precisely identified

**Inline Script Audit Summary:**

| File                                   | Script Type                         | Status                           | Action                                               |
| -------------------------------------- | ----------------------------------- | -------------------------------- | ---------------------------------------------------- |
| `src/layouts/BaseLayout.astro:102`     | `is:inline`                         | Justified exception (FOUC guard) | Add explanatory comment                              |
| `src/components/ContactForm.astro:100` | `define:vars` (implies `is:inline`) | Must extract                     | Convert to module script with `import { ANALYTICS }` |
| All other `<script>` tags in `src/`    | Bundled module scripts              | Compliant                        | No action needed                                     |

**Research date:** 2026-03-18
**Valid until:** Indefinite (project-specific findings, no external dependency changes expected)
