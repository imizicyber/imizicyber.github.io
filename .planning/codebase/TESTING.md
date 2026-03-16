# Testing Patterns

**Analysis Date:** 2026-03-16

## Test Framework

**Runner:** Not detected

No test runner is configured in this project. No `jest.config.*`, `vitest.config.*`, or test framework dependencies are present in `package.json`.

**Assertion Library:** Not applicable

**Run Commands:** None available

This is a static site generator (Astro) with no automated test suite. Testing would be manual or via build validation.

## Test File Organization

**Location:** Not applicable

No test files detected. Glob pattern search for `*.test.*` and `*.spec.*` files returned no results.

**Naming:** Not applicable

**Structure:** Not applicable

## Testing Strategy

**Current Approach:**
- Build validation: `npm run build` validates all pages compile and TypeScript checks pass
- No unit, integration, or E2E tests configured
- Manual testing of components and pages during development

**Build Validation via Astro:**
- TypeScript strict mode (`astro/tsconfigs/strict`) catches type errors at build time
- MDX/MDX collection schema validation (`src/content.config.ts`) ensures blog frontmatter is correct
- Astro build failure on syntax/compilation errors

**Example validation from `src/content.config.ts`:**
```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    headline: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    datePublished: z.string(),
    dateModified: z.string().optional(),
    // ...
  }),
});
```

This schema validates all blog content at build time, preventing invalid frontmatter from being deployed.

## Manual Testing Areas

**Components:**
- Interactive components in `src/components/` rely on inline scripts tested manually
- Examples:
  - `CookieBanner.astro`: Cookie consent localStorage logic and GA loading
  - `ContactForm.astro`: Form submission to Formspree API
  - `Nav.astro`: Mobile menu toggle and link navigation
  - `ThemeToggle.astro`: Dark/light theme switching

**Layouts:**
- `src/layouts/BaseLayout.astro`: CSP headers, meta tags, theme initialization
- `src/layouts/BlogPostLayout.astro`: Schema generation for structured data
- Manual verification that schemas render correctly in search console

**Pages:**
- `src/pages/` components tested via browser visit to ensure routing works
- Dynamic routes like `src/pages/blog/[...slug].astro` tested with actual blog posts

## Browser Testing Indicators

**localStorage Testing (CookieBanner):**
```javascript
try{
  var c=localStorage.getItem('imizi-cookie-consent');
  if(c==='accepted') window.loadGA();
  else if(c!=='rejected'){
    var b=document.getElementById('cookie-banner');
    b.classList.add('visible');
    b.querySelector('.btn-reject').focus();
  }
}catch(e){
  document.getElementById('cookie-banner').classList.add('visible');
}
```

Manual testing would verify:
1. Cookie banner shows on first visit
2. Accept/Reject buttons save to localStorage
3. GA loads when `imizi-cookie-consent` is `'accepted'`
4. Subsequent visits respect saved preference

**Form Submission Testing (ContactForm):**
```javascript
fetch(formspreeUrl, {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' }
}).then(function(r){
  if(r.ok){ ok.style.display = 'block'; form.reset(); btn.textContent = 'Sent!'; }
  else { err.style.display = 'block'; btn.textContent = 'Send enquiry'; btn.disabled = false; }
}).catch(function(){
  err.style.display = 'block'; btn.textContent = 'Send enquiry'; btn.disabled = false;
});
```

Manual testing would verify:
1. Form submission succeeds with valid data
2. Success message displays
3. Network failures show error message
4. Button state management (disabled during submission, reset on error)

**Theme Toggle Testing (ThemeToggle + BaseLayout):**
```javascript
// In BaseLayout (theme initialization)
(function(){
  try{var s=localStorage.getItem('imizi-theme');if(s)document.documentElement.dataset.theme=s}catch(e){}
})();

// In ThemeToggle (assumed toggle function in global scope)
// onclick="toggleTheme()"
```

Manual testing would verify:
1. Theme toggle button switches between sun/moon icons
2. Selected theme persists to localStorage
3. Subsequent page loads use saved theme
4. Light theme CSS activates (`[data-theme="light"]` selector)

## Build Validation

**Astro Build Process:**
```bash
npm run build
```

This runs Astro's build, which:
1. Validates all TypeScript in components and layouts
2. Checks all MDX files against `content.config.ts` schema
3. Generates static HTML for all routes
4. Bundles CSS and JavaScript

**Potential Issues Caught:**
- Missing imports or undefined variables
- Type mismatches in component Props
- Invalid frontmatter in blog posts
- Broken internal links (if validated by plugin)
- Unreachable routes

## Development Testing

**Watch Mode:**
```bash
npm run dev
```

Runs Astro dev server with hot module reloading. Manual browser testing during development:
1. Navigate to `http://localhost:3000` (or configured port)
2. Test component interactions (mobile menu, theme toggle, forms)
3. Verify CSS applies correctly
4. Check responsive behavior across breakpoints

## Testing Gaps

**No Automated Testing For:**
- Component render output validation
- Interactive behavior (click handlers, state changes)
- Form submission success/failure scenarios
- API integration (Formspree, Google Analytics)
- Accessibility (a11y) checks
- Visual regression testing
- Performance metrics (Lighthouse)

**Risk Areas Without Tests:**
- `src/components/ContactForm.astro`: Formspree integration untested; network errors only caught at runtime
- `src/components/CookieBanner.astro`: Cookie consent logic untested; privacy compliance depends on manual verification
- `src/layouts/BlogPostLayout.astro`: Schema generation untested; malformed JSON-LD only caught when indexed by search engines
- `src/components/Nav.astro`: Mobile menu toggle untested on various devices/browsers

## Recommended Testing Strategy

To improve test coverage without major infrastructure changes:

**Option 1: Vitest for Unit Tests (Low-Effort)**
- Install: `npm install -D vitest`
- Create tests for data transforms: `src/data/site.ts`, schema validation in `content.config.ts`
- Test utility functions if extracted
- No need to test Astro components directly; build validation covers most errors

**Option 2: Playwright for E2E Tests (Medium-Effort)**
- Install: `npm install -D @playwright/test`
- Test interactive components: form submission, mobile menu, theme toggle
- Test user flows: navigate to blog, read post, fill contact form
- Run against staging before deployment

**Option 3: Accessibility Testing (Low-Effort)**
- Add `axe-core` via Playwright or standalone
- Validate ARIA labels, semantic HTML, color contrast
- Critical for CookieBanner, Nav, and ContactForm accessibility

---

*Testing analysis: 2026-03-16*
