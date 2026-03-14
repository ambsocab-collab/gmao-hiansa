/**
 * Test with existing admin user
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth.helpers';

test('[DEBUG] Navigate to admin user detail page', async ({ page, request }) => {
  // Login
  await loginAsAdmin(page);
  await page.waitForLoadState('domcontentloaded');

  // Get admin user ID
  const response = await page.request.get('http://localhost:3000/api/v1/users');
  const data = await response.json();
  const users = Array.isArray(data) ? data : (data.users || []);
  const adminUser = users.find((u: any) => u.email === 'admin@hiansa.com');

  console.log('Admin user:', adminUser?.email, 'ID:', adminUser?.id);
  expect(adminUser).toBeDefined();

  // Navigate to user detail page
  console.log('Navigating to:', `/usuarios/${adminUser.id}`);
  await page.goto(`/usuarios/${adminUser.id}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  // Take screenshot
  await page.screenshot({ path: 'debug-admin-user-detail.png', fullPage: true });

  // Check if 404
  const has404 = await page.getByText('This page could not be found').count();
  console.log('Has 404:', has404);

  if (has404 > 0) {
    console.log('❌ PAGE SHOWS 404!');
  } else {
    console.log('✅ Page loaded successfully!');
  }
});
