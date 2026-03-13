/**
 * E2E Tests: User Profile Management
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * P0-E2E-009 to P0-E2E-011
 *
 * Tests cover:
 * - Display user profile with current information
 * - Allow user to edit own profile
 * - Allow user to change password from profile
 */

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/es';
import { loginAsTecnico, loginAsAdmin, loginAs, logout } from '../helpers/auth.helpers';

test.describe('Story 1.1: User Profile Management', () => {
  // Ensure clean session before each test
  test.beforeEach(async ({ page }) => {
    // Clear cookies to ensure clean session state
    await page.context().clearCookies()
  })

  test('[P0-E2E-009] should display user profile with current information', async ({ page }) => {
    // Given: authenticated user (using tecnico from seed)
    // This test only reads, no modification - can use shared seed user
    await loginAsTecnico(page);

    // When: user navigates to profile
    await page.goto('/perfil');

    // Then: see profile form with current data
    await expect(page.getByTestId('perfil-form')).toBeVisible();

    // And: see current name, email, phone
    await expect(page.getByTestId('profile-name')).toBeVisible();
    await expect(page.getByTestId('profile-email')).toBeVisible();
    await expect(page.getByTestId('profile-phone')).toBeVisible();

    // And: see edit button
    await expect(page.getByTestId('edit-profile-button')).toBeVisible();
  });

  test('[P0-E2E-010] should allow user to edit own profile', async ({ page }) => {
    // Generate unique email using faker.js (deterministic)
    const uniqueEmail = `test-${faker.string.uuid()}@example.com`;
    const tempPassword = 'TempPassword123';

    // Create test user via admin (login as admin first)
    await loginAsAdmin(page);

    // Create unique user
    await page.goto('/usuarios/nuevo');
    await page.getByTestId('register-name').fill('Usuario Perfil Test');
    await page.getByTestId('register-email').fill(uniqueEmail);
    await page.getByTestId('register-password').fill(tempPassword);
    await page.getByTestId('register-confirm-password').fill(tempPassword);
    await page.getByTestId('register-submit').click();
    await page.waitForURL('**/usuarios', { timeout: 30000 });

    // Logout and login as test user
    await logout(page);
    await page.goto('/login');
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();
    await page.getByTestId('login-email').type(uniqueEmail, { delay: 10 });
    await page.getByTestId('login-password').type(tempPassword, { delay: 10 });
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/cambiar-password', { timeout: 15000 });

    // Change password to remove forcePasswordReset
    await page.getByTestId('current-password').fill(tempPassword);
    await page.getByTestId('new-password').fill('NewPassword123');
    await page.getByTestId('confirm-password').fill('NewPassword123');
    await page.getByTestId('change-password-submit').click();
    await page.waitForURL('/login', { timeout: 10000 });

    // Login again with new password
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();
    await page.getByTestId('login-email').type(uniqueEmail, { delay: 10 });
    await page.getByTestId('login-password').type('NewPassword123', { delay: 10 });
    await page.getByTestId('login-submit').click();
    await expect(page.getByText(/Hola, /).first()).toBeVisible({ timeout: 15000 });

    await page.goto('/perfil');

    // When: user clicks edit and updates profile
    await page.getByTestId('edit-profile-button').click();
    await page.getByTestId('profile-name').fill('Carlos Rodríguez');
    await page.getByTestId('profile-phone').fill('+34612345678');
    await page.getByTestId('save-profile-button').click();

    // Then: see success message
    await expect(page.getByText(/Perfil actualizado exitosamente/i)).toBeVisible();

    // And: updated information is displayed
    await expect(page.getByTestId('profile-name')).toHaveValue('Carlos Rodríguez');
    await expect(page.getByTestId('profile-phone')).toHaveValue('+34612345678');
  });

  test('[P0-E2E-011] should allow user to change password from profile', async ({ page }) => {
    // Generate unique email using faker.js (deterministic)
    const uniqueEmail = `test-${faker.string.uuid()}@example.com`;
    const tempPassword = 'TempPassword123';

    // Create test user via admin (login as admin first)
    await loginAsAdmin(page);

    // Create unique user
    await page.goto('/usuarios/nuevo');
    await page.getByTestId('register-name').fill('Usuario Password Test');
    await page.getByTestId('register-email').fill(uniqueEmail);
    await page.getByTestId('register-password').fill(tempPassword);
    await page.getByTestId('register-confirm-password').fill(tempPassword);
    await page.getByTestId('register-submit').click();
    await page.waitForURL('**/usuarios', { timeout: 30000 });

    // Logout and login as test user
    await logout(page);
    await page.goto('/login');
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').clear();
    await page.getByTestId('login-password').clear();
    await page.getByTestId('login-email').type(uniqueEmail, { delay: 10 });
    await page.getByTestId('login-password').type(tempPassword, { delay: 10 });
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/cambiar-password', { timeout: 15000 });

    // Change password to remove forcePasswordReset
    await page.getByTestId('current-password').fill(tempPassword);
    await page.getByTestId('new-password').fill('InitialPassword123');
    await page.getByTestId('confirm-password').fill('InitialPassword123');
    await page.getByTestId('change-password-submit').click();
    await page.waitForURL('/login', { timeout: 10000 });

    // Login again with initial password
    await page.getByTestId('login-email').type(uniqueEmail, { delay: 10 });
    await page.getByTestId('login-password').type('InitialPassword123', { delay: 10 });
    await page.getByTestId('login-submit').click();
    await expect(page.getByText(/Hola, /).first()).toBeVisible({ timeout: 15000 });

    await page.goto('/perfil');

    // When: user opens password change form
    await page.getByTestId('change-password-button').click();

    // Then: see password change form
    await expect(page.getByTestId('cambiar-password-form')).toBeVisible();
    await expect(page.getByTestId('current-password')).toBeVisible();
    await expect(page.getByTestId('new-password')).toBeVisible();
    await expect(page.getByTestId('confirm-password')).toBeVisible();

    // When: user changes password
    await page.getByTestId('current-password').clear();
    await page.getByTestId('new-password').clear();
    await page.getByTestId('confirm-password').clear();
    await page.getByTestId('current-password').type('InitialPassword123', { delay: 10 });
    await page.getByTestId('new-password').type('NewPassword123', { delay: 10 });
    await page.getByTestId('confirm-password').type('NewPassword123', { delay: 10 });
    await page.getByTestId('change-password-submit').click();

    // Then: see success message
    await expect(page.getByText('Contraseña cambiada exitosamente').first()).toBeVisible();
  });
});
