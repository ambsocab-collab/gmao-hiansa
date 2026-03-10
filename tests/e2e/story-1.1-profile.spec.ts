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

// Note: These tests will use loginAs fixture when fully implemented
// For now, they document the expected behavior

test.describe('Story 1.1: User Profile Management', () => {

  test('[P0-E2E-009] should display user profile with current information', async ({ page }) => {
    // Given: authenticated user (using tecnico from seed)
    await page.goto('/login');
    await page.getByTestId('login-email').fill('tecnico@hiansa.com');
    await page.getByTestId('login-password').fill('tecnico123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard', { timeout: 3000 });

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
    // Given: authenticated user (using tecnico from seed)
    await page.goto('/login');
    await page.getByTestId('login-email').fill('tecnico@hiansa.com');
    await page.getByTestId('login-password').fill('tecnico123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard', { timeout: 3000 });

    await page.goto('/perfil');

    // When: user clicks edit and updates profile
    await page.getByTestId('edit-profile-button').click();
    await page.getByTestId('profile-name').fill('Carlos Rodríguez');
    await page.getByTestId('profile-phone').fill('+34 612 345 678');
    await page.getByTestId('save-profile-button').click();

    // Then: see success message
    await expect(page.getByText(/perfil actualizado|profile updated/i)).toBeVisible();

    // And: updated information is displayed
    await expect(page.getByTestId('profile-name')).toHaveValue('Carlos Rodríguez');
    await expect(page.getByTestId('profile-phone')).toHaveValue('+34 612 345 678');
  });

  test('[P0-E2E-011] should allow user to change password from profile', async ({ page }) => {
    // Given: authenticated user (using supervisor from seed)
    await page.goto('/login');
    await page.getByTestId('login-email').fill('supervisor@hiansa.com');
    await page.getByTestId('login-password').fill('supervisor123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard', { timeout: 3000 });

    await page.goto('/perfil');

    // When: user opens password change form
    await page.getByTestId('change-password-button').click();

    // Then: see password change form
    await expect(page.getByTestId('cambiar-password-form')).toBeVisible();
    await expect(page.getByTestId('current-password')).toBeVisible();
    await expect(page.getByTestId('new-password')).toBeVisible();
    await expect(page.getByTestId('confirm-password')).toBeVisible();

    // When: user changes password
    await page.getByTestId('current-password').fill('supervisor123');
    await page.getByTestId('new-password').fill('NewPassword123');
    await page.getByTestId('confirm-password').fill('NewPassword123');
    await page.getByTestId('change-password-submit').click();

    // Then: see success message
    await expect(page.getByText('Contraseña cambiada exitosamente')).toBeVisible();
  });
});
