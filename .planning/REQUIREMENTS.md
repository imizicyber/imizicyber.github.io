# Requirements: Imizi Cyber Website

**Defined:** 2026-03-16
**Core Value:** A decision-maker at a Rwandan bank lands on this site and immediately trusts Imizi Cyber enough to book a consultation.

## v1 Requirements

### Code Quality

- [x] **QUAL-01**: Theme toggle works correctly in both dark and light mode with localStorage persistence
- [x] **QUAL-02**: ESLint 9 with flat config and eslint-plugin-astro enforces consistent code style
- [x] **QUAL-03**: Prettier formats all files consistently on save and pre-commit
- [x] **QUAL-04**: TypeScript strict mode enabled with no implicit any
- [x] **QUAL-05**: Husky pre-commit hooks run linting and type checking before every commit
- [x] **QUAL-06**: Vitest test framework configured with coverage reporting
- [x] **QUAL-07**: Playwright end-to-end tests cover critical user journeys (homepage, contact form, blog, quiz)
- [x] **QUAL-08**: All inline scripts extracted to external files or Astro script modules
- [x] **QUAL-09**: CSP header uses hashes or nonces instead of unsafe-inline for scripts
- [x] **QUAL-10**: innerHTML usage in security score quiz replaced with safe DOM API methods
- [x] **QUAL-11**: No sensitive data (API keys, tokens, passwords) committed to repository
- [x] **QUAL-12**: Axe-core accessibility testing integrated into Playwright tests

### UI/UX Design

- [x] **UIUX-01**: Premium boutique visual redesign with world-class aesthetic competing with global cybersecurity firms
- [x] **UIUX-02**: "Book a Consultation" CTA visible above the fold on every page
- [x] **UIUX-03**: Responsive layout renders correctly on mobile phones, tablets, and desktops
- [x] **UIUX-04**: LCP under 2.5 seconds on simulated 3G connection
- [x] **UIUX-05**: All images use Astro Image component with WebP format and lazy loading
- [x] **UIUX-06**: Fonts optimized for performance (preload, font-display swap, evaluate self-hosting)
- [x] **UIUX-07**: Contact form shows clear loading, success, and error states with ARIA attributes
- [x] **UIUX-08**: Skip link, keyboard navigation, and screen reader support on all pages
- [x] **UIUX-09**: Decorative CSS gradients disabled or simplified on mobile viewports
- [x] **UIUX-10**: Core Web Vitals pass Google PageSpeed Insights for mobile

### Trust & Credibility

- [x] **TRST-01**: Dedicated founder page at /about/ with professional bio, certifications (OSCP, OSCP+), experience history, and BlackHat Europe Arsenal reference
- [x] **TRST-02**: Founder credentials prominently visible on homepage before services section
- [x] **TRST-03**: At least 2 anonymised case studies with attack narratives from real past engagements
- [x] **TRST-04**: Case studies formatted as: anonymous client description, engagement type, findings, business impact, recommendation
- [x] **TRST-05**: Service pages include specific BNR directive numbers and compliance mapping
- [x] **TRST-06**: PCI DSS, ISO 27001, and Rwanda Data Protection Law explicitly referenced on relevant service pages

### Services & Content

- [x] **SRVC-01**: Penetration Testing service page updated with detailed methodology, deliverables, and compliance alignment
- [x] **SRVC-02**: Security Assessments service page created or updated as flagship offering
- [x] **SRVC-03**: Custom Tooling service page created or updated as flagship offering
- [x] **SRVC-04**: Security Training repositioned as secondary offering (not removed)
- [x] **SRVC-05**: All existing blog posts audited for quality, accuracy, SEO value, and human-like writing style
- [x] **SRVC-06**: Blog posts link to each other and to relevant service pages (internal linking audit)
- [x] **SRVC-07**: Blog tag/category system implemented with tag-based filtering on blog index
- [x] **SRVC-08**: Related posts feature on each blog post based on shared tags
- [x] **SRVC-09**: At least 3 new SEO-optimized blog articles targeting Rwanda/East Africa cybersecurity keywords
- [x] **SRVC-10**: Read time displayed on blog index and blog post pages
- [x] **SRVC-11**: USSD/mobile money security testing content added (Africa-specific topic)

### Analytics & Tracking

- [x] **ANLT-01**: GA4 custom event fires on contact form submission
- [x] **ANLT-02**: GA4 custom event fires on WhatsApp button click
- [x] **ANLT-03**: GA4 custom event fires on resource/lead magnet download
- [x] **ANLT-04**: GA4 custom event fires on CTA button clicks
- [x] **ANLT-05**: Google Search Console verification meta tag or DNS record configured
- [x] **ANLT-06**: LinkedIn Insight Tag loads behind cookie consent (same pattern as GA4)
- [x] **ANLT-07**: All tracking scripts fire only after user accepts cookies
- [x] **ANLT-08**: Conversion tracking verified end-to-end in GA4 real-time reports

### Lead Generation

- [x] **LEAD-01**: WhatsApp pre-filled messages configured on all service pages with service-specific text
- [x] **LEAD-02**: WhatsApp clicks tracked in GA4 for attribution
- [x] **LEAD-03**: Resource downloads tracked in GA4 with document name
- [x] **LEAD-04**: Security score quiz refactored to use safe DOM methods (no innerHTML)
- [x] **LEAD-05**: Security score quiz completion fires GA4 conversion event
- [x] **LEAD-06**: Security score quiz PDF generation works reliably without external CDN dependency (bundle jsPDF locally)
- [x] **LEAD-07**: Email follow-up sequence triggered after resource download (Formspree or Brevo integration)
- [x] **LEAD-08**: Quiz prominently linked from homepage and navigation

## v2 Requirements

### Internationalization

- **I18N-01**: French language support for Francophone African market expansion
- **I18N-02**: Kinyarwanda for consumer-facing content

### Advanced Lead Generation

- **ADVL-01**: Additional lead magnets (3+ more gated resources)
- **ADVL-02**: A/B testing on CTA copy and placement
- **ADVL-03**: LinkedIn retargeting campaigns using Insight Tag data

### Content Expansion

- **CONT-01**: Monthly blog publishing cadence with editorial calendar
- **CONT-02**: Video content or webinar recordings
- **CONT-03**: Industry report or annual Rwanda cybersecurity landscape

## Out of Scope

| Feature                            | Reason                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| Live chat widget (Crisp, Intercom) | WhatsApp float serves this purpose better for East Africa; chat widgets add 60-200kb JS |
| Client portal or login system      | Static site on GitHub Pages; consulting delivered via encrypted email                   |
| Booking widget (Calendly)          | Enterprise CISOs call, not self-schedule; form + WhatsApp is the right model            |
| Blog comments                      | Requires moderation, creates reputational exposure; CTA to WhatsApp instead             |
| Popups or exit-intent overlays     | Enterprise buyers are allergic to popups; undermines trust positioning                  |
| Auto-playing video                 | Heavy on metered African connections; CSS terminal animation is sufficient              |
| E-commerce or payments             | Consulting sold through proposals, not checkout; adds PCI scope                         |
| Multi-language (v1)                | English is procurement language for regulated enterprises in Rwanda                     |

## Traceability

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| QUAL-01     | Phase 1 | Complete |
| QUAL-02     | Phase 1 | Complete |
| QUAL-03     | Phase 1 | Complete |
| QUAL-04     | Phase 1 | Complete |
| QUAL-05     | Phase 1 | Complete |
| QUAL-06     | Phase 1 | Complete |
| QUAL-08     | Phase 1 | Complete |
| QUAL-07     | Phase 2 | Complete |
| QUAL-09     | Phase 2 | Complete |
| QUAL-10     | Phase 2 | Pending  |
| QUAL-11     | Phase 2 | Complete |
| QUAL-12     | Phase 2 | Complete |
| UIUX-01     | Phase 3 | Complete |
| UIUX-02     | Phase 3 | Complete |
| UIUX-03     | Phase 3 | Complete |
| UIUX-04     | Phase 4 | Complete |
| UIUX-05     | Phase 4 | Complete |
| UIUX-06     | Phase 4 | Complete |
| UIUX-07     | Phase 4 | Complete |
| UIUX-08     | Phase 4 | Complete |
| UIUX-09     | Phase 4 | Complete |
| UIUX-10     | Phase 4 | Complete |
| ANLT-01     | Phase 5 | Complete |
| ANLT-02     | Phase 5 | Complete |
| ANLT-03     | Phase 5 | Complete |
| ANLT-04     | Phase 5 | Complete |
| ANLT-05     | Phase 5 | Complete |
| ANLT-06     | Phase 5 | Complete |
| ANLT-07     | Phase 5 | Complete |
| ANLT-08     | Phase 5 | Complete |
| TRST-01     | Phase 6 | Complete |
| TRST-02     | Phase 6 | Complete |
| TRST-03     | Phase 6 | Complete |
| TRST-04     | Phase 6 | Complete |
| TRST-05     | Phase 6 | Complete |
| TRST-06     | Phase 6 | Complete |
| SRVC-01     | Phase 7 | Complete |
| SRVC-02     | Phase 7 | Complete |
| SRVC-03     | Phase 7 | Complete |
| SRVC-04     | Phase 7 | Complete |
| SRVC-05     | Phase 7 | Complete |
| SRVC-06     | Phase 7 | Complete |
| SRVC-07     | Phase 8 | Complete |
| SRVC-08     | Phase 8 | Complete |
| SRVC-09     | Phase 8 | Complete |
| SRVC-10     | Phase 8 | Complete |
| SRVC-11     | Phase 8 | Complete |
| LEAD-01     | Phase 9 | Complete |
| LEAD-02     | Phase 9 | Complete |
| LEAD-03     | Phase 9 | Complete |
| LEAD-04     | Phase 9 | Complete |
| LEAD-05     | Phase 9 | Complete |
| LEAD-06     | Phase 9 | Complete |
| LEAD-07     | Phase 9 | Complete |
| LEAD-08     | Phase 9 | Complete |

**Coverage:**

- v1 requirements: 55 total (note: REQUIREMENTS.md initially stated 48; actual count from defined IDs is 55)
- Mapped to phases: 55
- Unmapped: 0

---

_Requirements defined: 2026-03-16_
_Last updated: 2026-03-16 — traceability populated after roadmap creation_
