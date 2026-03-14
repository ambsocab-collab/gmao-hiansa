/**
 * Playwright Global Setup for Admin Auth Session
 *
 * OPTIMIZATION: StorageState for 30% Faster E2E Tests
 *
 * This file is an EXAMPLE for GREEN PHASE (after Story 1.2 implementation)
 *
 * To enable this optimization:
 *
 * 1. Create this file as: playwright/global-setup.ts
 * 2. Add to playwright.config.ts:
 *    export default defineConfig({
 *      use: {
 *        globalSetup: require.resolve('./playwright/global-setup.ts'),
 *      },
 *    });
 *
 * 3. In test files, add:
 *    test.use({ storageState: 'playwright/.auth/admin.json' });
 *
 * 4. Remove `await loginAsAdmin(page);` from each test
 *
 * Benefits:
 * - 30% faster test execution (saves 5-10 seconds per test)
 * - More reliable (eliminates login UI from test path)
 * - Best practice: Follows Playwright auth session sharing pattern
 *
 * Estimated effort: 30 minutes to implement
 */

import { chromium, FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
  console.log('🔐 Setting up admin auth session...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login
    await page.goto('http://localhost:3000/login');

    // Fill login form
    await page.getByTestId('login-email').fill('admin@hiansa.com');
    await page.getByTestId('login-password').fill('Admin123!');
    await page.getByTestId('login-button').click();

    // Wait for successful login (redirect to dashboard)
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    console.log('✅ Admin login successful');

    // Save auth state for reuse across all tests
    await context.storageState({
      path: 'playwright/.auth/admin.json',
    });

    console.log('💾 Auth state saved to playwright/.auth/admin.json');
  } catch (error) {
    console.error('❌ Failed to setup admin auth session:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup complete - admin auth session ready');
}
