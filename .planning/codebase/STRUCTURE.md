# Codebase Structure

**Analysis Date:** 2026-03-16

## Directory Layout

```
imizicyber.github.io/
├── src/
│   ├── components/              # Reusable UI components
│   ├── content/
│   │   └── blog/                # Blog post MDX files with frontmatter
│   ├── data/                    # Site constants and configuration
│   ├── layouts/                 # Page wrapper templates
│   ├── pages/                   # Route files (file-based routing)
│   │   ├── blog/
│   │   ├── services/
│   │   ├── tools/
│   │   └── [other pages]/
│   ├── styles/                  # Global CSS and design tokens
│   └── content.config.ts        # Content collection schema definitions
├── public/                      # Static assets (favicons, logos, manifest)
├── dist/                        # Build output (generated, not committed)
├── astro.config.mjs             # Astro configuration (SSG, integrations, site URL)
├── tsconfig.json                # TypeScript strict mode
├── package.json                 # Dependencies (Astro, MDX, Sitemap)
└── .gitignore
```

## Directory Purposes

**src/components/:**

- Purpose: Reusable Astro components used across pages
- Contains: 16 components total
  - **Structural:** `Nav.astro` (header with mobile menu), `Footer.astro` (footer with links), `Logo.astro` (brand logo SVG)
  - **SEO:** `SEOHead.astro` (meta tags), `SchemaOrg.astro` (JSON-LD schemas)
  - **Content:** `BlogCard.astro` (blog post card in grid), `Breadcrumb.astro` (navigation breadcrumb)
  - **Interactive:** `ContactForm.astro` (form with Formspree POST), `CookieBanner.astro` (GDPR/privacy consent), `ThemeToggle.astro` (dark/light switch), `WhatsAppFloat.astro` (floating WhatsApp CTA)
  - **Callouts:** `Callout.astro` (alert/info box), `CtaBox.astro` (call-to-action box)
  - **Utility:** `SkipLink.astro` (a11y skip to main)
- Key files: All 16 components in this directory
- Naming: PascalCase `.astro` files

**src/content/blog/:**

- Purpose: Blog post source files with typed frontmatter
- Contains: 17 MDX files (2026-03-16)
- Naming: kebab-case filenames (e.g., `penetration-testing-rwanda.mdx`)
- Structure: YAML frontmatter block with fields: title, headline, description, datePublished, breadcrumbName, canonicalUrl, faq (optional array), og\* fields
- Validation: Schema defined in `content.config.ts` via Zod

**src/data/site.ts:**

- Purpose: Centralized site constants and integration points
- Contains: 4 exported objects:
  - `SITE`: name, legalName, url, locale, lang, region, placename, ogImage dims
  - `CONTACT`: email, securityEmail, phone, whatsappUrl, address
  - `SOCIAL`: linkedin, github URLs
  - `ANALYTICS`: gaId (Google Analytics), formspreeId (form backend), formspreeUrl
- Usage: Imported by layouts, pages, components for consistent branding and config

**src/layouts/:**

- Purpose: Page wrapper templates defining page structure
- Contains: 3 layouts
  - `BaseLayout.astro`: Root wrapper for all pages. Imports global CSS, renders SEOHead, SchemaOrg, Nav, Footer, WhatsAppFloat, CookieBanner. Props: title, description, keywords, og\*, schemas, navVariant, footerVariant, showWhatsApp, showFreeTool
  - `BlogPostLayout.astro`: Extends BaseLayout for blog articles. Auto-generates BlogPosting, BreadcrumbList, FAQPage schemas. Props: frontmatter object with blog post metadata. Includes Breadcrumb and CtaBox components
  - `SimplePageLayout.astro`: Exists but rarely used; for simple single-column pages

**src/pages/:**

- Purpose: Route files defining site structure
- Contains: 12 route files organized by feature:
  - `index.astro`: Homepage with hero, sections, FAQ, contact form
  - `404.astro`: 404 error page
  - **Blog:**
    - `blog/index.astro`: Blog listing page (all posts sorted by date DESC)
    - `blog/[...slug].astro`: Dynamic route for individual blog posts
  - **Services:**
    - `services/penetration-testing/index.astro`: Service detail page + schemas + FAQ
    - `services/managed-security/index.astro`: Service detail page
    - `services/security-training/index.astro`: Service detail page
  - **Tools:**
    - `tools/security-score/index.astro`: Interactive assessment tool
  - **Static:**
    - `company-profile/index.astro`: Company info
    - `privacy-policy/index.astro`: Privacy policy
    - `resources/index.astro`: Resource links
    - `responsible-disclosure/index.astro`: Security disclosure policy
- Naming: Directories mirror URL structure; `index.astro` = `/path/`, `[slug].astro` = dynamic `/path/{value}/`

**src/styles/global.css:**

- Purpose: Global CSS variables, reset, utilities, breakpoints
- Contains: 19065 bytes
  - CSS custom properties: `--white`, `--txt`, `--txt2`, `--txt3`, `--acc`, `--bg`, `--bg2`, `--bg3`, `--dim`, `--mono` (font family)
  - Responsive utilities: `.w` wrapper class, spacing, layout helpers
  - Component styles for major elements: hero, trust, why-us, cards, blog grid, cred grid, contact grid, FAQ list, buttons, forms
  - Responsive breakpoints: tablet (max-width 1024px), mobile (max-width 768px), small (max-width 480px)
  - Theme support: `[data-theme="light"]` overrides for light mode
- Component scopes: Styles in component `<style>` blocks override/extend globals

**src/content.config.ts:**

- Purpose: Define and validate content collection schema
- Contains: Single collection named 'blog' with Zod schema
- Schema fields: title (string), headline, description, keywords (optional), datePublished, dateModified (optional), readTime (optional), metaLabel (optional), breadcrumbName, ogTitle, ogDescription, twitterTitle, twitterDescription, ogImage, canonicalUrl, cardDescription, cardDate, featured (boolean, optional), faq (optional array of {question, answer})
- Loader: Glob pattern `**/*.mdx` in `./src/content/blog`

**public/:**

- Purpose: Static assets served as-is at site root
- Contains: Favicons, logos, manifest.json, .well-known folder
- Files included: favicon.ico, favicon-32.png, logo-192.png, logo-256.png, logo-512.png, og.png, manifest.json

**dist/:**

- Purpose: Build output directory (generated by Astro)
- Not committed to git (.gitignore)
- Mirrors source structure with .html files instead of .astro

## Key File Locations

**Entry Points:**

- `src/pages/index.astro`: Homepage — main entry point
- `src/pages/blog/index.astro`: Blog listing
- `src/pages/blog/[...slug].astro`: Blog post dynamic rendering

**Configuration:**

- `astro.config.mjs`: Astro settings (output: 'static', build format: 'directory', integrations: sitemap, mdx)
- `tsconfig.json`: TypeScript config (extends astro/tsconfigs/strict)
- `package.json`: npm dependencies (Astro, @astrojs/mdx, @astrojs/sitemap)
- `src/content.config.ts`: Content collection schema

**Core Logic:**

- `src/layouts/BaseLayout.astro`: Root template with CSP, theme init, nav/footer injection
- `src/layouts/BlogPostLayout.astro`: Blog article wrapper with auto-schema generation
- `src/data/site.ts`: All site constants (site name, URLs, analytics IDs, contact info)

**SEO & Schema:**

- `src/components/SEOHead.astro`: Meta tag rendering (OG, Twitter, canonical, hreflang, geo)
- `src/components/SchemaOrg.astro`: JSON-LD injection
- Every page passes schemas array to BaseLayout

**Forms & Interaction:**

- `src/components/ContactForm.astro`: Formspree form with client-side submission + validation feedback
- `src/components/CookieBanner.astro`: Cookie consent UI
- `src/components/ThemeToggle.astro`: Dark/light mode toggle (persists to localStorage)

**Testing:**

- No test files present in codebase (.test.ts, .spec.ts files not found)

## Naming Conventions

**Files:**

- **Components:** PascalCase with `.astro` extension (e.g., `ContactForm.astro`, `SEOHead.astro`)
- **Layouts:** PascalCase with Layout suffix (e.g., `BaseLayout.astro`, `BlogPostLayout.astro`)
- **Pages:** kebab-case (e.g., `[...slug].astro`, `index.astro`)
- **Content (MDX):** kebab-case (e.g., `penetration-testing-rwanda.mdx`)
- **Data files:** camelCase with `.ts` (e.g., `site.ts`, `content.config.ts`)
- **Styles:** lowercase `.css` (e.g., `global.css`)

**Directories:**

- **Feature directories:** kebab-case in `src/pages/` (e.g., `blog/`, `services/`, `tools/`, `company-profile/`)
- **Collections:** kebab-case (e.g., `src/content/blog/`)
- **Utility directories:** lowercase plural (e.g., `components`, `layouts`, `pages`, `styles`, `data`)

**CSS Classes:**

- **Block:** kebab-case, semantic (e.g., `.hero`, `.blog-grid`, `.contact-form`, `.nav-links`)
- **Modifier:** double-dash (e.g., `.btn--fill`, `.card--featured`, `.nav--inner`)
- **State:** single-dash or data attribute (e.g., `.active`, `[data-theme="light"]`)

**Variables:**

- **JavaScript/TypeScript:** camelCase (e.g., `formspreeUrl`, `showWhatsApp`, `blogPosts`)
- **CSS custom properties:** kebab-case with double-dash prefix (e.g., `--white`, `--txt2`, `--bg3`, `--mono`)

## Where to Add New Code

**New Blog Post:**

1. Create `.mdx` file in `src/content/blog/` with kebab-case name
2. Add frontmatter block matching Zod schema (title, headline, datePublished, breadcrumbName, canonicalUrl, etc.)
3. Write article content (MDX syntax supported)
4. Build triggers static generation of `/blog/{slug}/` automatically

**New Service Page:**

1. Create directory `src/pages/services/{service-name}/`
2. Create `index.astro` in that directory
3. Import BaseLayout, define schemas, render page content
4. Nav link to it from appropriate place (already links to services section)

**New Component:**

1. Create `.astro` file in `src/components/` with PascalCase name
2. Use Astro syntax (frontmatter section with props, HTML template)
3. Import and use in layouts or pages via `<ComponentName prop={value} />`
4. Style with component-scoped `<style>` block or global CSS classes

**New Static Page:**

1. Create directory `src/pages/{page-name}/`
2. Create `index.astro` in that directory
3. Import BaseLayout, set title/description/canonicalUrl props
4. Render page content with imported components

**Utilities & Helpers:**

- Place in `src/data/` if configuration/constants
- Place directly in component if single-use
- Consider extracting to separate file in `src/data/` if used across multiple components

**Styles:**

- Global utilities: Add to `src/styles/global.css` (utilities, responsive, theme overrides)
- Component-specific: Add to component `<style>` block (scoped to component)
- Theme variants: Use `[data-theme="light"]` and `[data-theme="dark"]` selectors in global.css

## Special Directories

**src/.astro/:**

- Purpose: Generated by Astro during build (collection schemas)
- Generated: Yes
- Committed: No (.gitignore)
- Contains: `.astro/collections/blog.schema.json` (generated schema for IDE intellisense)

**dist/:**

- Purpose: Build output directory
- Generated: Yes (by `npm run build`)
- Committed: No (.gitignore)
- Contains: Entire static site ready for deployment (HTML, CSS, JS, assets)

**node_modules/:**

- Purpose: npm package dependencies
- Generated: Yes (by `npm install`)
- Committed: No (.gitignore)
- Contains: Astro, MDX plugin, Sitemap plugin, and transitive dependencies

**public/.well-known/:**

- Purpose: Standard web location for security/trust files
- Generated: No (manually managed)
- Committed: Yes
- Contains: Security policy files (certificates, etc.)

---

_Structure analysis: 2026-03-16_
