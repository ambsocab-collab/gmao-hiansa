/**
 * E2E Tests: Forced Password Reset Flow
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * P0-E2E-005 to P0-E2E-008
 *
 * Tests cover:
 * - Redirect to /cambiar-password when forcePasswordReset is true
 * - Navigation blocking until password is changed
 * - Password change success and redirect
 * - Password strength validation
 */

import { test, expect } from '@playwright/test';

test.describe('Story 1.1: Forced Password Reset Flow', () => {
  // Reset test user before each test to ensure clean state
  test.beforeEach(async ({ request }) => {
    await request.post('http://localhost:3000/api/v1/test/reset-user', {
      data: { email: 'new.user@example.com' }
    })
  })

  test('[P0-E2E-005] should redirect to /change-password when forcePasswordReset is true', async ({ page }) => {
    // Given: user with forcePasswordReset=true (from seed: new.user@example.com)
    const newUser = {
      email: 'new.user@example.com',
      password: 'tempPassword123',
      forcePasswordReset: true
    };

    // When: user attempts login
    await page.goto('/login');

    // Wait for form and clear fields (using same pattern as login-auth tests)
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();

    // Type credentials for reliability (using delay for better reliability)
    await page.getByTestId('login-email').type(newUser.email, { delay: 10 });
    await page.getByTestId('login-password').type(newUser.password, { delay: 10 });

    // Click submit and wait for response
    await page.getByTestId('login-submit').click();

    // Wait a moment for the login request to complete
    await page.waitForTimeout(2000);

    // Debug: log current URL and check for error messages
    const currentUrl = page.url();
    console.log('After login, current URL:', currentUrl);

    // Check if there's an error message
    const errorElement = page.getByTestId('login-error');
    const hasError = await errorElement.isVisible().catch(() => false);
    if (hasError) {
      const errorText = await errorElement.textContent();
      console.log('Error message:', errorText);
    }

    // Check if we're on cambiar-password page
    if (currentUrl.includes('/cambiar-password')) {
      // Then: see explanatory message
      await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso').first()).toBeVisible();

      // And: see the change password form
      await expect(page.getByTestId('current-password')).toBeVisible();
      await expect(page.getByTestId('new-password')).toBeVisible();
      await expect(page.getByTestId('confirm-password')).toBeVisible();
    } else {
      throw new Error(`Expected to be on /cambiar-password, but on ${currentUrl}`);
    }
  });

  test('[P0-E2E-006] should block navigation to other routes until password is changed', async ({ page }) => {
    // Given: user with forcePasswordReset=true logged in
    await page.goto('/login');

    // Wait for form and clear fields
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();

    await page.getByTestId('login-email').type('new.user@example.com', { delay: 10 });
    await page.getByTestId('login-password').type('tempPassword123', { delay: 10 });
    await page.getByTestId('login-submit').click();

    // Wait for cambiar-password page to load
    await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso').first()).toBeVisible({ timeout: 15000 });

    // When: user tries to navigate to dashboard directly
    await page.goto('/dashboard');

    // Then: redirected back to /cambiar-password
    await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso').first()).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/cambiar-password');

    // When: user tries to navigate to other protected routes
    const protectedRoutes = ['/work-orders', '/assets', '/stock'];
    for (const route of protectedRoutes) {
      await page.goto(route);
      // Then: always redirected back to /cambiar-password
      await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso').first()).toBeVisible({ timeout: 5000 });
      expect(page.url()).toContain('/cambiar-password');
    }
  });

  test('[P0-E2E-007] should allow password change and redirect to dashboard', async ({ page }) => {
    // Intercept the password change API call to log response
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('response', async response => {
      if (response.url().includes('/change-password')) {
        console.log('Change password API response status:', response.status());
        try {
          const body = await response.text();
          console.log('Change password API response body:', body);
        } catch (e) {
          console.log('Change password API response body: [unreadable]');
        }
      }
    });

    // Given: user on /cambiar-password with forcePasswordReset=true
    await page.goto('/login');

    // Wait for form and clear fields
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();

    await page.getByTestId('login-email').type('new.user@example.com', { delay: 10 });
    await page.getByTestId('login-password').type('tempPassword123', { delay: 10 });
    await page.getByTestId('login-submit').click();

    // Wait for cambiar-password page to load
    await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso').first()).toBeVisible({ timeout: 15000 });

    // When: user fills password change form
    await page.getByTestId('current-password').clear();
    await page.getByTestId('new-password').clear();
    await page.getByTestId('confirm-password').clear();

    await page.getByTestId('current-password').type('tempPassword123', { delay: 10 });
    await page.getByTestId('new-password').type('NewSecure123', { delay: 10 });
    await page.getByTestId('confirm-password').type('NewSecure123', { delay: 10 });

    // Check if button is enabled and clickable
    const submitButton = page.getByTestId('change-password-submit');
    const isEnabled = await submitButton.isEnabled();
    console.log('Submit button enabled:', isEnabled);

    await submitButton.click();

    // Then: redirected to login page (session refreshed after password change)
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');

    // When: user logs in again with new password
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();
    await page.getByTestId('login-email').type('new.user@example.com', { delay: 10 });
    await page.getByTestId('login-password').type('NewSecure123', { delay: 10 });
    await page.getByTestId('login-submit').click();

    // Then: redirected to dashboard (forcePasswordReset is now false)
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // And: see dashboard content
    await expect(page.getByText(/Dashboard/i).first()).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('[P0-E2E-008] should validate password strength on change', async ({ page }) => {
    // Given: user on /cambiar-password
    await page.goto('/login');

    // Wait for form and clear fields
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();

    await page.getByTestId('login-email').type('new.user@example.com', { delay: 10 });
    await page.getByTestId('login-password').type('tempPassword123', { delay: 10 });
    await page.getByTestId('login-submit').click();

    // Wait for cambiar-password page to load
    await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso').first()).toBeVisible({ timeout: 15000 });

    // When: user enters weak password (less than 8 characters)
    await page.getByTestId('current-password').clear();
    await page.getByTestId('new-password').clear();
    await page.getByTestId('confirm-password').clear();

    await page.getByTestId('current-password').type('tempPassword123', { delay: 10 });
    await page.getByTestId('new-password').type('weak', { delay: 10 });
    await page.getByTestId('confirm-password').type('weak', { delay: 10 });
    await page.getByTestId('change-password-submit').click();

    // Then: validation error shown
    await expect(page.getByText(/Mínimo 8 caracteres|at least 8 caracteres/i).first()).toBeVisible({ timeout: 2000 });

    // When: user enters password without uppercase
    await page.getByTestId('new-password').clear();
    await page.getByTestId('confirm-password').clear();

    await page.getByTestId('new-password').type('weakpassword123', { delay: 10 });
    await page.getByTestId('confirm-password').type('weakpassword123', { delay: 10 });
    await page.getByTestId('change-password-submit').click();

    // Then: validation error shown
    await expect(page.getByText(/mayúscula|uppercase/i).first()).toBeVisible({ timeout: 2000 });

    // When: user enters password without number
    await page.getByTestId('new-password').clear();
    await page.getByTestId('confirm-password').clear();

    await page.getByTestId('new-password').type('Weakpassword', { delay: 10 });
    await page.getByTestId('confirm-password').type('Weakpassword', { delay: 10 });
    await page.getByTestId('change-password-submit').click();

    // Then: validation error shown
    await expect(page.getByText(/número|number/i).first()).toBeVisible({ timeout: 2000 });
  });
});
