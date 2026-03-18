---
phase: 08-blog-system-and-new-content
verified: 2026-03-18T00:00:00Z
status: gaps_found
score: 4/5 success criteria verified
re_verification: false
gaps:
  - truth: '3 new blog articles are live and accessible at their URLs'
    status: partial
    reason: 'All 3 new articles exist with substantive content (1659/1716/1984 words), valid frontmatter, and internal links — but all 3 are missing the tags: field in frontmatter. The schema default([]) means they silently get empty tags, so they are invisible to tag filters, do not appear in RelatedPosts for other posts, and cannot have RelatedPosts generated for them.'
    artifacts:
      - path: 'src/content/blog/penetration-testing-kigali-enterprise-guide.mdx'
        issue: 'Missing tags: field in frontmatter (should be [penetration-testing, east-africa, security-strategy])'
      - path: 'src/content/blog/bnr-cybersecurity-compliance-2026.mdx'
        issue: 'Missing tags: field in frontmatter (should be [compliance, east-africa, banking-security])'
      - path: 'src/content/blog/cloud-security-east-africa-aws-azure.mdx'
        issue: 'Missing tags: field in frontmatter (should be [security-strategy, east-africa, penetration-testing])'
    missing:
      - "Add tags: ['penetration-testing', 'east-africa', 'security-strategy'] to penetration-testing-kigali-enterprise-guide.mdx frontmatter"
      - "Add tags: ['compliance', 'east-africa', 'banking-security'] to bnr-cybersecurity-compliance-2026.mdx frontmatter"
      - "Add tags: ['security-strategy', 'east-africa', 'penetration-testing'] to cloud-security-east-africa-aws-azure.mdx frontmatter"
human_verification:
  - test: 'Visit /blog/ and click tag filter buttons'
    expected: "3 new articles appear under their respective tag categories (e.g. bnr-cybersecurity-compliance-2026 should appear under 'compliance' and 'east-africa' after fix)"
    why_human: 'Tag filter is client-side JS — can verify source but not rendered behavior'
  - test: 'Visit /blog/penetration-testing-kigali-enterprise-guide/ and scroll below article body'
    expected: 'Related articles section appears with 2-3 posts sharing penetration-testing or east-africa tags (after fix)'
    why_human: 'RelatedPosts renders conditionally based on shared tag count at build time'
---

# Phase 8: Blog System and New Content — Verification Report

**Phase Goal:** The blog has a navigable structure with tag-based filtering, related posts, and read time — and new articles targeting Rwanda and East Africa cybersecurity keywords are live and indexed

**Verified:** 2026-03-18
**Status:** gaps_found — 4 of 5 success criteria verified; 3 new articles missing tags field
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Success Criteria)

| #   | Truth                                                                                                                    | Status   | Evidence                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Blog index page shows tag filters a visitor can click to narrow posts by category                                        | VERIFIED | `TagFilter.astro` (84 lines) integrated in `blog/index.astro` line 30; `data-tags` on wrapper divs line 34; JS show/hide on `.blog-card-wrapper` elements                               |
| 2   | Each blog post page shows a related posts section based on shared tags                                                   | VERIFIED | `RelatedPosts.astro` (106 lines) imported in `BlogPostLayout.astro` line 9, rendered line 150 with `currentSlug` and `currentTags={fm.tags \|\| []}`                                    |
| 3   | Read time estimate is visible on the blog index card and at the top of each post                                         | VERIFIED | `BlogCard.astro` line 22 renders `date · readTime`; `BlogPostLayout.astro` line 115 builds `metaDisplay` from `[metaLabel, readTime]`; all 19 posts have `readTime` field               |
| 4   | At least 3 new blog articles are live targeting geo-modified keywords                                                    | PARTIAL  | Files exist with substantive content (5359 words total) and correct geo keywords — but all 3 are missing `tags:` field, making them invisible to tag filters and unrelated-post scoring |
| 5   | A page or blog article covering USSD and mobile money security testing exists and is linked from the services navigation | VERIFIED | `/blog/mobile-money-security-testing/` exists (tagged, 16+ tags); `ServicesSection.astro` lines 79-86 link to it with label "MOBILE MONEY & USSD SECURITY"                              |

**Score:** 4/5 success criteria verified (SC-4 is partial due to missing tags on new articles)

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact                            | Expected                                    | Status   | Details                                                                                           |
| ----------------------------------- | ------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `src/content.config.ts`             | tags field in blog schema                   | VERIFIED | Line 25: `tags: z.array(z.string()).default([])`                                                  |
| `src/components/TagFilter.astro`    | Client-side tag filter buttons              | VERIFIED | 84 lines; pill buttons with data-tag, JS filtering, progressive enhancement                       |
| `src/components/RelatedPosts.astro` | Related posts grid based on shared tags     | VERIFIED | 106 lines; scores by shared tags, top 3, min 2 to render                                          |
| `src/pages/blog/index.astro`        | Blog index with tag filtering and read time | VERIFIED | Imports TagFilter, renders `<TagFilter tags={allTags} />`, `data-tags` on wrappers                |
| `src/layouts/BlogPostLayout.astro`  | Blog post layout with related posts section | VERIFIED | Imports RelatedPosts, renders `<RelatedPosts currentSlug={slug} currentTags={fm.tags \|\| []} />` |

### Plan 02 Artifacts

| Artifact                                                           | Expected               | Status         | Details                                                                                       |
| ------------------------------------------------------------------ | ---------------------- | -------------- | --------------------------------------------------------------------------------------------- |
| `src/content/blog/penetration-testing-kigali-enterprise-guide.mdx` | SEO article 120+ lines | STUB (partial) | 94 lines, 1659 words, valid frontmatter, geo keywords, internal links — but no `tags:` field  |
| `src/content/blog/bnr-cybersecurity-compliance-2026.mdx`           | SEO article 120+ lines | STUB (partial) | 98 lines, 1716 words, valid frontmatter, geo keywords, internal links — but no `tags:` field  |
| `src/content/blog/cloud-security-east-africa-aws-azure.mdx`        | SEO article 120+ lines | STUB (partial) | 121 lines, 1984 words, valid frontmatter, geo keywords, internal links — but no `tags:` field |

Note: "STUB (partial)" here means the content is substantive and valid — the issue is exclusively the missing `tags:` field, not placeholder content.

### Plan 03 Artifacts

| Artifact                                        | Expected                                 | Status                 | Details                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/Nav.astro`                      | Services nav with USSD/mobile money link | NOT MET (by plan spec) | Nav.astro does NOT contain mobile-money link; however the success criterion is satisfied via `ServicesSection.astro`           |
| `src/components/sections/ServicesSection.astro` | Mobile money secondary link bar          | VERIFIED               | Lines 79-86: `<a href="/blog/mobile-money-security-testing/" class="training-card">` with "MOBILE MONEY & USSD SECURITY" label |

---

## Key Link Verification

### Plan 01 Key Links

| From                               | To                                  | Via                                  | Status | Details                                                                                                     |
| ---------------------------------- | ----------------------------------- | ------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------- |
| `src/content.config.ts`            | `src/content/blog/*.mdx`            | Zod schema `tags: z.array`           | WIRED  | Line 25 in content.config.ts; 16 of 19 posts have explicit tags, 3 new posts use the `default([])` silently |
| `src/pages/blog/index.astro`       | `src/components/TagFilter.astro`    | Component import + tags prop         | WIRED  | Line 7 import, line 14 allTags derivation, line 30 render `<TagFilter tags={allTags} />`                    |
| `src/layouts/BlogPostLayout.astro` | `src/components/RelatedPosts.astro` | Component import + current post tags | WIRED  | Line 9 import, line 150 render with slug and tags                                                           |

### Plan 02 Key Links

| From                                              | To                                | Via                   | Status | Details                                                            |
| ------------------------------------------------- | --------------------------------- | --------------------- | ------ | ------------------------------------------------------------------ |
| `penetration-testing-kigali-enterprise-guide.mdx` | `/services/penetration-testing/`  | Internal link in body | WIRED  | Line 92: `[penetration testing](/services/penetration-testing/)`   |
| `bnr-cybersecurity-compliance-2026.mdx`           | `/services/security-assessments/` | Internal link in body | WIRED  | Line 96: `[security assessments](/services/security-assessments/)` |
| `cloud-security-east-africa-aws-azure.mdx`        | `/services/penetration-testing/`  | Internal link in body | WIRED  | Line 119: `[penetration testing](/services/penetration-testing/)`  |

### Plan 03 Key Links

| From                                            | To                                     | Via                | Status     | Details                                                                                                                              |
| ----------------------------------------------- | -------------------------------------- | ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/Nav.astro`                      | `/blog/mobile-money-security-testing/` | Nav dropdown/link  | NOT IN NAV | Nav.astro links to `servicesHref` (#services anchor), not a direct USSD link — but this is a plan spec deviation, not a goal failure |
| `src/components/sections/ServicesSection.astro` | `/blog/mobile-money-security-testing/` | Secondary link bar | WIRED      | Lines 79-86 confirmed                                                                                                                |

---

## Requirements Coverage

| Requirement | Source Plan | Description                                                                | Status              | Evidence                                                                                                                                               |
| ----------- | ----------- | -------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SRVC-07     | 08-01       | Blog tag/category system with filtering on blog index                      | SATISFIED           | TagFilter component fully wired; 16/19 posts tagged; allTags computed and rendered                                                                     |
| SRVC-08     | 08-01       | Related posts feature on each blog post based on shared tags               | SATISFIED           | RelatedPosts wired in BlogPostLayout; scores by shared tags; renders for 16 tagged posts                                                               |
| SRVC-09     | 08-02       | At least 3 new SEO-optimized articles targeting Rwanda/East Africa         | PARTIALLY SATISFIED | 3 articles exist with correct geo keywords and substantive content, but missing tags means they are excluded from tag filters and related post scoring |
| SRVC-10     | 08-01       | Read time displayed on blog index and blog post pages                      | SATISFIED           | readTime shown on BlogCard (date line), BlogPostLayout (meta line), all 19 posts have readTime field                                                   |
| SRVC-11     | 08-03       | USSD/mobile money security testing content linked from services navigation | SATISFIED           | Link in ServicesSection (services area on homepage); mobile-money-security-testing.mdx exists with full content and tags                               |

---

## Anti-Patterns Found

| File                                              | Line        | Pattern               | Severity | Impact                                                                                                |
| ------------------------------------------------- | ----------- | --------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `penetration-testing-kigali-enterprise-guide.mdx` | frontmatter | Missing `tags:` field | Warning  | Article not filterable by tag; no related posts generated for it; other posts won't see it as related |
| `bnr-cybersecurity-compliance-2026.mdx`           | frontmatter | Missing `tags:` field | Warning  | Same impact as above                                                                                  |
| `cloud-security-east-africa-aws-azure.mdx`        | frontmatter | Missing `tags:` field | Warning  | Same impact as above                                                                                  |

The schema `default([])` prevents a build failure, masking the omission. The content itself is not a stub — all 3 articles are substantive (1600-2000 words each) with proper geo-targeted keywords.

---

## Human Verification Required

### 1. Tag filter shows 3 new articles (after fix)

**Test:** Visit `/blog/` and click the "east-africa" tag button
**Expected:** `penetration-testing-kigali-enterprise-guide`, `bnr-cybersecurity-compliance-2026`, and `cloud-security-east-africa-aws-azure` cards are visible; others are hidden
**Why human:** Client-side JS filtering cannot be verified without a browser

### 2. Related posts on new articles (after fix)

**Test:** Visit `/blog/penetration-testing-kigali-enterprise-guide/` and scroll past the article body
**Expected:** "Related articles" section appears with 2-3 cards from posts tagged `penetration-testing` or `east-africa`
**Why human:** RelatedPosts rendering is conditional on tag scoring at build time; requires browser to confirm

### 3. USSD service link is visually accessible from homepage

**Test:** Visit `/` and scroll to the Services section
**Expected:** "MOBILE MONEY & USSD SECURITY" link bar is visible below the 4 main service cards, linking to `/blog/mobile-money-security-testing/`
**Why human:** Visual placement and discoverability cannot be verified from source code alone

---

## Gaps Summary

The phase delivers a functionally complete blog system: tag filtering works for 16 of 19 posts, RelatedPosts is wired throughout, read time is visible everywhere, and USSD/mobile money content is linked from the services area.

The single gap is that the 3 new articles written in Plan 02 (`penetration-testing-kigali-enterprise-guide.mdx`, `bnr-cybersecurity-compliance-2026.mdx`, `cloud-security-east-africa-aws-azure.mdx`) were created without the `tags:` field in their frontmatter. The Plan 02 SUMMARY noted this was a known deviation: "Omitted tags field from frontmatter initially as schema update from Plan 01 was not yet applied; Plan 01 was found already committed so tags were preserved by linter" — but the linter preserved nothing; the tags field was simply never added.

**Root cause:** Plan 02 executed in parallel with Plan 01 (both `depends_on: []`). The writer created the articles before Plan 01's schema update was available and never backfilled the tags after Plan 01 committed.

**Impact:** Low severity for the articles' SEO value (content and keywords are correct). Medium severity for the blog system's coherence: the tag filter will show zero results for these articles under any tag, and no other post will list them as related. The `default([])` schema silently absorbs the omission without a build error, so it was not caught.

**Fix:** Add `tags:` arrays to the frontmatter of the 3 affected files (a 3-line change, one per file).

---

_Verified: 2026-03-18_
_Verifier: Claude (gsd-verifier)_
