# Requirements: Imizi Cyber Website

**Defined:** 2026-03-16
**Core Value:** A decision-maker at a Rwandan bank lands on this site and immediately trusts Imizi Cyber enough to book a consultation.

## v1 Requirements

### Code Quality

- [ ] **QUAL-01**: Theme toggle works correctly in both dark and light mode with localStorage persistence
- [ ] **QUAL-02**: ESLint 9 with flat config and eslint-plugin-astro enforces consistent code style
- [ ] **QUAL-03**: Prettier formats all files consistently on save and pre-commit
- [ ] **QUAL-04**: TypeScript strict mode enabled with no implicit any
- [ ] **QUAL-05**: Husky pre-commit hooks run linting and type checking before every commit
- [ ] **QUAL-06**: Vitest test framework configured with coverage reporting
- [ ] **QUAL-07**: Playwright end-to-end tests cover critical user journeys (homepage, contact form, blog, quiz)
- [ ] **QUAL-08**: All inline scripts extracted to external files or Astro script modules
- [ ] **QUAL-09**: CSP header uses hashes or nonces instead of unsafe-inline for scripts
- [ ] **QUAL-10**: innerHTML usage in security score quiz replaced with safe DOM API methods
- [ ] **QUAL-11**: No sensitive data (API keys, tokens, passwords) committed to repository
- [ ] **QUAL-12**: Axe-core accessibility testing integrated into Playwright tests

### UI/UX Design

- [ ] **UIUX-01**: Premium boutique visual redesign with world-class aesthetic competing with global cybersecurity firms
- [ ] **UIUX-02**: "Book a Consultation" CTA visible above the fold on every page
- [ ] **UIUX-03**: Responsive layout renders correctly on mobile phones, tablets, and desktops
- [ ] **UIUX-04**: LCP under 2.5 seconds on simulated 3G connection
- [ ] **UIUX-05**: All images use Astro Image component with WebP format and lazy loading
- [ ] **UIUX-06**: Fonts optimized for performance (preload, font-display swap, evaluate self-hosting)
- [ ] **UIUX-07**: Contact form shows clear loading, success, and error states with ARIA attributes
- [ ] **UIUX-08**: Skip link, keyboard navigation, and screen reader support on all pages
- [ ] **UIUX-09**: Decorative CSS gradients disabled or simplified on mobile viewports
- [ ] **UIUX-10**: Core Web Vitals pass Google PageSpeed Insights for mobile

### Trust & Credibility

- [ ] **TRST-01**: Dedicated founder page at /about/ with professional bio, certifications (OSCP, OSCP+), experience history, and BlackHat Europe Arsenal reference
- [ ] **TRST-02**: Founder credentials prominently visible on homepage before services section
- [ ] **TRST-03**: At least 2 anonymised case studies with attack narratives from real past engagements
- [ ] **TRST-04**: Case studies formatted as: anonymous client description, engagement type, findings, business impact, recommendation
- [ ] **TRST-05**: Service pages include specific BNR directive numbers and compliance mapping
- [ ] **TRST-06**: PCI DSS, ISO 27001, and Rwanda Data Protection Law explicitly referenced on relevant service pages

### Services & Content

- [ ] **SRVC-01**: Penetration Testing service page updated with detailed methodology, deliverables, and compliance alignment
- [ ] **SRVC-02**: Security Assessments service page created or updated as flagship offering
- [ ] **SRVC-03**: Custom Tooling service page created or updated as flagship offering
- [ ] **SRVC-04**: Security Training repositioned as secondary offering (not removed)
- [ ] **SRVC-05**: All existing blog posts audited for quality, accuracy, SEO value, and human-like writing style
- [ ] **SRVC-06**: Blog posts link to each other and to relevant service pages (internal linking audit)
- [ ] **SRVC-07**: Blog tag/category system implemented with tag-based filtering on blog index
- [ ] **SRVC-08**: Related posts feature on each blog post based on shared tags
- [ ] **SRVC-09**: At least 3 new SEO-optimized blog articles targeting Rwanda/East Africa cybersecurity keywords
- [ ] **SRVC-10**: Read time displayed on blog index and blog post pages
- [ ] **SRVC-11**: USSD/mobile money security testing content added (Africa-specific topic)

### Analytics & Tracking

- [ ] **ANLT-01**: GA4 custom event fires on contact form submission
- [ ] **ANLT-02**: GA4 custom event fires on WhatsApp button click
- [ ] **ANLT-03**: GA4 custom event fires on resource/lead magnet download
- [ ] **ANLT-04**: GA4 custom event fires on CTA button clicks
- [ ] **ANLT-05**: Google Search Console verification meta tag or DNS record configured
- [ ] **ANLT-06**: LinkedIn Insight Tag loads behind cookie consent (same pattern as GA4)
- [ ] **ANLT-07**: All tracking scripts fire only after user accepts cookies
- [ ] **ANLT-08**: Conversion tracking verified end-to-end in GA4 real-time reports

### Lead Generation

- [ ] **LEAD-01**: WhatsApp pre-filled messages configured on all service pages with service-specific text
- [ ] **LEAD-02**: WhatsApp clicks tracked in GA4 for attribution
- [ ] **LEAD-03**: Resource downloads tracked in GA4 with document name
- [ ] **LEAD-04**: Security score quiz refactored to use safe DOM methods (no innerHTML)
- [ ] **LEAD-05**: Security score quiz completion fires GA4 conversion event
- [ ] **LEAD-06**: Security score quiz PDF generation works reliably without external CDN dependency (bundle jsPDF locally)
- [ ] **LEAD-07**: Email follow-up sequence triggered after resource download (Formspree or Brevo integration)
- [ ] **LEAD-08**: Quiz prominently linked from homepage and navigation

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

| Feature | Reason |
|---------|--------|
| Live chat widget (Crisp, Intercom) | WhatsApp float serves this purpose better for East Africa; chat widgets add 60-200kb JS |
| Client portal or login system | Static site on GitHub Pages; consulting delivered via encrypted email |
| Booking widget (Calendly) | Enterprise CISOs call, not self-schedule; form + WhatsApp is the right model |
| Blog comments | Requires moderation, creates reputational exposure; CTA to WhatsApp instead |
| Popups or exit-intent overlays | Enterprise buyers are allergic to popups; undermines trust positioning |
| Auto-playing video | Heavy on metered African connections; CSS terminal animation is sufficient |
| E-commerce or payments | Consulting sold through proposals, not checkout; adds PCI scope |
| Multi-language (v1) | English is procurement language for regulated enterprises in Rwanda |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| (To be populated during roadmap creation) | | |

**Coverage:**
- v1 requirements: 48 total
- Mapped to phases: 0
- Unmapped: 48

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 after initial definition*
