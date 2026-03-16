# Coding Conventions

**Analysis Date:** 2026-03-16

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Nav.astro`, `ContactForm.astro`, `SEOHead.astro`)
- Layouts: PascalCase (e.g., `BaseLayout.astro`, `BlogPostLayout.astro`, `SimplePageLayout.astro`)
- Data/config files: camelCase (e.g., `content.config.ts`, `site.ts`)
- CSS: single global file `global.css` with no component-scoped styles in astro frontmatter

**Functions:**
- Inline scripts use camelCase (e.g., `handleCookieConsent()`, `toggleTheme()`, `loadGA()`)
- IIFE patterns for initialization (e.g., cookie consent, theme loading in `CookieBanner.astro`)
- Event handler naming: `handle{Action}` pattern (e.g., `handleCookieConsent`)

**Variables:**
- camelCase for all variables: `isHome`, `formspreeUrl`, `fullOgImage`, `baseCSP`
- Constants in uppercase with prefix: `SITE`, `CONTACT`, `SOCIAL`, `ANALYTICS`
- Schema variable names: match JSON-LD structure (e.g., `@context`, `@type`, `itemListElement`)

**Types/Interfaces:**
- PascalCase for interface names: `Props`, `FaqItem`, `Link`, `BreadcrumbItem`
- Props interfaces define component contract and use descriptive names matching frontmatter keys
- Optional props explicitly marked with `?` (e.g., `variant?: 'home' | 'inner'`)

## Code Style

**Formatting:**
- No automated formatter configured (no .eslintrc, .prettierrc, or biome.json in project root)
- Indentation: Mixed (CSS uses minimal spacing, JavaScript uses standard spacing)
- CSS: Minified style blocks in Astro components or `global.css`
- JSDoc comments for complex components and functions

**Linting:**
- No linting configuration detected in project root
- TypeScript strict mode enabled via `astro/tsconfigs/strict` in `tsconfig.json`

**Example from `src/components/SEOHead.astro`:**
```astro
---
/**
 * SEOHead — renders all SEO meta tags (OG, Twitter, canonical, hreflang, geo).
 */
import { SITE } from '../data/site';

interface Props {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  canonicalUrl: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  robots?: string;
}

const {
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogType = 'website',
  canonicalUrl,
  ogImage = SITE.ogImage,
  twitterTitle,
  twitterDescription,
  robots = 'index, follow',
} = Astro.props;
---
```

## Import Organization

**Order:**
1. Node/runtime imports (none in typical use)
2. Astro core imports (`import { ... } from 'astro:content'`)
3. Framework imports (`@astrojs/...`)
4. Relative component imports (`'../components/...'`)
5. Relative data imports (`'../data/...'`)
6. Relative style imports (`'../styles/...'`)

**Example from `src/layouts/BaseLayout.astro`:**
```astro
import '../styles/global.css';
import SEOHead from '../components/SEOHead.astro';
import SchemaOrg from '../components/SchemaOrg.astro';
import SkipLink from '../components/SkipLink.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import WhatsAppFloat from '../components/WhatsAppFloat.astro';
import CookieBanner from '../components/CookieBanner.astro';
import { SITE } from '../data/site';
```

**Path Aliases:**
- No path aliases configured; all imports use relative paths

## Error Handling

**Patterns:**
- Try-catch blocks in inline scripts for localStorage and external APIs
- Graceful fallback on error (show error message or use default value)
- Example from `CookieBanner.astro`:
```javascript
try{
  var c=localStorage.getItem('imizi-cookie-consent');
  if(c==='accepted') window.loadGA();
  else if(c!=='rejected'){
    var b=document.getElementById('cookie-banner');
    b.classList.add('visible');
    b.querySelector('.btn-reject').focus();
  }
}catch(e){
  document.getElementById('cookie-banner').classList.add('visible');
}
```

- Form submission errors display user-friendly messages:
```javascript
.catch(function(){
  err.style.display = 'block';
  btn.textContent = 'Send enquiry';
  btn.disabled = false;
});
```

## Logging

**Framework:** No dedicated logging library; uses `console` (not observed in code)

**Patterns:**
- No verbose logging detected in components
- Focus on user-facing feedback (success/error messages in UI)
- No debug output in production code

## Comments

**When to Comment:**
- JSDoc-style comments for components explaining purpose and props
- Inline comments rare; code is generally self-documenting
- Section comments in CSS (e.g., `/* ============== NAV ============== */`)

**JSDoc/TSDoc:**
- Standard usage for component declarations
- Format: `/** * ComponentName — brief description. */`
- Document all `@prop` parameters in Props interface comments

**Example from `src/components/Nav.astro`:**
```astro
/**
 * Nav component — fixed navigation bar.
 * @prop variant - 'home' uses anchor links, 'inner' uses absolute paths
 * @prop showFreeTool - show the "Free Score" CTA button (default false)
 */
```

## Function Design

**Size:**
- Inline scripts in components kept compact (under 60 lines typical)
- IIFE patterns for module-scoped initialization
- No extracted utility functions; logic stays in components or frontmatter

**Parameters:**
- Astro components use destructured Props interface
- Avoid positional arguments; use named parameters
- Default values set in destructuring assignment

**Example from `src/components/ContactForm.astro` frontmatter:**
```typescript
const { formspreeId, formspreeUrl } = ANALYTICS;
```

**Return Values:**
- Functions return DOM elements, booleans, or void (side-effects)
- No complex return types; UI components yield JSX fragments

## Module Design

**Exports:**
- Astro components export nothing (implicit as default export)
- Data modules use named exports with `as const` assertion
- Example from `src/data/site.ts`:
```typescript
export const SITE = {
  name: 'imizicyber',
  legalName: 'IMIZI Cyber Consulting Ltd',
  // ...
} as const;
```

**Barrel Files:**
- Not used; imports reference specific files directly
- Example: `import { SITE } from '../data/site'` (not `from '../data'`)

## CSS Patterns

**Global Styling:**
- All global styles in `src/styles/global.css`
- CSS variables for theming: `--bg`, `--txt`, `--acc`, etc.
- Light/dark theme support via `[data-theme="light"]` selector

**Component Styles:**
- Inline `<style>` blocks in Astro components with scoped behavior
- Minimal CSS; heavy use of global utility classes
- Minified inline styles for small utility rules

**Example from `src/components/BlogCard.astro`:**
```astro
<style>
  .blog-card.featured{grid-column:span 2}
  .blog-card.featured h2{font-size:1.05rem}
  @media(max-width:768px){
    .blog-card.featured{grid-column:span 1}
  }
</style>
```

## TypeScript Usage

**Strict Mode:** Enabled via `astro/tsconfigs/strict`

**Type Definitions:**
- Interface names match component purpose: `Props`, `FaqItem`, `BreadcrumbItem`
- Explicit optional properties with `?` and `= defaultValue` in destructuring
- Union types for variant patterns: `variant?: 'home' | 'inner'`
- Record types for flexible objects: `schemas?: Record<string, unknown>[]`

## Data Structure Conventions

**Content Collections:**
- Schema validation via Zod in `src/content.config.ts`
- Blog frontmatter structure mirrors CMS expectations
- Fields like `datePublished`, `dateModified`, `ogTitle` follow naming pattern

**Example from `src/content.config.ts`:**
```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    headline: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    datePublished: z.string(),
    // ...
  }),
});
```

---

*Convention analysis: 2026-03-16*
