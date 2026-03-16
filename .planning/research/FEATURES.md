# Feature Landscape

**Domain:** Premium boutique cybersecurity consultancy website (B2B, lead generation, SEO)
**Project:** Imizi Cyber — imizicyber.com
**Researched:** 2026-03-16
**Confidence:** HIGH (grounded in full codebase audit + domain expertise in B2B cybersecurity marketing)

---

## Methodology Note

This analysis is grounded in a complete audit of the existing codebase (29 Astro files, 16 blog posts, all pages,
layouts, components, and data). What "exists" is confirmed from source. What "is missing" is reasoned from what
world-class cybersecurity B2B sites (Bishop Fox, Rapid7, Cobalt.io, NCC Group, Trustwave) have that this site
does not yet have, filtered for what matters at the boutique single-consultant scale.

---

## Current State Inventory

**Confirmed existing (do not rebuild from scratch):**

| Feature                                     | Status                  | Quality Signal            |
| ------------------------------------------- | ----------------------- | ------------------------- |
| Hero section with terminal animation        | Exists                  | Good — on-brand           |
| Service pages (Pentest, Managed, Training)  | Exists                  | Solid structure           |
| Blog system (MDX, 16 posts)                 | Exists                  | Strong SEO foundation     |
| FAQ sections with schema.org FAQPage        | Exists                  | Good — Google-eligible    |
| Contact form (Formspree)                    | Exists                  | Functional                |
| WhatsApp floating button                    | Exists                  | Africa-appropriate        |
| Cookie consent banner                       | Exists — recently fixed | Functional                |
| GA4 analytics (lazy, behind consent)        | Exists                  | Correct                   |
| Schema.org structured data (7+ types)       | Exists                  | Comprehensive             |
| OG/Twitter meta, canonical URLs, geo meta   | Exists                  | Complete                  |
| Sitemap                                     | Exists (Astro built-in) | Functional                |
| Resources / lead magnets page (3 items)     | Exists                  | Good concept, no tracking |
| Security score quiz tool                    | Exists                  | Unique differentiator     |
| Company profile (print-optimised PDF)       | Exists                  | Unusual, valuable         |
| Credentials section (OSCP, OSCP+, BlackHat) | Exists on homepage      | Present but not prominent |
| Process/how-we-work section                 | Exists                  | Clear                     |
| Stats bar (6+ countries, 50+ engagements)   | Exists                  | Credibility signal        |
| Dark/light theme toggle                     | Exists — broken         | Needs fix                 |
| Responsive layout                           | Exists                  | Good                      |
| Skip link, ARIA labels                      | Partial                 | Accessibility incomplete  |
| Privacy policy                              | Exists                  | Legal requirement met     |
| Responsible disclosure                      | Exists                  | Trust signal present      |
| 404 page                                    | Exists                  | Functional                |
| Breadcrumbs (visual + schema)               | Exists                  | Good                      |

---

## Table Stakes

Features that enterprise buyers expect. Missing = prospect leaves or loses trust.

### 1. Clear Primary CTA on Every Page

**Why expected:** A decision-maker at a Rwandan bank lands on any page. If the path to "talk to you" is not
immediately obvious, they leave. B2B cybersecurity sales require removing all friction from the first contact.
**Current state:** Present on homepage and service pages. Missing or weak on blog posts (CtaBox exists but
is placed at the bottom after full article read — needs above-the-fold reinforcement on long-form content).
**Complexity:** Low
**Notes:** CTA text should be "Book a consultation" everywhere. Not "Contact us" — that sounds like support.

### 2. Prominent Founder Credibility Section

**Why expected:** "Who certified this person?" is the first question a regulated enterprise asks before any
procurement conversation. OSCP, OSCP+, BlackHat Europe Arsenal — these are category-defining credentials
for the target market. If a bank's CISO cannot immediately see the certification on arrival, trust is lost.
**Current state:** Credentials exist in homepage "About" section (cred-grid) and in company profile PDF.
They are present but not prominent enough — buried after services, process, and blog sections. There is no
dedicated founder/about page as a standalone URL.
**Complexity:** Low-Medium (add dedicated `/about/` page)
**Notes:** The founder page should be a standalone URL that can be linked from LinkedIn, proposals, and email
signatures. Photo optional but recommended for relationship-based African B2B market.

### 3. Social Proof / Case Studies

**Why expected:** In regulated enterprise sales, "who else have you worked for?" is mandatory before any
procurement. The company profile lists Tier-1 Nordic Bank, Pan-African Banking Group, Top-5 South African
Bank, Securities Trading Firm (Abu Dhabi). These are excellent but are buried in a print-only PDF.
**Current state:** Stats (50+ engagements, 6+ countries) exist on homepage. Specific engagement names are
in company profile only. Zero client testimonials or case study pages exist.
**Complexity:** Medium
**Notes:** Client names are anonymised for confidentiality — that is correct. Anonymised case studies ("A major
Rwandan commercial bank asked us to test their mobile banking API. We found...") are the standard format at
Bishop Fox, NCC Group, etc. They are credibility without violating NDA. Even 2-3 of these would transform
trust. This is the highest-impact missing feature for lead conversion.

### 4. Fast Load Performance on African Mobile Networks

**Why expected:** Target audience includes bank staff and CISOs in Rwanda, Kenya, Uganda, Tanzania. Mobile
data speeds vary. 3G is still common in tier-2 cities. A site that loads slowly on Safaricom or MTN loses
the prospect physically before they read anything.
**Current state:** Fonts loaded via Google Fonts (render-blocking risk), no image optimisation evidence,
jsPDF CDN loaded at quiz/resources (deferred but from 3 external CDNs with fallback chain). No Lighthouse
audit evidence in repo.
**Complexity:** Medium
**Notes:** Target Core Web Vitals: LCP < 2.5s on simulated 3G. Astro's output is static HTML — the foundation
is good. Optimisation is about font loading strategy, image formats (WebP), and removing unnecessary external
calls on critical path.

### 5. Working Dark/Light Theme Toggle

**Why expected:** Premium boutique positioning demands that basic UI features work correctly. A broken theme
toggle is a visible quality signal to technical evaluators (who will be reading the code on GitHub too).
**Current state:** Theme toggle component exists. PROJECT.md flags it as "potentially broken". Codebase
shows `data-theme` localStorage logic in BaseLayout but no corresponding toggle interaction in ThemeToggle.astro
was verified to be wired correctly.
**Complexity:** Low
**Notes:** Fix before any other UI work — a broken toggle on a security firm's site undermines the "we are
experts" positioning.

### 6. Complete Analytics Stack (GA4 + Search Console + Conversion Events)

**Why expected:** To know if SEO is working, which pages convert, which blog posts drive leads — you need
data. GA4 without conversion events is not useful. Search Console is free and reveals real keyword ranking.
**Current state:** GA4 ID is hardcoded in `site.ts` (G-R7TC88KH9N). GA4 loads correctly behind cookie
consent. No evidence of custom conversion events (form submissions, WhatsApp clicks, resource downloads).
No LinkedIn Insight Tag (needed for retargeting enterprise buyers later). No Search Console configuration
is visible in the codebase (it is configured externally, but verification status unknown).
**Complexity:** Low-Medium
**Notes:** Add GA4 custom events: `form_submit` (contact form), `whatsapp_click`, `resource_download`,
`cta_click`. These are the signals that tell you what is working. LinkedIn Insight Tag is important for
future paid campaigns targeting bank decision-makers.

### 7. Accessible Forms with Validation Feedback

**Why expected:** Contact form is the primary lead capture mechanism. If it silently fails or gives no
feedback, leads are lost permanently. ARIA and keyboard accessibility are also legal risk in some markets.
**Current state:** ContactForm component exists (Formspree). The exact validation state feedback is not
visible in the read files. CookieBanner buttons were recently fixed for click responsiveness (commit
`06325e9`), which suggests interactivity bugs have existed.
**Complexity:** Low
**Notes:** Test form end-to-end. Ensure loading states, success messages, and error messages are visible
and accessible. Formspree gives email confirmations — verify these are going to inbox, not spam.

### 8. Blog with Internal Linking and Category Structure

**Why expected:** 16 blog posts exist. For SEO authority to compound, posts must link to each other and
to service pages. A flat blog without categories makes navigation harder and reduces crawl equity.
**Current state:** Blog index page exists. Posts link to each other in some cases (verified in pentest
service page: link to BNR requirements post). No tag/category system visible. No related posts feature.
No estimated read time displayed on blog index (present in homepage hardcoded list but not from frontmatter
on actual blog index page).
**Complexity:** Medium
**Notes:** Astro content collections support tags natively. Adding tag-based filtering is low effort.
Related posts based on shared tags drives internal page views and reduces bounce.

### 9. Security Headers and CSP Without unsafe-inline

**Why expected:** A cybersecurity firm with `unsafe-inline` in its CSP is a credibility problem. Enterprise
security teams and CISOs will look at this (some run automated scans on vendor sites). The public GitHub
repo makes this visible to anyone evaluating the firm technically.
**Current state:** PROJECT.md explicitly flags "CSP allows unsafe-inline" as a known issue. BaseLayout
confirms `script-src 'self' 'unsafe-inline'` in the CSP string. Inline scripts are used for theme
toggle, cookie banner, email obfuscation, and quiz logic.
**Complexity:** High (requires extracting all inline scripts to external files with nonces or hashes)
**Notes:** This is the table stakes item most likely to be evaluated by a technical prospect. Fixing it
requires architectural work (moving `is:inline` scripts to proper Astro scripts or external files).

---

## Differentiators

Features that set Imizi Cyber apart from both local Rwandan firms and global consultancies.

### 1. Anonymised Case Studies with Attack Narratives

**Value proposition:** Bishop Fox does this, NCC Group does this. Local Rwandan competitors almost certainly
do not. A case study formatted as "we found a critical IDOR in the home loan API of a commercial bank and
here is how we exploited it" is more credible than any certification badge. It demonstrates capability,
not just credentials.
**Complexity:** Medium
**Notes:** 2-3 case studies minimum. Format: client description (anonymous), engagement type, what was
found, business impact, recommendation followed. Target 800-1200 words. These pages also rank for
"penetration testing case study Rwanda" and similar queries.
**Dependencies:** Founder writes these from real engagements. No fake or synthetic case studies.

### 2. Compliance-Mapped Service Pages

**Value proposition:** Every BNR-regulated bank has a compliance checklist. A service page that says
"our penetration testing report satisfies BNR Directive X, Section Y, Requirement Z" eliminates the
procurement objection "does your report format satisfy our regulator?" before it is raised.
**Current state:** Penetration testing page has a "Compliance alignment" section listing BNR, PCI DSS,
ISO 27001, SWIFT CSP, Rwanda Data Protection Law. This is good. It needs to be more specific — actual
BNR directive numbers and explicit mapping to what the report delivers.
**Complexity:** Low (research the exact directive references, update page copy)
**Notes:** This is a differentiator only local firms or firms that specialise in Rwanda can offer. Global
firms like Deloitte produce generic reports that do not reference BNR by name. This is the moat.

### 3. Security Score Quiz with PDF Report and Lead Capture

**Value proposition:** Interactive tools that give value upfront and capture email are the standard
lead generation mechanism for cybersecurity firms (Qualys, Rapid7, Tenable all have variants). The
existing quiz is a genuine differentiator for the Rwandan market where no local firm has this.
**Current state:** Quiz exists at `/tools/security-score/`. Scores 10 questions. Generates a PDF using
jsPDF. Captures name/email before download. Issues: uses innerHTML (XSS risk noted in PROJECT.md),
relies on 3 external CDNs (reliability risk on African networks), no GA4 conversion event on completion.
**Complexity:** Medium (refactor innerHTML to DOM API, add GA4 event, test PDF generation on slow networks)
**Notes:** This feature is worth fixing and promoting prominently. It is unique in the market and creates
a qualified lead list of organisations who self-identified as having security concerns.

### 4. Founder Page with LinkedIn Integration Signal

**Value proposition:** Founder-led firms win deals because the buyer knows exactly who will do the work.
A dedicated `/about/aristofanis/` or `/about/` page with full professional history, published work,
talk abstracts, and a photo converts better than a credentials grid embedded in a homepage section.
**Current state:** Credentials present in homepage About section. Company profile PDF has detailed bio.
No standalone founder page exists.
**Complexity:** Low-Medium
**Notes:** Include: photo, certifications with links to verification, employment history in offensive
security (Tier-1 Nordic Bank, Pan-African Banking Group, Top-5 South African Bank), academic
background (DTU MSc, NKUA BSc), Google Summer of Code (Honeynet Project), BlackHat Europe Arsenal
abstract or link. This page also ranks for "Aristofanis Chionis" personal brand searches and LinkedIn
profile viewers who click through.

### 5. Resources as Gated Lead Magnets with Email Sequence Hook

**Value proposition:** The existing 3 resources (BNR checklist, buyer's guide, awareness template) capture
name/email/organisation before download — this is the right model. However, there is no email follow-up
sequence. A download without a follow-up email is a missed conversion.
**Current state:** Resource download captures data via Formspree (`formspreeId: 'mjgerrlv'`). PDF is
generated client-side with jsPDF. Formspree sends the submission data to the configured email but no
automated follow-up is wired.
**Complexity:** Medium (requires Formspree plan upgrade or Mailchimp/Brevo integration for sequences)
**Notes:** Even a single follow-up email 3 days after download ("Did the BNR checklist help you identify
any gaps? We can walk you through remediation on a free 30-minute call.") would materially improve
conversion. This is the highest-ROI enhancement to existing features.

### 6. WhatsApp-First Contact Flow (Africa-Specific)

**Value proposition:** WhatsApp has >90% penetration among business professionals in East Africa. The
floating button already exists. Pre-filled messages per service page already exist on the pentest page.
This is a genuine competitive advantage over global firms that only offer email/Calendly.
**Current state:** WhatsApp float exists globally. Pentest page has pre-filled WhatsApp message. Not
all service pages have WhatsApp-specific messages. No WhatsApp click tracking in GA4.
**Complexity:** Low (add GA4 click event, ensure pre-filled messages on all service pages)
**Notes:** Keep this and invest in it. Global competitors cannot replicate the WhatsApp-first approach
without it feeling forced. It is native to how business is done in Kigali.

### 7. Performance-Optimised for Sub-Saharan Africa Networks

**Value proposition:** If the site loads in 1.2 seconds on 3G while competitors take 6 seconds, that
is a conversion advantage that cannot be copied without rebuilding their site. Astro SSG gives the
technical foundation — execution makes the difference.
**Current state:** Google Fonts loaded with preload/rel=stylesheet swap pattern (good). No explicit
image optimisation. External CDN dependencies at runtime (jsPDF from 3 CDNs, Google Fonts, GTM).
**Complexity:** Medium
**Notes:** Bundle jsPDF locally (don't rely on external CDNs on African networks). Use Astro's built-in
`<Image>` component for any images added. Consider self-hosting fonts as a future option.

### 8. LinkedIn Insight Tag + Retargeting Pixel

**Value proposition:** Enterprise buyers at banks are on LinkedIn. After a site visit, retargeting on
LinkedIn with "BNR compliance audit — get a quote" keeps Imizi Cyber top-of-mind during the
multi-month enterprise sales cycle.
**Current state:** No LinkedIn Insight Tag in codebase. GA4 only.
**Complexity:** Low (add one script tag behind cookie consent, same pattern as GA4)
**Notes:** Free to implement. Requires a LinkedIn Campaign Manager account. Retargeting costs money when
activated but pixel installation costs nothing.

---

## Anti-Features

Features to explicitly NOT build. They create complexity without proportional value for this context.

### 1. Live Chat Widget

**Why avoid:** Crisp, Intercom, Drift — these add ~60-200kb of JavaScript, require someone to monitor
chat in real time, and feel appropriate for SaaS products, not security consulting firms. The WhatsApp
float serves this purpose better for East Africa.
**What to do instead:** WhatsApp float with pre-filled messages. This is already built and works.

### 2. Client Portal or Login System

**Why avoid:** Static site (GitHub Pages) cannot run server-side logic. A login system would require
a separate backend, hosting costs, security hardening, and ongoing maintenance. The sales model is
phone/email/WhatsApp-based; there is no digital deliverable workflow that requires a portal.
**What to do instead:** Deliver reports by encrypted email or ShareFile-equivalent link. Out of scope.

### 3. Multi-Language Support (French, Kinyarwanda)

**Why avoid:** Rwanda's regulated enterprise market (banks, insurance, government) operates in English
at the procurement level. French is used in some Francophone African markets but not in Rwanda specifically.
Kinyarwanda is for consumer-facing products. Adding languages now doubles content maintenance with no
evidence of demand.
**What to do instead:** English only. Revisit when first non-English-speaking client enquires.

### 4. Blog Comments or Community Features

**Why avoid:** Comments require moderation, spam prevention, and ongoing engagement. A security firm's
blog is a content marketing asset, not a community. Comments also create potential reputational exposure.
**What to do instead:** End every post with a CTA to WhatsApp or email. Social proof comes from case
studies and testimonials, not comment threads.

### 5. Calendly or Booking Widget Embedded in Site

**Why avoid:** Calendly has a non-trivial JavaScript footprint, adds an external dependency, and
the cold-booking model ("pick a time from my calendar") does not fit high-value B2B security
consulting. A Rwandan bank's CISO will not book a slot on a calendar widget — they will call.
**What to do instead:** "Request a consultation" form + WhatsApp. Respond within 24 hours (already
on the site). Phone number visible. This is the right model for this market.

### 6. E-commerce or Payment Processing

**Why avoid:** Consulting is sold through proposals and scoped engagements, not fixed-price online
checkout. Payment processing adds PCI scope, security liability, and complexity with no revenue benefit.
**What to do instead:** Quotes via email/WhatsApp. Invoices via standard business processes.

### 7. Popups or Exit-Intent Overlays

**Why avoid:** Enterprise buyers are allergic to popups. A security firm targeting CISOs and CFOs
at regulated banks cannot afford to look like a lead-gen mill. Trust is the product.
**What to do instead:** Inline CTAs within content are effective and respect the reader. The
compliance-urgency CTA section on the homepage is the right pattern.

### 8. Auto-Playing Video or Motion-Heavy Animations

**Why avoid:** Heavy animations increase page weight and slow load on African mobile networks.
Auto-play video is universally disliked and particularly bad on metered data connections.
**What to do instead:** The terminal animation on the hero is lightweight CSS — keep it. Static
imagery and CSS transitions only.

---

## Feature Dependencies

```
Case studies → Founder writes real anonymised narratives from past engagements
             → Legal review (NDA compliance)
             → Must exist before case study pages are published

Founder page → Photo (optional but recommended)
             → Bio text (expandable from company profile PDF)
             → Can be published from existing materials immediately

Email sequences → Resource lead capture (already exists)
                → Formspree plan upgrade OR Brevo/Mailchimp free tier integration
                → Requires email copywriting for sequence (2-3 emails)

LinkedIn Insight Tag → LinkedIn Campaign Manager account
                     → Cookie consent (already handles this pattern)
                     → Tag implementation behind same consent as GA4

GA4 conversion events → Existing GA4 setup (already correct)
                      → Custom event code on form, WhatsApp, resource download
                      → Requires no external dependency

CSP without unsafe-inline → All inline scripts must be extracted
                           → Blocked by: theme toggle, cookie banner, quiz, email obfuscation
                           → Requires architectural change across multiple components
                           → Must be done carefully to not break existing functionality

Performance optimisation → jsPDF bundled locally (blocks CDN dependency)
                        → Astro Image component (requires adding images first)
                        → Font loading audit (preconnect already done, evaluate self-hosting)
```

---

## MVP Recommendation

The site is already functional and has strong SEO foundations. The highest-leverage work is:

**Prioritise (highest conversion impact):**

1. **Anonymised case studies** — 2-3 pages, founder-written. This single feature transforms enterprise trust
   more than any UI change.
2. **Founder page (`/about/`)** — standalone URL for proposals, LinkedIn, email signatures.
3. **GA4 conversion events** — without these, you cannot measure what is working.
4. **Fix theme toggle** — visible quality signal to technical evaluators.

**Second priority (SEO and trust compounding):** 5. **Blog internal linking audit** — link all 16 posts to each other and to service pages systematically. 6. **Compliance mapping specificity** — add actual BNR directive numbers to pentest and compliance pages. 7. **LinkedIn Insight Tag** — free to install, enables future retargeting. 8. **WhatsApp GA4 tracking** — so you know which pages drive WhatsApp leads.

**Defer (important but not urgent):** 9. **CSP hardening** — architectural effort, do in a dedicated phase. 10. **Email follow-up sequences** — needs Formspree plan or third-party email tool. 11. **Performance deep-optimisation** — Astro static output is already good; optimise after measuring real data. 12. **Additional resources** — add 2-3 more lead magnets when current ones are tracked properly.

**Do not build:**

- Live chat widget
- Booking widget
- Multi-language
- Comments
- Popups

---

## African Market Specifics

These features are important for this market and may not appear in generic "cybersecurity website" guides:

| Feature                                           | Relevance to Rwanda/East Africa                                   | Priority |
| ------------------------------------------------- | ----------------------------------------------------------------- | -------- |
| WhatsApp CTA on every page                        | Primary business communication channel                            | High     |
| BNR compliance mapping                            | Rwanda-specific regulatory driver for all financial sector buyers | High     |
| USSD/mobile money testing page                    | Unique to African fintech stack, high Google search volume        | Medium   |
| Pre-filled WhatsApp messages per service          | Reduces friction for buyers who prefer messaging to forms         | High     |
| Physical location signal (Norrsken House, Kigali) | "Local, in Rwanda" is a purchase trigger vs remote contractors    | High     |
| Performance on 3G                                 | Measurable conversion impact on African mobile networks           | High     |
| LinkedIn Insight Tag                              | East African enterprise buyers are active on LinkedIn             | Medium   |

---

## Sources

- Full codebase audit: `/src/pages/`, `/src/components/`, `/src/layouts/`, `/src/data/`, `/src/content/blog/`
- Project context: `.planning/PROJECT.md`
- Domain expertise: B2B cybersecurity firm website patterns (Bishop Fox, Cobalt.io, NCC Group, Rapid7, Trustwave)
- Confidence: HIGH for "what exists" (directly verified in source). MEDIUM for "what differentiates" (domain
  expertise + competitor pattern analysis without live site access). The fundamental priorities are well-supported
  by established B2B SaaS/services conversion research.
