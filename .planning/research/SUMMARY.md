# Project Research Summary

**Project:** Imizi Cyber — cybersecurity firm website enhancements (imizicyber.com)
**Domain:** Premium boutique B2B cybersecurity consultancy — lead generation, SEO, trust establishment
**Researched:** 2026-03-16
**Confidence:** MEDIUM-HIGH (direct codebase audit HIGH; external market patterns MEDIUM)

## Executive Summary

Imizi Cyber is a founder-led, boutique offensive security consultancy based in Kigali targeting regulated enterprises (banks, insurance, government) in East Africa. The existing Astro 6 SSG on GitHub Pages is a sound technical foundation — zero client JavaScript by default, content collections, schema.org structured data, and a working cookie consent gate. The site is functional but has not been optimized for the conversion journey of enterprise buyers who need to answer "who is this person, have they done this before, and can I trust them with my infrastructure?" The enhancement work is therefore not a rebuild — it is a trust-building and quality-reinforcement project on top of a solid baseline.

The recommended approach is phased and dependency-ordered. Code quality must come first: the public GitHub repo is a portfolio piece for a security firm, and existing issues (innerHTML XSS risks, unsafe-inline CSP, broken theme toggle, zero tests) actively contradict the expertise being sold. Once the code quality baseline is established with tests and linting, the UI can be refactored into composable section components, founder credentials surfaced prominently, and new high-value content (anonymised case studies, founder page) added with confidence. Analytics conversion tracking and SEO strategy must be validated before new content is created, not retrofitted afterward.

The dominant risk is credibility inconsistency: a cybersecurity firm whose public website uses innerHTML, has no test coverage, and serves a broken feature signals the opposite of expertise. The secondary risk is conversion failure: the site generates traffic but lacks the trust signals (visible founder authority, anonymised case studies, clear "what happens next" process) that enterprise buyers require before initiating contact. Both risks have clear technical and content remedies identified in the research.

---

## Key Findings

### Recommended Stack

The existing stack is correct and should not be changed. Astro 6, GitHub Pages, Formspree, and GA4 are the right choices for a static site at this scale. The additions are purely additive: ESLint 9 + TypeScript strict + Prettier for code quality; Vitest + Playwright + axe-core for test coverage; rehype-external-links, rehype-slug, and rehype-autolink-headings for blog SEO; and husky + lint-staged for pre-commit hooks. No JS frameworks, no Tailwind, no CMS, no live chat — each would add complexity without proportional value.

One important non-npm addition: `@astrojs/image` (already in Astro 6 core via Sharp) should be activated by replacing all raw `<img>` tags with Astro's `<Image>` component. This is the single highest-leverage performance change available with zero new dependencies. Self-hosting Google Fonts via `@astrojs/fonts` is worth evaluating once stability in Astro 6.x is confirmed — it eliminates the only remaining external DNS round-trip on page load.

**Core technologies:**

- Astro 6 SSG: framework — do not migrate, already optimal for static B2B site
- Vitest 3 + Playwright 1: test stack — native Vite integration, zero config friction with Astro
- axe-core/playwright: accessibility CI — WCAG 2.1 AA automated checks without manual audits per deploy
- ESLint 9 flat config + eslint-plugin-astro + eslint-plugin-jsx-a11y: code quality gate
- rehype-external-links + rehype-slug + rehype-autolink-headings: blog SEO, zero runtime overhead
- husky 9 + lint-staged 15: pre-commit enforcement — prevents broken code from reaching the public repo
- LinkedIn Insight Tag (no npm): free pixel for future enterprise retargeting, loaded behind existing consent gate

### Expected Features

**Must have (table stakes — missing = enterprise buyers leave or lose trust):**

- Prominent founder credentials on homepage above the fold (OSCP, OSCP+, BlackHat Arsenal — named explicitly, not just logos)
- Standalone `/about/` founder page (standalone URL usable in proposals, LinkedIn, email signatures)
- Anonymised case studies — 2-3 minimum (highest single conversion impact; standard at Bishop Fox, NCC Group)
- GA4 conversion events (form_submit, whatsapp_click, quiz_completed, cta_click) — without these, no measurement
- Working dark/light theme toggle (broken feature on a security firm's site is a visible credibility failure)
- CSP without unsafe-inline (enterprise security teams and technical evaluators will check this)
- Accessible forms with validation feedback and visible loading/success/error states
- Blog with tag-based category structure and internal linking (SEO authority compounds with structure)
- Fast load on African mobile networks (LCP < 2.5s on 3G — measurable conversion impact)

**Should have (differentiators — set Imizi Cyber apart in the Rwandan market):**

- Compliance-mapped service pages with specific BNR directive numbers (not just "we support BNR compliance")
- Security score quiz refactored (replace innerHTML with DOM API, bundle jsPDF locally, add GA4 event)
- WhatsApp pre-filled messages on every service page + GA4 click tracking
- LinkedIn Insight Tag behind cookie consent (free; enables future retargeting of enterprise buyers)
- USSD/mobile money testing page (unique to African fintech stack; high-intent regional search volume)
- Resources lead magnets with email follow-up sequence (download without follow-up is a missed conversion)
- Google Search Console configured and sitemap submitted

**Defer to later:**

- Email follow-up sequences (requires Formspree plan upgrade or Brevo/Mailchimp integration)
- Self-hosted fonts via @astrojs/fonts (verify Astro 6 stability first)
- Additional lead magnet resources (track existing ones first)
- Partytown for analytics offloading (revisit only if Lighthouse shows analytics in critical path)
- Multi-language support (no evidence of demand; doubles content maintenance)
- Booking widget, live chat, client portal, popups (anti-features for this market and audience)

### Architecture Approach

The existing architecture is sound: a clean 6-layer dependency hierarchy (data → content → components → layouts → pages → browser) with no circular dependencies. The enhancement work adds three new subsystems (analytics with consent gating, test infrastructure, performance pipeline) and enforces cleaner boundaries in the existing layers. The most important structural change is extracting the monolithic `index.astro` (~500+ lines of inline sections) into named section components — this is required before testing or safe refactoring can happen. The `src/data/` layer needs two new modules (`services.ts`, `nav.ts`) to eliminate hardcoded repetition across service pages and navigation. A shared `src/lib/analytics.ts` utility wraps all `window.gtag` calls with a consent check, making analytics testable and preventing any event from firing before consent.

**Major components:**

1. Data layer (`src/data/site.ts` + new `services.ts`, `nav.ts`) — single source of truth; all components import from here
2. Analytics subsystem (`src/lib/analytics.ts` + `CookieBanner.astro`) — consent gate with typed event wrapper
3. Test infrastructure (`src/tests/` + `e2e/`) — Vitest unit tests + Playwright E2E; must exist before major refactoring
4. Section components (HeroSection, ServicesSection, CredentialsSection, etc.) — extracted from monolithic index.astro
5. New pages (`/about/`, case study pages) — thin composers using the now-stable component library
6. Performance pipeline (`<Image>` component, font strategy audit, jsPDF local bundle)

### Critical Pitfalls

1. **Public repo credibility trap** — The code is a portfolio piece for a security firm. innerHTML usage, unsafe-inline CSP, broken toggleTheme, and zero tests contradict the expertise being sold. Fix all of these before the redesigned site launches; prioritise this above any UI work.

2. **Founder authority buried** — Enterprise buyers in regulated industries hire people, not companies. If OSCP, OSCP+, and BlackHat Arsenal credentials are not visible on arrival (not buried in an "About" secondary page), the primary trust signal never reaches most visitors. Surface credentials above the fold on the homepage and add a standalone `/about/` page.

3. **Mobile performance on African networks** — Development and testing happens on fast connections; the target buyers are on MTN Rwanda mobile data. Google Fonts round-trip, unoptimised images, and the jsPDF CDN chain all degrade performance on constrained networks. Self-host fonts, activate Astro's `<Image>` component, bundle jsPDF locally. Test at Slow 4G throttling, not fast 3G.

4. **Analytics before consent (legal and trust risk)** — A cybersecurity firm that cannot correctly implement cookie consent on its own website undermines its core value proposition to regulated enterprise clients. The consent gate must be covered by automated tests that confirm no analytics script fires before explicit opt-in. This is a legal exposure under Rwanda DPA and a credibility risk with any client whose legal team reviews the site.

5. **SEO targeting unwinnable global keywords** — Competing for "penetration testing" against established global firms is a dead end. The achievable and high-intent terms are regional and compliance-specific: "BNR cybersecurity compliance Rwanda," "penetration testing Kigali bank," "Rwanda Data Protection Law audit." Every blog post and service page should contain geo-modifiers. Define the keyword strategy before writing any new content — retrofitting SEO is significantly harder.

---

## Implications for Roadmap

Based on combined research, the architecture's build-order constraints and the pitfall severity map to five phases. The dependency chain is strict: tests must exist before refactoring; the data layer must be defined before components; components must be stable before new pages are added; analytics must be validated before conversion measurement begins.

### Phase 1: Code Quality Foundation

**Rationale:** This unblocks everything else. Without tests, refactoring the monolithic `index.astro` risks breaking the homepage silently. Without ESLint, new code reintroduces the same patterns currently flagged in CONCERNS.md. The public repo must be cleaned up before any marketing push — a technical evaluator discovering innerHTML and zero tests during due diligence is a silent deal-killer.

**Delivers:** ESLint 9 + TypeScript strict + Prettier configured; Vitest + Playwright + axe-core installed; husky pre-commit hooks active; broken `toggleTheme()` fixed; `src/data/services.ts` and `src/data/nav.ts` data modules created; `src/lib/analytics.ts` consent wrapper created; all package.json scripts added (`typecheck`, `lint`, `test`).

**Addresses features:** Working theme toggle (table stakes); test coverage for consent gate (prevents Pitfall 6).

**Avoids pitfalls:** Public repo credibility trap (Pitfall 5); analytics before consent (Pitfall 6).

**Research flag:** Standard patterns — no additional research needed. ESLint 9 flat config + Vitest + Playwright is well-documented for Astro projects.

---

### Phase 2: Component Architecture Refactor

**Rationale:** The monolithic `index.astro` cannot be safely modified until tests exist (Phase 1) and cannot be tested until it is decomposed into components. This phase creates the stable component library that Phases 3-5 build on. It is also when the rehype SEO plugins are added to the Astro config.

**Delivers:** HeroSection, ServicesSection, ProcessSection, CredentialsSection, BlogFeedSection, FAQSection, and ContactSection extracted from index.astro; rehype-external-links + rehype-slug + rehype-autolink-headings configured; blog tag/category structure added; all `<img>` tags replaced with Astro `<Image>` component; inline script concerns addressed (IIFE/module pattern, CustomEvent for consent reset).

**Addresses features:** Blog category structure (table stakes); image optimisation (performance); partial CSP improvement.

**Avoids pitfalls:** Monolithic page files (Architecture Anti-Pattern 3); innerHTML usage (Anti-Pattern 1); broken external links in blog (STACK rehype recommendation).

**Research flag:** Standard patterns for Astro component extraction. Blog tag implementation in Astro content collections is well-documented.

---

### Phase 3: Analytics and Conversion Tracking

**Rationale:** Analytics must be validated before any SEO or content work begins — you cannot measure what you cannot track, and the measurement infrastructure must be tested before trusting the data it produces. LinkedIn Insight Tag follows the same consent pattern as GA4 and belongs in this phase.

**Delivers:** GA4 custom conversion events (generate_lead, cta_click, contact, quiz_completed, scroll_depth) wired to all lead capture touchpoints; LinkedIn Insight Tag added behind cookie consent; WhatsApp click tracking on all service pages; Google Search Console meta tag verification added to SEOHead.astro; sitemap submitted to GSC; automated Playwright test confirms no analytics fire before consent; `analytics.ts` utility tested in Vitest.

**Addresses features:** Complete analytics stack (table stakes); LinkedIn retargeting pixel (differentiator); WhatsApp GA4 tracking (differentiator).

**Avoids pitfalls:** Analytics before consent (Pitfall 6); LinkedIn tag misconfiguration (Pitfall 11); untracked conversions making measurement impossible.

**Research flag:** Standard patterns. GA4 event schema and LinkedIn Insight Tag implementation are well-documented. Consent gate testing with Playwright is straightforward.

---

### Phase 4: Trust and Conversion Content

**Rationale:** With stable components (Phase 2) and working measurement (Phase 3), content changes now have measurable impact. This phase contains the highest-ROI features: the founder page and anonymised case studies are the two features that most directly convert enterprise buyer visits into consultation requests.

**Delivers:** Standalone `/about/` founder page (photo, OSCP/OSCP+/BlackHat Arsenal, career history, academic background, GSoC Honeynet); 2-3 anonymised case study pages (founder-written from real engagements, ~800-1200 words each); founder credentials surfaced above the fold on homepage (promoted from buried "About" section); compliance-mapped service pages with specific BNR directive numbers; security score quiz refactored (innerHTML removed, jsPDF bundled locally, GA4 event on completion); "What happens next" section added near every primary CTA; BookingCTA and TrustBar components created.

**Addresses features:** Founder page (table stakes + differentiator); case studies (highest single conversion impact); compliance mapping specificity (regional differentiator); quiz refactor (existing differentiator fixed).

**Avoids pitfalls:** Founder authority buried (Pitfall 2); CTA without trust context (Pitfall 7); quiz XSS risk from innerHTML (Architecture Anti-Pattern 1).

**Research flag:** Case study content requires founder to write from real engagements — this is a content dependency, not a technical one. Legal/NDA review of case study framing should happen before publication. No technical research needed for this phase.

---

### Phase 5: SEO, Performance, and Security Hardening

**Rationale:** SEO work is last because the keyword strategy must be validated against real Search Console data (collected from Phase 3 onward) before committing to content expansion. Performance and CSP hardening are here because they require all components to be stable (Phase 2) — you cannot audit a moving target. This is also when Google Business Profile is set up.

**Delivers:** Keyword strategy defined with geo-modified and compliance-specific target terms; existing 16 blog posts audited for internal linking and geo-modifiers added where missing; new blog posts written to target identified gap keywords; CSP hardened (unsafe-inline removed; inline scripts converted to external files with SRI hashes where needed; hash-based approach for unavoidable inline scripts); GA ID and Formspree ID moved to environment variables; font loading audited (evaluate @astrojs/fonts self-hosting); Lighthouse CI added to GitHub Actions workflow; Google Business Profile created for Imizi Cyber Kigali; schema.org validation added to CI pipeline; axe-core a11y audit run on all pages.

**Addresses features:** CSP without unsafe-inline (table stakes); fast mobile performance (table stakes + differentiator); regional SEO keyword targeting (prevents Pitfall 4); local business signals (Pitfall 15).

**Avoids pitfalls:** Generic global keyword targeting (Pitfall 4); mobile performance disaster (Pitfall 3); public repo credibility from CSP (Pitfall 5); analytics ID in public repo (Pitfall 14); schema breaks after route changes (Pitfall 10); sitemap and GSC setup (Pitfall 13).

**Research flag:** CSP hardening with hash-based approach for GitHub Pages (no server-side nonce injection) needs implementation-level research. Verify the exact Astro 6 static adapter approach for CSP headers via `_headers` file on GitHub Pages. Confirm @astrojs/fonts stability in Astro 6.x before adopting.

---

### Phase Ordering Rationale

- Phase 1 before everything: tests must exist before refactoring; linting must be enforced before new code is written; the data layer contracts must be defined before components use them
- Phase 2 before content: components must be stable before new pages are added; the `<Image>` component must be in place before performance can be measured accurately
- Phase 3 before content: you cannot measure conversion impact of case studies without conversion events; validate the consent gate before trusting any data
- Phase 4 before SEO expansion: founder page and case studies must exist before aggressive SEO targeting of "founder credibility" and "case study" queries
- Phase 5 last: CSP hardening is a full-pass audit that benefits from components being stable; SEO strategy requires Search Console data from Phase 3 onward; performance audit is accurate only after all content and image changes are in place

---

## Confidence Assessment

| Area         | Confidence                                              | Notes                                                                                                                                                                                                                       |
| ------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH                                                    | Existing stack directly inspected from source; additions are verified Astro community standards. Verify eslint-plugin-astro ESLint 9 compatibility and @astrojs/fonts Astro 6.x stability before installation.              |
| Features     | HIGH for "what exists"; MEDIUM for "what converts"      | Current state confirmed by direct codebase audit. Conversion impact rankings based on established B2B services marketing patterns, not Rwanda-specific A/B data.                                                            |
| Architecture | HIGH                                                    | Architecture derived from direct codebase reading. Layer model and data flow match the actual source structure. Astro-specific patterns align with framework conventions at training cutoff (August 2025).                  |
| Pitfalls     | HIGH for technical pitfalls; MEDIUM for market pitfalls | Technical pitfalls (CSP, innerHTML, tests) are confirmed from source. Market pitfalls (SEO keyword competition, enterprise buyer behaviour in Rwanda) are based on established B2B patterns without live local market data. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Rwanda-specific keyword data:** No live keyword research tool was available. The geo-modified keyword strategy (BNR compliance, Kigali penetration testing) is directionally correct but specific keyword volume and competition level should be validated with Google Keyword Planner or Search Console data before committing the content calendar.

- **@astrojs/fonts Astro 6.x stability:** Research flagged this as experimental. Verify at `docs.astro.build/en/guides/fonts/` before adding to the project. If not stable, Google Fonts with the existing preload/swap pattern is acceptable.

- **eslint-plugin-astro ESLint 9 flat config compatibility:** Confirm version support at `github.com/ota-meshi/eslint-plugin-astro` before installing. Fallback: use ESLint 9 without the Astro plugin (reduced coverage but not a blocker).

- **CSP hash-based approach on GitHub Pages:** The `_headers` file on GitHub Pages supports custom headers. Confirm the Astro static adapter outputs CSP headers via `_headers` and verify that hash-based script-src is supported without server infrastructure. This needs a short implementation spike in Phase 5.

- **BNR directive numbers for compliance mapping:** Specific BNR cybersecurity directive numbers referenced in service pages should be verified against current BNR publications at `bnr.rw` before being added to page copy. Do not publish inaccurate regulatory references.

- **Rwanda DPA specifics:** Rwanda Data Protection Law details should be verified against current RURA publications before writing compliance content. The cookie consent implementation is correct in pattern but should be reviewed against current Rwandan DPA requirements if the firm is advising clients on data protection.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)

- `/src/` codebase audit — all pages, layouts, components, data, content collections
- `.planning/PROJECT.md` — project constraints and scope
- `.planning/codebase/ARCHITECTURE.md` — existing architectural documentation
- `.planning/codebase/CONCERNS.md` — documented issues and known bugs

### Secondary (MEDIUM confidence — domain expertise and established patterns)

- B2B cybersecurity firm website patterns: Bishop Fox, Cobalt.io, NCC Group, Rapid7, Trustwave
- Astro 6 official documentation patterns (training data August 2025; verify against current docs)
- B2B conversion research: consultation booking trust signals, enterprise procurement patterns
- African mobile network performance context: industry-documented latency and bandwidth data
- East Africa B2B communication patterns: WhatsApp penetration, LinkedIn enterprise adoption

### Tertiary (LOW confidence — verify before acting)

- Rwanda-specific keyword volume and competition: requires live tool validation
- Current BNR cybersecurity directive numbers: verify at `bnr.rw`
- Current Rwanda DPA specifics: verify at RURA official publications
- @astrojs/fonts Astro 6 stability: verify at Astro docs
- eslint-plugin-astro ESLint 9 compatibility: verify at plugin repo

---

_Research completed: 2026-03-16_
_Ready for roadmap: yes_
