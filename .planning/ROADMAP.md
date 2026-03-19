# Roadmap: Imizi Cyber Website

## Overview

This roadmap transforms the existing Astro SSG from a functional but rough-edged foundation into a world-class boutique cybersecurity website that converts enterprise buyers into consultation bookings. The work is ordered strictly by dependency: code quality must come before refactoring, tests before security hardening, stable components before new content, and analytics before measuring conversion impact. Nine phases deliver progressively more visible results — from invisible but critical tooling to content and lead generation that enterprise decision-makers directly experience.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Code Quality Tooling** - Establish linting, type checking, formatting, and test infrastructure as the non-negotiable foundation for safe refactoring
- [ ] **Phase 2: Security Hardening and Test Coverage** - Eliminate XSS risks, enforce CSP without unsafe-inline, add E2E and accessibility tests, audit the repository for secrets
- [x] **Phase 3: Component Architecture and Visual Redesign** - Decompose monolithic page files into named section components and ship the premium boutique visual identity (completed 2026-03-17)
- [ ] **Phase 4: Performance and Accessibility** - Achieve LCP under 2.5 seconds on 3G, pass Core Web Vitals, and make every page fully accessible
- [x] **Phase 5: Analytics and Conversion Tracking** - Wire GA4 conversion events, LinkedIn Insight Tag, and Google Search Console entirely behind the consent gate (completed 2026-03-18)
- [x] **Phase 6: Trust and Founder Credibility** - Surface founder authority above the fold and add anonymised case studies that answer "have they done this before?" (completed 2026-03-18)
- [x] **Phase 7: Service Pages and Content Quality** - Rebuild service pages with compliance mapping, methodology depth, and a complete internal link audit (completed 2026-03-18)
- [x] **Phase 8: Blog System and New Content** - Add tag filtering, related posts, read time, and publish SEO-targeted articles for Rwanda and East Africa (completed 2026-03-18)
- [x] **Phase 9: Lead Generation Funnel** - Complete the conversion path: pre-filled WhatsApp, quiz refactor, resource tracking, and email follow-up (completed 2026-03-18)
- [x] **Phase 10: Functionality Fixes** - Fix broken tag filter, missing quiz nav link, OG image format, and blog article tags (completed 2026-03-18)
- [x] **Phase 11: Navigation and Quality Completion** - Fix broken breadcrumbs, add /about/ nav link, extract remaining inline scripts, and complete E2E coverage (completed 2026-03-18)

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
   **Plans:** 3/3 plans complete

Plans:

- [x] 01-01-PLAN.md — Install toolchain and configure ESLint, Prettier, Vitest, path alias
- [x] 01-02-PLAN.md — Extract all inline scripts to typed modules, fix theme toggle
- [x] 01-03-PLAN.md — Write unit tests, fix all violations, wire pre-commit hook

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
   **Plans:** 3 plans

Plans:

- [x] 02-01-PLAN.md — Eliminate innerHTML from quiz UI, add ESLint ban rule
- [ ] 02-02-PLAN.md — Enable Astro CSP (no unsafe-inline), run gitleaks secret scan, add pre-commit hook
- [ ] 02-03-PLAN.md — Install Playwright with axe-core, write E2E tests, create CI workflow

### Phase 3: Component Architecture and Visual Redesign

**Goal**: The homepage and key pages use a composable section component library, and the site presents a premium boutique visual identity that competes with global cybersecurity firms
**Depends on**: Phase 2
**Requirements**: UIUX-01, UIUX-02, UIUX-03
**Success Criteria** (what must be TRUE):

1. A visitor landing on the homepage immediately perceives a premium, professional aesthetic — no template-feel, consistent typography and spacing
2. "Book a Consultation" CTA button is visible above the fold on every page without scrolling, on all screen sizes
3. Site renders correctly on a 375px wide mobile phone, a 768px tablet, and a 1440px desktop without layout breakage
4. `index.astro` delegates to named section components (HeroSection, ServicesSection, CredentialsSection, etc.) rather than containing all markup inline
   **Plans:** 4/4 plans complete

Plans:

- [x] 03-01-PLAN.md — Design system foundation: CSS tokens, credentials data, Nav CTA, E2E test stubs
- [x] 03-02-PLAN.md — Extract first 5 section components (Hero, Trust, Credentials, WhyUs, Services)
- [x] 03-03-PLAN.md — Extract remaining 5 sections (Process, Blog, FAQ, CTA, Contact), finalize index.astro
- [x] 03-04-PLAN.md — Visual polish, font optimization, responsive verification, human checkpoint

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
   **Plans:** 2/3 plans executed

Plans:

- [ ] 04-01-PLAN.md — Self-host fonts, optimize OG image, evaluate mobile gradients
- [ ] 04-02-PLAN.md — ARIA landmarks, keyboard navigation, contact form accessible states
- [ ] 04-03-PLAN.md — E2E tests for performance and accessibility verification

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
   **Plans:** 2/2 plans complete

Plans:

- [ ] 05-01-PLAN.md — Analytics infrastructure: trackEvent helper, LinkedIn Insight Tag loader, CSP updates
- [ ] 05-02-PLAN.md — Wire GA4 events into conversion touchpoints, E2E consent and persistence tests

### Phase 6: Trust and Founder Credibility

**Goal**: A decision-maker visiting the site can immediately see who is behind Imizi Cyber, what they have done, and find evidence from real past engagements — eliminating the "who is this?" trust barrier before the first consultation request
**Depends on**: Phase 5
**Requirements**: TRST-01, TRST-02, TRST-03, TRST-04, TRST-05, TRST-06
**Success Criteria** (what must be TRUE):

1. The homepage hero or immediately below it shows the founder's name, photo, and at least OSCP, OSCP+, and BlackHat Europe Arsenal credentials without scrolling
2. `/about/` page exists as a standalone URL with full professional bio, certifications, career history, and academic background
3. At least 2 anonymised case study pages exist, each formatted with client description, engagement type, findings, business impact, and recommendation
4. Service pages reference specific BNR directive numbers and explicitly name PCI DSS, ISO 27001, and Rwanda Data Protection Law in compliance context
   **Plans:** 3/3 plans complete

Plans:

- [ ] 06-01-PLAN.md — Founder data module, homepage credentials update, /about/ page
- [ ] 06-02-PLAN.md — Two anonymised case study pages (bank pentest, mobile money assessment)
- [ ] 06-03-PLAN.md — BNR directive numbers and compliance mapping on all service pages

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
   **Plans:** 3/3 plans complete

Plans:

- [ ] 07-01-PLAN.md — Create Security Assessments and Custom Tooling service pages, update homepage services grid
- [ ] 07-02-PLAN.md — Add deliverables section to pentest page, reposition training as secondary
- [ ] 07-03-PLAN.md — Blog content audit and internal linking (all 16 posts)

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
   **Plans:** 3/3 plans complete

Plans:

- [ ] 08-01-PLAN.md — Add tags to schema and all posts, tag filtering on blog index, related posts component
- [ ] 08-02-PLAN.md — Write 3 new SEO-targeted blog articles (Kigali pentest, BNR compliance, cloud security)
- [ ] 08-03-PLAN.md — Link USSD/mobile money from services navigation, full phase verification

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
   **Plans:** 3/3 plans complete

Plans:

- [ ] 09-01-PLAN.md — Bundle jsPDF locally, wire GA4 events for quiz completion and resource downloads
- [ ] 09-02-PLAN.md — WhatsApp service-specific messages, quiz links in nav/homepage, inline WhatsApp tracking
- [ ] 09-03-PLAN.md — Formspree auto-responder configuration and full phase verification

### Phase 10: Functionality Fixes

**Goal**: All broken functionality identified in the milestone audit works correctly — tag filtering, quiz navigation, OG image format, and blog tag metadata
**Depends on**: Phase 9
**Requirements**: SRVC-07, LEAD-08, UIUX-05, SRVC-09
**Gap Closure:** Closes gaps from v1.0 milestone audit
**Success Criteria** (what must be TRUE):

1. Clicking a tag filter button on the blog index page filters visible posts by that tag
2. The "Free Cyber Score" quiz link appears in the navigation on all pages, not just the homepage
3. The OG image is served as WebP (not PNG) via Astro's `getImage()` API
4. All 3 new blog articles have a `tags:` field in frontmatter and appear in tag filter results
5. The schema.org structured data references a valid OG image path (not a 404)

Plans:

- [ ] 10-01-PLAN.md — Fix tag filter event, quiz nav default, OG image format, blog article tags

### Phase 11: Navigation and Quality Completion

**Goal**: All navigation dead-ends are resolved, remaining inline scripts are extracted, and E2E test coverage gaps are filled
**Depends on**: Phase 10
**Requirements**: QUAL-08, QUAL-07
**Gap Closure:** Closes gaps from v1.0 milestone audit
**Success Criteria** (what must be TRUE):

1. Case study breadcrumb "Case Studies" link navigates to a valid page (no 404)
2. The `/about/` page is reachable from the main navigation or footer
3. All inline scripts are extracted to external files or Astro script modules (0 remaining `is:inline`)
4. E2E tests cover contact form submission flow and Free Score CTA nav link assertion
5. Orphaned exports (`loadJsPDF`, `CASE_STUDIES`) are removed

**Plans:** 2/2 plans complete

Plans:

- [ ] 11-01-PLAN.md — Create case studies index page, update Nav/Footer links, extract ContactForm define:vars script, remove loadJsPDF, add FOUC guard comment
- [ ] 11-02-PLAN.md — Add E2E tests for new navigation paths, verify existing tests pass

## v2 Phases (Future)

### Phase 12: Full-Site Playwright Testing

**Goal**: Every page and interactive element has comprehensive E2E test coverage — responsive breakpoints, accessibility, performance budgets, and critical user flows are all automated
**Depends on**: Phase 11
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04, TEST-05
**Milestone:** v2
**Success Criteria** (what must be TRUE):

1. Playwright E2E tests exist for every page route (homepage, blog index, blog posts, all service pages, tools, about, case studies, company-profile, resources, privacy, responsible-disclosure)
2. All interactive elements tested: contact form submission, tag filtering, quiz completion, theme toggle, cookie consent flow, WhatsApp links, nav hamburger menu
3. Responsive tests pass at 375px, 768px, 1024px, and 1440px for all pages without layout breakage
4. axe-core accessibility scans report zero critical/serious violations on all tested pages
5. Lighthouse CI performance budgets enforce LCP < 2.5s, CLS < 0.1, FID < 100ms

**Plans:** 1/3 plans executed

Plans:

- [ ] 12-01-PLAN.md — Create page-routes and interactions spec files for route smoke tests and interactive element tests
- [ ] 12-02-PLAN.md — Extend responsive, accessibility, and performance specs with 4-breakpoint, all-page axe, and CWV coverage
- [ ] 12-03-PLAN.md — Set up Lighthouse CI infrastructure with lighthouserc.json, GitHub Actions workflow, and @lhci/cli

### Phase 13: Apple/Google-Level UI/UX Audit

**Goal**: The site's visual quality, interaction design, and attention to detail compete with world-class cybersecurity firms — every hover state, transition, and spacing decision feels intentional and premium
**Depends on**: Phase 12
**Requirements**: UIUX-20, UIUX-21, UIUX-22, UIUX-23, UIUX-24
**Milestone:** v2
**Success Criteria** (what must be TRUE):

1. Professional UI/UX audit completed against top-tier cybersecurity firm benchmarks with specific findings addressed
2. All interactive elements have polished micro-interactions (hover states, focus rings, transitions, loading feedback)
3. Typography scale and spacing system refined with consistent visual hierarchy across all pages
4. Dark and light modes both feel equally premium — no "afterthought" theme
5. Mobile UX passes review for touch-target sizing (44px min), gesture patterns, and Rwanda mobile-first priorities

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13

| Phase                                         | Plans Complete | Status      | Completed  |
| --------------------------------------------- | -------------- | ----------- | ---------- |
| 1. Code Quality Tooling                       | 3/3            | Complete    | 2026-03-16 |
| 2. Security Hardening and Test Coverage       | 1/3            | In Progress | -          |
| 3. Component Architecture and Visual Redesign | 4/4            | Complete    | 2026-03-17 |
| 4. Performance and Accessibility              | 2/3            | In Progress |            |
| 5. Analytics and Conversion Tracking          | 0/2            | Complete    | 2026-03-18 |
| 6. Trust and Founder Credibility              | 0/3            | Complete    | 2026-03-18 |
| 7. Service Pages and Content Quality          | 3/3            | Complete    | 2026-03-18 |
| 8. Blog System and New Content                | 0/3            | Complete    | 2026-03-18 |
| 9. Lead Generation Funnel                     | 3/3            | Complete    | 2026-03-18 |
| 10. Functionality Fixes                       | 1/1            | Complete    | 2026-03-18 |
| 11. Navigation and Quality Completion         | 2/2            | Complete    | 2026-03-18 |
| 12. Full-Site Playwright Testing              | 1/3            | In Progress |            |
