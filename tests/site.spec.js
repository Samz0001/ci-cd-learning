const { test, expect } = require('@playwright/test');

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My Learning Site/);
});

test('clicking the button reveals the hidden message', async ({ page }) => {
  await page.goto('/');

  const message = page.locator('#message');
  await expect(message).toBeHidden();

  await page.click('#showBtn');

  await expect(message).toBeVisible();
  await expect(message).toHaveText('Hello, CI/CD learner! 🎉');
});

test('navigation link goes to the About page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=About');

  await expect(page).toHaveURL(/about\.html/);
  await expect(page.locator('#page-title')).toHaveText('About This Project');
});
