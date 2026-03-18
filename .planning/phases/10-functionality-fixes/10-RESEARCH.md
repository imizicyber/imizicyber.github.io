# Phase 10: Functionality Fixes - Research

**Researched:** 2026-03-18
**Domain:** Astro static site bug fixes (event binding, image optimization, structured data)
**Confidence:** HIGH

## Summary

Phase 10 is a focused bug-fix phase addressing 4 broken functionalities identified in the v1.0 milestone audit. All issues have exact root causes, precise file locations, and straightforward fixes. No new capabilities are being added.

The most technically interesting fix is the TagFilter event binding: Astro's `astro:page-load` lifecycle event requires the `<ClientRouter />` component to be present in the layout. Without it (as in this project's static MPA configuration), the event never fires and click handlers are never attached. The fix is to remove the event wrapper entirely since Astro module scripts are deferred by default and execute after DOM parsing.

The OG image fix in BlogPostLayout.astro requires using `getImage()` from `astro:assets` -- the same pattern already proven in SEOHead.astro and index.astro. The remaining two items (LEAD-08 quiz nav, SRVC-09 blog tags) are already fixed per the CONTEXT.md findings.

**Primary recommendation:** Three code changes across two files (TagFilter.astro event binding, BlogPostLayout.astro schema.org image), plus verification of two already-fixed items (BaseLayout showFreeTool default, blog article tags).

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Tag Filter Fix (SRVC-07):** Replace `document.addEventListener('astro:page-load', ...)` with `document.addEventListener('DOMContentLoaded', ...)` in TagFilter.astro line 26. `astro:page-load` never fires in static MPA without ViewTransitions.
- **Quiz Nav Default (LEAD-08):** ALREADY FIXED. BaseLayout.astro line 54 already defaults `showFreeTool = true`. Verify during execution, no code change needed.
- **OG Image WebP (UIUX-05):** BlogPostLayout.astro line 77 still uses `ogImageAsset.src` (raw PNG import) in schema.org structured data -- must use getImage() WebP URL instead. Also verify index.astro schema.org uses `optimisedOg.src`.
- **Blog Article Tags (SRVC-09):** ALREADY FIXED. All 3 new articles already have `tags:` field in frontmatter. Verify they appear in tag filter results once TagFilter is fixed.
- **Schema.org Image Path:** Fix any hardcoded `/og.png` references in structured data to use the optimised WebP path from `getImage()`.

### Claude's Discretion

- Whether to add a fallback for `astro:page-load` alongside `DOMContentLoaded` (for future ViewTransitions compatibility)
- Exact approach for passing getImage() result into BlogPostLayout schema.org

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                  | Research Support                                                                                                                                                                           |
| ------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SRVC-07 | Blog tag/category system with tag-based filtering on blog index              | TagFilter.astro event binding fix -- `astro:page-load` does not fire without `<ClientRouter />`. Replace with `DOMContentLoaded` or remove wrapper entirely (module scripts are deferred). |
| LEAD-08 | Quiz prominently linked from homepage and navigation                         | Already fixed in Phase 9 P02 -- BaseLayout.astro line 54 defaults `showFreeTool = true`. Verification only.                                                                                |
| UIUX-05 | All images use Astro Image component with WebP format                        | BlogPostLayout.astro schema.org uses raw `ogImageAsset.src` (PNG). Must use `getImage({ src: ogImageAsset, format: 'webp' })` pattern from SEOHead.astro.                                  |
| SRVC-09 | At least 3 new SEO-optimized blog articles targeting Rwanda/East Africa keys | All 3 articles have `tags:` field in frontmatter. Verification needed once tag filter works.                                                                                               |

</phase_requirements>

## Standard Stack

### Core

| Library      | Version    | Purpose                             | Why Standard                                                                 |
| ------------ | ---------- | ----------------------------------- | ---------------------------------------------------------------------------- |
| Astro        | ^6.0.5     | Static site framework               | Project framework -- all fixes are within Astro components                   |
| astro:assets | (built-in) | Image optimization via `getImage()` | Built-in Astro image pipeline, already used in SEOHead.astro and index.astro |

### Supporting

| Library    | Version | Purpose      | When to Use                                                        |
| ---------- | ------- | ------------ | ------------------------------------------------------------------ |
| Playwright | ^1.58.2 | E2E testing  | Verify tag filter works, quiz nav visible, OG image correct        |
| Vitest     | ^4.1.0  | Unit testing | Not directly needed for this phase (fixes are in .astro templates) |

No new dependencies needed. All fixes use existing Astro built-in APIs.

## Architecture Patterns

### Relevant Project Structure

```text
src/
  components/
    TagFilter.astro       # FIX: event binding (SRVC-07)
    SEOHead.astro         # REFERENCE: getImage() pattern
  layouts/
    BaseLayout.astro      # VERIFY: showFreeTool default (LEAD-08)
    BlogPostLayout.astro  # FIX: schema.org image path (UIUX-05)
  pages/
    index.astro           # VERIFY: schema.org uses optimisedOg.src
    blog/
      index.astro         # VERIFY: tag filter renders correctly
  content/
    blog/
      penetration-testing-kigali-enterprise-guide.mdx  # VERIFY: tags present
      bnr-cybersecurity-compliance-2026.mdx             # VERIFY: tags present
      cloud-security-east-africa-aws-azure.mdx          # VERIFY: tags present
```

### Pattern 1: Astro Module Script Event Binding (TagFilter Fix)

**What:** Astro `<script>` tags (without `is:inline`) are processed into `type="module"` scripts that are deferred by default. They execute after DOM parsing completes, meaning DOM elements are available without any event wrapper.

**Current broken code:**

```html
<script>
  document.addEventListener('astro:page-load', () => {
    const buttons = document.querySelectorAll('.tag-btn');
    // ... handlers never attached because astro:page-load never fires
  });
</script>
```

**Why it breaks:** The `astro:page-load` event is part of Astro's View Transitions lifecycle. It is dispatched by the `<ClientRouter />` component. Without `<ClientRouter />` in the layout (this project has none -- it's a pure static MPA), the event never fires and the callback never executes.

**Fix option A -- DOMContentLoaded (CONTEXT.md locked decision):**

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tag-btn');
    // ... rest of filter logic unchanged
  });
</script>
```

**Fix option B -- Remove wrapper entirely (Claude's discretion recommendation):**

```html
<script>
  const buttons = document.querySelectorAll('.tag-btn');
  const cards = document.querySelectorAll('.blog-card-wrapper');
  // ... rest of filter logic at top level
</script>
```

**Recommendation (Claude's discretion):** Use `DOMContentLoaded` as specified in the locked decision. This is explicit, defensive, and well-understood. Adding an `astro:page-load` fallback is unnecessary -- if ViewTransitions are added in the future, the developer would intentionally migrate scripts at that time. Adding both listeners now would cause double-initialization if `<ClientRouter />` is ever added (since `astro:page-load` fires on initial load too when ClientRouter is present).

### Pattern 2: getImage() for Schema.org Structured Data

**What:** Use Astro's `getImage()` API to generate an optimised WebP URL for use in JSON-LD structured data.

**Reference implementation (already working in SEOHead.astro):**

```typescript
// Source: src/components/SEOHead.astro (frontmatter section)
import { getImage } from 'astro:assets';
import ogImageAsset from '../assets/og.png';

const optimisedOg = await getImage({ src: ogImageAsset, format: 'webp' });
// optimisedOg.src === '/_astro/og.HASH.webp'
```

**Current broken code (BlogPostLayout.astro line 75-80):**

```javascript
image: {
  '@type': 'ImageObject',
  url: `${SITE.url}${fm.ogImage || ogImageAsset.src}`,  // ogImageAsset.src is raw PNG path
  width: 1200,
  height: 630,
},
```

**Fix pattern:**

```typescript
// In BlogPostLayout.astro frontmatter, add:
import { getImage } from 'astro:assets';
import ogImageAsset from '../assets/og.png';

const optimisedOg = await getImage({ src: ogImageAsset, format: 'webp' });

// Then in schema.org image object:
// url: `${SITE.url}${fm.ogImage || optimisedOg.src}`
```

### Anti-Patterns to Avoid

- **Do NOT add `<ClientRouter />` just to make `astro:page-load` work.** ViewTransitions changes the entire navigation model from MPA to SPA-like. It is not a proportionate fix for one event binding.
- **Do NOT use `ogImageAsset.src` for structured data.** This returns the raw imported asset path (PNG), not the optimised WebP. Always use `getImage()` for optimised paths.
- **Do NOT add both `DOMContentLoaded` and `astro:page-load` listeners.** If ClientRouter is ever added, `astro:page-load` fires on initial load AND soft navigations, causing double-initialization with DOMContentLoaded.

## Don't Hand-Roll

| Problem                 | Don't Build                    | Use Instead                                        | Why                                                                   |
| ----------------------- | ------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------- |
| Image format conversion | Manual WebP conversion scripts | `getImage({ format: 'webp' })` from `astro:assets` | Handles hashing, caching, format conversion, and path generation      |
| OG image optimization   | Custom sharp/imagemin pipeline | Astro's built-in image service                     | Already configured, works at build time, consistent with rest of site |

**Key insight:** All fixes use existing patterns already proven in the codebase. No new libraries or approaches needed.

## Common Pitfalls

### Pitfall 1: astro:page-load Without ClientRouter

**What goes wrong:** Event handlers wrapped in `astro:page-load` listener never execute on static MPA sites.
**Why it happens:** `astro:page-load` is part of Astro's View Transitions Router lifecycle. The event is dispatched by `<ClientRouter />`. Without it, no dispatcher exists.
**How to avoid:** Use `DOMContentLoaded` for static sites, or omit the wrapper entirely for module scripts (which are deferred).
**Warning signs:** Interactive elements render visually but don't respond to clicks.

### Pitfall 2: Raw Asset Import vs getImage()

**What goes wrong:** `import ogImage from '../assets/og.png'` returns the raw asset path (PNG). Using `ogImage.src` in meta tags serves the unoptimised PNG.
**Why it happens:** Astro's image import gives you a reference to the source asset. Only `<Image>` component or `getImage()` trigger the optimization pipeline.
**How to avoid:** Always use `getImage({ src: asset, format: 'webp' })` when you need an optimised URL outside of the `<Image>` component.
**Warning signs:** Built output contains `.png` files in `_astro/` when you expected `.webp`.

### Pitfall 3: Schema.org Image 404s in Production

**What goes wrong:** Hardcoded `/og.png` in structured data returns 404 because Astro builds assets to `/_astro/og.HASH.ext`.
**Why it happens:** Astro's asset pipeline renames and hashes files at build time. Static paths like `/og.png` don't exist in the built output.
**How to avoid:** Always derive image URLs from `getImage()` results, never hardcode paths to source assets.
**Warning signs:** Google Search Console reports structured data errors for invalid image URLs.

### Pitfall 4: Double Event Initialization

**What goes wrong:** Adding both `DOMContentLoaded` and `astro:page-load` causes handlers to fire twice if `<ClientRouter />` is later added.
**Why it happens:** When `<ClientRouter />` is present, `astro:page-load` fires on initial page load AND on soft navigations. `DOMContentLoaded` also fires on initial load.
**How to avoid:** Choose one pattern. For static MPA: `DOMContentLoaded`. For ViewTransitions: `astro:page-load`.
**Warning signs:** Filter resets, duplicate event handlers, flickering UI on page load.

## Code Examples

Verified patterns from existing codebase:

### getImage() for WebP OG Image (SEOHead.astro -- working reference)

```typescript
// Source: src/components/SEOHead.astro lines 6-9
import { getImage } from 'astro:assets';
import ogImageAsset from '../assets/og.png';

const optimisedOg = await getImage({ src: ogImageAsset, format: 'webp' });
// optimisedOg.src === '/_astro/og.HASH.webp'
```

### getImage() for Schema.org (index.astro -- working reference)

```typescript
// Source: src/pages/index.astro lines 14-17, 30
import { getImage } from 'astro:assets';
import ogImageAsset from '../assets/og.png';

const optimisedOg = await getImage({ src: ogImageAsset, format: 'webp' });

// In schema.org object:
// image: `${SITE.url}${optimisedOg.src}`,
```

### Tag Filter Client-Side Logic (existing -- logic is correct, only event binding is broken)

```javascript
// Source: src/components/TagFilter.astro lines 27-48
const buttons = document.querySelectorAll('.tag-btn');
const cards = document.querySelectorAll('.blog-card-wrapper');

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tag = btn.dataset.tag;
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    cards.forEach((card) => {
      if (tag === 'all') {
        card.style.display = '';
      } else {
        const cardTags = (card.dataset.tags || '').split(',');
        card.style.display = cardTags.includes(tag) ? '' : 'none';
      }
    });
  });
});
```

### Blog Article Tags (already in frontmatter)

```yaml
# Source: src/content/blog/penetration-testing-kigali-enterprise-guide.mdx
tags: ['penetration-testing', 'east-africa']

# Source: src/content/blog/bnr-cybersecurity-compliance-2026.mdx
tags: ['compliance', 'banking-security', 'east-africa']

# Source: src/content/blog/cloud-security-east-africa-aws-azure.mdx
tags: ['security-strategy', 'east-africa']
```

## State of the Art

| Old Approach                      | Current Approach                                | When Changed                      | Impact                             |
| --------------------------------- | ----------------------------------------------- | --------------------------------- | ---------------------------------- |
| `astro:page-load` for all scripts | `DOMContentLoaded` or no wrapper for static MPA | Astro 3+ (ViewTransitions opt-in) | Must match event to routing model  |
| Raw asset imports for OG images   | `getImage()` from `astro:assets`                | Astro 3.0                         | Enables format conversion, hashing |
| `<ViewTransitions />` component   | `<ClientRouter />` component                    | Astro 5.0                         | Renamed; same functionality        |

## Open Questions

None. All fixes are well-understood with exact root causes and proven fix patterns already in the codebase.

## Validation Architecture

### Test Framework

| Property           | Value                                                     |
| ------------------ | --------------------------------------------------------- |
| Framework          | Playwright ^1.58.2 + Vitest ^4.1.0                        |
| Config file        | `playwright.config.ts`, `vitest.config.ts`                |
| Quick run command  | `npx playwright test e2e/blog.spec.ts --project=chromium` |
| Full suite command | `npm run test:e2e`                                        |

### Phase Requirements to Test Map

| Req ID  | Behavior                                                  | Test Type   | Automated Command                                                               | File Exists?                                         |
| ------- | --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| SRVC-07 | Tag filter buttons filter visible posts when clicked      | e2e         | `npx playwright test e2e/blog.spec.ts --project=chromium -g "tag filter"`       | Partial (blog.spec.ts exists but no tag filter test) |
| LEAD-08 | "Free Score" quiz link visible in nav on all pages        | e2e         | `npx playwright test e2e/navigation.spec.ts --project=chromium -g "Free Score"` | Partial (test exists for homepage only)              |
| UIUX-05 | OG image served as WebP, schema.org references valid path | build-check | `npm run build && grep -r 'webp' dist/blog/*/index.html`                        | No dedicated test                                    |
| SRVC-09 | 3 new articles have tags and appear in filter results     | e2e         | `npx playwright test e2e/blog.spec.ts --project=chromium -g "tag filter"`       | No (same as SRVC-07)                                 |

### Sampling Rate

- **Per task commit:** `npm run build` (verifies Astro compilation succeeds)
- **Per wave merge:** `npm run test:e2e` (full Playwright suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `e2e/blog.spec.ts` -- add tag filter click test (covers SRVC-07 + SRVC-09)
- [ ] `e2e/navigation.spec.ts` -- add "Free Score" visibility on non-homepage page (covers LEAD-08)
- [ ] Build output verification for WebP OG image in schema.org (covers UIUX-05) -- can be a build-time grep or an E2E test checking meta tag content

## Sources

### Primary (HIGH confidence)

- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/) -- astro:page-load lifecycle, ClientRouter requirement
- [Astro View Transitions API Reference](https://docs.astro.build/en/reference/modules/astro-transitions/) -- event firing conditions
- [Astro Image/Assets API Reference](https://docs.astro.build/en/reference/modules/astro-assets/) -- getImage() return type, format option
- [Bag of Tricks - Scripts](https://events-3bg.pages.dev/jotter/astro/scripts/) -- Module script execution timing, DOMContentLoaded relationship
- Project codebase: SEOHead.astro, index.astro (working getImage patterns), TagFilter.astro, BlogPostLayout.astro (broken code)

### Secondary (MEDIUM confidence)

- [Astro Scripts docs](https://docs.astro.build/en/guides/client-side-scripts/) -- Script processing, type="module" behavior

### Tertiary (LOW confidence)

- None -- all findings verified against official docs and existing codebase

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- no new libraries, all fixes use existing Astro APIs
- Architecture: HIGH -- exact fix patterns already proven in adjacent files (SEOHead.astro, index.astro)
- Pitfalls: HIGH -- root causes confirmed by official Astro docs and verified against codebase

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable -- Astro 6 APIs are settled)
