# External Integrations

**Analysis Date:** 2026-03-16

## APIs & External Services

**Form Submission:**
- Formspree - Email form submission service for contact inquiries
  - SDK/Client: Fetch API (browser-native, no package dependency)
  - Service ID: `mjgerrlv` (stored in `ANALYTICS.formspreeUrl`)
  - Endpoint: `https://formspree.io/f/mjgerrlv`
  - Used by: `src/components/ContactForm.astro` - contact form at `/contact` or via consultation request blocks

**Analytics:**
- Google Analytics (GA4) - Website traffic and user behavior tracking
  - Tracking ID: `G-R7TC88KH9N` (stored in `ANALYTICS.gaId`)
  - Script source: `https://www.googletagmanager.com/gtag/js?id={gaId}`
  - Consent-based: Yes - loaded only after user accepts cookies via `CookieBanner` component
  - Implementation: `src/components/CookieBanner.astro` - handles cookie consent and GA initialization

**Messaging:**
- WhatsApp - Direct messaging contact channel
  - Link: `https://wa.me/250793146617?text=Hi%20imizicyber%2C%20I%27d%20like%20to%20discuss%20security%20services`
  - Used by: `src/components/WhatsAppFloat.astro` (floating button), footer, and contact form fallback
  - Data: Phone number `+250 793 146 617` stored in `src/data/site.ts`

## Data Storage

**Databases:**
- Not detected - Static site with no persistent database

**File Storage:**
- Local filesystem only - Static assets in `public/` directory
- Build output: `dist/` directory with compiled HTML, CSS, and assets

**Content Storage:**
- File-based: Markdown/MDX blog posts in `src/content/blog/` directory
- Schema validation via Astro Content Collections with Zod (`src/content.config.ts`)
- Blog frontmatter structure: title, headline, description, keywords, dates, SEO metadata, FAQ data

**Caching:**
- Not applicable - Static site generator; caching handled by CDN/browser

## Authentication & Identity

**Auth Provider:**
- Not detected - No user authentication system
- Site is public with no login or user management

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service configured (Sentry, Rollbar, etc.)

**Logs:**
- Browser console only - Client-side logging via `console` API if implemented
- No server-side logging (static site with no server)
- Astro build logs available in GitHub Actions workflow output

## CI/CD & Deployment

**Hosting:**
- GitHub Pages - Primary hosting platform for the static site
- Domain: `imizicyber.com` (configured in `astro.config.mjs`)
- Repository: public GitHub repository

**CI Pipeline:**
- GitHub Actions workflow defined in `.github/workflows/deploy.yml`
- Trigger: Automatic deployment on push to `main` branch or manual workflow dispatch
- Build steps:
  1. Checkout code (actions/checkout@v4)
  2. Setup Node.js 22 (from `.nvmrc`)
  3. Install dependencies via `npm ci`
  4. Build Astro site via `npm run build`
  5. Upload `dist/` artifact
  6. Deploy to GitHub Pages via `actions/deploy-pages@v4`
- Permissions: read contents, write pages, write id-token (for OIDC authentication)
- Concurrency: Single deployment at a time (cancel_in_progress: false)

## Environment Configuration

**Required env vars:**
- None detected - All configuration stored in source files

**Secrets location:**
- No secrets management system detected
- All API IDs stored as constants in `src/data/site.ts`
- Formspree handles CORS and form processing without additional authentication

## Webhooks & Callbacks

**Incoming:**
- Formspree webhook - Form submissions sent to `info@imizicyber.com` automatically (handled by Formspree)
- GitHub Pages automatic deployment trigger on push

**Outgoing:**
- None detected - Static site does not initiate outbound webhooks

## CDN & Performance

**Content Delivery:**
- GitHub Pages CDN - Provides edge caching and distribution
- Static assets served with default GitHub Pages headers

---

*Integration audit: 2026-03-16*
