/**
 * Test Story 1.3 with seeded user
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth.helpers';

test('[DEBUG-Story-1.3] Test with seeded user', async ({ page, request }) => {
  // Login as admin
  await loginAsAdmin(page);
  await page.waitForLoadState('domcontentloaded');

  // Get admin user ID
  const response = await page.request.get('http://localhost:3000/api/v1/users');
  const data = await response.json();
  const users = Array.isArray(data) ? data : (data.users || []);
  const adminUser = users.find((u: any) => u.email === 'admin@hiansa.com');
  expect(adminUser).toBeDefined();

  const userId = adminUser.id;
  console.log('Admin user ID:', userId);

  // Navigate to user detail page
  await page.goto(`/usuarios/${userId}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  console.log('Current URL:', page.url());

  // Should not be 404
  expect(page.url()).not.toContain('/404');

  // Look for tag checkboxes
  const supervisorCheckbox = page.getByTestId('tag-checkbox-Supervisor');
  const isVisible = await supervisorCheckbox.isVisible().catch(() => false);
  console.log('Supervisor checkbox visible:', isVisible);

  // Take screenshot
  await page.screenshot({ path: 'debug-seeded-user-page.png', fullPage: true });

  console.log('✅ Test completed');
});
