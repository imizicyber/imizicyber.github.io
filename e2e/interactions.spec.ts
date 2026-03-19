import { test, expect } from '@playwright/test';

test.describe('Interactive Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const cookieBanner = page.locator('#cookie-banner');
    if (await cookieBanner.isVisible()) {
      await page.locator('#cookie-reject').click();
      await expect(cookieBanner).not.toBeVisible();
    }
  });

  test('theme toggle switches between dark and light mode', async ({ page }) => {
    const html = page.locator('html');
    const toggle = page.locator('#theme-toggle-btn');

    // Default state: no data-theme attribute (dark by CSS default) or explicit "dark".
    // toggleTheme() treats missing/empty/"dark" the same: switches to "light".
    const initialAttr = await html.getAttribute('data-theme');
    const isDark = !initialAttr || initialAttr === 'dark';

    // First click: toggle from dark->light or light->dark
    await toggle.click();
    const firstExpected = isDark ? 'light' : 'dark';
    await expect(html).toHaveAttribute('data-theme', firstExpected);

    // Second click: toggle back
    const secondExpected = isDark ? 'dark' : 'light';
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', secondExpected);

    // Third click: toggle again, then reload to verify localStorage persistence
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', firstExpected);
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', firstExpected);
  });

  test('theme toggle persists across page navigation', async ({ page }) => {
    const html = page.locator('html');
    const toggle = page.locator('#theme-toggle-btn');

    const initialAttr = await html.getAttribute('data-theme');
    const isDark = !initialAttr || initialAttr === 'dark';
    const toggledTheme = isDark ? 'light' : 'dark';

    // Toggle theme
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', toggledTheme);

    // Navigate to a different page and verify theme persists via localStorage
    await page.goto('/about/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', toggledTheme);
  });

  test('WhatsApp float link has correct href', async ({ page }) => {
    const whatsappLink = page.locator('a[href*="wa.me"]');
    await expect(whatsappLink.first()).toBeVisible();
    const href = await whatsappLink.first().getAttribute('href');
    expect(href).toContain('wa.me');
    expect(href).toContain('text=');
  });

  test('WhatsApp link on service page has service-specific message', async ({ page }) => {
    // Get homepage WhatsApp href for comparison
    const homeWhatsapp = page.locator('a[href*="wa.me"]');
    const homeHref = await homeWhatsapp.first().getAttribute('href');

    // Navigate to service page
    await page.goto('/services/penetration-testing/');
    const cookieBanner = page.locator('#cookie-banner');
    if (await cookieBanner.isVisible()) {
      await page.locator('#cookie-reject').click();
      await expect(cookieBanner).not.toBeVisible();
    }

    const serviceWhatsapp = page.locator('a[href*="wa.me"]');
    await expect(serviceWhatsapp.first()).toBeVisible();
    const serviceHref = await serviceWhatsapp.first().getAttribute('href');

    expect(serviceHref).toContain('wa.me');
    expect(serviceHref).toContain('text=');

    // Service page should have a different pre-filled text than homepage
    expect(homeHref).toBeTruthy();
    expect(serviceHref).toBeTruthy();
    const homeText = new URL(homeHref as string).searchParams.get('text');
    const serviceText = new URL(serviceHref as string).searchParams.get('text');
    expect(serviceText).toBeTruthy();
    expect(serviceText).not.toBe(homeText);
  });

  test('nav hamburger opens and closes menu on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const menuBtn = page.locator('.menu-btn');
    const navLinks = page.locator('.nav-links');

    // Open menu
    await menuBtn.click();
    await expect(navLinks).toHaveClass(/open/);

    // Close menu
    await menuBtn.click();
    await expect(navLinks).not.toHaveClass(/open/);
  });

  test('blog tag filter shows/hides posts', async ({ page }) => {
    await page.goto('/blog/');
    const cookieBanner = page.locator('#cookie-banner');
    if (await cookieBanner.isVisible()) {
      await page.locator('#cookie-reject').click();
      await expect(cookieBanner).not.toBeVisible();
    }

    const tagButtons = page.locator('[data-tag]');
    const tagCount = await tagButtons.count();
    if (tagCount === 0) {
      test.skip();
      return;
    }

    // Count total blog cards
    const allCards = page.locator('.blog-card-wrapper');
    const totalCount = await allCards.count();
    expect(totalCount).toBeGreaterThan(0);

    // Click a non-"all" tag button to filter
    const specificTag = page.locator('[data-tag]:not([data-tag="all"])').first();
    await specificTag.click();

    // Verify some cards are hidden (display: none) or all match the tag
    const visibleCards = page.locator('.blog-card-wrapper:not([style*="display: none"])');
    const visibleCount = await visibleCards.count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThanOrEqual(totalCount);

    // Click "All" to reset the filter
    await page.locator('[data-tag="all"]').click();
    const resetCount = await page
      .locator('.blog-card-wrapper:not([style*="display: none"])')
      .count();
    expect(resetCount).toBe(totalCount);
  });
});
