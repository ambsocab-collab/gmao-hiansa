/**
 * Simple authentication test to verify login works
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth.helpers';

test.describe('Authentication Test', () => {
  test('[DEBUG] should login successfully', async ({ page }) => {
    console.log('Navigating to login page...');
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    console.log('Page loaded. URL:', page.url());
    console.log('Page title:', await page.title());

    // Take screenshot
    await page.screenshot({ path: 'debug-login-page.png' });

    console.log('Attempting to login as admin...');
    await loginAsAdmin(page);

    console.log('Login completed. URL:', page.url());

    // Should be redirected away from /login
    expect(page.url()).not.toContain('/login');

    // Should see user name in header
    await expect(page.getByText('Hola, Administrador').first()).toBeVisible();

    console.log('✅ Login successful!');
  });
});
