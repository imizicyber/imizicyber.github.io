---
phase: 05-analytics-and-conversion-tracking
plan: 01
subsystem: analytics
tags: [ga4, linkedin-insight-tag, cookie-consent, csp, tracking]

requires:
  - phase: 02-security-hardening
    provides: CSP injection script and cookie consent system
provides:
  - trackEvent() GA4 custom event helper
  - loadLinkedIn() consent-gated LinkedIn Insight Tag loader
  - CSP allowing LinkedIn tracking domains
affects: [05-02-event-wiring, conversion-tracking]

tech-stack:
  added: [linkedin-insight-tag]
  patterns: [consent-gated-analytics-loading, centralized-event-tracking]

key-files:
  created:
    - src/scripts/analytics.ts
  modified:
    - src/scripts/cookie-consent.ts
    - src/data/site.ts
    - scripts/inject-csp.mjs

key-decisions:
  - 'LinkedIn partner ID uses REPLACE_ME placeholder with instructions for user to configure'
  - 'loadLinkedIn() silently no-ops when partner ID is REPLACE_ME (graceful degradation)'

patterns-established:
  - 'Consent-gated loading: all third-party analytics scripts load only after cookie consent acceptance'
  - 'Centralized event tracking: all GA4 events go through trackEvent() in analytics.ts'

requirements-completed: [ANLT-05, ANLT-06, ANLT-07]

duration: 2min
completed: 2026-03-18
---

# Phase 5 Plan 1: Analytics Infrastructure Summary

**GA4 trackEvent helper and LinkedIn Insight Tag loader with consent-gated initialization and CSP allowlisting**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T03:41:03Z
- **Completed:** 2026-03-18T03:42:53Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created reusable trackEvent() helper for GA4 custom events across all components
- Built consent-gated LinkedIn Insight Tag loader with graceful degradation for unconfigured partner ID
- Updated CSP to allow LinkedIn domains (snap.licdn.com, px.ads.linkedin.com, www.linkedin.com) in script-src, connect-src, and img-src

## Task Commits

Each task was committed atomically:

1. **Task 1: Create analytics module and extend consent gate** - `f65035a` (feat)
2. **Task 2: Update CSP for LinkedIn and GA connect sources** - `92f8cb9` (chore)

## Files Created/Modified

- `src/scripts/analytics.ts` - New module with trackEvent() and loadLinkedIn() exports
- `src/scripts/cookie-consent.ts` - Updated to import and call loadLinkedIn after consent
- `src/data/site.ts` - Added linkedInPartnerId to ANALYTICS constant
- `scripts/inject-csp.mjs` - Added LinkedIn domains to script-src, connect-src, and img-src

## Decisions Made

- LinkedIn partner ID uses REPLACE_ME placeholder with inline comment guiding user to Campaign Manager; loadLinkedIn() silently no-ops until configured
- LinkedIn tracking pixel domain (px.ads.linkedin.com) added to img-src in addition to connect-src since it uses image beacons

## Deviations from Plan

None - plan executed exactly as written.

## User Setup Required

The plan includes user_setup items for:

- **LinkedIn Insight Tag:** User must replace REPLACE_ME in src/data/site.ts with their LinkedIn partner ID from Campaign Manager (Account Assets -> Insight Tag -> View Tag)
- **Google Search Console:** User must add imizicyber.com property, verify via DNS TXT record, and submit sitemap URL

## Next Phase Readiness

- trackEvent() and loadLinkedIn() are ready for the event-wiring plan (05-02)
- All components can now import trackEvent from @/scripts/analytics for GA4 custom events
- LinkedIn tracking will activate once user configures their partner ID

## Self-Check: PASSED

- All 4 files verified present on disk
- Both task commits (f65035a, 92f8cb9) verified in git log

---

_Phase: 05-analytics-and-conversion-tracking_
_Completed: 2026-03-18_
