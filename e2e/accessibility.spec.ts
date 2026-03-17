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

  test('security score page has no critical violations', async ({ page, makeAxeBuilder }) => {
    await page.goto('/tools/security-score/');
    const results = await makeAxeBuilder().analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });
});
