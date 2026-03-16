import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('form is visible with required fields', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('email field has required attribute', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });
});
