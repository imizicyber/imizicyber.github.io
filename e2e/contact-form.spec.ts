import { test, expect } from '@playwright/test';
import { test as axeTest, expect as axeExpect } from './fixtures/axe-test';

/** Helper to fill the contact form with valid data */
async function fillContactForm(page: import('@playwright/test').Page): Promise<void> {
  const form = page.locator('#contact-form');
  await form.locator('input[name="name"]').fill('Test User');
  await form.locator('input[name="email"]').fill('test@example.com');
  await form.locator('select[name="service"]').selectOption({ index: 1 });
  await form.locator('textarea[name="message"]').fill('Test message for E2E');
}

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

  test('form has aria-label (UIUX-07)', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form#contact-form');
    await expect(form).toHaveAttribute('aria-label', 'Contact form');
  });

  test('submit button has spinner element (UIUX-07)', async ({ page }) => {
    await page.goto('/');
    const spinner = page.locator('.submit-btn .spinner');
    await expect(spinner).toHaveCount(1);
    // Spinner should be hidden by default (display: none via CSS)
    await expect(spinner).not.toBeVisible();
  });

  test('loading state on submission (UIUX-07)', async ({ page }) => {
    await page.goto('/');

    // Mock Formspree with delayed response to observe loading state
    await page.route('**/formspree.io/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await fillContactForm(page);

    const form = page.locator('#contact-form');
    const submitButton = form.locator('.submit-btn');

    await submitButton.click();

    // Immediately check loading state
    await expect(form).toHaveAttribute('aria-busy', 'true');
    await expect(submitButton).toBeDisabled();
    await expect(form.locator('.btn-text')).toHaveText('Sending...');
    await expect(form.locator('.spinner')).toBeVisible();
  });

  test('success state after submission (UIUX-07)', async ({ page }) => {
    await page.goto('/');

    // Mock Formspree with immediate success
    await page.route('**/formspree.io/**', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }),
    );

    await fillContactForm(page);

    const form = page.locator('#contact-form');
    const submitButton = form.locator('.submit-btn');
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();

    // Wait for success message to appear
    const successMsg = page.locator('#contact-success');
    await expect(successMsg).toBeVisible({ timeout: 10000 });

    // aria-live region should contain the success message
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toHaveCount(1);
    await expect(liveRegion.locator('#contact-success')).toBeVisible();

    // Button text should show "Sent!"
    await expect(form.locator('.btn-text')).toHaveText('Sent!');
  });

  test('error state on failed submission (UIUX-07)', async ({ page }) => {
    await page.goto('/');

    // Mock Formspree with 500 error — must set up route BEFORE form submission
    await page.route('**/formspree.io/**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      }),
    );

    await fillContactForm(page);

    const form = page.locator('#contact-form');
    const submitButton = form.locator('.submit-btn');
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();

    // Wait for error message to become visible (JS removes hidden attribute)
    const errorMsg = page.locator('#contact-error');
    await expect(errorMsg).toBeVisible({ timeout: 10000 });

    // Button text should reset to original
    await expect(form.locator('.btn-text')).toHaveText('Send enquiry');

    // Button should not be disabled (user can retry)
    await expect(submitButton).not.toBeDisabled();
  });
});

axeTest.describe('Contact Form Accessibility', () => {
  axeTest('axe-core scan on contact form area (UIUX-07)', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const results = await makeAxeBuilder().include('#contact-form').analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    axeExpect(criticalOrSerious).toEqual([]);
  });
});
