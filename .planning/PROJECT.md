# Imizi Cyber — Company Website

## What This Is

The public-facing website for Imizi Cyber, a premium boutique cybersecurity firm offering offensive security services to large regulated organizations in Rwanda, East Africa, and beyond. This site is the firm's primary sales engine — designed to establish founder authority, attract organic traffic through expert content, and convert visitors into booked consultations. It must project world-class quality to compete with global firms while speaking directly to the regulated enterprise market.

## Core Value

A decision-maker at a Rwandan bank lands on this site and immediately trusts Imizi Cyber enough to book a consultation — the design, content, and credibility signals leave no doubt this is the right firm.

## Requirements

### Validated

- ✓ Static site built with Astro SSG — existing
- ✓ Blog system with MDX content collections and schema validation — existing
- ✓ Schema.org structured data (Organization, BlogPosting, FAQ, BreadcrumbList) — existing
- ✓ Contact form via Formspree integration — existing
- ✓ Cookie consent banner — existing
- ✓ Dark/light theme toggle — existing (partial — toggle function may be broken)
- ✓ SEO head component with OG tags, canonical URLs, geo meta — existing
- ✓ Sitemap generation — existing
- ✓ Service pages (Penetration Testing, Managed Security, Security Training) — existing
- ✓ Security score quiz tool — existing
- ✓ Responsive layout with mobile support — existing
- ✓ GitHub Pages deployment via GitHub Actions — existing
- ✓ WhatsApp floating contact button — existing
- ✓ 404 error page — existing
- ✓ Company profile page — existing
- ✓ Resources/downloads page — existing
- ✓ Privacy policy page — existing
- ✓ Responsible disclosure page — existing

### Active

- [ ] World-class UI/UX redesign — premium boutique aesthetic that competes globally
- [ ] SEO optimization for Rwanda/East Africa cybersecurity keywords — first page Google results
- [ ] Expert blog content — human-written articles that drive organic traffic and establish authority
- [ ] Full analytics stack (GA4, Search Console, LinkedIn Insight Tag, conversion tracking) behind cookie consent
- [ ] "Book a Consultation" as primary CTA throughout site — lead generation funnel
- [ ] Founder credibility page — certifications, experience, track record
- [ ] Service pages updated to reflect flagship offerings: Penetration Testing, Security Assessments, Custom Tooling (Training as secondary)
- [ ] Code quality overhaul — TDD, linting, type checking, clean architecture
- [ ] Security hardening — CSP improvements, no innerHTML, external scripts extracted
- [ ] Performance optimization — fast load on any device, especially mobile in Africa
- [ ] Compliance awareness content — PCI DSS, ISO 27001, Rwanda data protection law, central bank guidelines
- [ ] Sensitive data audit — ensure no secrets in public GitHub repo
- [ ] Accessibility improvements — proper ARIA labels, skip links, screen reader support
- [ ] Content review — audit all existing blog posts for quality, accuracy, SEO value

### Out of Scope

- Multi-language support (French, Kinyarwanda) — English-only for now, revisit when Rwanda market proves out
- Client portal or login system — no user accounts needed
- E-commerce or online payments — consultation-based sales model
- Real-time chat widget — WhatsApp float serves this purpose
- Mobile app — web-only
- CMS or admin dashboard — content managed via MDX files in repo

## Context

- **Market position:** New firm, no existing clients. Website must do the heavy lifting to establish credibility and generate leads.
- **Target clients:** Banks, insurance companies, government entities in Rwanda first, then expanding to East Africa, South Africa, Africa, and globally. These are large, regulated organizations with budget for premium cybersecurity services.
- **Competitive landscape:** Competing with both local firms and global consultancies (Deloitte, KPMG, Bishop Fox, etc.). Differentiation comes from specialized local expertise + global-grade quality.
- **Founder-led brand:** The founder's personal certifications and experience ARE the brand. This must be front and center.
- **Technical environment:** Astro 6.x SSG, deployed to GitHub Pages. Public repo — code quality is also a credibility signal.
- **Known issues from codebase audit:** Theme toggle potentially broken, no tests, large monolithic page files, hardcoded analytics IDs, innerHTML usage in quiz, CSP allows unsafe-inline, no linting.

## Constraints

- **Hosting**: GitHub Pages (static only) — no server-side processing
- **Tech stack**: Astro SSG — maintain current framework, modernize within it
- **Budget**: Bootstrap/lean — no paid tools, use free tiers (GA4, Search Console, Formspree)
- **Public repo**: All code visible on GitHub — no secrets, exemplary code quality
- **Performance**: Must load fast on mobile networks in Africa — optimize for constrained bandwidth
- **Legal**: Rwanda data protection law compliance, GDPR-like cookie consent, responsible disclosure policy

## Key Decisions

| Decision                                                      | Rationale                                                                  | Outcome   |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- | --------- |
| Premium boutique positioning                                  | Higher rates, fewer clients needed, matches regulated enterprise market    | — Pending |
| English-only                                                  | Professional B2B standard in East Africa cybersecurity, reduces complexity | — Pending |
| Book a Consultation as primary CTA                            | Qualifies leads through conversation, suits high-value services            | — Pending |
| Maintain Astro SSG                                            | Already in place, excellent for performance/SEO, no reason to migrate      | — Pending |
| Full analytics stack behind cookie consent                    | Need conversion data to optimize, must respect privacy laws                | — Pending |
| TDD approach                                                  | Public repo means code quality is visible, prevents regressions            | — Pending |
| Three flagship services (Pentest, Assessment, Custom Tooling) | Clear positioning, training as secondary offering                          | — Pending |

---

_Last updated: 2026-03-16 after initialization_
