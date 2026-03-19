import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
];

const responsivePages = [
  '/',
  '/services/penetration-testing/',
  '/blog/',
  '/case-studies/east-africa-bank-pentest/',
  '/tools/security-score/',
  '/about/',
];

test.describe('Responsive Layout (UIUX-03, TEST-03)', () => {
  // Test group 1 — Per viewport, per page: No horizontal overflow
  for (const vp of viewports) {
    test.describe(`${vp.name} (${vp.width}px)`, () => {
      for (const pagePath of responsivePages) {
        test(`${pagePath} no horizontal overflow`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(pagePath);
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
          expect(bodyWidth).toBeLessThanOrEqual(vp.width);
        });
      }
    });
  }

  // Test group 2 — Hamburger menu visibility (once per viewport, on homepage)
  for (const vp of viewports) {
    test(`hamburger menu visibility at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      const menuBtn = page.locator('.menu-btn');
      if (vp.width <= 768) {
        await expect(menuBtn).toBeVisible();
      } else {
        await expect(menuBtn).not.toBeVisible();
      }
    });
  }

  // Test group 3 — CTA visible above fold (once per viewport, on homepage)
  for (const vp of viewports) {
    test(`CTA visible above fold at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      // On mobile/tablet the nav-cta-mobile is visible; on desktop the hero CTA is visible
      const heroCta = page.locator('.btn.btn-fill:has-text("Book a Consultation")');
      const navCtaMobile = page.locator('.nav-cta-mobile');
      const cta = vp.width <= 768 ? navCtaMobile : heroCta;
      await expect(cta).toBeVisible();
      const box = await cta.boundingBox();
      expect(box).toBeTruthy();
      // eslint already verified box is truthy above
      const { y, height } = box as { y: number; height: number };
      expect(y + height).toBeLessThan(vp.height);
    });
  }

  // Test group 4 — Hero heading visible at all viewports (once per viewport, on homepage)
  for (const vp of viewports) {
    test(`hero heading visible at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
    });
  }
});
