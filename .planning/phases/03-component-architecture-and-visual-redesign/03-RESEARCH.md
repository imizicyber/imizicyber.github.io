# Phase 3: Component Architecture and Visual Redesign - Research

**Researched:** 2026-03-17
**Domain:** Astro component architecture, CSS design systems, premium cybersecurity website aesthetics
**Confidence:** HIGH

## Summary

Phase 3 transforms a monolithic 756-line `index.astro` (plus ~350 lines of inline `<style>`) into composable section components, and applies a premium visual redesign targeting enterprise cybersecurity buyers in Rwanda and East Africa. The existing Astro 6 codebase already has a working component architecture (14 components, 3 layouts, path aliases via `@/*`), CSS custom properties for theming, and a dark/light mode system. The work is primarily extraction (moving inline HTML sections into dedicated components) and refinement (elevating the visual polish from functional to premium).

The competitive research reveals a clear pattern: the strongest cybersecurity firm websites (CrowdStrike, Bishop Fox, NCC Group, Darktrace) use a hybrid light/dark approach with dark hero sections transitioning to lighter content sections. However, for Imizi Cyber's specific audience -- enterprise CISOs and bank IT directors in Rwanda -- a dark-first approach with a polished light mode alternative is the right call. Dark signals technical authority; the green-on-navy palette already achieves this. The redesign should refine, not replace.

**Primary recommendation:** Extract index.astro into 7-8 named section components (HeroSection, TrustBar, WhyUsSection, ServicesSection, ProcessSection, CredentialsSection, BlogSection, FaqSection, CtaSection, ContactSection), move homepage-specific CSS from the page-level `<style>` block into component-scoped styles, and apply visual refinements (typography upgrade, spacing system, credential prominence, CTA visibility) across all components.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Keep existing green (#34d399) on dark navy palette -- refine, don't replace
- Polish the existing palette: better contrast ratios, more refined gradients, premium feel
- Green signals "security" and "technical" -- right for the brand
- Subtle reveal animations: sections fade/slide in on scroll, button hover effects
- Nothing flashy -- polished, not gimmicky
- Must respect `prefers-reduced-motion` media query
- Hero headline + "Book a Consultation" CTA + OSCP/OSCP+/BlackHat credential badges visible immediately without scrolling
- Credentials must be visible before any service description
- Blog section shows 3 latest posts (not 9) with "View all" link
- Contact form stays on homepage (not a separate /contact/ page)
- Service page structure: Problem -> Solution -> How -> CTA flow
- Explicit deliverables list per service
- Compliance mapping per service page (BNR directives, PCI DSS, ISO 27001)
- Equal design priority for mobile and desktop
- WhatsApp floating button: larger and always-visible (sticky) on mobile -- primary mobile conversion channel in Rwanda
- Touch targets must meet accessibility minimums (44x44px)

### Claude's Discretion

- Exact aesthetic blend (minimal/bold/technical) based on competitor research
- Dark-first vs equal theme treatment
- Homepage section order after hero
- Mobile navigation pattern (hamburger vs alternatives)
- Typography choices (font pairing, heading sizes, weights)
- Spacing system and grid specifications
- Component naming conventions for extracted sections

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                           | Research Support                                                                                                                      |
| ------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| UIUX-01 | Premium boutique visual redesign with world-class aesthetic competing with global cybersecurity firms | Competitive research (CrowdStrike, Bishop Fox, NCC Group), design system recommendations, typography/color refinement, spacing system |
| UIUX-02 | "Book a Consultation" CTA visible above the fold on every page                                        | CTA placement in BaseLayout, hero section design, sticky/fixed CTA patterns, per-page integration                                     |
| UIUX-03 | Responsive layout renders correctly on mobile phones, tablets, and desktops                           | Breakpoint system (375px, 768px, 1024px, 1440px), mobile nav pattern, touch targets, WhatsApp mobile sizing                           |

</phase_requirements>

## Standard Stack

### Core

| Library               | Version | Purpose                                    | Why Standard                                                   |
| --------------------- | ------- | ------------------------------------------ | -------------------------------------------------------------- |
| Astro                 | ^6.0.5  | Static site generator, component framework | Already in use; zero JS by default, component scoping built-in |
| CSS Custom Properties | N/A     | Design tokens, theming                     | Already in use via `global.css`; no build tool needed          |
| Astro Scoped Styles   | N/A     | Component-level CSS encapsulation          | Built into Astro `<style>` blocks; auto-scoped, tree-shaken    |

### Supporting

| Library                  | Version      | Purpose                            | When to Use                                                                            |
| ------------------------ | ------------ | ---------------------------------- | -------------------------------------------------------------------------------------- |
| Plus Jakarta Sans        | Google Fonts | Body/heading typography            | KEEP -- already loaded, premium geometric sans-serif, suitable for security/enterprise |
| JetBrains Mono           | Google Fonts | Monospace for code/terminal/badges | KEEP -- already loaded, excellent for terminal aesthetic and credential labels         |
| IntersectionObserver API | Native       | Scroll reveal animations           | Already in use via `src/scripts/scroll-reveal.ts`; no library needed                   |

### Alternatives Considered

| Instead of                 | Could Use                     | Tradeoff                                                                                                                                       |
| -------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Plus Jakarta Sans          | Inter, DM Sans, IBM Plex Sans | Plus Jakarta Sans is already loaded and delivers the right premium-yet-approachable feel. Switching fonts is unnecessary churn. Keep it.       |
| Global CSS + scoped styles | Tailwind CSS                  | Adding Tailwind to an existing CSS custom property system is a major refactor with no clear benefit for a 12-page site. Keep current approach. |
| CSS custom properties      | CSS-in-JS                     | Astro is SSG; CSS-in-JS adds runtime weight. Custom properties are the right tool.                                                             |

**Installation:**

```bash
# No new packages needed. All tooling is already installed.
```

## Architecture Patterns

### Recommended Project Structure

```
src/
  components/
    sections/           # NEW: Homepage section components
      HeroSection.astro
      TrustBar.astro
      WhyUsSection.astro
      ServicesSection.astro
      ProcessSection.astro
      CredentialsSection.astro
      BlogSection.astro
      FaqSection.astro
      CtaSection.astro
      ContactSection.astro
    Nav.astro            # Existing (may need visual refinement)
    Footer.astro         # Existing (may need visual refinement)
    BlogCard.astro       # Existing
    ContactForm.astro    # Existing
    ... (other existing components)
  styles/
    global.css           # Refined: design tokens, shared utilities, responsive base
    # Component-specific styles move INTO each .astro <style> block
  pages/
    index.astro          # Refactored: imports + composes section components
  data/
    site.ts              # Existing: add any new shared data (e.g., credentials array)
```

### Pattern 1: Section Component Extraction

**What:** Move each homepage `<!-- SECTION -->` block into a dedicated `.astro` file in `src/components/sections/`.
**When to use:** Every named section in index.astro that has its own visual identity and could be independently modified.
**Example:**

```astro
---
// src/components/sections/HeroSection.astro
import { CONTACT } from '@/data/site';

interface Props {
  showCredentials?: boolean;
}

const { showCredentials = true } = Astro.props;
---

<section class="hero">
  <div class="w">
    <!-- Hero content extracted from index.astro lines 337-397 -->
  </div>
</section>

<style>
  /* Styles extracted from index.astro <style> block, lines 758-866 */
  .hero {
    padding: 132px 0 48px;
  }
  /* ... */
</style>
```

### Pattern 2: Data-Driven Sections

**What:** Extract hardcoded data arrays (blogPosts, faqItems, credentials) into `src/data/` files and pass as props or import directly.
**When to use:** When section data is repeated across pages or is large enough to clutter the component.
**Example:**

```astro
---
// src/data/credentials.ts
export const CREDENTIALS = [
  { badge: 'CERT', title: 'OSCP and OSCP+', org: 'Offensive Security' },
  { badge: 'CERT', title: 'PNPT', org: 'Practical Network Pentester' },
  { badge: 'TALK', title: 'BlackHat Europe Arsenal', org: 'Presenter, London 2023' },
  { badge: 'MSc', title: 'Computer Security', org: 'Technical University of Denmark' },
  { badge: 'BSc', title: 'Informatics', org: 'University of Athens' },
  { badge: 'OSS', title: 'Google Summer of Code', org: 'Honeynet Project 2023/2024' },
] as const;
---
```

### Pattern 3: Responsive CTA in BaseLayout

**What:** Add a "Book a Consultation" CTA that is visible above the fold on EVERY page, not just the homepage.
**When to use:** UIUX-02 requires this on all pages.
**Implementation options:**

1. **Sticky CTA bar below nav** (recommended): A thin bar below the fixed nav with the CTA, visible on all pages. Collapses to just the button on mobile.
2. **CTA in Nav component**: Add as a prominent nav element. Already partially exists as "Get in Touch" but needs to say "Book a Consultation" and be more visually prominent.
3. **Floating CTA**: Like WhatsApp float but for consultation. Risk: competes with WhatsApp button.

**Recommendation:** Enhance the existing Nav CTA ("Get in Touch") to say "Book a Consultation" with more visual weight (larger, filled button), and ensure it remains visible in the mobile hamburger menu AND as a standalone visible button that does not require opening the menu. On mobile, the CTA should be visible at all times without opening the hamburger.

### Pattern 4: CSS Design Token Refinement

**What:** Refine the existing CSS custom property system for more premium feel.
**When to use:** Applied during the visual redesign wave.
**Example:**

```css
:root {
  /* Existing tokens -- refine values, don't rename */
  --bg: #0b1421;
  --bg2: #0f1b2d;
  --bg3: #131f33;
  --bg4: #172640;

  /* NEW: spacing scale (8px base) */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-20: 5rem; /* 80px */

  /* NEW: typography scale */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.84rem; /* ~13.4px */
  --text-base: 0.938rem; /* 15px (current body) */
  --text-lg: 1.05rem; /* ~16.8px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */
  --text-5xl: 3rem; /* 48px */

  /* NEW: border radius scale */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* NEW: shadow scale */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 12px 40px rgba(0, 0, 0, 0.25);
}
```

### Anti-Patterns to Avoid

- **Inlining all CSS in global.css:** Homepage section styles (hero terminal, trust stats, credential grid, service cards, process steps) must move to component-scoped `<style>` blocks when those sections are extracted. Do NOT leave orphaned CSS in global.css.
- **Creating deeply nested component trees:** Section components should be flat -- `<HeroSection />`, not `<HeroSection><HeroContent><HeroBadge /></HeroContent></HeroSection>`. Premature abstraction adds complexity without value for a 12-page site.
- **Using `client:load` for scroll reveal:** The existing IntersectionObserver approach in `src/scripts/scroll-reveal.ts` works perfectly. Do not introduce a framework component for this.
- **Breaking existing E2E test selectors:** Tests rely on: `h1`, `.nav-links a`, `#theme-toggle-btn`, `link[name=/consultation|get in touch/i]`. Refactoring must preserve these selectors or update tests in the same commit.

## Don't Hand-Roll

| Problem                | Don't Build                      | Use Instead                                            | Why                                                                                   |
| ---------------------- | -------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Scroll animations      | Custom animation framework       | Existing `scroll-reveal.ts` + CSS `.reveal` pattern    | Already works, uses native IntersectionObserver, respects reduced-motion via CSS      |
| Responsive breakpoints | Custom media query system        | Standard CSS media queries at 480/768/1024px           | Already established in global.css; consistency matters more than cleverness           |
| Theme switching        | Custom state management          | Existing `data-theme` attribute + localStorage pattern | Already works correctly post-Phase 1 fix                                              |
| Mobile menu            | Custom slide-out drawer          | Existing hamburger menu in Nav.astro                   | Already functional; refine visually, don't rebuild                                    |
| Grid system            | Custom grid framework            | CSS Grid + existing `.w` container (920px max-width)   | Native CSS Grid is sufficient for this layout complexity                              |
| Icon system            | Icon library (Lucide, Heroicons) | Inline SVGs as currently used                          | Site has ~10 unique icons; a library adds unused weight. Continue inline SVG pattern. |

**Key insight:** This phase is about extraction and refinement, not rebuilding. The existing technical infrastructure (Astro components, CSS custom properties, IntersectionObserver reveal, theme toggle) is sound. The gap is visual polish and architectural organization.

## Common Pitfalls

### Pitfall 1: Breaking E2E Tests During Refactor

**What goes wrong:** Extracting sections into components changes DOM structure (element nesting, class names, IDs) and E2E tests fail.
**Why it happens:** Tests use CSS selectors and text matchers that depend on specific DOM hierarchy.
**How to avoid:** Before ANY refactoring, run `npm run test:e2e` to establish baseline. After each component extraction, run tests again. Key selectors to preserve:

- `h1` (homepage heading) -- `homepage.spec.ts` line 11
- `link[name=/consultation|get in touch/i]` -- `homepage.spec.ts` line 17
- `#theme-toggle-btn` -- `homepage.spec.ts` line 24
- `nav` with `link[name=/services/i]`, `link[name=/blog/i]`, `link[name=/resources/i]`, `link[name=/contact/i]` -- `navigation.spec.ts`
  **Warning signs:** `npm run test:e2e` fails after a refactor commit.

### Pitfall 2: CSS Specificity Wars When Moving to Scoped Styles

**What goes wrong:** Styles that worked in global.css stop working when moved to component `<style>` blocks because Astro scoping changes selector specificity.
**Why it happens:** Astro scoped styles add a `data-astro-cid-*` attribute to selectors. If a child component's styles are overridden by a parent's scoped styles, or global styles conflict with scoped ones, visual breakage occurs.
**How to avoid:**

1. Move styles to the SAME component that owns the markup (e.g., hero styles go into HeroSection.astro, not a parent)
2. Use `:global()` escape hatch sparingly for styles that genuinely need to pierce component boundaries
3. Keep global.css for truly shared utilities (`.w`, `.btn`, `.sec`, `.card`, `.faq`, `.reveal`, reset, themes)
4. Test both dark and light themes after every style migration
   **Warning signs:** Elements lose styling when viewed in the browser; styles only work with `!important`.

### Pitfall 3: "Book a Consultation" CTA Not Actually Above the Fold

**What goes wrong:** The CTA exists on the page but is below the viewport on mobile (375px) because the hero headline, subtitle, credential badges, and terminal animation push it down.
**Why it happens:** "Above the fold" on 375px mobile is approximately 550-600px of visible height (minus nav bar of 56px). The current hero has: tag (30px) + h1 (~120px) + subtitle (~60px) + buttons (~50px) + terminal (~200px) = ~460px before any credentials. Adding credential badges above the fold means something must shrink or be rearranged.
**How to avoid:**

1. On mobile, the terminal animation should be below the fold (it is decorative, not conversion-critical)
2. Hero order on mobile: tag -> h1 -> credentials (compact inline) -> CTA buttons -> subtitle -> terminal
3. Verify with Playwright screenshot at 375px viewport
   **Warning signs:** Credential badges or CTA button require scrolling on iPhone SE (375x667).

### Pitfall 4: Global CSS Bloat After Refactor

**What goes wrong:** After extracting sections into components, global.css still contains all the old section-specific styles. The CSS is now duplicated (once in global.css, once in component scoped styles) or orphaned.
**Why it happens:** Developers extract markup but forget to clean up the corresponding CSS from global.css.
**How to avoid:** For each section extracted: (1) Move markup to component, (2) Move corresponding CSS to component `<style>`, (3) DELETE the old CSS from global.css, (4) Verify nothing else references those deleted selectors.
**Warning signs:** global.css still references `.trust-stats`, `.why-grid`, `.cred-grid`, `.process`, etc. after those sections live in components.

### Pitfall 5: WhatsApp Button Obscuring Content on Mobile

**What goes wrong:** The WhatsApp float and a new CTA button overlap content or each other on small screens.
**Why it happens:** Two fixed-position elements (WhatsApp float bottom-right, potential sticky CTA) compete for limited mobile screen real estate.
**How to avoid:** The WhatsApp float stays bottom-right. The CTA lives in the nav bar area, not as a separate floating element. On mobile, ensure the nav shows "Book a Consultation" as a prominent button even when the hamburger menu is closed. No second floating element.
**Warning signs:** Two overlapping floating buttons on mobile viewport.

### Pitfall 6: Light Theme Regression

**What goes wrong:** Visual redesign looks excellent in dark mode but light mode has contrast issues, invisible borders, or broken gradient backgrounds.
**Why it happens:** Developers test primarily in dark mode (the default) and forget to verify light mode after every change.
**How to avoid:** Every visual change must be verified in BOTH themes. Add `[data-theme='light']` overrides for any new styles that use opacity, rgba, or background-dependent colors. Use the existing E2E theme toggle test as a baseline.
**Warning signs:** Light mode text contrast below 4.5:1 ratio; invisible section borders in light mode.

## Code Examples

### Homepage After Refactoring (Target State)

```astro
---
// src/pages/index.astro — AFTER refactor (~50 lines instead of ~750)
import BaseLayout from '@/layouts/BaseLayout.astro';
import HeroSection from '@/components/sections/HeroSection.astro';
import TrustBar from '@/components/sections/TrustBar.astro';
import WhyUsSection from '@/components/sections/WhyUsSection.astro';
import ServicesSection from '@/components/sections/ServicesSection.astro';
import ProcessSection from '@/components/sections/ProcessSection.astro';
import CredentialsSection from '@/components/sections/CredentialsSection.astro';
import BlogSection from '@/components/sections/BlogSection.astro';
import FaqSection from '@/components/sections/FaqSection.astro';
import CtaSection from '@/components/sections/CtaSection.astro';
import ContactSection from '@/components/sections/ContactSection.astro';
import { SITE } from '@/data/site';

const schemas = [
  /* ... same as current ... */
];
---

<BaseLayout
  title="Penetration Testing & Offensive Security Kigali | imizicyber"
  description="OSCP-certified offensive security consultancy in Kigali..."
  canonicalUrl={`${SITE.url}/`}
  schemas={schemas}
  navVariant="home"
  footerVariant="home"
  showFreeTool={true}
>
  <main id="main">
    <HeroSection />
    <TrustBar />
    <CredentialsSection />
    <WhyUsSection />
    <ServicesSection />
    <ProcessSection />
    <BlogSection count={3} />
    <FaqSection />
    <CtaSection />
    <ContactSection />
  </main>
</BaseLayout>

<script>
  import { initScrollReveal } from '@/scripts/scroll-reveal';
  import { initEmailObfuscation } from '@/scripts/email-obfuscation';
  initScrollReveal();
  initEmailObfuscation();
</script>
```

### Section Component with Scoped Styles

```astro
---
// src/components/sections/TrustBar.astro
---

<div class="trust">
  <div class="w">
    <div class="trust-stats">
      <div class="trust-stat"><strong>6+</strong><span>countries</span></div>
      <span class="trust-sep">&bull;</span>
      <div class="trust-stat"><strong>50+</strong><span>engagements</span></div>
      <span class="trust-sep">&bull;</span>
      <div class="trust-stat"><strong>OSCP</strong><span>certified</span></div>
      <span class="trust-sep">&bull;</span>
      <div class="trust-stat"><strong>BlackHat</strong><span>Europe presenter</span></div>
    </div>
  </div>
</div>

<style>
  .trust {
    padding: 18px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }
  .trust-stats {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  /* ... rest of trust-specific styles ... */
</style>
```

### Responsive CTA in Nav (Mobile-Visible)

```astro
<!-- In Nav.astro: CTA visible outside hamburger menu on mobile -->
<div class="nav-end">
  <a href={contactHref} class="nav-cta-mobile">Book a Consultation</a>
  <ThemeToggle />
  <button class="menu-btn" aria-label="Menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</div>

<style>
  .nav-cta-mobile {
    display: none; /* Hidden on desktop where full nav is visible */
  }
  @media (max-width: 768px) {
    .nav-cta-mobile {
      display: inline-flex;
      background: var(--accdark);
      color: #fff;
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }
  }
</style>
```

### prefers-reduced-motion Pattern

```css
/* In global.css -- already partially implemented */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .terminal-cursor {
    animation: none;
  }
  .card {
    transition: none;
  }
  .card:hover {
    transform: none;
  }
}
```

## Aesthetic Decisions (Claude's Discretion)

### Aesthetic Blend: Technical Authority + Refined Minimalism

Based on competitive research across CrowdStrike, Bishop Fox, NCC Group, Darktrace, and design guides for cybersecurity websites:

**Recommendation:** Blend technical sophistication (terminal animations, monospace labels, code-like credential badges) with refined minimalism (generous whitespace, disciplined typography, restrained color use). This positions Imizi Cyber between:

- Global enterprise (CrowdStrike: bold, gradient-heavy, complex) -- too heavy for boutique
- Boutique advisory (Bishop Fox: clean, authoritative, expert-driven) -- right positioning
- Generic template: avoid at all costs

**Confidence:** MEDIUM -- based on competitive analysis patterns, not live A/B testing.

### Dark-First Theme Treatment

**Recommendation:** Dark is primary, light is functional alternative.
**Rationale:**

1. Target audience (CISOs, IT directors) spends significant time in terminal/dark-themed tools
2. Dark backgrounds make green accent color (#34d399) pop more dramatically
3. Cybersecurity industry convention: dark signals technical depth
4. The existing dark palette is already strong; the light theme needs refinement but is secondary
5. Enterprise buyers in East Africa are primarily on mobile -- dark mode reduces battery consumption

**Action:** Invest 70% design effort in dark theme, 30% in light theme. Ensure light theme meets contrast requirements but don't aim for visual parity.

### Homepage Section Order (After Hero)

**Recommendation:**

1. Hero (headline + CTA + credentials above fold)
2. Trust Bar (stats strip: 6+ countries, 50+ engagements, OSCP, BlackHat)
3. Credentials Section (OSCP, OSCP+, PNPT, BlackHat, MSc, BSc, GSoC -- expanded from current "About" section)
4. Why Us (3-column differentiators)
5. Services (3 service cards)
6. Process (4 steps)
7. Blog (3 latest posts + "View all")
8. FAQ (accordion)
9. CTA (compliance urgency)
10. Contact (form + info)

**Rationale:** Credentials BEFORE services is a locked decision. The current page has credentials buried in section 5 (After Hero -> Trust -> Why -> Services -> Process -> About/Credentials). Moving them to position 3 (immediately after trust bar) satisfies the requirement that "Founder credentials must be visible before any service description."

### Mobile Navigation: Hamburger Menu (Keep)

**Recommendation:** Keep the existing hamburger menu pattern.
**Rationale:**

1. Hamburger is universally understood on mobile
2. The current implementation works (Phase 1 fixed it)
3. Alternative patterns (bottom tab bar, slide-out drawer) add complexity without clear benefit for a 5-page site
4. Critical addition: "Book a Consultation" CTA button visible OUTSIDE the hamburger, in the nav-end area next to the theme toggle

### Typography: Keep Plus Jakarta Sans + JetBrains Mono

**Recommendation:** Do not change fonts. Refine sizing and weight usage.
**Rationale:**

1. Plus Jakarta Sans is a premium geometric sans-serif suitable for enterprise security
2. JetBrains Mono adds technical credibility through terminal/code aesthetics
3. Both are already loaded -- switching incurs implementation cost with marginal benefit
4. The issue is not the fonts but how they are used: inconsistent sizing, insufficient weight contrast between headings and body

**Refinements:**

- Increase h1 size on desktop (currently clamp 2.1-2.9rem; increase to clamp 2.4-3.2rem)
- Increase body text size (currently 15px; keep but increase line-height to 1.7)
- Add more weight contrast: h1 at 800, h2 at 700, h3 at 700, body at 400
- Standardize monospace label usage (section tags, badges, metadata)

### Spacing System

**Recommendation:** Adopt an 8px base grid system applied through CSS custom properties.
**Rationale:** Current spacing is ad-hoc (padding values like 132px, 48px, 28px, 24px). A systematic scale (8, 16, 24, 32, 48, 64, 80) creates visual rhythm and makes spacing decisions predictable.

### Component Naming

**Recommendation:** Use descriptive `{Purpose}Section.astro` naming.
**Rationale:** PascalCase is the existing convention. Adding `Section` suffix distinguishes page-level sections from reusable UI components (BlogCard, ContactForm). The `sections/` subdirectory provides additional organization.

## State of the Art

| Old Approach                                 | Current Approach                                             | When Changed        | Impact                                                    |
| -------------------------------------------- | ------------------------------------------------------------ | ------------------- | --------------------------------------------------------- |
| Global CSS for everything                    | Astro scoped styles per component                            | Astro 1.0+ (2022)   | Eliminates CSS conflicts, enables tree-shaking            |
| `<style is:global>` in every component       | `<style>` (scoped by default) + global.css for shared tokens | Astro convention    | Scoped by default; global only for design tokens          |
| Framework components for simple interactions | Vanilla JS in Astro `<script>` tags                          | Astro 6 pattern     | Zero JS overhead for menu toggle, theme, reveal           |
| Separate CSS files per component             | Inline `<style>` in `.astro` files                           | Astro best practice | Co-location of markup and styles improves maintainability |

**Deprecated/outdated:**

- Using `define:vars` for passing Astro variables to CSS is unnecessary when CSS custom properties serve the same purpose
- `is:inline` scripts should be avoided for anything other than critical-path initialization (theme FOUC prevention). Regular `<script>` tags are compiled by Astro and are better.

## Open Questions

1. **Blog section: dynamic or hardcoded?**
   - What we know: Currently, homepage blog posts are hardcoded as an array of 9 objects in index.astro frontmatter. The actual blog uses Astro content collections (`getCollection('blog')`).
   - What's unclear: Should the homepage BlogSection component dynamically fetch from the content collection (ensures freshness) or keep the curated hardcoded list (allows editorial control)?
   - Recommendation: Switch to dynamic `getCollection('blog')` sorted by date, take first 3. This is the Astro-idiomatic approach and ensures new blog posts auto-appear on the homepage. The editorial control argument is weak -- the latest 3 posts are the most relevant.

2. **Container width: 920px or wider?**
   - What we know: Current `.w` container is 920px max-width. Premium cybersecurity sites (CrowdStrike, NCC Group) use wider containers (1200-1440px).
   - What's unclear: Whether widening the container improves the aesthetic or creates too much horizontal reading distance.
   - Recommendation: Keep 920px for text-heavy sections (article body, FAQ, contact), but allow hero and trust/credential sections to use a wider container (1200px) for more visual breathing room. Create `.w-wide` utility class.

3. **Service page refactoring scope**
   - What we know: Service pages (919, 618, 604 lines) are also monolithic. CONTEXT.md mentions "Problem -> Solution -> How -> CTA flow."
   - What's unclear: Whether service page refactoring is in-scope for Phase 3 or deferred.
   - Recommendation: Include basic service page section extraction in Phase 3 since the visual redesign affects them. Create shared service section components (ServiceHero, ServiceDeliverables, ServiceCompliance, ServiceCta) that all three service pages consume.

## Validation Architecture

### Test Framework

| Property           | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| Framework          | Playwright ^1.58.2 + axe-core                                 |
| Config file        | `playwright.config.ts`                                        |
| Quick run command  | `npx playwright test e2e/homepage.spec.ts --project chromium` |
| Full suite command | `npx playwright test`                                         |

### Phase Requirements -> Test Map

| Req ID  | Behavior                                                                       | Test Type    | Automated Command                                                     | File Exists?                                               |
| ------- | ------------------------------------------------------------------------------ | ------------ | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| UIUX-01 | Premium visual aesthetic, consistent typography/spacing, no template feel      | e2e + visual | `npx playwright test e2e/homepage.spec.ts --project chromium`         | Partial (homepage.spec.ts exists, needs visual assertions) |
| UIUX-02 | "Book a Consultation" CTA visible above fold on every page, all screen sizes   | e2e          | `npx playwright test e2e/cta-visibility.spec.ts --project chromium`   | No -- Wave 0                                               |
| UIUX-03 | Responsive layout: 375px mobile, 768px tablet, 1440px desktop without breakage | e2e          | `npx playwright test e2e/responsive.spec.ts --project chromium`       | No -- Wave 0                                               |
| UIUX-01 | Section components used instead of inline markup                               | unit/build   | `npm run build` (build succeeds with new components)                  | N/A -- verified by build                                   |
| UIUX-01 | index.astro delegates to named section components                              | unit         | `npx vitest run tests/index-components.test.ts`                       | No -- Wave 0                                               |
| UIUX-03 | Touch targets meet 44x44px minimum                                             | e2e + axe    | `npx playwright test e2e/accessibility.spec.ts`                       | Exists (checks critical violations)                        |
| UIUX-01 | Dark and light themes render correctly                                         | e2e          | `npx playwright test e2e/homepage.spec.ts` (theme toggle test exists) | Exists                                                     |

### Sampling Rate

- **Per task commit:** `npx playwright test e2e/homepage.spec.ts e2e/navigation.spec.ts --project chromium`
- **Per wave merge:** `npx playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `e2e/cta-visibility.spec.ts` -- covers UIUX-02: tests CTA button is visible above fold (375px, 768px, 1440px viewports) on homepage, blog, service pages
- [ ] `e2e/responsive.spec.ts` -- covers UIUX-03: tests no horizontal overflow at 375px, 768px, 1440px; key elements visible
- [ ] Update `e2e/homepage.spec.ts` -- add assertion that index.astro uses section components (verify hero heading, services section, credentials section exist in expected DOM structure)
- [ ] Verify existing `e2e/accessibility.spec.ts` still passes after visual changes (touch target minimum, contrast ratios)

## Sources

### Primary (HIGH confidence)

- Astro docs: Component architecture (`https://docs.astro.build/en/basics/astro-components/`) -- props, slots, scoped styles
- Astro docs: Styling (`https://docs.astro.build/en/guides/styling/`) -- scoped vs global, CSS import order
- Direct codebase analysis: `src/pages/index.astro`, `src/styles/global.css`, `src/components/`, `src/layouts/BaseLayout.astro`
- Project CONTEXT.md: Locked decisions and discretion areas
- Project CONVENTIONS.md, ARCHITECTURE.md, STRUCTURE.md, CONCERNS.md

### Secondary (MEDIUM confidence)

- Cybersecurity website design patterns: `https://digi-tx.com/design/best-examples-cybersecurity-website-design/` -- light/dark hybrid approach, performance as credibility, restraint over drama
- UI/UX Pro Max skill: Design system recommendations for cybersecurity enterprise (Trust & Authority style, corporate typography pairings)
- CrowdStrike, Bishop Fox, NCC Group website analysis via web search -- competitive positioning

### Tertiary (LOW confidence)

- Specific typography recommendation (keep Plus Jakarta Sans vs switch to DM Sans/Inter) -- based on subjective aesthetic judgment, not A/B test data
- Homepage section order optimization -- based on B2B conversion patterns, not verified for Rwanda/East Africa market specifically
- Container width recommendation (920px vs wider) -- aesthetic preference without user testing data

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- existing stack is well-understood, no new dependencies needed
- Architecture: HIGH -- Astro component extraction is well-documented with clear patterns
- Visual design: MEDIUM -- competitive research is solid but aesthetic choices are inherently subjective
- Responsive: HIGH -- existing breakpoint system works; additions are incremental
- Pitfalls: HIGH -- derived from direct codebase analysis and known E2E test dependencies

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable -- Astro 6, CSS custom properties, and component patterns do not change rapidly)
