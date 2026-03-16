import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/imizicyber/i);
  });

  test('hero section is visible with heading', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('consultation CTA is visible', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /consultation|get in touch/i });
    await expect(cta.first()).toBeVisible();
  });

  test('theme toggle switches mode', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.locator('#theme-toggle-btn');
    await toggle.click();
    // Default is dark (no data-theme), clicking should set 'light'
    await expect(html).toHaveAttribute('data-theme', 'light');
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});
