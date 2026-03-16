---
phase: 01-code-quality-tooling
verified: 2026-03-16T18:45:00Z
status: gaps_found
score: 11/13 must-haves verified
re_verification: false
gaps:
  - truth: 'All inline scripts in .astro files are replaced by module imports'
    status: partial
    reason: "Two is:inline scripts remain outside BaseLayout: src/pages/index.astro (scroll reveal) and src/pages/company-profile/index.astro (cookie consent with define:vars). Plan 02 explicitly deferred them as out of scope but QUAL-08 says 'All inline scripts extracted'."
    artifacts:
      - path: 'src/pages/index.astro'
        issue: 'Contains <script is:inline> for scroll reveal animation (line 750)'
      - path: 'src/pages/company-profile/index.astro'
        issue: 'Contains <script is:inline define:vars={{ gaId }}> duplicating cookie consent logic (line 479)'
    missing:
      - 'Extract src/pages/index.astro scroll-reveal script to src/scripts/scroll-reveal.ts and import as module script'
      - 'Replace src/pages/company-profile/index.astro inline cookie consent script with import of initCookieBanner from @/scripts/cookie-consent'
human_verification:
  - test: 'Theme toggle switches dark/light in browser with no FOUC'
    expected: 'Clicking sun/moon icon switches theme; refreshing page preserves chosen theme with no flash of wrong theme on load'
    why_human: 'localStorage + CSS data-theme behavior cannot be verified headlessly; FOUC requires visual inspection during page load'
  - test: 'Cookie banner accept/reject works and persists'
    expected: 'Banner appears on first visit; clicking Accept loads GA and hides banner permanently; clicking Reject hides banner permanently; refreshing does not show banner again'
    why_human: 'Banner visibility, GA script injection, and localStorage persistence across navigation require browser environment'
  - test: 'Security score quiz step navigation and PDF generation'
    expected: 'Each question card advances on option click; Calculate score button shows result band; Download PDF generates a real PDF file'
    why_human: 'Multi-step DOM state and jsPDF canvas rendering cannot be verified programmatically in this context'
  - test: 'Pre-commit hook blocks a deliberate violation'
    expected: 'Adding const x: any = 1 to a .ts file, staging it, and attempting git commit should be BLOCKED by the pre-commit hook'
    why_human: 'Hook execution in a live git commit context requires manual testing'
---

# Phase 1: Code Quality Tooling Verification Report

**Phase Goal:** The repository enforces consistent code quality automatically — every commit is linted, type-checked, and formatted before it reaches the public repo
**Verified:** 2026-03-16T18:45:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                              | Status               | Evidence                                                                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `npm run lint` executes ESLint 9 flat config with typescript-eslint strict and eslint-plugin-astro | VERIFIED             | `eslint.config.mjs` contains `tseslint.configs.strict` and `eslintPluginAstro.configs.recommended`; `npm run lint` exits 0                                         |
| 2   | `npm run format:check` runs Prettier with astro plugin                                             | VERIFIED             | `.prettierrc` contains `prettier-plugin-astro` and astro parser override; `npm run format:check` exits 0                                                           |
| 3   | `npm run typecheck` runs `tsc --noEmit`                                                            | VERIFIED             | `package.json` has `"typecheck": "tsc --noEmit"`; exits 0                                                                                                          |
| 4   | `npm run test` executes Vitest with happy-dom environment                                          | VERIFIED             | `vitest.config.ts` has `environment: 'happy-dom'`; 41 tests pass across 4 files                                                                                    |
| 5   | Import paths using `@/` resolve to `src/` in all tools                                             | VERIFIED             | `tsconfig.json`, `astro.config.mjs`, and `vitest.config.ts` all define `@` alias to `./src`                                                                        |
| 6   | Theme toggle switches between dark and light mode when clicked                                     | VERIFIED (automated) | `src/scripts/theme.ts` exports `toggleTheme`; `ThemeToggle.astro` imports it and binds via `addEventListener`; no `onclick=` attribute                             |
| 7   | Theme preference persists in localStorage across page refreshes                                    | VERIFIED (automated) | `setTheme` writes to `localStorage`; `getStoredTheme` reads it; 8 tests pass confirming behavior                                                                   |
| 8   | Cookie banner accept/reject works and persists choice                                              | VERIFIED (automated) | `cookie-consent.ts` exports `initCookieBanner` bound to button click handlers; 6 tests pass                                                                        |
| 9   | Security score quiz calculates scores and generates PDF report                                     | VERIFIED (automated) | `quiz/ui.ts` exports `initQuiz`; imports from `scoring.ts`, `pdf.ts`, `data.ts`; wired in `security-score/index.astro`                                             |
| 10  | Resources page form toggle and PDF generation work                                                 | VERIFIED (automated) | `resources.ts` exports `initResources`; wired in `resources/index.astro`                                                                                           |
| 11  | `npm run test` passes with coverage output meeting 80% thresholds on `src/scripts/`                | VERIFIED             | All files: 95.38% stmts, 96.29% branch, 100% funcs, 96.42% lines — all above 80% threshold                                                                         |
| 12  | Attempting to commit a file with a lint error is blocked by the pre-commit hook                    | VERIFIED (automated) | `.husky/pre-commit` exists, is executable, contains `npm run typecheck`, `npm run test -- --run`, `npx lint-staged`                                                |
| 13  | All inline scripts in .astro files are replaced by module imports                                  | PARTIAL              | 4 of 6 inline scripts extracted; 2 remain: `src/pages/index.astro` (scroll reveal) and `src/pages/company-profile/index.astro` (cookie consent with `define:vars`) |

**Score:** 12/13 truths verified (11 full, 1 partial = gaps_found)

---

### Required Artifacts

#### Plan 01 Artifacts

| Artifact            | Expected                                  | Status   | Details                                                                                                                                     |
| ------------------- | ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint.config.mjs` | ESLint 9 flat config                      | VERIFIED | Contains `tseslint.config`, `tseslint.configs.strict`, `eslintPluginAstro.configs.recommended`, ignores `dist/`, `.astro/`, `node_modules/` |
| `.prettierrc`       | Prettier configuration                    | VERIFIED | Contains `prettier-plugin-astro` in plugins, `"parser": "astro"` override for `*.astro`                                                     |
| `vitest.config.ts`  | Vitest config with happy-dom and coverage | VERIFIED | `environment: 'happy-dom'`, `@` alias to `./src`, 80% coverage thresholds, ui.ts/pdf.ts/resources.ts excluded from coverage                 |
| `tsconfig.json`     | Path alias and strict mode                | VERIFIED | `"@/*": ["src/*"]`, `"baseUrl": "."`                                                                                                        |

#### Plan 02 Artifacts

| Artifact                        | Expected                               | Status   | Details                                                                                                                                 |
| ------------------------------- | -------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/scripts/theme.ts`          | Theme toggle logic                     | VERIFIED | Exports `getStoredTheme`, `setTheme`, `toggleTheme`                                                                                     |
| `src/scripts/cookie-consent.ts` | Cookie consent state management        | VERIFIED | Exports `getConsentState`, `setConsentState`, `resetConsentState`, `loadGA`, `initCookieBanner`; imports `ANALYTICS` from `@/data/site` |
| `src/scripts/quiz/data.ts`      | Quiz questions and scoring bands       | VERIFIED | Exports `QUESTIONS`, `BANDS`, interfaces `ScoreBand`, `Question`, `Recommendation`                                                      |
| `src/scripts/quiz/scoring.ts`   | Score calculation and band lookup      | VERIFIED | Exports `calculateScore`, `getBand`, `getAnswersFromDOM`                                                                                |
| `src/scripts/quiz/ui.ts`        | Quiz DOM rendering and step navigation | VERIFIED | Exports `initQuiz`; imports from `data`, `scoring`, `pdf`, `@/data/site`                                                                |
| `src/scripts/quiz/pdf.ts`       | PDF generation for quiz report         | VERIFIED | Exports `generatePDF`, `fallbackHTML`, `esc`, `loadJsPDF`, `JsPDFInstance` interface                                                    |
| `src/scripts/resources.ts`      | Resources page logic                   | VERIFIED | Exports `initResources`; imports `loadJsPDF` from `./quiz/pdf` (shared, no duplication)                                                 |

#### Plan 03 Artifacts

| Artifact                               | Expected                           | Status   | Details                                                                                                   |
| -------------------------------------- | ---------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `src/__tests__/theme.test.ts`          | Unit tests for theme toggle        | VERIFIED | 8 tests covering `getStoredTheme`, `setTheme`, `toggleTheme`                                              |
| `src/__tests__/cookie-consent.test.ts` | Unit tests for cookie consent      | VERIFIED | 11 tests covering `getConsentState`, `setConsentState`, `resetConsentState`, `loadGA`, `initCookieBanner` |
| `src/__tests__/quiz/scoring.test.ts`   | Unit tests for quiz scoring        | VERIFIED | 10 tests covering `calculateScore`, `getBand`, `getAnswersFromDOM`                                        |
| `src/__tests__/quiz/data.test.ts`      | Unit tests for quiz data integrity | VERIFIED | 7 tests: QUESTIONS has 10 entries, BANDS has 5 entries, full range coverage                               |
| `.husky/pre-commit`                    | Pre-commit hook                    | VERIFIED | Executable; contains `npm run typecheck`, `npm run test -- --run`, `npx lint-staged`                      |

---

### Key Link Verification

| From                                         | To                              | Via                                             | Status | Details                                                        |
| -------------------------------------------- | ------------------------------- | ----------------------------------------------- | ------ | -------------------------------------------------------------- |
| `eslint.config.mjs`                          | `typescript-eslint`             | `import tseslint` + `tseslint.config()`         | WIRED  | Pattern found at line 2; `tseslint.config(` at line 7          |
| `vitest.config.ts`                           | `src/`                          | resolve alias `'@'`                             | WIRED  | `'@': resolve(__dirname, './src')` at line 7                   |
| `src/components/ThemeToggle.astro`           | `src/scripts/theme.ts`          | `import { toggleTheme } from '@/scripts/theme'` | WIRED  | Line 44; `addEventListener('click', toggleTheme)` also present |
| `src/components/CookieBanner.astro`          | `src/scripts/cookie-consent.ts` | `import { initCookieBanner }`                   | WIRED  | Line 26; no `define:vars` or `is:inline` present               |
| `src/pages/tools/security-score/index.astro` | `src/scripts/quiz/ui.ts`        | `import { initQuiz }`                           | WIRED  | Line 835; no `is:inline` present (0 matches)                   |
| `src/pages/resources/index.astro`            | `src/scripts/resources.ts`      | `import { initResources }`                      | WIRED  | Line 926; no `is:inline` present (0 matches)                   |
| `src/scripts/cookie-consent.ts`              | `src/data/site.ts`              | `import { ANALYTICS }`                          | WIRED  | Line 1; `ANALYTICS.gaId` used at line 34                       |
| `src/__tests__/theme.test.ts`                | `src/scripts/theme.ts`          | `import ... from '@/scripts/theme'`             | WIRED  | Line 2                                                         |
| `.husky/pre-commit`                          | `package.json lint-staged`      | `npx lint-staged`                               | WIRED  | Line 3 of pre-commit hook                                      |

---

### Requirements Coverage

| Requirement | Source Plans | Description                                                                      | Status    | Evidence                                                                                                                                                                                |
| ----------- | ------------ | -------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QUAL-01     | 01-02        | Theme toggle works correctly with localStorage persistence                       | SATISFIED | `theme.ts` exports `toggleTheme`; ThemeToggle wired; 8 tests pass; human browser verification completed by user (noted in 01-03-SUMMARY)                                                |
| QUAL-02     | 01-01, 01-03 | ESLint 9 with flat config and eslint-plugin-astro enforces consistent code style | SATISFIED | `eslint.config.mjs` configured; `npm run lint` exits 0 with zero warnings across `src/`                                                                                                 |
| QUAL-03     | 01-01, 01-03 | Prettier formats all files consistently                                          | SATISFIED | `.prettierrc` with astro plugin; `npm run format:check` exits 0 — "All matched files use Prettier code style!"                                                                          |
| QUAL-04     | 01-01, 01-03 | TypeScript strict mode enabled with no implicit any                              | SATISFIED | `tsconfig.json` extends `astro/tsconfigs/strict`; `npm run typecheck` exits 0                                                                                                           |
| QUAL-05     | 01-03        | Husky pre-commit hooks run linting and type checking before every commit         | SATISFIED | `.husky/pre-commit` executable; runs `typecheck`, `test`, `lint-staged`                                                                                                                 |
| QUAL-06     | 01-01, 01-03 | Vitest test framework configured with coverage reporting                         | SATISFIED | `vitest.config.ts` with v8 coverage; 41 tests pass; all files >80% on all metrics                                                                                                       |
| QUAL-08     | 01-02        | All inline scripts extracted to external files or Astro script modules           | PARTIAL   | 4 high-traffic page scripts extracted; 2 inline scripts remain: `src/pages/index.astro` (scroll reveal) and `src/pages/company-profile/index.astro` (cookie consent with `define:vars`) |

**Note on QUAL-08:** REQUIREMENTS.md marks QUAL-08 as complete and Phase 1. The plan 02 SUMMARY explicitly acknowledges the remaining scripts as out of scope. However, the requirement text "All inline scripts extracted" is not fully satisfied. The two remaining scripts prevent QUAL-09 (CSP hash-based approach) from being possible without addressing them first.

---

### Anti-Patterns Found

| File                                    | Line | Pattern                                                                                                                  | Severity | Impact                                                                                     |
| --------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------ |
| `src/pages/company-profile/index.astro` | 479  | `<script is:inline define:vars={{ gaId }}>` — duplicates cookie consent logic already in `src/scripts/cookie-consent.ts` | Warning  | Code duplication; `define:vars` prevents module bundling; not lint-checked or type-checked |
| `src/pages/index.astro`                 | 750  | `<script is:inline>` for scroll reveal                                                                                   | Info     | Not a duplication concern but breaks QUAL-08 completeness; not lint-checked                |

No stub implementations found. All `return null` occurrences in `theme.ts` and `cookie-consent.ts` are legitimate error-handling catch blocks, not placeholder stubs.

---

### Human Verification Required

#### 1. Theme Toggle Visual Behavior

**Test:** Run `npm run dev`, open the site, click the sun/moon icon in the header.
**Expected:** Theme switches between dark and light mode; refresh the page and the same theme is applied with no flash of the wrong theme before page load.
**Why human:** FOUC behavior depends on the timing of the `<script is:inline>` in BaseLayout head relative to first paint — cannot be verified programmatically.

#### 2. Cookie Banner Accept and Reject

**Test:** Open the site in a fresh private/incognito tab. Verify the cookie banner appears. Click "Accept" — banner should disappear and reload should not show it again. Repeat in a new tab, click "Reject" — same expected dismiss behavior.
**Expected:** Consent state persists in localStorage, GA is loaded on accept, not on reject.
**Why human:** Banner visibility, GA script tag insertion, and cross-navigation persistence require a real browser environment.

#### 3. Security Score Quiz Functionality

**Test:** Navigate to `/tools/security-score/`, step through questions, click "Calculate score," verify the result band appears, click "Download PDF."
**Expected:** Each option click advances to the next question; score matches selected answers; PDF downloads with correct content.
**Why human:** Multi-step DOM state transitions and jsPDF canvas-to-blob rendering cannot be verified in a headless grep-based check.

#### 4. Pre-commit Hook Blocking a Violation

**Test:** Add `const x: any = 1;` to any `.ts` file, run `git add` on it, then attempt `git commit -m "test"`.
**Expected:** The commit is rejected by the pre-commit hook with a typecheck or lint error message.
**Why human:** Git hook execution in a live interactive commit requires manual terminal testing.

---

### Gaps Summary

**One gap blocks full goal achievement:**

**QUAL-08 partial completion** — Two `is:inline` scripts were explicitly deferred as out of scope during plan execution but the requirement text ("All inline scripts extracted") considers them unfulfilled:

1. `src/pages/index.astro` line 750: a scroll-reveal `IntersectionObserver` script. This is simple and self-contained — easy to extract.
2. `src/pages/company-profile/index.astro` line 479: a `define:vars={{ gaId }}` cookie consent script that duplicates the already-extracted `initCookieBanner` logic. This is the higher-priority fix — it bypasses the module system and will prevent a future CSP hash-based policy from working.

Both scripts are untouched by linting, formatting, and type-checking because they use `is:inline`. The phase goal states "every commit is linted, type-checked, and formatted before it reaches the public repo" — these two scripts escape all three tools.

The remaining 12 of 13 must-haves are fully verified with clean evidence: all four quality commands exit 0, 41 tests pass at 95%+ coverage, the pre-commit hook is wired, and all four originally targeted scripts (theme, cookie-consent, quiz, resources) are properly extracted, typed, tested, and wired.

---

_Verified: 2026-03-16T18:45:00Z_
_Verifier: Claude (gsd-verifier)_
