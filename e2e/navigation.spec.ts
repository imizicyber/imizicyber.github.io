import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('main nav links are present', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /blog/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /resources/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
  });

  test('Free Score CTA is visible on homepage', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: /free score|security score/i })).toBeVisible();
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

  test('case studies index page loads', async ({ page }) => {
    const response = await page.goto('/case-studies/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText(/case studies/i);
  });

  test('case study breadcrumb links resolve', async ({ page }) => {
    await page.goto('/case-studies/east-africa-bank-pentest/');
    const breadcrumbLink = page.locator('.breadcrumb a[href="/case-studies/"]');
    await expect(breadcrumbLink).toBeVisible();
    await breadcrumbLink.click();
    await expect(page).toHaveURL(/\/case-studies\/$/);
    await expect(page.locator('h1')).toContainText(/case studies/i);
  });

  test('About link is present in main navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    const aboutLink = nav.getByRole('link', { name: /about/i });
    await expect(aboutLink).toBeVisible();
    await expect(aboutLink).toHaveAttribute('href', '/about/');
  });

  test('About page loads successfully', async ({ page }) => {
    const response = await page.goto('/about/');
    expect(response?.status()).toBe(200);
  });
});
