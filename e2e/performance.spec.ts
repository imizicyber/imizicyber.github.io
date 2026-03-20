import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('no Google Fonts network requests are made (UIUX-06)', async ({ page }) => {
    const requestUrls: string[] = [];
    page.on('request', (request) => {
      requestUrls.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const googleFontRequests = requestUrls.filter(
      (url) => url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com'),
    );
    expect(googleFontRequests).toEqual([]);
  });

  test('self-hosted font files are served (UIUX-06)', async ({ request }) => {
    const fontPaths = [
      '/fonts/plus-jakarta-sans-400-latin.woff2',
      '/fonts/plus-jakarta-sans-700-latin.woff2',
      '/fonts/jetbrains-mono-400-latin.woff2',
    ];

    for (const fontPath of fontPaths) {
      const response = await request.get(fontPath);
      expect(response.status(), `${fontPath} should return 200`).toBe(200);
      const contentType = response.headers()['content-type'] ?? '';
      expect(
        contentType.includes('font/woff2') || contentType.includes('application/font-woff2'),
        `${fontPath} content-type should be woff2, got: ${contentType}`,
      ).toBe(true);
    }
  });

  test('font preload link exists in head (UIUX-04)', async ({ page }) => {
    await page.goto('/');

    const preloadLink = page.locator('link[rel="preload"][href*="plus-jakarta-sans-400"]');
    await expect(preloadLink).toHaveCount(1);
    await expect(preloadLink).toHaveAttribute('as', 'font');
    await expect(preloadLink).toHaveAttribute('type', 'font/woff2');

    const crossorigin = await preloadLink.getAttribute('crossorigin');
    expect(crossorigin).not.toBeNull();
  });

  test('OG image is not a raw PNG in root (UIUX-05)', async ({ request, page }) => {
    // Original /og.png should not exist in root (moved to src/assets/ for Astro optimization)
    const response = await request.get('/og.png', { failOnStatusCode: false });
    expect(response.status()).toBe(404);

    // But og:image meta tag should exist with a valid URL
    await page.goto('/');
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveCount(1);
    const content = await ogImage.getAttribute('content');
    expect(content).toBeTruthy();
    expect((content ?? '').length).toBeGreaterThan(0);
  });

  test('images have width and height attributes to prevent CLS (UIUX-05)', async ({ page }) => {
    // Check multiple pages — the homepage currently uses SVGs/CSS only,
    // but any page with <img> tags must have explicit dimensions.
    const pages = ['/', '/blog/', '/tools/security-score/'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const width = await img.getAttribute('width');
        const height = await img.getAttribute('height');
        const src = await img.getAttribute('src');
        expect(width, `img[src="${src}"] on ${pagePath} should have width`).toBeTruthy();
        expect(height, `img[src="${src}"] on ${pagePath} should have height`).toBeTruthy();
      }
    }
    // Test passes if no img elements exist (site uses SVGs) — the constraint
    // ensures any future img additions must include dimensions.
  });

  test('LCP is under 2.5s on homepage (TEST-05)', async ({ page }) => {
    await page.goto('/');

    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries.at(-1);
          resolve(lastEntry?.startTime ?? 0);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
    });

    expect(lcp).toBeLessThan(2500);
  });

  test('CLS is under 0.1 on homepage (TEST-05)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as unknown as { hadRecentInput: boolean }).hadRecentInput) {
              clsValue += (entry as unknown as { value: number }).value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        // Give 100ms for any remaining shifts, then resolve
        setTimeout(() => resolve(clsValue), 100);
      });
    });

    expect(cls).toBeLessThan(0.1);
  });
});
