import { test, expect } from '../../fixtures/test.fixtures';

/**
 * DEBUG TEST - Check what page we're on after navigating to /mis-ots
 */
test.describe('DEBUG - Mis OTs Page', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test('debug: check page content after navigation', async ({ page }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';

    // Navigate to /mis-ots
    await page.goto(`${baseURL}/mis-ots`);
    await page.waitForLoadState('domcontentloaded');

    // Log current URL
    console.log('Current URL:', page.url());

    // Log page title
    const title = await page.title();
    console.log('Page title:', title);

    // Log page content (first 1000 chars)
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Page content (first 500 chars):', bodyText.substring(0, 500));

    // Check if we're still on login page
    const isLoginPage = await page.locator('form').isVisible();
    console.log('Is login page:', isLoginPage);

    // Check for error messages
    const hasError = await page.getByText(/error|Error|ERROR/).count();
    console.log('Error elements found:', hasError);
  });
});
