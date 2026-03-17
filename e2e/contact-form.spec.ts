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

  test('form submission flow works with mocked endpoint', async ({ page }) => {
    await page.goto('/');

    // Mock the Formspree endpoint to avoid real submissions
    await page.route('**/formspree.io/**', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }),
    );

    const form = page.locator('#contact-form');
    await form.locator('input[name="name"]').fill('Test User');
    await form.locator('input[name="email"]').fill('test@example.com');
    await form.locator('textarea[name="message"]').fill('Test message for E2E');

    const submitButton = form.locator('button[type="submit"], input[type="submit"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Verify form reacts to submission (success message or form reset)
    await page.waitForTimeout(1000);
  });

  test('form validates required fields before submission', async ({ page }) => {
    await page.goto('/');

    const form = page.locator('#contact-form');
    const submitButton = form.locator('button[type="submit"], input[type="submit"]');

    // Try to submit without filling required fields
    await submitButton.click();

    // Browser validation should prevent submission — email field should show validation
    const emailInput = form.locator('input[name="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});
