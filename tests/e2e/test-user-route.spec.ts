/**
 * Test to verify user detail route works with seeded user
 */

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth.helpers';

test.describe('User Detail Route Test', () => {
  test('[DEBUG] should navigate to admin user detail page', async ({ page }) => {
    console.log('Logging in as admin...');
    await loginAsAdmin(page);
    await page.waitForLoadState('domcontentloaded');
    console.log('Logged in! URL:', page.url());

    // Get admin user ID from API
    const response = await page.request.get('http://localhost:3000/api/v1/users');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log('API response type:', typeof data);
    console.log('API response:', JSON.stringify(data, null, 2).substring(0, 200));

    // Handle different response structures
    const users = Array.isArray(data) ? data : (data.users || []);
    console.log('Users found:', users.length);
    expect(users.length).toBeGreaterThan(0);

    // Find admin user
    const adminUser = users.find((u: any) => u.email === 'admin@hiansa.com');
    expect(adminUser).toBeDefined();

    const adminUserId = adminUser.id;
    console.log('Admin user ID:', adminUserId);

    // Navigate to user detail page
    console.log('Navigating to user detail page...');
    await page.goto(`/usuarios/${adminUserId}`);
    await page.waitForTimeout(3000);

    console.log('Current URL after navigation:', page.url());
    console.log('Page title:', await page.title());

    // Take screenshot
    await page.screenshot({ path: 'debug-user-detail-page.png', fullPage: true });

    // Should not be on login page
    expect(page.url()).not.toContain('/login');

    console.log('✅ Successfully navigated to user detail page!');
  });
});
