/**
 * E2E Tests: Admin User Management
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * P0-E2E-012 to P0-E2E-014
 *
 * Tests cover:
 * - Admin creates new user with default capability
 * - Admin assigns multiple capabilities to user
 * - Admin performs soft delete and verifies login blocking
 */

import { test, expect } from '@playwright/test';

// Note: These tests will use loginAs('admin') fixture when fully implemented
// For now, they document the expected behavior

test.describe('Story 1.1: Admin User Management', () => {

  test('[P0-E2E-012] should allow admin to create new user with default capability', async ({ page }) => {
    // Given: admin user with can_manage_users capability (from seed: admin@hiansa.com)
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@hiansa.com');
    await page.getByTestId('login-password').fill('admin123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard', { timeout: 3000 });

    // When: admin navigates to user creation page
    await page.goto('/usuarios/nuevo');

    // Then: see registration form
    await expect(page.getByTestId('registro-form')).toBeVisible();
    await expect(page.getByTestId('registro-nombre')).toBeVisible();
    await expect(page.getByTestId('registro-email')).toBeVisible();
    await expect(page.getByTestId('registro-telefono')).toBeVisible();
    await expect(page.getByTestId('registro-password')).toBeVisible();

    // And: see 15 capability checkboxes
    await expect(page.getByTestId('capability-checkboxes')).toBeVisible();
    const checkboxes = page.locator('[data-testid^="capability-"]');
    await expect(checkboxes).toHaveCount(15);

    // When: admin fills form and creates user
    await page.getByTestId('registro-nombre').fill('María González');
    await page.getByTestId('registro-email').fill('maria.gonzalez@example.com');
    await page.getByTestId('registro-telefono').fill('+34 623 456 789');
    await page.getByTestId('registro-password').fill('TempPassword123');
    // Note: No capabilities selected - should default to can_create_failure_report
    await page.getByTestId('registro-submit').click();

    // Then: see success message
    await expect(page.getByText(/usuario creado|user created/i)).toBeVisible();

    // And: new user has only can_create_failure_report capability by default
    // This would be verified via API check or database query
  });

  test('[P0-E2E-013] should allow admin to assign multiple capabilities to user', async ({ page }) => {
    // Given: admin user
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@hiansa.com');
    await page.getByTestId('login-password').fill('admin123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard', { timeout: 3000 });

    await page.goto('/usuarios/nuevo');

    // When: admin selects multiple capabilities
    await page.getByTestId('capability-can_view_work_orders').check();
    await page.getByTestId('capability-can_create_work_orders').check();
    await page.getByTestId('capability-can_complete_work_orders').check();

    // And: fills user details
    await page.getByTestId('registro-nombre').fill('Técnico Avanzado');
    await page.getByTestId('registro-email').fill('tecnico.avanzado@example.com');
    await page.getByTestId('registro-password').fill('TempPassword123');
    await page.getByTestId('registro-submit').click();

    // Then: user created with selected capabilities
    await expect(page.getByText(/usuario creado/i)).toBeVisible();

    // And: user can access work orders (verified by navigating)
    // Login as new user and verify access
    await page.getByTestId('logout-button').click();

    await page.goto('/login');
    await page.getByTestId('login-email').fill('tecnico.avanzado@example.com');
    await page.getByTestId('login-password').fill('TempPassword123');
    await page.getByTestId('login-submit').click();

    // Should be redirected to /cambiar-password first (forcePasswordReset)
    await page.waitForURL('/cambiar-password');

    // Change password to continue
    await page.getByTestId('current-password').fill('TempPassword123');
    await page.getByTestId('new-password').fill('NewPassword123');
    await page.getByTestId('confirm-password').fill('NewPassword123');
    await page.getByTestId('change-password-submit').click();

    await page.waitForURL('/dashboard');

    // Now try to access work orders
    await page.goto('/work-orders');
    await expect(page.getByText(/Órdenes de Trabajo|Work Orders/i)).toBeVisible();
  });

  test('[P0-E2E-014] should perform soft delete and prevent login', async ({ page }) => {
    // Given: admin user
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@hiansa.com');
    await page.getByTestId('login-password').fill('admin123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard', { timeout: 3000 });

    const testUserId = 'user-to-delete';

    // When: admin navigates to user page and clicks delete
    await page.goto(`/usuarios/${testUserId}`);
    await page.getByTestId('delete-user-button').click();

    // Then: confirmation modal shown
    await expect(page.getByTestId('delete-confirmation-modal')).toBeVisible();
    await expect(page.getByText(/¿Estás seguro de eliminar/i)).toBeVisible();

    // When: admin confirms deletion
    await page.getByTestId('confirm-delete-button').click();

    // Then: success message shown
    await expect(page.getByText(/usuario eliminado/i)).toBeVisible();

    // And: audit log created (verified via API or admin panel)
    await expect(page.getByText(/Usuario.*eliminado por/i)).toBeVisible();

    // When: deleted user attempts login
    await page.goto('/login');
    await page.getByTestId('login-email').fill('deleted.user@example.com');
    await page.getByTestId('login-password').fill('password123');
    await page.getByTestId('login-submit').click();

    // Then: login blocked with appropriate message
    await expect(page.getByText(/usuario eliminado|account deleted/i)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('[P0-E2E-014] should show deleted users in admin list with indicator', async ({ page }) => {
    // Given: admin user
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@hiansa.com');
    await page.getByTestId('login-password').fill('admin123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard', { timeout: 3000 });

    // When: admin navigates to users list
    await page.goto('/usuarios');

    // Then: see list of users
    await expect(page.getByTestId('user-list')).toBeVisible();

    // And: deleted users have visual indicator
    const deletedUserCard = page.locator('[data-testid="user-card-deleted-user@example.com"]');
    await expect(deletedUserCard).toBeVisible();

    // And: indicator shows "Eliminado" or similar
    await expect(deletedUserCard.getByText(/Eliminado|Deleted/i)).toBeVisible();

    // And: deleted user has "Restaurar" (Restore) button
    await expect(deletedUserCard.getByTestId('restore-user-button')).toBeVisible();
  });
});
