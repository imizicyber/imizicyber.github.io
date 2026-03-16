# Architecture

**Analysis Date:** 2026-03-16

## Pattern Overview

**Overall:** Static Site Generation (SSG) with component-based UI architecture

**Key Characteristics:**
- Astro-powered static site with zero runtime JavaScript by default
- Content collections for blog posts with schema validation
- Multi-layout system for different page types (base, blog posts, services)
- Schema.org structured data embedded in every page for SEO
- Responsive component composition with CSS-in-Astro styles
- Form handling via Formspree API integration

## Layers

**Page Layer:**
- Purpose: Route handling and page-level composition
- Location: `src/pages/`
- Contains: Astro route files (`.astro`) that render layouts and components
- Depends on: Layouts, components, data, content collections
- Used by: Astro router (automatic routing based on file structure)

**Layout Layer:**
- Purpose: Wrapper templates that define page structure (head, nav, footer, main content)
- Location: `src/layouts/`
- Contains: `BaseLayout.astro` (root wrapper for all pages), `SimplePageLayout.astro`, `BlogPostLayout.astro` (extends BaseLayout with article structure)
- Depends on: Components (Nav, Footer, SEOHead, SchemaOrg), styles, site data
- Used by: Pages inject content via `<slot />`

**Component Layer:**
- Purpose: Reusable UI elements with specific responsibilities
- Location: `src/components/`
- Contains: Structural (Nav, Footer), SEO (SEOHead, SchemaOrg), content (BlogCard, Breadcrumb), interactive (ContactForm, CookieBanner, ThemeToggle), utility (Logo, SkipLink, WhatsAppFloat)
- Depends on: Site data, styles, external APIs (Formspree for forms)
- Used by: Layouts and pages compose components into page structure

**Content Layer:**
- Purpose: Typed MDX content with frontmatter validation
- Location: `src/content/blog/`
- Contains: Blog posts (`.mdx` files) with structured frontmatter (title, datePublished, faq, keywords, og tags)
- Depends on: Content schema validation from `content.config.ts`
- Used by: Blog index page (`src/pages/blog/index.astro`) and dynamic route (`src/pages/blog/[...slug].astro`)

**Data Layer:**
- Purpose: Site configuration and constants
- Location: `src/data/site.ts`
- Contains: SITE (name, url, locale, metadata), CONTACT (email, phone, WhatsApp), SOCIAL (links), ANALYTICS (GA ID, Formspree ID)
- Depends on: Nothing
- Used by: All components and pages for consistent branding and integration points

**Style Layer:**
- Purpose: Global CSS and component-scoped styles
- Location: `src/styles/global.css` (global variables, utilities, base styles) + component `<style>` blocks (component-scoped)
- Contains: CSS custom properties (--white, --txt, --acc, --bg, --mono), utility classes, responsive breakpoints, theme toggle (light/dark)
- Depends on: Google Fonts (Plus Jakarta Sans, JetBrains Mono), theme system in localStorage
- Used by: All components via CSS variables

## Data Flow

**Page Rendering (Static):**

1. Astro build collects all pages from `src/pages/`
2. Pages import and compose layouts (BaseLayout or BlogPostLayout)
3. Layouts import components (Nav, Footer, etc.) and render `<slot />`
4. Components reference `src/data/site.ts` for config/links
5. All content gets schema.org JSON-LD injected via SchemaOrg component
6. Static HTML generated and written to `dist/`

**Blog Post Rendering:**

1. Build time: `getCollection('blog')` loads all `.mdx` files from `src/content/blog/`
2. Schema validation applied via `content.config.ts` (Zod)
3. Dynamic route `src/pages/blog/[...slug].astro` generates static pages for each post
4. Each post composed with BlogPostLayout which auto-generates schemas (BlogPosting, BreadcrumbList, FAQPage if faq field present)
5. Content slot renders MDX as HTML

**Form Submission (Runtime - ContactForm):**

1. User fills form in `ContactForm.astro`
2. JavaScript event listener prevents default, formats FormData
3. POST request to `ANALYTICS.formspreeUrl` (from data/site.ts)
4. Formspree accepts request or returns 400
5. Frontend toggles success/error UI based on response

**Theme Toggle (Runtime - Client Side):**

1. ThemeToggle button clicked, toggles `data-theme` attribute on `<html>`
2. CSS uses `[data-theme="light"]` and `[data-theme="dark"]` selectors
3. Preference persisted to localStorage key `imizi-theme`
4. On page load, script in BaseLayout head restores theme from localStorage (prevents FOUC)

**State Management:**

- Global: Stored in CSS custom properties (theme), localStorage (theme preference)
- Component: ContactForm success/error state via DOM visibility
- Form state: Native HTML form + JavaScript preventDefault + FormData API
- No framework state management (Astro/SSG paradigm)

## Key Abstractions

**Layout Composition:**
- Purpose: Wrap pages with consistent structure (head, nav, footer, styles)
- Examples: `src/layouts/BaseLayout.astro`, `src/layouts/BlogPostLayout.astro`
- Pattern: Astro components accepting `<slot />` to inject page content

**Schema Generation:**
- Purpose: Embed structured data for SEO (search engines, social media, rich results)
- Examples: `src/components/SchemaOrg.astro` injects JSON-LD, `BlogPostLayout` auto-generates BlogPosting + BreadcrumbList + FAQPage schemas
- Pattern: Array of schema objects passed to layout, rendered as `<script type="application/ld+json">`

**Component Variants:**
- Purpose: Single component, multiple visual/behavioral states
- Examples: Nav component with `variant="home"` (anchor links) vs `variant="inner"` (absolute paths), Footer with `variant="home"` vs `variant="inner"`
- Pattern: Props passed to component, conditional rendering based on variant

**Content Collection:**
- Purpose: Type-safe, validated MDX content with frontmatter
- Examples: Blog posts in `src/content/blog/` with Zod schema in `content.config.ts`
- Pattern: Astro Content API with loader (glob), schema validation, render at build time

**SEO Head:**
- Purpose: Centralize SEO meta tag generation
- Examples: `src/components/SEOHead.astro` renders OG, Twitter, canonical, hreflang, geo tags
- Pattern: Props interface matches typical SEO metadata, component renders conditional meta tags

## Entry Points

**Homepage:**
- Location: `src/pages/index.astro`
- Triggers: Site visit to `/`
- Responsibilities: Render hero, trust stats, why-us section, services grid, process steps, about/credentials, blog feed, FAQ, CTAs, contact form

**Blog Index:**
- Location: `src/pages/blog/index.astro`
- Triggers: Visit to `/blog/`
- Responsibilities: Fetch and sort all blog posts by datePublished (descending), render as grid with BlogCard component

**Dynamic Blog Post:**
- Location: `src/pages/blog/[...slug].astro`
- Triggers: Visit to `/blog/{slug}/`
- Responsibilities: Load post by slug via getCollection, render with BlogPostLayout (which auto-generates schemas), pass MDX content to layout slot

**Service Pages:**
- Location: `src/pages/services/{managed-security,penetration-testing,security-training}/index.astro`
- Triggers: Visit to `/services/{service}/`
- Responsibilities: Render service-specific details, schemas, FAQs, process steps, CTA

**Tools:**
- Location: `src/pages/tools/security-score/index.astro`
- Triggers: Visit to `/tools/security-score/` (linked as "Free Score" from nav)
- Responsibilities: Interactive security assessment tool (embedded on page)

**Static Pages:**
- Location: `src/pages/{privacy-policy,resources,responsible-disclosure,company-profile}/index.astro`
- Triggers: Visit to respective routes
- Responsibilities: Render informational/legal/company content

## Error Handling

**Strategy:** Graceful degradation with fallback UI

**Patterns:**

- **Missing Content:** 404.astro page handles unknown routes, returns HTTP 404 status
- **Form Errors:** ContactForm shows inline error message if Formspree POST fails or network error occurs, button returns to initial state for retry
- **Missing Theme:** If localStorage unavailable (privacy mode), document.documentElement defaults to dark theme (CSS default), no error thrown
- **Missing Data:** All imports from `src/data/site.ts` are constants, no runtime fetch failures possible
- **Schema Validation:** Content collection posts must match Zod schema; invalid frontmatter throws build-time error (stops build, prevents invalid posts shipped)

## Cross-Cutting Concerns

**Logging:** None. This is static site generation; no server logs. Browser console used for debugging only (e.g., form submission console.log not present but could be added).

**Validation:**
- Content: Zod schema in `content.config.ts` validates blog frontmatter at build time
- Forms: HTML5 validation (required, email type) + client-side check in ContactForm before POST

**Authentication:** Not applicable. Static site with optional form submission to Formspree (no user sessions).

**Security:**
- CSP (Content Security Policy) header set in BaseLayout head: `default-src 'self'`, script-src allows self + unsafe-inline + googletagmanager.com, style-src allows self + unsafe-inline + fonts.googleapis.com
- Canonical URLs prevent duplicate content indexing
- Robots meta tag controls crawler behavior
- Email obfuscation in index.astro (ROT13-like construction of email link at runtime to foil scrapers)

---

*Architecture analysis: 2026-03-16*
