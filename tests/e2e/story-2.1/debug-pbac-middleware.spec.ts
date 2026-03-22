/**
 * Debug test: Check PBAC middleware behavior
 */

import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/operario.json' });

test('[DEBUG] Check operario session and middleware', async ({ page }) => {
  // Go to dashboard to establish session
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/dashboard');

  // Try to access triage
  console.log('Navigating to /averias/triage...');
  await page.goto('/averias/triage');

  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);

  // Wait a bit to see if redirect happens
  await page.waitForTimeout(3000);

  const finalUrl = page.url();
  console.log('Final URL after 3s:', finalUrl);

  // Check if we can see any elements on the page
  const bodyText = await page.textContent('body');
  console.log('Page text (first 200 chars):', bodyText?.substring(0, 200));

  // Take screenshot
  await page.screenshot({ path: 'debug-operario-triage.png' });
  console.log('Screenshot saved to debug-operario-triage.png');
});
