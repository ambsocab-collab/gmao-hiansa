import { test, expect } from '@playwright/test';

test('Debug: Test login with both users', async ({ page }) => {
  // Test 1: tecnico@hiansa.com (known working user)
  console.log('Testing tecnico@hiansa.com...');
  await page.goto('/login');
  await page.getByTestId('login-email').waitFor({ state: 'visible' });
  await page.getByTestId('login-email').clear();
  await page.getByTestId('login-password').clear();
  await page.getByTestId('login-email').type('tecnico@hiansa.com', { delay: 10 });
  await page.getByTestId('login-password').type('tecnico123', { delay: 10 });
  await page.getByTestId('login-submit').click();

  await page.waitForLoadState('networkidle');
  console.log('After tecnico login, URL:', page.url());

  if (page.url().includes('/dashboard')) {
    console.log('✓ tecnico@hiansa.com login successful');
  } else {
    console.log('✗ tecnico@hiansa.com login failed, URL:', page.url());
    const errorElement = page.getByTestId('login-error');
    if (await errorElement.isVisible()) {
      console.log('Error message:', await errorElement.textContent());
    }
  }

  // Logout
  await page.goto('/logout');
  await page.waitForTimeout(2000);

  // Test 2: new.user@example.com
  console.log('\nTesting new.user@example.com...');
  await page.goto('/login');
  await page.getByTestId('login-email').waitFor({ state: 'visible' });
  await page.getByTestId('login-email').clear();
  await page.getByTestId('login-password').clear();
  await page.getByTestId('login-email').type('new.user@example.com', { delay: 10 });
  await page.getByTestId('login-password').type('tempPassword123', { delay: 10 });
  await page.getByTestId('login-submit').click();

  await page.waitForLoadState('networkidle');
  console.log('After new.user login, URL:', page.url());

  if (page.url().includes('/cambiar-password')) {
    console.log('✓ new.user@example.com login successful and redirected to cambiar-password');
  } else if (page.url().includes('/dashboard')) {
    console.log('✓ new.user@example.com login successful but went to dashboard (unexpected)');
  } else if (page.url().includes('/login')) {
    console.log('✗ new.user@example.com login failed, stayed on login page');
    const errorElement = page.getByTestId('login-error');
    if (await errorElement.isVisible()) {
      console.log('Error message:', await errorElement.textContent());
    }
  } else {
    console.log('? new.user@example.com unexpected URL:', page.url());
  }
});
