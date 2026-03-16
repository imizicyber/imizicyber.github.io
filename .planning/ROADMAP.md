# Roadmap: Imizi Cyber Website

## Overview

This roadmap transforms the existing Astro SSG from a functional but rough-edged foundation into a world-class boutique cybersecurity website that converts enterprise buyers into consultation bookings. The work is ordered strictly by dependency: code quality must come before refactoring, tests before security hardening, stable components before new content, and analytics before measuring conversion impact. Nine phases deliver progressively more visible results — from invisible but critical tooling to content and lead generation that enterprise decision-makers directly experience.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Code Quality Tooling** - Establish linting, type checking, formatting, and test infrastructure as the non-negotiable foundation for safe refactoring
- [ ] **Phase 2: Security Hardening and Test Coverage** - Eliminate XSS risks, enforce CSP without unsafe-inline, add E2E and accessibility tests, audit the repository for secrets
- [ ] **Phase 3: Component Architecture and Visual Redesign** - Decompose monolithic page files into named section components and ship the premium boutique visual identity
- [ ] **Phase 4: Performance and Accessibility** - Achieve LCP under 2.5 seconds on 3G, pass Core Web Vitals, and make every page fully accessible
- [ ] **Phase 5: Analytics and Conversion Tracking** - Wire GA4 conversion events, LinkedIn Insight Tag, and Google Search Console entirely behind the consent gate
- [ ] **Phase 6: Trust and Founder Credibility** - Surface founder authority above the fold and add anonymised case studies that answer "have they done this before?"
- [ ] **Phase 7: Service Pages and Content Quality** - Rebuild service pages with compliance mapping, methodology depth, and a complete internal link audit
- [ ] **Phase 8: Blog System and New Content** - Add tag filtering, related posts, read time, and publish SEO-targeted articles for Rwanda and East Africa
- [ ] **Phase 9: Lead Generation Funnel** - Complete the conversion path: pre-filled WhatsApp, quiz refactor, resource tracking, and email follow-up

## Phase Details

### Phase 1: Code Quality Tooling
**Goal**: The repository enforces consistent code quality automatically — every commit is linted, type-checked, and formatted before it reaches the public repo
**Depends on**: Nothing (first phase)
**Requirements**: QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06, QUAL-08
**Success Criteria** (what must be TRUE):
  1. Running `npm run lint` exits 0 with ESLint 9 flat config and eslint-plugin-astro catching real violations
  2. Running `npm run typecheck` exits 0 with TypeScript strict mode and zero implicit any errors
  3. Running `npm run test` executes the Vitest suite with coverage output
  4. Attempting to commit code with lint errors is blocked by husky pre-commit hook
  5. Dark and light theme toggle works correctly in browser with localStorage persistence across page loads
**Plans:** 3 plans

Plans:
- [ ] 01-01-PLAN.md — Install toolchain and configure ESLint, Prettier, Vitest, path alias
- [ ] 01-02-PLAN.md — Extract all inline scripts to typed modules, fix theme toggle
- [ ] 01-03-PLAN.md — Write unit tests, fix all violations, wire pre-commit hook

### Phase 2: Security Hardening and Test Coverage
**Goal**: The public codebase passes scrutiny from a technical evaluator at a regulated enterprise — no XSS risks, no unsafe-inline CSP, no secrets, tests covering critical paths
**Depends on**: Phase 1
**Requirements**: QUAL-07, QUAL-09, QUAL-10, QUAL-11, QUAL-12
**Success Criteria** (what must be TRUE):
  1. Playwright E2E tests run against the built site covering homepage load, contact form submission, blog navigation, and quiz completion
  2. CSP header on the live site contains no unsafe-inline for scripts
  3. Security score quiz works without innerHTML — all DOM manipulation uses safe API methods
  4. `git log` and `git grep` reveal no API keys, tokens, or Formspree endpoint secrets in repository history
  5. axe-core accessibility scan embedded in Playwright tests reports zero critical violations on all tested pages
**Plans**: TBD

### Phase 3: Component Architecture and Visual Redesign
**Goal**: The homepage and key pages use a composable section component library, and the site presents a premium boutique visual identity that competes with global cybersecurity firms
**Depends on**: Phase 2
**Requirements**: UIUX-01, UIUX-02, UIUX-03
**Success Criteria** (what must be TRUE):
  1. A visitor landing on the homepage immediately perceives a premium, professional aesthetic — no template-feel, consistent typography and spacing
  2. "Book a Consultation" CTA button is visible above the fold on every page without scrolling, on all screen sizes
  3. Site renders correctly on a 375px wide mobile phone, a 768px tablet, and a 1440px desktop without layout breakage
  4. `index.astro` delegates to named section components (HeroSection, ServicesSection, CredentialsSection, etc.) rather than containing all markup inline
**Plans**: TBD

### Phase 4: Performance and Accessibility
**Goal**: The site loads fast enough on an MTN Rwanda mobile connection that a decision-maker does not bounce, and is usable by visitors using keyboard navigation or screen readers
**Depends on**: Phase 3
**Requirements**: UIUX-04, UIUX-05, UIUX-06, UIUX-07, UIUX-08, UIUX-09, UIUX-10
**Success Criteria** (what must be TRUE):
  1. Google PageSpeed Insights mobile score is 90+ and Core Web Vitals all pass (green)
  2. LCP measured at simulated Slow 4G throttling is under 2.5 seconds
  3. All images on the site are served as WebP via the Astro Image component with lazy loading
  4. Contact form displays distinct loading, success, and error states — a user who submits the form always knows what happened
  5. A keyboard-only user can navigate to and activate all interactive elements; a screen reader user hears meaningful labels on all controls
**Plans**: TBD

### Phase 5: Analytics and Conversion Tracking
**Goal**: Every meaningful conversion action is tracked in GA4, fires only after explicit cookie consent, and measurement infrastructure is verified by automated tests before any data is trusted
**Depends on**: Phase 4
**Requirements**: ANLT-01, ANLT-02, ANLT-03, ANLT-04, ANLT-05, ANLT-06, ANLT-07, ANLT-08
**Success Criteria** (what must be TRUE):
  1. GA4 real-time reports show distinct custom events for contact form submission, WhatsApp click, resource download, and CTA click
  2. Opening the site in a fresh browser with cookies rejected produces zero GA4 or LinkedIn network requests (verified in DevTools)
  3. Accepting cookies in the consent banner triggers GA4 and LinkedIn Insight Tag to load within the same session
  4. Google Search Console shows the site as verified and the sitemap as submitted and indexed
  5. A Playwright test confirms no analytics script fires before the consent banner is acknowledged
**Plans**: TBD

### Phase 6: Trust and Founder Credibility
**Goal**: A decision-maker visiting the site can immediately see who is behind Imizi Cyber, what they have done, and find evidence from real past engagements — eliminating the "who is this?" trust barrier before the first consultation request
**Depends on**: Phase 5
**Requirements**: TRST-01, TRST-02, TRST-03, TRST-04, TRST-05, TRST-06
**Success Criteria** (what must be TRUE):
  1. The homepage hero or immediately below it shows the founder's name, photo, and at least OSCP, OSCP+, and BlackHat Europe Arsenal credentials without scrolling
  2. `/about/` page exists as a standalone URL with full professional bio, certifications, career history, and academic background
  3. At least 2 anonymised case study pages exist, each formatted with client description, engagement type, findings, business impact, and recommendation
  4. Service pages reference specific BNR directive numbers and explicitly name PCI DSS, ISO 27001, and Rwanda Data Protection Law in compliance context
**Plans**: TBD

### Phase 7: Service Pages and Content Quality
**Goal**: Each flagship service page gives a technically literate buyer enough detail to evaluate methodology and compliance alignment, and every blog post links cohesively into the rest of the site
**Depends on**: Phase 6
**Requirements**: SRVC-01, SRVC-02, SRVC-03, SRVC-04, SRVC-05, SRVC-06
**Success Criteria** (what must be TRUE):
  1. Penetration Testing page describes the engagement methodology end-to-end, lists deliverables, and maps to at least one compliance framework
  2. Security Assessments and Custom Tooling each have dedicated service pages with comparable depth to the Penetration Testing page
  3. Security Training is present on the site but clearly positioned as a secondary offering, not a flagship
  4. All existing blog posts have been reviewed — posts with low quality or SEO value have been updated or removed
  5. Every blog post links to at least one related service page and at least one other blog post
**Plans**: TBD

### Phase 8: Blog System and New Content
**Goal**: The blog has a navigable structure with tag-based filtering, related posts, and read time — and new articles targeting Rwanda and East Africa cybersecurity keywords are live and indexed
**Depends on**: Phase 7
**Requirements**: SRVC-07, SRVC-08, SRVC-09, SRVC-10, SRVC-11
**Success Criteria** (what must be TRUE):
  1. Blog index page shows tag filters a visitor can click to narrow posts by category
  2. Each blog post page shows a related posts section based on shared tags
  3. Read time estimate is visible on the blog index card and at the top of each post
  4. At least 3 new blog articles are live targeting geo-modified keywords (e.g., "penetration testing Kigali," "BNR cybersecurity compliance Rwanda")
  5. A page or blog article covering USSD and mobile money security testing exists and is linked from the services navigation
**Plans**: TBD

### Phase 9: Lead Generation Funnel
**Goal**: Every conversion path on the site — WhatsApp, quiz, resource download, email follow-up — is fully wired, tracked, and free of technical debt that could silently drop leads
**Depends on**: Phase 8
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, LEAD-06, LEAD-07, LEAD-08
**Success Criteria** (what must be TRUE):
  1. WhatsApp button on each service page opens a pre-filled message specific to that service (not a generic greeting)
  2. Security score quiz completes and generates a PDF without any external CDN dependency — jsPDF is bundled locally
  3. Completing the quiz fires a GA4 conversion event visible in real-time reports
  4. Downloading a resource triggers a GA4 event that includes the document name as an event parameter
  5. After submitting a download form, the visitor receives a follow-up email (Formspree or Brevo integration confirmed working)
  6. The quiz is prominently linked from the homepage and from the main navigation
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Code Quality Tooling | 0/3 | Planning complete | - |
| 2. Security Hardening and Test Coverage | 0/TBD | Not started | - |
| 3. Component Architecture and Visual Redesign | 0/TBD | Not started | - |
| 4. Performance and Accessibility | 0/TBD | Not started | - |
| 5. Analytics and Conversion Tracking | 0/TBD | Not started | - |
| 6. Trust and Founder Credibility | 0/TBD | Not started | - |
| 7. Service Pages and Content Quality | 0/TBD | Not started | - |
| 8. Blog System and New Content | 0/TBD | Not started | - |
| 9. Lead Generation Funnel | 0/TBD | Not started | - |
