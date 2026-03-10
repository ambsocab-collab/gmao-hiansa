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
    await page.getByTestId('login-email').fill(newUser.email);
    await page.getByTestId('login-password').fill(newUser.password);
    await page.getByTestId('login-submit').click();

    // Then: redirected to /change-password (NOT dashboard)
    await page.waitForURL('/cambiar-password', { timeout: 3000 });
    expect(page.url()).toContain('/cambiar-password');

    // And: see explanatory message
    await expect(page.getByText('Debes cambiar tu contraseña temporal en el primer acceso')).toBeVisible();
  });

  test('[P0-E2E-006] should block navigation to other routes until password is changed', async ({ page }) => {
    // Given: user with forcePasswordReset=true logged in
    await page.goto('/login');
    await page.getByTestId('login-email').fill('new.user@example.com');
    await page.getByTestId('login-password').fill('tempPassword123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/cambiar-password');

    // When: user tries to navigate to dashboard directly
    await page.goto('/dashboard');

    // Then: redirected back to /change-password
    await page.waitForURL('/cambiar-password', { timeout: 2000 });

    // And: see blocking message
    await expect(page.getByText(/debes cambiar tu contraseña|change your password/i)).toBeVisible();

    // When: user tries to navigate to other protected routes
    const protectedRoutes = ['/work-orders', '/assets', '/stock'];
    for (const route of protectedRoutes) {
      await page.goto(route);
      // Then: always redirected back to /change-password
      await page.waitForURL('/cambiar-password', { timeout: 2000 });
    }
  });

  test('[P0-E2E-007] should allow password change and redirect to dashboard', async ({ page }) => {
    // Given: user on /change-password with forcePasswordReset=true
    await page.goto('/login');
    await page.getByTestId('login-email').fill('new.user@example.com');
    await page.getByTestId('login-password').fill('tempPassword123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/cambiar-password');

    // When: user fills password change form
    await page.getByTestId('current-password').fill('tempPassword123');
    await page.getByTestId('new-password').fill('NewSecure123');
    await page.getByTestId('confirm-password').fill('NewSecure123');
    await page.getByTestId('change-password-submit').click();

    // Then: see success message
    await expect(page.getByText('Contraseña cambiada exitosamente')).toBeVisible();

    // And: redirected to dashboard
    await page.waitForURL('/dashboard', { timeout: 3000 });

    // And: can now access dashboard and other routes
    await expect(page.getByText(/Dashboard|Panel/i)).toBeVisible();
  });

  test('[P0-E2E-008] should validate password strength on change', async ({ page }) => {
    // Given: user on /change-password
    await page.goto('/login');
    await page.getByTestId('login-email').fill('new.user@example.com');
    await page.getByTestId('login-password').fill('tempPassword123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/cambiar-password');

    // When: user enters weak password (less than 8 characters)
    await page.getByTestId('current-password').fill('tempPassword123');
    await page.getByTestId('new-password').fill('weak');
    await page.getByTestId('confirm-password').fill('weak');
    await page.getByTestId('change-password-submit').click();

    // Then: validation error shown
    await expect(page.getByText(/Mínimo 8 caracteres|at least 8 characters/i)).toBeVisible();

    // When: user enters password without uppercase
    await page.getByTestId('new-password').fill('weakpassword123');
    await page.getByTestId('confirm-password').fill('weakpassword123');
    await page.getByTestId('change-password-submit').click();

    // Then: validation error shown
    await expect(page.getByText(/mayúscula|uppercase/i)).toBeVisible();

    // When: user enters password without number
    await page.getByTestId('new-password').fill('Weakpassword');
    await page.getByTestId('confirm-password').fill('Weakpassword');
    await page.getByTestId('change-password-submit').click();

    // Then: validation error shown
    await expect(page.getByText(/número|number/i)).toBeVisible();
  });
});
