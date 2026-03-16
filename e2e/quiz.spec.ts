import { test, expect } from '@playwright/test';

test.describe('Security Score Quiz', () => {
  test('quiz page loads with first question', async ({ page }) => {
    await page.goto('/tools/security-score/');
    const firstCard = page.locator('.quiz-card#q1');
    await expect(firstCard).toBeVisible();
  });

  test('complete quiz flow produces score', async ({ page }) => {
    await page.goto('/tools/security-score/');

    for (let i = 1; i <= 10; i++) {
      const card = page.locator(`.quiz-card#q${i}`);
      await expect(card).toBeVisible({ timeout: 5000 });
      const option = card.locator('.option').first();
      await option.click();
      if (i < 10) {
        await page.waitForTimeout(700);
      }
    }

    const calcBtn = page.locator('#calc-btn');
    await expect(calcBtn).toBeEnabled({ timeout: 5000 });
    await calcBtn.click();

    const resultSection = page.locator('#result-section');
    await expect(resultSection).toBeVisible({ timeout: 5000 });

    const scoreNum = page.locator('#score-num');
    const scoreText = await scoreNum.textContent();
    expect(Number(scoreText)).toBeGreaterThanOrEqual(0);
  });
});
