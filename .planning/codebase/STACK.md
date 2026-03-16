# Technology Stack

**Analysis Date:** 2026-03-16

## Languages

**Primary:**

- TypeScript - Used for type-safe component and configuration files
- HTML/Astro - Page and component templates (`.astro` files)
- CSS - Stylesheet organization and theming

**Secondary:**

- JavaScript - Inline scripts in components for interactivity (event handling, form submission)

## Runtime

**Environment:**

- Node.js 22 (specified in `.nvmrc`)

**Package Manager:**

- npm (version from package-lock.json)
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**

- Astro 6.0.4 - Static site generator and framework for building the site
- @astrojs/mdx 5.0.0 - MDX integration for blog content in Markdown with embedded components
- @astrojs/sitemap 3.7.1 - Automated XML sitemap generation for SEO

**Build/Dev:**

- Astro build tooling (included with Astro core) - Building and development server
- Zod (present in dependencies) - Runtime schema validation for content collections

## Key Dependencies

**Critical:**

- astro 6.0.4 - Core framework, provides SSR, build system, and component architecture
- @astrojs/mdx 5.0.0 - Enables blog content to be written in MDX format with full Astro component support
- @astrojs/sitemap 3.7.1 - Required for SEO; generates sitemap with filtering rules

**Infrastructure:**

- zod - Schema validation for blog collection frontmatter (used in `src/content.config.ts`)

## Configuration

**Environment:**

- No environment variables detected for core functionality
- Site configuration stored in `src/data/site.ts` with hardcoded values:
  - Site URL, locale, region information
  - Analytics tracking ID
  - Contact information (email, phone, WhatsApp URL)
  - Formspree form submission ID

**Build:**

- `astro.config.mjs` - Main Astro configuration file located at root
  - Output: static (SSG - no server-side rendering)
  - Build format: directory-based (trailing slashes enabled)
  - Integrations: sitemap (with filtering for company-profile route) and MDX
  - Site domain: `https://imizicyber.com`
- `tsconfig.json` - TypeScript configuration extending Astro's strict config

## Platform Requirements

**Development:**

- Node.js 22 or compatible (as specified in `.nvmrc`)
- npm with lockfile support
- Supports macOS/Linux/Windows (GitHub Actions uses ubuntu-latest)

**Production:**

- Deployment: GitHub Pages
- Hosting: Static content via GitHub Pages with automatic deployment on main branch pushes
- Build output directory: `dist/` (generated during build step)

---

_Stack analysis: 2026-03-16_
