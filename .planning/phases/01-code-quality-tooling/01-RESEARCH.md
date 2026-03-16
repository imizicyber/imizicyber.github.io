# Phase 1: Code Quality Tooling - Research

**Researched:** 2026-03-16
**Domain:** Linting, type checking, formatting, testing, pre-commit hooks, script extraction
**Confidence:** HIGH

## Summary

This phase establishes the code quality foundation for a public-facing cybersecurity firm website built with Astro 6.0.4. The codebase currently has zero linting, no formatter, no tests, and no pre-commit hooks. All inline scripts (theme toggle, cookie banner, security quiz, resources page) must be extracted to `src/scripts/` for testability. The theme toggle is broken (`toggleTheme()` is referenced but never defined).

The toolchain is well-established: ESLint 9 flat config with `eslint-plugin-astro` and `typescript-eslint` v8 for linting, Prettier 3 with `prettier-plugin-astro` for formatting, Vitest 4 with `happy-dom` for unit tests, and Husky 9 + lint-staged 16 for pre-commit gates. All tools have verified ESLint 9 flat config support. The `typescript-eslint` unified package (`typescript-eslint`) replaces the old separate `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin` packages.

**Primary recommendation:** Install the full quality toolchain, extract all inline scripts to `src/scripts/` modules, fix the broken theme toggle, write unit tests for extracted modules, and wire up a pre-commit hook that blocks bad code from reaching the public repo.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Fix ALL existing violations in Phase 1 -- clean slate, no legacy debt tolerated
- Strict ESLint rules: eslint:recommended + typescript-eslint strict + eslint-plugin-astro recommended
- This is a public repo for a cybersecurity firm -- code quality is a credibility signal
- Add `@/` path alias (tsconfig + astro config) to replace deep relative imports
- All extracted scripts go to `src/scripts/` directory (central, easy to find and test)
- Full extraction for security-score quiz: separate modules for quiz data, scoring logic, and PDF generation
- CookieBanner, BaseLayout theme init, and resources page scripts also extracted to `src/scripts/`
- Each script module should be independently testable
- Configure Vitest AND write unit tests for extracted scripts (quiz scoring, cookie consent logic, theme toggle)
- Enforce minimum coverage threshold that blocks commits
- Coverage reporting enabled from day one
- Phase 2 adds Playwright E2E tests on top of this foundation
- Full gate: lint + type-check + format check + run tests -- nothing bad gets through
- Prettier auto-fixes staged files on commit via lint-staged (no manual formatting ever)
- Husky pre-commit hook runs the full gate
- If any check fails, commit is blocked

### Claude's Discretion
- Exact ESLint rule configuration beyond strict presets
- Coverage threshold percentage (recommend 80%)
- Vitest configuration details (happy-dom vs jsdom for DOM testing)
- Exact Prettier configuration (tab width, semicolons, etc.)
- lint-staged glob patterns

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| QUAL-01 | Theme toggle works correctly in both dark and light mode with localStorage persistence | Theme toggle fix pattern documented; `toggleTheme()` must be defined in extracted theme script; FOUC prevention via `is:inline` head script preserved |
| QUAL-02 | ESLint 9 with flat config and eslint-plugin-astro enforces consistent code style | Full flat config setup verified with eslint-plugin-astro 1.6.0, typescript-eslint 8.57.0, ESLint 10.0.3; code examples provided |
| QUAL-03 | Prettier formats all files consistently on save and pre-commit | Prettier 3.8.1 + prettier-plugin-astro 0.14.1; lint-staged auto-formats on commit |
| QUAL-04 | TypeScript strict mode enabled with no implicit any | Already extends `astro/tsconfigs/strict`; add `@/` path alias; typescript-eslint strict preset adds type-aware rules |
| QUAL-05 | Husky pre-commit hooks run linting and type checking before every commit | Husky 9.1.7 + lint-staged 16.4.0; full gate: lint + typecheck + format + test |
| QUAL-06 | Vitest test framework configured with coverage reporting | Vitest 4.1.0 + @vitest/coverage-v8 4.1.0; happy-dom for DOM tests; coverage threshold enforcement |
| QUAL-08 | All inline scripts extracted to external files or Astro script modules | 5 extraction targets identified with specific module breakdown; FOUC-safe pattern for theme init |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `eslint` | `^10.0.3` | JavaScript/TypeScript linting | Current stable; flat config is default format |
| `typescript-eslint` | `^8.57.0` | Unified TS-ESLint package (parser + plugin + configs) | Replaces separate `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`; provides `tseslint.configs.strict` |
| `@eslint/js` | `^10.x` | ESLint core recommended rules | Peer of ESLint 10; provides `eslint.configs.recommended` |
| `eslint-plugin-astro` | `^1.6.0` | Astro component linting | Official Astro linting; supports ESLint 9+ flat config via `configs.recommended` |
| `eslint-plugin-jsx-a11y` | `^6.10.2` | Accessibility linting | Peer dependency of eslint-plugin-astro a11y configs |
| `prettier` | `^3.8.1` | Code formatting | De facto standard formatter |
| `prettier-plugin-astro` | `^0.14.1` | Format .astro files | Required for Prettier to understand Astro component syntax |
| `vitest` | `^4.1.0` | Unit/integration test runner | Vite-native; zero config friction with Astro's Vite pipeline |
| `@vitest/coverage-v8` | `^4.1.0` | Coverage reporting | V8-based coverage; faster than Istanbul |
| `happy-dom` | latest | DOM environment for Vitest | 3-10x faster than jsdom; sufficient for localStorage, DOM manipulation tests in extracted scripts |
| `husky` | `^9.1.7` | Git hooks manager | Standard for pre-commit hooks |
| `lint-staged` | `^16.4.0` | Run linters on staged files only | Keeps pre-commit fast |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `eslint-config-prettier` | latest | Disable ESLint rules that conflict with Prettier | Always -- prevents ESLint/Prettier conflicts |
| `globals` | latest | Provide browser/node global variable definitions for flat config | Required in flat config to replace `env: { browser: true }` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `happy-dom` | `jsdom` | jsdom has more complete browser API coverage but is 3-10x slower; happy-dom is sufficient for this project's DOM testing needs (localStorage, classList, getElementById) |
| `typescript-eslint` unified | separate `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin` | Separate packages still work but unified package is the current recommended approach |

**Installation:**
```bash
# Linting
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-astro eslint-plugin-jsx-a11y eslint-config-prettier globals

# Formatting
npm install -D prettier prettier-plugin-astro

# Testing
npm install -D vitest @vitest/coverage-v8 happy-dom

# Git hooks
npm install -D husky lint-staged
```

## Architecture Patterns

### Recommended Project Structure (new files)
```
src/
├── scripts/                    # Extracted script modules
│   ├── theme.ts                # Theme toggle + init logic
│   ├── cookie-consent.ts       # Cookie banner logic + GA loading
│   ├── quiz/                   # Security score quiz modules
│   │   ├── data.ts             # Question/answer/band data structures
│   │   ├── scoring.ts          # Score calculation + band lookup
│   │   ├── ui.ts               # Quiz step navigation + DOM rendering
│   │   └── pdf.ts              # PDF generation (jsPDF loading + report building)
│   └── resources.ts            # Resources page form toggle + PDF generation
├── __tests__/                  # Unit tests (co-located with src)
│   ├── theme.test.ts
│   ├── cookie-consent.test.ts
│   ├── quiz/
│   │   ├── scoring.test.ts
│   │   └── data.test.ts
│   └── resources.test.ts
[root]
├── eslint.config.mjs           # ESLint 9 flat config
├── .prettierrc                 # Prettier config
├── .prettierignore             # Prettier ignore patterns
├── vitest.config.ts            # Vitest configuration
└── .husky/
    └── pre-commit              # Pre-commit hook script
```

### Pattern 1: ESLint 9 Flat Config for Astro + TypeScript
**What:** Single `eslint.config.mjs` combining all rule sources
**When to use:** This is the only config file needed for linting

```javascript
// eslint.config.mjs
// Source: https://ota-meshi.github.io/eslint-plugin-astro/user-guide/
// Source: https://typescript-eslint.io/getting-started/
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
);
```

### Pattern 2: Script Extraction with FOUC Prevention
**What:** Extract inline scripts while preserving critical timing for theme init
**When to use:** For BaseLayout theme init script

The theme init script MUST remain `is:inline` in `<head>` to prevent flash of wrong theme. However, it should call a function from an external module.

**Critical constraint:** The `<head>` script runs before any module scripts. The FOUC prevention init must be a tiny inline snippet that reads localStorage and sets `data-theme`. The full `toggleTheme()` function can be in an external module loaded later.

```typescript
// src/scripts/theme.ts
const STORAGE_KEY = 'imizi-theme';

export function getStoredTheme(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setTheme(theme: 'dark' | 'light'): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
}

export function toggleTheme(): void {
  const current = document.documentElement.dataset.theme;
  setTheme(current === 'light' ? 'dark' : 'light');
}

// Self-initializing: bind to window for onclick handler
// This runs when the module is imported
if (typeof window !== 'undefined') {
  window.toggleTheme = toggleTheme;
}
```

```astro
<!-- BaseLayout.astro head — FOUC prevention (keep is:inline, keep tiny) -->
<script is:inline>
  (function(){
    try{var s=localStorage.getItem('imizi-theme');if(s)document.documentElement.dataset.theme=s}catch(e){}
  })();
</script>

<!-- ThemeToggle.astro — load full module -->
<script>
  import '@/scripts/theme';
</script>
```

### Pattern 3: Testable Module Extraction
**What:** Extract inline script logic into pure functions + side-effect-free modules
**When to use:** For all script extractions (cookie consent, quiz scoring, resources)

```typescript
// src/scripts/cookie-consent.ts
const STORAGE_KEY = 'imizi-cookie-consent';

export type ConsentState = 'accepted' | 'rejected' | null;

export function getConsentState(): ConsentState {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'accepted' || value === 'rejected') return value;
    return null;
  } catch {
    return null;
  }
}

export function setConsentState(accepted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'rejected');
  } catch {
    // localStorage unavailable
  }
}

export function resetConsentState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}
```

The key pattern: **pure logic functions** (testable without DOM) separate from **DOM binding code** (runs on import, wires up event listeners). Tests import only the pure functions.

### Pattern 4: Vitest Config for Astro Project
**What:** Vitest configuration with happy-dom and coverage thresholds
**When to use:** Project test configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts', 'src/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/scripts/**/*.ts'],
      exclude: ['src/scripts/**/index.ts'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

### Pattern 5: Pre-commit Hook (Full Gate)
**What:** Husky + lint-staged blocking bad commits
**When to use:** Every commit

```json
// package.json lint-staged config
{
  "lint-staged": {
    "*.{ts,mjs,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.astro": [
      "eslint --fix",
      "prettier --write --plugin=prettier-plugin-astro"
    ],
    "*.{css,json,md,mdx}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
npm run typecheck
npm run test -- --run
npx lint-staged
```

**Note on ordering:** `typecheck` and `test` run on the full codebase (not just staged files). `lint-staged` runs ESLint + Prettier only on staged files. This ensures type-check catches cross-file issues that staged-only linting would miss.

### Pattern 6: Path Alias Configuration
**What:** `@/` alias for clean imports
**When to use:** All new imports; refactor existing deep relative imports

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```javascript
// astro.config.mjs — add vite resolve alias
import { defineConfig } from 'astro/config';
import { resolve } from 'path';

export default defineConfig({
  // ... existing config
  vite: {
    resolve: {
      alias: {
        '@': resolve('./src'),
      },
    },
  },
});
```

### Anti-Patterns to Avoid
- **Leaving theme init in a module script:** Module scripts are deferred. Theme init MUST be `is:inline` in `<head>` or the page flashes the wrong theme (FOUC).
- **Using `define:vars` in extracted scripts:** The `define:vars` Astro directive only works with `is:inline`. Extracted modules should import constants from TypeScript files instead.
- **Running ESLint on dist/ or .astro/:** These are generated directories. Always ignore them.
- **Putting tests in a top-level `tests/` directory:** With `@/` alias and Vitest, `src/__tests__/` keeps tests closer to source and uses the same path resolution.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ESLint config merging | Custom config merge logic | `tseslint.config()` helper | Handles array spreading, rule precedence, and TypeScript parser setup correctly |
| Prettier + ESLint conflicts | Manual rule disabling | `eslint-config-prettier` | Automatically disables all ESLint rules that conflict with Prettier |
| Coverage thresholds | Custom coverage checking script | Vitest `thresholds` config | Built-in; fails test run if thresholds not met |
| Git hook installation | Manual `.git/hooks/` scripts | Husky `prepare` script | Auto-installs hooks on `npm install` for any contributor |
| Staged file filtering | Custom `git diff` parsing | `lint-staged` | Handles partial staging, binary files, deleted files correctly |

**Key insight:** Every tool in this stack has a "just works" configuration path. The main risk is over-customization, not under-configuration.

## Common Pitfalls

### Pitfall 1: eslint-plugin-astro Flat Config Import Path
**What goes wrong:** Using `eslintPluginAstro.configs['flat/recommended']` in ESM when you should use `eslintPluginAstro.configs.recommended`
**Why it happens:** The `flat/` prefix is only needed in CommonJS. ESM exports use the direct property name.
**How to avoid:** Use ESM format (`eslint.config.mjs`) and access `configs.recommended` directly.
**Warning signs:** "Cannot read property of undefined" errors when running eslint.

### Pitfall 2: Theme Toggle FOUC
**What goes wrong:** Extracting the theme init script to a module causes flash of wrong theme on page load.
**Why it happens:** Astro module scripts are deferred by default. The theme must be applied before first paint.
**How to avoid:** Keep a minimal `is:inline` script in `<head>` that reads localStorage and sets `data-theme`. Load the full theme module (with `toggleTheme()`) as a regular script tag.
**Warning signs:** Page briefly flashes light theme before switching to dark (or vice versa).

### Pitfall 3: define:vars in Extracted Scripts
**What goes wrong:** Trying to use Astro `define:vars` in an extracted module script.
**Why it happens:** `define:vars` only works with `is:inline` scripts. Once you extract to a `.ts` module, you lose access to Astro template variables.
**How to avoid:** For the GA ID currently passed via `define:vars={{ gaId }}` in CookieBanner, move the ID to a constants file (`src/data/site.ts` already has `ANALYTICS.gaId`) and import it in the extracted module.
**Warning signs:** `gaId is not defined` runtime errors.

### Pitfall 4: TypeScript Strict + Existing Code
**What goes wrong:** Enabling strict TypeScript rules causes hundreds of errors in existing `.astro` files.
**Why it happens:** While `tsconfig.json` already extends `astro/tsconfigs/strict`, the inline scripts use `var` declarations, implicit `any`, and untyped DOM operations.
**How to avoid:** Fix violations file-by-file during extraction. The extracted `.ts` modules will naturally be strict-compatible. Astro component frontmatter is already mostly typed.
**Warning signs:** `tsc --noEmit` exit code 1 with dozens of errors.

### Pitfall 5: Coverage Threshold Blocking Initial Setup
**What goes wrong:** Setting 80% coverage threshold before writing tests causes every commit to fail.
**Why it happens:** Coverage thresholds are enforced globally. With zero tests, coverage is 0%.
**How to avoid:** Write the initial test suite in the same wave as enabling the threshold. Do NOT enable thresholds before tests exist.
**Warning signs:** Pre-commit hook fails with "Coverage threshold not met" before any tests are written.

### Pitfall 6: lint-staged + Prettier Plugin Loading
**What goes wrong:** Prettier fails to format `.astro` files in lint-staged because the plugin is not found.
**Why it happens:** lint-staged runs Prettier in a subprocess that may not resolve plugins from the project root.
**How to avoid:** Add `--plugin=prettier-plugin-astro` explicitly in the lint-staged command for `.astro` files, or configure the plugin in `.prettierrc`.
**Warning signs:** Prettier silently fails or produces malformed output on `.astro` files.

### Pitfall 7: Husky Not Installing on Clone
**What goes wrong:** New contributors clone the repo and pre-commit hooks don't work.
**Why it happens:** Husky hooks require running the `prepare` script.
**How to avoid:** Add `"prepare": "husky"` to `package.json` scripts. Husky 9 simplified this -- just the one-word `husky` command.
**Warning signs:** Contributors can push unlinted code.

## Code Examples

### Unit Test for Theme Toggle
```typescript
// src/__tests__/theme.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getStoredTheme, setTheme, toggleTheme } from '@/scripts/theme';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = 'dark';
  });

  describe('getStoredTheme', () => {
    it('returns null when no theme stored', () => {
      expect(getStoredTheme()).toBeNull();
    });

    it('returns stored theme', () => {
      localStorage.setItem('imizi-theme', 'light');
      expect(getStoredTheme()).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('toggles from dark to light', () => {
      document.documentElement.dataset.theme = 'dark';
      toggleTheme();
      expect(document.documentElement.dataset.theme).toBe('light');
      expect(localStorage.getItem('imizi-theme')).toBe('light');
    });

    it('toggles from light to dark', () => {
      document.documentElement.dataset.theme = 'light';
      toggleTheme();
      expect(document.documentElement.dataset.theme).toBe('dark');
      expect(localStorage.getItem('imizi-theme')).toBe('dark');
    });
  });
});
```

### Unit Test for Quiz Scoring
```typescript
// src/__tests__/quiz/scoring.test.ts
import { describe, it, expect } from 'vitest';
import { calculateScore, getBand } from '@/scripts/quiz/scoring';

describe('quiz scoring', () => {
  it('calculates score from answers', () => {
    const answers = [3, 2, 1, 3, 2, 1, 3, 2, 1, 3];
    const score = calculateScore(answers);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(30);
  });

  it('returns correct band for score ranges', () => {
    expect(getBand(0).label).toBeDefined();
    expect(getBand(15).label).toBeDefined();
    expect(getBand(30).label).toBeDefined();
  });
});
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

### .prettierignore
```
dist/
.astro/
node_modules/
package-lock.json
*.min.js
*.min.css
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "prepare": "husky"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.eslintrc` + separate TS parser/plugin | `eslint.config.mjs` + `typescript-eslint` unified package | ESLint 9 (2024), typescript-eslint v8 (2024) | Single flat config file, simpler imports |
| `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin` separate | `typescript-eslint` unified package | typescript-eslint v8 (2024) | One import, one package, `tseslint.config()` helper |
| Husky v4 `.huskyrc` | Husky v9 `.husky/` directory | Husky v9 (2024) | Simpler setup, `"prepare": "husky"` in package.json |
| Jest for Vite projects | Vitest | Vitest 1.0 (2023) | Native Vite transforms, no config duplication |
| `jsdom` default | `happy-dom` recommended for speed | 2024+ | 3-10x faster DOM tests |

**Deprecated/outdated:**
- `.eslintrc.json` / `.eslintrc.js` -- deprecated in ESLint 9, removed in ESLint 10
- `@typescript-eslint/parser` as separate install -- still works but unified package is recommended
- `husky install` command -- replaced by just `husky` in v9
- `npx husky add` -- removed in v9; manually create files in `.husky/`

## Inline Script Extraction Inventory

### Scripts to Extract

| Source File | Lines | Module Target | Complexity | Notes |
|-------------|-------|---------------|------------|-------|
| `BaseLayout.astro` | 116-120 | Keep `is:inline` (FOUC) + `src/scripts/theme.ts` | Low | Tiny init stays inline; `toggleTheme()` goes to module |
| `ThemeToggle.astro` | 7 | Import `src/scripts/theme.ts` | Low | Replace `onclick="toggleTheme()"` with module import + addEventListener |
| `CookieBanner.astro` | 19-56 | `src/scripts/cookie-consent.ts` | Medium | Uses `define:vars={{ gaId }}` -- must replace with import from `site.ts` |
| `security-score/index.astro` | 322-649 | `src/scripts/quiz/data.ts`, `scoring.ts`, `ui.ts`, `pdf.ts` | High | 327 lines; largest extraction; quiz data structures, scoring bands, step navigation, PDF generation |
| `resources/index.astro` | 423+ | `src/scripts/resources.ts` | Medium | Form toggle, PDF generation with resource data |

### ThemeToggle Fix Plan

**Current state:** `ThemeToggle.astro` line 7 has `onclick="toggleTheme()"` but `toggleTheme()` is never defined anywhere in the codebase. The theme init script in `BaseLayout.astro` only reads localStorage and sets `data-theme` -- it does not define a toggle function.

**Fix:**
1. Create `src/scripts/theme.ts` with `toggleTheme()` function
2. In `ThemeToggle.astro`, replace inline `onclick` with a `<script>` tag that imports the theme module and attaches the click handler via `addEventListener`
3. Keep the tiny FOUC prevention script in `BaseLayout.astro` `<head>` as `is:inline`

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 + happy-dom |
| Config file | `vitest.config.ts` (Wave 0 -- does not exist yet) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --coverage` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| QUAL-01 | Theme toggle switches dark/light, persists to localStorage | unit | `npx vitest run src/__tests__/theme.test.ts` | No -- Wave 0 |
| QUAL-02 | ESLint catches real violations in src/ | smoke | `npx eslint src/ --max-warnings 0` | No -- Wave 0 (config file) |
| QUAL-03 | Prettier formats all files consistently | smoke | `npx prettier --check .` | No -- Wave 0 (config file) |
| QUAL-04 | TypeScript strict mode, no implicit any | smoke | `npx tsc --noEmit` | Partial -- tsconfig exists |
| QUAL-05 | Pre-commit hook blocks bad commits | manual-only | Manual: stage a lint error, attempt commit, verify blocked | No -- Wave 0 |
| QUAL-06 | Vitest runs with coverage output | smoke | `npx vitest run --coverage` | No -- Wave 0 |
| QUAL-08 | All inline scripts extracted to external files | unit | `npx vitest run src/__tests__/` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run --coverage && npx eslint src/ && npx tsc --noEmit && npx prettier --check .`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` -- Vitest configuration with happy-dom and coverage
- [ ] `eslint.config.mjs` -- ESLint 9 flat config
- [ ] `.prettierrc` + `.prettierignore` -- Prettier configuration
- [ ] `.husky/pre-commit` -- Pre-commit hook script
- [ ] `src/__tests__/theme.test.ts` -- Theme toggle unit tests
- [ ] `src/__tests__/cookie-consent.test.ts` -- Cookie consent unit tests
- [ ] `src/__tests__/quiz/scoring.test.ts` -- Quiz scoring unit tests
- [ ] Framework install: `npm install -D vitest @vitest/coverage-v8 happy-dom eslint @eslint/js typescript-eslint eslint-plugin-astro eslint-plugin-jsx-a11y eslint-config-prettier globals prettier prettier-plugin-astro husky lint-staged`

## Open Questions

1. **ESLint 10 vs ESLint 9**
   - What we know: `npm info eslint version` returns 10.0.3 as latest. eslint-plugin-astro's docs reference ESLint 9. The `configs.recommended` API should be forward-compatible.
   - What's unclear: Whether ESLint 10 introduced any breaking changes to flat config API that affect plugin compatibility.
   - Recommendation: Install `eslint@^9.0.0` (pin to v9) for guaranteed compatibility with eslint-plugin-astro 1.6.0. Upgrade to v10 after verifying plugin compatibility.

2. **Prettier plugin auto-detection in lint-staged**
   - What we know: Prettier looks for plugins in `.prettierrc` `plugins` array. lint-staged runs Prettier as a subprocess.
   - What's unclear: Whether lint-staged subprocess correctly resolves plugins from project root in all cases.
   - Recommendation: Configure plugin in `.prettierrc` (shown in code examples above) and also pass `--plugin` flag in lint-staged as belt-and-suspenders.

3. **Coverage threshold -- right number**
   - What we know: User suggested 80%. Only extracted scripts will have tests in Phase 1.
   - What's unclear: Whether 80% is achievable for all extracted modules given some contain heavy DOM manipulation.
   - Recommendation: Start with 80% for `src/scripts/` only (not all of `src/`). Pure logic functions (scoring, consent state) should exceed 90%. DOM-heavy modules may need lower thresholds initially.

## Sources

### Primary (HIGH confidence)
- [eslint-plugin-astro user guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/) -- flat config setup, available configs, peer dependencies
- [typescript-eslint getting started](https://typescript-eslint.io/getting-started/) -- unified package, flat config with `tseslint.config()`
- [typescript-eslint v8 announcement](https://typescript-eslint.io/blog/announcing-typescript-eslint-v8/) -- ESLint 9 support confirmation
- npm registry version checks (2026-03-16) -- all package versions verified via `npm info`
- Direct codebase inspection -- current tsconfig, package.json, astro.config, inline scripts

### Secondary (MEDIUM confidence)
- [Astro dark mode patterns](https://astro-tips.dev/recipes/dark-mode/) -- FOUC prevention with `is:inline`
- [Vitest jsdom vs happy-dom discussion](https://github.com/vitest-dev/vitest/discussions/1607) -- performance comparison
- [Prettier pre-commit docs](https://prettier.io/docs/precommit.html) -- lint-staged integration pattern
- [Husky + lint-staged guide](https://betterstack.com/community/guides/scaling-nodejs/husky-and-lint-staged/) -- setup process for Husky 9

### Tertiary (LOW confidence)
- ESLint 10 compatibility -- version 10.0.3 is latest per npm, but no official docs verified for plugin compat; recommend pinning to v9

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified via npm registry, flat config support confirmed by official docs
- Architecture: HIGH -- script extraction patterns are straightforward TypeScript module patterns; FOUC prevention is well-documented
- Pitfalls: HIGH -- all pitfalls are based on verified technical constraints (define:vars, is:inline, flat config import paths)
- Theme toggle fix: HIGH -- root cause confirmed (toggleTheme undefined); fix pattern is standard
- ESLint 10 compat: LOW -- untested; recommend pinning to v9

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable ecosystem, 30-day validity)
