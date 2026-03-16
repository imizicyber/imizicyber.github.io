# Phase 1: Code Quality Tooling - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish linting, type checking, formatting, and test infrastructure as the non-negotiable foundation for safe refactoring. Fix the broken theme toggle. Extract all inline scripts to external files. Every commit is linted, type-checked, formatted, and tested before it reaches the public repo.

Requirements: QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06, QUAL-08

</domain>

<decisions>
## Implementation Decisions

### Linting Strictness
- Fix ALL existing violations in Phase 1 — clean slate, no legacy debt tolerated
- Strict ESLint rules: eslint:recommended + typescript-eslint strict + eslint-plugin-astro recommended
- This is a public repo for a cybersecurity firm — code quality is a credibility signal
- Add `@/` path alias (tsconfig + astro config) to replace deep relative imports

### Script Extraction
- All extracted scripts go to `src/scripts/` directory (central, easy to find and test)
- Full extraction for security-score quiz: separate modules for quiz data, scoring logic, and PDF generation
- CookieBanner, BaseLayout theme init, and resources page scripts also extracted to `src/scripts/`
- Each script module should be independently testable

### Test Baseline
- Configure Vitest AND write unit tests for extracted scripts (quiz scoring, cookie consent logic, theme toggle)
- Enforce minimum coverage threshold that blocks commits
- Coverage reporting enabled from day one
- Phase 2 adds Playwright E2E tests on top of this foundation

### Pre-commit Scope
- Full gate: lint + type-check + format check + run tests — nothing bad gets through
- Prettier auto-fixes staged files on commit via lint-staged (no manual formatting ever)
- Husky pre-commit hook runs the full gate
- If any check fails, commit is blocked

### Claude's Discretion
- Exact ESLint rule configuration beyond strict presets
- Coverage threshold percentage (recommend 80%)
- Vitest configuration details (happy-dom vs jsdom for DOM testing)
- Exact Prettier configuration (tab width, semicolons, etc.)
- lint-staged glob patterns

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Project vision, core value, constraints (public repo, GitHub Pages)
- `.planning/REQUIREMENTS.md` — QUAL-01 through QUAL-08 requirement definitions
- `.planning/config.json` — Workflow settings (fine granularity, parallel execution)

### Codebase State
- `.planning/codebase/CONVENTIONS.md` — Current naming patterns, import order, code style (no linter configured)
- `.planning/codebase/STRUCTURE.md` — Directory layout, file naming, where to add new code
- `.planning/codebase/CONCERNS.md` — Known issues: broken theme toggle, inline scripts, no tests, no linting
- `.planning/codebase/STACK.md` — Current tech stack: Astro 6.0.4, Node 22, TypeScript strict

### Research
- `.planning/research/STACK.md` — Recommended tooling: Vitest, Playwright, ESLint 9 flat config, Prettier
- `.planning/research/PITFALLS.md` — Public repo credibility risk, eslint-plugin-astro compatibility flag

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/site.ts`: Centralized constants — could serve as pattern for extracting quiz data
- `src/content.config.ts`: Zod schema validation — shows TypeScript strict already works in the codebase
- `tsconfig.json`: Already extends `astro/tsconfigs/strict` — TypeScript strict mode is partially in place

### Established Patterns
- PascalCase components, camelCase data files, kebab-case pages
- No barrel files — direct imports to specific files
- Component-scoped `<style>` blocks + `src/styles/global.css` for global styles
- IIFE patterns in inline scripts for initialization

### Integration Points
- `src/layouts/BaseLayout.astro` (line ~116-120): Theme init inline script — must be extracted carefully to preserve FOUC prevention
- `src/components/CookieBanner.astro` (line ~19): Cookie consent inline script — coupled to DOM IDs
- `src/components/ThemeToggle.astro` (line ~7): References `toggleTheme()` that may not exist — needs fix
- `src/pages/tools/security-score/index.astro` (lines 322-649): Largest inline script — quiz data, logic, PDF gen
- `src/pages/resources/index.astro` (line ~423): Resource page inline script
- `package.json`: No test/lint scripts exist yet — need to add `lint`, `format`, `typecheck`, `test` scripts

### Files That Will Change
- `package.json` — Add dev dependencies (ESLint, Prettier, Vitest, Husky, lint-staged)
- `tsconfig.json` — Add `@/` path alias
- `astro.config.mjs` — Add path alias resolution
- All `.astro` files — Lint fixes and import path updates
- New files: `eslint.config.js`, `.prettierrc`, `.prettierignore`, `vitest.config.ts`, `.husky/pre-commit`
- New directory: `src/scripts/` with extracted script modules
- New directory: `tests/` or `src/__tests__/` for unit tests

</code_context>

<specifics>
## Specific Ideas

- Public repo is the credibility surface — a CISO evaluating Imizi Cyber will look at the code quality
- "No mistakes allowed" — this is the face of the company
- Full gate pre-commit: the user wants maximum strictness, no shortcuts
- Fix everything now, not gradually — clean slate approach

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-code-quality-tooling*
*Context gathered: 2026-03-16*
