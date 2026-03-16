import { test, expect } from '@playwright/test';

test.describe('Cookie Banner', () => {
  test('banner appears on first visit', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('#cookie-banner');
    await expect(banner).toBeVisible({ timeout: 5000 });
  });

  test('accepting cookies hides banner', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('#cookie-banner');
    await expect(banner).toBeVisible({ timeout: 5000 });

    const acceptBtn = page.locator('#cookie-accept');
    await acceptBtn.click();

    await expect(banner).toBeHidden({ timeout: 5000 });
  });
});
