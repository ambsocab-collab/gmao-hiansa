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
import { faker } from '@faker-js/faker/locale/es';
import { loginAsAdmin, loginAs, logout } from '../helpers/auth.helpers';

// Note: These tests will use loginAs('admin') fixture when fully implemented
// For now, they document the expected behavior

test.describe('Story 1.1: Admin User Management', () => {
  // Ensure clean session before each test
  test.beforeEach(async ({ page }) => {
    // Clear cookies to ensure clean session state
    await page.context().clearCookies()
  })

  // Track created users for cleanup
  const createdUserEmails: string[] = [];

  test.afterAll(async ({ request }) => {
    // Cleanup: Delete all test users created during this test suite
    for (const email of createdUserEmails) {
      try {
        // Get user by email to find ID
        const searchResponse = await request.get(`http://localhost:3000/api/v1/users?email=${encodeURIComponent(email)}`);
        if (searchResponse.ok()) {
          const users = await searchResponse.json();
          if (users && users.length > 0 && users[0].id) {
            await request.delete(`http://localhost:3000/api/v1/users/${users[0].id}`);
            console.log(`Cleaned up test user: ${email}`);
          }
        }
      } catch (error) {
        console.warn(`Failed to cleanup test user ${email}:`, error);
      }
    }
    createdUserEmails.length = 0;
  });

  test('[P0-E2E-012] should allow admin to create new user with default capability', async ({ page, request }) => {
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });

    // Intercept API responses to see error details
    page.on('response', async response => {
      if (response.url().includes('/api/v1/users') && response.status() === 400) {
        try {
          const body = await response.json();
          console.log('API Error Response:', body);
        } catch {
          console.log('API Error Response: [unreadable]');
        }
      }
    });

    // Generate unique email using faker.js (deterministic)
    const uniqueEmail = `test-${faker.string.uuid()}@example.com`;
    createdUserEmails.push(uniqueEmail); // Track for cleanup

    // Given: admin user with can_manage_users capability (from seed: admin@hiansa.com)
    await loginAsAdmin(page);

    // When: admin navigates to user creation page
    await page.goto('/usuarios/nuevo');

    // Then: see registration form
    await expect(page.getByTestId('register-form')).toBeVisible();
    await expect(page.getByTestId('register-name')).toBeVisible();
    await expect(page.getByTestId('register-email')).toBeVisible();
    await expect(page.getByTestId('register-phone')).toBeVisible();
    await expect(page.getByTestId('register-password')).toBeVisible();

    // And: see capability checkboxes (15 from database + 1 from component)
    await expect(page.getByTestId('capability-checkboxes')).toBeVisible();
    const checkboxes = page.locator('[data-testid^="capability-"]');
    await expect(checkboxes).toHaveCount(16); // 15 capabilities from DB

    // When: admin fills form and creates user
    await page.getByTestId('register-name').fill('María González');
    await page.getByTestId('register-email').fill(uniqueEmail);
    await page.getByTestId('register-phone').fill('+34623456789');
    await page.getByTestId('register-password').fill('TempPassword123');
    await page.getByTestId('register-confirm-password').fill('TempPassword123');
    await page.getByTestId('register-submit').click();

    // Then: redirected to users list after successful creation
    await page.waitForURL('**/usuarios', { timeout: 30000 });
    expect(page.url()).toContain('/usuarios');
  });

  test('[P0-E2E-013] should allow admin to assign multiple capabilities to user', async ({ page }) => {
    // Generate unique email using faker.js (deterministic)
    const uniqueEmail = `test-${faker.string.uuid()}@example.com`;
    createdUserEmails.push(uniqueEmail); // Track for cleanup

    // Given: admin user
    await loginAsAdmin(page);
    await page.goto('/usuarios/nuevo');

    // When: admin selects multiple capabilities
    await page.getByTestId('capability-can_view_all_ots').check();
    await page.getByTestId('capability-can_create_manual_ot').check();
    await page.getByTestId('capability-can_complete_ot').check();

    // And: fills user details
    await page.getByTestId('register-name').fill('Técnico Avanzado');
    await page.getByTestId('register-email').fill(uniqueEmail);
    await page.getByTestId('register-password').fill('TempPassword123');
    await page.getByTestId('register-confirm-password').fill('TempPassword123');
    await page.getByTestId('register-submit').click();

    // Then: redirected to users list after successful creation
    await page.waitForURL('**/usuarios', { timeout: 30000 });
    expect(page.url()).toContain('/usuarios');

    // And: user can access work orders (verified by navigating)
    // Login as new user and verify access
    await logout(page);

    await page.goto('/login');
    await page.getByTestId('login-email').fill(uniqueEmail);
    await page.getByTestId('login-password').fill('TempPassword123');
    await page.getByTestId('login-submit').click();

    // Should be redirected to /cambiar-password first (forcePasswordReset)
    await page.waitForURL('/cambiar-password');

    // Change password to continue
    await page.getByTestId('current-password').fill('TempPassword123');
    await page.getByTestId('new-password').fill('NewPassword123');
    await page.getByTestId('confirm-password').fill('NewPassword123');
    await page.getByTestId('change-password-submit').click();

    // After password change, user is logged out and needs to login again with new password
    await page.waitForURL('/login');
    await page.getByTestId('login-email').fill(uniqueEmail);
    await page.getByTestId('login-password').fill('NewPassword123');
    await page.getByTestId('login-submit').click();

    // Now should be redirected to dashboard
    await page.waitForURL('/dashboard');
    // TODO: Verify user can access work orders when that feature is implemented
  });

  test('[P0-E2E-014] should perform soft delete and prevent login', async ({ page }) => {
    // Generate unique email using faker.js (deterministic)
    const uniqueEmail = `test-${faker.string.uuid()}@example.com`;
    const tempPassword = 'TempPassword123';
    createdUserEmails.push(uniqueEmail); // Track for cleanup (though this test deletes the user itself)

    // Given: admin user
    await loginAsAdmin(page);

    // Create a test user to delete
    await page.goto('/usuarios/nuevo');
    await page.getByTestId('register-name').fill('Usuario Para Eliminar');
    await page.getByTestId('register-email').fill(uniqueEmail);
    await page.getByTestId('register-password').fill(tempPassword);
    await page.getByTestId('register-confirm-password').fill(tempPassword);
    await page.getByTestId('register-submit').click();
    await page.waitForURL('**/usuarios', { timeout: 30000 });

    // Get the user ID from the first user link in the list
    const userLink = page.locator('[data-testid="user-list"] a').first();
    const href = await userLink.getAttribute('href');
    const testUserId = href?.split('/').pop() || '';

    // When: admin navigates to user page and clicks delete
    await page.goto(`/usuarios/${testUserId}`);
    await page.getByTestId('delete-user-button').click();

    // Then: confirmation modal shown
    await expect(page.getByTestId('delete-confirmation-modal')).toBeVisible();
    await expect(page.getByText(/¿Estás seguro de eliminar/i)).toBeVisible();

    // When: admin confirms deletion
    await page.getByTestId('confirm-delete-button').click();

    // Then: redirected back to users list after deletion
    await page.waitForURL('**/usuarios', { timeout: 10000 });
    expect(page.url()).toContain('/usuarios');

    // When: deleted user attempts login
    await page.goto('/login');
    await page.getByTestId('login-email').fill(uniqueEmail);
    await page.getByTestId('login-password').fill(tempPassword);
    await page.getByTestId('login-submit').click();

    // Then: login blocked with appropriate message
    await expect(page.getByText(/usuario ha sido eliminado|eliminado/i)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('[P0-E2E-015] should show users list with admin capabilities', async ({ page }) => {
    // Given: admin user
    await loginAsAdmin(page);

    // When: admin navigates to users list
    await page.goto('/usuarios');

    // Then: see list of users (excluding deleted users)
    await expect(page.getByTestId('user-list')).toBeVisible();

    // And: see at least the seeded users (admin, tecnico, supervisor)
    const userLinks = page.locator('[data-testid="user-list"] a');
    const count = await userLinks.count();
    expect(count).toBeGreaterThanOrEqual(3); // At least 3 seeded users
  });
});
