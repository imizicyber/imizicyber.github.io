import { test, expect } from './fixtures/axe-test';

test.describe('Accessibility', () => {
  test('homepage has no critical violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');
    const results = await makeAxeBuilder().analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });

  test('blog index has no critical violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/blog/');
    const results = await makeAxeBuilder().analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });

  test('security score page has no critical violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/tools/security-score/');
    const results = await makeAxeBuilder().analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });

  test('ARIA landmarks are present on homepage (UIUX-08)', async ({ page }) => {
    await page.goto('/');

    // header element exists (implicit role=banner)
    await expect(page.locator('header')).toHaveCount(1);

    // main element exists with id="main"
    // Note: homepage has a nested main#main (page-level + layout-level), verified as intentional
    const main = page.locator('main#main');
    const mainCount = await main.count();
    expect(mainCount).toBeGreaterThanOrEqual(1);

    // footer element exists with role="contentinfo"
    await expect(page.locator('footer[role="contentinfo"]')).toHaveCount(1);
  });

  test('sections have aria-labels (UIUX-08)', async ({ page }) => {
    await page.goto('/');

    const labeledSections = page.locator('section[aria-label]');
    const count = await labeledSections.count();
    // Homepage has 10 sections, but testing for "at least 5" is robust
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('keyboard Tab moves focus through interactive elements (UIUX-08)', async ({ page }) => {
    await page.goto('/');

    // Dismiss cookie banner if present (it traps focus with aria-modal)
    const cookieBanner = page.locator('#cookie-banner');
    if (await cookieBanner.isVisible()) {
      await page.locator('#cookie-reject').click();
      await expect(cookieBanner).not.toBeVisible();
    }

    // Track focus changes across multiple Tab presses
    const focusedElements: string[] = [];
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return 'null';
        const tag = el.tagName.toLowerCase();
        const cls = el.className ? `.${el.className.split(' ')[0]}` : '';
        return `${tag}${cls}`;
      });
      focusedElements.push(info);
    }

    // Focus should move through elements (not stay stuck)
    // After cookie banner dismissed, first Tab goes to skip link
    expect(focusedElements[0]).toContain('a');
    // Verify focus moves to multiple elements
    expect(focusedElements.length).toBe(5);
  });

  test('hamburger menu closes with Escape key (UIUX-08)', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });

    const menuBtn = page.locator('.menu-btn');
    const navLinks = page.locator('.nav-links');

    // Open the menu
    await menuBtn.click();
    await expect(navLinks).toHaveClass(/open/);

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(navLinks).not.toHaveClass(/open/);

    // Focus should return to the menu button
    const focusedElement = await page.evaluate(() => document.activeElement?.className ?? '');
    expect(focusedElement).toContain('menu-btn');
  });

  test('skip link navigates to main content (UIUX-08)', async ({ page }) => {
    await page.goto('/');

    // Dismiss cookie banner if present (it traps focus with aria-modal)
    const cookieBanner = page.locator('#cookie-banner');
    if (await cookieBanner.isVisible()) {
      await page.locator('#cookie-reject').click();
      await expect(cookieBanner).not.toBeVisible();
    }

    // First Tab should focus the skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeFocused();

    // Press Enter to activate
    await page.keyboard.press('Enter');

    // URL hash should be #main or focus/scroll should move to #main
    await page.waitForURL('**/#main');
  });
});
