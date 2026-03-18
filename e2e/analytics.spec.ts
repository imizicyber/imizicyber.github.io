import { test, expect } from '@playwright/test';

test.describe('Analytics Consent Gating', () => {
  test('no analytics requests before consent', async ({ page }) => {
    const analyticsRequests: string[] = [];

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('snap.licdn.com')) {
        analyticsRequests.push(url);
      }
    });

    await page.goto('/');

    const banner = page.locator('#cookie-banner');
    await expect(banner).toBeVisible({ timeout: 5000 });

    // No analytics should have loaded before consent
    expect(analyticsRequests).toHaveLength(0);
  });

  test('analytics load after accepting consent', async ({ page }) => {
    const analyticsRequests: string[] = [];

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('snap.licdn.com')) {
        analyticsRequests.push(url);
      }
    });

    await page.goto('/');

    const acceptBtn = page.locator('#cookie-accept');
    await acceptBtn.click();

    // Wait for GA request to appear (up to 5 seconds)
    await expect(async () => {
      expect(analyticsRequests.length).toBeGreaterThan(0);
    }).toPass({ timeout: 5000 });

    const hasGA = analyticsRequests.some((url) => url.includes('googletagmanager.com'));
    expect(hasGA).toBe(true);
  });

  test('rejecting cookies prevents analytics loading', async ({ page }) => {
    const analyticsRequests: string[] = [];

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('snap.licdn.com')) {
        analyticsRequests.push(url);
      }
    });

    await page.goto('/');

    const rejectBtn = page.locator('#cookie-reject');
    await rejectBtn.click();

    // Wait a bit to confirm no requests appear
    await page.waitForTimeout(2000);

    expect(analyticsRequests).toHaveLength(0);
  });
});
