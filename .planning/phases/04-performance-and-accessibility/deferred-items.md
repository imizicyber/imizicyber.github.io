# Phase 04 Deferred Items

## Duplicate main#main elements

- **Found during:** Plan 04-03, Task 2
- **Issue:** Pages have duplicate `<main id="main">` elements -- one from BaseLayout.astro wrapping the slot, and another from page-level markup (e.g., `index.astro` line 233, `BlogPostLayout.astro`). This causes strict mode violations when tests use `page.locator('main')`.
- **Failing test:** `e2e/blog.spec.ts:26` -- "blog post page has content and article body" fails with strict mode violation (2 `main` elements)
- **Root cause:** Plan 04-02 added `<main id="main" role="main">` to BaseLayout, but individual pages already had their own `<main id="main">` wrappers.
- **Fix:** Remove the page-level `<main id="main">` from `src/pages/index.astro` and other pages since BaseLayout now provides it. Or update the blog test to use `page.locator('main').first()`.
- **Impact:** Low -- only affects strict mode locator resolution in E2E tests
