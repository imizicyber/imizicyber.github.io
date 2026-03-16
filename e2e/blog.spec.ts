import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('blog index shows post cards', async ({ page }) => {
    await page.goto('/blog/');
    const cards = page.locator('a.blog-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('clicking a blog post navigates to post page', async ({ page }) => {
    await page.goto('/blog/');
    const firstPost = page.locator('a.blog-card').first();
    const href = await firstPost.getAttribute('href');
    expect(href).toBeTruthy();
    await firstPost.click();
    await page.waitForURL(/\/blog\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('blog post page has content and article body', async ({ page }) => {
    await page.goto('/blog/');
    const firstPost = page.locator('a.blog-card').first();
    await firstPost.click();
    await page.waitForURL(/\/blog\/.+/);
    await expect(page.locator('main')).toBeVisible();
  });
});
