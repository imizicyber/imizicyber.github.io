import { test, expect } from '@playwright/test';

test.describe('Content Security Policy', () => {
  test('CSP contains no unsafe-inline for scripts', async ({ page }) => {
    await page.goto('/');
    const cspMeta = page.locator('meta[http-equiv="Content-Security-Policy"]');
    const content = await cspMeta.getAttribute('content');
    expect(content).toBeTruthy();

    const scriptSrc = (content ?? '').split(';').find((d) => d.trim().startsWith('script-src'));
    expect(scriptSrc).toBeTruthy();
    expect(scriptSrc).not.toContain('unsafe-inline');
    expect(scriptSrc).toContain('sha256-');
  });
});
