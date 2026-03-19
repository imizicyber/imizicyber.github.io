import { test, expect } from '@playwright/test';

/**
 * Known browser warnings that are not application errors.
 * - CSP frame-ancestors: intentionally delivered via meta tag; browsers warn about it.
 * - CSP style-src inline: some third-party or dynamic inline styles trigger CSP
 *   violations that are caught by the post-build CSP injection. These are
 *   pre-existing infrastructure warnings, not application logic errors.
 */
const IGNORED_CONSOLE_PATTERNS = [
  /Content Security Policy directive 'frame-ancestors' is ignored/,
  /Content Security Policy directive 'style-src/,
];

const allRoutes = [
  {
    group: 'Core',
    paths: ['/', '/about/', '/blog/', '/resources/'],
  },
  {
    group: 'Services',
    paths: [
      '/services/penetration-testing/',
      '/services/security-assessments/',
      '/services/managed-security/',
      '/services/custom-tooling/',
      '/services/security-training/',
    ],
  },
  {
    group: 'Content',
    paths: [
      '/case-studies/',
      '/case-studies/east-africa-bank-pentest/',
      '/case-studies/mobile-money-security-assessment/',
      '/company-profile/',
      '/privacy-policy/',
      '/responsible-disclosure/',
    ],
  },
  {
    group: 'Tools',
    paths: ['/tools/security-score/'],
  },
  {
    group: 'Blog Posts',
    paths: ['/blog/penetration-testing-rwanda/'],
  },
];

for (const { group, paths } of allRoutes) {
  test.describe(`Page Routes: ${group}`, () => {
    for (const path of paths) {
      test(`${path} returns 200 with h1 and no console errors`, async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            const text = msg.text();
            const isIgnored = IGNORED_CONSOLE_PATTERNS.some((p) => p.test(text));
            if (!isIgnored) consoleErrors.push(text);
          }
        });

        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
        expect(consoleErrors).toEqual([]);
      });
    }
  });
}
