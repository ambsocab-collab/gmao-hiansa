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

  test('[P0-E2E-005] should redirect to /change-password when forcePasswordReset is true', async ({ page }) => {
    // Given: user with forcePasswordReset=true (from seed: new.user@example.com)
    const newUser = {
      email: 'new.user@example.com',
      password: 'tempPassword123',
      forcePasswordReset: true
    };

    // When: user attempts login
    await page.goto('/login');

    // Wait for form and clear fields
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();

    // Type credentials for reliability
    await page.getByTestId('login-email').type(newUser.email, { delay: 10 });
    await page.getByTestId('login-password').type(newUser.password, { delay: 10 });
    await page.getByTestId('login-submit').click();

    // Then: redirected to /change-password (NOT dashboard)
    // Wait for either cambiar-password page or error page
    await page.waitForLoadState('networkidle');

    // Check if we're on cambiar-password page
    const currentUrl = page.url();
    if (currentUrl.includes('/cambiar-password')) {
      // And: see explanatory message
      await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso')).toBeVisible();
    } else if (currentUrl.includes('/login')) {
      // Login failed - check for error message
      const errorElement = page.getByTestId('login-error');
      if (await errorElement.isVisible()) {
        throw new Error(`Login failed: ${await errorElement.textContent()}`);
      }
      throw new Error('Login failed but no error message shown');
    } else {
      throw new Error(`Unexpected redirect to: ${currentUrl}`);
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
    await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso')).toBeVisible({ timeout: 10000 });

    // When: user tries to navigate to dashboard directly
    await page.goto('/dashboard');

    // Then: redirected back to /change-password
    await expect(page.getByText(/debes cambiar tu contraseña|change your password/i)).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/cambiar-password');

    // When: user tries to navigate to other protected routes
    const protectedRoutes = ['/work-orders', '/assets', '/stock'];
    for (const route of protectedRoutes) {
      await page.goto(route);
      // Then: always redirected back to /change-password
      await expect(page.getByText(/debes cambiar tu contraseña|change your password/i)).toBeVisible({ timeout: 5000 });
      expect(page.url()).toContain('/cambiar-password');
    }
  });

  test('[P0-E2E-007] should allow password change and redirect to dashboard', async ({ page }) => {
    // Given: user on /change-password with forcePasswordReset=true
    await page.goto('/login');

    // Wait for form and clear fields
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();

    await page.getByTestId('login-email').type('new.user@example.com', { delay: 10 });
    await page.getByTestId('login-password').type('tempPassword123', { delay: 10 });
    await page.getByTestId('login-submit').click();

    // Wait for cambiar-password page to load
    await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso')).toBeVisible({ timeout: 10000 });

    // When: user fills password change form
    await page.getByTestId('current-password').type('tempPassword123', { delay: 10 });
    await page.getByTestId('new-password').type('NewSecure123', { delay: 10 });
    await page.getByTestId('confirm-password').type('NewSecure123', { delay: 10 });
    await page.getByTestId('change-password-submit').click();

    // Then: see success message
    await expect(page.getByText('Contraseña cambiada exitosamente')).toBeVisible({ timeout: 5000 });

    // And: redirected to dashboard - wait for content
    await expect(page.getByText(/Dashboard|Hola/i)).toBeVisible({ timeout: 10000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('[P0-E2E-008] should validate password strength on change', async ({ page }) => {
    // Given: user on /change-password
    await page.goto('/login');

    // Wait for form and clear fields
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();

    await page.getByTestId('login-email').type('new.user@example.com', { delay: 10 });
    await page.getByTestId('login-password').type('tempPassword123', { delay: 10 });
    await page.getByTestId('login-submit').click();

    // Wait for cambiar-password page to load
    await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso')).toBeVisible({ timeout: 10000 });

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
