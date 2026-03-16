import { test, expect } from './fixtures/axe-test';

test.describe('Accessibility', () => {
  test('homepage has no critical violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');
    const results = await makeAxeBuilder().analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });

  test('blog index has no critical violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/blog/');
    const results = await makeAxeBuilder().analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });

  test('contact page has no critical violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/contact/');
    const results = await makeAxeBuilder().analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });
});
