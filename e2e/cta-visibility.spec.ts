import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const pages = ['/', '/blog/', '/services/penetration-testing/'];

test.describe('CTA Visibility (UIUX-02)', () => {
  for (const vp of viewports) {
    for (const pagePath of pages) {
      test(`"Book a Consultation" visible above fold on ${pagePath} at ${vp.name} (${vp.width}px)`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(pagePath);
        const cta = page.getByRole('link', { name: /book a consultation/i });
        await expect(cta.first()).toBeVisible();
        const box = await cta.first().boundingBox();
        expect(box).toBeTruthy();
        if (box) {
          expect(box.y + box.height).toBeLessThan(vp.height);
        }
      });
    }
  }
});
