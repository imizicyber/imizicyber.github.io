import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('main nav links are present', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /blog/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /resources/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('service pages load successfully', async ({ page }) => {
    const servicePages = [
      '/services/penetration-testing/',
      '/services/managed-security/',
      '/services/security-training/',
    ];
    for (const path of servicePages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });

  test('404 page displays for non-existent routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/');
    const body = page.locator('body');
    await expect(body).toContainText(/404|not found/i);
  });
});
